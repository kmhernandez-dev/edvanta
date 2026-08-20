/**
 * ============================================================
 *  EDVANTA — LANDINGS DE HERRAMIENTAS
 *
 *  Cada landing PRESENTA una herramienta (no es el workspace).
 *  El CTA "Empezar" lleva a la herramienta REAL ya existente en
 *  el proyecto (landing ≠ workspace). No se inventa funcionalidad:
 *  el copy describe lo que la herramienta hace de verdad.
 *
 *  kind (patrón UX, punto 22): builder | analyzer | wizard |
 *       generator | explorer | library | dashboard
 *  cta.to  → ruta/anchor REAL del workspace.
 *  relatedMeta → alimenta el motor de relacionados (ecosistema).
 * ============================================================
 */

export const HERRAMIENTAS = [
  {
    slug: 'cv-builder',
    kind: 'builder',
    icon: 'file',
    nav: 'Creador de hoja de vida',
    eyebrow: 'Herramienta Edvanta',
    h1: 'Construye una hoja de vida lista para el sector farmacéutico',
    tagline:
      'Un creador guiado con formato ATS 2026: escribes por secciones, ves tu puntaje de compatibilidad en vivo y descargas un PDF legible por máquinas.',
    cta: { label: 'Empezar mi hoja de vida', to: '/empleo#creador' },
    canDo: [
      'Completar tu hoja de vida por secciones (perfil, experiencia, formación, habilidades).',
      'Ver un puntaje de compatibilidad ATS mientras editas.',
      'Adaptar el contenido al cargo al que te postulas.',
      'Descargar un PDF con texto seleccionable (no imagen) que los filtros leen bien.',
    ],
    steps: [
      { title: 'Completa tu información', text: 'Llenas cada sección con ayuda de ejemplos del sector farmacéutico.' },
      { title: 'Edvanta la organiza y puntúa', text: 'El creador estructura tu HV en formato ATS y calcula tu puntaje en vivo.' },
      { title: 'Descarga y postúlate', text: 'Exportas tu PDF y lo usas para postular con más probabilidades de pasar el filtro.' },
    ],
    audience: ['Recién egresados de Química Farmacéutica', 'Profesionales que buscan empleo o cambio', 'Practicantes y técnicos del sector salud'],
    outcome: 'Una hoja de vida clara, con formato ATS y logros medibles, lista para descargar y enviar.',
    relatedMeta: { areaIds: [], tags: ['empleabilidad'] },
    seo: {
      title: 'Creador de hoja de vida ATS para farmacéuticos | Edvanta',
      description: 'Crea tu hoja de vida con formato ATS 2026, puntaje de compatibilidad en vivo, adaptación al cargo y descarga en PDF. Herramienta gratuita de Edvanta.',
      keywords: ['crear hoja de vida', 'hoja de vida ATS', 'CV químico farmacéutico', 'plantilla hoja de vida farmacia'],
    },
  },
  {
    slug: 'analizador-ats',
    kind: 'analyzer',
    icon: 'scan',
    nav: 'Analizador ATS',
    eyebrow: 'Herramienta Edvanta',
    h1: 'Descubre qué tan compatible es tu hoja de vida con el cargo',
    tagline:
      'Pega tu hoja de vida y el cargo objetivo: el analizador calcula un puntaje de compatibilidad y te dice qué palabras clave y secciones mejorar.',
    cta: { label: 'Analizar mi hoja de vida', to: '/empleo#creador' },
    canDo: [
      'Obtener un puntaje general de compatibilidad con el cargo.',
      'Ver las palabras clave encontradas y las que faltan.',
      'Revisar la cobertura de experiencia, formación y formato.',
      'Recibir recomendaciones ordenadas por prioridad (alta, media, opcional).',
    ],
    steps: [
      { title: 'Pega tu hoja de vida', text: 'Copias el texto de tu HV actual en el analizador.' },
      { title: 'Indica el cargo objetivo', text: 'Añades la descripción de la vacante para comparar.' },
      { title: 'Aplica las mejoras', text: 'Ajustas tu HV según las recomendaciones priorizadas y vuelves a medir.' },
    ],
    audience: ['Quienes ya tienen HV pero no reciben respuestas', 'Personas que postulan a un cargo específico', 'Profesionales que quieren afinar sus palabras clave'],
    outcome: 'Un diagnóstico claro de tu hoja de vida con acciones concretas para subir tu compatibilidad.',
    relatedMeta: { areaIds: [], tags: ['empleabilidad'] },
    seo: {
      title: 'Analizador ATS de hoja de vida | Edvanta',
      description: 'Analiza la compatibilidad de tu hoja de vida con el cargo: puntaje, palabras clave faltantes y recomendaciones priorizadas. Herramienta de Edvanta.',
      keywords: ['analizador ATS', 'puntaje hoja de vida', 'compatibilidad CV vacante', 'palabras clave hoja de vida'],
    },
  },
  {
    slug: 'correos-rrhh',
    kind: 'library',
    icon: 'mail',
    nav: 'Correos a RR. HH.',
    eyebrow: 'Herramienta Edvanta',
    h1: 'Envía correos profesionales a recursos humanos sin quedarte en blanco',
    tagline:
      'Plantillas de correo en español listas para postular, dar seguimiento y agradecer, con el tono profesional del sector farmacéutico. Editas los campos y copias.',
    cta: { label: 'Ver plantillas de correo', to: '/empleo#correos' },
    canDo: [
      'Usar una plantilla de correo de postulación lista para editar.',
      'Cambiar cargo, empresa y tus datos entre llaves en segundos.',
      'Copiar el correo con un clic y pegarlo en tu gestor.',
      'Adaptar el tono para seguimiento o agradecimiento.',
    ],
    steps: [
      { title: 'Elige la plantilla', text: 'Abres el correo de postulación en el centro de empleo.' },
      { title: 'Personaliza los campos', text: 'Reemplazas los campos entre llaves con tus datos y el cargo.' },
      { title: 'Copia y envía', text: 'Copias el texto final y lo envías desde tu correo.' },
    ],
    audience: ['Personas que postulan por correo', 'Practicantes que contactan empresas', 'Quienes hacen seguimiento a una vacante'],
    outcome: 'Un correo profesional y personalizado, listo para enviar a recursos humanos.',
    relatedMeta: { areaIds: [], tags: ['empleabilidad'] },
    seo: {
      title: 'Plantillas de correo para recursos humanos | Edvanta',
      description: 'Correos profesionales listos para postular, dar seguimiento y agradecer en el sector farmacéutico. Edita y copia con un clic.',
      keywords: ['correo postulación', 'plantilla correo recursos humanos', 'correo hoja de vida', 'seguimiento vacante'],
    },
  },
  {
    slug: 'banco-vacantes',
    kind: 'explorer',
    icon: 'briefcase',
    nav: 'Banco de vacantes',
    eyebrow: 'Herramienta Edvanta',
    h1: 'Encuentra vacantes farmacéuticas y comparte las tuyas',
    tagline:
      'Un banco colaborativo donde las ofertas se publican con la misma plantilla: cargo, empresa, ciudad, modalidad y contacto directo. Consulta o comparte una vacante.',
    cta: { label: 'Ver el banco de vacantes', to: '/empleo#vacantes' },
    canDo: [
      'Consultar vacantes del sector con un formato unificado.',
      'Ver cargo, empresa, ciudad, modalidad y contacto directo.',
      'Compartir una oferta que conozcas en la plantilla estándar.',
      'Complementar con las bolsas de empleo oficiales listadas.',
    ],
    steps: [
      { title: 'Explora las ofertas', text: 'Revisas las vacantes visibles con su contacto directo.' },
      { title: 'Postúlate o comparte', text: 'Escribes al contacto de la oferta, o publicas una nueva vacante.' },
      { title: 'Haz seguimiento', text: 'Usas las plantillas de correo para postular y dar seguimiento.' },
    ],
    audience: ['Quienes buscan empleo farmacéutico en Colombia', 'Profesionales que quieren compartir una vacante', 'Practicantes explorando oportunidades'],
    outcome: 'Acceso a vacantes con contacto directo y una vía para compartir oportunidades con la comunidad.',
    relatedMeta: { areaIds: [], tags: ['empleabilidad'] },
    seo: {
      title: 'Banco de vacantes farmacéuticas | Edvanta',
      description: 'Vacantes del sector farmacéutico con plantilla unificada: cargo, empresa, ciudad, modalidad y contacto. Consulta o comparte ofertas.',
      keywords: ['vacantes químico farmacéutico', 'empleo farmacéutico Colombia', 'banco de vacantes', 'ofertas farmacia'],
    },
  },
  {
    slug: 'orientacion-vocacional',
    kind: 'wizard',
    icon: 'compass',
    nav: 'Orientación vocacional',
    eyebrow: 'Herramienta Edvanta',
    h1: 'Descubre en qué área farmacéutica encajas mejor',
    tagline:
      'Un recorrido guiado por tus intereses y fortalezas que te sugiere las áreas profesionales del químico farmacéutico donde tienes más afinidad.',
    cta: { label: 'Empezar la orientación', to: '/vocacion' },
    canDo: [
      'Responder un cuestionario corto de intereses y fortalezas.',
      'Recibir áreas farmacéuticas sugeridas según tu perfil.',
      'Conectar cada área con carreras, cursos y rutas de Edvanta.',
      'Repetir el ejercicio cuando cambien tus intereses.',
    ],
    steps: [
      { title: 'Elige tus intereses', text: 'Marcas lo que te gusta: laboratorio, personas, datos, procesos, regulación…' },
      { title: 'Señala tus fortalezas', text: 'Indicas en qué te destacas para afinar la recomendación.' },
      { title: 'Explora tu resultado', text: 'Ves tus áreas sugeridas y avanzas a las carreras y rutas relacionadas.' },
    ],
    audience: ['Estudiantes de últimos semestres', 'Recién egresados sin área definida', 'Profesionales que piensan cambiar de área'],
    outcome: 'Una o varias áreas farmacéuticas sugeridas, con el siguiente paso para explorarlas.',
    relatedMeta: { areaIds: ['quality-assurance', 'regulatory-affairs', 'pharmacovigilance'], tags: [] },
    seo: {
      title: 'Orientación vocacional para químicos farmacéuticos | Edvanta',
      description: 'Descubre en qué área farmacéutica encajas mejor con un recorrido guiado por tus intereses y fortalezas. Herramienta gratuita de Edvanta.',
      keywords: ['orientación vocacional farmacia', 'áreas químico farmacéutico', 'qué área elegir farmacia', 'test vocacional farmacéutico'],
    },
  },
  {
    slug: 'linkedin',
    kind: 'generator',
    icon: 'linkedin',
    nav: 'LinkedIn',
    eyebrow: 'Herramienta Edvanta',
    h1: 'Mejora tu LinkedIn con prompts pensados para farmacéuticos',
    tagline:
      'Un banco de prompts por categoría (titular, "Acerca de", experiencia, contenido) con botón de copia, más una guía visual de 6 pasos para optimizar tu perfil.',
    cta: { label: 'Abrir la guía de LinkedIn', to: '/linkedin' },
    canDo: [
      'Copiar prompts por categoría para redactar cada parte de tu perfil.',
      'Seguir una guía visual de 6 pasos para optimizar LinkedIn.',
      'Trabajar titular, "Acerca de", experiencia y contenido con criterio del sector.',
      'Reutilizar la biblioteca de prompts cuando la necesites.',
    ],
    steps: [
      { title: 'Elige qué mejorar', text: 'Seleccionas la parte del perfil que quieres trabajar.' },
      { title: 'Copia el prompt', text: 'Tomas el prompt de esa categoría y lo pegas en tu asistente favorito.' },
      { title: 'Ajusta y publica', text: 'Adaptas el resultado a tu voz y actualizas tu perfil.' },
    ],
    audience: ['Profesionales que quieren visibilidad', 'Quienes buscan empleo o clientes', 'Personas construyendo marca personal farmacéutica'],
    outcome: 'Un perfil de LinkedIn más claro y profesional, redactado con prompts específicos del sector.',
    relatedMeta: { areaIds: [], tags: ['marca personal', 'empleabilidad'] },
    seo: {
      title: 'Prompts y guía para mejorar LinkedIn (farmacéuticos) | Edvanta',
      description: 'Banco de prompts por categoría y guía de 6 pasos para optimizar tu perfil de LinkedIn como químico farmacéutico. Copia y aplica.',
      keywords: ['prompts LinkedIn', 'mejorar perfil LinkedIn', 'LinkedIn químico farmacéutico', 'marca personal farmacéutica'],
    },
  },
  {
    slug: 'practicas',
    kind: 'wizard',
    icon: 'clipboard',
    nav: 'Prácticas',
    eyebrow: 'Herramienta Edvanta',
    h1: 'Prepárate para tus prácticas paso a paso',
    tagline:
      'Una guía práctica para llegar preparado a tus prácticas: elegir área, preparar tu perfil, tu hoja de vida y tu correo, y postularte con las fuentes oficiales.',
    cta: { label: 'Abrir la guía de prácticas', to: '/practicas' },
    canDo: [
      'Seguir una ruta clara para preparar tus prácticas.',
      'Usar la plantilla de hoja de vida y de correo para practicantes.',
      'Consultar pasantías y fuentes oficiales del sector.',
      'Conectar con la orientación vocacional para elegir área.',
    ],
    steps: [
      { title: 'Elige tu área', text: 'Defines dónde quieres practicar con ayuda de la orientación.' },
      { title: 'Prepara tu perfil', text: 'Armas tu hoja de vida y tu correo con las plantillas.' },
      { title: 'Postúlate', text: 'Aplicas a las pasantías y fuentes oficiales listadas.' },
    ],
    audience: ['Estudiantes que entran a prácticas', 'Practicantes buscando dónde aplicar', 'Quienes preparan su primer perfil profesional'],
    outcome: 'Un plan concreto y las plantillas necesarias para conseguir y aprovechar tus prácticas.',
    relatedMeta: { areaIds: [], tags: ['empleabilidad'] },
    seo: {
      title: 'Cómo prepararte para tus prácticas farmacéuticas | Edvanta',
      description: 'Guía paso a paso para preparar tus prácticas: elegir área, hoja de vida, correo y pasantías oficiales. Recurso gratuito de Edvanta.',
      keywords: ['prácticas químico farmacéutico', 'pasantías farmacia', 'preparar prácticas', 'hoja de vida practicante'],
    },
  },
  {
    slug: 'emprende',
    kind: 'wizard',
    icon: 'rocket',
    nav: 'Emprende',
    eyebrow: 'Herramienta Edvanta',
    h1: 'Convierte tu idea farmacéutica en un proyecto validado',
    tagline:
      'Un recorrido de emprendimiento con canvas de idea y preguntas guiadas de validación, más recursos para probar productos, enseñar o publicar en equipo.',
    cta: { label: 'Empezar a emprender', to: '/emprendimientos' },
    canDo: [
      'Estructurar tu idea con un canvas y preguntas guiadas.',
      'Validar el problema, el cliente y la propuesta de valor.',
      'Explorar pruebas de producto y modelos de emprendimiento.',
      'Encontrar vías para enseñar o publicar en equipo.',
    ],
    steps: [
      { title: 'Define tu idea', text: 'Escribes tu idea en el canvas y respondes las preguntas de validación.' },
      { title: 'Valida con la comunidad', text: 'Usas las pruebas de producto y el feedback para ajustar.' },
      { title: 'Da el siguiente paso', text: 'Avanzas hacia tu MVP, tu curso o tu artículo en equipo.' },
    ],
    audience: ['Profesionales con una idea de negocio', 'Docentes y creadores de contenido', 'Investigadores que buscan coautores'],
    outcome: 'Una idea de emprendimiento más clara y validada, con el siguiente paso definido.',
    relatedMeta: { areaIds: ['management'], tags: ['Emprendimiento'] },
    seo: {
      title: 'Emprendimiento para químicos farmacéuticos | Edvanta',
      description: 'Canvas de idea, preguntas de validación y recursos para emprender, enseñar o publicar en equipo como químico farmacéutico.',
      keywords: ['emprendimiento farmacéutico', 'validar idea de negocio', 'emprender farmacia', 'canvas emprendimiento'],
    },
  },
  {
    slug: 'perfil-empresas',
    kind: 'builder',
    icon: 'building',
    nav: 'Perfil para empresas',
    eyebrow: 'Herramienta Edvanta',
    h1: 'Muestra tus habilidades y proyectos a las empresas',
    tagline:
      'Publica tu perfil profesional con tus proyectos, artículos y certificados. Te clasificas por área y las empresas pueden filtrar y contactarte según lo que buscan.',
    cta: { label: 'Crear mi perfil profesional', to: '/empresas' },
    canDo: [
      'Publicar tu perfil con habilidades, proyectos y artículos.',
      'Clasificarte automáticamente por tu área profesional.',
      'Ser visible para empresas que filtran talento por área.',
      'Enlazar tu LinkedIn y contacto profesional.',
    ],
    steps: [
      { title: 'Completa tu perfil', text: 'Añades tu área, habilidades, proyectos y artículos.' },
      { title: 'Publícalo', text: 'Tu perfil queda clasificado por el área que elijas.' },
      { title: 'Recibe contactos', text: 'Las empresas te encuentran y contactan según lo que buscan.' },
    ],
    audience: ['Profesionales visibles al mercado laboral', 'Quienes tienen proyectos o publicaciones', 'Talento que quiere ser contactado por empresas'],
    outcome: 'Un perfil profesional público y clasificado por área, listo para que las empresas te encuentren.',
    relatedMeta: { areaIds: [], tags: ['empleabilidad'] },
    seo: {
      title: 'Perfil profesional para empresas | Edvanta',
      description: 'Publica tu perfil de químico farmacéutico con habilidades, proyectos y artículos. Clasificado por área para que las empresas te contacten.',
      keywords: ['perfil profesional farmacéutico', 'talento farmacéutico', 'hoja de vida pública', 'empresas farmacéuticas talento'],
    },
  },
];

const BY_SLUG = Object.fromEntries(HERRAMIENTAS.map((h) => [h.slug, h]));

export function getHerramienta(slug) {
  return BY_SLUG[slug] || null;
}

// Etiqueta legible del patrón UX (por si se quiere mostrar).
export const KIND_LABEL = {
  builder: 'Construyes algo',
  analyzer: 'Recibes un análisis',
  wizard: 'Sigues pasos guiados',
  generator: 'Generas contenido',
  explorer: 'Exploras y encuentras',
  library: 'Biblioteca lista para usar',
  dashboard: 'Controlas tu progreso',
};

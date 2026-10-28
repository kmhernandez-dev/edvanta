/**
 * ============================================================
 *  servicios.js — Lo que una institución puede contratar
 *
 *  «Para instituciones» no es otra escuela: reúne lo que todas las
 *  escuelas ofrecen a hospitales, IPS, EPS y empresas. Cada paquete
 *  dice qué necesidad atiende, a quién beneficia, qué se entrega, cómo
 *  y con qué alcance, y cómo se pide.
 *
 *  Todo es bajo propuesta: no hay precios publicados porque el alcance
 *  cambia con cada institución. No se publican clientes, alianzas,
 *  testimonios ni resultados: no hay ninguno documentado todavía.
 * ============================================================
 */

/** Lo que se puede pedir, en lenguaje de quien compra. */
export const OFERTAS_INSTITUCIONALES = [
  { nombre: 'Formación para sus equipos', paquete: 'equipo-que-cuida' },
  { nombre: 'Cohortes virtuales cerradas', paquete: 'equipo-que-cuida' },
  { nombre: 'Talleres para pacientes y cuidadores', paquete: 'ruta-contigo' },
  { nombre: 'Rutas educativas por condición', paquete: 'ruta-contigo' },
  { nombre: 'Guías adaptadas a una población', paquete: 'ruta-contigo' },
  { nombre: 'Licencias de acceso a recursos', paquete: 'biblioteca-contigo' },
  { nombre: 'Producción de materiales educativos y comerciales', paquete: 'comunicacion-con-evidencia' },
];

/** Cómo se pide una propuesta: igual para los cuatro paquetes. */
export const PROCEDIMIENTO = [
  'Nos cuentas qué necesita tu institución con el formulario o por WhatsApp.',
  'Conversamos para entender la población, los temas y los tiempos.',
  'Te enviamos una propuesta escrita con alcance, cronograma y valor.',
  'Si la apruebas, acordamos fechas y empezamos.',
];

export const PAQUETES = [
  {
    slug: 'equipo-que-cuida',
    nombre: 'Equipo que Cuida',
    imagen: '/img/servicios/equipo-que-cuida.webp',
    imagenAlt: 'Equipo de un servicio farmacéutico en una sesión de formación sobre almacenamiento y cadena de frío',
    lema: 'Formación del talento humano',
    escuelas: ['salud', 'calidad', 'regulatorios'],
    destacado: true,
    heroTitle: 'Equipo que Cuida: formación para el talento humano',
    heroLead: 'Una propuesta para actualizar y alinear al equipo en los temas que sostienen su trabajo diario, con una ruta acordada y seguimiento del avance.',
    intro: 'Cuando la formación se dispersa en cursos sueltos, cada persona aprende a su manera y la organización no puede ver qué cambió. Equipo que Cuida reúne a los perfiles que necesitan hablar el mismo idioma y ordena la formación en un plan acordado con la institución.',
    necesidad: 'Actualizar a un equipo en temas de su trabajo diario —servicio farmacéutico, calidad, regulatorio o farmacoterapia— sin depender de cursos sueltos que cada persona busca por su cuenta.',
    publico: 'Químicos farmacéuticos, regentes, auxiliares y personal asistencial o técnico de la institución.',
    destinatarios: [
      'Químicos farmacéuticos y regentes',
      'Auxiliares de farmacia y personal técnico',
      'Equipos de calidad, producción y regulatorio',
      'Equipos asistenciales que trabajan con medicamentos',
    ],
    entregables: [
      'Plan de formación acordado con la institución',
      'Sesiones en vivo por videollamada o cohorte cerrada en el aula virtual de Edvanta',
      'Acceso a cursos virtuales de las escuelas, asignados por grupo',
      'Materiales de apoyo de cada sesión',
      'Registro de asistencia y de avance por participante',
    ],
    modalidad: 'Virtual: en vivo, en el aula o combinada.',
    alcance: 'Se define en la propuesta según el número de personas, los temas y el calendario.',
    resultado: 'Un equipo con criterios comunes para ejecutar sus procesos y resolver las situaciones que aparecen en la operación.',
    areasRelacionadas: ['regentes-de-farmacia', 'auxiliares-de-farmacia', 'aseguramiento-de-la-calidad'],
    faq: [
      {
        q: '¿Se puede armar con varias áreas?',
        a: 'Sí. Es la modalidad natural para combinar perfiles y áreas en una sola propuesta, con énfasis distintos para cada grupo.',
      },
      {
        q: '¿Incluye cursos del aula virtual?',
        a: 'Puede incluir acceso a cursos y recursos seleccionados. La selección se acuerda con la institución y se detalla en la propuesta.',
      },
      {
        q: '¿Cuánto dura?',
        a: 'La duración depende de los temas, el número de participantes y la modalidad. Se define por escrito antes de iniciar.',
      },
    ],
    estado: 'a_solicitud',
  },
  {
    slug: 'ruta-contigo',
    nombre: 'Ruta Contigo',
    imagen: '/img/servicios/ruta-contigo.webp',
    imagenAlt: 'Química farmacéutica revisando con dos personas una guía educativa para pacientes',
    lema: 'Programa educativo para pacientes',
    escuelas: ['salud'],
    destacado: false,
    heroTitle: 'Ruta Contigo: educación para pacientes y cuidadores',
    heroLead: 'Un programa educativo para que los pacientes comprendan mejor su condición y su tratamiento, con materiales y encuentros adaptados a la población.',
    intro: 'La educación del paciente no debería depender de un folleto genérico. Ruta Contigo organiza una ruta de aprendizaje para la condición que atiende la institución, con lenguaje claro, encuentros acompañados y materiales que el paciente puede volver a consultar.',
    necesidad: 'Acompañar con educación a los pacientes de una condición —para que entiendan su tratamiento y lleguen mejor preparados a la consulta— sin recargar al equipo asistencial.',
    publico: 'Pacientes y cuidadores de la población que atiende la institución.',
    destinatarios: [
      'Pacientes y cuidadores de una condición específica',
      'Equipos que acompañan educación al paciente',
      'Programas de crónicos o de adherencia',
    ],
    entregables: [
      'Ruta educativa diseñada para la condición y la población',
      'Talleres educativos en vivo para pacientes y cuidadores',
      'Guías y agendas de consulta adaptadas a la población',
      'Registro de asistencia a los talleres',
    ],
    modalidad: 'Talleres virtuales en vivo y material digital.',
    alcance: 'Se define por condición, número de talleres y tamaño de la población.',
    resultado: 'Materiales y encuentros que ayudan a que el paciente entienda su tratamiento y llegue mejor preparado a la consulta.',
    areasRelacionadas: ['farmacia-clinica', 'farmacovigilancia', 'liderazgo-y-gestion'],
    faq: [
      {
        q: '¿Es atención clínica para pacientes?',
        a: 'No. Es educación para pacientes y cuidadores. No reemplaza la consulta, el diagnóstico ni las indicaciones individuales.',
      },
      {
        q: '¿Se adapta a cualquier condición?',
        a: 'La ruta se diseña con la institución según la población, el tratamiento y los materiales disponibles. Se confirma en la propuesta.',
      },
      {
        q: '¿Puede combinarse con formación del equipo?',
        a: 'Sí. La institución puede solicitar formación para su equipo y, en la misma propuesta, una ruta educativa para pacientes.',
      },
    ],
    aclaracion: 'Es educación para pacientes: no reemplaza la atención clínica ni la consulta individual.',
    estado: 'a_solicitud',
  },
  {
    slug: 'biblioteca-contigo',
    nombre: 'Biblioteca Contigo',
    imagen: '/img/servicios/biblioteca-contigo.webp',
    imagenAlt: 'Equipo de una institución explorando el catálogo de cursos del aula virtual',
    lema: 'Acceso institucional a recursos revisados',
    escuelas: ['salud', 'calidad', 'regulatorios'],
    destacado: false,
    heroTitle: 'Biblioteca Contigo: acceso institucional a recursos',
    heroLead: 'Una selección de cursos y recursos revisados, con cuentas para el equipo o la población que la institución quiera incluir.',
    intro: 'Comprar cursos uno por uno deja sin control lo que aprende el equipo y dificulta saber qué se completó. Biblioteca Contigo organiza el acceso, la selección de recursos y las cuentas de los participantes durante el periodo acordado.',
    necesidad: 'Dar a un equipo o a una población acceso ordenado a cursos y guías de Edvanta, sin comprar uno por uno.',
    publico: 'Colaboradores de la institución o pacientes que la institución quiera incluir.',
    destinatarios: [
      'Equipos de la institución que necesitan formación continua',
      'Personal nuevo o en inducción',
      'Pacientes y cuidadores incluidos por la institución',
    ],
    entregables: [
      'Licencias de acceso al aula virtual de Edvanta',
      'Selección de cursos y recursos acordada con la institución',
      'Cuentas creadas por Edvanta para cada participante',
    ],
    modalidad: 'Acceso en línea durante el periodo acordado.',
    alcance: 'Se define por número de licencias, recursos incluidos y duración del acceso.',
    resultado: 'Acceso ordenado a recursos revisados, con una selección que responde a las necesidades del equipo o de la población.',
    areasRelacionadas: ['regentes-de-farmacia', 'control-de-calidad', 'datos-e-inteligencia-artificial'],
    faq: [
      {
        q: '¿Los cursos son propios o de terceros?',
        a: 'La selección puede incluir cursos y recursos de Edvanta y materiales afiliados claramente identificados. La institución conoce el origen antes de contratar.',
      },
      {
        q: '¿Se puede limitar el acceso a un grupo?',
        a: 'Sí. Las cuentas y la selección se organizan por grupo o población según lo acordado.',
      },
      {
        q: '¿Cuánto tiempo dura el acceso?',
        a: 'El periodo se define en la propuesta, junto con el número de licencias y los recursos incluidos.',
      },
    ],
    estado: 'a_solicitud',
  },
  {
    slug: 'comunicacion-con-evidencia',
    nombre: 'Comunicación con Evidencia',
    imagen: '/img/escuelas/marketing.webp',
    imagenAlt: 'Equipo revisando piezas de comunicación de salud en una pantalla',
    lema: 'Materiales y servicios de comunicación',
    escuelas: ['marketing'],
    destacado: false,
    heroTitle: 'Comunicación con Evidencia: materiales que se sostienen en fuentes',
    heroLead: 'Producción de materiales educativos y comerciales con mensajes claros, referencias verificables y un proceso de revisión acordado.',
    intro: 'Un material de salud debe poder explicar de dónde sale lo que afirma. Comunicación con Evidencia acompaña la producción de fichas, contenidos y piezas de visita médica, cuidando la claridad del mensaje y la trazabilidad de las fuentes.',
    necesidad: 'Producir materiales educativos y comerciales del sector farmacéutico que se apoyen en referencias verificables.',
    publico: 'Laboratorios, distribuidoras y empresas del sector, y sus equipos comerciales y de visita médica.',
    destinatarios: [
      'Equipos de marketing y medical affairs',
      'Equipos comerciales y de visita médica',
      'Áreas que producen contenidos para profesionales o pacientes',
    ],
    entregables: [
      'Fichas de producto y materiales de apoyo para visita médica',
      'Contenidos educativos para profesionales o pacientes',
      'Referencias citadas en cada material',
    ],
    modalidad: 'Producción por encargo, con revisiones acordadas.',
    alcance: 'Se define por tipo y cantidad de piezas.',
    resultado: 'Materiales con mensajes claros, referencias verificables y un proceso de revisión acordado.',
    areasRelacionadas: ['marketing-farmaceutico', 'asuntos-regulatorios', 'datos-e-inteligencia-artificial'],
    faq: [
      {
        q: '¿Quién aprueba el material?',
        a: 'La aprobación final y el cumplimiento de las normas de publicidad corresponden al titular del producto. Edvanta puede apoyar la producción y la verificación de fuentes.',
      },
      {
        q: '¿Qué tipo de piezas se pueden producir?',
        a: 'Fichas de producto, materiales de visita médica, contenidos educativos y piezas para pacientes, según el alcance acordado.',
      },
      {
        q: '¿Se puede combinar con capacitación?',
        a: 'Sí. Puede complementar una propuesta de formación o contratarse como servicio independiente.',
      },
    ],
    aclaracion: 'La aprobación final del material y el cumplimiento de las normas de publicidad de medicamentos corresponden al titular del producto.',
    estado: 'a_solicitud',
  },
];

export const paquetePorSlug = (slug) => PAQUETES.find((p) => p.slug === slug) || null;

export const paqueteTo = (slug) => `/instituciones/paquetes/${slug}`;

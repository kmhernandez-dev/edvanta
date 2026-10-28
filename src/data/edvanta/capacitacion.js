export const CATEGORIAS_CAPACITACION = {
  perfil: {
    etiqueta: 'Formación por perfil',
    descripcion: 'Líneas diseñadas alrededor de las funciones y responsabilidades de un cargo.',
  },
  area: {
    etiqueta: 'Formación por área',
    descripcion: 'Líneas técnicas que fortalecen procesos, criterios y prácticas de un área farmacéutica.',
  },
};

export const PERFILES_CAPACITACION = [
  'Dirección, gerencia o jefatura',
  'Químicos farmacéuticos',
  'Regentes de farmacia',
  'Auxiliares de farmacia',
  'Profesionales asistenciales',
  'Equipos de producción',
  'Equipos de calidad',
  'Asuntos regulatorios',
  'Equipos comerciales',
  'Ingeniería y mantenimiento',
  'Personal administrativo',
  'Equipos mixtos',
];

export const TIPOS_DE_ORGANIZACION = [
  { value: 'laboratorio', label: 'Laboratorio farmacéutico' },
  { value: 'fabricante', label: 'Fabricante o maquilador' },
  { value: 'distribuidor', label: 'Distribuidor u operador farmacéutico' },
  { value: 'drogueria', label: 'Droguería' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'central-mezclas', label: 'Central de mezclas' },
  { value: 'hospital', label: 'Hospital o clínica' },
  { value: 'ips', label: 'IPS o red de atención' },
  { value: 'otra', label: 'Otra organización del sector salud' },
];

export const ORGANIZACIONES = [
  {
    icono: 'factory',
    nombre: 'Laboratorios y fabricantes',
    desc: 'Equipos de producción, calidad, desarrollo, regulatorio y validaciones que necesitan alinear criterios técnicos.',
  },
  {
    icono: 'truck',
    nombre: 'Distribuidores y operadores',
    desc: 'Operación logística, almacenamiento, trazabilidad y equipos que atienden farmacias y hospitales.',
  },
  {
    icono: 'pill',
    nombre: 'Droguerías y farmacias',
    desc: 'Regentes, auxiliares y personal de mostrador con responsabilidades directas sobre el servicio.',
  },
  {
    icono: 'flask',
    nombre: 'Centrales de mezclas',
    desc: 'Preparaciones, controles, documentación y coordinación con los servicios asistenciales.',
  },
  {
    icono: 'hospital',
    nombre: 'Hospitales y clínicas',
    desc: 'Servicios farmacéuticos, farmacia clínica, abastecimiento y equipos interdisciplinarios.',
  },
  {
    icono: 'heart',
    nombre: 'IPS y redes de atención',
    desc: 'Equipos asistenciales y administrativos que coordinan medicamentos, procesos y educación.',
  },
  {
    icono: 'shield',
    nombre: 'Áreas de calidad y regulatorio',
    desc: 'Profesionales que sostienen sistemas de calidad, expedientes, auditorías y cumplimiento interno.',
  },
  {
    icono: 'megaphone',
    nombre: 'Equipos comerciales y de visita médica',
    desc: 'Comunicación científica, conocimiento de producto y promoción responsable.',
  },
  {
    icono: 'chart',
    nombre: 'Áreas de datos y gestión',
    desc: 'Equipos que analizan indicadores, automatizan reportes y necesitan integridad de la información.',
  },
];

export const MODALIDADES = [
  {
    value: 'en-vivo',
    icono: 'live',
    titulo: 'Sesiones en vivo',
    desc: 'Encuentros por videollamada con el equipo, con espacios para preguntas, casos y trabajo aplicado.',
  },
  {
    value: 'aula',
    icono: 'aula',
    titulo: 'Cohorte en el aula virtual',
    desc: 'Grupo cerrado con acceso a los cursos y recursos seleccionados, asignados por la institución.',
  },
  {
    value: 'combinada',
    icono: 'mix',
    titulo: 'Formación combinada',
    desc: 'Contenido virtual para avanzar a ritmo propio y sesiones en vivo para profundizar y resolver dudas.',
  },
  {
    value: 'diseno',
    icono: 'design',
    titulo: 'Diseño a medida',
    desc: 'Contenidos, ejercicios y materiales construidos alrededor de los procesos y necesidades del equipo.',
  },
];

export const ENTREGABLES_GENERALES = [
  'Plan de formación acordado con la organización',
  'Materiales de apoyo de cada encuentro',
  'Registro de asistencia y avance por participante',
  'Documento de cierre con los temas trabajados y las recomendaciones de continuidad',
];

export const PROCESO_PROPUESTA = [
  {
    titulo: 'Nos cuentas la necesidad',
    desc: 'Compartes el tipo de organización, los perfiles, las áreas de interés y el resultado que buscan.',
  },
  {
    titulo: 'Conversamos el alcance',
    desc: 'Revisamos prioridades, tiempos, modalidad y qué información o procesos conviene incorporar.',
  },
  {
    titulo: 'Recibes una propuesta escrita',
    desc: 'Incluye objetivos, contenidos, modalidad, entregables, cronograma y valor antes de decidir.',
  },
  {
    titulo: 'Acordamos y ejecutamos',
    desc: 'Se confirman fechas, participantes y responsables. El plan se ajusta a la operación real.',
  },
];

export const PREGUNTAS_GENERALES = [
  {
    q: '¿Las áreas son cursos ya disponibles?',
    a: 'No. Son líneas de formación para diseñar una propuesta. El contenido, la profundidad y los materiales se ajustan a la necesidad de la organización; no publicamos fechas, docentes ni cupos que no estén confirmados.',
  },
  {
    q: '¿Puedo combinar varias áreas y perfiles?',
    a: 'Sí. Una misma propuesta puede atender a regentes, auxiliares, equipos de calidad, producción o dirección, con énfasis distintos. El formulario permite seleccionar varias áreas y perfiles.',
  },
  {
    q: '¿Publican precios, duración o cobertura?',
    a: 'No. El alcance y el valor dependen del número de participantes, los temas, la modalidad y el tiempo. Todo se detalla por escrito en la propuesta.',
  },
  {
    q: '¿La capacitación garantiza el cumplimiento normativo?',
    a: 'No. La formación fortalece competencias y criterios de trabajo, pero no sustituye los sistemas de calidad, las autorizaciones, las auditorías ni la responsabilidad de la organización.',
  },
  {
    q: '¿Entregan certificados o constancias?',
    a: 'Cada participante queda con registro de asistencia y avance. Si la organización necesita una constancia adicional, se define en la propuesta para saber exactamente qué recibirá.',
  },
  {
    q: '¿Se ajusta a la normativa de mi país?',
    a: 'El enfoque se adapta al mercado de interés. Antes de publicar afirmaciones regulatorias específicas verificamos la norma aplicable y la fecha de vigencia.',
  },
  {
    q: '¿La formación es presencial?',
    a: 'La oferta actual se desarrolla en línea, en vivo o en el aula virtual. Si necesitas otra modalidad, lo conversamos en la propuesta y confirmamos disponibilidad antes de comprometerla.',
  },
];

export const AREAS_CAPACITACION = [
  {
    slug: 'regentes-de-farmacia',
    nombre: 'Regentes de farmacia',
    categoria: 'perfil',
    resumen: 'Gestión del servicio farmacéutico, almacenamiento, inventarios, dispensación y calidad del servicio.',
    heroTitle: 'Capacitación para regentes de farmacia',
    heroLead: 'Una línea para fortalecer la dirección del servicio farmacéutico: la operación diaria, el equipo y las decisiones que sostienen la dispensación segura.',
    intro: 'Quien asume la regencia de una farmacia responde por mucho más que el mostrador. Coordina personas, administra inventarios, vigila condiciones de almacenamiento, resuelve incidencias y deja evidencia de lo que ocurre. Esta formación parte de esas responsabilidades reales y ayuda a ordenar prioridades sin detener la operación.',
    dirigidoA: [
      'Regentes de farmacia y droguería',
      'Químicos farmacéuticos con responsabilidad de dirección técnica',
      'Coordinadores de servicios farmacéuticos',
      'Responsables de farmacias de cadena o puntos de atención',
    ],
    organizaciones: [
      'Droguerías y farmacias independientes',
      'Cadenas de farmacia y puntos de atención',
      'Operadores farmacéuticos y distribuidores',
      'Servicios farmacéuticos de baja y mediana complejidad',
    ],
    retos: [
      'Mantener el servicio funcionando mientras se ordenan procesos y registros.',
      'Sostener inventarios confiables y reducir pérdidas por vencimientos o faltantes.',
      'Estandarizar almacenamiento y dispensación entre turnos y sedes.',
      'Preparar al equipo para una verificación interna con evidencias disponibles.',
      'Fortalecer la atención al usuario sin descuidar los controles del servicio.',
    ],
    ejes: [
      {
        titulo: 'Dirección del servicio farmacéutico',
        desc: 'Funciones del regente, delegación, indicadores y coordinación con la dirección de la organización.',
      },
      {
        titulo: 'Almacenamiento y condiciones',
        desc: 'Organización por áreas, temperatura, humedad, control de plagas y manejo de productos con condiciones especiales.',
      },
      {
        titulo: 'Inventarios y abastecimiento',
        desc: 'Selección, mínimos y máximos, rotación, conciliaciones, vencimientos, devoluciones y trazabilidad.',
      },
      {
        titulo: 'Dispensación y atención',
        desc: 'Lectura de la prescripción, entrega, consejo, registros y manejo de situaciones difíciles en el mostrador.',
      },
      {
        titulo: 'Calidad y mejora del servicio',
        desc: 'Procedimientos, quejas, autoinspección, indicadores y preparación de evidencias para revisión interna.',
      },
    ],
    competencias: [
      'Organizar las responsabilidades del servicio y del equipo.',
      'Tomar decisiones de inventario con criterios de riesgo y rotación.',
      'Estandarizar almacenamiento y dispensación entre turnos.',
      'Documentar incidencias y sostener evidencia verificable.',
      'Comunicar prioridades y resultados a la dirección.',
    ],
    ruta: [
      { titulo: 'Diagnóstico de la operación', desc: 'Revisión de funciones, flujos, registros y principales puntos de fricción del servicio.' },
      { titulo: 'Prioridades y criterios', desc: 'Marco de responsabilidades, riesgos del servicio y decisiones que requieren respaldo.' },
      { titulo: 'Taller de procesos críticos', desc: 'Almacenamiento, inventario y dispensación trabajados con situaciones del día a día.' },
      { titulo: 'Plan de mejora', desc: 'Definición de acciones, responsables e indicadores para sostener los cambios.' },
    ],
    faq: [
      {
        q: '¿Esta formación habilita para ejercer como regente?',
        a: 'No. Es formación continua para quienes ya tienen responsabilidades en el servicio farmacéutico. No sustituye los requisitos académicos o legales para ejercer la regencia.',
      },
      {
        q: '¿Sirve para una droguería pequeña y para una cadena?',
        a: 'Sí. El alcance se ajusta al tamaño de la operación, el número de sedes, los turnos y los procesos que la organización necesite priorizar.',
      },
      {
        q: '¿Incluye una revisión de documentos de mi farmacia?',
        a: 'Puede incluirse como parte del alcance, con fines de formación y mejora. No es una auditoría formal ni reemplaza una verificación de autoridad.',
      },
    ],
    relacionados: ['auxiliares-de-farmacia', 'almacenamiento-y-distribucion', 'liderazgo-y-gestion'],
    imagen: '/img/empresas/capacitacion-equipo-farmaceutico.webp',
    imagenAlt: 'Equipo farmacéutico revisando procesos de dispensación en una sesión de formación',
  },
  {
    slug: 'auxiliares-de-farmacia',
    nombre: 'Auxiliares de farmacia',
    categoria: 'perfil',
    resumen: 'Recepción técnica, almacenamiento, dispensación segura, atención al usuario y prevención de errores según el cargo.',
    heroTitle: 'Capacitación para auxiliares de farmacia',
    heroLead: 'Formación práctica y ajustada a las funciones de apoyo: recibir, almacenar, dispensar y atender con criterios claros, sin asumir responsabilidades que no corresponden al cargo.',
    intro: 'El auxiliar de farmacia está en el punto donde se cruzan la prescripción, el inventario y la persona que espera. Su margen de acción es concreto, y también lo son los errores que puede evitar. Esta línea trabaja desde las tareas reales del cargo y refuerza cuándo debe actuar, cómo registrar y cuándo escalar al regente o al químico farmacéutico.',
    dirigidoA: [
      'Auxiliares de farmacia y droguería',
      'Personal de mostrador y atención al usuario',
      'Auxiliares de servicios farmacéuticos',
      'Personal nuevo o en proceso de inducción',
    ],
    organizaciones: [
      'Droguerías y farmacias',
      'Servicios farmacéuticos hospitalarios',
      'Distribuidores y operadores farmacéuticos',
      'Cadenas con varios puntos de atención',
    ],
    retos: [
      'Distinguir con claridad qué corresponde al cargo y qué debe escalarse.',
      'Recibir y almacenar sin alterar condiciones ni perder trazabilidad.',
      'Evitar confusiones entre presentaciones, concentraciones y lotes.',
      'Atender con claridad a personas que llegan con dudas o molestias.',
      'Registrar novedades para que el regente pueda decidir.',
    ],
    ejes: [
      {
        titulo: 'Funciones y límites del rol',
        desc: 'Responsabilidades del auxiliar, actividades que requieren dirección técnica y criterios de escalamiento.',
      },
      {
        titulo: 'Recepción y almacenamiento',
        desc: 'Verificación de entregas, condiciones, ubicación, rotación y cuidado de productos que requieren temperatura especial.',
      },
      {
        titulo: 'Dispensación segura',
        desc: 'Identificación de productos, lectura de la orden, confirmación de datos y prevención de errores frecuentes.',
      },
      {
        titulo: 'Atención al usuario',
        desc: 'Comunicación clara, manejo de esperas, privacidad, límites de la orientación y remisión al profesional.',
      },
      {
        titulo: 'Registros y comunicación',
        desc: 'Novedades, faltantes, devoluciones y situaciones que deben quedar documentadas o informarse al responsable.',
      },
    ],
    competencias: [
      'Ejecutar tareas de recepción y almacenamiento con criterios verificables.',
      'Detectar señales de riesgo antes de entregar un producto.',
      'Explicar indicaciones generales sin reemplazar la consulta profesional.',
      'Mantener registros útiles para el control del servicio.',
      'Escalar oportunamente las situaciones que superan su rol.',
    ],
    ruta: [
      { titulo: 'Punto de partida', desc: 'Revisión de funciones, tareas frecuentes y errores que la institución quiere prevenir.' },
      { titulo: 'Prácticas clave', desc: 'Recepción, almacenamiento, rotación y dispensación trabajadas con casos cotidianos.' },
      { titulo: 'Comunicación y límites', desc: 'Atención al usuario, privacidad y criterios para remitir al profesional responsable.' },
      { titulo: 'Cierre aplicado', desc: 'Compromisos de mejora por puesto de trabajo y verificación con el equipo.' },
    ],
    faq: [
      {
        q: '¿Capacita para dirigir una farmacia?',
        a: 'No. La formación se ajusta a funciones de apoyo y no sustituye la dirección técnica ni los requisitos del cargo de regente.',
      },
      {
        q: '¿Enseña a resolver consultas clínicas?',
        a: 'No. Se trabaja comunicación, orientación general y remisión segura. Las decisiones clínicas corresponden a los profesionales facultados.',
      },
      {
        q: '¿Se puede formar a todo el equipo a la vez?',
        a: 'Sí, aunque recomendamos organizar grupos por funciones para ajustar el nivel de detalle. También puede combinarse con la línea de regentes.',
      },
    ],
    relacionados: ['regentes-de-farmacia', 'almacenamiento-y-distribucion', 'farmacia-hospitalaria'],
    imagen: '/img/fotos/servicio-farmaceutico-recepcion.webp',
    imagenAlt: 'Auxiliar de farmacia atendiendo la recepción de un servicio farmacéutico',
  },
  {
    slug: 'farmacia-hospitalaria',
    nombre: 'Farmacia hospitalaria',
    categoria: 'area',
    resumen: 'Distribución intrahospitalaria, dosis unitaria, medicamentos de alto riesgo, trazabilidad y procesos del servicio.',
    heroTitle: 'Farmacia hospitalaria: procesos seguros dentro de la institución',
    heroLead: 'Formación para ordenar la distribución, la preparación y el control de medicamentos en hospitales, clínicas e IPS, con énfasis en trazabilidad y coordinación con las áreas asistenciales.',
    intro: 'En un hospital, el medicamento pasa por almacenes, estaciones de enfermería, servicios de preparación y múltiples manos. La farmacia hospitalaria necesita que cada paso sea visible y que el equipo sepa qué hacer cuando algo no coincide. Esta línea trabaja los procesos del servicio desde la operación real de la institución.',
    dirigidoA: [
      'Químicos farmacéuticos hospitalarios',
      'Regentes y jefes de servicios farmacéuticos',
      'Auxiliares de farmacia hospitalaria',
      'Coordinadores de abastecimiento y distribución',
    ],
    organizaciones: [
      'Hospitales y clínicas',
      'IPS con servicios farmacéuticos',
      'Centrales de mezclas',
      'Redes de atención con varios puntos de dispensación',
    ],
    retos: [
      'Reducir errores en la distribución y entrega de medicamentos.',
      'Sostener la trazabilidad entre almacén, farmacia y servicio.',
      'Definir controles para medicamentos de alto riesgo.',
      'Coordinar con enfermería y prescriptores sin duplicar tareas.',
      'Tener evidencia disponible para revisión interna o de autoridad.',
    ],
    ejes: [
      {
        titulo: 'Distribución intrahospitalaria',
        desc: 'Modelos de distribución, rutas, horarios, reposición y comunicación con los servicios.',
      },
      {
        titulo: 'Dosis unitaria y preparaciones',
        desc: 'Organización, identificación, doble control y límites entre preparación y administración.',
      },
      {
        titulo: 'Medicamentos de alto riesgo',
        desc: 'Identificación, almacenamiento diferenciado, señalización y controles antes de la entrega.',
      },
      {
        titulo: 'Trazabilidad y control',
        desc: 'Lotes, devoluciones, productos no utilizados, custodia y registro de movimientos.',
      },
      {
        titulo: 'Coordinación asistencial',
        desc: 'Acuerdos con enfermería, prescripción, comités y manejo de faltantes o cambios de terapia.',
      },
    ],
    competencias: [
      'Diseñar o ajustar el flujo de distribución del servicio.',
      'Definir puntos de control para medicamentos de alto riesgo.',
      'Sostener trazabilidad entre áreas y turnos.',
      'Coordinar con equipos asistenciales con criterios comunes.',
      'Documentar incidentes y oportunidades de mejora.',
    ],
    ruta: [
      { titulo: 'Mapa del proceso actual', desc: 'Recorrido del medicamento desde el almacén hasta el paciente y puntos de riesgo.' },
      { titulo: 'Controles esenciales', desc: 'Dosis unitaria, alto riesgo, devoluciones y trazabilidad.' },
      { titulo: 'Casos de coordinación', desc: 'Situaciones entre farmacia y enfermería para acordar respuestas.' },
      { titulo: 'Plan de implementación', desc: 'Prioridades, responsables y evidencias para sostener el cambio.' },
    ],
    faq: [
      {
        q: '¿Incluye preparación de mezclas intravenosas?',
        a: 'Puede abordarse como eje teórico y de control. No sustituye el entrenamiento práctico validado ni las condiciones específicas de la institución.',
      },
      {
        q: '¿Aplica a una IPS de baja complejidad?',
        a: 'Sí. El contenido y los ejercicios se ajustan al nivel de complejidad, los servicios disponibles y el volumen de operación.',
      },
      {
        q: '¿Reemplaza el programa de seguridad del paciente?',
        a: 'No. Se integra como apoyo formativo y debe articularse con las políticas, comités y procedimientos de la institución.',
      },
    ],
    relacionados: ['farmacia-clinica', 'farmacovigilancia', 'almacenamiento-y-distribucion'],
    imagen: '/img/servicios/equipo-que-cuida.webp',
    imagenAlt: 'Equipo de farmacia hospitalaria revisando la distribución de medicamentos',
  },
  {
    slug: 'farmacia-clinica',
    nombre: 'Farmacia clínica y atención farmacéutica',
    categoria: 'area',
    resumen: 'Entrevista, valoración farmacoterapéutica, problemas relacionados con medicamentos, conciliación, seguimiento y documentación.',
    heroTitle: 'Farmacia clínica y atención farmacéutica centrada en el paciente',
    heroLead: 'Formación para estructurar la entrevista, valorar la farmacoterapia, documentar hallazgos y hacer seguimiento, sin invadir las decisiones que corresponden a otros profesionales.',
    intro: 'La atención farmacéutica no empieza con una recomendación: empieza con una conversación bien hecha y un registro que permita continuidad. Esta línea se centra en la valoración y el seguimiento farmacoterapéutico, en la conciliación y en la documentación que hace visible el aporte del farmacéutico al equipo de salud.',
    dirigidoA: [
      'Químicos farmacéuticos clínicos',
      'Farmacéuticos de atención ambulatoria u hospitalaria',
      'Equipos de programas de atención farmacéutica',
      'Residentes y profesionales en formación clínica',
    ],
    organizaciones: [
      'Hospitales y clínicas',
      'IPS y programas ambulatorios',
      'Redes de atención con gestión farmacéutica',
      'Servicios farmacéuticos con seguimiento a pacientes',
    ],
    retos: [
      'Estandarizar la entrevista y la recolección de información relevante.',
      'Priorizar pacientes según complejidad y riesgo.',
      'Detectar y documentar problemas relacionados con medicamentos.',
      'Conciliar la medicación entre niveles de atención.',
      'Demostrar el seguimiento con registros claros y útiles.',
    ],
    ejes: [
      {
        titulo: 'Entrevista farmacéutica',
        desc: 'Estructura, preguntas abiertas, escucha, verificación de adherencia y manejo de información sensible.',
      },
      {
        titulo: 'Valoración farmacoterapéutica',
        desc: 'Necesidad, efectividad, seguridad y adherencia; criterios para priorizar y remitir.',
      },
      {
        titulo: 'Problemas relacionados con medicamentos',
        desc: 'Identificación, clasificación, documentación y comunicación con el equipo tratante.',
      },
      {
        titulo: 'Conciliación y seguimiento',
        desc: 'Transiciones de cuidado, lista de medicamentos, acuerdos con el paciente y próximos controles.',
      },
      {
        titulo: 'Documentación e indicadores',
        desc: 'Registro clínico, trazabilidad de intervenciones y métricas para evaluar el servicio.',
      },
    ],
    competencias: [
      'Conducir una entrevista farmacéutica completa y respetuosa.',
      'Valorar la farmacoterapia con un marco de priorización.',
      'Formular y documentar problemas relacionados con medicamentos.',
      'Coordinar la conciliación entre servicios y niveles de atención.',
      'Sostener un seguimiento con registros y criterios de remisión.',
    ],
    ruta: [
      { titulo: 'Entrevista y alcance', desc: 'Marco de la atención farmacéutica y práctica de entrevista con casos.' },
      { titulo: 'Valoración y priorización', desc: 'Método para revisar la terapia y decidir qué requiere seguimiento.' },
      { titulo: 'Documentación y conciliación', desc: 'Registros, transiciones de cuidado y comunicación con el equipo.' },
      { titulo: 'Seguimiento aplicado', desc: 'Diseño de un flujo de seguimiento para la población que atiende la institución.' },
    ],
    faq: [
      {
        q: '¿Se enseña a ajustar dosis o prescribir?',
        a: 'No. La formación fortalece la valoración, la documentación y las recomendaciones al equipo tratante. Las decisiones de prescripción corresponden a los profesionales facultados.',
      },
      {
        q: '¿Sirve para atención ambulatoria y hospitalaria?',
        a: 'Sí. Los ejes se adaptan al escenario, la población y el nivel de complejidad de la institución.',
      },
      {
        q: '¿Incluye pacientes reales?',
        a: 'Se trabaja con casos diseñados para la formación. No se solicitan ni comparten datos identificables de pacientes.',
      },
    ],
    relacionados: ['farmacia-hospitalaria', 'farmacovigilancia', 'investigacion-clinica'],
    imagen: '/img/escuelas/salud.webp',
    imagenAlt: 'Profesional farmacéutico en una entrevista de seguimiento con un paciente',
  },
  {
    slug: 'farmacia-magistral',
    nombre: 'Farmacia magistral',
    categoria: 'area',
    resumen: 'Formulación, cálculos, documentación, elaboración, controles, estabilidad y buenas prácticas aplicables.',
    heroTitle: 'Farmacia magistral: formulación, control y documentación',
    heroLead: 'Formación para preparar fórmulas magistrales con criterios de cálculo, documentación y control, dentro de las buenas prácticas que apliquen a la operación.',
    intro: 'Una preparación magistral es un producto hecho para una necesidad específica, y eso exige precisión en el cálculo, claridad en la fórmula y evidencia de lo que se elaboró. Esta línea conecta la formulación con la documentación, los controles y las condiciones de conservación que sostienen la calidad de la preparación.',
    dirigidoA: [
      'Químicos farmacéuticos con preparaciones magistrales',
      'Auxiliares de laboratorios de formulación',
      'Personal de control y documentación',
      'Responsables de farmacias magistrales',
    ],
    organizaciones: [
      'Farmacias magistrales',
      'Servicios farmacéuticos con área de preparaciones',
      'Laboratorios de fórmulas',
      'Centrales de mezclas con preparaciones no estériles',
    ],
    retos: [
      'Reducir errores de cálculo y transcripción de fórmulas.',
      'Documentar cada preparación y sus controles.',
      'Definir condiciones de elaboración y conservación.',
      'Organizar la trazabilidad de materias primas y envases.',
      'Sostener las buenas prácticas en la operación diaria.',
    ],
    ejes: [
      {
        titulo: 'Formulación y cálculo',
        desc: 'Revisión de fórmulas, unidades, equivalencias, porcentajes y verificaciones antes de elaborar.',
      },
      {
        titulo: 'Documentación de la preparación',
        desc: 'Orden de elaboración, registros, lotes, firmas y trazabilidad de materiales.',
      },
      {
        titulo: 'Instalaciones y equipos',
        desc: 'Áreas, limpieza, calibración, mantenimiento y control de condiciones ambientales.',
      },
      {
        titulo: 'Elaboración y controles',
        desc: 'Secuencia de preparación, controles en proceso, muestras y criterios de liberación.',
      },
      {
        titulo: 'Estabilidad y conservación',
        desc: 'Factores que afectan la preparación, condiciones de almacenamiento y vida útil según el caso.',
      },
    ],
    competencias: [
      'Verificar cálculos y fórmulas antes de preparar.',
      'Documentar la elaboración y sus controles de forma trazable.',
      'Reconocer límites de la preparación y cuándo escalar.',
      'Organizar materiales, áreas y equipos para reducir riesgo.',
      'Sustentar las condiciones de conservación de cada preparación.',
    ],
    ruta: [
      { titulo: 'Fórmulas y cálculos', desc: 'Revisión de errores frecuentes y ejercicios de verificación.' },
      { titulo: 'Documentación y trazabilidad', desc: 'Registros de elaboración, materias primas y controles.' },
      { titulo: 'Elaboración controlada', desc: 'Secuencia, controles en proceso y criterios de liberación.' },
      { titulo: 'Conservación y cierre', desc: 'Estabilidad, condiciones de almacenamiento y plan de mejora.' },
    ],
    faq: [
      {
        q: '¿Esta formación autoriza para formular magistrales?',
        a: 'No. Es formación continua y no sustituye los requisitos académicos, sanitarios o de habilitación que correspondan a la farmacia magistral.',
      },
      {
        q: '¿Trabajan con fórmulas reales de la institución?',
        a: 'Se pueden usar fórmulas de ejemplo o materiales autorizados por la organización. No se comparten datos de pacientes ni fórmulas confidenciales sin acuerdo.',
      },
      {
        q: '¿Incluye preparaciones estériles?',
        a: 'El alcance se define con la institución. Puede cubrir fundamentos de control y documentación, pero no reemplaza el entrenamiento práctico ni la validación de procesos estériles.',
      },
    ],
    relacionados: ['control-de-calidad', 'validaciones-y-calificaciones', 'farmacia-hospitalaria'],
    imagen: '/img/herramienta-farmaceutica.jpg',
    imagenAlt: 'Profesional farmacéutico revisando una fórmula y su documentación',
  },
  {
    slug: 'investigacion-y-desarrollo',
    nombre: 'Investigación y desarrollo',
    categoria: 'area',
    resumen: 'Desarrollo de formulaciones, diseño experimental, estabilidad, escalamiento y transferencia tecnológica.',
    heroTitle: 'Investigación y desarrollo farmacéutico',
    heroLead: 'Formación para convertir una necesidad de producto en una formulación documentada, evaluable y transferible a producción.',
    intro: 'Entre la idea y el producto hay decisiones que deben quedar registradas: por qué se eligió una formulación, cómo se probó, qué variables importan y qué evidencia acompaña el escalamiento. Esta línea acompaña al equipo de I+D en ese recorrido con criterios técnicos y documentación que resiste la revisión de otras áreas.',
    dirigidoA: [
      'Profesionales de I+D y formulación',
      'Equipos de desarrollo analítico',
      'Responsables de escalamiento y transferencia',
      'Profesionales de producción que reciben nuevos productos',
    ],
    organizaciones: [
      'Laboratorios farmacéuticos',
      'Fabricantes y maquiladores',
      'Empresas de suplementos y productos para la salud',
      'Centros o áreas de desarrollo de producto',
    ],
    retos: [
      'Pasar de una idea a una formulación robusta y documentada.',
      'Diseñar experimentos que aporten información útil.',
      'Anticipar el comportamiento del producto en estabilidad.',
      'Escalar sin perder las variables críticas del proceso.',
      'Transferir el conocimiento a producción y calidad.',
    ],
    ejes: [
      {
        titulo: 'Desarrollo de formulaciones',
        desc: 'Selección de componentes, función de cada excipiente y criterios de compatibilidad.',
      },
      {
        titulo: 'Diseño experimental',
        desc: 'Planteamiento de variables, pruebas y análisis de resultados para decidir con evidencia.',
      },
      {
        titulo: 'Estudios de estabilidad',
        desc: 'Diseño, condiciones, tiempos de muestreo y lectura de tendencias.',
      },
      {
        titulo: 'Escalamiento',
        desc: 'Variables críticas, cambios de escala y ajustes entre laboratorio y planta.',
      },
      {
        titulo: 'Transferencia tecnológica',
        desc: 'Documentación, criterios de aceptación y responsabilidades entre áreas.',
      },
    ],
    competencias: [
      'Estructurar el desarrollo con preguntas y variables explícitas.',
      'Diseñar experimentos adecuados al recurso disponible.',
      'Interpretar resultados de estabilidad y formulación.',
      'Identificar puntos críticos de escalamiento.',
      'Preparar documentación de transferencia comprensible.',
    ],
    ruta: [
      { titulo: 'Punto de partida del desarrollo', desc: 'Objetivo del producto, restricciones y criterios de éxito.' },
      { titulo: 'Formulación y experimentos', desc: 'Selección de componentes y diseño de pruebas.' },
      { titulo: 'Estabilidad y escalamiento', desc: 'Variables críticas y evidencia para el cambio de escala.' },
      { titulo: 'Transferencia documentada', desc: 'Paquete de conocimiento y acuerdos con producción y calidad.' },
    ],
    faq: [
      {
        q: '¿Es un curso para descubrir nuevos fármacos?',
        a: 'No. Se enfoca en el desarrollo farmacéutico y de producto: formulación, estabilidad, escalamiento y transferencia.',
      },
      {
        q: '¿Incluye software especializado?',
        a: 'No se incluye licencia de software. Se pueden usar hojas de cálculo y ejercicios con herramientas disponibles en la organización.',
      },
      {
        q: '¿Aplica a suplementos o cosméticos?',
        a: 'Sí, con adaptación al tipo de producto, el mercado y los requisitos que la organización necesite considerar.',
      },
    ],
    relacionados: ['control-de-calidad', 'produccion-y-bpm', 'validaciones-y-calificaciones'],
    imagen: '/img/rutas/investigacion-y-desarrollo.webp',
    imagenAlt: 'Equipo de investigación y desarrollo trabajando en el diseño de una formulación',
  },
  {
    slug: 'aseguramiento-de-la-calidad',
    nombre: 'Aseguramiento de la calidad',
    categoria: 'area',
    resumen: 'Sistemas de calidad, desviaciones, CAPA, control de cambios, gestión de riesgos y auditorías.',
    heroTitle: 'Aseguramiento de la calidad farmacéutica',
    heroLead: 'Formación para sostener un sistema de calidad que funcione en la operación: desviaciones, CAPA, cambios, riesgos y auditorías con criterios comunes.',
    intro: 'El aseguramiento de la calidad no se limita a llenar formatos. Su valor aparece cuando el equipo detecta un problema, lo investiga, decide qué cambiar y verifica que la acción funcionó. Esta línea trabaja ese ciclo con situaciones cercanas a la operación farmacéutica y con la documentación que permite demostrarlo.',
    dirigidoA: [
      'Profesionales de aseguramiento de la calidad',
      'Auditores internos y responsables de sistemas de calidad',
      'Jefaturas de producción, laboratorio y regulatorio',
      'Equipos que gestionan desviaciones y cambios',
    ],
    organizaciones: [
      'Laboratorios y fabricantes',
      'Distribuidores e importadores',
      'Plantas de suplementos y productos para la salud',
      'Servicios farmacéuticos con sistemas de calidad',
    ],
    retos: [
      'Investigar desviaciones con causas claras y verificables.',
      'Evitar CAPA que se cierran sin demostrar eficacia.',
      'Controlar cambios sin generar riesgos nuevos.',
      'Priorizar riesgos con criterios consistentes.',
      'Preparar auditorías internas útiles, no solo correctivas.',
    ],
    ejes: [
      {
        titulo: 'Sistema de calidad y documentos',
        desc: 'Estructura documental, control de versiones, registros y responsabilidades.',
      },
      {
        titulo: 'Desviaciones e investigación',
        desc: 'Contención, análisis de causa, evidencia y criterios para cerrar una investigación.',
      },
      {
        titulo: 'CAPA y eficacia',
        desc: 'Plan de acción, responsables, fechas y verificación de que el problema no reaparece.',
      },
      {
        titulo: 'Control de cambios',
        desc: 'Evaluación de impacto, aprobaciones, implementación y actualización documental.',
      },
      {
        titulo: 'Riesgos y auditorías',
        desc: 'Matriz de riesgos, autoinspección, hallazgos y seguimiento de acciones.',
      },
    ],
    competencias: [
      'Formular hallazgos y desviaciones con información verificable.',
      'Guiar investigaciones de causa con preguntas pertinentes.',
      'Diseñar CAPA con acciones proporcionales al riesgo.',
      'Evaluar cambios y su impacto en el sistema.',
      'Preparar y sostener una auditoría interna.',
    ],
    ruta: [
      { titulo: 'Diagnóstico del sistema', desc: 'Documentos, registros y puntos donde la calidad se vuelve operación.' },
      { titulo: 'Desviaciones y causa raíz', desc: 'Método de investigación y redacción de hallazgos.' },
      { titulo: 'CAPA, cambios y riesgo', desc: 'Acciones, verificación de eficacia y evaluación de impacto.' },
      { titulo: 'Auditoría y mejora', desc: 'Autoinspección, hallazgos y plan de seguimiento.' },
    ],
    faq: [
      {
        q: '¿Garantiza aprobar una auditoría o certificación?',
        a: 'No. La formación fortalece competencias y criterios, pero no promete resultados de auditoría ni sustituye la responsabilidad del sistema de calidad de la organización.',
      },
      {
        q: '¿Incluye una auditoría interna real?',
        a: 'Puede incluirse un ejercicio de autoinspección como parte del alcance formativo. No equivale a una auditoría de certificación ni a una verificación de autoridad.',
      },
      {
        q: '¿Aplica a servicios farmacéuticos?',
        a: 'Sí. Los ejemplos y el alcance se adaptan al tipo de operación y a los procesos que la organización quiera priorizar.',
      },
    ],
    relacionados: ['control-de-calidad', 'validaciones-y-calificaciones', 'produccion-y-bpm'],
    imagen: '/img/rutas/quality-assurance-desde-cero.webp',
    imagenAlt: 'Equipo de aseguramiento de la calidad revisando indicadores y documentación',
  },
  {
    slug: 'control-de-calidad',
    nombre: 'Control de calidad y microbiología',
    categoria: 'area',
    resumen: 'Análisis fisicoquímico y microbiológico, métodos analíticos, resultados fuera de especificación, tendencias y documentación.',
    heroTitle: 'Control de calidad y microbiología en la industria farmacéutica',
    heroLead: 'Formación para analizar con criterio, documentar resultados y decidir qué hacer cuando un dato se sale de lo esperado.',
    intro: 'Un resultado analítico es una decisión técnica y también una evidencia. Esta línea trabaja el método, la lectura del resultado, la investigación cuando algo no cumple y la documentación que permite reconstruir lo que ocurrió. El foco es fortalecer criterios, no reemplazar la práctica supervisada en el laboratorio.',
    dirigidoA: [
      'Analistas de control de calidad',
      'Químicos farmacéuticos de laboratorio',
      'Supervisores de fisicoquímico y microbiología',
      'Equipos de desarrollo analítico',
    ],
    organizaciones: [
      'Laboratorios farmacéuticos',
      'Laboratorios de control y análisis externos',
      'Fabricantes de suplementos y productos para la salud',
      'Plantas con laboratorios propios',
    ],
    retos: [
      'Asegurar que los métodos se ejecuten de forma reproducible.',
      'Investigar resultados fuera de especificación sin conclusiones apresuradas.',
      'Detectar tendencias antes de que se conviertan en fallas.',
      'Documentar cálculos, datos y decisiones analíticas.',
      'Coordinar microbiología con producción y liberación de lotes.',
    ],
    ejes: [
      {
        titulo: 'Métodos analíticos',
        desc: 'Selección, verificación, transferencia y criterios de aceptación.',
      },
      {
        titulo: 'Análisis fisicoquímico',
        desc: 'Ensayos, cálculos, especificaciones y lectura de resultados.',
      },
      {
        titulo: 'Microbiología',
        desc: 'Controles, ambiente, muestras y criterios de interpretación.',
      },
      {
        titulo: 'Resultados fuera de especificación',
        desc: 'Investigación de laboratorio, hipótesis, evidencia y documentación.',
      },
      {
        titulo: 'Tendencias e integridad de datos',
        desc: 'Análisis de series, alertas, registros y trazabilidad de la información.',
      },
    ],
    competencias: [
      'Interpretar resultados frente a especificaciones y criterios.',
      'Documentar una investigación analítica con evidencia.',
      'Reconocer señales de tendencia en los datos.',
      'Coordinar la liberación con producción y calidad.',
      'Mantener integridad y trazabilidad de los registros.',
    ],
    ruta: [
      { titulo: 'Marco de control', desc: 'Especificaciones, métodos y responsabilidades del laboratorio.' },
      { titulo: 'Resultados y decisiones', desc: 'Lectura de datos, OOS y criterios de investigación.' },
      { titulo: 'Microbiología y tendencias', desc: 'Controles, series y alertas tempranas.' },
      { titulo: 'Documentación e integridad', desc: 'Registros, revisión y preparación de evidencias.' },
    ],
    faq: [
      {
        q: '¿Enseñan técnicas de laboratorio con práctica?',
        a: 'La formación puede incluir ejercicios y demostraciones. La práctica de laboratorio depende de las instalaciones y se define en el alcance.',
      },
      {
        q: '¿Incluye validación de métodos?',
        a: 'Puede abordarse como eje, con el nivel de detalle que la organización necesite. No sustituye los protocolos ni la ejecución validada en el sitio.',
      },
      {
        q: '¿Aplica a alimentos o cosméticos?',
        a: 'Sí, adaptando especificaciones, métodos y ejemplos al sector y al mercado de la organización.',
      },
    ],
    relacionados: ['aseguramiento-de-la-calidad', 'validaciones-y-calificaciones', 'produccion-y-bpm'],
    imagen: '/img/rutas/control-de-calidad.webp',
    imagenAlt: 'Analista de control de calidad trabajando en un laboratorio farmacéutico',
  },
  {
    slug: 'produccion-y-bpm',
    nombre: 'Producción y buenas prácticas de manufactura',
    categoria: 'area',
    resumen: 'Operaciones de fabricación, prevención de contaminación, documentación de lotes, controles en proceso y mejora continua.',
    heroTitle: 'Producción farmacéutica y buenas prácticas de manufactura',
    heroLead: 'Formación para ejecutar y supervisar la fabricación con controles claros, documentación completa y una mirada constante a la prevención de contaminación.',
    intro: 'En producción, la calidad se juega en cada cambio de línea, cada registro y cada decisión aparentemente pequeña. Esta línea aterriza las buenas prácticas de manufactura en las operaciones diarias: qué controlar, cómo documentar y cómo sostener el estándar cuando cambian los turnos, los productos o las personas.',
    dirigidoA: [
      'Operarios y supervisores de producción',
      'Jefes de planta y coordinadores de turno',
      'Personal de calidad en piso',
      'Técnicos de procesos y mejora continua',
    ],
    organizaciones: [
      'Laboratorios y fabricantes',
      'Maquiladores y plantas de suplementos',
      'Empresas de productos para la salud',
      'Operaciones con varias líneas o presentaciones',
    ],
    retos: [
      'Prevenir contaminación cruzada y confusiones de materiales.',
      'Completar registros de lote sin retrabajos ni omisiones.',
      'Sostener el despeje de línea entre productos.',
      'Estandarizar controles en proceso entre turnos.',
      'Mejorar sin comprometer la calidad ni la seguridad.',
    ],
    ejes: [
      {
        titulo: 'BPM en la operación',
        desc: 'Principios aplicados a personas, áreas, equipos, materiales y flujo de producción.',
      },
      {
        titulo: 'Prevención de contaminación',
        desc: 'Contaminación cruzada, partículas, limpieza, vestimenta y control de accesos.',
      },
      {
        titulo: 'Operaciones y controles en proceso',
        desc: 'Parámetros críticos, verificaciones, desviaciones y criterios de parada.',
      },
      {
        titulo: 'Documentación de lotes',
        desc: 'Registros simultáneos, correcciones, firmas y trazabilidad de materiales.',
      },
      {
        titulo: 'Despeje y cambio de producto',
        desc: 'Verificación de línea, retiro de materiales y comunicación entre turnos.',
      },
    ],
    competencias: [
      'Explicar y aplicar controles críticos en piso.',
      'Reconocer riesgos de contaminación y actuar.',
      'Documentar el lote con información completa y oportuna.',
      'Coordinar cambios de producto y despeje de línea.',
      'Proponer mejoras compatibles con la calidad.',
    ],
    ruta: [
      { titulo: 'Diagnóstico de piso', desc: 'Flujo de producción, puntos críticos y registros actuales.' },
      { titulo: 'Controles y contaminación', desc: 'Riesgos, barreras y verificación en la operación.' },
      { titulo: 'Lote y cambio de producto', desc: 'Documentación, despeje y comunicación entre turnos.' },
      { titulo: 'Mejora continua', desc: 'Indicadores, acciones y seguimiento en piso.' },
    ],
    faq: [
      {
        q: '¿Es una certificación en BPM?',
        a: 'No. Es formación para fortalecer competencias. No otorga certificación de la planta ni sustituye una inspección o certificación oficial.',
      },
      {
        q: '¿Incluye simulacro de inspección?',
        a: 'Puede diseñarse como parte de la propuesta, con fines formativos y de preparación interna.',
      },
      {
        q: '¿Aplica a cosméticos y suplementos?',
        a: 'Sí, con adaptación a los requisitos y procesos del tipo de producto y del mercado correspondiente.',
      },
    ],
    relacionados: ['aseguramiento-de-la-calidad', 'validaciones-y-calificaciones', 'ingenieria-y-metrologia'],
    imagen: '/img/rutas/produccion-farmaceutica.webp',
    imagenAlt: 'Equipo de producción farmacéutica verificando una línea de fabricación',
  },
  {
    slug: 'asuntos-regulatorios',
    nombre: 'Asuntos regulatorios',
    categoria: 'area',
    resumen: 'Registros sanitarios, expedientes, modificaciones, etiquetado y seguimiento regulatorio según el mercado de interés.',
    heroTitle: 'Asuntos regulatorios en la industria farmacéutica',
    heroLead: 'Formación para gestionar el ciclo de vida de un registro, preparar expedientes y sostener la coherencia entre lo aprobado, lo comunicado y lo que ocurre en la operación.',
    intro: 'Los asuntos regulatorios conectan el producto con la autoridad y con el mercado. El trabajo exige leer la norma, organizar evidencia, anticipar vencimientos y coordinar a varias áreas. Esta línea refuerza ese criterio con un enfoque práctico y adaptado al mercado en el que la organización necesita operar.',
    dirigidoA: [
      'Profesionales de asuntos regulatorios',
      'Químicos farmacéuticos y abogados del área',
      'Equipos de calidad, producción y comercio exterior',
      'Responsables de portafolio y lanzamientos',
    ],
    organizaciones: [
      'Laboratorios y titulares de registro',
      'Importadores y distribuidores',
      'Fabricantes y maquiladores',
      'Empresas de suplementos y productos para la salud',
    ],
    retos: [
      'Mantener el portafolio con vigencias y compromisos bajo control.',
      'Preparar expedientes completos y coherentes.',
      'Clasificar cambios y decidir la vía correcta.',
      'Alinear etiquetas, insertos y piezas con lo aprobado.',
      'Anticipar cambios normativos del mercado de interés.',
    ],
    ejes: [
      {
        titulo: 'Ciclo de vida del registro',
        desc: 'Solicitud, mantenimiento, renovaciones, modificaciones y obligaciones del titular.',
      },
      {
        titulo: 'Expedientes y dossier',
        desc: 'Estructura, módulos, documentos legales y control de versiones.',
      },
      {
        titulo: 'Modificaciones y cambios',
        desc: 'Clasificación, evaluación de impacto y coordinación con calidad y producción.',
      },
      {
        titulo: 'Etiquetado e información',
        desc: 'Coherencia entre texto aprobado, artes finales y comunicación al mercado.',
      },
      {
        titulo: 'Vigilancia regulatoria',
        desc: 'Seguimiento de normas, consultas y cambios que afectan el portafolio.',
      },
    ],
    competencias: [
      'Organizar un calendario regulatorio con fechas críticas.',
      'Estructurar expedientes con información trazable.',
      'Evaluar cambios y su ruta de gestión.',
      'Revisar etiquetas e información con criterio de coherencia.',
      'Comunicar riesgos regulatorios a otras áreas.',
    ],
    ruta: [
      { titulo: 'Mapa del portafolio', desc: 'Registros, vigencias, responsables y documentos críticos.' },
      { titulo: 'Expediente y evidencia', desc: 'Estructura documental y control de versiones.' },
      { titulo: 'Cambios y etiquetado', desc: 'Clasificación, impacto y coherencia de la información.' },
      { titulo: 'Seguimiento y alertas', desc: 'Vigilancia regulatoria y plan de trabajo.' },
    ],
    faq: [
      {
        q: '¿El contenido aplica a cualquier país?',
        a: 'El enfoque se adapta al mercado de interés. Antes de publicar afirmaciones específicas verificamos la norma aplicable y su vigencia.',
      },
      {
        q: '¿Incluye trámites reales ante la autoridad?',
        a: 'No. Se trabajan casos, documentos de ejemplo y criterios de preparación. La radicación y la representación legal corresponden a quien esté facultado.',
      },
      {
        q: '¿Reemplaza una asesoría legal o regulatoria?',
        a: 'No. Es formación para fortalecer criterio y capacidad interna; no sustituye asesoría especializada ni la responsabilidad del titular.',
      },
    ],
    relacionados: ['aseguramiento-de-la-calidad', 'farmacovigilancia', 'produccion-y-bpm'],
    imagen: '/img/escuelas/regulatorios.webp',
    imagenAlt: 'Profesional de asuntos regulatorios revisando un expediente farmacéutico',
  },
  {
    slug: 'farmacovigilancia',
    nombre: 'Farmacovigilancia y seguridad de medicamentos',
    categoria: 'area',
    resumen: 'Identificación, documentación y gestión de reportes, evaluación de información y cultura de seguridad.',
    heroTitle: 'Farmacovigilancia y seguridad de medicamentos',
    heroLead: 'Formación para reconocer, documentar y gestionar información de seguridad, con una mirada que va más allá del reporte y llega a la cultura de seguridad.',
    intro: 'La farmacovigilancia funciona cuando las personas saben qué observar, cómo reportar y por qué su reporte importa. Esta línea trabaja el flujo completo: desde la identificación de una posible reacción o problema hasta la documentación, el seguimiento y la comunicación con las áreas que deben actuar.',
    dirigidoA: [
      'Químicos farmacéuticos de farmacovigilancia',
      'Profesionales de salud que reportan',
      'Equipos de calidad, atención al usuario y regulatorio',
      'Titulares y responsables de producto',
    ],
    organizaciones: [
      'Laboratorios y titulares de registro',
      'Hospitales, clínicas e IPS',
      'Distribuidores y farmacias',
      'Empresas con productos para la salud',
    ],
    retos: [
      'Aumentar la calidad y completitud de los reportes.',
      'Distinguir información relevante de datos incompletos.',
      'Documentar y hacer seguimiento sin perder trazabilidad.',
      'Coordinar la seguridad con calidad y regulatorio.',
      'Fortalecer una cultura de reporte sin temor.',
    ],
    ejes: [
      {
        titulo: 'Marco y responsabilidades',
        desc: 'Qué es farmacovigilancia, quién reporta y cómo se organiza el sistema en la institución.',
      },
      {
        titulo: 'Identificación y reporte',
        desc: 'Fuentes de información, preguntas mínimas y criterios para iniciar un reporte.',
      },
      {
        titulo: 'Documentación y seguimiento',
        desc: 'Registro, completitud, seguimiento y comunicación con el reportante.',
      },
      {
        titulo: 'Evaluación de información',
        desc: 'Lectura crítica de casos, evidencia y señales que requieren revisión.',
      },
      {
        titulo: 'Cultura de seguridad',
        desc: 'Aprendizaje, confidencialidad y acciones para que reportar tenga sentido.',
      },
    ],
    competencias: [
      'Reconocer situaciones que deben reportarse.',
      'Obtener y documentar información mínima de calidad.',
      'Hacer seguimiento a un caso con trazabilidad.',
      'Comunicar hallazgos a las áreas responsables.',
      'Promover una cultura de reporte en el equipo.',
    ],
    ruta: [
      { titulo: 'Punto de partida', desc: 'Responsabilidades, fuentes de reporte y flujo actual.' },
      { titulo: 'Reporte y documentación', desc: 'Preguntas clave, calidad de la información y seguimiento.' },
      { titulo: 'Análisis de casos', desc: 'Lectura de situaciones y coordinación con otras áreas.' },
      { titulo: 'Cultura y mejora', desc: 'Barreras de reporte, comunicación y plan de fortalecimiento.' },
    ],
    faq: [
      {
        q: '¿Enseñan a reportar a la autoridad regulatoria?',
        a: 'Se trabaja el proceso, la documentación y los criterios de reporte. Cada institución aplica los canales y requisitos que le correspondan según su mercado.',
      },
      {
        q: '¿Se usan casos reales?',
        a: 'Se usan casos diseñados para la formación o información desidentificada. No se solicitan datos identificables de pacientes.',
      },
      {
        q: '¿Aplica a dispositivos médicos o alimentos?',
        a: 'Puede adaptarse al alcance de productos de la organización, siempre que se revise la normativa aplicable.',
      },
    ],
    relacionados: ['farmacia-clinica', 'asuntos-regulatorios', 'investigacion-clinica'],
    imagen: '/img/rutas/farmacovigilancia.webp',
    imagenAlt: 'Equipo de farmacovigilancia revisando reportes de seguridad de medicamentos',
  },
  {
    slug: 'validaciones-y-calificaciones',
    nombre: 'Validaciones y calificaciones',
    categoria: 'area',
    resumen: 'Calificación de equipos y sistemas, validación de procesos, limpieza, métodos y sistemas computarizados.',
    heroTitle: 'Validaciones y calificaciones en procesos farmacéuticos',
    heroLead: 'Formación para planear y documentar la calificación de equipos, la validación de procesos y los controles que sostienen la evidencia.',
    intro: 'Validar no es reunir carpetas al final: es demostrar, con evidencia planificada, que un proceso o sistema hace lo que debe hacer de forma consistente. Esta línea trabaja el ciclo completo, desde la definición de requisitos hasta la verificación posterior y el mantenimiento del estado validado.',
    dirigidoA: [
      'Profesionales de validaciones',
      'Equipos de calidad, ingeniería y producción',
      'Responsables de sistemas computarizados',
      'Analistas de laboratorio y desarrollo',
    ],
    organizaciones: [
      'Laboratorios y fabricantes',
      'Plantas de suplementos y productos para la salud',
      'Distribuidores con procesos críticos',
      'Servicios farmacéuticos con equipos y sistemas',
    ],
    retos: [
      'Definir requisitos antes de comprar o modificar un sistema.',
      'Planear calificaciones con alcance y criterios claros.',
      'Validar procesos y limpieza con evidencia representativa.',
      'Mantener el estado validado después del cambio.',
      'Documentar sistemas computarizados e integridad de datos.',
    ],
    ejes: [
      {
        titulo: 'Ciclo de validación',
        desc: 'Plan maestro, URS, evaluación de riesgos, protocolos e informes.',
      },
      {
        titulo: 'Calificación de equipos',
        desc: 'Diseño, instalación, operación y desempeño; criterios y documentación.',
      },
      {
        titulo: 'Validación de procesos',
        desc: 'Enfoque, lotes, parámetros críticos y mantenimiento del estado validado.',
      },
      {
        titulo: 'Limpieza y métodos',
        desc: 'Selección de residuos, límites, muestreo y criterios de aceptación.',
      },
      {
        titulo: 'Sistemas computarizados',
        desc: 'Requisitos, accesos, auditoría, respaldo e integridad de datos.',
      },
    ],
    competencias: [
      'Traducir una necesidad en requisitos verificables.',
      'Diseñar un plan de calificación o validación.',
      'Definir criterios de aceptación y evidencia.',
      'Evaluar el impacto de un cambio en el estado validado.',
      'Documentar de forma revisable por terceros.',
    ],
    ruta: [
      { titulo: 'Requisitos y riesgo', desc: 'URS, criticidad y priorización de sistemas y procesos.' },
      { titulo: 'Calificación de equipos', desc: 'Etapas, protocolos y criterios de aceptación.' },
      { titulo: 'Procesos y limpieza', desc: 'Diseño de validación y muestreo representativo.' },
      { titulo: 'Cierre y mantenimiento', desc: 'Informe, desviaciones, cambios y revisión periódica.' },
    ],
    faq: [
      {
        q: '¿Entregan protocolos listos para usar?',
        a: 'Se pueden trabajar plantillas adaptables como parte del alcance. No son documentos aprobados para un sitio específico ni sustituyen la revisión interna.',
      },
      {
        q: '¿Aplica a equipos que ya están en operación?',
        a: 'Sí. Se puede trabajar la evaluación de brechas y el plan para completar o mantener la calificación.',
      },
      {
        q: '¿Es una certificación de validación?',
        a: 'No. Es formación para fortalecer criterios y prácticas. La aprobación de protocolos e informes corresponde a la organización.',
      },
    ],
    relacionados: ['aseguramiento-de-la-calidad', 'control-de-calidad', 'ingenieria-y-metrologia'],
    imagen: '/img/rutas/validaciones-farmaceuticas.webp',
    imagenAlt: 'Equipo de validaciones revisando protocolos y equipos en planta',
  },
  {
    slug: 'almacenamiento-y-distribucion',
    nombre: 'Almacenamiento, distribución y cadena de frío',
    categoria: 'area',
    resumen: 'Condiciones de almacenamiento, temperatura, transporte, trazabilidad, inventarios y gestión de proveedores.',
    heroTitle: 'Almacenamiento, distribución y cadena de frío',
    heroLead: 'Formación para cuidar el producto desde que llega hasta que se entrega: condiciones, transporte, trazabilidad y control de inventarios.',
    intro: 'Un medicamento puede perder calidad sin que nadie lo note: por una excursión de temperatura, una entrega mal registrada o un inventario que no coincide. Esta línea trabaja los puntos de control del almacenamiento y la distribución para que el equipo pueda detectar, registrar y actuar a tiempo.',
    dirigidoA: [
      'Jefes de almacén y distribución',
      'Regentes y auxiliares de farmacia',
      'Operadores logísticos y transportadores',
      'Equipos de inventarios y abastecimiento',
    ],
    organizaciones: [
      'Distribuidores y operadores farmacéuticos',
      'Droguerías y farmacias',
      'Laboratorios con centros de distribución',
      'Hospitales y clínicas con almacenes',
    ],
    retos: [
      'Mantener condiciones de temperatura y humedad documentadas.',
      'Detectar y gestionar excursiones de cadena de frío.',
      'Conservar trazabilidad entre recepción, almacén y entrega.',
      'Reducir diferencias de inventario y vencimientos.',
      'Evaluar proveedores y transportadores con criterios comunes.',
    ],
    ejes: [
      {
        titulo: 'Condiciones de almacenamiento',
        desc: 'Áreas, segregación, temperatura, humedad, luz y control de plagas.',
      },
      {
        titulo: 'Cadena de frío',
        desc: 'Equipos, monitoreo, alarmas, embalaje y respuesta ante excursiones.',
      },
      {
        titulo: 'Transporte y entrega',
        desc: 'Rutas, vehículos, validación del transporte y evidencia de entrega.',
      },
      {
        titulo: 'Trazabilidad y devoluciones',
        desc: 'Lotes, movimientos, productos devueltos y decisiones de disposición.',
      },
      {
        titulo: 'Inventarios y proveedores',
        desc: 'Conteos, conciliaciones, rotación y evaluación de terceros.',
      },
    ],
    competencias: [
      'Organizar el almacén según condiciones y riesgo.',
      'Interpretar registros de temperatura y actuar ante alarmas.',
      'Documentar la trazabilidad de una entrega.',
      'Investigar diferencias de inventario.',
      'Evaluar proveedores y transportadores con criterios verificables.',
    ],
    ruta: [
      { titulo: 'Mapa de la cadena', desc: 'Recorrido del producto, actores y puntos de control.' },
      { titulo: 'Condiciones y frío', desc: 'Monitoreo, alarmas, embalaje y manejo de excursiones.' },
      { titulo: 'Entrega y trazabilidad', desc: 'Transporte, documentación y devoluciones.' },
      { titulo: 'Inventario y proveedores', desc: 'Conteos, indicadores y evaluación de terceros.' },
    ],
    faq: [
      {
        q: '¿Incluye manejo de productos refrigerados?',
        a: 'Sí. Se trabaja cadena de frío, monitoreo y respuesta ante excursiones, con adaptación a los productos de la organización.',
      },
      {
        q: '¿Aplica a medicamentos de control especial?',
        a: 'Puede incluirse como parte del alcance, revisando los controles y la normativa aplicable al mercado de la organización.',
      },
      {
        q: '¿Es una certificación de transporte?',
        a: 'No. Es formación para fortalecer prácticas y evidencia. No sustituye validaciones, habilitaciones ni requisitos oficiales.',
      },
    ],
    relacionados: ['regentes-de-farmacia', 'auxiliares-de-farmacia', 'aseguramiento-de-la-calidad'],
    imagen: '/img/fotos/servicio-farmaceutico-recepcion.webp',
    imagenAlt: 'Recepción y almacenamiento de medicamentos en un servicio farmacéutico',
  },
  {
    slug: 'investigacion-clinica',
    nombre: 'Investigación clínica',
    categoria: 'area',
    resumen: 'Buenas prácticas clínicas, documentación, manejo del medicamento en investigación y responsabilidades del equipo.',
    heroTitle: 'Investigación clínica y buenas prácticas clínicas',
    heroLead: 'Formación para que el equipo de estudio entienda sus responsabilidades, documente lo que ocurre y maneje el medicamento en investigación con controles claros.',
    intro: 'Un estudio clínico depende de la confianza: en el participante, en el protocolo y en los registros. Esta línea acerca las buenas prácticas clínicas a la operación del centro de investigación, con énfasis en documentación, manejo del medicamento y coordinación entre roles.',
    dirigidoA: [
      'Investigadores y coordinadores de estudios',
      'Químicos farmacéuticos de farmacia de investigación',
      'Personal de enfermería y equipos de estudio',
      'Monitores y responsables de calidad de estudios',
    ],
    organizaciones: [
      'Centros de investigación',
      'Hospitales y clínicas con estudios clínicos',
      'IPS y redes de atención',
      'Organizaciones de investigación por contrato',
    ],
    retos: [
      'Asegurar que cada rol conozca sus responsabilidades.',
      'Documentar visitas, eventos y decisiones del estudio.',
      'Manejar el medicamento en investigación sin perder trazabilidad.',
      'Coordinar la seguridad del participante con farmacovigilancia.',
      'Preparar el centro para monitoreo o auditoría.',
    ],
    ejes: [
      {
        titulo: 'Buenas prácticas clínicas',
        desc: 'Principios, roles y responsabilidades del equipo de investigación.',
      },
      {
        titulo: 'Documentación del estudio',
        desc: 'Registros fuente, historia clínica, visitas y control de versiones.',
      },
      {
        titulo: 'Medicamento en investigación',
        desc: 'Recepción, almacenamiento, dispensación, devolución y trazabilidad.',
      },
      {
        titulo: 'Seguridad y eventos',
        desc: 'Identificación, reporte y coordinación de información de seguridad.',
      },
      {
        titulo: 'Monitoreo y auditoría',
        desc: 'Preparación, hallazgos, acciones y evidencia de seguimiento.',
      },
    ],
    competencias: [
      'Explicar la responsabilidad de cada rol en el estudio.',
      'Mantener registros fuente completos y oportunos.',
      'Organizar el manejo del medicamento en investigación.',
      'Coordinar la información de seguridad del participante.',
      'Preparar el centro para una revisión externa.',
    ],
    ruta: [
      { titulo: 'Marco y roles', desc: 'BPC, responsabilidades y relación con el protocolo.' },
      { titulo: 'Documentación y visita', desc: 'Registros fuente, enmiendas y control documental.' },
      { titulo: 'Medicamento y seguridad', desc: 'Manejo, trazabilidad y reporte de eventos.' },
      { titulo: 'Preparación para monitoreo', desc: 'Evidencia, hallazgos y plan de acción.' },
    ],
    faq: [
      {
        q: '¿Habilita para ser investigador principal?',
        a: 'No. Es formación continua para equipos de estudio y no reemplaza los requisitos de formación, experiencia ni acreditación que exija el estudio o la autoridad.',
      },
      {
        q: '¿Es un curso certificado en BPC?',
        a: 'No otorgamos certificación de un organismo. La formación fortalece competencias y puede acompañarse de constancias internas si se acuerdan.',
      },
      {
        q: '¿Incluye manejo del medicamento en investigación?',
        a: 'Sí. Se aborda recepción, almacenamiento, dispensación, devolución y trazabilidad según el alcance.',
      },
    ],
    relacionados: ['farmacovigilancia', 'farmacia-clinica', 'asuntos-regulatorios'],
    imagen: '/img/escuelas/salud.webp',
    imagenAlt: 'Equipo de investigación clínica revisando documentación de un estudio',
  },
  {
    slug: 'ingenieria-y-metrologia',
    nombre: 'Ingeniería, mantenimiento y metrología',
    categoria: 'area',
    resumen: 'Servicios críticos, mantenimiento, calibración, equipos y coordinación con calidad y producción.',
    heroTitle: 'Ingeniería, mantenimiento y metrología farmacéutica',
    heroLead: 'Formación para que los servicios críticos y los equipos sostengan la operación con evidencia de mantenimiento, calibración y control.',
    intro: 'Cuando un equipo falla, la producción se detiene; cuando una calibración no es trazable, la confianza en los datos también. Esta línea conecta ingeniería y mantenimiento con las áreas de calidad y producción, para que la operación tenga controles visibles y responsabilidades claras.',
    dirigidoA: [
      'Ingenieros y coordinadores de mantenimiento',
      'Responsables de metrología y equipos',
      'Equipos de validaciones y calidad',
      'Supervisores de producción y laboratorio',
    ],
    organizaciones: [
      'Laboratorios y fabricantes',
      'Plantas de suplementos y productos para la salud',
      'Hospitales y clínicas con equipos críticos',
      'Distribuidores con infraestructura de almacenamiento',
    ],
    retos: [
      'Identificar servicios y equipos críticos.',
      'Sostener mantenimiento preventivo y correctivo con evidencia.',
      'Asegurar calibraciones con trazabilidad metrológica.',
      'Coordinar paradas de mantenimiento con producción y calidad.',
      'Documentar cambios y su impacto en la calificación.',
    ],
    ejes: [
      {
        titulo: 'Servicios críticos',
        desc: 'Agua, aire, vapor, gases, climatización y otros servicios que sostienen la calidad.',
      },
      {
        titulo: 'Mantenimiento',
        desc: 'Planes preventivos, atención de fallas, repuestos y registro de intervenciones.',
      },
      {
        titulo: 'Calibración y metrología',
        desc: 'Trazabilidad, incertidumbre, verificación intermedia y criticidad de instrumentos.',
      },
      {
        titulo: 'Equipos y criticidad',
        desc: 'Inventario, clasificación, requisitos de usuario y cambios de equipos.',
      },
      {
        titulo: 'Coordinación con calidad',
        desc: 'Impacto en validaciones, liberación de lotes y manejo de desviaciones.',
      },
    ],
    competencias: [
      'Clasificar equipos y servicios según su criticidad.',
      'Planificar mantenimiento con enfoque de riesgo.',
      'Interpretar certificados y verificar trazabilidad de calibraciones.',
      'Coordinar intervenciones sin comprometer la calidad.',
      'Documentar cambios y su efecto en el estado validado.',
    ],
    ruta: [
      { titulo: 'Inventario y criticidad', desc: 'Equipos, servicios y prioridades de la operación.' },
      { titulo: 'Mantenimiento y metrología', desc: 'Planes, calibración y evidencia.' },
      { titulo: 'Coordinación de paradas', desc: 'Comunicación con producción, calidad y seguridad.' },
      { titulo: 'Cambios y cierre', desc: 'Impacto en validación y registro de intervenciones.' },
    ],
    faq: [
      {
        q: '¿Incluye calibraciones prácticas?',
        a: 'No. Se revisan criterios, documentación y coordinación. Las calibraciones las realiza un laboratorio competente y según los requisitos de la organización.',
      },
      {
        q: '¿Aplica a equipos de laboratorio y de planta?',
        a: 'Sí. Se adapta a los equipos, servicios y procesos de la institución.',
      },
      {
        q: '¿Es una certificación en metrología?',
        a: 'No. Es formación para fortalecer la gestión de equipos y la coordinación con calidad; no sustituye la formación técnica o la acreditación requerida.',
      },
    ],
    relacionados: ['validaciones-y-calificaciones', 'produccion-y-bpm', 'aseguramiento-de-la-calidad'],
    imagen: '/img/empresas/quimica-farmaceutica-en-planta.webp',
    imagenAlt: 'Profesional de ingeniería revisando equipos de una planta farmacéutica',
  },
  {
    slug: 'marketing-farmaceutico',
    nombre: 'Marketing farmacéutico y visita médica',
    categoria: 'area',
    resumen: 'Comunicación científica, lectura crítica, conocimiento de producto, promoción responsable y habilidades comerciales.',
    heroTitle: 'Marketing farmacéutico y visita médica',
    heroLead: 'Formación para comunicar información científica con criterio, conocer el producto y sostener una promoción responsable frente a los profesionales de la salud.',
    intro: 'La visita médica y el marketing farmacéutico trabajan con información que puede influir en decisiones de salud. Por eso necesitan algo más que técnicas de venta: lectura crítica, claridad sobre lo que se puede afirmar y respeto por el rol del profesional. Esta línea fortalece esa combinación.',
    dirigidoA: [
      'Visitadores médicos y equipos de venta',
      'Gerentes de producto y marketing',
      'Equipos de medical affairs',
      'Profesionales que comunican información científica',
    ],
    organizaciones: [
      'Laboratorios farmacéuticos',
      'Distribuidores y casas comerciales',
      'Empresas de dispositivos y suplementos',
      'Agencias y equipos del sector salud',
    ],
    retos: [
      'Comunicar evidencia sin exagerar ni simplificar en exceso.',
      'Conocer el producto y sus límites de uso.',
      'Responder preguntas científicas con fuentes confiables.',
      'Alinear la promoción con la información aprobada.',
      'Fortalecer habilidades comerciales sin perder rigor.',
    ],
    ejes: [
      {
        titulo: 'Lectura crítica de evidencia',
        desc: 'Estudios, fuentes, niveles de evidencia y límites de las conclusiones.',
      },
      {
        titulo: 'Comunicación científica',
        desc: 'Mensajes claros, contexto, preguntas del profesional y manejo de objeciones.',
      },
      {
        titulo: 'Conocimiento de producto',
        desc: 'Indicaciones, precauciones, competencia y comparación responsable.',
      },
      {
        titulo: 'Promoción responsable',
        desc: 'Normativa aplicable, información aprobada y límites de la comunicación.',
      },
      {
        titulo: 'Habilidades comerciales',
        desc: 'Planificación de visitas, seguimiento y relación de largo plazo.',
      },
    ],
    competencias: [
      'Leer y resumir evidencia con criterio.',
      'Construir mensajes científicos claros y verificables.',
      'Explicar el producto sin promesas fuera de indicación.',
      'Reconocer límites regulatorios de la promoción.',
      'Planificar visitas con objetivos y seguimiento.',
    ],
    ruta: [
      { titulo: 'Producto y evidencia', desc: 'Información disponible, fuentes y mensajes permitidos.' },
      { titulo: 'Lectura crítica', desc: 'Interpretación de estudios y límites de las afirmaciones.' },
      { titulo: 'Comunicación en visita', desc: 'Preguntas, objeciones y conversación con el profesional.' },
      { titulo: 'Plan comercial responsable', desc: 'Objetivos, seguimiento y coherencia con la promoción.' },
    ],
    faq: [
      {
        q: '¿Enseñan técnicas para vender más?',
        a: 'Se trabajan habilidades comerciales, pero el enfoque principal es la comunicación responsable y basada en evidencia. No se prometen resultados de ventas.',
      },
      {
        q: '¿Incluye información de nuestros productos?',
        a: 'Puede adaptarse con materiales autorizados por la organización. La revisión y aprobación final de piezas corresponde al titular.',
      },
      {
        q: '¿Aplica a suplementos y dispositivos?',
        a: 'Sí, ajustando la normativa, los mensajes permitidos y el tipo de evidencia disponible.',
      },
    ],
    relacionados: ['asuntos-regulatorios', 'liderazgo-y-gestion', 'datos-e-inteligencia-artificial'],
    imagen: '/img/escuelas/marketing.webp',
    imagenAlt: 'Equipo de marketing farmacéutico preparando una presentación científica',
  },
  {
    slug: 'datos-e-inteligencia-artificial',
    nombre: 'Datos, herramientas digitales e inteligencia artificial',
    categoria: 'area',
    resumen: 'Excel, Power BI, indicadores, automatización, integridad de datos y uso responsable de IA en procesos farmacéuticos.',
    heroTitle: 'Datos, herramientas digitales e inteligencia artificial',
    heroLead: 'Formación para convertir datos de la operación en información útil, con criterios de integridad y supervisión humana.',
    intro: 'Las áreas farmacéuticas producen datos todos los días: lotes, desviaciones, inventarios, indicadores de servicio. El reto no es solo acumularlos, sino analizarlos sin perder contexto y usarlos para decidir. Esta línea trabaja herramientas accesibles y el uso responsable de la IA en procesos regulados.',
    dirigidoA: [
      'Profesionales de calidad, producción y regulatorio',
      'Equipos de cadena de suministro y análisis',
      'Coordinadores y jefaturas',
      'Personal administrativo que gestiona reportes',
    ],
    organizaciones: [
      'Laboratorios y fabricantes',
      'Distribuidores y farmacias',
      'Hospitales y clínicas',
      'Áreas de soporte del sector salud',
    ],
    retos: [
      'Ordenar y analizar datos dispersos.',
      'Construir indicadores que reflejen la operación.',
      'Automatizar reportes repetitivos.',
      'Mantener integridad y trazabilidad de la información.',
      'Usar IA sin delegar el criterio profesional.',
    ],
    ejes: [
      {
        titulo: 'Excel para analizar',
        desc: 'Tablas, fórmulas, filtros, búsquedas y controles básicos de calidad de datos.',
      },
      {
        titulo: 'Tableros con Power BI',
        desc: 'Modelo de datos, visualizaciones e indicadores para seguimiento.',
      },
      {
        titulo: 'Indicadores de proceso',
        desc: 'Definición, fuentes, frecuencia y lectura de tendencias.',
      },
      {
        titulo: 'Automatización',
        desc: 'Tareas repetitivas, plantillas y flujos simples de actualización.',
      },
      {
        titulo: 'Integridad y IA responsable',
        desc: 'Trazabilidad, revisión humana, privacidad y límites de las herramientas.',
      },
    ],
    competencias: [
      'Preparar datos para un análisis confiable.',
      'Construir indicadores y visualizaciones útiles.',
      'Automatizar reportes sin perder control.',
      'Documentar fuentes y transformaciones.',
      'Evaluar el uso de IA con criterios de riesgo.',
    ],
    ruta: [
      { titulo: 'Datos y preguntas', desc: 'Qué se quiere responder y qué datos se necesitan.' },
      { titulo: 'Excel y tableros', desc: 'Análisis, visualización e indicadores.' },
      { titulo: 'Automatización', desc: 'Plantillas y flujos para reducir trabajo repetitivo.' },
      { titulo: 'Integridad e IA', desc: 'Revisión humana, privacidad y documentación.' },
    ],
    faq: [
      {
        q: '¿Requiere saber programar?',
        a: 'No. Se trabaja con herramientas de uso extendido. Si el equipo tiene conocimientos técnicos, el alcance puede profundizar.',
      },
      {
        q: '¿Se usan datos de la empresa?',
        a: 'Se puede trabajar con datos de ejemplo o con datos autorizados y desidentificados. La organización define qué comparte.',
      },
      {
        q: '¿La IA reemplaza el criterio profesional?',
        a: 'No. Se aborda como apoyo con revisión humana, límites claros y responsabilidad sobre las decisiones.',
      },
    ],
    relacionados: ['aseguramiento-de-la-calidad', 'liderazgo-y-gestion', 'investigacion-y-desarrollo'],
    imagen: '/img/rutas/data-y-pharma.webp',
    imagenAlt: 'Profesional farmacéutico analizando indicadores en una herramienta digital',
  },
  {
    slug: 'liderazgo-y-gestion',
    nombre: 'Liderazgo y gestión de equipos farmacéuticos',
    categoria: 'area',
    resumen: 'Comunicación, formación de formadores, gestión de proyectos, liderazgo y coordinación entre áreas.',
    heroTitle: 'Liderazgo y gestión de equipos farmacéuticos',
    heroLead: 'Formación para coordinar personas, proyectos y conversaciones difíciles sin perder el foco técnico ni la calidad de la operación.',
    intro: 'Los equipos farmacéuticos trabajan bajo presión, con turnos, prioridades cambiantes y áreas que dependen unas de otras. Liderar en ese contexto exige comunicación clara, capacidad de formar a otros y herramientas para sostener acuerdos. Esta línea trabaja esas habilidades en situaciones propias del sector.',
    dirigidoA: [
      'Jefaturas y coordinadores de área',
      'Químicos farmacéuticos con equipos a cargo',
      'Supervisores y formadores internos',
      'Responsables de proyectos y procesos',
    ],
    organizaciones: [
      'Laboratorios y fabricantes',
      'Hospitales, clínicas y farmacias',
      'Distribuidores y operadores',
      'Áreas de calidad, producción y regulatorio',
    ],
    retos: [
      'Dar instrucciones claras en operaciones con turnos.',
      'Formar a otras personas sin depender siempre del mismo experto.',
      'Coordinar proyectos entre calidad, producción y regulatorio.',
      'Manejar desacuerdos y conversaciones difíciles.',
      'Sostener el cambio cuando la urgencia vuelve.',
    ],
    ejes: [
      {
        titulo: 'Comunicación',
        desc: 'Instrucciones, retroalimentación, reuniones y conversaciones difíciles.',
      },
      {
        titulo: 'Formación de formadores',
        desc: 'Diseño de una sesión, explicación de procesos y evaluación del aprendizaje.',
      },
      {
        titulo: 'Gestión de proyectos',
        desc: 'Alcance, hitos, responsables, riesgos y seguimiento.',
      },
      {
        titulo: 'Liderazgo de equipos',
        desc: 'Delegación, motivación, manejo de conflictos y toma de decisiones.',
      },
      {
        titulo: 'Coordinación entre áreas',
        desc: 'Acuerdos, prioridades compartidas y gestión de dependencias.',
      },
    ],
    competencias: [
      'Comunicar instrucciones y expectativas con claridad.',
      'Preparar y facilitar una sesión de formación interna.',
      'Planificar un proyecto con hitos y riesgos.',
      'Abordar desacuerdos sin escalar innecesariamente.',
      'Coordinar decisiones entre áreas con intereses distintos.',
    ],
    ruta: [
      { titulo: 'Mapa del equipo', desc: 'Roles, dependencias y principales fricciones.' },
      { titulo: 'Comunicación y formación', desc: 'Prácticas para explicar, retroalimentar y enseñar.' },
      { titulo: 'Proyectos y liderazgo', desc: 'Planificación, delegación y manejo de conflictos.' },
      { titulo: 'Acuerdos de coordinación', desc: 'Compromisos entre áreas y seguimiento.' },
    ],
    faq: [
      {
        q: '¿Es un curso de coaching personal?',
        a: 'No. Es formación aplicada a la gestión de equipos y proyectos en entornos farmacéuticos y de salud.',
      },
      {
        q: '¿Incluye evaluación de desempeño?',
        a: 'Puede abordarse como herramienta de gestión, pero no sustituye los procesos de recursos humanos ni la asesoría laboral de la organización.',
      },
      {
        q: '¿Aplica a equipos técnicos y administrativos?',
        a: 'Sí. Los casos y ejercicios se ajustan a los roles y a la operación de la organización.',
      },
    ],
    relacionados: ['regentes-de-farmacia', 'aseguramiento-de-la-calidad', 'datos-e-inteligencia-artificial'],
    imagen: '/img/carrera/equipo-emprendimiento-farmaceutico.webp',
    imagenAlt: 'Equipo farmacéutico en una reunión de planificación y liderazgo',
  },
];

export const areaPorSlug = (slug) => AREAS_CAPACITACION.find((a) => a.slug === slug) || null;

export const areasPorCategoria = (categoria) => AREAS_CAPACITACION.filter((a) => a.categoria === categoria);

export const areasRelacionadas = (area) => (area?.relacionados || []).map(areaPorSlug).filter(Boolean);

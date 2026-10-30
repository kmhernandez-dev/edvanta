/**
 * ============================================================
 *  marketing.js — Escuela de Marketing y Comunicación
 *
 *  Una sola fuente para la escuela, sus programas en desarrollo y
 *  los servicios de marketing para empresas. Ningún programa nuevo
 *  se presenta como disponible: todos están en desarrollo hasta que
 *  la oferta se valide y se publique en el aula.
 *
 *  Los servicios son líneas bajo propuesta. No hay precios, plazos,
 *  clientes, resultados ni testimonios inventados.
 * ============================================================
 */

export const ESCUELA_MARKETING = {
  slug: 'marketing-y-comunicacion-farmaceutica',
  nombre: 'Escuela de Marketing y Comunicación Farmacéutica',
  corto: 'Marketing y Comunicación',
  eyebrow: 'Escuela de Marketing y Comunicación Farmacéutica',
  titulo: 'Conecta ciencia, estrategia y marketing',
  lead: 'Formación para profesionales y soluciones para empresas que quieren comunicar con claridad en el sector farmacéutico y de la salud.',
  imagen: '/img/escuelas/marketing.webp',
  imagenAlt: 'Equipo revisando piezas de comunicación de salud en una pantalla',
};

/** Las cuatro áreas reales con las que se organiza la escuela. */
export const AREAS_MARKETING = [
  {
    id: 'marketing-farmaceutico',
    nombre: 'Marketing farmacéutico',
    resumen: 'Entender el mercado, los públicos y la planeación de una estrategia de comunicación.',
    aprende: 'Cómo leer el contexto, definir prioridades y convertir una idea de producto o servicio en un plan de comunicación.',
    aplicaciones: [
      'Ordenar públicos y mensajes antes de producir piezas.',
      'Construir una propuesta de valor con límites claros.',
      'Planear contenidos para un ciclo o lanzamiento.',
    ],
    programas: ['marketing-farmaceutico'],
    servicios: ['estrategia-y-posicionamiento'],
    tono: 'lavanda',
  },
  {
    id: 'visita-medica',
    nombre: 'Visita médica',
    resumen: 'Preparar conversaciones profesionales con información clara, contexto y seguimiento.',
    aprende: 'Cómo estructurar una visita, preparar mensajes y sostener una conversación útil sin prometer lo que no corresponde.',
    aplicaciones: [
      'Preparar una visita con objetivo y preguntas.',
      'Explicar información de producto con claridad.',
      'Dar seguimiento a compromisos y objeciones.',
    ],
    programas: ['visita-medica-y-comunicacion-de-valor'],
    servicios: ['materiales-comerciales'],
    tono: 'menta',
  },
  {
    id: 'comunicacion-cientifica',
    nombre: 'Comunicación científica',
    resumen: 'Traducir evidencia en información comprensible, trazable y revisable.',
    aprende: 'Cómo leer una fuente, resumir hallazgos y convertir la evidencia en mensajes que no exageren ni oculten límites.',
    aplicaciones: [
      'Resumir evidencia para un público definido.',
      'Revisar afirmaciones y referencias de un material.',
      'Coordinar la revisión científica y de marca.',
    ],
    programas: ['comunicacion-cientifica-y-evidencia'],
    servicios: ['comunicacion-cientifica'],
    tono: 'menta',
  },
  {
    id: 'contenido-educativo',
    nombre: 'Contenido educativo',
    resumen: 'Planificar piezas que enseñen algo y se adapten a un público concreto.',
    aprende: 'Cómo definir un objetivo de aprendizaje, ordenar contenidos y revisar piezas educativas para profesionales o pacientes.',
    aplicaciones: [
      'Diseñar una secuencia de contenidos educativos.',
      'Adaptar un tema a distintos niveles de conocimiento.',
      'Revisar claridad, tono y llamadas a la acción.',
    ],
    programas: ['contenidos-educativos-en-salud'],
    servicios: ['contenido-digital-y-video'],
    tono: 'lavanda',
  },
];

/**
 * Programas propuestos. Estado `en_desarrollo`: no se venden, no
 * tienen fecha ni certificado anunciado y no entran en el sitemap.
 */
export const PROGRAMAS_MARKETING = [
  {
    slug: 'marketing-farmaceutico',
    area: 'marketing-farmaceutico',
    nombre: 'Marketing farmacéutico',
    linea: 'Marketing y estrategia',
    resumen: 'Comprende el contexto del mercado farmacéutico, define públicos y ordena una estrategia de comunicación.',
    publico: 'Profesionales del sector farmacéutico y de la salud que participan en marketing, comunicación, producto o relaciones con profesionales.',
    resultado: 'Comprender el posicionamiento, los públicos y la planificación de una estrategia de marketing farmacéutico.',
    resultados: [
      'Distinguir los públicos que participan en una decisión de salud y sus intereses.',
      'Formular una propuesta de valor y unos mensajes que se puedan sostener.',
      'Ordenar un plan de comunicación con prioridades y criterios de revisión.',
      'Reconocer los límites regulatorios y editoriales de una pieza.',
    ],
    temario: [
      { titulo: 'Contexto del mercado y públicos', desc: 'Sector farmacéutico, actores, necesidades y momento del producto.' },
      { titulo: 'Posicionamiento y propuesta de valor', desc: 'Qué se ofrece, a quién y con qué evidencia.' },
      { titulo: 'Plan de comunicación', desc: 'Mensajes, canales, contenidos y secuencia.' },
      { titulo: 'Revisión y criterios de medición', desc: 'Revisión científica y de marca; indicadores para aprender.' },
    ],
    metodologia: 'Propuesta de clases virtuales con casos y revisión de piezas. La metodología definitiva se confirmará al abrir el programa.',
    faq: [
      { q: '¿El curso ya está disponible?', a: 'No. Es una propuesta en desarrollo y todavía no tiene fecha de apertura ni matrícula publicada.' },
      { q: '¿Incluye certificado?', a: 'No está confirmado. No anunciamos certificados hasta que la oferta esté validada.' },
      { q: '¿Puedo dejar mis datos?', a: 'Sí. El formulario de esta página registra tu interés para avisarte cuando haya novedades reales.' },
    ],
  },
  {
    slug: 'visita-medica-y-comunicacion-de-valor',
    area: 'visita-medica',
    nombre: 'Visita médica y comunicación de valor',
    linea: 'Visita médica',
    resumen: 'Prepara conversaciones profesionales con objetivos claros, información pertinente y seguimiento.',
    publico: 'Visitadores médicos, equipos comerciales, gerentes de producto y profesionales que se relacionan con el sector salud.',
    resultado: 'Organizar conversaciones profesionales y mensajes claros en la visita médica.',
    resultados: [
      'Preparar una visita con objetivo, información y preguntas.',
      'Explicar información de producto sin exagerar ni ocultar límites.',
      'Manejar objeciones y compromisos con criterios claros.',
      'Registrar el seguimiento de una conversación.',
    ],
    temario: [
      { titulo: 'El contexto de la visita', desc: 'Público, producto, evidencia y expectativas.' },
      { titulo: 'Mensajes y conversación', desc: 'Claridad, preguntas, objeciones y límites de la comunicación.' },
      { titulo: 'Preparación de la visita', desc: 'Objetivo, materiales y secuencia de una conversación.' },
      { titulo: 'Seguimiento responsable', desc: 'Compromisos, registro y coordinación con el equipo.' },
    ],
    metodologia: 'Propuesta de trabajo con casos de visita y ejercicios de conversación. Se confirmará al abrir el programa.',
    faq: [
      { q: '¿Enseña técnicas de venta?', a: 'La propuesta se centra en comunicación profesional y basada en evidencia, no en prometer resultados comerciales.' },
      { q: '¿Incluye información de productos reales?', a: 'Los casos y materiales se definirán con fuentes autorizadas. La aprobación final de piezas corresponde al titular del producto.' },
      { q: '¿El curso ya está disponible?', a: 'No. Es una propuesta en desarrollo y no tiene fecha publicada.' },
    ],
  },
  {
    slug: 'comunicacion-cientifica-y-evidencia',
    area: 'comunicacion-cientifica',
    nombre: 'Comunicación científica y evidencia',
    linea: 'Comunicación científica',
    resumen: 'Aprende a convertir evidencia en información comprensible, trazable y revisable.',
    publico: 'Profesionales de medical affairs, comunicación científica, marketing, asuntos regulatorios y equipos editoriales del sector salud.',
    resultado: 'Traducir evidencia en información comprensible y trazable.',
    resultados: [
      'Leer y resumir una fuente sin cambiar su significado.',
      'Distinguir lo que un estudio permite afirmar de lo que no.',
      'Construir mensajes con referencias y contexto.',
      'Organizar una revisión científica y de marca.',
    ],
    temario: [
      { titulo: 'Lectura de evidencia', desc: 'Diseño, población, resultado y límites de un estudio.' },
      { titulo: 'Del dato al mensaje', desc: 'Cómo resumir sin perder matices ni atribuir causalidad.' },
      { titulo: 'Materiales con referencias', desc: 'Fichas, resúmenes y piezas para distintos públicos.' },
      { titulo: 'Revisión y trazabilidad', desc: 'Fuentes, versiones, aprobación y consistencia.' },
    ],
    metodologia: 'Propuesta de ejercicios de lectura y revisión de materiales. Se confirmará al abrir el programa.',
    faq: [
      { q: '¿Es un curso de estadística?', a: 'No. La propuesta se enfoca en lectura crítica aplicada a comunicación, no en formación estadística avanzada.' },
      { q: '¿Convierte a alguien en aprobador regulatorio?', a: 'No. La aprobación final de un material corresponde a las áreas y titulares responsables.' },
      { q: '¿El curso ya está disponible?', a: 'No. Es una propuesta en desarrollo.' },
    ],
  },
  {
    slug: 'contenidos-educativos-en-salud',
    area: 'contenido-educativo',
    nombre: 'Contenidos educativos en salud',
    linea: 'Contenido educativo',
    resumen: 'Planifica piezas educativas para públicos definidos, con objetivos y criterios de claridad.',
    publico: 'Profesionales que crean contenidos para pacientes, cuidadores, equipos de salud o comunidades.',
    resultado: 'Planificar piezas educativas para públicos definidos.',
    resultados: [
      'Definir un objetivo de aprendizaje y un público concreto.',
      'Ordenar un tema en una secuencia comprensible.',
      'Revisar claridad, tono y accesibilidad de una pieza.',
      'Distinguir educación de consejo clínico individual.',
    ],
    temario: [
      { titulo: 'Público y objetivo', desc: 'Qué necesita entender la persona y para qué.' },
      { titulo: 'Secuencia educativa', desc: 'Del contexto a la acción, sin saltos ni exceso de información.' },
      { titulo: 'Formatos y lenguaje claro', desc: 'Texto, imágenes, preguntas y recursos de apoyo.' },
      { titulo: 'Revisión y límites', desc: 'Fuentes, accesibilidad y separación entre educación y atención clínica.' },
    ],
    metodologia: 'Propuesta de talleres de planeación y revisión de piezas. Se confirmará al abrir el programa.',
    faq: [
      { q: '¿Sirve para contenidos de pacientes?', a: 'La propuesta puede orientarse a pacientes, cuidadores o profesionales. El público se define en el programa.' },
      { q: '¿Reemplaza la revisión médica?', a: 'No. La revisión clínica y la aprobación final corresponden a los responsables de cada organización.' },
      { q: '¿El curso ya está disponible?', a: 'No. Es una propuesta en desarrollo.' },
    ],
  },
  {
    slug: 'ia-aplicada-al-marketing-farmaceutico',
    area: 'marketing-farmaceutico',
    nombre: 'IA aplicada al marketing farmacéutico',
    linea: 'Marketing y tecnología',
    resumen: 'Explora flujos de apoyo a la producción y revisión de contenidos, con criterios de verificación.',
    publico: 'Equipos de marketing, comunicación y medical affairs que quieran entender usos posibles y límites de la IA.',
    resultado: 'Explorar flujos de apoyo a la producción y revisión de contenidos.',
    resultados: [
      'Identificar tareas en las que la IA puede apoyar sin sustituir la revisión.',
      'Diseñar un flujo con verificación de fuentes y aprobación humana.',
      'Reconocer riesgos de exactitud, confidencialidad y sesgo.',
      'Documentar qué se usó y qué se revisó.',
    ],
    temario: [
      { titulo: 'Usos y límites', desc: 'Dónde ayuda, dónde no y qué debe revisarse.' },
      { titulo: 'Flujos de trabajo', desc: 'Borradores, búsqueda, organización y control de versiones.' },
      { titulo: 'Verificación y trazabilidad', desc: 'Fuentes, citas y aprobación humana.' },
      { titulo: 'Riesgos y criterios de uso', desc: 'Confidencialidad, sesgo, exactitud y comunicación responsable.' },
    ],
    metodologia: 'Propuesta de ejercicios con flujos de trabajo y revisión de resultados. No se requiere programar.',
    faq: [
      { q: '¿Enseña a programar?', a: 'No. La propuesta se enfoca en criterios y flujos de trabajo, no en desarrollo de software.' },
      { q: '¿La IA puede aprobar contenidos?', a: 'No. La aprobación y la responsabilidad final siguen siendo humanas y de la organización.' },
      { q: '¿El curso ya está disponible?', a: 'No. Es una propuesta en desarrollo.' },
    ],
  },
  {
    slug: 'analitica-de-marketing-farmaceutico',
    area: 'marketing-farmaceutico',
    nombre: 'Analítica de marketing farmacéutico',
    linea: 'Marketing y medición',
    resumen: 'Selecciona indicadores y entiende el desempeño de una estrategia sin confundir actividad con resultado.',
    publico: 'Equipos de marketing, comunicación y dirección que necesitan leer el desempeño de sus acciones.',
    resultado: 'Seleccionar indicadores y entender el desempeño de una estrategia.',
    resultados: [
      'Relacionar objetivos, públicos y acciones con indicadores.',
      'Distinguir indicadores de actividad, alcance y resultado.',
      'Leer un tablero sin atribuir más de lo que los datos permiten.',
      'Documentar decisiones y siguientes pruebas.',
    ],
    temario: [
      { titulo: 'Objetivos e indicadores', desc: 'Qué se quiere aprender y qué se puede medir.' },
      { titulo: 'Datos disponibles', desc: 'Calidad, límites y contexto de las fuentes.' },
      { titulo: 'Lectura de desempeño', desc: 'Comparaciones, tendencias y explicaciones razonables.' },
      { titulo: 'Decisiones y siguientes pasos', desc: 'Qué cambiar, qué conservar y qué volver a probar.' },
    ],
    metodologia: 'Propuesta de ejercicios con tableros y casos. Se confirmará al abrir el programa.',
    faq: [
      { q: '¿Enseña herramientas específicas?', a: 'La propuesta prioriza criterios de medición. Las herramientas se confirmarán en el programa.' },
      { q: '¿Garantiza mejorar resultados?', a: 'No. La analítica ayuda a entender el desempeño, pero no garantiza resultados comerciales.' },
      { q: '¿El curso ya está disponible?', a: 'No. Es una propuesta en desarrollo.' },
    ],
  },
];

/** Servicios de marketing para empresas. Todos se trabajan bajo propuesta. */
export const SERVICIOS_MARKETING = [
  {
    slug: 'estrategia-y-posicionamiento',
    nombre: 'Estrategia y posicionamiento',
    resumen: 'Ordena qué decir, a quién y con qué prioridad antes de producir piezas.',
    necesidad: 'Aclarar el posicionamiento, los públicos y el plan de comunicación antes de invertir en producción.',
    publico: 'Equipos de marketing, medical affairs, dirección comercial y comunicación de organizaciones del sector salud.',
    entregables: [
      'Diagnóstico de comunicación, públicos y materiales existentes.',
      'Propuesta de valor y mensajes principales.',
      'Plan de comunicación con prioridades y secuencia.',
      'Criterios de revisión científica y de marca.',
    ],
    proceso: [
      { titulo: 'Escuchar y ordenar', desc: 'Objetivo, públicos, materiales y restricciones.' },
      { titulo: 'Definir la idea', desc: 'Posicionamiento y mensajes que se puedan sostener.' },
      { titulo: 'Traducir a un plan', desc: 'Prioridades, canales y contenidos.' },
      { titulo: 'Dejar criterios', desc: 'Revisión, responsables y siguientes decisiones.' },
    ],
    ejemplo: 'campana',
    informacion: [
      'Objetivo de comunicación o de negocio.',
      'Públicos prioritarios y contexto del producto o servicio.',
      'Materiales y mensajes que ya se usan.',
      'Restricciones de marca, evidencia y revisión.',
    ],
    faq: [
      { q: '¿Incluye producción de piezas?', a: 'Puede incluirse en una propuesta posterior. Esta línea ordena la estrategia antes de producir.' },
      { q: '¿Trabajan con productos de prescripción?', a: 'El alcance se define con la organización y las condiciones de comunicación aplicables a cada producto.' },
      { q: '¿Cuánto tarda?', a: 'Depende del alcance y de la información disponible. Se detalla en la propuesta, no se promete un plazo antes de conocer el proyecto.' },
    ],
    estado: 'a_solicitud',
    paqueteRelacionado: null,
  },
  {
    slug: 'comunicacion-cientifica',
    nombre: 'Comunicación científica',
    resumen: 'Convierte evidencia en mensajes y materiales claros, con referencias y revisión.',
    necesidad: 'Explicar evidencia sin exagerar, sin ocultar límites y con fuentes que se puedan verificar.',
    publico: 'Equipos de medical affairs, comunicación científica, marketing y regulatorio.',
    entregables: [
      'Síntesis de evidencia para un público definido.',
      'Narrativa y mensajes con referencias.',
      'Fichas, resúmenes o contenidos científicos.',
      'Registro de fuentes y puntos de revisión.',
    ],
    proceso: [
      { titulo: 'Definir la pregunta', desc: 'Qué necesita entender el público y con qué fuente.' },
      { titulo: 'Leer y sintetizar', desc: 'Hallazgos, límites y contexto.' },
      { titulo: 'Escribir con evidencia', desc: 'Mensajes claros, referencias y lenguaje adecuado.' },
      { titulo: 'Revisar y entregar', desc: 'Verificación de fuentes y revisión acordada.' },
    ],
    ejemplo: 'ficha',
    informacion: [
      'Tema, producto o programa que se quiere comunicar.',
      'Público y nivel de profundidad esperado.',
      'Fuentes y documentos autorizados.',
      'Responsables de revisión científica y de marca.',
    ],
    faq: [
      { q: '¿Revisan la evidencia por nosotros?', a: 'Se puede incluir una revisión de fuentes y consistencia. La aprobación final del material corresponde a la organización.' },
      { q: '¿Pueden usar nuestros documentos internos?', a: 'Sí, cuando la organización los autoriza y define las condiciones de uso.' },
      { q: '¿Garantizan aprobación regulatoria?', a: 'No. La producción y revisión no sustituyen los procesos regulatorios ni la aprobación de la autoridad.' },
    ],
    estado: 'a_solicitud',
    paqueteRelacionado: 'comunicacion-con-evidencia',
  },
  {
    slug: 'materiales-comerciales',
    nombre: 'Materiales comerciales y educativos',
    resumen: 'Produce visual aids, fichas, brochures y presentaciones con un alcance definido.',
    necesidad: 'Tener materiales claros y consistentes para conversaciones comerciales, educación o visita médica.',
    publico: 'Equipos comerciales, de producto, medical affairs y comunicación.',
    entregables: [
      'Visual aid para visita médica.',
      'Ficha de producto o material de apoyo.',
      'Brochure o presentación para un público definido.',
      'Piezas educativas para profesionales o pacientes.',
    ],
    proceso: [
      { titulo: 'Brief y audiencia', desc: 'Objetivo, público, mensaje y formato.' },
      { titulo: 'Estructura', desc: 'Contenido, jerarquía visual y fuentes.' },
      { titulo: 'Producción', desc: 'Piezas para revisión, con versiones controladas.' },
      { titulo: 'Revisión y cierre', desc: 'Ajustes, aprobación y archivos finales.' },
    ],
    ejemplo: 'visual',
    informacion: [
      'Objetivo y público de cada pieza.',
      'Mensajes y fuentes autorizadas.',
      'Identidad visual y restricciones de marca.',
      'Responsables de aprobación.',
    ],
    faq: [
      { q: '¿Quién aprueba el material?', a: 'La organización y las áreas responsables. Edvanta apoya la producción y la revisión de fuentes.' },
      { q: '¿Pueden adaptar materiales existentes?', a: 'Sí, si la organización autoriza su uso y define el alcance de la adaptación.' },
      { q: '¿Incluyen impresión?', a: 'La impresión no se presume. Si se necesita, se define como parte separada del alcance.' },
    ],
    estado: 'a_solicitud',
    paqueteRelacionado: 'comunicacion-con-evidencia',
  },
  {
    slug: 'contenido-digital-y-video',
    nombre: 'Contenido digital y audiovisual',
    resumen: 'Planifica piezas educativas y contenidos digitales; la producción audiovisual se confirma según el alcance.',
    necesidad: 'Sostener una presencia digital educativa con piezas ordenadas y un plan editorial.',
    publico: 'Equipos de marketing, comunicación y educación que publican contenidos para profesionales o pacientes.',
    entregables: [
      'Plan editorial y arquitectura de contenidos.',
      'Piezas educativas para canales digitales.',
      'Guiones y estructura de videos educativos.',
      'Criterios de revisión y actualización.',
    ],
    proceso: [
      { titulo: 'Objetivo y canales', desc: 'Qué se quiere comunicar y dónde se va a publicar.' },
      { titulo: 'Plan editorial', desc: 'Temas, formatos, frecuencia y responsables.' },
      { titulo: 'Producción de contenidos', desc: 'Textos, guiones y piezas para revisión.' },
      { titulo: 'Publicación y aprendizaje', desc: 'Revisión de desempeño y ajustes.' },
    ],
    ejemplo: 'calendario',
    informacion: [
      'Objetivo y públicos de los canales.',
      'Temas y materiales ya disponibles.',
      'Capacidad de producción y revisión.',
      'Restricciones de marca y regulatorias.',
    ],
    faq: [
      { q: '¿Incluye grabación de video?', a: 'La producción audiovisual se confirma según el alcance y los recursos. La página no promete un formato que no se haya acordado.' },
      { q: '¿Trabajan con nuestras cuentas?', a: 'La publicación y los accesos se definen con la organización. Edvanta no publica sin autorización.' },
      { q: '¿Cuántas piezas incluye?', a: 'El volumen depende del plan y se detalla en la propuesta.' },
    ],
    estado: 'a_solicitud',
    paqueteRelacionado: null,
  },
  {
    slug: 'landing-pages-y-campanas',
    nombre: 'Landing pages y campañas digitales',
    resumen: 'Ordena la arquitectura de una campaña, su página y los criterios para leer sus resultados.',
    necesidad: 'Presentar una campaña o programa con un recorrido claro y una medición definida.',
    publico: 'Equipos de marketing, producto y comunicación que lanzan programas, servicios o campañas.',
    entregables: [
      'Arquitectura de contenidos y recorrido de la campaña.',
      'Página de campaña o landing de programa.',
      'Criterios de medición y responsables.',
      'Revisión de mensajes y llamadas a la acción.',
    ],
    proceso: [
      { titulo: 'Objetivo de campaña', desc: 'Qué debe entender o hacer la persona.' },
      { titulo: 'Arquitectura', desc: 'Contenidos, recorrido y llamadas a la acción.' },
      { titulo: 'Producción', desc: 'Página y piezas para revisión.' },
      { titulo: 'Medición', desc: 'Indicadores acordados y siguientes ajustes.' },
    ],
    ejemplo: 'landing',
    informacion: [
      'Objetivo y público de la campaña.',
      'Oferta, mensajes y restricciones.',
      'Canales y materiales existentes.',
      'Responsables de aprobación y medición.',
    ],
    faq: [
      { q: '¿Incluye pauta publicitaria?', a: 'La pauta no se presume. Si se requiere, se define como una parte separada del alcance.' },
      { q: '¿Garantizan conversiones?', a: 'No. Se acuerdan criterios de medición, pero no se prometen resultados comerciales.' },
      { q: '¿Pueden usar nuestra plataforma?', a: 'Sí, si la organización da acceso y define las condiciones de trabajo.' },
    ],
    estado: 'a_solicitud',
    paqueteRelacionado: null,
  },
  {
    slug: 'formacion-de-equipos',
    nombre: 'Formación de equipos',
    resumen: 'Alinea a un equipo comercial o de comunicación en mensajes, evidencia y revisión.',
    necesidad: 'Que el equipo comparta criterios para comunicar con claridad y consistencia.',
    publico: 'Equipos comerciales, de visita médica, marketing, medical affairs y comunicación.',
    entregables: [
      'Plan de formación acordado con la organización.',
      'Sesiones y materiales de apoyo.',
      'Ejercicios y casos adaptados al equipo.',
      'Registro de asistencia y avance.',
    ],
    proceso: [
      { titulo: 'Diagnóstico', desc: 'Perfiles, necesidades y materiales que usa el equipo.' },
      { titulo: 'Diseño', desc: 'Objetivos, contenidos y actividades.' },
      { titulo: 'Ejecución', desc: 'Sesiones y práctica con casos.' },
      { titulo: 'Cierre', desc: 'Registro, aprendizajes y recomendaciones.' },
    ],
    ejemplo: 'programa',
    informacion: [
      'Perfiles y número de participantes.',
      'Necesidades de comunicación o conocimiento de producto.',
      'Materiales y fuentes autorizadas.',
      'Fechas y modalidad que la organización tenga en mente.',
    ],
    faq: [
      { q: '¿Se puede adaptar a un equipo pequeño?', a: 'Sí. El alcance y la modalidad se ajustan al número de participantes y a la necesidad.' },
      { q: '¿Incluye evaluación?', a: 'Puede incluir ejercicios y registro de avance. La evaluación formal se define en la propuesta.' },
      { q: '¿Se relaciona con la formación de la escuela?', a: 'La escuela desarrolla programas abiertos; esta línea diseña una formación para el equipo de una organización.' },
    ],
    estado: 'a_solicitud',
    paqueteRelacionado: 'equipo-que-cuida',
  },
];

export const PROCESO_MARKETING = [
  {
    titulo: 'Diagnóstico',
    trabajo: 'Entender el público, el objetivo, los materiales y las necesidades reales.',
    salida: 'Brief del proyecto',
  },
  {
    titulo: 'Estrategia',
    trabajo: 'Definir mensajes, prioridades, canales y criterios de éxito.',
    salida: 'Plan de trabajo',
  },
  {
    titulo: 'Producción',
    trabajo: 'Preparar contenidos y piezas; coordinar las revisiones científica y de marca cuando correspondan.',
    salida: 'Materiales para aprobación',
  },
  {
    titulo: 'Implementación',
    trabajo: 'Entregar o activar lo acordado según el alcance.',
    salida: 'Entregables implementados',
  },
  {
    titulo: 'Medición',
    trabajo: 'Revisar los indicadores acordados y las oportunidades de mejora.',
    salida: 'Informe y siguientes acciones',
  },
];

export const EJEMPLOS_ENTREGABLES = [
  {
    id: 'ficha',
    titulo: 'Ficha científica',
    desc: 'Una pieza breve con hallazgos, límites y referencias.',
    variante: 'ficha',
  },
  {
    id: 'visual',
    titulo: 'Visual aid',
    desc: 'Una secuencia visual para acompañar una conversación profesional.',
    variante: 'visual',
  },
  {
    id: 'calendario',
    titulo: 'Calendario de contenidos',
    desc: 'Temas, formatos y responsables de un ciclo editorial.',
    variante: 'calendario',
  },
  {
    id: 'landing',
    titulo: 'Landing de campaña',
    desc: 'Una página con recorrido, mensajes y criterios de medición.',
    variante: 'landing',
  },
  {
    id: 'programa',
    titulo: 'Programa de capacitación',
    desc: 'Objetivos, sesiones y materiales para un equipo.',
    variante: 'programa',
  },
];

export const FAQ_MARKETING = [
  {
    q: '¿Quién puede formarse en esta escuela?',
    a: 'Profesionales del sector farmacéutico y de la salud, y personas que trabajan en marketing, comunicación, producto o áreas afines. Los programas están en desarrollo; puedes consultar la propuesta de cada uno.',
  },
  {
    q: '¿Qué programas están abiertos hoy?',
    a: 'Ningún programa nuevo de esta escuela tiene fecha de apertura ni matrícula publicada. Los cursos que ya existen en el catálogo se consultan en /cursos.',
  },
  {
    q: '¿Cómo se personaliza una propuesta para una empresa?',
    a: 'Primero se conversa el objetivo, los públicos, los materiales y las restricciones. Después se entrega una propuesta escrita con alcance y entregables. No hay compromiso antes de revisarla.',
  },
  {
    q: '¿Qué información necesita una empresa para comenzar?',
    a: 'El objetivo de comunicación, los públicos, los materiales que ya usa, las restricciones de marca o regulatorias y las personas responsables de aprobar.',
  },
  {
    q: '¿Los servicios incluyen certificados o aprobación regulatoria?',
    a: 'No se prometen certificados ni aprobaciones. La revisión y la aprobación final de cada material corresponden a la organización y a las autoridades cuando aplique.',
  },
];

export const programaMarketingPorSlug = (slug) => PROGRAMAS_MARKETING.find((p) => p.slug === slug) || null;
export const servicioMarketingPorSlug = (slug) => SERVICIOS_MARKETING.find((s) => s.slug === slug) || null;
export const areaMarketingPorId = (id) => AREAS_MARKETING.find((a) => a.id === id) || null;

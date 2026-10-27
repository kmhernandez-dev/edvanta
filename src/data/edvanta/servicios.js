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
    lema: 'Formación del talento humano',
    escuelas: ['salud', 'calidad', 'regulatorios'],
    necesidad: 'Actualizar a un equipo en temas de su trabajo diario —servicio farmacéutico, calidad, regulatorio o farmacoterapia— sin depender de cursos sueltos que cada persona busca por su cuenta.',
    publico: 'Químicos farmacéuticos, regentes, auxiliares y personal asistencial o técnico de la institución.',
    entregables: [
      'Plan de formación acordado con la institución',
      'Sesiones en vivo por videollamada o cohorte cerrada en el aula virtual de Edvanta',
      'Acceso a cursos virtuales de las escuelas, asignados por grupo',
      'Materiales de apoyo de cada sesión',
      'Registro de asistencia y de avance por participante',
    ],
    modalidad: 'Virtual: en vivo, en el aula o combinada.',
    alcance: 'Se define en la propuesta según el número de personas, los temas y el calendario.',
    estado: 'a_solicitud',
  },
  {
    slug: 'ruta-contigo',
    nombre: 'Ruta Contigo',
    lema: 'Programa educativo para pacientes',
    escuelas: ['salud'],
    necesidad: 'Acompañar con educación a los pacientes de una condición —para que entiendan su tratamiento y lleguen mejor preparados a la consulta— sin recargar al equipo asistencial.',
    publico: 'Pacientes y cuidadores de la población que atiende la institución.',
    entregables: [
      'Ruta educativa diseñada para la condición y la población',
      'Talleres educativos en vivo para pacientes y cuidadores',
      'Guías y agendas de consulta adaptadas a la población',
      'Registro de asistencia a los talleres',
    ],
    modalidad: 'Talleres virtuales en vivo y material digital.',
    alcance: 'Se define por condición, número de talleres y tamaño de la población.',
    aclaracion: 'Es educación para pacientes: no reemplaza la atención clínica ni la consulta individual.',
    estado: 'a_solicitud',
  },
  {
    slug: 'biblioteca-contigo',
    nombre: 'Biblioteca Contigo',
    lema: 'Acceso institucional a recursos revisados',
    escuelas: ['salud', 'calidad', 'regulatorios'],
    necesidad: 'Dar a un equipo o a una población acceso ordenado a cursos y guías de Edvanta, sin comprar uno por uno.',
    publico: 'Colaboradores de la institución o pacientes que la institución quiera incluir.',
    entregables: [
      'Licencias de acceso al aula virtual de Edvanta',
      'Selección de cursos y recursos acordada con la institución',
      'Cuentas creadas por Edvanta para cada participante',
    ],
    modalidad: 'Acceso en línea durante el periodo acordado.',
    alcance: 'Se define por número de licencias, recursos incluidos y duración del acceso.',
    estado: 'a_solicitud',
  },
  {
    slug: 'comunicacion-con-evidencia',
    nombre: 'Comunicación con Evidencia',
    lema: 'Materiales y servicios de comunicación',
    escuelas: ['marketing'],
    necesidad: 'Producir materiales educativos y comerciales del sector farmacéutico que se apoyen en referencias verificables.',
    publico: 'Laboratorios, distribuidoras y empresas del sector, y sus equipos comerciales y de visita médica.',
    entregables: [
      'Fichas de producto y materiales de apoyo para visita médica',
      'Contenidos educativos para profesionales o pacientes',
      'Referencias citadas en cada material',
    ],
    modalidad: 'Producción por encargo, con revisiones acordadas.',
    alcance: 'Se define por tipo y cantidad de piezas.',
    aclaracion: 'La aprobación final del material y el cumplimiento de las normas de publicidad de medicamentos corresponden al titular del producto.',
    estado: 'a_solicitud',
  },
];

export const paquetePorSlug = (slug) => PAQUETES.find((p) => p.slug === slug) || null;

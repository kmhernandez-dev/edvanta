import { readFileSync } from 'node:fs';
import { slugBaseDeCurso, slugify } from '../../api/lib/slugs-publicos.js';
import { PALABRA_CLAVE_DE_PROPIOS } from '../../api/lib/seo-cursos-propios.js';
import { enFrase } from '../../src/lib/seo/titulos.js';

export const CATEGORIA = 'Cursos recomendados';
export const BASE_MD = '/articulos/articulos_edvanta/cursos-recomendados';
export const FECHA = '2026-11-26';

const AREA_POR_CATEGORIA = {
  'Tiroides y autocuidado': 'Autocuidado',
  'Calidad e inocuidad': 'Alimentos',
  'Servicio farmacéutico': 'Servicio farmacéutico',
  'Farmacoterapia': 'Farmacología',
  'Calidad farmacéutica': 'Calidad',
  'Calidad y manufactura': 'Calidad',
  'Asuntos regulatorios': 'Asuntos Regulatorios',
  'Asuntos regulatorios – productos especiales': 'Asuntos Regulatorios',
  'Farmacología': 'Farmacología',
  'Oratoria y presentaciones': 'Habilidades Blandas',
  'Comunicación interpersonal': 'Habilidades Blandas',
  'Liderazgo y relaciones laborales': 'Habilidades Blandas',
  'Servicio al paciente': 'Habilidades Blandas',
};

export const AREA_INFO = {
  Calidad: {
    etiqueta: 'calidad farmacéutica',
    imagen: '/img/escuelas/calidad.webp',
    alt: 'Profesional de calidad farmacéutica revisando registros y procedimientos',
    esSalud: false,
    roles: [
      'analista de calidad',
      'auditor interno',
      'coordinador de sistema de gestión de calidad',
      'jefe de aseguramiento de la calidad',
      'supervisor de producción',
      'regente de farmacia',
    ],
    contexto: [
      'En calidad farmacéutica el trabajo se demuestra con evidencias: un procedimiento que otra persona puede ejecutar, un registro completo y una decisión que se sostiene frente a una auditoría. Quien entiende el tema deja de improvisar y empieza a explicar lo que hace con criterios verificables.',
      'Las inspecciones, los reclamos y las desviaciones ponen a prueba lo que el equipo realmente sabe. La diferencia entre apagar incendios y mejorar de verdad está en dominar los conceptos y en documentar con disciplina.',
      'La calidad atraviesa producción, control, almacenamiento, servicio farmacéutico y atención al paciente. Un curso útil no se queda en la norma: conecta cada requisito con una tarea concreta del puesto de trabajo.',
    ],
    aplica: [
      'Escribir o revisar un procedimiento que otra persona pueda seguir sin preguntarte.',
      'Preparar la evidencia de un proceso antes de una auditoría o una inspección.',
      'Analizar una desviación y proponer una acción correctiva que se pueda verificar.',
      'Explicar un indicador de calidad a alguien que no pertenece al área.',
      'Decidir qué documento controlar, cómo versionarlo y durante cuánto tiempo conservarlo.',
      'Convertir un hallazgo repetido en una mejora del proceso y no solo en un parche.',
    ],
    errores: [
      'Documentar cuando ya pasó todo, en lugar de registrar en el momento en que ocurre.',
      'Copiar procedimientos de otra empresa sin adaptarlos al proceso real.',
      'Confundir corregir el problema con prevenir que vuelva a ocurrir.',
      'Dejar acciones correctivas abiertas durante meses y perder la trazabilidad.',
      'Medir indicadores sin definir antes qué decisión tomará cada uno.',
      'Guardar evidencias en carpetas personales que nadie más puede recuperar.',
      'Creer que la norma es un asunto exclusivo del auditor.',
      'Capacitar una sola vez y no verificar si el equipo aplica lo aprendido.',
    ],
    antes: [
      'vocabulario básico de calidad: proceso, procedimiento, registro, evidencia, desviación y acción correctiva',
      'lectura de una norma o guía oficial sin quedarte en la primera página',
      'manejo de una hoja de cálculo para registrar, filtrar y ordenar datos',
      'redacción de instrucciones claras y breves',
    ],
    indicadores: [
      'tiempo promedio de cierre de una acción correctiva',
      'porcentaje de registros completos en una muestra',
      'número de hallazgos que se repiten entre auditorías',
      'cumplimiento del plan anual de auditorías',
      'adherencia al procedimiento observada en el puesto de trabajo',
    ],
    fuentes: [
      ['INVIMA', 'https://www.invima.gov.co/normograma'],
      ['ISO', 'https://www.iso.org'],
      ['FDA', 'https://www.fda.gov'],
      ['EMA', 'https://www.ema.europa.eu'],
      ['PIC/S', 'https://picscheme.org'],
    ],
  },
  'Asuntos Regulatorios': {
    etiqueta: 'asuntos regulatorios',
    imagen: '/img/escuelas/regulatorios.webp',
    alt: 'Especialista en asuntos regulatorios revisando un expediente sanitario',
    esSalud: false,
    roles: [
      'asistente de asuntos regulatorios',
      'analista de registros sanitarios',
      'especialista en asuntos regulatorios',
      'coordinador de registro sanitario',
      'responsable de etiquetado',
      'profesional de farmacovigilancia',
    ],
    contexto: [
      'Asuntos regulatorios trabaja con dos relojes: el de la norma y el del negocio. Un expediente incompleto retrasa un lanzamiento; una respuesta improvisada a un requerimiento consume semanas de trabajo. El dominio del tema se nota en la calidad del archivo y en la capacidad de anticipar preguntas.',
      'La regulación cambia y no siempre avisa. Quien solo conoce el formato se queda sin criterio cuando aparece una nueva exigencia, una modificación o una observación de la autoridad sanitaria.',
      'El trabajo regulatorio bien hecho conecta desarrollo, calidad, producción y comercialización. No se trata de llenar formularios: se trata de demostrar que el producto cumple y que la empresa puede sostenerlo en el tiempo.',
    ],
    aplica: [
      'Armar un expediente con la información completa y en el orden que exige la autoridad.',
      'Revisar etiquetado, insertos y piezas publicitarias antes de su aprobación.',
      'Preparar una respuesta técnica a un requerimiento con evidencia verificable.',
      'Mantener una matriz de compromisos, versiones y fechas de vencimiento.',
      'Coordinar con calidad y producción los cambios que afectan un registro.',
      'Explicar a otras áreas por qué una modificación aparentemente menor requiere trámite.',
    ],
    errores: [
      'Empezar por el formato y dejar para el final la lectura de la norma aplicable.',
      'Reutilizar un expediente anterior sin revisar diferencias de producto o de país.',
      'No versionar los documentos y perder la historia de los cambios.',
      'Responder un requerimiento sin la evidencia que sostiene la afirmación.',
      'Ignorar actualizaciones normativas hasta que llega una observación.',
      'Trabajar aislado de calidad, producción y farmacovigilancia.',
      'Prometer plazos sin verificar la disponibilidad real de la información.',
      'Dejar la preparación del cierre para la última semana del trámite.',
    ],
    antes: [
      'lectura de normas sanitarias y de sus documentos técnicos',
      'estructura básica de un expediente y de un sistema de gestión documental',
      'redacción técnica clara, sin ambigüedades',
      'uso de matrices de seguimiento y control de versiones',
    ],
    indicadores: [
      'tiempo de respuesta a requerimientos de la autoridad',
      'porcentaje de requerimientos resueltos en la primera respuesta',
      'registros sanitarios vigentes frente a los planificados',
      'documentos con versión controlada en una muestra',
      'hallazgos regulatorios repetidos en auditorías',
    ],
    fuentes: [
      ['INVIMA', 'https://www.invima.gov.co'],
      ['ICH', 'https://www.ich.org'],
      ['FDA', 'https://www.fda.gov'],
      ['EMA', 'https://www.ema.europa.eu'],
    ],
  },
  Farmacología: {
    etiqueta: 'farmacología y farmacoterapia',
    imagen: '/img/escuelas/salud.webp',
    alt: 'Profesional de salud revisando un tratamiento y su seguimiento farmacoterapéutico',
    esSalud: true,
    roles: [
      'químico farmacéutico clínico',
      'farmacéutico hospitalario',
      'regente de farmacia',
      'monitor de farmacovigilancia',
      'docente de ciencias de la salud',
      'estudiante de último año',
    ],
    contexto: [
      'La farmacología se vuelve útil cuando conecta el mecanismo con la decisión: qué revisar antes de dispensar, qué preguntar en el seguimiento y cuándo remitir. Memorizar nombres sin entender el porqué es la forma más rápida de olvidar lo aprendido.',
      'Cada tratamiento tiene una historia: indicación, dosis, duración, interacciones, función renal y hepática, adherencia y efectos adversos. Un curso ordenado ayuda a mirar esa historia completa en lugar de revisar solo la receta.',
      'La seguridad del paciente no depende de una sola persona. Depende de que el equipo comparta un lenguaje, documente los hallazgos y sepa cuándo una señal cotidiana merece una intervención formal.',
    ],
    aplica: [
      'Revisar un tratamiento completo y detectar duplicidades, interacciones o falta de indicación.',
      'Explicar un efecto adverso con palabras que el paciente entienda y registrar el reporte.',
      'Preparar material educativo para un paciente o para el equipo de salud.',
      'Documentar un seguimiento farmacoterapéutico con hallazgos y conducta propuesta.',
      'Ajustar la revisión según edad, peso, embarazo, función renal y hepática.',
      'Distinguir un problema de adherencia de un fracaso terapéutico.',
    ],
    errores: [
      'Memorizar nombres comerciales sin asociarlos a mecanismo, indicación y riesgo.',
      'Revisar la receta sin preguntar por automedicación, suplementos o plantas medicinales.',
      'Ignorar la función renal y hepática al interpretar una dosis.',
      'Confundir un efecto adverso con falta de eficacia del tratamiento.',
      'No documentar la intervención ni la respuesta del prescriptor.',
      'Ajustar por edad sin considerar peso, superficie corporal o contexto clínico.',
      'Prometer resultados o cambios de tratamiento que no corresponden al farmacéutico.',
      'Dejar el seguimiento en una sola consulta y no programar el control.',
    ],
    antes: [
      'fisiología básica de los sistemas que vas a estudiar',
      'farmacocinética: absorción, distribución, metabolismo y eliminación',
      'terminología clínica para leer una historia o una nota de evolución',
      'lectura crítica de fuentes oficiales y guías de práctica',
    ],
    indicadores: [
      'problemas farmacoterapéuticos detectados y documentados',
      'intervenciones aceptadas por el prescriptor',
      'adherencia reportada por el paciente',
      'eventos adversos identificados y reportados',
      'comprensión del paciente sobre su tratamiento',
    ],
    fuentes: [
      ['OMS', 'https://www.who.int'],
      ['INVIMA', 'https://www.invima.gov.co'],
      ['EMA', 'https://www.ema.europa.eu'],
      ['FDA', 'https://www.fda.gov'],
      ['ISMP', 'https://www.ismp.org'],
    ],
  },
  'Habilidades Blandas': {
    etiqueta: 'habilidades blandas y comunicación',
    imagen: '/img/escuelas/habilidades-blandas.webp',
    alt: 'Profesional presentando un caso ante un equipo de salud',
    esSalud: false,
    roles: [
      'profesional de la salud',
      'coordinador de equipo',
      'docente',
      'regente de farmacia',
      'vocero técnico',
      'líder de proyecto',
    ],
    contexto: [
      'El conocimiento técnico abre la puerta, pero la forma de comunicarlo decide si el equipo escucha, si el paciente entiende y si una idea se convierte en acuerdo. Las habilidades blandas no son un adorno: son parte del trabajo profesional.',
      'Una presentación clara ahorra reuniones, una conversación asertiva evita conflictos y una negociación bien preparada protege el tiempo y los recursos. Se entrenan como cualquier otra competencia: con práctica deliberada y retroalimentación.',
      'En salud, comunicar bien también es un asunto de seguridad. Un mensaje ambiguo puede convertirse en un error; una instrucción clara puede prevenir que el paciente abandone un tratamiento.',
    ],
    aplica: [
      'Presentar un caso o un proyecto en cinco minutos sin perder lo esencial.',
      'Dar retroalimentación sobre un error sin humillar a la persona.',
      'Negociar un plazo, un presupuesto o una prioridad con argumentos.',
      'Mediar una conversación difícil entre áreas o entre colegas.',
      'Explicar un tema técnico a un paciente o a una persona sin formación en salud.',
      'Escribir un correo profesional que consiga una respuesta concreta.',
    ],
    errores: [
      'Preparar las diapositivas y no el mensaje que quieres dejar.',
      'Hablar durante toda la reunión y no escuchar lo que el otro necesita.',
      'Evitar una conversación difícil hasta que el problema crece.',
      'Improvisar una presentación importante confiando en la memoria.',
      'No pedir retroalimentación después de una intervención.',
      'Confundir asertividad con agresividad o con pasividad.',
      'Prometer plazos o resultados sin verificar si son posibles.',
      'Usar el mismo lenguaje técnico con todos los públicos.',
    ],
    antes: [
      'una autoevaluación honesta de cómo te comunicas hoy',
      'grabar una presentación corta y observarla sin excusas',
      'lectura básica sobre comunicación, feedback y negociación',
      'práctica con una persona de confianza antes de exponer',
    ],
    indicadores: [
      'acuerdos cumplidos después de una reunión',
      'número de malentendidos o reprocesos por comunicación',
      'retroalimentación recibida sobre claridad',
      'tiempo necesario para llegar a una decisión',
      'participación del equipo en la conversación',
    ],
    fuentes: [],
  },
  'Servicio farmacéutico': {
    etiqueta: 'servicio farmacéutico',
    imagen: '/img/escuelas/calidad.webp',
    alt: 'Equipo de un servicio farmacéutico revisando procesos y preparaciones',
    esSalud: false,
    roles: [
      'químico farmacéutico',
      'regente de farmacia',
      'auxiliar de farmacia',
      'jefe de servicio farmacéutico',
      'coordinador de preparaciones magistrales',
      'auditor de servicios farmacéuticos',
    ],
    contexto: [
      'El servicio farmacéutico convierte la norma en una operación que ocurre todos los días: recepción, almacenamiento, preparación, dispensación, seguimiento y documentación. La calidad del servicio se juega en los detalles que nadie ve hasta que fallan.',
      'Una preparación mal documentada, un área mal clasificada o una dispensación sin verificación pueden convertirse en un problema de seguridad. Por eso conviene estudiar el proceso completo y no solo la tarea que te toca hoy.',
      'La formación en servicio farmacéutico sirve para coordinar personas, recursos y evidencias. El objetivo no es cumplir un checklist, sino sostener un estándar cuando cambian el turno, el paciente o el equipo.',
    ],
    aplica: [
      'Organizar el flujo de una preparación desde la prescripción hasta la entrega.',
      'Clasificar áreas, equipos y condiciones según el riesgo de la operación.',
      'Documentar una preparación o una dispensación con trazabilidad completa.',
      'Diseñar un control que detecte errores antes de que lleguen al paciente.',
      'Capacitar al equipo en una técnica y verificar que se aplica.',
      'Preparar el servicio para una auditoría o una visita de inspección.',
    ],
    errores: [
      'Priorizar la rapidez sobre la verificación en el momento de la entrega.',
      'Mantener registros incompletos porque el sistema no obliga a llenarlos.',
      'Reutilizar materiales o áreas sin comprobar las condiciones.',
      'Capacitar al equipo una vez y no observar la aplicación real.',
      'No diferenciar el nivel de riesgo de cada preparación.',
      'Dejar la trazabilidad para el final del turno.',
      'Confundir la responsabilidad del regente con la del auxiliar.',
      'No documentar los cambios de proceso que se hacen en la práctica.',
    ],
    antes: [
      'lectura de la normativa farmacéutica aplicable a tu servicio',
      'conceptos de riesgo, asepsia y contaminación cruzada',
      'manejo de registros y control documental',
      'observación del flujo real de tu servicio, más allá del manual',
    ],
    indicadores: [
      'porcentaje de preparaciones con registro completo',
      'errores detectados antes de la entrega',
      'cumplimiento de las condiciones del área',
      'tiempo de respuesta en dispensación',
      'hallazgos de auditoría y su cierre',
    ],
    fuentes: [
      ['INVIMA', 'https://www.invima.gov.co/normograma'],
      ['OMS', 'https://www.who.int'],
      ['PIC/S', 'https://picscheme.org'],
    ],
  },
  Autocuidado: {
    etiqueta: 'educación para el autocuidado',
    imagen: '/img/feliz-sin-tiroides-hero-v2.webp',
    alt: 'Persona revisando material educativo sobre el cuidado de la tiroides',
    esSalud: true,
    roles: [
      'químico farmacéutico',
      'regente de farmacia',
      'educador en salud',
      'cuidador',
      'docente',
      'personal de atención al paciente',
    ],
    contexto: [
      'La educación para el autocuidado funciona cuando la persona entiende qué le pasa, qué puede hacer y cuándo debe consultar. No se trata de dar instrucciones sueltas: se trata de construir criterio para tomar decisiones cotidianas con seguridad.',
      'Un material educativo mal explicado puede generar ansiedad o falsas expectativas. Uno bien diseñado respeta el ritmo de la persona, usa lenguaje claro y deja claro qué no debe intentar por su cuenta.',
      'Quien acompaña a un paciente también necesita formación. Saber escuchar, preguntar y derivar a tiempo es parte del trabajo del equipo de salud y de la red de apoyo.',
    ],
    aplica: [
      'Explicar un tema de salud sin tecnicismos innecesarios.',
      'Preparar una conversación educativa con objetivos claros.',
      'Detectar señales de alarma y orientar la consulta oportuna.',
      'Organizar la información de un tratamiento para que el paciente la recuerde.',
      'Diseñar materiales y talleres para pacientes y cuidadores.',
      'Evaluar si la persona comprendió y puede aplicar lo aprendido.',
    ],
    errores: [
      'Dar demasiada información en una sola conversación.',
      'Usar términos técnicos sin comprobar si se entendieron.',
      'Prometer curas o resultados que no están respaldados.',
      'No preguntar por lo que la persona ya cree o ya está haciendo.',
      'Entregar material sin explicarlo ni resolver dudas.',
      'Ignorar el contexto familiar, económico y emocional.',
      'No dejar por escrito los pasos y las señales de alarma.',
      'Confundir educación con indicación de tratamiento.',
    ],
    antes: [
      'conceptos básicos del tema de salud que vas a explicar',
      'técnicas de comunicación clara y escucha activa',
      'lectura de fuentes oficiales para no repetir mitos',
      'conocimiento de la red de servicios a la que puedes derivar',
    ],
    indicadores: [
      'comprensión del paciente sobre lo explicado',
      'consultas oportunas por señales de alarma',
      'adherencia a las recomendaciones educativas',
      'satisfacción con la conversación educativa',
      'uso correcto de los materiales entregados',
    ],
    fuentes: [
      ['OMS', 'https://www.who.int'],
      ['Ministerio de Salud de Colombia', 'https://www.minsalud.gov.co'],
      ['INVIMA', 'https://www.invima.gov.co'],
    ],
  },
  Alimentos: {
    etiqueta: 'inocuidad y manipulación de alimentos',
    imagen: '/img/escuelas/calidad.webp',
    alt: 'Manipulador de alimentos aplicando buenas prácticas de higiene',
    esSalud: false,
    roles: [
      'manipulador de alimentos',
      'supervisor de inocuidad',
      'regente de farmacia',
      'dueño de establecimiento',
      'coordinador de calidad',
      'auditor de buenas prácticas',
    ],
    contexto: [
      'La inocuidad de los alimentos se construye en cada paso: compra, recepción, almacenamiento, preparación, conservación y servicio. Un error pequeño puede afectar a muchas personas y costar la reputación de un establecimiento.',
      'Las buenas prácticas no son un trámite para la inspección. Son la forma de trabajar que protege al consumidor y sostiene el negocio. Quien las entiende puede explicar por qué cada control existe y qué pasa si se salta.',
      'La formación en manipulación de alimentos sirve para tomar decisiones en tiempo real: qué hacer si la nevera falló, cómo separar crudos y cocidos, cuándo desechar un producto y cómo demostrar que se cumplió el proceso.',
    ],
    aplica: [
      'Organizar la recepción y el almacenamiento para evitar contaminación cruzada.',
      'Verificar temperaturas y registrar los controles del día.',
      'Aplicar higiene de manos y del área según el momento de la preparación.',
      'Identificar un producto o un lote que no debe usarse.',
      'Capacitar al equipo en una práctica concreta y verificar su cumplimiento.',
      'Preparar la evidencia para una visita de inspección sanitaria.',
    ],
    errores: [
      'Confiar en la apariencia del alimento en lugar de controlar la temperatura.',
      'Guardar crudos y cocidos juntos sin separación.',
      'Lavar la carne cruda y dispersar contaminación en el fregadero.',
      'Usar el mismo utensilio para alimentos crudos y listos para consumo.',
      'Registrar los controles al final del día y no cuando ocurren.',
      'Descongelar a temperatura ambiente durante horas.',
      'Capacitar sin observar la práctica real en la cocina.',
      'Pensar que la inocuidad es responsabilidad exclusiva del chef o del supervisor.',
    ],
    antes: [
      'conceptos de contaminación física, química y biológica',
      'cadena de frío y zonas de temperatura',
      'higiene personal y limpieza de áreas y utensilios',
      'lectura de la normativa sanitaria aplicable a tu establecimiento',
    ],
    indicadores: [
      'porcentaje de registros de temperatura completos',
      'productos desechados por incumplimiento de condiciones',
      'hallazgos de inspección y su cierre',
      'cumplimiento de higiene observado en el turno',
      'incidentes reportados por contaminación',
    ],
    fuentes: [
      ['INVIMA', 'https://www.invima.gov.co'],
      ['FAO', 'https://www.fao.org'],
      ['OMS', 'https://www.who.int'],
    ],
  },
};

const sinTildes = (texto) => String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const limpiar = (texto) => String(texto ?? '').replace(/\s+/g, ' ').trim();

export function slugDeTema(url) {
  return String(url).replace(/^\/curso-(de|para)-/, '');
}

function inferirArea(curso) {
  if (curso.area) return curso.area;
  return AREA_POR_CATEGORIA[curso.category] || 'Calidad';
}

function cargarInventario() {
  return JSON.parse(readFileSync(new URL('../../docs/auditoria-aula/inventario.json', import.meta.url), 'utf8'));
}

function construirPerfil(curso) {
  const url = `/${slugBaseDeCurso(curso.title)}`;
  const clave = PALABRA_CLAVE_DE_PROPIOS[url];
  if (!clave) return null;
  const area = inferirArea(curso);
  const info = AREA_INFO[area] || AREA_INFO.Calidad;
  const tema = enFrase(clave.replace(/^Curso (de|para)\s+/i, ''));
  const temaCorto = limpiar(curso.title).replace(/^Curso (de|para)\s+/i, '');
  const unidades = [];
  const porUnidad = new Map();
  for (const leccion of curso.lecciones || []) {
    if (!leccion.title) continue;
    const nombre = limpiar(leccion.unidad || 'Contenido del curso');
    if (!porUnidad.has(nombre)) {
      const unidad = { nombre, clases: [] };
      porUnidad.set(nombre, unidad);
      unidades.push(unidad);
    }
    porUnidad.get(nombre).clases.push({
      titulo: limpiar(leccion.title),
      subtitulo: limpiar(leccion.subtitulo || ''),
      palabras: Number(leccion.palabras_contenido) || 0,
    });
  }
  const clases = unidades.flatMap((u) => u.clases);
  const palabras = Number(curso.palabras_contenido) || clases.reduce((s, c) => s + c.palabras, 0);
  const horas = curso.duration_minutes ? Math.round(curso.duration_minutes / 60) : null;
  return {
    id: curso.id,
    titulo: limpiar(curso.title),
    temaCorto,
    url,
    clave,
    tema,
    temaSlug: slugDeTema(url),
    category: curso.category,
    area,
    areaInfo: info,
    publico: curso.publico === 'pacientes' ? 'pacientes y cuidadores' : 'profesionales',
    publicoCrudo: curso.publico,
    nivel: curso.level === 'basico' ? 'básico' : curso.level === 'avanzado' ? 'avanzado' : 'intermedio',
    unidades,
    clases,
    nClases: clases.length,
    nUnidades: unidades.length,
    palabras,
    horas,
    evaluaciones: Number(curso.evaluaciones) || 0,
    preguntas: Number(curso.preguntas) || 0,
    actividades: Number(curso.actividades) || 0,
    foros: Number(curso.foros) || 0,
    esHabilidades: area === 'Habilidades Blandas',
    esSalud: info.esSalud,
  };
}

export function cargarCursos() {
  const inventario = cargarInventario();
  const cursos = inventario.cursos.map(construirPerfil).filter(Boolean);
  for (const curso of cursos) {
    curso.relacionados = cursos
      .filter((otro) => otro.url !== curso.url && otro.area === curso.area)
      .slice(0, 4);
    if (curso.relacionados.length < 2) {
      curso.relacionados = [
        ...curso.relacionados,
        ...cursos.filter((otro) => otro.url !== curso.url && otro.category === curso.category && otro.area !== curso.area),
      ].slice(0, 4);
    }
  }
  return cursos;
}

export const ANGULOS = [
  {
    id: 'guia-de-estudio',
    etiqueta: 'Guía de estudio',
    slug: (p) => `como-estudiar-${p.temaSlug}`,
    titulo: (p) => `Cómo estudiar ${p.temaCorto}: guía práctica para avanzar sin memorizar`,
    seoTitulo: (p) => [`Cómo estudiar ${p.tema}`, `Guía de estudio: ${p.tema}`, `Estudiar ${p.tema}`],
    descripcion: (p) => `Método para estudiar ${p.temaCorto} con el curso de Edvanta: orden de unidades, sesiones de 45 minutos, uso de evaluaciones y repaso espaciado.`,
  },
  {
    id: 'para-que-sirve',
    etiqueta: 'Para qué sirve',
    slug: (p) => `para-que-sirve-${p.temaSlug}`,
    titulo: (p) => `${p.temaCorto}: para qué sirve y qué aprendes a hacer`,
    seoTitulo: (p) => [`Para qué sirve ${p.tema}`, `${p.tema}: para qué sirve`, `Utilidad de ${p.tema}`],
    descripcion: (p) => `Qué problema resuelve ${p.temaCorto}, qué aprendes a hacer, en qué roles se aplica y qué límites tiene el curso.`,
  },
  {
    id: 'temario',
    etiqueta: 'Temario',
    slug: (p) => `temario-${p.temaSlug}`,
    titulo: (p) => `Temario de ${p.temaCorto}: unidades, clases y evaluaciones`,
    seoTitulo: (p) => [`Temario de ${p.tema}`, `Temario: ${p.tema}`, `Unidades de ${p.tema}`],
    descripcion: (p) => `Unidades, clases y evaluaciones del curso ${p.temaCorto}. Qué se estudia, en qué orden y qué conviene repasar antes de empezar.`,
  },
  {
    id: 'plan-30-dias',
    etiqueta: 'Plan de 30 días',
    slug: (p) => `plan-de-30-dias-${p.temaSlug}`,
    titulo: (p) => `Plan de 30 días para estudiar ${p.temaCorto}`,
    seoTitulo: (p) => [`Plan de 30 días: ${p.tema}`, `Estudiar ${p.tema} en 30 días`, `Ruta de 30 días: ${p.tema}`],
    descripcion: (p) => `Plan semanal de 30 días para estudiar ${p.temaCorto} con el curso de Edvanta, con entregables, indicadores y ajustes si te atrasas.`,
  },
  {
    id: 'errores',
    etiqueta: 'Errores frecuentes',
    slug: (p) => `errores-frecuentes-${p.temaSlug}`,
    titulo: (p) => `Errores frecuentes al aprender ${p.temaCorto} y cómo evitarlos`,
    seoTitulo: (p) => [`Errores al aprender ${p.tema}`, `Errores frecuentes: ${p.tema}`, `Qué evitar en ${p.tema}`],
    descripcion: (p) => `Los errores que más se repiten en ${p.temaCorto}, por qué ocurren y qué clase o unidad del curso ayuda a corregirlos.`,
  },
  {
    id: 'aplicacion',
    etiqueta: 'Aplicación en el trabajo',
    slug: (p) => `aplicar-${p.temaSlug}-en-el-trabajo`,
    titulo: (p) => `${p.temaCorto} en el trabajo: ejemplos por rol`,
    seoTitulo: (p) => [`${p.tema} en el trabajo: ejemplos`, `Aplicar ${p.tema}`, `Usar ${p.tema}`],
    descripcion: (p) => `${p.temaCorto} en el trabajo: tareas por rol, evidencia para documentar y un proyecto pequeño de tres semanas.`,
  },
  {
    id: 'faq',
    etiqueta: 'Preguntas frecuentes',
    slug: (p) => `preguntas-frecuentes-${p.temaSlug}`,
    titulo: (p) => `Preguntas frecuentes sobre ${p.temaCorto}`,
    seoTitulo: (p) => [`Preguntas frecuentes: ${p.tema}`, `Dudas sobre ${p.tema}`, `${p.tema}: preguntas`],
    descripcion: (p) => `Respuestas claras sobre ${p.temaCorto}: nivel, tiempo, certificado, acceso, utilidad laboral y cómo elegir un curso.`,
  },
  {
    id: 'comparativa',
    etiqueta: 'Curso o autoaprendizaje',
    slug: (p) => `curso-o-autoaprendizaje-${p.temaSlug}`,
    titulo: (p) => `${p.temaCorto}: curso guiado o aprender por tu cuenta`,
    seoTitulo: (p) => [`${p.tema}: curso o aprender solo`, `Curso o autoaprendizaje: ${p.tema}`, `Estudiar ${p.tema} solo o con curso`],
    descripcion: (p) => `Comparación honesta entre aprender ${p.temaCorto} por tu cuenta y hacerlo con un curso estructurado: tiempo, profundidad, evidencia y costo de oportunidad.`,
  },
];

export function slugDeArticulo(perfil, angulo) {
  return angulo.slug(perfil);
}

export function rutaDeArticulo(perfil, angulo) {
  return `/articulos/${slugDeArticulo(perfil, angulo)}`;
}

export function mdPathDeArticulo(perfil, angulo) {
  return `${BASE_MD}/${slugDeArticulo(perfil, angulo)}.md`;
}

export function normalizar(texto) {
  return sinTildes(String(texto).toLowerCase())
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function hash(texto) {
  let h = 2166136261;
  const s = String(texto);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function elegir(lista, semilla) {
  return lista[hash(semilla) % lista.length];
}

export function limpiarCelda(texto) {
  return limpiar(texto).replace(/\|/g, '/').replace(/\[/g, '(').replace(/\]/g, ')');
}

export { slugify };

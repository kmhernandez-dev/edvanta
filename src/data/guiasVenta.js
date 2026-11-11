/**
 * ============================================================
 *  guiasVenta.js — Una página de venta por guía (/guia/:slug)
 *
 *  Cada guía que se vende en Hotmart tiene su embudo: necesidad
 *  («¿te pasa esto?»), lo que logras, lo que incluye, para quién es,
 *  quién la escribió, la oferta y, para quien duda, WhatsApp.
 *
 *  Reglas de contenido:
 *   · Lo que dice cada guía sale de su propio PDF (índice, «para quién
 *     es», «al terminar podrás») o de su ficha en fst.js / atenfarma.js.
 *     Nada de páginas, cifras, testimonios ni precios inventados.
 *   · El precio lo muestra Hotmart al pagar: aquí no se escribe.
 *   · En salud, todo es educativo y no reemplaza al equipo tratante.
 *
 *  Enlaces de Hotmart: los entregó la dueña el 11-nov-2026. `pago` es
 *  el pago directo; `venta`, la página de venta de Hotmart.
 * ============================================================
 */

import { ebooks as EBOOKS_FST } from './fst.js';
import { productosAtenFarma } from './atenfarma.js';

export const MARCAS = {
  edvanta: {
    nombre: 'Edvanta',
    sello: 'Guías de Edvanta',
    inicio: '/',
    acento: 'navy',
    autora: 'Karla Hernández es química farmacéutica clínica de la Universidad del Atlántico, con experiencia en gestión de calidad ISO 9001, asuntos regulatorios y diseño instruccional. Es cofundadora de Edvanta.',
  },
  atenfarma: {
    nombre: 'AtenFarmaClinic',
    sello: 'AtenFarmaClinic · Farmacia clínica',
    inicio: '/atenfarmaclinic',
    acento: 'teal',
    autora: 'AtenFarmaClinic es la línea de atención y capacitación farmacéutica clínica de Edvanta, dirigida por Karla Hernández, química farmacéutica clínica de la Universidad del Atlántico.',
  },
  fst: {
    nombre: 'Feliz Sin Tiroides',
    sello: 'Feliz Sin Tiroides',
    inicio: '/feliz-sin-tiroides',
    acento: 'violeta',
    autora: 'Karla Hernández es química farmacéutica clínica de la Universidad del Atlántico y también vive sin tiroides. Escribe en lenguaje de paciente, con información verificada y sin promesas.',
  },
};

/* ── Edvanta: guías de Claude y Método LinkedIn ─────────────── */

const AVISO_CLAUDE = ['¿Esta guía es de Anthropic?', 'No. Es una guía independiente de Edvanta: no está afiliada, patrocinada ni respaldada por Anthropic. Claude es una marca de Anthropic, PBC.'];

const EDVANTA = [
  {
    slug: 'claude-control-de-calidad-farmaceutica',
    marca: 'edvanta',
    area: 'calidad',
    titulo: 'Claude para control de calidad farmacéutica · 20 ejercicios',
    antetitulo: 'Ebook · Claude para químicos farmacéuticos',
    h1: 'Haz tus cálculos de control de calidad con Claude, y aprende a verificarlos',
    bajada: '20 ejercicios con caso, datos y prompt: cálculos farmacopeicos, estadística e investigaciones. Comparas cada resultado con una clave de respuestas calculada con código.',
    portada: '/img/guias/claude-control-de-calidad.webp',
    formato: 'Ebook en PDF',
    datos: [['20', 'ejercicios con caso, datos y prompt'], ['3', 'bloques: cálculos, estadística e investigaciones'], ['14', 'referencias USP, ICH, FDA e ISO']],
    dolores: [
      'Le pides un cálculo a Claude o a ChatGPT y no sabes si el resultado es correcto.',
      'Leer sobre cálculos farmacopeicos no basta: en el laboratorio y en las entrevistas te piden hacerlos.',
      'Una investigación fuera de especificación o una carta de control te toman horas.',
    ],
    logros: [
      'Resolver cálculos farmacopeicos con Claude mostrando fórmulas y pasos.',
      'Analizar series de lotes con cartas de control, capacidad y regresión.',
      'Reconocer señales de alerta de integridad de datos.',
      'Conducir la fase de laboratorio de una investigación fuera de especificación.',
      'Verificar cualquier cálculo de Claude antes de confiar en él.',
    ],
    incluye: [
      ['A · Cálculos farmacopeicos (8)', ['Valoración por HPLC con estándar externo', 'Valor de aceptación de uniformidad de contenido', 'Disolución, factor de similitud f2 y Karl Fischer', 'Impurezas con factor de respuesta relativo y recuento microbiano']],
      ['B · Datos y estadística (6)', ['Carta de control I-MR', 'Capacidad de proceso Cp y Cpk', 'Prueba de Grubbs y vida útil por regresión', 'Comparación de dos analistas e integridad de datos']],
      ['C · Investigaciones e informes (6)', ['Fuera de especificación, fase I', 'Revisión de un certificado de análisis', 'Aptitud del sistema cromatográfico y balanza', 'Plan de muestreo por atributos']],
      ['Cierre', ['Clave de respuestas de los 20 ejercicios', 'Verificación y referencias']],
    ],
    paraQuien: ['Analistas de control de calidad', 'Estudiantes de último año de Química Farmacéutica que preparan entrevistas técnicas', 'Docentes de análisis farmacéutico'],
    pago: 'https://pay.hotmart.com/N108445314S?sck=HOTMART_SITE&off=wnheazjg&hotfeature=33',
    venta: 'https://hotmart.com/es/marketplace/productos/claude-para-control-de-calidad-farmaceutica/N108445314S',
    preguntas: [
      ['¿Uso datos reales de mi laboratorio?', 'No. Todos los datos, lotes y productos son ficticios y fueron creados para practicar. La guía pide no compartir datos reales sin autorización de tu empresa.'],
      ['¿Puedo reportar un resultado calculado por Claude?', 'No. Ningún resultado oficial se reporta calculado solo por IA: se reproduce en una hoja de cálculo validada o en el software calificado del laboratorio.'],
      AVISO_CLAUDE,
    ],
    keywords: ['claude control de calidad', 'cálculos farmacopeicos', 'inteligencia artificial control de calidad farmacéutico', 'carta de control I-MR', 'fuera de especificación'],
  },
  {
    slug: 'claude-aseguramiento-de-calidad-farmaceutica',
    marca: 'edvanta',
    area: 'calidad',
    titulo: 'Claude para químicos farmacéuticos en aseguramiento de la calidad',
    antetitulo: 'Ebook · 20 trucos de Claude',
    h1: 'Menos tiempo redactando POE, hallazgos y CAPA. Más tiempo asegurando la calidad.',
    bajada: '20 trucos de Claude para documentos, auditorías y desviaciones. Cada uno con el prompt listo para pegar, qué verificar y su respaldo normativo.',
    portada: '/img/guias/claude-aseguramiento-de-calidad.webp',
    formato: 'Ebook en PDF',
    datos: [['20', 'trucos con el prompt listo para pegar'], ['3', 'bloques: documentos, auditorías y CAPA'], ['1', 'plantilla de investigación imprimible']],
    dolores: [
      'Cada POE, acta o desviación empieza en una hoja en blanco.',
      'Las investigaciones terminan en «error humano» y la CAPA no se puede medir.',
      'Se acerca una visita sanitaria y tu equipo no ha practicado.',
    ],
    logros: [
      'Producir documentos del sistema de calidad con formato y lenguaje consistentes.',
      'Preparar autoinspecciones y entrenar a tu equipo para una visita sanitaria.',
      'Redactar hallazgos y desviaciones objetivos y sin juicios.',
      'Conducir análisis de causa raíz que no terminen en «error humano».',
      'Formular CAPA medibles con verificación de eficacia.',
    ],
    incluye: [
      ['A · Documentos (7)', ['La plantilla maestra y del texto al flujograma', 'Comparador de versiones y detector de contradicciones', 'Lenguaje del operario', 'Matriz de trazabilidad normativa y del POE al registro']],
      ['B · Auditorías (6)', ['Lista de chequeo con criterio y auditor simulado', 'Plan anual basado en riesgo', 'El hallazgo bien escrito y la respuesta al acta de visita', 'Calificación de proveedores']],
      ['C · Desviaciones y CAPA (7)', ['Descripción sin juicios y clasificación por riesgo', 'Los 5 porqués y el Ishikawa', 'El desafío al «error humano» y CAPA medibles', 'Tendencias y revisión anual de producto']],
      ['Cierre', ['Plantilla de investigación de desviaciones', 'Errores frecuentes y lista de verificación']],
    ],
    paraQuien: ['Aseguramiento de calidad y gestión documental', 'Auditoría interna', 'Jefes de producción', 'Directores técnicos de distribuidoras'],
    pago: 'https://pay.hotmart.com/M108434287T?sck=HOTMART_SITE&off=627c9uzi&hotfeature=33',
    venta: 'https://hotmart.com/es/marketplace/productos/claude-para-quimicos-farmaceuticos-en-aseguramiento-de-la-calidad/M108434287T',
    // Misma guía publicada en Hotmart con otra portada. Se conserva para no perder el enlace.
    alterno: { titulo: '20 trucos de Claude para aseguramiento de calidad farmacéutica', pago: 'https://pay.hotmart.com/V108433326Q?sck=HOTMART_PRODUCT_PAGE&off=r0uh6qlt&hotfeature=32', venta: 'https://hotmart.com/es/marketplace/productos/20-trucos-de-claude-para-aseguramiento-de-calidad-farmaceutica/V108433326Q' },
    preguntas: [
      ['¿Claude decide la clasificación de una desviación?', 'No. La clasificación de una desviación, un hallazgo o una CAPA la decide el responsable de calidad con su procedimiento. Claude redacta borradores, organiza y cuestiona.'],
      ['¿Los documentos quedan listos para usar?', 'Son borradores. Nada es un documento controlado hasta que pasa por revisión, aprobación y tu sistema documental.'],
      AVISO_CLAUDE,
    ],
    keywords: ['claude aseguramiento de calidad', 'IA para POE', 'CAPA medibles', 'auditoría interna farmacéutica', 'desviaciones BPM'],
  },
  {
    slug: 'claude-farmacia-asistencial',
    marca: 'edvanta',
    area: 'farmacia-clinica',
    titulo: '20 prompts de Claude para químicos farmacéuticos asistenciales',
    antetitulo: 'Ebook · Claude para químicos farmacéuticos',
    h1: 'Más tiempo con el paciente. Menos tiempo frente al formato.',
    bajada: '20 prompts para ordenar el caso, detectar problemas, documentar y educar con Claude, sin delegar el juicio clínico.',
    portada: '/img/guias/claude-farmacia-asistencial.webp',
    formato: 'Ebook en PDF',
    datos: [['20', 'prompts para la práctica clínica'], ['7', 'etapas del Método Dáder'], ['1', 'hoja de intervención imprimible']],
    dolores: [
      'Resuelves problemas de medicamentos con información incompleta y poco tiempo.',
      'La nota SOAP, la conciliación y el reporte de farmacovigilancia se comen tu turno.',
      'Explicarle al paciente o al cuidador en lenguaje claro te toma más tiempo del que tienes.',
    ],
    logros: [
      'Estructurar casos y detectar resultados negativos asociados a la medicación con el Método Dáder.',
      'Apoyar la conciliación, las interacciones y el ajuste renal con cálculos verificables.',
      'Documentar sospechas de reacciones adversas y errores de medicación.',
      'Crear material educativo en lenguaje claro para pacientes y cuidadores.',
      'Responder consultas de información de medicamentos con referencias.',
    ],
    incluye: [
      ['A · Seguimiento farmacoterapéutico (6)', ['Del apunte a la nota SOAP', 'Estado de situación y RNM', 'Conciliación al ingreso o al egreso', 'Interacciones priorizadas y función renal']],
      ['B · Seguridad del paciente (5)', ['Causalidad con el algoritmo de Naranjo', 'Reporte de farmacovigilancia', 'Análisis de un error de medicación', 'Alto riesgo y desprescripción en el adulto mayor']],
      ['C · Educación al paciente (4)', ['Material en lenguaje claro', 'Calendario de administración', 'Consejería para la adherencia', 'Indicaciones de egreso para el cuidador']],
      ['D · Gestión del servicio (5)', ['Consulta de información de medicamentos', 'Lectura crítica de un ensayo clínico', 'Desabastecimiento y alternativas', 'Ronda clínica y capacitación a enfermería']],
    ],
    paraQuien: ['QF de servicio hospitalario y de atención ambulatoria', 'Programas de pacientes crónicos', 'Gestores farmacéuticos y centros de información de medicamentos'],
    pago: 'https://pay.hotmart.com/J108433683Q?sck=HOTMART_PRODUCT_PAGE&off=lkaxz893&hotfeature=32',
    venta: 'https://hotmart.com/es/marketplace/productos/20-prompts-de-claude-para-quimicos-farmaceuticos-asistenciales/J108433683Q',
    preguntas: [
      ['¿Puedo pegar datos de mis pacientes?', 'Solo datos desidentificados. Lo que va entre [CORCHETES] se reemplaza por los datos del caso, siempre sin identificar al paciente.'],
      ['¿Claude toma las decisiones clínicas?', 'No. Los prompts te ayudan a ordenar, documentar y educar; el juicio clínico sigue siendo tuyo.'],
      AVISO_CLAUDE,
    ],
    keywords: ['prompts para químicos farmacéuticos', 'claude farmacia clínica', 'método Dáder', 'nota SOAP farmacéutica', 'conciliación de medicamentos'],
  },
  {
    slug: 'claude-automatizacion-de-tareas-farmaceuticas',
    marca: 'edvanta',
    area: 'gestion',
    titulo: 'Automatización de tareas para químicos farmacéuticos',
    antetitulo: 'Guía práctica · 10 automatizaciones con Claude',
    h1: 'Deja de repetir tareas. Diseña flujos que trabajan por ti cada semana.',
    bajada: '10 automatizaciones con Claude para documentos, información y seguimiento del servicio farmacéutico. Con la instrucción lista para copiar y el control humano en cada flujo.',
    portada: '/img/guias/claude-automatizacion-de-tareas.webp',
    formato: 'Guía en PDF',
    datos: [['10', 'automatizaciones listas para configurar'], ['5', 'herramientas de Claude, de simple a avanzada'], ['30', 'días de plan para implementarlas']],
    dolores: [
      'Cada semana haces el mismo informe, la misma acta y el mismo correo.',
      'Los vencimientos, las alertas sanitarias y los planes de acción se te escapan.',
      'Quieres usar IA en el servicio sin perder el control ni la aprobación humana.',
    ],
    logros: [
      'Configurar un Proyecto de Claude con instrucciones y archivos de referencia.',
      'Programar una tarea recurrente con un resultado verificable.',
      'Conectar Gmail, Calendar o Drive sin perder la aprobación humana.',
      'Convertir un Excel recurrente en un tablero reutilizable.',
      'Documentar los límites y responsables de cada automatización.',
    ],
    incluye: [
      ['A · Documentos que se escriben solos', ['Asistente de POE con formato institucional', 'Fichas de medicamento estandarizadas', 'Capacitación desde un POE']],
      ['B · Información que llega sola', ['Boletín semanal de alertas sanitarias', 'Bandeja del servicio farmacéutico ordenada', 'Centro de información de medicamentos']],
      ['C · Seguimiento que no se olvida', ['Semáforo de vencimientos', 'Actas del Comité de Farmacia y Terapéutica', 'Seguimiento de planes de acción y CAPA', 'Informe mensual de indicadores']],
      ['Cierre', ['Tu plan de 30 días y tu propia automatización', 'Lista de verificación y referencias']],
    ],
    paraQuien: ['Jefes de servicio farmacéutico y regentes de farmacia', 'QF de droguería y hospital', 'Distribución, logística y aseguramiento de calidad'],
    aviso: 'Las tareas programadas de Claude requieren un plan de pago y la app de escritorio.',
    pago: 'https://pay.hotmart.com/F108434059E?sck=HOTMART_PRODUCT_PAGE&off=ci9s5vqp&hotfeature=32',
    venta: 'https://hotmart.com/es/marketplace/productos/automatizacion-de-tareas-para-quimicos-farmaceuticos/F108434059E',
    alterno: { titulo: '10 automatizaciones con Claude para el trabajo farmacéutico', pago: 'https://pay.hotmart.com/C108432204B?sck=HOTMART_SITE&off=gcmyg9b1&hotfeature=33', venta: 'https://hotmart.com/es/marketplace/productos/10-automatizaciones-con-claude-para-quimicos-farmaceutica/C108432204B' },
    preguntas: [
      ['¿Necesito un plan de pago de Claude?', 'Para las tareas programadas, sí: requieren un plan de pago y la app de escritorio. La guía va de la herramienta más simple a la más avanzada.'],
      ['¿Qué no se debe automatizar?', 'Cada ficha dice qué verificar y qué nunca se automatiza, y quién revisa y aprueba cada salida antes de usarla.'],
      AVISO_CLAUDE,
    ],
    keywords: ['automatización farmacia', 'claude para químicos farmacéuticos', 'IA servicio farmacéutico', 'automatizar informes farmacia', 'comité de farmacia y terapéutica'],
  },
  {
    slug: 'metodo-linkedin-edutin',
    marca: 'edvanta',
    area: 'carrera',
    titulo: 'Método LinkedIn × Edutin',
    antetitulo: 'Guía práctica · Edición 2026',
    h1: 'Genera ingresos recomendando cursos gratuitos en LinkedIn',
    bajada: 'El sistema que Karla usa cada día como afiliada de Edutin Academy: qué publicar, a quién, a qué hora y cómo responder. Paso a paso y con sus números reales.',
    portada: '/img/guias/metodo-linkedin-edutin.webp',
    formato: 'Guía en PDF + banco de copies en Excel',
    datos: [['12', 'módulos con una tarea al final de cada uno'], ['1.050', 'copies en español y portugués'], ['30', 'días de plan, semana por semana']],
    prueba: [['34.700+', 'seguidores en LinkedIn'], ['2.213', 'comentarios en una sola publicación'], ['USD 3.110', 'de beneficio en una sola campaña'], ['45 min', 'al día, sin pagar anuncios']],
    aviso: 'Las cifras son los resultados de Karla, no una promesa ni un resultado típico. Tus ingresos dependen de tu red, tu nicho y las condiciones vigentes del programa: puedes ganar más, menos o nada.',
    dolores: [
      'Tienes seguidores en LinkedIn, pero publicar no te deja ingresos.',
      'No sabes qué escribir, a qué hora publicar ni cómo responder sin sonar a vendedor.',
      'Has oído de los programas de afiliados, pero no sabes por dónde empezar.',
    ],
    logros: [
      'Entender cómo funciona el programa de afiliados de Edutin.',
      'Armar un perfil de LinkedIn que convierte.',
      'Elegir tu nicho, tus rutas y tus enlaces ancla.',
      'Escribir con fórmulas de copy y publicar contenido de valor.',
      'Sostener una rutina diaria con métricas y evitar los errores que cuestan dinero.',
    ],
    incluye: [
      ['Fase 1 · Preparar', ['Cómo funciona el programa de afiliados', 'La matemática de los USD 600', 'Un perfil que convierte']],
      ['Fase 2 · Atraer', ['Nicho, rutas y enlaces ancla', 'Las fórmulas de copy', 'Contenido de valor e infografías']],
      ['Fase 3 · Convertir', ['Palabra clave y mensajes', 'La rutina diaria y las métricas', 'Los errores que cuestan dinero']],
      ['Fase 4 · Escalar', ['Páginas de LinkedIn', 'Tu sitio web de cursos', 'WhatsApp, portugués, cupones y referidos']],
      ['Anexos', ['Plan de 30 días', 'Cinco plantillas para copiar y adaptar', 'Banco de 1.050 copies, reglas y aspectos legales']],
    ],
    paraQuien: ['Profesionales con presencia en LinkedIn', 'Quienes nunca han vendido por internet', 'Creadores de contenido educativo'],
    pago: 'https://pay.hotmart.com/F108348549T?sck=HOTMART_PRODUCT_PAGE&off=og80q4g7&hotfeature=32',
    venta: 'https://hotmart.com/es/marketplace/productos/metodo-linkedin-x-edutin-genera-ingresos-con-edutin-affiliates-y-linkedin/F108348549T',
    preguntas: [
      ['¿Necesito pagar anuncios?', 'No. El método trabaja con publicaciones orgánicas en LinkedIn; Karla le dedica unos 45 minutos al día.'],
      ['¿Me garantiza ingresos?', 'No. Las cifras son de Karla y no son un resultado típico. Tus ingresos dependen de tu red, tu nicho y las condiciones vigentes del programa de afiliados.'],
      ['¿Necesito experiencia vendiendo?', 'No. La guía está pensada para aplicarla desde el primer día, aunque nunca hayas vendido nada por internet.'],
    ],
    keywords: ['método linkedin edutin', 'edutin affiliates', 'ganar dinero con linkedin', 'afiliados cursos gratis', 'marketing de afiliados linkedin'],
  },
];

/* ── AtenFarmaClinic: farmacia clínica ──────────────────────── */

const AF = Object.fromEntries(productosAtenFarma.map((p) => [p.id, p]));
const af = (id, extra) => ({
  marca: 'atenfarma',
  area: 'farmacia-clinica',
  titulo: AF[id].name,
  antetitulo: `${AF[id].tag || 'Guía'} · Farmacia clínica`,
  bajada: AF[id].description,
  portada: null,
  formato: 'Material digital en Hotmart',
  venta: AF[id].hotmartUrl,
  productoId: id,
  ...extra,
});

const ATENFARMA = [
  af('afc-01', {
    slug: 'atencion-farmaceutica-fibrosis-quistica',
    h1: 'Acompaña al paciente con fibrosis quística con un plan farmacéutico ordenado',
    dolores: ['El paciente llega con muchos medicamentos y la consulta es corta.', 'Las interacciones y la adherencia son difíciles de seguir en un tratamiento tan complejo.', 'No tienes un esquema claro para el seguimiento clínico.'],
    logros: ['Organizar el manejo de los medicamentos del paciente.', 'Trabajar la adherencia y las interacciones.', 'Planear el seguimiento clínico desde la farmacia.'],
    paraQuien: ['Químicos farmacéuticos clínicos y hospitalarios', 'Equipos que atienden enfermedades respiratorias crónicas', 'Estudiantes de último año de Química Farmacéutica'],
    keywords: ['atención farmacéutica fibrosis quística', 'farmacia clínica fibrosis quística'],
  }),
  af('afc-02', {
    slug: 'atencion-farmaceutica-hipertension-arterial',
    h1: 'Mejora el control de la presión arterial de tus pacientes desde la farmacia',
    dolores: ['Tus pacientes hipertensos no llegan a la meta y no sabes por qué.', 'La adherencia cae y el ajuste del tratamiento depende de datos que nadie registra.', 'Educar al paciente se queda en recomendaciones generales.'],
    logros: ['Monitorizar la presión arterial con un método.', 'Apoyar el ajuste del tratamiento con información ordenada.', 'Mejorar la adherencia y educar al paciente.'],
    paraQuien: ['Químicos farmacéuticos de programas de riesgo cardiovascular', 'Regentes y QF de droguería', 'Estudiantes de farmacia clínica'],
    keywords: ['atención farmacéutica hipertensión', 'seguimiento farmacoterapéutico HTA'],
  }),
  af('afc-03', {
    slug: 'entrevista-farmaceutica-avanzada',
    h1: 'Haz las preguntas que revelan lo que el paciente no te cuenta',
    dolores: ['El paciente responde «sí» a todo y la información importante no aparece.', 'Te cuesta hablar de adherencia sin que el paciente se sienta juzgado.', 'Sales de la entrevista sin los datos que necesitas para intervenir.'],
    logros: ['Aplicar técnicas avanzadas de comunicación clínica.', 'Usar la entrevista motivacional en la práctica farmacéutica.', 'Obtener la información que necesitas para una atención centrada en el paciente.'],
    paraQuien: ['Químicos farmacéuticos asistenciales', 'Profesionales de programas de pacientes crónicos', 'Estudiantes que inician su práctica clínica'],
    keywords: ['entrevista farmacéutica', 'entrevista motivacional farmacia'],
  }),
  af('afc-04', {
    slug: 'fundamentos-gestion-integral-farmacoterapia',
    h1: 'Gestiona la farmacoterapia de principio a fin: evalúa, interviene y mide',
    dolores: ['Haces seguimiento, pero sin un método que puedas explicar y repetir.', 'Tus intervenciones no quedan conectadas con resultados.', 'Te falta la base conceptual para estructurar el servicio.'],
    logros: ['Comprender la base conceptual de la gestión integral de la farmacoterapia.', 'Evaluar, intervenir y hacer seguimiento con método.', 'Medir los resultados de tus intervenciones.'],
    paraQuien: ['Químicos farmacéuticos clínicos', 'Coordinadores de servicios farmacéuticos', 'Estudiantes de Química Farmacéutica'],
    keywords: ['gestión integral de la farmacoterapia', 'GIF farmacia clínica'],
  }),
  af('afc-05', {
    slug: 'pharmacotherapy-workup-cipolle-strand-morley',
    h1: 'Aplica el Pharmacotherapy Workup paso a paso en tu práctica',
    dolores: ['Conoces el método en teoría, pero no sabes aplicarlo con un paciente real.', 'Identificar problemas relacionados con medicamentos te toma demasiado tiempo.', 'Tu plan de seguimiento no tiene estándares claros.'],
    logros: ['Aplicar los estándares de cuidado del Pharmacotherapy Workup.', 'Identificar problemas relacionados con medicamentos.', 'Construir el plan de seguimiento farmacoterapéutico.'],
    paraQuien: ['Químicos farmacéuticos clínicos', 'Docentes y estudiantes de atención farmacéutica', 'Servicios con programas de seguimiento'],
    keywords: ['pharmacotherapy workup', 'Cipolle Strand Morley', 'atención farmacéutica Minnesota'],
  }),
  af('afc-06', {
    slug: 'plan-de-cuidados-farmacoterapeutico',
    h1: 'Diseña planes de cuidado con objetivos clínicos que se pueden medir',
    dolores: ['Tus planes de cuidado se quedan en recomendaciones generales.', 'No sabes cómo fijar objetivos clínicos medibles.', 'Evaluar si el plan funcionó es difícil sin indicadores.'],
    logros: ['Diseñar planes de cuidado farmacoterapéutico individualizados.', 'Fijar objetivos clínicos medibles.', 'Implementar y evaluar el plan con el paciente.'],
    paraQuien: ['Químicos farmacéuticos clínicos y ambulatorios', 'Programas de pacientes crónicos', 'Estudiantes de farmacia clínica'],
    keywords: ['plan de cuidados farmacoterapéutico', 'objetivos terapéuticos farmacia'],
  }),
  af('afc-07', {
    slug: 'problemas-farmacoterapeuticos',
    h1: 'Identifica, clasifica y resuelve problemas farmacoterapéuticos con método',
    dolores: ['Detectas que algo anda mal con el tratamiento, pero no sabes cómo clasificarlo.', 'Cada farmacéutico documenta los problemas de una forma distinta.', 'Te faltan casos para practicar la resolución.'],
    logros: ['Identificar problemas farmacoterapéuticos.', 'Clasificarlos con una metodología validada.', 'Resolverlos con casos clínicos reales.'],
    paraQuien: ['Químicos farmacéuticos asistenciales', 'Servicios de farmacia hospitalaria', 'Estudiantes de último año'],
    keywords: ['problemas farmacoterapéuticos', 'PRM clasificación', 'casos clínicos farmacia'],
  }),
  af('afc-08', {
    slug: 'seguridad-del-medicamento',
    h1: 'Previene los errores de medicación antes de que lleguen al paciente',
    dolores: ['Los errores se repiten y el reporte llega cuando ya pasó el daño.', 'La farmacovigilancia se siente como un trámite.', 'No tienes una forma clara de gestionar los riesgos del servicio.'],
    logros: ['Construir una cultura de seguridad del medicamento.', 'Prevenir errores de medicación.', 'Aplicar farmacovigilancia y gestión de riesgos en tu práctica.'],
    paraQuien: ['Químicos farmacéuticos de hospital y clínica', 'Responsables de farmacovigilancia', 'Coordinadores de seguridad del paciente'],
    keywords: ['seguridad del medicamento', 'errores de medicación', 'farmacovigilancia hospitalaria'],
  }),
  af('afc-09', {
    slug: 'stewardship-farmaceutico-proa',
    h1: 'Lidera el uso responsable de antimicrobianos desde la farmacia',
    dolores: ['Tu institución tiene un PROA, pero el rol del farmacéutico no está claro.', 'Intervenir en la prescripción de antibióticos genera fricción.', 'No sabes qué indicadores de uso monitorizar.'],
    logros: ['Entender el rol del farmacéutico en los programas de optimización de antimicrobianos.', 'Aplicar estrategias de intervención.', 'Monitorizar el uso de antibióticos.'],
    paraQuien: ['Químicos farmacéuticos hospitalarios', 'Integrantes de comités de infecciones', 'Estudiantes de farmacia clínica'],
    keywords: ['PROA farmacia', 'stewardship antimicrobianos', 'optimización de antimicrobianos'],
  }),
  af('afc-10', {
    slug: 'terapia-de-reemplazo-enzimatico',
    h1: 'Domina el manejo farmacéutico de la terapia de reemplazo enzimático',
    dolores: ['Las enfermedades de depósito lisosomal son poco frecuentes y hay poca formación práctica.', 'La TRE exige monitorización y adherencia que nadie te enseñó a seguir.', 'Necesitas una guía clara para el seguimiento de resultados.'],
    logros: ['Conocer las indicaciones de la TRE en enfermedades lisosomales.', 'Monitorizar el tratamiento y la adherencia.', 'Hacer seguimiento de los resultados clínicos.'],
    paraQuien: ['Químicos farmacéuticos de programas de enfermedades huérfanas', 'Farmacia hospitalaria y de alto costo', 'Estudiantes de farmacia clínica'],
    keywords: ['terapia de reemplazo enzimático', 'enfermedades lisosomales farmacia'],
  }),
  {
    slug: 'problemas-farmacoterapeuticos-iesa',
    productoId: 'afc-11',
    marca: 'atenfarma',
    area: 'farmacia-clinica',
    titulo: 'Problemas farmacoterapéuticos: clasificación y casos IESA',
    antetitulo: 'Ebook · Farmacia clínica',
    h1: 'Clasifica cada problema farmacoterapéutico con el sistema IESA',
    bajada: 'Identifica, clasifica, documenta y resuelve problemas farmacoterapéuticos por dimensión: indicación, efectividad, seguridad y adherencia. Con casos clínicos resueltos paso a paso.',
    portada: null,
    formato: 'Ebook en PDF',
    datos: [['4', 'dimensiones: indicación, efectividad, seguridad y adherencia'], ['6', 'casos clínicos resueltos'], ['1', 'autoevaluación al final']],
    dolores: ['Sabes que hay un problema con el tratamiento, pero no en qué categoría va.', 'Tu documentación no sigue una taxonomía reconocida.', 'Necesitas practicar con casos antes de intervenir con pacientes reales.'],
    logros: ['Usar la taxonomía Minnesota y el sistema IESA.', 'Seguir un algoritmo de identificación paso a paso.', 'Documentar con tablas de farmacoterapia que puedes usar con tus pacientes.', 'Integrar todo en el estado de situación del paciente.'],
    incluye: [
      ['Capítulo 1', ['Definición y taxonomía Minnesota', 'Estado de situación y mapa sistémico', 'Algoritmo de identificación paso a paso']],
      ['Capítulos 2 y 3 · Indicación y efectividad', ['Medicamento innecesario y necesario no usado', 'Medicamento no efectivo y dosis demasiado baja']],
      ['Capítulos 4 y 5 · Seguridad y adherencia', ['Reacción adversa y dosis demasiado alta', 'Incumplimiento terapéutico y sus barreras']],
      ['Capítulo 6', ['Estado de situación integrado de un paciente', 'Autoevaluación final']],
    ],
    paraQuien: ['Químicos farmacéuticos clínicos', 'Servicios de atención farmacéutica', 'Estudiantes de farmacia clínica'],
    pago: 'https://pay.hotmart.com/V105990886Q?sck=HOTMART_SITE&off=bl8gec1v&hotfeature=33',
    venta: 'https://hotmart.com/es/marketplace/productos/problemas-farmacoterapeuticos-iesa/V105990886Q',
    keywords: ['problemas farmacoterapéuticos IESA', 'taxonomía Minnesota', 'drug therapy problems', 'casos clínicos farmacia clínica'],
  },
  {
    slug: 'farmacocinetica-clinica-aplicada',
    productoId: 'afc-12',
    marca: 'atenfarma',
    area: 'farmacologia',
    titulo: 'Farmacocinética clínica aplicada. Del parámetro al paciente',
    antetitulo: 'Ebook · Farmacocinética',
    h1: 'Convierte las fórmulas de farmacocinética en decisiones para tu paciente',
    bajada: 'Seis módulos que van del concepto a la conexión clínica y al caso: absorción, distribución, metabolismo, eliminación, monitoreo terapéutico y bioequivalencia.',
    portada: null,
    formato: 'Ebook en PDF',
    datos: [['6', 'módulos, del parámetro al paciente'], ['4', 'fuentes de guías: ASHP, IDSA, KDIGO y FDA']],
    dolores: ['Dominas las ecuaciones, pero no sabes cómo cambia el volumen de distribución en un paciente real.', 'Calculas el aclaramiento de creatinina y no lo traduces en un ajuste de dosis.', 'El monitoreo terapéutico de fármacos te genera dudas.'],
    logros: ['Calcular la biodisponibilidad y entender el efecto de primer paso.', 'Predecir cambios de distribución en situaciones clínicas.', 'Relacionar el sistema CYP con interacciones.', 'Ajustar dosis según la eliminación y aplicar el monitoreo terapéutico.'],
    incluye: [
      ['Módulos 1 y 2', ['Absorción y biodisponibilidad', 'Distribución clínica']],
      ['Módulos 3 y 4', ['Metabolismo y sistema CYP', 'Eliminación y ajuste de dosis']],
      ['Módulos 5 y 6', ['Monitoreo terapéutico de fármacos', 'Bioequivalencia y aplicación regulatoria']],
    ],
    paraQuien: ['Químicos farmacéuticos', 'Estudiantes de Química y Farmacia'],
    pago: 'https://pay.hotmart.com/A105031729O?sck=HOTMART_SITE&off=rgv7hocy&hotfeature=33',
    venta: 'https://hotmart.com/es/marketplace/productos/farmacocinetica-clinica-aplicada-del-parametro-al-paciente/A105031729O',
    keywords: ['farmacocinética clínica', 'ajuste de dosis', 'monitoreo terapéutico de fármacos', 'biodisponibilidad'],
  },
];

/* ── Feliz Sin Tiroides: pacientes tiroideos ────────────────── */

const FST = Object.fromEntries(EBOOKS_FST.map((e) => [e.id, e]));
const fst = (id, pago, venta, extra) => ({
  marca: 'fst',
  area: 'tiroides',
  titulo: FST[id].name,
  antetitulo: FST[id].category.split('·')[0].trim(),
  bajada: FST[id].description,
  portada: FST[id].cover?.image || null,
  formato: FST[id].tag === 'Curso' ? 'Curso en Hotmart' : 'Ebook en PDF',
  pago,
  venta,
  productoId: id,
  ...extra,
});

const PARA_PACIENTES = ['Personas con hipotiroidismo o sin tiroides', 'Familiares y cuidadores'];

const FELIZ_SIN_TIROIDES = [
  fst('fst-coleccion-sana', 'https://pay.hotmart.com/C99303085S', 'https://go.hotmart.com/C99303085S?dp=1', {
    slug: 'coleccion-bienestar-tiroideo',
    h1: 'Entiende y cuida tu tiroides paso a paso, desde cero',
    dolores: ['Te diagnosticaron y la información en internet te confunde más.', 'Tomas tu medicamento, pero sigues sin sentirte bien y no sabes qué preguntar.', 'Quieres ordenar tu alimentación y tus hábitos sin caer en dietas milagro.'],
    logros: ['Empezar por lo esencial, en orden.', 'Organizar tu tratamiento, tus hábitos y tus controles.', 'Llegar a tus citas con preguntas claras.'],
    paraQuien: ['Quienes empiezan a vivir con una condición tiroidea', ...PARA_PACIENTES.slice(1)],
    destacada: true,
  }),
  fst('fst-recien-diagnosticados-hipotiroidismo', 'https://pay.hotmart.com/C107034583V?sck=HOTMART_PRODUCT_PAGE&hotfeature=32', 'https://go.hotmart.com/C107034583V?dp=1', {
    slug: 'guia-recien-diagnosticados-hipotiroidismo',
    h1: 'Acabas de recibir el diagnóstico de hipotiroidismo. Empieza con calma y con un plan.',
    dolores: ['Saliste de la consulta con más dudas que respuestas.', 'No sabes qué controles vienen ni cada cuánto.', 'Te sientes abrumada con tanta información.'],
    logros: ['Comprender tu diagnóstico en palabras sencillas.', 'Organizar tus controles.', 'Preparar las preguntas para tu próxima cita.'],
    paraQuien: ['Personas recién diagnosticadas con hipotiroidismo', 'Familiares que acompañan el diagnóstico'],
  }),
  fst('fst-levotiroxina-sin-sorpresas', 'https://pay.hotmart.com/X107038343S?sck=HOTMART_PRODUCT_PAGE&off=sxm06l8c&hotfeature=32', 'https://go.hotmart.com/X107038343S?dp=1', {
    slug: 'levotiroxina-sin-sorpresas',
    h1: 'Que tu levotiroxina funcione como debe, todos los días',
    dolores: ['No sabes si la estás tomando a la hora correcta ni con qué esperar.', 'El café, el desayuno o un suplemento podrían estar interfiriendo y nadie te lo explicó.', 'Tus exámenes cambian y no entiendes por qué.'],
    logros: ['Organizar la toma diaria.', 'Reconocer las interferencias más frecuentes.', 'Preparar las dudas para tu médico o tu químico farmacéutico.'],
    paraQuien: ['Personas que toman levotiroxina', ...PARA_PACIENTES.slice(1)],
  }),
  fst('fst-guia-definitiva-hipotiroidismo', 'https://pay.hotmart.com/R107037813O?sck=HOTMART_PRODUCT_PAGE&hotfeature=32', 'https://go.hotmart.com/R107037813O?dp=1', {
    slug: 'guia-definitiva-hipotiroidismo',
    h1: 'Todo lo esencial del hipotiroidismo, organizado en una sola guía',
    dolores: ['Tienes información suelta de muchas fuentes y no sabes en cuál confiar.', 'Los síntomas, el tratamiento y los hábitos se te mezclan.', 'Quieres entender tu condición para cuidarte mejor.'],
    logros: ['Comprender los conceptos esenciales del hipotiroidismo.', 'Organizar síntomas, tratamiento y hábitos.', 'Hacer un seguimiento con una mirada integral.'],
    paraQuien: PARA_PACIENTES,
  }),
  fst('fst-insomnio-tiroides', 'https://pay.hotmart.com/A107036606X?sck=HOTMART_PRODUCT_PAGE&hotfeature=32', 'https://go.hotmart.com/A107036606X?dp=1', {
    slug: 'insomnio-y-tiroides',
    h1: 'Vuelve a descansar: una guía para el insomnio cuando vives con una condición tiroidea',
    dolores: ['Te acuestas cansada y no logras dormir.', 'Despiertas varias veces y al día siguiente no rindes.', 'No sabes si es tu tiroides, tu rutina o algo más.'],
    logros: ['Observar tu descanso con un registro sencillo.', 'Construir una rutina nocturna.', 'Reconocer cuándo conviene consultar al equipo de salud.'],
    paraQuien: ['Pacientes tiroideos que duermen mal', ...PARA_PACIENTES.slice(1)],
  }),
  fst('fst-protocolo-digestivo-21-dias', 'https://pay.hotmart.com/W107039749E?sck=HOTMART_PRODUCT_PAGE&hotfeature=32', 'https://go.hotmart.com/W107039749E?dp=1', {
    slug: 'desinflama-tu-estomago-21-dias',
    h1: 'Desinflama tu estómago en 21 días, paso a paso',
    dolores: ['Vives con el estómago inflamado y pesado después de comer.', 'Has probado de todo sin un orden ni un seguimiento.', 'No sabes qué hábitos ayudan a tu digestión.'],
    logros: ['Seguir un plan alimentario de 21 días.', 'Ordenar hábitos que acompañan tu digestión.', 'Llevar un seguimiento educativo de tu avance.'],
    paraQuien: ['Pacientes tiroideos con molestias digestivas', ...PARA_PACIENTES.slice(1)],
  }),
  fst('fst-nutrir-hashimoto', 'https://pay.hotmart.com/M107038625A?sck=HOTMART_PRODUCT_PAGE&hotfeature=32', 'https://go.hotmart.com/M107038625A?dp=1', {
    slug: 'nutrir-tu-tiroides-hashimoto',
    h1: 'Come con tranquilidad cuando vives con tiroiditis de Hashimoto',
    dolores: ['Cada fuente te dice que elimines un alimento distinto.', 'Comer se volvió una fuente de ansiedad.', 'Quieres una alimentación variada y no restrictiva.'],
    logros: ['Organizar una alimentación variada.', 'Comprender los hábitos que acompañan el cuidado en Hashimoto.', 'Llevar preguntas claras a tu equipo de salud.'],
    paraQuien: ['Personas con tiroiditis de Hashimoto', ...PARA_PACIENTES.slice(1)],
  }),
  fst('fst-sana-tu-metabolismo', 'https://pay.hotmart.com/U107039126K?sck=HOTMART_PRODUCT_PAGE&off=pboajai7&hotfeature=32', 'https://go.hotmart.com/U107039126K?dp=1', {
    slug: 'sana-tu-metabolismo',
    h1: 'Recupera el control de tus hábitos y tu bienestar metabólico',
    dolores: ['Sientes que tu metabolismo va lento y no sabes por dónde empezar.', 'Alimentación, movimiento y descanso van cada uno por su lado.', 'Empiezas cambios que no logras sostener.'],
    logros: ['Revisar tu alimentación, movimiento y descanso.', 'Hacer seguimiento de tus hábitos.', 'Sostener cambios realistas.'],
    paraQuien: PARA_PACIENTES,
  }),
  fst('fst-caida-cabello-tiroides', 'https://pay.hotmart.com/E107034444T?sck=HOTMART_PRODUCT_PAGE&off=rmra6dc0&hotfeature=32', 'https://go.hotmart.com/E107034444T?dp=1', {
    slug: 'caida-del-cabello-y-tiroides',
    h1: 'La caída del cabello te preocupa. Abórdala con orden y con tu equipo de salud.',
    dolores: ['Ves cabello en la almohada y en la ducha y te angustia.', 'No sabes qué factores pueden estar influyendo.', 'Te ofrecen productos milagro que no te convencen.'],
    logros: ['Organizar los factores que pueden influir.', 'Revisar hábitos útiles.', 'Preparar preguntas para tu equipo de salud.'],
    paraQuien: ['Pacientes tiroideos con caída del cabello', ...PARA_PACIENTES.slice(1)],
  }),
  fst('fst-probioticos', 'https://pay.hotmart.com/C107039605P', 'https://go.hotmart.com/C107039605P?dp=1', {
    slug: 'guia-de-probioticos',
    h1: 'Antes de comprar un probiótico, entiende qué estás comprando',
    dolores: ['Hay decenas de probióticos y todos prometen lo mismo.', 'No sabes cómo leer una etiqueta ni comparar productos.', 'Te preguntas si te sirven y qué consultar antes.'],
    logros: ['Comprender qué son los probióticos.', 'Evaluar productos con criterio.', 'Saber qué preguntar antes de incorporarlos.'],
    paraQuien: PARA_PACIENTES,
  }),
  fst('fst-guia-definitiva-hipertiroidismo', 'https://pay.hotmart.com/E107037884A', 'https://go.hotmart.com/E107037884A?dp=1', {
    slug: 'guia-definitiva-hipertiroidismo',
    h1: 'Comprende el hipertiroidismo y llega mejor preparada a cada consulta',
    dolores: ['Las palpitaciones, la ansiedad y el insomnio te descolocan.', 'No sabes qué cambios registrar ni cómo explicarlos.', 'Sales de la consulta sin haber preguntado lo importante.'],
    logros: ['Comprender el hipertiroidismo con información organizada.', 'Registrar tus cambios.', 'Preparar mejores conversaciones con tu equipo tratante.'],
    paraQuien: ['Personas con hipertiroidismo', ...PARA_PACIENTES.slice(1)],
  }),
  fst('fst-comer-hipotiroidismo', 'https://pay.hotmart.com/N100606654K', 'https://go.hotmart.com/N100606654K?dp=1', {
    slug: 'aprende-a-comer-con-hipotiroidismo',
    h1: 'Aprende a comer con hipotiroidismo, sin prohibiciones absurdas',
    dolores: ['No sabes qué alimentos favorecen tu metabolismo.', 'Lees listas de alimentos «prohibidos» que se contradicen.', 'Quieres una guía práctica para tu día a día.'],
    logros: ['Saber qué favorece tu metabolismo y qué conviene evitar.', 'Organizar tu alimentación con orientación práctica.'],
    paraQuien: ['Personas con hipotiroidismo', ...PARA_PACIENTES.slice(1)],
  }),
  fst('fst-dieta-antiinflamatoria', 'https://pay.hotmart.com/O103583638M', 'https://go.hotmart.com/O103583638M?dp=1', {
    slug: 'alimentacion-antiinflamatoria',
    h1: 'Una alimentación antiinflamatoria explicada de forma sencilla',
    dolores: ['Oyes hablar de inflamación y no sabes qué cambiar en tu plato.', 'Las dietas que encuentras son difíciles de sostener.', 'Quieres comer variado y sentirte mejor.'],
    logros: ['Entender el enfoque antiinflamatorio.', 'Aplicarlo con una alimentación variada.'],
    paraQuien: PARA_PACIENTES,
  }),
  fst('fst-comer-hipertiroidismo', 'https://pay.hotmart.com/V100880105F', 'https://go.hotmart.com/V100880105F?dp=1', {
    slug: 'aprende-a-comer-con-hipertiroidismo-y-graves',
    h1: 'Acompaña tu tratamiento del hipertiroidismo y la enfermedad de Graves desde la mesa',
    dolores: ['Bajas de peso o tienes hambre todo el tiempo y no sabes cómo comer.', 'No encuentras información de alimentación para hipertiroidismo.', 'Quieres apoyar tu tratamiento con hábitos.'],
    logros: ['Organizar tu alimentación con hipertiroidismo o Graves.', 'Acompañar tu tratamiento desde la mesa.'],
    paraQuien: ['Personas con hipertiroidismo o enfermedad de Graves', ...PARA_PACIENTES.slice(1)],
  }),
  fst('fst-guia-ayunos', 'https://pay.hotmart.com/I103583345S', 'https://go.hotmart.com/I103583345S?dp=1', {
    slug: 'guia-completa-de-ayunos',
    h1: 'Si piensas en ayunar, hazlo informada y cuidando tu tiroides',
    dolores: ['Ves el ayuno en todas partes y no sabes si es para ti.', 'Te preocupa cómo se relaciona con tu medicación.', 'Quieres información clara antes de intentarlo.'],
    logros: ['Conocer los tipos de ayuno.', 'Entender cómo aplicarlo cuidando tu salud tiroidea.', 'Conversar la decisión con tu equipo de salud.'],
    paraQuien: PARA_PACIENTES,
    aviso: 'Antes de ayunar o cambiar tu alimentación, consúltalo con tu médico, sobre todo si tomas medicamentos.',
  }),
  fst('fst-yodoterapia', 'https://pay.hotmart.com/P100879796W', 'https://go.hotmart.com/P100879796W?dp=1', {
    slug: 'guia-yodoterapia-i-131',
    h1: 'Atraviesa la yodoterapia con I-131 sabiendo qué esperar',
    dolores: ['Te programaron yodoterapia y no sabes cómo prepararte.', 'Tienes dudas sobre los cuidados en casa y con tu familia.', 'El miedo a lo desconocido te quita el sueño.'],
    logros: ['Entender qué esperar de la yodoterapia.', 'Organizar los cuidados.', 'Resolver dudas frecuentes y prepararlas para tu equipo.'],
    paraQuien: ['Personas que recibirán yodoterapia con I-131', 'Familiares y cuidadores'],
  }),
  fst('fst-diario-hipotiroidismo', 'https://pay.hotmart.com/B103582518G', 'https://go.hotmart.com/B103582518G?dp=1', {
    slug: 'diario-de-emociones-hipotiroidismo',
    h1: 'Tu bienestar también es emocional: un diario para vivir con hipotiroidismo',
    dolores: ['Hay días en los que te sientes triste o irritable y no sabes por qué.', 'Nadie te pregunta cómo te sientes con tu diagnóstico.', 'Quieres un espacio para ordenar lo que sientes.'],
    logros: ['Registrar tus emociones.', 'Gestionar lo que sientes con ejercicios sencillos.'],
    paraQuien: ['Personas con hipotiroidismo'],
  }),
  fst('fst-diario-hipertiroidismo', 'https://pay.hotmart.com/E103583752B', 'https://go.hotmart.com/E103583752B?dp=1', {
    slug: 'diario-de-emociones-hipertiroidismo',
    h1: 'Un espacio para acompañar tus emociones durante el hipertiroidismo',
    dolores: ['La ansiedad y los cambios de ánimo te sorprenden.', 'Te cuesta explicarle a otros lo que sientes.', 'Quieres herramientas sencillas para el día a día.'],
    logros: ['Registrar tus emociones.', 'Practicar ejercicios sencillos de manejo.'],
    paraQuien: ['Personas con hipertiroidismo'],
  }),
  fst('fst-manejo-sintomas', 'https://pay.hotmart.com/V104730276Y?sck=HOTMART_PRODUCT_PAGE&off=n7ljml32&hotfeature=32', 'https://hotmart.com/es/marketplace/productos/maneja-los-sintomas-de-la-tiroides-de-manera-sencilla/V104730276Y', {
    slug: 'maneja-los-sintomas-de-la-tiroides',
    titulo: 'Maneja los síntomas de la tiroides de manera sencilla',
    h1: 'Fatiga, frío y niebla mental: maneja los síntomas del día a día',
    dolores: ['El cansancio no se va aunque duermas.', 'Sientes frío cuando los demás no y te cuesta concentrarte.', 'Quieres estrategias prácticas, no solo «tenga paciencia».'],
    logros: ['Aplicar estrategias prácticas para los síntomas del día a día.', 'Registrar lo que cambia y llevarlo a tu consulta.'],
    paraQuien: PARA_PACIENTES,
  }),
  fst('fst-jugos-funcionales', 'https://pay.hotmart.com/J103583506F', 'https://hotmart.com/es/marketplace/productos/jugos-digestivos-para-tu-tiroides/J103583506F', {
    slug: 'jugos-digestivos-para-tu-tiroides',
    titulo: 'Jugos digestivos para tu tiroides',
    h1: 'Recetas de jugos y bebidas para acompañar tu digestión',
    dolores: ['Quieres incorporar más frutas y vegetales y no sabes cómo.', 'Tu digestión te molesta con frecuencia.', 'Buscas recetas fáciles para el día a día.'],
    logros: ['Preparar jugos y bebidas con recetas sencillas.', 'Incorporarlos a tu rutina.'],
    paraQuien: PARA_PACIENTES,
  }),
  fst('fst-autocuidado', 'https://pay.hotmart.com/E104236731U', 'https://go.hotmart.com/E104236731U?dp=1', {
    slug: 'curso-autocuidado-de-la-tiroides',
    h1: 'Aprende a cuidarte cada día con tu tiroides',
    dolores: ['Sabes que debes cuidarte, pero no por dónde empezar.', 'Los hábitos, la alimentación y la medicación se te desordenan.', 'También necesitas cuidar tu bienestar emocional.'],
    logros: ['Construir hábitos de autocuidado.', 'Ordenar tu alimentación y tu adherencia.', 'Cuidar tu bienestar emocional.'],
    paraQuien: PARA_PACIENTES,
  }),
];

const PREGUNTAS_FST = [
  ['¿Esta guía reemplaza a mi médico?', 'No. Es material educativo escrito en lenguaje de paciente. No reemplaza la valoración, el diagnóstico ni el tratamiento de tu equipo de salud.'],
];

export const GUIAS_VENTA = [...EDVANTA, ...ATENFARMA, ...FELIZ_SIN_TIROIDES].map((g) => ({
  ...g,
  preguntas: [...(g.marca === 'fst' ? PREGUNTAS_FST : []), ...(g.preguntas || [])],
}));

export const guiaPorSlug = (slug) => GUIAS_VENTA.find((g) => g.slug === slug) || null;

/** La página de venta de un producto de fst.js o atenfarma.js, si tiene. */
const POR_PRODUCTO = Object.fromEntries(GUIAS_VENTA.filter((g) => g.productoId).map((g) => [g.productoId, g.slug]));
export const rutaDeGuia = (productoId) => (POR_PRODUCTO[productoId] ? `/guia/${POR_PRODUCTO[productoId]}` : null);

/** Otras guías de la misma marca, primero las del mismo tema. */
export function guiasRelacionadas(guia, n = 3) {
  return GUIAS_VENTA
    .filter((g) => g.slug !== guia.slug && g.marca === guia.marca)
    .sort((a, b) => Number(b.area === guia.area) - Number(a.area === guia.area))
    .slice(0, n);
}

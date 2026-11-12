/**
 * Guías editoriales de cursos curados · Lote 5a (12-nov-2026)
 * Inteligencia artificial (Claude, ChatGPT, Gemini) y Excel. Se habla del
 * tema y de su uso profesional en salud, no del temario del proveedor.
 */
const SALUD_IA = ['Artículo: cursos de IA para profesionales de la salud', '/articulos/cursos-de-inteligencia-artificial-para-profesionales-de-la-salud'];
const CLAUDE_CODE = ['Artículo: cursos de Claude Code', '/articulos/cursos-de-claude-code'];
const IA_INDUSTRIA = ['Guía: IA en la industria farmacéutica', '/articulos/cursos-gratis-ia-industria-farmaceutica'];
const PYTHON = ['Guía: Python para farmacia', '/articulos/cursos-gratis-python-para-farmacia'];

export const GUIAS_LOTE_5A = {
  'udemy-curso-de-inteligencia-artificial-y-chatgpt': {
    tituloSeo: 'Curso de inteligencia artificial y ChatGPT en español',
    meta: 'Curso en español de Udemy sobre inteligencia artificial y ChatGPT, con la guía de Edvanta para usarla con seguridad en salud y farmacia.',
    porQue: 'Los asistentes de inteligencia artificial como ChatGPT ya ayudan a redactar, resumir, traducir y organizar información. En salud y farmacia pueden ahorrar horas de trabajo administrativo, siempre que se usen sin datos de pacientes y verificando cada dato contra su fuente.',
    aplicaciones: [
      'Redactar un borrador de procedimiento y revisarlo contra la norma vigente.',
      'Resumir una guía técnica larga para una reunión de equipo.',
      'Preparar material educativo para pacientes en lenguaje sencillo.',
    ],
    paraQuien: ['Profesionales de la salud que empiezan con IA', 'Personal administrativo de IPS y droguerías'],
    complementa: [SALUD_IA, IA_INDUSTRIA, ['Guía: cursos de Excel para profesionales de la salud', '/articulos/cursos-de-excel-para-profesionales-de-la-salud']],
    preguntas: [
      ['¿Puedo poner datos de pacientes en ChatGPT?', 'No, salvo que tu institución lo autorice con las medidas de protección de datos. Los datos de salud son sensibles según la Ley 1581 de 2012.'],
      ['¿La IA puede equivocarse?', 'Sí. Puede inventar datos o referencias; todo se verifica contra la fuente original.'],
    ],
  },
  'udemy-master-claude-code-agentes-de-ia': {
    tituloSeo: 'Curso de Claude Code y agentes de IA en español',
    meta: 'Curso en español de Udemy sobre Claude Code y agentes de IA, con la guía de Edvanta para automatizar tareas con seguridad en salud.',
    porQue: 'Claude Code es la herramienta de programación con inteligencia artificial de Anthropic: trabaja sobre un proyecto, escribe y modifica código y ejecuta tareas con la aprobación de la persona. Aprenderla en español es una puerta de entrada para profesionales de la salud que quieren automatizar informes y procesos repetitivos.',
    aplicaciones: [
      'Automatizar la unión de reportes mensuales de varias sedes.',
      'Construir una herramienta interna sencilla con datos de prueba.',
      'Revisar y aprobar cada cambio que propone el agente.',
    ],
    paraQuien: ['Profesionales de salud sin experiencia en programación', 'Analistas que quieren automatizar su trabajo'],
    complementa: [CLAUDE_CODE, SALUD_IA, PYTHON],
    preguntas: [
      ['¿Qué es un agente de IA?', 'Un sistema que no solo responde, sino que planea y ejecuta pasos, como leer archivos, escribir código o correr pruebas, con supervisión humana.'],
      ['¿Necesito saber programar?', 'No para empezar, pero sí conviene entender lo básico para revisar lo que hace el agente.'],
    ],
  },
  'udemy-claude-ai-en-espanol': {
    tituloSeo: 'Curso de Claude AI en español para principiantes',
    meta: 'Curso en español de Udemy para aprender a usar Claude, el asistente de IA de Anthropic, con la guía de Edvanta para salud y farmacia.',
    porQue: 'Claude es el asistente de inteligencia artificial de Anthropic, útil para escribir, analizar documentos largos, resumir y razonar sobre textos técnicos. Aprender a pedirle bien las cosas, con contexto y ejemplos, multiplica su utilidad en el trabajo diario de un profesional de la salud.',
    aplicaciones: [
      'Analizar un documento normativo largo y extraer sus obligaciones principales.',
      'Preparar el borrador de un correo o un informe técnico.',
      'Convertir una explicación técnica en material para pacientes.',
    ],
    paraQuien: ['Profesionales que empiezan con asistentes de IA', 'Docentes y equipos de comunicación en salud'],
    complementa: [SALUD_IA, ['Curso gratis: Presentaciones Efectivas y Storytelling', '/curso-de-presentaciones-efectivas-y-storytelling'], IA_INDUSTRIA],
    preguntas: [
      ['¿Qué diferencia hay entre Claude y Claude Code?', 'Claude es el asistente para conversar, escribir y analizar; Claude Code es la herramienta para trabajar sobre proyectos de código y archivos.'],
      ['¿Cómo pedirle bien las cosas a una IA?', 'Dando contexto, describiendo el resultado esperado, mostrando ejemplos y pidiendo que cite o verifique sus fuentes.'],
    ],
  },
  'udemy-claude-anthropic': {
    tituloSeo: 'Curso de Claude de Anthropic en inglés',
    meta: 'Curso en inglés de Udemy sobre Claude, el asistente de IA de Anthropic, con la guía de Edvanta para aplicarlo en el trabajo farmacéutico.',
    porQue: 'Conocer a fondo un asistente de inteligencia artificial, sus capacidades, sus límites y sus buenas prácticas, permite usarlo con criterio en lugar de copiar respuestas. En el sector farmacéutico eso significa aprovecharlo para documentos y análisis sin comprometer la confidencialidad ni la exactitud.',
    aplicaciones: [
      'Comparar versiones de un procedimiento y resumir los cambios.',
      'Estructurar la información de un proyecto en tablas y listas.',
      'Definir reglas internas para el uso de IA en tu equipo.',
    ],
    paraQuien: ['Profesionales que leen bien en inglés', 'Líderes que definen el uso de IA en su equipo'],
    complementa: [IA_INDUSTRIA, SALUD_IA, ['Guía: integridad de datos', '/articulos/cursos-gratis-integridad-de-datos']],
    preguntas: [
      ['¿Qué riesgos tiene usar IA en una empresa farmacéutica?', 'La fuga de información confidencial, los datos inventados y el uso de resultados sin verificar en decisiones reguladas.'],
      ['¿Hay versión en español?', 'Este curso está en inglés; Edvanta recomienda otros cursos de Claude en español en su guía de IA.'],
    ],
  },
  'udemy-claude-de-cero-a-experto-guia-practica-intensiva': {
    tituloSeo: 'Curso de Claude de cero a experto en español',
    meta: 'Curso práctico en español de Udemy para pasar de cero a un uso avanzado de Claude, con la guía de Edvanta para salud y farmacia.',
    porQue: 'Pasar del uso ocasional de un asistente de IA a un uso avanzado cambia la productividad: plantillas de instrucciones, proyectos con contexto, análisis de archivos y revisión de documentos. Un recorrido práctico de principio a fin acelera ese salto.',
    aplicaciones: [
      'Crear plantillas de instrucciones para tareas que repites cada semana.',
      'Analizar una hoja de cálculo y pedir un resumen con hallazgos.',
      'Revisar la claridad y la coherencia de un documento antes de enviarlo.',
    ],
    paraQuien: ['Profesionales que ya probaron la IA y quieren dominarla', 'Coordinadores que preparan muchos informes'],
    complementa: [SALUD_IA, ['Guía: cursos de Excel para profesionales de la salud', '/articulos/cursos-de-excel-para-profesionales-de-la-salud'], CLAUDE_CODE],
    preguntas: [
      ['¿Qué es una plantilla de instrucciones?', 'Un texto reutilizable con el contexto, el formato y los criterios de una tarea, para obtener resultados consistentes.'],
      ['¿Sirve sin saber programar?', 'Sí, se enfoca en el uso del asistente; para programar con IA, el siguiente paso es Claude Code.'],
    ],
  },
  'udemy-curso-de-claude-estrategia-escritura-y-creatividad-con-ia': {
    tituloSeo: 'Curso de Claude para escritura y estrategia con IA',
    meta: 'Curso en español de Udemy sobre Claude para escribir, planear y crear contenido, con la guía de Edvanta para comunicar en salud con rigor.',
    porQue: 'La escritura es una de las tareas donde un asistente de IA rinde más: borradores, estructura, tono y revisión. En salud, el reto es usarla para comunicar mejor sin perder exactitud, sin prometer resultados y respetando lo que se puede decir de un medicamento.',
    aplicaciones: [
      'Estructurar un artículo educativo y revisar que cada dato tenga fuente.',
      'Adaptar un mismo mensaje para pacientes, médicos y directivos.',
      'Planear un calendario de contenidos para las redes de una farmacia.',
    ],
    paraQuien: ['Comunicadores y equipos de marketing en salud', 'Profesionales que escriben contenido educativo'],
    complementa: [['Artículo: cursos de marketing farmacéutico y digital', '/articulos/cursos-de-marketing-farmaceutico-y-digital'], SALUD_IA, ['Curso gratis: Presentaciones Efectivas y Storytelling', '/curso-de-presentaciones-efectivas-y-storytelling']],
    preguntas: [
      ['¿Puedo usar IA para escribir sobre medicamentos?', 'Sí, como apoyo, verificando cada dato y respetando la Resolución 1896 de 2023 sobre información y publicidad de medicamentos.'],
      ['¿La IA reemplaza al redactor?', 'No. Acelera los borradores; el criterio, la verificación y la responsabilidad siguen siendo humanos.'],
    ],
  },
  'udemy-master-claude-code': {
    tituloSeo: 'Curso Master Claude Code en inglés',
    meta: 'Curso en inglés de Udemy para dominar Claude Code, la herramienta de programación con IA de Anthropic, con la guía de Edvanta.',
    porQue: 'Dominar Claude Code es aprender a delegar trabajo de programación sin perder el control: dar contexto con un archivo de instrucciones del proyecto, dividir tareas, revisar cambios y exigir pruebas. Es una habilidad cada vez más pedida en equipos de datos y tecnología, también en salud.',
    aplicaciones: [
      'Escribir el archivo de instrucciones del proyecto con sus reglas y comandos.',
      'Dividir una tarea grande en pasos verificables.',
      'Exigir pruebas antes de aceptar un cambio.',
    ],
    paraQuien: ['Desarrolladores y analistas de datos', 'Profesionales de salud con bases de programación'],
    complementa: [CLAUDE_CODE, PYTHON, IA_INDUSTRIA],
    preguntas: [
      ['¿Dónde funciona Claude Code?', 'En la terminal, en editores como VS Code y JetBrains, en una aplicación de escritorio y en la web.'],
      ['¿Hay una versión en español de este tema?', 'Sí, Master Claude Code: Agentes de IA, también en Udemy, está en español.'],
    ],
  },
  'udemy-ai-coding-mastery-2026-claude-code-and-multi-model-stack': {
    tituloSeo: 'Curso de programación con IA y varios modelos (2026)',
    meta: 'Curso en inglés de Udemy sobre programación con IA combinando Claude Code y otros modelos, con la guía de Edvanta para su uso en salud.',
    porQue: 'Cada vez más equipos combinan varios modelos de inteligencia artificial según la tarea: uno para razonar sobre código, otro para tareas rápidas, otro para imágenes. Saber cuándo usar cada uno y cómo verificar sus resultados evita depender a ciegas de una sola herramienta.',
    aplicaciones: [
      'Escoger el modelo adecuado según el costo y la complejidad de la tarea.',
      'Comparar las respuestas de dos modelos antes de aceptar un cambio.',
      'Documentar qué herramienta se usó en cada parte de un proyecto.',
    ],
    paraQuien: ['Desarrolladores con experiencia', 'Equipos de tecnología que evalúan herramientas de IA'],
    complementa: [CLAUDE_CODE, IA_INDUSTRIA, PYTHON],
    preguntas: [
      ['¿Por qué combinar varios modelos?', 'Porque cada uno tiene fortalezas, costos y velocidades distintas según la tarea.'],
      ['¿Es un curso para principiantes?', 'No. Asume experiencia programando; para empezar, mejor un curso introductorio de Claude Code.'],
    ],
  },
  'udemy-claude-code-for-agentic-ai-build-ai-agents-10x-faster': {
    tituloSeo: 'Curso de agentes de IA con Claude Code',
    meta: 'Curso en inglés de Udemy sobre cómo construir agentes de IA con Claude Code, con la guía de Edvanta sobre riesgos y supervisión.',
    porQue: 'Un agente de inteligencia artificial planea y ejecuta pasos por su cuenta: leer datos, llamar herramientas, escribir resultados. Construirlos abre muchas posibilidades de automatización, pero exige definir límites, permisos y supervisión, sobre todo en entornos con datos sensibles como la salud.',
    aplicaciones: [
      'Diseñar un agente que clasifique documentos y deje la decisión final a una persona.',
      'Definir qué acciones puede hacer el agente sin pedir permiso.',
      'Registrar lo que hizo el agente para poder auditarlo.',
    ],
    paraQuien: ['Desarrolladores que quieren construir agentes', 'Equipos de innovación en salud'],
    complementa: [CLAUDE_CODE, IA_INDUSTRIA, ['Guía: integridad de datos', '/articulos/cursos-gratis-integridad-de-datos']],
    preguntas: [
      ['¿Qué riesgos tiene un agente de IA?', 'Que ejecute acciones equivocadas o no autorizadas; por eso se definen permisos, límites y revisión humana.'],
      ['¿Un agente puede tomar decisiones clínicas?', 'No debería tomarlas solo. En salud, las decisiones clínicas y reguladas requieren supervisión profesional.'],
    ],
  },
  'udemy-claude-code-generative-ai-assisted-development': {
    tituloSeo: 'Curso de desarrollo asistido por IA con Claude Code',
    meta: 'Curso en inglés de Udemy sobre desarrollo de software asistido por IA generativa con Claude Code, con la guía de Edvanta.',
    porQue: 'El desarrollo asistido por inteligencia artificial cambia el trabajo del programador: menos escribir cada línea y más definir, revisar y probar. Aprender ese flujo, con control de versiones y pruebas, es lo que permite aprovechar la velocidad de la IA sin sacrificar la calidad del software.',
    aplicaciones: [
      'Pedir a la IA una función con sus pruebas y revisar ambas.',
      'Usar ramas de git para probar cambios sin afectar lo que funciona.',
      'Refactorizar código antiguo con apoyo de la IA y pruebas de respaldo.',
    ],
    paraQuien: ['Desarrolladores de software', 'Analistas que mantienen scripts y herramientas internas'],
    complementa: [CLAUDE_CODE, PYTHON, ['Curso gratis: Validaciones y Calificaciones', '/curso-de-validaciones-y-calificaciones']],
    preguntas: [
      ['¿La IA escribe código sin errores?', 'No. Puede equivocarse; las pruebas y la revisión humana siguen siendo indispensables.'],
      ['¿Qué pasa con el software en entornos regulados?', 'Si apoya decisiones de calidad en la industria farmacéutica, puede requerir validación como sistema computarizado.'],
    ],
  },
  'udemy-claude-code-masterclass': {
    tituloSeo: 'Claude Code Masterclass: curso en Udemy',
    meta: 'Curso en inglés de Udemy con un recorrido completo por Claude Code, con la guía de Edvanta para usarlo en proyectos de datos en salud.',
    porQue: 'Un recorrido completo por una herramienta como Claude Code ayuda a pasar de pedir cosas sueltas a organizar proyectos enteros con ella: instrucciones del proyecto, permisos, extensiones, subagentes y flujo con git. Esa visión de conjunto es la que diferencia un uso casual de uno profesional.',
    aplicaciones: [
      'Configurar los permisos de lo que el agente puede hacer sin preguntar.',
      'Conectar herramientas externas para automatizar tareas repetidas.',
      'Repartir un trabajo grande entre subagentes.',
    ],
    paraQuien: ['Desarrolladores que quieren una visión completa', 'Líderes técnicos que evalúan adoptar la herramienta'],
    complementa: [CLAUDE_CODE, IA_INDUSTRIA, PYTHON],
    preguntas: [
      ['¿Qué es un subagente?', 'Un agente que recibe una parte de un trabajo más grande, para dividir la tarea en piezas manejables.'],
      ['¿Qué curso de Claude Code escoger?', 'Depende de tu nivel e idioma; la guía de cursos de Claude Code de Edvanta los ordena.'],
    ],
  },
  'udemy-mastering-claude-code': {
    tituloSeo: 'Curso Mastering Claude Code: uso diario',
    meta: 'Curso en inglés de Udemy para integrar Claude Code al trabajo diario de programación, con la guía de Edvanta para salud y farmacia.',
    porQue: 'El valor de una herramienta de IA para programar se ve en el día a día: entender código ajeno, corregir errores, escribir pruebas y documentar. Integrarla a la rutina, con buenas prácticas de revisión, ahorra tiempo en los proyectos de datos y automatización.',
    aplicaciones: [
      'Pedir una explicación de un script heredado antes de modificarlo.',
      'Corregir un error leyendo el mensaje junto con la IA.',
      'Documentar un proyecto para que otra persona pueda mantenerlo.',
    ],
    paraQuien: ['Analistas y desarrolladores que programan a diario', 'Profesionales que heredan herramientas internas'],
    complementa: [CLAUDE_CODE, PYTHON, ['Guía: Power BI en la industria farmacéutica', '/articulos/cursos-gratis-power-bi-farmacia']],
    preguntas: [
      ['¿Sirve para mantener código que no escribí?', 'Sí; pedir una explicación del código es uno de sus usos más útiles.'],
      ['¿Cómo evitar errores graves?', 'Revisando cada cambio, trabajando con control de versiones y exigiendo pruebas.'],
    ],
  },
  'udemy-claude-code-bootcamp': {
    tituloSeo: 'Claude Code Bootcamp: práctica intensiva',
    meta: 'Curso práctico e intensivo en inglés de Udemy sobre Claude Code, con la guía de Edvanta para practicar con proyectos y datos de prueba.',
    porQue: 'Con las herramientas de IA para programar se aprende haciendo: proyectos pequeños, errores, correcciones y pruebas. Un formato intensivo y práctico sirve a quien quiere ganar soltura rápido, siempre practicando con datos de prueba y no con información real de pacientes.',
    aplicaciones: [
      'Construir un proyecto pequeño de principio a fin con la IA.',
      'Practicar con datos de prueba o anonimizados.',
      'Mantener un registro de lo aprendido en cada ejercicio.',
    ],
    paraQuien: ['Personas que aprenden mejor con práctica intensiva', 'Desarrolladores que quieren ganar velocidad'],
    complementa: [CLAUDE_CODE, PYTHON, SALUD_IA],
    preguntas: [
      ['¿Con qué datos practicar?', 'Con datos de prueba o anonimizados; nunca con datos reales de pacientes en herramientas no autorizadas.'],
      ['¿Qué proyecto sirve para empezar?', 'Uno pequeño y útil, como unir y limpiar archivos de Excel que recibes cada mes.'],
    ],
  },
  'udemy-claude-api': {
    tituloSeo: 'Curso de la API de Claude para crear aplicaciones',
    meta: 'Curso en inglés de Udemy sobre la API de Claude para integrar IA en tus propias aplicaciones, con la guía de Edvanta sobre riesgos en salud.',
    porQue: 'La API de Claude permite que una aplicación propia use los modelos de inteligencia artificial de Anthropic: un buscador de documentos internos, un asistente para responder preguntas frecuentes o un clasificador de textos. Construirlas exige pensar en costos, privacidad, evaluación y supervisión.',
    aplicaciones: [
      'Construir un buscador sobre los procedimientos internos de un laboratorio.',
      'Clasificar reclamos o consultas por tema para priorizarlos.',
      'Medir la calidad de las respuestas con un conjunto de preguntas de prueba.',
    ],
    paraQuien: ['Desarrolladores que construyen aplicaciones con IA', 'Equipos de innovación y transformación digital'],
    complementa: [IA_INDUSTRIA, PYTHON, CLAUDE_CODE],
    preguntas: [
      ['¿Qué diferencia hay entre la API y la aplicación de Claude?', 'La aplicación es para usar el asistente directamente; la API es para que tus propios programas usen los modelos.'],
      ['¿Qué cuidar al construir con IA en salud?', 'La privacidad de los datos, la verificación de las respuestas y una supervisión humana clara.'],
    ],
  },
  'udemy-google-gemini-pro-vision-api-with-python': {
    tituloSeo: 'Curso de Gemini Vision API con Python',
    meta: 'Curso en inglés de Udemy sobre la API de visión de Gemini con Python, con la guía de Edvanta sobre usos de IA con imágenes en farmacia.',
    porQue: 'Los modelos de inteligencia artificial que entienden imágenes permiten leer documentos escaneados, extraer datos de formatos o describir fotografías. En farmacia y en la industria abren usos como digitalizar registros, pero exigen verificar cada dato extraído y cuidar la información sensible.',
    aplicaciones: [
      'Extraer datos de formatos escaneados y verificarlos contra el original.',
      'Clasificar imágenes de etiquetas o empaques para una revisión.',
      'Automatizar la descripción de fotografías de un inventario.',
    ],
    paraQuien: ['Desarrolladores con bases de Python', 'Equipos que digitalizan documentos'],
    complementa: [PYTHON, IA_INDUSTRIA, ['Guía: empaque y serialización', '/articulos/cursos-gratis-empaque-y-serializacion']],
    preguntas: [
      ['¿Qué es un modelo multimodal?', 'Un modelo de IA que procesa más de un tipo de información, como texto e imágenes.'],
      ['¿Puedo confiar en los datos que extrae?', 'Hay que verificarlos: puede leer mal un número o una fecha.'],
    ],
  },
  'udemy-generative-ai-engineering-with-openai-and-anthropic': {
    tituloSeo: 'Curso de ingeniería de IA generativa (OpenAI y Anthropic)',
    meta: 'Curso en inglés de Udemy sobre ingeniería de aplicaciones con IA generativa de OpenAI y Anthropic, con la guía de Edvanta.',
    porQue: 'Construir una aplicación seria con IA generativa va más allá de escribir instrucciones: hay que conectar fuentes de información, controlar costos, evaluar la calidad de las respuestas y manejar los errores. Esa ingeniería es la que convierte una demostración en una herramienta confiable.',
    aplicaciones: [
      'Conectar un modelo de IA a documentos internos para responder con fuentes.',
      'Diseñar una evaluación con preguntas y respuestas esperadas.',
      'Comparar modelos de distintos proveedores para una misma tarea.',
    ],
    paraQuien: ['Desarrolladores e ingenieros de datos', 'Equipos que llevan prototipos de IA a producción'],
    complementa: [IA_INDUSTRIA, PYTHON, ['Guía: evidencia del mundo real', '/articulos/cursos-gratis-evidencia-del-mundo-real']],
    preguntas: [
      ['¿Qué es la generación aumentada por recuperación?', 'Una técnica que busca información en documentos propios y se la da al modelo para que responda con base en ellos.'],
      ['¿Cómo se evalúa una aplicación de IA?', 'Con un conjunto de preguntas de prueba, respuestas esperadas y métricas definidas antes de evaluar.'],
    ],
  },
  'coursera-especializacion-en-excel': {
    tituloSeo: 'Especialización en Excel en Coursera (inglés)',
    meta: 'Especialización en inglés de Coursera para dominar Excel de lo básico a lo avanzado, con la guía de Edvanta para salud y farmacia.',
    porQue: 'Excel sigue siendo la herramienta de datos más usada en farmacias, laboratorios y áreas de calidad: inventarios, vencimientos, indicadores y registros. Dominarlo de forma ordenada, de lo básico a las tablas dinámicas, ahorra horas cada semana y reduce errores.',
    aplicaciones: [
      'Construir un control de vencimientos con formato condicional.',
      'Resumir miles de registros en un informe con tablas dinámicas.',
      'Evitar errores de digitación con validación de datos.',
    ],
    paraQuien: ['Profesionales que usan Excel a diario', 'Auxiliares y regentes que llevan inventarios'],
    complementa: [['Artículo: cursos de Excel para profesionales de la salud', '/articulos/cursos-de-excel-para-profesionales-de-la-salud'], ['Guía: Power BI en la industria farmacéutica', '/articulos/cursos-gratis-power-bi-farmacia'], ['Curso gratis: Gestión de Desviaciones y CAPA', '/curso-de-gestion-de-desviaciones-y-capa']],
    preguntas: [
      ['¿Qué nivel de Excel piden en farmacia?', 'Normalmente intermedio: tablas, filtros, formato condicional, funciones de búsqueda y tablas dinámicas.'],
      ['¿Hay una opción en español?', 'Sí, el curso de Excel de Edutin Academy está en español y se toma sin costo.'],
    ],
  },
  'coursera-especializacion-en-excel-data-analytics-and-visualization': {
    tituloSeo: 'Curso de análisis de datos y gráficos en Excel',
    meta: 'Especialización en inglés de Coursera sobre análisis de datos y visualización en Excel, con la guía de Edvanta sobre indicadores en salud.',
    porQue: 'Analizar datos en Excel va más allá de las fórmulas: limpiar la información, resumirla y mostrarla en gráficos que ayuden a decidir. En salud y farmacia, eso se traduce en indicadores de calidad, consumos y tendencias que el equipo entiende de un vistazo.',
    aplicaciones: [
      'Limpiar una base de datos con registros duplicados o incompletos.',
      'Graficar la tendencia de un indicador con sus límites.',
      'Preparar un tablero sencillo para la reunión mensual de calidad.',
    ],
    paraQuien: ['Analistas de calidad y de servicio farmacéutico', 'Profesionales que preparan informes de indicadores'],
    complementa: [['Artículo: cursos de Excel para profesionales de la salud', '/articulos/cursos-de-excel-para-profesionales-de-la-salud'], ['Artículo: Power BI, para qué sirve en salud y farmacia', '/articulos/power-bi-para-que-sirve-en-salud-y-farmacia'], PYTHON],
    preguntas: [
      ['¿Excel o Power BI para un tablero?', 'Excel sirve para empezar; Power BI conviene cuando los datos crecen y el informe se actualiza con frecuencia.'],
      ['¿Necesito la especialización básica primero?', 'Ayuda tener nivel intermedio de Excel antes de este curso.'],
    ],
  },
};

/**
 * Unidad 3. Modelos de sistema de gestión de calidad: ICH Q10 e ISO 9001:2015 (8 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: modelos de SGC aplicables al sector farmacéutico',
    duracion: 20,
    gancho: {
      titulo: 'Dos idiomas para un mismo sistema',
      texto: 'Una empresa farmacéutica recibe en el mismo mes una auditoría de su cliente internacional, que pregunta por el sistema de calidad farmacéutico de ICH Q10, y la auditoría de certificación ISO 9001 de su distribuidora. El equipo de calidad siente que debe mantener dos sistemas. No es así: los dos modelos describen el mismo sistema con énfasis distintos. Esta unidad te enseña a leerlos juntos.',
    },
    objetivos: [
      'Presentar los dos modelos de SGC más usados en el sector: ICH Q10 e ISO 9001:2015.',
      'Explicar el propósito y el alcance de cada modelo y su relación con las BPM.',
      'Anticipar la ruta de la unidad hacia un sistema integrado.',
    ],
    conceptos: [
      { icono: 'Globe', termino: 'ICH Q10', definicion: 'Guía armonizada que describe un modelo de sistema de calidad farmacéutico para todo el ciclo de vida del producto, complementaria a las BPM. Fue aprobada por el ICH en 2008.' },
      { icono: 'Award', termino: 'ISO 9001:2015', definicion: 'Norma internacional de requisitos para un sistema de gestión de la calidad, aplicable a cualquier organización y certificable por organismos acreditados.' },
      { icono: 'Factory', termino: 'BPM', definicion: 'Requisitos obligatorios de fabricación y control de medicamentos. En Colombia, los adoptados por la Resolución 1160 de 2016.' },
      { icono: 'Puzzle', termino: 'Sistema integrado', definicion: 'Un solo sistema de procesos, documentos y responsables que cumple los requisitos de varias normas a la vez, sin duplicar.' },
    ],
    secciones: [
      {
        titulo: 'ICH Q10: el modelo farmacéutico',
        parrafos: [
          'ICH Q10 fue desarrollada por las autoridades y la industria de Europa, Japón y Estados Unidos dentro del Consejo Internacional de Armonización. Describe un **sistema de calidad farmacéutico** (PQS, por su sigla en inglés) basado en conceptos de ISO y en las BPM, y aplicable a todo el **ciclo de vida** del producto. No agrega requisitos regulatorios nuevos más allá de las BPM, pero muestra cómo gestionarlas como un sistema.',
          'Su estructura es fácil de recordar: tres objetivos, cuatro etapas del ciclo de vida, dos habilitadores (gestión del conocimiento y gestión de riesgos) y cuatro elementos (monitoreo del desempeño del proceso y la calidad del producto, CAPA, gestión del cambio y revisión por la dirección), todo bajo la **responsabilidad de la dirección**.',
        ],
      },
      {
        titulo: 'ISO 9001:2015: el modelo general',
        parrafos: [
          'ISO 9001:2015 es la norma de requisitos de sistemas de gestión de la calidad más usada en el mundo. Usa la **estructura de alto nivel** común a las normas ISO de sistemas de gestión, con diez cláusulas, y se basa en el enfoque a procesos, el ciclo PHVA y el pensamiento basado en riesgos. Su fortaleza está en la gestión: contexto, partes interesadas, liderazgo, objetivos, competencia, comunicación, auditoría interna y revisión por la dirección.',
          'En el sector farmacéutico, ISO 9001 se usa con frecuencia en distribuidores, operadores logísticos, laboratorios de servicios, proveedores de materiales y servicios farmacéuticos. En las plantas fabricantes, complementa a las BPM y a ICH Q10 con herramientas de gestión.',
        ],
      },
      {
        titulo: 'La ruta de la unidad',
        parrafos: [
          'Recorrerás primero ICH Q10: sus objetivos y la responsabilidad de la dirección, sus habilitadores y sus cuatro elementos, con su equivalente en las BPM europeas y de PIC/S. Luego ISO 9001: estructura de alto nivel, contexto y partes interesadas; liderazgo, política y objetivos; y pensamiento basado en riesgos. La unidad cierra con una comparación y un modelo de integración.',
          'Al terminar podrás explicar a un auditor de cualquiera de los dos marcos cómo tu sistema cumple sus requisitos, señalando los mismos procesos y la misma evidencia.',
        ],
      },
    ],
    caso: {
      titulo: 'Dos auditorías, un sistema',
      contexto: 'El equipo de calidad de un laboratorio propone crear un manual ISO 9001 independiente, con procedimientos propios, para la certificación de su operación logística, separado del sistema BPM de la planta.',
      pregunta: '¿Qué recomiendas?',
      opciones: [
        { texto: 'Hacerlo: cada norma necesita su propio sistema.', correcta: false, retro: 'Dos sistemas paralelos duplican documentos, confunden al personal y suelen contradecirse.' },
        { texto: 'Integrar: un solo mapa de procesos y un solo cuerpo documental, con una matriz que muestre dónde se cumple cada requisito de BPM, ICH Q10 e ISO 9001.', correcta: true, retro: 'La integración evita duplicidades y permite demostrar cumplimiento ante cualquier auditor con la misma evidencia.' },
        { texto: 'Abandonar ISO 9001 porque las BPM son suficientes.', correcta: false, retro: 'Si el negocio requiere la certificación, la solución es integrarla, no renunciar a ella.' },
      ],
    },
    errores: [
      { error: 'Pensar que ICH Q10 reemplaza a las BPM.', correccion: 'ICH Q10 complementa las BPM: las organiza como sistema para todo el ciclo de vida.' },
      { error: 'Creer que ISO 9001 es suficiente para fabricar medicamentos.', correccion: 'ISO 9001 no contiene los requisitos técnicos de BPM, que son obligatorios.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es el PQS?', respuesta: 'El sistema de calidad farmacéutico descrito por ICH Q10 para todo el ciclo de vida del producto.' },
      { pregunta: '¿En qué tipo de organizaciones farmacéuticas es común ISO 9001?', respuesta: 'Distribuidores, operadores logísticos, laboratorios de servicios, proveedores y servicios farmacéuticos, entre otros.' },
    ],
    resumen: [
      '**ICH Q10**: sistema de calidad farmacéutico para el ciclo de vida.',
      '**ISO 9001:2015**: requisitos generales de gestión, certificables.',
      'Un solo **sistema integrado** puede cumplir ambos, junto con las BPM.',
    ],
    referencias: [R.ichQ10, R.iso9001, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Dos piezas de rompecabezas (ICH Q10 e ISO 9001) que encajan sobre una base rotulada BPM.', alt: 'Integración de ICH Q10, ISO 9001 y BPM en un solo sistema' },
    ],
    keywords: ['modelos de sistema de gestión de calidad farmacéutica', 'ich q10 vs iso 9001', 'sistema de calidad farmacéutico pqs', 'iso 9001 en la industria farmacéutica', 'sistema integrado de gestión farmacéutico'],
  },
  {
    titulo: 'Modelo ICH Q10: objetivos, ciclo de vida y responsabilidad de la dirección',
    duracion: 25,
    gancho: {
      titulo: 'Cuando la dirección no está, el sistema no existe',
      texto: 'Un gerente de planta firma cada año la política de calidad y no vuelve a hablar del tema. Cuando el laboratorio de control de calidad pide un equipo nuevo para reducir los resultados atípicos, la solicitud espera seis meses. ICH Q10 dedica un capítulo completo a la responsabilidad de la dirección porque sabe que, sin decisiones y recursos, el sistema de calidad es solo un documento.',
    },
    objetivos: [
      'Enunciar los tres objetivos del sistema de calidad farmacéutico según ICH Q10.',
      'Describir las cuatro etapas del ciclo de vida del producto y cómo el PQS actúa en cada una.',
      'Explicar las responsabilidades de la dirección y cómo se evidencian.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'Lograr la realización del producto', definicion: 'Establecer, implementar y mantener un sistema que permita entregar productos con los atributos de calidad apropiados para los pacientes y los profesionales de la salud.' },
      { icono: 'ShieldCheck', termino: 'Establecer y mantener un estado de control', definicion: 'Desarrollar y usar sistemas eficaces de monitoreo y control del desempeño del proceso y de la calidad del producto, que den confianza en su idoneidad y capacidad continua.' },
      { icono: 'RefreshCw', termino: 'Facilitar la mejora continua', definicion: 'Identificar e implementar mejoras de la calidad del producto, del proceso, de la reducción de la variabilidad, de la innovación y del propio sistema de calidad.' },
      { icono: 'Route', termino: 'Ciclo de vida', definicion: 'Desarrollo farmacéutico, transferencia de tecnología, fabricación comercial y discontinuación del producto.' },
    ],
    mapa: {
      centro: 'ICH Q10',
      ramas: [
        { titulo: 'Objetivos', icono: 'Target', nodos: ['Realización del producto', 'Estado de control', 'Mejora continua'] },
        { titulo: 'Ciclo de vida', icono: 'Route', nodos: ['Desarrollo', 'Transferencia de tecnología', 'Fabricación comercial', 'Discontinuación'] },
        { titulo: 'Dirección', icono: 'Flag', nodos: ['Compromiso y política', 'Planificación y recursos', 'Comunicación y revisión', 'Supervisión de lo contratado'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tres objetivos',
        parrafos: [
          'ICH Q10 asigna al sistema de calidad farmacéutico tres objetivos. El primero, **lograr la realización del producto**: entregar productos con los atributos de calidad que necesitan los pacientes. El segundo, **establecer y mantener un estado de control**: monitorear y controlar el proceso y el producto para tener confianza continua en su desempeño. El tercero, **facilitar la mejora continua**: del producto, del proceso y del sistema mismo.',
          'Los tres se refuerzan. Sin estado de control no hay datos confiables para mejorar; sin mejora continua, el estado de control se degrada con el tiempo. Un buen ejercicio es preguntarse, para cada proceso del sistema, a cuál de los tres objetivos contribuye y cómo se mide.',
        ],
      },
      {
        titulo: 'El sistema a lo largo del ciclo de vida',
        parrafos: [
          'El PQS no empieza en la fabricación. En el **desarrollo farmacéutico** se diseñan el producto y el proceso, y se construye el conocimiento sobre qué atributos y parámetros son críticos. En la **transferencia de tecnología** ese conocimiento pasa del desarrollo a la planta, o de una planta a otra, de forma documentada. En la **fabricación comercial** el sistema mantiene el estado de control y mejora. Y en la **discontinuación** se gestionan la retención de documentos y muestras, la estabilidad pendiente y la atención de quejas del producto que sigue en el mercado.',
          'Para una empresa que solo fabrica genéricos o productos licenciados, el desarrollo puede ser limitado, pero la transferencia de tecnología y la discontinuación siguen siendo etapas reales que deben estar gestionadas.',
        ],
      },
      {
        titulo: 'Responsabilidad de la dirección',
        parrafos: [
          'ICH Q10 pide a la alta dirección: demostrar **compromiso** con el sistema; establecer una **política de calidad**; asegurar la **planificación** con objetivos de calidad; proveer **recursos** adecuados (personas, instalaciones, equipos, presupuesto); asegurar la **comunicación interna** de los temas de calidad, incluido el escalamiento oportuno de problemas; realizar la **revisión por la dirección**; supervisar las **actividades contratadas** y los materiales comprados; y gestionar los cambios de **titularidad** del producto.',
          'La evidencia de esa responsabilidad no está en la firma de la política, sino en las actas: decisiones sobre recursos, seguimiento de indicadores, respuesta a problemas escalados, aprobación de planes de mejora. En una auditoría, la pregunta «muéstreme la última decisión de la dirección basada en un indicador de calidad» dice más que cualquier manual.',
        ],
      },
    ],
    caso: {
      titulo: 'El problema que no subió',
      contexto: 'Durante tres meses, el laboratorio de control de calidad registró resultados atípicos repetidos en la valoración de un producto. El jefe del laboratorio los repitió hasta obtener resultados conformes y no informó a la dirección.',
      pregunta: '¿Qué responsabilidad de la dirección según ICH Q10 está fallando?',
      opciones: [
        { texto: 'La política de calidad.', correcta: false, retro: 'La política puede existir; el problema es que el sistema no escaló un problema de calidad.' },
        { texto: 'La comunicación interna y el escalamiento: la dirección debe asegurar que los problemas de calidad lleguen oportunamente a quien decide, y crear condiciones para reportarlos.', correcta: true, retro: 'ICH Q10 pide procesos de comunicación que escalen los problemas de calidad. Repetir hasta obtener conformes, además, es una falla grave de integridad.' },
        { texto: 'La gestión de la titularidad del producto.', correcta: false, retro: 'Ese aspecto se refiere a cambios de propiedad del producto, no a este caso.' },
      ],
    },
    errores: [
      { error: 'Reducir la responsabilidad de la dirección a firmar la política.', correccion: 'Evidénciala con decisiones de recursos, seguimiento de indicadores y respuesta a problemas escalados.' },
      { error: 'Olvidar la etapa de discontinuación.', correccion: 'Planifica retención de documentos y muestras, estabilidad pendiente y quejas del producto aún en el mercado.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los tres objetivos de ICH Q10?', respuesta: 'Lograr la realización del producto, establecer y mantener un estado de control y facilitar la mejora continua.' },
      { pregunta: '¿Cuáles son las cuatro etapas del ciclo de vida?', respuesta: 'Desarrollo farmacéutico, transferencia de tecnología, fabricación comercial y discontinuación.' },
      { pregunta: 'Nombra tres responsabilidades de la dirección según ICH Q10.', respuesta: 'Por ejemplo: compromiso, política de calidad, planificación, recursos, comunicación interna, revisión por la dirección y supervisión de actividades contratadas.' },
    ],
    resumen: [
      'Tres objetivos: **realización del producto, estado de control y mejora continua**.',
      'El PQS actúa en **todo el ciclo de vida**, del desarrollo a la discontinuación.',
      'La **dirección** se evidencia en decisiones y recursos, no solo en firmas.',
    ],
    referencias: [R.ichQ10, R.eudralexCap1, R.trs986a2],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Línea horizontal del ciclo de vida del producto con el sistema de calidad farmacéutico como una banda que la recorre completa.', alt: 'Ciclo de vida del producto según ICH Q10' },
    ],
    keywords: ['ich q10 objetivos', 'ich q10 ciclo de vida del producto', 'responsabilidad de la dirección ich q10', 'estado de control farmacéutico', 'sistema de calidad farmacéutico ich q10', 'ich q10 en español'],
  },
  {
    titulo: 'Habilitadores del PQS: gestión del conocimiento y gestión de riesgos de calidad',
    duracion: 25,
    gancho: {
      titulo: 'Lo que se va cuando se va una persona',
      texto: 'El químico que desarrolló un producto hace quince años se jubila. Con él se va la explicación de por qué el granulado se seca a esa temperatura y no a otra. Meses después, un cambio aparentemente inocente provoca problemas de disolución, y nadie sabe por qué ocurre. ICH Q10 llama habilitadores a la gestión del conocimiento y a la gestión de riesgos porque sin ellos el sistema decide a ciegas.',
    },
    objetivos: [
      'Explicar qué son la gestión del conocimiento y la gestión de riesgos para la calidad dentro del PQS.',
      'Describir el proceso de gestión de riesgos de ICH Q9(R1) y sus actualizaciones de 2023.',
      'Aplicar ambos habilitadores en decisiones típicas del sistema de calidad.',
    ],
    conceptos: [
      { icono: 'BookOpen', termino: 'Gestión del conocimiento', definicion: 'Enfoque sistemático para adquirir, analizar, almacenar y difundir la información sobre productos, procesos y componentes a lo largo del ciclo de vida.' },
      { icono: 'AlertTriangle', termino: 'Gestión de riesgos para la calidad', definicion: 'Proceso sistemático para evaluar, controlar, comunicar y revisar los riesgos para la calidad del producto a lo largo de su ciclo de vida (ICH Q9).' },
      { icono: 'Scale', termino: 'Formalidad', definicion: 'El grado de estructura, documentación y participación que se da a una evaluación de riesgos, proporcional a la incertidumbre, la importancia y la complejidad de la decisión (ICH Q9(R1)).' },
      { icono: 'Eye', termino: 'Subjetividad', definicion: 'El sesgo que introducen las opiniones y percepciones en la puntuación del riesgo; ICH Q9(R1) pide reconocerlo y controlarlo.' },
    ],
    proceso: {
      titulo: 'El proceso de gestión de riesgos (ICH Q9)',
      intro: 'Se inicia con una pregunta clara sobre el riesgo y termina con una decisión documentada que se revisa.',
      pasos: [
        { titulo: 'Iniciar', detalle: 'Definir el problema o la pregunta de riesgo, reunir información y conformar el equipo.', icono: 'Flag', evidencia: 'Alcance y pregunta de riesgo.' },
        { titulo: 'Identificar', detalle: 'Usar información sistemática para identificar peligros: qué podría salir mal.', icono: 'Search', evidencia: 'Lista de peligros.' },
        { titulo: 'Analizar', detalle: 'Estimar la probabilidad y la severidad, y la capacidad de detección cuando aplique.', icono: 'Calculator', evidencia: 'Análisis con criterios definidos.' },
        { titulo: 'Evaluar', detalle: 'Comparar el riesgo estimado con criterios de aceptación.', icono: 'Scale', evidencia: 'Riesgos priorizados.' },
        { titulo: 'Controlar', detalle: 'Reducir el riesgo hasta un nivel aceptable o aceptarlo de forma justificada.', icono: 'ShieldCheck', evidencia: 'Controles definidos y riesgo residual.' },
        { titulo: 'Comunicar y revisar', detalle: 'Compartir el resultado con quienes deciden y revisar el riesgo cuando haya nueva información.', icono: 'RefreshCw', evidencia: 'Registro de comunicación y revisiones.' },
      ],
    },
    secciones: [
      {
        titulo: 'Gestión del conocimiento',
        parrafos: [
          'ICH Q10 define la **gestión del conocimiento** como un enfoque sistemático para adquirir, analizar, almacenar y difundir información sobre productos, procesos de fabricación y componentes. Las fuentes incluyen el conocimiento previo, los estudios de desarrollo, la transferencia de tecnología, la validación, la experiencia de fabricación, la innovación, la mejora continua y las actividades de gestión del cambio.',
          'En la práctica, gestionar el conocimiento es asegurar que las **razones** de las decisiones quedan escritas y disponibles: por qué se eligió ese parámetro, qué se aprendió de una desviación, qué mostró la revisión anual. Herramientas útiles son los informes de desarrollo bien archivados, las bases de lecciones aprendidas de investigaciones, los informes de revisión de producto y los planes de sucesión del conocimiento crítico. La guía de buenas prácticas de ISPE sobre gestión del conocimiento desarrolla métodos concretos.',
        ],
      },
      {
        titulo: 'Gestión de riesgos para la calidad',
        parrafos: [
          'ICH Q9 describe la **gestión de riesgos para la calidad** con dos principios: la evaluación del riesgo debe basarse en el conocimiento científico y vincularse con la protección del paciente, y el nivel de esfuerzo, formalidad y documentación debe ser proporcional al nivel de riesgo. El proceso tiene cuatro componentes: **evaluación** (identificación, análisis y evaluación), **control** (reducción y aceptación), **comunicación** y **revisión**.',
          'La revisión de 2023, **ICH Q9(R1)**, aclaró cuatro temas: la **formalidad** (no toda decisión requiere un análisis complejo, pero el nivel de formalidad debe justificarse), la **subjetividad** en las puntuaciones, la **toma de decisiones basada en riesgo** y los riesgos para la **disponibilidad** del producto, como los que causan desabastecimientos. Herramientas frecuentes son el diagrama de Ishikawa, el análisis de modo y efecto de falla (FMEA), el HACCP y las matrices de riesgo.',
        ],
      },
      {
        titulo: 'Los habilitadores en decisiones reales',
        parrafos: [
          'Un cambio de proveedor de un excipiente es un buen ejemplo de cómo trabajan juntos. La **gestión del conocimiento** aporta lo que se sabe del papel del excipiente en la formulación y de cambios anteriores. La **gestión de riesgos** estructura la evaluación: qué atributos podrían verse afectados, con qué probabilidad y severidad, y qué estudios se necesitan para controlar el riesgo. La decisión queda documentada y alimenta de nuevo el conocimiento.',
          'Lo mismo ocurre al decidir el alcance de una investigación, la frecuencia de un monitoreo ambiental o qué proveedores auditar primero. Cuando estos habilitadores funcionan, el sistema decide con razones; cuando faltan, decide por costumbre o por urgencia.',
        ],
      },
    ],
    caso: {
      titulo: 'La matriz de riesgo para todo',
      contexto: 'Un laboratorio exige un FMEA completo, con equipo multidisciplinario y tres reuniones, para cualquier cambio, incluido el reemplazo de un termómetro calibrado por otro idéntico. Los cambios importantes esperan semanas por falta de tiempo del equipo.',
      pregunta: '¿Qué orientación de ICH Q9(R1) aplica?',
      opciones: [
        { texto: 'Mantenerlo: más análisis siempre es más seguro.', correcta: false, retro: 'Aplicar la misma formalidad a todo consume recursos que deberían ir a los riesgos importantes.' },
        { texto: 'Ajustar la formalidad al riesgo: análisis simples para decisiones de bajo impacto y FMEA formal para las complejas o inciertas, con criterios escritos.', correcta: true, retro: 'ICH Q9(R1) aclara que la formalidad debe ser proporcional a la incertidumbre, la importancia y la complejidad.' },
        { texto: 'Eliminar los análisis de riesgo para agilizar.', correcta: false, retro: 'Eliminar la gestión de riesgos deja las decisiones sin base; la solución es la proporcionalidad.' },
      ],
    },
    errores: [
      { error: 'Puntuar riesgos sin criterios definidos.', correccion: 'Define escalas de probabilidad, severidad y detección con descripciones, y controla la subjetividad con revisión por pares.' },
      { error: 'Archivar los informes de desarrollo donde nadie los encuentra.', correccion: 'Organiza el conocimiento por producto y vincúlalo con el control de cambios y la revisión anual.' },
      { error: 'Hacer el análisis de riesgo después de decidir, para justificar.', correccion: 'El análisis debe informar la decisión, no decorarla.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los dos habilitadores del PQS?', respuesta: 'La gestión del conocimiento y la gestión de riesgos para la calidad.' },
      { pregunta: '¿Qué cuatro temas aclaró ICH Q9(R1) en 2023?', respuesta: 'Formalidad, subjetividad, toma de decisiones basada en riesgo y riesgos para la disponibilidad del producto.' },
    ],
    resumen: [
      'La **gestión del conocimiento** conserva las razones de las decisiones.',
      'La **gestión de riesgos** (ICH Q9) evalúa, controla, comunica y revisa.',
      'La **formalidad** debe ser proporcional al riesgo.',
    ],
    referencias: [R.ichQ10, R.ichQ9, R.trs986a2],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Diagrama circular del proceso de gestión de riesgos de ICH Q9 con sus cuatro componentes.', alt: 'Proceso de gestión de riesgos para la calidad según ICH Q9' },
    ],
    keywords: ['gestión del conocimiento farmacéutico', 'ich q9 r1 gestión de riesgos', 'gestión de riesgos para la calidad', 'formalidad ich q9', 'habilitadores ich q10', 'fmea industria farmacéutica'],
  },
  {
    titulo: 'Los cuatro elementos del PQS y su equivalente en las BPM europeas/PIC/S',
    duracion: 25,
    gancho: {
      titulo: 'Cuatro engranajes que deben girar juntos',
      texto: 'Una planta tiene un excelente sistema de CAPA, pero su control de cambios no consulta las tendencias del proceso, y la dirección revisa indicadores que nadie conecta con las investigaciones. Cada pieza funciona sola, y el sistema no aprende. ICH Q10 describe cuatro elementos que deben girar juntos como engranajes. Esta clase muestra cómo, y dónde aparecen en las BPM europeas y de PIC/S.',
    },
    objetivos: [
      'Describir los cuatro elementos del sistema de calidad farmacéutico de ICH Q10.',
      'Explicar cómo se alimentan entre sí.',
      'Ubicar su equivalente en el capítulo 1 de las BPM europeas y de PIC/S.',
    ],
    conceptos: [
      { icono: 'LineChart', termino: 'Monitoreo del desempeño del proceso y la calidad del producto', definicion: 'Sistema para planificar y ejecutar el monitoreo que asegura que el proceso sigue en estado de control e identifica áreas de mejora.' },
      { icono: 'Wrench', termino: 'Sistema de acciones correctivas y preventivas (CAPA)', definicion: 'Sistema para implementar acciones a partir de la investigación de quejas, rechazos, no conformidades, retiros, desviaciones, auditorías, inspecciones y tendencias.' },
      { icono: 'GitBranch', termino: 'Sistema de gestión del cambio', definicion: 'Sistema para evaluar, aprobar, implementar y verificar los cambios con base en el conocimiento y la gestión de riesgos.' },
      { icono: 'Users', termino: 'Revisión por la dirección', definicion: 'Revisión periódica, por parte de la dirección, del desempeño del proceso y la calidad del producto, que asegura que se gestionan a lo largo del ciclo de vida.' },
    ],
    mapa: {
      centro: 'Cuatro elementos del PQS',
      ramas: [
        { titulo: 'Monitoreo', icono: 'LineChart', nodos: ['Estrategia de control', 'Tendencias', 'Fuentes de variación'] },
        { titulo: 'CAPA', icono: 'Wrench', nodos: ['Investigación y causa raíz', 'Acción proporcional al riesgo', 'Eficacia'] },
        { titulo: 'Gestión del cambio', icono: 'GitBranch', nodos: ['Evaluación con riesgo', 'Aprobación', 'Verificación posterior'] },
        { titulo: 'Revisión por la dirección', icono: 'Users', nodos: ['Indicadores', 'Decisiones', 'Recursos'] },
      ],
    },
    secciones: [
      {
        titulo: 'Los cuatro elementos',
        parrafos: [
          'El **monitoreo del desempeño del proceso y la calidad del producto** usa la gestión de riesgos para definir una estrategia de control, mide los parámetros y atributos, analiza tendencias, identifica fuentes de variación y retroalimenta el conocimiento. El **sistema CAPA** investiga las quejas, rechazos, no conformidades, retiros, desviaciones, hallazgos de auditorías e inspecciones y tendencias, con un esfuerzo y una formalidad proporcionales al riesgo, y verifica la eficacia de las acciones.',
          'El **sistema de gestión del cambio** evalúa cada cambio propuesto con conocimiento y gestión de riesgos, lo aprueba con la participación de expertos, considera el impacto regulatorio y verifica después de implementarlo que logró su objetivo sin efectos no deseados. La **revisión por la dirección** revisa los resultados de los otros tres, junto con inspecciones, auditorías, quejas y estudios de satisfacción, y toma decisiones y asigna recursos.',
        ],
      },
      {
        titulo: 'Cómo se alimentan entre sí',
        parrafos: [
          'Los elementos forman un ciclo. El **monitoreo** detecta una tendencia, que dispara una investigación en el **sistema CAPA**. La CAPA propone una mejora del proceso, que entra por el **control de cambios**. El cambio se implementa y el **monitoreo** verifica su efecto. La **revisión por la dirección** ve el conjunto y decide prioridades y recursos. Si alguno de los elementos está desconectado, el ciclo se rompe y el sistema deja de aprender.',
          'Una prueba útil en auditoría interna es seguir un hilo: escoger una tendencia, buscar la investigación que generó, la CAPA, el cambio, la verificación de eficacia y la mención en la revisión por la dirección. Si el hilo se corta, ahí está la debilidad del sistema.',
        ],
      },
      {
        titulo: 'Su lugar en las BPM europeas y de PIC/S',
        parrafos: [
          'Las autoridades europeas incorporaron ICH Q10 en el **capítulo 1 de las BPM de la Unión Europea** (EudraLex, volumen 4), titulado sistema de calidad farmacéutico, revisado en 2013, y lo publicaron además como parte III de la guía. La guía de BPM de **PIC/S**, organización que reúne a autoridades de inspección de muchos países, sigue la misma estructura en su capítulo 1. Allí se exigen, entre otros, el monitoreo del proceso, las CAPA, la gestión de cambios, la revisión por la dirección y la **revisión de calidad del producto**.',
          'Para una empresa colombiana que exporta o que recibe auditorías de clientes internacionales, estas guías son la referencia que usarán los auditores. Conocer su capítulo 1 permite demostrar que el sistema local cumple la Resolución 1160 de 2016 y, a la vez, el estándar internacional.',
        ],
      },
    ],
    caso: {
      titulo: 'El hilo que se corta',
      contexto: 'En una auditoría interna se sigue una tendencia de aumento de humedad en un granulado. Hubo investigación y CAPA (ajustar el tiempo de secado), pero el cambio se implementó con una instrucción verbal y la revisión por la dirección nunca lo mencionó.',
      pregunta: '¿Qué elementos del PQS fallaron?',
      opciones: [
        { texto: 'Solo el monitoreo, porque la tendencia tardó en detectarse.', correcta: false, retro: 'El monitoreo sí detectó la tendencia; el problema está después.' },
        { texto: 'La gestión del cambio (cambio sin control ni verificación) y la revisión por la dirección (no conoció ni decidió sobre el tema).', correcta: true, retro: 'La CAPA debió pasar por control de cambios con evaluación, documentación y verificación, y llegar a la revisión por la dirección.' },
        { texto: 'Ninguno, porque el problema se resolvió.', correcta: false, retro: 'Sin control de cambios no hay evidencia de que se resolvió ni de que no causó otros efectos.' },
      ],
    },
    errores: [
      { error: 'Gestionar CAPA y cambios en sistemas que no se comunican.', correccion: 'Vincula cada CAPA que modifica algo con su control de cambios, y viceversa.' },
      { error: 'Revisión por la dirección que solo lee indicadores.', correccion: 'Incluye decisiones, responsables y recursos, y su seguimiento en la siguiente revisión.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los cuatro elementos del PQS?', respuesta: 'Monitoreo del desempeño del proceso y la calidad del producto, sistema CAPA, sistema de gestión del cambio y revisión por la dirección.' },
      { pregunta: '¿Dónde se incorporó ICH Q10 en las BPM europeas?', respuesta: 'En el capítulo 1 de la EudraLex, volumen 4, sistema de calidad farmacéutico, y como parte III de la guía.' },
    ],
    resumen: [
      'Cuatro elementos: **monitoreo, CAPA, gestión del cambio y revisión por la dirección**.',
      'Forman un **ciclo**: si uno se desconecta, el sistema no aprende.',
      'Las **BPM europeas y PIC/S** los exigen en su capítulo 1.',
    ],
    referencias: [R.ichQ10, R.eudralexCap1, R.picsParte1, R.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de cómo se alimentan', descripcion: 'Cuatro engranajes conectados con flechas: monitoreo, CAPA, gestión del cambio y revisión por la dirección.', alt: 'Ciclo de los cuatro elementos del sistema de calidad farmacéutico' },
    ],
    keywords: ['elementos del sistema de calidad farmacéutico', 'ich q10 capa gestión del cambio', 'monitoreo del desempeño del proceso', 'eudralex capítulo 1 sistema de calidad', 'pics gmp capítulo 1', 'revisión por la dirección ich q10'],
  },
  {
    titulo: 'Estructura de alto nivel de ISO 9001:2015, contexto y partes interesadas',
    duracion: 25,
    gancho: {
      titulo: 'Diez cláusulas que se repiten en todas las normas',
      texto: 'Una empresa certificada en ISO 9001 decide certificarse también en ISO 14001 (ambiente) e ISO 45001 (seguridad y salud en el trabajo). Descubre con alivio que las tres normas tienen la misma estructura de diez cláusulas, los mismos términos básicos y requisitos comunes de contexto, liderazgo, planificación, apoyo, operación, evaluación y mejora. Esa estructura de alto nivel es la puerta de entrada a ISO 9001:2015.',
    },
    objetivos: [
      'Describir la estructura de alto nivel de diez cláusulas de ISO 9001:2015.',
      'Explicar los requisitos de contexto de la organización y partes interesadas.',
      'Aplicar el análisis de contexto a una organización farmacéutica.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'Estructura de alto nivel', definicion: 'Estructura común de diez cláusulas, con texto y términos básicos idénticos, que usan las normas ISO de sistemas de gestión para facilitar su integración.' },
      { icono: 'Globe', termino: 'Contexto de la organización', definicion: 'Las cuestiones externas e internas pertinentes para el propósito y la dirección estratégica de la organización, que afectan su capacidad de lograr los resultados del SGC.' },
      { icono: 'Users', termino: 'Partes interesadas', definicion: 'Personas u organizaciones que pueden afectar, verse afectadas o percibirse afectadas por una decisión o actividad, como pacientes, clientes, autoridad sanitaria, proveedores y empleados.' },
      { icono: 'Crosshair', termino: 'Alcance del SGC', definicion: 'Los límites y la aplicabilidad del sistema: productos, servicios, sedes y procesos que cubre.' },
    ],
    mapa: {
      centro: 'ISO 9001:2015',
      ramas: [
        { titulo: 'Cláusulas 1 a 3', icono: 'BookOpen', nodos: ['Objeto y campo de aplicación', 'Referencias normativas', 'Términos y definiciones'] },
        { titulo: 'Planificar', icono: 'Target', nodos: ['4. Contexto de la organización', '5. Liderazgo', '6. Planificación'] },
        { titulo: 'Hacer', icono: 'Factory', nodos: ['7. Apoyo', '8. Operación'] },
        { titulo: 'Verificar y actuar', icono: 'RefreshCw', nodos: ['9. Evaluación del desempeño', '10. Mejora'] },
      ],
    },
    secciones: [
      {
        titulo: 'Las diez cláusulas',
        parrafos: [
          'ISO 9001:2015 sigue la **estructura de alto nivel** de las normas ISO de sistemas de gestión. Las cláusulas 1 a 3 son introductorias: objeto y campo de aplicación, referencias normativas y términos y definiciones. Los requisitos auditables están en las cláusulas 4 a 10: **4. Contexto de la organización**, **5. Liderazgo**, **6. Planificación**, **7. Apoyo** (recursos, competencia, toma de conciencia, comunicación e información documentada), **8. Operación**, **9. Evaluación del desempeño** (seguimiento, medición, auditoría interna y revisión por la dirección) y **10. Mejora**.',
          'Las cláusulas siguen el ciclo **PHVA**: planificar (4, 5 y 6), hacer (7 y 8), verificar (9) y actuar (10). Gracias a la estructura común, una organización puede integrar en un solo sistema los requisitos de calidad, ambiente y seguridad y salud en el trabajo.',
        ],
      },
      {
        titulo: 'Contexto y partes interesadas',
        parrafos: [
          'La cláusula 4.1 pide determinar las **cuestiones externas e internas** pertinentes: externas como la regulación, el mercado, la competencia, la tecnología o el entorno económico; internas como la cultura, la capacidad instalada, el conocimiento o los recursos. La cláusula 4.2 pide determinar las **partes interesadas** pertinentes y sus **requisitos**. En 2024, ISO publicó una enmienda que agrega a ambas cláusulas la consideración de si el **cambio climático** es una cuestión pertinente y si las partes interesadas tienen requisitos relacionados con él.',
          'En una organización farmacéutica, la autoridad sanitaria es una parte interesada de primer nivel y sus requisitos son obligatorios. Otras son los pacientes, los prescriptores, los clientes institucionales, los proveedores de materiales y servicios, los empleados y la comunidad. Herramientas frecuentes para documentar el contexto son el análisis DOFA o PESTEL y una matriz de partes interesadas con sus requisitos y cómo se atienden.',
        ],
      },
      {
        titulo: 'Alcance y procesos',
        parrafos: [
          'Con el contexto definido, la cláusula 4.3 pide establecer el **alcance** del sistema: qué productos, servicios y sedes cubre, y justificar cualquier requisito de la norma que no se aplique. La cláusula 4.4 pide determinar los **procesos** necesarios, sus entradas y salidas, su secuencia e interacción, los criterios y métodos de control, los recursos, los responsables, los riesgos y oportunidades, y cómo se evalúan y mejoran.',
          'El análisis de contexto no es un documento para archivar. Se revisa en la revisión por la dirección y alimenta la planificación: si cambia la regulación, si entra un competidor o si se pierde un proveedor crítico, el sistema debe ajustar sus riesgos, objetivos y procesos.',
        ],
      },
    ],
    caso: {
      titulo: 'El contexto que nadie actualizó',
      contexto: 'Un distribuidor farmacéutico certificado en ISO 9001 tiene un análisis de contexto de hace cuatro años. Desde entonces cambió la norma de un tipo de producto que distribuye y perdió a su principal proveedor de transporte refrigerado.',
      pregunta: '¿Qué debe hacer según ISO 9001:2015?',
      opciones: [
        { texto: 'Nada, porque el análisis de contexto se hace una vez al certificarse.', correcta: false, retro: 'La norma pide hacer seguimiento y revisar la información sobre las cuestiones externas e internas y las partes interesadas.' },
        { texto: 'Actualizar el contexto y las partes interesadas, revisar los riesgos asociados (cumplimiento regulatorio y cadena de frío) y llevarlo a la revisión por la dirección.', correcta: true, retro: 'El contexto alimenta la planificación; los cambios deben traducirse en riesgos, objetivos y acciones.' },
        { texto: 'Esperar a la auditoría de seguimiento para actualizarlo.', correcta: false, retro: 'Los riesgos ya existen; esperar a la auditoría deja al sistema sin respuesta.' },
      ],
    },
    errores: [
      { error: 'Copiar un DOFA genérico.', correccion: 'Identifica cuestiones reales de tu organización que afecten su capacidad de cumplir y satisfacer a sus partes interesadas.' },
      { error: 'Omitir a la autoridad sanitaria como parte interesada.', correccion: 'Inclúyela con sus requisitos obligatorios y conecta cada uno con un proceso.' },
      { error: 'Excluir requisitos sin justificación.', correccion: 'Justifica por escrito por qué un requisito no aplica y verifica que no afecte la conformidad del producto o servicio.' },
    ],
    comprueba: [
      { pregunta: '¿Qué cláusulas de ISO 9001:2015 contienen los requisitos?', respuesta: 'De la 4 a la 10: contexto, liderazgo, planificación, apoyo, operación, evaluación del desempeño y mejora.' },
      { pregunta: '¿Qué agregó la enmienda de 2024 a las cláusulas 4.1 y 4.2?', respuesta: 'La consideración de si el cambio climático es una cuestión pertinente y si las partes interesadas tienen requisitos relacionados.' },
    ],
    resumen: [
      'ISO 9001:2015 usa la **estructura de alto nivel**: diez cláusulas, requisitos en la 4 a la 10.',
      'El **contexto** y las **partes interesadas** se revisan y alimentan la planificación.',
      'El **alcance** y los **procesos** se definen a partir del contexto.',
    ],
    referencias: [R.iso9001, R.iso9000, R.isoPrincipios],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Ciclo PHVA ilustrado con las cláusulas 4 a 10 de ISO 9001:2015 ubicadas en cada fase.', alt: 'Estructura de alto nivel de ISO 9001:2015 y el ciclo PHVA' },
    ],
    keywords: ['estructura de alto nivel iso 9001', 'cláusulas iso 9001 2015', 'contexto de la organización iso 9001', 'partes interesadas iso 9001', 'iso 9001 cláusula 4', 'iso 9001 enmienda 2024 cambio climático'],
  },
  {
    titulo: 'Liderazgo, política y objetivos de calidad',
    duracion: 20,
    gancho: {
      titulo: 'La política que nadie podía explicar',
      texto: 'En una auditoría, la auditora le pide a un operario de empaque que le cuente qué dice la política de calidad. El operario señala el cuadro de la pared y lee la primera línea. Luego la auditora pregunta qué hace él, en su puesto, para cumplirla. El operario no sabe qué responder. Una política que no se traduce en objetivos y en comportamientos no dirige nada.',
    },
    objetivos: [
      'Explicar los requisitos de liderazgo y compromiso de ISO 9001:2015.',
      'Redactar una política de calidad pertinente para una organización farmacéutica.',
      'Formular objetivos de calidad medibles y planificar cómo lograrlos.',
    ],
    conceptos: [
      { icono: 'Flag', termino: 'Liderazgo y compromiso', definicion: 'La alta dirección asume la responsabilidad de la eficacia del SGC, asegura la política y los objetivos, la integración con el negocio, los recursos y la comunicación, y promueve la mejora.' },
      { icono: 'FileText', termino: 'Política de calidad', definicion: 'Intenciones y dirección de la organización relativas a la calidad, expresadas formalmente por la alta dirección. Debe ser apropiada, servir de marco para los objetivos e incluir compromisos de cumplimiento y mejora.' },
      { icono: 'Target', termino: 'Objetivo de calidad', definicion: 'Resultado a lograr relacionado con la calidad, coherente con la política, medible y con seguimiento.' },
      { icono: 'UserCheck', termino: 'Roles y autoridades', definicion: 'Responsabilidades asignadas y comunicadas para asegurar que el SGC cumple los requisitos y que se informa sobre su desempeño.' },
    ],
    secciones: [
      {
        titulo: 'Liderazgo que se ve',
        parrafos: [
          'La cláusula 5.1 de ISO 9001:2015 pide que la alta dirección **demuestre** liderazgo y compromiso: rindiendo cuentas de la eficacia del sistema, asegurando la política y los objetivos, integrando los requisitos del SGC en los procesos del negocio, promoviendo el enfoque a procesos y el pensamiento basado en riesgos, asegurando los recursos, comunicando la importancia de la calidad y apoyando a otros roles de liderazgo. La cláusula 5.1.2 agrega el **enfoque al cliente**: cumplir sus requisitos y los legales, gestionar los riesgos que afectan la conformidad y mantener el foco en su satisfacción.',
          'ICH Q10 pide lo mismo con otras palabras. La diferencia entre un liderazgo de papel y uno real se ve en la agenda: ¿cuánto tiempo dedica la dirección a revisar indicadores de calidad, recorrer las áreas y decidir sobre problemas escalados?',
        ],
      },
      {
        titulo: 'Una política útil',
        parrafos: [
          'La cláusula 5.2 pide una **política de calidad** apropiada al propósito y contexto de la organización, que proporcione un marco para los objetivos e incluya el compromiso de cumplir los requisitos aplicables y de mejorar continuamente. Debe estar disponible como información documentada, comunicarse, entenderse y aplicarse.',
          'Una buena política farmacéutica es breve y concreta. Por ejemplo: «Fabricamos medicamentos seguros y eficaces que cumplen su registro sanitario y las Buenas Prácticas de Manufactura; tomamos decisiones basadas en el riesgo para el paciente; mejoramos nuestros procesos con datos, y desarrollamos la competencia de nuestro equipo». Cada frase debe poder conectarse con un objetivo y con un proceso.',
        ],
      },
      {
        titulo: 'Objetivos que se cumplen',
        parrafos: [
          'La cláusula 6.2 pide **objetivos de calidad** en las funciones, niveles y procesos pertinentes: coherentes con la política, medibles, que tengan en cuenta los requisitos aplicables, pertinentes para la conformidad del producto y la satisfacción del cliente, con seguimiento, comunicados y actualizados. Y para lograrlos hay que planificar qué se va a hacer, qué recursos se requerirán, quién será responsable, cuándo se finalizará y cómo se evaluarán los resultados.',
          'Ejemplos farmacéuticos: reducir en 30 % las desviaciones recurrentes del área de empaque en el año; cerrar el 90 % de las CAPA en el plazo comprometido con eficacia verificada; mantener en cero los retiros de mercado por causas de calidad; reducir los errores de dispensación por debajo de un umbral definido. Un objetivo sin plan, responsable y fecha es un deseo.',
        ],
      },
    ],
    caso: {
      titulo: 'El objetivo imposible de medir',
      contexto: 'La política de calidad de un laboratorio dice «buscamos la excelencia» y el único objetivo del año es «mejorar la calidad de nuestros productos».',
      pregunta: '¿Cómo mejorarías el objetivo?',
      opciones: [
        { texto: 'Dejarlo así: es coherente con la política.', correcta: false, retro: 'No es medible ni tiene plan; no sirve para decidir ni para demostrar mejora.' },
        { texto: 'Convertirlo en objetivos medibles con plan: por ejemplo, reducir en 30 % los resultados fuera de especificación de valoración del producto X en el año, con responsable, acciones, recursos y seguimiento trimestral.', correcta: true, retro: 'Un objetivo medible, con plan, responsable y fecha permite gestionar y verificar el logro.' },
        { texto: 'Agregar más objetivos generales.', correcta: false, retro: 'Más objetivos vagos no resuelven el problema de medición.' },
      ],
    },
    errores: [
      { error: 'Políticas genéricas copiadas de internet.', correccion: 'Redacta una política propia, breve, conectada con tus productos, tus pacientes y tus requisitos.' },
      { error: 'Objetivos sin línea base.', correccion: 'Mide el punto de partida antes de fijar la meta.' },
      { error: 'Roles del SGC sin autoridad real.', correccion: 'Asigna autoridad para detener procesos o rechazar lotes a quien tiene la responsabilidad.' },
    ],
    comprueba: [
      { pregunta: '¿Qué compromisos debe incluir la política de calidad según ISO 9001?', respuesta: 'Cumplir los requisitos aplicables y mejorar continuamente el SGC.' },
      { pregunta: '¿Qué debe planificarse para lograr un objetivo de calidad?', respuesta: 'Qué se va a hacer, qué recursos se requerirán, quién será responsable, cuándo se finalizará y cómo se evaluarán los resultados.' },
    ],
    resumen: [
      'El **liderazgo** se demuestra con decisiones, recursos y presencia.',
      'La **política** debe ser breve, propia y conectada con procesos.',
      'Los **objetivos** son medibles, con plan, responsable y fecha.',
    ],
    referencias: [R.iso9001, R.ichQ10, R.isoPrincipios],
    imagenes: [
      { ubicacion: 'En la sección de objetivos', descripcion: 'Cascada ilustrada: política → objetivos → indicadores → acciones, con un ejemplo farmacéutico en cada nivel.', alt: 'De la política de calidad a los objetivos e indicadores' },
    ],
    keywords: ['política de calidad ejemplo farmacéutico', 'objetivos de calidad iso 9001', 'liderazgo y compromiso iso 9001', 'cláusula 5 iso 9001', 'cómo redactar una política de calidad', 'objetivos de calidad medibles'],
  },
  {
    titulo: 'Pensamiento basado en riesgos: riesgos y oportunidades en el SGC',
    duracion: 25,
    gancho: {
      titulo: 'La acción preventiva que desapareció',
      texto: 'Al revisar la versión 2015 de ISO 9001, un coordinador de calidad no encuentra la cláusula de acciones preventivas y se alarma: ¿ya no hay que prevenir? Al contrario. ISO eliminó la cláusula separada porque decidió que todo el sistema debe ser preventivo. El pensamiento basado en riesgos está en la planificación, en los procesos y en las decisiones de cada día.',
    },
    objetivos: [
      'Explicar el pensamiento basado en riesgos de ISO 9001:2015 y su relación con la acción preventiva.',
      'Planificar acciones para abordar riesgos y oportunidades (cláusula 6.1).',
      'Relacionar el enfoque de ISO 9001 con la gestión de riesgos para la calidad de ICH Q9.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Riesgo', definicion: 'Efecto de la incertidumbre. Puede ser negativo (amenaza) o positivo (oportunidad).' },
      { icono: 'Lightbulb', termino: 'Oportunidad', definicion: 'Situación favorable que puede aprovecharse para lograr mejores resultados, como un nuevo mercado, una tecnología o una alianza.' },
      { icono: 'ShieldCheck', termino: 'Acciones para abordar riesgos', definicion: 'Evitar el riesgo, asumirlo para aprovechar una oportunidad, eliminar su fuente, cambiar la probabilidad o las consecuencias, compartirlo o retenerlo con una decisión informada.' },
      { icono: 'Scale', termino: 'Proporcionalidad', definicion: 'Las acciones deben ser proporcionales al impacto potencial en la conformidad de los productos y servicios.' },
    ],
    proceso: {
      titulo: 'Cómo abordar riesgos y oportunidades',
      pasos: [
        { titulo: 'Partir del contexto', detalle: 'Usa las cuestiones internas y externas y las partes interesadas para identificar riesgos y oportunidades.', icono: 'Globe', evidencia: 'Contexto y partes interesadas vigentes.' },
        { titulo: 'Identificar por proceso', detalle: 'Para cada proceso, pregunta qué podría impedir lograr su resultado y qué podría mejorarlo.', icono: 'Search', evidencia: 'Matriz de riesgos por proceso.' },
        { titulo: 'Valorar', detalle: 'Estima probabilidad e impacto con criterios definidos y prioriza.', icono: 'Calculator', evidencia: 'Riesgos priorizados.' },
        { titulo: 'Planificar acciones', detalle: 'Define acciones proporcionales, integradas en los procesos, con responsable y fecha.', icono: 'ClipboardList', evidencia: 'Plan de tratamiento.' },
        { titulo: 'Evaluar la eficacia', detalle: 'Verifica si las acciones redujeron el riesgo o aprovecharon la oportunidad.', icono: 'CheckCircle2', evidencia: 'Seguimiento y revisión por la dirección.' },
      ],
    },
    secciones: [
      {
        titulo: 'De la acción preventiva al pensamiento basado en riesgos',
        parrafos: [
          'En las versiones anteriores de ISO 9001, la acción preventiva era una cláusula separada que muchas organizaciones usaban poco. En 2015, la norma integró la prevención en todo el sistema mediante el **pensamiento basado en riesgos**: considerar los riesgos y las oportunidades al planificar el sistema, al definir los procesos y al tomar decisiones. La cláusula 6.1 pide determinar los riesgos y oportunidades que es necesario abordar para asegurar que el sistema logre sus resultados, aumentar los efectos deseables, prevenir o reducir los no deseados y lograr la mejora.',
          'ISO 9001 no exige un método formal de gestión de riesgos ni un proceso documentado de gestión de riesgos. La organización elige el método. Muchas usan la norma ISO 31000 como guía; en el sector farmacéutico, la referencia obligada para los riesgos sobre el producto es **ICH Q9(R1)**.',
        ],
      },
      {
        titulo: 'Riesgos y oportunidades en una organización farmacéutica',
        parrafos: [
          'Algunos **riesgos** típicos: dependencia de un único proveedor de un principio activo, rotación de personal clave en calidad, obsolescencia de un equipo crítico, cambios regulatorios, ataques informáticos a sistemas con datos de calidad, desabastecimiento de un medicamento esencial. Algunas **oportunidades**: digitalizar los registros de lote, automatizar la revisión de tendencias, calificar un segundo proveedor, ampliar el portafolio con un producto que la capacidad instalada permite fabricar.',
          'Las acciones deben ser **proporcionales** al impacto potencial en la conformidad de los productos y servicios, y deben **integrarse en los procesos**: un riesgo de proveedor único se trata en el proceso de compras y calificación; un riesgo de datos, en el proceso de sistemas computarizados.',
        ],
      },
      {
        titulo: 'Dos enfoques que se complementan',
        parrafos: [
          'El pensamiento basado en riesgos de ISO 9001 tiene una mirada **organizacional**: riesgos para el sistema y el negocio. La gestión de riesgos de **ICH Q9** tiene una mirada **sobre el producto y el paciente**: riesgos para la calidad a lo largo del ciclo de vida. Un SGC farmacéutico maduro usa ambos: una matriz de riesgos de procesos para la planificación estratégica y evaluaciones de riesgo para la calidad en las decisiones técnicas (cambios, desviaciones, validaciones, proveedores).',
          'Lo importante es que los dos niveles conversen. Un riesgo organizacional (por ejemplo, la rotación del personal del laboratorio) puede convertirse en un riesgo para el producto (errores analíticos), y la revisión por la dirección debe ver ambos.',
        ],
      },
    ],
    caso: {
      titulo: 'Un solo proveedor',
      contexto: 'Un laboratorio compra el principio activo de su producto más vendido a un único fabricante en el exterior. El fabricante anuncia una parada de planta de seis meses.',
      pregunta: '¿Qué muestra el caso sobre el pensamiento basado en riesgos?',
      opciones: [
        { texto: 'Que es un evento imprevisible que ningún sistema podía anticipar.', correcta: false, retro: 'La dependencia de un proveedor único es un riesgo identificable que debió estar en la matriz de riesgos.' },
        { texto: 'Que el riesgo de proveedor único debió identificarse y tratarse con anticipación (por ejemplo, calificando un segundo proveedor o manteniendo un inventario de seguridad), integrando la acción en el proceso de compras.', correcta: true, retro: 'El pensamiento basado en riesgos anticipa y trata los riesgos en los procesos, de forma proporcional a su impacto.' },
        { texto: 'Que basta con documentar el riesgo cuando ocurra.', correcta: false, retro: 'Documentar después no previene; la norma pide planificar acciones antes.' },
      ],
    },
    errores: [
      { error: 'Una matriz de riesgos enorme que nadie usa.', correccion: 'Prioriza los riesgos relevantes por proceso y conéctalos con acciones y responsables.' },
      { error: 'Olvidar las oportunidades.', correccion: 'Incluye oportunidades con su plan para aprovecharlas.' },
      { error: 'Usar ISO 9001 como sustituto de ICH Q9 para riesgos del producto.', correccion: 'Para riesgos sobre la calidad del producto, aplica la metodología de ICH Q9(R1).' },
    ],
    comprueba: [
      { pregunta: '¿Por qué ISO 9001:2015 eliminó la cláusula de acción preventiva?', respuesta: 'Porque integró la prevención en todo el sistema mediante el pensamiento basado en riesgos.' },
      { pregunta: '¿Exige ISO 9001 un método formal de gestión de riesgos?', respuesta: 'No; la organización elige el método, de forma proporcional.' },
    ],
    resumen: [
      'El **pensamiento basado en riesgos** reemplaza la acción preventiva aislada.',
      'Aborda **riesgos y oportunidades** en los procesos, de forma **proporcional**.',
      'Combina la mirada **organizacional** (ISO 9001) con la del **producto** (ICH Q9).',
    ],
    referencias: [R.iso9001, R.ichQ9, R.ichQ10],
    imagenes: [
      { ubicacion: 'En la sección de los dos enfoques', descripcion: 'Dos niveles conectados: riesgos del sistema y del negocio arriba, riesgos del producto y del paciente abajo.', alt: 'Pensamiento basado en riesgos de ISO 9001 y gestión de riesgos de ICH Q9' },
    ],
    keywords: ['pensamiento basado en riesgos iso 9001', 'riesgos y oportunidades iso 9001 6.1', 'acción preventiva iso 9001 2015', 'matriz de riesgos sistema de gestión de calidad', 'ejemplos de riesgos y oportunidades', 'iso 9001 vs ich q9'],
  },
  {
    titulo: 'ICH Q10 vs. ISO 9001 vs. BPM: comparación e integración',
    duracion: 25,
    gancho: {
      titulo: 'Una sola evidencia, tres auditores',
      texto: 'El mismo día llegan tres preguntas a la directora de calidad: un auditor de cliente pregunta por la revisión por la dirección según ICH Q10, el auditor de certificación pide la evidencia de la cláusula 9.3 de ISO 9001 y el inspector del INVIMA revisa la revisión de calidad del producto exigida por las BPM. Ella abre una sola carpeta: el acta de la revisión por la dirección, que integra los tres requisitos. Esta clase cierra la unidad mostrando cómo construir ese sistema integrado.',
    },
    objetivos: [
      'Comparar el propósito, el alcance y el carácter (obligatorio o voluntario) de ICH Q10, ISO 9001 y las BPM.',
      'Identificar los requisitos equivalentes entre los tres marcos.',
      'Diseñar una matriz de integración para un sistema único.',
    ],
    conceptos: [
      { icono: 'Gavel', termino: 'Obligatorio y voluntario', definicion: 'Las BPM adoptadas por norma son obligatorias; ICH Q10 es una guía que las autoridades esperan ver aplicada; ISO 9001 es voluntaria y certificable.' },
      { icono: 'Network', termino: 'Matriz de integración', definicion: 'Tabla que relaciona cada requisito de cada marco con el proceso, el documento y la evidencia que lo cumplen.' },
      { icono: 'Files', termino: 'Documentación única', definicion: 'Un solo cuerpo de manual, procedimientos y registros que responde a todos los marcos aplicables.' },
    ],
    mapa: {
      centro: 'Integración',
      ramas: [
        { titulo: 'BPM', icono: 'Factory', nodos: ['Obligatorias', 'Requisitos técnicos de fabricación y control', 'Inspección del INVIMA'] },
        { titulo: 'ICH Q10', icono: 'Globe', nodos: ['Guía armonizada', 'Ciclo de vida y gestión', 'Esperada por autoridades y clientes'] },
        { titulo: 'ISO 9001', icono: 'Award', nodos: ['Voluntaria', 'Gestión y partes interesadas', 'Certificación por terceros'] },
        { titulo: 'Puntos comunes', icono: 'Puzzle', nodos: ['Revisión por la dirección', 'CAPA y mejora', 'Gestión del cambio', 'Auditoría interna o autoinspección'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué aporta cada marco',
        parrafos: [
          'Las **BPM** aportan los requisitos técnicos obligatorios: personal, instalaciones, equipos, materiales, documentación, producción, control de calidad, quejas, retiros y autoinspección. **ICH Q10** aporta el modelo de gestión del ciclo de vida, los habilitadores (conocimiento y riesgo) y los cuatro elementos (monitoreo, CAPA, cambios y revisión por la dirección). **ISO 9001** aporta la estructura de gestión general: contexto, partes interesadas, liderazgo, objetivos, competencia, comunicación, auditoría interna y satisfacción del cliente.',
          'Los tres se solapan en lo esencial. Todos piden responsabilidad de la dirección, procesos documentados, control de la información, gestión de no conformidades y acciones correctivas, control de cambios, auditorías o autoinspecciones y revisión por la dirección. Las diferencias están en el énfasis: el producto y el paciente en las BPM e ICH Q10, la organización y el cliente en ISO 9001.',
        ],
      },
      {
        titulo: 'Equivalencias útiles',
        parrafos: [
          'Algunas equivalencias para construir la matriz: la **revisión por la dirección** de ICH Q10 corresponde a la cláusula 9.3 de ISO 9001 y se nutre de la **revisión de calidad del producto** de las BPM. El **sistema CAPA** de ICH Q10 corresponde a la cláusula 10.2 de ISO 9001 (no conformidad y acción correctiva) y a la gestión de desviaciones de las BPM. La **gestión del cambio** de ICH Q10 corresponde a las cláusulas 6.3 y 8.5.6 de ISO 9001 y al control de cambios de las BPM. La **autoinspección** de las BPM corresponde a la **auditoría interna** de la cláusula 9.2.',
          'La **competencia** (cláusula 7.2 de ISO 9001) se cumple con el programa de capacitación de las BPM, y la **información documentada** (7.5) con el sistema de documentación de las BPM, que suele ser más exigente en integridad de datos.',
        ],
      },
      {
        titulo: 'Cómo integrar sin duplicar',
        parrafos: [
          'Un camino práctico: primero, un **mapa de procesos único** de la organización. Segundo, una **matriz de integración** con cada requisito de los tres marcos y el proceso, procedimiento y registro que lo cumple. Tercero, **un solo procedimiento por tema** (por ejemplo, un procedimiento de CAPA) que cumpla el requisito más exigente de los tres. Cuarto, **una sola agenda de auditoría interna y autoinspección** que cubra todos los requisitos. Quinto, **una revisión por la dirección** con entradas de los tres marcos.',
          'Cuando un requisito es más estricto en un marco, ese marco manda. Por ejemplo, la integridad de datos y la retención de registros de las BPM son más estrictas que ISO 9001; la satisfacción del cliente y el análisis de contexto de ISO 9001 son más explícitos que las BPM. El sistema integrado toma lo mejor de cada uno.',
        ],
      },
    ],
    caso: {
      titulo: 'Tres procedimientos de CAPA',
      contexto: 'Un laboratorio tiene un procedimiento de desviaciones para BPM, uno de no conformidades para ISO 9001 y uno de CAPA para el cliente que exige ICH Q10. A veces un mismo evento se registra en dos sistemas con conclusiones distintas.',
      pregunta: '¿Cuál es la mejor solución?',
      opciones: [
        { texto: 'Mantener los tres, con un responsable distinto cada uno.', correcta: false, retro: 'Tres sistemas para lo mismo generan duplicidad, contradicciones y pérdida de tendencias.' },
        { texto: 'Unificarlos en un solo proceso de desviaciones, no conformidades y CAPA que cumpla el requisito más exigente, con una matriz que muestre cómo cubre los tres marcos.', correcta: true, retro: 'Un solo proceso permite ver todas las tendencias y demostrar el cumplimiento ante cualquier auditor.' },
        { texto: 'Eliminar el de ISO 9001 porque las BPM son obligatorias.', correcta: false, retro: 'La solución no es eliminar requisitos, sino integrarlos en un solo proceso.' },
      ],
    },
    errores: [
      { error: 'Integrar copiando y pegando textos de las tres normas en un manual.', correccion: 'Integra procesos, no textos: un proceso cumple los requisitos y la matriz lo demuestra.' },
      { error: 'Perder el requisito más estricto al unificar.', correccion: 'Cuando unifiques un procedimiento, conserva el nivel de exigencia del marco más estricto.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál de los tres marcos es obligatorio en Colombia para fabricar medicamentos?', respuesta: 'Las BPM adoptadas por la Resolución 1160 de 2016.' },
      { pregunta: '¿A qué cláusula de ISO 9001 equivale la autoinspección de las BPM?', respuesta: 'A la auditoría interna, cláusula 9.2.' },
    ],
    resumen: [
      '**BPM** obligatorias, **ICH Q10** esperada, **ISO 9001** voluntaria y certificable.',
      'Comparten lo esencial: **dirección, CAPA, cambios, auditoría y revisión**.',
      'Integra con un **mapa de procesos único** y una **matriz** de requisitos.',
    ],
    referencias: [R.ichQ10, R.iso9001, R.res1160Compilada, R.eudralexCap1],
    imagenes: [
      { ubicacion: 'En la sección de equivalencias', descripcion: 'Tabla comparativa con tres columnas (BPM, ICH Q10, ISO 9001) y filas por tema común.', alt: 'Comparación de ICH Q10, ISO 9001 y BPM' },
    ],
    keywords: ['ich q10 vs iso 9001 vs gmp', 'integración iso 9001 y bpm', 'comparación ich q10 iso 9001', 'matriz de integración de normas', 'sistema integrado farmacéutico', 'diferencias entre bpm e iso 9001'],
  },
];

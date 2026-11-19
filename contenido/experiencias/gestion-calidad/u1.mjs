/**
 * Unidad 1. Fundamentos de la gestión de calidad farmacéutica (6 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción al curso: la calidad como sistema en la industria y los servicios farmacéuticos',
    duracion: 20,
    gancho: {
      titulo: 'El lote que salió bien por casualidad',
      texto: 'Un laboratorio colombiano libera un lote de tabletas que cumple todas las especificaciones. Semanas después, en una autoinspección, alguien descubre que la balanza de dispensación llevaba tres meses sin verificación, que el operario que pesó no había recibido la capacitación del procedimiento nuevo y que nadie revisó el cambio de proveedor del excipiente. El lote cumplió, pero nadie puede demostrar por qué. Esa es la diferencia entre tener buenos resultados y tener un **sistema de gestión de calidad**: el sistema hace que el buen resultado sea la consecuencia esperada, no un golpe de suerte.',
    },
    objetivos: [
      'Explicar qué es un sistema de gestión de calidad (SGC) y por qué una organización farmacéutica lo necesita además de cumplir especificaciones.',
      'Ubicar los tres marcos que integra el curso: ICH Q10, ISO 9001:2015 y la normativa colombiana del INVIMA y el Ministerio de Salud.',
      'Reconocer la ruta del curso y cómo se conecta con los cursos de BPM, CAPA, auditoría, riesgos y documentación.',
    ],
    conceptos: [
      { icono: 'Network', termino: 'Sistema de gestión de calidad', definicion: 'Conjunto de procesos, responsabilidades, recursos y documentos que una organización usa para dirigir y controlar lo que hace en relación con la calidad. No es un manual ni un departamento: es la forma en que trabaja toda la organización.' },
      { icono: 'ShieldCheck', termino: 'Calidad del producto', definicion: 'Que el medicamento o el servicio cumpla de forma consistente los requisitos de identidad, pureza, potencia, seguridad y desempeño con los que fue autorizado, lote tras lote.' },
      { icono: 'Landmark', termino: 'Requisito regulatorio', definicion: 'Lo que exige la autoridad sanitaria para fabricar, importar, distribuir o dispensar medicamentos. En Colombia lo fijan el Ministerio de Salud y Protección Social y lo vigila el INVIMA o la secretaría de salud.' },
      { icono: 'RefreshCw', termino: 'Mejora continua', definicion: 'La actividad recurrente de aumentar el desempeño. En un SGC se alimenta de datos: desviaciones, quejas, auditorías, indicadores y revisión por la dirección.' },
    ],
    mapa: {
      centro: 'SGC farmacéutico',
      ramas: [
        { titulo: 'ICH Q10', icono: 'Globe', nodos: ['Modelo de sistema de calidad farmacéutico', 'Ciclo de vida del producto', 'Responsabilidad de la dirección'] },
        { titulo: 'ISO 9001:2015', icono: 'Award', nodos: ['Enfoque por procesos', 'Pensamiento basado en riesgos', 'Ciclo PHVA'] },
        { titulo: 'Colombia', icono: 'Landmark', nodos: ['Decreto 677 de 1995', 'BPM por Resolución 1160 de 2016', 'Servicio farmacéutico: Decreto 780 de 2016 y Resolución 1403 de 2007'] },
        { titulo: 'Herramientas', icono: 'Wrench', nodos: ['Procesos e indicadores', 'Gestión del cambio', 'Revisión por la dirección'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cumplir no es lo mismo que gestionar',
        parrafos: [
          'Un medicamento no se puede «probar hasta la calidad». El análisis de control de calidad examina una muestra, no cada tableta; si el proceso no está controlado, un lote puede cumplir por azar y el siguiente fallar sin aviso. Por eso las Buenas Prácticas de Manufactura (BPM) y las guías internacionales insisten en que la calidad se **construye** en cada etapa: en la selección de proveedores, en el diseño del proceso, en la capacitación del personal, en el control de los cambios y en la revisión de lo que ocurre.',
          'Un **sistema de gestión de calidad** es el marco que organiza todo eso. Define qué procesos tiene la organización, quién es responsable de cada uno, cómo se mide su desempeño, qué se hace cuando algo falla y cómo la dirección revisa periódicamente si el sistema funciona. Cuando el SGC está bien diseñado, una desviación como la de la balanza del ejemplo se detecta a tiempo, se investiga y se corrige su causa, en lugar de descubrirse por accidente.',
        ],
      },
      {
        titulo: 'Tres marcos que se integran',
        parrafos: [
          '**ICH Q10**, la guía armonizada del Consejo Internacional de Armonización, describe un modelo de **sistema de calidad farmacéutico** para todo el ciclo de vida del producto: desarrollo, transferencia de tecnología, fabricación comercial y discontinuación. Se apoya en las BPM y agrega elementos de gestión como la revisión por la dirección, la gestión del conocimiento y la gestión de riesgos.',
          '**ISO 9001:2015** es la norma internacional de requisitos para un SGC aplicable a cualquier organización. Aporta la estructura de gestión: contexto de la organización, liderazgo, planificación con base en riesgos, apoyo, operación, evaluación del desempeño y mejora. Muchas droguerías, distribuidores, laboratorios de análisis y prestadores de servicio farmacéutico la usan para certificarse.',
          'La **normativa colombiana** es la obligatoria. El Decreto 677 de 1995 regula los registros sanitarios y el control de calidad de los medicamentos; la Resolución 1160 de 2016 adopta los manuales de BPM y las guías de inspección que aplica el INVIMA; y para el servicio farmacéutico, el Decreto 780 de 2016 (que compila el Decreto 2200 de 2005) y la Resolución 1403 de 2007 exigen un sistema de gestión de calidad propio. En este curso aprenderás a integrar los tres marcos en un solo sistema, sin duplicar documentos.',
        ],
      },
      {
        titulo: 'La ruta del curso',
        parrafos: [
          'El curso tiene cinco unidades. La **unidad 1** construye los fundamentos: historia de la calidad, aportes de los grandes autores, por qué el medicamento exige un sistema propio, los siete principios de ISO 9000 y el vocabulario básico. La **unidad 2** recorre el marco normativo colombiano. La **unidad 3** compara los modelos ICH Q10 e ISO 9001:2015. La **unidad 4** baja el sistema a procesos, indicadores y revisión por la dirección. La **unidad 5** cierra con mejora continua, gestión del cambio y cultura de calidad, y una hoja de ruta para implementar o fortalecer un SGC.',
          'Este curso es la columna vertebral de la línea de calidad farmacéutica de Edvanta. Los temas que aquí se presentan como parte del sistema se profundizan en cursos hermanos: **BPM**, **gestión de desviaciones y CAPA**, **auditoría de calidad**, **gestión de riesgos** y **buenas prácticas de documentación**. Cuando un tema aparezca aquí de forma general, sabrás dónde estudiarlo a fondo.',
        ],
      },
    ],
    caso: {
      titulo: 'Un laboratorio que «siempre ha cumplido»',
      contexto: 'La gerente de un laboratorio de productos no estériles dice que no necesita fortalecer su sistema de calidad porque en diez años ningún lote ha salido fuera de especificaciones y el INVIMA le renovó el certificado de BPM. En la última revisión, sin embargo, hay 40 desviaciones abiertas, la mitad sin causa raíz y varias repetidas.',
      pregunta: '¿Cuál es la lectura más acertada de la situación?',
      opciones: [
        { texto: 'El sistema funciona: si los lotes cumplen, las desviaciones son un tema administrativo.', correcta: false, retro: 'Cumplir especificaciones no demuestra control. Desviaciones repetidas sin causa raíz indican que el sistema no aprende y que el riesgo de una falla mayor sigue presente.' },
        { texto: 'El sistema tiene una falla de gestión: no investiga ni corrige causas, y eso es justo lo que un SGC debe asegurar.', correcta: true, retro: 'Un SGC se mide por su capacidad de detectar, investigar, corregir y prevenir. Las desviaciones repetidas son un indicador de que esos procesos no están funcionando.' },
        { texto: 'Basta con cerrar las desviaciones abiertas antes de la próxima visita.', correcta: false, retro: 'Cerrar sin investigar oculta el problema. La autoridad y los auditores revisan la calidad de las investigaciones, no solo su estado.' },
      ],
    },
    errores: [
      { error: 'Creer que el SGC es el manual de calidad o la oficina de aseguramiento.', correccion: 'El SGC es la forma de trabajar de toda la organización; el manual solo lo describe y aseguramiento lo coordina.' },
      { error: 'Montar un sistema para ISO 9001 y otro para BPM.', correccion: 'Integra los requisitos en un solo sistema de procesos y documentos; las BPM son obligatorias y la norma ISO agrega estructura de gestión.' },
      { error: 'Medir el sistema solo por los resultados de los lotes.', correccion: 'Mide también los procesos: desviaciones, CAPA eficaces, quejas, auditorías, capacitación y cambios controlados.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué no basta con analizar el producto terminado?', respuesta: 'Porque el análisis examina una muestra y no puede demostrar que todo el lote se fabricó bajo control. La calidad se construye en cada etapa del proceso.' },
      { pregunta: '¿Qué aporta ICH Q10 que no aportan solas las BPM?', respuesta: 'Un modelo de gestión para todo el ciclo de vida, con responsabilidad de la dirección, gestión del conocimiento, gestión de riesgos y mejora continua.' },
      { pregunta: '¿Qué normas colombianas exigen un SGC al servicio farmacéutico?', respuesta: 'El Decreto 780 de 2016, que compila el Decreto 2200 de 2005, y la Resolución 1403 de 2007.' },
    ],
    resumen: [
      'Un SGC hace que el buen resultado sea **consecuencia del sistema**, no de la suerte.',
      'El curso integra **ICH Q10**, **ISO 9001:2015** y la **normativa colombiana** en un solo sistema.',
      'La calidad se **construye** en el proceso; el análisis final no la crea.',
    ],
    referencias: [R.ichQ10, R.iso9001, R.res1160Compilada, R.res1403],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Ilustración de un laboratorio farmacéutico con tres capas superpuestas que representan ICH Q10, ISO 9001 y la normativa colombiana, en la paleta de Edvanta.', alt: 'Tres marcos de calidad que se integran en un sistema de gestión farmacéutico' },
    ],
    keywords: ['sistema de gestión de calidad farmacéutica', 'qué es un sgc', 'ich q10 e iso 9001', 'gestión de calidad en la industria farmacéutica', 'calidad del servicio farmacéutico colombia', 'curso gestión de calidad farmacéutica'],
  },
  {
    titulo: 'Evolución histórica de la calidad: de la inspección a la gestión total',
    duracion: 20,
    gancho: {
      titulo: 'Separar lo bueno de lo malo ya no alcanzaba',
      texto: 'A comienzos del siglo XX, en las fábricas la calidad era tarea de inspectores que separaban al final de la línea las piezas buenas de las defectuosas. Funcionaba mientras la producción era pequeña. Cuando las fábricas crecieron, inspeccionar todo se volvió caro e insuficiente: los defectos ya estaban hechos y había que desecharlos. Cada etapa de la historia de la calidad nació de un problema así, y entenderlas te ayuda a reconocer en qué etapa está hoy tu propia organización.',
    },
    objetivos: [
      'Describir las etapas de la evolución de la calidad: inspección, control estadístico, aseguramiento, calidad total y gestión de la calidad.',
      'Relacionar cada etapa con el problema que intentaba resolver y con sus límites.',
      'Identificar cómo esa evolución llegó a las BPM y a los sistemas de calidad farmacéuticos.',
    ],
    conceptos: [
      { icono: 'Eye', termino: 'Inspección', definicion: 'Verificar el producto terminado y separar lo conforme de lo no conforme. Detecta defectos, pero no los previene.' },
      { icono: 'LineChart', termino: 'Control estadístico de procesos', definicion: 'Uso de muestreo y gráficos de control para distinguir la variación normal de un proceso de las causas especiales que hay que corregir.' },
      { icono: 'ShieldCheck', termino: 'Aseguramiento de la calidad', definicion: 'Conjunto de actividades planificadas y documentadas para dar confianza de que se cumplirán los requisitos antes de que el producto exista.' },
      { icono: 'Users', termino: 'Calidad total', definicion: 'Enfoque en el que la calidad es responsabilidad de toda la organización, no solo de un departamento, y se orienta a la satisfacción del cliente y la mejora continua.' },
    ],
    mapa: {
      centro: 'De detectar a prevenir',
      ramas: [
        { titulo: 'Inspección', icono: 'Eye', nodos: ['Separar al final de la línea', 'Detecta, no previene', 'Costosa a gran escala'] },
        { titulo: 'Control estadístico', icono: 'LineChart', nodos: ['Shewhart y los gráficos de control', 'Muestreo', 'Variación común y especial'] },
        { titulo: 'Aseguramiento', icono: 'ShieldCheck', nodos: ['Planificar y documentar', 'Normas de proveedores', 'Confianza antes de producir'] },
        { titulo: 'Calidad total y gestión', icono: 'Users', nodos: ['Toda la organización', 'Mejora continua', 'Normas ISO 9000 desde 1987'] },
      ],
    },
    secciones: [
      {
        titulo: 'De la inspección al control estadístico',
        parrafos: [
          'En la etapa de **inspección**, la calidad era un filtro al final del proceso. El problema es que un defecto detectado ya costó materiales, tiempo y trabajo, y la inspección al cien por ciento se cansa y se equivoca. En los años veinte, Walter Shewhart, en los laboratorios Bell, propuso mirar el **proceso** en lugar del producto: con muestras periódicas y **gráficos de control** se podía distinguir la variación propia del proceso de las causas especiales que lo sacan de control. Por primera vez la calidad se gestionaba antes de que el defecto llegara al final de la línea.',
          'El **control estadístico** se expandió durante la Segunda Guerra Mundial con los planes de muestreo para compras militares. Su aporte sigue vigente en la industria farmacéutica: los controles en proceso, las tendencias de resultados analíticos, la revisión anual de producto y la verificación continuada del proceso son herederos directos de esa idea.',
        ],
      },
      {
        titulo: 'Del aseguramiento a la gestión total',
        parrafos: [
          'Después de la guerra apareció el **aseguramiento de la calidad**: si se planifica, se documenta y se controla cada actividad que influye en la calidad, se puede dar confianza de que el producto cumplirá antes de fabricarlo. Las normas de proveedores de los sectores militar y nuclear exigían manuales, procedimientos y registros. Esa lógica es la base de las BPM: procedimientos escritos, personal capacitado, registros de cada operación y una función de calidad independiente de producción.',
          'En Japón, con el aporte de Deming, Juran e Ishikawa, y en Estados Unidos con Feigenbaum, la calidad pasó a ser **responsabilidad de toda la organización**: la **calidad total**. Ya no bastaba con que un departamento controlara; la dirección, las compras, el diseño y cada operario participaban en la mejora continua. En 1987 se publicó la primera serie de normas **ISO 9000**, que llevó esos principios a un modelo de sistema certificable; su versión vigente es la de 2015.',
        ],
      },
      {
        titulo: 'Cómo llegó al medicamento',
        parrafos: [
          'La industria farmacéutica recorrió el mismo camino empujada por tragedias. En 1937, en Estados Unidos, el elixir de sulfanilamida preparado con dietilenglicol causó más de cien muertes y llevó a exigir pruebas de seguridad antes de comercializar. A comienzos de los sesenta, la talidomida mostró que los efectos de un medicamento debían estudiarse a fondo. De esas crisis nacieron las exigencias de eficacia y seguridad, y las **Buenas Prácticas de Manufactura**: la Organización Mundial de la Salud publicó sus primeras BPM a finales de los años sesenta.',
          'Hoy el sector está en la etapa de **gestión**: ICH Q10 (2008) describe un sistema de calidad farmacéutico para todo el ciclo de vida, apoyado en la gestión de riesgos (ICH Q9) y del conocimiento. La lección histórica es clara: cada etapa no reemplaza a la anterior, la contiene. Un laboratorio moderno sigue inspeccionando y usando estadística, pero dentro de un sistema que previene y aprende.',
        ],
      },
    ],
    caso: {
      titulo: 'Más inspectores para menos quejas',
      contexto: 'Una planta de empaque recibe quejas por estuches con el lote mal impreso. La primera propuesta del jefe de producción es agregar dos inspectores al final de la línea para revisar cada estuche.',
      pregunta: '¿En qué etapa histórica de la calidad se ubica esa propuesta y cuál sería un enfoque más maduro?',
      opciones: [
        { texto: 'Es aseguramiento; la propuesta es suficiente.', correcta: false, retro: 'Agregar inspectores al final es la etapa de inspección: detecta, pero no evita que el defecto se produzca.' },
        { texto: 'Es inspección; lo maduro es controlar el proceso de impresión (verificación al inicio, controles periódicos, sistema de visión y análisis de la causa) para prevenir el defecto.', correcta: true, retro: 'El enfoque moderno ataca la causa y controla el proceso. La inspección puede quedar como verificación, no como la única defensa.' },
        { texto: 'Es calidad total, porque involucra a más personas.', correcta: false, retro: 'La calidad total no consiste en sumar inspectores, sino en que toda la organización prevenga y mejore.' },
      ],
    },
    errores: [
      { error: 'Pensar que las etapas modernas eliminan la inspección.', correccion: 'La inspección sigue existiendo como verificación, pero ya no es la única defensa: el control del proceso previene.' },
      { error: 'Usar el control estadístico solo para reportar, sin reaccionar a las señales.', correccion: 'Un gráfico de control sirve si se define qué hacer ante una tendencia o un punto fuera de control.' },
      { error: 'Creer que la calidad total es un programa de motivación.', correccion: 'Es un modelo de gestión: liderazgo, procesos, datos y mejora continua en toda la organización.' },
    ],
    comprueba: [
      { pregunta: '¿Qué aportó Shewhart a la calidad?', respuesta: 'Mirar el proceso con muestreo y gráficos de control para distinguir la variación común de las causas especiales.' },
      { pregunta: '¿Qué tienen en común el aseguramiento de la calidad y las BPM?', respuesta: 'Ambos planifican, documentan y controlan las actividades que influyen en la calidad para dar confianza antes de producir.' },
      { pregunta: '¿Qué tragedia de 1937 marcó la regulación de medicamentos?', respuesta: 'El elixir de sulfanilamida con dietilenglicol, que causó más de cien muertes en Estados Unidos.' },
    ],
    resumen: [
      'La calidad pasó de **detectar** defectos a **prevenirlos** y a **gestionarlos** en toda la organización.',
      'Cada etapa **contiene** a la anterior: inspección, estadística, aseguramiento, calidad total y gestión.',
      'En farmacia, las **tragedias** impulsaron las BPM y hoy ICH Q10 integra la gestión del ciclo de vida.',
    ],
    referencias: [R.fdaSulfanilamida, R.iso9000, R.ichQ10, R.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de inspección y control estadístico', descripcion: 'Línea del tiempo ilustrada con cinco etapas de la calidad, de la inspección a la gestión, con hitos farmacéuticos (1937, años sesenta, 1987, 2008).', alt: 'Línea del tiempo de la evolución de la calidad hasta los sistemas farmacéuticos' },
    ],
    keywords: ['historia de la calidad', 'evolución de la calidad etapas', 'de la inspección a la calidad total', 'control estadístico de procesos shewhart', 'historia de las bpm', 'aseguramiento de la calidad origen'],
  },
  {
    titulo: 'Aportes de Deming, Juran y Crosby a la gestión de calidad farmacéutica',
    duracion: 20,
    gancho: {
      titulo: 'Tres ideas que todavía se discuten en una revisión por la dirección',
      texto: 'En una reunión de calidad, alguien propone premiar al área con menos desviaciones reportadas. Otra persona advierte que eso solo hará que se reporten menos. Una tercera pregunta cuánto cuestan los reprocesos del último año. Sin saberlo, están discutiendo a Deming, que alertó contra las metas que ocultan problemas; a Juran, que habló de planificar, controlar y mejorar; y a Crosby, que mostró que la falta de calidad tiene un precio. Sus ideas tienen setenta años y siguen resolviendo problemas de hoy.',
    },
    objetivos: [
      'Explicar los aportes centrales de Deming, Juran y Crosby.',
      'Aplicar esas ideas a situaciones de una planta o un servicio farmacéutico.',
      'Reconocer en ICH Q10 e ISO 9001 los conceptos que vienen de estos autores.',
    ],
    conceptos: [
      { icono: 'RefreshCw', termino: 'Ciclo de Deming', definicion: 'Planificar, hacer, estudiar o verificar y actuar: el ciclo de mejora que Deming difundió a partir de las ideas de Shewhart y que ISO 9001 adopta como PHVA.' },
      { icono: 'Layers', termino: 'Trilogía de Juran', definicion: 'Tres procesos de gestión: planificación de la calidad, control de la calidad y mejora de la calidad.' },
      { icono: 'Target', termino: 'Cero defectos', definicion: 'Idea de Crosby según la cual el estándar de desempeño es hacerlo bien desde la primera vez, no un nivel «aceptable» de errores.' },
      { icono: 'Calculator', termino: 'Costo de la no calidad', definicion: 'Lo que cuesta hacer las cosas mal: reprocesos, rechazos, investigaciones, quejas, retiros del mercado y pérdida de confianza.' },
    ],
    mapa: {
      centro: 'Los grandes autores',
      ramas: [
        { titulo: 'Deming', icono: 'RefreshCw', nodos: ['Ciclo PHVA', '14 puntos para la dirección', 'Variación y sistema'] },
        { titulo: 'Juran', icono: 'Layers', nodos: ['Trilogía: planificar, controlar, mejorar', 'Adecuación al uso', 'Proyecto de mejora'] },
        { titulo: 'Crosby', icono: 'Target', nodos: ['Cero defectos', 'Precio del incumplimiento', 'Calidad es cumplir requisitos'] },
        { titulo: 'En farmacia', icono: 'Pill', nodos: ['Mejora continua de ICH Q10', 'Revisión por la dirección', 'Costo de desviaciones y retiros'] },
      ],
    },
    secciones: [
      {
        titulo: 'W. Edwards Deming: el sistema y la dirección',
        parrafos: [
          'Deming enseñó control estadístico en Japón desde 1950 y es recordado por dos ideas. La primera: la mayoría de los problemas de calidad vienen del **sistema** y no de las personas; culpar al operario sin cambiar el proceso no resuelve nada. La segunda: la mejora es un **ciclo** de planificar, hacer, estudiar y actuar. En su libro *Out of the Crisis* (1986) resumió su filosofía en **14 puntos** para la dirección, entre ellos crear constancia en el propósito de mejora, eliminar el miedo, romper las barreras entre departamentos y abandonar las metas numéricas que no vienen acompañadas de un método para lograrlas.',
          'En una planta farmacéutica, la idea de Deming aparece cuando una investigación de desviación concluye «error humano» sin preguntar por qué el sistema permitió el error. ICH Q10 recoge su espíritu al pedir que la dirección promueva la mejora continua y que las investigaciones busquen la causa raíz.',
        ],
      },
      {
        titulo: 'Joseph Juran: planificar, controlar y mejorar',
        parrafos: [
          'Juran definió la calidad como **adecuación al uso** y propuso la **trilogía**: planificar la calidad (identificar a los clientes y sus necesidades, y diseñar procesos capaces de cumplirlas), controlarla (medir, comparar con la meta y actuar sobre las diferencias) y mejorarla (proyecto por proyecto, atacando los problemas crónicos). También difundió el principio de Pareto en calidad: unas pocas causas explican la mayor parte de los problemas.',
          'La trilogía se reconoce en el ciclo de vida de ICH Q10: el desarrollo planifica la calidad, la fabricación la controla con la estrategia de control y la revisión del desempeño la mejora. Cuando un laboratorio prioriza sus CAPA por el impacto en el paciente y en el volumen de desviaciones, está aplicando a Juran.',
        ],
      },
      {
        titulo: 'Philip Crosby: cero defectos y el precio del incumplimiento',
        parrafos: [
          'Crosby, en *Quality is Free* (1979), sostuvo que la calidad es **cumplir los requisitos**, que el sistema debe basarse en la **prevención**, que el estándar es **cero defectos** y que la calidad se mide por el **precio del incumplimiento**. Su mensaje para la dirección fue práctico: la calidad no cuesta, lo que cuesta es no tenerla.',
          'En farmacia, el costo de la no calidad incluye lotes rechazados, reprocesos, investigaciones largas, análisis repetidos, quejas, retiros del mercado y sanciones. Cuantificarlo en la revisión por la dirección convierte la calidad en una decisión de negocio y ayuda a justificar inversiones preventivas, como la calificación de un equipo o la capacitación de un turno.',
        ],
      },
    ],
    caso: {
      titulo: 'El bono por menos desviaciones',
      contexto: 'La gerencia de una planta propone un bono trimestral para los turnos que reporten menos desviaciones. Aseguramiento de calidad debe dar su concepto.',
      pregunta: '¿Qué concepto da aseguramiento, con base en los autores de la clase?',
      opciones: [
        { texto: 'Favorable: menos desviaciones significa más calidad.', correcta: false, retro: 'Deming advirtió que las metas numéricas sin método generan miedo y ocultamiento. El bono premia no reportar.' },
        { texto: 'Desfavorable: incentiva ocultar desviaciones. Mejor medir la calidad de las investigaciones, la eficacia de las CAPA y el costo de la no calidad.', correcta: true, retro: 'Es la lectura de Deming (eliminar el miedo) y de Crosby (medir el precio del incumplimiento). Un sistema sano reporta más y repite menos.' },
        { texto: 'Favorable si se acompaña de sanciones a quien cometa errores.', correcta: false, retro: 'Las sanciones refuerzan el miedo y el subregistro. El foco debe estar en el sistema, no en culpar a las personas.' },
      ],
    },
    errores: [
      { error: 'Cerrar investigaciones con «error humano» sin preguntar por qué el proceso lo permitió.', correccion: 'Aplica a Deming: busca la causa en el sistema (procedimiento, diseño, capacitación, carga de trabajo).' },
      { error: 'Atacar todos los problemas a la vez.', correccion: 'Aplica a Juran: prioriza con Pareto y trabaja proyecto por proyecto.' },
      { error: 'Presentar la calidad como un gasto.', correccion: 'Aplica a Crosby: cuantifica el costo de la no calidad y muestra el retorno de la prevención.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los tres procesos de la trilogía de Juran?', respuesta: 'Planificación, control y mejora de la calidad.' },
      { pregunta: '¿Qué entiende Crosby por calidad?', respuesta: 'Cumplir los requisitos, con un sistema de prevención, estándar de cero defectos y medición por el precio del incumplimiento.' },
      { pregunta: '¿Qué dice Deming sobre el origen de la mayoría de los problemas?', respuesta: 'Que vienen del sistema y no de las personas, por lo que hay que mejorar el proceso en lugar de culpar al operario.' },
    ],
    resumen: [
      '**Deming**: el sistema causa la mayoría de los problemas; mejora con el ciclo PHVA y sin miedo.',
      '**Juran**: la calidad se planifica, se controla y se mejora proyecto por proyecto.',
      '**Crosby**: cumplir requisitos desde la primera vez y medir el **costo de la no calidad**.',
    ],
    referencias: [R.deming, R.juran, R.crosby, R.ichQ10],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Tres tarjetas ilustradas con la idea central de cada autor (ciclo, trilogía y cero defectos), sin retratos, en la paleta de Edvanta.', alt: 'Ideas centrales de Deming, Juran y Crosby sobre la calidad' },
    ],
    keywords: ['deming juran crosby', 'aportes de deming a la calidad', 'trilogía de juran', 'cero defectos crosby', 'costo de la no calidad', '14 puntos de deming', 'gurús de la calidad'],
  },
  {
    titulo: 'Calidad del medicamento: por qué la industria farmacéutica requiere un sistema propio',
    duracion: 20,
    gancho: {
      titulo: 'El paciente no puede comprobar lo que toma',
      texto: 'Quien compra un televisor puede encenderlo y ver si funciona. Quien recibe un jarabe para su hijo no tiene forma de saber si contiene la cantidad correcta de principio activo, si el excipiente es el declarado o si está contaminado. En 2022, la OMS alertó sobre jarabes pediátricos contaminados con dietilenglicol y etilenglicol asociados a muertes de niños en Gambia. El paciente confía porque no puede verificar. Esa asimetría es la razón por la que el medicamento exige un sistema de calidad más estricto que casi cualquier otro producto.',
    },
    objetivos: [
      'Explicar por qué la calidad del medicamento no puede verificarse por el usuario ni garantizarse solo con el análisis final.',
      'Describir los atributos de calidad de un medicamento: identidad, pureza, potencia, seguridad y desempeño.',
      'Relacionar esas características con los elementos de las BPM y del sistema de calidad farmacéutico.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Atributos de calidad', definicion: 'Las propiedades que el medicamento debe cumplir: identidad (es lo que dice ser), pureza (sin contaminantes ni impurezas fuera de límite), potencia o valoración (la cantidad declarada), seguridad y desempeño (por ejemplo, disolución y estabilidad durante la vida útil).' },
      { icono: 'Microscope', termino: 'Análisis destructivo y por muestreo', definicion: 'La mayoría de los ensayos destruyen la unidad analizada y se hacen sobre una muestra; por eso no pueden demostrar por sí solos la calidad de cada unidad del lote.' },
      { icono: 'BadgeCheck', termino: 'Liberación del lote', definicion: 'La decisión documentada, tomada por una persona autorizada e independiente de producción, de que el lote cumple su registro sanitario y se fabricó bajo BPM.' },
      { icono: 'Stamp', termino: 'Registro sanitario', definicion: 'La autorización del INVIMA que fija la fórmula, las especificaciones, el fabricante y las condiciones con las que el medicamento puede comercializarse.' },
    ],
    secciones: [
      {
        titulo: 'Un producto distinto',
        parrafos: [
          'El medicamento tiene tres rasgos que justifican un sistema propio. Primero, el **usuario no puede evaluar su calidad**: ni el paciente ni, muchas veces, el profesional de la salud pueden distinguir a simple vista un medicamento subestándar. Segundo, las **consecuencias de una falla son graves**: un error de dosis, una contaminación cruzada o un excipiente adulterado pueden causar daño o muerte. Tercero, **la calidad no se puede comprobar del todo en el producto terminado**: la uniformidad de contenido, la esterilidad o la ausencia de contaminación cruzada dependen de cómo se fabricó.',
          'Por eso la regulación no solo autoriza el producto con un registro sanitario, sino que exige que se fabrique bajo **Buenas Prácticas de Manufactura** certificadas por la autoridad, que cada lote sea liberado por una persona autorizada y que exista vigilancia después de la comercialización (farmacovigilancia, quejas, retiros del mercado).',
        ],
      },
      {
        titulo: 'Lo que la historia enseñó',
        parrafos: [
          'El caso del elixir de sulfanilamida en 1937 y la alerta de la OMS de 2022 por jarabes contaminados con dietilenglicol tienen un mismo origen: un excipiente que nadie controló. La lección se tradujo en requisitos concretos de las BPM: calificar a los proveedores, analizar cada lote de materia prima antes de usarla, mantener la trazabilidad y controlar los cambios. La OMS insiste en que la contaminación de excipientes sigue siendo un riesgo vigente en el mundo.',
          'Otros riesgos propios del medicamento son la **contaminación cruzada** entre productos fabricados en las mismas instalaciones, las **mezclas** de etiquetas o lotes y la **degradación** durante la vida útil. Cada uno tiene en las BPM un control específico: segregación y limpieza validada, despeje de línea y conciliación de material impreso, y estudios de estabilidad.',
        ],
      },
      {
        titulo: 'Del cumplimiento al sistema',
        parrafos: [
          'Cumplir BPM es obligatorio, pero un conjunto de requisitos aislados no garantiza que funcionen juntos. Un **sistema de calidad farmacéutico** conecta los controles: el cambio de proveedor activa el control de cambios, que activa la calificación, que se refleja en la especificación y en la capacitación; la queja de un paciente activa una investigación que puede terminar en una CAPA y en una revisión del proceso. ICH Q10 llama a esto gestionar el conocimiento y el ciclo de vida del producto.',
          'En el servicio farmacéutico la lógica es la misma: la Resolución 1403 de 2007 exige procesos documentados de selección, adquisición, recepción, almacenamiento, distribución y dispensación, porque la calidad que el fabricante construyó se puede perder en un almacenamiento a mala temperatura o en una dispensación equivocada.',
        ],
      },
    ],
    proceso: {
      titulo: 'Dónde se construye la calidad de un medicamento',
      intro: 'Cada eslabón puede ganar o perder la calidad que el paciente no puede verificar.',
      pasos: [
        { titulo: 'Desarrollo', detalle: 'Se define la fórmula, el proceso y las especificaciones que el INVIMA aprueba en el registro sanitario.', icono: 'FlaskConical', evidencia: 'Expediente y registro sanitario.' },
        { titulo: 'Proveedores y materiales', detalle: 'Se califican proveedores y se analiza cada lote de materia prima antes de usarlo.', icono: 'Package', evidencia: 'Proveedores aprobados y certificados de análisis verificados.' },
        { titulo: 'Fabricación bajo BPM', detalle: 'Procesos validados, personal capacitado, áreas y equipos calificados y registros de lote.', icono: 'Factory', evidencia: 'Registro de lote completo.' },
        { titulo: 'Control y liberación', detalle: 'Análisis según especificaciones y revisión del registro de lote antes de liberar.', icono: 'BadgeCheck', evidencia: 'Certificado de análisis y liberación firmada.' },
        { titulo: 'Distribución y dispensación', detalle: 'Almacenamiento y transporte en condiciones controladas; dispensación correcta.', icono: 'Truck', evidencia: 'Registros de temperatura y dispensación.' },
        { titulo: 'Vigilancia', detalle: 'Quejas, farmacovigilancia y retiros del mercado cierran el ciclo.', icono: 'Eye', evidencia: 'Investigaciones y reportes.' },
      ],
    },
    caso: {
      titulo: 'El excipiente más barato',
      contexto: 'Compras propone cambiar el proveedor de propilenglicol de un jarabe por uno nuevo que ofrece mejor precio y entrega un certificado de análisis que cumple la farmacopea.',
      pregunta: '¿Qué debe exigir el sistema de calidad antes de usar el nuevo proveedor?',
      opciones: [
        { texto: 'Aceptarlo: el certificado de análisis demuestra que cumple.', correcta: false, retro: 'Un certificado no reemplaza la calificación del proveedor ni el análisis propio. Los casos de dietilenglicol ocurrieron con excipientes que «tenían papeles».' },
        { texto: 'Gestionar el cambio: calificar al proveedor, analizar los lotes incluido el ensayo de dietilenglicol y etilenglicol, evaluar el impacto en el registro y aprobar antes de usar.', correcta: true, retro: 'Es el sistema funcionando: control de cambios, calificación de proveedores y análisis de identidad y pureza antes del uso.' },
        { texto: 'Usarlo en un lote y analizar el producto terminado.', correcta: false, retro: 'Probar con el producto terminado expone al paciente al riesgo. La verificación debe hacerse antes de fabricar.' },
      ],
    },
    errores: [
      { error: 'Confiar en el certificado de análisis del proveedor sin verificación propia.', correccion: 'Califica al proveedor y realiza al menos el ensayo de identidad de cada lote; para excipientes de riesgo, los ensayos críticos de pureza.' },
      { error: 'Pensar que el análisis final compensa un proceso descontrolado.', correccion: 'La calidad se construye en el proceso; el análisis la confirma sobre una muestra.' },
      { error: 'Olvidar la cadena de distribución y dispensación.', correccion: 'Incluye almacenamiento, transporte y dispensación en el sistema de calidad.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué el paciente no puede juzgar la calidad del medicamento?', respuesta: 'Porque los atributos críticos (contenido, pureza, contaminación, disolución) no son visibles y requieren análisis de laboratorio.' },
      { pregunta: '¿Qué lección comparten el caso de 1937 y la alerta de la OMS de 2022?', respuesta: 'Que un excipiente no controlado (dietilenglicol) puede causar muertes; de ahí la exigencia de calificar proveedores y analizar materias primas.' },
    ],
    resumen: [
      'El usuario **no puede verificar** la calidad del medicamento: confía en el sistema.',
      'La calidad depende de **cómo se fabricó**, no solo del análisis final.',
      'BPM, liberación por persona autorizada y vigilancia forman un **sistema propio** del sector.',
    ],
    referencias: [R.whoAlertaDeg, R.fdaSulfanilamida, R.trs986a2, R.dec677Invima],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Cadena ilustrada del medicamento desde el desarrollo hasta el paciente, con un escudo de calidad en cada eslabón.', alt: 'Cadena de calidad del medicamento desde el desarrollo hasta la dispensación' },
    ],
    keywords: ['calidad del medicamento', 'atributos de calidad de un medicamento', 'por qué las bpm son obligatorias', 'dietilenglicol jarabes oms', 'liberación de lotes farmacéuticos', 'sistema de calidad farmacéutico'],
  },
  {
    titulo: 'Los siete principios de la gestión de la calidad (ISO 9000:2015)',
    duracion: 25,
    gancho: {
      titulo: 'Un sistema sin principios se vuelve papeleo',
      texto: 'Una droguería obtuvo la certificación ISO 9001 hace tres años. Tiene procedimientos para todo, pero las quejas de los clientes no llegan a la dirección, cada área mide lo que quiere y los proveedores cambian sin evaluación. El sistema existe en papel y no en las decisiones. ISO 9000:2015 propone siete principios precisamente para evitar eso: son la lógica que debe estar detrás de cada procedimiento.',
    },
    objetivos: [
      'Enumerar y explicar los siete principios de la gestión de la calidad de ISO 9000:2015.',
      'Dar ejemplos de cada principio en una planta, un laboratorio o un servicio farmacéutico.',
      'Diagnosticar qué principio falla en una situación concreta.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Enfoque al cliente', definicion: 'Cumplir los requisitos del cliente y tratar de exceder sus expectativas. En farmacia, el cliente final es el paciente, y entre los requisitos están los regulatorios.' },
      { icono: 'Flag', termino: 'Liderazgo', definicion: 'Los líderes establecen la unidad de propósito y la dirección, y crean condiciones para que las personas se impliquen en los objetivos de calidad.' },
      { icono: 'UserCheck', termino: 'Compromiso de las personas', definicion: 'Personas competentes, empoderadas y comprometidas en todos los niveles para crear y proporcionar valor.' },
      { icono: 'Workflow', termino: 'Enfoque a procesos', definicion: 'Los resultados se logran de forma más eficaz cuando las actividades se entienden y gestionan como procesos relacionados que funcionan como un sistema.' },
      { icono: 'RefreshCw', termino: 'Mejora', definicion: 'Las organizaciones con éxito tienen un enfoque continuo hacia la mejora.' },
      { icono: 'BarChart3', termino: 'Decisiones basadas en la evidencia', definicion: 'Las decisiones basadas en el análisis y la evaluación de datos e información tienen mayor probabilidad de producir los resultados deseados.' },
      { icono: 'Network', termino: 'Gestión de las relaciones', definicion: 'Gestionar las relaciones con las partes interesadas, como los proveedores, para lograr el éxito sostenido.' },
    ],
    mapa: {
      centro: 'Siete principios',
      ramas: [
        { titulo: 'Personas', icono: 'Users', nodos: ['Enfoque al cliente', 'Liderazgo', 'Compromiso de las personas'] },
        { titulo: 'Forma de trabajar', icono: 'Workflow', nodos: ['Enfoque a procesos', 'Mejora'] },
        { titulo: 'Decisiones y aliados', icono: 'BarChart3', nodos: ['Decisiones basadas en la evidencia', 'Gestión de las relaciones'] },
      ],
    },
    secciones: [
      {
        titulo: 'De dónde salen y para qué sirven',
        parrafos: [
          'ISO 9000:2015, la norma de fundamentos y vocabulario, describe **siete principios de la gestión de la calidad**: enfoque al cliente, liderazgo, compromiso de las personas, enfoque a procesos, mejora, toma de decisiones basada en la evidencia y gestión de las relaciones. No son requisitos auditables por sí mismos; son la base sobre la que se escribieron los requisitos de ISO 9001:2015. Cuando un requisito parece arbitrario, casi siempre se entiende al buscar el principio que lo sostiene.',
          'ISO publica además un documento divulgativo sobre los principios, en el que cada uno se presenta con su declaración, su fundamento, sus beneficios y las acciones que una organización puede tomar. En este curso los usarás como herramienta de diagnóstico: cuando un sistema no funciona, suele haber un principio que se está ignorando.',
        ],
      },
      {
        titulo: 'Los principios en la práctica farmacéutica',
        parrafos: [
          '**Enfoque al cliente**: en el sector, el cliente final es el paciente y los requisitos incluyen los del registro sanitario y las BPM; una droguería que analiza sus quejas de faltantes aplica este principio. **Liderazgo**: la dirección fija la política de calidad, asigna recursos y revisa el sistema; ICH Q10 lo llama responsabilidad de la dirección. **Compromiso de las personas**: un operario capacitado que detiene la línea ante una anomalía y la reporta sin miedo es la prueba de que el principio funciona.',
          '**Enfoque a procesos**: gestionar la recepción técnica, el almacenamiento y la dispensación como procesos conectados, con dueños e indicadores, en lugar de áreas aisladas. **Mejora**: las CAPA, los proyectos de reducción de desviaciones y la revisión anual de producto. **Decisiones basadas en la evidencia**: liberar, rechazar o cambiar un proceso con base en datos de tendencia y no en la intuición. **Gestión de las relaciones**: calificar, evaluar y desarrollar a los proveedores y a los laboratorios contratados con acuerdos de calidad.',
        ],
      },
      {
        titulo: 'Usarlos como diagnóstico',
        parrafos: [
          'En la droguería del ejemplo inicial fallan al menos tres principios: el **enfoque al cliente** (las quejas no llegan a la dirección), las **decisiones basadas en la evidencia** (cada área mide lo que quiere, sin indicadores comunes) y la **gestión de las relaciones** (los proveedores cambian sin evaluación). Tener procedimientos no corrige nada si no se reconecta el sistema con sus principios.',
          'Un ejercicio útil antes de una auditoría interna es tomar cada principio y preguntar: ¿qué evidencia tengo de que lo aplicamos? Si para algún principio la respuesta es «ninguna», ahí está la oportunidad de mejora más importante.',
        ],
      },
    ],
    caso: {
      titulo: 'La decisión del jefe de producción',
      contexto: 'Un jefe de producción decide reducir el tiempo de secado de un granulado porque «siempre ha funcionado más corto». No hay datos de humedad residual que respalden el cambio ni se informó a aseguramiento de calidad.',
      pregunta: '¿Qué principios se están ignorando principalmente?',
      opciones: [
        { texto: 'Enfoque al cliente y liderazgo.', correcta: false, retro: 'Pueden estar implicados, pero el problema central es decidir sin datos y sin gestionar el proceso.' },
        { texto: 'Decisiones basadas en la evidencia y enfoque a procesos (el cambio debía pasar por control de cambios con datos).', correcta: true, retro: 'La decisión se tomó por intuición y por fuera del proceso de gestión del cambio, que existe precisamente para evaluar el impacto con evidencia.' },
        { texto: 'Gestión de las relaciones.', correcta: false, retro: 'Ese principio se refiere a proveedores y partes interesadas; aquí el problema es interno.' },
      ],
    },
    errores: [
      { error: 'Memorizar los principios sin conectarlos con los procesos.', correccion: 'Para cada principio, identifica qué proceso lo materializa y qué evidencia lo demuestra.' },
      { error: 'Pensar que el cliente es solo quien paga.', correccion: 'En farmacia incluye al paciente, al prescriptor, a la autoridad sanitaria y a los clientes institucionales.' },
      { error: 'Confundir compromiso de las personas con capacitación.', correccion: 'La capacitación es necesaria; el compromiso exige además participación, reconocimiento y ausencia de miedo a reportar.' },
    ],
    comprueba: [
      { pregunta: 'Nombra los siete principios.', respuesta: 'Enfoque al cliente, liderazgo, compromiso de las personas, enfoque a procesos, mejora, toma de decisiones basada en la evidencia y gestión de las relaciones.' },
      { pregunta: '¿Los principios son requisitos auditables?', respuesta: 'No directamente: son la base de los requisitos de ISO 9001:2015, que sí se auditan.' },
      { pregunta: '¿Qué principio se aplica al calificar a un laboratorio contratado?', respuesta: 'Gestión de las relaciones, junto con la toma de decisiones basada en la evidencia.' },
    ],
    resumen: [
      'Los **siete principios** de ISO 9000:2015 son la lógica detrás de cada requisito de ISO 9001.',
      'En farmacia, el **cliente** incluye al paciente y a la autoridad sanitaria.',
      'Usa los principios como **diagnóstico**: el que no tiene evidencia muestra dónde mejorar.',
    ],
    referencias: [R.iso9000, R.isoPrincipios, R.iso9001, R.ichQ10],
    imagenes: [
      { ubicacion: 'Junto a los conceptos', descripcion: 'Rueda ilustrada con los siete principios de la gestión de la calidad, cada uno con un icono, en la paleta de Edvanta.', alt: 'Los siete principios de la gestión de la calidad según ISO 9000:2015' },
    ],
    keywords: ['7 principios de la gestión de la calidad', 'principios iso 9000 2015', 'enfoque al cliente liderazgo compromiso', 'principios de calidad iso 9001', 'gestión de las relaciones iso', 'toma de decisiones basada en la evidencia'],
  },
  {
    titulo: 'Vocabulario esencial del SGC: requisito, conformidad, proceso, eficacia, eficiencia',
    duracion: 20,
    gancho: {
      titulo: 'Dos personas, dos significados',
      texto: 'En una auditoría, el auditor pregunta si la acción correctiva fue eficaz. La jefa del área responde que sí, que se hizo rápido y sin costo. El auditor insiste: ¿se eliminó la causa y el problema no volvió a ocurrir? Ella hablaba de eficiencia; él, de eficacia. Muchas discusiones en calidad son, en el fondo, malentendidos de vocabulario. ISO 9000:2015 define los términos para que todos hablen el mismo idioma.',
    },
    objetivos: [
      'Definir con precisión los términos básicos de un SGC según ISO 9000:2015.',
      'Distinguir pares que se confunden: eficacia y eficiencia, corrección y acción correctiva, conformidad y no conformidad.',
      'Usar el vocabulario correcto al redactar hallazgos, desviaciones e indicadores.',
    ],
    conceptos: [
      { icono: 'ClipboardCheck', termino: 'Requisito', definicion: 'Necesidad o expectativa establecida, generalmente implícita u obligatoria. Puede venir del cliente, de la norma, de la autoridad sanitaria o de la propia organización.' },
      { icono: 'CheckCircle2', termino: 'Conformidad y no conformidad', definicion: 'Conformidad es el cumplimiento de un requisito; no conformidad, su incumplimiento.' },
      { icono: 'Workflow', termino: 'Proceso', definicion: 'Conjunto de actividades mutuamente relacionadas o que interactúan, que utilizan las entradas para proporcionar un resultado previsto.' },
      { icono: 'Target', termino: 'Eficacia', definicion: 'Grado en el que se realizan las actividades planificadas y se logran los resultados planificados.' },
      { icono: 'Gauge', termino: 'Eficiencia', definicion: 'Relación entre el resultado alcanzado y los recursos utilizados.' },
      { icono: 'Wrench', termino: 'Corrección y acción correctiva', definicion: 'La corrección elimina una no conformidad detectada; la acción correctiva elimina la causa para evitar que vuelva a ocurrir.' },
      { icono: 'FileText', termino: 'Información documentada', definicion: 'Información que una organización debe controlar y mantener, y el medio que la contiene. Reemplaza en ISO 9001:2015 a «documentos» y «registros».' },
    ],
    secciones: [
      {
        titulo: 'Requisito, conformidad y calidad',
        parrafos: [
          'ISO 9000:2015 define la **calidad** como el grado en el que un conjunto de características inherentes de un objeto cumple con los requisitos. La definición tiene dos consecuencias prácticas. La primera: la calidad siempre se mide contra un **requisito**; sin especificación no hay forma de decir si algo es de calidad. La segunda: el requisito puede ser **establecido** (escrito en una especificación, un contrato o una norma), **implícito** (lo que es práctica habitual, como que un medicamento esté libre de partículas visibles) u **obligatorio** (lo que exige la ley o el registro sanitario).',
          'Cuando se cumple un requisito hay **conformidad**; cuando no, **no conformidad**. En el lenguaje de BPM, la no conformidad de un proceso se llama con frecuencia **desviación**, y la de un resultado analítico, **resultado fuera de especificación**. Lo importante es que toda no conformidad se registra, se evalúa y se trata.',
        ],
      },
      {
        titulo: 'Proceso, eficacia y eficiencia',
        parrafos: [
          'Un **proceso** transforma entradas en un resultado previsto mediante actividades relacionadas. La recepción técnica de un medicamento es un proceso: entra el producto con sus documentos y sale un producto aceptado o rechazado, con su registro. Pensar en procesos obliga a definir entradas, salidas, responsables, controles e indicadores.',
          'La **eficacia** responde a la pregunta «¿logramos lo planificado?»; la **eficiencia**, a «¿con cuántos recursos?». Una acción correctiva es eficaz si eliminó la causa y el problema no volvió a presentarse; puede ser eficaz y costosa, o barata e ineficaz. En una auditoría, la verificación de la eficacia de las CAPA es uno de los puntos más revisados, porque demuestra si el sistema aprende.',
        ],
      },
      {
        titulo: 'Corrección, acción correctiva e información documentada',
        parrafos: [
          'La **corrección** actúa sobre la no conformidad ya detectada: reetiquetar unas cajas mal identificadas, separar un lote en cuarentena. La **acción correctiva** actúa sobre la **causa**: modificar el procedimiento de etiquetado, agregar una verificación o rediseñar el formato. Confundirlas es uno de los errores más frecuentes: muchas «acciones correctivas» son en realidad correcciones que dejan la causa intacta. ISO 9001:2015 eliminó el requisito separado de acción preventiva porque el pensamiento basado en riesgos ya lo integra, mientras que las BPM y ICH Q10 siguen hablando de CAPA.',
          'ISO 9001:2015 habla de **información documentada**. Cuando pide «mantener» información documentada se refiere a documentos como procedimientos o la política; cuando pide «conservar», a registros que sirven de evidencia. En el mundo farmacéutico se sigue distinguiendo entre documentos (instrucciones) y registros (evidencia), con reglas estrictas de integridad de datos.',
        ],
      },
    ],
    caso: {
      titulo: 'La acción correctiva que no corrigió nada',
      contexto: 'Se detectan tres estuches con la fecha de vencimiento ilegible. El reporte de la desviación dice: «Acción correctiva: se reimprimieron los tres estuches y se capacitó al operario».',
      pregunta: '¿Cómo calificas lo que se hizo?',
      opciones: [
        { texto: 'Es una acción correctiva completa.', correcta: false, retro: 'Reimprimir es una corrección. Capacitar puede ayudar, pero sin identificar la causa (tinta, ajuste, velocidad, verificación) no hay acción correctiva.' },
        { texto: 'Es una corrección; falta investigar la causa (por ejemplo, el ajuste de la impresora o la ausencia de verificación) y definir la acción correctiva y cómo se verificará su eficacia.', correcta: true, retro: 'Exacto: corrección sobre el efecto, acción correctiva sobre la causa y verificación de eficacia para cerrar.' },
        { texto: 'Es una acción preventiva.', correcta: false, retro: 'La acción preventiva actúa sobre una no conformidad potencial; aquí la no conformidad ya ocurrió.' },
      ],
    },
    errores: [
      { error: 'Usar eficacia y eficiencia como sinónimos.', correccion: 'Eficacia es lograr lo planificado; eficiencia es la relación entre resultado y recursos.' },
      { error: 'Registrar correcciones como acciones correctivas.', correccion: 'Separa siempre la corrección (sobre el efecto) de la acción correctiva (sobre la causa).' },
      { error: 'Redactar hallazgos sin el requisito que se incumple.', correccion: 'Toda no conformidad cita el requisito, la evidencia y el incumplimiento.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo define ISO 9000:2015 la calidad?', respuesta: 'Como el grado en el que un conjunto de características inherentes de un objeto cumple con los requisitos.' },
      { pregunta: '¿Cuál es la diferencia entre corrección y acción correctiva?', respuesta: 'La corrección elimina la no conformidad detectada; la acción correctiva elimina su causa para que no vuelva a ocurrir.' },
      { pregunta: '¿Qué significa «conservar información documentada»?', respuesta: 'Guardar registros que sirven como evidencia de lo realizado.' },
    ],
    resumen: [
      'La calidad se mide **contra requisitos** establecidos, implícitos u obligatorios.',
      '**Eficacia** es lograr lo planificado; **eficiencia**, hacerlo con buen uso de recursos.',
      'La **corrección** trata el efecto; la **acción correctiva**, la causa.',
    ],
    referencias: [R.iso9000, R.iso9001, R.ichQ10],
    imagenes: [
      { ubicacion: 'En la sección de eficacia y eficiencia', descripcion: 'Dos diagramas comparados: un blanco alcanzado (eficacia) y una balanza de resultado contra recursos (eficiencia).', alt: 'Diferencia entre eficacia y eficiencia en un sistema de gestión de calidad' },
    ],
    keywords: ['vocabulario iso 9000', 'diferencia entre eficacia y eficiencia', 'corrección y acción correctiva diferencia', 'qué es una no conformidad', 'información documentada iso 9001', 'definición de calidad iso 9000', 'términos del sistema de gestión de calidad'],
  },
];

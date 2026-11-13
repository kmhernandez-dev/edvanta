/**
 * Curso de Validaciones y Calificaciones en la Industria Farmacéutica
 * Experiencias de clase (9 clases). Ver scripts/generar-migracion-experiencias.mjs.
 */
import { REF } from '../referencias.mjs';

export const CURSO = 'Validaciones y Calificaciones en la Industria Farmacéutica';
export const MIGRACION = '120_experiencias_validaciones.sql';

export const CLASES = [
  // ── Unidad 1 · Calificar y validar no es lo mismo ─────────────
  {
    titulo: 'Los dos conceptos y su diferencia',
    duracion: 25,
    gancho: {
      titulo: 'Un auditor pregunta: «¿Esta autoclave está validada?»',
      texto: 'Es tu primera semana en el área de calidad de un laboratorio en Cundinamarca. Durante una auditoría, el auditor señala la autoclave nueva y pregunta si está validada. Tu jefe responde que «la autoclave está calificada y el ciclo de esterilización está validado». El auditor asiente. Tú te preguntas si no es lo mismo dicho de dos formas. No lo es, y entender por qué es la base de todo este curso.',
    },
    objetivos: [
      'Diferenciar calificación y validación con ejemplos de una planta farmacéutica.',
      'Clasificar equipos, sistemas, procesos y métodos según si se califican o se validan.',
      'Explicar por qué la calificación es un requisito previo de la validación.',
      'Usar el vocabulario del Anexo 15 de PIC/S con precisión ante un auditor.',
    ],
    conceptos: [
      { icono: 'Wrench', termino: 'Calificación', definicion: 'Demostrar con evidencia documentada que un equipo, una instalación o un sistema de apoyo está bien diseñado, bien instalado, opera como se especificó y rinde de forma consistente. Se califica **una cosa**.' },
      { icono: 'Workflow', termino: 'Validación', definicion: 'Demostrar con evidencia documentada que un proceso, una limpieza, un método analítico o un sistema computarizado produce de forma consistente un resultado que cumple criterios predeterminados. Se valida **una actividad**.' },
      { icono: 'FileCheck', termino: 'Evidencia documentada', definicion: 'Lo que no está escrito no ocurrió: protocolo aprobado antes de ejecutar, registros de la ejecución, desviaciones gestionadas e informe aprobado. Sin ese rastro no hay calificación ni validación.' },
      { icono: 'Target', termino: 'Criterio de aceptación', definicion: 'El límite que se define **antes** de ejecutar la prueba y que decide si el resultado cumple. Si el criterio se escribe después de ver el dato, la prueba pierde valor.' },
      { icono: 'Layers', termino: 'Ciclo de vida', definicion: 'La validación no es un evento: empieza con el diseño, se demuestra en la calificación y se sostiene con verificación continua y control de cambios.' },
    ],
    mapa: {
      centro: 'Demostrar con evidencia que algo funciona como debe',
      ramas: [
        { titulo: 'Se califica', icono: 'Wrench', nodos: ['Equipos de producción y de laboratorio', 'Instalaciones y áreas limpias', 'Sistemas de apoyo: agua, aire (HVAC), vapor, aire comprimido'] },
        { titulo: 'Se valida', icono: 'Workflow', nodos: ['Procesos de fabricación', 'Procedimientos de limpieza', 'Métodos analíticos', 'Sistemas computarizados y su uso'] },
        { titulo: 'Orden lógico', icono: 'Route', nodos: ['Primero se califica lo que se usa', 'Después se valida lo que se hace con ello', 'Un proceso no se valida en un equipo sin calificar'] },
        { titulo: 'Qué se entrega', icono: 'FileCheck', nodos: ['Protocolo aprobado antes', 'Registros y desviaciones', 'Informe con conclusión y aprobación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Una cosa o una actividad: la pregunta que lo resuelve casi todo',
        parrafos: [
          'La forma más sencilla de separar los dos conceptos es preguntarse si estás frente a **una cosa** o frente a **una actividad**. Una autoclave, un lecho fluido, un HPLC, una sala limpia o el sistema de agua purificada son cosas: se califican. La esterilización de una carga, la granulación de un lote, la limpieza de una tableteadora o la valoración por HPLC son actividades: se validan.',
          'El Anexo 15 de la Guía de PIC/S, que es la referencia técnica que adoptan las autoridades sanitarias que siguen las BPM armonizadas, usa ese mismo criterio. Califica instalaciones, equipos y sistemas de apoyo; valida procesos, limpieza, métodos analíticos y sistemas computarizados. En la práctica, muchas personas dicen «validar» para todo, y el propio glosario reconoce que la palabra validación a veces se amplía para incluir la calificación. Pero en un protocolo, en un informe o frente a un inspector, la precisión importa.',
          'Volvamos a la autoclave: calificarla demuestra que se instaló según lo especificado, que sus controles de temperatura, presión y tiempo funcionan en todo el rango de operación y que la distribución de calor en la cámara es uniforme. Validar el ciclo demuestra que **esa carga concreta**, con esa configuración y ese tiempo, alcanza la letalidad requerida de forma repetible, lo que se comprueba con termopares en los puntos fríos e indicadores biológicos.',
        ],
      },
      {
        titulo: 'Por qué la calificación va primero',
        parrafos: [
          'Una validación descansa sobre los equipos y sistemas en los que ocurre. Si el lecho fluido no controla la temperatura del aire de entrada dentro de su rango, ningún estudio de validación del secado tendrá sentido: estarías midiendo la variabilidad del equipo y no la del proceso. Por eso la secuencia lógica es calificar primero y validar después.',
          'Esta dependencia también explica por qué un cambio en un equipo calificado puede afectar varias validaciones. Si se reemplaza el controlador de temperatura de un horno de despirogenización, hay que revisar su calificación y evaluar si los ciclos validados siguen siendo válidos. Ese análisis lo ordena el control de cambios, que verás en la clase de protocolos y recalificación.',
          'En Colombia, la exigencia de calificar y validar llega a través de las Buenas Prácticas de Manufactura adoptadas por la Resolución 1160 de 2016. Las guías de inspección del INVIMA revisan que existan protocolos e informes, que los criterios se hayan definido antes y que las desviaciones se hayan investigado. No basta con decir que un equipo «funciona bien»: hay que demostrarlo con papeles que resistan una lectura crítica.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo decidir si algo se califica o se valida',
      intro: 'Usa esta secuencia cada vez que tengas que clasificar un elemento del plan de validación.',
      pasos: [
        { titulo: 'Identifica el elemento', detalle: 'Escribe el nombre exacto: «autoclave A-02» o «ciclo de esterilización de viales de 10 mL en la autoclave A-02». La precisión del nombre ya revela si es una cosa o una actividad.', icono: 'Search', evidencia: 'Inventario de equipos y lista de procesos.' },
        { titulo: 'Pregunta si es una cosa o una actividad', detalle: 'Una cosa (equipo, área, sistema de apoyo) se califica. Una actividad (proceso, limpieza, método, uso de un sistema computarizado) se valida.', icono: 'GitBranch', evidencia: 'Clasificación en el plan maestro.' },
        { titulo: 'Evalúa su impacto en la calidad', detalle: 'Con análisis de riesgo (ICH Q9) decide si el elemento tiene impacto directo, indirecto o nulo sobre el producto. Eso define la profundidad de la calificación o de la validación.', icono: 'AlertTriangle', evidencia: 'Evaluación de impacto y de riesgo firmada.' },
        { titulo: 'Verifica el prerrequisito', detalle: 'Antes de validar una actividad, confirma que los equipos y sistemas que usa estén calificados y con calibraciones vigentes.', icono: 'ClipboardCheck', evidencia: 'Estado de calificación y calibración de cada equipo.' },
        { titulo: 'Escribe el protocolo con criterios', detalle: 'Define objetivo, alcance, responsabilidades, pruebas y criterios de aceptación. Calidad lo aprueba antes de ejecutar.', icono: 'FileText', evidencia: 'Protocolo aprobado con fecha anterior a la ejecución.' },
        { titulo: 'Ejecuta, gestiona desviaciones e informa', detalle: 'Registra los datos en tiempo real, investiga cada desviación y concluye en un informe aprobado que declare el estado: calificado o validado.', icono: 'FileCheck', evidencia: 'Registros, desviaciones cerradas e informe aprobado.' },
      ],
    },
    caso: {
      titulo: 'El HPLC nuevo y el método de valoración',
      contexto: 'Llega un HPLC nuevo al laboratorio de control de calidad. El jefe de laboratorio quiere usarlo de inmediato para liberar lotes con un método de valoración que ya estaba validado en el equipo anterior, del mismo modelo. Propone «validar el HPLC» corriendo el método con tres muestras.',
      pregunta: '¿Qué es lo correcto antes de liberar lotes con el equipo nuevo?',
      opciones: [
        { texto: 'Correr el método con tres muestras y, si coinciden con el equipo anterior, usarlo.', correcta: false, retro: 'Comparar resultados no demuestra que el equipo esté bien instalado ni que opere en todo su rango. Además, no existe «validar el HPLC»: el equipo se califica.' },
        { texto: 'Calificar el HPLC (instalación, operación y desempeño) y luego verificar que el método validado funcione en él, con un análisis de riesgo del cambio.', correcta: true, retro: 'Primero se demuestra que el equipo es apto (calificación) y después se confirma que el método sigue siendo adecuado en el equipo nuevo, bajo control de cambios. Es el orden que esperan las BPM y la guía de inspección.' },
        { texto: 'Revalidar el método completo desde cero, sin calificar el equipo porque es del mismo modelo.', correcta: false, retro: 'Ser del mismo modelo no exime de calificar: cada equipo instalado es una cosa distinta. Y una revalidación completa puede no ser necesaria si el análisis de riesgo lo justifica.' },
      ],
    },
    errores: [
      { error: 'Decir que un equipo «está validado».', correccion: 'Los equipos, áreas y sistemas de apoyo se califican. Reserva «validado» para procesos, limpiezas, métodos y sistemas computarizados en uso.' },
      { error: 'Escribir los criterios de aceptación después de ver los resultados.', correccion: 'El protocolo con sus criterios se aprueba antes de ejecutar. Un criterio ajustado al dato es una señal de alerta para cualquier auditor.' },
      { error: 'Validar un proceso en un equipo con la calificación vencida o incompleta.', correccion: 'Revisa el estado de calificación y de calibración de cada equipo antes de iniciar la validación y déjalo registrado en el protocolo.' },
      { error: 'Tratar la validación como un trámite que termina con el informe.', correccion: 'La validación se sostiene con verificación continua, revisión periódica y control de cambios durante todo el ciclo de vida.' },
    ],
    comprueba: [
      { pregunta: 'Un lecho fluido, ¿se califica o se valida?', respuesta: 'Se califica, porque es un equipo. Lo que se valida es el proceso de secado o de granulación que ocurre en él.' },
      { pregunta: '¿Por qué no se puede validar un proceso en un equipo sin calificar?', respuesta: 'Porque la variabilidad del equipo se confundiría con la del proceso. La calificación garantiza que el equipo opera dentro de lo especificado, y sobre esa base se demuestra la consistencia del proceso.' },
      { pregunta: '¿Qué hace que una prueba sea evidencia documentada válida?', respuesta: 'Un protocolo aprobado antes de ejecutar, registros hechos en el momento, desviaciones investigadas y un informe aprobado con una conclusión clara.' },
      { pregunta: 'Menciona cuatro cosas que se validan en una planta.', respuesta: 'Procesos de fabricación, procedimientos de limpieza, métodos analíticos y sistemas computarizados.' },
    ],
    resumen: [
      'Se **califica** una cosa (equipo, área, sistema de apoyo); se **valida** una actividad (proceso, limpieza, método, sistema computarizado).',
      'La calificación es requisito previo de la validación.',
      'Sin protocolo aprobado, registros y criterios definidos antes, no hay evidencia documentada.',
      'En Colombia la exigencia llega por las BPM de la Resolución 1160 de 2016; el Anexo 15 de PIC/S es la referencia técnica.',
    ],
    referencias: [REF.picsAnexo15, REF.res1160, REF.trs1019a3, REF.ichQ9],
    imagenes: [
      { ubicacion: 'Después de la situación inicial', descripcion: 'Ilustración plana con los colores de Edvanta: a la izquierda una autoclave con la etiqueta «Se califica»; a la derecha una carga de viales entrando al ciclo con la etiqueta «Se valida». Fondo blanco, trazos azul #082E86 y turquesa #0F7480.', alt: 'Autoclave calificada frente a un ciclo de esterilización validado' },
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Infografía de dos columnas con iconos: cosas que se califican (equipo, sala limpia, agua, aire) y actividades que se validan (proceso, limpieza, método, software).', alt: 'Infografía de qué se califica y qué se valida en una planta farmacéutica' },
    ],
    keywords: ['diferencia entre calificación y validación', 'calificación y validación farmacéutica', 'qué es calificación de equipos', 'qué es validación en la industria farmacéutica', 'validación vs calificación', 'calificación de equipos farmacéuticos', 'validación farmacéutica qué es', 'anexo 15 pics calificación y validación', 'evidencia documentada validación', 'criterios de aceptación validación', 'curso de validaciones farmacéuticas', 'validaciones en la industria farmacéutica', 'curso de calificación de equipos'],
  },

  {
    titulo: 'De dónde viene la exigencia',
    duracion: 25,
    gancho: {
      titulo: '«¿En qué norma dice eso?»',
      texto: 'En una reunión con producción, propones agregar una prueba al protocolo de calificación de un tanque. El jefe de planta pregunta, con razón: «¿En qué norma dice eso?». Si respondes «es una buena práctica», la discusión se acaba ahí. Si respondes con el documento, la sección y el porqué, el requisito se cumple. Esta clase te da el mapa de las fuentes para defender cada línea de un protocolo.',
    },
    objetivos: [
      'Ubicar las fuentes que exigen calificar y validar en Colombia y su jerarquía.',
      'Distinguir entre norma obligatoria y referencia técnica.',
      'Relacionar las guías ICH Q8, Q9, Q10 y Q2/Q14 con las decisiones de validación.',
      'Citar la fuente correcta al justificar un requisito en un protocolo.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'Norma obligatoria', definicion: 'Lo que es exigible por ley en Colombia: el Decreto 677 de 1995, las resoluciones que adoptan las BPM (Resolución 1160 de 2016 y sus modificaciones) y la Resolución 3619 de 2013 para laboratorios de control de calidad.' },
      { icono: 'BookOpen', termino: 'Referencia técnica', definicion: 'Documentos que explican cómo cumplir: informes técnicos de la OMS, guías ICH, Anexo 15 de PIC/S, guías de la FDA o de la EMA. Orientan la interpretación y son lo que consulta el inspector.' },
      { icono: 'Globe', termino: 'Armonización', definicion: 'El esfuerzo de las autoridades para que una misma evidencia sirva en varios países. La ICH reúne a autoridades e industria; PIC/S agrupa inspectorados que comparten guía e inspección.' },
      { icono: 'ShieldCheck', termino: 'Guía de inspección', definicion: 'El instrumento con el que el INVIMA verifica el cumplimiento de las BPM. Saber qué pregunta permite preparar la evidencia antes de que llegue la visita.' },
    ],
    mapa: {
      centro: 'Las fuentes de la exigencia de calificar y validar',
      ramas: [
        { titulo: 'Ley colombiana', icono: 'Landmark', nodos: ['Decreto 677 de 1995', 'Resolución 1160 de 2016 (BPM) y modificaciones', 'Resolución 3619 de 2013 (BPL)', 'Decreto 335 de 2022 (certificación)'] },
        { titulo: 'OMS', icono: 'Globe', nodos: ['TRS 986, Anexo 2: principios de BPM', 'TRS 1019, Anexo 3: guía de validación', 'Anexos de agua, HVAC y estériles'] },
        { titulo: 'PIC/S y EMA', icono: 'ShieldCheck', nodos: ['Anexo 15: calificación y validación', 'Anexo 1: productos estériles (2022)', 'PI 041: integridad de datos'] },
        { titulo: 'ICH', icono: 'Network', nodos: ['Q8: desarrollo y espacio de diseño', 'Q9(R1): gestión de riesgos', 'Q10: sistema de calidad', 'Q2(R2) y Q14: métodos analíticos'] },
        { titulo: 'FDA', icono: 'BookOpen', nodos: ['Validación de procesos en tres etapas (2011)', 'Integridad de datos (2018)', 'Resultados fuera de especificación (2022)'] },
      ],
    },
    secciones: [
      {
        titulo: 'La jerarquía: qué obliga y qué orienta',
        parrafos: [
          'En Colombia, la obligación de fabricar bajo Buenas Prácticas nace del Decreto 677 de 1995, que regula los registros sanitarios y el control de calidad de los medicamentos. Las BPM se concretan en la Resolución 1160 de 2016, que establece los manuales de Buenas Prácticas de Manufactura y las guías de inspección, con base en los informes técnicos de la Organización Mundial de la Salud. Para los laboratorios de control de calidad, la Resolución 3619 de 2013 adopta el manual de Buenas Prácticas de Laboratorio. El procedimiento para obtener los certificados de cumplimiento lo regula hoy el Decreto 335 de 2022.',
          'Estas normas dicen **qué** se exige: que los equipos estén calificados, que los procesos, las limpiezas y los métodos estén validados, que haya control de cambios y que todo quede documentado. El **cómo** suele estar en las referencias técnicas. Por eso un protocolo bien escrito cita las dos: la norma que obliga y la guía que explica el método.',
          'Una precisión importante: una guía de la FDA o de la EMA no es ley en Colombia. Pero cuando una norma colombiana adopta un estándar de la OMS, o cuando el INVIMA interpreta un requisito, esas guías son la mejor evidencia del estado del arte. Citarlas no es exagerar: es demostrar que la decisión tiene fundamento.',
        ],
      },
      {
        titulo: 'Las guías que más vas a usar',
        parrafos: [
          'El **Anexo 15 de PIC/S** es el documento de cabecera: define la calificación de diseño, instalación, operación y desempeño, el plan maestro de validación, la validación de procesos, de limpieza y de transporte, y el control de cambios. La **guía de validación de la OMS** (TRS 1019, Anexo 3, de 2019) cubre el mismo terreno con lenguaje de la OMS, la fuente de donde provienen nuestras BPM.',
          'Las guías **ICH** aportan la lógica de fondo. Q8 introduce el desarrollo basado en conocimiento del producto y del proceso; Q9(R1) enseña a graduar el esfuerzo según el riesgo, y es la razón por la que no todo se califica con la misma profundidad; Q10 describe el sistema de calidad que sostiene el ciclo de vida; Q2(R2) y Q14 cubren la validación y el desarrollo de métodos analíticos.',
          'Por último, la guía de la **FDA de 2011 sobre validación de procesos** popularizó el modelo de tres etapas: diseño, calificación del proceso y verificación continua. Aunque es estadounidense, su enfoque es hoy un lenguaje común en la industria y lo verás reflejado en el Anexo 15.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo justificar un requisito en un protocolo',
      pasos: [
        { titulo: 'Formula el requisito', detalle: 'Escribe la prueba o el control en una frase concreta: «verificar la uniformidad de temperatura de la cámara con 12 sensores».', icono: 'ClipboardList', evidencia: 'Borrador del protocolo.' },
        { titulo: 'Busca la norma que obliga', detalle: 'Ubica el requisito general en las BPM de la Resolución 1160 de 2016 o en la Resolución 3619 de 2013 si es del laboratorio.', icono: 'Landmark', evidencia: 'Cita de la norma colombiana.' },
        { titulo: 'Busca la guía que explica el cómo', detalle: 'Encuentra en el Anexo 15, en la guía de la OMS o en la ICH la sección que describe la práctica esperada.', icono: 'BookOpen', evidencia: 'Cita de la referencia técnica con sección.' },
        { titulo: 'Conecta con el riesgo', detalle: 'Explica qué riesgo para el producto o el paciente controla la prueba. Así el requisito deja de ser una opinión.', icono: 'AlertTriangle', evidencia: 'Referencia a la evaluación de riesgo.' },
        { titulo: 'Registra la justificación', detalle: 'Escribe la justificación en el protocolo, en la sección de referencias o junto a la prueba. Quien lo revise después debe entender la decisión sin preguntarte.', icono: 'FileCheck', evidencia: 'Protocolo aprobado con referencias.' },
      ],
    },
    caso: {
      titulo: 'La discusión con producción',
      contexto: 'Producción se opone a incluir pruebas de distribución de temperatura en la calificación de desempeño de un horno de secado, porque «el proveedor ya entregó su certificado». El horno se usa para secar granulado de un producto sensible al calor.',
      pregunta: '¿Cuál es el argumento más sólido para mantener la prueba?',
      opciones: [
        { texto: '«Así lo hacíamos en mi empresa anterior».', correcta: false, retro: 'La experiencia ayuda, pero no es una fuente. Producción tiene derecho a pedir el fundamento.' },
        { texto: 'Citar el Anexo 15 sobre calificación de desempeño, la exigencia de las BPM de la Resolución 1160 de 2016 y el riesgo de degradación del producto por zonas calientes.', correcta: true, retro: 'Combina la norma que obliga, la guía que explica y el riesgo concreto para el producto. Es el argumento que resiste una auditoría y que convence a producción.' },
        { texto: 'Aceptar el certificado del proveedor como calificación de desempeño.', correcta: false, retro: 'El certificado del proveedor puede apoyar la calificación de instalación u operación, pero el desempeño se demuestra con la carga y las condiciones reales de uso en tu planta.' },
      ],
    },
    errores: [
      { error: 'Citar una guía extranjera como si fuera ley colombiana.', correccion: 'Presenta las guías de la FDA, la EMA o PIC/S como referencias técnicas y ancla la obligación en la norma colombiana.' },
      { error: 'Copiar requisitos de una guía sin entender su contexto.', correccion: 'Lee la sección completa y justifica por qué aplica a tu producto y a tu proceso.' },
      { error: 'Usar versiones derogadas de las guías.', correccion: 'Verifica la versión vigente: por ejemplo, Q2(R2) y Q9(R1) reemplazaron a sus versiones anteriores en 2023.' },
    ],
    comprueba: [
      { pregunta: '¿Qué norma colombiana establece los manuales de BPM y las guías de inspección?', respuesta: 'La Resolución 1160 de 2016, con sus modificaciones, como la Resolución 886 de 2019.' },
      { pregunta: '¿Por qué ICH Q9(R1) es relevante para la validación?', respuesta: 'Porque permite graduar la profundidad de la calificación y de la validación según el riesgo para el producto y el paciente.' },
      { pregunta: '¿Qué aporta la guía de la FDA de 2011?', respuesta: 'El modelo de validación de procesos en tres etapas: diseño del proceso, calificación del proceso y verificación continua.' },
    ],
    resumen: [
      'La norma colombiana dice **qué** se exige; las guías técnicas explican **cómo** cumplirlo.',
      'Decreto 677 de 1995, Resolución 1160 de 2016, Resolución 3619 de 2013 y Decreto 335 de 2022 son el marco obligatorio.',
      'Anexo 15 de PIC/S, TRS 1019 de la OMS e ICH Q8, Q9, Q10, Q2 y Q14 son las referencias técnicas de cabecera.',
      'Un requisito bien justificado combina norma, guía y riesgo.',
    ],
    referencias: [REF.dec677, REF.res1160, REF.res886, REF.res3619, REF.dec335, REF.trs1019a3, REF.picsAnexo15, REF.ichIndice, REF.fdaValidacionProcesos],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Pirámide de tres niveles con colores de marca: en la base la ley colombiana (azul), en el medio la OMS y PIC/S (turquesa), arriba ICH y FDA (lavanda), con iconos de balanza, globo y libro.', alt: 'Pirámide de la normativa de validación en Colombia' },
    ],
    keywords: ['normativa de validación en colombia', 'resolución 1160 de 2016 validación', 'requisitos invima validación', 'anexo 15 pics en español', 'guías ich de calidad', 'ich q9 gestión de riesgos validación', 'trs 1019 anexo 3 oms validación', 'guía fda validación de procesos 2011', 'decreto 677 de 1995 bpm', 'decreto 335 de 2022 certificación bpm', 'norma de validación farmacéutica', 'bpm colombia validación'],
  },

  {
    titulo: 'El enfoque de ciclo de vida y el Plan Maestro',
    duracion: 30,
    gancho: {
      titulo: 'Tres lotes y una carpeta en el archivo',
      texto: 'Durante años, en muchas plantas «validar» fue fabricar tres lotes consecutivos, archivar los resultados y no volver a mirar la carpeta. Hasta que un cambio de proveedor de un excipiente, aprobado sin evaluación de impacto, provocó lotes con disolución baja. La carpeta decía que el proceso estaba validado. La realidad decía otra cosa. El enfoque de ciclo de vida nació para cerrar esa brecha.',
    },
    objetivos: [
      'Describir las tres etapas del ciclo de vida de la validación de procesos.',
      'Explicar qué contiene un Plan Maestro de Validación y para qué sirve.',
      'Relacionar la verificación continua con la revisión periódica de calidad.',
      'Identificar los disparadores de una revalidación dentro del ciclo de vida.',
    ],
    conceptos: [
      { icono: 'Lightbulb', termino: 'Etapa 1: diseño del proceso', definicion: 'Se construye el conocimiento: qué atributos críticos de calidad tiene el producto y qué parámetros del proceso los afectan. Sale de desarrollo, escalamiento y análisis de riesgo.' },
      { icono: 'ClipboardCheck', termino: 'Etapa 2: calificación del proceso', definicion: 'Con equipos y sistemas calificados, se fabrican lotes a escala comercial bajo un protocolo (PPQ) para demostrar que el proceso diseñado es reproducible.' },
      { icono: 'LineChart', termino: 'Etapa 3: verificación continua', definicion: 'Con datos de los lotes de rutina y herramientas estadísticas, se confirma que el proceso sigue bajo control. El Anexo 15 la llama verificación continua o en curso del proceso.' },
      { icono: 'Files', termino: 'Plan Maestro de Validación', definicion: 'El documento que ordena la política, el alcance, las responsabilidades, el estado y la estrategia de calificación y validación de toda la planta.' },
      { icono: 'RefreshCw', termino: 'Revalidación', definicion: 'Repetir total o parcialmente una validación porque un cambio, una tendencia o la revisión periódica lo justifican. Se decide con análisis de riesgo, no por calendario a ciegas.' },
    ],
    mapa: {
      centro: 'Validación como ciclo de vida',
      ramas: [
        { titulo: 'Diseñar', icono: 'Lightbulb', nodos: ['Atributos críticos de calidad', 'Parámetros críticos del proceso', 'Estrategia de control'] },
        { titulo: 'Demostrar', icono: 'ClipboardCheck', nodos: ['Equipos y sistemas calificados', 'Protocolo PPQ aprobado', 'Lotes comerciales evaluados'] },
        { titulo: 'Sostener', icono: 'LineChart', nodos: ['Tendencias y cartas de control', 'Revisión periódica de producto', 'Control de cambios'] },
        { titulo: 'Ordenar', icono: 'Files', nodos: ['Plan Maestro de Validación', 'Inventario y estado', 'Cronograma y responsables'] },
      ],
    },
    secciones: [
      {
        titulo: 'De evento único a ciclo continuo',
        parrafos: [
          'La guía de la FDA de 2011 sobre validación de procesos definió la validación como la recopilación y evaluación de datos **desde el diseño del proceso y a lo largo de la producción comercial**, que establecen evidencia científica de que el proceso entrega producto de calidad de forma consistente. Esa definición cambió el foco: ya no basta con demostrar una vez; hay que entender el proceso y seguir comprobándolo.',
          'En la **etapa 1** se identifican los atributos críticos de calidad (por ejemplo, disolución, contenido o uniformidad) y los parámetros críticos del proceso que los afectan (como la cantidad de agua de granulación o la fuerza de compresión). En la **etapa 2** se califican equipos y sistemas y se ejecuta la calificación del desempeño del proceso con lotes comerciales. En la **etapa 3** se vigila el proceso de rutina para detectar variación no prevista.',
          'El Anexo 15 de PIC/S recoge este enfoque. Acepta la validación tradicional, la verificación continua del proceso cuando el desarrollo lo permite y enfoques híbridos. Para la validación tradicional, indica que generalmente se considera aceptable un mínimo de tres lotes consecutivos fabricados en condiciones de rutina, aunque el número debe justificarse; lo que ya no se acepta es que esos lotes sean el final del trabajo.',
        ],
      },
      {
        titulo: 'El Plan Maestro de Validación',
        parrafos: [
          'Si la planta tiene decenas de equipos, sistemas, procesos, limpiezas y métodos, alguien tiene que saber qué está calificado o validado, qué falta, qué se revalida este año y quién responde por cada cosa. Ese documento es el **Plan Maestro de Validación (PMV)**. El Anexo 15 lo exige y describe su contenido mínimo.',
          'Un PMV útil incluye la política de calificación y validación, la estructura organizacional y las responsabilidades, el inventario de instalaciones, equipos, sistemas, procesos y métodos con su estado actual, el manejo de cambios y desviaciones, la orientación para fijar criterios de aceptación, la referencia a los documentos existentes y la estrategia, incluida la recalificación cuando aplique.',
          'El error frecuente es convertirlo en un documento decorativo que se actualiza solo antes de una visita. El PMV debe ser vivo: se revisa con la frecuencia que defina la empresa, se cruza con el control de cambios y con la revisión periódica de producto, y sirve para planear recursos. Un inspector suele empezar por ahí para elegir qué revisar.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ciclo de vida de la validación de un proceso',
      pasos: [
        { titulo: 'Definir el perfil del producto', detalle: 'Establece qué atributos de calidad deben cumplirse (contenido, disolución, impurezas, uniformidad) y sus especificaciones.', icono: 'Target', evidencia: 'Perfil de calidad del producto.' },
        { titulo: 'Identificar parámetros críticos', detalle: 'Con datos de desarrollo y análisis de riesgo, determina qué parámetros del proceso afectan esos atributos y en qué rango.', icono: 'Crosshair', evidencia: 'Evaluación de riesgo y estudios de desarrollo.' },
        { titulo: 'Diseñar la estrategia de control', detalle: 'Define controles en proceso, especificaciones de materiales y límites de operación que mantengan el proceso en su rango.', icono: 'ShieldCheck', evidencia: 'Estrategia de control documentada.' },
        { titulo: 'Calificar equipos y sistemas', detalle: 'Confirma DQ, IQ, OQ y PQ de los equipos y los sistemas de apoyo que usa el proceso.', icono: 'Wrench', evidencia: 'Informes de calificación aprobados.' },
        { titulo: 'Ejecutar la calificación del proceso', detalle: 'Fabrica los lotes a escala comercial con un protocolo PPQ, con muestreo y criterios más estrictos que la rutina.', icono: 'Factory', evidencia: 'Protocolo e informe PPQ.' },
        { titulo: 'Verificar de forma continua', detalle: 'Analiza tendencias de los lotes de rutina, revisa cambios y desviaciones y decide si hace falta revalidar.', icono: 'LineChart', evidencia: 'Revisión periódica y cartas de control.' },
      ],
    },
    caso: {
      titulo: 'El proveedor nuevo de celulosa microcristalina',
      contexto: 'Compras propone cambiar el proveedor de celulosa microcristalina de un comprimido validado hace cinco años. El nuevo material cumple la monografía farmacopeica. Producción considera que «si cumple farmacopea, no hay nada que evaluar».',
      pregunta: '¿Qué indica el enfoque de ciclo de vida?',
      opciones: [
        { texto: 'Aprobar el cambio porque el material cumple la monografía.', correcta: false, retro: 'Cumplir la monografía no garantiza el mismo comportamiento en el proceso: tamaño de partícula, densidad o humedad pueden cambiar la compresión y la disolución.' },
        { texto: 'Gestionar el cambio con evaluación de impacto sobre los atributos críticos y, según el riesgo, fabricar lotes de verificación y reforzar el seguimiento en la etapa 3.', correcta: true, retro: 'El control de cambios decide con datos. Si el excipiente puede afectar atributos críticos, se verifica con lotes y se vigila con tendencias. Así se evita el escenario de la carpeta que dice «validado».' },
        { texto: 'Revalidar el proceso completo con tres lotes, sin evaluación previa.', correcta: false, retro: 'Puede ser excesivo o insuficiente. La decisión debe salir de la evaluación de riesgo del cambio.' },
      ],
    },
    errores: [
      { error: 'Considerar el informe de los tres lotes como el final de la validación.', correccion: 'La etapa 3 exige vigilar el proceso de rutina con tendencias y revisión periódica.' },
      { error: 'Un Plan Maestro que no coincide con lo que existe en planta.', correccion: 'Mantén el inventario y el estado sincronizados con el control de cambios y revísalo con una frecuencia definida.' },
      { error: 'Revalidar por calendario sin analizar datos.', correccion: 'Usa la revisión periódica y el análisis de riesgo para decidir qué revalidar y con qué alcance.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son las tres etapas del ciclo de vida de la validación de procesos?', respuesta: 'Diseño del proceso, calificación del proceso y verificación continua del proceso.' },
      { pregunta: 'Menciona cuatro contenidos del Plan Maestro de Validación.', respuesta: 'Política, responsabilidades, inventario con estado de calificación y validación, y estrategia de cambios, desviaciones y recalificación.' },
      { pregunta: '¿Qué dice el Anexo 15 sobre el número de lotes en la validación tradicional?', respuesta: 'Que generalmente se considera aceptable un mínimo de tres lotes consecutivos en condiciones de rutina, aunque el número debe justificarse.' },
    ],
    resumen: [
      'La validación es un **ciclo**: diseñar, demostrar y sostener.',
      'La etapa 3 (verificación continua) evita que «validado» se quede en una carpeta.',
      'El **Plan Maestro de Validación** ordena el estado y la estrategia de toda la planta.',
      'Los cambios se evalúan con riesgo; la revalidación se decide con datos.',
    ],
    referencias: [REF.fdaValidacionProcesos, REF.picsAnexo15, REF.trs1019a3, REF.ichQ10, REF.ichQ9],
    imagenes: [
      { ubicacion: 'Antes del mapa de proceso', descripcion: 'Diagrama circular de tres arcos con los colores de marca: diseño (lavanda), calificación (azul) y verificación continua (turquesa), con una flecha de control de cambios que atraviesa el círculo.', alt: 'Ciclo de vida de la validación de procesos en tres etapas' },
    ],
    keywords: ['ciclo de vida de la validación', 'plan maestro de validación', 'qué es el plan maestro de validación', 'etapas de la validación de procesos', 'verificación continua del proceso', 'validación de procesos fda 2011', 'ppq calificación del desempeño del proceso', 'revalidación de procesos farmacéuticos', 'contenido del plan maestro de validación', 'pmv validación', 'tres lotes de validación'],
  },

  // ── Unidad 2 · Calificación de equipos e instalaciones ─────────
  {
    titulo: 'DQ, IQ, OQ y PQ',
    duracion: 30,
    gancho: {
      titulo: 'La tableteadora llegó un viernes',
      texto: 'El proveedor instaló la tableteadora nueva un viernes y el lunes producción quería fabricar. Nadie había escrito qué velocidad necesitaban, qué tolerancias de peso aceptaban ni qué pruebas probarían que funcionaba. Seis meses después, la calificación seguía abierta porque no había contra qué comparar. La secuencia DQ, IQ, OQ y PQ existe para que eso no ocurra.',
    },
    objetivos: [
      'Explicar qué demuestra cada etapa de calificación y en qué orden se ejecuta.',
      'Relacionar la especificación de requerimientos de usuario (URS) con la calificación de diseño.',
      'Proponer pruebas y criterios de aceptación diferentes para OQ y PQ.',
      'Resolver el caso de un equipo que llega ya instalado.',
    ],
    conceptos: [
      { icono: 'ClipboardList', termino: 'URS', definicion: 'Especificación de requerimientos de usuario: qué necesita el usuario del equipo (capacidad, rango, materiales, controles, limpieza). Es el punto de partida y contra ella se compara todo.' },
      { icono: 'FileSearch', termino: 'DQ: calificación de diseño', definicion: 'Verificación documentada de que el diseño propuesto por el proveedor cumple la URS y las BPM, antes de comprar o construir.' },
      { icono: 'Wrench', termino: 'IQ: calificación de instalación', definicion: 'Comprueba que el equipo llegó y se instaló como se especificó: componentes, materiales, conexiones, calibraciones iniciales, manuales y planos.' },
      { icono: 'Gauge', termino: 'OQ: calificación de operación', definicion: 'Demuestra que el equipo opera según lo previsto en todo el rango de operación, incluidas las condiciones límite, alarmas y controles.' },
      { icono: 'Factory', termino: 'PQ: calificación de desempeño', definicion: 'Demuestra que el equipo rinde de forma consistente en condiciones reales de uso, con el producto o un sustituto representativo y los procedimientos de rutina.' },
      { icono: 'Truck', termino: 'FAT y SAT', definicion: 'Pruebas de aceptación en fábrica y en sitio. Pueden aportar evidencia a la IQ y la OQ si se ejecutan con protocolo y se evalúan, pero no reemplazan la calificación.' },
    ],
    mapa: {
      centro: 'Calificación de un equipo',
      ramas: [
        { titulo: 'Antes de comprar', icono: 'ClipboardList', nodos: ['URS aprobada', 'DQ contra la URS', 'Análisis de riesgo del diseño'] },
        { titulo: 'Al llegar', icono: 'Truck', nodos: ['FAT y SAT con protocolo', 'IQ: lo instalado coincide con lo especificado', 'Calibraciones iniciales'] },
        { titulo: 'En operación', icono: 'Gauge', nodos: ['OQ en todo el rango', 'Pruebas de alarmas y seguridades', 'Condiciones límite'] },
        { titulo: 'En uso real', icono: 'Factory', nodos: ['PQ con producto o sustituto', 'Procedimientos de rutina', 'Consistencia en el tiempo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué demuestra cada etapa',
        parrafos: [
          'Todo empieza con la **URS**. Si el usuario no escribe que necesita comprimir entre 80.000 y 150.000 tabletas por hora, con control automático de peso y partes en contacto en acero 316L, nadie puede verificar después que el equipo lo cumpla. La **DQ** compara la propuesta del proveedor con esa URS y con los requisitos de BPM, como la facilidad de limpieza o la ausencia de lubricantes en contacto con el producto.',
          'La **IQ** responde a la pregunta «¿llegó e instalé lo que compré?»: modelo y serie, materiales con sus certificados, conexiones a servicios, planos, manuales, listas de repuestos, software y versión, e instrumentos calibrados. La **OQ** responde «¿funciona en todo su rango?»: velocidades mínima y máxima, controles de fuerza, alarmas, paradas de emergencia, enclavamientos y respuesta ante fallas. Las pruebas de la OQ suelen hacerse sin producto o con condiciones de reto.',
          'La **PQ** responde «¿rinde de forma consistente cuando lo uso como lo voy a usar?». Se ejecuta con el producto real o un material representativo, con el personal y los procedimientos de rutina, y durante el tiempo suficiente para ver variabilidad. Por eso los criterios de la OQ y de la PQ son distintos: la OQ verifica la máquina; la PQ verifica la máquina trabajando en tu planta.',
        ],
      },
      {
        titulo: 'Riesgo, proveedores y equipos ya instalados',
        parrafos: [
          'No todos los equipos requieren la misma profundidad. Con un análisis de riesgo según ICH Q9(R1), un agitador de laboratorio sin impacto directo en el producto puede tener una calificación simple, mientras que un liofilizador exige un programa extenso. El Anexo 15 permite apoyarse en la documentación del proveedor y en las pruebas FAT y SAT, siempre que se revisen, se aprueben y se justifique por qué son representativas.',
          '¿Y si el equipo ya estaba instalado y funcionando sin calificación? Es una situación frecuente en plantas antiguas. La respuesta no es fingir una DQ retroactiva, sino documentar honestamente la situación: reconstruir la URS a partir del uso actual, verificar la instalación tal como está, ejecutar la OQ y la PQ, y gestionar el hallazgo con una evaluación de impacto sobre los lotes fabricados.',
          'Un último punto: la calificación no termina con la PQ. El equipo queda en estado calificado mientras se mantenga bajo control de cambios, mantenimiento preventivo, calibración y revisión periódica. Si algo de eso falla, el estado se pierde aunque el informe siga archivado.',
        ],
      },
    ],
    proceso: {
      titulo: 'Secuencia de calificación de un equipo nuevo',
      pasos: [
        { titulo: 'Escribir la URS', detalle: 'El usuario, con ingeniería y calidad, define capacidad, rangos, materiales, controles, limpieza, seguridad y requisitos de datos.', icono: 'ClipboardList', evidencia: 'URS aprobada.' },
        { titulo: 'Ejecutar la DQ', detalle: 'Compara el diseño del proveedor contra cada requisito de la URS y de BPM, y registra las brechas y cómo se resuelven.', icono: 'FileSearch', evidencia: 'Informe de DQ con matriz de trazabilidad.' },
        { titulo: 'Pruebas FAT y SAT', detalle: 'Verifica en fábrica y en sitio funciones clave con un protocolo acordado; decide qué pruebas aportan evidencia a la IQ y la OQ.', icono: 'Truck', evidencia: 'Protocolos e informes FAT y SAT revisados.' },
        { titulo: 'Ejecutar la IQ', detalle: 'Comprueba componentes, materiales, conexiones, documentación, software y calibraciones iniciales contra lo especificado.', icono: 'Wrench', evidencia: 'Informe de IQ aprobado.' },
        { titulo: 'Ejecutar la OQ', detalle: 'Prueba el equipo en todo su rango de operación, incluidas condiciones límite, alarmas y enclavamientos.', icono: 'Gauge', evidencia: 'Informe de OQ con datos y desviaciones cerradas.' },
        { titulo: 'Ejecutar la PQ', detalle: 'Demuestra el desempeño consistente con producto o sustituto, personal y procedimientos de rutina.', icono: 'Factory', evidencia: 'Informe de PQ y liberación para uso.' },
        { titulo: 'Mantener el estado', detalle: 'Integra el equipo al mantenimiento preventivo, a la calibración, al control de cambios y a la revisión periódica.', icono: 'RefreshCw', evidencia: 'Programa de mantenimiento y registro de cambios.' },
      ],
    },
    caso: {
      titulo: 'Criterios de OQ y PQ para una tableteadora',
      contexto: 'Estás redactando el protocolo de la tableteadora nueva. Un colega propone usar el mismo criterio en OQ y PQ: «el peso de las tabletas debe estar dentro de ±5 %».',
      pregunta: '¿Qué ajuste propones?',
      opciones: [
        { texto: 'Dejar el mismo criterio en ambas etapas, porque así es más fácil de ejecutar.', correcta: false, retro: 'Si los criterios son iguales, una de las dos etapas sobra o está mal diseñada. La OQ y la PQ responden preguntas diferentes.' },
        { texto: 'En la OQ, verificar velocidades, control de fuerza, alarmas y respuesta del sistema de control de peso en todo el rango; en la PQ, demostrar uniformidad de peso, dureza y friabilidad del producto real durante varias corridas de rutina.', correcta: true, retro: 'La OQ prueba la máquina y sus controles; la PQ prueba el desempeño consistente con el producto y las condiciones reales. Criterios distintos para preguntas distintas.' },
        { texto: 'Eliminar la OQ y hacer solo la PQ con producto.', correcta: false, retro: 'Sin OQ no sabes si los controles y las alarmas funcionan en los extremos, que son justamente donde ocurren las fallas.' },
      ],
    },
    errores: [
      { error: 'Calificar sin URS o con una URS copiada del catálogo del proveedor.', correccion: 'La URS la escribe el usuario a partir de su proceso; el catálogo describe lo que vende el proveedor, no lo que necesitas.' },
      { error: 'Aceptar los documentos del proveedor sin revisarlos.', correccion: 'Revísalos, apruébalos y justifica su uso; calidad sigue siendo responsable de la decisión.' },
      { error: 'PQ de un solo día con el mejor operario.', correccion: 'La PQ debe reflejar la rutina: turnos, personal habitual y duración suficiente para ver variabilidad.' },
      { error: 'Liberar el equipo antes de cerrar las desviaciones de la OQ.', correccion: 'Cada desviación se investiga y se cierra, o se justifica su impacto, antes de pasar a la etapa siguiente.' },
    ],
    comprueba: [
      { pregunta: '¿Qué documento es la base de la DQ?', respuesta: 'La URS, la especificación de requerimientos de usuario.' },
      { pregunta: '¿Qué diferencia la OQ de la PQ?', respuesta: 'La OQ demuestra que el equipo opera en todo su rango, incluidas alarmas y límites; la PQ demuestra un desempeño consistente en condiciones reales de uso.' },
      { pregunta: '¿Pueden las pruebas FAT y SAT reemplazar la IQ y la OQ?', respuesta: 'No las reemplazan, pero pueden aportar evidencia si se ejecutan con protocolo, se revisan y se justifica que son representativas.' },
      { pregunta: '¿Qué haces con un equipo que ya estaba instalado sin calificar?', respuesta: 'Documentas la situación, reconstruyes la URS, verificas la instalación existente, ejecutas OQ y PQ, y evalúas el impacto sobre lo fabricado.' },
    ],
    resumen: [
      '**URS → DQ → IQ → OQ → PQ**: cada etapa responde una pregunta distinta.',
      'La OQ prueba la máquina en todo su rango; la PQ prueba el desempeño real y consistente.',
      'El análisis de riesgo define la profundidad; la documentación del proveedor ayuda, pero no decide.',
      'El estado calificado se mantiene con mantenimiento, calibración y control de cambios.',
    ],
    referencias: [REF.picsAnexo15, REF.trs1019a3, REF.ichQ9, REF.res1160],
    imagenes: [
      { ubicacion: 'Al inicio de la lectura', descripcion: 'Línea de tiempo horizontal con cinco hitos (URS, DQ, IQ, OQ, PQ) sobre una tableteadora estilizada, iconos de documento, llave, medidor y fábrica, en azul y turquesa.', alt: 'Línea de tiempo de la calificación de una tableteadora: URS, DQ, IQ, OQ y PQ' },
      { ubicacion: 'Junto al caso', descripcion: 'Tabla visual de dos columnas comparando pruebas de OQ (velocidad, alarmas, rango) y de PQ (peso, dureza, friabilidad con producto real).', alt: 'Comparación de pruebas de OQ y PQ en una tableteadora' },
    ],
    keywords: ['dq iq oq pq', 'qué es iq oq pq', 'calificación de instalación operación y desempeño', 'calificación de diseño dq', 'urs especificación de requerimientos de usuario', 'diferencia entre oq y pq', 'calificación de equipos farmacéuticos pdf', 'protocolo de calificación de equipos', 'fat y sat calificación', 'calificación de una tableteadora', 'iq oq pq ejemplos', 'calificación de equipos según anexo 15'],
  },

  {
    titulo: 'Sistemas críticos: agua, aire y vapor',
    duracion: 35,
    gancho: {
      titulo: 'El ingrediente que no aparece en la fórmula',
      texto: 'En la orden de producción de un jarabe aparece «agua purificada c. s. p. 100 mL». Es el componente de mayor proporción del producto y, sin embargo, nadie la pesa en una balanza calibrada ni la compra a un proveedor calificado: sale de una tubería. Lo mismo pasa con el aire que rodea el producto abierto y con el vapor que esteriliza. Por eso estos sistemas se tratan como parte del producto y su calificación nunca termina del todo.',
    },
    objetivos: [
      'Explicar por qué el agua, el aire (HVAC) y el vapor puro son sistemas críticos.',
      'Describir la calificación por fases de un sistema de agua farmacéutica.',
      'Identificar las pruebas clave de calificación de un sistema HVAC y de vapor puro.',
      'Proponer qué monitorear después de la calificación y con qué lógica.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Agua para uso farmacéutico', definicion: 'Agua purificada y agua para inyectables, con especificaciones farmacopeicas de conductividad, carbono orgánico total (COT) y calidad microbiológica. El agua para inyectables también controla endotoxinas.' },
      { icono: 'Wind', termino: 'Sistema HVAC', definicion: 'Calefacción, ventilación y aire acondicionado que controla presiones diferenciales, filtración, renovaciones de aire, temperatura y humedad para proteger el producto y a las personas.' },
      { icono: 'Thermometer', termino: 'Vapor puro', definicion: 'Vapor cuyo condensado cumple la calidad del agua para inyectables. Se usa para esterilizar equipos y cargas; se verifica su calidad y sus propiedades físicas.' },
      { icono: 'Filter', termino: 'Filtro HEPA', definicion: 'Filtro de alta eficiencia que retiene partículas del aire. Su integridad se verifica con pruebas de fuga después de instalarlo y con la frecuencia definida.' },
      { icono: 'CalendarClock', termino: 'Calificación por fases', definicion: 'Para el agua, la OMS describe tres fases de monitoreo intensivo y prolongado que permiten ver la variación estacional antes de declarar el sistema bajo control.' },
    ],
    mapa: {
      centro: 'Sistemas de apoyo que tocan el producto',
      ramas: [
        { titulo: 'Agua', icono: 'Droplets', nodos: ['Generación, almacenamiento y distribución', 'Conductividad, COT y microbiología', 'Endotoxinas en agua para inyectables', 'Calificación en tres fases'] },
        { titulo: 'Aire (HVAC)', icono: 'Wind', nodos: ['Presiones diferenciales', 'Integridad de filtros HEPA', 'Clasificación por partículas', 'Visualización de flujo y recuperación'] },
        { titulo: 'Vapor puro', icono: 'Thermometer', nodos: ['Condensado con calidad de agua para inyectables', 'Gases no condensables, sobrecalentamiento y sequedad', 'Puntos de uso'] },
        { titulo: 'Después de calificar', icono: 'LineChart', nodos: ['Monitoreo con límites de alerta y acción', 'Tendencias y estacionalidad', 'Mantenimiento y sanitización'] },
      ],
    },
    secciones: [
      {
        titulo: 'El agua: un sistema vivo',
        parrafos: [
          'Un sistema de agua farmacéutica tiene tres partes: **generación** (por ejemplo, pretratamiento, ósmosis inversa y electrodesionización para el agua purificada), **almacenamiento** y **distribución** en un circuito que recircula hacia los puntos de uso. El riesgo principal no es químico sino microbiológico: el agua estancada, las zonas muertas y las temperaturas favorables permiten que se formen biopelículas que después liberan bacterias y endotoxinas.',
          'La guía de la OMS sobre agua para uso farmacéutico (TRS 1033, Anexo 3, de 2021) describe una calificación en **tres fases**. En la fase 1, de dos a cuatro semanas, se muestrea con alta frecuencia todos los puntos para establecer los rangos de operación y los procedimientos. En la fase 2, de duración similar, se confirma que el sistema opera de forma consistente con esos procedimientos. En la fase 3, que dura un año, se demuestra el desempeño a lo largo de las variaciones estacionales del agua de alimentación.',
          'Las especificaciones vienen de la farmacopea: conductividad y carbono orgánico total para la calidad química, recuento microbiano con límites de alerta y de acción, y endotoxinas para el agua para inyectables. La guía de la OMS acepta hoy métodos distintos de la destilación para producir agua para inyectables, siempre que el sistema esté validado. Después de la calificación, el monitoreo de rutina con análisis de tendencias es lo que mantiene el estado calificado.',
        ],
      },
      {
        titulo: 'El aire y el vapor',
        parrafos: [
          'El sistema **HVAC** protege el producto de la contaminación por partículas y microorganismos, evita la contaminación cruzada entre áreas y protege al personal de productos potentes. Su calificación incluye el caudal y las renovaciones de aire, las **presiones diferenciales** entre áreas (para estériles, el Anexo 1 orienta una diferencia del orden de 10 a 15 pascales entre grados adyacentes), la **integridad de los filtros HEPA** con prueba de fuga, la **clasificación** por conteo de partículas según ISO 14644-1, los estudios de visualización de flujo y el tiempo de recuperación tras una contaminación.',
          'Para productos no estériles, la guía de la OMS sobre HVAC (TRS 1010, Anexo 8) explica cómo diseñar cascadas de presión, esclusas y extracción localizada según el producto. La clave es que el diseño responda al riesgo: un área de pesada de un producto potente necesita contención, no solo aire limpio.',
          'El **vapor puro** se califica verificando que su condensado cumpla la calidad del agua para inyectables y que sus propiedades físicas permitan esterilizar: contenido de gases no condensables, grado de sobrecalentamiento y valor de sequedad, medidos en los puntos de uso. Un vapor con demasiados gases no condensables o demasiado húmedo puede dejar puntos fríos en una carga aunque el manómetro marque la presión correcta.',
        ],
      },
    ],
    proceso: {
      titulo: 'Calificación de un sistema de agua purificada',
      pasos: [
        { titulo: 'Diseño y URS', detalle: 'Define calidad requerida, demanda en puntos de uso, materiales sanitarios, recirculación, pendientes de drenaje y estrategia de sanitización.', icono: 'ClipboardList', evidencia: 'URS y DQ del sistema.' },
        { titulo: 'IQ del sistema', detalle: 'Verifica materiales, soldaduras, pendientes, zonas muertas, instrumentos calibrados y planos conforme a obra.', icono: 'Wrench', evidencia: 'Informe de IQ con planos conforme a obra.' },
        { titulo: 'OQ del sistema', detalle: 'Prueba caudales, velocidades de recirculación, alarmas, sanitización y funcionamiento de cada etapa de purificación.', icono: 'Gauge', evidencia: 'Informe de OQ.' },
        { titulo: 'Fase 1 de PQ (2 a 4 semanas)', detalle: 'Muestreo intensivo diario de todos los puntos para establecer rangos y procedimientos de operación y sanitización.', icono: 'Search', evidencia: 'Resultados diarios y procedimientos ajustados.' },
        { titulo: 'Fase 2 de PQ (2 a 4 semanas)', detalle: 'Confirma la operación consistente siguiendo los procedimientos ya aprobados; el agua puede empezar a usarse según la estrategia definida.', icono: 'ClipboardCheck', evidencia: 'Informe de fase 2.' },
        { titulo: 'Fase 3 de PQ (1 año)', detalle: 'Demuestra el desempeño durante las variaciones estacionales con el plan de muestreo de rutina.', icono: 'CalendarClock', evidencia: 'Informe anual con tendencias.' },
        { titulo: 'Monitoreo de rutina', detalle: 'Mantén límites de alerta y acción, analiza tendencias y gestiona excursiones con investigación y acciones.', icono: 'LineChart', evidencia: 'Tendencias e investigaciones documentadas.' },
      ],
    },
    caso: {
      titulo: 'El recuento que sube en invierno… y en marzo',
      contexto: 'En la fase 3 de un sistema de agua purificada, el recuento microbiano en el punto de uso más lejano supera el límite de alerta dos veces en marzo, aunque sigue por debajo del límite de acción. La conductividad y el COT están bien.',
      pregunta: '¿Cuál es la mejor respuesta?',
      opciones: [
        { texto: 'No hacer nada, porque no se superó el límite de acción.', correcta: false, retro: 'El límite de alerta existe para reaccionar antes del problema. Ignorarlo desperdicia la señal temprana.' },
        { texto: 'Investigar la tendencia: revisar la sanitización, la recirculación y la temperatura en ese ramal, el muestreo y el agua de alimentación; documentar y, si aplica, ajustar la frecuencia de sanitización.', correcta: true, retro: 'La fase 3 existe precisamente para ver estacionalidad y ajustar el control. Una investigación ordenada protege el sistema antes de llegar al límite de acción.' },
        { texto: 'Repetir la muestra hasta obtener un resultado bajo el límite.', correcta: false, retro: 'Muestrear hasta cumplir es una práctica que ningún auditor acepta y que oculta el problema real.' },
      ],
    },
    errores: [
      { error: 'Declarar el sistema de agua calificado al terminar la fase 2.', correccion: 'La fase 3 de un año es parte de la calificación porque revela la variación estacional.' },
      { error: 'Ramales con zonas muertas o sin recirculación.', correccion: 'Diseña con recirculación continua, pendientes de drenaje y zonas muertas mínimas, y verifícalo en la IQ.' },
      { error: 'Medir la presión diferencial solo en la calificación.', correccion: 'Monitoréala de forma continua o con la frecuencia definida, con alarmas y registro de excursiones.' },
      { error: 'Esterilizar con vapor sin verificar su calidad en los puntos de uso.', correccion: 'Mide gases no condensables, sobrecalentamiento y sequedad, y la calidad del condensado, donde realmente se usa.' },
    ],
    comprueba: [
      { pregunta: '¿Cuánto dura cada fase de la calificación de un sistema de agua según la OMS?', respuesta: 'Fase 1 y fase 2, de dos a cuatro semanas cada una; fase 3, un año.' },
      { pregunta: 'Menciona tres pruebas de calificación de un sistema HVAC.', respuesta: 'Presiones diferenciales, integridad de filtros HEPA y clasificación por conteo de partículas. También caudal, renovaciones de aire, visualización de flujo y recuperación.' },
      { pregunta: '¿Qué propiedades físicas del vapor puro se verifican?', respuesta: 'Gases no condensables, sobrecalentamiento y sequedad, además de la calidad del condensado.' },
    ],
    resumen: [
      'El agua, el aire y el vapor **son parte del producto**: se califican como sistemas críticos.',
      'El agua se califica en **tres fases**; la tercera dura un año y revela la estacionalidad.',
      'HVAC: presiones, HEPA, partículas, flujo y recuperación.',
      'Después de calificar, el **monitoreo con tendencias** mantiene el estado calificado.',
    ],
    referencias: [REF.trs1033a3, REF.trs1010a8, REF.euAnexo1, REF.trs1044a2, REF.trs986a2, REF.picsAnexo15],
    imagenes: [
      { ubicacion: 'Al inicio de la sección del agua', descripcion: 'Esquema isométrico de un circuito de agua purificada: pretratamiento, ósmosis inversa, tanque, bomba, intercambiador y anillo de distribución con puntos de uso numerados, en azul y turquesa con fondo blanco.', alt: 'Esquema de un sistema de agua purificada con anillo de recirculación' },
      { ubicacion: 'En la sección del aire', descripcion: 'Plano de planta con cascada de presiones: áreas coloreadas por grado y flechas de flujo de aire de mayor a menor presión, con valores en pascales.', alt: 'Cascada de presiones diferenciales entre áreas limpias' },
    ],
    keywords: ['calificación de sistemas de agua farmacéutica', 'fases de calificación del agua purificada', 'agua para uso farmacéutico oms', 'calificación de sistemas hvac', 'presiones diferenciales áreas limpias', 'prueba de integridad filtros hepa', 'calificación de vapor puro', 'sistemas críticos industria farmacéutica', 'agua purificada especificaciones', 'trs 1033 anexo 3', 'hvac farmacéutico calificación', 'monitoreo de agua purificada'],
  },

  {
    titulo: 'Protocolos, desviaciones y recalificación',
    duracion: 30,
    gancho: {
      titulo: 'El protocolo que nunca falló',
      texto: 'Revisando los archivos para una auditoría, encuentras doce protocolos de calificación de los últimos tres años. Ninguno tiene una sola desviación. Todos los resultados están justo dentro de los criterios. A primera vista parece excelencia. A un inspector experimentado le parece otra cosa: o los criterios eran demasiado amplios, o las desviaciones no se documentaron. Un protocolo que nunca falla suele ser un protocolo mal diseñado.',
    },
    objetivos: [
      'Estructurar un protocolo de calificación ejecutable y defendible.',
      'Gestionar una desviación durante la ejecución de un protocolo, de la detección al cierre.',
      'Definir cuándo y cómo recalificar con base en cambios y revisión periódica.',
      'Aplicar los principios de integridad de datos a los registros de calificación.',
    ],
    conceptos: [
      { icono: 'FileText', termino: 'Protocolo', definicion: 'Documento aprobado antes de ejecutar que define objetivo, alcance, responsabilidades, prerrequisitos, pruebas, métodos, criterios de aceptación y cómo se gestionarán las desviaciones.' },
      { icono: 'AlertTriangle', termino: 'Desviación del protocolo', definicion: 'Cualquier resultado fuera de criterio o cualquier ejecución distinta de lo aprobado. Se registra, se investiga, se evalúa su impacto y se decide con calidad.' },
      { icono: 'GitBranch', termino: 'Control de cambios', definicion: 'El proceso del sistema de calidad (ICH Q10) que evalúa el impacto de un cambio sobre el estado calificado o validado antes de implementarlo.' },
      { icono: 'RefreshCw', termino: 'Recalificación', definicion: 'Repetición total o parcial de la calificación por un cambio, por una tendencia adversa o por la revisión periódica que la indique.' },
      { icono: 'Fingerprint', termino: 'Integridad de datos', definicion: 'Registros atribuibles, legibles, contemporáneos, originales y exactos (ALCOA+). Aplica a cada dato de un protocolo, en papel o electrónico.' },
    ],
    mapa: {
      centro: 'Un protocolo que resiste una auditoría',
      ramas: [
        { titulo: 'Antes', icono: 'FileText', nodos: ['Objetivo y alcance claros', 'Criterios definidos y justificados', 'Prerrequisitos verificados', 'Aprobación de calidad'] },
        { titulo: 'Durante', icono: 'ClipboardCheck', nodos: ['Datos contemporáneos (ALCOA+)', 'Desviaciones registradas al momento', 'Sin cambios no autorizados'] },
        { titulo: 'Después', icono: 'FileCheck', nodos: ['Informe con conclusión explícita', 'Desviaciones cerradas o justificadas', 'Estado: calificado o no'] },
        { titulo: 'En el tiempo', icono: 'RefreshCw', nodos: ['Control de cambios', 'Revisión periódica', 'Recalificación basada en riesgo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Anatomía de un protocolo ejecutable',
        parrafos: [
          'Un protocolo debe poder ejecutarlo alguien que no lo escribió. Para eso necesita: objetivo y alcance (qué equipo o sistema, con identificación única), responsabilidades, referencias normativas, **prerrequisitos** (por ejemplo, instrumentos calibrados, procedimientos aprobados, personal entrenado), la descripción paso a paso de cada prueba, el método de medición, los **criterios de aceptación** con su justificación y la forma de registrar resultados y desviaciones.',
          'Los criterios deben salir de la URS, de las especificaciones del proveedor, de la farmacopea o de la necesidad del proceso, y deben ser **medibles**. «El equipo funciona correctamente» no es un criterio; «la temperatura de cada sensor se mantiene entre 115 y 118 °C durante la fase de exposición» sí lo es. Si un criterio es tan amplio que nada podría incumplirlo, el protocolo no está probando nada.',
          'Los registros se hacen en el momento, por quien ejecuta, con la firma de quien verifica cuando aplica. Los principios de integridad de datos —que los registros sean atribuibles, legibles, contemporáneos, originales y exactos, además de completos, consistentes, perdurables y disponibles— se aplican a un formato en papel igual que a un sistema electrónico.',
        ],
      },
      {
        titulo: 'Cuando algo no se cumple',
        parrafos: [
          'Una desviación no es un fracaso: es información. Lo grave es no registrarla. Cuando un resultado sale de criterio, la ejecución se detiene en ese punto, se documenta qué pasó, se notifica a calidad y se investiga la causa: ¿falla del equipo, error de ejecución, instrumento descalibrado o criterio mal planteado? Según la causa, se corrige y se repite la prueba, se acepta con justificación técnica o se rechaza la calificación.',
          'Hay dos tentaciones que hay que evitar: repetir la prueba hasta que pase sin investigar, y modificar el criterio después de ver el dato sin un análisis documentado. Si de verdad el criterio estaba mal planteado, se corrige mediante una enmienda aprobada del protocolo, con su justificación y antes de repetir la prueba.',
          'La **recalificación** se decide en dos escenarios. El primero es el control de cambios: un cambio en el equipo, su software, su ubicación o su uso se evalúa para saber si afecta el estado calificado. El segundo es la revisión periódica: con los datos de mantenimiento, calibraciones, desviaciones y tendencias, se decide si el equipo sigue en estado calificado o si hace falta repetir pruebas. El Anexo 15 pide que los equipos, instalaciones, servicios y sistemas se evalúen con una frecuencia adecuada para confirmar que siguen bajo control.',
        ],
      },
    ],
    proceso: {
      titulo: 'Gestión de una desviación durante la calificación',
      pasos: [
        { titulo: 'Detener y registrar', detalle: 'Detén la prueba afectada y registra de inmediato el resultado, la hora, quién lo detectó y las condiciones.', icono: 'Hand', evidencia: 'Registro de la desviación en el protocolo.' },
        { titulo: 'Notificar a calidad', detalle: 'Informa a aseguramiento de calidad antes de tomar decisiones sobre repetir, ajustar o continuar.', icono: 'Users', evidencia: 'Notificación con fecha y hora.' },
        { titulo: 'Investigar la causa', detalle: 'Revisa equipo, instrumentos, método, ejecución y criterio. Usa herramientas como los cinco porqués o el diagrama de causa y efecto.', icono: 'Search', evidencia: 'Investigación documentada.' },
        { titulo: 'Evaluar el impacto', detalle: 'Determina si la desviación afecta otras pruebas, otros equipos o lotes ya fabricados.', icono: 'AlertTriangle', evidencia: 'Evaluación de impacto.' },
        { titulo: 'Decidir y corregir', detalle: 'Corrige la causa, repite la prueba o acepta con justificación técnica; si el criterio estaba mal, enmienda el protocolo antes de repetir.', icono: 'CheckCircle2', evidencia: 'Decisión aprobada y enmienda si aplica.' },
        { titulo: 'Cerrar en el informe', detalle: 'El informe final lista cada desviación, su causa, su resolución y su impacto en la conclusión.', icono: 'FileCheck', evidencia: 'Informe aprobado con desviaciones cerradas.' },
      ],
    },
    caso: {
      titulo: 'El sensor que marcó 2 °C de más',
      contexto: 'Durante la OQ de una cámara de estabilidad a 30 °C / 75 % HR, uno de los nueve sensores de mapeo registra 32,4 °C durante una hora; el criterio es 30 ± 2 °C. Los demás sensores cumplen. Producción presiona para cerrar porque «es solo un sensor».',
      pregunta: '¿Qué haces?',
      opciones: [
        { texto: 'Excluir el sensor del análisis porque probablemente estaba mal.', correcta: false, retro: 'Excluir datos sin evidencia es una falla grave de integridad. Si el sensor estaba mal, hay que demostrarlo.' },
        { texto: 'Registrar la desviación, verificar la calibración del sensor y su ubicación, investigar si hay un punto caliente real (cerca del evaporador o de la puerta) y decidir con calidad: corregir y repetir el mapeo o restringir esa zona de la cámara.', correcta: true, retro: 'Es la gestión correcta: dato registrado, causa investigada, impacto evaluado y decisión documentada. Si hay un punto caliente real, la cámara no puede usar esa zona para estudios de estabilidad.' },
        { texto: 'Ampliar el criterio a ±3 °C para que todos los sensores cumplan.', correcta: false, retro: 'Cambiar el criterio después de ver el dato invalida la prueba. Además, ±2 °C es la tolerancia habitual de las condiciones de estabilidad.' },
      ],
    },
    errores: [
      { error: 'Repetir una prueba hasta que pase, sin investigar.', correccion: 'Toda repetición debe estar precedida por una investigación y una decisión documentada.' },
      { error: 'Firmar el protocolo como ejecutado días después.', correccion: 'Los registros son contemporáneos: se firman en el momento de la ejecución.' },
      { error: 'Cambiar el software del equipo sin pasar por control de cambios.', correccion: 'Todo cambio que pueda afectar el estado calificado se evalúa antes de implementarse.' },
      { error: 'Informe final sin conclusión explícita.', correccion: 'El informe debe declarar si el equipo queda calificado, con restricciones o no calificado.' },
    ],
    comprueba: [
      { pregunta: '¿Qué significa que un registro sea contemporáneo?', respuesta: 'Que se registra en el momento en que ocurre la actividad, no después.' },
      { pregunta: '¿Cuándo se puede corregir un criterio de aceptación?', respuesta: 'Solo con una enmienda aprobada del protocolo, justificada técnicamente y antes de repetir la prueba, nunca para acomodar un dato.' },
      { pregunta: '¿Qué dos mecanismos disparan una recalificación?', respuesta: 'El control de cambios y la revisión periódica del estado de equipos y sistemas.' },
    ],
    resumen: [
      'Un buen protocolo tiene **criterios medibles y justificados** definidos antes de ejecutar.',
      'Las desviaciones se registran, se investigan y se cierran: **no se ocultan**.',
      'La recalificación se decide con **control de cambios y revisión periódica**.',
      'ALCOA+ aplica a cada dato del protocolo.',
    ],
    referencias: [REF.picsAnexo15, REF.ichQ10, REF.fdaIntegridad, REF.picsPi041, REF.trs1019a3],
    imagenes: [
      { ubicacion: 'Junto a la anatomía del protocolo', descripcion: 'Documento ilustrado abierto con secciones resaltadas (objetivo, prerrequisitos, pruebas, criterios, desviaciones) y etiquetas de color de marca.', alt: 'Anatomía de un protocolo de calificación' },
    ],
    keywords: ['protocolo de calificación', 'cómo hacer un protocolo de calificación', 'desviaciones en validación', 'gestión de desviaciones en protocolos', 'recalificación de equipos', 'cuándo recalificar un equipo', 'control de cambios farmacéutico', 'informe de calificación', 'alcoa+ integridad de datos', 'criterios de aceptación protocolo', 'mapeo de temperatura cámara de estabilidad'],
  },

  // ── Unidad 3 · Validación de procesos, limpieza y métodos ──────
  {
    titulo: 'Validación de procesos',
    duracion: 35,
    gancho: {
      titulo: 'El lote que cumplió… por casualidad',
      texto: 'Un comprimido de liberación inmediata cumple todas las especificaciones lote tras lote. Un día, con un granulado un poco más húmedo, la disolución cae. Al revisar, nadie sabía cuánto podía variar la humedad del granulado sin afectar la disolución: el proceso cumplía, pero nadie entendía por qué. Validar un proceso es demostrar que cumple porque está bajo control, no por suerte.',
    },
    objetivos: [
      'Relacionar parámetros críticos del proceso con atributos críticos de calidad.',
      'Diseñar la estrategia de una calificación del desempeño del proceso (PPQ).',
      'Distinguir validación prospectiva, concurrente y verificación continua.',
      'Plantear la verificación continua con herramientas estadísticas simples.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'Atributo crítico de calidad (CQA)', definicion: 'Propiedad física, química, biológica o microbiológica que debe estar dentro de un límite para asegurar la calidad del producto: por ejemplo, disolución, contenido o uniformidad.' },
      { icono: 'Settings', termino: 'Parámetro crítico del proceso (CPP)', definicion: 'Parámetro cuya variación impacta un atributo crítico de calidad y que por eso debe monitorearse o controlarse: por ejemplo, tiempo de mezcla, humedad final del granulado o fuerza de compresión.' },
      { icono: 'Factory', termino: 'PPQ', definicion: 'Calificación del desempeño del proceso: lotes a escala comercial, con protocolo, muestreo ampliado y criterios que demuestran la reproducibilidad del proceso.' },
      { icono: 'Timer', termino: 'Validación concurrente', definicion: 'Excepción en la que los lotes de validación se liberan antes de completar el estudio, por necesidad justificada, como un riesgo de desabastecimiento. Requiere aprobación y justificación documentadas.' },
      { icono: 'BarChart3', termino: 'Índice de capacidad', definicion: 'Medida estadística (como Cpk) de qué tan holgadamente cumple un proceso sus especificaciones. Ayuda a decidir si el proceso es robusto o solo cumple por poco.' },
    ],
    mapa: {
      centro: 'Validar un proceso de fabricación',
      ramas: [
        { titulo: 'Conocimiento', icono: 'Lightbulb', nodos: ['Atributos críticos de calidad', 'Parámetros críticos del proceso', 'Análisis de riesgo'] },
        { titulo: 'Estrategia', icono: 'Route', nodos: ['Prospectiva (lo habitual)', 'Concurrente (excepción justificada)', 'Verificación continua'] },
        { titulo: 'PPQ', icono: 'Factory', nodos: ['Equipos calificados', 'Muestreo ampliado por etapa', 'Criterios intra e interlote'] },
        { titulo: 'Rutina', icono: 'LineChart', nodos: ['Cartas de control', 'Capacidad del proceso', 'Revisión periódica'] },
      ],
    },
    secciones: [
      {
        titulo: 'De los atributos a los parámetros',
        parrafos: [
          'Validar empieza por saber qué se protege. Para un comprimido de liberación inmediata fabricado por granulación húmeda, los **atributos críticos** suelen ser contenido, uniformidad de unidades de dosificación, disolución, impurezas y, según el caso, dureza y friabilidad. Luego se busca qué **parámetros** los afectan: la cantidad y velocidad de adición de la solución aglutinante, el tiempo de amasado, la temperatura y el punto final del secado, el tamaño del tamiz, el tiempo de mezcla final y la fuerza de compresión.',
          'No todo parámetro es crítico. Con ICH Q9(R1) y datos de desarrollo se decide cuáles impactan de verdad un atributo. Un parámetro crítico se controla con límites definidos y se monitorea; uno no crítico se fija con criterios operativos. Esta jerarquía evita protocolos inflados que miden todo y no explican nada.',
          'El resultado es la **estrategia de control**: especificaciones de materias primas, rangos de operación de los parámetros críticos, controles en proceso (por ejemplo, humedad por pérdida por secado, peso y dureza durante la compresión) y especificaciones del producto terminado. La validación demuestra que esa estrategia funciona.',
        ],
      },
      {
        titulo: 'Cómo se diseña la PPQ',
        parrafos: [
          'La PPQ se ejecuta con equipos y sistemas calificados, personal entrenado, procedimientos aprobados y materiales de proveedores calificados. El protocolo define el número de lotes y su justificación, los parámetros a registrar, el **plan de muestreo ampliado** (más muestras y en más puntos que la rutina, por ejemplo uniformidad de mezcla en varios puntos del mezclador y muestreo estratificado durante la compresión) y los criterios de aceptación intra lote e inter lote.',
          'El Anexo 15 indica que, en la validación tradicional, generalmente se considera aceptable un mínimo de tres lotes consecutivos en condiciones de rutina, pero exige justificar el número. La guía de la FDA de 2011 dejó de fijar un número y pide que se justifique estadísticamente. La validación **prospectiva**, en la que los lotes se liberan después de completar el estudio, es la norma. La **concurrente** es una excepción que debe justificarse, por ejemplo por necesidad de salud pública.',
          'Después de la PPQ viene la **etapa 3**. Con los datos de rutina se construyen cartas de control de los atributos y parámetros clave y se calcula la capacidad del proceso. Un índice de capacidad bajo o una tendencia que se acerca al límite son señales para investigar antes de que aparezca un lote fuera de especificación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Validación de un proceso de granulación húmeda',
      pasos: [
        { titulo: 'Definir atributos críticos', detalle: 'Contenido, uniformidad de unidades de dosificación, disolución, impurezas, dureza y friabilidad, con sus especificaciones.', icono: 'Target', evidencia: 'Perfil de calidad del producto.' },
        { titulo: 'Mapear parámetros críticos', detalle: 'Relaciona cada etapa (mezcla, granulación, secado, tamizado, mezcla final, compresión) con los atributos que afecta.', icono: 'Network', evidencia: 'Matriz de riesgo parámetro-atributo.' },
        { titulo: 'Confirmar prerrequisitos', detalle: 'Equipos calificados, instrumentos calibrados, limpieza validada, proveedores calificados y personal entrenado.', icono: 'ClipboardCheck', evidencia: 'Lista de prerrequisitos verificada.' },
        { titulo: 'Escribir el protocolo PPQ', detalle: 'Número de lotes justificado, parámetros a registrar, muestreo ampliado y criterios intra e inter lote.', icono: 'FileText', evidencia: 'Protocolo aprobado.' },
        { titulo: 'Fabricar y muestrear', detalle: 'Ejecuta los lotes en condiciones de rutina, registra parámetros y toma las muestras ampliadas.', icono: 'Factory', evidencia: 'Registros de lote y resultados analíticos.' },
        { titulo: 'Evaluar y concluir', detalle: 'Analiza resultados, desviaciones y variabilidad; concluye si el proceso es reproducible.', icono: 'FileCheck', evidencia: 'Informe PPQ aprobado.' },
        { titulo: 'Verificar en rutina', detalle: 'Cartas de control, capacidad del proceso y revisión periódica de producto.', icono: 'LineChart', evidencia: 'Tendencias e informes periódicos.' },
      ],
    },
    caso: {
      titulo: 'Desabastecimiento y validación concurrente',
      contexto: 'Un antibiótico esencial está en riesgo de desabastecimiento en el país. La planta acaba de transferir el proceso a un equipo nuevo, calificado, y tiene el primer lote de PPQ fabricado y con resultados conformes. El gerente propone liberar ese lote ya.',
      pregunta: '¿Qué condición hace aceptable liberarlo antes de terminar la PPQ?',
      opciones: [
        { texto: 'Ninguna: nunca se puede liberar un lote antes de completar la validación.', correcta: false, retro: 'El Anexo 15 admite la validación concurrente en circunstancias excepcionales y justificadas, como un beneficio significativo para el paciente.' },
        { texto: 'Una decisión documentada de validación concurrente, justificada por el riesgo de desabastecimiento, aprobada por la persona autorizada, con evaluación de los resultados del lote y vigilancia reforzada de los siguientes.', correcta: true, retro: 'La validación concurrente es una excepción posible si se justifica, se aprueba formalmente y se acompaña de controles adicionales. Sin esa documentación sería liberar un lote no validado.' },
        { texto: 'Basta con que el lote cumpla especificaciones.', correcta: false, retro: 'Cumplir especificaciones es necesario pero no demuestra que el proceso sea reproducible. La excepción debe estar justificada y aprobada formalmente.' },
      ],
    },
    errores: [
      { error: 'Declarar críticos todos los parámetros.', correccion: 'Usa datos de desarrollo y análisis de riesgo para identificar los que realmente afectan los atributos críticos.' },
      { error: 'Muestrear en la PPQ igual que en la rutina.', correccion: 'La PPQ requiere muestreo ampliado para demostrar homogeneidad dentro del lote y entre lotes.' },
      { error: 'Elegir lotes «buenos» para la validación.', correccion: 'Los lotes deben ser consecutivos y fabricados en condiciones de rutina, no seleccionados.' },
      { error: 'No hacer seguimiento estadístico después de validar.', correccion: 'Implementa cartas de control y revisión de capacidad como parte de la etapa 3.' },
    ],
    comprueba: [
      { pregunta: 'Da un ejemplo de parámetro crítico y del atributo que afecta.', respuesta: 'La humedad final del granulado puede afectar la disolución y la dureza; la fuerza de compresión afecta la dureza, la friabilidad y la disolución.' },
      { pregunta: '¿En qué se diferencia la validación prospectiva de la concurrente?', respuesta: 'En la prospectiva los lotes se liberan después de completar el estudio; en la concurrente se liberan antes, solo por una necesidad excepcional justificada y aprobada.' },
      { pregunta: '¿Qué indica un índice de capacidad bajo?', respuesta: 'Que el proceso cumple con poco margen frente a sus especificaciones y que una variación pequeña podría producir un resultado fuera de especificación.' },
    ],
    resumen: [
      'Validar es demostrar que el proceso cumple **porque está bajo control**.',
      'Los **parámetros críticos** se identifican por su impacto en los **atributos críticos**.',
      'La PPQ usa muestreo ampliado y un número de lotes **justificado**.',
      'La verificación continua con estadística sostiene la validación en el tiempo.',
    ],
    referencias: [REF.fdaValidacionProcesos, REF.picsAnexo15, REF.trs1019a3, REF.ichQ9, REF.ichIndice],
    imagenes: [
      { ubicacion: 'En la sección de atributos y parámetros', descripcion: 'Matriz visual de riesgo: filas con etapas del proceso (mezcla, granulación, secado, compresión) y columnas con atributos (contenido, disolución, dureza), celdas coloreadas por impacto alto, medio y bajo con la paleta de marca.', alt: 'Matriz de parámetros críticos del proceso frente a atributos críticos de calidad' },
      { ubicacion: 'En la sección de rutina', descripcion: 'Carta de control con límites superior e inferior y una tendencia que se acerca al límite, señalada con un círculo turquesa.', alt: 'Carta de control de la verificación continua del proceso' },
    ],
    keywords: ['validación de procesos farmacéuticos', 'validación de procesos de fabricación', 'parámetros críticos del proceso', 'atributos críticos de calidad', 'cpp y cqa', 'validación concurrente', 'validación prospectiva', 'protocolo ppq', 'validación de granulación húmeda', 'verificación continua del proceso cpv', 'capacidad del proceso cpk farmacéutico', 'curso de validación de procesos'],
  },

  {
    titulo: 'Validación de limpieza',
    duracion: 35,
    gancho: {
      titulo: 'Un residuo invisible en la siguiente tableta',
      texto: 'La línea de compresión fabrica en la mañana un anticoagulante y en la tarde un producto pediátrico. La superficie del punzón «se ve limpia». Pero unos pocos microgramos del primer activo, repartidos en el lote siguiente, podrían llegar a un niño que nunca debió recibirlo. La validación de limpieza existe para demostrar, con cifras, que lo que «se ve limpio» está limpio.',
    },
    objetivos: [
      'Explicar cómo se establecen los límites de residuos con base toxicológica.',
      'Seleccionar el peor caso de una línea multiproducto con criterios justificados.',
      'Elegir entre muestreo por hisopado y por enjuague, y entender el estudio de recuperación.',
      'Definir los tiempos de espera sucio y limpio en un programa de limpieza.',
    ],
    conceptos: [
      { icono: 'Scale', termino: 'Límite basado en salud (PDE)', definicion: 'La exposición diaria permitida de un activo: la dosis que una persona puede recibir cada día de por vida sin efectos adversos. Es la base actual para fijar límites de arrastre en instalaciones compartidas.' },
      { icono: 'Crosshair', termino: 'Peor caso', definicion: 'El producto, el equipo o la condición más difícil de limpiar o de mayor riesgo, elegido con criterios como solubilidad, toxicidad, potencia y dificultad de limpieza para representar a los demás.' },
      { icono: 'TestTube', termino: 'Hisopado y enjuague', definicion: 'Dos formas de muestrear: el hisopado recoge residuos de una superficie definida, sobre todo en zonas difíciles; el enjuague muestrea superficies grandes o inaccesibles con un volumen de solvente.' },
      { icono: 'Percent', termino: 'Estudio de recuperación', definicion: 'Prueba que demuestra cuánto del residuo realmente recoge el muestreo desde la superficie. Sin recuperación conocida, el resultado del hisopo no se puede interpretar.' },
      { icono: 'Timer', termino: 'Tiempos de espera', definicion: 'Tiempo máximo entre el fin de la producción y la limpieza (equipo sucio) y entre la limpieza y el siguiente uso (equipo limpio). Ambos se validan.' },
      { icono: 'Eye', termino: 'Inspección visual', definicion: 'Criterio necesario en toda limpieza, pero el Anexo 15 indica que en general no es aceptable usarlo como único criterio.' },
    ],
    mapa: {
      centro: 'Demostrar que el equipo quedó limpio',
      ramas: [
        { titulo: 'Qué residuos', icono: 'Beaker', nodos: ['Activo del producto anterior', 'Agentes de limpieza', 'Contaminación microbiológica', 'Productos de degradación si aplica'] },
        { titulo: 'Cuánto se permite', icono: 'Scale', nodos: ['Límite basado en PDE', 'Criterios tradicionales como respaldo', 'Limpio visualmente'] },
        { titulo: 'Cómo se muestrea', icono: 'TestTube', nodos: ['Hisopado de zonas críticas', 'Enjuague de superficies grandes', 'Recuperación demostrada'] },
        { titulo: 'Qué se valida', icono: 'ClipboardCheck', nodos: ['Peor caso de la familia', 'Tiempo de espera sucio', 'Tiempo de espera limpio', 'Método analítico validado'] },
      ],
    },
    secciones: [
      {
        titulo: 'Límites: de la regla fija a la toxicología',
        parrafos: [
          'Durante años, los límites de residuos se fijaron con reglas generales: que en el producto siguiente no hubiera más de 10 ppm del activo anterior, o no más de una milésima de su dosis terapéutica mínima, además de que el equipo estuviera visualmente limpio. Estas reglas siguen apareciendo como criterio de respaldo, pero el enfoque actual, que recoge el Anexo 15 con base en las guías de la EMA sobre instalaciones compartidas, parte de un **límite basado en salud**: la exposición diaria permitida (PDE) del activo, establecida por un experto en toxicología.',
          'Con la PDE se calcula el **arrastre máximo aceptable** hacia el producto siguiente, considerando su dosis diaria máxima y el tamaño de lote, y de ahí el límite por superficie del equipo. Este cálculo protege más en los productos muy potentes, donde la regla de la milésima de dosis puede quedarse corta, y evita exigencias absurdas en activos de baja toxicidad.',
          'El límite químico no es el único. También se controlan los **agentes de limpieza** (detergentes), los **residuos microbiológicos** y, cuando el activo se degrada durante la limpieza, sus productos de degradación. Y en todos los casos, la superficie debe estar **visualmente limpia**: es un criterio necesario, aunque en general no suficiente por sí solo.',
        ],
      },
      {
        titulo: 'Peor caso, muestreo y tiempos',
        parrafos: [
          'En una línea que fabrica muchos productos, no es práctico validar cada combinación. Se agrupan productos y equipos en familias y se elige un **peor caso** con criterios justificados: el producto menos soluble en el agente de limpieza, el más potente o tóxico, el de mayor dificultad de limpieza observada, y el equipo con más superficie o zonas de difícil acceso. Si la limpieza funciona para el peor caso, se asume que funciona para el resto de la familia, y esa lógica debe quedar escrita.',
          'El **hisopado** se aplica a puntos definidos de difícil limpieza, como punzones, matrices, juntas o la parte interna de las válvulas; el **enjuague** sirve para superficies grandes o inaccesibles, como el interior de tuberías. Ambos requieren un **estudio de recuperación**: se contamina una placa del mismo material con una cantidad conocida del activo, se muestrea y se mide cuánto se recupera. El método analítico usado debe estar validado y ser lo bastante sensible para detectar residuos por debajo del límite.',
          'Por último, se validan los **tiempos de espera**. El tiempo de espera sucio importa porque un residuo que se seca o se degrada puede ser más difícil de remover. El tiempo de espera limpio importa porque un equipo limpio almacenado demasiado tiempo puede contaminarse por microorganismos o por el ambiente. El número de ejecuciones de limpieza necesarias para validar debe basarse en una evaluación de riesgo y estar justificado.',
        ],
      },
    ],
    proceso: {
      titulo: 'Programa de validación de limpieza en una línea multiproducto',
      pasos: [
        { titulo: 'Inventariar productos y equipos', detalle: 'Lista los productos de la línea, sus activos, dosis, tamaños de lote y los equipos compartidos con sus superficies de contacto.', icono: 'Boxes', evidencia: 'Matriz de productos y equipos.' },
        { titulo: 'Fijar límites', detalle: 'Obtén la PDE de cada activo, calcula el arrastre máximo aceptable y el límite por superficie; agrega límites para detergente y microbiología.', icono: 'Scale', evidencia: 'Cálculo de límites aprobado.' },
        { titulo: 'Elegir el peor caso', detalle: 'Agrupa en familias y selecciona el producto y el equipo de peor caso con criterios de solubilidad, toxicidad y dificultad de limpieza.', icono: 'Crosshair', evidencia: 'Justificación del peor caso.' },
        { titulo: 'Validar el método y la recuperación', detalle: 'Valida el método analítico con sensibilidad suficiente y demuestra la recuperación del hisopo o del enjuague en cada material.', icono: 'FlaskConical', evidencia: 'Informe de validación y de recuperación.' },
        { titulo: 'Ejecutar la limpieza y muestrear', detalle: 'Aplica el procedimiento de limpieza tal como está escrito, inspecciona visualmente y muestrea en los puntos definidos.', icono: 'TestTube', evidencia: 'Registros de limpieza y de muestreo.' },
        { titulo: 'Validar tiempos de espera', detalle: 'Demuestra el tiempo máximo sucio antes de limpiar y el tiempo máximo limpio antes de usar.', icono: 'Timer', evidencia: 'Estudios de tiempos de espera.' },
        { titulo: 'Concluir y mantener', detalle: 'Concluye con un informe y define la verificación periódica, el control de cambios para productos nuevos y la revisión de tendencias.', icono: 'FileCheck', evidencia: 'Informe aprobado y plan de mantenimiento.' },
      ],
    },
    caso: {
      titulo: 'Entra un producto nuevo a la línea',
      contexto: 'Una línea con limpieza validada fabrica tres productos; el peor caso validado es un activo poco soluble en agua. Llega un producto nuevo con un activo hormonal de alta potencia, muy soluble en agua.',
      pregunta: '¿Qué implica para la validación de limpieza?',
      opciones: [
        { texto: 'Nada: si es muy soluble, se limpia más fácil que el peor caso actual.', correcta: false, retro: 'La solubilidad es solo uno de los criterios. Un activo de alta potencia tiene una PDE muy baja y puede requerir límites mucho más estrictos que los validados.' },
        { texto: 'Evaluarlo por control de cambios: calcular su límite con base en su PDE, verificar si la limpieza validada lo alcanza con un método sensible y, según el riesgo, ejecutar estudios adicionales o considerar instalaciones o equipos dedicados.', correcta: true, retro: 'El peor caso se define por varios criterios, y la potencia cambia el límite. Para algunos productos de alto riesgo, la conclusión puede ser que no es seguro compartir la línea.' },
        { texto: 'Reemplazar el peor caso por el producto nuevo sin más estudios.', correcta: false, retro: 'Cambiar el peor caso exige calcular límites y demostrar con datos que la limpieza los cumple.' },
      ],
    },
    errores: [
      { error: 'Usar solo la inspección visual como criterio de aceptación.', correccion: 'La inspección visual es necesaria, pero en general no suficiente: se complementa con límites químicos y microbiológicos.' },
      { error: 'Muestrear sin conocer la recuperación.', correccion: 'Demuestra la recuperación en cada material de superficie y úsala para interpretar los resultados.' },
      { error: 'Elegir el peor caso solo por solubilidad.', correccion: 'Considera también potencia, toxicidad, dificultad de limpieza observada y la geometría del equipo.' },
      { error: 'Olvidar los tiempos de espera.', correccion: 'Valida cuánto puede esperar el equipo sucio antes de limpiarse y el equipo limpio antes de usarse.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la PDE y para qué sirve en la validación de limpieza?', respuesta: 'La exposición diaria permitida de un activo. Sirve para calcular el arrastre máximo aceptable y el límite de residuos con base en la salud del paciente.' },
      { pregunta: '¿Cuándo prefieres hisopado y cuándo enjuague?', respuesta: 'Hisopado para puntos definidos y zonas difíciles; enjuague para superficies grandes o inaccesibles. A menudo se usan ambos.' },
      { pregunta: '¿Por qué se valida el tiempo de espera sucio?', respuesta: 'Porque los residuos que se secan o se degradan pueden ser más difíciles de remover si la limpieza se demora.' },
      { pregunta: '¿Basta la inspección visual?', respuesta: 'No. Es un criterio necesario, pero el Anexo 15 indica que en general no es aceptable como único criterio.' },
    ],
    resumen: [
      'Los límites modernos parten de la **PDE**: protegen al paciente según la toxicidad del activo.',
      'El **peor caso** se elige con varios criterios y se justifica por escrito.',
      'Sin **estudio de recuperación** no hay interpretación posible del muestreo.',
      'Se validan también los **tiempos de espera** sucio y limpio.',
    ],
    referencias: [REF.picsAnexo15, REF.trs1019a3, REF.trs986a2, REF.ichQ9],
    imagenes: [
      { ubicacion: 'En la sección de muestreo', descripcion: 'Primer plano ilustrado de un punzón de tableteadora con un hisopo sobre una plantilla de 25 cm², con etiquetas de «zona crítica» en turquesa.', alt: 'Muestreo por hisopado de un punzón en la validación de limpieza' },
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Diagrama de embudo que va de la PDE al arrastre máximo aceptable y al límite por superficie, con iconos de balanza y regla.', alt: 'Del límite basado en salud al límite por superficie del equipo' },
    ],
    keywords: ['validación de limpieza', 'validación de limpieza farmacéutica', 'límites de limpieza pde', 'cálculo de límites de residuos', 'peor caso validación de limpieza', 'muestreo por hisopado', 'muestreo por enjuague', 'estudio de recuperación hisopo', 'tiempo de espera sucio y limpio', 'dirty hold time', 'clean hold time', 'validación de limpieza anexo 15', 'curso de validación de limpieza'],
  },

  {
    titulo: 'Validación de métodos analíticos',
    duracion: 35,
    gancho: {
      titulo: 'Un 99,8 % que nadie pudo defender',
      texto: 'El certificado de análisis dice que el lote tiene un contenido de 99,8 %. En una inspección, el inspector pregunta: «¿Cómo sabe que su método mide el activo y no un producto de degradación que eluye en el mismo tiempo?». La analista tenía el dato, pero no la evidencia de especificidad. Un resultado solo vale lo que vale el método que lo produjo.',
    },
    objetivos: [
      'Explicar qué pregunta responde cada característica de desempeño de ICH Q2(R2).',
      'Seleccionar las características a validar según el tipo de procedimiento.',
      'Diferenciar validación, verificación y transferencia de un método.',
      'Relacionar la validación con la idoneidad del sistema y el ciclo de vida de ICH Q14.',
    ],
    conceptos: [
      { icono: 'Crosshair', termino: 'Especificidad o selectividad', definicion: '¿Mido lo que creo que mido? Capacidad de evaluar el analito sin interferencia de impurezas, productos de degradación, excipientes o la matriz.' },
      { icono: 'Target', termino: 'Exactitud', definicion: '¿El resultado se acerca al valor verdadero? Se evalúa, por ejemplo, con recuperación de cantidades conocidas en varios niveles del rango.' },
      { icono: 'Repeat', termino: 'Precisión', definicion: '¿Obtengo lo mismo al repetir? Se evalúa como repetibilidad, precisión intermedia (otro día, otro analista, otro equipo) y, cuando aplica, reproducibilidad entre laboratorios.' },
      { icono: 'LineChart', termino: 'Rango y respuesta', definicion: 'El intervalo en el que el método da resultados con exactitud y precisión adecuadas, y el modelo de calibración (lineal o no) que relaciona la señal con la concentración.' },
      { icono: 'Search', termino: 'Límites de detección y cuantificación', definicion: 'La menor cantidad que el método detecta y la menor que cuantifica con exactitud y precisión aceptables. Claves para impurezas y para residuos de limpieza.' },
      { icono: 'ShieldCheck', termino: 'Robustez', definicion: 'Capacidad del método de no verse afectado por pequeñas variaciones deliberadas, como el pH de la fase móvil o la temperatura de la columna. ICH Q14 la ubica en el desarrollo.' },
    ],
    mapa: {
      centro: 'Un método apto para su propósito',
      ramas: [
        { titulo: '¿Mido lo correcto?', icono: 'Crosshair', nodos: ['Especificidad', 'Degradación forzada', 'Pureza de pico'] },
        { titulo: '¿Mido bien?', icono: 'Target', nodos: ['Exactitud', 'Precisión', 'Rango y respuesta'] },
        { titulo: '¿Cuánto es lo mínimo?', icono: 'Search', nodos: ['Límite de detección', 'Límite de cuantificación'] },
        { titulo: '¿Funciona siempre?', icono: 'ShieldCheck', nodos: ['Robustez', 'Idoneidad del sistema', 'Ciclo de vida (ICH Q14)'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué validar según el propósito',
        parrafos: [
          'La guía ICH Q2(R2), revisada en 2023, organiza la validación según el **propósito del procedimiento**. Una prueba de **identificación** necesita demostrar especificidad. Una prueba **cuantitativa de impurezas** necesita especificidad, rango (incluido el límite de cuantificación), exactitud y precisión. Una **prueba límite** de impurezas necesita especificidad y límite de detección. Una **valoración** del contenido o de la potencia necesita especificidad, rango, exactitud y precisión.',
          'Para la precisión, la guía describe la **repetibilidad**, que puede evaluarse con un mínimo de nueve determinaciones que cubran el rango (por ejemplo, tres concentraciones con tres réplicas cada una) o con un mínimo de seis determinaciones al 100 % de la concentración de prueba; la **precisión intermedia**, que mide el efecto de días, analistas o equipos distintos dentro del mismo laboratorio, y la **reproducibilidad** entre laboratorios, relevante en estudios colaborativos o en transferencias.',
          'La versión R2 actualizó el lenguaje: habla de **respuesta** y modelo de calibración en lugar de restringirse a la linealidad, reconoce métodos multivariados y técnicas que no son lineales por naturaleza, y se complementa con **ICH Q14**, que describe cómo desarrollar el método con conocimiento de sus variables y cómo gestionar su ciclo de vida, incluidos los cambios posteriores a la aprobación.',
        ],
      },
      {
        titulo: 'Validar, verificar o transferir',
        parrafos: [
          'No todo método se valida desde cero. Un método **desarrollado internamente** o modificado se valida. Un método **farmacopeico** usado tal como está escrito se **verifica**: el laboratorio demuestra que funciona en sus condiciones, con su equipo, sus analistas y su producto (la USP lo describe en el capítulo general sobre verificación de procedimientos compendiales). Un método validado que pasa de un laboratorio a otro se **transfiere**, con un protocolo que demuestre que el laboratorio receptor obtiene resultados equivalentes.',
          'La **idoneidad del sistema** no reemplaza la validación: es la verificación, en cada corrida, de que el sistema cromatográfico funciona como en la validación, con parámetros como resolución, factor de cola, platos teóricos y precisión de inyecciones repetidas. Si la idoneidad falla, los resultados de esa corrida no se usan.',
          'En Colombia, la Resolución 3619 de 2013 exige que los laboratorios de control de calidad usen métodos validados o verificados según corresponda, y el INVIMA los revisa en la evaluación del registro sanitario y en las inspecciones. Un dato de liberación descansa sobre tres cosas: un método apto, un equipo calificado y un analista competente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Validación de un método de valoración por HPLC',
      pasos: [
        { titulo: 'Definir el propósito y los criterios', detalle: 'Establece el perfil del procedimiento: qué mide, en qué rango, con qué exactitud y precisión requeridas, y las características a validar según ICH Q2(R2).', icono: 'Target', evidencia: 'Protocolo de validación aprobado.' },
        { titulo: 'Demostrar especificidad', detalle: 'Analiza placebo, estándar, muestra y muestras sometidas a degradación forzada; evalúa resolución y pureza de pico.', icono: 'Crosshair', evidencia: 'Cromatogramas y evaluación de pureza de pico.' },
        { titulo: 'Establecer respuesta y rango', detalle: 'Prepara niveles que cubran el rango (por ejemplo, 80 % a 120 % para valoración) y evalúa el modelo de calibración y sus residuales.', icono: 'LineChart', evidencia: 'Datos de calibración y análisis estadístico.' },
        { titulo: 'Evaluar exactitud', detalle: 'Recupera cantidades conocidas en al menos tres niveles con réplicas y compara con el criterio predefinido.', icono: 'Target', evidencia: 'Tabla de recuperaciones.' },
        { titulo: 'Evaluar precisión', detalle: 'Repetibilidad y precisión intermedia con otro analista, otro día u otro equipo; calcula la desviación estándar relativa.', icono: 'Repeat', evidencia: 'Resultados de precisión.' },
        { titulo: 'Confirmar robustez e idoneidad', detalle: 'Usa el conocimiento del desarrollo (ICH Q14) y define los criterios de idoneidad del sistema para cada corrida.', icono: 'ShieldCheck', evidencia: 'Estudio de robustez y criterios de idoneidad.' },
        { titulo: 'Emitir el informe', detalle: 'Resume resultados, desviaciones y conclusión: el método es apto para su propósito dentro del rango validado.', icono: 'FileCheck', evidencia: 'Informe de validación aprobado.' },
      ],
    },
    caso: {
      titulo: 'Un método de la farmacopea en un equipo nuevo',
      contexto: 'El laboratorio va a empezar a analizar un producto con el método de valoración de su monografía farmacopeica, sin modificaciones. El analista propone hacer la validación completa de ICH Q2(R2).',
      pregunta: '¿Qué corresponde hacer?',
      opciones: [
        { texto: 'Validación completa, porque todo método debe validarse en el laboratorio.', correcta: false, retro: 'Un método farmacopeico ya fue validado. Repetir toda la validación no es necesario si se usa tal como está escrito.' },
        { texto: 'Verificar el método en las condiciones del laboratorio: especificidad frente a la matriz del producto y las características que el riesgo indique, como precisión y exactitud, con equipo calificado.', correcta: true, retro: 'Es una verificación: demuestra que el método funciona con tu producto, tus equipos y tus analistas. Si se modifica el método, entonces sí hay que validar lo que cambió.' },
        { texto: 'No hacer nada: el método de la farmacopea es oficial.', correcta: false, retro: 'Que sea oficial no garantiza que funcione con tu matriz y tus condiciones. La verificación es necesaria.' },
      ],
    },
    errores: [
      { error: 'Demostrar especificidad sin degradación forzada en métodos indicadores de estabilidad.', correccion: 'Somete el producto a estrés (ácido, base, oxidación, calor, luz) y demuestra que los productos de degradación no interfieren.' },
      { error: 'Confundir idoneidad del sistema con validación.', correccion: 'La idoneidad verifica cada corrida; la validación demuestra que el método es apto para su propósito.' },
      { error: 'Validar fuera del rango de uso.', correccion: 'El rango validado debe cubrir los valores que el método reportará en rutina y en estabilidad.' },
      { error: 'Modificar un método farmacopeico y solo verificarlo.', correccion: 'Si el método cambia, lo modificado se valida; la verificación aplica solo al método usado tal como está escrito.' },
    ],
    comprueba: [
      { pregunta: '¿Qué características necesita una valoración según ICH Q2(R2)?', respuesta: 'Especificidad, rango (respuesta), exactitud y precisión.' },
      { pregunta: '¿Cómo puede evaluarse la repetibilidad?', respuesta: 'Con un mínimo de nueve determinaciones que cubran el rango (por ejemplo, tres niveles con tres réplicas) o un mínimo de seis al 100 % de la concentración de prueba.' },
      { pregunta: '¿Qué diferencia hay entre validar y verificar un método?', respuesta: 'Se valida un método propio o modificado; se verifica un método farmacopeico usado sin modificaciones para demostrar que funciona en las condiciones del laboratorio.' },
      { pregunta: '¿Qué aporta ICH Q14?', respuesta: 'El enfoque de desarrollo del método basado en conocimiento y la gestión de su ciclo de vida, incluidos los cambios posteriores.' },
    ],
    resumen: [
      'Las características a validar dependen del **propósito**: identificación, impurezas o valoración.',
      'Especificidad, exactitud, precisión, rango, límites y robustez responden **preguntas distintas**.',
      'Se **valida** lo propio o modificado; se **verifica** lo farmacopeico; se **transfiere** entre laboratorios.',
      'La **idoneidad del sistema** protege cada corrida; ICH Q14 gestiona el ciclo de vida.',
    ],
    referencias: [REF.ichQ2, REF.ichQ14, REF.res3619, REF.fdaMetodos, REF.eurachem, REF.invimaValidacion],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Diana de tiro con cuatro patrones de impactos que ilustran exactitud y precisión (exacto y preciso, preciso no exacto, exacto no preciso, ninguno), con la paleta de marca.', alt: 'Diferencia entre exactitud y precisión en un método analítico' },
      { ubicacion: 'En el mapa de proceso', descripcion: 'Cromatograma ilustrado con el pico del activo separado de un producto de degradación, con anotaciones de resolución y factor de cola.', alt: 'Cromatograma que muestra la especificidad de un método por HPLC' },
    ],
    keywords: ['validación de métodos analíticos', 'ich q2 r2 en español', 'parámetros de validación de métodos analíticos', 'especificidad exactitud precisión', 'validación de método por hplc', 'repetibilidad y precisión intermedia', 'límite de detección y cuantificación', 'robustez de un método analítico', 'diferencia entre validación y verificación de métodos', 'verificación de métodos farmacopeicos', 'idoneidad del sistema hplc', 'ich q14 desarrollo de métodos analíticos', 'curso de validación de métodos analíticos'],
  },
];

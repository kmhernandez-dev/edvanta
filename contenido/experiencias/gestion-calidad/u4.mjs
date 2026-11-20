/**
 * Unidad 4. Enfoque por procesos, indicadores y revisión por la dirección (7 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: gestionar la calidad con procesos y datos',
    duracion: 20,
    gancho: {
      titulo: 'Cada área hace bien su parte, y aun así el pedido llega tarde',
      texto: 'En un laboratorio, producción cumple su programa, control de calidad analiza dentro de sus tiempos y el almacén despacha cuando recibe la orden. Sin embargo, los lotes tardan en promedio 25 días entre el fin de la fabricación y la liberación. Nadie es «dueño» de ese recorrido completo, así que nadie lo mide ni lo mejora. Esta unidad cambia la pregunta: en lugar de «¿cómo le va a cada área?», ¿cómo le va a cada proceso?',
    },
    objetivos: [
      'Explicar por qué un SGC se gestiona por procesos y no por áreas.',
      'Relacionar procesos, indicadores y revisión por la dirección como un ciclo de gestión.',
      'Anticipar la ruta de la unidad.',
    ],
    conceptos: [
      { icono: 'Workflow', termino: 'Proceso', definicion: 'Conjunto de actividades relacionadas que transforman entradas en un resultado previsto, que suele cruzar varias áreas.' },
      { icono: 'BarChart3', termino: 'Indicador', definicion: 'Medida definida con fórmula, meta y frecuencia, que muestra el desempeño de un proceso o el logro de un objetivo.' },
      { icono: 'Users', termino: 'Revisión por la dirección', definicion: 'Momento en que la alta dirección analiza el desempeño del sistema y toma decisiones de mejora y recursos.' },
    ],
    secciones: [
      {
        titulo: 'De las áreas a los procesos',
        parrafos: [
          'Las organizaciones se estructuran por áreas (producción, control de calidad, almacén), pero el valor para el paciente se crea en **procesos** que las atraviesan: desde que llega una materia prima hasta que se libera el lote, o desde que entra una prescripción hasta que el paciente recibe su medicamento. Gestionar por procesos significa nombrar un **dueño** para cada recorrido completo, medir su desempeño de principio a fin y mejorar las interfaces, que es donde suelen ocurrir los problemas.',
          'ISO 9001 hace del enfoque a procesos uno de sus principios y ICH Q10 pide monitorear el desempeño del proceso. En ambos casos el mensaje es el mismo: lo que no se gestiona como proceso no se puede medir bien ni mejorar.',
        ],
      },
      {
        titulo: 'Procesos, datos y decisiones',
        parrafos: [
          'Esta unidad recorre un ciclo completo de gestión. Primero, el **enfoque basado en procesos**: entradas, salidas, interacciones y dueños. Segundo, el **mapa y la caracterización** de los procesos de un laboratorio farmacéutico. Tercero, el **diseño de indicadores** con fórmula, meta, frecuencia y responsable. Cuarto, las **métricas de calidad** propias del sector: lotes rechazados, quejas, desviaciones y CAPA. Quinto, la **revisión por la dirección** según ISO 9001 e ICH Q10. Y para cerrar, un **caso** completo de revisión por la dirección en un laboratorio colombiano.',
          'Al terminar podrás construir el tablero de indicadores de tu organización y preparar una revisión por la dirección que lleve a decisiones, no solo a presentaciones.',
        ],
      },
    ],
    caso: {
      titulo: 'Los 25 días de liberación',
      contexto: 'En el laboratorio del ejemplo, cada área cumple sus metas internas, pero el tiempo entre fin de fabricación y liberación es de 25 días y genera faltantes en el mercado.',
      pregunta: '¿Qué enfoque permite resolverlo?',
      opciones: [
        { texto: 'Exigir a cada área que mejore su meta interna.', correcta: false, retro: 'Cada área ya cumple; el problema está en el recorrido completo y en sus interfaces.' },
        { texto: 'Definir el proceso de liberación de punta a punta, con un dueño, un indicador de tiempo total y el análisis de las esperas entre áreas.', correcta: true, retro: 'El enfoque por procesos hace visible el recorrido completo y permite atacar las esperas que ninguna área ve sola.' },
        { texto: 'Contratar más analistas en control de calidad.', correcta: false, retro: 'Puede ayudar, pero sin medir el proceso completo no sabes si el cuello de botella está en el laboratorio.' },
      ],
    },
    errores: [
      { error: 'Llamar «proceso» a un área.', correccion: 'Un proceso transforma entradas en un resultado y suele cruzar áreas; el área es una estructura organizacional.' },
      { error: 'Medir solo resultados finales.', correccion: 'Mide también las etapas y las interfaces donde se pierde tiempo o calidad.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué se gestiona por procesos y no por áreas?', respuesta: 'Porque el valor y los problemas se dan en recorridos que cruzan áreas; solo un dueño del proceso completo puede medirlo y mejorarlo.' },
    ],
    resumen: [
      'El valor se crea en **procesos** que cruzan áreas.',
      'Cada proceso necesita un **dueño** y **indicadores** de punta a punta.',
      'La **revisión por la dirección** convierte los datos en decisiones.',
    ],
    referencias: [R.iso9001, R.ichQ10, R.iso9000],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Flecha horizontal que atraviesa tres columnas de áreas (producción, control de calidad, almacén), con relojes en las interfaces.', alt: 'Un proceso que cruza varias áreas de un laboratorio farmacéutico' },
    ],
    keywords: ['gestión por procesos farmacéutica', 'enfoque basado en procesos calidad', 'indicadores y revisión por la dirección', 'gestión de calidad con datos', 'tiempo de liberación de lotes'],
  },
  {
    titulo: 'Enfoque basado en procesos: entradas, salidas, interacciones y dueños',
    duracion: 25,
    gancho: {
      titulo: 'El proceso sin dueño',
      texto: 'La recepción de materias primas involucra a compras, al almacén, a control de calidad y a aseguramiento. Cuando un material queda en cuarentena por dos semanas porque falta un certificado, cada área dice que hizo su parte. ISO 9001 pide, para cada proceso, entradas y salidas definidas, criterios de control, recursos, responsables y riesgos. Esta clase te enseña a describir un proceso completo para que tenga dueño y no se pierda entre las áreas.',
    },
    objetivos: [
      'Describir los elementos que ISO 9001:2026 exige para cada proceso del SGC.',
      'Identificar entradas, salidas, proveedores, clientes e interacciones de un proceso farmacéutico.',
      'Asignar responsabilidad y autoridad al dueño del proceso.',
    ],
    conceptos: [
      { icono: 'Workflow', termino: 'Entradas y salidas', definicion: 'Lo que el proceso recibe (materiales, información, solicitudes) y lo que entrega (productos, registros, decisiones), con sus requisitos.' },
      { icono: 'Users', termino: 'Proveedor y cliente del proceso', definicion: 'Quien entrega las entradas y quien recibe las salidas; pueden ser internos o externos.' },
      { icono: 'GitBranch', termino: 'Interacción', definicion: 'La relación entre procesos: la salida de uno es la entrada de otro.' },
      { icono: 'UserCheck', termino: 'Dueño del proceso', definicion: 'La persona con responsabilidad y autoridad para que el proceso logre sus resultados, lo mida y lo mejore.' },
    ],
    secciones: [
      {
        titulo: 'Lo que ISO 9001 pide para cada proceso',
        parrafos: [
          'La cláusula 4.4 de ISO 9001:2026 pide determinar, para cada proceso del SGC: las **entradas** requeridas y las **salidas** esperadas; la **secuencia e interacción** con otros procesos; los **criterios y métodos** (seguimiento, mediciones e indicadores) para asegurar su operación y control eficaces; los **recursos**; las **responsabilidades y autoridades**; los **riesgos y oportunidades**; cómo **evaluarlos** e implementar cambios; y cómo **mejorarlos**. Además, pide mantener la información documentada necesaria para apoyar su operación.',
          'Esta lista es, en la práctica, una plantilla de diseño de procesos. Si un proceso no tiene definido alguno de estos elementos, es probable que ahí esté la causa de sus problemas recurrentes.',
        ],
      },
      {
        titulo: 'Un proceso farmacéutico descrito completo',
        parrafos: [
          'Tomemos la **recepción y liberación de materias primas**. Proveedores del proceso: compras y el proveedor externo. Entradas: el material, el certificado de análisis, la orden de compra y la especificación aprobada. Actividades: recepción, verificación documental, cuarentena, muestreo, análisis, revisión y decisión. Salidas: material aprobado o rechazado, etiquetado y con su registro; informe de no conformidad si aplica. Clientes: producción y el almacén.',
          'Criterios de control: que el proveedor esté aprobado, que el certificado coincida con la especificación, que el muestreo siga el plan, que el análisis se haga en el tiempo definido. Indicadores: tiempo de ciclo desde recepción hasta decisión, porcentaje de lotes rechazados por proveedor. Riesgos: proveedor no calificado, mezcla de materiales en cuarentena, certificados falsos. Dueño: la jefatura de aseguramiento o de control de calidad, con autoridad sobre las demás áreas para este recorrido.',
        ],
      },
      {
        titulo: 'Las interacciones son el punto débil',
        parrafos: [
          'Los problemas suelen estar en las **interfaces**: la salida de un proceso no llega con los requisitos que el siguiente necesita. Por eso conviene acordar los requisitos de cada interfaz: qué información debe acompañar a una muestra que llega al laboratorio, en qué estado debe llegar un registro de lote a revisión, qué datos necesita compras para calificar un proveedor.',
          'El **dueño del proceso** coordina esas interfaces aunque las personas no dependan jerárquicamente de él. Para eso necesita autoridad explícita, asignada por la dirección, y espacios regulares para revisar el desempeño del proceso con las áreas implicadas.',
        ],
      },
    ],
    proceso: {
      titulo: 'Describir un proceso en ocho preguntas',
      pasos: [
        { titulo: '¿Qué resultado entrega?', detalle: 'Define el propósito y la salida esperada con sus requisitos.', icono: 'Target', evidencia: 'Objetivo del proceso.' },
        { titulo: '¿Qué necesita?', detalle: 'Lista las entradas y quién las provee.', icono: 'Package', evidencia: 'Entradas y proveedores.' },
        { titulo: '¿Qué hace?', detalle: 'Describe las actividades principales en secuencia.', icono: 'Workflow', evidencia: 'Diagrama de flujo.' },
        { titulo: '¿Quién responde?', detalle: 'Asigna dueño y responsables de cada actividad.', icono: 'UserCheck', evidencia: 'Matriz de responsabilidades.' },
        { titulo: '¿Cómo se controla?', detalle: 'Define criterios, controles e indicadores.', icono: 'Gauge', evidencia: 'Ficha de indicadores.' },
        { titulo: '¿Qué puede salir mal?', detalle: 'Identifica riesgos y oportunidades.', icono: 'AlertTriangle', evidencia: 'Riesgos del proceso.' },
        { titulo: '¿Qué documentos usa y genera?', detalle: 'Procedimientos, instructivos y registros.', icono: 'Files', evidencia: 'Listado documental.' },
        { titulo: '¿Cómo mejora?', detalle: 'Define cuándo y cómo se revisa el desempeño.', icono: 'RefreshCw', evidencia: 'Revisión periódica del proceso.' },
      ],
    },
    caso: {
      titulo: 'La cuarentena eterna',
      contexto: 'Los materiales pasan en promedio 12 días en cuarentena. Control de calidad dice que analiza en 3 días desde que recibe la muestra; el almacén dice que muestrea cuando control de calidad lo pide; compras dice que los certificados llegan tarde.',
      pregunta: '¿Cuál es el primer paso para resolverlo?',
      opciones: [
        { texto: 'Pedir a control de calidad que analice más rápido.', correcta: false, retro: 'El laboratorio ya cumple su parte; el tiempo se pierde en otras etapas e interfaces.' },
        { texto: 'Describir el proceso completo con un dueño, medir el tiempo de cada etapa y de cada interfaz, y acordar los requisitos entre áreas.', correcta: true, retro: 'Así se ve dónde está la espera real y se puede asignar responsabilidad sobre el recorrido completo.' },
        { texto: 'Eliminar la cuarentena.', correcta: false, retro: 'La cuarentena es un control BPM obligatorio; el objetivo es hacerla eficiente, no eliminarla.' },
      ],
    },
    errores: [
      { error: 'Procesos descritos solo con un diagrama de flujo.', correccion: 'Agrega entradas, salidas, controles, indicadores, riesgos, responsables y documentos.' },
      { error: 'Dueños de proceso sin autoridad sobre las interfaces.', correccion: 'La dirección debe asignar y comunicar esa autoridad.' },
    ],
    comprueba: [
      { pregunta: 'Nombra cinco elementos que ISO 9001 pide determinar para cada proceso.', respuesta: 'Entradas y salidas, secuencia e interacción, criterios y métodos de control, recursos, responsabilidades, riesgos y oportunidades, evaluación y mejora.' },
      { pregunta: '¿Dónde suelen estar los problemas de un proceso?', respuesta: 'En las interfaces entre actividades o áreas.' },
    ],
    resumen: [
      'Cada proceso necesita **entradas, salidas, controles, recursos, responsables y riesgos** definidos.',
      'Las **interfaces** entre áreas son el punto débil: acuerda sus requisitos.',
      'El **dueño del proceso** necesita autoridad sobre el recorrido completo.',
    ],
    referencias: [R.iso9001, R.iso9000, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Ficha ilustrada de un proceso con sus ocho preguntas, aplicada a la recepción de materias primas.', alt: 'Descripción de un proceso farmacéutico con entradas, salidas y controles' },
    ],
    keywords: ['enfoque basado en procesos iso 9001', 'cláusula 4.4 iso 9001', 'entradas y salidas de un proceso', 'dueño del proceso', 'proceso de recepción de materias primas', 'gestión por procesos ejemplo'],
  },
  {
    titulo: 'Mapa de procesos y caracterización de procesos de un laboratorio farmacéutico',
    duracion: 25,
    gancho: {
      titulo: 'Una sola página para entender la empresa',
      texto: 'Un inspector llega a un laboratorio que no conoce y pide ver el mapa de procesos. En una sola página entiende qué hace la organización, cuáles son sus procesos clave, cuáles la apoyan y cómo se dirige y se evalúa. Luego pide la caracterización del proceso de liberación de lotes y en otra página ve sus entradas, salidas, controles e indicadores. Esas dos herramientas son la columna vertebral documental del SGC.',
    },
    objetivos: [
      'Construir un mapa de procesos con procesos estratégicos, misionales, de apoyo y de evaluación.',
      'Elaborar la caracterización de un proceso farmacéutico.',
      'Usar el diagrama de tortuga y el SIPOC como herramientas de caracterización.',
    ],
    conceptos: [
      { icono: 'Flag', termino: 'Procesos estratégicos', definicion: 'Los que dirigen la organización: planeación, gestión de la calidad, revisión por la dirección.' },
      { icono: 'Factory', termino: 'Procesos misionales', definicion: 'Los que crean el producto o servicio para el cliente: desarrollo, compras de materiales, fabricación, control de calidad, liberación, distribución.' },
      { icono: 'Wrench', termino: 'Procesos de apoyo', definicion: 'Los que dan recursos a los demás: talento humano, mantenimiento y metrología, sistemas de información, servicios generales.' },
      { icono: 'ClipboardCheck', termino: 'Procesos de evaluación', definicion: 'Los que miden y mejoran: auditoría interna, autoinspección, gestión de indicadores, CAPA.' },
      { icono: 'Box', termino: 'Caracterización', definicion: 'Documento que describe un proceso: objetivo, alcance, dueño, proveedores, entradas, actividades, salidas, clientes, recursos, controles, indicadores, riesgos y documentos.' },
    ],
    mapa: {
      centro: 'Mapa de procesos de un laboratorio',
      ramas: [
        { titulo: 'Estratégicos', icono: 'Flag', nodos: ['Direccionamiento estratégico', 'Gestión de la calidad', 'Revisión por la dirección'] },
        { titulo: 'Misionales', icono: 'Factory', nodos: ['Desarrollo y transferencia', 'Abastecimiento de materiales', 'Fabricación y empaque', 'Control de calidad y liberación', 'Distribución'] },
        { titulo: 'Apoyo', icono: 'Wrench', nodos: ['Talento humano', 'Mantenimiento y metrología', 'Sistemas computarizados', 'Asuntos regulatorios'] },
        { titulo: 'Evaluación', icono: 'ClipboardCheck', nodos: ['Autoinspección', 'Indicadores', 'Desviaciones y CAPA'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo se construye el mapa',
        parrafos: [
          'El mapa de procesos representa en una página los procesos del SGC y sus relaciones. En Colombia es común organizarlo en cuatro grupos: **estratégicos**, **misionales**, **de apoyo** y **de evaluación**. A la izquierda se ubican las necesidades y requisitos de los clientes y partes interesadas (pacientes, clientes institucionales, autoridad sanitaria); a la derecha, su satisfacción con el producto o servicio entregado. En el centro, los procesos misionales en el orden en que crean el producto, con los estratégicos arriba y los de apoyo abajo.',
          'Un buen mapa es **específico** de la organización: un laboratorio que solo fabrica no tendrá desarrollo; uno que tiene servicio farmacéutico agregará dispensación. Debe usar nombres que el personal reconozca y ser coherente con el alcance declarado del SGC.',
        ],
      },
      {
        titulo: 'La caracterización del proceso',
        parrafos: [
          'Cada proceso del mapa tiene una **caracterización**: una ficha que reúne objetivo, alcance (dónde empieza y dónde termina), dueño, proveedores, entradas, actividades principales, salidas, clientes, recursos (personas, equipos, sistemas), controles y criterios, indicadores, riesgos, requisitos legales aplicables y documentos asociados. Es la versión documentada de la cláusula 4.4 de ISO 9001.',
          'Dos herramientas ayudan a construirla. El **SIPOC** (proveedores, entradas, proceso, salidas, clientes) da la vista horizontal del flujo. El **diagrama de tortuga** organiza alrededor del proceso seis preguntas: con qué (recursos), con quién (competencias), cómo (métodos), cuánto (indicadores), entradas y salidas. Ambos facilitan conversar con las áreas y detectar lo que falta.',
        ],
      },
      {
        titulo: 'Ejemplo: control de calidad y liberación',
        parrafos: [
          '**Objetivo**: demostrar que materiales y productos cumplen las especificaciones aprobadas y decidir su liberación. **Alcance**: desde la recepción de la muestra hasta la decisión de liberación o rechazo. **Entradas**: muestras, especificaciones y métodos aprobados, registro de lote. **Salidas**: certificados de análisis, decisiones de liberación, investigaciones de resultados fuera de especificación. **Clientes**: almacén, producción, distribución, autoridad.',
          '**Controles**: métodos validados, equipos calificados y calibrados, estándares de referencia controlados, revisión por segunda persona, integridad de datos. **Indicadores**: tiempo de ciclo analítico, porcentaje de resultados fuera de especificación invalidados, cumplimiento del programa de estabilidad. **Riesgos**: errores analíticos, datos no íntegros, retrasos que generan faltantes. **Normas**: Resolución 3619 de 2013 y Resolución 1160 de 2016.',
        ],
      },
    ],
    caso: {
      titulo: 'Un mapa demasiado detallado',
      contexto: 'Un laboratorio presenta un mapa de procesos con 48 cajas, una por cada procedimiento, y ninguna caracterización.',
      pregunta: '¿Qué recomendarías?',
      opciones: [
        { texto: 'Mantenerlo: más detalle es mejor.', correcta: false, retro: 'Un mapa con 48 cajas no muestra la lógica del negocio; confunde procesos con procedimientos.' },
        { texto: 'Reducirlo a entre 10 y 20 procesos agrupados en estratégicos, misionales, de apoyo y de evaluación, y caracterizar cada uno; los procedimientos se asocian a los procesos.', correcta: true, retro: 'El mapa muestra la lógica del sistema; el detalle va en las caracterizaciones y los procedimientos.' },
        { texto: 'Eliminar el mapa porque no es obligatorio.', correcta: false, retro: 'ISO 9001 pide determinar los procesos y sus interacciones; el mapa es la forma más clara de hacerlo.' },
      ],
    },
    errores: [
      { error: 'Confundir procesos con procedimientos.', correccion: 'Un proceso agrupa varios procedimientos que entregan un resultado; el procedimiento describe cómo hacer una tarea.' },
      { error: 'Caracterizaciones sin indicadores ni riesgos.', correccion: 'Cada caracterización debe decir cómo se mide y qué puede fallar.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los cuatro grupos de procesos de un mapa típico en Colombia?', respuesta: 'Estratégicos, misionales, de apoyo y de evaluación.' },
      { pregunta: '¿Qué herramientas ayudan a caracterizar un proceso?', respuesta: 'El SIPOC y el diagrama de tortuga.' },
    ],
    resumen: [
      'El **mapa de procesos** muestra en una página la lógica del SGC.',
      'Cada proceso tiene su **caracterización** con controles, indicadores y riesgos.',
      '**SIPOC** y **tortuga** ayudan a construirla con las áreas.',
    ],
    referencias: [R.iso9001, R.res3619, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Mapa de procesos ilustrado de un laboratorio farmacéutico con cuatro franjas (estratégicos, misionales, apoyo, evaluación).', alt: 'Mapa de procesos de un laboratorio farmacéutico' },
    ],
    keywords: ['mapa de procesos laboratorio farmacéutico', 'caracterización de procesos ejemplo', 'diagrama de tortuga iso 9001', 'sipoc ejemplo', 'procesos estratégicos misionales y de apoyo', 'mapa de procesos iso 9001'],
  },
  {
    titulo: 'Diseño de indicadores de calidad: fórmula, meta, frecuencia y responsable',
    duracion: 25,
    gancho: {
      titulo: 'Treinta indicadores y ninguna decisión',
      texto: 'Un laboratorio reporta cada mes treinta indicadores en un archivo con colores. Nadie recuerda cómo se calculan algunos, varios cambian de fórmula según quién los mide y en la reunión mensual solo se comenta si están en verde o en rojo. Un indicador mal diseñado no informa: distrae. Esta clase te da la ficha técnica para diseñar indicadores que sirvan para decidir.',
    },
    objetivos: [
      'Diseñar la ficha técnica de un indicador: nombre, objetivo, fórmula, fuente, meta, frecuencia y responsable.',
      'Distinguir indicadores de eficacia, eficiencia y efectividad.',
      'Seleccionar pocos indicadores relevantes para un proceso farmacéutico.',
    ],
    conceptos: [
      { icono: 'Calculator', termino: 'Fórmula', definicion: 'La operación exacta con numerador, denominador y unidades. Debe poder repetirse igual por cualquier persona.' },
      { icono: 'Target', termino: 'Meta y umbrales', definicion: 'El valor que se espera lograr y los límites que indican cuándo actuar.' },
      { icono: 'Database', termino: 'Fuente de datos', definicion: 'El registro o sistema del que salen los datos, para asegurar que sean confiables y verificables.' },
      { icono: 'Activity', termino: 'Eficacia, eficiencia y efectividad', definicion: 'Eficacia: lograr lo planificado. Eficiencia: lograrlo con buen uso de recursos. Efectividad: el impacto en el cliente o el paciente.' },
    ],
    proceso: {
      titulo: 'Ficha técnica de un indicador',
      pasos: [
        { titulo: 'Nombre y objetivo', detalle: 'Qué se mide y para qué decisión sirve.', icono: 'Target', evidencia: 'Objetivo vinculado a un proceso o a un objetivo de calidad.' },
        { titulo: 'Fórmula', detalle: 'Numerador, denominador, unidades y reglas de inclusión y exclusión.', icono: 'Calculator', evidencia: 'Fórmula escrita sin ambigüedad.' },
        { titulo: 'Fuente y responsable de los datos', detalle: 'De dónde salen los datos y quién los registra.', icono: 'Database', evidencia: 'Fuente trazable.' },
        { titulo: 'Línea base y meta', detalle: 'Valor actual medido y meta con umbrales de alerta.', icono: 'Flag', evidencia: 'Meta justificada.' },
        { titulo: 'Frecuencia', detalle: 'Cada cuánto se mide y cada cuánto se analiza.', icono: 'CalendarClock', evidencia: 'Calendario de medición.' },
        { titulo: 'Responsable del análisis', detalle: 'Quién analiza, con quién y qué hace si no se cumple la meta.', icono: 'UserCheck', evidencia: 'Acta o registro de análisis.' },
      ],
    },
    secciones: [
      {
        titulo: 'Lo que hace útil a un indicador',
        parrafos: [
          'Un indicador es útil si responde a una pregunta de gestión y lleva a una decisión. Por eso empieza por el **objetivo**: ¿qué quiero saber y qué haré con la respuesta? Luego la **fórmula** debe ser inequívoca: «porcentaje de desviaciones cerradas en plazo = desviaciones cerradas dentro de 30 días ÷ desviaciones cerradas en el mes × 100». Sin la regla de los 30 días o sin definir el denominador, dos personas obtendrán resultados distintos.',
          'La **fuente** debe ser un registro controlado, no una hoja de cálculo que cada quien actualiza. La **meta** se fija a partir de una **línea base** medida y de lo que es razonable mejorar, con **umbrales** que indiquen cuándo actuar. La **frecuencia** de medición y la de análisis pueden ser distintas: un indicador se mide cada semana y se analiza cada mes.',
        ],
      },
      {
        titulo: 'Tipos de indicadores',
        parrafos: [
          'Los indicadores de **eficacia** miden si se logra lo planificado: porcentaje de lotes aprobados a la primera, porcentaje de CAPA eficaces. Los de **eficiencia** relacionan el resultado con los recursos: tiempo de ciclo de liberación, costo de la no calidad, horas de analista por lote. Los de **efectividad** miden el impacto en el cliente o el paciente: quejas por millón de unidades, retiros del mercado, satisfacción de clientes institucionales.',
          'También conviene combinar indicadores **de resultado** (miran hacia atrás: lotes rechazados) con indicadores **anticipados** (pueden predecir problemas: capacitaciones vencidas, calibraciones atrasadas, desviaciones abiertas de más de 30 días). Los anticipados permiten actuar antes de que el resultado se deteriore.',
        ],
      },
      {
        titulo: 'Menos es más',
        parrafos: [
          'Un proceso necesita pocos indicadores, entre uno y cuatro, bien elegidos y bien analizados. Un tablero del SGC de un laboratorio mediano puede tener entre 12 y 20 indicadores en total. Más que eso suele generar ruido y debilitar el análisis.',
          'El análisis no es decir si el indicador está en verde: es mirar la **tendencia**, buscar **causas** cuando hay un cambio, y decidir **acciones** con responsable y fecha. Los gráficos de tendencia con varios periodos dicen mucho más que un semáforo del último mes.',
        ],
      },
    ],
    caso: {
      titulo: 'El indicador que siempre está en verde',
      contexto: 'El indicador «cumplimiento del plan de capacitación» lleva dos años en 100 %. Al revisarlo, se descubre que el numerador cuenta las capacitaciones dictadas y no las personas capacitadas, y que no mide si la capacitación fue eficaz.',
      pregunta: '¿Cómo lo rediseñarías?',
      opciones: [
        { texto: 'Dejarlo: está en verde.', correcta: false, retro: 'Un indicador que nunca cambia y mide lo equivocado no sirve para decidir.' },
        { texto: 'Redefinir la fórmula (personas capacitadas a tiempo ÷ personas que debían capacitarse) y agregar un indicador de eficacia (por ejemplo, desviaciones atribuibles a falta de competencia).', correcta: true, retro: 'Así el indicador mide lo que importa y se complementa con uno de efecto en el desempeño.' },
        { texto: 'Subir la meta a 110 %.', correcta: false, retro: 'El problema es la fórmula, no la meta.' },
      ],
    },
    errores: [
      { error: 'Fórmulas ambiguas que cada persona interpreta.', correccion: 'Escribe numerador, denominador, periodo y reglas de exclusión.' },
      { error: 'Metas sin línea base.', correccion: 'Mide primero; luego fija una meta razonable.' },
      { error: 'Reuniones de semáforos.', correccion: 'Analiza tendencias, causas y acciones.' },
    ],
    comprueba: [
      { pregunta: '¿Qué elementos tiene la ficha técnica de un indicador?', respuesta: 'Nombre y objetivo, fórmula, fuente, línea base y meta, frecuencia y responsable del análisis.' },
      { pregunta: '¿Qué diferencia hay entre un indicador de resultado y uno anticipado?', respuesta: 'El de resultado mide lo que ya ocurrió; el anticipado puede predecir un problema antes de que ocurra.' },
    ],
    resumen: [
      'Un indicador útil tiene **objetivo, fórmula inequívoca, fuente, meta, frecuencia y responsable**.',
      'Combina **eficacia, eficiencia y efectividad**, y **resultado** con **anticipados**.',
      '**Pocos** indicadores, bien analizados por **tendencia**.',
    ],
    referencias: [R.iso9001, R.ichQ10, R.fdaMetricas],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Ficha técnica de indicador ilustrada con sus campos y un gráfico de tendencia de doce meses.', alt: 'Ficha técnica de un indicador de calidad' },
    ],
    keywords: ['ficha técnica de indicadores', 'cómo diseñar indicadores de calidad', 'indicadores de eficacia eficiencia y efectividad', 'indicadores de gestión de calidad ejemplos', 'kpi de calidad farmacéutica', 'indicadores anticipados'],
  },
  {
    titulo: 'Métricas de calidad farmacéutica: lotes rechazados, quejas, desviaciones y CAPA',
    duracion: 25,
    gancho: {
      titulo: '¿Cómo sabe una autoridad qué tan sana es una planta?',
      texto: 'Las autoridades sanitarias inspeccionan miles de plantas y no pueden visitarlas todas cada año. Por eso la FDA propuso pedir a los fabricantes métricas de calidad que permitieran estimar el riesgo de cada planta sin visitarla. La discusión dejó una lección para cualquier laboratorio: unas pocas métricas bien definidas muestran la salud del sistema de calidad. Esta clase te enseña cuáles y cómo leerlas.',
    },
    objetivos: [
      'Definir las métricas de calidad más usadas en la industria farmacéutica.',
      'Interpretar qué dice cada métrica sobre el estado del sistema.',
      'Construir un tablero básico de métricas para la revisión por la dirección.',
    ],
    conceptos: [
      { icono: 'BadgeCheck', termino: 'Tasa de aceptación de lotes', definicion: 'Lotes aceptados sobre lotes que concluyeron su decisión de liberación en el periodo. Mide la capacidad del proceso de producir conforme.' },
      { icono: 'Users', termino: 'Tasa de quejas de calidad', definicion: 'Quejas relacionadas con la calidad del producto sobre unidades distribuidas o lotes liberados. Mide el desempeño en el mercado.' },
      { icono: 'FlaskConical', termino: 'Tasa de resultados fuera de especificación invalidados', definicion: 'Resultados fuera de especificación atribuidos a error del laboratorio sobre el total de análisis. Mide la confiabilidad del laboratorio.' },
      { icono: 'RefreshCw', termino: 'Recurrencia y eficacia de CAPA', definicion: 'Proporción de problemas que vuelven a ocurrir después de una CAPA y de CAPA verificadas como eficaces. Mide si el sistema aprende.' },
    ],
    secciones: [
      {
        titulo: 'La propuesta de la FDA',
        parrafos: [
          'En su borrador revisado de 2016 sobre envío de datos de métricas de calidad, la FDA propuso tres métricas: la **tasa de aceptación de lotes**, la **tasa de quejas de calidad del producto** y la **tasa de resultados fuera de especificación invalidados**. La idea era que estas métricas, comparadas entre plantas y en el tiempo, ayudaran a priorizar inspecciones y a promover una cultura de mejora. El programa siguió en discusión con la industria y no se convirtió en un requisito obligatorio, pero las definiciones se volvieron una referencia útil.',
          'Cada una mira una parte del sistema: la aceptación de lotes mira la **fabricación**, las quejas miran el **mercado** y los resultados invalidados miran el **laboratorio**. Un resultado invalidado con frecuencia es una señal de alarma: puede indicar métodos poco robustos, errores analíticos o, en el peor caso, problemas de integridad de datos.',
        ],
      },
      {
        titulo: 'Otras métricas del sistema',
        parrafos: [
          'Un tablero completo agrega métricas de los procesos del sistema de calidad: **desviaciones** por lote o por millón de unidades, porcentaje de desviaciones **recurrentes**, tiempo promedio de **cierre de investigaciones**, porcentaje de **CAPA cerradas en plazo** y de **CAPA eficaces**, **retiros del mercado**, cumplimiento del **programa de estabilidad**, **revisiones anuales de producto** a tiempo, cumplimiento del programa de **autoinspección** y **capacitación** vigente del personal.',
          'También son útiles el **porcentaje de lotes correctos a la primera** (sin reprocesos ni desviaciones mayores) y el **costo de la no calidad**. Ninguna métrica por sí sola cuenta toda la historia; lo valioso es leerlas juntas.',
        ],
      },
      {
        titulo: 'Leer las métricas sin engañarse',
        parrafos: [
          'Las métricas pueden **mejorar en apariencia** sin que el sistema mejore. Menos desviaciones reportadas puede significar más subregistro; menos resultados invalidados puede significar que se investiga menos. Por eso las métricas deben acompañarse de indicadores de **calidad del proceso de reporte e investigación**: por ejemplo, el porcentaje de investigaciones con causa raíz identificada o la proporción de desviaciones detectadas por la propia área frente a las detectadas por auditoría.',
          'La lectura correcta combina **tendencias**, **comparaciones** entre productos o líneas y **contexto**: un aumento de desviaciones después de una campaña de reporte puede ser una buena noticia. La revisión por la dirección es el lugar para esa conversación.',
        ],
      },
    ],
    caso: {
      titulo: 'Las desviaciones que bajaron demasiado',
      contexto: 'Después de que la gerencia empezó a publicar el número de desviaciones por área, estas bajaron 60 % en tres meses. En el mismo periodo, las quejas del mercado aumentaron.',
      pregunta: '¿Cómo interpretas los datos?',
      opciones: [
        { texto: 'El sistema mejoró: hay menos desviaciones.', correcta: false, retro: 'Si las quejas suben mientras las desviaciones bajan, lo más probable es que los problemas dejaron de reportarse.' },
        { texto: 'Probable subregistro: la publicación generó miedo a reportar. Hay que revisar la cultura de reporte, medir la calidad de las investigaciones y cruzar con quejas y hallazgos de auditoría.', correcta: true, retro: 'Leer las métricas juntas revela la contradicción; la solución pasa por la cultura y por indicadores del proceso de reporte.' },
        { texto: 'Las quejas no tienen relación con las desviaciones.', correcta: false, retro: 'Muchas quejas tienen su origen en problemas de fabricación que deberían haberse detectado como desviaciones.' },
      ],
    },
    errores: [
      { error: 'Usar el número de desviaciones como meta a reducir sin más.', correccion: 'Mide también la recurrencia, la calidad de la investigación y la eficacia de las CAPA.' },
      { error: 'Ignorar los resultados fuera de especificación invalidados.', correccion: 'Trátalos como señal de alerta sobre el laboratorio y la integridad de los datos.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tres métricas propuso la FDA en 2016?', respuesta: 'Tasa de aceptación de lotes, tasa de quejas de calidad del producto y tasa de resultados fuera de especificación invalidados.' },
      { pregunta: '¿Por qué una caída fuerte de desviaciones puede ser mala noticia?', respuesta: 'Porque puede reflejar subregistro y no una mejora real del proceso.' },
    ],
    resumen: [
      '**Aceptación de lotes, quejas y resultados invalidados**: fabricación, mercado y laboratorio.',
      'Agrega métricas de **desviaciones, CAPA, retiros, estabilidad y capacitación**.',
      'Lee las métricas **juntas** y vigila el **subregistro**.',
    ],
    referencias: [R.fdaMetricas, R.ichQ10, R.fdaOos, R.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de otras métricas', descripcion: 'Tablero ilustrado con seis métricas de calidad y sus gráficos de tendencia.', alt: 'Tablero de métricas de calidad farmacéutica' },
    ],
    keywords: ['métricas de calidad farmacéutica', 'quality metrics fda', 'tasa de aceptación de lotes', 'tasa de quejas de calidad', 'oos invalidados', 'indicadores de capa', 'kpi industria farmacéutica'],
  },
  {
    titulo: 'Revisión por la dirección: entradas, salidas y requisitos (ISO 9001 9.3 e ICH Q10)',
    duracion: 25,
    gancho: {
      titulo: 'Una reunión de dos horas que no decidió nada',
      texto: 'Cada semestre, la dirección de un laboratorio se reúne dos horas para la revisión por la dirección. Se proyectan cuarenta diapositivas, todos asienten y el acta dice «se revisaron los indicadores». Un auditor pregunta qué recursos se asignaron, qué mejoras se aprobaron y qué pasó con las decisiones de la revisión anterior. No hay respuesta. La revisión por la dirección es el momento más importante del SGC, y el más desperdiciado.',
    },
    objetivos: [
      'Enumerar las entradas y salidas de la revisión por la dirección según ISO 9001:2026.',
      'Describir lo que pide ICH Q10 para la revisión por la dirección.',
      'Preparar una revisión por la dirección orientada a decisiones.',
    ],
    conceptos: [
      { icono: 'FileSearch', termino: 'Entradas', definicion: 'La información que la dirección debe considerar: estado de acciones anteriores, cambios de contexto, desempeño del sistema, recursos, eficacia de acciones sobre riesgos y oportunidades de mejora.' },
      { icono: 'FileCheck', termino: 'Salidas', definicion: 'Las decisiones y acciones: oportunidades de mejora, cambios al sistema y necesidades de recursos.' },
      { icono: 'CalendarClock', termino: 'Intervalos planificados', definicion: 'La revisión se hace con una frecuencia definida, además de las revisiones extraordinarias que exijan los eventos.' },
      { icono: 'Archive', termino: 'Información documentada', definicion: 'El registro de la revisión, como evidencia de sus resultados.' },
    ],
    secciones: [
      {
        titulo: 'Lo que pide ISO 9001',
        parrafos: [
          'La cláusula 9.3 de ISO 9001 pide que la alta dirección revise el SGC a **intervalos planificados** para asegurar su conveniencia, adecuación, eficacia y alineación con la dirección estratégica. En la edición 2015, las **entradas** debían incluir: el estado de las acciones de revisiones previas; los cambios en las cuestiones externas e internas; la información sobre el desempeño y la eficacia del sistema, incluidas las tendencias de satisfacción del cliente y retroalimentación de las partes interesadas, el logro de los objetivos de calidad, el desempeño de los procesos y la conformidad de los productos, las no conformidades y acciones correctivas, los resultados de seguimiento y medición, los resultados de las auditorías y el desempeño de los proveedores externos; la adecuación de los recursos; la eficacia de las acciones tomadas para abordar riesgos y oportunidades; y las oportunidades de mejora. La edición 2026 mantiene esta lógica y, en coherencia con la separación entre riesgos y oportunidades, pide revisar por separado la eficacia de las acciones sobre unos y otras; al actualizar el formato del acta, revisa el texto vigente de la norma.',
          'Las **salidas** deben incluir decisiones y acciones relacionadas con las oportunidades de mejora, cualquier necesidad de cambio en el SGC y las necesidades de recursos. La organización debe conservar información documentada como evidencia.',
        ],
      },
      {
        titulo: 'Lo que agrega ICH Q10',
        parrafos: [
          'ICH Q10 pide dos niveles de revisión. La **revisión por la dirección del desempeño del proceso y la calidad del producto** considera los resultados de las inspecciones regulatorias, las auditorías y otras evaluaciones; las revisiones periódicas de calidad, que incluyen medidas de satisfacción del cliente como quejas y retiros, las conclusiones del monitoreo del proceso y del producto, y la eficacia de los cambios y de las CAPA; y el seguimiento de las acciones de revisiones anteriores. Sus resultados son mejoras del proceso y del producto, provisión o reasignación de recursos y captura y difusión del conocimiento.',
          'Además, ICH Q10 pide la **revisión del propio sistema de calidad farmacéutico**: medir el logro de sus objetivos, evaluar indicadores de desempeño y considerar factores externos e internos que puedan afectarlo, como nuevas regulaciones, innovación o cambios en la estructura de la empresa.',
        ],
      },
      {
        titulo: 'Una revisión que decide',
        parrafos: [
          'Una revisión por la dirección útil se **prepara**: cada dueño de proceso trae su análisis (no solo los datos), sus conclusiones y sus propuestas. Se presenta lo **esencial**: tendencias, desviaciones respecto de la meta, riesgos nuevos y decisiones pendientes. Y termina con un **plan**: cada decisión con responsable, fecha y recursos, que será la primera entrada de la siguiente revisión.',
          'La frecuencia depende de la organización: muchos laboratorios hacen una revisión formal semestral o anual y seguimientos trimestrales o mensuales de indicadores críticos. Las situaciones graves (un retiro, una inspección con hallazgos críticos) justifican revisiones extraordinarias.',
        ],
      },
    ],
    proceso: {
      titulo: 'Preparar y ejecutar la revisión',
      pasos: [
        { titulo: 'Convocar con agenda', detalle: 'Fecha, participantes y agenda basada en las entradas de la norma.', icono: 'CalendarClock', evidencia: 'Convocatoria y agenda.' },
        { titulo: 'Preparar por proceso', detalle: 'Cada dueño analiza sus indicadores, riesgos y propuestas.', icono: 'BarChart3', evidencia: 'Informes de proceso.' },
        { titulo: 'Consolidar', detalle: 'Aseguramiento de calidad integra un informe con lo esencial y las decisiones pendientes.', icono: 'Files', evidencia: 'Informe consolidado.' },
        { titulo: 'Revisar y decidir', detalle: 'La dirección analiza, discute y decide.', icono: 'Users', evidencia: 'Decisiones registradas.' },
        { titulo: 'Documentar el plan', detalle: 'Acta con decisiones, responsables, fechas y recursos.', icono: 'FileCheck', evidencia: 'Acta firmada.' },
        { titulo: 'Hacer seguimiento', detalle: 'El estado del plan es la primera entrada de la siguiente revisión.', icono: 'RefreshCw', evidencia: 'Seguimiento del plan.' },
      ],
    },
    caso: {
      titulo: 'El acta sin decisiones',
      contexto: 'El acta de la última revisión por la dirección de un laboratorio dice: «Se revisaron los indicadores del SGC. Se encontraron dentro de lo esperado. Se continuará con el seguimiento».',
      pregunta: '¿Qué le falta según ISO 9001 e ICH Q10?',
      opciones: [
        { texto: 'Nada: si los indicadores están bien, no hay decisiones que tomar.', correcta: false, retro: 'La norma pide salidas sobre mejora, cambios y recursos, y el seguimiento de acciones previas; siempre hay algo que decidir o confirmar.' },
        { texto: 'Evidencia de las entradas requeridas (acciones previas, contexto, auditorías, proveedores, riesgos) y salidas con decisiones de mejora, cambios y recursos, con responsables y fechas.', correcta: true, retro: 'El acta debe demostrar qué se revisó y qué se decidió. Sin eso no hay evidencia de que la revisión cumplió su función.' },
        { texto: 'Solo falta la firma del gerente.', correcta: false, retro: 'La firma no reemplaza el contenido exigido.' },
      ],
    },
    errores: [
      { error: 'Presentaciones largas sin análisis.', correccion: 'Presenta tendencias, conclusiones y propuestas; los datos van en anexos.' },
      { error: 'Decisiones sin responsable ni fecha.', correccion: 'Cada salida debe tener responsable, fecha y recursos.' },
      { error: 'No revisar las acciones de la revisión anterior.', correccion: 'Empieza siempre por el estado del plan anterior.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son las salidas de la revisión por la dirección según ISO 9001?', respuesta: 'Decisiones y acciones sobre oportunidades de mejora, necesidades de cambio en el SGC y necesidades de recursos.' },
      { pregunta: '¿Qué dos revisiones pide ICH Q10?', respuesta: 'La del desempeño del proceso y la calidad del producto, y la del propio sistema de calidad farmacéutico.' },
    ],
    resumen: [
      'ISO 9001 9.3 define **entradas** y **salidas** de la revisión.',
      'ICH Q10 pide revisar el **proceso y el producto** y el **sistema** mismo.',
      'Una buena revisión **decide**: responsables, fechas y recursos.',
    ],
    referencias: [R.iso9001, R.ichQ10, R.eudralexCap1],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Embudo ilustrado: entradas (indicadores, auditorías, quejas, riesgos) arriba y salidas (mejoras, cambios, recursos) abajo.', alt: 'Entradas y salidas de la revisión por la dirección' },
    ],
    keywords: ['revisión por la dirección iso 9001', 'entradas y salidas revisión por la dirección', 'cláusula 9.3 iso 9001', 'revisión por la dirección ich q10', 'acta de revisión por la dirección', 'revisión gerencial sistema de calidad'],
  },
  {
    titulo: 'Caso: ejecutar la revisión por la dirección en un laboratorio colombiano',
    duracion: 30,
    gancho: {
      titulo: 'Laboratorio Andino, primer semestre',
      texto: 'Laboratorio Andino es un fabricante ficticio de sólidos orales en Bogotá, con 18 productos y una planta certificada en BPM. Su directora de aseguramiento debe preparar la revisión por la dirección del primer semestre. Tiene los datos, pero también tiene dos problemas: un aumento de quejas por tabletas rotas y una observación del INVIMA sobre el control de cambios. En este caso vas a preparar la revisión, priorizar los temas y formular las decisiones.',
    },
    objetivos: [
      'Analizar los datos de un semestre y extraer conclusiones para la dirección.',
      'Priorizar los temas por riesgo para el paciente y para el cumplimiento.',
      'Redactar decisiones de revisión por la dirección con responsable, fecha y recursos.',
    ],
    conceptos: [
      { icono: 'BarChart3', termino: 'Datos del semestre', definicion: 'Aceptación de lotes 96,5 % (antes 98,1 %); quejas por tabletas rotas en el producto X: 14 (antes 3); 22 desviaciones, 6 recurrentes; 78 % de CAPA cerradas en plazo; una observación del INVIMA sobre cambios implementados sin evaluación de impacto.' },
      { icono: 'AlertTriangle', termino: 'Riesgos nuevos', definicion: 'Rotación de dos analistas senior; proveedor único de un excipiente crítico; actualización normativa pendiente de revisar.' },
      { icono: 'Lightbulb', termino: 'Oportunidades', definicion: 'Proyecto de registros de lote electrónicos; calificación de un segundo proveedor.' },
    ],
    secciones: [
      {
        titulo: 'Paso 1: analizar, no solo recopilar',
        parrafos: [
          'La aceptación de lotes bajó 1,6 puntos y coincide con el aumento de quejas por tabletas rotas en el producto X. Al revisar las desviaciones, cuatro de las seis recurrentes son de dureza y friabilidad del mismo producto, y todas se cerraron con «ajuste de la máquina» como acción. La conclusión no es «hay más quejas», sino: **el producto X tiene un problema de proceso no resuelto**, probablemente relacionado con la compresión, y las CAPA no fueron eficaces.',
          'La observación del INVIMA sobre el control de cambios es un tema de **cumplimiento** con riesgo regulatorio directo. La rotación de analistas senior es un **riesgo anticipado** para el laboratorio. El proveedor único es un riesgo de **disponibilidad**. Las oportunidades pueden mejorar la integridad de los datos y la resiliencia del suministro.',
        ],
      },
      {
        titulo: 'Paso 2: priorizar por riesgo',
        parrafos: [
          'Primero lo que afecta al **paciente** y al **cumplimiento**: el problema del producto X (quejas en el mercado) y la observación del INVIMA (plazo de respuesta). Luego lo que puede afectar la **capacidad** del sistema: la rotación en el laboratorio y el proveedor único. Por último, las **oportunidades** que requieren inversión y planificación.',
          'Esta priorización evita que la reunión dedique el mismo tiempo a todo. La agenda puede asignar la mitad del tiempo a los dos primeros temas y presentar los demás con propuestas ya preparadas para aprobar.',
        ],
      },
      {
        titulo: 'Paso 3: formular decisiones',
        parrafos: [
          'Decisiones posibles: (1) abrir una investigación formal del proceso de compresión del producto X con un equipo multidisciplinario, con análisis estadístico de dureza y friabilidad por lote y por máquina, liderada por producción con apoyo de aseguramiento, con informe en 45 días; (2) revisar el procedimiento de control de cambios para hacer obligatoria la evaluación de impacto y capacitar a los responsables, y responder al INVIMA en el plazo, a cargo de aseguramiento; (3) plan de retención y transferencia de conocimiento en el laboratorio, a cargo de talento humano y control de calidad; (4) aprobar la calificación de un segundo proveedor del excipiente, con presupuesto asignado.',
          'Además, la revisión debe registrar el **estado de las acciones** de la revisión anterior, confirmar la **adecuación de los recursos** y concluir sobre la **eficacia del SGC**: en este caso, eficaz en lo general, con una debilidad en la eficacia de las CAPA de proceso y en el control de cambios. Esa conclusión honesta es más valiosa que un «todo dentro de lo esperado».',
        ],
      },
    ],
    caso: {
      titulo: 'La decisión sobre el producto X',
      contexto: 'En la reunión, el gerente propone resolver las quejas del producto X reforzando la inspección visual en empaque para separar las tabletas rotas.',
      pregunta: '¿Cuál debe ser la posición de aseguramiento de calidad?',
      opciones: [
        { texto: 'Apoyar la propuesta: elimina la queja rápidamente.', correcta: false, retro: 'La inspección es una corrección que no elimina la causa y puede dejar pasar tabletas con defectos no visibles.' },
        { texto: 'Aceptar la inspección como contención temporal, pero exigir la investigación de causa raíz del proceso de compresión con CAPA y verificación de eficacia.', correcta: true, retro: 'Contener mientras se investiga es correcto; la decisión de fondo debe atacar la causa y verificar que el problema no vuelva.' },
        { texto: 'Retirar todo el producto del mercado.', correcta: false, retro: 'Un retiro se decide con base en una evaluación del riesgo para el paciente; no es la primera respuesta ante quejas de este tipo sin esa evaluación.' },
      ],
    },
    errores: [
      { error: 'Presentar las quejas y las desviaciones como temas separados.', correccion: 'Cruza los datos: muchas veces cuentan la misma historia.' },
      { error: 'Cerrar desviaciones recurrentes con «ajuste de máquina».', correccion: 'Si se repite, la acción no fue eficaz: hay que investigar la causa raíz.' },
      { error: 'Conclusión de eficacia del sistema sin matices.', correccion: 'Di con honestidad dónde funciona el sistema y dónde no.' },
    ],
    comprueba: [
      { pregunta: '¿Qué datos del caso indican un problema de proceso en el producto X?', respuesta: 'La caída en la aceptación de lotes, el aumento de quejas por tabletas rotas y las desviaciones recurrentes de dureza y friabilidad.' },
      { pregunta: '¿Por qué la observación del INVIMA va en la parte alta de la prioridad?', respuesta: 'Porque es un riesgo de cumplimiento con plazo de respuesta y puede afectar la certificación.' },
    ],
    resumen: [
      '**Cruza** los datos: quejas, desviaciones y aceptación de lotes suelen contar la misma historia.',
      '**Prioriza** por riesgo para el paciente y el cumplimiento.',
      'Formula **decisiones** con responsable, fecha y recursos, y concluye con honestidad.',
    ],
    referencias: [R.iso9001, R.ichQ10, R.fdaMetricas, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'En el paso 1', descripcion: 'Gráfico ilustrado de quejas por tabletas rotas por mes junto a la dureza promedio por lote del producto X.', alt: 'Análisis de datos para una revisión por la dirección en un laboratorio' },
    ],
    keywords: ['ejemplo de revisión por la dirección', 'caso práctico revisión por la dirección', 'revisión por la dirección laboratorio farmacéutico', 'cómo preparar la revisión por la dirección', 'acta de revisión gerencial ejemplo'],
  },
];

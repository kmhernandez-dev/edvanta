/**
 * Unidad 3. Planificación y ejecución de la auditoría (8 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: el ciclo de una auditoría individual',
    duracion: 20,
    gancho: {
      titulo: 'Llegar sin avisar a medias',
      texto: 'Un auditor interno llega al almacén un lunes a las 7:00 para auditar la recepción de materias primas. Nadie sabía la hora exacta, el jefe del área está de vacaciones, el registro que quería revisar está en el archivo central y el camión del proveedor llega a las 11:00. Pierde la mañana. La auditoría no falló en la ejecución: falló antes de empezar, porque nadie la inició ni la preparó.',
    },
    objetivos: [
      'Describir las etapas de una auditoría individual según ISO 19011:2026: iniciar, preparar, ejecutar, informar, completar y hacer seguimiento.',
      'Identificar las actividades y los productos de cada etapa.',
      'Relacionar el ciclo de la auditoría con las clases de esta unidad y de la siguiente.',
    ],
    conceptos: [
      { icono: 'DoorOpen', termino: 'Iniciar la auditoría', definicion: 'Establecer contacto con el auditado y determinar la viabilidad de la auditoría: disponibilidad de información, cooperación y recursos.' },
      { icono: 'ClipboardList', termino: 'Preparar la auditoría', definicion: 'Revisar la información documentada, elaborar el plan, asignar el trabajo al equipo y preparar los documentos de trabajo.' },
      { icono: 'Search', termino: 'Ejecutar la auditoría', definicion: 'Reunión de apertura, recolección y verificación de información, generación de hallazgos, conclusiones y reunión de cierre.' },
      { icono: 'FileCheck', termino: 'Informar y dar seguimiento', definicion: 'Preparar y distribuir el informe, completar la auditoría y, cuando aplica, verificar las acciones derivadas de los hallazgos.' },
    ],
    mapa: {
      centro: 'Ciclo de una auditoría',
      ramas: [
        { titulo: 'Iniciar', icono: 'DoorOpen', nodos: ['Contacto con el auditado', 'Viabilidad', 'Método en sitio, remoto o híbrido'] },
        { titulo: 'Preparar', icono: 'ClipboardList', nodos: ['Revisión documental', 'Plan de auditoría', 'Documentos de trabajo'] },
        { titulo: 'Ejecutar', icono: 'Search', nodos: ['Reunión de apertura', 'Evidencia y hallazgos', 'Reunión de cierre'] },
        { titulo: 'Después', icono: 'FileCheck', nodos: ['Informe', 'Completar la auditoría', 'Seguimiento'] },
      ],
    },
    secciones: [
      {
        titulo: 'Iniciar y preparar',
        parrafos: [
          'ISO 19011 describe la realización de una auditoría como una secuencia que empieza mucho antes del día de la visita. **Iniciar** significa que el líder del equipo establece contacto con el auditado para confirmar la comunicación, el acceso a la información, los requisitos legales o contractuales aplicables (por ejemplo, confidencialidad), las condiciones de seguridad e ingreso a las áreas, la presencia de observadores o guías y el método. Con eso se determina la **viabilidad**: si no hay información suficiente o cooperación, se propone una alternativa al cliente de la auditoría.',
          '**Preparar** incluye revisar la información documentada del auditado (procedimientos, mapa de procesos, resultados de auditorías e inspecciones previas, desviaciones y quejas del área) para entender el sistema y detectar dónde enfocar la auditoría; elaborar el **plan**; asignar el trabajo dentro del equipo; y preparar los **documentos de trabajo**: listas de verificación, planes de muestreo y formatos para registrar evidencia. En el caso inicial, una llamada y una revisión de la agenda del almacén habrían bastado.',
        ],
      },
      {
        titulo: 'Ejecutar',
        parrafos: [
          'La ejecución empieza con la **reunión de apertura** y se apoya en una comunicación constante: el equipo se reúne periódicamente para intercambiar información, el líder comunica avances y cualquier preocupación al auditado y, si aparece un riesgo inmediato (por ejemplo, un producto que no debería liberarse), se informa sin esperar al cierre. Se asignan los roles de **guías**, que acompañan y facilitan, y de **observadores**, que no participan en la auditoría.',
          'Durante la ejecución se **recoge y verifica información** mediante entrevistas, observación y revisión de registros; se **generan hallazgos** comparando la evidencia con los criterios; se **determinan las conclusiones** frente a los objetivos y se realiza la **reunión de cierre**. Cada uno de estos pasos tiene su clase en esta unidad y en la siguiente.',
        ],
      },
      {
        titulo: 'Informar, completar y hacer seguimiento',
        parrafos: [
          'El **informe** registra de forma completa, exacta, concisa y clara lo que se auditó y lo que se encontró, y se distribuye a quienes corresponda. La auditoría se **completa** cuando se han realizado todas las actividades planificadas, o las acordadas con el cliente; la información documentada se conserva o se dispone según el programa. Las lecciones aprendidas alimentan la mejora del programa.',
          'El **seguimiento** no siempre forma parte de la auditoría, pero en farmacia casi siempre es necesario: el auditado define correcciones y acciones correctivas, y alguien debe verificar que se implementaron y que fueron **eficaces**. Esa verificación puede hacerse en una auditoría posterior o por revisión de evidencia, y se trata a fondo en la unidad 4.',
        ],
      },
    ],
    caso: {
      titulo: 'Un proveedor que no responde',
      contexto: 'Para preparar la auditoría a un fabricante de excipientes, el líder del equipo solicita el archivo maestro del sitio, el organigrama y el listado de cambios del último año. Tras tres solicitudes, el proveedor no envía nada y propone «que vengan y miren».',
      pregunta: '¿Qué corresponde en la etapa de inicio?',
      opciones: [
        { texto: 'Viajar de todas formas y preparar la auditoría allá.', correcta: false, retro: 'Sin información previa, la auditoría pierde foco y eficiencia. La falta de cooperación es un dato sobre la viabilidad.' },
        { texto: 'Evaluar la viabilidad, informar al cliente de la auditoría y acordar una alternativa: un plazo final para la información, ajustar el alcance o reconsiderar la aprobación del proveedor.', correcta: true, retro: 'Determinar la viabilidad es parte de iniciar la auditoría. La falta de cooperación también informa sobre el riesgo del proveedor.' },
        { texto: 'Cancelar la auditoría y aprobar al proveedor con su certificado.', correcta: false, retro: 'La falta de cooperación no es motivo para aprobar; al contrario, aumenta el riesgo.' },
      ],
    },
    errores: [
      { error: 'Empezar a auditar sin revisión documental previa.', correccion: 'Revisa procedimientos, resultados previos, desviaciones y quejas para enfocar la auditoría.' },
      { error: 'Guardar las no conformidades para el cierre.', correccion: 'Comunica durante la auditoría y escala de inmediato los riesgos urgentes.' },
      { error: 'Dar por terminada la auditoría con el informe.', correccion: 'Planea el seguimiento y la verificación de eficacia de las acciones.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se determina al iniciar una auditoría?', respuesta: 'El contacto con el auditado y la viabilidad: información disponible, cooperación, recursos y método.' },
      { pregunta: '¿Qué diferencia hay entre guía y observador?', respuesta: 'El guía acompaña y facilita al equipo; el observador presencia la auditoría pero no participa en ella.' },
      { pregunta: '¿Cuándo se completa una auditoría?', respuesta: 'Cuando se han realizado todas las actividades planificadas o acordadas con el cliente de la auditoría.' },
    ],
    resumen: [
      'Una auditoría tiene seis etapas: **iniciar, preparar, ejecutar, informar, completar y hacer seguimiento**.',
      'La **viabilidad** y la **preparación** deciden la calidad de la ejecución.',
      'El **seguimiento** cierra el ciclo con la verificación de eficacia.',
    ],
    referencias: [R.iso19011, R.trs986a2, R.ichQ10],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Línea de tiempo horizontal con seis estaciones ilustradas: teléfono (iniciar), carpeta (preparar), lupa (ejecutar), informe, sello de completado y flecha circular de seguimiento.', alt: 'Etapas de una auditoría individual según ISO 19011' },
    ],
    keywords: ['etapas de una auditoría', 'ciclo de auditoría iso 19011', 'cómo preparar una auditoría interna', 'viabilidad de la auditoría', 'realización de la auditoría', 'auditoría interna paso a paso'],
  },

  {
    titulo: 'Elaboración del plan de auditoría',
    duracion: 25,
    gancho: {
      titulo: 'Dos días para todo y nada para lo importante',
      texto: 'El plan de una auditoría interna de dos días asigna la mañana del primer día a revisar el manual de calidad y la política, la tarde a recorrer oficinas administrativas y apenas una hora del segundo día a la sala de fabricación de estériles, que es donde están las desviaciones del semestre. El plan cumplió el formato, pero no el **enfoque basado en riesgos**. Un buen plan distribuye el tiempo según lo que más importa.',
    },
    objetivos: [
      'Identificar los contenidos de un plan de auditoría según ISO 19011:2026.',
      'Distribuir tiempos y recursos del plan según los riesgos y los objetivos de la auditoría.',
      'Acordar el plan con el auditado y ajustarlo durante la auditoría sin perder el objetivo.',
    ],
    conceptos: [
      { icono: 'FileText', termino: 'Plan de auditoría', definicion: 'Descripción de las actividades y los detalles de una auditoría: objetivos, alcance, criterios, lugares, fechas, horarios, métodos, equipo y logística.' },
      { icono: 'Crosshair', termino: 'Áreas de enfoque', definicion: 'Procesos, actividades o registros que el plan prioriza por su riesgo, por hallazgos previos o por cambios recientes.' },
      { icono: 'Clock', termino: 'Agenda', definicion: 'Distribución horaria de las actividades por área, persona y auditor, incluidas las reuniones del equipo y con el auditado.' },
      { icono: 'Repeat', termino: 'Flexibilidad del plan', definicion: 'Capacidad de ajustar la agenda durante la auditoría cuando la evidencia lo exige, siempre que se mantengan los objetivos y se informe al auditado.' },
    ],
    mapa: {
      centro: 'Plan de auditoría',
      ramas: [
        { titulo: 'Qué', icono: 'Target', nodos: ['Objetivos', 'Alcance', 'Criterios'] },
        { titulo: 'Dónde y cuándo', icono: 'MapPin', nodos: ['Lugares físicos o virtuales', 'Fechas y horarios', 'Duración por actividad'] },
        { titulo: 'Cómo', icono: 'Workflow', nodos: ['Métodos y muestreo', 'Áreas de enfoque por riesgo', 'Idioma e informe'] },
        { titulo: 'Quién', icono: 'Users', nodos: ['Equipo y roles', 'Guías y observadores', 'Personas del auditado'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué contiene el plan',
        parrafos: [
          'Según ISO 19011, el plan describe, de forma proporcional al tamaño y complejidad de la auditoría: los **objetivos**; el **alcance**, con los procesos, áreas y periodo que se cubren; los **criterios** y la información documentada de referencia; los **lugares**, fechas, horarios y duración de cada actividad, incluidas las ubicaciones virtuales si las hay; los **métodos** que se usarán, incluido el muestreo; los **roles** del equipo, los guías y los observadores; y los recursos necesarios.',
          'Según el caso, el plan también precisa el representante del auditado, el idioma de trabajo y del informe, los temas que tendrá el informe, la logística (ingreso a áreas, vestimenta, transporte), las medidas de confidencialidad y seguridad de la información, y las acciones de seguimiento previstas. En una planta farmacéutica no puede faltar la indicación de los **requisitos de ingreso** a áreas limpias o de producción: vestuario, entrenamiento y horarios en que el ingreso no afecta la operación.',
        ],
      },
      {
        titulo: 'Repartir el tiempo según el riesgo',
        parrafos: [
          'La revisión documental de la etapa de preparación sirve para identificar las **áreas de enfoque**: procesos con desviaciones recurrentes, resultados fuera de especificación, quejas, cambios recientes, hallazgos abiertos de auditorías o inspecciones previas y operaciones críticas para el paciente. El plan debe darles más tiempo, la persona auditora más competente y, si conviene, un experto técnico.',
          'En el ejemplo inicial, la política y el manual pueden revisarse en una hora; la sala de estériles merece medio día, con observación de operaciones, revisión de registros de lotes con desviaciones y entrevista al personal de turno. También conviene programar la auditoría de una operación **cuando ocurre**: el despeje de línea al inicio del lote, la recepción cuando llega el camión, la toma de muestras de agua en su horario.',
        ],
      },
      {
        titulo: 'Acordar y ajustar',
        parrafos: [
          'El plan se presenta al auditado con anticipación para que organice a las personas y la información, y se confirma en la reunión de apertura. Si el auditado tiene objeciones razonables (una operación no se hará ese día, una persona clave no estará), se resuelven entre el líder del equipo, el auditado y, si hace falta, el cliente de la auditoría.',
          'Durante la auditoría, la evidencia puede obligar a **ajustar el plan**: si en la revisión de un lote aparece un problema que podría afectar a otros, el equipo puede ampliar la muestra o dedicar más tiempo a esa línea. El ajuste se comunica al auditado y queda registrado. Lo que no se hace es abandonar los objetivos ni dejar sin cubrir parte del alcance sin decirlo: si algo no se auditó, el informe debe indicarlo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Elaborar el plan de una autoinspección de dos días',
      pasos: [
        { titulo: 'Confirma objetivos y alcance', detalle: 'Toma del programa el propósito, las áreas y el periodo que se auditan.', icono: 'Target', evidencia: 'Objetivo y alcance escritos.' },
        { titulo: 'Define criterios', detalle: 'Numerales de la guía de inspección y procedimientos internos aplicables.', icono: 'Ruler', evidencia: 'Lista de criterios.' },
        { titulo: 'Identifica áreas de enfoque', detalle: 'Usa desviaciones, quejas, OOS, cambios y hallazgos abiertos.', icono: 'Crosshair', evidencia: 'Áreas priorizadas con su justificación.' },
        { titulo: 'Arma la agenda', detalle: 'Asigna tiempos por riesgo y programa las operaciones cuando ocurren.', icono: 'Clock', evidencia: 'Agenda por hora, área y auditor.' },
        { titulo: 'Asigna roles y logística', detalle: 'Equipo, guías, observadores, requisitos de ingreso y confidencialidad.', icono: 'Users', evidencia: 'Roles y logística confirmados.' },
        { titulo: 'Envía y confirma', detalle: 'Comparte el plan con el auditado y resuelve objeciones antes de la apertura.', icono: 'Signature', evidencia: 'Plan aceptado por el auditado.' },
      ],
    },
    caso: {
      titulo: 'La operación que no se hace los viernes',
      contexto: 'El plan de una auditoría al área de empaque programa para el viernes la observación del despeje de línea y de la conciliación de material impreso. Al enviarlo, el jefe del área responde que los viernes no se empaca porque se hace mantenimiento.',
      pregunta: '¿Cómo se ajusta el plan?',
      opciones: [
        { texto: 'Mantener el viernes y revisar solo los registros de despeje de otros días.', correcta: false, retro: 'Los registros son útiles, pero la observación directa de la operación es la evidencia más fuerte para un proceso crítico como el despeje de línea.' },
        { texto: 'Reprogramar la observación para un día con empaque activo y usar el viernes para revisar registros y entrevistar al personal de mantenimiento.', correcta: true, retro: 'El plan debe auditar las operaciones cuando ocurren. El ajuste mantiene los objetivos y aprovecha el tiempo.' },
        { texto: 'Pedir al área que empaque el viernes solo para la auditoría.', correcta: false, retro: 'Forzar una operación fuera de su programación produce una evidencia poco representativa y puede afectar la planta.' },
      ],
    },
    errores: [
      { error: 'Dar el mismo tiempo a todas las áreas.', correccion: 'Distribuye el tiempo según riesgo, hallazgos previos y cambios.' },
      { error: 'No indicar requisitos de ingreso a áreas limpias.', correccion: 'Incluye vestuario, entrenamiento y horarios de ingreso en la logística del plan.' },
      { error: 'Omitir en el informe lo que no se alcanzó a auditar.', correccion: 'Declara siempre las partes del alcance que no se cubrieron.' },
    ],
    comprueba: [
      { pregunta: 'Menciona cinco contenidos del plan de auditoría.', respuesta: 'Objetivos, alcance, criterios, lugares y horarios, métodos, roles del equipo y recursos.' },
      { pregunta: '¿Cómo se identifican las áreas de enfoque?', respuesta: 'Con desviaciones, OOS, quejas, cambios y hallazgos abiertos revisados en la preparación.' },
      { pregunta: '¿Se puede cambiar el plan durante la auditoría?', respuesta: 'Sí, si la evidencia lo exige, manteniendo los objetivos e informando al auditado.' },
    ],
    resumen: [
      'El plan define **qué, dónde, cuándo, cómo y quién**.',
      'El tiempo se reparte por **riesgo**, y las operaciones se auditan **cuando ocurren**.',
      'El plan se **acuerda** con el auditado y se **ajusta** con transparencia.',
    ],
    referencias: [R.iso19011, R.res1160Compilada, R.trs986a2],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Agenda ilustrada de dos días con bloques de colores por área, más amplios en la zona de estériles, y un ícono de vestuario de área limpia.', alt: 'Plan de auditoría con tiempos distribuidos por riesgo' },
    ],
    keywords: ['plan de auditoría', 'cómo hacer un plan de auditoría interna', 'contenido del plan de auditoría iso 19011', 'agenda de auditoría', 'plan de autoinspección bpm', 'formato plan de auditoría'],
  },

  {
    titulo: 'Listas de verificación basadas en las guías de inspección INVIMA',
    duracion: 25,
    gancho: {
      titulo: 'Cuarenta «sí» y ninguna evidencia',
      texto: 'Una lista de verificación de autoinspección pregunta: «¿Existe procedimiento de limpieza? ¿Se capacita al personal? ¿Se calibran los equipos?». El auditor marca cuarenta veces «sí» en dos horas. Nadie revisó si el procedimiento se cumple, si la capacitación fue antes de operar ni si las calibraciones están vigentes. Una lista de verificación mal diseñada convierte la auditoría en un cuestionario de opinión.',
    },
    objetivos: [
      'Diseñar listas de verificación a partir de los numerales de las guías de inspección de BPM y BPL.',
      'Formular preguntas que pidan evidencia objetiva y no respuestas de sí o no.',
      'Usar la lista como apoyo sin limitar el juicio profesional de quien audita.',
    ],
    conceptos: [
      { icono: 'ClipboardList', termino: 'Lista de verificación', definicion: 'Documento de trabajo que organiza los criterios y las preguntas de la auditoría para asegurar cobertura y registrar evidencia. Es un apoyo, no un límite.' },
      { icono: 'FileSearch', termino: 'Pregunta orientada a evidencia', definicion: 'Pregunta que pide mostrar, demostrar o identificar un registro: «muestre el registro de la última calibración de la balanza B-04 y su certificado».' },
      { icono: 'Layers', termino: 'Trazabilidad al criterio', definicion: 'Cada pregunta de la lista se vincula con el numeral de la guía o del procedimiento que la origina, lo que facilita redactar el hallazgo.' },
      { icono: 'Lightbulb', termino: 'Juicio profesional', definicion: 'Capacidad de seguir una pista que la lista no prevé cuando la evidencia lo justifica.' },
    ],
    mapa: {
      centro: 'Lista de verificación útil',
      ramas: [
        { titulo: 'Origen', icono: 'BookOpen', nodos: ['Guía de inspección', 'Procedimientos internos', 'Hallazgos previos'] },
        { titulo: 'Preguntas', icono: 'Search', nodos: ['Abiertas', 'Piden evidencia', 'Señalan la muestra'] },
        { titulo: 'Registro', icono: 'FileText', nodos: ['Evidencia observada', 'Documento y fecha', 'Resultado'] },
        { titulo: 'Límites', icono: 'Lightbulb', nodos: ['No reemplaza el juicio', 'Se actualiza', 'Proporcional al riesgo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Partir de la guía de inspección',
        parrafos: [
          'La mejor base para una lista de autoinspección es la **guía de inspección** que usará la autoridad: la que adopta la Resolución 1160 de 2016 para BPM o la que corresponde a la Resolución 3619 de 2013 para laboratorios. Así se audita lo mismo que verá el INVIMA, en el mismo orden y con el mismo lenguaje. A partir de ahí se agregan los requisitos de los procedimientos internos, las especificaciones de los registros sanitarios y los compromisos de planes de mejoramiento anteriores.',
          'No es necesario usar toda la guía en cada auditoría. La lista se arma para el alcance de esa auditoría y se proporciona al riesgo: un área de alto riesgo tendrá más preguntas y muestras más grandes. Lo importante es que, a lo largo del programa, todos los numerales queden cubiertos, y que cada pregunta indique el **numeral de origen**.',
        ],
      },
      {
        titulo: 'Cómo redactar preguntas que produzcan evidencia',
        parrafos: [
          'Compara dos versiones. Débil: «¿Se calibran los equipos?». Fuerte: «Seleccione tres equipos críticos del área (incluida la balanza de dispensación) y verifique: programa de calibración, último certificado, trazabilidad de los patrones, estado de calibración en la etiqueta del equipo y uso del equipo después de la fecha de vencimiento». La segunda dice qué muestrear, qué documentos pedir y qué comparar.',
          'Otras transformaciones útiles: de «¿se capacita al personal?» a «para dos operarios que ejecutaron el lote X, verifique la capacitación en la versión vigente del procedimiento antes de la fecha de fabricación»; de «¿hay procedimiento de quejas?» a «tome las tres últimas quejas de calidad y verifique investigación, causa, evaluación de otros lotes, respuesta y tendencias». La lista debe dejar espacio para anotar la **evidencia** (documento, código, fecha, observación) y no solo una casilla.',
        ],
      },
      {
        titulo: 'La lista no es la auditoría',
        parrafos: [
          'ISO 19011 trata las listas de verificación como **documentos de trabajo** que apoyan la auditoría, junto con los planes de muestreo y los formatos de registro. Su riesgo es que la persona auditora se limite a ella y deje de ver lo que la lista no pregunta. Si al revisar un lote aparece una desviación sin investigar, se sigue esa pista aunque no esté en la lista: el juicio profesional manda.',
          'Las listas se revisan después de cada ciclo del programa: se eliminan preguntas que nunca aportan, se agregan las que surgieron de hallazgos, desviaciones o cambios normativos, y se ajustan cuando cambia la guía de inspección. Guardar las listas diligenciadas como registro de la auditoría permite demostrar qué se revisó y con qué muestra.',
        ],
      },
    ],
    proceso: {
      titulo: 'Convertir un numeral de la guía en preguntas',
      pasos: [
        { titulo: 'Toma el numeral', detalle: 'Por ejemplo, el requisito de despeje de línea antes de iniciar el empaque.', icono: 'BookOpen', evidencia: 'Numeral y texto del requisito.' },
        { titulo: 'Identifica qué se debe ver', detalle: 'Procedimiento, registro firmado, verificación independiente y observación.', icono: 'Eye', evidencia: 'Evidencias esperadas.' },
        { titulo: 'Define la muestra', detalle: 'Cuántos lotes o registros revisar y cómo elegirlos.', icono: 'Scan', evidencia: 'Criterio de muestreo.' },
        { titulo: 'Redacta preguntas abiertas', detalle: '«Muestre…», «verifique…», «observe…».', icono: 'Search', evidencia: 'Preguntas orientadas a evidencia.' },
        { titulo: 'Deja espacio para registrar', detalle: 'Columnas para documento, fecha, observación y resultado.', icono: 'FileText', evidencia: 'Formato listo para campo.' },
      ],
    },
    caso: {
      titulo: 'La pregunta que faltaba',
      contexto: 'Mientras aplica la lista del área de dispensación, una auditora nota que una materia prima en estado «cuarentena» está siendo pesada para un lote. La lista no tiene ninguna pregunta sobre el estado de los materiales en dispensación.',
      pregunta: '¿Qué debe hacer?',
      opciones: [
        { texto: 'Seguir con la lista, porque esa pregunta no está en el alcance.', correcta: false, retro: 'El alcance es el área de dispensación; usar material en cuarentena es un riesgo crítico que se debe investigar aunque la lista no lo prevea.' },
        { texto: 'Seguir la pista: verificar el estado en el sistema, el registro del lote y la liberación del material; comunicarlo de inmediato y luego agregar la pregunta a la lista.', correcta: true, retro: 'El juicio profesional va primero. Un posible uso de material no liberado exige verificación y comunicación inmediatas.' },
        { texto: 'Anotarlo como oportunidad de mejora para la próxima auditoría.', correcta: false, retro: 'Usar material no liberado puede comprometer el lote; no es una oportunidad de mejora.' },
      ],
    },
    errores: [
      { error: 'Listas de preguntas de sí o no.', correccion: 'Redacta preguntas que pidan mostrar, verificar u observar, con la muestra indicada.' },
      { error: 'Listas sin numeral de origen.', correccion: 'Vincula cada pregunta con el numeral o procedimiento que la origina.' },
      { error: 'Usar la misma lista durante años.', correccion: 'Actualízala con hallazgos, desviaciones y cambios normativos.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es la mejor base para una lista de autoinspección de BPM?', respuesta: 'La guía de inspección que adopta la Resolución 1160 de 2016, complementada con procedimientos internos.' },
      { pregunta: 'Transforma «¿Se capacita al personal?» en una pregunta orientada a evidencia.', respuesta: 'Para dos operarios del lote X, verifique su capacitación en la versión vigente del procedimiento antes de la fecha de fabricación.' },
      { pregunta: '¿Qué hacer si aparece un riesgo que la lista no prevé?', respuesta: 'Seguir la pista con juicio profesional, comunicarlo y luego actualizar la lista.' },
    ],
    resumen: [
      'Las listas se construyen desde la **guía de inspección** y los procedimientos internos.',
      'Cada pregunta pide **evidencia** e indica la muestra y el numeral.',
      'La lista **apoya** el juicio profesional; no lo reemplaza.',
    ],
    referencias: [R.res1160Compilada, R.res3619Compilada, R.iso19011, R.trs986a2],
    imagenes: [
      { ubicacion: 'Junto a la sección de preguntas', descripcion: 'Comparación ilustrada de dos listas: a la izquierda casillas de sí o no; a la derecha una lista con columnas de numeral, evidencia, documento y fecha.', alt: 'Lista de verificación orientada a evidencia frente a lista de sí o no' },
    ],
    keywords: ['lista de verificación de auditoría', 'checklist autoinspección bpm', 'guía de inspección invima lista de chequeo', 'cómo hacer una lista de verificación de auditoría', 'preguntas de auditoría interna', 'lista de chequeo bpm farmacéutica'],
  },

  {
    titulo: 'La reunión de apertura',
    duracion: 20,
    gancho: {
      titulo: 'Diez minutos que ahorran dos días',
      texto: 'En una auditoría a un laboratorio de análisis contratado, el equipo omite la reunión de apertura «para ganar tiempo». A media mañana descubre que el jefe de calidad no sabía que se revisarían datos electrónicos, que el área de microbiología no puede recibir visitas ese día y que nadie acordó cómo se comunicarían los hallazgos. La tarde se va en aclaraciones. Una apertura de diez minutos bien conducida habría evitado todo eso.',
    },
    objetivos: [
      'Describir el propósito y los temas de la reunión de apertura según ISO 19011:2026.',
      'Conducir una reunión de apertura breve, clara y respetuosa en una auditoría interna o de proveedor.',
      'Acordar en la apertura las reglas de comunicación, confidencialidad, seguridad y clasificación de hallazgos.',
    ],
    conceptos: [
      { icono: 'DoorOpen', termino: 'Reunión de apertura', definicion: 'Reunión con la dirección del auditado y los responsables de las áreas para confirmar el plan, presentar al equipo, asegurar que las actividades se puedan realizar y acordar las reglas de la auditoría.' },
      { icono: 'Users', termino: 'Participantes', definicion: 'El equipo auditor, la dirección del auditado o su representante y los responsables de los procesos o áreas que se auditarán.' },
      { icono: 'Hand', termino: 'Canales de comunicación', definicion: 'Cómo y con quién se comunicará el equipo durante la auditoría, incluidas las alertas urgentes y las posibles no conformidades.' },
      { icono: 'Tag', termino: 'Clasificación de hallazgos', definicion: 'Escala que se usará para calificar los hallazgos (por ejemplo, crítico, mayor y menor), que debe explicarse desde la apertura.' },
    ],
    mapa: {
      centro: 'Reunión de apertura',
      ramas: [
        { titulo: 'Confirmar', icono: 'CheckCircle2', nodos: ['Objetivos, alcance y criterios', 'Plan y agenda', 'Métodos y muestreo'] },
        { titulo: 'Presentar', icono: 'Users', nodos: ['Equipo y roles', 'Guías y observadores', 'Representante del auditado'] },
        { titulo: 'Acordar', icono: 'Hand', nodos: ['Comunicación y alertas', 'Confidencialidad', 'Seguridad e ingreso a áreas'] },
        { titulo: 'Anticipar', icono: 'FileText', nodos: ['Cómo se informarán los hallazgos', 'Reunión de cierre', 'Quejas o apelaciones'] },
      ],
    },
    secciones: [
      {
        titulo: 'Propósito y participantes',
        parrafos: [
          'La reunión de apertura tiene tres propósitos según ISO 19011: confirmar el acuerdo de todas las partes con el plan, presentar al equipo auditor y sus roles, y asegurar que todas las actividades planificadas se puedan realizar. Participan la dirección del auditado o su representante y, según convenga, los responsables de los procesos o áreas que se auditarán. Se registra la asistencia.',
          'Su duración se ajusta al contexto. En una autoinspección interna de un área pequeña puede bastar una conversación de diez minutos con el jefe del área; en una auditoría a un proveedor internacional o en una autoinspección integral conviene una reunión formal con presentación. En ambos casos, el tono es el de una colaboración profesional, no el de una inspección policial.',
        ],
      },
      {
        titulo: 'Los temas que no pueden faltar',
        parrafos: [
          'Además de presentar a los participantes, la apertura confirma los **objetivos, el alcance y los criterios**; el **plan** y la agenda, con cualquier ajuste; los **métodos**, incluido el muestreo y, si aplica, el uso de herramientas remotas; los **canales de comunicación** formales entre el equipo y el auditado; el idioma; la **confidencialidad** y la seguridad de la información, incluida la evidencia digital; y las condiciones de **seguridad**, ingreso a áreas, vestuario y procedimientos de emergencia.',
          'También se explica cómo se informará: cómo se comunicarán las posibles no conformidades durante la auditoría, qué **escala de clasificación** se usará, cuándo será la reunión de cierre y cuándo llegará el informe; las condiciones en las que la auditoría podría darse por terminada (por ejemplo, si no hay acceso a la información o aparece un riesgo grave); y cómo presentar quejas o apelaciones sobre la conducta o las conclusiones de la auditoría.',
        ],
      },
      {
        titulo: 'Guías, observadores y primeras impresiones',
        parrafos: [
          'En la apertura se confirman los **guías** que acompañarán al equipo y sus responsabilidades: facilitar contactos y tiempos, organizar el ingreso a las áreas, velar por la seguridad y presenciar la auditoría en nombre del auditado, sin interferir en ella. Si hay **observadores** (un auditor en formación, un representante del cliente), se informa quiénes son y se recuerda que no participan en la auditoría.',
          'La apertura es la primera impresión del equipo. Puntualidad, una presentación clara, el reconocimiento del tiempo que dedica el auditado y la disposición a escuchar sus preocupaciones crean un ambiente en el que las personas muestran la evidencia con más tranquilidad. Una buena pregunta para cerrar la apertura: «¿Hay algo que debamos saber antes de empezar, como operaciones en curso, cambios recientes o restricciones de acceso?».',
        ],
      },
    ],
    proceso: {
      titulo: 'Guion de una reunión de apertura',
      pasos: [
        { titulo: 'Presentaciones', detalle: 'Equipo, roles, guías, observadores y representantes del auditado; registro de asistencia.', icono: 'Users', evidencia: 'Lista de asistencia.' },
        { titulo: 'Objetivos, alcance y criterios', detalle: 'Confírmalos y aclara qué queda fuera del alcance.', icono: 'Target', evidencia: 'Alcance confirmado.' },
        { titulo: 'Plan y métodos', detalle: 'Revisa la agenda, el muestreo y las herramientas remotas si se usarán.', icono: 'CalendarClock', evidencia: 'Agenda ajustada.' },
        { titulo: 'Reglas de la auditoría', detalle: 'Comunicación, confidencialidad, seguridad, escala de hallazgos y causas de terminación.', icono: 'ShieldCheck', evidencia: 'Reglas acordadas.' },
        { titulo: 'Cierre e informe', detalle: 'Fecha de la reunión de cierre, plazo del informe y manejo de quejas.', icono: 'FileText', evidencia: 'Fechas comunicadas.' },
        { titulo: 'Preguntas', detalle: 'Invita al auditado a plantear dudas o restricciones.', icono: 'Lightbulb', evidencia: 'Dudas resueltas o registradas.' },
      ],
    },
    caso: {
      titulo: 'El jefe que quiere estar en todo',
      contexto: 'En la apertura de una autoinspección, el jefe de producción anuncia que acompañará personalmente al equipo en todas las entrevistas y que responderá él las preguntas «para que los operarios no se confundan».',
      pregunta: '¿Cómo lo maneja el líder del equipo?',
      opciones: [
        { texto: 'Acepta: el jefe conoce mejor el proceso y ahorra tiempo.', correcta: false, retro: 'Si el jefe responde por los operarios, la auditoría pierde la evidencia de cómo se ejecuta realmente la tarea.' },
        { texto: 'Agradece la disposición, acuerda que puede actuar como guía y explica que las preguntas se dirigirán a quien ejecuta la tarea, sin que el guía responda por esa persona.', correcta: true, retro: 'El guía facilita sin interferir. Entrevistar a quien hace el trabajo es esencial para verificar la práctica real.' },
        { texto: 'Le prohíbe estar presente durante toda la auditoría.', correcta: false, retro: 'No es necesario excluirlo; basta con acordar su rol de guía y las reglas de las entrevistas.' },
      ],
    },
    errores: [
      { error: 'Omitir la apertura para ganar tiempo.', correccion: 'Una apertura breve evita malentendidos que cuestan horas.' },
      { error: 'No explicar la escala de clasificación de hallazgos.', correccion: 'Presenta la escala desde el inicio para evitar sorpresas en el cierre.' },
      { error: 'No preguntar por restricciones u operaciones en curso.', correccion: 'Cierra la apertura invitando al auditado a informar lo que el equipo deba saber.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los tres propósitos de la reunión de apertura?', respuesta: 'Confirmar el acuerdo con el plan, presentar al equipo y sus roles y asegurar que las actividades se puedan realizar.' },
      { pregunta: '¿Qué hace un guía durante la auditoría?', respuesta: 'Facilita contactos, tiempos, ingreso y seguridad, y presencia la auditoría sin interferir.' },
      { pregunta: '¿Por qué se explica la escala de clasificación en la apertura?', respuesta: 'Para que el auditado sepa desde el inicio cómo se calificarán los hallazgos y no haya sorpresas en el cierre.' },
    ],
    resumen: [
      'La apertura **confirma el plan, presenta al equipo y asegura la viabilidad** de las actividades.',
      'Se acuerdan **comunicación, confidencialidad, seguridad y escala de hallazgos**.',
      'El tono es de **colaboración profesional**.',
    ],
    referencias: [R.iso19011, R.isoTs17012, R.trs986a2],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Ilustración de una mesa de reunión con el equipo auditor y el equipo del auditado, una pantalla con la agenda y una lista de asistencia.', alt: 'Reunión de apertura de una auditoría en una empresa farmacéutica' },
    ],
    keywords: ['reunión de apertura de auditoría', 'qué se dice en la reunión de apertura', 'apertura auditoría interna iso 19011', 'guías y observadores en auditoría', 'cómo iniciar una auditoría', 'agenda reunión de apertura'],
  },

  {
    titulo: 'Técnicas de entrevista y recolección de evidencia objetiva',
    duracion: 25,
    gancho: {
      titulo: '«Siempre lo hacemos así»',
      texto: 'Ante cada pregunta, la supervisora de envase responde: «siempre lo hacemos así, está en el procedimiento». El auditor anota «cumple» en todo. Días después, una queja por un lote con etiquetas de otro producto revela que el despeje de línea se firmaba al final del turno, no antes de iniciar. Lo que la supervisora dijo era una declaración, no una evidencia. Para convertir declaraciones en evidencia hay que **verificarlas**.',
    },
    objetivos: [
      'Aplicar técnicas de entrevista que favorezcan respuestas verificables.',
      'Combinar entrevista, observación y revisión de registros para verificar la información.',
      'Evaluar la confiabilidad de la evidencia, incluida la integridad de los datos electrónicos.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Entrevista de auditoría', definicion: 'Conversación estructurada con quien ejecuta o dirige una actividad para entender cómo se hace y obtener información verificable. Es uno de los métodos más importantes de recolección.' },
      { icono: 'Shuffle', termino: 'Triangulación', definicion: 'Verificar una misma información con tres fuentes independientes, típicamente lo que se dice, lo que se hace y lo que está registrado.' },
      { icono: 'Fingerprint', termino: 'Integridad de los datos', definicion: 'Que los datos sean atribuibles, legibles, contemporáneos, originales y exactos, además de completos, consistentes, duraderos y disponibles (ALCOA+).' },
      { icono: 'Microchip', termino: 'Métodos de auditoría', definicion: 'ISO 19011 los organiza según haya o no interacción humana y según se hagan en sitio o a distancia: entrevistas, observación, revisión documental y análisis de datos.' },
    ],
    mapa: {
      centro: 'Evidencia confiable',
      ramas: [
        { titulo: 'Lo que se dice', icono: 'Users', nodos: ['Entrevista a quien ejecuta', 'Preguntas abiertas', 'Resumen y confirmación'] },
        { titulo: 'Lo que se hace', icono: 'Eye', nodos: ['Observación directa', 'Demostración de la tarea', 'Recorrido'] },
        { titulo: 'Lo que se registra', icono: 'FileText', nodos: ['Registros en papel', 'Datos electrónicos', 'Pistas de auditoría'] },
        { titulo: 'Confiabilidad', icono: 'Fingerprint', nodos: ['ALCOA+', 'Fuente original', 'Coherencia entre fuentes'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo entrevistar',
        parrafos: [
          'ISO 19011 da pautas claras para las entrevistas: entrevistar a personas de los niveles y funciones adecuados, preferiblemente durante su horario normal y en su lugar de trabajo; ponerlas cómodas y explicar el motivo de la entrevista; empezar pidiendo que describan su trabajo; evitar las preguntas que sugieren la respuesta; resumir y revisar los resultados con la persona entrevistada; y agradecer su participación.',
          'En una planta farmacéutica, esto significa hablar con quien opera la máquina, analiza la muestra o recibe el material, no solo con su jefe. Las preguntas más productivas son del tipo «¿qué hace si…?» («¿qué hace si la báscula marca fuera de tolerancia?», «¿qué hace si el despeje de línea encuentra una etiqueta de otro producto?»), porque revelan si la persona conoce el procedimiento y los límites de su autoridad. La respuesta se contrasta luego con el procedimiento y con los registros.',
        ],
      },
      {
        titulo: 'Triangular: decir, hacer y registrar',
        parrafos: [
          'Una declaración aislada es evidencia débil. La **triangulación** la fortalece: lo que la persona **dice** (entrevista) se compara con lo que **hace** (observación o demostración) y con lo que está **registrado** (documentos y datos). En el caso inicial, observar un despeje de línea real y comparar la hora de la firma con la hora de inicio en el registro del lote habría mostrado la brecha.',
          'ISO 19011 organiza los métodos según haya interacción humana (entrevistas, listas completadas con participación del auditado, revisión de documentos junto con el auditado) o no la haya (revisión documental, observación del trabajo, análisis de datos), y según se apliquen en sitio o a distancia. Combinar métodos es la mejor forma de obtener evidencia suficiente y confiable dentro del tiempo disponible.',
        ],
      },
      {
        titulo: 'Evaluar la confiabilidad de la evidencia',
        parrafos: [
          'No toda la evidencia pesa igual. La observación directa y los registros originales pesan más que una copia o una declaración. En los sistemas computarizados, la evidencia confiable exige revisar la **integridad de los datos**: ¿cada analista tiene usuario propio?, ¿la pista de auditoría está activa y se revisa?, ¿se pueden borrar o reprocesar resultados sin dejar rastro?, ¿los datos originales se conservan? Los principios ALCOA+ (atribuible, legible, contemporáneo, original, exacto, completo, consistente, duradero y disponible) son una guía práctica para estas preguntas.',
          'La guía PI 041 del PIC/S sobre gestión e integridad de datos y la guía de la FDA sobre integridad de datos en las BPM son referencias útiles para preparar estas revisiones. Toda evidencia que se use para un hallazgo debe registrarse con precisión: documento, código, versión, lote, fecha, hora, equipo y persona entrevistada por su cargo, no por su nombre.',
        ],
      },
    ],
    proceso: {
      titulo: 'Entrevistar en el puesto de trabajo',
      pasos: [
        { titulo: 'Prepara', detalle: 'Revisa el procedimiento y los registros recientes de la tarea antes de la entrevista.', icono: 'FileText', evidencia: 'Puntos clave identificados.' },
        { titulo: 'Pon cómoda a la persona', detalle: 'Preséntate, explica el propósito y aclara que se audita el proceso, no a la persona.', icono: 'Hand', evidencia: 'Ambiente de colaboración.' },
        { titulo: 'Pide que describa y muestre', detalle: '«¿Me explica y me muestra cómo lo hace?».', icono: 'Eye', evidencia: 'Descripción y demostración.' },
        { titulo: 'Explora escenarios', detalle: '«¿Qué hace si…?» para verificar conocimiento y límites.', icono: 'Search', evidencia: 'Respuestas contrastables.' },
        { titulo: 'Contrasta', detalle: 'Compara lo dicho con el procedimiento y el registro.', icono: 'Shuffle', evidencia: 'Información triangulada.' },
        { titulo: 'Resume y agradece', detalle: 'Confirma lo entendido y anota hechos verificables.', icono: 'CheckCircle2', evidencia: 'Notas de auditoría precisas.' },
      ],
    },
    caso: {
      titulo: 'El reprocesamiento invisible',
      contexto: 'En el laboratorio, un analista explica que cada resultado del HPLC se procesa una sola vez. Al revisar la pista de auditoría del software para un lote, el auditor encuentra que la misma inyección se reprocesó cuatro veces con distintos parámetros de integración, y solo se reportó la última, que cumplía.',
      pregunta: '¿Qué valor tiene la declaración del analista?',
      opciones: [
        { texto: 'Prevalece la declaración, porque el analista conoce mejor su trabajo.', correcta: false, retro: 'Una declaración contradicha por los datos originales no puede sostener una conclusión.' },
        { texto: 'La pista de auditoría es evidencia más confiable y contradice la declaración: hay un posible problema de integridad de datos que se debe registrar y escalar.', correcta: true, retro: 'La triangulación reveló la brecha. El reprocesamiento no justificado para obtener un resultado conforme es un riesgo serio de integridad de datos.' },
        { texto: 'No se puede concluir nada sin la confesión del analista.', correcta: false, retro: 'La auditoría se basa en evidencia objetiva, no en confesiones. Los registros electrónicos originales son evidencia.' },
      ],
    },
    errores: [
      { error: 'Entrevistar solo a jefes.', correccion: 'Entrevista a quien ejecuta la tarea, en su puesto y en su horario.' },
      { error: 'Aceptar «siempre lo hacemos así» como evidencia.', correccion: 'Verifica con observación y registros: triangula.' },
      { error: 'Revisar solo los reportes impresos del laboratorio.', correccion: 'Revisa datos originales y pistas de auditoría electrónicas.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la triangulación de evidencia?', respuesta: 'Verificar una información comparando lo que se dice, lo que se hace y lo que está registrado.' },
      { pregunta: 'Menciona tres pautas de ISO 19011 para entrevistar.', respuesta: 'Entrevistar en el lugar y horario de trabajo, empezar pidiendo que describan su trabajo y evitar preguntas que sugieran la respuesta.' },
      { pregunta: '¿Qué significa ALCOA?', respuesta: 'Atribuible, legible, contemporáneo, original y exacto; ALCOA+ agrega completo, consistente, duradero y disponible.' },
    ],
    resumen: [
      'Entrevista a **quien ejecuta**, con preguntas abiertas y escenarios.',
      'Una declaración se vuelve evidencia cuando se **triangula** con observación y registros.',
      'En datos electrónicos, verifica la **integridad** con los principios ALCOA+.',
    ],
    referencias: [R.iso19011, R.picsPi041, R.fdaIntegridad, R.res3619Compilada],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Triángulo ilustrado con tres vértices: burbuja de diálogo (lo que se dice), ojo (lo que se hace) y documento (lo que se registra), con una lupa al centro.', alt: 'Triangulación de evidencia en una auditoría' },
    ],
    keywords: ['técnicas de entrevista en auditoría', 'evidencia objetiva de auditoría', 'triangulación de evidencia', 'integridad de datos alcoa auditoría', 'métodos de auditoría iso 19011', 'cómo entrevistar en una auditoría interna'],
  },

  {
    titulo: 'Recorrido de planta y técnicas de muestreo',
    duracion: 25,
    gancho: {
      titulo: 'El lote que eligió el auditado',
      texto: 'Para revisar registros de lote, el auditor pide «uno cualquiera» y el jefe de producción le entrega un lote impecable, sin desviaciones ni enmiendas. La auditoría concluye que los registros cumplen. Meses después, el INVIMA elige tres lotes con desviaciones y encuentra investigaciones incompletas. Quien elige la muestra decide lo que se va a ver. En una auditoría, la muestra la elige **quien audita**.',
    },
    objetivos: [
      'Planear y conducir un recorrido de planta que siga el flujo del producto y respete las reglas de las áreas.',
      'Aplicar muestreo por juicio y muestreo estadístico para seleccionar registros, lotes y equipos.',
      'Usar el rastreo hacia adelante y hacia atrás para verificar la trazabilidad.',
    ],
    conceptos: [
      { icono: 'Route', termino: 'Recorrido de planta', definicion: 'Visita a las instalaciones para observar condiciones, operaciones y comportamientos, siguiendo en lo posible el flujo de materiales, personas y producto.' },
      { icono: 'Crosshair', termino: 'Muestreo por juicio', definicion: 'Selección basada en el conocimiento y la experiencia de quien audita, orientada al riesgo: lotes con desviaciones, quejas, cambios o reprocesos.' },
      { icono: 'Sigma', termino: 'Muestreo estadístico', definicion: 'Selección aleatoria o sistemática que permite que cada elemento tenga probabilidad de ser elegido y facilita conclusiones sobre la población.' },
      { icono: 'GitBranch', termino: 'Rastreo', definicion: 'Seguir un lote desde las materias primas hasta la distribución (hacia adelante) o desde el producto hasta sus materiales y registros de origen (hacia atrás).' },
    ],
    mapa: {
      centro: 'Ver y muestrear bien',
      ramas: [
        { titulo: 'Recorrido', icono: 'Route', nodos: ['Seguir el flujo del producto', 'Respetar vestuario y accesos', 'Observar sin interrumpir'] },
        { titulo: 'Qué mirar', icono: 'Eye', nodos: ['Estado e identificación', 'Limpieza y orden', 'Diferenciales y registros en sitio'] },
        { titulo: 'Muestreo', icono: 'Crosshair', nodos: ['Por juicio: riesgo', 'Estadístico: representatividad', 'Lo elige quien audita'] },
        { titulo: 'Rastreo', icono: 'GitBranch', nodos: ['Hacia adelante', 'Hacia atrás', 'Trazabilidad completa'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo recorrer una planta farmacéutica',
        parrafos: [
          'ISO 19011 recomienda, al visitar las instalaciones del auditado, considerar la seguridad, los requisitos de ingreso y de equipos de protección, minimizar las interferencias con la operación y respetar la confidencialidad. En farmacia, esto incluye seguir los procedimientos de **vestuario y acceso** a áreas limpias, no tocar productos ni equipos sin autorización y coordinar con el guía los momentos de ingreso para no comprometer operaciones asépticas.',
          'Un recorrido eficaz sigue el **flujo**: recepción de materiales, muestreo, almacenamiento en cuarentena y liberados, dispensación, fabricación, envase, cuarentena de producto terminado, almacenamiento y despacho. En cada punto se observa el estado e identificación de materiales y equipos, la limpieza y el orden, los diferenciales de presión y las condiciones ambientales, el comportamiento del personal y los registros que se diligencian en el puesto. Lo que se ve se anota con hora y lugar, y se contrasta después con los registros.',
        ],
      },
      {
        titulo: 'Muestreo: por juicio y estadístico',
        parrafos: [
          'Toda auditoría trabaja con muestras, porque es imposible revisar todos los lotes, registros o equipos. ISO 19011 distingue el **muestreo por juicio**, que depende del conocimiento y la experiencia de quien audita, y el **muestreo estadístico**, que usa métodos aleatorios o sistemáticos. El primero permite enfocarse en el riesgo; el segundo, sacar conclusiones más representativas de toda la población.',
          'En la práctica conviene combinarlos: elegir por juicio los lotes con desviaciones, quejas, reprocesos o cambios, y sumar algunos elegidos al azar de la lista completa del periodo. La muestra la selecciona siempre **quien audita**, a partir de listados completos (por ejemplo, el registro de lotes fabricados del semestre), nunca la elige el auditado. El tamaño de la muestra y su criterio se anotan, porque toda conclusión depende de ellos y el informe debe reconocer el límite del muestreo.',
        ],
      },
      {
        titulo: 'Rastrear para verificar la trazabilidad',
        parrafos: [
          'El **rastreo** es una de las técnicas más potentes en farmacia. Hacia atrás: se parte de un lote de producto terminado y se verifican sus materias primas (con su análisis y liberación), el material de envase, los equipos usados (con su limpieza y calificación), el personal (con su capacitación), las condiciones ambientales y las desviaciones asociadas. Hacia adelante: se parte de un lote de materia prima y se verifica en qué lotes de producto se usó y a qué clientes se distribuyeron.',
          'El rastreo revela fallas que las revisiones aisladas no ven: una materia prima usada antes de su liberación, una balanza fuera de calibración en la fecha de pesaje, un operario sin capacitación vigente o una desviación que afectaba a otros lotes y no se evaluó. Es también la base para verificar la capacidad de **retiro de producto** del mercado, que las BPM exigen.',
        ],
      },
    ],
    proceso: {
      titulo: 'Rastreo hacia atrás de un lote',
      pasos: [
        { titulo: 'Elige el lote', detalle: 'Por juicio (desviaciones o quejas) o al azar desde el listado completo.', icono: 'Crosshair', evidencia: 'Lote y criterio de selección.' },
        { titulo: 'Revisa el registro del lote', detalle: 'Completo, contemporáneo, con despejes, controles en proceso y conciliaciones.', icono: 'FileText', evidencia: 'Registro de lote revisado.' },
        { titulo: 'Verifica materiales', detalle: 'Análisis, liberación y fechas de uso de materias primas y envases.', icono: 'Package', evidencia: 'Certificados y estados verificados.' },
        { titulo: 'Verifica equipos y personas', detalle: 'Limpieza, calibración y calificación en la fecha; capacitación vigente.', icono: 'Wrench', evidencia: 'Registros de equipos y capacitación.' },
        { titulo: 'Verifica desviaciones', detalle: 'Investigación, causa, impacto en otros lotes y cierre.', icono: 'AlertTriangle', evidencia: 'Desviaciones evaluadas.' },
        { titulo: 'Verifica liberación', detalle: 'Revisión del registro, análisis de producto terminado y firma de liberación.', icono: 'CheckCircle2', evidencia: 'Liberación conforme o hallazgo.' },
      ],
    },
    caso: {
      titulo: 'La muestra del almacén',
      contexto: 'Para verificar las fechas de vencimiento en el almacén de producto terminado, el auditor puede revisar 20 posiciones de estantería. El jefe del almacén sugiere empezar por el pasillo 1, «que está más organizado».',
      pregunta: '¿Cómo debe seleccionar la muestra?',
      opciones: [
        { texto: 'Seguir la sugerencia para no incomodar al auditado.', correcta: false, retro: 'Si el auditado elige la muestra, la evidencia pierde objetividad.' },
        { texto: 'Combinar posiciones elegidas por riesgo (productos de baja rotación o próximos a vencer según el sistema) con posiciones al azar de todo el almacén, elegidas por el auditor.', correcta: true, retro: 'La combinación de muestreo por juicio y estadístico da foco en el riesgo y representatividad, y la selección es del auditor.' },
        { texto: 'Revisar todo el almacén para no tener que muestrear.', correcta: false, retro: 'Revisar el cien por ciento casi nunca es viable ni necesario; un muestreo bien diseñado es más eficiente.' },
      ],
    },
    errores: [
      { error: 'Dejar que el auditado elija los lotes o registros.', correccion: 'Selecciona tú la muestra a partir de listados completos.' },
      { error: 'Ingresar a áreas limpias sin seguir su procedimiento.', correccion: 'Coordina con el guía y cumple vestuario y accesos.' },
      { error: 'No documentar el criterio y tamaño de la muestra.', correccion: 'Anótalos: toda conclusión depende de ellos.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre muestreo por juicio y estadístico?', respuesta: 'El primero se basa en el conocimiento y el riesgo; el segundo usa selección aleatoria o sistemática para obtener representatividad.' },
      { pregunta: '¿Qué es el rastreo hacia atrás?', respuesta: 'Partir de un lote de producto y verificar sus materiales, equipos, personas, condiciones y desviaciones de origen.' },
      { pregunta: '¿Por qué el recorrido debe seguir el flujo del producto?', respuesta: 'Porque permite verificar la secuencia de estados, controles y registros, y detectar riesgos de mezcla o contaminación.' },
    ],
    resumen: [
      'Recorre la planta **siguiendo el flujo** y respetando las reglas de las áreas.',
      'Combina **muestreo por juicio** y **estadístico**; la muestra la elige quien audita.',
      'El **rastreo** hacia atrás y hacia adelante revela fallas de trazabilidad.',
    ],
    referencias: [R.iso19011, R.trs986a2, R.res1160Compilada, R.picsParte1],
    imagenes: [
      { ubicacion: 'Junto a la sección de rastreo', descripcion: 'Diagrama de flujo de una planta con flechas desde la recepción hasta el despacho y una línea punteada que rastrea un lote hacia sus materias primas.', alt: 'Rastreo de un lote a lo largo del flujo de una planta farmacéutica' },
    ],
    keywords: ['recorrido de planta auditoría', 'muestreo de auditoría', 'muestreo por juicio y estadístico', 'rastreo de lote auditoría bpm', 'trazabilidad en auditoría farmacéutica', 'cómo seleccionar la muestra en una auditoría'],
  },

  {
    titulo: 'Auditoría a proveedores y fabricantes por contrato',
    duracion: 25,
    gancho: {
      titulo: 'El certificado que no lo decía todo',
      texto: 'Un laboratorio aprobó a un nuevo proveedor de principio activo con base en su certificado de BPM y un cuestionario. Un año después, una investigación por impurezas revela que el proveedor había cambiado el solvente de cristalización sin notificar, porque el acuerdo de calidad nunca exigió informar los cambios. El certificado decía que la planta cumplía BPM; no decía que el proceso seguía siendo el mismo que se aprobó.',
    },
    objetivos: [
      'Explicar el papel de la auditoría en la selección, aprobación y seguimiento de proveedores y fabricantes por contrato.',
      'Definir el alcance y los criterios de una auditoría de segunda parte, con el acuerdo de calidad como referencia.',
      'Decidir, con base en el riesgo, la frecuencia y el método de auditoría de cada proveedor.',
    ],
    conceptos: [
      { icono: 'Truck', termino: 'Proveedor crítico', definicion: 'Proveedor cuyo material o servicio puede afectar directamente la calidad, la seguridad o la eficacia del producto: principios activos, excipientes críticos, material de envase primario, fabricación o análisis por contrato.' },
      { icono: 'FileCheck', termino: 'Acuerdo de calidad', definicion: 'Documento que define las responsabilidades de calidad de cada parte: especificaciones, control de cambios, desviaciones, liberación, quejas, auditorías y comunicación.' },
      { icono: 'BadgeCheck', termino: 'Calificación de proveedores', definicion: 'Proceso para aprobar y mantener a un proveedor: evaluación inicial (documental y, según el riesgo, auditoría), aprobación, seguimiento del desempeño y reevaluación periódica.' },
      { icono: 'Factory', termino: 'Actividad contratada', definicion: 'Fabricación, análisis u otra actividad de BPM que una empresa encarga a otra. El contratante sigue siendo responsable de la calidad del producto.' },
    ],
    mapa: {
      centro: 'Auditoría de segunda parte',
      ramas: [
        { titulo: 'Antes', icono: 'Search', nodos: ['Cuestionario y documentos', 'Riesgo del material', 'Decisión de auditar en sitio'] },
        { titulo: 'Criterios', icono: 'Ruler', nodos: ['BPM aplicables', 'Especificaciones', 'Acuerdo de calidad'] },
        { titulo: 'Durante', icono: 'Factory', nodos: ['Proceso y cambios', 'Control de calidad', 'Integridad de datos'] },
        { titulo: 'Después', icono: 'BadgeCheck', nodos: ['Aprobar, condicionar o descalificar', 'Seguimiento del desempeño', 'Reevaluación periódica'] },
      ],
    },
    secciones: [
      {
        titulo: 'Por qué auditar a proveedores',
        parrafos: [
          'ICH Q10 establece que la empresa farmacéutica es responsable de asegurar el control de las actividades contratadas y de la calidad de los materiales comprados. Las BPM de la OMS, base de la Resolución 1160 de 2016, piden que la fabricación y el análisis por contrato estén definidos, acordados y controlados mediante un contrato escrito, y que el contratante evalúe la competencia del contratista. Para los fabricantes de principios activos, ICH Q7 es la referencia de BPM que conviene usar como criterio.',
          'La auditoría de segunda parte es la herramienta para obtener evidencia directa: permite ver el proceso real, el control de cambios, las desviaciones, el laboratorio y la integridad de los datos del proveedor. Un certificado de BPM de la autoridad del país del proveedor es una entrada valiosa, pero no reemplaza la evaluación del contratante, porque no garantiza que el proceso, el sitio o los métodos sean los mismos que se aprobaron para su producto.',
        ],
      },
      {
        titulo: 'Qué se audita y con qué criterios',
        parrafos: [
          'Los criterios combinan las **BPM aplicables** al proveedor, las **especificaciones** del material y el **acuerdo de calidad**. El alcance típico incluye el sistema de calidad, el control de cambios (especialmente cambios de proceso, sitio, solventes o proveedores de los proveedores), la gestión de desviaciones y resultados fuera de especificación, la validación del proceso y de los métodos, el laboratorio, el almacenamiento y transporte, las quejas y retiros, y la integridad de los datos. En un fabricante por contrato se agrega la verificación de los registros de lote del producto propio.',
          'El **acuerdo de calidad** merece atención especial: la guía de la FDA sobre acuerdos de calidad en la fabricación por contrato describe con claridad qué debe definir, como quién libera, cómo se notifican los cambios y las desviaciones, quién maneja las quejas y el derecho del contratante a auditar. En el caso inicial, una cláusula de notificación previa de cambios, verificada en la auditoría, habría evitado el problema.',
        ],
      },
      {
        titulo: 'Frecuencia, método y decisión',
        parrafos: [
          'La frecuencia y el método se deciden por **riesgo**: impacto del material en el producto, historial de calidad (rechazos, quejas, desviaciones), resultados de auditorías previas, inspecciones de autoridades y cambios. Un proveedor de principio activo para un medicamento estéril suele requerir auditoría en sitio antes de su aprobación y reevaluaciones periódicas; un proveedor de excipientes de bajo riesgo con buen desempeño puede evaluarse con cuestionario, revisión documental o auditoría remota.',
          'El resultado de la auditoría alimenta una decisión documentada: **aprobar**, **aprobar con condiciones** (con un plan de acciones y su seguimiento) o **no aprobar o descalificar**. Después, el desempeño se sigue con indicadores (lotes rechazados, entregas, quejas, respuestas a desviaciones) y se reevalúa en el periodo definido. Los hallazgos de la auditoría al proveedor se gestionan igual que los internos: con plan de acción, seguimiento y verificación de eficacia.',
        ],
      },
    ],
    proceso: {
      titulo: 'Del proveedor nuevo al proveedor aprobado',
      pasos: [
        { titulo: 'Clasifica el riesgo', detalle: 'Impacto del material o servicio en el producto y en el paciente.', icono: 'Gauge', evidencia: 'Clasificación del proveedor.' },
        { titulo: 'Evalúa documentos', detalle: 'Cuestionario, certificados, archivo maestro del sitio y especificaciones.', icono: 'Files', evidencia: 'Evaluación documental.' },
        { titulo: 'Decide el método', detalle: 'En sitio, remoto o documental, según el riesgo y la información disponible.', icono: 'Route', evidencia: 'Decisión justificada.' },
        { titulo: 'Audita', detalle: 'Con las BPM aplicables, las especificaciones y el borrador del acuerdo de calidad.', icono: 'Search', evidencia: 'Informe de auditoría.' },
        { titulo: 'Firma el acuerdo y decide', detalle: 'Aprueba, condiciona o rechaza, y firma el acuerdo de calidad.', icono: 'Signature', evidencia: 'Acuerdo firmado y decisión registrada.' },
        { titulo: 'Sigue el desempeño', detalle: 'Indicadores y reevaluación periódica por riesgo.', icono: 'LineChart', evidencia: 'Evaluaciones de desempeño.' },
      ],
    },
    caso: {
      titulo: 'El laboratorio externo más barato',
      contexto: 'Para reducir costos, la gerencia propone contratar los análisis microbiológicos con un laboratorio externo nuevo, que ofrece precios 40 % menores y entrega su acreditación ISO/IEC 17025 vigente para otros ensayos, no para los que se contratarían.',
      pregunta: '¿Qué debe hacer aseguramiento de la calidad antes de aprobarlo?',
      opciones: [
        { texto: 'Aprobarlo, porque la acreditación demuestra su competencia.', correcta: false, retro: 'La acreditación no cubre los ensayos contratados. No demuestra la competencia para ese alcance.' },
        { texto: 'Evaluarlo como proveedor crítico: auditoría con la Resolución 3619 de 2013 como criterio, verificación de la validación de los métodos contratados, integridad de datos y acuerdo de calidad firmado antes de enviar muestras.', correcta: true, retro: 'El análisis por contrato sigue bajo la responsabilidad del contratante, que debe verificar la competencia para los ensayos específicos.' },
        { texto: 'Enviar muestras en paralelo durante un mes y aprobar si los resultados coinciden.', correcta: false, retro: 'Comparar resultados ayuda, pero no reemplaza la evaluación del sistema de calidad, los métodos y la integridad de los datos.' },
      ],
    },
    errores: [
      { error: 'Aprobar proveedores críticos solo con certificados.', correccion: 'Evalúa por riesgo, con auditoría cuando el impacto lo exige.' },
      { error: 'Acuerdos de calidad sin notificación de cambios.', correccion: 'Exige notificación previa de cambios de proceso, sitio, materiales y métodos.' },
      { error: 'No hacer seguimiento a los hallazgos del proveedor.', correccion: 'Gestiónalos con plan de acción, seguimiento y verificación de eficacia.' },
    ],
    comprueba: [
      { pregunta: '¿Quién es responsable de la calidad de una actividad contratada?', respuesta: 'El contratante sigue siendo responsable, según ICH Q10 y las BPM.' },
      { pregunta: '¿Qué criterios se usan en una auditoría de segunda parte?', respuesta: 'Las BPM aplicables, las especificaciones del material y el acuerdo de calidad.' },
      { pregunta: '¿Qué decisiones puede generar la auditoría de un proveedor?', respuesta: 'Aprobar, aprobar con condiciones o no aprobar o descalificar.' },
    ],
    resumen: [
      'El contratante **sigue siendo responsable** de la calidad de lo que compra o contrata.',
      'El **acuerdo de calidad** es criterio de auditoría y debe exigir la notificación de cambios.',
      'Frecuencia y método se deciden por **riesgo**; el desempeño se sigue con indicadores.',
    ],
    referencias: [R.ichQ10, R.ichQ7, R.fdaAcuerdos, R.trs986a2, R.res3619Compilada],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Ilustración de una cadena de suministro con un fabricante de principio activo, un proveedor de envase y un laboratorio contratado, unidos por un documento de acuerdo de calidad.', alt: 'Auditoría de proveedores y acuerdo de calidad en la cadena de suministro farmacéutica' },
    ],
    keywords: ['auditoría a proveedores farmacéuticos', 'calificación de proveedores bpm', 'acuerdo de calidad fabricación por contrato', 'auditoría de segunda parte', 'auditoría a fabricante de principio activo', 'evaluación de proveedores críticos'],
  },

  {
    titulo: 'Auditorías remotas e híbridas',
    duracion: 25,
    gancho: {
      titulo: 'La cámara que no entró al área',
      texto: 'Durante una auditoría remota a un fabricante de cápsulas, el guía muestra con su celular la sala de encapsulado. Todo se ve ordenado, pero la cámara nunca enfoca la parte trasera de la máquina ni el área de lavado, y cuando el auditor pide ver el diferencial de presión, la conexión «se cae». Las auditorías remotas son útiles y llegaron para quedarse, pero tienen límites que hay que conocer y gestionar.',
    },
    objetivos: [
      'Explicar cómo ISO 19011:2026 e ISO/IEC TS 17012:2024 orientan el uso de métodos de auditoría remotos.',
      'Decidir cuándo una auditoría puede ser remota, híbrida o debe ser en sitio, con base en el riesgo.',
      'Aplicar buenas prácticas de tecnología, seguridad de la información y verificación de la evidencia a distancia.',
    ],
    conceptos: [
      { icono: 'Globe', termino: 'Método de auditoría remoto', definicion: 'Forma de obtener y evaluar evidencia sin presencia física en el lugar, mediante tecnologías de la información y las comunicaciones: videollamadas, documentos compartidos, recorridos con cámara o análisis de datos.' },
      { icono: 'Split', termino: 'Auditoría híbrida', definicion: 'Combinación de actividades en sitio y a distancia en una misma auditoría, por ejemplo revisión documental remota y verificación de áreas en sitio.' },
      { icono: 'Database', termino: 'Ubicación virtual', definicion: 'Lugar donde la organización realiza trabajo o presta un servicio en un entorno en línea, como un sistema en la nube o una plataforma de trabajo remoto.' },
      { icono: 'Lock', termino: 'Seguridad de la evidencia digital', definicion: 'Protección de la confidencialidad, la integridad y el acceso controlado a los documentos, grabaciones y capturas que se usan como evidencia.' },
    ],
    mapa: {
      centro: 'Auditar a distancia',
      ramas: [
        { titulo: 'Referencias', icono: 'BookOpen', nodos: ['ISO 19011:2026', 'ISO/IEC TS 17012:2024', 'Decreto 335: visitas virtuales o mixtas'] },
        { titulo: 'Funciona bien para', icono: 'CheckCircle2', nodos: ['Revisión documental', 'Entrevistas', 'Análisis de datos'] },
        { titulo: 'Tiene límites en', icono: 'AlertTriangle', nodos: ['Condiciones físicas de áreas', 'Comportamiento en operación', 'Verificación de integridad en sitio'] },
        { titulo: 'Requisitos', icono: 'Lock', nodos: ['Prueba de la tecnología', 'Seguridad de la información', 'Plan alternativo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué dicen las normas',
        parrafos: [
          'La auditoría remota dejó de ser una excepción. La especificación técnica **ISO/IEC TS 17012:2024** orienta el uso de métodos remotos para auditar sistemas de gestión y aclara que no pretenden reemplazar los métodos en sitio, sino servir como herramienta para auditar de manera eficaz y eficiente. La **ISO 19011:2026** incorpora esa orientación: amplía su anexo A con guía sobre métodos remotos y ubicaciones virtuales, y trata los métodos en sitio, remotos e híbridos como opciones que se deciden según el riesgo.',
          'En el ámbito regulatorio, el **Decreto 335 de 2022** permite que el INVIMA haga sus visitas de certificación, renovación y ampliación de forma presencial, virtual o mixta. Otras autoridades también han formalizado evaluaciones remotas; la FDA, por ejemplo, publicó una guía de preguntas y respuestas sobre evaluaciones regulatorias remotas. Para una empresa farmacéutica, esto significa que debe saber auditar a distancia y también **ser auditada** a distancia.',
        ],
      },
      {
        titulo: 'Cuándo sí y cuándo no',
        parrafos: [
          'Los métodos remotos funcionan bien para la **revisión documental** (procedimientos, registros, informes de validación), las **entrevistas**, el análisis de datos y tendencias, y el seguimiento de acciones correctivas que se demuestran con evidencia documental. Son útiles cuando hay restricciones de viaje, cuando el riesgo del proveedor es bajo o medio, o como preparación para una visita en sitio más corta y enfocada.',
          'Tienen límites claros cuando lo que se necesita verificar es **físico o de comportamiento**: condiciones de áreas limpias, flujos de personal y materiales, estado de equipos, prácticas asépticas o la integridad de los datos en los sistemas del laboratorio. La decisión se toma por riesgo y se documenta, junto con las limitaciones del método. Si durante una auditoría remota la evidencia no permite llegar a una conclusión confiable, el equipo debe decirlo y proponer una verificación en sitio.',
        ],
      },
      {
        titulo: 'Buenas prácticas para auditar a distancia',
        parrafos: [
          'Antes: verificar con el auditado la **capacidad tecnológica** (plataforma, conexión, cámara móvil, acceso a sistemas), hacer una prueba, acordar las reglas de **seguridad de la información** (qué se comparte, por qué canal, si se permite grabar o tomar capturas, cuándo se eliminan) y preparar un plan alternativo si falla la conexión. El plan de auditoría debe indicar qué actividades serán remotas y cuáles en sitio.',
          'Durante: pedir que la cámara muestre lo que el equipo solicita, no lo que el guía elige; solicitar documentos en tiempo real y no solo los preparados con anticipación; verificar la identidad de las personas entrevistadas; y tomar pausas, porque la fatiga es mayor a distancia. Después: el informe debe declarar los **métodos usados** y sus limitaciones. Una conexión que «se cae» justo ante cierta evidencia es, en sí misma, un dato que el equipo debe registrar.',
        ],
      },
    ],
    proceso: {
      titulo: 'Decidir y preparar una auditoría remota',
      pasos: [
        { titulo: 'Evalúa el riesgo', detalle: 'Qué evidencia se necesita y si se puede obtener de forma confiable a distancia.', icono: 'Gauge', evidencia: 'Justificación del método.' },
        { titulo: 'Verifica la capacidad del auditado', detalle: 'Plataforma, conexión, cámara móvil y acceso a sistemas.', icono: 'Cpu', evidencia: 'Prueba técnica realizada.' },
        { titulo: 'Acuerda la seguridad', detalle: 'Canales, grabaciones, capturas, conservación y eliminación de evidencia.', icono: 'Lock', evidencia: 'Reglas de seguridad acordadas.' },
        { titulo: 'Planifica en detalle', detalle: 'Actividades remotas y en sitio, tiempos, pausas y plan alternativo.', icono: 'CalendarClock', evidencia: 'Plan de auditoría híbrido o remoto.' },
        { titulo: 'Ejecuta y verifica', detalle: 'Pide en tiempo real y dirige la cámara a lo que necesitas ver.', icono: 'Scan', evidencia: 'Evidencia obtenida y verificada.' },
        { titulo: 'Declara limitaciones', detalle: 'El informe indica los métodos y lo que no se pudo verificar.', icono: 'FileText', evidencia: 'Informe con métodos y límites.' },
      ],
    },
    caso: {
      titulo: 'Proveedor de estériles en otro continente',
      contexto: 'Un laboratorio necesita reevaluar a su fabricante por contrato de inyectables, ubicado en otro continente. El presupuesto de viajes está congelado y el proveedor propone una auditoría totalmente remota. En la última auditoría en sitio hubo hallazgos en prácticas asépticas.',
      pregunta: '¿Qué decisión es más defendible?',
      opciones: [
        { texto: 'Auditoría totalmente remota, porque ISO 19011:2026 la acepta como método válido.', correcta: false, retro: 'La norma la acepta como opción, pero la decisión es por riesgo. Con hallazgos previos en prácticas asépticas, la evidencia física es indispensable.' },
        { texto: 'Auditoría híbrida: revisión documental y entrevistas remotas ahora, y verificación en sitio de las áreas asépticas tan pronto sea posible, con el riesgo documentado.', correcta: true, retro: 'Combina eficiencia con la evidencia física que exige el riesgo, y deja trazable la decisión y sus limitaciones.' },
        { texto: 'Aplazar la reevaluación hasta que haya presupuesto.', correcta: false, retro: 'Aplazar sin medidas deja sin control a un proveedor de alto riesgo con hallazgos previos.' },
      ],
    },
    errores: [
      { error: 'Elegir auditoría remota solo por costo.', correccion: 'Decide por riesgo y por la evidencia que necesitas verificar.' },
      { error: 'Grabar sin acuerdo previo.', correccion: 'Acuerda grabaciones, capturas y su eliminación desde la preparación.' },
      { error: 'Omitir en el informe los límites del método.', correccion: 'Declara siempre los métodos usados y lo que no se pudo verificar.' },
    ],
    comprueba: [
      { pregunta: '¿Qué especificación técnica orienta los métodos de auditoría remotos?', respuesta: 'La ISO/IEC TS 17012:2024, cuya guía incorpora la ISO 19011:2026.' },
      { pregunta: '¿Para qué funcionan bien los métodos remotos?', respuesta: 'Revisión documental, entrevistas, análisis de datos y seguimiento de acciones con evidencia documental.' },
      { pregunta: '¿Cómo puede hacer el INVIMA sus visitas de certificación según el Decreto 335 de 2022?', respuesta: 'De forma presencial, virtual o mixta.' },
    ],
    resumen: [
      'Los métodos remotos son **una herramienta, no un reemplazo**, según ISO/IEC TS 17012 e ISO 19011:2026.',
      'Lo físico y lo conductual suelen exigir **presencia**; decide por riesgo.',
      'Prueba la tecnología, protege la **evidencia digital** y declara los **límites** en el informe.',
    ],
    referencias: [R.iso19011, R.isoTs17012, R.tc176Iso19011, R.dec335Compilado],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Pantalla de videollamada ilustrada con una sala de encapsulado vista desde un celular, un recuadro con documentos compartidos y un candado que representa la seguridad de la información.', alt: 'Auditoría remota a un fabricante farmacéutico con evidencia compartida en línea' },
    ],
    keywords: ['auditoría remota', 'auditoría híbrida', 'iso iec ts 17012', 'iso 19011 2026 auditoría remota', 'visita virtual invima', 'cómo hacer una auditoría remota a proveedores'],
  },
];

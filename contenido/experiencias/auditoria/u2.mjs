/**
 * Unidad 2. Gestión del programa de auditoría y competencias del auditor (5 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: del auditor individual al programa de auditoría',
    duracion: 20,
    gancho: {
      titulo: 'Doce auditorías y ninguna conclusión',
      texto: 'Una planta de líquidos estériles hizo doce auditorías internas el año pasado. Cada una tuvo su informe, pero nadie las miró en conjunto: tres auditorías distintas encontraron el mismo problema de capacitación, el área de sistemas computarizados nunca se auditó y la auditoría al proveedor del vial se aplazó cuatro veces. Cada auditoría estaba bien hecha; lo que faltaba era un **programa** que les diera dirección, cobertura y seguimiento.',
    },
    objetivos: [
      'Diferenciar una auditoría individual de un programa de auditoría.',
      'Describir el ciclo de gestión del programa según ISO 19011:2026.',
      'Reconocer las responsabilidades de quien gestiona el programa en una organización farmacéutica.',
    ],
    conceptos: [
      { icono: 'CalendarClock', termino: 'Programa de auditoría', definicion: 'Conjunto de disposiciones para una o más auditorías planificadas para un periodo y con un propósito definido. Responde a qué se audita, cuándo, cómo, con quién y para qué.' },
      { icono: 'FileText', termino: 'Plan de auditoría', definicion: 'Descripción de las actividades y los detalles de una auditoría concreta: fechas, agenda, alcance, criterios, equipo y logística. El programa contiene muchos planes.' },
      { icono: 'UserCheck', termino: 'Responsable del programa', definicion: 'Persona o función que establece, implementa, hace seguimiento, revisa y mejora el programa. En una planta suele estar en aseguramiento de la calidad.' },
      { icono: 'RefreshCw', termino: 'Ciclo del programa', definicion: 'La gestión del programa sigue la lógica PHVA: establecer objetivos y riesgos, implementar, hacer seguimiento, revisar y mejorar.' },
    ],
    mapa: {
      centro: 'Gestión del programa',
      ramas: [
        { titulo: 'Planear', icono: 'Target', nodos: ['Objetivos del programa', 'Riesgos y oportunidades', 'Alcance y recursos'] },
        { titulo: 'Hacer', icono: 'Workflow', nodos: ['Asignar equipos', 'Definir métodos', 'Ejecutar las auditorías'] },
        { titulo: 'Verificar', icono: 'Gauge', nodos: ['Cumplimiento del calendario', 'Calidad de los informes', 'Desempeño de auditores'] },
        { titulo: 'Actuar', icono: 'RefreshCw', nodos: ['Revisar resultados', 'Ajustar el programa', 'Informar a la dirección'] },
      ],
    },
    secciones: [
      {
        titulo: 'Del informe aislado a la visión del sistema',
        parrafos: [
          'ISO 19011:2026 dedica un capítulo completo a **gestionar el programa de auditoría**, y otro a **realizar** cada auditoría. La diferencia importa: una auditoría bien ejecutada da una fotografía de un área en un momento; un programa bien gestionado da la película del sistema durante un periodo. Es el programa el que asegura que todos los capítulos de las BPM se cubran, que los procesos de mayor riesgo se auditen con más frecuencia y que los hallazgos repetidos se vean como lo que son: señales de una falla del sistema.',
          'En el caso inicial, un programa habría detectado tres cosas: la **cobertura incompleta** (sistemas computarizados nunca auditados), la **recurrencia** (el mismo hallazgo de capacitación en tres áreas, que apunta al proceso de formación y no a cada área) y el **incumplimiento del calendario** (la auditoría al proveedor crítico aplazada sin evaluar el riesgo de no hacerla).',
        ],
      },
      {
        titulo: 'El ciclo de gestión del programa',
        parrafos: [
          'El ciclo arranca por **establecer los objetivos** del programa y **determinar y evaluar sus riesgos y oportunidades**. Luego se **establece el programa**: roles, competencias de quien lo gestiona, extensión, métodos y recursos. Después se **implementa**: para cada auditoría se definen objetivos, alcance y criterios, se eligen los métodos, se conforma el equipo, se asigna la responsabilidad al líder y se gestionan los resultados y los registros.',
          'El programa no termina con la última auditoría del año. Se **hace seguimiento** a su cumplimiento y eficacia, y se **revisa y mejora**: ¿se lograron los objetivos?, ¿los hallazgos llevaron a acciones eficaces?, ¿las personas auditoras tuvieron la competencia necesaria?, ¿cambió algo en la organización que obligue a ajustar el programa? La edición 2026 refuerza que, en cada etapa, se decida también el **método**: en sitio, remoto o híbrido.',
        ],
      },
      {
        titulo: 'Quién gestiona el programa en una empresa farmacéutica',
        parrafos: [
          'En la mayoría de laboratorios, el programa lo gestiona **aseguramiento de la calidad**, con el respaldo de la dirección técnica y de la alta dirección. Quien lo gestiona necesita conocer los principios y métodos de auditoría, las normas aplicables (BPM, BPL, servicio farmacéutico, ISO 9001 si aplica), los procesos de la organización y sus riesgos, y tener capacidad para coordinar personas de distintas áreas.',
          'Sus responsabilidades incluyen proponer el programa a la dirección, conseguir los recursos, formar y evaluar a las personas auditoras, asegurar la independencia de cada equipo, consolidar los resultados y presentarlos en la **revisión por la dirección**, que ICH Q10 e ISO 9001 exigen. Un programa que nunca llega a la dirección pierde la palanca más importante para corregir problemas de fondo, como la falta de personal o de inversión en instalaciones.',
        ],
      },
    ],
    caso: {
      titulo: 'El mismo hallazgo en tres áreas',
      contexto: 'En el consolidado anual, el responsable del programa ve que las auditorías de producción, almacén y control de calidad registraron, cada una, un hallazgo menor por personal que operaba con procedimientos actualizados sin haber recibido la capacitación.',
      pregunta: '¿Qué conclusión corresponde al nivel del programa?',
      opciones: [
        { texto: 'Son tres hallazgos menores independientes; cada área debe capacitar a su gente.', correcta: false, retro: 'Visto por separado parece menor, pero la repetición en tres áreas revela una falla del proceso de gestión de cambios y capacitación.' },
        { texto: 'Hay una falla sistémica en el vínculo entre control de cambios documental y capacitación; se escala, se analiza la causa en ese proceso y se ajusta el programa para auditarlo.', correcta: true, retro: 'Esta es la ventaja del programa: ver patrones que una auditoría individual no ve y dirigir la mejora a la causa común.' },
        { texto: 'Se debe aumentar la frecuencia de auditoría en las tres áreas.', correcta: false, retro: 'Auditar más las áreas no corrige el proceso común que genera el problema.' },
      ],
    },
    errores: [
      { error: 'Confundir el programa con un calendario de fechas.', correccion: 'El programa incluye objetivos, riesgos, métodos, recursos, competencias, seguimiento y mejora.' },
      { error: 'Aplazar auditorías sin evaluar el riesgo de no hacerlas.', correccion: 'Todo cambio al programa se justifica por riesgo y queda documentado.' },
      { error: 'No llevar los resultados a la revisión por la dirección.', correccion: 'Presenta tendencias, recurrencias y necesidades de recursos en cada revisión.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre programa y plan de auditoría?', respuesta: 'El programa organiza un conjunto de auditorías en un periodo con un propósito; el plan describe las actividades de una auditoría concreta.' },
      { pregunta: '¿Qué etapas tiene el ciclo de gestión del programa?', respuesta: 'Establecer objetivos y riesgos, establecer el programa, implementarlo, hacer seguimiento y revisarlo y mejorarlo.' },
      { pregunta: '¿Por qué un hallazgo repetido en varias áreas importa al programa?', respuesta: 'Porque indica una falla sistémica que debe atacarse en el proceso común y no área por área.' },
    ],
    resumen: [
      'El **programa** da dirección, cobertura y seguimiento; el **plan** organiza una auditoría.',
      'La gestión del programa sigue el ciclo **PHVA** y decide también el método: en sitio, remoto o híbrido.',
      'Los resultados del programa deben llegar a la **revisión por la dirección**.',
    ],
    referencias: [R.iso19011, R.ichQ10, R.iso9001, R.trs986a2],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Ciclo PHVA ilustrado con un calendario anual de auditorías en el centro y flechas hacia la revisión por la dirección.', alt: 'Ciclo de gestión del programa de auditoría' },
    ],
    keywords: ['programa de auditoría iso 19011', 'diferencia entre programa y plan de auditoría', 'gestión del programa de auditoría', 'programa de autoinspección farmacéutica', 'responsable del programa de auditoría', 'iso 19011 capítulo 5'],
  },

  {
    titulo: 'Establecer objetivos, alcance y recursos del programa de auditoría',
    duracion: 25,
    gancho: {
      titulo: 'Un programa sin objetivo',
      texto: 'Al preguntarle por los objetivos de su programa de auditoría, la jefa de aseguramiento de un laboratorio responde: «cumplir la autoinspección anual». Es un requisito, pero no un objetivo útil: no dice qué riesgos se quieren controlar, qué proveedores hay que evaluar antes de un lanzamiento ni qué preparación exige la renovación del certificado de BPM del próximo año. Sin objetivos claros, el programa no puede decidir qué auditar primero ni cuántos recursos pedir.',
    },
    objetivos: [
      'Formular objetivos del programa de auditoría coherentes con la estrategia de calidad y los requisitos regulatorios.',
      'Definir la extensión del programa: alcance, número, duración, frecuencia y métodos de las auditorías.',
      'Estimar los recursos necesarios: personas competentes, tiempo, tecnología y presupuesto.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'Objetivos del programa', definicion: 'Lo que el programa debe lograr en el periodo: por ejemplo, verificar el cumplimiento de BPM en todas las áreas, preparar la renovación del certificado o calificar a los proveedores críticos antes de un lanzamiento.' },
      { icono: 'Layers', termino: 'Extensión del programa', definicion: 'Cuántas auditorías, de qué alcance, con qué frecuencia, duración y método. Depende del tamaño, la complejidad y los riesgos de la organización.' },
      { icono: 'Users', termino: 'Recursos del programa', definicion: 'Personas auditoras competentes, expertos técnicos, tiempo, viajes, herramientas tecnológicas para auditar a distancia y presupuesto.' },
      { icono: 'Crosshair', termino: 'Alcance de una auditoría', definicion: 'Extensión y límites de una auditoría: procesos, áreas, productos, ubicaciones y periodo que cubre.' },
    ],
    mapa: {
      centro: 'Establecer el programa',
      ramas: [
        { titulo: 'Entradas', icono: 'Database', nodos: ['Requisitos regulatorios', 'Resultados de auditorías previas', 'Cambios y riesgos'] },
        { titulo: 'Objetivos', icono: 'Target', nodos: ['Cumplimiento de BPM', 'Proveedores críticos', 'Preparar la certificación'] },
        { titulo: 'Extensión', icono: 'Layers', nodos: ['Alcance y frecuencia', 'Duración', 'Método en sitio, remoto o híbrido'] },
        { titulo: 'Recursos', icono: 'Users', nodos: ['Auditores competentes', 'Tiempo y presupuesto', 'Tecnología'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo formular objetivos útiles',
        parrafos: [
          'Los objetivos del programa se derivan de las necesidades de la organización y de sus partes interesadas: los requisitos de BPM y BPL, el calendario de certificaciones ante el INVIMA, la política y los objetivos de calidad, las quejas y desviaciones del último año, los cambios planeados (nuevas líneas, nuevos proveedores, nuevos sistemas computarizados) y las expectativas de clientes o socios. Un buen objetivo es concreto y verificable.',
          'Ejemplos para un laboratorio: «Auditar en el año todos los capítulos de la guía de inspección de BPM, con al menos dos auditorías a las áreas de alto riesgo»; «Auditar en sitio, antes de junio, a los tres proveedores de principio activo del nuevo producto»; «Hacer en el tercer trimestre una autoinspección integral que sirva como autoevaluación para la renovación del certificado de BPM». Con objetivos así, cada auditoría del programa tiene una razón de ser.',
        ],
      },
      {
        titulo: 'La extensión del programa',
        parrafos: [
          'La **extensión** traduce los objetivos en auditorías concretas. Para decidirla se consideran el tamaño y la complejidad de la planta, el número de procesos y formas farmacéuticas, los resultados de auditorías e inspecciones anteriores, el desempeño de los procesos (desviaciones, quejas, resultados fuera de especificación), los cambios en la organización y los riesgos para el paciente. Una planta de estériles con dos líneas nuevas no puede tener el mismo programa que un almacén de cosméticos.',
          'Para cada auditoría se fija el alcance (áreas, procesos, periodo), la frecuencia, la duración aproximada y el **método**. La edición 2026 de ISO 19011 trata los métodos en sitio, remotos e híbridos como opciones que se eligen según el riesgo y la capacidad tecnológica del auditado: una revisión de registros de capacitación puede hacerse a distancia; la verificación de un área estéril casi siempre exige presencia física.',
        ],
      },
      {
        titulo: 'Recursos: el punto débil de muchos programas',
        parrafos: [
          'Muchos programas fracasan por falta de recursos, no de voluntad. Para estimarlos se calcula cuántas horas de auditoría exige cada auditoría (preparación, ejecución, informe y seguimiento), cuántas personas auditoras competentes e independientes hay disponibles, si se necesitan expertos técnicos (por ejemplo, en sistemas de agua o en validación de software), cuánto cuestan los viajes a proveedores y qué herramientas se requieren para auditar a distancia de forma segura.',
          'Con esa estimación, quien gestiona el programa lo presenta a la dirección. Si los recursos no alcanzan, la decisión de qué auditoría reducir o aplazar debe tomarse por **riesgo** y quedar documentada, nunca por comodidad. Formar auditores internos de distintas áreas es una forma eficiente de ampliar los recursos y, al mismo tiempo, de extender la cultura de calidad.',
        ],
      },
    ],
    proceso: {
      titulo: 'Armar el programa anual en seis pasos',
      pasos: [
        { titulo: 'Reúne las entradas', detalle: 'Requisitos, resultados previos, desviaciones, quejas, cambios planeados y calendario regulatorio.', icono: 'Database', evidencia: 'Resumen de entradas del programa.' },
        { titulo: 'Define objetivos', detalle: 'Escribe tres a cinco objetivos concretos y verificables para el periodo.', icono: 'Target', evidencia: 'Objetivos aprobados.' },
        { titulo: 'Evalúa riesgos del programa', detalle: 'Identifica qué puede impedir lograr los objetivos y cómo mitigarlo.', icono: 'AlertTriangle', evidencia: 'Matriz de riesgos del programa.' },
        { titulo: 'Fija la extensión', detalle: 'Asigna auditorías con alcance, frecuencia, duración y método.', icono: 'Layers', evidencia: 'Calendario con alcance por auditoría.' },
        { titulo: 'Estima recursos', detalle: 'Calcula horas, personas, expertos, viajes y tecnología.', icono: 'Calculator', evidencia: 'Presupuesto y asignación de auditores.' },
        { titulo: 'Aprueba y comunica', detalle: 'Presenta el programa a la dirección y comunícalo a las áreas.', icono: 'Signature', evidencia: 'Programa aprobado y divulgado.' },
      ],
    },
    caso: {
      titulo: 'Lanzamiento con proveedores nuevos',
      contexto: 'Un laboratorio planea lanzar en septiembre un producto con un principio activo de un fabricante nuevo en India y un material de envase de un proveedor nacional también nuevo. Su programa de auditoría ya está aprobado y no incluye a ninguno de los dos.',
      pregunta: '¿Qué debe hacer quien gestiona el programa?',
      opciones: [
        { texto: 'Esperar al programa del próximo año, porque el actual ya fue aprobado.', correcta: false, retro: 'El programa se ajusta cuando cambian los riesgos. Un lanzamiento con proveedores nuevos es un cambio relevante.' },
        { texto: 'Ajustar el programa: incluir la evaluación de ambos proveedores antes del lanzamiento, decidir el método por riesgo y gestionar los recursos con la dirección.', correcta: true, retro: 'El programa es dinámico. La evaluación de proveedores críticos nuevos debe preceder a su aprobación, y el cambio se documenta.' },
        { texto: 'Aprobar a los proveedores con sus certificados y auditar después del lanzamiento.', correcta: false, retro: 'Para un proveedor crítico nuevo, los certificados no reemplazan la evaluación basada en riesgo antes de aprobarlo.' },
      ],
    },
    errores: [
      { error: 'Usar «cumplir la autoinspección» como único objetivo.', correccion: 'Formula objetivos concretos ligados a riesgos, certificaciones y cambios.' },
      { error: 'Planear auditorías sin estimar horas ni personas.', correccion: 'Calcula recursos por auditoría y preséntalos a la dirección.' },
      { error: 'Elegir auditoría remota solo porque es más barata.', correccion: 'Elige el método por riesgo y por lo que se necesita verificar.' },
    ],
    comprueba: [
      { pregunta: 'Da un ejemplo de objetivo verificable de un programa de auditoría.', respuesta: 'Auditar en sitio, antes de junio, a los tres proveedores de principio activo del nuevo producto.' },
      { pregunta: '¿Qué se define en la extensión del programa?', respuesta: 'Alcance, número, frecuencia, duración y método de las auditorías.' },
      { pregunta: '¿Cómo se decide qué auditoría aplazar si faltan recursos?', respuesta: 'Por riesgo, con la decisión documentada y comunicada.' },
    ],
    resumen: [
      'Los **objetivos** del programa deben ser concretos y salir de riesgos, requisitos y cambios.',
      'La **extensión** fija alcance, frecuencia, duración y método de cada auditoría.',
      'Sin **recursos** estimados y aprobados, el programa no se cumple.',
    ],
    referencias: [R.iso19011, R.ichQ10, R.trs986a2, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Tablero ilustrado con un calendario anual, íconos de áreas de la planta y de proveedores, y un medidor de horas de auditoría disponibles.', alt: 'Programa anual de auditoría con objetivos, extensión y recursos' },
    ],
    keywords: ['objetivos del programa de auditoría', 'cómo hacer un programa de auditoría', 'alcance de auditoría', 'recursos para auditoría interna', 'programa anual de auditoría bpm', 'plan y programa de auditoría interna'],
  },

  {
    titulo: 'Auditoría basada en riesgos: priorización de áreas, procesos y proveedores',
    duracion: 25,
    gancho: {
      titulo: 'Auditar todo igual es auditar mal',
      texto: 'Un laboratorio audita una vez al año todas sus áreas con la misma duración: el archivo de documentos obsoletos recibe tantas horas como la sala de llenado aséptico. Mientras tanto, un proveedor de principio activo con dos quejas de impurezas espera su auditoría desde hace tres años. Repartir el esfuerzo por igual parece justo, pero deja sin vigilancia justo los lugares donde un error puede llegar al paciente.',
    },
    objetivos: [
      'Aplicar el enfoque basado en riesgos para priorizar áreas, procesos y proveedores en el programa de auditoría.',
      'Usar criterios de riesgo farmacéutico (impacto en el paciente, complejidad, historial y cambios) para fijar frecuencias.',
      'Identificar los riesgos del propio programa de auditoría y cómo mitigarlos.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Enfoque basado en riesgos', definicion: 'Principio de auditoría que orienta la planificación, la ejecución y el informe hacia lo que más importa para el auditado y para los objetivos de la auditoría.' },
      { icono: 'Gauge', termino: 'Priorización por riesgo', definicion: 'Asignar más frecuencia, duración y profundidad a los procesos, áreas y proveedores cuyo fallo tendría mayor impacto en el paciente o en la calidad del producto.' },
      { icono: 'BarChart3', termino: 'Matriz de priorización', definicion: 'Herramienta que puntúa cada elemento auditable según criterios de riesgo y lo ubica en un nivel que define su frecuencia de auditoría.' },
      { icono: 'ShieldCheck', termino: 'Riesgos del programa', definicion: 'Lo que puede impedir que el programa logre sus objetivos: falta de recursos, auditores sin competencia, mala comunicación, elección inadecuada del método o inseguridad de la evidencia digital.' },
    ],
    mapa: {
      centro: 'Priorizar por riesgo',
      ramas: [
        { titulo: 'Impacto', icono: 'Pill', nodos: ['Riesgo para el paciente', 'Producto estéril o de estrecho margen', 'Etapa crítica del proceso'] },
        { titulo: 'Probabilidad', icono: 'Activity', nodos: ['Desviaciones y quejas', 'Hallazgos previos', 'Complejidad del proceso'] },
        { titulo: 'Cambios', icono: 'GitBranch', nodos: ['Nuevas líneas o productos', 'Proveedores nuevos', 'Personal o sistemas nuevos'] },
        { titulo: 'Programa', icono: 'ShieldCheck', nodos: ['Recursos y competencia', 'Método adecuado', 'Seguridad de la evidencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Riesgo en el sentido farmacéutico',
        parrafos: [
          'ISO 19011 trata el riesgo en dos niveles: los riesgos y oportunidades **del programa** (qué puede impedir que se cumpla) y el enfoque basado en riesgos como **principio** para decidir qué auditar y con qué profundidad. En la industria farmacéutica, ese segundo nivel se alinea con ICH Q9(R1): el riesgo se evalúa por la gravedad del daño posible y la probabilidad de que ocurra, y su protagonista es siempre el **paciente**.',
          'Así, una sala de llenado aséptico, la liberación de lotes, la integridad de los datos del laboratorio o el proveedor del principio activo de un medicamento de estrecho margen terapéutico tienen, por naturaleza, un riesgo mayor que el archivo de documentos o la bodega de material promocional. El programa debe reflejarlo con más frecuencia, más tiempo y personas auditoras más especializadas en esos puntos.',
        ],
      },
      {
        titulo: 'Cómo construir una matriz de priorización',
        parrafos: [
          'Una forma práctica es puntuar cada elemento auditable (área, proceso o proveedor) de 1 a 3 en cuatro criterios: **impacto** en el paciente y en el producto, **desempeño** (desviaciones, quejas, resultados fuera de especificación y hallazgos de auditorías e inspecciones anteriores), **complejidad** (procesos asépticos, sistemas computarizados, múltiples productos) y **cambios** recientes o planeados. La suma ubica al elemento en un nivel alto, medio o bajo.',
          'A cada nivel se asocia una frecuencia: por ejemplo, alto, dos veces al año o auditoría en sitio para proveedores; medio, anual; bajo, cada dos años con verificación documental intermedia. La matriz se revisa al menos una vez al año y cada vez que ocurre un evento relevante, como una queja grave o una inspección con hallazgos mayores. Lo esencial es que la decisión sea **trazable**: cualquiera debe poder ver por qué un proveedor se audita cada año y otro cada tres.',
        ],
      },
      {
        titulo: 'Los riesgos del propio programa',
        parrafos: [
          'El programa también tiene riesgos. ISO 19011 menciona, entre otros, fijar objetivos poco pertinentes, no contar con recursos o tiempo suficientes, seleccionar un equipo sin la competencia necesaria, comunicar mal, coordinar de forma ineficaz, no controlar la información documentada y no contar con la disponibilidad y la cooperación del auditado. La edición 2026 amplía los ejemplos con riesgos ligados a la elección del método y a la seguridad de la evidencia digital, cada vez más frecuente.',
          'Cada riesgo del programa necesita una respuesta: formar más auditores internos, contratar expertos técnicos para temas puntuales, programar con anticipación las auditorías a proveedores, definir reglas para compartir y guardar evidencia electrónica, o tener un plan alternativo cuando un proveedor no permite la visita en sitio. Gestionar estos riesgos es lo que separa un programa que se cumple de uno que se aplaza.',
        ],
      },
    ],
    proceso: {
      titulo: 'Priorizar los elementos auditables',
      pasos: [
        { titulo: 'Lista el universo auditable', detalle: 'Áreas, procesos, sistemas computarizados y proveedores críticos.', icono: 'ClipboardList', evidencia: 'Universo auditable completo.' },
        { titulo: 'Define criterios y escala', detalle: 'Impacto, desempeño, complejidad y cambios, con una escala de 1 a 3 y su significado.', icono: 'Ruler', evidencia: 'Criterios aprobados.' },
        { titulo: 'Puntúa con datos', detalle: 'Usa desviaciones, quejas, OOS y hallazgos previos, no impresiones.', icono: 'BarChart3', evidencia: 'Matriz puntuada con fuentes.' },
        { titulo: 'Asigna frecuencia y método', detalle: 'Relaciona cada nivel con una frecuencia y un método de auditoría.', icono: 'CalendarClock', evidencia: 'Programa ajustado por riesgo.' },
        { titulo: 'Revisa ante eventos', detalle: 'Actualiza la matriz con quejas graves, inspecciones o cambios relevantes.', icono: 'RefreshCw', evidencia: 'Registro de revisiones de la matriz.' },
      ],
    },
    caso: {
      titulo: 'Dos proveedores, una sola visita posible',
      contexto: 'El presupuesto alcanza para una sola auditoría en sitio a proveedores este semestre. Proveedor A: principio activo de un anticoagulante, dos quejas por impurezas y un cambio reciente de ruta de síntesis. Proveedor B: excipiente de uso general, sin quejas, con certificado vigente y última auditoría satisfactoria hace dos años.',
      pregunta: '¿Cuál se audita en sitio y qué se hace con el otro?',
      opciones: [
        { texto: 'El proveedor B, porque toca por calendario.', correcta: false, retro: 'El calendario se subordina al riesgo. A tiene impacto alto, quejas y un cambio relevante.' },
        { texto: 'El proveedor A en sitio; al B se le hace una evaluación documental o remota y se mantiene su vigilancia por desempeño.', correcta: true, retro: 'Es la aplicación correcta del enfoque basado en riesgos: el esfuerzo máximo va donde el riesgo para el paciente es mayor, y el resto se cubre con métodos proporcionados.' },
        { texto: 'Ninguno, hasta tener presupuesto para ambos.', correcta: false, retro: 'Aplazar la auditoría de un proveedor de alto riesgo con quejas expone al paciente.' },
      ],
    },
    errores: [
      { error: 'Asignar la misma frecuencia a todas las áreas.', correccion: 'Ajusta frecuencia y profundidad según impacto, desempeño, complejidad y cambios.' },
      { error: 'Puntuar el riesgo por impresiones.', correccion: 'Usa datos de desviaciones, quejas, OOS e inspecciones.' },
      { error: 'Nunca revisar la matriz de priorización.', correccion: 'Revísala al menos una vez al año y ante eventos relevantes.' },
    ],
    comprueba: [
      { pregunta: '¿Qué cuatro criterios sirven para priorizar elementos auditables?', respuesta: 'Impacto en el paciente y el producto, desempeño, complejidad y cambios.' },
      { pregunta: 'Menciona dos riesgos del programa de auditoría.', respuesta: 'Falta de recursos o de auditores competentes, y elección inadecuada del método o inseguridad de la evidencia digital.' },
      { pregunta: '¿Qué guía farmacéutica respalda el enfoque de riesgo?', respuesta: 'ICH Q9(R1), de gestión de riesgos de calidad.' },
    ],
    resumen: [
      'El riesgo farmacéutico se mide por su **impacto en el paciente** y su probabilidad.',
      'Una **matriz de priorización** con datos fija frecuencias trazables.',
      'El programa también tiene **riesgos propios** que hay que gestionar.',
    ],
    referencias: [R.iso19011, R.ichQ9, R.ichQ10, R.tc176Iso19011],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Matriz de calor ilustrada con áreas de una planta y proveedores ubicados en celdas verde, amarilla y coral según su nivel de riesgo.', alt: 'Matriz de priorización por riesgo para el programa de auditoría' },
    ],
    keywords: ['auditoría basada en riesgos', 'priorización de auditorías por riesgo', 'matriz de riesgo para auditoría', 'frecuencia de auditoría a proveedores', 'riesgos del programa de auditoría', 'ich q9 auditoría'],
  },

  {
    titulo: 'Competencias, selección y evaluación de auditores (capítulo 7 ISO 19011)',
    duracion: 25,
    gancho: {
      titulo: 'Buena química, poca auditoría',
      texto: 'Un laboratorio nombra auditor interno a su mejor analista de control de calidad. Conoce los métodos a la perfección, pero en su primera auditoría a producción hace preguntas cerradas, discute con el supervisor, no recoge evidencia y escribe hallazgos que son opiniones. Saber mucho de un tema no convierte a nadie en auditor. ISO 19011 dedica su capítulo 7 a definir qué competencia necesita una persona auditora y cómo evaluarla.',
    },
    objetivos: [
      'Describir los componentes de la competencia de una persona auditora: comportamiento personal, conocimientos y habilidades.',
      'Establecer criterios y métodos para seleccionar y evaluar auditores internos y de proveedores.',
      'Planear el mantenimiento y la mejora continua de la competencia del equipo auditor.',
    ],
    conceptos: [
      { icono: 'GraduationCap', termino: 'Competencia', definicion: 'Capacidad de aplicar conocimientos y habilidades para lograr los resultados previstos. En auditoría combina comportamiento personal, conocimientos genéricos y conocimientos específicos del sector.' },
      { icono: 'Users', termino: 'Comportamiento personal', definicion: 'Rasgos que ISO 19011 espera de quien audita, como ser ético, de mente abierta, diplomático, observador, perceptivo, versátil, tenaz, decidido y seguro de sí mismo.' },
      { icono: 'BookOpen', termino: 'Conocimiento específico', definicion: 'Lo que se necesita saber del sector auditado: BPM, BPL, servicio farmacéutico, procesos de fabricación y análisis, riesgos para el paciente y normativa colombiana.' },
      { icono: 'BadgeCheck', termino: 'Evaluación del auditor', definicion: 'Proceso planificado para verificar, al inicio y de forma continua, que una persona auditora cumple los criterios de competencia definidos.' },
    ],
    mapa: {
      centro: 'Competencia de quien audita',
      ramas: [
        { titulo: 'Comportamiento', icono: 'Users', nodos: ['Ético y diplomático', 'Observador y perceptivo', 'Tenaz y decidido'] },
        { titulo: 'Conocimiento genérico', icono: 'BookOpen', nodos: ['Principios y métodos de auditoría', 'Sistemas de gestión', 'Herramientas digitales'] },
        { titulo: 'Conocimiento del sector', icono: 'Pill', nodos: ['BPM y BPL', 'Servicio farmacéutico', 'Riesgo para el paciente'] },
        { titulo: 'Evaluación', icono: 'BadgeCheck', nodos: ['Criterios definidos', 'Métodos combinados', 'Seguimiento continuo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué se entiende por competencia en auditoría',
        parrafos: [
          'El capítulo 7 de ISO 19011 parte de una idea sencilla: la confianza en una auditoría depende de la competencia de quienes la hacen. Esa competencia tiene tres componentes. El **comportamiento personal** incluye ser ético, de mente abierta, diplomático, observador, perceptivo, versátil, tenaz, decidido, seguro de sí mismo, con firmeza para actuar, abierto a la mejora, sensible a la cultura y colaborativo. Los **conocimientos y habilidades genéricos** cubren principios, procesos y métodos de auditoría, normas de sistemas de gestión, la organización y su contexto, y requisitos legales.',
          'Los **conocimientos específicos** son los del sector o la disciplina: en farmacia, las BPM y las BPL, la validación, la integridad de datos, la microbiología de áreas limpias o la normativa del servicio farmacéutico, según el alcance. A quien lidera un equipo se le exige además planificar, coordinar, dirigir la comunicación con el auditado y llegar a conclusiones. Las fuentes que comentan la edición 2026 coinciden en que amplía la competencia en **herramientas digitales**: manejar plataformas de video, registros electrónicos, evidencia en la nube y los riesgos de seguridad de la información.',
        ],
      },
      {
        titulo: 'Cómo seleccionar y evaluar',
        parrafos: [
          'Primero se fijan **criterios de evaluación** coherentes con lo que el programa necesita: por ejemplo, para auditor interno de BPM, formación en ISO 19011 y en la Resolución 1160 de 2016, tres auditorías como acompañante y una como líder supervisada; para auditor de proveedores de principio activo, además, conocimiento de síntesis química, ICH Q7 y experiencia en el sector. Los criterios pueden ser cualitativos (comportamiento demostrado) y cuantitativos (horas de formación, número de auditorías).',
          'Luego se eligen **métodos de evaluación**, idealmente combinados: revisión de registros de formación y experiencia, retroalimentación de auditados y colegas, entrevista, observación en auditorías reales o simuladas, pruebas escritas u orales y revisión posterior de los informes. Una persona que conoce la teoría pero escribe hallazgos sin evidencia todavía no cumple; la observación en campo y la revisión de sus informes lo revelan.',
        ],
      },
      {
        titulo: 'Mantener y mejorar la competencia',
        parrafos: [
          'La competencia se pierde si no se usa y se desactualiza cuando cambian las normas. Por eso el programa debe prever el **desarrollo profesional continuo**: participación regular en auditorías, actualización normativa (por ejemplo, el paso a ISO 19011:2026 o una modificación de la Resolución 1160), entrenamiento en nuevas herramientas digitales y retroalimentación después de cada auditoría.',
          'Un registro sencillo por persona auditora, con formación, auditorías realizadas, rol, resultado de las evaluaciones y plan de desarrollo, es suficiente para demostrar ante un inspector o un cliente que el equipo es competente. Y es la herramienta de quien gestiona el programa para asignar a cada auditoría el equipo adecuado, con un experto técnico cuando el tema lo exija.',
        ],
      },
    ],
    proceso: {
      titulo: 'Calificar a un auditor interno nuevo',
      pasos: [
        { titulo: 'Verifica requisitos de entrada', detalle: 'Formación profesional y experiencia en el área o el sector.', icono: 'FileCheck', evidencia: 'Hoja de vida verificada.' },
        { titulo: 'Forma en auditoría', detalle: 'Curso de ISO 19011:2026 y de los criterios aplicables (BPM, BPL o servicio farmacéutico).', icono: 'GraduationCap', evidencia: 'Certificados de formación.' },
        { titulo: 'Acompaña auditorías', detalle: 'Participa como observador o auditor en entrenamiento bajo un líder calificado.', icono: 'Users', evidencia: 'Registro de auditorías acompañadas.' },
        { titulo: 'Lidera supervisado', detalle: 'Conduce una auditoría con supervisión y recibe retroalimentación.', icono: 'Eye', evidencia: 'Evaluación del líder supervisor.' },
        { titulo: 'Califica y registra', detalle: 'Decide la calificación con los criterios definidos y abre su plan de desarrollo.', icono: 'BadgeCheck', evidencia: 'Registro de calificación del auditor.' },
      ],
    },
    caso: {
      titulo: 'El experto que no escucha',
      contexto: 'Un ingeniero de validación con quince años de experiencia es asignado a auditar el sistema de agua. En la auditoría interrumpe al supervisor, afirma que «eso está mal diseñado» sin revisar los datos de calificación y se niega a registrar las explicaciones del área.',
      pregunta: '¿Qué falla en su competencia como auditor?',
      opciones: [
        { texto: 'Nada: su conocimiento técnico basta para auditar el sistema de agua.', correcta: false, retro: 'El conocimiento específico es necesario, pero no suficiente. El comportamiento personal también es parte de la competencia.' },
        { texto: 'El comportamiento personal: falta mente abierta, diplomacia y enfoque en la evidencia. Puede participar como experto técnico mientras se forma como auditor.', correcta: true, retro: 'ISO 19011 distingue entre experto técnico y auditor. Su conocimiento es valioso como apoyo, pero para auditar necesita desarrollar el comportamiento y el método.' },
        { texto: 'El conocimiento genérico de sistemas de gestión, porque no conoce ISO 9001.', correcta: false, retro: 'El problema observado no es de normas de gestión, sino de conducta y método en campo.' },
      ],
    },
    errores: [
      { error: 'Nombrar auditores solo por su conocimiento técnico.', correccion: 'Evalúa también comportamiento personal y dominio del método de auditoría.' },
      { error: 'Calificar auditores con un solo curso.', correccion: 'Combina formación, acompañamiento, observación y revisión de informes.' },
      { error: 'No actualizar al equipo cuando cambia la norma.', correccion: 'Incluye la actualización a ISO 19011:2026 y a cambios regulatorios en el plan de desarrollo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tres componentes tiene la competencia de una persona auditora?', respuesta: 'Comportamiento personal, conocimientos y habilidades genéricos, y conocimientos específicos del sector o disciplina.' },
      { pregunta: 'Menciona tres métodos para evaluar auditores.', respuesta: 'Revisión de registros, observación en auditorías y revisión posterior de informes; también entrevistas, pruebas y retroalimentación.' },
      { pregunta: '¿Qué competencia refuerza la edición 2026?', respuesta: 'El manejo de herramientas digitales, evidencia electrónica y riesgos de seguridad de la información.' },
    ],
    resumen: [
      'Competencia = **comportamiento + conocimientos genéricos + conocimientos del sector**.',
      'Selecciona y evalúa con **criterios definidos** y **métodos combinados**.',
      'La competencia se **mantiene** con práctica, actualización y retroalimentación.',
    ],
    referencias: [R.iso19011, R.tc176Iso19011, R.res1160Compilada, R.ichQ7],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Ilustración de una persona auditora con tres capas superpuestas (comportamiento, conocimientos genéricos, conocimientos del sector) y una insignia de calificación.', alt: 'Componentes de la competencia de una persona auditora según ISO 19011' },
    ],
    keywords: ['competencias del auditor iso 19011', 'evaluación de auditores internos', 'capítulo 7 iso 19011', 'cómo calificar auditores internos', 'auditor interno bpm requisitos', 'comportamiento personal del auditor'],
  },

  {
    titulo: 'Ética, comunicación y comportamiento del auditor en campo',
    duracion: 25,
    gancho: {
      titulo: 'El almuerzo y la tarjeta de regalo',
      texto: 'Al terminar el primer día de auditoría a un proveedor de material de envase, el gerente comercial invita al equipo auditor a cenar en un restaurante costoso y, al despedirse, entrega a cada persona una tarjeta de regalo «como detalle de la empresa». Al día siguiente hay que revisar los resultados de tres lotes rechazados. Nadie ha hecho nada ilegal todavía, pero la independencia del equipo ya está en juego.',
    },
    objetivos: [
      'Aplicar los principios de integridad, independencia y confidencialidad en situaciones reales de campo.',
      'Usar técnicas de comunicación que faciliten la colaboración del auditado sin perder objetividad.',
      'Manejar situaciones difíciles: presión, conflicto, información sensible y evidencia de posible fraude.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'Integridad', definicion: 'Actuar con honestidad, diligencia y responsabilidad, sin dejarse influir por presiones ni beneficios, y sin ocultar ni suavizar lo encontrado.' },
      { icono: 'Scale', termino: 'Conflicto de interés', definicion: 'Situación en la que un vínculo, un beneficio o una relación puede afectar, o parecer que afecta, el juicio de quien audita.' },
      { icono: 'Hand', termino: 'Comunicación asertiva', definicion: 'Expresar hechos y requisitos con claridad y respeto, escuchar activamente y mantener la objetividad aun ante desacuerdos.' },
      { icono: 'Lock', termino: 'Confidencialidad', definicion: 'Proteger la información obtenida, incluida la evidencia digital, y no usarla en beneficio propio ni en perjuicio del auditado.' },
    ],
    mapa: {
      centro: 'Conducta en campo',
      ramas: [
        { titulo: 'Ética', icono: 'ShieldCheck', nodos: ['No aceptar beneficios', 'Declarar conflictos', 'Informar con veracidad'] },
        { titulo: 'Comunicación', icono: 'Users', nodos: ['Preguntas abiertas', 'Escucha activa', 'Hechos, no juicios'] },
        { titulo: 'Situaciones difíciles', icono: 'AlertTriangle', nodos: ['Presión del auditado', 'Conflicto o llanto', 'Posible fraude'] },
        { titulo: 'Información', icono: 'Lock', nodos: ['Confidencialidad', 'Evidencia digital protegida', 'Uso solo para la auditoría'] },
      ],
    },
    secciones: [
      {
        titulo: 'La ética no es un capítulo aparte',
        parrafos: [
          'Los principios de integridad, presentación imparcial, confidencialidad e independencia se ponen a prueba en campo, no en el procedimiento. La regla práctica es no aceptar regalos, invitaciones ni beneficios que puedan influir, o **parecer** que influyen, en las conclusiones. En el caso inicial, lo correcto es declinar con cortesía la tarjeta de regalo, aceptar como máximo la alimentación sencilla que sea parte de la logística de la jornada y dejar constancia en el informe si la empresa tiene una política al respecto.',
          'Los conflictos de interés se declaran **antes** de la auditoría: haber trabajado recientemente en el área o en la empresa auditada, tener familiares en ella, auditar un proceso que uno mismo diseñó o tener intereses comerciales con el proveedor. Quien gestiona el programa decide entonces si cambia la asignación o toma medidas para proteger la imparcialidad.',
        ],
      },
      {
        titulo: 'Comunicarse para obtener evidencia',
        parrafos: [
          'Una auditoría depende de la colaboración del auditado, y la colaboración depende del trato. Algunas prácticas que funcionan: presentarse y explicar el propósito, hablar de procesos y no de personas, hacer **preguntas abiertas** («muéstreme cómo…», «¿qué hace cuando…?»), escuchar sin interrumpir, verificar lo que se entendió («si entiendo bien, el despeje de línea lo firma el supervisor antes de iniciar…») y pedir siempre la evidencia que respalda una respuesta.',
          'Hay que evitar las preguntas cerradas que invitan a responder «sí» sin demostrar nada, las preguntas que sugieren la respuesta, los comentarios que juzgan («eso está muy mal») y las comparaciones con otras empresas. Cuando se detecta una posible no conformidad, se comunica en el momento, con la evidencia a la vista, para que el área pueda aclarar o aportar más información. Las sorpresas en la reunión de cierre dañan la confianza.',
        ],
      },
      {
        titulo: 'Situaciones difíciles',
        parrafos: [
          'Frente a la **presión** («si escribe eso, nos cierran»), se mantiene la calma, se recuerda que el hallazgo describe hechos y se explica cómo se clasifica y se trata. Frente al **conflicto** o a una persona que se altera, se hace una pausa, se reconoce la emoción, se vuelve al proceso y, si hace falta, se continúa con otra persona o en otro momento. Frente a la **negación de acceso** a un área o un registro, se deja constancia y se informa al líder y al cliente de la auditoría, porque limita las conclusiones.',
          'El caso más delicado es la **evidencia de posible fraude o falsificación de datos**: registros completados antes de ejecutar la tarea, resultados copiados, firmas de personas ausentes. Quien audita no investiga ni acusa: asegura la evidencia (copias, fotografías si están permitidas, identificación precisa de los registros), informa de inmediato al líder del equipo y a la dirección de calidad, y deja que la organización active su procedimiento de investigación. Estos hechos suelen clasificarse como críticos, como verás en la unidad 4.',
        ],
      },
    ],
    proceso: {
      titulo: 'Preguntar para obtener evidencia',
      pasos: [
        { titulo: 'Abre', detalle: 'Pregunta cómo se hace la tarea: «¿Me explica cómo libera un lote?».', icono: 'Users', evidencia: 'Descripción del proceso por quien lo ejecuta.' },
        { titulo: 'Pide que lo muestre', detalle: '«¿Me muestra el registro del último lote liberado?».', icono: 'Eye', evidencia: 'Registro u observación directa.' },
        { titulo: 'Profundiza', detalle: '«¿Qué hace si un resultado está fuera de especificación?».', icono: 'Search', evidencia: 'Respuesta contrastada con el procedimiento.' },
        { titulo: 'Verifica lo entendido', detalle: 'Resume con tus palabras y confirma con la persona.', icono: 'CheckCircle2', evidencia: 'Entendimiento confirmado.' },
        { titulo: 'Agradece y registra', detalle: 'Anota hechos, documentos y fechas, sin juicios.', icono: 'FileText', evidencia: 'Notas de auditoría trazables.' },
      ],
    },
    caso: {
      titulo: 'Los resultados copiados',
      contexto: 'Al revisar los cromatogramas de valoración de tres lotes, un auditor nota que las áreas de los picos son idénticas hasta el último decimal en las tres series, algo improbable. La analista se pone nerviosa y dice que «a veces pasa».',
      pregunta: '¿Qué debe hacer el auditor?',
      opciones: [
        { texto: 'Acusar a la analista de fraude frente al equipo para dejar claro que no se tolera.', correcta: false, retro: 'Acusar públicamente viola el respeto y no es el rol de quien audita. Además, puede comprometer la investigación.' },
        { texto: 'Asegurar la evidencia, identificar con precisión los archivos y registros, informar de inmediato al líder y a la dirección de calidad, y continuar con objetividad.', correcta: true, retro: 'Quien audita asegura e informa; la organización investiga. La evidencia bien identificada permite una investigación justa.' },
        { texto: 'No registrarlo para no perjudicar a la analista, porque podría ser una coincidencia.', correcta: false, retro: 'Ocultar una posible falsificación de datos viola la integridad y la presentación imparcial, y pone en riesgo al paciente.' },
      ],
    },
    errores: [
      { error: 'Aceptar regalos «pequeños» del auditado.', correccion: 'Declina con cortesía cualquier beneficio que pueda influir o parecer que influye.' },
      { error: 'Discutir con el auditado para ganar la razón.', correccion: 'Vuelve a la evidencia y al criterio; registra la divergencia si no se resuelve.' },
      { error: 'Guardar evidencia digital en el celular personal.', correccion: 'Usa los medios autorizados y protege la confidencialidad de la información.' },
    ],
    comprueba: [
      { pregunta: '¿Cuándo se declara un conflicto de interés?', respuesta: 'Antes de la auditoría, para que quien gestiona el programa ajuste la asignación o proteja la imparcialidad.' },
      { pregunta: 'Da un ejemplo de pregunta abierta de auditoría.', respuesta: '«¿Me muestra cómo registra el despeje de línea antes de iniciar un lote?».' },
      { pregunta: '¿Qué hace quien audita ante una posible falsificación de datos?', respuesta: 'Asegura la evidencia, la identifica con precisión e informa de inmediato al líder y a la dirección de calidad.' },
    ],
    resumen: [
      'La **integridad** y la **independencia** se protegen en campo: no aceptes beneficios y declara conflictos.',
      'Pregunta abierto, escucha, verifica y **pide la evidencia**.',
      'Ante posible fraude: **asegura, identifica e informa**; no acuses.',
    ],
    referencias: [R.iso19011, R.picsPi041, R.fdaIntegridad, R.picsPi040],
    imagenes: [
      { ubicacion: 'Junto a la sección de comunicación', descripcion: 'Ilustración de una auditora y un supervisor revisando juntos un registro en una tableta, con burbujas de diálogo que muestran preguntas abiertas.', alt: 'Comunicación respetuosa entre auditora y auditado durante una auditoría' },
    ],
    keywords: ['ética del auditor', 'comportamiento del auditor en campo', 'conflicto de interés en auditoría', 'técnicas de comunicación en auditoría', 'qué hacer ante fraude en auditoría', 'integridad del auditor interno'],
  },
];

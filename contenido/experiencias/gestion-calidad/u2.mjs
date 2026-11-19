/**
 * Unidad 2. Marco normativo colombiano de la calidad farmacéutica (7 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: mapa de la regulación de calidad en Colombia',
    duracion: 20,
    gancho: {
      titulo: '¿Qué norma me aplica?',
      texto: 'Una química farmacéutica llega a dirigir el aseguramiento de calidad de un laboratorio que fabrica tabletas y, además, tiene una droguería institucional. En su primera semana le preguntan: ¿qué norma rige la planta?, ¿cuál la droguería?, ¿quién nos inspecciona a cada una? Sin un mapa claro, es fácil aplicar el requisito equivocado o dejar uno por fuera. Esta unidad te da ese mapa.',
    },
    objetivos: [
      'Identificar las autoridades que regulan e inspeccionan la calidad farmacéutica en Colombia y su papel.',
      'Ubicar las normas principales según el tipo de actividad: fabricación, laboratorio de control de calidad y servicio farmacéutico.',
      'Reconocer la ruta de la unidad y cómo cada norma alimenta el sistema de gestión de calidad.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'Ministerio de Salud y Protección Social', definicion: 'Define la política y expide los decretos reglamentarios y las resoluciones técnicas, como los manuales de BPM.' },
      { icono: 'ShieldCheck', termino: 'INVIMA', definicion: 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos, creado por el artículo 245 de la Ley 100 de 1993. Otorga registros sanitarios, certifica buenas prácticas e inspecciona, vigila y controla a fabricantes e importadores.' },
      { icono: 'MapPin', termino: 'Entidades territoriales de salud', definicion: 'Las secretarías de salud departamentales, distritales y municipales vigilan los establecimientos farmacéuticos minoristas y el servicio farmacéutico en su territorio.' },
      { icono: 'BookOpen', termino: 'Norma de referencia', definicion: 'Documento técnico que no es obligatorio por sí mismo (por ejemplo, una guía de la OMS posterior o ISO 9001), pero que orienta las buenas prácticas y que la autoridad puede usar como criterio técnico.' },
    ],
    mapa: {
      centro: 'Regulación de la calidad en Colombia',
      ramas: [
        { titulo: 'Marco general', icono: 'Landmark', nodos: ['Ley 9 de 1979 (Código Sanitario)', 'Ley 100 de 1993: creación del INVIMA', 'Decreto 677 de 1995: registros y control de calidad'] },
        { titulo: 'Fabricación', icono: 'Factory', nodos: ['BPM: Resolución 1160 de 2016 y sus modificaciones', 'Certificación: Decreto 335 de 2022', 'Estabilidad: Resolución 3157 de 2018'] },
        { titulo: 'Laboratorio', icono: 'Microscope', nodos: ['BPL: Resolución 3619 de 2013'] },
        { titulo: 'Servicio farmacéutico', icono: 'Pill', nodos: ['Decreto 780 de 2016 (compila el Decreto 2200 de 2005)', 'Resolución 1403 de 2007'] },
      ],
    },
    secciones: [
      {
        titulo: 'Quién regula y quién vigila',
        parrafos: [
          'En Colombia, el **Ministerio de Salud y Protección Social** fija la política farmacéutica y expide las normas: decretos reglamentarios y resoluciones técnicas como los manuales de Buenas Prácticas de Manufactura. El **INVIMA**, creado por la Ley 100 de 1993, ejecuta la vigilancia sanitaria de los productos y de quienes los fabrican e importan: otorga los registros sanitarios, certifica el cumplimiento de buenas prácticas, inspecciona las plantas y adopta medidas sanitarias cuando encuentra riesgos.',
          'Las **secretarías de salud** de departamentos, distritos y municipios vigilan los establecimientos farmacéuticos minoristas, como droguerías y farmacias-droguerías, y el servicio farmacéutico de los prestadores en su territorio. Saber quién te inspecciona importa porque define qué guía de verificación usará y ante quién respondes por un hallazgo.',
        ],
      },
      {
        titulo: 'Las normas según la actividad',
        parrafos: [
          'El punto de partida es el **Decreto 677 de 1995**, que reglamenta el régimen de registros sanitarios, el control de calidad y la vigilancia sanitaria de los medicamentos. Sobre él se apoyan las normas técnicas por actividad. Para la **fabricación**, la **Resolución 1160 de 2016** adopta los manuales de BPM y las guías de inspección basados en informes técnicos de la OMS, y el **Decreto 335 de 2022** fija el procedimiento para obtener los certificados de buenas prácticas. Para el **laboratorio de control de calidad**, la **Resolución 3619 de 2013** adopta las Buenas Prácticas de Laboratorio.',
          'Para el **servicio farmacéutico**, el **Decreto 780 de 2016**, Decreto Único Reglamentario del sector salud, compila las disposiciones del Decreto 2200 de 2005, y la **Resolución 1403 de 2007** adopta el modelo de gestión y el manual de condiciones esenciales y procedimientos. Existen además normas específicas por tipo de producto (biológicos, gases medicinales, radiofármacos, productos fitoterapéuticos) que se estudian en los cursos de asuntos regulatorios.',
        ],
      },
      {
        titulo: 'Cómo usar el mapa en tu SGC',
        parrafos: [
          'Un sistema de gestión de calidad farmacéutico necesita una **matriz de requisitos legales**: una lista viva de las normas que aplican a la organización, el requisito concreto, el proceso responsable y la evidencia de cumplimiento. ISO 9001 pide determinar los requisitos legales y reglamentarios aplicables, y la autoridad sanitaria espera que la organización los conozca y los cumpla.',
          'En esta unidad recorrerás el Decreto 677, la gestión de cambios con impacto regulatorio, la Resolución 1160 y los principios de BPM de la OMS, y las normas del servicio farmacéutico. Al terminar podrás construir la matriz de requisitos de tu organización y conectarla con los procesos del sistema.',
        ],
      },
    ],
    caso: {
      titulo: 'La planta y la droguería institucional',
      contexto: 'Una empresa tiene una planta de fabricación de tabletas y un servicio farmacéutico que dispensa medicamentos a sus pacientes de un programa de salud. La nueva directora de calidad quiere un solo listado de requisitos.',
      pregunta: '¿Qué normas deben estar como base en su matriz de requisitos?',
      opciones: [
        { texto: 'Solo la Resolución 1160 de 2016, porque es la de calidad.', correcta: false, retro: 'Esa norma rige la fabricación. El servicio farmacéutico tiene su propio marco (Decreto 780 de 2016 y Resolución 1403 de 2007).' },
        { texto: 'Decreto 677 de 1995 y Resolución 1160 de 2016 para la planta; Decreto 780 de 2016 (Decreto 2200 de 2005 compilado) y Resolución 1403 de 2007 para el servicio farmacéutico; y la Resolución 3619 de 2013 si tiene laboratorio de control de calidad.', correcta: true, retro: 'Exacto: cada actividad tiene su norma y su autoridad, y la matriz las integra en un solo sistema.' },
        { texto: 'ISO 9001:2015, porque reemplaza a las normas colombianas.', correcta: false, retro: 'ISO 9001 es voluntaria y complementa, pero no reemplaza, los requisitos legales obligatorios.' },
      ],
    },
    errores: [
      { error: 'Confundir una guía de referencia con la norma obligatoria.', correccion: 'Identifica qué está adoptado por norma colombiana y qué es referencia técnica; ambas sirven, pero con distinto peso.' },
      { error: 'Tener una matriz de requisitos que nadie actualiza.', correccion: 'Asigna un responsable y una frecuencia de revisión, y vincula cada requisito con su proceso y su evidencia.' },
      { error: 'Suponer que el INVIMA vigila todo.', correccion: 'Los establecimientos minoristas y el servicio farmacéutico los vigila la secretaría de salud de tu territorio.' },
    ],
    comprueba: [
      { pregunta: '¿Qué norma creó el INVIMA?', respuesta: 'La Ley 100 de 1993, en su artículo 245.' },
      { pregunta: '¿Qué resolución adopta los manuales de BPM y las guías de inspección?', respuesta: 'La Resolución 1160 de 2016 del Ministerio de Salud y Protección Social, con sus modificaciones.' },
      { pregunta: '¿Qué normas rigen el servicio farmacéutico?', respuesta: 'El Decreto 780 de 2016, que compila el Decreto 2200 de 2005, y la Resolución 1403 de 2007.' },
    ],
    resumen: [
      'El **Ministerio** regula; el **INVIMA** registra, certifica y vigila a fabricantes; las **secretarías** vigilan el servicio farmacéutico.',
      'Cada actividad tiene su norma: **fabricación**, **laboratorio** y **servicio farmacéutico**.',
      'Una **matriz de requisitos legales** viva conecta el mapa normativo con el SGC.',
    ],
    referencias: [R.ley100, R.dec677Invima, R.res1160Compilada, R.res3619, R.dec780, R.res1403],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Mapa ilustrado con tres columnas (fabricación, laboratorio, servicio farmacéutico) y la autoridad que vigila cada una.', alt: 'Mapa de la regulación de calidad farmacéutica en Colombia' },
    ],
    keywords: ['normatividad farmacéutica colombia', 'regulación de calidad farmacéutica colombia', 'qué hace el invima', 'normas bpm colombia', 'matriz de requisitos legales farmacéutica', 'marco legal servicio farmacéutico'],
  },
  {
    titulo: 'Decreto 677 de 1995: registros, licencias, control de calidad y vigilancia sanitaria',
    duracion: 25,
    gancho: {
      titulo: 'Treinta años y sigue siendo la base',
      texto: 'Muchos profesionales jóvenes creen que el Decreto 677 de 1995 es historia. Sin embargo, cuando el INVIMA evalúa un registro sanitario, exige que un laboratorio tenga control de calidad o adopta una medida sanitaria sobre un lote, buena parte de esas decisiones se apoya en él o en las normas que lo desarrollan. Entender su lógica es entender cómo el Estado colombiano decide qué medicamento puede venderse y cómo se vigila después.',
    },
    objetivos: [
      'Describir el alcance y los cuatro ejes del Decreto 677 de 1995: registros, licencias, control de calidad y vigilancia sanitaria.',
      'Explicar qué aprueba el registro sanitario y por qué cualquier cambio sobre lo aprobado debe gestionarse.',
      'Relacionar las obligaciones de control de calidad y vigilancia con procesos concretos del SGC.',
    ],
    conceptos: [
      { icono: 'Stamp', termino: 'Registro sanitario', definicion: 'Documento público expedido por el INVIMA que autoriza a una persona natural o jurídica para fabricar, envasar, importar o comercializar un medicamento, según la modalidad aprobada.' },
      { icono: 'FileCheck', termino: 'Lo aprobado', definicion: 'La información técnica que respalda el registro: fórmula, fabricante, especificaciones, métodos, material de envase, vida útil, condiciones de almacenamiento, etiquetas e insertos.' },
      { icono: 'Microscope', termino: 'Control de calidad', definicion: 'Las actividades de muestreo, análisis y liberación que demuestran que el producto cumple lo aprobado antes de comercializarlo.' },
      { icono: 'Eye', termino: 'Vigilancia sanitaria', definicion: 'Las acciones de inspección, vigilancia y control de la autoridad, incluidas las medidas sanitarias de seguridad y el procedimiento sancionatorio.' },
    ],
    mapa: {
      centro: 'Decreto 677 de 1995',
      ramas: [
        { titulo: 'Registros', icono: 'Stamp', nodos: ['Modalidades (fabricar y vender, importar y vender…)', 'Evaluación farmacéutica y legal', 'Renovaciones y modificaciones'] },
        { titulo: 'Licencias y certificación', icono: 'BadgeCheck', nodos: ['Condiciones de fabricación', 'Hoy: certificación de buenas prácticas'] },
        { titulo: 'Control de calidad', icono: 'Microscope', nodos: ['Especificaciones aprobadas', 'Análisis antes de liberar', 'Laboratorio propio o contratado'] },
        { titulo: 'Vigilancia', icono: 'Eye', nodos: ['Inspección y muestreo', 'Medidas sanitarias de seguridad', 'Sanciones'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué regula',
        parrafos: [
          'El Decreto 677 de 1995 reglamenta parcialmente el régimen de **registros y licencias**, el **control de calidad** y el régimen de **vigilancia sanitaria** de los medicamentos, los cosméticos, las preparaciones farmacéuticas a base de recursos naturales y los productos de aseo, higiene y limpieza. Para los medicamentos establece qué se necesita para obtener un registro sanitario, en qué modalidades (por ejemplo, fabricar y vender o importar y vender), cómo se evalúa y cómo se renueva o modifica.',
          'El registro sanitario no es un permiso genérico: autoriza **un producto concreto con una información técnica concreta**. Por eso el fabricante o el titular no pueden cambiar libremente la fórmula, el fabricante, las especificaciones o la vida útil: cualquier cambio sobre lo aprobado debe evaluarse y, cuando corresponde, tramitarse ante el INVIMA antes de implementarse. El Ministerio de Salud publicó un análisis de impacto normativo del decreto que explica su alcance y los retos de actualizarlo.',
        ],
      },
      {
        titulo: 'Control de calidad y fabricación',
        parrafos: [
          'El decreto exige que los fabricantes cuenten con control de calidad para verificar materias primas, productos en proceso y productos terminados según las especificaciones aprobadas, y que la fabricación se haga en condiciones que garanticen la calidad. Las exigencias de licencia de funcionamiento evolucionaron hacia la **certificación de cumplimiento de Buenas Prácticas de Manufactura**, cuyo procedimiento fijó el Decreto 549 de 2001 y hoy el Decreto 335 de 2022.',
          'En términos de sistema de calidad, esto se traduce en procesos que el SGC debe tener bajo control: gestión de especificaciones alineadas con el registro, análisis y liberación de lotes, calificación de laboratorios contratados y un control de cambios que conecte cada modificación técnica con su trámite regulatorio.',
        ],
      },
      {
        titulo: 'Vigilancia: lo que pasa después de vender',
        parrafos: [
          'La vigilancia sanitaria incluye visitas de inspección, toma de muestras en el mercado y respuesta a denuncias. Cuando la autoridad encuentra un riesgo para la salud puede aplicar **medidas sanitarias de seguridad**, como la congelación o suspensión de productos o la suspensión de actividades, y adelantar un **procedimiento sancionatorio** que puede terminar en multas, decomisos o la suspensión o cancelación del registro.',
          'Para el SGC, la consecuencia es clara: la organización debe poder responder con evidencia. Un sistema de quejas que investiga, un procedimiento de retiro del mercado probado con simulacros, registros de lote completos y trazabilidad de distribución son la mejor defensa ante una actuación de la autoridad.',
        ],
      },
    ],
    caso: {
      titulo: 'El cambio de fabricante del principio activo',
      contexto: 'Compras encuentra un fabricante alterno de principio activo, con precio menor y certificado de análisis que cumple la farmacopea. Producción quiere usarlo desde el próximo lote porque «es la misma molécula».',
      pregunta: '¿Qué debe hacer aseguramiento de calidad según la lógica del Decreto 677?',
      opciones: [
        { texto: 'Aprobarlo, porque la molécula y la especificación son iguales.', correcta: false, retro: 'El fabricante del activo hace parte de la información que respalda el registro; cambiarlo sin evaluación ni trámite puede dejar el producto por fuera de lo aprobado.' },
        { texto: 'Abrir un control de cambios: evaluar el impacto técnico, calificar al fabricante y verificar con asuntos regulatorios si el cambio requiere trámite ante el INVIMA antes de usarlo.', correcta: true, retro: 'Así se protege la validez del registro y la calidad: el cambio se evalúa, se califica y se tramita cuando corresponde antes de implementarlo.' },
        { texto: 'Usarlo y notificar al INVIMA en la renovación del registro.', correcta: false, retro: 'Implementar un cambio sin el trámite que corresponda expone a la empresa a medidas sanitarias y sanciones.' },
      ],
    },
    errores: [
      { error: 'Tratar el registro sanitario como un permiso general de la empresa.', correccion: 'El registro autoriza un producto con su información técnica; cambiarla exige evaluación y, a veces, trámite previo.' },
      { error: 'Especificaciones internas que no coinciden con las aprobadas.', correccion: 'Mantén la especificación interna igual o más estricta que la aprobada y documenta su trazabilidad al registro.' },
      { error: 'Descubrir en una visita que el procedimiento de retiro nunca se ha probado.', correccion: 'Haz simulacros de retiro y mide el tiempo y el porcentaje de producto localizado.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los ejes del Decreto 677 de 1995?', respuesta: 'Registros y licencias, control de calidad y vigilancia sanitaria.' },
      { pregunta: '¿Qué norma fija hoy el procedimiento para certificar buenas prácticas?', respuesta: 'El Decreto 335 de 2022.' },
      { pregunta: '¿Qué medidas puede aplicar la autoridad ante un riesgo?', respuesta: 'Medidas sanitarias de seguridad, como la congelación o suspensión de productos o actividades, además del procedimiento sancionatorio.' },
    ],
    resumen: [
      'El Decreto 677 regula **registros, control de calidad y vigilancia** de los medicamentos.',
      'El registro autoriza **un producto con su información técnica**: los cambios se gestionan.',
      'Quejas, retiros, trazabilidad y registros completos son la **evidencia** ante la vigilancia.',
    ],
    referencias: [R.dec677Invima, R.ainDec677, R.dec549, R.dec335],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Diagrama de cuatro bloques: registro, certificación, control de calidad y vigilancia, unidos por el ciclo de vida del medicamento.', alt: 'Ejes del Decreto 677 de 1995 sobre medicamentos' },
    ],
    keywords: ['decreto 677 de 1995', 'decreto 677 resumen', 'registro sanitario de medicamentos colombia', 'vigilancia sanitaria invima', 'medidas sanitarias de seguridad', 'control de calidad decreto 677'],
  },
  {
    titulo: 'Cambios con impacto en la calidad y su trámite ante el INVIMA',
    duracion: 25,
    gancho: {
      titulo: 'Un cambio pequeño en la planta, un problema grande en el registro',
      texto: 'Un laboratorio amplió la vida útil de un jarabe de 24 a 36 meses porque los estudios de estabilidad lo respaldaban. Lo hizo internamente y empezó a imprimir la nueva fecha. En la siguiente visita, el inspector preguntó por la aprobación de esa modificación. No existía. Los datos eran buenos, pero el producto en el mercado ya no coincidía con lo autorizado. Esta clase trata de cómo evitar ese desencuentro entre la realidad de la planta y lo que dice el registro.',
    },
    objetivos: [
      'Identificar qué cambios técnicos pueden afectar lo aprobado en el registro sanitario.',
      'Describir el flujo entre el control de cambios interno y el trámite ante el INVIMA.',
      'Clasificar cambios según su impacto en la calidad y su ruta regulatoria.',
    ],
    conceptos: [
      { icono: 'GitBranch', termino: 'Control de cambios', definicion: 'Proceso del SGC que propone, evalúa, aprueba, implementa y verifica cualquier cambio que pueda afectar la calidad, la validación o el cumplimiento regulatorio.' },
      { icono: 'FileSearch', termino: 'Evaluación regulatoria', definicion: 'Paso del control de cambios en que asuntos regulatorios determina si el cambio modifica lo aprobado y qué trámite requiere ante la autoridad.' },
      { icono: 'Stamp', termino: 'Modificación del registro', definicion: 'Trámite ante el INVIMA para cambiar información aprobada del registro sanitario. Según el tipo de cambio, puede requerir aprobación antes de implementarlo.' },
      { icono: 'Layers', termino: 'Clasificación por riesgo', definicion: 'Ordenar los cambios según su posible impacto en la calidad: mayores, moderados o menores. ICH Q12 propone categorías regulatorias según ese riesgo.' },
    ],
    proceso: {
      titulo: 'Del cambio propuesto al cambio implementado',
      intro: 'El control de cambios conecta la decisión técnica con la regulatoria.',
      pasos: [
        { titulo: 'Proponer', detalle: 'Quien propone describe el cambio, su justificación y lo que se afectaría.', icono: 'FileText', evidencia: 'Solicitud de cambio numerada.' },
        { titulo: 'Evaluar el impacto técnico', detalle: 'Calidad, producción y las áreas implicadas evalúan efecto en el producto, la validación, la estabilidad y la documentación.', icono: 'Search', evidencia: 'Evaluación de impacto firmada.' },
        { titulo: 'Evaluar el impacto regulatorio', detalle: 'Asuntos regulatorios compara el cambio con lo aprobado y define si requiere trámite y de qué tipo.', icono: 'Landmark', evidencia: 'Concepto regulatorio.' },
        { titulo: 'Aprobar el plan', detalle: 'Se aprueban las acciones: estudios, validaciones, documentos, capacitación y radicación del trámite.', icono: 'ClipboardCheck', evidencia: 'Plan de cambio aprobado.' },
        { titulo: 'Obtener la autorización', detalle: 'Si el cambio requiere aprobación previa, se espera el acto del INVIMA antes de implementar.', icono: 'Stamp', evidencia: 'Resolución o autorización.' },
        { titulo: 'Implementar y verificar', detalle: 'Se implementa en la fecha definida y se verifica que el cambio fue eficaz y no tuvo efectos no deseados.', icono: 'CheckCircle2', evidencia: 'Cierre del cambio con verificación.' },
      ],
    },
    secciones: [
      {
        titulo: 'Qué cambios tocan el registro',
        parrafos: [
          'Muchos cambios de una planta son internos y no afectan lo aprobado: reorganizar un almacén, actualizar un formato o reemplazar un equipo idéntico. Otros sí tocan la información del registro sanitario: la **fórmula**, el **fabricante** del producto o del principio activo, las **especificaciones** y métodos, el **material de envase** primario, la **vida útil** y las condiciones de almacenamiento, las **etiquetas e insertos** o el **titular**. Estos últimos exigen una evaluación regulatoria antes de implementarlos.',
          'El INVIMA tramita las modificaciones del registro sanitario y define los requisitos de cada tipo de cambio. El curso de modificaciones al registro sanitario de la línea regulatoria estudia cada trámite en detalle; aquí lo importante es el principio de gestión: **ningún cambio que afecte lo aprobado se implementa sin saber si requiere autorización previa**.',
        ],
      },
      {
        titulo: 'Clasificar por riesgo',
        parrafos: [
          'ICH Q12, la guía de gestión del ciclo de vida del producto, propone clasificar los cambios posteriores a la aprobación según su riesgo para la calidad: los de mayor riesgo requieren **aprobación previa** de la autoridad, los de riesgo moderado pueden requerir **notificación** y los de menor riesgo se gestionan en el sistema de calidad de la empresa. También introduce los **elementos establecidos**, lo que el registro fija y cuyo cambio exige trámite. Aunque cada autoridad define sus propias categorías, este enfoque ayuda a priorizar.',
          'Un buen sistema de control de cambios incluye una **clasificación interna** (mayor, moderado, menor) con criterios escritos, y la conecta con la ruta regulatoria. El error del jarabe del ejemplo no fue técnico: fue no conectar el cambio de vida útil con el trámite correspondiente.',
        ],
      },
      {
        titulo: 'Implementar sin perder la trazabilidad',
        parrafos: [
          'Cuando el cambio se aprueba, la implementación debe ser trazable: se define desde qué lote aplica, qué documentos se actualizan, quién se capacita y cómo se manejan los inventarios de material anterior (por ejemplo, etiquetas viejas). Mientras llega la autorización, la planta sigue fabricando con la condición aprobada.',
          'Al cierre, el control de cambios verifica la **eficacia**: que el cambio logró su objetivo y no generó desviaciones, quejas ni resultados atípicos. La revisión periódica de los cambios cerrados alimenta la revisión por la dirección y la revisión de calidad del producto.',
        ],
      },
    ],
    caso: {
      titulo: 'El nuevo proveedor del frasco',
      contexto: 'Un laboratorio quiere cambiar el proveedor del frasco de vidrio ámbar de un jarabe. El nuevo frasco es del mismo material y color, pero de otro fabricante y con otra tapa.',
      pregunta: '¿Cómo debe gestionarse?',
      opciones: [
        { texto: 'Como un cambio menor de compras, sin evaluación regulatoria.', correcta: false, retro: 'El envase primario hace parte de lo aprobado y puede afectar la estabilidad; requiere evaluación técnica y regulatoria.' },
        { texto: 'Con control de cambios: evaluar compatibilidad y estabilidad, calificar al proveedor y verificar con asuntos regulatorios si se requiere modificación del registro antes de usarlo.', correcta: true, retro: 'Es un cambio de envase primario: se evalúa el impacto en el producto y la ruta regulatoria antes de implementarlo.' },
        { texto: 'Usar el frasco nuevo y vigilar las quejas.', correcta: false, retro: 'Esperar quejas es reaccionar tarde y expone al paciente y al registro.' },
      ],
    },
    errores: [
      { error: 'Implementar mientras el trámite está en curso.', correccion: 'Si el cambio requiere aprobación previa, se mantiene la condición aprobada hasta recibir la autorización.' },
      { error: 'Control de cambios sin participación de asuntos regulatorios.', correccion: 'Incluye siempre la evaluación regulatoria como paso obligatorio del flujo.' },
      { error: 'Cerrar el cambio al implementarlo, sin verificar su eficacia.', correccion: 'Define criterios de eficacia y un plazo para verificarlos antes del cierre.' },
    ],
    comprueba: [
      { pregunta: 'Nombra tres elementos del registro cuyo cambio requiere evaluación regulatoria.', respuesta: 'Por ejemplo: fórmula, fabricante, especificaciones, envase primario, vida útil, etiquetas o titular.' },
      { pregunta: '¿Qué aporta ICH Q12 a la gestión de cambios?', respuesta: 'Una clasificación de cambios por riesgo (aprobación previa, notificación o gestión interna) y el concepto de elementos establecidos.' },
    ],
    resumen: [
      'Los cambios que tocan **lo aprobado** exigen evaluación regulatoria antes de implementarse.',
      'Clasifica los cambios **por riesgo** y conecta cada clase con su ruta regulatoria.',
      'Implementa con **trazabilidad** y cierra solo después de verificar la **eficacia**.',
    ],
    referencias: [R.dec677Invima, R.ichQ12, R.ichQ10, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Flujo ilustrado del control de cambios con una bifurcación: cambio interno o cambio que requiere trámite ante la autoridad.', alt: 'Flujo de control de cambios y trámite regulatorio ante el INVIMA' },
    ],
    keywords: ['modificaciones al registro sanitario invima', 'control de cambios farmacéutico', 'cambios post aprobación ich q12', 'cambio de vida útil medicamento', 'clasificación de cambios farmacéuticos', 'gestión del cambio regulatorio'],
  },
  {
    titulo: 'Resolución 1160 de 2016 y la adopción del Informe 37 OMS: alcance para el SGC',
    duracion: 25,
    gancho: {
      titulo: 'La guía que el inspector lleva en la mano',
      texto: 'En una visita de certificación, el inspector del INVIMA no improvisa: recorre la planta con una guía de inspección que tiene, numeral por numeral, lo que espera ver. Esa guía viene de la Resolución 1160 de 2016. Quien conoce su estructura puede preparar la planta, priorizar las brechas y hablar el mismo idioma de la autoridad.',
    },
    objetivos: [
      'Describir qué establece la Resolución 1160 de 2016 y en qué informes técnicos de la OMS se basa.',
      'Diferenciar los manuales de BPM de las guías de inspección y entender para qué sirve cada uno.',
      'Usar la estructura de la resolución para organizar el sistema de calidad y la autoinspección.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'Resolución 1160 de 2016', definicion: 'Norma del Ministerio de Salud y Protección Social que establece los manuales de Buenas Prácticas de Manufactura y las guías de inspección de los laboratorios fabricantes de medicamentos, para obtener el certificado de BPM.' },
      { icono: 'Globe', termino: 'Informe 37 de la OMS', definicion: 'El 37.º informe del Comité de Expertos de la OMS en especificaciones para preparaciones farmacéuticas (TRS 908, 2003). Su Anexo 4 contiene los principios principales de BPM que toma como base la resolución para los medicamentos no estériles.' },
      { icono: 'Droplets', termino: 'Informe 45 de la OMS', definicion: 'El 45.º informe (TRS 961, 2011). Su Anexo 6 contiene las BPM para productos farmacéuticos estériles, base del manual de estériles de la resolución.' },
      { icono: 'ClipboardList', termino: 'Guía de inspección', definicion: 'El instrumento con el que la autoridad verifica el cumplimiento, organizado por capítulos y numerales, que la empresa puede usar como lista de autoinspección.' },
    ],
    secciones: [
      {
        titulo: 'Qué adopta la resolución',
        parrafos: [
          'La **Resolución 1160 de 2016** del Ministerio de Salud y Protección Social establece los **manuales de Buenas Prácticas de Manufactura** y las **guías de inspección** que aplican los laboratorios fabricantes de medicamentos para obtener el certificado de cumplimiento de BPM. Reemplazó el marco anterior basado en el Informe 32 de la OMS (TRS 823) y tomó como base el **Anexo 4 del Informe 37** (TRS 908) para los medicamentos no estériles y el **Anexo 6 del Informe 45** (TRS 961) para los estériles. Ha tenido modificaciones posteriores, como la Resolución 886 de 2019, por lo que conviene consultar siempre el texto compilado del normograma del INVIMA.',
          'La resolución está organizada en anexos técnicos: los manuales, que dicen **qué** se exige, y las guías de inspección, que dicen **cómo** se verifica. La OMS ha publicado versiones más recientes de sus principios de BPM, como el TRS 986 de 2014, que sirven como referencia técnica, pero la norma obligatoria en Colombia es la adoptada por la resolución.',
        ],
      },
      {
        titulo: 'Lo que exige al sistema de calidad',
        parrafos: [
          'Los manuales parten de la **garantía de la calidad** como un sistema: la empresa debe diseñar e implementar un sistema que asegure que los productos se diseñan y desarrollan considerando las BPM, que las responsabilidades están definidas, que existen procedimientos y registros, que se controlan los cambios, que las desviaciones se investigan y que cada lote es liberado por una persona autorizada. Luego desarrollan los elementos: personal, instalaciones, equipos, materiales, documentación, producción, control de calidad, quejas, retiros, contratos y autoinspección.',
          'Para un SGC, la resolución es la **lista mínima obligatoria** de procesos. Un sistema maduro la cumple y la integra con los elementos de gestión de ICH Q10 e ISO 9001: revisión por la dirección, indicadores, gestión del conocimiento y mejora continua.',
        ],
      },
      {
        titulo: 'La guía de inspección como herramienta interna',
        parrafos: [
          'Las guías de inspección son la mejor lista de verificación para la **autoinspección** porque son las mismas que usará el INVIMA. Una práctica útil es asignar cada capítulo a un dueño de proceso, autoevaluar cada numeral con evidencia (cumple, cumple parcialmente, no cumple, no aplica) y convertir las brechas en un plan de acción priorizado por riesgo.',
          'Los criterios de calificación de los hallazgos (por ejemplo, críticos, mayores y menores) permiten priorizar: una brecha que puede afectar al paciente o la integridad de los datos se atiende antes que una mejora documental. Esa priorización es justamente lo que el pensamiento basado en riesgos pide al SGC.',
        ],
      },
    ],
    caso: {
      titulo: 'Preparar la recertificación',
      contexto: 'Faltan seis meses para la visita de recertificación BPM de una planta de sólidos. El gerente pide «tener todo listo» y aseguramiento de calidad debe proponer un método.',
      pregunta: '¿Qué método es el más sólido?',
      opciones: [
        { texto: 'Actualizar todos los procedimientos al formato nuevo.', correcta: false, retro: 'Actualizar formatos no cierra brechas reales; la autoridad verifica cumplimiento con evidencia.' },
        { texto: 'Hacer una autoinspección completa con las guías de inspección de la Resolución 1160, calificar las brechas por riesgo y ejecutar un plan con responsables y fechas.', correcta: true, retro: 'Usar la misma herramienta del inspector y priorizar por riesgo es la forma más eficaz de prepararse.' },
        { texto: 'Contratar una auditoría externa ISO 9001.', correcta: false, retro: 'ISO 9001 aporta gestión, pero no evalúa los requisitos específicos de BPM de la resolución.' },
      ],
    },
    errores: [
      { error: 'Trabajar con una copia desactualizada de la resolución.', correccion: 'Consulta el texto compilado del normograma del INVIMA, que incluye las modificaciones.' },
      { error: 'Confundir la guía OMS más reciente con la norma obligatoria.', correccion: 'La guía reciente es referencia técnica; la obligatoria es la adoptada por la resolución.' },
      { error: 'Autoinspecciones sin evidencia, solo con «cumple».', correccion: 'Cada numeral calificado debe tener la evidencia que lo respalda.' },
    ],
    comprueba: [
      { pregunta: '¿En qué informes de la OMS se basa la Resolución 1160 de 2016?', respuesta: 'En el Anexo 4 del Informe 37 (TRS 908) para no estériles y en el Anexo 6 del Informe 45 (TRS 961) para estériles.' },
      { pregunta: '¿Qué diferencia hay entre un manual y una guía de inspección?', respuesta: 'El manual dice qué se exige; la guía de inspección dice cómo lo verifica la autoridad.' },
    ],
    resumen: [
      'La Resolución 1160 de 2016 adopta los **manuales de BPM** y las **guías de inspección**.',
      'Se basa en el **Informe 37** (no estériles) y el **Informe 45** (estériles) de la OMS.',
      'Usa las **guías de inspección** como herramienta de autoinspección y prioriza por riesgo.',
    ],
    referencias: [R.res1160, R.res1160Compilada, R.res886, R.trs986a2],
    imagenes: [
      { ubicacion: 'Junto a la sección de la guía de inspección', descripcion: 'Tabla ilustrada de autoinspección con columnas de numeral, calificación, evidencia y acción.', alt: 'Autoinspección BPM con las guías de inspección de la Resolución 1160 de 2016' },
    ],
    keywords: ['resolución 1160 de 2016', 'resolución 1160 de 2016 bpm', 'informe 37 oms bpm', 'guías de inspección bpm invima', 'autoinspección bpm', 'trs 908 anexo 4'],
  },
  {
    titulo: 'Principios generales de BPM de la OMS y el sistema de calidad farmacéutico',
    duracion: 25,
    gancho: {
      titulo: 'Las BPM no son una lista de chequeo',
      texto: 'Un auditor nuevo recorre una planta con una lista de 300 preguntas y concluye que «casi todo cumple». Una auditora con experiencia recorre la misma planta y pregunta: ¿cómo sabe la dirección que el sistema funciona?, ¿quién decide liberar un lote y con qué información?, ¿qué pasó con las desviaciones del último trimestre? Las BPM de la OMS empiezan por el sistema de calidad, no por la lista. Esta clase muestra por qué.',
    },
    objetivos: [
      'Describir la estructura de los principios principales de BPM de la OMS.',
      'Explicar la relación entre el sistema de calidad farmacéutico, las BPM y el control de calidad.',
      'Identificar los elementos del sistema de calidad que la OMS incorporó a partir de ICH Q10 y Q9.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'Sistema de calidad farmacéutico', definicion: 'El sistema de gestión que dirige y controla a la empresa en lo relativo a la calidad. Contiene a las BPM, que a su vez contienen al control de calidad.' },
      { icono: 'Factory', termino: 'Buenas Prácticas de Manufactura', definicion: 'La parte de la gestión de calidad que asegura que los productos se fabrican y controlan de forma consistente según los estándares apropiados para su uso y lo exigido en su autorización.' },
      { icono: 'Microscope', termino: 'Control de calidad', definicion: 'La parte de las BPM que se ocupa del muestreo, las especificaciones, los análisis y la liberación.' },
      { icono: 'FileCheck', termino: 'Revisión de calidad del producto', definicion: 'Revisión periódica, generalmente anual, de todos los lotes de un producto para verificar la consistencia del proceso, detectar tendencias y decidir mejoras.' },
    ],
    mapa: {
      centro: 'BPM de la OMS',
      ramas: [
        { titulo: 'Sistema', icono: 'Layers', nodos: ['Sistema de calidad farmacéutico', 'Gestión de riesgos', 'Revisión de calidad del producto'] },
        { titulo: 'Recursos', icono: 'Users', nodos: ['Personal y capacitación', 'Higiene', 'Instalaciones y equipos'] },
        { titulo: 'Operación', icono: 'Factory', nodos: ['Materiales', 'Documentación', 'Producción y control de calidad'] },
        { titulo: 'Vigilancia', icono: 'Eye', nodos: ['Quejas y retiros', 'Contratos', 'Autoinspección y auditorías'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tres círculos concéntricos',
        parrafos: [
          'Los principios principales de BPM de la OMS (TRS 986, Anexo 2) ordenan la calidad en tres niveles que se contienen. El más amplio es el **sistema de calidad farmacéutico**: la dirección, la política, los recursos, la gestión de riesgos, la revisión por la dirección. Dentro están las **BPM**: los requisitos de fabricación y control. Y dentro de las BPM está el **control de calidad**: muestreo, especificaciones, análisis y liberación. Confundir los niveles lleva a creer que un buen laboratorio de análisis equivale a un buen sistema de calidad.',
          'La guía detalla luego los elementos: saneamiento e higiene; calificación y validación; quejas; retiros del mercado; producción y análisis por contrato; autoinspección, auditorías de calidad y de proveedores; personal y capacitación; higiene del personal; instalaciones; equipos; materiales; documentación; buenas prácticas de producción y buenas prácticas de control de calidad.',
        ],
      },
      {
        titulo: 'Lo que la OMS tomó de ICH',
        parrafos: [
          'En su actualización de 2014, la OMS incorporó explícitamente conceptos de **ICH Q10** y **Q9**: la responsabilidad de la dirección en el sistema de calidad, la **gestión de riesgos para la calidad** como base de las decisiones, la **revisión de calidad del producto** y la mejora continua a lo largo del ciclo de vida. Así, las BPM dejaron de ser solo un conjunto de reglas de fabricación y pasaron a exigir un sistema que se mide y mejora.',
          'La revisión de calidad del producto es un buen ejemplo: obliga a mirar todos los lotes del año, las desviaciones, los cambios, los resultados fuera de especificación, las quejas, los retiros y la estabilidad, y a concluir si el proceso sigue bajo control o necesita mejoras. Es la versión farmacéutica del ciclo PHVA aplicada a cada producto.',
        ],
      },
      {
        titulo: 'Cómo se conecta con la norma colombiana',
        parrafos: [
          'Los manuales de la Resolución 1160 de 2016 se basan en informes anteriores de la OMS (Informe 37 e Informe 45), que ya planteaban el sistema de garantía de calidad como base. Las versiones posteriores de la OMS no cambian la obligación colombiana, pero sí muestran hacia dónde evoluciona la expectativa de las autoridades: más gestión de riesgos, más datos de desempeño y más responsabilidad de la dirección.',
          'Para quien diseña un SGC, la recomendación práctica es cumplir la norma adoptada y usar la guía más reciente como **referencia de buenas prácticas**, especialmente en gestión de riesgos, revisión de producto e integridad de datos.',
        ],
      },
    ],
    caso: {
      titulo: 'El laboratorio impecable y el sistema débil',
      contexto: 'Una planta tiene un laboratorio de control de calidad con equipos modernos y métodos validados. Sin embargo, no hace revisión anual de producto, la dirección no revisa indicadores de calidad y las desviaciones se cierran sin tendencias.',
      pregunta: '¿Cuál es el diagnóstico correcto según los principios de la OMS?',
      opciones: [
        { texto: 'La planta cumple porque el control de calidad es robusto.', correcta: false, retro: 'El control de calidad es solo el círculo interno; faltan elementos del sistema de calidad farmacéutico.' },
        { texto: 'Hay brechas en el sistema de calidad farmacéutico: revisión de calidad del producto, revisión por la dirección y análisis de tendencias.', correcta: true, retro: 'Los principios de la OMS exigen que el sistema se mida y se revise; un buen laboratorio no lo reemplaza.' },
        { texto: 'Basta con comprar más equipos de análisis.', correcta: false, retro: 'Más análisis no resuelve la falta de gestión del sistema.' },
      ],
    },
    errores: [
      { error: 'Igualar calidad con control de calidad.', correccion: 'El control de calidad es una parte de las BPM, que son una parte del sistema de calidad.' },
      { error: 'Hacer la revisión anual de producto como un trámite de recopilación.', correccion: 'Úsala para concluir sobre el control del proceso y decidir mejoras con responsables.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los tres niveles que plantea la OMS?', respuesta: 'Sistema de calidad farmacéutico, BPM y control de calidad, en ese orden de amplitud.' },
      { pregunta: '¿Qué revisa la revisión de calidad del producto?', respuesta: 'Todos los lotes del periodo, desviaciones, cambios, resultados fuera de especificación, quejas, retiros y estabilidad, para concluir sobre el control del proceso.' },
    ],
    resumen: [
      'Sistema de calidad ⊃ **BPM** ⊃ **control de calidad**.',
      'La OMS incorporó **ICH Q10 y Q9**: dirección, riesgos y revisión de producto.',
      'Cumple la norma adoptada y usa la guía reciente como **referencia**.',
    ],
    referencias: [R.trs986a2, R.ichQ10, R.ichQ9, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'En la sección de los tres círculos', descripcion: 'Tres círculos concéntricos rotulados: sistema de calidad farmacéutico, BPM y control de calidad.', alt: 'Relación entre sistema de calidad, BPM y control de calidad según la OMS' },
    ],
    keywords: ['principios bpm oms', 'trs 986 anexo 2', 'sistema de calidad farmacéutico oms', 'diferencia entre bpm y control de calidad', 'revisión anual de producto', 'gmp oms principios principales'],
  },
  {
    titulo: 'Servicio farmacéutico en el Decreto 780 de 2016 y Decreto 2200 de 2005',
    duracion: 25,
    gancho: {
      titulo: 'La calidad no termina en la planta',
      texto: 'Un medicamento fabricado bajo BPM puede perder su calidad en pocas horas si se almacena junto a una ventana al sol, si una cadena de frío se rompe o si se dispensa el producto equivocado. Por eso Colombia regula el servicio farmacéutico con el mismo enfoque de procesos que la industria: el Decreto 2200 de 2005, hoy compilado en el Decreto 780 de 2016, definió qué es el servicio, qué procesos debe tener y quién responde por ellos.',
    },
    objetivos: [
      'Explicar qué es el servicio farmacéutico y sus modalidades según la normativa colombiana.',
      'Describir los procesos generales y especiales del servicio farmacéutico.',
      'Relacionar esos procesos con un sistema de gestión de calidad.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Servicio farmacéutico', definicion: 'El servicio de atención en salud responsable de las actividades, procedimientos e intervenciones de carácter técnico, científico y administrativo relacionados con los medicamentos y los dispositivos médicos, para contribuir a la salud y la calidad de vida.' },
      { icono: 'Building2', termino: 'Dependiente e independiente', definicion: 'El servicio farmacéutico dependiente hace parte de una institución prestadora de servicios de salud; el independiente se presta en establecimientos farmacéuticos como droguerías y farmacias-droguerías.' },
      { icono: 'Workflow', termino: 'Procesos generales', definicion: 'Los procesos que todo servicio debe cumplir según su complejidad, como selección, adquisición, recepción y almacenamiento, distribución y dispensación de medicamentos.' },
      { icono: 'Sparkles', termino: 'Procesos especiales', definicion: 'Los que se suman según el tipo y la complejidad del servicio, como la atención farmacéutica, la elaboración de preparaciones magistrales o la participación en programas de farmacovigilancia.' },
    ],
    mapa: {
      centro: 'Servicio farmacéutico',
      ramas: [
        { titulo: 'Modalidades', icono: 'Building2', nodos: ['Dependiente (IPS)', 'Independiente (establecimientos)', 'Grados de complejidad'] },
        { titulo: 'Procesos generales', icono: 'Workflow', nodos: ['Selección y adquisición', 'Recepción y almacenamiento', 'Distribución y dispensación'] },
        { titulo: 'Procesos especiales', icono: 'Sparkles', nodos: ['Atención farmacéutica', 'Preparaciones magistrales', 'Farmacovigilancia'] },
        { titulo: 'Responsables', icono: 'UserCheck', nodos: ['Dirección técnica', 'Talento humano competente', 'Vigilancia de la secretaría de salud'] },
      ],
    },
    secciones: [
      {
        titulo: 'Del Decreto 2200 al Decreto 780',
        parrafos: [
          'El **Decreto 2200 de 2005** reglamentó el servicio farmacéutico en Colombia y estableció sus objetivos, principios, modalidades, procesos y responsables. En 2016, el Gobierno expidió el **Decreto 780**, Decreto Único Reglamentario del sector salud, que compiló en un solo cuerpo normativo muchos decretos del sector, entre ellos las disposiciones del servicio farmacéutico. Por eso hoy se cita el Decreto 780 de 2016, y el 2200 de 2005 se sigue consultando para entender el origen y la estructura del texto.',
          'La norma distingue el servicio **dependiente**, que hace parte de una institución prestadora de servicios de salud (por ejemplo, el servicio farmacéutico de un hospital), y el **independiente**, que se presta en establecimientos farmacéuticos como droguerías. También define grados de complejidad del servicio, de los que dependen los procesos exigidos y el perfil de quien ejerce la dirección técnica.',
        ],
      },
      {
        titulo: 'Los procesos del servicio',
        parrafos: [
          'Los **procesos generales** recorren la vida del medicamento dentro del servicio: **selección** (qué medicamentos tener, con criterios de eficacia, seguridad y costo), **adquisición**, **recepción técnica** y **almacenamiento** en condiciones que conserven la calidad, **distribución** y **dispensación**, junto con el manejo de devoluciones y la destrucción o desnaturalización de medicamentos. Cada uno debe estar documentado en procedimientos y tener registros.',
          'Los **procesos especiales** dependen del tipo y la complejidad del servicio: la **atención farmacéutica** al paciente, la elaboración de **preparaciones magistrales** y otras preparaciones, la participación en **farmacovigilancia** y en comités, y actividades de información y educación sobre el uso adecuado de los medicamentos.',
        ],
      },
      {
        titulo: 'Por qué es un sistema de calidad',
        parrafos: [
          'La norma no se limita a enumerar tareas: exige que el servicio tenga procesos documentados, responsables, registros y seguimiento. Entre sus principios están la **conservación de la calidad** de los medicamentos, la **oportunidad**, la **seguridad** y la **eficiencia**. Esto es, en esencia, un sistema de gestión de calidad aplicado al servicio, que la Resolución 1403 de 2007 desarrolla con el modelo de gestión y el manual de condiciones esenciales que estudiarás en la siguiente clase.',
          'Para quien dirige un servicio farmacéutico, la tarea es convertir estos procesos en un mapa de procesos con indicadores (por ejemplo, oportunidad en la dispensación, errores de dispensación, rotura de cadena de frío, vencidos), auditarlos y mejorarlos, igual que en una planta.',
        ],
      },
    ],
    caso: {
      titulo: 'La nevera de la droguería',
      contexto: 'En una droguería, la nevera de los productos de cadena de frío registra temperaturas fuera de rango durante un fin de semana. El lunes, el auxiliar reinicia la nevera y sigue dispensando insulinas.',
      pregunta: '¿Qué proceso falló y qué debió ocurrir?',
      opciones: [
        { texto: 'Ningún proceso: la nevera ya volvió a funcionar.', correcta: false, retro: 'La excursión de temperatura pudo afectar la calidad; seguir dispensando sin evaluar expone al paciente.' },
        { texto: 'Falló el proceso de almacenamiento: debió aislarse el producto, documentar la excursión, evaluarla con el director técnico y el fabricante, y decidir antes de dispensar.', correcta: true, retro: 'Conservar la calidad es un principio del servicio farmacéutico; una excursión se trata como una no conformidad con su investigación.' },
        { texto: 'Falló el proceso de selección.', correcta: false, retro: 'La selección define qué medicamentos tener; el problema está en el almacenamiento y la respuesta a la desviación.' },
      ],
    },
    errores: [
      { error: 'Citar solo el Decreto 2200 de 2005 como norma vigente.', correccion: 'Cita el Decreto 780 de 2016, que compila sus disposiciones, y usa el 2200 para entender la estructura.' },
      { error: 'Procesos del servicio sin indicadores.', correccion: 'Define al menos un indicador por proceso crítico y revísalo periódicamente.' },
      { error: 'Tratar las excursiones de temperatura como un problema técnico de la nevera.', correccion: 'Gestiónalas como no conformidades con evaluación del producto, decisión documentada y acción correctiva.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre servicio dependiente e independiente?', respuesta: 'El dependiente hace parte de una institución prestadora de servicios de salud; el independiente se presta en establecimientos farmacéuticos.' },
      { pregunta: 'Nombra cuatro procesos generales del servicio farmacéutico.', respuesta: 'Selección, adquisición, recepción y almacenamiento, distribución y dispensación.' },
    ],
    resumen: [
      'El servicio farmacéutico se rige por el **Decreto 780 de 2016**, que compila el **Decreto 2200 de 2005**.',
      'Tiene **procesos generales** y **procesos especiales** según su tipo y complejidad.',
      'Es, en esencia, un **sistema de calidad**: procesos, responsables, registros e indicadores.',
    ],
    referencias: [R.dec780, R.dec2200, R.res1403],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Recorrido ilustrado del medicamento dentro de un servicio farmacéutico: selección, adquisición, recepción, almacenamiento, distribución y dispensación.', alt: 'Procesos generales del servicio farmacéutico en Colombia' },
    ],
    keywords: ['decreto 2200 de 2005', 'decreto 780 de 2016 servicio farmacéutico', 'servicio farmacéutico colombia', 'procesos del servicio farmacéutico', 'servicio farmacéutico dependiente e independiente', 'procesos especiales servicio farmacéutico'],
  },
  {
    titulo: 'Resolución 1403 de 2007: sistema de gestión de calidad del servicio farmacéutico',
    duracion: 25,
    gancho: {
      titulo: 'Del procedimiento al modelo de gestión',
      texto: 'Dos droguerías tienen los mismos procedimientos escritos. En la primera, nadie mide los errores de dispensación y los vencidos se descubren al hacer inventario. En la segunda, cada mes se revisan indicadores, se analizan las causas de los errores y se ajusta el procedimiento. Ambas «cumplen» en papel, pero solo la segunda tiene un sistema de gestión. La Resolución 1403 de 2007 pide lo segundo.',
    },
    objetivos: [
      'Describir los dos componentes de la Resolución 1403 de 2007: el modelo de gestión y el manual de condiciones esenciales y procedimientos.',
      'Identificar los elementos de un sistema de gestión de calidad del servicio farmacéutico.',
      'Diseñar indicadores básicos para los procesos del servicio.',
    ],
    conceptos: [
      { icono: 'Network', termino: 'Modelo de gestión del servicio farmacéutico', definicion: 'El marco que orienta al servicio hacia la calidad, el uso adecuado de los medicamentos y la mejora continua, con procesos planificados, ejecutados, verificados y mejorados.' },
      { icono: 'ClipboardCheck', termino: 'Condiciones esenciales', definicion: 'Los requisitos mínimos de infraestructura, dotación, talento humano y procesos que debe cumplir el servicio farmacéutico para funcionar.' },
      { icono: 'FileText', termino: 'Procedimientos documentados', definicion: 'La descripción escrita de cómo se ejecuta cada proceso del servicio, con responsables, registros y controles.' },
      { icono: 'BarChart3', termino: 'Indicadores de gestión', definicion: 'Medidas periódicas del desempeño de los procesos que permiten decidir con datos y demostrar mejora.' },
    ],
    proceso: {
      titulo: 'Montar el SGC del servicio farmacéutico',
      intro: 'Un camino práctico, alineado con el ciclo PHVA.',
      pasos: [
        { titulo: 'Diagnosticar', detalle: 'Comparar el servicio con el manual de condiciones esenciales y procedimientos de la resolución.', icono: 'Search', evidencia: 'Diagnóstico con brechas priorizadas.' },
        { titulo: 'Definir política y objetivos', detalle: 'La dirección define la política de calidad del servicio y objetivos medibles.', icono: 'Flag', evidencia: 'Política y objetivos aprobados.' },
        { titulo: 'Documentar procesos', detalle: 'Escribir o ajustar procedimientos de cada proceso general y especial.', icono: 'FileText', evidencia: 'Procedimientos controlados.' },
        { titulo: 'Medir', detalle: 'Definir indicadores con fórmula, meta y frecuencia para los procesos críticos.', icono: 'BarChart3', evidencia: 'Tablero de indicadores.' },
        { titulo: 'Verificar', detalle: 'Auditorías internas, seguimiento de no conformidades y revisión por la dirección.', icono: 'ClipboardCheck', evidencia: 'Informes de auditoría y actas de revisión.' },
        { titulo: 'Mejorar', detalle: 'Acciones correctivas y de mejora con verificación de eficacia.', icono: 'RefreshCw', evidencia: 'Planes de mejora cerrados.' },
      ],
    },
    secciones: [
      {
        titulo: 'Qué adopta la resolución',
        parrafos: [
          'La **Resolución 1403 de 2007** del entonces Ministerio de la Protección Social adoptó el **Modelo de Gestión del Servicio Farmacéutico** y el **Manual de Condiciones Esenciales y Procedimientos**. El modelo plantea que el servicio debe gestionarse con un enfoque de calidad orientado al paciente y al uso adecuado de los medicamentos; el manual baja ese enfoque a requisitos concretos de infraestructura, dotación, talento humano y procedimientos para cada proceso.',
          'La resolución exige que el servicio farmacéutico cuente con un **sistema de gestión de la calidad**: procesos documentados, responsables definidos, registros, seguimiento con indicadores y acciones de mejora. Es la base de lo que la secretaría de salud verifica en sus visitas, junto con las disposiciones del Decreto 780 de 2016.',
        ],
      },
      {
        titulo: 'Los procedimientos que no pueden faltar',
        parrafos: [
          'El manual describe, para cada proceso, cómo debe hacerse: la **selección** con base en criterios técnicos; la **adquisición** a proveedores autorizados; la **recepción técnica** verificando documentos, cantidades, fecha de vencimiento, lote, registro sanitario y estado del producto; el **almacenamiento** con control de temperatura y humedad, rotación por fecha de vencimiento y separación de productos no conformes; la **distribución**; la **dispensación** con verificación de la prescripción e información al paciente; y la gestión de **devoluciones** y medicamentos vencidos o deteriorados.',
          'Cada procedimiento debe generar **registros**: actas de recepción, planillas de temperatura y humedad, registros de dispensación, reportes de eventos adversos. Sin registros no hay forma de demostrar que el proceso se cumple ni de medirlo.',
        ],
      },
      {
        titulo: 'Medir para mejorar',
        parrafos: [
          'Un SGC del servicio farmacéutico necesita pocos indicadores bien elegidos. Algunos ejemplos: porcentaje de **errores de dispensación** detectados; **oportunidad** en la entrega de medicamentos; **pendientes** por falta de inventario; **vencidos** como porcentaje del inventario; **excursiones de temperatura** de cadena de frío; reportes de **farmacovigilancia** gestionados. Cada indicador debe tener fórmula, meta, frecuencia, fuente de datos y responsable.',
          'Los indicadores se revisan con la dirección, que decide acciones. Ese ciclo de medir, analizar, decidir y verificar es lo que convierte los procedimientos en un sistema y lo que diferencia a la droguería que gestiona de la que solo cumple en papel.',
        ],
      },
    ],
    caso: {
      titulo: 'Los vencidos que nadie veía',
      contexto: 'En el inventario semestral de un servicio farmacéutico hospitalario aparecen medicamentos vencidos por un valor importante. El procedimiento de almacenamiento dice que se debe rotar por fecha de vencimiento.',
      pregunta: '¿Qué acción refleja mejor el enfoque de la Resolución 1403?',
      opciones: [
        { texto: 'Recordar al personal el procedimiento.', correcta: false, retro: 'Recordar no corrige la causa ni permite detectar el problema a tiempo.' },
        { texto: 'Crear un indicador mensual de productos próximos a vencer y vencidos, investigar la causa (rotación, compras, consumo) y definir acciones con seguimiento.', correcta: true, retro: 'Medir y analizar convierte el procedimiento en un proceso gestionado y permite actuar antes de perder el producto.' },
        { texto: 'Esperar al próximo inventario para ver si mejora.', correcta: false, retro: 'Un control semestral es demasiado tardío para un riesgo que se puede medir cada mes.' },
      ],
    },
    errores: [
      { error: 'Procedimientos copiados de otra institución.', correccion: 'Ajusta cada procedimiento a tu servicio real: tu infraestructura, tu personal y tus riesgos.' },
      { error: 'Indicadores que se calculan pero nadie revisa.', correccion: 'Define quién los revisa, con qué frecuencia y qué decisión se toma si no se cumple la meta.' },
      { error: 'Recepción técnica limitada a contar cajas.', correccion: 'Verifica documentos, registro sanitario, lote, vencimiento, condiciones de transporte y estado del producto.' },
    ],
    comprueba: [
      { pregunta: '¿Qué dos componentes adopta la Resolución 1403 de 2007?', respuesta: 'El Modelo de Gestión del Servicio Farmacéutico y el Manual de Condiciones Esenciales y Procedimientos.' },
      { pregunta: 'Da tres indicadores útiles para un servicio farmacéutico.', respuesta: 'Por ejemplo: errores de dispensación, oportunidad en la entrega, vencidos, pendientes o excursiones de temperatura.' },
    ],
    resumen: [
      'La Resolución 1403 de 2007 adopta un **modelo de gestión** y un **manual de condiciones esenciales y procedimientos**.',
      'Exige **procesos documentados, registros, indicadores y mejora**: un SGC del servicio.',
      'Pocos **indicadores bien elegidos**, revisados por la dirección, convierten el papel en sistema.',
    ],
    referencias: [R.res1403, R.dec780, R.dec2200, R.iso9001],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Tablero ilustrado de indicadores de un servicio farmacéutico con semáforos (dispensación, vencidos, temperatura, pendientes).', alt: 'Indicadores del sistema de gestión de calidad del servicio farmacéutico' },
    ],
    keywords: ['resolución 1403 de 2007', 'resolución 1403 de 2007 resumen', 'manual de condiciones esenciales servicio farmacéutico', 'modelo de gestión del servicio farmacéutico', 'indicadores servicio farmacéutico', 'sistema de gestión de calidad droguería'],
  },
];

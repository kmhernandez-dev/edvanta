/** Curso de BPM · Unidad 5. Contratos, autoinspección y certificación INVIMA */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: del cumplimiento interno a la certificación',
    duracion: 15,
    gancho: {
      titulo: 'Cumplir no es lo mismo que demostrar',
      texto: 'Una planta puede hacer bien las cosas y aun así fallar una visita de certificación porque no lo puede demostrar: contratos sin acuerdo técnico, autoinspecciones que nadie siguió, hallazgos sin cerrar. Esta unidad trata del paso del cumplimiento diario a la evidencia que resiste una inspección del INVIMA.',
    },
    objetivos: [
      'Relacionar la fabricación por contrato, la autoinspección y la certificación.',
      'Reconocer cómo cada uno aporta evidencia del cumplimiento.',
      'Ubicar los temas de la unidad dentro del ciclo de mejora del sistema de calidad.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Actividades por contrato', definicion: 'Fabricación, análisis u otras actividades que una empresa encarga a otra. La responsabilidad por la calidad sigue en quien contrata.' },
      { icono: 'ClipboardCheck', termino: 'Autoinspección', definicion: 'Evaluación periódica e independiente del cumplimiento de las BPM dentro de la propia empresa, con seguimiento hasta cerrar los hallazgos.' },
      { icono: 'Award', termino: 'Certificación', definicion: 'Proceso por el que el INVIMA verifica el cumplimiento de las BPM y expide el certificado para áreas y formas farmacéuticas.' },
      { icono: 'RefreshCw', termino: 'Mejora continua', definicion: 'Ciclo en el que los hallazgos de autoinspecciones, inspecciones y desviaciones alimentan acciones que fortalecen el sistema.' },
    ],
    mapa: {
      centro: 'De cumplir a demostrar',
      ramas: [
        { titulo: 'Contratos', icono: 'Users', nodos: ['Evaluar al contratista', 'Acuerdo técnico de calidad', 'Auditar'] },
        { titulo: 'Autoinspección', icono: 'ClipboardCheck', nodos: ['Programa y equipo', 'Guías de inspección', 'Clasificación de hallazgos'] },
        { titulo: 'Certificación', icono: 'Award', nodos: ['Decreto 335 de 2022', 'Visita del INVIMA', 'Plan de mejoramiento'] },
        { titulo: 'Mejora', icono: 'RefreshCw', nodos: ['CAPA', 'Revisión por la dirección', 'Indicadores'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tres piezas de un mismo sistema',
        parrafos: [
          'La **fabricación y el análisis por contrato** extienden el sistema de calidad fuera de la planta: el contratante debe asegurar que el contratista cumpla las BPM, con un acuerdo escrito y auditorías. La **autoinspección** es la forma en que la empresa se evalúa a sí misma con los mismos criterios que usará el INVIMA. La **certificación** es la verificación externa que habilita a la planta para fabricar.',
          'Las tres piezas se conectan en el ciclo de mejora: los hallazgos de la autoinspección y de las auditorías a contratistas generan acciones correctivas y preventivas; la visita del INVIMA verifica que el sistema funcione y deja un plan de mejoramiento; y la revisión por la dirección asegura los recursos. En esta unidad recorrerás cada pieza y terminarás con la preparación de una visita de certificación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ciclo anual de demostración del cumplimiento',
      pasos: [
        { titulo: 'Planear', detalle: 'Programa autoinspecciones, auditorías a contratistas y proveedores, y revisiones.', icono: 'CalendarClock', evidencia: 'Programa anual aprobado.' },
        { titulo: 'Evaluar', detalle: 'Ejecuta autoinspecciones y auditorías con las guías de inspección.', icono: 'ClipboardCheck', evidencia: 'Informes de autoinspección y auditoría.' },
        { titulo: 'Corregir', detalle: 'Clasifica hallazgos y ejecuta acciones con responsables y fechas.', icono: 'Wrench', evidencia: 'Plan de mejoramiento.' },
        { titulo: 'Verificar', detalle: 'Comprueba la eficacia de las acciones y cierra con evidencia.', icono: 'CheckCircle2', evidencia: 'Cierres verificados.' },
        { titulo: 'Recibir la inspección', detalle: 'El INVIMA verifica el sistema en la visita de certificación o de seguimiento.', icono: 'ShieldCheck', evidencia: 'Acta de visita y concepto.' },
      ],
    },
    caso: {
      titulo: 'Una planta que «nunca ha tenido hallazgos»',
      contexto: 'El gerente de una planta dice con orgullo que sus autoinspecciones nunca encuentran hallazgos.',
      pregunta: '¿Cómo lo interpretas?',
      opciones: [
        { texto: 'Como evidencia de excelencia.', correcta: false, retro: 'Ningún sistema real es perfecto. Una autoinspección sin hallazgos suele indicar falta de independencia o de profundidad.' },
        { texto: 'Como una señal de alerta: revisaría la independencia del equipo auditor, el uso de las guías de inspección y la profundidad de la revisión.', correcta: true, retro: 'El valor de la autoinspección está en encontrar brechas antes que el INVIMA.' },
        { texto: 'Como algo irrelevante porque lo que cuenta es la visita del INVIMA.', correcta: false, retro: 'La autoinspección es un requisito de BPM y la mejor preparación para la visita.' },
      ],
    },
    errores: [
      { error: 'Ver la certificación como un evento aislado.', correccion: 'Prepárala todo el año con autoinspecciones, auditorías y mejora continua.' },
      { error: 'Pensar que tercerizar traslada la responsabilidad.', correccion: 'El contratante sigue respondiendo por la calidad del producto.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tres piezas aportan evidencia del cumplimiento en esta unidad?', respuesta: 'Los contratos con acuerdo técnico, la autoinspección y la certificación del INVIMA.' },
      { pregunta: '¿Por qué una autoinspección sin hallazgos es sospechosa?', respuesta: 'Porque suele reflejar falta de independencia o de profundidad, no un sistema perfecto.' },
    ],
    resumen: [
      'Cumplir no basta: hay que **demostrarlo** con evidencia.',
      'Contratos, autoinspección y certificación forman **un mismo ciclo**.',
      'Los hallazgos alimentan la **mejora continua**.',
    ],
    referencias: [REF.res1160, REF.dec335, REF.trs986a2, REF.ichQ10],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Ciclo circular ilustrado: planear, evaluar, corregir, verificar e inspección, con iconos en azul, turquesa y lavanda.', alt: 'Ciclo anual de demostración del cumplimiento de BPM' },
    ],
    keywords: ['certificación bpm invima', 'autoinspección bpm', 'fabricación por contrato bpm', 'preparación de visita invima', 'mejora continua bpm'],
  },

  {
    titulo: 'Requisitos BPM para la fabricación y el análisis por contrato',
    duracion: 25,
    gancho: {
      titulo: 'El titular sin planta',
      texto: 'En Colombia es frecuente que el titular de un registro sanitario no tenga planta propia y contrate a un laboratorio certificado para fabricar, y a otro para analizar. Si un lote sale mal, el paciente y el INVIMA no preguntan quién lo fabricó por contrato: preguntan al titular. Por eso las BPM dedican un capítulo completo a lo que se fabrica o se analiza por contrato.',
    },
    objetivos: [
      'Explicar las responsabilidades del contratante y del contratista según las BPM.',
      'Evaluar a un contratista antes de encargarle una actividad.',
      'Reconocer los límites de la subcontratación.',
    ],
    conceptos: [
      { icono: 'Building2', termino: 'Contratante', definicion: 'Quien encarga la actividad. Evalúa al contratista, le entrega la información necesaria, controla la actividad y sigue siendo responsable de la calidad.' },
      { icono: 'Factory', termino: 'Contratista', definicion: 'Quien ejecuta la actividad. Debe tener instalaciones, equipos, personal y certificado de BPM adecuados, y no subcontratar sin autorización escrita.' },
      { icono: 'FileText', termino: 'Contrato escrito', definicion: 'Documento que define con claridad las responsabilidades de cada parte, incluidas las técnicas en un acuerdo técnico de calidad.' },
      { icono: 'Search', termino: 'Derecho de auditoría', definicion: 'El contratante, y la autoridad, pueden auditar las instalaciones y registros del contratista.' },
    ],
    mapa: {
      centro: 'Fabricar o analizar por contrato',
      ramas: [
        { titulo: 'Contratante', icono: 'Building2', nodos: ['Evalúa y aprueba', 'Entrega información técnica', 'Responde por la calidad'] },
        { titulo: 'Contratista', icono: 'Factory', nodos: ['BPM vigentes para la actividad', 'No subcontrata sin permiso', 'Permite auditorías'] },
        { titulo: 'Documentos', icono: 'FileText', nodos: ['Contrato', 'Acuerdo técnico de calidad', 'Registros accesibles'] },
        { titulo: 'Control', icono: 'Search', nodos: ['Auditorías', 'Indicadores', 'Gestión de cambios y desviaciones'] },
      ],
    },
    secciones: [
      {
        titulo: 'Responsabilidades que no se delegan',
        parrafos: [
          'El capítulo de producción y análisis por contrato de las BPM de la OMS, recogido en los manuales de la Resolución 1160 de 2016, establece que toda actividad contratada debe estar definida, acordada y controlada por escrito para evitar malentendidos que afecten la calidad. El **contratante** sigue siendo responsable de la calidad del medicamento frente al INVIMA y frente al paciente: tercerizar una actividad no traslada esa responsabilidad.',
          'Antes de contratar, el contratante evalúa que el **contratista** tenga la capacidad técnica, las instalaciones, el personal y el **certificado de BPM vigente** para la forma farmacéutica o el análisis que se va a encargar, normalmente con una auditoría. Luego le entrega toda la información necesaria: fórmulas, especificaciones, métodos, riesgos del producto y cualquier precaución especial.',
        ],
      },
      {
        titulo: 'Subcontratación, cambios y vigilancia',
        parrafos: [
          'El contratista no puede **subcontratar** ninguna parte del trabajo sin la autorización escrita del contratante, y debe permitir **auditorías** del contratante y de la autoridad. Los cambios en el proceso, los materiales o las instalaciones que puedan afectar la calidad deben notificarse y aprobarse antes de implementarse, y las desviaciones relevantes deben comunicarse en los plazos acordados.',
          'En el registro sanitario figura el fabricante del producto, y el INVIMA verifica que ese fabricante tenga certificado de BPM vigente para el área correspondiente. Durante una inspección, puede pedir los contratos y los acuerdos técnicos. La guía de la FDA sobre acuerdos de calidad en la fabricación por contrato, aunque no es norma colombiana, es una buena referencia para estructurarlos; la verás en la clase siguiente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Seleccionar y controlar a un fabricante por contrato',
      pasos: [
        { titulo: 'Definir el alcance', detalle: 'Qué actividades se contratan: fabricación, empaque, análisis, almacenamiento.', icono: 'ClipboardList', evidencia: 'Alcance documentado.' },
        { titulo: 'Preseleccionar', detalle: 'Verifica certificado de BPM vigente para el área y la forma farmacéutica.', icono: 'ShieldCheck', evidencia: 'Copia del certificado y su alcance.' },
        { titulo: 'Auditar', detalle: 'Audita instalaciones, sistema de calidad y capacidad técnica.', icono: 'Search', evidencia: 'Informe de auditoría.' },
        { titulo: 'Contratar y acordar', detalle: 'Firma el contrato y el acuerdo técnico de calidad con la matriz de responsabilidades.', icono: 'FileText', evidencia: 'Contrato y acuerdo firmados.' },
        { titulo: 'Transferir', detalle: 'Transfiere la tecnología y la información técnica, con validaciones en el sitio del contratista.', icono: 'Truck', evidencia: 'Protocolos de transferencia y validación.' },
        { titulo: 'Vigilar', detalle: 'Revisa indicadores, desviaciones, cambios y reaudita con la frecuencia definida.', icono: 'LineChart', evidencia: 'Indicadores y auditorías periódicas.' },
      ],
    },
    caso: {
      titulo: 'El análisis que se subcontrató',
      contexto: 'Durante una auditoría, el titular descubre que su fabricante por contrato envió los ensayos microbiológicos a un tercer laboratorio, sin avisarle.',
      pregunta: '¿Qué significa?',
      opciones: [
        { texto: 'No importa si el tercer laboratorio es competente.', correcta: false, retro: 'La subcontratación sin autorización escrita viola las BPM y el contrato; el titular no evaluó a ese laboratorio.' },
        { texto: 'Es un incumplimiento: el contratista no puede subcontratar sin autorización escrita; hay que evaluar al tercero, revisar el impacto en los lotes y formalizar o suspender la práctica.', correcta: true, retro: 'El contratante debe controlar toda la cadena; una subcontratación oculta rompe ese control.' },
        { texto: 'Es responsabilidad exclusiva del fabricante.', correcta: false, retro: 'La responsabilidad por la calidad sigue siendo del titular contratante.' },
      ],
    },
    errores: [
      { error: 'Contratar solo con base en el precio.', correccion: 'Evalúa y audita la capacidad técnica y el certificado de BPM.' },
      { error: 'Contratos comerciales sin acuerdo técnico.', correccion: 'Formaliza un acuerdo técnico de calidad con responsabilidades claras.' },
      { error: 'No verificar el alcance del certificado del contratista.', correccion: 'Confirma que ampare la forma farmacéutica y el área que vas a usar.' },
    ],
    comprueba: [
      { pregunta: '¿Quién responde por la calidad cuando se fabrica por contrato?', respuesta: 'El contratante, que no traslada su responsabilidad al contratista.' },
      { pregunta: '¿Puede el contratista subcontratar?', respuesta: 'Solo con autorización escrita del contratante.' },
    ],
    resumen: [
      'El **contratante responde** por la calidad aunque terceriza.',
      'El contratista necesita **BPM vigentes** para la actividad y permite auditorías.',
      'Nada se subcontrata **sin autorización escrita**.',
    ],
    referencias: [REF.trs986a2, REF.res1160, REF.fdaAcuerdos],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Dos edificios ilustrados unidos por un documento con sello: contratante y contratista, con una lupa de auditoría.', alt: 'Relación entre contratante y contratista en la fabricación por contrato' },
    ],
    keywords: ['fabricación por contrato bpm', 'maquila farmacéutica colombia', 'análisis por contrato', 'responsabilidades contratante contratista bpm', 'subcontratación bpm', 'auditoría a fabricantes por contrato'],
  },

  {
    titulo: 'Acuerdo técnico de calidad',
    duracion: 25,
    gancho: {
      titulo: '¿Quién libera el lote?',
      texto: 'Un titular de registro de ibuprofeno en suspensión contrata a un laboratorio certificado en Bogotá para fabricar y a un laboratorio externo para algunos ensayos microbiológicos. Llega el primer lote y surge la pregunta: ¿quién lo libera al mercado, y con base en qué certificados? Si la respuesta no está escrita y firmada antes, cada parte asumirá que lo hace la otra. Para eso existe el acuerdo técnico de calidad.',
    },
    objetivos: [
      'Identificar los elementos mínimos de un acuerdo técnico de calidad.',
      'Construir una matriz de responsabilidades entre contratante y contratista.',
      'Definir los flujos de cambios, desviaciones y quejas entre las partes.',
    ],
    conceptos: [
      { icono: 'FileCheck', termino: 'Acuerdo técnico de calidad', definicion: 'Documento firmado por las áreas de calidad de ambas partes que define quién hace qué en materia de calidad. Complementa el contrato comercial.' },
      { icono: 'ClipboardList', termino: 'Matriz de responsabilidades', definicion: 'Tabla que asigna cada actividad (compra de materiales, fabricación, análisis, liberación, retenciones, quejas) a una de las partes.' },
      { icono: 'GitBranch', termino: 'Gestión de cambios entre partes', definicion: 'Regla de que ningún cambio con impacto en la calidad se implementa sin evaluación y aprobación del contratante.' },
      { icono: 'Timer', termino: 'Plazos de notificación', definicion: 'Tiempos acordados para comunicar desviaciones críticas, resultados fuera de especificación o retiros.' },
    ],
    mapa: {
      centro: 'Qué contiene un acuerdo técnico',
      ramas: [
        { titulo: 'Alcance', icono: 'Target', nodos: ['Partes y productos', 'Actividades contratadas', 'Documentos maestros'] },
        { titulo: 'Responsabilidades', icono: 'ClipboardList', nodos: ['Materiales', 'Fabricación y análisis', 'Liberación y retenciones'] },
        { titulo: 'Comunicación', icono: 'Users', nodos: ['Cambios', 'Desviaciones y fuera de especificación', 'Quejas, retiros y farmacovigilancia'] },
        { titulo: 'Control', icono: 'Search', nodos: ['Registros y acceso', 'Auditorías', 'Firmas de calidad'] },
      ],
    },
    secciones: [
      {
        titulo: 'Los elementos mínimos',
        parrafos: [
          'Un acuerdo técnico de calidad normalmente incluye: las partes, el alcance y los productos; una **matriz de responsabilidades** (quién compra y aprueba materiales, quién fabrica, quién analiza, quién libera el lote, quién guarda las muestras de retención); los documentos maestros y el manejo de cambios; las desviaciones y los resultados fuera de especificación y su notificación; las quejas, los retiros del mercado y la farmacovigilancia; la conservación de registros y el acceso a ellos; el derecho de auditoría; la transferencia de tecnología y las validaciones; y las firmas de las personas responsables de calidad de ambas partes.',
          'La guía de la FDA sobre acuerdos de calidad en la fabricación por contrato es útil para estructurarlo, y los manuales de BPM de la Resolución 1160 de 2016 dan el fundamento: las responsabilidades deben estar escritas y nada que afecte la calidad puede quedar en un acuerdo verbal.',
        ],
      },
      {
        titulo: 'El caso del ibuprofeno resuelto',
        parrafos: [
          'En el ejemplo, el acuerdo define que el **fabricante** hace los controles en proceso y el análisis fisicoquímico; que el **laboratorio externo** hace el recuento microbiano; y que la **dirección técnica del titular** libera el lote al mercado con base en ambos certificados y en la revisión del registro de lote. También establece que el fabricante debe notificar cualquier desviación crítica dentro de las 24 horas y que ningún cambio de proveedor de materias primas se implementa sin aprobación del titular.',
          'Un buen acuerdo se revisa periódicamente y cada vez que cambia algo importante: un producto nuevo, un sitio nuevo o una reorganización. Y se usa: cuando aparece una desviación, la primera pregunta es qué dice el acuerdo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Construir la matriz de responsabilidades',
      pasos: [
        { titulo: 'Listar actividades', detalle: 'Enumera cada actividad de calidad: compras, muestreo, análisis, fabricación, empaque, liberación, almacenamiento, distribución.', icono: 'ClipboardList', evidencia: 'Lista de actividades.' },
        { titulo: 'Asignar responsables', detalle: 'Para cada actividad, indica quién la ejecuta y quién la aprueba.', icono: 'Users', evidencia: 'Matriz con responsables.' },
        { titulo: 'Definir comunicaciones', detalle: 'Qué se notifica, a quién, en qué plazo y con qué formato.', icono: 'Timer', evidencia: 'Flujos de comunicación.' },
        { titulo: 'Revisar vacíos', detalle: 'Verifica que ninguna actividad quede sin responsable ni con dos responsables.', icono: 'Search', evidencia: 'Revisión cruzada de calidad.' },
        { titulo: 'Firmar', detalle: 'Las personas responsables de calidad de ambas partes firman y fechan.', icono: 'Signature', evidencia: 'Acuerdo firmado.' },
        { titulo: 'Revisar periódicamente', detalle: 'Actualiza el acuerdo ante cambios o en la revisión definida.', icono: 'RefreshCw', evidencia: 'Historial de versiones.' },
      ],
    },
    caso: {
      titulo: 'Un cambio de proveedor de envases',
      contexto: 'El fabricante por contrato cambia el proveedor de frascos de un jarabe porque el anterior subió precios. No avisa al titular porque «el frasco nuevo cumple la misma especificación».',
      pregunta: '¿Qué indica un buen acuerdo técnico?',
      opciones: [
        { texto: 'Que no era necesario avisar si cumple la especificación.', correcta: false, retro: 'Un cambio de material de envase primario puede afectar la estabilidad y requiere evaluación y aprobación del titular.' },
        { texto: 'Que ningún cambio con impacto potencial en la calidad se implementa sin evaluación y aprobación del contratante; hay que gestionar el cambio y evaluar los lotes ya fabricados.', correcta: true, retro: 'El acuerdo debe prever la gestión de cambios entre las partes, y el envase primario es un cambio relevante.' },
        { texto: 'Que el fabricante decide sobre sus proveedores.', correcta: false, retro: 'En materiales que afectan la calidad del producto del titular, la decisión es compartida y documentada.' },
      ],
    },
    errores: [
      { error: 'Acuerdos genéricos que no dicen quién libera.', correccion: 'La matriz de responsabilidades debe nombrar quién libera y con qué evidencia.' },
      { error: 'Firmar el acuerdo solo por las áreas comerciales.', correccion: 'Lo firman los responsables de calidad de ambas partes.' },
      { error: 'No prever plazos de notificación.', correccion: 'Define plazos para desviaciones críticas, resultados fuera de especificación y retiros.' },
    ],
    comprueba: [
      { pregunta: '¿Quién firma el acuerdo técnico de calidad?', respuesta: 'Los responsables de calidad de ambas partes.' },
      { pregunta: 'Menciona cuatro actividades de la matriz de responsabilidades.', respuesta: 'Compra y aprobación de materiales, fabricación, análisis y liberación del lote (también muestras de retención y quejas).' },
    ],
    resumen: [
      'El acuerdo técnico define **quién hace qué** en calidad.',
      'Su corazón es la **matriz de responsabilidades**, incluida la liberación.',
      'Prevé **cambios, desviaciones, quejas y plazos** de notificación.',
    ],
    referencias: [REF.fdaAcuerdos, REF.res1160, REF.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de elementos', descripcion: 'Tabla ilustrada de matriz de responsabilidades con columnas «titular», «fabricante» y «laboratorio externo» y marcas de verificación en colores de marca.', alt: 'Matriz de responsabilidades de un acuerdo técnico de calidad' },
    ],
    keywords: ['acuerdo técnico de calidad', 'quality agreement farmacéutico', 'matriz de responsabilidades fabricación por contrato', 'contrato de fabricación de medicamentos', 'acuerdo de calidad maquila', 'liberación de lotes por contrato'],
  },

  {
    titulo: 'Programa de autoinspección con las guías de inspección',
    duracion: 25,
    gancho: {
      titulo: 'Encontrarlo antes que el inspector',
      texto: 'En una autoinspección, una auditora interna revisa el área de pesaje con la guía de inspección del INVIMA en la mano y encuentra que la balanza de activos no tiene verificaciones diarias desde hace dos semanas. Lo corrigen, evalúan los lotes y documentan todo. Tres meses después llega la visita del INVIMA: el inspector revisa la misma balanza y encuentra un registro impecable y una desviación bien cerrada. Eso es una autoinspección que funciona.',
    },
    objetivos: [
      'Diseñar un programa de autoinspección conforme a las BPM.',
      'Usar las guías de inspección de la Resolución 1160 de 2016 como lista de verificación.',
      'Asegurar la independencia y el seguimiento de la autoinspección.',
    ],
    conceptos: [
      { icono: 'CalendarClock', termino: 'Programa', definicion: 'Plan que define la frecuencia, el alcance y los responsables de las autoinspecciones para cubrir todas las áreas y capítulos de las BPM.' },
      { icono: 'UserCheck', termino: 'Independencia', definicion: 'Los auditores no evalúan su propia área, para garantizar una mirada objetiva.' },
      { icono: 'ClipboardCheck', termino: 'Guía de inspección', definicion: 'La misma lista de verificación que usa el INVIMA, adoptada como herramienta interna.' },
      { icono: 'FileCheck', termino: 'Informe y seguimiento', definicion: 'Cada autoinspección produce un informe con hallazgos, acciones, responsables y fechas, y se hace seguimiento hasta el cierre.' },
    ],
    mapa: {
      centro: 'Autoinspección que funciona',
      ramas: [
        { titulo: 'Planear', icono: 'CalendarClock', nodos: ['Todas las áreas y capítulos', 'Frecuencia por riesgo', 'Equipo competente'] },
        { titulo: 'Ejecutar', icono: 'ClipboardCheck', nodos: ['Guías de inspección', 'Recorrido y entrevistas', 'Evidencia objetiva'] },
        { titulo: 'Reportar', icono: 'FileText', nodos: ['Hallazgos clasificados', 'Informe a la dirección', 'Plan de acción'] },
        { titulo: 'Cerrar', icono: 'CheckCircle2', nodos: ['Seguimiento', 'Verificación de eficacia', 'Tendencias de hallazgos'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué exige y cómo se organiza',
        parrafos: [
          'Los manuales de BPM de la Resolución 1160 de 2016 piden un programa de **autoinspección periódico**, con personal competente e independiente del área evaluada, una lista de verificación y informes con hallazgos y acciones correctivas que se sigan hasta cerrarlas. El objetivo es detectar deficiencias en la aplicación de las BPM y proponer las medidas necesarias.',
          'Un programa sólido cubre **todas las áreas y todos los capítulos** de las BPM a lo largo del año: personal, instalaciones, equipos, sistemas de agua y aire, materiales, documentación, producción, control de calidad, contratos, quejas, retiros y la propia autoinspección. La frecuencia por área se define con criterio de riesgo: más frecuente donde el impacto en el producto es mayor o donde hubo hallazgos.',
        ],
      },
      {
        titulo: 'La guía de inspección como herramienta interna',
        parrafos: [
          'Las guías de inspección de la Resolución 1160 de 2016 son la mejor lista de verificación porque son las mismas que usará el INVIMA. Cada pregunta se responde con **evidencia objetiva**: un documento, un registro, una entrevista o una observación directa. Los auditores recorren la planta, piden ejecuciones en vivo (por ejemplo, un despeje de línea) y cruzan registros.',
          'El informe clasifica los hallazgos por riesgo (lo verás en la siguiente clase), se presenta a la dirección y genera un plan de acción. La autoinspección se cierra cuando las acciones se verifican como **eficaces**, no cuando se firman. Las tendencias de hallazgos de un año a otro muestran si el sistema mejora o si los mismos problemas regresan.',
        ],
      },
    ],
    proceso: {
      titulo: 'Una autoinspección de principio a fin',
      pasos: [
        { titulo: 'Planear el alcance', detalle: 'Define áreas, capítulos de la guía, auditores independientes y fechas.', icono: 'CalendarClock', evidencia: 'Plan de autoinspección.' },
        { titulo: 'Preparar', detalle: 'Revisa hallazgos anteriores, desviaciones y quejas del área para enfocar la revisión.', icono: 'FileSearch', evidencia: 'Lista de puntos de enfoque.' },
        { titulo: 'Ejecutar en sitio', detalle: 'Recorre, entrevista, observa ejecuciones y revisa registros con la guía.', icono: 'ClipboardCheck', evidencia: 'Guía diligenciada con evidencias.' },
        { titulo: 'Reunión de cierre', detalle: 'Presenta los hallazgos al área para validar los hechos.', icono: 'Users', evidencia: 'Acta de cierre.' },
        { titulo: 'Informar y planear acciones', detalle: 'Emite el informe con hallazgos clasificados y acuerda acciones, responsables y fechas.', icono: 'FileText', evidencia: 'Informe y plan de acción.' },
        { titulo: 'Verificar eficacia', detalle: 'Comprueba en sitio que las acciones resolvieron el problema y cierra.', icono: 'CheckCircle2', evidencia: 'Cierre verificado.' },
      ],
    },
    caso: {
      titulo: 'El jefe que audita su propia área',
      contexto: 'Por falta de personal, el jefe de producción propone autoinspeccionar él mismo el área de producción este año.',
      pregunta: '¿Qué solución preserva el valor de la autoinspección?',
      opciones: [
        { texto: 'Aceptar, porque es quien mejor conoce el área.', correcta: false, retro: 'Conocer el área no reemplaza la independencia; es difícil ver los problemas propios.' },
        { texto: 'Asignar auditores de otras áreas entrenados, o un auditor externo, y que el jefe de producción participe como auditado.', correcta: true, retro: 'La independencia es un requisito de la autoinspección; hay alternativas aunque falte personal.' },
        { texto: 'Saltar la autoinspección de producción este año.', correcta: false, retro: 'Producción es una de las áreas de mayor riesgo; omitirla deja un vacío grave.' },
      ],
    },
    errores: [
      { error: 'Autoinspecciones sin seguimiento de las acciones.', correccion: 'Sigue cada acción hasta verificar su eficacia en sitio.' },
      { error: 'Revisar solo documentos sin recorrer la planta.', correccion: 'Observa ejecuciones en vivo y cruza registros con la realidad.' },
      { error: 'Programas que dejan áreas sin revisar durante años.', correccion: 'Cubre todas las áreas y capítulos con frecuencia basada en riesgo.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué se usan las guías de inspección del INVIMA en la autoinspección?', respuesta: 'Porque son los mismos criterios que aplicará el inspector, lo que permite anticipar hallazgos.' },
      { pregunta: '¿Cuándo se cierra un hallazgo de autoinspección?', respuesta: 'Cuando se verifica que la acción fue eficaz, no solo cuando se ejecuta o se firma.' },
    ],
    resumen: [
      'La autoinspección es **periódica, independiente y completa**.',
      'Las **guías de inspección** son la mejor lista de verificación.',
      'Se cierra con **eficacia verificada**.',
    ],
    referencias: [REF.res1160, REF.res1160Compilada, REF.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de la guía', descripcion: 'Auditora ilustrada con una tableta que muestra la guía de inspección, recorriendo una sala de pesaje, con marcas de verificación turquesa.', alt: 'Autoinspección con la guía de inspección en el área de pesaje' },
    ],
    keywords: ['autoinspección bpm', 'programa de autoinspección farmacéutica', 'guía de inspección invima autoinspección', 'auditoría interna bpm', 'cómo hacer una autoinspección', 'independencia del auditor interno'],
  },

  {
    titulo: 'Clasificación de hallazgos y plan de mejoramiento',
    duracion: 25,
    gancho: {
      titulo: 'Tres hallazgos, tres pesos distintos',
      texto: 'En la autoinspección anual de un laboratorio de líquidos no estériles en Barranquilla aparecen tres hallazgos: un diferencial de presión registrado fuera de rango tres días sin investigación, un operario sin entrenamiento en el procedimiento de limpieza actualizado, y agua purificada usada como materia prima con resultados microbiológicos fuera de especificación aprobados sin investigar. No pesan lo mismo, y tratarlos igual sería un error. Clasificar es priorizar.',
    },
    objetivos: [
      'Clasificar deficiencias como críticas, mayores o menores según su riesgo.',
      'Explicar cómo la acumulación de deficiencias puede elevar su clasificación.',
      'Construir un plan de mejoramiento con causa, acción, responsable, fecha y evidencia.',
    ],
    conceptos: [
      { icono: 'XCircle', termino: 'Deficiencia crítica', definicion: 'Puede producir un medicamento que ponga en riesgo la salud del paciente, o hay evidencia de fraude o falsificación de datos.' },
      { icono: 'AlertTriangle', termino: 'Deficiencia mayor', definicion: 'No crítica, pero puede generar un producto que no cumpla su registro sanitario, o es una falla importante del sistema.' },
      { icono: 'Tag', termino: 'Deficiencia menor', definicion: 'Desviación de BPM que, por sí sola, no se espera que afecte la calidad, como un registro sin fecha aislado.' },
      { icono: 'ClipboardList', termino: 'Plan de mejoramiento', definicion: 'Respuesta a cada hallazgo con descripción, causa raíz, acción correctiva y preventiva, responsable, fecha y evidencia de cierre.' },
    ],
    mapa: {
      centro: 'De hallazgo a mejora',
      ramas: [
        { titulo: 'Crítica', icono: 'XCircle', nodos: ['Riesgo para el paciente', 'Fraude o falsificación', 'Acción inmediata'] },
        { titulo: 'Mayor', icono: 'AlertTriangle', nodos: ['Producto fuera de registro', 'Falla importante del sistema', 'Prioridad alta'] },
        { titulo: 'Menor', icono: 'Tag', nodos: ['Sin impacto esperado aislado', 'Puede escalar si se repite', 'Se corrige y vigila'] },
        { titulo: 'Plan', icono: 'ClipboardList', nodos: ['Causa raíz', 'Acción, responsable y fecha', 'Evidencia de cierre'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo se clasifica',
        parrafos: [
          'En las guías de inspección, las deficiencias se clasifican por su **riesgo**. Una deficiencia **crítica** puede producir un medicamento que ponga en riesgo la salud del paciente, o hay evidencia de fraude o falsificación de datos: por ejemplo, la ausencia de área exclusiva para betalactámicos o la falsificación de registros de lote. Una **mayor** no es crítica, pero puede generar un producto que no cumpla su registro sanitario, o es una falla importante del sistema: equipos críticos sin calificar o despejes de línea sin verificar. Una **menor** es una desviación de BPM que, por sí sola, no se espera que afecte la calidad: un registro sin fecha aislado o un rótulo de limpieza deteriorado.',
          'Varias deficiencias del mismo tipo pueden **sumarse** y elevar la clasificación: un operario sin entrenamiento es menor; la misma situación en varias áreas revela una falla del sistema de capacitación y puede ser mayor. El resultado de una inspección del INVIMA depende del número y del peso de las deficiencias, según el procedimiento vigente del Decreto 335 de 2022 y los lineamientos del instituto.',
        ],
      },
      {
        titulo: 'El caso de Barranquilla y el plan de mejoramiento',
        parrafos: [
          'En el caso inicial, el agua purificada con resultados fuera de especificación aprobados sin investigar es **crítica**: afecta directamente los productos y sugiere aprobación indebida de datos. El diferencial de presión fuera de rango sin investigación es **mayor**: riesgo de contaminación cruzada y falla del sistema de monitoreo. El operario sin entrenamiento es **menor**, salvo que se repita en varias áreas. El comité de calidad prioriza el hallazgo crítico, suspende la liberación de los lotes afectados y documenta el plan.',
          'Cada hallazgo se responde en el **plan de mejoramiento** con descripción, análisis de **causa raíz**, acción correctiva y preventiva, responsable, fecha comprometida y evidencia de cierre. La metodología de causa raíz y la verificación de eficacia se profundizan en los cursos de Desviaciones y CAPA y de Auditoría; aquí lo esencial es clasificar bien y priorizar.',
        ],
      },
    ],
    proceso: {
      titulo: 'Del hallazgo al cierre',
      pasos: [
        { titulo: 'Describir con evidencia', detalle: 'Redacta el hallazgo con el requisito incumplido y la evidencia objetiva.', icono: 'FileText', evidencia: 'Hallazgo documentado.' },
        { titulo: 'Clasificar por riesgo', detalle: 'Determina si es crítico, mayor o menor y si se suma a otros del mismo tipo.', icono: 'AlertTriangle', evidencia: 'Clasificación justificada.' },
        { titulo: 'Contener', detalle: 'Para críticos y mayores, toma acciones inmediatas sobre producto y proceso.', icono: 'Hand', evidencia: 'Acciones de contención.' },
        { titulo: 'Analizar la causa raíz', detalle: 'Busca por qué ocurrió, no solo qué ocurrió.', icono: 'Search', evidencia: 'Análisis de causa raíz.' },
        { titulo: 'Planear acciones', detalle: 'Define acción correctiva y preventiva, responsable y fecha.', icono: 'ClipboardList', evidencia: 'Plan de mejoramiento.' },
        { titulo: 'Cerrar con eficacia', detalle: 'Verifica que el problema no se repite y archiva la evidencia.', icono: 'CheckCircle2', evidencia: 'Evidencia de cierre.' },
      ],
    },
    caso: {
      titulo: 'Los registros completados por otra persona',
      contexto: 'En una autoinspección se descubre que una analista firmaba resultados de ensayos que había ejecutado una compañera ausente, «para no retrasar la liberación».',
      pregunta: '¿Cómo se clasifica?',
      opciones: [
        { texto: 'Menor, porque los ensayos sí se hicieron.', correcta: false, retro: 'Firmar lo que otra persona ejecutó es una falsificación de la atribución del dato.' },
        { texto: 'Crítica: es una falla de integridad de datos que compromete la confiabilidad de los resultados; se contiene, se investiga el alcance y se corrige la cultura y el sistema.', correcta: true, retro: 'La falsificación de registros es un ejemplo clásico de deficiencia crítica, aunque el resultado analítico fuera correcto.' },
        { texto: 'Mayor, porque no afectó el producto.', correcta: false, retro: 'No se puede afirmar que no afectó: los datos dejaron de ser confiables y hay evidencia de falsificación.' },
      ],
    },
    errores: [
      { error: 'Clasificar todo como menor para no alarmar.', correccion: 'Clasifica por riesgo real; subestimar priva al sistema de recursos para corregir.' },
      { error: 'Planes sin causa raíz.', correccion: 'Sin causa raíz, la acción trata el síntoma y el hallazgo regresa.' },
      { error: 'No sumar hallazgos repetidos.', correccion: 'Evalúa si varios hallazgos menores revelan una falla del sistema.' },
    ],
    comprueba: [
      { pregunta: 'Da un ejemplo de deficiencia crítica.', respuesta: 'Falsificación de registros de lote o ausencia de área exclusiva para betalactámicos.' },
      { pregunta: '¿Cuándo un hallazgo menor puede volverse mayor?', respuesta: 'Cuando se repite en varias áreas y revela una falla del sistema.' },
      { pregunta: '¿Qué elementos tiene cada línea del plan de mejoramiento?', respuesta: 'Descripción, causa raíz, acción correctiva y preventiva, responsable, fecha y evidencia de cierre.' },
    ],
    resumen: [
      'Las deficiencias se clasifican en **críticas, mayores y menores** por su riesgo.',
      'Los hallazgos repetidos **pueden escalar**.',
      'El plan de mejoramiento ataca la **causa raíz** y se cierra con evidencia.',
    ],
    referencias: [REF.res1160, REF.dec335, REF.fdaIntegridad, REF.ichQ9],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Semáforo ilustrado con tres niveles (crítica, mayor, menor) y ejemplos cortos al lado de cada luz, en tonos de la paleta.', alt: 'Clasificación de deficiencias críticas, mayores y menores' },
    ],
    keywords: ['clasificación de hallazgos bpm', 'deficiencia crítica mayor menor invima', 'plan de mejoramiento bpm', 'hallazgos de auditoría farmacéutica', 'causa raíz plan de mejoramiento', 'clasificación de no conformidades bpm'],
  },

  {
    titulo: 'Procedimiento de certificación: Decreto 335 de 2022',
    duracion: 25,
    gancho: {
      titulo: 'Un trámite que empieza mucho antes de radicarlo',
      texto: 'Una planta radica su solicitud de certificación con la idea de «empezar a prepararse cuando programen la visita». Cuando llega la fecha, faltan calificaciones, el plano no coincide con la obra y el plan maestro de validación está desactualizado. La certificación es un trámite administrativo, pero su resultado se decide en los meses previos. Conocer el procedimiento ayuda a planear ese trabajo.',
    },
    objetivos: [
      'Describir las etapas generales del procedimiento de certificación ante el INVIMA.',
      'Identificar la información y los documentos que conviene tener listos antes de solicitar.',
      'Reconocer los posibles conceptos de una visita y sus consecuencias.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'Decreto 335 de 2022', definicion: 'Norma que regula el procedimiento para obtener los certificados de cumplimiento de buenas prácticas ante el INVIMA. Sus plazos, requisitos y vigencias se consultan en el texto vigente.' },
      { icono: 'FileText', termino: 'Solicitud', definicion: 'La radicación ante el INVIMA con la información de la planta, las áreas y las formas farmacéuticas a certificar, según los requisitos del procedimiento.' },
      { icono: 'ShieldCheck', termino: 'Visita', definicion: 'La inspección con la guía correspondiente, que termina con un acta y un concepto.' },
      { icono: 'Award', termino: 'Concepto y certificado', definicion: 'El resultado de la visita (favorable, con requerimientos o no favorable) y, si corresponde, el certificado para las áreas evaluadas.' },
    ],
    mapa: {
      centro: 'Certificación de BPM ante el INVIMA',
      ramas: [
        { titulo: 'Antes', icono: 'ClipboardCheck', nodos: ['Autoinspección con la guía', 'Documentos listos', 'Calificaciones y validaciones al día'] },
        { titulo: 'Solicitud', icono: 'FileText', nodos: ['Radicación según el decreto', 'Áreas y formas a certificar', 'Pago y requisitos'] },
        { titulo: 'Visita', icono: 'ShieldCheck', nodos: ['Inspección con la guía', 'Acta', 'Concepto'] },
        { titulo: 'Después', icono: 'Award', nodos: ['Certificado', 'Plan de mejoramiento', 'Mantenimiento y renovación'] },
      ],
    },
    secciones: [
      {
        titulo: 'El procedimiento en términos generales',
        parrafos: [
          'El Decreto 549 de 2001 creó la certificación de BPM para los laboratorios fabricantes de medicamentos, y el **Decreto 335 de 2022** actualizó el procedimiento para obtener los certificados de cumplimiento de buenas prácticas ante el INVIMA. En términos generales, el interesado **solicita** la certificación con la información de la planta y de las áreas y formas farmacéuticas a certificar; el INVIMA **programa y realiza la visita** con la guía de inspección correspondiente; la visita termina con un **acta** y un **concepto**; y, si el concepto lo permite, se expide el **certificado** para lo evaluado.',
          'Los plazos, los requisitos documentales, la vigencia de los certificados y las condiciones de renovación están en el texto del decreto y en los lineamientos del INVIMA. Como cambian con el tiempo, **verifica siempre la versión vigente** antes de planear una solicitud o una renovación.',
        ],
      },
      {
        titulo: 'Qué tener listo antes de solicitar',
        parrafos: [
          'Más allá de los requisitos del formulario, conviene llegar con el sistema de calidad funcionando y demostrable: un **plano actualizado** con flujos, áreas y clasificación; el **plan maestro de validación** al día, con equipos y sistemas calificados y procesos, limpiezas y métodos validados; procedimientos aprobados y entrenados; registros de lote completos; programas de monitoreo con tendencias; una **autoinspección reciente** con la guía de inspección y su plan de mejoramiento en ejecución; y contratos y acuerdos técnicos firmados si hay actividades tercerizadas.',
          'Los posibles conceptos dependen del número y del peso de las deficiencias. Un concepto con requerimientos implica un **plan de mejoramiento** con plazos y su seguimiento; uno no favorable impide obtener el certificado hasta corregir. Recuerda que el certificado ampara áreas y formas farmacéuticas concretas: una ampliación o una forma nueva requieren su propia evaluación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ruta hacia la certificación',
      pasos: [
        { titulo: 'Definir el alcance', detalle: 'Determina qué áreas y formas farmacéuticas vas a certificar.', icono: 'Target', evidencia: 'Alcance aprobado por la dirección.' },
        { titulo: 'Autoinspeccionar', detalle: 'Aplica la guía de inspección y cierra las brechas críticas y mayores.', icono: 'ClipboardCheck', evidencia: 'Informe y plan de mejoramiento.' },
        { titulo: 'Preparar la documentación', detalle: 'Reúne los requisitos del decreto y la evidencia del sistema de calidad.', icono: 'Files', evidencia: 'Expediente completo.' },
        { titulo: 'Radicar la solicitud', detalle: 'Presenta la solicitud ante el INVIMA según el procedimiento vigente.', icono: 'FileText', evidencia: 'Radicado.' },
        { titulo: 'Recibir la visita', detalle: 'Atiende la inspección con el equipo preparado.', icono: 'ShieldCheck', evidencia: 'Acta de visita.' },
        { titulo: 'Responder y obtener el certificado', detalle: 'Atiende los requerimientos en los plazos y obtiene el certificado si el concepto lo permite.', icono: 'Award', evidencia: 'Certificado o plan aprobado.' },
      ],
    },
    caso: {
      titulo: 'Radicar ya o esperar',
      contexto: 'La gerencia quiere radicar la solicitud de certificación de una nueva área de líquidos esta semana. La autoinspección encontró dos hallazgos críticos aún abiertos.',
      pregunta: '¿Qué recomiendas?',
      opciones: [
        { texto: 'Radicar ya: el INVIMA tarda en programar la visita y para entonces estará todo cerrado.', correcta: false, retro: 'Es una apuesta con riesgo alto: si la visita llega antes del cierre, el concepto puede ser no favorable.' },
        { texto: 'Cerrar primero los hallazgos críticos con evidencia y luego radicar, con un cronograma realista según los plazos del procedimiento vigente.', correcta: true, retro: 'La solicitud debe llegar cuando el sistema esté listo para demostrarse; los críticos abiertos comprometen el resultado.' },
        { texto: 'Radicar sin mencionar los hallazgos.', correcta: false, retro: 'Los hallazgos no desaparecen; el inspector puede encontrarlos y además se pierde confianza.' },
      ],
    },
    errores: [
      { error: 'Usar requisitos o plazos de memoria.', correccion: 'Consulta el texto vigente del Decreto 335 de 2022 y los lineamientos del INVIMA.' },
      { error: 'Radicar con hallazgos críticos abiertos.', correccion: 'Cierra lo crítico con evidencia antes de solicitar.' },
      { error: 'Suponer que el certificado cubre ampliaciones.', correccion: 'Toda área o forma nueva requiere su propia evaluación.' },
    ],
    comprueba: [
      { pregunta: '¿Qué norma regula hoy el procedimiento de certificación?', respuesta: 'El Decreto 335 de 2022.' },
      { pregunta: '¿Qué conceptos puede tener una visita?', respuesta: 'Favorable, favorable con requerimientos o no favorable.' },
      { pregunta: '¿Por qué hay que verificar el texto vigente del decreto?', respuesta: 'Porque plazos, requisitos y vigencias pueden cambiar y no deben usarse de memoria.' },
    ],
    resumen: [
      'El **Decreto 335 de 2022** regula el procedimiento de certificación.',
      'La certificación se **gana antes** de radicar: sistema listo y demostrable.',
      'Verifica siempre **plazos y requisitos vigentes**.',
    ],
    referencias: [REF.dec335, REF.dec549, REF.res1160, REF.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Camino ilustrado con seis hitos hasta un certificado con sello, en azul y turquesa.', alt: 'Ruta hacia la certificación de BPM ante el INVIMA' },
    ],
    keywords: ['decreto 335 de 2022', 'certificación bpm invima procedimiento', 'cómo obtener el certificado de bpm', 'solicitud de certificación invima', 'concepto favorable con requerimientos', 'renovación certificado bpm'],
  },

  {
    titulo: 'La visita de certificación: preparación, desarrollo y cierre',
    duracion: 25,
    gancho: {
      titulo: 'La pregunta que nadie esperaba',
      texto: 'En plena visita, el inspector pide al operario de la blistera que le explique, con sus palabras, qué hace si la conciliación de plegadizas no cuadra. El operario duda, mira a su jefe y responde algo distinto del procedimiento. Ese momento vale más que cien páginas de documentos. Una visita de certificación evalúa si el sistema funciona en las personas, no solo en los papeles.',
    },
    objetivos: [
      'Organizar la preparación de una visita de certificación.',
      'Describir el desarrollo típico de la visita: apertura, recorrido, revisión documental y cierre.',
      'Responder adecuadamente durante la visita y gestionar el resultado.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Equipo de visita', definicion: 'Coordinador, acompañantes por área, responsables de documentos y personas clave disponibles para entrevistas.' },
      { icono: 'DoorOpen', termino: 'Reunión de apertura', definicion: 'Presentación de los inspectores, el alcance y la agenda, y una breve presentación de la empresa.' },
      { icono: 'Search', termino: 'Recorrido y revisión', definicion: 'Inspección de las áreas, entrevistas al personal, observación de ejecuciones y revisión de documentos y registros.' },
      { icono: 'FileCheck', termino: 'Reunión de cierre y acta', definicion: 'Presentación de los hallazgos y firma del acta, con el concepto o los requerimientos.' },
    ],
    mapa: {
      centro: 'La visita del INVIMA',
      ramas: [
        { titulo: 'Preparar', icono: 'ClipboardCheck', nodos: ['Autoinspección reciente', 'Sala y documentos listos', 'Equipo y personal informado'] },
        { titulo: 'Abrir', icono: 'DoorOpen', nodos: ['Alcance y agenda', 'Presentación breve', 'Acompañantes asignados'] },
        { titulo: 'Inspeccionar', icono: 'Search', nodos: ['Recorrido de áreas', 'Entrevistas', 'Registros y documentos'] },
        { titulo: 'Cerrar', icono: 'FileCheck', nodos: ['Hallazgos y acta', 'Plan de mejoramiento', 'Seguimiento'] },
      ],
    },
    secciones: [
      {
        titulo: 'Preparar sin maquillar',
        parrafos: [
          'La preparación empieza con una **autoinspección reciente** con la guía de inspección y su plan de mejoramiento en ejecución. Luego se organiza la logística: una sala para los inspectores, un coordinador de la visita, acompañantes para cada área, una persona que localice documentos con rapidez y un registro de lo que se entrega. Los documentos clave deben estar ubicables: manual de calidad, organigrama, plano, plan maestro de validación, procedimientos, registros de lote, programas de monitoreo, desviaciones, CAPA, quejas, retiros y contratos.',
          'El personal debe saber que habrá visita y entender que puede responder con honestidad: «No lo sé, pero el procedimiento está aquí» es una respuesta mejor que una improvisación. Preparar no es maquillar: limpiar a fondo o completar registros atrasados la noche anterior suele ser evidente para un inspector y genera más desconfianza que el hallazgo original.',
        ],
      },
      {
        titulo: 'Durante y después de la visita',
        parrafos: [
          'La visita suele iniciar con una **reunión de apertura**, seguir con el **recorrido** de las áreas (con observación de ejecuciones, como un despeje de línea en vivo, y entrevistas) y la **revisión documental**, y terminar con una **reunión de cierre** en la que se presentan los hallazgos y se firma el acta. Durante la visita conviene responder solo lo que se pregunta, con evidencia; llevar un registro de lo solicitado y entregado; y aclarar con respeto cuando un hallazgo parte de un malentendido, aportando el documento que lo demuestra.',
          'Después, la empresa responde a los requerimientos con un **plan de mejoramiento** realista: causa, acción, responsable, fecha y evidencia. Cumplir los plazos y demostrar la eficacia de las acciones construye la confianza para las siguientes visitas. Y lo aprendido alimenta el sistema: los hallazgos del INVIMA se tratan como cualquier otro hallazgo en la gestión de CAPA.',
        ],
      },
    ],
    proceso: {
      titulo: 'Desarrollo de una visita de certificación',
      pasos: [
        { titulo: 'Preparar el equipo y la sala', detalle: 'Asigna coordinador, acompañantes y responsables de documentos; organiza la sala.', icono: 'Users', evidencia: 'Plan de atención de la visita.' },
        { titulo: 'Reunión de apertura', detalle: 'Recibe a los inspectores, confirma el alcance y la agenda y presenta brevemente la empresa.', icono: 'DoorOpen', evidencia: 'Registro de asistencia.' },
        { titulo: 'Recorrido de áreas', detalle: 'Acompaña sin interferir, permite entrevistas y ejecuciones en vivo.', icono: 'Route', evidencia: 'Notas del acompañante.' },
        { titulo: 'Revisión documental', detalle: 'Entrega lo solicitado con rapidez y registra cada documento entregado.', icono: 'Files', evidencia: 'Registro de documentos entregados.' },
        { titulo: 'Reunión de cierre', detalle: 'Escucha los hallazgos, aclara con evidencia los malentendidos y firma el acta.', icono: 'FileCheck', evidencia: 'Acta firmada.' },
        { titulo: 'Plan de mejoramiento', detalle: 'Responde en el plazo con causa, acción, responsable, fecha y evidencia.', icono: 'ClipboardList', evidencia: 'Plan radicado y seguimiento.' },
      ],
    },
    caso: {
      titulo: 'El registro que se completó anoche',
      contexto: 'Durante la revisión documental, el inspector nota que varios registros de limpieza de la última semana tienen la misma tinta y la misma letra, y que fueron completados en una sola sesión.',
      pregunta: '¿Cuál es la mejor respuesta de la empresa?',
      opciones: [
        { texto: 'Afirmar que se llenaron en su momento.', correcta: false, retro: 'Negar lo evidente agrava el problema y puede convertirlo en una deficiencia crítica de integridad.' },
        { texto: 'Reconocer el hecho, explicar que se abrió o se abrirá una investigación de integridad de datos y comprometer acciones; y en la preparación de futuras visitas no completar registros atrasados.', correcta: true, retro: 'La transparencia preserva la confianza; la investigación demuestra que el sistema reacciona.' },
        { texto: 'Retirar esos registros de la carpeta.', correcta: false, retro: 'Ocultar registros es una falla grave de integridad.' },
      ],
    },
    errores: [
      { error: 'Completar registros atrasados antes de la visita.', correccion: 'Gestiona lo atrasado como desviación; nunca lo «pongas al día».' },
      { error: 'Personal que responde de memoria o improvisa.', correccion: 'Entrena al personal a responder con lo que hace y a apoyarse en el procedimiento.' },
      { error: 'Planes de mejoramiento con fechas imposibles.', correccion: 'Compromete plazos realistas y cúmplelos con evidencia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué etapas tiene una visita típica?', respuesta: 'Reunión de apertura, recorrido de áreas, revisión documental y reunión de cierre con acta.' },
      { pregunta: '¿Qué debe hacer el personal si no sabe una respuesta?', respuesta: 'Decirlo con honestidad y apoyarse en el procedimiento o en el responsable, sin improvisar.' },
    ],
    resumen: [
      'La visita evalúa si el sistema **funciona en las personas**.',
      'Preparar es **demostrar**, no maquillar.',
      'Después, un **plan de mejoramiento** realista construye confianza.',
    ],
    referencias: [REF.res1160, REF.dec335, REF.fdaIntegridad, REF.picsPi041],
    imagenes: [
      { ubicacion: 'En la sección de desarrollo', descripcion: 'Escena ilustrada de una reunión de cierre: dos inspectores y el equipo de calidad alrededor de una mesa con el acta, en la paleta de Edvanta.', alt: 'Reunión de cierre de una visita de certificación del INVIMA' },
    ],
    keywords: ['visita de certificación invima', 'cómo prepararse para una visita del invima', 'inspección bpm invima', 'reunión de apertura y cierre inspección', 'acta de visita invima', 'preparación de auditoría bpm'],
  },
];

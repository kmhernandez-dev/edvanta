/**
 * Unidad 5. Mejora continua, gestión del cambio y cultura de calidad (7 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: un SGC vivo que mejora, cambia de forma controlada y se apoya en las personas',
    duracion: 20,
    gancho: {
      titulo: 'El sistema que se congeló',
      texto: 'Un laboratorio obtuvo su certificación con un sistema impecable. Cinco años después, los procedimientos siguen iguales aunque cambiaron los equipos, la mitad del personal y dos productos. Nadie se atreve a modificar nada por miedo a «salirse del sistema». Un SGC que no mejora ni cambia se vuelve un obstáculo. Esta unidad trata de cómo mantenerlo vivo sin perder el control.',
    },
    objetivos: [
      'Explicar por qué un SGC debe mejorar, cambiar de forma controlada y apoyarse en las personas.',
      'Relacionar mejora continua, gestión del cambio y cultura de calidad.',
      'Anticipar la ruta de la unidad y su cierre con una hoja de ruta de implementación.',
    ],
    conceptos: [
      { icono: 'RefreshCw', termino: 'Mejora continua', definicion: 'Actividad recurrente para aumentar el desempeño, a partir de datos, con un ciclo planificado.' },
      { icono: 'GitBranch', termino: 'Cambio controlado', definicion: 'Un cambio que se evalúa, aprueba, implementa y verifica antes de considerarse cerrado.' },
      { icono: 'Users', termino: 'Cultura de calidad', definicion: 'Los valores, creencias y comportamientos compartidos que hacen que las personas hagan lo correcto para la calidad aun sin supervisión.' },
    ],
    secciones: [
      {
        titulo: 'Tres fuerzas que mantienen vivo el sistema',
        parrafos: [
          'Un SGC maduro combina tres fuerzas. La **mejora continua** usa los datos de la unidad anterior (indicadores, desviaciones, quejas, auditorías) para decidir qué mejorar y lo hace con un método. La **gestión del cambio** permite modificar procesos, equipos, proveedores o documentos sin perder el estado de control ni el cumplimiento regulatorio. Y la **cultura de calidad** hace que las personas reporten, propongan y cumplan, porque entienden por qué importa.',
          'Sin mejora, el sistema se estanca. Sin gestión del cambio, la mejora se vuelve un riesgo. Sin cultura, ni la mejora ni los cambios se sostienen. ICH Q10 pone la mejora continua entre sus objetivos y la gestión del cambio entre sus elementos; ISO 9001 dedica su cláusula 10 a la mejora.',
        ],
      },
      {
        titulo: 'La ruta de la unidad',
        parrafos: [
          'Recorrerás el **ciclo PHVA** aplicado a la planta y al servicio farmacéutico; las herramientas de mejora **Kaizen y Lean** y la mejora del desempeño del proceso según ICH Q10; el **sistema de gestión del cambio** de ICH Q10; la **clasificación de cambios** con ICH Q12 y su relación con los trámites ante el INVIMA; la **cultura de calidad** y cómo medirla; y una **hoja de ruta** para implementar o fortalecer un SGC farmacéutico.',
          'Al terminar el curso podrás proponer a tu organización un plan concreto: por dónde empezar, qué medir, cómo gestionar los cambios y cómo involucrar a las personas.',
        ],
      },
    ],
    caso: {
      titulo: 'El procedimiento intocable',
      contexto: 'Los operarios de empaque proponen un cambio en el orden de las verificaciones del despeje de línea que, según ellos, reduciría errores. La jefatura responde que el procedimiento está aprobado y no se puede tocar.',
      pregunta: '¿Cuál es la respuesta coherente con un SGC vivo?',
      opciones: [
        { texto: 'Mantener el procedimiento: lo aprobado no se cambia.', correcta: false, retro: 'Lo aprobado sí se cambia, pero mediante control de cambios. Rechazar sin evaluar desperdicia el conocimiento de quienes ejecutan.' },
        { texto: 'Registrar la propuesta, evaluarla con control de cambios y, si conviene, implementarla con capacitación y verificación de eficacia.', correcta: true, retro: 'Así se aprovecha la mejora sin perder el control, y se refuerza la cultura de participación.' },
        { texto: 'Dejar que lo cambien de manera informal si funciona.', correcta: false, retro: 'Un cambio informal rompe el control y la trazabilidad, aunque la idea sea buena.' },
      ],
    },
    errores: [
      { error: 'Creer que cumplir es no cambiar nada.', correccion: 'El cumplimiento exige cambiar de forma controlada, no congelar el sistema.' },
      { error: 'Hacer mejoras sin pasar por control de cambios.', correccion: 'Toda mejora que modifique un proceso o documento entra por gestión del cambio.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tres fuerzas mantienen vivo un SGC?', respuesta: 'La mejora continua, la gestión del cambio y la cultura de calidad.' },
    ],
    resumen: [
      '**Mejora** con datos, **cambia** con control y **apóyate** en las personas.',
      'Un sistema que no cambia se vuelve un **obstáculo**.',
    ],
    referencias: [R.ichQ10, R.iso9001, R.ispePdaCultura],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Tres engranajes ilustrados rotulados mejora, cambio y personas, que mueven un sistema de calidad.', alt: 'Mejora continua, gestión del cambio y cultura de calidad' },
    ],
    keywords: ['mejora continua sistema de gestión de calidad', 'gestión del cambio farmacéutica', 'cultura de calidad farmacéutica', 'sistema de calidad vivo', 'iso 9001 cláusula 10 mejora'],
  },
  {
    titulo: 'Ciclo PHVA aplicado a la planta y al servicio farmacéutico',
    duracion: 25,
    gancho: {
      titulo: 'Cuatro letras que ordenan cualquier mejora',
      texto: 'Un servicio farmacéutico hospitalario tiene demasiados errores de dispensación de medicamentos de alto riesgo. La primera idea es «capacitar a todos». Con el ciclo PHVA, el equipo primero mide y analiza las causas, prueba un cambio en un turno, verifica si funcionó y solo entonces lo extiende. Tres meses después, los errores bajaron y se sabe por qué. Esa disciplina es la que esta clase enseña.',
    },
    objetivos: [
      'Describir las cuatro fases del ciclo PHVA y su origen.',
      'Aplicar el ciclo a un problema de una planta y a uno de un servicio farmacéutico.',
      'Reconocer el ciclo PHVA en la estructura de ISO 9001 y en las CAPA.',
    ],
    conceptos: [
      { icono: 'ClipboardList', termino: 'Planificar', definicion: 'Definir el problema y el objetivo, medir la situación actual, analizar las causas y diseñar el cambio con su forma de medirlo.' },
      { icono: 'Hammer', termino: 'Hacer', definicion: 'Implementar el cambio, de preferencia a pequeña escala o como prueba controlada.' },
      { icono: 'Search', termino: 'Verificar', definicion: 'Medir los resultados y compararlos con el objetivo y con la situación anterior.' },
      { icono: 'RefreshCw', termino: 'Actuar', definicion: 'Estandarizar lo que funcionó, corregir lo que no y definir el siguiente ciclo.' },
    ],
    proceso: {
      titulo: 'PHVA para reducir errores de dispensación',
      pasos: [
        { titulo: 'Planificar: medir', detalle: 'Registrar durante un mes los errores de dispensación por tipo, turno y medicamento.', icono: 'BarChart3', evidencia: 'Línea base de errores.' },
        { titulo: 'Planificar: analizar', detalle: 'Usar Pareto e Ishikawa: por ejemplo, la mayoría ocurre con medicamentos de nombre o empaque parecido.', icono: 'Search', evidencia: 'Causas priorizadas.' },
        { titulo: 'Planificar: diseñar', detalle: 'Separar físicamente los medicamentos de aspecto parecido, rotularlos y agregar doble verificación para alto riesgo.', icono: 'Lightbulb', evidencia: 'Plan del cambio y meta.' },
        { titulo: 'Hacer', detalle: 'Probar el cambio en un turno durante un mes, con control de cambios y capacitación.', icono: 'Hammer', evidencia: 'Registro de la prueba.' },
        { titulo: 'Verificar', detalle: 'Comparar los errores del turno piloto con la línea base y con los otros turnos.', icono: 'LineChart', evidencia: 'Análisis de resultados.' },
        { titulo: 'Actuar', detalle: 'Si funcionó, estandarizar en el procedimiento y en todos los turnos; definir el siguiente problema.', icono: 'CheckCircle2', evidencia: 'Procedimiento actualizado.' },
      ],
    },
    secciones: [
      {
        titulo: 'Origen y lógica del ciclo',
        parrafos: [
          'El ciclo de mejora nació con Walter Shewhart y lo difundió W. Edwards Deming, que más tarde prefirió hablar de **estudiar** en lugar de verificar para subrayar que se trata de aprender. En español se conoce como **PHVA**: planificar, hacer, verificar y actuar. Su lógica es la del método científico: plantear una hipótesis (si hacemos esto, mejorará aquello), probarla, observar el resultado y decidir.',
          'ISO 9001:2026 se organiza alrededor del ciclo PHVA: planificar con el contexto, el liderazgo y la planificación; hacer con el apoyo y la operación; verificar con la evaluación del desempeño, y actuar con la mejora. Las **CAPA** también son un PHVA: investigar y planificar la acción, implementarla, verificar su eficacia y estandarizar.',
        ],
      },
      {
        titulo: 'En la planta',
        parrafos: [
          'Un ejemplo de planta: la línea de blíster tiene demasiados tiempos muertos en los cambios de formato. **Planificar**: medir la duración de cada cambio por etapas y encontrar que la mitad del tiempo se va en buscar herramientas y en esperar la verificación de despeje. **Hacer**: organizar un carro de herramientas por formato y programar la verificación de calidad. **Verificar**: medir de nuevo los cambios de formato durante un mes. **Actuar**: estandarizar el carro y el horario en el procedimiento, y abordar el siguiente cuello de botella.',
          'La clave es no saltar fases. Muchas mejoras fallan porque se implementan sin línea base (no se sabe si mejoró), sin prueba controlada (el cambio se generaliza antes de saber si funciona) o sin estandarización (lo que funcionó se pierde cuando cambia el turno).',
        ],
      },
      {
        titulo: 'En el servicio farmacéutico',
        parrafos: [
          'En el servicio farmacéutico, el PHVA ordena las mejoras de la Resolución 1403 de 2007: oportunidad en la dispensación, vencidos, excursiones de temperatura, errores de dispensación. El proceso de la ilustración muestra cómo un problema de medicamentos de aspecto o nombre parecido se aborda con datos, una prueba y una estandarización.',
          'El tamaño del ciclo depende del problema: algunos se resuelven en semanas, otros requieren varios ciclos encadenados. Documentar cada ciclo, aunque sea en una página, construye la memoria de mejora de la organización y alimenta la revisión por la dirección.',
        ],
      },
    ],
    caso: {
      titulo: 'Capacitar a todos',
      contexto: 'Ante un aumento de errores de etiquetado en empaque, la jefatura propone capacitar de nuevo a todo el personal y considerar el problema resuelto.',
      pregunta: '¿Qué le falta a esa propuesta según el ciclo PHVA?',
      opciones: [
        { texto: 'Nada: capacitar es la acción correcta.', correcta: false, retro: 'Sin medir ni analizar causas no se sabe si la falta de capacitación es la causa; y sin verificar, no se sabe si funcionó.' },
        { texto: 'Medir y analizar las causas antes de decidir, probar la acción y verificar su efecto antes de estandarizar.', correcta: true, retro: 'El PHVA exige planificar con datos, probar, verificar y luego estandarizar.' },
        { texto: 'Repetir la capacitación cada mes.', correcta: false, retro: 'Repetir una acción no verificada no garantiza resultados.' },
      ],
    },
    errores: [
      { error: 'Saltar de la idea a la implementación general.', correccion: 'Mide, analiza, prueba a pequeña escala y verifica antes de generalizar.' },
      { error: 'No estandarizar lo que funcionó.', correccion: 'Actualiza procedimientos, capacita y agrega el control al proceso.' },
    ],
    comprueba: [
      { pregunta: '¿Qué significan las letras PHVA?', respuesta: 'Planificar, hacer, verificar y actuar.' },
      { pregunta: '¿Cómo se relaciona ISO 9001 con el PHVA?', respuesta: 'Sus cláusulas se organizan según el ciclo: planificar (4 a 6), hacer (7 y 8), verificar (9) y actuar (10).' },
    ],
    resumen: [
      'PHVA: **planificar con datos, hacer en pequeño, verificar y estandarizar**.',
      'Es la lógica de **ISO 9001** y de las **CAPA**.',
      'Funciona igual en la **planta** y en el **servicio farmacéutico**.',
    ],
    referencias: [R.iso9001, R.deming, R.ichQ10, R.res1403],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Rueda PHVA ilustrada con el ejemplo de errores de dispensación en cada cuadrante.', alt: 'Ciclo PHVA aplicado a un servicio farmacéutico' },
    ],
    keywords: ['ciclo phva', 'ciclo phva ejemplo', 'phva en farmacia', 'planificar hacer verificar actuar', 'ciclo de deming', 'phva iso 9001'],
  },
  {
    titulo: 'Herramientas de mejora: Kaizen, Lean y mejora del desempeño del proceso (ICH Q10)',
    duracion: 25,
    gancho: {
      titulo: 'El lote que espera más de lo que se fabrica',
      texto: 'Un lote de tabletas se fabrica en tres días, pero tarda 28 en estar disponible para la venta: espera materiales, espera sala, espera análisis, espera revisión. El 90 % de su tiempo no agrega valor. Las herramientas Lean y Kaizen nacieron para ver y reducir ese desperdicio. En la industria farmacéutica deben aplicarse respetando las BPM, y ICH Q10 les da un marco: mejorar el desempeño del proceso sin perder el estado de control.',
    },
    objetivos: [
      'Explicar los principios de Kaizen y Lean y los tipos de desperdicio.',
      'Aplicar herramientas como 5S, mapa de flujo de valor y reducción de tiempos de cambio en un entorno BPM.',
      'Relacionar estas herramientas con la mejora del desempeño del proceso de ICH Q10.',
    ],
    conceptos: [
      { icono: 'Sparkles', termino: 'Kaizen', definicion: 'Mejora continua en pequeños pasos, con la participación de las personas que hacen el trabajo.' },
      { icono: 'Route', termino: 'Lean', definicion: 'Filosofía de gestión derivada del sistema de producción de Toyota que busca entregar valor al cliente eliminando el desperdicio.' },
      { icono: 'Trash2', termino: 'Desperdicio', definicion: 'Toda actividad que consume recursos sin agregar valor: transporte, inventario, movimientos, esperas, sobreproducción, sobreprocesamiento, defectos y talento no aprovechado.' },
      { icono: 'Boxes', termino: '5S', definicion: 'Clasificar, ordenar, limpiar, estandarizar y sostener: método para organizar el puesto de trabajo, muy compatible con las BPM.' },
      { icono: 'Route', termino: 'Mapa de flujo de valor', definicion: 'Representación del flujo de materiales e información de un producto, con los tiempos de valor y de espera, para identificar desperdicios.' },
    ],
    secciones: [
      {
        titulo: 'Kaizen y Lean en pocas palabras',
        parrafos: [
          '**Kaizen**, palabra japonesa que se traduce como mejora, propone mejorar todos los días en pasos pequeños, con la participación de quienes conocen el proceso. **Lean**, término difundido a partir del estudio del sistema de producción de Toyota, propone definir el valor desde el cliente, mapear el flujo de valor, hacer que el producto fluya sin esperas, producir según la demanda y perseguir la perfección. Ambos comparten una idea: el desperdicio es el enemigo de la calidad y de la eficiencia.',
          'Los desperdicios clásicos se recuerdan bien en una planta farmacéutica: **esperas** (lotes en cuarentena por documentos incompletos), **inventario** (materiales que se vencen), **transporte y movimientos** (recorridos innecesarios entre áreas), **sobreprocesamiento** (verificaciones duplicadas sin valor), **defectos** (reprocesos y rechazos), **sobreproducción** y **talento no aprovechado** (ideas del personal que nadie escucha).',
        ],
      },
      {
        titulo: 'Herramientas compatibles con las BPM',
        parrafos: [
          'Las **5S** encajan de forma natural con las BPM: un área clasificada, ordenada, limpia y estandarizada reduce mezclas, contaminaciones y errores. El **mapa de flujo de valor** del proceso de liberación suele mostrar que las esperas entre áreas son mayores que los tiempos de análisis. La **reducción de tiempos de cambio** (conocida como SMED) aplica a los cambios de formato y a las limpiezas entre productos, siempre que no se reduzcan los pasos validados. El **trabajo estandarizado** y la **gestión visual** ayudan a cumplir los procedimientos.',
          'La regla de oro es que toda mejora Lean que modifique un proceso validado, una limpieza o un control pasa por **control de cambios** y, cuando corresponde, por revalidación. Lean no autoriza saltarse controles; ayuda a eliminar lo que no agrega valor sin tocar lo que protege al paciente.',
        ],
      },
      {
        titulo: 'Mejora del desempeño del proceso según ICH Q10',
        parrafos: [
          'ICH Q10 pide un sistema de **monitoreo del desempeño del proceso y de la calidad del producto** que identifique fuentes de variación y oportunidades de mejora, y propone la mejora continua como uno de sus objetivos. Las herramientas Lean y Kaizen, junto con métodos estadísticos como el análisis de capacidad del proceso o el enfoque DMAIC de Six Sigma (definir, medir, analizar, mejorar y controlar), son los medios para lograrlo.',
          'Un buen proyecto de mejora farmacéutico se define con un problema medible, una línea base, un equipo con las áreas implicadas, un análisis de causas, cambios gestionados y verificación de resultados. Al cerrarse, se documenta como conocimiento del producto y se presenta en la revisión por la dirección.',
        ],
      },
    ],
    caso: {
      titulo: 'Acortar la limpieza',
      contexto: 'Un equipo Kaizen propone reducir a la mitad el tiempo de limpieza entre productos en una tableteadora, eliminando un enjuague que «parece innecesario».',
      pregunta: '¿Cómo debe tratarse la propuesta?',
      opciones: [
        { texto: 'Implementarla: Lean busca eliminar desperdicios.', correcta: false, retro: 'La limpieza está validada; eliminar un paso sin evaluación puede generar contaminación cruzada.' },
        { texto: 'Evaluarla con control de cambios y gestión de riesgos, demostrar con datos que la limpieza sigue siendo eficaz (revalidación si aplica) y solo entonces implementarla.', correcta: true, retro: 'La mejora es posible, pero debe demostrar que mantiene la eficacia de la limpieza validada.' },
        { texto: 'Rechazarla: las limpiezas validadas no se pueden mejorar.', correcta: false, retro: 'Se pueden mejorar, con datos y control de cambios.' },
      ],
    },
    errores: [
      { error: 'Aplicar Lean sin respetar los controles BPM.', correccion: 'Toda mejora que toque procesos validados pasa por control de cambios y, si aplica, revalidación.' },
      { error: 'Hacer 5S una sola vez.', correccion: 'La quinta S es sostener: auditorías cortas y periódicas mantienen el orden.' },
      { error: 'Proyectos de mejora sin línea base.', correccion: 'Mide antes de cambiar para poder demostrar la mejora.' },
    ],
    comprueba: [
      { pregunta: 'Nombra cinco tipos de desperdicio.', respuesta: 'Por ejemplo: esperas, inventario, transporte, movimientos, sobreprocesamiento, defectos, sobreproducción y talento no aprovechado.' },
      { pregunta: '¿Qué significan las 5S?', respuesta: 'Clasificar, ordenar, limpiar, estandarizar y sostener.' },
    ],
    resumen: [
      '**Kaizen** y **Lean** eliminan el desperdicio con la participación de las personas.',
      'Las **5S**, el **flujo de valor** y la **reducción de tiempos de cambio** son compatibles con las BPM.',
      'Toda mejora que toque lo validado pasa por **control de cambios**.',
    ],
    referencias: [R.ichQ10, R.trs1019a3, R.iso9001],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Línea de tiempo de un lote ilustrada: tres días de fabricación y 25 días de esperas, con los desperdicios señalados.', alt: 'Mapa de flujo de valor de la liberación de un lote' },
    ],
    keywords: ['kaizen en la industria farmacéutica', 'lean manufacturing farmacéutico', '5s en bpm', 'tipos de desperdicio lean', 'mejora continua ich q10', 'mapa de flujo de valor ejemplo'],
  },
  {
    titulo: 'Sistema de gestión del cambio según ICH Q10: evaluación, aprobación, implementación y verificación',
    duracion: 25,
    gancho: {
      titulo: 'El cambio que nadie verificó',
      texto: 'Un laboratorio cambió el software del equipo de cromatografía por una versión nueva. El cambio se aprobó y se instaló. Seis meses después, en una auditoría de integridad de datos, se descubrió que la nueva versión no conservaba el registro de auditoría con la misma configuración. El cambio se había aprobado bien, pero nadie verificó después que funcionara como se esperaba. ICH Q10 pide justamente esa verificación posterior.',
    },
    objetivos: [
      'Describir los requisitos de ICH Q10 para el sistema de gestión del cambio.',
      'Diseñar un flujo de control de cambios con evaluación de riesgo e impacto regulatorio.',
      'Definir criterios de verificación de la eficacia de un cambio.',
    ],
    conceptos: [
      { icono: 'GitBranch', termino: 'Gestión del cambio', definicion: 'Enfoque sistemático para proponer, evaluar, aprobar, implementar y revisar los cambios.' },
      { icono: 'AlertTriangle', termino: 'Evaluación de riesgo del cambio', definicion: 'Aplicación de la gestión de riesgos para valorar el impacto del cambio en la calidad y definir el nivel de esfuerzo y formalidad.' },
      { icono: 'Users', termino: 'Evaluación por expertos', definicion: 'Participación de las áreas con conocimiento pertinente (producción, calidad, regulatorio, validación, ingeniería) en la evaluación del cambio.' },
      { icono: 'CheckCircle2', termino: 'Evaluación posterior', definicion: 'Revisión después de implementar el cambio para confirmar que logró su objetivo y que no tuvo efectos adversos en la calidad.' },
    ],
    proceso: {
      titulo: 'Flujo de gestión del cambio',
      pasos: [
        { titulo: 'Solicitud', detalle: 'Descripción del cambio, justificación, alcance y productos o sistemas afectados.', icono: 'FileText', evidencia: 'Solicitud numerada.' },
        { titulo: 'Clasificación y riesgo', detalle: 'Clasificar (mayor, moderado, menor) con criterios escritos y evaluar el riesgo para la calidad.', icono: 'AlertTriangle', evidencia: 'Clasificación justificada.' },
        { titulo: 'Evaluación de impacto', detalle: 'Expertos evalúan efecto en producto, validación, documentos, capacitación, proveedores y registro sanitario.', icono: 'Users', evidencia: 'Matriz de impacto.' },
        { titulo: 'Aprobación', detalle: 'Aprobación por calidad y por las áreas responsables, con plan de acciones y criterios de eficacia.', icono: 'Signature', evidencia: 'Aprobación firmada.' },
        { titulo: 'Implementación', detalle: 'Ejecutar el plan, incluida la autorización regulatoria si se requiere, y definir desde qué lote o fecha aplica.', icono: 'Hammer', evidencia: 'Evidencias del plan cumplido.' },
        { titulo: 'Verificación de eficacia', detalle: 'Revisar los criterios definidos tras un periodo o un número de lotes.', icono: 'CheckCircle2', evidencia: 'Informe de eficacia y cierre.' },
      ],
    },
    secciones: [
      {
        titulo: 'Lo que pide ICH Q10',
        parrafos: [
          'ICH Q10 describe el **sistema de gestión del cambio** como uno de los cuatro elementos del sistema de calidad farmacéutico. Pide que la **gestión de riesgos** se use para evaluar los cambios propuestos, con un nivel de esfuerzo y formalidad proporcional al riesgo; que los cambios se evalúen frente a la **autorización de comercialización** (el registro sanitario), incluidos el espacio de diseño cuando exista y el conocimiento del producto, para determinar si se requiere un trámite regulatorio; que participen **expertos** de las áreas pertinentes, y que, después de implementado, se haga una **evaluación** para confirmar que se lograron los objetivos y que no hubo un impacto negativo en la calidad.',
          'La guía también recuerda que el sistema de gestión del cambio cambia de foco a lo largo del ciclo de vida: en el desarrollo documenta la evolución del proceso; en la transferencia de tecnología gestiona los ajustes; en la fabricación comercial es el sistema formal descrito arriba, y en la discontinuación gestiona los cambios hasta el retiro del producto.',
        ],
      },
      {
        titulo: 'Evaluar bien el impacto',
        parrafos: [
          'Una **matriz de impacto** ayuda a no olvidar nada: ¿afecta la calidad del producto, la validación del proceso o de la limpieza, la calificación de equipos o sistemas computarizados, los métodos analíticos, la estabilidad, los documentos y registros, la capacitación, los proveedores, la seguridad y el ambiente, el registro sanitario o los compromisos con clientes? Cada respuesta afirmativa genera una acción en el plan.',
          'Los cambios en **sistemas computarizados** merecen atención especial por la integridad de datos: actualizaciones de software, cambios de configuración, migraciones de datos. La guía de PIC/S sobre integridad de datos recuerda que los registros de auditoría y los controles de acceso deben verificarse después de cualquier cambio.',
        ],
      },
      {
        titulo: 'Verificar la eficacia',
        parrafos: [
          'La verificación de eficacia no es firmar el cierre: es comprobar con datos que el cambio hizo lo que prometía. Los **criterios** se definen al aprobar el cambio, no al cerrarlo. Por ejemplo: los tres primeros lotes con el nuevo proveedor cumplen especificaciones y tienen perfiles de disolución comparables; la nueva versión de software conserva el registro de auditoría completo; el nuevo formato de registro no genera desviaciones de diligenciamiento en un mes.',
          'Los cambios cerrados se revisan en conjunto en la revisión de calidad del producto y en la revisión por la dirección: cuántos cambios hubo, cuántos fueron eficaces, cuántos generaron desviaciones. Esas métricas muestran la madurez del sistema de gestión del cambio.',
        ],
      },
    ],
    caso: {
      titulo: 'La actualización del software',
      contexto: 'Informática propone actualizar el sistema de datos del laboratorio a una nueva versión. El proveedor asegura que es una actualización menor.',
      pregunta: '¿Cómo debe gestionarse?',
      opciones: [
        { texto: 'Como un cambio menor de informática, sin participación de calidad.', correcta: false, retro: 'Un sistema que maneja datos GMP requiere evaluación de calidad e integridad de datos.' },
        { texto: 'Con control de cambios: evaluación de riesgo, plan de pruebas y verificación (incluidos registro de auditoría y controles de acceso), aprobación de calidad y criterios de eficacia después de implementar.', correcta: true, retro: 'Es el flujo de ICH Q10 aplicado a un sistema computarizado crítico, con verificación posterior.' },
        { texto: 'Instalarla en un fin de semana para no interrumpir el trabajo.', correcta: false, retro: 'La planificación de la fecha es secundaria; lo primero es evaluar y verificar.' },
      ],
    },
    errores: [
      { error: 'Definir los criterios de eficacia al cerrar el cambio.', correccion: 'Defínelos al aprobarlo, para que la verificación sea objetiva.' },
      { error: 'Cambios cerrados sin evaluación posterior.', correccion: 'Toda verificación de eficacia debe tener datos y una conclusión.' },
      { error: 'Clasificaciones de cambio sin criterios escritos.', correccion: 'Escribe criterios con ejemplos para mayor, moderado y menor.' },
    ],
    comprueba: [
      { pregunta: '¿Qué pide ICH Q10 después de implementar un cambio?', respuesta: 'Una evaluación que confirme que se lograron los objetivos y que no hubo impacto negativo en la calidad.' },
      { pregunta: '¿Frente a qué debe evaluarse un cambio para saber si requiere trámite?', respuesta: 'Frente a la autorización de comercialización (el registro sanitario) y el conocimiento del producto.' },
    ],
    resumen: [
      'Gestión del cambio: **evaluar con riesgo, aprobar con expertos, implementar y verificar**.',
      'Una **matriz de impacto** evita olvidar validaciones, documentos o trámites.',
      'Los **criterios de eficacia** se definen al aprobar, no al cerrar.',
    ],
    referencias: [R.ichQ10, R.ichQ9, R.picsPi041, R.ichQ12],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Flujo ilustrado de seis pasos del control de cambios con una lupa en el paso de verificación de eficacia.', alt: 'Flujo de gestión del cambio según ICH Q10' },
    ],
    keywords: ['control de cambios farmacéutico', 'gestión del cambio ich q10', 'change control gmp', 'procedimiento de control de cambios', 'verificación de eficacia de cambios', 'matriz de impacto de cambios'],
  },
  {
    titulo: 'Clasificación de cambios e impacto regulatorio: ICH Q12 y guía de modificaciones INVIMA',
    duracion: 25,
    gancho: {
      titulo: 'No todos los cambios valen lo mismo',
      texto: 'En un año, un laboratorio registra 180 cambios: desde actualizar un formato hasta cambiar el fabricante del principio activo. Si todos siguen el mismo flujo pesado, los importantes se demoran; si todos siguen el flujo ligero, los riesgosos pasan sin control. La solución es clasificar. ICH Q12 propone clasificar los cambios por su riesgo y por su relación con lo aprobado, y esa lógica ayuda a conectar el control de cambios interno con los trámites ante el INVIMA.',
    },
    objetivos: [
      'Explicar los conceptos de ICH Q12: condiciones establecidas, categorías de cambio y protocolo de gestión de cambios posteriores a la aprobación.',
      'Clasificar cambios según su riesgo y su ruta regulatoria.',
      'Conectar la clasificación interna con los trámites de modificación ante el INVIMA.',
    ],
    conceptos: [
      { icono: 'Lock', termino: 'Condiciones establecidas', definicion: 'Los elementos de la solicitud de registro que se consideran necesarios para asegurar la calidad del producto y cuyo cambio requiere una comunicación a la autoridad.' },
      { icono: 'Layers', termino: 'Categorías de cambio', definicion: 'Según ICH Q12: cambios que requieren aprobación previa, cambios que requieren notificación y cambios que no se reportan y se gestionan en el sistema de calidad.' },
      { icono: 'FileCheck', termino: 'Protocolo de gestión de cambios posteriores a la aprobación', definicion: 'Plan, acordado con la autoridad, que describe cómo se evaluará un cambio futuro y qué datos se presentarán, para facilitar su aprobación.' },
      { icono: 'BookOpen', termino: 'Documento de gestión del ciclo de vida', definicion: 'Documento que resume las condiciones establecidas, su categoría de reporte y los compromisos posteriores a la aprobación.' },
    ],
    mapa: {
      centro: 'Clasificar un cambio',
      ramas: [
        { titulo: '¿Toca lo aprobado?', icono: 'Lock', nodos: ['Fórmula, fabricante, especificaciones', 'Envase primario, vida útil', 'Etiquetas e insertos'] },
        { titulo: '¿Qué riesgo tiene?', icono: 'AlertTriangle', nodos: ['Mayor', 'Moderado', 'Menor'] },
        { titulo: '¿Qué ruta sigue?', icono: 'Route', nodos: ['Aprobación previa', 'Notificación', 'Gestión interna en el SGC'] },
      ],
    },
    secciones: [
      {
        titulo: 'La propuesta de ICH Q12',
        parrafos: [
          'ICH Q12, adoptada en 2019, busca que los cambios posteriores a la aprobación se gestionen de forma más predecible y eficiente. Introduce las **condiciones establecidas**: los elementos del expediente que aseguran la calidad y cuyo cambio exige comunicarse con la autoridad. Los demás elementos se pueden cambiar dentro del sistema de calidad de la empresa. Para los cambios a condiciones establecidas propone **categorías según el riesgo**: los de mayor riesgo requieren **aprobación previa**; los de riesgo moderado o bajo, **notificación** a la autoridad; y los cambios que no afectan condiciones establecidas **no se reportan** y se gestionan en el PQS.',
          'ICH Q12 también propone el **protocolo de gestión de cambios posteriores a la aprobación**, que permite acordar por adelantado cómo se evaluará un cambio futuro, y el **documento de gestión del ciclo de vida del producto**. Todo esto exige un sistema de calidad eficaz: la autoridad confía en que la empresa gestiona bien los cambios que no reporta.',
        ],
      },
      {
        titulo: 'Cómo se aplica en Colombia',
        parrafos: [
          'Cada autoridad define sus propias categorías y trámites. En Colombia, las modificaciones al registro sanitario se tramitan ante el **INVIMA** según el tipo de cambio, en el marco del Decreto 677 de 1995 y sus normas posteriores; el INVIMA publica en su portal los trámites y requisitos de cada modificación. Algunos cambios requieren aprobación antes de implementarse y otros se gestionan de forma más simple. El curso de modificaciones al registro sanitario de la línea regulatoria estudia cada caso.',
          'Lo que aporta ICH Q12 en la práctica colombiana es la **lógica de clasificación**: identificar qué elementos del registro son críticos, clasificar los cambios por riesgo y dejar documentada la justificación. Así, el control de cambios interno decide con criterio cuándo consultar con asuntos regulatorios y cuándo el cambio se gestiona solo dentro del SGC.',
        ],
      },
      {
        titulo: 'Una clasificación interna útil',
        parrafos: [
          'Una tabla de clasificación interna puede tener tres niveles. **Mayor**: puede afectar la calidad del producto o lo aprobado (fabricante del activo, fórmula, proceso crítico, especificación, envase primario, vida útil); requiere evaluación de riesgo formal, participación de regulatorio y, normalmente, trámite. **Moderado**: impacto potencial controlable (equipo equivalente con calificación, cambio de proveedor de un material no crítico ya calificado); requiere evaluación documentada. **Menor**: sin impacto en la calidad (corrección de errores tipográficos, formato de un registro sin cambio de contenido); flujo simplificado.',
          'Los criterios deben tener **ejemplos** y revisarse con la experiencia. Una auditoría de muestras de cambios clasificados como menores es una buena forma de detectar clasificaciones equivocadas antes de que lo haga la autoridad.',
        ],
      },
    ],
    caso: {
      titulo: 'Clasificar tres cambios',
      contexto: 'Llegan tres solicitudes: (a) cambiar el fabricante del principio activo de un producto; (b) reemplazar una mezcladora por otra del mismo diseño y capacidad, ya calificada; (c) corregir un error tipográfico en un instructivo.',
      pregunta: '¿Cuál es la clasificación más razonable?',
      opciones: [
        { texto: 'Los tres son menores porque no cambian el producto.', correcta: false, retro: 'El cambio de fabricante del activo toca lo aprobado y puede afectar la calidad.' },
        { texto: '(a) mayor con evaluación regulatoria y probable trámite; (b) moderado con evaluación documentada y verificación; (c) menor con flujo simplificado.', correcta: true, retro: 'La clasificación refleja el riesgo y la relación con lo aprobado.' },
        { texto: 'Los tres son mayores para estar seguros.', correcta: false, retro: 'Sobreclasificar satura el sistema y demora los cambios importantes.' },
      ],
    },
    errores: [
      { error: 'Clasificar por la urgencia del negocio.', correccion: 'Clasifica por el riesgo para la calidad y por la relación con lo aprobado.' },
      { error: 'Usar las categorías de ICH Q12 como si fueran las del INVIMA.', correccion: 'ICH Q12 da la lógica; los trámites concretos los define el INVIMA.' },
    ],
    comprueba: [
      { pregunta: '¿Qué son las condiciones establecidas de ICH Q12?', respuesta: 'Los elementos del registro necesarios para asegurar la calidad, cuyo cambio exige comunicarse con la autoridad.' },
      { pregunta: '¿Qué categorías de cambio propone ICH Q12?', respuesta: 'Aprobación previa, notificación y cambios no reportados gestionados en el sistema de calidad.' },
    ],
    resumen: [
      'ICH Q12 clasifica los cambios por **riesgo** y por su relación con las **condiciones establecidas**.',
      'En Colombia, los **trámites** los define el **INVIMA**.',
      'Una **clasificación interna** con criterios y ejemplos conecta el SGC con lo regulatorio.',
    ],
    referencias: [R.ichQ12, R.ichQ10, R.dec677Invima],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Árbol de decisión ilustrado para clasificar un cambio: ¿toca lo aprobado?, ¿qué riesgo tiene?, ¿qué ruta sigue?', alt: 'Clasificación de cambios farmacéuticos según ICH Q12' },
    ],
    keywords: ['ich q12 en español', 'condiciones establecidas ich q12', 'clasificación de cambios mayor menor', 'cambios post aprobación medicamentos', 'pacmp ich q12', 'modificaciones registro sanitario invima'],
  },
  {
    titulo: 'Cultura de calidad: liderazgo, comportamiento y medición',
    duracion: 25,
    gancho: {
      titulo: 'Lo que pasa cuando nadie está mirando',
      texto: 'A las 2 de la mañana, en el turno nocturno, un operario nota que una etiqueta salió con la fecha borrosa. Nadie lo vería. Podría seguir. En una empresa con cultura de calidad, detiene la línea, lo reporta y espera. En otra, sigue, porque la última vez que alguien detuvo la línea lo regañaron por bajar la producción. Los procedimientos son iguales en ambas empresas; la diferencia está en la cultura.',
    },
    objetivos: [
      'Explicar qué es la cultura de calidad y por qué es determinante para el SGC.',
      'Identificar los comportamientos de liderazgo que la construyen o la destruyen.',
      'Proponer formas de medir y mejorar la cultura de calidad.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Cultura de calidad', definicion: 'Conjunto de valores, creencias y comportamientos compartidos que llevan a las personas a priorizar la calidad y la seguridad del paciente en sus decisiones diarias.' },
      { icono: 'Hand', termino: 'Seguridad psicológica', definicion: 'La confianza de que se puede reportar un error, una duda o un problema sin temor a represalias.' },
      { icono: 'Eye', termino: 'Recorridos en planta', definicion: 'Visitas de los líderes al lugar donde se hace el trabajo para observar, escuchar y resolver obstáculos.' },
      { icono: 'BarChart3', termino: 'Indicadores de cultura', definicion: 'Medidas que reflejan comportamientos: reportes de casi-errores, desviaciones autodetectadas, participación en mejoras, resultados de encuestas.' },
    ],
    secciones: [
      {
        titulo: 'Por qué la cultura decide',
        parrafos: [
          'Muchos problemas graves de calidad e integridad de datos detectados por las autoridades no se explican por la falta de procedimientos, sino por **comportamientos**: presión por cumplir la producción a cualquier costo, miedo a reportar, normalización de pequeñas desviaciones. La industria y las autoridades han reconocido que la cultura de calidad es tan importante como el sistema documental. La guía de ISPE y PDA de 2019 para mejorar la cultura de calidad en plantas farmacéuticas ofrece herramientas y ejemplos para evaluarla y fortalecerla.',
          'Una cultura de calidad madura se reconoce porque las personas **reportan** sin miedo, **preguntan** cuando dudan, **detienen** el proceso cuando algo no está bien, **proponen** mejoras y **cumplen** los procedimientos aunque nadie las supervise.',
        ],
      },
      {
        titulo: 'Lo que hacen los líderes',
        parrafos: [
          'La cultura la moldean los líderes con lo que **hacen**, más que con lo que dicen. Construyen cultura cuando agradecen un reporte de error, cuando apoyan a quien detuvo la línea, cuando recorren la planta y escuchan, cuando asignan recursos a las CAPA y cuando sus decisiones muestran que la calidad no se negocia por la producción. La destruyen cuando castigan al que reporta, cuando presionan para liberar un lote con dudas o cuando celebran el volumen sin mirar las desviaciones.',
          'ICH Q10 pone la responsabilidad de la dirección en el centro del sistema por esta razón. Una práctica eficaz es el **recorrido en planta** con una pregunta sencilla a los equipos: ¿qué te impide hacer tu trabajo bien a la primera? Las respuestas suelen revelar problemas que ningún indicador muestra.',
        ],
      },
      {
        titulo: 'Medir la cultura',
        parrafos: [
          'La cultura se puede medir de forma indirecta. Las **encuestas** de percepción preguntan si las personas se sienten seguras para reportar, si creen que la calidad es prioridad y si sus ideas se escuchan. Los **indicadores de comportamiento** miden lo que pasa: número de reportes de casi-errores, proporción de desviaciones autodetectadas por el área frente a las detectadas por auditoría, participación en proyectos de mejora, cumplimiento de recorridos de liderazgo, tiempo de respuesta a problemas escalados.',
          'Un aumento de reportes después de una campaña de cultura suele ser una **buena noticia**: significa que los problemas que existían empiezan a verse. Por eso los indicadores de cultura se interpretan junto con los de calidad del producto, y se presentan en la revisión por la dirección.',
        ],
      },
    ],
    caso: {
      titulo: 'El supervisor que detuvo la línea',
      contexto: 'Un supervisor detiene una línea de empaque por una sospecha de mezcla de estuches. Tras la revisión, no había mezcla. El gerente de producción lo reprende frente al equipo por la pérdida de dos horas.',
      pregunta: '¿Qué efecto tiene esa reacción en la cultura de calidad y qué debió hacerse?',
      opciones: [
        { texto: 'Ninguno: el supervisor debe estar seguro antes de detener la línea.', correcta: false, retro: 'Exigir certeza antes de detener lleva a no detener nunca. El mensaje al equipo es «no reportes».' },
        { texto: 'Destruye la seguridad psicológica; debió reconocerse la decisión, revisar por qué surgió la duda y mejorar el control que la generó.', correcta: true, retro: 'Reconocer la decisión correcta, aun sin defecto, refuerza el comportamiento que protege al paciente.' },
        { texto: 'Mejora la cultura porque enseña a no perder tiempo.', correcta: false, retro: 'Enseña a priorizar la producción sobre la calidad, lo contrario de lo que se busca.' },
      ],
    },
    errores: [
      { error: 'Hacer campañas de afiches sin cambiar los comportamientos de los líderes.', correccion: 'Empieza por lo que hacen los líderes: reconocer reportes, recorrer la planta, asignar recursos.' },
      { error: 'Castigar errores honestos.', correccion: 'Distingue el error honesto (se aprende del sistema) de la conducta temeraria o el fraude (se sanciona).' },
      { error: 'Medir solo resultados de producto.', correccion: 'Agrega indicadores de comportamiento y encuestas de percepción.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la seguridad psicológica?', respuesta: 'La confianza de poder reportar errores, dudas o problemas sin temor a represalias.' },
      { pregunta: 'Da dos indicadores de cultura de calidad.', respuesta: 'Por ejemplo: reportes de casi-errores, desviaciones autodetectadas, participación en mejoras o resultados de encuestas.' },
    ],
    resumen: [
      'La **cultura** decide lo que pasa cuando nadie está mirando.',
      'La construyen los **comportamientos de los líderes**.',
      'Se mide con **encuestas** e **indicadores de comportamiento**.',
    ],
    referencias: [R.ispePdaCultura, R.ichQ10, R.fdaIntegridad],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Escena ilustrada de un operario que detiene una línea de empaque y una líder que se acerca a agradecerle.', alt: 'Cultura de calidad en una planta farmacéutica' },
    ],
    keywords: ['cultura de calidad farmacéutica', 'quality culture', 'cómo medir la cultura de calidad', 'seguridad psicológica en calidad', 'liderazgo y cultura de calidad', 'guía ispe pda cultura de calidad'],
  },
  {
    titulo: 'Hoja de ruta para implementar o fortalecer un SGC farmacéutico',
    duracion: 30,
    gancho: {
      titulo: 'Por dónde empezar el lunes',
      texto: 'Terminaste el curso y te asignan una tarea concreta: fortalecer el sistema de calidad de un laboratorio mediano que cumple BPM pero tiene un sistema reactivo, o implementar desde cero el SGC de un servicio farmacéutico. La pregunta práctica es por dónde empezar el lunes. Esta clase integra todo el curso en una hoja de ruta por fases, con entregables y un calendario realista.',
    },
    objetivos: [
      'Diseñar una hoja de ruta por fases para implementar o fortalecer un SGC farmacéutico.',
      'Definir los entregables y los indicadores de avance de cada fase.',
      'Identificar los factores que hacen fracasar una implementación y cómo evitarlos.',
    ],
    conceptos: [
      { icono: 'Search', termino: 'Diagnóstico', definicion: 'Evaluación del estado actual frente a los requisitos aplicables (BPM, ICH Q10, ISO 9001, servicio farmacéutico) y la cultura.' },
      { icono: 'Route', termino: 'Hoja de ruta', definicion: 'Plan por fases con objetivos, entregables, responsables y fechas.' },
      { icono: 'Flag', termino: 'Victorias tempranas', definicion: 'Mejoras visibles y de bajo costo que generan confianza en el proyecto.' },
      { icono: 'Award', termino: 'Certificación', definicion: 'Evaluación por un organismo independiente. En Colombia, los organismos de certificación ISO son acreditados por el ONAC; la certificación BPM la otorga el INVIMA.' },
    ],
    proceso: {
      titulo: 'Hoja de ruta en seis fases',
      intro: 'Los plazos son orientativos para una organización mediana; se ajustan a su tamaño y punto de partida.',
      pasos: [
        { titulo: 'Fase 1. Compromiso y diagnóstico (mes 1 y 2)', detalle: 'Patrocinio de la dirección, equipo líder, diagnóstico frente a los requisitos aplicables y encuesta de cultura.', icono: 'Search', evidencia: 'Informe de diagnóstico con brechas priorizadas.' },
        { titulo: 'Fase 2. Diseño del sistema (mes 2 y 3)', detalle: 'Contexto, partes interesadas, política, objetivos, mapa de procesos y matriz de requisitos legales.', icono: 'Route', evidencia: 'Mapa de procesos y política aprobados.' },
        { titulo: 'Fase 3. Procesos críticos primero (mes 3 a 6)', detalle: 'Desviaciones y CAPA, control de cambios, control documental, quejas y retiros, con sus indicadores.', icono: 'Workflow', evidencia: 'Procedimientos vigentes y registros en uso.' },
        { titulo: 'Fase 4. Medición y competencia (mes 4 a 8)', detalle: 'Tablero de indicadores, programa de capacitación por competencias y recorridos de liderazgo.', icono: 'BarChart3', evidencia: 'Tablero en uso y capacitación registrada.' },
        { titulo: 'Fase 5. Verificación (mes 8 a 10)', detalle: 'Autoinspección o auditoría interna completa y primera revisión por la dirección.', icono: 'ClipboardCheck', evidencia: 'Informe de auditoría y acta de revisión.' },
        { titulo: 'Fase 6. Consolidación y mejora (mes 10 en adelante)', detalle: 'Cierre de hallazgos, proyectos de mejora, revisión de producto y, si aplica, certificación.', icono: 'RefreshCw', evidencia: 'Plan de mejora y resultados.' },
      ],
    },
    secciones: [
      {
        titulo: 'Empieza por el diagnóstico y el compromiso',
        parrafos: [
          'Ninguna implementación funciona sin **patrocinio de la dirección**: tiempo, recursos y presencia. La primera fase consigue ese compromiso con un diagnóstico honesto: compara la situación con los requisitos aplicables (Resolución 1160 de 2016 si fabrica, Resolución 3619 de 2013 si tiene laboratorio, Decreto 780 de 2016 y Resolución 1403 de 2007 si tiene servicio farmacéutico, más ICH Q10 e ISO 9001 según sus metas) y mide la cultura. El resultado es una lista de brechas priorizadas por riesgo para el paciente y para el cumplimiento.',
          'Con el diagnóstico se diseña el sistema: contexto, partes interesadas, política, objetivos, **mapa de procesos** y **matriz de requisitos legales**. Estos entregables orientan todo lo demás y evitan escribir procedimientos sin saber para qué proceso son.',
        ],
      },
      {
        titulo: 'Los procesos críticos primero',
        parrafos: [
          'No todo se implementa a la vez. Los procesos que más protegen al paciente y que más pesan en una inspección son los primeros: **desviaciones y CAPA**, **control de cambios**, **control documental**, **quejas y retiros**, y **liberación**. Con ellos funcionando, el sistema ya aprende de sus problemas. Luego vienen la medición con un **tablero de indicadores**, la **competencia** del personal y los **recorridos de liderazgo**.',
          'Conviene buscar **victorias tempranas**: un tablero visual en el área de empaque, la eliminación de un formato duplicado, la reducción del tiempo de cierre de desviaciones. Generan confianza y demuestran que el sistema ayuda en lugar de estorbar.',
        ],
      },
      {
        titulo: 'Verificar, consolidar y evitar los fracasos típicos',
        parrafos: [
          'La primera **autoinspección o auditoría interna** completa y la primera **revisión por la dirección** son el momento de verificar si el sistema funciona. Sus hallazgos alimentan la fase de consolidación. Si la organización busca la **certificación ISO 9001**, elige un organismo de certificación acreditado por el ONAC; la certificación de BPM la otorga el INVIMA según el Decreto 335 de 2022.',
          'Los fracasos típicos son conocidos: implementar para la auditoría y no para el negocio, escribir demasiados documentos, dejar el proyecto solo en manos de calidad, no medir y no sostener. La mejor protección es un sistema sencillo, centrado en los procesos críticos, con dueños, indicadores y una dirección que revisa y decide. Ese es el SGC que este curso te ha enseñado a construir.',
        ],
      },
    ],
    caso: {
      titulo: 'Cien procedimientos en tres meses',
      contexto: 'Un consultor propone a un laboratorio escribir cien procedimientos nuevos en tres meses para «tener el sistema completo» antes de la recertificación.',
      pregunta: '¿Qué le responderías a la gerencia?',
      opciones: [
        { texto: 'Aceptar: más documentos dan más cumplimiento.', correcta: false, retro: 'Cien documentos nuevos sin implementar ni capacitar generan incumplimientos con su propio sistema.' },
        { texto: 'Priorizar: diagnóstico de brechas, procesos críticos primero con procedimientos que se usen y se midan, y una autoinspección antes de la visita.', correcta: true, retro: 'Un sistema sencillo, implementado y medido es más sólido que un sistema extenso en papel.' },
        { texto: 'Posponer todo hasta después de la recertificación.', correcta: false, retro: 'Postergar deja las brechas abiertas justo cuando más importan.' },
      ],
    },
    errores: [
      { error: 'Implementar para la auditoría.', correccion: 'Implementa para el negocio y el paciente; la auditoría verificará un sistema que ya funciona.' },
      { error: 'Dejar el proyecto solo a calidad.', correccion: 'Asigna dueños de proceso en todas las áreas y patrocinio de la dirección.' },
      { error: 'No sostener después de la certificación.', correccion: 'Mantén la revisión por la dirección, las auditorías y los proyectos de mejora.' },
    ],
    comprueba: [
      { pregunta: '¿Qué procesos conviene implementar primero?', respuesta: 'Desviaciones y CAPA, control de cambios, control documental, quejas y retiros, y liberación.' },
      { pregunta: '¿Quién acredita a los organismos de certificación ISO en Colombia?', respuesta: 'El ONAC, Organismo Nacional de Acreditación de Colombia.' },
    ],
    resumen: [
      'Empieza por **compromiso y diagnóstico**; diseña con **mapa de procesos** y **matriz legal**.',
      'Implementa **primero los procesos críticos** y busca **victorias tempranas**.',
      '**Verifica, consolida y sostén**: un sistema sencillo que funciona vale más que uno extenso en papel.',
    ],
    referencias: [R.ichQ10, R.iso9001, R.res1160Compilada, R.res1403, R.dec335],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Hoja de ruta ilustrada en seis fases sobre una línea de tiempo de doce meses, con entregables en cada fase.', alt: 'Hoja de ruta para implementar un sistema de gestión de calidad farmacéutico' },
    ],
    keywords: ['cómo implementar un sistema de gestión de calidad', 'hoja de ruta sgc farmacéutico', 'implementación iso 9001 pasos', 'fortalecer sistema de calidad farmacéutico', 'plan de implementación de calidad', 'certificación iso 9001 colombia onac'],
  },
];

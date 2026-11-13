/** Curso de BPM · Unidad 4. Productos estériles (Anexo 1) */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: por qué los estériles son distintos',
    duracion: 15,
    gancho: {
      titulo: 'Una prueba que no puede demostrar lo que promete',
      texto: 'La prueba de esterilidad analiza unas pocas unidades de un lote de miles. Si un lote tuviera una unidad contaminada de cada mil, la probabilidad de detectarla con esa muestra sería muy baja. Por eso, en los productos estériles, la esterilidad no se demuestra al final: se garantiza con el diseño del proceso, de las instalaciones y del trabajo de las personas. Esa idea explica por qué los requisitos se multiplican en esta unidad.',
    },
    objetivos: [
      'Explicar por qué la prueba de esterilidad no basta para asegurar la esterilidad de un lote.',
      'Identificar los riesgos propios de los productos estériles: microorganismos, endotoxinas y partículas.',
      'Ubicar los temas de la unidad dentro de la estrategia de control de la contaminación.',
    ],
    conceptos: [
      { icono: 'Syringe', termino: 'Producto estéril', definicion: 'Producto libre de microorganismos viables, como inyectables, colirios o soluciones para irrigación. Llega directo a la sangre, al ojo o a tejidos sin las defensas habituales.' },
      { icono: 'Bug', termino: 'Endotoxinas', definicion: 'Restos de la pared de bacterias gramnegativas que causan fiebre y reacciones graves aunque las bacterias estén muertas. Por eso se controlan aparte de la esterilidad.' },
      { icono: 'Microscope', termino: 'Partículas', definicion: 'Material visible o subvisible que no debe estar en un inyectable. Se controla en el ambiente, en los componentes y en el producto.' },
      { icono: 'ShieldCheck', termino: 'Aseguramiento de la esterilidad', definicion: 'Conjunto de medidas de diseño, proceso, personal y monitoreo que, juntas, dan confianza en la esterilidad. La prueba final solo confirma.' },
    ],
    mapa: {
      centro: 'Qué hace distintos a los estériles',
      ramas: [
        { titulo: 'Riesgos', icono: 'Bug', nodos: ['Microorganismos', 'Endotoxinas', 'Partículas'] },
        { titulo: 'Límites de la prueba', icono: 'TestTube', nodos: ['Muestra pequeña', 'Baja probabilidad de detectar', 'Solo confirma'] },
        { titulo: 'Cómo se asegura', icono: 'ShieldCheck', nodos: ['Áreas por grados', 'Procesos validados', 'Personal calificado'] },
        { titulo: 'Qué verás', icono: 'BookOpen', nodos: ['Anexo 1 de 2022', 'Grados y monitoreo', 'Llenado aséptico y esterilización'] },
      ],
    },
    secciones: [
      {
        titulo: 'Riesgos que no perdonan',
        parrafos: [
          'Un comprimido contaminado con pocos microorganismos pasa por un estómago ácido; un inyectable contaminado llega directo a la sangre. Además del riesgo microbiológico, los estériles deben controlar las **endotoxinas**, que causan reacciones aunque las bacterias ya no estén vivas, y las **partículas**, que pueden obstruir capilares o causar inflamación.',
          'La **prueba de esterilidad** tiene un límite estadístico: analiza una muestra pequeña y solo detecta contaminaciones frecuentes. Por eso las BPM para estériles, el Anexo 1 de 2022 y la guía de la OMS (TRS 1044, Anexo 2) se concentran en el proceso. En Colombia, la Resolución 1160 de 2016 incluye un manual específico de BPM para medicamentos estériles y una guía de inspección propia.',
        ],
      },
      {
        titulo: 'El mapa de la unidad',
        parrafos: [
          'En esta unidad verás los principales cambios del **Anexo 1 de 2022** y del TRS 1044, la clasificación por **grados** y el **monitoreo ambiental** dentro de una estrategia de control de la contaminación, el **llenado aséptico** y su validación con simulaciones con medio de cultivo, y la comparación entre **esterilización terminal** y **procesamiento aséptico**. El hilo conductor es uno: en estériles, cada barrera se diseña, se valida y se vigila, porque ninguna prueba final puede compensar una barrera rota.',
        ],
      },
    ],
    proceso: {
      titulo: 'Capas que protegen un inyectable',
      pasos: [
        { titulo: 'Diseño del producto y del proceso', detalle: 'Se elige el método de esterilización más seguro que tolere el producto.', icono: 'Lightbulb', evidencia: 'Justificación del método.' },
        { titulo: 'Instalaciones por grados', detalle: 'Áreas limpias A, B, C y D según la operación, con HVAC calificado.', icono: 'Building2', evidencia: 'Clasificación de áreas.' },
        { titulo: 'Componentes controlados', detalle: 'Envases, tapones y soluciones se lavan, esterilizan o despirogenizan con procesos validados.', icono: 'Package', evidencia: 'Validaciones de procesos de componentes.' },
        { titulo: 'Personal calificado', detalle: 'Entrenamiento, vestido calificado y participación en simulaciones del proceso aséptico.', icono: 'Users', evidencia: 'Registros de calificación del personal.' },
        { titulo: 'Monitoreo continuo', detalle: 'Partículas y microorganismos en aire, superficies y personal, con tendencias.', icono: 'LineChart', evidencia: 'Programa y resultados de monitoreo.' },
        { titulo: 'Prueba final', detalle: 'Esterilidad, endotoxinas y partículas confirman, pero no sustituyen, lo anterior.', icono: 'TestTube', evidencia: 'Certificado de análisis.' },
      ],
    },
    caso: {
      titulo: 'Esterilidad conforme, monitoreo fuera de límite',
      contexto: 'Un lote de viales cumple la prueba de esterilidad. Durante su llenado, sin embargo, una placa de sedimentación del grado A mostró crecimiento microbiano.',
      pregunta: '¿Qué pesa más en la decisión?',
      opciones: [
        { texto: 'La prueba de esterilidad conforme: el lote está estéril.', correcta: false, retro: 'La prueba tiene baja probabilidad de detectar una contaminación ocasional. El hallazgo en grado A es una señal directa de riesgo.' },
        { texto: 'El hallazgo en grado A: se investiga el evento, se identifica el microorganismo y se evalúa el impacto antes de decidir sobre el lote.', correcta: true, retro: 'En estériles, el monitoreo del proceso pesa tanto o más que la prueba final, porque esta no puede demostrar la esterilidad de todo el lote.' },
        { texto: 'Repetir la prueba de esterilidad con más unidades.', correcta: false, retro: 'Más unidades no resuelven el límite estadístico ni explican el hallazgo del ambiente.' },
      ],
    },
    errores: [
      { error: 'Confiar en la prueba de esterilidad para liberar.', correccion: 'La liberación se apoya en el proceso validado, el monitoreo y la revisión del lote; la prueba solo confirma.' },
      { error: 'Olvidar las endotoxinas.', correccion: 'Contrólalas en agua, componentes y producto: no desaparecen con la esterilización.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué la prueba de esterilidad no basta?', respuesta: 'Porque analiza una muestra pequeña y tiene baja probabilidad de detectar contaminaciones ocasionales.' },
      { pregunta: '¿Qué son las endotoxinas?', respuesta: 'Restos de la pared de bacterias gramnegativas que causan fiebre y reacciones aunque las bacterias estén muertas.' },
    ],
    resumen: [
      'En estériles, la esterilidad **se asegura con el proceso**, no con la prueba final.',
      'Se controlan **microorganismos, endotoxinas y partículas**.',
      'Cada barrera se **diseña, valida y vigila**.',
    ],
    referencias: [REF.euAnexo1, REF.trs1044a2, REF.res1160],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Capas concéntricas ilustradas alrededor de un vial: diseño, instalaciones, componentes, personal, monitoreo y prueba final, en tonos de azul a turquesa.', alt: 'Capas de protección de un producto estéril' },
    ],
    keywords: ['bpm productos estériles', 'fabricación de medicamentos estériles', 'por qué la prueba de esterilidad no basta', 'endotoxinas en inyectables', 'aseguramiento de la esterilidad', 'manual bpm estériles colombia'],
  },

  {
    titulo: 'Anexo 1 (2022) y TRS 1044: principales cambios',
    duracion: 25,
    gancho: {
      titulo: 'Del cumplimiento por capítulos a una estrategia',
      texto: 'Durante años, muchas plantas estériles cumplían el Anexo 1 capítulo por capítulo: monitoreo por un lado, limpieza por otro, personal por otro. La revisión de 2022 cambió la pregunta: ya no basta con cumplir cada requisito; la planta debe demostrar que entiende cómo puede contaminarse su producto y cómo cada control encaja en una estrategia completa.',
    },
    objetivos: [
      'Resumir los principales cambios del Anexo 1 de 2022 y su equivalente de la OMS.',
      'Explicar qué es la estrategia de control de la contaminación (CCS).',
      'Reconocer el énfasis en la gestión de riesgos y en las tecnologías de barrera.',
    ],
    conceptos: [
      { icono: 'Network', termino: 'Estrategia de control de la contaminación (CCS)', definicion: 'Documento y enfoque que reúne todos los controles de la planta contra microorganismos, endotoxinas y partículas, muestra cómo se relacionan y cómo se evalúa su eficacia.' },
      { icono: 'AlertTriangle', termino: 'Gestión de riesgos para la calidad', definicion: 'El Anexo 1 de 2022 aplica ICH Q9 en todo el texto: decisiones sobre diseño, monitoreo y controles deben basarse en riesgo y estar justificadas.' },
      { icono: 'Box', termino: 'Tecnologías de barrera', definicion: 'Aisladores y sistemas de barrera de acceso restringido (RABS) que separan a las personas del producto expuesto. El anexo promueve su uso.' },
      { icono: 'Filter', termino: 'Integridad del filtro antes del uso', definicion: 'El anexo pide verificar la integridad del filtro esterilizante después de esterilizarlo y antes de usarlo (PUPSIT), salvo justificación basada en riesgo.' },
    ],
    mapa: {
      centro: 'Qué cambió en 2022',
      ramas: [
        { titulo: 'Enfoque', icono: 'Network', nodos: ['Estrategia de control de la contaminación', 'Gestión de riesgos en todo el texto', 'Mejora continua'] },
        { titulo: 'Tecnología', icono: 'Box', nodos: ['Aisladores y RABS', 'Sistemas cerrados y de un solo uso', 'Monitoreo continuo en grado A'] },
        { titulo: 'Procesos', icono: 'Filter', nodos: ['Integridad del filtro antes del uso', 'Simulación del proceso aséptico', 'Agua y vapor'] },
        { titulo: 'Personas', icono: 'Users', nodos: ['Calificación del vestido', 'Entrenamiento en microbiología', 'Menos intervenciones'] },
      ],
    },
    secciones: [
      {
        titulo: 'El cambio de fondo',
        parrafos: [
          'La Comisión Europea publicó en agosto de 2022 la revisión del Anexo 1 sobre fabricación de medicamentos estériles, adoptada también por PIC/S, con entrada en vigor un año después. La OMS publicó en paralelo su guía de BPM para productos farmacéuticos estériles (TRS 1044, Anexo 2), alineada en contenido. El cambio de fondo es la **estrategia de control de la contaminación (CCS)**: un enfoque global, documentado, que identifica los riesgos de contaminación en toda la planta y muestra cómo cada control contribuye a reducirlos.',
          'La CCS considera, entre otros elementos, el diseño de la planta y de los procesos, los equipos, el personal, los servicios (agua, vapor, gases), las materias primas y componentes, la limpieza y desinfección, el monitoreo, la prevención (incluidas tendencias e investigaciones) y la mejora continua. No es un documento para archivar: se revisa cuando cambia algo y se usa para decidir.',
        ],
      },
      {
        titulo: 'Otros cambios relevantes',
        parrafos: [
          'El anexo aplica la **gestión de riesgos** de ICH Q9 en todo su texto: cada decisión (frecuencia de monitoreo, ubicación de puntos, duración de las simulaciones) debe estar justificada. Promueve las **tecnologías de barrera**, como aisladores y RABS, para reducir la intervención humana en el grado A, y reconoce los sistemas cerrados y de un solo uso.',
          'También detalla la **verificación de integridad del filtro esterilizante** después de su esterilización y antes de usarlo, la **simulación del proceso aséptico** como prueba central del llenado aséptico, la **calificación del personal** (incluido el vestido), el monitoreo continuo de partículas en el grado A y requisitos actualizados para el agua para inyectables y el vapor puro. En Colombia, el manual de estériles de la Resolución 1160 de 2016 es la norma obligatoria; el Anexo 1 y el TRS 1044 son la mejor referencia del estado del arte.',
        ],
      },
    ],
    proceso: {
      titulo: 'Construir una estrategia de control de la contaminación',
      pasos: [
        { titulo: 'Mapear el proceso', detalle: 'Describe el flujo completo: materiales, componentes, personas, aire, agua y producto expuesto.', icono: 'Route', evidencia: 'Diagrama del proceso.' },
        { titulo: 'Identificar fuentes de contaminación', detalle: 'Para cada etapa, identifica cómo pueden entrar microorganismos, endotoxinas o partículas.', icono: 'Search', evidencia: 'Análisis de riesgo.' },
        { titulo: 'Asociar controles', detalle: 'Vincula cada riesgo con sus controles: diseño, procesos validados, procedimientos y monitoreo.', icono: 'Network', evidencia: 'Matriz riesgo–control.' },
        { titulo: 'Definir indicadores', detalle: 'Establece cómo se mide la eficacia: tendencias de monitoreo, simulaciones, desviaciones.', icono: 'LineChart', evidencia: 'Indicadores de la CCS.' },
        { titulo: 'Revisar y mejorar', detalle: 'Revisa la estrategia periódicamente y ante cambios, y documenta las mejoras.', icono: 'RefreshCw', evidencia: 'Revisión periódica de la CCS.' },
      ],
    },
    caso: {
      titulo: 'Una CCS de 200 páginas',
      contexto: 'Una planta presenta su estrategia de control de la contaminación: un compendio de 200 páginas que copia los procedimientos existentes, sin análisis de riesgos ni relación entre controles.',
      pregunta: '¿Cumple el propósito de la CCS?',
      opciones: [
        { texto: 'Sí, porque incluye todos los controles de la planta.', correcta: false, retro: 'Reunir documentos no es una estrategia: falta mostrar qué riesgos existen y cómo cada control los reduce.' },
        { texto: 'No: la CCS debe identificar los riesgos de contaminación, mostrar cómo se relacionan los controles con esos riesgos y cómo se evalúa su eficacia.', correcta: true, retro: 'La CCS es un análisis integrado que sirve para decidir, no un índice de procedimientos.' },
        { texto: 'Sí, si la firma la gerencia.', correcta: false, retro: 'La firma no reemplaza el contenido técnico que exige el anexo.' },
      ],
    },
    errores: [
      { error: 'Hacer la CCS como un compendio de procedimientos.', correccion: 'Construye un análisis de riesgos que conecte cada fuente de contaminación con sus controles y su eficacia.' },
      { error: 'Seguir dependiendo de intervenciones manuales en grado A.', correccion: 'Evalúa tecnologías de barrera y reduce y estandariza las intervenciones.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la CCS?', respuesta: 'La estrategia de control de la contaminación: un enfoque global que identifica riesgos y muestra cómo los controles los reducen y cómo se evalúa su eficacia.' },
      { pregunta: '¿Qué guía de la OMS se alinea con el Anexo 1 de 2022?', respuesta: 'El TRS 1044, Anexo 2, sobre BPM para productos farmacéuticos estériles.' },
      { pregunta: '¿Qué es PUPSIT?', respuesta: 'La verificación de integridad del filtro esterilizante después de esterilizarlo y antes de usarlo.' },
    ],
    resumen: [
      'El Anexo 1 de 2022 pide una **estrategia de control de la contaminación**.',
      'Aplica la **gestión de riesgos** en todo el texto.',
      'Promueve **barreras**, menos intervenciones y procesos verificados.',
    ],
    referencias: [REF.euAnexo1, REF.trs1044a2, REF.ichQ9, REF.res1160],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Rompecabezas ilustrado de una CCS: piezas de diseño, personal, agua, limpieza y monitoreo que encajan alrededor de un vial.', alt: 'Estrategia de control de la contaminación como piezas que encajan' },
    ],
    keywords: ['anexo 1 2022 cambios', 'estrategia de control de la contaminación ccs', 'anexo 1 gmp estériles en español', 'trs 1044 anexo 2', 'pupsit integridad de filtros', 'aisladores y rabs', 'contamination control strategy'],
  },

  {
    titulo: 'Grados A-D, monitoreo ambiental y estrategia de control de la contaminación (CCS)',
    duracion: 30,
    gancho: {
      titulo: 'Cinco colonias que cuentan una historia',
      texto: 'Durante seis meses, las placas de contacto de los guantes en el grado A dieron cero. Luego empezaron a aparecer colonias aisladas, siempre en el turno de la noche y siempre con el mismo tipo de microorganismo de la piel. Ningún resultado superó por sí solo el límite de acción, pero la tendencia contaba algo: una práctica de trabajo había cambiado. El monitoreo ambiental no es un archivo de resultados; es un sistema de alerta temprana.',
    },
    objetivos: [
      'Relacionar cada grado con las operaciones que se hacen en él.',
      'Describir los métodos de monitoreo de partículas y microorganismos.',
      'Interpretar resultados y tendencias dentro de la estrategia de control de la contaminación.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'Grado A', definicion: 'Zona de operaciones de alto riesgo, como el llenado aséptico. ISO 5 en reposo y en operación, y se espera que no haya crecimiento microbiano.' },
      { icono: 'Wind', termino: 'Monitoreo de partículas', definicion: 'Conteo de partículas en el aire. En el grado A se exige monitoreo continuo durante las operaciones críticas.' },
      { icono: 'Microscope', termino: 'Monitoreo microbiológico', definicion: 'Muestreo activo de aire, placas de sedimentación, placas de contacto en superficies e impresiones de guantes del personal.' },
      { icono: 'LineChart', termino: 'Tendencias', definicion: 'Análisis de los resultados en el tiempo para detectar cambios aunque cada resultado esté dentro del límite.' },
      { icono: 'Bug', termino: 'Identificación microbiana', definicion: 'Identificar los microorganismos encontrados para entender su origen: piel, ambiente, agua o materiales.' },
    ],
    mapa: {
      centro: 'Monitoreo ambiental en estériles',
      ramas: [
        { titulo: 'Grados', icono: 'Layers', nodos: ['A: llenado aséptico', 'B: entorno del grado A', 'C y D: etapas menos críticas'] },
        { titulo: 'Partículas', icono: 'Wind', nodos: ['Continuo en grado A', 'Frecuencia por riesgo en otros grados', 'Alertas en tiempo real'] },
        { titulo: 'Microbiología', icono: 'Microscope', nodos: ['Aire activo y sedimentación', 'Contacto en superficies', 'Guantes y vestimenta'] },
        { titulo: 'Gestión', icono: 'LineChart', nodos: ['Límites de alerta y acción', 'Tendencias', 'Investigación e identificación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué se hace en cada grado y qué se espera',
        parrafos: [
          'El **grado A** es la zona donde el producto o los componentes estériles están expuestos, como el punto de llenado. El **grado B** es el entorno del grado A en el procesamiento aséptico. Los **grados C y D** alojan etapas menos críticas, como la preparación de soluciones que luego se filtran o la manipulación de componentes antes de su esterilización. En esterilización terminal, la preparación y el llenado se hacen normalmente en grado C, o en grado A con entorno C cuando el riesgo es mayor.',
          'El Anexo 1 de 2022 fija límites microbiológicos de acción por grado. Para el grado A se espera **ausencia de crecimiento**: cualquier hallazgo se investiga. Para el grado B, los límites son de 5 UFC por metro cúbico de aire, 5 UFC en placas de sedimentación (4 horas) y 5 UFC por placa de contacto; para el grado C, 100, 50 y 25 respectivamente; y para el grado D, 200, 100 y 50. Para los guantes en grado A no se espera crecimiento, y en grado B el límite es de 5 UFC por guante.',
        ],
      },
      {
        titulo: 'Del dato a la decisión',
        parrafos: [
          'El programa de monitoreo define puntos, frecuencias y métodos con base en riesgo, y se integra en la **estrategia de control de la contaminación**. Además de los límites de acción, cada planta fija **límites de alerta** con sus datos históricos, para reaccionar antes de que el problema llegue al límite.',
          'Los resultados se analizan en **tendencias**: por punto, por turno, por persona, por tipo de microorganismo. Un aumento sostenido, la recurrencia de un mismo microorganismo o un cambio en el tipo de flora son señales tan importantes como un resultado aislado alto. Por eso se **identifican** los microorganismos: un estafilococo de la piel apunta al personal; un formador de esporas, al ambiente o a materiales; una bacteria gramnegativa, al agua. La investigación busca la causa y su impacto en los lotes, y la CCS se actualiza con lo aprendido.',
        ],
      },
    ],
    proceso: {
      titulo: 'Respuesta a un hallazgo microbiano en grado A',
      pasos: [
        { titulo: 'Registrar y escalar', detalle: 'Registra el punto, el método, el turno y el resultado, y notifica de inmediato a calidad.', icono: 'AlertTriangle', evidencia: 'Registro del hallazgo.' },
        { titulo: 'Identificar el microorganismo', detalle: 'Identifica el aislado para orientar la búsqueda del origen.', icono: 'Microscope', evidencia: 'Informe de identificación.' },
        { titulo: 'Revisar el contexto', detalle: 'Revisa intervenciones, personal, limpieza, presiones, partículas y desviaciones de ese turno.', icono: 'Search', evidencia: 'Revisión documentada.' },
        { titulo: 'Buscar tendencias', detalle: 'Compara con los resultados históricos del punto, del turno y de las personas.', icono: 'LineChart', evidencia: 'Análisis de tendencias.' },
        { titulo: 'Evaluar el impacto', detalle: 'Evalúa el riesgo para los lotes llenados en ese periodo y decide con calidad.', icono: 'FileSearch', evidencia: 'Evaluación de impacto.' },
        { titulo: 'Corregir y prevenir', detalle: 'Define acciones (reentrenamiento, cambios de práctica, limpieza) y actualiza la CCS.', icono: 'CheckCircle2', evidencia: 'CAPA y CCS actualizada.' },
      ],
    },
    caso: {
      titulo: 'La tendencia del turno de la noche',
      contexto: 'En las impresiones de guantes del grado A aparecen colonias aisladas, siempre en el turno de la noche, con un microorganismo típico de la piel. Ningún resultado individual supera el límite de alerta del grado B.',
      pregunta: '¿Qué haces?',
      opciones: [
        { texto: 'Nada: ningún resultado supera los límites.', correcta: false, retro: 'En grado A no se espera crecimiento, y la tendencia por turno revela un problema de práctica.' },
        { texto: 'Investigar la tendencia: observar la técnica aséptica y el vestido del turno de la noche, revisar intervenciones y entrenamiento, evaluar el impacto en lotes y reforzar las prácticas.', correcta: true, retro: 'La tendencia y el tipo de microorganismo apuntan al personal. Actuar ahora evita una contaminación mayor.' },
        { texto: 'Aumentar la desinfección de las superficies.', correcta: false, retro: 'El microorganismo y el patrón apuntan a los guantes y a la técnica, no a las superficies.' },
      ],
    },
    errores: [
      { error: 'Analizar solo si cada resultado cumple.', correccion: 'Analiza tendencias por punto, turno, persona y microorganismo.' },
      { error: 'No identificar los microorganismos.', correccion: 'Identifícalos para entender el origen de la contaminación.' },
      { error: 'Monitoreo sin conexión con la CCS.', correccion: 'Integra el programa de monitoreo en la estrategia y actualízala con lo aprendido.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se espera en el monitoreo microbiológico del grado A?', respuesta: 'Ausencia de crecimiento; cualquier hallazgo se investiga.' },
      { pregunta: '¿Cuál es el límite de acción para aire activo en grado B según el Anexo 1 de 2022?', respuesta: '5 UFC por metro cúbico.' },
      { pregunta: '¿Por qué se identifican los microorganismos?', respuesta: 'Para orientar la búsqueda del origen: personal, ambiente, agua o materiales.' },
    ],
    resumen: [
      'Cada grado aloja **operaciones con un riesgo** distinto.',
      'Se monitorean **partículas y microorganismos**; en grado A no se espera crecimiento.',
      'Las **tendencias** y la identificación microbiana alimentan la **CCS**.',
    ],
    referencias: [REF.euAnexo1, REF.trs1044a2, REF.res1160],
    imagenes: [
      { ubicacion: 'En la sección de límites', descripcion: 'Tabla visual de cuatro grados con iconos de aire, placa de sedimentación, placa de contacto y guante, con sus límites en UFC, en colores de marca.', alt: 'Límites microbiológicos de acción por grado según el Anexo 1 de 2022' },
      { ubicacion: 'En la sección de tendencias', descripcion: 'Gráfico de barras por turno con colonias en el turno de la noche resaltadas en turquesa.', alt: 'Tendencia de hallazgos microbianos por turno' },
    ],
    keywords: ['monitoreo ambiental áreas estériles', 'límites microbiológicos grado a b c d', 'monitoreo de partículas grado a', 'placas de contacto y sedimentación', 'impresiones de guantes', 'monitoreo ambiental anexo 1', 'tendencias de monitoreo ambiental'],
  },

  {
    titulo: 'Llenado aséptico y validación por media fill',
    duracion: 30,
    gancho: {
      titulo: 'Llenar caldo en lugar de producto',
      texto: 'Una vez cada seis meses, la línea de llenado aséptico trabaja como si fabricara un lote normal, con el mismo personal, las mismas intervenciones y la misma duración. Solo cambia una cosa: en lugar del producto, se llena un medio de cultivo. Después, todas las unidades se incuban. Si una sola se enturbia, algo en el proceso permite que entren microorganismos. Así se valida lo que la prueba de esterilidad no puede demostrar.',
    },
    objetivos: [
      'Describir las barreras del llenado aséptico.',
      'Explicar el diseño de una simulación del proceso aséptico (media fill).',
      'Interpretar un resultado fallido y sus consecuencias.',
    ],
    conceptos: [
      { icono: 'Syringe', termino: 'Llenado aséptico', definicion: 'Ensamblaje de producto filtrado estéril, envases y tapones estériles en grado A con entorno B, o en aisladores o RABS, sin esterilización final.' },
      { icono: 'FlaskConical', termino: 'Simulación del proceso aséptico', definicion: 'También llamada media fill: el proceso se ejecuta con medio de cultivo en lugar de producto para demostrar que no introduce contaminación.' },
      { icono: 'Hand', termino: 'Intervenciones', definicion: 'Acciones del personal en la zona crítica, inherentes (como reponer tapones) o correctivas (como retirar un frasco caído). La simulación debe incluir las peores representativas.' },
      { icono: 'Thermometer', termino: 'Incubación', definicion: 'Las unidades se incuban en dos rangos de temperatura (20–25 °C y 30–35 °C) durante un total mínimo de 14 días para favorecer el crecimiento de distintos microorganismos.' },
      { icono: 'XCircle', termino: 'Simulación fallida', definicion: 'El objetivo es cero unidades contaminadas; cualquier unidad positiva se investiga y puede invalidar el proceso.' },
    ],
    mapa: {
      centro: 'Validar el llenado aséptico',
      ramas: [
        { titulo: 'Barreras', icono: 'ShieldCheck', nodos: ['Grado A con entorno B', 'Aisladores o RABS', 'Filtración esterilizante'] },
        { titulo: 'Simulación', icono: 'FlaskConical', nodos: ['Medio de cultivo', 'Peor caso representativo', 'Todas las intervenciones'] },
        { titulo: 'Frecuencia', icono: 'CalendarClock', nodos: ['Inicial: tres simulaciones consecutivas', 'Periódica: dos veces al año', 'Tras cambios significativos'] },
        { titulo: 'Resultado', icono: 'Target', nodos: ['Objetivo: cero contaminadas', 'Investigación de positivos', 'Personal calificado por participación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Las barreras del llenado aséptico',
        parrafos: [
          'En el llenado aséptico no hay un paso final que destruya microorganismos. La solución se esteriliza por **filtración** con un filtro de 0,22 µm cuya integridad se verifica; los envases y tapones se esterilizan y, cuando corresponde, se despirogenizan; y todo se ensambla en **grado A**, con entorno **grado B**, o dentro de un **aislador** o un **RABS** que separa a las personas del producto expuesto.',
          'El factor más crítico es el **personal**. Cada intervención manual en la zona crítica es una oportunidad de contaminación. Por eso las intervenciones se clasifican, se describen en procedimientos, se minimizan y se ensayan en las simulaciones. El personal que trabaja en grado A y B se califica en vestido y técnica aséptica, y participa en simulaciones del proceso.',
        ],
      },
      {
        titulo: 'Cómo se diseña y se evalúa la simulación',
        parrafos: [
          'La **simulación del proceso aséptico** reproduce el proceso real con un medio de cultivo (por ejemplo, caldo de soya tripticaseína) en lugar del producto. Debe representar el peor caso: la duración máxima del llenado, el tamaño de envase más crítico, la velocidad, el número máximo de personas en el área, las intervenciones inherentes y correctivas, los cambios de turno y las condiciones más exigentes. Un volumen de unidades suficiente permite detectar tasas bajas de contaminación.',
          'Según el Anexo 1 de 2022, la validación inicial requiere **tres simulaciones consecutivas** exitosas por proceso y línea, y luego se repiten de forma periódica, **al menos dos veces al año** (aproximadamente cada seis meses) para cada proceso, línea y turno, además de después de cambios significativos. Las unidades llenas se incuban a 20–25 °C y a 30–35 °C, por un total mínimo de 14 días. El objetivo es **cero unidades contaminadas**: cualquier positivo se investiga, se identifica el microorganismo y, según el caso, se considera fallida la simulación, con impacto sobre los lotes fabricados desde la última simulación exitosa.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ejecución de una simulación del proceso aséptico',
      pasos: [
        { titulo: 'Diseñar el peor caso', detalle: 'Define duración, envase, velocidad, personal, intervenciones y condiciones con base en riesgo.', icono: 'Crosshair', evidencia: 'Protocolo aprobado con justificación.' },
        { titulo: 'Preparar el medio', detalle: 'Prepara y esteriliza el medio de cultivo y verifica que promueve el crecimiento.', icono: 'FlaskConical', evidencia: 'Pruebas de promoción de crecimiento.' },
        { titulo: 'Llenar como en rutina', detalle: 'Ejecuta el llenado con el personal y las intervenciones planeadas, registradas en el momento.', icono: 'Syringe', evidencia: 'Registro de llenado e intervenciones.' },
        { titulo: 'Incubar', detalle: 'Incuba todas las unidades íntegras en los dos rangos de temperatura por el tiempo definido.', icono: 'Thermometer', evidencia: 'Registros de incubación.' },
        { titulo: 'Inspeccionar', detalle: 'Personal entrenado inspecciona cada unidad buscando turbidez y concilia las unidades.', icono: 'Search', evidencia: 'Conteo y conciliación de unidades.' },
        { titulo: 'Concluir', detalle: 'Con cero positivos, la simulación es exitosa; ante cualquier positivo, se investiga y se decide.', icono: 'FileCheck', evidencia: 'Informe de la simulación.' },
      ],
    },
    caso: {
      titulo: 'Un vial turbio entre miles',
      contexto: 'En la simulación semestral, una unidad entre varios miles muestra turbidez a los diez días de incubación. El microorganismo identificado es típico de la piel humana.',
      pregunta: '¿Qué implica?',
      opciones: [
        { texto: 'Es una tasa muy baja: la simulación se considera exitosa.', correcta: false, retro: 'El objetivo es cero. Un positivo con un microorganismo de la piel apunta a una falla en la técnica o en las intervenciones.' },
        { texto: 'Investigar la causa (intervenciones, personas, momento del llenado), evaluar el impacto en los lotes fabricados desde la última simulación exitosa y decidir las acciones, incluida la repetición de simulaciones.', correcta: true, retro: 'Un positivo cuestiona la validación del proceso aséptico; la investigación y la evaluación de lotes son obligatorias.' },
        { texto: 'Descartar la unidad porque probablemente se contaminó en la inspección.', correcta: false, retro: 'Descartar sin evidencia es una falla grave; la investigación debe demostrar la causa.' },
      ],
    },
    errores: [
      { error: 'Simulaciones más cortas o con menos intervenciones que la rutina.', correccion: 'Representa el peor caso real: duración, intervenciones y personal.' },
      { error: 'Personal que trabaja en grado A sin haber participado en una simulación.', correccion: 'Califica al personal mediante su participación en simulaciones exitosas.' },
      { error: 'Excluir unidades sin justificación.', correccion: 'Toda exclusión se justifica y se documenta antes de incubar.' },
    ],
    comprueba: [
      { pregunta: '¿Cuántas simulaciones requiere la validación inicial según el Anexo 1 de 2022?', respuesta: 'Tres simulaciones consecutivas exitosas por proceso y línea.' },
      { pregunta: '¿Con qué frecuencia se repiten?', respuesta: 'Al menos dos veces al año para cada proceso, línea y turno, y tras cambios significativos.' },
      { pregunta: '¿A qué temperaturas se incuban las unidades?', respuesta: 'A 20–25 °C y a 30–35 °C, por un total mínimo de 14 días.' },
    ],
    resumen: [
      'El llenado aséptico depende de **barreras y personas**.',
      'La **simulación con medio de cultivo** valida el proceso en su peor caso.',
      'El objetivo es **cero unidades contaminadas**; cualquier positivo se investiga.',
    ],
    referencias: [REF.euAnexo1, REF.trs1044a2, REF.res1160],
    imagenes: [
      { ubicacion: 'En la sección de simulación', descripcion: 'Fila de viales con caldo transparente y uno turbio resaltado con un círculo turquesa, sobre un fondo de línea de llenado estilizada.', alt: 'Unidad contaminada detectada en una simulación del proceso aséptico' },
    ],
    keywords: ['media fill', 'simulación del proceso aséptico', 'validación de llenado aséptico', 'llenado aséptico anexo 1', 'media fill frecuencia', 'incubación media fill 14 días', 'aps aseptic process simulation'],
  },

  {
    titulo: 'Esterilización terminal vs procesamiento aséptico',
    duracion: 25,
    gancho: {
      titulo: 'Dos plantas, dos caminos',
      texto: 'Una planta colombiana de soluciones parenterales de gran volumen esteriliza el cloruro de sodio al 0,9 % en autoclave, ya sellado en su envase final. Otra planta, de oftálmicos estériles, fabrica una solución que no tolera el calor: la filtra y la llena de forma aséptica en un aislador. Las dos fabrican productos estériles, pero sus riesgos y requisitos son muy distintos. Elegir el camino no es cuestión de comodidad.',
    },
    objetivos: [
      'Comparar la esterilización terminal con el procesamiento aséptico.',
      'Explicar por qué se prefiere la esterilización terminal cuando el producto la tolera.',
      'Relacionar cada camino con sus requisitos de validación e inspección.',
    ],
    conceptos: [
      { icono: 'Flame', termino: 'Esterilización terminal', definicion: 'El producto se llena, se sella en su envase final y luego se esteriliza, normalmente con calor húmedo en autoclave. Permite demostrar un nivel de aseguramiento de esterilidad alto y medible.' },
      { icono: 'ShieldCheck', termino: 'SAL', definicion: 'Nivel de aseguramiento de esterilidad: la probabilidad de que una unidad quede no estéril después del proceso. Para esterilización terminal se busca 10⁻⁶ o mejor.' },
      { icono: 'Filter', termino: 'Filtración esterilizante', definicion: 'Paso de la solución por un filtro de 0,22 µm validado, con integridad verificada antes y después del uso.' },
      { icono: 'Box', termino: 'Procesamiento aséptico', definicion: 'Componentes esterilizados por separado y ensamblados en grado A con entorno B, o en aisladores o RABS, sin esterilización final.' },
    ],
    mapa: {
      centro: 'Dos caminos hacia un producto estéril',
      ramas: [
        { titulo: 'Esterilización terminal', icono: 'Flame', nodos: ['Esteriliza en el envase final', 'SAL alto y medible', 'Llenado en grado C (o A con entorno C)'] },
        { titulo: 'Procesamiento aséptico', icono: 'Box', nodos: ['Filtración de 0,22 µm', 'Ensamblaje en grado A/B o aislador', 'Validado con simulaciones'] },
        { titulo: 'Cómo se elige', icono: 'Scale', nodos: ['Estabilidad del producto', 'Tolerancia del envase', 'Justificación documentada'] },
        { titulo: 'Qué se valida', icono: 'ClipboardCheck', nodos: ['Ciclos de esterilización', 'Integridad de filtros', 'Simulación del proceso aséptico'] },
      ],
    },
    secciones: [
      {
        titulo: 'La esterilización terminal',
        parrafos: [
          'El manual de BPM para estériles de la Resolución 1160 de 2016, la guía de la OMS (TRS 1044, Anexo 2) y el Anexo 1 de 2022 diferencian dos caminos. En la **esterilización terminal**, el producto se llena y se sella en su envase final y luego se esteriliza, normalmente con **calor húmedo** en autoclave; también existen el calor seco y, en algunos casos, la radiación. Este método permite demostrar un **nivel de aseguramiento de esterilidad (SAL)** alto y medible, del orden de 10⁻⁶ o mejor, y por eso las normas lo prefieren siempre que el producto y el envase lo resistan.',
          'La preparación y el llenado para esterilización terminal se hacen en áreas de **grado C**, o de grado A con entorno de grado C cuando el riesgo microbiológico es alto. Los ciclos se validan con mapeo de temperatura de cargas reales, termopares en los puntos más fríos e indicadores biológicos, y cada ciclo de rutina se registra y se revisa.',
        ],
      },
      {
        titulo: 'El procesamiento aséptico y cómo elegir',
        parrafos: [
          'En el **procesamiento aséptico**, la solución se filtra por 0,22 µm y los envases y tapones se esterilizan por separado; todo se ensambla en **grado A con entorno B**, o en aisladores o RABS. No hay un paso final que destruya microorganismos, así que la esterilidad depende del diseño de las instalaciones, del personal, del vestido, del monitoreo y de la técnica aséptica. Por eso se exige validar el proceso con **simulaciones con medio de cultivo**, calificar periódicamente al personal, verificar la integridad del filtro y contar con una estrategia de control de la contaminación.',
          'La elección se **justifica con la estabilidad del producto**: muchas proteínas y biológicos no toleran el calor y deben fabricarse de forma aséptica. En la visita de certificación, el INVIMA aplica la guía de inspección para estériles y revisa con especial detalle las simulaciones, el monitoreo ambiental y la calificación del personal de las plantas asépticas.',
        ],
      },
    ],
    proceso: {
      titulo: 'Árbol de decisión del método de esterilización',
      pasos: [
        { titulo: '¿Tolera el calor húmedo en su envase final?', detalle: 'Si el producto y el envase resisten un ciclo de autoclave, se elige la esterilización terminal por calor húmedo.', icono: 'Flame', evidencia: 'Estudios de estabilidad y compatibilidad.' },
        { titulo: '¿Tolera otro método terminal?', detalle: 'Si no tolera el calor húmedo, evalúa calor seco, radiación u otro método terminal validado.', icono: 'Sun', evidencia: 'Evaluación de métodos alternativos.' },
        { titulo: '¿Se puede filtrar?', detalle: 'Si ningún método terminal es viable, evalúa la filtración esterilizante validada.', icono: 'Filter', evidencia: 'Validación del filtro con el producto.' },
        { titulo: 'Procesamiento aséptico', detalle: 'Diseña el llenado aséptico con barreras, personal calificado y simulaciones.', icono: 'Box', evidencia: 'Diseño y validación del proceso aséptico.' },
        { titulo: 'Documentar la justificación', detalle: 'Deja escrito por qué se descartaron los métodos preferidos.', icono: 'FileCheck', evidencia: 'Justificación en el expediente y la CCS.' },
      ],
    },
    caso: {
      titulo: 'Más fácil en aséptico',
      contexto: 'Una empresa propone pasar un inyectable que hoy se esteriliza en autoclave a llenado aséptico, porque así «evita las validaciones de ciclos y gana velocidad».',
      pregunta: '¿Es aceptable?',
      opciones: [
        { texto: 'Sí, si el producto cumple la prueba de esterilidad.', correcta: false, retro: 'La prueba no compensa la pérdida de un SAL alto y medible. El procesamiento aséptico tiene más riesgo.' },
        { texto: 'No: si el producto tolera la esterilización terminal, debe preferirse; cambiar a aséptico solo se justifica por la estabilidad del producto.', correcta: true, retro: 'La elección se basa en el producto, no en la comodidad del fabricante.' },
        { texto: 'Sí, si se hacen simulaciones con medio de cultivo.', correcta: false, retro: 'Las simulaciones validan el proceso aséptico, pero no justifican abandonar un método terminal viable.' },
      ],
    },
    errores: [
      { error: 'Elegir el procesamiento aséptico por comodidad.', correccion: 'Prefiere la esterilización terminal cuando el producto la tolera y justifica cualquier otra elección.' },
      { error: 'Validar ciclos con cargas que no representan la rutina.', correccion: 'Mapea cargas reales y coloca termopares e indicadores en los puntos más difíciles.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué se prefiere la esterilización terminal?', respuesta: 'Porque permite demostrar un nivel de aseguramiento de esterilidad alto y medible.' },
      { pregunta: '¿En qué grado se hace el llenado aséptico?', respuesta: 'En grado A con entorno grado B, o en aisladores o RABS.' },
      { pregunta: '¿Qué justifica elegir el procesamiento aséptico?', respuesta: 'Que el producto no tolera ningún método de esterilización terminal, por ejemplo por su estabilidad.' },
    ],
    resumen: [
      'La **esterilización terminal** es preferida cuando el producto la tolera.',
      'El **procesamiento aséptico** depende de barreras, personas y simulaciones.',
      'La elección se **justifica con el producto**, no con la comodidad.',
    ],
    referencias: [REF.euAnexo1, REF.trs1044a2, REF.res1160],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Comparación en dos columnas: a la izquierda un autoclave con viales sellados; a la derecha un aislador con un brazo de guante y un filtro, en colores de marca.', alt: 'Esterilización terminal frente a procesamiento aséptico' },
    ],
    keywords: ['esterilización terminal vs aséptico', 'procesamiento aséptico', 'esterilización terminal autoclave', 'nivel de aseguramiento de esterilidad sal', 'filtración esterilizante 0,22 micras', 'métodos de esterilización farmacéutica'],
  },
];

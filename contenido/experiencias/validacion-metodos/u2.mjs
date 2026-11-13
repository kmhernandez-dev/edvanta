/** Curso de Validación de Métodos Analíticos · Unidad 2. Parámetros de desempeño del método */
import { REF } from '../referencias.mjs';

const U2 = 'Unidad 2. Parámetros de desempeño del método';

export default [
  {
    titulo: 'Introducción a la unidad',
    unidad: U2,
    duracion: 15,
    gancho: {
      titulo: 'Siete preguntas a un método',
      texto: 'Imagina que el método es un testigo en un juicio. Antes de creerle, el juez pregunta: ¿habla de lo que vio y no de otra cosa?, ¿acierta?, ¿dice lo mismo cada vez?, ¿hasta dónde puede ver?, ¿se confunde si cambian un poco las condiciones? Los parámetros de desempeño son esas preguntas, y esta unidad las recorre una por una.',
    },
    objetivos: [
      'Relacionar cada parámetro de desempeño con la pregunta que responde.',
      'Reconocer cómo se conectan los parámetros entre sí.',
      'Anticipar los estudios típicos de cada parámetro.',
    ],
    conceptos: [
      { icono: 'Crosshair', termino: 'Especificidad', definicion: '¿Mido lo que creo que mido, sin interferencias?' },
      { icono: 'LineChart', termino: 'Respuesta y rango', definicion: '¿Cómo se relaciona la señal con la concentración y entre qué valores confío en el método?' },
      { icono: 'Target', termino: 'Exactitud y precisión', definicion: '¿Me acerco al valor verdadero? ¿Obtengo lo mismo al repetir?' },
      { icono: 'ShieldCheck', termino: 'Límites, robustez e idoneidad', definicion: '¿Cuánto es lo mínimo que veo? ¿Resiste pequeños cambios? ¿Funciona hoy?' },
    ],
    mapa: {
      centro: 'Los parámetros de desempeño',
      ramas: [
        { titulo: 'Medir lo correcto', icono: 'Crosshair', nodos: ['Especificidad', 'Selectividad'] },
        { titulo: 'Medir bien', icono: 'Target', nodos: ['Exactitud', 'Precisión'] },
        { titulo: 'Dónde y cuánto', icono: 'LineChart', nodos: ['Respuesta y rango', 'Límites de detección y cuantificación'] },
        { titulo: 'Siempre', icono: 'ShieldCheck', nodos: ['Robustez', 'Idoneidad del sistema'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo encajan los parámetros',
        parrafos: [
          'Los parámetros no son independientes. La **especificidad** es la base: si el método no mide solo el analito, todos los demás números están contaminados. La **respuesta** y el **rango** definen dónde el método es confiable; la **exactitud** y la **precisión** se demuestran **dentro** de ese rango. Los **límites** de detección y cuantificación marcan el extremo inferior útil para impurezas. La **robustez** dice qué tan sensible es el método a pequeñas variaciones, y la **idoneidad del sistema** verifica en cada corrida que el método sigue funcionando como en la validación.',
          'En cada clase de esta unidad verás qué pregunta responde el parámetro, cómo se diseña el estudio, cómo se calcula y qué criterios son habituales, con ejemplos de métodos por HPLC y UV-Vis. Los criterios numéricos que se mencionan son orientativos: los definitivos se fijan en el protocolo según el propósito del método y la especificación del producto.',
        ],
      },
    ],
    proceso: {
      titulo: 'Orden lógico de los estudios',
      pasos: [
        { titulo: 'Especificidad', detalle: 'Se demuestra primero: sin ella, nada más tiene sentido.', icono: 'Crosshair', evidencia: 'Estudio de especificidad.' },
        { titulo: 'Respuesta y rango', detalle: 'Se establece la relación señal–concentración en el rango de uso.', icono: 'LineChart', evidencia: 'Estudio de respuesta.' },
        { titulo: 'Exactitud', detalle: 'Se demuestra en varios niveles dentro del rango.', icono: 'Target', evidencia: 'Estudio de recuperación.' },
        { titulo: 'Precisión', detalle: 'Repetibilidad y precisión intermedia.', icono: 'Repeat', evidencia: 'Estudio de precisión.' },
        { titulo: 'Límites, robustez e idoneidad', detalle: 'Límites para impurezas, robustez desde el desarrollo y criterios de idoneidad.', icono: 'ShieldCheck', evidencia: 'Estudios complementarios.' },
      ],
    },
    caso: {
      titulo: 'Exactitud perfecta sin especificidad',
      contexto: 'Un informe de validación muestra recuperaciones de 99,5 % a 100,5 %, pero no incluye estudio de especificidad con placebo ni con muestras degradadas.',
      pregunta: '¿Qué tan confiable es la exactitud reportada?',
      opciones: [
        { texto: 'Muy confiable: las recuperaciones son excelentes.', correcta: false, retro: 'Sin especificidad, una interferencia constante podría estar sumando a la señal sin que la recuperación lo muestre.' },
        { texto: 'Insuficiente: sin especificidad demostrada no se sabe si la señal corresponde solo al analito.', correcta: true, retro: 'La especificidad es la base sobre la que se apoyan los demás parámetros.' },
        { texto: 'Confiable si la precisión también es buena.', correcta: false, retro: 'Un método puede ser preciso y estar sesgado por una interferencia.' },
      ],
    },
    errores: [
      { error: 'Validar parámetros como una lista sin orden.', correccion: 'Empieza por especificidad y respuesta; luego exactitud y precisión dentro del rango.' },
      { error: 'Usar criterios genéricos sin pensar en el propósito.', correccion: 'Fija los criterios según el uso del método y la especificación.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué la especificidad es la base?', respuesta: 'Porque si la señal no corresponde solo al analito, los demás parámetros quedan sesgados.' },
      { pregunta: '¿Dónde se demuestran exactitud y precisión?', respuesta: 'Dentro del rango de trabajo del método.' },
    ],
    resumen: [
      'Cada parámetro **responde una pregunta**.',
      'La **especificidad** sostiene a los demás.',
      'Los criterios se fijan **según el propósito**.',
    ],
    referencias: [REF.ichQ2, REF.eurachem, REF.fdaMetodos],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Pirámide ilustrada con la especificidad en la base, luego respuesta y rango, exactitud y precisión, y arriba robustez e idoneidad.', alt: 'Cómo se apoyan entre sí los parámetros de desempeño' },
    ],
    keywords: ['parámetros de desempeño de un método', 'parámetros de validación analítica', 'especificidad exactitud precisión rango', 'características de desempeño ich q2'],
  },

  {
    titulo: 'Especificidad y selectividad',
    unidad: U2,
    duracion: 30,
    gancho: {
      titulo: 'El pico que escondía otro pico',
      texto: 'Un método de valoración por HPLC da resultados estables durante dos años. Un día, en un estudio de estabilidad, aparece una degradación que debería bajar el contenido, pero el resultado no baja. La razón: el producto de degradación eluía exactamente bajo el pico del activo. El método nunca se había retado con muestras degradadas. La especificidad responde la pregunta más básica: ¿estoy midiendo lo que creo que mido?',
    },
    objetivos: [
      'Diseñar un estudio de especificidad con placebo, impurezas y muestras degradadas.',
      'Interpretar resolución y pureza de pico como evidencia de especificidad.',
      'Diferenciar especificidad de selectividad.',
    ],
    conceptos: [
      { icono: 'Crosshair', termino: 'Especificidad', definicion: 'Capacidad de evaluar el analito de forma inequívoca en presencia de componentes que pueden estar: impurezas, productos de degradación, excipientes y matriz.' },
      { icono: 'Layers', termino: 'Selectividad', definicion: 'Término usado a menudo como sinónimo; describe el grado en que el método distingue el analito de otros componentes. Q2(R2) usa especificidad o selectividad.' },
      { icono: 'Activity', termino: 'Resolución', definicion: 'Separación entre dos picos cromatográficos. Una resolución suficiente demuestra que el analito no se superpone con otro componente.' },
      { icono: 'Scan', termino: 'Pureza de pico', definicion: 'Evaluación con detector de arreglo de diodos o espectrometría de masas de que un pico corresponde a un solo componente.' },
    ],
    mapa: {
      centro: 'Demostrar especificidad',
      ramas: [
        { titulo: 'Qué se inyecta', icono: 'TestTube', nodos: ['Blanco y placebo', 'Estándar y muestra', 'Impurezas conocidas', 'Muestras degradadas'] },
        { titulo: 'Qué se mide', icono: 'Activity', nodos: ['Ausencia de interferencias', 'Resolución', 'Pureza de pico'] },
        { titulo: 'Criterios', icono: 'Ruler', nodos: ['Sin señal del placebo en el analito', 'Resolución mínima definida', 'Pico puro'] },
        { titulo: 'Si no hay estándares', icono: 'Search', nodos: ['Comparar con otro método', 'Degradación forzada', 'Espectros'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo se demuestra',
        parrafos: [
          'ICH Q2(R2) define la especificidad o selectividad como la capacidad de evaluar el analito de forma inequívoca en presencia de componentes que pueden estar presentes. En un método cromatográfico se demuestra inyectando el **blanco** (solvente), el **placebo** (todos los excipientes sin el activo), el **estándar**, la **muestra**, las **impurezas** conocidas disponibles y **muestras degradadas** por estrés. Se verifica que el placebo no dé señal en el tiempo de retención del analito y que el analito esté **resuelto** de las impurezas y productos de degradación más cercanos.',
          'En el caso del método de valoración de amlodipino que estudiarás al final del curso, el criterio incluye que no haya interferencias, una **resolución** mínima entre el activo y la impureza más cercana y la **pureza de pico** evaluada con detector de arreglo de diodos. La pureza de pico compara los espectros a lo largo del pico: si cambian, hay algo más eluyendo con el analito.',
        ],
      },
      {
        titulo: 'Degradación forzada y técnicas no separativas',
        parrafos: [
          'Para métodos indicadores de estabilidad, la especificidad se reta con **degradación forzada**: el producto se somete a ácido, base, oxidación, calor y luz para generar los productos de degradación que podrían aparecer en su vida útil (lo verás en detalle en la unidad 4). El caso inicial es el error clásico de no hacerlo.',
          'En técnicas **no separativas**, como la espectrofotometría UV-Vis, la especificidad es limitada: todo lo que absorbe suma. Se demuestra midiendo la contribución del placebo (por ejemplo, que no supere un pequeño porcentaje de la señal del estándar) y revisando el espectro completo. Cuando una técnica no es específica por sí sola, puede combinarse con otra para lograr la especificidad del conjunto.',
        ],
      },
    ],
    proceso: {
      titulo: 'Estudio de especificidad por HPLC',
      pasos: [
        { titulo: 'Inyectar blanco y placebo', detalle: 'Verifica que no haya señal en el tiempo de retención del analito.', icono: 'TestTube', evidencia: 'Cromatogramas de blanco y placebo.' },
        { titulo: 'Inyectar estándar y muestra', detalle: 'Confirma el tiempo de retención y la forma del pico.', icono: 'Activity', evidencia: 'Cromatogramas de estándar y muestra.' },
        { titulo: 'Inyectar impurezas', detalle: 'Inyecta las impurezas disponibles, solas y mezcladas con el activo.', icono: 'Search', evidencia: 'Cromatograma de resolución.' },
        { titulo: 'Inyectar muestras degradadas', detalle: 'Analiza las muestras sometidas a estrés.', icono: 'Flame', evidencia: 'Cromatogramas de degradación.' },
        { titulo: 'Evaluar resolución y pureza', detalle: 'Calcula la resolución y la pureza de pico del analito.', icono: 'Scan', evidencia: 'Resultados de resolución y pureza.' },
        { titulo: 'Concluir', detalle: 'Compara con los criterios del protocolo.', icono: 'CheckCircle2', evidencia: 'Conclusión de especificidad.' },
      ],
    },
    caso: {
      titulo: 'Pureza de pico dudosa',
      contexto: 'En la muestra degradada con oxidación, el pico del activo muestra un índice de pureza fuera del criterio, aunque no aparece ningún pico nuevo separado.',
      pregunta: '¿Qué significa?',
      opciones: [
        { texto: 'Que el método es específico porque no aparecen picos nuevos.', correcta: false, retro: 'La pureza fuera de criterio sugiere que un producto de degradación eluye bajo el pico del activo.' },
        { texto: 'Que probablemente un producto de degradación coeluye con el activo; hay que ajustar las condiciones cromatográficas y demostrar la separación.', correcta: true, retro: 'Es justo el escenario del caso inicial: la coelución invalida la especificidad para estabilidad.' },
        { texto: 'Que hay que repetir la degradación con menos oxidante.', correcta: false, retro: 'Reducir el estrés podría ocultar el problema sin resolverlo.' },
      ],
    },
    errores: [
      { error: 'No incluir muestras degradadas en métodos de estabilidad.', correccion: 'Reta la especificidad con degradación forzada.' },
      { error: 'Usar solo el tiempo de retención como evidencia.', correccion: 'Complementa con resolución y pureza de pico.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se inyecta en un estudio de especificidad?', respuesta: 'Blanco, placebo, estándar, muestra, impurezas conocidas y muestras degradadas.' },
      { pregunta: '¿Qué indica una pureza de pico fuera de criterio?', respuesta: 'Que otro componente puede estar eluyendo con el analito.' },
    ],
    resumen: [
      'La especificidad responde: **¿mido lo que creo que mido?**',
      'Se demuestra con **placebo, impurezas y degradación forzada**.',
      'Resolución y **pureza de pico** son su evidencia.',
    ],
    referencias: [REF.ichQ2, REF.ichQ1B, REF.unalEstabilidad, REF.fdaMetodos],
    imagenes: [
      { ubicacion: 'En la sección de demostración', descripcion: 'Cinco cromatogramas apilados (blanco, placebo, estándar, muestra, degradada) con el tiempo de retención del activo marcado con una línea turquesa.', alt: 'Cromatogramas de un estudio de especificidad' },
    ],
    keywords: ['especificidad validación de métodos', 'selectividad método analítico', 'pureza de pico dad', 'resolución hplc especificidad', 'estudio de especificidad placebo', 'especificidad ich q2'],
  },

  {
    titulo: 'Linealidad (respuesta) y rango',
    unidad: U2,
    duracion: 30,
    gancho: {
      titulo: 'Un r de 0,999 que no bastaba',
      texto: 'Un informe de validación presenta una curva con coeficiente de correlación de 0,9995 y concluye «lineal». Al graficar los residuales, se ve una curva clara: los puntos extremos se desvían siempre en la misma dirección. El coeficiente de correlación alto escondía una respuesta curva. Demostrar la relación señal–concentración exige más que un número.',
    },
    objetivos: [
      'Diseñar un estudio de respuesta con niveles y réplicas adecuados.',
      'Evaluar la linealidad con coeficiente de determinación, residuales e intercepto.',
      'Definir el rango de trabajo según el uso del método.',
    ],
    conceptos: [
      { icono: 'LineChart', termino: 'Respuesta', definicion: 'Relación entre la señal y la concentración. Q2(R2) admite modelos lineales y no lineales justificados.' },
      { icono: 'Sigma', termino: 'Regresión', definicion: 'Ajuste del modelo a los datos para obtener pendiente e intercepto, con sus incertidumbres.' },
      { icono: 'Activity', termino: 'Residuales', definicion: 'Diferencias entre los valores observados y los predichos. Deben distribuirse al azar alrededor de cero.' },
      { icono: 'Ruler', termino: 'Rango', definicion: 'Intervalo entre la menor y la mayor concentración en que el método tiene exactitud, precisión y respuesta adecuadas.' },
    ],
    mapa: {
      centro: 'Respuesta y rango',
      ramas: [
        { titulo: 'Diseño', icono: 'ClipboardList', nodos: ['Al menos 5 niveles', 'Réplicas por nivel', 'Cubrir el rango de uso'] },
        { titulo: 'Evaluación', icono: 'Sigma', nodos: ['Coeficiente de determinación', 'Residuales al azar', 'Intercepto e intervalo'] },
        { titulo: 'Rangos típicos', icono: 'Ruler', nodos: ['Valoración: 80 % a 120 %', 'Disolución: amplio', 'Impurezas: desde el LC'] },
        { titulo: 'Señales de alerta', icono: 'AlertTriangle', nodos: ['Residuales con patrón', 'Intercepto lejos de cero', 'Saturación del detector'] },
      ],
    },
    secciones: [
      {
        titulo: 'Diseñar y evaluar la respuesta',
        parrafos: [
          'Para estudiar la respuesta se preparan soluciones en **al menos cinco niveles** de concentración que cubran el rango de uso, con réplicas, y se ajusta un modelo, normalmente una **regresión lineal** por mínimos cuadrados. Se reportan la pendiente, el intercepto y el **coeficiente de determinación**, pero ningún número solo demuestra la linealidad.',
          'La herramienta más reveladora son los **residuales**: la diferencia entre cada valor observado y el predicho por la recta. Si se distribuyen al azar alrededor de cero, el modelo es adecuado; si muestran un patrón (curvatura, abanico), el modelo no describe bien los datos, como en el caso inicial. También se evalúa el **intercepto**: si su intervalo de confianza incluye el cero, no es estadísticamente distinto de cero, lo que apoya el uso de un solo punto de estándar. La ICH Q2(R2) reconoce además respuestas **no lineales** cuando la técnica lo justifica, con su modelo apropiado.',
        ],
      },
      {
        titulo: 'Definir el rango',
        parrafos: [
          'El **rango** es el intervalo en que el método tiene respuesta, exactitud y precisión adecuadas. Depende del uso. Para una **valoración** de producto terminado suele cubrir al menos del 80 % al 120 % de la concentración de prueba. Para **disolución**, debe cubrir desde valores bajos esperados en los primeros tiempos hasta por encima del 100 % de lo declarado. Para **impurezas**, desde el **límite de cuantificación** hasta por encima del límite de especificación.',
          'Un error frecuente es validar un rango que no cubre el uso real: por ejemplo, un método de valoración que también se usa en estabilidad, donde el contenido puede bajar, o una disolución que reporta puntos al 20 % con un rango validado desde el 50 %. El rango se deriva de la respuesta, la exactitud y la precisión: se declara solo donde se demostraron las tres.',
        ],
      },
    ],
    proceso: {
      titulo: 'Estudio de respuesta para una valoración',
      pasos: [
        { titulo: 'Definir niveles', detalle: 'Por ejemplo, cinco niveles del 80 % al 120 % de la concentración de prueba.', icono: 'ClipboardList', evidencia: 'Diseño en el protocolo.' },
        { titulo: 'Preparar con trazabilidad', detalle: 'Prepara cada nivel con pesadas y diluciones registradas.', icono: 'Beaker', evidencia: 'Registros de preparación.' },
        { titulo: 'Medir con réplicas', detalle: 'Inyecta o mide cada nivel con las réplicas definidas.', icono: 'Repeat', evidencia: 'Datos primarios.' },
        { titulo: 'Ajustar la regresión', detalle: 'Calcula pendiente, intercepto y coeficiente de determinación.', icono: 'Sigma', evidencia: 'Resultados de regresión.' },
        { titulo: 'Graficar residuales', detalle: 'Verifica que se distribuyan al azar alrededor de cero.', icono: 'Activity', evidencia: 'Gráfico de residuales.' },
        { titulo: 'Evaluar el intercepto', detalle: 'Calcula su intervalo de confianza y compáralo con cero.', icono: 'Ruler', evidencia: 'Intervalo del intercepto.' },
      ],
    },
    caso: {
      titulo: 'Residuales con forma de sonrisa',
      contexto: 'Una curva de calibración tiene un coeficiente de determinación de 0,9991, pero los residuales forman una curva: negativos en el centro y positivos en los extremos.',
      pregunta: '¿Qué concluyes?',
      opciones: [
        { texto: 'Es lineal porque el coeficiente supera 0,999.', correcta: false, retro: 'Un coeficiente alto no descarta una curvatura; los residuales la revelan.' },
        { texto: 'La respuesta no es lineal en ese rango: hay que revisar la causa (saturación, preparación), acotar el rango o usar un modelo justificado.', correcta: true, retro: 'Los residuales con patrón muestran que el modelo lineal no describe bien los datos.' },
        { texto: 'Eliminar los puntos extremos para que quede lineal.', correcta: false, retro: 'Eliminar puntos sin justificación es manipular datos; si se reduce el rango, debe declararse.' },
      ],
    },
    errores: [
      { error: 'Concluir linealidad solo con el coeficiente.', correccion: 'Evalúa residuales e intercepto además del coeficiente.' },
      { error: 'Validar un rango que no cubre el uso real.', correccion: 'Define el rango según todos los valores que el método reportará.' },
    ],
    comprueba: [
      { pregunta: '¿Qué muestran los residuales?', respuesta: 'Si el modelo describe bien los datos: deben distribuirse al azar alrededor de cero.' },
      { pregunta: '¿Qué rango suele cubrir una valoración de producto terminado?', respuesta: 'Al menos del 80 % al 120 % de la concentración de prueba.' },
    ],
    resumen: [
      'La respuesta se evalúa con **coeficiente, residuales e intercepto**.',
      'Los **residuales** revelan lo que el coeficiente esconde.',
      'El **rango** cubre todo el uso y se apoya en exactitud y precisión.',
    ],
    referencias: [REF.ichQ2, REF.nistRegresion, REF.eurachem, REF.invimaValidacion],
    imagenes: [
      { ubicacion: 'En la sección de evaluación', descripcion: 'Dos gráficos lado a lado: una recta de calibración y debajo su gráfico de residuales, uno al azar (bien) y otro en forma de curva (mal).', alt: 'Recta de calibración y gráficos de residuales' },
    ],
    keywords: ['linealidad validación de métodos', 'rango de un método analítico', 'gráfico de residuales calibración', 'coeficiente de determinación linealidad', 'intercepto intervalo de confianza', 'respuesta ich q2 r2'],
  },

  {
    titulo: 'Exactitud y recuperación',
    unidad: U2,
    duracion: 25,
    gancho: {
      titulo: 'Preciso pero equivocado',
      texto: 'Un método da 97,1 %, 97,0 %, 97,2 % y 97,1 % para la misma muestra: muy preciso. Pero la muestra se preparó con exactamente el 100 % del activo. El método repite muy bien un valor que está 3 % por debajo de la verdad. La precisión dice si el método repite; la exactitud dice si acierta.',
    },
    objetivos: [
      'Diferenciar exactitud de precisión.',
      'Diseñar un estudio de recuperación sobre placebo cargado.',
      'Evaluar la recuperación con criterios e intervalos de confianza.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'Exactitud', definicion: 'Cercanía entre el valor obtenido y el valor de referencia aceptado como verdadero.' },
      { icono: 'Percent', termino: 'Recuperación', definicion: 'Porcentaje encontrado frente a lo agregado: (encontrado / teórico) × 100.' },
      { icono: 'Beaker', termino: 'Placebo cargado', definicion: 'Placebo al que se agrega una cantidad conocida del activo, para simular la muestra real con un valor verdadero conocido.' },
      { icono: 'Sigma', termino: 'Intervalo de confianza', definicion: 'Rango en el que se espera la media verdadera de la recuperación; debe ser coherente con el criterio.' },
    ],
    mapa: {
      centro: 'Demostrar exactitud',
      ramas: [
        { titulo: 'Cómo', icono: 'Beaker', nodos: ['Placebo cargado', 'Material de referencia', 'Comparación con otro método'] },
        { titulo: 'Diseño', icono: 'ClipboardList', nodos: ['Al menos 3 niveles', '9 determinaciones', 'Cubrir el rango'] },
        { titulo: 'Cálculo', icono: 'Calculator', nodos: ['Recuperación por nivel', 'Media y dispersión', 'Intervalo de confianza'] },
        { titulo: 'Criterios', icono: 'Ruler', nodos: ['Valoración: típicamente 98 a 102 %', 'Impurezas: más amplios', 'Según el propósito'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo se demuestra la exactitud',
        parrafos: [
          'La **exactitud** se demuestra comparando el resultado con un valor verdadero conocido. En productos farmacéuticos, lo más común es el **placebo cargado**: se toman los excipientes de la fórmula y se les agrega una cantidad conocida del activo en varios niveles del rango. Otras opciones son analizar un material de referencia certificado o comparar con un segundo método independiente bien caracterizado.',
          'ICH Q2(R2) indica que la exactitud se evalúe con un mínimo de **nueve determinaciones** sobre un mínimo de **tres niveles** que cubran el rango, por ejemplo tres preparaciones al 80 %, al 100 % y al 120 %. Para cada una se calcula la **recuperación**: lo encontrado dividido por lo agregado, por cien.',
        ],
      },
      {
        titulo: 'Evaluar y fijar criterios',
        parrafos: [
          'Los resultados se resumen por nivel y en conjunto: media de recuperación, dispersión e **intervalo de confianza**. Un criterio típico para una valoración de producto terminado es una recuperación media de 98,0 % a 102,0 %, con valores individuales dentro de un rango definido; para impurezas a niveles bajos, los criterios son más amplios porque la variabilidad es mayor. También puede aplicarse una prueba t para evaluar si la media difiere significativamente de 100 %, aunque la decisión debe considerar si la diferencia es relevante en la práctica.',
          'La exactitud y la precisión se ven juntas: un método puede ser preciso pero sesgado, como en el caso inicial, o exacto en promedio pero muy disperso. La combinación de ambas, a veces llamada **error total**, es lo que determina si el método toma decisiones correctas frente a la especificación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Estudio de exactitud por placebo cargado',
      pasos: [
        { titulo: 'Preparar el placebo', detalle: 'Mezcla los excipientes en la proporción de la fórmula.', icono: 'Beaker', evidencia: 'Registro del placebo.' },
        { titulo: 'Cargar tres niveles', detalle: 'Agrega activo al 80 %, 100 % y 120 %, por triplicado.', icono: 'Layers', evidencia: 'Pesadas registradas.' },
        { titulo: 'Analizar', detalle: 'Analiza las nueve preparaciones con el método.', icono: 'FlaskConical', evidencia: 'Datos primarios.' },
        { titulo: 'Calcular recuperaciones', detalle: 'Calcula encontrado frente a agregado para cada una.', icono: 'Percent', evidencia: 'Tabla de recuperaciones.' },
        { titulo: 'Analizar estadísticamente', detalle: 'Calcula media, dispersión e intervalo de confianza por nivel y global.', icono: 'Sigma', evidencia: 'Análisis estadístico.' },
        { titulo: 'Comparar con criterios', detalle: 'Concluye frente a los criterios del protocolo.', icono: 'CheckCircle2', evidencia: 'Conclusión de exactitud.' },
      ],
    },
    caso: {
      titulo: 'Recuperación baja en el nivel inferior',
      contexto: 'Las recuperaciones al 100 % y al 120 % son de 99,8 % y 100,2 %, pero al 80 % dan 96,5 % en las tres réplicas.',
      pregunta: '¿Qué sugiere?',
      opciones: [
        { texto: 'Que el método es exacto porque el promedio global es cercano a 99 %.', correcta: false, retro: 'El promedio global esconde un sesgo sistemático en el nivel bajo.' },
        { texto: 'Un sesgo en el nivel bajo: revisar la extracción, la adsorción del activo o la respuesta en ese nivel antes de concluir.', correcta: true, retro: 'Un sesgo consistente en un nivel apunta a una causa técnica que debe resolverse o acotar el rango.' },
        { texto: 'Que hay que repetir solo el nivel bajo hasta que cumpla.', correcta: false, retro: 'Repetir sin investigar no resuelve el sesgo.' },
      ],
    },
    errores: [
      { error: 'Evaluar la exactitud solo al 100 %.', correccion: 'Usa al menos tres niveles que cubran el rango.' },
      { error: 'Confundir precisión con exactitud.', correccion: 'Demuestra ambas: un método puede repetir bien un valor equivocado.' },
    ],
    comprueba: [
      { pregunta: '¿Cuántas determinaciones pide ICH Q2(R2) para la exactitud?', respuesta: 'Un mínimo de nueve, sobre al menos tres niveles del rango.' },
      { pregunta: '¿Qué es el placebo cargado?', respuesta: 'Excipientes de la fórmula con una cantidad conocida de activo agregada.' },
    ],
    resumen: [
      'La exactitud responde: **¿acierta el método?**',
      '**Nueve determinaciones en tres niveles**, típicamente con placebo cargado.',
      'Exactitud y precisión juntas definen el **error total**.',
    ],
    referencias: [REF.ichQ2, REF.eurachem, REF.nistComparaciones, REF.fdaMetodos],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Dianas ilustradas: una con impactos agrupados lejos del centro (preciso, no exacto) y otra agrupados en el centro (preciso y exacto).', alt: 'Exactitud frente a precisión' },
    ],
    keywords: ['exactitud validación de métodos', 'recuperación placebo cargado', 'estudio de exactitud ich q2', 'porcentaje de recuperación', 'exactitud vs precisión', 'criterios de exactitud valoración'],
  },

  {
    titulo: 'Precisión: repetibilidad, intermedia y reproducibilidad',
    unidad: U2,
    duracion: 30,
    gancho: {
      titulo: 'El analista estrella',
      texto: 'Un método se validó con un analista muy experimentado, que obtuvo un coeficiente de variación de 0,4 %. Cuando otros analistas empezaron a usarlo en rutina, los resultados del mismo lote variaban más del 2 %. La validación había medido la habilidad de una persona, no el desempeño del método en el laboratorio. La precisión tiene niveles, y cada uno responde una pregunta distinta.',
    },
    objetivos: [
      'Diferenciar repetibilidad, precisión intermedia y reproducibilidad.',
      'Diseñar estudios de precisión con los factores adecuados.',
      'Calcular e interpretar la desviación estándar relativa.',
    ],
    conceptos: [
      { icono: 'Repeat', termino: 'Repetibilidad', definicion: 'Precisión en las mismas condiciones, en un intervalo corto: mismo analista, equipo y día.' },
      { icono: 'Users', termino: 'Precisión intermedia', definicion: 'Precisión dentro del mismo laboratorio variando días, analistas o equipos.' },
      { icono: 'Globe', termino: 'Reproducibilidad', definicion: 'Precisión entre laboratorios, relevante en estudios colaborativos y transferencias.' },
      { icono: 'Percent', termino: 'Desviación estándar relativa', definicion: 'Desviación estándar dividida por la media, por cien. Expresa la dispersión en porcentaje.' },
    ],
    mapa: {
      centro: 'Niveles de precisión',
      ramas: [
        { titulo: 'Repetibilidad', icono: 'Repeat', nodos: ['Mismas condiciones', '9 determinaciones en 3 niveles', 'o 6 al 100 %'] },
        { titulo: 'Intermedia', icono: 'Users', nodos: ['Otro día', 'Otro analista', 'Otro equipo'] },
        { titulo: 'Reproducibilidad', icono: 'Globe', nodos: ['Entre laboratorios', 'Transferencias', 'Estudios colaborativos'] },
        { titulo: 'Evaluación', icono: 'Sigma', nodos: ['Desviación estándar relativa', 'Pruebas F y t', 'ANOVA'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tres niveles, tres preguntas',
        parrafos: [
          'La **repetibilidad** responde: ¿qué tanto varía el método en las mejores condiciones? Se mide con el mismo analista, equipo y día. ICH Q2(R2) indica un mínimo de **nueve determinaciones** que cubran el rango (por ejemplo, tres concentraciones con tres réplicas cada una) o un mínimo de **seis determinaciones al 100 %** de la concentración de prueba. Un criterio típico para una valoración es una desviación estándar relativa no mayor de 2,0 %.',
          'La **precisión intermedia** responde: ¿qué tanto varía en la vida real del laboratorio? Se diseña variando los factores que cambiarán en rutina: **días**, **analistas** y **equipos**. El caso inicial muestra lo que pasa cuando se omite: la validación midió a una persona. La **reproducibilidad**, entre laboratorios, se evalúa en estudios colaborativos o en transferencias.',
        ],
      },
      {
        titulo: 'Cómo se evalúa',
        parrafos: [
          'La medida básica es la **desviación estándar relativa** (o coeficiente de variación): la desviación estándar dividida por la media, por cien. Para la precisión intermedia, además de la dispersión global, interesa saber qué factor contribuye más a la variación. Se pueden comparar dos analistas con una **prueba F** (para varianzas) y una **prueba t** (para medias), o usar un **ANOVA** que separe la variación entre grupos (días o analistas) de la variación dentro de cada grupo. Lo verás en detalle en la unidad 3.',
          'Una buena práctica es diseñar la precisión intermedia de modo que sus datos sirvan para estimar la variación esperada en rutina. Si un analista muestra una variación mucho mayor que los demás, el problema puede ser de entrenamiento, de un paso del método mal descrito o de un equipo, y es mejor descubrirlo en la validación que en un OOS.',
        ],
      },
    ],
    proceso: {
      titulo: 'Diseño de precisión intermedia',
      pasos: [
        { titulo: 'Elegir los factores', detalle: 'Define qué variará: días, analistas y equipos.', icono: 'Settings', evidencia: 'Diseño en el protocolo.' },
        { titulo: 'Usar una muestra homogénea', detalle: 'Prepara un lote homogéneo para todos los análisis.', icono: 'Package', evidencia: 'Identificación de la muestra.' },
        { titulo: 'Analizar con réplicas', detalle: 'Cada combinación de factores analiza con las réplicas definidas.', icono: 'Repeat', evidencia: 'Datos primarios.' },
        { titulo: 'Calcular dispersión', detalle: 'Calcula la desviación estándar relativa global y por grupo.', icono: 'Percent', evidencia: 'Resultados de dispersión.' },
        { titulo: 'Analizar factores', detalle: 'Compara grupos con prueba F y t o ANOVA.', icono: 'Sigma', evidencia: 'Análisis estadístico.' },
        { titulo: 'Concluir', detalle: 'Compara con los criterios y explica cualquier factor dominante.', icono: 'CheckCircle2', evidencia: 'Conclusión de precisión.' },
      ],
    },
    caso: {
      titulo: 'Un analista que varía más',
      contexto: 'En la precisión intermedia, el analista A obtiene una desviación estándar relativa de 0,6 % y el analista B de 2,4 %. Las medias de ambos son similares.',
      pregunta: '¿Qué haces?',
      opciones: [
        { texto: 'Promediar ambos y reportar 1,5 %.', correcta: false, retro: 'El promedio esconde una diferencia de dispersión que puede indicar un problema real.' },
        { texto: 'Comparar las varianzas con una prueba F; si difieren, investigar la causa (entrenamiento, pasos ambiguos del método, equipo) antes de concluir.', correcta: true, retro: 'Una diferencia de dispersión entre analistas revela un punto débil del método o del entrenamiento.' },
        { texto: 'Excluir los datos del analista B.', correcta: false, retro: 'Excluir datos sin causa es manipular la validación.' },
      ],
    },
    errores: [
      { error: 'Llamar precisión intermedia a la repetibilidad.', correccion: 'Varía días, analistas o equipos.' },
      { error: 'Validar solo con el analista más experto.', correccion: 'Incluye a quienes usarán el método en rutina.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo puede evaluarse la repetibilidad según ICH Q2(R2)?', respuesta: 'Con nueve determinaciones en tres niveles o con seis determinaciones al 100 %.' },
      { pregunta: '¿Qué factores se varían en la precisión intermedia?', respuesta: 'Días, analistas y equipos dentro del mismo laboratorio.' },
    ],
    resumen: [
      'Repetibilidad, **precisión intermedia** y reproducibilidad responden preguntas distintas.',
      'La intermedia varía **días, analistas y equipos**.',
      'Se evalúa con **desviación estándar relativa**, pruebas F y t o ANOVA.',
    ],
    referencias: [REF.ichQ2, REF.nistComparaciones, REF.eurachem, REF.invimaValidacion],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Tres círculos concéntricos ilustrados: repetibilidad (un analista), intermedia (varios analistas y días) y reproducibilidad (varios laboratorios).', alt: 'Niveles de precisión de un método analítico' },
    ],
    keywords: ['precisión validación de métodos', 'repetibilidad y precisión intermedia', 'reproducibilidad entre laboratorios', 'coeficiente de variación validación', 'desviación estándar relativa', 'precisión ich q2 r2'],
  },

  {
    titulo: 'Límite de detección y límite de cuantificación',
    unidad: U2,
    duracion: 25,
    gancho: {
      titulo: 'Ver algo no es poder medirlo',
      texto: 'En un cromatograma aparece un pequeño pico a la altura de una impureza. ¿Está o no está? Y si está, ¿cuánto hay? Son dos preguntas distintas. La primera la responde el límite de detección; la segunda, el límite de cuantificación. Para impurezas y residuos de limpieza, conocerlos es la diferencia entre un dato útil y una suposición.',
    },
    objetivos: [
      'Diferenciar el límite de detección del límite de cuantificación.',
      'Calcular los límites por relación señal/ruido y por la curva de calibración.',
      'Confirmar experimentalmente el límite de cuantificación.',
    ],
    conceptos: [
      { icono: 'Search', termino: 'Límite de detección (LD)', definicion: 'La menor cantidad del analito que el método detecta, aunque no necesariamente cuantifique con exactitud.' },
      { icono: 'Ruler', termino: 'Límite de cuantificación (LC)', definicion: 'La menor cantidad que el método cuantifica con exactitud y precisión aceptables.' },
      { icono: 'Activity', termino: 'Señal/ruido', definicion: 'Relación entre la altura del pico y el ruido de la línea base. Valores de 3 y 10 se usan para LD y LC.' },
      { icono: 'Calculator', termino: 'Por la curva', definicion: 'LD = 3,3·σ/S y LC = 10·σ/S, con σ la desviación estándar de la respuesta y S la pendiente.' },
    ],
    mapa: {
      centro: 'Los límites del método',
      ramas: [
        { titulo: 'LD', icono: 'Search', nodos: ['Detectar', 'Señal/ruido ≈ 3', '3,3·σ/S'] },
        { titulo: 'LC', icono: 'Ruler', nodos: ['Cuantificar', 'Señal/ruido ≈ 10', '10·σ/S'] },
        { titulo: 'Confirmación', icono: 'CheckCircle2', nodos: ['Precisión en el LC', 'Exactitud en el LC', 'Por debajo del umbral de reporte'] },
        { titulo: 'Usos', icono: 'Target', nodos: ['Impurezas', 'Pruebas límite', 'Residuos de limpieza'] },
      ],
    },
    secciones: [
      {
        titulo: 'Detectar y cuantificar',
        parrafos: [
          'El **límite de detección (LD)** es la menor cantidad del analito que el método puede detectar, aunque no la cuantifique con exactitud. El **límite de cuantificación (LC)** es la menor cantidad que cuantifica con exactitud y precisión aceptables. Son los parámetros críticos de los métodos de **impurezas**, de las **pruebas límite** y de los métodos de **residuos de limpieza**, donde lo que importa es lo que hay en niveles bajos.',
          'ICH Q2(R2) admite varias formas de estimarlos. Por **relación señal/ruido**, se compara la altura del pico con el ruido de la línea base: se aceptan generalmente relaciones de alrededor de 3 para el LD y de 10 para el LC. Por la **curva de calibración** en la zona baja, se usan las fórmulas LD = 3,3·σ/S y LC = 10·σ/S, donde σ es la desviación estándar de la respuesta (del intercepto o de los residuales) y S es la pendiente. También existe la evaluación visual para métodos no instrumentales.',
        ],
      },
      {
        titulo: 'Confirmar y conectar con el uso',
        parrafos: [
          'Un límite calculado debe **confirmarse**: se preparan muestras al nivel del LC y se demuestra que la precisión y la exactitud son aceptables, por ejemplo con réplicas cuya desviación estándar relativa cumpla un criterio definido para ese nivel. Un LC que solo existe en una fórmula no garantiza que el método cuantifique ahí.',
          'El LC debe ser coherente con el uso. Para impurezas, debe estar **por debajo del umbral de reporte** que viste en ICH Q3A (por ejemplo, 0,05 % para principios activos con dosis de hasta 2 g diarios). Para residuos de limpieza, debe estar por debajo del límite de aceptación calculado con base en la exposición diaria permitida. Si el método no alcanza esos niveles, no sirve para el propósito, aunque sea preciso y exacto en niveles altos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Determinación y confirmación del LC',
      pasos: [
        { titulo: 'Preparar niveles bajos', detalle: 'Prepara soluciones cerca del límite esperado.', icono: 'Beaker', evidencia: 'Registros de preparación.' },
        { titulo: 'Estimar el LC', detalle: 'Usa señal/ruido o la curva en la zona baja.', icono: 'Calculator', evidencia: 'Cálculo de la estimación.' },
        { titulo: 'Preparar réplicas al LC', detalle: 'Prepara varias réplicas a la concentración estimada.', icono: 'Repeat', evidencia: 'Registros de réplicas.' },
        { titulo: 'Confirmar precisión y exactitud', detalle: 'Evalúa la dispersión y la recuperación al LC.', icono: 'Target', evidencia: 'Resultados de confirmación.' },
        { titulo: 'Comparar con el uso', detalle: 'Verifica que el LC esté por debajo del umbral de reporte o del límite de limpieza.', icono: 'Ruler', evidencia: 'Comparación documentada.' },
      ],
    },
    caso: {
      titulo: 'Un LC por encima del umbral de reporte',
      contexto: 'El LC de un método de impurezas resulta 0,08 %. El umbral de reporte de ICH Q3A para el activo es 0,05 %.',
      pregunta: '¿Es apto el método?',
      opciones: [
        { texto: 'Sí, porque el límite de la impureza es 0,5 %.', correcta: false, retro: 'El método debe cuantificar desde el umbral de reporte; con un LC de 0,08 % no puede reportar impurezas entre 0,05 % y 0,08 %.' },
        { texto: 'No para su propósito: hay que mejorar la sensibilidad (inyección, longitud de onda, concentración de muestra) hasta un LC por debajo de 0,05 %.', correcta: true, retro: 'El LC debe ser coherente con el uso del método.' },
        { texto: 'Sí, si se reporta «menor que 0,08 %».', correcta: false, retro: 'Eso no cumple el umbral de reporte de la guía.' },
      ],
    },
    errores: [
      { error: 'Calcular el LC y no confirmarlo.', correccion: 'Confirma precisión y exactitud al nivel del LC.' },
      { error: 'No comparar el LC con el uso.', correccion: 'Verifica que esté por debajo del umbral de reporte o del límite de limpieza.' },
    ],
    comprueba: [
      { pregunta: '¿Qué relaciones señal/ruido se usan para LD y LC?', respuesta: 'Alrededor de 3 para el LD y de 10 para el LC.' },
      { pregunta: '¿Cómo se calculan LD y LC por la curva?', respuesta: 'LD = 3,3·σ/S y LC = 10·σ/S.' },
    ],
    resumen: [
      'El **LD** responde si está; el **LC**, cuánto hay.',
      'Se estiman por **señal/ruido** o por la **curva**, y se **confirman**.',
      'El LC debe ser coherente con el **umbral de reporte** o el límite de limpieza.',
    ],
    referencias: [REF.ichQ2, REF.ichQ3A, REF.eurachem, REF.picsAnexo15],
    imagenes: [
      { ubicacion: 'En la sección de señal/ruido', descripcion: 'Línea base con ruido ilustrada y dos picos pequeños, uno 3 veces el ruido (LD) y otro 10 veces (LC), con etiquetas.', alt: 'Límites de detección y cuantificación por relación señal/ruido' },
    ],
    keywords: ['límite de detección y cuantificación', 'ld y lc validación', 'relación señal ruido ld lc', 'cálculo ld 3.3 sigma s', 'límite de cuantificación impurezas', 'lod loq método analítico'],
  },

  {
    titulo: 'Robustez',
    unidad: U2,
    duracion: 25,
    gancho: {
      titulo: 'Un método que solo funcionaba en un laboratorio',
      texto: 'Un método de HPLC funcionaba perfecto en el laboratorio donde se desarrolló. En la planta que lo recibió, la resolución entre dos picos caía por debajo del criterio en la mitad de las corridas. La diferencia: el pH de la fase móvil se preparaba con un pH-metro distinto y quedaba 0,1 unidades más alto. Nadie había estudiado qué tan sensible era el método al pH. Eso es robustez.',
    },
    objetivos: [
      'Definir la robustez y su lugar en el desarrollo del método.',
      'Seleccionar los factores y rangos a estudiar.',
      'Usar los resultados para fijar límites operativos e idoneidad del sistema.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'Robustez', definicion: 'Capacidad del método de no verse afectado por pequeñas variaciones deliberadas en sus parámetros, como pH, temperatura o composición de la fase móvil.' },
      { icono: 'Settings', termino: 'Factores', definicion: 'Parámetros del método que pueden variar en rutina: pH, proporción de solventes, temperatura de columna, flujo, longitud de onda, marca o lote de columna.' },
      { icono: 'Sigma', termino: 'Diseño de experimentos', definicion: 'Estudio planificado de varios factores a la vez, más eficiente que cambiar uno por uno.' },
      { icono: 'Ruler', termino: 'Límites operativos', definicion: 'Rangos en los que se demostró que el método funciona, que se escriben en el procedimiento.' },
    ],
    mapa: {
      centro: 'Un método robusto',
      ramas: [
        { titulo: 'Cuándo', icono: 'Lightbulb', nodos: ['En el desarrollo', 'Antes de la validación formal', 'ICH Q14 y Q2(R2)'] },
        { titulo: 'Qué factores', icono: 'Settings', nodos: ['pH y composición', 'Temperatura y flujo', 'Columna y longitud de onda'] },
        { titulo: 'Cómo', icono: 'Sigma', nodos: ['Uno por uno', 'Diseño factorial', 'Respuestas críticas'] },
        { titulo: 'Para qué', icono: 'Ruler', nodos: ['Límites operativos', 'Idoneidad del sistema', 'Transferencias seguras'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué es y cuándo se estudia',
        parrafos: [
          'La **robustez** mide la capacidad del método de mantener su desempeño ante pequeñas variaciones deliberadas de sus parámetros. ICH Q2(R2) y Q14 coinciden en que se estudia idealmente durante el **desarrollo**, cuando todavía se puede ajustar el método para hacerlo menos sensible. Si se estudia solo al final, un mal resultado obliga a volver atrás.',
          'Se eligen los **factores** que pueden variar en la rutina y los **rangos** realistas de variación: por ejemplo, el pH de la fase móvil ± 0,2, la proporción de solvente orgánico ± 2 %, la temperatura de columna ± 5 °C, el flujo ± 10 %, la longitud de onda ± 2 nm o columnas de distintos lotes. Se miden las **respuestas** críticas: resolución, factor de cola, tiempo de retención y el resultado cuantitativo.',
        ],
      },
      {
        titulo: 'Cómo se diseña y qué se hace con los resultados',
        parrafos: [
          'Variar un factor a la vez es sencillo, pero no detecta **interacciones** y requiere muchos experimentos. Los **diseños de experimentos** factoriales o de cribado estudian varios factores a la vez con pocos ensayos y estiman sus efectos; los verás en la unidad 3. La presentación del INVIMA sobre validación también aborda la robustez y su evaluación estadística.',
          'Los resultados se convierten en decisiones: los factores que más afectan el resultado se **controlan** con límites estrechos escritos en el método (por ejemplo, «pH 3,0 ± 0,1»), y la **idoneidad del sistema** se diseña para detectar cuando el sistema se acerca al borde, por ejemplo con un criterio de resolución sobre el par de picos más sensible. En el caso inicial, un estudio de robustez habría revelado la sensibilidad al pH y llevado a especificarlo con más precisión.',
        ],
      },
    ],
    proceso: {
      titulo: 'Estudio de robustez de un método HPLC',
      pasos: [
        { titulo: 'Identificar factores', detalle: 'Lista los parámetros que pueden variar en rutina.', icono: 'Settings', evidencia: 'Lista de factores.' },
        { titulo: 'Definir rangos', detalle: 'Fija variaciones realistas para cada factor.', icono: 'Ruler', evidencia: 'Rangos en el protocolo.' },
        { titulo: 'Elegir el diseño', detalle: 'Uno a la vez o diseño factorial de cribado.', icono: 'Sigma', evidencia: 'Matriz de experimentos.' },
        { titulo: 'Ejecutar', detalle: 'Corre cada condición y mide las respuestas críticas.', icono: 'FlaskConical', evidencia: 'Datos primarios.' },
        { titulo: 'Analizar efectos', detalle: 'Identifica qué factores afectan más las respuestas.', icono: 'BarChart3', evidencia: 'Análisis de efectos.' },
        { titulo: 'Fijar controles', detalle: 'Escribe límites operativos y criterios de idoneidad.', icono: 'ShieldCheck', evidencia: 'Método actualizado.' },
      ],
    },
    caso: {
      titulo: 'La resolución sensible al pH',
      contexto: 'El estudio de robustez muestra que la resolución entre el activo y una impureza cae de 2,4 a 1,7 cuando el pH sube 0,2 unidades. Los demás factores no afectan.',
      pregunta: '¿Qué decisión tomas?',
      opciones: [
        { texto: 'Ignorarlo: en el pH nominal la resolución es buena.', correcta: false, retro: 'En rutina el pH varía; el estudio muestra que esa variación puede llevar a perder la separación.' },
        { texto: 'Especificar el pH con un límite más estrecho, describir cómo prepararlo y medirlo, e incluir en la idoneidad un criterio de resolución para ese par de picos.', correcta: true, retro: 'Así el conocimiento de robustez se convierte en controles que protegen cada corrida.' },
        { texto: 'Eliminar la impureza del método.', correcta: false, retro: 'La impureza debe seguir separándose y cuantificándose.' },
      ],
    },
    errores: [
      { error: 'Estudiar la robustez al final de la validación.', correccion: 'Estúdiala en el desarrollo, cuando aún se puede mejorar el método.' },
      { error: 'No traducir los resultados en controles.', correccion: 'Fija límites operativos y criterios de idoneidad con lo aprendido.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la robustez?', respuesta: 'La capacidad del método de no verse afectado por pequeñas variaciones deliberadas de sus parámetros.' },
      { pregunta: '¿Para qué sirven los resultados de robustez?', respuesta: 'Para fijar límites operativos y criterios de idoneidad que protejan cada corrida.' },
    ],
    resumen: [
      'La robustez se estudia **en el desarrollo**.',
      'Se varían factores **realistas** y se miden respuestas críticas.',
      'Los resultados se convierten en **límites e idoneidad**.',
    ],
    referencias: [REF.ichQ14, REF.ichQ2, REF.invimaValidacion, REF.nistComparaciones],
    imagenes: [
      { ubicacion: 'En la sección de factores', descripcion: 'Panel de controles ilustrado con perillas (pH, temperatura, flujo, porcentaje orgánico) y un cromatograma que cambia según la perilla de pH.', alt: 'Factores estudiados en la robustez de un método HPLC' },
    ],
    keywords: ['robustez validación de métodos', 'estudio de robustez hplc', 'robustez ich q2 q14', 'factores de robustez', 'límites operativos método analítico', 'diseño de experimentos robustez'],
  },

  {
    titulo: 'Idoneidad del sistema (system suitability)',
    unidad: U2,
    duracion: 25,
    gancho: {
      titulo: 'La validación fue hace dos años; la corrida es hoy',
      texto: 'Un método se validó hace dos años con una columna nueva. Hoy, esa columna tiene cientos de inyecciones, la lámpara del detector envejeció y la fase móvil se preparó esta mañana. ¿Cómo sabemos que el sistema de hoy funciona como el de la validación? La idoneidad del sistema es la verificación que se hace en cada corrida para responder esa pregunta.',
    },
    objetivos: [
      'Explicar el propósito de la idoneidad del sistema y su diferencia con la validación.',
      'Seleccionar los parámetros de idoneidad según el método.',
      'Actuar correctamente cuando la idoneidad no cumple.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'Idoneidad del sistema', definicion: 'Conjunto de pruebas que se hacen en cada corrida para verificar que el sistema completo (equipo, columna, reactivos, analista) funciona como se requiere.' },
      { icono: 'Activity', termino: 'Resolución y factor de cola', definicion: 'Verifican la separación del par crítico y la simetría de los picos.' },
      { icono: 'Repeat', termino: 'Precisión de inyecciones', definicion: 'Desviación estándar relativa de inyecciones repetidas del estándar.' },
      { icono: 'Search', termino: 'Sensibilidad', definicion: 'Para impurezas, verificación de que el sistema detecta el nivel de reporte, por ejemplo con una solución al límite.' },
    ],
    mapa: {
      centro: 'Cada corrida se demuestra',
      ramas: [
        { titulo: 'Qué verifica', icono: 'Gauge', nodos: ['Separación', 'Precisión', 'Sensibilidad'] },
        { titulo: 'Parámetros', icono: 'Activity', nodos: ['Resolución', 'Factor de cola', 'Platos teóricos', 'Precisión de inyecciones'] },
        { titulo: 'De dónde salen', icono: 'BookOpen', nodos: ['Monografía', 'Desarrollo y robustez', 'Validación'] },
        { titulo: 'Si falla', icono: 'XCircle', nodos: ['La corrida no se usa', 'Se investiga la causa', 'Se repite completa'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué es y qué no es',
        parrafos: [
          'La **idoneidad del sistema** verifica, antes y durante cada corrida, que el sistema completo funciona como se requiere para ese análisis. No reemplaza la validación: la validación demuestra que el **método** es apto; la idoneidad demuestra que el **sistema de hoy** es apto para ejecutarlo. Tampoco reemplaza la calificación del equipo: la idoneidad se apoya en un equipo calificado.',
          'Los parámetros típicos en cromatografía son la **resolución** del par de picos más difícil de separar, el **factor de cola** del pico del analito, el número de **platos teóricos** y la **precisión** de inyecciones repetidas del estándar. Para impurezas se agrega una verificación de **sensibilidad**, como una solución al nivel de reporte con una relación señal/ruido mínima. Los criterios salen de la monografía, del desarrollo, de la robustez y de la validación.',
        ],
      },
      {
        titulo: 'Diseñarla bien y actuar si falla',
        parrafos: [
          'Una idoneidad útil está diseñada para **detectar** los problemas que el estudio de robustez identificó. Si la robustez mostró que el pH afecta la resolución de un par de picos, la idoneidad debe incluir un criterio de resolución para **ese** par. Una idoneidad genérica que siempre pasa no protege nada.',
          'Si la idoneidad **no cumple**, los resultados de esa corrida **no se usan**. Se investiga la causa (columna degradada, fase móvil mal preparada, burbujas, lámpara) y se repite la corrida completa. No se ajusta la integración ni se escogen las inyecciones que cumplen. Un registro de las fallas de idoneidad y sus causas ayuda a mantener los sistemas y a decidir cuándo cambiar una columna.',
        ],
      },
    ],
    proceso: {
      titulo: 'Idoneidad en una corrida de impurezas',
      pasos: [
        { titulo: 'Inyectar la solución de resolución', detalle: 'Verifica la separación del par crítico.', icono: 'Activity', evidencia: 'Cromatograma y resolución.' },
        { titulo: 'Inyectar el estándar repetido', detalle: 'Calcula la precisión de las inyecciones y el factor de cola.', icono: 'Repeat', evidencia: 'Resultados de precisión y cola.' },
        { titulo: 'Inyectar la solución de sensibilidad', detalle: 'Verifica la señal/ruido al nivel de reporte.', icono: 'Search', evidencia: 'Relación señal/ruido.' },
        { titulo: 'Comparar con criterios', detalle: 'Todos los parámetros deben cumplir antes de usar los resultados.', icono: 'Gauge', evidencia: 'Evaluación de idoneidad.' },
        { titulo: 'Controlar durante la secuencia', detalle: 'Inyecta estándares de control intercalados.', icono: 'RefreshCw', evidencia: 'Estándares de control.' },
      ],
    },
    caso: {
      titulo: 'Cuatro de seis inyecciones cumplen',
      contexto: 'La precisión de seis inyecciones del estándar da 2,6 % cuando el criterio es 2,0 %. Si se excluyen dos inyecciones, la precisión da 0,8 %.',
      pregunta: '¿Qué haces?',
      opciones: [
        { texto: 'Excluir las dos inyecciones y continuar.', correcta: false, retro: 'Escoger las inyecciones que cumplen es manipular la idoneidad.' },
        { texto: 'Considerar que la idoneidad no cumple, investigar la causa (inyector, burbujas, solución) y repetir la corrida.', correcta: true, retro: 'La idoneidad se evalúa con todas las inyecciones definidas; si falla, la corrida no se usa.' },
        { texto: 'Inyectar más veces hasta que el promedio baje.', correcta: false, retro: 'Inyectar hasta cumplir es una práctica inaceptable.' },
      ],
    },
    errores: [
      { error: 'Idoneidad genérica que no detecta los problemas reales.', correccion: 'Diseña la idoneidad con lo aprendido en la robustez.' },
      { error: 'Usar resultados de corridas con idoneidad fallida.', correccion: 'No uses los resultados; investiga y repite.' },
    ],
    comprueba: [
      { pregunta: '¿En qué se diferencia la idoneidad de la validación?', respuesta: 'La validación demuestra que el método es apto; la idoneidad, que el sistema de hoy es apto para ejecutarlo.' },
      { pregunta: '¿Qué se hace si la idoneidad no cumple?', respuesta: 'No se usan los resultados, se investiga la causa y se repite la corrida completa.' },
    ],
    resumen: [
      'La idoneidad demuestra que **el sistema de hoy** funciona.',
      'Se diseña con lo aprendido en la **robustez**.',
      'Si falla, **la corrida no se usa**.',
    ],
    referencias: [REF.ichQ2, REF.unamHplc, REF.fdaIntegridad, REF.res3619],
    imagenes: [
      { ubicacion: 'En la sección de parámetros', descripcion: 'Tablero ilustrado con cuatro indicadores (resolución, cola, platos, precisión) en verde turquesa y uno en ámbar señalando una falla.', alt: 'Parámetros de idoneidad del sistema en una corrida' },
    ],
    keywords: ['idoneidad del sistema', 'system suitability hplc', 'parámetros de idoneidad del sistema', 'resolución factor de cola platos teóricos', 'idoneidad del sistema vs validación', 'falla de idoneidad del sistema'],
  },
];

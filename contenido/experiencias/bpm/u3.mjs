/** Curso de BPM · Unidad 3. Producción, contaminación cruzada y materiales */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: el proceso productivo bajo BPM',
    duracion: 15,
    gancho: {
      titulo: 'Un lote es una historia que se debe poder contar',
      texto: 'Seis meses después de vendido, un paciente reporta un sabor extraño en un jarabe. Con el número de lote, la empresa debe poder contar toda la historia: qué materias primas se usaron y de qué proveedores, quién pesó, en qué equipos, con qué controles en proceso, qué desviaciones hubo y quién liberó. Si la historia tiene huecos, no hay forma de saber qué pasó. Esta unidad trata de cómo se fabrica para que esa historia exista.',
    },
    objetivos: [
      'Describir los documentos maestros y de lote que gobiernan la producción.',
      'Reconocer los controles que previenen la contaminación cruzada y las mezclas.',
      'Ubicar los temas de la unidad dentro del flujo de un lote.',
    ],
    conceptos: [
      { icono: 'FileText', termino: 'Fórmula maestra', definicion: 'El documento aprobado que define composición, instrucciones de fabricación, controles en proceso y rendimientos esperados de un producto.' },
      { icono: 'ClipboardList', termino: 'Registro de lote', definicion: 'La copia controlada de las instrucciones que se diligencia durante la fabricación de un lote concreto y cuenta su historia completa.' },
      { icono: 'ShieldCheck', termino: 'Controles en proceso', definicion: 'Mediciones durante la fabricación que permiten ajustar el proceso y asegurar que el producto cumplirá.' },
      { icono: 'Boxes', termino: 'Trazabilidad', definicion: 'La capacidad de seguir cada material y cada operación hacia atrás y hacia adelante a partir del número de lote.' },
    ],
    mapa: {
      centro: 'Fabricar bajo BPM',
      ramas: [
        { titulo: 'Documentos', icono: 'FileText', nodos: ['Fórmula maestra', 'Registro de lote', 'Procedimientos'] },
        { titulo: 'Materiales', icono: 'Package', nodos: ['Recepción y cuarentena', 'Muestreo y liberación', 'Material de envase impreso'] },
        { titulo: 'Controles', icono: 'ShieldCheck', nodos: ['Despeje de línea', 'Controles en proceso', 'Rendimientos y conciliación'] },
        { titulo: 'Riesgos', icono: 'AlertTriangle', nodos: ['Contaminación cruzada', 'Mezclas', 'Productos de alto riesgo'] },
      ],
    },
    secciones: [
      {
        titulo: 'De la fórmula maestra al lote',
        parrafos: [
          'Todo producto tiene una **fórmula maestra** aprobada que coincide con su registro sanitario: lista de materiales y cantidades, equipos, instrucciones paso a paso, controles en proceso con sus límites, rendimientos esperados y precauciones especiales. Para cada lote se emite una **copia controlada** que se convierte en el **registro de lote**, donde cada operación se firma en el momento en que se hace.',
          'Las BPM piden que las operaciones con distintos productos no se hagan simultánea ni consecutivamente en la misma sala si hay riesgo de mezcla o contaminación cruzada, que cada contenedor, equipo y sala esté identificado con el producto y el lote, y que cualquier desviación de las instrucciones se registre y se investigue. En esta unidad recorrerás esos controles: contaminación cruzada, productos de alto riesgo, despeje de línea, rendimientos, registro de lote y manejo de materiales.',
        ],
      },
    ],
    proceso: {
      titulo: 'El recorrido de un lote',
      pasos: [
        { titulo: 'Emitir el registro de lote', detalle: 'Aseguramiento de calidad emite la copia controlada de la fórmula maestra con número de lote.', icono: 'FileText', evidencia: 'Registro emitido y numerado.' },
        { titulo: 'Despachar materiales', detalle: 'El almacén entrega materiales aprobados, pesados y verificados.', icono: 'Package', evidencia: 'Orden de despacho y pesajes verificados.' },
        { titulo: 'Despejar la línea', detalle: 'Producción despeja y una segunda persona verifica antes de iniciar.', icono: 'ClipboardCheck', evidencia: 'Despeje firmado.' },
        { titulo: 'Fabricar y controlar', detalle: 'Se ejecutan las etapas con controles en proceso registrados.', icono: 'Factory', evidencia: 'Registro de lote diligenciado.' },
        { titulo: 'Conciliar', detalle: 'Se calculan rendimientos y se concilia el material impreso.', icono: 'Calculator', evidencia: 'Conciliación dentro de límites.' },
        { titulo: 'Revisar y liberar', detalle: 'Aseguramiento de calidad revisa el registro y la persona autorizada decide.', icono: 'Signature', evidencia: 'Liberación firmada.' },
      ],
    },
    caso: {
      titulo: 'La queja del sabor extraño',
      contexto: 'Llega una queja por sabor extraño en un lote de jarabe vendido hace seis meses. El registro de lote no indica qué tanque se usó para la fabricación.',
      pregunta: '¿Qué revela esta situación?',
      opciones: [
        { texto: 'Nada importante: el tanque no afecta el sabor.', correcta: false, retro: 'Sin saber qué tanque se usó, no puedes revisar su limpieza ni qué producto se fabricó antes en él.' },
        { texto: 'Una falla de trazabilidad: el registro de lote debe identificar los equipos usados; hay que investigar con otras fuentes y corregir la fórmula maestra.', correcta: true, retro: 'El registro de lote debe permitir reconstruir la historia completa, incluidos los equipos y su estado de limpieza.' },
        { texto: 'Basta con analizar la muestra de retención.', correcta: false, retro: 'El análisis ayuda, pero no reemplaza la trazabilidad de equipos para encontrar la causa.' },
      ],
    },
    errores: [
      { error: 'Registros de lote que no identifican equipos ni personas.', correccion: 'Cada operación registra equipo, fecha, hora, resultado y quién la hizo y verificó.' },
      { error: 'Fabricar con una copia no controlada de la fórmula.', correccion: 'Usa solo copias emitidas y numeradas por aseguramiento de calidad.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre la fórmula maestra y el registro de lote?', respuesta: 'La fórmula maestra es el documento aprobado del producto; el registro de lote es la copia controlada que se diligencia para un lote concreto.' },
      { pregunta: '¿Qué es la trazabilidad?', respuesta: 'La capacidad de seguir materiales y operaciones de un lote hacia atrás y hacia adelante.' },
    ],
    resumen: [
      'La **fórmula maestra** define el producto; el **registro de lote** cuenta la historia de cada lote.',
      'La producción se apoya en **despeje, controles en proceso y conciliación**.',
      'Sin trazabilidad no hay investigación posible.',
    ],
    referencias: [REF.trs986a2, REF.res1160],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Línea de tiempo de un lote con iconos de documento, caja, lista de chequeo, fábrica, calculadora y firma, en colores de marca.', alt: 'Recorrido de un lote bajo Buenas Prácticas de Manufactura' },
    ],
    keywords: ['proceso productivo bpm', 'fórmula maestra farmacéutica', 'registro de lote', 'trazabilidad de lotes farmacéuticos', 'producción bajo bpm'],
  },

  {
    titulo: 'Contaminación y contaminación cruzada: fuentes y medidas de control',
    duracion: 25,
    gancho: {
      titulo: 'Cuatro caminos para llegar al producto equivocado',
      texto: 'Un residuo de un analgésico aparece en un antihistamínico. ¿Cómo llegó? Pudo quedar en el equipo (retención), viajar en el aire desde la sala vecina (transferencia aérea), llegar en el guante o el carro de un operario (transferencia mecánica) o ser un error de identificación (mezcla). Cada camino tiene controles distintos. Conocerlos es la base para diseñar una estrategia de prevención.',
    },
    objetivos: [
      'Identificar las cuatro vías de contaminación cruzada.',
      'Asociar cada vía con medidas técnicas y organizativas de control.',
      'Aplicar un enfoque de riesgo basado en la toxicidad del producto.',
    ],
    conceptos: [
      { icono: 'Bug', termino: 'Contaminación', definicion: 'Introducción indeseada de impurezas químicas o microbiológicas, o de materia extraña, en un material o producto.' },
      { icono: 'Shuffle', termino: 'Mezcla', definicion: 'Confusión de materiales, productos o rótulos. Es la vía de contaminación cruzada más grave por la cantidad que puede trasladar.' },
      { icono: 'Wrench', termino: 'Retención', definicion: 'Residuos del producto anterior que quedan en equipos y superficies y pasan al siguiente lote.' },
      { icono: 'Wind', termino: 'Transferencia aérea', definicion: 'Polvo o aerosoles que viajan por el aire entre áreas o dentro de la misma área.' },
      { icono: 'Hand', termino: 'Transferencia mecánica', definicion: 'Residuos que se trasladan con personas, ropa, herramientas, carros o recipientes.' },
    ],
    mapa: {
      centro: 'Vías de contaminación cruzada',
      ramas: [
        { titulo: 'Mezcla', icono: 'Shuffle', nodos: ['Identificación inequívoca', 'Despeje de línea', 'Segregación de productos'] },
        { titulo: 'Retención', icono: 'Wrench', nodos: ['Limpieza validada', 'Equipos dedicados si el riesgo lo exige', 'Tiempos de espera controlados'] },
        { titulo: 'Aire', icono: 'Wind', nodos: ['Presiones y esclusas', 'Extracción localizada', 'Sistemas cerrados'] },
        { titulo: 'Mecánica', icono: 'Hand', nodos: ['Vestimenta por área', 'Herramientas y carros dedicados', 'Flujos sin cruces'] },
      ],
    },
    secciones: [
      {
        titulo: 'Las vías y sus controles',
        parrafos: [
          'La **mezcla** se previene con identificación clara de cada material, contenedor, equipo y sala; con despeje de línea entre lotes; y con la regla de no procesar productos distintos al mismo tiempo en la misma sala cuando hay riesgo. La **retención** se controla con limpieza validada, equipos fáciles de limpiar y, cuando el riesgo lo exige, equipos o instalaciones dedicados.',
          'La **transferencia aérea** se controla con el diseño del HVAC (presiones, esclusas, filtración), con extracción localizada en operaciones que generan polvo y, cada vez más, con **sistemas cerrados** que evitan exponer el producto. La **transferencia mecánica** se controla con vestimenta específica por área, cambio de guantes, herramientas y carros dedicados o limpiados entre áreas, y flujos que no crucen lo limpio con lo sucio.',
        ],
      },
      {
        titulo: 'Un enfoque basado en el riesgo',
        parrafos: [
          'No todos los productos tienen el mismo riesgo. Las guías actuales piden evaluar la contaminación cruzada con base en la **toxicidad** de cada producto, usando límites basados en salud como la exposición diaria permitida (PDE), que viste en el curso de Validaciones. Un producto de alta potencia o sensibilizante exige controles más fuertes que uno de baja toxicidad.',
          'La estrategia de control combina medidas **técnicas** (diseño, aire, sistemas cerrados, equipos dedicados) y **organizativas** (campañas, procedimientos, entrenamiento, verificación de limpieza). Las medidas técnicas son más fiables que las organizativas, porque no dependen de que alguien recuerde hacer algo. Por eso, cuando el riesgo es alto, se prefiere el diseño a la disciplina.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluación de riesgo de contaminación cruzada en un área compartida',
      pasos: [
        { titulo: 'Listar productos y equipos', detalle: 'Identifica qué productos comparten sala, equipos o sistemas de aire.', icono: 'Boxes', evidencia: 'Matriz de productos y equipos.' },
        { titulo: 'Caracterizar el peligro', detalle: 'Reúne la toxicidad y la potencia de cada activo (PDE o equivalente).', icono: 'AlertTriangle', evidencia: 'Fichas toxicológicas.' },
        { titulo: 'Analizar las vías', detalle: 'Evalúa mezcla, retención, aire y transferencia mecánica para cada combinación.', icono: 'Network', evidencia: 'Análisis de riesgo por vía.' },
        { titulo: 'Elegir controles', detalle: 'Prioriza controles técnicos y complementa con organizativos.', icono: 'ShieldCheck', evidencia: 'Plan de controles.' },
        { titulo: 'Verificar eficacia', detalle: 'Demuestra con limpieza validada, monitoreo y verificación que los controles funcionan.', icono: 'ClipboardCheck', evidencia: 'Resultados de verificación.' },
        { titulo: 'Revisar periódicamente', detalle: 'Reevalúa cuando entra un producto nuevo o cambia el proceso.', icono: 'RefreshCw', evidencia: 'Control de cambios y revisión.' },
      ],
    },
    caso: {
      titulo: 'Dos productos, una sala',
      contexto: 'Producción propone granular un producto A y, en la misma sala y al mismo tiempo, mezclar un producto B en otro equipo, para ganar capacidad.',
      pregunta: '¿Qué dice el enfoque de BPM?',
      opciones: [
        { texto: 'Aceptable si los equipos están separados dos metros.', correcta: false, retro: 'El polvo de la granulación viaja por el aire de la sala; la distancia no garantiza la separación.' },
        { texto: 'No procesar simultáneamente productos distintos en la misma sala cuando hay riesgo de contaminación cruzada o mezcla; programar por separado o usar salas o sistemas cerrados.', correcta: true, retro: 'Es una regla básica de las BPM: la simultaneidad multiplica el riesgo aéreo, mecánico y de mezcla.' },
        { texto: 'Aceptable si los operarios cambian de guantes al pasar de un equipo a otro.', correcta: false, retro: 'El cambio de guantes ayuda con la transferencia mecánica, pero no controla el aire ni la mezcla.' },
      ],
    },
    errores: [
      { error: 'Confiar solo en procedimientos para productos de alto riesgo.', correccion: 'Prioriza controles técnicos: diseño, aire, sistemas cerrados o equipos dedicados.' },
      { error: 'Carros y herramientas que circulan entre áreas sin limpieza.', correccion: 'Dedica herramientas por área o limpia y registra antes de trasladarlas.' },
      { error: 'Evaluar el riesgo sin datos toxicológicos.', correccion: 'Usa límites basados en salud para decidir el nivel de control.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son las cuatro vías de contaminación cruzada?', respuesta: 'Mezcla, retención, transferencia aérea y transferencia mecánica.' },
      { pregunta: '¿Por qué se prefieren los controles técnicos?', respuesta: 'Porque no dependen de que una persona recuerde ejecutar algo correctamente cada vez.' },
    ],
    resumen: [
      'Cuatro vías: **mezcla, retención, aire y transferencia mecánica**.',
      'Cada vía tiene **controles propios**.',
      'El nivel de control depende de la **toxicidad**; se prefieren controles técnicos.',
    ],
    referencias: [REF.trs986a2, REF.picsParte1, REF.picsAnexo15, REF.ichQ9],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Cuatro flechas ilustradas que convergen en un comprimido, cada una con un icono (etiqueta, equipo, nube de aire, guante) y su color de marca.', alt: 'Las cuatro vías de la contaminación cruzada' },
    ],
    keywords: ['contaminación cruzada farmacéutica', 'vías de contaminación cruzada', 'cómo evitar la contaminación cruzada en bpm', 'contaminación cruzada bpm', 'mix up farmacéutico', 'control de contaminación en producción'],
  },

  {
    titulo: 'Áreas y productos de alto riesgo: betalactámicos, hormonas y citostáticos',
    duracion: 25,
    gancho: {
      titulo: 'Microgramos que importan',
      texto: 'Para la mayoría de los medicamentos, unos microgramos de residuo en otro producto no tienen efecto. Para una penicilina, pueden desencadenar una reacción anafiláctica en un paciente sensible. Para una hormona o un citostático, pueden tener efectos biológicos con exposiciones muy bajas y, además, ponen en riesgo al operario. Estos productos cambian las reglas: la limpieza ya no basta y el diseño pasa a ser la protección principal.',
    },
    objetivos: [
      'Explicar por qué ciertos productos exigen instalaciones exclusivas o segregadas.',
      'Describir los controles de contención para proteger el producto y al personal.',
      'Relacionar estos requisitos con la Resolución 3028 de 2008 y la evaluación de riesgo.',
    ],
    conceptos: [
      { icono: 'Biohazard', termino: 'Betalactámicos', definicion: 'Penicilinas y cefalosporinas. Su poder sensibilizante obliga a fabricarlos en instalaciones exclusivas y separadas, con sistemas de aire independientes.' },
      { icono: 'Atom', termino: 'Alta potencia', definicion: 'Activos con efectos a dosis muy bajas, como algunas hormonas o citostáticos, que requieren contención y, según el riesgo, áreas o equipos dedicados.' },
      { icono: 'Lock', termino: 'Contención', definicion: 'Conjunto de barreras técnicas que mantienen el activo dentro de su área: presión negativa, esclusas, sistemas cerrados, aisladores y extracción.' },
      { icono: 'HardHat', termino: 'Protección del operario', definicion: 'Equipos de protección y controles de ingeniería para que el personal no se exponga a activos peligrosos.' },
    ],
    mapa: {
      centro: 'Productos que cambian las reglas',
      ramas: [
        { titulo: 'Sensibilizantes', icono: 'Biohazard', nodos: ['Penicilinas', 'Cefalosporinas', 'Instalaciones exclusivas'] },
        { titulo: 'Alta potencia', icono: 'Atom', nodos: ['Algunas hormonas', 'Citostáticos', 'Contención por riesgo'] },
        { titulo: 'Controles', icono: 'Lock', nodos: ['Aire independiente', 'Presión negativa o esclusas sumidero', 'Sistemas cerrados'] },
        { titulo: 'Personas', icono: 'HardHat', nodos: ['Protección respiratoria', 'Duchas o descontaminación', 'Vigilancia de salud'] },
      ],
    },
    secciones: [
      {
        titulo: 'Segregación por diseño',
        parrafos: [
          'Las BPM de la OMS y la Resolución 3028 de 2008 en Colombia piden que la producción de ciertos productos se haga en áreas especiales. Los **betalactámicos** son el caso más claro: su capacidad de sensibilización obliga a instalaciones exclusivas y separadas del resto de la producción, con sistemas de tratamiento de aire independientes, de modo que ni el aire ni el personal ni los materiales crucen hacia otras áreas sin control. Las penicilinas y las cefalosporinas, además, suelen manejarse separadas entre sí.',
          'Para otros productos de alto riesgo, como ciertas **hormonas** y **citostáticos**, la decisión sobre áreas dedicadas o compartidas se basa en una evaluación de riesgo que considera la toxicidad (por ejemplo, con límites basados en salud), la capacidad de limpiar a niveles seguros y la posibilidad de contener el producto. Si no es posible demostrar que la limpieza alcanza niveles seguros o que el riesgo está controlado, se exigen instalaciones dedicadas.',
        ],
      },
      {
        titulo: 'Contención y protección',
        parrafos: [
          'La contención combina varias barreras: salas con presión negativa respecto a su entorno o esclusas que funcionan como sumidero, extracción localizada en los puntos de generación de polvo, aire de un solo paso o filtración que impida recircular el activo, **sistemas cerrados** de transferencia y, para las operaciones más críticas, aisladores. Los residuos y la ropa contaminada se manejan como peligrosos.',
          'La protección del operario es parte del diseño: controles de ingeniería primero y equipos de protección personal como complemento, entrenamiento específico y, según el producto, vigilancia de la salud del personal expuesto. Proteger al trabajador y proteger al producto suelen ir en la misma dirección.',
        ],
      },
    ],
    proceso: {
      titulo: 'Decisión sobre fabricar un producto de alto riesgo',
      pasos: [
        { titulo: 'Clasificar el peligro', detalle: 'Determina si es sensibilizante, de alta potencia o tóxico, con datos toxicológicos.', icono: 'AlertTriangle', evidencia: 'Evaluación toxicológica.' },
        { titulo: 'Revisar la norma', detalle: 'Verifica si la Resolución 3028 de 2008 o las BPM exigen área especial o exclusiva.', icono: 'Landmark', evidencia: 'Análisis normativo.' },
        { titulo: 'Evaluar la contención', detalle: 'Analiza si las instalaciones y equipos pueden contener el producto y limpiarse a niveles seguros.', icono: 'Lock', evidencia: 'Evaluación de riesgo de contención.' },
        { titulo: 'Decidir dedicado o compartido', detalle: 'Si no se demuestra control suficiente, el producto va a instalaciones dedicadas.', icono: 'GitBranch', evidencia: 'Decisión documentada.' },
        { titulo: 'Proteger al personal', detalle: 'Define controles de ingeniería, protección personal, entrenamiento y vigilancia de salud.', icono: 'HardHat', evidencia: 'Plan de seguridad ocupacional.' },
      ],
    },
    caso: {
      titulo: 'Una hormona en la línea de sólidos',
      contexto: 'Un cliente pide fabricar un anticonceptivo oral en una línea de sólidos compartida. La limpieza de la línea está validada con un criterio de 10 ppm.',
      pregunta: '¿Qué falta para decidir?',
      opciones: [
        { texto: 'Nada: si la limpieza está validada a 10 ppm, se puede fabricar.', correcta: false, retro: 'Un criterio general de 10 ppm puede ser insuficiente para un activo de alta potencia; el límite debe salir de su toxicidad.' },
        { texto: 'Calcular el límite basado en salud del activo, verificar si la limpieza lo alcanza con un método sensible, evaluar la contención del polvo y la protección del personal, y decidir si se requiere área dedicada.', correcta: true, retro: 'Así se decide con datos: toxicidad, limpieza, contención y personas.' },
        { texto: 'Fabricarlo en campaña al final del mes.', correcta: false, retro: 'Las campañas ayudan a organizar, pero no resuelven por sí solas el riesgo de un activo potente.' },
      ],
    },
    errores: [
      { error: 'Fabricar betalactámicos en áreas generales con limpieza reforzada.', correccion: 'Los betalactámicos exigen instalaciones exclusivas y separadas.' },
      { error: 'Usar criterios genéricos de limpieza para activos potentes.', correccion: 'Calcula límites basados en salud para cada activo de alto riesgo.' },
      { error: 'Proteger al operario solo con equipo personal.', correccion: 'Primero controles de ingeniería; el equipo personal complementa.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué los betalactámicos requieren instalaciones exclusivas?', respuesta: 'Porque su poder sensibilizante puede causar reacciones graves con trazas mínimas en otros productos.' },
      { pregunta: '¿Qué decide si una hormona puede fabricarse en un área compartida?', respuesta: 'Una evaluación de riesgo basada en su toxicidad, la capacidad de limpieza a niveles seguros y la contención.' },
    ],
    resumen: [
      'Los **betalactámicos** van en instalaciones exclusivas.',
      'Para hormonas y citostáticos, **el riesgo decide** entre dedicado y compartido.',
      'Contención y protección del personal **se diseñan** desde el inicio.',
    ],
    referencias: [REF.res3028, REF.trs986a2, REF.picsParte1, REF.ichQ9],
    imagenes: [
      { ubicacion: 'En la sección de contención', descripcion: 'Corte de una sala de alta potencia con presión negativa, esclusa sumidero, extracción localizada y un aislador, con flechas de aire hacia adentro.', alt: 'Sala de contención para productos de alta potencia' },
    ],
    keywords: ['betalactámicos área exclusiva', 'productos de alta potencia farmacéutica', 'citostáticos fabricación bpm', 'hormonas contención farmacéutica', 'áreas de alto riesgo bpm', 'contención de polvos potentes', 'penicilinas y cefalosporinas instalaciones separadas'],
  },

  {
    titulo: 'Despeje de línea',
    duracion: 25,
    gancho: {
      titulo: 'Dos plegadizas atrapadas en el alimentador',
      texto: 'En una planta de sólidos en Bogotá se empacan en la misma blistera dos concentraciones de losartán: 50 mg y 100 mg. Al terminar el lote de 50 mg, el operario retira el material impreso y el auditor de calidad revisa la línea con su lista de chequeo. Encuentra dos plegadizas de 50 mg atrapadas en el alimentador. Si no las hubiera encontrado, podían terminar en cajas de 100 mg. Eso es exactamente lo que el despeje de línea existe para evitar.',
    },
    objetivos: [
      'Ejecutar un despeje de línea completo entre lotes y productos.',
      'Identificar los puntos ocultos donde se esconden materiales del lote anterior.',
      'Documentar el despeje con verificación independiente en el registro de lote.',
    ],
    conceptos: [
      { icono: 'ClipboardCheck', termino: 'Despeje de línea', definicion: 'Verificación documentada de que el área, el equipo o la línea está libre de materiales, producto, documentos y rótulos del lote anterior antes de iniciar uno nuevo.' },
      { icono: 'Search', termino: 'Puntos ocultos', definicion: 'Tolvas, guías, alimentadores, cajas de rechazo, cintas, pisos bajo la máquina: donde suelen quedar unidades o material impreso.' },
      { icono: 'UserCheck', termino: 'Verificación independiente', definicion: 'Una segunda persona, normalmente de aseguramiento de calidad, confirma el despeje que hizo producción y firma en el registro de lote.' },
      { icono: 'Tag', termino: 'Identificación de la línea', definicion: 'Rótulo con el producto, la concentración y el lote que inicia, visible en la línea después del despeje.' },
    ],
    mapa: {
      centro: 'Un despeje que funciona',
      ramas: [
        { titulo: 'Qué se retira', icono: 'Trash2', nodos: ['Granel y producto terminado', 'Material impreso sobrante', 'Muestras y rechazos'] },
        { titulo: 'Qué se revisa', icono: 'Search', nodos: ['Limpieza y rótulo de estado', 'Documentos y rótulos', 'Puntos ocultos'] },
        { titulo: 'Quién', icono: 'UserCheck', nodos: ['Producción ejecuta', 'Calidad verifica', 'Ambos firman'] },
        { titulo: 'Con qué', icono: 'ClipboardList', nodos: ['Lista de chequeo por línea', 'Registro de lote', 'Conciliación del material impreso'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué exige y por qué',
        parrafos: [
          'Los manuales de BPM adoptados por la Resolución 1160 de 2016, basados en los informes técnicos de la OMS, exigen que antes de cualquier operación de fabricación o envasado se compruebe que el área y los equipos estén limpios y libres de materiales, productos y documentos que no se requieran para la operación planificada, y que esa comprobación quede registrada. Las **mezclas** siguen siendo una de las causas más frecuentes de retiros del mercado, sobre todo en acondicionamiento, donde conviven blísteres, plegadizas, insertos y etiquetas muy parecidos.',
          'Un despeje robusto incluye seis elementos: retirar todo el material del lote anterior (granel, producto terminado, material de envase impreso sobrante, muestras y rechazos) con su conciliación; retirar documentos y rótulos del lote anterior; verificar el estado de limpieza del área y los equipos según el procedimiento y el rótulo de estado; revisar los **puntos ocultos**; identificar la línea con el producto, la concentración y el lote que inicia; y obtener la **doble verificación**, con firma y fecha en el registro de lote.',
        ],
      },
      {
        titulo: 'Listas de chequeo específicas y lo que mira el inspector',
        parrafos: [
          'La mejor defensa contra las mezclas es una **lista de chequeo específica para cada línea o equipo**, que nombre sus puntos ocultos reales: «revisar el alimentador de plegadizas», «vaciar la caja de rechazos de la cámara de visión», «revisar debajo de la cinta transportadora». Una lista genérica («verificar que la línea esté despejada») invita a revisar solo lo visible.',
          'En una visita de certificación, el inspector del INVIMA suele revisar los registros de despeje dentro del registro de lote y puede pedir que se haga uno en vivo. Si no hay doble verificación o la lista es genérica, la deficiencia suele considerarse mayor por el riesgo de mezcla. El despeje se complementa con la **conciliación** del material impreso, que verás en la clase siguiente: si sobran o faltan plegadizas, algo se escapó.',
        ],
      },
    ],
    proceso: {
      titulo: 'Despeje de línea entre dos lotes',
      pasos: [
        { titulo: 'Retirar materiales del lote anterior', detalle: 'Granel, producto terminado, material impreso sobrante, muestras y rechazos salen de la línea y se concilian.', icono: 'Trash2', evidencia: 'Conciliación del lote anterior.' },
        { titulo: 'Retirar documentos y rótulos', detalle: 'Se retiran órdenes, etiquetas y cualquier rótulo del lote anterior.', icono: 'FileText', evidencia: 'Registro en la lista de chequeo.' },
        { titulo: 'Verificar la limpieza', detalle: 'Se confirma que el área y los equipos están limpios según el procedimiento y con rótulo de limpio vigente.', icono: 'Sparkles', evidencia: 'Rótulo de estado y registro de limpieza.' },
        { titulo: 'Revisar puntos ocultos', detalle: 'Tolvas, guías, alimentadores, cajas de rechazo, pisos y cintas, según la lista de la línea.', icono: 'Search', evidencia: 'Lista de chequeo específica diligenciada.' },
        { titulo: 'Identificar la línea', detalle: 'Se coloca el rótulo con producto, concentración y lote que inicia.', icono: 'Tag', evidencia: 'Rótulo de línea.' },
        { titulo: 'Verificar de forma independiente', detalle: 'Una segunda persona confirma todo y ambas firman con fecha y hora en el registro de lote.', icono: 'UserCheck', evidencia: 'Doble firma en el registro de lote.' },
      ],
    },
    caso: {
      titulo: 'El despeje con prisa',
      contexto: 'Es fin de turno. El operario hizo el despeje y quiere iniciar el siguiente lote de inmediato; el auditor de calidad tardará 40 minutos en llegar. El supervisor propone que el operario firme las dos casillas.',
      pregunta: '¿Qué corresponde?',
      opciones: [
        { texto: 'Aceptar: el operario conoce la línea mejor que nadie.', correcta: false, retro: 'La verificación independiente existe porque quien hizo el despeje puede pasar por alto lo mismo dos veces.' },
        { texto: 'Esperar la verificación independiente antes de iniciar; si la espera es frecuente, revisar la asignación de personal de calidad o designar verificadores calificados de otra área.', correcta: true, retro: 'Protege el control y ataca la causa: la falta de verificadores disponibles es un problema de sistema.' },
        { texto: 'Iniciar y que calidad firme cuando llegue.', correcta: false, retro: 'Firmar una verificación que no se hizo antes de iniciar es una falla de integridad de datos.' },
      ],
    },
    errores: [
      { error: 'Lista de chequeo genérica para todas las líneas.', correccion: 'Escribe listas específicas que nombren los puntos ocultos de cada equipo.' },
      { error: 'Una sola persona ejecuta y verifica.', correccion: 'La verificación la hace una segunda persona independiente.' },
      { error: 'Revisar solo la limpieza visible.', correccion: 'Incluye materiales, documentos, rótulos y puntos ocultos.' },
    ],
    comprueba: [
      { pregunta: '¿Cuándo se hace el despeje de línea?', respuesta: 'Antes de cada operación y entre lotes o productos, y se documenta en el registro de lote.' },
      { pregunta: 'Menciona tres puntos ocultos típicos de una línea de empaque.', respuesta: 'El alimentador de plegadizas, la caja de rechazos y el espacio bajo la cinta transportadora.' },
      { pregunta: '¿Por qué una lista genérica es un riesgo?', respuesta: 'Porque solo invita a revisar lo visible y no los puntos donde realmente quedan materiales.' },
    ],
    resumen: [
      'El despeje cubre **materiales, documentos, rótulos, limpieza y puntos ocultos**.',
      'Lo ejecuta producción y lo **verifica otra persona**.',
      'Las **listas específicas** por línea y la conciliación son la mejor defensa contra las mezclas.',
    ],
    referencias: [REF.res1160, REF.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de listas de chequeo', descripcion: 'Ilustración de una blistera con puntos ocultos numerados y resaltados (alimentador, caja de rechazos, guías, cinta) en turquesa.', alt: 'Puntos ocultos de una blistera que se revisan en el despeje de línea' },
    ],
    keywords: ['despeje de línea', 'line clearance farmacéutico', 'despeje de línea bpm', 'lista de chequeo despeje de línea', 'cómo hacer un despeje de línea', 'mezclas en acondicionamiento', 'verificación de despeje de línea'],
  },

  {
    titulo: 'Rendimientos y conciliación de materiales',
    duracion: 25,
    gancho: {
      titulo: 'Un 94,2 % que contaba algo',
      texto: 'Un laboratorio en Medellín fabrica un lote de 500.000 tabletas de metformina. El rendimiento esperado de la compresión está entre 97 % y 100,5 %, y el real da 94,2 %. Además, la conciliación de plegadizas muestra 120 unidades faltantes. Los números no son un trámite: están contando que algo pasó en el lote. Esta clase te enseña a escucharlos.',
    },
    objetivos: [
      'Calcular el rendimiento real frente al teórico y compararlo con sus límites.',
      'Aplicar la conciliación del material de envase impreso.',
      'Decidir qué hacer cuando un rendimiento o una conciliación están fuera de límites.',
    ],
    conceptos: [
      { icono: 'Calculator', termino: 'Rendimiento', definicion: 'Rendimiento (%) = real / teórico × 100. Se calcula en las etapas importantes y se compara con límites definidos en la fórmula maestra.' },
      { icono: 'Target', termino: 'Límites de rendimiento', definicion: 'Rango aceptable basado en datos históricos y en la validación del proceso. Un resultado fuera del rango se investiga.' },
      { icono: 'Scale', termino: 'Conciliación', definicion: 'Balance entre lo entregado y lo usado, devuelto, rechazado y destruido. Es obligatoria para el material de envase impreso.' },
      { icono: 'AlertTriangle', termino: 'Descuadre', definicion: 'Diferencia fuera de límites en la conciliación. En el material impreso, bloquea la liberación hasta investigar.' },
    ],
    mapa: {
      centro: 'Los números de un lote',
      ramas: [
        { titulo: 'Rendimiento', icono: 'Calculator', nodos: ['Real / teórico × 100', 'Por etapa importante', 'Límites en la fórmula maestra'] },
        { titulo: 'Conciliación', icono: 'Scale', nodos: ['Entregado = usado + devuelto + rechazado + destruido', 'Obligatoria en material impreso', 'Muestras incluidas'] },
        { titulo: 'Fuera de límites', icono: 'AlertTriangle', nodos: ['Desviación', 'Causas posibles', 'Impacto en otros lotes'] },
        { titulo: 'Decisión', icono: 'Gavel', nodos: ['Investigación cerrada', 'Calidad decide', 'Antes de liberar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Rendimiento: real frente a teórico',
        parrafos: [
          'Los manuales de BPM de la Resolución 1160 de 2016 piden registrar el rendimiento real en cada etapa importante, compararlo con el teórico e investigar cualquier diferencia fuera de los límites antes de liberar el lote. El **rendimiento teórico** es lo que se obtendría sin pérdidas; el **real** es lo obtenido; el porcentaje se calcula como real dividido por teórico, por cien.',
          'Los límites se definen a partir de los datos históricos y de la validación, y quedan escritos en la fórmula maestra. Un rendimiento bajo puede deberse a pérdidas en equipos o derrames, pero también a muestras no registradas o errores de pesaje. Un rendimiento **por encima** del 100 % también es una alarma: puede indicar un error de cálculo o material de otro lote.',
        ],
      },
      {
        titulo: 'Conciliación y decisión',
        parrafos: [
          'La **conciliación** es el balance completo entre lo entregado y lo usado, lo devuelto, lo rechazado, lo destruido y las muestras. Es **obligatoria para el material de envase impreso** (etiquetas, plegadizas, insertos, foil impreso), porque un faltante puede significar que un rótulo terminó en otro producto. Si la conciliación del material impreso no cuadra, el lote no se libera hasta investigar.',
          'Cuando un rendimiento o una conciliación salen de límites se abre una **desviación**: se buscan causas (pesaje, pérdidas, derrames, muestras no registradas, cálculo o mezcla), se evalúa el impacto en la calidad y en otros lotes y se documenta. En el caso de Medellín, la investigación encontró que no se registraron las tabletas retiradas durante un ajuste de peso, y las 120 plegadizas faltantes aparecieron en la caja de rechazos de la línea. Ambas situaciones quedaron documentadas y aseguramiento de calidad decidió sobre la liberación. La metodología de causa raíz se profundiza en el curso de Desviaciones y CAPA.',
        ],
      },
    ],
    proceso: {
      titulo: 'Conciliación de plegadizas al cierre de un lote',
      pasos: [
        { titulo: 'Registrar lo entregado', detalle: 'Anota la cantidad de plegadizas recibidas del almacén, con su lote.', icono: 'Package', evidencia: 'Orden de entrega.' },
        { titulo: 'Contar lo usado', detalle: 'Calcula las plegadizas usadas a partir de las unidades empacadas.', icono: 'Calculator', evidencia: 'Conteo de producción.' },
        { titulo: 'Contar sobrantes y rechazos', detalle: 'Cuenta las devueltas, las rechazadas en línea, las destruidas y las tomadas como muestra.', icono: 'Boxes', evidencia: 'Registros de devolución y destrucción.' },
        { titulo: 'Calcular la diferencia', detalle: 'Compara entregado con la suma de usado, devuelto, rechazado, destruido y muestras.', icono: 'Scale', evidencia: 'Cálculo en el registro de lote.' },
        { titulo: 'Comparar con el límite', detalle: 'Si la diferencia supera el límite definido, abre una desviación y retén el lote.', icono: 'AlertTriangle', evidencia: 'Desviación abierta si aplica.' },
        { titulo: 'Investigar y cerrar', detalle: 'Busca el material faltante, evalúa el riesgo de mezcla y documenta antes de liberar.', icono: 'FileCheck', evidencia: 'Investigación cerrada.' },
      ],
    },
    caso: {
      titulo: 'El rendimiento del 101,8 %',
      contexto: 'Un lote de cápsulas da un rendimiento de encapsulado de 101,8 %; el límite superior es 100,5 %. Producción dice que «es bueno: salieron más cápsulas».',
      pregunta: '¿Cómo lo interpretas?',
      opciones: [
        { texto: 'Como un buen resultado que no requiere acción.', correcta: false, retro: 'Más del 100 % es físicamente imposible sin un error: de pesaje, de conteo o por material de otro lote.' },
        { texto: 'Como una desviación: un rendimiento por encima del teórico indica un error de cálculo, de conteo o material ajeno al lote, y se investiga antes de liberar.', correcta: true, retro: 'Los límites tienen dos lados por una razón. El exceso puede esconder una mezcla con otro lote.' },
        { texto: 'Como una variación normal que se corrige ajustando el teórico.', correcta: false, retro: 'Ajustar el teórico para acomodar un dato es esconder el problema.' },
      ],
    },
    errores: [
      { error: 'Ignorar rendimientos por encima del 100 %.', correccion: 'Investiga ambos extremos del límite.' },
      { error: 'No registrar las muestras tomadas.', correccion: 'Incluye muestras y retiros en el balance.' },
      { error: 'Liberar con la conciliación de material impreso descuadrada.', correccion: 'Un descuadre en material impreso bloquea la liberación hasta investigar.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo se calcula el rendimiento?', respuesta: 'Rendimiento (%) = real / teórico × 100.' },
      { pregunta: '¿Por qué la conciliación del material impreso es obligatoria?', respuesta: 'Porque un faltante puede significar que un rótulo terminó en otro producto o lote.' },
      { pregunta: '¿Qué significa un rendimiento mayor al 100 %?', respuesta: 'Un error de cálculo o conteo, o material de otro lote: se investiga.' },
    ],
    resumen: [
      'Rendimiento (%) = **real / teórico × 100**, con límites en la fórmula maestra.',
      'La **conciliación** del material impreso es obligatoria.',
      'Todo resultado fuera de límites, **por arriba o por abajo**, se investiga antes de liberar.',
    ],
    referencias: [REF.res1160, REF.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de conciliación', descripcion: 'Balanza ilustrada: a un lado «entregado» y al otro «usado + devuelto + rechazado + destruido + muestras», equilibrada en turquesa.', alt: 'Balance de conciliación del material de envase impreso' },
    ],
    keywords: ['rendimiento de lote farmacéutico', 'conciliación de materiales', 'conciliación de material de envase impreso', 'cálculo de rendimiento teórico y real', 'rendimientos bpm', 'conciliación de etiquetas', 'desviación de rendimiento'],
  },

  {
    titulo: 'Registro de lote y controles en proceso',
    duracion: 25,
    gancho: {
      titulo: 'Un registro diligenciado al final del turno',
      texto: 'Durante una auditoría, el inspector compara la hora en que el registro de lote dice que se hizo un control de peso con la hora que muestra el impreso de la balanza: hay dos horas de diferencia. El operario admite que llenó el registro al final del turno, «de memoria». El dato de peso podía ser correcto, pero ya no se puede demostrar. El registro de lote solo vale si se escribe mientras ocurren las cosas.',
    },
    objetivos: [
      'Describir el contenido de un registro de lote de fabricación y de empaque.',
      'Aplicar las buenas prácticas de documentación al diligenciarlo.',
      'Seleccionar controles en proceso para una forma farmacéutica.',
    ],
    conceptos: [
      { icono: 'ClipboardList', termino: 'Registro de lote', definicion: 'Documento con la historia de un lote: materiales con sus lotes, pesajes, equipos, pasos, tiempos, controles en proceso, rendimientos, desviaciones y firmas.' },
      { icono: 'Fingerprint', termino: 'Buenas prácticas de documentación', definicion: 'Escribir en el momento, con tinta indeleble, sin espacios en blanco, corrigiendo con una línea que deje leer el dato original, con firma, fecha y motivo.' },
      { icono: 'Gauge', termino: 'Control en proceso', definicion: 'Medición durante la fabricación (peso, dureza, friabilidad, pH, volumen) para ajustar el proceso y asegurar que el producto cumplirá.' },
      { icono: 'FileSearch', termino: 'Revisión del registro', definicion: 'Aseguramiento de calidad revisa el registro completo antes de la liberación: datos, cálculos, desviaciones y firmas.' },
    ],
    mapa: {
      centro: 'El registro de lote',
      ramas: [
        { titulo: 'Qué contiene', icono: 'ClipboardList', nodos: ['Materiales y sus lotes', 'Pesajes verificados', 'Equipos y tiempos'] },
        { titulo: 'Controles', icono: 'Gauge', nodos: ['En proceso con límites', 'Rendimientos', 'Conciliación'] },
        { titulo: 'Cómo se escribe', icono: 'Fingerprint', nodos: ['En el momento', 'Correcciones legibles', 'Sin espacios en blanco'] },
        { titulo: 'Quién revisa', icono: 'FileSearch', nodos: ['Producción completa', 'Calidad revisa', 'Persona autorizada libera'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué debe contar el registro',
        parrafos: [
          'El registro de lote se emite como copia controlada de la fórmula maestra y se diligencia durante la fabricación. Debe permitir saber, para cada operación, **qué** se hizo, **con qué** materiales (con sus lotes), **en qué** equipo, **cuándo** y **quién** lo hizo y verificó. Incluye los pesajes con la verificación de una segunda persona en los materiales críticos, los tiempos de cada etapa, los controles en proceso con sus resultados, los rendimientos, las desviaciones y el despeje de línea.',
          'El registro de **empaque** cuenta la segunda parte de la historia: material de envase usado con sus lotes, verificación del codificado de lote y vencimiento, controles en línea, conciliación del material impreso y muestras de retención. Ambos registros se revisan antes de la liberación.',
        ],
      },
      {
        titulo: 'Controles en proceso y buenas prácticas de documentación',
        parrafos: [
          'Los **controles en proceso** se eligen según la forma farmacéutica y el riesgo: en sólidos, por ejemplo, humedad del granulado por pérdida por secado, peso, dureza, espesor, friabilidad y desintegración durante la compresión; en líquidos, pH, densidad, viscosidad y volumen de llenado; en todos, la verificación de identificación y codificado. Cada control tiene un límite y una acción definida si se sale.',
          'Las **buenas prácticas de documentación** convierten el registro en evidencia confiable. Se escribe en el momento, con tinta indeleble; los espacios que no aplican se anulan; las correcciones se hacen con una línea que deje leer el dato original, con la firma, la fecha y el motivo; y nunca se usa corrector ni se transcribe «en limpio». Son los principios ALCOA+ aplicados al papel: atribuible, legible, contemporáneo, original y exacto.',
        ],
      },
    ],
    proceso: {
      titulo: 'Revisión del registro de lote antes de la liberación',
      pasos: [
        { titulo: 'Completitud', detalle: 'Verifica que no haya espacios en blanco, que cada paso esté firmado y que los anexos (impresos de balanza, gráficos) estén.', icono: 'ClipboardCheck', evidencia: 'Lista de revisión diligenciada.' },
        { titulo: 'Coherencia de datos', detalle: 'Compara horas, pesos y resultados con los impresos de los equipos.', icono: 'Search', evidencia: 'Cruce con registros electrónicos.' },
        { titulo: 'Cálculos', detalle: 'Recalcula rendimientos y conciliaciones.', icono: 'Calculator', evidencia: 'Cálculos verificados.' },
        { titulo: 'Controles en proceso', detalle: 'Verifica que todos estén dentro de límites o con su desviación gestionada.', icono: 'Gauge', evidencia: 'Resultados revisados.' },
        { titulo: 'Desviaciones', detalle: 'Confirma que cada desviación está investigada y cerrada.', icono: 'AlertTriangle', evidencia: 'Desviaciones cerradas.' },
        { titulo: 'Dictamen', detalle: 'Aseguramiento de calidad emite su revisión para que la persona autorizada decida.', icono: 'Signature', evidencia: 'Revisión firmada.' },
      ],
    },
    caso: {
      titulo: 'El corrector en el registro',
      contexto: 'Al revisar un registro de lote, encuentras un dato de dureza tapado con corrector y reescrito encima, sin firma ni explicación.',
      pregunta: '¿Qué haces?',
      opciones: [
        { texto: 'Aceptarlo si el dato nuevo está dentro de especificación.', correcta: false, retro: 'No sabes cuál era el dato original ni por qué cambió: puede ocultar un resultado fuera de límite.' },
        { texto: 'Abrir una desviación de integridad de datos, entrevistar a quien registró, buscar el dato original en otras fuentes y evaluar el impacto antes de liberar; reforzar el entrenamiento en buenas prácticas de documentación.', correcta: true, retro: 'Una corrección que oculta el dato original es un hallazgo de integridad: se investiga, no se acepta.' },
        { texto: 'Pedir al operario que escriba la explicación ahora y firmar.', correcta: false, retro: 'Una explicación tardía sin evidencia no restablece la confiabilidad del dato.' },
      ],
    },
    errores: [
      { error: 'Llenar el registro al final del turno.', correccion: 'Se registra en el momento de la operación.' },
      { error: 'Usar corrector o reescribir en limpio.', correccion: 'Corrige con una línea, dejando legible el original, con firma, fecha y motivo.' },
      { error: 'Controles en proceso sin acción definida.', correccion: 'Cada control tiene límites y una acción si se sale.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo se corrige un dato en un registro?', respuesta: 'Con una línea que deje leer el original, el dato correcto, firma, fecha y motivo.' },
      { pregunta: 'Menciona tres controles en proceso de una compresión.', respuesta: 'Peso, dureza y friabilidad (también espesor y desintegración).' },
      { pregunta: '¿Qué significa contemporáneo en ALCOA+?', respuesta: 'Que el dato se registra en el momento en que ocurre la actividad.' },
    ],
    resumen: [
      'El registro de lote cuenta **qué, con qué, dónde, cuándo y quién**.',
      'Los **controles en proceso** tienen límites y acciones.',
      'Se escribe **en el momento** y se corrige sin ocultar el dato original.',
    ],
    referencias: [REF.res1160, REF.trs986a2, REF.fdaIntegridad, REF.picsPi041],
    imagenes: [
      { ubicacion: 'En la sección de documentación', descripcion: 'Fragmento ilustrado de un registro con una corrección bien hecha (una línea, dato legible, firma, fecha y motivo) junto a una mal hecha con corrector, marcada con una X.', alt: 'Corrección correcta e incorrecta en un registro de lote' },
    ],
    keywords: ['registro de lote farmacéutico', 'batch record', 'controles en proceso', 'buenas prácticas de documentación', 'alcoa+ en registros de lote', 'revisión de registro de lote', 'cómo corregir un registro bpm'],
  },

  {
    titulo: 'Recepción, cuarentena, muestreo y liberación de materias primas',
    duracion: 25,
    gancho: {
      titulo: 'El contenedor 7 de 12',
      texto: 'Llegan 12 tambores de un excipiente de un proveedor aprobado. Once traen el material correcto; el séptimo, por un error en la bodega del distribuidor, trae otro polvo blanco con la misma etiqueta. Si el laboratorio solo analiza una muestra compuesta de tres tambores, es probable que nadie lo note. Por eso la recepción, la cuarentena y el muestreo de materias primas están entre los controles más importantes de una planta.',
    },
    objetivos: [
      'Describir los pasos desde la llegada de una materia prima hasta su liberación.',
      'Explicar el estado de cuarentena y su control físico o informático.',
      'Aplicar los principios de muestreo y de prueba de identidad por contenedor.',
    ],
    conceptos: [
      { icono: 'Truck', termino: 'Recepción', definicion: 'Verificación de que lo que llega corresponde a lo pedido, a un proveedor aprobado, con rótulos y envases íntegros, y asignación de un número de lote interno.' },
      { icono: 'Lock', termino: 'Cuarentena', definicion: 'Estado del material aislado física o informáticamente mientras se decide su aprobación o rechazo.' },
      { icono: 'TestTube', termino: 'Muestreo', definicion: 'Toma de muestras representativas según un plan escrito, en un área que proteja el material y el ambiente.' },
      { icono: 'Fingerprint', termino: 'Identidad por contenedor', definicion: 'Prueba de identidad de las muestras de los contenedores de materia prima, para detectar un contenedor equivocado.' },
      { icono: 'BadgeCheck', termino: 'Liberación', definicion: 'Decisión de control de calidad de aprobar el material para su uso, con cambio de estado y fecha de reanálisis o vencimiento.' },
    ],
    mapa: {
      centro: 'De la puerta del almacén a producción',
      ramas: [
        { titulo: 'Recibir', icono: 'Truck', nodos: ['Documentos y pedido', 'Proveedor aprobado', 'Envases íntegros'] },
        { titulo: 'Aislar', icono: 'Lock', nodos: ['Cuarentena física o informática', 'Rótulo de estado', 'Lote interno'] },
        { titulo: 'Muestrear y analizar', icono: 'TestTube', nodos: ['Plan de muestreo', 'Área de muestreo', 'Identidad por contenedor'] },
        { titulo: 'Decidir', icono: 'BadgeCheck', nodos: ['Aprobado o rechazado', 'Reanálisis o vencimiento', 'Despacho FEFO'] },
      ],
    },
    secciones: [
      {
        titulo: 'Recepción y cuarentena',
        parrafos: [
          'Cada entrega se verifica contra el pedido y la lista de proveedores aprobados: nombre del material, código, cantidad, lote del fabricante, integridad de envases y sellos, rótulos legibles y certificado de análisis. Cualquier daño o discrepancia se registra y se informa a calidad. Luego se limpian los envases si es necesario, se asigna un **número de lote interno** y el material queda en **cuarentena**.',
          'La cuarentena puede ser **física** (un área separada y rotulada) o **informática** (un sistema validado que impide despachar lo que no está aprobado). Lo importante es que nadie pueda usar el material antes de su liberación. Los materiales rechazados se separan en un área de acceso restringido.',
        ],
      },
      {
        titulo: 'Muestreo, identidad y liberación',
        parrafos: [
          'El muestreo se hace según un **plan escrito**, por personal entrenado, en un área o cabina que proteja el material de la contaminación y evite contaminar el ambiente. La guía de la OMS sobre muestreo (TRS 929, Anexo 4) describe planes de muestreo según la homogeneidad del material y la confianza en el proveedor. Los envases muestreados se identifican y se cierran adecuadamente.',
          'Las BPM dan especial importancia a la **identidad**: por regla general, se verifica la identidad de muestras de cada contenedor de materia prima, salvo que un procedimiento validado y un proveedor calificado justifiquen otra estrategia. El caso del contenedor 7 muestra por qué. Con los resultados conformes, control de calidad **libera** el material: cambia su estado a aprobado y asigna su fecha de reanálisis o vencimiento. El despacho a producción sigue el principio de que sale primero lo que vence primero (FEFO).',
        ],
      },
    ],
    proceso: {
      titulo: 'Recepción de una materia prima',
      pasos: [
        { titulo: 'Verificar la entrega', detalle: 'Compara con el pedido, la lista de proveedores aprobados y el certificado; revisa envases y sellos.', icono: 'Truck', evidencia: 'Registro de recepción.' },
        { titulo: 'Asignar lote interno', detalle: 'Da un número de lote interno y rotula cada contenedor.', icono: 'Tag', evidencia: 'Rótulos de recepción.' },
        { titulo: 'Poner en cuarentena', detalle: 'Ubica el material en cuarentena física o informática.', icono: 'Lock', evidencia: 'Estado en el sistema o rótulo de cuarentena.' },
        { titulo: 'Muestrear', detalle: 'Toma las muestras según el plan, en el área de muestreo, e identifica los envases muestreados.', icono: 'TestTube', evidencia: 'Registro de muestreo.' },
        { titulo: 'Analizar', detalle: 'Control de calidad analiza según la especificación, incluida la identidad por contenedor.', icono: 'FlaskConical', evidencia: 'Resultados analíticos.' },
        { titulo: 'Liberar o rechazar', detalle: 'Con resultados conformes, se aprueba con fecha de reanálisis; si no, se rechaza y se separa.', icono: 'BadgeCheck', evidencia: 'Rótulo de aprobado o rechazado y certificado interno.' },
      ],
    },
    caso: {
      titulo: 'Muestra compuesta para ahorrar tiempo',
      contexto: 'Para acelerar la liberación de 12 tambores de un excipiente, el laboratorio propone analizar solo una muestra compuesta de tres tambores, incluida la identidad.',
      pregunta: '¿Qué recomiendas?',
      opciones: [
        { texto: 'Aceptar, porque el proveedor está aprobado.', correcta: false, retro: 'La aprobación del proveedor no descarta un contenedor equivocado, como el tambor 7 del caso.' },
        { texto: 'Mantener la prueba de identidad sobre muestras de cada contenedor según el procedimiento; la muestra compuesta puede usarse para otros ensayos si el plan de muestreo lo justifica.', correcta: true, retro: 'La identidad por contenedor es la defensa contra el error más peligroso; los demás ensayos pueden seguir un plan estadístico justificado.' },
        { texto: 'Analizar solo el certificado del proveedor.', correcta: false, retro: 'El certificado no reemplaza la verificación de identidad de lo que realmente llegó.' },
      ],
    },
    errores: [
      { error: 'Materiales en cuarentena que se pueden despachar.', correccion: 'Bloquea física o informáticamente el material hasta su liberación.' },
      { error: 'Muestrear en el almacén general.', correccion: 'Usa un área o cabina de muestreo que proteja el material y el ambiente.' },
      { error: 'Liberar con base solo en el certificado del proveedor.', correccion: 'Verifica al menos la identidad de cada contenedor según tu procedimiento.' },
    ],
    comprueba: [
      { pregunta: '¿Qué formas de cuarentena existen?', respuesta: 'Física, con área separada y rotulada, o informática, con un sistema validado que impide despachar.' },
      { pregunta: '¿Por qué se verifica la identidad de cada contenedor?', respuesta: 'Porque un contenedor equivocado puede pasar inadvertido si solo se analiza una muestra compuesta.' },
      { pregunta: '¿Qué significa FEFO?', respuesta: 'Que se despacha primero lo que vence primero.' },
    ],
    resumen: [
      'Recibir, aislar, muestrear, analizar y **liberar**: en ese orden.',
      'La **cuarentena** impide usar lo que no está aprobado.',
      'La **identidad por contenedor** es la defensa contra el error más peligroso.',
    ],
    referencias: [REF.trs929a4, REF.trs986a2, REF.res1160],
    imagenes: [
      { ubicacion: 'En la sección de muestreo', descripcion: 'Ilustración de una cabina de muestreo con flujo de aire, un analista con vestimenta y tambores numerados del 1 al 12, el 7 resaltado.', alt: 'Muestreo de materias primas por contenedor en una cabina' },
    ],
    keywords: ['recepción de materias primas farmacéuticas', 'cuarentena de materias primas', 'muestreo de materias primas', 'identidad por contenedor', 'liberación de materias primas', 'plan de muestreo oms trs 929', 'fefo almacén farmacéutico'],
  },

  {
    titulo: 'Material de envase, rotulado, rechazos y devoluciones',
    duracion: 25,
    gancho: {
      titulo: 'Una plegadiza que no coincidía con el registro',
      texto: 'Un laboratorio en Cali recibe plegadizas para un jarabe pediátrico. El inspector de recepción nota que el texto del registro sanitario no coincide con el arte aprobado. El lote se rotula como rechazado, se guarda bajo llave y se notifica al proveedor. Dos meses después llega una devolución de un distribuidor con cajas expuestas a humedad y aseguramiento de calidad decide destruirla, con acta. Material impreso, rechazos y devoluciones: tres controles que el inspector revisa al recorrer el almacén.',
    },
    objetivos: [
      'Aplicar los controles BPM al material de envase impreso.',
      'Gestionar los materiales y productos rechazados.',
      'Decidir sobre productos devueltos con criterio de calidad.',
    ],
    conceptos: [
      { icono: 'Tag', termino: 'Material impreso', definicion: 'Etiquetas, plegadizas, insertos y foil impreso. Es crítico porque lleva la información del producto: se almacena con acceso restringido, se entrega controlado y se concilia.' },
      { icono: 'ShieldCheck', termino: 'Rótulo de estado', definicion: 'Cuarentena, aprobado o rechazado, con etiquetas o un sistema informático validado.' },
      { icono: 'XCircle', termino: 'Rechazado', definicion: 'Material o producto que no cumple. Se identifica, se separa en un área restringida y se devuelve, se reprocesa solo si está autorizado o se destruye.' },
      { icono: 'RefreshCw', termino: 'Devolución', definicion: 'Producto que regresa del mercado. Solo vuelve al inventario si calidad demuestra que su calidad no se afectó; si hay duda, se destruye.' },
    ],
    mapa: {
      centro: 'Materiales que pueden confundir',
      ramas: [
        { titulo: 'Material impreso', icono: 'Tag', nodos: ['Arte aprobado', 'Acceso restringido', 'Entrega y conciliación'] },
        { titulo: 'Estados', icono: 'ShieldCheck', nodos: ['Cuarentena', 'Aprobado', 'Rechazado'] },
        { titulo: 'Rechazos', icono: 'XCircle', nodos: ['Área bajo llave', 'Devolución o destrucción', 'Acta y registro'] },
        { titulo: 'Devoluciones', icono: 'RefreshCw', nodos: ['Evaluación de calidad', 'Condiciones de almacenamiento', 'Ante la duda, destruir'] },
      ],
    },
    secciones: [
      {
        titulo: 'Material de envase y rotulado',
        parrafos: [
          'Los manuales de BPM de la Resolución 1160 de 2016 dan a los materiales de envase el mismo rigor que a las materias primas: se compran a proveedores aprobados según especificaciones, cada recepción se revisa, se identifica con un lote interno, se pone en cuarentena y se muestrea antes de que control de calidad la apruebe. El **material impreso** es crítico porque contiene la información del producto: se verifica contra el arte aprobado y el registro sanitario, se guarda en condiciones seguras y con acceso restringido, se entrega a producción solo con autorización y en las cantidades necesarias, y se concilia al final.',
          'Las etiquetas sueltas se manejan en contenedores cerrados para evitar mezclas, y el material impreso obsoleto (por ejemplo, tras un cambio de arte) se destruye de forma documentada. El **codificado** de lote y vencimiento en línea se verifica al inicio y durante el envasado.',
        ],
      },
      {
        titulo: 'Rechazos y devoluciones',
        parrafos: [
          'Todo material debe mostrar su **estado**. Los materiales y productos **rechazados** se identifican de forma clara, se guardan separados en un área restringida y se devuelven al proveedor, se reprocesan solo si está autorizado y documentado, o se destruyen con acta.',
          'Los productos **devueltos** del mercado solo se reincorporan al inventario si control de calidad los evalúa y comprueba que su calidad no se afectó, considerando las condiciones de almacenamiento y transporte, el tiempo transcurrido y el estado del envase. Si hay cualquier duda, se destruyen. Los **retiros del mercado** siguen un procedimiento propio y, en Colombia, se coordinan con el INVIMA.',
        ],
      },
    ],
    proceso: {
      titulo: 'Decisión sobre una devolución del mercado',
      pasos: [
        { titulo: 'Recibir y aislar', detalle: 'La devolución entra a un área separada, identificada como devolución pendiente de evaluación.', icono: 'Lock', evidencia: 'Registro de recepción de devoluciones.' },
        { titulo: 'Reunir información', detalle: 'Motivo de la devolución, tiempo fuera, condiciones de almacenamiento y transporte declaradas.', icono: 'FileSearch', evidencia: 'Información del cliente o distribuidor.' },
        { titulo: 'Inspeccionar', detalle: 'Calidad revisa el estado del envase, sellos, rótulos y signos de manipulación o exposición.', icono: 'Search', evidencia: 'Informe de inspección.' },
        { titulo: 'Evaluar el riesgo', detalle: 'Decide si hay evidencia suficiente de que la calidad no se afectó; si hay duda, no se reincorpora.', icono: 'AlertTriangle', evidencia: 'Evaluación documentada.' },
        { titulo: 'Decidir', detalle: 'Reincorporar con aprobación de calidad o destruir con acta.', icono: 'Gavel', evidencia: 'Decisión firmada y acta si aplica.' },
      ],
    },
    caso: {
      titulo: 'Cajas húmedas devueltas',
      contexto: 'Un distribuidor devuelve 40 cajas de un jarabe porque «el cliente canceló el pedido». Las cajas exteriores muestran manchas de humedad; los frascos parecen intactos.',
      pregunta: '¿Qué decide calidad?',
      opciones: [
        { texto: 'Reincorporarlas: los frascos están intactos.', correcta: false, retro: 'La humedad revela condiciones de almacenamiento desconocidas que pudieron afectar el producto o sus rótulos.' },
        { texto: 'No reincorporarlas sin evidencia de condiciones adecuadas; ante la duda, destruirlas con acta y registrar la decisión.', correcta: true, retro: 'La regla de BPM es clara: sin evidencia de que la calidad no se afectó, no vuelve al mercado.' },
        { texto: 'Reetiquetar las cajas y venderlas en otra región.', correcta: false, retro: 'Reetiquetar no resuelve la incertidumbre sobre la calidad del producto.' },
      ],
    },
    errores: [
      { error: 'Material impreso en estanterías abiertas.', correccion: 'Guárdalo con acceso restringido y entrégalo controlado.' },
      { error: 'Rechazos mezclados con material aprobado.', correccion: 'Sepáralos en un área bajo llave, con rótulo de rechazado.' },
      { error: 'Reincorporar devoluciones sin evaluación.', correccion: 'Calidad evalúa y documenta; ante la duda, se destruye.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué el material impreso es crítico?', respuesta: 'Porque contiene la información del producto; una mezcla de rótulos puede llevar al paciente un producto equivocado.' },
      { pregunta: '¿Qué destinos puede tener un material rechazado?', respuesta: 'Devolución al proveedor, reproceso autorizado y documentado, o destrucción con acta.' },
      { pregunta: '¿Cuándo vuelve al inventario una devolución?', respuesta: 'Solo si calidad demuestra que su calidad no se afectó; si hay duda, se destruye.' },
    ],
    resumen: [
      'El material impreso se maneja como **material crítico**: aprobado, restringido y conciliado.',
      'Los **rechazados** se separan bajo llave y tienen un destino documentado.',
      'Las **devoluciones** solo vuelven con evidencia; ante la duda, se destruyen.',
    ],
    referencias: [REF.res1160, REF.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de rechazos', descripcion: 'Almacén ilustrado con tres zonas por color: cuarentena (ámbar), aprobado (turquesa) y rechazado bajo llave (rojo suave), con rótulos de estado.', alt: 'Zonas de cuarentena, aprobado y rechazado en un almacén farmacéutico' },
    ],
    keywords: ['material de envase impreso bpm', 'rotulado de estado cuarentena aprobado rechazado', 'manejo de rechazos farmacéuticos', 'devoluciones de productos farmacéuticos', 'destrucción de material impreso', 'control de etiquetas farmacéuticas'],
  },
];

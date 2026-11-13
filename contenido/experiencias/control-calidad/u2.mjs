/** Curso de Control de Calidad de Medicamentos · Unidad 2. Especificaciones, farmacopeas, muestreo y estándares */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: la especificación como contrato de calidad',
    duracion: 15,
    gancho: {
      titulo: 'Dos laboratorios, dos veredictos',
      texto: 'El mismo lote de un excipiente se analiza en el laboratorio del proveedor y en el del fabricante. El proveedor dice «cumple»; el fabricante, «no cumple». Al revisar, descubren que cada uno usaba una especificación distinta: límites diferentes y un método distinto para el contenido de agua. Sin una especificación acordada, «cumple» no significa nada. Esta unidad trata de cómo se construye y se usa ese contrato.',
    },
    objetivos: [
      'Explicar qué es una especificación y qué elementos la componen.',
      'Relacionar la especificación con la farmacopea, el registro sanitario y el proveedor.',
      'Ubicar los temas de la unidad: farmacopeas, ICH Q6A, muestreo, materiales y estándares.',
    ],
    conceptos: [
      { icono: 'ClipboardList', termino: 'Especificación', definicion: 'Lista de ensayos, referencias a los métodos y criterios de aceptación (límites numéricos, rangos u otros criterios) que un material debe cumplir para considerarse aceptable para su uso.' },
      { icono: 'Target', termino: 'Criterio de aceptación', definicion: 'El límite o rango que decide si un resultado cumple: por ejemplo, contenido entre 95,0 % y 105,0 % de lo declarado.' },
      { icono: 'BookOpen', termino: 'Monografía', definicion: 'Texto de una farmacopea que define los ensayos y límites oficiales de una sustancia o un producto.' },
      { icono: 'Scale', termino: 'Contrato de calidad', definicion: 'La especificación compartida entre quien produce y quien usa un material. Si no es la misma, los resultados no son comparables.' },
    ],
    mapa: {
      centro: 'La especificación',
      ramas: [
        { titulo: 'Qué contiene', icono: 'ClipboardList', nodos: ['Ensayos', 'Métodos', 'Criterios de aceptación'] },
        { titulo: 'De dónde sale', icono: 'BookOpen', nodos: ['Farmacopea oficial', 'Registro sanitario', 'Datos de desarrollo e ICH Q6A'] },
        { titulo: 'A qué aplica', icono: 'Boxes', nodos: ['Materias primas', 'Material de envase', 'Intermedios y terminados'] },
        { titulo: 'Con qué se mide', icono: 'TestTube', nodos: ['Muestreo representativo', 'Estándares de referencia', 'Métodos validados'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué es y por qué es un contrato',
        parrafos: [
          'La guía ICH Q6A define la especificación como una lista de ensayos, referencias a procedimientos analíticos y criterios de aceptación apropiados, que son límites numéricos, rangos u otros criterios para los ensayos descritos. Establece el conjunto de criterios con los que un material debe cumplir para considerarse aceptable para su uso. **Cumplir la especificación** significa que el material, analizado con los métodos indicados, cumple todos los criterios.',
          'Por eso la especificación funciona como un **contrato**: entre el fabricante y la autoridad sanitaria (la especificación del registro), entre el proveedor y el fabricante (la especificación de compra) y entre producción y control de calidad (la especificación interna). Si el contrato no es el mismo para ambas partes, como en el caso inicial, los resultados no pueden compararse.',
        ],
      },
      {
        titulo: 'Lo que viene en la unidad',
        parrafos: [
          'Verás de dónde salen los ensayos y límites: las **farmacopeas** oficiales y cómo leer una **monografía**; cómo se establecen especificaciones para productos nuevos con **ICH Q6A**; cómo se toma una **muestra** que represente el lote; cómo se controlan las **materias primas** y el **material de envase**; y cómo se manejan los **estándares de referencia**, sin los cuales no hay medición confiable. Al terminar, deberías poder leer una especificación y explicar de dónde salió cada línea.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo se usa una especificación en el laboratorio',
      pasos: [
        { titulo: 'Identificar la versión vigente', detalle: 'Confirma qué versión de la especificación aplica al material y al lote.', icono: 'FileSearch', evidencia: 'Especificación aprobada y vigente.' },
        { titulo: 'Planear los ensayos', detalle: 'Lista cada ensayo, su método y la cantidad de muestra necesaria.', icono: 'ClipboardList', evidencia: 'Hoja de trabajo.' },
        { titulo: 'Ejecutar con métodos validados', detalle: 'Analiza con el método referenciado, estándares vigentes y equipos calificados.', icono: 'FlaskConical', evidencia: 'Datos primarios.' },
        { titulo: 'Comparar con los criterios', detalle: 'Evalúa cada resultado frente a su criterio de aceptación.', icono: 'Target', evidencia: 'Resultados evaluados.' },
        { titulo: 'Concluir', detalle: 'El material cumple solo si cumple todos los criterios; si no, se investiga.', icono: 'CheckCircle2', evidencia: 'Dictamen y certificado.' },
      ],
    },
    caso: {
      titulo: 'El agua que medía distinto',
      contexto: 'Un proveedor certifica 4,5 % de agua por pérdida por secado en un excipiente; tu especificación pide máximo 5,0 % de agua por Karl Fischer. Tu laboratorio obtiene 5,6 % por Karl Fischer.',
      pregunta: '¿Qué explica la diferencia y qué haces?',
      opciones: [
        { texto: 'El proveedor tiene razón: el material cumple.', correcta: false, retro: 'Pérdida por secado y Karl Fischer miden cosas distintas: la primera incluye otros volátiles y depende de las condiciones; la segunda es específica para agua.' },
        { texto: 'Los métodos son distintos, así que los resultados no son comparables; el material se evalúa con tu especificación, se investiga el resultado y se alinea la especificación de compra con el proveedor.', correcta: true, retro: 'El contrato de calidad debe ser el mismo: mismo ensayo, mismo método, mismo límite.' },
        { texto: 'Promediar ambos resultados.', correcta: false, retro: 'Promediar resultados de métodos distintos no tiene sentido técnico.' },
      ],
    },
    errores: [
      { error: 'Especificaciones de compra distintas de las internas.', correccion: 'Alinea ensayos, métodos y límites con el proveedor.' },
      { error: 'Aceptar un «cumple» sin saber con qué método se obtuvo.', correccion: 'Un resultado vale con su método y su criterio.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tres elementos tiene una especificación?', respuesta: 'Ensayos, referencias a los métodos y criterios de aceptación.' },
      { pregunta: '¿Por qué se dice que la especificación es un contrato?', respuesta: 'Porque define, para ambas partes, cuándo un material es aceptable; si no es la misma, los resultados no se pueden comparar.' },
    ],
    resumen: [
      'La especificación son **ensayos, métodos y criterios**.',
      'Funciona como un **contrato** entre proveedor, fabricante y autoridad.',
      'Un resultado solo significa algo con **su método y su criterio**.',
    ],
    referencias: [REF.ichQ6A, REF.res3619, REF.trs957a1],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Documento de especificación ilustrado con tres columnas resaltadas (ensayo, método, criterio) y un sello de acuerdo entre dos manos.', alt: 'La especificación como contrato de calidad' },
    ],
    keywords: ['qué es una especificación farmacéutica', 'especificaciones de calidad de medicamentos', 'criterios de aceptación control de calidad', 'especificación de materias primas', 'especificación ich q6a'],
  },

  {
    titulo: 'Farmacopeas oficiales en Colombia: USP, Ph. Eur., FEUM y otras',
    duracion: 20,
    gancho: {
      titulo: '¿Cuál farmacopea, y qué edición?',
      texto: 'Un analista nuevo encuentra que la monografía de un activo en la USP y en la Farmacopea Europea tienen límites de impurezas distintos. Pregunta cuál debe usar. La respuesta depende de lo que declara el registro sanitario del producto, de lo que la normativa colombiana reconoce como farmacopea oficial y de la edición vigente. Usar la equivocada puede llevar a liberar o rechazar un lote por la razón incorrecta.',
    },
    objetivos: [
      'Explicar qué es una farmacopea y qué contiene.',
      'Reconocer las farmacopeas de referencia más usadas en Colombia.',
      'Aplicar la regla de usar la farmacopea y la edición que correspondan a lo registrado.',
    ],
    conceptos: [
      { icono: 'BookOpen', termino: 'Farmacopea', definicion: 'Compendio oficial de normas de calidad: monografías de sustancias y productos, capítulos generales de métodos y textos de referencia.' },
      { icono: 'Globe', termino: 'Farmacopeas de referencia', definicion: 'En Colombia se trabaja con farmacopeas extranjeras reconocidas como oficiales por la normativa sanitaria, como la de Estados Unidos (USP), la Europea (Ph. Eur.), la Británica y la Mexicana (FEUM), entre otras.' },
      { icono: 'CalendarClock', termino: 'Edición vigente', definicion: 'Las farmacopeas se actualizan con frecuencia. Se debe usar la edición y el suplemento oficiales que correspondan.' },
      { icono: 'Files', termino: 'Capítulos generales', definicion: 'Textos de métodos comunes (disolución, uniformidad, microbiología, cromatografía) que las monografías citan.' },
    ],
    mapa: {
      centro: 'La farmacopea en el laboratorio',
      ramas: [
        { titulo: 'Contenido', icono: 'BookOpen', nodos: ['Monografías', 'Capítulos generales', 'Estándares de referencia asociados'] },
        { titulo: 'En Colombia', icono: 'Globe', nodos: ['Farmacopeas reconocidas como oficiales', 'USP, Ph. Eur., BP, FEUM y otras', 'Lo declarado en el registro'] },
        { titulo: 'Vigencia', icono: 'CalendarClock', nodos: ['Edición y suplementos', 'Fecha oficial', 'Control de cambios'] },
        { titulo: 'Uso', icono: 'ClipboardCheck', nodos: ['Especificación basada en la monografía', 'Verificación del método', 'Trazabilidad de la edición'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué es una farmacopea',
        parrafos: [
          'Una farmacopea es un compendio oficial de normas de calidad. Contiene **monografías**, que definen para cada sustancia o producto sus ensayos y límites (identificación, valoración, impurezas, disolución, entre otros), y **capítulos generales**, que describen métodos comunes como la cromatografía, la disolución, la uniformidad de unidades de dosificación o los ensayos microbiológicos. Muchas farmacopeas tienen además estándares de referencia oficiales asociados a sus métodos.',
          'Colombia no publica hoy una farmacopea nacional propia: la normativa sanitaria reconoce como oficiales farmacopeas extranjeras, entre ellas la de los Estados Unidos (USP), la Europea (Ph. Eur.), la Británica, la Mexicana (FEUM) y otras. Antes de usar una, verifica que esté dentro de las reconocidas y que sea la que declara el registro sanitario del producto.',
        ],
      },
      {
        titulo: 'La edición vigente y la trazabilidad',
        parrafos: [
          'Las farmacopeas se actualizan con frecuencia: ediciones, suplementos y revisiones. Un cambio en una monografía puede modificar un límite, un método o un estándar. Por eso el laboratorio debe tener un sistema para **detectar cambios**, evaluarlos por control de cambios y actualizar sus especificaciones y métodos cuando corresponda. En las hojas de trabajo y en los certificados conviene registrar la farmacopea y su edición.',
          'Cuando un producto declara una farmacopea en su registro, el laboratorio usa esa monografía; si el método farmacopeico se usa sin modificaciones, se **verifica** en el laboratorio, como viste en el curso de Validaciones. Si dos farmacopeas difieren, no se elige la más conveniente: se usa la declarada y, si se quiere cambiar, se gestiona como un cambio regulatorio.',
        ],
      },
    ],
    proceso: {
      titulo: 'Gestionar la actualización de una monografía',
      pasos: [
        { titulo: 'Vigilar publicaciones', detalle: 'Revisa con una frecuencia definida las nuevas ediciones y suplementos de las farmacopeas que usas.', icono: 'Search', evidencia: 'Registro de vigilancia farmacopeica.' },
        { titulo: 'Identificar cambios relevantes', detalle: 'Compara la monografía nueva con la vigente en tu especificación.', icono: 'FileSearch', evidencia: 'Tabla comparativa.' },
        { titulo: 'Evaluar impacto', detalle: 'Analiza si cambian límites, métodos o estándares, y su efecto en productos y registros.', icono: 'AlertTriangle', evidencia: 'Evaluación de impacto.' },
        { titulo: 'Gestionar el cambio', detalle: 'Actualiza especificaciones y métodos por control de cambios, con verificación si aplica.', icono: 'GitBranch', evidencia: 'Control de cambios cerrado.' },
        { titulo: 'Entrenar y aplicar', detalle: 'Entrena a los analistas y aplica la nueva versión desde su fecha oficial.', icono: 'GraduationCap', evidencia: 'Registro de entrenamiento.' },
      ],
    },
    caso: {
      titulo: 'Dos monografías, dos límites',
      contexto: 'El registro sanitario de un producto declara la USP. Un analista nota que la Farmacopea Europea tiene un límite de una impureza más amplio y propone usarlo porque el lote actual lo cumple.',
      pregunta: '¿Qué corresponde?',
      opciones: [
        { texto: 'Usar el límite europeo porque también es oficial.', correcta: false, retro: 'Elegir la farmacopea más conveniente para que un lote cumpla no es aceptable; se usa la declarada en el registro.' },
        { texto: 'Evaluar el lote con la monografía USP declarada en el registro; si se quiere cambiar de farmacopea, gestionarlo como un cambio regulatorio.', correcta: true, retro: 'La coherencia con el registro sanitario manda. Un cambio de referencia farmacopeica es un cambio, no una elección del momento.' },
        { texto: 'Usar el límite promedio entre ambas.', correcta: false, retro: 'No existe un límite promedio oficial.' },
      ],
    },
    errores: [
      { error: 'Usar ediciones desactualizadas.', correccion: 'Mantén un sistema de vigilancia farmacopeica y control de cambios.' },
      { error: 'Elegir la farmacopea según convenga.', correccion: 'Usa la declarada en el registro sanitario.' },
    ],
    comprueba: [
      { pregunta: '¿Qué contiene una farmacopea?', respuesta: 'Monografías de sustancias y productos, capítulos generales de métodos y, en muchos casos, estándares de referencia asociados.' },
      { pregunta: '¿Qué farmacopea se usa para liberar un producto?', respuesta: 'La declarada en su registro sanitario, en la edición vigente, siempre que sea reconocida como oficial.' },
    ],
    resumen: [
      'La farmacopea aporta **monografías y capítulos generales**.',
      'En Colombia se usan farmacopeas **reconocidas como oficiales**, como USP, Ph. Eur., BP y FEUM.',
      'Se usa la **declarada en el registro** y en su **edición vigente**.',
    ],
    referencias: [REF.res3619, REF.trs957a1, REF.dec677, REF.ichQ6A],
    imagenes: [
      { ubicacion: 'En la sección de farmacopeas', descripcion: 'Estantería ilustrada con libros etiquetados USP, Ph. Eur., BP y FEUM, y un marcador que señala «edición vigente».', alt: 'Farmacopeas de referencia usadas en Colombia' },
    ],
    keywords: ['farmacopeas oficiales en colombia', 'usp farmacopea', 'farmacopea europea', 'feum farmacopea mexicana', 'qué es una farmacopea', 'edición vigente de la farmacopea'],
  },

  {
    titulo: 'Cómo leer y aplicar una monografía farmacopeica',
    duracion: 25,
    gancho: {
      titulo: 'Lo que la monografía no dice explícitamente',
      texto: 'Una analista lee en la monografía de unas tabletas: «Disolución: no menos del 80 % (Q) en 30 minutos». Prepara seis tabletas, obtiene 78 %, 85 %, 88 %, 90 %, 86 % y 84 %, y reporta «no cumple» por la unidad de 78 %. Se equivocó: la monografía remite a un capítulo general con criterios por etapas. Leer una monografía es leer también lo que remite.',
    },
    objetivos: [
      'Identificar las partes de una monografía y lo que cada una exige.',
      'Relacionar la monografía con los capítulos generales que cita.',
      'Aplicar las advertencias generales al interpretar un resultado.',
    ],
    conceptos: [
      { icono: 'FileText', termino: 'Partes de la monografía', definicion: 'Definición y contenido declarado, envasado y almacenamiento, estándares de referencia, identificación, valoración, impurezas y ensayos específicos de la forma farmacéutica.' },
      { icono: 'Network', termino: 'Capítulos generales citados', definicion: 'La monografía remite a capítulos que definen el método y, a veces, los criterios de aceptación completos, como en disolución o uniformidad.' },
      { icono: 'BookOpen', termino: 'Advertencias generales', definicion: 'Reglas que aplican a toda la farmacopea: cómo redondear, qué significa «aproximadamente», tolerancias de pesada, temperaturas de almacenamiento.' },
      { icono: 'Calculator', termino: 'Redondeo', definicion: 'Los resultados se redondean según las reglas de la farmacopea antes de compararlos con el límite, no antes.' },
    ],
    mapa: {
      centro: 'Leer una monografía completa',
      ramas: [
        { titulo: 'Encabezado', icono: 'FileText', nodos: ['Definición y contenido declarado', 'Envasado y almacenamiento', 'Estándares requeridos'] },
        { titulo: 'Ensayos', icono: 'FlaskConical', nodos: ['Identificación', 'Valoración', 'Impurezas', 'Ensayos de la forma farmacéutica'] },
        { titulo: 'Lo que remite', icono: 'Network', nodos: ['Capítulos generales', 'Criterios por etapas', 'Idoneidad del sistema'] },
        { titulo: 'Reglas comunes', icono: 'BookOpen', nodos: ['Advertencias generales', 'Redondeo', 'Tolerancias'] },
      ],
    },
    secciones: [
      {
        titulo: 'Las partes de una monografía',
        parrafos: [
          'Una monografía de producto suele empezar con la **definición** (qué es y el contenido aceptable del activo frente a lo declarado), sigue con **envasado y almacenamiento** y con los **estándares de referencia** necesarios, y luego describe los **ensayos**: identificación, valoración, impurezas o sustancias relacionadas, y los ensayos propios de la forma farmacéutica, como disolución y uniformidad de unidades de dosificación en tabletas, o pH y volumen en soluciones.',
          'Cada ensayo indica el método o remite a un **capítulo general**, y define las condiciones (columna, fase móvil, longitud de onda, medio de disolución) y los requisitos de **idoneidad del sistema**. La lectura cuidadosa evita errores: un detalle como la temperatura de la columna o el tiempo de equilibrio puede cambiar el resultado.',
        ],
      },
      {
        titulo: 'Lo que la monografía remite y las reglas comunes',
        parrafos: [
          'Muchos criterios completos no están en la monografía sino en el capítulo general. En el caso inicial, el capítulo de disolución define criterios por **etapas**: en la primera, cada unidad debe dar al menos Q + 5 %; si no se cumple, se pasa a una segunda etapa con más unidades y criterios sobre el promedio y los valores individuales, y así hasta una tercera. Reportar «no cumple» por una unidad en la primera etapa es un error de lectura: lo correcto era continuar a la siguiente etapa.',
          'Las **advertencias generales** definen reglas que aplican a toda la farmacopea: cómo redondear los resultados antes de compararlos con el límite, qué tolerancia admite una pesada indicada como «aproximadamente», qué significan los términos de almacenamiento o de solubilidad. Un laboratorio que no las conoce interpreta mal resultados que están bien medidos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Leer una monografía antes de analizar',
      pasos: [
        { titulo: 'Leer el encabezado', detalle: 'Anota el contenido aceptable, el almacenamiento y los estándares requeridos.', icono: 'FileText', evidencia: 'Hoja de trabajo con datos del encabezado.' },
        { titulo: 'Listar los ensayos', detalle: 'Enumera cada ensayo con su método y su criterio.', icono: 'ClipboardList', evidencia: 'Lista de ensayos.' },
        { titulo: 'Abrir los capítulos citados', detalle: 'Lee los capítulos generales a los que remite cada ensayo, incluidos los criterios por etapas.', icono: 'Network', evidencia: 'Referencias de capítulos anotadas.' },
        { titulo: 'Revisar las advertencias generales', detalle: 'Confirma las reglas de redondeo, tolerancias y términos que aplican.', icono: 'BookOpen', evidencia: 'Notas de interpretación.' },
        { titulo: 'Preparar la idoneidad', detalle: 'Prepara las soluciones de idoneidad del sistema y sus criterios.', icono: 'Gauge', evidencia: 'Criterios de idoneidad en la hoja.' },
      ],
    },
    caso: {
      titulo: 'Una unidad baja en disolución',
      contexto: 'En la primera etapa de un ensayo de disolución con Q = 80 %, cinco unidades dan entre 84 % y 90 % y una da 78 %.',
      pregunta: '¿Cuál es la decisión correcta?',
      opciones: [
        { texto: 'Reportar que no cumple por la unidad de 78 %.', correcta: false, retro: 'La primera etapa no se cumplió, pero el capítulo general prevé una segunda etapa antes de concluir.' },
        { texto: 'Continuar a la segunda etapa según el capítulo general de disolución y evaluar con sus criterios.', correcta: true, retro: 'El capítulo general define el criterio completo por etapas; se aplica antes de concluir.' },
        { texto: 'Repetir solo la unidad de 78 %.', correcta: false, retro: 'Repetir una unidad no está previsto; el procedimiento es pasar a la siguiente etapa.' },
      ],
    },
    errores: [
      { error: 'Leer solo la monografía y no los capítulos que cita.', correccion: 'Abre siempre los capítulos generales referenciados.' },
      { error: 'Redondear resultados intermedios.', correccion: 'Redondea según las advertencias generales, al final, antes de comparar con el límite.' },
    ],
    comprueba: [
      { pregunta: '¿Qué partes tiene una monografía de producto?', respuesta: 'Definición y contenido, envasado y almacenamiento, estándares, identificación, valoración, impurezas y ensayos de la forma farmacéutica.' },
      { pregunta: '¿Para qué sirven las advertencias generales?', respuesta: 'Definen reglas comunes de interpretación, como el redondeo y las tolerancias.' },
    ],
    resumen: [
      'Una monografía se lee **completa**: encabezado, ensayos y capítulos citados.',
      'Muchos criterios completos están en los **capítulos generales**.',
      'Las **advertencias generales** gobiernan la interpretación.',
    ],
    referencias: [REF.res3619, REF.trs957a1, REF.ichQ6A],
    imagenes: [
      { ubicacion: 'En la sección de partes', descripcion: 'Página de monografía ilustrada con secciones coloreadas y flechas hacia capítulos generales en la parte inferior.', alt: 'Partes de una monografía farmacopeica y sus capítulos generales' },
    ],
    keywords: ['cómo leer una monografía usp', 'monografía farmacopeica partes', 'capítulos generales usp', 'advertencias generales farmacopea', 'aplicar monografía en control de calidad'],
  },

  {
    titulo: 'Establecimiento de especificaciones (ICH Q6A)',
    duracion: 25,
    gancho: {
      titulo: 'Un límite que nadie supo defender',
      texto: 'En la evaluación de un registro, el evaluador pregunta por qué el límite de una impureza es 0,5 %. El equipo responde que «así venía en el documento del proyecto anterior». No había datos de lotes ni estudios de estabilidad ni análisis de seguridad que lo justificaran. Una especificación no se copia: se construye con datos. ICH Q6A explica cómo.',
    },
    objetivos: [
      'Diferenciar los ensayos universales de los específicos según ICH Q6A.',
      'Justificar criterios de aceptación con datos de desarrollo, lotes y estabilidad.',
      'Reconocer cuándo usar especificaciones de liberación y de vida útil distintas.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'Ensayos universales', definicion: 'Los que aplican a todo producto: descripción, identificación, valoración e impurezas.' },
      { icono: 'Puzzle', termino: 'Ensayos específicos', definicion: 'Dependen de la forma farmacéutica: disolución, uniformidad, agua, límites microbianos, pH, entre otros.' },
      { icono: 'LineChart', termino: 'Justificación', definicion: 'Cada criterio se sustenta en datos de lotes de desarrollo y de escala, estabilidad, capacidad del método y relevancia clínica o de seguridad.' },
      { icono: 'CalendarClock', termino: 'Liberación y vida útil', definicion: 'Pueden tener criterios distintos cuando el atributo cambia durante el almacenamiento, siempre justificado.' },
    ],
    mapa: {
      centro: 'Construir una especificación',
      ramas: [
        { titulo: 'Qué ensayos', icono: 'Layers', nodos: ['Universales', 'Específicos de la forma', 'Árboles de decisión de Q6A'] },
        { titulo: 'Con qué datos', icono: 'LineChart', nodos: ['Lotes de desarrollo y escala', 'Estabilidad', 'Capacidad del método'] },
        { titulo: 'Con qué límites', icono: 'Target', nodos: ['Relevancia clínica', 'Seguridad (ICH Q3)', 'Farmacopea'] },
        { titulo: 'En qué momento', icono: 'CalendarClock', nodos: ['Liberación', 'Vida útil', 'Revisión periódica'] },
      ],
    },
    secciones: [
      {
        titulo: 'Ensayos universales y específicos',
        parrafos: [
          'ICH Q6A propone ensayos **universales** para todos los productos y principios activos: **descripción**, **identificación**, **valoración** e **impurezas**. Luego agrega ensayos **específicos** según la forma farmacéutica: para formas orales sólidas, por ejemplo, disolución o desintegración, dureza y friabilidad cuando sean relevantes, uniformidad de unidades de dosificación, contenido de agua y límites microbianos; para líquidos orales, pH, uniformidad en envases multidosis, contenido de conservante, entre otros.',
          'La guía incluye **árboles de decisión** que ayudan a decidir, por ejemplo, si un ensayo de disolución debe tener un punto o varios, si se requiere un ensayo de polimorfismo o si se pueden omitir ciertos ensayos microbianos con base en datos.',
        ],
      },
      {
        titulo: 'Justificar los límites',
        parrafos: [
          'Un criterio de aceptación se **justifica** con datos: los resultados de los lotes de desarrollo y de escala, la variabilidad del proceso, la capacidad del método analítico, los datos de estabilidad y la relevancia clínica o de seguridad. Para impurezas, los límites se apoyan en los umbrales de ICH Q3A y Q3B y en la calificación de seguridad. Un límite demasiado amplio no protege al paciente; uno demasiado estrecho rechaza lotes buenos por la variabilidad normal.',
          'La guía admite criterios distintos para **liberación** y para **vida útil** cuando un atributo cambia durante el almacenamiento, por ejemplo un contenido que disminuye ligeramente: el límite de liberación más estrecho asegura que el producto llegue al final de su vida útil dentro del límite de vida útil. Esa diferencia debe justificarse con datos de estabilidad. Las especificaciones se revisan cuando se acumula experiencia de fabricación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Proponer una especificación para un producto nuevo',
      pasos: [
        { titulo: 'Definir el perfil de calidad', detalle: 'Identifica los atributos críticos de calidad del producto.', icono: 'Target', evidencia: 'Perfil de calidad.' },
        { titulo: 'Elegir los ensayos', detalle: 'Aplica los ensayos universales y los específicos de la forma, con los árboles de decisión de Q6A.', icono: 'Layers', evidencia: 'Lista de ensayos justificada.' },
        { titulo: 'Reunir datos', detalle: 'Compila resultados de lotes, estabilidad y validación de métodos.', icono: 'Database', evidencia: 'Tabla de datos de lotes.' },
        { titulo: 'Proponer límites', detalle: 'Establece criterios con base en datos, seguridad, farmacopea y relevancia clínica.', icono: 'Target', evidencia: 'Propuesta de límites con justificación.' },
        { titulo: 'Definir liberación y vida útil', detalle: 'Si el atributo cambia, define criterios para cada momento y justifícalos.', icono: 'CalendarClock', evidencia: 'Especificaciones de liberación y vida útil.' },
        { titulo: 'Revisar con experiencia', detalle: 'Revisa las especificaciones con los datos de fabricación comercial.', icono: 'RefreshCw', evidencia: 'Revisión periódica.' },
      ],
    },
    caso: {
      titulo: 'Un contenido que baja con el tiempo',
      contexto: 'Los datos de estabilidad muestran que el contenido de un activo baja en promedio 2 % durante la vida útil. El límite de vida útil es 90,0–110,0 %.',
      pregunta: '¿Qué límite de liberación es razonable proponer?',
      opciones: [
        { texto: 'El mismo 90,0–110,0 %: si cumple al liberar, cumple siempre.', correcta: false, retro: 'Un lote liberado en 90,5 % podría terminar por debajo de 90,0 % antes de vencer.' },
        { texto: 'Un límite de liberación más estrecho en el extremo inferior, por ejemplo 95,0–105,0 %, justificado con la pérdida observada y la variabilidad del método.', correcta: true, retro: 'Así el producto conserva margen para seguir cumpliendo el límite de vida útil, y la justificación queda en los datos.' },
        { texto: 'Un límite de liberación más amplio para no rechazar lotes.', correcta: false, retro: 'Ampliar la liberación aumenta el riesgo de que el producto no cumpla durante su vida útil.' },
      ],
    },
    errores: [
      { error: 'Copiar límites de otro producto.', correccion: 'Justifica cada límite con datos del propio producto.' },
      { error: 'Ignorar la variabilidad del método al fijar límites.', correccion: 'Considera la capacidad del método junto con la del proceso.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los ensayos universales de ICH Q6A?', respuesta: 'Descripción, identificación, valoración e impurezas.' },
      { pregunta: '¿Por qué pueden diferir los límites de liberación y de vida útil?', respuesta: 'Porque algunos atributos cambian durante el almacenamiento; un límite de liberación más estrecho asegura el cumplimiento durante toda la vida útil.' },
    ],
    resumen: [
      'Q6A: ensayos **universales** más ensayos **específicos** de la forma.',
      'Cada límite se **justifica con datos**.',
      'Liberación y vida útil pueden tener **criterios distintos**, justificados.',
    ],
    referencias: [REF.ichQ6A, REF.ichQ3A, REF.ichQ1A, REF.res3619],
    imagenes: [
      { ubicacion: 'Junto al caso', descripcion: 'Gráfico de estabilidad ilustrado: contenido que desciende en el tiempo, con bandas de límite de liberación y de vida útil en colores de marca.', alt: 'Límites de liberación y de vida útil frente a la tendencia de estabilidad' },
    ],
    keywords: ['ich q6a en español', 'especificaciones ich q6a', 'ensayos universales y específicos', 'justificación de especificaciones', 'especificación de liberación y vida útil', 'cómo establecer especificaciones farmacéuticas'],
  },

  {
    titulo: 'Planes de muestreo y tamaño de muestra',
    duracion: 25,
    gancho: {
      titulo: 'Tres cajas de la parte de arriba',
      texto: 'Para analizar un lote de 2.000 cajas de producto terminado, alguien toma tres cajas de la parte superior del primer estibado, porque son las más fáciles de alcanzar. Si hubo un problema al final del envasado, esas cajas nunca lo mostrarán. El resultado del laboratorio solo vale tanto como la muestra que lo produjo. Muestrear bien es la primera condición de un análisis confiable.',
    },
    objetivos: [
      'Explicar qué hace representativa a una muestra.',
      'Describir planes de muestreo para materias primas y producto terminado.',
      'Reconocer los requisitos de muestras de retención.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'Muestra representativa', definicion: 'Porción de un lote que refleja sus características, tomada según un plan que considere la homogeneidad del material y los riesgos.' },
      { icono: 'Sigma', termino: 'Plan de muestreo', definicion: 'Define cuántos contenedores o unidades se muestrean, de dónde, con qué técnica y cuánta muestra se toma.' },
      { icono: 'Shuffle', termino: 'Muestreo aleatorio o estratificado', definicion: 'Selección al azar o por partes del lote (inicio, mitad, final) para evitar sesgos.' },
      { icono: 'Archive', termino: 'Muestra de retención', definicion: 'Cantidad reservada de cada lote para análisis futuros, conservada en las condiciones del producto durante el tiempo definido.' },
    ],
    mapa: {
      centro: 'Una muestra que represente el lote',
      ramas: [
        { titulo: 'Cuánto', icono: 'Sigma', nodos: ['Número de contenedores o unidades', 'Cantidad para ensayos y repeticiones', 'Retención'] },
        { titulo: 'De dónde', icono: 'MapPin', nodos: ['Aleatorio', 'Estratificado por inicio, mitad y final', 'Puntos de riesgo'] },
        { titulo: 'Cómo', icono: 'TestTube', nodos: ['Técnica y herramientas limpias', 'Área de muestreo', 'Identificación de la muestra'] },
        { titulo: 'Referencias', icono: 'BookOpen', nodos: ['OMS TRS 929, Anexo 4', 'Normas de muestreo por atributos', 'Procedimiento interno'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué hace representativa a una muestra',
        parrafos: [
          'Una muestra es representativa cuando sus características reflejan las del lote. Eso depende de la **homogeneidad** del material, del **número** de unidades o contenedores muestreados, de **dónde** se toman y de la **técnica**. La guía de la OMS sobre muestreo (TRS 929, Anexo 4) describe planes para materias primas según la homogeneidad del lote y la confianza en el proveedor, como los planes basados en la raíz cuadrada del número de contenedores, y enfatiza la seguridad, la limpieza de las herramientas y la protección de la muestra.',
          'Para producto terminado, el plan suele **estratificar** el muestreo a lo largo del proceso (inicio, mitad y final de la compresión o del envasado) para que la muestra incluya posibles variaciones en el tiempo. Para atributos que se inspeccionan por conteo, como defectos de envase, se usan planes de muestreo por atributos con niveles de inspección y de calidad aceptable definidos.',
        ],
      },
      {
        titulo: 'Cantidad, identificación y retención',
        parrafos: [
          'La cantidad de muestra debe alcanzar para todos los ensayos de la especificación, para posibles repeticiones dentro de una investigación y para la **muestra de retención**. Cada muestra se rotula con el material, el lote, la fecha, el punto de muestreo y quién la tomó, y se registra su cadena de custodia hasta el laboratorio.',
          'Las BPM piden conservar **muestras de retención** de cada lote de producto terminado y de las materias primas, en cantidad suficiente para al menos un análisis completo, en las condiciones de almacenamiento del producto y durante el tiempo definido por la normativa y la empresa. Sirven para investigar quejas, desviaciones o dudas sobre un lote ya distribuido.',
        ],
      },
    ],
    proceso: {
      titulo: 'Muestreo estratificado de un lote de tabletas envasadas',
      pasos: [
        { titulo: 'Definir el plan', detalle: 'Establece cuántas unidades tomar en cada momento del envasado según el procedimiento.', icono: 'Sigma', evidencia: 'Plan de muestreo aprobado.' },
        { titulo: 'Tomar al inicio', detalle: 'Muestrea las primeras unidades después del ajuste de la línea.', icono: 'Timer', evidencia: 'Registro con hora de muestreo.' },
        { titulo: 'Tomar a mitad', detalle: 'Muestrea en la mitad del proceso, sin elegir unidades «bonitas».', icono: 'Shuffle', evidencia: 'Registro con hora.' },
        { titulo: 'Tomar al final', detalle: 'Muestrea las últimas unidades del lote.', icono: 'Flag', evidencia: 'Registro con hora.' },
        { titulo: 'Rotular y custodiar', detalle: 'Identifica cada muestra y entrégala al laboratorio con su cadena de custodia.', icono: 'Tag', evidencia: 'Rótulos y cadena de custodia.' },
        { titulo: 'Reservar la retención', detalle: 'Separa la muestra de retención en las condiciones del producto.', icono: 'Archive', evidencia: 'Registro de retenciones.' },
      ],
    },
    caso: {
      titulo: 'Las cajas más accesibles',
      contexto: 'El auxiliar de almacén toma las muestras de producto terminado de las cajas del estibado superior porque «es más rápido y todas son del mismo lote».',
      pregunta: '¿Qué corriges?',
      opciones: [
        { texto: 'Nada: todas las cajas son del mismo lote.', correcta: false, retro: 'Ser del mismo lote no garantiza homogeneidad en el tiempo de envasado; las variaciones se concentran en momentos concretos.' },
        { texto: 'El muestreo debe seguir un plan aleatorio o estratificado que represente todo el lote, idealmente durante el proceso; se reentrena y se revisa el procedimiento.', correcta: true, retro: 'La representatividad depende del plan, no de la comodidad.' },
        { texto: 'Tomar más cajas del estibado superior.', correcta: false, retro: 'Más muestras sesgadas siguen siendo sesgadas.' },
      ],
    },
    errores: [
      { error: 'Muestrear por comodidad.', correccion: 'Sigue un plan aleatorio o estratificado escrito.' },
      { error: 'Muestra insuficiente para repeticiones.', correccion: 'Calcula la cantidad para todos los ensayos, posibles investigaciones y retención.' },
    ],
    comprueba: [
      { pregunta: '¿Qué hace representativa a una muestra?', respuesta: 'Un plan que considere la homogeneidad, el número de unidades, dónde se toman y la técnica.' },
      { pregunta: '¿Para qué sirven las muestras de retención?', respuesta: 'Para investigar quejas, desviaciones o dudas sobre un lote ya distribuido.' },
    ],
    resumen: [
      'Un resultado vale **lo que vale su muestra**.',
      'El muestreo sigue un **plan** aleatorio o estratificado.',
      'Las **muestras de retención** permiten investigar después.',
    ],
    referencias: [REF.trs929a4, REF.res3619, REF.trs986a2, REF.res1160],
    imagenes: [
      { ubicacion: 'En la sección de representatividad', descripcion: 'Línea de envasado ilustrada con tres puntos de muestreo marcados (inicio, mitad, final) y un reloj sobre cada uno.', alt: 'Muestreo estratificado de un lote durante el envasado' },
    ],
    keywords: ['plan de muestreo farmacéutico', 'tamaño de muestra control de calidad', 'muestreo representativo', 'muestreo estratificado', 'muestras de retención', 'trs 929 anexo 4 muestreo'],
  },

  {
    titulo: 'Control de calidad de materias primas',
    duracion: 25,
    gancho: {
      titulo: 'Un certificado perfecto y un material equivocado',
      texto: 'Un proveedor entrega un activo con un certificado de análisis impecable. El laboratorio, por presión de tiempo, aprueba con base en el certificado y una prueba de identidad por punto de fusión. Meses después, una investigación revela que el material tenía otra forma polimórfica, con menor solubilidad: los lotes fabricados con él tuvieron disolución baja. Controlar una materia prima es más que confirmar su nombre.',
    },
    objetivos: [
      'Describir los ensayos habituales de una materia prima activa y de un excipiente.',
      'Explicar cuándo puede usarse el certificado del proveedor y con qué condiciones.',
      'Relacionar las propiedades de la materia prima con el desempeño del producto.',
    ],
    conceptos: [
      { icono: 'Fingerprint', termino: 'Identidad', definicion: 'Confirmación de que el material es lo que dice ser, con técnicas específicas como la espectroscopia infrarroja.' },
      { icono: 'Target', termino: 'Pureza y valoración', definicion: 'Contenido del componente principal e impurezas, incluidos solventes residuales y metales cuando aplica.' },
      { icono: 'Atom', termino: 'Propiedades fisicoquímicas', definicion: 'Tamaño de partícula, forma polimórfica, densidad o humedad, que pueden afectar la fabricación y la disolución.' },
      { icono: 'BadgeCheck', termino: 'Uso del certificado del proveedor', definicion: 'Posible para algunos ensayos si el proveedor está calificado y se verifica periódicamente su confiabilidad, pero la identidad se confirma en el laboratorio.' },
    ],
    mapa: {
      centro: 'Controlar una materia prima',
      ramas: [
        { titulo: 'Identidad', icono: 'Fingerprint', nodos: ['IR u otra técnica específica', 'Por contenedor según procedimiento'] },
        { titulo: 'Pureza', icono: 'Search', nodos: ['Valoración', 'Impurezas y solventes', 'Microbiología si aplica'] },
        { titulo: 'Propiedades', icono: 'Atom', nodos: ['Tamaño de partícula', 'Polimorfismo', 'Humedad y densidad'] },
        { titulo: 'Proveedor', icono: 'BadgeCheck', nodos: ['Calificación', 'Uso del certificado', 'Verificación periódica'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué se controla y por qué',
        parrafos: [
          'Una materia prima activa se controla normalmente con **identificación** (por ejemplo, espectroscopia infrarroja comparada con un estándar), **valoración**, **impurezas** o sustancias relacionadas, **solventes residuales**, contenido de **agua** y otros ensayos de su monografía o especificación. Para los excipientes se aplican sus monografías, con atención a contaminantes conocidos: la glicerina y otros, por ejemplo, se controlan por dietilenglicol y etilenglicol.',
          'Además de la calidad química, importan las **propiedades fisicoquímicas** que afectan el proceso y el desempeño: tamaño de partícula y forma polimórfica del activo (que influyen en la disolución), densidad y fluidez (que influyen en la compresión) y humedad. Si el desarrollo mostró que una propiedad es crítica, debe estar en la especificación aunque la monografía no la exija, como en el caso del polimorfo.',
        ],
      },
      {
        titulo: 'El certificado del proveedor',
        parrafos: [
          'Las BPM permiten, en ciertas condiciones, apoyarse en el **certificado de análisis del proveedor** para algunos ensayos: el proveedor debe estar **calificado** (evaluación, auditoría cuando corresponda, historial), y el laboratorio debe verificar periódicamente la confiabilidad del certificado analizando lotes completos. Aun así, la **identidad** se confirma en el laboratorio sobre las muestras, según el procedimiento.',
          'El laboratorio también revisa la coherencia del certificado: que corresponda al lote recibido, que use métodos equivalentes y que los resultados sean consistentes con el historial. Un certificado que parece «demasiado perfecto» o idéntico lote tras lote merece atención: la integridad de los datos del proveedor también se evalúa.',
        ],
      },
    ],
    proceso: {
      titulo: 'Análisis de una materia prima activa',
      pasos: [
        { titulo: 'Revisar el certificado', detalle: 'Verifica que corresponda al lote, al proveedor calificado y a la especificación.', icono: 'FileSearch', evidencia: 'Revisión del certificado.' },
        { titulo: 'Confirmar identidad', detalle: 'Analiza la identidad de las muestras según el procedimiento, con técnica específica.', icono: 'Fingerprint', evidencia: 'Espectros y resultados de identidad.' },
        { titulo: 'Ejecutar ensayos de la especificación', detalle: 'Valoración, impurezas, agua, solventes y propiedades críticas.', icono: 'FlaskConical', evidencia: 'Resultados analíticos.' },
        { titulo: 'Evaluar propiedades críticas', detalle: 'Tamaño de partícula, polimorfismo u otras si el desarrollo las identificó.', icono: 'Atom', evidencia: 'Resultados de propiedades.' },
        { titulo: 'Aprobar o rechazar', detalle: 'Con todos los resultados conformes, se aprueba con fecha de reanálisis.', icono: 'BadgeCheck', evidencia: 'Dictamen y rótulo de estado.' },
      ],
    },
    caso: {
      titulo: 'El proveedor de toda la vida',
      contexto: 'Un proveedor con diez años de historial impecable cambia su sitio de fabricación del activo. Sus certificados siguen igual de perfectos.',
      pregunta: '¿Qué hace el laboratorio?',
      opciones: [
        { texto: 'Seguir aprobando con el certificado: el proveedor es confiable.', correcta: false, retro: 'Un cambio de sitio es un cambio relevante: la confiabilidad se demostró para el sitio anterior.' },
        { texto: 'Gestionar el cambio: analizar lotes completos del nuevo sitio, incluidas propiedades críticas como polimorfismo y tamaño de partícula, y reevaluar la calificación del proveedor.', correcta: true, retro: 'El cambio de sitio puede cambiar el perfil de impurezas o las propiedades físicas; se verifica con datos antes de confiar en el certificado.' },
        { texto: 'Pedir al proveedor un certificado firmado por su gerente.', correcta: false, retro: 'Más firmas no aportan evidencia técnica.' },
      ],
    },
    errores: [
      { error: 'Aprobar solo con el certificado del proveedor.', correccion: 'Confirma la identidad y verifica periódicamente lotes completos.' },
      { error: 'Ignorar propiedades físicas críticas.', correccion: 'Incluye en la especificación las propiedades que el desarrollo identificó como críticas.' },
    ],
    comprueba: [
      { pregunta: '¿Qué condiciones permiten usar el certificado del proveedor?', respuesta: 'Proveedor calificado y verificación periódica de la confiabilidad del certificado; la identidad se confirma en el laboratorio.' },
      { pregunta: '¿Por qué importa la forma polimórfica?', respuesta: 'Porque puede cambiar la solubilidad y la disolución del producto.' },
    ],
    resumen: [
      'Se controlan **identidad, pureza y propiedades críticas**.',
      'El certificado del proveedor se usa **con calificación y verificación**.',
      'La identidad se **confirma siempre** en el laboratorio.',
    ],
    referencias: [REF.trs986a2, REF.res3619, REF.ichQ6A, REF.trs929a4],
    imagenes: [
      { ubicacion: 'En la sección de propiedades', descripcion: 'Dos cristales ilustrados de la misma molécula con formas distintas y una flecha hacia curvas de disolución diferentes.', alt: 'Polimorfismo y su efecto en la disolución' },
    ],
    keywords: ['control de calidad de materias primas', 'análisis de materias primas farmacéuticas', 'identidad de materias primas', 'certificado de análisis del proveedor', 'polimorfismo farmacéutico', 'calificación de proveedores de materias primas'],
  },

  {
    titulo: 'Control de calidad de material de envase y empaque',
    duracion: 20,
    gancho: {
      titulo: 'El frasco que dejaba pasar la humedad',
      texto: 'Un producto higroscópico perdía potencia antes de su vencimiento solo en un lote de frascos. El activo y el proceso estaban bien. El problema estaba en el envase: un lote de frascos con una tapa que no sellaba según lo especificado. El material de envase no es un accesorio: protege al producto durante toda su vida útil y lleva la información que el paciente necesita.',
    },
    objetivos: [
      'Diferenciar envase primario, secundario y material impreso.',
      'Describir los ensayos de control del material de envase.',
      'Aplicar planes de inspección por atributos a defectos de envase.',
    ],
    conceptos: [
      { icono: 'Package', termino: 'Envase primario', definicion: 'El que está en contacto directo con el producto: frasco, blíster, ampolla, tapón. Debe proteger y no interactuar con el producto.' },
      { icono: 'Box', termino: 'Envase secundario', definicion: 'El que contiene al primario, como la plegadiza. Protege y lleva información.' },
      { icono: 'Tag', termino: 'Material impreso', definicion: 'Etiquetas, plegadizas e insertos cuyo texto y arte deben coincidir con lo aprobado.' },
      { icono: 'Search', termino: 'Defectos', definicion: 'Se clasifican como críticos, mayores o menores según su riesgo, y se inspeccionan con planes por atributos.' },
    ],
    mapa: {
      centro: 'Control del material de envase',
      ramas: [
        { titulo: 'Identidad y materiales', icono: 'Package', nodos: ['Material correcto', 'Especificación del proveedor', 'Compatibilidad con el producto'] },
        { titulo: 'Dimensiones y función', icono: 'Ruler', nodos: ['Medidas críticas', 'Cierre y hermeticidad', 'Funcionamiento en línea'] },
        { titulo: 'Impresos', icono: 'Tag', nodos: ['Texto y arte aprobados', 'Códigos y colores', 'Legibilidad'] },
        { titulo: 'Defectos', icono: 'Search', nodos: ['Críticos, mayores, menores', 'Plan por atributos', 'Decisión del lote'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué se controla',
        parrafos: [
          'El material de envase se controla según su función. Para el **envase primario** importan la identidad del material (vidrio, tipo de plástico, elastómero), las **dimensiones críticas** que aseguran el cierre y el funcionamiento en la línea, la **hermeticidad** del sistema de cierre, y su compatibilidad con el producto, que se demostró en el desarrollo con estudios de estabilidad en ese envase. Para el vidrio de inyectables, la farmacopea define tipos y ensayos.',
          'Para el **material impreso**, el control verifica que el texto, el arte, los colores, los códigos y la legibilidad coincidan exactamente con la versión aprobada, que a su vez coincide con el registro sanitario. Un error en una concentración o en una advertencia puede causar un error de medicación.',
        ],
      },
      {
        titulo: 'Defectos y planes de inspección',
        parrafos: [
          'Los defectos se clasifican por su riesgo. Un defecto **crítico** puede afectar la seguridad del paciente o la integridad del producto: por ejemplo, una concentración mal impresa o un frasco con fisura. Un defecto **mayor** puede afectar la función o el uso: una tapa que no cierra bien. Un defecto **menor** afecta la apariencia sin consecuencia funcional.',
          'La inspección se hace con **planes de muestreo por atributos**, que definen cuántas unidades inspeccionar y cuántos defectos de cada clase se aceptan, con criterios más estrictos para los críticos. Si el lote supera los límites, se rechaza o se gestiona con el proveedor. El historial de cada proveedor alimenta su calificación y la frecuencia de inspección.',
        ],
      },
    ],
    proceso: {
      titulo: 'Inspección de un lote de plegadizas',
      pasos: [
        { titulo: 'Verificar la recepción', detalle: 'Confirma proveedor aprobado, lote, cantidad y estado del embalaje.', icono: 'Truck', evidencia: 'Registro de recepción.' },
        { titulo: 'Muestrear por atributos', detalle: 'Toma el número de unidades que indica el plan de inspección.', icono: 'Sigma', evidencia: 'Plan aplicado.' },
        { titulo: 'Comparar con el arte aprobado', detalle: 'Verifica texto, colores, códigos y dimensiones contra el estándar aprobado.', icono: 'FileSearch', evidencia: 'Lista de verificación.' },
        { titulo: 'Clasificar defectos', detalle: 'Cuenta los defectos críticos, mayores y menores.', icono: 'AlertTriangle', evidencia: 'Conteo de defectos.' },
        { titulo: 'Decidir', detalle: 'Aprueba o rechaza según los límites del plan.', icono: 'Gavel', evidencia: 'Dictamen y rótulo de estado.' },
      ],
    },
    caso: {
      titulo: 'Una sola plegadiza con otra concentración',
      contexto: 'En la inspección de un lote de plegadizas de 500 mg, aparece una plegadiza impresa con 250 mg. Las demás muestras están bien.',
      pregunta: '¿Cómo se maneja?',
      opciones: [
        { texto: 'Aceptar el lote: es un solo defecto.', correcta: false, retro: 'Una concentración equivocada es un defecto crítico; su presencia indica una posible mezcla en la imprenta.' },
        { texto: 'Clasificarlo como crítico, rechazar o retener el lote, notificar al proveedor e investigar el alcance de la mezcla.', correcta: true, retro: 'Los defectos críticos suelen tener aceptación cero: un solo hallazgo puede significar muchas más unidades mezcladas.' },
        { texto: 'Retirar la plegadiza y aprobar el resto.', correcta: false, retro: 'Retirar la unidad encontrada no garantiza que no haya otras en el lote.' },
      ],
    },
    errores: [
      { error: 'Inspeccionar el material impreso sin un estándar aprobado.', correccion: 'Compara siempre contra la versión aprobada vigente.' },
      { error: 'Tratar todos los defectos igual.', correccion: 'Clasifícalos por riesgo y aplica criterios distintos.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre envase primario y secundario?', respuesta: 'El primario está en contacto con el producto; el secundario contiene al primario.' },
      { pregunta: 'Da un ejemplo de defecto crítico.', respuesta: 'Una concentración mal impresa o un frasco con fisura.' },
    ],
    resumen: [
      'El envase **protege** al producto y **informa** al paciente.',
      'Se controlan materiales, dimensiones, cierre e **impresos**.',
      'Los defectos se clasifican y se inspeccionan **por atributos**.',
    ],
    referencias: [REF.trs986a2, REF.res1160, REF.res3619],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Despiece ilustrado de un producto: blíster (primario), plegadiza (secundario) e inserto, con etiquetas en colores de marca.', alt: 'Envase primario, secundario y material impreso' },
    ],
    keywords: ['control de calidad material de envase', 'envase primario y secundario', 'inspección de material de empaque', 'defectos críticos mayores menores envase', 'control de calidad material impreso'],
  },

  {
    titulo: 'Estándares de referencia primarios y secundarios: tipos, calificación y manejo',
    duracion: 25,
    gancho: {
      titulo: 'Todo resultado se compara con algo',
      texto: 'Una valoración por HPLC no mide el contenido de forma absoluta: compara la respuesta de la muestra con la de un estándar de pureza conocida. Si el estándar se degradó o se usó vencido, todos los resultados del día están mal, aunque el equipo, el método y el analista sean impecables. El estándar de referencia es el ancla de la medición.',
    },
    objetivos: [
      'Diferenciar estándares primarios y secundarios.',
      'Describir la calificación de un estándar secundario frente a uno primario.',
      'Aplicar buenas prácticas de almacenamiento, uso y control de vigencia.',
    ],
    conceptos: [
      { icono: 'Award', termino: 'Estándar primario', definicion: 'Sustancia de referencia de alta pureza, establecida por una farmacopea u organismo reconocido, que se usa sin calificación adicional para el propósito indicado.' },
      { icono: 'BadgeCheck', termino: 'Estándar secundario', definicion: 'Estándar de trabajo calificado por el laboratorio frente a un primario, para uso rutinario.' },
      { icono: 'CalendarClock', termino: 'Vigencia', definicion: 'Periodo en que el estándar se considera apto: lote vigente del primario o fecha de recalificación del secundario.' },
      { icono: 'Thermometer', termino: 'Condiciones', definicion: 'Almacenamiento según la etiqueta (temperatura, luz, humedad) y manipulación que evite contaminación o degradación.' },
    ],
    mapa: {
      centro: 'El ancla de la medición',
      ramas: [
        { titulo: 'Primarios', icono: 'Award', nodos: ['Farmacopeas u organismos reconocidos', 'Uso sin calificación adicional', 'Lote vigente'] },
        { titulo: 'Secundarios', icono: 'BadgeCheck', nodos: ['Calificados frente al primario', 'Uso rutinario', 'Recalificación periódica'] },
        { titulo: 'Manejo', icono: 'Thermometer', nodos: ['Condiciones de la etiqueta', 'Registro de uso', 'Secado si la monografía lo pide'] },
        { titulo: 'Riesgos', icono: 'AlertTriangle', nodos: ['Vencimiento', 'Degradación', 'Contaminación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Primarios y secundarios',
        parrafos: [
          'Un **estándar primario** es una sustancia de referencia de alta pureza establecida por una farmacopea u organismo reconocido, que se usa sin necesidad de calificación adicional para el propósito para el que fue establecido. Los estándares de las farmacopeas son el ejemplo más común. La guía de la OMS sobre sustancias químicas de referencia (TRS 943, Anexo 3) describe cómo se establecen, mantienen y distribuyen.',
          'Como los primarios son costosos y escasos, el laboratorio suele preparar **estándares secundarios** o de trabajo: lotes de la sustancia caracterizados y **calificados frente al primario**. La calificación incluye identidad, pureza y la asignación del contenido o potencia con un número suficiente de determinaciones, y define una fecha de recalificación. El secundario solo vale mientras su calificación esté vigente.',
        ],
      },
      {
        titulo: 'Manejo y control de vigencia',
        parrafos: [
          'Los estándares se almacenan según las condiciones de su etiqueta, se manipulan para evitar contaminación (por ejemplo, sin devolver material sobrante al frasco) y, si la monografía lo indica, se secan antes de usarlos. Cada uso se **registra**: quién, cuándo, cuánto y para qué análisis, de modo que si un estándar resulta defectuoso se pueda identificar qué resultados se afectaron.',
          'Usar un estándar **vencido** o con la recalificación vencida es una desviación, aunque los resultados parezcan correctos. El caso integrador de este curso lo muestra: un lote que cumple todos los ensayos no puede liberarse si el estándar usado tenía su recalificación vencida, hasta evaluar el impacto con un estándar vigente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Calificación de un estándar secundario',
      pasos: [
        { titulo: 'Seleccionar el lote candidato', detalle: 'Elige un lote de la sustancia de alta pureza y suficiente cantidad.', icono: 'Package', evidencia: 'Identificación del lote candidato.' },
        { titulo: 'Confirmar identidad', detalle: 'Compara con el primario por técnicas específicas.', icono: 'Fingerprint', evidencia: 'Espectros comparados.' },
        { titulo: 'Evaluar pureza', detalle: 'Determina impurezas, agua y solventes.', icono: 'Search', evidencia: 'Resultados de pureza.' },
        { titulo: 'Asignar contenido', detalle: 'Valora frente al primario con réplicas suficientes y calcula el contenido asignado.', icono: 'Calculator', evidencia: 'Cálculo con estadística.' },
        { titulo: 'Documentar y rotular', detalle: 'Emite el certificado interno con contenido, condiciones y fecha de recalificación.', icono: 'Tag', evidencia: 'Certificado y rótulo.' },
        { titulo: 'Controlar el uso', detalle: 'Registra cada uso y recalifica antes de la fecha definida.', icono: 'CalendarClock', evidencia: 'Registro de uso y recalificación.' },
      ],
    },
    caso: {
      titulo: 'El estándar vencido ayer',
      contexto: 'Al revisar los datos de una valoración, el supervisor nota que el estándar secundario usado tenía su recalificación vencida desde el día anterior. Los resultados del lote cumplen.',
      pregunta: '¿Qué corresponde?',
      opciones: [
        { texto: 'Aceptar: un día no cambia nada.', correcta: false, retro: 'Sin evidencia, no se sabe si el estándar sigue siendo apto. Un día o un año, la vigencia es un criterio definido.' },
        { texto: 'Abrir una desviación, evaluar el impacto repitiendo con un estándar vigente o recalificando el estándar, y solo con evidencia continuar con la liberación.', correcta: true, retro: 'La decisión se apoya en datos, no en la intuición de que «seguramente está bien».' },
        { texto: 'Cambiar la fecha de recalificación en el rótulo.', correcta: false, retro: 'Modificar el rótulo sin recalificar es una falla grave de integridad.' },
      ],
    },
    errores: [
      { error: 'Devolver material sobrante al frasco del estándar.', correccion: 'Toma la cantidad necesaria y desecha el sobrante.' },
      { error: 'No registrar los usos del estándar.', correccion: 'Registra cada uso para poder rastrear el impacto de un estándar defectuoso.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre un estándar primario y uno secundario?', respuesta: 'El primario lo establece un organismo reconocido y se usa sin calificación adicional; el secundario se califica frente al primario.' },
      { pregunta: '¿Qué pasa si se usa un estándar con la recalificación vencida?', respuesta: 'Es una desviación: hay que evaluar el impacto con evidencia antes de usar los resultados.' },
    ],
    resumen: [
      'El estándar es el **ancla** de la medición.',
      'Los **secundarios** se califican frente a primarios y se recalifican.',
      'Vigencia, condiciones y **registro de uso** se controlan siempre.',
    ],
    referencias: [REF.trs943a3, REF.res3619, REF.trs957a1],
    imagenes: [
      { ubicacion: 'En la sección de primarios y secundarios', descripcion: 'Dos frascos ilustrados: uno con sello de farmacopea (primario) y otro con etiqueta interna (secundario), unidos por una flecha de calificación.', alt: 'Calificación de un estándar secundario frente a uno primario' },
    ],
    keywords: ['estándar de referencia primario y secundario', 'calificación de estándares secundarios', 'sustancias de referencia farmacéuticas', 'estándar de trabajo laboratorio', 'trs 943 anexo 3', 'manejo de estándares de referencia'],
  },
];

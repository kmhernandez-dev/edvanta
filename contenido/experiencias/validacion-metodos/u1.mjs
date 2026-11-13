/** Curso de Validación de Métodos Analíticos · Unidad 1. Fundamentos y marco regulatorio */
import { REF } from '../referencias.mjs';

const U1 = 'Unidad 1. Fundamentos y marco regulatorio de la validación analítica';

export default [
  {
    titulo: 'Introducción al curso',
    unidad: U1,
    duracion: 15,
    gancho: {
      titulo: '¿Cómo sabes que tu número es verdad?',
      texto: 'Un laboratorio reporta 99,6 % de contenido para un lote. El número aparece en el certificado, el lote se libera y un paciente lo toma. Pero ¿cómo sabemos que ese 99,6 % no es 96 % o 103 %? La respuesta no está en el resultado: está en el método que lo produjo. Validar un método es demostrar, con datos, que sus resultados merecen confianza. Este curso te enseña a hacerlo de principio a fin.',
    },
    objetivos: [
      'Explicar qué es la validación de un método analítico y por qué se exige.',
      'Reconocer las preguntas que responde cada característica de desempeño.',
      'Ubicar el recorrido del curso desde el marco normativo hasta los casos prácticos.',
    ],
    conceptos: [
      { icono: 'FlaskConical', termino: 'Método analítico', definicion: 'La descripción completa de cómo se analiza una muestra: preparación, equipo, condiciones, cálculos y criterios.' },
      { icono: 'ClipboardCheck', termino: 'Validación', definicion: 'Demostración documentada de que el método es apto para su propósito: que sus características de desempeño cumplen lo requerido.' },
      { icono: 'Target', termino: 'Propósito', definicion: 'Lo que el método debe medir y con qué calidad: por ejemplo, el contenido de un activo entre 80 % y 120 % con exactitud y precisión definidas.' },
      { icono: 'Layers', termino: 'Ciclo de vida', definicion: 'El método se desarrolla, se valida, se usa en rutina, se vigila y se mejora; la validación no es un evento aislado.' },
    ],
    mapa: {
      centro: 'Un método apto para su propósito',
      ramas: [
        { titulo: 'Marco', icono: 'Landmark', nodos: ['ICH Q2(R2) y Q14', 'USP y OMS', 'Resolución 3619 de 2013'] },
        { titulo: 'Parámetros', icono: 'Target', nodos: ['Especificidad', 'Exactitud y precisión', 'Rango, límites y robustez'] },
        { titulo: 'Estadística', icono: 'Sigma', nodos: ['Regresión', 'Pruebas t y F', 'ANOVA y DoE'] },
        { titulo: 'Práctica', icono: 'ClipboardList', nodos: ['Protocolo e informe', 'Verificación y transferencia', 'Casos HPLC y UV-Vis'] },
      ],
    },
    secciones: [
      {
        titulo: 'Por qué se valida un método',
        parrafos: [
          'Un resultado analítico se usa para decidir: liberar un lote, aprobar una materia prima, fijar una vida útil, sustentar un registro sanitario. Esas decisiones solo son tan buenas como el **método** que produjo el dato. La validación demuestra, con estudios de laboratorio, que el método es **apto para su propósito**: que mide lo que debe medir, con la exactitud y la precisión necesarias, en el rango en que se va a usar, y que no se descompone ante pequeñas variaciones.',
          'La exigencia es regulatoria y técnica a la vez. En Colombia, la Resolución 3619 de 2013 pide que los laboratorios de control de calidad usen métodos validados o verificados, y el INVIMA revisa la validación en los expedientes de registro y en las inspecciones. La guía ICH Q2(R2), de 2023, es la referencia internacional sobre qué demostrar, y la ICH Q14 explica cómo desarrollar el método con conocimiento.',
        ],
      },
      {
        titulo: 'El recorrido del curso',
        parrafos: [
          'La **unidad 1** ubica el marco: ICH Q2(R2) y Q14, los capítulos de la USP, las guías de la OMS, la normativa colombiana, las diferencias entre validar, verificar, transferir y calificar, y las categorías de métodos. La **unidad 2** recorre cada parámetro de desempeño: especificidad, linealidad y rango, exactitud, precisión, límites, robustez e idoneidad del sistema.',
          'La **unidad 3** te da la estadística aplicada: regresión, intervalos de confianza, pruebas t y F, ANOVA, diseño de experimentos y el uso controlado de Excel. La **unidad 4** trata los métodos indicadores de estabilidad y los métodos microbiológicos. La **unidad 5** cierra con el protocolo, el informe, la verificación, la transferencia, el ciclo de vida y dos casos completos, uno por HPLC y otro por UV-Vis.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ciclo de vida de un método analítico',
      pasos: [
        { titulo: 'Definir el propósito', detalle: 'Qué se mide, en qué rango y con qué calidad se necesita el resultado.', icono: 'Target', evidencia: 'Perfil del método.' },
        { titulo: 'Desarrollar', detalle: 'Diseñar el método con conocimiento de sus variables críticas (ICH Q14).', icono: 'Lightbulb', evidencia: 'Informe de desarrollo.' },
        { titulo: 'Validar', detalle: 'Demostrar con un protocolo que cumple los criterios (ICH Q2(R2)).', icono: 'ClipboardCheck', evidencia: 'Protocolo e informe de validación.' },
        { titulo: 'Usar en rutina', detalle: 'Aplicar con idoneidad del sistema en cada corrida.', icono: 'FlaskConical', evidencia: 'Registros de rutina.' },
        { titulo: 'Vigilar y mejorar', detalle: 'Seguir el desempeño, gestionar cambios y revalidar cuando haga falta.', icono: 'RefreshCw', evidencia: 'Tendencias y control de cambios.' },
      ],
    },
    caso: {
      titulo: 'Un método que «siempre ha funcionado»',
      contexto: 'Un laboratorio usa desde hace diez años un método propio de valoración por HPLC que nunca se validó formalmente. Nunca ha dado problemas y sus resultados coinciden con los del proveedor.',
      pregunta: '¿Es suficiente para seguir usándolo en liberación?',
      opciones: [
        { texto: 'Sí: diez años sin problemas son la mejor validación.', correcta: false, retro: 'La experiencia no reemplaza la demostración documentada de especificidad, exactitud, precisión y rango.' },
        { texto: 'No: hay que validarlo con un protocolo según ICH Q2(R2), aprovechando los datos históricos como apoyo, y gestionar la situación como una desviación.', correcta: true, retro: 'Un método sin validación es un hallazgo; los datos históricos ayudan, pero no sustituyen los estudios.' },
        { texto: 'Basta con que coincida con el proveedor.', correcta: false, retro: 'La coincidencia puede deberse a errores compartidos o a un rango limitado de muestras.' },
      ],
    },
    errores: [
      { error: 'Confundir experiencia con validación.', correccion: 'La validación es una demostración documentada con criterios definidos antes.' },
      { error: 'Validar una vez y olvidarse del método.', correccion: 'Vigila el desempeño durante todo el ciclo de vida.' },
    ],
    comprueba: [
      { pregunta: '¿Qué demuestra la validación de un método?', respuesta: 'Que es apto para su propósito: que sus características de desempeño cumplen lo requerido.' },
      { pregunta: '¿Qué guías internacionales son la referencia principal?', respuesta: 'ICH Q2(R2) para la validación e ICH Q14 para el desarrollo y el ciclo de vida.' },
    ],
    resumen: [
      'Un resultado vale **lo que vale su método**.',
      'Validar es demostrar que el método es **apto para su propósito**.',
      'La validación es parte de un **ciclo de vida**.',
    ],
    referencias: [REF.ichQ2, REF.ichQ14, REF.res3619, REF.eurachem],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Ciclo ilustrado de cinco etapas alrededor de un cromatograma: propósito, desarrollo, validación, rutina y mejora.', alt: 'Ciclo de vida de un método analítico' },
    ],
    keywords: ['validación de métodos analíticos', 'curso de validación de métodos analíticos', 'qué es validar un método analítico', 'validación analítica farmacéutica', 'curso de validaciones gratis'],
  },

  {
    titulo: 'ICH Q2(R2) e ICH Q14: el nuevo enfoque de ciclo de vida',
    unidad: U1,
    duracion: 25,
    gancho: {
      titulo: 'De la lista de chequeo al conocimiento',
      texto: 'Durante casi treinta años, muchos laboratorios validaron con una lista: especificidad, linealidad, exactitud, precisión, listo. En 2023, la ICH publicó dos guías que cambian la conversación: Q2(R2), que actualiza qué demostrar, y Q14, que pide entender el método desde su desarrollo. La pregunta deja de ser «¿cumplí la lista?» y pasa a ser «¿sé por qué mi método funciona y cuándo dejaría de hacerlo?».',
    },
    objetivos: [
      'Describir los cambios principales de ICH Q2(R2) frente a la versión anterior.',
      'Explicar los enfoques mínimo y mejorado del desarrollo según ICH Q14.',
      'Definir el perfil analítico objetivo y su papel en el ciclo de vida.',
    ],
    conceptos: [
      { icono: 'BookOpen', termino: 'ICH Q2(R2)', definicion: 'Guía de validación de procedimientos analíticos de 2023: amplía el alcance a técnicas multivariadas y no lineales y habla de respuesta y rango de trabajo.' },
      { icono: 'Lightbulb', termino: 'ICH Q14', definicion: 'Guía de desarrollo de procedimientos analíticos de 2023: describe enfoques mínimo y mejorado y la gestión del ciclo de vida.' },
      { icono: 'Target', termino: 'Perfil analítico objetivo (ATP)', definicion: 'Lo que el método debe lograr: qué mide, en qué rango y con qué exactitud y precisión, independiente de la técnica.' },
      { icono: 'Settings', termino: 'Condiciones establecidas', definicion: 'Elementos del método que, si cambian, requieren gestión regulatoria; Q14 ayuda a definirlos con base en conocimiento.' },
    ],
    mapa: {
      centro: 'El enfoque de 2023',
      ramas: [
        { titulo: 'Q2(R2)', icono: 'BookOpen', nodos: ['Qué demostrar', 'Respuesta y rango de trabajo', 'Técnicas multivariadas'] },
        { titulo: 'Q14', icono: 'Lightbulb', nodos: ['Enfoque mínimo', 'Enfoque mejorado', 'Conocimiento y riesgo'] },
        { titulo: 'ATP', icono: 'Target', nodos: ['Qué se mide', 'Rango', 'Exactitud y precisión requeridas'] },
        { titulo: 'Ciclo de vida', icono: 'RefreshCw', nodos: ['Estrategia de control', 'Cambios posteriores', 'Mejora continua'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué cambia ICH Q2(R2)',
        parrafos: [
          'La versión revisada de la guía ICH Q2, publicada en noviembre de 2023, mantiene las características de desempeño clásicas pero actualiza el lenguaje y el alcance. Habla de **respuesta** y **rango de trabajo** en lugar de limitarse a la linealidad, porque reconoce que algunas técnicas tienen respuestas no lineales; incluye **técnicas multivariadas**, como la espectroscopia con modelos quimiométricos; y conecta la validación con el conocimiento generado en el desarrollo, para no repetir estudios que ya existen.',
          'También aclara que la **robustez** se evalúa idealmente durante el desarrollo, y que una validación puede apoyarse en datos de plataforma cuando el mismo método se usa para productos similares, si se justifica. El resultado es una guía menos rígida y más basada en el propósito del método.',
        ],
      },
      {
        titulo: 'ICH Q14 y el perfil analítico objetivo',
        parrafos: [
          'La guía ICH Q14 describe dos enfoques de desarrollo. El **enfoque mínimo** es el tradicional: se definen los atributos a medir, se elige la técnica, se optimiza con experimentos y se documenta el método. El **enfoque mejorado** agrega un **perfil analítico objetivo (ATP)**, una evaluación de riesgos de los parámetros del método, experimentos (a menudo con diseño estadístico) para entender su efecto y una **estrategia de control** con rangos probados.',
          'El ATP describe lo que el método debe lograr, por ejemplo: «cuantificar el activo entre 80 % y 120 % de lo declarado con un error total que garantice decisiones correctas frente a la especificación». Con ese conocimiento, los cambios posteriores (una columna distinta, un ajuste de gradiente) pueden gestionarse con menos incertidumbre y, según la región, con menos carga regulatoria. Para el laboratorio colombiano, adoptar este enfoque mejora la calidad de las decisiones aunque los requisitos locales sigan centrados en la validación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Desarrollo con enfoque mejorado',
      pasos: [
        { titulo: 'Escribir el ATP', detalle: 'Define qué mide el método, en qué rango y con qué calidad.', icono: 'Target', evidencia: 'Perfil analítico objetivo.' },
        { titulo: 'Elegir la técnica', detalle: 'Selecciona la técnica capaz de cumplir el ATP.', icono: 'Microscope', evidencia: 'Justificación de la técnica.' },
        { titulo: 'Evaluar riesgos', detalle: 'Identifica qué parámetros del método pueden afectar el resultado.', icono: 'AlertTriangle', evidencia: 'Evaluación de riesgos.' },
        { titulo: 'Experimentar con diseño', detalle: 'Estudia el efecto de los parámetros críticos con experimentos planificados.', icono: 'Sigma', evidencia: 'Resultados de experimentos.' },
        { titulo: 'Definir la estrategia de control', detalle: 'Fija rangos, idoneidad del sistema y condiciones establecidas.', icono: 'ShieldCheck', evidencia: 'Estrategia de control.' },
        { titulo: 'Validar y gestionar el ciclo', detalle: 'Valida según Q2(R2) y gestiona los cambios con el conocimiento acumulado.', icono: 'RefreshCw', evidencia: 'Validación y control de cambios.' },
      ],
    },
    caso: {
      titulo: 'Cambiar de columna sin miedo',
      contexto: 'Un método de HPLC desarrollado con enfoque mejorado tiene un estudio que demostró que la separación se mantiene con columnas C18 de varias marcas dentro de un rango de dimensiones. El proveedor de la columna original la descontinuó.',
      pregunta: '¿Qué permite el conocimiento generado?',
      opciones: [
        { texto: 'Revalidar todo el método desde cero.', correcta: false, retro: 'El conocimiento de desarrollo existe precisamente para no repetir todo cuando el cambio está dentro de lo estudiado.' },
        { texto: 'Gestionar el cambio con base en los datos de desarrollo: si la columna nueva está dentro del espacio estudiado, verificar con idoneidad y los ensayos que el riesgo indique.', correcta: true, retro: 'El enfoque mejorado reduce la incertidumbre y la carga de los cambios dentro de rangos probados.' },
        { texto: 'Usar cualquier columna C18 sin más.', correcta: false, retro: 'El cambio igual se gestiona y se documenta; el conocimiento lo facilita, no lo elimina.' },
      ],
    },
    errores: [
      { error: 'Validar sin saber qué necesita el resultado.', correccion: 'Define un perfil analítico objetivo antes de desarrollar y validar.' },
      { error: 'Dejar la robustez para el final.', correccion: 'Estúdiala en el desarrollo, cuando todavía se puede ajustar el método.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es el ATP?', respuesta: 'El perfil analítico objetivo: lo que el método debe lograr, independiente de la técnica.' },
      { pregunta: '¿Qué diferencia los enfoques mínimo y mejorado de ICH Q14?', respuesta: 'El mejorado agrega ATP, evaluación de riesgos, experimentos planificados y una estrategia de control con rangos probados.' },
    ],
    resumen: [
      'Q2(R2) actualiza **qué demostrar**; Q14, **cómo desarrollar**.',
      'El **ATP** define lo que el método debe lograr.',
      'El conocimiento facilita la **gestión de cambios** durante el ciclo de vida.',
    ],
    referencias: [REF.ichQ2, REF.ichQ14, REF.ichQ9, REF.fdaMetodos],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Dos documentos ilustrados (Q2(R2) y Q14) conectados a un objetivo central (ATP) con flechas de ciclo.', alt: 'ICH Q2(R2) e ICH Q14 alrededor del perfil analítico objetivo' },
    ],
    keywords: ['ich q2 r2 cambios', 'ich q14 en español', 'perfil analítico objetivo atp', 'enfoque mínimo y mejorado ich q14', 'ciclo de vida de métodos analíticos', 'validación analítica 2023'],
  },

  {
    titulo: 'USP <1225>, <1226>, <1224>, <1220> y guías OMS',
    unidad: U1,
    duracion: 25,
    gancho: {
      titulo: 'Cuatro capítulos, cuatro preguntas',
      texto: 'Un auditor pregunta: «¿Por qué verificaron este método en lugar de validarlo?». Para responder con fundamento, hay que conocer cómo la Farmacopea de los Estados Unidos organiza el tema en cuatro capítulos que responden preguntas distintas: cómo validar, cómo verificar, cómo transferir y cómo gestionar el ciclo de vida de un procedimiento analítico.',
    },
    objetivos: [
      'Describir el alcance de los capítulos USP <1225>, <1226>, <1224> y <1220>.',
      'Aplicar las categorías de procedimientos de USP <1225>.',
      'Ubicar las guías de la OMS que sustentan la normativa colombiana.',
    ],
    conceptos: [
      { icono: 'BookOpen', termino: 'Capítulos informativos', definicion: 'Los capítulos con numeración superior a 1000 son guías: orientan cómo cumplir, pero no son requisitos obligatorios por sí mismos.' },
      { icono: 'ClipboardCheck', termino: 'USP <1225>', definicion: 'Validación de procedimientos farmacopeicos: características de desempeño y cuatro categorías de procedimientos.' },
      { icono: 'BadgeCheck', termino: 'USP <1226> y <1224>', definicion: '<1226> trata la verificación de métodos oficiales; <1224>, la transferencia entre laboratorios.' },
      { icono: 'RefreshCw', termino: 'USP <1220>', definicion: 'Ciclo de vida del procedimiento analítico: diseño, calificación del desempeño y verificación continua.' },
    ],
    mapa: {
      centro: 'Los capítulos de la USP',
      ramas: [
        { titulo: '<1225> Validar', icono: 'ClipboardCheck', nodos: ['Categoría I: activos', 'Categoría II: impurezas', 'Categoría III: desempeño', 'Categoría IV: identificación'] },
        { titulo: '<1226> Verificar', icono: 'BadgeCheck', nodos: ['Métodos oficiales', 'Condiciones reales del laboratorio', 'Parámetros por riesgo'] },
        { titulo: '<1224> Transferir', icono: 'Truck', nodos: ['Pruebas comparativas', 'Covalidación', 'Revalidación o exención'] },
        { titulo: '<1220> Ciclo de vida', icono: 'RefreshCw', nodos: ['Diseño', 'Calificación del desempeño', 'Verificación continua'] },
      ],
    },
    secciones: [
      {
        titulo: 'Los cuatro capítulos',
        parrafos: [
          'La USP, una de las farmacopeas de referencia usadas en Colombia, organiza el tema en cuatro capítulos **informativos**, es decir, con numeración superior a 1000: son guías y no requisitos obligatorios por sí mismos, aunque las autoridades los usan como referencia. **<1225>**, validación de procedimientos farmacopeicos, define las características de desempeño (exactitud, precisión, especificidad, límites de detección y de cuantificación, linealidad, rango y robustez) y clasifica los procedimientos en **cuatro categorías**: I, cuantificación de componentes principales o activos; II, impurezas o productos de degradación, cuantitativos o prueba límite; III, características de desempeño como la disolución; IV, pruebas de identificación. Para cada categoría indica qué parámetros se requieren.',
          '**<1226>** establece que un método oficial no necesita validarse de nuevo, pero el laboratorio debe demostrar que funciona en sus condiciones reales: su muestra, sus equipos y su personal. **<1224>** describe cómo trasladar un método validado de un laboratorio emisor a uno receptor: pruebas comparativas, covalidación, revalidación parcial o exención justificada. **<1220>** propone ver el procedimiento analítico con un enfoque de **ciclo de vida** en tres etapas: diseño y desarrollo, calificación del desempeño y verificación continua del desempeño, en línea con ICH Q14.',
        ],
      },
      {
        titulo: 'Las guías de la OMS y la normativa colombiana',
        parrafos: [
          'La normativa colombiana se apoya en la OMS. La Resolución 3619 de 2013 adopta las buenas prácticas para laboratorios de control de calidad del TRS 957, Anexo 1, que exigen métodos validados o verificados. La guía de validación de la OMS (TRS 1019, Anexo 3) incluye un apéndice sobre validación de métodos analíticos, y su borrador técnico circuló como documento de consulta.',
          'En la práctica, un procedimiento bien fundamentado en Colombia combina las tres fuentes: la **norma** (Resolución 3619 de 2013), la **guía internacional** (ICH Q2(R2) y Q14) y la **farmacopea** con sus capítulos generales. La presentación del INVIMA sobre validación de métodos resume cómo se aplican estos conceptos en las evaluaciones locales.',
        ],
      },
    ],
    proceso: {
      titulo: 'Elegir qué capítulo aplica',
      pasos: [
        { titulo: 'Identificar el origen del método', detalle: '¿Es farmacopeico, propio o de otro laboratorio?', icono: 'Search', evidencia: 'Origen documentado.' },
        { titulo: 'Si es farmacopeico sin cambios', detalle: 'Aplica la verificación de <1226>.', icono: 'BadgeCheck', evidencia: 'Plan de verificación.' },
        { titulo: 'Si viene de otro laboratorio', detalle: 'Aplica la transferencia de <1224>.', icono: 'Truck', evidencia: 'Protocolo de transferencia.' },
        { titulo: 'Si es propio o modificado', detalle: 'Valida según <1225> e ICH Q2(R2), con la categoría que corresponda.', icono: 'ClipboardCheck', evidencia: 'Protocolo de validación.' },
        { titulo: 'Gestionar el ciclo', detalle: 'Vigila el desempeño en rutina según <1220>.', icono: 'RefreshCw', evidencia: 'Seguimiento del desempeño.' },
      ],
    },
    caso: {
      titulo: 'La categoría de una prueba de disolución',
      contexto: 'Un analista prepara la validación del método de cuantificación de una prueba de disolución y pregunta qué categoría de <1225> aplica.',
      pregunta: '¿Cuál es la respuesta?',
      opciones: [
        { texto: 'Categoría I, porque cuantifica el activo.', correcta: false, retro: 'Aunque cuantifica el activo, el propósito es evaluar una característica de desempeño del producto.' },
        { texto: 'Categoría III, porque evalúa una característica de desempeño como la disolución.', correcta: true, retro: '<1225> ubica la disolución en la categoría III y define los parámetros que aplican.' },
        { texto: 'Categoría IV, porque identifica el activo disuelto.', correcta: false, retro: 'La categoría IV corresponde a pruebas de identificación.' },
      ],
    },
    errores: [
      { error: 'Tratar los capítulos informativos como requisitos obligatorios.', correccion: 'Úsalos como guía técnica y ancla la obligación en la norma colombiana.' },
      { error: 'Validar completo un método farmacopeico sin cambios.', correccion: 'Aplica la verificación de <1226>.' },
    ],
    comprueba: [
      { pregunta: '¿Qué categorías define USP <1225>?', respuesta: 'I activos, II impurezas, III características de desempeño y IV identificación.' },
      { pregunta: '¿Qué propone USP <1220>?', respuesta: 'Un enfoque de ciclo de vida: diseño, calificación del desempeño y verificación continua.' },
    ],
    resumen: [
      '<1225> valida, <1226> verifica, <1224> transfiere y <1220> gestiona el **ciclo de vida**.',
      'Cuatro **categorías** definen qué parámetros validar.',
      'La normativa colombiana se apoya en la **OMS**.',
    ],
    referencias: [REF.ichQ2, REF.res3619, REF.trs1019a3, REF.trs957a1, REF.invimaValidacion],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Cuatro tarjetas ilustradas con los números 1225, 1226, 1224 y 1220 y un icono para cada pregunta: validar, verificar, transferir, ciclo de vida.', alt: 'Capítulos de la USP sobre procedimientos analíticos' },
    ],
    keywords: ['usp 1225 validación', 'usp 1226 verificación', 'usp 1224 transferencia', 'usp 1220 ciclo de vida', 'categorías de métodos analíticos usp', 'guías oms validación de métodos'],
  },

  {
    titulo: 'Normativa colombiana: Res. 3619 de 2013 y requisitos INVIMA',
    unidad: U1,
    duracion: 20,
    gancho: {
      titulo: 'El expediente que volvió con requerimientos',
      texto: 'Un titular radica un registro sanitario con un método de valoración propio. Semanas después recibe un requerimiento del INVIMA: falta la evidencia de especificidad frente a productos de degradación y la precisión intermedia no está demostrada. El método funcionaba, pero la validación presentada no lo demostraba. Conocer qué piden la norma y el evaluador evita meses de demora.',
    },
    objetivos: [
      'Identificar qué exige la Resolución 3619 de 2013 sobre métodos analíticos.',
      'Relacionar la validación con el expediente del registro sanitario.',
      'Anticipar los requerimientos más frecuentes en validación.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'Resolución 3619 de 2013', definicion: 'Manual de BPL de control de calidad: exige métodos validados o verificados, registros completos y revisión de resultados.' },
      { icono: 'Files', termino: 'Expediente de registro', definicion: 'Documentación técnica del producto que incluye los métodos y su validación para el INVIMA.' },
      { icono: 'AlertTriangle', termino: 'Requerimiento', definicion: 'Solicitud del evaluador de información adicional o corrección. Una validación incompleta es una causa frecuente.' },
      { icono: 'ShieldCheck', termino: 'Inspección', definicion: 'En la visita, el INVIMA puede revisar los informes de validación, los datos primarios y su coherencia con la rutina.' },
    ],
    mapa: {
      centro: 'Validación ante el INVIMA',
      ramas: [
        { titulo: 'Norma', icono: 'Landmark', nodos: ['Resolución 3619 de 2013', 'Métodos validados o verificados', 'Datos primarios conservados'] },
        { titulo: 'Registro', icono: 'Files', nodos: ['Métodos del producto', 'Informes de validación', 'Coherencia con la especificación'] },
        { titulo: 'Requerimientos frecuentes', icono: 'AlertTriangle', nodos: ['Especificidad sin degradación forzada', 'Precisión intermedia faltante', 'Rango que no cubre el uso'] },
        { titulo: 'Inspección', icono: 'ShieldCheck', nodos: ['Datos primarios', 'Integridad', 'Rutina igual a lo validado'] },
      ],
    },
    secciones: [
      {
        titulo: 'Lo que pide la norma',
        parrafos: [
          'La **Resolución 3619 de 2013** adoptó el Manual de Buenas Prácticas de Laboratorio de Control de Calidad de Productos Farmacéuticos, basado en la guía de la OMS. Entre sus requisitos están que los procedimientos analíticos estén **validados**, o **verificados** si son farmacopeicos, antes de usarse; que los datos primarios se conserven; que los resultados se revisen antes de emitir informes; y que los cambios en los métodos se controlen. El INVIMA publicó además un comparativo entre estos requisitos y otros estándares de laboratorio.',
          'La validación también es parte del **expediente del registro sanitario**: los métodos con los que se controla el producto y la evidencia de que son aptos. Un método de liberación distinto al presentado en el registro, o una validación que no cubre el uso real, generan requerimientos y, en una inspección, hallazgos.',
        ],
      },
      {
        titulo: 'Requerimientos frecuentes y cómo evitarlos',
        parrafos: [
          'Los requerimientos más comunes sobre validación suelen ser: **especificidad** demostrada sin estudios de degradación forzada en métodos indicadores de estabilidad; **precisión intermedia** ausente o con un diseño que no varía nada (mismo analista, mismo día); **rango** validado que no cubre los valores que el método reportará, por ejemplo en estabilidad o disolución; criterios de aceptación definidos después de ver los datos; y falta de coherencia entre el método validado y el que se usa en rutina.',
          'Se evitan con un **protocolo** que defina antes los criterios, un diseño que represente el uso real y un informe que presente los datos primarios y sus análisis de forma trazable. La presentación del INVIMA sobre validación de métodos, que cubre cuándo validar, los parámetros, el ANOVA y la robustez, es una buena guía de lo que espera el evaluador local.',
        ],
      },
    ],
    proceso: {
      titulo: 'Preparar la validación para el expediente',
      pasos: [
        { titulo: 'Revisar la especificación registrada', detalle: 'Lista los ensayos y métodos que se presentarán.', icono: 'FileSearch', evidencia: 'Especificación del expediente.' },
        { titulo: 'Definir el alcance de cada validación', detalle: 'Según la categoría y el uso, define parámetros y criterios.', icono: 'Target', evidencia: 'Protocolos aprobados.' },
        { titulo: 'Ejecutar con diseño real', detalle: 'Incluye degradación forzada, precisión intermedia y el rango completo de uso.', icono: 'FlaskConical', evidencia: 'Datos primarios.' },
        { titulo: 'Redactar informes trazables', detalle: 'Presenta datos, análisis y conclusiones con referencias al protocolo.', icono: 'FileCheck', evidencia: 'Informes de validación.' },
        { titulo: 'Verificar coherencia', detalle: 'Confirma que el método de rutina sea idéntico al validado y registrado.', icono: 'Scale', evidencia: 'Comparación documentada.' },
      ],
    },
    caso: {
      titulo: 'La precisión intermedia de un solo analista',
      contexto: 'Un informe de validación declara «precisión intermedia» con seis análisis hechos el mismo día por el mismo analista en el mismo equipo.',
      pregunta: '¿Qué observaría el evaluador?',
      opciones: [
        { texto: 'Nada: seis análisis son suficientes.', correcta: false, retro: 'Sin variar día, analista o equipo, eso es repetibilidad, no precisión intermedia.' },
        { texto: 'Que eso es repetibilidad; la precisión intermedia exige variar factores como día, analista o equipo, y evaluarlos con la estadística adecuada.', correcta: true, retro: 'Es uno de los requerimientos más frecuentes: el diseño no representa la variación real del laboratorio.' },
        { texto: 'Que faltan más réplicas del mismo analista.', correcta: false, retro: 'Más réplicas en las mismas condiciones no cambian la naturaleza del estudio.' },
      ],
    },
    errores: [
      { error: 'Validar un método distinto al que se usa en rutina.', correccion: 'Asegura que el método validado, registrado y usado sea el mismo.' },
      { error: 'Definir criterios después de ver los resultados.', correccion: 'Aprueba el protocolo con criterios antes de ejecutar.' },
    ],
    comprueba: [
      { pregunta: '¿Qué exige la Resolución 3619 de 2013 sobre los métodos?', respuesta: 'Que estén validados, o verificados si son farmacopeicos, antes de usarse, con datos primarios conservados y resultados revisados.' },
      { pregunta: 'Menciona dos requerimientos frecuentes del INVIMA en validación.', respuesta: 'Especificidad sin degradación forzada y precisión intermedia mal diseñada (también rangos que no cubren el uso).' },
    ],
    resumen: [
      'La **Resolución 3619 de 2013** exige métodos validados o verificados.',
      'La validación es parte del **expediente del registro**.',
      'Un buen protocolo **previene requerimientos**.',
    ],
    referencias: [REF.res3619, REF.res3619Compilada, REF.invimaComparativo, REF.invimaValidacion, REF.ichQ2],
    imagenes: [
      { ubicacion: 'En la sección de requerimientos', descripcion: 'Carpeta de expediente ilustrada con tres notas adhesivas de requerimiento (especificidad, precisión intermedia, rango) en ámbar.', alt: 'Requerimientos frecuentes del INVIMA sobre validación de métodos' },
    ],
    keywords: ['validación de métodos invima', 'resolución 3619 de 2013 métodos analíticos', 'requisitos de validación colombia', 'requerimientos invima validación', 'expediente registro sanitario validación'],
  },

  {
    titulo: 'Validación, verificación, transferencia y calificación',
    unidad: U1,
    duracion: 25,
    gancho: {
      titulo: 'Cuatro palabras que se confunden en cada auditoría',
      texto: 'En una auditoría, un analista explica que «validaron el HPLC», «calificaron el método» y «transfirieron la monografía de la USP». Las tres frases están mal. Validación, verificación, transferencia y calificación son actividades distintas, con propósitos distintos. Usarlas con precisión es la primera señal de que un laboratorio entiende lo que hace.',
    },
    objetivos: [
      'Diferenciar validación, verificación, transferencia y calificación.',
      'Aplicar un árbol de decisión para elegir la actividad que corresponde.',
      'Reconocer la calificación de equipos como prerrequisito.',
    ],
    conceptos: [
      { icono: 'ClipboardCheck', termino: 'Validación', definicion: 'Demuestra que las características de desempeño de un procedimiento cumplen los requisitos de su uso previsto. Aplica a métodos nuevos, propios o farmacopeicos modificados fuera de lo permitido.' },
      { icono: 'BadgeCheck', termino: 'Verificación', definicion: 'Demuestra que un método oficial o ya validado funciona en las condiciones reales del laboratorio usuario.' },
      { icono: 'Truck', termino: 'Transferencia', definicion: 'Califica a un laboratorio receptor para usar un método desarrollado y validado en un laboratorio emisor.' },
      { icono: 'Wrench', termino: 'Calificación', definicion: 'Demuestra que el instrumento es apto (DQ, IQ, OQ, PQ). Es requisito previo: no se valida un método en un equipo sin calificar.' },
    ],
    mapa: {
      centro: '¿Qué actividad corresponde?',
      ramas: [
        { titulo: 'Validar', icono: 'ClipboardCheck', nodos: ['Método nuevo o propio', 'Farmacopeico modificado', 'ICH Q2(R2)'] },
        { titulo: 'Verificar', icono: 'BadgeCheck', nodos: ['Farmacopeico sin cambios', 'Parámetros por riesgo', 'USP <1226>'] },
        { titulo: 'Transferir', icono: 'Truck', nodos: ['Validado en otro laboratorio', 'Emisor y receptor', 'USP <1224>'] },
        { titulo: 'Calificar', icono: 'Wrench', nodos: ['El equipo, no el método', 'DQ, IQ, OQ, PQ', 'Requisito previo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Las cuatro actividades',
        parrafos: [
          'La **validación** es el proceso documentado que demuestra, con estudios de laboratorio, que las características de desempeño de un procedimiento cumplen los requisitos de su uso previsto, según ICH Q2(R2). Aplica a métodos **nuevos**, **propios** o **farmacopeicos modificados** fuera de los ajustes permitidos por la farmacopea. La **verificación** demuestra que un método oficial o ya validado funciona en las condiciones reales del laboratorio usuario, según USP <1226>; evalúa un subconjunto de parámetros elegidos por riesgo.',
          'La **transferencia** califica a un laboratorio receptor para usar un método desarrollado y validado en otro laboratorio, según USP <1224>; es típica entre la casa matriz y una planta local, o entre el fabricante y un laboratorio tercero. La **calificación** se aplica a los **equipos** (DQ, IQ, OQ y PQ) y demuestra que el instrumento es apto. Es un requisito previo: no se puede validar un método en un equipo no calificado.',
        ],
      },
      {
        titulo: 'Un árbol de decisión práctico',
        parrafos: [
          'Primero, ¿el método está en una farmacopea oficial y se usa **sin modificaciones**? Entonces se **verifica**. Segundo, ¿fue **validado en otro laboratorio** y se va a usar aquí? Entonces se **transfiere**. Tercero, ¿es **nuevo**, **propio** o se **modificó** por fuera de los ajustes permitidos (por ejemplo, los que admite el capítulo general de cromatografía)? Entonces se **valida**. En todos los casos, los equipos deben estar **calificados**.',
          'Las farmacopeas permiten ciertos **ajustes** de condiciones cromatográficas (dimensiones de columna, flujo, composición de fase móvil dentro de límites) sin que el método se considere modificado, siempre que se cumpla la idoneidad del sistema. Fuera de esos límites, el cambio exige validar al menos los parámetros afectados.',
        ],
      },
    ],
    proceso: {
      titulo: 'Árbol de decisión',
      pasos: [
        { titulo: '¿Es farmacopeico sin cambios?', detalle: 'Si sí, verifica según USP <1226>.', icono: 'BadgeCheck', evidencia: 'Informe de verificación.' },
        { titulo: '¿Viene validado de otro laboratorio?', detalle: 'Si sí, transfiere según USP <1224>.', icono: 'Truck', evidencia: 'Informe de transferencia.' },
        { titulo: '¿Es nuevo, propio o modificado?', detalle: 'Si sí, valida según ICH Q2(R2).', icono: 'ClipboardCheck', evidencia: 'Informe de validación.' },
        { titulo: '¿Los ajustes están dentro de lo permitido?', detalle: 'Si el cambio está dentro de los ajustes de la farmacopea, basta con cumplir la idoneidad.', icono: 'Ruler', evidencia: 'Justificación del ajuste.' },
        { titulo: '¿El equipo está calificado?', detalle: 'Siempre, antes de cualquiera de las anteriores.', icono: 'Wrench', evidencia: 'Calificación del equipo.' },
      ],
    },
    caso: {
      titulo: 'Una monografía con otra fase móvil',
      contexto: 'Un laboratorio usa el método de la monografía, pero cambió la composición de la fase móvil más allá de los ajustes que permite la farmacopea para mejorar la resolución.',
      pregunta: '¿Qué actividad corresponde?',
      opciones: [
        { texto: 'Verificar, porque sigue siendo el método de la farmacopea.', correcta: false, retro: 'Al salirse de los ajustes permitidos, el método ya no es el farmacopeico.' },
        { texto: 'Validar al menos los parámetros afectados por el cambio, porque el método se modificó fuera de lo permitido.', correcta: true, retro: 'Un método farmacopeico modificado fuera de los ajustes permitidos se trata como propio en lo afectado.' },
        { texto: 'Transferir desde la farmacopea.', correcta: false, retro: 'La transferencia aplica entre laboratorios, no desde una farmacopea.' },
      ],
    },
    errores: [
      { error: 'Decir «validamos el HPLC».', correccion: 'El equipo se califica; el método se valida o se verifica.' },
      { error: 'Verificar un método modificado.', correccion: 'Si el cambio supera los ajustes permitidos, valida lo afectado.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se hace con un método farmacopeico usado sin cambios?', respuesta: 'Se verifica según USP <1226>.' },
      { pregunta: '¿Por qué la calificación es un requisito previo?', respuesta: 'Porque un método no puede demostrarse apto en un equipo cuyo desempeño no está demostrado.' },
    ],
    resumen: [
      '**Validar** lo nuevo o modificado, **verificar** lo farmacopeico, **transferir** lo validado en otro sitio.',
      'Los equipos se **califican** antes de todo.',
      'Los **ajustes permitidos** no cambian la naturaleza del método.',
    ],
    referencias: [REF.ichQ2, REF.trs1019a3, REF.res3619, REF.picsAnexo15],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Árbol de decisión ilustrado con tres preguntas y cuatro hojas de colores: validar, verificar, transferir y calificar.', alt: 'Árbol de decisión entre validación, verificación, transferencia y calificación' },
    ],
    keywords: ['diferencia entre validación y verificación de métodos', 'transferencia de métodos analíticos', 'calificación de equipos vs validación', 'cuándo validar un método analítico', 'verificación de métodos farmacopeicos'],
  },

  {
    titulo: 'Categorías de métodos y parámetros requeridos',
    unidad: U1,
    duracion: 25,
    gancho: {
      titulo: 'No todo método necesita todo',
      texto: 'Un analista nuevo planea validar una prueba de identificación por infrarrojo con exactitud, precisión, linealidad y límite de cuantificación. Gasta dos semanas en estudios que nadie le pedirá, mientras se le olvida lo único esencial: demostrar que el método distingue la sustancia de otras parecidas. Saber qué parámetros exige cada tipo de método ahorra tiempo y enfoca el esfuerzo.',
    },
    objetivos: [
      'Relacionar cada tipo de procedimiento con los parámetros que debe demostrar.',
      'Usar la tabla de ICH Q2(R2) y las categorías de USP <1225>.',
      'Justificar la inclusión u omisión de un parámetro.',
    ],
    conceptos: [
      { icono: 'Fingerprint', termino: 'Identificación', definicion: 'Requiere especificidad: distinguir la sustancia de otras estructuralmente parecidas.' },
      { icono: 'Search', termino: 'Impurezas cuantitativas', definicion: 'Requieren especificidad, rango con límite de cuantificación, exactitud y precisión.' },
      { icono: 'Ruler', termino: 'Prueba límite', definicion: 'Requiere especificidad y límite de detección: demostrar que se detecta la impureza al nivel del límite.' },
      { icono: 'Target', termino: 'Valoración', definicion: 'Requiere especificidad, rango, exactitud y precisión. La disolución, como prueba de desempeño, tiene requisitos similares en su rango.' },
    ],
    mapa: {
      centro: 'Parámetros según el propósito',
      ramas: [
        { titulo: 'Identificación', icono: 'Fingerprint', nodos: ['Especificidad'] },
        { titulo: 'Impurezas cuantitativas', icono: 'Search', nodos: ['Especificidad', 'Rango con límite de cuantificación', 'Exactitud y precisión'] },
        { titulo: 'Prueba límite', icono: 'Ruler', nodos: ['Especificidad', 'Límite de detección'] },
        { titulo: 'Valoración y desempeño', icono: 'Target', nodos: ['Especificidad', 'Rango y respuesta', 'Exactitud y precisión'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué parámetro para qué método',
        parrafos: [
          'ICH Q2(R2) organiza los parámetros según el **propósito** del procedimiento. Una prueba de **identificación** necesita demostrar **especificidad**: que distingue la sustancia de otras con estructura parecida. Una prueba **cuantitativa de impurezas** necesita especificidad, **rango** de trabajo que llegue hasta el **límite de cuantificación**, **exactitud** y **precisión**. Una **prueba límite** de impurezas necesita especificidad y **límite de detección**: basta con demostrar que el método detecta la impureza al nivel del límite.',
          'Una **valoración** del contenido o de la potencia necesita especificidad, rango y respuesta, exactitud y precisión. USP <1225> dice lo mismo con sus cuatro categorías: la categoría III, de desempeño (como la disolución), exige parámetros según el uso, generalmente rango, exactitud y precisión en los niveles que el ensayo reporta. La **robustez** se evalúa idealmente en el desarrollo, y la **idoneidad del sistema** acompaña a todos los métodos cromatográficos.',
        ],
      },
      {
        titulo: 'Justificar lo que se incluye y lo que no',
        parrafos: [
          'La tabla de parámetros es un punto de partida, no un límite. Un método puede necesitar algo más por su uso: por ejemplo, un método de valoración que también se usa en estabilidad requiere demostrar especificidad frente a productos de degradación, y uno que cuantifica en disolución necesita un rango que cubra los valores bajos de los primeros tiempos.',
          'También se puede omitir un parámetro con justificación: la precisión intermedia puede no aplicar a una prueba límite cualitativa, y la exactitud de una impureza puede inferirse si no hay estándar de la impureza, siempre que se justifique. Lo importante es que el **protocolo** explique, para cada parámetro, por qué se incluye o se omite.',
        ],
      },
    ],
    proceso: {
      titulo: 'Planear los parámetros de una validación',
      pasos: [
        { titulo: 'Definir el propósito', detalle: 'Identificación, impurezas, prueba límite, valoración o desempeño.', icono: 'Target', evidencia: 'Propósito en el protocolo.' },
        { titulo: 'Consultar la tabla', detalle: 'Usa ICH Q2(R2) y la categoría de USP <1225> como base.', icono: 'BookOpen', evidencia: 'Parámetros base.' },
        { titulo: 'Ajustar por el uso real', detalle: 'Agrega lo que el uso exige: estabilidad, rangos bajos, matrices complejas.', icono: 'Settings', evidencia: 'Parámetros ajustados.' },
        { titulo: 'Justificar omisiones', detalle: 'Explica por qué un parámetro no aplica.', icono: 'FileText', evidencia: 'Justificación escrita.' },
        { titulo: 'Fijar criterios', detalle: 'Define el criterio de aceptación de cada parámetro.', icono: 'Ruler', evidencia: 'Criterios aprobados.' },
      ],
    },
    caso: {
      titulo: 'La identificación por infrarrojo',
      contexto: 'Un analista planea validar una identificación por infrarrojo con exactitud, precisión y linealidad.',
      pregunta: '¿Qué le recomiendas?',
      opciones: [
        { texto: 'Mantener todos los parámetros para estar seguros.', correcta: false, retro: 'Los parámetros cuantitativos no aportan nada a una prueba cualitativa de identificación.' },
        { texto: 'Concentrarse en la especificidad: demostrar que el método distingue la sustancia de otras parecidas y de los excipientes.', correcta: true, retro: 'La identificación se valida por especificidad; el esfuerzo debe ir ahí.' },
        { texto: 'No validar nada porque es una prueba cualitativa.', correcta: false, retro: 'Las pruebas cualitativas también se validan, en su parámetro relevante.' },
      ],
    },
    errores: [
      { error: 'Validar todos los parámetros para todo método.', correccion: 'Elige los parámetros según el propósito y justifica.' },
      { error: 'Omitir la especificidad frente a degradación en métodos de estabilidad.', correccion: 'Incluye degradación forzada cuando el método indica estabilidad.' },
    ],
    comprueba: [
      { pregunta: '¿Qué parámetros requiere una valoración?', respuesta: 'Especificidad, rango y respuesta, exactitud y precisión.' },
      { pregunta: '¿Qué requiere una prueba límite de impurezas?', respuesta: 'Especificidad y límite de detección.' },
    ],
    resumen: [
      'Los parámetros dependen del **propósito**.',
      'ICH Q2(R2) y las **categorías de USP** son el punto de partida.',
      'Se **justifica** lo que se incluye y lo que se omite.',
    ],
    referencias: [REF.ichQ2, REF.fdaMetodos, REF.eurachem, REF.invimaValidacion],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Tabla ilustrada de cuatro columnas (identificación, impurezas, prueba límite, valoración) con marcas turquesa en los parámetros requeridos.', alt: 'Parámetros de validación requeridos según el tipo de método' },
    ],
    keywords: ['parámetros de validación según tipo de método', 'tabla de parámetros ich q2', 'categorías usp 1225', 'validación de prueba de identificación', 'validación de método de impurezas', 'validación de valoración'],
  },
];

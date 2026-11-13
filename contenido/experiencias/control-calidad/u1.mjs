/** Curso de Control de Calidad de Medicamentos · Unidad 1. El laboratorio de control de calidad */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción al curso: el control de calidad de medicamentos',
    duracion: 15,
    gancho: {
      titulo: 'La última palabra antes del paciente',
      texto: 'Un lote de tabletas de losartán sale de la tableteadora con buen aspecto. Antes de que llegue a una farmacia, alguien debe responder con datos cuatro preguntas: ¿es losartán?, ¿tiene la cantidad declarada?, ¿está libre de impurezas por encima de lo permitido?, ¿se disolverá como debe en el cuerpo del paciente? Esa es la tarea del laboratorio de control de calidad, y este curso te enseña a hacerla con rigor.',
    },
    objetivos: [
      'Definir el control de calidad y diferenciarlo del aseguramiento de la calidad.',
      'Reconocer las cuatro preguntas que responde el análisis: identidad, pureza, potencia y desempeño.',
      'Ubicar el recorrido del curso desde la especificación hasta la liberación analítica.',
    ],
    conceptos: [
      { icono: 'FlaskConical', termino: 'Control de calidad', definicion: 'La parte de las BPM que se ocupa del muestreo, las especificaciones y los ensayos, y de que los materiales y productos no se liberen hasta que su calidad se considere satisfactoria.' },
      { icono: 'ShieldCheck', termino: 'Aseguramiento de la calidad', definicion: 'El sistema completo que garantiza la calidad; el control de calidad es una de sus partes, junto con las BPM y la gestión de riesgos.' },
      { icono: 'Target', termino: 'Especificación', definicion: 'Lista de ensayos, métodos y criterios de aceptación que un material o producto debe cumplir. Es el contrato de calidad.' },
      { icono: 'FileCheck', termino: 'Certificado de análisis', definicion: 'Documento que reporta los resultados de un lote frente a su especificación y concluye si cumple.' },
    ],
    mapa: {
      centro: 'Lo que responde el laboratorio',
      ramas: [
        { titulo: 'Identidad', icono: 'Fingerprint', nodos: ['¿Es lo que dice ser?', 'IR, HPLC, reacciones'] },
        { titulo: 'Pureza', icono: 'Search', nodos: ['¿Qué más contiene?', 'Impurezas y solventes', 'Microbiología'] },
        { titulo: 'Potencia', icono: 'Target', nodos: ['¿Cuánto activo tiene?', 'Valoración', 'Uniformidad de dosis'] },
        { titulo: 'Desempeño', icono: 'Timer', nodos: ['¿Funcionará en el paciente?', 'Disolución', 'Estabilidad'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué hace el control de calidad',
        parrafos: [
          'Las BPM de la OMS describen el control de calidad como la parte que se ocupa del **muestreo**, las **especificaciones** y los **ensayos**, y de los procedimientos de organización, documentación y liberación que aseguran que los materiales y productos no se usen ni se vendan hasta que su calidad se haya considerado satisfactoria. No se limita al laboratorio: participa en todas las decisiones que afectan la calidad.',
          'En la práctica, el laboratorio analiza materias primas, material de envase, productos en proceso y productos terminados; hace estudios de estabilidad; investiga resultados fuera de especificación; y emite los certificados de análisis que sustentan la liberación. En Colombia, los laboratorios de control de calidad se rigen por la **Resolución 3619 de 2013**, que adopta las Buenas Prácticas de Laboratorio de la OMS, además de los requisitos de control de calidad de las BPM de la Resolución 1160 de 2016.',
        ],
      },
      {
        titulo: 'El recorrido del curso',
        parrafos: [
          'La **unidad 1** presenta el laboratorio: funciones, organización y marco normativo. La **unidad 2** trata de la especificación como contrato de calidad: farmacopeas, monografías, ICH Q6A, muestreo, materias primas, material de envase y estándares de referencia. La **unidad 3** entra a las técnicas: identificación, valoraciones, impurezas, disolución, uniformidad, pH, agua por Karl Fischer, HPLC, UV-Vis y cromatografía de gases.',
          'La **unidad 4** cubre la microbiología (recuentos, microorganismos específicos, esterilidad y endotoxinas) y la estabilidad. La **unidad 5** cierra con lo que convierte los datos en decisiones: resultados fuera de especificación y de tendencia, revisión de datos, certificado de análisis y un caso integrador de liberación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Del muestreo a la liberación analítica',
      pasos: [
        { titulo: 'Recibir la muestra', detalle: 'La muestra llega identificada, con su cadena de custodia y la solicitud de análisis.', icono: 'Package', evidencia: 'Registro de recepción de muestras.' },
        { titulo: 'Planear los ensayos', detalle: 'Según la especificación vigente, se asignan ensayos, métodos y analistas.', icono: 'ClipboardList', evidencia: 'Hoja de trabajo.' },
        { titulo: 'Analizar', detalle: 'Se ejecutan los ensayos con equipos calificados, estándares vigentes y métodos validados.', icono: 'FlaskConical', evidencia: 'Datos primarios y cuadernos.' },
        { titulo: 'Revisar los datos', detalle: 'Una segunda persona verifica cálculos, idoneidad del sistema y trazabilidad.', icono: 'FileSearch', evidencia: 'Revisión firmada.' },
        { titulo: 'Emitir el certificado', detalle: 'Se reportan los resultados frente a la especificación con la conclusión.', icono: 'FileCheck', evidencia: 'Certificado de análisis.' },
      ],
    },
    caso: {
      titulo: 'La presión por liberar',
      contexto: 'Producción necesita liberar hoy un lote para cumplir un pedido. Falta el resultado de disolución, que tarda unas horas más. El jefe de planta propone liberar con los demás ensayos y «enviar la disolución después».',
      pregunta: '¿Qué responde control de calidad?',
      opciones: [
        { texto: 'Aceptar, porque los demás resultados cumplen.', correcta: false, retro: 'Cada ensayo de la especificación responde una pregunta distinta. Sin disolución no se sabe si el producto funcionará en el paciente.' },
        { texto: 'No emitir la liberación analítica hasta tener todos los ensayos de la especificación aprobados y revisados.', correcta: true, retro: 'El control de calidad no libera un producto hasta considerar su calidad satisfactoria con todos los ensayos exigidos.' },
        { texto: 'Liberar si el lote anterior cumplió disolución.', correcta: false, retro: 'Cada lote se evalúa con sus propios resultados.' },
      ],
    },
    errores: [
      { error: 'Ver el laboratorio como un área que solo «corre muestras».', correccion: 'El control de calidad decide sobre la aptitud de materiales y productos y participa en el sistema de calidad.' },
      { error: 'Liberar con ensayos pendientes.', correccion: 'Toda la especificación debe estar ejecutada, revisada y conforme.' },
    ],
    comprueba: [
      { pregunta: '¿Qué cuatro preguntas responde el análisis de un producto?', respuesta: 'Identidad, pureza, potencia y desempeño.' },
      { pregunta: '¿Qué norma colombiana regula los laboratorios de control de calidad?', respuesta: 'La Resolución 3619 de 2013, que adopta las BPL de la OMS.' },
    ],
    resumen: [
      'El control de calidad responde **identidad, pureza, potencia y desempeño**.',
      'Nada se libera sin **toda la especificación** conforme y revisada.',
      'En Colombia rige la **Resolución 3619 de 2013**, además de las BPM.',
    ],
    referencias: [REF.trs986a2, REF.res3619, REF.trs957a1, REF.res1160],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Comprimido ilustrado en el centro con cuatro lupas alrededor (identidad, pureza, potencia, desempeño) en la paleta de Edvanta.', alt: 'Las cuatro preguntas del control de calidad de un medicamento' },
    ],
    keywords: ['control de calidad de medicamentos', 'curso de control de calidad farmacéutico', 'qué es el control de calidad farmacéutico', 'laboratorio de control de calidad', 'control de calidad vs aseguramiento de calidad', 'curso gratis control de calidad'],
  },

  {
    titulo: 'Funciones del control de calidad en el ciclo de vida del medicamento',
    duracion: 20,
    gancho: {
      titulo: 'El laboratorio no aparece solo al final',
      texto: 'Muchos imaginan el laboratorio como la última estación del proceso. En realidad, el control de calidad participa desde el desarrollo del producto, cuando se diseñan los métodos y las especificaciones, hasta años después de su lanzamiento, cuando analiza muestras de estabilidad, investiga quejas o evalúa un cambio de proveedor. Entender esas funciones ayuda a ver el laboratorio como un socio del proceso y no como un obstáculo.',
    },
    objetivos: [
      'Describir las funciones del control de calidad a lo largo del ciclo de vida del medicamento.',
      'Relacionar cada función con el sistema de calidad farmacéutica de ICH Q10.',
      'Identificar las responsabilidades que no se delegan del jefe de control de calidad.',
    ],
    conceptos: [
      { icono: 'Lightbulb', termino: 'Desarrollo', definicion: 'Diseño y validación de métodos analíticos, definición de especificaciones y estudios de estabilidad para el registro sanitario.' },
      { icono: 'Factory', termino: 'Fabricación comercial', definicion: 'Análisis de materias primas, materiales, productos en proceso y terminados; liberación analítica; muestras de retención.' },
      { icono: 'LineChart', termino: 'Seguimiento', definicion: 'Estabilidad continua, tendencias de resultados, revisión periódica de calidad del producto, quejas y retiros.' },
      { icono: 'Users', termino: 'Jefe de control de calidad', definicion: 'Aprueba especificaciones y métodos, decide sobre materiales y productos, garantiza la calificación de equipos y el entrenamiento del personal del laboratorio.' },
    ],
    mapa: {
      centro: 'Control de calidad en el ciclo de vida',
      ramas: [
        { titulo: 'Desarrollar', icono: 'Lightbulb', nodos: ['Métodos analíticos', 'Especificaciones', 'Estabilidad para registro'] },
        { titulo: 'Transferir', icono: 'Truck', nodos: ['Transferencia de métodos', 'Estándares de referencia', 'Entrenamiento'] },
        { titulo: 'Fabricar', icono: 'Factory', nodos: ['Análisis y liberación', 'Muestras de retención', 'Investigaciones'] },
        { titulo: 'Vigilar', icono: 'LineChart', nodos: ['Estabilidad continua', 'Tendencias y revisión de producto', 'Quejas y cambios'] },
      ],
    },
    secciones: [
      {
        titulo: 'Del desarrollo a la fabricación',
        parrafos: [
          'En el **desarrollo**, el control de calidad diseña y valida los métodos analíticos, propone las especificaciones con base en datos y en las guías ICH, y ejecuta los estudios de estabilidad que sustentan la vida útil del registro sanitario. Cuando el producto pasa a una planta o a un laboratorio distinto, **transfiere** los métodos y demuestra que el laboratorio receptor obtiene resultados equivalentes.',
          'En la **fabricación comercial**, analiza materias primas, material de envase, productos en proceso y terminados; emite la liberación analítica; conserva las **muestras de retención** de cada lote durante el tiempo definido, para poder analizarlas si hay una queja; y participa en las investigaciones de desviaciones y resultados fuera de especificación.',
        ],
      },
      {
        titulo: 'Vigilar el producto en el tiempo',
        parrafos: [
          'Después de lanzado el producto, el laboratorio mantiene un **programa de estabilidad continua** con lotes de cada año, analiza **tendencias** de los resultados de liberación, aporta datos a la **revisión periódica de calidad del producto**, analiza muestras de **quejas** y evalúa el impacto analítico de los **cambios**: un proveedor nuevo, un cambio de método o de equipo.',
          'Las BPM asignan al jefe de control de calidad responsabilidades que no se delegan en su esencia: aprobar o rechazar materiales y productos, aprobar especificaciones, métodos y procedimientos, asegurar que se hagan los ensayos necesarios y que el personal esté entrenado y los equipos calificados. ICH Q10 integra todo esto en un sistema de calidad que acompaña al producto durante toda su vida.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo participa el laboratorio en un cambio de proveedor',
      pasos: [
        { titulo: 'Recibir la solicitud de cambio', detalle: 'Control de cambios informa el proveedor nuevo propuesto para una materia prima.', icono: 'GitBranch', evidencia: 'Solicitud de cambio.' },
        { titulo: 'Evaluar documentación', detalle: 'Revisa el certificado de análisis, la especificación del proveedor y su método.', icono: 'FileSearch', evidencia: 'Evaluación documental.' },
        { titulo: 'Analizar muestras', detalle: 'Analiza lotes del proveedor nuevo con la especificación interna completa.', icono: 'FlaskConical', evidencia: 'Resultados analíticos.' },
        { titulo: 'Evaluar impacto en el producto', detalle: 'Con producción, define si se requieren lotes de prueba o estabilidad adicional.', icono: 'AlertTriangle', evidencia: 'Evaluación de impacto.' },
        { titulo: 'Recomendar', detalle: 'Emite su concepto para la decisión del control de cambios.', icono: 'CheckCircle2', evidencia: 'Concepto del laboratorio.' },
      ],
    },
    caso: {
      titulo: 'La queja de un paciente',
      contexto: 'Una farmacia reporta que unas tabletas de un lote vendido hace un año se ven manchadas. El laboratorio tiene muestras de retención de ese lote.',
      pregunta: '¿Qué función cumple aquí el control de calidad?',
      opciones: [
        { texto: 'Ninguna: las quejas las maneja el área comercial.', correcta: false, retro: 'Las quejas de calidad requieren investigación técnica, y el laboratorio tiene las muestras para hacerla.' },
        { texto: 'Analizar las muestras de retención y las devueltas, revisar el registro de lote y los datos de estabilidad, y aportar a la investigación de la queja.', correcta: true, retro: 'Las muestras de retención existen justamente para investigar quejas sobre lotes ya distribuidos.' },
        { texto: 'Solo archivar la queja en el expediente del lote.', correcta: false, retro: 'Archivar sin investigar impide saber si hay un problema de calidad que afecte a otros pacientes.' },
      ],
    },
    errores: [
      { error: 'Excluir al laboratorio de las decisiones de cambio.', correccion: 'Involucra a control de calidad en el control de cambios desde el inicio.' },
      { error: 'No conservar muestras de retención suficientes.', correccion: 'Guarda la cantidad definida de cada lote por el tiempo establecido.' },
    ],
    comprueba: [
      { pregunta: '¿Para qué sirven las muestras de retención?', respuesta: 'Para poder analizar un lote ya distribuido, por ejemplo ante una queja.' },
      { pregunta: 'Menciona dos funciones del laboratorio después del lanzamiento.', respuesta: 'Estabilidad continua y análisis de tendencias (también quejas y evaluación de cambios).' },
    ],
    resumen: [
      'El control de calidad acompaña al producto **desde el desarrollo hasta el retiro**.',
      'Analiza, libera, retiene muestras e **investiga**.',
      'ICH Q10 integra sus funciones en el **sistema de calidad**.',
    ],
    referencias: [REF.ichQ10, REF.trs986a2, REF.res3619, REF.trs957a1],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Línea de vida del medicamento con etapas (desarrollo, transferencia, fabricación, vigilancia) y un icono de matraz presente en cada una.', alt: 'Funciones del control de calidad a lo largo del ciclo de vida del medicamento' },
    ],
    keywords: ['funciones del control de calidad', 'control de calidad ciclo de vida del medicamento', 'muestras de retención', 'jefe de control de calidad responsabilidades', 'ich q10 control de calidad'],
  },

  {
    titulo: 'Organización, áreas y personal del laboratorio',
    duracion: 20,
    gancho: {
      titulo: 'Microbiología al lado del HPLC',
      texto: 'Un laboratorio pequeño acomodó el área de microbiología en un rincón del laboratorio fisicoquímico, junto al HPLC y la balanza analítica. Las placas de recuento empezaron a mostrar contaminaciones intermitentes y, de paso, el polvo de las preparaciones afectaba la balanza. Separar áreas no es una cuestión estética: protege la validez de los resultados.',
    },
    objetivos: [
      'Describir la organización y las áreas que requiere un laboratorio de control de calidad.',
      'Explicar por qué se separan las áreas de microbiología, instrumental y almacenamiento.',
      'Definir los requisitos de competencia del personal del laboratorio.',
    ],
    conceptos: [
      { icono: 'Building2', termino: 'Separación de áreas', definicion: 'El laboratorio de control de calidad debe estar separado de producción, y las áreas de microbiología, instrumental y de muestras deben separarse según su riesgo.' },
      { icono: 'Microscope', termino: 'Área de microbiología', definicion: 'Zona con acceso controlado, ambiente adecuado y, para ensayos de esterilidad, condiciones asépticas, separada del resto del laboratorio.' },
      { icono: 'Cpu', termino: 'Área instrumental', definicion: 'Espacio para equipos sensibles a vibraciones, humedad o interferencias eléctricas, como balanzas analíticas y cromatógrafos.' },
      { icono: 'GraduationCap', termino: 'Competencia del personal', definicion: 'Formación, entrenamiento y evaluación que demuestran que cada analista puede ejecutar los ensayos asignados.' },
    ],
    mapa: {
      centro: 'Un laboratorio que produce datos confiables',
      ramas: [
        { titulo: 'Áreas', icono: 'Building2', nodos: ['Separado de producción', 'Microbiología aparte', 'Instrumental protegida'] },
        { titulo: 'Almacenamiento', icono: 'Warehouse', nodos: ['Muestras y retenciones', 'Reactivos y estándares', 'Sustancias peligrosas'] },
        { titulo: 'Personas', icono: 'Users', nodos: ['Jefe independiente', 'Analistas competentes', 'Supervisión y revisión'] },
        { titulo: 'Organización', icono: 'Network', nodos: ['Funciones escritas', 'Sistema documental', 'Gestión de muestras'] },
      ],
    },
    secciones: [
      {
        titulo: 'Áreas que protegen el resultado',
        parrafos: [
          'Las BPM y la Resolución 3619 de 2013 piden que los laboratorios de control de calidad estén separados de las áreas de producción, y que las áreas de **microbiología**, de **instrumentos sensibles** y de manejo de **radioisótopos o sustancias biológicas** se separen entre sí cuando corresponda. El objetivo es doble: evitar contaminaciones que invaliden los ensayos y proteger los equipos de condiciones que alteren sus mediciones.',
          'El laboratorio necesita además espacio suficiente para trabajar sin confusiones, áreas de almacenamiento para **muestras**, **muestras de retención**, **reactivos**, **estándares de referencia** (con las condiciones de temperatura que exijan) y **sustancias peligrosas**, y un área de lavado de material. Las condiciones ambientales que afectan los ensayos, como la temperatura y la humedad, se controlan y registran.',
        ],
      },
      {
        titulo: 'Personal y organización',
        parrafos: [
          'El laboratorio está bajo la dirección de un responsable de control de calidad **independiente de producción**, con formación y experiencia adecuadas. Los analistas tienen formación acorde con los ensayos que ejecutan, reciben entrenamiento en cada método y son **evaluados** antes de trabajar de forma independiente; su competencia se mantiene con entrenamiento continuo y, cuando aplica, con ensayos de aptitud.',
          'La organización se documenta en un organigrama y en descripciones de cargo. El laboratorio tiene un sistema para recibir, registrar, distribuir y conservar muestras, y un sistema documental para especificaciones, métodos, procedimientos y registros. La guía de la OMS para laboratorios (TRS 957, Anexo 1) y su módulo de entrenamiento de precalificación detallan estos requisitos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Habilitar a un analista nuevo para un método',
      pasos: [
        { titulo: 'Revisar la formación', detalle: 'Verifica que su formación corresponda con el tipo de ensayos que hará.', icono: 'GraduationCap', evidencia: 'Hoja de vida verificada.' },
        { titulo: 'Entrenar en BPL y seguridad', detalle: 'Inducción en buenas prácticas de laboratorio, integridad de datos y seguridad.', icono: 'ShieldCheck', evidencia: 'Registro de inducción.' },
        { titulo: 'Entrenar en el método', detalle: 'Un analista calificado enseña el método y supervisa sus primeras ejecuciones.', icono: 'Users', evidencia: 'Registro de entrenamiento.' },
        { titulo: 'Evaluar la competencia', detalle: 'El analista analiza muestras de valor conocido o en paralelo y se comparan los resultados con criterios definidos.', icono: 'Target', evidencia: 'Resultados de la evaluación.' },
        { titulo: 'Autorizar', detalle: 'El jefe de laboratorio autoriza al analista para ese método.', icono: 'BadgeCheck', evidencia: 'Matriz de autorizaciones actualizada.' },
      ],
    },
    caso: {
      titulo: 'Espacio para un equipo nuevo',
      contexto: 'Llega un HPLC nuevo y el único espacio libre es junto a la cabina de flujo laminar de microbiología, cerca de la puerta del área de lavado.',
      pregunta: '¿Qué decisión protege los resultados?',
      opciones: [
        { texto: 'Instalarlo allí porque es el único espacio.', correcta: false, retro: 'Mezclar áreas instrumentales y microbiológicas expone ambos ensayos a interferencias y contaminación.' },
        { texto: 'Reorganizar las áreas para mantener la microbiología separada y ubicar el HPLC en el área instrumental con condiciones controladas, aunque implique ajustes temporales.', correcta: true, retro: 'La separación de áreas protege la validez de los resultados; el espacio se organiza según el riesgo.' },
        { texto: 'Instalarlo y limpiar más seguido.', correcta: false, retro: 'La limpieza no resuelve las interferencias ni el riesgo de contaminación cruzada entre ensayos.' },
      ],
    },
    errores: [
      { error: 'Microbiología compartiendo área con el laboratorio fisicoquímico.', correccion: 'Separa la microbiología con acceso controlado y ambiente adecuado.' },
      { error: 'Analistas que ejecutan métodos sin autorización.', correccion: 'Mantén una matriz de autorizaciones por método basada en evaluación de competencia.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué se separa el área de microbiología?', respuesta: 'Para evitar contaminaciones que invaliden los ensayos y proteger otras áreas.' },
      { pregunta: '¿Cómo se habilita a un analista para un método?', respuesta: 'Con entrenamiento supervisado, evaluación de competencia con criterios definidos y autorización del jefe de laboratorio.' },
    ],
    resumen: [
      'El laboratorio se **separa de producción** y organiza sus áreas por riesgo.',
      'Microbiología e instrumental requieren **condiciones propias**.',
      'Cada analista se **evalúa y autoriza** por método.',
    ],
    referencias: [REF.res3619, REF.trs957a1, REF.whoQclModulo, REF.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de áreas', descripcion: 'Plano ilustrado de un laboratorio con zonas por color: fisicoquímico, instrumental, microbiología con esclusa, almacén de muestras y lavado.', alt: 'Distribución de áreas de un laboratorio de control de calidad' },
    ],
    keywords: ['áreas del laboratorio de control de calidad', 'organización laboratorio farmacéutico', 'personal del laboratorio de control de calidad', 'competencia de analistas', 'separación área de microbiología', 'diseño de laboratorio farmacéutico'],
  },

  {
    titulo: 'Resolución 3619 de 2013: BPL para laboratorios de control de calidad',
    duracion: 25,
    gancho: {
      titulo: 'El mismo resultado, dos niveles de confianza',
      texto: 'Dos laboratorios reportan el mismo 99,5 % de valoración para una muestra. Uno puede mostrar el método validado, el estándar vigente, el equipo calificado, el analista autorizado y el cromatograma original con su pista de auditoría. El otro solo tiene el número en un formato. Para el INVIMA, solo el primero es un dato confiable. La Resolución 3619 de 2013 define qué hace falta para serlo.',
    },
    objetivos: [
      'Describir el origen y el alcance de la Resolución 3619 de 2013.',
      'Identificar los grandes bloques de requisitos de las BPL de control de calidad.',
      'Relacionar la resolución con la certificación de laboratorios por el INVIMA.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'Resolución 3619 de 2013', definicion: 'Adopta el Manual de Buenas Prácticas de Laboratorio de Control de Calidad de Productos Farmacéuticos, basado en la guía de la OMS (TRS 957, Anexo 1).' },
      { icono: 'BookOpen', termino: 'TRS 957, Anexo 1', definicion: 'Las buenas prácticas de la OMS para laboratorios de control de calidad farmacéutico, de 2010, con versión en español de la Red PARF.' },
      { icono: 'Award', termino: 'Certificación de BPL', definicion: 'Verificación del INVIMA de que un laboratorio de control de calidad cumple el manual, necesaria para prestar servicios de análisis.' },
      { icono: 'Scale', termino: 'BPL de la OCDE', definicion: 'Otro conjunto de principios, para estudios no clínicos de seguridad. No es lo mismo que las BPL de control de calidad.' },
    ],
    mapa: {
      centro: 'Qué exige la Resolución 3619 de 2013',
      ramas: [
        { titulo: 'Gestión', icono: 'Network', nodos: ['Organización y sistema de calidad', 'Control documental', 'Quejas y acciones correctivas'] },
        { titulo: 'Recursos', icono: 'Building2', nodos: ['Personal competente', 'Instalaciones', 'Equipos calificados y calibrados'] },
        { titulo: 'Materiales', icono: 'TestTube', nodos: ['Reactivos', 'Estándares de referencia', 'Muestras'] },
        { titulo: 'Trabajo', icono: 'ClipboardCheck', nodos: ['Métodos validados', 'Análisis y revisión', 'Certificados e informes'] },
      ],
    },
    secciones: [
      {
        titulo: 'De la OMS a Colombia',
        parrafos: [
          'La **Resolución 3619 de 2013** del Ministerio de Salud y Protección Social adoptó el Manual de Buenas Prácticas de Laboratorio de Control de Calidad de Productos Farmacéuticos. Su base es la guía de la OMS sobre buenas prácticas para laboratorios de control de calidad (TRS 957, Anexo 1, de 2010), que la Red Panamericana para la Armonización de la Reglamentación Farmacéutica difundió en español. El propio laboratorio de control de calidad del INVIMA obtuvo el reconocimiento de la OMS en buenas prácticas, como informó la OPS en 2020.',
          'El manual aplica a los laboratorios de control de calidad de fabricantes y a los laboratorios externos que prestan servicios de análisis. Para el sistema, la consecuencia práctica es que un resultado analítico usado para liberar un lote o sustentar un registro debe venir de un laboratorio que cumpla estas prácticas.',
        ],
      },
      {
        titulo: 'Los bloques de requisitos',
        parrafos: [
          'El manual se organiza en grandes bloques: **gestión e infraestructura** (organización, sistema de calidad, control de documentos y registros, equipos de procesamiento de datos, personal, instalaciones, equipos e instrumentos, contratos); **materiales** (reactivos, sustancias y materiales de referencia, calibración y calificación de equipos, trazabilidad); **procedimientos de trabajo** (recepción de muestras, hojas de trabajo analíticas, validación de procedimientos, ensayos, evaluación de resultados, certificados de análisis, muestras de retención); y **seguridad**.',
          'Un laboratorio que cumple puede reconstruir, para cada resultado, qué método se usó y su estado de validación, qué estándar y su vigencia, qué equipo y su calificación, qué analista y su autorización, y dónde está el dato original. El INVIMA publicó además un comparativo entre estos requisitos y otros estándares, útil para laboratorios que también buscan acreditación ISO/IEC 17025, que verás en el curso de BPL.',
        ],
      },
    ],
    proceso: {
      titulo: 'Reconstruir un resultado como lo haría un inspector',
      pasos: [
        { titulo: 'Partir del certificado', detalle: 'Toma un resultado del certificado de análisis de un lote.', icono: 'FileCheck', evidencia: 'Certificado de análisis.' },
        { titulo: 'Ir a la hoja de trabajo', detalle: 'Ubica la hoja de trabajo o el registro electrónico con los datos primarios.', icono: 'ClipboardList', evidencia: 'Hoja de trabajo.' },
        { titulo: 'Verificar el método', detalle: 'Confirma la versión del método y su validación o verificación.', icono: 'BookOpen', evidencia: 'Método vigente y su informe de validación.' },
        { titulo: 'Verificar estándar y reactivos', detalle: 'Revisa lote, vigencia y calificación del estándar y la preparación de soluciones.', icono: 'TestTube', evidencia: 'Registros de estándares y reactivos.' },
        { titulo: 'Verificar equipo y analista', detalle: 'Confirma la calificación y calibración del equipo y la autorización del analista.', icono: 'Cpu', evidencia: 'Bitácora del equipo y matriz de autorizaciones.' },
        { titulo: 'Verificar el dato original', detalle: 'Revisa el cromatograma o el dato electrónico y su pista de auditoría.', icono: 'Fingerprint', evidencia: 'Dato original y pista de auditoría.' },
      ],
    },
    caso: {
      titulo: 'Un laboratorio externo sin certificación',
      contexto: 'Para ahorrar costos, un titular de registro propone enviar sus análisis de liberación a un laboratorio universitario muy competente, pero sin certificación de BPL del INVIMA.',
      pregunta: '¿Qué recomiendas?',
      opciones: [
        { texto: 'Aceptarlo por la competencia técnica de la universidad.', correcta: false, retro: 'La competencia técnica no reemplaza el cumplimiento demostrado de las BPL exigidas para análisis de control de calidad.' },
        { texto: 'Contratar un laboratorio que cumpla las BPL de la Resolución 3619 de 2013 y esté certificado por el INVIMA para los ensayos requeridos, con acuerdo técnico de calidad.', correcta: true, retro: 'Los resultados que sustentan la liberación deben venir de un laboratorio que cumpla y demuestre las BPL.' },
        { texto: 'Usar la universidad y revisar los resultados internamente.', correcta: false, retro: 'Revisar resultados no corrige que se hayan generado sin el sistema de BPL exigido.' },
      ],
    },
    errores: [
      { error: 'Confundir BPL de control de calidad con BPL de la OCDE.', correccion: 'Las de la OCDE aplican a estudios no clínicos; las de la Resolución 3619 de 2013, a laboratorios de control de calidad.' },
      { error: 'Tener el dato pero no su trazabilidad.', correccion: 'Asegura que cada resultado se pueda reconstruir: método, estándar, equipo, analista y dato original.' },
    ],
    comprueba: [
      { pregunta: '¿En qué guía de la OMS se basa la Resolución 3619 de 2013?', respuesta: 'En las buenas prácticas para laboratorios de control de calidad, TRS 957, Anexo 1.' },
      { pregunta: 'Menciona los grandes bloques del manual.', respuesta: 'Gestión e infraestructura, materiales y equipos, procedimientos de trabajo y seguridad.' },
    ],
    resumen: [
      'La **Resolución 3619 de 2013** adopta las BPL de control de calidad de la OMS.',
      'Cubre gestión, recursos, materiales, procedimientos de trabajo y seguridad.',
      'Un dato confiable es un dato **trazable**.',
    ],
    referencias: [REF.res3619, REF.res3619Compilada, REF.trs957a1, REF.trs957es, REF.pahoInvimaLab, REF.invimaComparativo],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Cadena ilustrada que une un certificado con hoja de trabajo, método, estándar, equipo, analista y dato original, en colores de marca.', alt: 'Trazabilidad de un resultado analítico en un laboratorio de control de calidad' },
    ],
    keywords: ['resolución 3619 de 2013', 'bpl control de calidad colombia', 'buenas prácticas de laboratorio farmacéutico', 'trs 957 anexo 1', 'certificación bpl invima', 'manual de buenas prácticas de laboratorio'],
  },

  {
    titulo: 'Requisitos de control de calidad en las BPM (Res. 1160/2016) y en el registro sanitario',
    duracion: 20,
    gancho: {
      titulo: 'Una especificación que no era la registrada',
      texto: 'Un laboratorio actualizó su método de disolución a una versión «mejor» y cambió el tiempo de muestreo de 30 a 45 minutos. Los lotes cumplían con holgura. En una revisión del INVIMA se detectó que el registro sanitario seguía declarando 30 minutos. El producto pudo ser bueno, pero se liberó con una especificación que no era la aprobada. El control de calidad responde ante dos marcos: las BPM y el registro sanitario.',
    },
    objetivos: [
      'Identificar los requisitos de control de calidad de las BPM de la Resolución 1160 de 2016.',
      'Relacionar la especificación aprobada en el registro sanitario con la liberación de lotes.',
      'Reconocer cuándo un cambio analítico exige trámite ante el INVIMA.',
    ],
    conceptos: [
      { icono: 'BookOpen', termino: 'Capítulo de control de calidad de las BPM', definicion: 'Requisitos sobre muestreo, especificaciones, ensayos, documentación, liberación, estabilidad y muestras de retención dentro de la planta fabricante.' },
      { icono: 'FileCheck', termino: 'Especificación registrada', definicion: 'La que se aprobó en el registro sanitario: ensayos, métodos y límites con los que se debe liberar el producto.' },
      { icono: 'GitBranch', termino: 'Cambio analítico', definicion: 'Modificación de un método o un límite. Si afecta lo registrado, requiere evaluación y, según el caso, trámite de modificación ante el INVIMA.' },
      { icono: 'Landmark', termino: 'Decreto 677 de 1995', definicion: 'Marco del registro sanitario y del control de calidad de los medicamentos en Colombia.' },
    ],
    mapa: {
      centro: 'Dos marcos para el control de calidad',
      ramas: [
        { titulo: 'BPM', icono: 'BookOpen', nodos: ['Muestreo y especificaciones', 'Ensayos y liberación', 'Estabilidad y retenciones'] },
        { titulo: 'Registro sanitario', icono: 'FileCheck', nodos: ['Especificación aprobada', 'Métodos declarados', 'Vida útil'] },
        { titulo: 'Coherencia', icono: 'Scale', nodos: ['Liberar con lo registrado', 'Cambios por control de cambios', 'Trámite si aplica'] },
        { titulo: 'Inspección', icono: 'ShieldCheck', nodos: ['Guía de inspección', 'Comparación con el expediente', 'Datos íntegros'] },
      ],
    },
    secciones: [
      {
        titulo: 'Lo que piden las BPM',
        parrafos: [
          'El capítulo de control de calidad de los manuales de BPM adoptados por la Resolución 1160 de 2016 exige, entre otros: que existan especificaciones aprobadas para materias primas, material de envase, productos intermedios, a granel y terminados; que el muestreo se haga con procedimientos escritos; que los ensayos se hagan con métodos validados; que los resultados se registren y se revisen; que ningún lote se libere sin la evaluación de control de calidad; que exista un programa de estabilidad continua; y que se conserven muestras de retención.',
          'Las BPM conectan el laboratorio con la planta: control de calidad participa en las investigaciones, en la aprobación de proveedores, en la revisión periódica de producto y en el control de cambios. La guía de inspección del INVIMA revisa estos requisitos en la planta, además de las BPL del laboratorio.',
        ],
      },
      {
        titulo: 'La especificación del registro sanitario',
        parrafos: [
          'El registro sanitario, en el marco del Decreto 677 de 1995 y sus normas posteriores, aprueba la **especificación** del producto terminado y sus métodos. Por eso el laboratorio debe liberar con **exactamente** lo aprobado: los mismos ensayos, los mismos límites y métodos equivalentes. Un método farmacopeico debe usarse en la edición vigente de la farmacopea oficial que corresponda.',
          'Cuando se quiere cambiar un método o un límite, el cambio se gestiona por **control de cambios**: se evalúa su impacto, se valida el método nuevo y se determina si requiere un trámite de modificación del registro ante el INVIMA antes de implementarse. Mejorar un método no autoriza a usarlo para liberar si no coincide con lo registrado. El curso de Modificaciones al Registro Sanitario profundiza estos trámites.',
        ],
      },
    ],
    proceso: {
      titulo: 'Gestionar un cambio de método analítico',
      pasos: [
        { titulo: 'Proponer el cambio', detalle: 'Documenta qué método o límite cambia y por qué.', icono: 'GitBranch', evidencia: 'Solicitud de cambio.' },
        { titulo: 'Comparar con el registro', detalle: 'Verifica qué dice el expediente del registro sanitario sobre ese ensayo.', icono: 'FileSearch', evidencia: 'Comparación con el expediente.' },
        { titulo: 'Validar el método nuevo', detalle: 'Valida y demuestra que es igual o mejor que el registrado.', icono: 'FlaskConical', evidencia: 'Informe de validación y comparación.' },
        { titulo: 'Determinar el trámite', detalle: 'Con asuntos regulatorios, define si requiere modificación del registro.', icono: 'Landmark', evidencia: 'Concepto regulatorio.' },
        { titulo: 'Implementar con aprobación', detalle: 'Solo después de la aprobación que corresponda, se actualiza la especificación y se entrena.', icono: 'CheckCircle2', evidencia: 'Especificación vigente y entrenamiento.' },
      ],
    },
    caso: {
      titulo: 'El método «mejorado»',
      contexto: 'El laboratorio desarrolló un método HPLC más rápido para la valoración de un producto. Está validado y da resultados equivalentes. El jefe quiere empezar a usarlo mañana para liberar.',
      pregunta: '¿Qué falta?',
      opciones: [
        { texto: 'Nada: si está validado y es equivalente, se puede usar.', correcta: false, retro: 'La validación es necesaria, pero el método de liberación debe coincidir con lo registrado o estar aprobado según el trámite que corresponda.' },
        { texto: 'Gestionarlo por control de cambios, verificar si el registro sanitario lo ampara o requiere modificación, y usarlo para liberar solo después de la aprobación correspondiente.', correcta: true, retro: 'La coherencia entre la liberación y el registro sanitario es un requisito legal, además de técnico.' },
        { texto: 'Usarlo en paralelo y reportar el resultado más favorable.', correcta: false, retro: 'Escoger el resultado más favorable es una práctica inaceptable que compromete la integridad de los datos.' },
      ],
    },
    errores: [
      { error: 'Liberar con especificaciones internas distintas a las registradas.', correccion: 'Alinea la especificación de liberación con el registro sanitario.' },
      { error: 'Cambiar métodos sin control de cambios.', correccion: 'Evalúa, valida y define el trámite regulatorio antes de implementar.' },
    ],
    comprueba: [
      { pregunta: '¿Con qué especificación se libera un producto?', respuesta: 'Con la aprobada en su registro sanitario.' },
      { pregunta: '¿Basta validar un método nuevo para usarlo en liberación?', respuesta: 'No: también debe estar amparado por el registro o aprobado mediante el trámite correspondiente.' },
    ],
    resumen: [
      'El control de calidad responde ante **las BPM y el registro sanitario**.',
      'Se libera con la **especificación registrada**.',
      'Los cambios analíticos pasan por **control de cambios** y, si aplica, por el INVIMA.',
    ],
    referencias: [REF.res1160, REF.dec677, REF.res3619, REF.ichQ6A],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Dos documentos ilustrados lado a lado (especificación interna y registro sanitario) unidos por un signo de igual en turquesa.', alt: 'Coherencia entre la especificación de liberación y el registro sanitario' },
    ],
    keywords: ['control de calidad bpm resolución 1160', 'especificaciones registro sanitario', 'cambio de método analítico invima', 'requisitos de control de calidad bpm', 'liberación de lotes control de calidad'],
  },
];

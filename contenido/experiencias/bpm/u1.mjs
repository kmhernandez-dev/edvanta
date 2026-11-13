/** Curso de BPM · Unidad 1. Fundamentos y marco regulatorio de las BPM en Colombia */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción al curso: qué son las BPM y por qué importan',
    duracion: 20,
    gancho: {
      titulo: 'El análisis final no lo puede ver todo',
      texto: 'Un lote de 500.000 tabletas se libera con un muestreo de unas pocas decenas de unidades. Si una sola caja de otro producto se coló en la línea de empaque, o si un residuo del lote anterior quedó en la tolva, es muy probable que el análisis final no lo detecte. Por eso la calidad de un medicamento no se comprueba al final: se construye en cada paso. Ese es el corazón de las Buenas Prácticas de Manufactura.',
    },
    objetivos: [
      'Definir las BPM y su lugar dentro del sistema de aseguramiento de la calidad.',
      'Explicar por qué el control de calidad del producto terminado no basta.',
      'Reconocer los riesgos que las BPM buscan prevenir: contaminación, contaminación cruzada y mezclas.',
      'Ubicar el recorrido del curso desde el marco legal hasta la certificación del INVIMA.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'Buenas Prácticas de Manufactura', definicion: 'La parte del aseguramiento de la calidad que garantiza que los medicamentos se fabrican y controlan de forma consistente según estándares de calidad adecuados para su uso y según su registro sanitario.' },
      { icono: 'Layers', termino: 'Aseguramiento de la calidad', definicion: 'El sistema completo de actividades organizadas para que el producto tenga la calidad requerida. Incluye las BPM, el control de calidad y la gestión de riesgos.' },
      { icono: 'Shuffle', termino: 'Mezcla (mix-up)', definicion: 'Confusión entre materiales, productos, rótulos o documentos de lotes distintos. Es una de las causas más frecuentes de retiros del mercado y rara vez la detecta el muestreo final.' },
      { icono: 'Bug', termino: 'Contaminación cruzada', definicion: 'La presencia de un material o producto en otro. Puede llegar por residuos en equipos, por el aire, por las personas o por mezclas.' },
    ],
    mapa: {
      centro: 'Qué protegen las BPM',
      ramas: [
        { titulo: 'Al paciente', icono: 'Users', nodos: ['Medicamento seguro y eficaz', 'Igual en cada lote', 'Como dice el registro sanitario'] },
        { titulo: 'De qué riesgos', icono: 'AlertTriangle', nodos: ['Contaminación', 'Contaminación cruzada', 'Mezclas y confusiones'] },
        { titulo: 'Con qué recursos', icono: 'Factory', nodos: ['Personal entrenado', 'Instalaciones y equipos adecuados', 'Procesos validados'] },
        { titulo: 'Con qué evidencia', icono: 'FileCheck', nodos: ['Procedimientos escritos', 'Registros completos', 'Revisión antes de liberar'] },
      ],
    },
    secciones: [
      {
        titulo: 'La calidad se construye, no se inspecciona',
        parrafos: [
          'Las BPM existen porque hay riesgos que ningún análisis final puede descartar. Un muestreo estadístico detecta defectos frecuentes, pero no una caja equivocada entre miles ni una contaminación localizada en unas pocas unidades. Por eso las BPM exigen controlar todo lo que rodea a la fabricación: quién trabaja y cómo se entrena, dónde se fabrica, con qué equipos, con qué materiales, con qué instrucciones y con qué registros.',
          'La OMS describe las BPM como la parte del aseguramiento de la calidad que garantiza que los productos se fabrican y controlan de forma consistente según estándares adecuados para su uso y según su autorización de comercialización. En Colombia, esa autorización es el **registro sanitario** del INVIMA: fabricar fuera de lo registrado, aunque el producto «salga bien», es un incumplimiento.',
          'Las BPM se apoyan en una idea simple que guiará todo el curso: **lo que no está escrito no ocurrió**. Cada operación tiene un procedimiento, cada lote tiene un registro y cada decisión de calidad queda documentada. No es burocracia: es la única forma de reconstruir qué pasó cuando algo sale mal.',
        ],
      },
      {
        titulo: 'Cómo está organizado este curso',
        parrafos: [
          'La **unidad 1** explica de dónde salen las BPM y cuál es el marco legal colombiano: los decretos, la Resolución 1160 de 2016 y las normas especiales. La **unidad 2** recorre los recursos: personal, instalaciones, equipos y sistemas críticos como el agua y el aire. La **unidad 3** entra al proceso productivo: contaminación cruzada, despeje de línea, rendimientos, registros de lote y materiales.',
          'La **unidad 4** se dedica a los productos estériles y a los cambios del Anexo 1 de 2022. La **unidad 5** cierra con la fabricación por contrato, la autoinspección y el procedimiento de certificación ante el INVIMA. En cada clase encontrarás un caso para decidir, un mapa del proceso que puedes practicar y las referencias para leer la norma en su fuente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo protegen las BPM un lote, de principio a fin',
      pasos: [
        { titulo: 'Materiales aprobados', detalle: 'Solo entran a producción materias primas y material de envase de proveedores aprobados, analizados y liberados por control de calidad.', icono: 'PackageCheck', evidencia: 'Certificados y rótulos de aprobado.' },
        { titulo: 'Área y equipos listos', detalle: 'El área está limpia, sin materiales del lote anterior y con los equipos calificados, calibrados y rotulados como limpios.', icono: 'ClipboardCheck', evidencia: 'Despeje de línea verificado.' },
        { titulo: 'Fabricar según instrucciones', detalle: 'Se sigue la orden de producción aprobada, con pesajes verificados y controles en proceso.', icono: 'Factory', evidencia: 'Registro de lote diligenciado en el momento.' },
        { titulo: 'Controlar y conciliar', detalle: 'Se calculan rendimientos, se concilia el material impreso y se investigan las desviaciones.', icono: 'Calculator', evidencia: 'Conciliación y desviaciones cerradas.' },
        { titulo: 'Analizar y revisar', detalle: 'Control de calidad analiza el producto y aseguramiento de calidad revisa todo el registro del lote.', icono: 'FileSearch', evidencia: 'Certificado de análisis y revisión del registro.' },
        { titulo: 'Liberar', detalle: 'La persona autorizada decide la liberación solo si todo cumple con el registro sanitario y las BPM.', icono: 'Signature', evidencia: 'Liberación firmada.' },
      ],
    },
    caso: {
      titulo: 'El lote que cumple todas las especificaciones',
      contexto: 'Un lote de jarabe cumple todas las especificaciones en el laboratorio. Al revisar el registro de lote, aseguramiento de calidad encuentra que el despeje de línea antes del envasado no tiene la firma de verificación y que la conciliación de etiquetas muestra 300 unidades faltantes.',
      pregunta: '¿Se puede liberar el lote?',
      opciones: [
        { texto: 'Sí, porque el análisis demuestra que el producto cumple.', correcta: false, retro: 'El análisis no puede descartar una mezcla de etiquetas: 300 etiquetas faltantes podrían estar en otro producto o en este lote mal rotuladas.' },
        { texto: 'No hasta investigar el faltante de etiquetas y la falta de verificación del despeje, evaluar el impacto y documentar la decisión.', correcta: true, retro: 'Las BPM existen justamente para estos riesgos que el análisis no ve. El lote queda retenido hasta cerrar la investigación.' },
        { texto: 'Sí, si el jefe de producción firma ahora el despeje de línea.', correcta: false, retro: 'Firmar después lo que no se verificó en su momento es una falla grave de integridad de datos.' },
      ],
    },
    errores: [
      { error: 'Pensar que las BPM son responsabilidad solo de aseguramiento de calidad.', correccion: 'Las BPM las cumple cada persona que toca el producto: producción, almacén, mantenimiento y control de calidad.' },
      { error: 'Confiar en que el análisis final detectará cualquier problema.', correccion: 'Las mezclas y la contaminación localizada se previenen en el proceso; el análisis final solo confirma.' },
      { error: 'Fabricar distinto a lo registrado porque «da el mismo resultado».', correccion: 'Cualquier cambio frente al registro sanitario se gestiona por control de cambios y, si aplica, ante el INVIMA.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tres riesgos principales previenen las BPM?', respuesta: 'La contaminación, la contaminación cruzada y las mezclas o confusiones.' },
      { pregunta: '¿Por qué no basta el control de calidad del producto terminado?', respuesta: 'Porque el muestreo no detecta defectos raros o localizados, como una caja equivocada o un residuo en pocas unidades.' },
      { pregunta: '¿Qué significa «lo que no está escrito no ocurrió»?', respuesta: 'Que toda actividad de BPM debe estar documentada para demostrar que se hizo y reconstruir lo que pasó.' },
    ],
    resumen: [
      'Las BPM garantizan que cada lote se fabrique **igual y según el registro sanitario**.',
      'Previenen contaminación, contaminación cruzada y **mezclas** que el análisis final no ve.',
      'La calidad **se construye** con personas, instalaciones, procesos y registros.',
    ],
    referencias: [REF.trs986a2, REF.res1160, REF.informe32, REF.dec677],
    imagenes: [
      { ubicacion: 'Después de la situación inicial', descripcion: 'Ilustración de una línea de producción con una lupa que solo alcanza a ver unas pocas tabletas del lote, mientras el resto queda fuera del foco; colores azul y turquesa de Edvanta.', alt: 'El muestreo final solo ve una pequeña parte del lote' },
    ],
    keywords: ['qué son las bpm', 'buenas prácticas de manufactura qué son', 'curso de bpm gratis', 'curso gmp gratis', 'buenas prácticas de manufactura farmacéutica', 'bpm industria farmacéutica', 'importancia de las bpm', 'bpm en colombia', 'curso de buenas prácticas de manufactura', 'gmp farmacéutica en español'],
  },

  {
    titulo: 'Origen de las BPM: de la tragedia de la talidomida a la OMS',
    duracion: 20,
    gancho: {
      titulo: 'Cada norma tiene una historia detrás',
      texto: 'En 1937, un jarabe de sulfanilamida disuelto en dietilenglicol causó más de cien muertes en Estados Unidos. A comienzos de los años sesenta, la talidomida, vendida como sedante para embarazadas, dejó miles de niños con malformaciones en varios países. Muchas reglas que hoy parecen exageradas en una planta nacieron de tragedias así. Entender ese origen ayuda a cumplirlas con convicción.',
    },
    objetivos: [
      'Relacionar las principales tragedias farmacéuticas con el nacimiento de la regulación.',
      'Describir cómo la OMS adoptó las primeras BPM y por qué buscaba armonizarlas.',
      'Explicar qué lección de cada tragedia sigue vigente en las BPM actuales.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Elixir de sulfanilamida (1937)', definicion: 'Un solvente tóxico, el dietilenglicol, causó más de cien muertes en Estados Unidos. Impulsó la ley de 1938 que exigió demostrar la seguridad antes de comercializar.' },
      { icono: 'Users', termino: 'Talidomida (1957-1962)', definicion: 'Sedante que causó malformaciones graves en recién nacidos. Llevó a exigir pruebas de eficacia y seguridad más estrictas y a reforzar el control de la fabricación.' },
      { icono: 'Globe', termino: 'BPM de la OMS', definicion: 'La OMS preparó a finales de los años sesenta un texto de BPM para que los países compartieran un mismo estándar de fabricación y control de calidad.' },
      { icono: 'Droplets', termino: 'Dietilenglicol, una lección que se repite', definicion: 'Las intoxicaciones por jarabes contaminados con dietilenglicol se han repetido en varios países, incluso en este siglo. Por eso las BPM exigen verificar la identidad de cada materia prima.' },
    ],
    mapa: {
      centro: 'De la tragedia a la norma',
      ramas: [
        { titulo: 'Sulfanilamida', icono: 'Droplets', nodos: ['Solvente tóxico sin pruebas', 'Ley de 1938 en EE. UU.', 'Lección: identidad y seguridad de cada componente'] },
        { titulo: 'Talidomida', icono: 'Users', nodos: ['Malformaciones congénitas', 'Enmiendas de 1962', 'Lección: evidencia antes de comercializar'] },
        { titulo: 'OMS', icono: 'Globe', nodos: ['Primer texto de BPM a fines de los sesenta', 'Esquema de certificación internacional', 'Informes técnicos que se actualizan'] },
        { titulo: 'Hoy', icono: 'ShieldCheck', nodos: ['BPM adoptadas por cada país', 'Inspección y certificación', 'Gestión de riesgos'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tragedias que cambiaron la regulación',
        parrafos: [
          'En 1937, una empresa estadounidense disolvió sulfanilamida en dietilenglicol para venderla como jarabe. Nadie probó la toxicidad del solvente y más de cien personas murieron. La respuesta fue la ley federal de alimentos, medicamentos y cosméticos de 1938, que obligó a demostrar la seguridad de un medicamento antes de venderlo. La lección para la fabricación es directa: **cada componente debe identificarse y controlarse**, incluidos los excipientes y los solventes.',
          'Entre finales de los años cincuenta y comienzos de los sesenta, la talidomida se vendió en varios países como sedante y para las náuseas del embarazo. Miles de niños nacieron con malformaciones graves. En Estados Unidos no se aprobó gracias a la insistencia de una evaluadora de la FDA que pidió más datos, y el episodio llevó a las enmiendas de 1962, que exigieron demostrar eficacia y reforzaron los requisitos de fabricación.',
          'Estas lecciones no son historia antigua. Las intoxicaciones por jarabes contaminados con dietilenglicol o etilenglicol se han repetido en distintos países en las últimas décadas. Cada vez, la causa de fondo fue la misma: una materia prima que no se verificó. Por eso las BPM insisten en la identidad de cada materia prima y en calificar a los proveedores.',
        ],
      },
      {
        titulo: 'La OMS y la armonización',
        parrafos: [
          'Con el comercio internacional de medicamentos, cada país necesitaba confiar en lo que importaba. La OMS preparó a finales de los años sesenta un texto de Buenas Prácticas de Manufactura y lo vinculó a un esquema de certificación de la calidad de los productos que se comercializan entre países. Desde entonces, su Comité de Expertos en Especificaciones para las Preparaciones Farmacéuticas actualiza las BPM y sus anexos en una serie de informes técnicos.',
          'Colombia, como muchos países de la región, construyó sus normas de BPM a partir de esos informes de la OMS. Por eso, cuando se lee un manual de BPM colombiano, se reconocen la estructura y el lenguaje de la OMS. En la siguiente clase verás cuáles son esos informes técnicos y qué aporta cada uno.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo una tragedia se convierte en un requisito de BPM',
      pasos: [
        { titulo: 'Ocurre el daño', detalle: 'Un producto causa daño a pacientes: muertes, malformaciones o intoxicaciones.', icono: 'AlertTriangle', evidencia: 'Reportes de casos y farmacovigilancia.' },
        { titulo: 'Se investiga la causa', detalle: 'Las autoridades rastrean el origen: un solvente tóxico, una contaminación, una mezcla o una falta de estudios.', icono: 'Search', evidencia: 'Informes de investigación.' },
        { titulo: 'Se legisla', detalle: 'La ley exige demostrar seguridad, eficacia o calidad antes de comercializar.', icono: 'Gavel', evidencia: 'Leyes y decretos.' },
        { titulo: 'Se traduce en práctica', detalle: 'La regla general se vuelve un requisito concreto: identidad de cada materia prima, proveedores calificados, registros.', icono: 'ClipboardList', evidencia: 'Manuales de BPM.' },
        { titulo: 'Se inspecciona', detalle: 'La autoridad verifica el cumplimiento con guías de inspección y certificación.', icono: 'ShieldCheck', evidencia: 'Actas y certificados de BPM.' },
      ],
    },
    caso: {
      titulo: 'Un proveedor nuevo de glicerina',
      contexto: 'Compras consigue glicerina un 30 % más barata con un distribuidor nuevo que entrega un certificado de análisis impecable. Producción necesita el material para un jarabe pediátrico esta semana.',
      pregunta: '¿Qué indica la historia de las BPM?',
      opciones: [
        { texto: 'Usarla con el certificado del distribuidor, porque cumple la especificación.', correcta: false, retro: 'Los casos de dietilenglicol se dieron precisamente con certificados que no correspondían al material real.' },
        { texto: 'Calificar al proveedor, verificar la cadena de suministro y analizar la identidad de cada contenedor, incluida la prueba de dietilenglicol y etilenglicol que exige la farmacopea, antes de aprobarla.', correcta: true, retro: 'La identidad de cada contenedor y la calificación del proveedor son la defensa directa contra la tragedia que más se ha repetido en la historia de los jarabes.' },
        { texto: 'Mezclarla con la glicerina del proveedor anterior para reducir el riesgo.', correcta: false, retro: 'Mezclar no reduce el riesgo: lo esconde y contamina el material bueno.' },
      ],
    },
    errores: [
      { error: 'Ver las BPM como trámites sin sentido.', correccion: 'Cada requisito tiene un porqué; conocer su origen ayuda a cumplirlo con criterio.' },
      { error: 'Aceptar certificados de análisis sin verificar la identidad del material.', correccion: 'Califica al proveedor y verifica la identidad de las materias primas según tu procedimiento.' },
    ],
    comprueba: [
      { pregunta: '¿Qué causó la tragedia de la sulfanilamida de 1937?', respuesta: 'El uso de dietilenglicol, un solvente tóxico, sin pruebas de seguridad.' },
      { pregunta: '¿Por qué la OMS creó un texto de BPM?', respuesta: 'Para que los países compartieran un estándar de fabricación y pudieran confiar en los medicamentos del comercio internacional.' },
      { pregunta: '¿Qué lección de BPM deja el dietilenglicol?', respuesta: 'Que hay que verificar la identidad de cada materia prima y calificar a los proveedores.' },
    ],
    resumen: [
      'Las BPM nacieron de **tragedias reales**: sulfanilamida, talidomida y otras.',
      'La OMS creó un estándar común y lo **actualiza** en sus informes técnicos.',
      'La lección que más se repite: **verificar la identidad** de cada materia prima.',
    ],
    referencias: [REF.informe32, REF.trs986a2, REF.res1160],
    imagenes: [
      { ubicacion: 'En la sección de tragedias', descripcion: 'Línea de tiempo ilustrada (1937, 1962, finales de los sesenta, hoy) con iconos de frasco, recién nacido, globo de la OMS y escudo de BPM, en los colores de marca.', alt: 'Línea de tiempo del origen de las Buenas Prácticas de Manufactura' },
    ],
    keywords: ['historia de las bpm', 'origen de las buenas prácticas de manufactura', 'talidomida y regulación de medicamentos', 'tragedia de la sulfanilamida 1937', 'dietilenglicol jarabes', 'historia de las gmp', 'oms buenas prácticas de manufactura origen'],
  },

  {
    titulo: 'Informes técnicos de la OMS: Informe 32 (TRS 823), TRS 961 y TRS 986',
    duracion: 25,
    gancho: {
      titulo: '«¿El manual sale del Informe 32 o del 986?»',
      texto: 'En una capacitación, alguien dice que las BPM colombianas «son el Informe 32». Otra persona responde que la OMS ya lo actualizó varias veces. Las dos tienen algo de razón. Para leer bien un manual de BPM, y para saber qué versión de un requisito aplica, hay que conocer la serie de informes técnicos de la OMS y cómo se fue actualizando.',
    },
    objetivos: [
      'Explicar qué es la Serie de Informes Técnicos (TRS) de la OMS.',
      'Ubicar el Informe 32 (TRS 823), el TRS 961 y el TRS 986 en la evolución de las BPM.',
      'Identificar los anexos de la OMS que complementan las BPM principales.',
    ],
    conceptos: [
      { icono: 'BookOpen', termino: 'Serie de Informes Técnicos (TRS)', definicion: 'Publicación de la OMS donde su Comité de Expertos en Especificaciones para las Preparaciones Farmacéuticas adopta guías. Cada informe trae anexos con guías específicas.' },
      { icono: 'FileText', termino: 'Informe 32 (TRS 823, 1992)', definicion: 'Su Anexo 1 contiene las prácticas adecuadas de fabricación de productos farmacéuticos. Fue durante años la base de las BPM en la región.' },
      { icono: 'Files', termino: 'TRS 961 (2011)', definicion: 'Informe 45 del Comité. Reunió una actualización de los principios de BPM y varios anexos, como los de sistemas HVAC y productos estériles de esa época.' },
      { icono: 'FileCheck', termino: 'TRS 986, Anexo 2 (2014)', definicion: 'Los principios principales de BPM de la OMS actualizados, que incorporan la gestión de riesgos para la calidad y la revisión de calidad del producto.' },
    ],
    mapa: {
      centro: 'Las BPM de la OMS en el tiempo',
      ramas: [
        { titulo: 'Informe 32', icono: 'FileText', nodos: ['TRS 823, 1992', 'Anexo 1: prácticas adecuadas de fabricación', 'Base histórica en la región'] },
        { titulo: 'TRS 961', icono: 'Files', nodos: ['Informe 45, 2011', 'Principios actualizados', 'Anexos técnicos de la época'] },
        { titulo: 'TRS 986', icono: 'FileCheck', nodos: ['Informe 48, 2014', 'Anexo 2: principios principales', 'Gestión de riesgos y revisión de producto'] },
        { titulo: 'Anexos especializados', icono: 'Layers', nodos: ['Validación: TRS 1019', 'Agua: TRS 1033', 'HVAC: TRS 1010', 'Estériles: TRS 1044'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo funciona la serie de informes',
        parrafos: [
          'La OMS no publica una «norma de BPM» única que se reemplaza de golpe. Su Comité de Expertos en Especificaciones para las Preparaciones Farmacéuticas se reúne y adopta guías que se publican como anexos de un informe numerado dentro de la Serie de Informes Técnicos (TRS, por sus siglas en inglés). Una guía nueva puede actualizar solo una parte: por ejemplo, el agua, la validación o los productos estériles.',
          'El **Informe 32**, publicado como TRS 823 en 1992, incluyó en su Anexo 1 las prácticas adecuadas de fabricación de productos farmacéuticos. Ese texto se tradujo y circuló ampliamente en América Latina, y por eso muchas personas todavía llaman «el Informe 32» a las BPM. Luego vinieron actualizaciones: el **TRS 961** (2011) reunió principios actualizados y varios anexos técnicos, y el **TRS 986** (2014), en su Anexo 2, publicó los principios principales de BPM vigentes, con elementos como la gestión de riesgos para la calidad y la revisión de calidad del producto.',
        ],
      },
      {
        titulo: 'Qué consultar para cada tema',
        parrafos: [
          'Los principios principales (TRS 986, Anexo 2) cubren el sistema de calidad, el personal, las instalaciones, los equipos, los materiales, la documentación, la producción y el control de calidad. Para temas técnicos se consulta el anexo especializado más reciente: la guía de **validación** del TRS 1019 (2019), la de **agua para uso farmacéutico** del TRS 1033 (2021), la de **sistemas HVAC** para no estériles del TRS 1010 (2018) y la de **productos estériles** del TRS 1044 (2022).',
          'En Colombia, la norma obligatoria es la que adoptó el Ministerio de Salud en la Resolución 1160 de 2016. Los informes de la OMS son la fuente de donde salió y la mejor referencia para interpretar un requisito. Cuando la OMS publica una guía más reciente, sirve como estado del arte, aunque la obligación legal siga siendo la de la resolución vigente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo encontrar la guía correcta de la OMS',
      pasos: [
        { titulo: 'Define el tema', detalle: 'Escribe la pregunta concreta: por ejemplo, ¿cuánto debe durar la calificación de un sistema de agua?', icono: 'Search', evidencia: 'Pregunta documentada.' },
        { titulo: 'Revisa la norma colombiana', detalle: 'Busca primero qué dice la Resolución 1160 de 2016 y sus manuales.', icono: 'Landmark', evidencia: 'Cita de la norma.' },
        { titulo: 'Ubica el anexo de la OMS', detalle: 'Busca el anexo especializado más reciente sobre el tema en la serie TRS.', icono: 'BookOpen', evidencia: 'Número de TRS y anexo.' },
        { titulo: 'Verifica la versión', detalle: 'Confirma que no exista una guía más nueva que la reemplace.', icono: 'RefreshCw', evidencia: 'Fecha de publicación consultada.' },
        { titulo: 'Cita las dos fuentes', detalle: 'En tus procedimientos, cita la norma que obliga y la guía que explica.', icono: 'FileCheck', evidencia: 'Referencias en el documento.' },
      ],
    },
    caso: {
      titulo: 'Un procedimiento que cita el Informe 32',
      contexto: 'Revisas el procedimiento de calificación del sistema de agua de tu planta. Su única referencia es el Informe 32 de 1992.',
      pregunta: '¿Qué mejora propones?',
      opciones: [
        { texto: 'Dejarlo igual, porque el Informe 32 es la base de las BPM.', correcta: false, retro: 'Es la base histórica, pero el tema del agua tiene una guía específica mucho más reciente.' },
        { texto: 'Citar la Resolución 1160 de 2016 como norma obligatoria y la guía de agua del TRS 1033 (2021) como referencia técnica, y revisar si el procedimiento refleja la calificación por fases.', correcta: true, retro: 'Así el procedimiento queda anclado a la norma vigente y al estado del arte del tema.' },
        { texto: 'Reemplazar todas las referencias por guías de la FDA.', correcta: false, retro: 'Las guías de la FDA pueden ayudar, pero la base colombiana viene de la OMS y de la Resolución 1160.' },
      ],
    },
    errores: [
      { error: 'Llamar «Informe 32» a toda la normativa de BPM.', correccion: 'Distingue la norma colombiana (Resolución 1160 de 2016) de los informes técnicos de la OMS que la inspiraron.' },
      { error: 'Citar guías de la OMS desactualizadas.', correccion: 'Busca siempre el anexo más reciente del tema antes de citarlo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué contiene el Anexo 1 del Informe 32 (TRS 823)?', respuesta: 'Las prácticas adecuadas de fabricación de productos farmacéuticos de la OMS de 1992.' },
      { pregunta: '¿Qué incorporó el TRS 986, Anexo 2?', respuesta: 'Los principios principales de BPM actualizados, con gestión de riesgos para la calidad y revisión de calidad del producto.' },
      { pregunta: '¿Dónde está la guía de la OMS sobre agua para uso farmacéutico?', respuesta: 'En el TRS 1033, Anexo 3, de 2021.' },
    ],
    resumen: [
      'La OMS publica sus guías como **anexos de informes técnicos** numerados.',
      'Informe 32 (1992), TRS 961 (2011) y TRS 986 (2014) marcan la evolución de los principios.',
      'Para temas técnicos se usa el **anexo especializado más reciente**.',
    ],
    referencias: [REF.informe32, REF.trs986a2, REF.trs1019a3, REF.trs1033a3, REF.trs1010a8, REF.trs1044a2],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Estantería ilustrada con informes numerados (823, 961, 986, 1010, 1019, 1033, 1044) y etiquetas de tema, en azul y lavanda.', alt: 'Serie de informes técnicos de la OMS sobre BPM' },
    ],
    keywords: ['informe 32 oms', 'trs 823 anexo 1', 'trs 986 anexo 2', 'trs 961 oms', 'informes técnicos oms bpm', 'bpm oms en español', 'who trs gmp', 'anexos de la oms buenas prácticas'],
  },

  {
    titulo: 'PIC/S y la convergencia regulatoria internacional',
    duracion: 20,
    gancho: {
      titulo: 'Exportar sin repetir cada inspección',
      texto: 'Un laboratorio colombiano quiere exportar a varios países de la región. Cada autoridad podría pedir su propia inspección, con requisitos parecidos pero no iguales. La convergencia regulatoria busca lo contrario: que una inspección bien hecha y un estándar común generen confianza entre autoridades. PIC/S es uno de los motores de esa convergencia.',
    },
    objetivos: [
      'Explicar qué es PIC/S y qué aporta su guía de BPM.',
      'Diferenciar PIC/S, ICH y OMS en el panorama regulatorio.',
      'Reconocer por qué la convergencia importa para la industria colombiana.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'PIC/S', definicion: 'Esquema de cooperación de inspección farmacéutica que reúne autoridades sanitarias. Busca guías comunes de BPM, inspectores formados con el mismo criterio y confianza mutua.' },
      { icono: 'BookOpen', termino: 'Guía PE 009', definicion: 'La guía de BPM de PIC/S, con una Parte I para medicamentos, una Parte II para principios activos y anexos como el 1 (estériles) y el 15 (calificación y validación).' },
      { icono: 'Network', termino: 'ICH', definicion: 'Consejo que reúne autoridades e industria para armonizar requisitos técnicos, como las guías Q de calidad.' },
      { icono: 'Globe', termino: 'Convergencia regulatoria', definicion: 'Proceso por el que las autoridades acercan sus requisitos y prácticas para reconocer el trabajo de otras sin perder control.' },
    ],
    mapa: {
      centro: 'Actores de la convergencia',
      ramas: [
        { titulo: 'OMS', icono: 'Globe', nodos: ['Guías de BPM y anexos', 'Precalificación', 'Base de muchas normas nacionales'] },
        { titulo: 'PIC/S', icono: 'ShieldCheck', nodos: ['Guía PE 009 y anexos', 'Formación de inspectores', 'Cooperación entre inspectorados'] },
        { titulo: 'ICH', icono: 'Network', nodos: ['Guías Q de calidad', 'Q9 riesgos y Q10 sistema de calidad', 'Armonización técnica'] },
        { titulo: 'Colombia', icono: 'Landmark', nodos: ['BPM por Resolución 1160 de 2016', 'Cooperación internacional del INVIMA', 'Ingreso del INVIMA a ICMRA'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué es PIC/S y por qué se cita tanto',
        parrafos: [
          'PIC/S nació de la cooperación entre autoridades de inspección europeas y hoy reúne inspectorados de varios continentes. Sus miembros comparten la guía de BPM, se evalúan mutuamente y forman a sus inspectores con criterios comunes. Para una empresa, que su autoridad sea parte de PIC/S facilita que otras autoridades confíen en sus inspecciones.',
          'La guía de PIC/S (PE 009) es prácticamente equivalente a la guía de BPM de la Unión Europea. Por eso documentos como el **Anexo 1** sobre productos estériles o el **Anexo 15** sobre calificación y validación se citan en todo el mundo como referencia técnica, aunque un país no sea miembro. Antes de afirmar que un país pertenece a PIC/S, consulta la lista de miembros vigente en su sitio oficial: cambia con el tiempo.',
        ],
      },
      {
        titulo: 'La convergencia en la práctica colombiana',
        parrafos: [
          'Colombia adoptó sus BPM a partir de los informes de la OMS y el INVIMA ha trabajado en la cooperación internacional, incluido su ingreso a la Coalición Internacional de Autoridades Reguladoras de Medicamentos (ICMRA). Para la industria, esto significa que conocer las guías internacionales no es un lujo: es la forma de anticipar hacia dónde se mueven los requisitos y de preparar plantas capaces de exportar.',
          'Una regla práctica: cuando escribas un procedimiento, ancla la obligación en la norma colombiana y usa PIC/S, ICH y la OMS para explicar el cómo. Así cumples hoy y estás preparado para los cambios que vienen.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo preparar una planta para exportar',
      pasos: [
        { titulo: 'Identificar mercados', detalle: 'Lista los países destino y sus autoridades sanitarias.', icono: 'Globe', evidencia: 'Plan de mercados.' },
        { titulo: 'Comparar requisitos', detalle: 'Contrasta las BPM colombianas con las guías que aplica cada autoridad (OMS, PIC/S, otras).', icono: 'Scale', evidencia: 'Análisis de brechas.' },
        { titulo: 'Cerrar brechas', detalle: 'Prioriza con análisis de riesgo las brechas que afectan la calidad y la aceptación de las inspecciones.', icono: 'Wrench', evidencia: 'Plan de acción con responsables.' },
        { titulo: 'Autoinspeccionar con criterio internacional', detalle: 'Usa las guías internacionales en tus autoinspecciones para anticipar hallazgos.', icono: 'ClipboardCheck', evidencia: 'Informe de autoinspección.' },
        { titulo: 'Mantener la vigilancia normativa', detalle: 'Sigue las nuevas versiones de guías y su adopción por el INVIMA.', icono: 'RefreshCw', evidencia: 'Registro de actualizaciones normativas.' },
      ],
    },
    caso: {
      titulo: 'El Anexo 1 en una planta colombiana',
      contexto: 'Una planta de inyectables colombiana discute si debe aplicar el Anexo 1 de 2022, porque «Colombia no lo adoptó textualmente».',
      pregunta: '¿Cuál es la mejor postura?',
      opciones: [
        { texto: 'Ignorarlo hasta que el INVIMA lo exija por resolución.', correcta: false, retro: 'Ignorar el estado del arte deja a la planta expuesta en inspecciones y la aleja de los mercados de exportación.' },
        { texto: 'Cumplir la norma colombiana y usar el Anexo 1 y el TRS 1044 como referencia técnica para cerrar brechas priorizadas por riesgo, como la estrategia de control de la contaminación.', correcta: true, retro: 'Es la postura que protege al paciente, resiste una inspección y prepara la planta para exportar.' },
        { texto: 'Copiar el Anexo 1 completo como procedimiento interno.', correcta: false, retro: 'Una guía no es un procedimiento: hay que traducirla a la realidad de la planta.' },
      ],
    },
    errores: [
      { error: 'Afirmar que un país es miembro de PIC/S sin verificarlo.', correccion: 'Consulta la lista vigente en el sitio oficial de PIC/S.' },
      { error: 'Tratar las guías internacionales como si fueran ley colombiana.', correccion: 'Úsalas como referencia técnica y ancla la obligación en la norma nacional.' },
    ],
    comprueba: [
      { pregunta: '¿Qué contiene la guía PE 009 de PIC/S?', respuesta: 'La guía de BPM con una parte para medicamentos, otra para principios activos y anexos como el 1 y el 15.' },
      { pregunta: '¿En qué se diferencia ICH de PIC/S?', respuesta: 'ICH armoniza requisitos técnicos con autoridades e industria (como las guías Q); PIC/S coopera en inspección y en la guía de BPM.' },
    ],
    resumen: [
      'PIC/S comparte **guía de BPM, formación y confianza** entre inspectorados.',
      'Sus anexos 1 y 15 son **referencia técnica mundial**.',
      'Conocer la convergencia prepara a la planta para **inspecciones y exportación**.',
    ],
    referencias: [REF.picsParte1, REF.picsAnexo15, REF.euAnexo1, REF.ichIndice, REF.res1160],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Mapa del mundo estilizado con nodos conectados por líneas turquesa que representan la cooperación entre autoridades.', alt: 'Convergencia regulatoria internacional entre autoridades sanitarias' },
    ],
    keywords: ['qué es pic/s', 'pics gmp guía pe 009', 'convergencia regulatoria farmacéutica', 'pic/s colombia invima', 'diferencia entre ich y pic/s', 'anexo 1 y anexo 15 pics'],
  },

  {
    titulo: 'Decreto 677 de 1995 y Decreto 549 de 2001: base legal de la fabricación y la certificación',
    duracion: 25,
    gancho: {
      titulo: 'Sin certificado no hay fabricación',
      texto: 'Una empresa compra una planta en Funza, contrata personal y tiene listo el registro sanitario de un producto. Pero el INVIMA no le ha certificado las BPM. ¿Puede fabricar? No. La base legal que lo impide son dos decretos: uno define el régimen sanitario de los medicamentos y otro creó el procedimiento para certificar el cumplimiento de las BPM.',
    },
    objetivos: [
      'Explicar qué regula el Decreto 677 de 1995 en materia de fabricación y control de calidad.',
      'Describir el papel del Decreto 549 de 2001 en la certificación de BPM.',
      'Relacionar estos decretos con el procedimiento vigente del Decreto 335 de 2022.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'Decreto 677 de 1995', definicion: 'Reglamenta el régimen de registros sanitarios, licencias, control de calidad y vigilancia sanitaria de los medicamentos y otros productos. Exige que los fabricantes cumplan las BPM.' },
      { icono: 'ShieldCheck', termino: 'Decreto 549 de 2001', definicion: 'Estableció el procedimiento para obtener del INVIMA el certificado de cumplimiento de BPM de los laboratorios fabricantes de medicamentos.' },
      { icono: 'FileCheck', termino: 'Certificado de BPM', definicion: 'El documento con el que el INVIMA declara que una planta cumple las BPM para determinadas áreas y formas farmacéuticas. Es requisito para fabricar.' },
      { icono: 'RefreshCw', termino: 'Decreto 335 de 2022', definicion: 'Actualizó el procedimiento para obtener los certificados de cumplimiento de buenas prácticas ante el INVIMA.' },
    ],
    mapa: {
      centro: 'Base legal de la fabricación en Colombia',
      ramas: [
        { titulo: 'Régimen sanitario', icono: 'Landmark', nodos: ['Decreto 677 de 1995', 'Registros sanitarios', 'Control de calidad y vigilancia'] },
        { titulo: 'Certificación', icono: 'ShieldCheck', nodos: ['Decreto 549 de 2001', 'Certificado de BPM por áreas', 'Hoy: Decreto 335 de 2022'] },
        { titulo: 'Contenido técnico', icono: 'BookOpen', nodos: ['Resolución 1160 de 2016', 'Manuales de BPM', 'Guías de inspección'] },
        { titulo: 'Autoridad', icono: 'Gavel', nodos: ['INVIMA certifica e inspecciona', 'Medidas sanitarias', 'Vigilancia posterior'] },
      ],
    },
    secciones: [
      {
        titulo: 'El Decreto 677 de 1995: el marco general',
        parrafos: [
          'El Decreto 677 de 1995 reglamenta el régimen de registros sanitarios, licencias, control de calidad y vigilancia sanitaria de los medicamentos, cosméticos, preparaciones farmacéuticas a base de recursos naturales y otros productos. Para la fabricación, su mensaje central es que los laboratorios fabricantes deben cumplir las Buenas Prácticas de Manufactura y que el INVIMA vigila ese cumplimiento.',
          'El decreto también conecta el registro sanitario con el fabricante: el registro se otorga para un producto fabricado en un establecimiento determinado. Por eso un cambio de fabricante o de sitio de fabricación no es un asunto interno: tiene consecuencias regulatorias. El análisis de impacto normativo que publicó el Ministerio de Salud sobre este decreto muestra que sigue siendo una pieza central del sistema, aunque varias de sus partes se han modificado con normas posteriores.',
        ],
      },
      {
        titulo: 'Del Decreto 549 de 2001 al Decreto 335 de 2022',
        parrafos: [
          'El Decreto 549 de 2001 estableció el procedimiento para que el INVIMA certificara el cumplimiento de las BPM en los laboratorios fabricantes de medicamentos. Introdujo la lógica que se mantiene: el interesado solicita, el INVIMA inspecciona con una guía y, si el concepto es favorable, expide un certificado para las áreas y formas farmacéuticas evaluadas.',
          'En 2022, el Decreto 335 actualizó el procedimiento para obtener los certificados de cumplimiento de buenas prácticas. Lo verás en detalle en la unidad 5. Por ahora, la idea clave es la cadena: el **Decreto 677** obliga a cumplir BPM, la **Resolución 1160 de 2016** define qué son esas BPM y cómo se inspeccionan, y el **procedimiento de certificación** define cómo se demuestra el cumplimiento. Un certificado ampara áreas y formas farmacéuticas concretas: fabricar una forma no certificada es un incumplimiento aunque el resto de la planta esté certificada.',
        ],
      },
    ],
    proceso: {
      titulo: 'La cadena legal de un medicamento fabricado en Colombia',
      pasos: [
        { titulo: 'Cumplir las BPM', detalle: 'La planta implementa las BPM de la Resolución 1160 de 2016 en las áreas que va a usar.', icono: 'Factory', evidencia: 'Sistema de calidad implementado.' },
        { titulo: 'Solicitar la certificación', detalle: 'El fabricante solicita al INVIMA la certificación para sus áreas y formas farmacéuticas.', icono: 'FileText', evidencia: 'Solicitud radicada.' },
        { titulo: 'Recibir la inspección', detalle: 'El INVIMA inspecciona con la guía correspondiente y emite un concepto.', icono: 'ShieldCheck', evidencia: 'Acta de visita.' },
        { titulo: 'Obtener el certificado', detalle: 'Con concepto favorable, el INVIMA expide el certificado de BPM para lo evaluado.', icono: 'Award', evidencia: 'Certificado vigente.' },
        { titulo: 'Fabricar productos registrados', detalle: 'Solo se fabrican productos con registro sanitario en áreas certificadas.', icono: 'Pill', evidencia: 'Registro sanitario y certificado alineados.' },
        { titulo: 'Mantener y renovar', detalle: 'El cumplimiento se sostiene, se vigila y el certificado se renueva según el procedimiento vigente.', icono: 'RefreshCw', evidencia: 'Autoinspecciones y renovación.' },
      ],
    },
    caso: {
      titulo: 'Una forma farmacéutica nueva',
      contexto: 'Una planta certificada para sólidos orales no estériles quiere empezar a fabricar suspensiones orales en un área nueva, ya construida y calificada.',
      pregunta: '¿Qué necesita antes de fabricar para el mercado?',
      opciones: [
        { texto: 'Nada más, porque la planta ya tiene certificado de BPM.', correcta: false, retro: 'El certificado ampara las áreas y formas farmacéuticas evaluadas; una forma nueva en un área nueva requiere su propia certificación.' },
        { texto: 'Obtener la certificación de BPM del INVIMA para el área y la forma farmacéutica nuevas, y asegurar que el registro sanitario del producto ampare ese fabricante.', correcta: true, retro: 'Es la cadena completa: BPM certificadas para lo que se fabrica y registro sanitario coherente.' },
        { texto: 'Fabricar los primeros lotes y avisar al INVIMA en la siguiente visita.', correcta: false, retro: 'Fabricar en un área no certificada para el mercado es un incumplimiento que puede derivar en medidas sanitarias.' },
      ],
    },
    errores: [
      { error: 'Creer que el certificado de BPM cubre toda la planta y cualquier producto.', correccion: 'El certificado ampara áreas y formas farmacéuticas concretas; revisa su alcance.' },
      { error: 'Cambiar de sitio de fabricación como un asunto interno.', correccion: 'Un cambio de fabricante o de sitio tiene implicaciones regulatorias sobre el registro sanitario.' },
    ],
    comprueba: [
      { pregunta: '¿Qué decreto reglamenta el régimen de registros sanitarios y control de calidad de medicamentos?', respuesta: 'El Decreto 677 de 1995.' },
      { pregunta: '¿Qué creó el Decreto 549 de 2001?', respuesta: 'El procedimiento para que el INVIMA certifique el cumplimiento de BPM en los laboratorios fabricantes de medicamentos.' },
      { pregunta: '¿Qué norma actualizó el procedimiento de certificación en 2022?', respuesta: 'El Decreto 335 de 2022.' },
    ],
    resumen: [
      'El **Decreto 677 de 1995** obliga a fabricar bajo BPM y conecta el registro sanitario con el fabricante.',
      'El **Decreto 549 de 2001** creó la certificación de BPM; hoy el procedimiento lo regula el **Decreto 335 de 2022**.',
      'El certificado ampara **áreas y formas farmacéuticas** concretas.',
    ],
    referencias: [REF.dec677, REF.dec549, REF.dec335, REF.res1160],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Cadena de eslabones con íconos: decreto, resolución, inspección, certificado y medicamento, en azul y turquesa.', alt: 'Cadena legal de la fabricación de medicamentos en Colombia' },
    ],
    keywords: ['decreto 677 de 1995', 'decreto 549 de 2001', 'certificado de bpm invima', 'certificación bpm colombia', 'decreto 677 resumen', 'base legal bpm colombia', 'decreto 335 de 2022'],
  },

  {
    titulo: 'Resolución 1160 de 2016: manuales y guías de inspección',
    duracion: 25,
    gancho: {
      titulo: 'Leer la norma con los ojos del inspector',
      texto: 'Dos plantas tienen el mismo manual de calidad. Una pasa la visita del INVIMA sin hallazgos mayores; la otra recibe un concepto con requerimientos. La diferencia no está en el manual sino en que la primera usó las guías de inspección de la Resolución 1160 de 2016 para autoevaluarse: sabía exactamente qué le iban a preguntar.',
    },
    objetivos: [
      'Describir la estructura de la Resolución 1160 de 2016: manuales de BPM y guías de inspección.',
      'Diferenciar el manual general de BPM del manual para estériles.',
      'Usar las guías de inspección como herramienta de autoevaluación.',
      'Reconocer las modificaciones posteriores, como la Resolución 886 de 2019.',
    ],
    conceptos: [
      { icono: 'BookOpen', termino: 'Manual de BPM', definicion: 'El texto que describe los requisitos: sistema de calidad, personal, instalaciones, equipos, materiales, documentación, producción, control de calidad, contratos, quejas, retiros y autoinspección.' },
      { icono: 'Syringe', termino: 'Manual para estériles', definicion: 'Requisitos adicionales para fabricar productos estériles: áreas limpias por grados, procesamiento aséptico, esterilización y monitoreo.' },
      { icono: 'ClipboardCheck', termino: 'Guía de inspección', definicion: 'La lista de verificación con la que el INVIMA evalúa el cumplimiento. Hay una general y una para estériles.' },
      { icono: 'RefreshCw', termino: 'Modificaciones', definicion: 'La resolución ha tenido ajustes posteriores, como la Resolución 886 de 2019. Por eso conviene consultar el texto compilado del normograma del INVIMA.' },
    ],
    mapa: {
      centro: 'Resolución 1160 de 2016',
      ramas: [
        { titulo: 'Manuales', icono: 'BookOpen', nodos: ['Manual general de BPM', 'Manual para medicamentos estériles', 'Basados en los informes de la OMS'] },
        { titulo: 'Guías de inspección', icono: 'ClipboardCheck', nodos: ['Guía general', 'Guía para estériles', 'Criterios de evaluación'] },
        { titulo: 'Uso interno', icono: 'Search', nodos: ['Autoinspección', 'Análisis de brechas', 'Preparación de visitas'] },
        { titulo: 'Vigencia', icono: 'RefreshCw', nodos: ['Resolución 886 de 2019', 'Texto compilado del INVIMA', 'Vigilancia normativa'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué trae la resolución',
        parrafos: [
          'La Resolución 1160 de 2016 del Ministerio de Salud y Protección Social establece los manuales de Buenas Prácticas de Manufactura y las guías de inspección para los laboratorios o establecimientos de producción de medicamentos, con miras a la obtención del certificado de cumplimiento de BPM. Sus anexos incluyen un manual general de BPM, un manual para medicamentos estériles y las guías de inspección correspondientes.',
          'Los manuales siguen la estructura de las BPM de la OMS: gestión de la calidad, saneamiento e higiene, calificación y validación, quejas, retiros, contratos, autoinspección, personal, instalaciones, equipos, materiales, documentación, producción y control de calidad. El manual para estériles agrega los requisitos de áreas limpias, procesamiento aséptico, esterilización y monitoreo ambiental que verás en la unidad 4.',
        ],
      },
      {
        titulo: 'Las guías de inspección como herramienta propia',
        parrafos: [
          'Las guías de inspección convierten los manuales en preguntas verificables: ¿existe el procedimiento?, ¿está aprobado?, ¿se ejecuta como está escrito?, ¿hay registros?, ¿se investigan las desviaciones? El inspector las usa durante la visita y, con ellas, clasifica las deficiencias según su riesgo.',
          'La mejor forma de preparar una visita es usar esas mismas guías en la **autoinspección**. Así la planta encuentra sus brechas antes que el inspector y llega con un plan de mejoramiento en marcha. La resolución ha tenido modificaciones, como la Resolución 886 de 2019, por lo que es buena práctica consultar el texto compilado que publica el INVIMA en su normograma antes de actualizar procedimientos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Autoevaluación con la guía de inspección',
      pasos: [
        { titulo: 'Descargar la versión vigente', detalle: 'Consulta el texto compilado de la resolución y la guía que aplica a tus áreas (general o estériles).', icono: 'FileText', evidencia: 'Versión y fecha de consulta registradas.' },
        { titulo: 'Asignar capítulos', detalle: 'Reparte los capítulos entre auditores independientes del área evaluada.', icono: 'Users', evidencia: 'Plan de autoinspección.' },
        { titulo: 'Verificar en sitio', detalle: 'Responde cada pregunta con evidencia: documento, registro u observación directa.', icono: 'Search', evidencia: 'Lista de verificación diligenciada.' },
        { titulo: 'Clasificar hallazgos', detalle: 'Clasifica cada brecha como crítica, mayor o menor según su riesgo.', icono: 'AlertTriangle', evidencia: 'Informe de hallazgos.' },
        { titulo: 'Planear y cerrar', detalle: 'Define acciones, responsables y fechas; verifica el cierre con evidencia.', icono: 'CheckCircle2', evidencia: 'Plan de mejoramiento con cierres.' },
      ],
    },
    caso: {
      titulo: 'Un manual de calidad impecable',
      contexto: 'El manual de calidad de una planta cita la Resolución 1160 de 2016 en cada capítulo. En la autoinspección, el auditor encuentra que tres procedimientos de limpieza no se siguen como están escritos.',
      pregunta: '¿Cómo clasificarías la situación frente a la guía de inspección?',
      opciones: [
        { texto: 'Sin hallazgo, porque los procedimientos existen y citan la norma.', correcta: false, retro: 'La guía no pregunta solo si el documento existe, sino si se cumple. Un procedimiento que no se sigue es una deficiencia.' },
        { texto: 'Como un hallazgo cuya gravedad depende del riesgo: si la limpieza afecta productos o hay riesgo de contaminación cruzada, puede ser mayor; se investiga la causa y se corrige.', correcta: true, retro: 'La clasificación depende del riesgo para el producto. Tres procedimientos incumplidos sugieren además una falla del sistema.' },
        { texto: 'Como un hallazgo menor siempre, porque es solo documentación.', correcta: false, retro: 'No es solo documentación: refleja lo que pasa en la planta y puede afectar la calidad del producto.' },
      ],
    },
    errores: [
      { error: 'Usar una versión desactualizada de la resolución.', correccion: 'Consulta el texto compilado del normograma del INVIMA con sus modificaciones.' },
      { error: 'Preparar la visita solo revisando documentos.', correccion: 'La guía verifica que lo escrito se cumpla en la práctica: recorre la planta.' },
    ],
    comprueba: [
      { pregunta: '¿Qué establece la Resolución 1160 de 2016?', respuesta: 'Los manuales de BPM y las guías de inspección para obtener el certificado de cumplimiento de BPM.' },
      { pregunta: '¿Para qué sirven las guías de inspección dentro de la empresa?', respuesta: 'Para autoinspeccionarse con los mismos criterios del INVIMA y cerrar brechas antes de la visita.' },
    ],
    resumen: [
      'La Resolución 1160 de 2016 trae **manuales de BPM y guías de inspección**.',
      'Hay requisitos generales y **adicionales para estériles**.',
      'La guía de inspección es la mejor **herramienta de autoevaluación**.',
    ],
    referencias: [REF.res1160, REF.res1160Compilada, REF.res886, REF.trs986a2],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Carpeta abierta con cuatro separadores (manual general, manual estériles, guía general, guía estériles) en colores de marca.', alt: 'Estructura de la Resolución 1160 de 2016' },
    ],
    keywords: ['resolución 1160 de 2016', 'resolución 1160 de 2016 bpm', 'guía de inspección bpm invima', 'manual de bpm colombia', 'resolución 886 de 2019', 'anexos resolución 1160', 'bpm medicamentos estériles colombia'],
  },

  {
    titulo: 'Normas especiales: Res. 3028/2008 (áreas especiales), fitoterapéuticos (Res. 3131/1998, Decreto 2266/2004)',
    duracion: 20,
    gancho: {
      titulo: 'No todos los productos caben en la misma área',
      texto: 'Una planta de sólidos quiere aprovechar la capacidad de su línea para fabricar un antibiótico de la familia de las penicilinas. En papel, la máquina es la misma. En la realidad, una traza de penicilina en otro producto puede causar una reacción alérgica grave a un paciente sensible. Para estos casos existen normas especiales que exigen áreas separadas y requisitos propios.',
    },
    objetivos: [
      'Explicar qué regula la Resolución 3028 de 2008 sobre áreas técnicas y áreas especiales.',
      'Reconocer por qué ciertos productos exigen instalaciones exclusivas.',
      'Ubicar el marco de los productos fitoterapéuticos: Resolución 3131 de 1998 y Decreto 2266 de 2004.',
    ],
    conceptos: [
      { icono: 'Building2', termino: 'Áreas técnicas de producción', definicion: 'Las áreas de un establecimiento farmacéutico definidas por la Resolución 3028 de 2008 según los productos y formas farmacéuticas que se fabrican.' },
      { icono: 'Lock', termino: 'Áreas especiales', definicion: 'Áreas que se exigen separadas o exclusivas para productos de alto riesgo de sensibilización o toxicidad, como los betalactámicos.' },
      { icono: 'Sparkles', termino: 'Productos fitoterapéuticos', definicion: 'Productos elaborados con plantas medicinales. Tienen un régimen propio de registro y vigilancia (Decreto 2266 de 2004) y un manual de BPM específico (Resolución 3131 de 1998).' },
      { icono: 'Biohazard', termino: 'Sensibilización', definicion: 'Capacidad de un producto de causar reacciones alérgicas con cantidades mínimas. Es la razón de fondo de las áreas exclusivas para penicilinas y cefalosporinas.' },
    ],
    mapa: {
      centro: 'Normas especiales de fabricación',
      ramas: [
        { titulo: 'Áreas', icono: 'Building2', nodos: ['Resolución 3028 de 2008', 'Áreas técnicas por producto', 'Áreas especiales separadas'] },
        { titulo: 'Alto riesgo', icono: 'Biohazard', nodos: ['Betalactámicos', 'Otros productos de alta potencia', 'Contención y segregación'] },
        { titulo: 'Fitoterapéuticos', icono: 'Sparkles', nodos: ['Resolución 3131 de 1998 (BPM)', 'Decreto 2266 de 2004 (registro)', 'Materias primas vegetales'] },
        { titulo: 'Qué verificar', icono: 'ClipboardCheck', nodos: ['Alcance del certificado', 'Flujos y presiones', 'Validación de limpieza'] },
      ],
    },
    secciones: [
      {
        titulo: 'Áreas técnicas y áreas especiales',
        parrafos: [
          'La Resolución 3028 de 2008 define las áreas técnicas de producción de los establecimientos farmacéuticos y las áreas especiales que se requieren para ciertos grupos de productos. Su lógica es la del riesgo: hay productos que, aun en cantidades mínimas, pueden dañar a un paciente que los recibe sin necesitarlos. El ejemplo clásico son los **betalactámicos** (penicilinas y cefalosporinas), cuya capacidad de sensibilización obliga a fabricarlos en instalaciones exclusivas y separadas, con sistemas de aire independientes.',
          'Al planear una ampliación o un producto nuevo, la primera pregunta no es si «cabe en la máquina», sino en qué área técnica puede fabricarse y si el certificado de BPM de la planta la ampara. Fabricar un producto que exige área especial en un área común es una deficiencia grave por el riesgo directo para los pacientes. En la unidad 3 verás con más detalle el control de los productos de alto riesgo.',
        ],
      },
      {
        titulo: 'Fitoterapéuticos: un régimen propio',
        parrafos: [
          'Los productos fitoterapéuticos se elaboran con material vegetal y tienen retos distintos: variabilidad natural de la planta, contaminación microbiológica y por plaguicidas o metales, identificación botánica y control de marcadores. El Decreto 2266 de 2004 reglamenta su régimen de registros sanitarios y de vigilancia y control, y la Resolución 3131 de 1998 adoptó el manual de BPM para productos farmacéuticos con base en recursos naturales.',
          'Para quien trabaja en estas plantas, la recepción e identificación de la materia prima vegetal es tan crítica como el proceso. Un error de especie o una adulteración pueden cambiar por completo la seguridad del producto, aunque el resto del proceso sea impecable.',
        ],
      },
    ],
    proceso: {
      titulo: 'Antes de fabricar un producto nuevo en la planta',
      pasos: [
        { titulo: 'Clasificar el producto', detalle: 'Determina su grupo: general, alto riesgo de sensibilización, alta potencia o fitoterapéutico.', icono: 'Tag', evidencia: 'Ficha del producto.' },
        { titulo: 'Identificar el área técnica', detalle: 'Revisa la Resolución 3028 de 2008 y las normas especiales que apliquen.', icono: 'Building2', evidencia: 'Análisis normativo.' },
        { titulo: 'Verificar el certificado', detalle: 'Confirma que el certificado de BPM ampare esa área y forma farmacéutica.', icono: 'ShieldCheck', evidencia: 'Alcance del certificado.' },
        { titulo: 'Evaluar el riesgo de contaminación cruzada', detalle: 'Analiza flujos, aire, equipos compartidos y limpieza con criterio de riesgo.', icono: 'AlertTriangle', evidencia: 'Evaluación de riesgo.' },
        { titulo: 'Decidir por control de cambios', detalle: 'Aprueba, ajusta o rechaza la introducción del producto con evidencia.', icono: 'GitBranch', evidencia: 'Control de cambios cerrado.' },
      ],
    },
    caso: {
      titulo: 'La cefalosporina en la línea de sólidos',
      contexto: 'Un cliente pide fabricar por contrato una cefalosporina oral. La planta tiene capacidad ociosa en su línea de sólidos generales y la limpieza está validada para los productos actuales.',
      pregunta: '¿Qué responde aseguramiento de calidad?',
      opciones: [
        { texto: 'Aceptar, porque la limpieza está validada.', correcta: false, retro: 'La limpieza validada para otros productos no resuelve el riesgo de sensibilización de los betalactámicos, que exigen área especial.' },
        { texto: 'No aceptar en la línea general: las cefalosporinas requieren área especial exclusiva y separada, con certificación de BPM para esa área.', correcta: true, retro: 'Es un requisito de diseño, no de limpieza. La respuesta protege a los pacientes de los demás productos.' },
        { texto: 'Aceptar haciendo una campaña al final del año.', correcta: false, retro: 'Las campañas no sustituyen la segregación que exigen los betalactámicos.' },
      ],
    },
    errores: [
      { error: 'Decidir la fabricación de un producto solo por capacidad de equipos.', correccion: 'Primero verifica el área técnica exigida y el alcance del certificado de BPM.' },
      { error: 'Tratar la materia prima vegetal como un excipiente más.', correccion: 'Aplica identificación botánica y controles de contaminantes según el manual específico.' },
    ],
    comprueba: [
      { pregunta: '¿Qué define la Resolución 3028 de 2008?', respuesta: 'Las áreas técnicas de producción de los establecimientos farmacéuticos y las áreas especiales para ciertos productos.' },
      { pregunta: '¿Por qué los betalactámicos requieren área exclusiva?', respuesta: 'Por su capacidad de sensibilización: trazas mínimas pueden causar reacciones alérgicas graves.' },
      { pregunta: '¿Qué normas aplican a los fitoterapéuticos?', respuesta: 'El Decreto 2266 de 2004 (registro y vigilancia) y la Resolución 3131 de 1998 (manual de BPM).' },
    ],
    resumen: [
      'La **Resolución 3028 de 2008** define áreas técnicas y **áreas especiales**.',
      'Los **betalactámicos** exigen instalaciones exclusivas por riesgo de sensibilización.',
      'Los fitoterapéuticos tienen **régimen y BPM propios**.',
    ],
    referencias: [REF.res3028, REF.res3131, REF.res1160, REF.trs986a2],
    imagenes: [
      { ubicacion: 'En la sección de áreas', descripcion: 'Plano de planta con un área de betalactámicos aislada, con su propio sistema de aire y esclusas, separada de las áreas generales.', alt: 'Área especial exclusiva para betalactámicos separada de la producción general' },
    ],
    keywords: ['resolución 3028 de 2008', 'áreas especiales betalactámicos', 'áreas técnicas de producción farmacéutica', 'resolución 3131 de 1998', 'decreto 2266 de 2004', 'bpm fitoterapéuticos', 'betalactámicos área exclusiva'],
  },
];

/**
 * Guías editoriales de cursos curados · Lote 7 (12-nov-2026)
 * Marketing, educación y psicología, ingeniería y diseño, derecho e
 * idiomas. Para los temas lejanos a la farmacia, la guía explica su
 * conexión real con el sector salud, sin forzarla.
 */
const MARKETING = ['Artículo: cursos de marketing farmacéutico y digital', '/articulos/cursos-de-marketing-farmaceutico-y-digital'];
const DROGUERIAS = ['Artículo: cursos de Facebook Ads y Canva para droguerías', '/articulos/cursos-de-facebook-ads-y-canva-para-droguerias'];
const ETIQUETADO = ['Guía: etiquetado y publicidad de medicamentos', '/articulos/cursos-gratis-etiquetado-y-publicidad'];
const INFANCIA = ['Artículo: cursos de primera infancia y estimulación temprana', '/articulos/cursos-de-primera-infancia-y-estimulacion-temprana'];
const TCC = ['Artículo: cursos de terapia cognitivo-conductual (TCC)', '/articulos/cursos-de-terapia-cognitivo-conductual-tcc'];
const INGLES = ['Artículo: cursos de inglés para profesionales de la salud', '/articulos/cursos-de-ingles-para-profesionales-de-la-salud'];
const SST = ['Artículo: cursos de SST gratis y el curso de 50 horas', '/articulos/cursos-de-seguridad-y-salud-en-el-trabajo-sst-gratis'];

export const GUIAS_LOTE_7 = {
  'storytelling-16672': {
    tituloSeo: 'Curso de storytelling online en español',
    meta: 'Curso de storytelling en español de Edutin Academy, con la guía de Edvanta para contar historias en salud con rigor y sin exagerar.',
    porQue: 'Las personas recuerdan historias, no listas de datos. En salud, el storytelling ayuda a explicar un tratamiento, presentar un proyecto a la gerencia o educar a pacientes, siempre que la historia sea verdadera y respete lo que se puede decir de un medicamento.',
    aplicaciones: [
      'Presentar los resultados de un proyecto como una historia con problema, acción y resultado.',
      'Preparar un caso educativo para pacientes con lenguaje sencillo.',
      'Estructurar un video corto para las redes de una farmacia.',
    ],
    paraQuien: ['Profesionales que presentan proyectos o resultados', 'Equipos de comunicación y educación en salud'],
    complementa: [['Curso gratis: Presentaciones Efectivas y Storytelling', '/curso-de-presentaciones-efectivas-y-storytelling'], MARKETING, ['Curso gratis: Oratoria', '/curso-de-oratoria']],
    preguntas: [
      ['¿El storytelling sirve en ciencia y salud?', 'Sí, para comunicar mejor, siempre que los datos sean exactos y no se exageren los resultados.'],
      ['¿Qué curso de Edvanta lo complementa?', 'Presentaciones Efectivas y Storytelling, gratuito y con certificado opcional.'],
    ],
  },
  'ventas-b2b-22605': {
    tituloSeo: 'Curso de ventas B2B online en español',
    meta: 'Curso de ventas B2B en español de Edutin Academy, con la guía de Edvanta para vender a clínicas, droguerías e instituciones de salud.',
    porQue: 'Vender a instituciones de salud, como clínicas, hospitales, cadenas de farmacias o gestores farmacéuticos, es distinto a vender al consumidor: hay varios decisores, procesos de compra largos y requisitos técnicos y regulatorios. Las ventas B2B enseñan a manejar ese ciclo.',
    aplicaciones: [
      'Identificar a los decisores de compra en una clínica o una cadena.',
      'Preparar una propuesta técnica y comercial para una institución.',
      'Hacer seguimiento a una oportunidad de venta con un proceso ordenado.',
    ],
    paraQuien: ['Ejecutivos de ventas institucionales', 'Visitadores médicos y representantes comerciales'],
    complementa: [MARKETING, ['Curso gratis: Negociación y Persuasión', '/curso-de-negociacion-y-persuasion'], ['Curso: CRM (Edutin)', '/curso-de-crm']],
    preguntas: [
      ['¿Qué significa B2B?', 'Venta de empresa a empresa, a diferencia de la venta al consumidor final.'],
      ['¿Qué cuidar al vender medicamentos a instituciones?', 'La información técnica aprobada, el registro sanitario y las normas de promoción.'],
    ],
  },
  'marketing-digital-14836': {
    tituloSeo: 'Curso de marketing digital online gratis',
    meta: 'Curso de marketing digital en español de Edutin Academy, sin costo y con certificado de pago, con la guía de Edvanta para el sector salud.',
    porQue: 'Las droguerías, los consultorios y los laboratorios compiten también en internet: buscadores, redes sociales y mensajería. El marketing digital enseña a llegar a las personas adecuadas, con contenido útil y medible, algo que en salud debe hacerse respetando las normas de publicidad.',
    aplicaciones: [
      'Definir el público y los objetivos de la presencia digital de una farmacia.',
      'Planear un calendario de contenidos educativos.',
      'Medir qué publicaciones generan consultas reales.',
    ],
    paraQuien: ['Dueños y administradores de droguerías', 'Profesionales de salud que emprenden'],
    complementa: [MARKETING, DROGUERIAS, ETIQUETADO],
    preguntas: [
      ['¿Hay un segundo nivel?', 'Sí, Marketing digital II, también en Edutin.'],
      ['¿Qué norma regula la publicidad de medicamentos?', 'En Colombia, la Resolución 1896 de 2023 del Ministerio de Salud.'],
    ],
  },
  'buffer-15821': {
    tituloSeo: 'Curso de Buffer para programar redes sociales',
    meta: 'Curso en español de Edutin Academy sobre Buffer para programar publicaciones en redes, con la guía de Edvanta para farmacias y consultorios.',
    porQue: 'Publicar con constancia es una de las claves de las redes sociales, y es difícil cuando el tiempo se va en atender pacientes. Herramientas como Buffer permiten programar las publicaciones de la semana en un rato y revisar después qué funcionó.',
    aplicaciones: [
      'Programar las publicaciones de una semana en varias redes.',
      'Revisar qué horarios y formatos generan más interacción.',
      'Mantener un calendario de contenidos ordenado para el equipo.',
    ],
    paraQuien: ['Quienes manejan las redes de una farmacia o un consultorio', 'Equipos pequeños de comunicación'],
    complementa: [DROGUERIAS, ['Curso: Canva (Edutin)', '/curso-de-canva'], MARKETING],
    preguntas: [
      ['¿Para qué sirve Buffer?', 'Para programar y organizar publicaciones en varias redes sociales y revisar sus resultados.'],
      ['¿Qué publicar en las redes de una farmacia?', 'Servicios, horarios, educación en salud y campañas de prevención, entre otros.'],
    ],
  },
  'publicidad-16674': {
    tituloSeo: 'Curso de publicidad online en español',
    meta: 'Curso de publicidad en español de Edutin Academy, con la guía de Edvanta sobre lo que se puede y no se puede anunciar en salud.',
    porQue: 'La publicidad busca que un mensaje llegue, se entienda y mueva a la acción. En salud tiene un límite claro: no puede engañar, exagerar beneficios ni dirigir al público general la publicidad de medicamentos con fórmula médica. Conocer los fundamentos y las reglas evita errores costosos.',
    aplicaciones: [
      'Escribir un mensaje publicitario claro para un servicio de salud.',
      'Revisar una pieza para que no prometa resultados.',
      'Escoger el medio adecuado según el público.',
    ],
    paraQuien: ['Profesionales de comunicación y marketing en salud', 'Emprendedores del sector'],
    complementa: [ETIQUETADO, MARKETING, DROGUERIAS],
    preguntas: [
      ['¿Se pueden anunciar medicamentos con fórmula médica al público?', 'No. Su publicidad solo puede dirigirse a los profesionales que prescriben.'],
      ['¿Qué palabras evitar en publicidad de salud?', 'Promesas como «cura», «milagroso» o «garantizado» sin respaldo.'],
    ],
  },
  'marketing-digital-ii-15351': {
    tituloSeo: 'Curso de marketing digital II en Edutin',
    meta: 'Segundo nivel de marketing digital de Edutin Academy, en español, con la guía de Edvanta sobre campañas y medición en salud.',
    porQue: 'Después de los fundamentos, el marketing digital se vuelve más técnico: campañas pagadas, posicionamiento en buscadores, correo electrónico y analítica. Es el paso para quien ya publica en redes y quiere convertir esa presencia en consultas y clientes medibles.',
    aplicaciones: [
      'Diseñar una campaña con un objetivo y un presupuesto definidos.',
      'Mejorar la página de un servicio para que aparezca en buscadores.',
      'Medir el costo por consulta o por cliente.',
    ],
    paraQuien: ['Quienes terminaron el primer nivel', 'Responsables de marketing de pequeñas empresas de salud'],
    complementa: [MARKETING, DROGUERIAS, ['Curso: Facebook Ads (Edutin)', '/curso-de-facebook-ads']],
    preguntas: [
      ['¿Necesito el primer nivel?', 'Conviene: este nivel parte de los conceptos del primero.'],
      ['¿Qué es el posicionamiento en buscadores?', 'El trabajo para que una página aparezca en los resultados de búsqueda sin pagar por cada clic.'],
    ],
  },
  'facebook-ads-16669': {
    tituloSeo: 'Curso de Facebook Ads gratis en español',
    meta: 'Curso de Facebook Ads en español de Edutin Academy, sin costo y con certificado de pago, con la guía de Edvanta para droguerías.',
    porQue: 'La publicidad en Facebook e Instagram permite llegar a personas de una zona específica con un presupuesto pequeño, algo muy útil para una droguería o un consultorio. Hacerlo bien exige definir objetivos, segmentar con cuidado y respetar las normas de publicidad en salud.',
    aplicaciones: [
      'Crear una campaña para atraer mensajes por WhatsApp.',
      'Segmentar por cercanía al local.',
      'Comparar dos piezas y quedarse con la que funciona mejor.',
    ],
    paraQuien: ['Dueños de droguerías y negocios de salud', 'Quienes manejan las redes de un consultorio'],
    complementa: [DROGUERIAS, ETIQUETADO, ['Curso: Facebook Ads II (Edutin)', '/curso-de-facebook-ads-ii']],
    preguntas: [
      ['¿Puedo anunciar medicamentos en Facebook?', 'Los de venta libre, con información veraz; los de fórmula médica, no al público general. Las redes también tienen sus propias reglas.'],
      ['¿Cuánto presupuesto necesito?', 'Se puede empezar con poco si la campaña está bien segmentada; lo importante es medir el costo por resultado.'],
    ],
  },
  'canva-15817': {
    tituloSeo: 'Curso de Canva gratis en español',
    meta: 'Curso de Canva en español de Edutin Academy, sin costo y con certificado de pago, con la guía de Edvanta para diseñar piezas de salud.',
    porQue: 'Canva permite diseñar publicaciones, afiches, presentaciones y material educativo sin ser diseñador. Para una farmacia, un consultorio o un docente de salud, es una forma rápida de comunicar con orden visual, siempre con datos verificados y textos legibles.',
    aplicaciones: [
      'Crear una plantilla de marca para las publicaciones de una farmacia.',
      'Diseñar un afiche educativo sobre el uso correcto de medicamentos.',
      'Preparar una presentación clara para una reunión de equipo.',
    ],
    paraQuien: ['Quienes crean contenido para redes o educación en salud', 'Docentes y comunicadores'],
    complementa: [DROGUERIAS, ['Curso gratis: Presentaciones Efectivas y Storytelling', '/curso-de-presentaciones-efectivas-y-storytelling'], ['Curso: Buffer (Edutin)', '/curso-de-buffer']],
    preguntas: [
      ['¿Necesito saber diseño?', 'No. Canva está pensado para personas sin formación en diseño.'],
      ['¿Qué cuidar en una pieza de salud?', 'Que el texto sea legible, que los datos sean correctos y que no prometa resultados.'],
    ],
  },
  'facebook-ads-ii-16675': {
    tituloSeo: 'Curso de Facebook Ads II avanzado',
    meta: 'Segundo nivel de Facebook Ads de Edutin Academy, en español, con la guía de Edvanta sobre segmentación y medición en salud.',
    porQue: 'Después de las primeras campañas, el reto es optimizar: segmentar mejor, probar mensajes, medir conversiones y escalar lo que funciona sin desperdiciar presupuesto. Es el paso para negocios de salud que ya pautan y quieren mejores resultados.',
    aplicaciones: [
      'Probar audiencias distintas con el mismo mensaje.',
      'Medir las conversiones reales de una campaña.',
      'Ajustar el presupuesto según el costo por resultado.',
    ],
    paraQuien: ['Quienes ya hicieron el primer nivel de Facebook Ads', 'Responsables de marketing digital'],
    complementa: [DROGUERIAS, MARKETING, ['Curso: IA para marketing (Edutin)', '/curso-de-ia-para-marketing']],
    preguntas: [
      ['¿Necesito el primer nivel?', 'Conviene: este nivel parte de los conceptos del primero.'],
      ['¿Qué es una conversión?', 'Una acción valiosa que hace una persona después de ver el anuncio, como escribir por WhatsApp o pedir una cita.'],
    ],
  },
  'publicidad-en-redes-sociales-16671': {
    tituloSeo: 'Curso de publicidad en redes sociales',
    meta: 'Curso en español de Edutin Academy sobre publicidad en redes sociales, con la guía de Edvanta para negocios de salud y farmacia.',
    porQue: 'Cada red social tiene su público, sus formatos y sus reglas. Una estrategia de publicidad en redes escoge dónde estar, qué contar y cómo medir, en lugar de publicar en todas partes sin rumbo. En salud, además, cada pieza debe respetar las normas de publicidad.',
    aplicaciones: [
      'Escoger las redes adecuadas según el público de tu negocio.',
      'Combinar contenido orgánico y pautado en un mismo plan.',
      'Medir resultados con indicadores definidos desde el inicio.',
    ],
    paraQuien: ['Emprendedores y negocios de salud', 'Responsables de comunicación'],
    complementa: [DROGUERIAS, ETIQUETADO, ['Curso: Publicidad (Edutin)', '/curso-de-publicidad']],
    preguntas: [
      ['¿En qué redes debe estar una farmacia?', 'Donde esté su público; muchas usan Facebook, Instagram y WhatsApp para atender consultas.'],
      ['¿Qué diferencia hay entre contenido orgánico y pautado?', 'El orgánico se publica sin pagar; el pautado paga para llegar a más personas segmentadas.'],
    ],
  },
  'ia-para-marketing-15497': {
    tituloSeo: 'Curso de inteligencia artificial para marketing',
    meta: 'Curso en español de Edutin Academy sobre IA para marketing, con la guía de Edvanta para crear y medir campañas en salud con rigor.',
    porQue: 'La inteligencia artificial acelera el trabajo de marketing: ideas, textos, imágenes, segmentación y análisis de resultados. En salud, la ventaja se aprovecha solo si cada mensaje se verifica, respeta la norma de publicidad y protege los datos de los clientes.',
    aplicaciones: [
      'Generar variantes de un anuncio para probar cuál funciona mejor.',
      'Analizar comentarios de clientes para encontrar temas frecuentes.',
      'Preparar un calendario de contenidos con apoyo de la IA.',
    ],
    paraQuien: ['Equipos de marketing en salud', 'Dueños de negocios que manejan su propia publicidad'],
    complementa: [MARKETING, ['Artículo: cursos de IA para profesionales de la salud', '/articulos/cursos-de-inteligencia-artificial-para-profesionales-de-la-salud'], ETIQUETADO],
    preguntas: [
      ['¿La IA puede escribir mis anuncios?', 'Puede proponer borradores; la revisión de exactitud y cumplimiento normativo sigue siendo tuya.'],
      ['¿Qué datos de clientes puedo usar?', 'Solo los autorizados, según la Ley 1581 de 2012 de protección de datos personales.'],
    ],
  },
  'coursera-certificado-profesional-de-google-digital-marketing-e-commerce': {
    tituloSeo: 'Certificado de marketing digital de Google',
    meta: 'Certificado profesional de Google en Coursera, en español, sobre marketing digital y comercio electrónico, con la guía de Edvanta para salud.',
    porQue: 'El marketing digital y el comercio electrónico ya son parte del negocio farmacéutico: tiendas en línea, domicilios, campañas y fidelización. Un certificado completo y en español da una base ordenada para quien quiere trabajar en esa área o llevar su negocio a internet.',
    aplicaciones: [
      'Diseñar el embudo de una tienda en línea de productos de salud.',
      'Planear campañas en buscadores y redes con objetivos medibles.',
      'Usar el correo electrónico para fidelizar clientes con consentimiento.',
    ],
    paraQuien: ['Profesionales que quieren trabajar en marketing digital', 'Droguerías y negocios de salud con venta en línea'],
    complementa: [MARKETING, ETIQUETADO, ['Curso: CRM (Edutin)', '/curso-de-crm']],
    preguntas: [
      ['¿Está en español?', 'Sí, según el catálogo este certificado está en español.'],
      ['¿Se pueden vender medicamentos en línea en Colombia?', 'Hay reglas específicas para la venta de medicamentos; consulta la normativa vigente antes de hacerlo.'],
    ],
  },
  'pedagogia-infantil-y-desarrollo-psicosocial-22459': {
    tituloSeo: 'Curso de pedagogía infantil y desarrollo psicosocial',
    meta: 'Curso en español de Edutin Academy sobre pedagogía infantil y desarrollo psicosocial, con la guía de Edvanta sobre la primera infancia.',
    porQue: 'El desarrollo psicosocial de los niños, cómo aprenden, se relacionan y regulan sus emociones, es la base del trabajo de docentes y agentes educativos. Entenderlo permite acompañar mejor cada etapa y reconocer a tiempo cuándo un niño necesita apoyo.',
    aplicaciones: [
      'Planear actividades adecuadas a la etapa de desarrollo de cada grupo.',
      'Reconocer señales de alerta en el desarrollo emocional.',
      'Comunicarte con las familias sobre el progreso de los niños.',
    ],
    paraQuien: ['Docentes de preescolar y agentes educativos', 'Estudiantes de licenciatura en educación infantil'],
    complementa: [INFANCIA, ['Curso gratis: Comunicación Asertiva', '/curso-de-comunicacion-asertiva'], ['Curso gratis: Inteligencia Emocional', '/curso-de-inteligencia-emocional']],
    preguntas: [
      ['¿Qué es el desarrollo psicosocial?', 'El desarrollo de las capacidades emocionales y sociales de una persona en relación con los demás.'],
      ['¿Qué política orienta la primera infancia en Colombia?', 'La política De Cero a Siempre, establecida por la Ley 1804 de 2016.'],
    ],
  },
  'estimulacion-temprana-22464': {
    tituloSeo: 'Curso de estimulación temprana gratis en español',
    meta: 'Curso de estimulación temprana en español de Edutin Academy, sin costo y con certificado de pago, con la guía de Edvanta para familias.',
    porQue: 'La estimulación temprana acompaña el desarrollo de los niños en sus primeros años con juego, lenguaje, movimiento y afecto. No busca acelerar al niño, sino ofrecerle oportunidades adecuadas a su edad y detectar a tiempo las señales de alerta.',
    aplicaciones: [
      'Diseñar actividades de juego según la edad del bebé.',
      'Hablar y leer con el niño desde los primeros meses.',
      'Reconocer cuándo consultar por el desarrollo.',
    ],
    paraQuien: ['Madres, padres y cuidadores', 'Docentes y personal de salud infantil'],
    complementa: [INFANCIA, ['Curso: Nutrición infantil (Edutin)', '/curso-de-nutricion-infantil'], ['Artículo: cursos de primeros auxilios y pediatría', '/articulos/cursos-de-primeros-auxilios-y-pediatria']],
    preguntas: [
      ['¿La estimulación temprana acelera el desarrollo?', 'Su objetivo no es acelerar, sino acompañar el desarrollo con oportunidades adecuadas para cada edad.'],
      ['¿Reemplaza los controles de crecimiento y desarrollo?', 'No. Los controles con el equipo de salud siguen siendo indispensables.'],
    ],
  },
  'primera-infancia-22462': {
    tituloSeo: 'Curso de primera infancia online en español',
    meta: 'Curso de primera infancia en español de Edutin Academy, con la guía de Edvanta sobre la política De Cero a Siempre y el desarrollo integral.',
    porQue: 'La primera infancia, de los cero a los seis años, es la etapa de mayor desarrollo del cerebro. Salud, nutrición, afecto, juego y protección influyen en toda la vida, y por eso Colombia tiene una política de Estado para esta etapa: De Cero a Siempre, establecida por la Ley 1804 de 2016.',
    aplicaciones: [
      'Entender los componentes del desarrollo integral de un niño.',
      'Organizar actividades que integren cuidado, juego y aprendizaje.',
      'Orientar a las familias sobre los servicios para la primera infancia.',
    ],
    paraQuien: ['Agentes educativos y docentes de preescolar', 'Familias y cuidadores'],
    complementa: [INFANCIA, ['Curso: Estimulación temprana (Edutin)', '/curso-de-estimulacion-temprana'], ['Artículo: fármacos pediátricos y dosificación segura', '/articulos/farmacos-pediatricos-dosificacion-segura']],
    preguntas: [
      ['¿Qué edades comprende la primera infancia?', 'De los cero a los seis años.'],
      ['¿Qué es De Cero a Siempre?', 'La política de Estado para el desarrollo integral de la primera infancia, establecida por la Ley 1804 de 2016.'],
    ],
  },
  'tcc-para-la-ansiedad-22466': {
    tituloSeo: 'Curso de terapia cognitivo-conductual para la ansiedad',
    meta: 'Curso en español de Edutin Academy sobre terapia cognitivo-conductual (TCC) para la ansiedad, con la guía de Edvanta para profesionales.',
    porQue: 'La ansiedad es uno de los motivos de consulta más frecuentes, y la terapia cognitivo-conductual es uno de los enfoques con más respaldo para tratarla. Conocer sus principios, como la exposición gradual y la reestructuración de pensamientos, ayuda a cualquier profesional de la salud a acompañar mejor.',
    aplicaciones: [
      'Explicar a una persona cómo se mantiene la ansiedad con la evitación.',
      'Reforzar en la consulta lo que el paciente trabaja en terapia.',
      'Reconocer cuándo remitir a un psicólogo clínico.',
    ],
    paraQuien: ['Estudiantes y profesionales de psicología', 'Profesionales de salud que atienden pacientes con ansiedad'],
    complementa: [TCC, ['Curso gratis: Psicofarmacología', '/curso-de-psicofarmacologia'], ['Curso gratis: Inteligencia Emocional', '/curso-de-inteligencia-emocional']],
    preguntas: [
      ['¿El curso habilita para hacer terapia?', 'No. La psicoterapia la ejerce un psicólogo con formación clínica.'],
      ['¿Qué es la exposición gradual?', 'Una técnica de la TCC que acerca a la persona, paso a paso, a lo que evita por ansiedad.'],
    ],
  },
  'maquillaje-profesional-22593': {
    tituloSeo: 'Curso de maquillaje profesional online',
    meta: 'Curso de maquillaje profesional en español de Edutin Academy, con la guía de Edvanta sobre higiene, piel y cosméticos seguros.',
    porQue: 'El maquillaje profesional es un oficio con demanda propia, y también se cruza con la salud: higiene de las herramientas, cuidado de la piel, reacciones alérgicas y cosméticos con registro sanitario. Quien lo ejerce con criterio protege a sus clientes y su reputación.',
    aplicaciones: [
      'Limpiar y desinfectar las herramientas entre clientes.',
      'Preguntar por alergias y piel sensible antes de maquillar.',
      'Verificar que los cosméticos tengan notificación sanitaria vigente.',
    ],
    paraQuien: ['Personas que quieren trabajar en maquillaje', 'Emprendedores de belleza y estética'],
    complementa: [['Curso: Estilista (Edutin)', '/curso-de-estilista'], DROGUERIAS, SST],
    preguntas: [
      ['¿Qué tiene que ver con la salud?', 'La higiene, el cuidado de la piel y el uso de cosméticos seguros y legales.'],
      ['¿Cómo saber si un cosmético es legal en Colombia?', 'Consultando su notificación sanitaria en la base de datos del INVIMA.'],
    ],
  },
  'estilista-22595': {
    tituloSeo: 'Curso de estilista profesional online',
    meta: 'Curso de estilista en español de Edutin Academy, con la guía de Edvanta sobre bioseguridad y productos químicos en peluquería.',
    porQue: 'El oficio de estilista combina técnica, servicio al cliente y manejo de productos químicos, como tintes y alisadores, que pueden causar irritaciones o alergias. La bioseguridad y el uso correcto de estos productos son tan importantes como la técnica de corte o color.',
    aplicaciones: [
      'Hacer una prueba de sensibilidad antes de aplicar un tinte.',
      'Manejar productos químicos con ventilación y protección.',
      'Desinfectar herramientas y superficies entre servicios.',
    ],
    paraQuien: ['Personas que quieren trabajar como estilistas', 'Emprendedores de peluquerías y salones'],
    complementa: [['Curso: Maquillaje profesional (Edutin)', '/curso-de-maquillaje-profesional'], ['Curso: Manejo de materiales peligrosos (Edutin)', '/curso-de-manejo-de-materiales-peligrosos'], ['Curso gratis: Servicio al Cliente', '/curso-de-servicio-al-cliente']],
    preguntas: [
      ['¿Por qué hacer una prueba de sensibilidad?', 'Porque algunos componentes de los tintes pueden causar reacciones alérgicas.'],
      ['¿Qué es la bioseguridad en un salón?', 'Las prácticas que previenen infecciones y accidentes, como la desinfección y el manejo de cortopunzantes.'],
    ],
  },
  'tcc-para-la-depresion-22467': {
    tituloSeo: 'Curso de terapia cognitivo-conductual para la depresión',
    meta: 'Curso en español de Edutin Academy sobre terapia cognitivo-conductual (TCC) para la depresión, con la guía de Edvanta sobre los psicofármacos.',
    porQue: 'La depresión afecta la vida diaria, el trabajo y las relaciones, y su tratamiento puede combinar psicoterapia y medicamentos. La terapia cognitivo-conductual trabaja con herramientas como la activación conductual y la reestructuración de pensamientos, y conocerlas ayuda a acompañar al paciente y su adherencia.',
    aplicaciones: [
      'Explicar qué es la activación conductual y por qué ayuda.',
      'Reforzar la adherencia a los antidepresivos con educación.',
      'Reconocer señales de riesgo y remitir de inmediato.',
    ],
    paraQuien: ['Estudiantes y profesionales de psicología', 'Químicos farmacéuticos y profesionales de salud'],
    complementa: [TCC, ['Curso gratis: Psicofarmacología', '/curso-de-psicofarmacologia'], ['Curso gratis: Comunicación Asertiva', '/curso-de-comunicacion-asertiva']],
    preguntas: [
      ['¿Los antidepresivos funcionan de inmediato?', 'No. Suelen tardar semanas en hacer efecto, y no deben suspenderse sin indicación médica.'],
      ['¿Qué hacer si alguien habla de hacerse daño?', 'Tomarlo en serio, no dejarlo solo y buscar ayuda profesional de inmediato; en Colombia, la línea de emergencias es el 123.'],
    ],
  },
  'asesor-juridico-22765': {
    tituloSeo: 'Curso de asesor jurídico online',
    meta: 'Curso de asesoría jurídica en español de Edutin Academy, con la guía de Edvanta sobre el derecho aplicado a las empresas de salud.',
    porQue: 'Las empresas de salud y los profesionales del sector enfrentan asuntos jurídicos frecuentes: contratos, responsabilidad profesional, protección de datos, normas sanitarias y relaciones laborales. Una base de asesoría jurídica ayuda a identificar riesgos y a saber cuándo consultar a un abogado.',
    aplicaciones: [
      'Revisar los puntos clave de un contrato antes de firmarlo.',
      'Identificar las obligaciones de protección de datos de tu negocio.',
      'Organizar la documentación que pide una visita de inspección.',
    ],
    paraQuien: ['Administradores y dueños de negocios de salud', 'Profesionales de cumplimiento y calidad'],
    complementa: [['Curso gratis: Asuntos Regulatorios Farmacéuticos en Colombia', '/curso-de-asuntos-regulatorios-farmaceuticos-en-colombia'], ['Curso: Especialización Regulatory Compliance (Coursera)', '/curso-de-especializacion-regulatory-compliance'], ['Guía: integridad de datos', '/articulos/cursos-gratis-integridad-de-datos']],
    preguntas: [
      ['¿El curso reemplaza a un abogado?', 'No. Da una base para entender los asuntos jurídicos y saber cuándo consultar.'],
      ['¿Qué ley protege los datos personales en Colombia?', 'La Ley 1581 de 2012, que trata los datos de salud como sensibles.'],
    ],
  },
  'mecanica-de-fluidos-22471': {
    tituloSeo: 'Curso de mecánica de fluidos online',
    meta: 'Curso de mecánica de fluidos en español de Edutin Academy, con la guía de Edvanta sobre sus usos en plantas farmacéuticas.',
    porQue: 'La mecánica de fluidos explica cómo se mueven los líquidos y los gases, y está detrás de sistemas críticos de una planta farmacéutica: el agua purificada, el aire de las áreas limpias, el mezclado y el bombeo de soluciones. Es una base útil para ingenieros y profesionales de producción y mantenimiento.',
    aplicaciones: [
      'Entender cómo funciona un sistema de agua purificada y su recirculación.',
      'Relacionar el flujo de aire con la clasificación de un área limpia.',
      'Diagnosticar problemas de bombeo o de presión en un proceso.',
    ],
    paraQuien: ['Ingenieros y técnicos de mantenimiento', 'Profesionales de producción en plantas'],
    complementa: [['Guía: calificación de sistemas HVAC', '/articulos/cursos-gratis-calificacion-hvac'], ['Guía: manufactura estéril', '/articulos/cursos-gratis-manufactura-esteril'], ['Curso gratis: Validaciones y Calificaciones', '/curso-de-validaciones-y-calificaciones']],
    preguntas: [
      ['¿Qué tiene que ver con la industria farmacéutica?', 'Los sistemas de agua, aire y transferencia de líquidos de una planta dependen de la mecánica de fluidos.'],
      ['¿Por qué importa el flujo de aire en un área limpia?', 'Porque controla las partículas y la contaminación en las zonas donde se fabrica.'],
    ],
  },
  'revit-22470': {
    tituloSeo: 'Curso de Revit online en español',
    meta: 'Curso de Revit en español de Edutin Academy, con la guía de Edvanta sobre el diseño de instalaciones de salud y plantas.',
    porQue: 'Revit es una herramienta de modelado de información de construcción (BIM) usada para diseñar edificios e instalaciones. En salud se usa en proyectos de hospitales, laboratorios y plantas, donde los flujos de personas y materiales, las áreas limpias y las instalaciones técnicas deben planearse desde el diseño.',
    aplicaciones: [
      'Modelar la distribución de un servicio farmacéutico o un laboratorio.',
      'Coordinar las instalaciones técnicas con el diseño arquitectónico.',
      'Revisar los flujos de personal y materiales en una planta.',
    ],
    paraQuien: ['Arquitectos, ingenieros y diseñadores', 'Equipos de proyectos de infraestructura en salud'],
    complementa: [['Curso: AutoCAD (Edutin)', '/curso-de-autocad'], ['Guía: manufactura estéril', '/articulos/cursos-gratis-manufactura-esteril'], ['Artículo: cursos de gestión de proyectos con certificado', '/articulos/cursos-de-gestion-de-proyectos-con-certificado']],
    preguntas: [
      ['¿Qué es BIM?', 'El modelado de información de construcción: un modelo digital que integra el diseño y la información técnica de una edificación.'],
      ['¿Revit o AutoCAD?', 'AutoCAD es más usado para planos en dos dimensiones; Revit, para modelos BIM completos.'],
    ],
  },
  'autocad-22469': {
    tituloSeo: 'Curso de AutoCAD online en español',
    meta: 'Curso de AutoCAD en español de Edutin Academy, con la guía de Edvanta sobre planos de instalaciones farmacéuticas y de salud.',
    porQue: 'AutoCAD es una de las herramientas de dibujo técnico más usadas para planos de arquitectura e ingeniería. En el sector salud sirve para los planos de una droguería, un laboratorio o una planta, que muchas veces se presentan en trámites de habilitación, certificación o licencias.',
    aplicaciones: [
      'Dibujar el plano de distribución de una droguería o un laboratorio.',
      'Actualizar los planos después de una remodelación.',
      'Preparar planos para un trámite o una visita de inspección.',
    ],
    paraQuien: ['Dibujantes, ingenieros y arquitectos', 'Personal técnico de mantenimiento e infraestructura'],
    complementa: [['Curso: Revit (Edutin)', '/curso-de-revit'], ['Guía: manufactura estéril', '/articulos/cursos-gratis-manufactura-esteril'], ['Guía: calificación de sistemas HVAC', '/articulos/cursos-gratis-calificacion-hvac']],
    preguntas: [
      ['¿Para qué sirve AutoCAD en salud?', 'Para planos de instalaciones como droguerías, laboratorios y plantas.'],
      ['¿Necesito experiencia previa?', 'No para empezar, aunque ayuda tener nociones de dibujo técnico.'],
    ],
  },
  'arcgis-18432': {
    tituloSeo: 'Curso de ArcGIS online en español',
    meta: 'Curso de ArcGIS en español de Edutin Academy, con la guía de Edvanta sobre el análisis geográfico en salud pública.',
    porQue: 'Los sistemas de información geográfica permiten ver los datos en un mapa: dónde ocurren los casos de una enfermedad, dónde están los servicios de salud o cómo llega la distribución de medicamentos. ArcGIS es una de las herramientas más usadas para ese análisis en salud pública y logística.',
    aplicaciones: [
      'Mapear la ubicación de los casos de una enfermedad.',
      'Analizar el acceso de una población a farmacias y servicios de salud.',
      'Planear rutas de distribución con información geográfica.',
    ],
    paraQuien: ['Profesionales de salud pública y epidemiología', 'Analistas de logística y planeación'],
    complementa: [['Guía: evidencia del mundo real', '/articulos/cursos-gratis-evidencia-del-mundo-real'], ['Artículo: cursos de logística farmacéutica', '/articulos/cursos-de-logistica-farmaceutica-y-cadena-de-suministro'], ['Guía: Python para farmacia', '/articulos/cursos-gratis-python-para-farmacia']],
    preguntas: [
      ['¿Qué es un sistema de información geográfica?', 'Una herramienta que relaciona datos con su ubicación para analizarlos en mapas.'],
      ['¿Cómo se usa en salud pública?', 'Para ver la distribución de enfermedades, el acceso a servicios y la planeación de intervenciones.'],
    ],
  },
  'ingles-basico-a1-23935': {
    tituloSeo: 'Curso de inglés básico A1 gratis en Edutin',
    meta: 'Curso de inglés básico A1 en español de Edutin Academy, sin costo y con certificado de pago, con la guía de Edvanta para salud y farmacia.',
    porQue: 'El inglés abre puertas en el sector farmacéutico: vacantes en multinacionales, guías técnicas, cursos especializados y literatura científica. El nivel A1 es el punto de partida para quien empieza desde cero, con el vocabulario y las estructuras más básicas.',
    aplicaciones: [
      'Presentarte y hablar de tu trabajo con frases sencillas.',
      'Reconocer palabras técnicas básicas en un empaque o un documento.',
      'Construir el hábito de estudiar un poco cada día.',
    ],
    paraQuien: ['Personas que empiezan inglés desde cero', 'Auxiliares y regentes que quieren mejorar su perfil'],
    complementa: [INGLES, ['Curso: Inglés intermedio B1 (Edutin)', '/curso-de-ingles-intermedio-b1'], ['Artículo: carrera de Química Farmacéutica en Colombia', '/articulos/carrera-de-quimica-farmaceutica-en-colombia']],
    preguntas: [
      ['¿Qué significa el nivel A1?', 'Es el nivel inicial del Marco Común Europeo de Referencia: frases sencillas y vocabulario básico.'],
      ['¿Qué nivel piden las vacantes de la industria?', 'Con frecuencia, un B1 o B2 para leer documentos y participar en reuniones.'],
    ],
  },
  'ingles-intermedio-b1-23936': {
    tituloSeo: 'Curso de inglés intermedio B1 gratis',
    meta: 'Curso de inglés intermedio B1 de Edutin Academy, sin costo y con certificado de pago, con la guía de Edvanta para profesionales de la salud.',
    porQue: 'El nivel B1 es el que piden muchas vacantes del sector farmacéutico: permite leer documentos técnicos, escribir correos y participar en reuniones sencillas. Es el paso que convierte el inglés de una materia pendiente en una herramienta de trabajo.',
    aplicaciones: [
      'Leer una guía técnica o un inserto en inglés.',
      'Escribir un correo profesional a un proveedor o una casa matriz.',
      'Participar en una reunión virtual con preguntas y respuestas sencillas.',
    ],
    paraQuien: ['Profesionales con bases de inglés', 'Químicos farmacéuticos que buscan empleo en multinacionales'],
    complementa: [INGLES, ['Curso: Inglés avanzado B2 (Edutin)', '/curso-de-ingles-avanzado-b2'], ['Artículo: mejores cursos de Coursera para químicos farmacéuticos', '/articulos/mejores-cursos-de-coursera-para-quimicos-farmaceuticos']],
    preguntas: [
      ['¿Qué puedo hacer con un nivel B1?', 'Leer textos técnicos sencillos, escribir correos y mantener conversaciones sobre temas conocidos.'],
      ['¿Cómo practicar el inglés técnico?', 'Tomando cursos de tu área en inglés, como los de Coursera que recomienda Edvanta.'],
    ],
  },
  'ingles-avanzado-b2-23937': {
    tituloSeo: 'Curso de inglés avanzado B2 online',
    meta: 'Curso de inglés avanzado B2 de Edutin Academy, en español, con la guía de Edvanta para trabajar en inglés en la industria farmacéutica.',
    porQue: 'Con un nivel B2 se puede trabajar en inglés: discutir un documento técnico, presentar resultados, negociar con un proveedor o participar en una auditoría internacional. Es el nivel que más diferencia un perfil en la industria farmacéutica y en la investigación clínica.',
    aplicaciones: [
      'Presentar los resultados de un proyecto en inglés.',
      'Participar en una auditoría o una inspección con un equipo internacional.',
      'Redactar un informe técnico con vocabulario preciso.',
    ],
    paraQuien: ['Profesionales con nivel intermedio', 'Personas que preparan un examen internacional de inglés'],
    complementa: [INGLES, ['Curso gratis: Oratoria', '/curso-de-oratoria'], ['Curso: Basic Course in Drug Regulatory Affairs (Udemy)', '/curso-de-basic-course-in-drug-regulatory-affairs']],
    preguntas: [
      ['¿Qué diferencia hay entre B1 y B2?', 'Con B2 se puede discutir temas complejos y técnicos con fluidez; con B1, temas conocidos y sencillos.'],
      ['¿Sirve para un examen internacional?', 'Ayuda a prepararse; cada examen tiene su propio formato y conviene practicarlo.'],
    ],
  },
  'frances-basico-a1-23938': {
    tituloSeo: 'Curso de francés básico A1 gratis',
    meta: 'Curso de francés básico A1 de Edutin Academy, sin costo y con certificado de pago, con la guía de Edvanta para profesionales de la salud.',
    porQue: 'El francés es un idioma útil para quien piensa en estudiar o trabajar en Francia, Bélgica, Suiza o Canadá, países con programas de salud y de investigación farmacéutica. El nivel A1 da las bases para presentarse y entender frases cotidianas.',
    aplicaciones: [
      'Presentarte y hablar de tu profesión con frases sencillas.',
      'Entender instrucciones y textos muy básicos.',
      'Preparar el camino para un intercambio o un posgrado.',
    ],
    paraQuien: ['Personas que empiezan francés desde cero', 'Profesionales que planean estudiar en un país francófono'],
    complementa: [INGLES, ['Curso: Portugués básico A1 (Edutin)', '/curso-de-portugues-basico-a1'], ['Artículo: cursos gratis con certificado', '/articulos/cursos-gratis-con-certificado-para-quimicos-farmaceuticos']],
    preguntas: [
      ['¿Qué significa el nivel A1?', 'Es el nivel inicial del Marco Común Europeo de Referencia para las lenguas.'],
      ['¿Es útil el francés en farmacia?', 'Sí, sobre todo para estudiar o trabajar en países francófonos.'],
    ],
  },
  'portugues-basico-a1-23939': {
    tituloSeo: 'Curso de portugués básico A1 gratis',
    meta: 'Curso de portugués básico A1 de Edutin Academy, sin costo y con certificado de pago, con la guía de Edvanta sobre Brasil y la Anvisa.',
    porQue: 'Brasil es el mayor mercado farmacéutico de América Latina, y la Anvisa es una de las agencias sanitarias más activas de la región. Saber portugués básico permite leer sus comunicados, trabajar con empresas brasileñas y entender un mercado que influye en toda la región.',
    aplicaciones: [
      'Leer los titulares de los comunicados de la Anvisa.',
      'Presentarte y comunicarte con colegas de Brasil.',
      'Entender documentos técnicos sencillos en portugués.',
    ],
    paraQuien: ['Personas que empiezan portugués desde cero', 'Profesionales de regulatorio y comercio exterior'],
    complementa: [['Noticia: la Anvisa aprueba Evrysdi Go', '/articulos/anvisa-aprueba-evrysdi-go-para-atrofia-muscular-espinal'], INGLES, ['Curso gratis: Asuntos Regulatorios Farmacéuticos en Colombia', '/curso-de-asuntos-regulatorios-farmaceuticos-en-colombia']],
    preguntas: [
      ['¿Por qué aprender portugués en farmacia?', 'Por la importancia del mercado brasileño y de la Anvisa en la región.'],
      ['¿Qué es la Anvisa?', 'La Agencia Nacional de Vigilancia Sanitaria de Brasil.'],
    ],
  },
};

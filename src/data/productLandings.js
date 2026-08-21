/**
 * ============================================================
 *  LANDINGS INDIVIDUALES DE PRODUCTO — FELIZ SIN TIROIDES
 *  Copy completo por landing: hero, dolor, transformación,
 *  contenido, beneficios, cierre, FAQ y lead magnet.
 *
 *  Checkouts y precios vienen de fstLandings.js (fuente única).
 * ============================================================
 */
import { CHECKOUTS, PRICES, LEAD_MAGNETS, PRODUCT_FAQS } from './fstLandings';

const priceOf = key => PRICES[key];

export const productLandings = [
  {
    // ─────────── LANDING 04 · COLECCIÓN DE LA TIROIDES ───────────
    slug: 'coleccion-tiroides',
    id: 'fst-coleccion-sana',
    name: 'Colección de la Tiroides',
    image: '/img/port-coleccion.jpg',
    checkoutUrl: CHECKOUTS.coleccion,
    stickyLabel: 'OBTENER LA COLECCIÓN',
    seo: {
      title: 'Colección de la Tiroides: organiza tu autocuidado | FST',
      description: 'Guías, diarios y plantillas para comprender tu condición tiroidea, ordenar medicación y hábitos y llegar mejor preparada a tus consultas. Acceso digital.',
      canonical: 'coleccion-tiroides',
      keywords: ['colección de la tiroides', 'kit de autocuidado tiroideo', 'organizar levotiroxina y hábitos', 'guías para tiroides', 'prepararse para la consulta médica', 'rutinas de autocuidado tiroideo'],
    },
    hero: {
      tag: 'Colección · Ruta completa de autocuidado',
      h1: 'Puedes seguir guardando información suelta sobre tu tiroides… o vas a organizarla de una vez en un solo lugar.',
      subtitle: 'La Colección de la Tiroides reúne las guías base para comprender tu condición, ordenar medicación y hábitos, y llegar más preparada a cada consulta.',
      benefits: ['Una ruta clara', 'Consulta cuando quieras', 'Hecha por una Química Farmacéutica'],
      price: priceOf('coleccion').price,
      compare: priceOf('coleccion').compare,
      cta: 'QUIERO ACCEDER A LA COLECCIÓN',
    },
    isForYou: {
      title: 'La Colección de la Tiroides puede ser para ti si...',
      items: [
        'acaban de decirte que tienes una condición tiroidea y no sabes por dónde empezar',
        'sientes que toda la información que guardas no encaja en un plan',
        'quieres organizar medicación, alimentación y registro de síntomas',
        'llegas a consulta con preguntas que recordaste después',
        'prefieres un material completo en vez de sumar ebooks sueltos',
        'quieres participar más activamente en tu autocuidado',
      ],
    },
    problem: {
      title: 'La información fragmentada no se convierte sola en autocuidado',
      paragraphs: [
        'Un día lees sobre el mejor horario para la levotiroxina. Otro día, sobre alimentos a considerar. El siguiente, sobre cómo interpretar la TSH.',
        'Cada dato, por separado, parece útil. Pero juntos no forman un plan: forman una lista de cosas pendientes que nunca terminas de organizar.',
        'El problema no es la información. Es que nadie la ha ordenado para ti.',
      ],
      points: [
        'No saber qué registrar entre consulta y consulta',
        'Reunir recomendaciones contradictorias de fuentes distintas',
        'Olvidar las preguntas cuando llega el momento de hacerlas',
        'Empezar y abandonar hábitos porque no hay estructura',
      ],
      questions: [
        '¿Cuánto debo esperar entre el medicamento y el café?',
        '¿Qué debería registrar entre consultas?',
        '¿Qué alimentos sí son pertinentes para mi caso?',
        '¿Cómo presento mis exámenes sin olvidar nada?',
      ],
      close: 'Cuidarte no debería sentirse como armar un rompecabezas distinto cada día.',
    },
    transformation: [
      { icon: 'compass', title: 'Tienes una ruta', text: 'Dejas de adivinar por dónde empezar: la colección ordena conceptos, medicación, alimentación y hábitos.' },
      { icon: 'list', title: 'Sabes qué registrar', text: 'Checklists y registros para ver tendencias entre citas y llevar datos útiles a tu consulta.' },
      { icon: 'message', title: 'Preguntas preparadas', text: 'Llegas con preguntas concretas y no te vas con la sensación de haber olvidado lo importante.' },
      { icon: 'book', title: 'Material de consulta', text: 'Una biblioteca que vuelves a abrir cuando aparece una duda, sin buscar en diez publicaciones.' },
      { icon: 'leaf', title: 'Alimentación con criterio', text: 'Orientación para elegir alimentos sin restricciones extremas ni promesas milagrosas.' },
      { icon: 'chart', title: 'Exámenes en contexto', text: 'Referencias para organizar tus laboratorios y conversar resultados con tu equipo de salud.' },
    ],
    includes: {
      title: 'Lo que incluye la Colección de la Tiroides',
      cards: [
        { icon: 'book', title: 'Bienvenida y mapa de la colección', helps: 'encontrar rápidamente la guía que necesitas en cada momento.' },
        { icon: 'pill', title: 'Guía de levotiroxina y administración', helps: 'organizar la toma diaria, separar alimentos y preparar dudas reales.' },
        { icon: 'leaf', title: 'Guía de alimentación tiroidea', helps: 'elegir alimentos con criterio educativo, sin prohibiciones sin sentido.' },
        { icon: 'chart', title: 'Registro de síntomas y laboratorios', helps: 'llevar un historial útil que puedas mostrar en consulta.' },
        { icon: 'heart', title: 'Hábitos y bienestar emocional', helps: 'estructurar el descanso, la energía y el estado de ánimo en el día a día.' },
        { icon: 'clipboard', title: 'Checklists y preguntas para consulta', helps: 'preparar cada cita con las preguntas que hoy se te olvidan.' },
      ],
    },
    takeaways: [
      'Una ruta organizada que puedes volver a consultar cuando surja una duda.',
      'Registros y checklists para que la información importante no dependa de tu memoria.',
      'Preguntas concretas para tus citas, listas para llevar.',
      'Criterio educativo para evaluar la información que encuentres en otros lugares.',
    ],
    before: [
      'No sé por dónde comenzar.',
      'Tengo información guardada en todas partes.',
      'No sé qué registrar entre consultas.',
      'Llego a cita sin preguntas preparadas.',
    ],
    after: [
      'Tengo una estructura clara de autocuidado.',
      'Sé dónde consultar cada tema.',
      'Registro lo importante y llego mejor preparada.',
      'Entiendo qué conversar con mi equipo de salud.',
    ],
    faqs: PRODUCT_FAQS.coleccion,
    related: [
      { to: '/diario-emociones-hipotiroidismo', icon: 'heart', title: 'Diario de emociones para hipotiroidismo', text: 'Si lo emocional también ocupa un lugar en tu proceso, este diario te ayuda a ponerle registro y palabras.' },
      { to: '/atencion-farmaceutica', icon: 'users', title: 'Atención Farmacéutica individual', text: 'Si tu caso ya es muy específico (varios medicamentos, horarios complicados), una guía general puede no bastar.' },
    ],
    magnet: {
      ...LEAD_MAGNETS.coleccion,
      related: { name: 'Colección de la Tiroides', url: CHECKOUTS.coleccion, cta: 'Ver la colección completa' },
    },
    tablet: {
      tag: 'GUÍA DE AUTOCUIDADO',
      title: 'Ruta de autocuidado tiroideo',
      items: ['Ordena tu medicamento y horarios', 'Revisa tu alimentación y hábitos', 'Registra síntomas y exámenes', 'Prepara tu próxima consulta'],
    },
    closing: {
      title: 'Puedes seguir acumulando información… o empezar a organizarla.',
      text: 'La Colección de la Tiroides es tu estructura: conceptos, registros y preguntas listas para que el autocuidado deje de ser un rompecabezas diario.',
    },
    repeat: {
      one: 'Empezar con una estructura clara es la decisión que cambia cómo vives tu día a día.',
      two: 'Organizar tu autocuidado es el siguiente paso más importante que puedes dar hoy.',
    },
  },

  {
    // ─────────── LANDING 05 · CAÍDA DEL CABELLO Y TIROIDES ───────────
    slug: 'caida-cabello-tiroides',
    id: 'fst-caida-cabello-tiroides',
    name: 'Protocolo para la caída del cabello y tiroides',
    image: '/img/port-manejodesintomas.jpg',
    checkoutUrl: CHECKOUTS.caidaCabello,
    stickyLabel: 'OBTENER EL PROTOCOLO',
    seo: {
      title: 'Caída del cabello y tiroides: protocolo de registro | FST',
      description: 'Registra y organiza los datos de la caída del cabello relacionada con tu tiroides: qué observar, qué cuidar y qué preguntar en tu consulta.',
      canonical: 'caida-cabello-tiroides',
      keywords: ['caída del cabello y tiroides', 'caída del cabello hipotiroidismo', 'protocolo caída del cabello', 'tiroides y cabello', 'qué preguntar por la caída del cabello'],
    },
    hero: {
      tag: 'Protocolo · Síntomas y autocuidado',
      h1: 'Si estás viviendo caída del cabello y tienes un diagnóstico tiroideo, lo último que necesitas es otra lista de remedios sin contexto.',
      subtitle: 'Este protocolo te ayuda a registrar lo que está pasando, ordenar los factores que puedes conversar con tu equipo de salud y preparar las preguntas correctas.',
      benefits: ['Registro guiado', 'Preguntas para tu cita', 'Sin promesas milagrosas'],
      price: priceOf('caidaCabello').price,
      compare: priceOf('caidaCabello').compare,
      cta: 'QUIERO MI GUÍA PARA LA CAÍDA DEL CABELLO',
    },
    isForYou: {
      title: 'Este protocolo puede ser para ti si...',
      items: [
        'tienes una condición tiroidea y notas más caída del cabello de lo habitual',
        'viste cambios en tu cabello después de un cambio de dosis o de cirugía',
        'has recibido opiniones contradictorias sobre qué hacer',
        'quieres registrar con datos lo que hoy describe con angustia',
        'te preocupa no tener preguntas preparadas para tu próxima cita',
        'quieres información responsable, no una lista de remedios sin base',
      ],
    },
    problem: {
      title: 'La caída del cabello no se resuelve con el dato suelto que leíste',
      paragraphs: [
        'Cuando aparece la caída, el impulso es buscar "qué tomar" o "qué evitar". Pero el motivo habitual es multifactorial: medicación, cambios hormonales, estrés, nutrición, productos para el cabello.',
        'Sin registro, cada cita médica empieza de cero: "¿desde cuándo?", "¿fue gradual o repentino?", "¿qué usas?"… y la mayoría de las veces no sabes responder con precisión.',
        'El problema no es tu memoria. Es que nunca te dieron una herramienta para organizar lo que ocurre.',
      ],
      points: [
        'No saber si comenzó con un cambio de dosis o con otra cosa',
        'Sin registrar, todo queda a la percepción de la memoria',
        'No saber qué preguntas son útiles en la consulta',
        'El miedo a que "sea irreversible" sin confirmar nada',
      ],
      questions: [
        '¿Cuándo empezó exactamente?',
        '¿Fue alrededor de un cambio en mi tratamiento?',
        '¿Qué productos uso en el cabello?',
        '¿Qué debería preguntarle a mi médico?',
      ],
      close: 'Registrar no arregla todo, pero convierte la angustia en información utilizable.',
    },
    transformation: [
      { icon: 'clipboard', title: 'Sabes qué registrar', text: 'Ocho datos concretos que tu profesional querría saber, listos para escribir en minutos.' },
      { icon: 'calendar', title: 'Ves el antes y después', text: 'Llevar registros te permite saber si hay cambios por época, tratamiento o productos.' },
      { icon: 'message', title: 'Preguntas correctas', text: 'Llegas a consulta con las dudas que importan y con datos para conversarlas.' },
      { icon: 'shield', title: 'Sin decisiones apresuradas', text: 'Evitas comenzar suplementos o tratamientos sin conversarlos con tu equipo de salud.' },
      { icon: 'heart', title: 'Tranquilidad organizada', text: 'Cuando está escrito y ordenado, la sensación de caos deja espacio a la claridad.' },
      { icon: 'book', title: 'Referencia futura', text: 'Un registro que además te sirve en la próxima cita, aunque sea en meses.' },
    ],
    includes: {
      title: 'Qué incluye el protocolo',
      cards: [
        { icon: 'clipboard', title: 'Registro de 8 datos clave', helps: 'desde cuándo, cómo, cambios, productos, hábitos y exámenes relevantes.' },
        { icon: 'trendDown', title: 'Escala visual de caída', helps: 'señalar la intensidad y evolución sin describir horas en palabras.' },
        { icon: 'pill', title: 'Revisión de factores de tratamiento', helps: 'identificar cuándo coincidió con cambios o dosis, sin tocar medicamentos.' },
        { icon: 'list', title: 'Productos y hábitos del cabello', helps: 'organizar lo que usas hoy y dejar constancia para conversar.' },
        { icon: 'message', title: 'Preguntas para tu consulta', helps: 'llegar con dudas útiles a tu médico o tu equipo de salud.' },
        { icon: 'book', title: 'Qué se puede esperar', helps: 'entender los tiempos del crecimiento del cabello sin falsas promesas.' },
      ],
    },
    takeaways: [
      'Un registro guiado que convierte tu percepción en datos útiles.',
      'Tablas visuales para ubicar rápido lo importante sin releer todo.',
      'Preguntas preparadas para tu cita, listas para llevar.',
      'Criterio educativo para evaluar remedios y suplementos que veas por ahí.',
    ],
    before: [
      'No sé desde cuándo ni cómo empezó.',
      'Tengo pánico y datos sueltos.',
      'No sé qué es útil decirle al médico.',
      'Veo cabello en el piso y no registro nada.',
    ],
    after: [
      'Tengo registros claros que mostrar.',
      'Conozco qué preguntar y qué no.',
      'Distinguir lo urgente de lo que se revisa con calma.',
      'Llego a consulta con información, no solo con angustia.',
    ],
    faqs: PRODUCT_FAQS.caidaCabello,
    related: [
      { to: '/coleccion-tiroides', icon: 'book', title: 'Colección de la Tiroides', text: 'Si además necesitas ordenar el resto del autocuidado, la colección es tu ruta completa.' },
      { to: '/atencion-farmaceutica', icon: 'users', title: 'Atención Farmacéutica', text: 'Si la caída coincide con cambios de medicación, revisarlo con un químico farmacéutico puede aportar claridad.' },
    ],
    magnet: {
      ...LEAD_MAGNETS.caidaCabello,
      related: { name: 'Protocolo para la caída del cabello y tiroides', url: CHECKOUTS.caidaCabello, cta: 'Ver el protocolo completo' },
    },
    tablet: {
      tag: 'PROTOCOLO · REGISTRO',
      title: '8 datos para tu consulta',
      items: ['¿Cuándo empezó?', '¿Fue de repente o gradual?', '¿Coincidió con un cambio?', '¿Qué productos usas?'],
    },
    closing: {
      title: 'Puedes seguir angustia en el espejo… o convertirla en información.',
      text: 'El protocolo es tu puente entre lo que observas y la consulta que te va a resolver dudas.',
    },
    repeat: {
      one: 'Llevar el registro correcto puede cambiar la calidad de tu próxima consulta.',
      two: 'No esperes a la siguiente cita para empezar a organizar.',
    },
  },

  {
    // ─────────── LANDING 06 · INSOMNIO EN ENFERMEDADES TIROIDEAS ───────────
    slug: 'insomnio-tiroides',
    id: 'fst-insomnio-tiroides',
    name: 'Cómo superar el insomnio en enfermedades tiroideas',
    image: '/img/port-diario-hipo.jpg',
    checkoutUrl: CHECKOUTS.insomnio,
    stickyLabel: 'OBTENER LA GUÍA',
    seo: {
      title: 'Insomnio y tiroides: guía práctica para dormir mejor | FST',
      description: 'Aprende a observar tu descanso, construir una rutina nocturna realista y saber cuándo consultar con una condición tiroidea. Guía digital.',
      canonical: 'insomnio-tiroides',
      keywords: ['insomnio y tiroides', 'insomnio hipotiroidismo', 'insomnio hipertiroidismo', 'no puedo dormir con tiroides', 'rutina para dormir con tiroides', 'sueño y tiroides'],
    },
    hero: {
      tag: 'Guía · Sueño y bienestar',
      h1: 'Si duermes mal y vives con una enfermedad tiroidea, la noche parece doblemente difícil: tu cuerpo y tu mente no descansan.',
      subtitle: 'Una guía para observar tu descanso, construir una rutina realista y saber distinguir cuándo conviene conversar con tu equipo de salud.',
      benefits: ['Registro de sueño', 'Rutina nocturna paso a paso', 'Cuándo consultar'],
      price: priceOf('insomnio').price,
      compare: priceOf('insomnio').compare,
      cta: 'QUIERO MEJORAR MI RUTINA DE SUEÑO',
    },
    isForYou: {
      title: 'Esta guía puede ser para ti si...',
      items: [
        'te cuesta quedarte dormida y tu mente no para de girar',
        'despiertas varias veces por la noche y amaneces cansada',
        'vives con hipotiroidismo o hipertiroidismo y tu descanso cambió',
        'no sabes si tu problema de sueño tiene que ver con tu tratamiento',
        'pruebas técnicas de sueño que se sienten como otra tarea',
        'quieres llegar con datos claros a tu consulta',
      ],
    },
    problem: {
      title: 'El insomnio con tiroides no se arregla con "relájate"',
      paragraphs: [
        'En las enfermedades tiroideas el descanso cambia: el hipertiroidismo tiende a acortar la noche, la energía alta y la mente acelerada; el hipotiroidismo, a dejarte lenta pero con sueño fragmentado.',
        'Entre síntomas, exámenes y horarios de medicación, el sueño queda al final de la lista. Y sin observarlo, nunca sabes qué está pasando en tu caso.',
        'La guía no promete "dormir perfecto": te da una estructura para observar, construir una rutina y saber cuándo hay una bandera que merece revisión.',
      ],
      points: [
        'No sabes cuánto duermes realmente ni cómo se siente tu sueño',
        'Las técnicas genéricas no contemplan el contexto tiroideo',
        'Despiertas con ansiedad por la noche y sin herramientas',
        'No sabes si merece una consulta o es "normal" en tu condición',
      ],
      questions: [
        '¿Cuánto horas duermo en promedio?',
        '¿Despierto por qué?',
        '¿Mi medicación influye en mi descanso?',
        '¿Cuándo debo consultar?',
      ],
      close: 'Observar el sueño es el primer paso para dejar de temerlo.',
    },
    transformation: [
      { icon: 'sun', title: 'Conoces tu patrón', text: 'Con 7 días de registro deja de estar en la bruma: verás qué pasa antes de dormir y cómo amaneces.' },
      { icon: 'clock', title: 'Rutina realista', text: 'Una rutina nocturna que cabe en tu vida, no otra lista de 20 pasos.' },
      { icon: 'activity', title: 'Sueño y síntomas conectados', text: 'La guía conecta tu registro de sueño con tus síntomas tiroideos y medicación.' },
      { icon: 'message', title: 'Sabes cuándo consultar', text: 'Distinguir un mal momento de un patrón que merece revisión con tu equipo.' },
      { icon: 'book', title: 'Material de consulta', text: 'Tu registro de sueño se vuelve un documento útil para tu próximo control.' },
      { icon: 'leaf', title: 'Hábitos sin culpa', text: 'Pautas de descanso, cafeína y pantallas sin la culpa de "no poder con esto".' },
    ],
    includes: {
      title: 'Qué incluye la guía',
      cards: [
        { icon: 'sun', title: 'Diario de sueño de 7 días', helps: 'observar horas, despertares y sensación de descanso sin juzgarte.' },
        { icon: 'clock', title: 'Rutina nocturna paso a paso', helps: 'crear un cierre de día que realmente pueda funcionar.' },
        { icon: 'activity', title: 'Sueño y tiroides', helps: 'entender cómo el hipo e hipertiroidismo se presentan en el descanso.' },
        { icon: 'clipboard', title: 'Señales de alerta', helps: 'saber cuándo un problema de sueño merece valoración profesional.' },
        { icon: 'leaf', title: 'Cafeína, pantallas y ambiente', helps: 'organizar los factores cotidianos del descanso.' },
        { icon: 'message', title: 'Resumen para tu consulta', helps: 'llevar tu registro y preguntas listas a la próxima cita.' },
      ],
    },
    takeaways: [
      'Un registro que te muestra la realidad de tu descanso en 7 días.',
      'Una rutina con una sola hoja, aplicable desde la primera noche.',
      'Criterio claro para saber cuándo consultar, sin alarmismo.',
      'Un documento para tu equipo de salud, listo en días.',
    ],
    before: [
      'No sé cuánto duermo ni por qué.',
      'Me paso las noches en un bucle.',
      'Las técnicas de sueño no me sirven.',
      'No sé si esto es normal con tiroides.',
    ],
    after: [
      'Tengo datos de mi descanso real.',
      'Tengo una rutina que sí implementé.',
      'Sé distinguir un patrón que merece consulta.',
      'Llego a cita con un registro completo.',
    ],
    faqs: PRODUCT_FAQS.insomnio,
    related: [
      { to: '/diario-emociones-hipotiroidismo', icon: 'heart', title: 'Diario de emociones hipotiroidismo', text: 'Sueño y emociones se retroalimentan: registrar ambos ayuda a ver el cuadro completo.' },
      { to: '/coleccion-tiroides', icon: 'book', title: 'Colección de la Tiroides', text: 'Un recorrido integral que incluye descanso, alimentación y exámenes.' },
    ],
    magnet: {
      ...LEAD_MAGNETS.insomnio,
      related: { name: 'Cómo superar el insomnio en enfermedades tiroideas', url: CHECKOUTS.insomnio, cta: 'Ver la guía completa' },
    },
    tablet: {
      tag: 'REGISTRO DE SUEÑO',
      title: 'Diario de sueño · 7 días',
      items: ['Hora de dormir y de despertar', '¿Cuántas veces despertaste?', '¿Cómo te sientes al amanecer?', 'Notas: lo que hay que conversar'],
    },
    closing: {
      title: 'El descanso no se resuelve por imposición: se observa, se ordena y se sostiene.',
      text: 'Esta guía te acompaña a hacer exactamente eso, con herramientas para que el sueño deje de ser un misterio diario.',
    },
    repeat: {
      one: 'Empieza a registrar tu descanso hoy: la primera noche es el primer dato.',
      two: 'Una rutina para dormir mejor es una de las decisiones más lucidas del mes.',
    },
  },

  {
    // ─────────── LANDING 07 · DIARIO EMOCIONES HIPOTIROIDISMO ───────────
    slug: 'diario-emociones-hipotiroidismo',
    id: 'fst-diario-hipotiroidismo',
    name: 'Diario de Manejo de las Emociones en Hipotiroidismo',
    image: '/img/port-diario-hipo.jpg',
    checkoutUrl: CHECKOUTS.diarioHipo,
    stickyLabel: 'OBTENER EL DIARIO',
    seo: {
      title: 'Emociones e hipotiroidismo: diario guiado | Feliz Sin Tiroides',
      description: 'Registra emociones, energía y ánimo mientras vives con hipotiroidismo. Un diario imprimible de 3 minutos al día para ordenar y conversar tu sentir.',
      canonical: 'diario-emociones-hipotiroidismo',
      keywords: ['emociones e hipotiroidismo', 'estado de ánimo y tiroides', 'diario de emociones hipotiroidismo', 'salud mental hipotiroidismo', 'registro emocional tiroidea', 'fatiga y ánimo con hipotiroidismo'],
    },
    hero: {
      tag: 'Diario · Bienestar emocional',
      h1: 'Con hipotiroidismo, tu energía y tu ánimo se mueven despacio… y eso también se siente. El diario te da un espacio para ponerlo en orden.',
      subtitle: 'Un diario guiado para registrar tus emociones, observar patrones y conversar mejor con tu equipo de salud. Sin juicios y sin teoría.',
      benefits: ['2-3 min al día', 'Imprimible', 'Para tu consulta'],
      price: priceOf('diarioHipo').price,
      compare: priceOf('diarioHipo').compare,
      cta: 'QUIERO MI DIARIO PARA HIPOTIROIDISMO',
    },
    isForYou: {
      title: 'Este diario puede ser para ti si...',
      items: [
        'te sientes emocionalmente distinta desde el diagnóstico',
        'la fatiga te hace sentir que no puedes con todo con frecuencia',
        'quieres entender tus cambios de ánimo sin etiquetas duras',
        'te cuesta describir en consulta cómo te sientes',
        'empiezas con hojas de registro y no las mantienes',
        'quieres una herramienta para ayudarte a notar avances',
      ],
    },
    problem: {
      title: 'Las emociones con hipotiroidismo no caben en un "estoy bien"',
      paragraphs: [
        'El hipotiroidismo convive con cambios de energía, memoria y ánimo. Es normal sentirse desorientada cuando ni el propio estado de ánimo se explica.',
        'Ir a consulta y decir "estoy bien, creo" es lo habitual: no tienes el lenguaje ni el registro para describir con precisión tu semana emocional.',
        'Y sin registro, los patrones se confunden: ¿es la semana del ciclo? ¿la del mal descanso? ¿la que se junta con todo?',
      ],
      points: [
        'La emocionalidad en hipotiroidismo existe y no te hace menor',
        'El "estoy bien, creo" no sirve ni para ti ni para tu médico',
        'Las hojas que las empezaste se abandonan porque son genéricas',
        'Los patrones se esconden cuando no se registran',
      ],
      questions: [
        '¿Cómo se movió mi ánimo esta semana?',
        '¿Qué tiene que ver la energía en eso?',
        '¿Cuándo fue mejor y qué estaba haciendo?',
        '¿Qué le diría con datos a mi médico?',
      ],
      close: 'Lo que sientes es real, y registrar no lo invalida: lo ordena.',
    },
    transformation: [
      { icon: 'heart', title: 'Le pones nombre a lo que sientes', text: 'Emociones identificadas en minutos, con palabras precisas y sin dramatizar.' },
      { icon: 'chart', title: 'Ves patrones', text: 'La energía, el sueño y el ánimo se ven juntos: ahí aparecen pistas que antes no notas.' },
      { icon: 'message', title: 'La consulta cambia', text: '"Estoy bien, creo" se convierte en datos y preguntas concretas para tu médico.' },
      { icon: 'sun', title: 'Notas avances', text: 'Los días buenos quedan registrados: la mejora también se ve, no solo las batallas.' },
      { icon: 'clipboard', title: 'Sin abrumarte', text: 'Ejercicios de 2-3 minutos, pensados para días en los que hay poca energía.' },
      { icon: 'book', title: 'Estructura, no teoría', text: 'Un diario, no un tratado: se llena, se mira y se cierra.' },
    ],
    includes: {
      title: 'Qué incluye el diario',
      cards: [
        { icon: 'heart', title: 'Registro diario guiado', helps: 'anotar ánimo, energía y contexto en menos de 3 minutos.' },
        { icon: 'list', title: 'Palabras de emociones', helps: 'nombrar lo que sientes con vocabulario que no juzga.' },
        { icon: 'chart', title: 'Tracker semanal', helps: 'ver la semana de un vistazo y encontrar patrones.' },
        { icon: 'message', title: 'Preguntas para consulta', helps: 'llevar lo emocional de forma clara a tu equipo de salud.' },
        { icon: 'sun', title: 'Página de avances', helps: 'guardar los días buenos y lo que funcionó.' },
        { icon: 'book', title: 'Espacio libre', helps: 'anotar lo que no cabe en las casillas cuando aparezca.' },
      ],
    },
    takeaways: [
      'Un registro breve para usar aunque estés agotada.',
      'Tablas visuales para que tu semana se lea de un vistazo.',
      'Preguntas listas para tu consulta: el médico agradece datos.',
      'Un mapa de tus avances que crece semana a semana.',
    ],
    before: [
      'No sé explicar cómo me siento.',
      'Las hojas que empiezo no las mantengo.',
      'Me gana el día bueno y no lo anoto.',
      'Mi ánimo y la energía se sienten como un caos.',
    ],
    after: [
      'Tengo palabras para mis emociones.',
      'Lleno el diario en 3 minutos.',
      'Veo patrones y los llevo a consulta.',
      'Registro avances y no solo bajones.',
    ],
    faqs: PRODUCT_FAQS.diarioHipo,
    related: [
      { to: '/insomnio-tiroides', icon: 'sun', title: 'Insomnio y tiroides', text: 'Si el sueño es parte del problema emocional, esta guía complementa tu registro.' },
      { to: '/atencion-farmaceutica', icon: 'users', title: 'Atención Farmacéutica', text: 'Si la medicación cambió y se nota tu ánimo, conviene revisarlo con un profesional.' },
    ],
    magnet: {
      ...LEAD_MAGNETS.diarioHipo,
      related: { name: 'Diario de Manejo de las Emociones en Hipotiroidismo', url: CHECKOUTS.diarioHipo, cta: 'Ver el diario completo' },
    },
    tablet: {
      tag: 'DIARIO · TRACKER',
      title: 'Mi semana emocional',
      items: ['Energía hoy (baja-media-alta)', 'Emoción principal', '¿Qué la acompaña?', 'Algo bueno de hoy'],
    },
    closing: {
      title: 'Tus emociones también se registran, se ordenan y se cuidan.',
      text: 'Este diario es esa estructura que te hace falta para no llevar el ánimo a la deriva.',
    },
    repeat: {
      one: 'Tres minutos al día te dejan una semana entera de datos.',
      two: 'Empezar hoy el registro es empezar a dar claridad a tus emociones.',
    },
  },

  {
    // ─────────── LANDING 08 · DIARIO EMOCIONES HIPERTIROIDISMO ───────────
    slug: 'diario-emociones-hipertiroidismo',
    id: 'fst-diario-hipertiroidismo',
    name: 'Diario de Manejo de las Emociones en Hipertiroidismo',
    image: '/img/port-diario-hiper.jpg',
    checkoutUrl: CHECKOUTS.diarioHiper,
    stickyLabel: 'OBTENER EL DIARIO',
    seo: {
      title: 'Ansiedad e hipertiroidismo: diario de registro | FST',
      description: 'Registra emociones, energía y descanso con un diario creado para el ritmo acelerado del hipertiroidismo. 1 minuto al día, imprimible y para tu consulta.',
      canonical: 'diario-emociones-hipertiroidismo',
      keywords: ['ansiedad e hipertiroidismo', 'emociones y hipertiroidismo', 'diario de emociones hipertiroidismo', 'graves y ansiedad', 'descanso con hipertiroidismo', 'registro de energía hipertiroidismo'],
    },
    hero: {
      tag: 'Diario · Bienestar emocional',
      h1: 'Con hipertiroidismo, la ansiedad, la prisa y la falta de descanso pueden sentirse como un huracán interno.',
      subtitle: 'Un diario pensado para los ritmos intensos: registros muy breves, preguntas para orientarte y una manera concreta de separar "la tiroides" de "lo que es tuyo".',
      benefits: ['Muy breve de llenar', 'Para ritmos intensos', 'Imprimible'],
      price: priceOf('diarioHiper').price,
      compare: priceOf('diarioHiper').compare,
      cta: 'QUIERO MI DIARIO PARA HIPERTIROIDISMO',
    },
    isForYou: {
      title: 'Este diario puede ser para ti si...',
      items: [
        'te sientes acelerada, irritable o sin calma desde el diagnóstico',
        'el descanso se volvió difícil y la energía parece la de otra persona',
        'no sabes qué es "tu ansiedad" y qué puede explicar la tiroides',
        'te cuesta parar y escribir, necesitas algo de 1 minuto',
        'quieres registrar cómo evolucionas con el tratamiento',
        'necesitas una herramienta para la cita médica que no te exija explicar todo',
      ],
    },
    problem: {
      title: 'El hipertiroidismo puede llenar tus días de tensión: ponerlo en registro la ordena',
      paragraphs: [
        'Cuando la tiroides funciona en exceso, el cuerpo y la mente van rápido: corazón acelerado, pensamientos en fila, sueño esquivo, irritabilidad.',
        'Es muy fácil creer que "así soy ahora" cuando en realidad la curva del tratamiento y las hormonas se mueven y eso se siente.',
        'El registro te permite distinguir momentos, conectar energía-descanso-emoción y hablar de tu caso con datos, no solo con sensaciones.',
      ],
      points: [
        'La ansiedad del hipertiroidismo tiene base real: se comprende',
        'Sin registro, se convierte todo en el mismo presente sin línea',
        'El descanso (o su falta) es un dato que casi nunca se reporta',
        'La evolución se nota mejor si hay algo escrito del comienzo',
      ],
      questions: [
        '¿Cómo fue mi energía y mi ritmo esta semana?',
        '¿Descansé algo? ¿Qué pasó de noche?',
        '¿Qué sensaciones están presentes hoy?',
        '¿Qué conviene contarle a mi médico?',
      ],
      close: 'El registro no apaga la velocidad: la orienta.',
    },
    transformation: [
      { icon: 'clock', title: 'Registros de 1 minuto', text: 'Pensados para cuando hay prisa: se llenan rápido o se dejó para después, sin culpa.' },
      { icon: 'heart', title: 'Separar lo hormonal', text: 'Con la práctica de registro es más fácil ver qué cambia contu tratamiento y qué viene de otra parte.' },
      { icon: 'sun', title: 'Conectar descanso y estado', text: 'Tres columnas (emociones-energía-descanso) muestran la relación que los médicos preguntan.' },
      { icon: 'chart', title: 'Seguir tu línea de tiempo', text: 'Desde el comienzo del tratamiento hasta hoy, notarás patrones que se explican con datos.' },
      { icon: 'message', title: 'Citas con datos', text: 'Síntomas y emociones escritos le dan a tu endocrino el "cómo te ha ido" en serio.' },
      { icon: 'book', title: 'Un recurso tuyo', text: 'Imprimible y rellenable: se adapta a tu día más, no al revés.' },
    ],
    includes: {
      title: 'Qué incluye el diario',
      cards: [
        { icon: 'clock', title: 'Registro exprés diario', helps: 'tomar nota de emociones, energía y descanso en minutos.' },
        { icon: 'heart', title: 'Nombres de emociones', helps: 'encontrar palabras para la ansiedad y las sensaciones físicas.' },
        { icon: 'sun', title: 'Triada: emociones-energía-descanso', helps: 'ver las tres juntas, como las observan los profesionales.' },
        { icon: 'chart', title: 'Línea de semana', helps: 'seguir la evolución entre tu diagnóstico y cada control.' },
        { icon: 'message', title: 'Resumen para la consulta', helps: 'un hoja lista para tu endocrinólogo con lo importante.' },
        { icon: 'book', title: 'Espacio de toma', helps: 'anotar momentos difíciles o cambios de tratamiento.' },
      ],
    },
    takeaways: [
      'Un registro de un minuto para los días a toda velocidad.',
      'La triada emociones-energía-descanso en una sola vista.',
      'Un hoja de consulta que tu endocrino puede leer fácil.',
      'Ver tu evolución escrita, cuando tu sensación dice "nada cambia".',
    ],
    before: [
      'Siento que todo va muy rápido y nada lo puedo ordenar.',
      'No distingo mi ánimo de la tiroides.',
      'Me duerme y no lo registra.',
      'En consulta solo digo "estoy ansiosa".',
    ],
    after: [
      'Dedico 1 minuto y tengo una línea de semana.',
      'Veo relación entre energía, descanso y emociones.',
      'Registro lo que pasa y cómo lo cambio.',
      'Llevo a consulta un documento, no solo palabras.',
    ],
    faqs: PRODUCT_FAQS.diarioHiper,
    related: [
      { to: '/insomnio-tiroides', icon: 'sun', title: 'Insomnio y tiroides', text: 'Si el descanso es tu gran batalla, la guía de sueño es el complemento natural.' },
      { to: '/atencion-farmaceutica', icon: 'users', title: 'Atención Farmacéutica', text: 'Si estás evaluando medicación y suplementos, un espacio individual puede ordenar tus preguntas.' },
    ],
    magnet: {
      ...LEAD_MAGNETS.diarioHiper,
      related: { name: 'Diario de Manejo de las Emociones en Hipertiroidismo', url: CHECKOUTS.diarioHiper, cta: 'Ver el diario completo' },
    },
    tablet: {
      tag: 'DIARIO · TRIADA',
      title: 'Emociones · Energía · Descanso',
      items: ['Hoy mi energía fue…', 'Mi descanso: suficiente / parcial', 'Emoción principal: …', 'Una nota para mí'],
    },
    closing: {
      title: 'La velocidad no se detiene escribiendo, pero deja de ser un huido.',
      text: 'Este diario es el freno suave que te hace falta: 1 minuto al día para no soltarte de la línea.',
    },
    repeat: {
      one: 'Un minuto de registro es la única estructura que cabe en tus días acelera.',
      two: 'Organiza lo que se siente hoy: tu próximo control lo agradecerá.',
    },
  },

  {
    // ─────────── LANDING 09 · PROBIÓTICOS ───────────
    slug: 'probioticos-tiroides',
    id: 'fst-probioticos',
    name: 'Probióticos',
    image: '/img/port-jugosfuncionales.jpg',
    checkoutUrl: CHECKOUTS.probioticos,
    stickyLabel: 'OBTENER LA GUÍA',
    seo: {
      title: 'Probióticos y tiroides: guía para elegir con criterio | FST',
      description: 'Entiende qué son los probióticos, cómo leer etiquetas y qué preguntar antes de usarlos con tu medicación tiroidea. Educación sin promesas de marcas.',
      canonical: 'probioticos-tiroides',
      keywords: ['probióticos y tiroides', 'probióticos y levotiroxina', 'microbiota y tiroides', 'cómo elegir probióticos', 'suplementos y medicación tiroidea', 'salud intestinal tiroidea'],
    },
    hero: {
      tag: 'Guía · Salud digestiva',
      h1: 'Si tienes cien consejos guardados sobre salud intestinal pero todavía no sabes cuáles aplicar, necesitas empezar por organizar la información.',
      subtitle: 'Probióticos es una guía educativa para entender qué son, cómo elegir con criterio y qué preguntas hacerle a tu farmacéutico y a tu médico antes de comprar.',
      benefits: ['Leer etiquetas', 'Criterio de compra', 'Preguntas para tu farmacéutico'],
      price: priceOf('probioticos').price,
      compare: priceOf('probioticos').compare,
      cta: 'QUIERO ENTENDER MEJOR MI MICROBIOTA',
    },
    isForYou: {
      title: 'Esta guía puede ser para ti si...',
      items: [
        'te recomiendan probióticos pero no sabes si te sirven',
        'quieres entender la relación entre la salud digestiva y la tiroidea',
        'te sientes a ciegas en el pasillo de los suplementos',
        'no sabes diferenciar productos de calidad de meras etiquetas',
        'quieres saber cómo hablar de esto con tu farmacéutico',
        'tomas levotiroxina y suplementos y quieres una rutina segura',
      ],
    },
    problem: {
      title: 'El ruido alrededor de los probióticos no te deja decidir',
      paragraphs: [
        'Publicidad, influencers y góndolas: cada uno vende un probiótico con nombres complicados (Lactobacillus, Bifidobacterium…) y promesas amplias.',
        'El tema suena complejo pero no es inaccesible: entender qué son, cómo se presentan, qué evidencia hay y qué condiciones de conservación importa se puede explicar con claridad.',
        'La guía no recomienda marcas: te da el criterio para que CUALQUIER producto que te recomienden lo puedas revisar como educada.',
      ],
      points: [
        'Confundir probiótico, fermentado y etiqueta con efecto mágico',
        'No saber leer unidad (UFC) ni la cepa en la etiqueta',
        'Comprar por una promesa sin base',
        'Nunca preguntar a tu farmacéutico sobre el tema',
      ],
      questions: [
        '¿Qué es exactamente un probiótico?',
        '¿Cómo sé si este producto es de calidad?',
        '¿Puedo combinarlo con mi levotiroxina?',
        '¿Qué le pregunto a mi farmacéutico?',
      ],
      close: 'Antes de comprar un probiótico, lo que hace falta es información bien ordenada.',
    },
    transformation: [
      { icon: 'book', title: 'Entiendes qué es', text: 'Conceptos explicados sin terminología de marketing: qué es una cepa, qué es un probiótico.' },
      { icon: 'clipboard', title: 'Lees etiquetas', text: 'Aprendes a mirar unidad, cepa, conservación y garantía del fabricante.' },
      { icon: 'shield', title: 'Decides con criterio', text: 'Antes de comprar, sabes qué validar y qué es humo.' },
      { icon: 'users', title: 'Preguntas de profesional', text: 'Una lista de preguntas para tu farmacéutico, médico o nutriólogo.' },
      { icon: 'pill', title: 'Levotiroxina y suplementos', text: 'Cuándo y cómo separar la toma: sin inventos, con criterio de horarios.' },
      { icon: 'leaf', title: 'Hábitos básicos', text: 'La microbiota se apoya también con lo cotidiano: ahí también te acompano.' },
    ],
    includes: {
      title: 'Qué incluye la guía',
      cards: [
        { icon: 'book', title: 'Qué es y qué no es un probiótico', helps: 'separar ciencia de marketing desde la primera página.' },
        { icon: 'clipboard', title: 'Cómo leer etiquetas', helps: 'descifrar cepas, dosis y garantías sin hacerte experta.' },
        { icon: 'shield', title: 'Evidencia y límites', helps: 'saber qué está demostrado y qué es exageración.' },
        { icon: 'pill', title: 'Relación con levotiroxina', helps: 'criterios de separación y horarios para tu medicación.' },
        { icon: 'users', title: 'Preguntas para tu farmacéutico', helps: 'una lista lista para tu próximo contacto profesional.' },
        { icon: 'leaf', title: 'Hábitos gastrointestinales', helps: 'pequeños hábitos que sostienen la microbiota.' },
      ],
    },
    takeaways: [
      'Un método para evaluar cualquier producto que te recomienden.',
      'Criterio sobre horarios y separación con tu medicación.',
      'Preguntas preparadas para tu farmacéutico.',
      'Tranquilidad: terminar de leer la guía y saber decidir por tu cuenta.',
    ],
    before: [
      'No distingo un probiótico de un fermentado.',
      'Compro porque me lo vendieron bien.',
      'No sé si peleo con mi medicación.',
      'Nunca pregunto en la farmacia.',
    ],
    after: [
      'Leo la etiqueta y sé qué mirar.',
      'Decido con criterio, sin depender del anuncio.',
      'Separación con la levotiroxina.',
      'Hablo de mi caso con mi farmacéutico.',
    ],
    faqs: PRODUCT_FAQS.probioticos,
    related: [
      { to: '/hashimoto-nutricion', icon: 'leaf', title: 'Nutrir tu tiroides: Hashimoto', text: 'La microbiota y la alimentación van juntas: esta guía organiza tu mesa.' },
      { to: '/coleccion-tiroides', icon: 'book', title: 'Colección de la Tiroides', text: 'Toda la estructura base de autocuidado si quieres el siguiente nivel.' },
    ],
    magnet: {
      ...LEAD_MAGNETS.probioticos,
      related: { name: 'Probióticos', url: CHECKOUTS.probioticos, cta: 'Ver la guía completa' },
    },
    tablet: {
      tag: 'GUÍA · ETIQUETA',
      title: 'Lo que miro en una etiqueta',
      items: ['Cepa identificada', 'Unidades (UFC)', 'Fecha de caducidad', 'Condiciones de conservación'],
    },
    closing: {
      title: 'No necesitas otra recomendación: necesitas entender qué se te está ofreciendo.',
      text: 'Probióticos te da el criterio que te faltó hasta hoy: saber leer antes de comprar.',
    },
    repeat: {
      one: 'Si vas a considerar un probiótico, que sea con criterio.',
      two: 'Tu decisión de hoy merece información real: aquí la encuentras.',
    },
  },

  {
    // ─────────── LANDING 10 · NUTRIR TU TIROIDES: HASHIMOTO ───────────
    slug: 'hashimoto-nutricion',
    id: 'fst-nutrir-hashimoto',
    name: 'Nutrir tu tiroides: Tiroiditis de Hashimoto',
    image: '/img/port-hipotiroidismo.jpg',
    checkoutUrl: CHECKOUTS.hashimoto,
    stickyLabel: 'OBTENER LA GUÍA',
    seo: {
      title: 'Nutrición en Hashimoto: guía educativa | Feliz Sin Tiroides',
      description: 'Organiza tu alimentación con tiroiditis de Hashimoto: qué patrones se recomiendan, cuáles son modas y qué preguntar a tu nutricionista. Sin dietas milagro.',
      canonical: 'hashimoto-nutricion',
      keywords: ['nutrición para tiroiditis de Hashimoto', 'qué comer con Hashimoto', 'alimentación autoinmune tiroidea', 'dieta Hashimoto', 'tiroiditis de Hashimoto y alimentos', 'planificar comidas Hashimoto'],
    },
    hero: {
      tag: 'Guía · Nutrición tiroidea',
      h1: 'Con tiroiditis de Hashimoto, la mesa puede parecer un campo minado de recomendaciones contradictorias.',
      subtitle: 'Nutrir tu tiroides es una guía educativa para construir decisiones alimentarias ordenadas: qué observar, cómo organizar la semana y qué preguntar en tu consulta.',
      benefits: ['Sin listas prohibidas', 'Ideas de comidas', 'Preguntas para nutriólogo'],
      price: priceOf('hashimoto').price,
      compare: priceOf('hashimoto').compare,
      cta: 'QUIERO ACCEDER A NUTRIR TU TIROIDES',
    },
    isForYou: {
      title: 'Esta guía puede ser para ti si...',
      items: [
        'te diagnosticaron tiroiditis de Hashimoto y no sabes qué comer',
        'te dijeron "prohibido" un listado interminable y te agobiaste',
        'quieres organizar comidas sin volverte una planificación que se cae',
        'tienes síntomas digestivos o de inflamación y buscas observarlos',
        'quieres llevar preguntas concretas a tu nutriólogo o médico',
        'buscas educación real y no el "detox" de moda',
      ],
    },
    problem: {
      title: 'Las dietas de moda sobre Hashimoto te roban energía',
      paragraphs: [
        'Hashimoto es una condición autoinmune y el alimento juega un papel de bienestar, pero en los posts se convierte en un sistema de prohibiciones: sin gluten, sin lácteos, sin azúcar… sin contexto.',
        'El resultado no es una alimentación mejor, sino una cabeza llena de miedo y un plato cada vez más pequeño.',
        'La guía está diseñada para lo contrario: que entiendas los conceptos clave, organices una semana variada y sepas qué preguntar antes de restringir.',
      ],
      points: [
        'Las listas de prohibidos sin base te dejan comiendo cada vez menos',
        'No hay (casi nunca) un plan para el diagnóstico autoinmune',
        'Las ideas "antiinflamatorias" se confunden con dietas milagro',
        'Sin preguntas, terminas la consulta sin saber qué comer',
      ],
      questions: [
        '¿Qué evidencia existe sobre alimentación y Hashimoto?',
        '¿Cómo armo una semana sin agotarme?',
        '¿Necesito restringir algo o no?',
        '¿Qué le digo a mi nutriólogo sobre mi caso?',
      ],
      close: 'Comer con Hashimoto no es vivir en negativo: es aprender a elegir.',
    },
    transformation: [
      { icon: 'leaf', title: 'Alimentos con criterio', text: 'Aprender qué nutrientes y alimentos merecen un lugar en tu plato para el bienestar general.' },
      { icon: 'clipboard', title: 'Una semana organizada', text: 'Plantilla y ejemplos para planear comidas sin convertir la cocina en un trabajo.' },
      { icon: 'heart', title: 'Observas síntomas', text: 'Registrar comidas y sensaciones te permite notar relaciones que hoy se pierden.' },
      { icon: 'message', title: 'Preguntas con nutriólogo', text: 'Una lista de preguntas para tu consulta nutricional.' },
      { icon: 'shield', title: 'Restricciones con razón', text: 'Aprender cuándo una restricción está justificada y cuándo es ruido.' },
      { icon: 'book', title: 'Referencia de mesa', text: 'La guía es de consulta diaria, no un PDF que se lee una vez.' },
    ],
    includes: {
      title: 'Qué incluye la guía',
      cards: [
        { icon: 'book', title: 'Conceptos de Hashimoto y nutrición', helps: 'comprender la relación sin falsas promesas.' },
        { icon: 'leaf', title: 'Lista de alimentos a considerar', helps: 'organizar tu despensa con variedad, no con miedo.' },
        { icon: 'clipboard', title: 'Plantilla semanal', helps: 'planear comidas en minutos y sostener el hábito.' },
        { icon: 'heart', title: 'Registro de síntomas y comidas', helps: 'conectar lo que comes con cómo te sientes.' },
        { icon: 'users', title: 'Preguntas para profesionales', helps: 'llegar a la consulta nutricional con dudas claras.' },
        { icon: 'message', title: 'Restricciones con lupa', helps: 'cuándo considerar una y con quién hacerlo.' },
      ],
    },
    takeaways: [
      'Una guía sin listas prohibidas interminables: criterio, no miedo.',
      'Plantillas para organizar la semana de comidas en minutos.',
      'Un registro para ver la relación entre plato y síntomas.',
      'Preguntas para tu nutriólogo, listas.',
    ],
    before: [
      'No sé qué comer desde el diagnóstico.',
      'Las listas prohibidas me abruman.',
      'Como de más de lo mismo por miedo.',
      'No sé qué contarle al nutriólogo.',
    ],
    after: [
      'Eligo con criterio y variedad.',
      'Organizo mi semana sin agonizar.',
      'Observo y registro lo que me pasa.',
      'Llego a consulta con preguntas concretas.',
    ],
    faqs: PRODUCT_FAQS.hashimoto,
    related: [
      { to: '/probioticos-tiroides', icon: 'leaf', title: 'Probióticos y tiroides', text: 'La microbiota se suma a tu mesa: aprende a evaluar suplementos con calma.' },
      { to: '/coleccion-tiroides', icon: 'book', title: 'Colección de la Tiroides', text: 'Integra alimentación, medicación y registro en una sola ruta.' },
    ],
    magnet: {
      ...LEAD_MAGNETS.hashimoto,
      related: { name: 'Nutrir tu tiroides: Tiroiditis de Hashimoto', url: CHECKOUTS.hashimoto, cta: 'Ver la guía completa' },
    },
    tablet: {
      tag: 'GUÍA · SEMANA',
      title: 'Semana organizada',
      items: ['Lunes: menú propuesto', 'Observaciones de hoy', 'Síntomas que noté', 'Pregunta para mi nutriólogo'],
    },
    closing: {
      title: 'Puedes seguir peleando con tu plato… o aprender a elegir.',
      text: 'Nutrir tu tiroides es la guía educativa que te devuelve el criterio y la variedad a la mesa.',
    },
    repeat: {
      one: 'Organizar tu alimentación con educación es el siguiente paso más claro.',
      two: 'Deja de preguntarte por la comida y empieza a organizarla.',
    },
  },
];

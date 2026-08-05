const academyImage = name => `/images/academia/${name}?v=20260804`;
const ebookLink = id => `/feliz-sin-tiroides#fst-product-${id}`;

export const academyEbooks = {
  'fst-coleccion-sana': {
    title: 'Colección Bienestar Tiroideo desde 0',
    description: 'Una ruta de inicio para ordenar conceptos, hábitos y preguntas de seguimiento.',
    image: '/img/port-coleccion.jpg',
    href: ebookLink('fst-coleccion-sana'),
  },
  'fst-comer-hipotiroidismo': {
    title: 'Aprende a comer con hipotiroidismo',
    description: 'Ideas prácticas para organizar comidas variadas sin restricciones extremas.',
    image: '/img/port-hipotiroidismo.jpg',
    href: ebookLink('fst-comer-hipotiroidismo'),
  },
  'fst-dieta-antiinflamatoria': {
    title: 'Alimentación con enfoque antiinflamatorio',
    description: 'Una guía para construir platos diversos y sostenibles con alimentos cotidianos.',
    image: '/img/port-nutricional.jpg',
    href: ebookLink('fst-dieta-antiinflamatoria'),
  },
  'fst-comer-hipertiroidismo': {
    title: 'Aprende a comer con hipertiroidismo y Graves',
    description: 'Orientación educativa para organizar la alimentación junto con el tratamiento indicado.',
    image: '/img/port-hipertiroidismo.jpg',
    href: ebookLink('fst-comer-hipertiroidismo'),
  },
  'fst-controlando-niveles': {
    title: 'Controlando tus niveles',
    description: 'Plantillas para registrar resultados y llegar a la consulta con preguntas más claras.',
    image: '/img/port-pruebas.jpg',
    href: ebookLink('fst-controlando-niveles'),
  },
  'fst-manejo-sintomas': {
    title: 'Guía de manejo y registro de síntomas',
    description: 'Una herramienta para observar cambios sin convertirlos en autodiagnósticos.',
    image: '/img/port-manejodesintomas.jpg',
    href: ebookLink('fst-manejo-sintomas'),
  },
  'fst-vivir-sintiroides': {
    title: 'Guía para vivir sin tiroides',
    description: 'Seguimiento, adherencia y preguntas útiles después de una tiroidectomía.',
    image: '/img/port-vivirsintiroides.jpg',
    href: ebookLink('fst-vivir-sintiroides'),
  },
  'fst-diario-hipotiroidismo': {
    title: 'Diario de emociones para el hipotiroidismo',
    description: 'Registro guiado para conectar emociones, hábitos y conversaciones de cuidado.',
    image: '/img/port-diario-hipo.jpg',
    href: ebookLink('fst-diario-hipotiroidismo'),
  },
  'fst-diario-hipertiroidismo': {
    title: 'Diario de emociones en hipertiroidismo',
    description: 'Un espacio estructurado para registrar experiencias y preparar consultas.',
    image: '/img/port-diario-hiper.jpg',
    href: ebookLink('fst-diario-hipertiroidismo'),
  },
  'fst-jugos-funcionales': {
    title: 'Jugos digestivos funcionales',
    description: 'Recetas de bebidas para variar la alimentación sin atribuirles efectos terapéuticos.',
    image: '/img/port-jugosfuncionales.jpg',
    href: ebookLink('fst-jugos-funcionales'),
  },
  'fst-autocuidado': {
    title: 'Curso de autocuidado de la tiroides',
    description: 'La ruta completa de clases, ejercicios y organización del seguimiento.',
    image: '/img/port-portada.jpg',
    href: ebookLink('fst-autocuidado'),
  },
};

export const academyArticles = {
  levotiroxina: {
    title: 'Cómo tomar levotiroxina correctamente',
    description: 'Horarios, alimentos e interacciones explicados paso a paso.',
    href: '/articulos/como-tomar-levotiroxina-correctamente',
  },
  interacciones: {
    title: 'Alimentos y suplementos que pueden interferir',
    description: 'Calcio, hierro, café, soya, fibra y otros productos dentro de una rutina real.',
    href: '/articulos/alimentos-suplementos-levotiroxina',
  },
  desayunos: {
    title: 'Ideas de desayunos después del tiempo de espera',
    description: 'Opciones sencillas para variar la primera comida del día.',
    href: '/articulos/desayunos-compatibles-levotiroxina',
  },
  almuerzos: {
    title: 'Cinco ideas de almuerzos completos',
    description: 'Combinaciones de vegetales, proteína y granos para organizar la semana.',
    href: '/articulos/almuerzos-antiinflamatorios-hipotiroidismo',
  },
  cenas: {
    title: 'Cenas ligeras y prácticas',
    description: 'Preparaciones fáciles de adaptar a gustos, presupuesto y tolerancia.',
    href: '/articulos/cenas-ligeras-hipotiroidismo',
  },
  menu: {
    title: 'Menú semanal para organizarte',
    description: 'Una plantilla de alimentación que puedes personalizar con tu profesional.',
    href: '/articulos/menu-semanal-hipotiroidismo',
  },
  vivirSinTiroides: {
    title: 'Vivir sin tiroides después de una tiroidectomía',
    description: 'Qué cambia, qué conviene registrar y cuándo consultar.',
    href: '/articulos/vivir-sin-tiroides',
  },
};

const commonSources = [
  {
    label: 'American Thyroid Association: información para pacientes',
    url: 'https://www.thyroid.org/thyroid-information/',
  },
  {
    label: 'MedlinePlus: hipotiroidismo',
    url: 'https://medlineplus.gov/spanish/hypothyroidism.html',
  },
];

const guides = {
  RAUzM80hCO8: {
    label: 'Aprender con intención',
    title: 'Convierte cada clase en una decisión mejor preparada',
    intro: 'El autocuidado no consiste en controlar cada sensación ni en buscar una explicación inmediata. Consiste en aprender a observar, registrar y comunicar información útil para tomar decisiones compartidas con el equipo de salud.',
    image: academyImage('estudio-autocuidado-tiroideo.webp'),
    imageAlt: 'Estudiante adulta tomando notas junto a un modelo educativo de la tiroides',
    sections: [
      {
        title: 'Crea un cuaderno que te ayude a pensar',
        paragraphs: [
          'Divide cada registro en cuatro columnas: qué ocurrió, cuándo ocurrió, qué estaba haciendo y qué pregunta te deja. Esta estructura evita que una observación aislada se convierta en una conclusión apresurada.',
          'Anota también los cambios de marca, horario, alimentación, sueño o medicación indicados por un profesional. La línea de tiempo aporta mucho más que una lista desordenada de síntomas.',
        ],
        bullets: ['Fecha y hora', 'Duración e intensidad aproximada', 'Cambios recientes', 'Pregunta concreta para la próxima consulta'],
      },
      {
        title: 'Usa un ritual de estudio de 20 minutos',
        paragraphs: [
          'Mira el video una vez sin detenerlo. Después lee la clase escrita y selecciona solo tres ideas. Cierra con una acción pequeña: completar una ficha, ordenar un resultado o redactar una pregunta.',
          'No necesitas memorizar nombres de pruebas ni rangos. El objetivo es comprender el propósito de cada elemento y reconocer cuándo necesitas ayuda profesional.',
        ],
      },
      {
        title: 'Ejemplo: de la preocupación a una pregunta útil',
        paragraphs: [
          'Laura nota cansancio y piel más seca durante dos semanas. En lugar de asumir que su dosis está mal, registra el horario, el sueño, la toma del medicamento y otros cambios. Su pregunta final es: “¿Conviene revisar mis controles y mi forma de tomar el medicamento antes de atribuirlo a una sola causa?”.',
        ],
        callout: 'Una buena pregunta abre una conversación. Un autodiagnóstico la cierra demasiado pronto.',
      },
    ],
    checklist: ['Preparé un lugar para mis notas', 'Elegí un horario realista de estudio', 'Separé observaciones de interpretaciones', 'Escribí una pregunta para mi equipo de salud'],
    ebookIds: ['fst-coleccion-sana', 'fst-manejo-sintomas', 'fst-diario-hipotiroidismo'],
    articleIds: ['vivirSinTiroides'],
    sources: commonSources,
  },
  wXWsqg5C9Bo: {
    label: 'Comprender el sistema',
    title: 'Mira la tiroides como parte de una red, no como un órgano aislado',
    intro: 'Las hormonas tiroideas participan en el uso de energía y se relacionan con temperatura, ritmo cardiaco, digestión, músculos, piel y estado de ánimo. Esa amplitud explica por qué los síntomas pueden ser variados y, al mismo tiempo, poco específicos.',
    image: academyImage('estudio-autocuidado-tiroideo.webp'),
    imageAlt: 'Persona estudiando la función tiroidea con un modelo anatómico educativo',
    sections: [
      {
        title: 'Construye un mapa corporal sencillo',
        paragraphs: [
          'Dibuja una silueta y ubica cinco áreas: energía y sueño, corazón y temperatura, digestión, piel y cabello, y emociones. Este mapa no diagnostica; sirve para recordar que una misma sensación puede tener varias explicaciones.',
          'Cuando registres un cambio, añade contexto. Por ejemplo, la piel seca también puede relacionarse con clima, duchas calientes, productos irritantes o condiciones dermatológicas.',
        ],
      },
      {
        title: 'Entiende el circuito de comunicación',
        paragraphs: [
          'La hipófisis produce TSH, una señal que ayuda a regular la actividad de la tiroides. La glándula produce principalmente T4 y una parte se transforma en T3 en distintos tejidos. Los resultados de laboratorio se interpretan como un conjunto y según el contexto clínico.',
        ],
        bullets: ['La TSH es una señal reguladora', 'T4 y T3 son hormonas distintas', 'Los rangos dependen del laboratorio', 'Síntomas y resultados se conversan juntos'],
      },
      {
        title: 'Ejemplo: una señal no cuenta toda la historia',
        paragraphs: [
          'Andrés siente frío con frecuencia. Antes de concluir que tiene hipotiroidismo, revisa si hubo cambios de peso, alimentación, sueño, medicamentos y resultados recientes. Lleva ese contexto a consulta para que el profesional decida qué evaluar.',
        ],
        callout: 'Comprender la red ayuda a evitar dos extremos: ignorar los cambios o atribuirlos todos a la tiroides.',
      },
    ],
    checklist: ['Puedo explicar la función general de la tiroides', 'Distingo TSH de T4 y T3', 'Reconozco que un síntoma tiene varias causas posibles', 'Sé qué contexto llevar a consulta'],
    ebookIds: ['fst-coleccion-sana', 'fst-controlando-niveles', 'fst-manejo-sintomas'],
    articleIds: ['vivirSinTiroides'],
    sources: commonSources,
  },
  xGT7xSUJsKo: {
    label: 'Diferenciar sin etiquetar',
    title: 'Compara patrones sin usar una lista de síntomas como diagnóstico',
    intro: 'Hipotiroidismo e hipertiroidismo describen direcciones distintas de la función tiroidea, pero las experiencias reales no siempre encajan en una tabla perfecta. La evaluación profesional integra antecedentes, examen, pruebas y evolución.',
    image: academyImage('hidratacion-autocuidado-diario.webp'),
    imageAlt: 'Persona organizando hábitos de hidratación y autocuidado diario',
    sections: [
      {
        title: 'Organiza los cambios por sistemas',
        paragraphs: [
          'En hipotiroidismo pueden aparecer cansancio, intolerancia al frío, estreñimiento o piel seca. En hipertiroidismo pueden aparecer palpitaciones, intolerancia al calor, temblor, ansiedad o pérdida de peso. Ninguno de estos datos confirma por sí solo una condición.',
          'Registra frecuencia, intensidad y efecto sobre la vida cotidiana. “Me cansé” es menos útil que “durante diez días necesito descansar después de una actividad que antes toleraba”.',
        ],
      },
      {
        title: 'Incluye piel, cabello y tolerancia al clima',
        paragraphs: [
          'La piel seca puede acompañar al hipotiroidismo, pero también puede deberse a duchas prolongadas, aire seco o productos con fragancia. La sudoración o el calor excesivo también tienen múltiples explicaciones. Cuida la piel mientras se investiga la causa, sin sustituir la evaluación.',
        ],
      },
      {
        title: 'Ejemplo: un registro de siete días',
        paragraphs: [
          'Sofía registra sueño, pulso medido de forma habitual, tolerancia al calor, digestión y cambios de piel. Al notar palpitaciones persistentes y empeoramiento, no espera a completar el registro: contacta a su servicio de salud. El registro acompaña la atención, nunca la retrasa.',
        ],
        callout: 'Dolor de pecho, dificultad para respirar, desmayo, confusión o empeoramiento rápido requieren atención urgente.',
      },
    ],
    checklist: ['Describo cambios con fecha y duración', 'Evito diagnosticarme con listas', 'Sé que la piel seca es inespecífica', 'Reconozco cuándo no debo esperar'],
    ebookIds: ['fst-manejo-sintomas', 'fst-diario-hipotiroidismo', 'fst-diario-hipertiroidismo'],
    articleIds: ['vivirSinTiroides'],
    sources: commonSources,
  },
  AtqzSmGyCSI: {
    label: 'Preparar la consulta',
    title: 'Transforma tus resultados en una conversación ordenada',
    intro: 'Un informe de laboratorio no es una respuesta aislada. La fecha, el rango del laboratorio, el horario de la medicación, el embarazo, otros tratamientos y la razón del control pueden cambiar la interpretación.',
    image: academyImage('organizar-consulta-examenes.webp'),
    imageAlt: 'Documentos de laboratorio, agenda y cuaderno organizados para una consulta',
    sections: [
      {
        title: 'Crea una línea de tiempo, no una colección de capturas',
        paragraphs: [
          'Guarda cada informe completo y registra la fecha de toma. Si el profesional lo solicita, añade dosis prescrita, marca, horario habitual y cambios recientes. No mezcles resultados de laboratorios diferentes sin conservar sus rangos.',
        ],
        bullets: ['Fecha y laboratorio', 'Pruebas solicitadas', 'Rangos impresos', 'Tratamiento indicado en ese momento', 'Próximo control acordado'],
      },
      {
        title: 'Haz tres preguntas que sí ayudan',
        paragraphs: [
          'Pregunta qué objetivo tiene el control, qué cambios ameritan contacto antes de la siguiente cita y cuándo repetir pruebas. Evita pedir una “dosis ideal” basada solo en una cifra sin aportar contexto.',
        ],
      },
      {
        title: 'Ejemplo: dos TSH que no se pueden comparar a ciegas',
        paragraphs: [
          'Camila tiene dos informes de fechas distintas. Entre ambos cambió la marca del medicamento y empezó hierro. En lugar de asumir que el segundo resultado exige aumentar la dosis, lleva el cambio de rutina y pregunta si pudo influir y qué seguimiento corresponde.',
        ],
        callout: 'No ajustes ni suspendas medicamentos por un resultado visto fuera de contexto.',
      },
    ],
    checklist: ['Conservo el informe completo', 'Anoto cambios de medicación y suplementos', 'Llevo una línea de tiempo', 'Tengo tres preguntas para la consulta'],
    ebookIds: ['fst-controlando-niveles', 'fst-manejo-sintomas', 'fst-vivir-sintiroides'],
    articleIds: ['vivirSinTiroides'],
    sources: [
      { label: 'American Thyroid Association: pruebas de función tiroidea', url: 'https://www.thyroid.org/thyroid-function-tests/' },
      { label: 'MedlinePlus: pruebas de la tiroides', url: 'https://medlineplus.gov/spanish/thyroidtests.html' },
    ],
  },
  BMzKMCmNcT0: {
    label: 'Rutina consistente',
    title: 'Diseña una mañana que reduzca olvidos y variaciones',
    intro: 'La levotiroxina suele funcionar mejor cuando se toma de manera consistente y exactamente como fue indicada. El horario, la relación con las comidas y otros productos deben mantenerse o conversarse antes de cambiar.',
    image: academyImage('rutina-medicacion-manana.webp'),
    imageAlt: 'Vaso de agua, reloj y organizador dentro de una rutina de mañana',
    sections: [
      {
        title: 'Ancla la toma a una señal estable',
        paragraphs: [
          'Elige una señal cotidiana compatible con la indicación recibida: la alarma, levantarte o preparar el agua. Deja una tarjeta visible con el siguiente paso, pero conserva el medicamento en su envase y condiciones de almacenamiento recomendadas.',
          'La información de prescripción de varias presentaciones indica tomarla con el estómago vacío entre 30 y 60 minutos antes del desayuno; sigue siempre la indicación de tu producto y de tu profesional.',
        ],
      },
      {
        title: 'Registra cambios, no improvises compensaciones',
        paragraphs: [
          'Si olvidas una dosis, vomitas, cambias de marca o tu rutina se altera, consulta las instrucciones específicas recibidas o pregunta al profesional. No dupliques ni modifiques la dosis por cuenta propia.',
        ],
      },
      {
        title: 'Ejemplo: una mañana con menos fricción',
        paragraphs: [
          'Valentina deja un vaso limpio junto a una nota que dice “revisar rutina”, mantiene el medicamento en su envase y programa el desayuno después del intervalo indicado. En su cuaderno marca si hubo café, suplementos o cambios importantes.',
        ],
        callout: 'La meta no es una rutina perfecta, sino una rutina consistente que puedas explicar.',
      },
    ],
    checklist: ['Conozco la instrucción de mi presentación', 'Uso agua y un horario estable', 'No cambio dosis por cuenta propia', 'Sé a quién consultar si olvido una toma'],
    ebookIds: ['fst-controlando-niveles', 'fst-vivir-sintiroides', 'fst-autocuidado'],
    articleIds: ['levotiroxina', 'desayunos'],
    sources: [
      { label: 'MedlinePlus: levotiroxina', url: 'https://medlineplus.gov/spanish/druginfo/meds/a682461-es.html' },
      { label: 'American Thyroid Association: tratamiento hormonal', url: 'https://www.thyroid.org/faq-thyroid-hormone-treatment/' },
    ],
  },
  'qt0EwrSIe-c': {
    label: 'Horarios e interacciones',
    title: 'Haz visible todo lo que comparte tu horario con la levotiroxina',
    intro: 'Calcio, hierro, antiácidos, algunos medicamentos y ciertos alimentos pueden afectar la absorción. La solución no es prohibir alimentos, sino revisar intervalos y mantener una rutina que el profesional pueda evaluar.',
    image: academyImage('ideas-alimentacion-tres-dias.webp'),
    imageAlt: 'Tres días de ideas de comidas equilibradas organizadas sobre una mesa',
    sections: [
      {
        title: 'Dibuja un reloj de 24 horas',
        paragraphs: [
          'Ubica primero la levotiroxina. Después añade desayuno, café, suplementos, antiácidos y otros medicamentos. Lleva el mapa a farmacia o consulta para confirmar separaciones. Algunas presentaciones indican separar calcio y hierro al menos cuatro horas.',
        ],
      },
      {
        title: 'Evita convertir una interacción en una lista de prohibiciones',
        paragraphs: [
          'Fibra, soya, nueces y otros alimentos pueden formar parte de una alimentación saludable. Lo importante es la consistencia y la conversación clínica cuando su consumo cambia de forma importante. No elimines grupos completos sin una razón individual.',
        ],
      },
      {
        title: 'Ejemplo: el suplemento que no estaba en la lista',
        paragraphs: [
          'Diego dice que no toma otros medicamentos, pero usa un multivitamínico con hierro junto al desayuno. Al incluirlo en el mapa, el químico farmacéutico puede revisar el horario y explicar qué separación aplicar según su tratamiento.',
        ],
        callout: 'Incluye vitaminas, minerales, productos naturales y bebidas habituales cuando revises interacciones.',
      },
    ],
    checklist: ['Mi lista incluye suplementos', 'Anoté café y horarios de comida', 'Confirmé intervalos con un profesional', 'No eliminé alimentos sin indicación'],
    ebookIds: ['fst-comer-hipotiroidismo', 'fst-dieta-antiinflamatoria', 'fst-controlando-niveles'],
    articleIds: ['interacciones', 'desayunos', 'menu'],
    sources: [
      { label: 'MedlinePlus: levotiroxina', url: 'https://medlineplus.gov/spanish/druginfo/meds/a682461-es.html' },
      { label: 'FDA: información de prescripción', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/021924Orig1s021lbl.pdf' },
    ],
  },
  'a1rAY7Fuo-I': {
    label: 'Uso seguro',
    title: 'Acompaña el tratamiento antitiroideo con seguimiento y señales claras',
    intro: 'Los antitiroideos disminuyen la producción de hormonas tiroideas y requieren controles. El medicamento, la dosis, la duración y las pruebas dependen del caso; esta clase sirve para organizar la seguridad, no para elegir un tratamiento.',
    image: academyImage('organizar-consulta-examenes.webp'),
    imageAlt: 'Agenda y documentos organizados para seguimiento médico',
    sections: [
      {
        title: 'Conserva una ficha del tratamiento',
        paragraphs: [
          'Anota nombre, dosis prescrita, fecha de inicio, controles solicitados y canal de contacto. Lleva una lista actualizada de otros medicamentos y suplementos para cada consulta.',
        ],
      },
      {
        title: 'No minimices señales indicadas por tu equipo',
        paragraphs: [
          'Fiebre o dolor de garganta importante durante ciertos antitiroideos puede requerir contacto urgente y evaluación. Color amarillo en piel u ojos, orina oscura, dolor abdominal intenso, dificultad para respirar o empeoramiento rápido también necesitan orientación inmediata.',
          'Sigue el plan de tu prescriptor y el prospecto del medicamento. No esperes una respuesta en comentarios de la academia para una situación urgente.',
        ],
      },
      {
        title: 'Ejemplo: una llamada preparada',
        paragraphs: [
          'Mateo presenta fiebre y dolor de garganta. Tiene a mano el nombre del medicamento, la dosis, la fecha de inicio y el teléfono indicado por su equipo. Contacta al servicio y sigue sus instrucciones, sin suspender o reiniciar por decisión propia.',
        ],
        callout: 'Las señales de alarma cambian la prioridad: primero atención, después registro.',
      },
    ],
    checklist: ['Tengo una ficha del medicamento', 'Conozco el canal para urgencias', 'No modifico el tratamiento por comentarios en línea', 'Llevo mis controles y resultados'],
    ebookIds: ['fst-comer-hipertiroidismo', 'fst-diario-hipertiroidismo', 'fst-controlando-niveles'],
    articleIds: [],
    sources: [
      { label: 'MedlinePlus: metimazol', url: 'https://medlineplus.gov/spanish/druginfo/meds/a682464-es.html' },
      { label: 'American Thyroid Association: hipertiroidismo', url: 'https://www.thyroid.org/hyperthyroidism/' },
    ],
  },
  OZlLNr5semI: {
    label: 'Integrar el autocuidado',
    title: 'Construye un plan semanal que puedas sostener y revisar',
    intro: 'El autocuidado útil combina medicación según prescripción, alimentación suficiente, descanso, movimiento tolerable, cuidado de piel, seguimiento y comunicación. No exige hacerlo todo a la vez.',
    image: academyImage('hidratacion-autocuidado-diario.webp'),
    imageAlt: 'Persona preparando agua, cuaderno y elementos para una rutina cotidiana',
    sections: [
      {
        title: 'Elige tres anclas para tu semana',
        paragraphs: [
          'Selecciona una acción clínica, una cotidiana y una emocional. Por ejemplo: ordenar resultados, preparar dos almuerzos base y reservar diez minutos para registrar cómo te sientes. Tres anclas claras suelen ser más sostenibles que una lista interminable.',
        ],
      },
      {
        title: 'Usa un semáforo de decisiones',
        paragraphs: [
          'Verde: hábitos cotidianos que puedes realizar de forma segura. Amarillo: cambios que conviene consultar, como suplementos, ayunos o una nueva rutina de medicación. Rojo: señales urgentes o empeoramiento importante que requieren atención.',
        ],
      },
      {
        title: 'Ejemplo: una semana realista',
        paragraphs: [
          'Elena programa su medicación según la indicación recibida, prepara vegetales y una proteína para dos días, deja crema sin fragancia junto a la toalla y anota una pregunta para su control. Si una actividad no funciona, la ajusta sin abandonar todo el plan.',
        ],
        callout: 'Un plan de autocuidado se evalúa por su claridad y sostenibilidad, no por su perfección.',
      },
    ],
    checklist: ['Elegí tres anclas semanales', 'Distingo hábitos de decisiones clínicas', 'Tengo un plan para señales urgentes', 'Sé qué recurso consultar después'],
    ebookIds: ['fst-coleccion-sana', 'fst-dieta-antiinflamatoria', 'fst-autocuidado'],
    articleIds: ['menu', 'almuerzos', 'cenas'],
    sources: commonSources,
  },
};

export const threeDayMealIdeas = [
  {
    day: 'Día 1',
    theme: 'Preparar bases',
    meals: [
      ['Desayuno', 'Avena cocida con agua, canela, frutos rojos y huevo. Tómalo después del intervalo indicado para tu medicación.'],
      ['Almuerzo', 'Bowl de quinoa o arroz integral, vegetales asados, garbanzos o pescado y aguacate.'],
      ['Cena', 'Sopa de lentejas con zanahoria, tomate y espinaca; acompaña con pan integral.'],
    ],
    recipe: {
      title: 'Bowl base de vegetales y proteína',
      ingredients: ['1 porción de grano cocido', '2 variedades de vegetales', '1 fuente de proteína', 'Aguacate o aceite de oliva', 'Limón y hierbas'],
      steps: ['Calienta el grano y los vegetales.', 'Añade la proteína elegida.', 'Termina con grasa saludable, limón y hierbas.'],
    },
  },
  {
    day: 'Día 2',
    theme: 'Variar colores',
    meals: [
      ['Desayuno', 'Arepa o tostada integral con huevo, tomate y fruta fresca.'],
      ['Almuerzo', 'Pollo, tofu o fríjoles con batata, brócoli y ensalada de repollo morado.'],
      ['Cena', 'Crema de calabaza y zanahoria con semillas; completa con huevo o legumbres.'],
    ],
    recipe: {
      title: 'Crema rápida de calabaza',
      ingredients: ['Calabaza', 'Zanahoria', 'Cebolla', 'Agua o caldo bajo en sodio', 'Pimienta y hierbas'],
      steps: ['Cocina los vegetales hasta que estén suaves.', 'Licúa con parte del líquido.', 'Sirve con una fuente de proteína aparte o incorporada.'],
    },
  },
  {
    day: 'Día 3',
    theme: 'Aprovechar sobrantes',
    meals: [
      ['Desayuno', 'Tostada integral con aguacate y huevo; añade una pieza de fruta.'],
      ['Almuerzo', 'Ensalada tibia con vegetales, lentejas, arroz del día anterior y aderezo de limón.'],
      ['Cena', 'Pescado al horno o tortitas de garbanzo con verduras salteadas.'],
    ],
    recipe: {
      title: 'Ensalada tibia de aprovechamiento',
      ingredients: ['Vegetales cocidos sobrantes', 'Lentejas o garbanzos', 'Arroz integral o quinoa', 'Hojas verdes', 'Limón y aceite de oliva'],
      steps: ['Calienta vegetales, legumbres y grano.', 'Sirve sobre hojas verdes.', 'Aliña al final y ajusta la textura con agua o limón.'],
    },
  },
];

export const skinCareRoutine = {
  image: academyImage('rutina-piel-seca.webp'),
  imageAlt: 'Rutina suave de hidratación de la piel con productos sin marca',
  morning: [
    'Limpia con agua tibia y un producto suave, sin fragancia, solo donde sea necesario.',
    'Aplica una crema o ungüento sobre la piel ligeramente húmeda; suelen retener más agua que una loción ligera.',
    'Termina con protector solar de amplio espectro, resistente al agua y SPF 30 o superior.',
  ],
  evening: [
    'Limita duchas y baños a unos 5 a 10 minutos y evita el agua muy caliente.',
    'Seca con toques, sin frotar, y aplica la hidratante de inmediato.',
    'En labios o zonas muy secas, una capa fina de petrolato puede ayudar si la toleras.',
  ],
};

export const usefulProducts = [
  {
    icon: 'droplet',
    title: 'Crema o ungüento sin fragancia',
    detail: 'Busca fórmulas sencillas con glicerina, ceramidas o petrolato y prueba primero en una zona pequeña.',
    href: 'https://www.amazon.com/s?k=crema+hidratante+sin+fragancia+ceramidas',
  },
  {
    icon: 'sun',
    title: 'Protector solar SPF 30 o superior',
    detail: 'Elige amplio espectro y una textura que puedas usar todos los días.',
    href: 'https://www.amazon.com/s?k=protector+solar+amplio+espectro+spf+30',
  },
  {
    icon: 'droplet',
    title: 'Botella reutilizable',
    detail: 'Mantener agua visible puede facilitar una hidratación distribuida durante el día.',
    href: 'https://www.amazon.com/s?k=botella+de+agua+reutilizable',
  },
  {
    icon: 'book',
    title: 'Cuaderno de seguimiento',
    detail: 'Úsalo para registrar preguntas, cambios y acuerdos, no para vigilarte de manera constante.',
    href: 'https://www.amazon.com/s?k=libreta+de+seguimiento+salud',
  },
];

export const wellnessSources = [
  {
    label: 'Academia Americana de Dermatología: consejos para piel seca',
    url: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin',
  },
  {
    label: 'USDA MyPlate: variedad de vegetales',
    url: 'https://www.myplate.gov/eat-healthy/vegetables',
  },
  {
    label: 'NIH: información sobre yodo',
    url: 'https://ods.od.nih.gov/factsheets/Iodine-DatosEnEspanol/',
  },
];

export function getAcademyLessonGuide(videoUrl = '') {
  const videoId = Object.keys(guides).find(id => videoUrl.includes(id));
  return videoId ? guides[videoId] : guides.RAUzM80hCO8;
}

export function getAcademyResources(guide, type) {
  if (type === 'ebooks') return (guide?.ebookIds || []).map(id => academyEbooks[id]).filter(Boolean);
  return (guide?.articleIds || []).map(id => academyArticles[id]).filter(Boolean);
}

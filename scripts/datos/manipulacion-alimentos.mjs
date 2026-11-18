/**
 * Contenido del Curso de Manipulación de Alimentos (Edvanta, 18-nov-2026).
 *
 * Lo convierte en migraciones scripts/generar-manipulacion-alimentos.mjs.
 * Fuentes verificadas el 18-nov-2026:
 *  - Resolución 2674 de 2013 del Ministerio de Salud y Protección Social,
 *    arts. 11 (estado de salud), 12 (educación y capacitación), 13 (plan de
 *    capacitación), 14 (prácticas higiénicas) y 26 (plan de saneamiento).
 *  - INVIMA, concepto 2036144 de 2018 (capacitación de al menos 10 horas al
 *    año; el INVIMA no autoriza capacitadores).
 *  - OMS, Manual sobre las cinco claves para la inocuidad de los alimentos
 *    (2007): 70 °C, zona de peligro de 5 a 60 °C, 2 horas, lavado de manos
 *    de al menos 20 segundos.
 *  - Secretaría de Salud de Cali: la capacitación para establecimientos
 *    gastronómicos regidos por la 2674 no requiere autorización; sí la de
 *    expendios de carne, leche cruda, bebidas alcohólicas y vía pública.
 *
 * Revisión pendiente de la dirección académica (Karla Hernández, QF) antes
 * de publicar e indexar.
 */

const RES = 'Resolución 2674 de 2013 del Ministerio de Salud y Protección Social';
const OMS = 'OMS. Manual sobre las cinco claves para la inocuidad de los alimentos. Ginebra: Organización Mundial de la Salud; 2007';
const INVIMA = 'INVIMA. Concepto 2036144 de 2018 sobre capacitación de manipuladores de alimentos';

export const CURSO = {
  title: 'Curso de Manipulación de Alimentos',
  short: 'Curso para manipuladores de alimentos de restaurantes, cafeterías, servicios de alimentación, droguerías con alimentos y la industria: higiene personal, las cinco claves de la OMS, temperaturas seguras, limpieza y desinfección, y lo que exige la Resolución 2674 de 2013 en Colombia.',
  objective: 'Que el participante aplique las prácticas higiénicas, el control de temperaturas y el plan de saneamiento que exige la Resolución 2674 de 2013, y reconozca en su puesto de trabajo los puntos donde un alimento se puede contaminar y cómo evitarlo.',
  audience: 'Manipuladores de alimentos de restaurantes, cafeterías, panaderías, servicios de alimentación hospitalarios y escolares, tiendas y droguerías que venden alimentos, plantas de alimentos, emprendedores que preparan alimentos para la venta y estudiantes del área.',
  outcomes: [
    'Explicar qué es la inocuidad, qué causa una enfermedad transmitida por alimentos y qué exige la Resolución 2674 de 2013 al manipulador.',
    'Aplicar las prácticas higiénicas del artículo 14: lavado de manos, dotación, presentación personal y comportamientos en el área.',
    'Controlar la contaminación cruzada y las temperaturas: cocción a 70 °C y la zona de peligro de 5 a 60 °C.',
    'Ejecutar los programas del plan de saneamiento: limpieza y desinfección, residuos, plagas y agua potable.',
    'Recibir, almacenar y registrar materias primas de forma segura y documentar el autocontrol.',
  ],
  area: 'Calidad',
  category: 'Calidad e inocuidad',
  level: 'basico',
  tags: ['Manipulación de alimentos', 'Inocuidad', 'BPM', 'Resolución 2674 de 2013', 'Higiene'],
  cover: null,
  alcance: `<h2>Alcance del certificado</h2><p>La ${RES} (art. 12) exige que todo manipulador tenga formación en educación sanitaria, principios básicos de Buenas Prácticas de Manufactura y prácticas higiénicas, y que la empresa mantenga un plan de capacitación continuo de al menos 10 horas al año. Cuando la capacitación la da un tercero, este debe demostrar idoneidad técnica y científica. Este curso lo diseña y certifica Edvanta con la dirección académica de una química farmacéutica con experiencia en BPM, y suma <strong>10 horas</strong>.</p><p>El certificado sirve como evidencia de capacitación dentro del plan de la empresa. No reemplaza el <strong>certificado médico de aptitud</strong> (art. 11) ni la capacitación específica del puesto. Algunas secretarías de salud exigen autorización propia para capacitar a manipuladores de expendios de carne, de leche cruda, de bebidas alcohólicas y de alimentos en vía pública: en esos casos, consulta a tu secretaría antes de inscribirte.</p>`,
};

const L = (titulo, minutos, intro, cuerpo, ejemplo, errores, claves, siguiente, fuentes) => ({
  titulo, minutos, intro, cuerpo, ejemplo, errores, claves, siguiente, fuentes,
});

export const UNIDADES = [
  {
    titulo: 'Unidad 1. Inocuidad y lo que exige la norma',
    clases: [
      L('Qué es la inocuidad y por qué un alimento enferma', 40,
        'Qué significa que un alimento sea inocuo, qué son las enfermedades transmitidas por alimentos y los tres tipos de peligro que debes controlar.',
        `<p>Un alimento es <strong>inocuo</strong> cuando no causa daño a quien lo consume, siempre que se prepare y se coma según su uso previsto. La inocuidad no se ve: un plato puede verse, oler y saber bien y aun así estar contaminado. Por eso la manipulación de alimentos se apoya en prácticas que se cumplen siempre, no en la apariencia.</p><h2>Enfermedades transmitidas por alimentos (ETA)</h2><p>Una ETA es la enfermedad que aparece por comer un alimento o beber agua contaminados. Según la OMS, en la mayoría de los casos los síntomas aparecen entre 24 y 72 horas después de comer, lo que hace difícil que la persona relacione su malestar con el alimento. Los síntomas más frecuentes son diarrea, vómito, dolor abdominal y fiebre; en niños pequeños, embarazadas, adultos mayores y personas con defensas bajas pueden ser graves.</p><h2>Los tres tipos de peligro</h2><ul><li><strong>Biológicos:</strong> bacterias, virus y parásitos. Son la causa más frecuente de ETA y se multiplican cuando el alimento pasa tiempo a temperatura ambiente.</li><li><strong>Químicos:</strong> restos de productos de limpieza, plaguicidas, alérgenos no declarados o metales.</li><li><strong>Físicos:</strong> pelos, vidrio, astillas, grapas, joyas o fragmentos de empaque.</li></ul><h2>Dónde entras tú</h2><p>La mayoría de esos peligros llega al alimento a través de las manos, los utensilios, las superficies, el agua o el tiempo y la temperatura mal controlados. El manipulador es la última barrera antes del consumidor: cada práctica de este curso corta una vía de contaminación.</p>`,
        '<p>En una cafetería se preparan sándwiches de pollo a las 7 a. m. y se exhiben en la vitrina sin refrigeración hasta el mediodía. Se ven y huelen bien. Al día siguiente, varios clientes reportan diarrea. El problema no fue el sabor ni el aspecto: fue el tiempo a temperatura ambiente, que permitió que las bacterias se multiplicaran.</p>',
        ['Juzgar la inocuidad por el olor, el color o el sabor.', 'Pensar que solo importan las bacterias y olvidar los peligros químicos y físicos.', 'Creer que una ETA siempre aparece minutos después de comer.'],
        ['Inocuo significa que no causa daño, y no se reconoce a simple vista.', 'Los peligros son biológicos, químicos y físicos.', 'El manipulador es la última barrera antes del consumidor.'],
        'En la clase 1.2 verás qué te exige la Resolución 2674 de 2013 como manipulador.',
        [OMS]),
      L('La Resolución 2674 de 2013: obligaciones del manipulador y de la empresa', 40,
        'Qué es la Resolución 2674 de 2013, qué artículos te aplican directamente y qué debe tener la empresa donde trabajas.',
        `<p>La ${RES} establece los requisitos sanitarios para quienes fabrican, procesan, preparan, envasan, almacenan, transportan, distribuyen y comercializan alimentos en Colombia. Para el manipulador, los artículos más importantes son el 11, el 12, el 13 y el 14.</p><h2>Artículo 11: estado de salud</h2><p>Exige un certificado médico de aptitud para manipular alimentos, con examen al menos una vez al año, y examen adicional cuando haya razones clínicas o epidemiológicas. Lo verás a fondo en la clase 1.3.</p><h2>Artículo 12: educación y capacitación</h2><ul><li>Todo manipulador debe tener formación en educación sanitaria, principios básicos de Buenas Prácticas de Manufactura (BPM) y prácticas higiénicas, más la capacitación específica de su puesto.</li><li>La empresa debe tener un plan de capacitación continuo y permanente desde la contratación, de <strong>al menos 10 horas al año</strong>.</li><li>La responsabilidad es de la empresa: puede capacitar directamente, con terceros o con las autoridades sanitarias. Si lo hace un tercero, este debe demostrar idoneidad técnica y científica y experiencia en higiene de alimentos, BPM y sistemas de inocuidad.</li></ul><h2>Artículo 13: plan de capacitación</h2><p>El plan debe tener metodología, duración, docentes, cronograma y temas, ajustados al tipo de establecimiento. La empresa debe demostrar que la capacitación funciona con el desempeño de los operarios y la condición sanitaria del lugar. Además, el manipulador debe conocer los puntos de control a su cargo, cómo vigilarlos, sus límites y qué hacer si algo se sale del límite.</p><h2>Artículo 14: prácticas higiénicas</h2><p>Es la lista de lo que haces todos los días: lavado de manos, dotación, cabello cubierto, uñas, joyas, calzado, guantes y comportamientos prohibidos. Es el tema de la unidad 2.</p><h2>¿Quién vigila?</h2><p>Las secretarías de salud verifican en sus visitas que exista el plan de capacitación, sus evidencias y la idoneidad de quien capacita. El INVIMA aclaró en su concepto 2036144 de 2018 que no autoriza capacitadores; algunas secretarías sí exigen autorización para sectores específicos, como expendios de carne, leche cruda, bebidas alcohólicas o alimentos en vía pública.</p>`,
        '<p>En la visita de la secretaría de salud a un restaurante, el inspector pide el plan de capacitación. El administrador muestra certificados de los cocineros, pero no un plan con cronograma ni registros de asistencia. El hallazgo no es «falta de certificados»: es que la empresa no puede demostrar un plan continuo de al menos 10 horas al año, como pide el artículo 12.</p>',
        ['Creer que el curso es responsabilidad solo del manipulador: el plan es de la empresa.', 'Pensar que un certificado de capacitación reemplaza el certificado médico.', 'Asumir que un solo curso cubre la capacitación de todos los años.'],
        ['Los artículos 11 a 14 de la 2674 son los que más te aplican.', 'El plan de capacitación es de la empresa y suma al menos 10 horas al año.', 'Quien capacita debe demostrar idoneidad técnica y científica.'],
        'En la clase 1.3 verás el estado de salud del manipulador y cuándo debe retirarse de la manipulación.',
        [RES, INVIMA]),
      L('Estado de salud del manipulador', 40,
        'El certificado médico de aptitud, su periodicidad y las situaciones en las que el manipulador debe retirarse de la manipulación directa.',
        `<p>Una persona enferma puede contaminar los alimentos aunque no tenga síntomas graves. Por eso el artículo 11 de la ${RES} pone el estado de salud como primera condición para manipular alimentos.</p><h2>Lo que exige el artículo 11</h2><ol><li><strong>Certificado médico de aptitud:</strong> debe indicar si la persona es apta o no para manipular alimentos. La empresa organiza el examen <strong>al menos una vez al año</strong>.</li><li><strong>Examen adicional:</strong> cuando haya razones clínicas o epidemiológicas, en especial después de una ausencia por una infección que pueda dejar secuelas. El médico puede pedir pruebas de laboratorio.</li><li><strong>Tratamientos:</strong> la empresa debe asegurar que se cumplan; al terminar, el médico emite un nuevo certificado.</li><li><strong>Retiro preventivo:</strong> la empresa debe impedir que manipulen alimentos personas con enfermedades transmisibles por alimentos, portadores, personas con heridas o irritaciones de la piel infectadas o con diarrea.</li></ol><h2>Tu responsabilidad</h2><p>El mismo artículo dice que el manipulador que presente ese riesgo debe informarlo a la empresa. Avisar a tiempo no es una falta: es lo que la norma espera de ti.</p><h2>Señales para avisar</h2><ul><li>Diarrea, vómito o fiebre.</li><li>Heridas, quemaduras o infecciones en manos, brazos o cara.</li><li>Secreción de oídos, ojos o nariz.</li><li>Un diagnóstico de una enfermedad que se transmite por alimentos.</li></ul><p>Mientras dure, la empresa puede asignarte tareas sin contacto directo con alimentos.</p>`,
        '<p>Un panadero tiene una cortada infectada en un dedo y decide trabajar con guante «para no perder el turno». La 2674 lo excluye de la manipulación directa mientras la herida esté infectada: el guante no reemplaza esa medida. Al informarlo, el supervisor lo reasigna a la caja hasta que sane.</p>',
        ['Ocultar una diarrea o una herida por miedo a perder el turno.', 'Creer que el certificado médico vale para siempre.', 'Pensar que un guante resuelve una herida infectada.'],
        ['El certificado médico de aptitud se renueva al menos una vez al año.', 'Diarrea, heridas infectadas o enfermedades transmisibles excluyen de la manipulación directa.', 'El manipulador debe avisar a la empresa.'],
        'En la unidad 2 trabajarás las prácticas higiénicas, empezando por el lavado de manos.',
        [RES]),
    ],
  },
  {
    titulo: 'Unidad 2. Higiene personal y prácticas higiénicas',
    clases: [
      L('Lavado de manos: cuándo y cómo', 40,
        'Los momentos en que debes lavarte las manos y la técnica correcta, según la Resolución 2674 de 2013 y la OMS.',
        `<p>Las manos son el vehículo más frecuente de contaminación. La OMS recuerda que los microorganismos peligrosos están en el suelo, el agua, los animales y las personas, y que el menor contacto puede transferirlos a los alimentos.</p><h2>Cuándo lavarte las manos</h2><p>El numeral 4 del artículo 14 de la ${RES} exige lavarse las manos con agua y jabón desinfectante <strong>al iniciar labores</strong>, <strong>cada vez que salgas y regreses al área</strong> y <strong>después de manipular cualquier material que pueda contaminar</strong>. La OMS agrega momentos concretos:</p><ul><li>Antes de manipular alimentos y con frecuencia durante la preparación.</li><li>Después de ir al baño.</li><li>Después de manipular carnes rojas, aves o pescado crudos.</li><li>Después de sonarte la nariz, tocar basura o manipular productos de limpieza.</li><li>Después de fumar o de tocar animales.</li></ul><h2>Cómo lavarlas</h2><ol><li>Mójalas con agua corriente.</li><li>Enjabónalas durante <strong>al menos 20 segundos</strong>.</li><li>No olvides las yemas de los dedos, las uñas, los pulgares, las muñecas y los espacios entre los dedos.</li><li>Enjuágalas con agua corriente.</li><li>Sécalas por completo con toalla limpia, de preferencia de papel desechable.</li></ol><p>Cuando el riesgo del proceso lo justifique, la norma exige además desinfectarlas.</p>`,
        '<p>Una auxiliar de cocina pela papas, saca la basura y vuelve a armar ensaladas sin lavarse las manos «porque no tocó carne cruda». La basura es material contaminante: el numeral 4 le exige lavarse antes de volver a tocar alimentos listos para consumo.</p>',
        ['Lavarse solo con agua o en menos de 20 segundos.', 'Secarse en el delantal o en un trapo de uso general.', 'Usar gel en lugar del lavado cuando las manos están visiblemente sucias.'],
        ['Lávate al empezar, al volver al área y después de tocar algo que contamine.', 'Mínimo 20 segundos con jabón, sin olvidar uñas, pulgares y muñecas.', 'Seca con toalla limpia, de preferencia desechable.'],
        'En la clase 2.2 revisarás la dotación y la presentación personal.',
        [RES, OMS]),
      L('Dotación y presentación personal', 40,
        'Cómo debe ser la ropa de trabajo, el calzado y la presentación personal del manipulador según el artículo 14.',
        `<p>La dotación protege el alimento de ti, no a ti del alimento. Por eso la ${RES} es tan precisa sobre cómo debe ser.</p><h2>Vestimenta de trabajo (numerales 2 y 3)</h2><ul><li>De color claro, para que se vea la suciedad; no se permiten grises ni tonos que la oculten.</li><li>Con cierres o broches en lugar de botones, que pueden caer al alimento.</li><li>Sin bolsillos por encima de la cintura.</li><li>Con delantal bien atado.</li><li>La empresa debe entregarla en cantidad suficiente.</li><li>No se sale ni se entra al establecimiento con la vestimenta de trabajo.</li></ul><h2>Cabello y cara (numeral 5)</h2><p>El cabello va totalmente cubierto; la barba, el bigote y las patillas, con cubiertas. No se usa maquillaje.</p><h2>Manos y accesorios (numerales 7 y 8)</h2><ul><li>Uñas cortas, limpias y sin esmalte.</li><li>Sin reloj, anillos, aretes ni joyas durante el trabajo.</li><li>Las gafas se sujetan a la cabeza con bandas o medios ajustables.</li></ul><h2>Calzado (numeral 9)</h2><p>Cerrado, resistente, impermeable y de tacón bajo.</p>`,
        '<p>Un mesero que también arma bebidas llega con camiseta negra, reloj y el gorro en el bolsillo. Tres faltas al artículo 14: color oscuro, joyas y cabello sin cubrir. Antes de entrar al área se cambia, guarda el reloj y se pone el gorro.</p>',
        ['Usar la dotación en la calle o en el transporte.', 'Dejar mechones de cabello por fuera del gorro.', 'Pensar que una argolla de matrimonio es la excepción.'],
        ['Ropa clara, sin botones ni bolsillos arriba de la cintura, y que no sale del establecimiento.', 'Cabello y barba cubiertos, sin maquillaje.', 'Uñas cortas sin esmalte, sin joyas y con calzado cerrado e impermeable.'],
        'En la clase 2.3 verás los guantes, el tapabocas y los comportamientos prohibidos.',
        [RES]),
      L('Guantes, tapabocas y comportamientos prohibidos', 40,
        'Cuándo usar guantes y tapabocas, qué no se puede hacer en el área de manipulación y cómo deben comportarse los visitantes.',
        `<p>Los elementos de protección ayudan, pero solo si se usan bien. La ${RES} lo deja claro en el artículo 14.</p><h2>Guantes (numeral 10)</h2><p>Si se usan, deben estar limpios y sin roturas, y recibir el mismo cuidado que las manos. <strong>Usar guantes no reemplaza el lavado de manos.</strong> Un guante que tocó dinero, el celular o carne cruda contamina igual que una mano sucia: se cambia.</p><h2>Tapabocas (numeral 6)</h2><p>Se usa tapabocas desechable cuando el riesgo lo exija, en especial en las etapas finales de alimentos listos para consumo de riesgo alto o medio, como ensaladas, postres o alimentos que no se van a cocinar de nuevo.</p><h2>Lo que está prohibido (numerales 11 y 13)</h2><ul><li>Comer, beber, masticar chicle, fumar o escupir en las áreas de manipulación.</li><li>Sentarse, acostarse o inclinarse en lugares donde la ropa se pueda contaminar, como el pasto o el andén.</li></ul><h2>Exclusión y visitantes (numerales 12 y 14)</h2><p>Quien tenga afecciones de la piel o una enfermedad infectocontagiosa se excluye de la manipulación directa. Los visitantes cumplen las mismas prácticas y usan la vestimenta que entrega la empresa.</p>`,
        '<p>Una cajera de una panadería cobra con guantes y, con los mismos guantes, entrega pan sin empacar. El guante no protegió nada: el dinero lo contaminó. La solución es separar funciones o cambiarse los guantes y lavarse las manos entre una tarea y otra.</p>',
        ['Usar el mismo par de guantes para tareas distintas.', 'Bajarse el tapabocas para hablar o dejarlo en el cuello.', 'Comer o tomar tinto en la mesa de preparación.'],
        ['El guante no reemplaza el lavado de manos y se cambia al cambiar de tarea.', 'El tapabocas es clave en alimentos listos para consumo.', 'En el área no se come, ni se bebe, ni se fuma, ni se escupe.'],
        'En la unidad 3 aplicarás las cinco claves de la OMS, empezando por separar crudos y cocinados.',
        [RES]),
    ],
  },
  {
    titulo: 'Unidad 3. Las cinco claves y el control de temperaturas',
    clases: [
      L('Separe crudos y cocinados: la contaminación cruzada', 40,
        'Qué es la contaminación cruzada, por qué los alimentos crudos son el mayor riesgo y cómo separarlos en todas las etapas.',
        `<p>La OMS resume la inocuidad en cinco claves: <strong>mantenga la limpieza; separe alimentos crudos y cocinados; cocine completamente; mantenga los alimentos a temperaturas seguras; use agua y materias primas seguras.</strong> Esta clase trabaja la segunda.</p><h2>Qué es la contaminación cruzada</h2><p>Es el paso de microorganismos de un alimento crudo, o de sus jugos, a un alimento listo para consumo, directamente o a través de manos, tablas, cuchillos, paños o superficies. La carne roja, las aves y el pescado crudos pueden traer microorganismos peligrosos; si sus jugos caen sobre una ensalada, esa ensalada ya no se va a cocinar.</p><h2>Cómo separar</h2><ul><li>Guarda las carnes, aves y pescados crudos separados de los demás alimentos y en recipientes cerrados.</li><li>En la nevera, lo crudo va abajo y lo listo para consumo arriba, para que ningún jugo gotee.</li><li>Usa tablas y cuchillos diferentes para crudos y para cocinados; si se usa la misma tabla, lávala y desinféctala antes de cambiar. La OMS advierte que no basta con que la tabla «parezca limpia».</li><li>Lávate las manos después de manipular crudos.</li><li>Separa también en la recepción, el transporte y la exhibición.</li></ul>`,
        '<p>En un casino de alimentación hospitalario, el pollo crudo se descongela en la parte alta de la nevera y gotea sobre la gelatina del almuerzo. Los pacientes son el grupo de mayor riesgo. La corrección: pollo en recipiente cerrado en la parte baja y gelatina tapada arriba.</p>',
        ['Usar la misma tabla para pollo crudo y para picar verduras de la ensalada.', 'Poner la carne cruda encima de los alimentos listos en la nevera.', 'Limpiar con el mismo paño las superficies de crudos y de cocinados.'],
        ['La contaminación cruzada va de lo crudo a lo listo para consumo.', 'En la nevera, crudo abajo y listo arriba, siempre tapado.', 'Tablas y cuchillos separados, o lavados y desinfectados entre usos.'],
        'En la clase 3.2 verás cómo cocinar y recalentar para que el alimento sea seguro.',
        [OMS]),
      L('Cocine completamente: 70 °C y el recalentado', 40,
        'Por qué la temperatura interna es la que cuenta, cómo usar el termómetro y cómo recalentar sin riesgo.',
        `<p>La cocción correcta mata casi todos los microorganismos peligrosos. El manual de la OMS indica que los alimentos deben alcanzar <strong>70 °C</strong> en su interior y que esa temperatura mata incluso concentraciones altas de microorganismos en 30 segundos.</p><h2>Lo que más hay que vigilar</h2><p>Las carnes rojas, las aves, los huevos y el pescado. En sopas y guisos, hiérvelos para asegurar que alcanzaron los 70 °C. En carnes, los jugos deben salir claros, no rosados; en piezas grandes y en aves, la forma segura de saberlo es el termómetro.</p><h2>Cómo usar el termómetro</h2><ol><li>Introdúcelo en la parte más gruesa de la pieza, sin tocar el hueso.</li><li>Espera a que la lectura se estabilice.</li><li>Lávalo y desinféctalo entre un alimento y otro.</li><li>Registra la lectura si tu establecimiento lleva control de temperaturas.</li></ol><h2>Recalentar</h2><p>Recalienta los alimentos cocinados hasta que estén completamente calientes en todo su volumen. Recalentar a medias no destruye lo que se multiplicó durante el almacenamiento.</p>`,
        '<p>Un restaurante de comidas rápidas prepara pollo apanado en tandas grandes. Por la presión del almuerzo, saca las piezas cuando el apanado se ve dorado. El termómetro muestra que el centro de las más gruesas no llega a 70 °C. La solución es ajustar el tiempo por tamaño de pieza y verificar con termómetro, no con el color.</p>',
        ['Juzgar la cocción por el color externo del alimento.', 'Medir en la parte más delgada de la pieza.', 'Usar el mismo termómetro sin lavarlo entre crudo y cocinado.'],
        ['El interior del alimento debe llegar a 70 °C.', 'El termómetro va en la parte más gruesa, sin tocar el hueso.', 'Recalentar es calentar por completo, no tibiar.'],
        'En la clase 3.3 verás la zona de peligro y cómo mantener los alimentos a temperaturas seguras.',
        [OMS]),
      L('Temperaturas seguras: la zona de peligro', 40,
        'La zona de peligro de 5 a 60 °C, la regla de las 2 horas, la refrigeración y la descongelación segura.',
        `<p>Los microorganismos se multiplican con gran rapidez entre <strong>5 °C y 60 °C</strong>: la OMS la llama <strong>zona de peligro</strong>. Por debajo de 5 °C o por encima de 60 °C el crecimiento se frena o se detiene, aunque algunos microorganismos aún crecen por debajo de 5 °C.</p><h2>Las reglas de la OMS</h2><ul><li>No dejes alimentos cocinados a temperatura ambiente más de <strong>2 horas</strong>.</li><li>Refrigera lo antes posible los alimentos cocinados y perecederos, de preferencia <strong>por debajo de 5 °C</strong>.</li><li>Mantén la comida caliente a <strong>más de 60 °C</strong> antes de servirla.</li><li>No guardes alimentos mucho tiempo, aunque estén en la nevera.</li><li><strong>No descongeles a temperatura ambiente.</strong> Hazlo en la nevera o en un lugar fresco. Si usas el microondas, cocina el alimento de inmediato, porque puede dejar zonas tibias donde crecen microorganismos.</li></ul><h2>En la práctica</h2><ul><li>Revisa y registra la temperatura de neveras y baños de María en cada turno.</li><li>Divide las preparaciones grandes en recipientes poco profundos para que se enfríen rápido.</li><li>No llenes la nevera hasta el tope: el aire frío necesita circular.</li></ul>`,
        '<p>En un servicio de catering, el arroz con pollo se cocina a las 9 a. m. y se transporta sin conservar el calor para servir a la 1 p. m. Pasan 4 horas en la zona de peligro. La corrección: mantenerlo por encima de 60 °C en contenedores térmicos o enfriarlo rápido y recalentarlo por completo antes de servir.</p>',
        ['Dejar la olla enfriando toda la noche sobre el mesón.', 'Descongelar la carne en el lavaplatos o al aire libre.', 'Llenar la nevera sin dejar circular el aire.'],
        ['La zona de peligro va de 5 a 60 °C.', 'Máximo 2 horas a temperatura ambiente para alimentos cocinados.', 'Frío por debajo de 5 °C, caliente por encima de 60 °C, y nunca descongelar a temperatura ambiente.'],
        'En la unidad 4 trabajarás el plan de saneamiento, empezando por la limpieza y la desinfección.',
        [OMS]),
    ],
  },
  {
    titulo: 'Unidad 4. Plan de saneamiento',
    clases: [
      L('Limpieza y desinfección', 40,
        'La diferencia entre limpiar y desinfectar, los pasos del procedimiento y lo que debe tener por escrito el programa.',
        `<p>El artículo 26 de la ${RES} exige que todo establecimiento tenga un <strong>plan de saneamiento</strong> escrito, disponible para la autoridad sanitaria, con procedimientos, cronogramas, registros, listas de chequeo y responsables. Tiene cuatro programas: limpieza y desinfección, residuos sólidos, control de plagas y agua potable.</p><h2>Limpiar no es lo mismo que desinfectar</h2><ul><li><strong>Limpiar</strong> es retirar la suciedad visible: grasa, restos de comida y polvo.</li><li><strong>Desinfectar</strong> es reducir los microorganismos a un nivel seguro con un agente químico o con calor.</li></ul><p>Desinfectar sobre una superficie sucia no funciona: la suciedad protege a los microorganismos. Primero se limpia y después se desinfecta.</p><h2>Los pasos</h2><ol><li>Retirar los residuos gruesos.</li><li>Lavar con agua y detergente.</li><li>Enjuagar.</li><li>Desinfectar con el agente, la concentración y el tiempo de contacto definidos.</li><li>Enjuagar si el producto lo exige y dejar secar.</li></ol><h2>Lo que exige la norma por escrito</h2><p>El programa debe indicar los agentes y sustancias, sus <strong>concentraciones</strong>, los <strong>tiempos de contacto</strong>, los equipos e implementos y la periodicidad. La concentración y el tiempo de contacto se toman de la ficha técnica del desinfectante: no se calculan «a ojo».</p>`,
        '<p>En una cafetería escolar, la tabla de picar se «desinfecta» echándole cloro directamente, sin lavarla antes, y se usa de inmediato. Quedan restos de comida y no se respetó el tiempo de contacto. La corrección: lavar con detergente, enjuagar, aplicar el desinfectante a la concentración de la ficha técnica, esperar el tiempo indicado y dejar secar.</p>',
        ['Mezclar productos de limpieza, como cloro con amoníaco.', 'Desinfectar sin limpiar primero.', 'Diluir el desinfectante sin medir.'],
        ['Primero se limpia y luego se desinfecta.', 'Agente, concentración, tiempo de contacto y frecuencia van por escrito.', 'La dilución sale de la ficha técnica del producto.'],
        'En la clase 4.2 verás el manejo de residuos y el control de plagas.',
        [RES]),
      L('Residuos sólidos y control integrado de plagas', 40,
        'Cómo manejar los residuos para que no contaminen y por qué el control de plagas empieza por la prevención.',
        `<p>Los residuos y las plagas son dos de los cuatro programas del plan de saneamiento del artículo 26 de la ${RES}.</p><h2>Residuos sólidos</h2><p>El establecimiento debe tener la infraestructura y los procedimientos para recolectar, manejar, almacenar, transportar y disponer los residuos <strong>sin contaminar los alimentos ni el ambiente</strong>. En la práctica:</p><ul><li>Canecas con tapa y pedal, identificadas y separadas del área de preparación.</li><li>Bolsas que se cambian antes de llenarse.</li><li>Retiro frecuente del área de manipulación.</li><li>Un sitio de almacenamiento temporal limpio, cerrado y alejado de los alimentos.</li><li>Lavado de manos después de manipular residuos.</li></ul><h2>Control integrado de plagas</h2><p>La norma pide un programa de control integral con énfasis en medidas radicales y preventivas. Fumigar es la última línea, no la primera. Lo primero es no dejar entrada, ni agua, ni comida ni refugio a las plagas:</p><ul><li>Mallas en ventanas, rejillas en desagües y puertas que cierren bien.</li><li>Alimentos almacenados en recipientes cerrados y separados del piso y de las paredes.</li><li>Limpieza que no deje restos de comida.</li><li>Inspección y registro de señales: excrementos, roeduras, insectos.</li></ul><p>Si se usan plaguicidas, deben aplicarlos personas o empresas autorizadas, sin exponer los alimentos.</p>`,
        '<p>En una panadería aparecen excrementos de roedor detrás de los costales de harina, que están contra la pared y en el piso. Además de llamar a la empresa de control, la panadería sube los costales a estibas, los separa de la pared, sella un hueco detrás del horno y registra las inspecciones semanales.</p>',
        ['Dejar la caneca destapada junto a la mesa de preparación.', 'Fumigar con los alimentos expuestos.', 'Apoyar costales y cajas directamente en el piso o contra la pared.'],
        ['Los residuos se manejan sin contaminar los alimentos y se retiran con frecuencia.', 'El control de plagas empieza por la prevención: sin entrada, agua, comida ni refugio.', 'Los plaguicidas los aplica personal autorizado.'],
        'En la clase 4.3 verás el agua potable y las materias primas seguras.',
        [RES]),
      L('Agua potable y materias primas seguras', 40,
        'La quinta clave de la OMS y el programa de agua potable del plan de saneamiento.',
        `<p>La quinta clave de la OMS es <strong>usar agua y materias primas seguras</strong>. El agua es un ingrediente, aunque no se vea.</p><h2>Dónde se usa el agua</h2><p>La OMS recuerda que se necesita agua segura para lavar frutas y verduras, agregarla a los alimentos, preparar bebidas, hacer hielo, limpiar utensilios y lavarse las manos. El hielo hecho con agua no potable contamina una bebida que, por lo demás, era segura.</p><h2>El programa de agua potable</h2><p>El artículo 26 de la ${RES} exige documentar la fuente del agua, los tratamientos, el almacenamiento, la distribución, el mantenimiento, la limpieza de redes y tanques, y los controles fisicoquímicos y microbiológicos, con sus registros. En la práctica:</p><ul><li>Lava y desinfecta los tanques con la frecuencia que fije el programa y regístralo.</li><li>Mantén los tanques tapados.</li><li>Conserva los resultados de los análisis del agua.</li></ul><h2>Materias primas seguras</h2><ul><li>Compra a proveedores confiables y con registro o notificación sanitaria cuando aplique.</li><li>No uses alimentos vencidos ni con empaques dañados.</li><li>Lava frutas y verduras, sobre todo las que se comen crudas.</li></ul>`,
        '<p>Un puesto de jugos en un centro comercial usa hielo comprado sin rótulo y llena el tanque de agua sin registro de limpieza. En la visita sanitaria, el hallazgo es doble: materia prima sin trazabilidad y un programa de agua sin evidencia. La corrección: hielo de proveedor identificado y registro del lavado de tanques.</p>',
        ['Hacer hielo con agua que no es potable.', 'Comprar materias primas sin rótulo ni proveedor identificado.', 'Lavar el tanque sin dejar registro.'],
        ['El agua segura se necesita también para el hielo y para lavar.', 'El programa de agua potable documenta fuente, tratamiento, limpieza de tanques y análisis.', 'Las materias primas vienen de proveedores confiables y con rótulo.'],
        'En la unidad 5 verás la recepción, el almacenamiento y los registros.',
        [RES, OMS]),
    ],
  },
  {
    titulo: 'Unidad 5. Recepción, almacenamiento y registros',
    clases: [
      L('Recepción de materias primas', 40,
        'Qué revisar cuando llega un pedido y cuándo rechazarlo.',
        `<p>La recepción es el primer punto de control: lo que entra contaminado o fuera de temperatura contamina todo lo que toca. Revisar bien un pedido toma minutos; un brote, mucho más.</p><h2>Qué revisar</h2><ul><li><strong>Rótulo:</strong> nombre del producto, lote, fecha de vencimiento y fabricante. Sin rótulo, no hay trazabilidad.</li><li><strong>Fecha de vencimiento:</strong> no se recibe un producto vencido ni próximo a vencer si no se va a usar a tiempo.</li><li><strong>Empaque:</strong> íntegro, limpio, sin abolladuras graves, rotos o hinchazones.</li><li><strong>Temperatura:</strong> los refrigerados deben llegar fríos y los congelados, duros. Mide con termómetro y regístralo.</li><li><strong>Características:</strong> color, olor y textura propios del alimento.</li><li><strong>Transporte:</strong> vehículo limpio, sin mezclar alimentos con productos químicos.</li></ul><h2>Cuándo rechazar</h2><p>Rechaza el producto si llega vencido, sin rótulo, con el empaque roto o hinchado, fuera de temperatura o con señales de deterioro o plagas. Registra el rechazo y avisa al proveedor.</p><h2>Después de recibir</h2><p>Guarda primero los congelados y los refrigerados: cada minuto fuera del frío cuenta.</p>`,
        '<p>A un restaurante llega pescado a las 11 a. m. en una caja sin hielo. El termómetro marca una temperatura muy por encima de la de refrigeración. La auxiliar lo rechaza, lo registra y llama al proveedor. Recibirlo «para no quedarse sin almuerzo» habría puesto en riesgo a todos los clientes del día.</p>',
        ['Firmar el recibido sin abrir las cajas.', 'Dejar el pedido en la puerta mientras se termina otra tarea.', 'Aceptar productos sin rótulo «porque el proveedor es conocido».'],
        ['Revisa rótulo, vencimiento, empaque, temperatura y características.', 'Rechaza y registra lo que no cumple.', 'Lo frío se guarda primero.'],
        'En la clase 5.2 verás cómo almacenar en seco, en refrigeración y en congelación.',
        [RES]),
      L('Almacenamiento seco, refrigerado y congelado', 40,
        'Cómo ordenar el almacenamiento para que los alimentos no se contaminen ni se venzan.',
        `<p>Un buen almacenamiento evita la contaminación, el deterioro y las pérdidas por vencimiento.</p><h2>Principios para todo almacenamiento</h2><ul><li><strong>Primero en entrar, primero en salir (PEPS):</strong> lo que llegó antes se usa antes. Rotula lo que abres o preparas con la fecha.</li><li>Nada directamente en el piso ni pegado a la pared: estibas o estanterías que permitan limpiar y revisar.</li><li>Productos de limpieza y químicos <strong>lejos de los alimentos</strong>, en un lugar aparte.</li><li>Recipientes cerrados y rotulados.</li></ul><h2>Almacenamiento seco</h2><p>Lugar fresco, seco, ventilado, limpio y protegido de plagas. Los granos, harinas y enlatados se revisan antes de usar.</p><h2>Refrigeración</h2><p>Por debajo de 5 °C, como recomienda la OMS. Crudos abajo y listos para consumo arriba, todo tapado. Registra la temperatura en cada turno.</p><h2>Congelación</h2><p>Mantén los congelados duros y a la temperatura del rótulo del producto. Lo que se descongela no se vuelve a congelar sin haberlo cocinado antes.</p>`,
        '<p>Una tienda escolar guarda el desinfectante en el mismo estante que las bebidas, en botellas reutilizadas de gaseosa. Un error así puede terminar en una intoxicación química. La corrección: químicos en su envase original, rotulados y en un lugar separado de los alimentos.</p>',
        ['Guardar químicos en envases de alimentos o bebidas.', 'Poner lo nuevo delante de lo antiguo.', 'Volver a congelar algo descongelado sin cocinarlo.'],
        ['Primero en entrar, primero en salir, con fecha en lo abierto o preparado.', 'Nada en el piso ni contra la pared, y químicos aparte.', 'Refrigeración por debajo de 5 °C con registro por turno.'],
        'En la clase 5.3 integrarás todo con los registros y el autocontrol.',
        [RES, OMS]),
      L('Registros, autocontrol y caso integrador', 40,
        'Para qué sirven los registros, qué puntos de control te tocan y un caso para aplicar todo el curso.',
        `<p>El parágrafo 2 del artículo 13 de la ${RES} pide que el manipulador conozca los <strong>puntos de control</strong> a su cargo, cómo vigilarlos, sus límites y qué hacer si algo se sale del límite. Eso es el autocontrol: vigilar, registrar y corregir.</p><h2>Registros que suelen llevarse</h2><ul><li>Temperaturas de neveras, congeladores y baños de María.</li><li>Recepción de materias primas y rechazos.</li><li>Limpieza y desinfección, con fecha y responsable.</li><li>Inspección de plagas.</li><li>Lavado de tanques y análisis del agua.</li><li>Capacitación: asistencia, temas y horas.</li></ul><p>Un registro vale si se llena en el momento, con datos reales y con firma. Llenarlo al final del día «de memoria» no sirve como evidencia.</p><h2>Qué hacer cuando algo se sale del límite</h2><ol><li>Corrige de inmediato (por ejemplo, traslada los alimentos a otra nevera).</li><li>Decide qué pasa con el alimento afectado: usar, reprocesar o desechar.</li><li>Registra la desviación y la acción.</li><li>Avisa a tu supervisor.</li></ol><h2>Caso integrador</h2><p>Eres el manipulador encargado del turno de la mañana en el servicio de alimentación de una clínica. Llega el pedido de pollo, la nevera marca una temperatura alta, un compañero tiene diarrea y la caneca de la cocina está destapada. Ordena las acciones según lo que aprendiste: estado de salud, recepción, temperaturas, residuos y registros.</p>`,
        '<p>Respuesta guía del caso: el compañero con diarrea informa y pasa a tareas sin contacto con alimentos (art. 11); el pollo se recibe solo si llega a la temperatura correcta; los alimentos de la nevera se trasladan a otra que cumpla y se registra la desviación; la caneca se tapa y se retira de la zona de preparación; todo queda registrado y se avisa al supervisor.</p>',
        ['Llenar los registros al final del turno de memoria.', 'Corregir sin registrar la desviación.', 'Pensar que el registro es solo para la visita de la secretaría.'],
        ['El autocontrol es vigilar, registrar y corregir los puntos de control a tu cargo.', 'Un registro sirve si se llena en el momento y con datos reales.', 'Ante una desviación: corrige, decide sobre el alimento, registra y avisa.'],
        'Completa el proyecto final y el quiz de la unidad para emitir tu certificado.',
        [RES]),
    ],
  },
];

/** Evaluación: un quiz de 4 preguntas, una actividad y un foro por unidad. */
export const EVALUACION = [
  {
    quiz: [
      ['Un alimento es inocuo cuando:', ['No causa daño a quien lo consume', 'Se ve, huele y sabe bien al servirlo', 'Está recién preparado en la cocina', 'No contiene ningún tipo de conservante'], 0, 'La inocuidad es que el alimento no cause daño; no se reconoce por su aspecto.'],
      ['Según la OMS, en la mayoría de las ETA los síntomas aparecen:', ['En los primeros 5 minutos tras comer', 'Entre 24 y 72 horas después de comer', 'Solo después de una semana de comer', 'Únicamente si el alimento huele mal'], 1, 'El manual de la OMS indica que en la mayoría de los casos aparecen entre 24 y 72 horas después.'],
      ['¿Cuántas horas de capacitación al año pide el plan del artículo 12 de la Resolución 2674 de 2013?', ['Al menos 2 horas', 'Al menos 5 horas', 'Al menos 10 horas', 'Al menos 40 horas'], 2, 'El artículo 12 pide un plan continuo de al menos 10 horas al año.'],
      ['Un manipulador con diarrea debe:', ['Seguir trabajando, pero con guantes', 'Tomar un antidiarreico y continuar', 'Trabajar solo en el turno de la tarde', 'Avisar y no manipular alimentos'], 3, 'El artículo 11 excluye de la manipulación directa a quien tiene diarrea y le pide informar a la empresa.'],
    ],
    actividad: ['Mi diagnóstico de riesgos', '<h2>Qué vas a hacer</h2><p>Observa tu puesto de trabajo (o un establecimiento de alimentos que conozcas) durante un turno e identifica un peligro biológico, uno químico y uno físico.</p><h2>Qué entregas</h2><p>Una tabla con cada peligro, dónde lo viste, cómo llegaría al alimento y una medida para controlarlo según la Resolución 2674 de 2013.</p>'],
    foro: ['¿Qué peligro encontraste en tu lugar de trabajo?', 'Comparte un peligro que hayas visto y la medida que propones. Responde a dos compañeros con una sugerencia concreta.'],
  },
  {
    quiz: [
      ['¿Durante cuánto tiempo, como mínimo, debes enjabonarte las manos según la OMS?', ['5 segundos', '10 segundos', '15 segundos', '20 segundos'], 3, 'La OMS indica enjabonarse durante al menos 20 segundos.'],
      ['¿De qué color debe ser la ropa de trabajo según la Resolución 2674 de 2013?', ['Oscuro, para disimular manchas', 'Gris, por ser un tono neutro', 'Claro, para que se vea la suciedad', 'Cualquiera, si está limpia'], 2, 'El numeral 2 del artículo 14 pide ropa de color claro; no se permiten grises ni tonos que oculten la suciedad.'],
      ['Usar guantes:', ['Reemplaza el lavado de manos siempre', 'No reemplaza el lavado de manos', 'Es obligatorio en todas las tareas', 'Permite cobrar y servir sin cambiarlos'], 1, 'El numeral 10 aclara que los guantes no reemplazan el lavado de manos.'],
      ['¿Cuál de estas prácticas está permitida en el área de manipulación?', ['Uñas cortas, limpias y sin esmalte', 'Masticar chicle mientras se prepara', 'Usar solo el anillo de matrimonio', 'Llevar el celular en el bolsillo alto'], 0, 'Las uñas cortas, limpias y sin esmalte son lo que pide el numeral 7.'],
    ],
    actividad: ['Lista de chequeo de prácticas higiénicas', '<h2>Qué vas a hacer</h2><p>Arma una lista de chequeo con los numerales del artículo 14 de la Resolución 2674 de 2013 y aplícala a ti mismo durante tres turnos.</p><h2>Qué entregas</h2><p>La lista diligenciada, los incumplimientos que encontraste y cómo los corregiste.</p>'],
    foro: ['La práctica higiénica que más cuesta cumplir', '¿Cuál práctica del artículo 14 cuesta más cumplir en tu trabajo y por qué? Propón una solución práctica y comenta la de dos compañeros.'],
  },
  {
    quiz: [
      ['¿Qué temperatura interna recomienda la OMS para que un alimento cocinado sea seguro?', ['70 °C', '50 °C', '60 °C', '40 °C'], 0, 'El manual de la OMS indica que el alimento debe alcanzar 70 °C.'],
      ['La zona de peligro va de:', ['0 a 20 °C', '5 a 60 °C', '30 a 90 °C', '60 a 100 °C'], 1, 'Entre 5 y 60 °C los microorganismos se multiplican con gran rapidez.'],
      ['¿Cuánto tiempo, como máximo, puede estar un alimento cocinado a temperatura ambiente?', ['30 minutos', '6 horas', '2 horas', '12 horas'], 2, 'La OMS recomienda no dejarlo más de 2 horas.'],
      ['En la nevera, la carne cruda debe ir:', ['En la parte alta, a la vista', 'Junto a los postres listos', 'Sin tapa, para enfriar rápido', 'En la parte baja y tapada'], 3, 'Abajo y tapada, para que sus jugos no goteen sobre los alimentos listos.'],
    ],
    actividad: ['Registro de temperaturas de una semana', '<h2>Qué vas a hacer</h2><p>Durante una semana, mide y registra dos veces al día la temperatura de una nevera y de un alimento caliente en exhibición (o de tu casa, si no trabajas en el área).</p><h2>Qué entregas</h2><p>El registro, las lecturas fuera de rango y la acción que tomaste en cada caso.</p>'],
    foro: ['¿Dónde se rompe la cadena de temperatura?', 'Describe un momento de tu trabajo en que un alimento pasa por la zona de peligro y cómo lo evitarías. Responde a dos compañeros.'],
  },
  {
    quiz: [
      ['En la superficie de trabajo, ¿qué se hace primero?', ['Desinfectar sin retirar la grasa', 'Enjuagar solo con desinfectante', 'Da igual el orden de los pasos', 'Limpiar y luego desinfectar'], 3, 'Primero se limpia: la suciedad protege a los microorganismos del desinfectante.'],
      ['¿Qué programas forman el plan de saneamiento del artículo 26?', ['Ventas, compras, nómina y calidad', 'Limpieza, uniformes, horarios y caja', 'Limpieza, residuos, plagas y agua', 'Solo limpieza y control de plagas'], 2, 'Son los cuatro programas del artículo 26: limpieza y desinfección, residuos sólidos, control de plagas y agua potable.'],
      ['La concentración de un desinfectante se toma de:', ['La experiencia del operario', 'La ficha técnica del producto', 'El color que toma el agua', 'El olor que deja la mezcla'], 1, 'El programa por escrito define agentes, concentraciones y tiempos según la ficha técnica.'],
      ['El control de plagas empieza por:', ['Prevenir entrada, agua y comida', 'Fumigar cada semana sin falta', 'Poner cebos junto a los alimentos', 'Esperar a ver plagas para actuar'], 0, 'La norma pide énfasis en medidas preventivas: no dejar entrada, agua, comida ni refugio.'],
    ],
    actividad: ['Procedimiento de limpieza y desinfección', '<h2>Qué vas a hacer</h2><p>Escribe el procedimiento de limpieza y desinfección de una superficie o equipo de tu trabajo (tabla de picar, mesón, licuadora).</p><h2>Qué entregas</h2><p>El procedimiento con agente, concentración según la ficha técnica, tiempo de contacto, frecuencia y responsable, como pide el artículo 26.</p>'],
    foro: ['Errores de limpieza que hemos visto', 'Comparte un error de limpieza o de manejo de residuos que hayas visto y cómo se corrige. Comenta el aporte de dos compañeros.'],
  },
  {
    quiz: [
      ['Al recibir un producto refrigerado que llega caliente, debes:', ['Rechazarlo y registrarlo', 'Guardarlo rápido en la nevera', 'Usarlo de inmediato en el menú', 'Congelarlo para salvarlo'], 0, 'Un producto fuera de temperatura se rechaza y se registra.'],
      ['PEPS significa:', ['Productos en perfecto estado', 'Primero en entrar, primero en salir', 'Para empacar por separado', 'Prevenir el ingreso de plagas'], 1, 'Lo que llega primero se usa primero.'],
      ['Los productos de limpieza se guardan:', ['Junto a las bebidas frías', 'En botellas de gaseosa limpias', 'En su envase, aparte y rotulados', 'Debajo del mesón de preparación'], 2, 'Separados, en su envase original y rotulados evitan intoxicaciones químicas.'],
      ['Un registro sirve como evidencia cuando:', ['Se llena al final de cada mes', 'Lo llena el supervisor de memoria', 'Se llena antes de la visita sanitaria', 'Se llena en el momento y con datos reales'], 3, 'El registro vale si refleja lo que pasó cuando pasó, con datos reales y firma.'],
    ],
    actividad: ['Proyecto final: plan de autocontrol de mi puesto', '<h2>Qué vas a hacer</h2><p>Diseña el plan de autocontrol de tu puesto de trabajo: los puntos de control a tu cargo, cómo los vigilas, sus límites, qué haces ante una desviación y qué registros llevas.</p><h2>Qué entregas</h2><p>Un documento de 1 a 2 páginas que integre lo de las cinco unidades y la respuesta al caso integrador de la clase 5.3.</p>'],
    foro: ['Mi compromiso como manipulador', '¿Qué vas a cambiar desde mañana en tu trabajo después de este curso? Comparte un compromiso concreto y comenta el de dos compañeros.'],
  },
];

/**
 * Registros profesionales: hormonoterapia oncológica. Verificados el
 * 22-nov-2026 en las fichas técnicas de CIMA (tamoxifeno 63754, Femara 61628,
 * Arimidex 61286, Xtandi 113846002, Zytiga 111714003).
 */
import { T } from '../lib/crear.js';

const VIG_INHIBIDOR_AROMATASA = ['Densidad mineral ósea', 'Estado menopáusico', 'Dolor articular', 'Perfil lipídico'];

export const HORMONOTERAPIA = [
  {
    slug: 'tamoxifeno',
    atc: 'L02BA01',
    clase: 'Modulador selectivo del receptor de estrógenos (antiestrógeno)',
    marcas: ['Tamoxifeno (genéricos)'],
    quimica: 'El tamoxifeno es un fármaco no esteroideo basado en el trifeniletileno. Se administra por vía oral en comprimidos [FT].',
    diana: 'Antagonista estrogénico con efectos similares a los agonistas en otros tejidos',
    mec: [
      'El tamoxifeno muestra un espectro complejo: es antagonista de los estrógenos y, en distintos tejidos, tiene efectos similares a los de los agonistas estrogénicos. La ficha técnica relaciona ese efecto similar al estrogénico con el mayor riesgo de cáncer de endometrio [FT].',
      'Es un profármaco en buena medida: el CYP3A4 lo convierte en N-desmetiltamoxifeno y el CYP2D6 lo transforma en endoxifeno, uno de sus metabolitos activos más importantes. En quienes carecen de actividad CYP2D6, las concentraciones de endoxifeno son cerca de un 75 % menores [FT].',
    ],
    pk: [
      ['Metabolismo', 'Hidroxilación, desmetilación y conjugación; CYP3A4 a N-desmetiltamoxifeno y CYP2D6 a endoxifeno [FT]'],
      ['Vida media de eliminación', 'Unos 7 días; 14 días para el N-desmetiltamoxifeno [FT]'],
      ['Eliminación', 'Principalmente por las heces [FT]'],
    ],
    pos: [
      ['Adultos, incluidas pacientes mayores', '20 a 40 mg al día: 20 mg una vez al día o 10 a 20 mg dos veces al día [FT]'],
      ['Duración', 'Al menos 5 años [FT]'],
    ],
    adm: [
      'Vía oral; la dosis diaria se puede tomar en una o en dos tomas [FT].',
      'Se revisan los medicamentos concomitantes en cada dispensación por sus interacciones con el CYP2D6 y con los anticoagulantes [FT].',
    ],
    adv: [
      'Mayor incidencia de cáncer de endometrio y sarcoma uterino: toda paciente con síntomas ginecológicos anormales, en especial hemorragia vaginal, debe examinarse de inmediato [FT].',
      'Riesgo de efectos tromboembólicos [FT].',
      'Hipercalcemia al iniciar en algunas pacientes con metástasis óseas [FT].',
      'Evitar el embarazo durante el tratamiento con métodos anticonceptivos de barrera u otros no hormonales [FT].',
      'En mujeres premenopáusicas, medidas para mantener la salud ósea según las guías locales [FT].',
    ],
    alerta: { tono: 'alto', titulo: 'CYP2D6', texto: 'Los inhibidores potentes del CYP2D6 (paroxetina, fluoxetina, quinidina, cinacalcet o bupropión) deben evitarse siempre que sea posible: reducen el endoxifeno [FT].' },
    int: [
      ['Inhibidores potentes del CYP2D6 (paroxetina, fluoxetina, quinidina, cinacalcet, bupropión)', 'Reducen las concentraciones de endoxifeno, metabolito activo', 'Evitar siempre que sea posible; proponer alternativas [FT]'],
      ['Anticoagulantes cumarínicos (warfarina)', 'Aumento significativo del efecto anticoagulante', 'Vigilar con cuidado al iniciar la combinación [FT]'],
    ],
    evidencia: [
      'La ficha técnica sustenta su uso en el tratamiento del cáncer de mama y recomienda mantenerlo durante al menos 5 años [FT].',
      T(['Aspecto', 'Lo que dice la ficha técnica'], [
        ['Indicación', 'Tratamiento del cáncer de mama [FT]'],
        ['Duración', 'Al menos 5 años de tratamiento [FT]'],
        ['Metabolismo y eficacia', 'Los metabolizadores lentos del CYP2D6 producen menos endoxifeno [FT]'],
        ['Seguridad a largo plazo', 'Más cáncer de endometrio, sarcoma uterino y eventos tromboembólicos [FT]'],
      ]),
      'Por eso, en el seguimiento pesan tanto la adherencia durante años como la revisión de los antidepresivos que recibe la paciente [FT,MN].',
    ],
    vig: ['Sangrado vaginal y síntomas ginecológicos', 'Signos de trombosis', 'Medicamentos inhibidores del CYP2D6', 'Adherencia durante años'],
    prf: [['Interacción', 'Le formulan fluoxetina o paroxetina para los sofocos o el ánimo', 'Comunicar al médico: evitar inhibidores potentes del CYP2D6 [FT]']],
    claves: [['Dosis', '20 a 40 mg al día [FT]'], ['Duración', 'Al menos 5 años [FT]']],
    rc: 'antiestrógeno oral para el cáncer de mama, al menos 5 años; los inhibidores del CYP2D6 reducen su metabolito activo, el endoxifeno.',
    res: 'Su eficacia depende en parte del CYP2D6, que lo transforma en endoxifeno: algunos antidepresivos de uso común lo interfieren. El seguimiento vigila el sangrado vaginal, los signos de trombosis y la adherencia durante años.',
    desc: 'Tamoxifeno: mecanismo de acción, endoxifeno y CYP2D6, dosis, interacciones con antidepresivos y warfarina, riesgos y atención farmacéutica.',
  },
  {
    slug: 'letrozol',
    atc: 'L02BG04',
    clase: 'Inhibidor no esteroideo de la aromatasa',
    marcas: ['Femara'],
    quimica: 'El letrozol es un inhibidor no esteroideo de la aromatasa, en comprimidos de 2,5 mg para administración oral [FT].',
    diana: 'Inhibe la aromatasa y reduce la síntesis de estrógenos en todos los tejidos',
    mec: [
      'El letrozol se une de forma competitiva al grupo hemo del citocromo P450 de la aromatasa e inhibe la enzima. El resultado es una reducción de la síntesis de estrógenos en todos los tejidos donde está presente [FT].',
      'Por eso solo sirve en mujeres en estado endocrino posmenopáusico: en la premenopausia, el ovario sigue produciendo estrógenos [FT].',
    ],
    pk: [
      ['Absorción', 'Rápida y completa; biodisponibilidad absoluta media del 99,9 % [FT]'],
      ['Metabolismo', 'Hacia un metabolito carbinol inactivo, parcialmente por CYP2A6 y CYP3A4 [FT]'],
      ['Semivida de eliminación', 'Unos 2 a 4 días [FT]'],
      ['Insuficiencia hepática grave', 'La exposición y la semivida se duplican: supervisión estrecha [FT]'],
    ],
    pos: [
      ['Adultas, incluidas mayores', '2,5 mg una vez al día [FT]'],
      ['Ajuste en edad avanzada', 'No se precisa [FT]'],
    ],
    adm: [
      'Vía oral, una vez al día [FT].',
      'Si se olvida una dosis, no se debe tomar una dosis doble [FT].',
    ],
    adv: [
      'Solo en mujeres en estado posmenopáusico; si no está claro, se evalúan las hormonas antes de iniciar [FT].',
      'Densidad mineral ósea: evaluación formal antes del tratamiento adyuvante y controles durante y después [FT].',
      'Insuficiencia hepática grave: valorar el beneficio y el riesgo y supervisar de cerca [FT].',
    ],
    int: [
      ['Tamoxifeno, otros antiestrógenos o tratamientos con estrógenos', 'Pueden disminuir su acción farmacológica', 'Evitar la combinación [FT]'],
      ['Inhibidores e inductores del CYP3A4 y del CYP2A6', 'Su metabolismo está mediado en parte por estas enzimas', 'Precaución [FT]'],
    ],
    est: [
      ['BIG 1-98', 'Más de 8.000 mujeres posmenopáusicas con cáncer de mama temprano con receptor hormonal positivo', 'Doble ciego: letrozol o tamoxifeno durante 5 años, o secuencias de ambos [FT]'],
      ['MA-17', 'Más de 5.100 mujeres posmenopáusicas que habían completado 4,5 a 6 años de tamoxifeno', 'Doble ciego, controlado con placebo: tratamiento adyuvante de continuación [FT]'],
    ],
    vig: VIG_INHIBIDOR_AROMATASA,
    prf: [['Reacción adversa', 'Abandona por dolor articular', 'Explorar el síntoma, coordinar manejo con oncología y reforzar la duración indicada [FT,MN]']],
    claves: [['Dosis', '2,5 mg una vez al día [FT]'], ['Semivida', 'Unos 2 a 4 días [FT]']],
    rc: 'inhibidor de la aromatasa oral para el cáncer de mama hormonodependiente en posmenopáusicas; 2,5 mg al día y control de la densidad ósea.',
    res: 'Se usa en el tratamiento adyuvante, de continuación, avanzado y neoadyuvante del cáncer de mama con receptores hormonales en mujeres posmenopáusicas. El seguimiento cuida el hueso y la adherencia durante años.',
    desc: 'Letrozol: mecanismo de acción, 2,5 mg al día, farmacocinética, estudios BIG 1-98 y MA-17, salud ósea, interacciones y atención farmacéutica.',
  },
  {
    slug: 'anastrozol',
    atc: 'L02BG03',
    clase: 'Inhibidor no esteroideo de la aromatasa',
    marcas: ['Arimidex'],
    quimica: 'El anastrozol es un inhibidor de la aromatasa potente, altamente selectivo y no esteroideo, en comprimidos de 1 mg [FT].',
    diana: 'Inhibe la aromatasa y bloquea la conversión periférica de andrógenos en estrógenos',
    mec: [
      'En la mujer posmenopáusica, el estradiol se produce sobre todo por la conversión periférica de la androstenodiona a estrona a través de la aromatasa. El anastrozol inhibe esa enzima y reduce los estrógenos circulantes [FT].',
      'La reducción de estrógenos explica su eficacia en el cáncer de mama con receptor hormonal positivo y también su efecto sobre el hueso [FT].',
    ],
    pk: [
      ['Metabolismo', 'Extenso, por N-desalquilación, hidroxilación y glucuronidación [FT]'],
      ['Semivida de eliminación plasmática', '40 a 50 horas [FT]'],
      ['Excreción', 'Menos del 10 % de la dosis sin cambios en la orina en 72 horas [FT]'],
    ],
    pos: [
      ['Adultas, incluidas mayores', '1 mg una vez al día [FT]'],
    ],
    adm: [
      'Vía oral, un comprimido al día [FT].',
      'La menopausia debe definirse con pruebas hormonales (LH, FSH o estradiol) cuando haya duda [FT].',
    ],
    adv: [
      'No debe emplearse en mujeres premenopáusicas [FT].',
      'Puede reducir la densidad mineral ósea y aumentar el riesgo de fractura: evaluar la densidad ósea al inicio y después de forma protocolizada en mujeres con osteoporosis o riesgo de padecerla [FT].',
      'Evitar la administración junto con tamoxifeno o con terapias que incluyan estrógenos [FT].',
    ],
    int: [
      ['Tamoxifeno o terapias con estrógenos', 'Pueden disminuir su acción farmacológica', 'Evitar la combinación [FT]'],
      ['Warfarina y antipirina', 'A 1 mg no inhibió de forma significativa su metabolismo en estudios clínicos', 'Sin interacción relevante esperada [FT]'],
    ],
    est: [
      ['ATAC', 'Mujeres posmenopáusicas con cáncer de mama temprano', 'Anastrozol, tamoxifeno o ambos; acontecimientos adversos predefinidos tras una mediana de 68 meses de seguimiento [FT]'],
      ['Cambio tras 2 años de tamoxifeno', '2.579 mujeres posmenopáusicas con cáncer de mama temprano con receptor hormonal positivo', 'Cambiar a anastrozol fue estadísticamente superior en supervivencia libre de enfermedad [FT]'],
      ['SABRE', '234 mujeres posmenopáusicas con cáncer de mama temprano', 'Fase III/IV: anastrozol con risedronato y densidad mineral ósea [FT]'],
    ],
    vig: VIG_INHIBIDOR_AROMATASA,
    prf: [['Necesita farmacoterapia adicional', 'Osteopenia u osteoporosis sin evaluación ni tratamiento', 'Proponer la densitometría y la valoración de la salud ósea [FT]']],
    claves: [['Dosis', '1 mg una vez al día [FT]'], ['Semivida', '40 a 50 horas [FT]']],
    rc: 'inhibidor de la aromatasa oral, 1 mg al día, para el cáncer de mama con receptor hormonal positivo en posmenopáusicas; cuidar el hueso.',
    res: 'Se usa en el cáncer de mama avanzado y en el tratamiento adyuvante, solo o tras tamoxifeno, en mujeres posmenopáusicas. La densidad mineral ósea y la adherencia son los ejes del seguimiento.',
    desc: 'Anastrozol: mecanismo de acción, 1 mg al día, farmacocinética, estudios ATAC y SABRE, densidad ósea, interacciones y atención farmacéutica.',
  },
  {
    slug: 'enzalutamida',
    atc: 'L02BB04',
    clase: 'Inhibidor de la señalización del receptor androgénico',
    marcas: ['Xtandi'],
    quimica: 'La enzalutamida es un antiandrógeno no esteroideo de administración oral, en comprimidos de 40 y 80 mg [FT].',
    diana: 'Bloquea varios pasos de la señalización del receptor androgénico',
    mec: [
      'El cáncer de próstata es sensible a los andrógenos y la señalización del receptor androgénico sigue favoreciendo la progresión aunque los andrógenos plasmáticos sean bajos o indetectables. La enzalutamida es un inhibidor potente de esa señalización: bloquea varios pasos de la vía: inhibe la translocación nuclear de los receptores activados y su asociación con el ADN, incluso cuando el receptor está sobreexpresado [FT].',
      'Se combina con la castración médica, que se mantiene durante el tratamiento en los pacientes no castrados quirúrgicamente [FT].',
    ],
    pk: [
      ['Semivida terminal', '5,8 días de media tras una dosis única (2,8 a 10,2 días) [FT]'],
      ['Metabolismo', 'Hepático; produce un metabolito activo igual de activo que la enzalutamida; el CYP2C8 tiene una función importante [FT]'],
      ['Inducción enzimática', 'Inductor potente: CYP3A, CYP2B6, CYP2C9, CYP2C19 y transportadores [FT]'],
    ],
    pos: [
      ['Dosis recomendada', '160 mg una vez al día (cuatro comprimidos de 40 mg o dos de 80 mg) [FT]'],
      ['Con un inhibidor potente del CYP2C8', 'Reducir a 80 mg una vez al día [FT]'],
    ],
    adm: [
      'Lo inicia y supervisa un especialista con experiencia en cáncer de próstata [FT].',
      'Se mantiene la castración médica durante el tratamiento en los pacientes no castrados quirúrgicamente [FT].',
      'Al iniciar, revisar todos los medicamentos concomitantes [FT].',
    ],
    adv: [
      'Crisis epilépticas: la decisión de continuar se valora caso por caso [FT].',
      'Síndrome de encefalopatía posterior reversible: interrumpir el tratamiento [FT].',
      'Advertir que acudan de inmediato si notan sangrado gastrointestinal, hematuria macroscópica u otros síntomas de sangrado [FT].',
      'Es un inductor enzimático potente: puede reducir de forma sustancial el efecto de muchos medicamentos comunes [FT].',
    ],
    alerta: { tono: 'alto', titulo: 'Inductor potente', texto: 'Induce el CYP3A, CYP2B6, CYP2C9, CYP2C19 y transportadores: la reducción de las concentraciones de otros medicamentos puede ser sustancial [FT].' },
    int: [
      ['Gemfibrozilo y otros inhibidores potentes del CYP2C8', 'El AUC de la enzalutamida aumentó un 326 % con gemfibrozilo', 'Evitar o reducir a 80 mg al día [FT]'],
      ['Sustratos del CYP3A, CYP2B6, CYP2C9 o CYP2C19', 'Reducción sustancial de sus concentraciones y posible pérdida de efecto', 'Revisar la lista completa al iniciar [FT]'],
      ['Inductores del CYP2C8 o CYP3A4', 'El AUC de enzalutamida más el metabolito activo disminuyó un 37 % con rifampicina', 'No es necesario ajustar la dosis [FT]'],
    ],
    est: [
      ['AFFIRM', 'Cáncer de próstata resistente a la castración tras docetaxel', 'Fase 3 [FT]'],
      ['PREVAIL', 'Cáncer de próstata resistente a la castración sin quimioterapia previa', 'Fase 3; tasa de respuesta del PSA significativamente mayor [FT]'],
      ['ARCHES (9785-CL-0335)', 'Cáncer de próstata hormonosensible metastásico', 'Fase 3, multicéntrico, aleatorizado, controlado con placebo [FT]'],
      ['EMBARK (MDV3100-13)', 'Cáncer de próstata hormonosensible no metastásico con recidiva bioquímica de alto riesgo', 'Fase 3, aleatorizado, controlado con placebo [FT]'],
    ],
    vig: ['Antecedentes de convulsiones', 'Medicamentos concomitantes', 'Presión arterial y riesgo cardiovascular', 'Caídas y cansancio'],
    prf: [['Interacción', 'Toma warfarina, un anticonvulsivante o un anticoagulante oral directo y empieza enzalutamida', 'Revisar con el médico: la inducción puede reducir su efecto [FT]']],
    claves: [['Dosis', '160 mg una vez al día [FT]'], ['Semivida', '5,8 días de media [FT]']],
    rc: 'antiandrógeno oral para el cáncer de próstata; 160 mg al día, inductor enzimático potente y riesgo de crisis epilépticas.',
    res: 'Se toma una vez al día junto con la castración médica. Su principal reto farmacéutico es la inducción enzimática: puede reducir el efecto de anticoagulantes, antiepilépticos y muchos otros medicamentos de uso común.',
    desc: 'Enzalutamida: mecanismo de acción, 160 mg al día, inducción del CYP3A, interacciones, crisis epilépticas, estudios AFFIRM y PREVAIL, y seguimiento.',
  },
  {
    slug: 'abiraterona',
    atc: 'L02BX03',
    clase: 'Inhibidor de la biosíntesis de andrógenos (CYP17)',
    marcas: ['Zytiga'],
    quimica: 'El acetato de abiraterona es un profármaco que se convierte en abiraterona en el organismo. Se presenta en comprimidos de 500 mg [FT].',
    diana: 'Inhibe la enzima CYP17 y la síntesis de andrógenos',
    mec: [
      'La abiraterona es un inhibidor selectivo de la enzima 17α-hidroxilasa/C17,20-liasa (CYP17), necesaria para la biosíntesis de andrógenos en los testículos, las suprarrenales y el tejido tumoral prostático [FT].',
      'La inhibición del CYP17 aumenta la producción de mineralocorticoides en las suprarrenales; por eso se administra con prednisona o prednisolona y se vigilan la presión arterial, el potasio y la retención de líquidos [FT].',
    ],
    pk: [
      ['Efecto de los alimentos', 'La toma con alimentos aumenta de forma significativa la exposición [FT]'],
      ['Metabolismo', 'El acetato se hidroliza a abiraterona; sus metabolitos principales son el sulfato de abiraterona y el N-óxido de sulfato de abiraterona [FT]'],
      ['Semivida en plasma', 'Unas 15 horas en sujetos sanos [FT]'],
    ],
    pos: [
      ['Dosis recomendada', '1.000 mg (dos comprimidos de 500 mg) una vez al día [FT]'],
      ['Con prednisona o prednisolona', '5 mg al día en el cáncer hormonosensible metastásico; 10 mg al día en el resistente a la castración [FT]'],
      ['Tras hepatotoxicidad resuelta', 'Reanudar con 500 mg una vez al día [FT]'],
    ],
    adm: [
      'En ayunas: al menos dos horas después de comer y sin alimentos al menos una hora después de tomarla [FT].',
      'Los comprimidos se tragan enteros con agua [FT].',
      'Se mantiene la castración médica durante el tratamiento en los pacientes no castrados quirúrgicamente [FT].',
    ],
    adv: [
      'Hipertensión, hipopotasemia y retención de líquidos por exceso de mineralocorticoides: monitorizar la presión arterial, el potasio y los líquidos [FT].',
      'Precaución en enfermedad cardiovascular; en riesgo de insuficiencia cardíaca, control cada 2 semanas los primeros tres meses y luego mensual [FT].',
      'Hepatotoxicidad: transaminasas al menos cada dos semanas durante tres meses y luego una vez al mes [FT].',
      'La combinación con radio-223 está contraindicada [FT].',
    ],
    int: [
      ['Alimentos', 'Aumentan significativamente la absorción', 'Tomar en ayunas según la pauta de la ficha [FT]'],
      ['Inductores potentes del CYP3A4', 'Reducen la exposición a abiraterona', 'Evitar salvo que no exista alternativa [FT]'],
      ['Sustratos del CYP2D6 (dextrometorfano)', 'El AUC del dextrometorfano aumentó unas 2,9 veces', 'Precaución con sustratos de margen estrecho [FT]'],
    ],
    est: [
      ['LATITUDE (PCR3011)', 'Cáncer de próstata hormonosensible metastásico de alto riesgo', 'Abiraterona con prednisona más TDA frente a placebo más TDA: reducción del 34 % del riesgo de muerte (HR 0,66) [FT]'],
    ],
    vig: ['Presión arterial', 'Potasio', 'Transaminasas', 'Retención de líquidos'],
    prf: [['Dosis inadecuada', 'La toma con el desayuno «para no olvidarla»', 'Corregir: debe tomarse en ayunas, porque la comida aumenta la exposición [FT]']],
    claves: [['Dosis', '1.000 mg una vez al día, en ayunas [FT]'], ['Corticoide', 'Prednisona o prednisolona 5 o 10 mg al día [FT]']],
    rc: 'inhibidor oral del CYP17 para el cáncer de próstata; 1.000 mg en ayunas con prednisona, y control de presión, potasio e hígado.',
    res: 'Se toma una vez al día en ayunas, siempre con prednisona o prednisolona. El seguimiento vigila la presión arterial, el potasio, la retención de líquidos y las transaminasas, con controles frecuentes en los primeros meses.',
    desc: 'Abiraterona: mecanismo de acción, 1.000 mg en ayunas con prednisona, hepatotoxicidad, hipopotasemia, interacciones, estudio LATITUDE y seguimiento.',
  },
];

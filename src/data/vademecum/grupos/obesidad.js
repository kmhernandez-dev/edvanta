import { F } from '../fuentes.js';

/**
 * Grupo terapéutico: medicamentos para la obesidad.
 * Las citas [n] apuntan a `referencias` (Vancouver). Datos verificados el
 * 12-nov-2026 en las fichas técnicas de CIMA, las etiquetas de DailyMed,
 * PubMed, el CUM del INVIMA y las notas de la OMS, la EMA y la FDA.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-para-la-obesidad',
  nombre: 'Medicamentos para la obesidad',
  titulo: 'Medicamentos para la obesidad: fisiopatología, farmacología y atención farmacéutica',
  actualizado: '2026-11-12',
  resumen: 'La obesidad es una enfermedad crónica en la que el organismo defiende un nivel de grasa corporal más alto del que conviene a la salud. Los medicamentos actuales actúan sobre las señales que regulan el apetito (receptores de GLP-1 y GIP, neuronas POMC y receptor MC4) o sobre la absorción de la grasa de la dieta (lipasas). Este grupo reúne su fisiopatología, sus dianas, la evidencia que los respalda y cómo se acompaña al paciente con el modelo de atención farmacéutica de Minnesota.',
  datosClave: [
    ['Grupos ATC', 'A08 (preparados contra la obesidad) y A10BJ / A10BX (agonistas de incretinas)'],
    ['Con registro vigente en Colombia', 'Semaglutida (Wegovy), liraglutida (Saxenda), tirzepatida (Mounjaro) y orlistat [27]'],
    ['Aprobados en otros países', 'Naltrexona/bupropión (UE y EE. UU.), setmelanotida (UE y EE. UU.) y orforglipron (EE. UU.) [6,7,25]'],
    ['Adultos en tratamiento', 'IMC de 30 kg/m² o más, o de 27 a 30 kg/m² con al menos una comorbilidad relacionada con el peso [9-11]'],
  ],
  secciones: [
    {
      id: 'la-obesidad-como-enfermedad',
      titulo: 'La obesidad como enfermedad crónica',
      bloques: [
        'La Organización Mundial de la Salud (OMS) estima que en 2024 el 45 % de los adultos del mundo (2.600 millones) tenía sobrepeso y que 940 millones, cerca del 16 %, vivían con obesidad. Ese mismo año, 400 millones de niños y adolescentes de 5 a 19 años tenían sobrepeso, 170 millones de ellos con obesidad [1].',
        'La OMS define la obesidad como una enfermedad crónica que resulta de interacciones complejas entre factores ambientales, psicosociales y una susceptibilidad biológica, con alteraciones en las vías que regulan el apetito, el balance energético y la función del tejido adiposo. En adultos usa el índice de masa corporal (IMC): sobrepeso desde 25 kg/m² y obesidad desde 30 kg/m² [1].',
        'En 2025, una comisión de The Lancet Diabetes & Endocrinology con 58 expertos propuso separar dos estados [2]:',
        { lista: [
          'Obesidad preclínica: exceso de adiposidad con la función de los tejidos y órganos conservada, pero con mayor riesgo de diabetes tipo 2, enfermedad cardiovascular, algunos cánceres y trastornos mentales.',
          'Obesidad clínica: enfermedad crónica y sistémica en la que el exceso de adiposidad altera la función de tejidos, órganos o de la persona en su conjunto, y que puede causar daño grave de órganos (infarto, accidente cerebrovascular, insuficiencia renal).',
        ] },
        'La misma comisión advierte que el IMC puede subestimar o sobrestimar la adiposidad y no informa sobre la salud de cada persona, por lo que debe complementarse con otras mediciones del cuerpo [2].',
      ],
    },
    {
      id: 'fisiopatologia',
      titulo: 'Fisiopatología: por qué el cuerpo defiende el peso',
      bloques: [
        'El peso corporal no depende solo de la fuerza de voluntad. Un sistema de homeostasis energética iguala de forma activa lo que se come con lo que se gasta a lo largo del tiempo. La declaración científica de la Endocrine Society plantea que la obesidad es un trastorno de ese sistema, que «reajusta hacia arriba» el nivel de grasa que el organismo defiende, y no una simple acumulación pasiva de peso [3,4].',
        { subtitulo: 'El circuito hipotalámico de la melanocortina' },
        'En el núcleo arcuato del hipotálamo, las neuronas que producen proopiomelanocortina (POMC) liberan hormona estimulante de los melanocitos alfa (α-MSH), que activa el receptor de melanocortina 4 (MC4R) y reduce la ingesta. Esas mismas neuronas liberan β-endorfina, que actúa sobre receptores opioides μ de la propia neurona y frena la liberación de α-MSH: un circuito de autorregulación negativa [6].',
        'El MC4R interviene en el hambre, la saciedad y el gasto energético. Las mutaciones que inactivan la vía (déficit de POMC, de PCSK1 o del receptor de leptina, LEPR) producen una obesidad grave de inicio temprano con hiperfagia, y son la base de la indicación de la setmelanotida [7,18].',
        { subtitulo: 'Las señales del intestino' },
        'El péptido similar al glucagón tipo 1 (GLP-1) se libera desde las células enteroendocrinas del intestino. Aumenta la secreción de insulina y reduce la de glucagón según la glucemia, retrasa el vaciamiento gástrico y disminuye la ingesta [8]. Su receptor está en áreas del hipotálamo y del tronco encefálico que regulan el apetito [9]. Los receptores del polipéptido insulinotrópico dependiente de glucosa (GIP) están también en el cerebro y en los adipocitos [11].',
        { subtitulo: 'Recompensa y alimentación hedónica' },
        'Además del control homeostático, comer activa el sistema de recompensa. La semaglutida actúa sobre áreas hedónicas como el septo, el tálamo y la amígdala, y reduce el ansia de comer y la preferencia por alimentos ricos en grasa [9]. La combinación naltrexona/bupropión actúa sobre el sistema dopaminérgico mesolímbico de recompensa [6].',
        { subtitulo: 'La adaptación después de perder peso' },
        'Cuando se pierde peso con dieta, el organismo responde como ante una amenaza. En un estudio, tras una pérdida media de 13,5 kg bajaron la leptina, el péptido YY, la colecistocinina, la insulina y la amilina, y subieron la grelina, el GIP y el polipéptido pancreático, con más hambre. Un año después esos cambios persistían [5].',
        'Por eso el peso vuelve cuando se suspende el tratamiento. Un año después de suspender la semaglutida, los participantes recuperaron dos tercios del peso perdido [19]. En SURMOUNT-4, quienes pasaron de tirzepatida a placebo subieron un 14,0 %, mientras que quienes la continuaron bajaron otro 5,5 % [20]. Estos datos respaldan tratar la obesidad como una enfermedad crónica.',
      ],
    },
    {
      id: 'dianas',
      titulo: 'Dianas farmacológicas',
      bloques: [
        { tabla: {
          columnas: ['Diana', 'Función fisiológica', 'Medicamentos', 'Efecto sobre el peso'],
          filas: [
            ['Receptor de GLP-1', 'Saciedad, vaciamiento gástrico, secreción de insulina dependiente de glucosa [8]', 'Semaglutida, liraglutida, orforglipron [9,10,25]', 'Menor ingesta por más saciedad y menos hambre [9,10]'],
            ['Receptores de GIP y GLP-1', 'Apetito y metabolismo de la grasa en el adipocito [11]', 'Tirzepatida [11]', 'Menor ingesta; la pérdida es sobre todo de masa grasa [11]'],
            ['Lipasas gástrica y pancreática', 'Hidrólisis de los triglicéridos de la dieta [12]', 'Orlistat [12]', 'Menor absorción de la grasa ingerida [12]'],
            ['Neuronas POMC y receptor opioide μ', 'Liberación de α-MSH y circuito de recompensa [6]', 'Naltrexona/bupropión [6]', 'Menor apetito [6]'],
            ['Receptor MC4', 'Hambre, saciedad y gasto energético [7]', 'Setmelanotida [7]', 'Menos hambre y más gasto energético en obesidades monogénicas e hipotalámicas [7]'],
          ],
        } },
      ],
    },
    {
      id: 'comparativa',
      titulo: 'Comparativa de la evidencia',
      bloques: [
        'Los ensayos pivotales no son comparables entre sí: difieren en población, duración, diseño y forma de medir el resultado. La tabla sirve para ubicar el orden de magnitud de cada medicamento, no para elegir entre ellos.',
        { tabla: {
          columnas: ['Medicamento', 'Administración', 'Ensayo pivotal (frente a placebo)', 'Colombia (INVIMA)'],
          filas: [
            ['Semaglutida 2,4 mg', 'Subcutánea, semanal', 'STEP 1: −14,9 % frente a −2,4 % a las 68 semanas [13]', 'Wegovy, registros vigentes desde 2024 [27]'],
            ['Tirzepatida 5, 10 y 15 mg', 'Subcutánea, semanal', 'SURMOUNT-1: −15,0 %, −19,5 % y −20,9 % frente a −3,1 % a las 72 semanas [15]', 'Mounjaro, registros vigentes desde 2025; verifique la indicación aprobada [27]'],
            ['Liraglutida 3,0 mg', 'Subcutánea, diaria', 'SCALE: −8,4 kg frente a −2,8 kg a las 56 semanas [14]', 'Saxenda, registro vigente desde 2018 [27]'],
            ['Naltrexona/bupropión 32/360 mg', 'Oral, dos veces al día', 'COR-I: −6,1 % frente a −1,3 % a las 56 semanas [16]', 'Sin registro en el CUM consultado [27]'],
            ['Orlistat 120 mg', 'Oral, con cada comida principal', 'XENDOS: −5,8 kg frente a −3,0 kg a los 4 años [17]', '15 registros vigentes (Xenical y genéricos) [27]'],
            ['Setmelanotida', 'Subcutánea, diaria', 'Déficit de POMC: 8 de 10 participantes perdieron al menos el 10 % en cerca de un año (estudio abierto) [18]', 'Sin registro en el CUM consultado [27]'],
          ],
        } },
      ],
    },
    {
      id: 'historia',
      titulo: 'Lecciones de los medicamentos retirados',
      bloques: [
        'La historia de los medicamentos para la obesidad está marcada por retiros por seguridad, que explican por qué hoy se exigen estudios de seguridad cardiovascular y seguimiento a largo plazo [21]:',
        { lista: [
          'Rimonabant (antagonista de los receptores cannabinoides CB1): la EMA recomendó suspenderlo en 2008 porque sus efectos psiquiátricos superaban el beneficio y no podían controlarse con más medidas [21,22].',
          'Sibutramina (inhibidor de la recaptación de serotonina y noradrenalina): la EMA recomendó suspenderla en 2010, después de que el estudio SCOUT mostró más eventos cardiovasculares graves no mortales [21,23].',
          'Lorcaserina (agonista del receptor 5-HT2C): la FDA pidió retirarla en 2020 por un desequilibrio en los casos de cáncer observado en un ensayo de seguridad [21,24].',
        ] },
        'La lección para la práctica: un medicamento para la obesidad se usa durante años, de modo que su perfil de seguridad a largo plazo pesa tanto como la cantidad de peso que hace perder.',
      ],
    },
    {
      id: 'novedades',
      titulo: 'Lo nuevo en el grupo',
      bloques: [
        { lista: [
          'Semaglutida 7,2 mg: la ficha técnica europea de Wegovy permite subir a 7,2 mg semanales, tras al menos 4 semanas con 2,4 mg, en adultos con IMC de 30 kg/m² o más al inicio [9].',
          'Semaglutida oral para la obesidad: la etiqueta estadounidense de Wegovy incluye una presentación en comprimidos, y la ficha europea describe el cambio desde el comprimido de 25 mg a la inyección semanal [9,26].',
          'Orforglipron (Foundayo): la FDA lo aprobó en abril de 2026 como nueva entidad molecular, un agonista del receptor de GLP-1 por vía oral para adultos con obesidad o con sobrepeso y una comorbilidad, con reducción de peso frente a placebo en dos ensayos de 72 semanas [25].',
          'Setmelanotida en obesidad hipotalámica adquirida: la ficha europea de Imcivree incluye ya a adultos y niños mayores de 4 años con obesidad por una lesión del hipotálamo [7].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en obesidad: el modelo de Minnesota',
      destacado: true,
      bloques: [
        'Cada monografía de este vademécum incluye una sección de atención farmacéutica construida con el proceso de atención al paciente del modelo de Minnesota (Pharmacotherapy Workup), descrito por Cipolle, Strand y Morley. El farmacéutico asume la responsabilidad de que toda la farmacoterapia del paciente esté indicada, sea efectiva, sea segura y que el paciente pueda y quiera tomarla [28,30].',
        { subtitulo: 'El proceso en tres pasos' },
        { pasos: [
          'Valoración: conocer al paciente, su experiencia con los medicamentos y sus necesidades; revisar cada medicamento en orden (indicación, efectividad, seguridad y adherencia) e identificar los problemas relacionados con la farmacoterapia (PRF) [28].',
          'Plan de cuidado: fijar metas terapéuticas medibles y con plazo, acordar las intervenciones para resolver y prevenir los PRF y programar el seguimiento [28].',
          'Evaluación de seguimiento: medir los resultados frente a las metas y registrar el estado de cada problema: resuelto, estable, mejorado, mejoría parcial, sin mejoría, empeorado, fracaso o fallecido [28].',
        ] },
        { subtitulo: 'Las siete categorías de PRF aplicadas a la obesidad' },
        { tabla: {
          columnas: ['Necesidad', 'Categoría de PRF', 'Ejemplo con medicamentos para la obesidad'],
          filas: [
            ['Indicación', '1. Farmacoterapia innecesaria', 'Uso con fines estéticos en una persona que no cumple los criterios de IMC de la ficha técnica [9-12]'],
            ['Indicación', '2. Necesita farmacoterapia adicional', 'Hipertensión, dislipidemia o diabetes asociadas que no se han tratado'],
            ['Efectividad', '3. Medicamento inefectivo', 'No alcanza la pérdida mínima que exige la ficha (por ejemplo, 5 % a las 12 semanas con liraglutida 3,0 mg u orlistat, o a las 16 semanas con naltrexona/bupropión) [6,10,12]'],
            ['Efectividad', '4. Dosis demasiado baja', 'El paciente se quedó en una dosis del escalado sin llegar a la de mantenimiento'],
            ['Seguridad', '5. Reacción adversa', 'Náuseas, vómitos o estreñimiento persistentes; colelitiasis; sospecha de pancreatitis [9-11]'],
            ['Seguridad', '6. Dosis demasiado alta', 'Hipoglucemia porque no se redujo la sulfonilurea o la insulina al iniciar un agonista de GLP-1 [9-11]'],
            ['Adherencia', '7. Incumplimiento', 'Suspensión por costo, desabastecimiento o por creer que el tratamiento termina al llegar a la meta, con recuperación del peso [19,20]'],
          ],
        } },
        { subtitulo: 'La experiencia farmacoterapéutica' },
        'El modelo de Minnesota pide conocer la experiencia del paciente con los medicamentos: lo que espera de ellos, lo que teme, lo que cree, lo que entiende y cómo los toma en la vida real. Comprender esa experiencia ayuda a prevenir y resolver PRF [28,29]. En obesidad conviene explorar las dietas previas y sus resultados, el estigma, las expectativas sobre cuánto peso se pierde y en cuánto tiempo, el miedo a las inyecciones, lo que la persona ha visto en redes sociales y dónde piensa comprar el medicamento: el INVIMA ha alertado por productos ilegales que se venden como semaglutida [31].',
      ],
    },
  ],
  referencias: [
    F.omsObesidad, F.rubino2025, F.schwartz2017, F.heymsfield2017, F.sumithran2011, F.ftMysimba, F.ftImcivree,
    F.drucker2018, F.ftWegovy, F.ftSaxenda, F.ftMounjaro, F.ftXenical, F.step1, F.scale, F.surmount1, F.corI,
    F.xendos, F.setmelanotidaFase3, F.step1Extension, F.surmount4, F.muller2022, F.emaRimonabant,
    F.emaSibutramina, F.fdaLorcaserina, F.fdaOrforglipron, F.dmWegovy, F.invimaCum, F.cipolle2012,
    F.ramalho2012, F.ramalho2010, F.invimaAlertaSemaglutida,
  ],
  enlaces: [
    ['Cómo bajar de peso de forma saludable', '/articulos/como-bajar-de-peso-de-forma-saludable'],
    ['Liraglutida, semaglutida y tirzepatida: comparación para el QF', '/articulos/liraglutida-vs-semaglutida-vs-tirzepatida'],
    ['Modelo de Minnesota: atención farmacéutica centrada en el paciente', '/articulos/atencion-farmaceutica-modelo-minnesota'],
    ['Ozempic, Wegovy y Mounjaro en Colombia', '/articulos/ozempic-wegovy-mounjaro-aprobados-colombia'],
  ],
  seo: {
    titulo: 'Medicamentos para la obesidad: vademécum farmacológico',
    descripcion: 'Fisiopatología de la obesidad, dianas y evidencia de semaglutida, tirzepatida, liraglutida, orlistat y más, con atención farmacéutica y citas Vancouver.',
  },
};

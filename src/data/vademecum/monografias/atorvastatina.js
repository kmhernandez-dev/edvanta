import { F } from '../fuentes.js';

/** MonografÃ­a: atorvastatina (atorvastatina cÃ¡lcica). Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'atorvastatina',
  nombre: 'Atorvastatina',
  titulo: 'Atorvastatina: farmacologÃ­a, seguridad muscular y atenciÃ³n farmacÃ©utica en dislipidemia',
  grupo: 'medicamentos-para-la-dislipidemia',
  clase: 'Inhibidor de la HMG-CoA reductasa (estatina)',
  atc: 'C10AA05',
  marcas: ['Lipitor'],
  vias: ['Oral'],
  mecanismo: 'Inhibe de forma competitiva la HMG-CoA reductasa, reduce la sÃ­ntesis hepÃ¡tica de colesterol y aumenta los receptores LDL, con mayor captaciÃ³n y catabolismo de LDL.',
  actualizado: '2026-11-12',
  resumenCorto: 'estatina de alta intensidad; reduce LDL y eventos cardiovasculares, con miopatÃ­a y elevaciÃ³n de transaminasas como riesgos a vigilar.',
  resumen: 'La atorvastatina es una estatina de alta intensidad que reduce el colesterol LDL al inhibir la HMG-CoA reductasa y aumentar los receptores LDL hepÃ¡ticos. Tiene evidencia de reducciÃ³n de eventos cardiovasculares en prevenciÃ³n primaria y secundaria. Su manejo exige vigilar sÃ­ntomas musculares, funciÃ³n hepÃ¡tica, interacciones por CYP3A4 y adherencia a largo plazo.',
  datosClave: [
    ['Clase', 'Inhibidor de la HMG-CoA reductasa [1]'],
    ['CÃ³digo ATC', 'C10AA05 [1]'],
    ['Dosis habitual', '10 a 80 mg una vez al dÃ­a; alta intensidad 40 a 80 mg [1]'],
    ['Metabolismo', 'HepÃ¡tico, principalmente CYP3A4 [1]'],
    ['Semivida', 'Aproximadamente 14 horas, con metabolitos activos de vida media mÃ¡s larga [1]'],
    ['Colombia', 'MÃºltiples registros vigentes, solo y en combinaciones [4]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'FarmacoquÃ­mica',
      bloques: [
        'La atorvastatina es una estatina sintÃ©tica que se administra como atorvastatina cÃ¡lcica. La molÃ©cula libre tiene fÃ³rmula C33H35FN2O5 y un peso molecular de 558,6. Su estructura contiene un anillo de pirrol con un grupo fluorofenilo y una cadena hidroxiÃ¡cida que imita el mevalonato, el sustrato de la HMG-CoA reductasa [1].',
        'La forma cÃ¡lcica mejora la estabilidad de la molÃ©cula. La atorvastatina es lipofÃ­lica, lo que facilita su entrada al hepatocito y su acciÃ³n sobre la enzima diana [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La HMG-CoA reductasa es la enzima limitante de la sÃ­ntesis de colesterol. La atorvastatina la inhibe de forma competitiva y reduce la producciÃ³n hepÃ¡tica de colesterol. Como respuesta, el hepatocito aumenta la expresiÃ³n de receptores LDL en su superficie y capta mÃ¡s LDL del plasma [1].',
        'El resultado es una reducciÃ³n del colesterol LDL, del colesterol total, de la apolipoproteÃ­na B y de los triglicÃ©ridos, con un aumento variable del colesterol HDL. La reducciÃ³n del LDL se observa a las 2 semanas y alcanza su mÃ¡ximo a las 4 semanas [1].',
        'La magnitud del descenso depende de la dosis: la atorvastatina 10 mg reduce el LDL alrededor de 39 % y la de 80 mg alrededor de 50 a 60 % en los estudios de dosis-respuesta [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'FarmacocinÃ©tica',
      bloques: [
        { tabla: {
          columnas: ['ParÃ¡metro', 'Valor'],
          filas: [
            ['AbsorciÃ³n', 'Oral, rÃ¡pida; la biodisponibilidad sistÃ©mica es baja por el primer paso hepÃ¡tico [1]'],
            ['ConcentraciÃ³n mÃ¡xima', 'Alrededor de 1 a 2 horas [1]'],
            ['Metabolismo', 'HepÃ¡tico, principalmente por CYP3A4; metabolitos activos [1]'],
            ['Semivida', 'Aproximadamente 14 horas; la actividad inhibidora se prolonga por los metabolitos [1]'],
            ['EliminaciÃ³n', 'Biliar y fecal; menos del 2 % por la orina [1]'],
            ['Alimentos', 'No modifican de forma clÃ­nicamente relevante la exposiciÃ³n [1]'],
            ['Insuficiencia renal', 'No requiere ajuste [1]'],
            ['Insuficiencia hepÃ¡tica', 'Usar con precauciÃ³n; contraindicada en enfermedad hepÃ¡tica activa [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'SegÃºn la ficha tÃ©cnica europea, la atorvastatina estÃ¡ indicada en [1]:',
        { lista: [
          'Hipercolesterolemia primaria, incluida la hipercolesterolemia familiar heterocigÃ³tica y la hiperlipidemia mixta, en adultos y niÃ±os desde los 10 aÃ±os, como complemento de la dieta.',
          'Hipercolesterolemia familiar homocigÃ³tica en adultos, en combinaciÃ³n con otros tratamientos hipolipemiantes o cuando estos no estÃ¡n disponibles.',
          'PrevenciÃ³n de eventos cardiovasculares en adultos con alto riesgo de un primer evento, como complemento de la correcciÃ³n de otros factores de riesgo.',
        ] },
        'La indicaciÃ³n no es solo â€œcolesterol altoâ€: depende del riesgo cardiovascular y de la meta de LDL [1,8].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'PosologÃ­a y administraciÃ³n',
      bloques: [
        { tabla: {
          columnas: ['Contexto', 'Dosis', 'Frecuencia'],
          filas: [
            ['Inicio habitual', '10 a 20 mg', 'Una vez al dÃ­a [1]'],
            ['Alta intensidad', '40 a 80 mg', 'Una vez al dÃ­a [1]'],
            ['Hipercolesterolemia familiar heterocigÃ³tica', '10 mg, ajustar cada 4 semanas hasta 80 mg', 'Una vez al dÃ­a [1]'],
            ['NiÃ±os desde 10 aÃ±os con hipercolesterolemia familiar', '10 mg, ajustar hasta 80 mg', 'Una vez al dÃ­a [1]'],
          ],
        } },
        { lista: [
          'Se toma una vez al dÃ­a, a cualquier hora, con o sin comida [1].',
          'La dosis se ajusta a intervalos de 4 semanas o mÃ¡s segÃºn el LDL y la tolerancia [1].',
          'No requiere ajuste en insuficiencia renal [1].',
          'En pacientes que reciben elbasvir/grazoprevir o letermovir, la dosis no debe superar 20 mg al dÃ­a [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha tÃ©cnica [1]:',
        { lista: [
          'Hipersensibilidad a la atorvastatina o a los excipientes.',
          'Enfermedad hepÃ¡tica activa o elevaciÃ³n persistente e injustificada de transaminasas superior a 3 veces el lÃ­mite superior normal.',
          'Embarazo, lactancia y mujeres en edad fÃ©rtil sin anticoncepciÃ³n adecuada.',
          'Tratamiento concomitante con glecaprevir/pibrentasvir.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'MiopatÃ­a y rabdomiÃ³lisis: raras, pero potencialmente graves. El riesgo aumenta con dosis altas, insuficiencia renal, hipotiroidismo, edad avanzada, alcohol, ejercicio extremo y ciertas interacciones.',
          'MiopatÃ­a necrosante inmunomediada: debilidad proximal persistente con CK elevada que no mejora al suspender la estatina.',
          'Hepatotoxicidad: controlar transaminasas antes de iniciar y si aparecen sÃ­ntomas; suspender si la elevaciÃ³n persistente supera 3 veces el lÃ­mite superior normal.',
          'Ictus hemorrÃ¡gico: en pacientes con ictus hemorrÃ¡gico previo o infarto lacunar, el balance beneficio-riesgo de la dosis de 80 mg es incierto.',
          'Diabetes: las estatinas pueden elevar la glucemia; el beneficio cardiovascular supera el riesgo en la mayorÃ­a de los pacientes.',
          'Enfermedad pulmonar intersticial y miastenia grave: raras; suspender si se sospechan.',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'QuÃ© hacer'],
          filas: [
            ['Inhibidores potentes de CYP3A4 (claritromicina, itraconazol, ritonavir, ciclosporina)', 'Aumentan la exposiciÃ³n a atorvastatina y el riesgo de miopatÃ­a', 'Evitar o reducir la dosis y vigilar [1]'],
            ['Gemfibrozilo y otros fibratos', 'Aumentan el riesgo de miopatÃ­a', 'Usar la dosis mÃ¡s baja posible y vigilar [1]'],
            ['Ezetimiba', 'Puede aumentar el riesgo de eventos musculares', 'Vigilancia clÃ­nica [1]'],
            ['Ãcido fusÃ­dico sistÃ©mico', 'Riesgo de rabdomiÃ³lisis, incluso mortal', 'Suspender la estatina durante el tratamiento y 7 dÃ­as despuÃ©s [1]'],
            ['Colchicina y daptomicina', 'Mayor riesgo de miopatÃ­a', 'PrecauciÃ³n y vigilancia [1]'],
            ['Warfarina', 'Puede alterar el tiempo de protrombina', 'Controlar el INR al iniciar o cambiar la dosis [1]'],
            ['Digoxina', 'Aumento leve de su concentraciÃ³n', 'Vigilar [1]'],
            ['Anticonceptivos orales', 'Aumento de noretindrona y etinilestradiol', 'Considerar la relevancia clÃ­nica [1]'],
            ['Zumo de pomelo en grandes cantidades', 'Aumenta la exposiciÃ³n a atorvastatina', 'Evitar grandes cantidades [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones mÃ¡s frecuentes son mialgia, artralgia, diarrea, dispepsia, nÃ¡useas, estreÃ±imiento, cefalea y elevaciÃ³n de transaminasas [1].',
        { lista: [
          'Frecuentes: nasofaringitis, reacciones alÃ©rgicas, hiperglucemia, cefalea, dolor faringolarÃ­ngeo, epistaxis, estreÃ±imiento, flatulencia, dispepsia, nÃ¡useas, diarrea, mialgia, artralgia, espasmos musculares, dolor de espalda, fatiga y pruebas hepÃ¡ticas anormales.',
          'Poco frecuentes: hipoglucemia, aumento de peso, pesadillas, insomnio, mareo, parestesia, disgeusia, visiÃ³n borrosa, acÃºfenos, vÃ³mitos, pancreatitis, hepatitis, urticaria, alopecia, dolor de cuello y edema perifÃ©rico.',
          'Raras: trombocitopenia, neuropatÃ­a perifÃ©rica, colestasis, angioedema, eritema multiforme, sÃ­ndrome de Stevens-Johnson, necrÃ³lisis epidÃ©rmica tÃ³xica, miopatÃ­a, miositis, rabdomiÃ³lisis, rotura muscular y tendinopatÃ­a.',
          'Muy raras o de frecuencia no conocida: anafilaxia, insuficiencia hepÃ¡tica, sÃ­ndrome tipo lupus, miopatÃ­a necrosante inmunomediada, miastenia grave y enfermedad pulmonar intersticial.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: contraindicada. El colesterol es esencial para el desarrollo fetal y la inhibiciÃ³n de la HMG-CoA reductasa puede afectarlo; suspender antes de la concepciÃ³n o al confirmar el embarazo [1].',
          'Lactancia: contraindicada; se desconoce si pasa a la leche humana y podrÃ­a causar reacciones graves en el lactante [1].',
          'Fertilidad: los estudios en animales no muestran efectos sobre la fertilidad [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clÃ­nica',
      bloques: [
        { subtitulo: 'PrevenciÃ³n primaria en hipertensiÃ³n: ASCOT-LLA' },
        'En el estudio ASCOT-LLA, 10.305 pacientes hipertensos con colesterol promedio o inferior al promedio y otros factores de riesgo recibieron atorvastatina 10 mg o placebo. El estudio se detuvo antes de lo previsto porque la atorvastatina redujo de forma significativa los eventos coronarios y los accidentes cerebrovasculares [2].',
        { subtitulo: 'PrevenciÃ³n secundaria: TNT' },
        'El estudio TNT incluyÃ³ a 10.001 pacientes con enfermedad coronaria estable y los aleatorizÃ³ a atorvastatina 80 mg o 10 mg. La dosis intensiva redujo los eventos cardiovasculares mayores frente a la dosis baja durante un seguimiento medio de 4,9 aÃ±os [3].',
        'Estos ensayos, junto con el metaanÃ¡lisis de CTT, sostienen la idea de que â€œmÃ¡s descenso de LDL, mÃ¡s beneficioâ€ en pacientes de riesgo, siempre que se tolere y se mantenga la adherencia [2,3,7].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'SituaciÃ³n regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra mÃºltiples presentaciones de atorvastatina, sola y en combinaciones [4].',
          'UniÃ³n Europea: la atorvastatina estÃ¡ autorizada para las indicaciones descritas [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de atorvastatina y de sus combinaciones [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'AtenciÃ³n farmacÃ©utica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con la atorvastatina, la atenciÃ³n farmacÃ©utica se centra en la indicaciÃ³n, la meta de LDL, los sÃ­ntomas musculares y la adherencia. La revisiÃ³n sigue el orden de Minnesota: indicaciÃ³n, efectividad, seguridad y adherencia [5].',
        { subtitulo: '1. ValoraciÃ³n de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'QuÃ© revisar con la atorvastatina'],
          filas: [
            ['IndicaciÃ³n', 'Riesgo cardiovascular, LDL basal, meta y causas secundarias [1,8]'],
            ['Efectividad', 'LDL de control, dosis, tiempo desde el ajuste y adherencia [1]'],
            ['Seguridad', 'SÃ­ntomas musculares, CK si estÃ¡n indicadas, transaminasas, glucemia e interacciones [1]'],
            ['Adherencia', 'Miedo a efectos adversos, costo, nÃºmero de tabletas y creencias [5]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia mÃ¡s probables' },
        { tabla: {
          columnas: ['CategorÃ­a de PRF', 'SituaciÃ³n tÃ­pica', 'IntervenciÃ³n'],
          filas: [
            ['Necesita farmacoterapia adicional', 'LDL fuera de meta con la dosis mÃ¡xima tolerada', 'Proponer ezetimiba o derivar [1,8]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de buena adherencia', 'Revisar la intensidad y las causas secundarias [1]'],
            ['ReacciÃ³n adversa', 'Mialgia con CK elevada o sÃ­ntomas limitantes', 'Suspender, evaluar y proponer una alternativa [1]'],
            ['ReacciÃ³n adversa', 'ElevaciÃ³n de transaminasas', 'Revisar la causa y ajustar segÃºn la ficha [1]'],
            ['Incumplimiento', 'Abandono por miedo al hÃ­gado o al mÃºsculo', 'Explicar el balance beneficio-riesgo y acordar un plan [5]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de LDL acordada con el paciente y el equipo [8].',
          'EducaciÃ³n: tomar a la misma hora, no suspender por un dolor leve sin consultar y reportar debilidad o dolor intenso [1].',
          'Control de lÃ­pidos a las 4 a 12 semanas del inicio o del ajuste, y luego segÃºn la estabilidad [8].',
          'RevisiÃ³n de interacciones y de la funciÃ³n hepÃ¡tica cuando estÃ© indicada [1].',
          'Registro del estado de cada problema segÃºn el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapÃ©utica',
      destacado: true,
      bloques: [
        'La atorvastatina se toma sin un beneficio que se sienta el mismo dÃ­a. Esa caracterÃ­stica, junto con los mensajes sobre â€œel hÃ­gadoâ€ y â€œlos mÃºsculosâ€, explica muchas suspensiones [5,6].',
        { subtitulo: 'Lo que conviene explorar con la atorvastatina' },
        { lista: [
          'QuÃ© ha escuchado sobre las estatinas y quÃ© teme [1].',
          'Si ha tenido dolor, calambres o debilidad muscular y en quÃ© circunstancias [1].',
          'Si ha suspendido la estatina por su cuenta y por quÃ© [5].',
          'El costo, el nÃºmero de tabletas y la rutina diaria [4].',
          'El uso de zumo de pomelo, suplementos o medicamentos nuevos que puedan interactuar [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          'Â¿QuÃ© espera que la atorvastatina haga por su corazÃ³n?',
          'Â¿Ha notado dolores o calambres musculares desde que la toma?',
          'Â¿Ha dejado alguna dosis por miedo a los efectos?',
          'Â¿Toma otros medicamentos o suplementos que no le haya comentado al mÃ©dico?',
        ] },
      ],
    },
  ],
  referencias: [F.ftAtorvastatina, F.ascotLla, F.tnt, F.invimaCum, F.cipolle2012, F.ramalho2012, F.ctt2010, F.escDislipidemia2019],
  enlaces: [
    ['Atorvastatina: para quÃ© sirve', '/articulos/atorvastatina-para-que-sirve'],
    ['Dislipidemias: manejo farmacolÃ³gico', '/articulos/dislipidemias-manejo-farmacologico'],
    ['Alimentos para bajar el colesterol', '/articulos/alimentos-para-bajar-el-colesterol'],
  ],
  seo: {
    titulo: 'Atorvastatina: farmacologÃ­a y atenciÃ³n farmacÃ©utica',
    descripcion: 'Atorvastatina: mecanismo, farmacocinÃ©tica, indicaciones, miopatÃ­a, interacciones, evidencia de ASCOT-LLA y TNT, y atenciÃ³n farmacÃ©utica.',
  },
};

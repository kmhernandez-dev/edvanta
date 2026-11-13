import { F } from '../fuentes.js';

/** Monografía: orlistat 120 mg. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'orlistat',
  nombre: 'Orlistat',
  titulo: 'Orlistat: farmacología, farmacocinética y atención farmacéutica en obesidad',
  grupo: 'medicamentos-para-la-obesidad',
  clase: 'Inhibidor de las lipasas gastrointestinales',
  atc: 'A08AB01',
  marcas: ['Xenical'],
  vias: ['Oral, con cada comida principal'],
  mecanismo: 'Inhibe de forma covalente las lipasas gástrica y pancreática en la luz intestinal, de modo que parte de los triglicéridos de la dieta no se hidroliza ni se absorbe.',
  actualizado: '2026-11-12',
  resumenCorto: 'inhibidor de lipasas de acción local; −5,8 kg a 4 años y menos diabetes en XENDOS.',
  resumen: 'El orlistat actúa en la luz del estómago y del intestino delgado, no en el cerebro: bloquea las lipasas que digieren la grasa de la dieta y casi no se absorbe. Por eso sus efectos adversos dependen de cuánta grasa se come y sus interacciones vienen de la menor absorción de otros medicamentos y vitaminas liposolubles.',
  datosClave: [
    ['Clase', 'Inhibidor de las lipasas gastrointestinales, de acción periférica [1]'],
    ['Código ATC', 'A08AB01 [1]'],
    ['Dosis', '120 mg con cada comida principal que contenga grasa [1]'],
    ['Absorción sistémica', 'Mínima; cerca del 97 % de la dosis se elimina en las heces [1]'],
    ['Inicio del efecto', 'Aumento de la grasa fecal a las 24-48 horas [1]'],
    ['Colombia', '15 registros sanitarios vigentes: Xenical y genéricos [6]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El orlistat (tetrahidrolipstatina) deriva de la lipstatina, un inhibidor de la lipasa pancreática aislado de Streptomyces toxytricini. La lipstatina contiene un anillo de β-lactona al que se atribuye la inhibición irreversible de la enzima; inhibe la lipasa pancreática con una CI50 de 0,14 µM y no inhibe la fosfolipasa A2 ni la tripsina [3,4].',
        'Su nombre químico es éster (S)-1-[[(2S,3S)-3-hexil-4-oxo-2-oxetanil]metil]dodecílico del ácido (S)-2-formilamino-4-metilpentanoico. Su fórmula empírica es C29H53NO5 y su peso molecular, 495,7. Es una sola molécula diastereomérica con cuatro centros quirales, prácticamente insoluble en agua y sin pKa en el intervalo fisiológico [2].',
        'El anillo de β-lactona (oxetanona) es la parte reactiva: el orlistat queda unido como éster a la serina 152 del sitio activo de la lipasa pancreática, y basta una molécula por cada molécula de enzima para inhibirla por completo [4]. Al abrirse ese anillo, como ocurre en sus metabolitos, la actividad inhibidora cae entre 1.000 y 2.500 veces [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'El orlistat es un inhibidor potente, específico y de larga acción de las lipasas gastrointestinales. Actúa en la luz del estómago y del intestino delgado formando un enlace covalente con la serina del sitio activo de las lipasas gástrica y pancreática. La enzima inactivada no puede hidrolizar los triglicéridos de la dieta a ácidos grasos libres y monoglicéridos absorbibles [1].',
        'El aumento de la grasa fecal se aprecia a las 24-48 horas de empezar y desaparece entre 48 y 72 horas después de suspender. Dosis mayores de 120 mg tres veces al día no aportan beneficio adicional [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Mínima: el orlistat intacto no es detectable (menos de 5 ng/ml) 8 horas después de la dosis; sin acumulación [1]'],
            ['Distribución', 'No determinable por la absorción mínima; in vitro se une en más del 99 % a lipoproteínas y albúmina [1]'],
            ['Metabolismo', 'Probablemente en la pared gastrointestinal; los metabolitos M1 y M3 (anillo de β-lactona abierto) tienen actividad despreciable [1]'],
            ['Eliminación', 'Cerca del 97 % en las heces, el 83 % sin cambios; menos del 2 % por vía renal; excreción completa en 3 a 5 días [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, el orlistat 120 mg está indicado junto con una dieta hipocalórica moderada en pacientes con obesidad (IMC de 30 kg/m² o más) o con sobrepeso (IMC de 28 kg/m² o más) y factores de riesgo asociados. Se suspende si después de 12 semanas no se ha perdido al menos el 5 % del peso inicial [1].',
        'No tiene indicaciones en niños, y no se ha estudiado en personas con trastornos hepáticos o renales ni en personas mayores [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { lista: [
          'Una cápsula de 120 mg con agua inmediatamente antes, durante o hasta una hora después de cada comida principal [1].',
          'Si se omite una comida o la comida no contiene grasa, se omite la dosis [1].',
          'Dieta equilibrada y moderadamente hipocalórica, con cerca del 30 % de las calorías provenientes de grasa, rica en frutas y verduras, y con la grasa repartida entre las tres comidas principales [1].',
          'Dosis mayores de 120 mg tres veces al día no aportan beneficio [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones: hipersensibilidad, síndrome de malabsorción crónica, colestasis y lactancia [1].',
        'Advertencias de la ficha técnica [1]:',
        { lista: [
          'Dieta rica en grasa: aumenta las reacciones gastrointestinales (por ejemplo, más de 67 g de grasa en una dieta de 2.000 kcal).',
          'Diabetes tipo 2: la pérdida de peso es menor y el tratamiento antidiabético se vigila de cerca.',
          'Sangrado rectal: si es grave o persistente, requiere estudio.',
          'Anticoncepción oral: método adicional si hay diarrea grave.',
          'Anticoagulantes orales: vigilar los parámetros de coagulación.',
          'Hiperoxaluria y nefropatía por oxalato, que pueden llevar a insuficiencia renal, sobre todo con enfermedad renal crónica o hipovolemia.',
          'Hipotiroidismo o pérdida de su control, de forma rara, posiblemente por menor absorción de yodo o levotiroxina.',
          'Antiepilépticos: menor absorción, con riesgo de convulsiones.',
          'Antirretrovirales para el VIH: posible menor absorción y eficacia.',
          'No se recomienda junto con ciclosporina.',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Ciclosporina', 'Baja su concentración y su efecto inmunodepresor', 'No combinar; si es inevitable, controles frecuentes de los niveles [1]'],
            ['Warfarina y otros anticoagulantes orales', 'Puede alterar la coagulación', 'Vigilar el INR [1]'],
            ['Vitaminas A, D, E y K', 'Menor absorción posible', 'Considerar un multivitamínico, tomado al menos 2 horas después del orlistat o al acostarse [1]'],
            ['Amiodarona', 'Ligero descenso de sus niveles', 'Más vigilancia clínica y electrocardiográfica [1]'],
            ['Antiepilépticos (valproato, lamotrigina)', 'Convulsiones notificadas', 'Vigilar la frecuencia y gravedad de las crisis [1]'],
            ['Levotiroxina y sales de yodo', 'Posible pérdida del control del hipotiroidismo', 'Vigilar la función tiroidea [1]'],
            ['Antirretrovirales, antidepresivos, antipsicóticos (incluido el litio) y benzodiacepinas', 'Casos de menor eficacia al iniciar orlistat', 'Iniciar solo tras valorar las posibles repercusiones [1]'],
            ['Acarbosa', 'Sin estudios de interacción', 'Evitar la combinación [1]'],
            ['Anticonceptivos orales', 'Sin interacción directa; la diarrea grave puede reducir su disponibilidad', 'Método adicional si hay diarrea grave [1]'],
          ],
        } },
        'No se observaron interacciones con amitriptilina, atorvastatina, biguanidas, digoxina, fibratos, fluoxetina, losartán, fenitoína, fentermina, pravastatina, nifedipino ni alcohol [1].',
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Son sobre todo gastrointestinales y disminuyen con el uso prolongado [1].',
        { tabla: {
          columnas: ['Frecuencia', 'Reacciones adversas (ficha técnica de Xenical)'],
          filas: [
            ['Muy frecuentes (≥1/10)', 'Cefalea; gripe; infección de las vías respiratorias altas; dolor o molestias abdominales, manchas oleosas procedentes del recto, flatulencia con descarga fecal, urgencia fecal, heces grasas u oleosas, flatulencia, heces líquidas, evacuación oleosa, aumento de la defecación; hipoglucemia en diabetes tipo 2 [1]'],
            ['Frecuentes (≥1/100 a <1/10)', 'Infección de las vías respiratorias bajas; dolor o molestias rectales, heces blandas, incontinencia fecal, distensión abdominal, alteraciones en dientes y encías; infección urinaria; fatiga; irregularidad menstrual; ansiedad [1]'],
          ],
        } },
        'En un ensayo de 4 años la incidencia de reacciones gastrointestinales fue mayor en el primer año y descendió año tras año [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no hay datos clínicos; los estudios en animales no mostraron efectos dañinos. Se prescribe con precaución [1].',
          'Lactancia: contraindicado, porque se desconoce si pasa a la leche materna [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'En los datos agrupados de cinco estudios de dos años con dieta hipocalórica, a las 12 semanas el 37 % de los pacientes con orlistat y el 19 % con placebo habían perdido al menos el 5 % del peso; de ellos, el 49 % y el 40 % siguieron hasta perder el 10 % o más al año [1].',
        { tabla: {
          columnas: ['XENDOS (4 años) [5]', 'Orlistat', 'Placebo'],
          filas: [
            ['Completaron el tratamiento', '52 %', '34 % [5]'],
            ['Incidencia acumulada de diabetes tipo 2', '6,2 %', '9,0 % (reducción del riesgo del 37,3 %) [5]'],
            ['Pérdida de peso media', '5,8 kg', '3,0 kg [5]'],
          ],
        } },
        'La reducción de la diabetes se explicó por el subgrupo con intolerancia a la glucosa al inicio; la pérdida de peso fue similar con o sin esa alteración [5].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra 15 registros sanitarios vigentes de orlistat 120 mg, entre ellos Xenical y genéricos de varios laboratorios [6].',
          'Unión Europea: Xenical 120 mg está autorizado para la obesidad y el sobrepeso con factores de riesgo [1].',
          'Estados Unidos: Xenical tiene etiqueta vigente de la FDA [2].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con el orlistat, la atención farmacéutica se centra en la relación entre la grasa de la dieta y los efectos adversos, y en las interacciones por menor absorción. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [7].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con el orlistat'],
          filas: [
            ['Indicación', 'IMC según la ficha; descartar malabsorción crónica, colestasis y lactancia; antecedentes de enfermedad renal [1]'],
            ['Efectividad', 'Pérdida de al menos el 5 % a las 12 semanas; menor efecto esperado en diabetes tipo 2 [1]'],
            ['Seguridad', 'Medicamentos de absorción crítica (ciclosporina, antiepilépticos, levotiroxina, anticoagulantes, antirretrovirales, amiodarona); función renal; sangrado rectal [1]'],
            ['Adherencia', 'Toma con cada comida con grasa; vergüenza por los efectos gastrointestinales; horario del multivitamínico [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Medicamento inefectivo', 'Menos del 5 % a las 12 semanas', 'Informar al médico para suspender o cambiar, como indica la ficha [1]'],
            ['Reacción adversa', 'Manchas oleosas, urgencia fecal o incontinencia por comidas muy grasas', 'Educar sobre el reparto de la grasa (cerca del 30 % de las calorías) entre las tres comidas [1]'],
            ['Reacción adversa', 'Crisis convulsivas o pérdida del control del hipotiroidismo', 'Remitir y proponer vigilancia del antiepiléptico o de la TSH [1]'],
            ['Necesita farmacoterapia adicional', 'Riesgo de déficit de vitaminas liposolubles', 'Valorar con el médico un multivitamínico separado al menos 2 horas o al acostarse [1]'],
            ['Incumplimiento', 'Omite dosis en reuniones sociales por miedo a los efectos', 'Explorar la experiencia y ajustar la dieta en lugar de abandonar el tratamiento [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y 4. Seguimiento' },
        { lista: [
          'Meta mínima: al menos el 5 % del peso inicial a las 12 semanas; como referencia, el 37 % de los pacientes lo logró en los estudios agrupados [1].',
          'Educación: tomar la cápsula con las comidas que tienen grasa, omitirla si la comida no la tiene, anticoncepción adicional si hay diarrea grave y signos de alarma (sangrado rectal) [1].',
          'Seguimiento temprano (por ejemplo, a las 4 semanas) y a las 12 semanas, con revisión de los medicamentos concomitantes y registro del estado de cada PRF según el modelo [7].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La forma en que la persona vive el medicamento explica muchos abandonos que la fórmula no muestra [7,8].',
        { subtitulo: 'Lo que conviene explorar con el orlistat' },
        { lista: [
          'Vergüenza e incomodidad social por las manchas oleosas, la urgencia fecal o la flatulencia [1].',
          'Uso como «compensación»: tomar el orlistat para poder comer más grasa, lo que aumenta los efectos adversos y no es su objetivo [1].',
          'Expectativas: en XENDOS la pérdida media fue de 5,8 kg a los 4 años; conviene hablar de metas realistas desde el inicio [5].',
          'Otros tratamientos que la persona considera intocables (anticonvulsivantes, levotiroxina, anticoagulantes) y su temor a que fallen [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Cómo son sus comidas principales y cuánta grasa suelen tener?',
          '¿Ha dejado de tomar alguna dosis por miedo a los efectos en público?',
          '¿Qué otros medicamentos o suplementos toma y a qué horas?',
          '¿Qué espera lograr en los próximos tres meses?',
        ] },
      ],
    },
  ],
  referencias: [
    F.ftXenical, F.dmXenical, F.weibel1987, F.hadvary1991, F.xendos, F.invimaCum, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Orlistat para bajar de peso: lo que debes saber', '/articulos/orlistat-para-bajar-de-peso'],
    ['Pastillas para adelgazar: riesgos', '/articulos/pastillas-para-adelgazar-riesgos'],
  ],
  seo: {
    titulo: 'Orlistat: farmacología, interacciones y atención al paciente',
    descripcion: 'Orlistat 120 mg: farmacoquímica de la β-lactona, mecanismo, farmacocinética, interacciones, reacciones adversas, ensayo XENDOS y atención farmacéutica.',
  },
};

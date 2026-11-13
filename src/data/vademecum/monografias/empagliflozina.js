import { F } from '../fuentes.js';

/** Monografía: empagliflozina. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'empagliflozina',
  nombre: 'Empagliflozina',
  titulo: 'Empagliflozina: farmacología, riñón y atención farmacéutica en diabetes e insuficiencia cardíaca',
  grupo: 'medicamentos-para-la-diabetes-tipo-2',
  clase: 'Inhibidor selectivo del cotransportador de sodio-glucosa tipo 2 (SGLT2)',
  atc: 'A10BK03',
  marcas: ['Jardiance'],
  vias: ['Oral'],
  mecanismo: 'Inhibe selectivamente el SGLT2 en el túbulo proximal renal, reduce la reabsorción de glucosa y sodio y produce glucosuria, diuresis osmótica y efectos cardiovasculares y renales.',
  actualizado: '2026-11-12',
  resumenCorto: 'inhibidor de SGLT2 con beneficio cardiovascular, renal y en insuficiencia cardíaca; exige vigilar hidratación, infecciones y cetoacidosis.',
  resumen: 'La empagliflozina es un inhibidor selectivo del SGLT2 que reduce la glucosa al aumentar su excreción urinaria. Además del control glucémico, tiene evidencia de reducción de eventos cardiovasculares, hospitalización por insuficiencia cardíaca y progresión de la enfermedad renal. Sus riesgos más importantes son la hipovolemia, las infecciones genitales, la cetoacidosis normoglucémica y la fascitis necrosante perineal.',
  datosClave: [
    ['Clase', 'Inhibidor selectivo del SGLT2 [1]'],
    ['Código ATC', 'A10BK03 [1]'],
    ['Dosis en diabetes tipo 2', '10 mg una vez al día; 25 mg si la TFG es ≥60 ml/min y se necesita más control [1]'],
    ['Dosis en insuficiencia cardíaca o renal', '10 mg una vez al día [1]'],
    ['Semivida', 'Aproximadamente 12,4 horas [1]'],
    ['Colombia', 'Registros vigentes de empagliflozina sola y en combinación con metformina [6]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La empagliflozina es un derivado C-glucosídico con un núcleo de dihidroclorobenzofurano. Su fórmula es C23H27ClO7 y su peso molecular, 450,9. Es un inhibidor competitivo, reversible y muy selectivo del SGLT2, con una selectividad unas 5.000 veces mayor por el SGLT2 que por el SGLT1 [1].',
        'El SGLT2 se expresa sobre todo en el túbulo proximal del riñón y es responsable de la mayor parte de la reabsorción de glucosa filtrada. Al inhibirlo, la glucosa se elimina por la orina, un mecanismo independiente de la insulina y de la función de las células beta [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La inhibición del SGLT2 reduce la reabsorción renal de glucosa y sodio. El resultado es una glucosuria que arrastra agua por diuresis osmótica, una reducción del volumen intravascular y un aumento de la llegada de sodio al túbulo distal. Esos cambios explican parte de sus efectos cardiovasculares y renales [1].',
        'La empagliflozina reduce la presión arterial de forma moderada, disminuye la precarga y la poscarga, y se asocia con una reducción de la presión intraglomerular. También aumenta el hematocrito y produce una pérdida modesta de peso, sobre todo de grasa corporal [1].',
        'El efecto glucosúrico depende de la glucosa en sangre y de la TFG: es menor en la insuficiencia renal y puede desaparecer con TFG muy baja. Los beneficios cardiovasculares y renales se observan incluso en personas sin diabetes, lo que indica mecanismos que van más allá de la glucosa [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, biodisponibilidad de aproximadamente 78 %; los alimentos no afectan de forma clínica [1]'],
            ['Concentración máxima', 'Alrededor de 1,5 horas después de la dosis [1]'],
            ['Distribución', 'Unión a proteínas del 86 %; volumen de distribución de unos 73 l [1]'],
            ['Metabolismo', 'Glucuronidación por UGT1A3, UGT1A8, UGT1A9 y UGT2B7 [1]'],
            ['Semivida', 'Aproximadamente 12,4 horas [1]'],
            ['Eliminación', 'Renal y fecal; alrededor del 54 % se elimina por la orina y el 41 % por las heces [1]'],
            ['Insuficiencia renal', 'La exposición aumenta con la reducción de la TFG; ajustar y valorar la eficacia [1]'],
            ['Insuficiencia hepática', 'Aumenta la exposición en la insuficiencia grave; no se recomienda en esa población [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la empagliflozina está indicada en [1]:',
        { lista: [
          'Diabetes mellitus tipo 2 en adultos y niños desde los 10 años, asociada a dieta y ejercicio, en monoterapia cuando la metformina no es apropiada por intolerancia, o añadida a otros medicamentos para la diabetes.',
          'Insuficiencia cardíaca crónica sintomática en adultos.',
          'Enfermedad renal crónica en adultos.',
        ] },
        'No está indicada en diabetes tipo 1. La ficha advierte que los datos en diabetes tipo 1 mostraron un aumento de cetoacidosis y no se recomienda su uso en esa población [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis inicial', 'Mantenimiento', 'Máximo'],
          filas: [
            ['Diabetes tipo 2', '10 mg una vez al día', '10 mg; 25 mg si TFG ≥60 ml/min y se necesita más control', '25 mg al día [1]'],
            ['Insuficiencia cardíaca', '10 mg una vez al día', '10 mg una vez al día', '10 mg al día [1]'],
            ['Enfermedad renal crónica', '10 mg una vez al día', '10 mg una vez al día', '10 mg al día [1]'],
            ['Insuficiencia renal (TFG <60 ml/min)', '10 mg una vez al día', '10 mg una vez al día', '10 mg al día [1]'],
            ['Niños de 10 años o más con diabetes tipo 2', '10 mg una vez al día', '10 o 25 mg una vez al día', '25 mg al día [1]'],
          ],
        } },
        { lista: [
          'Los comprimidos se tragan enteros con agua, con o sin alimentos [1].',
          'No se recomienda iniciar el tratamiento si la TFG es menor de 20 ml/min/1,73 m² por experiencia limitada [1].',
          'Si se combina con insulina o una sulfonilurea, puede ser necesario reducir la dosis de estos para evitar hipoglucemia [1].',
          'En insuficiencia hepática grave no se recomienda su uso [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La única contraindicación de la ficha técnica es la hipersensibilidad al principio activo o a los excipientes [1]. Las advertencias son las que concentran el riesgo:',
        { lista: [
          'Cetoacidosis: puede aparecer con glucosa solo moderadamente elevada. Suspender ante náuseas, vómitos, dolor abdominal, sed intensa, disnea, confusión o fatiga inusual; valorar cetonas en sangre y suspender el tratamiento [1].',
          'Hipovolemia: la diuresis osmótica puede bajar la presión, sobre todo en personas mayores de 75 años, con enfermedad cardiovascular o con diuréticos. Vigilar la hidratación y suspender temporalmente si hay pérdidas [1].',
          'Infecciones genitales por hongos y del tracto urinario, incluidas pielonefritis y urosepsis. Valorar la suspensión temporal en infecciones complicadas [1].',
          'Fascitis necrosante del perineo (gangrena de Fournier): rara, grave y potencialmente mortal; requiere cirugía y antibióticos urgentes [1].',
          'Amputaciones de miembros inferiores: se observó un aumento con otro inhibidor de SGLT2; se desconoce si es un efecto de clase. Recomendar cuidado de los pies [1].',
          'Lesión hepática, aumento del hematocrito y alteraciones iniciales de la creatinina, que suelen ser transitorias [1].',
          'La glucosa en orina será positiva por el mecanismo de acción; no usar la prueba de 1,5-anhidroglucitol para monitorizar el control [1].',
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
            ['Diuréticos tiazídicos o del asa', 'Aumentan el riesgo de deshidratación e hipotensión', 'Vigilar la volemia y ajustar [1]'],
            ['Insulina y sulfonilureas', 'Aumentan el riesgo de hipoglucemia', 'Considerar reducir la dosis del secretagogo o de la insulina [1]'],
            ['Inductores de UGT (rifampicina, fenitoína)', 'Pueden reducir la eficacia', 'Vigilar el control glucémico [1]'],
            ['Litio', 'Puede aumentar la excreción renal de litio y reducir sus niveles', 'Monitorizar el litio al iniciar o cambiar la dosis [1]'],
            ['Probenecid, gemfibrozilo, rifampicina', 'Aumentan la exposición a empagliflozina de forma modesta', 'No se considera clínicamente relevante en la mayoría de los casos [1]'],
          ],
        } },
        'La empagliflozina no inhibe ni induce las principales isoformas del CYP450 y tiene un bajo potencial de interacciones farmacocinéticas con metformina, sitagliptina, warfarina, ramipril, simvastatina o hidroclorotiazida [1].',
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones más frecuentes son las infecciones genitales por hongos, el aumento de la micción y, cuando se combina con sulfonilureas o insulina, la hipoglucemia [1].',
        { lista: [
          'Frecuentes: moniliasis vaginal, vulvovaginitis, balanitis y otras infecciones genitales; infección del tracto urinario; hipoglucemia en combinación con sulfonilurea o insulina; aumento de la micción; disuria; sed; estreñimiento; prurito; exantema; urticaria; aumento de lípidos, creatinina y hematocrito.',
          'Poco frecuentes: hipovolemia, disuria y otras reacciones urinarias.',
          'Raras: fascitis necrosante del perineo (gangrena de Fournier), cetoacidosis, nefritis tubulointersticial, angioedema.',
          'Frecuencia no conocida: aumento del hematocrito, lesión hepática y otras reacciones poscomercialización.',
        ] },
        'En los estudios EMPEROR, la hipovolemia fue la reacción adversa más frecuente: 11,4 % con empagliflozina frente a 9,7 % con placebo [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no hay datos en humanos. Los estudios en animales muestran efectos adversos en el desarrollo posnatal; como medida de precaución, se prefiere evitar su uso durante el embarazo [1].',
          'Lactancia: se desconoce si pasa a la leche humana; en animales se excreta en la leche y no se puede excluir el riesgo en el lactante. No debe usarse durante la lactancia [1].',
          'Fertilidad: los estudios en animales no sugieren efectos perjudiciales directos; no hay estudios en humanos [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La empagliflozina tiene uno de los programas de evidencia más amplios entre los antidiabéticos:',
        { subtitulo: 'EMPA-REG OUTCOME: diabetes y enfermedad cardiovascular' },
        'En 7.020 adultos con diabetes tipo 2 y enfermedad cardiovascular establecida, la empagliflozina redujo el objetivo compuesto de muerte cardiovascular, infarto de miocardio no mortal o accidente cerebrovascular no mortal (10,5 % frente a 12,1 %; HR 0,86). La muerte cardiovascular bajó de 5,9 % a 3,7 % (HR 0,62), la hospitalización por insuficiencia cardíaca de 4,1 % a 2,7 % (HR 0,65) y la muerte por cualquier causa de 8,3 % a 5,7 % (HR 0,68) [2].',
        { subtitulo: 'EMPA-KIDNEY: enfermedad renal crónica' },
        'En 6.609 adultos con enfermedad renal crónica, con o sin diabetes, la empagliflozina redujo el objetivo de progresión renal o muerte cardiovascular en un 28 % (HR 0,72) [3].',
        { subtitulo: 'EMPEROR: insuficiencia cardíaca' },
        'En 3.730 pacientes con insuficiencia cardíaca y fracción de eyección reducida, la empagliflozina redujo el objetivo de muerte cardiovascular u hospitalización por insuficiencia cardíaca (HR 0,75) [4]. En 5.988 pacientes con fracción de eyección preservada, el objetivo compuesto también se redujo (HR 0,79) [5].',
        'Estos resultados no significan que la empagliflozina sustituya a otros tratamientos de la insuficiencia cardíaca o de la enfermedad renal. Significan que, en las poblaciones estudiadas, añadirla reduce eventos importantes [2-5].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra presentaciones de empagliflozina sola y en combinación con metformina [6].',
          'Unión Europea: Jardiance está autorizado para diabetes tipo 2, insuficiencia cardíaca crónica sintomática y enfermedad renal crónica [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes para diabetes tipo 2, insuficiencia cardíaca y enfermedad renal crónica; las indicaciones pueden variar [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con la empagliflozina, la atención farmacéutica se centra en la indicación, la hidratación, la función renal, las infecciones y la cetoacidosis. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [7].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la empagliflozina'],
          filas: [
            ['Indicación', 'Diabetes tipo 2, insuficiencia cardíaca o enfermedad renal crónica; descartar diabetes tipo 1 y embarazo [1]'],
            ['Efectividad', 'HbA1c, glucosa, peso, presión, síntomas de insuficiencia cardíaca y progresión renal [1]'],
            ['Seguridad', 'TFG, hidratación, presión, infecciones genitales y urinarias, cetonas y cuidado de los pies [1]'],
            ['Adherencia', 'Micción frecuente, infecciones, costo y creencias [7]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'Diabetes con insuficiencia cardíaca o renal sin SGLT2', 'Proponer la indicación al prescriptor [1]'],
            ['Medicamento inefectivo', 'No alcanza la meta glucémica con TFG muy baja', 'Revisar la expectativa de eficacia y la combinación [1]'],
            ['Reacción adversa', 'Infecciones genitales recurrentes', 'Educar sobre higiene, tratar y valorar la continuidad [1]'],
            ['Reacción adversa', 'Hipovolemia o hipotensión', 'Revisar diuréticos e hidratación y ajustar [1]'],
            ['Reacción adversa', 'Síntomas de cetoacidosis', 'Suspender y remitir de urgencia [1]'],
            ['Incumplimiento', 'Abandono por micción frecuente o infecciones', 'Escuchar la experiencia y ajustar el plan [7]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de HbA1c, de síntomas cardíacos o de progresión renal acordada con el equipo [1].',
          'Educación: hidratación, higiene genital, cuidado de los pies, signos de cetoacidosis y de infección grave [1].',
          'Revisión de la TFG antes de iniciar y al menos una vez al año; antes de fármacos que afecten la función renal [1].',
          'Registro del estado de cada problema según el modelo [7].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La empagliflozina cambia la vida diaria: más micción, más sed y el riesgo de infecciones. Esas molestias explican abandonos que la ficha no muestra [7,8].',
        { subtitulo: 'Lo que conviene explorar con la empagliflozina' },
        { lista: [
          'Cuántas veces orina al día y si se levanta en la noche; ajustar la hora de la toma si es necesario [1].',
          'Infecciones genitales o urinarias previas y cómo las ha manejado [1].',
          'El miedo a la cetoacidosis o a “la acidosis” y qué síntomas reconocer [1].',
          'La idea de que “la pastilla para la diabetes daña el riñón”: explicar que la TFG se vigila y que el medicamento puede protegerlo en poblaciones seleccionadas [1].',
          'El costo y la cobertura, sobre todo si se usa fuera de la indicación de diabetes [6].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Ha notado más sed o más ganas de orinar desde que empezó?',
          '¿Ha tenido infecciones genitales o urinarias?',
          '¿Sabe qué hacer si un día no puede comer o beber por una gripa o una cirugía?',
          '¿Qué espera que la empagliflozina haga por su corazón, su riñón o su glucosa?',
        ] },
      ],
    },
  ],
  referencias: [
    F.ftEmpagliflozina, F.empaReg, F.empaKidney, F.emperorReduced, F.emperorPreserved,
    F.invimaCum, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Diabetes tipo 2: tratamiento y seguimiento', '/articulos/diabetes-tipo-2-tratamiento'],
    ['Medicamentos para la diabetes tipo 2: preguntas frecuentes', '/articulos/medicamentos-diabetes-tipo-2-preguntas-frecuentes'],
    ['Cursos de diabetes para profesionales de la salud', '/articulos/cursos-de-diabetes-para-profesionales-de-la-salud'],
  ],
  seo: {
    titulo: 'Empagliflozina: farmacología, riñón y atención farmacéutica',
    descripcion: 'Empagliflozina: SGLT2, farmacocinética, indicaciones, cetoacidosis, evidencia EMPA-REG, EMPA-KIDNEY y EMPEROR, y atención farmacéutica.',
  },
};

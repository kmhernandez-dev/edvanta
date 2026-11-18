import { F } from '../fuentes.js';

/** Monografía: dapagliflozina. Verificada el 17-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'dapagliflozina',
  nombre: 'Dapagliflozina',
  titulo: 'Dapagliflozina: farmacología, corazón y riñón',
  grupo: 'medicamentos-para-la-diabetes-tipo-2',
  clase: 'Inhibidor selectivo y reversible del cotransportador de sodio-glucosa tipo 2 (SGLT2)',
  atc: 'A10BK01',
  marcas: ['Forxiga'],
  vias: ['Oral'],
  mecanismo: 'Inhibe de forma selectiva y reversible el SGLT2 del túbulo proximal renal, reduce la reabsorción de glucosa y sodio y produce glucosuria, diuresis osmótica y efectos cardiorrenales.',
  actualizado: '2026-11-17',
  resumenCorto: 'inhibidor de SGLT2 con beneficio en diabetes tipo 2, insuficiencia cardíaca y enfermedad renal crónica; exige vigilar volumen, infecciones y cetoacidosis.',
  resumen: 'La dapagliflozina reduce la glucosa al aumentar su excreción urinaria. Además del control glucémico, tiene evidencia de reducción de hospitalización por insuficiencia cardíaca y de progresión de la enfermedad renal, en personas con y sin diabetes. Sus riesgos principales son la depleción de volumen, las infecciones genitales, la cetoacidosis normoglucémica y la fascitis necrosante perineal.',
  datosClave: [
    ['Clase', 'Inhibidor selectivo del SGLT2 [1]'],
    ['Código ATC', 'A10BK01 [1]'],
    ['Dosis en diabetes tipo 2', '10 mg una vez al día [1]'],
    ['Dosis en insuficiencia cardíaca o renal', '10 mg una vez al día [1]'],
    ['Ajuste renal', 'No requiere ajuste por TFG; no iniciar si la TFG es menor de 25 ml/min [1]'],
    ['Semivida', 'Aproximadamente 12,9 horas [1]'],
    ['Colombia', 'Registros vigentes de dapagliflozina sola y en combinaciones [6]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La dapagliflozina es un derivado C-glucosídico. Su fórmula es C21H25ClO6 y su peso molecular, 408,87. Es un inhibidor competitivo y reversible del SGLT2 con una constante de inhibición (Ki) de 0,55 nM, lo que refleja una afinidad muy alta por el transportador [1].',
        'El SGLT2 se expresa en el túbulo proximal renal y es responsable de la mayor parte de la reabsorción de glucosa filtrada. Al inhibirlo, la glucosa se elimina por la orina mediante un mecanismo independiente de la insulina y de la función de las células beta [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La inhibición del SGLT2 reduce la reabsorción de glucosa y sodio. El resultado es una glucosuria que arrastra agua por diuresis osmótica, una reducción del volumen intravascular y un aumento de la llegada de sodio al túbulo distal, con retroalimentación tubuloglomerular y reducción de la presión intraglomerular [1].',
        'Esos cambios explican en parte sus efectos cardiovasculares y renales: reducción de la precarga y la poscarga, descenso moderado de la presión arterial, aumento del hematocrito y pérdida modesta de peso. Los beneficios cardiorrenales se observan también en personas sin diabetes, lo que indica mecanismos que van más allá de la glucosa [1].',
        'La cantidad de glucosa eliminada depende de la glucosa sanguínea y de la TFG. Por eso la eficacia hipoglucemiante disminuye con TFG menor de 45 ml/min y la probabilidad de hipoglucemia en monoterapia es baja [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral; biodisponibilidad absoluta del 78 %; se puede tomar con o sin alimentos [1]'],
            ['Concentración máxima', 'Alrededor de 2 horas después de la dosis en ayunas [1]'],
            ['Distribución', 'Unión a proteínas del 91 %; volumen de distribución de 118 l [1]'],
            ['Metabolismo', 'Glucuronidación por UGT1A9 a un metabolito inactivo; el CYP es una vía menor [1]'],
            ['Semivida', 'Aproximadamente 12,9 horas [1]'],
            ['Eliminación', 'Renal y fecal; el metabolito principal se elimina por la orina [1]'],
            ['Insuficiencia renal', 'No requiere ajuste; no iniciar con TFG <25 ml/min [1]'],
            ['Insuficiencia hepática', 'Sin ajuste en leve o moderada; en grave, iniciar con 5 mg [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la dapagliflozina está indicada en [1]:',
        { lista: [
          'Diabetes mellitus tipo 2 en adultos y niños desde los 10 años, en monoterapia cuando la metformina no es adecuada por intolerancia, o en combinación con otros medicamentos para la diabetes, junto con dieta y ejercicio.',
          'Insuficiencia cardíaca crónica sintomática en adultos.',
          'Enfermedad renal crónica en adultos.',
        ] },
        'No está indicada en diabetes tipo 1. La ficha advierte del riesgo de cetoacidosis en esa población y no recomienda su uso [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis', 'Observaciones'],
          filas: [
            ['Diabetes tipo 2', '10 mg una vez al día', 'Puede combinarse con metformina, insulina, secretagogos u otros antidiabéticos [1]'],
            ['Insuficiencia cardíaca', '10 mg una vez al día', 'Sin ajuste por edad ni por TFG [1]'],
            ['Enfermedad renal crónica', '10 mg una vez al día', 'No iniciar si la TFG es <25 ml/min [1]'],
            ['Insuficiencia hepática grave', 'Iniciar con 5 mg y subir a 10 mg si se tolera', 'Sin ajuste en leve o moderada [1]'],
            ['Niños de 10 años o más con diabetes tipo 2', '10 mg una vez al día', 'La experiencia es limitada [1]'],
          ],
        } },
        { lista: [
          'El comprimido se traga entero con agua, con o sin alimentos [1].',
          'Si se combina con insulina o un secretagogo, puede ser necesario reducir la dosis de estos para evitar hipoglucemia [1].',
          'En la diabetes tipo 2, si la TFG cae por debajo de 45 ml/min, valorar un tratamiento adicional para el control glucémico [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La única contraindicación de la ficha técnica es la hipersensibilidad al principio activo o a los excipientes [1]. Las advertencias concentran el riesgo:',
        { lista: [
          'Cetoacidosis diabética: puede aparecer con glucosa solo moderadamente elevada. Suspender ante náuseas, vómitos, dolor abdominal, sed intensa, disnea, confusión o fatiga inusual, y valorar cetonas [1].',
          'Depleción de volumen e hipotensión: vigilar en personas mayores, con diuréticos o con enfermedad cardiovascular; suspender temporalmente si hay pérdidas digestivas [1].',
          'Infecciones genitales por hongos y del tracto urinario, incluidas pielonefritis y urosepsis [1].',
          'Fascitis necrosante del perineo (gangrena de Fournier): rara, grave y potencialmente mortal; requiere cirugía y antibióticos urgentes [1].',
          'Amputaciones de miembros inferiores: se observó un aumento con otro inhibidor de SGLT2; recomendar cuidado de los pies [1].',
          'Lesión hepática, aumento del hematocrito y cambios iniciales de creatinina [1].',
          'La glucosa en orina será positiva por el mecanismo de acción [1].',
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
            ['Rifampicina y otros inductores', 'Reducen la exposición a dapagliflozina de forma modesta', 'No se recomienda ajuste de dosis; vigilar el control [1]'],
            ['Metformina, pioglitazona, sitagliptina, glimepirida, hidroclorotiazida, bumetanida, valsartán o simvastatina', 'No alteran de forma clínicamente significativa la farmacocinética', 'No requiere ajuste [1]'],
          ],
        } },
        'La dapagliflozina no inhibe ni induce las principales isoformas del CYP450, por lo que se esperan pocas interacciones farmacocinéticas [1].',
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones más frecuentes en los estudios de diabetes tipo 2 fueron las infecciones genitales [1].',
        { lista: [
          'Frecuentes: vulvovaginitis, balanitis y otras infecciones genitales; infección urinaria; hipoglucemia en combinación con insulina o sulfonilurea; aumento de la micción; disuria; sed; estreñimiento; prurito; exantema; aumento de lípidos, creatinina y hematocrito.',
          'Poco frecuentes: hipovolemia, hipotensión, disuria y otras reacciones urinarias.',
          'Raras: fascitis necrosante del perineo, cetoacidosis, nefritis tubulointersticial, angioedema.',
          'Frecuencia no conocida: lesión hepática y otras reacciones poscomercialización.',
        ] },
        'En los estudios DAPA-HF y DELIVER el perfil de seguridad fue consistente con el observado en diabetes [1,3,4].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no hay datos en humanos. Los estudios en ratas muestran toxicidad renal en el feto durante el segundo y tercer trimestre; no se recomienda su uso en esos trimestres. Si se detecta un embarazo, suspender [1].',
          'Lactancia: se desconoce si pasa a la leche humana; en animales se excreta y produce efectos farmacológicos en las crías. No debe usarse durante la lactancia [1].',
          'Fertilidad: los estudios en animales no sugieren efectos perjudiciales directos; no hay estudios en humanos [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La dapagliflozina tiene evidencia en diabetes tipo 2, insuficiencia cardíaca y enfermedad renal crónica:',
        { subtitulo: 'DECLARE-TIMI 58: diabetes y riesgo cardiovascular' },
        'En 17.160 adultos con diabetes tipo 2 y enfermedad cardiovascular o múltiples factores de riesgo, la dapagliflozina no redujo de forma significativa el objetivo compuesto de muerte cardiovascular, infarto o accidente cerebrovascular (HR 0,93; IC 95 % 0,84-1,03), pero sí redujo el objetivo de muerte cardiovascular u hospitalización por insuficiencia cardíaca (HR 0,83; IC 95 % 0,73-0,95) y la hospitalización por insuficiencia cardíaca (HR 0,73) [2].',
        { subtitulo: 'DAPA-HF: insuficiencia cardíaca con fracción de eyección reducida' },
        'En 4.744 pacientes con insuficiencia cardíaca y FEVI ≤40 %, con o sin diabetes, la dapagliflozina redujo el objetivo de muerte cardiovascular o empeoramiento de la insuficiencia cardíaca (HR 0,74; IC 95 % 0,65-0,85) [3].',
        { subtitulo: 'DELIVER: fracción de eyección levemente reducida o preservada' },
        'En 6.263 pacientes con insuficiencia cardíaca y FEVI >40 %, la dapagliflozina redujo el objetivo de muerte cardiovascular u hospitalización por insuficiencia cardíaca (HR 0,82; IC 95 % 0,73-0,92) [4].',
        { subtitulo: 'DAPA-CKD: enfermedad renal crónica' },
        'En 4.304 adultos con enfermedad renal crónica, con o sin diabetes, la dapagliflozina redujo el objetivo compuesto de caída sostenida de la TFG, enfermedad renal terminal o muerte renal o cardiovascular (HR 0,61; IC 95 % 0,51-0,72) [5].',
        'Estos resultados no significan que la dapagliflozina sustituya a otros tratamientos de la insuficiencia cardíaca o renal. Significan que, en las poblaciones estudiadas, añadirla reduce eventos importantes [2-5].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra presentaciones de dapagliflozina sola y en combinaciones [6].',
          'Unión Europea: Forxiga está autorizado para diabetes tipo 2, insuficiencia cardíaca crónica sintomática y enfermedad renal crónica [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes para diabetes tipo 2, insuficiencia cardíaca y enfermedad renal crónica; las indicaciones pueden variar [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con la dapagliflozina, la atención farmacéutica se centra en la indicación, la hidratación, la función renal, las infecciones y la cetoacidosis. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [7].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la dapagliflozina'],
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
            ['Necesita farmacoterapia adicional', 'Insuficiencia cardíaca o renal sin SGLT2', 'Proponer la indicación al prescriptor [1]'],
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
        'La dapagliflozina cambia la vida diaria: más micción, más sed y el riesgo de infecciones. Esas molestias explican abandonos que la ficha no muestra [7,8].',
        { subtitulo: 'Lo que conviene explorar con la dapagliflozina' },
        { lista: [
          'Cuántas veces orina al día y si se levanta en la noche; ajustar la hora de la toma si es necesario [1].',
          'Infecciones genitales o urinarias previas y cómo las ha manejado [1].',
          'El miedo a la cetoacidosis o a «la acidosis» y qué síntomas reconocer [1].',
          'La idea de que «la pastilla para la diabetes daña el riñón»: explicar que la TFG se vigila y que el medicamento puede protegerlo en poblaciones seleccionadas [1].',
          'El costo y la cobertura, sobre todo si se usa fuera de la indicación de diabetes [6].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Ha notado más sed o más ganas de orinar desde que empezó?',
          '¿Ha tenido infecciones genitales o urinarias?',
          '¿Sabe qué hacer si un día no puede comer o beber por una gripa o una cirugía?',
          '¿Qué espera que la dapagliflozina haga por su corazón, su riñón o su glucosa?',
        ] },
      ],
    },
  ],
  referencias: [
    F.ftDapagliflozina, F.declareTimi, F.dapaHf, F.deliver, F.dapaCkd,
    F.invimaCum17, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Dapagliflozina: para qué sirve y efectos secundarios', '/articulos/dapagliflozina-para-que-sirve'],
    ['Diabetes tipo 2: tratamiento y seguimiento', '/articulos/diabetes-tipo-2-tratamiento'],
    ['Medicamentos para la diabetes tipo 2: preguntas frecuentes', '/articulos/medicamentos-diabetes-tipo-2-preguntas-frecuentes'],
    ['Insuficiencia cardíaca: síntomas y tratamiento', '/articulos/insuficiencia-cardiaca-sintomas-y-tratamiento'],
  ],
  seo: {
    titulo: 'Dapagliflozina: farmacología, corazón y riñón',
    descripcion: 'Dapagliflozina: SGLT2, dosis, cetoacidosis, evidencia DECLARE, DAPA-HF, DELIVER y DAPA-CKD, y atención farmacéutica.',
  },
};

import { F } from '../fuentes.js';

/**
 * Grupo terapéutico: medicamentos para la diabetes tipo 2.
 * Las citas [n] apuntan a `referencias` (Vancouver). Datos verificados el
 * 12-nov-2026 en las fichas técnicas de CIMA, la OMS, la Cuenta de Alto
 * Costo, el CUM del INVIMA, las guías ADA 2026 y PubMed.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-para-la-diabetes-tipo-2',
  nombre: 'Medicamentos para la diabetes tipo 2',
  titulo: 'Medicamentos para la diabetes tipo 2: farmacología, evidencia y atención farmacéutica',
  actualizado: '2026-11-12',
  resumen: 'La diabetes tipo 2 es una enfermedad crónica y progresiva en la que se combinan la resistencia a la insulina y la pérdida de función de las células beta. El tratamiento no se limita a bajar la glucosa: hoy se elige pensando también en el riesgo cardiovascular, la insuficiencia cardíaca, la enfermedad renal, el peso y la hipoglucemia. Este grupo reúne la metformina, la empagliflozina y la sitagliptina, sus mecanismos, la evidencia de los ensayos pivotales, la monitorización y la atención farmacéutica con el modelo de Minnesota.',
  datosClave: [
    ['Grupos ATC', 'A10BA (biguanidas), A10BK (inhibidores de SGLT2) y A10BH (inhibidores de DPP-4)'],
    ['Primera línea habitual', 'Metformina, salvo contraindicación o intolerancia; la elección se individualiza según comorbilidades [4]'],
    ['Meta frecuente', 'HbA1c menor de 7 % en muchos adultos, con metas más flexibles o más estrictas según el riesgo [4]'],
    ['Colombia', 'Múltiples registros vigentes de los tres grupos, solos y en combinaciones a dosis fijas [3]'],
  ],
  secciones: [
    {
      id: 'la-diabetes-tipo-2-como-enfermedad-cronica',
      titulo: 'La diabetes tipo 2 como enfermedad crónica',
      bloques: [
        'La diabetes tipo 2 es una enfermedad metabólica crónica que aparece cuando el organismo no puede mantener la glucosa en sangre dentro de un rango saludable. La resistencia a la insulina y la disfunción progresiva de las células beta del páncreas se combinan con factores genéticos, adiposidad, inflamación y entorno. La Organización Mundial de la Salud estima que en 2022 había 830 millones de adultos con diabetes en el mundo, y que más de la mitad no recibía tratamiento [1].',
        'En Colombia, la Cuenta de Alto Costo reportó más de 2,1 millones de personas con diabetes con corte a agosto de 2024, y cerca de dos de cada tres adultos con diabetes tienen sobrepeso u obesidad [2]. La enfermedad es una de las principales causas de enfermedad renal crónica, ceguera, amputación no traumática y enfermedad cardiovascular en el país.',
        'El objetivo del tratamiento no es solo una cifra de glucosa. Las guías de la Asociación Americana de Diabetes de 2026 insisten en un enfoque integral: reducir el riesgo cardiovascular y renal, evitar la hipoglucemia, controlar el peso cuando sea relevante y tratar los factores de riesgo asociados [4].',
      ],
    },
    {
      id: 'fisiopatologia-y-dianas',
      titulo: 'Fisiopatología y dianas farmacológicas',
      bloques: [
        'En la diabetes tipo 2 coexisten varias alteraciones: el hígado produce demasiada glucosa, el músculo capta menos glucosa por resistencia a la insulina, las células beta secretan insulina de forma insuficiente y el riñón reabsorbe más glucosa de la que debería. El intestino también participa a través de las hormonas incretinas, y el tejido adiposo y el sistema inmunitario contribuyen con inflamación de bajo grado [1,4].',
        'Los tres grupos de este vademécum actúan en puntos distintos:',
        { tabla: {
          columnas: ['Diana', 'Función fisiológica', 'Medicamentos', 'Efecto farmacológico'],
          filas: [
            ['Hígado y sensibilidad a la insulina', 'Producción hepática de glucosa y captación periférica [1]', 'Metformina [1]', 'Menos gluconeogénesis y más captación de glucosa; no estimula la insulina [1]'],
            ['Cotransportador SGLT2 del riñón', 'Reabsorción de glucosa filtrada [1]', 'Empagliflozina [1]', 'Glucosuria, diuresis osmótica y menor glucosa plasmática [1]'],
            ['Enzima DPP-4', 'Degrada el GLP-1 y el GIP [1]', 'Sitagliptina [1]', 'Más incretinas activas, más insulina y menos glucagón de forma dependiente de la glucosa [1]'],
          ],
        } },
        'La metformina no produce hipoglucemia por sí sola; la empagliflozina tiene bajo riesgo de hipoglucemia salvo que se combine con sulfonilureas o insulina; la sitagliptina también tiene bajo riesgo por sí sola, pero lo aumenta en combinación con sulfonilureas o insulina [1,4].',
      ],
    },
    {
      id: 'comparativa-de-la-evidencia',
      titulo: 'Comparativa de la evidencia',
      bloques: [
        'Los ensayos responden preguntas distintas. La tabla ayuda a ubicar el tipo de beneficio que respalda a cada grupo, no a comparar cifras entre poblaciones diferentes:',
        { tabla: {
          columnas: ['Fármaco', 'Ensayo', 'Población', 'Resultado principal'],
          filas: [
            ['Metformina', 'UKPDS 34 [5]', 'Adultos con diabetes tipo 2 y sobrepeso, después del fracaso de la dieta', 'Menos complicaciones relacionadas con la diabetes, menos mortalidad por diabetes y menos infarto de miocardio que la dieta sola [5]'],
            ['Empagliflozina', 'EMPA-REG OUTCOME [6]', 'Adultos con diabetes tipo 2 y enfermedad cardiovascular establecida', 'Menos muerte cardiovascular, menos hospitalización por insuficiencia cardíaca y menos muerte por cualquier causa [6]'],
            ['Empagliflozina', 'EMPA-KIDNEY [7]', 'Adultos con enfermedad renal crónica, con o sin diabetes', 'Menos progresión de la enfermedad renal o muerte cardiovascular [7]'],
            ['Empagliflozina', 'EMPEROR-Reduced [8]', 'Insuficiencia cardíaca con fracción de eyección reducida', 'Menos muerte cardiovascular u hospitalización por insuficiencia cardíaca [8]'],
            ['Sitagliptina', 'TECOS [9]', 'Adultos con diabetes tipo 2 y enfermedad cardiovascular', 'No aumentó los eventos cardiovasculares mayores ni la hospitalización por insuficiencia cardíaca frente a placebo [9]'],
          ],
        } },
        'Una diferencia clave: la metformina tiene evidencia de desenlaces en diabetes tipo 2 con sobrepeso; la empagliflozina tiene evidencia cardiovascular, renal y de insuficiencia cardíaca en poblaciones específicas; la sitagliptina demostró seguridad cardiovascular, no superioridad. Esa diferencia guía la elección según la comorbilidad [4-9].',
      ],
    },
    {
      id: 'eleccion-del-tratamiento',
      titulo: 'Elección del tratamiento',
      bloques: [
        'Las guías de la ADA de 2026 no tratan a todas las personas igual. La metformina sigue siendo un punto de partida frecuente, pero la presencia de enfermedad cardiovascular aterosclerótica, insuficiencia cardíaca, enfermedad renal crónica o un objetivo de pérdida de peso cambia la elección desde el inicio [4].',
        { lista: [
          'En enfermedad cardiovascular aterosclerótica, insuficiencia cardíaca o enfermedad renal crónica, se prefieren los inhibidores de SGLT2 o los agonistas de GLP-1 con beneficio demostrado, independientemente de la HbA1c [4].',
          'En insuficiencia cardíaca, la empagliflozina tiene indicación y evidencia en fracción de eyección reducida y preservada [4,8].',
          'En enfermedad renal crónica con albuminuria, la empagliflozina reduce la progresión renal [4,7].',
          'Cuando el riesgo de hipoglucemia es alto, se prefieren fármacos que no la produzcan por sí solos, como metformina, SGLT2 o DPP-4, sobre todo si no se usa sulfonilurea o insulina [4].',
          'No se recomienda combinar un inhibidor de DPP-4 con un agonista de GLP-1, porque actúan sobre la misma vía [4].',
          'La combinación de metformina con un SGLT2 o con un DPP-4 es habitual y puede simplificarse con una tableta a dosis fija [4].',
        ] },
      ],
    },
    {
      id: 'seguridad-y-monitorizacion',
      titulo: 'Seguridad y monitorización',
      bloques: [
        'Cada grupo tiene riesgos propios y una monitorización específica:',
        { lista: [
          'Metformina: molestias gastrointestinales al inicio, déficit de vitamina B12 en uso prolongado y, muy rara vez, acidosis láctica. Se debe revisar la función renal antes de iniciar y al menos una vez al año, suspender antes de un contraste yodado o de una cirugía y evitar en la insuficiencia renal grave [1].',
          'Empagliflozina: infecciones genitales por hongos, aumento de la diuresis, hipovolemia, cetoacidosis normoglucémica y, rara vez, fascitis necrosante perineal. Se debe revisar la función renal, la hidratación y los síntomas de cetoacidosis, sobre todo en enfermedad aguda, cirugía o ayuno [1].',
          'Sitagliptina: pancreatitis aguda, hipoglucemia en combinación con sulfonilureas o insulina, reacciones de hipersensibilidad y penfigoide bulloso. Requiere ajuste de dosis en insuficiencia renal [1].',
        ] },
        'La monitorización incluye la HbA1c, la glucosa en casa, la función renal, el peso, la presión arterial, los síntomas de hipoglucemia y la adherencia. La periodicidad depende de la estabilidad y de los cambios de tratamiento [4].',
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en diabetes tipo 2: el modelo de Minnesota',
      destacado: true,
      bloques: [
        'El proceso de atención al paciente del modelo de Minnesota se aplica a la diabetes con las cuatro preguntas de siempre: ¿el medicamento está indicado?, ¿es efectivo?, ¿es seguro? y ¿el paciente puede y quiere tomarlo? [10].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar en diabetes tipo 2'],
          filas: [
            ['Indicación', 'HbA1c, comorbilidades cardiovasculares y renales, peso, riesgo de hipoglucemia y preferencias del paciente [4]'],
            ['Efectividad', 'HbA1c, glucosa en casa, síntomas, peso y adherencia [4]'],
            ['Seguridad', 'Función renal, síntomas gastrointestinales, infecciones genitales, hipoglucemia, cetoacidosis y pancreatitis [1]'],
            ['Adherencia', 'Costo, número de tabletas, miedo a las inyecciones, creencias y olvidos [10]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'HbA1c fuera de meta con monoterapia', 'Proponer la combinación según comorbilidades [4]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de dosis adecuada y buena adherencia', 'Revisar la combinación y remitir [4]'],
            ['Reacción adversa', 'Diarrea o náuseas con metformina', 'Ajustar el horario, dividir la dosis y titular lentamente [1]'],
            ['Reacción adversa', 'Infecciones genitales recurrentes con empagliflozina', 'Educar sobre higiene y consultar si persisten [1]'],
            ['Reacción adversa', 'Hipoglucemia con sitagliptina combinada con sulfonilurea o insulina', 'Revisar la dosis del secretagogo o de la insulina [1]'],
            ['Incumplimiento', 'Suspensión por miedo a la insulina, costo o efectos adversos', 'Escuchar la experiencia y simplificar el esquema [10]'],
            ['Farmacoterapia innecesaria', 'Duplicación de DPP-4 con GLP-1 o de dos SGLT2', 'Detectar y comunicar al prescriptor [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de HbA1c acordada con el paciente, según edad, comorbilidades, expectativa de vida y riesgo de hipoglucemia [4].',
          'Educación: toma correcta, manejo de olvidos, signos de hipoglucemia y de cetoacidosis, cuidado de los pies e hidratación [1].',
          'Seguimiento de la HbA1c cada tres a seis meses según la estabilidad, y de la función renal al menos una vez al año [4].',
          'Registro del estado de cada problema según el modelo [10].',
        ] },
        { subtitulo: 'La experiencia farmacoterapéutica' },
        'La diabetes exige cambios de por vida y el medicamento se mezcla con la comida, el trabajo, el costo y el miedo a las complicaciones. El modelo de Minnesota pide explorar lo que el paciente espera, teme y cree sobre sus medicamentos [10,11]. En diabetes conviene preguntar por el miedo a la insulina, la vergüenza de inyectarse o de tomar pastillas delante de otros, la idea de que “la metformina daña el riñón”, el costo de las combinaciones y la dificultad para sostener la dieta. Esas creencias explican más abandonos que cualquier ficha técnica [11].',
      ],
    },
  ],
  referencias: [
    F.omsDiabetes, F.cacDiabetes, F.invimaCum, F.adaDiabetes2026, F.ukpds34, F.empaReg,
    F.empaKidney, F.emperorReduced, F.tecos, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Diabetes tipo 2: tratamiento y seguimiento', '/articulos/diabetes-tipo-2-tratamiento'],
    ['Medicamentos para la diabetes tipo 2: preguntas frecuentes', '/articulos/medicamentos-diabetes-tipo-2-preguntas-frecuentes'],
    ['Metformina: para qué sirve y cómo se toma', '/articulos/metformina-para-que-sirve'],
    ['Síntomas de diabetes tipo 2', '/articulos/sintomas-de-diabetes-tipo-2'],
    ['Cursos de diabetes para profesionales de la salud', '/articulos/cursos-de-diabetes-para-profesionales-de-la-salud'],
  ],
  seo: {
    titulo: 'Medicamentos para la diabetes tipo 2: vademécum',
    descripcion: 'Metformina, empagliflozina y sitagliptina: mecanismos, evidencia, seguridad renal y cardiovascular, y atención farmacéutica en diabetes tipo 2.',
  },
};

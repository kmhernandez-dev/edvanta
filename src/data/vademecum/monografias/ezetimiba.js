import { F } from '../fuentes.js';

/** Monografía: ezetimiba. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'ezetimiba',
  nombre: 'Ezetimiba',
  titulo: 'Ezetimiba: farmacología, evidencia y atención farmacéutica en dislipidemia',
  grupo: 'medicamentos-para-la-dislipidemia',
  clase: 'Inhibidor selectivo de la absorción intestinal de colesterol',
  atc: 'C10AX09',
  marcas: ['Ezetrol'],
  vias: ['Oral'],
  mecanismo: 'Inhibe el transportador NPC1L1 en el intestino delgado y reduce la absorción de colesterol y fitoesteroles, con menor llegada de colesterol al hígado.',
  actualizado: '2026-11-12',
  resumenCorto: 'inhibidor de la absorción intestinal de colesterol; se añade a la estatina cuando no se alcanza la meta de LDL.',
  resumen: 'La ezetimiba reduce la absorción intestinal de colesterol al inhibir el transportador NPC1L1. Se usa como complemento de una estatina cuando el LDL no alcanza la meta, como monoterapia cuando la estatina no es adecuada y en la prevención cardiovascular después de un síndrome coronario agudo. Es bien tolerada y su beneficio se suma al de la estatina sin compartir su metabolismo por CYP3A4.',
  datosClave: [
    ['Clase', 'Inhibidor selectivo de la absorción de colesterol [1]'],
    ['Código ATC', 'C10AX09 [1]'],
    ['Dosis', '10 mg una vez al día [1]'],
    ['Metabolismo', 'Glucuronidación intestinal y hepática; no depende de CYP3A4 [1]'],
    ['Semivida', 'Aproximadamente 22 horas [1]'],
    ['Colombia', 'Múltiples registros vigentes, sola y en combinación con estatinas [4]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La ezetimiba es una molécula sintética con fórmula C24H21F2NO3 y un peso molecular de 409,4. Contiene dos grupos fluorofenilo y un anillo β-lactámico, aunque no es un antibiótico: su estructura se diseñó para bloquear la absorción de esteroles, no para matar bacterias [1].',
        'Se absorbe en el intestino y se glucuroniza a un metabolito activo. La molécula y su metabolito actúan en la luz intestinal sobre el transportador NPC1L1 [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'El NPC1L1 es un transportador de la membrana de los enterocitos que capta colesterol y fitoesteroles de la luz intestinal. La ezetimiba lo inhibe de forma selectiva y reduce la absorción de colesterol, lo que disminuye la cantidad que llega al hígado [1].',
        'Al reducir la llegada de colesterol, el hígado aumenta la expresión de receptores LDL y capta más LDL del plasma. El efecto es complementario al de las estatinas, que inhiben la síntesis hepática [1].',
        'La ezetimiba reduce el LDL alrededor de 15 a 20 % en monoterapia y añade un descenso adicional de aproximadamente 20 a 25 % cuando se combina con una estatina [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral; se absorbe y se glucuroniza de forma extensa [1]'],
            ['Concentración máxima', 'Alrededor de 1 a 2 horas para la ezetimiba y 1 a 3 horas para el glucurónido [1]'],
            ['Metabolismo', 'Glucuronidación en intestino e hígado; no depende de CYP3A4 [1]'],
            ['Semivida', 'Aproximadamente 22 horas [1]'],
            ['Eliminación', 'Biliar y fecal, con una pequeña fracción renal [1]'],
            ['Insuficiencia renal', 'No requiere ajuste [1]'],
            ['Insuficiencia hepática', 'No requiere ajuste en la leve; no se recomienda en moderada o grave [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la ezetimiba está indicada en [1]:',
        { lista: [
          'Hipercolesterolemia primaria, en combinación con una estatina, cuando la estatina sola no controla el LDL.',
          'Hipercolesterolemia primaria en monoterapia, cuando una estatina se considera inadecuada o no se tolera.',
          'Reducción del riesgo de eventos cardiovasculares en pacientes con cardiopatía coronaria y antecedentes de síndrome coronario agudo, añadida a una estatina.',
          'Hipercolesterolemia familiar homocigótica, en combinación con una estatina, como complemento de la dieta y otros tratamientos.',
          'Sitosterolemia familiar homocigótica, como complemento de la dieta.',
        ] },
        'La ezetimiba no sustituye a la estatina cuando esta está indicada y se tolera: su lugar es añadir descenso de LDL o cubrir a quien no puede tomar una estatina [1,7].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { lista: [
          'La dosis es 10 mg una vez al día, con o sin alimentos, a cualquier hora [1].',
          'Cuando se añade a una estatina, se mantiene la estatina en su dosis y se agrega ezetimiba 10 mg [1].',
          'Con secuestrantes de ácidos biliares, tomar la ezetimiba al menos 2 horas antes o 4 horas después [1].',
          'No requiere ajuste en insuficiencia renal [1].',
          'No se recomienda en insuficiencia hepática moderada o grave [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad a la ezetimiba o a los excipientes.',
          'Cuando se administra con una estatina, deben respetarse las contraindicaciones de la estatina.',
          'La combinación con una estatina está contraindicada en el embarazo, la lactancia y la enfermedad hepática activa.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Miopatía y rabdomiólisis: la mayoría de los casos notificados ocurrieron en pacientes que también tomaban una estatina. Suspender si hay síntomas musculares con CK muy elevada.',
          'Enzimas hepáticas: controlar según la estatina asociada; la elevación de transaminasas es poco frecuente.',
          'Fibratos: la combinación con fenofibrato puede aumentar el riesgo de colelitiasis y de enfermedad de la vesícula biliar.',
          'Ciclosporina: puede aumentar la exposición a ezetimiba; vigilar las concentraciones de ciclosporina.',
          'Anticoagulantes cumarínicos: vigilar el INR al añadir ezetimiba.',
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
            ['Estatinas', 'Sin interacción farmacocinética clínicamente importante', 'Se pueden combinar; vigilar síntomas musculares [1]'],
            ['Fenofibrato y gemfibrozilo', 'Aumentan la exposición a ezetimiba y el riesgo de colelitiasis', 'Vigilar; considerar estudios de vesícula si hay sospecha [1]'],
            ['Ciclosporina', 'Aumenta la exposición a ezetimiba varias veces', 'Vigilar las concentraciones de ciclosporina [1]'],
            ['Colestiramina', 'Reduce la absorción de ezetimiba', 'Separar al menos 2 horas [1]'],
            ['Warfarina y cumarínicos', 'Puede aumentar el INR', 'Controlar el INR [1]'],
            ['Antiácidos', 'Reducen la velocidad de absorción, sin cambio relevante de la biodisponibilidad', 'No requiere ajuste [1]'],
          ],
        } },
        'La ezetimiba no induce las enzimas del CYP450 y no altera de forma clínicamente importante la farmacocinética de dapsona, dextrometorfano, digoxina, anticonceptivos orales, glipizida, tolbutamida o midazolam [1].',
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'La ezetimiba es generalmente bien tolerada. Las reacciones más frecuentes son dolor abdominal, diarrea, flatulencia, cefalea, mialgia y fatiga [1].',
        { lista: [
          'Frecuentes: dolor abdominal, diarrea, flatulencia, cefalea, mialgia, fatiga y elevación de ALT y/o AST.',
          'Poco frecuentes: apetito disminuido, parestesia, sofocos, hipertensión, tos, dispepsia, reflujo, náuseas, boca seca, gastritis, prurito, erupción, urticaria, artralgia, espasmos musculares, dolor de cuello o espalda, debilidad muscular, dolor torácico, astenia, edema periférico y CPK elevada.',
          'Raras o de frecuencia no conocida: trombocitopenia, hipersensibilidad, anafilaxia, angioedema, depresión, mareo, pancreatitis, estreñimiento, hepatitis, colelitiasis, colecistitis, eritema multiforme, miopatía y rabdomiólisis.',
        ] },
        'En el estudio IMPROVE-IT, la incidencia de miopatía fue 0,2 % con ezetimiba/simvastatina y 0,1 % con simvastatina; la de rabdomiólisis fue 0,1 % y 0,2 %, respectivamente [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: la combinación con una estatina está contraindicada. En monoterapia, solo se administra si es claramente necesario; no hay datos clínicos en embarazadas [1].',
          'Lactancia: no se debe usar; se desconoce si pasa a la leche humana y los estudios en ratas muestran excreción [1].',
          'Fertilidad: no hay ensayos en humanos; los estudios en animales no muestran efectos [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        { subtitulo: 'IMPROVE-IT: después de un síndrome coronario agudo' },
        'En 18.144 pacientes con cardiopatía coronaria y antecedentes de síndrome coronario agudo, la combinación de ezetimiba/simvastatina 10/40 mg redujo el objetivo compuesto de muerte cardiovascular, eventos coronarios mayores y accidente cerebrovascular no mortal frente a simvastatina 40 mg (32,7 % frente a 34,7 %; HR 0,936) durante una mediana de 6 años [2]. La reducción absoluta fue de aproximadamente 2 %, con un número necesario a tratar cercano a 50 [2].',
        { subtitulo: 'SHARP: enfermedad renal crónica' },
        'En más de 9.000 pacientes con enfermedad renal crónica, la combinación de ezetimiba/simvastatina redujo los eventos ateroscleróticos mayores frente a placebo, sin un aumento significativo de eventos adversos graves [3].',
        'Estos ensayos muestran que la ezetimiba añade beneficio cuando se necesita un descenso adicional de LDL en poblaciones de alto riesgo [2,3,7].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra múltiples presentaciones de ezetimiba, sola y en combinación con estatinas [4].',
          'Unión Europea: la ezetimiba está autorizada para las indicaciones descritas [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de ezetimiba y de sus combinaciones [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con la ezetimiba, la atención farmacéutica se centra en la indicación, la meta de LDL, la tolerancia muscular y la adherencia. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la ezetimiba'],
          filas: [
            ['Indicación', 'LDL fuera de meta con estatina, intolerancia a la estatina, HFHo o sitosterolemia [1]'],
            ['Efectividad', 'LDL de control, dosis, tiempo desde el inicio y adherencia [1]'],
            ['Seguridad', 'Síntomas musculares, transaminasas, colelitiasis si usa fenofibrato e interacciones [1]'],
            ['Adherencia', 'Costo, número de tabletas, creencias y olvidos [5]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'LDL fuera de meta con estatina máxima tolerada', 'Proponer ezetimiba [1,7]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de buena adherencia', 'Revisar la combinación y las causas secundarias [1]'],
            ['Reacción adversa', 'Mialgia con CK elevada', 'Suspender, evaluar y proponer una alternativa [1]'],
            ['Reacción adversa', 'Cólico biliar en combinación con fenofibrato', 'Suspender y estudiar la vesícula [1]'],
            ['Incumplimiento', 'Abandono por costo o por creer que “no sirve”', 'Explicar el beneficio adicional y acordar un plan [5]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de LDL acordada con el paciente y el equipo [7].',
          'Educación: tomar una vez al día, reportar dolor muscular intenso o síntomas de colelitiasis y no suspender sin consultar [1].',
          'Control de lípidos a las 4 a 12 semanas del inicio o del ajuste, y luego según la estabilidad [7].',
          'Revisión de interacciones con estatinas, fibratos, ciclosporina y anticoagulantes [1].',
          'Registro del estado de cada problema según el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La ezetimiba suele percibirse como “una pastilla extra” que no se siente. Esa percepción puede llevar a abandonarla cuando el LDL no baja de inmediato o cuando el paciente ya toma varias tabletas [5,6].',
        { subtitulo: 'Lo que conviene explorar con la ezetimiba' },
        { lista: [
          'Si entiende por qué se añadió a la estatina y qué meta se busca [1].',
          'Si ha tenido dolor muscular o síntomas digestivos [1].',
          'Si ha suspendido la ezetimiba por su cuenta y por qué [5].',
          'El costo, el número de tabletas y la rutina diaria [4].',
          'El uso de fenofibrato, ciclosporina o anticoagulantes, por las interacciones [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Sabe por qué le añadieron ezetimiba a su estatina?',
          '¿Ha notado dolor muscular o molestias digestivas?',
          '¿Ha dejado alguna dosis por olvido o por costo?',
          '¿Toma otros medicamentos para el colesterol o la vesícula?',
        ] },
      ],
    },
  ],
  referencias: [F.ftEzetimiba, F.improveIt, F.sharp, F.invimaCum, F.cipolle2012, F.ramalho2012, F.escDislipidemia2019],
  enlaces: [
    ['Dislipidemias: manejo farmacológico', '/articulos/dislipidemias-manejo-farmacologico'],
    ['Atorvastatina: para qué sirve', '/articulos/atorvastatina-para-que-sirve'],
    ['Alimentos para bajar el colesterol', '/articulos/alimentos-para-bajar-el-colesterol'],
  ],
  seo: {
    titulo: 'Ezetimiba: farmacología y atención farmacéutica',
    descripcion: 'Ezetimiba: mecanismo NPC1L1, farmacocinética, indicaciones, interacciones, evidencia de IMPROVE-IT y SHARP, y atención farmacéutica.',
  },
};

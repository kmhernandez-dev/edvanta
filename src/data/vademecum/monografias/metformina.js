import { F } from '../fuentes.js';

/** Monografía: metformina (hidrocloruro). Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'metformina',
  nombre: 'Metformina',
  titulo: 'Metformina: farmacología, seguridad renal y atención farmacéutica en diabetes tipo 2',
  grupo: 'medicamentos-para-la-diabetes-tipo-2',
  clase: 'Biguanida',
  atc: 'A10BA02',
  marcas: ['Glucophage'],
  vias: ['Oral'],
  mecanismo: 'Reduce la producción hepática de glucosa, mejora la sensibilidad a la insulina y retrasa la absorción intestinal de glucosa; no estimula la secreción de insulina.',
  actualizado: '2026-11-12',
  resumenCorto: 'biguanida de primera línea; no produce hipoglucemia por sí sola y exige vigilancia de la función renal y del ácido láctico.',
  resumen: 'La metformina es la biguanida de referencia para la diabetes tipo 2, especialmente en personas con sobrepeso. Reduce la producción hepática de glucosa y mejora la sensibilidad a la insulina sin estimular su secreción, por lo que no produce hipoglucemia por sí sola. Sus principales retos son la tolerancia gastrointestinal, la función renal, el déficit de vitamina B12 y la rara pero grave acidosis láctica.',
  datosClave: [
    ['Clase', 'Biguanida [1]'],
    ['Código ATC', 'A10BA02 [1]'],
    ['Dosis habitual', '500 u 850 mg dos o tres veces al día con las comidas; máximo 3 g al día [1]'],
    ['Semivida', 'Aproximadamente 6,5 horas [1]'],
    ['Eliminación', 'Renal, sin cambios; requiere ajuste según la TFG [1]'],
    ['Colombia', 'Múltiples registros vigentes, solo y en combinaciones a dosis fijas [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La metformina es una biguanida, una molécula pequeña y muy hidrosoluble que se administra como hidrocloruro. Su fórmula es C4H11N5·HCl y su peso molecular, 165,6. No tiene una estructura relacionada con las sulfonilureas y no se une de forma significativa a las proteínas plasmáticas [1].',
        'A diferencia de otros antidiabéticos, la metformina no se metaboliza en el hígado ni en el intestino: se elimina sin cambios por el riñón. Esa característica explica por qué la función renal es el principal factor que determina su acumulación y su riesgo de toxicidad [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La metformina reduce la glucosa plasmática en ayunas y después de las comidas mediante tres mecanismos principales [1]:',
        { lista: [
          'Disminuye la producción hepática de glucosa al inhibir la gluconeogénesis y la glucogenólisis.',
          'Aumenta la sensibilidad a la insulina en el músculo y mejora la captación y utilización periférica de glucosa.',
          'Retrasa la absorción intestinal de glucosa.',
        ] },
        'No estimula la secreción de insulina, por lo que no produce hipoglucemia cuando se usa sola. Puede reducir el colesterol total, el LDL y los triglicéridos, y se asocia con mantenimiento o ligera disminución del peso corporal [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, biodisponibilidad del 50 al 60 %; la absorción es saturable e incompleta [1]'],
            ['Concentración máxima', 'Aproximadamente 2,5 horas después de la dosis [1]'],
            ['Distribución', 'Se difunde a los eritrocitos; unión a proteínas despreciable [1]'],
            ['Metabolismo', 'No se metaboliza; se excreta sin cambios por la orina [1]'],
            ['Semivida', 'Aproximadamente 6,5 horas [1]'],
            ['Eliminación', 'Renal, por filtración glomerular y secreción tubular [1]'],
            ['Insuficiencia renal', 'La vida media se prolonga y el riesgo de acumulación aumenta; ajustar según la TFG [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la metformina está indicada en [1]:',
        { lista: [
          'Diabetes mellitus tipo 2, especialmente en pacientes con sobrepeso, cuando la dieta y el ejercicio no son suficientes para un control glucémico adecuado.',
          'Adultos: en monoterapia o en combinación con otros antidiabéticos orales o con insulina.',
          'Niños y adolescentes desde los 10 años: en monoterapia o en combinación con insulina.',
        ] },
        'La ficha recuerda que se ha demostrado una reducción de las complicaciones relacionadas con la diabetes en adultos con sobrepeso tratados con metformina como primera línea tras el fracaso de la dieta [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Población', 'Dosis inicial', 'Ajuste', 'Máximo'],
          filas: [
            ['Adultos con TFG ≥90 ml/min', '500 u 850 mg dos o tres veces al día con las comidas', 'Ajustar cada 10 a 15 días según la glucosa', '3 g al día en tres tomas [1]'],
            ['Adultos con TFG 60-89 ml/min', 'La misma dosis inicial', 'Considerar reducción según la función renal', '3 g al día [1]'],
            ['Adultos con TFG 45-59 ml/min', 'Como máximo la mitad de la dosis máxima', 'Revisar factores de riesgo de acidosis láctica', '2 g al día [1]'],
            ['Adultos con TFG 30-44 ml/min', 'Dosis baja', 'Vigilancia estrecha', '1 g al día [1]'],
            ['Niños desde 10 años', '500 u 850 mg una vez al día', 'Ajustar cada 10 a 15 días', '2 g al día en dos o tres tomas [1]'],
          ],
        } },
        { lista: [
          'Se toma durante o después de las comidas para mejorar la tolerancia gastrointestinal [1].',
          'La dosis se aumenta de forma lenta; el escalado rápido es la causa más frecuente de diarrea y abandono [1].',
          'Se debe suspender antes de una prueba con contraste yodado intravascular y no reanudar hasta al menos 48 horas después, con la función renal reevaluada y estable [1].',
          'Se debe suspender en cirugía con anestesia general, espinal o epidural, y reanudar tras 48 horas o cuando se reanude la nutrición oral, con función renal estable [1].',
          'En insuficiencia renal grave (TFG <30 ml/min) está contraindicada [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad a la metformina o a los excipientes.',
          'Acidosis metabólica aguda de cualquier tipo, incluida la acidosis láctica y la cetoacidosis diabética.',
          'Precoma diabético.',
          'Insuficiencia renal grave (TFG <30 ml/min).',
          'Situaciones agudas que puedan alterar la función renal: deshidratación, infección grave, shock.',
          'Enfermedad que pueda provocar hipoxia tisular: insuficiencia cardíaca descompensada, insuficiencia respiratoria, infarto de miocardio reciente, shock.',
          'Insuficiencia hepática, intoxicación alcohólica aguda y alcoholismo.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Acidosis láctica: muy rara pero grave; puede aparecer con empeoramiento agudo de la función renal, enfermedad cardiorrespiratoria o sepsis. Síntomas como disnea, dolor abdominal, calambres, astenia e hipotermia obligan a suspender y buscar atención inmediata.',
          'Función renal: evaluar la TFG antes de iniciar y al menos una vez al año; con mayor frecuencia en personas mayores o con riesgo de progresión renal.',
          'Insuficiencia cardíaca: se puede usar en la insuficiencia cardíaca crónica estable con monitorización; está contraindicada en la insuficiencia cardíaca aguda o inestable.',
          'Déficit de vitamina B12: el uso prolongado reduce su absorción; considerar la causa en anemia megaloblástica.',
          'Enfermedades mitocondriales: no se recomienda por el riesgo de acidosis láctica y complicaciones neurológicas.',
          'Población pediátrica: confirmar el diagnóstico de diabetes tipo 2 antes de iniciar y vigilar el crecimiento y la pubertad.',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento o situación', 'Efecto', 'Qué hacer'],
          filas: [
            ['Alcohol', 'Aumenta el riesgo de acidosis láctica, sobre todo con ayuno o enfermedad hepática', 'Evitar el consumo excesivo [1]'],
            ['Medios de contraste yodados', 'Pueden precipitar nefropatía y acumulación de metformina', 'Suspender antes o en el momento y reanudar tras 48 horas con función renal estable [1]'],
            ['Antiinflamatorios, IECA, ARA-II, diuréticos', 'Pueden alterar la función renal y aumentar el riesgo de acidosis láctica', 'Vigilar la función renal al iniciarlos o cambiar la dosis [1]'],
            ['Glucocorticoides y simpaticomiméticos', 'Aumentan la glucosa', 'Controlar más frecuentemente y ajustar si hace falta [1]'],
            ['Inhibidores de OCT1 (verapamilo)', 'Pueden reducir la eficacia de la metformina', 'Vigilar la respuesta glucémica [1]'],
            ['Inductores de OCT1 (rifampicina)', 'Pueden aumentar la absorción y la eficacia', 'Vigilar la glucemia [1]'],
            ['Inhibidores de OCT2 (cimetidina, dolutegravir, ranolazina, trimetoprim, vandetanib, isavuconazol)', 'Pueden reducir la eliminación de metformina y aumentar sus concentraciones', 'Precaución, sobre todo en insuficiencia renal; considerar ajuste [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones adversas más frecuentes son gastrointestinales y aparecen al inicio del tratamiento: náuseas, vómitos, diarrea, dolor abdominal y pérdida de apetito. Suelen mejorar con el tiempo, con tomas más frecuentes y con un aumento lento de la dosis [1].',
        { lista: [
          'Muy frecuentes: trastornos gastrointestinales como náuseas, vómitos, diarrea, dolor abdominal y pérdida de apetito.',
          'Frecuentes: alteraciones del gusto.',
          'Muy raras: acidosis láctica, reducción de la absorción de vitamina B12, alteración de las pruebas hepáticas o hepatitis, eritema, prurito y urticaria.',
        ] },
        'La acidosis láctica es una urgencia médica. Se sospecha con síntomas inespecíficos en un paciente de riesgo y se confirma con pH bajo, lactato elevado y alteración del equilibrio ácido-base [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: la información limitada no sugiere un aumento de malformaciones, pero se recomienda tratar la diabetes con insulina durante el embarazo para mantener la glucosa lo más cerca posible de la normalidad [1].',
          'Lactancia: la metformina pasa a la leche materna; no se han observado efectos adversos en los lactantes, pero la información es limitada y no se recomienda la lactancia durante el tratamiento [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El estudio UKPDS 34 evaluó a adultos con diabetes tipo 2 y sobrepeso que no lograban el control con dieta sola. La metformina redujo, frente a la dieta sola [2]:',
        { tabla: {
          columnas: ['Resultado', 'Metformina', 'Dieta sola'],
          filas: [
            ['Complicaciones relacionadas con la diabetes', '29,8 casos por 1.000 pacientes-año', '43,3 casos por 1.000 pacientes-año [2]'],
            ['Mortalidad relacionada con la diabetes', '7,5 casos por 1.000 pacientes-año', '12,7 casos por 1.000 pacientes-año [2]'],
            ['Mortalidad por cualquier causa', '13,5 casos por 1.000 pacientes-año', '20,6 casos por 1.000 pacientes-año [2]'],
            ['Infarto de miocardio', '11 casos por 1.000 pacientes-año', '18 casos por 1.000 pacientes-año [2]'],
          ],
        } },
        'El beneficio se observó en el grupo con sobrepeso tratado como primera línea; no se demostró el mismo efecto cuando la metformina se usó como segunda línea después de una sulfonilurea [1]. Ese matiz es importante para interpretar la evidencia y para elegir el momento de inicio.',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra múltiples presentaciones de metformina, sola y en combinaciones con otros antidiabéticos [3].',
          'Unión Europea: la metformina está autorizada para las indicaciones descritas en la ficha técnica [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de metformina y de sus combinaciones; las indicaciones pueden variar [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con la metformina, la atención farmacéutica se centra en la tolerancia gastrointestinal, la función renal, la vitamina B12 y la adherencia. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la metformina'],
          filas: [
            ['Indicación', 'Diabetes tipo 2, sobrepeso, función renal y contraindicaciones; confirmar el diagnóstico en niños [1]'],
            ['Efectividad', 'HbA1c, glucosa en ayunas y posprandial, peso y adherencia [1]'],
            ['Seguridad', 'TFG, síntomas gastrointestinales, vitamina B12, alcohol, contraste y cirugía [1]'],
            ['Adherencia', 'Diarrea, número de tomas, costo y creencias [4]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'HbA1c fuera de meta con metformina en dosis adecuada', 'Proponer la combinación según comorbilidades [1]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de buena adherencia', 'Revisar la combinación y remitir [1]'],
            ['Reacción adversa', 'Diarrea o náuseas persistentes', 'Dividir la dosis, tomarla con comida y titular más lento [1]'],
            ['Reacción adversa', 'Déficit de vitamina B12', 'Solicitar niveles y valorar suplementación con el equipo [1]'],
            ['Dosis demasiado alta', 'TFG en descenso sin ajuste de dosis', 'Revisar la TFG y ajustar o suspender [1]'],
            ['Incumplimiento', 'Abandono por molestias gastrointestinales', 'Escuchar la experiencia y ajustar el esquema [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de HbA1c acordada con el paciente y el equipo tratante [1].',
          'Educación: tomar con las comidas, no suspender sin consultar, suspender antes de contraste o cirugía y reportar síntomas de acidosis láctica [1].',
          'Control de la TFG antes de iniciar y al menos una vez al año; con más frecuencia si hay riesgo renal [1].',
          'Revisión de la vitamina B12 en uso prolongado, sobre todo si hay anemia o síntomas neurológicos [1].',
          'Registro del estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La metformina tiene una reputación ambivalente: se considera “la de siempre”, pero también “la que da diarrea” o “la que daña el riñón”. Esa experiencia pesa más que la ficha técnica [4,5].',
        { subtitulo: 'Lo que conviene explorar con la metformina' },
        { lista: [
          'Cómo tolera la metformina: cuándo aparecen las molestias, si las relaciona con alguna comida y si ha dejado dosis por esa razón [1].',
          'El miedo a que “dañe el riñón”: explicar que la función renal se vigila y que el ajuste busca precisamente protegerlo [1].',
          'La idea de que “como no me da hipoglucemia, no sirve”: recordar que su beneficio es gradual y sostenido [1].',
          'El uso de alcohol y de antiinflamatorios, que pueden aumentar el riesgo renal o de acidosis [1].',
          'El costo y la cantidad de tabletas, sobre todo si toma varias combinaciones [3].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Cómo le cae la metformina al estómago?',
          '¿Ha dejado de tomar alguna dosis por diarrea o náuseas?',
          '¿Sabe qué hacer si le van a hacer una tomografía con contraste?',
          '¿Qué espera que la metformina haga por su diabetes?',
        ] },
      ],
    },
  ],
  referencias: [F.ftMetformina, F.ukpds34, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Metformina: para qué sirve y cómo se toma', '/articulos/metformina-para-que-sirve'],
    ['Diabetes tipo 2: tratamiento y seguimiento', '/articulos/diabetes-tipo-2-tratamiento'],
    ['Medicamentos para la diabetes tipo 2: preguntas frecuentes', '/articulos/medicamentos-diabetes-tipo-2-preguntas-frecuentes'],
  ],
  seo: {
    titulo: 'Metformina: farmacología, riñón y atención farmacéutica',
    descripcion: 'Metformina: mecanismo, farmacocinética, dosis según la TFG, acidosis láctica, vitamina B12, UKPDS 34 y atención farmacéutica.',
  },
};

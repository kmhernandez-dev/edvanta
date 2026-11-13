import { F } from '../fuentes.js';

/** Monografía: hidroclorotiazida. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'hidroclorotiazida',
  nombre: 'Hidroclorotiazida',
  titulo: 'Hidroclorotiazida: farmacología, electrolitos y atención farmacéutica',
  grupo: 'medicamentos-para-la-hipertension-arterial',
  clase: 'Diurético tiazídico',
  atc: 'C03AA03',
  vias: ['Oral'],
  mecanismo: 'Inhibe la reabsorción de sodio y cloro en el túbulo contorneado distal, aumenta la diuresis y reduce el volumen plasmático y la resistencia periférica.',
  actualizado: '2026-11-12',
  resumenCorto: 'tiazida clásica; baja la presión y el edema, con hipopotasemia e hiponatremia como riesgos que exigen monitorización.',
  resumen: 'La hidroclorotiazida es una benzotiadiazina que inhibe la reabsorción de sodio y cloro en el túbulo contorneado distal. Se usa en hipertensión, en edemas por insuficiencia cardíaca, renal o hepática, en la prevención de cálculos de oxalato cálcico y en la diabetes insípida nefrogénica. Su eficacia es sólida, pero exige vigilar el potasio, el sodio, la función renal, el ácido úrico y la piel.',
  datosClave: [
    ['Clase', 'Diurético tiazídico [1]'],
    ['Código ATC', 'C03AA03 [1]'],
    ['Dosis en hipertensión', '12,5 a 50 mg una vez al día; inicio 12,5 o 25 mg [1]'],
    ['Inicio de la diuresis', 'Aproximadamente 2 horas; máximo a las 4 horas [1]'],
    ['Eliminación', 'Renal, principalmente sin cambios [1]'],
    ['Colombia', 'Múltiples registros vigentes, solo y en combinaciones a dosis fijas [5]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La hidroclorotiazida es una benzotiadiazina con un grupo sulfonamida. Su fórmula es C7H8ClN3O4S2 y su peso molecular, 297,7. Deriva de la clorotiazida, pero es más potente y tiene una duración de acción mayor [1].',
        'El grupo sulfonamida es responsable de algunas reacciones de hipersensibilidad y de la asociación con glaucoma agudo de ángulo cerrado y derrame coroideo, que se describen en la ficha técnica [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La hidroclorotiazida actúa en el túbulo contorneado distal del riñón, donde inhibe el cotransportador de sodio y cloro. Al reducir la reabsorción de sodio, aumenta la excreción de sodio, cloro y agua, y en menor medida la de potasio, magnesio y bicarbonato [1].',
        'El efecto antihipertensivo tiene dos componentes: al inicio, la reducción del volumen plasmático y del gasto cardíaco; después, una disminución de la resistencia vascular periférica que se mantiene aunque el volumen se recupere parcialmente. El efecto completo tarda de 3 a 4 semanas [1].',
        'Por encima de una dosis determinada, el efecto diurético y antihipertensivo alcanza una meseta, mientras que los efectos adversos metabólicos siguen aumentando. Por eso, si la presión no baja con 25 o 50 mg, no se recomienda seguir subiendo la dosis: se añade otro grupo [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, biodisponibilidad del 65 al 80 %; los alimentos retrasan la absorción [1]'],
            ['Concentración máxima', 'De 1 a 5 horas [1]'],
            ['Inicio y duración', 'Diuresis a las 2 horas, máximo a las 4 horas y duración de 6 a 12 horas [1]'],
            ['Distribución', 'Volumen de 4 a 8 l/kg; unión a proteínas del 40 al 68 % [1]'],
            ['Metabolismo', 'No se metaboliza de forma significativa [1]'],
            ['Eliminación', 'Renal; más del 95 % se excreta sin cambios, al menos el 61 % en 24 horas [1]'],
            ['Semivida', 'Muy variable, de 5 a 25 horas; aumenta en insuficiencia renal [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la hidroclorotiazida está indicada en [1]:',
        { lista: [
          'Hipertensión arterial, sola o en combinación con otros antihipertensivos.',
          'Edema por insuficiencia cardíaca crónica estable leve a moderada (clases II y III de la NYHA).',
          'Edema por insuficiencia renal.',
          'Ascitis por cirrosis hepática en pacientes estables y bajo control médico.',
          'Prevención de cálculos recurrentes de oxalato cálcico en pacientes con hipercalciuria idiopática normocalcémica.',
          'Diabetes insípida nefrogénica cuando no está indicada la hormona antidiurética.',
        ] },
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis inicial', 'Mantenimiento', 'Máximo'],
          filas: [
            ['Hipertensión', '12,5 o 25 mg una vez al día', '12,5 a 50 mg una vez al día', '50 mg al día [1]'],
            ['Edema', '12,5 a 25 mg una vez al día', 'La dosis efectiva más baja', '50 mg al día [1]'],
            ['Cálculos de oxalato cálcico', '25 mg una vez al día', '25 a 50 mg una vez al día', '50 mg al día [1]'],
            ['Diabetes insípida nefrogénica', 'Hasta 100 mg al día en adultos', 'Individualizar', 'Según respuesta [1]'],
          ],
        } },
        { lista: [
          'Se toma por la mañana, con o sin alimentos, para evitar la diuresis nocturna [1].',
          'El efecto antihipertensivo completo tarda de 3 a 4 semanas; no se debe aumentar la dosis antes de ese plazo sin evaluar la respuesta [1].',
          'En insuficiencia renal leve a moderada no requiere ajuste inicial; en enfermedad grave (filtrado glomerular menor de 30 ml/min) pierde eficacia y debe usarse con precaución [1].',
          'En insuficiencia hepática leve a moderada no requiere ajuste; en insuficiencia grave puede precipitar encefalopatía hepática y síndrome hepatorrenal [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad a la hidroclorotiazida o a los excipientes.',
          'Anuria.',
          'Hipertensión durante el embarazo.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Hipopotasemia: puede ser grave y favorecer arritmias, sobre todo con digitálicos. Controlar el potasio al inicio y a las 3 o 4 semanas, y luego de forma periódica.',
          'Hiponatremia: puede causar náuseas, desorientación, apatía y convulsiones; vigilar el sodio, especialmente en personas mayores, con ascitis o con edema por síndrome nefrótico.',
          'Hipomagnesemia, hiperuricemia y gota, hiperglucemia, hipercalcemia e hiperlipidemia.',
          'Derrame coroideo, miopía aguda y glaucoma secundario de ángulo cerrado: suspender y buscar atención oftalmológica urgente si aparece dolor ocular o pérdida de visión.',
          'Cáncer de piel no melanoma: el riesgo aumenta con la dosis acumulada; recomendar protección solar y revisión de la piel.',
          'Síndrome de dificultad respiratoria aguda (SDRA): raro, pero potencialmente fatal; suspender si aparece disnea, fiebre o hipotensión poco después de la toma.',
          'Lupus eritematoso: puede activarse durante el tratamiento.',
          'Insuficiencia renal: puede precipitar azoemia y perder eficacia en enfermedad grave.',
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
            ['Litio', 'Aumenta las concentraciones de litio y su toxicidad', 'Monitorizar el litio [1]'],
            ['Otros antihipertensivos', 'Potencian la hipotensión', 'Ajustar y vigilar [1]'],
            ['Relajantes musculares', 'Potencian el bloqueo neuromuscular', 'Vigilar [1]'],
            ['Corticosteroides, ACTH, anfotericina, penicilina G, salicilatos', 'Aumentan la pérdida de potasio', 'Monitorizar el potasio [1]'],
            ['Antidepresivos, antipsicóticos, antiepilépticos', 'Pueden aumentar la hiponatremia', 'Vigilar el sodio [1]'],
            ['Insulina y antidiabéticos', 'Pueden requerir ajuste por el efecto hiperglucemiante', 'Monitorizar la glucemia [1]'],
            ['Digitálicos', 'La hipopotasemia y la hipomagnesemia favorecen la toxicidad', 'Corregir electrolitos y vigilar [1]'],
            ['Antiinflamatorios no esteroideos', 'Reducen el efecto diurético y antihipertensivo y pueden dañar el riñón', 'Usar con precaución [1]'],
            ['Alopurinol', 'Más reacciones de hipersensibilidad', 'Vigilar [1]'],
            ['Amantadina', 'Más efectos adversos', 'Vigilar [1]'],
            ['Ciclofosfamida y metotrexato', 'Menor excreción renal y más mielosupresión', 'Vigilar [1]'],
            ['Anticolinérgicos', 'Aumentan la biodisponibilidad de la tiazida', 'Considerar [1]'],
            ['Colestiramina y colestipol', 'Reducen la absorción de la tiazida', 'Separar al menos 4 horas [1]'],
            ['Vitamina D y sales de calcio', 'Pueden aumentar el calcio', 'Vigilar el calcio [1]'],
            ['Ciclosporina', 'Aumenta el riesgo de hiperuricemia y gota', 'Vigilar [1]'],
            ['Diazóxido', 'Aumenta el efecto hiperglucemiante', 'Vigilar la glucemia [1]'],
            ['Metildopa', 'Casos de anemia hemolítica', 'Vigilar [1]'],
            ['Alcohol, barbitúricos y opioides', 'Potencian la hipotensión ortostática', 'Advertir [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones más frecuentes son hipopotasemia, aumento de lípidos, hiponatremia, hipomagnesemia, hiperuricemia, urticaria, erupción, disminución del apetito, náuseas leves, vómitos, hipotensión ortostática e impotencia [1].',
        { lista: [
          'Raras: trombocitopenia, cefalea, mareo, trastornos del sueño, depresión, parestesia, insuficiencia visual, fotosensibilidad, malestar abdominal, estreñimiento, diarrea, colestasis, ictericia, arritmias, hipercalcemia, hiperglucemia, glucosuria y empeoramiento del control diabético.',
          'Muy raras: leucopenia, agranulocitosis, anemia hemolítica, reacciones de hipersensibilidad, neumonitis, edema pulmonar, alcalosis hipoclorémica, vasculitis necrotizante, necrólisis epidérmica tóxica, lupus cutáneo, pancreatitis y SDRA.',
          'Frecuencia no conocida: cáncer de piel no melanoma, derrame coroideo, glaucoma de ángulo cerrado, insuficiencia renal aguda y anemia aplásica.',
        ] },
        'El riesgo de cáncer de piel no melanoma se ha asociado con dosis acumuladas altas. No es una razón para suspender la tiazida en todos los pacientes, pero sí para revisar la piel, recomendar protección solar y elegir otra alternativa cuando el riesgo dermatológico sea alto [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: la hipertensión durante el embarazo es una contraindicación. Las tiazidas pueden reducir la perfusión placentaria y se han asociado con ictericia y trombocitopenia en el recién nacido; no se usan para tratar la preeclampsia [1].',
          'Lactancia: la hidroclorotiazida pasa a la leche y puede inhibir la lactancia; se debe evitar en madres lactantes [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La evidencia de las tiazidas en hipertensión es amplia, pero conviene precisar qué se estudió:',
        { lista: [
          'ALLHAT comparó clortalidona, un diurético tiazídico similar, con amlodipino y lisinopril en 33.357 pacientes de alto riesgo. La clortalidona fue superior a amlodipino para prevenir insuficiencia cardíaca y superior a lisinopril en algunos desenlaces combinados; no hubo diferencia en el objetivo coronario principal [2].',
          'La revisión sistemática Cochrane de 2018 concluyó que los diuréticos tiazídicos reducen la mortalidad y los eventos cardiovasculares en hipertensión y son una opción de primera línea, con un perfil de efectos adversos predecible [3].',
          'El metaanálisis de 147 ensayos de Law y colaboradores mostró que la reducción de la presión arterial explica la mayor parte del beneficio cardiovascular, independientemente del grupo farmacológico [4].',
        ] },
        'La hidroclorotiazida no tiene un ensayo pivotal propio con desenlaces cardiovasculares comparable a LIFE o SOLVD. Su lugar se sostiene por la evidencia de clase de las tiazidas, su eficacia antihipertensiva y su uso extendido en combinaciones [2-4].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra múltiples presentaciones de hidroclorotiazida, sola y en combinaciones con IECA, ARA-II y otros antihipertensivos [5].',
          'Unión Europea: la hidroclorotiazida está autorizada para las indicaciones descritas [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de hidroclorotiazida y de sus combinaciones; las indicaciones pueden variar [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con la hidroclorotiazida, la atención farmacéutica se centra en los electrolitos, la función renal, la presión y la adherencia. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [6].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la hidroclorotiazida'],
          filas: [
            ['Indicación', 'Hipertensión, edema, cálculos de oxalato o diabetes insípida; descartar anuria y embarazo [1]'],
            ['Efectividad', 'Presión, edema, peso, diuresis y adherencia [1]'],
            ['Seguridad', 'Potasio, sodio, magnesio, ácido úrico, glucemia, calcio, creatinina, piel y síntomas de gota [1]'],
            ['Adherencia', 'Diuresis, número de tabletas, costo, creencias y olvidos [6]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'Hipertensión no controlada con monoterapia', 'Proponer la combinación recomendada por la guía [1]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de dosis adecuada y buena adherencia', 'Revisar la combinación y remitir [1]'],
            ['Reacción adversa', 'Hipopotasemia, hiponatremia o hiperuricemia', 'Ajustar dosis, revisar interacciones y remitir [1]'],
            ['Reacción adversa', 'Dolor ocular o pérdida de visión', 'Suspender y remitir de urgencia a oftalmología [1]'],
            ['Reacción adversa', 'Lesión cutánea nueva o sospechosa', 'Remitir a evaluación dermatológica [1]'],
            ['Incumplimiento', 'Suspensión por diuresis, calambres o costo', 'Simplificar el esquema y explicar el objetivo [6]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de presión o de edema acordada con el paciente y el equipo tratante [1].',
          'Educación: tomar por la mañana, no suspender sin consultar, reportar calambres, debilidad, confusión o disminución de la orina [1].',
          'Control de electrolitos y creatinina antes de iniciar y a las 3 o 4 semanas; luego de forma periódica, sobre todo en personas mayores, con diuréticos, IECA, ARA-II o enfermedad renal [1].',
          'Revisión de la piel y recomendación de protección solar [1].',
          'Registro del estado de cada problema según el modelo [6].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La diuresis y los calambres son las experiencias que más afectan la adherencia a la hidroclorotiazida. Escucharlas permite ajustar el horario y prevenir abandonos [6,7].',
        { subtitulo: 'Lo que conviene explorar con la hidroclorotiazida' },
        { lista: [
          'Cuántas veces orina al día y si tiene que levantarse en la noche; ajustar el horario de la toma [1].',
          'Calambres, debilidad, palpitaciones o confusión, que pueden sugerir hipopotasemia o hiponatremia [1].',
          'La idea de que “la tiazida daña el riñón” o “sube el azúcar”: explicar que se vigila y que el balance beneficio-riesgo se evalúa en cada persona [1].',
          'El costo y la cantidad de tabletas, sobre todo si toma varias combinaciones [5].',
          'La exposición solar y los antecedentes de lesiones cutáneas [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿A qué hora toma la hidroclorotiazida y cómo le va con la diuresis?',
          '¿Ha tenido calambres, debilidad o mareo al levantarse?',
          '¿Ha notado cambios en la piel, lunares nuevos o lesiones que no sanan?',
          '¿Qué otras pastillas toma y cuántas veces al día?',
        ] },
      ],
    },
  ],
  referencias: [F.ftHidroclorotiazida, F.allhat, F.wright2018, F.law2009, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Hidroclorotiazida: para qué sirve y efectos secundarios', '/articulos/hidroclorotiazida-para-que-sirve'],
    ['Medicamentos para la presión alta', '/articulos/medicamentos-para-la-presion-alta'],
    ['Guías de hipertensión 2024 y 2025: qué cambia para el QF', '/articulos/guias-de-hipertension-2024-2025-que-cambia'],
  ],
  seo: {
    titulo: 'Hidroclorotiazida: farmacología y atención farmacéutica',
    descripcion: 'Hidroclorotiazida: mecanismo tiazídico, farmacocinética, indicaciones, electrolitos, interacciones, evidencia y atención farmacéutica.',
  },
};

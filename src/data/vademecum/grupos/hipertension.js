import { F } from '../fuentes.js';

/**
 * Grupo terapéutico: medicamentos para la hipertensión arterial.
 * Las citas [n] apuntan a `referencias` (Vancouver). Datos verificados el
 * 12-nov-2026 en las fichas técnicas de CIMA, las guías ESC 2024, la OMS,
 * la Cuenta de Alto Costo, el CUM del INVIMA y PubMed.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-para-la-hipertension-arterial',
  nombre: 'Medicamentos para la hipertensión arterial',
  titulo: 'Medicamentos para la hipertensión arterial: farmacología, evidencia y atención farmacéutica',
  actualizado: '2026-11-12',
  resumen: 'La hipertensión arterial es el factor de riesgo modificable más importante de enfermedad cardiovascular y renal. Los cuatro grupos de primera línea actúan por vías distintas: los IECA reducen la formación de angiotensina II, los ARA-II bloquean su receptor, los calcioantagonistas relajan el músculo arterial y los diuréticos tiazídicos favorecen la eliminación de sodio. Este grupo reúne su farmacología, la evidencia de los ensayos pivotales, las combinaciones recomendadas, la monitorización de la seguridad y la atención farmacéutica con el modelo de Minnesota.',
  datosClave: [
    ['Grupos ATC', 'C09 (IECA y ARA-II), C08 (calcioantagonistas) y C03 (diuréticos)'],
    ['Primera línea', 'IECA, ARA-II, calcioantagonistas dihidropiridínicos y diuréticos tiazídicos o similares [4]'],
    ['Meta habitual', 'Presión sistólica de 120 a 129 mmHg en la mayoría de los pacientes tratados, si se tolera [4]'],
    ['Colombia', 'Múltiples registros vigentes de los cuatro grupos, solos y en combinaciones a dosis fijas [3]'],
  ],
  secciones: [
    {
      id: 'la-hipertension-como-factor-de-riesgo',
      titulo: 'La hipertensión como factor de riesgo',
      bloques: [
        'La hipertensión arterial es una elevación persistente de la presión arterial que, con el tiempo, daña el corazón, el cerebro, los riñones y la retina. Es el principal factor de riesgo modificable de enfermedad cardiovascular y de enfermedad renal crónica. La Organización Mundial de la Salud estima que 1.400 millones de adultos viven con hipertensión y que solo algo más de una de cada cinco personas la tiene controlada [1].',
        'En Colombia, la Cuenta de Alto Costo reportó más de 6,7 millones de personas con hipertensión entre julio de 2024 y junio de 2025, y aproximadamente una de cada tres no tenía la presión controlada [2]. Detrás de cada paciente no controlado suele haber un problema que el equipo de salud puede resolver: una técnica de medición deficiente, una combinación mal elegida, una interacción, un efecto adverso que nadie preguntó o un tratamiento que el paciente abandonó porque no sentía nada.',
        'Las guías no usan exactamente el mismo umbral. La guía europea de 2024 distingue la presión elevada (120 a 139 mmHg de sistólica y 70 a 89 mmHg de diastólica) de la hipertensión (140/90 mmHg o más en mediciones repetidas) [4]. Más allá del número con el que se etiquete, el objetivo del tratamiento es reducir el riesgo cardiovascular y renal, no solo bajar una cifra.',
      ],
    },
    {
      id: 'fisiopatologia-y-dianas',
      titulo: 'Fisiopatología y dianas farmacológicas',
      bloques: [
        'La presión arterial depende del gasto cardíaco y de la resistencia periférica. El sistema renina-angiotensina-aldosterona (SRAA) es uno de sus reguladores principales: el riñón libera renina, que convierte el angiotensinógeno en angiotensina I; la enzima convertidora de angiotensina (ECA) la transforma en angiotensina II, que se une al receptor AT1, produce vasoconstricción, estimula la secreción de aldosterona y retiene sodio y agua. La aldosterona, a su vez, favorece la retención de sodio y la pérdida de potasio [1,4].',
        'Los cuatro grupos de primera línea actúan en puntos distintos de esa fisiología. La tabla resume la diana y el efecto esperado:',
        { tabla: {
          columnas: ['Diana', 'Función fisiológica', 'Medicamentos', 'Efecto farmacológico'],
          filas: [
            ['ECA', 'Convierte angiotensina I en angiotensina II y degrada bradicinina [1]', 'Enalapril, lisinopril, ramipril [1,4]', 'Menos angiotensina II y más bradicinina; vasodilatación y menor aldosterona [1]'],
            ['Receptor AT1', 'Media la vasoconstricción y la liberación de aldosterona [1]', 'Losartán, valsartán, telmisartán [1,4]', 'Bloqueo del receptor sin inhibir la ECA; menos tos que con IECA [1]'],
            ['Canales de calcio tipo L', 'Entrada de calcio al músculo liso vascular y cardíaco [4]', 'Amlodipino, nifedipino de liberación prolongada [4]', 'Relajación del músculo liso arterial y reducción de la resistencia periférica [4]'],
            ['Túbulo contorneado distal', 'Reabsorción de sodio y cloro [4]', 'Hidroclorotiazida, clortalidona, indapamida [4]', 'Menor reabsorción de sodio, diuresis y reducción del volumen [4]'],
          ],
        } },
        'Los IECA y los ARA-II no deben combinarse entre sí: el bloqueo dual del SRAA aumenta el riesgo de hipotensión, hiperpotasemia y deterioro renal sin un beneficio que lo justifique [4].',
      ],
    },
    {
      id: 'comparativa-de-la-evidencia',
      titulo: 'Comparativa de la evidencia',
      bloques: [
        'Los ensayos pivotales no son comparables entre sí: difieren en población, comparador, duración y desenlace. La tabla sirve para ubicar el tipo de beneficio que respalda a cada grupo, no para elegir un medicamento por una cifra aislada.',
        { tabla: {
          columnas: ['Fármaco o grupo', 'Ensayo', 'Población', 'Resultado principal'],
          filas: [
            ['Losartán', 'LIFE [5]', '9.193 hipertensos de 55 a 80 años con hipertrofia ventricular izquierda; 4,8 años', 'Menos eventos cardiovasculares combinados que atenolol (13 %) y menos accidentes cerebrovasculares (25 %) [5]'],
            ['Losartán', 'RENAAL [6]', '1.513 adultos con diabetes tipo 2 y nefropatía; 3,4 años', 'Menos progresión renal combinada (16,1 %) y menos insuficiencia renal terminal (28,6 %) que placebo [6]'],
            ['Enalapril', 'SOLVD tratamiento [7]', '2.569 pacientes con insuficiencia cardíaca sintomática y fracción de eyección ≤35 %', 'Menor mortalidad (16 %) y menos hospitalizaciones por insuficiencia cardíaca [7]'],
            ['Enalapril', 'SOLVD prevención [8]', '4.228 pacientes con disfunción ventricular asintomática', 'Menos muerte o aparición de insuficiencia cardíaca (29 %) [8]'],
            ['Amlodipino', 'ALLHAT [9]', '33.357 hipertensos de 55 años o más con otro factor de riesgo; 4,9 años', 'Sin diferencia en el objetivo coronario frente a clortalidona; más insuficiencia cardíaca que con clortalidona [9]'],
            ['Tiazidas', 'ALLHAT y revisión Cochrane [9,10]', 'Hipertensión de leve a moderada', 'Los diuréticos tiazídicos reducen eventos cardiovasculares y son una opción de primera línea [9,10]'],
          ],
        } },
        'Una advertencia importante: ALLHAT estudió clortalidona, un diurético tiazídico similar, no hidroclorotiazida. Los resultados se usan como evidencia de clase, no como una prueba específica de cada tiazida [9].',
      ],
    },
    {
      id: 'combinaciones',
      titulo: 'Combinaciones y tratamiento escalonado',
      bloques: [
        'La guía europea de 2024 recomienda iniciar el tratamiento de la mayoría de los pacientes con una combinación de dos fármacos en dosis bajas, preferiblemente en una sola tableta, en lugar de un solo fármaco en dosis alta [4]. Las combinaciones preferidas son un IECA o un ARA-II con un calcioantagonista dihidropiridínico o con un diurético tiazídico. La combinación de dos fármacos que actúan sobre el SRAA (IECA con ARA-II) está desaconsejada [4].',
        'Si la presión no alcanza la meta con dos fármacos, se añade un tercero de los grupos de primera línea. Cuando sigue alta a pesar de tres fármacos en dosis adecuadas, incluido un diurético, se habla de hipertensión resistente: antes de añadir más medicamentos hay que descartar una técnica de medición incorrecta, la falta de adherencia, el consumo de sustancias que suben la presión y las causas secundarias. Si todo está en orden, la guía europea propone añadir espironolactona [4].',
        'Las combinaciones a dosis fijas reducen el número de tabletas y mejoran la adherencia, pero exigen revisar que no haya duplicaciones. Un paciente puede estar tomando losartán/hidroclorotiazida y, además, losartán solo por otra fórmula; esa revisión es una de las intervenciones más rentables del farmacéutico [4].',
      ],
    },
    {
      id: 'seguridad-y-monitorizacion',
      titulo: 'Seguridad y monitorización',
      bloques: [
        'Cada grupo tiene un perfil de seguridad distinto y una monitorización específica:',
        { lista: [
          'IECA y ARA-II: hiperpotasemia, aumento de creatinina, hipotensión y, rara vez, angioedema. La tos seca es característica de los IECA y desaparece al suspenderlos. Conviene medir potasio y creatinina antes de iniciar y entre una y dos semanas después de empezar o de subir la dosis, sobre todo en enfermedad renal crónica, diabetes, edad avanzada, diuréticos o antiinflamatorios [4].',
          'Calcioantagonistas dihidropiridínicos: edema periférico, cefalea, rubefacción y palpitaciones. El edema depende de la dosis y de la dilatación arteriolar; no siempre significa retención de líquidos ni insuficiencia cardíaca [4].',
          'Diuréticos tiazídicos: hipopotasemia, hiponatremia, hipomagnesemia, hiperuricemia, hiperglucemia e hipercalcemia. También pueden producir fotosensibilidad y se han asociado con cáncer de piel no melanoma en exposiciones acumuladas altas; conviene revisar la piel y recomendar protección solar [1].',
          'Todos: hipotensión sintomática al inicio o tras subir la dosis, especialmente en personas mayores, con depleción de volumen o con otros antihipertensivos [4].',
        ] },
        'La monitorización no es solo analítica. También incluye la técnica de medición, la presión en casa, los síntomas, la adherencia y los medicamentos que el paciente compra sin fórmula, como antiinflamatorios o descongestionantes [4].',
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en hipertensión: el modelo de Minnesota',
      destacado: true,
      bloques: [
        'El proceso de atención al paciente del modelo de Minnesota se aplica a la hipertensión con las mismas cuatro preguntas de siempre: ¿el medicamento está indicado?, ¿es efectivo?, ¿es seguro? y ¿el paciente puede y quiere tomarlo? [11].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar en hipertensión'],
          filas: [
            ['Indicación', 'Diagnóstico y meta, comorbilidades (diabetes, enfermedad renal, insuficiencia cardíaca), embarazo y duplicaciones [4]'],
            ['Efectividad', 'Presión en consultorio y en casa, técnica de medición, tiempo desde el inicio o el cambio de dosis [4]'],
            ['Seguridad', 'Potasio, creatinina, síntomas de hipotensión, tos, edema, calambres, gota e interacciones [4]'],
            ['Adherencia', 'Costo, número de tabletas, horario, efectos adversos, creencias y olvidos [11]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'Hipertensión diagnosticada sin tratamiento o con una sola medida aislada', 'Confirmar el diagnóstico y remitir para iniciar tratamiento [4]'],
            ['Medicamento inefectivo', 'Presión fuera de meta a pesar de dosis adecuada y buena adherencia', 'Revisar la combinación y proponer un cambio al prescriptor [4]'],
            ['Dosis demasiado baja', 'Paciente con dosis inicial que nunca se tituló', 'Proponer el ajuste según la guía y la tolerancia [4]'],
            ['Reacción adversa', 'Tos persistente con un IECA, edema con amlodipino o hipotensión sintomática', 'Documentar y proponer una alternativa [4]'],
            ['Dosis demasiado alta', 'Hipotensión, hiperpotasemia o deterioro renal tras combinaciones', 'Revisar dosis y función renal con el prescriptor [4]'],
            ['Incumplimiento', 'Suspensión por costo, olvido o por sentirse bien', 'Simplificar el esquema, explicar el objetivo y acordar un plan [11]'],
            ['Farmacoterapia innecesaria', 'Duplicación de dos fármacos del mismo grupo o doble bloqueo del SRAA', 'Detectar y comunicar al prescriptor [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta acordada con el paciente, no solo con la guía: presión, síntomas, tolerancia y calidad de vida.',
          'Educación: tomar el medicamento todos los días, no suspenderlo cuando la presión esté normal, medir en casa con técnica correcta y consultar antes de usar antiinflamatorios o descongestionantes [4].',
          'Seguimiento inicial entre una y cuatro semanas según el cambio, y luego cada tres a seis meses si está estable [4].',
          'Registro del estado de cada problema: resuelto, mejorado, estable, sin mejoría o empeorado [11].',
        ] },
        { subtitulo: 'La experiencia farmacoterapéutica' },
        'El modelo de Minnesota pide conocer la experiencia del paciente con sus medicamentos: lo que espera, lo que teme, lo que cree y cómo los toma en la vida real [11,12]. En hipertensión conviene explorar el miedo a que “los medicamentos dañen el riñón”, la idea de que “si me siento bien no los necesito”, el costo, el número de tabletas, la desconfianza hacia los genéricos y la dificultad para medir la presión en casa. Esas creencias explican más abandonos que cualquier ficha técnica [12].',
      ],
    },
  ],
  referencias: [
    F.omsHipertension, F.cacHipertension, F.invimaCum, F.escHipertension2024, F.life, F.renaal,
    F.solvdTratamiento, F.solvdPrevencion, F.allhat, F.wright2018, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Presión alta: valores, síntomas y cómo bajarla', '/articulos/presion-alta-sintomas-y-como-bajarla'],
    ['Medicamentos para la presión alta', '/articulos/medicamentos-para-la-presion-alta'],
    ['Guías de hipertensión 2024 y 2025: qué cambia para el QF', '/articulos/guias-de-hipertension-2024-2025-que-cambia'],
    ['Cómo tomar la presión arterial en casa', '/articulos/como-tomar-la-presion-arterial-en-casa'],
    ['Presión arterial normal por edad', '/articulos/presion-arterial-normal-por-edad'],
  ],
  seo: {
    titulo: 'Medicamentos para la hipertensión: vademécum farmacológico',
    descripcion: 'IECA, ARA-II, calcioantagonistas y tiazidas: evidencia, combinaciones, seguridad y atención farmacéutica en hipertensión arterial.',
  },
};

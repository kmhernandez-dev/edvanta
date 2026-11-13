import { F } from '../fuentes.js';

/** Monografía: amlodipino (besilato). Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'amlodipino',
  nombre: 'Amlodipino',
  titulo: 'Amlodipino: farmacología, edema y atención farmacéutica en hipertensión y angina',
  grupo: 'medicamentos-para-la-hipertension-arterial',
  clase: 'Calcioantagonista dihidropiridínico',
  atc: 'C08CA01',
  marcas: ['Norvas'],
  vias: ['Oral'],
  mecanismo: 'Bloquea los canales de calcio tipo L del músculo liso vascular y reduce la entrada de calcio, con relajación arterial y descenso de la resistencia periférica.',
  actualizado: '2026-11-12',
  resumenCorto: 'calcioantagonista dihidropiridínico de acción prolongada; útil en hipertensión y angina, con edema periférico como efecto adverso característico.',
  resumen: 'El amlodipino es un calcioantagonista dihidropiridínico de acción prolongada que relaja el músculo liso arterial y reduce la resistencia periférica. Se usa en hipertensión, en angina crónica estable y en angina vasoespástica. Su perfil metabólico es neutro, lo que lo hace útil en personas con diabetes, asma o gota, pero el edema periférico dependiente de la dosis es la razón más frecuente de consulta y de cambio de tratamiento.',
  datosClave: [
    ['Clase', 'Calcioantagonista dihidropiridínico [1]'],
    ['Código ATC', 'C08CA01 [1]'],
    ['Dosis habitual', '5 mg una vez al día; máximo 10 mg al día [1]'],
    ['Semivida', 'De 35 a 50 horas, lo que permite una toma diaria [1]'],
    ['Metabolismo', 'Hepático, con metabolitos inactivos [1]'],
    ['Colombia', 'Múltiples registros vigentes, solo y en combinaciones a dosis fijas [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El amlodipino es una dihidropiridina con un grupo aminoetoxi en la posición 2 y un grupo clorofenilo en la posición 4. Se comercializa como besilato de amlodipino; su fórmula es C20H25ClN2O5·C6H6O3S y su peso molecular, 567,1. La molécula tiene un centro quiral [1].',
        'La estructura dihidropiridínica le permite unirse a los canales de calcio tipo L con alta afinidad y una cinética de disociación lenta, lo que explica su larga duración de acción y la posibilidad de una sola toma al día [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'El amlodipino bloquea la entrada de calcio a través de los canales tipo L del músculo liso vascular. Al reducir el calcio intracelular, el músculo se relaja y las arteriolas periféricas se dilatan; baja la resistencia periférica y, con ella, la presión arterial [1].',
        'En la angina, la vasodilatación reduce la poscarga y el consumo de oxígeno del miocardio, y dilata las arterias coronarias, lo que mejora el aporte en la angina vasoespástica. No deprime la función cardíaca de forma significativa a las dosis terapéuticas [1].',
        'El amlodipino no tiene un efecto metabólico adverso relevante sobre los lípidos o la glucemia y puede usarse en personas con asma, diabetes o gota [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, biodisponibilidad del 64 al 80 %; los alimentos no la afectan de forma clínica [1]'],
            ['Concentración máxima', 'De 6 a 12 horas después de la dosis [1]'],
            ['Semivida de eliminación', 'De 35 a 50 horas [1]'],
            ['Distribución', 'Volumen de distribución de unos 21 l/kg; unión a proteínas del 97,5 % [1]'],
            ['Metabolismo', 'Hepático, con metabolitos inactivos [1]'],
            ['Eliminación', 'Renal: 10 % sin cambios y 60 % como metabolitos [1]'],
            ['Insuficiencia hepática', 'Aumenta la semivida y el AUC en un 40 a 60 %; iniciar con la dosis más baja [1]'],
            ['Insuficiencia renal', 'No requiere ajuste; no es dializable [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, el amlodipino está indicado en [1]:',
        { lista: [
          'Hipertensión arterial.',
          'Angina de pecho crónica estable.',
          'Angina vasoespástica o de Prinzmetal.',
        ] },
        'No está indicado para la crisis hipertensiva ni para el tratamiento agudo de la angina inestable. En esas situaciones se requieren otras medidas y una evaluación urgente [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Población o indicación', 'Dosis inicial', 'Mantenimiento', 'Máximo'],
          filas: [
            ['Adultos con hipertensión o angina', '5 mg una vez al día', '5 mg una vez al día', '10 mg una vez al día [1]'],
            ['Niños de 6 a 17 años con hipertensión', '2,5 mg una vez al día', '2,5 a 5 mg una vez al día', '5 mg al día [1]'],
            ['Insuficiencia hepática', 'Dosis más baja del intervalo', 'Ajustar lentamente', '10 mg al día [1]'],
            ['Edad avanzada', '5 mg una vez al día', 'Ajustar con precaución', '10 mg al día [1]'],
          ],
        } },
        { lista: [
          'Se toma una vez al día, con o sin alimentos, a la misma hora [1].',
          'El efecto antihipertensivo completo puede tardar varias semanas; no se debe cambiar de medicamento por una sola medición alta [1].',
          'En pacientes con insuficiencia hepática grave, el ajuste debe ser lento y con vigilancia estrecha [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad al amlodipino, a otras dihidropiridinas o a los excipientes.',
          'Hipotensión grave.',
          'Shock, incluido el shock cardiogénico.',
          'Obstrucción del tracto de salida del ventrículo izquierdo, como estenosis aórtica grave.',
          'Insuficiencia cardíaca hemodinámicamente inestable después de un infarto agudo de miocardio.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Insuficiencia cardíaca: usar con precaución; en la insuficiencia cardíaca grave se ha descrito más edema pulmonar con amlodipino que con placebo.',
          'Insuficiencia hepática: la semivida se prolonga y el AUC aumenta; iniciar con la dosis más baja y subir despacio.',
          'Edad avanzada: los aumentos de dosis deben ser cautelosos.',
          'Edema periférico: es frecuente, depende de la dosis y no siempre refleja retención de líquidos; puede confundirse con insuficiencia cardíaca.',
          'No se ha establecido la seguridad y eficacia en crisis hipertensivas [1].',
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
            ['Inhibidores del CYP3A4 (azoles, macrólidos, verapamilo, diltiazem, inhibidores de la proteasa)', 'Aumentan la exposición al amlodipino y el riesgo de hipotensión', 'Vigilar la presión y ajustar la dosis [1]'],
            ['Inductores del CYP3A4 (rifampicina, hierba de San Juan)', 'Reducen las concentraciones de amlodipino', 'Vigilar la presión durante y después del tratamiento [1]'],
            ['Zumo de pomelo', 'Aumenta la biodisponibilidad y el efecto antihipertensivo', 'Evitar o vigilar [1]'],
            ['Simvastatina', 'Aumenta su exposición; el límite recomendado es 20 mg al día con amlodipino', 'Ajustar la dosis de simvastatina [1]'],
            ['Tacrolimus', 'Puede aumentar las concentraciones de tacrolimus', 'Monitorizar los niveles de tacrolimus [1]'],
            ['Ciclosporina', 'Puede aumentar sus concentraciones', 'Vigilar los niveles y ajustar [1]'],
            ['Inhibidores de mTOR (sirolimus, everolimus, temsirolimus)', 'Amlodipino inhibe débilmente el CYP3A y puede aumentar su exposición', 'Vigilar y ajustar [1]'],
            ['Dantroleno intravenoso', 'Riesgo de hiperpotasemia y colapso cardiovascular', 'Evitar la combinación [1]'],
            ['Otros antihipertensivos', 'Suma hipotensión', 'Ajustar y advertir al paciente [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones más frecuentes son edema, cefalea, rubefacción, palpitaciones, mareo, náuseas, dolor abdominal y fatiga [1].',
        { lista: [
          'Muy frecuentes: edema.',
          'Frecuentes: somnolencia, mareo, cefalea (sobre todo al inicio), palpitaciones, rubefacción, disnea, dolor abdominal, náuseas, dispepsia, alteración del tránsito intestinal, hinchazón de tobillos, calambres musculares, fatiga y astenia.',
          'Poco frecuentes: depresión, ansiedad, insomnio, temblor, disgeusia, síncope, parestesia, acúfenos, arritmias, hipotensión, tos, rinitis, vómitos, sequedad de boca, alopecia, púrpura, prurito, erupción, urticaria, artralgia, mialgia, dolor de espalda, trastornos urinarios, impotencia, ginecomastia, dolor torácico y cambios de peso.',
          'Muy raras: leucopenia, trombocitopenia, hiperglucemia, hipertonía, neuropatía periférica, infarto de miocardio, vasculitis, pancreatitis, gastritis, hiperplasia gingival, hepatitis, ictericia, angioedema, eritema multiforme, dermatitis exfoliativa, síndrome de Stevens-Johnson, fotosensibilidad y necrólisis epidérmica tóxica.',
        ] },
        'El edema suele ser bilateral, dependiente de la gravedad y más frecuente en mujeres y en dosis de 10 mg. Si es intenso o asimétrico, hay que descartar otras causas [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no se ha establecido la seguridad en humanos. Se usa solo si no hay una alternativa más segura y si la enfermedad materna justifica el riesgo [1].',
          'Lactancia: el amlodipino pasa a la leche materna en una proporción estimada del 3 al 7 % de la dosis materna, con un máximo del 15 %. Se desconoce el efecto en el lactante; decidir caso por caso [1].',
          'Fertilidad: se han descrito cambios bioquímicos reversibles en la cabeza del espermatozoide con algunos calcioantagonistas; los datos clínicos con amlodipino son insuficientes [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El ensayo ALLHAT comparó amlodipino, lisinopril y clortalidona en 33.357 pacientes hipertensos de 55 años o más con al menos otro factor de riesgo cardiovascular, durante una media de 4,9 años [2].',
        { tabla: {
          columnas: ['Resultado', 'Amlodipino frente a clortalidona'],
          filas: [
            ['Enfermedad coronaria mortal o infarto de miocardio no mortal', 'Sin diferencia significativa (RR 0,98; IC 95 % 0,90-1,07) [2]'],
            ['Insuficiencia cardíaca', 'Mayor con amlodipino (10,2 % frente a 7,7 %; RR 1,38) [2]'],
            ['Mortalidad por todas las causas', 'Sin diferencia significativa (RR 0,96; IC 95 % 0,89-1,02) [2]'],
          ],
        } },
        'ALLHAT no comparó amlodipino con placebo y estudió una población de alto riesgo; sus resultados no significan que el amlodipino no sirva, sino que la clortalidona fue superior para prevenir insuficiencia cardíaca en esa población. La elección depende del perfil del paciente y de las comorbilidades [2].',
        'La ficha técnica también resume el estudio CAMELOT, en el que el amlodipino redujo el objetivo compuesto de eventos cardiovasculares, las hospitalizaciones por angina y las revascularizaciones frente a placebo en pacientes con enfermedad coronaria [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra múltiples presentaciones de amlodipino, solo y en combinaciones con otros antihipertensivos [3].',
          'Unión Europea: el amlodipino está autorizado para hipertensión y angina [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de amlodipino y de sus combinaciones; las indicaciones pueden variar [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con el amlodipino, la atención farmacéutica se centra en la indicación, la adherencia, el edema y la presión. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con el amlodipino'],
          filas: [
            ['Indicación', 'Hipertensión, angina estable o vasoespástica; descartar crisis hipertensiva y duplicaciones [1]'],
            ['Efectividad', 'Presión, frecuencia de angina, tolerancia al ejercicio y adherencia [1]'],
            ['Seguridad', 'Edema, cefalea, rubefacción, hipotensión, insuficiencia cardíaca y función hepática [1]'],
            ['Adherencia', 'Edema, número de tabletas, costo, creencias y olvidos [4]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'Hipertensión o angina no controlada con monoterapia', 'Proponer la combinación recomendada por la guía [1]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de dosis adecuada y buena adherencia', 'Revisar la combinación y remitir [1]'],
            ['Reacción adversa', 'Edema de tobillos', 'Revisar la dosis, descartar otras causas y proponer un cambio si es intolerable [1]'],
            ['Reacción adversa', 'Cefalea o rubefacción al inicio', 'Explicar que suelen mejorar y vigilar [1]'],
            ['Incumplimiento', 'Suspensión por edema o por creer que “no sirve”', 'Escuchar la experiencia y ajustar el plan [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de presión o de angina acordada con el paciente y el equipo tratante [1].',
          'Educación: tomar el medicamento a la misma hora, no suspenderlo sin consultar, elevar las piernas y reportar edema intenso o aumento de peso rápido [1].',
          'Revisión de la presión, el edema y los síntomas en cada control; ajuste lento en personas mayores o con insuficiencia hepática [1].',
          'Registro del estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'El edema es la experiencia que más afecta la adherencia al amlodipino. Escucharla permite distinguir un efecto esperable de un problema que requiere otra evaluación [4,5].',
        { subtitulo: 'Lo que conviene explorar con el amlodipino' },
        { lista: [
          'Cuándo apareció el edema, si es bilateral, si mejora con el descanso y si se acompaña de disnea o aumento de peso [1].',
          'La idea de que el edema significa “que el medicamento no le sienta” o “que el corazón está fallando” [1].',
          'La cefalea o la rubefacción al inicio y su evolución [1].',
          'El costo, la cantidad de tabletas y la confianza en los genéricos [3].',
          'El uso de otros antihipertensivos o de antiinflamatorios que puedan sumar efectos [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Desde cuándo nota los tobillos hinchados y qué pasa cuando descansa?',
          '¿Ha tenido que dejar de usar zapatos o ropa por la hinchazón?',
          '¿Le ha dolido la cabeza o se ha puesto rojo al empezar el tratamiento?',
          '¿Qué espera que el amlodipino haga por su presión o su angina?',
        ] },
      ],
    },
  ],
  referencias: [F.ftAmlodipino, F.allhat, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Amlodipino: para qué sirve, cómo se toma y efectos secundarios', '/articulos/amlodipino-para-que-sirve'],
    ['Medicamentos para la presión alta', '/articulos/medicamentos-para-la-presion-alta'],
    ['Guías de hipertensión 2024 y 2025: qué cambia para el QF', '/articulos/guias-de-hipertension-2024-2025-que-cambia'],
  ],
  seo: {
    titulo: 'Amlodipino: farmacología, edema y atención farmacéutica',
    descripcion: 'Amlodipino: mecanismo calcioantagonista, farmacocinética, indicaciones, edema, interacciones, ensayo ALLHAT y atención farmacéutica.',
  },
};

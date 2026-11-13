import { F } from '../fuentes.js';

/** Monografía: setmelanotida. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'setmelanotida',
  nombre: 'Setmelanotida',
  titulo: 'Setmelanotida: farmacología y atención farmacéutica en obesidades genéticas e hipotalámicas',
  grupo: 'medicamentos-para-la-obesidad',
  clase: 'Agonista del receptor de melanocortina 4 (MC4R)',
  atc: 'A08AA12',
  marcas: ['Imcivree'],
  vias: ['Subcutánea, una vez al día'],
  mecanismo: 'Agonista selectivo del receptor MC4: restablece la señal de la vía de la melanocortina cuando falla por mutaciones o por lesión hipotalámica, con menos hambre y más gasto energético.',
  actualizado: '2026-11-12',
  resumenCorto: 'agonista MC4R para obesidades raras por déficit de POMC, PCSK1 o LEPR, síndrome de Bardet-Biedl y obesidad hipotalámica.',
  resumen: 'La setmelanotida es un octapéptido cíclico análogo de la α-MSH que activa el receptor de melanocortina 4. No es un medicamento para la obesidad común: está indicado en obesidades raras en las que la vía de la melanocortina no funciona, de origen genético o por lesión del hipotálamo, y lo prescriben médicos con experiencia en estas enfermedades. No tiene registro sanitario en Colombia.',
  datosClave: [
    ['Clase', 'Agonista selectivo del receptor MC4 [1]'],
    ['Código ATC', 'A08AA12 [1]'],
    ['Dosis habitual en mayores de 6 años', 'Escalado semanal hasta 2 o 3 mg una vez al día, según la indicación y la respuesta [1]'],
    ['Semivida', 'Unas 11 horas [1]'],
    ['Estado estacionario', 'En 2 días [1]'],
    ['Colombia', 'Sin registro sanitario en el CUM consultado [4]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La setmelanotida es un péptido cíclico de 8 aminoácidos análogo de la hormona estimulante de los melanocitos alfa (α-MSH), el agonista endógeno de los receptores de melanocortina. Se usa como sal de acetato [2].',
        'Su secuencia es acetil-Arg-Cys-D-Ala-His-D-Phe-Arg-Trp-Cys-amida, ciclada por un puente disulfuro entre las cisteínas de las posiciones 2 y 8. Su fórmula es C49H68N18O9S2 y su masa molecular, 1.117,3 Da (base libre anhidra) [2].',
        'Frente a un péptido lineal de aminoácidos naturales, tiene dos aminoácidos de configuración D (D-alanina y D-fenilalanina), un extremo N-terminal acetilado, un C-terminal amidado y un anillo cerrado por el puente disulfuro [2].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Los receptores MC4 del cerebro regulan el hambre, la saciedad y el gasto energético. En las enfermedades con activación insuficiente del receptor, la setmelanotida restablece la actividad de la vía para reducir el hambre y favorecer la pérdida de peso, con menor ingesta calórica y mayor gasto energético [1].',
        'Es selectiva por el receptor MC4, con menos actividad sobre el MC1. Los receptores MC1 están en los melanocitos: su activación acumula melanina y aumenta la pigmentación de la piel con independencia de la luz ultravioleta, lo que explica la hiperpigmentación [1].',
        'Se detectaron con poca frecuencia anticuerpos contra el fármaco y con frecuencia anticuerpos contra la α-MSH, sin evidencia de efecto sobre la farmacocinética [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Exposición con 3 mg diarios durante 12 semanas', 'Cmáx en estado estacionario 37,9 ng/ml, AUCτ 495 h·ng/ml y concentración valle 6,77 ng/ml [1]'],
            ['Estado estacionario y acumulación', 'En 2 días con 1 a 3 mg diarios; acumulación de cerca del 30 % [1]'],
            ['Linealidad', 'AUC y Cmáx proporcionales entre 1 y 3 mg [1]'],
            ['Metabolismo', 'No pareció metabolizarse en microsomas ni hepatocitos hepáticos ni en microsomas renales [1]'],
            ['Semivida de eliminación efectiva', 'Unas 11 horas [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, está indicada para la obesidad y el control del hambre en [1]:',
        { lista: [
          'Obesidad hipotalámica adquirida por una lesión o alteración del hipotálamo, en adultos y niños mayores de 4 años.',
          'Síndrome de Bardet-Biedl confirmado genéticamente, en adultos y niños mayores de 2 años.',
          'Déficit por mutaciones bialélicas de pérdida de función de la proopiomelanocortina (POMC), incluida la PCSK1, o del receptor de leptina (LEPR), en adultos y niños mayores de 2 años.',
        ] },
        'La prescriben y supervisan médicos con experiencia en el diagnóstico y tratamiento de las formas raras de obesidad de origen genético o hipotalámico [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        'Ejemplo de la ficha técnica para la obesidad hipotalámica adquirida en adultos y niños mayores de 6 años; la dosis puede subirse o bajarse según la tolerancia y la respuesta, y reducirse a 0,25 mg si hace falta [1]:',
        { tabla: {
          columnas: ['Semana', 'Dosis diaria', 'Volumen'],
          filas: [
            ['1', '0,5 mg', '0,05 ml'],
            ['2 (si 0,5 mg se tolera)', '1 mg', '0,1 ml'],
            ['3 (si 1 mg se tolera)', '2 mg', '0,2 ml'],
            ['4 en adelante (si la respuesta es insuficiente y 2 mg se tolera)', '3 mg', '0,3 ml'],
          ],
        } },
        'En niños de 4 a menos de 6 años, y en las demás indicaciones, la ficha define pautas según la edad y el peso [1].',
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La única contraindicación es la hipersensibilidad a los principios activos o a los excipientes [1]. Advertencias [1]:',
        { lista: [
          'Pigmentación de la piel: aumenta la pigmentación generalizada y oscurece los lunares previos; se recomienda una exploración de toda la piel antes de iniciar y una vez al año.',
          'Frecuencia cardiaca y presión arterial: controlarlas en cada visita, al menos cada 6 meses.',
          'Erecciones espontáneas: si una erección dura más de 4 horas, se requiere atención de urgencia por posible priapismo.',
          'Depresión: supervisarla en cada visita y considerar suspender si aparecen pensamientos o conductas suicidas.',
          'Obesidad hipotalámica con diabetes insípida central: riesgo de hipernatremia e hipovolemia, con vigilancia estrecha.',
          'Medicamentos concomitantes que puedan afectarse por cambios en el peso, el metabolismo, el cortisol o el estado nutricional: vigilarlos.',
          'Contiene alcohol bencílico, que podría acumularse y producir acidosis metabólica; se advierte en el embarazo y la lactancia.',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        'La ficha técnica no describe interacciones farmacocinéticas relevantes: la setmelanotida no pareció metabolizarse por enzimas hepáticas ni renales. Pide vigilar los medicamentos concomitantes cuyo efecto pueda cambiar con la pérdida de peso, el metabolismo, las concentraciones de cortisol o el estado nutricional [1].',
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son los trastornos de hiperpigmentación (66 %), las reacciones en el lugar de inyección (45 %), las náuseas (36 %) y la cefalea (19 %) [1].',
        { lista: [
          'Muy frecuentes: hiperpigmentación, reacciones en el lugar de inyección, náuseas, vómitos y dolor de cabeza [1].',
          'Otras descritas: diarrea, dolor abdominal, sequedad de boca, dispepsia, estreñimiento, mareos, depresión, insomnio, aumento de la libido y nevos melanocíticos [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no hay datos en humanos. En conejas gestantes, la menor ingesta materna causó efectos embriofetales. Como precaución, no se inicia en el embarazo ni si la paciente intenta quedar en embarazo [1].',
          'Lactancia: se decide entre suspender la lactancia o el tratamiento según el beneficio para el niño y para la madre, con advertencia sobre el alcohol bencílico [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'Dos ensayos de fase 3 abiertos y de un solo grupo evaluaron la setmelanotida en déficit de POMC (10 participantes) y de LEPR (11 participantes) [3]:',
        { tabla: {
          columnas: ['Resultado a cerca de un año', 'Déficit de POMC', 'Déficit de LEPR'],
          filas: [
            ['Pérdida de al menos el 10 % del peso', '8 de 10 (80 %)', '5 de 11 (45 %) [3]'],
            ['Cambio medio de la puntuación de hambre máxima', '−27,1 %', '−43,7 % [3]'],
          ],
        } },
        'Las reacciones más frecuentes fueron las del lugar de inyección y la hiperpigmentación; no hubo eventos adversos graves relacionados con el tratamiento [3].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: sin registro sanitario en el CUM consultado [4].',
          'Unión Europea: Imcivree está autorizado para las tres indicaciones descritas [1].',
          'Estados Unidos: Imcivree tiene etiqueta vigente de la FDA [2].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La setmelanotida se usa en enfermedades raras, a menudo en niños, con un equipo especializado. El aporte del farmacéutico está en confirmar que la indicación tiene sustento diagnóstico, organizar la vigilancia de la seguridad y sostener la adherencia de una inyección diaria [1,5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la setmelanotida'],
          filas: [
            ['Indicación', 'Diagnóstico genético confirmado (POMC, PCSK1, LEPR o Bardet-Biedl) o lesión hipotalámica documentada; edad mínima según la indicación [1]'],
            ['Efectividad', 'Hambre (escala usada por el equipo) y peso; dosis alcanzada según la tolerancia y la respuesta [1]'],
            ['Seguridad', 'Exploración de la piel al inicio y cada año; frecuencia cardiaca y presión arterial en cada visita; estado de ánimo; sodio en pacientes con diabetes insípida; erecciones prolongadas [1]'],
            ['Adherencia', 'Inyección diaria, a menudo aplicada por un cuidador; volúmenes muy pequeños (0,05 a 0,3 ml) [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', 'Error de volumen al medir 0,05 o 0,1 ml', 'Entrenar al cuidador con el volumen exacto de cada semana [1]'],
            ['Reacción adversa', 'Oscurecimiento de lunares o de la piel', 'Explicar que es esperable y asegurar la exploración dermatológica anual [1]'],
            ['Reacción adversa', 'Síntomas depresivos', 'Remitir y valorar la suspensión si hay ideas suicidas [1]'],
            ['Necesita farmacoterapia adicional', 'Comorbilidades de la obesidad sin tratar', 'Coordinar con el equipo tratante'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y 4. Seguimiento' },
        { lista: [
          'Metas acordadas con el equipo especializado sobre hambre y peso, con plazos; como referencia, el 80 % de los participantes con déficit de POMC perdió al menos el 10 % en un año [3].',
          'Seguimiento semanal durante el escalado y, luego, en cada visita médica, con piel, frecuencia cardiaca, presión arterial y ánimo; registro del estado de cada PRF según el modelo [1,5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'En estas enfermedades, la experiencia con el medicamento es también la de la familia: conocerla ayuda a prevenir problemas [5,6].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'La hiperfagia como carga familiar: lo que significa para los cuidadores ver menos hambre en el niño, y sus expectativas [3].',
          'La hiperpigmentación: cómo la viven la persona y su familia, sobre todo en niños y adolescentes [1].',
          'La inyección diaria: quién la aplica, cómo se organiza y qué pasa en vacaciones o en el colegio [1].',
          'El acceso: al no tener registro en Colombia, preguntar cómo se obtiene el medicamento y garantizar su procedencia [4].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Cómo ha cambiado el hambre desde que empezó el tratamiento?',
          '¿Quién aplica la inyección y cómo se siente con esa tarea?',
          '¿Ha notado cambios en la piel o en los lunares? ¿Le preocupan?',
          '¿Cómo ha estado el ánimo en las últimas semanas?',
        ] },
      ],
    },
  ],
  referencias: [F.ftImcivree, F.dmImcivree, F.setmelanotidaFase3, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Cómo bajar de peso de forma saludable', '/articulos/como-bajar-de-peso-de-forma-saludable'],
  ],
  seo: {
    titulo: 'Setmelanotida: farmacología y atención farmacéutica',
    descripcion: 'Setmelanotida: farmacoquímica del octapéptido cíclico, agonismo MC4R, farmacocinética, indicaciones raras, hiperpigmentación y atención farmacéutica.',
  },
};

export const CURSO = 'Curso de Farmacoterapia de la Hipertensión Arterial';
export const MIGRACION = '129_experiencias_farmacoterapia_hta_1.sql';

export const CLASES = [
  {
    titulo: 'Introducción al curso: la hipertensión arterial en Colombia y el rol del químico farmacéutico',
    duracion: 20,
    gancho: {
      titulo: 'La presión que nadie revisaba',
      texto: 'Don Álvaro tiene 61 años, vive en Pereira y hace cuatro años le diagnosticaron hipertensión. En la última consulta la presión fue 158/96 mmHg, pero él se siente bien y no entiende por qué debe tomar tres medicamentos. En la farmacia pregunta si puede dejar el de la noche porque le da tos. El Químico Farmacéutico puede identificar la tos por enalapril, revisar la adherencia y evitar una complicación. La hipertensión no se trata solo con una pastilla: se trata con un sistema.',
    },
    objetivos: [
      'Describir el papel del Químico Farmacéutico en el control de la hipertensión en Colombia.',
      'Reconocer los problemas de adherencia, seguridad y medición que afectan el control.',
      'Relacionar la presión arterial con el riesgo cardiovascular y renal.',
      'Ubicar las cinco unidades y los casos del curso.',
    ],
    conceptos: [
      { icono: 'Activity', termino: 'Hipertensión arterial', definicion: 'Elevación persistente de la presión arterial que aumenta el riesgo de infarto, ictus, insuficiencia cardíaca y enfermedad renal.' },
      { icono: 'Users', termino: 'Atención farmacéutica', definicion: 'Proceso centrado en la persona que detecta, previene y resuelve problemas relacionados con los medicamentos.' },
      { icono: 'Gauge', termino: 'Control', definicion: 'Lograr la meta de presión con un tratamiento tolerado, seguro y sostenible.' },
      { icono: 'ShieldCheck', termino: 'Riesgo cardiovascular', definicion: 'Probabilidad de eventos cardiovasculares; guía el umbral y la intensidad del tratamiento.' },
    ],
    mapa: {
      centro: 'El QF en hipertensión',
      ramas: [
        { titulo: 'Medir', icono: 'Gauge', nodos: ['Técnica', 'MAPA/AMPA', 'Confirmar'] },
        { titulo: 'Evaluar', icono: 'Search', nodos: ['Riesgo', 'Daño de órgano', 'Adherencia'] },
        { titulo: 'Optimizar', icono: 'Target', nodos: ['Combinación', 'Meta', 'Tolerancia'] },
        { titulo: 'Educar', icono: 'GraduationCap', nodos: ['Sal', 'Potasio', 'Automedida'] },
      ],
    },
    secciones: [
      {
        titulo: 'La hipertensión es un problema de todos los días',
        parrafos: [
          'La hipertensión arterial es el factor de riesgo modificable más importante para enfermedad cardiovascular y renal. En Colombia es muy frecuente y muchos pacientes no alcanzan la meta. Las causas incluyen falta de adherencia, medición incorrecta, esquemas insuficientes, interacciones y barreras de acceso.',
          'El Químico Farmacéutico ve al paciente en la droguería, en el hospital o en el programa de crónicos. Puede medir la presión, revisar la técnica, detectar efectos adversos, simplificar el esquema y educar. Esa intervención mejora el control y reduce complicaciones.',
        ],
      },
      {
        titulo: 'Qué puede hacer el QF',
        parrafos: [
          'El QF puede confirmar la adherencia, revisar la técnica de medición, identificar medicamentos que elevan la presión o interfieren con el tratamiento y detectar signos de daño de órgano. También puede proponer cambios al equipo tratante con datos concretos.',
          'La intervención no reemplaza al médico. Se documenta y se comunica. Un mensaje claro, con presión, medicamentos, adherencia y una propuesta, mejora la aceptación. El paciente debe sentirse escuchado, no juzgado.',
        ],
      },
      {
        titulo: 'Cómo está organizado el curso',
        parrafos: [
          'La unidad 1 cubre definición, clasificación, medición, riesgo y metas. La unidad 2 revisa IECA, ARA-II, sartanes y calcioantagonistas. La unidad 3 entra a tiazidas, antagonistas de mineralocorticoides, betabloqueadores y nuevas moléculas. La unidad 4 integra combinaciones, HTA resistente, enfermedad renal, embarazo, adulto mayor y crisis. La unidad 5 cierra con adherencia, educación, seguimiento, interacciones y farmacovigilancia.',
          'Cada clase trae un caso, un mapa y un proceso. Al final, fichas de losartán, enalapril, amlodipino e hidroclorotiazida. La idea es decidir con el paciente y con la evidencia, no memorizar dosis aisladas.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo abordar una persona con hipertensión en la farmacia',
      pasos: [
        { titulo: 'Medir', detalle: 'Técnica correcta, reposo, manguito adecuado y confirmación.', icono: 'Gauge', evidencia: 'Registro.' },
        { titulo: 'Revisar', detalle: 'Medicamentos, adherencia, síntomas y barreras.', icono: 'Search', evidencia: 'Ficha.' },
        { titulo: 'Evaluar', detalle: 'Riesgo, daño de órgano y metas.', icono: 'ShieldCheck', evidencia: 'Evaluación.' },
        { titulo: 'Intervenir', detalle: 'Educar, ajustar o derivar.', icono: 'Lightbulb', evidencia: 'Nota.' },
        { titulo: 'Seguir', detalle: 'Presión, tolerancia y adherencia.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'La tos del enalapril',
      contexto: 'Álvaro toma enalapril, amlodipino e hidroclorotiazida. Refiere tos seca desde hace dos meses y quiere suspender todo.',
      pregunta: '¿Cuál es la intervención más razonable?',
      opciones: [
        { texto: 'Suspender todos los medicamentos.', correcta: false, retro: 'La hipertensión no tratada aumenta el riesgo. Se revisa el fármaco que causa el síntoma.' },
        { texto: 'Explicar que la tos puede ser del enalapril y proponer al médico cambiarlo por un ARA-II, sin suspender el resto.', correcta: true, retro: 'La tos seca es un efecto característico de los IECA. El cambio se coordina y se mantiene el control.' },
        { texto: 'Aumentar el enalapril.', correcta: false, retro: 'Aumentar la dosis puede empeorar la tos.' },
      ],
    },
    errores: [
      { error: 'Tratar solo la cifra y no el riesgo.', correccion: 'La presión se interpreta con el riesgo cardiovascular y renal.' },
      { error: 'No revisar la técnica de medición.', correccion: 'Una medición incorrecta puede llevar a sobretratar o infratratar.' },
      { error: 'Juzgar al paciente por no cumplir.', correccion: 'Hay que explorar barreras y resolverlas.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es el papel del QF en hipertensión?', respuesta: 'Medir, revisar, educar, detectar problemas y coordinar intervenciones.' },
      { pregunta: '¿Qué síntomas puede causar enalapril?', respuesta: 'Tos seca y, rara vez, angioedema.' },
      { pregunta: '¿Por qué la hipertensión requiere seguimiento?', respuesta: 'Porque es crónica, a menudo asintomática y el control cambia con la adherencia y la tolerancia.' },
    ],
    resumen: [
      'La hipertensión es **crónica y silenciosa**.',
      'El QF puede mejorar el control con **medición, educación y seguimiento**.',
      'La tos por IECA es un problema frecuente.',
      'El plan se coordina con el equipo tratante.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'Organización Mundial de la Salud. Hipertensión: datos y cifras.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Apertura', descripcion: 'Farmacia comunitaria con un paciente mayor y un QF midiendo la presión con un tensiómetro validado.', alt: 'Químico Farmacéutico midiendo la presión arterial' },
    ],
    keywords: ['curso hipertensión farmacia', 'rol del químico farmacéutico hipertensión', 'tos por enalapril', 'control de la presión arterial', 'atención farmacéutica hipertensión', 'hipertensión Colombia'],
  },
  {
    titulo: 'Definición y clasificación de la presión arterial: ESC 2024 frente a AHA/ACC 2025',
    duracion: 20,
    gancho: {
      titulo: 'Dos guías, un paciente',
      texto: 'Un paciente tiene presión 132/84 mmHg. Para una guía es “elevada”; para otra, “normal-alta”. La diferencia no es solo un número: cambia el umbral de tratamiento y la conversación con el paciente. Conocer las definiciones evita etiquetas incorrectas y decisiones apresuradas.',
    },
    objetivos: [
      'Definir hipertensión y presión elevada según las guías vigentes.',
      'Comparar la clasificación ESC 2024 y AHA/ACC 2025.',
      'Reconocer las categorías de presión y su implicación clínica.',
      'Aplicar la clasificación sin sobrediagnosticar ni infratratar.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'Presión sistólica', definicion: 'Presión máxima durante la sístole; se asocia con riesgo cardiovascular.' },
      { icono: 'Activity', termino: 'Presión diastólica', definicion: 'Presión mínima durante la diástole; también predice riesgo, sobre todo en adultos jóvenes.' },
      { icono: 'Target', termino: 'Hipertensión', definicion: 'Presión persistentemente elevada en mediciones correctas; el umbral depende de la guía y del riesgo.' },
      { icono: 'ShieldCheck', termino: 'Riesgo', definicion: 'La clasificación se interpreta junto con el riesgo cardiovascular y el daño de órgano.' },
    ],
    mapa: {
      centro: 'Clasificación de la PA',
      ramas: [
        { titulo: 'Normal', icono: 'CheckCircle2', nodos: ['<120/80', 'Sin tratamiento', 'Estilo de vida'] },
        { titulo: 'Elevada', icono: 'AlertTriangle', nodos: ['120-129/<80', 'Riesgo', 'Seguimiento'] },
        { titulo: 'HTA', icono: 'Gauge', nodos: ['≥130/80 o ≥140/90', 'Riesgo', 'Tratamiento'] },
        { titulo: 'Guías', icono: 'BookOpen', nodos: ['ESC 2024', 'AHA/ACC 2025', 'Contexto'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué dicen las guías',
        parrafos: [
          'La guía ESC 2024 define hipertensión a partir de 140/90 mmHg en consultorio, con categorías de presión normal, elevada y hipertensión. La guía AHA/ACC 2025 mantiene el umbral de 130/80 mmHg para hipertensión, con una categoría de presión elevada entre 120-129/<80 mmHg. Las diferencias reflejan interpretaciones distintas del riesgo y del beneficio del tratamiento.',
          'En la práctica, la clasificación no es una etiqueta aislada. Se confirma con mediciones repetidas, preferiblemente fuera del consultorio, y se interpreta con el riesgo cardiovascular, la edad, la diabetes, la enfermedad renal y el daño de órgano. Una presión de 132/84 mmHg en una persona joven sin riesgo no es lo mismo que en un paciente con albuminuria.',
        ],
      },
      {
        titulo: 'Por qué importa la diferencia',
        parrafos: [
          'Un umbral más bajo identifica más personas y puede aumentar el tratamiento, pero también el riesgo de sobrediagnóstico y efectos adversos. Un umbral más alto puede dejar sin tratamiento a personas con riesgo. La decisión debe individualizarse y basarse en la evidencia y en la guía adoptada por el contexto.',
          'El QF puede explicar al paciente que una cifra limítrofe no significa “enfermedad grave” ni “nada”. Significa que hay que confirmar, medir bien y evaluar el riesgo. La educación reduce la ansiedad y mejora la adherencia a las medidas de estilo de vida.',
        ],
      },
      {
        titulo: 'Cómo clasificar en la práctica',
        parrafos: [
          'Se confirma la presión con al menos dos mediciones en dos ocasiones distintas, con técnica adecuada. Si es posible, se usa MAPA o AMPA para descartar hipertensión de bata blanca o enmascarada. La clasificación se registra junto con el riesgo y la meta.',
          'No se debe iniciar tratamiento farmacológico solo por una lectura aislada. Tampoco se debe ignorar una presión persistentemente elevada. La confirmación y el contexto son parte del diagnóstico.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo clasificar una presión arterial',
      pasos: [
        { titulo: 'Medir bien', detalle: 'Reposo, manguito adecuado y técnica.', icono: 'Gauge', evidencia: 'Registro.' },
        { titulo: 'Confirmar', detalle: 'Repetir en otra ocasión o con AMPA/MAPA.', icono: 'Repeat', evidencia: 'Confirmación.' },
        { titulo: 'Clasificar', detalle: 'Normal, elevada o hipertensión según la guía.', icono: 'Target', evidencia: 'Categoría.' },
        { titulo: 'Evaluar riesgo', detalle: 'Edad, diabetes, ERC, daño de órgano.', icono: 'ShieldCheck', evidencia: 'Riesgo.' },
        { titulo: 'Decidir', detalle: 'Estilo de vida, tratamiento o seguimiento.', icono: 'Lightbulb', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: '132/84 en un joven',
      contexto: 'Hombre de 28 años, sin diabetes, sin enfermedad renal, presión 132/84 mmHg en una sola medición. No tiene síntomas.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Iniciar tres antihipertensivos de inmediato.', correcta: false, retro: 'Una sola medición no basta y el riesgo es bajo. Hay que confirmar y evaluar.' },
        { texto: 'Confirmar con mediciones repetidas, revisar estilo de vida y riesgo antes de decidir.', correcta: true, retro: 'La clasificación requiere confirmación y contexto. En bajo riesgo, el estilo de vida y el seguimiento son el primer paso.' },
        { texto: 'Ignorar porque es joven.', correcta: false, retro: 'La presión elevada en jóvenes también importa y puede progresar.' },
      ],
    },
    errores: [
      { error: 'Diagnosticar con una sola medición.', correccion: 'Confirmar con mediciones repetidas o fuera del consultorio.' },
      { error: 'Aplicar un umbral sin contexto.', correccion: 'La clasificación se interpreta con el riesgo.' },
      { error: 'No explicar la diferencia entre guías.', correccion: 'El paciente necesita entender que una cifra limítrofe requiere seguimiento, no alarma.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es el umbral de hipertensión en ESC 2024?', respuesta: '140/90 mmHg en consultorio, con confirmación.' },
      { pregunta: '¿Cuál es el umbral en AHA/ACC 2025?', respuesta: '130/80 mmHg.' },
      { pregunta: '¿Por qué confirmar la presión?', respuesta: 'Para evitar diagnosticar hipertensión de bata blanca o ignorar hipertensión enmascarada.' },
    ],
    resumen: [
      'Las guías difieren en el **umbral**.',
      'La clasificación requiere **confirmación**.',
      'El riesgo y el daño de órgano guían la decisión.',
      'Una cifra limítrofe no es una etiqueta definitiva.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'Organización Mundial de la Salud. Hipertensión: datos y cifras.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de clasificación', descripcion: 'Tabla comparativa de categorías de presión arterial según ESC 2024 y AHA/ACC 2025.', alt: 'Clasificación de la presión arterial según guías' },
    ],
    keywords: ['clasificación hipertensión arterial', 'presión arterial normal', 'ESC 2024 hipertensión', 'AHA ACC 2025 hipertensión', 'presión elevada 130/80', 'diagnóstico hipertensión'],
  },
  {
    titulo: 'Medición correcta de la presión arterial: consultorio, MAPA y AMPA',
    duracion: 20,
    gancho: {
      titulo: 'La presión que cambió con la técnica',
      texto: 'Una paciente llega con presión 150/92 mmHg. El QF observa que habló durante la medición, tenía la vejiga llena y el manguito era pequeño. Repite la medición con técnica correcta y obtiene 138/86 mmHg. La diferencia no era el medicamento: era la medición. Medir bien es el primer paso para tratar bien.',
    },
    objetivos: [
      'Aplicar la técnica correcta de medición en consultorio.',
      'Diferenciar MAPA, AMPA y medición clínica.',
      'Reconocer la hipertensión de bata blanca y enmascarada.',
      'Educar al paciente para automedirse.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'Técnica', definicion: 'Reposo, posición, manguito adecuado, brazo apoyado y silencio.' },
      { icono: 'Timer', termino: 'MAPA', definicion: 'Monitoreo ambulatorio de 24 horas; confirma el diagnóstico y evalúa el patrón nocturno.' },
      { icono: 'CalendarClock', termino: 'AMPA', definicion: 'Automedida domiciliaria; varias lecturas durante varios días.' },
      { icono: 'AlertTriangle', termino: 'Bata blanca', definicion: 'Presión alta en consultorio y normal fuera; requiere confirmación.' },
    ],
    mapa: {
      centro: 'Medición de la PA',
      ramas: [
        { titulo: 'Consultorio', icono: 'Gauge', nodos: ['Reposo', 'Manguito', 'Promedio'] },
        { titulo: 'MAPA', icono: 'Timer', nodos: ['24 horas', 'Nocturno', 'Confirmación'] },
        { titulo: 'AMPA', icono: 'CalendarClock', nodos: ['Casa', 'Varios días', 'Promedio'] },
        { titulo: 'Errores', icono: 'AlertTriangle', nodos: ['Hablar', 'Manguito', 'Vejiga'] },
      ],
    },
    secciones: [
      {
        titulo: 'Técnica correcta',
        parrafos: [
          'El paciente debe estar sentado, con la espalda apoyada, los pies en el suelo, el brazo a la altura del corazón y sin hablar. Debe haber reposado al menos cinco minutos y no haber fumado, tomado café o hecho ejercicio en los 30 minutos previos. La vejiga debe estar vacía. El manguito debe cubrir al menos el 80 % de la circunferencia del brazo.',
          'Se toman al menos dos mediciones separadas por uno o dos minutos y se promedian. Si la diferencia es grande, se toma una tercera. Se mide en ambos brazos la primera vez y se usa el brazo con la presión más alta. La técnica incorrecta es una causa frecuente de sobrediagnóstico y de ajustes innecesarios.',
        ],
      },
      {
        titulo: 'MAPA y AMPA',
        parrafos: [
          'La MAPA mide la presión durante 24 horas y permite confirmar el diagnóstico, evaluar el descenso nocturno y detectar hipertensión de bata blanca o enmascarada. La AMPA se hace en casa con un dispositivo validado, con varias lecturas por la mañana y por la noche durante varios días. Ambas reducen el efecto del consultorio.',
          'La AMPA empodera al paciente y mejora la adherencia, pero requiere educación. El QF puede enseñar la técnica, revisar el dispositivo y ayudar a interpretar los promedios. No se deben usar dispositivos de muñeca sin validación ni tomar decisiones con una sola lectura.',
        ],
      },
      {
        titulo: 'Bata blanca y enmascarada',
        parrafos: [
          'La hipertensión de bata blanca es alta en consultorio y normal fuera. La enmascarada es normal en consultorio y alta fuera. Ambas importan porque cambian el diagnóstico y el tratamiento. La confirmación con MAPA o AMPA es clave antes de intensificar o retirar fármacos.',
          'El QF puede detectar patrones: presión alta solo en la consulta, síntomas de hipotensión en casa o diferencias entre brazos. Esa información se comparte con el equipo tratante y evita decisiones basadas en una medición aislada.',
        ],
      },
    ],
    proceso: {
      titulo: 'Medición correcta en cinco pasos',
      pasos: [
        { titulo: 'Preparar', detalle: 'Reposo, silencio, vejiga vacía y sin café.', icono: 'Timer', evidencia: 'Checklist.' },
        { titulo: 'Posicionar', detalle: 'Sentado, espalda apoyada, brazo a la altura del corazón.', icono: 'Users', evidencia: 'Observación.' },
        { titulo: 'Manguito', detalle: 'Tamaño adecuado y en el brazo correcto.', icono: 'Gauge', evidencia: 'Registro.' },
        { titulo: 'Medir', detalle: 'Dos o tres lecturas y promedio.', icono: 'Repeat', evidencia: 'Promedio.' },
        { titulo: 'Confirmar', detalle: 'MAPA o AMPA si hay duda.', icono: 'CalendarClock', evidencia: 'Confirmación.' },
      ],
    },
    caso: {
      titulo: 'La presión de la consulta',
      contexto: 'Paciente con presión 150/90 en consultorio y 128/78 en casa. Está ansioso y toma tres medicamentos.',
      pregunta: '¿Qué es más probable?',
      opciones: [
        { texto: 'Hipertensión resistente; aumentar dosis.', correcta: false, retro: 'La presión domiciliaria es normal. Aumentar dosis puede causar hipotensión.' },
        { texto: 'Hipertensión de bata blanca; confirmar con MAPA/AMPA y revisar el tratamiento.', correcta: true, retro: 'La diferencia entre consultorio y casa sugiere bata blanca. Se confirma antes de ajustar.' },
        { texto: 'Ignorar la presión de casa.', correcta: false, retro: 'La AMPA es útil y debe integrarse.' },
      ],
    },
    errores: [
      { error: 'Medir con manguito pequeño.', correccion: 'Usar el tamaño adecuado; un manguito pequeño sobreestima la presión.' },
      { error: 'Hablar durante la medición.', correccion: 'El silencio es parte de la técnica.' },
      { error: 'Decidir con una sola lectura.', correccion: 'Promediar y confirmar.' },
    ],
    comprueba: [
      { pregunta: '¿Cuánto debe reposar el paciente?', respuesta: 'Al menos cinco minutos.' },
      { pregunta: '¿Qué es la MAPA?', respuesta: 'Monitoreo ambulatorio de 24 horas.' },
      { pregunta: '¿Qué es la hipertensión enmascarada?', respuesta: 'Presión normal en consultorio y alta fuera.' },
    ],
    resumen: [
      'La **técnica** cambia la cifra.',
      'MAPA y AMPA confirman el diagnóstico.',
      'La bata blanca y la enmascarada importan.',
      'El QF puede enseñar y revisar la medición.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'Organización Mundial de la Salud. Hipertensión: datos y cifras.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de técnica', descripcion: 'Ilustración de un paciente sentado, con el brazo apoyado y un manguito del tamaño correcto.', alt: 'Técnica correcta de medición de la presión arterial' },
    ],
    keywords: ['medición correcta presión arterial', 'MAPA hipertensión', 'AMPA presión arterial', 'hipertensión bata blanca', 'hipertensión enmascarada', 'técnica tensiómetro'],
  },
  {
    titulo: 'Estratificación del riesgo cardiovascular y daño de órgano mediado por hipertensión',
    duracion: 25,
    gancho: {
      titulo: 'La misma presión, riesgos distintos',
      texto: 'Dos pacientes tienen 150/95 mmHg. Uno tiene 45 años, no fuma y no tiene albuminuria. El otro tiene 70 años, diabetes, enfermedad renal y un ictus previo. La misma cifra no significa el mismo riesgo ni la misma urgencia. Estratificar permite tratar más intensamente a quien más se beneficia.',
    },
    objetivos: [
      'Aplicar la estratificación de riesgo cardiovascular en hipertensión.',
      'Reconocer el daño de órgano mediado por hipertensión.',
      'Identificar los factores que cambian el umbral y la meta.',
      'Usar el riesgo para decidir el tratamiento y el seguimiento.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'Riesgo cardiovascular', definicion: 'Probabilidad de eventos como infarto, ictus o muerte cardiovascular en un período.' },
      { icono: 'Activity', termino: 'Daño de órgano', definicion: 'Lesión estructural o funcional por hipertensión: corazón, riñón, retina, cerebro y arterias.' },
      { icono: 'Droplets', termino: 'Albuminuria', definicion: 'Marcador de daño renal y riesgo cardiovascular.' },
      { icono: 'Target', termino: 'Meta', definicion: 'Objetivo de presión adaptado al riesgo, la edad y la tolerancia.' },
    ],
    mapa: {
      centro: 'Riesgo y daño de órgano',
      ramas: [
        { titulo: 'Corazón', icono: 'Activity', nodos: ['Hipertrofia', 'Insuficiencia cardíaca', 'ECG'] },
        { titulo: 'Riñón', icono: 'Droplets', nodos: ['TFG', 'Albuminuria', 'ERC'] },
        { titulo: 'Cerebro', icono: 'Network', nodos: ['Ictus', 'Deterioro cognitivo'] },
        { titulo: 'Vasos', icono: 'Gauge', nodos: ['Rigidez', 'Retina', 'Aterosclerosis'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo se estratifica',
        parrafos: [
          'La estratificación combina la cifra de presión con los factores de riesgo, el daño de órgano y las comorbilidades. La edad, el tabaco, la diabetes, la dislipidemia, la obesidad, el sedentarismo y la historia familiar aumentan el riesgo. La enfermedad cardiovascular, la enfermedad renal y la diabetes con daño de órgano colocan al paciente en riesgo alto o muy alto.',
          'El daño de órgano se busca con ECG, ecocardiograma, TFG, albuminuria, fondo de ojo y evaluación de arterias. No todos los estudios son necesarios en todos los pacientes; se eligen según el riesgo y la disponibilidad. La albuminuria y la TFG son especialmente útiles porque cambian el tratamiento.',
        ],
      },
      {
        titulo: 'Qué cambia el riesgo',
        parrafos: [
          'Un paciente con riesgo alto o muy alto se beneficia de un umbral más bajo y de una meta más estricta, si la tolera. La diabetes, la enfermedad renal, la insuficiencia cardíaca y la enfermedad coronaria hacen que el control de la presión tenga un impacto mayor. La presencia de daño de órgano también justifica intensificar.',
          'El riesgo no es estático. Cambia con la edad, el peso, el tabaco, la función renal y los eventos. La reevaluación periódica permite ajustar el tratamiento y evitar la inercia.',
        ],
      },
      {
        titulo: 'El papel del QF',
        parrafos: [
          'El QF puede revisar los datos disponibles, detectar albuminuria no evaluada, revisar la adherencia y los medicamentos que elevan la presión. También puede educar sobre el riesgo y la importancia de las medidas no farmacológicas.',
          'La comunicación con el equipo tratante debe incluir el riesgo, el daño de órgano y las barreras. Un paciente con riesgo alto y presión no controlada necesita una intervención oportuna, no solo una nueva receta.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluación del riesgo en cinco pasos',
      pasos: [
        { titulo: 'Medir', detalle: 'Presión confirmada y técnica correcta.', icono: 'Gauge', evidencia: 'Promedio.' },
        { titulo: 'Buscar daño', detalle: 'ECG, TFG, albuminuria y fondo de ojo según el caso.', icono: 'Search', evidencia: 'Resultados.' },
        { titulo: 'Revisar factores', detalle: 'Edad, tabaco, diabetes, lípidos y peso.', icono: 'ClipboardList', evidencia: 'Historia.' },
        { titulo: 'Estratificar', detalle: 'Riesgo bajo, moderado, alto o muy alto.', icono: 'ShieldCheck', evidencia: 'Categoría.' },
        { titulo: 'Decidir', detalle: 'Umbral, meta y seguimiento.', icono: 'Target', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: 'Diabetes y albuminuria',
      contexto: 'Paciente de 58 años, presión 146/92, diabetes, TFG 62 ml/min y albuminuria 90 mg/g. No tiene eventos previos.',
      pregunta: '¿Qué riesgo y conducta corresponden?',
      opciones: [
        { texto: 'Riesgo bajo; solo estilo de vida.', correcta: false, retro: 'La diabetes y la albuminuria aumentan el riesgo; requiere tratamiento y seguimiento.' },
        { texto: 'Riesgo alto; tratar y buscar nefroprotección con meta individualizada.', correcta: true, retro: 'La albuminuria y la diabetes colocan al paciente en riesgo alto. Se trata y se protege el riñón.' },
        { texto: 'Riesgo moderado; esperar seis meses.', correcta: false, retro: 'La albuminuria y la diabetes justifican intervención.' },
      ],
    },
    errores: [
      { error: 'Clasificar solo por la cifra.', correccion: 'El riesgo y el daño de órgano cambian la decisión.' },
      { error: 'No medir albuminuria.', correccion: 'Es un marcador clave de daño renal y riesgo.' },
      { error: 'No reevaluar el riesgo.', correccion: 'El riesgo cambia con el tiempo y el tratamiento.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es el daño de órgano mediado por hipertensión?', respuesta: 'Lesión de corazón, riñón, retina, cerebro o vasos por presión elevada.' },
      { pregunta: '¿Qué marcadores renales se usan?', respuesta: 'TFG y albuminuria.' },
      { pregunta: '¿Qué cambia en riesgo alto?', respuesta: 'El umbral y la meta suelen ser más estrictos.' },
    ],
    resumen: [
      'La misma presión no implica el mismo **riesgo**.',
      'La albuminuria y la TFG son clave.',
      'El riesgo guía el umbral y la meta.',
      'La reevaluación evita la inercia.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'Organización Mundial de la Salud. Hipertensión: datos y cifras.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de daño de órgano', descripcion: 'Silueta humana con corazón, riñón, cerebro y ojo marcados como órganos diana.', alt: 'Daño de órgano mediado por hipertensión' },
    ],
    keywords: ['riesgo cardiovascular hipertensión', 'daño de órgano hipertensión', 'albuminuria riesgo cardiovascular', 'estratificación riesgo hipertensión', 'meta presión arterial'],
  },
  {
    titulo: 'Umbrales de tratamiento y metas de presión arterial',
    duracion: 20,
    gancho: {
      titulo: 'La meta no es la misma para todos',
      texto: 'Un paciente joven con riesgo alto puede beneficiarse de una meta más estricta. Una persona mayor y frágil puede necesitar una meta menos estricta para evitar caídas e hipotensión. La meta correcta es la que reduce eventos sin deteriorar la calidad de vida.',
    },
    objetivos: [
      'Aplicar los umbrales de tratamiento según el riesgo.',
      'Establecer metas de presión individualizadas.',
      'Reconocer el riesgo de hipotensión y sobretratamiento.',
      'Ajustar la meta según la edad, la comorbilidad y la tolerancia.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'Meta', definicion: 'Presión objetivo acordada con el paciente; suele ser <130/80 mmHg en la mayoría, con ajustes.' },
      { icono: 'Gauge', termino: 'Umbral', definicion: 'Cifra a partir de la cual se inicia tratamiento; depende del riesgo y la guía.' },
      { icono: 'AlertTriangle', termino: 'Hipotensión', definicion: 'Presión baja con síntomas; límite para intensificar.' },
      { icono: 'Users', termino: 'Individualización', definicion: 'Adaptar la meta a la edad, fragilidad, comorbilidad y preferencias.' },
    ],
    mapa: {
      centro: 'Meta de presión',
      ramas: [
        { titulo: 'General', icono: 'Target', nodos: ['<130/80', 'Tolerancia', 'Riesgo'] },
        { titulo: 'Alto riesgo', icono: 'ShieldCheck', nodos: ['Más estricta', 'Si tolera', 'Seguimiento'] },
        { titulo: 'Fragilidad', icono: 'Users', nodos: ['Menos estricta', 'Evitar caídas', 'Calidad de vida'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Hipotensión', 'Función renal', 'Electrolitos'] },
      ],
    },
    secciones: [
      {
        titulo: 'Umbrales',
        parrafos: [
          'El tratamiento farmacológico se inicia cuando la presión supera el umbral y el beneficio supera el riesgo. En riesgo alto o muy alto, el umbral suele ser más bajo. En personas mayores y frágiles, se individualiza. El estilo de vida siempre forma parte del tratamiento.',
          'La decisión no se basa solo en la cifra. La adherencia, la tolerancia, las comorbilidades y las preferencias importan. Un paciente con presión limítrofe y bajo riesgo puede empezar con cambios de estilo de vida y seguimiento.',
        ],
      },
      {
        titulo: 'Metas',
        parrafos: [
          'La meta general es <130/80 mmHg para la mayoría de los adultos que toleran el tratamiento. En pacientes de alto riesgo, puede buscarse una meta más estricta si no hay efectos adversos. En personas mayores, frágiles o con hipotensión ortostática, se acepta una meta menos estricta.',
          'La meta debe acordarse y revisarse. No se debe intensificar de forma automática si el paciente tiene mareo, caídas o deterioro de la función renal. La calidad de vida es parte del objetivo.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisa la presión en cada contacto, con técnica correcta. La AMPA ayuda a evaluar el control fuera del consultorio. Se revisan electrolitos y función renal después de iniciar o ajustar diuréticos, IECA/ARA-II o antagonistas de mineralocorticoides.',
          'La inercia terapéutica es frecuente: un paciente con presión alta y sin ajustes durante meses. El QF puede detectar la falta de control y proponer un plan al equipo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo acordar una meta',
      pasos: [
        { titulo: 'Evaluar riesgo', detalle: 'Edad, comorbilidad, daño de órgano y fragilidad.', icono: 'ShieldCheck', evidencia: 'Evaluación.' },
        { titulo: 'Medir', detalle: 'Presión confirmada y AMPA si es posible.', icono: 'Gauge', evidencia: 'Promedio.' },
        { titulo: 'Definir meta', detalle: '<130/80 general, ajustada según tolerancia.', icono: 'Target', evidencia: 'Meta.' },
        { titulo: 'Tratar', detalle: 'Estilo de vida y fármacos según riesgo.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Revisar', detalle: 'Presión, síntomas y electrolitos.', icono: 'CalendarClock', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'La meta de doña Rosa',
      contexto: 'Mujer de 84 años, frágil, con hipotensión ortostática y presión 142/78 mmHg. Vive sola.',
      pregunta: '¿Cuál es la meta más razonable?',
      opciones: [
        { texto: 'Llevarla a <120/70 aunque tenga mareos.', correcta: false, retro: 'La meta estricta aumenta el riesgo de caídas y hipotensión en una paciente frágil.' },
        { texto: 'Una meta menos estricta, evitando hipotensión y caídas.', correcta: true, retro: 'En fragilidad, la seguridad y la calidad de vida son prioritarias.' },
        { texto: 'Suspender todo tratamiento.', correcta: false, retro: 'La hipertensión no tratada también causa daño; se ajusta, no se abandona.' },
      ],
    },
    errores: [
      { error: 'Aplicar la misma meta a todos.', correccion: 'Individualizar según edad, fragilidad y tolerancia.' },
      { error: 'Intensificar sin revisar síntomas.', correccion: 'La hipotensión y las caídas son límites.' },
      { error: 'No revisar electrolitos.', correccion: 'Los diuréticos y el bloqueo del sistema renina-angiotensina pueden alterarlos.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es la meta general?', respuesta: '<130/80 mmHg para la mayoría, si se tolera.' },
      { pregunta: '¿Cuándo se acepta una meta menos estricta?', respuesta: 'En fragilidad, edad avanzada, hipotensión o mala tolerancia.' },
      { pregunta: '¿Qué se revisa después de ajustar?', respuesta: 'Presión, síntomas, función renal y electrolitos.' },
    ],
    resumen: [
      'La meta es **individualizada**.',
      'El riesgo alto puede justificar una meta más estricta.',
      'La fragilidad exige seguridad.',
      'La inercia también es un problema.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'Organización Mundial de la Salud. Hipertensión: datos y cifras.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de metas', descripcion: 'Pirámide de metas de presión con ejemplos de paciente joven, alto riesgo y frágil.', alt: 'Metas de presión arterial individualizadas' },
    ],
    keywords: ['meta de presión arterial', 'umbral de tratamiento hipertensión', 'meta 130/80', 'hipertensión adulto mayor', 'hipotensión ortostática', 'tratamiento hipertensión'],
  },
  {
    titulo: 'Caso: clasificación, riesgo y meta en una paciente con diabetes y albuminuria',
    duracion: 25,
    gancho: {
      titulo: 'La paciente que necesitaba más que una pastilla',
      texto: 'María tiene 56 años, diabetes tipo 2, presión 152/94 mmHg, albuminuria de 110 mg/g y HbA1c de 7,9 %. Toma metformina y un ARA-II a dosis baja. Cree que su presión está “casi bien” porque no tiene síntomas. La albuminuria y la diabetes indican riesgo alto y la necesidad de intensificar con criterio.',
    },
    objetivos: [
      'Integrar clasificación, riesgo y meta en un caso real.',
      'Seleccionar un esquema antihipertensivo inicial racional.',
      'Reconocer la importancia de la nefroprotección.',
      'Diseñar educación y seguimiento.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Albuminuria', definicion: 'Daño renal y riesgo cardiovascular; guía la nefroprotección.' },
      { icono: 'Layers', termino: 'Combinación', definicion: 'Uso de fármacos con mecanismos complementarios para lograr la meta.' },
      { icono: 'ShieldCheck', termino: 'Nefroprotección', definicion: 'Bloqueo del sistema renina-angiotensina, control de presión y iSGLT2 cuando está indicado.' },
      { icono: 'Target', termino: 'Meta', definicion: 'Presión objetivo individualizada, generalmente <130/80 mmHg.' },
    ],
    mapa: {
      centro: 'Diabetes y albuminuria',
      ramas: [
        { titulo: 'Riesgo', icono: 'ShieldCheck', nodos: ['Alto', 'Renal', 'Cardiovascular'] },
        { titulo: 'Tratamiento', icono: 'Pill', nodos: ['IECA/ARA-II', 'Tiazida', 'Combinación'] },
        { titulo: 'Nefroprotección', icono: 'Droplets', nodos: ['Albuminuria', 'TFG', 'iSGLT2'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['Presión', 'Potasio', 'Creatinina'] },
      ],
    },
    secciones: [
      {
        titulo: 'Clasificación y riesgo',
        parrafos: [
          'La presión de 152/94 mmHg confirma hipertensión. La diabetes y la albuminuria colocan a la paciente en riesgo alto. La meta razonable es <130/80 mmHg, con control de la albuminuria y de la función renal. No se trata solo de bajar la cifra: se busca protección cardiorrenal.',
          'El ARA-II a dosis baja puede optimizarse si la función renal y el potasio lo permiten. La combinación con un calcioantagonista o una tiazida es razonable. Se revisan adherencia, sal, peso y otros medicamentos que elevan la presión.',
        ],
      },
      {
        titulo: 'Tratamiento y seguridad',
        parrafos: [
          'Se revisa la función renal y el potasio antes y después de intensificar el bloqueo del sistema renina-angiotensina. Los IECA y ARA-II no se combinan entre sí. La tiazida puede causar hiponatremia e hipopotasemia. El calcioantagonista puede causar edema.',
          'La educación incluye automedida, restricción de sal, actividad física y adherencia. La paciente debe saber que la albuminuria es un marcador de riesgo y que el tratamiento puede retrasar la progresión renal.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisa la presión en cuatro semanas, la creatinina y el potasio. La albuminuria se reevalúa en tres a seis meses. Si la meta no se alcanza, se intensifica de forma escalonada. Si hay hipotensión o deterioro renal, se ajusta.',
          'El QF documenta la intervención y coordina con el equipo. La continuidad y la educación son clave para un control sostenido.',
        ],
      },
    ],
    proceso: {
      titulo: 'Abordaje de la paciente',
      pasos: [
        { titulo: 'Confirmar', detalle: 'Presión, diabetes y albuminuria.', icono: 'Gauge', evidencia: 'Datos.' },
        { titulo: 'Estratificar', detalle: 'Riesgo alto por diabetes y albuminuria.', icono: 'ShieldCheck', evidencia: 'Riesgo.' },
        { titulo: 'Optimizar', detalle: 'Bloqueo del SRAA y combinación.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Sal, automedida y adherencia.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Presión, potasio y creatinina.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'ARA-II a dosis baja',
      contexto: 'María, 56 años, diabetes, albuminuria 110 mg/g, presión 152/94, ARA-II a dosis baja. TFG 68 ml/min y potasio 4,3 mEq/L.',
      pregunta: '¿Qué ajuste es más razonable?',
      opciones: [
        { texto: 'Suspender el ARA-II por la albuminuria.', correcta: false, retro: 'La albuminuria es una indicación de bloqueo del SRAA, no de suspensión.' },
        { texto: 'Optimizar el ARA-II y añadir un calcioantagonista o tiazida, con control de potasio y creatinina.', correcta: true, retro: 'La combinación y la optimización buscan la meta y la nefroprotección.' },
        { texto: 'Añadir dos IECA.', correcta: false, retro: 'No se combinan IECA y ARA-II.' },
      ],
    },
    errores: [
      { error: 'No medir albuminuria.', correccion: 'Es clave para el riesgo y la nefroprotección.' },
      { error: 'Combinar IECA y ARA-II.', correccion: 'Aumenta el riesgo renal sin beneficio.' },
      { error: 'No revisar potasio.', correccion: 'El bloqueo del SRAA puede causar hiperpotasemia.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es la meta en esta paciente?', respuesta: '<130/80 mmHg, con control de albuminuria.' },
      { pregunta: '¿Qué fármacos se combinan?', respuesta: 'ARA-II o IECA con calcioantagonista o tiazida, no IECA con ARA-II.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Presión, potasio, creatinina y albuminuria.' },
    ],
    resumen: [
      'Diabetes y albuminuria implican **riesgo alto**.',
      'La meta es <130/80 mmHg.',
      'La nefroprotección es parte del tratamiento.',
      'El seguimiento de potasio y creatinina es obligatorio.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Losartán potásico.', url: 'https://cima.aemps.es/cima/dochtml/ft/67729/FT_67729.html' },
    ],
    imagenes: [
      { ubicacion: 'Sección del caso', descripcion: 'Expediente con presión 152/94, albuminuria y un plan de combinación antihipertensiva.', alt: 'Caso de hipertensión con diabetes y albuminuria' },
    ],
    keywords: ['hipertensión diabetes albuminuria', 'caso clínico hipertensión', 'meta presión diabetes', 'nefroprotección hipertensión', 'ARA-II albuminuria'],
  },
  {
    titulo: 'Introducción a la unidad: los fármacos de primera línea y el sistema renina-angiotensina-aldosterona',
    duracion: 20,
    gancho: {
      titulo: 'El sistema que regula la presión',
      texto: 'El sistema renina-angiotensina-aldosterona regula la volemia y la resistencia vascular. Los IECA y los ARA-II lo bloquean en puntos distintos. Entenderlo explica por qué son útiles en hipertensión, diabetes y enfermedad renal, y por qué requieren control de potasio y creatinina.',
    },
    objetivos: [
      'Explicar el sistema renina-angiotensina-aldosterona.',
      'Diferenciar los grupos de primera línea.',
      'Reconocer el lugar de IECA y ARA-II.',
      'Identificar los controles de seguridad.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Renina', definicion: 'Enzima renal que inicia el sistema y convierte angiotensinógeno en angiotensina I.' },
      { icono: 'Activity', termino: 'Angiotensina II', definicion: 'Vasoconstrictor y estimulador de aldosterona; aumenta la presión y la retención de sodio.' },
      { icono: 'Pill', termino: 'IECA', definicion: 'Inhiben la enzima convertidora y reducen la formación de angiotensina II.' },
      { icono: 'Pill', termino: 'ARA-II', definicion: 'Bloquean el receptor AT1 de la angiotensina II.' },
    ],
    mapa: {
      centro: 'Sistema renina-angiotensina',
      ramas: [
        { titulo: 'Riñón', icono: 'Droplets', nodos: ['Renina', 'Sodio', 'Volumen'] },
        { titulo: 'Vasos', icono: 'Gauge', nodos: ['Angiotensina II', 'Vasoconstricción'] },
        { titulo: 'Aldosterona', icono: 'Activity', nodos: ['Retención de sodio', 'Potasio'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['IECA', 'ARA-II', 'Espironolactona'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo funciona',
        parrafos: [
          'La renina convierte el angiotensinógeno en angiotensina I, que la enzima convertidora transforma en angiotensina II. La angiotensina II contrae los vasos, estimula la aldosterona y retiene sodio y agua. El resultado es un aumento de la presión. Los IECA bloquean la enzima convertidora; los ARA-II bloquean el receptor AT1.',
          'El bloqueo reduce la presión y la albuminuria, y protege el corazón y el riñón en pacientes seleccionados. También puede elevar el potasio y la creatinina, sobre todo al inicio. Esa es la razón de los controles.',
        ],
      },
      {
        titulo: 'Primera línea',
        parrafos: [
          'Los grupos de primera línea incluyen IECA, ARA-II, calcioantagonistas y tiazidas. La elección depende de la comorbilidad, la edad, el embarazo, la función renal y la tolerancia. En diabetes con albuminuria, se prefieren IECA o ARA-II. En personas mayores, los calcioantagonistas y las tiazidas son útiles.',
          'No se combinan IECA y ARA-II. La combinación de un bloqueador del sistema renina-angiotensina con un calcioantagonista o una tiazida es frecuente y eficaz.',
        ],
      },
      {
        titulo: 'Controles',
        parrafos: [
          'Antes de iniciar, se revisan función renal y potasio. Después de iniciar o ajustar, se controlan creatinina y potasio. Un aumento leve de creatinina puede ser esperado; un aumento importante o hiperpotasemia requiere ajuste.',
          'La tos seca es característica de los IECA. El angioedema es raro pero grave. Los ARA-II tienen menos tos, pero comparten riesgos de hiperpotasemia y daño renal en situaciones de deshidratación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo elegir un bloqueador del SRAA',
      pasos: [
        { titulo: 'Evaluar indicación', detalle: 'Hipertensión, diabetes, albuminuria o insuficiencia cardíaca.', icono: 'Target', evidencia: 'Indicación.' },
        { titulo: 'Revisar función renal', detalle: 'TFG y potasio.', icono: 'Droplets', evidencia: 'Resultados.' },
        { titulo: 'Elegir', detalle: 'IECA o ARA-II según tolerancia y embarazo.', icono: 'Pill', evidencia: 'Selección.' },
        { titulo: 'Controlar', detalle: 'Creatinina y potasio después de iniciar.', icono: 'LineChart', evidencia: 'Control.' },
        { titulo: 'Seguir', detalle: 'Presión, adherencia y efectos adversos.', icono: 'CalendarClock', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Tos con IECA',
      contexto: 'Paciente con hipertensión y albuminuria que desarrolla tos seca con enalapril.',
      pregunta: '¿Qué alternativa es razonable?',
      opciones: [
        { texto: 'Añadir un segundo IECA.', correcta: false, retro: 'No se combinan IECA.' },
        { texto: 'Cambiar a un ARA-II, con control de potasio y creatinina.', correcta: true, retro: 'El ARA-II ofrece bloqueo del SRAA con menos tos.' },
        { texto: 'Suspender todo tratamiento.', correcta: false, retro: 'La albuminuria requiere bloqueo; se cambia, no se abandona.' },
      ],
    },
    errores: [
      { error: 'Combinar IECA y ARA-II.', correccion: 'Aumenta el riesgo renal sin beneficio.' },
      { error: 'No controlar potasio.', correccion: 'La hiperpotasemia es un riesgo.' },
      { error: 'Usar IECA en embarazo.', correccion: 'Están contraindicados; se usan otras opciones.' },
    ],
    comprueba: [
      { pregunta: '¿Dónde actúan los IECA?', respuesta: 'Inhiben la enzima convertidora de angiotensina.' },
      { pregunta: '¿Dónde actúan los ARA-II?', respuesta: 'Bloquean el receptor AT1.' },
      { pregunta: '¿Qué se controla al iniciar?', respuesta: 'Creatinina y potasio.' },
    ],
    resumen: [
      'El SRAA regula **volemia y resistencia vascular**.',
      'IECA y ARA-II bloquean el sistema en puntos distintos.',
      'No se combinan entre sí.',
      'Potasio y creatinina se controlan.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Enalapril maleato.', url: 'https://cima.aemps.es/cima/dochtml/ft/73300/FT_73300.html' },
    ],
    imagenes: [
      { ubicacion: 'Sección del sistema', descripcion: 'Esquema del sistema renina-angiotensina con los puntos de acción de IECA y ARA-II.', alt: 'Sistema renina-angiotensina-aldosterona' },
    ],
    keywords: ['sistema renina angiotensina aldosterona', 'IECA mecanismo', 'ARA-II mecanismo', 'primera línea hipertensión', 'hiperpotasemia IECA'],
  },
  {
    titulo: 'IECA: enalapril — mecanismo, posología, tos, angioedema y calidad',
    duracion: 20,
    gancho: {
      titulo: 'La tos que hace abandonar el tratamiento',
      texto: 'El enalapril es eficaz, económico y útil en diabetes y enfermedad renal. Pero la tos seca afecta a una parte de los pacientes y puede llevar al abandono. Conocer el mecanismo, la dosis y las alternativas permite mantener el beneficio sin sacrificar la tolerancia.',
    },
    objetivos: [
      'Explicar el mecanismo y las indicaciones del enalapril.',
      'Aplicar la dosis y el ajuste renal.',
      'Reconocer la tos, el angioedema y la hiperpotasemia.',
      'Elegir una alternativa cuando hay intolerancia.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Enalapril', definicion: 'IECA que reduce la formación de angiotensina II y la aldosterona.' },
      { icono: 'AlertTriangle', termino: 'Tos', definicion: 'Efecto adverso frecuente de los IECA, seco y persistente.' },
      { icono: 'AlertTriangle', termino: 'Angioedema', definicion: 'Hinchazón de labios, lengua o vía aérea; es una emergencia.' },
      { icono: 'Droplets', termino: 'Potasio', definicion: 'Puede aumentar por el bloqueo del SRAA; se controla.' },
    ],
    mapa: {
      centro: 'Enalapril',
      ramas: [
        { titulo: 'Mecanismo', icono: 'Pill', nodos: ['Menos angiotensina II', 'Menos aldosterona', 'Vasodilatación'] },
        { titulo: 'Dosis', icono: 'CalendarClock', nodos: ['5 mg', '10-20 mg', 'Ajuste renal'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Tos', 'Angioedema', 'Hiperpotasemia'] },
        { titulo: 'Alternativa', icono: 'RefreshCw', nodos: ['ARA-II', 'Calcioantagonista'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo y dosis',
        parrafos: [
          'El enalapril inhibe la enzima convertidora de angiotensina, reduce la angiotensina II y la aldosterona, y disminuye la resistencia vascular. Se usa en hipertensión, insuficiencia cardíaca y enfermedad renal con albuminuria. La dosis inicial habitual es 5 mg al día, con titulación a 10-20 mg según respuesta.',
          'En insuficiencia renal se ajusta según la TFG. Se revisan creatinina y potasio antes y después de iniciar. La dosis se titula con presión y tolerancia.',
        ],
      },
      {
        titulo: 'Tos y angioedema',
        parrafos: [
          'La tos seca es un efecto frecuente y puede aparecer semanas después de iniciar. Si es intolerable, se cambia a un ARA-II. El angioedema es raro pero grave: hinchazón de labios, lengua, cara o vía aérea. Requiere suspensión inmediata y atención urgente. No se debe reintroducir un IECA después de un angioedema.',
          'La hiperpotasemia es más probable en enfermedad renal, diabetes, uso de espironolactona o suplementos de potasio. Se controla el potasio y se educa sobre alimentos ricos en potasio.',
        ],
      },
      {
        titulo: 'Calidad y adherencia',
        parrafos: [
          'El enalapril es económico y ampliamente disponible. La adherencia depende de la tolerancia y de la comprensión. El QF puede explicar la tos, revisar la técnica y proponer el cambio al médico si es necesario.',
          'No se debe suspender el tratamiento por una tos leve sin consultar; pero tampoco se debe ignorar una tos que afecta la calidad de vida. La decisión se comparte.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo iniciar enalapril',
      pasos: [
        { titulo: 'Indicación', detalle: 'Hipertensión, IC o albuminuria.', icono: 'Target', evidencia: 'Indicación.' },
        { titulo: 'Función renal', detalle: 'TFG y potasio.', icono: 'Droplets', evidencia: 'Resultados.' },
        { titulo: 'Dosis', detalle: '5 mg y titulación.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Educar', detalle: 'Tos, angioedema y potasio.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Presión, creatinina y potasio.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Tos persistente',
      contexto: 'Paciente con enalapril 20 mg, tos seca que interfiere con el sueño, presión controlada y albuminuria.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Aumentar la dosis.', correcta: false, retro: 'Empeora la tos sin mejorar el problema.' },
        { texto: 'Proponer cambio a ARA-II y controlar potasio y creatinina.', correcta: true, retro: 'El ARA-II mantiene el bloqueo con menos tos.' },
        { texto: 'Suspender sin alternativa.', correcta: false, retro: 'La albuminuria requiere bloqueo; se cambia.' },
      ],
    },
    errores: [
      { error: 'Reintroducir IECA tras angioedema.', correccion: 'Está contraindicado.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo de hiperpotasemia.' },
      { error: 'Atribuir toda tos al enalapril sin evaluar.', correccion: 'Revisar otras causas, pero considerar el cambio si es típica.' },
    ],
    comprueba: [
      { pregunta: '¿Qué efecto adverso es típico del enalapril?', respuesta: 'Tos seca.' },
      { pregunta: '¿Qué es una emergencia?', respuesta: 'El angioedema.' },
      { pregunta: '¿Qué alternativa existe si hay tos?', respuesta: 'Un ARA-II.' },
    ],
    resumen: [
      'Enalapril: **IECA** eficaz y económico.',
      'Tos seca y angioedema son clave.',
      'Controlar potasio y creatinina.',
      'El ARA-II es alternativa si hay tos.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Enalapril maleato.', url: 'https://cima.aemps.es/cima/dochtml/ft/73300/FT_73300.html' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de seguridad', descripcion: 'Paciente con tos y un recuadro de angioedema, junto a un frasco de enalapril.', alt: 'Enalapril, tos y angioedema' },
    ],
    keywords: ['enalapril dosis', 'enalapril tos', 'enalapril angioedema', 'IECA hipertensión', 'enalapril función renal', 'enalapril hiperpotasemia'],
  },
  {
    titulo: 'ARA-II: losartán y otros sartanes',
    duracion: 20,
    gancho: {
      titulo: 'La alternativa sin tos',
      texto: 'Los sartanes bloquean el receptor AT1 y ofrecen una alternativa a los IECA, sobre todo cuando la tos es intolerable. No son intercambiables sin criterio: tienen diferencias de potencia, duración y evidencia. Conocerlos evita cambios innecesarios y permite elegir bien.',
    },
    objetivos: [
      'Explicar el mecanismo de los ARA-II.',
      'Comparar losartán, valsartán, candesartán y otros.',
      'Aplicar dosis y controles de seguridad.',
      'Reconocer las diferencias con los IECA.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'ARA-II', definicion: 'Bloqueadores del receptor AT1 de la angiotensina II.' },
      { icono: 'Activity', termino: 'Losartán', definicion: 'ARA-II con evidencia en hipertensión, ictus y nefroprotección.' },
      { icono: 'Droplets', termino: 'Potasio', definicion: 'Puede aumentar; se controla al iniciar y ajustar.' },
      { icono: 'RefreshCw', termino: 'Diferencia', definicion: 'Los ARA-II no inhiben la enzima convertidora y causan menos tos.' },
    ],
    mapa: {
      centro: 'ARA-II',
      ramas: [
        { titulo: 'Mecanismo', icono: 'Pill', nodos: ['Bloqueo AT1', 'Menos aldosterona', 'Vasodilatación'] },
        { titulo: 'Fármacos', icono: 'Layers', nodos: ['Losartán', 'Valsartán', 'Candesartán'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Hiperpotasemia', 'Función renal', 'Embarazo'] },
        { titulo: 'Uso', icono: 'Target', nodos: ['Hipertensión', 'Albuminuria', 'IC'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo y diferencias',
        parrafos: [
          'Los ARA-II bloquean el receptor AT1, reducen la vasoconstricción y la aldosterona, y disminuyen la presión. A diferencia de los IECA, no inhiben la enzima convertidora y no aumentan la bradicinina, por lo que causan menos tos. Comparten el riesgo de hiperpotasemia y de deterioro renal en situaciones de deshidratación.',
          'El losartán tiene evidencia en hipertensión, prevención de ictus en pacientes con hipertrofia ventricular y nefroprotección en diabetes tipo 2. El valsartán y el candesartán también se usan. La elección depende de la indicación, la cobertura y la tolerancia.',
        ],
      },
      {
        titulo: 'Dosis y controles',
        parrafos: [
          'El losartán se inicia con 50 mg al día y puede aumentarse a 100 mg. En insuficiencia hepática se usa una dosis menor. Se controlan creatinina y potasio después de iniciar o ajustar. No se combina con IECA.',
          'En embarazo están contraindicados. En insuficiencia renal avanzada se usan con precaución y vigilancia. La educación incluye evitar suplementos de potasio sin control y reportar mareo o deshidratación.',
        ],
      },
      {
        titulo: 'Calidad y adherencia',
        parrafos: [
          'Los sartanes suelen tolerarse bien, lo que mejora la adherencia. El costo y la cobertura pueden variar. El QF puede revisar la adherencia, la presión y los controles.',
          'No se debe cambiar de un ARA-II a otro sin una razón clara. La evidencia y la indicación guían la elección.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo iniciar un ARA-II',
      pasos: [
        { titulo: 'Indicación', detalle: 'Hipertensión, albuminuria o IC.', icono: 'Target', evidencia: 'Indicación.' },
        { titulo: 'Función renal', detalle: 'TFG y potasio.', icono: 'Droplets', evidencia: 'Resultados.' },
        { titulo: 'Dosis', detalle: 'Losartán 50 mg y titulación.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Educar', detalle: 'Potasio, mareo y embarazo.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Presión, creatinina y potasio.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Cambio por tos',
      contexto: 'Paciente con enalapril y tos; albuminuria y presión 138/86. TFG 70 ml/min, potasio 4,2.',
      pregunta: '¿Qué cambio es razonable?',
      opciones: [
        { texto: 'Añadir losartán al enalapril.', correcta: false, retro: 'No se combinan IECA y ARA-II.' },
        { texto: 'Sustituir el enalapril por losartán y controlar potasio y creatinina.', correcta: true, retro: 'El ARA-II mantiene el bloqueo y reduce la tos.' },
        { texto: 'Suspender el bloqueo del SRAA.', correcta: false, retro: 'La albuminuria se beneficia del bloqueo.' },
      ],
    },
    errores: [
      { error: 'Combinar ARA-II con IECA.', correccion: 'No se recomienda.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo de hiperpotasemia.' },
      { error: 'Usar en embarazo.', correccion: 'Contraindicados.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué los ARA-II causan menos tos?', respuesta: 'Porque no inhiben la enzima convertidora ni aumentan la bradicinina.' },
      { pregunta: '¿Con qué se controla la seguridad?', respuesta: 'Creatinina y potasio.' },
      { pregunta: '¿Se combinan con IECA?', respuesta: 'No.' },
    ],
    resumen: [
      'Los ARA-II bloquean **AT1**.',
      'Causan menos tos que los IECA.',
      'Controlar potasio y creatinina.',
      'No se combinan con IECA.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Losartán potásico.', url: 'https://cima.aemps.es/cima/dochtml/ft/67729/FT_67729.html' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de comparación', descripcion: 'Tabla comparativa IECA vs ARA-II con tos, potasio y mecanismo.', alt: 'Diferencia entre IECA y ARA-II' },
    ],
    keywords: ['losartán dosis', 'ARA-II hipertensión', 'losartán vs enalapril', 'sartanes efectos adversos', 'losartán albuminuria'],
  },
  {
    titulo: 'Farmacovigilancia de los sartanes: impurezas tipo nitrosamina y azido',
    duracion: 20,
    gancho: {
      titulo: 'La pastilla retirada por una impureza',
      texto: 'Un paciente pregunta si su losartán es seguro después de escuchar sobre retiros por nitrosaminas. La respuesta no es alarmista: las autoridades detectaron impurezas en algunos lotes, se retiraron y se establecieron límites. La farmacovigilancia permite distinguir un riesgo real de un rumor.',
    },
    objetivos: [
      'Explicar qué son las nitrosaminas y los azidos.',
      'Reconocer el papel de la farmacovigilancia regulatoria.',
      'Identificar cómo verificar lotes y alertas.',
      'Educar al paciente sin alarmismo.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Nitrosamina', definicion: 'Impureza potencialmente carcinógena detectada en algunos sartanes; los límites se basan en exposición.' },
      { icono: 'ShieldCheck', termino: 'Retiro', definicion: 'Medida regulatoria para lotes afectados; no implica que todo el fármaco sea inseguro.' },
      { icono: 'Search', termino: 'Lote', definicion: 'Identificador de producción; permite rastrear el producto y verificar alertas.' },
      { icono: 'FileCheck', termino: 'Reporte', definicion: 'Notificación de sospechas o problemas de calidad a la autoridad.' },
    ],
    mapa: {
      centro: 'Farmacovigilancia de sartanes',
      ramas: [
        { titulo: 'Impurezas', icono: 'AlertTriangle', nodos: ['Nitrosaminas', 'Azidos', 'Límites'] },
        { titulo: 'Regulación', icono: 'Landmark', nodos: ['INVIMA', 'EMA', 'FDA'] },
        { titulo: 'Verificación', icono: 'Search', nodos: ['Lote', 'Registro', 'Cadena'] },
        { titulo: 'Paciente', icono: 'Users', nodos: ['No alarmismo', 'No suspender', 'Consultar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué son las impurezas',
               parrafos: [
          'Las nitrosaminas son compuestos que pueden formarse durante la síntesis o el almacenamiento de algunos fármacos. Los azidos son otra clase de impureza. Las autoridades establecieron límites de exposición y retiraron lotes cuando se superaron. El riesgo depende de la dosis y del tiempo de exposición; no es equivalente a un riesgo inmediato.',
          'Los retiros de sartanes fueron una acción de calidad, no una señal de que todos los sartanes causen cáncer. Los pacientes no deben suspender el tratamiento sin consultar, porque el riesgo cardiovascular de la hipertensión no tratada es mayor.',
        ],
      },
      {
        titulo: 'Cómo responder al paciente',
        parrafos: [
          'El QF puede explicar que las autoridades monitorean y que los lotes afectados se retiraron. Puede verificar el registro y el lote, y consultar las alertas oficiales. Si el paciente tiene un producto de un lote retirado, se reemplaza y se reporta.',
          'La comunicación debe ser clara y sin alarmismo. Se refuerza la importancia de no suspender el tratamiento y de consultar ante dudas. La confianza se construye con información verificable.',
        ],
      },
      {
        titulo: 'Reporte y calidad',
        parrafos: [
          'Las sospechas de problemas de calidad se reportan al programa de farmacovigilancia o al INVIMA. El reporte incluye producto, lote, fecha y descripción. La autoridad evalúa y toma medidas.',
          'La farmacovigilancia no es solo para reacciones adversas; también cubre fallos de calidad, falta de eficacia y errores de medicación. El QF es una fuente clave de información.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo verificar una alerta',
      pasos: [
        { titulo: 'Identificar', detalle: 'Producto, lote y titular.', icono: 'Search', evidencia: 'Caja.' },
        { titulo: 'Consultar', detalle: 'Alertas oficiales del INVIMA.', icono: 'Landmark', evidencia: 'Alerta.' },
        { titulo: 'Evaluar', detalle: 'Si el lote está afectado.', icono: 'ShieldCheck', evidencia: 'Evaluación.' },
        { titulo: 'Actuar', detalle: 'Reemplazar, reportar y educar.', icono: 'FileCheck', evidencia: 'Reporte.' },
        { titulo: 'Seguir', detalle: 'Verificar que el paciente continúe el tratamiento.', icono: 'CalendarClock', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Lote retirado',
      contexto: 'Paciente trae losartán de un lote que aparece en una alerta del INVIMA.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Decirle que suspenda todo tratamiento.', correcta: false, retro: 'La hipertensión no tratada es un riesgo mayor. Se reemplaza el producto.' },
        { texto: 'Reemplazar el producto por uno de un lote no afectado, reportar y educar.', correcta: true, retro: 'Se mantiene el tratamiento con un producto seguro y se notifica.' },
        { texto: 'Ignorar la alerta.', correcta: false, retro: 'Las alertas oficiales deben verificarse y aplicarse.' },
      ],
    },
    errores: [
      { error: 'Alarmar y suspender el tratamiento.', correccion: 'El riesgo cardiovascular de la hipertensión no tratada es mayor.' },
      { error: 'No verificar el lote.', correccion: 'El lote permite saber si el producto está afectado.' },
      { error: 'No reportar.', correccion: 'La notificación protege a otros pacientes.' },
    ],
    comprueba: [
      { pregunta: '¿Qué son las nitrosaminas?', respuesta: 'Impurezas que pueden aparecer en algunos fármacos y tienen límites regulatorios.' },
      { pregunta: '¿Qué hacer con un lote retirado?', respuesta: 'Reemplazarlo, reportar y educar.' },
      { pregunta: '¿Se debe suspender el tratamiento?', respuesta: 'No sin consultar; el riesgo de la hipertensión no tratada es mayor.' },
    ],
    resumen: [
      'Los retiros son medidas de **calidad**.',
      'No implican que todo el fármaco sea inseguro.',
      'Verificar lote y alertas.',
      'No suspender el tratamiento sin consultar.',
    ],
    referencias: [
      { cita: 'INVIMA. Alertas sanitarias.', url: 'https://www.invima.gov.co/alertas-sanitarias' },
      { cita: 'Agencia Europea de Medicamentos. Nitrosamine impurities.', url: 'https://www.ema.europa.eu/en/human-regulatory-overview/post-authorisation/pharmacovigilance-post-authorisation/nitrosamine-impurities' },
    ],
    imagenes: [
      { ubicacion: 'Sección de impurezas', descripcion: 'Caja de losartán con lote resaltado y un sello de alerta sanitaria.', alt: 'Farmacovigilancia de sartanes y nitrosaminas' },
    ],
    keywords: ['nitrosaminas sartanes', 'losartán impurezas', 'farmacovigilancia losartán', 'alerta INVIMA sartanes', 'azidos sartanes', 'seguridad losartán'],
  },
  {
    titulo: 'Calcioantagonistas dihidropiridínicos y no dihidropiridínicos: amlodipino',
    duracion: 20,
    gancho: {
      titulo: 'El edema que no era del riñón',
      texto: 'Una paciente con amlodipino consulta por hinchazón de tobillos. Cree que es un problema renal, pero el edema es un efecto vasodilatador típico. Conocer la diferencia entre dihidropiridínicos y no dihidropiridínicos permite elegir, ajustar y explicar.',
    },
    objetivos: [
      'Diferenciar calcioantagonistas dihidropiridínicos y no dihidropiridínicos.',
      'Explicar el mecanismo y las indicaciones del amlodipino.',
      'Reconocer el edema y otras reacciones adversas.',
      'Elegir una alternativa según la comorbilidad.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'Calcio', definicion: 'El calcio entra al músculo liso vascular y cardiaco; los antagonistas bloquean los canales tipo L.' },
      { icono: 'Pill', termino: 'Amlodipino', definicion: 'Dihidropiridina vasodilatadora de acción prolongada.' },
      { icono: 'AlertTriangle', termino: 'Edema', definicion: 'Efecto adverso frecuente por vasodilatación arterial y aumento de la presión capilar.' },
      { icono: 'Activity', termino: 'No dihidropiridina', definicion: 'Verapamilo y diltiazem reducen frecuencia y conducción cardiaca.' },
    ],
    mapa: {
      centro: 'Calcioantagonistas',
      ramas: [
        { titulo: 'Dihidropiridinas', icono: 'Gauge', nodos: ['Amlodipino', 'Nifedipino', 'Vasodilatación'] },
        { titulo: 'No dihidropiridinas', icono: 'Activity', nodos: ['Verapamilo', 'Diltiazem', 'Frecuencia'] },
        { titulo: 'Usos', icono: 'Target', nodos: ['HTA', 'Angina', 'Arritmias'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Edema', 'Cefalea', 'Bradicardia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo y elección',
        parrafos: [
          'Los calcioantagonistas bloquean los canales de calcio tipo L. Las dihidropiridinas actúan sobre el músculo liso vascular y producen vasodilatación; son útiles en hipertensión y angina. Las no dihidropiridinas también reducen la frecuencia y la conducción cardiaca, por lo que se usan en algunas arritmias y se evitan en insuficiencia cardíaca con fracción de eyección reducida.',
          'El amlodipino es una dihidropiridina de acción prolongada, una vez al día. Se usa en hipertensión, angina estable y angina vasoespástica. No requiere ajuste renal y se usa con precaución en insuficiencia hepática.',
        ],
      },
      {
        titulo: 'Efectos adversos',
        parrafos: [
          'El edema periférico es frecuente y depende de la dosis. También puede causar cefalea, rubor, mareo y palpitaciones. El edema no suele responder a diuréticos y mejora al reducir la dosis o cambiar de fármaco. No se debe confundir con edema por insuficiencia cardíaca o renal.',
          'Las no dihidropiridinas pueden causar bradicardia, estreñimiento y bloqueo cardíaco. Se evitan con betabloqueadores en algunos contextos y en insuficiencia cardíaca con fracción de eyección reducida.',
        ],
      },
      {
        titulo: 'Interacciones y educación',
        parrafos: [
          'El amlodipino se metaboliza por CYP3A4. Los inhibidores potentes aumentan su exposición; los inductores la reducen. Con simvastatina, la dosis no debe superar 20 mg al día. El pomelo puede aumentar la exposición.',
          'La educación incluye tomar a la misma hora, vigilar edema y no suspender por cuenta propia. El QF puede revisar la técnica y proponer ajustes.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo iniciar amlodipino',
      pasos: [
        { titulo: 'Indicación', detalle: 'HTA o angina.', icono: 'Target', evidencia: 'Indicación.' },
        { titulo: 'Dosis', detalle: '5 mg al día; máximo 10 mg.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Revisar', detalle: 'Edema, cefalea y presión.', icono: 'AlertTriangle', evidencia: 'Evaluación.' },
        { titulo: 'Interacciones', detalle: 'Simvastatina, azoles y pomelo.', icono: 'Search', evidencia: 'Revisión.' },
        { titulo: 'Seguir', detalle: 'Presión y tolerancia.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Edema con amlodipino',
      contexto: 'Paciente con amlodipino 10 mg, edema de tobillos y presión controlada. No tiene insuficiencia cardíaca.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Añadir un diurético.', correcta: false, retro: 'El edema por amlodipino no responde bien a diuréticos.' },
        { texto: 'Reducir la dosis o cambiar a otra clase, según la presión y la tolerancia.', correcta: true, retro: 'El ajuste o cambio mejora el edema sin perder control.' },
        { texto: 'Suspender todo.', correcta: false, retro: 'Se ajusta el fármaco, no se abandona el tratamiento.' },
      ],
    },
    errores: [
      { error: 'Confundir edema por amlodipino con edema renal.', correccion: 'Revisar el contexto y los síntomas.' },
      { error: 'Usar verapamilo en IC con FE reducida.', correccion: 'Puede empeorar la insuficiencia cardíaca.' },
      { error: 'No revisar simvastatina.', correccion: 'La dosis no debe superar 20 mg al día.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia a las dihidropiridinas?', respuesta: 'Actúan principalmente en el músculo liso vascular y causan vasodilatación.' },
      { pregunta: '¿Qué efecto adverso es frecuente con amlodipino?', respuesta: 'Edema periférico.' },
      { pregunta: '¿Qué interacción es importante?', respuesta: 'Simvastatina, cuyo límite es 20 mg al día.' },
    ],
    resumen: [
      'Amlodipino: **dihidropiridina** vasodilatadora.',
      'El edema es frecuente.',
      'Las no dihidropiridinas afectan la frecuencia cardiaca.',
      'Revisar interacciones con CYP3A4.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Amlodipino besilato.', url: 'https://cima.aemps.es/cima/dochtml/ft/65460/FT_65460.html' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de efectos adversos', descripcion: 'Paciente con edema de tobillos y una caja de amlodipino, junto a una comparación con verapamilo.', alt: 'Amlodipino y edema periférico' },
    ],
    keywords: ['amlodipino dosis', 'amlodipino edema', 'calcioantagonistas hipertensión', 'dihidropiridinas', 'amlodipino simvastatina', 'verapamilo diltiazem'],
  },
];

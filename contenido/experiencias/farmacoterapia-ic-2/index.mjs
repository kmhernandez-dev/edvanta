export const CURSO = 'Curso de Farmacoterapia de la Insuficiencia Cardíaca';
export const MIGRACION = '134_experiencias_farmacoterapia_ic_2.sql';

export const CLASES = [
  {
    titulo: 'Antagonistas del receptor mineralocorticoide: espironolactona, eplerenona y finerenona',
    duracion: 20,
    gancho: {
      titulo: 'El pilar que eleva el potasio',
      texto: 'La espironolactona reduce mortalidad en insuficiencia cardíaca con FEVI reducida, pero puede elevar el potasio. Un paciente con TFG de 38 ml/min, IECA y espironolactona llega con potasio de 5,6 mEq/L. El fármaco es útil, pero la seguridad exige control y ajuste.',
    },
    objetivos: [
      'Explicar el mecanismo de los antagonistas mineralocorticoides.',
      'Aplicar indicaciones y dosis en IC.',
      'Reconocer hiperpotasemia y efectos antiandrogénicos.',
      'Ajustar según función renal y potasio.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Aldosterona', definicion: 'Hormona que retiene sodio y excreta potasio; su bloqueo reduce fibrosis y congestión.' },
      { icono: 'Pill', termino: 'Espironolactona', definicion: 'ARM no selectivo con evidencia en IC; causa ginecomastia.' },
      { icono: 'Pill', termino: 'Eplerenona', definicion: 'ARM selectivo con menos efectos antiandrogénicos.' },
      { icono: 'AlertTriangle', termino: 'Hiperpotasemia', definicion: 'Riesgo principal, sobre todo con ERC y bloqueo del SRAA.' },
    ],
    mapa: {
      centro: 'ARM en IC',
      ramas: [
        { titulo: 'Mecanismo', icono: 'Droplets', nodos: ['Aldosterona', 'Fibrosis', 'Potasio'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Espironolactona', 'Eplerenona', 'Finerenona'] },
        { titulo: 'Dosis', icono: 'Target', nodos: ['25 mg', '50 mg', 'Ajuste'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Potasio', 'TFG', 'Ginecomastia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo y evidencia',
        parrafos: [
          'La aldosterona favorece la retención de sodio, la excreción de potasio y la fibrosis miocárdica. Los ARM bloquean el receptor mineralocorticoide y reducen la mortalidad y las hospitalizaciones en IC con FEVI reducida. La espironolactona y la eplerenona tienen evidencia; la finerenona es una opción más selectiva con estudios en IC y enfermedad renal.',
          'Se usan en pacientes con FEVI reducida y síntomas, junto con los otros pilares. La dosis habitual de espironolactona es 25 mg al día, con aumento a 50 mg si se tolera.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'La hiperpotasemia es el riesgo principal, especialmente con ERC, IECA/ARA-II o suplementos de potasio. Se controlan potasio y creatinina antes y después de iniciar. La ginecomastia y las alteraciones menstruales son frecuentes con espironolactona; la eplerenona tiene menos efectos antiandrogénicos.',
          'No se inicia si el potasio es alto o la TFG es muy baja. Se revisan las interacciones y la dieta.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe saber que el ARM mejora el pronóstico, pero requiere controles. Se explican los síntomas de hiperpotasemia y la importancia de no tomar suplementos sin control.',
          'El QF puede revisar la adherencia y los controles. La comunicación con el equipo es clave.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo iniciar un ARM',
      pasos: [
        { titulo: 'Confirmar', detalle: 'FEVI reducida y síntomas.', icono: 'Target', evidencia: 'Indicación.' },
        { titulo: 'Revisar', detalle: 'Potasio y TFG.', icono: 'Droplets', evidencia: 'Resultados.' },
        { titulo: 'Iniciar', detalle: '25 mg al día.', icono: 'Pill', evidencia: 'Dosis.' },
        { titulo: 'Controlar', detalle: 'Potasio y creatinina.', icono: 'LineChart', evidencia: 'Control.' },
        { titulo: 'Titular', detalle: '50 mg si tolera.', icono: 'RefreshCw', evidencia: 'Ajuste.' },
      ],
    },
    caso: {
      titulo: 'Potasio 5,6',
      contexto: 'Paciente con IC, TFG 38, IECA y espironolactona, potasio 5,6.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Aumentar espironolactona.', correcta: false, retro: 'Empeora la hiperpotasemia.' },
        { texto: 'Suspender o reducir el ARM, revisar el SRAA y controlar el potasio.', correcta: true, retro: 'La hiperpotasemia requiere ajuste inmediato.' },
        { texto: 'Añadir suplemento de potasio.', correcta: false, retro: 'Peligroso.' },
      ],
    },
    errores: [
      { error: 'No controlar potasio.', correccion: 'Riesgo de arritmias.' },
      { error: 'Usar en TFG muy baja sin ajuste.', correccion: 'Riesgo de hiperpotasemia.' },
      { error: 'No explicar ginecomastia.', correccion: 'Puede afectar la adherencia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármacos son ARM?', respuesta: 'Espironolactona, eplerenona y finerenona.' },
      { pregunta: '¿Qué riesgo principal tienen?', respuesta: 'Hiperpotasemia.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Potasio y función renal.' },
    ],
    resumen: [
      'Los ARM son un pilar en FEVI reducida.',
      'La hiperpotasemia es el riesgo clave.',
      'Se controlan potasio y TFG.',
      'La espironolactona puede causar ginecomastia.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Espironolactona Accord 25 mg comprimidos recubiertos con película EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/81034/FT_81034.html' },
    ],
    imagenes: [
      { ubicacion: 'Sección de seguridad', descripcion: 'Paciente con espironolactona y un resultado de potasio alto.', alt: 'Antagonistas mineralocorticoides en insuficiencia cardíaca' },
    ],
    keywords: ['espironolactona insuficiencia cardíaca', 'eplerenona IC', 'finerenona', 'ARM hiperpotasemia'],
  },
  {
    titulo: 'Inhibidores de SGLT2 en IC: dapagliflozina y empagliflozina',
    duracion: 20,
    gancho: {
      titulo: 'El pilar que no depende de la glucosa',
      texto: 'Un paciente con insuficiencia cardíaca y sin diabetes recibe dapagliflozina. La familia pregunta por qué le dan un medicamento “para la diabetes”. La respuesta es que los iSGLT2 reducen hospitalizaciones y muerte cardiovascular en IC, con o sin diabetes. El beneficio va más allá de la glucosa. La ficha repasa el inicio, la seguridad renal, las infecciones genitales y las reglas de días de enfermedad para que el paciente reciba el beneficio sin complicaciones. La revisión de volumen y presión al inicio evita hipotensión.',
    },
    objetivos: [
      'Explicar el beneficio de los iSGLT2 en IC.',
      'Aplicar inicio y seguimiento.',
      'Reconocer efectos adversos y reglas de días de enfermedad.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'iSGLT2', definicion: 'Inhibidor renal que aumenta la glucosuria y reduce congestión.' },
      { icono: 'Activity', termino: 'Beneficio', definicion: 'Menos hospitalizaciones y muerte cardiovascular.' },
      { icono: 'AlertTriangle', termino: 'Cetoacidosis', definicion: 'Rara pero grave; puede ocurrir con glucosa no muy alta.' },
      { icono: 'ShieldCheck', termino: 'Días de enfermedad', definicion: 'Suspender en cirugía, vómito, diarrea o ayuno.' },
    ],
    mapa: {
      centro: 'iSGLT2 en IC',
      ramas: [
        { titulo: 'Mecanismo', icono: 'Droplets', nodos: ['Glucosuria', 'Menos congestión', 'Hemodinámica'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Dapagliflozina', 'Empagliflozina'] },
        { titulo: 'Beneficio', icono: 'Activity', nodos: ['Hospitalizaciones', 'Mortalidad', 'Calidad'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Infecciones', 'Volumen', 'Cetoacidosis'] },
      ],
    },
    secciones: [
      {
        titulo: 'Beneficio y uso',
        parrafos: [
          'Los iSGLT2 reducen hospitalizaciones por insuficiencia cardíaca y muerte cardiovascular en pacientes con FEVI reducida, levemente reducida y preservada. El beneficio es independiente de la diabetes. Se inician con dosis baja y se mantienen si la función renal lo permite.',
          'La dapagliflozina y la empagliflozina son las más usadas. La elección depende de la cobertura y la indicación.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Pueden causar infecciones genitales, depleción de volumen y cetoacidosis euglucémica. Se suspenden en cirugía, enfermedad aguda o ayuno prolongado. Se revisan diuréticos y presión.',
          'La educación incluye hidratación, higiene y signos de alarma.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe saber que el fármaco protege el corazón aunque no tenga diabetes. Se explican los efectos adversos y las reglas de suspensión.',
          'El QF puede revisar la adherencia y la función renal.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo iniciar un iSGLT2 en IC',
      pasos: [
        { titulo: 'Confirmar', detalle: 'IC y TFG adecuada.', icono: 'Target', evidencia: 'Indicación.' },
        { titulo: 'Revisar', detalle: 'Volumen, diuréticos y presión.', icono: 'Droplets', evidencia: 'Evaluación.' },
        { titulo: 'Iniciar', detalle: 'Dosis estándar.', icono: 'Pill', evidencia: 'Dosis.' },
        { titulo: 'Educar', detalle: 'Infecciones y días de enfermedad.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'TFG, presión y síntomas.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'IC sin diabetes',
      contexto: 'Paciente con IC y sin diabetes pregunta por qué recibe dapagliflozina.',
      pregunta: '¿Qué explicar?',
      opciones: [
        { texto: 'Que es solo para diabetes.', correcta: false, retro: 'El beneficio es cardíaco e independiente de la glucosa.' },
        { texto: 'Que reduce hospitalizaciones y muerte cardiovascular en IC.', correcta: true, retro: 'Ese es el fundamento.' },
        { texto: 'Que no sirve.', correcta: false, retro: 'Tiene evidencia.' },
      ],
    },
    errores: [
      { error: 'Suspender por infección leve sin consultar.', correccion: 'Se trata y se evalúa.' },
      { error: 'No educar sobre cetoacidosis.', correccion: 'Es rara pero grave.' },
      { error: 'No revisar volumen.', correccion: 'Puede causar hipotensión.' },
    ],
    comprueba: [
      { pregunta: '¿Qué beneficio tienen en IC?', respuesta: 'Menos hospitalizaciones y muerte cardiovascular.' },
      { pregunta: '¿Depende de la diabetes?', respuesta: 'No.' },
      { pregunta: '¿Cuándo se suspenden?', respuesta: 'En cirugía, enfermedad aguda o ayuno.' },
    ],
    resumen: [
      'Los iSGLT2 son un pilar en IC.',
      'El beneficio no depende de la glucosa.',
      'Vigilar volumen e infecciones.',
      'Reglas de días de enfermedad.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Dapagliflozina Aurovitas 10 mg comprimidos recubiertos con película EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/89963/FT_89963.html' },
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de beneficio', descripcion: 'Corazón y riñón con un iSGLT2 y una flecha de reducción de hospitalizaciones.', alt: 'iSGLT2 en insuficiencia cardíaca' },
    ],
    keywords: ['dapagliflozina insuficiencia cardíaca', 'empagliflozina IC', 'iSGLT2 insuficiencia cardíaca', 'cetoacidosis iSGLT2'],
  },
  {
    titulo: 'Caso: hombre de 58 años en Medellín con FEVI reducida de novo — plan de inicio de la terapia fundamental',
    duracion: 25,
    gancho: {
      titulo: 'El primer plan después del diagnóstico',
      texto: 'Un hombre de 58 años en Medellín recibe por primera vez el diagnóstico de IC con FEVI de 27 %. Está estable, sin congestión grave, con presión 124/78, TFG 62 y potasio 4,2. El plan debe iniciar los cuatro pilares de forma segura, educar y programar el seguimiento. La secuencia se adapta a la presión, la función renal, el potasio y el acceso, sin retrasar la terapia. La educación y el seguimiento cercano permiten ajustar el plan. El paciente debe conocer los signos de alarma y la importancia de la adherencia. La revisión de laboratorio y la titulación progresiva permiten mantener el beneficio con seguridad. La educación debe adaptarse al nivel de comprensión del paciente y de su cuidador, y revisar la adherencia y el acceso antes de intensificar.',
    },
    objetivos: [
      'Diseñar un plan de inicio de los cuatro pilares.',
      'Aplicar criterios de secuencia y titulación.',
      'Prever barreras y controles.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Cuatro pilares', definicion: 'ARNI/IECA, beta, ARM e iSGLT2.' },
      { icono: 'Target', termino: 'Secuencia', definicion: 'Inicio simultáneo o escalonado según tolerancia.' },
      { icono: 'LineChart', termino: 'Control', definicion: 'Presión, potasio, TFG y síntomas.' },
      { icono: 'Users', termino: 'Educación', definicion: 'Peso, sal, adherencia y signos de alarma.' },
    ],
    mapa: {
      centro: 'FEVI reducida de novo',
      ramas: [
        { titulo: 'Pilares', icono: 'Pill', nodos: ['ARNI', 'Beta', 'ARM', 'iSGLT2'] },
        { titulo: 'Secuencia', icono: 'Route', nodos: ['Simultánea', 'Escalonada', 'Tolerancia'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Presión', 'Potasio', 'TFG'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['Peso', 'Sal', 'Alarma'] },
      ],
    },
    secciones: [
      {
        titulo: 'Plan inicial',
        parrafos: [
          'El paciente está estable y tiene presión y función renal adecuadas. Se puede iniciar ARNI o IECA/ARA-II, betabloqueador, ARM e iSGLT2 en dosis bajas. La secuencia puede ser simultánea o escalonada según la tolerancia y el acceso.',
          'Se revisan potasio, TFG y presión antes y después. Se educa sobre el beneficio y los efectos adversos.',
        ],
      },
      {
        titulo: 'Titulación',
        parrafos: [
          'La titulación se hace cada dos a cuatro semanas. Se ajustan diuréticos si hay congestión o hipotensión. La meta es alcanzar dosis toleradas de los pilares.',
          'La FEVI se reevalúa y el tratamiento se mantiene aunque mejore.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisan síntomas, peso, presión, potasio y TFG. La adherencia y la educación son clave. El QF documenta y coordina.',
          'Las barreras se resuelven antes de abandonar un fármaco.',
        ],
      },
    ],
    proceso: {
      titulo: 'Plan de inicio',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Presión, TFG, potasio y congestión.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Iniciar', detalle: 'Pilares en dosis bajas.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Titular', detalle: 'Cada 2-4 semanas.', icono: 'RefreshCw', evidencia: 'Esquema.' },
        { titulo: 'Educar', detalle: 'Peso, sal y alarma.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Potasio, TFG y síntomas.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'FEVI 27 estable',
      contexto: 'Hombre de 58 años, FEVI 27 %, presión 124/78, TFG 62, potasio 4,2, sin congestión grave.',
      pregunta: '¿Qué plan es más adecuado?',
      opciones: [
        { texto: 'Solo furosemida.', correcta: false, retro: 'No cambia el pronóstico.' },
        { texto: 'Iniciar los cuatro pilares en dosis bajas y titular.', correcta: true, retro: 'Es el estándar en FEVI reducida.' },
        { texto: 'Esperar seis meses.', correcta: false, retro: 'La terapia debe iniciarse pronto.' },
      ],
    },
    errores: [
      { error: 'Iniciar un solo pilar.', correccion: 'Los cuatro son el estándar.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo con ARM y SRAA.' },
      { error: 'No educar.', correccion: 'La adherencia es clave.' },
    ],
    comprueba: [
      { pregunta: '¿Qué pilares se inician?', respuesta: 'ARNI/IECA, beta, ARM e iSGLT2.' },
      { pregunta: '¿Cómo se titula?', respuesta: 'Cada 2-4 semanas.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Presión, potasio, TFG y síntomas.' },
    ],
    resumen: [
      'La FEVI reducida requiere cuatro pilares.',
      'El inicio puede ser escalonado.',
      'La titulación es segura con control.',
      'La educación sostiene el plan.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Entresto 24 mg/26 mg comprimidos recubiertos con película.', url: 'https://cima.aemps.es/cima/dochtml/ft/1151058001/FT_1151058001.html' },
    ],
    imagenes: [
      { ubicacion: 'Sección del caso', descripcion: 'Paciente de Medellín con FEVI 27 y un plan de cuatro pilares.', alt: 'Caso de FEVI reducida de novo' },
    ],
    keywords: ['FEVI reducida de novo', 'plan de tratamiento IC', 'cuatro pilares IC', 'caso insuficiencia cardíaca'],
  },
  {
    titulo: 'Introducción a la unidad: de la fórmula a la dosis óptima, implementación segura de la terapia fundamental',
    duracion: 20,
    gancho: {
      titulo: 'La fórmula no es el final',
      texto: 'Iniciar los fármacos es solo el comienzo. La mayoría de los pacientes no alcanza la dosis objetivo por falta de titulación, miedo a los efectos adversos o barreras de acceso. La implementación segura es tan importante como la elección. La titulación sistemática y la revisión de barreras permiten que los pacientes alcancen el beneficio completo. La medición de indicadores ayuda a mejorar la implementación. La revisión periódica de dosis y adherencia es parte del proceso. La educación del paciente y la coordinación con el equipo sostienen la implementación. La revisión de indicadores debe incluir el porcentaje de pacientes con los cuatro pilares, la proporción con dosis objetivo y los eventos adversos. Esa información permite detectar brechas y mejorar el proceso de forma continua.',
    },
    objetivos: [
      'Reconocer la brecha entre la fórmula y la dosis óptima.',
      'Aplicar un plan de titulación.',
      'Identificar barreras y soluciones.',
      'Medir la implementación.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'Dosis objetivo', definicion: 'Dosis tolerada con beneficio demostrado.' },
      { icono: 'RefreshCw', termino: 'Titulación', definicion: 'Aumento gradual con control.' },
      { icono: 'AlertTriangle', termino: 'Barrera', definicion: 'Hipotensión, bradicardia, potasio, costo.' },
      { icono: 'LineChart', termino: 'Implementación', definicion: 'Porcentaje de pacientes con pilares y dosis adecuadas.' },
    ],
    mapa: {
      centro: 'De la fórmula a la dosis',
      ramas: [
        { titulo: 'Iniciar', icono: 'Pill', nodos: ['Dosis baja', 'Pilares', 'Educación'] },
        { titulo: 'Titular', icono: 'RefreshCw', nodos: ['2-4 semanas', 'Tolerancia', 'Metas'] },
        { titulo: 'Barreras', icono: 'AlertTriangle', nodos: ['Presión', 'Frecuencia', 'Potasio'] },
        { titulo: 'Medir', icono: 'LineChart', nodos: ['Dosis', 'Adherencia', 'Eventos'] },
      ],
    },
    secciones: [
      {
        titulo: 'La brecha',
        parrafos: [
          'Muchos pacientes reciben dosis bajas de los pilares durante años. La falta de titulación se asocia con más hospitalizaciones y mortalidad. Las causas incluyen inercia, miedo a los efectos adversos, falta de seguimiento y acceso.',
          'El QF puede detectar la brecha y proponer un plan. La titulación debe ser sistemática.',
        ],
      },
      {
        titulo: 'Implementación',
        parrafos: [
          'El plan incluye controles de presión, frecuencia, potasio y función renal, y ajustes cada dos a cuatro semanas. Las barreras se manejan antes de abandonar el fármaco. La educación y la adherencia son parte del proceso.',
          'La meta es alcanzar dosis toleradas, no solo iniciar.',
        ],
      },
      {
        titulo: 'Medición',
        parrafos: [
          'Los indicadores incluyen porcentaje de pacientes con los cuatro pilares, dosis objetivo, adherencia y eventos. La medición permite mejorar.',
          'El QF puede liderar la revisión y la educación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Plan de implementación',
      pasos: [
        { titulo: 'Revisar', detalle: 'Pilares y dosis actuales.', icono: 'Search', evidencia: 'Ficha.' },
        { titulo: 'Titular', detalle: 'Aumento gradual.', icono: 'RefreshCw', evidencia: 'Esquema.' },
        { titulo: 'Controlar', detalle: 'Presión, potasio y TFG.', icono: 'LineChart', evidencia: 'Resultados.' },
        { titulo: 'Resolver', detalle: 'Barreras y acceso.', icono: 'Lightbulb', evidencia: 'Intervención.' },
        { titulo: 'Medir', detalle: 'Dosis y eventos.', icono: 'CalendarClock', evidencia: 'Informe.' },
      ],
    },
    caso: {
      titulo: 'Dosis baja durante un año',
      contexto: 'Paciente con los cuatro pilares, pero todos en dosis mínima desde hace un año.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Dejar igual.', correcta: false, retro: 'La dosis baja no alcanza el beneficio completo.' },
        { texto: 'Titular con control y resolver barreras.', correcta: true, retro: 'La titulación es parte del tratamiento.' },
        { texto: 'Suspender uno.', correcta: false, retro: 'No es necesario.' },
      ],
    },
    errores: [
      { error: 'Quedarse en dosis baja.', correccion: 'Titular.' },
      { error: 'Abandonar por una barrera manejable.', correccion: 'Ajustar.' },
      { error: 'No medir implementación.', correccion: 'Los indicadores mejoran.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es dosis objetivo?', respuesta: 'Dosis tolerada con beneficio.' },
      { pregunta: '¿Cada cuánto se titula?', respuesta: 'Cada 2-4 semanas.' },
      { pregunta: '¿Qué se mide?', respuesta: 'Pilares, dosis, adherencia y eventos.' },
    ],
    resumen: [
      'Iniciar no es suficiente.',
      'La titulación es clave.',
      'Las barreras se manejan.',
      'La medición mejora la calidad.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de implementación', descripcion: 'Escalera de dosis desde inicio hasta objetivo.', alt: 'Implementación de la terapia fundamental en IC' },
    ],
    keywords: ['titulación insuficiencia cardíaca', 'dosis objetivo IC', 'implementación terapia IC'],
  },
  {
    titulo: 'Secuenciación y titulación de la terapia fundamental: inicio simultáneo o escalonado y metas de dosis',
    duracion: 25,
    gancho: {
      titulo: 'Iniciar todos o uno por uno',
      texto: 'Las guías permiten iniciar los cuatro pilares de forma simultánea o escalonada. La elección depende de la presión, la función renal, el potasio, la tolerancia y el acceso. No hay una única secuencia correcta, pero sí un objetivo: llegar a dosis toleradas. La revisión periódica y el ajuste de barreras permiten avanzar sin perder seguridad. La meta final es la dosis tolerada de cada pilar. La revisión de síntomas y la educación sostienen el plan. La titulación se ajusta a la tolerancia y a las metas de dosis. La secuencia debe revisarse en cada control. Si la presión o la frecuencia limitan un pilar, se ajustan primero los diuréticos y los horarios. La suspensión se reserva para la intolerancia verdadera y se documenta. La revisión periódica de la secuencia es clave. La titulación debe individualizarse.',
    },
    objetivos: [
      'Comparar inicio simultáneo y escalonado.',
      'Aplicar metas de dosis.',
      'Reconocer barreras y ajustes.',
      'Diseñar un plan de titulación.',
    ],
    conceptos: [
      { icono: 'Route', termino: 'Secuencia', definicion: 'Orden de inicio de los pilares.' },
      { icono: 'Target', termino: 'Meta', definicion: 'Dosis tolerada de cada fármaco.' },
      { icono: 'RefreshCw', termino: 'Titulación', definicion: 'Aumento gradual con control.' },
      { icono: 'AlertTriangle', termino: 'Barrera', definicion: 'Hipotensión, bradicardia, potasio o TFG.' },
    ],
    mapa: {
      centro: 'Secuenciación',
      ramas: [
        { titulo: 'Simultánea', icono: 'Layers', nodos: ['Rápida', 'Control estrecho', 'Tolerancia'] },
        { titulo: 'Escalonada', icono: 'Route', nodos: ['Una a la vez', 'Seguridad', 'Acceso'] },
        { titulo: 'Metas', icono: 'Target', nodos: ['Dosis objetivo', 'Tolerancia', 'Adherencia'] },
        { titulo: 'Barreras', icono: 'AlertTriangle', nodos: ['Presión', 'Frecuencia', 'Potasio'] },
      ],
    },
    secciones: [
      {
        titulo: 'Simultáneo o escalonado',
        parrafos: [
          'El inicio simultáneo de dosis bajas de los cuatro pilares puede ser eficaz y rápido en pacientes estables, con control estrecho. El escalonado permite evaluar la tolerancia de cada fármaco y es útil si hay hipotensión, bradicardia o hiperpotasemia.',
          'La elección depende del contexto. Lo importante es no retrasar la terapia y titular hasta la dosis tolerada.',
        ],
      },
      {
        titulo: 'Metas y ajustes',
        parrafos: [
          'La meta es la dosis objetivo tolerada. Si no se alcanza, se ajustan diuréticos, horarios y otros fármacos. La hipotensión, la bradicardia y la hiperpotasemia se manejan antes de abandonar un pilar.',
          'La revisión cada dos a cuatro semanas permite avanzar.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe entender el plan y los ajustes. La adherencia y los síntomas se revisan en cada contacto.',
          'El QF documenta y coordina.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo secuenciar',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Presión, TFG y potasio.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Elegir', detalle: 'Simultáneo o escalonado.', icono: 'Route', evidencia: 'Plan.' },
        { titulo: 'Titular', detalle: 'Cada 2-4 semanas.', icono: 'RefreshCw', evidencia: 'Esquema.' },
        { titulo: 'Ajustar', detalle: 'Barreras y diuréticos.', icono: 'Lightbulb', evidencia: 'Intervención.' },
        { titulo: 'Seguir', detalle: 'Dosis y síntomas.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Presión 102/64',
      contexto: 'Paciente estable con presión 102/64 y cuatro pilares en dosis bajas.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Aumentar todos al mismo tiempo.', correcta: false, retro: 'Puede causar hipotensión.' },
        { texto: 'Titular de forma escalonada y ajustar diuréticos.', correcta: true, retro: 'La seguridad guía la secuencia.' },
        { texto: 'Suspender todos.', correcta: false, retro: 'Se ajusta, no se abandona.' },
      ],
    },
    errores: [
      { error: 'No titular.', correccion: 'La dosis baja no basta.' },
      { error: 'Aumentar todo con hipotensión.', correccion: 'Ajustar primero.' },
      { error: 'Abandonar por una barrera.', correccion: 'Manejar la barrera.' },
    ],
    comprueba: [
      { pregunta: '¿Se puede iniciar todo junto?', respuesta: 'Sí, en pacientes estables con control.' },
      { pregunta: '¿Cuál es la meta?', respuesta: 'Dosis objetivo tolerada.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Presión, frecuencia, potasio y TFG.' },
    ],
    resumen: [
      'La secuencia se adapta al paciente.',
      'La meta es la dosis tolerada.',
      'Las barreras se manejan.',
      'La revisión es periódica.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de secuencia', descripcion: 'Dos caminos: inicio simultáneo y escalonado, con la misma meta.', alt: 'Secuenciación de la terapia fundamental en IC' },
    ],
    keywords: ['secuenciación terapia IC', 'titulación IC', 'inicio simultáneo IC', 'dosis objetivo IC'],
  },
  {
    titulo: 'Hipotensión, bradicardia, fatiga y otras barreras de la titulación: qué ajustar primero',
    duracion: 20,
    gancho: {
      titulo: 'La barrera que no siempre obliga a suspender',
      texto: 'Un paciente con los cuatro pilares presenta presión 96/60, frecuencia 54 y fatiga. La reacción inicial es suspender todo, pero muchas veces basta con ajustar el diurético, el horario o la dosis de un fármaco. Conocer el orden de ajuste evita perder el beneficio. La evaluación de síntomas y la revisión de diuréticos, horarios y dosis permiten mantener la terapia con seguridad. La comunicación con el equipo es clave para ajustar sin perder el beneficio. La educación sobre mareo, fatiga y adherencia completa el plan. El paciente debe saber qué síntomas reportar y cómo medir la presión en casa. La revisión de la presión ortostática y de los horarios ayuda a distinguir la hipotensión sintomática de la asintomática.',
    },
    objetivos: [
      'Identificar las barreras de la titulación.',
      'Aplicar un orden de ajuste.',
      'Distinguir hipotensión sintomática de asintomática.',
      'Mantener el beneficio sin causar daño.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'Hipotensión', definicion: 'Presión baja con o sin síntomas; se evalúa en contexto.' },
      { icono: 'Activity', termino: 'Bradicardia', definicion: 'Frecuencia baja; límite para betabloqueador.' },
      { icono: 'Users', termino: 'Fatiga', definicion: 'Síntoma que puede mejorar o empeorar con la titulación.' },
      { icono: 'RefreshCw', termino: 'Orden', definicion: 'Ajustar diurético, horarios y dosis antes de suspender.' },
    ],
    mapa: {
      centro: 'Barreras de titulación',
      ramas: [
        { titulo: 'Presión', icono: 'Gauge', nodos: ['Síntomas', 'Diurético', 'Horario'] },
        { titulo: 'Frecuencia', icono: 'Activity', nodos: ['Bradicardia', 'Beta', 'Ajuste'] },
        { titulo: 'Fatiga', icono: 'Users', nodos: ['Evaluar', 'Causas', 'Mantener'] },
        { titulo: 'Decisión', icono: 'RefreshCw', nodos: ['Ajustar', 'Titular', 'Suspender'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluar',
        parrafos: [
          'La hipotensión asintomática puede tolerarse; la sintomática requiere ajuste. La bradicardia sintomática limita el betabloqueador. La fatiga puede ser multifactorial. Se revisan diuréticos, horarios, comorbilidades y medicamentos.',
          'El orden de ajuste suele empezar por el diurético y los horarios, luego la dosis del fármaco implicado, y solo después la suspensión.',
        ],
      },
      {
        titulo: 'Ajustar',
        parrafos: [
          'Reducir el diurético si hay hipovolemia, cambiar el horario del beta si causa sueño o fatiga, revisar interacciones. La titulación puede hacerse más lenta. La suspensión se reserva para intolerancia verdadera.',
          'La meta es mantener el beneficio con la dosis tolerada.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe reportar mareo, síncope, frecuencia baja o fatiga. La automedida de presión ayuda. La adherencia se revisa.',
          'El QF documenta y coordina.',
        ],
      },
    ],
    proceso: {
      titulo: 'Orden de ajuste',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Síntomas y presión.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Diurético', detalle: 'Reducir si hipovolemia.', icono: 'Droplets', evidencia: 'Ajuste.' },
        { titulo: 'Horario', detalle: 'Beta y otros.', icono: 'CalendarClock', evidencia: 'Cambio.' },
        { titulo: 'Dosis', detalle: 'Titulación más lenta.', icono: 'RefreshCw', evidencia: 'Esquema.' },
        { titulo: 'Seguir', detalle: 'Síntomas y adherencia.', icono: 'Users', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Presión 96/60 y fatiga',
      contexto: 'Paciente con cuatro pilares, presión 96/60, frecuencia 58 y fatiga.',
      pregunta: '¿Qué hacer primero?',
      opciones: [
        { texto: 'Suspender todos.', correcta: false, retro: 'Se puede ajustar.' },
        { texto: 'Evaluar síntomas, reducir diurético y ajustar horarios/dosis.', correcta: true, retro: 'El ajuste preserva el beneficio.' },
        { texto: 'Aumentar todo.', correcta: false, retro: 'Empeora.' },
      ],
    },
    errores: [
      { error: 'Suspender por hipotensión asintomática.', correccion: 'Evaluar contexto.' },
      { error: 'No revisar diurético.', correccion: 'Puede ser la causa.' },
      { error: 'No educar.', correccion: 'El paciente debe reportar síntomas.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se ajusta primero?', respuesta: 'Diurético y horarios, luego dosis.' },
      { pregunta: '¿Cuándo suspender?', respuesta: 'En intolerancia verdadera.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Presión, frecuencia y síntomas.' },
    ],
    resumen: [
      'No toda barrera obliga a suspender.',
      'El diurético y los horarios se revisan.',
      'La titulación puede ser más lenta.',
      'La educación es clave.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de ajuste', descripcion: 'Árbol de decisión para hipotensión, bradicardia y fatiga.', alt: 'Barreras de titulación en insuficiencia cardíaca' },
    ],
    keywords: ['hipotensión insuficiencia cardíaca', 'bradicardia IC', 'fatiga IC', 'titulación IC'],
  },
  {
    titulo: 'Diuréticos de asa en IC: furosemida, torasemida y bumetanida — dosis, equivalencias y autoajuste',
    duracion: 25,
    gancho: {
      titulo: 'El diurético que se queda corto',
      texto: 'Un paciente con congestión toma furosemida 40 mg al día y sigue con edema. La dosis es insuficiente o la absorción está comprometida. Los diuréticos de asa son la base del alivio de la congestión, pero requieren dosis, equivalencias y ajuste según la respuesta. La educación sobre peso y síntomas es parte del tratamiento. La revisión de potasio y función renal evita complicaciones. La educación sobre peso y síntomas es parte del plan. La revisión de la respuesta y de los electrolitos permite ajustar la dosis. El paciente debe registrar el peso y los síntomas para detectar congestión o deshidratación. La dosis se ajusta con un plan acordado y límites claros, y se revisa el potasio y la función renal.',
    },
    objetivos: [
      'Diferenciar furosemida, torasemida y bumetanida.',
      'Aplicar dosis y equivalencias.',
      'Ajustar según congestión y función renal.',
      'Educar sobre autoajuste.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Asa', definicion: 'Segmento de Henle donde actúan los diuréticos más potentes.' },
      { icono: 'Pill', termino: 'Furosemida', definicion: 'Diurético de asa de acción corta.' },
      { icono: 'Pill', termino: 'Torasemida', definicion: 'Diurético de asa de acción más prolongada y mayor biodisponibilidad.' },
      { icono: 'AlertTriangle', termino: 'Congestión', definicion: 'Síntomas y signos de sobrecarga que guían el ajuste.' },
    ],
    mapa: {
      centro: 'Diuréticos de asa',
      ramas: [
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Furosemida', 'Torasemida', 'Bumetanida'] },
        { titulo: 'Dosis', icono: 'Target', nodos: ['Oral', 'IV', 'Equivalencias'] },
        { titulo: 'Ajuste', icono: 'RefreshCw', nodos: ['Peso', 'Síntomas', 'TFG'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Hipopotasemia', 'Volumen', 'Renal'] },
      ],
    },
    secciones: [
      {
        titulo: 'Fármacos y equivalencias',
        parrafos: [
          'La furosemida es el diurético de asa más usado. La torasemida tiene mayor biodisponibilidad y duración; la bumetanida es más potente por miligramo. Las equivalencias aproximadas ayudan en el cambio, pero la respuesta individual varía.',
          'La vía oral es preferible si hay absorción adecuada. En congestión grave o resistencia, se usa la vía intravenosa.',
        ],
      },
      {
        titulo: 'Ajuste',
        parrafos: [
          'La dosis se ajusta según peso, síntomas, diuresis y función renal. La automedida de peso ayuda a detectar retención. El paciente puede ajustar según un plan acordado, con límites.',
          'La hipopotasemia, la hipotensión y el deterioro renal requieren control.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe saber cuándo aumentar o reducir y cuándo consultar. La sal y el peso diario son parte del autocuidado.',
          'El QF puede revisar la técnica y la adherencia.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo ajustar un diurético',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Peso, edema y disnea.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Revisar', detalle: 'Dosis, vía y función renal.', icono: 'Pill', evidencia: 'Lista.' },
        { titulo: 'Ajustar', detalle: 'Según respuesta.', icono: 'RefreshCw', evidencia: 'Cambio.' },
        { titulo: 'Controlar', detalle: 'Potasio, presión y TFG.', icono: 'LineChart', evidencia: 'Resultados.' },
        { titulo: 'Educar', detalle: 'Peso y signos de alarma.', icono: 'Users', evidencia: 'Educación.' },
      ],
    },
    caso: {
      titulo: 'Edema persistente',
      contexto: 'Paciente con furosemida 40 mg, edema y peso aumentado.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Mantener la dosis.', correcta: false, retro: 'La congestión persiste.' },
        { texto: 'Revisar dosis, adherencia y función renal, y ajustar.', correcta: true, retro: 'La respuesta guía el ajuste.' },
        { texto: 'Suspender el diurético.', correcta: false, retro: 'Empeora la congestión.' },
      ],
    },
    errores: [
      { error: 'No revisar peso.', correccion: 'Es clave para el ajuste.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo de hipopotasemia.' },
      { error: 'Cambiar de fármaco sin equivalencia.', correccion: 'Revisar dosis.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es el más usado?', respuesta: 'Furosemida.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Peso, potasio, presión y TFG.' },
      { pregunta: '¿Cuándo usar IV?', respuesta: 'En congestión grave o resistencia.' },
    ],
    resumen: [
      'Los diuréticos de asa alivian la congestión.',
      'La dosis se ajusta según respuesta.',
      'Controlar potasio y función renal.',
      'Educar sobre peso y autoajuste.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Furosemida Cinfa 40 mg comprimidos EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/22974/FT_22974.html' },
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de ajuste', descripcion: 'Paciente con edema, peso y diurético, con un plan de ajuste.', alt: 'Diuréticos de asa en insuficiencia cardíaca' },
    ],
    keywords: ['furosemida insuficiencia cardíaca', 'torasemida IC', 'bumetanida IC', 'diurético de asa'],
  },
  {
    titulo: 'Resistencia diurética: evaluación con sodio urinario y bloqueo secuencial de la nefrona',
    duracion: 25,
    gancho: {
      titulo: 'La congestión que no responde',
      texto: 'Un paciente con IC recibe dosis altas de furosemida y sigue congestionado. La resistencia diurética puede deberse a baja absorción, adaptación de la nefrona o función renal. El sodio urinario y el bloqueo secuencial ayudan a evaluar y tratar. La revisión de adherencia, absorción y función renal evita atribuir todo a la dosis. La comunicación con el equipo permite ajustar el plan. La revisión de electrolitos y función renal es parte del seguimiento. La comunicación con el equipo permite ajustar el plan. La resistencia verdadera requiere confirmar la adherencia, revisar la absorción y evaluar la función renal. El bloqueo secuencial se hace con control de electrolitos y seguimiento estrecho, y se deriva si no hay respuesta.',
    },
    objetivos: [
      'Reconocer la resistencia diurética.',
      'Interpretar el sodio urinario.',
      'Aplicar bloqueo secuencial.',
      'Evitar complicaciones.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Resistencia', definicion: 'Respuesta diurética insuficiente a dosis adecuadas.' },
      { icono: 'TestTube', termino: 'Sodio urinario', definicion: 'Ayuda a evaluar la respuesta y la adherencia.' },
      { icono: 'Layers', termino: 'Bloqueo secuencial', definicion: 'Combinar diuréticos en distintos segmentos de la nefrona.' },
      { icono: 'AlertTriangle', termino: 'Complicación', definicion: 'Hipopotasemia, hiponatremia, deterioro renal.' },
    ],
    mapa: {
      centro: 'Resistencia diurética',
      ramas: [
        { titulo: 'Causas', icono: 'Search', nodos: ['Adherencia', 'Absorción', 'Renal'] },
        { titulo: 'Evaluación', icono: 'TestTube', nodos: ['Sodio urinario', 'Diuresis', 'Peso'] },
        { titulo: 'Tratamiento', icono: 'Layers', nodos: ['Dosis', 'Tiazida', 'ARM'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Potasio', 'Sodio', 'TFG'] },
      ],
    },
    secciones: [
      {
        titulo: 'Causas y evaluación',
        parrafos: [
          'La resistencia puede deberse a falta de adherencia, mala absorción, dosis insuficiente, adaptación de la nefrona o deterioro renal. El sodio urinario y la diuresis ayudan a distinguir. Se revisa el peso y la congestión.',
          'La respuesta se evalúa después de una dosis y durante 24 horas.',
        ],
      },
      {
        titulo: 'Bloqueo secuencial',
        parrafos: [
          'La combinación de un diurético de asa con una tiazida o un ARM puede superar la adaptación distal. La dosis se ajusta con control de electrolitos y función renal. La vía intravenosa se usa si la absorción es insuficiente.',
          'La resistencia verdadera requiere evaluación especializada y tratamiento de la causa.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe seguir el plan, controlar el peso y reportar síntomas. La adherencia es parte de la evaluación.',
          'El QF puede revisar la técnica y los horarios.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo evaluar la resistencia',
      pasos: [
        { titulo: 'Revisar', detalle: 'Adherencia y dosis.', icono: 'Search', evidencia: 'Entrevista.' },
        { titulo: 'Medir', detalle: 'Sodio urinario y diuresis.', icono: 'TestTube', evidencia: 'Resultados.' },
        { titulo: 'Combinar', detalle: 'Bloqueo secuencial.', icono: 'Layers', evidencia: 'Plan.' },
        { titulo: 'Controlar', detalle: 'Electrolitos y TFG.', icono: 'LineChart', evidencia: 'Control.' },
        { titulo: 'Derivar', detalle: 'Si no responde.', icono: 'Route', evidencia: 'Remisión.' },
      ],
    },
    caso: {
      titulo: 'Furosemida alta sin respuesta',
      contexto: 'Paciente con furosemida 160 mg, edema persistente y sodio urinario bajo.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Aumentar solo la dosis.', correcta: false, retro: 'Puede no ser suficiente.' },
        { texto: 'Evaluar adherencia, absorción y combinar diuréticos con control.', correcta: true, retro: 'El bloqueo secuencial puede ayudar.' },
        { texto: 'Suspender todo.', correcta: false, retro: 'La congestión empeora.' },
      ],
    },
    errores: [
      { error: 'No revisar adherencia.', correccion: 'Es una causa frecuente.' },
      { error: 'Combinar sin control de electrolitos.', correccion: 'Riesgo de alteraciones.' },
      { error: 'No evaluar la absorción.', correccion: 'La vía IV puede ser necesaria.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es resistencia diurética?', respuesta: 'Respuesta insuficiente a dosis adecuadas.' },
      { pregunta: '¿Qué ayuda a evaluar?', respuesta: 'Sodio urinario y diuresis.' },
      { pregunta: '¿Qué es bloqueo secuencial?', respuesta: 'Combinar diuréticos en distintos segmentos.' },
    ],
    resumen: [
      'La resistencia tiene causas.',
      'El sodio urinario ayuda.',
      'El bloqueo secuencial puede mejorar.',
      'Controlar electrolitos.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Furosemida Cinfa 40 mg comprimidos EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/22974/FT_22974.html' },
    ],
    imagenes: [
      { ubicacion: 'Sección de bloqueo', descripcion: 'Nefrona con puntos de acción de asa, tiazida y ARM.', alt: 'Resistencia diurética y bloqueo secuencial' },
    ],
    keywords: ['resistencia diurética', 'sodio urinario IC', 'bloqueo secuencial nefrona', 'furosemida resistencia'],
  },
  {
    titulo: 'Hiperpotasemia en IC: umbrales de acción, ajuste de ARM y ARNI/IECA, y quelantes de potasio',
    duracion: 25,
    gancho: {
      titulo: 'El potasio que limita la titulación',
      texto: 'Un paciente con IC, ARNI, espironolactona y ERC llega con potasio de 5,7 mEq/L. La hiperpotasemia es una barrera frecuente para la titulación. Ajustar no siempre significa suspender: se puede reducir el ARM, revisar la dieta y usar quelantes. La prevención y el control del potasio permiten mantener la terapia fundamental. La educación sobre dieta y suplementos es parte del manejo. La revisión periódica de potasio y función renal evita recurrencias. La educación sobre dieta y suplementos es parte del manejo. El control debe repetirse después de cada ajuste. Los quelantes pueden ayudar a mantener el bloqueo del SRAA, pero no sustituyen la revisión de la causa ni la educación sobre alimentos ricos en potasio. La educación es clave. El seguimiento es clave.',
    },
    objetivos: [
      'Aplicar umbrales de acción para la hiperpotasemia.',
      'Ajustar ARM y bloqueo del SRAA.',
      'Reconocer el papel de los quelantes.',
      'Prevenir recurrencias.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Hiperpotasemia', definicion: 'Potasio elevado; riesgo de arritmias.' },
      { icono: 'AlertTriangle', termino: 'Umbral', definicion: 'Nivel a partir del cual se ajusta o suspende.' },
      { icono: 'Pill', termino: 'Quelante', definicion: 'Fármaco que reduce el potasio intestinal.' },
      { icono: 'ShieldCheck', termino: 'Prevención', definicion: 'Dieta, revisión de fármacos y control.' },
    ],
    mapa: {
      centro: 'Hiperpotasemia en IC',
      ramas: [
        { titulo: 'Umbrales', icono: 'AlertTriangle', nodos: ['5,0', '5,5', '6,0'] },
        { titulo: 'Ajuste', icono: 'Pill', nodos: ['ARM', 'ARNI', 'IECA'] },
        { titulo: 'Quelantes', icono: 'Droplets', nodos: ['Patiromer', 'Ciclosilicato'] },
        { titulo: 'Prevención', icono: 'ShieldCheck', nodos: ['Dieta', 'Fármacos', 'Control'] },
      ],
    },
    secciones: [
      {
        titulo: 'Umbrales y ajuste',
        parrafos: [
          'La hiperpotasemia leve puede manejarse con dieta y revisión de fármacos. Valores más altos requieren reducción o suspensión del ARM y del bloqueo del SRAA, y evaluación urgente si hay síntomas o cambios en el ECG. No se debe suspender todo sin evaluar.',
          'Se revisan suplementos, sal de reemplazo, AINE y función renal. El potasio se controla después de cada ajuste.',
        ],
      },
      {
        titulo: 'Quelantes',
               parrafos: [
          'Los quelantes de potasio permiten mantener el bloqueo del SRAA en algunos pacientes. Se usan con control y educación. No sustituyen la evaluación de la causa.',
          'La dieta y la hidratación son parte del manejo.',
        ],
      },
      {
        titulo: 'Prevención',
        parrafos: [
          'La prevención incluye revisar la medicación, controlar la función renal y educar sobre alimentos ricos en potasio. La comunicación con el equipo es clave.',
          'El QF puede detectar la hiperpotasemia en la dispensación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo manejar la hiperpotasemia',
      pasos: [
        { titulo: 'Medir', detalle: 'Potasio y ECG si es alto.', icono: 'TestTube', evidencia: 'Resultado.' },
        { titulo: 'Evaluar', detalle: 'Síntomas y causas.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Ajustar', detalle: 'ARM y SRAA.', icono: 'Pill', evidencia: 'Cambio.' },
        { titulo: 'Quelante', detalle: 'Si está indicado.', icono: 'Droplets', evidencia: 'Plan.' },
        { titulo: 'Seguir', detalle: 'Potasio y función renal.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Potasio 5,7',
      contexto: 'Paciente con ARNI, espironolactona y ERC, potasio 5,7, sin síntomas.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Mantener todo.', correcta: false, retro: 'Requiere ajuste.' },
        { texto: 'Revisar ARM y SRAA, dieta y considerar quelante, con control.', correcta: true, retro: 'Se ajusta sin abandonar el beneficio.' },
        { texto: 'Añadir potasio.', correcta: false, retro: 'Peligroso.' },
      ],
    },
    errores: [
      { error: 'Suspender todo sin evaluar.', correccion: 'Ajustar primero.' },
      { error: 'No revisar dieta.', correccion: 'Es parte del manejo.' },
      { error: 'No controlar después.', correccion: 'La recurrencia es frecuente.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármacos elevan el potasio?', respuesta: 'ARM, ARNI, IECA y ARA-II.' },
      { pregunta: '¿Qué hacer con potasio alto?', respuesta: 'Ajustar, revisar dieta y controlar.' },
      { pregunta: '¿Qué son los quelantes?', respuesta: 'Fármacos que reducen el potasio intestinal.' },
    ],
    resumen: [
      'La hiperpotasemia limita la titulación.',
      'Ajustar no siempre es suspender.',
      'Los quelantes pueden ayudar.',
      'La prevención es clave.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Espironolactona Accord 25 mg comprimidos recubiertos con película EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/81034/FT_81034.html' },
    ],
    imagenes: [
      { ubicacion: 'Sección de umbrales', descripcion: 'Semáforo de potasio con acciones en cada nivel.', alt: 'Hiperpotasemia en insuficiencia cardíaca' },
    ],
    keywords: ['hiperpotasemia insuficiencia cardíaca', 'ajuste ARM potasio', 'quelantes de potasio', 'espironolactona potasio'],
  },
  {
    titulo: 'Función renal y terapia fundamental: la caída esperada de la TFG y cuándo preocuparse',
    duracion: 20,
    gancho: {
      titulo: 'La creatinina que sube al iniciar',
      texto: 'Al iniciar un ARNI o un iSGLT2, la TFG puede caer ligeramente. Esa caída suele ser hemodinámica y esperada, no una razón para suspender. Pero un aumento importante, hiperpotasemia o síntomas renales exigen evaluación. La interpretación del cambio y el control permiten mantener la terapia fundamental sin daño. La comunicación con el equipo es clave para ajustar la dosis y el seguimiento. La caída esperada de la TFG no debe atribuirse a daño renal sin evaluar el contexto. La revisión de diuréticos, hidratación y otros fármacos permite distinguir el cambio hemodinámico de una complicación. La educación del paciente evita suspensiones innecesarias. La revisión periódica de la TFG y del potasio permite ajustar la terapia con seguridad. La revisión de la medicación es parte del seguimiento.',
    },
    objetivos: [
      'Interpretar la caída esperada de la TFG.',
      'Distinguir el cambio hemodinámico del daño renal.',
      'Ajustar la terapia fundamental.',
      'Educar y controlar.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'TFG', definicion: 'Filtrado glomerular; puede caer al iniciar fármacos.' },
      { icono: 'LineChart', termino: 'Caída esperada', definicion: 'Descenso leve por cambios hemodinámicos.' },
      { icono: 'AlertTriangle', termino: 'Alarma', definicion: 'Aumento importante, hiperpotasemia o síntomas.' },
      { icono: 'ShieldCheck', termino: 'Control', definicion: 'Creatinina y potasio después de iniciar o ajustar.' },
    ],
    mapa: {
      centro: 'TFG y terapia IC',
      ramas: [
        { titulo: 'Inicio', icono: 'Pill', nodos: ['Caída leve', 'Hemodinámica', 'No suspender'] },
        { titulo: 'Alarma', icono: 'AlertTriangle', nodos: ['Aumento', 'Potasio', 'Síntomas'] },
        { titulo: 'Ajuste', icono: 'RefreshCw', nodos: ['Dosis', 'Diurético', 'Hidratación'] },
        { titulo: 'Control', icono: 'LineChart', nodos: ['Creatinina', 'Potasio', 'TFG'] },
      ],
    },
    secciones: [
      {
        titulo: 'La caída esperada',
        parrafos: [
          'Los fármacos que bloquean el SRAA y los iSGLT2 pueden reducir la TFG de forma transitoria por cambios en la hemodinámica glomerular. Una caída leve y estable no es motivo de suspensión. Se controla y se sigue.',
          'La caída importante, la hiperpotasemia o los síntomas renales requieren evaluación.',
        ],
      },
      {
        titulo: 'Ajuste',
        parrafos: [
          'Se revisan diuréticos, hidratación y otros fármacos. La dosis se ajusta según la TFG y la tolerancia. No se abandona el beneficio sin evaluar.',
          'La comunicación con el equipo es clave. La educación sobre hidratación y control de creatinina es parte del seguimiento.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe saber que los análisis pueden cambiar y que no debe suspender sin consultar. La hidratación y el control son parte del plan.',
          'El QF documenta y coordina.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo interpretar la TFG',
      pasos: [
        { titulo: 'Medir', detalle: 'Creatinina y TFG.', icono: 'TestTube', evidencia: 'Resultado.' },
        { titulo: 'Comparar', detalle: 'Cambio desde el inicio.', icono: 'LineChart', evidencia: 'Curva.' },
        { titulo: 'Evaluar', detalle: 'Síntomas y potasio.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Ajustar', detalle: 'Diurético y dosis.', icono: 'RefreshCw', evidencia: 'Cambio.' },
        { titulo: 'Seguir', detalle: 'TFG y potasio.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'TFG que cae 10 %',
      contexto: 'Paciente que inicia ARNI y la TFG cae 10 %, sin síntomas, potasio normal.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Suspender el ARNI.', correcta: false, retro: 'La caída leve puede ser esperada.' },
        { texto: 'Mantener, controlar y evaluar.', correcta: true, retro: 'Se confirma la evolución.' },
        { texto: 'Aumentar la dosis.', correcta: false, retro: 'Primero se evalúa.' },
      ],
    },
    errores: [
      { error: 'Suspender por una caída leve.', correccion: 'Puede ser hemodinámica.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo de hiperpotasemia.' },
      { error: 'No revisar diuréticos.', correccion: 'Pueden contribuir.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la caída esperada?', respuesta: 'Descenso leve por hemodinámica.' },
      { pregunta: '¿Cuándo preocuparse?', respuesta: 'Caída importante, potasio alto o síntomas.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Creatinina y potasio.' },
    ],
    resumen: [
      'La TFG puede caer levemente.',
      'No siempre se suspende.',
      'El potasio y los síntomas importan.',
      'El control es parte del plan.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de TFG', descripcion: 'Curva de TFG con caída leve esperada y zona de alarma.', alt: 'Función renal y terapia fundamental en IC' },
    ],
    keywords: ['TFG insuficiencia cardíaca', 'caída TFG ARNI', 'función renal IC', 'creatinina IC'],
  },
];

export const CURSO = 'Curso de Farmacoterapia de la Insuficiencia Cardíaca';
export const MIGRACION = '135_experiencias_farmacoterapia_ic_3.sql';

export const CLASES = [
  {
    titulo: 'Caso: hiperpotasemia y creatinina en ascenso en un paciente con FEVI reducida en Cali',
    duracion: 25,
    gancho: {
      titulo: 'La titulación que se detuvo por el potasio',
      texto: 'Un paciente de 68 años en Cali con FEVI de 30 %, ARNI, espironolactona y ERC llega con potasio de 5,8 mEq/L y creatinina en ascenso. La familia quiere suspender todo. El caso exige distinguir la hiperpotasemia peligrosa de una elevación manejable, ajustar sin perder el beneficio y coordinar el seguimiento. La revisión de la dieta, los suplementos y los fármacos que retienen potasio es parte de la intervención.',
    },
    objetivos: [
      'Evaluar una hiperpotasemia en IC con ERC.',
      'Ajustar ARM y bloqueo del SRAA con criterio.',
      'Reconocer la caída esperada de la TFG.',
      'Diseñar un plan de seguimiento.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Hiperpotasemia', definicion: 'Potasio elevado; riesgo de arritmias.' },
      { icono: 'AlertTriangle', termino: 'Creatinina', definicion: 'Puede subir por hemodinámica o daño renal.' },
      { icono: 'Pill', termino: 'Ajuste', definicion: 'Reducir o suspender ARM/SRAA según el riesgo.' },
      { icono: 'ShieldCheck', termino: 'Seguimiento', definicion: 'Potasio, TFG, ECG y síntomas.' },
    ],
    mapa: {
      centro: 'Hiperpotasemia y TFG',
      ramas: [
        { titulo: 'Potasio', icono: 'Droplets', nodos: ['5,8', 'ECG', 'Síntomas'] },
        { titulo: 'ARM', icono: 'Pill', nodos: ['Reducir', 'Suspender', 'Reevaluar'] },
        { titulo: 'TFG', icono: 'LineChart', nodos: ['Caída esperada', 'Daño', 'Control'] },
        { titulo: 'Plan', icono: 'CalendarClock', nodos: ['Dieta', 'Quelante', 'Seguimiento'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'La hiperpotasemia de 5,8 mEq/L requiere evaluación urgente si hay síntomas o cambios en el ECG. Se revisan los fármacos que retienen potasio, la función renal, la dieta y los suplementos. La creatinina en ascenso puede reflejar el efecto hemodinámico del ARNI o un daño renal.',
          'Se distingue la elevación leve y estable de la que progresa. El potasio y la creatinina se comparan con valores previos.',
        ],
      },
      {
        titulo: 'Ajuste',
        parrafos: [
          'Se reduce o suspende la espironolactona según la gravedad. El ARNI o IECA se ajusta si hay hiperpotasemia persistente o deterioro renal. Los quelantes pueden ayudar a mantener el bloqueo. La dieta y la hidratación son parte del manejo.',
          'No se abandona todo el esquema sin evaluar. La comunicación con el equipo es clave.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se controlan potasio y creatinina en 48 a 72 horas y luego según la estabilidad. Se revisan síntomas, presión y adherencia. La educación incluye evitar suplementos y sal de reemplazo.',
          'El QF documenta la intervención y coordina el seguimiento.',
          'La revisión debe incluir la adherencia, los síntomas de hiperpotasemia y los fármacos que retienen potasio. La educación sobre dieta y suplementos completa el plan.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejo del caso',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Potasio, ECG y síntomas.', icono: 'AlertTriangle', evidencia: 'Evaluación.' },
        { titulo: 'Revisar', detalle: 'ARM, SRAA y dieta.', icono: 'Search', evidencia: 'Lista.' },
        { titulo: 'Ajustar', detalle: 'Reducir o suspender.', icono: 'Pill', evidencia: 'Cambio.' },
        { titulo: 'Controlar', detalle: 'Potasio y TFG.', icono: 'LineChart', evidencia: 'Resultados.' },
        { titulo: 'Seguir', detalle: 'Síntomas y adherencia.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Potasio 5,8 y creatinina en ascenso',
      contexto: 'Paciente con FEVI 30, ARNI, espironolactona, ERC, potasio 5,8 y creatinina en ascenso.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Aumentar espironolactona.', correcta: false, retro: 'Empeora la hiperpotasemia.' },
        { texto: 'Evaluar gravedad, reducir o suspender ARM, ajustar SRAA y controlar.', correcta: true, retro: 'El ajuste preserva el beneficio con seguridad.' },
        { texto: 'Suspender todo sin evaluar.', correcta: false, retro: 'Se puede ajustar.' },
      ],
    },
    errores: [
      { error: 'Ignorar el ECG.', correccion: 'La hiperpotasemia puede causar arritmias.' },
      { error: 'Suspender todo por una elevación leve.', correccion: 'Ajustar y controlar.' },
      { error: 'No revisar la dieta.', correccion: 'Es parte del manejo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se evalúa primero?', respuesta: 'Potasio, ECG y síntomas.' },
      { pregunta: '¿Qué fármaco se ajusta?', respuesta: 'ARM y SRAA.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Potasio y TFG.' },
    ],
    resumen: [
      'La hiperpotasemia requiere evaluación.',
      'El ARM se ajusta según gravedad.',
      'La TFG puede caer por hemodinámica.',
      'El seguimiento es cercano.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Espironolactona Accord 25 mg comprimidos recubiertos con película EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/81034/FT_81034.html' },
    ],
    imagenes: [
      { ubicacion: 'Sección del caso', descripcion: 'Paciente con potasio 5,8 y creatinina en ascenso, con un plan de ajuste.', alt: 'Caso de hiperpotasemia y creatinina en insuficiencia cardíaca' },
    ],
    keywords: ['hiperpotasemia insuficiencia cardíaca', 'creatinina ARNI', 'espironolactona potasio', 'caso IC ERC'],
  },
  {
    titulo: 'Introducción a la unidad: IC descompensada, terapias adicionales e IC con FEVI preservada',
    duracion: 20,
    gancho: {
      titulo: 'No todo es FEVI reducida',
      texto: 'La insuficiencia cardíaca incluye descompensaciones agudas, pacientes con FEVI preservada y terapias adicionales para casos seleccionados. La unidad 4 amplía el enfoque más allá de los cuatro pilares y ayuda a reconocer cuándo se necesita algo más. La evaluación integral y la transición al alta son parte de este recorrido.',
    },
    objetivos: [
      'Reconocer los escenarios de la unidad 4.',
      'Diferenciar IC descompensada de crónica.',
      'Identificar terapias adicionales.',
      'Aplicar el enfoque en FEVI preservada.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Descompensación', definicion: 'Empeoramiento agudo de síntomas que requiere tratamiento urgente.' },
      { icono: 'Pill', termino: 'Terapias adicionales', definicion: 'Ivabradina, vericiguat, digoxina, hierro intravenoso.' },
      { icono: 'Activity', termino: 'FEVI preservada', definicion: 'IC con FEVI ≥50 %; el tratamiento se centra en iSGLT2 y comorbilidades.' },
      { icono: 'ShieldCheck', termino: 'Seguridad', definicion: 'Evitar fármacos que empeoran la IC.' },
    ],
    mapa: {
      centro: 'Unidad 4',
      ramas: [
        { titulo: 'Aguda', icono: 'AlertTriangle', nodos: ['Perfiles', 'Diuréticos IV', 'Vasodilatadores'] },
        { titulo: 'Adicional', icono: 'Pill', nodos: ['Ivabradina', 'Vericiguat', 'Digoxina'] },
        { titulo: 'Hierro', icono: 'Droplets', nodos: ['Ferritina', 'Saturación', 'IV'] },
        { titulo: 'FEVIp', icono: 'Activity', nodos: ['iSGLT2', 'ARM', 'Comorbilidad'] },
      ],
    },
    secciones: [
      {
        titulo: 'Escenarios',
        parrafos: [
          'La IC descompensada requiere evaluar el perfil clínico, los desencadenantes y el tratamiento diurético. La transición al alta es una oportunidad para optimizar la terapia fundamental. Las terapias adicionales se reservan para pacientes seleccionados.',
          'La FEVI preservada es frecuente y requiere un enfoque centrado en iSGLT2, diuréticos y comorbilidades como obesidad, hipertensión, diabetes y fibrilación auricular.',
        ],
      },
      {
        titulo: 'Terapias adicionales',
        parrafos: [
          'La ivabradina reduce la frecuencia en pacientes seleccionados con ritmo sinusal. El vericiguat modula la vía del guanilato ciclasa. La digoxina se usa en situaciones específicas. El hierro intravenoso mejora síntomas en déficit de hierro.',
          'Cada terapia tiene indicaciones y límites. No sustituyen los cuatro pilares.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Se revisan los fármacos que causan o empeoran la IC. La educación y el seguimiento son parte del plan.',
          'El QF puede detectar problemas y coordinar.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo abordar la unidad 4',
      pasos: [
        { titulo: 'Clasificar', detalle: 'Aguda o crónica, FEVI y perfil.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Tratar', detalle: 'Diuréticos y terapia fundamental.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Añadir', detalle: 'Terapias adicionales si indicadas.', icono: 'Layers', evidencia: 'Selección.' },
        { titulo: 'Educar', detalle: 'Signos de alarma y adherencia.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Síntomas y eventos.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'FEVI preservada y obesidad',
      contexto: 'Paciente con FEVI 58 %, obesidad, diabetes e hipertensión.',
      pregunta: '¿Qué enfoque es más adecuado?',
      opciones: [
        { texto: 'Solo furosemida.', correcta: false, retro: 'No aborda comorbilidades ni pronóstico.' },
        { texto: 'iSGLT2, control de comorbilidades y diurético si hay congestión.', correcta: true, retro: 'Es el enfoque en FEVI preservada.' },
        { texto: 'Cuatro pilares como en FEVI reducida.', correcta: false, retro: 'La evidencia no es la misma.' },
      ],
    },
    errores: [
      { error: 'Tratar toda IC igual.', correccion: 'La FEVI y el escenario cambian el enfoque.' },
      { error: 'No buscar desencadenantes.', correccion: 'La descompensación tiene causa.' },
      { error: 'No revisar fármacos que empeoran.', correccion: 'Pueden causar descompensación.' },
    ],
    comprueba: [
      { pregunta: '¿Qué incluye la unidad 4?', respuesta: 'IC aguda, terapias adicionales, hierro y FEVI preservada.' },
      { pregunta: '¿Qué se usa en FEVI preservada?', respuesta: 'iSGLT2 y manejo de comorbilidades.' },
      { pregunta: '¿Qué es una descompensación?', respuesta: 'Empeoramiento agudo de síntomas.' },
    ],
    resumen: [
      'La IC no es solo FEVI reducida.',
      'La descompensación requiere evaluación.',
      'Las terapias adicionales son selectivas.',
      'La FEVI preservada tiene su enfoque.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Apertura de la unidad', descripcion: 'Cuatro escenarios: aguda, adicional, hierro y FEVI preservada.', alt: 'Introducción a la unidad 4 de insuficiencia cardíaca' },
    ],
    keywords: ['IC descompensada', 'terapias adicionales IC', 'FEVI preservada', 'hierro insuficiencia cardíaca'],
  },
  {
    titulo: 'IC descompensada: perfiles clínicos, desencadenantes, diuréticos intravenosos, vasodilatadores e inotrópicos',
    duracion: 25,
    gancho: {
      titulo: 'El paciente que llega ahogado',
      texto: 'Un paciente llega con disnea en reposo, crepitantes y presión 90/60. Otro llega con edema y presión 160/100. Ambos están descompensados, pero el perfil y el tratamiento inicial difieren. Reconocer el perfil evita empeorar la perfusión o la congestión. La evaluación de la presión, los signos de congestión y la función renal guía la intervención inicial.',
    },
    objetivos: [
      'Reconocer los perfiles clínicos de IC descompensada.',
      'Identificar desencadenantes.',
      'Aplicar diuréticos intravenosos y vasodilatadores.',
      'Reconocer el lugar de los inotrópicos.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Perfil', definicion: 'Congestión y perfusión; guía el tratamiento inicial.' },
      { icono: 'Pill', termino: 'Diurético IV', definicion: 'Alivia la congestión en la descompensación.' },
      { icono: 'Gauge', termino: 'Vasodilatador', definicion: 'Reduce la poscarga en pacientes hipertensos.' },
      { icono: 'Activity', termino: 'Inotrópico', definicion: 'Apoya el gasto en bajo gasto o shock.' },
    ],
    mapa: {
      centro: 'IC descompensada',
      ramas: [
        { titulo: 'Perfiles', icono: 'Layers', nodos: ['Húmedo', 'Seco', 'Caliente', 'Frío'] },
        { titulo: 'Causas', icono: 'Search', nodos: ['Adherencia', 'Isquemia', 'Arritmia', 'Infección'] },
        { titulo: 'Tratamiento', icono: 'Pill', nodos: ['Diurético IV', 'Vasodilatador', 'Inotrópico'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Presión', 'Función renal', 'Potasio'] },
      ],
    },
    secciones: [
      {
        titulo: 'Perfiles y desencadenantes',
        parrafos: [
          'La IC descompensada se clasifica según congestión y perfusión. El paciente húmedo y caliente predomina con congestión; el frío y húmedo tiene bajo gasto. Se buscan desencadenantes como falta de adherencia, isquemia, arritmia, infección, anemia, tiroides o fármacos.',
          'La evaluación incluye presión, signos de congestión, perfusión, función renal y electrolitos.',
        ],
      },
      {
        titulo: 'Tratamiento inicial',
        parrafos: [
          'Los diuréticos intravenosos alivian la congestión. Los vasodilatadores se usan en pacientes hipertensos y congestionados. Los inotrópicos se reservan para bajo gasto o shock. La oxigenación y el soporte ventilatorio se evalúan según la gravedad.',
          'La transición al alta debe incluir optimización de la terapia fundamental y seguimiento temprano.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Se controlan presión, función renal, potasio y diuresis. La hipotensión y el deterioro renal requieren ajuste. La educación y la adherencia son parte de la prevención.',
          'El QF puede revisar la medicación y detectar desencadenantes.',
          'La revisión debe incluir la adherencia, los fármacos que empeoran la IC y los signos de alarma. La educación y el seguimiento temprano son parte del plan.',
        ],
      },
    ],
    proceso: {
      titulo: 'Abordaje de la descompensación',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Congestión, perfusión y presión.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Buscar causa', detalle: 'Adherencia, isquemia, arritmia.', icono: 'AlertTriangle', evidencia: 'Diagnóstico.' },
        { titulo: 'Tratar', detalle: 'Diurético, vasodilatador o inotrópico.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Controlar', detalle: 'Diuresis, renal y potasio.', icono: 'LineChart', evidencia: 'Resultados.' },
        { titulo: 'Transición', detalle: 'Optimizar y seguir.', icono: 'CalendarClock', evidencia: 'Alta.' },
      ],
    },
    caso: {
      titulo: 'Húmedo y frío',
      contexto: 'Paciente con edema, disnea, presión 88/60 y extremidades frías.',
      pregunta: '¿Qué perfil y tratamiento corresponden?',
      opciones: [
        { texto: 'Húmedo y caliente; solo vasodilatador.', correcta: false, retro: 'El paciente está frío.' },
        { texto: 'Húmedo y frío; diurético y valorar inotrópico.', correcta: true, retro: 'Hay congestión y bajo gasto.' },
        { texto: 'Seco y caliente; alta.', correcta: false, retro: 'Hay congestión y hipoperfusión.' },
      ],
    },
    errores: [
      { error: 'Usar vasodilatador en hipotensión.', correccion: 'Puede empeorar la perfusión.' },
      { error: 'No buscar desencadenante.', correccion: 'La causa debe tratarse.' },
      { error: 'No optimizar al alta.', correccion: 'La transición es clave.' },
    ],
    comprueba: [
      { pregunta: '¿Qué perfiles existen?', respuesta: 'Húmedo/seco y caliente/frío.' },
      { pregunta: '¿Qué hace el diurético IV?', respuesta: 'Alivia la congestión.' },
      { pregunta: '¿Cuándo usar inotrópico?', respuesta: 'En bajo gasto o shock.' },
    ],
    resumen: [
      'El perfil guía el tratamiento.',
      'Los desencadenantes se buscan.',
      'El diurético IV alivia la congestión.',
      'La transición al alta importa.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de perfiles', descripcion: 'Cuatro perfiles de IC descompensada con congestión y perfusión.', alt: 'Perfiles de insuficiencia cardíaca descompensada' },
    ],
    keywords: ['IC descompensada', 'perfiles IC', 'diurético intravenoso IC', 'inotrópicos IC'],
  },
  {
    titulo: 'Transición al alta: optimización de la terapia fundamental, iSGLT2 intrahospitalario y seguimiento temprano',
    duracion: 20,
    gancho: {
      titulo: 'El alta que decide el próximo ingreso',
      texto: 'Un paciente se va de alta con furosemida y sin cambios en la terapia fundamental. En pocas semanas reingresa. La transición al alta es una oportunidad para iniciar o titular los pilares, educar y programar un seguimiento temprano. Lo que no se hace al alta suele perderse. La revisión de la medicación, la educación y el seguimiento temprano reducen el riesgo de reingreso.',
    },
    objetivos: [
      'Optimizar la terapia fundamental antes del alta.',
      'Iniciar iSGLT2 de forma segura en el hospital.',
      'Programar seguimiento temprano.',
      'Educar al paciente y al cuidador.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Optimización', definicion: 'Iniciar o titular pilares antes del alta.' },
      { icono: 'Gauge', termino: 'iSGLT2', definicion: 'Puede iniciarse en el hospital con control.' },
      { icono: 'CalendarClock', termino: 'Seguimiento', definicion: 'Consulta temprana después del alta.' },
      { icono: 'Users', termino: 'Educación', definicion: 'Peso, sal, alarma y adherencia.' },
    ],
    mapa: {
      centro: 'Transición al alta',
      ramas: [
        { titulo: 'Pilares', icono: 'Pill', nodos: ['Iniciar', 'Titular', 'Dosis'] },
        { titulo: 'iSGLT2', icono: 'Gauge', nodos: ['Hospital', 'Seguridad', 'Continuidad'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['7 días', 'Teléfono', 'Laboratorio'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['Peso', 'Sal', 'Alarma'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué hacer antes del alta',
        parrafos: [
          'Se revisan los cuatro pilares y se inician o titulan si el paciente está estable. El iSGLT2 puede iniciarse en el hospital y continuarse al alta. Se ajustan diuréticos y se revisan potasio y función renal.',
          'La educación incluye peso diario, sal, signos de alarma y adherencia. Se entrega un plan escrito.',
        ],
      },
      {
        titulo: 'Seguimiento temprano',
        parrafos: [
          'La consulta en los primeros siete a catorce días permite ajustar dosis, revisar laboratorio y prevenir reingresos. La comunicación con el equipo y la farmacia es clave.',
          'El QF puede llamar al paciente y revisar la adherencia.',
        ],
      },
      {
        titulo: 'Continuidad',
        parrafos: [
          'La transición debe incluir receta, acceso y educación. Las barreras se resuelven antes del alta.',
          'La meta es un plan sostenible.',
          'La revisión debe incluir la adherencia, el acceso y los signos de alarma. La comunicación con el equipo y la farmacia permite ajustar el plan después del alta. La revisión de la adherencia y del acceso evita interrupciones del tratamiento. La educación del paciente y del cuidador completa la transición. La revisión del plan en la primera semana permite corregir barreras. La revisión es clave. La revisión periódica es clave.',
        ],
      },
    ],
    proceso: {
      titulo: 'Plan de alta',
      pasos: [
        { titulo: 'Revisar', detalle: 'Pilares y dosis.', icono: 'Search', evidencia: 'Lista.' },
        { titulo: 'Iniciar', detalle: 'iSGLT2 y ajustes.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Peso, sal y alarma.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Citar', detalle: 'Seguimiento temprano.', icono: 'CalendarClock', evidencia: 'Cita.' },
        { titulo: 'Verificar', detalle: 'Acceso y adherencia.', icono: 'CheckCircle2', evidencia: 'Confirmación.' },
      ],
    },
    caso: {
      titulo: 'Alta sin pilares',
      contexto: 'Paciente con FEVI reducida que se va de alta solo con furosemida.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Nada, ya está estabilizado.', correcta: false, retro: 'La terapia fundamental reduce reingresos.' },
        { texto: 'Iniciar o titular pilares antes del alta y programar seguimiento.', correcta: true, retro: 'La transición es una oportunidad.' },
        { texto: 'Suspender furosemida.', correcta: false, retro: 'Puede empeorar la congestión.' },
      ],
    },
    errores: [
      { error: 'No optimizar al alta.', correccion: 'Se pierde la oportunidad.' },
      { error: 'No programar seguimiento.', correccion: 'El riesgo de reingreso aumenta.' },
      { error: 'No verificar acceso.', correccion: 'La adherencia falla.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se inicia antes del alta?', respuesta: 'Los pilares y el iSGLT2 si es posible.' },
      { pregunta: '¿Cuándo es el seguimiento?', respuesta: 'En los primeros 7-14 días.' },
      { pregunta: '¿Qué se educa?', respuesta: 'Peso, sal, alarma y adherencia.' },
    ],
    resumen: [
      'El alta es una oportunidad.',
      'Optimizar reduce reingresos.',
      'El seguimiento temprano es clave.',
      'La educación sostiene el plan.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de alta', descripcion: 'Checklist de alta con pilares, educación y cita.', alt: 'Transición al alta en insuficiencia cardíaca' },
    ],
    keywords: ['alta insuficiencia cardíaca', 'transición IC', 'iSGLT2 hospitalario', 'seguimiento temprano IC'],
  },
  {
    titulo: 'Terapia médica adicional en FEVI reducida: ivabradina, vericiguat y digoxina/digitoxina',
    duracion: 20,
    gancho: {
      titulo: 'Cuando los cuatro pilares no bastan',
      texto: 'Algunos pacientes con FEVI reducida siguen sintomáticos a pesar de la terapia fundamental. La ivabradina, el vericiguat y la digoxina pueden tener un papel en casos seleccionados. No son para todos y requieren indicaciones precisas. La revisión de la terapia fundamental y la selección cuidadosa evitan el uso indiscriminado.',
    },
    objetivos: [
      'Reconocer las indicaciones de las terapias adicionales.',
      'Aplicar criterios de seguridad.',
      'Diferenciar sus mecanismos.',
      'Evitar el uso indiscriminado.',
    ],
    conceptos: [
      { icono: 'Timer', termino: 'Ivabradina', definicion: 'Reduce la frecuencia cardiaca en ritmo sinusal.' },
      { icono: 'Activity', termino: 'Vericiguat', definicion: 'Estimula la vía del guanilato ciclasa.' },
      { icono: 'Pill', termino: 'Digoxina', definicion: 'Mejora síntomas y reduce hospitalizaciones en casos seleccionados.' },
      { icono: 'AlertTriangle', termino: 'Seguridad', definicion: 'Cada fármaco tiene límites y efectos adversos.' },
    ],
    mapa: {
      centro: 'Terapias adicionales',
      ramas: [
        { titulo: 'Ivabradina', icono: 'Timer', nodos: ['Ritmo sinusal', 'Frecuencia', 'Síntomas'] },
        { titulo: 'Vericiguat', icono: 'Activity', nodos: ['Guía', 'Hospitalización', 'Síntomas'] },
        { titulo: 'Digoxina', icono: 'Pill', nodos: ['Síntomas', 'FA', 'Niveles'] },
        { titulo: 'Límites', icono: 'AlertTriangle', nodos: ['No sustituyen', 'Selección', 'Control'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicaciones',
        parrafos: [
          'La ivabradina se usa en pacientes con FEVI reducida, ritmo sinusal y frecuencia elevada a pesar del betabloqueador. El vericiguat se considera en pacientes con empeoramiento reciente. La digoxina se usa en síntomas o fibrilación auricular con control insuficiente.',
          'Ninguna sustituye los cuatro pilares. La selección es especializada.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'La ivabradina puede causar bradicardia y fenómenos visuales. El vericiguat puede causar hipotensión y anemia. La digoxina tiene margen estrecho y requiere control de niveles, potasio y función renal.',
          'Se revisan interacciones y contraindicaciones.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe conocer los efectos adversos y la importancia del seguimiento. La adherencia es clave.',
          'El QF puede revisar la medicación y los niveles.',
          'La revisión debe incluir la frecuencia, la presión, la función renal y el potasio. La educación sobre efectos adversos y adherencia es parte del seguimiento. La revisión de la indicación y de los límites de cada terapia es clave.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo considerar una terapia adicional',
      pasos: [
        { titulo: 'Revisar', detalle: 'Pilares y síntomas.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Indicación', detalle: 'Ivabradina, vericiguat o digoxina.', icono: 'Target', evidencia: 'Criterio.' },
        { titulo: 'Seguridad', detalle: 'Frecuencia, presión, renal y potasio.', icono: 'AlertTriangle', evidencia: 'Revisión.' },
        { titulo: 'Educar', detalle: 'Efectos y adherencia.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Síntomas y eventos.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Frecuencia alta a pesar del beta',
      contexto: 'Paciente con FEVI reducida, ritmo sinusal, frecuencia 88 y betabloqueador optimizado.',
      pregunta: '¿Qué opción es razonable?',
      opciones: [
        { texto: 'Ivabradina, si cumple criterios.', correcta: true, retro: 'Puede reducir la frecuencia y los síntomas.' },
        { texto: 'Digoxina en todos.', correcta: false, retro: 'No es para todos.' },
        { texto: 'Suspender el beta.', correcta: false, retro: 'El beta tiene beneficio.' },
      ],
    },
    errores: [
      { error: 'Usar terapias adicionales en lugar de los pilares.', correccion: 'No los sustituyen.' },
      { error: 'No controlar niveles de digoxina.', correccion: 'Margen estrecho.' },
      { error: 'No revisar la frecuencia.', correccion: 'La ivabradina requiere ritmo sinusal.' },
    ],
    comprueba: [
      { pregunta: '¿Cuándo se usa ivabradina?', respuesta: 'FEVI reducida, ritmo sinusal y frecuencia elevada.' },
      { pregunta: '¿Qué es vericiguat?', respuesta: 'Estimulador de la vía del guanilato ciclasa.' },
      { pregunta: '¿Qué requiere digoxina?', respuesta: 'Control de niveles, potasio y función renal.' },
    ],
    resumen: [
      'Las terapias adicionales son selectivas.',
      'No sustituyen los pilares.',
      'Cada una tiene efectos adversos.',
      'El seguimiento es clave.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de terapias', descripcion: 'Tres opciones adicionales con sus indicaciones.', alt: 'Terapias adicionales en insuficiencia cardíaca' },
    ],
    keywords: ['ivabradina insuficiencia cardíaca', 'vericiguat', 'digoxina IC', 'terapias adicionales IC'],
  },
  {
    titulo: 'Déficit de hierro en IC: diagnóstico con ferritina y saturación de transferrina, y hierro intravenoso',
    duracion: 20,
    gancho: {
      titulo: 'La fatiga que no era solo del corazón',
      texto: 'Un paciente con IC y FEVI reducida sigue con fatiga y disnea a pesar de la terapia óptima. La ferritina es 80 ng/mL y la saturación de transferrina 15 %. Tiene déficit de hierro. El hierro intravenoso puede mejorar los síntomas y la calidad de vida. La revisión de la ferritina, la saturación y otras causas de anemia es parte del abordaje.',
    },
    objetivos: [
      'Diagnosticar el déficit de hierro en IC.',
      'Interpretar ferritina y saturación de transferrina.',
      'Aplicar criterios de hierro intravenoso.',
      'Educar y seguir.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Ferritina', definicion: 'Reserva de hierro; puede elevarse por inflamación.' },
      { icono: 'TestTube', termino: 'Saturación', definicion: 'Porcentaje de transferrina ocupada por hierro.' },
      { icono: 'Pill', termino: 'Hierro IV', definicion: 'Repone depósitos y mejora síntomas en IC.' },
      { icono: 'Target', termino: 'Criterio', definicion: 'Ferritina y saturación que definen déficit.' },
    ],
    mapa: {
      centro: 'Déficit de hierro',
      ramas: [
        { titulo: 'Diagnóstico', icono: 'TestTube', nodos: ['Ferritina', 'Saturación', 'Inflamación'] },
        { titulo: 'Tratamiento', icono: 'Pill', nodos: ['Hierro IV', 'Oral', 'Respuesta'] },
        { titulo: 'Beneficio', icono: 'Activity', nodos: ['Síntomas', 'Calidad', 'Hospitalización'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['Ferritina', 'Hemoglobina', 'Tolerancia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Diagnóstico',
        parrafos: [
          'El déficit de hierro en IC se define por ferritina <100 ng/mL o ferritina 100-299 con saturación de transferrina <20 %. La inflamación puede elevar la ferritina, por lo que la saturación ayuda.',
          'Se descartan otras causas de anemia y se revisa el sangrado.',
        ],
      },
      {
        titulo: 'Tratamiento',
        parrafos: [
          'El hierro intravenoso mejora los síntomas y la calidad de vida en pacientes con déficit y FEVI reducida. El hierro oral puede ser insuficiente por absorción y tolerancia. La elección depende del contexto.',
          'Se controlan reacciones adversas y respuesta.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe conocer el beneficio y los efectos adversos. La adherencia y el seguimiento son parte del plan.',
          'El QF puede revisar la indicación y la respuesta.',
          'La revisión debe incluir la ferritina, la saturación, la hemoglobina y los síntomas. La educación sobre el beneficio y los efectos adversos completa el plan. La revisión de la respuesta y de las causas de anemia es parte del seguimiento. La educación sobre hierro y adherencia completa el plan. La revisión periódica de la ferritina y la hemoglobina permite ajustar.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo manejar el déficit de hierro',
      pasos: [
        { titulo: 'Medir', detalle: 'Ferritina y saturación.', icono: 'TestTube', evidencia: 'Resultados.' },
        { titulo: 'Clasificar', detalle: 'Déficit o no.', icono: 'Target', evidencia: 'Criterio.' },
        { titulo: 'Tratar', detalle: 'Hierro IV u oral.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Controlar', detalle: 'Respuesta y efectos.', icono: 'LineChart', evidencia: 'Seguimiento.' },
        { titulo: 'Educar', detalle: 'Beneficio y adherencia.', icono: 'Users', evidencia: 'Educación.' },
      ],
    },
    caso: {
      titulo: 'Ferritina 80 y saturación 15',
      contexto: 'Paciente con IC, fatiga, ferritina 80 y saturación 15 %.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Ignorar porque la ferritina es normal.', correcta: false, retro: 'La saturación baja indica déficit.' },
        { texto: 'Tratar el déficit con hierro intravenoso según criterio.', correcta: true, retro: 'Puede mejorar síntomas.' },
        { texto: 'Aumentar el diurético.', correcta: false, retro: 'No es el problema.' },
      ],
    },
    errores: [
      { error: 'Mirar solo la ferritina.', correccion: 'La saturación ayuda.' },
      { error: 'No descartar sangrado.', correccion: 'Es una causa tratable.' },
      { error: 'No evaluar respuesta.', correccion: 'El seguimiento es parte.' },
    ],
    comprueba: [
      { pregunta: '¿Qué define déficit?', respuesta: 'Ferritina <100 o 100-299 con saturación <20 %.' },
      { pregunta: '¿Qué tratamiento mejora síntomas?', respuesta: 'Hierro intravenoso en pacientes seleccionados.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Ferritina, hemoglobina y tolerancia.' },
    ],
    resumen: [
      'El déficit de hierro es frecuente en IC.',
      'La saturación ayuda al diagnóstico.',
      'El hierro IV puede mejorar síntomas.',
      'El seguimiento evalúa respuesta.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de diagnóstico', descripcion: 'Resultados de ferritina y saturación con un plan de hierro IV.', alt: 'Déficit de hierro en insuficiencia cardíaca' },
    ],
    keywords: ['déficit de hierro insuficiencia cardíaca', 'ferritina IC', 'saturación transferrina', 'hierro intravenoso IC'],
  },
  {
    titulo: 'Tratamiento de la IC con FEVI preservada (y del antiguo rango levemente reducido): iSGLT2, ARM, diuréticos, comorbilidades y aGLP-1',
    duracion: 25,
    gancho: {
      titulo: 'La IC que no tenía tratamiento',
      texto: 'Durante años, la IC con FEVI preservada se trataba solo con diuréticos. Hoy los iSGLT2 reducen hospitalizaciones, y el manejo de la obesidad, la hipertensión, la diabetes y la fibrilación auricular es parte del tratamiento. La FEVI preservada no significa “menos grave”. La revisión de comorbilidades y la educación sobre congestión son esenciales.',
    },
    objetivos: [
      'Aplicar el tratamiento de la FEVI preservada.',
      'Reconocer el papel de los iSGLT2.',
      'Manejar comorbilidades.',
      'Educar y seguir.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'iSGLT2', definicion: 'Reducen hospitalizaciones en FEVI preservada.' },
      { icono: 'Droplets', termino: 'Diurético', definicion: 'Alivia la congestión.' },
      { icono: 'Scale', termino: 'Obesidad', definicion: 'Comorbilidad clave; los aGLP-1 pueden ayudar.' },
      { icono: 'Activity', termino: 'Fibrilación auricular', definicion: 'Frecuente; requiere control y anticoagulación según riesgo.' },
    ],
    mapa: {
      centro: 'FEVI preservada',
      ramas: [
        { titulo: 'iSGLT2', icono: 'Gauge', nodos: ['Hospitalización', 'Síntomas', 'Seguridad'] },
        { titulo: 'Diurético', icono: 'Droplets', nodos: ['Congestión', 'Peso', 'Ajuste'] },
        { titulo: 'Comorbilidad', icono: 'Layers', nodos: ['HTA', 'Diabetes', 'Obesidad', 'FA'] },
        { titulo: 'aGLP-1', icono: 'Scale', nodos: ['Peso', 'Síntomas', 'Selección'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tratamiento',
        parrafos: [
          'Los iSGLT2 son la terapia con evidencia más consistente en FEVI preservada y levemente reducida. Los diuréticos alivian la congestión. Los ARM y otros fármacos se individualizan. El tratamiento de la hipertensión, la diabetes, la obesidad y la fibrilación auricular es parte del manejo.',
          'La meta es mejorar síntomas, capacidad funcional y calidad de vida, y reducir hospitalizaciones.',
        ],
      },
      {
        titulo: 'Comorbilidades',
        parrafos: [
          'La obesidad contribuye a los síntomas; los agonistas GLP-1 pueden ayudar en pacientes seleccionados. La hipertensión y la diabetes requieren control. La fibrilación auricular necesita control de frecuencia y anticoagulación según el riesgo.',
          'La revisión integral evita tratamientos fragmentados.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe conocer los signos de congestión y la importancia de la adherencia. El peso diario y la sal son parte del autocuidado.',
          'El QF puede coordinar la revisión.',
          'La revisión debe incluir el peso, la presión, la función renal y la adherencia. La educación sobre congestión y comorbilidades es parte del plan. La revisión de la función renal y de la anticoagulación completa el seguimiento.',
        ],
      },
    ],
    proceso: {
      titulo: 'Abordaje de la FEVI preservada',
      pasos: [
        { titulo: 'Confirmar', detalle: 'FEVI ≥50 y síntomas.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Tratar', detalle: 'iSGLT2 y diurético.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Comorbilidad', detalle: 'HTA, diabetes, obesidad y FA.', icono: 'Layers', evidencia: 'Evaluación.' },
        { titulo: 'Educar', detalle: 'Peso, sal y alarma.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Síntomas y hospitalizaciones.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'FEVI 58, obesidad y diabetes',
      contexto: 'Paciente con FEVI 58 %, obesidad, diabetes y disnea.',
      pregunta: '¿Qué tratamiento es más adecuado?',
      opciones: [
        { texto: 'Solo diurético.', correcta: false, retro: 'No aborda comorbilidades.' },
        { texto: 'iSGLT2, diurético si hay congestión y manejo de obesidad/diabetes.', correcta: true, retro: 'Es el enfoque actual.' },
        { texto: 'Cuatro pilares como FEVI reducida.', correcta: false, retro: 'La evidencia no es la misma.' },
      ],
    },
    errores: [
      { error: 'Creer que no tiene tratamiento.', correccion: 'Los iSGLT2 tienen evidencia.' },
      { error: 'No tratar comorbilidades.', correccion: 'Son parte del síndrome.' },
      { error: 'No educar sobre peso y sal.', correccion: 'El autocuidado mejora síntomas.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármaco tiene evidencia?', respuesta: 'Los iSGLT2.' },
      { pregunta: '¿Qué comorbilidades se manejan?', respuesta: 'HTA, diabetes, obesidad y FA.' },
      { pregunta: '¿Qué alivia la congestión?', respuesta: 'El diurético.' },
    ],
    resumen: [
      'La FEVI preservada tiene tratamiento.',
      'Los iSGLT2 reducen hospitalizaciones.',
      'Las comorbilidades son parte del manejo.',
      'La educación es clave.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Dapagliflozina Aurovitas 10 mg comprimidos recubiertos con película EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/89963/FT_89963.html' },
    ],
    imagenes: [
      { ubicacion: 'Sección de tratamiento', descripcion: 'Corazón con FEVI preservada y comorbilidades alrededor.', alt: 'Tratamiento de la IC con FEVI preservada' },
    ],
    keywords: ['FEVI preservada tratamiento', 'iSGLT2 FEVIp', 'IC obesidad diabetes', 'FEVI levemente reducida'],
  },
  {
    titulo: 'Caso: mujer de 74 años en Bucaramanga con FEVI preservada, obesidad, diabetes y fibrilación auricular',
    duracion: 25,
    gancho: {
      titulo: 'Cuatro problemas y una FEVI normal',
      texto: 'Una mujer de 74 años en Bucaramanga tiene disnea, FEVI de 56 %, obesidad, diabetes y fibrilación auricular. La FEVI normal no descarta la IC. El caso exige control de congestión, iSGLT2, manejo de comorbilidades y anticoagulación según el riesgo. La revisión de la función renal y de las interacciones es parte del plan.',
    },
    objetivos: [
      'Integrar el manejo de la FEVI preservada.',
      'Reconocer el papel del iSGLT2 y del diurético.',
      'Manejar obesidad, diabetes y fibrilación auricular.',
      'Educar y coordinar.',
    ],
    conceptos: [
      { icono: 'Activity', termino: 'FEVI 56', definicion: 'IC con FEVI preservada.' },
      { icono: 'Scale', termino: 'Obesidad', definicion: 'Contribuye a síntomas y comorbilidad.' },
      { icono: 'Network', termino: 'Fibrilación auricular', definicion: 'Requiere control de frecuencia y anticoagulación.' },
      { icono: 'Pill', termino: 'iSGLT2', definicion: 'Reduce hospitalizaciones.' },
    ],
    mapa: {
      centro: 'Caso Bucaramanga',
      ramas: [
        { titulo: 'IC', icono: 'Activity', nodos: ['FEVI 56', 'Disnea', 'Congestión'] },
        { titulo: 'Metabólico', icono: 'Scale', nodos: ['Obesidad', 'Diabetes'] },
        { titulo: 'FA', icono: 'Network', nodos: ['Frecuencia', 'Anticoagulación'] },
        { titulo: 'Plan', icono: 'Pill', nodos: ['iSGLT2', 'Diurético', 'Educación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'La paciente tiene IC con FEVI preservada. Se evalúan congestión, presión, función renal y control de la diabetes y la fibrilación auricular. La obesidad contribuye a los síntomas. Se revisan fármacos que empeoran la IC.',
          'La anticoagulación se decide según el riesgo tromboembólico y hemorrágico.',
        ],
      },
      {
        titulo: 'Tratamiento',
        parrafos: [
          'Se inicia o mantiene un iSGLT2, se ajusta el diurético y se controlan las comorbilidades. La obesidad y la diabetes se manejan de forma integral. La educación incluye peso y sal.',
          'El QF documenta y coordina.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisan síntomas, peso, presión, función renal y adherencia. La fibrilación auricular requiere control y seguimiento.',
          'La calidad de vida es parte del resultado. La revisión de la anticoagulación y de la función renal es clave en esta paciente. La educación y el seguimiento permiten ajustar el plan de forma integral. La revisión de la anticoagulación y de la función renal es clave. La revisión periódica es clave. La educación y el seguimiento son parte del plan. La revisión periódica es muy clave.',
          'La revisión debe incluir la congestión, la presión, la función renal y la anticoagulación. La educación y el seguimiento son parte del plan.',
        ],
      },
    ],
    proceso: {
      titulo: 'Abordaje del caso',
      pasos: [
        { titulo: 'Evaluar', detalle: 'FEVI, congestión y comorbilidad.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Tratar', detalle: 'iSGLT2 y diurético.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Comorbilidad', detalle: 'Obesidad, diabetes y FA.', icono: 'Layers', evidencia: 'Control.' },
        { titulo: 'Educar', detalle: 'Peso, sal y alarma.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Síntomas y función renal.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'FEVI 56 y FA',
      contexto: 'Mujer de 74 años con FEVI 56 %, obesidad, diabetes y fibrilación auricular.',
      pregunta: '¿Qué plan es más integral?',
      opciones: [
        { texto: 'Solo diurético.', correcta: false, retro: 'No aborda comorbilidades.' },
        { texto: 'iSGLT2, diurético, control metabólico y anticoagulación según riesgo.', correcta: true, retro: 'El plan cubre IC y comorbilidades.' },
        { texto: 'Cuatro pilares de FEVI reducida.', correcta: false, retro: 'La evidencia no es la misma.' },
      ],
    },
    errores: [
      { error: 'Ignorar la FA.', correccion: 'Requiere control y anticoagulación.' },
      { error: 'No tratar la obesidad.', correccion: 'Contribuye a síntomas.' },
      { error: 'No revisar función renal.', correccion: 'Afecta el tratamiento.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármaco es clave?', respuesta: 'El iSGLT2.' },
      { pregunta: '¿Qué comorbilidad requiere anticoagulación?', respuesta: 'La fibrilación auricular según riesgo.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Peso, presión, renal y adherencia.' },
    ],
    resumen: [
      'La FEVI normal no descarta IC.',
      'El iSGLT2 es clave.',
      'Las comorbilidades se manejan.',
      'La FA requiere evaluación.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Dapagliflozina Aurovitas 10 mg comprimidos recubiertos con película EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/89963/FT_89963.html' },
    ],
    imagenes: [
      { ubicacion: 'Sección del caso', descripcion: 'Paciente con FEVI 56, obesidad, diabetes y FA, con un plan integral.', alt: 'Caso de FEVI preservada con comorbilidades' },
    ],
    keywords: ['FEVI preservada obesidad diabetes', 'IC fibrilación auricular', 'caso FEVIp'],
  },
  {
    titulo: 'Introducción a la unidad: seguridad, seguimiento farmacoterapéutico y educación en IC dentro del servicio farmacéutico colombiano',
    duracion: 20,
    gancho: {
      titulo: 'El seguimiento que evita reingresos',
      texto: 'Un paciente con IC vuelve a la farmacia después de cada hospitalización. La revisión de la medicación, la adherencia y los signos de alarma puede detectar problemas antes de que se descompense. La unidad 5 integra seguridad, seguimiento y educación. La revisión de la medicación y la coordinación con el equipo son parte del cuidado.',
    },
    objetivos: [
      'Reconocer el papel del servicio farmacéutico en IC.',
      'Identificar fármacos que empeoran la IC.',
      'Aplicar seguimiento y educación.',
      'Prevenir reingresos.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Seguimiento', definicion: 'Evaluación continua de la farmacoterapia.' },
      { icono: 'AlertTriangle', termino: 'Fármacos', definicion: 'Algunos causan o empeoran la IC.' },
      { icono: 'FileCheck', termino: 'Documentación', definicion: 'Registro de intervenciones.' },
      { icono: 'Target', termino: 'Prevención', definicion: 'Educación y adherencia.' },
    ],
    mapa: {
      centro: 'Servicio farmacéutico en IC',
      ramas: [
        { titulo: 'Revisar', icono: 'Search', nodos: ['Fármacos', 'Dosis', 'Interacciones'] },
        { titulo: 'Educar', icono: 'Users', nodos: ['Peso', 'Sal', 'Alarma'] },
        { titulo: 'Seguir', icono: 'CalendarClock', nodos: ['Adherencia', 'Síntomas', 'Laboratorio'] },
        { titulo: 'Prevenir', icono: 'ShieldCheck', nodos: ['Reingresos', 'Vacunas', 'Continuidad'] },
      ],
    },
    secciones: [
      {
        titulo: 'Roles',
        parrafos: [
          'El servicio farmacéutico revisa la medicación, detecta fármacos que empeoran la IC, educa y apoya la adherencia. La coordinación con el equipo es clave.',
          'La documentación permite medir y mejorar.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Se revisan AINE, corticoides, descongestionantes, antiarrítmicos y otros fármacos. La educación sobre signos de alarma y peso diario es parte del plan.',
          'La vacunación y el control de comorbilidades también importan.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisan síntomas, peso, presión, función renal, potasio y adherencia. La comunicación con el equipo es clave.',
          'El QF puede liderar el seguimiento.',
          'La revisión debe incluir la medicación completa, la adherencia y los signos de alarma. La coordinación con el equipo y la educación del cuidador son parte del cuidado. La revisión de la adherencia y de los signos de alarma permite prevenir reingresos. La educación del cuidador es parte del cuidado. La revisión de la medicación y de los signos de alarma permite prevenir descompensaciones. La educación del paciente y del cuidador es parte del seguimiento. La revisión periódica de la medicación es clave. La educación y el seguimiento son parte del plan. La revisión periódica es muy clave para el seguimiento.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo organizar el seguimiento',
      pasos: [
        { titulo: 'Revisar', detalle: 'Medicación y barreras.', icono: 'Search', evidencia: 'Ficha.' },
        { titulo: 'Educar', detalle: 'Peso, sal y alarma.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Coordinar', detalle: 'Equipo y acceso.', icono: 'Network', evidencia: 'Nota.' },
        { titulo: 'Medir', detalle: 'Adherencia y eventos.', icono: 'LineChart', evidencia: 'Indicador.' },
        { titulo: 'Seguir', detalle: 'Revisión periódica.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Reingreso evitable',
      contexto: 'Paciente con IC que reingresa por descompensación y no tenía seguimiento.',
      pregunta: '¿Qué aporta el seguimiento farmacéutico?',
      opciones: [
        { texto: 'Solo dispensar.', correcta: false, retro: 'Se pierden oportunidades.' },
        { texto: 'Revisar medicación, adherencia y signos de alarma.', correcta: true, retro: 'Puede prevenir reingresos.' },
        { texto: 'Aumentar el diurético sin evaluar.', correcta: false, retro: 'No es seguro.' },
      ],
    },
    errores: [
      { error: 'No revisar fármacos que empeoran.', correccion: 'Pueden causar descompensación.' },
      { error: 'No educar.', correccion: 'La adherencia falla.' },
      { error: 'No documentar.', correccion: 'Sin registro no hay continuidad.' },
    ],
    comprueba: [
      { pregunta: '¿Qué revisa el QF?', respuesta: 'Medicación, adherencia y signos de alarma.' },
      { pregunta: '¿Qué fármacos empeoran la IC?', respuesta: 'AINE, corticoides y descongestionantes.' },
      { pregunta: '¿Qué se mide?', respuesta: 'Adherencia y eventos.' },
    ],
    resumen: [
      'El seguimiento previene reingresos.',
      'Los fármacos se revisan.',
      'La educación es clave.',
      'La documentación da continuidad.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de seguimiento', descripcion: 'Farmacia revisando la medicación de un paciente con IC.', alt: 'Seguimiento farmacéutico en insuficiencia cardíaca' },
    ],
    keywords: ['seguimiento farmacéutico IC', 'servicio farmacéutico insuficiencia cardíaca', 'reingresos IC'],
  },
  {
    titulo: 'Fármacos que causan o empeoran la insuficiencia cardíaca',
    duracion: 20,
    gancho: {
      titulo: 'El medicamento que descompensó al paciente',
      texto: 'Un paciente con IC estable empieza un AINE para el dolor y a los días vuelve con edema y disnea. El AINE retiene sodio y empeora la función renal. Conocer los fármacos que causan o empeoran la IC permite detectarlos en la dispensación y evitar descompensaciones. La educación sobre automedicación es parte de la prevención.',
    },
    objetivos: [
      'Identificar fármacos que empeoran la IC.',
      'Reconocer mecanismos.',
      'Aplicar alternativas seguras.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'AINE', definicion: 'Retiene sodio y empeora la función renal.' },
      { icono: 'Pill', termino: 'Corticoides', definicion: 'Retienen líquidos y elevan la presión.' },
      { icono: 'Activity', termino: 'Antiarrítmicos', definicion: 'Algunos tienen efectos proarrítmicos.' },
      { icono: 'ShieldCheck', termino: 'Alternativa', definicion: 'Elegir opciones seguras para el dolor u otras condiciones.' },
    ],
    mapa: {
      centro: 'Fármacos que empeoran la IC',
      ramas: [
        { titulo: 'Dolor', icono: 'AlertTriangle', nodos: ['AINE', 'Corticoides'] },
        { titulo: 'Presión', icono: 'Gauge', nodos: ['Descongestionantes', 'Vasoconstrictores'] },
        { titulo: 'Ritmo', icono: 'Activity', nodos: ['Antiarrítmicos', 'QT'] },
        { titulo: 'Alternativa', icono: 'ShieldCheck', nodos: ['Paracetamol', 'Revisión'] },
      ],
    },
    secciones: [
      {
        titulo: 'Fármacos y mecanismos',
        parrafos: [
          'Los AINE retienen sodio, aumentan la presión y reducen la filtración renal. Los corticoides retienen líquidos. Los descongestionantes vasoconstreñen. Algunos antiarrítmicos y quimioterápicos pueden causar o empeorar la IC.',
          'También se revisan los suplementos y las interacciones.',
        ],
      },
      {
        titulo: 'Alternativas',
        parrafos: [
          'Para el dolor, se prefiere paracetamol o una alternativa según el caso. Se revisan la dosis y la función renal. La educación incluye no automedicarse.',
          'La comunicación con el equipo es clave.',
        ],
      },
      {
        titulo: 'Prevención',
        parrafos: [
          'La revisión de la medicación en cada contacto detecta fármacos de riesgo. El QF puede proponer alternativas.',
          'La documentación permite seguir.',
          'La revisión debe incluir los síntomas, la función renal y las alternativas seguras. La educación sobre automedicación y la coordinación con el equipo completan la prevención. La revisión de la función renal y de los síntomas es parte del seguimiento. La comunicación con el equipo completa la prevención. La revisión de la medicación y de las alternativas seguras es parte del seguimiento. La educación sobre automedicación es clave. La revisión periódica es clave. La educación y el seguimiento son parte del plan. La revisión periódica es muy clave.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo detectar fármacos de riesgo',
      pasos: [
        { titulo: 'Revisar', detalle: 'AINE, corticoides y descongestionantes.', icono: 'Search', evidencia: 'Lista.' },
        { titulo: 'Evaluar', detalle: 'Síntomas y función renal.', icono: 'AlertTriangle', evidencia: 'Evaluación.' },
        { titulo: 'Alternativa', detalle: 'Opción segura.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'No automedicarse.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Síntomas y adherencia.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'AINE y descompensación',
      contexto: 'Paciente con IC estable que inicia un AINE y presenta edema y disnea.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Continuar el AINE.', correcta: false, retro: 'Empeora la IC.' },
        { texto: 'Suspender el AINE y proponer una alternativa segura.', correcta: true, retro: 'Se evita la descompensación.' },
        { texto: 'Aumentar el AINE.', correcta: false, retro: 'Peligroso.' },
      ],
    },
    errores: [
      { error: 'No preguntar por AINE de venta libre.', correccion: 'Es frecuente.' },
      { error: 'No revisar suplementos.', correccion: 'Pueden interactuar.' },
      { error: 'No educar.', correccion: 'La automedicación es un riesgo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármacos empeoran la IC?', respuesta: 'AINE, corticoides y descongestionantes.' },
      { pregunta: '¿Qué alternativa para el dolor?', respuesta: 'Paracetamol según el caso.' },
      { pregunta: '¿Qué se revisa?', respuesta: 'Síntomas y función renal.' },
    ],
    resumen: [
      'Los AINE empeoran la IC.',
      'Los corticoides retienen líquidos.',
      'Las alternativas deben ser seguras.',
      'La educación evita la automedicación.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure' },
    ],
    imagenes: [
      { ubicacion: 'Sección de fármacos', descripcion: 'Lista de fármacos que empeoran la IC con alternativas.', alt: 'Fármacos que causan o empeoran la insuficiencia cardíaca' },
    ],
    keywords: ['fármacos que empeoran insuficiencia cardíaca', 'AINE IC', 'corticoides IC', 'descongestionantes IC'],
  },
];

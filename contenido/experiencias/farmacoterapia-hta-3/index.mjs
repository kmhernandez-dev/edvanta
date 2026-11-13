export const CURSO = 'Curso de Farmacoterapia de la Hipertensión Arterial';
export const MIGRACION = '131_experiencias_farmacoterapia_hta_3.sql';

export const CLASES = [
  {
    titulo: 'HTA en enfermedad renal crónica y diabetes',
    duracion: 25,
    gancho: {
      titulo: 'La presión que protege el riñón',
      texto: 'Un paciente con diabetes tipo 2, TFG de 42 ml/min y albuminuria de 300 mg/g tiene presión de 148/92 mmHg. El objetivo no es solo bajar la cifra: es reducir la progresión renal y el riesgo cardiovascular. La elección del fármaco y el control del potasio son parte del tratamiento.',
    },
    objetivos: [
      'Aplicar metas de presión en ERC y diabetes.',
      'Seleccionar fármacos con nefroprotección.',
      'Ajustar dosis según la TFG.',
      'Controlar potasio, creatinina y albuminuria.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Albuminuria', definicion: 'Marcador de daño renal y riesgo cardiovascular; guía el bloqueo del SRAA.' },
      { icono: 'ShieldCheck', termino: 'Nefroprotección', definicion: 'Control de presión, IECA/ARA-II, iSGLT2 y control glucémico.' },
      { icono: 'Pill', termino: 'Ajuste', definicion: 'Modificación de dosis según TFG y potasio.' },
      { icono: 'Target', termino: 'Meta', definicion: 'Presión <130/80 mmHg en la mayoría, individualizada.' },
    ],
    mapa: {
      centro: 'ERC y diabetes',
      ramas: [
        { titulo: 'Presión', icono: 'Target', nodos: ['<130/80', 'Individualizar', 'AMPA'] },
        { titulo: 'Riñón', icono: 'Droplets', nodos: ['Albuminuria', 'TFG', 'iSGLT2'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['IECA/ARA-II', 'Tiazida', 'Asa'] },
        { titulo: 'Seguridad', icono: 'LineChart', nodos: ['Potasio', 'Creatinina', 'Volumen'] },
      ],
    },
    secciones: [
      {
        titulo: 'Meta y elección',
        parrafos: [
          'En diabetes y ERC, la meta habitual es <130/80 mmHg, con ajuste según edad, fragilidad y tolerancia. El bloqueo del sistema renina-angiotensina con IECA o ARA-II es de elección cuando hay albuminuria, siempre con control de potasio y creatinina. No se combinan IECA y ARA-II.',
          'Los iSGLT2 reducen la progresión renal y los eventos cardiovasculares y forman parte de la nefroprotección. La combinación con bloqueo del SRAA es frecuente. La tiazida es útil si la TFG no es muy baja; en ERC avanzada se prefiere furosemida.',
        ],
      },
      {
        titulo: 'Ajuste y seguridad',
        parrafos: [
          'La TFG guía el ajuste de muchos fármacos. La metformina se suspende con TFG <30. Los IECA y ARA-II pueden elevar creatinina y potasio; se controlan a las dos a cuatro semanas. Un aumento leve de creatinina puede ser esperado, pero un aumento importante exige revisión.',
          'La hiperpotasemia es un riesgo con IECA/ARA-II, espironolactona y enfermedad renal. Se revisan dieta, suplementos y otros fármacos. La educación incluye hidratación y evitar AINE.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisan presión, TFG, albuminuria, potasio y adherencia. La albuminuria se reevalúa en tres a seis meses. La meta es reducir la progresión y los eventos, no solo la cifra.',
          'El QF puede revisar la medicación completa y detectar fármacos que dañan el riñón. La coordinación con el equipo es esencial.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejo de HTA en ERC',
      pasos: [
        { titulo: 'Evaluar', detalle: 'TFG, albuminuria, potasio y presión.', icono: 'Droplets', evidencia: 'Resultados.' },
        { titulo: 'Iniciar', detalle: 'IECA/ARA-II si hay albuminuria.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Añadir', detalle: 'iSGLT2 y diurético según TFG.', icono: 'Layers', evidencia: 'Esquema.' },
        { titulo: 'Controlar', detalle: 'Potasio y creatinina.', icono: 'LineChart', evidencia: 'Control.' },
        { titulo: 'Seguir', detalle: 'Presión, albuminuria y adherencia.', icono: 'CalendarClock', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Albuminuria y TFG 42',
      contexto: 'Paciente con diabetes, TFG 42, albuminuria 300 mg/g, presión 148/92, potasio 4,4.',
      pregunta: '¿Qué esquema es más razonable?',
      opciones: [
        { texto: 'Solo tiazida.', correcta: false, retro: 'No aborda la nefroprotección.' },
        { texto: 'IECA o ARA-II, iSGLT2 y control de presión, con seguimiento de potasio y creatinina.', correcta: true, retro: 'La combinación protege el riñón y el corazón.' },
        { texto: 'IECA más ARA-II.', correcta: false, retro: 'No se combinan.' },
      ],
    },
    errores: [
      { error: 'No medir albuminuria.', correccion: 'Es clave para la nefroprotección.' },
      { error: 'Combinar IECA y ARA-II.', correccion: 'Aumenta el riesgo renal.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo de hiperpotasemia.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es la meta en ERC y diabetes?', respuesta: '<130/80 mmHg, individualizada.' },
      { pregunta: '¿Qué fármacos protegen el riñón?', respuesta: 'IECA/ARA-II e iSGLT2.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Potasio, creatinina y albuminuria.' },
    ],
    resumen: [
      'La meta es <130/80 mmHg.',
      'El bloqueo del SRAA es clave con albuminuria.',
      'iSGLT2 añade nefroprotección.',
      'Potasio y creatinina se controlan.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'KDIGO. 2021 Clinical Practice Guideline for the Management of Blood Pressure in Chronic Kidney Disease.', url: 'https://kdigo.org/guidelines/blood-pressure-in-ckd/' },
    ],
    imagenes: [
      { ubicacion: 'Sección de nefroprotección', descripcion: 'Riñón con albuminuria y un plan con IECA/ARA-II e iSGLT2.', alt: 'Hipertensión en enfermedad renal crónica y diabetes' },
    ],
    keywords: ['hipertensión enfermedad renal crónica', 'hipertensión diabetes albuminuria', 'iSGLT2 nefroprotección', 'meta presión ERC'],
  },
  {
    titulo: 'HTA en el embarazo y la lactancia',
    duracion: 25,
    gancho: {
      titulo: 'El fármaco que no se puede usar',
      texto: 'Una mujer embarazada con hipertensión llega con una fórmula de enalapril. Los IECA y ARA-II están contraindicados en el embarazo por riesgo de daño renal fetal. La elección debe cambiar, pero no se debe suspender todo sin alternativa. La seguridad materna y fetal guía el tratamiento.',
    },
    objetivos: [
      'Reconocer los antihipertensivos contraindicados en el embarazo.',
      'Elegir opciones seguras.',
      'Diferenciar hipertensión crónica, gestacional y preeclampsia.',
      'Aplicar educación y seguimiento.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Contraindicados', definicion: 'IECA, ARA-II y espironolactona por riesgo fetal.' },
      { icono: 'Pill', termino: 'Seguros', definicion: 'Labetalol, nifedipino y metildopa son opciones clásicas.' },
      { icono: 'Activity', termino: 'Preeclampsia', definicion: 'Hipertensión con proteinuria o daño de órgano después de las 20 semanas.' },
      { icono: 'ShieldCheck', termino: 'Meta', definicion: 'Control sin hipotensión fetal; individualizada.' },
    ],
    mapa: {
      centro: 'HTA y embarazo',
      ramas: [
        { titulo: 'Evitar', icono: 'AlertTriangle', nodos: ['IECA', 'ARA-II', 'Espironolactona'] },
        { titulo: 'Usar', icono: 'Pill', nodos: ['Labetalol', 'Nifedipino', 'Metildopa'] },
        { titulo: 'Preeclampsia', icono: 'Activity', nodos: ['Proteinuria', 'Aspirina', 'Magnesio'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['Presión', 'Feto', 'Lactancia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué evitar y qué usar',
        parrafos: [
          'Los IECA y los ARA-II están contraindicados en el embarazo porque pueden causar oligohidramnios, daño renal fetal y muerte fetal. La espironolactona también se evita. El tratamiento se cambia antes de la concepción o al confirmar el embarazo.',
          'Las opciones clásicas incluyen labetalol, nifedipino de liberación prolongada y metildopa. La elección depende de la experiencia, la disponibilidad y la tolerancia. La meta es evitar crisis hipertensivas sin comprometer la perfusión fetal.',
        ],
      },
      {
        titulo: 'Preeclampsia',
        parrafos: [
          'La preeclampsia se define por hipertensión después de las 20 semanas con proteinuria o daño de órgano. Requiere evaluación urgente y manejo especializado. La aspirina en dosis baja puede prevenir en pacientes de alto riesgo. El sulfato de magnesio se usa para prevención y tratamiento de convulsiones en contextos especializados.',
          'El QF puede detectar una fórmula de IECA en el embarazo, educar y derivar. No se debe suspender el tratamiento sin alternativa.',
        ],
      },
      {
        titulo: 'Lactancia',
        parrafos: [
          'Durante la lactancia, muchas opciones son compatibles, pero se debe individualizar. Los IECA y ARA-II se consideran compatibles en algunos casos, pero la decisión depende del contexto y de la evidencia. El QF puede revisar la ficha técnica y consultar.',
          'La educación incluye control de presión, signos de alarma y adherencia. La coordinación con obstetricia es esencial.',
        ],
      },
    ],
    proceso: {
      titulo: 'Abordaje de HTA en embarazo',
      pasos: [
        { titulo: 'Confirmar', detalle: 'Edad gestacional, presión y proteinuria.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Revisar fármacos', detalle: 'Suspender IECA/ARA-II y espironolactona.', icono: 'AlertTriangle', evidencia: 'Lista.' },
        { titulo: 'Elegir', detalle: 'Labetalol, nifedipino o metildopa.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Signos de alarma y control.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Presión y bienestar fetal.', icono: 'CalendarClock', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Enalapril en el embarazo',
      contexto: 'Mujer embarazada de 12 semanas con enalapril y presión 150/95.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Mantener enalapril.', correcta: false, retro: 'Está contraindicado por riesgo fetal.' },
        { texto: 'Suspender y proponer labetalol o nifedipino, con control.', correcta: true, retro: 'Se cambia a una opción segura y se controla la presión.' },
        { texto: 'Suspender todo sin alternativa.', correcta: false, retro: 'La hipertensión no tratada también es riesgosa.' },
      ],
    },
    errores: [
      { error: 'Mantener IECA en el embarazo.', correccion: 'Contraindicado.' },
      { error: 'No buscar preeclampsia.', correccion: 'Requiere evaluación urgente.' },
      { error: 'Suspender sin alternativa.', correccion: 'Se cambia a una opción segura.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármacos se evitan?', respuesta: 'IECA, ARA-II y espironolactona.' },
      { pregunta: '¿Qué opciones son seguras?', respuesta: 'Labetalol, nifedipino y metildopa.' },
      { pregunta: '¿Qué es preeclampsia?', respuesta: 'Hipertensión después de las 20 semanas con proteinuria o daño de órgano.' },
    ],
    resumen: [
      'IECA y ARA-II están contraindicados.',
      'Labetalol, nifedipino y metildopa son opciones.',
      'La preeclampsia es una emergencia.',
      'La lactancia se individualiza.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'ACOG. Gestational Hypertension and Preeclampsia: ACOG Practice Bulletin, Number 222. Obstet Gynecol. 2020;135(6):e237-e260.', url: 'https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2019/01/gestational-hypertension-and-preeclampsia' },
    ],
    imagenes: [
      { ubicacion: 'Sección de seguridad', descripcion: 'Embarazada con control de presión y lista de fármacos seguros y contraindicados.', alt: 'Hipertensión en el embarazo' },
    ],
    keywords: ['hipertensión embarazo', 'enalapril embarazo', 'labetalol embarazo', 'preeclampsia', 'hipertensión lactancia'],
  },
  {
    titulo: 'HTA en el adulto mayor y la persona frágil',
    duracion: 20,
    gancho: {
      titulo: 'El mareo que no era de la edad',
      texto: 'Una paciente de 86 años con hipertensión y tres fármacos se levanta mareada y ha tenido dos caídas. La presión sentada es 128/76, pero de pie es 98/60. El problema no es la edad: es la hipotensión ortostática por sobretratamiento. La meta debe adaptarse a la fragilidad.',
    },
    objetivos: [
      'Reconocer la hipotensión ortostática.',
      'Individualizar la meta en adultos mayores.',
      'Simplificar y desintensificar cuando sea necesario.',
      'Prevenir caídas y deterioro funcional.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'Ortostatismo', definicion: 'Caída de presión al ponerse de pie; causa mareo y caídas.' },
      { icono: 'Users', termino: 'Fragilidad', definicion: 'Mayor vulnerabilidad a eventos adversos; exige metas menos estrictas.' },
      { icono: 'RefreshCw', termino: 'Desintensificar', definicion: 'Reducir o retirar fármacos cuando el riesgo supera el beneficio.' },
      { icono: 'Target', termino: 'Meta', definicion: 'Presión objetivo adaptada a la tolerancia y la calidad de vida.' },
    ],
    mapa: {
      centro: 'Adulto mayor',
      ramas: [
        { titulo: 'Medir', icono: 'Gauge', nodos: ['Sentado', 'De pie', 'Ortostatismo'] },
        { titulo: 'Meta', icono: 'Target', nodos: ['Menos estricta', 'Tolerancia', 'Caídas'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Simplificar', 'Reducir', 'Evitar'] },
        { titulo: 'Función', icono: 'Users', nodos: ['Marcha', 'Cognición', 'Calidad de vida'] },
      ],
    },
    secciones: [
      {
        titulo: 'Medición y ortostatismo',
        parrafos: [
          'En adultos mayores se mide la presión sentado y de pie, después de uno y tres minutos. Una caída de 20 mmHg sistólica o 10 mmHg diastólica define hipotensión ortostática. Puede ser asintomática o causar mareo, caídas y síncope.',
          'La presión sentada puede parecer controlada mientras la de pie es baja. Si hay síntomas, se revisa el esquema y se reduce la intensidad. La meta no es solo la cifra sentado.',
        ],
      },
      {
        titulo: 'Metas y desintensificación',
        parrafos: [
          'En personas mayores y frágiles, se acepta una meta menos estricta, como <140/90 mmHg o incluso <150/90, según la tolerancia. El objetivo es evitar eventos sin causar hipotensión, caídas o deterioro funcional. La desintensificación puede ser necesaria.',
          'Se revisan los fármacos que causan ortostatismo, como diuréticos, alfa bloqueadores y algunos antidepresivos. La simplificación mejora la adherencia y reduce el riesgo.',
        ],
      },
      {
        titulo: 'Educación y seguimiento',
        parrafos: [
          'La educación incluye levantarse despacio, hidratarse y reportar mareo. Se revisan las caídas y la marcha. La familia o el cuidador deben conocer el plan.',
          'El QF puede medir la presión, revisar la medicación y proponer ajustes. La calidad de vida es parte del resultado.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluación del adulto mayor',
      pasos: [
        { titulo: 'Medir', detalle: 'Sentado y de pie.', icono: 'Gauge', evidencia: 'Registro.' },
        { titulo: 'Evaluar', detalle: 'Síntomas, caídas y fragilidad.', icono: 'Users', evidencia: 'Evaluación.' },
        { titulo: 'Revisar', detalle: 'Fármacos y ortostatismo.', icono: 'Search', evidencia: 'Lista.' },
        { titulo: 'Ajustar', detalle: 'Reducir o simplificar.', icono: 'RefreshCw', evidencia: 'Plan.' },
        { titulo: 'Seguir', detalle: 'Presión, caídas y función.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Mareo al levantarse',
      contexto: 'Paciente de 86 años, presión sentada 128/76, de pie 98/60, dos caídas y tres antihipertensivos.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Aumentar la dosis para bajarla más.', correcta: false, retro: 'Empeora la hipotensión ortostática.' },
        { texto: 'Revisar y reducir el esquema, con meta menos estricta.', correcta: true, retro: 'La seguridad y las caídas son prioritarias.' },
        { texto: 'Ignorar la presión de pie.', correcta: false, retro: 'La ortostatismo es un riesgo de caídas.' },
      ],
    },
    errores: [
      { error: 'Medir solo sentado.', correccion: 'Medir de pie para detectar ortostatismo.' },
      { error: 'Aplicar metas estrictas en fragilidad.', correccion: 'Individualizar.' },
      { error: 'No revisar fármacos que causan mareo.', correccion: 'Simplificar y ajustar.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es hipotensión ortostática?', respuesta: 'Caída de 20/10 mmHg al ponerse de pie.' },
      { pregunta: '¿Qué meta se acepta en fragilidad?', respuesta: 'Menos estricta, según tolerancia.' },
      { pregunta: '¿Qué se previene?', respuesta: 'Caídas, síncope y deterioro funcional.' },
    ],
    resumen: [
      'Medir sentado y de pie.',
      'La meta es individualizada.',
      'La desintensificación puede ser necesaria.',
      'La calidad de vida es el objetivo.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'Organización Mundial de la Salud. Hipertensión: datos y cifras.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de ortostatismo', descripcion: 'Paciente mayor midiendo la presión sentado y de pie, con una flecha de caída.', alt: 'Hipotensión ortostática en el adulto mayor' },
    ],
    keywords: ['hipertensión adulto mayor', 'hipotensión ortostática', 'meta presión anciano', 'desintensificación hipertensión'],
  },
  {
    titulo: 'Crisis hipertensivas: emergencia hipertensiva frente a hipertensión grave sin daño agudo de órgano',
    duracion: 25,
    gancho: {
      titulo: 'La presión 220/120 que no siempre es emergencia',
      texto: 'Un paciente llega con presión 220/120 mmHg y se siente bien. Otro llega con 180/110 y dolor torácico. La cifra impresiona, pero lo que define la emergencia es el daño agudo de órgano, no solo el número. Bajar la presión demasiado rápido en el paciente asintomático puede causar isquemia.',
    },
    objetivos: [
      'Diferenciar emergencia hipertensiva de hipertensión grave sin daño agudo.',
      'Reconocer los signos de daño de órgano.',
      'Aplicar el manejo inicial y la derivación.',
      'Evitar el descenso brusco de la presión.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Emergencia', definicion: 'Presión muy alta con daño agudo de órgano: encefalopatía, ictus, infarto, edema pulmonar, disección o eclampsia.' },
      { icono: 'Gauge', termino: 'Hipertensión grave', definicion: 'Presión muy alta sin daño agudo; requiere control gradual.' },
      { icono: 'Activity', termino: 'Daño de órgano', definicion: 'Isquemia, hemorragia, edema o disfunción aguda.' },
      { icono: 'ShieldCheck', termino: 'Descenso', definicion: 'En emergencia, reducción controlada; en hipertensión grave, ambulatoria.' },
    ],
    mapa: {
      centro: 'Crisis hipertensiva',
      ramas: [
        { titulo: 'Emergencia', icono: 'AlertTriangle', nodos: ['Daño agudo', 'IV', 'UCI'] },
        { titulo: 'Grave', icono: 'Gauge', nodos: ['Sin daño', 'Oral', 'Seguimiento'] },
        { titulo: 'Órganos', icono: 'Activity', nodos: ['Cerebro', 'Corazón', 'Riñón', 'Aorta'] },
        { titulo: 'Errores', icono: 'XCircle', nodos: ['Bajar rápido', 'Nifedipino sublingual'] },
      ],
    },
    secciones: [
      {
        titulo: 'Emergencia versus grave',
        parrafos: [
          'La emergencia hipertensiva es una presión muy elevada con daño agudo de órgano: encefalopatía, ictus, síndrome coronario agudo, edema pulmonar, disección aórtica, insuficiencia renal aguda o eclampsia. Requiere tratamiento intravenoso y monitorización.',
          'La hipertensión grave sin daño agudo de órgano no requiere descenso inmediato. Se trata de forma ambulatoria, con control gradual y seguimiento. Bajar la presión rápido puede causar hipoperfusión cerebral, renal o coronaria.',
        ],
      },
      {
        titulo: 'Evaluación',
        parrafos: [
          'Se busca daño de órgano con síntomas, examen neurológico, ECG, troponina, creatinina, orina y fondo de ojo según el caso. La cifra aislada no define la gravedad. Un paciente asintomático con 220/120 puede tener hipertensión grave, no emergencia.',
          'La disección aórtica y la eclampsia son emergencias con objetivos específicos. El manejo debe ser hospitalario y coordinado.',
        ],
      },
      {
        titulo: 'Errores y educación',
        parrafos: [
          'El nifedipino sublingual y el descenso brusco no se recomiendan. La vía oral se usa en hipertensión grave sin daño agudo, con control en días. La educación incluye adherencia, medición y signos de alarma.',
          'El QF puede detectar una crisis en la farmacia, medir la presión y derivar. No debe intentar normalizar la cifra de inmediato.',
        ],
      },
    ],
    proceso: {
      titulo: 'Abordaje de una crisis',
      pasos: [
        { titulo: 'Medir', detalle: 'Presión y síntomas.', icono: 'Gauge', evidencia: 'Registro.' },
        { titulo: 'Buscar daño', detalle: 'Neurológico, cardiaco, renal y ocular.', icono: 'Search', evidencia: 'Evaluación.' },
        { titulo: 'Clasificar', detalle: 'Emergencia o hipertensión grave.', icono: 'AlertTriangle', evidencia: 'Categoría.' },
        { titulo: 'Derivar', detalle: 'Emergencia a urgencias.', icono: 'Route', evidencia: 'Remisión.' },
        { titulo: 'Seguir', detalle: 'Control gradual y adherencia.', icono: 'CalendarClock', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: '220/120 asintomático',
      contexto: 'Paciente con presión 220/120, sin dolor torácico, sin síntomas neurológicos, creatinina normal.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Bajar la presión a 120/80 en una hora.', correcta: false, retro: 'El descenso brusco puede causar isquemia.' },
        { texto: 'Tratamiento oral, control gradual y seguimiento; buscar daño de órgano.', correcta: true, retro: 'Sin daño agudo, no es emergencia.' },
        { texto: 'Nifedipino sublingual.', correcta: false, retro: 'No se recomienda por hipotensión brusca.' },
      ],
    },
    errores: [
      { error: 'Confundir cifra alta con emergencia.', correccion: 'El daño de órgano define la emergencia.' },
      { error: 'Bajar rápido sin daño agudo.', correccion: 'Riesgo de isquemia.' },
      { error: 'Usar nifedipino sublingual.', correccion: 'No recomendado.' },
    ],
    comprueba: [
      { pregunta: '¿Qué define una emergencia?', respuesta: 'Daño agudo de órgano.' },
      { pregunta: '¿Qué se hace en hipertensión grave sin daño?', respuesta: 'Control oral gradual y seguimiento.' },
      { pregunta: '¿Qué fármaco se evita?', respuesta: 'Nifedipino sublingual.' },
    ],
    resumen: [
      'La emergencia tiene daño de órgano.',
      'La cifra aislada no basta.',
      'El descenso es gradual.',
      'La derivación oportuna salva vidas.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'Organización Mundial de la Salud. Hipertensión: datos y cifras.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de clasificación', descripcion: 'Dos escenarios: emergencia con daño de órgano y presión grave sin daño, con conductas distintas.', alt: 'Emergencia hipertensiva versus hipertensión grave' },
    ],
    keywords: ['crisis hipertensiva', 'emergencia hipertensiva', 'hipertensión grave', 'nifedipino sublingual', 'daño de órgano hipertensión'],
  },
  {
    titulo: 'Caso: HTA aparentemente resistente en un paciente con diabetes y enfermedad renal crónica',
    duracion: 25,
    gancho: {
      titulo: 'La resistencia que era otra cosa',
      texto: 'Un paciente con diabetes, ERC y presión 156/94 toma cuatro fármacos. La adherencia es irregular, usa un AINE para el dolor y no ha medido la presión en casa. Antes de añadir un quinto fármaco, hay que resolver la pseudorresistencia y revisar la nefroprotección.',
    },
    objetivos: [
      'Diferenciar resistencia verdadera de pseudorresistencia.',
      'Revisar adherencia, medición y fármacos.',
      'Ajustar el esquema en ERC y diabetes.',
      'Coordinar la derivación y el seguimiento.',
    ],
    conceptos: [
      { icono: 'Search', termino: 'Pseudorresistencia', definicion: 'Falta de control por adherencia, técnica, bata blanca o fármacos.' },
      { icono: 'AlertTriangle', termino: 'AINE', definicion: 'Puede elevar la presión y dañar el riñón, sobre todo con IECA/ARA-II y diurético.' },
      { icono: 'Droplets', termino: 'ERC', definicion: 'Requiere ajuste y control de potasio.' },
      { icono: 'Pill', termino: 'Cuarta línea', definicion: 'Espironolactona si no hay hiperpotasemia.' },
    ],
    mapa: {
      centro: 'Resistencia aparente',
      ramas: [
        { titulo: 'Adherencia', icono: 'Users', nodos: ['Olvidos', 'Costo', 'Creencias'] },
        { titulo: 'Medición', icono: 'Gauge', nodos: ['Técnica', 'AMPA', 'Bata blanca'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['AINE', 'Descongestionantes', 'Corticoides'] },
        { titulo: 'Riñón', icono: 'Droplets', nodos: ['TFG', 'Potasio', 'Albuminuria'] },
      ],
    },
    secciones: [
      {
        titulo: 'Revisar antes de intensificar',
        parrafos: [
          'La adherencia se explora sin juicio, con preguntas concretas sobre olvidos, costo y efectos. La medición se revisa con técnica y AMPA. Los fármacos que elevan la presión, como AINE, descongestionantes y corticoides, deben identificarse. La bata blanca se confirma con MAPA.',
          'En ERC y diabetes, la presión puede ser difícil de controlar por volumen, albuminuria y rigidez vascular. Se revisan TFG, potasio y albuminuria. La combinación de IECA/ARA-II con iSGLT2 y diurético es frecuente.',
        ],
      },
      {
        titulo: 'Ajustar con seguridad',
        parrafos: [
          'Si hay hiperpotasemia, no se añade espironolactona. Se optimiza el diurético según la TFG y se revisan AINE. La simplificación y la educación mejoran la adherencia. La derivación a hipertensión especializada se considera si no se controla.',
          'La meta es individualizada. En un paciente con ERC y diabetes, <130/80 mmHg es razonable si se tolera.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisan presión, potasio, creatinina, albuminuria y adherencia. La AMPA ayuda a evaluar el control. El QF documenta la intervención y coordina con el equipo.',
          'La resistencia verdadera requiere confirmación y evaluación especializada. La pseudorresistencia es la causa más frecuente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Abordaje de la resistencia',
      pasos: [
        { titulo: 'Confirmar', detalle: 'Adherencia, técnica y AMPA.', icono: 'Gauge', evidencia: 'Confirmación.' },
        { titulo: 'Revisar fármacos', detalle: 'AINE y otros.', icono: 'Search', evidencia: 'Lista.' },
        { titulo: 'Ajustar', detalle: 'Diurético, iSGLT2 y potasio.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Adherencia y automedida.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Derivar', detalle: 'Si no se controla.', icono: 'Route', evidencia: 'Remisión.' },
      ],
    },
    caso: {
      titulo: 'Cuatro fármacos y AINE',
      contexto: 'Paciente con diabetes, ERC, cuatro antihipertensivos, AINE ocasional y presión 156/94.',
      pregunta: '¿Qué hacer primero?',
      opciones: [
        { texto: 'Añadir espironolactona.', correcta: false, retro: 'Hay ERC y posible hiperpotasemia; primero se revisa.' },
        { texto: 'Suspender el AINE, confirmar adherencia y medición, y ajustar el esquema.', correcta: true, retro: 'El AINE y la pseudorresistencia son causas frecuentes.' },
        { texto: 'Duplicar todos los fármacos.', correcta: false, retro: 'No es seguro.' },
      ],
    },
    errores: [
      { error: 'Intensificar sin revisar AINE.', correccion: 'Puede elevar la presión y dañar el riñón.' },
      { error: 'No confirmar adherencia.', correccion: 'La pseudorresistencia es frecuente.' },
      { error: 'Usar espironolactona con potasio alto.', correccion: 'Riesgo de hiperpotasemia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es pseudorresistencia?', respuesta: 'Falta de control por adherencia, técnica o fármacos.' },
      { pregunta: '¿Qué fármaco debe revisarse?', respuesta: 'AINE y descongestionantes.' },
      { pregunta: '¿Cuándo derivar?', respuesta: 'Si la resistencia es verdadera o hay causa secundaria.' },
    ],
    resumen: [
      'La pseudorresistencia es frecuente.',
      'El AINE eleva la presión y daña el riñón.',
      'La ERC exige ajuste y control de potasio.',
      'La derivación es oportuna.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'KDIGO. 2021 Clinical Practice Guideline for the Management of Blood Pressure in Chronic Kidney Disease.', url: 'https://kdigo.org/guidelines/blood-pressure-in-ckd/' },
    ],
    imagenes: [
      { ubicacion: 'Sección del caso', descripcion: 'Paciente con cuatro medicamentos, un AINE y una tabla de presión sin control.', alt: 'Caso de hipertensión aparentemente resistente' },
    ],
    keywords: ['hipertensión resistente ERC', 'AINE hipertensión', 'pseudorresistencia', 'caso clínico hipertensión diabetes'],
  },
  {
    titulo: 'Introducción a la unidad: el servicio farmacéutico y el trabajo en equipo en el control de la HTA',
    duracion: 20,
    gancho: {
      titulo: 'El control no depende de una sola persona',
      texto: 'Un paciente con hipertensión pasa por el médico, la enfermera, el laboratorio, la farmacia y su familia. Si cada uno trabaja por separado, se pierden oportunidades. El servicio farmacéutico puede coordinar educación, adherencia y seguimiento, y contribuir a que el control sea sostenible.',
    },
    objetivos: [
      'Describir el papel del servicio farmacéutico en HTA.',
      'Reconocer las funciones del equipo de salud.',
      'Identificar oportunidades de coordinación.',
      'Diseñar un proceso de trabajo conjunto.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Equipo', definicion: 'Médico, enfermería, farmacia, laboratorio y paciente trabajando con objetivos comunes.' },
      { icono: 'ClipboardList', termino: 'Proceso', definicion: 'Secuencia de evaluación, intervención y seguimiento.' },
      { icono: 'FileCheck', termino: 'Documentación', definicion: 'Registro que permite coordinar y medir.' },
      { icono: 'Target', termino: 'Meta', definicion: 'Objetivo compartido de control y seguridad.' },
    ],
    mapa: {
      centro: 'Equipo de HTA',
      ramas: [
        { titulo: 'Médico', icono: 'Users', nodos: ['Diagnóstico', 'Prescripción', 'Metas'] },
        { titulo: 'Farmacia', icono: 'Pill', nodos: ['Educación', 'Adherencia', 'Seguimiento'] },
        { titulo: 'Enfermería', icono: 'Activity', nodos: ['Medición', 'Educación', 'Control'] },
        { titulo: 'Paciente', icono: 'Users', nodos: ['Automedida', 'Hábitos', 'Adherencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Roles',
        parrafos: [
          'El médico diagnostica, define la meta y prescribe. Enfermería mide, educa y hace seguimiento. Farmacia revisa la medicación, detecta problemas, educa y apoya la adherencia. El laboratorio aporta TFG, electrolitos y albuminuria. El paciente es el centro y el responsable de sus hábitos.',
          'La coordinación evita duplicidades y errores. Un sistema de registro compartido y reuniones periódicas mejoran la continuidad.',
        ],
      },
      {
        titulo: 'Procesos',
        parrafos: [
          'El servicio farmacéutico puede establecer un proceso de tamizaje, educación y seguimiento. Incluye medición, revisión de medicamentos, detección de barreras y derivación. La documentación permite medir resultados.',
          'La farmacia comunitaria y la hospitalaria tienen roles distintos, pero comparten el objetivo de seguridad y adherencia.',
        ],
      },
      {
        titulo: 'Calidad',
        parrafos: [
          'Los indicadores incluyen porcentaje de pacientes con presión controlada, adherencia, eventos adversos y satisfacción. La medición permite mejorar.',
          'El QF puede liderar la educación y la revisión de la medicación. La comunicación con el equipo es clave.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo coordinar el cuidado',
      pasos: [
        { titulo: 'Definir roles', detalle: 'Quién hace cada tarea.', icono: 'Users', evidencia: 'Acuerdo.' },
        { titulo: 'Compartir datos', detalle: 'Presión, medicamentos y resultados.', icono: 'FileCheck', evidencia: 'Registro.' },
        { titulo: 'Intervenir', detalle: 'Educar, ajustar o derivar.', icono: 'Pill', evidencia: 'Nota.' },
        { titulo: 'Medir', detalle: 'Indicadores de control y seguridad.', icono: 'LineChart', evidencia: 'Informe.' },
        { titulo: 'Mejorar', detalle: 'Revisar el proceso.', icono: 'RefreshCw', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: 'Paciente sin control',
      contexto: 'Paciente con presión alta recurrente, mala adherencia y múltiples médicos.',
      pregunta: '¿Qué aporta la farmacia?',
      opciones: [
        { texto: 'Solo dispensar.', correcta: false, retro: 'La farmacia puede detectar problemas y coordinar.' },
        { texto: 'Revisar la medicación, educar, detectar barreras y comunicar al equipo.', correcta: true, retro: 'La coordinación mejora el control.' },
        { texto: 'Cambiar el tratamiento sin consultar.', correcta: false, retro: 'La prescripción corresponde al médico.' },
      ],
    },
    errores: [
      { error: 'Trabajar aislado.', correccion: 'La coordinación mejora resultados.' },
      { error: 'No documentar.', correccion: 'Sin registro no hay continuidad.' },
      { error: 'Asumir roles que no corresponden.', correccion: 'Cada profesional aporta desde su competencia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué aporta farmacia?', respuesta: 'Revisión, educación, adherencia y seguimiento.' },
      { pregunta: '¿Qué aporta enfermería?', respuesta: 'Medición, educación y control.' },
      { pregunta: '¿Qué se mide?', respuesta: 'Control, adherencia, seguridad y satisfacción.' },
    ],
    resumen: [
      'El control es un trabajo de equipo.',
      'La farmacia aporta revisión y educación.',
      'La documentación da continuidad.',
      'Los indicadores permiten mejorar.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'Organización Mundial de la Salud. Hipertensión: datos y cifras.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de roles', descripcion: 'Equipo de salud alrededor de un paciente con hipertensión, con roles conectados.', alt: 'Trabajo en equipo en el control de la hipertensión' },
    ],
    keywords: ['servicio farmacéutico hipertensión', 'trabajo en equipo hipertensión', 'atención farmacéutica HTA'],
  },
  {
    titulo: 'Adherencia al tratamiento antihipertensivo: medición, barreras e intervenciones',
    duracion: 25,
    gancho: {
      titulo: 'La pastilla que no se toma',
      texto: 'Un paciente con presión alta dice que “a veces” olvida la pastilla. En la entrevista descubre que no puede pagar los tres medicamentos y que uno le da mareo. La no adherencia no es falta de voluntad: es un problema con causas que se pueden identificar y resolver. La entrevista, la simplificación y la resolución de barreras son herramientas más útiles que el regaño. La adherencia se evalúa en cada contacto y se adapta al contexto del paciente.',
    },
    objetivos: [
      'Medir la adherencia con métodos prácticos.',
      'Identificar barreras.',
      'Aplicar intervenciones efectivas.',
      'Evaluar el impacto en la presión.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Adherencia', definicion: 'Grado en que el paciente toma el tratamiento según lo acordado.' },
      { icono: 'Search', termino: 'Barrera', definicion: 'Costo, olvido, efectos adversos, creencias o acceso.' },
      { icono: 'Pill', termino: 'Simplificación', definicion: 'Menos tomas y dosis fijas para mejorar el cumplimiento.' },
      { icono: 'LineChart', termino: 'Medición', definicion: 'Entrevista, registro, conteo o farmacia.' },
    ],
    mapa: {
      centro: 'Adherencia',
      ramas: [
        { titulo: 'Medir', icono: 'Search', nodos: ['Entrevista', 'Registro', 'Conteo'] },
        { titulo: 'Barreras', icono: 'Users', nodos: ['Costo', 'Olvido', 'Efectos'] },
        { titulo: 'Intervenir', icono: 'Lightbulb', nodos: ['Simplificar', 'Recordatorios', 'Educar'] },
        { titulo: 'Evaluar', icono: 'LineChart', nodos: ['Presión', 'Refills', 'Satisfacción'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo medir',
        parrafos: [
          'La entrevista es el primer método. Preguntar “¿cuántas dosis olvidó la última semana?” es más útil que “¿toma el tratamiento?”. El registro de presión, el conteo de comprimidos y los refills ayudan. Ningún método es perfecto.',
          'La no adherencia puede ser intencional (creencias, miedo) o no intencional (olvido, costo, complejidad). La distinción guía la intervención.',
        ],
      },
      {
        titulo: 'Barreras e intervenciones',
        parrafos: [
          'Las barreras incluyen costo, cobertura, número de pastillas, horarios, efectos adversos y falta de comprensión. Las intervenciones incluyen simplificación, dosis fija, recordatorios, educación y resolución de barreras de acceso.',
          'La entrevista motivacional y el acuerdo de metas mejoran la adherencia. No se debe culpar al paciente.',
        ],
      },
      {
        titulo: 'Evaluación',
        parrafos: [
          'Se evalúa la presión, los refills y la satisfacción. La adherencia es un proceso dinámico. La revisión periódica permite ajustar.',
          'El QF puede liderar la intervención y documentar. La coordinación con el equipo es clave.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo mejorar la adherencia',
      pasos: [
        { titulo: 'Preguntar', detalle: 'Olvidos, costo y efectos.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Identificar', detalle: 'Barrera principal.', icono: 'Search', evidencia: 'Diagnóstico.' },
        { titulo: 'Intervenir', detalle: 'Simplificar, educar o resolver acceso.', icono: 'Lightbulb', evidencia: 'Plan.' },
        { titulo: 'Acordar', detalle: 'Meta y recordatorios.', icono: 'Target', evidencia: 'Acuerdo.' },
        { titulo: 'Evaluar', detalle: 'Presión y refills.', icono: 'LineChart', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Tres medicamentos y costo',
      contexto: 'Paciente con tres antihipertensivos, olvidos y dificultad para pagar.',
      pregunta: '¿Qué intervención es más útil?',
      opciones: [
        { texto: 'Regañar por no cumplir.', correcta: false, retro: 'No resuelve la causa.' },
        { texto: 'Buscar una combinación cubierta y simplificar el esquema.', correcta: true, retro: 'Resolver la barrera mejora la adherencia.' },
        { texto: 'Añadir otro fármaco.', correcta: false, retro: 'No mejora la adherencia.' },
      ],
    },
    errores: [
      { error: 'Asumir que el paciente no quiere.', correccion: 'Explorar barreras.' },
      { error: 'No preguntar por efectos adversos.', correccion: 'Pueden causar abandono.' },
      { error: 'No simplificar.', correccion: 'Menos tomas mejora la adherencia.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo se mide la adherencia?', respuesta: 'Entrevista, registro, conteo y refills.' },
      { pregunta: '¿Qué barreras son frecuentes?', respuesta: 'Costo, olvido, efectos y complejidad.' },
      { pregunta: '¿Qué intervención ayuda?', respuesta: 'Simplificación, educación y acceso.' },
    ],
    resumen: [
      'La adherencia tiene causas.',
      'La entrevista es clave.',
      'Simplificar y resolver barreras.',
      'Medir presión y refills.',
    ],
    referencias: [
      { cita: 'Organización Mundial de la Salud. Adherence to long-term therapies: evidence for action. Ginebra: OMS; 2003.', url: 'https://www.who.int/publications/i/item/9789241549028' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de barreras', descripcion: 'Paciente con tres frascos, un reloj y una calculadora de costos.', alt: 'Adherencia al tratamiento antihipertensivo' },
    ],
    keywords: ['adherencia antihipertensivos', 'barreras adherencia', 'simplificación tratamiento', 'medición adherencia'],
  },
  {
    titulo: 'Educación al paciente: automedida de la PA, sal, potasio y estilo de vida',
    duracion: 20,
    gancho: {
      titulo: 'La sal que no se ve',
      texto: 'Un paciente cree que no consume sal porque no usa el salero, pero come embutidos, caldos y pan. La educación no es decir “baje la sal”: es ayudar a identificar las fuentes, medir la presión en casa y entender el tratamiento. La educación práctica mejora el control.',
    },
    objetivos: [
      'Enseñar la automedida de la presión.',
      'Identificar fuentes de sal.',
      'Explicar el potasio y el estilo de vida.',
      'Diseñar un plan educativo realista.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'AMPA', definicion: 'Automedida domiciliaria con dispositivo validado.' },
      { icono: 'Wheat', termino: 'Sal oculta', definicion: 'Sodio en alimentos procesados, pan, embutidos y condimentos.' },
      { icono: 'Droplets', termino: 'Potasio', definicion: 'Suplementos y alimentos ricos en potasio requieren control en ERC o con SRAA.' },
      { icono: 'Activity', termino: 'Estilo de vida', definicion: 'Dieta, ejercicio, peso, alcohol y sueño.' },
    ],
    mapa: {
      centro: 'Educación',
      ramas: [
        { titulo: 'Medir', icono: 'Gauge', nodos: ['Técnica', 'Horario', 'Registro'] },
        { titulo: 'Sal', icono: 'Wheat', nodos: ['Etiquetas', 'Procesados', 'Condimentos'] },
        { titulo: 'Potasio', icono: 'Droplets', nodos: ['Alimentos', 'Suplementos', 'ERC'] },
        { titulo: 'Estilo', icono: 'Activity', nodos: ['Ejercicio', 'Peso', 'Alcohol'] },
      ],
    },
    secciones: [
      {
        titulo: 'Automedida',
        parrafos: [
          'La AMPA se hace con un dispositivo validado, sentado, con reposo y manguito adecuado. Se toman dos lecturas por la mañana y dos por la noche durante varios días. El promedio ayuda a evaluar el control y evitar decisiones basadas en una sola cifra.',
          'El QF puede enseñar la técnica, revisar el dispositivo y ayudar a interpretar los registros. La automedida empodera al paciente.',
        ],
      },
      {
        titulo: 'Sal y potasio',
        parrafos: [
          'La reducción de sodio disminuye la presión. La sal oculta está en pan, embutidos, caldos, salsas y alimentos procesados. Leer etiquetas y cocinar en casa ayuda. No se debe eliminar el potasio de la dieta sin razón; en ERC o con SRAA, se controla.',
          'Los suplementos de potasio y las sales de reemplazo pueden ser peligrosos en ERC o con IECA/ARA-II. Se revisan con el equipo.',
        ],
      },
      {
        titulo: 'Estilo de vida',
        parrafos: [
          'La actividad física regular, la pérdida de peso, la reducción de alcohol y el sueño adecuado ayudan. La dieta rica en frutas, verduras, legumbres y cereales integrales es recomendable, con ajuste en ERC.',
          'La educación debe ser realista y adaptada a la cultura y al presupuesto. El QF puede acordar metas pequeñas y medibles.',
        ],
      },
    ],
    proceso: {
      titulo: 'Plan educativo',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Conocimientos, hábitos y barreras.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Enseñar', detalle: 'Técnica, sal y potasio.', icono: 'GraduationCap', evidencia: 'Educación.' },
        { titulo: 'Acordar', detalle: 'Una meta pequeña.', icono: 'Target', evidencia: 'Acuerdo.' },
        { titulo: 'Registrar', detalle: 'Presión y hábitos.', icono: 'ClipboardList', evidencia: 'Registro.' },
        { titulo: 'Revisar', detalle: 'Progreso y ajustes.', icono: 'CalendarClock', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'No usa salero pero come embutidos',
      contexto: 'Paciente con presión alta que dice no usar sal, pero consume embutidos y caldos a diario.',
      pregunta: '¿Qué educación es más útil?',
      opciones: [
        { texto: 'Decirle que no coma sal.', correcta: false, retro: 'No identifica la sal oculta.' },
        { texto: 'Enseñar a leer etiquetas y reducir procesados, con una meta concreta.', correcta: true, retro: 'La educación práctica mejora el control.' },
        { texto: 'Indicar un diurético sin educación.', correcta: false, retro: 'No aborda el hábito.' },
      ],
    },
    errores: [
      { error: 'Hablar solo de salero.', correccion: 'La sal oculta es la principal fuente.' },
      { error: 'Recomendar suplementos de potasio sin control.', correccion: 'Riesgo en ERC y con SRAA.' },
      { error: 'Metas poco realistas.', correccion: 'Acordar cambios pequeños.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo se hace la AMPA?', respuesta: 'Dos lecturas mañana y noche, varios días, con técnica correcta.' },
      { pregunta: '¿Dónde está la sal oculta?', respuesta: 'Pan, embutidos, caldos, salsas y procesados.' },
      { pregunta: '¿Qué se controla con potasio?', respuesta: 'ERC y fármacos que retienen potasio.' },
    ],
    resumen: [
      'La AMPA empodera al paciente.',
      'La sal oculta es clave.',
      'El potasio se individualiza.',
      'Las metas deben ser realistas.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'Organización Mundial de la Salud. Hipertensión: datos y cifras.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de sal', descripcion: 'Etiquetas de alimentos con sodio resaltado y un plato con alimentos frescos.', alt: 'Educación sobre sal oculta y presión arterial' },
    ],
    keywords: ['educación hipertensión', 'automedida presión arterial', 'sal oculta hipertensión', 'potasio hipertensión', 'estilo de vida hipertensión'],
  },
  {
    titulo: 'Seguimiento farmacoterapéutico en HTA: problemas relacionados con medicamentos e indicadores',
    duracion: 25,
    gancho: {
      titulo: 'La consulta que detecta lo que la receta no ve',
      texto: 'Un paciente con hipertensión vuelve cada mes a la farmacia. En la entrevista se detecta que toma el diurético por la noche, se levanta tres veces a orinar y duerme mal; además, usa un descongestionante para la gripa. El seguimiento farmacoterapéutico identifica estos problemas y mejora el control. El registro y la medición de indicadores permiten demostrar el valor del servicio y ajustar el plan. La documentación también facilita la coordinación con el equipo tratante.',
    },
    objetivos: [
      'Aplicar el seguimiento farmacoterapéutico en HTA.',
      'Identificar problemas relacionados con medicamentos.',
      'Documentar y medir indicadores.',
      'Coordinar intervenciones.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Seguimiento', definicion: 'Proceso continuo de evaluación, intervención y monitoreo.' },
      { icono: 'ClipboardList', termino: 'PRM', definicion: 'Problema de necesidad, efectividad, seguridad o adherencia.' },
      { icono: 'FileCheck', termino: 'Documentación', definicion: 'Registro de la intervención y el resultado.' },
      { icono: 'LineChart', termino: 'Indicador', definicion: 'Medida de control, seguridad o proceso.' },
    ],
    mapa: {
      centro: 'Seguimiento en HTA',
      ramas: [
        { titulo: 'Evaluar', icono: 'Search', nodos: ['Presión', 'Medicamentos', 'Síntomas'] },
        { titulo: 'PRM', icono: 'AlertTriangle', nodos: ['Dosis', 'Interacción', 'Adherencia'] },
        { titulo: 'Intervenir', icono: 'Lightbulb', nodos: ['Educar', 'Ajustar', 'Derivar'] },
        { titulo: 'Medir', icono: 'LineChart', nodos: ['Control', 'Eventos', 'Satisfacción'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'La evaluación incluye presión, medicamentos, síntomas, adherencia, hábitos y barreras. Se revisan indicaciones, dosis, interacciones y efectos adversos. La entrevista debe ser estructurada y respetuosa.',
          'Los problemas frecuentes incluyen dosis baja, fármaco no indicado, interacción con AINE, horario inadecuado y falta de acceso. La documentación permite seguirlos.',
        ],
      },
      {
        titulo: 'Intervención',
        parrafos: [
          'Las intervenciones incluyen educación, ajuste de horario, simplificación, cambio de fármaco y derivación. Se acuerdan metas y se registra la respuesta. La comunicación con el equipo es clave.',
          'El QF no prescribe, pero puede proponer y educar. La intervención se documenta con datos.',
        ],
      },
      {
        titulo: 'Indicadores',
        parrafos: [
          'Los indicadores incluyen porcentaje de pacientes con presión controlada, adherencia, eventos adversos, intervenciones aceptadas y satisfacción. La medición demuestra el valor del servicio.',
          'La revisión periódica permite mejorar el proceso y la calidad.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ciclo de seguimiento',
      pasos: [
        { titulo: 'Entrevistar', detalle: 'Presión, medicamentos y hábitos.', icono: 'Users', evidencia: 'Ficha.' },
        { titulo: 'Detectar', detalle: 'PRM y barreras.', icono: 'Search', evidencia: 'Diagnóstico.' },
        { titulo: 'Intervenir', detalle: 'Educar, ajustar o derivar.', icono: 'Lightbulb', evidencia: 'Nota.' },
        { titulo: 'Documentar', detalle: 'Registrar y comunicar.', icono: 'FileCheck', evidencia: 'Registro.' },
        { titulo: 'Medir', detalle: 'Indicadores y seguimiento.', icono: 'LineChart', evidencia: 'Informe.' },
      ],
    },
    caso: {
      titulo: 'Diurético por la noche',
      contexto: 'Paciente con hidroclorotiazida por la noche, nicturia y mal sueño.',
      pregunta: '¿Qué intervención es útil?',
      opciones: [
        { texto: 'Suspender el diurético.', correcta: false, retro: 'Se puede cambiar el horario.' },
        { texto: 'Cambiar el horario a la mañana y educar.', correcta: true, retro: 'La nicturia mejora y la adherencia también.' },
        { texto: 'Añadir otro diurético.', correcta: false, retro: 'No es necesario.' },
      ],
    },
    errores: [
      { error: 'No preguntar por horarios.', correccion: 'Afectan la adherencia y los síntomas.' },
      { error: 'No documentar.', correccion: 'Sin registro no hay seguimiento.' },
      { error: 'No medir resultados.', correccion: 'Los indicadores demuestran el valor.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es un PRM?', respuesta: 'Problema de necesidad, efectividad, seguridad o adherencia.' },
      { pregunta: '¿Qué se documenta?', respuesta: 'Problema, intervención y resultado.' },
      { pregunta: '¿Qué indicadores se usan?', respuesta: 'Control, adherencia, eventos y satisfacción.' },
    ],
    resumen: [
      'El seguimiento detecta problemas.',
      'La intervención se documenta.',
      'Los indicadores miden el valor.',
      'La coordinación es clave.',
    ],
    referencias: [
      { cita: 'Cipolle RJ, Strand LM, Morley PC. Pharmaceutical care practice: the patient-centered approach to medication management services. 3.ª ed. Nueva York: McGraw-Hill Medical; 2012.', url: 'https://www.mhprofessional.com/pharmaceutical-care-practice-9780071759029-usa' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección del ciclo', descripcion: 'Ciclo de seguimiento con ficha, entrevista y gráfico de presión.', alt: 'Seguimiento farmacoterapéutico en hipertensión' },
    ],
    keywords: ['seguimiento farmacoterapéutico hipertensión', 'problemas relacionados con medicamentos HTA', 'indicadores atención farmacéutica'],
  },
  {
    titulo: 'Interacciones y reacciones adversas relevantes: AINE, potasio, litio y la «triple amenaza»',
    duracion: 25,
    gancho: {
      titulo: 'La triple amenaza',
      texto: 'Un paciente mayor toma IECA, diurético y un AINE para el dolor de rodilla. La combinación puede causar insuficiencia renal aguda e hiperpotasemia. Se conoce como “triple amenaza” y es una de las interacciones más peligrosas en hipertensión. Detectarla a tiempo evita hospitalizaciones.',
    },
    objetivos: [
      'Reconocer la triple amenaza.',
      'Identificar interacciones con potasio y litio.',
      'Aplicar medidas de prevención.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Triple amenaza', definicion: 'AINE + IECA/ARA-II + diurético; riesgo de daño renal e hiperpotasemia.' },
      { icono: 'Droplets', termino: 'Potasio', definicion: 'Suplementos, sal de reemplazo y fármacos que retienen potasio.' },
      { icono: 'Activity', termino: 'Litio', definicion: 'Los diuréticos y el SRAA pueden aumentar sus niveles y toxicidad.' },
      { icono: 'ShieldCheck', termino: 'Prevención', definicion: 'Revisar medicamentos, hidratación y controles.' },
    ],
    mapa: {
      centro: 'Interacciones',
      ramas: [
        { titulo: 'AINE', icono: 'AlertTriangle', nodos: ['Riñón', 'Presión', 'Triple amenaza'] },
        { titulo: 'Potasio', icono: 'Droplets', nodos: ['Suplementos', 'SRAA', 'ERC'] },
        { titulo: 'Litio', icono: 'Activity', nodos: ['Tiazida', 'Niveles', 'Toxicidad'] },
        { titulo: 'Otros', icono: 'Pill', nodos: ['Descongestionantes', 'Corticoides', 'Anticonceptivos'] },
      ],
    },
    secciones: [
      {
        titulo: 'AINE y triple amenaza',
        parrafos: [
          'Los AINE reducen la filtración glomerular y retienen sodio y potasio. Con IECA/ARA-II y diurético, el riesgo de insuficiencia renal aguda e hiperpotasemia aumenta. Se debe evitar la combinación, especialmente en adultos mayores y ERC.',
          'Si el paciente necesita un analgésico, se prefiere paracetamol o una alternativa según el caso. Se revisa la hidratación y la función renal.',
        ],
      },
      {
        titulo: 'Potasio y litio',
        parrafos: [
          'Los suplementos de potasio y las sales de reemplazo pueden causar hiperpotasemia con IECA/ARA-II o espironolactona. Se revisan con el equipo. El litio puede aumentar con tiazidas y con el bloqueo del SRAA; se controlan niveles y síntomas de toxicidad.',
          'Los descongestionantes, corticoides y anticonceptivos pueden elevar la presión. Se revisan en la entrevista.',
        ],
      },
      {
        titulo: 'Prevención y educación',
        parrafos: [
          'La prevención incluye revisar todos los medicamentos, incluidos los de venta libre, y educar sobre el riesgo. Se controlan creatinina y potasio después de cambios.',
          'El QF puede detectar la interacción en la dispensación y proponer una alternativa. La comunicación con el equipo es clave.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo detectar la triple amenaza',
      pasos: [
        { titulo: 'Revisar', detalle: 'AINE, IECA/ARA-II y diurético.', icono: 'Search', evidencia: 'Lista.' },
        { titulo: 'Evaluar', detalle: 'Edad, ERC, hidratación y potasio.', icono: 'Droplets', evidencia: 'Evaluación.' },
        { titulo: 'Intervenir', detalle: 'Evitar AINE o cambiar.', icono: 'AlertTriangle', evidencia: 'Nota.' },
        { titulo: 'Controlar', detalle: 'Creatinina y potasio.', icono: 'LineChart', evidencia: 'Resultados.' },
        { titulo: 'Educar', detalle: 'No automedicarse.', icono: 'Users', evidencia: 'Educación.' },
      ],
    },
    caso: {
      titulo: 'Dolor de rodilla y triple amenaza',
      contexto: 'Paciente mayor con enalapril, hidroclorotiazida y naproxeno por dolor de rodilla.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Mantener el naproxeno.', correcta: false, retro: 'La combinación es peligrosa.' },
        { texto: 'Proponer suspender el AINE y usar una alternativa, con control de función renal y potasio.', correcta: true, retro: 'Se evita la triple amenaza.' },
        { texto: 'Aumentar el diurético.', correcta: false, retro: 'Empeora el riesgo renal.' },
      ],
    },
    errores: [
      { error: 'No preguntar por AINE de venta libre.', correccion: 'Es una interacción frecuente.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo de hiperpotasemia.' },
      { error: 'Ignorar el litio.', correccion: 'Puede ser tóxico.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la triple amenaza?', respuesta: 'AINE + IECA/ARA-II + diurético.' },
      { pregunta: '¿Qué riesgo tiene?', respuesta: 'Insuficiencia renal e hiperpotasemia.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Creatinina y potasio.' },
    ],
    resumen: [
      'La triple amenaza es peligrosa.',
      'El AINE eleva la presión y daña el riñón.',
      'El potasio y el litio requieren control.',
      'La educación sobre venta libre es clave.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'KDIGO. 2021 Clinical Practice Guideline for the Management of Blood Pressure in Chronic Kidney Disease.', url: 'https://kdigo.org/guidelines/blood-pressure-in-ckd/' },
    ],
    imagenes: [
      { ubicacion: 'Sección de triple amenaza', descripcion: 'Tres frascos conectados a un riñón con signo de alerta: AINE, IECA y diurético.', alt: 'Triple amenaza: AINE, IECA y diurético' },
    ],
    keywords: ['triple amenaza hipertensión', 'AINE IECA diurético', 'interacciones antihipertensivos', 'hiperpotasemia IECA', 'litio tiazida'],
  },
];

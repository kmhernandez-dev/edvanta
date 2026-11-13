export const CURSO = 'Curso de Farmacología Cardiovascular';
export const MIGRACION = '145_experiencias_farmacologia_cardiovascular_3.sql';

export const CLASES = [
  {
    titulo: 'Introducción a la unidad: electrofisiología básica y potencial de acción cardiaco',
    duracion: 15,
    gancho: {
      titulo: 'Cinco fases que explican los antiarrítmicos',
      texto: 'Cada antiarrítmico actúa sobre un canal iónico y una fase del potencial de acción. Entender las fases 0 a 4 permite predecir el efecto y el riesgo de proarritmia. La electrofisiología no es teoría: es la base de la seguridad.',
    },
    objetivos: [
      'Describir las fases del potencial de acción.',
      'Reconocer los canales implicados.',
      'Explicar los mecanismos de arritmia.',
      'Relacionar canales y fármacos.',
    ],
    conceptos: [
      { icono: 'Zap', termino: 'Fase 0', definicion: 'Entrada rápida de sodio; despolarización.' },
      { icono: 'Activity', termino: 'Fase 2', definicion: 'Meseta por calcio; contracción.' },
      { icono: 'Timer', termino: 'Fase 3', definicion: 'Salida de potasio; repolarización.' },
      { icono: 'Repeat', termino: 'Reentrada', definicion: 'Circuito que perpetúa la arritmia.' },
    ],
    mapa: {
      centro: 'Potencial de acción',
      ramas: [
        { titulo: 'Fases', icono: 'LineChart', nodos: ['0 sodio', '2 calcio', '3 potasio', '4 reposo'] },
        { titulo: 'Canales', icono: 'Network', nodos: ['Na', 'Ca', 'K', 'If'] },
        { titulo: 'Mecanismos', icono: 'Repeat', nodos: ['Automatismo', 'Reentrada', 'Postdespolarización'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Clase I', 'II', 'III', 'IV'] },
      ],
    },
    secciones: [
      {
        titulo: 'El potencial de acción',
        parrafos: [
          'En las células cardíacas contractiles, la fase 0 es la despolarización rápida por entrada de sodio. La fase 1 es una repolarización inicial breve. La fase 2 es la meseta, en la que entra calcio y se acopla la contracción. La fase 3 es la repolarización por salida de potasio. La fase 4 es el reposo, mantenido por la bomba sodio-potasio.',
          'En las células marcapaso del nodo sinusal, la fase 4 no es plana: una corriente de sodio y calcio (If y otras) genera una despolarización lenta espontánea que inicia el latido. La ivabradina actúa sobre la corriente If y reduce la frecuencia sin afectar la contractilidad.',
        ],
      },
      {
        titulo: 'Mecanismos de arritmia',
        parrafos: [
          'Las arritmias se producen por automatismo anormal, reentrada o actividad desencadenada por postdespolarizaciones. La reentrada requiere un circuito con dos vías con propiedades de conducción y refractariedad diferentes; es el mecanismo de muchas taquicardias y de la fibrilación auricular.',
          'Las postdespolarizaciones tempranas o tardías se asocian con prolongación del QT y con la torsade de pointes. La isquemia, la fibrosis, el estrés y los fármacos modifican estos mecanismos y crean el sustrato para la arritmia.',
        ],
      },
      {
        titulo: 'Del canal al fármaco',
        parrafos: [
          'Los antiarrítmicos de clase I bloquean canales de sodio; los de clase II bloquean receptores beta; los de clase III bloquean canales de potasio y prolongan la repolarización; los de clase IV bloquean canales de calcio. La adenosina y la digoxina actúan sobre el nodo auriculoventricular por mecanismos diferentes.',
          'La clasificación es útil, pero muchos fármacos tienen efectos múltiples. La amiodarona, por ejemplo, bloquea sodio, potasio, calcio y receptores beta. Entender el perfil completo explica sus indicaciones y su toxicidad.',
        ],
      },
    ],
    proceso: {
      titulo: 'Analizar una arritmia',
      pasos: [
        { titulo: 'Identificar', detalle: 'Frecuencia y ritmo.', icono: 'LineChart', evidencia: 'ECG.' },
        { titulo: 'Localizar', detalle: 'Aurícula o ventrículo.', icono: 'Search', evidencia: 'ECG.' },
        { titulo: 'Mecanismo', detalle: 'Reentrada o automatismo.', icono: 'Repeat', evidencia: 'Juicio.' },
        { titulo: 'Elegir', detalle: 'Clase y fármaco.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Vigilar', detalle: 'QT y proarritmia.', icono: 'AlertTriangle', evidencia: 'ECG.' },
      ],
    },
    caso: {
      titulo: 'Taquicardia de reentrada',
      contexto: 'Paciente con taquicardia regular y QRS estrecho, sin inestabilidad.',
      pregunta: '¿Qué mecanismo es más probable?',
      opciones: [
        { texto: 'Reentrada auriculoventricular.', correcta: true, retro: 'Es típica del QRS estrecho.' },
        { texto: 'Automatismo ventricular.', correcta: false, retro: 'Produce QRS ancho.' },
        { texto: 'Fibrilación ventricular.', correcta: false, retro: 'No es regular ni estable.' },
      ],
    },
    errores: [
      { error: 'Elegir antiarrítmico sin ver el ECG.', correccion: 'El mecanismo guía la elección.' },
      { error: 'Ignorar el QT basal.', correccion: 'Condiciona la seguridad.' },
      { error: 'Olvidar los efectos múltiples.', correccion: 'La amiodarona no es solo clase III.' },
    ],
    comprueba: [
      { pregunta: '¿Qué ion entra en la fase 0?', respuesta: 'Sodio.' },
      { pregunta: '¿Qué corriente reduce la ivabradina?', respuesta: 'La corriente If.' },
      { pregunta: '¿Qué mecanismo causa torsade?', respuesta: 'Postdespolarizaciones con QT largo.' },
    ],
    resumen: [
      'Las fases del potencial explican los fármacos.',
      'La reentrada es un mecanismo frecuente.',
      'Cada clase actúa en un canal distinto.',
      'El ECG guía la elección y la seguridad.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/' },
    ],
    imagenes: [
      { ubicacion: 'Unidad 4', descripcion: 'Potencial de acción con fases y canales.', alt: 'Electrofisiología y potencial de acción cardiaco' },
    ],
    keywords: ['potencial de acción cardiaco', 'electrofisiología', 'reentrada', 'canales iónicos'],
  },
  {
    titulo: 'Clases I a IV y otros antiarrítmicos (adenosina, digoxina)',
    duracion: 20,
    gancho: {
      titulo: 'La clase que aumentó la mortalidad',
      texto: 'Los antiarrítmicos de clase IC redujeron las arritmias en el estudio CAST, pero aumentaron la mortalidad. El caso enseña que suprimir una arritmia no siempre mejora el pronóstico. La clasificación y el contexto importan.',
    },
    objetivos: [
      'Aplicar la clasificación de Vaughan-Williams.',
      'Reconocer indicaciones y contraindicaciones.',
      'Diferenciar adenosina y digoxina.',
      'Evitar el uso en cardiopatía estructural.',
    ],
    conceptos: [
      { icono: 'Zap', termino: 'Clase I', definicion: 'Bloqueadores de sodio.' },
      { icono: 'Activity', termino: 'Clase II', definicion: 'Betabloqueadores.' },
      { icono: 'Timer', termino: 'Clase III', definicion: 'Bloqueadores de potasio.' },
      { icono: 'Gauge', termino: 'Clase IV', definicion: 'Bloqueadores de calcio.' },
    ],
    mapa: {
      centro: 'Vaughan-Williams',
      ramas: [
        { titulo: 'I', icono: 'Zap', nodos: ['IA', 'IB', 'IC'] },
        { titulo: 'II', icono: 'Activity', nodos: ['Beta'] },
        { titulo: 'III', icono: 'Timer', nodos: ['Amiodarona', 'Sotalol', 'Dronedarona'] },
        { titulo: 'IV y otros', icono: 'Gauge', nodos: ['Verapamilo', 'Adenosina', 'Digoxina'] },
      ],
    },
    secciones: [
      {
        titulo: 'Clases I a IV',
        parrafos: [
          'La clase I bloquea canales de sodio. La IA (quinidina, procainamida) tiene efecto intermedio; la IB (lidocaína, mexiletina) actúa en tejido isquémico y es útil en arritmias ventriculares; la IC (flecainida, propafenona) es muy potente y se contraindica en cardiopatía estructural por el riesgo observado en el estudio CAST.',
          'La clase II son los betabloqueadores, útiles en taquicardias supraventriculares, control de frecuencia y prevención de arritmias ventriculares. La clase III bloquea potasio y prolonga la repolarización: amiodarona, sotalol, dofetilida y dronedarona. La clase IV son los calcioantagonistas no dihidropiridínicos, que enlentecen la conducción auriculoventricular.',
        ],
      },
      {
        titulo: 'Adenosina y digoxina',
        parrafos: [
          'La adenosina produce un bloqueo auriculoventricular transitorio y es útil para diagnosticar y terminar taquicardias de reentrada con QRS estrecho. Su efecto dura segundos. Puede causar rubor, disnea, dolor torácico y bradicardia transitoria; se usa con precaución en asma y en trasplantados.',
          'La digoxina enlentece la conducción auriculoventricular y se usa para controlar la frecuencia en fibrilación auricular, sobre todo cuando hay insuficiencia cardíaca. Su margen terapéutico es estrecho y depende de la función renal. No es un antiarrítmico de primera línea para el ritmo.',
        ],
      },
      {
        titulo: 'Elección y seguridad',
        parrafos: [
          'La elección depende del tipo de arritmia, la cardiopatía de base, la función ventricular, la función renal y el QT. En la cardiopatía estructural se evitan la clase IC y algunos fármacos que prolongan el QT. La amiodarona es frecuente en la fibrilación auricular y en las arritmias ventriculares, pero tiene toxicidad multiorgánica.',
          'El QF revisa la indicación, el ECG, los electrolitos y las interacciones. La supresión de una arritmia no siempre equivale a beneficio: el estudio CAST es el recordatorio más claro.',
        ],
      },
    ],
    proceso: {
      titulo: 'Seleccionar antiarrítmico',
      pasos: [
        { titulo: 'Ritmo', detalle: 'Supraventricular o ventricular.', icono: 'LineChart', evidencia: 'ECG.' },
        { titulo: 'Corazón', detalle: 'FEVI y cardiopatía.', icono: 'Activity', evidencia: 'Ecocardiograma.' },
        { titulo: 'Elegir', detalle: 'Clase y fármaco.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Revisar', detalle: 'QT, renal e interacciones.', icono: 'AlertTriangle', evidencia: 'Laboratorio.' },
        { titulo: 'Seguir', detalle: 'Respuesta y seguridad.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Flecainida en cardiopatía',
      contexto: 'Paciente con infarto previo y FEVI reducida que recibe flecainida para una arritmia.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Mantenerla; controla la arritmia.', correcta: false, retro: 'Se contraindica en cardiopatía estructural.' },
        { texto: 'Alertar y proponer alternativa.', correcta: true, retro: 'El estudio CAST mostró más mortalidad.' },
        { texto: 'Duplicar la dosis.', correcta: false, retro: 'Aumenta el riesgo.' },
      ],
    },
    errores: [
      { error: 'Usar clase IC en cardiopatía estructural.', correccion: 'Aumenta la mortalidad.' },
      { error: 'Ignorar la función renal para digoxina.', correccion: 'Se acumula.' },
      { error: 'Usar adenosina en asma grave.', correccion: 'Puede causar broncoespasmo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué clase bloquea potasio?', respuesta: 'La clase III.' },
      { pregunta: '¿Qué clase se contraindica tras infarto?', respuesta: 'La clase IC.' },
      { pregunta: '¿Qué hace la adenosina?', respuesta: 'Bloqueo auriculoventricular transitorio.' },
    ],
    resumen: [
      'La clasificación orienta la elección.',
      'La clase IC es peligrosa en cardiopatía estructural.',
      'La adenosina es diagnóstica y transitoria.',
      'La digoxina requiere ajuste renal.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/' },
      { cita: 'Manual MSD. Antiarrítmicos: clasificación de Vaughan Williams.', url: 'https://www.msdmanuals.com/es/professional/multimedia/table/antiarrítmicos-clasificación-de-vaughan-williams' },
    ],
    imagenes: [
      { ubicacion: 'Clasificación', descripcion: 'Clases de Vaughan-Williams y ejemplos.', alt: 'Clasificación de antiarrítmicos Vaughan-Williams' },
    ],
    keywords: ['Vaughan-Williams', 'antiarrítmicos', 'flecainida', 'adenosina', 'digoxina'],
  },
  {
    titulo: 'Proarritmia y prolongación del QT',
    duracion: 20,
    gancho: {
      titulo: 'La claritromicina que alargó el QT',
      texto: 'Una paciente de 78 años con sotalol y furosemida recibe claritromicina. El potasio es 3,3 y la función renal está reducida. Cuatro factores de riesgo y dos fármacos que prolongan el QT. La torsade puede prevenirse.',
    },
    objetivos: [
      'Explicar la proarritmia.',
      'Reconocer factores de riesgo de torsade.',
      'Revisar fármacos que prolongan el QT.',
      'Aplicar medidas de prevención.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Torsade', definicion: 'Taquicardia ventricular polimórfica.' },
      { icono: 'LineChart', termino: 'QTc', definicion: 'QT corregido por la frecuencia.' },
      { icono: 'TestTube', termino: 'Electrolitos', definicion: 'Potasio y magnesio bajos aumentan el riesgo.' },
      { icono: 'Network', termino: 'Polifarmacia', definicion: 'Varios fármacos que prolongan el QT.' },
    ],
    mapa: {
      centro: 'Proarritmia',
      ramas: [
        { titulo: 'Factores', icono: 'AlertTriangle', nodos: ['Edad', 'Sexo', 'Bradicardia', 'Renal'] },
        { titulo: 'Electrolitos', icono: 'TestTube', nodos: ['Potasio', 'Magnesio', 'Calcio'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Macrólidos', 'Quinolonas', 'Azoles', 'Antipsicóticos'] },
        { titulo: 'Prevención', icono: 'ShieldCheck', nodos: ['ECG', 'Corregir', 'Evitar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué es la proarritmia',
        parrafos: [
          'La proarritmia es la aparición o el empeoramiento de una arritmia por un fármaco. Los antiarrítmicos pueden prolongar la repolarización y crear el sustrato para torsade de pointes. El estudio CAST demostró que suprimir arritmias con clase IC tras un infarto aumentaba la mortalidad.',
          'La torsade es una taquicardia ventricular polimórfica que puede degenerar en fibrilación ventricular. Se asocia con QT largo, bradicardia, hipopotasemia, hipomagnesemia y fármacos que bloquean canales de potasio.',
        ],
      },
      {
        titulo: 'Factores de riesgo',
        parrafos: [
          'Los factores incluyen sexo femenino, edad avanzada, bradicardia, insuficiencia renal, cardiopatía estructural, QT largo congénito y alteraciones electrolíticas. La hipopotasemia por diuréticos y la hipomagnesemia son causas frecuentes y corregibles.',
          'La polifarmacia con varios fármacos que prolongan el QT multiplica el riesgo. Entre ellos están macrólidos, fluoroquinolonas, antifúngicos azólicos, antipsicóticos, algunos antidepresivos, ondansetrón, metadona e hidroxicloroquina.',
        ],
      },
      {
        titulo: 'Prevención',
        parrafos: [
          'Antes de iniciar un fármaco de riesgo se revisa el ECG, el potasio, el magnesio y la función renal. Se evitan combinaciones innecesarias y se corrige lo corregible. En pacientes de alto riesgo se puede monitorizar el ECG.',
          'El QF revisa la lista completa, consulta bases de datos de riesgo y comunica al prescriptor. La educación incluye reconocer palpitaciones, mareo o síncope y consultar. La prevención es más eficaz que el tratamiento de la torsade.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluar riesgo de QT',
      pasos: [
        { titulo: 'ECG', detalle: 'QTc basal.', icono: 'LineChart', evidencia: 'ECG.' },
        { titulo: 'Electrolitos', detalle: 'Potasio y magnesio.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Fármacos', detalle: 'Lista de prolongadores.', icono: 'Pill', evidencia: 'Revisión.' },
        { titulo: 'Factores', detalle: 'Edad, renal y bradicardia.', icono: 'AlertTriangle', evidencia: 'Evaluación.' },
        { titulo: 'Prevenir', detalle: 'Evitar y corregir.', icono: 'ShieldCheck', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: 'Sotalol y claritromicina',
      contexto: 'Paciente de 78 años con sotalol y furosemida, potasio 3,3, TFG 35 y claritromicina para neumonía.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Dispensar sin revisar.', correcta: false, retro: 'Hay riesgo alto de torsade.' },
        { texto: 'Alertar, corregir potasio y proponer alternativa.', correcta: true, retro: 'Reduce el riesgo de proarritmia.' },
        { texto: 'Aumentar el sotalol.', correcta: false, retro: 'Empeora el QT.' },
      ],
    },
    errores: [
      { error: 'No revisar el QT basal.', correccion: 'Es el punto de partida.' },
      { error: 'Ignorar la hipopotasemia.', correccion: 'Es corregible y letal.' },
      { error: 'Combinar prolongadores sin necesidad.', correccion: 'Multiplica el riesgo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es torsade?', respuesta: 'Taquicardia ventricular polimórfica.' },
      { pregunta: '¿Qué electrolitos aumentan el riesgo?', respuesta: 'Potasio y magnesio bajos.' },
      { pregunta: '¿Qué fármacos prolongan el QT?', respuesta: 'Macrólidos, quinolonas y azoles.' },
    ],
    resumen: [
      'La proarritmia puede ser fatal.',
      'El QT y los electrolitos se revisan.',
      'La polifarmacia multiplica el riesgo.',
      'Prevenir es más eficaz que tratar.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/' },
      { cita: 'CredibleMeds. QTdrugs list: drugs that prolong the QT interval.', url: 'https://crediblemeds.org/' },
    ],
    imagenes: [
      { ubicacion: 'Proarritmia', descripcion: 'Factores de riesgo y fármacos que prolongan el QT.', alt: 'Proarritmia y prolongación del QT' },
    ],
    keywords: ['proarritmia', 'QT largo', 'torsade de pointes', 'fármacos QT'],
  },
  {
    titulo: 'Amiodarona: farmacocinética, toxicidad y monitorización',
    duracion: 20,
    gancho: {
      titulo: 'El fármaco que se acumula',
      texto: 'La amiodarona tiene una vida media de semanas y se acumula en tejidos. La toxicidad tiroidea, pulmonar y hepática aparece con el tiempo. La monitorización periódica es parte del tratamiento, no un extra.',
    },
    objetivos: [
      'Explicar la farmacocinética.',
      'Reconocer la toxicidad multiorgánica.',
      'Aplicar el esquema de monitorización.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'Timer', termino: 'Vida media', definicion: 'Larga; semanas o meses.' },
      { icono: 'ShieldCheck', termino: 'Tiroides', definicion: 'Hipo o hipertiroidismo.' },
      { icono: 'Wind', termino: 'Pulmón', definicion: 'Neumonitis y fibrosis.' },
      { icono: 'Eye', termino: 'Ojos', definicion: 'Depósitos corneales y neuropatía.' },
    ],
    mapa: {
      centro: 'Amiodarona',
      ramas: [
        { titulo: 'Farmacocinética', icono: 'Timer', nodos: ['Lipofilia', 'Acumulación', 'Vida media'] },
        { titulo: 'Toxicidad', icono: 'AlertTriangle', nodos: ['Tiroides', 'Pulmón', 'Hígado', 'Ojos'] },
        { titulo: 'Monitorización', icono: 'TestTube', nodos: ['TSH', 'LFT', 'Imagen', 'ECG'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['Fotosensibilidad', 'Síntomas', 'Adherencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Farmacocinética',
        parrafos: [
          'La amiodarona es muy lipofílica, se distribuye ampliamente y se acumula en tejido adiposo, hígado, pulmón y tiroides. Su vida media es de semanas a meses, por lo que el efecto y la toxicidad persisten después de suspenderla. La dosis de carga suele ser de varios gramos y la de mantenimiento de 200 mg al día.',
          'Inhibe el CYP3A4 y el CYP2C9 y afecta la glucoproteína P. Eso explica muchas interacciones con digoxina, warfarina, estatinas y otros fármacos. Es un fármaco de clase III con efectos de clase I, II y IV.',
        ],
      },
      {
        titulo: 'Toxicidad',
        parrafos: [
          'La toxicidad tiroidea incluye hipotiroidismo e hipertiroidismo. La pulmonar es la más grave: neumonitis y fibrosis. La hepática se manifiesta con elevación de transaminasas. La ocular incluye depósitos corneales y, rara vez, neuropatía óptica. La cutánea produce fotosensibilidad y coloración gris azulada.',
          'También puede causar bradicardia, prolongación del QT, neuropatía periférica y alteraciones gastrointestinales. La toxicidad depende de la dosis acumulada y del tiempo de exposición.',
        ],
      },
      {
        titulo: 'Monitorización',
        parrafos: [
          'Antes de iniciar se solicita TSH, pruebas hepáticas, ECG, radiografía de tórax y valoración oftalmológica. Durante el tratamiento se repiten TSH y pruebas hepáticas cada seis meses, y se vigilan síntomas respiratorios y oculares. La radiografía o tomografía se indica si hay síntomas.',
          'El paciente debe usar protección solar, reportar disnea, tos, fiebre, cambios de peso, palpitaciones o visión borrosa. El QF revisa la adherencia y las interacciones en cada dispensación. La amiodarona es eficaz, pero exige seguimiento estructurado.',
        ],
      },
    ],
    proceso: {
      titulo: 'Monitorización de amiodarona',
      pasos: [
        { titulo: 'Basal', detalle: 'TSH, LFT, ECG y tórax.', icono: 'ClipboardList', evidencia: 'Registro.' },
        { titulo: 'Carga', detalle: 'Dosis y tolerancia.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Control', detalle: 'TSH y LFT cada 6 meses.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Síntomas', detalle: 'Disnea, visión y piel.', icono: 'AlertTriangle', evidencia: 'Entrevista.' },
        { titulo: 'Interacción', detalle: 'Digoxina, warfarina y estatinas.', icono: 'Network', evidencia: 'Lista.' },
      ],
    },
    caso: {
      titulo: 'Disnea con amiodarona',
      contexto: 'Paciente con amiodarona de largo plazo que presenta disnea y tos seca.',
      pregunta: '¿Qué sospecha el QF?',
      opciones: [
        { texto: 'Toxicidad pulmonar.', correcta: true, retro: 'Debe evaluarse de inmediato.' },
        { texto: 'Es normal por la arritmia.', correcta: false, retro: 'La disnea nueva exige estudio.' },
        { texto: 'Falta de adherencia.', correcta: false, retro: 'El cuadro no lo sugiere.' },
      ],
    },
    errores: [
      { error: 'No solicitar TSH basal.', correccion: 'La toxicidad tiroidea es frecuente.' },
      { error: 'Ignorar la disnea nueva.', correccion: 'Puede ser neumonitis.' },
      { error: 'No advertir la fotosensibilidad.', correccion: 'Afecta la piel.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo es su vida media?', respuesta: 'Larga, de semanas a meses.' },
      { pregunta: '¿Qué toxicidad es la más grave?', respuesta: 'La pulmonar.' },
      { pregunta: '¿Qué se controla cada seis meses?', respuesta: 'TSH y pruebas hepáticas.' },
    ],
    resumen: [
      'La amiodarona se acumula y persiste.',
      'La toxicidad es multiorgánica.',
      'La monitorización es obligatoria.',
      'La educación mejora la detección temprana.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Trangorex 200 mg comprimidos. Revisión 2024.', url: 'https://cima.aemps.es/cima/dochtml/ft/38577/FT_38577.html' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/' },
    ],
    imagenes: [
      { ubicacion: 'Amiodarona', descripcion: 'Órganos afectados y controles periódicos.', alt: 'Amiodarona farmacocinética y toxicidad' },
    ],
    keywords: ['amiodarona', 'toxicidad amiodarona', 'amiodarona tiroides', 'monitorización amiodarona'],
  },
  {
    titulo: 'Interacciones de amiodarona con digoxina, estatinas y bradicardizantes',
    duracion: 20,
    gancho: {
      titulo: 'La digoxina que se duplicó',
      texto: 'Un paciente estabilizado con digoxina inicia amiodarona y a la semana tiene náuseas y bradicardia. La amiodarona aumenta los niveles de digoxina. Ajustar la dosis y monitorizar evita la toxicidad.',
    },
    objetivos: [
      'Explicar las interacciones de la amiodarona.',
      'Aplicar ajustes de dosis.',
      'Reconocer el riesgo de bradicardia.',
      'Monitorizar y educar.',
    ],
    conceptos: [
      { icono: 'Network', termino: 'CYP3A4', definicion: 'Inhibición potente por amiodarona.' },
      { icono: 'Pill', termino: 'Digoxina', definicion: 'Aumenta su nivel; reducir dosis.' },
      { icono: 'Timer', termino: 'Bradicardia', definicion: 'Riesgo con beta o no DHP.' },
      { icono: 'TestTube', termino: 'Monitorización', definicion: 'Niveles y ECG.' },
    ],
    mapa: {
      centro: 'Interacciones',
      ramas: [
        { titulo: 'Digoxina', icono: 'Pill', nodos: ['P-gp', 'Reducir 50 %', 'Nivel'] },
        { titulo: 'Warfarina', icono: 'Droplets', nodos: ['INR', 'Reducir dosis', 'Control'] },
        { titulo: 'Estatinas', icono: 'Activity', nodos: ['Simvastatina', 'Atorvastatina', 'Miopatía'] },
        { titulo: 'Bradicardia', icono: 'Timer', nodos: ['Beta', 'Verapamilo', 'Diltiazem'] },
      ],
    },
    secciones: [
      {
        titulo: 'Digoxina y warfarina',
        parrafos: [
          'La amiodarona inhibe la glucoproteína P y reduce la eliminación de digoxina. Se recomienda reducir la dosis de digoxina aproximadamente a la mitad y controlar los niveles y la frecuencia cardíaca. La toxicidad digitálica puede aparecer con náuseas, visión alterada y arritmias.',
          'También inhibe el metabolismo de la warfarina y aumenta el INR. Se reduce la dosis de warfarina y se controla el INR con más frecuencia. En pacientes anticoagulados, la interacción puede causar sangrado.',
        ],
      },
      {
        titulo: 'Estatinas',
        parrafos: [
          'La amiodarona inhibe el CYP3A4 y aumenta la exposición a simvastatina y atorvastatina, con riesgo de miopatía y rabdomiólisis. Con simvastatina se limita la dosis y se prefiere cambiar a rosuvastatina o pravastatina, que dependen menos del CYP3A4.',
          'El QF revisa la estatina, la dosis y los síntomas musculares. La combinación no siempre debe evitarse, pero exige ajuste y seguimiento.',
        ],
      },
      {
        titulo: 'Bradicardizantes y QT',
        parrafos: [
          'La amiodarona puede sumar bradicardia con betabloqueadores, verapamilo, diltiazem y digoxina. Se controla la frecuencia y se educa sobre mareo o síncope. También prolonga el QT y puede interactuar con otros fármacos que lo prolongan.',
          'La revisión de la medicación completa, el ECG y los electrolitos es parte de la dispensación. El QF documenta los ajustes y coordina con el prescriptor. La revisión debe repetirse cada vez que se añade un fármaco, porque las interacciones de la amiodarona persisten semanas después de suspenderla.',
        ],
      },
    ],
    proceso: {
      titulo: 'Revisar interacciones',
      pasos: [
        { titulo: 'Listar', detalle: 'Digoxina, warfarina y estatinas.', icono: 'ClipboardList', evidencia: 'Lista.' },
        { titulo: 'Ajustar', detalle: 'Reducir dosis.', icono: 'Settings', evidencia: 'Fórmula.' },
        { titulo: 'Controlar', detalle: 'Niveles, INR y ECG.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Síntomas', detalle: 'Bradicardia y miopatía.', icono: 'AlertTriangle', evidencia: 'Entrevista.' },
        { titulo: 'Educar', detalle: 'Signos de toxicidad.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Digoxina y amiodarona',
      contexto: 'Paciente con digoxina estable que inicia amiodarona y presenta náuseas y bradicardia.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Mantener la digoxina igual.', correcta: false, retro: 'La amiodarona aumenta sus niveles.' },
        { texto: 'Reducir digoxina y controlar nivel y frecuencia.', correcta: true, retro: 'Previene la toxicidad.' },
        { texto: 'Suspender la amiodarona sin consultar.', correcta: false, retro: 'Debe coordinarse.' },
      ],
    },
    errores: [
      { error: 'No ajustar digoxina.', correccion: 'Riesgo de toxicidad.' },
      { error: 'No controlar INR con warfarina.', correccion: 'Riesgo de sangrado.' },
      { error: 'Mantener simvastatina a dosis alta.', correccion: 'Riesgo de miopatía.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo afecta a la digoxina?', respuesta: 'Aumenta sus niveles.' },
      { pregunta: '¿Qué estatina se prefiere?', respuesta: 'Rosuvastatina o pravastatina.' },
      { pregunta: '¿Qué se controla con warfarina?', respuesta: 'El INR.' },
    ],
    resumen: [
      'La amiodarona inhibe el CYP3A4 y la P-gp.',
      'La digoxina y la warfarina requieren ajuste.',
      'Las estatinas pueden causar miopatía.',
      'La bradicardia se vigila.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Trangorex 200 mg comprimidos. Revisión 2024.', url: 'https://cima.aemps.es/cima/dochtml/ft/38577/FT_38577.html' },
    ],
    imagenes: [
      { ubicacion: 'Interacciones', descripcion: 'Interacciones de amiodarona y ajustes recomendados.', alt: 'Interacciones de la amiodarona' },
    ],
    keywords: ['amiodarona digoxina', 'amiodarona warfarina', 'amiodarona estatinas', 'interacciones amiodarona'],
  },
  {
    titulo: 'Caso: inicio de amiodarona en fibrilación auricular – plan de monitorización',
    duracion: 25,
    gancho: {
      titulo: 'La amiodarona que necesita un plan',
      texto: 'Un paciente con fibrilación auricular inicia amiodarona. La eficacia es alta, pero también el riesgo tiroideo, pulmonar y hepático. Un plan de monitorización desde el primer día evita sorpresas.',
    },
    objetivos: [
      'Aplicar el inicio seguro de amiodarona.',
      'Diseñar la monitorización.',
      'Revisar interacciones.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'ClipboardList', termino: 'Basal', definicion: 'TSH, LFT, ECG y tórax.' },
      { icono: 'CalendarClock', termino: 'Seguimiento', definicion: 'Controles periódicos.' },
      { icono: 'Network', termino: 'Interacción', definicion: 'Digoxina, warfarina y estatinas.' },
      { icono: 'Users', termino: 'Educación', definicion: 'Síntomas y fotoprotección.' },
    ],
    mapa: {
      centro: 'Amiodarona en FA',
      ramas: [
        { titulo: 'Inicio', icono: 'Pill', nodos: ['Carga', 'Mantenimiento', 'ECG'] },
        { titulo: 'Basal', icono: 'TestTube', nodos: ['TSH', 'LFT', 'Tórax', 'Ojos'] },
        { titulo: 'Control', icono: 'CalendarClock', nodos: ['6 meses', 'Síntomas', 'Nivel'] },
        { titulo: 'Interacción', icono: 'Network', nodos: ['Digoxina', 'Warfarina', 'Estatina'] },
      ],
    },
    secciones: [
      {
        titulo: 'Inicio',
        parrafos: [
          'La amiodarona se usa para mantener el ritmo sinusal en la fibrilación auricular y para tratar arritmias ventriculares. Antes de iniciar se solicita TSH, pruebas hepáticas, ECG, radiografía de tórax y valoración oftalmológica. Se revisa la medicación completa por interacciones.',
          'La dosis de carga y mantenimiento se individualiza. El paciente debe conocer que el efecto y la toxicidad persisten por semanas después de suspenderla.',
        ],
      },
      {
        titulo: 'Monitorización',
        parrafos: [
          'Durante el tratamiento se controlan TSH y pruebas hepáticas cada seis meses, además de la clínica. Se pregunta por disnea, tos, fiebre, cambios de peso, palpitaciones, visión borrosa o fotosensibilidad. La radiografía o tomografía se indica si hay síntomas respiratorios.',
          'Se revisan los niveles de digoxina y el INR si el paciente los usa. La frecuencia cardíaca y el QT se controlan con el ECG. La documentación de cada control permite detectar tendencias.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe usar protector solar y ropa que cubra la piel, reportar síntomas y no automedicarse. Se explican los riesgos tiroideos y pulmonares con lenguaje claro. La adherencia es importante, pero también lo es reconocer cuándo consultar.',
          'El QF coordina con el médico y el laboratorio, y deja un plan escrito. El caso muestra que la amiodarona no es solo una pastilla: es un tratamiento que exige seguimiento estructurado.',
        ],
      },
    ],
    proceso: {
      titulo: 'Plan de amiodarona',
      pasos: [
        { titulo: 'Basal', detalle: 'TSH, LFT, ECG, tórax.', icono: 'ClipboardList', evidencia: 'Registro.' },
        { titulo: 'Revisar', detalle: 'Digoxina, warfarina y estatinas.', icono: 'Network', evidencia: 'Lista.' },
        { titulo: 'Iniciar', detalle: 'Carga y mantenimiento.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Controlar', detalle: 'TSH y LFT a 6 meses.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Educar', detalle: 'Síntomas y fotoprotección.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'FA y amiodarona',
      contexto: 'Paciente con fibrilación auricular que inicia amiodarona; no tiene controles basales ni revisión de interacciones.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Dispensar sin controles.', correcta: false, retro: 'La toxicidad es frecuente.' },
        { texto: 'Solicitar basal, revisar interacciones y educar.', correcta: true, retro: 'Inicio seguro y monitorizado.' },
        { texto: 'Duplicar la dosis de mantenimiento.', correcta: false, retro: 'No es seguro.' },
      ],
    },
    errores: [
      { error: 'No pedir TSH basal.', correccion: 'La tiroides es un órgano diana.' },
      { error: 'No revisar digoxina.', correccion: 'Se acumula.' },
      { error: 'No advertir la fotosensibilidad.', correccion: 'Afecta la piel.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se solicita antes de iniciar?', respuesta: 'TSH, LFT, ECG, tórax y ojos.' },
      { pregunta: '¿Cada cuánto se controla?', respuesta: 'Cada seis meses.' },
      { pregunta: '¿Qué interacciones se revisan?', respuesta: 'Digoxina, warfarina y estatinas.' },
    ],
    resumen: [
      'La amiodarona exige un plan desde el inicio.',
      'El basal y el seguimiento detectan toxicidad.',
      'Las interacciones se ajustan.',
      'La educación mejora la seguridad.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Trangorex 200 mg comprimidos. Revisión 2024.', url: 'https://cima.aemps.es/cima/dochtml/ft/38577/FT_38577.html' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/' },
    ],
    imagenes: [
      { ubicacion: 'Caso', descripcion: 'Plan de monitorización de amiodarona en FA.', alt: 'Caso de amiodarona en fibrilación auricular' },
    ],
    keywords: ['amiodarona fibrilación auricular', 'monitorización amiodarona', 'amiodarona TSH'],
  },
  {
    titulo: 'Introducción a la unidad: metabolismo lipídico y metas de colesterol LDL',
    duracion: 15,
    gancho: {
      titulo: 'El LDL que causa la placa',
      texto: 'El colesterol LDL es causal en la aterosclerosis. Cuanto más alto y más tiempo expuesto, mayor el riesgo. Las metas no son un número aislado: dependen del riesgo cardiovascular. Entender el metabolismo explica por qué las estatinas funcionan.',
    },
    objetivos: [
      'Resumir el metabolismo lipídico.',
      'Aplicar las metas de LDL.',
      'Reconocer el riesgo cardiovascular.',
      'Conectar el mecanismo con el tratamiento.',
    ],
    conceptos: [
      { icono: 'Activity', termino: 'LDL', definicion: 'Lipoproteína aterogénica.' },
      { icono: 'Target', termino: 'Meta', definicion: 'Objetivo según riesgo.' },
      { icono: 'Database', termino: 'HMG-CoA', definicion: 'Enzima clave de la síntesis.' },
      { icono: 'LineChart', termino: 'Riesgo', definicion: 'Probabilidad de evento cardiovascular.' },
    ],
    mapa: {
      centro: 'Lípidos',
      ramas: [
        { titulo: 'Metabolismo', icono: 'Database', nodos: ['Síntesis', 'Receptor LDL', 'Absorción'] },
        { titulo: 'Riesgo', icono: 'LineChart', nodos: ['Muy alto', 'Alto', 'Moderado', 'Bajo'] },
        { titulo: 'Metas', icono: 'Target', nodos: ['55', '70', '100', '116'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Estatinas', 'Ezetimiba', 'iPCSK9'] },
      ],
    },
    secciones: [
      {
        titulo: 'Metabolismo',
        parrafos: [
          'El colesterol se sintetiza en el hígado a partir de acetil-CoA; la enzima limitante es la HMG-CoA reductasa. También se absorbe en el intestino a través del transportador NPC1L1. Las estatinas inhiben la síntesis y aumentan la expresión de receptores de LDL, lo que reduce el LDL circulante.',
          'El LDL transporta colesterol a los tejidos. Cuando hay exceso, se deposita en la pared arterial y desencadena la placa de ateroma. La inflamación y la trombosis explican los eventos clínicos.',
        ],
      },
      {
        titulo: 'Metas y riesgo',
        parrafos: [
          'Las guías europeas establecen metas de LDL según el riesgo: en riesgo muy alto, menos de 55 mg/dL y una reducción de al menos 50 %; en riesgo alto, menos de 70 mg/dL; en riesgo moderado, menos de 100 mg/dL; y en riesgo bajo, menos de 116 mg/dL. La meta se individualiza y se ajusta al contexto.',
          'La reducción del LDL se asocia con menos eventos, independientemente del fármaco utilizado. Cuanto mayor el riesgo, más baja la meta y más intenso el tratamiento. En prevención secundaria, la estatina de alta intensidad es la base.',
        ],
      },
      {
        titulo: 'Aplicación',
        parrafos: [
          'El QF revisa el perfil lipídico, el riesgo cardiovascular, la adherencia y la intensidad de la estatina. Si no se alcanza la meta, se valora la combinación con ezetimiba o un inhibidor de PCSK9. La medición debe hacerse con el paciente en tratamiento y tras un cambio.',
          'La educación incluye dieta, actividad física, cesación tabáquica y adherencia. El LDL no se controla solo con la dieta cuando el riesgo es alto; los fármacos son necesarios.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluar y tratar',
      pasos: [
        { titulo: 'Perfil', detalle: 'LDL, HDL y triglicéridos.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Riesgo', detalle: 'Estratificación.', icono: 'LineChart', evidencia: 'Evaluación.' },
        { titulo: 'Meta', detalle: 'Según riesgo.', icono: 'Target', evidencia: 'Plan.' },
        { titulo: 'Tratar', detalle: 'Estatina de intensidad.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Reevaluar', detalle: 'Control y ajuste.', icono: 'Repeat', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Prevención secundaria',
      contexto: 'Paciente con infarto previo y LDL de 110 mg/dL.',
      pregunta: '¿Qué meta corresponde?',
      opciones: [
        { texto: 'Menos de 55 mg/dL.', correcta: true, retro: 'Riesgo muy alto.' },
        { texto: 'Menos de 160 mg/dL.', correcta: false, retro: 'No es una meta de alto riesgo.' },
        { texto: 'No requiere tratamiento.', correcta: false, retro: 'La prevención secundaria es prioritaria.' },
      ],
    },
    errores: [
      { error: 'Usar una meta única.', correccion: 'Depende del riesgo.' },
      { error: 'Confiar solo en la dieta.', correccion: 'En alto riesgo se necesitan fármacos.' },
      { error: 'No medir el LDL en tratamiento.', correccion: 'Sin control no se sabe si se alcanza la meta.' },
    ],
    comprueba: [
      { pregunta: '¿Qué enzima inhiben las estatinas?', respuesta: 'La HMG-CoA reductasa.' },
      { pregunta: '¿Cuál es la meta en riesgo muy alto?', respuesta: 'LDL menor de 55 mg/dL.' },
      { pregunta: '¿Qué transportador inhibe la ezetimiba?', respuesta: 'NPC1L1.' },
    ],
    resumen: [
      'El LDL es causal en la aterosclerosis.',
      'La meta depende del riesgo.',
      'Las estatinas aumentan los receptores de LDL.',
      'El control se mide en tratamiento.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology/European Atherosclerosis Society. 2019 ESC/EAS Guidelines for the management of dyslipidaemias. Eur Heart J. 2020;41:111-188.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Dyslipidaemias-Management-of' },
    ],
    imagenes: [
      { ubicacion: 'Unidad 5', descripcion: 'Metabolismo del LDL y metas por riesgo.', alt: 'Metabolismo lipídico y metas de LDL' },
    ],
    keywords: ['colesterol LDL', 'metas LDL', 'riesgo cardiovascular', 'HMG-CoA'],
  },
  {
    titulo: 'Estatinas: mecanismo, intensidad y uso clínico',
    duracion: 20,
    gancho: {
      titulo: 'La estatina correcta para el riesgo correcto',
      texto: 'No todas las estatinas tienen la misma potencia. Atorvastatina 40-80 mg y rosuvastatina 20-40 mg son alta intensidad; pravastatina 40 mg es moderada. La elección depende de la meta y del riesgo.',
    },
    objetivos: [
      'Explicar el mecanismo.',
      'Clasificar la intensidad.',
      'Aplicar indicaciones y metas.',
      'Reconocer efectos adversos.',
    ],
    conceptos: [
      { icono: 'Database', termino: 'HMG-CoA', definicion: 'Enzima inhibida por estatinas.' },
      { icono: 'Pill', termino: 'Alta intensidad', definicion: 'Atorvastatina 40-80 o rosuvastatina 20-40.' },
      { icono: 'LineChart', termino: 'Reducción', definicion: 'Descenso del LDL según dosis.' },
      { icono: 'AlertTriangle', termino: 'Miopatía', definicion: 'Efecto adverso poco frecuente.' },
    ],
    mapa: {
      centro: 'Estatinas',
      ramas: [
        { titulo: 'Mecanismo', icono: 'Database', nodos: ['HMG-CoA', 'Receptor LDL', 'Síntesis'] },
        { titulo: 'Intensidad', icono: 'Pill', nodos: ['Alta', 'Moderada', 'Baja'] },
        { titulo: 'Indicaciones', icono: 'Target', nodos: ['Prevención secundaria', 'Alto riesgo'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Miopatía', 'Hígado', 'Glucosa'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo e intensidad',
        parrafos: [
          'Las estatinas inhiben la HMG-CoA reductasa y reducen la síntesis hepática de colesterol. El hígado aumenta la expresión de receptores de LDL y capta más LDL circulante. El efecto depende de la dosis y de la molécula.',
          'La alta intensidad incluye atorvastatina 40-80 mg y rosuvastatina 20-40 mg; la moderada incluye atorvastatina 10-20 mg, rosuvastatina 10 mg, simvastatina 20-40 mg y pravastatina 40 mg. La elección depende de la meta y del riesgo.',
        ],
      },
      {
        titulo: 'Uso clínico',
        parrafos: [
          'En prevención secundaria y en riesgo alto se usa una estatina de alta intensidad. En riesgo moderado, una estatina de intensidad moderada. Si no se alcanza la meta, se intensifica o se combina con ezetimiba o un inhibidor de PCSK9.',
          'Antes de iniciar se solicita un perfil lipídico y una prueba hepática basal. La respuesta se evalúa a las 4-12 semanas. La adherencia es clave: la suspensión por síntomas mal atribuidos deja al paciente sin protección.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Los efectos adversos incluyen mialgia, elevación de transaminasas y, rara vez, miopatía y rabdomiólisis. El riesgo aumenta con dosis altas, edad, insuficiencia renal, hipotiroidismo e interacciones. La diabetes puede aparecer o empeorar ligeramente, pero el beneficio cardiovascular supera el riesgo.',
          'No se solicitan enzimas musculares de rutina; se piden si hay síntomas. Las transaminasas se controlan si hay factores de riesgo. Las estatinas están contraindicadas en el embarazo y la lactancia.',
        ],
      },
    ],
    proceso: {
      titulo: 'Iniciar estatina',
      pasos: [
        { titulo: 'Riesgo', detalle: 'Meta de LDL.', icono: 'Target', evidencia: 'Evaluación.' },
        { titulo: 'Intensidad', detalle: 'Alta, moderada o baja.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Basal', detalle: 'Lípidos y hepática.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Control', detalle: 'LDL a 4-12 semanas.', icono: 'LineChart', evidencia: 'Resultado.' },
        { titulo: 'Seguridad', detalle: 'Síntomas musculares.', icono: 'AlertTriangle', evidencia: 'Entrevista.' },
      ],
    },
    caso: {
      titulo: 'Infarto previo',
      contexto: 'Paciente con infarto previo y LDL de 120 mg/dL que recibe simvastatina 20 mg.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Mantener la dosis.', correcta: false, retro: 'No alcanza la meta de alto riesgo.' },
        { texto: 'Proponer estatina de alta intensidad.', correcta: true, retro: 'Es la base en prevención secundaria.' },
        { texto: 'Suspender la estatina.', correcta: false, retro: 'Aumenta el riesgo.' },
      ],
    },
    errores: [
      { error: 'Usar dosis baja en alto riesgo.', correccion: 'No alcanza la meta.' },
      { error: 'Suspender por mialgia sin evaluar.', correccion: 'Puede ser manejable.' },
      { error: 'No controlar el LDL.', correccion: 'Sin control no se ajusta.' },
    ],
    comprueba: [
      { pregunta: '¿Qué enzima inhiben?', respuesta: 'La HMG-CoA reductasa.' },
      { pregunta: '¿Qué es alta intensidad?', respuesta: 'Atorvastatina 40-80 o rosuvastatina 20-40.' },
      { pregunta: '¿Cuándo se piden enzimas musculares?', respuesta: 'Solo si hay síntomas.' },
    ],
    resumen: [
      'Las estatinas reducen el LDL y los eventos.',
      'La intensidad depende del riesgo.',
      'La respuesta se mide a las 4-12 semanas.',
      'La seguridad se vigila con criterio.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology/European Atherosclerosis Society. 2019 ESC/EAS Guidelines for the management of dyslipidaemias. Eur Heart J. 2020;41:111-188.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Dyslipidaemias-Management-of' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Atorvastatina Cinfa 40 mg comprimidos recubiertos con película EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/72462/FT_72462.html' },
    ],
    imagenes: [
      { ubicacion: 'Estatinas', descripcion: 'Intensidades y metas de LDL.', alt: 'Estatinas mecanismo e intensidad' },
    ],
    keywords: ['estatinas', 'atorvastatina', 'rosuvastatina', 'intensidad estatina', 'LDL'],
  },
  {
    titulo: 'Terapias no estatínicas: ezetimiba, ácido bempedoico, iPCSK9 e inclisirán',
    duracion: 20,
    gancho: {
      titulo: 'Cuando la estatina no basta',
      texto: 'Un paciente con hipercolesterolemia familiar sigue con LDL alto pese a estatina de alta intensidad. La ezetimiba, el ácido bempedoico, los inhibidores de PCSK9 y el inclisirán amplían las opciones. Elegir exige conocer el mecanismo y el acceso.',
    },
    objetivos: [
      'Comparar las terapias no estatínicas.',
      'Aplicar cuándo combinarlas.',
      'Reconocer efectos adversos.',
      'Evaluar el acceso en Colombia.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Ezetimiba', definicion: 'Inhibe la absorción intestinal de colesterol.' },
      { icono: 'Database', termino: 'Bempedoico', definicion: 'Inhibe la síntesis de colesterol.' },
      { icono: 'Target', termino: 'iPCSK9', definicion: 'Aumentan los receptores de LDL.' },
      { icono: 'Timer', termino: 'Inclisirán', definicion: 'ARN de interferencia; dos veces al año.' },
    ],
    mapa: {
      centro: 'No estatínicas',
      ramas: [
        { titulo: 'Ezetimiba', icono: 'Pill', nodos: ['NPC1L1', '20 %', 'Oral'] },
        { titulo: 'Bempedoico', icono: 'Database', nodos: ['ACL', '18 %', 'Mialgia'] },
        { titulo: 'iPCSK9', icono: 'Target', nodos: ['Evolocumab', 'Alirocumab', '50-60 %'] },
        { titulo: 'Inclisirán', icono: 'Timer', nodos: ['ARN', '2 veces/año', 'LDL'] },
      ],
    },
    secciones: [
      {
        titulo: 'Ezetimiba y bempedoico',
        parrafos: [
          'La ezetimiba inhibe el transportador NPC1L1 en el intestino y reduce el LDL alrededor de 20 %. Se usa en combinación con estatinas cuando no se alcanza la meta o cuando la estatina no se tolera. Es bien tolerada y tiene pocas interacciones.',
          'El ácido bempedoico inhibe la ATP-citrato liasa, una enzima upstream de la HMG-CoA reductasa. Reduce el LDL cerca de 18 % y no se activa en el músculo, por lo que puede ser útil en pacientes con mialgia por estatinas. Puede aumentar el ácido úrico y causar gota.',
        ],
      },
      {
        titulo: 'Inhibidores de PCSK9 e inclisirán',
        parrafos: [
          'Los anticuerpos monoclonales contra PCSK9, evolocumab y alirocumab, aumentan la recaptación hepática de LDL y reducen el LDL 50-60 %. Se administran por vía subcutánea cada dos o cuatro semanas. Se usan en hipercolesterolemia familiar y en prevención secundaria de muy alto riesgo cuando la estatina y la ezetimiba no bastan.',
          'El inclisirán es un ARN de interferencia que se administra dos veces al año y reduce el LDL de forma sostenida. Requiere administración en un centro y seguimiento. Los efectos adversos incluyen reacciones en el sitio de inyección y, con inclisirán, bronquitis o nasofaringitis.',
        ],
      },
      {
        titulo: 'Acceso y elección',
        parrafos: [
          'En Colombia, el acceso a estos fármacos depende del PBS y de mecanismos como MIPRES. Los iPCSK9 y el inclisirán tienen costo elevado y criterios de uso. El QF documenta la indicación, verifica la cobertura y apoya la continuidad.',
          'La elección se basa en la meta de LDL, la tolerancia, la vía de administración y el acceso. La combinación de estatina con ezetimiba es la estrategia inicial más costo-efectiva cuando no se alcanza la meta.',
        ],
      },
    ],
    proceso: {
      titulo: 'Escalar el tratamiento',
      pasos: [
        { titulo: 'Meta', detalle: 'LDL objetivo.', icono: 'Target', evidencia: 'Riesgo.' },
        { titulo: 'Estatina', detalle: 'Máxima tolerada.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Añadir', detalle: 'Ezetimiba.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Escalar', detalle: 'Bempedoico o iPCSK9.', icono: 'LineChart', evidencia: 'Decisión.' },
        { titulo: 'Acceso', detalle: 'Cobertura y seguimiento.', icono: 'FileCheck', evidencia: 'Registro.' },
      ],
    },
    caso: {
      titulo: 'Hipercolesterolemia familiar',
      contexto: 'Paciente con LDL de 170 mg/dL pese a atorvastatina 80 mg y ezetimiba.',
      pregunta: '¿Qué opción se valora?',
      opciones: [
        { texto: 'Un inhibidor de PCSK9.', correcta: true, retro: 'Reduce el LDL 50-60 %.' },
        { texto: 'Suspender la estatina.', correcta: false, retro: 'Perdería el beneficio.' },
        { texto: 'Solo dieta.', correcta: false, retro: 'No alcanza la meta.' },
      ],
    },
    errores: [
      { error: 'Escalar sin estatina máxima tolerada.', correccion: 'Primero se optimiza.' },
      { error: 'No revisar el ácido úrico con bempedoico.', correccion: 'Puede causar gota.' },
      { error: 'Ignorar la cobertura.', correccion: 'La continuidad depende de ella.' },
    ],
    comprueba: [
      { pregunta: '¿Qué reduce la ezetimiba?', respuesta: 'La absorción intestinal de colesterol.' },
      { pregunta: '¿Qué reduce los iPCSK9?', respuesta: 'El LDL 50-60 %.' },
      { pregunta: '¿Cada cuánto se aplica inclisirán?', respuesta: 'Dos veces al año.' },
    ],
    resumen: [
      'Las terapias no estatínicas amplían opciones.',
      'La ezetimiba es la combinación inicial.',
      'Los iPCSK9 son potentes y costosos.',
      'El acceso condiciona la elección.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology/European Atherosclerosis Society. 2019 ESC/EAS Guidelines for the management of dyslipidaemias. Eur Heart J. 2020;41:111-188.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Dyslipidaemias-Management-of' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Repatha 140 mg solución inyectable en pluma precargada.', url: 'https://cima.aemps.es/cima/dochtml/ft/11498001/FT_11498001.html' },
    ],
    imagenes: [
      { ubicacion: 'No estatínicas', descripcion: 'Mecanismos y reducción de LDL de cada terapia.', alt: 'Terapias no estatínicas para el LDL' },
    ],
    keywords: ['ezetimiba', 'bempedoico', 'iPCSK9', 'inclisirán', 'hipercolesterolemia'],
  },
  {
    titulo: 'Miopatía por estatinas e interacciones',
    duracion: 20,
    gancho: {
      titulo: 'El dolor muscular que no siempre es la estatina',
      texto: 'Un paciente con dolor muscular atribuye todo a la estatina y la suspende. Antes de retirarla hay que evaluar síntomas, enzimas, interacciones y alternativas. La miopatía verdadera es poco frecuente, pero la suspensión innecesaria también tiene riesgo.',
    },
    objetivos: [
      'Reconocer la mialgia por estatinas.',
      'Identificar interacciones.',
      'Aplicar el manejo escalonado.',
      'Elegir una alternativa segura.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Mialgia', definicion: 'Dolor muscular sin daño.' },
      { icono: 'TestTube', termino: 'CK', definicion: 'Se solicita si hay síntomas.' },
      { icono: 'Network', termino: 'CYP3A4', definicion: 'Aumenta la exposición a simvastatina.' },
      { icono: 'Pill', termino: 'Alternativa', definicion: 'Rosuvastatina o pravastatina.' },
    ],
    mapa: {
      centro: 'Miopatía',
      ramas: [
        { titulo: 'Síntomas', icono: 'AlertTriangle', nodos: ['Dolor', 'Debilidad', 'Orina oscura'] },
        { titulo: 'Interacción', icono: 'Network', nodos: ['Macrólidos', 'Azoles', 'Fibratos'] },
        { titulo: 'Evaluación', icono: 'TestTube', nodos: ['CK', 'TSH', 'Renal'] },
        { titulo: 'Manejo', icono: 'Pill', nodos: ['Cambiar', 'Reducir', 'Combinar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué es y cómo se evalúa',
        parrafos: [
          'La mialgia por estatinas es un dolor o debilidad muscular sin elevación significativa de la CK. La miopatía incluye elevación de la CK y la rabdomiólisis es la forma grave, con destrucción muscular y riesgo renal. La mayoría de los síntomas son leves y reversibles.',
          'Se evalúan factores de riesgo: dosis alta, edad, sexo femenino, hipotiroidismo, insuficiencia renal, alcohol y fármacos que interactúan. La CK se solicita si hay síntomas; no se recomienda de rutina.',
        ],
      },
      {
        titulo: 'Interacciones',
        parrafos: [
          'La simvastatina y la atorvastatina dependen del CYP3A4. Los macrólidos, los antifúngicos azólicos, el verapamilo, el diltiazem, la amiodarona y el zumo de pomelo aumentan su exposición. El gemfibrozil aumenta el riesgo de miopatía con cualquier estatina.',
          'La rosuvastatina y la pravastatina dependen menos del CYP3A4 y pueden ser alternativas. El QF revisa la lista completa, la dosis y los síntomas. La combinación con fibratos exige precaución.',
        ],
      },
      {
        titulo: 'Manejo',
        parrafos: [
          'Si hay síntomas, se evalúa la CK y se descartan otras causas. Se puede reducir la dosis, cambiar de estatina, usar días alternos o combinar con ezetimiba. La suspensión definitiva se reserva para la rabdomiólisis o la intolerancia grave documentada.',
          'La educación es clave: no todos los dolores musculares son por la estatina, y suspenderla sin valoración aumenta el riesgo cardiovascular. El QF acompaña el cambio y verifica la respuesta.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejo de la mialgia',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Síntomas y factores.', icono: 'ClipboardList', evidencia: 'Entrevista.' },
        { titulo: 'CK', detalle: 'Solicitar si hay síntomas.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Interacción', detalle: 'Revisar CYP3A4.', icono: 'Network', evidencia: 'Lista.' },
        { titulo: 'Ajustar', detalle: 'Cambiar o reducir.', icono: 'Settings', evidencia: 'Fórmula.' },
        { titulo: 'Seguir', detalle: 'Síntomas y LDL.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Dolor muscular con simvastatina',
      contexto: 'Paciente con simvastatina 40 mg y claritromicina que presenta dolor muscular.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Ignorar los síntomas.', correcta: false, retro: 'Hay interacción y riesgo de miopatía.' },
        { texto: 'Revisar CK e interacción y proponer alternativa.', correcta: true, retro: 'Manejo escalonado y seguro.' },
        { texto: 'Duplicar la simvastatina.', correcta: false, retro: 'Aumenta el riesgo.' },
      ],
    },
    errores: [
      { error: 'Suspender la estatina sin evaluar.', correccion: 'Se pierde el beneficio.' },
      { error: 'Ignorar la claritromicina.', correccion: 'Aumenta la exposición.' },
      { error: 'Usar gemfibrozil sin precaución.', correccion: 'Riesgo de miopatía.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es mialgia?', respuesta: 'Dolor muscular sin daño.' },
      { pregunta: '¿Qué fármacos interactúan?', respuesta: 'Macrólidos, azoles y amiodarona.' },
      { pregunta: '¿Qué alternativa se prefiere?', respuesta: 'Rosuvastatina o pravastatina.' },
    ],
    resumen: [
      'La miopatía verdadera es poco frecuente.',
      'La CK se pide solo con síntomas.',
      'Las interacciones del CYP3A4 importan.',
      'El manejo es escalonado, no suspender sin evaluar.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology/European Atherosclerosis Society. 2019 ESC/EAS Guidelines for the management of dyslipidaemias. Eur Heart J. 2020;41:111-188.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Dyslipidaemias-Management-of' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Simvastatina Cinfa 40 mg comprimidos recubiertos con película EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/62836/FT_62836.html' },
    ],
    imagenes: [
      { ubicacion: 'Miopatía', descripcion: 'Evaluación y manejo del dolor muscular por estatinas.', alt: 'Miopatía por estatinas e interacciones' },
    ],
    keywords: ['mialgia estatinas', 'miopatía estatina', 'CK estatina', 'interacciones estatina'],
  },
];

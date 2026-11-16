export const CURSO = 'Curso de Farmacoterapia del Asma y la EPOC';
export const MIGRACION = '139_experiencias_farmacoterapia_asma_epoc_3.sql';

export const CLASES = [
  {
    titulo: 'Introducción a la unidad: objetivos del manejo de la EPOC y cambios de GOLD 2026',
    duracion: 15,
    gancho: {
      titulo: 'Más que abrir el bronquio',
      texto: 'Tratar la EPOC no es solo mejorar la disnea de hoy. El objetivo incluye prevenir exacerbaciones, preservar la función y reducir la mortalidad. GOLD 2026 ordena el manejo en metas medibles y cambios concretos.',
    },
    objetivos: [
      'Resumir los objetivos del manejo de la EPOC.',
      'Reconocer los cambios de GOLD 2026.',
      'Aplicar la evaluación inicial.',
      'Conectar las metas con el seguimiento.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'Metas', definicion: 'Síntomas, exacerbaciones y mortalidad.' },
      { icono: 'Layers', termino: 'ABE', definicion: 'Grupos por síntomas y exacerbaciones.' },
      { icono: 'ShieldCheck', termino: 'Prevención', definicion: 'Vacunas, cesación y rehabilitación.' },
      { icono: 'LineChart', termino: 'Seguimiento', definicion: 'Evaluación periódica y ajuste.' },
    ],
    mapa: {
      centro: 'Manejo EPOC',
      ramas: [
        { titulo: 'Metas', icono: 'Target', nodos: ['Síntomas', 'Exacerbaciones', 'Función'] },
        { titulo: 'Evaluación', icono: 'ClipboardList', nodos: ['Espirometría', 'mMRC', 'CAT'] },
        { titulo: 'Tratamiento', icono: 'Pill', nodos: ['LABA+LAMA', 'ICS', 'Triple'] },
        { titulo: 'Prevención', icono: 'ShieldCheck', nodos: ['Vacunas', 'Cesación', 'Rehabilitación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Objetivos',
        parrafos: [
          'El manejo de la EPOC busca aliviar los síntomas, reducir las exacerbaciones y hospitalizaciones, mejorar la tolerancia al ejercicio y la calidad de vida, prevenir la progresión y reducir la mortalidad. Las metas se adaptan al paciente y se reevalúan en cada control.',
          'La evaluación inicial combina la espirometría posbroncodilatador, los síntomas con mMRC o CAT, el número de exacerbaciones y las comorbilidades. Con esos datos se asigna el grupo A, B o E y se elige el tratamiento inicial.',
        ],
      },
      {
        titulo: 'Cambios de GOLD 2026',
        parrafos: [
          'GOLD 2026 mantiene la clasificación ABE y refuerza la importancia de la espirometría posbroncodilatador, la evaluación de síntomas y la historia de exacerbaciones. Recomienda LABA+LAMA como tratamiento inicial en los grupos B y E, y reserva el ICS para pacientes con exacerbaciones y eosinófilos elevados.',
          'También destaca la triple terapia en un solo inhalador, el papel de los biológicos en pacientes con inflamación tipo 2 y la prevención con vacunas, cesación tabáquica y rehabilitación pulmonar. El seguimiento incluye técnica, adherencia y comorbilidades.',
        ],
      },
      {
        titulo: 'El rol del QF',
        parrafos: [
          'El QF revisa la coherencia del esquema, la técnica y la adherencia, y detecta problemas como duplicidades, ICS sin indicación o falta de rescate. También participa en la conciliación al alta, la educación y la vacunación.',
          'El manejo de la EPOC es longitudinal. Cada contacto es una oportunidad para medir síntomas, revisar el uso de rescate y reforzar la cesación tabáquica.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ciclo de manejo EPOC',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Espirometría, síntomas y exacerbaciones.', icono: 'ClipboardList', evidencia: 'Ficha.' },
        { titulo: 'Clasificar', detalle: 'Grupo A, B o E.', icono: 'Layers', evidencia: 'Grupo.' },
        { titulo: 'Tratar', detalle: 'Broncodilatadores e ICS si aplica.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Prevenir', detalle: 'Vacunas, cesación y rehabilitación.', icono: 'ShieldCheck', evidencia: 'Plan.' },
        { titulo: 'Revisar', detalle: 'Respuesta y adherencia.', icono: 'Repeat', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Paciente con exacerbaciones',
      contexto: 'Paciente con EPOC, dos exacerbaciones moderadas en el año y eosinófilos de 340 células/µL.',
      pregunta: '¿Qué grupo y tratamiento corresponden?',
      opciones: [
        { texto: 'Grupo A; solo SABA.', correcta: false, retro: 'Las exacerbaciones lo ubican en E.' },
        { texto: 'Grupo E; LABA+LAMA y valorar ICS.', correcta: true, retro: 'Eosinófilos altos apoyan el ICS.' },
        { texto: 'Grupo B; solo LABA.', correcta: false, retro: 'Requiere LABA+LAMA e ICS por exacerbaciones.' },
      ],
    },
    errores: [
      { error: 'Tratar solo los síntomas.', correccion: 'La prevención es parte de la meta.' },
      { error: 'Ignorar las exacerbaciones.', correccion: 'Definen el grupo E.' },
      { error: 'No revisar la técnica.', correccion: 'El dispositivo debe funcionar.' },
    ],
    comprueba: [
      { pregunta: '¿Qué grupos usa GOLD?', respuesta: 'A, B y E.' },
      { pregunta: '¿Qué tratamiento inicial tiene el grupo B?', respuesta: 'LABA+LAMA.' },
      { pregunta: '¿Cuándo se añade ICS?', respuesta: 'Con exacerbaciones y eosinófilos elevados.' },
    ],
    resumen: [
      'La EPOC se maneja con metas amplias.',
      'GOLD 2026 mantiene los grupos ABE.',
      'LABA+LAMA es la base en B y E.',
      'La prevención y el seguimiento son continuos.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Unidad 4', descripcion: 'Metas del manejo de la EPOC y ciclo de evaluación.', alt: 'Objetivos del manejo de la EPOC GOLD 2026' },
    ],
    keywords: ['manejo EPOC', 'GOLD 2026 cambios', 'grupos ABE', 'objetivos EPOC'],
  },
  {
    titulo: 'Clasificación ABE y tratamiento inicial de la EPOC según GOLD 2026',
    duracion: 20,
    gancho: {
      titulo: 'Dos exacerbaciones cambian el grupo',
      texto: 'Un paciente con síntomas leves pero dos exacerbaciones moderadas en el año no pertenece al grupo B. Las exacerbaciones definen el grupo E y el tratamiento. Clasificar bien evita subtratar a quien tiene más riesgo.',
    },
    objetivos: [
      'Aplicar la clasificación ABE.',
      'Elegir el tratamiento inicial.',
      'Reconocer el papel de los eosinófilos.',
      'Revisar la indicación de ICS.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'Grupo A', definicion: 'Pocos síntomas y bajo riesgo.' },
      { icono: 'Activity', termino: 'Grupo B', definicion: 'Más síntomas sin exacerbaciones de riesgo.' },
      { icono: 'AlertTriangle', termino: 'Grupo E', definicion: 'Dos moderadas o una grave.' },
      { icono: 'TestTube', termino: 'Eosinófilos', definicion: 'Guían el uso de ICS en grupo E.' },
    ],
    mapa: {
      centro: 'Clasificación ABE',
      ramas: [
        { titulo: 'A', icono: 'Layers', nodos: ['0-1 moderada', 'mMRC 0-1', 'CAT bajo'] },
        { titulo: 'B', icono: 'Activity', nodos: ['mMRC 2+', 'CAT 10+', 'Sin riesgo'] },
        { titulo: 'E', icono: 'AlertTriangle', nodos: ['2 moderadas', '1 grave', 'Riesgo alto'] },
        { titulo: 'ICS', icono: 'TestTube', nodos: ['Eosinófilos 300+', 'Exacerbaciones', 'Neumonía'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo se clasifica',
        parrafos: [
          'El grupo A incluye pacientes con 0 o 1 exacerbación moderada que no lleva a hospitalización y pocos síntomas. El grupo B incluye pacientes con más síntomas pero sin exacerbaciones de riesgo. El grupo E incluye pacientes con dos o más exacerbaciones moderadas o al menos una que requiera hospitalización.',
          'Los síntomas se miden con mMRC o CAT. La clasificación se revisa en cada control porque los grupos cambian con las exacerbaciones y la evolución clínica.',
        ],
      },
      {
        titulo: 'Tratamiento inicial',
        parrafos: [
          'En el grupo A se usa un broncodilatador, de acción corta o prolongada. En el grupo B se recomienda LABA+LAMA, preferiblemente en un solo inhalador. En el grupo E se recomienda LABA+LAMA y se añade ICS si los eosinófilos en sangre son de 300 células/µL o más; con valores entre 100 y 299 se considera de forma individual.',
          'La elección del dispositivo depende de la capacidad inspiratoria, la destreza y la cobertura. El rescate con SABA o SAMA se mantiene según necesidad.',
        ],
      },
      {
        titulo: 'ICS y seguridad',
        parrafos: [
          'El ICS reduce exacerbaciones en pacientes con inflamación tipo 2, pero aumenta el riesgo de neumonía. No se indica de forma rutinaria en la EPOC ni en monoterapia. La indicación se revisa periódicamente y se retira si el paciente deja de tener exacerbaciones y los eosinófilos son bajos.',
          'El QF verifica que el paciente del grupo E tenga el ICS indicado y que el del grupo B no lo reciba sin criterio. También revisa la técnica del dispositivo combinado y la adherencia.',
        ],
      },
    ],
    proceso: {
      titulo: 'Clasificación y elección',
      pasos: [
        { titulo: 'Síntomas', detalle: 'mMRC o CAT.', icono: 'ClipboardList', evidencia: 'Puntaje.' },
        { titulo: 'Exacerbaciones', detalle: 'Moderadas y graves.', icono: 'AlertTriangle', evidencia: 'Historia.' },
        { titulo: 'Grupo', detalle: 'A, B o E.', icono: 'Layers', evidencia: 'Clasificación.' },
        { titulo: 'Eosinófilos', detalle: 'Guían el ICS.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Esquema', detalle: 'Broncodilatador ± ICS.', icono: 'Pill', evidencia: 'Fórmula.' },
      ],
    },
    caso: {
      titulo: 'Dos exacerbaciones y eosinófilos altos',
      contexto: 'Paciente con EPOC, dos exacerbaciones moderadas en el año, CAT 16 y eosinófilos de 340.',
      pregunta: '¿Qué tratamiento inicial corresponde?',
      opciones: [
        { texto: 'Solo SABA.', correcta: false, retro: 'No es suficiente en grupo E.' },
        { texto: 'LABA+LAMA más ICS.', correcta: true, retro: 'Grupo E con eosinófilos de 300 o más.' },
        { texto: 'Solo ICS.', correcta: false, retro: 'Nunca en monoterapia.' },
      ],
    },
    errores: [
      { error: 'Clasificar solo por FEV1.', correccion: 'Los síntomas y exacerbaciones definen.' },
      { error: 'Dar ICS a todos.', correccion: 'Riesgo de neumonía sin beneficio.' },
      { error: 'No revisar el grupo.', correccion: 'Cambia con el tiempo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué define el grupo E?', respuesta: 'Dos moderadas o una grave.' },
      { pregunta: '¿Qué tratamiento tiene el grupo B?', respuesta: 'LABA+LAMA.' },
      { pregunta: '¿Con qué eosinófilos se añade ICS?', respuesta: '300 células/µL o más.' },
    ],
    resumen: [
      'ABE combina síntomas y exacerbaciones.',
      'El grupo E es el de mayor riesgo.',
      'LABA+LAMA es la base en B y E.',
      'Los eosinófilos guían el ICS.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'ABE', descripcion: 'Matriz de grupos A, B y E con tratamiento inicial.', alt: 'Clasificación ABE y tratamiento inicial de la EPOC' },
    ],
    keywords: ['clasificación ABE', 'GOLD 2026 tratamiento', 'LABA LAMA', 'eosinófilos EPOC', 'ICS EPOC'],
  },
  {
    titulo: 'Seguimiento en EPOC: triple terapia, eosinófilos y retiro del corticoide inhalado',
    duracion: 20,
    gancho: {
      titulo: 'Cuándo retirar el corticoide',
      texto: 'Un paciente lleva años con triple terapia, no ha tenido exacerbaciones y tiene eosinófilos de 80. El ICS puede aumentar el riesgo de neumonía sin beneficio. Revisar la indicación es tan importante como iniciarla.',
    },
    objetivos: [
      'Aplicar el seguimiento de la EPOC.',
      'Reconocer el lugar de la triple terapia.',
      'Interpretar los eosinófilos.',
      'Decidir el retiro del ICS.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'Triple terapia', definicion: 'ICS-LABA-LAMA en un inhalador.' },
      { icono: 'TestTube', termino: 'Eosinófilos', definicion: 'Biomarcador para mantener o retirar ICS.' },
      { icono: 'AlertTriangle', termino: 'Neumonía', definicion: 'Riesgo del ICS en EPOC.' },
      { icono: 'Repeat', termino: 'Revisión', definicion: 'Evaluar indicación en cada control.' },
    ],
    mapa: {
      centro: 'Seguimiento EPOC',
      ramas: [
        { titulo: 'Evaluar', icono: 'ClipboardList', nodos: ['CAT', 'Exacerbaciones', 'Técnica'] },
        { titulo: 'Triple', icono: 'Layers', nodos: ['Exacerbadores', 'Eosinófilos', 'Un inhalador'] },
        { titulo: 'Retirar', icono: 'Repeat', nodos: ['Sin exacerbaciones', 'Eos bajos', 'Riesgo de neumonía'] },
        { titulo: 'Prevenir', icono: 'ShieldCheck', nodos: ['Vacunas', 'Cesación', 'Rehabilitación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué evaluar',
        parrafos: [
          'En cada control se revisan síntomas con CAT o mMRC, exacerbaciones, uso de rescate, técnica inhalatoria, adherencia y comorbilidades. También se revisan los efectos adversos y la indicación de cada fármaco.',
          'La triple terapia con ICS-LABA-LAMA reduce exacerbaciones y mortalidad en pacientes con exacerbaciones frecuentes e inflamación tipo 2. Se prefiere en un solo inhalador para simplificar el esquema.',
        ],
      },
      {
        titulo: 'Eosinófilos y retiro del ICS',
        parrafos: [
          'Los eosinófilos en sangre ayudan a predecir la respuesta al ICS. Valores de 300 o más apoyan su uso en el grupo E; valores por debajo de 100 hacen menos probable el beneficio y aumentan la importancia del riesgo de neumonía.',
          'El retiro del ICS se considera en pacientes sin exacerbaciones, con eosinófilos bajos o con riesgo elevado de neumonía. Debe hacerse de forma planificada, con seguimiento y manteniendo LABA+LAMA. No se suspende de forma brusca sin valoración.',
        ],
      },
      {
        titulo: 'Prevención y educación',
        parrafos: [
          'El seguimiento incluye vacunación contra influenza, neumococo, VSR y COVID según indicación, cesación tabáquica y rehabilitación pulmonar. La educación sobre técnica, plan de acción y signos de alarma reduce exacerbaciones.',
          'El QF documenta la revisión de la medicación, la intervención y el plan acordado. La decisión de mantener o retirar el ICS se comunica al médico con datos objetivos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Revisión del esquema',
      pasos: [
        { titulo: 'Síntomas', detalle: 'CAT y mMRC.', icono: 'ClipboardList', evidencia: 'Puntaje.' },
        { titulo: 'Exacerbaciones', detalle: 'Número y gravedad.', icono: 'AlertTriangle', evidencia: 'Historia.' },
        { titulo: 'Eosinófilos', detalle: 'Apoyan el ICS.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Revisar', detalle: 'Mantener o retirar ICS.', icono: 'Repeat', evidencia: 'Decisión.' },
        { titulo: 'Educar', detalle: 'Técnica y prevención.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Triple terapia sin exacerbaciones',
      contexto: 'Paciente con EPOC en triple terapia, sin exacerbaciones en dos años, eosinófilos de 80 y dos neumonías previas.',
      pregunta: '¿Qué se valora?',
      opciones: [
        { texto: 'Mantener la triple terapia indefinidamente.', correcta: false, retro: 'El riesgo de neumonía pesa.' },
        { texto: 'Valorar retiro del ICS y mantener LABA+LAMA.', correcta: true, retro: 'Eosinófilos bajos y neumonías previas.' },
        { texto: 'Suspender todo tratamiento.', correcta: false, retro: 'Los broncodilatadores son la base.' },
      ],
    },
    errores: [
      { error: 'Mantener ICS sin revisar.', correccion: 'El riesgo de neumonía aumenta.' },
      { error: 'Retirar sin plan.', correccion: 'Debe ser supervisado.' },
      { error: 'No revisar técnica.', correccion: 'Afecta el control.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la triple terapia?', respuesta: 'ICS-LABA-LAMA.' },
      { pregunta: '¿Qué eosinófilos apoyan el ICS?', respuesta: '300 o más.' },
      { pregunta: '¿Cuándo se valora retirar el ICS?', respuesta: 'Sin exacerbaciones y eosinófilos bajos.' },
    ],
    resumen: [
      'El seguimiento revisa indicación y técnica.',
      'La triple terapia se usa en exacerbadores con tipo 2.',
      'Los eosinófilos guían el ICS.',
      'El retiro se planifica y se supervisa.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Seguimiento', descripcion: 'Ficha de revisión con eosinófilos y decisiones sobre ICS.', alt: 'Seguimiento de la EPOC y retiro del ICS' },
    ],
    keywords: ['triple terapia EPOC', 'retiro ICS EPOC', 'eosinófilos EPOC', 'seguimiento EPOC'],
  },
  {
    titulo: 'Roflumilast, azitromicina y biológicos (dupilumab y mepolizumab) en EPOC',
    duracion: 20,
    gancho: {
      titulo: 'Cuando la triple terapia no basta',
      texto: 'Un paciente con EPOC, bronquitis crónica y exacerbaciones sigue con crisis pese a la triple terapia. El roflumilast, la azitromicina y los biológicos son opciones para perfiles seleccionados. Elegirlos exige criterio y seguimiento.',
    },
    objetivos: [
      'Aplicar la indicación del roflumilast.',
      'Reconocer el uso de azitromicina.',
      'Comparar los biológicos en EPOC.',
      'Revisar seguridad y seguimiento.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Roflumilast', definicion: 'Inhibidor de PDE4 para bronquitis crónica.' },
      { icono: 'Bug', termino: 'Azitromicina', definicion: 'Macrólido en exacerbadores seleccionados.' },
      { icono: 'ShieldCheck', termino: 'Dupilumab', definicion: 'Anti-IL-4Rα en inflamación tipo 2.' },
      { icono: 'Target', termino: 'Mepolizumab', definicion: 'Anti-IL-5 en EPOC eosinofílica.' },
    ],
    mapa: {
      centro: 'Opciones EPOC',
      ramas: [
        { titulo: 'Roflumilast', icono: 'Pill', nodos: ['Bronquitis', 'FEV1 bajo', 'Diarrea'] },
        { titulo: 'Azitromicina', icono: 'Bug', nodos: ['Exacerbadores', 'QT', 'Resistencia'] },
        { titulo: 'Dupilumab', icono: 'ShieldCheck', nodos: ['Eos 300+', 'Tipo 2', 'Exacerbaciones'] },
        { titulo: 'Mepolizumab', icono: 'Target', nodos: ['Eos 150+', 'Anti-IL-5', 'Exacerbaciones'] },
      ],
    },
    secciones: [
      {
        titulo: 'Roflumilast y azitromicina',
        parrafos: [
          'El roflumilast es un inhibidor de la fosfodiesterasa 4 indicado en EPOC grave con bronquitis crónica y exacerbaciones a pesar de la triple terapia. La dosis es 500 microgramos al día. Puede causar diarrea, náuseas, pérdida de peso, dolor abdominal y alteraciones del ánimo, incluida ideación suicida. No se recomienda en personas con bajo peso.',
          'La azitromicina a largo plazo se considera en exacerbadores seleccionados, sobre todo si no son fumadores actuales. Debe vigilarse el QT, la audición y la resistencia antimicrobiana. No es una opción universal.',
        ],
      },
      {
        titulo: 'Biológicos en EPOC',
        parrafos: [
          'El dupilumab, anti-IL-4Rα, se usa en EPOC con inflamación tipo 2, definida por eosinófilos de 300 o más, y exacerbaciones a pesar de la triple terapia. El mepolizumab, anti-IL-5, se ha estudiado en EPOC eosinofílica con eosinófilos de 150 o más y reduce exacerbaciones en perfiles seleccionados.',
          'Los biológicos no reemplazan la terapia inhalada óptima ni la rehabilitación. Su acceso en Colombia es limitado y requiere justificación clínica. El QF participa en la verificación de criterios, la cadena de frío y el seguimiento.',
        ],
      },
      {
        titulo: 'Seguridad y seguimiento',
        parrafos: [
          'Cada opción tiene un perfil de seguridad distinto. El roflumilast exige vigilar el ánimo y el peso; la azitromicina, el QT y la audición; los biológicos, las reacciones en el sitio de inyección y la hipersensibilidad.',
          'La respuesta se evalúa con exacerbaciones, síntomas, función pulmonar y calidad de vida. Si no hay beneficio, se revisa la adherencia, el fenotipo y la indicación antes de continuar.',
        ],
      },
    ],
    proceso: {
      titulo: 'Selección de opciones',
      pasos: [
        { titulo: 'Confirmar', detalle: 'Triple terapia optimizada.', icono: 'ClipboardCheck', evidencia: 'Esquema.' },
        { titulo: 'Fenotipo', detalle: 'Bronquitis o eosinófilos.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Elegir', detalle: 'Roflumilast, macrólido o biológico.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Vigilar', detalle: 'Seguridad específica.', icono: 'AlertTriangle', evidencia: 'Control.' },
        { titulo: 'Evaluar', detalle: 'Respuesta y continuidad.', icono: 'LineChart', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Bronquitis crónica y exacerbaciones',
      contexto: 'Paciente con EPOC grave, bronquitis crónica y exacerbaciones pese a triple terapia; FEV1 de 38 %.',
      pregunta: '¿Qué opción es candidata?',
      opciones: [
        { texto: 'Roflumilast.', correcta: true, retro: 'Indicado en bronquitis crónica con exacerbaciones.' },
        { texto: 'Duplicar el ICS.', correcta: false, retro: 'No aporta y aumenta riesgo.' },
        { texto: 'Suspender LABA+LAMA.', correcta: false, retro: 'Son la base del tratamiento.' },
      ],
    },
    errores: [
      { error: 'Usar roflumilast en bajo peso.', correccion: 'Puede agravar la pérdida de peso.' },
      { error: 'Dar azitromicina a todos.', correccion: 'Riesgo de QT y resistencia.' },
      { error: 'Elegir biológico sin eosinófilos.', correccion: 'El fenotipo es requisito.' },
    ],
    comprueba: [
      { pregunta: '¿Dónde se usa roflumilast?', respuesta: 'EPOC grave con bronquitis crónica y exacerbaciones.' },
      { pregunta: '¿Qué vigilar con azitromicina?', respuesta: 'QT, audición y resistencia.' },
      { pregunta: '¿Qué eosinófilos orientan dupilumab?', respuesta: '300 o más.' },
    ],
    resumen: [
      'Hay opciones para exacerbadores seleccionados.',
      'El roflumilast requiere vigilancia del ánimo y peso.',
      'La azitromicina tiene riesgos específicos.',
      'Los biológicos exigen fenotipo y seguimiento.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Daxas 500 microgramos comprimidos recubiertos con película. Revisión 2024.', url: 'https://cima.aemps.es/cima/dochtml/ft/09486001/FT_09486001.html' },
    ],
    imagenes: [
      { ubicacion: 'Opciones', descripcion: 'Árbol de decisión para roflumilast, azitromicina y biológicos.', alt: 'Roflumilast, azitromicina y biológicos en EPOC' },
    ],
    keywords: ['roflumilast EPOC', 'azitromicina EPOC', 'dupilumab EPOC', 'mepolizumab EPOC'],
  },
  {
    titulo: 'Exacerbaciones del asma: manejo inicial, corticoide oral y alta segura',
    duracion: 20,
    gancho: {
      titulo: 'El alta sin plan',
      texto: 'Una paciente mejora en urgencias y sale con la misma fórmula que tenía antes de la crisis. Sin revisar el tratamiento, sin plan de acción y sin control, la próxima exacerbación es cuestión de tiempo. El alta segura es parte del tratamiento.',
    },
    objetivos: [
      'Reconocer la gravedad de la exacerbación.',
      'Aplicar el tratamiento inicial.',
      'Dosificar el corticoide sistémico.',
      'Diseñar un alta segura.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Exacerbación', definicion: 'Empeoramiento agudo que requiere cambio de tratamiento.' },
      { icono: 'Zap', termino: 'SABA', definicion: 'Broncodilatador repetido en crisis.' },
      { icono: 'Pill', termino: 'Prednisona', definicion: '40-50 mg por 5-7 días en adultos.' },
      { icono: 'FileCheck', termino: 'Alta', definicion: 'Revisión, plan y seguimiento.' },
    ],
    mapa: {
      centro: 'Crisis de asma',
      ramas: [
        { titulo: 'Gravedad', icono: 'Gauge', nodos: ['Leve', 'Moderada', 'Grave', 'Riesgo vital'] },
        { titulo: 'Tratamiento', icono: 'Zap', nodos: ['SABA', 'Ipratropio', 'Oxígeno'] },
        { titulo: 'Corticoide', icono: 'Pill', nodos: ['Prednisona', '5-7 días', 'Sin taper'] },
        { titulo: 'Alta', icono: 'FileCheck', nodos: ['ICS', 'Plan', 'Control'] },
      ],
    },
    secciones: [
      {
        titulo: 'Gravedad y tratamiento inicial',
        parrafos: [
          'La exacerbación es un empeoramiento agudo de los síntomas que requiere un cambio de tratamiento. Se valora la gravedad con la clínica, la saturación, la frecuencia respiratoria, el habla y el uso de músculos accesorios. Los casos graves o con riesgo vital requieren atención urgente y oxígeno.',
          'El tratamiento inicial incluye SABA repetido, ipratropio en casos moderados o graves y oxígeno para mantener una saturación de 93-95 % en adultos. El ICS-formoterol puede usarse como alternativa en crisis leves en el marco de la vía 1, según la indicación aprobada.',
        ],
      },
      {
        titulo: 'Corticoide sistémico',
        parrafos: [
          'En adultos, la prednisona o prednisolona se usa a 40-50 mg al día por 5-7 días. En niños, 1-2 mg/kg/día con un máximo de 40 mg por 3-5 días. No se requiere reducción gradual si el curso es corto. El corticoide oral reduce recaídas y hospitalizaciones.',
          'Los antibióticos no se usan de rutina. Se reservan para infección bacteriana documentada o sospecha alta. La fisioterapia respiratoria y la educación forman parte del manejo.',
        ],
      },
      {
        titulo: 'Alta segura',
        parrafos: [
          'Antes del alta se revisa el tratamiento de mantenimiento, se asegura que incluya ICS, se corrige la técnica y se entrega un plan de acción escrito. Se agenda control en dos a siete días y se revisan adherencia, exposiciones y comorbilidades.',
          'Una sola exacerbación que requiera urgencias o corticoide oral obliga a revisar el tratamiento. Si las exacerbaciones son recurrentes, se valora el fenotipo y la remisión a especialista. El QF participa en la conciliación y la educación al alta.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejo de la crisis',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Gravedad y saturación.', icono: 'Gauge', evidencia: 'Valoración.' },
        { titulo: 'Broncodilatar', detalle: 'SABA y oxígeno.', icono: 'Zap', evidencia: 'Registro.' },
        { titulo: 'Corticoide', detalle: 'Prednisona según edad.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Revisar', detalle: 'Mantenimiento y técnica.', icono: 'Eye', evidencia: 'Nota.' },
        { titulo: 'Alta', detalle: 'Plan y control.', icono: 'FileCheck', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: 'Alta tras crisis',
      contexto: 'Paciente que mejora tras una exacerbación y va a ser dada de alta con la misma fórmula previa, sin ICS.',
      pregunta: '¿Qué debe verificarse antes del alta?',
      opciones: [
        { texto: 'Solo que no tenga disnea.', correcta: false, retro: 'El riesgo persiste.' },
        { texto: 'Tratamiento con ICS, técnica, plan y control.', correcta: true, retro: 'El alta segura reduce recaídas.' },
        { texto: 'Suspender todo tratamiento.', correcta: false, retro: 'Empeoraría.' },
      ],
    },
    errores: [
      { error: 'No indicar corticoide sistémico.', correccion: 'Reduce recaídas.' },
      { error: 'Usar antibióticos de rutina.', correccion: 'No están indicados.' },
      { error: 'Alta sin plan ni control.', correccion: 'Aumenta el riesgo.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis de prednisona en adultos?', respuesta: '40-50 mg al día por 5-7 días.' },
      { pregunta: '¿Se requiere taper?', respuesta: 'No en cursos cortos.' },
      { pregunta: '¿Qué debe incluir el alta?', respuesta: 'ICS, técnica, plan y control.' },
    ],
    resumen: [
      'La gravedad guía el manejo inicial.',
      'El corticoide oral es parte del tratamiento.',
      'Los antibióticos no son de rutina.',
      'El alta segura incluye ICS y seguimiento.',
    ],
    referencias: [
      { cita: 'Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.', url: 'https://ginasthma.org/2026-gina-strategy-report/' },
    ],
    imagenes: [
      { ubicacion: 'Crisis', descripcion: 'Flujo de manejo de la exacerbación y alta segura.', alt: 'Exacerbaciones del asma y alta segura' },
    ],
    keywords: ['exacerbación asma', 'prednisona asma', 'alta segura asma', 'crisis asmática'],
  },
  {
    titulo: 'Exacerbaciones de la EPOC: broncodilatadores, corticoide sistémico y antibióticos',
    duracion: 25,
    gancho: {
      titulo: 'Oxígeno con cuidado',
      texto: 'Un paciente con EPOC recibe oxígeno a alto flujo y pierde el estímulo respiratorio. En la exacerbación, la meta de saturación es 88-92 %. El manejo correcto combina broncodilatadores, corticoide y antibióticos solo cuando están indicados.',
    },
    objetivos: [
      'Reconocer y clasificar la exacerbación.',
      'Aplicar broncodilatadores y corticoide.',
      'Indicar antibióticos con criterio.',
      'Diseñar el egreso y la prevención.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Exacerbación', definicion: 'Empeoramiento de disnea, tos o esputo.' },
      { icono: 'Wind', termino: 'SABA+SAMA', definicion: 'Broncodilatadores iniciales.' },
      { icono: 'Pill', termino: 'Prednisona', definicion: '40 mg por 5 días.' },
      { icono: 'Bug', termino: 'Antibiótico', definicion: 'Si hay esputo purulento y criterios.' },
    ],
    mapa: {
      centro: 'Crisis EPOC',
      ramas: [
        { titulo: 'Gravedad', icono: 'Gauge', nodos: ['Leve', 'Moderada', 'Grave'] },
        { titulo: 'Broncodilatador', icono: 'Wind', nodos: ['SABA', 'SAMA', 'Nebulización'] },
        { titulo: 'Sistémico', icono: 'Pill', nodos: ['Prednisona', '5 días', 'Sin taper'] },
        { titulo: 'Antibiótico', icono: 'Bug', nodos: ['Purulento', 'Gravedad', 'Resistencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Definición y gravedad',
        parrafos: [
          'La exacerbación de la EPOC es un empeoramiento agudo de la disnea, la tos o el esputo que requiere tratamiento adicional. Se clasifica en leve, moderada o grave según la necesidad de broncodilatadores, corticoide, antibióticos, urgencias o hospitalización.',
          'La valoración incluye saturación, frecuencia respiratoria, gasometría si hay gravedad, comorbilidades y capacidad de manejo en casa. La radiografía y los cultivos se reservan para casos seleccionados.',
        ],
      },
      {
        titulo: 'Tratamiento',
        parrafos: [
          'Se usan broncodilatadores de acción corta, SABA con o sin SAMA, preferiblemente con inhalador y cámara o nebulización según el caso. El corticoide sistémico, prednisona 40 mg al día por 5 días, acorta la recuperación y mejora la función pulmonar. No requiere reducción gradual en cursos cortos.',
          'Los antibióticos se indican si hay aumento de la purulencia del esputo junto con aumento del volumen o de la disnea, o si el paciente requiere ventilación. La elección depende de la gravedad, la resistencia local y las alergias. La oxigenoterapia debe mantener una saturación de 88-92 % para evitar la hipercapnia.',
        ],
      },
      {
        titulo: 'Egreso y prevención',
        parrafos: [
          'Al egreso se revisa la medicación, se corrige la técnica, se asegura el tratamiento de mantenimiento y se completa el esquema antibiótico si se indicó. Se agenda control en una a cuatro semanas y se valora la rehabilitación pulmonar.',
          'La prevención incluye vacunación, cesación tabáquica, plan de acción y revisión de la indicación de ICS. El QF concilia la medicación y educa sobre signos de alarma y uso correcto de inhaladores.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejo de la exacerbación',
      pasos: [
        { titulo: 'Clasificar', detalle: 'Leve, moderada o grave.', icono: 'Gauge', evidencia: 'Valoración.' },
        { titulo: 'Broncodilatar', detalle: 'SABA ± SAMA.', icono: 'Wind', evidencia: 'Registro.' },
        { titulo: 'Corticoide', detalle: 'Prednisona 40 mg por 5 días.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Antibiótico', detalle: 'Solo con criterios.', icono: 'Bug', evidencia: 'Decisión.' },
        { titulo: 'Egreso', detalle: 'Conciliación y control.', icono: 'FileCheck', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: 'Exacerbación con esputo purulento',
      contexto: 'Paciente con EPOC, aumento de disnea y esputo purulento, sin criterios de hospitalización.',
      pregunta: '¿Qué tratamiento corresponde?',
      opciones: [
        { texto: 'Solo SABA.', correcta: false, retro: 'Faltan corticoide y antibiótico.' },
        { texto: 'SABA, prednisona y antibiótico.', correcta: true, retro: 'Cumple criterios de antibiótico.' },
        { texto: 'Solo antibiótico.', correcta: false, retro: 'El broncodilatador es esencial.' },
      ],
    },
    errores: [
      { error: 'Oxígeno a alto flujo sin control.', correccion: 'Meta 88-92 %.' },
      { error: 'Antibiótico sin criterios.', correccion: 'Resistencia innecesaria.' },
      { error: 'No revisar el mantenimiento.', correccion: 'La exacerbación revela fallas.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis de prednisona?', respuesta: '40 mg al día por 5 días.' },
      { pregunta: '¿Meta de saturación?', respuesta: '88-92 %.' },
      { pregunta: '¿Cuándo usar antibiótico?', respuesta: 'Esputo purulento con aumento de volumen o disnea.' },
    ],
    resumen: [
      'La exacerbación se clasifica por gravedad.',
      'SABA±SAMA y corticoide sistémico son la base.',
      'El antibiótico tiene criterios claros.',
      'El egreso incluye conciliación y prevención.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Exacerbación', descripcion: 'Flujo de tratamiento y criterios de antibiótico.', alt: 'Exacerbaciones de la EPOC' },
    ],
    keywords: ['exacerbación EPOC', 'prednisona EPOC', 'antibiótico EPOC', 'oxígeno EPOC'],
  },
  {
    titulo: 'Caso: paciente con EPOC al egreso de una hospitalización por exacerbación',
    duracion: 25,
    gancho: {
      titulo: 'El egreso que decide el reingreso',
      texto: 'Un paciente sale del hospital tras una exacerbación con la medicación incompleta y sin control. La conciliación al egreso, la técnica y el seguimiento temprano reducen los reingresos. El caso integra todo el manejo de la EPOC.',
    },
    objetivos: [
      'Aplicar la conciliación al egreso.',
      'Revisar el tratamiento de mantenimiento.',
      'Diseñar educación y seguimiento.',
      'Prevenir el reingreso.',
    ],
    conceptos: [
      { icono: 'Repeat', termino: 'Conciliación', definicion: 'Comparar medicación previa y nueva.' },
      { icono: 'Eye', termino: 'Técnica', definicion: 'Verificar el dispositivo al alta.' },
      { icono: 'CalendarClock', termino: 'Control', definicion: 'Seguimiento en una a cuatro semanas.' },
      { icono: 'ShieldCheck', termino: 'Prevención', definicion: 'Vacunas, cesación y plan.' },
    ],
    mapa: {
      centro: 'Egreso EPOC',
      ramas: [
        { titulo: 'Medicación', icono: 'Pill', nodos: ['Conciliar', 'Mantenimiento', 'Rescate'] },
        { titulo: 'Técnica', icono: 'Eye', nodos: ['Dispositivo', 'Demostración', 'Cámara'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['Alarma', 'Plan', 'Vacunas'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['1-4 semanas', 'Teléfono', 'Rehabilitación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Conciliación',
        parrafos: [
          'Se comparan los medicamentos previos con los del egreso para detectar omisiones, duplicidades y cambios. Se verifica que el tratamiento de mantenimiento esté completo, que el rescate sea el adecuado y que no haya ICS sin indicación ni corticoides sistémicos crónicos.',
          'El esquema debe ser comprensible y cubierto por el paciente. Si hay barreras de acceso, se buscan alternativas antes del alta.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'Se enseña la técnica del dispositivo, se entrega un plan de acción escrito y se explican los signos de alarma. Se refuerzan la vacunación, la cesación tabáquica y la adherencia. La familia o el cuidador participan cuando es posible.',
          'La educación debe adaptarse al nivel de alfabetización y al contexto. El teach-back confirma la comprensión y detecta errores antes del alta.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se agenda control en una a cuatro semanas y se ofrece contacto telefónico temprano. Se revisan síntomas, técnica, adherencia, exacerbaciones y efectos adversos. La rehabilitación pulmonar mejora la capacidad funcional y reduce reingresos.',
          'El QF documenta la intervención y comunica los hallazgos al equipo. La continuidad entre hospital y atención primaria es clave para sostener el plan. El contacto telefónico a las 48-72 horas permite detectar deterioro, dudas sobre la medicación o barreras de acceso. Si el paciente no tiene cita pronta, se coordina con la EPS y se documenta. Estas acciones sencillas reducen las visitas a urgencias y los reingresos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Alta segura EPOC',
      pasos: [
        { titulo: 'Conciliar', detalle: 'Lista previa y nueva.', icono: 'Repeat', evidencia: 'Comparación.' },
        { titulo: 'Verificar', detalle: 'Mantenimiento y rescate.', icono: 'ClipboardCheck', evidencia: 'Esquema.' },
        { titulo: 'Enseñar', detalle: 'Técnica y plan.', icono: 'GraduationCap', evidencia: 'Demostración.' },
        { titulo: 'Prevenir', detalle: 'Vacunas y cesación.', icono: 'ShieldCheck', evidencia: 'Registro.' },
        { titulo: 'Seguir', detalle: 'Control y teléfono.', icono: 'CalendarClock', evidencia: 'Cita.' },
      ],
    },
    caso: {
      titulo: 'Egreso incompleto',
      contexto: 'Paciente con EPOC que egresa tras exacerbación con solo salbutamol y sin control.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Nada; ya está de alta.', correcta: false, retro: 'La conciliación es parte del egreso.' },
        { texto: 'Concilia, completa mantenimiento y agenda control.', correcta: true, retro: 'Reduce reingresos.' },
        { texto: 'Añade ICS sin criterio.', correcta: false, retro: 'Debe evaluarse la indicación.' },
      ],
    },
    errores: [
      { error: 'No conciliar la medicación.', correccion: 'Se pierden tratamientos.' },
      { error: 'No verificar la técnica.', correccion: 'El paciente puede no usarlo bien.' },
      { error: 'No agendar control.', correccion: 'El riesgo de reingreso aumenta.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es conciliar?', respuesta: 'Comparar medicación previa y nueva.' },
      { pregunta: '¿Cuándo se agenda control?', respuesta: 'En una a cuatro semanas.' },
      { pregunta: '¿Qué mejora la rehabilitación?', respuesta: 'Capacidad funcional y reingresos.' },
    ],
    resumen: [
      'El egreso es una intervención de seguridad.',
      'La conciliación detecta omisiones.',
      'La técnica y el plan escrito son claves.',
      'El seguimiento temprano reduce reingresos.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
      { cita: 'Cipolle RJ, Strand LM, Morley PC. Pharmaceutical care practice: the patient-centered approach to medication management services. 3.ª ed. McGraw-Hill; 2012.', url: 'https://www.mhprofessional.com/pharmaceutical-care-practice-9780071759029-usa' },
    ],
    imagenes: [
      { ubicacion: 'Caso', descripcion: 'Lista de conciliación al egreso y plan de seguimiento.', alt: 'Caso de EPOC al egreso hospitalario' },
    ],
    keywords: ['egreso EPOC', 'conciliación medicamentos', 'reingreso EPOC', 'alta segura EPOC'],
  },
  {
    titulo: 'Introducción a la unidad: técnica, adherencia, prevención y seguimiento',
    duracion: 15,
    gancho: {
      titulo: 'El medicamento correcto con la técnica incorrecta',
      texto: 'Un inhalador adecuado puede fracasar si el paciente no lo usa bien. La técnica, la adherencia y la prevención determinan el resultado tanto como la molécula. Esta unidad convierte esos factores en acciones medibles.',
    },
    objetivos: [
      'Reconocer el peso de la técnica y la adherencia.',
      'Aplicar la prevención en asma y EPOC.',
      'Diseñar un seguimiento medible.',
      'Conectar dispositivo, paciente y educación.',
    ],
    conceptos: [
      { icono: 'Eye', termino: 'Técnica', definicion: 'Errores críticos anulan el efecto.' },
      { icono: 'Users', termino: 'Adherencia', definicion: 'Uso real frente al prescrito.' },
      { icono: 'ShieldCheck', termino: 'Prevención', definicion: 'Vacunas, cesación y exposiciones.' },
      { icono: 'LineChart', termino: 'Indicadores', definicion: 'ACT, CAT, rescate y exacerbaciones.' },
    ],
    mapa: {
      centro: 'Resultados',
      ramas: [
        { titulo: 'Dispositivo', icono: 'Package', nodos: ['Elección', 'Técnica', 'Cámara'] },
        { titulo: 'Adherencia', icono: 'Users', nodos: ['Medición', 'Barreras', 'Recordatorios'] },
        { titulo: 'Prevención', icono: 'ShieldCheck', nodos: ['Vacunas', 'Cesación', 'Ambiente'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['Indicadores', 'Control', 'Ajuste'] },
      ],
    },
    secciones: [
      {
        titulo: 'Técnica y dispositivo',
        parrafos: [
          'La vía inhalada depende del dispositivo. Un inhalador presurizado requiere coordinación o cámara espaciadora; un polvo seco exige flujo inspiratorio suficiente. Los errores críticos, como no exhalar antes, no sellar la boquilla o no inhalar profundo, reducen la deposición pulmonar.',
          'La elección del dispositivo debe considerar la edad, la capacidad manual, el flujo inspiratorio, la preferencia y la cobertura. La demostración y la verificación práctica son más eficaces que la explicación verbal.',
        ],
      },
      {
        titulo: 'Adherencia',
        parrafos: [
          'La adherencia se mide con registros de dispensación, cuestionarios validados o conteo de dosis. Las causas de baja adherencia incluyen olvido, costo, miedo a los efectos adversos, creencias y complejidad del esquema. La entrevista sin juicio detecta barreras.',
          'Las intervenciones incluyen simplificar el esquema, usar recordatorios, vincular la toma a rutinas y resolver el acceso. En asma, la baja adherencia al ICS se asocia con exacerbaciones.',
        ],
      },
      {
        titulo: 'Prevención y seguimiento',
        parrafos: [
          'La prevención incluye vacunación contra influenza, neumococo, VSR y COVID según indicación, cesación tabáquica y reducción de exposiciones. En EPOC, la rehabilitación pulmonar mejora la capacidad funcional y la calidad de vida.',
          'El seguimiento usa indicadores simples: ACT o CAT, uso de rescate, exacerbaciones, ciclos de corticoide oral, técnica correcta y adherencia. La revisión periódica permite ajustar y demostrar resultados.',
        ],
      },
    ],
    proceso: {
      titulo: 'Mejora de resultados',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Técnica y adherencia.', icono: 'Eye', evidencia: 'Entrevista.' },
        { titulo: 'Simplificar', detalle: 'Esquema y dispositivo.', icono: 'Settings', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Demostración y teach-back.', icono: 'GraduationCap', evidencia: 'Prueba.' },
        { titulo: 'Prevenir', detalle: 'Vacunas y cesación.', icono: 'ShieldCheck', evidencia: 'Registro.' },
        { titulo: 'Medir', detalle: 'Indicadores de control.', icono: 'LineChart', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Inhalador sin efecto',
      contexto: 'Paciente con dosis correcta de ICS pero mal control; al observar, no exhala antes de inhalar.',
      pregunta: '¿Qué prioriza?',
      opciones: [
        { texto: 'Cambiar el medicamento.', correcta: false, retro: 'El problema es la técnica.' },
        { texto: 'Corregir la técnica y verificar en casa.', correcta: true, retro: 'El error crítico explica el fracaso.' },
        { texto: 'Duplicar la dosis.', correcta: false, retro: 'No corrige la causa.' },
      ],
    },
    errores: [
      { error: 'Explicar sin demostrar.', correccion: 'La práctica corrige errores.' },
      { error: 'Asumir adherencia.', correccion: 'Debe medirse.' },
      { error: 'Olvidar la prevención.', correccion: 'Las vacunas reducen complicaciones.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es un error crítico?', respuesta: 'Un paso que anula la deposición.' },
      { pregunta: '¿Cómo se mide la adherencia?', respuesta: 'Dispensación, cuestionarios o conteo.' },
      { pregunta: '¿Qué indicadores se usan?', respuesta: 'ACT, CAT, rescate y exacerbaciones.' },
    ],
    resumen: [
      'La técnica puede determinar el éxito.',
      'La adherencia se mide y se aborda.',
      'La prevención es parte del tratamiento.',
      'El seguimiento usa indicadores simples.',
    ],
    referencias: [
      { cita: 'Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.', url: 'https://ginasthma.org/2026-gina-strategy-report/' },
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Unidad 5', descripcion: 'Triángulo entre dispositivo, paciente y educación.', alt: 'Técnica, adherencia y seguimiento en asma y EPOC' },
    ],
    keywords: ['técnica inhalatoria', 'adherencia inhaladores', 'prevención asma EPOC', 'seguimiento farmacoterapéutico'],
  },
  {
    titulo: 'Tipos de dispositivos de inhalación y criterios de selección',
    duracion: 15,
    gancho: {
      titulo: 'El dispositivo que el paciente no puede usar',
      texto: 'Un anciano con artrosis recibe un polvo seco que requiere fuerza inspiratoria y destreza. No lo usa bien y culpa al medicamento. Elegir el dispositivo adecuado es tan importante como elegir la molécula.',
    },
    objetivos: [
      'Diferenciar los tipos de dispositivos.',
      'Aplicar criterios de selección.',
      'Reconocer requisitos de cada uno.',
      'Educar sobre limpieza y conservación.',
    ],
    conceptos: [
      { icono: 'Package', termino: 'pMDI', definicion: 'Inhalador presurizado; requiere coordinación.' },
      { icono: 'Wind', termino: 'Polvo seco', definicion: 'Requiere flujo inspiratorio suficiente.' },
      { icono: 'Droplets', termino: 'Respimat', definicion: 'Niebla suave de inhalación lenta.' },
      { icono: 'Users', termino: 'Selección', definicion: 'Edad, destreza, flujo y cobertura.' },
    ],
    mapa: {
      centro: 'Dispositivos',
      ramas: [
        { titulo: 'pMDI', icono: 'Package', nodos: ['Presurizado', 'Cámara', 'Coordinación'] },
        { titulo: 'Polvo seco', icono: 'Wind', nodos: ['Turbuhaler', 'Diskus', 'Flujo'] },
        { titulo: 'Respimat', icono: 'Droplets', nodos: ['Niebla', 'Inhalación lenta', 'Cebado'] },
        { titulo: 'Nebulizador', icono: 'Waves', nodos: ['Crisis', 'Casa', 'Higiene'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tipos de dispositivo',
        parrafos: [
          'El inhalador presurizado libera una dosis en aerosol y requiere coordinación entre la pulsación y la inhalación; la cámara espaciadora facilita el uso. El polvo seco se activa con la inspiración y exige un flujo suficiente; ejemplos son Turbuhaler, Diskus, Ellipta y Handihaler. El Respimat genera una niebla suave que se inhala lentamente.',
          'Los nebulizadores se usan en crisis o en pacientes que no pueden usar inhaladores, pero requieren equipo, higiene y tiempo. No son la primera opción para el mantenimiento si el paciente puede usar un inhalador.',
        ],
      },
      {
        titulo: 'Criterios de selección',
        parrafos: [
          'La elección considera la edad, la capacidad inspiratoria, la destreza manual, la agudeza visual, la cognición, la preferencia y la cobertura. Un paciente con artrosis o debilidad puede preferir un dispositivo de fácil activación; un niño suele necesitar inhalador presurizado con cámara.',
          'El dispositivo debe ser coherente con la dosis y la combinación indicadas. Si el medicamento solo existe en un dispositivo que el paciente no puede usar, se busca una alternativa con el prescriptor.',
        ],
      },
      {
        titulo: 'Educación y conservación',
        parrafos: [
          'Cada dispositivo tiene pasos específicos: cebado, agitación, posición, inhalación, enjuague y limpieza. El QF demuestra, pide al paciente que lo haga y corrige. También revisa el contador de dosis y la fecha de vencimiento.',
          'La limpieza y la conservación evitan obstrucciones y contaminación. Los inhaladores no se comparten y deben guardarse según la ficha técnica. La educación se refuerza en cada dispensación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Selección del dispositivo',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Edad, flujo y destreza.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Comparar', detalle: 'Dispositivos disponibles.', icono: 'Package', evidencia: 'Opciones.' },
        { titulo: 'Elegir', detalle: 'El más usable y cubierto.', icono: 'Target', evidencia: 'Decisión.' },
        { titulo: 'Demostrar', detalle: 'Técnica paso a paso.', icono: 'GraduationCap', evidencia: 'Práctica.' },
        { titulo: 'Verificar', detalle: 'Uso correcto en control.', icono: 'Eye', evidencia: 'Observación.' },
      ],
    },
    caso: {
      titulo: 'Artrosis y polvo seco',
      contexto: 'Paciente mayor con artrosis y EPOC recibe un polvo seco que no logra activar correctamente.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Insistir en el mismo dispositivo.', correcta: false, retro: 'No es usable para él.' },
        { texto: 'Buscar un dispositivo alternativo con el prescriptor.', correcta: true, retro: 'La usabilidad es parte de la indicación.' },
        { texto: 'Suspender el tratamiento.', correcta: false, retro: 'Necesita mantenimiento.' },
      ],
    },
    errores: [
      { error: 'Elegir solo por costo.', correccion: 'La usabilidad importa.' },
      { error: 'No demostrar la técnica.', correccion: 'La explicación no basta.' },
      { error: 'Compartir inhaladores.', correccion: 'Riesgo de infección.' },
    ],
    comprueba: [
      { pregunta: '¿Qué requiere el pMDI?', respuesta: 'Coordinación o cámara.' },
      { pregunta: '¿Qué requiere el polvo seco?', respuesta: 'Flujo inspiratorio suficiente.' },
      { pregunta: '¿Qué se evalúa para elegir?', respuesta: 'Edad, destreza, flujo y cobertura.' },
    ],
    resumen: [
      'Hay dispositivos para distintos perfiles.',
      'La selección considera al paciente.',
      'La demostración es indispensable.',
      'La conservación y limpieza importan.',
    ],
    referencias: [
      { cita: 'Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.', url: 'https://ginasthma.org/2026-gina-strategy-report/' },
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Dispositivos', descripcion: 'Comparación de inhaladores presurizados, polvo seco y Respimat.', alt: 'Tipos de dispositivos de inhalación' },
    ],
    keywords: ['dispositivos inhalación', 'pMDI cámara', 'polvo seco', 'Respimat', 'técnica inhalatoria'],
  },
];

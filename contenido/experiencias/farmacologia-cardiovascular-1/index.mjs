export const CURSO = 'Curso de Farmacología Cardiovascular';
export const MIGRACION = '143_experiencias_farmacologia_cardiovascular_1.sql';

export const CLASES = [
  {
    titulo: 'Introducción al curso: el QF frente a la enfermedad cardiovascular',
    duracion: 20,
    gancho: {
      titulo: 'La receta que nadie revisó',
      texto: 'Una paciente con hipertensión, diabetes y enfermedad renal recibe un AINE para el dolor de rodilla. Nadie revisó la combinación con el bloqueo del SRAA y el diurético. El químico farmacéutico puede detectarlo antes de que cause daño renal. Este curso prepara para esa intervención.',
    },
    objetivos: [
      'Reconocer el alcance de la farmacología cardiovascular.',
      'Identificar el rol del QF en el riesgo cardiovascular.',
      'Conocer las guías de referencia.',
      'Aplicar el contexto colombiano.',
    ],
    conceptos: [
      { icono: 'Activity', termino: 'Riesgo cardiovascular', definicion: 'Probabilidad de eventos cardíacos y cerebrovasculares.' },
      { icono: 'Pill', termino: 'Farmacoterapia', definicion: 'Selección, monitorización y ajuste de fármacos.' },
      { icono: 'Users', termino: 'SFT', definicion: 'Seguimiento farmacoterapéutico centrado en el paciente.' },
      { icono: 'Landmark', termino: 'CAC', definicion: 'Cuenta de Alto Costo: indicadores de HTA, DM y ERC.' },
    ],
    mapa: {
      centro: 'Farmacología cardiovascular',
      ramas: [
        { titulo: 'HTA', icono: 'Gauge', nodos: ['SRAA', 'Calcio', 'Tiazidas', 'Beta'] },
        { titulo: 'IC', icono: 'Activity', nodos: ['Cuatro pilares', 'Diuréticos', 'ARNI'] },
        { titulo: 'Isquemia', icono: 'Activity', nodos: ['Nitratos', 'Beta', 'Ranolazina'] },
        { titulo: 'Lípidos', icono: 'LineChart', nodos: ['Estatinas', 'Ezetimiba', 'iPCSK9'] },
      ],
    },
    secciones: [
      {
        titulo: 'Por qué este curso',
        parrafos: [
          'La enfermedad cardiovascular es la principal causa de muerte en Colombia y en el mundo. La hipertensión, la diabetes, la dislipidemia, la insuficiencia cardíaca y la cardiopatía isquémica comparten factores de riesgo y tratamientos que el químico farmacéutico debe dominar para dispensar, educar y hacer seguimiento con seguridad.',
          'El curso recorre los antihipertensivos, los fármacos de la insuficiencia cardíaca y la angina, los antiarrítmicos y los hipolipemiantes. No incluye anticoagulantes ni antiagregantes, que se abordan en el curso 12. El enfoque es aplicado: mecanismo, farmacocinética, indicaciones, seguridad, interacciones y monitorización.',
        ],
      },
      {
        titulo: 'El rol del químico farmacéutico',
        parrafos: [
          'El QF participa en la conciliación de la medicación, la evaluación de necesidad, efectividad y seguridad, la educación del paciente y el seguimiento farmacoterapéutico. También detecta problemas relacionados con medicamentos, propone ajustes al prescriptor y reporta reacciones adversas al INVIMA.',
          'En los programas de riesgo cardiovascular, su aporte se mide en indicadores concretos: control de presión arterial, adherencia, uso adecuado de combinaciones, monitorización de potasio y función renal, y reducción de eventos. La farmacia deja de ser un punto de dispensación y se convierte en un socio clínico.',
        ],
      },
      {
        titulo: 'Guías y contexto colombiano',
        parrafos: [
          'Las referencias del curso son la Guía de Práctica Clínica de hipertensión arterial del Ministerio de Salud actualizada en 2025, las guías ESC 2024-2026, la guía AHA/ACC 2025 y las fichas técnicas aprobadas por el INVIMA. En Colombia se suman el PBS, los mecanismos de MIPRES, la Cuenta de Alto Costo y las rutas integrales de atención.',
          'Cada clase conecta la evidencia con una situación colombiana y termina con un caso aplicado. La meta es formar criterio para decidir con el paciente y el equipo, no memorizar listas de dosis.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo estudiar el curso',
      pasos: [
        { titulo: 'Contextualizar', detalle: 'Leer el caso y la meta.', icono: 'Target', evidencia: 'Meta.' },
        { titulo: 'Comprender', detalle: 'Mecanismo e indicaciones.', icono: 'BookOpen', evidencia: 'Notas.' },
        { titulo: 'Aplicar', detalle: 'Resolver el caso.', icono: 'Workflow', evidencia: 'Decisión.' },
        { titulo: 'Verificar', detalle: 'Responder las comprobaciones.', icono: 'ClipboardCheck', evidencia: 'Resultado.' },
        { titulo: 'Transferir', detalle: 'Llevarlo a la práctica.', icono: 'Repeat', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: 'AINE en enfermedad cardiovascular',
      contexto: 'Paciente con HTA, diabetes y ERC que compra ibuprofeno sin fórmula para el dolor de rodilla.',
      pregunta: '¿Qué riesgos debe revisar el QF?',
      opciones: [
        { texto: 'Ninguno; el ibuprofeno es seguro.', correcta: false, retro: 'Puede empeorar la función renal y la presión.' },
        { texto: 'Interacción con SRAA y diurético, y daño renal.', correcta: true, retro: 'Es la triple amenaza.' },
        { texto: 'Solo el riesgo de alergia.', correcta: false, retro: 'Hay riesgos cardiovasculares y renales.' },
      ],
    },
    errores: [
      { error: 'Ver solo la receta y no la automedicación.', correccion: 'Los AINE son de venta libre.' },
      { error: 'Creer que la farmacia es solo dispensación.', correccion: 'El SFT agrega valor clínico.' },
      { error: 'Ignorar las guías nacionales.', correccion: 'El contexto colombiano condiciona el acceso.' },
    ],
    comprueba: [
      { pregunta: '¿Qué áreas cubre el curso?', respuesta: 'HTA, IC, isquemia, arritmias y lípidos.' },
      { pregunta: '¿Qué guía colombiana se usa en HTA?', respuesta: 'La GPC MinSalud actualizada en 2025.' },
      { pregunta: '¿Qué aporta el QF?', respuesta: 'Conciliación, educación y seguimiento.' },
    ],
    resumen: [
      'La enfermedad cardiovascular es prioritaria.',
      'El QF interviene en todo el ciclo del medicamento.',
      'Las guías nacionales e internacionales se complementan.',
      'Cada clase termina en un caso aplicado.',
    ],
    referencias: [
      { cita: 'Ministerio de Salud y Protección Social. Actualización parcial de la GPC de hipertensión arterial primaria (Guía n.º 18, 2.ª ed.). Bogotá; 2025.', url: 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/CA/gpc-actualizacion-parcial-hta-primaria-vps.pdf' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/' },
    ],
    imagenes: [
      { ubicacion: 'Introducción', descripcion: 'Farmacéutico revisando la medicación cardiovascular de un paciente.', alt: 'Introducción a la farmacología cardiovascular' },
    ],
    keywords: ['farmacología cardiovascular', 'rol químico farmacéutico', 'riesgo cardiovascular', 'GPC HTA 2025'],
  },
  {
    titulo: 'Cuenta de Alto Costo: HTA, diabetes y ERC en cifras',
    duracion: 20,
    gancho: {
      titulo: 'Siete millones en riesgo',
      texto: 'La Cuenta de Alto Costo reporta millones de colombianos con hipertensión, diabetes y enfermedad renal, y brechas persistentes de control. Conocer las cifras permite priorizar intervenciones y medir el impacto del servicio farmacéutico.',
    },
    objetivos: [
      'Interpretar los indicadores de la CAC.',
      'Reconocer las brechas de control.',
      'Relacionar las cifras con la práctica.',
      'Usar los datos para priorizar intervenciones.',
    ],
    conceptos: [
      { icono: 'Database', termino: 'CAC', definicion: 'Entidad que gestiona información de alto costo.' },
      { icono: 'Gauge', termino: 'Control', definicion: 'Porcentaje de pacientes que alcanzan metas.' },
      { icono: 'AlertTriangle', termino: 'Brecha', definicion: 'Diferencia entre lo deseable y lo real.' },
      { icono: 'LineChart', termino: 'Indicador', definicion: 'Medida para evaluar y comparar.' },
    ],
    mapa: {
      centro: 'Cifras CAC',
      ramas: [
        { titulo: 'HTA', icono: 'Gauge', nodos: ['Prevalencia', 'Control', 'Adherencia'] },
        { titulo: 'Diabetes', icono: 'TestTube', nodos: ['HbA1c', 'Tamizaje', 'Complicaciones'] },
        { titulo: 'ERC', icono: 'Droplets', nodos: ['Estadio', 'Albuminuria', 'Diálisis'] },
        { titulo: 'Gestión', icono: 'LineChart', nodos: ['Metas', 'Brechas', 'Intervención'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué mide la CAC',
        parrafos: [
          'La Cuenta de Alto Costo consolida información de las enfermedades de alto costo, entre ellas la hipertensión arterial, la diabetes mellitus y la enfermedad renal crónica. Reporta prevalencia, complicaciones, mortalidad y, sobre todo, indicadores de control: presión arterial, HbA1c, LDL, albuminuria y estadio de ERC.',
          'Los informes nacionales muestran que millones de colombianos tienen riesgo cardiovascular y que una proporción importante no alcanza las metas. Las brechas se concentran en diagnóstico oportuno, acceso a medicamentos, adherencia y seguimiento.',
        ],
      },
      {
        titulo: 'Por qué importan las cifras',
        parrafos: [
          'Las cifras permiten priorizar. Un programa que conoce el porcentaje de pacientes con presión controlada puede dirigir la educación y el seguimiento a quienes más lo necesitan. También puede comparar su desempeño con el de otras instituciones y con las metas nacionales.',
          'Para el QF, los datos de dispensación y control son insumos de intervención. Cruzar los códigos CIE-10 con los retiros de medicamentos permite detectar pacientes sin tratamiento, con sobreuso o con combinaciones inseguras.',
        ],
      },
      {
        titulo: 'Del dato a la acción',
        parrafos: [
          'La intervención empieza por identificar una cohorte, medir un indicador y definir una meta. Por ejemplo, aumentar el porcentaje de pacientes con HTA y albuminuria que reciben IECA o ARA-II, o reducir el uso de AINE en pacientes con ERC.',
          'La medición debe repetirse para demostrar impacto. Presentar los resultados al comité de farmacia y a la dirección médica sostiene el programa y justifica los recursos. La CAC es, en ese sentido, una aliada para la gestión clínica.',
        ],
      },
    ],
    proceso: {
      titulo: 'Uso de indicadores',
      pasos: [
        { titulo: 'Identificar', detalle: 'Cohorte y códigos.', icono: 'Database', evidencia: 'Listado.' },
        { titulo: 'Medir', detalle: 'Indicador y meta.', icono: 'LineChart', evidencia: 'Línea base.' },
        { titulo: 'Priorizar', detalle: 'Brechas y riesgo.', icono: 'Filter', evidencia: 'Cohorte.' },
        { titulo: 'Intervenir', detalle: 'Educación y ajuste.', icono: 'Users', evidencia: 'Plan.' },
        { titulo: 'Reevaluar', detalle: 'Impacto y sostenibilidad.', icono: 'Repeat', evidencia: 'Informe.' },
      ],
    },
    caso: {
      titulo: 'Cohorte sin control',
      contexto: 'Una IPS encuentra que solo la mitad de sus pacientes con HTA alcanza la meta de presión.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Nada; es un problema médico.', correcta: false, retro: 'El QF puede intervenir en adherencia y seguridad.' },
        { texto: 'Analiza barreras y prioriza seguimiento farmacoterapéutico.', correcta: true, retro: 'Convierte el dato en acción.' },
        { texto: 'Aumenta las dosis de todos.', correcta: false, retro: 'No es seguro ni individualizado.' },
      ],
    },
    errores: [
      { error: 'Mirar solo la prevalencia.', correccion: 'El control y las brechas importan más.' },
      { error: 'No cruzar datos de dispensación.', correccion: 'Revelan adherencia y riesgos.' },
      { error: 'No medir el impacto.', correccion: 'Sin medición no se sostiene.' },
    ],
    comprueba: [
      { pregunta: '¿Qué enfermedades reporta la CAC?', respuesta: 'HTA, diabetes y ERC, entre otras.' },
      { pregunta: '¿Qué indicadores se usan?', respuesta: 'PA, HbA1c, LDL y albuminuria.' },
      { pregunta: '¿Cómo se prioriza?', respuesta: 'Con brechas de control y riesgo.' },
    ],
    resumen: [
      'La CAC aporta cifras nacionales de control.',
      'Las brechas orientan la intervención.',
      'Los datos de dispensación son útiles.',
      'Medir el impacto sostiene el programa.',
    ],
    referencias: [
      { cita: 'Cuenta de Alto Costo. Situación de la enfermedad renal crónica, la hipertensión arterial y la diabetes mellitus en Colombia 2025. Bogotá: CAC; 2025.', url: 'https://cuentadealtocosto.org/situacion-de-la-enfermedad-renal-cronica-la-hipertension-arterial-y-la-diabetes-mellitus-en-colombia-2025/' },
    ],
    imagenes: [
      { ubicacion: 'Epidemiología', descripcion: 'Tablero de indicadores de HTA, diabetes y ERC.', alt: 'Cuenta de Alto Costo y riesgo cardiovascular' },
    ],
    keywords: ['Cuenta de Alto Costo', 'HTA Colombia', 'diabetes Colombia', 'ERC Colombia', 'indicadores'],
  },
  {
    titulo: 'Programas de riesgo cardiovascular y adherencia terapéutica',
    duracion: 20,
    gancho: {
      titulo: 'La tableta que se olvida',
      texto: 'Un paciente con tres medicamentos toma uno y medio. La adherencia no es un rasgo de personalidad: es el resultado de barreras que se pueden medir e intervenir. Los programas de riesgo cardiovascular son el escenario natural para hacerlo.',
    },
    objetivos: [
      'Describir la organización de los programas de RCV.',
      'Reconocer los determinantes de la adherencia.',
      'Aplicar estrategias del servicio farmacéutico.',
      'Medir y mejorar la adherencia.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Adherencia', definicion: 'Uso real del tratamiento frente al prescrito.' },
      { icono: 'Route', termino: 'Ruta integral', definicion: 'Itinerario de atención para el riesgo cardiometabólico.' },
      { icono: 'Settings', termino: 'Simplificación', definicion: 'Menos tomas y combinaciones fijas.' },
      { icono: 'LineChart', termino: 'Medición', definicion: 'Dispensación, cuestionarios y control.' },
    ],
    mapa: {
      centro: 'Programas de RCV',
      ramas: [
        { titulo: 'Organización', icono: 'Route', nodos: ['RIAS', 'EPS', 'IPS'] },
        { titulo: 'Barreras', icono: 'AlertTriangle', nodos: ['Costo', 'Olvido', 'Creencias'] },
        { titulo: 'Estrategias', icono: 'Settings', nodos: ['Combinación fija', 'Recordatorios', 'Educación'] },
        { titulo: 'Resultados', icono: 'LineChart', nodos: ['PA', 'LDL', 'Adherencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Organización',
        parrafos: [
          'Los programas de riesgo cardiovascular de las EPS e IPS se articulan con la Ruta Integral de Atención para la promoción y mantenimiento de la salud y con la ruta de riesgo cardio-cerebrovascular-metabólico. Agrupan personas con hipertensión, diabetes y enfermedad renal crónica, y hacen seguimiento a indicadores de control.',
          'El servicio farmacéutico aporta en la dispensación, la conciliación, la educación y el seguimiento farmacoterapéutico. Su trabajo se integra con medicina, enfermería y nutrición, y se documenta en la historia clínica.',
        ],
      },
      {
        titulo: 'Determinantes de la adherencia',
        parrafos: [
          'La adherencia depende de factores del paciente (olvido, creencias, salud mental), del tratamiento (número de tomas, efectos adversos, complejidad), del sistema (costo, acceso, distancia) y de la relación con el equipo. Culpar al paciente no cambia el resultado.',
          'La entrevista sin juicio y los registros de dispensación permiten identificar barreras. En HTA, la baja adherencia es una de las principales causas de aparente resistencia; en diabetes, se asocia con complicaciones; en ERC, con progresión.',
        ],
      },
      {
        titulo: 'Estrategias',
        parrafos: [
          'Las combinaciones a dosis fija reducen el número de tabletas y mejoran la adherencia. Los recordatorios, la vinculación con rutinas, la educación sobre el propósito de cada fármaco y la resolución de barreras de acceso son intervenciones con evidencia.',
          'El seguimiento debe medir el efecto: presión, HbA1c, LDL, adherencia y eventos. La intervención se documenta y se comparte con el equipo. La adherencia es un medio para el control, no un fin en sí mismo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Mejorar la adherencia',
      pasos: [
        { titulo: 'Medir', detalle: 'Dispensación y cuestionarios.', icono: 'Calculator', evidencia: 'Datos.' },
        { titulo: 'Entrevistar', detalle: 'Barreras y creencias.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Simplificar', detalle: 'Combinación fija.', icono: 'Settings', evidencia: 'Esquema.' },
        { titulo: 'Educar', detalle: 'Propósito y efectos.', icono: 'GraduationCap', evidencia: 'Consejería.' },
        { titulo: 'Medir', detalle: 'Control y persistencia.', icono: 'LineChart', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Tres medicamentos, media tableta',
      contexto: 'Paciente con HTA, diabetes e hiperlipidemia que olvida dosis y suspende fármacos cuando se siente bien.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Regañarlo por no cumplir.', correcta: false, retro: 'El juicio no mejora la adherencia.' },
        { texto: 'Explorar barreras y simplificar el esquema.', correcta: true, retro: 'Aborda las causas.' },
        { texto: 'Duplicar todas las dosis.', correcta: false, retro: 'No es seguro.' },
      ],
    },
    errores: [
      { error: 'Asumir que el paciente no quiere.', correccion: 'Hay barreras modificables.' },
      { error: 'No simplificar el esquema.', correccion: 'La complejidad reduce la adherencia.' },
      { error: 'No medir el resultado.', correccion: 'Sin medición no hay mejora.' },
    ],
    comprueba: [
      { pregunta: '¿Qué rutas se articulan?', respuesta: 'RIAS y ruta cardio-cerebrovascular-metabólica.' },
      { pregunta: '¿Qué estrategia simplifica?', respuesta: 'La combinación a dosis fija.' },
      { pregunta: '¿Cómo se mide?', respuesta: 'Dispensación, cuestionarios y control.' },
    ],
    resumen: [
      'Los programas de RCV son el escenario del SFT.',
      'La adherencia tiene causas medibles.',
      'Simplificar y educar funcionan.',
      'El control demuestra el impacto.',
    ],
    referencias: [
      { cita: 'Ministerio de Salud y Protección Social. Ruta Integral de Atención para la promoción y mantenimiento de la salud. Bogotá; 2025.', url: 'https://www.minsalud.gov.co/' },
      { cita: 'Cuenta de Alto Costo. Situación de la ERC, la HTA y la diabetes mellitus en Colombia 2025. Bogotá: CAC; 2025.', url: 'https://cuentadealtocosto.org/situacion-de-la-enfermedad-renal-cronica-la-hipertension-arterial-y-la-diabetes-mellitus-en-colombia-2025/' },
    ],
    imagenes: [
      { ubicacion: 'Adherencia', descripcion: 'Paciente y farmacéutico revisando el esquema y las barreras.', alt: 'Programas de riesgo cardiovascular y adherencia' },
    ],
    keywords: ['adherencia terapéutica', 'programas riesgo cardiovascular', 'RIAS', 'combinación fija'],
  },
  {
    titulo: 'Medición correcta de la presión arterial y educación al paciente',
    duracion: 20,
    gancho: {
      titulo: 'La presión que estaba mal medida',
      texto: 'Un paciente llega con 160/100 mmHg en el consultorio y 128/78 en casa. La técnica de medición cambia el diagnóstico y el tratamiento. Enseñar a medir es una intervención farmacéutica de alto impacto.',
    },
    objetivos: [
      'Aplicar la técnica de medición de la PA.',
      'Diferenciar consultorio, MAPA y AMPA.',
      'Reconocer hipertensión de bata blanca y enmascarada.',
      'Educar al paciente en automedición.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'AMPA', definicion: 'Automedición de la presión en casa.' },
      { icono: 'Timer', termino: 'MAPA', definicion: 'Monitoreo ambulatorio de 24 horas.' },
      { icono: 'Users', termino: 'Técnica', definicion: 'Reposo, posición, manguito y lecturas.' },
      { icono: 'Eye', termino: 'Bata blanca', definicion: 'Elevación en consultorio con casa normal.' },
    ],
    mapa: {
      centro: 'Medición de PA',
      ramas: [
        { titulo: 'Consultorio', icono: 'Gauge', nodos: ['Reposo', 'Manguito', 'Promedio'] },
        { titulo: 'AMPA', icono: 'Building2', nodos: ['Casa', 'Registro', 'Promedio'] },
        { titulo: 'MAPA', icono: 'Timer', nodos: ['24 horas', 'Noche', 'Promedio'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['Técnica', 'Registro', 'Metas'] },
      ],
    },
    secciones: [
      {
        titulo: 'Técnica correcta',
        parrafos: [
          'El paciente debe descansar cinco minutos, sentado con la espalda apoyada, los pies en el suelo y el brazo a la altura del corazón. Se evita café, tabaco o ejercicio en los 30 minutos previos. El manguito debe cubrir el 80 % del brazo y ajustarse al tamaño.',
          'Se toman al menos dos lecturas separadas por uno o dos minutos y se promedian. En la primera visita se mide en ambos brazos y se usa el de mayor valor. La técnica incorrecta produce sobreestimación o subestimación y decisiones equivocadas.',
        ],
      },
      {
        titulo: 'Métodos y fenotipos',
        parrafos: [
          'La medición en consultorio es la base, pero la automedición en casa y el monitoreo ambulatorio de 24 horas aportan información fuera del entorno clínico. La automedición se recomienda con dispositivos validados y un registro estructurado.',
          'La hipertensión de bata blanca se sospecha cuando la presión es alta en consultorio y normal fuera de él; la enmascarada, al contrario. Ambas cambian la conducta y explican por qué no basta una sola lectura.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El QF enseña la técnica, revisa el dispositivo, verifica el tamaño del manguito y ayuda a interpretar el registro. También explica las metas y cuándo consultar por valores muy altos o síntomas.',
          'La automedición empodera al paciente y mejora la adherencia cuando se acompaña de educación. El registro debe llevarse a cada control y revisarse con el equipo. Medir bien es parte del tratamiento.',
        ],
      },
    ],
    proceso: {
      titulo: 'Enseñar automedición',
      pasos: [
        { titulo: 'Verificar', detalle: 'Dispositivo validado.', icono: 'ClipboardCheck', evidencia: 'Equipo.' },
        { titulo: 'Demostrar', detalle: 'Reposo y posición.', icono: 'Eye', evidencia: 'Práctica.' },
        { titulo: 'Registrar', detalle: 'Fecha, hora y valores.', icono: 'FileText', evidencia: 'Bitácora.' },
        { titulo: 'Interpretar', detalle: 'Promedios y metas.', icono: 'LineChart', evidencia: 'Revisión.' },
        { titulo: 'Seguir', detalle: 'Llevar el registro al control.', icono: 'CalendarClock', evidencia: 'Consulta.' },
      ],
    },
    caso: {
      titulo: 'Alta en consultorio, normal en casa',
      contexto: 'Paciente con 160/100 en consultorio y 128/78 en casa, sin daño de órgano.',
      pregunta: '¿Qué se sospecha?',
      opciones: [
        { texto: 'Hipertensión resistente.', correcta: false, retro: 'No hay tratamiento fallido.' },
        { texto: 'Hipertensión de bata blanca.', correcta: true, retro: 'Alta en consultorio y normal fuera.' },
        { texto: 'Hipotensión.', correcta: false, retro: 'Los valores no lo sugieren.' },
      ],
    },
    errores: [
      { error: 'Medir sin reposo.', correccion: 'Sobreestima la presión.' },
      { error: 'Usar un manguito inadecuado.', correccion: 'Altera la lectura.' },
      { error: 'No revisar el dispositivo.', correccion: 'Puede estar descalibrado.' },
    ],
    comprueba: [
      { pregunta: '¿Cuánto reposo se necesita?', respuesta: 'Cinco minutos.' },
      { pregunta: '¿Qué es AMPA?', respuesta: 'Automedición de la presión en casa.' },
      { pregunta: '¿Qué es bata blanca?', respuesta: 'Alta en consultorio y normal fuera.' },
    ],
    resumen: [
      'La técnica correcta es indispensable.',
      'AMPA y MAPA complementan el consultorio.',
      'Bata blanca y enmascarada cambian la conducta.',
      'La educación mejora el seguimiento.',
    ],
    referencias: [
      { cita: 'Ministerio de Salud y Protección Social. Actualización parcial de la GPC de hipertensión arterial primaria (Guía n.º 18, 2.ª ed.). Bogotá; 2025.', url: 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/CA/gpc-actualizacion-parcial-hta-primaria-vps.pdf' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/' },
    ],
    imagenes: [
      { ubicacion: 'Medición', descripcion: 'Técnica de automedición con manguito y registro.', alt: 'Medición correcta de la presión arterial' },
    ],
    keywords: ['medición presión arterial', 'AMPA', 'MAPA', 'bata blanca', 'hipertensión enmascarada'],
  },
  {
    titulo: 'Caso: paciente con HTA, DM2 y ERC en el programa de RCV',
    duracion: 25,
    gancho: {
      titulo: 'La triple amenaza',
      texto: 'Una mujer de 64 años con HTA, diabetes y ERC toma losartán, hidroclorotiazida y metformina, y compra ibuprofeno para el dolor. Su presión no baja y el potasio está en el límite. El caso integra adherencia, interacciones y seguridad renal.',
    },
    objetivos: [
      'Aplicar el seguimiento farmacoterapéutico.',
      'Identificar problemas relacionados con medicamentos.',
      'Reconocer la triple amenaza renal.',
      'Diseñar un plan de intervención.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Triple amenaza', definicion: 'AINE + SRAA + diurético.' },
      { icono: 'Droplets', termino: 'ERC', definicion: 'Filtrado reducido y albuminuria.' },
      { icono: 'Users', termino: 'Adherencia', definicion: 'Barreras que explican el mal control.' },
      { icono: 'FileCheck', termino: 'PRM', definicion: 'Problema relacionado con medicamentos.' },
    ],
    mapa: {
      centro: 'Caso RCV',
      ramas: [
        { titulo: 'Control', icono: 'Gauge', nodos: ['PA 152/94', 'LDL alto', 'Potasio 5,3'] },
        { titulo: 'Riesgos', icono: 'AlertTriangle', nodos: ['AINE', 'Triple amenaza', 'ERC'] },
        { titulo: 'Adherencia', icono: 'Users', nodos: ['Olvido', 'Viajes', 'Creencias'] },
        { titulo: 'Plan', icono: 'FileCheck', nodos: ['Suspender AINE', 'Simplificar', 'Seguir'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'La paciente tiene hipertensión de larga evolución, diabetes tipo 2 y enfermedad renal crónica G3a A2. Recibe losartán, hidroclorotiazida, metformina y atorvastatina. Compra ibuprofeno sin fórmula para el dolor de rodilla. Su presión es 152/94 mmHg, el potasio 5,3 mEq/L, la TFG estimada 52 mL/min y el LDL está por encima de la meta.',
          'Refiere olvidar la dosis de la tarde y suspender la tiazida cuando viaja porque la hace orinar mucho. Estos datos configuran problemas de adherencia y de seguridad, no solo de eficacia.',
        ],
      },
      {
        titulo: 'Análisis',
        parrafos: [
          'La presión no controlada se explica por la falta de adherencia y por la interacción entre el AINE, el ARA-II y el diurético, conocida como triple amenaza, que aumenta el riesgo de lesión renal aguda e hiperpotasemia. El potasio en 5,3 exige revisar suplementos, sales de reemplazo y fármacos que retienen potasio.',
          'El LDL por encima de la meta sugiere intensificar la estatina o agregar otro hipolipemiante. La paciente tiene alto riesgo cardiovascular por la combinación de HTA, diabetes y ERC.',
        ],
      },
      {
        titulo: 'Intervención',
        parrafos: [
          'El QF recomienda suspender el ibuprofeno y buscar una alternativa analgésica segura, revisar el potasio y la función renal, y simplificar el esquema con una combinación a dosis fija si está disponible y cubierta. También refuerza la educación sobre la tiazida y el control del peso.',
          'Se acuerda un plan de seguimiento con control de presión, potasio y creatinina, y se documenta la intervención. El caso muestra que el SFT en un programa de RCV integra adherencia, seguridad y optimización del tratamiento.',
        ],
      },
    ],
    proceso: {
      titulo: 'SFT en RCV',
      pasos: [
        { titulo: 'Entrevistar', detalle: 'Medicación real y barreras.', icono: 'Users', evidencia: 'Ficha.' },
        { titulo: 'Evaluar', detalle: 'Necesidad, efectividad y seguridad.', icono: 'ClipboardList', evidencia: 'PRM.' },
        { titulo: 'Priorizar', detalle: 'Riesgo renal y potasio.', icono: 'AlertTriangle', evidencia: 'Decisión.' },
        { titulo: 'Intervenir', detalle: 'Suspender AINE y simplificar.', icono: 'Pill', evidencia: 'Nota.' },
        { titulo: 'Seguir', detalle: 'PA, potasio y renal.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'HTA, DM2 y ERC',
      contexto: 'Mujer de 64 años con losartán, hidroclorotiazida, metformina, atorvastatina e ibuprofeno ocasional; PA 152/94, potasio 5,3 y TFG 52.',
      pregunta: '¿Cuál es la intervención prioritaria?',
      opciones: [
        { texto: 'Aumentar la hidroclorotiazida.', correcta: false, retro: 'El potasio y la adherencia lo limitan.' },
        { texto: 'Suspender el AINE y revisar potasio y adherencia.', correcta: true, retro: 'Aborda la causa del riesgo.' },
        { texto: 'Suspender el losartán.', correcta: false, retro: 'Es nefroprotector y necesario.' },
      ],
    },
    errores: [
      { error: 'No preguntar por venta libre.', correccion: 'El AINE es la clave del caso.' },
      { error: 'Ignorar el potasio.', correccion: 'Está en límite alto.' },
      { error: 'No abordar la adherencia.', correccion: 'Explica el mal control.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la triple amenaza?', respuesta: 'AINE + SRAA + diurético.' },
      { pregunta: '¿Qué se revisa con potasio 5,3?', respuesta: 'Suplementos, sales y fármacos.' },
      { pregunta: '¿Qué simplifica el esquema?', respuesta: 'Una combinación a dosis fija.' },
    ],
    resumen: [
      'El SFT integra eficacia, seguridad y adherencia.',
      'El AINE es un riesgo frecuente y oculto.',
      'El potasio y la función renal guían el ajuste.',
      'La simplificación mejora la adherencia.',
    ],
    referencias: [
      { cita: 'Ministerio de Salud y Protección Social. Actualización parcial de la GPC de hipertensión arterial primaria (Guía n.º 18, 2.ª ed.). Bogotá; 2025.', url: 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/CA/gpc-actualizacion-parcial-hta-primaria-vps.pdf' },
      { cita: 'Kidney Disease: Improving Global Outcomes. KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int. 2024.', url: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/' },
    ],
    imagenes: [
      { ubicacion: 'Caso', descripcion: 'Ficha de la paciente con medicación y problemas detectados.', alt: 'Caso de HTA, diabetes y ERC en RCV' },
    ],
    keywords: ['caso HTA DM2 ERC', 'triple amenaza', 'seguimiento farmacoterapéutico', 'AINE ERC'],
  },
  {
    titulo: 'Introducción a la unidad: clasificación de los antihipertensivos',
    duracion: 15,
    gancho: {
      titulo: 'El sitio de acción explica la combinación',
      texto: 'Un fármaco que bloquea el SRAA y otro que dilata la arteriola actúan en sitios distintos. Combinarlos es más eficaz y mejor tolerado que duplicar la dosis. Entender el sitio de acción ordena la terapia.',
    },
    objetivos: [
      'Clasificar los antihipertensivos por mecanismo.',
      'Reconocer los grupos de primera línea.',
      'Explicar la lógica de la combinación.',
      'Ubicar los fármacos de segunda línea.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'A', definicion: 'IECA y ARA-II: bloqueo del SRAA.' },
      { icono: 'Gauge', termino: 'C', definicion: 'Calcioantagonistas: vasodilatación.' },
      { icono: 'Pill', termino: 'D', definicion: 'Tiazidas: reducción de volumen.' },
      { icono: 'Layers', termino: 'Combinación', definicion: 'Grupos con mecanismos complementarios.' },
    ],
    mapa: {
      centro: 'Antihipertensivos',
      ramas: [
        { titulo: 'Primera línea', icono: 'Target', nodos: ['A', 'C', 'D'] },
        { titulo: 'Indicaciones', icono: 'Activity', nodos: ['Beta', 'ARM', 'Alfa'] },
        { titulo: 'Sitios', icono: 'Network', nodos: ['SRAA', 'Calcio', 'Riñón'] },
        { titulo: 'Combinación', icono: 'Layers', nodos: ['A+C', 'A+D', 'C+D'] },
      ],
    },
    secciones: [
      {
        titulo: 'Los grupos principales',
        parrafos: [
          'Los antihipertensivos se clasifican por su sitio de acción. Los IECA y ARA-II bloquean el sistema renina-angiotensina-aldosterona; los calcioantagonistas reducen la entrada de calcio al músculo liso vascular; las tiazidas reducen el volumen y la resistencia periférica; los betabloqueadores disminuyen la frecuencia y el gasto cardíaco.',
          'Los grupos de primera línea en la mayoría de pacientes son A (IECA/ARA-II), C (calcioantagonistas dihidropiridínicos) y D (tiazidas). Los betabloqueadores se usan cuando hay una indicación específica, como angina, postinfarto, insuficiencia cardíaca o control de la frecuencia.',
        ],
      },
      {
        titulo: 'Combinaciones racionales',
        parrafos: [
          'Combinar grupos con mecanismos complementarios mejora el control y reduce los efectos adversos. Las combinaciones preferidas son A+C, A+D y C+D. La combinación de IECA con ARA-II no se recomienda por riesgo de hiperpotasemia y daño renal sin beneficio adicional.',
          'La combinación a dosis fija simplifica el esquema y mejora la adherencia. En Colombia, la disponibilidad y la cobertura del PBS condicionan la elección; el QF verifica alternativas equivalentes.',
        ],
      },
      {
        titulo: 'Segunda línea y resistentes',
        parrafos: [
          'Los alfabloqueadores, los fármacos de acción central y los vasodilatadores directos se usan cuando no se alcanza la meta o hay intolerancia. En la hipertensión resistente, la espironolactona es una opción de cuarta línea con evidencia.',
          'El QF revisa la coherencia del esquema: dosis adecuada, adherencia, interacciones y causas de pseudorresistencia. La clasificación no es un fin, sino una guía para elegir y combinar con criterio.',
        ],
      },
    ],
    proceso: {
      titulo: 'Elegir antihipertensivo',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Riesgo y comorbilidad.', icono: 'ClipboardList', evidencia: 'Ficha.' },
        { titulo: 'Elegir', detalle: 'Grupo de primera línea.', icono: 'Target', evidencia: 'Decisión.' },
        { titulo: 'Combinar', detalle: 'Mecanismos complementarios.', icono: 'Layers', evidencia: 'Esquema.' },
        { titulo: 'Simplificar', detalle: 'Dosis fija si es posible.', icono: 'Settings', evidencia: 'Fórmula.' },
        { titulo: 'Revisar', detalle: 'Control y efectos.', icono: 'Repeat', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Monoterapia insuficiente',
      contexto: 'Paciente con HTA que no alcanza la meta con amlodipino a dosis media.',
      pregunta: '¿Qué combinación es racional?',
      opciones: [
        { texto: 'Añadir un IECA o ARA-II.', correcta: true, retro: 'A+C es una combinación preferida.' },
        { texto: 'Duplicar el amlodipino indefinidamente.', correcta: false, retro: 'Aumenta el edema sin gran beneficio.' },
        { texto: 'Combinar IECA y ARA-II.', correcta: false, retro: 'No se recomienda.' },
      ],
    },
    errores: [
      { error: 'Duplicar dosis antes de combinar.', correccion: 'La combinación es más eficaz.' },
      { error: 'Combinar IECA y ARA-II.', correccion: 'Riesgo sin beneficio.' },
      { error: 'Usar betabloqueador sin indicación.', correccion: 'No es primera línea general.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los grupos A, C y D?', respuesta: 'IECA/ARA-II, calcioantagonistas y tiazidas.' },
      { pregunta: '¿Qué combinación no se recomienda?', respuesta: 'IECA con ARA-II.' },
      { pregunta: '¿Cuándo se usa betabloqueador?', respuesta: 'Con indicación específica.' },
    ],
    resumen: [
      'La clasificación se basa en el mecanismo.',
      'A, C y D son primera línea.',
      'Las combinaciones complementarias son preferidas.',
      'La simplificación mejora la adherencia.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/' },
    ],
    imagenes: [
      { ubicacion: 'Unidad 2', descripcion: 'Clasificación de antihipertensivos por sitio de acción.', alt: 'Clasificación de los antihipertensivos' },
    ],
    keywords: ['clasificación antihipertensivos', 'IECA ARA-II', 'calcioantagonistas', 'tiazidas', 'combinación'],
  },
  {
    titulo: 'IECA y ARA-II: mecanismo, farmacocinética e indicaciones',
    duracion: 20,
    gancho: {
      titulo: 'Dos formas de bloquear el SRAA',
      texto: 'Un IECA reduce la formación de angiotensina II y aumenta la bradicinina; un ARA-II bloquea el receptor. Comparten indicaciones y riesgos, pero difieren en tos y angioedema. Elegir bien exige conocer la diferencia.',
    },
    objetivos: [
      'Explicar el mecanismo de IECA y ARA-II.',
      'Comparar su farmacocinética.',
      'Aplicar sus indicaciones.',
      'Reconocer contraindicaciones y monitorización.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'IECA', definicion: 'Inhibe la enzima convertidora de angiotensina.' },
      { icono: 'ShieldCheck', termino: 'ARA-II', definicion: 'Bloquea el receptor AT1 de angiotensina II.' },
      { icono: 'Droplets', termino: 'Albuminuria', definicion: 'Indicación renal de ambos grupos.' },
      { icono: 'AlertTriangle', termino: 'Embarazo', definicion: 'Contraindicación absoluta.' },
    ],
    mapa: {
      centro: 'Bloqueo del SRAA',
      ramas: [
        { titulo: 'IECA', icono: 'Target', nodos: ['Enalapril', 'Ramipril', 'Bradicinina'] },
        { titulo: 'ARA-II', icono: 'ShieldCheck', nodos: ['Losartán', 'Valsartán', 'AT1'] },
        { titulo: 'Indicaciones', icono: 'Activity', nodos: ['HTA', 'ERC', 'IC', 'Postinfarto'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Tos', 'Angioedema', 'Potasio'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo',
        parrafos: [
          'Los IECA inhiben la enzima convertidora de angiotensina, reducen la formación de angiotensina II y disminuyen la degradación de bradicinina. Eso produce vasodilatación, menor secreción de aldosterona y reducción de la presión. El aumento de bradicinina explica la tos seca y el angioedema.',
          'Los ARA-II bloquean selectivamente el receptor AT1 de la angiotensina II. No aumentan la bradicinina, por lo que producen menos tos y angioedema, aunque el riesgo no desaparece. Ambos grupos reducen la presión y protegen el riñón en presencia de albuminuria.',
        ],
      },
      {
        titulo: 'Farmacocinética',
        parrafos: [
          'Muchos IECA son profármacos que se activan en el hígado; enalapril se convierte en enalaprilato y ramipril en ramiprilato. Los ARA-II tienen una farmacocinética variable: losartán es un profármaco activado por CYP2C9 y CYP3A4; telmisartán tiene una vida media larga y se elimina por vía biliar.',
          'La función renal y la edad modifican la dosis. En insuficiencia renal avanzada se ajustan algunos fármacos y se monitoriza el potasio. La adherencia se ve favorecida por las presentaciones de una vez al día.',
        ],
      },
      {
        titulo: 'Indicaciones y seguridad',
        parrafos: [
          'Son de elección en hipertensión con albuminuria, enfermedad renal crónica, insuficiencia cardíaca con fracción de eyección reducida y postinfarto. En la insuficiencia cardíaca, el ARNI reemplaza al IECA en pacientes seleccionados. No se combinan IECA y ARA-II.',
          'Están contraindicados en el embarazo y en la estenosis bilateral de la arteria renal. Se controlan creatinina y potasio al inicio y después de cada cambio. La creatinina puede subir levemente; un aumento pequeño no obliga a suspender, pero un deterioro significativo exige evaluación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Inicio seguro',
      pasos: [
        { titulo: 'Indicación', detalle: 'HTA, ERC o IC.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Elegir', detalle: 'IECA o ARA-II.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Controlar', detalle: 'Creatinina y potasio.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Educar', detalle: 'Tos, angioedema y adherencia.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguir', detalle: 'Presión y función renal.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Tos por enalapril',
      contexto: 'Paciente con HTA y albuminuria que desarrolla tos seca persistente con enalapril.',
      pregunta: '¿Qué alternativa plantea el QF?',
      opciones: [
        { texto: 'Añadir un antitusígeno.', correcta: false, retro: 'No corrige la causa.' },
        { texto: 'Cambiar a un ARA-II.', correcta: true, retro: 'Menos tos y misma protección renal.' },
        { texto: 'Combinar enalapril con losartán.', correcta: false, retro: 'No se recomienda.' },
      ],
    },
    errores: [
      { error: 'Combinar IECA y ARA-II.', correccion: 'Riesgo sin beneficio.' },
      { error: 'No controlar potasio.', correccion: 'Puede haber hiperpotasemia.' },
      { error: 'Usarlos en embarazo.', correccion: 'Son teratogénicos.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué los IECA causan tos?', respuesta: 'Por aumento de bradicinina.' },
      { pregunta: '¿Qué indicación renal comparten?', respuesta: 'Albuminuria y ERC.' },
      { pregunta: '¿Qué se controla al iniciar?', respuesta: 'Creatinina y potasio.' },
    ],
    resumen: [
      'IECA y ARA-II bloquean el SRAA de forma distinta.',
      'Comparten indicaciones cardiorrenales.',
      'El ARA-II causa menos tos.',
      'No se combinan y exigen monitorización.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/' },
      { cita: 'Kidney Disease: Improving Global Outcomes. KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD. Kidney Int. 2024.', url: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/' },
    ],
    imagenes: [
      { ubicacion: 'SRAA', descripcion: 'Esquema del sistema renina-angiotensina y sitios de bloqueo.', alt: 'IECA y ARA-II mecanismo e indicaciones' },
    ],
    keywords: ['IECA', 'ARA-II', 'losartán', 'enalapril', 'albuminuria', 'SRAA'],
  },
  {
    titulo: 'Angioedema, tos e hiperpotasemia por bloqueo del SRAA',
    duracion: 20,
    gancho: {
      titulo: 'El angioedema que no debe repetirse',
      texto: 'Un paciente presenta hinchazón de labios y lengua con enalapril. El fármaco se suspende, pero meses después otro prescriptor lo reinicia. El angioedema por IECA puede ser grave y no debe reintroducirse. La historia clínica y la educación lo previenen.',
    },
    objetivos: [
      'Reconocer la tos y el angioedema.',
      'Aplicar el manejo del angioedema.',
      'Identificar factores de hiperpotasemia.',
      'Monitorizar el potasio con seguridad.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Angioedema', definicion: 'Edema de tejidos profundos, potencialmente fatal.' },
      { icono: 'Wind', termino: 'Tos', definicion: 'Seca, persistente, por bradicinina.' },
      { icono: 'TestTube', termino: 'Potasio', definicion: 'Riesgo con ERC, ARM y suplementos.' },
      { icono: 'Timer', termino: '36 horas', definicion: 'Lavado antes de iniciar ARNI.' },
    ],
    mapa: {
      centro: 'Seguridad del SRAA',
      ramas: [
        { titulo: 'Tos', icono: 'Wind', nodos: ['IECA', 'Cambiar a ARA-II'] },
        { titulo: 'Angioedema', icono: 'AlertTriangle', nodos: ['Vía aérea', 'Suspender', 'No reintroducir'] },
        { titulo: 'Potasio', icono: 'TestTube', nodos: ['ERC', 'ARM', 'AINE'] },
        { titulo: 'Transición', icono: 'Timer', nodos: ['ARNI', '36 horas', 'Registro'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tos y angioedema',
        parrafos: [
          'La tos seca aparece en una proporción significativa de pacientes tratados con IECA y se atribuye al aumento de bradicinina. Si es intolerable, se cambia a un ARA-II, que rara vez la produce. No se debe añadir un antitusígeno para mantener el IECA.',
          'El angioedema es menos frecuente pero potencialmente grave. Puede afectar labios, lengua, cara o vía aérea. Requiere suspender el fármaco y valorar la vía aérea de inmediato. El antecedente de angioedema por IECA contraindica su reintroducción y exige precaución con los ARA-II.',
        ],
      },
      {
        titulo: 'Transición a ARNI',
        parrafos: [
          'El sacubitrilo/valsartán no debe combinarse con un IECA. Si el paciente viene de un IECA, se suspende y se espera al menos 36 horas antes de iniciar el ARNI para reducir el riesgo de angioedema. Si viene de un ARA-II, no se requiere ese intervalo.',
          'La transición se registra en la historia clínica y en la fórmula. El paciente debe saber que no puede tomar ambos medicamentos y que debe consultar si aparece hinchazón de labios, lengua o dificultad para respirar.',
        ],
      },
      {
        titulo: 'Hiperpotasemia',
        parrafos: [
          'El bloqueo del SRAA reduce la excreción de potasio. El riesgo aumenta con enfermedad renal, diabetes, insuficiencia cardíaca, antagonistas mineralocorticoides, suplementos de potasio, sales de reemplazo, trimetoprim y AINE. La combinación de varios de estos factores puede causar hiperpotasemia grave.',
          'Se controla potasio y creatinina al inicio, después de cada ajuste y en situaciones de riesgo. La educación incluye reconocer debilidad, palpitaciones o parestesias y evitar la automedicación con suplementos. La hiperpotasemia se maneja con ajuste de dosis, dieta y, si es necesario, quelantes.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejo de la seguridad',
      pasos: [
        { titulo: 'Preguntar', detalle: 'Tos, hinchazón y suplementos.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Suspender', detalle: 'Ante angioedema.', icono: 'XCircle', evidencia: 'Nota.' },
        { titulo: 'Controlar', detalle: 'Potasio y creatinina.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Transición', detalle: '36 horas si va a ARNI.', icono: 'Timer', evidencia: 'Registro.' },
        { titulo: 'Educar', detalle: 'Signos de alarma.', icono: 'GraduationCap', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Angioedema previo',
      contexto: 'Paciente con angioedema por enalapril que requiere bloqueo del SRAA.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Reiniciar enalapril a dosis baja.', correcta: false, retro: 'Puede recurrir y ser grave.' },
        { texto: 'Registrar la alergia y valorar ARA-II con precaución.', correcta: true, retro: 'Se evita el IECA y se individualiza.' },
        { texto: 'Combinar enalapril con ARA-II.', correcta: false, retro: 'Contraindicado.' },
      ],
    },
    errores: [
      { error: 'Reintroducir el IECA tras angioedema.', correccion: 'Puede ser fatal.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo de arritmias.' },
      { error: 'No esperar 36 horas para ARNI.', correccion: 'Riesgo de angioedema.' },
    ],
    comprueba: [
      { pregunta: '¿Qué causa la tos?', respuesta: 'El aumento de bradicinina.' },
      { pregunta: '¿Cuánto esperar antes de ARNI?', respuesta: 'Al menos 36 horas.' },
      { pregunta: '¿Qué factores elevan el potasio?', respuesta: 'ERC, ARM, AINE y suplementos.' },
    ],
    resumen: [
      'La tos por IECA se maneja cambiando a ARA-II.',
      'El angioedema exige suspender y no reintroducir.',
      'El ARNI requiere 36 horas de lavado.',
      'El potasio se monitoriza y se educa.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Entresto 24 mg/26 mg comprimidos recubiertos con película.', url: 'https://cima.aemps.es/cima/dochtml/ft/1151058001/FT_1151058001.html' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/' },
    ],
    imagenes: [
      { ubicacion: 'Seguridad', descripcion: 'Signos de angioedema e hiperpotasemia.', alt: 'Angioedema, tos e hiperpotasemia por SRAA' },
    ],
    keywords: ['angioedema IECA', 'tos IECA', 'hiperpotasemia SRAA', 'transición ARNI'],
  },
  {
    titulo: 'Calcioantagonistas dihidropiridínicos y no dihidropiridínicos',
    duracion: 20,
    gancho: {
      titulo: 'El edema que no es insuficiencia cardíaca',
      texto: 'Una paciente desarrolla edema maleolar con amlodipino y se preocupa por su corazón. El edema es un efecto vasodilatador frecuente, no siempre signo de insuficiencia cardíaca. Distinguirlo evita estudios y suspensiones innecesarias.',
    },
    objetivos: [
      'Diferenciar los calcioantagonistas.',
      'Aplicar sus indicaciones.',
      'Reconocer efectos adversos.',
      'Revisar interacciones del CYP3A4.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'DHP', definicion: 'Vasodilatación periférica; amlodipino.' },
      { icono: 'Activity', termino: 'No DHP', definicion: 'Efecto cardíaco; verapamilo y diltiazem.' },
      { icono: 'Droplets', termino: 'Edema', definicion: 'Efecto adverso frecuente de los DHP.' },
      { icono: 'Network', termino: 'CYP3A4', definicion: 'Interacción con estatinas y otros.' },
    ],
    mapa: {
      centro: 'Calcioantagonistas',
      ramas: [
        { titulo: 'DHP', icono: 'Gauge', nodos: ['Amlodipino', 'Nifedipino', 'Edema'] },
        { titulo: 'No DHP', icono: 'Activity', nodos: ['Verapamilo', 'Diltiazem', 'Bradicardia'] },
        { titulo: 'Indicaciones', icono: 'Target', nodos: ['HTA', 'Angina', 'Frecuencia'] },
        { titulo: 'Interacción', icono: 'Network', nodos: ['Simvastatina', 'CYP3A4', 'Grapefruit'] },
      ],
    },
    secciones: [
      {
        titulo: 'Dihidropiridínicos',
        parrafos: [
          'Los dihidropiridínicos, como amlodipino y nifedipino, bloquean los canales de calcio del músculo liso vascular y producen vasodilatación. Son eficaces en hipertensión y angina. El amlodipino tiene una vida media larga y se administra una vez al día.',
          'Los efectos adversos incluyen edema maleolar, cefalea, rubor y taquicardia refleja. El edema depende de la dosis y de la vasodilatación arteriolar; no siempre indica insuficiencia cardíaca. Puede reducirse combinando con un IECA o ARA-II.',
        ],
      },
      {
        titulo: 'No dihidropiridínicos',
        parrafos: [
          'El verapamilo y el diltiazem actúan también sobre el corazón y reducen la frecuencia y la contractilidad. Se usan en angina, control de la frecuencia en fibrilación auricular y algunas arritmias. Pueden causar bradicardia, bloqueo auriculoventricular, estreñimiento e hipotensión.',
          'Se evitan en la insuficiencia cardíaca con fracción de eyección reducida y se usan con precaución en disfunción sinusal o bloqueo. No se combinan con betabloqueadores por riesgo de bradicardia grave.',
        ],
      },
      {
        titulo: 'Interacciones',
        parrafos: [
          'Los calcioantagonistas son sustratos e inhibidores del CYP3A4. El verapamilo y el diltiazem aumentan los niveles de simvastatina y otros fármacos, con riesgo de miopatía. Con amlodipino se recomienda no superar dosis altas de simvastatina. El zumo de pomelo puede aumentar la exposición.',
          'El QF revisa la lista completa de medicamentos y ajusta o propone alternativas. También educa sobre el edema, la adherencia y los signos de bradicardia.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de calcioantagonistas',
      pasos: [
        { titulo: 'Indicación', detalle: 'HTA, angina o frecuencia.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Elegir', detalle: 'DHP o no DHP.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Revisar', detalle: 'CYP3A4 y estatinas.', icono: 'Network', evidencia: 'Lista.' },
        { titulo: 'Educar', detalle: 'Edema y bradicardia.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguir', detalle: 'Presión, frecuencia y edema.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Edema maleolar',
      contexto: 'Paciente con HTA que desarrolla edema con amlodipino 10 mg.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Suspender todo tratamiento.', correcta: false, retro: 'Se puede ajustar o combinar.' },
        { texto: 'Valorar dosis y combinar con IECA o ARA-II.', correcta: true, retro: 'Reduce el edema y mejora el control.' },
        { texto: 'Añadir un diurético de asa.', correcta: false, retro: 'No es la primera opción.' },
      ],
    },
    errores: [
      { error: 'Confundir edema con IC.', correccion: 'Es un efecto vasodilatador.' },
      { error: 'Combinar no DHP con betabloqueador.', correccion: 'Riesgo de bradicardia.' },
      { error: 'No revisar simvastatina.', correccion: 'Riesgo de miopatía.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia a los DHP?', respuesta: 'Vasodilatación periférica.' },
      { pregunta: '¿Qué efecto tienen los no DHP?', respuesta: 'Reducen frecuencia y contractilidad.' },
      { pregunta: '¿Qué interacción es clave?', respuesta: 'CYP3A4 con estatinas.' },
    ],
    resumen: [
      'DHP y no DHP tienen perfiles distintos.',
      'El edema es frecuente con DHP.',
      'Los no DHP se evitan en IC con FE reducida.',
      'El CYP3A4 exige revisión de interacciones.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Amlodipino Cinfa 10 mg comprimidos EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/69342/FT_69342.html' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/' },
    ],
    imagenes: [
      { ubicacion: 'Calcioantagonistas', descripcion: 'Diferencias entre DHP y no DHP.', alt: 'Calcioantagonistas dihidropiridínicos y no dihidropiridínicos' },
    ],
    keywords: ['amlodipino', 'verapamilo', 'diltiazem', 'calcioantagonistas', 'edema maleolar'],
  },
  {
    titulo: 'Tiazidas y diuréticos tipo tiazida como antihipertensivos',
    duracion: 20,
    gancho: {
      titulo: 'La tiazida que baja el potasio',
      texto: 'Una paciente inicia hidroclorotiazida y a las semanas tiene calambres y potasio de 3,2. La tiazida es eficaz y económica, pero exige control metabólico. La monitorización evita complicaciones y abandonos.',
    },
    objetivos: [
      'Aplicar el mecanismo y las dosis.',
      'Comparar hidroclorotiazida, clortalidona e indapamida.',
      'Reconocer efectos metabólicos.',
      'Monitorizar y educar.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Tiazida', definicion: 'Diurético que reduce volumen y resistencia.' },
      { icono: 'TestTube', termino: 'Potasio', definicion: 'Puede causar hipopotasemia.' },
      { icono: 'Activity', termino: 'Clortalidona', definicion: 'Más potente y de acción prolongada.' },
      { icono: 'AlertTriangle', termino: 'Metabólico', definicion: 'Sodio, ácido úrico, glucosa y calcio.' },
    ],
    mapa: {
      centro: 'Tiazidas',
      ramas: [
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['HCTZ', 'Clortalidona', 'Indapamida'] },
        { titulo: 'Efectos', icono: 'AlertTriangle', nodos: ['Hipokalemia', 'Hiponatremia', 'Hiperuricemia'] },
        { titulo: 'Uso', icono: 'Target', nodos: ['HTA', 'Edad', 'Osteoporosis'] },
        { titulo: 'Control', icono: 'TestTube', nodos: ['Potasio', 'Sodio', 'Renal'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo y fármacos',
        parrafos: [
          'Las tiazidas inhiben el cotransportador de sodio y cloro en el túbulo contorneado distal. Al inicio reducen el volumen plasmático y, con el tiempo, la resistencia vascular periférica. Son eficaces, económicas y útiles en hipertensión, sobre todo en personas mayores.',
          'La hidroclorotiazida es la más conocida; la clortalidona es más potente y de acción prolongada; la indapamida tiene un perfil similar. La elección depende de la respuesta, los electrolitos, la tolerancia y la disponibilidad en el PBS.',
        ],
      },
      {
        titulo: 'Efectos adversos',
        parrafos: [
          'Pueden causar hipopotasemia, hiponatremia, hiperuricemia, hiperglucemia, hipercalcemia y dislipidemia. La hipopotasemia favorece arritmias y calambres; la hiponatremia es más frecuente en adultos mayores y puede ser grave.',
          'La fotosensibilidad y el riesgo de cáncer de piel se han asociado con la hidroclorotiazida. Se recomienda protección solar y revisión dermatológica. La monitorización incluye potasio, sodio, creatinina, ácido úrico y glucosa.',
        ],
      },
      {
        titulo: 'Uso clínico',
        parrafos: [
          'Las tiazidas son útiles en hipertensión, insuficiencia cardíaca leve y prevención de cálculos de calcio. Se combinan con IECA, ARA-II o calcioantagonistas. En la enfermedad renal avanzada pierden eficacia y se prefieren los diuréticos de asa.',
          'El QF revisa la dosis, el horario y la adherencia. La toma matutina reduce la nicturia. La educación incluye reconocer calambres, debilidad y mareo, y no suspender sin consultar.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de tiazidas',
      pasos: [
        { titulo: 'Indicación', detalle: 'HTA o edema leve.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Elegir', detalle: 'HCTZ, clortalidona o indapamida.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Controlar', detalle: 'Potasio, sodio y renal.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Educar', detalle: 'Horario y signos de alarma.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguir', detalle: 'Presión y electrolitos.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Calambres e hipopotasemia',
      contexto: 'Paciente con hidroclorotiazida que presenta calambres y potasio de 3,2 mEq/L.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Ignorar los síntomas.', correcta: false, retro: 'La hipopotasemia puede ser grave.' },
        { texto: 'Comunicar y valorar ajuste o combinación.', correcta: true, retro: 'Se corrige el riesgo y se mantiene el control.' },
        { texto: 'Duplicar la tiazida.', correcta: false, retro: 'Empeora la hipopotasemia.' },
      ],
    },
    errores: [
      { error: 'No controlar electrolitos.', correccion: 'Son efectos frecuentes.' },
      { error: 'Indicarla en ERC avanzada.', correccion: 'Pierde eficacia.' },
      { error: 'No revisar la fotosensibilidad.', correccion: 'Riesgo cutáneo.' },
    ],
    comprueba: [
      { pregunta: '¿Dónde actúan?', respuesta: 'En el túbulo contorneado distal.' },
      { pregunta: '¿Qué electrolito baja?', respuesta: 'El potasio y el sodio.' },
      { pregunta: '¿Cuándo pierden eficacia?', respuesta: 'En la enfermedad renal avanzada.' },
    ],
    resumen: [
      'Las tiazidas son eficaces y económicas.',
      'Exigen control metabólico.',
      'La clortalidona es más potente y prolongada.',
      'La educación y el seguimiento reducen abandonos.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Hidroclorotiazida Cinfa 25 mg comprimidos EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/72942/FT_72942.html' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/' },
    ],
    imagenes: [
      { ubicacion: 'Tiazidas', descripcion: 'Efectos metabólicos y monitorización de tiazidas.', alt: 'Tiazidas como antihipertensivos' },
    ],
    keywords: ['hidroclorotiazida', 'clortalidona', 'indapamida', 'tiazidas', 'hipopotasemia'],
  },
];

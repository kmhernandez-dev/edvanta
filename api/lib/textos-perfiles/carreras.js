/**
 * Texto editorial de las 11 carreras (/carreras/<slug>), 12-nov-2026.
 * Complementa lo que dice la base (resumen, qué hace, dónde trabaja): el
 * día a día, las normas que se usan (solo las verificadas en su fuente),
 * cómo prepararse y preguntas frecuentes. Sin salarios ni cifras que no
 * consten en una fuente oficial.
 */
const BPM = ['Curso gratis: Buenas Prácticas de Manufactura (BPM)', '/curso-de-buenas-practicas-de-manufactura-bpm'];
const GDP = ['Curso gratis: Buenas Prácticas de Documentación Farmacéutica', '/curso-de-buenas-practicas-de-documentacion-farmaceutica'];
const CAPA = ['Curso gratis: Gestión de Desviaciones y CAPA', '/curso-de-gestion-de-desviaciones-y-capa'];
const EXCEL = ['Guía: cursos de Excel para profesionales de la salud', '/articulos/cursos-de-excel-para-profesionales-de-la-salud'];

export const TEXTOS_CARRERAS = {
  'aseguramiento-de-calidad': {
    secciones: [
      { titulo: 'Un día de trabajo en aseguramiento de calidad', lista: [
        'Revisar expedientes de lote antes de su liberación y resolver las dudas con producción y control de calidad.',
        'Investigar desviaciones, acompañar el análisis de causa raíz y hacer seguimiento a las acciones correctivas y preventivas.',
        'Evaluar solicitudes de control de cambios y su impacto en la calidad y en el registro sanitario.',
        'Preparar y acompañar auditorías internas, de clientes y visitas del INVIMA.',
        'Mantener el sistema documental: procedimientos vigentes, entrenamientos y registros.',
      ] },
      { titulo: 'Las normas que vas a usar', lista: [
        'Resolución 1160 de 2016: manuales de buenas prácticas de manufactura de medicamentos.',
        'Decreto 335 de 2022: trámite de certificación de BPM ante el INVIMA.',
        'Guías ICH Q9 (gestión del riesgo de calidad) y Q10 (sistema de calidad farmacéutica) como referencia internacional.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Domina las BPM y las buenas prácticas de documentación.',
        'Aprende a investigar desviaciones con herramientas de causa raíz.',
        'Practica con auditorías internas como acompañante.',
        'Suma gestión de riesgos y mejora continua para crecer hacia cargos de liderazgo.',
      ], enlaces: [BPM, CAPA, ['Curso gratis: Aseguramiento de la Calidad Farmacéutica', '/curso-de-aseguramiento-de-la-calidad-farmaceutica'], ['Guía: cursos de aseguramiento de calidad', '/articulos/cursos-de-aseguramiento-de-calidad']] },
      { titulo: 'Qué buscan las empresas', lista: ['Criterio para decidir con base en el riesgo.', 'Rigor documental y atención al detalle.', 'Capacidad de comunicar hallazgos sin generar conflicto.', 'Conocimiento práctico de las BPM y de las inspecciones.'] },
    ],
    preguntas: [
      ['¿Qué diferencia hay entre aseguramiento y control de calidad?', 'Control de calidad analiza materiales y productos; aseguramiento gestiona el sistema completo que garantiza la calidad, incluido el control.'],
      ['¿Necesito experiencia previa para empezar?', 'No siempre. Muchas personas empiezan como analistas de documentación o auxiliares de calidad y crecen desde ahí.'],
      ['¿Qué norma de BPM aplica en Colombia?', 'La Resolución 1160 de 2016, con sus modificaciones; la certificación ante el INVIMA se rige por el Decreto 335 de 2022.'],
    ],
  },
  'asuntos-regulatorios': {
    secciones: [
      { titulo: 'Un día de trabajo en asuntos regulatorios', lista: [
        'Armar y revisar expedientes de registro sanitario, modificaciones y renovaciones.',
        'Responder requerimientos del INVIMA con la información técnica de las áreas.',
        'Evaluar si un cambio en el producto requiere un trámite y cuál.',
        'Revisar etiquetas, insertos y piezas de comunicación frente a lo aprobado.',
        'Hacer seguimiento a las normas nuevas y a su impacto en el portafolio.',
      ] },
      { titulo: 'Las normas que vas a usar', lista: [
        'Decreto 677 de 1995 y sus modificaciones: régimen de registros sanitarios de medicamentos.',
        'Resolución 1896 de 2023: información, promoción y publicidad de medicamentos.',
        'Normas propias para biológicos, fitoterapéuticos, suplementos y dispositivos médicos (Decreto 4725 de 2005).',
        'Guías ICH y de agencias de referencia como la FDA y la EMA.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Entiende el sistema sanitario colombiano y el papel del INVIMA.',
        'Aprende a armar un expediente y a responder requerimientos.',
        'Domina un tipo de producto (medicamentos, biológicos o dispositivos) y luego amplía.',
        'Suma inglés técnico para leer guías internacionales.',
      ], enlaces: [['Curso gratis: Asuntos Regulatorios Farmacéuticos en Colombia', '/curso-de-asuntos-regulatorios-farmaceuticos-en-colombia'], ['Curso gratis: Registro Sanitario de Medicamentos ante el INVIMA', '/curso-de-registro-sanitario-de-medicamentos-ante-el-invima'], ['Curso gratis: Respuesta a Requerimientos del INVIMA', '/curso-de-respuesta-a-requerimientos-del-invima'], ['Guía: cursos de asuntos regulatorios', '/articulos/cursos-de-asuntos-regulatorios']] },
      { titulo: 'Qué buscan las empresas', lista: ['Lectura cuidadosa de normas y capacidad de interpretarlas.', 'Organización para manejar muchos trámites y plazos.', 'Redacción técnica clara.', 'Inglés para leer y, a veces, escribir documentos.'] },
    ],
    preguntas: [
      ['¿Qué hace un profesional de asuntos regulatorios?', 'Prepara y presenta los trámites ante la autoridad sanitaria, mantiene vigentes los registros y asesora a la empresa sobre los requisitos.'],
      ['¿Es una carrera con demanda en Colombia?', 'Es una de las áreas más buscadas por laboratorios, importadores y distribuidores, porque todo producto necesita su registro y su mantenimiento.'],
      ['¿Por dónde empiezo si no tengo experiencia?', 'Por los cursos gratuitos de asuntos regulatorios y registro sanitario de Edvanta, y por cargos de apoyo como auxiliar o analista regulatorio.'],
    ],
  },
  'control-de-calidad': {
    secciones: [
      { titulo: 'Un día de trabajo en control de calidad', lista: [
        'Analizar materias primas, productos en proceso y terminados según sus métodos y especificaciones.',
        'Registrar los resultados con integridad de datos y revisar los de otros analistas.',
        'Investigar resultados fuera de especificación o fuera de tendencia.',
        'Mantener calibrados y calificados los equipos del laboratorio.',
        'Participar en estudios de estabilidad y en la validación de métodos.',
      ] },
      { titulo: 'Las normas que vas a usar', lista: [
        'Resolución 3619 de 2013: buenas prácticas de laboratorio de control de calidad de productos farmacéuticos.',
        'Farmacopeas, como la USP, para métodos y especificaciones.',
        'Guía ICH Q2(R2) para la validación de métodos analíticos.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Repasa química analítica y las técnicas más usadas, como la cromatografía líquida.',
        'Aprende buenas prácticas de laboratorio e integridad de datos.',
        'Practica cómo se investiga un resultado fuera de especificación.',
        'Suma validación de métodos y estabilidad para crecer.',
      ], enlaces: [['Curso gratis: Control de Calidad de Medicamentos', '/curso-de-control-de-calidad-de-medicamentos'], ['Curso gratis: Buenas Prácticas de Laboratorio (BPL)', '/curso-de-buenas-practicas-de-laboratorio-bpl'], ['Curso gratis: Validación de Métodos Analíticos', '/curso-de-validacion-de-metodos-analiticos'], ['Guía: cursos de HPLC', '/articulos/cursos-gratis-hplc']] },
      { titulo: 'Qué buscan las empresas', lista: ['Destreza analítica y cuidado en el laboratorio.', 'Integridad: registrar lo que pasó, también cuando algo sale mal.', 'Capacidad de seguir métodos y de cuestionarlos con datos.', 'Manejo de software de equipos y de hojas de cálculo.'] },
    ],
    preguntas: [
      ['¿Qué hace un analista de control de calidad?', 'Analiza materiales y productos, registra los resultados y participa en las investigaciones cuando algo no cumple.'],
      ['¿Qué técnica conviene dominar primero?', 'La cromatografía líquida (HPLC) es una de las más pedidas en los laboratorios farmacéuticos.'],
      ['¿Qué norma rige los laboratorios de control de calidad?', 'En Colombia, la Resolución 3619 de 2013.'],
    ],
  },
  'datos-para-la-industria-farmaceutica': {
    secciones: [
      { titulo: 'Un día de trabajo con datos en la industria', lista: [
        'Construir y mantener tableros de calidad, producción, ventas o farmacovigilancia.',
        'Limpiar y unir datos de varios sistemas para responder preguntas del negocio.',
        'Analizar tendencias de procesos, resultados de laboratorio o demanda.',
        'Automatizar informes que antes se hacían a mano.',
        'Cuidar la integridad y la confidencialidad de los datos.',
      ] },
      { titulo: 'Las reglas que vas a aplicar', lista: [
        'Principios de integridad de datos (ALCOA+) en entornos regulados.',
        'Ley 1581 de 2012 de protección de datos personales: los datos de salud son sensibles.',
        'Validación de sistemas computarizados cuando los datos apoyan decisiones de calidad.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Domina Excel: tablas, funciones de búsqueda y tablas dinámicas.',
        'Aprende Power BI para tableros y SQL para consultar bases de datos.',
        'Suma Python y estadística para análisis más profundos.',
        'Construye un portafolio con proyectos y datos de prueba.',
      ], enlaces: [EXCEL, ['Guía: Power BI en la industria farmacéutica', '/articulos/cursos-gratis-power-bi-farmacia'], ['Guía: Python para farmacia', '/articulos/cursos-gratis-python-para-farmacia'], ['Guía: integridad de datos', '/articulos/cursos-gratis-integridad-de-datos']] },
      { titulo: 'Qué buscan las empresas', lista: ['Herramientas: Excel, Power BI, SQL y, cada vez más, Python.', 'Entender el proceso que generan los datos (calidad, producción, ventas).', 'Comunicar hallazgos con claridad a quien decide.', 'Rigor con la confidencialidad y la trazabilidad.'] },
    ],
    preguntas: [
      ['¿Un químico farmacéutico puede trabajar en datos?', 'Sí, y tiene una ventaja: entiende los procesos que generan los datos. Le faltan las herramientas, que se aprenden con cursos y práctica.'],
      ['¿Qué herramienta aprender primero?', 'Excel bien dominado, luego Power BI y SQL, y después Python.'],
      ['¿Qué cuidar con los datos de salud?', 'Su confidencialidad: son datos sensibles según la Ley 1581 de 2012.'],
    ],
  },
  'farmacovigilancia': {
    secciones: [
      { titulo: 'Un día de trabajo en farmacovigilancia', lista: [
        'Recibir, validar y procesar casos de eventos adversos desde distintas fuentes.',
        'Codificar eventos y medicamentos, evaluar gravedad y causalidad y escribir la narrativa.',
        'Reportar al INVIMA dentro de los plazos de la norma.',
        'Revisar la literatura y las alertas de otras agencias sobre los productos de la empresa.',
        'Apoyar la detección de señales, los informes periódicos y los planes de gestión de riesgo.',
      ] },
      { titulo: 'Las normas que vas a usar', lista: [
        'Resolución INVIMA 2024015321 de 2024, vigente desde el 1 de marzo de 2025: 15 días calendario para reportar eventos graves y 90 para los no graves.',
        'Resolución 213 de 2022: guía para los planes de gestión de riesgo.',
        'Guías ICH E2 y las buenas prácticas de farmacovigilancia de la EMA como referencia.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Repasa farmacología: es la base para evaluar un caso.',
        'Aprende el procesamiento de casos individuales (ICSR).',
        'Entiende la norma colombiana y sus plazos.',
        'Avanza hacia señales, informes periódicos y planes de gestión de riesgo.',
      ], enlaces: [['Guía: reporte de eventos adversos', '/articulos/cursos-gratis-reporte-de-eventos-adversos'], ['Guía: detección de señales', '/articulos/cursos-gratis-deteccion-de-senales'], ['Guía: cursos de farmacovigilancia', '/articulos/cursos-de-farmacovigilancia'], ['Artículo: cursos de farmacología gratis', '/articulos/cursos-de-farmacologia-gratis']] },
      { titulo: 'Qué buscan las empresas', lista: ['Farmacología sólida y criterio clínico.', 'Atención a los plazos y a la calidad de los datos.', 'Inglés para la literatura y las bases internacionales.', 'Redacción clara de narrativas e informes.'] },
    ],
    preguntas: [
      ['¿Quién puede ser responsable de farmacovigilancia en Colombia?', 'Según la Resolución INVIMA 2024015321 de 2024, un médico o un químico farmacéutico con formación o experiencia en el área.'],
      ['¿Cuál es la puerta de entrada más común?', 'El procesamiento de casos individuales, en titulares de registro o en proveedores de servicios de farmacovigilancia.'],
      ['¿Qué plazos de reporte exige la norma?', '15 días calendario para los eventos graves y 90 para los no graves.'],
    ],
  },
  'industria-cosmetica': {
    secciones: [
      { titulo: 'Un día de trabajo en la industria cosmética', lista: [
        'Desarrollar o ajustar fórmulas y evaluar su estabilidad.',
        'Preparar la documentación técnica y la notificación sanitaria de los productos.',
        'Controlar la calidad de materias primas y productos terminados.',
        'Revisar que las etiquetas y la publicidad no atribuyan propiedades terapéuticas.',
        'Coordinar con producción, mercadeo y proveedores.',
      ] },
      { titulo: 'Las normas que vas a usar', lista: [
        'La normativa andina de productos cosméticos, que exige la notificación sanitaria obligatoria.',
        'Las buenas prácticas de manufactura cosmética.',
        'La regla de oro: un cosmético no puede atribuirse indicaciones terapéuticas.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Repasa química de formulación: emulsiones, tensoactivos y conservantes.',
        'Aprende estabilidad y control de calidad aplicados a cosméticos.',
        'Entiende el trámite de notificación sanitaria y el etiquetado.',
        'Suma marketing responsable para trabajar con los equipos comerciales.',
      ], enlaces: [['Guía: formulación farmacéutica', '/articulos/cursos-gratis-formulacion-farmaceutica'], ['Curso gratis: Estudios de Estabilidad de Medicamentos', '/curso-de-estudios-de-estabilidad-de-medicamentos'], ['Guía: etiquetado y publicidad', '/articulos/cursos-gratis-etiquetado-y-publicidad'], ['Noticia: producto para uñas con indicación terapéutica', '/articulos/anvisa-prohibe-producto-para-unas-con-indicacion-terapeutica']] },
      { titulo: 'Qué buscan las empresas', lista: ['Química de formulación y creatividad técnica.', 'Conocimiento regulatorio del sector cosmético.', 'Control de calidad y estabilidad.', 'Trabajo con equipos de mercadeo.'] },
    ],
    preguntas: [
      ['¿Un cosmético puede prometer curar algo?', 'No. Un cosmético limpia, protege o mejora la apariencia; tratar una enfermedad es una indicación de medicamento.'],
      ['¿Qué trámite necesita un cosmético para venderse en Colombia?', 'La notificación sanitaria obligatoria ante el INVIMA, según la normativa andina.'],
      ['¿Un químico farmacéutico puede trabajar en cosméticos?', 'Sí. Su formación en formulación, calidad y regulación es muy valorada en el sector.'],
    ],
  },
  'inteligencia-artificial-en-la-industria-farmaceutica': {
    secciones: [
      { titulo: 'Qué se hace con IA en la industria farmacéutica', lista: [
        'Automatizar la revisión y la clasificación de documentos, reclamos o casos de seguridad.',
        'Apoyar el análisis de tendencias de calidad y de producción.',
        'Acelerar tareas de investigación, como la búsqueda en literatura o el diseño de moléculas.',
        'Construir asistentes internos que respondan con base en procedimientos aprobados.',
        'Evaluar y vigilar el desempeño de los modelos en uso.',
      ] },
      { titulo: 'Las reglas que vas a aplicar', lista: [
        'Definir el contexto de uso y el riesgo de cada modelo, como proponen la FDA y la EMA.',
        'Proteger los datos personales y confidenciales (Ley 1581 de 2012).',
        'Validar los sistemas que apoyan decisiones de calidad en entornos regulados.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Aprende a usar asistentes de IA con criterio y verificación.',
        'Suma bases de datos y Python para trabajar con información real.',
        'Entiende la regulación y los riesgos de la IA en salud.',
        'Construye proyectos pequeños con datos de prueba.',
      ], enlaces: [['Guía: IA en la industria farmacéutica', '/articulos/cursos-gratis-ia-industria-farmaceutica'], ['Artículo: cursos de IA para profesionales de la salud', '/articulos/cursos-de-inteligencia-artificial-para-profesionales-de-la-salud'], ['Artículo: cursos de Claude Code', '/articulos/cursos-de-claude-code'], ['Guía: Python para farmacia', '/articulos/cursos-gratis-python-para-farmacia']] },
      { titulo: 'Qué buscan las empresas', lista: ['Entender el proceso farmacéutico y saber dónde la IA aporta valor.', 'Bases técnicas de datos y programación.', 'Criterio de riesgo y de cumplimiento.', 'Capacidad de explicar los resultados a quien decide.'] },
    ],
    preguntas: [
      ['¿Hace falta ser ingeniero para trabajar en IA farmacéutica?', 'No necesariamente. Los perfiles que unen conocimiento farmacéutico y bases técnicas son muy valorados.'],
      ['¿Qué riesgos tiene la IA en la industria?', 'La fuga de información, los datos inventados y el uso de resultados sin verificar en decisiones reguladas.'],
      ['¿Qué dicen las agencias reguladoras?', 'La FDA publicó en 2025 un borrador sobre el uso de IA en decisiones regulatorias, y la EMA, una reflexión sobre la IA en el ciclo de vida del medicamento.'],
    ],
  },
  'investigacion-y-desarrollo': {
    secciones: [
      { titulo: 'Un día de trabajo en investigación y desarrollo', lista: [
        'Diseñar y probar formulaciones a escala de laboratorio.',
        'Desarrollar y validar métodos analíticos para el producto nuevo.',
        'Planear y analizar estudios de estabilidad.',
        'Documentar el desarrollo para el expediente regulatorio.',
        'Acompañar el escalado y la transferencia a producción.',
      ] },
      { titulo: 'Las referencias que vas a usar', lista: [
        'Guías ICH Q8 (desarrollo farmacéutico), Q9 y Q10.',
        'Guías ICH Q1 de estabilidad, Q2(R2) y Q14 de métodos analíticos.',
        'En Colombia, los requisitos de estabilidad y de bioequivalencia exigidos para el registro sanitario.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Repasa tecnología farmacéutica y biofarmacia.',
        'Aprende diseño de experimentos y estadística básica.',
        'Domina estabilidad y validación de métodos.',
        'Entiende cómo se documenta el desarrollo para el expediente.',
      ], enlaces: [['Guía: formulación farmacéutica', '/articulos/cursos-gratis-formulacion-farmaceutica'], ['Guía: desarrollo analítico', '/articulos/cursos-gratis-desarrollo-analitico'], ['Curso gratis: Estudios de Estabilidad de Medicamentos', '/curso-de-estudios-de-estabilidad-de-medicamentos'], ['Guía: cursos de investigación y desarrollo', '/articulos/cursos-de-investigacion-y-desarrollo-farmaceutico']] },
      { titulo: 'Qué buscan las empresas', lista: ['Pensamiento científico y método experimental.', 'Tecnología farmacéutica y química analítica.', 'Documentación rigurosa.', 'Trabajo con calidad, producción y regulatorio.'] },
    ],
    preguntas: [
      ['¿Qué hace un formulador?', 'Diseña la formulación de un producto y la ajusta hasta que cumpla su perfil de calidad, estabilidad y desempeño.'],
      ['¿Qué es la calidad por diseño?', 'Un enfoque, descrito en la ICH Q8, que parte del perfil del producto buscado y diseña la formulación y el proceso para cumplirlo.'],
      ['¿Se necesita posgrado?', 'Ayuda en algunos cargos, pero muchos profesionales empiezan como analistas o formuladores junior.'],
    ],
  },
  'medical-affairs': {
    secciones: [
      { titulo: 'Un día de trabajo en asuntos médicos', lista: [
        'Preparar y revisar información científica sobre los productos para profesionales de la salud.',
        'Responder consultas médicas con evidencia, sin fines promocionales.',
        'Capacitar a los equipos comerciales en la ciencia de los productos.',
        'Revisar materiales para que sean exactos y equilibrados.',
        'Apoyar estudios posautorización y la relación con líderes de opinión.',
      ] },
      { titulo: 'Las normas que vas a usar', lista: [
        'Resolución 1896 de 2023: separa la información no publicitaria de la promoción y la publicidad de medicamentos.',
        'Las indicaciones aprobadas en el registro sanitario de cada producto.',
        'Las buenas prácticas de farmacovigilancia, porque las consultas pueden revelar eventos adversos.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Fortalece farmacología y lectura crítica de estudios.',
        'Aprende a comunicar ciencia de forma clara y equilibrada.',
        'Entiende la frontera entre información científica y promoción.',
        'Suma inglés para la literatura y los equipos internacionales.',
      ], enlaces: [['Artículo: cursos de farmacología gratis', '/articulos/cursos-de-farmacologia-gratis'], ['Curso gratis: Presentaciones Efectivas y Storytelling', '/curso-de-presentaciones-efectivas-y-storytelling'], ['Guía: etiquetado y publicidad', '/articulos/cursos-gratis-etiquetado-y-publicidad'], ['Guía: reporte de eventos adversos', '/articulos/cursos-gratis-reporte-de-eventos-adversos']] },
      { titulo: 'Qué buscan las empresas', lista: ['Formación científica sólida.', 'Lectura crítica de la evidencia.', 'Comunicación clara con médicos y equipos.', 'Ética y cumplimiento normativo.'] },
    ],
    preguntas: [
      ['¿Qué es medical affairs?', 'El área que gestiona la información científica de los productos y la relación con los profesionales de la salud, separada de la promoción comercial.'],
      ['¿Qué diferencia hay con un visitador médico?', 'El visitador cumple un rol comercial; asuntos médicos responde con evidencia, sin fines promocionales.'],
      ['¿Qué perfil se busca?', 'Químicos farmacéuticos, médicos y otros profesionales de la salud con buena base científica y de comunicación.'],
    ],
  },
  'produccion-farmaceutica': {
    secciones: [
      { titulo: 'Un día de trabajo en producción farmacéutica', lista: [
        'Planear y supervisar la fabricación de los lotes del día.',
        'Verificar que se cumplan las instrucciones, los controles en proceso y el despeje de línea.',
        'Revisar los registros de producción antes de entregarlos a calidad.',
        'Atender desviaciones y paradas de equipos.',
        'Entrenar al personal y cuidar la seguridad en planta.',
      ] },
      { titulo: 'Las normas que vas a usar', lista: [
        'Resolución 1160 de 2016: buenas prácticas de manufactura, incluido el manual de estériles.',
        'Procedimientos e instrucciones de fabricación aprobados.',
        'Normas de seguridad y salud en el trabajo de la planta.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Domina las BPM y las buenas prácticas de documentación.',
        'Aprende las operaciones unitarias de la forma farmacéutica que vas a fabricar.',
        'Practica la gestión de desviaciones.',
        'Suma Lean y liderazgo para coordinar equipos.',
      ], enlaces: [BPM, GDP, ['Guía: formas farmacéuticas sólidas', '/articulos/cursos-gratis-formas-solidas'], ['Guía: manufactura estéril', '/articulos/cursos-gratis-manufactura-esteril']] },
      { titulo: 'Qué buscan las empresas', lista: ['Disciplina con los procedimientos.', 'Liderazgo de personal operativo.', 'Capacidad para resolver problemas en tiempo real.', 'Conocimiento de equipos y procesos.'] },
    ],
    preguntas: [
      ['¿Qué hace un jefe de producción farmacéutica?', 'Coordina la fabricación de los lotes, el personal, los equipos y el cumplimiento de las BPM.'],
      ['¿Qué es el despeje de línea?', 'La verificación de que en una línea no quedan productos, materiales ni documentos del lote anterior antes de empezar el siguiente.'],
      ['¿Qué norma rige la producción en Colombia?', 'Las buenas prácticas de manufactura de la Resolución 1160 de 2016.'],
    ],
  },
  'validaciones': {
    secciones: [
      { titulo: 'Un día de trabajo en validaciones', lista: [
        'Redactar protocolos de calificación y de validación.',
        'Ejecutar pruebas en equipos, sistemas, procesos o métodos.',
        'Analizar resultados y redactar informes.',
        'Gestionar desviaciones durante la ejecución.',
        'Planear las recalificaciones y revalidaciones del año.',
      ] },
      { titulo: 'Las normas que vas a usar', lista: [
        'Resolución 1160 de 2016: las BPM exigen calificación y validación.',
        'El Anexo 15 de las GMP europeas y la guía de validación de procesos de la FDA como referencias.',
        'Guías ICH Q2(R2) para métodos analíticos y principios de validación de sistemas computarizados.',
      ] },
      { titulo: 'Cómo prepararte paso a paso', pasos: [
        'Distingue calificación de validación y aprende las etapas DQ, IQ, OQ y PQ.',
        'Practica la redacción de protocolos e informes.',
        'Aprende validación de procesos, de limpieza y de métodos.',
        'Suma estadística para el análisis de resultados.',
      ], enlaces: [['Curso gratis: Validaciones y Calificaciones', '/curso-de-validaciones-y-calificaciones'], ['Guía: validación de equipos', '/articulos/cursos-gratis-validacion-de-equipos'], ['Guía: validación de procesos', '/articulos/cursos-gratis-validacion-de-procesos'], ['Guía: validación de limpieza', '/articulos/cursos-gratis-validacion-de-limpieza']] },
      { titulo: 'Qué buscan las empresas', lista: ['Rigor técnico y documental.', 'Conocimiento de equipos y sistemas.', 'Estadística aplicada.', 'Trabajo con ingeniería, producción y calidad.'] },
    ],
    preguntas: [
      ['¿Qué diferencia hay entre calificar y validar?', 'Se califican los equipos, instalaciones y sistemas; se validan los procesos, la limpieza y los métodos.'],
      ['¿Qué significan DQ, IQ, OQ y PQ?', 'Calificación de diseño, de instalación, de operación y de desempeño.'],
      ['¿Es una buena área para empezar en la industria?', 'Sí. Da una visión técnica amplia de la planta y es muy demandada.'],
    ],
  },
};


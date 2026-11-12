/**
 * ============================================================
 *  guias-de-cursos-curados.js — Por qué y cómo usar cada curso curado
 *
 *  Las fichas de los cursos curados tenían unas 190 palabras: la
 *  descripción del proveedor (unas 13 palabras) y los datos básicos.
 *  Aquí está la guía editorial de Edvanta para cada curso, en el
 *  contexto del trabajo farmacéutico:
 *
 *   porQue        por qué el tema importa en farmacia o en la industria;
 *   aplicaciones  cómo se aplica en el trabajo, en casos concretos;
 *   paraQuien     perfiles a los que les sirve;
 *   complementa   cursos gratis, guías y artículos de Edvanta que lo
 *                 completan (enlaces internos reales);
 *   preguntas     preguntas propias de este curso.
 *
 *  Regla: la guía habla del TEMA y de su uso profesional. No describe el
 *  temario del proveedor ni promete nada de su plataforma: eso solo lo
 *  sabe el proveedor. Las claves son el slug de la tabla courses.
 *
 *  Lote 1 (11-nov-2026): 12 cursos de calidad, datos y núcleo
 *  farmacéutico. Los demás se agregan por lotes.
 * ============================================================
 */

export const GUIAS_DE_CURSOS_CURADOS = {
  'gestion-de-calidad': {
    porQue: 'Un sistema de gestión de calidad es la columna vertebral de cualquier organización farmacéutica: laboratorios, distribuidoras, operadores logísticos y servicios farmacéuticos. Entender el enfoque por procesos, los indicadores y la mejora continua te permite participar en certificaciones y auditorías, y hablar el mismo idioma que el área de calidad.',
    aplicaciones: [
      'Mapear los procesos de un servicio farmacéutico o de una bodega y definir sus indicadores.',
      'Preparar la revisión por la dirección con datos de quejas, desviaciones y auditorías.',
      'Organizar el control documental para que cada procedimiento tenga una versión vigente y una persona responsable.',
    ],
    paraQuien: ['Químicos farmacéuticos y regentes que coordinan servicios o bodegas', 'Profesionales que inician en aseguramiento de calidad', 'Equipos que preparan una certificación ISO 9001'],
    complementa: [
      ['Curso gratis: Gestión de Calidad Farmacéutica', '/curso-de-gestion-de-calidad-farmaceutica'],
      ['Curso gratis: Aseguramiento de la Calidad Farmacéutica', '/curso-de-aseguramiento-de-la-calidad-farmaceutica'],
      ['Guía: cursos de aseguramiento de calidad', '/articulos/cursos-de-aseguramiento-de-calidad'],
    ],
    preguntas: [
      ['¿Este curso sirve para la industria farmacéutica?', 'Sí, como base: los principios de gestión de calidad son comunes a todos los sectores. Para los requisitos específicos de medicamentos, compleméntalo con BPM y con el curso gratis de Gestión de Calidad Farmacéutica de Edvanta.'],
      ['¿Gestión de calidad y aseguramiento de calidad son lo mismo?', 'Se relacionan, pero no son iguales: la gestión de calidad es el sistema completo de la organización; el aseguramiento de calidad es la parte que garantiza que los procesos y los productos cumplan.'],
    ],
  },
  auditoria: {
    porQue: 'Las auditorías son la forma en que una organización farmacéutica comprueba que lo que dice en sus procedimientos es lo que hace en la práctica. Saber planear, entrevistar, recolectar evidencia y redactar hallazgos objetivos es una competencia muy valorada en calidad, en la relación con proveedores y en la preparación para las visitas del INVIMA.',
    aplicaciones: [
      'Diseñar y ejecutar el programa anual de autoinspecciones de una planta o un servicio farmacéutico.',
      'Auditar a un proveedor de materias primas o a un operador logístico antes de calificarlo.',
      'Redactar hallazgos claros, con evidencia y sin juicios, y hacer seguimiento a las acciones.',
    ],
    paraQuien: ['Profesionales de aseguramiento de calidad', 'Auditores internos en formación', 'Directores técnicos de distribuidoras y droguerías'],
    complementa: [
      ['Curso gratis: Auditoría de Calidad Farmacéutica', '/curso-de-auditoria-de-calidad-farmaceutica'],
      ['Curso gratis: Buenas Prácticas de Manufactura — BPM', '/curso-de-buenas-practicas-de-manufactura-bpm'],
      ['Guía de Claude para aseguramiento de calidad', '/guia/claude-aseguramiento-de-calidad-farmaceutica'],
    ],
    preguntas: [
      ['¿Qué diferencia hay entre una auditoría interna y una inspección del INVIMA?', 'La auditoría interna la hace la propia organización o un tercero contratado para mejorar; la inspección la hace la autoridad sanitaria para verificar el cumplimiento y puede tener consecuencias regulatorias.'],
      ['¿Cómo se redacta un buen hallazgo de auditoría?', 'Con el requisito incumplido, la evidencia objetiva observada y el hecho concreto, sin opiniones ni adjetivos. Un hallazgo bien escrito se puede verificar y no se presta a interpretaciones.'],
    ],
  },
  'lean-six-sigma': {
    porQue: 'Lean Six Sigma combina la eliminación de desperdicios con la reducción de la variabilidad usando datos. En la industria farmacéutica ayuda a disminuir rechazos, reprocesos y tiempos muertos, siempre que cada mejora respete las Buenas Prácticas de Manufactura y pase por control de cambios.',
    aplicaciones: [
      'Aplicar DMAIC para reducir la variabilidad del peso de las tabletas o del tiempo de liberación de lotes.',
      'Analizar las causas de los rechazos en el empaque y medir el efecto de la mejora.',
      'Construir indicadores y gráficos de control para vigilar un proceso después del cambio.',
    ],
    paraQuien: ['Profesionales de producción y calidad', 'Ingenieros y químicos farmacéuticos interesados en mejora continua', 'Coordinadores que lideran proyectos de mejora'],
    complementa: [
      ['Curso gratis: Gestión de Riesgos en la Calidad Farmacéutica', '/curso-de-gestion-de-riesgos-en-la-calidad-farmaceutica'],
      ['Curso gratis: Gestión de Desviaciones y CAPA', '/curso-de-gestion-de-desviaciones-y-capa'],
      ['Guía: cursos de producción farmacéutica', '/articulos/cursos-de-produccion-farmaceutica'],
    ],
    preguntas: [
      ['¿Lean Six Sigma se puede aplicar en un laboratorio farmacéutico?', 'Sí, con una condición: toda mejora que cambie un proceso validado o un documento aprobado debe pasar por control de cambios y, cuando corresponda, por una nueva validación.'],
      ['¿Qué es DMAIC?', 'Es el ciclo de mejora de Six Sigma: definir, medir, analizar, mejorar y controlar. Ordena un proyecto desde el problema hasta la mejora sostenida.'],
    ],
  },
  lean: {
    porQue: 'Lean enseña a ver el flujo de valor de un proceso y a eliminar lo que no aporta: esperas, movimientos innecesarios, inventarios excesivos y reprocesos. En farmacia y en la industria, esto se traduce en servicios más ágiles y plantas más eficientes sin bajar el estándar de calidad.',
    aplicaciones: [
      'Reducir los tiempos de espera en la dispensación de un servicio farmacéutico hospitalario.',
      'Ordenar una bodega de medicamentos con estandarización y gestión visual.',
      'Identificar desperdicios en el cambio de producto de una línea de empaque.',
    ],
    paraQuien: ['Regentes y químicos farmacéuticos de servicios y droguerías', 'Supervisores de producción y logística', 'Personas que empiezan en mejora continua'],
    complementa: [
      ['Curso curado: Lean Six Sigma', '/curso-de-lean-six-sigma'],
      ['Curso gratis: Buenas Prácticas de Manufactura — BPM', '/curso-de-buenas-practicas-de-manufactura-bpm'],
      ['Guía: cursos de producción farmacéutica', '/articulos/cursos-de-produccion-farmaceutica'],
    ],
    preguntas: [
      ['¿Lean sirve para un servicio farmacéutico?', 'Sí. Los principios de flujo, estandarización y gestión visual mejoran la dispensación, el almacenamiento y la gestión de inventarios.'],
      ['¿Qué diferencia hay entre Lean y Lean Six Sigma?', 'Lean se enfoca en eliminar desperdicios y mejorar el flujo; Lean Six Sigma suma herramientas estadísticas para reducir la variabilidad.'],
    ],
  },
  'power-bi': {
    porQue: 'Power BI convierte hojas de cálculo dispersas en tableros que se actualizan solos y se comparten con todo el equipo. Para un químico farmacéutico es una de las herramientas que más rápido mejora el trabajo diario: tendencias de calidad, indicadores del servicio, consumo de medicamentos o vencimientos.',
    aplicaciones: [
      'Construir un tablero de desviaciones por área, causa y estado para la revisión por la dirección.',
      'Seguir el consumo y la rotación de medicamentos de un servicio farmacéutico.',
      'Preparar la revisión anual de producto con gráficos de tendencias de los resultados analíticos.',
    ],
    paraQuien: ['Químicos farmacéuticos de calidad, laboratorio y servicio farmacéutico', 'Coordinadores que preparan informes periódicos', 'Profesionales que quieren dar el salto a un perfil de datos'],
    complementa: [
      ['Curso curado: Power BI avanzado', '/curso-de-power-bi-avanzado'],
      ['Guía: Automatización de tareas para químicos farmacéuticos', '/guia/claude-automatizacion-de-tareas-farmaceuticas'],
      ['Guía: cursos de datos e IA para químicos farmacéuticos', '/articulos/cursos-de-datos-e-inteligencia-artificial'],
    ],
    preguntas: [
      ['¿Sirve Power BI para químicos farmacéuticos?', 'Sí. Es útil en calidad, laboratorio, servicio farmacéutico y áreas comerciales, en cualquier tarea que hoy dependa de reportes repetidos en Excel.'],
      ['¿Necesito saber programar para usar Power BI?', 'No para empezar. Las bases se aprenden sin programar; el lenguaje DAX y las consultas avanzadas llegan después.'],
    ],
  },
  'power-bi-avanzado-10117': {
    porQue: 'Cuando ya dominas los tableros básicos, el siguiente paso es modelar datos de varias fuentes y escribir medidas que respondan preguntas de negocio. En el sector farmacéutico eso permite cruzar producción, calidad e inventarios en un solo lugar y anticipar problemas en lugar de explicarlos después.',
    aplicaciones: [
      'Integrar datos de producción, laboratorio y quejas en un único modelo para detectar relaciones.',
      'Calcular indicadores con medidas propias, como la tasa de lotes liberados a tiempo.',
      'Publicar tableros con permisos por área para que cada equipo vea solo lo suyo.',
    ],
    paraQuien: ['Profesionales que ya usan Power BI', 'Analistas de datos en laboratorios y distribuidoras', 'Coordinadores de calidad que gestionan muchos indicadores'],
    complementa: [
      ['Curso curado: Power BI', '/curso-de-power-bi'],
      ['Curso curado: SQL Server', '/curso-de-sql-server'],
      ['Guía: cursos de datos e IA para químicos farmacéuticos', '/articulos/cursos-de-datos-e-inteligencia-artificial'],
    ],
    preguntas: [
      ['¿Qué debo saber antes de un curso de Power BI avanzado?', 'Crear informes, relaciones básicas entre tablas y visualizaciones. Si aún no los dominas, empieza por el curso de Power BI.'],
      ['¿Para qué sirve el modelado de datos?', 'Para unir tablas de distintas fuentes de forma correcta, de modo que los indicadores no se dupliquen ni se pierdan registros.'],
    ],
  },
  'python-16658': {
    porQue: 'Python automatiza tareas que en Excel serían interminables: limpiar archivos repetidos, unir bases de datos, hacer estadística o preparar informes. En la industria farmacéutica y en investigación, es cada vez más común en análisis de datos, farmacoepidemiología y evidencia del mundo real.',
    aplicaciones: [
      'Automatizar la consolidación mensual de reportes que llegan en archivos distintos.',
      'Calcular estadísticas de resultados analíticos y graficar tendencias de estabilidad.',
      'Preparar datos para un tablero de Power BI sin hacerlo a mano cada vez.',
    ],
    paraQuien: ['Profesionales que ya dominan Excel y quieren automatizar', 'Investigadores y analistas de datos en salud', 'Químicos farmacéuticos interesados en un perfil de datos'],
    complementa: [
      ['Curso curado: Análisis de datos', '/curso-de-analisis-de-datos'],
      ['Curso curado: Power BI', '/curso-de-power-bi'],
      ['Guía: cursos de datos e IA para químicos farmacéuticos', '/articulos/cursos-de-datos-e-inteligencia-artificial'],
    ],
    preguntas: [
      ['¿Python sirve para un químico farmacéutico?', 'Sí, sobre todo si trabajas con muchos datos: calidad, laboratorio, farmacovigilancia o investigación. Te permite automatizar y hacer análisis que en Excel serían lentos.'],
      ['¿Qué debo aprender antes de Python?', 'Excel avanzado ayuda mucho, porque ya entiendes tablas, filtros y fórmulas. No necesitas experiencia previa en programación.'],
    ],
  },
  'sql-server-16657': {
    porQue: 'La mayoría de los sistemas de una empresa farmacéutica guardan sus datos en bases relacionales. Saber consultarlas con SQL te da autonomía: obtienes la información que necesitas sin esperar a que otra área te la exporte.',
    aplicaciones: [
      'Consultar el histórico de lotes y sus resultados para una investigación o una revisión anual.',
      'Extraer el inventario por vencimiento para planear rotación y destrucciones.',
      'Alimentar tableros de Power BI con consultas que se actualizan solas.',
    ],
    paraQuien: ['Analistas de datos en laboratorios, distribuidoras y servicios farmacéuticos', 'Profesionales de calidad que trabajan con sistemas de información', 'Quienes ya usan Power BI y quieren ir más allá'],
    complementa: [
      ['Curso curado: Power BI avanzado', '/curso-de-power-bi-avanzado'],
      ['Curso curado: Python', '/curso-de-python'],
      ['Guía: cursos de datos e IA para químicos farmacéuticos', '/articulos/cursos-de-datos-e-inteligencia-artificial'],
    ],
    preguntas: [
      ['¿Para qué sirve SQL en el sector farmacéutico?', 'Para consultar directamente las bases de datos de los sistemas de la empresa: inventarios, lotes, resultados o ventas, sin depender de exportaciones manuales.'],
      ['¿Es difícil aprender SQL?', 'Las consultas básicas se aprenden rápido; con práctica, puedes resolver la mayoría de las preguntas del día a día en pocas semanas.'],
    ],
  },
  'analisis-de-datos-20360': {
    porQue: 'El análisis de datos es la base para decidir con evidencia y no con intuición. En calidad, farmacovigilancia o servicio farmacéutico, saber limpiar, describir e interpretar datos te permite detectar tendencias, justificar decisiones y presentar resultados con claridad.',
    aplicaciones: [
      'Analizar las quejas de un año por producto y causa para priorizar acciones.',
      'Describir el consumo de antimicrobianos de un servicio para apoyar un programa de optimización.',
      'Comparar resultados de dos analistas o dos equipos con criterios estadísticos.',
    ],
    paraQuien: ['Profesionales que preparan informes e indicadores', 'Químicos farmacéuticos en calidad, farmacovigilancia o servicio farmacéutico', 'Quienes empiezan una ruta hacia un perfil de datos'],
    complementa: [
      ['Curso curado: Power BI', '/curso-de-power-bi'],
      ['Curso curado: Python', '/curso-de-python'],
      ['Guía: Claude para control de calidad farmacéutica', '/guia/claude-control-de-calidad-farmaceutica'],
    ],
    preguntas: [
      ['¿Qué herramientas se usan para el análisis de datos?', 'Excel es el punto de partida; después vienen Power BI para visualizar, SQL para consultar bases de datos y Python para automatizar y hacer estadística.'],
      ['¿El análisis de datos sirve en farmacovigilancia?', 'Sí. La detección de señales y los estudios de utilización de medicamentos se apoyan en el análisis de datos.'],
    ],
  },
  'gestion-ambiental': {
    porQue: 'Las plantas farmacéuticas, los servicios farmacéuticos y las droguerías generan residuos que requieren una gestión responsable: medicamentos vencidos, residuos químicos y empaques. La gestión ambiental ayuda a cumplir los requisitos, reducir el impacto y demostrar compromiso ante clientes y autoridades.',
    aplicaciones: [
      'Organizar la segregación y la disposición de medicamentos vencidos y residuos químicos.',
      'Identificar los aspectos e impactos ambientales de un laboratorio o de una bodega.',
      'Construir indicadores ambientales, como residuos generados por lote o consumo de agua.',
    ],
    paraQuien: ['Profesionales HSEQ de laboratorios y distribuidoras', 'Directores técnicos y regentes responsables de residuos', 'Coordinadores de sistemas de gestión integrados'],
    complementa: [
      ['Curso curado: Seguridad y salud en el trabajo', '/curso-de-seguridad-y-salud-en-el-trabajo'],
      ['Curso curado: Gestión de calidad', '/curso-de-gestion-de-calidad'],
      ['Curso gratis: Buenas Prácticas de Manufactura — BPM', '/curso-de-buenas-practicas-de-manufactura-bpm'],
    ],
    preguntas: [
      ['¿La gestión ambiental aplica a una droguería?', 'Sí. Las droguerías y los servicios farmacéuticos deben gestionar de forma adecuada sus residuos, en especial los medicamentos vencidos o deteriorados.'],
      ['¿Qué es un aspecto ambiental?', 'Es un elemento de las actividades de una organización que interactúa con el ambiente, como la generación de residuos o el consumo de energía.'],
    ],
  },
  'seguridad-y-salud-en-el-trabajo': {
    porQue: 'En un laboratorio o una planta farmacéutica conviven riesgos químicos, biológicos, ergonómicos y de máquinas. La seguridad y salud en el trabajo protege a las personas que hacen posible cada lote y es parte de los sistemas de gestión integrados que exigen muchos clientes.',
    aplicaciones: [
      'Identificar peligros y evaluar riesgos en un laboratorio de control de calidad.',
      'Definir controles para el manejo seguro de sustancias químicas y de equipos.',
      'Planear inspecciones y hacer seguimiento a las acciones de mejora.',
    ],
    paraQuien: ['Profesionales HSEQ del sector farmacéutico', 'Supervisores de producción y laboratorio', 'Coordinadores de sistemas de gestión integrados'],
    complementa: [
      ['Curso curado: Gestión ambiental', '/curso-de-gestion-ambiental'],
      ['Curso gratis: Buenas Prácticas de Laboratorio — BPL', '/curso-de-buenas-practicas-de-laboratorio-bpl'],
      ['Curso curado: Gestión de calidad', '/curso-de-gestion-de-calidad'],
    ],
    preguntas: [
      ['¿Qué riesgos hay en un laboratorio farmacéutico?', 'Principalmente químicos, biológicos, ergonómicos y asociados a equipos. Cada uno requiere una evaluación y controles específicos.'],
      ['¿La seguridad y salud en el trabajo se relaciona con las BPM?', 'Son sistemas distintos que se complementan: las BPM protegen la calidad del producto y la seguridad y salud en el trabajo protege a las personas.'],
    ],
  },
  'gestion-de-proyectos': {
    porQue: 'Lanzar un producto, implementar un sistema, preparar una certificación o transferir un proceso son proyectos con alcance, tiempo, recursos y riesgos. Saber gestionarlos evita retrasos costosos y es una de las competencias que más se piden para cargos de coordinación en la industria farmacéutica.',
    aplicaciones: [
      'Planear la preparación de una planta para la visita de certificación en BPM.',
      'Coordinar la implementación de un nuevo sistema de gestión documental.',
      'Organizar el cronograma de un expediente de registro con varias áreas involucradas.',
    ],
    paraQuien: ['Coordinadores y líderes de área', 'Profesionales de asuntos regulatorios y calidad que coordinan proyectos', 'Personas que buscan un cargo de jefatura'],
    complementa: [
      ['Curso gratis: Liderazgo y Trabajo en Equipo', '/curso-de-liderazgo-y-trabajo-en-equipo'],
      ['Curso gratis: Gestión de Riesgos en la Calidad Farmacéutica', '/curso-de-gestion-de-riesgos-en-la-calidad-farmaceutica'],
      ['Curso curado: Gestión de calidad', '/curso-de-gestion-de-calidad'],
    ],
    preguntas: [
      ['¿La gestión de proyectos sirve en la industria farmacéutica?', 'Sí. Lanzamientos, certificaciones, transferencias de tecnología y registros sanitarios son proyectos que exigen planear alcance, tiempo, recursos y riesgos.'],
      ['¿Qué es el alcance de un proyecto?', 'Es lo que el proyecto va a entregar y lo que no. Definirlo bien desde el inicio evita cambios que retrasan y encarecen el trabajo.'],
    ],
  },
};

/** La guía editorial de un curso curado, por el slug de la tabla courses. */
export const guiaDeCursoCurado = (slug) => GUIAS_DE_CURSOS_CURADOS[slug] || null;

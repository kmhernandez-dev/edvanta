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

import { GUIAS_LOTE_3 } from './guias-cursos/lote-3-industria.js';
import { GUIAS_LOTE_4 } from './guias-cursos/lote-4-salud.js';

const GUIAS_BASE = {
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

  // ── Lote 2 (12-nov-2026): farmacia y salud en Coursera y Edutin ──
  'coursera-pharmacokinetics': {
    porQue: 'La farmacocinética explica por qué dos pacientes con la misma dosis tienen concentraciones distintas del medicamento. Entender absorción, distribución, metabolismo y eliminación con base cuantitativa es lo que separa al químico farmacéutico que valida una orden del que solo la transcribe, y es la base de cualquier ajuste de dosis.',
    aplicaciones: [
      'Explicar al equipo médico por qué un paciente con falla renal necesita otro intervalo de dosis.',
      'Interpretar la vida media y el volumen de distribución en la ficha técnica de un medicamento nuevo.',
      'Preparar los cálculos de dosis de carga y de mantenimiento en un caso de farmacia hospitalaria.',
    ],
    paraQuien: ['Químicos farmacéuticos de farmacia hospitalaria y clínica', 'Estudiantes que cursan biofarmacia o farmacocinética', 'Profesionales de desarrollo que diseñan estudios de bioequivalencia'],
    complementa: [
      ['Curso curado: Clinical Pharmacokinetics: Dosing and Monitoring', '/curso-de-clinical-pharmacokinetics-dosing-and-monitoring'],
      ['Curso gratis: Bioequivalencia y Requisitos Regulatorios en Colombia', '/curso-de-bioequivalencia-y-requisitos-regulatorios-en-colombia'],
      ['Guía: Farmacocinética clínica aplicada', '/guia/farmacocinetica-clinica-aplicada'],
    ],
    preguntas: [
      ['¿Qué diferencia hay entre farmacocinética y farmacodinamia?', 'La farmacocinética estudia lo que el organismo le hace al medicamento (cómo lo absorbe, distribuye y elimina); la farmacodinamia, lo que el medicamento le hace al organismo.'],
      ['¿Necesito matemáticas avanzadas para la farmacocinética?', 'Las bases se manejan con álgebra y logaritmos. Los modelos más complejos llegan en farmacocinética clínica y en el desarrollo de medicamentos.'],
    ],
  },
  'coursera-clinical-pharmacokinetics-dosing-and-monitoring': {
    porQue: 'La farmacocinética clínica lleva la teoría a la cama del paciente: cuándo medir concentraciones, cómo interpretarlas y cómo ajustar la dosis de medicamentos de margen terapéutico estrecho. En los hospitales es una de las intervenciones farmacéuticas con más impacto en seguridad y en resultados.',
    aplicaciones: [
      'Proponer el ajuste de un antibiótico según la función renal y los niveles medidos.',
      'Definir el momento de toma de muestras para la monitorización de un medicamento de margen estrecho.',
      'Documentar una intervención farmacéutica de ajuste de dosis con su justificación.',
    ],
    paraQuien: ['Químicos farmacéuticos hospitalarios', 'Profesionales que participan en programas de optimización de antimicrobianos', 'Estudiantes en prácticas clínicas'],
    complementa: [
      ['Curso curado: Pharmacokinetics', '/curso-de-pharmacokinetics'],
      ['Curso gratis: Farmacología Renal', '/curso-de-farmacologia-renal'],
      ['Artículo: farmacocinética clínica y ajuste de dosis', '/articulos/farmacocinetica-clinica-ajuste-de-dosis'],
    ],
    preguntas: [
      ['¿Qué es la monitorización terapéutica de medicamentos?', 'Es medir la concentración de un medicamento en sangre para ajustar la dosis, sobre todo en medicamentos con margen terapéutico estrecho o con mucha variabilidad entre pacientes.'],
      ['¿Quién ajusta la dosis en el hospital?', 'El médico tratante decide; el químico farmacéutico propone y justifica el ajuste con base en la farmacocinética y en los resultados del paciente.'],
    ],
  },
  'coursera-drug-safety-and-pharmacovigilance': {
    porQue: 'Ningún ensayo clínico detecta todas las reacciones adversas de un medicamento: muchas aparecen cuando ya lo usan miles de personas. La farmacovigilancia es el sistema que las detecta, evalúa y previene, y en Colombia es una obligación tanto de los titulares de registro sanitario como de los servicios farmacéuticos.',
    aplicaciones: [
      'Evaluar la causalidad de una sospecha de reacción adversa reportada en el servicio farmacéutico.',
      'Preparar un reporte de evento adverso con la información mínima y de buena calidad.',
      'Participar en la detección de señales a partir de los reportes acumulados de un producto.',
    ],
    paraQuien: ['Químicos farmacéuticos de farmacovigilancia en la industria o en hospitales', 'Profesionales de asuntos regulatorios', 'Estudiantes interesados en seguridad de medicamentos'],
    complementa: [
      ['Guía: cursos de farmacovigilancia', '/articulos/cursos-de-farmacovigilancia'],
      ['Artículo: reporte de reacciones adversas paso a paso', '/articulos/farmacovigilancia-reporte-ram-paso-a-paso'],
      ['Guía: Seguridad del medicamento', '/guia/seguridad-del-medicamento'],
    ],
    preguntas: [
      ['¿Qué es una señal en farmacovigilancia?', 'Es información que sugiere una posible relación nueva, o un aspecto nuevo de una relación conocida, entre un medicamento y un evento adverso, y que merece ser investigada.'],
      ['¿Este curso cubre la normativa colombiana?', 'Es un curso internacional. Para los requisitos del INVIMA conviene complementarlo con formación sobre la normativa nacional de farmacovigilancia.'],
    ],
  },
  'coursera-antibioticos-uso-prudente': {
    porQue: 'La resistencia a los antimicrobianos es una de las principales amenazas para la salud pública, y el uso inadecuado de antibióticos la acelera. Los químicos farmacéuticos son piezas clave de los programas de optimización de antimicrobianos: validan prescripciones, ajustan dosis y educan a pacientes y equipos. Este curso, en español, es una buena puerta de entrada.',
    aplicaciones: [
      'Revisar la duración y la indicación de los tratamientos antibióticos de un servicio.',
      'Educar al paciente en el mostrador sobre por qué no debe automedicarse con antibióticos.',
      'Participar en las rondas del programa de optimización de antimicrobianos del hospital.',
    ],
    paraQuien: ['Químicos farmacéuticos y regentes de farmacia', 'Personal de enfermería y medicina', 'Estudiantes de ciencias de la salud'],
    complementa: [
      ['Curso curado: Antibiotic Stewardship', '/curso-de-antibiotic-stewardship'],
      ['Guía: Stewardship farmacéutico (PROA)', '/guia/stewardship-farmaceutico-proa'],
      ['Artículo: interacciones medicamentosas', '/articulos/interacciones-medicamentosas-deteccion-manejo'],
    ],
    preguntas: [
      ['¿Qué es un programa PROA?', 'Es un programa de optimización del uso de antimicrobianos en una institución de salud, con un equipo que revisa y mejora la prescripción de antibióticos.'],
      ['¿Este curso está en español?', 'Sí. Es uno de los cursos de Coursera de esta área disponibles en español.'],
    ],
  },
  'coursera-drug-development': {
    porQue: 'Entender cómo una molécula llega a ser un medicamento aprobado da contexto a casi todos los cargos de la industria: calidad, asuntos regulatorios, producción e investigación. Quien conoce las fases del desarrollo entiende por qué se piden ciertos estudios, cuánto tardan y qué riesgos se controlan en cada etapa.',
    aplicaciones: [
      'Explicar en una entrevista cómo se relacionan los estudios preclínicos, clínicos y de estabilidad.',
      'Leer un expediente de registro sabiendo de qué etapa del desarrollo viene cada documento.',
      'Planear la transferencia de un producto del desarrollo a la planta.',
    ],
    paraQuien: ['Estudiantes y recién graduados que buscan entrar a la industria', 'Profesionales de asuntos regulatorios e I+D', 'Químicos farmacéuticos de calidad que quieren entender el ciclo completo'],
    complementa: [
      ['Guía: cursos de investigación y desarrollo farmacéutico', '/articulos/cursos-de-investigacion-y-desarrollo-farmaceutico'],
      ['Curso gratis: Elaboración de Dossiers Farmacéuticos', '/curso-de-elaboracion-de-dossiers-farmaceuticos'],
      ['Curso curado: Drug Discovery', '/curso-de-drug-discovery'],
    ],
    preguntas: [
      ['¿Cuáles son las fases del desarrollo de un medicamento?', 'Descubrimiento, estudios preclínicos, ensayos clínicos en fases I, II y III, evaluación regulatoria y, después de la aprobación, vigilancia poscomercialización.'],
      ['¿Sirve para trabajar en asuntos regulatorios?', 'Sí, como base. El trabajo regulatorio consiste en demostrar ante la autoridad lo que se hizo en cada etapa del desarrollo.'],
    ],
  },
  'coursera-medication-prescribing': {
    porQue: 'Revisar una prescripción no es solo comprobar que el medicamento exista: es verificar indicación, dosis, interacciones, contraindicaciones y adecuación al paciente. Entender cómo se razona una prescripción hace más útil la validación farmacéutica y mejora la conversación con el prescriptor.',
    aplicaciones: [
      'Validar órdenes médicas en un servicio farmacéutico hospitalario con criterios explícitos.',
      'Detectar duplicidades e interacciones en pacientes polimedicados.',
      'Preparar una sugerencia al prescriptor con la evidencia que la respalda.',
    ],
    paraQuien: ['Químicos farmacéuticos de servicio farmacéutico y farmacia clínica', 'Estudiantes de ciencias de la salud', 'Profesionales que hacen conciliación de medicamentos'],
    complementa: [
      ['Artículo: errores de medicación y su prevención', '/articulos/errores-medicacion-prevencion-sistemas'],
      ['Curso gratis: Farmacología Cardiovascular', '/curso-de-farmacologia-cardiovascular'],
      ['Guía: Pharmacotherapy Workup (Cipolle, Strand y Morley)', '/guia/pharmacotherapy-workup-cipolle-strand-morley'],
    ],
    preguntas: [
      ['¿El químico farmacéutico puede modificar una prescripción?', 'No por su cuenta. Puede detectar problemas y proponer cambios al prescriptor, que es quien decide.'],
      ['¿Qué se revisa al validar una prescripción?', 'Indicación, dosis, vía, frecuencia, duración, interacciones, contraindicaciones, alergias y la adecuación a la función renal o hepática del paciente.'],
    ],
  },
  'diabetes-20358': {
    porQue: 'La diabetes es una de las enfermedades crónicas más frecuentes en la consulta y en la farmacia, y su tratamiento cambió mucho con los agonistas del GLP-1 y los inhibidores de SGLT2. Un repaso general de la enfermedad ayuda a cualquier profesional de la salud a acompañar mejor al paciente y a detectar a tiempo los problemas del tratamiento.',
    aplicaciones: [
      'Explicar al paciente qué es la hemoglobina glicada y por qué se mide.',
      'Reconocer y enseñar a manejar los síntomas de una hipoglucemia.',
      'Identificar pacientes con baja adherencia y derivarlos a seguimiento.',
    ],
    paraQuien: ['Regentes y auxiliares de farmacia', 'Personal de enfermería', 'Profesionales que inician en la atención de pacientes crónicos'],
    complementa: [
      ['Curso gratis: Farmacoterapia de la Diabetes', '/curso-de-farmacoterapia-de-la-diabetes'],
      ['Curso gratis: Farmacología Endocrina', '/curso-de-farmacologia-endocrina'],
      ['Artículo: cursos de diabetes para profesionales de la salud', '/articulos/cursos-de-diabetes-para-profesionales-de-la-salud'],
    ],
    preguntas: [
      ['¿Este curso sirve a un químico farmacéutico?', 'Como repaso general, sí. Para tomar decisiones de farmacoterapia con casos clínicos, el curso gratuito de Farmacoterapia de la Diabetes de Edvanta es más específico.'],
      ['¿Qué es la hemoglobina glicada?', 'Es un examen que refleja el promedio de glucosa en sangre de los últimos dos a tres meses y se usa para seguir el control de la diabetes.'],
    ],
  },
  'telesalud-y-telemedicina-22313': {
    porQue: 'La atención a distancia ya es parte del sistema de salud colombiano, y desde el 31 de julio de 2026 tiene nuevas reglas: la Resolución 1644 del Ministerio de Salud, que derogó la 2654 de 2019 y define cuatro categorías de telemedicina. Formarse en telesalud permite ofrecer seguimiento, educación y orientación a pacientes que no pueden ir a la consulta.',
    aplicaciones: [
      'Diseñar un seguimiento farmacoterapéutico por videollamada para pacientes crónicos.',
      'Educar a distancia sobre la técnica de inhaladores o la aplicación de insulina.',
      'Organizar la teleorientación de un servicio farmacéutico con registro en la historia clínica.',
    ],
    paraQuien: ['Profesionales de la salud que atienden pacientes crónicos', 'Químicos farmacéuticos de atención farmacéutica', 'Coordinadores de servicios que implementan atención remota'],
    complementa: [
      ['Artículo: cursos de telemedicina y telesalud en Colombia', '/articulos/cursos-de-telemedicina-y-telesalud'],
      ['Curso gratis: Servicio al Cliente y Comunicación con el Paciente', '/curso-de-servicio-al-cliente'],
      ['Curso gratis: Hablar frente a la cámara', '/curso-para-hablar-frente-a-la-camara'],
    ],
    preguntas: [
      ['¿Qué norma regula la telemedicina en Colombia?', 'La Ley 1419 de 2010 y la Resolución 1644 del 31 de julio de 2026 del Ministerio de Salud, que derogó la Resolución 2654 de 2019.'],
      ['¿Qué categorías de telemedicina existen?', 'Telexperticia, teleconcepto, teleconsulta y telemonitoreo, según la Resolución 1644 de 2026.'],
    ],
  },
  'farmacologia-clinica-7429': {
    porQue: 'La farmacología clínica conecta lo que se aprende de cada medicamento con el paciente real: comorbilidades, otros tratamientos, edad y función de los órganos. Repasarla con enfoque clínico ayuda a prevenir errores de medicación y a participar con argumentos en las decisiones del equipo de salud.',
    aplicaciones: [
      'Revisar el tratamiento de un paciente polimedicado en busca de interacciones relevantes.',
      'Ajustar la educación al paciente según los efectos adversos más probables de su tratamiento.',
      'Preparar un caso clínico para una sesión académica del servicio.',
    ],
    paraQuien: ['Estudiantes de ciencias de la salud', 'Químicos farmacéuticos que vuelven a la práctica clínica', 'Personal de enfermería y regentes de farmacia'],
    complementa: [
      ['Curso gratis: Farmacología Cardiovascular', '/curso-de-farmacologia-cardiovascular'],
      ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
      ['Artículo: clasificación de PRM y RNM con ejemplos', '/articulos/clasificacion-prm-rnm-ejemplos-clinicos'],
    ],
    preguntas: [
      ['¿Qué diferencia hay entre farmacología y farmacología clínica?', 'La farmacología estudia cómo actúan los medicamentos; la farmacología clínica aplica ese conocimiento al uso en pacientes reales, con su variabilidad y sus riesgos.'],
      ['¿Qué cursos de farmacología gratis ofrece Edvanta?', 'Doce cursos por sistemas, desde farmacología cardiovascular y renal hasta oncológica y psicofarmacología, con contenido gratuito y certificado opcional.'],
    ],
  },
  'excel-10219': {
    porQue: 'Casi todos los cargos farmacéuticos trabajan con Excel: inventarios, indicadores de calidad, cronogramas de calibración, resultados de laboratorio o reportes de farmacovigilancia. Dominar tablas, filtros, fórmulas y tablas dinámicas ahorra horas cada semana y es requisito de muchas vacantes.',
    aplicaciones: [
      'Llevar el control de vencimientos y rotación de un inventario de medicamentos.',
      'Calcular promedios, desviación estándar y tendencias de resultados analíticos.',
      'Preparar los indicadores mensuales de un servicio farmacéutico con tablas dinámicas.',
    ],
    paraQuien: ['Estudiantes y recién graduados', 'Regentes y auxiliares de farmacia', 'Profesionales que van a dar el salto a Power BI'],
    complementa: [
      ['Curso curado: Power BI', '/curso-de-power-bi'],
      ['Artículo: para qué sirve Power BI en salud y farmacia', '/articulos/power-bi-para-que-sirve-en-salud-y-farmacia'],
      ['Guía: cursos de datos e IA para químicos farmacéuticos', '/articulos/cursos-de-datos-e-inteligencia-artificial'],
    ],
    preguntas: [
      ['¿Qué nivel de Excel piden las vacantes farmacéuticas?', 'Lo más común es un nivel intermedio: tablas, filtros, funciones de búsqueda y tablas dinámicas. Los cargos de datos piden además Power BI.'],
      ['¿Excel sirve para registros regulados?', 'Puede usarse, pero en entornos BPM las hojas de cálculo que generan datos regulados deben estar controladas y validadas para proteger la integridad de los datos.'],
    ],
  },
  'manejo-de-sustancias-quimicas-peligrosas-7431': {
    porQue: 'Laboratorios de control de calidad, plantas de producción y bodegas farmacéuticas manejan solventes inflamables, ácidos, bases y principios activos potentes. Saber clasificarlos, almacenarlos, rotularlos y actuar ante un derrame protege a las personas y evita hallazgos en auditorías de seguridad y de calidad.',
    aplicaciones: [
      'Organizar el almacenamiento de reactivos por compatibilidad química en el laboratorio.',
      'Leer una ficha de datos de seguridad antes de usar un reactivo nuevo.',
      'Preparar el plan de respuesta ante un derrame en la bodega de materias primas.',
    ],
    paraQuien: ['Analistas de laboratorio y químicos farmacéuticos de control de calidad', 'Personal de bodega y producción', 'Responsables de seguridad y salud en el trabajo'],
    complementa: [
      ['Artículo: cursos de seguridad y salud en el trabajo gratis', '/articulos/cursos-de-seguridad-y-salud-en-el-trabajo-sst-gratis'],
      ['Curso gratis: Buenas Prácticas de Laboratorio — BPL', '/curso-de-buenas-practicas-de-laboratorio-bpl'],
      ['Curso curado: Manejo de materiales peligrosos', '/curso-de-manejo-de-materiales-peligrosos'],
    ],
    preguntas: [
      ['¿Qué es una ficha de datos de seguridad?', 'Es el documento del fabricante que describe los peligros de una sustancia, cómo manipularla, almacenarla y qué hacer en caso de emergencia.'],
      ['¿Este curso reemplaza el curso de 50 horas del SG-SST?', 'No. El curso de 50 horas es el que exige la norma a los responsables del SG-SST; este curso lo complementa con el riesgo químico.'],
    ],
  },
  'prevencion-de-riesgos-laborales-prl-13572': {
    porQue: 'La prevención de riesgos laborales es la forma práctica de cuidar a quienes trabajan: identificar los peligros antes de que causen daño y aplicar controles en el orden correcto, de la eliminación a los elementos de protección personal. Para quien coordina personal en una farmacia, un laboratorio o una planta, es parte del trabajo diario.',
    aplicaciones: [
      'Hacer una inspección de seguridad de un área y priorizar los hallazgos.',
      'Investigar un incidente sin buscar culpables, para evitar que se repita.',
      'Incluir los riesgos laborales en la inducción del personal nuevo.',
    ],
    paraQuien: ['Coordinadores y jefes de área con personal a cargo', 'Miembros del COPASST o vigías de SST', 'Profesionales que inician en seguridad y salud en el trabajo'],
    complementa: [
      ['Curso curado: Seguridad y salud en el trabajo', '/curso-de-seguridad-y-salud-en-el-trabajo'],
      ['Artículo: cursos de SST gratis y el curso de 50 horas', '/articulos/cursos-de-seguridad-y-salud-en-el-trabajo-sst-gratis'],
      ['Curso gratis: Liderazgo y Trabajo en Equipo', '/curso-de-liderazgo-y-trabajo-en-equipo'],
    ],
    preguntas: [
      ['¿Qué es la jerarquía de controles?', 'Es el orden en que se aplican los controles de un riesgo: eliminar el peligro, sustituirlo, aplicar controles de ingeniería, controles administrativos y, al final, elementos de protección personal.'],
      ['¿PRL y SST son lo mismo?', 'Se refieren al mismo objetivo. En Colombia la normativa usa el término seguridad y salud en el trabajo y el sistema se llama SG-SST.'],
    ],
  },
};

/**
 * Todas las guías: las de los lotes 1 y 2 (arriba) y las de los lotes
 * siguientes, cada uno en su archivo de api/lib/guias-cursos/.
 */
export const GUIAS_DE_CURSOS_CURADOS = {
  ...GUIAS_BASE,
  ...GUIAS_LOTE_3,
  ...GUIAS_LOTE_4,
};

/** La guía editorial de un curso curado, por el slug de la tabla courses. */
export const guiaDeCursoCurado = (slug) => GUIAS_DE_CURSOS_CURADOS[slug] || null;

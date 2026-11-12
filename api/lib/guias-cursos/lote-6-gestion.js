/**
 * Guías editoriales de cursos curados · Lote 6 (12-nov-2026)
 * Gestión, calidad, ISO, auditoría, proyectos y operaciones. En los cursos
 * por niveles (Gestión de calidad II a VI, Auditoría II y III) la guía no
 * describe el temario: dice qué conviene practicar en el trabajo en esa
 * etapa de la ruta.
 */
const CALIDAD = ['Curso gratis: Gestión de Calidad Farmacéutica', '/curso-de-gestion-de-calidad-farmaceutica'];
const ASEGURAMIENTO = ['Guía: cursos de aseguramiento de calidad', '/articulos/cursos-de-aseguramiento-de-calidad'];
const AUDITORIA = ['Curso gratis: Auditoría de Calidad Farmacéutica', '/curso-de-auditoria-de-calidad-farmaceutica'];
const ISO = ['Guía: cursos de ISO 9001', '/articulos/cursos-gratis-iso-9001'];
const LIDERAZGO = ['Artículo: cursos de talento humano y liderazgo en salud', '/articulos/cursos-de-talento-humano-y-liderazgo-en-salud'];
const PROYECTOS = ['Artículo: cursos de gestión de proyectos con certificado', '/articulos/cursos-de-gestion-de-proyectos-con-certificado'];
const LOGISTICA = ['Artículo: cursos de logística farmacéutica', '/articulos/cursos-de-logistica-farmaceutica-y-cadena-de-suministro'];
const SST = ['Artículo: cursos de SST gratis y el curso de 50 horas', '/articulos/cursos-de-seguridad-y-salud-en-el-trabajo-sst-gratis'];

export const GUIAS_LOTE_6 = {
  'gestion-del-riesgo-15970': {
    tituloSeo: 'Curso de gestión del riesgo online en español',
    meta: 'Curso en español de Edutin Academy sobre gestión del riesgo en organizaciones, con la guía de Edvanta sobre riesgos de calidad en farmacia.',
    porQue: 'Toda organización enfrenta riesgos: operativos, financieros, legales y, en salud, riesgos para los pacientes. Gestionarlos es identificarlos, evaluar su probabilidad e impacto y decidir controles antes de que ocurran. Es la misma lógica que usa la gestión de riesgos de calidad en la industria farmacéutica.',
    aplicaciones: [
      'Construir una matriz de riesgos de un proceso con probabilidad e impacto.',
      'Definir controles y responsables para los riesgos más altos.',
      'Revisar los riesgos después de un incidente o un cambio.',
    ],
    paraQuien: ['Coordinadores de calidad y de procesos', 'Administradores de droguerías e IPS'],
    complementa: [['Curso gratis: Gestión de Riesgos en la Calidad Farmacéutica', '/curso-de-gestion-de-riesgos-en-la-calidad-farmaceutica'], ['Guía: gestión de riesgos de calidad', '/articulos/cursos-gratis-gestion-de-riesgos'], CALIDAD],
    preguntas: [
      ['¿Qué es una matriz de riesgos?', 'Una tabla que cruza la probabilidad y el impacto de cada riesgo para priorizar cuáles controlar primero.'],
      ['¿Qué guía se usa en la industria farmacéutica?', 'La ICH Q9 sobre gestión del riesgo de calidad.'],
    ],
  },
  'gestion-de-calidad-ii-9948': {
    tituloSeo: 'Curso de gestión de calidad II en Edutin',
    meta: 'Segundo nivel de la ruta de gestión de calidad de Edutin Academy, en español, con la guía de Edvanta para aplicarlo en servicios de salud.',
    porQue: 'Quien avanza al segundo nivel de una ruta de gestión de calidad ya conoce los conceptos básicos y necesita empezar a aplicarlos: medir procesos, documentar lo que se hace y detectar dónde están los problemas. Es el momento de llevar la teoría a un proceso real de tu trabajo.',
    aplicaciones: [
      'Escoger un proceso de tu área y definir sus indicadores.',
      'Revisar si los procedimientos describen lo que de verdad se hace.',
      'Registrar los problemas recurrentes para analizarlos después.',
    ],
    paraQuien: ['Quienes terminaron el primer nivel de gestión de calidad', 'Coordinadores de servicios farmacéuticos y bodegas'],
    complementa: [CALIDAD, ASEGURAMIENTO, ['Curso gratis: Buenas Prácticas de Documentación Farmacéutica', '/curso-de-buenas-practicas-de-documentacion-farmaceutica']],
    preguntas: [
      ['¿Necesito el primer nivel?', 'Conviene: la ruta está pensada en orden.'],
      ['¿Cómo aplicar lo aprendido en una farmacia?', 'Escogiendo un proceso, como la recepción técnica o la dispensación, y midiendo cómo funciona.'],
    ],
  },
  'gestion-de-calidad-iii-9949': {
    tituloSeo: 'Curso de gestión de calidad III en Edutin',
    meta: 'Tercer nivel de la ruta de gestión de calidad de Edutin Academy, en español, con la guía de Edvanta sobre análisis de causas y mejora.',
    porQue: 'En la mitad de una ruta de calidad, el foco pasa de describir los procesos a mejorarlos: analizar causas, probar cambios y comprobar si funcionaron. Es la etapa en la que conviene practicar herramientas como el diagrama de causa y efecto o los cinco porqués con problemas reales.',
    aplicaciones: [
      'Analizar la causa raíz de un problema recurrente de tu área.',
      'Proponer una acción correctiva y definir cómo medir su efecto.',
      'Presentar el análisis al equipo con datos.',
    ],
    paraQuien: ['Quienes avanzan en la ruta de gestión de calidad', 'Analistas de calidad que inician en mejora continua'],
    complementa: [['Curso gratis: Gestión de Desviaciones y CAPA', '/curso-de-gestion-de-desviaciones-y-capa'], ['Guía: CAPA y desviaciones', '/articulos/cursos-gratis-capa-desviaciones'], CALIDAD],
    preguntas: [
      ['¿Qué son los cinco porqués?', 'Una técnica que pregunta varias veces por qué ocurrió algo hasta llegar a una causa sobre la que se puede actuar.'],
      ['¿Qué es una acción correctiva?', 'Una acción que elimina la causa de un problema para que no se repita.'],
    ],
  },
  'gestion-de-calidad-iv-15597': {
    tituloSeo: 'Curso de gestión de calidad IV en Edutin',
    meta: 'Cuarto nivel de la ruta de gestión de calidad de Edutin Academy, en español, con la guía de Edvanta sobre indicadores y revisión por la dirección.',
    porQue: 'Cuando la ruta de calidad avanza, el reto es que el sistema funcione solo: indicadores que se revisan con regularidad, auditorías que generan acciones y una dirección que decide con datos. Es la etapa para practicar la preparación de una revisión por la dirección.',
    aplicaciones: [
      'Preparar la información para una revisión por la dirección.',
      'Revisar la tendencia de los indicadores de un semestre.',
      'Hacer seguimiento a las acciones abiertas de auditorías anteriores.',
    ],
    paraQuien: ['Coordinadores de calidad con experiencia', 'Quienes avanzan en la ruta de gestión de calidad'],
    complementa: [ISO, ['Guía: Power BI en la industria farmacéutica', '/articulos/cursos-gratis-power-bi-farmacia'], CALIDAD],
    preguntas: [
      ['¿Qué es la revisión por la dirección?', 'Una revisión periódica en la que la alta dirección evalúa el desempeño del sistema de calidad y decide acciones.'],
      ['¿Qué indicadores llevar a esa revisión?', 'Quejas, desviaciones, resultados de auditorías, cumplimiento de objetivos y acciones abiertas, entre otros.'],
    ],
  },
  'gestion-de-calidad-v-11783': {
    tituloSeo: 'Curso de gestión de calidad V en Edutin',
    meta: 'Quinto nivel de la ruta de gestión de calidad de Edutin Academy, en español, con la guía de Edvanta sobre sistemas integrados.',
    porQue: 'En los niveles avanzados, la calidad deja de ser un área aislada y se integra con la seguridad y salud en el trabajo, el ambiente y la gestión del riesgo. Muchas organizaciones de salud trabajan con sistemas integrados, y quien los coordina necesita ver cómo se conectan sus requisitos.',
    aplicaciones: [
      'Identificar requisitos comunes entre los sistemas de calidad, SST y ambiente.',
      'Unificar procedimientos repetidos en un sistema integrado.',
      'Planear auditorías combinadas para ahorrar tiempo.',
    ],
    paraQuien: ['Coordinadores de sistemas integrados de gestión', 'Profesionales avanzados en la ruta de calidad'],
    complementa: [SST, ISO, ['Curso: Gestión ambiental (Edutin)', '/curso-de-gestion-ambiental']],
    preguntas: [
      ['¿Qué es un sistema integrado de gestión?', 'Un sistema que reúne en una sola estructura los requisitos de calidad, seguridad y salud en el trabajo, ambiente u otros.'],
      ['¿Qué normas suelen integrarse?', 'Con frecuencia ISO 9001, ISO 14001 e ISO 45001, además de los requisitos legales del sector.'],
    ],
  },
  'gestion-de-calidad-vi-18252': {
    tituloSeo: 'Curso de gestión de calidad VI en Edutin',
    meta: 'Último nivel de la ruta de gestión de calidad de Edutin Academy, en español, con la guía de Edvanta para liderar un sistema de calidad.',
    porQue: 'Al final de una ruta de calidad, el reto ya no es técnico sino de liderazgo: lograr que toda la organización entienda por qué importa la calidad, que reporte los problemas sin miedo y que mejore de forma continua. Es el momento de practicar la conducción de un equipo de calidad.',
    aplicaciones: [
      'Diseñar un plan de formación en calidad para todo el personal.',
      'Promover una cultura de reporte de errores sin castigo.',
      'Definir los objetivos de calidad del año con la dirección.',
    ],
    paraQuien: ['Líderes y jefes de calidad', 'Profesionales que terminan la ruta de gestión de calidad'],
    complementa: [LIDERAZGO, ['Curso gratis: Liderazgo y Trabajo en Equipo', '/curso-de-liderazgo-y-trabajo-en-equipo'], ASEGURAMIENTO],
    preguntas: [
      ['¿Qué es una cultura de calidad?', 'Una organización en la que todos entienden su papel en la calidad, reportan los problemas y participan en la mejora.'],
      ['¿Qué sigue después de la ruta?', 'Aplicar lo aprendido en un proyecto real y, si tu sector lo pide, formarte en las normas específicas, como las BPM.'],
    ],
  },
  'contabilidad-financiera-22588': {
    tituloSeo: 'Curso de contabilidad financiera online gratis',
    meta: 'Curso de contabilidad financiera en español de Edutin Academy, con la guía de Edvanta para dueños y administradores de droguerías.',
    porQue: 'Administrar una droguería, un consultorio o un emprendimiento de salud exige entender los números: ingresos, costos, inventario, márgenes y flujo de caja. La contabilidad financiera permite leer los estados financieros y tomar decisiones con información, en diálogo con el contador.',
    aplicaciones: [
      'Leer un estado de resultados y entender dónde se gana o se pierde dinero.',
      'Calcular el margen de los productos de mayor venta.',
      'Controlar el flujo de caja para no quedarse sin liquidez.',
    ],
    paraQuien: ['Dueños y administradores de droguerías', 'Profesionales de salud que emprenden'],
    complementa: [['Artículo: cursos de Edutin Academy para salud y farmacia', '/articulos/cursos-de-edutin-academy-para-salud-y-farmacia'], ['Artículo: cursos de Excel para profesionales de la salud', '/articulos/cursos-de-excel-para-profesionales-de-la-salud'], ['Curso gratis: Negociación y Persuasión', '/curso-de-negociacion-y-persuasion']],
    preguntas: [
      ['¿Qué es el flujo de caja?', 'El registro del dinero que entra y sale en un periodo; muestra si habrá liquidez para pagar las obligaciones.'],
      ['¿Reemplaza al contador?', 'No. Sirve para entender los números y hablar mejor con el contador.'],
    ],
  },
  'auditoria-ii-13821': {
    tituloSeo: 'Curso de auditoría II en Edutin Academy',
    meta: 'Segundo nivel del curso de auditoría de Edutin Academy, en español, con la guía de Edvanta sobre auditorías de calidad farmacéutica.',
    porQue: 'Después de conocer los fundamentos de la auditoría, el paso siguiente es practicar: planear una auditoría, preparar la lista de verificación, entrevistar, buscar evidencia y redactar hallazgos claros. Es la etapa para participar como auditor acompañante en una auditoría interna real.',
    aplicaciones: [
      'Preparar la lista de verificación de una auditoría interna.',
      'Redactar un hallazgo con el requisito, la evidencia y el incumplimiento.',
      'Acompañar a un auditor con experiencia en una auditoría real.',
    ],
    paraQuien: ['Quienes terminaron el primer nivel de auditoría', 'Personal de calidad que se forma como auditor interno'],
    complementa: [AUDITORIA, ['Guía: auditoría farmacéutica', '/articulos/cursos-gratis-auditoria-farmaceutica'], ISO],
    preguntas: [
      ['¿Qué es un hallazgo de auditoría?', 'La comparación entre un requisito y la evidencia encontrada, que muestra si se cumple o no.'],
      ['¿Cómo se gana experiencia como auditor?', 'Participando como acompañante en auditorías internas, con un auditor de experiencia.'],
    ],
  },
  'asistente-administrativo-21034': {
    tituloSeo: 'Curso de asistente administrativo online',
    meta: 'Curso en español de Edutin Academy para asistentes administrativos, con la guía de Edvanta sobre el trabajo administrativo en salud.',
    porQue: 'El trabajo administrativo sostiene la operación de una IPS, un laboratorio o una droguería: agendas, archivo, correspondencia, facturación y atención telefónica. Hacerlo con orden y buena comunicación reduce errores y mejora la experiencia de pacientes y clientes.',
    aplicaciones: [
      'Organizar el archivo físico y digital con un sistema claro.',
      'Atender llamadas y correos con un protocolo de servicio.',
      'Llevar agendas y recordatorios para el equipo.',
    ],
    paraQuien: ['Personal administrativo de organizaciones de salud', 'Personas que buscan su primer empleo administrativo'],
    complementa: [['Curso gratis: Servicio al Cliente', '/curso-de-servicio-al-cliente'], ['Artículo: cursos de Excel para profesionales de la salud', '/articulos/cursos-de-excel-para-profesionales-de-la-salud'], ['Curso gratis: Comunicación Asertiva', '/curso-de-comunicacion-asertiva']],
    preguntas: [
      ['¿Qué herramientas debe dominar un asistente administrativo?', 'Ofimática, en especial Excel, correo, agendas y el sistema de gestión de la organización.'],
      ['¿Sirve para trabajar en salud?', 'Sí, aunque cada institución tiene sus propios procesos de facturación y archivo.'],
    ],
  },
  'planeacion-estrategica-9984': {
    tituloSeo: 'Curso de planeación estratégica online gratis',
    meta: 'Curso de planeación estratégica en español de Edutin Academy, con la guía de Edvanta para planear un servicio farmacéutico o una IPS.',
    porQue: 'Planear estratégicamente es decidir a dónde quiere llegar una organización en los próximos años y cómo va a llegar. En un servicio farmacéutico, una droguería o un laboratorio, un buen plan concentra los recursos en pocos objetivos medibles en lugar de dispersarlos.',
    aplicaciones: [
      'Hacer un diagnóstico de la situación actual con datos.',
      'Definir pocos objetivos medibles para el año.',
      'Convertir cada objetivo en proyectos con responsables y fechas.',
    ],
    paraQuien: ['Directores técnicos, gerentes y coordinadores', 'Emprendedores del sector salud'],
    complementa: [LIDERAZGO, PROYECTOS, ['Guía: Power BI en la industria farmacéutica', '/articulos/cursos-gratis-power-bi-farmacia']],
    preguntas: [
      ['¿Qué es un análisis DOFA?', 'Una herramienta que resume debilidades, oportunidades, fortalezas y amenazas para orientar la estrategia.'],
      ['¿Cada cuánto se revisa un plan estratégico?', 'Conviene revisar su avance con regularidad, por ejemplo cada trimestre, y ajustarlo cada año.'],
    ],
  },
  'gestion-de-operaciones-10220': {
    tituloSeo: 'Curso de gestión de operaciones online',
    meta: 'Curso de gestión de operaciones en español de Edutin Academy, con la guía de Edvanta sobre procesos, capacidad y productividad en salud.',
    porQue: 'La gestión de operaciones se ocupa de que los procesos produzcan lo que deben, a tiempo y con el menor desperdicio: turnos, capacidad, tiempos de espera e inventarios. En una farmacia, una planta o un laboratorio clínico, mejorar las operaciones se nota en el servicio y en los costos.',
    aplicaciones: [
      'Medir el tiempo de espera en la dispensación y reducirlo.',
      'Ajustar los turnos según la demanda de cada hora.',
      'Identificar el cuello de botella de un proceso.',
    ],
    paraQuien: ['Coordinadores de servicios y plantas', 'Administradores de droguerías e IPS'],
    complementa: [['Guía: Lean Six Sigma', '/articulos/cursos-gratis-lean-six-sigma'], LOGISTICA, ['Guía: formas farmacéuticas sólidas', '/articulos/cursos-gratis-formas-solidas']],
    preguntas: [
      ['¿Qué es un cuello de botella?', 'La etapa más lenta de un proceso, que limita la capacidad de todo el sistema.'],
      ['¿Qué relación tiene con Lean?', 'Lean es una de las metodologías más usadas para mejorar las operaciones eliminando desperdicios.'],
    ],
  },
  'planeacion-estrategica-ii-9216': {
    tituloSeo: 'Curso de planeación estratégica II en Edutin',
    meta: 'Segundo nivel de planeación estratégica de Edutin Academy, en español, con la guía de Edvanta para pasar del plan a la ejecución.',
    porQue: 'Muchos planes estratégicos fallan en la ejecución, no en el diseño. El segundo nivel es una oportunidad para practicar cómo se baja la estrategia a proyectos, presupuestos e indicadores, y cómo se hace seguimiento sin convertirlo en un trámite.',
    aplicaciones: [
      'Construir un tablero de seguimiento de los objetivos estratégicos.',
      'Asignar presupuesto y responsables a cada iniciativa.',
      'Ajustar el plan cuando cambian las condiciones.',
    ],
    paraQuien: ['Quienes ya estudiaron planeación estratégica', 'Gerentes y coordinadores de áreas'],
    complementa: [PROYECTOS, LIDERAZGO, ['Guía: Power BI en la industria farmacéutica', '/articulos/cursos-gratis-power-bi-farmacia']],
    preguntas: [
      ['¿Necesito el primer nivel?', 'Conviene: este nivel parte de los conceptos del primero.'],
      ['¿Qué es un cuadro de mando?', 'Un conjunto de indicadores que permite seguir el avance de la estrategia.'],
    ],
  },
  'comunicacion-interna-en-organizaciones-16665': {
    tituloSeo: 'Curso de comunicación interna en organizaciones',
    meta: 'Curso en español de Edutin Academy sobre comunicación interna, con la guía de Edvanta para equipos de salud y farmacia.',
    porQue: 'En salud, una mala comunicación interna puede costar caro: un cambio de procedimiento que no llegó a todos, un turno que no supo de una alerta o un equipo que se entera tarde de una decisión. La comunicación interna organiza qué se dice, a quién, por qué canal y cómo se confirma que llegó.',
    aplicaciones: [
      'Comunicar un cambio de procedimiento y confirmar que todos lo conocen.',
      'Escoger el canal adecuado para cada tipo de mensaje.',
      'Organizar reuniones cortas y útiles con el equipo.',
    ],
    paraQuien: ['Líderes de equipo y coordinadores', 'Responsables de comunicación y talento humano'],
    complementa: [LIDERAZGO, ['Curso gratis: Comunicación Asertiva', '/curso-de-comunicacion-asertiva'], ['Curso gratis: Liderazgo y Trabajo en Equipo', '/curso-de-liderazgo-y-trabajo-en-equipo']],
    preguntas: [
      ['¿Por qué importa en salud?', 'Porque muchos errores ocurren por información que no llegó a tiempo a quien la necesitaba.'],
      ['¿Qué canal usar para un cambio importante?', 'Uno que permita confirmar la lectura, además de explicarlo en persona cuando el cambio es crítico.'],
    ],
  },
  'auditoria-iii-9983': {
    tituloSeo: 'Curso de auditoría III en Edutin Academy',
    meta: 'Tercer nivel del curso de auditoría de Edutin Academy, en español, con la guía de Edvanta para liderar auditorías de calidad.',
    porQue: 'En el nivel avanzado de una ruta de auditoría, el reto es liderar: planear el programa de auditorías del año, conducir un equipo auditor, manejar conversaciones difíciles y evaluar si las acciones correctivas fueron eficaces. Es la etapa para asumir el rol de auditor líder en auditorías internas.',
    aplicaciones: [
      'Planear el programa anual de auditorías internas según el riesgo.',
      'Conducir la reunión de cierre y comunicar hallazgos con respeto.',
      'Verificar la eficacia de las acciones correctivas de auditorías previas.',
    ],
    paraQuien: ['Auditores internos con experiencia', 'Jefes de calidad que coordinan el programa de auditorías'],
    complementa: [AUDITORIA, ['Guía: auditoría farmacéutica', '/articulos/cursos-gratis-auditoria-farmaceutica'], ['Curso gratis: Negociación y Persuasión', '/curso-de-negociacion-y-persuasion']],
    preguntas: [
      ['¿Qué hace un auditor líder?', 'Planea y conduce la auditoría, coordina al equipo auditor y presenta los resultados.'],
      ['¿Qué norma orienta las auditorías de sistemas de gestión?', 'La ISO 19011 ofrece directrices para auditar sistemas de gestión.'],
    ],
  },
  'gestion-del-talento-humano-22969': {
    tituloSeo: 'Curso de gestión del talento humano gratis',
    meta: 'Curso de gestión del talento humano en español de Edutin Academy, con la guía de Edvanta para quienes dirigen equipos de salud.',
    porQue: 'En salud, las personas son el servicio. Seleccionar bien, entrenar con método, evaluar con justicia y retener a quienes hacen bien su trabajo impacta directamente en la seguridad del paciente y en la calidad de la atención.',
    aplicaciones: [
      'Diseñar el perfil de un cargo con sus competencias y requisitos.',
      'Organizar una inducción documentada para personal nuevo.',
      'Hacer una evaluación de desempeño con retroalimentación útil.',
    ],
    paraQuien: ['Directores técnicos, coordinadores y jefes de servicio', 'Profesionales de recursos humanos en salud'],
    complementa: [LIDERAZGO, ['Curso gratis: Inteligencia Emocional', '/curso-de-inteligencia-emocional'], ['Curso gratis: Liderazgo y Trabajo en Equipo', '/curso-de-liderazgo-y-trabajo-en-equipo']],
    preguntas: [
      ['¿Por qué documentar la inducción?', 'Porque en servicios regulados hay que demostrar que el personal fue entrenado y evaluado.'],
      ['¿Qué complementa este curso?', 'Los cursos gratuitos de liderazgo e inteligencia emocional de Edvanta.'],
    ],
  },
  'gestion-del-cambio-organizacional-22970': {
    tituloSeo: 'Curso de gestión del cambio organizacional',
    meta: 'Curso en español de Edutin Academy sobre gestión del cambio organizacional, con la guía de Edvanta para implementar cambios en salud.',
    porQue: 'Implementar un sistema nuevo, cambiar un procedimiento o reorganizar un servicio genera resistencia, y muchos cambios fracasan por cómo se conducen, no por la idea. Gestionar el cambio es explicar el porqué, involucrar a quienes hacen el trabajo, probar y acompañar.',
    aplicaciones: [
      'Planear la implementación de un sistema nuevo con una prueba piloto.',
      'Identificar a las personas clave para impulsar el cambio.',
      'Medir la adopción del cambio y ajustar el plan.',
    ],
    paraQuien: ['Líderes de proyectos de transformación', 'Coordinadores de calidad y de procesos'],
    complementa: [LIDERAZGO, PROYECTOS, ['Curso gratis: Comunicación Asertiva', '/curso-de-comunicacion-asertiva']],
    preguntas: [
      ['¿Por qué fracasan los cambios?', 'Con frecuencia por falta de comunicación, de participación de los equipos y de seguimiento.'],
      ['¿Qué relación tiene con el control de cambios?', 'El control de cambios evalúa técnicamente un cambio; la gestión del cambio acompaña a las personas para que lo adopten.'],
    ],
  },
  'crm-11166': {
    tituloSeo: 'Curso de CRM online en español',
    meta: 'Curso de CRM en español de Edutin Academy, con la guía de Edvanta para gestionar clientes en droguerías, laboratorios y servicios de salud.',
    porQue: 'Un CRM organiza la relación con los clientes: contactos, compras, solicitudes y seguimientos. En una droguería, un laboratorio o un servicio de salud ayuda a no perder oportunidades, a dar un servicio más personal y a medir qué funciona, siempre respetando la protección de datos personales.',
    aplicaciones: [
      'Registrar y dar seguimiento a las solicitudes de clientes institucionales.',
      'Segmentar clientes para campañas con consentimiento.',
      'Medir el tiempo de respuesta y la satisfacción.',
    ],
    paraQuien: ['Equipos comerciales y de servicio al cliente', 'Administradores de droguerías y distribuidoras'],
    complementa: [['Curso gratis: Servicio al Cliente', '/curso-de-servicio-al-cliente'], ['Artículo: cursos de marketing farmacéutico y digital', '/articulos/cursos-de-marketing-farmaceutico-y-digital'], ['Curso gratis: Negociación y Persuasión', '/curso-de-negociacion-y-persuasion']],
    preguntas: [
      ['¿Qué es un CRM?', 'Un sistema para gestionar la relación con los clientes: contactos, historial, oportunidades y seguimiento.'],
      ['¿Qué cuidar con los datos de los clientes?', 'Tener su autorización y protegerlos, según la Ley 1581 de 2012.'],
    ],
  },
  'tecnicas-de-reclutamiento-23107': {
    tituloSeo: 'Curso de técnicas de reclutamiento y selección',
    meta: 'Curso en español de Edutin Academy sobre reclutamiento y selección de personal, con la guía de Edvanta para contratar en salud.',
    porQue: 'Contratar a la persona equivocada en un servicio de salud cuesta tiempo, dinero y puede afectar a los pacientes. Un buen proceso de reclutamiento define bien el perfil, busca en los canales adecuados, evalúa con criterios claros y verifica los requisitos legales del cargo.',
    aplicaciones: [
      'Redactar una vacante clara con los requisitos reales del cargo.',
      'Preparar una entrevista por competencias con preguntas de comportamiento.',
      'Verificar títulos, registros profesionales y referencias.',
    ],
    paraQuien: ['Responsables de recursos humanos en salud', 'Directores técnicos y jefes de servicio que contratan'],
    complementa: [LIDERAZGO, ['Artículo: carrera de Química Farmacéutica en Colombia', '/articulos/carrera-de-quimica-farmaceutica-en-colombia'], ['Curso gratis: Comunicación Asertiva', '/curso-de-comunicacion-asertiva']],
    preguntas: [
      ['¿Qué es una entrevista por competencias?', 'Una entrevista que pide ejemplos concretos de situaciones pasadas para evaluar cómo actúa la persona.'],
      ['¿Qué verificar al contratar en salud?', 'El título, el registro o la tarjeta profesional cuando aplica, la experiencia y las referencias.'],
    ],
  },
  'udemy-lean-six-sigma-4-certificaciones': {
    tituloSeo: 'Curso de Lean Six Sigma con 4 certificaciones',
    meta: 'Curso en español de Udemy de Lean Six Sigma con varios niveles de certificación, con la guía de Edvanta para aplicarlo en farmacia.',
    porQue: 'Lean Six Sigma combina dos enfoques de mejora: eliminar desperdicios (Lean) y reducir la variación (Six Sigma). En la industria farmacéutica y en los servicios de salud se usa para bajar tiempos de liberación, reducir errores y mejorar el rendimiento de los procesos.',
    aplicaciones: [
      'Mapear el flujo de valor de un proceso y encontrar desperdicios.',
      'Medir la variación de un proceso con datos.',
      'Conducir un proyecto de mejora con la metodología DMAIC.',
    ],
    paraQuien: ['Profesionales de calidad, producción y operaciones', 'Personas que buscan un certificado de mejora continua en español'],
    complementa: [['Guía: Lean Six Sigma', '/articulos/cursos-gratis-lean-six-sigma'], ['Curso gratis: Gestión de Desviaciones y CAPA', '/curso-de-gestion-de-desviaciones-y-capa'], CALIDAD],
    preguntas: [
      ['¿Qué es DMAIC?', 'La secuencia de un proyecto Six Sigma: definir, medir, analizar, mejorar y controlar.'],
      ['¿Qué valor tiene un certificado de un curso en línea?', 'Demuestra formación; algunas empresas piden además certificaciones de organismos específicos y proyectos realizados.'],
    ],
  },
  'coursera-especializacion-six-sigma-green-belt': {
    tituloSeo: 'Especialización Six Sigma Green Belt en Coursera',
    meta: 'Especialización en inglés de Coursera para el nivel Green Belt de Six Sigma, con la guía de Edvanta sobre proyectos de mejora en farmacia.',
    porQue: 'El nivel Green Belt de Six Sigma forma a quien lidera proyectos de mejora en su propia área con herramientas estadísticas. En una planta farmacéutica o un laboratorio, un Green Belt puede reducir rechazos, tiempos de ciclo o resultados fuera de especificación con datos.',
    aplicaciones: [
      'Calcular la capacidad de un proceso con datos de control en proceso.',
      'Usar gráficos de control para separar variación normal de problemas.',
      'Liderar un proyecto de mejora de tres a seis meses.',
    ],
    paraQuien: ['Profesionales de producción, calidad e ingeniería', 'Analistas con bases de estadística'],
    complementa: [['Guía: Lean Six Sigma', '/articulos/cursos-gratis-lean-six-sigma'], ['Guía: validación de procesos', '/articulos/cursos-gratis-validacion-de-procesos'], ['Guía: Python para farmacia', '/articulos/cursos-gratis-python-para-farmacia']],
    preguntas: [
      ['¿Qué diferencia hay entre Green Belt y Black Belt?', 'El Green Belt lidera proyectos en su área; el Black Belt lidera proyectos más complejos y suele dedicarse a la mejora de tiempo completo.'],
      ['¿Se necesita estadística?', 'Sí, a nivel básico e intermedio: variación, capacidad y gráficos de control.'],
    ],
  },
  'coursera-especializacion-regulatory-compliance': {
    tituloSeo: 'Especialización en cumplimiento normativo (Coursera)',
    meta: 'Especialización en inglés de Coursera sobre cumplimiento normativo, con la guía de Edvanta sobre el cumplimiento en empresas de salud.',
    porQue: 'El cumplimiento normativo asegura que una organización conoce y cumple las leyes y regulaciones que le aplican, y que puede demostrarlo. En el sector farmacéutico eso incluye normas sanitarias, protección de datos, anticorrupción y relaciones con profesionales de la salud.',
    aplicaciones: [
      'Construir una matriz de requisitos legales de tu organización.',
      'Diseñar controles y evidencias para demostrar cumplimiento.',
      'Capacitar a los equipos en las políticas de cumplimiento.',
    ],
    paraQuien: ['Profesionales de cumplimiento, legal y calidad', 'Profesionales de asuntos regulatorios'],
    complementa: [['Curso gratis: Asuntos Regulatorios Farmacéuticos en Colombia', '/curso-de-asuntos-regulatorios-farmaceuticos-en-colombia'], ['Guía: etiquetado y publicidad de medicamentos', '/articulos/cursos-gratis-etiquetado-y-publicidad'], ['Guía: integridad de datos', '/articulos/cursos-gratis-integridad-de-datos']],
    preguntas: [
      ['¿Qué es una matriz de requisitos legales?', 'Una lista de las normas que aplican a la organización, con lo que exige cada una y cómo se cumple.'],
      ['¿Cumplimiento y asuntos regulatorios son lo mismo?', 'Se cruzan: regulatorio se centra en los productos ante la autoridad sanitaria; cumplimiento abarca todas las normas que aplican a la empresa.'],
    ],
  },
  'udemy-iso-9001-2015-interpretacion-implementacion-y-auditoria': {
    tituloSeo: 'Curso de ISO 9001:2015: interpretación y auditoría',
    meta: 'Curso en español de Udemy sobre la interpretación, implementación y auditoría de la ISO 9001:2015, con la guía de Edvanta.',
    porQue: 'La ISO 9001 es la norma de sistemas de gestión de calidad más usada del mundo, y muchas distribuidoras, operadores logísticos e IPS se certifican en ella. Interpretar bien sus requisitos y saber auditarlos permite participar en la certificación y en el mantenimiento del sistema.',
    aplicaciones: [
      'Interpretar un requisito de la norma con ejemplos de tu organización.',
      'Planear y ejecutar una auditoría interna de ISO 9001.',
      'Preparar la organización para la auditoría de certificación.',
    ],
    paraQuien: ['Auditores internos en formación', 'Coordinadores de calidad de organizaciones certificadas'],
    complementa: [ISO, AUDITORIA, CALIDAD],
    preguntas: [
      ['¿La ISO 9001 reemplaza las BPM?', 'No. En la fabricación de medicamentos, las BPM son obligatorias; la ISO 9001 es voluntaria y complementaria.'],
      ['¿Qué diferencia tiene con el otro curso de ISO 9001?', 'Este incluye la auditoría; el otro se centra en implementar el sistema.'],
    ],
  },
  'udemy-iso-9001-2015-implementacion-de-un-sistema-de-gestion-de-calidad': {
    tituloSeo: 'Curso para implementar un sistema ISO 9001:2015',
    meta: 'Curso en español de Udemy para implementar un sistema de gestión de calidad con la ISO 9001:2015, con la guía de Edvanta.',
    porQue: 'Implementar un sistema de gestión de calidad desde cero es un proyecto: diagnóstico, procesos, documentación, indicadores, auditoría interna y revisión por la dirección. Tener una ruta clara evita construir un sistema de papel que nadie usa.',
    aplicaciones: [
      'Hacer el diagnóstico inicial frente a los requisitos de la norma.',
      'Definir el mapa de procesos y sus responsables.',
      'Construir solo la documentación que el sistema realmente necesita.',
    ],
    paraQuien: ['Responsables de implementar un sistema de calidad', 'Emprendedores y pymes del sector salud'],
    complementa: [ISO, ['Curso gratis: Buenas Prácticas de Documentación Farmacéutica', '/curso-de-buenas-practicas-de-documentacion-farmaceutica'], PROYECTOS],
    preguntas: [
      ['¿Cuánto tarda implementar la ISO 9001?', 'Depende del tamaño y la madurez de la organización; suele tomar varios meses.'],
      ['¿Qué diferencia tiene con el otro curso de ISO 9001?', 'Este se centra en la implementación; el otro suma la interpretación detallada y la auditoría.'],
    ],
  },
  'coursera-certificado-profesional-de-gestion-de-proyectos-de-google': {
    tituloSeo: 'Certificado de gestión de proyectos de Google',
    meta: 'Certificado profesional de Google en Coursera, en español, para empezar en gestión de proyectos, con la guía de Edvanta para el sector salud.',
    porQue: 'Casi todo lo importante en el sector farmacéutico es un proyecto: un registro sanitario, una validación, una implementación de calidad o la apertura de un servicio. Un certificado introductorio y en español da el vocabulario y las herramientas para planear y conducir esos proyectos.',
    aplicaciones: [
      'Construir el acta, el cronograma y la matriz de riesgos de un proyecto.',
      'Coordinar a un equipo con reuniones de seguimiento útiles.',
      'Cerrar un proyecto con sus lecciones aprendidas.',
    ],
    paraQuien: ['Profesionales que empiezan en proyectos', 'Químicos farmacéuticos que coordinan implementaciones'],
    complementa: [PROYECTOS, ['Artículo: qué es la gestión de proyectos', '/articulos/que-es-la-gestion-de-proyectos'], ['Curso gratis: Gestión de Riesgos en la Calidad Farmacéutica', '/curso-de-gestion-de-riesgos-en-la-calidad-farmaceutica']],
    preguntas: [
      ['¿Necesito experiencia previa?', 'No. El certificado está pensado para quien empieza.'],
      ['¿Me da la certificación PMP?', 'No. La PMP la otorga el PMI y exige experiencia demostrable y un examen.'],
    ],
  },
  'coursera-certificado-profesional-de-microsoft-project-management': {
    tituloSeo: 'Certificado de gestión de proyectos de Microsoft',
    meta: 'Certificado profesional de Microsoft en Coursera, en inglés, sobre gestión de proyectos, con la guía de Edvanta para proyectos farmacéuticos.',
    porQue: 'La gestión de proyectos combina método y herramientas: planear el alcance, el cronograma y los recursos, y hacer seguimiento con software. Para quien ya trabaja con el ecosistema de Microsoft, aprender ambas cosas juntas acelera su aplicación en el trabajo.',
    aplicaciones: [
      'Construir un cronograma con dependencias y recursos.',
      'Hacer seguimiento al avance y a las desviaciones del plan.',
      'Preparar informes de estado para la dirección.',
    ],
    paraQuien: ['Profesionales que coordinan proyectos con herramientas de Microsoft', 'Analistas de proyectos en empresas del sector salud'],
    complementa: [PROYECTOS, ['Artículo: cómo iniciar en gestión de proyectos', '/articulos/como-iniciar-en-gestion-de-proyectos'], ['Guía: transferencia de tecnología', '/articulos/cursos-gratis-transferencia-de-tecnologia']],
    preguntas: [
      ['¿Está en español?', 'Según el catálogo, está en inglés. El certificado de Google sobre el mismo tema está en español.'],
      ['¿Qué tipo de proyectos hay en farmacia?', 'Registros sanitarios, validaciones, implementaciones de calidad, transferencias de tecnología y ensayos clínicos, entre otros.'],
    ],
  },
  'coursera-especializacion-clinical-project-management': {
    tituloSeo: 'Especialización en gestión de proyectos clínicos',
    meta: 'Especialización en inglés de Coursera sobre gestión de proyectos de investigación clínica, con la guía de Edvanta sobre ensayos clínicos.',
    porQue: 'Un ensayo clínico es uno de los proyectos más complejos del sector: muchos centros, comités de ética, reclutamiento, monitoría, seguridad y datos, con plazos y presupuestos exigentes. La gestión de proyectos clínicos coordina todo eso para que el estudio termine a tiempo y con calidad.',
    aplicaciones: [
      'Planear el cronograma de un estudio con sus hitos regulatorios.',
      'Hacer seguimiento al reclutamiento por centro.',
      'Gestionar los riesgos de un estudio desde su diseño.',
    ],
    paraQuien: ['Coordinadores y monitores clínicos con experiencia', 'Profesionales que quieren ser gerentes de proyectos clínicos'],
    complementa: [['Artículo: cursos de ensayos clínicos', '/articulos/cursos-de-ensayos-clinicos-y-buenas-practicas-clinicas'], PROYECTOS, ['Guía: farmacovigilancia en ensayos clínicos', '/articulos/cursos-gratis-farmacovigilancia-en-ensayos-clinicos']],
    preguntas: [
      ['¿Qué hace un gerente de proyectos clínicos?', 'Coordina el plan, el presupuesto, los centros y los riesgos de un estudio clínico.'],
      ['¿Necesito experiencia en investigación clínica?', 'Ayuda mucho; la especialización da más valor a quien ya conoce cómo funciona un estudio.'],
    ],
  },
  'coursera-especializacion-supply-chain-management': {
    tituloSeo: 'Especialización en cadena de suministro (Coursera)',
    meta: 'Especialización en inglés de Coursera sobre gestión de la cadena de suministro, con la guía de Edvanta sobre logística farmacéutica en Colombia.',
    porQue: 'La cadena de suministro conecta proveedores, fabricación, almacenamiento y distribución para que el producto llegue a tiempo. En medicamentos se suman exigencias sanitarias: cadena de frío, trazabilidad, vencimientos y proveedores calificados, que hacen de la logística farmacéutica una especialidad.',
    aplicaciones: [
      'Planear la demanda y el inventario de una línea de productos.',
      'Evaluar y calificar proveedores con criterios de calidad.',
      'Diseñar la distribución respetando la cadena de frío.',
    ],
    paraQuien: ['Profesionales de logística, compras y planeación', 'Químicos farmacéuticos que quieren pasar a supply chain'],
    complementa: [LOGISTICA, ['Artículo: cadena de frío de medicamentos', '/articulos/cadena-de-frio-medicamentos'], ['Guía: empaque y serialización', '/articulos/cursos-gratis-empaque-y-serializacion']],
    preguntas: [
      ['¿Qué norma aplica al almacenamiento de medicamentos en Colombia?', 'En el servicio farmacéutico, la Resolución 1403 de 2007, que pide controlar temperatura y humedad y rotar por vencimiento.'],
      ['¿Qué diferencia hay entre logística y cadena de suministro?', 'La logística mueve y almacena; la cadena de suministro incluye además proveedores, compras, producción y planeación.'],
    ],
  },
  'responsabilidad-social-18430': {
    tituloSeo: 'Curso de responsabilidad social empresarial',
    meta: 'Curso en español de Edutin Academy sobre responsabilidad social empresarial, con la guía de Edvanta para organizaciones de salud.',
    porQue: 'La responsabilidad social es la forma en que una organización responde por sus impactos en las personas, la comunidad y el ambiente. En el sector salud se traduce en acceso, educación en salud, buen manejo de residuos y relaciones éticas con pacientes, profesionales y proveedores.',
    aplicaciones: [
      'Diseñar una campaña de educación en salud para la comunidad.',
      'Mejorar la gestión de residuos de medicamentos y empaques.',
      'Reportar las acciones sociales con indicadores verificables.',
    ],
    paraQuien: ['Responsables de sostenibilidad y comunicación', 'Gerentes de organizaciones de salud'],
    complementa: [['Curso: Gestión ambiental (Edutin)', '/curso-de-gestion-ambiental'], SST, ['Curso gratis: Liderazgo y Trabajo en Equipo', '/curso-de-liderazgo-y-trabajo-en-equipo']],
    preguntas: [
      ['¿Qué es la responsabilidad social empresarial?', 'El compromiso de una organización con sus impactos sociales, ambientales y económicos, más allá de lo que exige la ley.'],
      ['¿Cómo se aplica en una farmacia?', 'Con educación en salud, manejo responsable de residuos y un trato ético con pacientes y comunidad.'],
    ],
  },
  'logistica-de-transporte-10005': {
    tituloSeo: 'Curso de logística de transporte online',
    meta: 'Curso de logística de transporte en español de Edutin Academy, con la guía de Edvanta sobre la distribución de medicamentos.',
    porQue: 'El transporte es el eslabón donde un medicamento bien fabricado y bien almacenado puede dañarse: calor, golpes, demoras o rutas mal planeadas. Planear la distribución, con condiciones controladas y trazabilidad, protege el producto y cumple los tiempos de entrega.',
    aplicaciones: [
      'Planear rutas de distribución que reduzcan tiempos y costos.',
      'Definir condiciones de transporte para productos refrigerados.',
      'Registrar las entregas para tener trazabilidad ante un retiro.',
    ],
    paraQuien: ['Coordinadores de distribución y despachos', 'Personal de operadores logísticos de salud'],
    complementa: [LOGISTICA, ['Artículo: cadena de frío de medicamentos', '/articulos/cadena-de-frio-medicamentos'], ['Curso gratis: Buenas Prácticas de Manufactura (BPM)', '/curso-de-buenas-practicas-de-manufactura-bpm']],
    preguntas: [
      ['¿Qué riesgos tiene el transporte de medicamentos?', 'Temperaturas fuera de rango, golpes, humedad, pérdidas y falta de trazabilidad.'],
      ['¿Por qué importa la trazabilidad?', 'Porque ante una alerta o un retiro hay que saber de inmediato a dónde fue cada lote.'],
    ],
  },
  'manejo-de-materiales-peligrosos-11814': {
    tituloSeo: 'Curso de manejo de materiales peligrosos',
    meta: 'Curso en español de Edutin Academy sobre manejo de materiales peligrosos, con la guía de Edvanta para laboratorios y plantas.',
    porQue: 'En laboratorios, plantas farmacéuticas y servicios de salud se manejan sustancias inflamables, corrosivas, tóxicas o reactivas. Identificarlas, almacenarlas por compatibilidad y saber qué hacer ante un derrame protege a las personas, las instalaciones y el ambiente.',
    aplicaciones: [
      'Leer una ficha de datos de seguridad antes de usar una sustancia.',
      'Almacenar reactivos según su compatibilidad química.',
      'Actuar ante un derrame con el kit y el procedimiento adecuados.',
    ],
    paraQuien: ['Personal de laboratorios y plantas', 'Responsables de seguridad y salud en el trabajo'],
    complementa: [SST, ['Guía: microbiología farmacéutica', '/articulos/cursos-gratis-microbiologia-farmaceutica'], ['Curso gratis: Buenas Prácticas de Laboratorio (BPL)', '/curso-de-buenas-practicas-de-laboratorio-bpl']],
    preguntas: [
      ['¿Qué es una ficha de datos de seguridad?', 'Un documento con los peligros de una sustancia, cómo manejarla, almacenarla y qué hacer en una emergencia.'],
      ['¿Qué es el Sistema Globalmente Armonizado?', 'El sistema internacional para clasificar y etiquetar los productos químicos según sus peligros.'],
    ],
  },
  'manipulacion-de-alimentos-22143': {
    tituloSeo: 'Curso de manipulación de alimentos online',
    meta: 'Curso de manipulación de alimentos en español de Edutin Academy, con la guía de Edvanta sobre higiene y prevención de intoxicaciones.',
    porQue: 'Las enfermedades transmitidas por alimentos se previenen con prácticas sencillas pero constantes: higiene personal, temperaturas seguras, separación de alimentos crudos y cocidos, y limpieza. Quien prepara o vende alimentos necesita dominarlas, y en muchos casos demostrar su formación.',
    aplicaciones: [
      'Aplicar el lavado de manos y la higiene personal en la preparación.',
      'Controlar las temperaturas de conservación y de cocción.',
      'Evitar la contaminación cruzada en la cocina o el punto de venta.',
    ],
    paraQuien: ['Personas que preparan o venden alimentos', 'Emprendedores de alimentos'],
    complementa: [['Artículo: cursos de nutrición online con certificado', '/articulos/cursos-de-nutricion-online-con-certificado'], ['Guía: microbiología farmacéutica', '/articulos/cursos-gratis-microbiologia-farmaceutica'], SST],
    preguntas: [
      ['¿Qué es la contaminación cruzada?', 'El paso de microorganismos de un alimento o superficie contaminada a otro alimento.'],
      ['¿El curso sirve como certificado para trabajar con alimentos?', 'Verifica con la autoridad sanitaria local qué formación exige para tu actividad.'],
    ],
  },
  'derecho-ambiental-18433': {
    tituloSeo: 'Curso de derecho ambiental online',
    meta: 'Curso de derecho ambiental en español de Edutin Academy, con la guía de Edvanta sobre residuos y obligaciones ambientales en salud.',
    porQue: 'Las organizaciones de salud y la industria farmacéutica generan residuos peligrosos, vertimientos y emisiones que están regulados. Conocer el marco jurídico ambiental ayuda a entender las obligaciones, evitar sanciones y diseñar una gestión ambiental responsable.',
    aplicaciones: [
      'Identificar las obligaciones ambientales que aplican a tu organización.',
      'Revisar la gestión de residuos peligrosos y sus soportes.',
      'Preparar la información para una visita de la autoridad ambiental.',
    ],
    paraQuien: ['Responsables de gestión ambiental', 'Profesionales de cumplimiento y calidad'],
    complementa: [['Curso: Gestión ambiental (Edutin)', '/curso-de-gestion-ambiental'], SST, ['Curso gratis: Asuntos Regulatorios Farmacéuticos en Colombia', '/curso-de-asuntos-regulatorios-farmaceuticos-en-colombia']],
    preguntas: [
      ['¿Qué residuos de salud son peligrosos?', 'Entre otros, los biológicos, los cortopunzantes y los químicos, incluidos los medicamentos vencidos.'],
      ['¿El curso reemplaza la asesoría jurídica?', 'No. Da una base para entender las obligaciones y dialogar con los asesores.'],
    ],
  },
  'manejo-de-materiales-peligrosos-ii-13570': {
    tituloSeo: 'Curso de manejo de materiales peligrosos II',
    meta: 'Segundo nivel del curso de materiales peligrosos de Edutin Academy, en español, con la guía de Edvanta sobre emergencias químicas.',
    porQue: 'Después de los fundamentos, el manejo de materiales peligrosos exige preparar la respuesta a emergencias: planes, simulacros, equipos de protección y coordinación con los organismos de socorro. Es el paso para quien coordina la seguridad química de un laboratorio o una planta.',
    aplicaciones: [
      'Diseñar el plan de respuesta ante un derrame o una fuga.',
      'Organizar un simulacro de emergencia química.',
      'Definir los elementos de protección personal según el riesgo.',
    ],
    paraQuien: ['Quienes terminaron el primer nivel', 'Coordinadores de seguridad en laboratorios y plantas'],
    complementa: [SST, ['Curso: Manejo de sustancias químicas peligrosas (Edutin)', '/curso-de-manejo-de-sustancias-quimicas-peligrosas'], ['Curso gratis: Gestión de Riesgos en la Calidad Farmacéutica', '/curso-de-gestion-de-riesgos-en-la-calidad-farmaceutica']],
    preguntas: [
      ['¿Necesito el primer nivel?', 'Conviene: este nivel parte de los conceptos del primero.'],
      ['¿Qué es la jerarquía de controles?', 'El orden de los controles de un riesgo: eliminar, sustituir, controles de ingeniería, administrativos y, al final, protección personal.'],
    ],
  },
  'logistica-11723': {
    tituloSeo: 'Curso de logística online gratis en español',
    meta: 'Curso de logística en español de Edutin Academy, sin costo y con certificado de pago, con la guía de Edvanta sobre logística farmacéutica.',
    porQue: 'La logística asegura que los productos estén donde se necesitan, en la cantidad y el momento correctos. En el sector farmacéutico se suman requisitos sanitarios de recepción, almacenamiento, rotación por vencimiento y distribución, que la convierten en un área técnica con mucha demanda.',
    aplicaciones: [
      'Organizar la recepción técnica de un pedido de medicamentos.',
      'Aplicar la rotación por fecha de vencimiento en la bodega.',
      'Medir indicadores como rotación, vencidos y nivel de servicio.',
    ],
    paraQuien: ['Auxiliares de bodega y de farmacia', 'Coordinadores de inventarios'],
    complementa: [LOGISTICA, ['Artículo: cadena de frío de medicamentos', '/articulos/cadena-de-frio-medicamentos'], ['Artículo: cursos de Excel para profesionales de la salud', '/articulos/cursos-de-excel-para-profesionales-de-la-salud']],
    preguntas: [
      ['¿Qué es la recepción técnica?', 'La verificación de que lo recibido coincide con lo pedido y cumple los requisitos: lote, vencimiento, registro sanitario y condiciones.'],
      ['¿Qué sigue después de este curso?', 'Logística de transporte o un curso de inventarios, según tu área.'],
    ],
  },
};

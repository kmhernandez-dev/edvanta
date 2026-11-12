/**
 * Guías editoriales de cursos curados · Lote 5b (12-nov-2026)
 * Datos, analítica y tecnología: certificados de Google, IBM y Microsoft,
 * IA aplicada de Edutin, bases de datos y desarrollo web. Se habla del
 * tema y de su uso profesional, no del temario del proveedor.
 */
const POWER_BI = ['Guía: Power BI en la industria farmacéutica', '/articulos/cursos-gratis-power-bi-farmacia'];
const EXCEL = ['Artículo: cursos de Excel para profesionales de la salud', '/articulos/cursos-de-excel-para-profesionales-de-la-salud'];
const PYTHON = ['Guía: Python para farmacia', '/articulos/cursos-gratis-python-para-farmacia'];
const IA = ['Guía: IA en la industria farmacéutica', '/articulos/cursos-gratis-ia-industria-farmaceutica'];
const DATOS = ['Guía: cursos de datos e inteligencia artificial', '/articulos/cursos-de-datos-e-inteligencia-artificial'];

export const GUIAS_LOTE_5B = {
  'coursera-certificado-profesional-de-microsoft-power-bi-data-analyst': {
    tituloSeo: 'Certificado de Power BI de Microsoft en Coursera',
    meta: 'Certificado profesional en inglés de Microsoft en Coursera para analistas de datos con Power BI, con la guía de Edvanta para la industria.',
    porQue: 'Power BI es la herramienta de tableros más pedida en las vacantes de análisis de datos, también en farmacéuticas, distribuidoras e IPS. Un certificado de Microsoft ordena el aprendizaje, de la limpieza de datos al modelo y los cálculos, y da un respaldo visible en la hoja de vida.',
    aplicaciones: [
      'Construir un tablero de desviaciones y CAPA que se actualice solo.',
      'Modelar datos de ventas, inventarios o dispensación con relaciones correctas.',
      'Escribir medidas en DAX para indicadores de calidad.',
    ],
    paraQuien: ['Profesionales que quieren pasar a análisis de datos', 'Analistas de calidad, producción o farmacovigilancia'],
    complementa: [POWER_BI, ['Artículo: Power BI, para qué sirve en salud y farmacia', '/articulos/power-bi-para-que-sirve-en-salud-y-farmacia'], EXCEL],
    preguntas: [
      ['¿Qué es DAX?', 'El lenguaje de fórmulas de Power BI para crear medidas y cálculos sobre el modelo de datos.'],
      ['¿Hay opciones en español?', 'Sí, los cursos de Power BI de Edutin Academy están en español y se toman sin costo.'],
    ],
  },
  'coursera-certificado-profesional-de-google-business-intelligence': {
    tituloSeo: 'Certificado de inteligencia de negocios de Google',
    meta: 'Certificado profesional de Google en Coursera sobre inteligencia de negocios: modelos de datos, tableros e indicadores, con la guía de Edvanta.',
    porQue: 'La inteligencia de negocios convierte los datos de una organización en información para decidir: qué se vende, qué se vence, dónde se pierden recursos. Es un perfil con demanda en cadenas de farmacias, laboratorios y aseguradoras, que combina datos, negocio y comunicación.',
    aplicaciones: [
      'Definir los indicadores clave de un servicio o una línea de productos.',
      'Diseñar un modelo de datos para alimentar tableros.',
      'Presentar hallazgos a la gerencia con una historia clara.',
    ],
    paraQuien: ['Analistas de datos con experiencia básica', 'Profesionales de salud que quieren pasar a inteligencia de negocios'],
    complementa: [POWER_BI, ['Curso gratis: Presentaciones Efectivas y Storytelling', '/curso-de-presentaciones-efectivas-y-storytelling'], DATOS],
    preguntas: [
      ['¿Qué diferencia hay entre análisis de datos e inteligencia de negocios?', 'El análisis responde preguntas puntuales; la inteligencia de negocios organiza datos e indicadores para decidir de forma continua.'],
      ['¿Conviene hacer antes el certificado de análisis de datos?', 'Ayuda tener bases de análisis de datos antes de este certificado.'],
    ],
  },
  'coursera-certificado-profesional-de-analisis-avanzado-de-datos-de-google': {
    tituloSeo: 'Certificado de análisis avanzado de datos de Google',
    meta: 'Certificado profesional de Google en Coursera, en español, sobre análisis avanzado de datos con Python, estadística y modelos predictivos.',
    porQue: 'El análisis avanzado de datos usa estadística, programación y modelos predictivos para anticipar lo que va a pasar, no solo describir lo que pasó. En salud y en la industria farmacéutica sirve para predecir demanda, detectar tendencias de calidad o estudiar datos del mundo real.',
    aplicaciones: [
      'Predecir la demanda de un medicamento a partir de su consumo histórico.',
      'Probar una hipótesis con una prueba estadística adecuada.',
      'Construir un modelo sencillo y evaluar su desempeño.',
    ],
    paraQuien: ['Analistas que ya dominan lo básico', 'Profesionales de farmacoepidemiología y evidencia del mundo real'],
    complementa: [PYTHON, ['Guía: evidencia del mundo real', '/articulos/cursos-gratis-evidencia-del-mundo-real'], DATOS],
    preguntas: [
      ['¿Qué lenguaje se usa en análisis avanzado?', 'Python es el más usado para análisis avanzado y modelos predictivos.'],
      ['¿Está en español?', 'Sí, según el catálogo este certificado está en español.'],
    ],
  },
  'coursera-certificado-profesional-de-google-data-analytics': {
    tituloSeo: 'Certificado de análisis de datos de Google en español',
    meta: 'Certificado profesional de Google en Coursera, en español, para empezar en análisis de datos, con la guía de Edvanta para salud y farmacia.',
    porQue: 'El análisis de datos es una de las habilidades más transferibles del mercado laboral: sirve en calidad, en logística, en farmacovigilancia y en gestión. Un certificado introductorio y en español es una forma ordenada de empezar, desde la pregunta de negocio hasta la visualización.',
    aplicaciones: [
      'Formular una pregunta de negocio y buscar los datos que la responden.',
      'Limpiar una hoja de cálculo con errores y duplicados.',
      'Comunicar un hallazgo con un gráfico sencillo.',
    ],
    paraQuien: ['Profesionales que empiezan en datos', 'Químicos farmacéuticos que quieren cambiar de área'],
    complementa: [EXCEL, POWER_BI, DATOS],
    preguntas: [
      ['¿Necesito experiencia previa?', 'No. Es un certificado de nivel inicial.'],
      ['¿Qué sigue después?', 'Power BI para tableros o el certificado de análisis avanzado para modelos predictivos.'],
    ],
  },
  'coursera-certificado-profesional-de-ibm-data-analyst': {
    tituloSeo: 'Certificado de analista de datos de IBM en Coursera',
    meta: 'Certificado profesional de IBM en Coursera, en inglés, para analistas de datos con Excel, SQL y Python, con la guía de Edvanta.',
    porQue: 'El trabajo de un analista de datos combina tres herramientas: hojas de cálculo para lo rápido, SQL para consultar bases de datos y Python para analizar a escala. Dominarlas juntas permite responder preguntas con datos reales de una empresa, no solo con archivos sueltos.',
    aplicaciones: [
      'Consultar una base de datos de dispensaciones con SQL.',
      'Analizar los resultados con Python y graficarlos.',
      'Presentar el análisis en un informe reproducible.',
    ],
    paraQuien: ['Profesionales que buscan un primer empleo en datos', 'Analistas que quieren sumar SQL y Python'],
    complementa: [PYTHON, EXCEL, DATOS],
    preguntas: [
      ['¿Qué es SQL?', 'El lenguaje estándar para consultar y organizar información en bases de datos.'],
      ['¿En qué idioma está?', 'Según el catálogo, en inglés.'],
    ],
  },
  'coursera-certificado-profesional-de-microsoft-business-analyst': {
    tituloSeo: 'Certificado de analista de negocios de Microsoft',
    meta: 'Certificado profesional de Microsoft en Coursera, en inglés, para analistas de negocios, con la guía de Edvanta sobre procesos en salud.',
    porQue: 'El analista de negocios traduce las necesidades de las áreas en requisitos claros para proyectos y sistemas. En una empresa farmacéutica o una IPS, es quien entiende el proceso, documenta qué se necesita y verifica que la solución lo resuelva.',
    aplicaciones: [
      'Levantar los requisitos de un sistema para el servicio farmacéutico.',
      'Mapear un proceso actual e identificar dónde se pierde tiempo.',
      'Verificar con los usuarios que la solución cumple lo pedido.',
    ],
    paraQuien: ['Profesionales que coordinan proyectos de mejora o de sistemas', 'Analistas que trabajan entre las áreas y tecnología'],
    complementa: [['Guía: cursos de gestión de proyectos con certificado', '/articulos/cursos-de-gestion-de-proyectos-con-certificado'], POWER_BI, ['Guía: Lean Six Sigma', '/articulos/cursos-gratis-lean-six-sigma']],
    preguntas: [
      ['¿Qué hace un analista de negocios?', 'Entiende los procesos y las necesidades de una organización y las convierte en requisitos para proyectos y sistemas.'],
      ['¿Es lo mismo que un analista de datos?', 'No. Se cruzan, pero el analista de negocios se centra en procesos y requisitos.'],
    ],
  },
  'udemy-statistics-biostatistics-and-data-analysis-from-scratch': {
    tituloSeo: 'Curso de bioestadística desde cero en inglés',
    meta: 'Curso en inglés de Udemy de estadística y bioestadística desde cero, con la guía de Edvanta sobre su uso en estudios clínicos y de calidad.',
    porQue: 'La bioestadística es el lenguaje con el que se leen los ensayos clínicos, los estudios de estabilidad y los análisis de calidad. Entender intervalos de confianza, pruebas de hipótesis y riesgo relativo permite leer la evidencia con criterio y no solo repetir conclusiones.',
    aplicaciones: [
      'Interpretar un intervalo de confianza en el resultado de un ensayo.',
      'Escoger la prueba estadística adecuada para comparar dos grupos.',
      'Calcular la capacidad de un proceso con datos de control en proceso.',
    ],
    paraQuien: ['Profesionales de investigación clínica y farmacovigilancia', 'Analistas de calidad y estabilidad'],
    complementa: [PYTHON, ['Guía: cursos de ensayos clínicos', '/articulos/cursos-de-ensayos-clinicos-y-buenas-practicas-clinicas'], ['Curso gratis: Estudios de Estabilidad de Medicamentos', '/curso-de-estudios-de-estabilidad-de-medicamentos']],
    preguntas: [
      ['¿Qué es un intervalo de confianza?', 'Un rango de valores dentro del cual probablemente está el valor real, según los datos y el nivel de confianza escogido.'],
      ['¿Es solo para investigadores?', 'No. También sirve en calidad, por ejemplo para analizar tendencias y estabilidad.'],
    ],
  },
  'ia-para-impuestos-y-cumplimiento-fiscal-22972': {
    tituloSeo: 'Curso de IA para impuestos y cumplimiento fiscal',
    meta: 'Curso en español de Edutin Academy sobre inteligencia artificial aplicada a impuestos y cumplimiento fiscal, con la guía de Edvanta.',
    porQue: 'La gestión tributaria de una droguería, un laboratorio o una IPS implica muchas tareas repetitivas: revisar facturas, clasificar gastos y preparar soportes. La inteligencia artificial puede ayudar a organizarlas, aunque la responsabilidad tributaria sigue siendo del contador y del representante legal.',
    aplicaciones: [
      'Clasificar facturas y gastos para la contabilidad.',
      'Preparar resúmenes de documentos tributarios para revisión.',
      'Detectar inconsistencias entre facturas y registros.',
    ],
    paraQuien: ['Dueños y administradores de droguerías', 'Personal contable y administrativo de empresas de salud'],
    complementa: [IA, EXCEL, ['Curso gratis: Gestión Documental de Trámites ante el INVIMA', '/curso-de-gestion-documental-de-tramites-ante-el-invima']],
    preguntas: [
      ['¿La IA reemplaza al contador?', 'No. Apoya tareas repetitivas; las decisiones y la responsabilidad tributaria siguen siendo profesionales.'],
      ['¿Qué cuidar al usar IA con información financiera?', 'La confidencialidad y la verificación de cada dato antes de presentarlo.'],
    ],
  },
  'ia-para-control-de-inventarios-y-almacen-15648': {
    tituloSeo: 'Curso de IA para control de inventarios y almacén',
    meta: 'Curso en español de Edutin Academy sobre IA para inventarios y almacén, con la guía de Edvanta sobre vencimientos y logística farmacéutica.',
    porQue: 'En una farmacia o una bodega de medicamentos, el inventario es dinero y seguridad: el exceso produce vencimientos y la falta deja pacientes sin tratamiento. La inteligencia artificial ayuda a pronosticar la demanda y a ordenar las compras, siempre con las reglas sanitarias de almacenamiento.',
    aplicaciones: [
      'Pronosticar la demanda de los productos de mayor rotación.',
      'Detectar productos con riesgo de vencerse antes de venderse.',
      'Ajustar el punto de reorden con datos de consumo.',
    ],
    paraQuien: ['Regentes y químicos farmacéuticos de servicio farmacéutico', 'Coordinadores de inventarios y bodegas'],
    complementa: [['Artículo: cursos de logística farmacéutica', '/articulos/cursos-de-logistica-farmaceutica-y-cadena-de-suministro'], EXCEL, ['Artículo: cadena de frío de medicamentos', '/articulos/cadena-de-frio-medicamentos']],
    preguntas: [
      ['¿Qué exige la norma sobre vencimientos?', 'La Resolución 1403 de 2007 pide un sistema para que el lote más próximo a vencerse sea el primero en dispensarse.'],
      ['¿La IA sirve en una droguería pequeña?', 'Sí, incluso con herramientas sencillas que analizan el consumo histórico.'],
    ],
  },
  'ia-para-analisis-de-datos-14528': {
    tituloSeo: 'Curso de IA para análisis de datos en español',
    meta: 'Curso en español de Edutin Academy sobre inteligencia artificial para analizar datos, con la guía de Edvanta para salud y calidad.',
    porQue: 'La inteligencia artificial acelera el análisis de datos: limpia información, sugiere fórmulas, explica resultados y propone gráficos. Para quien trabaja con indicadores en salud o en calidad, es una forma de llegar más rápido a los hallazgos, verificando siempre los cálculos.',
    aplicaciones: [
      'Pedir a la IA una fórmula de Excel y comprobar el resultado.',
      'Resumir los hallazgos de una tabla grande de datos.',
      'Generar un primer borrador de gráfico para un informe.',
    ],
    paraQuien: ['Analistas y coordinadores que trabajan con indicadores', 'Profesionales que empiezan a usar IA con datos'],
    complementa: [EXCEL, IA, ['Artículo: cursos de IA para profesionales de la salud', '/articulos/cursos-de-inteligencia-artificial-para-profesionales-de-la-salud']],
    preguntas: [
      ['¿La IA hace bien los cálculos?', 'No siempre. Conviene verificar los resultados con la fórmula o con una muestra de datos.'],
      ['¿Hay un segundo nivel?', 'Sí, IA para análisis de datos II, también en Edutin.'],
    ],
  },
  'ia-para-gestion-documental-17245': {
    tituloSeo: 'Curso de IA para gestión documental',
    meta: 'Curso en español de Edutin Academy sobre IA para gestión documental, con la guía de Edvanta sobre control documental en farmacia.',
    porQue: 'Procedimientos, registros, expedientes y actas: las organizaciones de salud viven entre documentos. La inteligencia artificial ayuda a buscarlos, resumirlos, compararlos y clasificarlos, pero el control de versiones y la aprobación siguen las reglas de las buenas prácticas de documentación.',
    aplicaciones: [
      'Comparar dos versiones de un procedimiento y resumir los cambios.',
      'Clasificar documentos por tipo y área para el archivo.',
      'Buscar en el sistema documental la versión vigente de un formato.',
    ],
    paraQuien: ['Responsables de sistemas documentales', 'Personal de calidad y asuntos regulatorios'],
    complementa: [['Guía: buenas prácticas de documentación', '/articulos/cursos-gratis-gdp-documentacion'], ['Curso gratis: Buenas Prácticas de Documentación Farmacéutica', '/curso-de-buenas-practicas-de-documentacion-farmaceutica'], IA],
    preguntas: [
      ['¿La IA puede aprobar documentos?', 'No. La aprobación de documentos controlados es una responsabilidad de personas definidas en el sistema de calidad.'],
      ['¿Qué cuidar con documentos confidenciales?', 'Usar solo herramientas autorizadas por la empresa y no subir información confidencial a servicios públicos.'],
    ],
  },
  'ia-para-analisis-de-datos-ii-22406': {
    tituloSeo: 'Curso de IA para análisis de datos II',
    meta: 'Segundo nivel del curso de IA para análisis de datos de Edutin Academy, en español, con la guía de Edvanta sobre datos en salud.',
    porQue: 'Después de lo básico, el análisis de datos con inteligencia artificial pasa a tareas más exigentes: combinar fuentes, detectar patrones y automatizar informes recurrentes. Es un paso útil para quien prepara cada mes los mismos indicadores y quiere dedicar el tiempo a interpretarlos.',
    aplicaciones: [
      'Combinar datos de varias fuentes en una sola tabla consistente.',
      'Detectar patrones o valores atípicos en una serie de datos.',
      'Automatizar un informe que hoy se arma a mano cada mes.',
    ],
    paraQuien: ['Analistas que ya hicieron el primer nivel', 'Coordinadores de calidad y de indicadores'],
    complementa: [POWER_BI, PYTHON, IA],
    preguntas: [
      ['¿Necesito el primer nivel?', 'Conviene: este curso parte de lo visto en IA para análisis de datos.'],
      ['¿Qué herramienta usar para automatizar informes?', 'Depende del caso: Power BI para tableros, Python para procesos más complejos.'],
    ],
  },
  'analista-de-datos-con-power-bi-22150': {
    tituloSeo: 'Curso de analista de datos con Power BI en español',
    meta: 'Curso en español de Edutin Academy para formarte como analista de datos con Power BI, con la guía de Edvanta sobre tableros en farmacia.',
    porQue: 'El analista de datos con Power BI es un perfil muy buscado: conecta fuentes, arma modelos y construye tableros que la gerencia usa para decidir. En salud y en farmacia, esos tableros muestran indicadores de calidad, inventarios, ventas y servicio.',
    aplicaciones: [
      'Conectar Power BI a las hojas de cálculo del área.',
      'Construir un tablero de indicadores mensuales.',
      'Compartir el tablero con permisos adecuados.',
    ],
    paraQuien: ['Profesionales que quieren un perfil de analista de datos', 'Coordinadores que preparan informes de gestión'],
    complementa: [POWER_BI, ['Artículo: Power BI, para qué sirve en salud y farmacia', '/articulos/power-bi-para-que-sirve-en-salud-y-farmacia'], EXCEL],
    preguntas: [
      ['¿Qué diferencia tiene con los cursos de Power BI de Edutin?', 'Está orientado al perfil completo de analista de datos, no solo a la herramienta.'],
      ['¿Necesito saber Excel?', 'Ayuda mucho: la lógica de tablas y datos limpios es la misma.'],
    ],
  },
  'ia-para-abastecimiento-y-compras-15647': {
    tituloSeo: 'Curso de IA para abastecimiento y compras',
    meta: 'Curso en español de Edutin Academy sobre IA para compras y abastecimiento, con la guía de Edvanta sobre la cadena de suministro farmacéutica.',
    porQue: 'Comprar bien en salud significa tener el medicamento correcto, en la cantidad correcta, de un proveedor confiable y al mejor costo posible. La inteligencia artificial ayuda a comparar proveedores, prever necesidades y detectar riesgos de desabastecimiento.',
    aplicaciones: [
      'Comparar ofertas de proveedores con criterios de precio, calidad y tiempo.',
      'Prever necesidades de compra con el consumo histórico.',
      'Identificar productos con riesgo de desabastecimiento.',
    ],
    paraQuien: ['Responsables de compras en droguerías, IPS y laboratorios', 'Coordinadores de cadena de suministro'],
    complementa: [['Artículo: cursos de logística farmacéutica', '/articulos/cursos-de-logistica-farmaceutica-y-cadena-de-suministro'], ['Curso gratis: Negociación y Persuasión', '/curso-de-negociacion-y-persuasion'], EXCEL],
    preguntas: [
      ['¿Qué cuidar al comprar medicamentos?', 'Que el proveedor esté autorizado y que los productos tengan registro sanitario vigente.'],
      ['¿La IA decide a quién comprar?', 'Apoya el análisis; la decisión y la calificación de proveedores siguen siendo del equipo.'],
    ],
  },
  'ia-para-creacion-de-contenido-15498': {
    tituloSeo: 'Curso de IA para creación de contenido',
    meta: 'Curso en español de Edutin Academy sobre IA para crear contenido, con la guía de Edvanta para comunicar en salud sin exagerar.',
    porQue: 'La inteligencia artificial acelera la creación de textos, imágenes y videos para redes, blogs y material educativo. En salud, el reto es aprovecharla sin publicar datos falsos, promesas de resultados ni publicidad de medicamentos que la norma no permite.',
    aplicaciones: [
      'Generar ideas y borradores de publicaciones educativas.',
      'Adaptar un mismo contenido a distintos formatos y redes.',
      'Revisar que cada afirmación tenga una fuente confiable.',
    ],
    paraQuien: ['Equipos de comunicación y marketing en salud', 'Dueños de droguerías que manejan sus redes'],
    complementa: [['Artículo: cursos de Facebook Ads y Canva para droguerías', '/articulos/cursos-de-facebook-ads-y-canva-para-droguerias'], ['Artículo: cursos de marketing farmacéutico y digital', '/articulos/cursos-de-marketing-farmaceutico-y-digital'], ['Curso para Hablar frente a la Cámara', '/curso-para-hablar-frente-a-la-camara']],
    preguntas: [
      ['¿Qué norma regula la publicidad de medicamentos en Colombia?', 'La Resolución 1896 de 2023 del Ministerio de Salud.'],
      ['¿Puedo publicar contenido generado por IA sin revisarlo?', 'No conviene: puede contener errores o afirmaciones sin respaldo.'],
    ],
  },
  'administrador-de-bases-de-datos-mysql-22149': {
    tituloSeo: 'Curso de administrador de bases de datos MySQL',
    meta: 'Curso en español de Edutin Academy para administrar bases de datos MySQL, con la guía de Edvanta sobre datos e integridad en salud.',
    porQue: 'Muchos sistemas de salud, de inventario y de gestión guardan su información en bases de datos relacionales como MySQL. Saber consultarlas y administrarlas, con copias de seguridad y control de accesos, es clave para la continuidad y la integridad de los datos.',
    aplicaciones: [
      'Consultar datos de un sistema con SQL para un informe.',
      'Programar copias de seguridad y verificar que se puedan restaurar.',
      'Definir permisos de acceso según el rol de cada usuario.',
    ],
    paraQuien: ['Personal de tecnología en IPS, droguerías y laboratorios', 'Analistas que necesitan consultar bases de datos'],
    complementa: [['Guía: integridad de datos', '/articulos/cursos-gratis-integridad-de-datos'], PYTHON, DATOS],
    preguntas: [
      ['¿Qué es una base de datos relacional?', 'Un sistema que guarda la información en tablas relacionadas entre sí y se consulta con SQL.'],
      ['¿Por qué importan las copias de seguridad?', 'Porque sin ellas una falla puede hacer perder registros que la norma exige conservar.'],
    ],
  },
  'coursera-certificado-profesional-de-google-it-support': {
    tituloSeo: 'Certificado de soporte de TI de Google en español',
    meta: 'Certificado profesional de Google en Coursera, en español, sobre soporte de tecnologías de la información, con la guía de Edvanta.',
    porQue: 'El soporte de tecnologías de la información mantiene funcionando los equipos, las redes y los sistemas de los que depende la atención: historias clínicas, facturación, inventarios. Es un primer empleo en tecnología con demanda en clínicas, laboratorios y cadenas de farmacias.',
    aplicaciones: [
      'Diagnosticar y resolver problemas comunes de computadores y redes.',
      'Gestionar cuentas de usuario y permisos de acceso.',
      'Aplicar buenas prácticas básicas de seguridad informática.',
    ],
    paraQuien: ['Personas que buscan su primer empleo en tecnología', 'Personal administrativo que apoya los sistemas de su organización'],
    complementa: [['Curso: Especialización Healthcare IT (Coursera)', '/curso-de-especializacion-healthcare-it'], ['Guía: integridad de datos', '/articulos/cursos-gratis-integridad-de-datos'], DATOS],
    preguntas: [
      ['¿Necesito experiencia previa en tecnología?', 'No. Es un certificado de nivel inicial.'],
      ['¿Sirve en el sector salud?', 'Sí: clínicas, laboratorios y farmacias necesitan soporte para sus sistemas.'],
    ],
  },
  'desarrollador-front-end-junior-22145': {
    tituloSeo: 'Curso de desarrollador front end junior',
    meta: 'Curso en español de Edutin Academy para empezar como desarrollador front end, con la guía de Edvanta sobre tecnología en salud.',
    porQue: 'El desarrollo front end construye la parte de las aplicaciones y páginas web que ven los usuarios. En salud hay cada vez más plataformas para pacientes y profesionales, y un desarrollador que entiende el sector diseña interfaces más claras y accesibles.',
    aplicaciones: [
      'Construir una página informativa accesible para pacientes.',
      'Maquetar un formulario sencillo con validaciones.',
      'Aplicar principios de accesibilidad y diseño legible.',
    ],
    paraQuien: ['Personas que empiezan en desarrollo web', 'Profesionales de salud que quieren construir sus propias herramientas'],
    complementa: [['Artículo: cursos de Claude Code', '/articulos/cursos-de-claude-code'], DATOS, PYTHON],
    preguntas: [
      ['¿Qué tecnologías usa un desarrollador front end?', 'HTML, CSS y JavaScript, y frameworks como React o Angular.'],
      ['¿Hay un segundo nivel?', 'Sí, Desarrollador front end junior II, también en Edutin.'],
    ],
  },
  'desarrollador-front-end-con-angular-22148': {
    tituloSeo: 'Curso de desarrollo front end con Angular',
    meta: 'Curso en español de Edutin Academy sobre desarrollo front end con Angular, con la guía de Edvanta sobre aplicaciones en salud.',
    porQue: 'Angular es un framework usado en aplicaciones empresariales grandes, incluidas muchas plataformas corporativas y de salud. Aprenderlo permite trabajar en sistemas con formularios complejos, roles de usuario y mucha información, como los de una IPS o un laboratorio.',
    aplicaciones: [
      'Construir formularios con validaciones para registrar información.',
      'Organizar una aplicación por módulos y componentes.',
      'Conectar la interfaz con los servicios de datos de la aplicación.',
    ],
    paraQuien: ['Desarrolladores con bases de front end', 'Equipos que mantienen aplicaciones corporativas'],
    complementa: [['Artículo: cursos de Claude Code', '/articulos/cursos-de-claude-code'], ['Guía: integridad de datos', '/articulos/cursos-gratis-integridad-de-datos'], DATOS],
    preguntas: [
      ['¿Angular o React?', 'Ambos son muy usados; Angular es común en aplicaciones empresariales grandes.'],
      ['¿Necesito saber JavaScript antes?', 'Conviene tener bases de HTML, CSS y JavaScript.'],
    ],
  },
  'desarrollador-front-end-junior-ii-22146': {
    tituloSeo: 'Curso de desarrollador front end junior II',
    meta: 'Segundo nivel del curso de desarrollador front end de Edutin Academy, en español, con la guía de Edvanta sobre tecnología en salud.',
    porQue: 'Después de los fundamentos, el desarrollo front end exige organizar mejor el código, trabajar con datos de servicios externos y cuidar el rendimiento y la accesibilidad. Es el paso para pasar de páginas sencillas a aplicaciones completas.',
    aplicaciones: [
      'Consumir datos de un servicio y mostrarlos en la interfaz.',
      'Organizar el código en componentes reutilizables.',
      'Mejorar la velocidad de carga de una página.',
    ],
    paraQuien: ['Quienes terminaron el primer nivel', 'Desarrolladores junior que quieren avanzar'],
    complementa: [['Artículo: cursos de Claude Code', '/articulos/cursos-de-claude-code'], DATOS, IA],
    preguntas: [
      ['¿Necesito el primer nivel?', 'Conviene: este curso parte de los fundamentos del primer nivel.'],
      ['¿La IA ayuda a programar el front end?', 'Sí, herramientas como Claude Code ayudan, siempre revisando y probando el resultado.'],
    ],
  },
};

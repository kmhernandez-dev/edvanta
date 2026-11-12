/**
 * ============================================================
 *  paginasInstitucionales.js — Textos de Sobre Edvanta, Contacto y Guías
 *
 *  Una sola fuente para dos lectores: la página de React y el HTML que
 *  se prerenderiza para los buscadores (scripts/seo-rutas-fijas.mjs).
 *  Así Google lee sin JavaScript exactamente lo que ve una persona.
 *
 *  Nada de cifras de alumnos, sellos ni alianzas: no hay ninguno
 *  documentado. Los principios son compromisos que el sitio cumple.
 * ============================================================
 */

export const SOBRE_EDVANTA = {
  titulo: 'Una empresa de educación farmacéutica',
  lead: 'Formamos a quienes trabajan con medicamentos, acompañamos con educación a pacientes y cuidadores, y diseñamos programas para instituciones. Todo bajo una misma marca y un mismo criterio.',
  puertas: [
    {
      to: '/contigo',
      titulo: 'Edvanta Contigo',
      desc: 'La puerta para pacientes y cuidadores, con Feliz Sin Tiroides como primera ruta.',
      cta: 'Conocer Edvanta Contigo',
    },
    {
      to: '/instituciones',
      titulo: 'Para instituciones',
      desc: 'Lo que hospitales, IPS, EPS y empresas pueden contratar de todas las escuelas.',
      cta: 'Ver servicios',
    },
  ],
  autoraTexto: 'Está al frente de Edvanta y creó Feliz Sin Tiroides, el programa para personas que viven con una condición tiroidea, desde su doble experiencia: la de química farmacéutica y la de paciente que vive sin tiroides. Dicta el primer curso en vivo de Edvanta, para auxiliares y regentes de farmacia.',
  principios: [
    {
      t: 'Decimos qué es nuestro y qué no',
      d: 'Los cursos de Edvanta y los de otras plataformas se muestran separados. Cuando un enlace es de afiliado, lo señalamos.',
    },
    {
      t: 'Fechas, precios y cupos, solo cuando existen',
      d: 'Si algo todavía no tiene fecha o valor aprobado, lo decimos y te ofrecemos un aviso en lugar de un dato que parezca real.',
    },
    {
      t: 'Actualización, no títulos',
      d: 'Nuestros cursos son formación de actualización. No otorgan títulos de auxiliar, regente ni ningún otro título profesional.',
    },
    {
      t: 'Educar no es consultar',
      d: 'Lo que hacemos para pacientes es educación: ayuda a entender y a preparar la consulta, pero no reemplaza la atención de su equipo de salud.',
    },
  ],
};

export const CONTACTO = {
  titulo: 'Hablemos',
  intro: 'Escríbenos por el canal que prefieras. Si tu pregunta es sobre tu salud o tu tratamiento, consúltala con tu médico o farmacéutico tratante: por aquí no damos indicaciones clínicas.',
  atajos: [
    { t: 'Quiero una propuesta para mi institución', to: '/instituciones#solicitar-propuesta' },
    { t: 'Me interesa el curso en vivo para auxiliares y regentes', to: '/curso-de-operacion-segura-del-servicio-farmaceutico#registro' },
    { t: 'No puedo entrar al aula virtual', to: '/diagnostico' },
    { t: 'Política de reembolsos de los kits', to: '/reembolsos' },
  ],
};

export const GUIAS = {
  titulo: 'Material para aplicar lo que sabes',
  lead: 'Kits editables para el trabajo diario, guías para pacientes y lecturas gratuitas. Cada recurso dice para quién es, cómo se usa y si es gratis o de pago.',
  kits: {
    eyebrow: 'Para profesionales',
    titulo: 'Kits de plantillas de Edvanta',
    desc: 'Formatos editables en Word, Excel y PDF. Se pagan en línea con Mercado Pago y, después del pago, te enviamos el kit por WhatsApp.',
  },
  pacientes: {
    eyebrow: 'Guías Contigo · Para pacientes y cuidadores',
    titulo: 'Guías para leer en casa y llevar a la consulta',
    desc: 'Educación en lenguaje claro. No reemplaza la indicación de tu médico.',
  },
  lecturas: [
    { to: '/articulos', icono: 'Newspaper', titulo: 'Artículos', desc: 'Lecturas sobre calidad, regulatorio, estudio y carrera en el sector farmacéutico.', cta: 'Leer artículos' },
    { to: '/recursos', icono: 'Library', titulo: 'Biblioteca de referencias', desc: 'Normativa, lecturas y fuentes conectadas con cada área profesional.', cta: 'Abrir la biblioteca' },
    { to: '/atenfarmaclinic', icono: 'FileText', tono: 'teal', titulo: 'AtenFarmaClinic', desc: 'Artículos y herramientas para la práctica de la farmacia clínica.', cta: 'Entrar' },
  ],
  carrera: {
    eyebrow: 'Para tu carrera',
    titulo: 'Herramientas gratuitas',
    desc: 'Complementos gratuitos para quien busca empleo o quiere mostrar su perfil profesional.',
    herramientas: [
      { to: '/hoja-de-vida', icono: 'FileText', titulo: 'Hoja de vida ATS', desc: 'Créala por pasos, mide su puntaje y descárgala en PDF.', cta: 'Crear mi hoja de vida' },
      { to: '/empleo', icono: 'Briefcase', titulo: 'Centro de empleo', desc: 'Ofertas para químicos farmacéuticos y guía de postulación.', cta: 'Ver el centro de empleo' },
      { to: '/vitrina-de-talento-farmaceutico', icono: 'Sparkles', titulo: 'Vitrina de talento', desc: 'Publica tu perfil profesional para que las empresas te encuentren.', cta: 'Ver la vitrina' },
      { to: '/carreras', icono: 'Compass', titulo: 'Carreras farmacéuticas', desc: 'Áreas, cargos y la formación que pide cada una.', cta: 'Explorar carreras' },
    ],
    tambien: [
      ['Rutas profesionales', '/rutas'],
      ['Competencias', '/competencias'],
      ['Oportunidades y becas', '/oportunidades'],
      ['Proyectos de práctica', '/proyectos'],
      ['Certificaciones', '/certificaciones'],
      ['Espacios de conexión', '/conecta'],
      ['Emprendimientos', '/emprendimiento-farmaceutico'],
      ['Centro de herramientas', '/herramientas'],
    ],
  },
  otrasPlataformas: 'En el catálogo también recomendamos cursos de Coursera, Udemy y Edutin. No son de Edvanta: el acceso, el precio y el certificado dependen de cada plataforma, y algunos enlaces son de afiliado, por lo que Edvanta puede recibir una comisión sin costo adicional para ti.',
};

/**
 * /prensa — Para periodistas, docentes y organizaciones que quieren citar
 * o enlazar a Edvanta. Solo datos comprobables en el propio sitio: nada de
 * cifras de alumnos, premios ni apariciones en medios.
 */
export const PRENSA = {
  seoTitle: 'Prensa y citas | Edvanta',
  seoDescription: 'Para periodistas, docentes y estudiantes: qué es Edvanta, cómo citarnos, recursos para enlazar, logos y contacto para entrevistas.',
  titulo: 'Prensa y citas',
  lead: 'Información sobre Edvanta para periodistas, docentes, estudiantes y organizaciones que quieran citarnos, enlazarnos o consultar a nuestro equipo.',
  descripcionCorta: 'Edvanta es una empresa colombiana de educación farmacéutica. Forma a quienes trabajan con medicamentos, educa a pacientes y cuidadores y diseña programas para instituciones. Sus artículos de salud tienen autora y revisión clínica de una química farmacéutica, y sus noticias regulatorias enlazan a la fuente oficial.',
  recursos: [
    { to: '/noticias', titulo: 'Noticias y alertas sanitarias', desc: 'Alertas y comunicados del INVIMA y de agencias de referencia, cada uno con su fuente oficial y lo que significa para Colombia.' },
    { to: '/articulos', titulo: 'Artículos de salud y farmacia', desc: 'Con autora, revisora, fecha de revisión y fuentes. Cada artículo trae su cita lista en Vancouver y APA 7.' },
    { to: '/herramientas', titulo: 'Herramientas gratuitas', desc: 'Calculadoras y herramientas para la práctica y la carrera farmacéutica, con su fórmula y sus límites explicados.' },
    { to: '/cursos', titulo: 'Cursos', desc: 'Cursos propios de Edvanta y cursos recomendados de otras plataformas, separados y señalados.' },
  ],
  comoCitar: [
    'Enlaza la página exacta que citas: el artículo, la noticia o la herramienta. Así tus lectores llegan a la versión actualizada.',
    'Para mencionar la plataforma, usa el nombre «Edvanta» y la dirección https://edvanta.co.',
    'En trabajos académicos, copia la cita en Vancouver o APA 7 que aparece al final de cada artículo, en «Cómo citar este artículo».',
    'Si citas una alerta o una norma, enlaza también la fuente oficial. Nosotros la indicamos en cada noticia.',
  ],
  logos: [
    { src: '/img/logo-edvanta.png', titulo: 'Logo de Edvanta', medidas: '931 × 512 px, PNG con fondo transparente' },
    { src: '/img/logo-edvanta-wordmark.png', titulo: 'Logotipo horizontal', medidas: '901 × 162 px, PNG con fondo transparente' },
  ],
  usoLogo: 'Úsalos sin deformarlos, recortarlos ni cambiar sus colores, y solo para referirte a Edvanta.',
  vocera: 'Está al frente de Edvanta: dirige la línea editorial y la revisión clínica de sus contenidos. También creó Feliz Sin Tiroides, el programa para personas que viven con una condición tiroidea.',
  consultas: 'Para entrevistas, datos o aclaraciones sobre un contenido, escríbenos con el tema, el medio y la fecha límite. Si encuentras un error en un artículo, también queremos saberlo: lo corregimos y actualizamos la fecha.',
};

/**
 * /alianzas — Para facultades, semilleros, oficinas de egresados, colegios
 * profesionales y fundaciones de pacientes. Describe lo que Edvanta ofrece
 * hoy; no menciona alianzas firmadas, porque no hay ninguna documentada.
 */
export const ALIANZAS = {
  seoTitle: 'Alianzas académicas y gremiales | Edvanta',
  seoDescription: 'Cursos gratuitos, charlas y recursos de Edvanta para facultades de Química Farmacéutica, semilleros, colegios profesionales y fundaciones.',
  titulo: 'Alianzas académicas y gremiales',
  lead: 'Para facultades y programas de Química Farmacéutica, semilleros, oficinas de egresados y de prácticas, colegios profesionales y fundaciones de pacientes que quieran sumar formación farmacéutica práctica para su comunidad.',
  paraQuien: [
    'Facultades y programas de Química Farmacéutica, Farmacia y Regencia de Farmacia.',
    'Semilleros de investigación y grupos de estudio.',
    'Oficinas de egresados, de prácticas y de bienestar universitario.',
    'Colegios profesionales, asociaciones y gremios del sector farmacéutico.',
    'Fundaciones y comunidades de pacientes.',
  ],
  disponible: [
    { to: '/recursos-para-estudiantes-de-quimica-farmaceutica', titulo: 'Recursos para estudiantes de Química Farmacéutica', desc: 'Los cursos gratuitos por área, las guías de carrera y las herramientas para el primer empleo en una sola página, con un bloque listo para enlazar desde su sitio.' },
    { to: '/cursos', titulo: 'Cursos propios gratuitos', desc: 'Buenas prácticas de manufactura, asuntos regulatorios, registro sanitario, farmacología y farmacoterapia, entre otros. El contenido es gratuito; el certificado verificable es opcional.' },
    { to: '/noticias', titulo: 'Noticias regulatorias con fuente oficial', desc: 'Alertas del INVIMA y de agencias de referencia explicadas para Colombia, útiles para clases y boletines.' },
    { to: '/articulos', titulo: 'Artículos con revisión clínica', desc: 'Lecturas para pacientes y profesionales, con autora, fuentes y cita lista para trabajos académicos.' },
    { to: '/herramientas', titulo: 'Herramientas para la carrera', desc: 'Hoja de vida, centro de empleo, rutas profesionales y otras herramientas gratuitas para estudiantes y egresados.' },
  ],
  formas: [
    { t: 'Una página para su comunidad', d: 'Una selección de cursos y recursos de Edvanta pensada para su programa o sus asociados, a la que pueden enlazar desde su sitio.', to: '/recursos-para-estudiantes-de-quimica-farmaceutica' },
    { t: 'Charlas y talleres virtuales', d: 'Sesiones para estudiantes, semilleros o asociados sobre temas como calidad, asuntos regulatorios, farmacovigilancia o uso seguro de medicamentos.' },
    { t: 'Contenido para sus canales', d: 'Resúmenes de alertas sanitarias y lecturas para boletines, carteleras o aulas virtuales, siempre con la fuente oficial.' },
    { t: 'Formación para equipos', d: 'Programas de capacitación para instituciones, con matrícula institucional.', to: '/instituciones' },
  ],
  condiciones: 'Cada alianza se acuerda por escrito con la institución. No incluye pagos por enlaces ni publicidad encubierta: se basa en contenido útil para su comunidad.',
  comoEmpezar: 'Escríbenos con el nombre de la institución, el programa o grupo, y lo que necesita su comunidad. Te respondemos con una propuesta.',
};

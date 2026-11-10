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

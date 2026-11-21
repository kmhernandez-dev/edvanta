/**
 * ============================================================
 *  contigoAltoCosto.js — Programa Contigo Alto Costo
 *
 *  Contenido público y textos de autorización del programa para
 *  personas que viven con una enfermedad de alto costo.
 *
 *  - Condiciones: las que sigue la Cuenta de Alto Costo de Colombia
 *    (cuentadealtocosto.org, consulta del 21-nov-2026), más «otra».
 *  - Autorizaciones: Ley 1581 de 2012 (arts. 5 y 6) y Decreto 1377
 *    de 2013 (art. 6). Cada finalidad se autoriza por separado y
 *    registrarse nunca exige entregar datos de salud.
 *
 *  Los slugs deben coincidir con api/lib/contigo-alto-costo.js.
 *  Cambiar un texto de autorización exige subir VERSION_CONSENTIMIENTO
 *  en los dos archivos.
 * ============================================================
 */

export const VERSION_CONSENTIMIENTO = 'AC-2026-11-v1';

export const CONDICIONES_ALTO_COSTO = [
  { slug: 'artritis-reumatoide', nombre: 'Artritis reumatoide' },
  { slug: 'cancer', nombre: 'Cáncer' },
  { slug: 'enfermedad-renal-cronica', nombre: 'Enfermedad renal crónica' },
  { slug: 'hemofilia', nombre: 'Hemofilia' },
  { slug: 'hepatitis-c', nombre: 'Hepatitis C' },
  { slug: 'vih', nombre: 'VIH' },
  { slug: 'enfermedad-huerfana', nombre: 'Enfermedad huérfana (rara)' },
  { slug: 'otra', nombre: 'Otra condición con medicamentos de alto costo' },
];

export const NECESIDADES_ALTO_COSTO = [
  { slug: 'entender-tratamiento', texto: 'Entender mi tratamiento y para qué sirve cada medicamento' },
  { slug: 'acceso-y-entregas', texto: 'Saber cómo funcionan las autorizaciones y las entregas de mi medicamento' },
  { slug: 'efectos-adversos', texto: 'Reconocer y manejar efectos adversos' },
  { slug: 'organizar-tomas', texto: 'Organizar las tomas, las citas y los laboratorios' },
  { slug: 'apoyo-emocional', texto: 'Apoyo emocional para mí o mi familia' },
  { slug: 'comunidad', texto: 'Conocer a otras personas que viven lo mismo' },
  { slug: 'cuidadores', texto: 'Herramientas para quien cuida a un paciente' },
];

/**
 * Autorizaciones independientes. Solo «datos_personales» es necesaria
 * para registrarse; «datos_sensibles» solo se pide si la persona decide
 * contar su condición, su medicamento o su EPS.
 */
export const FINALIDADES_ALTO_COSTO = [
  {
    slug: 'datos_personales',
    obligatoria: true,
    titulo: 'Mis datos de contacto',
    texto: 'Autorizo a Edvanta S.A.S. a tratar mi nombre, correo, celular y departamento para registrarme en Contigo Alto Costo, enviarme la confirmación y permitirme gestionar mis autorizaciones, según su política de tratamiento de datos.',
  },
  {
    slug: 'datos_sensibles',
    obligatoria: false,
    titulo: 'Mi condición, mi medicamento y mi EPS (datos sensibles)',
    texto: 'Autorizo de forma expresa a Edvanta S.A.S. a tratar mi condición de salud, mi medicamento y mi EPS para darme contenido y acompañamiento de mi ruta. Entiendo que son datos sensibles, que no estoy obligado a entregarlos y que puedo usar el programa sin ellos.',
  },
  {
    slug: 'comunicaciones',
    obligatoria: false,
    titulo: 'Contenido educativo',
    texto: 'Quiero recibir por correo guías, encuentros y novedades educativas de Edvanta. Puedo darme de baja cuando quiera.',
  },
  {
    slug: 'contacto_qf',
    obligatoria: false,
    titulo: 'Contacto de un químico farmacéutico',
    texto: 'Autorizo que un químico farmacéutico de Edvanta me escriba por correo o WhatsApp para ofrecerme acompañamiento con mi tratamiento.',
  },
  {
    slug: 'estudios_anonimizados',
    obligatoria: false,
    titulo: 'Análisis anonimizados',
    texto: 'Autorizo que mis respuestas se usen sin mi nombre ni mis datos de contacto en análisis agregados que ayuden a mejorar la atención de los pacientes. Para participar en un estudio concreto me pedirán un consentimiento informado aparte.',
  },
  {
    slug: 'info_terceros',
    obligatoria: false,
    titulo: 'Programas de apoyo de terceros',
    texto: 'Quiero que Edvanta me cuente sobre programas de apoyo a pacientes de laboratorios o asociaciones. Edvanta no entregará mis datos a ningún tercero sin pedirme antes una autorización específica para ese caso.',
  },
];

export const ALTO_COSTO = {
  eyebrow: 'Contigo Alto Costo',
  titulo: 'Si tu tratamiento es de alto costo, no tienes que entenderlo solo',
  lead: 'Un programa de Edvanta para pacientes y cuidadores que viven con artritis reumatoide, cáncer, enfermedad renal crónica, hemofilia, hepatitis C, VIH o una enfermedad huérfana. Te ayudamos a comprender tu tratamiento, organizar tu cuidado y llegar mejor preparado a cada cita.',
  imagen: '/img/fotos/pacientes-taller.webp',
  imagenAlt: 'Química farmacéutica explicando una cartilla educativa a pacientes y cuidadores',
  ofrece: [
    { icono: 'BookOpen', titulo: 'Guías de tu condición', texto: 'Explicadas por químicos farmacéuticos, con fuentes oficiales y en lenguaje claro.' },
    { icono: 'Pill', titulo: 'Tu medicamento, sin misterio', texto: 'Para qué sirve, cómo se usa, qué vigilar y qué preguntar en la consulta.' },
    { icono: 'ClipboardList', titulo: 'Tu cuidado, organizado', texto: 'Tomas, citas, laboratorios y preguntas en un solo lugar privado.' },
    { icono: 'Users', titulo: 'Comunidad acompañada', texto: 'Personas que viven lo mismo, con moderación profesional y sin consejos médicos entre pares.' },
  ],
  pasos: [
    { titulo: 'Regístrate', texto: 'Solo necesitas tu nombre y tu correo. Contarnos tu condición es opcional.' },
    { titulo: 'Elige qué autorizas', texto: 'Cada uso de tus datos tiene su propia casilla. Puedes cambiarla cuando quieras.' },
    { titulo: 'Recibe tu ruta', texto: 'Te enviamos contenido según lo que necesitas y, si lo pides, te contacta un químico farmacéutico.' },
  ],
  promesas: [
    'No vendemos tus datos.',
    'No compartimos tus datos con laboratorios, EPS ni nadie sin tu autorización específica.',
    'No te mostramos publicidad de medicamentos con fórmula médica.',
    'Puedes revisar, cambiar o eliminar tus datos desde el enlace que te enviamos.',
  ],
  preguntas: [
    {
      p: '¿Es gratis?',
      r: 'Sí. El registro, las guías y la comunidad son gratuitos. Si en el futuro ofrecemos un servicio pagado, lo verás con su precio antes de decidir.',
    },
    {
      p: '¿Tengo que contar mi enfermedad?',
      r: 'No. Puedes registrarte solo con tu nombre y tu correo. Si nos cuentas tu condición y tu medicamento, podremos enviarte contenido más útil, pero es tu decisión.',
    },
    {
      p: '¿Le van a dar mis datos a mi EPS o a un laboratorio?',
      r: 'No. Tus datos no se entregan a terceros sin que lo autorices de forma específica para ese caso. Las cifras que usamos para mejorar el programa son agregadas y no permiten identificarte.',
    },
    {
      p: '¿Me van a decir qué medicamento tomar?',
      r: 'No. Edvanta educa y acompaña, pero no diagnostica ni cambia tratamientos. Esas decisiones son de tu médico tratante.',
    },
    {
      p: '¿Cómo elimino mis datos?',
      r: 'Con el enlace personal que llega a tu correo puedes revisar tus datos, retirar cualquier autorización o pedir que los eliminemos.',
    },
  ],
};

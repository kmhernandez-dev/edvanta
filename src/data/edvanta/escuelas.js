/**
 * ============================================================
 *  escuelas.js — Las cinco escuelas de Edvanta
 *
 *  Edvanta es una sola empresa. Las escuelas ordenan lo que enseña,
 *  no son marcas aparte. Cada una declara sus áreas y, para cada área,
 *  si hoy hay algo que usar o si está en desarrollo. El estado se
 *  revisa a mano contra el catálogo real: si un área dice
 *  «disponible», existe al menos un curso o recurso publicado.
 *
 *  `catalogo` dice qué cursos propios del aula pertenecen a la
 *  escuela. `area` es la categoría grande del curso (migración 046) y
 *  `categorias` suma etiquetas finas de otras áreas: un curso puede
 *  aparecer en dos escuelas sin duplicarse en el sistema.
 * ============================================================
 */

export const ESCUELAS = [
  {
    slug: 'salud-y-farmacia-clinica',
    nombre: 'Escuela de Salud y Farmacia Clínica',
    corto: 'Salud y Farmacia Clínica',
    menu: 'Farmacia clínica, farmacoterapia y pacientes',
    icono: 'HeartPulse',
    imagen: '/img/escuelas/salud.webp',
    imagenAlt: 'Químicos farmacéuticos y personal asistencial revisando la farmacoterapia de un paciente en una tableta',
    tono: 'teal',
    resumen:
      'Farmacia clínica y hospitalaria, atención farmacéutica y farmacoterapia para quienes cuidan pacientes, y educación para pacientes y cuidadores.',
    catalogo: { area: 'Farmacología', categorias: ['Servicio farmacéutico'] },
    programas: ['atenfarmaclinic', 'feliz-sin-tiroides'],
    recorridos: [
      {
        id: 'talento',
        titulo: 'Formación del talento humano',
        publico: 'profesionales',
        texto: 'Para químicos farmacéuticos, regentes, auxiliares y equipos de salud que necesitan actualizarse.',
        areas: [
          { nombre: 'Farmacia clínica y hospitalaria', estado: 'disponible', nota: 'Central de mezclas y preparaciones magistrales.' },
          { nombre: 'Atención farmacéutica', estado: 'disponible', nota: 'Kit de Atención Farmacéutica Pro y herramientas de práctica clínica en AtenFarmaClinic.' },
          { nombre: 'Farmacología y farmacoterapia', estado: 'disponible', nota: 'Oncología, cardiovascular, sistema nervioso central, respiratoria, renal y más, y farmacoterapia de diabetes, hipertensión, insuficiencia cardíaca, asma y EPOC.' },
          { nombre: 'Actualización por áreas clínicas', estado: 'disponible', nota: 'Empieza por endocrinología y enfermedades metabólicas.' },
          { nombre: 'Actualización para regentes de farmacia', estado: 'proxima_apertura', producto: 'operacion-segura-servicio-farmaceutico' },
          { nombre: 'Actualización para auxiliares de farmacia', estado: 'proxima_apertura', producto: 'operacion-segura-servicio-farmaceutico' },
          { nombre: 'Capacitación de equipos institucionales', estado: 'a_solicitud', to: '/instituciones' },
        ],
      },
      {
        id: 'pacientes',
        titulo: 'Educación para pacientes y cuidadores',
        publico: 'pacientes',
        texto: 'Para comprender una condición de salud y participar en el cuidado. Vive en Edvanta Contigo.',
        to: '/contigo',
        areas: [
          { nombre: 'Salud tiroidea · Feliz Sin Tiroides', estado: 'disponible', to: '/contigo/tiroides' },
          { nombre: 'Rutas por otras condiciones de salud', estado: 'en_desarrollo', to: '/contigo/rutas' },
        ],
      },
    ],
  },
  {
    slug: 'calidad-y-produccion-farmaceutica',
    nombre: 'Escuela de Calidad y Producción Farmacéutica',
    corto: 'Calidad y Producción',
    menu: 'BPM, documentación, riesgos y validación',
    icono: 'ShieldCheck',
    imagen: '/img/escuelas/calidad.webp',
    imagenAlt: 'Equipo con indumentaria de área limpia revisando un proceso de producción en una tableta',
    tono: 'blue',
    resumen:
      'Sistemas de gestión de calidad, buenas prácticas, documentación, riesgos y validación para laboratorios, plantas y servicios farmacéuticos.',
    catalogo: { area: 'Calidad', categorias: [] },
    programas: [],
    recorridos: [
      {
        id: 'talento',
        titulo: 'Áreas de la escuela',
        publico: 'profesionales',
        areas: [
          { nombre: 'Sistemas de gestión de calidad', estado: 'disponible', nota: 'Aseguramiento, gestión y auditoría de calidad.' },
          { nombre: 'Buenas prácticas de manufactura', estado: 'disponible', nota: 'BPM, BPL y BPE.' },
          { nombre: 'Documentación', estado: 'disponible', nota: 'Buenas prácticas de documentación farmacéutica.' },
          { nombre: 'Gestión de riesgos', estado: 'disponible', nota: 'Riesgos en calidad, desviaciones y CAPA.' },
          { nombre: 'Validación y mejora de procesos', estado: 'disponible', nota: 'Validaciones, calificaciones y métodos analíticos.' },
        ],
      },
    ],
  },
  {
    slug: 'asuntos-regulatorios',
    nombre: 'Escuela de Asuntos Regulatorios',
    corto: 'Asuntos Regulatorios',
    menu: 'Registros, expedientes y etiquetado ante el INVIMA',
    icono: 'FileCheck2',
    imagen: '/img/escuelas/regulatorios.webp',
    imagenAlt: 'Profesionales de asuntos regulatorios revisando con lupa el etiquetado de un medicamento',
    tono: 'violet',
    resumen:
      'Registros sanitarios, expedientes, etiquetado y ciclo de vida del producto, con los requisitos del INVIMA y de cada tipo de producto.',
    catalogo: { area: 'Asuntos Regulatorios', categorias: [] },
    programas: [],
    recorridos: [
      {
        id: 'talento',
        titulo: 'Áreas de la escuela',
        publico: 'profesionales',
        areas: [
          { nombre: 'Registros sanitarios', estado: 'disponible', nota: 'Registro, modificaciones y renovaciones ante el INVIMA.' },
          { nombre: 'Expedientes', estado: 'disponible', nota: 'Dossiers, gestión documental y respuesta a requerimientos.' },
          { nombre: 'Etiquetado', estado: 'disponible', nota: 'Etiquetas e insertos de medicamentos.' },
          { nombre: 'Ciclo de vida del producto', estado: 'disponible', nota: 'Estabilidad, bioequivalencia, cambios y renovación.' },
          { nombre: 'Requisitos por tipo de producto', estado: 'disponible', nota: 'Biológicos, biosimilares, vacunas, fitoterapéuticos, suplementos, cannabis, radiofármacos y gases medicinales.' },
          { nombre: 'Requisitos por país', estado: 'en_desarrollo', nota: 'Hoy el contenido corresponde a Colombia.' },
        ],
      },
    ],
  },
  {
    slug: 'habilidades-blandas',
    nombre: 'Escuela de Habilidades Blandas',
    corto: 'Habilidades Blandas',
    menu: 'Oratoria, comunicación, liderazgo y servicio',
    icono: 'MessagesSquare',
    imagen: '/img/escuelas/habilidades-blandas.webp',
    imagenAlt: 'Químicos farmacéuticos y personal de salud conversando alrededor de una mesa de trabajo con una tableta',
    tono: 'teal',
    resumen:
      'Oratoria, comunicación asertiva, negociación, inteligencia emocional, liderazgo y servicio al paciente, con ejemplos del sector farmacéutico y de la salud.',
    // Los diez cursos de la migración 075 (scripts/generar-habilidades-blandas.mjs).
    catalogo: { area: 'Habilidades Blandas', categorias: [] },
    programas: [],
    recorridos: [
      {
        id: 'talento',
        titulo: 'Áreas de la escuela',
        publico: 'profesionales',
        areas: [
          { nombre: 'Oratoria y presentaciones', estado: 'disponible', nota: 'Oratoria, miedo a hablar en público, presentaciones y storytelling, y hablar frente a la cámara.' },
          { nombre: 'Comunicación interpersonal', estado: 'disponible', nota: 'Comunicación asertiva y lenguaje corporal.' },
          { nombre: 'Liderazgo y relaciones laborales', estado: 'disponible', nota: 'Negociación y persuasión, inteligencia emocional, y liderazgo y trabajo en equipo.' },
          { nombre: 'Servicio al paciente', estado: 'disponible', nota: 'Servicio al cliente y comunicación con el paciente en farmacias y droguerías.' },
          { nombre: 'Capacitación de equipos institucionales', estado: 'a_solicitud', to: '/instituciones' },
        ],
      },
    ],
  },
  {
    slug: 'marketing-y-comunicacion-farmaceutica',
    nombre: 'Escuela de Marketing y Comunicación Farmacéutica',
    corto: 'Marketing y Comunicación',
    menu: 'Visita médica y comunicación de evidencia',
    icono: 'Megaphone',
    imagen: '/img/escuelas/marketing.webp',
    imagenAlt: 'Equipo revisando piezas de comunicación de salud en una pantalla',
    tono: 'amber',
    resumen:
      'Marketing farmacéutico, visita médica, comunicación de evidencia y contenidos educativos; formación para profesionales y servicios para empresas del sector.',
    catalogo: null,
    programas: [],
    recorridos: [
      {
        id: 'talento',
        titulo: 'Formación y servicios',
        publico: 'profesionales',
        areas: [
          { nombre: 'Marketing farmacéutico', estado: 'en_desarrollo', to: '/escuelas/marketing-y-comunicacion-farmaceutica#formacion' },
          { nombre: 'Visita médica', estado: 'en_desarrollo', to: '/escuelas/marketing-y-comunicacion-farmaceutica#formacion' },
          { nombre: 'Comunicación de evidencia', estado: 'en_desarrollo', to: '/escuelas/marketing-y-comunicacion-farmaceutica#formacion' },
          { nombre: 'Contenidos educativos', estado: 'en_desarrollo', to: '/escuelas/marketing-y-comunicacion-farmaceutica#formacion' },
          { nombre: 'Estrategia y comunicación para empresas', estado: 'a_solicitud', to: '/empresas/marketing' },
          { nombre: 'Materiales, contenidos y formación de equipos', estado: 'a_solicitud', to: '/empresas/marketing' },
        ],
      },
    ],
  },
];

export const escuelaPorSlug = (slug) => ESCUELAS.find((e) => e.slug === slug) || null;

/** ¿Este curso propio del aula pertenece a la escuela? */
export function cursoEnEscuela(curso, escuela) {
  if (!escuela?.catalogo || !curso) return false;
  return curso.area === escuela.catalogo.area || escuela.catalogo.categorias.includes(curso.category);
}

/** La escuela principal de un curso, por su área. */
export const escuelaDelArea = (area) => ESCUELAS.find((e) => e.catalogo?.area === area) || null;

/** Una escuela está «en desarrollo» si ninguna de sus áreas tiene algo listo. */
export const escuelaEnDesarrollo = (escuela) => escuela.recorridos
  .every((r) => r.areas.every((a) => a.estado === 'en_desarrollo' || a.estado === 'a_solicitud'));

/**
 * Lo que cada escuela dice en Google. Las escuelas son las páginas pilar
 * para las búsquedas amplias: la búsqueda principal va al inicio del
 * título (60 caracteres o menos) y de la descripción (70 a 160).
 *
 * Reglas (seo/agente-crecimiento.md):
 *  - «gratis» se refiere al contenido; el certificado es opcional y tiene
 *    costo. Nunca «gratis con certificado» (Ley 1480).
 *  - Sin precios escritos aquí: el precio vigente vive en
 *    api/lib/precio-certificado.js y se muestra en cada curso.
 *
 * La misma fuente alimenta la página (Escuela.jsx) y el HTML del
 * servidor (scripts/seo-rutas-fijas.mjs).
 */
export const SEO_ESCUELAS = {
  'salud-y-farmacia-clinica': {
    busqueda: 'cursos de farmacología',
    titulo: 'Cursos de farmacología y farmacia clínica gratis | Edvanta',
    descripcion: 'Cursos online gratis de farmacología, farmacoterapia, oncología y farmacia hospitalaria para químicos farmacéuticos. Certificado verificable opcional.',
    tituloCursos: 'Cursos de farmacología, farmacoterapia y farmacia clínica',
    intro: 'Cursos de farmacología por sistemas, farmacoterapia de las enfermedades crónicas más frecuentes, oncología, central de mezclas y preparaciones magistrales. Cada curso aplica el contenido a casos de atención farmacéutica y se estudia en línea, a tu ritmo.',
    preguntas: [
      { q: '¿Para quién son los cursos de farmacología y farmacia clínica?', a: 'Para químicos farmacéuticos, regentes de farmacia, personal de servicios farmacéuticos hospitalarios y ambulatorios, y estudiantes de últimos semestres que necesitan repasar o actualizar farmacoterapia.' },
    ],
  },
  'calidad-y-produccion-farmaceutica': {
    busqueda: 'cursos de BPM',
    titulo: 'Cursos de BPM y calidad farmacéutica gratis | Edvanta',
    descripcion: 'Cursos online gratis de BPM, aseguramiento y control de calidad, validaciones, CAPA y auditoría farmacéutica. Certificado verificable opcional.',
    tituloCursos: 'Cursos de BPM, calidad y producción farmacéutica',
    intro: 'Cursos de buenas prácticas de manufactura, laboratorio y documentación, aseguramiento y control de calidad, gestión de desviaciones y CAPA, riesgos, validaciones y auditoría. Están pensados para laboratorios, plantas y servicios farmacéuticos.',
    preguntas: [
      { q: '¿Para quién son los cursos de BPM y calidad farmacéutica?', a: 'Para químicos farmacéuticos, analistas, supervisores de producción y personal de aseguramiento y control de calidad de laboratorios y plantas, y para quienes se preparan para trabajar en la industria.' },
    ],
  },
  'asuntos-regulatorios': {
    busqueda: 'cursos de asuntos regulatorios',
    titulo: 'Cursos de asuntos regulatorios e INVIMA gratis | Edvanta',
    descripcion: 'Cursos online gratis de asuntos regulatorios: registro sanitario, trámites ante el INVIMA, dossier y etiquetado. Certificado verificable opcional.',
    tituloCursos: 'Cursos de asuntos regulatorios y registro sanitario',
    intro: 'Cursos de registro sanitario de medicamentos, biológicos, vacunas, fitoterapéuticos y suplementos dietarios, trámites y requerimientos del INVIMA, dossier, etiquetado, estabilidad, bioequivalencia y regulación de productos especiales en Colombia.',
    preguntas: [
      { q: '¿Para quién son los cursos de asuntos regulatorios?', a: 'Para químicos farmacéuticos y profesionales de asuntos regulatorios de laboratorios, importadores y titulares de registros, y para quienes quieren empezar a trabajar en el área.' },
    ],
  },
  'habilidades-blandas': {
    busqueda: 'cursos de habilidades blandas',
    titulo: 'Cursos de habilidades blandas online gratis | Edvanta',
    descripcion: 'Cursos online gratis de oratoria, comunicación asertiva, liderazgo, negociación e inteligencia emocional. Certificado verificable opcional.',
    tituloCursos: 'Cursos de habilidades blandas',
    intro: 'Cursos de oratoria, comunicación asertiva, lenguaje corporal, liderazgo y trabajo en equipo, negociación, inteligencia emocional, servicio al cliente y presentaciones. Cada técnica se practica con situaciones reales del trabajo en salud y farmacia.',
    preguntas: [
      { q: '¿Para quién son los cursos de habilidades blandas?', a: 'Para cualquier persona que quiera comunicarse, liderar y negociar mejor en su trabajo. Los ejemplos vienen del sector salud y farmacéutico, pero las técnicas sirven en cualquier área.' },
    ],
  },
};

/** Preguntas de la escuela: las propias y las comunes a todas. */
export function preguntasDeEscuela(slug) {
  const seo = SEO_ESCUELAS[slug];
  if (!seo) return [];
  return [
    { q: `¿Los ${seo.busqueda} de Edvanta son gratis?`, a: 'Sí. El contenido de los cursos propios de Edvanta se estudia gratis, en línea y a tu ritmo. Solo necesitas crear tu cuenta en el aula.' },
    { q: '¿Dan certificado?', a: 'Sí, es opcional y tiene costo. Al aprobar el curso emites desde el aula el certificado de aprobación de Edvanta S.A.S., con código y QR verificables en edvanta.co/certificados. El precio vigente aparece en cada curso antes de pagar.' },
    ...seo.preguntas,
    { q: '¿Puedo capacitar a mi equipo con estos cursos?', a: 'Sí. Edvanta capacita equipos de droguerías, laboratorios, IPS y servicios farmacéuticos bajo propuesta. Escríbenos desde la página de instituciones.' },
  ];
}

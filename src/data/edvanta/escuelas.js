/**
 * ============================================================
 *  escuelas.js — Las cuatro escuelas de Edvanta
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
    slug: 'salud',
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
        to: '/pacientes',
        areas: [
          { nombre: 'Salud tiroidea · Feliz Sin Tiroides', estado: 'disponible', to: '/pacientes/tiroides' },
          { nombre: 'Rutas por otras condiciones de salud', estado: 'en_desarrollo', to: '/pacientes' },
        ],
      },
    ],
  },
  {
    slug: 'calidad',
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
    slug: 'regulatorios',
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
    slug: 'marketing',
    nombre: 'Escuela de Marketing y Comunicación Farmacéutica',
    corto: 'Marketing y Comunicación',
    menu: 'Visita médica y comunicación de evidencia',
    icono: 'Megaphone',
    imagen: '/img/escuelas/marketing.webp',
    imagenAlt: 'Equipo revisando piezas de comunicación de salud en una pantalla',
    tono: 'amber',
    resumen:
      'Marketing farmacéutico, visita médica y comunicación de evidencia, con servicios de materiales para empresas del sector.',
    catalogo: null,
    programas: [],
    recorridos: [
      {
        id: 'talento',
        titulo: 'Áreas de la escuela',
        publico: 'profesionales',
        areas: [
          { nombre: 'Marketing farmacéutico', estado: 'en_desarrollo' },
          { nombre: 'Visita médica', estado: 'en_desarrollo' },
          { nombre: 'Comunicación de evidencia', estado: 'en_desarrollo' },
          { nombre: 'Contenidos educativos', estado: 'en_desarrollo' },
          { nombre: 'Fichas y materiales comerciales', estado: 'a_solicitud', to: '/instituciones#comunicacion-con-evidencia' },
          { nombre: 'Servicios de comunicación para empresas del sector', estado: 'a_solicitud', to: '/instituciones#comunicacion-con-evidencia' },
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

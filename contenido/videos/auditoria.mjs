/**
 * Videos del Curso de Auditoría de Calidad Farmacéutica (19-nov-2026).
 *
 * Pedido de Karla: clases con videos curados del canal de Edutin Academy
 * («Edutin tiene excelentes videos») y de otros canales, en español. Todos
 * los videos se verificaron con el oEmbed oficial de YouTube (canal y
 * disponibilidad) el 19-nov-2026.
 *
 *  · Se usan los nueve videos de la serie «Curso de auditoría» de Edutin
 *    Academy, más sus videos de ISO 9001 (capítulo 9) y matriz de riesgo,
 *    en las clases cuyo tema coincide.
 *  · Se retiran los nueve videos en inglés; donde no hay Edutin, se usan
 *    canales en español (Uniandes, SENA, SGS Academy, MinSalud, Escuela
 *    Latinoamericana de Farmacia, entre otros).
 *  · Los títulos que citaban «ISO 19011:2018» se renombran sin la edición:
 *    el curso enseña la ISO 19011:2026 y los videos explican principios que
 *    se mantienen.
 *  · Ninguna clase queda con más de dos videos.
 *
 * Ver scripts/generar-migracion-videos.mjs.
 */
export const CURSO = 'Curso de Auditoría de Calidad Farmacéutica';
export const MIGRACION = '186_videos_auditoria.sql';

export const CAMBIOS = [
  // Unidad 1
  {
    clase: 'Introducción al curso: la auditoría como herramienta de calidad farmacéutica',
    agregar: [{ videoId: '0o6VA0wAGds', titulo: 'Origen y evolución de la auditoría (Edutin Academy)' }],
    retirar: ['_YiQP5Pvczo'],
  },
  {
    clase: 'Definiciones clave y los siete principios de auditoría',
    agregar: [
      { videoId: 'iHEuIm1UO6E', titulo: 'Principios de auditoría según ISO 19011 (Edutin Academy)' },
      { videoId: 'jWULQNeRsKA', titulo: 'Conceptos importantes de la auditoría (Edutin Academy)' },
    ],
    retirar: ['o9WP0VP0hTc', 'w0Rx5tMgl3o'],
  },
  {
    clase: 'Tipos de auditoría: primera, segunda y tercera parte, autoinspección e inspección regulatoria',
    agregar: [{ videoId: 'qD_YyI6l3TM', titulo: 'Generalidades de la auditoría (Edutin Academy)' }],
    retirar: ['izDKCtdOhgc'],
  },
  {
    clase: 'Resoluciones 1160 de 2016 y 3619 de 2013 como criterios de auditoría',
    agregar: [{ videoId: 'obKw0fE-15g', titulo: 'Introducción a las buenas prácticas de manufactura en la industria farmacéutica (Educación Continua Uniandes)' }],
  },
  {
    clase: 'La inspección INVIMA: certificaciones, actas y medidas sanitarias',
    agregar: [{ videoId: 'MOjuGSvHDd8', titulo: 'Sistema Nacional de Inspección, Vigilancia y Control y alcance de las visitas (Ministerio de Salud)' }],
  },
  // Unidad 2
  {
    clase: 'Introducción a la unidad: del auditor individual al programa de auditoría',
    renombrar: { fsNrrApdugw: 'Gestión de un programa de auditoría según ISO 19011 (Edutin Academy)' },
  },
  {
    clase: 'Auditoría basada en riesgos: priorización de áreas, procesos y proveedores',
    agregar: [{ videoId: '8iPGlicbaPA', titulo: 'Matriz de riesgo (Edutin Academy)' }],
  },
  {
    clase: 'Competencias, selección y evaluación de auditores (capítulo 7 ISO 19011)',
    renombrar: {
      Uymfz0ojbKw: 'Competencia y evaluación de los auditores según ISO 19011 (QMC Training)',
      SXbR3vSx4is: 'Competencias del auditor líder y de los auditores internos (Universidad ISO)',
    },
  },
  {
    clase: 'Ética, comunicación y comportamiento del auditor en campo',
    agregar: [{ videoId: 'iHEuIm1UO6E', titulo: 'Principios de auditoría: integridad, confidencialidad e independencia (Edutin Academy)' }],
    retirar: ['75CcxVxIG-c'],
  },
  // Unidad 3
  {
    clase: 'Introducción a la unidad: el ciclo de una auditoría individual',
    agregar: [{ videoId: 'CSa1FCiEHjE', titulo: 'Pasos iniciales para realizar una auditoría (Edutin Academy)' }],
    retirar: ['85hSWGF-v0I'],
  },
  {
    clase: 'Listas de verificación basadas en las guías de inspección INVIMA',
    renombrar: { aYO77Zm7AxA: 'Guía para hacer una lista de verificación de auditoría (ISO Tv Intercontinental)' },
  },
  {
    clase: 'La reunión de apertura',
    renombrar: { '4f9XFzj6Vy0': 'Cómo hacer la reunión de apertura de una auditoría (ISO Tv Intercontinental)' },
  },
  {
    clase: 'Técnicas de entrevista y recolección de evidencia objetiva',
    agregar: [{ videoId: 'HzsNkvCFbN4', titulo: 'Métodos de auditoría (Edutin Academy)' }],
    retirar: ['G41qM6d0iCk'],
  },
  {
    clase: 'Recorrido de planta y técnicas de muestreo',
    retirar: ['8ZXpr0tEoOk'],
  },
  {
    clase: 'Auditoría a proveedores y fabricantes por contrato',
    agregar: [
      { videoId: 'myE3Hy2Ti2U', titulo: 'Homologación de proveedores y auditorías de segunda parte (SGS Academy)' },
      { videoId: 'sBZgU1RlQX8', titulo: 'Evaluación de proveedores (SENA)' },
    ],
    retirar: ['Xkg4bmOdsVk'],
  },
  {
    clase: 'Auditorías remotas e híbridas',
    renombrar: { '2mky8XkL6d8': 'Cómo hacer una auditoría remota o virtual (ISO Tv Intercontinental)' },
  },
  // Unidad 4
  {
    clase: 'Introducción a la unidad: de la evidencia a la mejora',
    agregar: [{ videoId: 'jWULQNeRsKA', titulo: 'Conceptos de auditoría: criterios, evidencias, hallazgos y conclusiones (Edutin Academy)' }],
  },
  {
    clase: 'Redacción de hallazgos: no conformidad, observación y oportunidad de mejora',
    retirar: ['6TqjN7rkHgo'],
    renombrar: { '7IuLaADtscs': 'Redacción de hallazgos en una auditoría interna (ISO Tv Intercontinental)' },
  },
  {
    clase: 'Clasificación de hallazgos: crítico, mayor y menor',
    agregar: [{ videoId: '8izGVRyD__Q', titulo: 'Qué es un hallazgo de auditoría y cómo se clasifica (Edutin Academy)' }],
  },
  {
    clase: 'La reunión de cierre',
    agregar: [{ videoId: 'L0s4-569vmc', titulo: 'Proceso para realizar el cierre de una auditoría (Edutin Academy)' }],
    retirar: ['Wop9Sk7zXnk'],
  },
  {
    clase: 'Elaboración y distribución del informe de auditoría',
    agregar: [{ videoId: 'FQ5vfn2i0K8', titulo: 'Redacción de informes de auditoría (Auditool)' }],
  },
  {
    clase: 'Seguimiento y cierre de hallazgos: evaluación de planes de acción y verificación de eficacia',
    retirar: ['l3Na7s6y6Js'],
  },
  {
    clase: 'Evaluación y mejora del programa de auditoría',
    agregar: [{ videoId: 'JLPZQmXXJTo', titulo: 'ISO 9001, capítulo 9: evaluación del desempeño y auditoría interna (Edutin Academy, edición 2015)' }],
  },
  // Unidad 5
  {
    clase: 'Auditoría al servicio farmacéutico hospitalario y ambulatorio',
    agregar: [{ videoId: 'cx5ShUygdwY', titulo: 'Para qué sirve el PAMEC en las instituciones de salud (Asesorías en Habilitación)' }],
    retirar: ['tLsUIOW8xNw'],
  },
  {
    clase: 'Auditoría e inspección a droguerías y establecimientos farmacéuticos minoristas',
    agregar: [{ videoId: 'E4EVxBfn7BI', titulo: 'La auditoría interna obligatoria en farmacias y droguerías (Escuela Latinoamericana de Farmacia)' }],
    retirar: ['VGp1zBEAX8U'],
  },
  {
    clase: 'Preparación previa: autoinspección integral y alistamiento documental',
    agregar: [{ videoId: '5aJjfeYu57w', titulo: 'Estrategias para preparar y responder auditorías en un laboratorio farmacéutico (Iniciativas Empresariales)' }],
    retirar: ['7baR8uBHg20'],
  },
  {
    clase: 'Durante y después de la visita: atención al inspector, acta y plan de mejoramiento',
    agregar: [
      { videoId: 'WXm8nvVkGJs', titulo: 'Cómo afrontar auditorías e inspecciones de BPM' },
      { videoId: 'z-ODA5Ocy-0', titulo: 'Prepárate para la visita de la secretaría de salud (Club del Droguista)' },
    ],
    retirar: ['vzuTP6NltUg', '3qhZgh30M2Y'],
  },
  {
    clase: 'Caso integrador: simulacro de inspección BPM',
    agregar: [
      { videoId: 'UXasLRL4dNo', titulo: 'Recorrido por una guía de inspección de BPM (Digemid, Perú)' },
      { videoId: '8VJRnMtloNE', titulo: 'Simulacro de visita de inspección sanitaria (Club del Droguista)' },
    ],
    retirar: ['Mu_S9AcLpvs'],
  },
];

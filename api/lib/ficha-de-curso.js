/**
 * ============================================================
 *  ficha-de-curso.js — Un solo modelo para los 224 cursos
 *
 *  La plataforma tiene dos orígenes muy distintos: los cursos
 *  propios viven en aula_courses, con unidades, clases y recursos;
 *  los curados viven en courses, con metadatos del proveedor. Antes
 *  cada uno tenía su propia página, y por eso había tres plantillas
 *  que decían cosas distintas sobre lo mismo.
 *
 *  Aquí los dos se convierten en la MISMA forma, para que una sola
 *  plantilla los pinte. Lo que cambia entre un curso y otro no es la
 *  plantilla: son las `capacidades` (qué se puede hacer de verdad con
 *  este curso) y los datos que existan.
 *
 *  Regla que gobierna todo el archivo: lo que no se sabe va en null o
 *  en lista vacía, nunca en un valor de relleno. Una ficha que dice
 *  «4 horas» porque había que poner algo es peor que una que calla.
 * ============================================================
 */

import { EMISOR, horasDe } from './aula/certificados.js';

/** Dónde se estudia de verdad el curso. */
export const EN_EDVANTA = 'edvanta';
export const EN_PROVEEDOR = 'proveedor';

const PROVEEDORES = {
  edutin: { nombre: 'Edutin Academy', accion: 'Ir al curso en Edutin' },
  udemy: { nombre: 'Udemy', accion: 'Ver curso en Udemy' },
  coursera: { nombre: 'Coursera', accion: 'Ver curso en Coursera' },
};

const NIVELES = {
  basico: 'Básico', beginner: 'Básico',
  intermedio: 'Intermedio', intermediate: 'Intermedio',
  avanzado: 'Avanzado', advanced: 'Avanzado',
  mixed: 'Todos los niveles',
};

const IDIOMAS = { Spanish: 'Español', English: 'Inglés', Portuguese: 'Portugués' };

const MODALIDADES = {
  self_paced: 'A tu ritmo',
  asincronica: 'A tu ritmo',
  mixta: 'Mixta',
  scheduled: 'Con fechas',
};

const vacio = (v) => v === null || v === undefined || (typeof v === 'string' && !v.trim())
  || (Array.isArray(v) && !v.length);

/** Texto o null. Nunca cadena vacía, que luego se pinta como un hueco. */
const texto = (v) => (vacio(v) ? null : String(v).trim());

/** Entero positivo o null: un 0 de relleno se lee como «cero clases». */
const entero = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

/**
 * En qué estado está la certificación de este curso.
 *
 *  available             → confirmada, con quién la emite y qué pide.
 *  pending_confirmation  → no se sabe; no se anuncia ni gratis ni de pago.
 *  not_offered           → este curso no da certificado.
 *
 * Para los externos SIEMPRE es «por confirmar»: la columna
 * certificate_included vale true en los 176, pero es el valor por
 * defecto de la tabla, no un dato verificado. No hay fecha ni fuente
 * que lo respalde, así que anunciarlo sería inventar.
 */
function certificado({ propio, curso }) {
  if (propio) {
    // El aula lo emite al completar el curso (lib/aula/certificados.js):
    // con código, QR y verificación pública en /certificados/<código>.
    return {
      estado: 'available',
      emisor: `${EMISOR.nombre} (NIT ${EMISOR.nit})`,
      condiciones: 'Completa todas las clases obligatorias del curso y pídelo desde tu aula.',
      horas: horasDe(curso.duration_minutes),
      nota: 'Al completar el curso, Edvanta te expide tu certificado de aprobación: con tu nombre, el curso, sus horas y un código para verificarlo.',
    };
  }
  const p = PROVEEDORES[curso.provider];
  return {
    estado: 'pending_confirmation',
    emisor: p?.nombre || texto(curso.provider),
    condiciones: null,
    horas: null,
    nota: 'Las condiciones del certificado las define el proveedor. Consúltalas en su sitio antes de inscribirte.',
  };
}

/**
 * Qué se puede hacer de verdad con este curso.
 *
 * La plantilla pregunta por aquí en vez de mirar el proveedor: así, el
 * día que un externo tenga temario revisado, basta con encender la
 * capacidad y la ficha lo enseña sin tocar la página.
 */
function capacidades({ propio, temario, curso }) {
  return {
    // Solo los propios se cursan dentro; de los externos se sale al proveedor.
    inscribirse: propio,
    verTemario: temario.length > 0,
    // Comentarios y valoraciones: se habilitan cuando exista la tabla.
    comentarios: false,
    valoraciones: false,
    // Un externo sin enlace no tiene a dónde mandar a nadie.
    irAlProveedor: !propio && Boolean(texto(curso.affiliate_url) || texto(curso.original_url)),
  };
}

/** Un curso propio (aula_courses + su snapshot publicado) → ficha. */
export function fichaDeCursoPropio(curso, temario) {
  const clases = temario.reduce((n, u) => n + u.lessons.length, 0);
  return {
    id: `edvanta-${curso.id}`,
    variante: 'edvanta',
    dondeSeEstudia: EN_EDVANTA,
    proveedor: { clave: 'edvanta', nombre: 'Edvanta', imparte: 'Edvanta' },
    // La dirección pública (/curso-de-…). Sin slug todavía, la vieja, que redirige.
    url: curso.public_slug ? `/${curso.public_slug}` : `/curso/${curso.id}`,
    titulo: texto(curso.title),
    resumen: texto(curso.short_description),
    descripcionHtml: texto(curso.description_html),
    objetivo: texto(curso.objective),
    publico: texto(curso.audience),
    requisitos: texto(curso.prerequisites),
    // El archivo de curaduría no traía lista de resultados; traía un
    // objetivo general. Repetir el objetivo aquí sería decir dos veces
    // lo mismo con otro título.
    queAprenderas: Array.isArray(curso.learning_outcomes) ? curso.learning_outcomes.filter(Boolean) : [],
    categoria: texto(curso.category),
    area: texto(curso.area),
    nivel: NIVELES[curso.level] || null,
    idioma: 'Español',
    modalidad: MODALIDADES[curso.modality] || null,
    duracionMinutos: entero(curso.duration_minutes),
    unidades: temario.length || null,
    clases: clases || null,
    portada: texto(curso.cover_file_id ? `/api/cursos-edvanta/${curso.id}/portada` : curso.cover_url),
    autoria: texto(curso.author_name),
    temario,
    certificado: certificado({ propio: true, curso }),
    capacidades: capacidades({ propio: true, temario, curso }),
    // Valoraciones propias: todavía no hay dónde guardarlas.
    valoraciones: { promedio: null, total: 0, distribucion: null },
    // De proveedor: no aplica en un curso propio.
    valoracionesDelProveedor: null,
  };
}

/** Un curso curado (tabla courses) → la misma ficha. */
export function fichaDeCursoCurado(curso) {
  const p = PROVEEDORES[curso.provider] || { nombre: texto(curso.provider), accion: 'Ver el curso' };
  const enlace = texto(curso.affiliate_url) || texto(curso.original_url);
  return {
    id: `${curso.provider}-${curso.id}`,
    variante: curso.provider,
    dondeSeEstudia: EN_PROVEEDOR,
    proveedor: { clave: curso.provider, nombre: p.nombre, imparte: p.nombre, accion: p.accion, enlace },
    url: curso.public_slug ? `/${curso.public_slug}` : `/cursos/${curso.slug}`,
    // Referencia interna (opiniones, guardados): el slug de la tabla courses.
    referencia: curso.slug,
    titulo: texto(curso.title),
    resumen: texto(curso.short_description),
    descripcionHtml: null,
    objetivo: null,
    publico: null,
    requisitos: null,
    queAprenderas: Array.isArray(curso.skills) ? curso.skills.filter(Boolean) : [],
    categoria: texto(curso.category),
    area: texto(curso.professional_area),
    nivel: NIVELES[curso.level] || null,
    idioma: IDIOMAS[curso.language] || texto(curso.language),
    modalidad: MODALIDADES[curso.modality] || null,
    duracionMinutos: null,
    duracionTexto: texto(curso.duration),
    unidades: null,
    clases: null,
    portada: texto(curso.image_url),
    // El docente está vacío en los 176; la institución sí consta en 111.
    autoria: texto(curso.instructor) || texto(curso.institution),
    institucion: texto(curso.institution),
    // De los curados no hay temario revisado: enseñar uno inventado
    // sería lo peor que puede hacer esta página.
    temario: [],
    precio: {
      tipo: texto(curso.price_type),
      // Un precio sin fecha de verificación no se enseña como vigente.
      verificado: false,
    },
    certificado: certificado({ propio: false, curso }),
    capacidades: capacidades({ propio: false, temario: [], curso }),
    valoraciones: { promedio: null, total: 0, distribucion: null },
    // rating y review_count están vacíos en los 176: no hay nada que atribuir.
    valoracionesDelProveedor: null,
  };
}

/**
 * Qué le falta a esta ficha para estar completa.
 *
 * Se devuelve con la ficha para poder sacar el informe de huecos del
 * catálogo sin volver a recorrer la base, y para que la página sepa qué
 * secciones no tiene sentido pintar.
 */
export function huecosDeLaFicha(f) {
  const faltan = [];
  if (!f.resumen) faltan.push('resumen');
  if (!f.portada) faltan.push('portada');
  if (!f.nivel) faltan.push('nivel');
  if (!f.queAprenderas.length) faltan.push('queAprenderas');
  if (f.dondeSeEstudia === EN_EDVANTA) {
    if (!f.temario.length) faltan.push('temario');
    if (!f.objetivo) faltan.push('objetivo');
  } else {
    if (!f.proveedor.enlace) faltan.push('enlaceAlProveedor');
    if (!f.duracionTexto) faltan.push('duracion');
  }
  return faltan;
}

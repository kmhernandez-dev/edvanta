/**
 * ============================================================
 *  clase-publica.js — Las clases de los cursos propios, abiertas
 *
 *  Los cursos de Edvanta son gratuitos (se paga el certificado). Las
 *  clases que tienen un bloque «experiencia» se publican también fuera
 *  del aula, en:
 *
 *    /curso-de-<curso>/clase/<clase>
 *
 *  con el contenido completo escrito en el HTML (los buscadores no
 *  ejecutan JavaScript), sus datos estructurados y enlaces a la clase
 *  anterior, a la siguiente y al curso. Solo se publica lo que ya está
 *  en la versión publicada del curso: lo que quien estudia ve en el aula.
 *
 *  Las clases sin experiencia no tienen página pública: siguen siendo
 *  del aula.
 * ============================================================
 */
import { nombreDeCurso, resolverSlug } from './slugs-publicos.js';
import { caracteresDeExperiencia, faqDeExperiencia, htmlDeExperiencia, textoDeExperiencia } from './experiencia.js';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const rutaDeClase = (slugCurso, slugClase) => `/${slugCurso}/clase/${slugClase}`;

const experienciaDe = (leccion) => (leccion.blocks || []).find((b) => b.type === 'experiencia')?.data || null;

/** Slugs de las clases de un curso: Map(id → slug). */
async function slugsDeClases(db, courseId) {
  const { rows } = await db.query(
    'SELECT id, slug FROM aula_lessons WHERE course_id = $1 AND slug IS NOT NULL',
    [Number(courseId)],
  );
  return new Map(rows.map((r) => [Number(r.id), r.slug]));
}

/**
 * Clases públicas de un curso, en orden: las de la versión publicada
 * que tienen experiencia y slug.
 */
export async function clasesPublicas(db, courseId, snapshot) {
  const slugs = await slugsDeClases(db, courseId);
  const salida = [];
  (snapshot?.modules || []).forEach((m, mi) => {
    (m.lessons || []).forEach((l) => {
      const exp = experienciaDe(l);
      const slug = slugs.get(Number(l.id));
      if (exp && slug) {
        salida.push({ id: l.id, titulo: l.title, slug, unidad: m.title, unidadNumero: mi + 1, experiencia: exp });
      }
    });
  });
  return salida;
}

/** Map(id de clase → ruta pública) para enlazar desde el temario del curso. */
export async function rutasDeClasesPublicas(db, courseId, slugCurso, snapshot) {
  if (!slugCurso) return new Map();
  const clases = await clasesPublicas(db, courseId, snapshot);
  return new Map(clases.map((c) => [Number(c.id), rutaDeClase(slugCurso, c.slug)]));
}

/**
 * Datos de una clase pública a partir de los slugs de la dirección.
 * Devuelve null si el curso no es propio y público. Si el slug del
 * curso es del historial, `redirigir` trae la ruta vigente.
 */
export async function clasePublica(db, slugCurso, slugClase) {
  const r = await resolverSlug(db, slugCurso);
  if (!r || r.entidad !== 'aula') return null;
  // Import diferido: routes/courses.js también usa este módulo.
  const { SQL_CURSO_PUBLICO } = await import('../routes/courses.js');
  const { rows } = await db.query(SQL_CURSO_PUBLICO, [r.id]);
  const curso = rows[0];
  if (!curso) return null;
  const vigente = r.vigente || slugCurso;
  const clases = await clasesPublicas(db, curso.id, curso.snapshot);
  const i = clases.findIndex((c) => c.slug === slugClase);
  if (i < 0) return { curso: { id: curso.id, slug: vigente }, clase: null };
  if (!r.esVigente) return { redirigir: rutaDeClase(vigente, slugClase) };
  return {
    curso: {
      id: curso.id,
      slug: vigente,
      titulo: curso.title,
      nombre: nombreDeCurso(curso.title),
      categoria: curso.category,
      nivel: curso.level,
      resumen: curso.short_description || '',
      precioCertificado: curso.certificate_price == null ? null : Number(curso.certificate_price),
    },
    clase: clases[i],
    numero: i + 1,
    total: clases.length,
    anterior: clases[i - 1] ? { titulo: clases[i - 1].titulo, ruta: rutaDeClase(vigente, clases[i - 1].slug) } : null,
    siguiente: clases[i + 1] ? { titulo: clases[i + 1].titulo, ruta: rutaDeClase(vigente, clases[i + 1].slug) } : null,
    indice: clases.map((c) => ({ titulo: c.titulo, unidad: c.unidad, ruta: rutaDeClase(vigente, c.slug) })),
  };
}

/** Título para buscadores: la clase y el curso, sin pasar de ~65 caracteres si se puede. */
export function tituloDeClase(datos) {
  const clase = datos.clase.titulo;
  const largo = `${clase} | ${datos.curso.nombre} gratis`;
  return largo.length <= 68 ? largo : `${clase} | Edvanta`;
}

/** Descripción: la situación inicial recortada a 155 caracteres. */
export function descripcionDeClase(datos) {
  const base = textoDeExperiencia(datos.clase.experiencia);
  if (base.length <= 155) return base;
  const corte = base.slice(0, 152);
  return `${corte.slice(0, corte.lastIndexOf(' '))}…`;
}

/** Datos estructurados: LearningResource dentro del curso, migas y repaso. */
export function datosDeClase(datos, { canonical, cursoUrl, inicio }) {
  const exp = datos.clase.experiencia;
  const recurso = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `${canonical}#clase`,
    name: datos.clase.titulo,
    description: descripcionDeClase(datos),
    url: canonical,
    inLanguage: 'es-CO',
    learningResourceType: 'Clase',
    educationalLevel: datos.curso.nivel || undefined,
    isAccessibleForFree: true,
    timeRequired: exp.duracion ? `PT${exp.duracion}M` : undefined,
    teaches: exp.objetivos,
    keywords: exp.keywords?.length ? exp.keywords.join(', ') : undefined,
    isPartOf: { '@type': 'Course', '@id': `${cursoUrl}#curso`, name: datos.curso.nombre, url: cursoUrl },
    provider: { '@type': 'Organization', name: 'Edvanta', url: `${inicio}` },
    citation: exp.referencias.filter((r) => r.url).map((r) => ({ '@type': 'CreativeWork', name: r.cita, url: r.url })),
  };
  const migas = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: inicio },
      { '@type': 'ListItem', position: 2, name: 'Cursos', item: `${inicio}cursos` },
      { '@type': 'ListItem', position: 3, name: datos.curso.nombre, item: cursoUrl },
      { '@type': 'ListItem', position: 4, name: datos.clase.titulo, item: canonical },
    ],
  };
  return [recurso, migas, faqDeExperiencia(exp, canonical)].filter(Boolean);
}

/** La página completa en HTML (la reemplaza la aplicación al cargar). */
export function cuerpoDeClase(datos) {
  const { curso, clase } = datos;
  const cursoRuta = `/${curso.slug}`;
  return [
    `<nav aria-label="Ruta de navegación"><a href="/">Inicio</a> › <a href="/cursos">Cursos</a> › <a href="${esc(cursoRuta)}">${esc(curso.nombre)}</a> › <span>${esc(clase.titulo)}</span></nav>`,
    `<p>${esc(clase.unidad)} · Clase ${datos.numero} de ${datos.total}</p>`,
    `<h1>${esc(clase.titulo)}</h1>`,
    `<p>Clase gratuita del <a href="${esc(cursoRuta)}">${esc(curso.nombre)}</a> de Edvanta. Inscríbete gratis para seguir tu avance, presentar las evaluaciones y obtener tu certificado.</p>`,
    htmlDeExperiencia(clase.experiencia),
    `<nav aria-label="Otras clases">${datos.anterior ? `<a href="${esc(datos.anterior.ruta)}" rel="prev">Clase anterior: ${esc(datos.anterior.titulo)}</a>` : ''} ${datos.siguiente ? `<a href="${esc(datos.siguiente.ruta)}" rel="next">Clase siguiente: ${esc(datos.siguiente.titulo)}</a>` : ''}</nav>`,
    `<section><h2>Todas las clases abiertas del curso</h2><ol>${datos.indice.map((c) => `<li><a href="${esc(c.ruta)}">${esc(c.titulo)}</a></li>`).join('')}</ol></section>`,
  ].join('');
}

/** Para el JSON de la página en React. */
export function resumenDeClase(datos) {
  return {
    curso: datos.curso,
    clase: { id: datos.clase.id, titulo: datos.clase.titulo, slug: datos.clase.slug, unidad: datos.clase.unidad, unidadNumero: datos.clase.unidadNumero, experiencia: datos.clase.experiencia },
    numero: datos.numero,
    total: datos.total,
    anterior: datos.anterior,
    siguiente: datos.siguiente,
    indice: datos.indice,
    caracteres: caracteresDeExperiencia(datos.clase.experiencia),
  };
}

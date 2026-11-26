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
 *  Cada clase abierta muestra (17-nov-2026, pedido de Karla Hernández):
 *    - quién la verificó: Karla Hernández, química farmacéutica
 *      (revision-de-clases.js), también en WebPage.reviewedBy;
 *    - su video de YouTube con el crédito al canal y la licencia
 *      estándar de YouTube (videos-youtube.js);
 *    - la invitación al curso completo, que es donde está el certificado.
 *
 *  Las clases sin experiencia no tienen página pública: siguen siendo
 *  del aula.
 * ============================================================
 */
import { nombreDeCurso, resolverSlug } from './slugs-publicos.js';
import { caracteresDeExperiencia, faqDeExperiencia, htmlDeExperiencia, textoDeExperiencia } from './experiencia.js';
import { videosDeClase } from './videos-youtube.js';
import { REVISION_DE_CLASES, fechaLarga, personaRevisora } from './revision-de-clases.js';
import { htmlDeLecturasDeClase, lecturasDeClase, urlsAbsolutas } from './enlaces-de-salud.js';
import { busquedasDeClase } from './keywords-clases.js';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const rutaDeClase = (slugCurso, slugClase) => `/${slugCurso}/clase/${slugClase}`;

/**
 * Las páginas del vademécum y los artículos que enlazan a esta clase
 * (enlaces-de-salud.js), para enlazarlos de vuelta desde ella.
 */
export const lecturasDe = (datos) => datos.lecturas
  || lecturasDeClase(rutaDeClase(datos.curso.slug, datos.clase.slug));

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
        salida.push({
          id: l.id, titulo: l.title, slug, unidad: m.title, unidadNumero: mi + 1, experiencia: exp,
          videos: videosDeClase(l.blocks),
        });
      }
    });
  });
  return salida;
}

/**
 * Rutas de las clases abiertas de un curso: Map(id de la clase → ruta).
 * La ficha del curso las usa para enlazar cada clase de su temario.
 */
export async function rutasDeClasesAbiertas(db, courseId, snapshot, slugCurso) {
  if (!slugCurso) return new Map();
  const clases = await clasesPublicas(db, courseId, snapshot);
  return new Map(clases.map((c) => [Number(c.id), rutaDeClase(slugCurso, c.slug)]));
}

/** El temario con la ruta de cada clase abierta (las demás quedan sin enlace). */
export function enlazarTemario(temario, rutas) {
  if (!rutas?.size) return temario;
  return (temario || []).map((u) => ({
    ...u,
    lessons: (u.lessons || []).map((l) => (rutas.has(Number(l.id)) ? { ...l, ruta: rutas.get(Number(l.id)) } : l)),
  }));
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
  const modulos = curso.snapshot?.modules || [];
  const totalDelCurso = modulos.reduce((n, m) => n + (m.lessons || []).length, 0);
  return {
    curso: {
      id: curso.id,
      slug: vigente,
      titulo: curso.title,
      nombre: nombreDeCurso(curso.title),
      categoria: curso.category,
      nivel: curso.level,
      resumen: curso.short_description || '',
      portada: curso.cover_file_id ? `/api/cursos-edvanta/${curso.id}/portada` : (curso.cover_url || null),
      clases: totalDelCurso || null,
      unidades: modulos.length || null,
      precioCertificado: curso.certificate_price == null ? null : Number(curso.certificate_price),
    },
    clase: clases[i],
    numero: i + 1,
    total: clases.length,
    revision: REVISION_DE_CLASES,
    anterior: clases[i - 1] ? { titulo: clases[i - 1].titulo, ruta: rutaDeClase(vigente, clases[i - 1].slug) } : null,
    siguiente: clases[i + 1] ? { titulo: clases[i + 1].titulo, ruta: rutaDeClase(vigente, clases[i + 1].slug) } : null,
    indice: clases.map((c) => ({ titulo: c.titulo, unidad: c.unidad, ruta: rutaDeClase(vigente, c.slug) })),
    lecturas: lecturasDeClase(rutaDeClase(vigente, clases[i].slug)),
  };
}

// ── Título y descripción para buscadores ─────────────────────

const MAX_TITULO = 60;
const MAX_DESCRIPCION = 155;
const PALABRAS_DE_ENLACE = new Set(['y', 'e', 'o', 'u', 'no', 'de', 'del', 'la', 'las', 'el', 'los', 'en', 'con', 'por', 'para', 'a', 'al', 'según', 'sin', 'frente', 'vs', 'vs.', 'un', 'una', 'su', 'sus', 'que', 'como', 'entre']);

/**
 * Recorta en una palabra completa, sin dejar una palabra de enlace, un
 * paréntesis abierto ni puntuación al final.
 */
export function recortarFrase(texto, max) {
  const t = String(texto || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  let corte = t.slice(0, max + 1);
  corte = corte.slice(0, corte.lastIndexOf(' ') > 0 ? corte.lastIndexOf(' ') : max);
  // Un paréntesis que no alcanza a cerrarse se quita completo.
  const abierto = corte.lastIndexOf('(');
  if (abierto > corte.lastIndexOf(')')) corte = corte.slice(0, abierto);
  const palabras = corte.trim().split(' ');
  while (palabras.length) {
    const ultima = palabras[palabras.length - 1].replace(/[,;:·—–(-]+$/, '');
    if (!ultima || PALABRAS_DE_ENLACE.has(ultima.toLowerCase())) { palabras.pop(); continue; }
    palabras[palabras.length - 1] = ultima;
    break;
  }
  return palabras.join(' ');
}

/**
 * Títulos escritos a mano para clases de dos cursos cuyos nombres solo se
 * distinguen después del carácter 60: recortados quedarían iguales.
 * La prueba «ningún título repetido» (api/tests/experiencias.test.js)
 * avisa cuando aparece otro caso.
 */
const TITULOS_DISTINTOS = {
  'curso-de-farmacologia-cardiovascular/calcioantagonistas-dihidropiridinicos-y-no': 'Calcioantagonistas DHP y no DHP: farmacología',
  'curso-de-farmacoterapia-de-la-hipertension-arterial/calcioantagonistas-dihidropiridinicos-y-no': 'Calcioantagonistas en hipertensión: amlodipino',
  'curso-de-farmacoterapia-de-la-diabetes/sulfonilureas-y-pioglitazona-eficacia-hipoglucemia-peso': 'Sulfonilureas y pioglitazona: desintensificación',
  'curso-de-farmacologia-endocrina/sulfonilureas-y-pioglitazona-eficacia-hipoglucemia-peso': 'Sulfonilureas y pioglitazona: eficacia y riesgos',
};

/**
 * Título de 60 caracteres como máximo (la regla del sitio, src/lib/seo/titulos.js).
 * En orden: la clase con su curso; con el curso sin «Curso de» (dos cursos
 * pueden tener una clase con el mismo nombre); con la marca; lo mismo sin
 * lo que va entre paréntesis. Si nada cabe, la clase sola recortada en una
 * palabra completa: los 60 caracteres son para lo que distingue a la clase
 * (Google ya muestra el nombre del sitio).
 */
export function tituloDeClase(datos) {
  const propio = TITULOS_DISTINTOS[`${datos.curso.slug}/${datos.clase.slug}`];
  if (propio) return propio;
  const clase = String(datos.clase.titulo).replace(/\s+/g, ' ').trim();
  const sinParentesis = clase.replace(/\s*\([^)]*\)/g, '').trim();
  const curso = String(datos.curso.nombre || '').trim();
  const corto = curso.replace(/^curso\s+(de|del|en)\s+/i, '');
  const conSufijos = (t) => (curso ? [`${t} | ${curso}`, `${t} | ${corto}`, `${t} | Edvanta`] : [`${t} | Edvanta`]);
  for (const t of [...conSufijos(clase), clase, ...conSufijos(sinParentesis), sinParentesis]) {
    if (t.length <= MAX_TITULO) return t;
  }
  return recortarFrase(sinParentesis, MAX_TITULO);
}

const sinMarcas = (t) => String(t || '').replaceAll('**', '').replace(/\s+/g, ' ').trim();
const conPunto = (t) => (/[.!?…]$/.test(t) ? t : `${t}.`);

/** «Explicar el mecanismo» → «explicar el mecanismo» (si empieza con un verbo en infinitivo). */
function comoInfinitivo(objetivo) {
  const [primera, ...resto] = objetivo.split(' ');
  if (!/^[A-ZÁÉÍÓÚ][a-záéíóúñ]+(ar|er|ir)(lo|la|los|las|se)?$/.test(primera)) return null;
  return [primera.toLowerCase(), ...resto].join(' ');
}

/**
 * Descripción de 155 caracteres como máximo: el tema de la clase, lo que se
 * aprende (su primer objetivo), de qué curso es y quién la verificó. Se
 * prueban frases de la más completa a la más corta y se usa la primera que cabe.
 */
export function descripcionDeClase(datos) {
  const exp = datos.clase.experiencia;
  const clase = sinMarcas(datos.clase.titulo).replace(/[.;:]+$/, '');
  const objetivo = sinMarcas(exp.objetivos?.[0]).replace(/[.;:]+$/, '');
  const verbo = objetivo ? comoInfinitivo(objetivo) : null;
  const aprende = verbo
    ? `${clase}${clase.includes(':') ? '. Aprende a' : ': aprende a'} ${verbo}.`
    : (objetivo ? `${clase}. ${conPunto(objetivo)}` : `${clase}.`);
  const delCurso = `Clase del ${datos.curso.nombre}, verificada por una química farmacéutica.`;
  const gratis = 'Clase verificada por una química farmacéutica.';
  const opciones = [
    `${aprende} ${delCurso}`,
    `${aprende} ${gratis}`,
    `${clase}. ${delCurso}`,
    `${clase}. ${gratis}`,
  ];
  for (const d of opciones) {
    if (d.length <= MAX_DESCRIPCION && d.length >= 70) return d;
  }
  // Un título muy largo: recortado en palabra completa, con el cierre.
  const recortada = `${recortarFrase(clase, MAX_DESCRIPCION - gratis.length - 2)}. ${gratis}`;
  if (recortada.length >= 70) return recortada;
  const base = textoDeExperiencia(exp);
  if (base.length <= MAX_DESCRIPCION) return base;
  const corte = base.slice(0, MAX_DESCRIPCION - 3);
  return `${corte.slice(0, corte.lastIndexOf(' '))}…`;
}

/** Imagen de la clase: la portada del curso o, si no hay, la miniatura de su video. */
export function imagenDeClase(datos, inicio) {
  const portada = datos.curso.portada;
  if (portada) return portada.startsWith('/') ? `${String(inicio).replace(/\/$/, '')}${portada}` : portada;
  return datos.clase.videos?.[0]?.miniatura || null;
}

// ── Datos estructurados ─────────────────────────────────────

/** WebPage (con quién la verificó), LearningResource dentro del curso, migas y repaso. */
export function datosDeClase(datos, { canonical, cursoUrl, inicio }) {
  const exp = datos.clase.experiencia;
  const sitio = String(inicio).replace(/\/$/, '');
  const imagen = imagenDeClase(datos, inicio);
  const { vademecum, articulos } = lecturasDe(datos);
  const relacionadas = urlsAbsolutas([...vademecum, ...articulos], sitio);
  const pagina = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#pagina`,
    url: canonical,
    name: tituloDeClase(datos),
    description: descripcionDeClase(datos),
    inLanguage: 'es-CO',
    mainEntity: { '@id': `${canonical}#clase` },
    breadcrumb: { '@id': `${canonical}#migas` },
    reviewedBy: personaRevisora(sitio),
    lastReviewed: REVISION_DE_CLASES.fecha,
    primaryImageOfPage: imagen ? { '@type': 'ImageObject', url: imagen } : undefined,
    relatedLink: relacionadas.length ? relacionadas : undefined,
  };
  const recurso = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `${canonical}#clase`,
    name: datos.clase.titulo,
    description: descripcionDeClase(datos),
    url: canonical,
    image: imagen || undefined,
    inLanguage: 'es-CO',
    learningResourceType: 'Clase',
    educationalLevel: datos.curso.nivel || undefined,
    isAccessibleForFree: true,
    timeRequired: exp.duracion ? `PT${exp.duracion}M` : undefined,
    teaches: exp.objetivos?.map(sinMarcas),
    keywords: (() => {
      const ks = [...new Set([...(exp.keywords || []), ...busquedasDeClase(rutaDeClase(datos.curso.slug, datos.clase.slug))])];
      return ks.length ? ks.slice(0, 15).join(', ') : undefined;
    })(),
    position: datos.numero,
    isPartOf: { '@type': 'Course', '@id': `${cursoUrl}#curso`, name: datos.curso.nombre, url: cursoUrl },
    provider: { '@type': 'Organization', name: 'Edvanta', url: inicio },
    citation: exp.referencias.filter((r) => r.url).map((r) => ({ '@type': 'CreativeWork', name: r.cita, url: r.url })),
  };
  const migas = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#migas`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: inicio },
      { '@type': 'ListItem', position: 2, name: 'Cursos', item: `${sitio}/cursos` },
      { '@type': 'ListItem', position: 3, name: datos.curso.nombre, item: cursoUrl },
      { '@type': 'ListItem', position: 4, name: datos.clase.titulo, item: canonical },
    ],
  };
  return [pagina, recurso, migas, faqDeClase(exp, canonical, queSigueDeClase(datos))].filter(Boolean);
}

// ── Lo que sigue en el curso ────────────────────────────────

/**
 * Texto propio de cada clase que la sitúa dentro del curso completo: las
 * otras clases de su unidad, las unidades que siguen y preguntas sobre el
 * curso con certificado. Sale del índice del curso, así que cada página
 * dice algo distinto y enlaza a sus vecinas. No da precios: viven en la
 * ficha del curso.
 */
const enLista = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}`);

export function queSigueDeClase(datos) {
  const { curso, clase } = datos;
  const conCertificado = Number(curso.precioCertificado) > 0;
  const unidades = [];
  for (const c of datos.indice || []) {
    const u = unidades.at(-1);
    if (u && u.nombre === c.unidad) u.clases.push(c);
    else unidades.push({ nombre: c.unidad, clases: [c] });
  }
  const k = unidades.findIndex((u) => u.nombre === clase.unidad);
  const actual = rutaDeClase(curso.slug, clase.slug);
  const enUnidad = k >= 0 ? unidades[k].clases.filter((c) => c.ruta !== actual) : [];
  const despues = k >= 0 ? unidades.slice(k + 1) : [];
  const intro = `«${clase.titulo}» es la clase ${datos.numero} de ${datos.total} clases abiertas del ${curso.nombre}${k >= 0 && unidades.length > 1 ? ` y pertenece a «${clase.unidad}», la unidad ${k + 1} de ${unidades.length}` : ''}.`;
  const preguntas = [
    [
      `¿Esta clase tiene certificado?`,
      conCertificado
        ? `La clase es parte del ${curso.nombre}. El certificado se obtiene al completar el curso completo con certificado: todas las clases, quices, actividades con revisión docente y foros. Es verificable en edvanta.co/certificados con su código y QR.`
        : `La clase es parte del ${curso.nombre}. Al completar el curso en el aula emites un certificado verificable en edvanta.co/certificados con su código y QR.`,
    ],
    [
      `¿Puedo empezar el ${curso.nombre} gratis?`,
      conCertificado
        ? `Sí. Al inscribirte pruebas la primera unidad completa sin pagar. El curso completo con certificado suma acompañamiento por WhatsApp, revisión docente de tus actividades y certificado verificable.`
        : `Sí. El curso es gratis y el certificado no tiene costo.`,
    ],
  ];
  if (enUnidad.length || despues.length) {
    const partes = [];
    if (enUnidad.length) partes.push(`En la misma unidad ${enUnidad.length === 1 ? 'está' : 'están'} ${enLista(enUnidad.slice(0, 4).map((c) => `«${c.titulo}»`))}.`);
    if (despues.length) partes.push(`Después el curso sigue con ${enLista(despues.slice(0, 3).map((u) => `«${u.nombre}»`))}.`);
    preguntas.push([`¿Qué sigue después de esta clase?`, partes.join(' ')]);
  }
  preguntas.push([
    `¿El certificado es un título profesional?`,
    'No. Los cursos de Edvanta son educación informal según el Decreto 1075 de 2015: certifican lo que estudiaste, pero no otorgan títulos profesionales ni certificados de aptitud ocupacional.',
  ]);
  return { intro, enUnidad, despues: despues.map((u) => ({ nombre: u.nombre, clases: u.clases.length, ruta: u.clases[0].ruta })), preguntas, conCertificado };
}

/** Une las preguntas de repaso de la clase y las del curso en un solo FAQPage. */
function faqDeClase(exp, canonical, sigue) {
  const base = faqDeExperiencia(exp, canonical) || {
    '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${canonical}#preguntas`, mainEntity: [],
  };
  return {
    ...base,
    mainEntity: [
      ...base.mainEntity,
      ...sigue.preguntas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    ],
  };
}

/** HTML de «Lo que sigue en el curso». */
export function htmlDeQueSigue(sigue, curso) {
  const li = (c) => `<li><a href="${esc(c.ruta)}">${esc(c.titulo)}</a></li>`;
  return `<section id="que-sigue"><h2>Lo que sigue en el ${esc(curso.nombre)}</h2><p>${esc(sigue.intro)}</p>`
    + (sigue.enUnidad.length ? `<h3>Más clases de esta unidad</h3><ul>${sigue.enUnidad.slice(0, 6).map(li).join('')}</ul>` : '')
    + (sigue.despues.length ? `<h3>Unidades que siguen</h3><ul>${sigue.despues.map((u) => `<li><a href="${esc(u.ruta)}">${esc(u.nombre)}</a> (${u.clases} ${u.clases === 1 ? 'clase abierta' : 'clases abiertas'})</li>`).join('')}</ul>` : '')
    + `<h3>Preguntas sobre el curso</h3>${sigue.preguntas.map(([q, a]) => `<h4>${esc(q)}</h4><p>${esc(a)}</p>`).join('')}</section>`;
}

// ── HTML del servidor ───────────────────────────────────────

/** Verificación: quién revisó la clase y cuándo. */
export function htmlDeRevision(revision = REVISION_DE_CLASES) {
  return `<p class="revision">Verificada por <a href="${esc(revision.perfil)}">${esc(revision.nombre)}</a>, ${esc(revision.profesion.toLowerCase())} · Última revisión: <time datetime="${esc(revision.fecha)}">${esc(fechaLarga(revision.fecha))}</time></p>`;
}

/** El video con su crédito: canal, YouTube y la licencia estándar de YouTube. */
export function htmlDeVideo(v) {
  const canal = v.canal
    ? (v.canalUrl ? `<a href="${esc(v.canalUrl)}" rel="nofollow noopener" target="_blank">${esc(v.canal)}</a>` : esc(v.canal))
    : 'su autor';
  return `<figure class="video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(v.videoId)}?rel=0" title="${esc(v.titulo)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`
    + `<figcaption>Video: «${esc(v.titulo)}», de ${canal} en YouTube. <a href="${esc(v.licenciaUrl)}" rel="nofollow noopener" target="_blank">${esc(v.licencia)}</a>. Se reproduce con el reproductor oficial de YouTube; los derechos del video son de su autor. <a href="${esc(v.verEnYoutube)}" rel="nofollow noopener" target="_blank">Ver en YouTube</a></figcaption></figure>`;
}

/** La página completa en HTML (la reemplaza la aplicación al cargar). */
export function cuerpoDeClase(datos) {
  const { curso, clase } = datos;
  const cursoRuta = `/${curso.slug}`;
  const tamano = curso.clases ? `${curso.clases} clases` : `${datos.total} clases abiertas`;
  return [
    `<nav aria-label="Ruta de navegación"><a href="/">Inicio</a> › <a href="/cursos">Cursos</a> › <a href="${esc(cursoRuta)}">${esc(curso.nombre)}</a> › <span>${esc(clase.titulo)}</span></nav>`,
    `<p>${esc(clase.unidad)} · Clase ${datos.numero} de ${datos.total}</p>`,
    `<h1>${esc(clase.titulo)}</h1>`,
    htmlDeRevision(datos.revision),
    `<p>Clase del <a href="${esc(cursoRuta)}">${esc(curso.nombre)}</a> de Edvanta. Inscríbete para seguir tu avance, presentar las evaluaciones y obtener tu certificado verificable; la primera unidad del curso es gratis.</p>`,
    (clase.videos || []).length ? `<section id="video"><h2>Video de la clase</h2>${clase.videos.map(htmlDeVideo).join('')}</section>` : '',
    htmlDeExperiencia(clase.experiencia),
    `<nav aria-label="Otras clases">${datos.anterior ? `<a href="${esc(datos.anterior.ruta)}" rel="prev">Clase anterior: ${esc(datos.anterior.titulo)}</a>` : ''} ${datos.siguiente ? `<a href="${esc(datos.siguiente.ruta)}" rel="next">Clase siguiente: ${esc(datos.siguiente.titulo)}</a>` : ''}</nav>`,
    htmlDeLecturasDeClase(lecturasDe(datos)),
    htmlDeQueSigue(queSigueDeClase(datos), curso),
    `<section id="curso-completo"><h2>Sigue el ${esc(curso.nombre)} completo y certifícate</h2><p>El curso tiene ${esc(tamano)}${curso.unidades ? ` en ${curso.unidades} unidades` : ''}. En el aula guardas tu avance, presentas quizzes, actividades y foros, y al terminar emites tu certificado verificable.</p><p>Con el certificado tienes acompañamiento por WhatsApp y revisión de tus actividades. <a href="${esc(cursoRuta)}">Inscribirme al ${esc(curso.nombre)}</a></p></section>`,
    `<section><h2>Todas las clases abiertas del curso</h2><ol>${datos.indice.map((c) => `<li><a href="${esc(c.ruta)}">${esc(c.titulo)}</a></li>`).join('')}</ol></section>`,
  ].join('');
}

/** Para el JSON de la página en React: los datos y el mismo SEO que el HTML del servidor. */
export function resumenDeClase(datos, urls = null) {
  return {
    curso: datos.curso,
    clase: {
      id: datos.clase.id, titulo: datos.clase.titulo, slug: datos.clase.slug, unidad: datos.clase.unidad,
      unidadNumero: datos.clase.unidadNumero, experiencia: datos.clase.experiencia, videos: datos.clase.videos || [],
    },
    numero: datos.numero,
    total: datos.total,
    revision: datos.revision,
    anterior: datos.anterior,
    siguiente: datos.siguiente,
    indice: datos.indice,
    lecturas: lecturasDe(datos),
    sigue: queSigueDeClase(datos),
    caracteres: caracteresDeExperiencia(datos.clase.experiencia),
    seo: urls ? {
      titulo: tituloDeClase(datos),
      descripcion: descripcionDeClase(datos),
      imagen: imagenDeClase(datos, urls.inicio),
      jsonLd: datosDeClase(datos, urls),
    } : null,
  };
}

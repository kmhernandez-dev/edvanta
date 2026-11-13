/**
 * ============================================================
 *  html-de-ficha.js — La ficha de un curso, ya escrita en el HTML
 *
 *  La página de curso es de la aplicación (React), pero quien no
 *  ejecuta JavaScript —Bing, los rastreadores de IA, la primera pasada
 *  de Google— solo ve lo que trae el HTML. Antes traía el título y una
 *  línea; Search Console dejaba cientos de cursos en «Descubierta /
 *  Rastreada: actualmente sin indexar» porque no había nada que leer.
 *
 *  Aquí se escribe la misma ficha que pinta la aplicación, en HTML
 *  simple: resumen, datos clave, qué aprenderás, objetivo, descripción,
 *  público, requisitos, temario, certificado, preguntas frecuentes y
 *  cursos relacionados. La aplicación lo reemplaza al cargar
 *  (createRoot), así que no hay hidratación que pueda chocar.
 *
 *  Regla: lo mismo que dice la ficha, ni una palabra más. Lo que la
 *  ficha no sabe (null o lista vacía) no se escribe.
 * ============================================================
 */

import { descripcionDeCurso, resumenUtil } from './meta-seo.js';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };

/**
 * La descripción del curso viene en HTML del editor. Aquí se pasa a
 * párrafos de texto: ninguna etiqueta del original llega a la página
 * (ni scripts, ni estilos, ni atributos), solo su texto escapado.
 */
export function parrafosDeHtml(html) {
  const texto = String(html ?? '')
    .replace(/<(script|style|iframe|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|blockquote|tr|section|article)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#?[a-z0-9]+);/gi, (m, e) => {
      const clave = e.toLowerCase();
      if (ENTIDADES[clave] !== undefined) return ENTIDADES[clave];
      const n = /^#\d+$/.test(clave) ? Number(clave.slice(1)) : /^#x[0-9a-f]+$/.test(clave) ? Number.parseInt(clave.slice(2), 16) : NaN;
      return Number.isFinite(n) && n > 31 ? String.fromCodePoint(n) : ' ';
    });
  return texto
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').trim())
    .filter(Boolean);
}

/** «12,5 horas» a partir de las horas del certificado; null si no hay. */
function textoDeHoras(horas) {
  const h = Number(horas);
  if (!Number.isFinite(h) || h <= 0) return null;
  return `${String(h).replace('.', ',')} ${h === 1 ? 'hora' : 'horas'}`;
}

function duracionEnMinutos(minutos) {
  const m = Number(minutos) || 0;
  if (!m) return null;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const resto = m % 60;
  return resto ? `${h} h ${resto} min` : `${h} h`;
}

const pesos = (valor) => `$${Number(valor).toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP`;

/** Las mismas preguntas frecuentes de la ficha (FichaDeCurso.jsx). */
export function preguntasDeCurso(ficha, emisor) {
  const propio = ficha.dondeSeEstudia === 'edvanta';
  const certificado = {
    available: `Sí. Al completar todas las clases obligatorias, emites desde tu aula el certificado de aprobación de ${emisor}: con tu nombre, el curso, sus horas y un código para verificarlo en edvanta.co/certificados.`,
    pending_confirmation: `No lo tenemos confirmado. Las condiciones las define ${ficha.proveedor.nombre}; consúltalas en su sitio antes de inscribirte.`,
    not_offered: 'Este curso no incluye certificado.',
  }[ficha.certificado?.estado];
  return [
    {
      q: '¿Dónde se estudia este curso?',
      a: propio
        ? 'Dentro de Edvanta, en tu aula virtual. Te inscribes con tu cuenta y avanzas a tu ritmo.'
        : `En ${ficha.proveedor.nombre}. Edvanta lo seleccionó para su catálogo y te lleva hasta allí; la inscripción y las clases ocurren en su plataforma.`,
    },
    ...(certificado ? [{ q: '¿Da certificado?', a: certificado }] : []),
    { q: '¿Qué necesito para empezar?', a: ficha.requisitos || 'No hay requisitos declarados para este curso.' },
    ...(ficha.guia?.preguntas || []).map(([q, a]) => ({ q, a })),
    ...(propio ? [{
      q: '¿Qué recursos incluye?',
      a: 'Videos seleccionados, documentos oficiales de las entidades que los publican y textos de apoyo escritos para el curso. Cada recurso indica su fuente.',
    }] : []),
  ];
}

/** Lo que incluye el curso, en el mismo orden que la ficha. */
function datosClave(ficha) {
  const propio = ficha.dondeSeEstudia === 'edvanta';
  const horas = textoDeHoras(ficha.certificado?.horas) || duracionEnMinutos(ficha.duracionMinutos) || ficha.duracionTexto;
  const precio = Number(ficha.certificado?.precio) || 0;
  return [
    propio ? 'Lo imparte: Edvanta' : `Se estudia en ${ficha.proveedor.nombre}. Edvanta lo seleccionó; no lo imparte.`,
    !propio && ficha.institucion ? `Institución: ${ficha.institucion}` : null,
    ficha.unidades && ficha.clases
      ? `${ficha.unidades} unidades · ${ficha.clases} clases`
      : ficha.clases ? `${ficha.clases} clases` : ficha.unidades ? `${ficha.unidades} unidades` : null,
    horas ? `Duración: ${horas}` : null,
    ficha.nivel ? `Nivel ${ficha.nivel.toLowerCase()}` : null,
    ficha.idioma ? `Idioma: ${ficha.idioma}` : null,
    ficha.modalidad ? `Modalidad virtual: ${ficha.modalidad.toLowerCase()}` : 'Modalidad virtual',
    ficha.categoria ? `Área: ${ficha.categoria}` : null,
    propio
      ? (precio > 0 ? `Acceso gratis al contenido. Certificado de aprobación de Edvanta: ${pesos(precio)}.` : 'Acceso gratis al contenido.')
      : null,
  ].filter(Boolean);
}

const lista = (items) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
const seccion = (titulo, html) => (html ? `<section><h2>${esc(titulo)}</h2>${html}</section>` : '');

/**
 * El <main> de la página de curso.
 *  ficha        la de fichaDeCursoPropio / fichaDeCursoCurado
 *  nombre       el título visible («Curso de …»)
 *  relacionados [{ slug, titulo }] de la misma área
 *  emisor       quién expide el certificado (EMISOR.nombre)
 */
export function cuerpoDeCurso(ficha, { nombre, relacionados = [], emisor = 'Edvanta' } = {}) {
  const propio = ficha.dondeSeEstudia === 'edvanta';
  const temario = (ficha.temario || []).filter((u) => u && u.title);
  const descripcion = propio ? parrafosDeHtml(ficha.descripcionHtml) : [];
  const certificado = ficha.certificado || {};
  const partes = [
    `<nav aria-label="Ruta de navegación"><a href="/">Inicio</a> › <a href="/cursos">Cursos</a> › <span>${esc(nombre)}</span></nav>`,
    `<h1>${esc(nombre)}</h1>`,
    ficha.resumen ? `<p>${esc(ficha.resumen)}</p>` : '',
    seccion('Este curso incluye', lista(datosClave(ficha))),
    ficha.queAprenderas?.length ? seccion('Qué aprenderás', lista(ficha.queAprenderas)) : '',
    ficha.guia ? seccion('Para qué te sirve en el trabajo farmacéutico', `<p>${esc(ficha.guia.porQue)}</p>`) : '',
    ficha.guia ? seccion('Cómo lo aplicas', lista(ficha.guia.aplicaciones)) : '',
    ficha.guia ? seccion('Para quién es', lista(ficha.guia.paraQuien)) : '',
    ficha.guia ? seccion('Compleméntalo en Edvanta', `<ul>${ficha.guia.complementa.map(([t, u]) => `<li><a href="${esc(u)}">${esc(t)}</a></li>`).join('')}</ul>`) : '',
    ficha.objetivo ? seccion('Objetivo del curso', `<p>${esc(ficha.objetivo)}</p>`) : '',
    descripcion.length ? seccion('Descripción', descripcion.map((p) => `<p>${esc(p)}</p>`).join('')) : '',
    ficha.publico ? seccion('¿A quién está dirigido?', `<p>${esc(ficha.publico)}</p>`) : '',
    ficha.requisitos ? seccion('Qué necesitas antes', `<p>${esc(ficha.requisitos)}</p>`) : '',
    temario.length
      ? seccion('Temario', `<ol>${temario.map((u) => `<li><h3>${esc(u.title)}</h3>${
        (u.lessons || []).length ? lista(u.lessons.map((l) => l.title).filter(Boolean)) : ''}</li>`).join('')}</ol>`)
      : '',
    certificado.nota
      ? seccion(certificado.estado === 'available' ? 'Certificado de aprobación' : `Certificado de ${ficha.proveedor.nombre}`,
        `<p>${esc(certificado.nota)}</p>${certificado.condiciones ? `<p>${esc(certificado.condiciones)}</p>` : ''}`)
      : '',
    seccion('Preguntas frecuentes', preguntasDeCurso(ficha, emisor).map((p) => `<h3>${esc(p.q)}</h3><p>${esc(p.a)}</p>`).join('')),
    relacionados.length
      ? seccion('Cursos relacionados', `<ul>${relacionados.map((r) => `<li><a href="/${esc(r.slug)}">${esc(r.titulo)}</a></li>`).join('')}</ul>`)
      : '',
    '<p><a href="/cursos">Ver todos los cursos</a></p>',
  ];
  return `<main class="mx-auto max-w-3xl px-4 py-10"><div class="ed-prose">${partes.filter(Boolean).join('')}</div></main>`;
}

/**
 * El modelo de acceso de un curado, según el catálogo (price_type), en
 * las categorías de oferta que reconoce Google para los cursos. Edutin y
 * la auditoría de Coursera se estudian sin costo con certificado de pago.
 */
const CATEGORIA_DE_OFERTA = {
  free: 'Free',
  free_audit: 'Partially Free',
  subscription: 'Subscription',
  paid: 'Paid',
};

/**
 * La descripción del curso para los datos estructurados, nunca vacía:
 * el resumen propio si dice algo, la guía editorial de Edvanta o, si no
 * hay nada más, la misma descripción de la página.
 */
function descripcionParaDatos(ficha, nombre) {
  return resumenUtil(ficha.resumen) || ficha.guia?.porQue || descripcionDeCurso(ficha, nombre);
}

/**
 * Datos del curso para Google (schema.org/Course). Solo lo que consta:
 * en los propios, la oferta gratuita y la instancia en línea; en los
 * curados, el modelo de acceso que registra el catálogo y la modalidad.
 */
export function datosDeCurso(ficha, { nombre, canonical, imagen, horas }) {
  const propio = ficha.dondeSeEstudia === 'edvanta';
  const datos = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: nombre,
    description: descripcionParaDatos(ficha, nombre),
    url: canonical,
    inLanguage: ficha.idioma === 'Inglés' ? 'en' : ficha.idioma === 'Portugués' ? 'pt' : 'es',
    ...(imagen ? { image: imagen } : {}),
    provider: { '@type': 'Organization', name: ficha.proveedor.nombre, ...(propio ? { sameAs: 'https://edvanta.co' } : {}) },
    ...(ficha.nivel ? { educationalLevel: ficha.nivel } : {}),
    ...(ficha.queAprenderas?.length ? { teaches: ficha.queAprenderas.slice(0, 12) } : {}),
  };
  if (propio) {
    const h = Number(horas);
    // El contenido es gratis; si el certificado se paga, el curso es
    // «parcialmente gratis» y así se declara.
    const precioCertificado = Number(ficha.certificado?.precio) || 0;
    datos.isAccessibleForFree = true;
    datos.offers = precioCertificado > 0
      ? { '@type': 'Offer', category: 'Partially Free', url: canonical }
      : { '@type': 'Offer', category: 'Free', price: 0, priceCurrency: 'COP', url: canonical };
    datos.hasCourseInstance = {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      ...(Number.isFinite(h) && h > 0 ? { courseWorkload: `PT${Math.round(h * 60)}M` } : {}),
    };
    if (ficha.temario?.length) {
      datos.syllabusSections = ficha.temario.filter((u) => u?.title).map((u) => ({ '@type': 'Syllabus', name: u.title }));
    }
  } else {
    const categoria = CATEGORIA_DE_OFERTA[ficha.precio?.tipo];
    if (categoria) datos.offers = { '@type': 'Offer', category: categoria, url: canonical };
    // Edutin, Coursera y Udemy son plataformas en línea.
    datos.hasCourseInstance = { '@type': 'CourseInstance', courseMode: 'Online' };
  }
  return datos;
}

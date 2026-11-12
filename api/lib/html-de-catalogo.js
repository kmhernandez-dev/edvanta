/**
 * ============================================================
 *  html-de-catalogo.js — /cursos y /cursos/<plataforma>, ya escritos
 *
 *  El catálogo es de la aplicación (React) y llega vacío en el HTML: los
 *  buscadores que no ejecutan JavaScript no encontraban ni un enlace a
 *  las 238 fichas de curso, solo el sitemap. Aquí se escribe la lista
 *  completa, agrupada por área, con la plataforma y el modelo de acceso
 *  de cada curso, más la lista de cursos para los datos estructurados
 *  (schema.org/ItemList). La aplicación lo reemplaza al cargar.
 *
 *  Regla: solo lo que dice el catálogo. Nada de precios ni fechas.
 * ============================================================
 */

import { nombreDeCurso } from './slugs-publicos.js';
import { resumenUtil } from './meta-seo.js';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const PLATAFORMAS = {
  edvanta: { nombre: 'Edvanta', ruta: null },
  coursera: { nombre: 'Coursera', ruta: '/cursos/coursera' },
  edutin: { nombre: 'Edutin Academy', ruta: '/cursos/edutin' },
  udemy: { nombre: 'Udemy', ruta: '/cursos/udemy' },
};

/** Cómo se accede a cada curso, según el catálogo. */
const ACCESO = {
  edvanta: 'gratis, con certificado opcional',
  free: 'gratis',
  free_audit: 'sin costo; el certificado es de pago',
  subscription: 'por suscripción',
  paid: 'de pago',
};

/** Las áreas del catálogo, en orden. La primera que coincide gana. */
export const AREAS_DEL_CATALOGO = [
  ['gestion', 'Gestión, proyectos y operaciones', (c) => /^gesti[oó]n empresarial/i.test(c)],
  ['regulatorio', 'Asuntos regulatorios', (c) => /regulator/i.test(c)],
  ['calidad', 'Calidad, BPM e industria farmacéutica', (c) => /calidad|manufactura|industria farmac|iso|auditor|mejora de procesos/i.test(c)],
  ['salud', 'Farmacología, farmacoterapia y salud', (c) => /farmacolog|farmacoterapia|servicio farmac|servicio al paciente|salud|medicina|tiroides/i.test(c)],
  ['datos', 'Datos, inteligencia artificial y tecnología', (c) => /datos|inteligencia artificial|^ia\b|power bi|excel|programaci|tecnolog/i.test(c)],
  ['gestion', 'Gestión, proyectos y operaciones', (c) => /gesti[oó]n|proyectos|log[ií]stica|seguridad|operaciones|supply/i.test(c)],
  ['comunicacion', 'Comunicación, liderazgo y marketing', (c) => /comunicaci|oratoria|presentaciones|liderazgo|marketing|ventas/i.test(c)],
  ['idiomas', 'Idiomas', (c) => /idioma/i.test(c)],
  ['otras', 'Otras áreas profesionales', () => true],
];

const ORDEN = ['calidad', 'regulatorio', 'salud', 'datos', 'gestion', 'comunicacion', 'idiomas', 'otras'];
const NOMBRE_DE_AREA = Object.fromEntries(AREAS_DEL_CATALOGO.map(([k, n]) => [k, n]));

export function areaDeCategoria(categoria) {
  const c = String(categoria ?? '').trim();
  return (AREAS_DEL_CATALOGO.find(([, , prueba]) => prueba(c)) || AREAS_DEL_CATALOGO.at(-1))[0];
}

/** La primera frase de un resumen útil, para los cursos propios. */
function fraseDe(resumen) {
  const t = resumenUtil(resumen);
  if (!t) return '';
  const m = t.match(/^.+?[.!?](?=\s|$)/);
  const f = m ? m[0] : t;
  return f.length <= 180 ? f : '';
}

/**
 * Normaliza las filas de la base: { ruta, titulo, plataforma, categoria,
 * resumen, acceso }. La plataforma es 'edvanta' en los propios.
 */
export function cursosDelCatalogo(filas = []) {
  return filas
    .filter((f) => f?.ruta && f?.titulo)
    .map((f) => ({
      ruta: f.ruta.startsWith('/') ? f.ruta : `/${f.ruta}`,
      nombre: nombreDeCurso(f.titulo),
      plataforma: PLATAFORMAS[f.plataforma] ? f.plataforma : 'otra',
      area: areaDeCategoria(f.categoria),
      frase: f.plataforma === 'edvanta' ? fraseDe(f.resumen) : '',
      acceso: ACCESO[f.plataforma === 'edvanta' ? 'edvanta' : f.acceso] || null,
    }))
    .sort((a, b) => (a.plataforma === 'edvanta') !== (b.plataforma === 'edvanta')
      ? (a.plataforma === 'edvanta' ? -1 : 1)
      : a.nombre.localeCompare(b.nombre, 'es'));
}

const INTRO = {
  '': (n) => [
    `Edvanta reúne ${n.total} cursos en línea para químicos farmacéuticos, regentes, estudiantes y equipos de salud. ${n.edvanta} son cursos propios de Edvanta: se estudian gratis, con clases, casos, evaluaciones y certificado verificable opcional. Los otros ${n.total - n.edvanta} son cursos de Coursera, Edutin Academy y Udemy que el equipo editorial seleccionó y explica en su ficha: para qué sirve el tema en el trabajo farmacéutico, a quién le sirve y con qué cursos gratis se complementa.`,
    'Los cursos están ordenados por área profesional. Los de otras plataformas se estudian allá, con sus propias condiciones de precio y de certificado; algunos enlaces de esas fichas son de afiliado.',
  ],
  coursera: () => [
    'Coursera ofrece cursos y programas de universidades y empresas. Muchos permiten ver el material sin pagar (la modalidad de auditoría) y cobran por el certificado; los certificados profesionales y las especializaciones se pagan con una suscripción mensual.',
    'Esta es la selección de Edvanta para el trabajo farmacéutico. Cada ficha explica para qué sirve el tema y con qué cursos gratis de Edvanta se complementa. Confirma en Coursera el precio y las condiciones vigentes.',
  ],
  edutin: () => [
    'Edutin Academy ofrece cursos en línea en español que se toman sin costo; el certificado es de pago. Son una buena puerta de entrada a temas de gestión, datos, salud e idiomas.',
    'Esta es la selección de Edvanta para profesionales de la salud y la farmacia. Cada ficha explica para qué sirve el tema y con qué cursos gratis de Edvanta se complementa. Confirma en Edutin el precio vigente del certificado.',
  ],
  udemy: () => [
    'Udemy reúne cursos de pago, con descuentos frecuentes, dictados por instructores independientes. En temas farmacéuticos hay cursos especializados en inglés de calidad, buenas prácticas de manufactura, asuntos regulatorios y farmacovigilancia.',
    'Esta es la selección de Edvanta. Antes de comprar, revisa en Udemy la fecha de la última actualización de cada curso. Los enlaces son de afiliado.',
  ],
};

const TITULOS = {
  '': 'Cursos online de farmacia, calidad y asuntos regulatorios',
  coursera: 'Cursos de Coursera para farmacéuticos',
  edutin: 'Cursos de Edutin Academy para farmacéuticos',
  udemy: 'Cursos de Udemy para farmacéuticos',
};

/** El cuerpo del catálogo (o de una plataforma) en HTML simple. */
export function cuerpoDeCatalogo(cursos, { plataforma = '' } = {}) {
  const lista = plataforma ? cursos.filter((c) => c.plataforma === plataforma) : cursos;
  const n = { total: lista.length, edvanta: lista.filter((c) => c.plataforma === 'edvanta').length };
  const intro = (INTRO[plataforma] || INTRO[''])(n).map((p) => `<p>${esc(p)}</p>`).join('');
  const porArea = ORDEN
    .map((area) => [area, lista.filter((c) => c.area === area)])
    .filter(([, l]) => l.length);
  const item = (c) => {
    const plat = PLATAFORMAS[c.plataforma]?.nombre;
    const datos = [plat, c.acceso].filter(Boolean).join(', ');
    return `<li><a href="${esc(c.ruta)}">${esc(c.nombre)}</a>${datos ? ` — ${esc(datos)}` : ''}${c.frase ? `. ${esc(c.frase)}` : ''}</li>`;
  };
  const secciones = porArea.map(([area, l]) => `<section><h2>${esc(NOMBRE_DE_AREA[area])} (${l.length})</h2><ul>${l.map(item).join('')}</ul></section>`);
  const otras = Object.entries(PLATAFORMAS)
    .filter(([k, v]) => v.ruta && k !== plataforma)
    .map(([, v]) => `<a href="${v.ruta}">Cursos de ${esc(v.nombre)}</a>`);
  const pie = [
    plataforma ? '<a href="/cursos">Todos los cursos</a>' : null,
    ...otras,
    '<a href="/recursos-para-estudiantes-de-quimica-farmaceutica">Recursos gratis para estudiantes</a>',
    '<a href="/articulos/categoria/mejores-cursos">Guías de mejores cursos</a>',
  ].filter(Boolean);
  return `<main class="mx-auto max-w-3xl px-4 py-10"><div class="ed-prose"><h1>${esc(TITULOS[plataforma] || TITULOS[''])}</h1>${intro}${secciones.join('')}<p>${pie.join(' · ')}</p></div></main>`;
}

/** schema.org/ItemList con la dirección de cada curso (resumen del catálogo). */
export function listaDeCursos(cursos, { sitio, plataforma = '' } = {}) {
  const lista = plataforma ? cursos.filter((c) => c.plataforma === plataforma) : cursos;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITULOS[plataforma] || TITULOS[''],
    numberOfItems: lista.length,
    itemListElement: lista.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${sitio}${c.ruta}`, name: c.nombre })),
  };
}

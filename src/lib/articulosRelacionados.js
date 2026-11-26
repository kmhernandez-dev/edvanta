/**
 * ============================================================
 *  articulosRelacionados.js — Enlaces de vuelta a los artículos de la
 *  tanda del 26-nov-2026 (500 blogs de cursos y 1.000 de vademécum,
 *  cursos y comunidades)
 *
 *  Cada artículo de la tanda enlaza su curso, su monografía o su grupo
 *  de apoyo, pero ninguna de esas páginas los enlazaba de vuelta: Google
 *  solo los encontraba en el sitemap y en /articulos (2.000+ enlaces en
 *  una sola página). Aquí se calcula, por página, la lista de artículos
 *  que le corresponden para enlazarlos desde:
 *    /vademecum/:slug      → vademecum-<slug>-<ángulo>
 *    /comunidades/:slug    → comunidad-<slug>-<ángulo>
 *    /curso-de-… (API)     → los blogs con curso.url y curso-<base>-<ángulo>
 *
 *  Funciones puras: las usan las páginas de React, el prerender
 *  (scripts/seo-rutas-fijas.mjs) y scripts/generar-articulos-de-cursos.mjs,
 *  que escribe la lista que lee la API (api/data/articulos-de-cursos.json).
 * ============================================================
 */

export const ANGULOS_VADEMECUM = ['farmacologia', 'seguridad', 'atencion-farmaceutica', 'para-comunidades'];
export const ANGULOS_COMUNIDAD = ['como-participar', 'como-acompanar', 'preguntas-frecuentes', 'recursos-vademecum-curso', 'taller-educativo'];
export const ANGULOS_CURSO = ['con-vademecum', 'con-comunidad', 'evidencia-aprendizaje', 'preguntas-vademecum-comunidad', 'ruta-30-dias-comunidad', 'taller-educativo'];

const resumen = (a) => ({ slug: a.slug, titulo: a.title });

/** Busca los slugs en el orden dado; los que no existen se omiten. */
function porSlugs(slugs, lista) {
  const porSlug = new Map((lista || []).map((a) => [a.slug, a]));
  return slugs.map((s) => porSlug.get(s)).filter(Boolean).map(resumen);
}

/** Los artículos de estudio de una monografía del vademécum. */
export const articulosDeMonografia = (slug, lista) => porSlugs(ANGULOS_VADEMECUM.map((a) => `vademecum-${slug}-${a}`), lista);

/** Las guías de un grupo de apoyo (comunidad de pacientes). */
export const articulosDeComunidad = (slug, lista) => porSlugs(ANGULOS_COMUNIDAD.map((a) => `comunidad-${slug}-${a}`), lista);

/**
 * Los artículos de un curso, por su ruta pública (/curso-de-… o
 * /curso-para-…): los blogs que lo declaran en curso.url y los de
 * curso-<base>-<ángulo>.
 */
export function articulosDeCurso(ruta, lista) {
  const base = String(ruta || '').replace(/^\/curso-(?:de|para)-/, '');
  if (!base || base === ruta) return [];
  // Los de vademécum también declaran curso.url (el de su área: oncología
  // tendría 160+), pero se enlazan desde su monografía, no desde aquí.
  const blogs = (lista || []).filter((a) => a.curso?.url === ruta && !a.fuente).map(resumen);
  const integrados = porSlugs(ANGULOS_CURSO.map((a) => `curso-${base}-${a}`), lista);
  const vistos = new Set();
  return [...blogs, ...integrados].filter((a) => (vistos.has(a.slug) ? false : vistos.add(a.slug)));
}

/** Todas las rutas de curso que tienen artículos, con su lista. */
export function articulosPorCurso(lista) {
  const rutas = new Set((lista || []).map((a) => a.curso?.url).filter((u) => /^\/curso-(?:de|para)-/.test(u || '')));
  const mapa = {};
  for (const ruta of [...rutas].sort()) {
    const arts = articulosDeCurso(ruta, lista);
    if (arts.length) mapa[ruta] = arts;
  }
  return mapa;
}

/**
 * Las 7 guías generales de la tanda (fuente «hub»): se enlazan desde
 * /comunidades. Van escritas aquí para no cargar en esa página los 2 MB de
 * vademecumArticulos1000.js; la prueba verifica que sigan iguales.
 */
export const HUBS_DE_LA_TANDA = [
  { slug: 'mapa-vademecum-cursos-comunidades', titulo: 'Mapa del vademécum, los cursos y las comunidades de pacientes' },
  { slug: 'privacidad-reglas-comunidades-pacientes', titulo: 'Privacidad y reglas en comunidades de pacientes: guía práctica' },
  { slug: 'ruta-lideres-comunidades-pacientes', titulo: 'Ruta de formación para líderes de comunidades de pacientes' },
  { slug: 'preguntas-vademecum-cursos-comunidades', titulo: 'Preguntas frecuentes: vademécum, cursos y comunidades' },
  { slug: 'como-usar-vademecum-con-cursos', titulo: 'Cómo usar el vademécum mientras estudias un curso' },
  { slug: 'taller-educativo-vademecum-curso-comunidad', titulo: 'Cómo preparar un taller educativo con vademécum, curso y comunidad' },
  { slug: 'evidencia-aprendizaje-vademecum-cursos', titulo: 'Cómo documentar lo aprendido con vademécum, cursos y comunidad' },
];
export const TITULO_HUBS = 'Guías sobre grupos de apoyo, vademécum y cursos';
export const TITULO_ARTICULOS_COMUNIDAD_QF = 'Artículos de la comunidad farmacéutica';

/** Los títulos de las secciones, iguales en React y en el HTML estático. */
export const TITULO_GUIAS_COMUNIDAD = 'Guías del grupo de apoyo';
export const TEXTO_GUIAS_COMUNIDAD = 'Cómo participar, cómo acompañar, preguntas frecuentes, recursos y taller educativo del grupo.';
export const tituloArticulosMonografia = (nombre) => `Artículos para estudiar ${nombre}`;

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** La sección HTML (prerender y API) con la lista; vacía si no hay. */
export function htmlDeArticulos(titulo, articulos, intro = '') {
  if (!articulos?.length) return '';
  return `<section id="articulos-relacionados"><h2>${esc(titulo)}</h2>${intro ? `<p>${esc(intro)}</p>` : ''}<ul>${articulos.map((a) => `<li><a href="/articulos/${esc(a.slug)}">${esc(a.titulo)}</a></li>`).join('')}</ul></section>`;
}

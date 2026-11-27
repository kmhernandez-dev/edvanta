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
export const ANGULOS_CURSO_ESTUDIANTE = ['preparar-parcial', 'preguntas-examen', 'glosario', 'ruta-7-dias', 'practicas-empleo', 'errores-estudiante', 'mapa-conceptual', 'curso-vs-materia'];

const resumen = (a) => ({ slug: a.slug, titulo: a.title });

/**
 * «Sigue leyendo»: los vecinos de cada artículo en su categoría, en anillo
 * (siguiente, anterior, el que sigue, el que antecede…).
 *
 * Antes todos los artículos de una categoría enlazaban a los mismos 4
 * primeros: en el HTML estático, 2.265 artículos tenían un solo enlace
 * entrante (27-nov-2026) y Google los dejaba en «Descubierta: actualmente
 * sin indexar». En anillo, cada artículo recibe tantos enlaces como
 * muestra (si su categoría tiene con quién), sin cambiar de tema.
 *
 * crearVecinos(lista, clave) prepara los índices una vez; devuelve
 * (articulo, n) => hasta n de la misma categoría. `clave` agrupa (por
 * defecto `category`; las fichas de /medicamentos usan `clase` y la
 * biblioteca de /salud `categoria`).
 */
export function crearVecinos(lista = [], clave = (a) => a?.category) {
  const porCategoria = new Map();
  for (const a of lista) {
    const k = clave(a) || '';
    if (!porCategoria.has(k)) porCategoria.set(k, []);
    porCategoria.get(k).push(a);
  }
  const posicion = new Map();
  for (const l of porCategoria.values()) l.forEach((a, i) => { if (!posicion.has(a.slug)) posicion.set(a.slug, i); });
  return (art, n = 4) => {
    const l = porCategoria.get(clave(art) || '') || [];
    const i = posicion.get(art?.slug);
    if (i === undefined || l.length < 2) return [];
    const cuantos = Math.min(n, l.length - 1);
    const out = [];
    for (let d = 1; out.length < cuantos && d < l.length; d++) {
      for (const j of [(i + d) % l.length, ((i - d) % l.length + l.length) % l.length]) {
        const v = l[j];
        if (out.length < cuantos && v.slug !== art.slug && !out.includes(v)) out.push(v);
      }
    }
    return out;
  };
}

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
  const estudiantes = porSlugs(ANGULOS_CURSO_ESTUDIANTE.map((a) => `estudiante-${base}-${a}`), lista);
  const vistos = new Set();
  return [...blogs, ...integrados, ...estudiantes].filter((a) => (vistos.has(a.slug) ? false : vistos.add(a.slug)));
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

/**
 * Series: cada artículo generado pertenece a una colección con su página
 * pilar (27-nov-2026, «indexa todo de manera organizada»):
 *   curso      → los artículos del curso (blogs, integrados y de
 *                estudiantes) y la ficha /curso-de-…
 *   monografía → vademecum-<slug>-<ángulo> y /vademecum/<slug>
 *   grupo      → comunidad-<slug>-<ángulo> y /comunidades/<slug>
 *   materia    → los 10 de la materia y /recursos-para-estudiantes-…
 * Google ve colecciones temáticas con su pilar, no miles de páginas sueltas.
 *
 * crearSeries(lista) prepara los grupos una vez; devuelve
 * (articulo) => { titulo, pilar: { nombre, ruta }, articulos, actual } o null.
 */
export function crearSeries(lista = []) {
  const reVademecum = new RegExp(`^vademecum-(.+)-(${ANGULOS_VADEMECUM.join('|')})$`);
  const reComunidad = new RegExp(`^comunidad-(.+)-(${ANGULOS_COMUNIDAD.join('|')})$`);
  const grupos = new Map();
  const claveDe = new Map();
  const agregar = (clave, a, datos) => {
    if (!grupos.has(clave)) grupos.set(clave, { ...datos, articulos: [] });
    grupos.get(clave).articulos.push(a);
    claveDe.set(a.slug, clave);
  };
  for (const a of lista) {
    if (!a?.slug || claveDe.has(a.slug)) continue;
    const v = a.fuente === 'vademecum' && reVademecum.exec(a.slug);
    if (v) {
      agregar(`v:${v[1]}`, a, { titulo: 'Serie de estudio de este medicamento', pilar: { nombre: 'Monografía completa en el vademécum', ruta: `/vademecum/${v[1]}` } });
      continue;
    }
    const c = a.fuente === 'comunidad' && reComunidad.exec(a.slug);
    if (c) {
      agregar(`c:${c[1]}`, a, { titulo: 'Guías del grupo de apoyo', pilar: { nombre: 'Página del grupo de apoyo', ruta: `/comunidades/${c[1]}` } });
      continue;
    }
    if (a.materia?.slug) {
      agregar(`m:${a.materia.slug}`, a, { titulo: `Serie de ${a.materia.nombre}`, pilar: { nombre: 'Recursos para estudiantes de Química Farmacéutica', ruta: '/recursos-para-estudiantes-de-quimica-farmaceutica' } });
      continue;
    }
    const url = a.curso?.url;
    if (url && /^\/curso-(?:de|para)-/.test(url) && !a.fuente?.match(/^(vademecum|comunidad)$/)) {
      agregar(`k:${url}`, a, { titulo: `Serie del ${a.curso.titulo}`, pilar: { nombre: a.curso.titulo, ruta: url } });
    }
  }
  return (art) => {
    const g = grupos.get(claveDe.get(art?.slug));
    if (!g || g.articulos.length < 2) return null;
    return { titulo: g.titulo, pilar: g.pilar, articulos: g.articulos.map(resumen), actual: art.slug };
  };
}

/** La serie en HTML estático; el artículo actual va sin enlace. */
export function htmlDeSerie(serie) {
  if (!serie) return '';
  return `<section id="serie"><h2>${esc(serie.titulo)}</h2><p><a href="${esc(serie.pilar.ruta)}">${esc(serie.pilar.nombre)}</a></p><ol>${serie.articulos.map((a) => (a.slug === serie.actual ? `<li><strong>${esc(a.titulo)}</strong></li>` : `<li><a href="/articulos/${esc(a.slug)}">${esc(a.titulo)}</a></li>`)).join('')}</ol></section>`;
}

/**
 * Vecinos de las fichas de /medicamentos (en el orden de los datos, que
 * agrupa por área) y de la biblioteca de /salud (por categoría). Antes
 * cada una solo recibía el enlace de su hub.
 */
export const TITULO_OTRAS_FICHAS = 'Otras fichas de medicamentos';
export const TITULO_MAS_SALUD = 'Más de la biblioteca de salud';
export const crearVecinosDeFichas = (fichas) => crearVecinos(fichas, () => 'fichas');
export const crearVecinosDeSalud = (articulos) => crearVecinos(articulos, (a) => a?.categoria);

/** Una sección HTML con enlaces [[texto, ruta]]; vacía si no hay. */
export function htmlDeEnlaces(titulo, pares) {
  if (!pares?.length) return '';
  return `<section><h2>${esc(titulo)}</h2><ul>${pares.map(([t, u]) => `<li><a href="${esc(u)}">${esc(t)}</a></li>`).join('')}</ul></section>`;
}

/** La sección HTML (prerender y API) con la lista; vacía si no hay. */
export function htmlDeArticulos(titulo, articulos, intro = '') {
  if (!articulos?.length) return '';
  return `<section id="articulos-relacionados"><h2>${esc(titulo)}</h2>${intro ? `<p>${esc(intro)}</p>` : ''}<ul>${articulos.map((a) => `<li><a href="/articulos/${esc(a.slug)}">${esc(a.titulo)}</a></li>`).join('')}</ul></section>`;
}

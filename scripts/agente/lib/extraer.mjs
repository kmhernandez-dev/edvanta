/**
 * extraer.mjs — Lo que Google ve de una página de edvanta.co
 *
 * Lee el HTML que entrega el servidor (sin JavaScript, como lo lee el
 * robot en la primera pasada) y saca las señales de SEO y de venta:
 * título, descripción, canónica, robots, H1, datos estructurados, precio,
 * enlaces internos y palabras visibles. Funciones puras: se prueban sin red.
 */

const decodificar = (s) => String(s ?? '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .trim();

function atributo(etiqueta, nombre) {
  const m = etiqueta.match(new RegExp(`\\b${nombre}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? decodificar(m[2] ?? m[3]) : null;
}

/** Contenido de la primera <meta name|property="…">. */
export function meta(html, nombre) {
  for (const [etiqueta] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const n = atributo(etiqueta, 'name') || atributo(etiqueta, 'property');
    if (n && n.toLowerCase() === nombre.toLowerCase()) return atributo(etiqueta, 'content');
  }
  return null;
}

export function canonica(html) {
  for (const [etiqueta] of html.matchAll(/<link\b[^>]*>/gi)) {
    if ((atributo(etiqueta, 'rel') || '').toLowerCase() === 'canonical') return atributo(etiqueta, 'href');
  }
  return null;
}

/** Objetos JSON-LD aplanados (incluye los de @graph). Los que no parsean se cuentan aparte. */
export function jsonLd(html) {
  const objetos = [];
  let invalidos = 0;
  for (const [, cuerpo] of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const dato = JSON.parse(cuerpo);
      const pila = Array.isArray(dato) ? [...dato] : [dato];
      while (pila.length) {
        const o = pila.shift();
        if (!o || typeof o !== 'object') continue;
        objetos.push(o);
        if (Array.isArray(o['@graph'])) pila.push(...o['@graph']);
      }
    } catch {
      invalidos += 1;
    }
  }
  return { objetos, invalidos };
}

const tipos = (o) => (Array.isArray(o?.['@type']) ? o['@type'] : [o?.['@type']]).filter(Boolean);

/** Primer Offer con precio dentro de los objetos (directo o en offers/hasCourseInstance). */
function ofertaDe(objetos) {
  const pila = [...objetos];
  while (pila.length) {
    const o = pila.shift();
    if (!o || typeof o !== 'object') continue;
    if (Array.isArray(o)) { pila.push(...o); continue; }
    if (tipos(o).includes('Offer') && o.price != null && o.price !== '') {
      return { precio: Number(o.price), moneda: o.priceCurrency || null, categoria: o.category || null };
    }
    for (const v of Object.values(o)) if (v && typeof v === 'object') pila.push(v);
  }
  return null;
}

/** Texto visible sin scripts, estilos ni etiquetas. */
export function textoVisible(html) {
  const cuerpo = (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) || [null, html])[1];
  return decodificar(cuerpo
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Rutas internas enlazadas (sin recursos estáticos, sin anclas, sin repetir). */
export function enlacesInternos(html, sitio = 'https://edvanta.co') {
  const out = new Set();
  for (const [etiqueta] of html.matchAll(/<a\b[^>]*>/gi)) {
    let href = atributo(etiqueta, 'href');
    if (!href) continue;
    if (href.startsWith(sitio)) href = href.slice(sitio.length) || '/';
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const ruta = href.split('#')[0].split('?')[0];
    if (!ruta || /\.(js|css|svg|png|jpe?g|webp|ico|pdf|xml|txt)$/i.test(ruta)) continue;
    out.add(ruta.length > 1 ? ruta.replace(/\/+$/, '') : ruta);
  }
  return [...out];
}

export const rutaDe = (url, sitio = 'https://edvanta.co') => {
  try {
    const u = new URL(url, sitio);
    return u.pathname.length > 1 ? u.pathname.replace(/\/+$/, '') : '/';
  } catch {
    return url;
  }
};

/**
 * Tipo de página para el agente.
 * @param {string} ruta
 * @param {Set<string>|string[]} propios  rutas de cursos propios
 */
export function tipoDePagina(ruta, propios = new Set()) {
  const set = propios instanceof Set ? propios : new Set(propios);
  if (ruta === '/cursos') return 'catalogo';
  if (/^\/escuelas\/[^/]+$/.test(ruta)) return 'escuela';
  if (ruta.startsWith('/guia/')) return 'guia';
  if (/^\/curso-[^/]+\/clase\/[^/]+$/.test(ruta)) return 'clase';
  if (/^\/curso-[^/]+$/.test(ruta)) return set.has(ruta) ? 'curso-propio' : 'curso-curado';
  return 'otra';
}

/**
 * Señales de SEO y venta de una página.
 * @param {string} html
 * @param {{url: string, estado?: number, xRobots?: string|null, propios?: Set<string>, sitio?: string}} ctx
 */
export function senalesDePagina(html, { url, estado = 200, xRobots = null, propios = new Set(), sitio = 'https://edvanta.co' }) {
  const ruta = rutaDe(url, sitio);
  const h = String(html || '');
  const titulo = decodificar((h.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '') || null;
  const descripcion = meta(h, 'description');
  const robots = [meta(h, 'robots'), xRobots].filter(Boolean).join(', ') || null;
  const canon = canonica(h);
  const h1s = [...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decodificar(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' '));
  const { objetos, invalidos } = jsonLd(h);
  const todosLosTipos = [...new Set(objetos.flatMap(tipos))];
  const oferta = ofertaDe(objetos);
  const texto = textoVisible(h);
  const enlaces = enlacesInternos(h, sitio);
  const proveedor = objetos.find((o) => tipos(o).includes('Course'))?.provider?.name || null;

  return {
    url,
    ruta,
    tipo: tipoDePagina(ruta, propios),
    estado,
    titulo,
    largoTitulo: titulo ? titulo.length : 0,
    descripcion,
    largoDescripcion: descripcion ? descripcion.length : 0,
    canonica: canon,
    canonicaPropia: canon ? rutaDe(canon, sitio) === ruta : false,
    robots,
    indexable: estado === 200 && !/noindex/i.test(robots || ''),
    h1: h1s[0] || null,
    cantidadH1: h1s.length,
    tiposJsonLd: todosLosTipos,
    jsonLdInvalidos: invalidos,
    proveedor,
    precio: oferta?.precio ?? null,
    moneda: oferta?.moneda ?? null,
    palabras: texto ? texto.split(' ').length : 0,
    mencionaCertificado: /certificad/i.test(texto),
    enlacesInternos: enlaces.length,
    enlacesACursos: enlaces.filter((r) => /^\/curso-[^/]+$/.test(r) && r !== ruta),
    enlacesAClases: enlaces.filter((r) => r.startsWith(`${ruta}/clase/`)).length,
    enlacesAGuias: enlaces.filter((r) => r.startsWith('/guia/')).length,
    imagenSocial: meta(h, 'og:image'),
  };
}

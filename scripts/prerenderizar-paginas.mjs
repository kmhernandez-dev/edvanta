/**
 * ============================================================
 *  prerenderizar-paginas.mjs — Páginas fijas con su título ya escrito
 *
 *  Corre después de compilar (postbuild), detrás del de artículos.
 *  Escribe un .html por página con su título, descripción, canonical,
 *  metadatos para redes y datos estructurados, para que los buscadores
 *  y las redes (que no ejecutan JavaScript) vean cada página como es:
 *
 *    dist/herramientas/<slug>.html            cada herramienta
 *    dist/articulos/categoria/<slug>.html     cada categoría de artículos
 *    dist/curso-de-….html                     los cursos en vivo
 *
 *  nginx los sirve por su dirección ($uri.html). La aplicación se monta
 *  encima igual que en cualquier otra página.
 *
 *  También ordena dist/sitemap.xml: quita las direcciones viejas de
 *  cursos (ahora viven en /sitemap-cursos.xml, que arma la API) y agrega
 *  estas páginas con su dirección vigente.
 * ============================================================
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// DIST_DIR permite compilar en otra carpeta (pruebas sin tocar dist/).
const dist = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(raiz, 'dist');
const SITIO = 'https://edvanta.co';
const importar = (rel) => import(pathToFileURL(path.join(raiz, rel)).href);

const { articulos } = await importar('src/data/articulos.js');
const { HERRAMIENTAS } = await importar('src/data/edvanta/herramientas.js');
const { PRODUCTOS } = await importar('src/data/edvanta/productos.js');
const { DIRECCIONES_ANTIGUAS } = await importar('src/data/edvanta/direcciones.js');
const { nombreDeCurso, slugify } = await importar('src/lib/slug.js');

const plantilla = readFileSync(path.join(dist, 'index.html'), 'utf8');

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function pagina({ titulo, descripcion, canonical, imagen = `${SITIO}/img/edvanta-hero.webp`, jsonLd = [], cuerpo = '' }) {
  const t = esc(titulo);
  const d = esc(descripcion);
  let html = plantilla
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${imagen}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${imagen}$2`);
  const scripts = jsonLd.map((j) => `    <script type="application/ld+json" data-prerender>${JSON.stringify(j).replaceAll('</', '<\\/')}</script>`).join('\n');
  if (scripts) html = html.replace('</head>', `${scripts}\n  </head>`);
  if (cuerpo) html = html.replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`);
  return html;
}

const migas = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});

const escribir = (rel, html) => {
  const destino = path.join(dist, rel);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, html);
};

const enSitemap = [];

/* ── Herramientas ─────────────────────────────────────────── */

for (const h of HERRAMIENTAS) {
  const canonical = `${SITIO}/herramientas/${h.slug}`;
  const titulo = h.seo?.title || `${h.nav} | Edvanta`;
  const descripcion = h.seo?.description || h.tagline;
  escribir(`herramientas/${h.slug}.html`, pagina({
    titulo,
    descripcion,
    canonical,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: h.h1,
        applicationCategory: 'BusinessApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: canonical,
      },
      migas([['Inicio', `${SITIO}/`], ['Herramientas', `${SITIO}/herramientas`], [h.nav, canonical]]),
    ],
    cuerpo: `<main><h1>${esc(h.h1)}</h1><p>${esc(h.tagline)}</p><p><a href="${esc(h.cta.to)}">${esc(h.cta.label)}</a></p></main>`,
  }));
  enSitemap.push({ ruta: `/herramientas/${h.slug}`, prioridad: '0.7' });
}

/* ── Categorías de artículos ──────────────────────────────── */

const categorias = new Map();
for (const a of articulos) {
  const slug = slugify(a.category);
  if (!slug) continue;
  const c = categorias.get(slug) || { slug, lista: [], nombres: new Map(), fecha: '' };
  c.lista.push(a);
  c.nombres.set(a.category, (c.nombres.get(a.category) || 0) + 1);
  const f = a.updated || a.date || '';
  if (f > c.fecha) c.fecha = f;
  categorias.set(slug, c);
}
for (const c of categorias.values()) {
  const nombre = [...c.nombres.entries()].sort((x, y) => y[1] - x[1])[0][0];
  const canonical = `${SITIO}/articulos/categoria/${c.slug}`;
  const n = c.lista.length;
  escribir(`articulos/categoria/${c.slug}.html`, pagina({
    titulo: `Artículos de ${nombre} | Edvanta`,
    descripcion: `${n} ${n === 1 ? 'artículo' : 'artículos'} de ${nombre.toLowerCase()} en Edvanta, en lenguaje claro y con fuentes.`,
    canonical,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `Artículos de ${nombre}`, url: canonical, publisher: { '@type': 'Organization', name: 'Edvanta' } },
      migas([['Inicio', `${SITIO}/`], ['Artículos', `${SITIO}/articulos`], [nombre, canonical]]),
    ],
    cuerpo: `<main><h1>Artículos de ${esc(nombre.toLowerCase())}</h1><ul>${c.lista.map((a) => `<li><a href="/articulos/${a.slug}">${esc(a.title)}</a></li>`).join('')}</ul></main>`,
  }));
  enSitemap.push({ ruta: `/articulos/categoria/${c.slug}`, prioridad: '0.6', fecha: c.fecha });
}

/* ── Cursos en vivo ───────────────────────────────────────── */

for (const p of PRODUCTOS.filter((x) => x.tipo === 'curso_en_vivo' && x.to?.startsWith('/curso-'))) {
  const canonical = `${SITIO}${p.to}`;
  const nombre = nombreDeCurso(p.nombre.split(':')[0].trim());
  escribir(`${p.to.slice(1)}.html`, pagina({
    titulo: `${nombre} | Edvanta`,
    descripcion: `${p.tipoTexto} para ${p.dirigidoA.charAt(0).toLowerCase()}${p.dirigidoA.slice(1)} ${p.formato.duracion}, ${p.formato.encuentros.toLowerCase()}.`,
    canonical,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: p.nombre,
        description: p.objetivo,
        inLanguage: 'es',
        url: canonical,
        provider: { '@type': 'Organization', name: 'Edvanta', sameAs: SITIO },
      },
      migas([['Inicio', `${SITIO}/`], ['Cursos', `${SITIO}/cursos`], [nombre, canonical]]),
    ],
    cuerpo: `<main><h1>${esc(p.nombre)}</h1><p>${esc(p.objetivo)}</p></main>`,
  }));
  enSitemap.push({ ruta: p.to, prioridad: '0.9' });
}

/* ── Sitemap ──────────────────────────────────────────────── */

const rutaSitemap = path.join(dist, 'sitemap.xml');
if (existsSync(rutaSitemap)) {
  let xml = readFileSync(rutaSitemap, 'utf8');
  // Fuera: las fichas de curso por su dirección vieja (las vigentes salen en
  // /sitemap-cursos.xml) y toda dirección que ahora redirige.
  const viejas = new Set(DIRECCIONES_ANTIGUAS.map((d) => `${SITIO}${d.antigua}`));
  xml = xml.split('\n').filter((linea) => {
    const loc = /<loc>([^<]+)<\/loc>/.exec(linea)?.[1];
    if (!loc) return true;
    if (viejas.has(loc)) return false;
    if (/^https:\/\/edvanta\.co\/cursos\/(?!coursera$|udemy$|edutin$)[^/]+$/.test(loc)) return false;
    if (/^https:\/\/edvanta\.co\/herramientas\/[^/]+$/.test(loc)) return false;
    if (/^https:\/\/edvanta\.co\/articulos\/categoria\//.test(loc)) return false;
    return true;
  }).join('\n');
  const lineas = enSitemap.map((u) => `  <url><loc>${SITIO}${u.ruta}</loc>${u.fecha ? `<lastmod>${u.fecha}</lastmod>` : ''}<priority>${u.prioridad}</priority></url>`);
  xml = xml.replace('</urlset>', `  <!-- Herramientas, categorías y cursos en vivo (generado al compilar) -->\n${lineas.join('\n')}\n</urlset>`);
  writeFileSync(rutaSitemap, xml);
}

console.log(`Páginas fijas prerenderizadas: ${enSitemap.length} (herramientas, categorías y cursos en vivo)`);

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');
const SITIO = 'https://edvanta.co';

if (!existsSync(dist)) {
  console.log('Sitemaps: no existe dist; se omite.');
  process.exit(0);
}

const excluir = new Set(['404.html', 'index.html']);
const excluirPrefijos = ['assets/', 'img/', 'images/', 'pdfjs/', 'descargas/', 'recursos/'];

const archivos = [];
const recorrer = (dir) => {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const absoluto = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      recorrer(absoluto);
      continue;
    }
    if (!entrada.name.endsWith('.html')) continue;
    const relativo = path.relative(dist, absoluto).split(path.sep).join('/');
    if (excluir.has(relativo)) continue;
    if (/^google[0-9a-f]+\.html$/i.test(relativo)) continue;
    if (excluirPrefijos.some((p) => relativo.startsWith(p))) continue;
    archivos.push({ absoluto, relativo });
  }
};
recorrer(dist);

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const sinBarra = (ruta) => (ruta !== '/' ? ruta.replace(/\/+$/, '') : '/');

const rutaDeArchivo = (relativo) => {
  if (relativo === 'index.html') return '/';
  if (relativo.endsWith('/index.html')) return `/${relativo.slice(0, -'/index.html'.length)}`;
  return `/${relativo.slice(0, -'.html'.length)}`;
};

const canonicalDe = (html, ruta) => {
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]?.trim();
  if (!canonical || !canonical.startsWith(SITIO)) return `${SITIO}${ruta}`;
  try {
    const u = new URL(canonical);
    return `${SITIO}${sinBarra(u.pathname)}`;
  } catch {
    return `${SITIO}${ruta}`;
  }
};

const porUrl = new Map();

for (const { absoluto, relativo } of archivos) {
  const html = readFileSync(absoluto, 'utf8');
  const robots = /<meta name="robots" content="([^"]+)"/i.exec(html)?.[1] || '';
  if (/noindex/i.test(robots)) continue;
  const ruta = rutaDeArchivo(relativo);
  const loc = canonicalDe(html, ruta);
  if (loc === `${SITIO}/` && ruta !== '/') continue;
  if (loc.endsWith('/404')) continue;
  const lastmod = statSync(absoluto).mtime.toISOString().slice(0, 10);
  if (!porUrl.has(loc)) porUrl.set(loc, { loc, lastmod });
}

// Sitemaps por colección (27-nov-2026): Search Console muestra cuánto se
// indexa de cada una. Los nombres que Google ya conoce se conservan
// (sitemap-articulos.xml = artículos editoriales; sitemap-paginas.xml = el resto).
const importar = (rel) => import(pathToFileURL(path.join(raiz, rel)).href);
const [{ BLOG_CURSOS_500 }, { VADEMECUM_ARTICULOS_1000 }, { ESTUDIANTES_ARTICULOS_1000 }, { ARTICULOS_COMUNIDAD_WEBINARS }] = await Promise.all([
  importar('src/data/blogCursos500.js'), importar('src/data/vademecumArticulos1000.js'),
  importar('src/data/estudiantesArticulos1000.js'), importar('src/data/articulosComunidadWebinars.js'),
]);
const coleccionDe = new Map();
for (const a of BLOG_CURSOS_500) coleccionDe.set(a.slug, 'articulos-cursos');
for (const a of VADEMECUM_ARTICULOS_1000) {
  coleccionDe.set(a.slug, a.fuente === 'vademecum' ? 'articulos-vademecum' : a.fuente === 'curso' ? 'articulos-cursos' : 'articulos-comunidades');
}
for (const a of ESTUDIANTES_ARTICULOS_1000) coleccionDe.set(a.slug, 'articulos-estudiantes');
for (const a of ARTICULOS_COMUNIDAD_WEBINARS) coleccionDe.set(a.slug, 'articulos-comunidades');
const SALUD = ['/vademecum', '/medicamentos', '/salud', '/casos-clinicos', '/examenes', '/enfermedades', '/comunidades', '/contigo', '/levotiroxina', '/nutricion-tiroidea'];
const bajo = (ruta, base) => ruta === base || ruta.startsWith(`${base}/`);

const grupos = {
  paginas: [], salud: [], brasil: [], herramientas: [],
  articulos: [], 'articulos-cursos': [], 'articulos-vademecum': [], 'articulos-comunidades': [], 'articulos-estudiantes': [],
};

for (const item of porUrl.values()) {
  const ruta = item.loc.slice(SITIO.length) || '/';
  if (bajo(ruta, '/articulos')) {
    grupos[coleccionDe.get(ruta.slice('/articulos/'.length)) || 'articulos'].push(item);
  } else if (bajo(ruta, '/herramientas')) {
    grupos.herramientas.push(item);
  } else if (bajo(ruta, '/br')) {
    grupos.brasil.push(item);
  } else if (SALUD.some((b) => bajo(ruta, b))) {
    grupos.salud.push(item);
  } else {
    grupos.paginas.push(item);
  }
}

const urlset = (lista) => {
  const lineas = lista
    .sort((a, b) => a.loc.localeCompare(b.loc))
    .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${esc(u.lastmod)}</lastmod>` : ''}</url>`);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...lineas,
    '</urlset>',
    '',
  ].join('\n');
};

const maxFecha = (lista) => lista.map((u) => u.lastmod).filter(Boolean).sort().at(-1) || null;

const segmentos = Object.entries(grupos).map(([nombre, lista]) => [`sitemap-${nombre}.xml`, lista]);

for (const [archivo, lista] of segmentos) {
  writeFileSync(path.join(dist, archivo), urlset(lista));
}

const fecha = new Date().toISOString().slice(0, 10);
const entradas = [
  ...segmentos.map(([archivo, lista]) => ({ loc: `${SITIO}/${archivo}`, lastmod: maxFecha(lista) })),
  { loc: `${SITIO}/sitemap-cursos.xml`, lastmod: fecha },
  { loc: `${SITIO}/sitemap-profesional.xml`, lastmod: fecha },
];

const indice = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entradas.map((e) => `  <sitemap><loc>${esc(e.loc)}</loc>${e.lastmod ? `<lastmod>${esc(e.lastmod)}</lastmod>` : ''}</sitemap>`),
  '</sitemapindex>',
  '',
].join('\n');

writeFileSync(path.join(dist, 'sitemap.xml'), indice);
writeFileSync(path.join(dist, 'sitemap-index.xml'), indice);

console.log(`Sitemaps: ${porUrl.size} URLs únicas · ${segmentos.map(([archivo, lista]) => `${archivo.replace(/^sitemap-|\.xml$/g, '')} ${lista.length}`).join(' · ')}`);

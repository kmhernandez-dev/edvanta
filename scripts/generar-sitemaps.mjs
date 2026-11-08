import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

const grupos = { paginas: [], articulos: [], herramientas: [] };

for (const item of porUrl.values()) {
  if (item.loc === `${SITIO}/articulos` || item.loc.startsWith(`${SITIO}/articulos/`)) {
    grupos.articulos.push(item);
  } else if (item.loc === `${SITIO}/herramientas` || item.loc.startsWith(`${SITIO}/herramientas/`)) {
    grupos.herramientas.push(item);
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

const segmentos = [
  ['sitemap-paginas.xml', grupos.paginas],
  ['sitemap-articulos.xml', grupos.articulos],
  ['sitemap-herramientas.xml', grupos.herramientas],
];

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

console.log(`Sitemaps: ${porUrl.size} URLs únicas · páginas ${grupos.paginas.length} · artículos ${grupos.articulos.length} · herramientas ${grupos.herramientas.length}`);

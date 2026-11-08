import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');
const SITIO = 'https://edvanta.co';
const entrada = path.join(dist, 'sitemap.xml');

if (!existsSync(entrada)) {
  console.log('Sitemap: no existe dist/sitemap.xml; se omite.');
  process.exit(0);
}

const xml = readFileSync(entrada, 'utf8');

if (/<sitemapindex\b/.test(xml)) {
  console.log('Sitemap: dist/sitemap.xml ya es un índice; no se vuelve a segmentar.');
  process.exit(0);
}

const archivoDeRuta = (loc) => {
  const ruta = new URL(loc).pathname;
  if (ruta === '/') return path.join(dist, 'index.html');
  const base = ruta.replace(/^\//, '').replace(/\/$/, '');
  return [path.join(dist, `${base}.html`), path.join(dist, base, 'index.html')]
    .find((archivo) => existsSync(archivo)) || null;
};

const esIndexable = (loc) => {
  const archivo = archivoDeRuta(loc);
  if (!archivo) return false;
  return !/<meta name="robots" content="noindex/i.test(readFileSync(archivo, 'utf8'));
};

const bloques = [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0]);
const porUrl = new Map();

for (const bloque of bloques) {
  const loc = /<loc>([^<]+)<\/loc>/.exec(bloque)?.[1]?.trim();
  if (!loc || !loc.startsWith(SITIO) || !esIndexable(loc)) continue;
  const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(bloque)?.[1]?.trim();
  if (!porUrl.has(loc)) porUrl.set(loc, { loc, lastmod: lastmod || null });
}

const grupos = {
  paginas: [],
  articulos: [],
  herramientas: [],
};

for (const item of porUrl.values()) {
  if (item.loc === `${SITIO}/articulos` || item.loc.startsWith(`${SITIO}/articulos/`)) {
    grupos.articulos.push(item);
  } else if (item.loc === `${SITIO}/herramientas` || item.loc.startsWith(`${SITIO}/herramientas/`)) {
    grupos.herramientas.push(item);
  } else {
    grupos.paginas.push(item);
  }
}

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function urlset(lista) {
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
}

function maxFecha(lista) {
  return lista.map((u) => u.lastmod).filter(Boolean).sort().at(-1) || null;
}

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
  ...segmentos.map(([archivo, lista]) => ({
    loc: `${SITIO}/${archivo}`,
    lastmod: maxFecha(lista),
  })),
  { loc: `${SITIO}/sitemap-cursos.xml`, lastmod: null },
  { loc: `${SITIO}/sitemap-profesional.xml`, lastmod: null },
];

const indice = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entradas.map((e) => `  <sitemap><loc>${esc(e.loc)}</loc>${e.lastmod ? `<lastmod>${esc(e.lastmod)}</lastmod>` : `<lastmod>${fecha}</lastmod>`}</sitemap>`),
  '</sitemapindex>',
  '',
].join('\n');

writeFileSync(entrada, indice);
writeFileSync(path.join(dist, 'sitemap-index.xml'), indice);

console.log(`Sitemaps: ${porUrl.size} URLs únicas · páginas ${grupos.paginas.length} · artículos ${grupos.articulos.length} · herramientas ${grupos.herramientas.length}`);

/**
 * ============================================================
 *  generar-feed.mjs — dist/feed.xml (RSS 2.0)
 *
 *  Los 50 artículos y noticias indexables más recientes. Lectores de
 *  feeds, agregadores y boletines de universidades y gremios pueden
 *  seguir a Edvanta y enlazar cada nota a su página. Solo entran las
 *  páginas que se pueden indexar (puedeIndexarse): ni noticias de
 *  plantilla ni artículos de salud sin revisión clínica.
 *
 *  Corre al final de postbuild, después de los sitemaps.
 * ============================================================
 */
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');
const SITIO = 'https://edvanta.co';
const MAXIMO = 50;

if (!existsSync(dist)) {
  console.log('Feed: no existe dist; se omite.');
  process.exit(0);
}

const importar = (rel) => import(pathToFileURL(path.join(raiz, rel)).href);
const { articulos } = await importar('src/data/articulos.js');
const { puedeIndexarse } = await importar('src/lib/seo/indexabilidad.js');
const { esAutoraKarla } = await importar('src/lib/seo/autoria.js');
const { textoPlano } = await importar('src/lib/articulos/markdown.js');

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const valida = (f) => /^\d{4}-\d{2}-\d{2}/.test(String(f || ''));
// Mediodía de Colombia: la fecha no cambia de día en ningún huso horario cercano.
const rfc822 = (f) => new Date(`${String(f).slice(0, 10)}T12:00:00-05:00`).toUTCString();

const recientes = articulos
  .filter((a) => puedeIndexarse(a) && valida(a.date))
  .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(a.slug).localeCompare(String(b.slug)))
  .slice(0, MAXIMO);

const item = (a) => {
  const url = `${SITIO}/articulos/${a.slug}`;
  const autor = esAutoraKarla(a) ? 'Karla Hernández' : 'Equipo editorial de Edvanta';
  return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(a.date)}</pubDate>
      <dc:creator>${esc(autor)}</dc:creator>
      ${a.category ? `<category>${esc(a.category)}</category>` : ''}
      <description>${esc(textoPlano(a.seoDescription || a.description || ''))}</description>
    </item>`;
};

const ultima = recientes.map((a) => a.updated || a.date).filter(valida).sort().pop();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Edvanta: artículos y noticias</title>
    <link>${SITIO}/articulos</link>
    <atom:link href="${SITIO}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Artículos de salud y farmacia con revisión clínica, y noticias regulatorias con fuente oficial, de Edvanta.</description>
    <language>es-co</language>
    ${ultima ? `<lastBuildDate>${rfc822(ultima)}</lastBuildDate>` : ''}
    <image>
      <url>${SITIO}/img/logo-edvanta.png</url>
      <title>Edvanta: artículos y noticias</title>
      <link>${SITIO}/articulos</link>
    </image>
${recientes.map(item).join('\n')}
  </channel>
</rss>
`;

writeFileSync(path.join(dist, 'feed.xml'), xml);
console.log(`Feed: ${recientes.length} entradas en dist/feed.xml`);

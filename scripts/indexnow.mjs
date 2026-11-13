/**
 * ============================================================
 *  indexnow.mjs — Avisa a Bing (y a los buscadores de IndexNow) de
 *  todas las direcciones del sitemap de edvanta.co
 *
 *  IndexNow es el protocolo abierto con el que un sitio le dice a los
 *  buscadores qué direcciones son nuevas o cambiaron. Lo usan Bing (que
 *  alimenta Copilot y la búsqueda de ChatGPT), Yandex, Seznam y Naver.
 *  Google no lo usa: para Google están el sitemap y Search Console.
 *
 *  La clave está publicada en https://edvanta.co/<clave>.txt
 *  (public/99b4cfa71602533ad5100d7977e420fa.txt).
 *
 *  Uso (después de desplegar):
 *    node scripts/indexnow.mjs                 todas las direcciones
 *    node scripts/indexnow.mjs --desde=2026-11-12   solo las cambiadas desde esa fecha
 *    node scripts/indexnow.mjs --prueba        lista sin enviar
 *    node scripts/indexnow.mjs --rutas=/vademecum/x,/articulos/y   solo esas direcciones
 *                                              (deben estar en el sitemap, es decir, indexables)
 * ============================================================
 */

const SITIO = 'https://edvanta.co';
const CLAVE = '99b4cfa71602533ad5100d7977e420fa';
const prueba = process.argv.includes('--prueba');
const desde = (process.argv.find((a) => a.startsWith('--desde=')) || '').slice('--desde='.length) || null;
const rutas = (process.argv.find((a) => a.startsWith('--rutas=')) || '').slice('--rutas='.length)
  .split(',').map((r) => r.trim()).filter(Boolean).map((r) => (r.startsWith('http') ? r : `${SITIO}${r}`));

async function leer(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'edvanta-indexnow' }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.text();
}

/** Direcciones (y su lastmod) de un sitemap o de un índice de sitemaps. */
async function direccionesDe(url) {
  const xml = await leer(url);
  if (xml.includes('<sitemapindex')) {
    const hijos = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    return (await Promise.all(hijos.map(direccionesDe))).flat();
  }
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, u]) => ({
    loc: (u.match(/<loc>([^<]+)<\/loc>/) || [])[1]?.trim(),
    lastmod: (u.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1]?.trim() || null,
  })).filter((d) => d.loc?.startsWith(SITIO));
}

const clave = (await leer(`${SITIO}/${CLAVE}.txt`)).trim();
if (clave !== CLAVE) throw new Error('La clave publicada no coincide: despliega antes de enviar.');

let lista = await direccionesDe(`${SITIO}/sitemap-index.xml`);
if (desde) lista = lista.filter((d) => !d.lastmod || d.lastmod.slice(0, 10) >= desde);
let urls = [...new Set(lista.map((d) => d.loc))];
if (rutas.length) {
  // Solo se avisa de direcciones que el sitemap ya publica (indexables).
  const enSitemap = new Set(urls);
  const fuera = rutas.filter((u) => !enSitemap.has(u));
  if (fuera.length) throw new Error(`No están en el sitemap (¿noindex o sin desplegar?): ${fuera.join(', ')}`);
  urls = rutas;
}
console.log(`Direcciones: ${urls.length}${desde ? ` (cambiadas desde ${desde})` : ''}`);

if (prueba) {
  console.log(urls.slice(0, 20).join('\n'));
  process.exit(0);
}

// IndexNow acepta hasta 10.000 direcciones por envío.
for (let i = 0; i < urls.length; i += 10000) {
  const lote = urls.slice(i, i + 10000);
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: 'edvanta.co', key: CLAVE, keyLocation: `${SITIO}/${CLAVE}.txt`, urlList: lote }),
  });
  // 200 o 202: recibido. 422: alguna dirección no es del sitio. 429: demasiadas solicitudes.
  // 403: la clave aún no está verificada. Pasó en el primer envío (12-nov-2026): se
  // envió una sola dirección por GET (que la verificó) y el envío completo dio 200.
  console.log(`Lote ${i / 10000 + 1}: ${lote.length} direcciones → HTTP ${r.status}`);
}

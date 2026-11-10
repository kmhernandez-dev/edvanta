/**
 * auditar-sitemap.mjs: revisa cada URL de los sitemaps de producción.
 * Para cada una mide el estado HTTP, la redirección, la canónica, robots,
 * el título y las palabras visibles sin JavaScript.
 *
 * Uso: node scripts/auditar-sitemap.mjs [salida.json]
 * Hace unas 650 peticiones a https://edvanta.co, de 8 en 8.
 */
import fs from 'node:fs';
const BASE = 'https://edvanta.co';
const UA = 'Mozilla/5.0 (compatible; auditoria-sitemap-edvanta/1.0)';
const idx = await (await fetch(BASE + '/sitemap.xml', { headers: { 'user-agent': UA } })).text();
const mapas = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const urls = [];
for (const m of mapas) {
  const xml = await (await fetch(m, { headers: { 'user-agent': UA } })).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1].replace(/&amp;/g, '&'));
  console.log(m, locs.length);
  for (const u of locs) urls.push({ mapa: m.split('/').pop(), url: u });
}
const vistos = new Set();
const dup = urls.filter((x) => (vistos.has(x.url) ? true : (vistos.add(x.url), false)));
console.log('total', urls.length, 'duplicadas entre sitemaps', dup.length);

const attr = (html, re) => { const m = html.match(re); return m ? m[1] : null; };
async function revisar(x) {
  try {
    const r = await fetch(x.url, { redirect: 'manual', headers: { 'user-agent': UA } });
    const html = r.status === 200 ? await r.text() : '';
    const canon = attr(html, /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || attr(html, /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
    const robots = attr(html, /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i);
    const titulo = attr(html, /<title[^>]*>([^<]*)<\/title>/i);
    const xrobots = r.headers.get('x-robots-tag');
    const cuerpo = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return { ...x, estado: r.status, destino: r.headers.get('location'), canon, robots, xrobots, titulo, palabras: cuerpo ? cuerpo.split(' ').length : 0 };
  } catch (e) {
    return { ...x, estado: 'ERR', error: String(e) };
  }
}
const out = [];
let i = 0;
async function trabajador() { while (i < urls.length) { const x = urls[i++]; out.push(await revisar(x)); } }
await Promise.all(Array.from({ length: 8 }, trabajador));
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));

const cuenta = (f) => out.reduce((a, x) => { const k = f(x); a[k] = (a[k] || 0) + 1; return a; }, {});
console.log('estados', cuenta((x) => x.mapa + ' ' + x.estado));
const norm = (u) => (u || '').replace(/\/$/, '');
console.log('canónica distinta de la URL', cuenta((x) => x.estado === 200 ? (x.canon == null ? 'sin canónica' : norm(x.canon) === norm(x.url) ? 'propia' : 'OTRA') : 'n/a'));
console.log('robots meta', cuenta((x) => x.robots || '-'), 'x-robots', cuenta((x) => x.xrobots || '-'));
console.log('títulos repetidos', Object.entries(cuenta((x) => x.titulo || '-')).filter(([, n]) => n > 3).slice(0, 10));
console.log('palabras en HTML crudo (texto visible sin JS)', cuenta((x) => x.mapa + ' ' + (x.palabras < 80 ? '<80' : x.palabras < 300 ? '80-300' : '300+')));

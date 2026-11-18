/**
 * ============================================================
 *  clases-abiertas.mjs — La lista de clases abiertas de producción
 *
 *  Lee el sitemap de cursos (lo escribe la API desde la base) y el <h1>
 *  de cada clase, y guarda src/data/clases-abiertas.json:
 *    { "/curso-de-…/clase/…": "Título de la clase" }
 *
 *  La prueba de enlaces de salud (src/__tests__/enlaces-de-salud.test.js)
 *  compara con este archivo cada clase que enlazan el vademécum y los
 *  artículos (api/lib/enlaces-de-salud.js). Las clases viven en la base,
 *  no en el repositorio: por eso se toman de producción.
 *
 *  Uso: node scripts/clases-abiertas.mjs [--sitio=https://edvanta.co]
 *  Correrlo después de publicar, renombrar o retirar clases.
 * ============================================================
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv.find((a) => a.startsWith('--sitio='));
const SITIO = (arg ? arg.slice('--sitio='.length) : 'https://edvanta.co').replace(/\/$/, '');
const destino = path.join(raiz, 'src/data/clases-abiertas.json');

const texto = (h) => h.replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ').trim();

const mapa = await (await fetch(`${SITIO}/sitemap-cursos.xml`)).text();
const rutas = [...mapa.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, u]) => u.replace(/^https?:\/\/[^/]+/, ''))
  .filter((r) => r.includes('/clase/'));
if (!rutas.length) throw new Error(`El sitemap de ${SITIO} no trae clases.`);

const salida = {};
const fallas = [];
async function leer(ruta) {
  for (let intento = 0; intento < 3; intento += 1) {
    try {
      const r = await fetch(`${SITIO}${ruta}`);
      const h1 = (await r.text()).match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      if (r.ok && h1) { salida[ruta] = texto(h1[1]); return; }
    } catch { /* se reintenta */ }
    await new Promise((ok) => { setTimeout(ok, 1000); });
  }
  fallas.push(ruta);
}
const cola = [...rutas];
await Promise.all(Array.from({ length: 6 }, async () => { while (cola.length) await leer(cola.shift()); }));
if (fallas.length) throw new Error(`No se pudieron leer ${fallas.length} clases: ${fallas.slice(0, 5).join(', ')}`);

const ordenado = Object.fromEntries(Object.keys(salida).sort().map((r) => [r, salida[r]]));
writeFileSync(destino, `${JSON.stringify(ordenado, null, 1)}\n`);
console.log(`${Object.keys(ordenado).length} clases abiertas en ${path.relative(raiz, destino)}`);

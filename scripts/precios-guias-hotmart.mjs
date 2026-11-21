/**
 * Lee el precio real de cada guía en su página de pago de Hotmart y lo
 * guarda en src/data/preciosGuias.js, con la fecha de verificación.
 *
 *   node scripts/precios-guias-hotmart.mjs
 *
 * Hotmart muestra el precio en la moneda del país desde el que se
 * consulta; corriéndolo desde Colombia, es el precio en COP que ve un
 * comprador colombiano (el menor de los medios de pago, sin recargos).
 * Las páginas /guia/… declaran ese precio en su JSON-LD (Offer). Si una
 * guía no se puede leer, no se le inventa precio: queda fuera.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { GUIAS_VENTA } = await import(pathToFileURL(path.join(raiz, 'src/data/guiasVenta.js')).href);
const destino = path.join(raiz, 'src/data/preciosGuias.js');

function nuxt(html) {
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  const arr = JSON.parse(m[1]);
  const memo = new Map();
  const res = (i, d = 0) => {
    if (typeof i !== 'number' || d > 10) return i;
    if (memo.has(i)) return memo.get(i);
    const v = arr[i];
    let out;
    if (Array.isArray(v)) {
      out = typeof v[0] === 'string' && ['Reactive', 'ShallowReactive', 'Ref', 'ShallowRef'].includes(v[0])
        ? res(v[1], d + 1) : v.map((x) => res(x, d + 1));
    } else if (v && typeof v === 'object') {
      out = {};
      for (const [k, x] of Object.entries(v)) out[k] = res(x, d + 1);
    } else out = v;
    memo.set(i, out);
    return out;
  };
  for (let i = 0; i < arr.length; i += 1) {
    const v = arr[i];
    if (v && typeof v === 'object' && !Array.isArray(v) && 'offer' in v && 'ucode' in v) return res(i);
  }
  return null;
}

function precioDe(producto) {
  const montos = (producto?.offer?.paymentMethods || [])
    .map((p) => p?.amount)
    .filter((a) => a && a.currency && Number(a.value) > 0);
  if (!montos.length) return null;
  const moneda = montos[0].currency;
  const valor = Math.min(...montos.filter((a) => a.currency === moneda).map((a) => Number(a.value)));
  return { valor, moneda };
}

const hoy = new Date().toISOString().slice(0, 10);
const salida = {};
for (const g of GUIAS_VENTA) {
  const url = g.pago || g.venta;
  if (!url) continue;
  try {
    let res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (precios Edvanta)' }, redirect: 'follow' });
    let html = await res.text();
    let producto = nuxt(html);
    // Los enlaces go.hotmart.com terminan en la página del producto, sin
    // precio: se lee su página de pago (pay.hotmart.com/<código>).
    const codigo = /\/([A-Z]\d{6,}[A-Z])(?:[/?#]|$)/.exec(new URL(res.url).pathname + '/')?.[1];
    if (!precioDe(producto) && codigo && !res.url.includes('pay.hotmart.com')) {
      res = await fetch(`https://pay.hotmart.com/${codigo}`, { headers: { 'User-Agent': 'Mozilla/5.0 (precios Edvanta)' }, redirect: 'follow' });
      html = await res.text();
      producto = nuxt(html);
    }
    const precio = precioDe(producto);
    if (precio) {
      salida[g.slug] = { ...precio, verificadoEl: hoy, producto: producto.name?.trim() || null };
      console.log(`${g.slug}: ${precio.moneda} ${precio.valor}`);
    } else {
      console.log(`${g.slug}: sin precio legible (${res.status} ${new URL(res.url).host})`);
    }
  } catch (e) {
    console.log(`${g.slug}: error ${e.message}`);
  }
}
fs.writeFileSync(destino, [
  '/**',
  ' * Precios reales de las guías en Hotmart (COP, comprador en Colombia).',
  ' * Generado por scripts/precios-guias-hotmart.mjs: no editar a mano.',
  ' */',
  `export const PRECIOS_GUIAS = ${JSON.stringify(salida, null, 2)};`,
  '',
].join('\n'));
console.log(`\n${Object.keys(salida).length}/${GUIAS_VENTA.length} guías con precio → src/data/preciosGuias.js`);

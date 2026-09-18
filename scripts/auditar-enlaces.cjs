/**
 * ============================================================
 *  auditar-enlaces.cjs — ¿algún botón lleva a ninguna parte?
 *
 *  Compara cada `to="/algo"` y `href="/algo"` del código con las rutas
 *  declaradas en src/App.jsx, revisa que las anclas `href="#id"` existan
 *  en el mismo archivo y señala los enlaces vacíos.
 *
 *  Uso:  node scripts/auditar-enlaces.cjs
 *  Sale con código 1 si encuentra enlaces internos rotos.
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const app = fs.readFileSync('src/App.jsx', 'utf8');
const rutas = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

/** ¿Alguna ruta declarada cubre este destino? */
function existe(destino) {
  const limpio = destino.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/';
  return rutas.some((r) => {
    if (r === '*') return false;
    const base = r.replace(/\/\*$/, '');
    if (r.endsWith('/*')) return limpio === base || limpio.startsWith(`${base}/`);
    const partesR = r.split('/');
    const partesD = limpio.split('/');
    if (partesR.length !== partesD.length) return false;
    return partesR.every((p, i) => p.startsWith(':') || p === partesD[i]);
  });
}

const archivos = [];
(function recorrer(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) recorrer(p);
    else if (/\.(jsx|js)$/.test(e.name)) archivos.push(p);
  }
})('src');

const rotos = new Set();
const anclas = new Set();
const vacios = new Set();

for (const f of archivos) {
  const s = fs.readFileSync(f, 'utf8');
  const ids = new Set([...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));

  for (const m of s.matchAll(/(?:to|href)=["']([^"']+)["']/g)) {
    const destino = m[1];
    const linea = s.slice(0, m.index).split('\n').length;
    const donde = `${f}:${linea} -> ${destino}`;
    if (destino === '#' || destino === '') { vacios.add(donde); continue; }
    if (destino.startsWith('#')) {
      if (!ids.has(destino.slice(1))) anclas.add(donde);
      continue;
    }
    if (!destino.startsWith('/') || destino.startsWith('//')) continue;
    // Archivos servidos desde /public y llamadas a la API
    if (/^\/(img|descargas|articulos\/articulos_edvanta|recursos\/|api)/.test(destino)) continue;
    if (!existe(destino)) rotos.add(donde);
  }
}

const bloque = (titulo, lista) => {
  console.log(`\n=== ${titulo} (${lista.length}) ===`);
  lista.forEach((x) => console.log(' ', x));
};

bloque('Enlaces internos sin ruta', [...rotos]);
bloque('Anclas sin destino en el mismo archivo', [...anclas]);
bloque('Enlaces vacíos (#)', [...vacios]);

if (rotos.size > 0) process.exitCode = 1;

/**
 * ============================================================
 *  verificar-fuentes.mjs — Que ningún artículo cite algo que no existe
 *
 *  Revisa los artículos de src/data/articulosSalud.js:
 *   1. Que cada uno tenga su archivo .md.
 *   2. Que cada enlace interno /articulos/<slug> lleve a un artículo.
 *   3. Que cada fuente externa responda (200 o redirección).
 *
 *  Uso: node scripts/verificar-fuentes.mjs        (todo)
 *       node scripts/verificar-fuentes.mjs --sin-red (solo 1 y 2)
 * ============================================================
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { articulos } = await import(pathToFileURL(path.join(raiz, 'src/data/articulos.js')).href);
const { articulosSalud } = await import(pathToFileURL(path.join(raiz, 'src/data/articulosSalud.js')).href);

const slugs = new Set(articulos.map((a) => a.slug));
const sinRed = process.argv.includes('--sin-red');
const problemas = [];
const externos = new Map();

for (const a of articulosSalud) {
  const archivo = path.join(raiz, 'public', a.mdPath);
  if (!existsSync(archivo)) { problemas.push(`${a.slug}: falta ${a.mdPath}`); continue; }
  const md = readFileSync(archivo, 'utf8');
  for (const [, url] of md.matchAll(/\]\((\/articulos\/[^)#\s]+)/g)) {
    const slug = url.replace('/articulos/', '');
    if (!slugs.has(slug)) problemas.push(`${a.slug}: enlace interno roto ${url}`);
  }
  for (const [, url] of md.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
    if (!externos.has(url)) externos.set(url, []);
    externos.get(url).push(a.slug);
  }
}

async function responde(url) {
  // Los DOI redirigen al editor, que suele bloquear a los robots: basta
  // con que doi.org confirme que el identificador está registrado.
  if (url.startsWith('https://doi.org/')) {
    try {
      const r = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
      return r.status >= 300 && r.status < 400 ? 200 : r.status;
    } catch (e) { return e.name; }
  }
  for (const metodo of ['HEAD', 'GET']) {
    try {
      const r = await fetch(url, {
        method: metodo,
        redirect: 'follow',
        signal: AbortSignal.timeout(20000),
        headers: { 'User-Agent': 'Mozilla/5.0 (verificador de fuentes de Edvanta)', Accept: 'text/html,*/*' },
      });
      if (r.status < 400) return r.status;
      if (metodo === 'GET') return r.status;
    } catch (e) {
      if (metodo === 'GET') return e.name;
    }
  }
  return 'sin respuesta';
}

if (!sinRed) {
  const lista = [...externos.keys()];
  const resultados = await Promise.all(lista.map(async (u) => [u, await responde(u)]));
  for (const [url, estado] of resultados) {
    if (typeof estado !== 'number' || estado >= 400) {
      problemas.push(`fuente ${estado}: ${url} (en ${externos.get(url).join(', ')})`);
    }
  }
  console.log(`Fuentes externas revisadas: ${lista.length}`);
}

console.log(`Artículos revisados: ${articulosSalud.length}`);
if (problemas.length) {
  console.log(`\n${problemas.length} problema(s):`);
  for (const p of problemas) console.log(`  · ${p}`);
  process.exitCode = 1;
} else {
  console.log('Sin problemas.');
}

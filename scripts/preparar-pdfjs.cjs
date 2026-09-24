/**
 * ============================================================
 *  preparar-pdfjs.cjs — Copia las fuentes estándar de pdf.js
 *
 *  pdf.js necesita los archivos de las fuentes base (Helvetica,
 *  Times, Courier…) para DIBUJAR un PDF que no las trae dentro,
 *  como los que genera la herramienta de hoja de vida. Sin ellas
 *  el dibujo se queda esperando para siempre y el worker avisa:
 *  «Ensure that the standardFontDataUrl API parameter is provided».
 *
 *  Se copian desde node_modules a public/ antes de compilar, así
 *  siempre corresponden a la versión instalada de pdfjs-dist y no
 *  hay que guardarlas en el repositorio.
 *
 *  Lo ejecutan `npm run dev` y `npm run build` (scripts predev y
 *  prebuild).
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist');

// Las fuentes base y los módulos WebAssembly que pdf.js necesita para dibujar.
const CARPETAS = ['standard_fonts', 'wasm'];

let copiados = 0;
for (const carpeta of CARPETAS) {
  const origen = path.join(base, carpeta);
  const destino = path.join(__dirname, '..', 'public', 'pdfjs', carpeta);
  if (!fs.existsSync(origen)) {
    console.warn(`[pdfjs] No se encontró ${carpeta} en node_modules: se omite.`);
    continue;
  }
  fs.mkdirSync(destino, { recursive: true });
  for (const archivo of fs.readdirSync(origen)) {
    const desde = path.join(origen, archivo);
    const hasta = path.join(destino, archivo);
    if (!fs.statSync(desde).isFile()) continue;
    // Solo se copia lo que cambió: el build repetido no vuelve a escribir.
    if (fs.existsSync(hasta) && fs.statSync(hasta).size === fs.statSync(desde).size) continue;
    fs.copyFileSync(desde, hasta);
    copiados += 1;
  }
}

console.log(`[pdfjs] Fuentes y wasm listos en public/pdfjs (${copiados} archivo(s) actualizado(s)).`);

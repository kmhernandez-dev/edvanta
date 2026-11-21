/**
 * Escribe src/data/casosClinicos/enlaces-inversos.js: qué casos clínicos
 * enlazar desde cada monografía del vademécum y cada artículo.
 * Uso: node scripts/casos-enlaces-inversos.mjs (después de agregar o editar casos).
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { CASOS } = await import(pathToFileURL(path.join(raiz, 'src/data/casosClinicos/index.js')).href);
const { calcularEnlacesInversos } = await import(pathToFileURL(path.join(raiz, 'src/lib/casosClinicos/calcularEnlaces.js')).href);
const mapa = calcularEnlacesInversos(CASOS);
writeFileSync(path.join(raiz, 'src/data/casosClinicos/enlaces-inversos.js'), `/* Generado por scripts/casos-enlaces-inversos.mjs: no editar a mano. */\nexport const ENLACES_INVERSOS = ${JSON.stringify(mapa, null, 1)};\n`);
console.log(`Vademécum: ${Object.keys(mapa.vademecum).length} páginas · artículos: ${Object.keys(mapa.articulos).length}`);

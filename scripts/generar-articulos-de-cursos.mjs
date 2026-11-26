/**
 * ============================================================
 *  generar-articulos-de-cursos.mjs — La lista de artículos de cada curso
 *  que lee la API para enlazarlos desde la ficha /curso-de-…
 *
 *  La API corre en su propio contenedor (Dockerfile.api copia solo api/),
 *  así que no puede importar src/data/articulos.js. Este script escribe
 *  api/data/articulos-de-cursos.json con { "/curso-de-…": [{ slug, titulo }] }
 *  usando src/lib/articulosRelacionados.js. Hay que correrlo cada vez que
 *  cambien los artículos de cursos; src/__tests__/articulos-relacionados.test.js
 *  falla si el JSON quedó desactualizado.
 *
 *    node scripts/generar-articulos-de-cursos.mjs
 * ============================================================
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articulos } from '../src/data/articulos.js';
import { articulosPorCurso } from '../src/lib/articulosRelacionados.js';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const destino = join(RAIZ, 'api', 'data', 'articulos-de-cursos.json');
const mapa = articulosPorCurso(articulos);
writeFileSync(destino, `${JSON.stringify(mapa, null, 1)}\n`);
const total = Object.values(mapa).reduce((s, l) => s + l.length, 0);
console.log(`api/data/articulos-de-cursos.json: ${Object.keys(mapa).length} cursos, ${total} artículos`);

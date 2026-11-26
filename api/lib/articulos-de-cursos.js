/**
 * ============================================================
 *  articulos-de-cursos.js — Los artículos que enlaza cada ficha de curso
 *
 *  La lista la escribe scripts/generar-articulos-de-cursos.mjs en
 *  api/data/articulos-de-cursos.json (la API no ve src/). Si el archivo
 *  falta o está dañado, la ficha sale sin la sección y nada más.
 * ============================================================
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

let mapa = {};
try {
  mapa = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'articulos-de-cursos.json'), 'utf8')) || {};
} catch {
  mapa = {};
}

/** [{ slug, titulo }] de la ruta pública del curso («/curso-de-…»). */
export function articulosDelCurso(ruta) {
  const lista = mapa[ruta];
  return Array.isArray(lista) ? lista.filter((a) => a?.slug && a?.titulo) : [];
}

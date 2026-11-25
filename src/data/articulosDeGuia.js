/**
 * Los artículos del blog que llevan a cada guía (el inverso de
 * guiaParaArticulo.js). La página de la guía los enlaza de vuelta: así
 * guía y artículos forman un grupo temático y Google los rastrea juntos.
 * Solo artículos indexables (en salud, con revisión clínica).
 */
import { articulos } from './articulos.js';
import { slugDeGuiaParaArticulo } from './guiaParaArticulo.js';
import { puedeIndexarse } from '../lib/seo/indexabilidad.js';

let indice = null;
function construir() {
  indice = new Map();
  for (const a of articulos) {
    if (!puedeIndexarse(a)) continue;
    const slug = slugDeGuiaParaArticulo(a);
    if (!slug) continue;
    if (!indice.has(slug)) indice.set(slug, []);
    indice.get(slug).push(a);
  }
  return indice;
}

export function articulosDeGuia(slug, n = 6) {
  return ((indice || construir()).get(slug) || []).slice(0, n);
}

export const totalDeArticulosDeGuia = (slug) => ((indice || construir()).get(slug) || []).length;

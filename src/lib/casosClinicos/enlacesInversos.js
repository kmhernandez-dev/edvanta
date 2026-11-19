/**
 * ============================================================
 *  Enlaces de vuelta: del vademécum y los artículos a los casos clínicos
 *
 *  Cada caso clínico enlaza a sus monografías y artículos (campo
 *  `enlaces` de src/data/casosClinicos/casos/*.js). Este módulo da el
 *  camino inverso: la monografía o el artículo enlaza al caso para
 *  practicar el tema, con el título del caso como texto del enlace.
 *
 *  Para no cargar los 50 casos en cada página, el mapa vive en
 *  src/data/casosClinicos/enlaces-inversos.js, que escribe
 *  `node scripts/casos-enlaces-inversos.mjs`. La prueba
 *  casos-clinicos.test.js falla si el archivo no coincide con los casos.
 * ============================================================
 */
import { ENLACES_INVERSOS as MAPA } from '../../data/casosClinicos/enlaces-inversos.js';

export const casosDeVademecum = (slug) => MAPA.vademecum[slug] || [];
export const casosDeArticulo = (slug) => MAPA.articulos[slug] || [];

export const TITULO_CASOS = 'Practica con un caso clínico';
export const TEXTO_CASOS = 'Examen interactivo tipo parcial: lee el caso, responde 10 preguntas de selección múltiple, completar y relacionar, y conoce tu nota de 0 a 5 con la explicación de cada respuesta.';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** La sección en HTML para el prerender. */
export function htmlDeCasos(casos = []) {
  if (!casos.length) return '';
  return `<section id="casos-clinicos"><h2>${TITULO_CASOS}</h2><p>${esc(TEXTO_CASOS)}</p><ul>${casos.map((c) => `<li><a href="${esc(c.ruta)}">${esc(c.titulo)}</a></li>`).join('')}</ul><p><a href="/casos-clinicos">Ver todos los casos clínicos</a></p></section>`;
}

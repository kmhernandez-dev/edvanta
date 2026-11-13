/**
 * ============================================================
 *  textos-de-perfiles.js — Texto editorial de carreras, rutas y competencias
 *
 *  Las páginas /carreras, /rutas y /competencias salen de la base, que
 *  solo trae un resumen y unas listas cortas: tenían entre 35 y 150
 *  palabras. Aquí está el texto editorial de Edvanta para cada una (el
 *  día a día, las normas verificadas, cómo prepararse y preguntas
 *  frecuentes). Lo usan la API, que lo escribe en el HTML con su
 *  FAQPage, y la aplicación (TextoDePerfil.jsx), que lo pinta igual.
 *
 *  Forma de cada texto:
 *    secciones: [{ titulo, parrafo?, lista?, pasos?, enlaces? }]
 *    preguntas: [[pregunta, respuesta]]
 * ============================================================
 */
import { TEXTOS_CARRERAS } from './textos-perfiles/carreras.js';

export const TEXTOS_DE_PERFILES = {
  carrera: TEXTOS_CARRERAS,
  ruta: {},
  competencia: {},
};

/** El texto editorial de un perfil, o null. tipo: carrera | ruta | competencia. */
export const textoDePerfil = (tipo, slug) => TEXTOS_DE_PERFILES[tipo]?.[slug] || null;

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** El texto en HTML simple, para la página que escribe la API. */
export function htmlDeTextoDePerfil(texto) {
  if (!texto) return '';
  const secciones = (texto.secciones || []).map((s) => {
    const partes = [
      s.parrafo ? `<p>${esc(s.parrafo)}</p>` : '',
      s.lista?.length ? `<ul>${s.lista.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '',
      s.pasos?.length ? `<ol>${s.pasos.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>` : '',
      s.enlaces?.length ? `<ul>${s.enlaces.map(([t, u]) => `<li><a href="${esc(u)}">${esc(t)}</a></li>`).join('')}</ul>` : '',
    ].join('');
    return `<section><h2>${esc(s.titulo)}</h2>${partes}</section>`;
  });
  const preguntas = texto.preguntas?.length
    ? `<section><h2>Preguntas frecuentes</h2>${texto.preguntas.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>`
    : '';
  return secciones.join('') + preguntas;
}

/** schema.org/FAQPage con las preguntas del texto, o null si no hay. */
export function faqDeTextoDePerfil(texto) {
  if (!texto?.preguntas?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: texto.preguntas.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/**
 * ============================================================
 *  citas.js — «Cómo citar este artículo» (Vancouver y APA 7)
 *
 *  Estudiantes, docentes y periodistas citan páginas web en trabajos,
 *  tesis y notas. Si la cita ya está hecha, la copian con el enlace
 *  correcto, y cada cita publicada es un enlace hacia edvanta.co.
 *
 *  La usan la página del artículo (con la fecha de consulta de hoy) y
 *  el HTML prerenderizado (con «[fecha de consulta]», porque esa fecha
 *  la pone quien cita).
 *
 *  La autoría es la misma de la firma del artículo (esAutoraKarla). Si
 *  lo firma el equipo editorial, el autor es Edvanta (autor corporativo).
 *  Vancouver es el estilo habitual en ciencias de la salud; APA 7, en
 *  el resto de las disciplinas.
 * ============================================================
 */
import { esAutoraKarla } from './autoria.js';

export const SITIO_CITAS = 'https://edvanta.co';

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function partes(fecha) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(fecha || ''));
  if (!m) return null;
  const p = { anio: Number(m[1]), mes: Number(m[2]), dia: Number(m[3]) };
  return p.mes >= 1 && p.mes <= 12 ? p : null;
}

const corta = (p) => `${p.dia} ${MESES_CORTOS[p.mes - 1]} ${p.anio}`;

/** Un título termina en punto, salvo que ya cierre con signo de pregunta o exclamación. */
const conPunto = (t) => (/[?!]$/.test(t) ? t : `${t}.`);

/** Fecha de hoy en Colombia, AAAA-MM-DD. */
export function hoyEnColombia(ahora = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(ahora);
}

/**
 * Citas de un artículo.
 * @param {object} art  artículo de src/data/articulos.js
 * @param {{ citado?: string }} [opciones]  fecha de consulta AAAA-MM-DD; sin ella queda «[fecha de consulta]»
 * @returns {{ vancouver: string, apa: string, url: string }}
 */
export function citasDeArticulo(art = {}, { citado } = {}) {
  const url = `${SITIO_CITAS}/articulos/${art.slug}`;
  const titulo = String(art.title || '').trim().replace(/[.\s]+$/, '');
  const publicado = partes(art.date);
  const actualizado = partes(art.updated) || publicado;
  const consulta = partes(citado);
  const persona = esAutoraKarla(art);

  // Vancouver (NLM, en español): Autor. Título [Internet]. Editor; año [actualizado; citado]. Disponible en: URL
  const anio = (publicado || actualizado)?.anio ?? 's. f.';
  const corchete = [
    actualizado ? `actualizado ${corta(actualizado)}` : null,
    consulta ? `citado ${corta(consulta)}` : 'citado [fecha de consulta]',
  ].filter(Boolean).join('; ');
  const vancouver = `${persona ? 'Hernández K' : 'Edvanta'}. ${titulo} [Internet]. Edvanta; ${anio} [${corchete}]. Disponible en: ${url}`;

  // APA 7 (en español): Autor. (año, día de mes). Título. Sitio. URL
  // Si el autor es el mismo sitio, el nombre del sitio no se repite.
  const fecha = actualizado ? `${actualizado.anio}, ${actualizado.dia} de ${MESES[actualizado.mes - 1]}` : 's. f.';
  const apa = persona
    ? `Hernández, K. (${fecha}). ${conPunto(titulo)} Edvanta. ${url}`
    : `Edvanta. (${fecha}). ${conPunto(titulo)} ${url}`;

  return { vancouver, apa, url };
}

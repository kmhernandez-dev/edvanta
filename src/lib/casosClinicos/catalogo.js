/**
 * El catálogo /casos-clinicos: preguntas frecuentes, cuándo se indexa
 * y su HTML para buscadores (lo usa scripts/seo-rutas-fijas.mjs).
 */
import { AREAS, CASOS, areaDe } from '../../data/casosClinicos/index.js';
import { RUTA_BASE, casoRevisado } from './motor.js';

export const PREGUNTAS_CASOS = [
  ['¿Los casos clínicos tienen respuestas?', 'Sí. Cada caso muestra la respuesta correcta y su explicación al comprobar (modo estudio) o al entregar (modo parcial), con la referencia bibliográfica de donde sale.'],
  ['¿Para quién son estos exámenes de práctica?', 'Para estudiantes de química farmacéutica, medicina, enfermería, regencia de farmacia y otras carreras de la salud que preparan parciales de farmacología y farmacoterapia, y para profesionales que quieren repasar.'],
  ['¿Cómo se calcula la nota?', 'La nota va de 0,0 a 5,0 según el porcentaje de puntos acertados, como en los parciales en Colombia; se aprueba con 3,0. La racha y la pista solo cambian los puntos del juego, no la nota.'],
  ['¿Qué tipos de preguntas hay?', 'Selección múltiple con única respuesta, completar el espacio y relacionar columnas, como en los exámenes de la universidad.'],
  ['¿Tienen costo?', 'No. Todos los casos clínicos son gratuitos y no necesitas registrarte. Tu progreso se guarda en tu navegador.'],
  ['¿Los casos son reales?', 'No. Son casos ficticios construidos con las guías y las fichas técnicas vigentes para practicar decisiones reales. No reemplazan el criterio clínico ni las guías locales.'],
];

/** El catálogo se indexa cuando hay al menos tres casos revisados. */
export const robotsDelCatalogo = () => (CASOS.filter(casoRevisado).length >= 3 ? 'index,follow' : 'noindex,follow');

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** HTML del catálogo para buscadores: los casos por área y las preguntas frecuentes. */
export function htmlDelCatalogo() {
  const partes = [];
  const preguntas = CASOS.reduce((s, c) => s + c.preguntas.length, 0);
  partes.push(`<p>${CASOS.length} casos clínicos con ${preguntas} preguntas tipo parcial de farmacología y farmacoterapia: selección múltiple, completar y relacionar, con nota de 0 a 5 y la explicación citada de cada respuesta. Gratis y sin registro.</p>`);
  for (const a of AREAS) {
    const casos = CASOS.filter((c) => c.area === a.slug);
    if (!casos.length) continue;
    partes.push(`<section><h2>${esc(a.nombre)}</h2><ul>${casos.map((c) => `<li><a href="${RUTA_BASE}/${esc(c.slug)}">${esc(c.titulo)}</a>: ${esc(c.seo.descripcion)}</li>`).join('')}</ul></section>`);
  }
  partes.push(`<section><h2>Preguntas frecuentes</h2>${PREGUNTAS_CASOS.map(([q, r]) => `<h3>${esc(q)}</h3><p>${esc(r)}</p>`).join('')}</section>`);
  return partes.join('');
}

export { areaDe };

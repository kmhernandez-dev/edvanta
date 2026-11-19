/**
 * cursos-por-escuela.mjs — Qué cursos propios enlaza cada escuela en el
 * HTML del servidor
 *
 * Las escuelas (/escuelas/<slug>) son las páginas pilar para las búsquedas
 * amplias («cursos de farmacología», «cursos de habilidades blandas»).
 * Para que Google vea la relación escuela → curso sin JavaScript, el
 * prerender enlaza todos los cursos propios de la escuela con su búsqueda
 * principal como texto del enlace.
 *
 * Fuente: api/lib/seo-cursos-propios.js (un curso propio publicado = una
 * búsqueda principal). La escuela se deduce de la dirección; una prueba
 * exige que ningún curso quede sin escuela.
 */
import { PALABRA_CLAVE_DE_PROPIOS } from '../../api/lib/seo-cursos-propios.js';

/** En orden: la primera regla que casa gana. */
const REGLAS = [
  ['habilidades-blandas', /oratoria|comunicacion|liderazgo|negociacion|emocional|storytelling|servicio-al-cliente|lenguaje-corporal|camara|hablar-en-publico|trabajo-en-equipo/],
  ['asuntos-regulatorios', /regulator|regulacion|registro-sanitario|invima|dossier|etiquetado|vitales|bioequivalencia|radiofarmac|estabilidad|renovacion|modificaciones|requerimientos/],
  ['salud-y-farmacia-clinica', /farmacolog|farmacoterapia|anticoagul|oncolog|inmunoterapia|quimioterapia|terapias-dirigidas|central-de-mezclas|preparaciones-magistrales|tiroides|psicofarmac|antimicrob|antibiot/],
  ['calidad-y-produccion-farmaceutica', /calidad|bpm|manufactura|laboratorio|documentacion|desviaciones|capa|riesgos|validacion|auditoria|manipulacion-de-alimentos|produccion|limpieza/],
];

/** Escuela de un curso propio por su dirección, o null. */
export function escuelaDeCurso(ruta) {
  const r = String(ruta || '').toLowerCase();
  const regla = REGLAS.find(([, re]) => re.test(r));
  return regla ? regla[0] : null;
}

/**
 * Cursos propios de una escuela: [{ ruta, busqueda }], en orden alfabético
 * de la búsqueda para que el HTML no cambie de un build a otro.
 */
export function cursosPropiosDeEscuela(slug, claves = PALABRA_CLAVE_DE_PROPIOS) {
  return Object.entries(claves)
    .filter(([ruta]) => escuelaDeCurso(ruta) === slug)
    .map(([ruta, busqueda]) => ({ ruta, busqueda }))
    .sort((a, b) => a.busqueda.localeCompare(b.busqueda, 'es'));
}

/**
 * ============================================================
 *  lib/cv/redaccion.js — Ayudas para escribir rápido
 *
 *  Lo que más demora al hacer una hoja de vida es el texto: el
 *  perfil, los logros y las habilidades. Aquí están las ayudas que
 *  usa el modo rápido:
 *
 *   · años de experiencia calculados de las fechas ya escritas
 *   · un perfil redactado con los datos de la persona (editable)
 *   · logros y habilidades sugeridos según el cargo objetivo
 *
 *  Nada se inventa: el perfil se arma solo con lo que la persona
 *  ya escribió, y las sugerencias se marcan como tales.
 * ============================================================
 */

import { cargosEmpleo, keywordsTransversales, VERBOS_ACCION } from '../../data/empleo/cargos.js';
import { leerRango, mesesDeExperiencia, normalizar } from './lector.js';

export const VERBOS = [
  'Lideré', 'Implementé', 'Reduje', 'Aumenté', 'Coordiné', 'Validé', 'Diseñé', 'Optimicé',
  'Gestioné', 'Capacité', 'Documenté', 'Automaticé', 'Atendí', 'Superé',
];

/** Años de experiencia a partir de las fechas de cada cargo. */
export function anosDeExperiencia(experiencia = [], hoy = new Date()) {
  const rangos = experiencia
    .map((e) => leerRango(`${e.inicio || ''} - ${e.fin || 'Actual'}`, hoy))
    .filter(Boolean);
  if (!rangos.length) return 0;
  return Math.round((mesesDeExperiencia(rangos) / 12) * 10) / 10;
}

const areaDeCargo = (slug) => cargosEmpleo.find((c) => c.slug === slug)?.area || '';

/** El logro con dato numérico más corto (sirve como cierre del perfil). */
function logroDestacado(cv) {
  const logros = (cv.experiencia || [])
    .flatMap((e) => String(e.logros || '').split('\n'))
    .map((l) => l.replace(/^[•\-–*]\s*/, '').trim())
    .filter(Boolean);
  const conCifra = logros.filter((l) => /\d|%/.test(l));
  return (conCifra.length ? conCifra : logros).sort((a, b) => a.length - b.length)[0] || '';
}

/**
 * Redacta un perfil profesional con lo que ya está escrito.
 * Devuelve '' si no hay datos suficientes para decir algo real.
 */
export function redactarPerfil(cv, cargoSlug = '') {
  const titulo = String(cv.titulo || '').trim()
    || cargosEmpleo.find((c) => c.slug === cargoSlug)?.cargo
    || '';
  if (!titulo && !(cv.experiencia || []).length) return '';

  const anos = anosDeExperiencia(cv.experiencia);
  const habilidades = (cv.habilidades || []).slice(0, 4);
  const empresas = (cv.experiencia || []).map((e) => e.empresa).filter(Boolean);
  const logro = logroDestacado(cv);
  const area = areaDeCargo(cargoSlug);

  const frases = [];
  const inicio = titulo || 'Profesional del sector farmacéutico';
  if (anos >= 1) {
    const cantidad = anos >= 2 ? `${Math.floor(anos)} años` : 'más de un año';
    frases.push(`${inicio} con ${cantidad} de experiencia${area ? ` en ${area}` : ''}${empresas.length ? ` en ${empresas[0]}` : ''}.`);
  } else if ((cv.experiencia || []).length) {
    frases.push(`${inicio} con experiencia${area ? ` en ${area}` : ''}${empresas.length ? ` en ${empresas[0]}` : ''}.`);
  } else {
    frases.push(`${inicio} en formación, con interés en ${area || 'la industria farmacéutica'}.`);
  }
  if (habilidades.length >= 2) {
    frases.push(`Manejo de ${habilidades.slice(0, -1).join(', ')} y ${habilidades[habilidades.length - 1]}.`);
  } else if (habilidades.length === 1) {
    frases.push(`Manejo de ${habilidades[0]}.`);
  }
  if (logro) frases.push(logro.endsWith('.') ? logro : `${logro}.`);
  return frases.join(' ');
}

/** Logros de ejemplo del cargo que la persona todavía no usó. */
export function sugerenciasDeLogros(cargoSlug = '', usados = []) {
  const cargo = cargosEmpleo.find((c) => c.slug === cargoSlug);
  if (!cargo) return [];
  const yaEstan = usados.map(normalizar);
  return (cargo.logros || []).filter((l) => !yaEstan.some((u) => u.includes(normalizar(l).slice(0, 25))));
}

/** Habilidades del cargo y del sector que aún no están en la lista. */
export function sugerenciasDeHabilidades(cargoSlug = '', actuales = []) {
  const cargo = cargosEmpleo.find((c) => c.slug === cargoSlug);
  const base = cargo
    ? [...(cargo.habilidades || []), ...(cargo.palabras || [])]
    : keywordsTransversales;
  const tengo = actuales.map(normalizar);
  const vistas = new Set();
  return base.filter((h) => {
    const n = normalizar(h);
    if (!n || tengo.includes(n) || vistas.has(n)) return false;
    vistas.add(n);
    return true;
  }).slice(0, 14);
}

/** Cargos del catálogo, para sugerir el título profesional. */
export const cargosSugeridos = () => cargosEmpleo.map((c) => ({ slug: c.slug, cargo: c.cargo, area: c.area }));

export { VERBOS_ACCION };

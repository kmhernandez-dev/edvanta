/**
 * Progreso de quien practica, guardado solo en su navegador: la mejor
 * nota por caso, los puntos acumulados (XP) y los días seguidos de
 * práctica. Es una comodidad: si el navegador no deja guardar (modo
 * privado, datos borrados), todo funciona igual sin progreso.
 */
const CLAVE = 'edvanta-casos-clinicos-v1';

const vacio = () => ({ casos: {}, xp: 0, dias: [] });

export function leerProgreso() {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return vacio();
    const p = JSON.parse(crudo);
    return { ...vacio(), ...p, casos: p.casos || {}, dias: Array.isArray(p.dias) ? p.dias : [] };
  } catch {
    return vacio();
  }
}

const hoy = () => new Date().toISOString().slice(0, 10);

/** Guarda un intento y devuelve el progreso actualizado (y si fue récord). */
export function guardarIntento(slug, { porcentaje, nota, puntos }) {
  const p = leerProgreso();
  const antes = p.casos[slug];
  const record = !antes || porcentaje > antes.mejor;
  p.casos[slug] = {
    mejor: Math.max(porcentaje, antes?.mejor || 0),
    nota: record ? nota : antes.nota,
    intentos: (antes?.intentos || 0) + 1,
    ultimo: hoy(),
  };
  p.xp = (p.xp || 0) + Math.max(0, puntos);
  if (!p.dias.includes(hoy())) p.dias = [...p.dias, hoy()].slice(-60);
  try { window.localStorage.setItem(CLAVE, JSON.stringify(p)); } catch { /* sin almacenamiento */ }
  return { progreso: p, record, anterior: antes || null };
}

/** Días seguidos de práctica que terminan hoy o ayer. */
export function rachaDeDias(dias = []) {
  const set = new Set(dias);
  const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(d.toISOString().slice(0, 10))) { n += 1; d.setDate(d.getDate() - 1); }
  return n;
}

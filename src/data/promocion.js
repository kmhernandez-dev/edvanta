/**
 * ============================================================
 *  promocion.js — La oferta vigente (una sola fuente)
 *
 *  Decisión de la dueña (11-nov-2026): 20 % en todas las guías de
 *  Hotmart con el cupón EDVANTA20, hasta el 30 de noviembre de 2026 a
 *  las 11:59 p. m. (hora de Colombia). El cupón se crea en Hotmart: aquí
 *  solo se anuncia. Al vencer, todo lo que la muestra se apaga solo.
 *
 *  La API tiene la misma oferta en api/lib/aula/promocion.js (para los
 *  correos); una prueba comprueba que digan lo mismo.
 *
 *  Para una oferta nueva: cambia estos valores. Nunca anuncies un
 *  descuento que no exista en Hotmart: es publicidad engañosa.
 * ============================================================
 */

export const PROMOCION = {
  id: 'noviembre-2026',
  codigo: 'EDVANTA20',
  porcentaje: 20,
  hasta: '2026-11-30T23:59:59-05:00',
  fechaTexto: '30 de noviembre',
};

export const promoActiva = (ahora = new Date()) => ahora < new Date(PROMOCION.hasta);

/** Lo que falta para que termine, en días, horas, minutos y segundos. */
export function tiempoRestante(ahora = new Date()) {
  const ms = Math.max(0, new Date(PROMOCION.hasta) - ahora);
  const s = Math.floor(ms / 1000);
  return { dias: Math.floor(s / 86400), horas: Math.floor((s % 86400) / 3600), minutos: Math.floor((s % 3600) / 60), segundos: s % 60 };
}

/**
 * Enlace de Hotmart con el cupón ya puesto (offDiscount). Si Hotmart no
 * lo aplicara, la persona lo escribe: el código se muestra siempre.
 */
export function conCupon(url, ahora = new Date()) {
  if (!url || !promoActiva(ahora)) return url;
  try {
    const u = new URL(url);
    if (!/(^|\.)hotmart\.com$/.test(u.hostname)) return url;
    u.searchParams.set('offDiscount', PROMOCION.codigo);
    return u.toString();
  } catch {
    return url;
  }
}

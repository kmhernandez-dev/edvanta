/**
 * La oferta vigente, para los correos. Es la misma de src/data/promocion.js
 * (una prueba del sitio comprueba que coincidan). Al vencer, los correos
 * dejan de mostrarla solos.
 */
export const PROMOCION = {
  id: 'noviembre-2026',
  codigo: 'EDVANTA20',
  porcentaje: 20,
  hasta: '2026-11-30T23:59:59-05:00',
  fechaTexto: '30 de noviembre',
};

export const promoActiva = (ahora = new Date()) => ahora < new Date(PROMOCION.hasta);

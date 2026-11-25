/**
 * Estado del certificado de un curso para quien estudia (precio, plazo,
 * si ya pagó). La barra superior y el recordatorio bajo cada clase lo
 * piden a la vez: una sola consulta por curso, guardada un minuto.
 */
import { get, post } from './api';
import { pedirAceptacion } from '../lib/aceptacionCompra';

const cache = new Map(); // courseId → { promesa, hasta }
const UN_MINUTO = 60 * 1000;

export function estadoDelCertificado(courseId) {
  const ahora = Date.now();
  const previo = cache.get(courseId);
  if (previo && previo.hasta > ahora) return previo.promesa;
  const promesa = get(`/me/courses/${courseId}/certificate`).catch(() => null);
  cache.set(courseId, { promesa, hasta: ahora + UN_MINUTO });
  return promesa;
}

/** ¿Estudia gratis un curso con certificado de pago? */
export const estudiaGratis = (d) => Boolean(d && !d.certificado && d.pago?.requerido && d.pago.estado === 'sin_pagar');

/** Abre Mercado Pago con el certificado del curso. */
export async function pagarCertificado(courseId, volverA) {
  // Aceptación expresa de los términos y del acceso inmediato (Ley 1480, art. 47).
  if (!(await pedirAceptacion())) {
    const cancelado = new Error('');
    cancelado.cancelado = true;
    throw cancelado;
  }
  const res = await post('/me/checkout', { items: [{ id: `certificado-${courseId}` }], volverA, aceptaTerminos: true });
  if (!res?.initPoint) throw new Error('No se pudo abrir Mercado Pago. Intenta de nuevo.');
  window.location.href = res.initPoint;
}

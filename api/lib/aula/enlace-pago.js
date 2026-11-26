/**
 * Enlace de pago de Mercado Pago para vender cursos por WhatsApp.
 *
 * Decisión de Karla (26-nov-2026): en el sitio se cobra con el pago
 * integrado (precio por país y plazo, aceptación de términos y apertura
 * automática del curso). Este enlace fijo, «Curso de Edvanta» por
 * COP 60.000, es solo para las ventas que se cierran por WhatsApp: Assist
 * arma el mensaje y, cuando el pago aparece en Mercado Pago, «Registrar
 * pago y abrir el curso» lo habilita (concederPagoDeCertificado).
 */
export const ENLACE_PAGO_WHATSAPP = Object.freeze({
  url: 'https://mpago.li/2T6UAUr',
  precio: 60000,
  nombre: 'Curso de Edvanta',
});

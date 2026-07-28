/**
 * ============================================================
 *  CONFIGURACIÓN DE ENLACES COMERCIALES
 *  Edita estos valores para conectar tu plataforma con
 *  WhatsApp, Hotmart, formularios y correo electrónico.
 * ============================================================
 */

// ─── WhatsApp ────────────────────────────────────────────────
// Coloca aquí tu número con código de país y SIN signos ni espacios.
// Ej. Colombia: 573001234567  |  México: 525512345678
export const WHATSAPP_NUMBER = '573006332244';

// URL base lista para usar (mensaje genérico).
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20packs%20profesionales`;
export const EDVANTA_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20equipo%20Edvanta.%20Quiero%20orientaci%C3%B3n%20sobre%20cursos%20y%20rutas%20profesionales`;

// Helper: arma un enlace de WhatsApp con cualquier mensaje.
export function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Hotmart ─────────────────────────────────────────────────
// URL base de tu tienda o producto principal en Hotmart.
export const HOTMART_URL = 'https://hotmart.com/es/marketplace/productos/salud-y-bienestar';

// ─── Formulario de captación de leads ────────────────────────
export const LEAD_FORM_URL = 'https://edvanta.co/feliz-sin-tiroides#fst-recursos';

// ─── Correo electrónico ───────────────────────────────────────
export const EMAIL = 'felizsintiroides@gmail.com';
export const EDVANTA_EMAIL = 'contacto@edvanta.co';

// ─── Nombre de la marca ───────────────────────────────────────
export const BRAND_NAME = 'Edvanta';
export const BRAND_FULL = 'Edvanta';
export const EDVANTA_BRAND_NAME = 'Edvanta';
export const EDVANTA_BRAND_FULL = 'Edvanta';

// ─── Redes sociales (opcionales) ─────────────────────────────
export const LINKEDIN_URL = 'https://www.linkedin.com/in/karla-hernandez-720ab11a9';
export const EDVANTA_LINKEDIN_URL = '';
export const INSTAGRAM_URL = '';

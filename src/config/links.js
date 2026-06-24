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
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Karla%2C%20quiero%20información%20sobre%20los%20packs%20profesionales`;

// Helper: arma un enlace de WhatsApp con cualquier mensaje.
export function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Hotmart ─────────────────────────────────────────────────
// URL base de tu tienda o producto principal en Hotmart.
// Puedes tener una URL por pack sobreescribiéndola en products.js.
export const HOTMART_URL = 'https://hotmart.com/tu-tienda';

// ─── Formulario de captación de leads ────────────────────────
// Puede ser Google Forms, Typeform, Notion, ConvertKit, etc.
export const LEAD_FORM_URL = 'https://forms.gle/tu-formulario';

// ─── Correo electrónico ───────────────────────────────────────
export const EMAIL = 'felizsintiroides@gmail.com';

// ─── Nombre de la marca ───────────────────────────────────────
export const BRAND_NAME = 'Biblioteca Profesional KH';
export const BRAND_FULL = 'Biblioteca Profesional Karla Hernández';

// ─── Redes sociales (opcionales) ─────────────────────────────
export const LINKEDIN_URL = 'https://www.linkedin.com/in/karla-hernandez-720ab11a9';
export const INSTAGRAM_URL = '';

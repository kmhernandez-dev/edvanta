/**
 * Formatea un número como precio en pesos colombianos (COP).
 * Cambia 'es-CO' y 'COP' si quieres otra moneda (ej: 'es-MX' / 'MXN').
 */
export function formatPrice(value) {
  if (value == null) return '';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

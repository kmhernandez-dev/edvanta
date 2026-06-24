/**
 * ============================================================
 *  CATÁLOGO SERVER-SIDE — fuente de verdad de precios
 *
 *  El navegador NUNCA debe poder dictar el precio de un producto.
 *  Cualquier valor enviado desde el cliente es IGNORADO y
 *  reemplazado por el precio definido en este archivo.
 *
 *  Moneda por defecto: COP. Si agregas productos en otra moneda,
 *  agrega también el campo 'currency_id' (ej. 'MXN', 'ARS', 'PEN').
 *
 *  Cómo agregar un producto nuevo:
 *    1) Crea el producto en src/data/products.js (o fst.js).
 *    2) Copia el mismo 'id' y 'price' aquí.
 *    3) Listo. create-preference.js lo reconocerá.
 * ============================================================
 */
export const CATALOG = {
  // ── Packs profesionales (Biblioteca KH) ──────────────────
  'atencion-farmaceutica':    { name: 'Kit de Atención Farmacéutica Pro',                  price: 44900 },
  'calidad-farmaceutica':     { name: 'Sistema de Calidad Farmacéutica 360',               price: 44900 },
  'calidad-auditoria':        { name: 'Pack Calidad, Auditoría y Mejora Continua Pro',     price: 44900 },
  'calidad-clinica':          { name: 'Pack Calidad Clínica y Seguridad del Paciente',     price: 39900 },
  'indicadores-dashboards':   { name: 'Suite de Indicadores y Dashboards Pro',              price: 39900 },
  'empleabilidad-farmasalud': { name: 'Kit de Empleabilidad FarmaSalud',                    price: 24900 },

  // ── Ebooks Feliz Sin Tiroides ────────────────────────────
  'fst-coleccion-sana':         { name: 'Colección SANA TU TIROIDES desde 0',              price: 79900 },
  'fst-comer-hipotiroidismo':   { name: 'Aprende a Comer con Hipotiroidismo',              price: 34900 },
  'fst-dieta-antiinflamatoria': { name: 'Aprende a Comer con la Dieta Antiinflamatoria',   price: 34900 },
  'fst-comer-hipertiroidismo':  { name: 'Aprende a Comer para Sanar el Hipertiroidismo',   price: 34900 },
  'fst-guia-ayunos':            { name: 'Guía completa de Ayunos',                         price: 29900 },
  'fst-yodoterapia':            { name: 'Guía práctica para la Yodoterapia I-131',         price: 34900 },
  'fst-diario-hipotiroidismo':  { name: 'Diario de las Emociones para el Hipotiroidismo',  price: 24900 },
  'fst-diario-hipertiroidismo': { name: 'Diario de Manejo de Emociones en Hipertiroidismo',price: 24900 },
  'fst-producto-pendiente':     { name: 'Nuevo recurso para tu tiroides',                  price: 29900 },
};

export const DEFAULT_CURRENCY = 'COP';

/**
 * Devuelve los datos server-side del producto, o null si no existe.
 * Si el id no está en el catálogo, se considera inválido y el pedido se rechaza.
 */
export function getServerProduct(id) {
  if (!id) return null;
  const entry = CATALOG[String(id)];
  if (!entry) return null;
  return {
    id: String(id),
    name: entry.name,
    price: Number(entry.price),
    currency_id: entry.currency_id || DEFAULT_CURRENCY,
  };
}

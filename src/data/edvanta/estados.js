/**
 * ============================================================
 *  estados.js — Cómo se dice qué está listo y qué no
 *
 *  Un solo vocabulario para todo el sitio. Una oferta futura se
 *  muestra como futura: nunca con un botón de compra ni una fecha
 *  que no existe.
 * ============================================================
 */

export const ESTADOS = {
  disponible: {
    etiqueta: 'Disponible',
    clase: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  },
  proxima_apertura: {
    etiqueta: 'Próxima apertura',
    clase: 'bg-amber-50 text-amber-900 ring-amber-200',
  },
  a_solicitud: {
    etiqueta: 'Bajo propuesta',
    clase: 'bg-sky-50 text-sky-900 ring-sky-200',
  },
  en_desarrollo: {
    etiqueta: 'En desarrollo',
    clase: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
};

/** Origen comercial de lo que se muestra. Nunca se presenta lo ajeno como propio. */
export const ORIGENES = {
  propio: 'Producto de Edvanta',
  gratuito: 'Gratis, de Edvanta',
  tercero: 'Curso de otra plataforma',
  afiliado: 'Enlace de afiliado',
};

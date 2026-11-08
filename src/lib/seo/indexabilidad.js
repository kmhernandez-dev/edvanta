const MARCAS_SALUD = new Set(['fst', 'contigo', 'atenfarma']);

const CATEGORIAS_SALUD = new Set([
  'Atención Farmacéutica',
  'Bajar de peso',
  'Enfermedades y síntomas',
  'Farmacoterapia',
  'Feliz Sin Tiroides',
  'Medicamentos',
  'Nutrición y recetas',
  'Plantas medicinales',
]);

export function esContenidoDeSalud(articulo = {}) {
  return MARCAS_SALUD.has(articulo.marca)
    || articulo.publico === 'pacientes'
    || CATEGORIAS_SALUD.has(articulo.category);
}

export function tieneRevisionClinica(articulo = {}) {
  const fecha = articulo.reviewedAt || articulo.reviewed_at || articulo.fechaRevision;
  return Boolean(articulo.revisor && fecha);
}

export function puedeIndexarse(articulo = {}) {
  return !esContenidoDeSalud(articulo) || tieneRevisionClinica(articulo);
}

export function robotsDeArticulo(articulo = {}) {
  return puedeIndexarse(articulo) ? 'index,follow' : 'noindex,follow';
}

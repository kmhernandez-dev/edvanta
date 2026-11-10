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

/**
 * Noticias del paquete editorial del 31-oct-2026 (noticiasFarmaceuticas.js):
 * comparten la mayor parte del texto entre sí (similitud media de 0,65 en
 * las del INVIMA y de 0,51 en las internacionales, medida en noviembre de
 * 2026). Indexadas una por una parecen contenido repetido a escala y frenan
 * la indexación del resto del sitio. Se leen igual, pero el índice las
 * recibe reunidas en /noticias. Una noticia reescrita con contenido propio
 * (qué cambió, a quién afecta en Colombia, qué debe hacer el equipo, fuente
 * y fecha de consulta) lleva `contenidoPropio: true` y vuelve al índice.
 */
export function esNoticiaDePlantilla(articulo = {}) {
  return articulo.category === 'Noticias farmacéuticas'
    && Boolean(articulo.sourceEntity)
    && !articulo.contenidoPropio;
}

export function puedeIndexarse(articulo = {}) {
  if (esNoticiaDePlantilla(articulo)) return false;
  return !esContenidoDeSalud(articulo) || tieneRevisionClinica(articulo);
}

export function robotsDeArticulo(articulo = {}) {
  return puedeIndexarse(articulo) ? 'index,follow' : 'noindex,follow';
}

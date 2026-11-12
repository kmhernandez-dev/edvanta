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

/**
 * Guías de cursos generadas con una sola plantilla (industriaCursos50.js):
 * se parecían entre sí 0,45 en promedio (noviembre de 2026). Se leen igual,
 * pero no se indexan hasta que se reescriben con contenido propio
 * (`contenidoPropio: true`), como las noticias.
 */
export function esGuiaDeCursosDePlantilla(articulo = {}) {
  return String(articulo.mdPath || '').includes('/industria-cursos/') && !articulo.contenidoPropio;
}

export function puedeIndexarse(articulo = {}) {
  if (esNoticiaDePlantilla(articulo)) return false;
  if (esGuiaDeCursosDePlantilla(articulo)) return false;
  return !esContenidoDeSalud(articulo) || tieneRevisionClinica(articulo);
}

export function robotsDeArticulo(articulo = {}) {
  return puedeIndexarse(articulo) ? 'index,follow' : 'noindex,follow';
}

/**
 * Una categoría con menos de 3 artículos indexables es una lista de uno o
 * dos enlaces (Search Console las dejaba en «Descubierta» con 22 a 46
 * palabras). Sigue enlazando, pero no se indexa ni va al sitemap. La usan
 * el prerender (scripts/prerenderizar-paginas.mjs) y la aplicación.
 */
export const MINIMO_POR_CATEGORIA = 3;

export function categoriaIndexable(lista = []) {
  return lista.filter(puedeIndexarse).length >= MINIMO_POR_CATEGORIA;
}

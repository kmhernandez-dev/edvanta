/**
 * ============================================================
 *  lib/slug.js — Direcciones descriptivas
 *
 *  Las mismas reglas que api/lib/slugs-publicos.js (la prueba
 *  src/__tests__/direcciones.test.jsx compara las dos):
 *    · minúsculas, sin tildes, palabras unidas por guiones;
 *    · los cursos se llaman «Curso de …».
 *
 *  Los slugs de los cursos los asigna la API (tabla public_slugs): el
 *  sitio no los calcula, los recibe en `url`. Aquí solo se calculan
 *  los de las páginas que viven en el código (categorías).
 * ============================================================
 */

export function slugify(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/\+/g, ' mas ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Título visible y de buscadores: «Curso de …», salvo que ya diga lo que es. */
export function nombreDeCurso(titulo) {
  const t = String(titulo ?? '').trim();
  if (!t) return '';
  if (/^(curso|certificado|especializaci[oó]n|diplomado|programa|m[aá]ster|maestr[ií]a|taller|seminario)\b/i.test(t)) return t;
  return `Curso de ${t}`;
}

/** Página de una categoría de artículos: /articulos/categoria/gestion-de-calidad */
export const rutaDeCategoria = (nombre) => `/articulos/categoria/${slugify(nombre)}`;

/**
 * Dirección de un curso que llega de la API. Las respuestas nuevas
 * traen `url` (/curso-de-…) o `to`; si no, la vieja, que redirige.
 */
export function rutaDeCurso(curso) {
  if (!curso) return '/cursos';
  if (curso.url) return curso.url;
  if (curso.ruta) return curso.ruta;
  if (curso.to) return curso.to;
  if (curso.slug) return `/cursos/${curso.slug}`;
  return '/cursos';
}

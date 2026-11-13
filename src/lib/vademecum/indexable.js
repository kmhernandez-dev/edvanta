/**
 * Cuándo se indexa el vademécum. Cada página es contenido clínico: se
 * indexa solo con su revisión anotada (REVISION_VADEMECUM). La portada es
 * una lista de esas páginas: se indexa cuando hay al menos tres revisadas,
 * igual que las categorías de artículos.
 */
import { PAGINAS_VADEMECUM } from '../../data/vademecum/index.js';
import { tieneRevisionClinica } from '../seo/indexabilidad.js';

export const robotsDePaginaDelVademecum = (p) => (tieneRevisionClinica(p) ? 'index,follow' : 'noindex,follow');

export const robotsDelVademecum = () =>
  (PAGINAS_VADEMECUM.filter(tieneRevisionClinica).length >= 3 ? 'index,follow' : 'noindex,follow');

/** Título de la pestaña: con «| Edvanta» si cabe en unos 62 caracteres. */
export const tituloDeVademecum = (p) => (p.seo.titulo.length <= 52 ? `${p.seo.titulo} | Edvanta` : p.seo.titulo);

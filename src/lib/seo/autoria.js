import { LINKEDIN_URL } from '../../config/links.js';

export const AUTORA_URL = 'https://edvanta.co/autores/karla-hernandez';
export const EQUIPO_URL = 'https://edvanta.co/equipo-editorial';
export const AUTORA_NOMBRE = 'Karla Melissa Hernández Salcedo';

export function esAutoraKarla(articulo = {}) {
  const autor = String(articulo.autor || '').toLowerCase();
  return autor.includes('karla') || (articulo.marca === 'fst' && !articulo.autor);
}

export function entidadAutor(articulo = {}) {
  if (esAutoraKarla(articulo)) {
    return {
      '@type': 'Person',
      name: AUTORA_NOMBRE,
      url: AUTORA_URL,
      sameAs: LINKEDIN_URL,
    };
  }
  return {
    '@type': 'Organization',
    name: 'Equipo editorial de Edvanta',
    url: EQUIPO_URL,
  };
}

export function entidadRevisor(articulo = {}) {
  if (!articulo.revisor) return null;
  const esKarla = String(articulo.revisor).toLowerCase().includes('karla');
  return {
    '@type': 'Person',
    name: articulo.revisor,
    ...(esKarla ? { url: AUTORA_URL, sameAs: LINKEDIN_URL } : {}),
  };
}


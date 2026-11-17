/**
 * ============================================================
 *  revision-de-clases.js — Quién verificó las clases de los cursos
 *
 *  17-nov-2026: Karla Hernández, química farmacéutica, pidió por escrito
 *  indicar en todas las clases que están verificadas por ella:
 *  «vas a decir que son verificadas por Karla Hernández química
 *  farmacéutica».
 *
 *  La página pública de cada clase lo muestra junto al título, con enlace
 *  a su perfil de autora, y lo declara en los datos estructurados
 *  (WebPage.reviewedBy y lastReviewed). El aula lo muestra en cada clase.
 *
 *  Sin dependencias del frontend: lo importan la API y la aplicación.
 * ============================================================
 */
export const REVISION_DE_CLASES = {
  nombre: 'Karla Hernández',
  nombreCompleto: 'Karla Melissa Hernández Salcedo',
  profesion: 'Química farmacéutica',
  perfil: '/autores/karla-hernandez',
  // El mismo @id de la Person en /autores/karla-hernandez (scripts/seo-rutas-fijas.mjs).
  personaId: 'https://edvanta.co/autores/karla-hernandez#person',
  linkedin: 'https://www.linkedin.com/in/karla-hernandez-720ab11a9',
  fecha: '2026-11-17',
};

/** «17 de noviembre de 2026» */
export function fechaLarga(iso) {
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const [a, m, d] = String(iso).split('-').map(Number);
  return `${d} de ${meses[m - 1]} de ${a}`;
}

/** La Person de la revisora para los datos estructurados. */
export function personaRevisora(sitio = 'https://edvanta.co') {
  const r = REVISION_DE_CLASES;
  return {
    '@type': 'Person',
    '@id': r.personaId,
    name: r.nombreCompleto,
    jobTitle: r.profesion,
    url: `${sitio}${r.perfil}`,
    sameAs: [r.linkedin],
  };
}

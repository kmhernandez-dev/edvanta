/**
 * Lecturas recientes de esta persona, en este navegador. Sirve para
 * «Retoma tu lectura» en el índice de artículos. Es una comodidad: si el
 * navegador no deja guardar, simplemente no aparece.
 */
const CLAVE = 'ed_lecturas';

export function lecturasRecientes() {
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE) || '[]');
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function registrarLectura(slug) {
  try {
    const lista = [slug, ...lecturasRecientes().filter((s) => s !== slug)].slice(0, 6);
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

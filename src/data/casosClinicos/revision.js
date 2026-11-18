/**
 * ============================================================
 *  Revisión clínica de los casos clínicos (/casos-clinicos)
 *
 *  Los casos son contenido clínico para estudiantes y profesionales de
 *  la salud: no se indexan hasta que Karla Hernández, química
 *  farmacéutica, los lee y aprueba por escrito. Entonces se anota aquí
 *  el slug con la fecha y el caso pasa a index,follow y al sitemap.
 *
 *  Mientras tanto la página funciona igual (se puede practicar), pero
 *  sale con noindex,follow.
 *
 *  Nunca agregar una línea sin la confirmación escrita de Karla.
 * ============================================================
 */
import { LINKEDIN_URL } from '../../config/links.js';

/** Revisión de Karla con su fecha. */
export const revisadoPorKarla = (fecha) => ({
  revisor: 'Karla Hernández, Química Farmacéutica',
  revisorUrl: LINKEDIN_URL,
  reviewedAt: fecha,
});

/** slug → { revisor, revisorUrl, reviewedAt }. Vacío hasta la aprobación de Karla. */
export const REVISION_CASOS = {};

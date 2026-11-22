/**
 * Monografías profesionales de medicamentos oncológicos de alto costo.
 * Cada archivo de esta carpeta trae los registros profesionales de un tipo de
 * terapia; src/data/vademecum/lib/altoCosto.js los une con la ficha para
 * pacientes y el CUM. No se indexan hasta la revisión clínica.
 */
import { monografiasDeAltoCosto } from '../lib/altoCosto.js';
import { INMUNOTERAPIA } from './inmunoterapia.js';
import { HORMONOTERAPIA } from './hormonoterapia.js';
import { DIRIGIDA_PARENTERAL } from './dirigidaParenteral.js';
import { DIRIGIDA_ORAL } from './dirigidaOral.js';
import { QUIMIOTERAPIA } from './quimioterapia.js';
import { SOPORTE } from './soporte.js';

export const MONOGRAFIAS_ALTO_COSTO = monografiasDeAltoCosto([
  ...INMUNOTERAPIA,
  ...HORMONOTERAPIA,
  ...DIRIGIDA_PARENTERAL,
  ...DIRIGIDA_ORAL,
  ...QUIMIOTERAPIA,
  ...SOPORTE,
]);

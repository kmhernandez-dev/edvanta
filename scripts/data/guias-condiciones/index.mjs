/**
 * Guías de condición, en el orden en que se publican.
 * Las consume scripts/generar-guias-condiciones.mjs.
 */
import { ONCOLOGIA } from './oncologia.mjs';
import { CRONICAS } from './cronicas.mjs';

export const GUIAS_CONDICIONES = [...ONCOLOGIA, ...CRONICAS];

/**
 * Registros de las fichas de medicamentos de alto costo, en el orden en
 * que se publican. Los consume scripts/generar-fichas-alto-costo.mjs.
 */
import { REUMA } from './reuma.mjs';
import { ONCOLOGIA_1 } from './oncologia-1.mjs';
import { ONCOLOGIA_2 } from './oncologia-2.mjs';
import { QUIMIOTERAPIA } from './quimioterapia.mjs';
import { VIH } from './vih.mjs';
import { HEPATITIS_HEMOFILIA } from './hepatitis-hemofilia.mjs';
import { ESCLEROSIS_MULTIPLE } from './esclerosis-multiple.mjs';
import { HUERFANAS } from './huerfanas.mjs';
import { ADICIONALES } from './adicionales.mjs';

export const FICHAS_ALTO_COSTO = [
  ...REUMA, ...ONCOLOGIA_1, ...ONCOLOGIA_2, ...QUIMIOTERAPIA, ...VIH,
  ...HEPATITIS_HEMOFILIA, ...ESCLEROSIS_MULTIPLE, ...HUERFANAS, ...ADICIONALES,
];

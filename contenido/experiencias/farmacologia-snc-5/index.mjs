import { CLASES as CLASES_SNC_4 } from '../farmacologia-snc-4/index.mjs';

export { CURSO } from '../farmacologia-snc-4/index.mjs';
export const MIGRACION = '155_experiencias_farmacologia_snc_5.sql';

export const CLASES = CLASES_SNC_4.filter(
  (clase) => clase.titulo === 'Tratamiento preventivo: anticuerpos anti-CGRP y fármacos orales',
);

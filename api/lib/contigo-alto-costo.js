/**
 * ============================================================
 *  contigo-alto-costo.js — Reglas del programa Contigo Alto Costo
 *
 *  Listas cerradas y textos de autorización. Deben coincidir con
 *  src/data/edvanta/contigoAltoCosto.js (la prueba lo comprueba).
 *
 *  Condiciones: las enfermedades de alto costo que sigue la Cuenta de
 *  Alto Costo (cuentadealtocosto.org, consulta del 21-nov-2026), más
 *  «otra» para tratamientos de alto costo fuera de esa lista.
 * ============================================================
 */

export const VERSION_CONSENTIMIENTO = 'AC-2026-11-v1';

export const CONDICIONES = [
  'artritis-reumatoide',
  'cancer',
  'enfermedad-renal-cronica',
  'hemofilia',
  'hepatitis-c',
  'vih',
  'enfermedad-huerfana',
  'otra',
];

export const NECESIDADES = [
  'entender-tratamiento',
  'acceso-y-entregas',
  'efectos-adversos',
  'organizar-tomas',
  'apoyo-emocional',
  'comunidad',
  'cuidadores',
];

/** Finalidades con autorización independiente. Solo la primera es necesaria para registrarse. */
export const FINALIDADES = [
  'datos_personales',
  'datos_sensibles',
  'comunicaciones',
  'contacto_qf',
  'estudios_anonimizados',
  'info_terceros',
];

/** Grupos por debajo de este tamaño no se muestran en los resúmenes. */
export const MINIMO_PARA_MOSTRAR = 5;

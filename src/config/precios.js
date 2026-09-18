/**
 * ============================================================
 *  precios.js — Precios de los servicios propios de Edvanta
 *
 *  Un solo lugar para los valores que se muestran en las landing.
 *  Cambiar el número aquí lo cambia en toda la plataforma.
 * ============================================================
 */

/**
 * Vitrina de talento destacada (/talento).
 * El perfil básico en el directorio es gratuito; esto es el
 * destacado que se envía a las empresas.
 *
 * ⚠️ Valor provisional: ajústalo al precio definitivo antes de
 * promocionarlo. `usd` es el precio y `meses`, la vigencia.
 */
export const VITRINA_TALENTO = {
  usd: 19,
  meses: 3,
  get etiqueta() { return `USD ${this.usd}`; },
  get vigencia() { return `${this.meses} meses`; },
};

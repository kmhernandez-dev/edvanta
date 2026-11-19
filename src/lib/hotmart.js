/**
 * Enlaces de compra de Hotmart.
 *
 * `src` le dice a Hotmart (y al webhook de Edvanta, que lo guarda en
 * ventas_guias) de qué página y de qué botón vino cada venta:
 * edv-<guía>-<origen>. Se agrega sin tocar `off` ni `sck`.
 */
export function conOrigen(url, slug, origen) {
  try {
    const u = new URL(url);
    u.searchParams.set('src', `edv-${slug}-${origen}`.slice(0, 60));
    return u.toString();
  } catch {
    return url;
  }
}

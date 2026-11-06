/**
 * Preferencias de pago de Mercado Pago.
 *
 * Devuelve una función que crea una preferencia con el cuerpo que se le
 * pase. Así el aula puede inyectar otra en las pruebas sin tocar la red.
 */
import { MercadoPagoConfig, Preference } from 'mercadopago';

export function crearPreferenciaMercadoPago(accessToken) {
  if (!accessToken) return null;
  const preference = new Preference(new MercadoPagoConfig({ accessToken }));
  return (body) => preference.create({ body });
}

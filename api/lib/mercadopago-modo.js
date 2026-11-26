/**
 * ¿MP_ACCESS_TOKEN es de prueba o de producción? Sin exponer el token.
 *
 * El checkout de Mercado Pago muestra «Algo salió mal… Una de las partes con
 * la que intentas hacer el pago es de prueba» cuando el token del servidor es
 * de una cuenta o credencial de prueba y quien paga es una persona real (o al
 * revés). /api/health muestra el modo para detectarlo sin entrar a Coolify.
 *
 *   prueba       token TEST-… o de un usuario de prueba (tag test_user)
 *   produccion   token de una cuenta real
 *   token_invalido / sin_token / desconocido
 */
let modo = 'desconocido';

export const modoMercadoPago = () => modo;

export async function detectarModoMercadoPago(token = process.env.MP_ACCESS_TOKEN, fetchImpl = globalThis.fetch) {
  if (!token) return (modo = 'sin_token');
  if (token.startsWith('TEST-')) return (modo = 'prueba');
  try {
    const r = await fetchImpl('https://api.mercadopago.com/users/me', {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    if (r.status === 401) return (modo = 'token_invalido');
    if (!r.ok) return (modo = 'desconocido');
    const usuario = await r.json();
    const tags = Array.isArray(usuario?.tags) ? usuario.tags : [];
    const esPrueba = tags.includes('test_user') || /^TEST/i.test(String(usuario?.nickname || ''));
    return (modo = esPrueba ? 'prueba' : 'produccion');
  } catch {
    return (modo = 'desconocido');
  }
}

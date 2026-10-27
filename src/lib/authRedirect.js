/**
 * Rutas internas de vuelta tras entrar.
 *
 * El destino viaja en la dirección (Google lo devuelve tal cual), así que
 * cualquiera puede escribirla. Solo se aceptan rutas de esta plataforma y
 * se descartan las pantallas de acceso para no entrar en un bucle.
 */

const INTERNAL_PATH = /^\/(?!\/)[\w\-./?=&%#]*$/;

export function isInternalPath(value) {
  if (typeof value !== 'string') return false;
  const path = value.trim();
  return INTERNAL_PATH.test(path) && !path.includes('\\');
}

export function safeNextPath(value, fallback = '/aula') {
  if (!isInternalPath(value)) return fallback;
  const path = value.trim();
  const authRoute = /^\/(cuenta|app|diagnostico)(?:[/?#]|$)/.test(path);
  if (!authRoute) return path;

  // /app/perfil sí es una pantalla real de la cuenta. El resto son pasos
  // de acceso: volver a ellos dejaría a la persona dando vueltas.
  if (path === '/app/perfil' || path.startsWith('/app/perfil?') || path.startsWith('/app/perfil/')) {
    return path;
  }
  return fallback;
}

export function authRedirect(path, fallback = '/mi-espacio') {
  const safePath = isInternalPath(path) ? path.trim() : fallback;
  return `${window.location.origin}${safePath}`;
}

/**
 * ============================================================
 *  config/api.js — Endpoint base del backend
 *
 *  En desarrollo (Vite local) → '/api'  (proxy del dev server
 *                                  o fallback a localhost)
 *  En producción (build de Coolify) → process.env.VITE_API_URL
 *
 *  VITE_API_URL se puede setear en build-time desde Coolify.
 *  Recomendado en produccion actual: dejarlo vacio para usar
 *  rutas relativas /api/* servidas por nginx en edvanta.co.
 *
 *  En Coolify puedes dejarlo vacío si vas a usar un proxy
 *  reverso (Traefik) que enrute /api/* al contenedor backend.
 *  En ese caso, devolvemos '/api' y todo queda relativo.
 * ============================================================
 */
const RAW = (import.meta.env.VITE_API_URL || '').trim();

export const API_BASE = RAW
  ? RAW.replace(/\/+$/, '')              // sin slash final
  : (import.meta.env.DEV ? '/api' : ''); // dev: relativo al proxy; prod sin var: relativo al mismo host

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

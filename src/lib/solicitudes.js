/**
 * ============================================================
 *  solicitudes.js — Enviar interés, propuestas y contacto
 *
 *  Devuelve { ok: true } solo cuando el servidor guardó la solicitud
 *  (201). Cualquier otra cosa es un error con un mensaje que se puede
 *  mostrar tal cual. Nunca lanza.
 * ============================================================
 */

import { apiUrl } from '../config/api';

export async function enviarSolicitud(datos) {
  try {
    const res = await fetch(apiUrl('/api/aula/solicitudes'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Aula-Request': '1', Accept: 'application/json' },
      body: JSON.stringify(datos),
    });
    const json = await res.json().catch(() => null);
    if (res.status === 201 && json?.ok) return { ok: true };
    return {
      ok: false,
      error: json?.error?.message || 'No pudimos guardar tu solicitud. Inténtalo de nuevo en unos minutos.',
      campo: json?.error?.field || null,
    };
  } catch {
    return { ok: false, error: 'No hay conexión con Edvanta en este momento. Revisa tu internet e inténtalo de nuevo.' };
  }
}

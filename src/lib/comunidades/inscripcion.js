/**
 * ============================================================
 *  inscripcion.js — Enviar la inscripción a un grupo de apoyo
 *
 *  Devuelve { ok: true } solo cuando el servidor guardó la inscripción
 *  (201). Cualquier otra cosa es un error con un mensaje que se puede
 *  mostrar tal cual. Nunca lanza.
 *
 *  `recordarInscripcion` deja en este navegador que la persona ya se
 *  inscribió (solo el nombre y la fecha, nada de salud), para mostrarle
 *  su espacio al volver. Si el navegador no guarda, no pasa nada.
 * ============================================================
 */

import { apiUrl } from '../../config/api';

export async function enviarInscripcion(slug, datos) {
  try {
    const res = await fetch(apiUrl(`/api/aula/comunidades/${encodeURIComponent(slug)}/inscripcion`), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Aula-Request': '1', Accept: 'application/json' },
      body: JSON.stringify(datos),
    });
    const json = await res.json().catch(() => null);
    if (res.status === 201 && json?.ok) return { ok: true };
    return {
      ok: false,
      error: json?.error?.message || 'No pudimos guardar tu inscripción. Inténtalo de nuevo en unos minutos.',
      campo: json?.error?.field || null,
    };
  } catch {
    return { ok: false, error: 'No hay conexión con Edvanta en este momento. Revisa tu internet o escríbenos por WhatsApp.' };
  }
}

const clave = (slug) => `edv-grupo-${slug}`;

export function recordarInscripcion(slug, nombre) {
  try { localStorage.setItem(clave(slug), JSON.stringify({ nombre, fecha: new Date().toISOString() })); } catch { /* sin almacenamiento */ }
}

export function inscripcionRecordada(slug) {
  try {
    const v = JSON.parse(localStorage.getItem(clave(slug)) || 'null');
    return v && typeof v.nombre === 'string' ? v : null;
  } catch { return null; }
}

export function olvidarInscripcion(slug) {
  try { localStorage.removeItem(clave(slug)); } catch { /* sin almacenamiento */ }
}

/** Los utm de la dirección, para saber de dónde llegó la persona. */
export function utmDeLaDireccion() {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      utmSource: p.get('utm_source') || undefined,
      utmMedium: p.get('utm_medium') || undefined,
      utmCampaign: p.get('utm_campaign') || undefined,
      utmContent: p.get('utm_content') || undefined,
    };
  } catch { return {}; }
}

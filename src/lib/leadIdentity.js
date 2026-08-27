/**
 * ============================================================
 *  lib/leadIdentity.js — Identidad persistente del lead
 *
 *  Guarda el email del visitante que ya dejó sus datos en algún
 *  formulario de captación (localStorage). Se usa para anexar
 *  el email a eventos anónimos posteriores (clics Hotmart, etc.)
 *  y poder atribuir compras a la campaña/fuente original.
 * ============================================================
 */
const KEY = 'edvanta_lead_email';

export function getLeadEmail() {
  if (typeof window === 'undefined') return '';
  try {
    const raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || '';
    return (raw || '').trim().toLowerCase();
  } catch {
    return '';
  }
}

export function rememberLeadEmail(email) {
  if (!email || typeof window === 'undefined') return;
  const normalized = String(email).trim().toLowerCase();
  if (!normalized.includes('@')) return;
  try {
    localStorage.setItem(KEY, normalized);
    sessionStorage.setItem(KEY, normalized);
  } catch {
    /* almacenamiento no disponible: el evento sigue sin email */
  }
}

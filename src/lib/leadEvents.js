import { apiUrl } from '../config/api';
import { getAttribution } from '../utils/analytics';
import { getLeadEmail } from './leadIdentity';

/**
 * Registra un evento comercial/educativo de Feliz Sin Tiroides
 * en el CRM básico (tabla lead_events del backend).
 * Fire-and-forget: nunca bloquea la navegación ni rompe la UI.
 * Si el visitante ya dejó su correo antes, se adjunta para
 * poder atribuir conversiones posteriores (compra Hotmart, etc.).
 */
export function trackLeadEvent(eventType, extra = {}) {
  if (typeof window === 'undefined') return;
  const attribution = getAttribution();
  const payload = {
    eventType,
    email: extra.email || getLeadEmail() || '',
    resourceSlug: extra.resourceSlug || '',
    resourceName: extra.resourceName || '',
    productId: extra.productId || '',
    metadata: {
      source: extra.source || 'fst_landing',
      ...attribution,
    },
  };
  try {
    fetch(apiUrl('/api/lead-events'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* silencioso: el evento no debe interrumpir la experiencia */
  }
}

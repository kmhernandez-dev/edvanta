import { apiUrl } from '../config/api';
import { getAttribution } from '../utils/analytics';

/**
 * Registra un clic de Feliz Sin Tiroides (tabla fst_clicks).
 * Fire-and-forget: nunca bloquea la navegación ni rompe la UI.
 */
export function trackFstClick({ section, element, label, destination }) {
  if (typeof window === 'undefined') return;
  const attribution = getAttribution();
  const payload = {
    section,
    element,
    label,
    destination: destination || '',
    source_page: window.location.pathname + window.location.search,
    referrer: document.referrer?.slice(0, 500) || '',
    utm_source: attribution.utmSource || '',
    utm_medium: attribution.utmMedium || '',
    utm_campaign: attribution.utmCampaign || '',
  };
  try {
    fetch(apiUrl('/api/fst-clicks'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* silencioso */
  }
}

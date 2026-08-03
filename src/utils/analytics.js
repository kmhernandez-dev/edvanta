export function trackEvent(name, parameters = {}) {
  if (typeof window === 'undefined') return;

  const detail = {
    event: name,
    page_path: window.location.pathname,
    ...parameters,
  };

  window.dispatchEvent(new CustomEvent('edvanta:analytics', { detail }));

  // Las integraciones publicitarias solo reciben eventos después del consentimiento.
  if (window.__EDVANTA_ANALYTICS_CONSENT__ !== true) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(detail);
  window.gtag?.('event', name, parameters);
  window.fbq?.('trackCustom', name, parameters);
}

export function getAttribution() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmContent: params.get('utm_content') || '',
    sourcePage: document.referrer || window.location.href,
  };
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const consentKey = 'edvanta_analytics_consent';
const measurementId = 'G-YZ83V7VLQ4';

function enableAnalytics() {
  if (window.__EDVANTA_ANALYTICS_CONSENT__ === true) return;
  window.__EDVANTA_ANALYTICS_CONSENT__ = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' });
  window.gtag('config', measurementId, { anonymize_ip: true });

  if (!document.querySelector(`script[src*="${measurementId}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }
}

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState(() => localStorage.getItem(consentKey));

  useEffect(() => {
    if (choice === 'granted') enableAnalytics();
    if (choice === 'denied') window.__EDVANTA_ANALYTICS_CONSENT__ = false;
  }, [choice]);

  const choose = value => {
    localStorage.setItem(consentKey, value);
    setChoice(value);
  };

  if (choice) return null;

  return (
    <aside className="fixed bottom-3 right-3 z-[70] w-[calc(100%-1.5rem)] max-w-xs rounded-2xl border border-edvanta-border bg-white p-4 shadow-[0_18px_44px_rgba(23,34,59,.18)] sm:bottom-4 sm:right-4" aria-label="Preferencias de analítica">
      <p className="text-xs leading-5 text-edvanta-muted">
        Usamos cookies necesarias. La analítica opcional solo se activa con tu permiso. Ver <Link to="/privacidad" className="font-semibold text-edvanta-blue underline">privacidad</Link>.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose('denied')} className="min-h-10 flex-1 rounded-xl border border-edvanta-strong px-3 text-xs font-semibold text-edvanta-deep hover:bg-edvanta-bg">Solo necesarias</button>
        <button type="button" onClick={() => choose('granted')} className="min-h-10 flex-1 rounded-xl bg-edvanta-blue px-3 text-xs font-semibold text-white hover:bg-edvanta-bluedark">Aceptar</button>
      </div>
    </aside>
  );
}

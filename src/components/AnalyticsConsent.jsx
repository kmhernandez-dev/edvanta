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
    <aside className="fixed bottom-3 right-3 z-[70] w-[calc(100%-1.5rem)] max-w-xs rounded-lg border border-gray-200 bg-white p-4 shadow-2xl sm:bottom-4 sm:right-4" aria-label="Preferencias de analítica">
      <p className="text-xs leading-5 text-gray-600">
        Usamos cookies necesarias. La analítica opcional solo se activa con tu permiso. Ver <Link to="/privacidad" className="font-semibold text-[#563a78] underline">privacidad</Link>.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose('denied')} className="min-h-10 flex-1 rounded-md border border-gray-300 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50">Solo necesarias</button>
        <button type="button" onClick={() => choose('granted')} className="min-h-10 flex-1 rounded-md bg-[#563a78] px-3 text-xs font-semibold text-white hover:bg-[#452b65]">Aceptar</button>
      </div>
    </aside>
  );
}

import { useEffect, useState } from 'react';
import Icon from '../../Icon';
import { trackEvent } from '../../../utils/analytics';

/**
 * CTA fijo inferior en móvil que aparece después de empezar a hacer scroll.
 * - label: texto del botón (ej. "OBTENER EL EBOOK")
 * - href: checkout
 * - analytics: { productId, section } para el evento checkout_click
 */
export default function StickyCta({ label, href, analytics }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#e2d9eb] bg-white/95 p-3 shadow-[0_-8px_24px_rgba(10,37,64,0.08)] backdrop-blur transition-transform duration-300 lg:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('checkout_click', { ...analytics, placement: 'sticky_mobile' })}
        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-colors hover:bg-[#123b5f]"
      >
        {label} <Icon name="arrowRight" className="h-4 w-4" />
      </a>
    </div>
  );
}

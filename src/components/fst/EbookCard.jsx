import { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { waLink } from '../../config/links';
import { trackEvent } from '../../utils/analytics';
import Icon from '../Icon';

export default function EbookCard({ ebook, details }) {
  const { addItem } = useCart();
  const cardRef = useRef(null);
  const discount = ebook.comparePrice
    ? Math.round((1 - ebook.price / ebook.comparePrice) * 100)
    : 0;
  const waUrl = waLink(`Hola Karla, me interesa "${ebook.name}". ¿Me cuentas más?`);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackEvent('product_view', { product_id: ebook.id, product_name: ebook.name });
        observer.disconnect();
      }
    }, { threshold: 0.55 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ebook.id, ebook.name]);

  const trackProductClick = (destination) => {
    trackEvent(destination === 'checkout' ? 'checkout_click' : 'product_click', {
      product_id: ebook.id,
      product_name: ebook.name,
      destination,
    });
  };

  return (
    <article ref={cardRef} className={`flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${ebook.featured ? 'border-[#9c7bc0] ring-1 ring-[#d7c6e7]' : 'border-gray-200'}`}>
      {/* Cover */}
      <div className={`relative aspect-[3/4] flex items-center justify-center overflow-hidden ${ebook.cover.image ? 'bg-sand-100' : `bg-gradient-to-br ${ebook.cover.gradient}`}`}>
        {ebook.cover.image
          ? <img src={ebook.cover.image} alt={ebook.name} loading="lazy" className="w-full h-full object-cover" />
          : <Icon name="book" className="h-14 w-14 text-white" />}
        {ebook.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#563a78]">
            <Icon name="award" className="h-3.5 w-3.5" /> Más completo
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded bg-[#8f3f6b] px-2 py-1 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded bg-white/95 px-2 py-1 text-[11px] font-semibold text-deepblue-800">
          {ebook.tag}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-serif text-lg font-semibold text-deepblue-900 leading-snug">{ebook.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1">{ebook.description}</p>

        {details && (
          <div className="space-y-3 border-t border-gray-100 pt-3 text-xs leading-5 text-gray-600">
            <p><strong className="text-deepblue-900">Para quién es:</strong> {details.audience}</p>
            <p><strong className="text-deepblue-900">Te ayuda a:</strong> {details.helps}</p>
            <div>
              <strong className="text-deepblue-900">Incluye:</strong>
              <ul className="mt-1 space-y-1">
                {details.includes.map(item => (
                  <li key={item} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6e4d91]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p><strong className="text-deepblue-900">Formato:</strong> {details.format}</p>
          </div>
        )}

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className="text-xl font-bold text-deepblue-900">{formatPrice(ebook.price)}</span>
          {ebook.comparePrice && (
            <span className="text-sm text-gray-400 line-through mb-0.5">{formatPrice(ebook.comparePrice)}</span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 mt-1">
          {ebook.checkoutUrl ? (
            <a
              href={ebook.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackProductClick('checkout')}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#563a78] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#452b65]"
            >
              Comprar ahora
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ) : (
            <button
              onClick={() => { trackProductClick('cart'); addItem(ebook); }}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#563a78] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#452b65]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Agregar al carrito
            </button>
          )}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { trackProductClick('whatsapp'); trackEvent('whatsapp_click', { product_id: ebook.id }); }}
            className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-md border border-[#bda7d2] px-5 py-2 text-sm font-semibold text-[#563a78] transition-colors hover:bg-[#f7f2fa]"
          >
            Preguntar por WhatsApp
          </a>
        </div>

        {/* Pago seguro */}
        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          {ebook.checkoutUrl ? 'Pago seguro en Hotmart' : 'Pago seguro con Mercado Pago'}
        </p>
      </div>
        <p className="border-t border-gray-100 px-5 py-3 text-center text-[11px] leading-4 text-gray-500">
          Recurso educativo. No reemplaza valoración, diagnóstico ni tratamiento profesional.
        </p>
    </article>
  );
}

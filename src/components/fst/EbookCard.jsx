import { useEffect, useRef } from 'react';
import { waLink, FST_COLECCION_HOTMART } from '../../config/links';
import { trackEvent } from '../../utils/analytics';
import { trackLeadEvent } from '../../lib/leadEvents';
import Icon from '../Icon';

export default function EbookCard({ ebook, details, recommended = false }) {
  const cardRef = useRef(null);
  const adaptedCover = ebook.price == null && Boolean(ebook.cover.image);
  // Todos los productos redirigen a Hotmart. Los que no tienen enlace propio
  // van a la Colección (el más vendido) para no perder la oportunidad de venta.
  const buyUrl = ebook.checkoutUrl || ebook.hotmartUrl || FST_COLECCION_HOTMART;
  const waUrl = waLink(`Hola Karla, me interesa "${ebook.name}". ¿Me cuentas más?`);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackEvent('product_view', { product_id: ebook.id, product_name: ebook.name });
        trackLeadEvent('guide_viewed', { productId: ebook.id, resourceName: ebook.name });
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
    if (destination === 'checkout') {
      trackLeadEvent('hotmart_clicked', { productId: ebook.id, resourceName: ebook.name });
    }
  };

  return (
    <article
      id={`fst-product-${ebook.id}`}
      ref={cardRef}
      tabIndex="-1"
      className={`scroll-mt-28 flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${recommended ? 'border-edvanta-blue ring-2 ring-edvanta-border ring-offset-4' : ebook.featured ? 'border-edvanta-violet ring-1 ring-edvanta-border' : 'border-edvanta-border'}`}
    >
      {/* Cover */}
      <div className={`relative aspect-[3/4] flex items-center justify-center overflow-hidden ${ebook.cover.image ? 'bg-edvanta-bg' : `bg-gradient-to-br ${ebook.cover.gradient}`}`}>
        {ebook.cover.image
          ? <img src={ebook.cover.image} alt={ebook.name} loading="lazy" className={`h-full w-full object-cover ${adaptedCover ? 'scale-105 opacity-35' : ''}`} />
          : <Icon name="book" className="h-14 w-14 text-white" />}
        {adaptedCover && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#031D5C]/75 px-6 text-center text-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-edvanta-mint">Feliz Sin Tiroides</span>
            <span className="mt-3 text-2xl font-semibold leading-tight">{ebook.name}</span>
          </div>
        )}
        {ebook.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-white/95 px-2.5 py-1 text-[11px] font-bold text-edvanta-blue">
            <Icon name="award" className="h-3.5 w-3.5" /> Más completo
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded bg-white/95 px-2 py-1 text-[11px] font-semibold text-edvanta-deep">
          {ebook.tag}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {recommended && (
          <p className="inline-flex w-fit items-center gap-2 rounded bg-edvanta-lilac px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-edvanta-blue">
            <Icon name="sparkles" className="h-3.5 w-3.5" /> Recomendado para tu etapa
          </p>
        )}
        <h3 className="font-display text-lg font-extrabold text-edvanta-deep leading-snug">{ebook.name}</h3>
        <p className="text-sm text-edvanta-muted leading-relaxed flex-1">{ebook.description}</p>

        {details && (
          <div className="space-y-3 border-t border-edvanta-border pt-3 text-xs leading-5 text-edvanta-muted">
            <p><strong className="text-edvanta-deep">Para quién es:</strong> {details.audience}</p>
            <p><strong className="text-edvanta-deep">Te ayuda a:</strong> {details.helps}</p>
            <div>
              <strong className="text-edvanta-deep">Incluye:</strong>
              <ul className="mt-1 space-y-1">
                {details.includes.map(item => (
                  <li key={item} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-edvanta-blue" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p><strong className="text-edvanta-deep">Formato:</strong> {details.format}</p>
          </div>
        )}

        {/* CTAs — todo redirige a Hotmart (sin precio ni carrito) */}
        <div className="flex flex-col gap-2 mt-1">
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackProductClick('checkout')}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-edvanta-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-edvanta-bluedark"
          >
            Comprar en Hotmart
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { trackProductClick('whatsapp'); trackEvent('whatsapp_click', { product_id: ebook.id }); }}
            className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-md border border-edvanta-border px-5 py-2 text-sm font-semibold text-edvanta-blue transition-colors hover:bg-edvanta-bg"
          >
            Preguntar por WhatsApp
          </a>
        </div>

        {/* Pago seguro */}
        <p className="text-[11px] text-edvanta-subtle text-center flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Pago seguro en Hotmart
        </p>
      </div>
        <p className="border-t border-edvanta-border px-5 py-3 text-center text-[11px] leading-4 text-edvanta-muted">
          Recurso educativo. No reemplaza valoración, diagnóstico ni tratamiento profesional.
        </p>
    </article>
  );
}

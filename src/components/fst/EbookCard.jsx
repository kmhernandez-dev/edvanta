import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { waLink } from '../../config/links';

export default function EbookCard({ ebook }) {
  const { addItem } = useCart();
  const discount = ebook.comparePrice
    ? Math.round((1 - ebook.price / ebook.comparePrice) * 100)
    : 0;
  const waUrl = waLink(`Hola Karla, me interesa "${ebook.name}". ¿Me cuentas más?`);

  return (
    <div className={`bg-white rounded-3xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col ${ebook.featured ? 'border-teal-300 ring-1 ring-teal-200' : 'border-sand-100'}`}>
      {/* Cover */}
      <div className={`relative aspect-[3/4] flex items-center justify-center overflow-hidden ${ebook.cover.image ? 'bg-sand-100' : `bg-gradient-to-br ${ebook.cover.gradient}`}`}>
        {ebook.cover.image
          ? <img src={ebook.cover.image} alt={ebook.name} loading="lazy" className="w-full h-full object-cover" />
          : <span className="text-6xl drop-shadow-sm">{ebook.cover.emoji}</span>}
        {ebook.featured && (
          <span className="absolute top-3 left-3 chip bg-white/90 text-teal-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            ⭐ Más completo
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 chip bg-blush-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        <span className="absolute bottom-3 left-3 chip bg-white/90 text-deepblue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
          {ebook.tag}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-serif text-lg font-semibold text-deepblue-900 leading-snug">{ebook.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1">{ebook.description}</p>

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
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Comprar ahora
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ) : (
            <button
              onClick={() => addItem(ebook)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
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
            className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2 text-teal-700 text-sm font-semibold rounded-full border border-teal-200 hover:bg-teal-50 transition-colors"
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
    </div>
  );
}

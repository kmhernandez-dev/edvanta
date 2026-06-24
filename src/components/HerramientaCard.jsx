import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function HerramientaCard({ product, onDetails }) {
  const { addItem } = useCart();
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <div className="card overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* Imagen */}
      <button onClick={() => onDetails(product)} className="relative aspect-[16/10] overflow-hidden bg-slate-100 text-left">
        <img src={product.image} alt={product.name} loading="lazy"
             className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
        {product.badge && (
          <span className="absolute top-3 left-3 chip bg-navy-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">{product.badge}</span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 chip bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">-{discount}%</span>
        )}
      </button>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-base font-bold text-navy-950 leading-snug">{product.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1">{product.description}</p>

        {/* Formatos */}
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {product.formats}
        </p>

        {/* Precio */}
        <div className="flex items-end gap-2">
          <span className="text-2xl font-extrabold text-navy-950 leading-none">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through mb-0.5">{formatPrice(product.comparePrice)}</span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 mt-1">
          <button onClick={() => onDetails(product)} className="btn-primary text-sm w-full">
            {product.ctaText || 'Ver detalles'}
          </button>
          <button onClick={() => addItem(product)} className="btn-outline-teal text-sm w-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

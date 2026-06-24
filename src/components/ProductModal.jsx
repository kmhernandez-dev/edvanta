import { useEffect } from 'react';
import { HOTMART_URL, waLink } from '../config/links';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function ProductModal({ product, onClose }) {
  const { addItem, openCart } = useCart();
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!product) return null;

  const buyUrl = product.hotmartUrl || HOTMART_URL;
  const waUrl  = waLink(`Hola Karla, me interesa el ${product.name}. ¿Puedes darme más información?`);
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  const handleAddAndOpen = () => {
    addItem(product);
    onClose();
    openCart();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-20 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-[slideUp_0.25s_ease-out] my-4">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-navy-950 to-navy-800 rounded-t-2xl px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-2 mb-2">
            {product.badge && (
              <span className="chip bg-gold-500 text-navy-950 font-bold text-xs">{product.badge}</span>
            )}
            {discount > 0 && (
              <span className="chip bg-teal-500 text-white font-bold text-xs">-{discount}%</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white mb-1 pr-8">{product.name}</h2>
          <p className="text-sm text-navy-200 mb-3">{product.category}</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-white leading-none">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-sm text-navy-300 line-through mb-0.5">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-5">
          {/* Description */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Descripción</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </section>

          {/* For whom */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">¿Para quién es?</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{product.forWhom}</p>
          </section>

          {/* Problem solved */}
          {product.problem && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">¿Qué problema resuelve?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.problem}</p>
            </section>
          )}

          {/* Items */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Qué incluye ({product.items.length} elementos)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
              {product.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <svg className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Related courses */}
          {product.relatedCourses.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cursos complementarios en Edutin</h3>
              <div className="flex flex-col gap-1.5">
                {product.relatedCourses.map(c => (
                  <a
                    key={c.code}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-200 rounded-lg transition-colors group"
                  >
                    <span className="text-xs font-medium text-gray-700 group-hover:text-teal-700">{c.name}</span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-teal-600">
                      <span className="font-mono">{c.code}</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Ethics note */}
          <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              Este material es educativo y operativo. Debe adaptarse a la normativa vigente, al contexto institucional y al criterio profesional correspondiente.
            </p>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAddAndOpen}
            className="btn-primary flex-1 text-sm text-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Agregar al carrito
          </button>
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 text-sm text-center"
          >
            Comprar ahora
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-teal flex-1 text-sm text-center"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Solicitar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

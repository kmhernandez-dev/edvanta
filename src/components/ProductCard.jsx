import { waLink } from '../config/links';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const tagColors = {
  'Excel':      'bg-green-50 text-green-700 border-green-200',
  'Word':       'bg-blue-50 text-blue-700 border-blue-200',
  'PDF':        'bg-red-50 text-red-700 border-red-200',
  'Plantillas': 'bg-purple-50 text-purple-700 border-purple-200',
  'Editable':   'bg-teal-50 text-teal-700 border-teal-200',
  'Power BI':   'bg-amber-50 text-amber-700 border-amber-200',
  'Todo incluido': 'bg-navy-50 text-navy-700 border-navy-200',
};

export default function ProductCard({ product, onDetails }) {
  const { addItem } = useCart();

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  const waUrl = waLink(`Hola Karla, me interesa el ${product.name}. ¿Puedes darme más información?`);

  return (
    <div className="card flex flex-col overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-5 pt-5 pb-4 overflow-hidden">
        {/* decorative accent (cheap radial, no blur) */}
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.35),transparent_70%)]" />
        <div className="relative flex items-start justify-between gap-2 mb-2">
          {product.badge && (
            <span className="chip bg-gold-500 text-navy-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="ml-auto chip bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
        </div>
        <h3 className="relative text-base font-bold text-white leading-snug mb-1">
          {product.name}
        </h3>
        <p className="relative text-xs text-navy-200 font-medium">{product.category}</p>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-5 gap-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map(tag => (
            <span
              key={tag}
              className={`chip border text-xs font-medium ${tagColors[tag] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {product.description}
        </p>

        {/* Items preview */}
        <div>
          <p className="text-xs font-semibold text-navy-900 mb-2 uppercase tracking-wide">Incluye:</p>
          <ul className="space-y-1">
            {product.items.slice(0, 4).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
            {product.items.length > 4 && (
              <li className="text-xs text-teal-600 font-medium pl-5">
                + {product.items.length - 4} elementos más...
              </li>
            )}
          </ul>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 pt-1">
          <span className="text-2xl font-extrabold text-navy-950 leading-none">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through mb-0.5">{formatPrice(product.comparePrice)}</span>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => addItem(product)}
            className="btn-primary text-sm w-full group/btn"
          >
            <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Agregar al carrito
          </button>
          <button
            onClick={() => onDetails(product)}
            className="btn-outline-teal text-sm text-center w-full"
          >
            Ver detalles y cursos
          </button>
        </div>

        {/* WhatsApp secondary */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Solicitar por WhatsApp
        </a>
      </div>
    </div>
  );
}

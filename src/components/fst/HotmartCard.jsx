import { waLink } from '../../config/links';

/**
 * Tarjeta para productos que se venden DIRECTO en Hotmart.
 * El botón "Comprar ahora" lleva a 'hotmartUrl' (Hotmart gestiona el pago).
 */
export default function HotmartCard({ product }) {
  const waUrl = waLink(`Hola Karla, me interesa "${product.name}". ¿Me cuentas más?`);

  return (
    <div className={`bg-white rounded-3xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col ${product.featured ? 'border-teal-300 ring-1 ring-teal-200' : 'border-sand-100'}`}>
      {/* Cover */}
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${product.cover.gradient} flex items-center justify-center`}>
        <span className="text-6xl drop-shadow-sm">{product.cover.emoji}</span>
        {product.featured && (
          <span className="absolute top-3 right-3 chip bg-white/90 text-teal-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            ⭐ Destacado
          </span>
        )}
        <span className="absolute bottom-3 left-3 chip bg-white/90 text-deepblue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
          {product.tag}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-serif text-lg font-semibold text-deepblue-900 leading-snug">{product.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1">{product.description}</p>

        {/* CTAs */}
        <div className="flex flex-col gap-2 mt-1">
          <a
            href={product.hotmartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-deepblue-800 hover:bg-deepblue-900 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Comprar ahora
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2 text-teal-700 text-sm font-semibold rounded-full border border-teal-200 hover:bg-teal-50 transition-colors"
          >
            Preguntar por WhatsApp
          </a>
        </div>

        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Pago seguro en Hotmart
        </p>
      </div>
    </div>
  );
}

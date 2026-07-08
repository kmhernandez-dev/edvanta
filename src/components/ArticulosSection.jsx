import { Link } from 'react-router-dom';
import { articulosPorMarca, gradientDe } from '../data/articulos';

/**
 * Sección con las tarjetas de artículos de una marca.
 * marca: 'fst' | 'atenfarma' | 'biblioteca'
 */
export default function ArticulosSection({ marca, eyebrow = 'Blog', title = 'Aprende con nuestros artículos', dark = false }) {
  const arts = articulosPorMarca(marca);
  if (!arts.length) return null;

  return (
    <section id="articulos" className={`py-16 md:py-20 ${dark ? 'bg-sand-50' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">{eyebrow}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">{title}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {arts.map(a => (
            <Link
              key={a.slug}
              to={`/articulos/${a.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-sand-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className={`aspect-[16/9] bg-gradient-to-br ${gradientDe(marca)} flex items-end p-4`}>
                <span className="chip bg-white/90 text-deepblue-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{a.category}</span>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-2">
                <h3 className="text-base font-bold text-deepblue-900 leading-snug group-hover:text-teal-700 transition-colors">{a.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{a.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 mt-1">
                  {a.readingTime} · Leer artículo
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

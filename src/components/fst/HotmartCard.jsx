import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { BotonWhatsApp } from '../edvanta/embudo';
import { rutaDeGuia } from '../../data/guiasVenta';

/**
 * Tarjeta de un producto que se vende en Hotmart.
 * Si el producto tiene página de venta (/guia/:slug), el botón lleva ahí:
 * la persona ve primero para qué le sirve y después paga en Hotmart.
 */
export default function HotmartCard({ product }) {
  const pagina = rutaDeGuia(product.id);

  return (
    <div className="ds-card ds-card--interactive flex flex-col overflow-hidden">
      <div className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${product.cover.gradient}`}>
        <span className="text-6xl drop-shadow-sm" aria-hidden="true">{product.cover.emoji}</span>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-edvanta-deep">{product.tag}</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-edvanta-deep">{product.name}</h3>
        <p className="flex-1 text-sm leading-relaxed text-edvanta-muted">{product.description}</p>

        <div className="mt-1 flex flex-col gap-2">
          {pagina ? (
            <Link to={pagina} className="ed-btn ed-btn--primary ed-btn--sm ed-btn--block">
              Ver la guía <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
            </Link>
          ) : (
            <a href={product.hotmartUrl} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn--primary ed-btn--sm ed-btn--block">
              Comprar ahora <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
            </a>
          )}
          <BotonWhatsApp mensaje={`Hola, me interesa «${product.name}». ¿Me cuentas más?`} origen="tarjeta-atenfarma" tamano="ed-btn--sm ed-btn--block">Preguntar por WhatsApp</BotonWhatsApp>
        </div>

        <p className="flex items-center justify-center gap-1 text-center text-xs text-edvanta-subtle">
          <Lock className="h-3 w-3" aria-hidden="true" /> Pago seguro en Hotmart
        </p>
      </div>
    </div>
  );
}

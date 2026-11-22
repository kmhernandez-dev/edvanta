/**
 * ============================================================
 *  BotonesDeCompra — el mismo par de botones en todo el sitio
 *
 *  Pedido de Karla (22-nov-2026): «UX y SEO para que unda los botones
 *  correctos para que vendan mucho». En la ficha, las clases abiertas,
 *  los artículos, los casos clínicos, los exámenes y el vademécum:
 *
 *   · Principal: «Estudiar con certificado» → compra directa
 *     (/curso-de-…/inscripcion?camino=certificado: cuenta si hace falta,
 *     inscripción y Mercado Pago, sin mostrar la landing).
 *   · Secundario: «Empezar la primera unidad gratis» → entra directo al
 *     aula (/curso-de-…/inscripcion?camino=gratis).
 *   · El precio real, con su condición (Ley 1480: la publicidad obliga).
 *     Debe coincidir con api/lib/precio-certificado.js.
 *   · Cada clic se mide: trackEvent('curso_cta_click', { camino, origen, curso }).
 * ============================================================
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import '../../styles/botones-compra.css';

/** El precio real del curso completo con certificado (precio-certificado.js). */
export const PRECIO_CURSO_TEXTO = 'Curso completo con certificado: COP 60.000 en Colombia (65.000 desde otros países) si lo compras en los primeros 7 días desde tu inscripción. Precio de lista: COP 199.000.';

const base = (cursoUrl) => `/${String(cursoUrl || '').replace(/^\/+/, '').replace(/\/+$/, '')}`;
export const rutaDeCompra = (cursoUrl) => `${base(cursoUrl)}/inscripcion?camino=certificado`;
export const rutaPrimeraUnidad = (cursoUrl) => `${base(cursoUrl)}/inscripcion?camino=gratis`;

export const medirCta = (camino, origen, curso, extra = {}) => trackEvent('curso_cta_click', { camino, origen, curso: base(curso), ...extra });

export default function BotonesDeCompra({ cursoUrl, origen, extra = {}, conPrecio = true, compacto = false, className = '' }) {
  if (!cursoUrl) return null;
  return (
    <div className={`edvanta-theme botones-compra ${compacto ? 'botones-compra--compacto' : ''} ${className}`.trim()}>
      <div className="botones-compra__fila">
        <Link
          to={rutaDeCompra(cursoUrl)}
          className="ed-btn ed-btn--gradient ed-btn--lg"
          onClick={() => medirCta('certificado', origen, cursoUrl, extra)}
        >
          Estudiar con certificado <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
        </Link>
        <Link
          to={rutaPrimeraUnidad(cursoUrl)}
          className="botones-compra__secundario"
          onClick={() => medirCta('primera_unidad', origen, cursoUrl, extra)}
        >
          Empezar la primera unidad gratis
        </Link>
      </div>
      {conPrecio && <p className="botones-compra__precio">{PRECIO_CURSO_TEXTO}</p>}
    </div>
  );
}

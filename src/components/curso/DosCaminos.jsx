/**
 * Los dos caminos de inscripción de un curso propio con certificado.
 *
 *  · En la tarjeta del curso solo van los dos botones, sin texto: la
 *    portada queda limpia (pedido de Karla, 18-nov).
 *  · Los dos llevan a la landing de inscripción (/curso-de-…/inscripcion),
 *    donde la persona compara los caminos y elige.
 *  · PrecioCertificado: el precio real para el país de quien mira y, si
 *    hay una oferta con plazo, el de lista tachado y hasta cuándo rige.
 *
 * Sistema de diseño 2.0 (--ds-*, Manrope, .ed-btn).
 */

import { ArrowRight } from 'lucide-react';
import { Btn } from '../edvanta/ui';
import { formatPrice } from '../../utils/format';

const fechaCorta = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' });
  } catch {
    return null;
  }
};

export function PrecioCertificado({ oferta, compacto = false }) {
  if (!oferta?.precio) return null;
  const vence = oferta.conDescuento && oferta.venceEl ? fechaCorta(oferta.venceEl) : null;
  return (
    <div className={`camino-precio ${compacto ? 'camino-precio--compacto' : ''}`.trim()}>
      <p className="camino-precio__monto">
        {formatPrice(oferta.precio)} <span>COP</span>
      </p>
      {oferta.conDescuento && oferta.lista && (
        <p className="camino-precio__lista">
          <s>{formatPrice(oferta.lista)}</s> <span>{oferta.descuentoPct} % de descuento</span>
        </p>
      )}
      <p className="camino-precio__condicion">
        Pago único con Mercado Pago.
        {vence ? ` El descuento rige 7 días desde tu inscripción (hasta el ${vence}); después, ${formatPrice(oferta.lista)}.` : ''}
        {oferta.equivalente ? ` ≈ ${oferta.equivalente.moneda} ${Number(oferta.equivalente.valor).toLocaleString('es-CO')} (aproximado).` : ''}
        {oferta.pais && oferta.pais !== 'CO' ? ' Se cobra en pesos colombianos; tu banco hace la conversión.' : ''}
      </p>
    </div>
  );
}

/** En la tarjeta: solo los dos botones. Ambos abren la comparativa. */
export default function DosCaminos({ onAbrir, trabajando = null, error = '' }) {
  return (
    <div className="curso-caminos">
      <Btn
        variant="gradient"
        size="lg"
        block
        onClick={() => onAbrir('certificado')}
        loading={trabajando === 'certificado'}
        loadingLabel="Un momento…"
        disabled={Boolean(trabajando)}
        iconRight={ArrowRight}
      >
        Estudiar con certificado
      </Btn>
      <Btn
        variant="outline"
        size="lg"
        block
        onClick={() => onAbrir('gratis')}
        loading={trabajando === 'gratis'}
        loadingLabel="Un momento…"
        disabled={Boolean(trabajando)}
      >
        Probar la primera unidad
      </Btn>
      {error && <p role="alert" className="curso-card-error">{error}</p>}
    </div>
  );
}

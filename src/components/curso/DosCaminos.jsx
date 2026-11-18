/**
 * Los dos caminos de inscripción de un curso propio con certificado:
 *
 *  · «Estudiar con certificado» (destacado): inscribe y lleva al pago
 *    con Mercado Pago. Muestra el precio que cobrará el servidor para el
 *    país de quien mira y, solo si existe una oferta real con plazo, el
 *    precio de lista tachado y hasta cuándo rige.
 *  · «Estudiar gratis»: inscribe sin certificado. Puede pasarse después.
 */

import { ArrowRight, BadgeCheck, Check, ShieldCheck } from 'lucide-react';
import { Btn } from '../edvanta/ui';
import { formatPrice } from '../../utils/format';
import { beneficiosVigentes } from '../../data/beneficiosCertificado';

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
    <div className={`curso-camino-precio ${compacto ? 'curso-camino-precio--compacto' : ''}`.trim()}>
      <p className="curso-camino-monto">
        {formatPrice(oferta.precio)} <span>COP</span>
        {oferta.conDescuento && oferta.lista && (
          <>
            {' '}<s aria-label={`Precio de lista ${formatPrice(oferta.lista)} COP`}>{formatPrice(oferta.lista)}</s>
            {' '}<b className="curso-camino-descuento">−{oferta.descuentoPct} %</b>
          </>
        )}
      </p>
      <p className="curso-camino-condicion">
        Pago único con Mercado Pago.
        {vence ? ` El descuento rige 7 días desde tu inscripción (hasta el ${vence}); después, ${formatPrice(oferta.lista)}.` : ''}
        {oferta.equivalente ? ` ≈ ${oferta.equivalente.moneda} ${Number(oferta.equivalente.valor).toLocaleString('es-CO')} (aproximado).` : ''}
        {oferta.pais && oferta.pais !== 'CO' ? ' Se cobra en pesos colombianos; tu banco hace la conversión.' : ''}
      </p>
    </div>
  );
}

export default function DosCaminos({ oferta, onCertificado, onGratis, trabajando = null, error = '' }) {
  const beneficios = beneficiosVigentes();
  return (
    <div className="curso-caminos">
      <div className="curso-camino curso-camino--certificado">
        <p className="curso-camino-insignia"><BadgeCheck className="h-4 w-4" aria-hidden="true" /> Recomendado</p>
        <p className="curso-camino-titulo">Estudia con certificado</p>
        <PrecioCertificado oferta={oferta} />
        <ul className="curso-camino-lista">
          {beneficios.map((b) => (
            <li key={b.id}>
              <Check className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
              <span><b>{b.titulo}.</b> {b.texto}</span>
            </li>
          ))}
        </ul>
        <Btn
          variant="primary"
          size="lg"
          className="curso-cta"
          onClick={onCertificado}
          loading={trabajando === 'certificado'}
          loadingLabel="Un momento…"
          disabled={Boolean(trabajando)}
          iconRight={ArrowRight}
        >
          {trabajando === 'certificado' ? 'Un momento…' : 'Estudiar con certificado'}
        </Btn>
        <p className="curso-camino-seguro"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Pago seguro: tarjetas, PSE, Nequi y más</p>
      </div>

      <div className="curso-camino curso-camino--gratis">
        <Btn
          variant="secondary"
          size="lg"
          className="curso-cta"
          onClick={onGratis}
          loading={trabajando === 'gratis'}
          loadingLabel="Un momento…"
          disabled={Boolean(trabajando)}
        >
          {trabajando === 'gratis' ? 'Un momento…' : 'Estudiar gratis'}
        </Btn>
        <p className="curso-card-note">Todo el contenido, sin certificado. Puedes pasarte al certificado cuando quieras.</p>
      </div>

      {error && <p role="alert" className="curso-card-error">{error}</p>}
    </div>
  );
}

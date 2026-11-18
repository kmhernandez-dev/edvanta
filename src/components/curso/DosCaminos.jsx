/**
 * Los dos caminos de inscripción de un curso propio con certificado.
 *
 *  · En la tarjeta del curso solo van los dos botones, sin texto: la
 *    portada queda limpia (pedido de Karla, 18-nov).
 *  · Al presionar cualquiera se abre la comparativa: qué incluye cada
 *    camino, el precio para el país de quien mira y, si hay una oferta
 *    real con plazo, el precio de lista tachado y hasta cuándo rige. La
 *    persona elige ahí.
 */

import { useEffect, useRef } from 'react';
import { ArrowRight, BadgeCheck, Check, Minus, ShieldCheck, X } from 'lucide-react';
import { Btn } from '../edvanta/ui';
import { formatPrice } from '../../utils/format';
import { COMPARATIVA_CAMINOS } from '../../data/beneficiosCertificado';

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

/** En la tarjeta: solo los dos botones. Ambos abren la comparativa. */
export default function DosCaminos({ onAbrir, trabajando = null, error = '' }) {
  return (
    <div className="curso-caminos">
      <Btn
        variant="primary"
        size="lg"
        className="curso-cta"
        onClick={() => onAbrir('certificado')}
        loading={trabajando === 'certificado'}
        loadingLabel="Un momento…"
        disabled={Boolean(trabajando)}
        iconRight={ArrowRight}
      >
        Estudiar con certificado
      </Btn>
      <Btn
        variant="secondary"
        size="lg"
        className="curso-cta"
        onClick={() => onAbrir('gratis')}
        loading={trabajando === 'gratis'}
        loadingLabel="Un momento…"
        disabled={Boolean(trabajando)}
      >
        Estudiar gratis
      </Btn>
      {error && <p role="alert" className="curso-card-error">{error}</p>}
    </div>
  );
}

const Marca = ({ si }) => (si
  ? <Check className="curso-comp-si" strokeWidth={2.6} aria-label="Incluido" />
  : <Minus className="curso-comp-no" strokeWidth={2.4} aria-label="No incluido" />);

/** La comparativa: la persona elige su camino. */
export function ComparativaCaminos({
  abierta, foco = 'certificado', oferta, nombre, onCertificado, onGratis, onCerrar, trabajando = null, error = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!abierta) return undefined;
    const previo = document.activeElement;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onCerrar(); };
    window.addEventListener('keydown', onKey);
    // El foco va al botón del camino elegido, sin bajar: la ventana abre arriba.
    ref.current?.querySelector(`[data-camino="${foco}"]`)?.focus({ preventScroll: true });
    if (ref.current) ref.current.scrollTop = 0;
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      previo?.focus?.();
    };
  }, [abierta, foco, onCerrar]);

  if (!abierta) return null;

  return (
    <div className="curso-comp-fondo" onClick={onCerrar} role="presentation">
      <div
        ref={ref}
        className="curso-comp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="curso-comp-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="curso-comp-cerrar" onClick={onCerrar} aria-label="Cerrar">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="curso-comp-ante">{nombre}</p>
        <h2 id="curso-comp-titulo" className="curso-comp-titulo">¿Cómo quieres estudiar?</h2>

        <div className="curso-comp-columnas">
          <div className="curso-comp-col curso-comp-col--certificado">
            <p className="curso-camino-insignia"><BadgeCheck className="h-4 w-4" aria-hidden="true" /> Recomendado</p>
            <p className="curso-comp-nombre">Con certificado</p>
            <PrecioCertificado oferta={oferta} compacto />
          </div>
          <div className="curso-comp-col">
            <p className="curso-comp-nombre curso-comp-nombre--gratis">Gratis</p>
            <p className="curso-camino-monto curso-comp-cero">$ 0 <span>COP</span></p>
            <p className="curso-camino-condicion">Sin certificado. Puedes pasarte cuando quieras.</p>
          </div>
        </div>

        <table className="curso-comp-tabla">
          <caption className="sr-only">Qué incluye cada forma de estudiar</caption>
          <thead>
            <tr><th scope="col">Incluye</th><th scope="col">Con certificado</th><th scope="col">Gratis</th></tr>
          </thead>
          <tbody>
            {COMPARATIVA_CAMINOS.map((f) => (
              <tr key={f.id}>
                <th scope="row">
                  <span className="curso-comp-fila">{f.titulo}</span>
                  {f.detalle && <span className="curso-comp-detalle">{f.detalle}</span>}
                </th>
                <td><Marca si={f.certificado} /></td>
                <td><Marca si={f.gratis} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="curso-comp-acciones">
          <Btn
            data-camino="certificado"
            variant="primary"
            size="lg"
            className="curso-cta"
            onClick={onCertificado}
            loading={trabajando === 'certificado'}
            loadingLabel="Un momento…"
            disabled={Boolean(trabajando)}
            iconRight={ArrowRight}
          >
            Elegir con certificado
          </Btn>
          <Btn
            data-camino="gratis"
            variant="secondary"
            size="lg"
            className="curso-cta"
            onClick={onGratis}
            loading={trabajando === 'gratis'}
            loadingLabel="Un momento…"
            disabled={Boolean(trabajando)}
          >
            Elegir gratis
          </Btn>
        </div>
        <p className="curso-camino-seguro"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Pago seguro con Mercado Pago: tarjetas, PSE, Nequi y más</p>
        {error && <p role="alert" className="curso-card-error">{error}</p>}
      </div>
    </div>
  );
}

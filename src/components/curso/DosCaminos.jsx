/**
 * Los dos caminos de inscripción de un curso propio con certificado.
 *
 *  · En la tarjeta del curso solo van los dos botones, sin texto: la
 *    portada queda limpia (pedido de Karla, 18-nov).
 *  · Al presionar cualquiera se abre la comparativa: qué incluye cada
 *    camino, el precio para el país de quien mira y, si hay una oferta
 *    real con plazo, el precio de lista tachado y hasta cuándo rige. La
 *    persona elige ahí.
 *
 * Con el sistema de diseño 2.0 (--ds-*, Manrope, .ed-btn) y sin íconos
 * genéricos: lo incluido se marca con un punto turquesa, lo no incluido
 * con un guion fino. Se usa en la ficha (.edvanta-theme) y en el aula
 * (.aula-root): los dos tienen los mismos tokens.
 */

import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
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
        Estudiar gratis
      </Btn>
      {error && <p role="alert" className="curso-card-error">{error}</p>}
    </div>
  );
}

const Marca = ({ si }) => (si
  ? <span className="camino-marca camino-marca--si" aria-label="Incluido" role="img" />
  : <span className="camino-marca camino-marca--no" aria-label="No incluido" role="img" />);

/** La comparativa: la persona elige su camino. */
export function ComparativaCaminos({
  abierta, foco = 'certificado', oferta, nombre, onCertificado, onGratis, onCerrar, trabajando = null, error = '',
  textoGratis = 'Elegir gratis',
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
    const arriba = () => { if (ref.current) ref.current.scrollTop = 0; };
    arriba();
    const cuadro = requestAnimationFrame(arriba);
    return () => {
      cancelAnimationFrame(cuadro);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      previo?.focus?.();
    };
  }, [abierta, foco, onCerrar]);

  if (!abierta) return null;

  return (
    <div className="camino-fondo" onClick={onCerrar} role="presentation">
      <div
        ref={ref}
        className="camino-ventana"
        role="dialog"
        aria-modal="true"
        aria-labelledby="camino-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="camino-cerrar" onClick={onCerrar} aria-label="Cerrar">
          <span aria-hidden="true">×</span>
        </button>
        <p className="camino-ante">{nombre}</p>
        <h2 id="camino-titulo" className="camino-titulo">¿Cómo quieres estudiar?</h2>

        <div className="camino-columnas">
          <div className="camino-col camino-col--certificado">
            <span className="ds-insignia ds-insignia--edvanta">Recomendado</span>
            <p className="camino-col__nombre">Con certificado</p>
            <PrecioCertificado oferta={oferta} compacto />
          </div>
          <div className="camino-col">
            <span className="ds-insignia camino-col__insignia-gratis">Sin costo</span>
            <p className="camino-col__nombre">Gratis</p>
            <div className="camino-precio camino-precio--compacto">
              <p className="camino-precio__monto">$ 0 <span>COP</span></p>
              <p className="camino-precio__condicion">Sin certificado. Puedes pasarte cuando quieras.</p>
            </div>
          </div>
        </div>

        <table className="camino-tabla">
          <caption className="sr-only">Qué incluye cada forma de estudiar</caption>
          <thead>
            <tr><th scope="col">Incluye</th><th scope="col">Con certificado</th><th scope="col">Gratis</th></tr>
          </thead>
          <tbody>
            {COMPARATIVA_CAMINOS.map((f) => (
              <tr key={f.id}>
                <th scope="row">
                  <span className="camino-tabla__fila">{f.titulo}</span>
                  {f.detalle && <span className="camino-tabla__detalle">{f.detalle}</span>}
                </th>
                <td><Marca si={f.certificado} /></td>
                <td><Marca si={f.gratis} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="camino-acciones">
          <Btn
            data-camino="certificado"
            variant="gradient"
            size="lg"
            block
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
            variant="outline"
            size="lg"
            block
            onClick={onGratis}
            loading={trabajando === 'gratis'}
            loadingLabel="Un momento…"
            disabled={Boolean(trabajando)}
          >
            {textoGratis}
          </Btn>
          <p className="camino-seguro">Pago seguro con Mercado Pago · tarjeta, PSE, Nequi o Efecty</p>
        </div>
        {error && <p role="alert" className="curso-card-error">{error}</p>}
      </div>
    </div>
  );
}

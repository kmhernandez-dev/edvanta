/**
 * Barra fija en la parte de arriba de cada clase, para quien estudia
 * gratis un curso con certificado de pago. Siempre a la vista, sin tapar
 * el contenido: dice el precio real y hasta cuándo rige el descuento de
 * esa persona. Quien la ve ya tiene cuenta y está inscrito, así que el
 * botón abre Mercado Pago de una vez (pedido de Karla, 20-nov: «que vaya
 * directamente a la compra»). «Comparar» lleva a la landing del curso.
 *
 * Sistema de diseño 2.0 (styles/caminos.css). Sin íconos.
 * No aparece si el certificado está pagado, en proceso, emitido o si el
 * curso no lo cobra.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Btn } from '../../components/edvanta/ui';
import { estadoDelCertificado, estudiaGratis, pagarCertificado } from '../certificadoEstado';

const pesos = (n) => `$${Number(n).toLocaleString('es-CO')}`;
const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' });

export default function BarraCertificado({ courseId, cursoSlug, volverA }) {
  const [d, setD] = useState(null);
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let vivo = true;
    estadoDelCertificado(courseId).then((r) => { if (vivo) setD(r); });
    return () => { vivo = false; };
  }, [courseId]);

  if (!estudiaGratis(d)) return null;
  const p = d.pago;

  const pagar = async () => {
    setPagando(true);
    setError('');
    try {
      await pagarCertificado(courseId, volverA);
    } catch (e) {
      setError(e.message);
      setPagando(false);
    }
  };

  return (
    <div className="aula-barra-cert" role="region" aria-label="Estudia con certificado">
      <p className="aula-barra-cert__texto">
        <b>Estás estudiando gratis.</b>{' '}
        <span className="aula-barra-cert__detalle">Certificado, revisión de actividades y acompañamiento por </span>
        <b>{pesos(p.precio)}</b>
        {p.conDescuento && p.lista && (
          <>
            {' '}<s>{pesos(p.lista)}</s> <span className="aula-barra-cert__pct">−{p.descuentoPct} %</span>
            {p.venceEl && <span className="aula-barra-cert__vence"> · hasta el {fecha(p.venceEl)}</span>}
          </>
        )}
        {cursoSlug && <span className="aula-barra-cert__detalle"> · <Link to={`/${cursoSlug}/inscripcion`}>Comparar</Link></span>}
        {error && <span role="alert" className="aula-barra-cert__error"> {error}</span>}
      </p>
      <Btn variant="gradient" size="sm" onClick={pagar} loading={pagando} loadingLabel="Abriendo Mercado Pago…">
        Estudiar con certificado
      </Btn>
    </div>
  );
}

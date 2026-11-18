/**
 * Barra fija en la parte de arriba de cada clase, para quien estudia
 * gratis un curso con certificado de pago. Siempre a la vista, sin tapar
 * el contenido: dice el precio real y hasta cuándo rige el descuento de
 * esa persona, y lleva a la landing de inscripción del curso
 * (/curso-de-…/inscripcion), donde compara y paga.
 *
 * Sistema de diseño 2.0 (styles/caminos.css). Sin íconos.
 * No aparece si el certificado está pagado, en proceso, emitido o si el
 * curso no lo cobra.
 */
import { useEffect, useState } from 'react';
import { Btn } from '../../components/edvanta/ui';
import { estadoDelCertificado, estudiaGratis } from '../certificadoEstado';

const pesos = (n) => `$${Number(n).toLocaleString('es-CO')}`;
const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' });

export default function BarraCertificado({ courseId, cursoSlug }) {
  const [d, setD] = useState(null);

  useEffect(() => {
    let vivo = true;
    estadoDelCertificado(courseId).then((r) => { if (vivo) setD(r); });
    return () => { vivo = false; };
  }, [courseId]);

  if (!estudiaGratis(d) || !cursoSlug) return null;
  const p = d.pago;

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
      </p>
      <Btn variant="gradient" size="sm" to={`/${cursoSlug}/inscripcion`}>Estudiar con certificado</Btn>
    </div>
  );
}

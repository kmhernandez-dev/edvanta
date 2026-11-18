/**
 * Barra fija en la parte de arriba de cada clase, para quien estudia
 * gratis un curso con certificado de pago. Siempre a la vista, sin tapar
 * el contenido: dice el precio real, hasta cuándo rige el descuento de
 * esa persona y abre la misma comparativa de la ficha del curso.
 *
 * Sistema de diseño 2.0 (styles/caminos.css): degradado suave del
 * sistema, texto fino y botón .ed-btn. Sin íconos.
 *
 * No aparece si el certificado está pagado, en proceso, emitido o si el
 * curso no lo cobra.
 */
import { useCallback, useEffect, useState } from 'react';
import { ComparativaCaminos } from '../../components/curso/DosCaminos';
import { Btn } from '../../components/edvanta/ui';
import { estadoDelCertificado, estudiaGratis, pagarCertificado } from '../certificadoEstado';

const pesos = (n) => `$${Number(n).toLocaleString('es-CO')}`;
const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' });

export default function BarraCertificado({ courseId, curso, volverA }) {
  const [d, setD] = useState(null);
  const [abierta, setAbierta] = useState(false);
  const [trabajando, setTrabajando] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let vivo = true;
    estadoDelCertificado(courseId).then((r) => { if (vivo) setD(r); });
    return () => { vivo = false; };
  }, [courseId]);

  const cerrar = useCallback(() => setAbierta(false), []);
  if (!estudiaGratis(d)) return null;
  const p = d.pago;

  const elegirCertificado = async () => {
    setTrabajando('certificado');
    setError('');
    try {
      await pagarCertificado(courseId, volverA);
    } catch (e) {
      setError(e.message);
      setTrabajando(null);
    }
  };

  return (
    <>
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
        <Btn variant="gradient" size="sm" onClick={() => setAbierta(true)}>Estudiar con certificado</Btn>
      </div>
      <ComparativaCaminos
        abierta={abierta}
        foco="certificado"
        oferta={p}
        nombre={curso}
        onCertificado={elegirCertificado}
        onGratis={cerrar}
        onCerrar={cerrar}
        trabajando={trabajando}
        error={error}
        textoGratis="Seguir gratis"
      />
    </>
  );
}

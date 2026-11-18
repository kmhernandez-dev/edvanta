/**
 * Tarjeta bajo la clase para quien estudia gratis un curso con
 * certificado de pago: qué gana con el certificado, cuánto cuesta para
 * su país y un botón directo a Mercado Pago.
 *
 * La barra de arriba (BarraCertificado) está siempre; esta tarjeta sale
 * en el momento de logro: al completar una clase, con su avance. Así no
 * cansa en cada pantalla. En una actividad bloqueada (`fijo`) sale siempre.
 * Quien ya pagó ve aquí su canal de acompañamiento por WhatsApp.
 *
 * Sistema de diseño 2.0 (styles/caminos.css). Sin íconos.
 */
import { useEffect, useState } from 'react';
import { waLink } from '../../config/links';
import { Btn } from '../../components/edvanta/ui';
import { PrecioCertificado } from '../../components/curso/DosCaminos';
import { beneficiosVigentes } from '../../data/beneficiosCertificado';
import { estadoDelCertificado, pagarCertificado } from '../certificadoEstado';

const clave = (courseId) => `edv-recordatorio-certificado-${courseId}`;

function cerradoEnEstaSesion(courseId) {
  try { return window.sessionStorage.getItem(clave(courseId)) === '1'; } catch { return false; }
}

export default function RecordatorioCertificado({
  courseId, volverA, fijo = false, titulo = 'Estás estudiando gratis. Pásate al certificado', curso = '',
  claseCompletada = false, avance = null,
}) {
  const [pago, setPago] = useState(null);
  const [cerrado, setCerrado] = useState(() => !fijo && cerradoEnEstaSesion(courseId));
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cerrado) return undefined;
    let vivo = true;
    estadoDelCertificado(courseId).then((d) => { if (vivo) setPago(d?.certificado ? null : d?.pago || null); });
    return () => { vivo = false; };
  }, [courseId, cerrado]);

  // Quien ya pagó: su canal de acompañamiento, en cada clase.
  if (!fijo && pago?.requerido && pago.estado === 'pagado') {
    return (
      <div className="aula-cert-acompanamiento">
        <p className="m-0"><b>Tu acompañamiento.</b> Karla o un docente te responde por WhatsApp en 48 horas hábiles.</p>
        <Btn
          variant="teal"
          size="sm"
          href={waLink(`Hola, equipo Edvanta. Estudio con certificado el curso «${curso}» y tengo una duda: `)}
          external
        >
          Escribir
        </Btn>
      </div>
    );
  }
  if (cerrado || !pago?.requerido || pago.estado === 'pagado') return null;
  if (!fijo && pago.estado !== 'sin_pagar') return null;
  // Fuera de una actividad bloqueada, solo en el momento de logro.
  if (!fijo && !claseCompletada) return null;
  const tituloVisible = fijo ? titulo
    : `¡Clase completada!${avance ? ` Llevas el ${Math.round(avance)} % del curso.` : ''} Que tu esfuerzo quede certificado`;

  const cerrar = () => {
    try { window.sessionStorage.setItem(clave(courseId), '1'); } catch { /* sin almacenamiento */ }
    setCerrado(true);
  };
  const pagar = async () => {
    setPagando(true);
    setError(null);
    try {
      await pagarCertificado(courseId, volverA);
    } catch (err) {
      setError(err);
      setPagando(false);
    }
  };

  return (
    <aside aria-label="Estudia con certificado" className="aula-cert-tarjeta">
      {!fijo && (
        <button type="button" onClick={cerrar} className="camino-cerrar" aria-label="Cerrar el recordatorio">
          <span aria-hidden="true">×</span>
        </button>
      )}
      <p className="camino-etiqueta">Estudiar con certificado</p>
      <p className="aula-cert-tarjeta__titulo">{tituloVisible}</p>
      <ul className="aula-cert-tarjeta__lista">
        {beneficiosVigentes().map((b) => (
          <li key={b.id}><b>{b.titulo}.</b> {b.texto}</li>
        ))}
      </ul>
      <PrecioCertificado oferta={pago} compacto />
      {error && <p role="alert" className="aula-cert-tarjeta__error">{error.message}</p>}
      <Btn variant="gradient" onClick={pagar} loading={pagando} loadingLabel="Abriendo Mercado Pago…">
        Estudiar con certificado
      </Btn>
    </aside>
  );
}

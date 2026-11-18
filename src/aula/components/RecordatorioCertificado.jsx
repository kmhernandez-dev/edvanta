/**
 * Recordatorio bajo la clase para quien estudia gratis un curso con
 * certificado de pago: qué gana con el certificado, cuánto cuesta para
 * su país y un botón directo a Mercado Pago.
 *
 * La barra de arriba (BarraCertificado) está siempre; esta tarjeta sale
 * en el momento de logro: al completar una clase, con su avance. Así no
 * cansa en cada pantalla. En una actividad bloqueada (`fijo`) sale siempre.
 *
 * No aparece si el certificado ya está pagado, emitido, en proceso de
 * pago o si el curso no lo cobra. Se puede cerrar: vuelve en la próxima
 * visita, no en cada clase de la misma sesión.
 */
import { useEffect, useState } from 'react';
import { Award, Check, CreditCard, MessageCircle, X } from 'lucide-react';
import { waLink } from '../../config/links';
import { estadoDelCertificado, pagarCertificado } from '../certificadoEstado';
import { Button } from '../ui/Button';
import { beneficiosVigentes } from '../../data/beneficiosCertificado';

const pesos = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

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
      <a
        href={waLink(`Hola, equipo Edvanta. Estudio con certificado el curso «${curso}» y tengo una duda: `)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-2 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-3 text-sm font-semibold text-[var(--aula-primary)] hover:bg-[#f3f7ff]"
      >
        <MessageCircle className="h-4 w-4 flex-none" aria-hidden="true" />
        Tu acompañamiento: escríbenos por WhatsApp. Karla o un docente te responde en 48 horas hábiles.
      </a>
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
    <aside
      aria-label="Estudia con certificado"
      className="relative mt-4 flex flex-col gap-3 rounded-[var(--aula-radius-lg)] border-2 border-[var(--aula-primary)] bg-[#f3f7ff] p-4"
    >
      {!fijo && (
      <button
        type="button"
        onClick={cerrar}
        className="absolute right-2 top-2 rounded-full p-1.5 text-[var(--aula-muted)] hover:bg-white"
        aria-label="Cerrar el recordatorio"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      )}
      <p className="flex items-center gap-2 pr-8 text-base font-extrabold text-[var(--aula-primary)]">
        <Award className="h-5 w-5 flex-none" aria-hidden="true" /> {tituloVisible}
      </p>
      <ul className="grid gap-1.5 text-sm">
        {beneficiosVigentes().map((b) => (
          <li key={b.id} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-none text-[var(--aula-success)]" aria-hidden="true" />
            <span><b>{b.titulo}.</b> {b.texto}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm">
        <span className="text-xl font-extrabold text-[var(--aula-primary)]">{pesos(pago.precio)}</span>
        {pago.conDescuento && pago.lista && (
          <> <s className="text-[var(--aula-muted)]">{pesos(pago.lista)}</s> <b className="text-[#b42318]">−{pago.descuentoPct} %</b></>
        )}
        <span className="text-[var(--aula-muted)]"> · pago único con Mercado Pago{pago.conDescuento && pago.venceEl ? ` · descuento hasta el ${new Date(pago.venceEl).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' })}` : ''}</span>
      </p>
      {error && <p role="alert" className="text-sm font-semibold text-[var(--aula-danger)]">{error.message}</p>}
      <div>
        <Button icon={CreditCard} onClick={pagar} loading={pagando} loadingLabel="Abriendo Mercado Pago…">
          Estudiar con certificado
        </Button>
      </div>
    </aside>
  );
}

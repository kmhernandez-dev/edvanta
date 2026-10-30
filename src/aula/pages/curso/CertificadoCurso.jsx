/**
 * Certificado de aprobación del curso, dentro del aula (/aula/curso-de-…/certificado).
 *
 *  - Sin completar el curso: lo que falta, y cómo se verá.
 *  - Completado: la vista previa con su nombre, el documento (opcional) y
 *    el botón para emitirlo. Se emite una vez y no cambia después.
 *  - Emitido: el diploma, el PDF, el enlace de verificación y LinkedIn.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Award, Check, Copy, Download, ExternalLink, Share2, ShieldCheck,
} from 'lucide-react';
import { get, post } from '../../api';
import { useAsync } from '../../hooks';
import { Button } from '../../ui/Button';
import { Alert, ErrorState, LoadingBlock } from '../../ui/States';
import { useToast } from '../../ui/Toast';
import Diploma from '../../../components/edvanta/Diploma';
import { enlaceDeLinkedin, urlDeVerificacion } from '../../../lib/certificado/formato';
import { useCourseData } from './CursoParticipante';

function Emitido({ c, onDescargar, descargando }) {
  const toast = useToast();
  const enlace = urlDeVerificacion(c.codigo);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace);
      toast.success('Enlace copiado. Quien lo abra verá que tu certificado es auténtico.');
    } catch {
      toast.info(enlace);
    }
  };
  return (
    <div className="flex flex-col gap-5">
      {c.estado === 'revocado' && (
        <Alert tone="danger" title="Este certificado fue revocado">
          Ya no acredita la aprobación del curso. Escribe a Edvanta si crees que es un error.
        </Alert>
      )}
      <Diploma titular={c.titular} documento={c.documento} curso={c.curso} horas={c.horas} modalidad={c.modalidad} fecha={c.emitidoEl} codigo={c.codigo} />
      {c.estado === 'vigente' && (
        <div className="flex flex-wrap gap-2">
          <Button icon={Download} onClick={onDescargar} loading={descargando} loadingLabel="Preparando el PDF…">Descargar PDF</Button>
          <Button variant="secondary" icon={Copy} onClick={copiar}>Copiar enlace de verificación</Button>
          <Button variant="secondary" icon={Share2} href={enlaceDeLinkedin(c)} target="_blank" rel="noopener noreferrer">
            Agregar a LinkedIn
          </Button>
          <Button variant="ghost" iconRight={ExternalLink} href={enlace} target="_blank" rel="noopener noreferrer">
            Ver la verificación pública
          </Button>
        </div>
      )}
      <p className="flex items-start gap-2 text-sm leading-6 text-[var(--aula-muted)]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--aula-secondary)]" aria-hidden="true" />
        Código {c.codigo}. Cualquiera puede comprobarlo con el QR o en edvanta.co/certificados; de tu documento solo se muestran los últimos cuatro caracteres.
      </p>
    </div>
  );
}

export default function CertificadoCurso() {
  const { data, courseId, rutas, reload } = useCourseData();
  const toast = useToast();
  const estado = useAsync(({ signal }) => get(`/me/courses/${courseId}/certificate`, { signal }), [courseId]);
  const [documento, setDocumento] = useState('');
  const [emitiendo, setEmitiendo] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState(null);

  const emitir = async (e) => {
    e.preventDefault();
    setEmitiendo(true);
    setError(null);
    try {
      const res = await post(`/me/courses/${courseId}/certificate`, { documento });
      estado.setData((d) => ({ ...d, certificado: res.certificado }));
      reload?.();
      toast.success('¡Listo! Tu certificado ya está emitido.');
    } catch (err) {
      setError(err);
    } finally {
      setEmitiendo(false);
    }
  };

  const descargar = async () => {
    setDescargando(true);
    try {
      const { descargarCertificado } = await import('../../../lib/certificado/pdf');
      await descargarCertificado(estado.data.certificado);
    } catch {
      toast.error('No pudimos preparar el PDF. Intenta de nuevo.');
    } finally {
      setDescargando(false);
    }
  };

  const e = data.enrollment;
  const d = estado.data;

  return (
    <div className="aula-root min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <Link to={rutas.base} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aula-muted)] hover:text-[var(--aula-primary)]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {data.snapshot.course.title}
        </Link>
        <h1 className="mt-3 flex items-center gap-2 text-2xl font-extrabold text-[var(--aula-primary)]">
          <Award className="h-6 w-6" aria-hidden="true" /> Tu certificado de aprobación
        </h1>

        <div className="mt-6">
          {estado.loading && !d && <LoadingBlock rows={3} label="Cargando tu certificado" />}
          {estado.error && <ErrorState error={estado.error} onRetry={estado.reload} />}

          {d?.certificado && <Emitido c={d.certificado} onDescargar={descargar} descargando={descargando} />}

          {d && !d.certificado && !d.elegible && (
            <div className="flex flex-col gap-5">
              <Alert tone="info" title="Lo obtienes al completar el curso">
                Llevas {e.lessons.done} de {e.lessons.required} clases obligatorias. Cuando las completes, aquí mismo emites tu certificado.
              </Alert>
              <Diploma muestra curso={d.borrador.curso} horas={d.borrador.horas} modalidad={d.borrador.modalidad} />
              <div><Button to={rutas.base} variant="secondary">Volver al curso</Button></div>
            </div>
          )}

          {d && !d.certificado && d.elegible && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
              <Diploma previa titular={d.borrador.titular} documento={documento.trim() || null} curso={d.borrador.curso} horas={d.borrador.horas} modalidad={d.borrador.modalidad} />
              <form onSubmit={emitir} className="flex flex-col gap-4 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-[var(--aula-success)]">
                  <Check className="h-4 w-4" aria-hidden="true" /> Completaste el curso
                </p>
                <div>
                  <p className="text-sm font-semibold">Tu nombre en el certificado</p>
                  <p className="mt-1 text-base font-bold text-[var(--aula-primary)]">{d.borrador.titular || 'Tu cuenta no tiene nombre'}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--aula-muted)]">
                    Sale como está en tu cuenta. ¿Está mal escrito? <Link to="/aula/cuenta" className="font-semibold text-[var(--aula-primary)] underline">Corrígelo en Mi cuenta</Link> antes de emitirlo: después no cambia.
                  </p>
                </div>
                <label className="flex flex-col gap-1.5 text-sm font-semibold">
                  Documento de identidad <span className="font-normal text-[var(--aula-muted)]">(opcional)</span>
                  <input
                    value={documento}
                    onChange={(ev) => setDocumento(ev.target.value)}
                    inputMode="text"
                    maxLength={20}
                    autoComplete="off"
                    className="min-h-11 rounded-[var(--aula-radius)] border border-[var(--aula-border)] px-3 font-normal outline-none focus:border-[var(--aula-secondary)] focus:ring-2 focus:ring-[var(--aula-secondary)]/25"
                  />
                  <span className="text-xs font-normal leading-5 text-[var(--aula-muted)]">
                    Si lo escribes, sale en tu certificado. En la verificación pública solo se ven sus últimos cuatro caracteres.
                  </span>
                </label>
                {error && <p role="alert" className="text-sm font-semibold text-[var(--aula-danger)]">{error.message}</p>}
                <Button type="submit" icon={Award} loading={emitiendo} loadingLabel="Emitiendo…" disabled={!d.borrador.titular}>
                  Emitir mi certificado
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, ExternalLink, FileDown, FileText, Save, Send } from 'lucide-react';
import { fileUrl, get, post, put } from '../../api';
import { useAsync } from '../../hooks';
import { fmtDate } from '../../labels';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../../ui/Dialog';
import { FileUploader } from '../../ui/FileUploader';
import { TextArea, TextInput } from '../../ui/Form';
import { RichText } from '../../ui/RichText';
import { Alert, ErrorState, LoadingBlock } from '../../ui/States';
import { useToast } from '../../ui/Toast';
import { useCourseData } from './CursoParticipante';
import { CursoPage } from './CursoPage';

const STATUS = {
  sin_entregar: { label: 'Sin entregar', tone: 'neutral' },
  borrador: { label: 'Borrador', tone: 'neutral' },
  pendiente_revision: { label: 'Enviada · pendiente de revisión', tone: 'warning' },
  calificado: { label: 'Calificada', tone: 'success' },
};

function Rubric({ rubric }) {
  if (!rubric?.criteria?.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Rúbrica de la actividad</caption>
        <thead><tr className="bg-[var(--aula-surface-muted)] text-xs uppercase tracking-wide text-[var(--aula-muted)]"><th className="p-2">Criterio</th><th className="p-2">Peso</th><th className="p-2">Qué se observa</th></tr></thead>
        <tbody>
          {rubric.criteria.map((c) => (
            <tr key={c.id} className="border-t border-[var(--aula-border)]">
              <td className="p-2 font-semibold">{c.name}</td>
              <td className="p-2 tabular-nums">{c.weight} %</td>
              <td className="p-2 text-[var(--aula-muted)]">{c.levels?.find((l) => l.level === 4)?.description || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Revision({ revision }) {
  if (!revision) return null;
  return (
    <div className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-4 text-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--aula-muted)]">Versión {revision.revision_number} · {fmtDate(revision.submitted_at)}</p>
      {revision.text_body && <pre className="mt-2 whitespace-pre-wrap font-sans leading-relaxed">{revision.text_body}</pre>}
      {revision.link_url && <a href={revision.link_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] underline"><ExternalLink className="h-4 w-4" aria-hidden="true" /> Abrir enlace</a>}
      {revision.file_id && <a href={fileUrl(revision.file_id, { download: true })} className="mt-2 inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] underline"><FileDown className="h-4 w-4" aria-hidden="true" /> Descargar archivo</a>}
    </div>
  );
}

export default function ActividadCurso() {
  const { activityId } = useParams();
  const { courseId, rutas, reload } = useCourseData();
  const toast = useToast();
  const detail = useAsync(({ signal }) => get(`/me/courses/${courseId}/activities/${activityId}`, { signal }), [courseId, activityId]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const loadedKey = useRef(null);

  const activity = detail.data?.activity;
  const submission = detail.data?.submission;
  const state = detail.data?.state;
  const editable = ['sin_entregar', 'borrador', 'requiere_ajustes'].includes(state?.status);

  useEffect(() => {
    if (!detail.data || !activity) return;
    const key = `${activity.id}:${submission?.currentRevision || 0}`;
    if (loadedKey.current === key) return;
    loadedKey.current = key;
    const draft = submission?.draft || null;
    const last = submission?.lastRevision || null;
    setText(draft?.text || last?.text_body || '');
    setLink(draft?.link || last?.link_url || '');
    setFile(draft?.fileId ? { id: draft.fileId, name: 'Archivo de la entrega' } : last?.file_id ? { id: last.file_id, name: 'Archivo de la entrega' } : null);
  }, [detail.data, activity, submission]);

  const payload = useMemo(() => ({ text: text.trim() || null, link: link.trim() || null, fileId: file?.id || null }), [text, link, file]);
  const hasContent = Boolean(payload.text || payload.link || payload.fileId);

  const saveDraft = async () => {
    setBusy(true);
    setError(null);
    try {
      await put(`/me/courses/${courseId}/activities/${activityId}/draft`, payload);
      await detail.reload();
      toast.success('Borrador guardado.');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await post(`/me/courses/${courseId}/activities/${activityId}/submissions`, payload);
      setConfirming(false);
      await detail.reload();
      await reload();
      toast.success('Entrega enviada. Queda pendiente de revisión docente.');
    } catch (err) {
      setError(err);
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <CursoPage
      title={activity?.title || 'Actividad'}
      subtitle={activity ? `Peso ${activity.weight ?? '—'} % · ${activity.maxPoints} puntos · ${activity.allowText ? 'texto' : ''}${activity.allowLink ? ' · enlace' : ''}${activity.allowFile ? ' · archivo' : ''}` : 'Cargando la actividad…'}
      backTo={rutas.evaluacion}
      backLabel="Volver a la evaluación"
      actions={<Button variant="secondary" to={rutas.base}>Volver al curso</Button>}
    >
      {detail.loading && !detail.data && <LoadingBlock rows={5} label="Cargando la actividad" />}
      {detail.error && !detail.data && <ErrorState error={detail.error} onRetry={detail.reload} />}
      {error && <Alert tone="danger" className="mb-4">{error.message}</Alert>}

      {detail.data && (
        <div className="flex flex-col gap-5">
          <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUS[state.status]?.tone || 'neutral'}>{STATUS[state.status]?.label || state.status}</Badge>
              {state.graded && <Badge tone="success">Nota {Number(state.score100).toFixed(1)}/100</Badge>}
              {activity.dueAt && <span className="text-xs text-[var(--aula-muted)]">Fecha límite: {fmtDate(activity.dueAt)}</span>}
            </div>
            {/* Orden de la consigna: caso de estudio, instrucciones, entrega y rúbrica. */}
            {activity.caseHtml && <RichText html={activity.caseHtml} className="mt-3" />}
            <RichText html={activity.instructionsHtml} className={activity.caseHtml ? 'mt-4' : 'mt-3'} />
            {activity.pointsToSolve?.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-bold">Qué debe contener tu entrega</h2>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                  {activity.pointsToSolve.map((point, index) => <li key={index}>{point}</li>)}
                </ol>
              </div>
            )}
            {(activity.expectedProduct || activity.extensionHint) && (
              <div className="mt-4 rounded-[var(--aula-radius)] bg-[var(--aula-surface-muted)] p-3 text-sm">
                {activity.expectedProduct && <p><strong>Producto esperado:</strong> {activity.expectedProduct}</p>}
                {activity.extensionHint && <p className="mt-1"><strong>Extensión orientativa:</strong> {activity.extensionHint}</p>}
              </div>
            )}
            {activity.materials?.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-bold">Materiales</h2>
                <ul className="mt-2 flex flex-col gap-2 text-sm">
                  {activity.materials.map((material, index) => (
                    <li key={index}>
                      {material.fileId ? (
                        <a href={fileUrl(material.fileId, { download: true })} className="inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] underline">
                          <FileDown className="h-4 w-4" aria-hidden="true" />{material.name}
                        </a>
                      ) : (
                        <a href={material.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] underline">
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />{material.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activity.supportHtml && <RichText html={activity.supportHtml} className="mt-4" />}
          </section>

          {activity.rubric?.criteria?.length > 0 && (
            <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
              <h2 className="text-lg font-bold">Rúbrica</h2>
              <p className="mb-3 mt-1 text-sm text-[var(--aula-muted)]">La nota se calcula con estos criterios. Los pesos suman 100 % dentro de la actividad.</p>
              <Rubric rubric={activity.rubric} />
            </section>
          )}

          {submission?.feedback && (
            <Alert tone={submission.rawStatus === 'requiere_ajustes' ? 'warning' : 'info'} title="Retroalimentación docente">
              <p>{submission.feedback}</p>
            </Alert>
          )}

          {submission?.rubricReview?.criteria && (
            <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
              <h2 className="text-lg font-bold">Revisión por criterio</h2>
              <ul className="mt-3 divide-y divide-[var(--aula-border)] text-sm">
                {submission.rubricReview.criteria.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span><strong>{c.name}</strong>{c.comment ? ` · ${c.comment}` : ''}</span>
                    <Badge tone={(c.score ?? (c.level / 4) * 100) >= 70 ? 'success' : (c.score ?? (c.level / 4) * 100) >= 50 ? 'warning' : 'danger'}>
                      {c.score !== undefined && c.score !== null ? `${Number(c.score).toFixed(1)}/100` : `${c.level}/4`}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {editable ? (
            <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
              <h2 className="text-lg font-bold">{submission ? 'Corregir y volver a enviar' : 'Tu entrega'}</h2>
              <p className="mt-1 text-sm text-[var(--aula-muted)]">Puedes guardar un borrador y volver después. El envío queda registrado en el servidor.</p>
              {activity.allowText && (
                <TextArea label="Texto de la entrega" value={text} onChange={(e) => setText(e.target.value)} rows={10}
                  hint="Puedes pegar un ensayo, un informe, un mapa conceptual descrito o un procedimiento." className="mt-4" />
              )}
              {activity.allowLink && (
                <TextInput label="Enlace de la entrega (opcional)" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" className="mt-4" />
              )}
              {activity.allowFile && (
                <div className="mt-4">
                  <FileUploader
                    purpose="entrega"
                    context={{ activityId: activity.id }}
                    value={file}
                    onChange={setFile}
                    label="Archivo de la entrega (opcional)"
                    hint={`Formatos: ${(activity.acceptedExtensions || []).join(', ')}. Máximo ${activity.maxFileMb} MB.`}
                    accept={(activity.acceptedExtensions || []).map((e) => `.${e}`).join(',')}
                  />
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button variant="secondary" icon={Save} onClick={saveDraft} loading={busy} disabled={!hasContent}>Guardar borrador</Button>
                <Button icon={Send} onClick={() => setConfirming(true)} disabled={!hasContent || busy}>Enviar entrega</Button>
                {!hasContent && <span className="text-xs text-[var(--aula-muted)]">Escribe, enlaza o adjunta algo para continuar.</span>}
              </div>
            </section>
          ) : (
            <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
              <h2 className="text-lg font-bold">Entrega registrada</h2>
              <p className="mt-1 text-sm text-[var(--aula-muted)]">{state.graded ? 'La entrega ya está calificada. Si necesitas corregirla, el docente debe devolverla con instrucciones.' : 'La entrega ya está enviada y espera revisión docente. No puedes modificarla mientras esté en revisión.'}</p>
              <div className="mt-3"><Revision revision={submission?.lastRevision} /></div>
              {submission?.revisions?.length > 1 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--aula-primary)]">Ver versiones anteriores ({submission.revisions.length - 1})</summary>
                  <div className="mt-3 flex flex-col gap-3">
                    {submission.revisions.slice(1).map((r) => <Revision key={r.id} revision={r} />)}
                  </div>
                </details>
              )}
            </section>
          )}

        </div>
      )}

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={submit}
        title="Enviar la entrega"
        description="Después del envío no podrás modificar esta versión. El docente verá lo que el servidor guardó. ¿Deseas enviarla?"
        confirmLabel="Enviar entrega"
      />
    </CursoPage>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, FileDown, Save, Send } from 'lucide-react';
import { fileUrl, get, post } from '../../api';
import { useAsync } from '../../hooks';
import { fmtDate } from '../../labels';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Select, TextArea, TextInput } from '../../ui/Form';
import { PageHeader } from '../../ui/Page';
import { Alert, ErrorState, LoadingBlock } from '../../ui/States';
import { useToast } from '../../ui/Toast';

const DECISIONS = [
  { value: 'en_revision', label: 'En revisión' },
  { value: 'requiere_ajustes', label: 'Requiere ajustes' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'no_aprobada', label: 'No aprobada' },
];

const LEVELS = [
  { value: '0', label: '0 · Sin evidencia' },
  { value: '1', label: '1 · Inicial' },
  { value: '2', label: '2 · En desarrollo' },
  { value: '3', label: '3 · Logrado' },
  { value: '4', label: '4 · Destacado' },
];

function Revision({ r }) {
  return (
    <div className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-4 text-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--aula-muted)]">Versión {r.revision_number} · {fmtDate(r.submitted_at)}{r.is_late ? ' · entregada tarde' : ''}</p>
      {r.text_body && <pre className="mt-2 whitespace-pre-wrap font-sans leading-relaxed">{r.text_body}</pre>}
      {r.link_url && <a href={r.link_url} target="_blank" rel="noopener noreferrer" className="mt-2 block font-semibold text-[var(--aula-primary)] underline">{r.link_url}</a>}
      {r.file_id && <a href={fileUrl(r.file_id, { download: true })} className="mt-2 inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] underline"><FileDown className="h-4 w-4" aria-hidden="true" /> Descargar archivo</a>}
    </div>
  );
}

export default function DocenteEntrega() {
  const { submissionId } = useParams();
  const toast = useToast();
  const detail = useAsync(({ signal }) => get(`/docente/submissions/${submissionId}`, { signal }), [submissionId]);
  const [levels, setLevels] = useState({});
  const [criteriaScores, setCriteriaScores] = useState({});
  const [comments, setComments] = useState({});
  const [directScore, setDirectScore] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(null);
  const submission = detail.data?.submission;
  const rubric = submission?.rubric;
  const isRubric = Boolean(rubric?.criteria?.length && submission?.gradingMethod !== 'directa');
  const rubricScale = rubric?.scale === '0-100' ? '0-100' : '0-4';

  useEffect(() => {
    if (!submission) return;
    const source = submission.reviewDraft || submission.rubricReview;
    const nextLevels = {};
    const nextScores = {};
    const nextComments = {};
    for (const c of rubric?.criteria || []) {
      const prev = source?.criteria?.find((x) => x.id === c.id);
      nextLevels[c.id] = prev?.level ?? '';
      nextScores[c.id] = prev?.score ?? '';
      nextComments[c.id] = prev?.comment ?? '';
    }
    setLevels(nextLevels);
    setCriteriaScores(nextScores);
    setComments(nextComments);
    setDirectScore(source?.score100 !== undefined && source?.score100 !== null
      ? String(source.score100)
      : submission.score !== null && submission.score !== undefined
        ? String(Math.round((Number(submission.score) / Number(submission.maxPoints)) * 10000) / 100)
        : '');
    setFeedback(source?.feedback || '');
    setDecision(source?.decision || '');
    setChangeReason('');
  }, [submission, rubric]);

  const preview = useMemo(() => {
    if (!isRubric) {
      if (directScore === '' || !Number.isFinite(Number(directScore))) return { complete: false, score: null };
      const value = Number(directScore);
      if (value < 0 || value > 100) return { complete: false, score: null, outOfRange: true };
      return { complete: true, score: Math.round(value * 100) / 100 };
    }
    const complete = rubric.criteria.every((c) => (rubricScale === '0-100'
      ? criteriaScores[c.id] !== '' && criteriaScores[c.id] !== undefined
      : levels[c.id] !== '' && levels[c.id] !== undefined));
    if (!complete) return { complete: false, score: null };
    const score = rubric.criteria.reduce((sum, c) => sum + (rubricScale === '0-100'
      ? (Number(criteriaScores[c.id]) * Number(c.weight)) / 100
      : (Number(c.weight) * Number(levels[c.id])) / 4), 0);
    return { complete: true, score: Math.round(score * 100) / 100 };
  }, [isRubric, directScore, rubric, rubricScale, levels, criteriaScores]);

  const criteriaPayload = () => (rubric?.criteria || []).map((c) => ({
    id: c.id,
    ...(rubricScale === '0-100' ? { score: Number(criteriaScores[c.id]) } : { level: Number(levels[c.id]) }),
    comment: comments[c.id] || '',
  }));

  const send = async (publish) => {
    if (!preview?.complete) {
      setError(new Error(isRubric ? 'Completa todos los criterios.' : 'Escribe una nota entre 0 y 100.'));
      return;
    }
    if (publish && !decision) { setError(new Error('Elige una decisión antes de publicar.')); return; }
    setBusy(true);
    setError(null);
    setSaved(null);
    try {
      const res = await post(`/docente/submissions/${submissionId}/review`, {
        ...(isRubric ? { criteria: criteriaPayload() } : { score: Number(directScore) }),
        feedback,
        decision: decision || null,
        changeReason: changeReason || null,
        publish,
      });
      setSaved(res);
      await detail.reload();
      toast.success(publish ? `Calificación publicada: ${Number(res.review.score).toFixed(1)}/${res.review.maxPoints}.` : 'Revisión guardada como borrador.');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Revisión de entrega"
        title={submission?.activityTitle || 'Entrega'}
        description={submission ? `${submission.student.name} · ${submission.student.email} · versión ${submission.currentRevision}` : 'Cargando la entrega…'}
        back={{ to: submission ? `/aula/docente/curso/${submission.courseId}` : '/aula/docente', label: 'Volver al curso' }}
      />
      {detail.loading && !submission && <LoadingBlock rows={5} label="Cargando la entrega" />}
      {detail.error && <ErrorState error={detail.error} onRetry={detail.reload} />}
      {error && <Alert tone="danger" className="mb-4">{error.message}</Alert>}
      {saved && <Alert tone="success" className="mb-4" title={saved.draft ? 'Borrador guardado' : 'Calificación publicada'}><p>{saved.draft ? 'Todavía no es visible para el estudiante.' : `Nota ${Number(saved.review.score).toFixed(1)}/${saved.review.maxPoints}.`}</p></Alert>}
      {submission && (
        <div className="flex flex-col gap-5">
          <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={submission.status === 'aprobada' ? 'success' : submission.status === 'requiere_ajustes' ? 'warning' : 'info'}>{submission.status}</Badge>
              {submission.score !== null && <Badge tone="success">Nota {Number(submission.score).toFixed(1)}/{submission.maxPoints}</Badge>}
              <span className="text-xs text-[var(--aula-muted)]">Enviada {fmtDate(submission.lastSubmittedAt)}</span>
            </div>
            <h2 className="mt-4 text-lg font-bold">Versiones entregadas</h2>
            <div className="mt-2 flex flex-col gap-3">
              {submission.revisions.map((r) => <Revision key={r.id} r={r} />)}
              {submission.revisions.length === 0 && <p className="text-sm text-[var(--aula-muted)]">Esta entrega no tiene versiones.</p>}
            </div>
          </section>

          {submission.feedback?.length > 0 && (
            <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
              <h2 className="text-lg font-bold">Historial de revisión</h2>
              <ul className="mt-2 divide-y divide-[var(--aula-border)] text-sm">
                {submission.feedback.map((f) => (
                  <li key={f.id} className="py-2"><strong>{f.decision}</strong> · {fmtDate(f.created_at)}{f.score !== null ? ` · ${Number(f.score).toFixed(1)}` : ''}<p className="text-[var(--aula-muted)]">{f.body}</p></li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
            <h2 className="text-lg font-bold">{isRubric ? 'Rúbrica y calificación' : 'Calificación directa'}</h2>
            <p className="mt-1 text-sm text-[var(--aula-muted)]">
              {isRubric
                ? 'Aplica cada criterio. La nota se calcula en el servidor con los pesos de la rúbrica.'
                : 'Escribe cualquier nota válida entre 0 y 100. Se admiten decimales. Cero es una nota válida y distinta de «Sin calificar».'}
            </p>
            {isRubric ? (
              <div className="mt-4 flex flex-col gap-4">
                {(rubric?.criteria || []).map((c) => (
                  <fieldset key={c.id} className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
                    <legend className="px-1 text-sm font-bold">{c.name} <span className="font-normal text-[var(--aula-muted)]">({c.weight} %)</span></legend>
                    <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
                      {rubricScale === '0-100' ? (
                        <TextInput
                          label="Nota del criterio (0 a 100)"
                          inputMode="decimal"
                          value={String(criteriaScores[c.id] ?? '')}
                          onChange={(e) => setCriteriaScores((v) => ({ ...v, [c.id]: e.target.value.replace(/[^\d.]/g, '') }))}
                        />
                      ) : (
                        <Select label="Nivel" value={String(levels[c.id] ?? '')} onChange={(e) => setLevels((l) => ({ ...l, [c.id]: e.target.value }))} options={LEVELS} placeholder="Selecciona" />
                      )}
                      <TextArea label="Comentario (opcional)" rows={2} value={comments[c.id] || ''} onChange={(e) => setComments((v) => ({ ...v, [c.id]: e.target.value }))} />
                    </div>
                  </fieldset>
                ))}
              </div>
            ) : (
              <div className="mt-4 max-w-xs">
                <TextInput
                  label="Nota (0 a 100)"
                  inputMode="decimal"
                  value={directScore}
                  onChange={(e) => setDirectScore(e.target.value.replace(/[^\d.]/g, ''))}
                  hint="Se guarda en el servidor y se convierte al puntaje de la actividad."
                />
              </div>
            )}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Select label="Decisión" value={decision} onChange={(e) => setDecision(e.target.value)} options={DECISIONS} placeholder="Elige una decisión" />
              <div className="flex items-end"><p className="text-sm text-[var(--aula-muted)]">Nota calculada: <strong className="text-lg text-[var(--aula-text)]">{preview?.complete ? preview.score.toFixed(1) : '-'}</strong>/100</p></div>
            </div>
            <TextArea label="Retroalimentación para el estudiante" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} className="mt-3" />
            {submission.score !== null && submission.score !== undefined && (
              <TextInput
                className="mt-3"
                label="Motivo del cambio de nota (obligatorio si cambias una nota publicada)"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                hint="Queda en el historial de cambios junto con la fecha y tu usuario."
              />
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" icon={Save} onClick={() => send(false)} loading={busy} disabled={!preview?.complete}>Guardar borrador</Button>
              <Button icon={Send} onClick={() => send(true)} loading={busy} disabled={!preview?.complete || !decision}>Publicar calificación</Button>
            </div>
            {!preview?.complete && <p className="mt-2 text-xs text-[var(--aula-warning)]">{isRubric ? 'Completa todos los criterios para guardar o publicar.' : 'Escribe una nota entre 0 y 100 para guardar o publicar.'}</p>}
          </section>
        </div>
      )}
    </div>
  );
}


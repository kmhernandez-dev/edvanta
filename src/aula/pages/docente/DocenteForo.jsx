import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EyeOff, FileDown, MessageSquare, Send } from 'lucide-react';
import { fileUrl, get, post } from '../../api';
import { useAsync } from '../../hooks';
import { fmtDate } from '../../labels';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../../ui/Dialog';
import { Select, TextArea } from '../../ui/Form';
import { PageHeader } from '../../ui/Page';
import { RichText } from '../../ui/RichText';
import { Alert, ErrorState, LoadingBlock } from '../../ui/States';
import { useToast } from '../../ui/Toast';

const LEVELS = ['0', '1', '2', '3', '4'];

export default function DocenteForo() {
  const { forumId } = useParams();
  const toast = useToast();
  const forumDetail = useAsync(({ signal }) => get(`/docente/forums/${forumId}`, { signal }), [forumId]);
  const forum = forumDetail.data?.forum;
  const courseDetail = useAsync(
    ({ signal }) => (forum?.courseId ? get(`/docente/courses/${forum.courseId}`, { signal }) : Promise.resolve(null)),
    [forum?.courseId],
  );
  const [enrollmentId, setEnrollmentId] = useState('');
  const [levels, setLevels] = useState({});
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [hide, setHide] = useState(null);

  const criteria = forum?.rubric?.criteria || [];
  const hasRubric = criteria.length > 0;
  const preview = useMemo(() => {
    if (!hasRubric) return score === '' ? null : Number(score);
    const complete = criteria.every((c) => levels[c.id] !== undefined && levels[c.id] !== '');
    if (!complete) return null;
    return Math.round(criteria.reduce((sum, c) => sum + (Number(c.weight) * Number(levels[c.id])) / 4, 0) * 100) / 100;
  }, [hasRubric, criteria, levels, score]);

  const grade = async () => {
    if (!enrollmentId) { setError(new Error('Elige un estudiante.')); return; }
    if (preview === null) { setError(new Error('Completa la rúbrica o escribe una nota.')); return; }
    setBusy(true);
    setError(null);
    try {
      await post(`/docente/forums/${forumId}/grade`, {
        enrollmentId: Number(enrollmentId),
        feedback,
        ...(hasRubric ? { criteria: criteria.map((c) => ({ id: c.id, level: Number(levels[c.id]) })) } : { score: Number(score) }),
      });
      await forumDetail.reload();
      setFeedback('');
      toast.success(`Foro calificado: ${preview.toFixed(1)}/100.`);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const hidePost = async (reason) => {
    if (!hide) return;
    await post(`/docente/forum-posts/${hide}/hide`, { reason });
    setHide(null);
    await forumDetail.reload();
    toast.success('Mensaje oculto.');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Revisión de foro"
        title={forum?.title || 'Foro'}
        description={forum ? `Peso ${forum.weight ?? '—'} % · ${forumDetail.data.posts.length} publicaciones` : 'Cargando el foro…'}
        back={{ to: forum?.courseId ? `/aula/docente/curso/${forum.courseId}` : '/aula/docente', label: 'Volver al curso' }}
      />
      {forumDetail.loading && !forum && <LoadingBlock rows={5} label="Cargando el foro" />}
      {forumDetail.error && <ErrorState error={forumDetail.error} onRetry={forumDetail.reload} />}
      {error && <Alert tone="danger" className="mb-4">{error.message}</Alert>}
      {forumDetail.data && (
        <div className="flex flex-col gap-5">
          <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
            <h2 className="text-lg font-bold">Consigna</h2>
            <RichText html={forum.description} className="mt-2" />
          </section>

          <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold"><MessageSquare className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Publicaciones</h2>
            <div className="mt-3 flex flex-col gap-3">
              {forumDetail.data.posts.map((p) => (
                <article key={p.id} className={`rounded-[var(--aula-radius)] border p-4 ${p.is_hidden ? 'border-[var(--aula-border)] bg-[var(--aula-surface-muted)] opacity-70' : 'border-[var(--aula-border)] bg-white'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">{p.author} {p.thread_id ? '· respuesta' : '· intervención'}</p>
                      <p className="text-xs text-[var(--aula-muted)]">{p.email} · {fmtDate(p.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.is_hidden && <Badge tone="neutral">Oculto</Badge>}
                      {!p.is_hidden && <Button size="sm" variant="ghost" icon={EyeOff} onClick={() => setHide(p.id)}>Ocultar</Button>}
                    </div>
                  </div>
                  {p.title && <p className="mt-2 font-semibold">{p.title}</p>}
                  <RichText html={p.body_html} className="mt-1 text-sm" />
                  {p.file_id && <a href={fileUrl(p.file_id, { download: true })} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--aula-primary)] underline"><FileDown className="h-3.5 w-3.5" aria-hidden="true" /> Adjunto</a>}
                </article>
              ))}
              {forumDetail.data.posts.length === 0 && <p className="text-sm text-[var(--aula-muted)]">Todavía no hay publicaciones.</p>}
            </div>
          </section>

          <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
            <h2 className="text-lg font-bold">Calificar el foro</h2>
            <p className="mt-1 text-sm text-[var(--aula-muted)]">La nota se guarda por estudiante y actualiza su nota del curso. El número de mensajes no sustituye la calidad.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Select label="Estudiante" value={enrollmentId} onChange={(e) => setEnrollmentId(e.target.value)} placeholder="Elige un estudiante"
                options={(courseDetail.data?.students || []).map((s) => ({ value: String(s.enrollmentId), label: `${s.name} · ${s.email}` }))} />
              {hasRubric ? (
                <div className="flex items-end"><p className="text-sm text-[var(--aula-muted)]">Nota calculada: <strong className="text-lg text-[var(--aula-text)]">{preview === null ? '—' : preview.toFixed(1)}</strong>/100</p></div>
              ) : (
                <Select label="Nota (0–100)" value={score} onChange={(e) => setScore(e.target.value)} options={Array.from({ length: 21 }, (_, i) => ({ value: String(i * 5), label: String(i * 5) }))} />
              )}
            </div>
            {hasRubric && (
              <div className="mt-4 flex flex-col gap-3">
                {criteria.map((c) => (
                  <div key={c.id} className="grid gap-2 sm:grid-cols-[1fr_160px] sm:items-end">
                    <div><p className="text-sm font-semibold">{c.name} <span className="font-normal text-[var(--aula-muted)]">({c.weight} %)</span></p></div>
                    <Select label={`Nivel · ${c.name}`} value={String(levels[c.id] ?? '')} onChange={(e) => setLevels((l) => ({ ...l, [c.id]: e.target.value }))} options={LEVELS.map((v) => ({ value: v, label: v }))} placeholder="Nivel" />
                  </div>
                ))}
              </div>
            )}
            <TextArea label="Retroalimentación" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-3" />
            <div className="mt-3"><Button icon={Send} onClick={grade} loading={busy} disabled={preview === null || !enrollmentId}>Publicar nota del foro</Button></div>
          </section>

          <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
            <h2 className="text-lg font-bold">Calificaciones registradas</h2>
            <ul className="mt-2 divide-y divide-[var(--aula-border)] text-sm">
              {forumDetail.data.grades.map((g) => (
                <li key={g.enrollmentId} className="flex flex-wrap items-center justify-between gap-2 py-2"><span>{g.student} · {g.email}</span><span className="font-bold tabular-nums">{g.score === null ? '—' : Number(g.score).toFixed(1)}/100</span></li>
              ))}
              {forumDetail.data.grades.length === 0 && <li className="py-2 text-[var(--aula-muted)]">Todavía no hay calificaciones.</li>}
            </ul>
          </section>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(hide)}
        onClose={() => setHide(null)}
        onConfirm={hidePost}
        title="Ocultar publicación"
        description="La publicación dejará de ser visible para los estudiantes. La acción queda en la bitácora."
        confirmLabel="Ocultar"
        requireReason
        reasonLabel="Motivo"
        tone="danger"
      />
    </div>
  );
}

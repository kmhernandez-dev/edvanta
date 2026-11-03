import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CornerDownRight, FileDown, MessageSquare, Send } from 'lucide-react';
import { fileUrl, get, post } from '../../api';
import { useAsync } from '../../hooks';
import { fmtDate } from '../../labels';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { FileUploader } from '../../ui/FileUploader';
import { TextArea, TextInput } from '../../ui/Form';
import { RichText } from '../../ui/RichText';
import { Alert, ErrorState, LoadingBlock } from '../../ui/States';
import { useToast } from '../../ui/Toast';
import { useCourseData } from './CursoParticipante';
import { CursoPage } from './CursoPage';

function Rubric({ rubric }) {
  if (!rubric?.criteria?.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Rúbrica del foro</caption>
        <thead><tr className="bg-[var(--aula-surface-muted)] text-xs uppercase tracking-wide text-[var(--aula-muted)]"><th className="p-2">Criterio</th><th className="p-2">Peso</th><th className="p-2">Nivel destacado</th></tr></thead>
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

function Post({ post, replies, onReply, canPost }) {
  return (
    <article className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold">{post.title}</h3>
          <p className="text-xs text-[var(--aula-muted)]">{post.author} · {fmtDate(post.createdAt)}{post.isMine ? ' · tu intervención' : ''}</p>
        </div>
        {post.isMine && <Badge tone="accent">Tuya</Badge>}
      </div>
      <RichText html={post.bodyHtml} className="mt-2" />
      {post.fileId && <a href={fileUrl(post.fileId, { download: true })} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--aula-primary)] underline"><FileDown className="h-4 w-4" aria-hidden="true" /> Descargar adjunto</a>}
      {replies.length > 0 && (
        <div className="mt-3 flex flex-col gap-2 border-l-2 border-[var(--aula-secondary-soft)] pl-3">
          {replies.map((r) => (
            <div key={r.id} className="rounded-[var(--aula-radius)] bg-[var(--aula-surface-muted)] p-3">
              <p className="text-xs text-[var(--aula-muted)]"><CornerDownRight className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />{r.author} · {fmtDate(r.createdAt)}</p>
              <RichText html={r.bodyHtml} className="mt-1 text-sm" />
              {r.fileId && <a href={fileUrl(r.fileId, { download: true })} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--aula-primary)] underline"><FileDown className="h-3.5 w-3.5" aria-hidden="true" /> Adjunto</a>}
            </div>
          ))}
        </div>
      )}
      {canPost && <Button size="sm" variant="ghost" className="mt-3" icon={CornerDownRight} onClick={() => onReply(post.id)}>Responder</Button>}
    </article>
  );
}

export default function ForoCurso() {
  const { forumId } = useParams();
  const { courseId, rutas, reload } = useCourseData();
  const toast = useToast();
  const detail = useAsync(({ signal }) => get(`/me/courses/${courseId}/forums/${forumId}`, { signal }), [courseId, forumId]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [replyBody, setReplyBody] = useState('');
  const [replyFile, setReplyFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const forum = detail.data?.forum;

  const roots = useMemo(() => (detail.data?.posts || []).filter((p) => !p.threadId), [detail.data]);
  const repliesOf = (id) => (detail.data?.posts || []).filter((p) => p.threadId === id);

  const publish = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await post(`/me/courses/${courseId}/forums/${forumId}/posts`, {
        title, bodyHtml: body, fileId: file?.id || null,
      });
      setTitle('');
      setBody('');
      setFile(null);
      await detail.reload();
      await reload();
      toast.success('Intervención publicada.');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const reply = async (e) => {
    e.preventDefault();
    if (!replyTo) return;
    setBusy(true);
    setError(null);
    try {
      await post(`/me/courses/${courseId}/forums/${forumId}/posts/${replyTo}/replies`, {
        bodyHtml: replyBody, fileId: replyFile?.id || null,
      });
      setReplyTo(null);
      setReplyBody('');
      setReplyFile(null);
      await detail.reload();
      await reload();
      toast.success('Respuesta publicada.');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <CursoPage
      title={forum?.title || 'Foro'}
      subtitle={forum ? `Peso ${forum.weight ?? '—'} % · ${forum.isClosed ? 'Foro cerrado' : 'Participación abierta'}` : 'Cargando el foro…'}
      backTo={rutas.evaluacion}
      backLabel="Volver a la evaluación"
      actions={<Button variant="secondary" to={rutas.base}>Volver al curso</Button>}
    >
      {detail.loading && !detail.data && <LoadingBlock rows={5} label="Cargando el foro" />}
      {detail.error && !detail.data && <ErrorState error={detail.error} onRetry={detail.reload} />}
      {error && <Alert tone="danger" className="mb-4">{error.message}</Alert>}
      {detail.data && (
        <div className="flex flex-col gap-5">
          <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={detail.data.state.graded ? 'success' : detail.data.state.participated ? 'warning' : 'neutral'}>
                {detail.data.state.graded ? `Nota ${Number(detail.data.state.score).toFixed(1)}/100` : detail.data.state.participated ? 'Participaste · pendiente de valoración' : 'Sin participación'}
              </Badge>
              {!forum.isOpen && <Badge tone="neutral">Cerrado a respuestas</Badge>}
              {forum.gradingMethod !== 'formativa' && forum.weight !== null && <span className="text-xs text-[var(--aula-muted)]">Peso {forum.weight} %</span>}
            </div>
            {forum.purpose && <p className="mt-3 text-sm font-semibold">{forum.purpose}</p>}
            <RichText html={forum.description} className="mt-3" />
            {forum.centralQuestion && (
              <p className="mt-4 rounded-[var(--aula-radius)] bg-[var(--aula-surface-muted)] px-3 py-2 text-sm"><strong>Pregunta central:</strong> {forum.centralQuestion}</p>
            )}
            {forum.guidingQuestions?.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-bold">Preguntas de profundización</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{forum.guidingQuestions.map((q, index) => <li key={index}>{q}</li>)}</ul>
              </div>
            )}
            {forum.participationHtml && <RichText html={forum.participationHtml} className="mt-4" />}
            {forum.rulesHtml && <RichText html={forum.rulesHtml} className="mt-4" />}
            {forum.noParticipantsAlternative && <Alert tone="info" className="mt-4" title="Alternativa pedagógica">{forum.noParticipantsAlternative}</Alert>}
            {forum.opensAt && <p className="mt-3 text-xs text-[var(--aula-muted)]">Abre: {fmtDate(forum.opensAt)}{forum.closesAt ? ` · Cierra: ${fmtDate(forum.closesAt)}` : ''}</p>}
            {detail.data.state.feedback && <p className="mt-3 rounded-[var(--aula-radius)] bg-[var(--aula-surface-muted)] px-3 py-2 text-sm"><strong>Retroalimentación docente:</strong> {detail.data.state.feedback}</p>}
          </section>

          <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
            <h2 className="text-lg font-bold">Criterios de valoración</h2>
            <div className="mt-2"><Rubric rubric={forum.rubric} /></div>
          </section>

          <section aria-labelledby="foro-intervenciones">
            <h2 id="foro-intervenciones" className="mb-3 flex items-center gap-2 text-lg font-bold"><MessageSquare className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Intervenciones ({detail.data.posts.length})</h2>
            {roots.length === 0 ? (
              <p className="rounded-[var(--aula-radius-lg)] border border-dashed border-[var(--aula-border-strong)] p-5 text-sm text-[var(--aula-muted)]">Todavía no hay intervenciones. Si el foro está abierto, puedes iniciar la conversación.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {roots.map((p) => <Post key={p.id} post={p} replies={repliesOf(p.id)} canPost={detail.data.canPost} onReply={setReplyTo} />)}
              </div>
            )}
          </section>

          {detail.data.canPost ? (
            <>
              {replyTo && (
                <form onSubmit={reply} className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-secondary)] bg-white p-5">
                  <h2 className="text-lg font-bold">Responder</h2>
                  <TextArea label="Tu respuesta" value={replyBody} onChange={(e) => setReplyBody(e.target.value)} rows={5} className="mt-3" required />
                  {forum.allowAttachments && <div className="mt-3"><FileUploader purpose="foro" context={{ forumId: forum.id }} value={replyFile} onChange={setReplyFile} label="Adjunto (opcional)" /></div>}
                  <div className="mt-3 flex gap-2"><Button type="submit" icon={Send} loading={busy} disabled={!replyBody.trim()}>Publicar respuesta</Button><Button variant="ghost" onClick={() => setReplyTo(null)}>Cancelar</Button></div>
                </form>
              )}
              <form onSubmit={publish} className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
                <h2 className="text-lg font-bold">Publicar una intervención</h2>
                <p className="mt-1 text-sm text-[var(--aula-muted)]">Incluye una postura, un argumento y una aplicación al caso. Después responde a dos compañeros con una comparación, una pregunta o una evidencia.</p>
                <TextInput label="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-3" required maxLength={200} />
                <TextArea label="Tu intervención" value={body} onChange={(e) => setBody(e.target.value)} rows={7} className="mt-3" required />
                {forum.allowAttachments && <div className="mt-3"><FileUploader purpose="foro" context={{ forumId: forum.id }} value={file} onChange={setFile} label="Adjunto (opcional)" /></div>}
                <div className="mt-3"><Button type="submit" icon={Send} loading={busy} disabled={!title.trim() || !body.trim()}>Publicar intervención</Button></div>
              </form>
            </>
          ) : (
            <Alert tone="info" title="No puedes publicar ahora">{detail.data.isMuted ? 'Un administrador limitó tu participación en este foro.' : forum.closedMessage || 'Este foro está cerrado. Puedes leer las intervenciones existentes.'}</Alert>
          )}
        </div>
      )}
    </CursoPage>
  );
}

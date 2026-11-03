import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Circle, RotateCcw, Save, Send, XCircle } from 'lucide-react';
import { get, post, put } from '../../api';
import { useAsync } from '../../hooks';
import { fmtDate } from '../../labels';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../../ui/Dialog';
import { RichText } from '../../ui/RichText';
import { Alert, ErrorState, LoadingBlock } from '../../ui/States';
import { useToast } from '../../ui/Toast';
import { useCourseData } from './CursoParticipante';
import { CursoPage } from './CursoPage';

const STATUS_LABEL = {
  en_curso: 'En curso', calificado: 'Calificado', pendiente: 'Pendiente', aprobado: 'Aprobado', finalizado: 'Finalizado',
};

function Option({ option, checked, name, onChange, feedback }) {
  const correct = feedback?.options?.find((o) => o.id === option.id);
  return (
    <label className={`flex cursor-pointer gap-3 rounded-[var(--aula-radius)] border p-3 text-sm transition-colors ${
      checked ? 'border-[var(--aula-primary)] bg-[var(--aula-primary-soft)]' : 'border-[var(--aula-border)] bg-white hover:border-[var(--aula-secondary)]'
    }`}>
      <input type="radio" name={name} value={option.id} checked={checked} onChange={onChange} className="mt-1 h-4 w-4 accent-[var(--aula-primary)]" />
      <span className="min-w-0 flex-1">
        <span>{option.text}</span>
        {correct && (
          <span className={`mt-1 block text-xs font-semibold ${correct.isCorrect ? 'text-[var(--aula-success)]' : 'text-[var(--aula-danger)]'}`}>
            {correct.isCorrect ? 'Respuesta correcta' : 'No es la respuesta correcta'}
            {correct.feedback ? ` · ${correct.feedback}` : ''}
          </span>
        )}
      </span>
    </label>
  );
}

function Result({ result, onRetry, canRetry, backTo, onBack }) {
  const a = result.attempt;
  return (
    <div className="flex flex-col gap-5">
      <section className={`rounded-[var(--aula-radius-lg)] border p-5 ${a.passed ? 'border-[#BEE6E3] bg-[var(--aula-success-soft)]' : 'border-[#F5DDAD] bg-[var(--aula-warning-soft)]'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{a.passed ? 'Aprobaste este intento' : 'Este intento no alcanzó la nota mínima'}</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">{Number(a.scorePct).toFixed(1)}<span className="text-base font-semibold text-[var(--aula-muted)]">/100</span></p>
            <p className="mt-1 text-xs text-[var(--aula-muted)]">Intento {a.number} · {a.submittedAt ? fmtDate(a.submittedAt) : 'enviado'}. La nota que cuenta es la mejor de tus intentos.</p>
          </div>
          <Badge tone={a.passed ? 'success' : 'warning'}>{a.passed ? 'Aprobado' : 'No aprobado'}</Badge>
        </div>
        {result.alreadySubmitted && <p className="mt-3 text-xs text-[var(--aula-muted)]">Este envío ya estaba registrado; no se creó otro intento.</p>}
      </section>

      <section className="flex flex-col gap-4" aria-label="Retroalimentación">
        <h2 className="text-lg font-bold">Retroalimentación</h2>
        {(result.feedback || []).map((f, i) => {
          const q = a.questions.find((x) => x.id === f.questionId);
          const selected = a.answers?.[String(f.questionId)] ?? a.answers?.[f.questionId];
          return (
            <article key={f.questionId} className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
              <div className="flex items-start gap-2">
                {f.isCorrect ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--aula-success)]" aria-hidden="true" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--aula-danger)]" aria-hidden="true" />}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--aula-muted)]">Pregunta {i + 1} · {f.pointsAwarded}/{f.maxPoints} puntos</p>
                  {q && <RichText html={q.promptHtml} className="mt-2" />}
                  <div className="mt-3 flex flex-col gap-2">
                    {(q?.options || []).map((o) => {
                      const info = f.options?.find((x) => x.id === o.id);
                      return (
                        <div key={o.id} className={`rounded-[var(--aula-radius)] border px-3 py-2 text-sm ${
                          info?.isCorrect ? 'border-[#BEE6E3] bg-[var(--aula-success-soft)]' : Number(selected) === o.id ? 'border-[#F9C9C4] bg-[var(--aula-danger-soft)]' : 'border-[var(--aula-border)]'
                        }`}>
                          <p>{o.text}{info?.isCorrect ? ' · correcta' : Number(selected) === o.id ? ' · tu respuesta' : ''}</p>
                          {info?.feedback && <p className="mt-1 text-xs text-[var(--aula-muted)]">{info.feedback}</p>}
                        </div>
                      );
                    })}
                  </div>
                  {f.explanation && <p className="mt-3 rounded-[var(--aula-radius)] bg-[var(--aula-surface-muted)] px-3 py-2 text-sm"><strong>Explicación:</strong> {f.explanation}</p>}
                </div>
              </div>
            </article>
          );
        })}
        {(!result.feedback || result.feedback.length === 0) && (
          <p className="text-sm text-[var(--aula-muted)]">La política de este quiz no muestra las respuestas correctas. Revisa la explicación con tu docente.</p>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onBack}>Volver a la evaluación</Button>
        <Button to={backTo}>Volver al curso</Button>
        {canRetry && <Button icon={RotateCcw} onClick={onRetry}>Intentar de nuevo</Button>}
      </div>
    </div>
  );
}

export default function QuizCurso() {
  const { quizId } = useParams();
  const { courseId, rutas, data, reload } = useCourseData();
  const toast = useToast();
  const detail = useAsync(({ signal }) => get(`/me/courses/${courseId}/assessments/${quizId}`, { signal }), [courseId, quizId]);
  const [answers, setAnswers] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const loadedAttempt = useRef(null);

  const attempt = detail.data?.openAttempt || null;
  useEffect(() => {
    if (!attempt || loadedAttempt.current === attempt.id) return;
    loadedAttempt.current = attempt.id;
    setAnswers(attempt.answers || {});
    setResult(null);
    setError(null);
  }, [attempt]);

  const answeredCount = useMemo(() => (attempt?.questions || []).filter((q) => answers[q.id]).length, [attempt, answers]);
  const totalQuestions = attempt?.questions?.length || 0;
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      await post(`/me/courses/${courseId}/assessments/${quizId}/attempts`, {});
      await detail.reload();
      toast.success('Intento iniciado. Puedes guardar tu avance y volver después.');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload = (attempt?.questions || []).map((q) => ({ questionId: q.id, optionId: answers[q.id] || null }));
      await put(`/me/courses/${courseId}/assessments/${quizId}/attempt`, { answers: payload });
      toast.success('Avance guardado en el servidor.');
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
      const payload = (attempt?.questions || []).map((q) => ({ questionId: q.id, optionId: answers[q.id] }));
      const res = await post(`/me/courses/${courseId}/assessments/${quizId}/attempt/submit`, { answers: payload });
      setResult(res);
      setConfirming(false);
      await detail.reload();
      await reload();
      toast.success(res.alreadySubmitted ? 'El intento ya estaba enviado.' : `Intento calificado: ${Number(res.attempt.scorePct).toFixed(1)}/100.`);
    } catch (err) {
      setError(err);
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  };

  const viewAttempt = async (attemptId) => {
    setBusy(true);
    setError(null);
    try {
      const res = await get(`/me/courses/${courseId}/assessments/${quizId}/attempts/${attemptId}`);
      setResult(res);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const resetAttempt = async () => {
    setResult(null);
    loadedAttempt.current = null;
    await start();
  };

  const assessment = detail.data?.assessment;

  return (
    <CursoPage
      title={assessment?.title || 'Quiz'}
      subtitle={assessment ? `${assessment.instructionsHtml ? '' : ''}Peso ${assessment.weight ?? '—'} % · ${assessment.maxAttempts} intentos · aprueba con ${assessment.passingScore}/100.` : 'Cargando el quiz…'}
      backTo={rutas.evaluacion}
      backLabel="Volver a la evaluación"
      actions={<Button variant="secondary" to={rutas.base}>Volver al curso</Button>}
    >
      {detail.loading && !detail.data && <LoadingBlock rows={5} label="Cargando el quiz" />}
      {detail.error && !detail.data && <ErrorState error={detail.error} onRetry={detail.reload} />}
      {error && <Alert tone="danger" className="mb-4">{error.message}</Alert>}

      {detail.data && (
        <div className="flex flex-col gap-5">
          {assessment?.instructionsHtml && <div className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-[var(--aula-surface)] p-5"><RichText html={assessment.instructionsHtml} /></div>}

          {result && !attempt ? (
            <Result
              result={result}
              canRetry={Boolean(assessment?.canStart)}
              onRetry={resetAttempt}
              backTo={rutas.base}
              onBack={() => setResult(null)}
            />
          ) : attempt ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--aula-radius)] bg-[var(--aula-surface-muted)] px-4 py-3 text-sm">
                <span className="font-semibold">Intento {attempt.number} en curso</span>
                <span className="text-[var(--aula-muted)]">{answeredCount} de {totalQuestions} respondidas</span>
              </div>
              <ol className="flex flex-col gap-5">
                {attempt.questions.map((q, i) => (
                  <li key={q.id}>
                    <fieldset className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
                      <legend className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--aula-muted)]">Pregunta {i + 1} · {q.points} puntos</legend>
                      <RichText html={q.promptHtml} className="mt-2" />
                      <div className="mt-4 flex flex-col gap-2">
                        {q.options.map((o) => (
                          <Option
                            key={o.id}
                            option={o}
                            name={`quiz-${q.id}`}
                            checked={Number(answers[q.id]) === Number(o.id)}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                          />
                        ))}
                      </div>
                    </fieldset>
                  </li>
                ))}
              </ol>
              <div className="sticky bottom-3 flex flex-wrap items-center gap-2 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white/95 p-3 shadow-[var(--aula-shadow)] backdrop-blur">
                <Button variant="secondary" icon={Save} onClick={save} loading={busy} loadingLabel="Guardando…">Guardar avance</Button>
                <Button icon={Send} onClick={() => setConfirming(true)} disabled={!allAnswered || busy} title={!allAnswered ? 'Responde todas las preguntas para enviar' : undefined}>
                  Enviar intento
                </Button>
                {!allAnswered && <span className="text-xs text-[var(--aula-muted)]">Responde las {totalQuestions - answeredCount} preguntas que faltan.</span>}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-5">
              <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
                <h2 className="text-lg font-bold">Estado del quiz</h2>
                <p className="mt-2 text-sm text-[var(--aula-muted)]">
                  {assessment?.used ? `Has usado ${assessment.used} de ${assessment.maxAttempts} intentos. Mejor nota: ${assessment.bestScore === null ? '—' : `${Number(assessment.bestScore).toFixed(1)}/100`}.` : 'Todavía no has iniciado este quiz.'}
                </p>
                {assessment?.attempts?.length > 0 && (
                  <ul className="mt-4 divide-y divide-[var(--aula-border)] rounded-[var(--aula-radius)] border border-[var(--aula-border)]">
                    {assessment.attempts.map((a) => (
                      <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                        <span>Intento {a.number} · {a.scorePct === null ? 'pendiente' : `${Number(a.scorePct).toFixed(1)}/100`}</span>
                        <div className="flex items-center gap-2">
                          <Badge tone={a.passed ? 'success' : 'neutral'}>{a.passed ? 'Aprobado' : STATUS_LABEL[a.status] || a.status}</Badge>
                          <Button size="sm" variant="ghost" onClick={() => viewAttempt(a.id)}>Ver retroalimentación</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={start} loading={busy} disabled={!assessment?.canStart}>
                    {assessment?.used ? 'Iniciar otro intento' : 'Iniciar intento'}
                  </Button>
                  {!assessment?.canStart && <span className="self-center text-xs text-[var(--aula-muted)]">Ya usaste los intentos disponibles. Consulta con tu docente si necesitas una revisión.</span>}
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={submit}
        title="Enviar el intento"
        description={`Vas a enviar ${totalQuestions} respuestas. Después del envío no podrás cambiar este intento. ¿Está completo?`}
        confirmLabel="Enviar y calificar"
        tone="primary"
      />
    </CursoPage>
  );
}

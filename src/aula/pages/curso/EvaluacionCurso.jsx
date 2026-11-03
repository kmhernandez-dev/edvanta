import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpenCheck, CheckCircle2, ClipboardCheck, Clock3, FileText, MessageSquare, Target,
} from 'lucide-react';
import { get } from '../../api';
import { useAsync } from '../../hooks';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card, ProgressBar } from '../../ui/Page';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../../ui/States';
import { useCourseData } from './CursoParticipante';
import { CursoPage } from './CursoPage';

const STATE = {
  pendiente: { label: 'Pendiente', tone: 'neutral' },
  en_curso: { label: 'En curso', tone: 'info' },
  aprobado: { label: 'Aprobado', tone: 'success' },
  finalizado: { label: 'Finalizado', tone: 'warning' },
  borrador: { label: 'Borrador', tone: 'neutral' },
  pendiente_revision: { label: 'Pendiente de revisión', tone: 'warning' },
  calificado: { label: 'Calificado', tone: 'success' },
  sin_entregar: { label: 'Sin entregar', tone: 'neutral' },
};

function Estado({ status }) {
  const s = STATE[status] || { label: status, tone: 'neutral' };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

function Peso({ value }) {
  if (value === null || value === undefined) return null;
  return <span className="text-xs font-semibold text-[var(--aula-muted)]">{value} % del curso</span>;
}

function GradeCard({ grade, enrollment }) {
  if (!grade) return null;
  const components = grade.components || [];
  const pending = grade.pending || [];
  const final = grade.finalScore === null || grade.finalScore === undefined ? null : Number(grade.finalScore);
  return (
    <Card title="Tu nota" description={
      grade.configured
        ? `Aprobación con ${grade.passingScore}/100. ${grade.provisional ? 'La nota es provisional mientras haya componentes pendientes.' : 'Todos los componentes están calificados.'}`
        : 'Este curso todavía no tiene una política de nota nueva; se conserva el avance por clases.'
    }>
      <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
        <div className="rounded-[var(--aula-radius-lg)] bg-[var(--aula-surface-muted)] p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--aula-muted)]">{grade.provisional ? 'Nota provisional' : 'Nota final'}</p>
          <p className={`mt-1 text-4xl font-extrabold tabular-nums ${grade.approved ? 'text-[var(--aula-success)]' : 'text-[var(--aula-primary)]'}`}>
            {final === null ? '—' : final.toFixed(1)}
          </p>
          <p className="mt-1 text-xs text-[var(--aula-muted)]">sobre 100</p>
          {grade.configured && !grade.provisional && (
            <p className={`mt-2 text-sm font-bold ${grade.approved ? 'text-[var(--aula-success)]' : 'text-[var(--aula-danger)]'}`}>
              {grade.approved ? 'Aprobado' : 'No aprobado'}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold text-[var(--aula-muted)]">Clases</p>
              <p className="font-bold">{enrollment.lessons.done}/{enrollment.lessons.required}</p>
              <ProgressBar value={enrollment.lessons.pct || 0} label="Avance de clases" size="sm" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--aula-muted)]">Quizzes enviados</p>
              <p className="font-bold">{enrollment.assessments.submitted}/{enrollment.assessments.required}</p>
              <ProgressBar value={enrollment.assessments.pct || 0} label="Avance de quizzes" size="sm" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--aula-muted)]">Actividades enviadas</p>
              <p className="font-bold">{enrollment.activities.submitted}/{enrollment.activities.required}</p>
              <ProgressBar value={enrollment.activities.pct || 0} label="Avance de actividades" size="sm" />
            </div>
          </div>
          {components.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Componentes de la nota</caption>
                <thead><tr className="text-xs uppercase tracking-wide text-[var(--aula-muted)]"><th className="py-1 pr-3">Componente</th><th className="py-1 pr-3">Peso</th><th className="py-1 pr-3">Nota</th><th className="py-1">Estado</th></tr></thead>
                <tbody>
                  {components.map((c) => (
                    <tr key={`${c.type}-${c.id}`} className="border-t border-[var(--aula-border)]">
                      <td className="py-1.5 pr-3">{c.title}</td>
                      <td className="py-1.5 pr-3 tabular-nums">{c.weight} %</td>
                      <td className="py-1.5 pr-3 tabular-nums">{c.score === null ? '—' : Number(c.score).toFixed(1)}</td>
                      <td className="py-1.5"><Estado status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {pending.length > 0 && (
            <p className="text-xs leading-relaxed text-[var(--aula-warning)]">
              Falta calificar: {pending.map((p) => p.title).join(', ')}. La nota no se renormaliza: los pesos pendientes siguen contando.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function EvaluacionCurso() {
  const { data, courseId, rutas } = useCourseData();
  const overview = useAsync(({ signal }) => get(`/me/courses/${courseId}/pedagogy`, { signal }), [courseId]);
  const p = overview.data;
  const grade = p?.grade || data.grade;
  const enrollment = data.enrollment;
  const pendingCount = useMemo(() => (grade?.pending || []).length, [grade]);
  const total = (p?.assessments?.length || 0) + (p?.activities?.length || 0) + (p?.forums?.length || 0);

  return (
    <CursoPage
      title="Evaluación del curso"
      subtitle={`${data.snapshot.course.title}. Aquí encuentras los quizzes, las actividades y los foros, con su peso, su estado y la nota.`}
      backTo={rutas.base}
      backLabel="Volver al curso"
      actions={<Button variant="secondary" to={rutas.evaluacion} onClick={overview.reload}>Actualizar</Button>}
    >
      {overview.loading && !p && <LoadingBlock rows={4} label="Cargando la evaluación" />}
      {overview.error && !p && <ErrorState error={overview.error} onRetry={overview.reload} />}
      {p && (
        <div className="flex flex-col gap-6">
          <GradeCard grade={grade} enrollment={enrollment} />
          {grade?.configured && !grade.configOk && (
            <Alert tone="warning" title="Configuración de nota incompleta">
              <p>Los pesos de este curso no suman 100 %. La nota se muestra, pero no se emitirá aprobación hasta que el docente corrija la configuración.</p>
            </Alert>
          )}
          {pendingCount > 0 && (
            <p className="rounded-[var(--aula-radius)] bg-[var(--aula-warning-soft)] px-4 py-3 text-sm text-[var(--aula-warning)]">
              Tienes {pendingCount} {pendingCount === 1 ? 'componente pendiente' : 'componentes pendientes'} de calificación. La nota se actualizará cuando el docente publique la revisión.
            </p>
          )}
          {total === 0 && (
            <EmptyState
              icon={BookOpenCheck}
              title="Este curso no tiene evaluación nueva"
              description="Se conserva el avance por clases. Cuando se incorporen quizzes, actividades o foros, aparecerán aquí."
            />
          )}

          {p.assessments?.length > 0 && (
            <section aria-labelledby="eval-quizzes">
              <h2 id="eval-quizzes" className="mb-3 flex items-center gap-2 text-lg font-bold"><ClipboardCheck className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Quizzes</h2>
              <div className="grid gap-4">
                {p.assessments.map((a) => (
                  <article key={a.id} className="flex flex-col gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{a.title}</h3>
                        <Estado status={a.status} />
                        <Peso value={a.weight} />
                      </div>
                      <p className="mt-1 text-sm text-[var(--aula-muted)]">
                        {a.used}/{a.maxAttempts} intentos usados · mejor nota: {a.bestScore === null ? '—' : `${Number(a.bestScore).toFixed(1)}/100`} · aprueba con {a.passingScore}/100
                      </p>
                    </div>
                    <Button to={rutas.evaluacionQuiz(a.id)} variant="secondary" iconRight={ArrowRight} className="shrink-0">
                      {a.openAttemptId ? 'Continuar intento' : a.canStart ? (a.used ? 'Intentar de nuevo' : 'Iniciar intento') : 'Ver resultado'}
                    </Button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {p.activities?.length > 0 && (
            <section aria-labelledby="eval-actividades">
              <h2 id="eval-actividades" className="mb-3 flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Actividades</h2>
              <div className="grid gap-4">
                {p.activities.map((a) => (
                  <article key={a.id} className="flex flex-col gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{a.activity.title}</h3>
                        <Estado status={a.state.status} />
                        <Peso value={a.activity.weight} />
                      </div>
                      <p className="mt-1 text-sm text-[var(--aula-muted)]">
                        {a.state.graded ? `Nota: ${Number(a.state.score100).toFixed(1)}/100` : a.state.submitted ? 'Enviada; pendiente de revisión docente.' : a.state.draft ? 'Tienes un borrador guardado.' : 'Aún no has entregado.'}
                      </p>
                    </div>
                    <Button to={rutas.evaluacionActividad(a.id)} variant="secondary" iconRight={ArrowRight} className="shrink-0">
                      {a.state.graded ? 'Ver entrega' : a.state.submitted ? 'Ver estado' : 'Abrir actividad'}
                    </Button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {p.forums?.length > 0 && (
            <section aria-labelledby="eval-foros">
              <h2 id="eval-foros" className="mb-3 flex items-center gap-2 text-lg font-bold"><MessageSquare className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Foros</h2>
              <div className="grid gap-4">
                {p.forums.map((f) => (
                  <article key={f.id} className="flex flex-col gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{f.title}</h3>
                        <Estado status={f.status} />
                        <Peso value={f.weight} />
                      </div>
                      <p className="mt-1 text-sm text-[var(--aula-muted)]">
                        {f.graded ? `Nota: ${Number(f.score).toFixed(1)}/100` : f.participated ? `${f.posts} ${f.posts === 1 ? 'intervención' : 'intervenciones'}; pendiente de valoración.` : 'Aún no has participado.'}
                      </p>
                    </div>
                    <Button to={rutas.evaluacionForo(f.id)} variant="secondary" iconRight={ArrowRight} className="shrink-0">Abrir foro</Button>
                  </article>
                ))}
              </div>
            </section>
          )}

          <p className="flex items-center gap-2 text-xs text-[var(--aula-muted)]"><Target className="h-4 w-4" aria-hidden="true" /> El avance de aprendizaje y la nota son cosas distintas: una entrega enviada cuenta como avance, aunque todavía no esté calificada.</p>
        </div>
      )}
    </CursoPage>
  );
}

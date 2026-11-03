import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ClipboardCheck, FileText, MessageSquare, Users } from 'lucide-react';
import { get } from '../../api';
import { useAsync } from '../../hooks';
import { useAulaSession } from '../../session';
import { fmtDate } from '../../labels';
import { Badge, StatusBadge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card, PageHeader, ProgressBar } from '../../ui/Page';
import { ErrorState, LoadingBlock } from '../../ui/States';

const DECISION = {
  enviada: { label: 'Enviada', tone: 'info' },
  entregada_tarde: { label: 'Entregada tarde', tone: 'warning' },
  en_revision: { label: 'En revisión', tone: 'warning' },
  requiere_ajustes: { label: 'Requiere ajustes', tone: 'warning' },
  aprobada: { label: 'Aprobada', tone: 'success' },
  no_aprobada: { label: 'No aprobada', tone: 'danger' },
};

export default function DocenteCurso() {
  const { courseId } = useParams();
  const overview = useAsync(({ signal }) => get(`/docente/courses/${courseId}`, { signal }), [courseId]);
  const { user } = useAulaSession();
  const data = overview.data;
  const pendingSubmissions = (data?.submissions || []).filter((s) => ['enviada', 'entregada_tarde', 'en_revision', 'requiere_ajustes'].includes(s.status));

  return (
    <div>
      <PageHeader
        eyebrow="Docencia"
        title={data?.course.title || 'Curso'}
        description="Revisa entregas, intentos y foros. La nota solo se publica cuando tú la publicas."
        back={{ to: '/aula/docente', label: 'Mis cursos' }}
        actions={data && user?.role === 'admin' && <Button variant="secondary" to={`/aula/admin/cursos/${data.course.id}`} icon={ArrowLeft}>Abrir editor del curso</Button>}
      />
      {overview.loading && !data && <LoadingBlock rows={5} label="Cargando el curso" />}
      {overview.error && <ErrorState error={overview.error} onRetry={overview.reload} />}
      {data && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card title="Estudiantes"><p className="text-2xl font-extrabold tabular-nums">{data.students.length}</p></Card>
            <Card title="Entregas pendientes"><p className="text-2xl font-extrabold tabular-nums text-[var(--aula-warning)]">{pendingSubmissions.length}</p></Card>
            <Card title="Foros"><p className="text-2xl font-extrabold tabular-nums">{data.forums.length}</p></Card>
          </div>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><Users className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Estudiantes y nota</h2>
            <div className="overflow-x-auto rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Estudiantes del curso</caption>
                <thead><tr className="bg-[var(--aula-surface-muted)] text-xs uppercase tracking-wide text-[var(--aula-muted)]"><th className="p-3">Estudiante</th><th className="p-3">Estado</th><th className="p-3">Avance</th><th className="p-3">Nota</th><th className="p-3">Pendientes</th></tr></thead>
                <tbody>
                  {data.students.map((s) => (
                    <tr key={s.enrollmentId} className="border-t border-[var(--aula-border)]">
                      <td className="p-3"><p className="font-semibold">{s.name}</p><p className="text-xs text-[var(--aula-muted)]">{s.email}</p></td>
                      <td className="p-3"><StatusBadge kind="enrollment" status={s.status} /></td>
                      <td className="p-3"><div className="w-36"><ProgressBar value={s.progressPct} label={`Avance de ${s.name}`} size="sm" /><p className="mt-1 text-xs text-[var(--aula-muted)]">{Math.round(s.progressPct)} %</p></div></td>
                      <td className="p-3"><span className={`font-bold tabular-nums ${s.approved ? 'text-[var(--aula-success)]' : ''}`}>{s.finalScore === null ? '—' : Number(s.finalScore).toFixed(1)}</span>{s.provisional && <span className="ml-1 text-xs text-[var(--aula-warning)]">provisional</span>}</td>
                      <td className="p-3">{s.pending.length ? <Badge tone="warning">{s.pending.length}</Badge> : <Badge tone="success">0</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Entregas</h2>
            {data.submissions.length === 0 ? (
              <p className="rounded-[var(--aula-radius-lg)] border border-dashed border-[var(--aula-border-strong)] p-5 text-sm text-[var(--aula-muted)]">No hay entregas registradas.</p>
            ) : (
              <div className="overflow-x-auto rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Entregas</caption>
                  <thead><tr className="bg-[var(--aula-surface-muted)] text-xs uppercase tracking-wide text-[var(--aula-muted)]"><th className="p-3">Estudiante</th><th className="p-3">Actividad</th><th className="p-3">Estado</th><th className="p-3">Enviada</th><th className="p-3"></th></tr></thead>
                  <tbody>
                    {data.submissions.map((s) => (
                      <tr key={s.id} className="border-t border-[var(--aula-border)]">
                        <td className="p-3"><p className="font-semibold">{s.student}</p><p className="text-xs text-[var(--aula-muted)]">{s.email}</p></td>
                        <td className="p-3">{s.activityTitle}</td>
                        <td className="p-3"><Badge tone={DECISION[s.status]?.tone || 'neutral'}>{DECISION[s.status]?.label || s.status}</Badge></td>
                        <td className="p-3">{fmtDate(s.submittedAt)}</td>
                        <td className="p-3 text-right"><Button size="sm" variant="secondary" to={`/aula/docente/entrega/${s.id}`} iconRight={ArrowRight}>Revisar</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><ClipboardCheck className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Intentos de quiz</h2>
            {data.attempts.length === 0 ? (
              <p className="rounded-[var(--aula-radius-lg)] border border-dashed border-[var(--aula-border-strong)] p-5 text-sm text-[var(--aula-muted)]">Todavía no hay intentos enviados.</p>
            ) : (
              <div className="overflow-x-auto rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Intentos de quiz</caption>
                  <thead><tr className="bg-[var(--aula-surface-muted)] text-xs uppercase tracking-wide text-[var(--aula-muted)]"><th className="p-3">Estudiante</th><th className="p-3">Quiz</th><th className="p-3">Intento</th><th className="p-3">Nota</th><th className="p-3">Enviado</th></tr></thead>
                  <tbody>
                    {data.attempts.map((a) => (
                      <tr key={a.id} className="border-t border-[var(--aula-border)]">
                        <td className="p-3"><p className="font-semibold">{a.student}</p><p className="text-xs text-[var(--aula-muted)]">{a.email}</p></td>
                        <td className="p-3">{a.assessmentTitle}</td>
                        <td className="p-3">#{a.number}</td>
                        <td className="p-3"><span className="font-bold tabular-nums">{a.scorePct === null ? '—' : Number(a.scorePct).toFixed(1)}</span> <Badge tone={a.passed ? 'success' : 'warning'}>{a.passed ? 'Aprobado' : 'No aprobado'}</Badge></td>
                        <td className="p-3">{fmtDate(a.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><MessageSquare className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Foros</h2>
            <div className="grid gap-3">
              {data.forums.map((f) => (
                <div key={f.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
                  <div>
                    <p className="font-bold">{f.title}</p>
                    <p className="text-xs text-[var(--aula-muted)]">{f.posts} publicaciones · {f.grades} calificaciones · peso {f.weight ?? '—'} %</p>
                  </div>
                  <Button size="sm" variant="secondary" to={`/aula/docente/foro/${f.id}`} iconRight={ArrowRight}>Revisar foro</Button>
                </div>
              ))}
              {data.forums.length === 0 && <p className="text-sm text-[var(--aula-muted)]">Este curso no tiene foros.</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}



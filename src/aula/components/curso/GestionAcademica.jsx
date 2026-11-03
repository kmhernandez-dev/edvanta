import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, ClipboardCheck, FileText, MessageSquare, Save, SlidersHorizontal, Users,
} from 'lucide-react';
import { get, patch, post } from '../../api';
import { useAsync } from '../../hooks';
import { fmtDate } from '../../labels';
import { Badge, StatusBadge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Dialog';
import { Select, TextArea, TextInput } from '../../ui/Form';
import { Card, ProgressBar } from '../../ui/Page';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../../ui/States';
import { Pagination, SearchInput } from '../../ui/Table';
import { useToast } from '../../ui/Toast';

const SUBMISSION_LABEL = {
  enviada: { label: 'Enviada', tone: 'info' },
  entregada_tarde: { label: 'Entregada tarde', tone: 'warning' },
  en_revision: { label: 'En revisión', tone: 'warning' },
  requiere_ajustes: { label: 'Requiere ajustes', tone: 'warning' },
  aprobada: { label: 'Aprobada', tone: 'success' },
  no_aprobada: { label: 'No aprobada', tone: 'danger' },
};

const scoreText = (value) => (value === null || value === undefined ? 'Sin calificar' : Number(value).toFixed(1));

function Score({ value }) {
  const pending = value === null || value === undefined;
  return (
    <span className={`tabular-nums font-semibold ${pending ? 'text-[var(--aula-muted)]' : Number(value) === 0 ? 'text-[var(--aula-danger)]' : 'text-[var(--aula-text)]'}`}>
      {pending ? 'Sin calificar' : Number(value).toFixed(1)}
    </span>
  );
}

// ── Entregas y revisión ───────────────────────────────────────

export function ReviewPanel({ courseId, base, modules = [] }) {
  const [filters, setFilters] = useState({ status: 'pendientes', moduleId: '', activityId: '', q: '', page: 1 });
  const authoring = useAsync(({ signal }) => get(`${base}/authoring/courses/${courseId}`, { signal }), [base, courseId]);
  const query = new URLSearchParams({
    status: filters.status === 'pendientes' ? '' : filters.status,
    ...(filters.moduleId ? { moduleId: filters.moduleId } : {}),
    ...(filters.activityId ? { activityId: filters.activityId } : {}),
    ...(filters.q ? { q: filters.q } : {}),
    page: String(filters.page),
    pageSize: '25',
  }).toString();
  const data = useAsync(({ signal }) => get(`${base}/authoring/courses/${courseId}/review?${query}`, { signal }), [base, courseId, query]);
  const d = data.data;
  return (
    <div className="flex flex-col gap-5">
      <Card
        title="Entregas por revisar"
        description="Abre el trabajo, escribe retroalimentación y publica la nota. Las notas guardadas en borrador no son visibles para el estudiante."
      >
        <div className="grid gap-3 sm:grid-cols-[180px_180px_220px_1fr]">
          <Select
            label="Estado"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
            options={[
              { value: 'pendientes', label: 'Pendientes de revisión' },
              { value: 'enviada', label: 'Enviadas' },
              { value: 'entregada_tarde', label: 'Entregadas tarde' },
              { value: 'en_revision', label: 'En revisión' },
              { value: 'requiere_ajustes', label: 'Requieren ajustes' },
              { value: 'aprobada', label: 'Aprobadas' },
              { value: 'no_aprobada', label: 'No aprobadas' },
              { value: 'todos', label: 'Todas' },
            ]}
          />
          <Select
            label="Unidad"
            value={filters.moduleId}
            onChange={(e) => setFilters((f) => ({ ...f, moduleId: e.target.value, page: 1 }))}
            options={modules.map((m) => ({ value: String(m.id), label: m.title }))}
            placeholder="Todas las unidades"
          />
          <Select
            label="Actividad"
            value={filters.activityId}
            onChange={(e) => setFilters((f) => ({ ...f, activityId: e.target.value, page: 1 }))}
            options={(authoring.data?.activities || []).map((a) => ({ value: String(a.id), label: a.title }))}
            placeholder="Todas las actividades"
          />
          <SearchInput
            label="Buscar estudiante o actividad"
            value={filters.q}
            onChange={(q) => setFilters((f) => ({ ...f, q, page: 1 }))}
            placeholder="Nombre, correo o actividad"
          />
        </div>
      </Card>

      {data.loading && !d && <LoadingBlock rows={5} label="Cargando entregas" />}
      {data.error && !d && <ErrorState error={data.error} onRetry={data.reload} />}
      {d && (
        <div className="flex flex-col gap-5">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Actividades</h2>
            {d.items.length === 0 ? (
              <p className="rounded-[var(--aula-radius-lg)] border border-dashed border-[var(--aula-border-strong)] p-5 text-sm text-[var(--aula-muted)]">
                No hay entregas que cumplan estos filtros.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Entregas de actividades</caption>
                  <thead>
                    <tr className="bg-[var(--aula-surface-muted)] text-xs uppercase tracking-wide text-[var(--aula-muted)]">
                      <th className="p-3">Estudiante</th>
                      <th className="p-3">Actividad</th>
                      <th className="p-3">Unidad</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Nota</th>
                      <th className="p-3">Enviada</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.items.map((s) => (
                      <tr key={s.id} className="border-t border-[var(--aula-border)]">
                        <td className="p-3">
                          <p className="font-semibold">{s.student}</p>
                          <p className="text-xs text-[var(--aula-muted)]">{s.email}</p>
                        </td>
                        <td className="p-3">{s.activityTitle}</td>
                        <td className="p-3 text-xs text-[var(--aula-muted)]">{s.moduleTitle || 'Sin unidad'}</td>
                        <td className="p-3"><Badge tone={SUBMISSION_LABEL[s.status]?.tone || 'neutral'}>{SUBMISSION_LABEL[s.status]?.label || s.status}</Badge></td>
                        <td className="p-3"><Score value={s.score} /></td>
                        <td className="p-3 text-xs">{fmtDate(s.submittedAt)}</td>
                        <td className="p-3 text-right">
                          <Button size="sm" variant="secondary" to={`/aula/docente/entrega/${s.id}`} iconRight={ArrowRight}>Revisar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={d.page} pages={d.pages} total={d.total} pageSize={d.pageSize} onPage={(page) => setFilters((f) => ({ ...f, page }))} />
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><MessageSquare className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Foros pendientes de nota</h2>
            {d.forums.length === 0 ? (
              <p className="rounded-[var(--aula-radius-lg)] border border-dashed border-[var(--aula-border-strong)] p-5 text-sm text-[var(--aula-muted)]">
                No hay foros calificables con participación pendiente de calificación.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {d.forums.map((f) => (
                  <li key={`${f.forumId}-${f.enrollmentId}`} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
                    <div>
                      <p className="font-semibold">{f.title}</p>
                      <p className="text-xs text-[var(--aula-muted)]">{f.student} · {f.email} · {f.posts} intervenciones · {f.moduleTitle || 'Sin unidad'}</p>
                    </div>
                    <Button size="sm" variant="secondary" to={`/aula/docente/foro/${f.forumId}`} iconRight={ArrowRight}>Abrir y calificar</Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

// ── Libro de calificaciones ───────────────────────────────────

function ResourceCols({ resources }) {
  return resources.map((r) => (
    <th key={`${r.type}-${r.id}`} className="min-w-[110px] p-2 align-bottom">
      <span className="block text-[10px] font-bold uppercase tracking-wide text-[var(--aula-muted)]">
        {r.type === 'quiz' ? 'Quiz' : r.type === 'activity' ? 'Actividad' : 'Foro'}
      </span>
      <span className="block max-w-[140px] truncate font-semibold">{r.title}</span>
      <span className="block text-[10px] font-normal text-[var(--aula-muted)]">Peso {r.weight ?? 0} %</span>
    </th>
  ));
}

function RectifyDialog({ open, onClose, base, item, student, onDone }) {
  const toast = useToast();
  const [score, setScore] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!open) return;
    setScore(item?.score === null || item?.score === undefined ? '' : String(item.score));
    setReason('');
    setError(null);
    setBusy(false);
  }, [open, item]);
  const submit = async (event) => {
    event.preventDefault();
    if (reason.trim().length < 5) { setError(new Error('Explica el motivo (mínimo 5 caracteres).')); return; }
    setBusy(true);
    setError(null);
    try {
      await post(`${base}/authoring/attempts/${item.attemptId}/override`, { score: Number(score), reason: reason.trim() });
      toast.success('Nota del intento rectificada. Queda en el historial.');
      onDone();
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onClose}
      title={`Rectificar nota · ${item?.title || ''}`}
      description={`${student?.name || ''}. Esta acción es extraordinaria y queda auditada.`}
      size="sm"
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancelar</Button>
          <Button type="submit" form="aula-rectify-attempt" loading={busy}>Guardar rectificación</Button>
        </>
      )}
    >
      <form id="aula-rectify-attempt" onSubmit={submit} className="flex flex-col gap-3" noValidate>
        {error && <Alert tone="danger">{error.message}</Alert>}
        <TextInput
          label="Nueva nota (0 a 100)"
          inputMode="decimal"
          value={score}
          onChange={(e) => setScore(e.target.value.replace(/[^\d.]/g, ''))}
          hint="La nota anterior no se sobrescribe: el cambio queda en el historial."
        />
        <TextArea label="Motivo" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required hint="Explica qué se revisó y por qué cambia la nota." />
      </form>
    </Modal>
  );
}

export function GradebookPanel({ courseId, base }) {
  const [filters, setFilters] = useState({ q: '', page: 1 });
  const query = new URLSearchParams({ ...(filters.q ? { q: filters.q } : {}), page: String(filters.page), pageSize: '50' }).toString();
  const data = useAsync(({ signal }) => get(`${base}/authoring/courses/${courseId}/gradebook?${query}`, { signal }), [base, courseId, query]);
  const d = data.data;
  const resources = d ? [...d.resources.quizzes, ...d.resources.activities, ...d.resources.forums] : [];
  const policy = d?.policy;
  const [rectify, setRectify] = useState(null);

  return (
    <div className="flex flex-col gap-5">
      {policy && (
        <Card title="Estado de la configuración" description="La nota final solo se emite cuando los pesos declarados coinciden con los pesos de los recursos y el curso está completamente calificado.">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold text-[var(--aula-muted)]">Componentes</p>
              <p className="font-bold tabular-nums">Actividades {policy.components.activities} % · Quizzes {policy.components.quizzes} % · Foros {policy.components.forums} %</p>
              <p className="text-xs text-[var(--aula-muted)]">Total {policy.total} %</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--aula-muted)]">Pesos reales de los recursos</p>
              <p className="font-bold tabular-nums">Actividades {d.policy.weightSums.activities} % · Quizzes {d.policy.weightSums.quizzes} % · Foros {d.policy.weightSums.forums} %</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--aula-muted)]">Aprobación</p>
              <p className="font-bold tabular-nums">{policy.passingScore}/100</p>
              <p className={`text-xs font-semibold ${policy.configOk ? 'text-[var(--aula-success)]' : 'text-[var(--aula-danger)]'}`}>
                {policy.configOk ? 'Configuración válida' : 'Configuración incompleta'}
              </p>
            </div>
          </div>
          {!policy.configOk && policy.errors.length > 0 && (
            <Alert tone="warning" className="mt-4">
              <ul className="list-disc pl-4">{policy.errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </Alert>
          )}
        </Card>
      )}

      <Card title="Libro de calificaciones" description="Cada celda muestra la nota del recurso sobre 100. «Sin calificar» no es cero: es una nota pendiente y no se renormaliza.">
        <SearchInput
          label="Buscar estudiante"
          value={filters.q}
          onChange={(q) => setFilters({ q, page: 1 })}
          placeholder="Nombre o correo"
          className="max-w-sm"
        />
      </Card>

      {data.loading && !d && <LoadingBlock rows={5} label="Calculando el libro de calificaciones" />}
      {data.error && !d && <ErrorState error={data.error} onRetry={data.reload} />}
      {d && (
        <>
          {d.items.length === 0 ? (
            <EmptyState icon={Users} title="No hay estudiantes con estos filtros" description="Cuando haya matrículas activas, aparecerán aquí con sus notas." />
          ) : (
            <div className="overflow-x-auto rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Libro de calificaciones del curso</caption>
                <thead>
                  <tr className="bg-[var(--aula-surface-muted)] text-xs uppercase tracking-wide text-[var(--aula-muted)]">
                    <th className="sticky left-0 z-10 min-w-[220px] bg-[var(--aula-surface-muted)] p-3 align-bottom">Estudiante</th>
                    <ResourceCols resources={resources} />
                    <th className="min-w-[110px] p-2 align-bottom">Nota final</th>
                    <th className="min-w-[120px] p-2 align-bottom">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {d.items.map((student) => (
                    <tr key={student.enrollmentId} className="border-t border-[var(--aula-border)] align-top">
                      <th scope="row" className="sticky left-0 z-10 bg-white p-3 text-left font-semibold">
                        <p>{student.name}</p>
                        <p className="text-xs font-normal text-[var(--aula-muted)]">{student.email}</p>
                        <p className="text-[10px] text-[var(--aula-muted)]">Matrícula #{student.enrollmentId}</p>
                        <div className="mt-1 w-28"><ProgressBar value={student.progressPct} label={`Avance de ${student.name}`} size="sm" /></div>
                      </th>
                      {[
                        ...student.quizzes.map((item) => ({ ...item, kind: 'quiz' })),
                        ...student.activities.map((item) => ({ ...item, kind: 'activity' })),
                        ...student.forums.map((item) => ({ ...item, kind: 'forum' })),
                      ].map((item) => (
                        <td key={`${item.kind}-${item.id}`} className="p-2">
                          <Score value={item.score} />
                          {item.kind === 'quiz' && <span className="mt-0.5 block text-[10px] text-[var(--aula-muted)]">Mejor nota · {item.maxAttempts || '-'} intentos</span>}
                          {item.kind === 'quiz' && item.attemptId && (
                            <button
                              type="button"
                              onClick={() => setRectify({ item, student })}
                              className="mt-1 block text-[10px] font-semibold text-[var(--aula-primary)] underline"
                            >
                              Rectificar
                            </button>
                          )}
                        </td>
                      ))}
                      <td className="p-2">
                        <span className="font-bold tabular-nums">{student.finalScore === null ? 'Sin calificar' : Number(student.finalScore).toFixed(1)}</span>
                        {student.finalScore === null && student.accumulatedScore !== null && student.accumulatedScore !== undefined && (
                          <span className="mt-1 block text-[10px] text-[var(--aula-muted)]">Acumulado {Number(student.accumulatedScore).toFixed(1)}</span>
                        )}
                        {student.provisional && <span className="ml-1 block text-[10px] font-semibold text-[var(--aula-warning)]">provisional</span>}
                      </td>
                      <td className="p-2">
                        <StatusBadge kind="enrollment" status={student.status} />
                        <p className={`mt-1 text-[10px] font-semibold ${student.approved ? 'text-[var(--aula-success)]' : 'text-[var(--aula-muted)]'}`}>
                          {student.approved ? 'Aprobado' : student.provisional ? 'Pendiente de calificar' : student.configured && student.configOk ? 'No aprobado' : 'Sin nota final'}
                        </p>
                        {student.pending.length > 0 && <p className="text-[10px] text-[var(--aula-warning)]">{student.pending.length} pendientes</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={d.page} pages={d.pages} total={d.total} pageSize={d.pageSize} onPage={(page) => setFilters((f) => ({ ...f, page }))} />
        </>
      )}
      {rectify && (
        <RectifyDialog
          open
          onClose={() => setRectify(null)}
          base={base}
          item={rectify.item}
          student={rectify.student}
          onDone={data.reload}
        />
      )}
    </div>
  );
}

// ── Participación ─────────────────────────────────────────────

export function ParticipationPanel({ courseId, base, modules = [] }) {
  const toast = useToast();
  const [moduleId, setModuleId] = useState('');
  const query = moduleId ? `?moduleId=${moduleId}` : '';
  const data = useAsync(({ signal }) => get(`${base}/authoring/courses/${courseId}/participation${query}`, { signal }), [base, courseId, query]);
  const rows = data.data || [];

  const toggle = async (forum) => {
    try {
      await post(`${base}/authoring/forums/${forum.id}/close`, { closed: !forum.isClosed });
      toast.success(forum.isClosed ? 'Foro reabierto a respuestas. La lectura se conserva.' : 'Foro cerrado a respuestas. La lectura se conserva.');
      data.reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Card title="Foros del curso" description="Consulta la participación real y modera. La cantidad de mensajes no asigna por sí sola una nota de calidad.">
        <Select
          label="Unidad"
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          options={modules.map((m) => ({ value: String(m.id), label: m.title }))}
          placeholder="Todas las unidades"
          className="max-w-sm"
        />
      </Card>
      {data.loading && !data.data && <LoadingBlock rows={4} label="Cargando la participación" />}
      {data.error && <ErrorState error={data.error} onRetry={data.reload} />}
      {!data.loading && rows.length === 0 && (
        <EmptyState icon={MessageSquare} title="Este curso todavía no tiene foros" description="Crea un foro desde la pestaña de contenido o de evaluaciones." />
      )}
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Participación en los foros</caption>
            <thead>
              <tr className="bg-[var(--aula-surface-muted)] text-xs uppercase tracking-wide text-[var(--aula-muted)]">
                <th className="p-3">Foro</th><th className="p-3">Unidad</th><th className="p-3">Estado</th>
                <th className="p-3">Mensajes</th><th className="p-3">Ocultos</th><th className="p-3">Calificados</th>
                <th className="p-3">Sin calificar</th><th className="p-3">Última actividad</th><th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((forum) => (
                <tr key={forum.id} className="border-t border-[var(--aula-border)]">
                  <td className="p-3"><p className="font-semibold">{forum.title}</p><p className="text-xs text-[var(--aula-muted)]">{forum.gradingMethod === 'formativa' ? 'Formativo' : `Calificable · ${forum.weight} %`}</p></td>
                  <td className="p-3 text-xs text-[var(--aula-muted)]">{forum.moduleTitle || 'Sin unidad'}</td>
                  <td className="p-3">
                    <Badge tone={forum.status === 'publicado' ? 'success' : forum.status === 'archivado' ? 'neutral' : 'warning'}>
                      {forum.status === 'publicado' ? 'Publicado' : forum.status === 'archivado' ? 'Archivado' : 'Borrador'}
                    </Badge>
                    {forum.isClosed && <Badge className="ml-1">Cerrado</Badge>}
                  </td>
                  <td className="p-3 tabular-nums">{forum.posts}</td>
                  <td className="p-3 tabular-nums">{forum.hiddenPosts}</td>
                  <td className="p-3 tabular-nums">{forum.grades}</td>
                  <td className="p-3 tabular-nums">{forum.ungraded}</td>
                  <td className="p-3 text-xs">{forum.lastActivityAt ? fmtDate(forum.lastActivityAt) : 'Sin actividad'}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="secondary" to={`/aula/docente/foro/${forum.id}`}>Moderar</Button>
                      {forum.status === 'publicado' && (
                        <Button size="sm" variant="ghost" onClick={() => toggle(forum)}>{forum.isClosed ? 'Reabrir' : 'Cerrar'}</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Configuración académica ──────────────────────────────────

export function AcademicConfigPanel({ courseId, base }) {
  const toast = useToast();
  const data = useAsync(({ signal }) => get(`${base}/authoring/courses/${courseId}/academic-config`, { signal }), [base, courseId]);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    if (!data.data) return;
    setForm({
      activities: String(data.data.components.activities),
      quizzes: String(data.data.components.quizzes),
      forums: String(data.data.components.forums),
      passingScore: String(data.data.passingScore),
      maxAttempts: String(data.data.maxAttempts),
    });
  }, [data.data]);

  if (data.loading && !data.data) return <LoadingBlock rows={3} label="Cargando la configuración académica" />;
  if (data.error && !data.data) return <ErrorState error={data.error} onRetry={data.reload} />;
  if (!form || !data.data) return null;
  const config = data.data;
  const total = Math.round((Number(form.activities) + Number(form.quizzes) + Number(form.forums)) * 100) / 100;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(null);
    try {
      const res = await patch(`${base}/authoring/courses/${courseId}/academic-config`, {
        components: {
          activities: Number(form.activities),
          quizzes: Number(form.quizzes),
          forums: Number(form.forums),
        },
        passingScore: Number(form.passingScore),
        maxAttempts: Number(form.maxAttempts),
      });
      data.setData(res);
      setSaved('Configuración guardada.');
      toast.success('Configuración académica guardada.');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card
      title="Pesos, aprobación y reglas de evaluación"
      description="Los recursos formativos pueden no tener peso. Los recursos calificables deben sumar exactamente el peso declarado para cada componente; así no se cuenta dos veces."
    >
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        {error && <Alert tone="danger">{error.message}</Alert>}
        {saved && <Alert tone="success">{saved}</Alert>}
        {!config.saved && (
          <Alert tone="info">
            Este curso todavía no tiene una política de nota guardada. La propuesta inicial es 60 % actividades, 30 % quizzes y 10 % foros. Ajústala y guarda.
          </Alert>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput label="Peso de actividades (%)" inputMode="decimal" value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value.replace(/[^\d.]/g, '') })} />
          <TextInput label="Peso de quizzes (%)" inputMode="decimal" value={form.quizzes} onChange={(e) => setForm({ ...form, quizzes: e.target.value.replace(/[^\d.]/g, '') })} />
          <TextInput label="Peso de foros (%)" inputMode="decimal" value={form.forums} onChange={(e) => setForm({ ...form, forums: e.target.value.replace(/[^\d.]/g, '') })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput label="Nota de aprobación" inputMode="decimal" value={form.passingScore} onChange={(e) => setForm({ ...form, passingScore: e.target.value.replace(/[^\d.]/g, '') })} hint="Inicial: 70/100." />
          <TextInput label="Intentos por evaluación" inputMode="numeric" value={form.maxAttempts} onChange={(e) => setForm({ ...form, maxAttempts: e.target.value.replace(/\D/g, '') })} hint="Valor por defecto si el quiz no define otro." />
          <div className="flex flex-col justify-end">
            <p className={`text-sm font-bold ${Math.abs(total - 100) <= 0.05 ? 'text-[var(--aula-success)]' : 'text-[var(--aula-danger)]'}`}>Los componentes suman {total} %</p>
            <p className="text-xs text-[var(--aula-muted)]">Si no suman 100 %, la configuración se guarda pero no se emite aprobación final.</p>
          </div>
        </div>

        <div className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-[var(--aula-surface-muted)] p-4">
          <h3 className="text-sm font-bold">Pesos reales de los recursos</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-3 text-sm">
            <p>Actividades: <strong>{config.weightSums.activities} %</strong> <span className="text-[var(--aula-muted)]">/ {config.components.activities} % declarado</span></p>
            <p>Quizzes: <strong>{config.weightSums.quizzes} %</strong> <span className="text-[var(--aula-muted)]">/ {config.components.quizzes} % declarado</span></p>
            <p>Foros: <strong>{config.weightSums.forums} %</strong> <span className="text-[var(--aula-muted)]">/ {config.components.forums} % declarado</span></p>
          </div>
          {config.errors.length > 0 && (
            <ul className="mt-3 list-disc pl-4 text-xs text-[var(--aula-warning)]">
              {config.errors.map((e) => <li key={e}>{e}</li>)}
            </ul>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" icon={Save} loading={busy}>Guardar configuración</Button>
        </div>
      </form>
    </Card>
  );
}

export const GESTION_ICONS = {
  review: ClipboardCheck,
  grades: BarChart3,
  participation: MessageSquare,
  config: SlidersHorizontal,
};

export function ReviewShortcut({ courseId }) {
  return (
    <Link to={`/aula/docente/curso/${courseId}/gestion`} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--aula-primary)] underline">
      Gestionar curso <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Search, Target } from 'lucide-react';
import { downloadFrom, get } from '../../api';
import { useAsync } from '../../hooks';
import { fmtDate } from '../../labels';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { TextInput } from '../../ui/Form';
import { PageHeader } from '../../ui/Page';
import { EmptyState, ErrorState, LoadingBlock } from '../../ui/States';
import { Pagination } from '../../ui/Table';
import { useToast } from '../../ui/Toast';

const SEGMENTOS = [
  ['sin_clasificar', 'Sin clasificar'],
  ['profesional_salud', 'Profesional de salud'],
  ['estudiante', 'Estudiante'],
  ['paciente', 'Paciente / cuidador'],
  ['empresa', 'Empresa'],
  ['docente', 'Docente'],
  ['aliado', 'Aliado'],
  ['otro', 'Otro'],
];

const promedio = (u) => {
  const list = u.enrollments || [];
  if (!list.length) return 0;
  return Math.round((list.reduce((n, e) => n + Number(e.progress_pct || 0), 0) / list.length) * 10) / 10;
};

export default function Seguimiento() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [segmento, setSegmento] = useState('');
  const [tag, setTag] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const list = useAsync(({ signal }) => {
    const params = new URLSearchParams({ page: String(page), pageSize: '50' });
    if (q.trim()) params.set('q', q.trim());
    if (segmento) params.set('segmento', segmento);
    if (tag.trim()) params.set('tag', tag.trim());
    if (status) params.set('status', status);
    return get(`/admin/crm/users?${params}`, { signal });
  }, [q, segmento, tag, status, page]);

  const exportCsv = async () => {
    try {
      await downloadFrom('/admin/crm/export', 'seguimiento-crm-aula.csv');
      toast.success('Exportación CRM descargada.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="CRM y segmentación"
        title="Seguimiento de personas"
        description="Cada persona tiene un código estable, un segmento y etiquetas. Aquí ves sus cursos, su avance, sus tareas pendientes y puedes entrar a revisar sus quizzes, foros y entregas."
        actions={<Button variant="secondary" icon={Download} onClick={exportCsv}>Exportar CSV</Button>}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <TextInput label="Buscar" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Nombre, correo, código o etiqueta"
          inputClassName="pl-9" />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Segmento</span>
          <select value={segmento} onChange={(e) => { setSegmento(e.target.value); setPage(1); }} className="h-11 rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white px-3 text-sm">
            <option value="">Todos</option>
            {SEGMENTOS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <TextInput label="Etiqueta" value={tag} onChange={(e) => { setTag(e.target.value); setPage(1); }} placeholder="Ej. diabetes, empresa, 2026" />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Estado de cuenta</span>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-11 rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white px-3 text-sm">
            <option value="">Todos</option>
            <option value="active">Activa</option>
            <option value="invited">Invitación pendiente</option>
            <option value="suspended">Suspendida</option>
          </select>
        </label>
      </div>

      {list.loading && !list.data && <LoadingBlock rows={6} label="Cargando seguimiento" />}
      {list.error && <ErrorState error={list.error} onRetry={list.reload} />}
      {list.data && list.data.items.length === 0 && (
        <EmptyState icon={Target} title="No hay personas con esos filtros" description="Prueba otro segmento, etiqueta o término de búsqueda." />
      )}

      {list.data?.items.length > 0 && (
        <div className="overflow-x-auto rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Seguimiento CRM de personas</caption>
            <thead>
              <tr className="bg-[var(--aula-surface-muted)] text-xs uppercase tracking-wide text-[var(--aula-muted)]">
                <th className="p-3">Código CRM</th>
                <th className="p-3">Persona</th>
                <th className="p-3">Segmento</th>
                <th className="p-3">Cursos</th>
                <th className="p-3">Avance</th>
                <th className="p-3">Tareas pendientes</th>
                <th className="p-3">Última actividad</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {list.data.items.map((u) => (
                <tr key={u.id} className="border-t border-[var(--aula-border)] align-top">
                  <td className="p-3 font-mono text-xs font-semibold text-[var(--aula-primary)]">{u.crmCode}</td>
                  <td className="p-3">
                    <Link to={`/aula/admin/participantes/${u.id}`} className="font-semibold hover:text-[var(--aula-primary)]">{u.fullName}</Link>
                    <p className="text-xs text-[var(--aula-muted)]">{u.email}</p>
                    <p className="text-xs text-[var(--aula-subtle)]">{u.role} · {u.status}</p>
                  </td>
                  <td className="p-3">
                    <Badge tone={u.segmento === 'sin_clasificar' ? 'neutral' : 'accent'}>{u.segmento}</Badge>
                    {u.crmTags?.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {u.crmTags.map((t) => <span key={t} className="rounded-full bg-[var(--aula-neutral-soft)] px-2 py-0.5 text-[11px]">{t}</span>)}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    {u.enrollments.length === 0 ? <span className="text-xs text-[var(--aula-muted)]">Sin cursos</span> : (
                      <ul className="flex flex-col gap-1 text-xs">
                        {u.enrollments.slice(0, 4).map((e) => (
                          <li key={e.course_id}><span className="font-medium">{e.title}</span> <span className="text-[var(--aula-muted)]">· {Math.round(Number(e.progress_pct) || 0)} %</span></li>
                        ))}
                        {u.enrollments.length > 4 && <li className="text-[var(--aula-muted)]">+{u.enrollments.length - 4} más</li>}
                      </ul>
                    )}
                  </td>
                  <td className="p-3 tabular-nums">{promedio(u)} %</td>
                  <td className="p-3">
                    {u.pendingTasks ? <Badge tone="warning">{u.pendingTasks}</Badge> : <Badge tone="success">0</Badge>}
                    <p className="mt-1 text-[11px] text-[var(--aula-muted)]">{u.pendingSubmissions} entregas · {u.pendingForums} foros</p>
                  </td>
                  <td className="p-3 text-xs text-[var(--aula-muted)]">{u.lastActivityAt ? fmtDate(u.lastActivityAt) : 'Sin actividad'}</td>
                  <td className="p-3 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <Button size="sm" variant="ghost" to={`/aula/admin/participantes/${u.id}`}>Ficha</Button>
                      {u.enrollments[0] && <Button size="sm" variant="secondary" to={`/aula/docente/curso/${u.enrollments[0].course_id}`} iconRight={ArrowRight}>Revisar curso</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {list.data && <Pagination {...list.data} onPage={(p) => setPage(p)} />}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, CalendarDays, RotateCcw, User, UserMinus, UserPlus, Users, UsersRound, XCircle,
} from 'lucide-react';
import { get, post } from '../../../api';
import { useAsync, useTableState } from '../../../hooks';
import {
  ENROLLMENT_STATUS_OPTIONS, fmtDate, plural,
} from '../../../labels';
import { Badge, StatusBadge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import { ConfirmDialog, Modal } from '../../../ui/Dialog';
import {
  Checkbox, checkForm, errorsFrom, TextInput, useFocusFirstError,
} from '../../../ui/Form';
import { ActionMenu } from '../../../ui/Menu';
import { Card, ProgressBar } from '../../../ui/Page';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../../../ui/States';
import { DataTable, FilterSelect, Pagination, SearchInput } from '../../../ui/Table';
import { Segmented } from '../../../ui/Tabs';
import { useToast } from '../../../ui/Toast';
import { useCourse } from './CursoLayout';

const TARGET = {
  usuario: { label: 'Persona', icon: User },
  grupo: { label: 'Grupo', icon: UsersRound },
  empresa: { label: 'Empresa', icon: Building2 },
};

const todayYmd = () => new Date(Date.now() - 5 * 3600 * 1000).toISOString().slice(0, 10);

function AssignModal({ open, onClose, course, onAssigned }) {
  const toast = useToast();
  const [targetType, setTargetType] = useState('grupo');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(() => new Map());
  const [dates, setDates] = useState({ startsAt: '', dueAt: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  useFocusFirstError(error, formRef);
  const privateCompany = course.kind === 'empresa' ? course.companyId : null;

  useEffect(() => {
    if (!open) return;
    setTargetType('grupo');
    setQ('');
    setSelected(new Map());
    setDates({ startsAt: '', dueAt: '' });
    setError(null);
    setBusy(false);
  }, [open]);

  useEffect(() => { setSelected(new Map()); setQ(''); }, [targetType]);

  const options = useAsync(async ({ signal }) => {
    if (!open) return [];
    if (targetType === 'usuario') {
      const params = new URLSearchParams({ role: 'participant', pageSize: '50', q });
      if (privateCompany) params.set('companyId', String(privateCompany));
      const res = await get(`/admin/users?${params}`, { signal });
      return res.items
        .filter((u) => u.status !== 'suspended')
        .map((u) => ({ value: u.id, label: u.fullName, detail: [u.email, u.companyName].filter(Boolean).join(' · ') }));
    }
    if (targetType === 'grupo') {
      const res = await get(`/admin/options/groups${privateCompany ? `?companyId=${privateCompany}` : ''}`, { signal });
      return res
        .filter((g) => g.status !== 'cerrado')
        .map((g) => ({ value: g.value, label: g.label, detail: g.company_name || 'Sin empresa' }));
    }
    const res = await get('/admin/options/companies', { signal });
    return res
      .filter((c) => c.status !== 'inactiva' && (!privateCompany || c.value === privateCompany))
      .map((c) => ({ value: c.value, label: c.label, detail: 'Todas sus personas, también las que entren después' }));
  }, [open, targetType, targetType === 'usuario' ? q : '']);

  const shown = useMemo(() => {
    const list = options.data || [];
    if (targetType === 'usuario' || !q.trim()) return list;
    const needle = q.trim().toLowerCase();
    return list.filter((o) => o.label.toLowerCase().includes(needle) || o.detail?.toLowerCase().includes(needle));
  }, [options.data, q, targetType]);

  const toggle = (o) => setSelected((m) => {
    const next = new Map(m);
    if (next.has(o.value)) next.delete(o.value); else next.set(o.value, o);
    return next;
  });

  const submit = async (e) => {
    e.preventDefault();
    const problems = checkForm([
      ['targets', !selected.size, 'Elige al menos un destino.'],
      ['dueAt', dates.dueAt && dates.dueAt < todayYmd(), 'La fecha límite ya pasó.'],
      ['dueAt', dates.startsAt && dates.dueAt && dates.dueAt <= dates.startsAt, 'La fecha límite debe ser posterior al inicio.'],
    ]);
    if (problems) { setError(problems); return; }
    setBusy(true);
    setError(null);
    try {
      const res = await post('/admin/assignments', {
        courseIds: [course.id],
        targetType,
        targetIds: [...selected.keys()],
        startsAt: dates.startsAt || null,
        dueAt: dates.dueAt || null,
      });
      const parts = [
        res.created && plural(res.created, 'inscripción nueva', 'inscripciones nuevas'),
        res.reactivated && plural(res.reactivated, 'reactivada', 'reactivadas'),
        res.unchanged && `${res.unchanged} ya ${res.unchanged === 1 ? 'lo tenía' : 'lo tenían'}`,
      ].filter(Boolean);
      toast.success(`Curso asignado${parts.length ? `: ${parts.join(', ')}` : ''}.`);
      onAssigned();
      onClose();
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  const { fields, general } = errorsFrom(error, ['dueAt', 'startsAt', 'targets']);
  const TypeIcon = TARGET[targetType].icon;
  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onClose}
      dismissable={!busy}
      size="lg"
      title={`Asignar «${course.title}»`}
      description={privateCompany
        ? `Capacitación privada: solo personas y grupos de ${course.companyName}.`
        : 'Elige personas, grupos o empresas. Las asignaciones a grupos y empresas también llegan a quienes entren después.'}
      footer={(
        <>
          <span className="mr-auto self-center text-sm text-[var(--aula-muted)]">{plural(selected.size, 'seleccionado')}</span>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancelar</Button>
          <Button type="submit" form="aula-assign-form" icon={UserPlus} loading={busy} disabled={!selected.size}>Asignar</Button>
        </>
      )}
    >
      <form ref={formRef} id="aula-assign-form" onSubmit={submit} noValidate className="flex flex-col gap-4">
        {general && <Alert tone="danger">{general}</Alert>}
        {!course.version && (
          <Alert tone="info">El curso aún no está publicado: las personas lo verán como «próximamente» hasta que lo publiques.</Alert>
        )}
        <Segmented label="Asignar a" value={targetType} onChange={setTargetType}
          options={[
            { value: 'grupo', label: 'Grupos', icon: UsersRound },
            { value: 'usuario', label: 'Personas', icon: User },
            { value: 'empresa', label: 'Empresa', icon: Building2 },
          ]} />
        <SearchInput value={q} onChange={setQ} placeholder={targetType === 'usuario' ? 'Buscar por nombre o correo' : 'Filtrar'} />
        {fields.targets && <p role="alert" className="text-xs font-medium text-[var(--aula-danger)]">{fields.targets}</p>}
        <fieldset aria-label="Destinos" className="max-h-[38vh] overflow-y-auto rounded-[var(--aula-radius)] border border-[var(--aula-border)]">
          {options.loading && !options.data && <div className="p-3"><LoadingBlock rows={3} /></div>}
          {options.error && <ErrorState error={options.error} onRetry={options.reload} className="m-3" />}
          {options.data && (shown.length ? (
            <ul className="divide-y divide-[var(--aula-border)]">
              {shown.map((o) => (
                <li key={o.value} className="px-3 py-2.5">
                  <Checkbox label={o.label} description={o.detail} checked={selected.has(o.value)} onChange={() => toggle(o)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-2 p-4 text-sm text-[var(--aula-muted)]">
              <TypeIcon className="h-4 w-4" aria-hidden="true" />
              {targetType === 'usuario' ? 'Nadie coincide.' : targetType === 'grupo' ? 'No hay grupos activos disponibles.' : 'No hay empresas activas disponibles.'}
            </p>
          ))}
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Disponible desde (opcional)" type="date" value={dates.startsAt} error={fields.startsAt}
            onChange={(e) => setDates({ ...dates, startsAt: e.target.value })} hint="Vacío: de inmediato." />
          <TextInput label="Fecha límite (opcional)" type="date" min={todayYmd()} value={dates.dueAt} error={fields.dueAt}
            onChange={(e) => setDates({ ...dates, dueAt: e.target.value })} hint="Vence al final de ese día (hora de Colombia)." />
        </div>
      </form>
    </Modal>
  );
}

export default function ParticipantesCurso() {
  const { course, reload } = useCourse();
  const toast = useToast();
  const table = useTableState({ sort: 'assignedAt', dir: 'desc' });
  const { state } = table;
  const assignments = useAsync(({ signal }) => get(`/admin/courses/${course.id}/assignments`, { signal }), [course.id]);
  const enrollments = useAsync(
    ({ signal }) => get(`/admin/courses/${course.id}/enrollments?${table.query()}`, { signal }),
    [course.id, table.key],
  );
  const [assigning, setAssigning] = useState(false);
  const [dialog, setDialog] = useState(null);
  const refresh = () => { assignments.reload(); enrollments.reload(); reload(); };
  const archived = course.status === 'archivado';

  const columns = [
    { key: 'name', header: 'Persona', sortable: true, render: (e) => (
      <Link to={`/aula/admin/participantes/${e.userId}`} className="block min-w-0 hover:text-[var(--aula-primary)]">
        <span className="block font-semibold">{e.fullName}</span>
        <span className="block truncate text-xs text-[var(--aula-muted)]">{[e.email, e.companyName].filter(Boolean).join(' · ')}</span>
      </Link>
    ) },
    { key: 'status', header: 'Estado', render: (e) => <StatusBadge kind="enrollment" status={e.status} /> },
    { key: 'progress', header: 'Avance', sortable: true, render: (e) => (
      <div className="w-36">
        <ProgressBar value={e.progressPct} label={`Avance de ${e.fullName}`} size="sm" />
        <p className="mt-1 text-[11px] text-[var(--aula-muted)]">{Math.round(e.progressPct)} % · {e.lessons.done}/{e.lessons.required} clases</p>
      </div>
    ) },
    { key: 'version', header: 'Versión', render: (e) => (e.versionNumber ? `v${e.versionNumber}` : '—') },
    { key: 'via', header: 'Asignado por', render: (e) => (e.assignedVia ? TARGET[e.assignedVia].label : '—') },
    { key: 'dueAt', header: 'Fecha límite', sortable: true, render: (e) => fmtDate(e.dueAt) },
    { key: 'lastAccessAt', header: 'Último acceso', render: (e) => (e.lastAccessAt ? fmtDate(e.lastAccessAt) : 'Nunca') },
    { key: 'actions', header: <span className="sr-only">Acciones</span>, align: 'right', render: (e) => (
      <ActionMenu label={`Acciones de ${e.fullName}`} items={[
        e.withdrawnAt
          ? { label: 'Devolver el acceso', icon: RotateCcw, onSelect: () => setDialog({ kind: 'reactivate', item: e }) }
          : { label: 'Retirar del curso', icon: UserMinus, tone: 'danger', onSelect: () => setDialog({ kind: 'withdraw', item: e }) },
      ]} />
    ) },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Card
        title="Asignaciones"
        description="A quién se asignó el curso. Las de grupo y empresa incluyen a quienes entren después."
        actions={!archived && <Button size="sm" icon={UserPlus} onClick={() => setAssigning(true)}>Asignar</Button>}
      >
        {assignments.loading && !assignments.data && <LoadingBlock rows={2} />}
        {assignments.error && <ErrorState error={assignments.error} onRetry={assignments.reload} />}
        {assignments.data && (assignments.data.length ? (
          <ul className="flex flex-col divide-y divide-[var(--aula-border)]">
            {assignments.data.map((a) => {
              const Icon = TARGET[a.targetType].icon;
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--aula-primary-soft)] text-[var(--aula-primary)]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{a.targetLabel} <span className="text-xs font-normal text-[var(--aula-muted)]">· {TARGET[a.targetType].label}{a.targetDetail ? ` · ${a.targetDetail}` : ''}</span></p>
                    <p className="flex flex-wrap items-center gap-x-2 text-xs text-[var(--aula-muted)]">
                      <span>{plural(a.enrollments, 'persona inscrita', 'personas inscritas')}</span>
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />Asignado el {fmtDate(a.createdAt)}</span>
                      {a.startsAt && <span>· desde {fmtDate(a.startsAt)}</span>}
                      {a.dueAt && <span>· límite {fmtDate(a.dueAt)}</span>}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" icon={XCircle} onClick={() => setDialog({ kind: 'revoke', item: a })}>Revocar</Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-[var(--aula-muted)]">Este curso todavía no está asignado.</p>
        ))}
      </Card>

      <Card title="Personas inscritas" bodyClassName="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <SearchInput value={state.q} onChange={(v) => table.update({ q: v })} placeholder="Buscar por nombre o correo" className="min-w-[220px] flex-1" />
          <FilterSelect label="Estado" value={state.status} onChange={(v) => table.update({ status: v })}
            options={ENROLLMENT_STATUS_OPTIONS.filter((o) => o.value !== 'retirado')} />
          <FilterSelect label="Mostrar" value={state.withdrawn} onChange={(v) => table.update({ withdrawn: v })} allLabel="Con acceso"
            options={[{ value: '1', label: 'Retirados' }]} />
        </div>
        <DataTable
          caption="Personas inscritas en el curso"
          columns={columns}
          rows={enrollments.data?.items}
          loading={enrollments.loading}
          error={enrollments.error}
          onRetry={enrollments.reload}
          sort={state.sort}
          dir={state.dir}
          onSort={(sort, dir) => table.update({ sort, dir })}
          empty={(
            <EmptyState icon={Users}
              title={state.q || state.status || state.withdrawn ? 'Nadie coincide' : 'Aún no hay personas inscritas'}
              description={state.q || state.status || state.withdrawn ? 'Prueba con otros filtros.' : 'Asigna el curso a personas, grupos o empresas.'}
              action={!archived && !(state.q || state.status || state.withdrawn) && <Button icon={UserPlus} onClick={() => setAssigning(true)}>Asignar</Button>} />
          )}
        />
        {enrollments.data && <Pagination {...enrollments.data} onPage={(p) => table.update({ page: p }, { resetPage: false })} />}
        {enrollments.data?.items?.some((e) => e.status === 'invitado') && (
          <p className="text-xs text-[var(--aula-muted)]"><Badge>Invitado</Badge> aún no activó su cuenta; puedes reenviar la invitación desde su ficha.</p>
        )}
      </Card>

      <AssignModal open={assigning} onClose={() => setAssigning(false)} course={course} onAssigned={refresh} />
      <ConfirmDialog
        open={dialog?.kind === 'revoke'}
        onClose={() => setDialog(null)}
        tone="danger"
        title={`¿Revocar la asignación a ${dialog?.item?.targetLabel}?`}
        description={`${dialog?.item?.enrollments ? `${plural(dialog.item.enrollments, 'persona pierde', 'personas pierden')} el acceso que les dio esta asignación. ` : ''}Su avance y sus notas se conservan; si vuelves a asignar el curso, retoman donde iban.`}
        confirmLabel="Revocar"
        onConfirm={async () => {
          const r = await post(`/admin/assignments/${dialog.item.id}/revoke`, {});
          toast.success(`Asignación revocada${r.withdrawn ? `: ${plural(r.withdrawn, 'inscripción retirada', 'inscripciones retiradas')}` : ''}.`);
          refresh();
        }}
      />
      <ConfirmDialog
        open={dialog?.kind === 'withdraw'}
        onClose={() => setDialog(null)}
        tone="danger"
        title={`¿Retirar a ${dialog?.item?.fullName} del curso?`}
        description="Deja de verlo en su aula. Su avance y sus notas se conservan para los reportes."
        confirmLabel="Retirar"
        requireReason
        onConfirm={async (reason) => {
          await post(`/admin/enrollments/${dialog.item.id}/withdraw`, { reason });
          toast.success('Inscripción retirada.');
          refresh();
        }}
      />
      <ConfirmDialog
        open={dialog?.kind === 'reactivate'}
        onClose={() => setDialog(null)}
        title={`¿Devolver el acceso a ${dialog?.item?.fullName}?`}
        description="Vuelve a ver el curso con el avance que tenía."
        confirmLabel="Devolver acceso"
        onConfirm={async () => {
          await post(`/admin/enrollments/${dialog.item.id}/reactivate`, {});
          toast.success('Acceso devuelto.');
          refresh();
        }}
      />
    </div>
  );
}

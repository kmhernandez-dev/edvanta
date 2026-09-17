import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Ban, Mail, Pencil, Plus, RotateCcw, Trash2, Upload, UserCheck, Users } from 'lucide-react';
import { api, get, post } from '../../api';
import { useAsync, useTableState } from '../../hooks';
import { fmtDate, fmtDateTime, fmtPct, ROLE_LABEL } from '../../labels';
import { useAulaSession } from '../../session';
import { Badge, StatusBadge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../../ui/Dialog';
import { Card, PageHeader, ProgressBar } from '../../ui/Page';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../../ui/States';
import { DataTable, FilterSelect, Pagination, SearchInput } from '../../ui/Table';
import { useToast } from '../../ui/Toast';
import { UserFormModal, useCompanyOptions, useGroupOptions } from './forms';

export default function Participantes() {
  const navigate = useNavigate();
  const table = useTableState({ page: '1' });
  const { q, companyId, groupId, status, role, sort, dir } = table.state;
  const companies = useCompanyOptions();
  const groups = useGroupOptions(companyId);
  const list = useAsync(({ signal }) => get(`/admin/users?${table.query()}`, { signal }), [table.key]);
  const [creating, setCreating] = useState(false);

  const columns = [
    {
      key: 'name', header: 'Persona', sortable: true,
      render: (u) => (
        <div className="min-w-0">
          <p className="font-semibold">
            {u.fullName}
            {u.role === 'admin' && <Badge tone="info" className="ml-2">Admin</Badge>}
            {u.isDemo && <Badge tone="accent" className="ml-2">Demo</Badge>}
          </p>
          <p className="truncate text-xs text-[var(--aula-muted)]">{u.email}</p>
        </div>
      ),
    },
    { key: 'company', header: 'Empresa', sortable: true, render: (u) => u.companyName || <span className="text-[var(--aula-muted)]">—</span> },
    { key: 'groups', header: 'Grupos', render: (u) => (u.groups.length ? u.groups.map((g) => g.name).join(', ') : <span className="text-[var(--aula-muted)]">—</span>) },
    { key: 'enrollments', header: 'Cursos', align: 'right', render: (u) => <span className="tabular-nums">{u.enrollments}</span> },
    { key: 'status', header: 'Cuenta', sortable: true, render: (u) => <StatusBadge kind="user" status={u.status} /> },
    { key: 'lastLogin', header: 'Último acceso', sortable: true, render: (u) => (u.lastLoginAt ? fmtDate(u.lastLoginAt) : 'Nunca') },
  ];

  const filtered = Boolean(q || companyId || groupId || status || role);
  return (
    <div>
      <PageHeader
        title="Participantes"
        description="Personas con acceso al aula. Cada una ve solo los cursos que se le asignan."
        actions={(
          <>
            <Button variant="secondary" icon={Upload} to="/aula/admin/participantes/importar">Importar CSV</Button>
            <Button icon={Plus} onClick={() => setCreating(true)}>Nueva persona</Button>
          </>
        )}
      />
      <Card bodyClassName="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <SearchInput value={q} onChange={(v) => table.update({ q: v })} placeholder="Buscar por nombre o correo" className="min-w-[220px] flex-1" />
          <FilterSelect label="Empresa" value={companyId} onChange={(v) => table.update({ companyId: v, groupId: '' })}
            options={[{ value: 'none', label: 'Sin empresa' }, ...(companies.data || []).map((c) => ({ value: String(c.value), label: c.label }))]} allLabel="Todas" />
          <FilterSelect label="Grupo" value={groupId} onChange={(v) => table.update({ groupId: v })}
            options={(groups.data || []).map((g) => ({ value: String(g.value), label: g.company_name ? `${g.label} · ${g.company_name}` : g.label }))} allLabel="Todos" />
          <FilterSelect label="Cuenta" value={status} onChange={(v) => table.update({ status: v })}
            options={[{ value: 'active', label: 'Activas' }, { value: 'invited', label: 'Invitación pendiente' }, { value: 'suspended', label: 'Suspendidas' }]} allLabel="Todas" />
          <FilterSelect label="Rol" value={role} onChange={(v) => table.update({ role: v })}
            options={[{ value: 'participant', label: 'Participantes' }, { value: 'admin', label: 'Administradores' }]} allLabel="Todos" />
        </div>
        <DataTable
          caption="Participantes"
          columns={columns}
          rows={list.data?.items}
          loading={list.loading}
          error={list.error}
          onRetry={list.reload}
          sort={sort || 'name'}
          dir={dir || (sort ? 'desc' : 'asc')}
          onSort={(key, d) => table.update({ sort: key, dir: d })}
          rowHref={(u) => `/aula/admin/participantes/${u.id}`}
          empty={(
            <EmptyState icon={Users}
              title={filtered ? 'Nadie coincide con los filtros' : 'Aún no hay participantes'}
              description={filtered ? 'Prueba con otros filtros o términos.' : 'Crea personas una a una o impórtalas desde un CSV.'}
              action={!filtered && <Button icon={Upload} to="/aula/admin/participantes/importar">Importar CSV</Button>} />
          )}
        />
        {list.data && <Pagination {...list.data} onPage={(p) => table.update({ page: p }, { resetPage: false })} />}
      </Card>
      <UserFormModal open={creating} onClose={() => setCreating(false)}
        defaultCompanyId={companyId && companyId !== 'none' ? companyId : undefined}
        defaultGroupId={groupId || undefined}
        onSaved={(u) => navigate(`/aula/admin/participantes/${u.id}`)} />
    </div>
  );
}

export function ParticipanteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user: me } = useAulaSession();
  const person = useAsync(({ signal }) => get(`/admin/users/${id}`, { signal }), [id]);
  const [editing, setEditing] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [inviting, setInviting] = useState(false);

  if (person.loading && !person.data) return <LoadingBlock rows={4} />;
  if (person.error) return <ErrorState error={person.error} onRetry={person.reload} />;
  const u = person.data;
  const isSelf = me.id === u.id;

  const invite = async () => {
    setInviting(true);
    try {
      await post(`/admin/users/${u.id}/invite`);
      toast.success(`Invitación enviada a ${u.email}.`);
      person.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setInviting(false);
    }
  };

  const enrollmentColumns = [
    { key: 'course', header: 'Curso', render: (e) => <span className="font-semibold">{e.course_title}</span> },
    { key: 'status', header: 'Estado', render: (e) => <StatusBadge status={e.effective_status} /> },
    { key: 'progress', header: 'Avance', render: (e) => (
      <div className="flex min-w-[120px] items-center gap-2">
        <ProgressBar value={e.progress_pct} label={`Avance en ${e.course_title}`} size="sm" />
        <span className="w-10 text-right text-xs tabular-nums">{fmtPct(e.progress_pct)}</span>
      </div>
    ) },
    { key: 'due', header: 'Fecha límite', render: (e) => fmtDate(e.due_at) },
    { key: 'last', header: 'Último acceso', render: (e) => (e.last_access_at ? fmtDateTime(e.last_access_at) : 'Sin iniciar') },
    { key: 'actions', header: '', align: 'right', render: (e) => (e.withdrawn_at
      ? <Button size="sm" variant="secondary" icon={RotateCcw} onClick={() => setDialog({ type: 'reactivate', enrollment: e })}>Reactivar</Button>
      : <Button size="sm" variant="ghost" onClick={() => setDialog({ type: 'withdraw', enrollment: e })}>Retirar</Button>) },
  ];

  return (
    <div>
      <PageHeader
        back={{ to: '/aula/admin/participantes', label: 'Participantes' }}
        eyebrow={u.companyName || ROLE_LABEL[u.role]}
        title={u.fullName}
        description={[u.email, u.jobTitle].filter(Boolean).join(' · ')}
        actions={(
          <>
            <Button variant="secondary" icon={Pencil} onClick={() => setEditing(true)}>Editar</Button>
            {u.status === 'invited' && <Button variant="secondary" icon={Mail} onClick={invite} loading={inviting}>Reenviar invitación</Button>}
            {!isSelf && (u.status === 'suspended'
              ? <Button variant="secondary" icon={UserCheck} onClick={() => setDialog({ type: 'reactivateUser' })}>Reactivar cuenta</Button>
              : <Button variant="danger-soft" icon={Ban} onClick={() => setDialog({ type: 'suspend' })}>Suspender</Button>)}
            {!isSelf && <Button variant="danger-soft" icon={Trash2} onClick={() => setDialog({ type: 'delete' })}>Eliminar</Button>}
          </>
        )}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-[var(--aula-muted)]">Cuenta</p><div className="mt-2"><StatusBadge kind="user" status={u.status} /></div></Card>
        <Card><p className="text-sm text-[var(--aula-muted)]">Rol</p><p className="mt-1 font-semibold">{ROLE_LABEL[u.role]}</p></Card>
        <Card><p className="text-sm text-[var(--aula-muted)]">Último acceso</p><p className="mt-1 font-semibold">{u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : 'Nunca ha entrado'}</p></Card>
        <Card><p className="text-sm text-[var(--aula-muted)]">Alta</p><p className="mt-1 font-semibold">{fmtDate(u.createdAt)}</p></Card>
      </div>
      {u.status === 'invited' && (
        <Alert tone="info" className="mb-6" title="Invitación pendiente">
          Esta persona aún no crea su contraseña. El enlace vence a los 7 días; puedes reenviarlo cuando quieras.
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Card title="Grupos">
          {u.groups.length ? (
            <ul className="flex flex-col gap-2">
              {u.groups.map((g) => (
                <li key={g.id}><Link to={`/aula/admin/grupos/${g.id}`} className="font-medium text-[var(--aula-primary)] hover:underline">{g.name}</Link></li>
              ))}
            </ul>
          ) : <p className="text-sm text-[var(--aula-muted)]">No pertenece a ningún grupo.</p>}
        </Card>
        <Card title="Cursos asignados" description="El historial se conserva aunque la persona sea retirada.">
          <DataTable
            caption="Cursos de la persona"
            columns={enrollmentColumns}
            rows={u.enrollmentList}
            rowKey="id"
            empty={<EmptyState title="Sin cursos asignados" description="Asigna cursos a esta persona, a su grupo o a su empresa desde la sección de cursos." />}
          />
        </Card>
      </div>

      <UserFormModal open={editing} onClose={() => setEditing(false)} user={u} onSaved={() => person.reload()} />

      <ConfirmDialog
        open={dialog?.type === 'suspend'}
        onClose={() => setDialog(null)}
        tone="danger"
        title={`¿Suspender la cuenta de ${u.fullName}?`}
        description="Se cierran sus sesiones y no podrá entrar hasta que la reactives. Su avance se conserva."
        confirmLabel="Suspender cuenta"
        requireReason
        onConfirm={async (reason) => {
          await post(`/admin/users/${u.id}/suspend`, { reason });
          toast.success('Cuenta suspendida.');
          person.reload();
        }}
      />
      <ConfirmDialog
        open={dialog?.type === 'reactivateUser'}
        onClose={() => setDialog(null)}
        title={`¿Reactivar la cuenta de ${u.fullName}?`}
        description="Podrá volver a entrar con su contraseña (o con una invitación si nunca la creó)."
        confirmLabel="Reactivar"
        onConfirm={async () => {
          await post(`/admin/users/${u.id}/reactivate`);
          toast.success('Cuenta reactivada.');
          person.reload();
        }}
      />
      <ConfirmDialog
        open={dialog?.type === 'delete'}
        onClose={() => setDialog(null)}
        tone="danger"
        title={`¿Eliminar a ${u.fullName}?`}
        description="Pierde el acceso y sale de sus grupos y cursos. Sus resultados se conservan para los reportes y la bitácora."
        confirmLabel="Eliminar cuenta"
        confirmText={u.email}
        requireReason
        onConfirm={async (reason) => {
          await api(`/admin/users/${u.id}`, { method: 'DELETE', body: { reason } });
          toast.success('Cuenta eliminada.');
          navigate('/aula/admin/participantes', { replace: true });
        }}
      />
      <ConfirmDialog
        open={dialog?.type === 'withdraw'}
        onClose={() => setDialog(null)}
        tone="danger"
        title={`¿Retirar de «${dialog?.enrollment?.course_title}»?`}
        description="Dejará de ver el curso. Su avance, intentos y entregas quedan guardados y vuelven si lo reactivas."
        confirmLabel="Retirar del curso"
        requireReason
        onConfirm={async (reason) => {
          await post(`/admin/enrollments/${dialog.enrollment.id}/withdraw`, { reason });
          toast.success('Retirado del curso.');
          person.reload();
        }}
      />
      <ConfirmDialog
        open={dialog?.type === 'reactivate'}
        onClose={() => setDialog(null)}
        title={`¿Devolver el acceso a «${dialog?.enrollment?.course_title}»?`}
        description="Recupera el curso con el avance que tenía."
        confirmLabel="Reactivar inscripción"
        onConfirm={async () => {
          await post(`/admin/enrollments/${dialog.enrollment.id}/reactivate`);
          toast.success('Inscripción reactivada.');
          person.reload();
        }}
      />
    </div>
  );
}

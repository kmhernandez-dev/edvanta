import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pencil, Plus, Trash2, UserMinus, UserPlus, Users } from 'lucide-react';
import { del, get, post } from '../../api';
import { useAsync, useTableState } from '../../hooks';
import { fmtDate, plural, USER_STATUS } from '../../labels';
import { Badge, StatusBadge } from '../../ui/Badge';
import { Button, IconButton } from '../../ui/Button';
import { ConfirmDialog, Modal } from '../../ui/Dialog';
import { Checkbox } from '../../ui/Form';
import { Card, PageHeader } from '../../ui/Page';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../../ui/States';
import { DataTable, FilterSelect, Pagination, SearchInput, useSelection } from '../../ui/Table';
import { useToast } from '../../ui/Toast';
import { GroupFormModal, useCompanyOptions } from './forms';

const statusBadge = (s) => <Badge tone={s === 'activo' ? 'success' : 'neutral'}>{s === 'activo' ? 'Activo' : 'Cerrado'}</Badge>;
const range = (g) => (g.startsOn || g.endsOn ? `${g.startsOn ? fmtDate(g.startsOn) : '…'} – ${g.endsOn ? fmtDate(g.endsOn) : '…'}` : '—');

export default function Grupos() {
  const navigate = useNavigate();
  const table = useTableState({ page: '1' });
  const { q, companyId, status, sort, dir } = table.state;
  const companies = useCompanyOptions();
  const list = useAsync(({ signal }) => get(`/admin/groups?${table.query()}`, { signal }), [table.key]);
  const [creating, setCreating] = useState(false);

  const columns = [
    { key: 'name', header: 'Grupo', sortable: true, render: (g) => <span className="font-semibold">{g.name}</span> },
    { key: 'company', header: 'Empresa', sortable: true, render: (g) => g.companyName || <span className="text-[var(--aula-muted)]">Sin empresa</span> },
    { key: 'members', header: 'Miembros', sortable: true, align: 'right', render: (g) => <span className="tabular-nums">{g.members}</span> },
    { key: 'courses', header: 'Cursos', align: 'right', render: (g) => <span className="tabular-nums">{g.courses}</span> },
    { key: 'dates', header: 'Vigencia', render: range },
    { key: 'status', header: 'Estado', render: (g) => statusBadge(g.status) },
  ];

  const filtered = Boolean(q || companyId || status);
  return (
    <div>
      <PageHeader
        title="Grupos y cohortes"
        description="Agrupa participantes para asignarles cursos de una vez. Quien entra después a un grupo recibe sus cursos automáticamente."
        actions={<Button icon={Plus} onClick={() => setCreating(true)}>Nuevo grupo</Button>}
      />
      <Card bodyClassName="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <SearchInput value={q} onChange={(v) => table.update({ q: v })} placeholder="Buscar grupo o empresa" className="min-w-[240px] flex-1" />
          <FilterSelect label="Empresa" value={companyId} onChange={(v) => table.update({ companyId: v })}
            options={(companies.data || []).map((c) => ({ value: String(c.value), label: c.label }))} allLabel="Todas" />
          <FilterSelect label="Estado" value={status} onChange={(v) => table.update({ status: v })}
            options={[{ value: 'activo', label: 'Activos' }, { value: 'cerrado', label: 'Cerrados' }]} allLabel="Todos" />
        </div>
        <DataTable
          caption="Grupos"
          columns={columns}
          rows={list.data?.items}
          loading={list.loading}
          error={list.error}
          onRetry={list.reload}
          sort={sort || 'createdAt'}
          dir={dir || 'desc'}
          onSort={(key, d) => table.update({ sort: key, dir: d })}
          rowHref={(g) => `/aula/admin/grupos/${g.id}`}
          empty={(
            <EmptyState icon={Users}
              title={filtered ? 'Ningún grupo coincide' : 'Aún no hay grupos'}
              description={filtered ? 'Prueba con otros filtros.' : 'Crea una cohorte para asignar cursos a varias personas a la vez.'}
              action={!filtered && <Button icon={Plus} onClick={() => setCreating(true)}>Nuevo grupo</Button>} />
          )}
        />
        {list.data && <Pagination {...list.data} onPage={(p) => table.update({ page: p }, { resetPage: false })} />}
      </Card>
      <GroupFormModal open={creating} onClose={() => setCreating(false)} onSaved={(g) => navigate(`/aula/admin/grupos/${g.id}`)} />
    </div>
  );
}

function AddMembersModal({ open, onClose, group, onAdded }) {
  const toast = useToast();
  const [q, setQ] = useState('');
  const selection = useSelection();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const params = new URLSearchParams({ role: 'participant', pageSize: '50', notInGroup: String(group.id), q });
  if (group.companyId) params.set('companyId', String(group.companyId));
  const candidates = useAsync(({ signal }) => (open ? get(`/admin/users?${params}`, { signal }) : Promise.resolve(null)), [open, q, group.id]);

  const add = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await post(`/admin/groups/${group.id}/members`, { userIds: [...selection.selected] });
      toast.success(`${plural(r.added, 'persona agregada', 'personas agregadas')}${r.enrolled ? ` e ${r.added === 1 ? 'inscrita' : 'inscritas'} en ${plural(r.enrolled, 'curso')} del grupo` : ''}.`);
      selection.clear();
      onAdded();
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const items = candidates.data?.items || [];
  return (
    <Modal open={open} onClose={onClose} title={`Agregar personas a ${group.name}`} size="lg"
      description={group.companyId ? `Solo aparecen participantes de ${group.companyName} que aún no están en el grupo.` : 'Participantes que aún no están en el grupo.'}
      footer={(
        <>
          <span className="mr-auto self-center text-sm text-[var(--aula-muted)]">{plural(selection.count, 'seleccionada')}</span>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancelar</Button>
          <Button icon={UserPlus} onClick={add} loading={busy} disabled={!selection.count}>Agregar al grupo</Button>
        </>
      )}>
      <div className="flex flex-col gap-3">
        {error && <Alert tone="danger">{error.message}</Alert>}
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por nombre o correo" />
        {candidates.loading && !candidates.data && <LoadingBlock rows={3} />}
        {candidates.error && <ErrorState error={candidates.error} onRetry={candidates.reload} />}
        {candidates.data && (items.length ? (
          <ul className="max-h-[50vh] divide-y divide-[var(--aula-border)] overflow-y-auto rounded-[var(--aula-radius)] border border-[var(--aula-border)]">
            {items.map((u) => (
              <li key={u.id} className="px-3 py-2.5">
                <Checkbox
                  label={u.fullName}
                  description={`${u.email}${u.status !== 'active' ? ` · ${USER_STATUS[u.status]?.label.toLowerCase()}` : ''}`}
                  checked={selection.selected.has(u.id)}
                  onChange={() => selection.toggle(u.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No hay personas para agregar"
            description={q ? 'Nadie coincide con la búsqueda.' : 'Todas las personas disponibles ya están en el grupo. Crea participantes o impórtalos desde un CSV.'}
            action={<Button variant="secondary" to="/aula/admin/participantes/importar">Importar CSV</Button>} />
        ))}
        {candidates.data?.total > items.length && (
          <p className="text-xs text-[var(--aula-muted)]">Mostrando {items.length} de {candidates.data.total}. Usa la búsqueda para encontrar a alguien más.</p>
        )}
      </div>
    </Modal>
  );
}

export function GrupoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const group = useAsync(({ signal }) => get(`/admin/groups/${id}`, { signal }), [id]);
  const members = useAsync(({ signal }) => get(`/admin/groups/${id}/members`, { signal }), [id]);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [withdraw, setWithdraw] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (group.loading && !group.data) return <LoadingBlock rows={4} />;
  if (group.error) return <ErrorState error={group.error} onRetry={group.reload} />;
  const g = group.data;
  const reload = () => { group.reload(); members.reload(); };

  const columns = [
    { key: 'name', header: 'Persona', render: (u) => (
      <Link to={`/aula/admin/participantes/${u.id}`} className="block min-w-0 hover:text-[var(--aula-primary)]">
        <span className="block font-semibold">{u.fullName}</span>
        <span className="block text-xs text-[var(--aula-muted)]">{u.email}</span>
      </Link>
    ) },
    { key: 'jobTitle', header: 'Cargo', render: (u) => u.jobTitle || '—' },
    { key: 'status', header: 'Cuenta', render: (u) => <StatusBadge kind="user" status={u.status} /> },
    { key: 'addedAt', header: 'En el grupo desde', render: (u) => fmtDate(u.addedAt) },
    { key: 'actions', header: '', align: 'right', render: (u) => (
      <IconButton icon={UserMinus} label={`Quitar a ${u.fullName} del grupo`} onClick={() => { setWithdraw(false); setRemoving(u); }} />
    ) },
  ];

  return (
    <div>
      <PageHeader
        back={{ to: '/aula/admin/grupos', label: 'Grupos' }}
        eyebrow={g.companyName || 'Sin empresa'}
        title={g.name}
        description={g.description || `Vigencia: ${range(g)}`}
        actions={(
          <>
            <Button variant="secondary" icon={Pencil} onClick={() => setEditing(true)}>Editar</Button>
            <Button variant="danger-soft" icon={Trash2} onClick={() => setDeleting(true)}>Eliminar</Button>
          </>
        )}
      />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {statusBadge(g.status)}
        <span className="text-sm text-[var(--aula-muted)]">{plural(g.members, 'miembro')} · {plural(g.courses, 'curso asignado', 'cursos asignados')}</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card title="Miembros" actions={<Button size="sm" icon={UserPlus} onClick={() => setAdding(true)} disabled={g.status === 'cerrado'}>Agregar personas</Button>}>
          {g.status === 'cerrado' && <Alert tone="info" className="mb-4">El grupo está cerrado. Reábrelo desde «Editar» para agregar personas.</Alert>}
          <DataTable
            caption="Miembros del grupo"
            columns={columns}
            rows={members.data}
            loading={members.loading}
            error={members.error}
            onRetry={members.reload}
            empty={<EmptyState icon={Users} title="El grupo no tiene miembros" description="Agrega participantes para que reciban los cursos del grupo." />}
          />
        </Card>
        <Card title="Cursos del grupo">
          {g.assignments.length ? (
            <ul className="flex flex-col gap-3">
              {g.assignments.map((a) => (
                <li key={a.id} className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
                  <p className="font-semibold">{a.course_title}</p>
                  <p className="text-xs text-[var(--aula-muted)]">
                    Asignado el {fmtDate(a.created_at)}{a.due_at ? ` · límite ${fmtDate(a.due_at)}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--aula-muted)]">Este grupo aún no tiene cursos asignados.</p>
          )}
        </Card>
      </div>

      <GroupFormModal open={editing} onClose={() => setEditing(false)} group={g} onSaved={reload} />
      {adding && <AddMembersModal open={adding} onClose={() => setAdding(false)} group={g} onAdded={reload} />}
      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title={`¿Quitar a ${removing?.fullName} del grupo?`}
        description="Su avance y sus calificaciones se conservan."
        confirmLabel="Quitar del grupo"
        tone="danger"
        onConfirm={async () => {
          const r = await del(`/admin/groups/${g.id}/members/${removing.id}${withdraw ? '?withdraw=1' : ''}`);
          toast.success(r.withdrawn
            ? `${removing.fullName} salió del grupo y de ${plural(r.withdrawn, 'curso')}.`
            : `${removing.fullName} salió del grupo y conserva sus cursos.`);
          reload();
        }}
      >
        {g.courses > 0 && (
          <Checkbox
            label="Retirar también de los cursos recibidos por este grupo"
            description="Dejará de verlos en su aula. Su historial académico queda guardado."
            checked={withdraw}
            onChange={(e) => setWithdraw(e.target.checked)}
          />
        )}
      </ConfirmDialog>
      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        tone="danger"
        title={g.courses ? `${g.name} no se puede eliminar` : `¿Eliminar ${g.name}?`}
        unavailable={g.courses ? {
          reason: `Tiene ${plural(g.courses, 'curso asignado', 'cursos asignados')}. Para conservar el historial de sus miembros, cierra el grupo: deja de recibir personas y nada se pierde.`,
          action: g.status === 'activo' ? { label: 'Cerrar el grupo', onClick: () => setEditing(true) } : null,
        } : null}
        description="Los miembros salen del grupo; sus cuentas y su historial no se tocan."
        confirmLabel="Eliminar grupo"
        confirmText={g.name}
        onConfirm={async () => {
          await del(`/admin/groups/${g.id}`);
          toast.success(`Grupo «${g.name}» eliminado.`);
          navigate('/aula/admin/grupos', { replace: true });
        }}
      />
    </div>
  );
}

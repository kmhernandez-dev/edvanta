import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { del, fileUrl, get } from '../../api';
import { useAsync, useTableState } from '../../hooks';
import { fmtDate, listJoin, plural } from '../../labels';
import { Badge, StatusBadge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../../ui/Dialog';
import { Card, PageHeader, StatCard } from '../../ui/Page';
import { EmptyState, ErrorState, LoadingBlock } from '../../ui/States';
import { DataTable, FilterSelect, Pagination, SearchInput } from '../../ui/Table';
import { useToast } from '../../ui/Toast';
import { CompanyFormModal, GroupFormModal, UserFormModal } from './forms';

function CompanyLogo({ company, size = 'h-9 w-9' }) {
  return company.logoFileId
    ? <img src={fileUrl(company.logoFileId)} alt="" className={`${size} rounded-[var(--aula-radius-sm)] border border-[var(--aula-border)] bg-white object-contain`} />
    : (
      <span className={`${size} flex items-center justify-center rounded-[var(--aula-radius-sm)] bg-[var(--aula-primary-soft)] text-[var(--aula-primary)]`}>
        <Building2 className="h-4 w-4" aria-hidden="true" />
      </span>
    );
}

export default function Empresas() {
  const navigate = useNavigate();
  const table = useTableState({ page: '1' });
  const { q, status, sort, dir } = table.state;
  const list = useAsync(({ signal }) => get(`/admin/companies?${table.query()}`, { signal }), [table.key]);
  const [creating, setCreating] = useState(false);

  const columns = [
    {
      key: 'name', header: 'Empresa', sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <CompanyLogo company={c} />
          <div className="min-w-0">
            <p className="font-semibold">{c.name}{c.isDemo && <Badge tone="accent" className="ml-2">Demo</Badge>}</p>
            <p className="truncate text-xs text-[var(--aula-muted)]">{c.contactName || c.contactEmail || 'Sin contacto registrado'}</p>
          </div>
        </div>
      ),
    },
    { key: 'participants', header: 'Participantes', sortable: true, align: 'right', render: (c) => <span className="tabular-nums">{c.participants}</span> },
    { key: 'groups', header: 'Grupos', align: 'right', render: (c) => <span className="tabular-nums">{c.groups}</span> },
    { key: 'courses', header: 'Cursos privados', align: 'right', render: (c) => <span className="tabular-nums">{c.courses}</span> },
    { key: 'status', header: 'Estado', render: (c) => <Badge tone={c.status === 'activa' ? 'success' : 'neutral'}>{c.status === 'activa' ? 'Activa' : 'Inactiva'}</Badge> },
    { key: 'createdAt', header: 'Creada', sortable: true, render: (c) => fmtDate(c.createdAt) },
  ];

  const filtered = Boolean(q || status);
  return (
    <div>
      <PageHeader
        title="Empresas"
        description="Clientes a los que Edvanta entrega capacitaciones privadas."
        actions={<Button icon={Plus} onClick={() => setCreating(true)}>Nueva empresa</Button>}
      />
      <Card bodyClassName="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <SearchInput value={q} onChange={(v) => table.update({ q: v })} placeholder="Buscar por nombre o contacto" className="min-w-[240px] flex-1" />
          <FilterSelect label="Estado" value={status} onChange={(v) => table.update({ status: v })}
            options={[{ value: 'activa', label: 'Activas' }, { value: 'inactiva', label: 'Inactivas' }]} allLabel="Todas" />
        </div>
        <DataTable
          caption="Empresas"
          columns={columns}
          rows={list.data?.items}
          loading={list.loading}
          error={list.error}
          onRetry={list.reload}
          sort={sort || 'name'}
          dir={dir || (sort ? 'desc' : 'asc')}
          onSort={(key, d) => table.update({ sort: key, dir: d })}
          rowHref={(c) => `/aula/admin/empresas/${c.id}`}
          empty={(
            <EmptyState icon={Building2}
              title={filtered ? 'Ninguna empresa coincide' : 'Aún no hay empresas'}
              description={filtered ? 'Prueba con otro nombre o quita el filtro.' : 'Crea la primera para empezar a organizar sus grupos y participantes.'}
              action={!filtered && <Button icon={Plus} onClick={() => setCreating(true)}>Nueva empresa</Button>} />
          )}
        />
        {list.data && <Pagination {...list.data} pageSize={list.data.pageSize} onPage={(p) => table.update({ page: p }, { resetPage: false })} />}
      </Card>
      <CompanyFormModal open={creating} onClose={() => setCreating(false)} onSaved={(c) => navigate(`/aula/admin/empresas/${c.id}`)} />
    </div>
  );
}

export function EmpresaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const company = useAsync(({ signal }) => get(`/admin/companies/${id}`, { signal }), [id]);
  const groups = useAsync(({ signal }) => get(`/admin/groups?companyId=${id}&pageSize=100`, { signal }), [id]);
  const people = useAsync(({ signal }) => get(`/admin/users?companyId=${id}&pageSize=8&sort=createdAt`, { signal }), [id]);
  const [editing, setEditing] = useState(false);
  const [newGroup, setNewGroup] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (company.loading && !company.data) return <LoadingBlock rows={4} />;
  if (company.error) return <ErrorState error={company.error} onRetry={company.reload} />;
  const c = company.data;

  const reloadAll = () => { company.reload(); groups.reload(); people.reload(); };
  const related = [
    c.participants && plural(c.participants, 'participante'),
    c.groups && plural(c.groups, 'grupo'),
    c.courses && plural(c.courses, 'curso privado', 'cursos privados'),
  ].filter(Boolean);
  return (
    <div>
      <PageHeader
        back={{ to: '/aula/admin/empresas', label: 'Empresas' }}
        title={c.name}
        description={[c.contactName, c.contactEmail, c.contactPhone].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
        actions={(
          <>
            <Button variant="secondary" icon={Pencil} onClick={() => setEditing(true)}>Editar</Button>
            <Button variant="danger-soft" icon={Trash2} onClick={() => setDeleting(true)}>Eliminar</Button>
          </>
        )}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Participantes" value={c.participants} icon={Users} to={`/aula/admin/participantes?companyId=${c.id}`} />
        <StatCard label="Grupos" value={c.groups} />
        <StatCard label="Cursos privados" value={c.courses} />
      </div>
      {c.internalNotes && (
        <Card title="Observaciones internas" className="mb-6">
          <p className="whitespace-pre-line text-sm leading-relaxed">{c.internalNotes}</p>
        </Card>
      )}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Grupos y cohortes" actions={<Button size="sm" icon={Plus} onClick={() => setNewGroup(true)}>Nuevo grupo</Button>}>
          {groups.loading && !groups.data && <LoadingBlock rows={2} />}
          {groups.error && <ErrorState error={groups.error} onRetry={groups.reload} />}
          {groups.data && (groups.data.items.length ? (
            <ul className="divide-y divide-[var(--aula-border)]">
              {groups.data.items.map((g) => (
                <li key={g.id}>
                  <Link to={`/aula/admin/grupos/${g.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-[var(--aula-primary)]">
                    <span className="font-medium">{g.name}</span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-[var(--aula-muted)]">
                      {plural(g.members, 'miembro')} · {plural(g.courses, 'curso')}
                      <Badge tone={g.status === 'activo' ? 'success' : 'neutral'}>{g.status === 'activo' ? 'Activo' : 'Cerrado'}</Badge>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-[var(--aula-muted)]">Esta empresa aún no tiene grupos.</p>)}
        </Card>
        <Card title="Participantes recientes" actions={(
          <>
            <Button size="sm" variant="secondary" to={`/aula/admin/participantes?companyId=${c.id}`}>Ver todos</Button>
            <Button size="sm" icon={Plus} onClick={() => setNewUser(true)}>Agregar</Button>
          </>
        )}>
          {people.loading && !people.data && <LoadingBlock rows={2} />}
          {people.error && <ErrorState error={people.error} onRetry={people.reload} />}
          {people.data && (people.data.items.length ? (
            <ul className="divide-y divide-[var(--aula-border)]">
              {people.data.items.map((u) => (
                <li key={u.id}>
                  <Link to={`/aula/admin/participantes/${u.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-[var(--aula-primary)]">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{u.fullName}</span>
                      <span className="block truncate text-xs text-[var(--aula-muted)]">{u.email}</span>
                    </span>
                    <StatusBadge kind="user" status={u.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-[var(--aula-muted)]">Aún no hay participantes en esta empresa.</p>)}
        </Card>
      </div>

      <CompanyFormModal open={editing} onClose={() => setEditing(false)} company={c} onSaved={() => company.reload()} />
      <GroupFormModal open={newGroup} onClose={() => setNewGroup(false)} defaultCompanyId={c.id} onSaved={reloadAll} />
      <UserFormModal open={newUser} onClose={() => setNewUser(false)} defaultCompanyId={c.id} onSaved={reloadAll} />
      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        tone="danger"
        title={related.length ? `${c.name} no se puede eliminar` : `¿Eliminar ${c.name}?`}
        unavailable={related.length ? {
          reason: `Tiene ${listJoin(related)}. Para conservar su historial, márcala como inactiva: deja de aparecer en los selectores y nada se pierde.`,
          action: c.status === 'activa' ? { label: 'Marcar como inactiva', onClick: () => setEditing(true) } : null,
        } : null}
        description="La empresa no tiene participantes, grupos ni cursos. Esta acción queda en la bitácora."
        confirmLabel="Eliminar empresa"
        confirmText={c.name}
        onConfirm={async () => {
          await del(`/admin/companies/${c.id}`);
          toast.success(`Empresa «${c.name}» eliminada.`);
          navigate('/aula/admin/empresas', { replace: true });
        }}
      />
    </div>
  );
}

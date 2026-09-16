import { useState } from 'react';
import { History } from 'lucide-react';
import { get } from '../../api';
import { useAsync, useTableState } from '../../hooks';
import { fmtDateTime } from '../../labels';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Dialog';
import { Card, PageHeader } from '../../ui/Page';
import { EmptyState } from '../../ui/States';
import { DataTable, FilterSelect, Pagination, SearchInput } from '../../ui/Table';

function DiffView({ entry }) {
  const block = (title, data) => (
    <div className="min-w-0 flex-1">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--aula-muted)]">{title}</p>
      <pre className="max-h-72 overflow-auto rounded-[var(--aula-radius-sm)] bg-[var(--aula-surface-muted)] p-3 text-xs leading-relaxed">
        {data ? JSON.stringify(data, null, 2) : '—'}
      </pre>
    </div>
  );
  return (
    <div className="flex flex-col gap-4">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-[var(--aula-muted)]">Fecha</dt><dd className="font-medium">{fmtDateTime(entry.createdAt)}</dd></div>
        <div><dt className="text-[var(--aula-muted)]">Responsable</dt><dd className="font-medium break-all">{entry.actor}</dd></div>
        <div className="sm:col-span-2"><dt className="text-[var(--aula-muted)]">Detalle</dt><dd className="font-medium">{entry.summary}</dd></div>
        {entry.reason && <div className="sm:col-span-2"><dt className="text-[var(--aula-muted)]">Motivo</dt><dd className="font-medium">{entry.reason}</dd></div>}
      </dl>
      {(entry.before || entry.after) && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {block('Antes', entry.before)}
          {block('Después', entry.after)}
        </div>
      )}
    </div>
  );
}

export default function Bitacora() {
  const table = useTableState({ page: '1' });
  const { q, action, from, to } = table.state;
  const actions = useAsync(({ signal }) => get('/admin/audit/actions', { signal }), []);
  const log = useAsync(({ signal }) => get(`/admin/audit?${table.query()}`, { signal }), [table.key]);
  const [detail, setDetail] = useState(null);

  const columns = [
    { key: 'createdAt', header: 'Fecha', render: (r) => <span className="whitespace-nowrap">{fmtDateTime(r.createdAt)}</span> },
    { key: 'actionLabel', header: 'Acción', render: (r) => <span className="font-medium">{r.actionLabel}</span> },
    { key: 'summary', header: 'Detalle', render: (r) => <span className="line-clamp-2">{r.summary}</span> },
    { key: 'actor', header: 'Responsable', render: (r) => <span className="break-all text-[var(--aula-muted)]">{r.actor}</span> },
    { key: 'ver', header: '', align: 'right', render: (r) => <Button size="sm" variant="ghost" onClick={() => setDetail(r)}>Ver</Button> },
  ];

  const data = log.data;
  return (
    <div>
      <PageHeader
        title="Bitácora"
        description="Registro de las acciones administrativas: publicaciones, inscripciones, retiros, revisiones y cambios de nota. No se puede editar ni borrar."
      />
      <Card bodyClassName="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <SearchInput value={q} onChange={(v) => table.update({ q: v })} placeholder="Buscar en el detalle o por correo" className="min-w-[240px] flex-1" />
          <FilterSelect label="Acción" value={action} onChange={(v) => table.update({ action: v })}
            options={actions.data || []} allLabel="Todas" />
          <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--aula-muted)]">
            Desde
            <input type="date" value={from} onChange={(e) => table.update({ from: e.target.value })}
              className="h-11 rounded-[var(--aula-radius)] border border-[var(--aula-border-strong)] px-3 text-sm font-normal text-[var(--aula-text)]" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--aula-muted)]">
            Hasta
            <input type="date" value={to} onChange={(e) => table.update({ to: e.target.value })}
              className="h-11 rounded-[var(--aula-radius)] border border-[var(--aula-border-strong)] px-3 text-sm font-normal text-[var(--aula-text)]" />
          </label>
        </div>
        <DataTable
          caption="Acciones administrativas"
          columns={columns}
          rows={data?.items}
          loading={log.loading}
          error={log.error}
          onRetry={log.reload}
          empty={(
            <EmptyState icon={History} title={q || action || from || to ? 'Nada coincide con los filtros' : 'Aún no hay acciones registradas'}
              description={q || action || from || to ? 'Prueba con otro rango de fechas o quita algún filtro.' : 'Aquí quedará cada acción administrativa importante.'} />
          )}
        />
        {data && <Pagination page={data.page} pages={data.pages} total={data.total} pageSize={data.pageSize}
          onPage={(p) => table.update({ page: p }, { resetPage: false })} />}
      </Card>
      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.actionLabel} size="lg">
        {detail && <DiffView entry={detail} />}
      </Modal>
    </div>
  );
}

import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Building2, Copy, GraduationCap, Plus } from 'lucide-react';
import { fileUrl, get, post } from '../../api';
import { useAsync, useTableState } from '../../hooks';
import { COURSE_STATUS, fmtDate, plural } from '../../labels';
import { Badge, StatusBadge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Dialog';
import {
  checkForm, errorsFrom, isBlank, Select, TextInput, useFocusFirstError,
} from '../../ui/Form';
import { Card, PageHeader } from '../../ui/Page';
import { Alert, EmptyState } from '../../ui/States';
import { DataTable, FilterSelect, Pagination, SearchInput } from '../../ui/Table';
import { useToast } from '../../ui/Toast';
import { ActionMenu } from '../../ui/Menu';
import { Segmented } from '../../ui/Tabs';
import { useCompanyOptions } from './forms';

export function CourseCover({ course, className = 'h-10 w-14' }) {
  return course.coverFileId
    ? <img src={fileUrl(course.coverFileId)} alt="" className={`${className} shrink-0 rounded-[var(--aula-radius-sm)] border border-[var(--aula-border)] object-cover`} />
    : (
      <span className={`${className} flex shrink-0 items-center justify-center rounded-[var(--aula-radius-sm)] text-[var(--aula-primary)]`}
        style={{ background: 'var(--aula-gradient-hero)' }}>
        <BookOpen className="h-4 w-4" aria-hidden="true" />
      </span>
    );
}

/** Crear un curso o duplicar uno existente (con destino propio o de empresa). */
export function CourseCreateModal({ open, onClose, source = null, defaultCompanyId = null }) {
  const navigate = useNavigate();
  const toast = useToast();
  const companies = useCompanyOptions();
  const [form, setForm] = useState({ title: '', kind: 'edvanta', companyId: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  useFocusFirstError(error, formRef);

  useLayoutEffect(() => {
    if (!open) return;
    setError(null);
    setBusy(false);
    setForm(source
      ? { title: `${source.title} (copia)`, kind: source.kind, companyId: source.companyId ? String(source.companyId) : '' }
      : { title: '', kind: defaultCompanyId ? 'empresa' : 'edvanta', companyId: defaultCompanyId ? String(defaultCompanyId) : '' });
  }, [open, source, defaultCompanyId]);

  const submit = async (e) => {
    e.preventDefault();
    const problems = checkForm([
      ['title', isBlank(form.title), 'Escribe el título del curso.'],
      ['companyId', form.kind === 'empresa' && !form.companyId, 'Elige la empresa de esta capacitación.'],
    ]);
    if (problems) { setError(problems); return; }
    setBusy(true);
    setError(null);
    const body = { title: form.title.trim(), kind: form.kind, companyId: form.kind === 'empresa' ? Number(form.companyId) : null };
    try {
      const course = source
        ? await post(`/admin/courses/${source.id}/duplicate`, body)
        : await post('/admin/courses', body);
      toast.success(source ? `Copia creada: «${course.title}». Está en borrador.` : `Curso «${course.title}» creado. Agrega su primer módulo.`);
      onClose();
      navigate(`/aula/admin/cursos/${course.id}`);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  const { fields, general } = errorsFrom(error, ['title', 'companyId', 'kind']);
  const activeCompanies = (companies.data || []).filter((c) => c.status !== 'inactiva');
  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onClose}
      dismissable={!busy}
      title={source ? `Duplicar «${source.title}»` : 'Nuevo curso'}
      description={source
        ? 'Se copian módulos, clases, bloques y recursos. La copia queda en borrador, sin participantes ni versiones.'
        : 'Empieza con el título; el resto de los datos se completa en el editor.'}
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancelar</Button>
          <Button type="submit" form="aula-course-form" loading={busy} icon={source ? Copy : Plus}>{source ? 'Crear copia' : 'Crear curso'}</Button>
        </>
      )}
    >
      <form ref={formRef} id="aula-course-form" onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {general && <Alert tone="danger">{general}</Alert>}
        <TextInput label="Título" required value={form.title} maxLength={160} error={fields.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} data-autofocus />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Tipo de curso</span>
          <Segmented label="Tipo de curso" value={form.kind} onChange={(kind) => setForm({ ...form, kind })}
            options={[{ value: 'edvanta', label: 'Curso propio de Edvanta', icon: GraduationCap }, { value: 'empresa', label: 'Capacitación privada', icon: Building2 }]} />
          <p className="text-xs text-[var(--aula-muted)]">
            {form.kind === 'empresa'
              ? 'Solo se puede asignar a personas y grupos de la empresa elegida.'
              : 'Se puede asignar a cualquier participante, grupo o empresa.'}
          </p>
        </div>
        {form.kind === 'empresa' && (
          <Select label="Empresa" required value={form.companyId} error={fields.companyId} placeholder="Elige una empresa"
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            options={activeCompanies.map((c) => ({ value: String(c.value), label: c.label }))} />
        )}
      </form>
    </Modal>
  );
}

export default function Cursos() {
  const table = useTableState({ sort: 'updatedAt', dir: 'desc' });
  const { state } = table;
  const list = useAsync(({ signal }) => get(`/admin/courses?${table.query()}`, { signal }), [table.key]);
  const companies = useCompanyOptions();
  const [creating, setCreating] = useState(false);
  const [duplicating, setDuplicating] = useState(null);
  const filtered = Boolean(state.q || state.status || state.kind || state.companyId);

  const columns = [
    { key: 'title', header: 'Curso', sortable: true, render: (c) => (
      <div className="flex min-w-0 items-center gap-3">
        <CourseCover course={c} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{c.title}</p>
          <p className="truncate text-xs text-[var(--aula-muted)]">
            {c.kind === 'empresa' ? `Privado · ${c.companyName}` : 'Curso propio de Edvanta'}
          </p>
        </div>
      </div>
    ) },
    { key: 'status', header: 'Estado', render: (c) => (
      <div className="flex flex-col items-start gap-1">
        <StatusBadge kind="course" status={c.status} />
        {c.versionNumber ? <span className="text-[11px] text-[var(--aula-muted)]">Versión {c.versionNumber}</span> : null}
      </div>
    ) },
    { key: 'content', header: 'Contenido', render: (c) => (
      <span className="text-sm text-[var(--aula-muted)]">{plural(c.modules, 'módulo')} · {plural(c.lessons, 'clase')}</span>
    ) },
    { key: 'enrollments', header: 'Participantes', sortable: true, align: 'right', render: (c) => (
      <span className="tabular-nums">
        {c.enrollments}
        {c.enrollments ? <span className="block text-[11px] text-[var(--aula-muted)]">{plural(c.completed, 'completado')}</span> : null}
      </span>
    ) },
    { key: 'updatedAt', header: 'Actualizado', sortable: true, render: (c) => fmtDate(c.updatedAt) },
    { key: 'actions', header: <span className="sr-only">Acciones</span>, align: 'right', render: (c) => (
      <ActionMenu label={`Acciones de ${c.title}`} items={[
        { label: 'Duplicar', icon: Copy, hint: 'También para otra empresa', onSelect: () => setDuplicating(c) },
      ]} />
    ) },
  ];

  return (
    <div>
      <PageHeader
        title="Cursos"
        description="Cursos propios de Edvanta y capacitaciones privadas para empresas. Los cambios llegan a los participantes al publicar."
        actions={<Button icon={Plus} onClick={() => setCreating(true)}>Nuevo curso</Button>}
      />
      <Card bodyClassName="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <SearchInput value={state.q} onChange={(q) => table.update({ q })} placeholder="Buscar por título, categoría o empresa" className="min-w-[240px] flex-1" />
          <FilterSelect label="Estado" value={state.status} onChange={(status) => table.update({ status })} allLabel="Activos"
            options={[...Object.entries(COURSE_STATUS).map(([value, s]) => ({ value, label: s.label })), { value: 'todos', label: 'Todos (incluye archivados)' }]} />
          <FilterSelect label="Tipo" value={state.kind} onChange={(kind) => table.update({ kind })}
            options={[{ value: 'edvanta', label: 'Propios de Edvanta' }, { value: 'empresa', label: 'Privados de empresa' }]} />
          <FilterSelect label="Empresa" value={state.companyId} onChange={(companyId) => table.update({ companyId })} allLabel="Todas"
            options={(companies.data || []).map((c) => ({ value: String(c.value), label: c.label }))} />
        </div>
        <DataTable
          caption="Cursos del aula"
          columns={columns}
          rows={list.data?.items}
          loading={list.loading}
          error={list.error}
          onRetry={list.reload}
          sort={state.sort}
          dir={state.dir}
          onSort={(sort, dir) => table.update({ sort, dir })}
          rowHref={(c) => `/aula/admin/cursos/${c.id}`}
          empty={(
            <EmptyState
              icon={BookOpen}
              title={filtered ? 'Ningún curso coincide' : 'Aún no hay cursos'}
              description={filtered ? 'Prueba con otros filtros.' : 'Crea el primero: empieza por el título y luego arma sus módulos y clases.'}
              action={filtered ? null : <Button icon={Plus} onClick={() => setCreating(true)}>Nuevo curso</Button>}
            />
          )}
        />
        {list.data && <Pagination {...list.data} onPage={(p) => table.update({ page: p }, { resetPage: false })} />}
      </Card>
      {list.data?.items?.some((c) => c.isDemo) && (
        <p className="mt-3 text-xs text-[var(--aula-muted)]"><Badge tone="accent">Demostrativo</Badge> Los cursos marcados así son de prueba y se pueden eliminar.</p>
      )}
      <CourseCreateModal open={creating} onClose={() => setCreating(false)} />
      <CourseCreateModal open={Boolean(duplicating)} source={duplicating} onClose={() => setDuplicating(null)} />
    </div>
  );
}

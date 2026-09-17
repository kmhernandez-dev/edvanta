import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive, Download, ExternalLink, FolderPlus, History, Library, Pencil, Plus, Replace, Rocket, Tag, Trash2, Undo2,
} from 'lucide-react';
import { api, fileUrl, get, patch, post, put } from '../../../api';
import { useAsync } from '../../../hooks';
import { fmtBytes, fmtDate, fmtDateTime } from '../../../labels';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import { ConfirmDialog, Modal } from '../../../ui/Dialog';
import { FileUploader } from '../../../ui/FileUploader';
import {
  Checkbox, checkForm, errorsFrom, isBlank, Select, TextArea, TextInput, Toggle, useFocusFirstError,
} from '../../../ui/Form';
import { ActionMenu } from '../../../ui/Menu';
import { Card } from '../../../ui/Page';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../../../ui/States';
import { DragHandle, SortableItem, SortableList } from '../../../ui/Sortable';
import { Segmented } from '../../../ui/Tabs';
import { useToast } from '../../../ui/Toast';
import { useCourse } from './CursoLayout';

const STATUS = {
  borrador: { label: 'Borrador', tone: 'neutral' },
  publicado: { label: 'Publicado', tone: 'success' },
  archivado: { label: 'Archivado', tone: 'neutral' },
};

const URL_RE = /^https?:\/\/\S+\.\S+/i;

function useDialogForm(initial, open) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  useFocusFirstError(error, ref);
  useLayoutEffect(() => {
    if (open) { setForm(initial); setBusy(false); setError(null); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const run = async (fn, problems) => {
    if (problems) { setError(problems); return; }
    setBusy(true);
    setError(null);
    try { await fn(); } catch (err) { setError(err); setBusy(false); }
  };
  return { form, setForm, busy, error, ref, run };
}

function SourceFields({ form, setForm, fields, label = 'Archivo' }) {
  return (
    <>
      <Segmented label="Origen" value={form.source} onChange={(source) => setForm({ ...form, source })}
        options={[{ value: 'archivo', label: 'Subir archivo' }, { value: 'enlace', label: 'Enlace web' }]} />
      {form.source === 'archivo' ? (
        <div className="flex flex-col gap-1">
          <FileUploader label={label} purpose="recurso" value={form.file} onChange={(file) => setForm({ ...form, file })} />
          {fields.fileId && <p role="alert" className="text-xs font-medium text-[var(--aula-danger)]">{fields.fileId}</p>}
        </div>
      ) : (
        <TextInput label="Dirección" required inputMode="url" placeholder="https://" value={form.url} error={fields.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })} />
      )}
    </>
  );
}

function ResourceModal({ open, onClose, resource, categories, onSave }) {
  const initial = {
    title: resource?.title || '',
    description: resource?.description || '',
    categoryId: resource?.categoryId ? String(resource.categoryId) : '',
    allowDownload: resource?.allowDownload ?? true,
    source: 'archivo',
    file: null,
    url: '',
  };
  const f = useDialogForm(initial, open);
  const { form, setForm } = f;
  const submit = (e) => {
    e.preventDefault();
    const problems = checkForm([
      ['title', isBlank(form.title), 'Escribe el título del recurso.'],
      ['fileId', !resource && form.source === 'archivo' && !form.file, 'Sube el archivo.'],
      ['url', !resource && form.source === 'enlace' && !URL_RE.test(form.url), 'Escribe una dirección completa (https://…).'],
    ]);
    f.run(async () => {
      const body = {
        title: form.title.trim(),
        description: form.description,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        allowDownload: form.allowDownload,
      };
      if (!resource) {
        if (form.source === 'archivo') body.fileId = form.file.id;
        else body.url = form.url.trim();
      }
      await onSave(body);
      onClose();
    }, problems);
  };
  const { fields, general } = errorsFrom(f.error, ['title', 'description', 'categoryId', 'fileId', 'url']);
  return (
    <Modal open={open} onClose={f.busy ? undefined : onClose} dismissable={!f.busy} title={resource ? 'Editar recurso' : 'Nuevo recurso'}
      description={resource ? 'Para cambiar el archivo, usa «Reemplazar»: así queda el historial.' : 'Se crea como borrador; publícalo cuando esté listo.'}
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={f.busy}>Cancelar</Button>
          <Button type="submit" form="aula-resource-form" loading={f.busy}>{resource ? 'Guardar' : 'Crear recurso'}</Button>
        </>
      )}>
      <form ref={f.ref} id="aula-resource-form" onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {general && <Alert tone="danger">{general}</Alert>}
        <TextInput label="Título" required maxLength={160} value={form.title} error={fields.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} data-autofocus />
        <TextArea label="Descripción (opcional)" rows={2} maxLength={1000} value={form.description} error={fields.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} hint="Para qué sirve y cuándo usarlo." />
        <Select label="Categoría" value={form.categoryId} placeholder="Sin categoría" error={fields.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          options={categories.map((c) => ({ value: String(c.id), label: c.name }))} />
        {!resource && <SourceFields form={form} setForm={setForm} fields={fields} />}
        <Toggle label="Permitir descarga" description="Si está apagado, el participante solo puede verlo en el aula."
          checked={form.allowDownload} onChange={(allowDownload) => setForm({ ...form, allowDownload })} />
      </form>
    </Modal>
  );
}

function VersionModal({ open, onClose, resource, onSave }) {
  const f = useDialogForm({ source: resource?.current?.url ? 'enlace' : 'archivo', file: null, url: '', notes: '', notify: false }, open);
  const { form, setForm } = f;
  const submit = (e) => {
    e.preventDefault();
    const problems = checkForm([
      ['fileId', form.source === 'archivo' && !form.file, 'Sube el archivo nuevo.'],
      ['url', form.source === 'enlace' && !URL_RE.test(form.url), 'Escribe una dirección completa (https://…).'],
      ['notes', form.notes.trim().length < 5, 'Cuenta qué cambió (mínimo 5 caracteres).'],
    ]);
    f.run(async () => {
      await onSave({
        ...(form.source === 'archivo' ? { fileId: form.file.id } : { url: form.url.trim() }),
        notes: form.notes.trim(),
        notify: form.notify,
      });
      onClose();
    }, problems);
  };
  const { fields, general } = errorsFrom(f.error, ['fileId', 'url', 'notes']);
  return (
    <Modal open={open} onClose={f.busy ? undefined : onClose} dismissable={!f.busy} title={`Reemplazar «${resource?.title || ''}»`}
      description={`Se crea la versión ${(resource?.current?.number || 0) + 1}. La actual (v${resource?.current?.number || 1}) queda en el historial y los participantes pasan a ver la nueva.`}
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={f.busy}>Cancelar</Button>
          <Button type="submit" form="aula-version-form" icon={Replace} loading={f.busy}>Crear versión nueva</Button>
        </>
      )}>
      <form ref={f.ref} id="aula-version-form" onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {general && <Alert tone="danger">{general}</Alert>}
        <SourceFields form={form} setForm={setForm} fields={fields} label="Archivo nuevo" />
        <TextArea label="Qué cambió" required rows={3} maxLength={500} value={form.notes} error={fields.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          hint="Por ejemplo: «Se actualizó la tabla según la nueva ficha técnica»." />
        {resource?.status === 'publicado' && (
          <Checkbox label="Avisar a los participantes del curso" description="Reciben una notificación en el aula."
            checked={form.notify} onChange={(e) => setForm({ ...form, notify: e.target.checked })} />
        )}
      </form>
    </Modal>
  );
}

function HistoryModal({ resource, onClose }) {
  const versions = useAsync(({ signal }) => get(`/admin/resources/${resource.id}/versions`, { signal }), [resource.id]);
  return (
    <Modal open onClose={onClose} title={`Historial de «${resource.title}»`} size="lg">
      {versions.loading && <LoadingBlock rows={2} />}
      {versions.error && <ErrorState error={versions.error} onRetry={versions.reload} />}
      {versions.data && (
        <ol className="flex flex-col gap-3">
          {versions.data.map((v) => (
            <li key={v.id} className="rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">Versión {v.number}</span>
                {v.current && <Badge tone="success">Vigente</Badge>}
                <span className="text-xs text-[var(--aula-muted)]">{fmtDateTime(v.createdAt)}{v.createdBy ? ` · ${v.createdBy}` : ''}</span>
              </div>
              <p className="mt-1 text-sm">{v.notes}</p>
              <p className="mt-1 text-xs text-[var(--aula-muted)]">
                {v.file ? (
                  <a href={fileUrl(v.fileId, { download: true })} className="inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] hover:underline">
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />{v.file.name} ({fmtBytes(v.file.size)})
                  </a>
                ) : (
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[var(--aula-primary)] hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />{v.url}
                  </a>
                )}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Modal>
  );
}

function CategoryModal({ open, onClose, category, onSave }) {
  const f = useDialogForm({ name: category?.name || '' }, open);
  const submit = (e) => {
    e.preventDefault();
    f.run(async () => { await onSave({ name: f.form.name.trim() }); onClose(); },
      checkForm([['name', isBlank(f.form.name), 'Escribe el nombre de la categoría.']]));
  };
  const { fields, general } = errorsFrom(f.error, ['name']);
  return (
    <Modal open={open} onClose={f.busy ? undefined : onClose} dismissable={!f.busy} size="sm" title={category ? 'Renombrar categoría' : 'Nueva categoría'}
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={f.busy}>Cancelar</Button>
          <Button type="submit" form="aula-category-form" loading={f.busy}>Guardar</Button>
        </>
      )}>
      <form ref={f.ref} id="aula-category-form" onSubmit={submit} noValidate className="flex flex-col gap-3">
        {general && <Alert tone="danger">{general}</Alert>}
        <TextInput label="Nombre" required maxLength={80} value={f.form.name} error={fields.name}
          onChange={(e) => f.setForm({ name: e.target.value })} data-autofocus placeholder="Ej.: Formatos de visita" />
      </form>
    </Modal>
  );
}

export default function Recursos() {
  const { course } = useCourse();
  const toast = useToast();
  const data = useAsync(({ signal }) => get(`/admin/courses/${course.id}/resources`, { signal }), [course.id]);
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(null);

  useEffect(() => { if (data.data) setItems(data.data.resources); }, [data.data]);

  if (data.loading && !data.data) return <LoadingBlock rows={3} label="Cargando recursos" />;
  if (data.error) return <ErrorState error={data.error} onRetry={data.reload} />;
  const { categories, enabled } = data.data;

  const act = async (fn, message) => {
    try { await fn(); data.reload(); if (message) toast.success(message); } catch (err) { toast.error(err.message); }
  };
  const reorder = async (next) => {
    setItems(next);
    try { await put(`/admin/courses/${course.id}/resources/order`, { ids: next.map((r) => r.id) }); } catch (err) { toast.error(err.message); data.reload(); }
  };

  return (
    <div className="flex flex-col gap-5">
      {!enabled && (
        <Alert tone="info" action={<Button size="sm" variant="secondary" to={`/aula/admin/cursos/${course.id}/reglas`}>Activar</Button>}>
          La biblioteca está oculta para los participantes. Puedes prepararla y activarla en «Reglas y fechas».
        </Alert>
      )}

      <Card
        title="Categorías"
        description="Agrupan los recursos en la biblioteca del participante."
        actions={<Button size="sm" variant="secondary" icon={FolderPlus} onClick={() => setDialog({ kind: 'category' })}>Nueva categoría</Button>}
      >
        {categories.length ? (
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.id} className="inline-flex items-center gap-1 rounded-full border border-[var(--aula-border)] py-1 pl-3 pr-1 text-sm">
                <Tag className="h-3.5 w-3.5 text-[var(--aula-muted)]" aria-hidden="true" />
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-[var(--aula-muted)]">({c.resources})</span>
                <ActionMenu size="sm" label={`Acciones de la categoría ${c.name}`} items={[
                  { label: 'Renombrar', icon: Pencil, onSelect: () => setDialog({ kind: 'category', item: c }) },
                  { label: 'Eliminar', icon: Trash2, tone: 'danger', hint: 'Sus recursos quedan sin categoría', onSelect: () => setDialog({ kind: 'delete-category', item: c }) },
                ]} />
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-[var(--aula-muted)]">Sin categorías todavía.</p>}
      </Card>

      <Card
        title="Recursos"
        description="Guías, formatos y fichas de consulta. Reemplazar un archivo crea una versión nueva y conserva la anterior."
        actions={<Button size="sm" icon={Plus} onClick={() => setDialog({ kind: 'resource' })}>Nuevo recurso</Button>}
        bodyClassName="p-0"
      >
        {items.length ? (
          <SortableList items={items} itemLabel={(r) => `el recurso «${r?.title}»`} onReorder={reorder}>
            <ol className="divide-y divide-[var(--aula-border)]">
              {items.map((r) => (
                <SortableItem key={r.id} id={r.id} className="flex items-start gap-2 bg-white px-3 py-3 sm:px-4">
                  <DragHandle label={`Mover el recurso «${r.title}»`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{r.title}</p>
                      <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>
                      {r.categoryName && <Badge tone="accent">{r.categoryName}</Badge>}
                      {!r.allowDownload && <Badge>Solo lectura</Badge>}
                    </div>
                    {r.description && <p className="mt-0.5 text-sm text-[var(--aula-muted)]">{r.description}</p>}
                    {r.current && (
                      <p className="mt-1 text-xs text-[var(--aula-muted)]">
                        Versión {r.current.number} · {fmtDate(r.current.createdAt)} ·{' '}
                        {r.current.file
                          ? <a className="font-medium text-[var(--aula-primary)] hover:underline" href={fileUrl(r.current.fileId)} target="_blank" rel="noopener">{r.current.file.name} ({fmtBytes(r.current.file.size)})</a>
                          : <a className="font-medium text-[var(--aula-primary)] hover:underline" href={r.current.url} target="_blank" rel="noopener noreferrer">{r.current.url}</a>}
                      </p>
                    )}
                  </div>
                  <ActionMenu label={`Acciones del recurso «${r.title}»`} items={[
                    r.status !== 'publicado'
                      ? { label: 'Publicar', icon: Rocket, hint: 'Lo ven los participantes', onSelect: () => act(() => post(`/admin/resources/${r.id}/status`, { status: 'publicado' }), 'Recurso publicado.') }
                      : { label: 'Archivar', icon: Archive, hint: 'Deja de verse; el historial se conserva', onSelect: () => act(() => post(`/admin/resources/${r.id}/status`, { status: 'archivado' }), 'Recurso archivado.') },
                    r.status === 'archivado' && { label: 'Volver a borrador', icon: Undo2, onSelect: () => act(() => post(`/admin/resources/${r.id}/status`, { status: 'borrador' }), 'Recurso en borrador.') },
                    { label: 'Reemplazar archivo o enlace', icon: Replace, onSelect: () => setDialog({ kind: 'version', item: r }) },
                    { label: 'Editar datos', icon: Pencil, onSelect: () => setDialog({ kind: 'resource', item: r }) },
                    { label: 'Historial de versiones', icon: History, onSelect: () => setDialog({ kind: 'history', item: r }) },
                    'separator',
                    { label: 'Eliminar', icon: Trash2, tone: 'danger', disabled: r.status === 'publicado', hint: r.status === 'publicado' ? 'Archívalo primero' : undefined, onSelect: () => setDialog({ kind: 'delete-resource', item: r }) },
                  ].filter(Boolean)} />
                </SortableItem>
              ))}
            </ol>
          </SortableList>
        ) : (
          <div className="p-5">
            <EmptyState icon={Library} title="Aún no hay recursos"
              description="Sube documentos de consulta, formatos o enlaces útiles para el trabajo diario. No se generan textos automáticamente: el contenido lo carga tu equipo."
              action={<Button icon={Plus} onClick={() => setDialog({ kind: 'resource' })}>Nuevo recurso</Button>} />
          </div>
        )}
      </Card>

      <p className="text-xs text-[var(--aula-muted)]">
        Los participantes ven la biblioteca dentro del curso. <Link className="underline" to={`/aula/admin/cursos/${course.id}/vista-previa`}>Ver la vista previa</Link>.
      </p>

      <ResourceModal
        open={dialog?.kind === 'resource'}
        resource={dialog?.item}
        categories={categories}
        onClose={() => setDialog(null)}
        onSave={async (body) => {
          if (dialog.item) await patch(`/admin/resources/${dialog.item.id}`, body);
          else await post(`/admin/courses/${course.id}/resources`, body);
          data.reload();
          toast.success(dialog.item ? 'Recurso actualizado.' : 'Recurso creado como borrador.');
        }}
      />
      <VersionModal
        open={dialog?.kind === 'version'}
        resource={dialog?.item}
        onClose={() => setDialog(null)}
        onSave={async (body) => {
          const res = await post(`/admin/resources/${dialog.item.id}/versions`, body);
          data.reload();
          toast.success(`Versión ${res.resource.current.number} vigente.${res.notified ? ` Avisamos a ${res.notified} ${res.notified === 1 ? 'participante' : 'participantes'}.` : ''}`);
        }}
      />
      {dialog?.kind === 'history' && <HistoryModal resource={dialog.item} onClose={() => setDialog(null)} />}
      <CategoryModal
        open={dialog?.kind === 'category'}
        category={dialog?.item}
        onClose={() => setDialog(null)}
        onSave={async (body) => {
          if (dialog.item) await patch(`/admin/resource-categories/${dialog.item.id}`, body);
          else await post(`/admin/courses/${course.id}/resource-categories`, body);
          data.reload();
          toast.success('Categoría guardada.');
        }}
      />
      <ConfirmDialog
        open={dialog?.kind === 'delete-category'}
        onClose={() => setDialog(null)}
        tone="danger"
        title={`¿Eliminar la categoría «${dialog?.item?.name}»?`}
        description="Sus recursos no se borran: quedan sin categoría."
        confirmLabel="Eliminar categoría"
        onConfirm={async () => {
          await api(`/admin/resource-categories/${dialog.item.id}`, { method: 'DELETE' });
          data.reload();
          toast.success('Categoría eliminada.');
        }}
      />
      <ConfirmDialog
        open={dialog?.kind === 'delete-resource'}
        onClose={() => setDialog(null)}
        tone="danger"
        title={`¿Eliminar «${dialog?.item?.title}»?`}
        description="Deja de aparecer en la administración. Su historial de versiones queda en la bitácora."
        confirmLabel="Eliminar recurso"
        onConfirm={async () => {
          await api(`/admin/resources/${dialog.item.id}`, { method: 'DELETE' });
          data.reload();
          toast.success('Recurso eliminado.');
        }}
      />
    </div>
  );
}

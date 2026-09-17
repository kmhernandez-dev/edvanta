import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Copy, Download, Eye, EyeOff, Pencil, Plus, Settings2, Trash2,
} from 'lucide-react';
import { api, get, patch, post, put } from '../../../api';
import { useAsync } from '../../../hooks';
import { fmtBytes, fmtMinutes } from '../../../labels';
import { Badge } from '../../../ui/Badge';
import { Button, IconButton } from '../../../ui/Button';
import { ConfirmDialog, Modal } from '../../../ui/Dialog';
import { ActionMenu } from '../../../ui/Menu';
import { Alert, ErrorState, LoadingBlock } from '../../../ui/States';
import { DragHandle, moveBy, SortableItem, SortableList } from '../../../ui/Sortable';
import { useToast } from '../../../ui/Toast';
import { BlockView } from '../../../blocks/BlockView';
import { BlockForm, validateBlock } from '../../../blocks/BlockForm';
import { BLOCK_META, emptyBlockData } from '../../../blocks/meta';
import { LessonModal } from './Contenido';
import { useCourse } from './CursoLayout';

// Bloques pesados (visores y reproductores) se muestran bajo demanda en el editor.
const HEAVY = new Set(['pdf', 'presentacion', 'video', 'audio']);
let draftSeq = 0;

function BlockPicker({ open, onClose, types, onPick }) {
  return (
    <Modal open={open} onClose={onClose} title="Agregar bloque" description="Elige qué tipo de contenido quieres agregar." size="lg">
      <ul className="grid gap-2 sm:grid-cols-2">
        {types.map((t) => {
          const meta = BLOCK_META[t.type];
          if (!meta) return null;
          const Icon = meta.icon;
          return (
            <li key={t.type}>
              <button type="button" onClick={() => onPick(t.type)}
                className="flex w-full items-start gap-3 rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3 text-left transition-colors hover:border-[var(--aula-primary)] hover:bg-[var(--aula-primary-soft)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--aula-radius-sm)] bg-[var(--aula-primary-soft)] text-[var(--aula-primary)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{meta.label}</span>
                  <span className="block text-xs text-[var(--aula-muted)]">{meta.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}

function fieldErrors(err) {
  if (!err) return { fields: {}, general: null };
  if (err.fields) return { fields: err.fields, general: null };
  if (err.field) return { fields: { [err.field]: err.message }, general: null };
  return { fields: {}, general: err.message };
}

function BlockCard({
  block, index, total, files, onFile, onSaved, onCancelDraft, onDelete, onDuplicate, onShift, onInsertAfter, onDirty, readOnly,
}) {
  const isDraft = block.draft;
  const [editing, setEditing] = useState(isDraft);
  const [data, setData] = useState(block.data);
  const [allowDownload, setAllowDownload] = useState(block.allowDownload);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [showHeavy, setShowHeavy] = useState(false);
  const cardRef = useRef(null);
  const meta = BLOCK_META[block.type] || { label: block.type };
  const Icon = meta.icon;
  const dirty = editing && (isDraft || JSON.stringify(data) !== JSON.stringify(block.data) || allowDownload !== block.allowDownload);

  useEffect(() => { onDirty(block.key, dirty); }, [block.key, dirty, onDirty]);
  useEffect(() => () => onDirty(block.key, false), [block.key, onDirty]);
  useEffect(() => {
    if (editing) cardRef.current?.querySelector('input, textarea, [contenteditable="true"], select')?.focus();
  }, [editing]);
  useEffect(() => {
    if (!error) return;
    cardRef.current?.querySelector('[aria-invalid="true"], [role="alert"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [error]);

  const startEdit = () => { setData(block.data); setAllowDownload(block.allowDownload); setError(null); setEditing(true); };
  const cancel = () => {
    if (isDraft) { onCancelDraft(block.key); return; }
    setEditing(false);
    setError(null);
  };
  const save = async () => {
    const problems = validateBlock(block.type, data);
    if (Object.keys(problems).length) { setError({ fields: problems }); return; }
    setBusy(true);
    setError(null);
    try {
      await onSaved(block, { data, allowDownload });
      if (!isDraft) setEditing(false);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const { fields, general } = fieldErrors(error);
  const fileNames = HEAVY.has(block.type) && block.data?.fileId ? files[block.data.fileId] : null;

  return (
    <div ref={cardRef} className={`rounded-[var(--aula-radius-lg)] border bg-[var(--aula-surface)] ${editing ? 'border-[var(--aula-primary)] shadow-[var(--aula-shadow)]' : 'border-[var(--aula-border)]'}`}>
      <div className="flex items-center gap-2 border-b border-[var(--aula-border)] px-3 py-2">
        {!isDraft && !readOnly && <DragHandle label={`Mover el bloque ${index + 1} (${meta.label})`} />}
        {Icon && <Icon className="h-4 w-4 shrink-0 text-[var(--aula-primary)]" aria-hidden="true" />}
        <p className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold">{meta.label}</span>
          {!editing && block.summary && <span className="text-[var(--aula-muted)]"> · {block.summary}</span>}
          {isDraft && <span className="text-[var(--aula-muted)]"> · nuevo, sin guardar</span>}
        </p>
        {!editing && block.allowDownload && block.type !== 'archivos' && (
          <Badge tone="info"><Download className="mr-1 h-3 w-3" aria-hidden="true" />Descargable</Badge>
        )}
        {!editing && !readOnly && (
          <>
            <IconButton icon={Pencil} size="sm" label={`Editar el bloque ${index + 1}`} onClick={startEdit} />
            <ActionMenu size="sm" label={`Acciones del bloque ${index + 1}`} items={[
              { label: 'Agregar bloque debajo', icon: Plus, onSelect: () => onInsertAfter(block) },
              { label: 'Duplicar', icon: Copy, onSelect: () => onDuplicate(block) },
              { label: 'Subir', icon: ArrowUp, disabled: index === 0, onSelect: () => onShift(block, -1) },
              { label: 'Bajar', icon: ArrowDown, disabled: index === total - 1, onSelect: () => onShift(block, 1) },
              'separator',
              { label: 'Eliminar', icon: Trash2, tone: 'danger', onSelect: () => onDelete(block) },
            ]} />
          </>
        )}
      </div>

      <div className="p-4">
        {editing ? (
          <div className="flex flex-col gap-4">
            {general && <Alert tone="danger">{general}</Alert>}
            <BlockForm
              type={block.type}
              value={data}
              onChange={setData}
              errors={fields}
              files={files}
              onFile={onFile}
              allowDownload={allowDownload}
              onAllowDownload={setAllowDownload}
            />
            <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--aula-border)] pt-3">
              <Button variant="ghost" onClick={cancel} disabled={busy}>{isDraft ? 'Descartar' : 'Cancelar'}</Button>
              <Button onClick={save} loading={busy} loadingLabel="Guardando…">Guardar bloque</Button>
            </div>
          </div>
        ) : HEAVY.has(block.type) && !showHeavy ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--aula-muted)]">
              {block.data.source === 'enlace'
                ? `${block.data.provider === 'youtube' ? 'YouTube' : block.data.provider === 'vimeo' ? 'Vimeo' : block.data.provider === 'google' ? 'Google Slides' : 'Canva'} · ${block.data.url}`
                : fileNames ? `${fileNames.name} · ${fmtBytes(fileNames.size)}` : 'Archivo'}
            </p>
            <Button size="sm" variant="secondary" icon={Eye} onClick={() => setShowHeavy(true)}>Mostrar</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <BlockView block={block} files={files} />
            {HEAVY.has(block.type) && (
              <Button size="sm" variant="ghost" icon={EyeOff} className="self-end" onClick={() => setShowHeavy(false)}>Ocultar</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InsertButton({ onClick, label }) {
  return (
    <div className="group relative flex h-6 items-center justify-center">
      <span className="absolute inset-x-0 top-1/2 h-px bg-[var(--aula-border)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100" aria-hidden="true" />
      <button type="button" onClick={onClick} aria-label={label} title={label}
        className="relative inline-flex h-6 items-center gap-1 rounded-full border border-[var(--aula-border)] bg-white px-2 text-[11px] font-semibold text-[var(--aula-muted)] opacity-60 transition hover:border-[var(--aula-primary)] hover:text-[var(--aula-primary)] hover:opacity-100 focus-visible:opacity-100">
        <Plus className="h-3 w-3" aria-hidden="true" /> Bloque
      </button>
    </div>
  );
}

export default function ClaseEditor() {
  const { lessonId } = useParams();
  const { course, reload: reloadCourse } = useCourse();
  const toast = useToast();
  const lesson = useAsync(({ signal }) => get(`/admin/lessons/${lessonId}`, { signal }), [lessonId]);
  const [blocks, setBlocks] = useState([]);
  const [files, setFiles] = useState({});
  const [picker, setPicker] = useState(null);
  const [settings, setSettings] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const dirtyRef = useRef(new Set());
  const [dirtyCount, setDirtyCount] = useState(0);
  const readOnly = course.status === 'archivado';

  useEffect(() => {
    if (!lesson.data) return;
    setBlocks(lesson.data.blocks.map((b) => ({ ...b, key: `b${b.id}` })));
    setFiles(lesson.data.files || {});
  }, [lesson.data]);

  const onDirty = useCallback((key, dirty) => {
    const set = dirtyRef.current;
    const had = set.has(key);
    if (dirty && !had) set.add(key);
    if (!dirty && had) set.delete(key);
    if (had !== dirty) setDirtyCount(set.size);
  }, []);

  // Aviso al salir con bloques sin guardar.
  useEffect(() => {
    if (!dirtyCount) return undefined;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirtyCount]);

  const onFile = useCallback((f) => {
    setFiles((m) => ({ ...m, [f.id]: { name: f.name, size: f.size, extension: f.extension, mime: f.mime } }));
  }, []);

  const persisted = useMemo(() => blocks.filter((b) => !b.draft), [blocks]);

  const addDraft = (type, afterKey) => {
    draftSeq += 1;
    const draft = { key: `d${draftSeq}`, draft: true, type, data: emptyBlockData(type), allowDownload: false, afterKey };
    setBlocks((list) => {
      if (afterKey === 'inicio') return [draft, ...list];
      if (!afterKey) return [...list, draft];
      const i = list.findIndex((b) => b.key === afterKey);
      return [...list.slice(0, i + 1), draft, ...list.slice(i + 1)];
    });
    setPicker(null);
  };

  const saveBlock = async (block, { data, allowDownload }) => {
    if (block.draft) {
      // Se guarda justo después del bloque ya guardado que tenga encima.
      const index = blocks.findIndex((b) => b.key === block.key);
      const above = blocks.slice(0, index).reverse().find((b) => !b.draft);
      const res = await post(`/admin/lessons/${lessonId}/blocks`, {
        type: block.type, data, allowDownload,
        ...(above ? { afterBlockId: above.id } : { position: 'inicio' }),
      });
      setFiles((m) => ({ ...m, ...res.files }));
      setBlocks((list) => list.map((b) => (b.key === block.key ? { ...res.block, key: `b${res.block.id}` } : b)));
      toast.success(`Bloque «${BLOCK_META[block.type]?.label}» agregado.`);
    } else {
      const res = await patch(`/admin/blocks/${block.id}`, { data, allowDownload });
      setFiles((m) => ({ ...m, ...res.files }));
      setBlocks((list) => list.map((b) => (b.key === block.key ? { ...res.block, key: b.key } : b)));
      toast.success('Bloque guardado.');
    }
    reloadCourse();
  };

  const reorder = async (nextPersisted) => {
    // Los borradores se quedan donde están; solo cambia el orden de los guardados.
    let i = 0;
    const next = blocks.map((b) => (b.draft ? b : nextPersisted[i++]));
    setBlocks(next);
    try {
      await put(`/admin/lessons/${lessonId}/blocks/order`, { ids: nextPersisted.map((b) => b.id) });
      reloadCourse();
    } catch (err) {
      toast.error(err.message);
      lesson.reload();
    }
  };

  const duplicate = async (block) => {
    try {
      const res = await post(`/admin/blocks/${block.id}/duplicate`, {});
      setFiles((m) => ({ ...m, ...res.files }));
      setBlocks((list) => {
        const i = list.findIndex((b) => b.key === block.key);
        return [...list.slice(0, i + 1), { ...res.block, key: `b${res.block.id}` }, ...list.slice(i + 1)];
      });
      reloadCourse();
      toast.success('Bloque duplicado.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (lesson.loading && !lesson.data) return <LoadingBlock rows={4} label="Cargando la clase" />;
  if (lesson.error) return <ErrorState error={lesson.error} onRetry={lesson.reload} />;
  const l = lesson.data;
  const base = `/aula/admin/cursos/${course.id}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-[var(--aula-surface)] p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-[var(--aula-muted)]">
            <Link to={base} className="font-semibold hover:text-[var(--aula-primary)] hover:underline">Contenido</Link>
            {' · '}{l.moduleTitle} · Clase {l.position} de {l.totalLessons}
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--aula-primary)]">{l.title}</h2>
          {l.subtitle && <p className="text-sm text-[var(--aula-muted)]">{l.subtitle}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone={l.isRequired ? 'info' : 'neutral'}>{l.isRequired ? 'Obligatoria' : 'Opcional'}</Badge>
            <Badge>{l.completionRule === 'video' ? `Se completa al ver el ${course.videoCompletionPct} % del video` : 'La persona la marca como completada'}</Badge>
            {l.minSeconds > 0 && <Badge>Tiempo mínimo: {fmtMinutes(Math.round(l.minSeconds / 60))}</Badge>}
            {l.durationMinutes ? <Badge>Duración: {fmtMinutes(l.durationMinutes)}</Badge> : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {!readOnly && <Button size="sm" variant="secondary" icon={Settings2} onClick={() => setSettings(true)}>Datos de la clase</Button>}
          <Button size="sm" variant="secondary" icon={Eye} to={`${base}/vista-previa/${l.id}`}>Vista previa</Button>
        </div>
      </div>

      {dirtyCount > 0 && (
        <Alert tone="warning">
          {dirtyCount === 1 ? 'Hay un bloque con cambios sin guardar.' : `Hay ${dirtyCount} bloques con cambios sin guardar.`} Usa «Guardar bloque» en cada uno.
        </Alert>
      )}

      {!readOnly && <InsertButton label="Agregar un bloque al inicio" onClick={() => setPicker({ afterKey: 'inicio' })} />}

      {blocks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--aula-radius-lg)] border border-dashed border-[var(--aula-border-strong)] bg-[var(--aula-surface)] px-6 py-12 text-center">
          <p className="text-base font-bold">Esta clase está vacía</p>
          <p className="max-w-md text-sm text-[var(--aula-muted)]">Agrega bloques de texto, video, PDF, imágenes, archivos y más. Se muestran en el orden en que los pongas.</p>
          {!readOnly && <Button icon={Plus} onClick={() => setPicker({ afterKey: null })}>Agregar el primer bloque</Button>}
        </div>
      ) : (
        <SortableList items={persisted.map((b) => ({ ...b, id: b.id }))} itemLabel={(b) => `el bloque ${BLOCK_META[b?.type]?.label || ''}`}
          onReorder={reorder} disabled={readOnly || dirtyCount > 0}>
          <ol className="flex flex-col">
            {blocks.map((b) => {
              const index = persisted.findIndex((p) => p.key === b.key);
              const card = (
                <BlockCard
                  block={b}
                  index={b.draft ? blocks.findIndex((x) => x.key === b.key) : index}
                  total={persisted.length}
                  files={files}
                  onFile={onFile}
                  onSaved={saveBlock}
                  onCancelDraft={(key) => setBlocks((list) => list.filter((x) => x.key !== key))}
                  onDelete={setDeleting}
                  onDuplicate={duplicate}
                  onShift={(block, delta) => { const next = moveBy(persisted, block.id, delta); if (next) reorder(next); }}
                  onInsertAfter={(block) => setPicker({ afterKey: block.key })}
                  onDirty={onDirty}
                  readOnly={readOnly}
                />
              );
              return b.draft ? (
                <li key={b.key} className="py-1">{card}</li>
              ) : (
                <SortableItem key={b.key} id={b.id} className="py-1">
                  {card}
                  {!readOnly && <InsertButton label={`Agregar un bloque después del bloque ${index + 1}`} onClick={() => setPicker({ afterKey: b.key })} />}
                </SortableItem>
              );
            })}
          </ol>
        </SortableList>
      )}

      <nav aria-label="Otras clases" className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--aula-border)] pt-4">
        {l.previous
          ? <Button variant="ghost" icon={ChevronLeft} to={`${base}/clases/${l.previous.id}`}>{l.previous.title}</Button>
          : <span />}
        {l.next && <Button variant="ghost" iconRight={ChevronRight} to={`${base}/clases/${l.next.id}`}>{l.next.title}</Button>}
      </nav>

      <BlockPicker open={Boolean(picker)} onClose={() => setPicker(null)} types={l.blockTypes} onPick={(type) => addDraft(type, picker?.afterKey)} />
      <LessonModal
        open={settings}
        lesson={l}
        videoCompletionPct={course.videoCompletionPct}
        onClose={() => setSettings(false)}
        onSave={async (body) => {
          await patch(`/admin/lessons/${l.id}`, body);
          lesson.reload();
          reloadCourse();
          toast.success('Datos de la clase guardados.');
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        tone="danger"
        title={`¿Eliminar este bloque (${BLOCK_META[deleting?.type]?.label || ''})?`}
        description={course.version
          ? 'Si la clase ya está publicada, los participantes lo seguirán viendo hasta que publiques los cambios. Las versiones anteriores no cambian.'
          : 'El curso aún no se ha publicado.'}
        confirmLabel="Eliminar bloque"
        onConfirm={async () => {
          await api(`/admin/blocks/${deleting.id}`, { method: 'DELETE' });
          setBlocks((list) => list.filter((b) => b.key !== deleting.key));
          reloadCourse();
          toast.success('Bloque eliminado.');
        }}
      />
    </div>
  );
}

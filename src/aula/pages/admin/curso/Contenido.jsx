import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDown, ArrowUp, Copy, FolderInput, Layers, Pencil, PlayCircle, Plus, Settings2, Timer, Trash2,
} from 'lucide-react';
import { api, get, patch, post, put } from '../../../api';
import { fmtMinutes, plural } from '../../../labels';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import { ConfirmDialog, Modal } from '../../../ui/Dialog';
import {
  Checkbox, checkForm, errorsFrom, isBlank, Select, TextArea, TextInput, useFocusFirstError,
} from '../../../ui/Form';
import { ActionMenu } from '../../../ui/Menu';
import { Alert, EmptyState, Spinner } from '../../../ui/States';
import { DragHandle, moveBy, SortableItem, SortableList } from '../../../ui/Sortable';
import { useToast } from '../../../ui/Toast';
import { BLOCK_META } from '../../../blocks/meta';
import { useCourse } from './CursoLayout';

function useModalForm(initial, open) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  useFocusFirstError(error, ref);
  useLayoutEffect(() => {
    if (open) { setForm(initial); setError(null); setBusy(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return { form, setForm, busy, setBusy, error, setError, ref };
}

function ModuleModal({ open, onClose, module, onSave }) {
  const f = useModalForm({ title: module?.title || '', description: module?.description || '' }, open);
  const submit = async (e) => {
    e.preventDefault();
    const problems = checkForm([['title', isBlank(f.form.title), 'Escribe el nombre del módulo.']]);
    if (problems) { f.setError(problems); return; }
    f.setBusy(true);
    try {
      await onSave({ title: f.form.title.trim(), description: f.form.description });
      onClose();
    } catch (err) {
      f.setError(err);
      f.setBusy(false);
    }
  };
  const { fields, general } = errorsFrom(f.error, ['title', 'description']);
  return (
    <Modal open={open} onClose={f.busy ? undefined : onClose} dismissable={!f.busy} title={module ? 'Editar módulo' : 'Nuevo módulo'}
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={f.busy}>Cancelar</Button>
          <Button type="submit" form="aula-module-form" loading={f.busy}>{module ? 'Guardar' : 'Crear módulo'}</Button>
        </>
      )}>
      <form ref={f.ref} id="aula-module-form" onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {general && <Alert tone="danger">{general}</Alert>}
        <TextInput label="Nombre del módulo" required maxLength={160} value={f.form.title} error={fields.title}
          onChange={(e) => f.setForm({ ...f.form, title: e.target.value })} data-autofocus />
        <TextArea label="Descripción (opcional)" rows={3} maxLength={1000} value={f.form.description} error={fields.description}
          onChange={(e) => f.setForm({ ...f.form, description: e.target.value })} />
      </form>
    </Modal>
  );
}

export function LessonModal({ open, onClose, lesson, onSave, videoCompletionPct = 90 }) {
  const initial = {
    title: lesson?.title || '',
    subtitle: lesson?.subtitle || '',
    isRequired: lesson?.isRequired ?? true,
    completionRule: lesson?.completionRule || 'manual',
    minMinutes: lesson?.minSeconds ? String(Math.round(lesson.minSeconds / 60)) : '',
    durationMinutes: lesson?.durationMinutes != null ? String(lesson.durationMinutes) : '',
  };
  const f = useModalForm(initial, open);
  const set = (k) => (e) => f.setForm({ ...f.form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const min = f.form.minMinutes === '' ? 0 : Number(f.form.minMinutes);
    const dur = f.form.durationMinutes === '' ? null : Number(f.form.durationMinutes);
    const problems = checkForm([
      ['title', isBlank(f.form.title), 'Escribe el título de la clase.'],
      ['minSeconds', !Number.isInteger(min) || min < 0 || min > 240, 'El tiempo mínimo va de 0 a 240 minutos.'],
      ['durationMinutes', dur !== null && (!Number.isInteger(dur) || dur < 0 || dur > 1440), 'La duración va de 0 a 1440 minutos.'],
    ]);
    if (problems) { f.setError(problems); return; }
    f.setBusy(true);
    try {
      await onSave({
        title: f.form.title.trim(),
        subtitle: f.form.subtitle,
        isRequired: f.form.isRequired,
        completionRule: f.form.completionRule,
        minSeconds: min * 60,
        durationMinutes: dur,
      });
      onClose();
    } catch (err) {
      f.setError(err);
      f.setBusy(false);
    }
  };
  const { fields, general } = errorsFrom(f.error, ['title', 'subtitle', 'minSeconds', 'durationMinutes', 'completionRule']);
  return (
    <Modal open={open} onClose={f.busy ? undefined : onClose} dismissable={!f.busy} title={lesson ? 'Datos de la clase' : 'Nueva clase'}
      description={lesson ? 'Los cambios llegan a los participantes al publicar.' : 'Después podrás agregar su contenido.'}
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={f.busy}>Cancelar</Button>
          <Button type="submit" form="aula-lesson-form" loading={f.busy}>{lesson ? 'Guardar' : 'Crear y agregar contenido'}</Button>
        </>
      )}>
      <form ref={f.ref} id="aula-lesson-form" onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {general && <Alert tone="danger">{general}</Alert>}
        <TextInput label="Título" required maxLength={160} value={f.form.title} error={fields.title} onChange={set('title')} data-autofocus />
        <TextInput label="Subtítulo (opcional)" maxLength={300} value={f.form.subtitle} error={fields.subtitle} onChange={set('subtitle')} />
        <Checkbox label="Clase obligatoria" description="Cuenta para completar el curso." checked={f.form.isRequired} onChange={set('isRequired')} />
        <Select
          label="Cómo se completa"
          value={f.form.completionRule}
          onChange={set('completionRule')}
          options={[
            { value: 'manual', label: 'La persona la marca como completada' },
            { value: 'video', label: `Al ver al menos el ${videoCompletionPct} % del video` },
          ]}
          hint={f.form.completionRule === 'video' ? 'La clase necesita un bloque de video.' : 'Úsalo para lecturas: la persona confirma que terminó.'}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Tiempo mínimo de lectura (min)" inputMode="numeric" value={f.form.minMinutes} error={fields.minSeconds}
            onChange={(e) => f.setForm({ ...f.form, minMinutes: e.target.value.replace(/\D/g, '') })}
            hint="Opcional. Antes de ese tiempo no se puede marcar como completada." />
          <TextInput label="Duración estimada (min)" inputMode="numeric" value={f.form.durationMinutes} error={fields.durationMinutes}
            onChange={(e) => f.setForm({ ...f.form, durationMinutes: e.target.value.replace(/\D/g, '') })} />
        </div>
      </form>
    </Modal>
  );
}

function MoveLessonModal({ open, onClose, lesson, modules, onMove }) {
  const f = useModalForm({ moduleId: '', position: 'final' }, open);
  const target = modules.find((m) => String(m.id) === f.form.moduleId);
  const submit = async (e) => {
    e.preventDefault();
    const problems = checkForm([['moduleId', !f.form.moduleId, 'Elige el módulo de destino.']]);
    if (problems) { f.setError(problems); return; }
    f.setBusy(true);
    try {
      await onMove({
        moduleId: Number(f.form.moduleId),
        position: f.form.position === 'final' ? undefined : Number(f.form.position),
      });
      onClose();
    } catch (err) {
      f.setError(err);
      f.setBusy(false);
    }
  };
  const { fields, general } = errorsFrom(f.error, ['moduleId']);
  const others = modules.filter((m) => m.id !== lesson?.moduleId);
  return (
    <Modal open={open} onClose={f.busy ? undefined : onClose} dismissable={!f.busy} title={`Mover «${lesson?.title || ''}»`} size="sm"
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={f.busy}>Cancelar</Button>
          <Button type="submit" form="aula-move-form" icon={FolderInput} loading={f.busy} disabled={!others.length}>Mover</Button>
        </>
      )}>
      <form ref={f.ref} id="aula-move-form" onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {general && <Alert tone="danger">{general}</Alert>}
        {!others.length && <Alert tone="info">El curso tiene un solo módulo. Crea otro para mover clases.</Alert>}
        <Select label="Módulo de destino" value={f.form.moduleId} error={fields.moduleId} placeholder="Elige un módulo"
          onChange={(e) => f.setForm({ moduleId: e.target.value, position: 'final' })}
          options={others.map((m) => ({ value: String(m.id), label: m.title }))} />
        {target && (
          <Select label="Posición" value={f.form.position} onChange={(e) => f.setForm({ ...f.form, position: e.target.value })}
            options={[
              { value: '0', label: 'Al inicio' },
              ...target.lessons.map((l, i) => ({ value: String(i + 1), label: `Después de «${l.title}»` })),
              { value: 'final', label: 'Al final' },
            ].filter((o, i, all) => !(o.value === String(target.lessons.length) && all.some((x) => x.value === 'final')))} />
        )}
      </form>
    </Modal>
  );
}

function LessonRow({ lesson, index, course, onEdit, onDuplicate, onMove, onDelete, onShift, first, last }) {
  const types = lesson.blockTypes || [];
  return (
    <div className="flex items-center gap-2 rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white px-2 py-2 sm:px-3">
      <DragHandle label={`Mover la clase «${lesson.title}»`} />
      <span className="w-6 shrink-0 text-center text-xs font-semibold tabular-nums text-[var(--aula-muted)]">{index + 1}</span>
      <div className="min-w-0 flex-1">
        <Link to={`/aula/admin/cursos/${course.id}/clases/${lesson.id}`} className="block truncate font-semibold hover:text-[var(--aula-primary)] hover:underline">
          {lesson.title}
        </Link>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--aula-muted)]">
          {lesson.blockCount
            ? <span>{plural(lesson.blockCount, 'bloque')}</span>
            : <span className="font-semibold text-[var(--aula-danger)]">Sin contenido</span>}
          {types.slice(0, 5).map((t) => {
            const Icon = BLOCK_META[t]?.icon;
            return Icon ? <Icon key={t} className="h-3.5 w-3.5" aria-label={BLOCK_META[t].label} /> : null;
          })}
          {lesson.completionRule === 'video' && <span className="inline-flex items-center gap-0.5"><PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />se completa con video</span>}
          {lesson.minSeconds > 0 && <span className="inline-flex items-center gap-0.5"><Timer className="h-3.5 w-3.5" aria-hidden="true" />mín. {fmtMinutes(Math.round(lesson.minSeconds / 60))}</span>}
          {lesson.durationMinutes ? <span>· {fmtMinutes(lesson.durationMinutes)}</span> : null}
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        {!lesson.isRequired && <Badge>Opcional</Badge>}
        {course.version && !lesson.published && <Badge tone="warning">Sin publicar</Badge>}
      </div>
      <ActionMenu size="sm" label={`Acciones de la clase «${lesson.title}»`} items={[
        { label: 'Editar contenido', icon: Pencil, onSelect: onEdit.content },
        { label: 'Datos de la clase', icon: Settings2, hint: 'Título, obligatoriedad y cómo se completa', onSelect: onEdit.settings },
        { label: 'Duplicar', icon: Copy, onSelect: onDuplicate },
        { label: 'Mover a otro módulo', icon: FolderInput, onSelect: onMove },
        { label: 'Subir', icon: ArrowUp, disabled: first, onSelect: () => onShift(-1) },
        { label: 'Bajar', icon: ArrowDown, disabled: last, onSelect: () => onShift(1) },
        'separator',
        { label: 'Eliminar', icon: Trash2, tone: 'danger', onSelect: onDelete },
      ]} />
    </div>
  );
}

export default function Contenido() {
  const { course, reload } = useCourse();
  const navigate = useNavigate();
  const toast = useToast();
  const [modules, setModules] = useState(course.outline);
  const [dialog, setDialog] = useState(null);
  const [impact, setImpact] = useState(null);
  const [saving, setSaving] = useState(false);
  const archived = course.status === 'archivado';

  useEffect(() => { setModules(course.outline); }, [course.outline]);

  const fail = (err) => {
    toast.error(err.message);
    reload();
  };

  const saveModuleOrder = async (next) => {
    setModules(next);
    setSaving(true);
    try { await put(`/admin/courses/${course.id}/modules/order`, { ids: next.map((m) => m.id) }); reload(); } catch (err) { fail(err); } finally { setSaving(false); }
  };

  const saveLessonOrder = async (moduleId, lessons) => {
    setModules((list) => list.map((m) => (m.id === moduleId ? { ...m, lessons } : m)));
    setSaving(true);
    try { await put(`/admin/modules/${moduleId}/lessons/order`, { ids: lessons.map((l) => l.id) }); reload(); } catch (err) { fail(err); } finally { setSaving(false); }
  };

  const openDelete = async (kind, item) => {
    setDialog({ kind: `delete-${kind}`, item });
    setImpact(null);
    try {
      setImpact(await get(`/admin/${kind === 'module' ? 'modules' : 'lessons'}/${item.id}/impact`));
    } catch (err) {
      setImpact({ error: err.message });
    }
  };

  const impactText = (i) => {
    if (!i) return 'Revisando si hay participantes con avance…';
    if (i.error) return i.error;
    const parts = [];
    if (i.lessons !== undefined) parts.push(`Incluye ${plural(i.lessons, 'clase')}.`);
    if (i.started) {
      parts.push(`${plural(i.started, 'participante tiene', 'participantes tienen')} avance registrado (${i.completed} ${i.completed === 1 ? 'completada' : 'completadas'}). Ese historial se conserva y queda en la bitácora.`);
    }
    parts.push(i.published
      ? 'Está en la versión publicada: los participantes lo seguirán viendo hasta que publiques los cambios.'
      : 'Aún no está publicado.');
    return parts.join(' ');
  };

  if (!modules.length) {
    return (
      <>
        <EmptyState
          icon={Layers}
          title="Este curso aún no tiene contenido"
          description="Organízalo en módulos y, dentro de cada uno, en clases. Cada clase se arma con bloques: texto, video, PDF, imágenes y más."
          action={!archived && <Button icon={Plus} onClick={() => setDialog({ kind: 'module' })}>Agregar el primer módulo</Button>}
        />
        <ModuleModal open={dialog?.kind === 'module'} onClose={() => setDialog(null)}
          onSave={async (body) => { await post(`/admin/courses/${course.id}/modules`, body); reload(); toast.success('Módulo creado.'); }} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--aula-muted)]">
          {plural(course.totals.modules, 'módulo')} · {plural(course.totals.lessons, 'clase')} ({course.totals.requiredLessons} {course.totals.requiredLessons === 1 ? 'obligatoria' : 'obligatorias'})
          {saving && <Spinner label="Guardando el orden…" className="ml-3" />}
        </p>
        {!archived && <Button size="sm" variant="secondary" icon={Plus} onClick={() => setDialog({ kind: 'module' })}>Agregar módulo</Button>}
      </div>

      <SortableList items={modules} itemLabel={(m) => `el módulo «${m?.title}»`} onReorder={saveModuleOrder} disabled={archived}>
        <ol className="flex flex-col gap-4">
          {modules.map((m, mi) => (
            <SortableItem key={m.id} id={m.id} className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-[var(--aula-surface)]">
              <div className="flex items-start gap-2 border-b border-[var(--aula-border)] px-3 py-3 sm:px-4">
                <DragHandle label={`Mover el módulo «${m.title}»`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--aula-secondary)]">Módulo {mi + 1}</p>
                  <h2 className="text-base font-bold">{m.title}</h2>
                  {m.description && <p className="mt-0.5 text-sm text-[var(--aula-muted)]">{m.description}</p>}
                </div>
                {!archived && (
                  <ActionMenu label={`Acciones del módulo «${m.title}»`} items={[
                    { label: 'Editar', icon: Pencil, onSelect: () => setDialog({ kind: 'module', item: m }) },
                    { label: 'Duplicar', icon: Copy, hint: 'Con sus clases y bloques', onSelect: async () => {
                      try { await post(`/admin/modules/${m.id}/duplicate`, {}); reload(); toast.success('Módulo duplicado.'); } catch (err) { fail(err); }
                    } },
                    { label: 'Subir', icon: ArrowUp, disabled: mi === 0, onSelect: () => saveModuleOrder(moveBy(modules, m.id, -1)) },
                    { label: 'Bajar', icon: ArrowDown, disabled: mi === modules.length - 1, onSelect: () => saveModuleOrder(moveBy(modules, m.id, 1)) },
                    'separator',
                    { label: 'Eliminar', icon: Trash2, tone: 'danger', onSelect: () => openDelete('module', m) },
                  ]} />
                )}
              </div>
              <div className="flex flex-col gap-2 p-3 sm:p-4">
                {m.lessons.length ? (
                  <SortableList items={m.lessons} itemLabel={(l) => `la clase «${l?.title}»`} onReorder={(ls) => saveLessonOrder(m.id, ls)} disabled={archived}>
                    <ol className="flex flex-col gap-2">
                      {m.lessons.map((l, li) => (
                        <SortableItem key={l.id} id={l.id}>
                          <LessonRow
                            lesson={{ ...l, moduleId: m.id }}
                            index={li}
                            course={course}
                            first={li === 0}
                            last={li === m.lessons.length - 1}
                            onEdit={{
                              content: () => navigate(`/aula/admin/cursos/${course.id}/clases/${l.id}`),
                              settings: () => setDialog({ kind: 'lesson', item: l, moduleId: m.id }),
                            }}
                            onDuplicate={async () => {
                              try { await post(`/admin/lessons/${l.id}/duplicate`, {}); reload(); toast.success('Clase duplicada.'); } catch (err) { fail(err); }
                            }}
                            onMove={() => setDialog({ kind: 'move', item: { ...l, moduleId: m.id } })}
                            onDelete={() => openDelete('lesson', l)}
                            onShift={(delta) => saveLessonOrder(m.id, moveBy(m.lessons, l.id, delta))}
                          />
                        </SortableItem>
                      ))}
                    </ol>
                  </SortableList>
                ) : (
                  <p className="rounded-[var(--aula-radius)] border border-dashed border-[var(--aula-border-strong)] px-4 py-3 text-sm text-[var(--aula-muted)]">
                    Este módulo no tiene clases.
                  </p>
                )}
                {!archived && (
                  <Button size="sm" variant="ghost" icon={Plus} className="self-start" onClick={() => setDialog({ kind: 'lesson', moduleId: m.id })}>
                    Agregar clase
                  </Button>
                )}
              </div>
            </SortableItem>
          ))}
        </ol>
      </SortableList>

      <ModuleModal
        open={dialog?.kind === 'module'}
        module={dialog?.item}
        onClose={() => setDialog(null)}
        onSave={async (body) => {
          if (dialog.item) await patch(`/admin/modules/${dialog.item.id}`, body);
          else await post(`/admin/courses/${course.id}/modules`, body);
          reload();
          toast.success(dialog.item ? 'Módulo actualizado.' : 'Módulo creado.');
        }}
      />
      <LessonModal
        open={dialog?.kind === 'lesson'}
        lesson={dialog?.item}
        videoCompletionPct={course.videoCompletionPct}
        onClose={() => setDialog(null)}
        onSave={async (body) => {
          if (dialog.item) {
            await patch(`/admin/lessons/${dialog.item.id}`, body);
            reload();
            toast.success('Clase actualizada.');
          } else {
            const created = await post(`/admin/modules/${dialog.moduleId}/lessons`, body);
            reload();
            navigate(`/aula/admin/cursos/${course.id}/clases/${created.id}`);
          }
        }}
      />
      <MoveLessonModal
        open={dialog?.kind === 'move'}
        lesson={dialog?.item}
        modules={modules}
        onClose={() => setDialog(null)}
        onMove={async (body) => {
          await post(`/admin/lessons/${dialog.item.id}/move`, body);
          reload();
          toast.success('Clase movida.');
        }}
      />
      <ConfirmDialog
        open={dialog?.kind === 'delete-module' || dialog?.kind === 'delete-lesson'}
        onClose={() => setDialog(null)}
        tone="danger"
        title={dialog?.kind === 'delete-module' ? `¿Eliminar el módulo «${dialog?.item?.title}»?` : `¿Eliminar la clase «${dialog?.item?.title}»?`}
        description={impactText(impact)}
        confirmLabel="Eliminar"
        confirmText={impact?.started ? 'ELIMINAR' : undefined}
        onConfirm={async () => {
          const kind = dialog.kind === 'delete-module' ? 'modules' : 'lessons';
          await api(`/admin/${kind}/${dialog.item.id}`, { method: 'DELETE' });
          reload();
          toast.success(kind === 'modules' ? 'Módulo eliminado.' : 'Clase eliminada.');
        }}
      />
    </div>
  );
}

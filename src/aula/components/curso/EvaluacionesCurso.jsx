import { useMemo, useState } from 'react';
import {
  Archive, ArrowDown, ArrowUp, Copy, Eye, FolderInput, Pencil, Plus,
} from 'lucide-react';
import { get, post } from '../../api';
import { useAsync } from '../../hooks';
import { plural } from '../../labels';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ConfirmDialog, Modal } from '../../ui/Dialog';
import { Select } from '../../ui/Form';
import { ActionMenu } from '../../ui/Menu';
import { Alert, EmptyState, ErrorState, LoadingBlock } from '../../ui/States';
import { useToast } from '../../ui/Toast';
import { RESOURCE_META, RecursoEditor, RecursoPreview } from './RecursoEditor';

const STATUS = {
  borrador: { label: 'Borrador', tone: 'neutral' },
  publicado: { label: 'Publicado', tone: 'success' },
  archivado: { label: 'Archivado', tone: 'neutral' },
};

function MoveDialog({ open, onClose, resource, modules, onMove }) {
  const [moduleId, setModuleId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const submit = async (event) => {
    event.preventDefault();
    if (!moduleId) {
      setError(new Error('Elige la unidad de destino.'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onMove(Number(moduleId));
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onClose}
      title={`Mover «${resource?.title || ''}»`}
      description="Se conserva el recurso, sus intentos, entregas y mensajes. Solo cambia la unidad y el orden."
      size="sm"
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancelar</Button>
          <Button type="submit" form="aula-move-resource" icon={FolderInput} loading={busy}>Mover</Button>
        </>
      )}
    >
      <form id="aula-move-resource" onSubmit={submit} className="flex flex-col gap-3" noValidate>
        {error && <p role="alert" className="text-sm text-[var(--aula-danger)]">{error.message}</p>}
        <Select
          label="Unidad de destino"
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          options={modules.filter((m) => m.id !== resource?.moduleId).map((m) => ({ value: String(m.id), label: m.title }))}
          placeholder="Elige una unidad"
        />
      </form>
    </Modal>
  );
}

export function ResourceRow({ resource, moduleId, modules, base, onChanged, onEdit, onPreview, position, total }) {
  const toast = useToast();
  const meta = RESOURCE_META[resource.type];
  const Icon = meta.icon;
  const [moving, setMoving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const archived = resource.status === 'archivado';

  const endpoint = `${base}/authoring/${meta.endpoint}/${resource.id}`;

  const duplicate = async () => {
    try {
      await post(`${endpoint}/duplicate`, {});
      toast.success(`${meta.label} duplicado en borrador. No se copiaron intentos, entregas ni mensajes.`);
      onChanged();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const moveTo = async (targetModuleId, targetPosition) => {
    await post(`${endpoint}/move`, { moduleId: targetModuleId, position: targetPosition });
    toast.success(`${meta.label} movido de unidad.`);
    onChanged();
  };

  const moveWithin = async (delta) => {
    const next = position + delta;
    if (next < 0 || next >= total) return;
    try {
      await moveTo(moduleId, next);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const archive = async (reason) => {
    await post(`${endpoint}/archive`, { reason });
    toast.success(`${meta.label} archivado. Su historial académico se conserva.`);
    onChanged();
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white px-3 py-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--aula-accent-soft)] text-[#5E51A8]">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-semibold">{resource.title}</span>
            <Badge tone={meta.tone}>{meta.label}</Badge>
            <Badge tone={STATUS[resource.status]?.tone || 'neutral'}>{STATUS[resource.status]?.label || resource.status}</Badge>
            {resource.isRequired === false && <Badge>Opcional</Badge>}
            {resource.weight !== null && resource.weight !== undefined && (
              <span className="text-[11px] font-semibold text-[var(--aula-muted)]">Peso {resource.weight} %</span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-[var(--aula-muted)]">
            Orden {position + 1} de {total}
            {resource.questionCount !== undefined ? ` · ${plural(resource.questionCount, 'pregunta')}` : ''}
            {resource.attemptCount ? ` · ${plural(resource.attemptCount, 'intento')}` : ''}
            {resource.submissionCount ? ` · ${plural(resource.submissionCount, 'entrega')}` : ''}
            {resource.postCount !== undefined ? ` · ${plural(resource.postCount, 'mensaje')}` : ''}
            {resource.isClosed ? ' · cerrado a respuestas' : ''}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button size="sm" variant="ghost" icon={ArrowUp} disabled={archived || position === 0} onClick={() => moveWithin(-1)} aria-label={`Subir ${meta.name}`} />
          <Button size="sm" variant="ghost" icon={ArrowDown} disabled={archived || position >= total - 1} onClick={() => moveWithin(1)} aria-label={`Bajar ${meta.name}`} />
          <ActionMenu
            size="sm"
            label={`Acciones de ${meta.name} «${resource.title}»`}
            items={[
              { label: 'Editar', icon: Pencil, onSelect: () => onEdit?.(resource) },
              { label: 'Vista previa', icon: Eye, onSelect: () => onPreview?.(resource) },
              { label: 'Duplicar', icon: Copy, onSelect: duplicate },
              { label: 'Mover a otra unidad', icon: FolderInput, onSelect: () => setMoving(true) },
              'separator',
              { label: 'Archivar', icon: Archive, tone: 'danger', hint: 'Conserva el historial', onSelect: () => setArchiving(true) },
            ]}
          />
        </div>
      </div>
      <MoveDialog
        open={moving}
        onClose={() => setMoving(false)}
        resource={resource}
        modules={modules}
        onMove={(target) => moveTo(target, 0)}
      />
      <ConfirmDialog
        open={archiving}
        onClose={() => setArchiving(false)}
        tone="danger"
        title={`¿Archivar «${resource.title}»?`}
        description="Dejará de mostrarse a los estudiantes y, si tenía peso, dejará de contar para la nota final. Los pesos de los demás recursos no se reparten ni se renormalizan. Los intentos, entregas, mensajes y calificaciones se conservan en el historial."
        confirmLabel="Archivar"
        requireReason
        reasonLabel="Motivo del archivo"
        onConfirm={archive}
      />
    </>
  );
}

function ResourceList({ resources, moduleId, modules, base, onChanged, onEdit, onPreview }) {
  const byType = useMemo(() => {
    const map = { quiz: [], activity: [], forum: [] };
    for (const resource of resources) map[resource.type]?.push(resource);
    for (const key of Object.keys(map)) map[key].sort((a, b) => (a.sortOrder - b.sortOrder) || (a.id - b.id));
    return map;
  }, [resources]);
  const all = useMemo(() => [...byType.quiz, ...byType.activity, ...byType.forum], [byType]);
  if (!all.length) return null;
  return (
    <div className="flex flex-col gap-2" data-resource-list>
      {all.map((resource) => {
        const siblings = byType[resource.type];
        const position = siblings.findIndex((r) => r.id === resource.id);
        return (
          <div key={`${resource.type}-${resource.id}`} data-resource-id={resource.id} data-resource-type={resource.type}>
            <ResourceRow
              resource={resource}
              moduleId={moduleId}
              modules={modules}
              base={base}
              onChanged={onChanged}
              onEdit={onEdit}
              onPreview={onPreview}
              position={position}
              total={siblings.length}
            />
          </div>
        );
      })}
    </div>
  );
}

export function UnitEvaluations({
  courseId, base, module, resources = [], modules = [], onChanged, showAdd = true,
}) {
  const [editor, setEditor] = useState(null);
  const [preview, setPreview] = useState(null);
  const relevant = resources.filter((r) => r.moduleId === module.id && r.status !== 'archivado');
  const archived = resources.filter((r) => r.moduleId === module.id && r.status === 'archivado');
  const openNew = (type) => setEditor({ open: true, type, resourceId: null, moduleId: module.id });
  return (
    <div className="flex flex-col gap-2 rounded-[var(--aula-radius)] border border-dashed border-[var(--aula-border-strong)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--aula-muted)]">
          Quizzes, actividades y foros {relevant.length ? `· ${relevant.length}` : ''}
        </p>
        {showAdd && (
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant="ghost" icon={Plus} onClick={() => openNew('quiz')}>Añadir quiz</Button>
            <Button size="sm" variant="ghost" icon={Plus} onClick={() => openNew('activity')}>Añadir actividad</Button>
            <Button size="sm" variant="ghost" icon={Plus} onClick={() => openNew('forum')}>Añadir foro</Button>
          </div>
        )}
      </div>
      {relevant.length ? (
        <ResourceList
          resources={relevant}
          moduleId={module.id}
          modules={modules}
          base={base}
          onChanged={onChanged}
          onEdit={(resource) => setEditor({ open: true, type: resource.type, resourceId: resource.id, moduleId: resource.moduleId })}
          onPreview={(resource) => setPreview(resource)}
        />
      ) : (
        <p className="text-xs text-[var(--aula-muted)]">Esta unidad todavía no tiene quizzes, actividades ni foros.</p>
      )}
      {archived.length > 0 && (
        <details>
          <summary className="cursor-pointer text-xs font-semibold text-[var(--aula-primary)]">Archivados ({archived.length})</summary>
          <div className="mt-2">
            <ResourceList
              resources={archived}
              moduleId={module.id}
              modules={modules}
              base={base}
              onChanged={onChanged}
              onPreview={(resource) => setPreview(resource)}
            />
          </div>
        </details>
      )}
      {editor && (
        <RecursoEditor
          open={editor.open}
          type={editor.type}
          resourceId={editor.resourceId}
          moduleId={editor.moduleId}
          modules={modules}
          courseId={courseId}
          base={base}
          onClose={() => setEditor(null)}
          onSaved={() => onChanged?.()}
        />
      )}
      {preview && (
        <RecursoPreview
          open
          type={preview.type}
          resourceId={preview.id}
          base={base}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

export function EvaluacionesPanel({ courseId, base, onChanged, modules: providedModules = null }) {
  const data = useAsync(({ signal }) => get(`${base}/authoring/courses/${courseId}`, { signal }), [base, courseId]);
  const content = data.data;
  const modules = providedModules || content?.modules || [];
  const [editor, setEditor] = useState(null);
  const [preview, setPreview] = useState(null);
  const refresh = () => {
    data.reload();
    onChanged?.();
  };

  if (data.loading && !content) return <LoadingBlock rows={5} label="Cargando los recursos del curso" />;
  if (data.error && !content) return <ErrorState error={data.error} onRetry={data.reload} />;
  if (!content) return null;

  const resources = [...content.quizzes, ...content.activities, ...content.forums];
  const orphan = resources.filter((r) => !r.moduleId && r.status !== 'archivado');
  const totalActive = resources.filter((r) => r.status !== 'archivado').length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--aula-muted)]">
          {plural(content.modules.length, 'unidad')} · {plural(totalActive, 'recurso activo')} · límite de {content.limits.maxRequiredActivities} actividades obligatorias
        </p>
        {content.modules.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" icon={Plus} onClick={() => setEditor({ open: true, type: 'quiz', resourceId: null, moduleId: content.modules[0]?.id })}>Añadir quiz</Button>
            <Button size="sm" variant="secondary" icon={Plus} onClick={() => setEditor({ open: true, type: 'activity', resourceId: null, moduleId: content.modules[0]?.id })}>Añadir actividad</Button>
            <Button size="sm" variant="secondary" icon={Plus} onClick={() => setEditor({ open: true, type: 'forum', resourceId: null, moduleId: content.modules[0]?.id })}>Añadir foro</Button>
          </div>
        )}
      </div>

      {content.limits.requiredActivities >= content.limits.maxRequiredActivities && (
        <Alert tone="warning" title="Límite de actividades obligatorias">
          Este curso ya tiene {content.limits.maxRequiredActivities} actividades obligatorias. Las nuevas actividades deben publicarse como formativas (sin obligatoriedad) o archivarse antes de añadir otra. Los quizzes y los foros no cuentan para este límite.
        </Alert>
      )}

      {content.modules.length === 0 && (
        <EmptyState
          icon={PillIcon}
          title="Primero crea una unidad"
          description="Los quizzes, actividades y foros siempre pertenecen a una unidad del curso. Crea la estructura y vuelve aquí."
        />
      )}

      {content.modules.map((module) => (
        <UnitEvaluations
          key={module.id}
          courseId={courseId}
          base={base}
          module={module}
          resources={resources}
          modules={content.modules}
          onChanged={refresh}
        />
      ))}

      {orphan.length > 0 && (
        <section className="rounded-[var(--aula-radius)] border border-[var(--aula-warning)] bg-[var(--aula-warning-soft)] p-4">
          <h2 className="text-sm font-bold text-[var(--aula-warning)]">Recursos sin unidad</h2>
          <p className="mt-1 text-xs text-[var(--aula-warning)]">No aparecen en el aula. Edítalos y asígnales una unidad.</p>
          <div className="mt-3 flex flex-col gap-2">
            {orphan.map((resource) => (
              <ResourceRow
                key={`${resource.type}-${resource.id}`}
                resource={resource}
                moduleId={resource.moduleId}
                modules={content.modules}
                base={base}
                onChanged={refresh}
                position={0}
                total={1}
              />
            ))}
          </div>
        </section>
      )}

      {editor && (
        <RecursoEditor
          open={editor.open}
          type={editor.type}
          resourceId={editor.resourceId}
          moduleId={editor.moduleId}
          modules={content.modules}
          courseId={courseId}
          base={base}
          onClose={() => setEditor(null)}
          onSaved={refresh}
        />
      )}
      {preview && (
        <RecursoPreview open type={preview.type} resourceId={preview.id} base={base} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}

function PillIcon(props) {
  return <Plus {...props} />;
}

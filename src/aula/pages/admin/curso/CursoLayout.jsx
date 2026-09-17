import { Suspense, useState } from 'react';
import { Link, Outlet, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  Archive, ArchiveRestore, Copy, Eye, FileClock, History, Layers, Library, Rocket, Send, Settings2, SlidersHorizontal,
  Trash2, Undo2, Users,
} from 'lucide-react';
import { api, get, post } from '../../../api';
import { useAsync } from '../../../hooks';
import { fmtDate } from '../../../labels';
import { Badge, StatusBadge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import { ConfirmDialog } from '../../../ui/Dialog';
import { ActionMenu } from '../../../ui/Menu';
import { ErrorState, LoadingBlock } from '../../../ui/States';
import { TabNav } from '../../../ui/Tabs';
import { useToast } from '../../../ui/Toast';
import { CourseCover, CourseCreateModal } from '../Cursos';
import { PublishDialog } from './PublishDialog';

/** Datos del curso para las pestañas: `const { course, reload } = useCourse()`. */
export function useCourse() {
  return useOutletContext();
}

export default function CursoLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const course = useAsync(({ signal }) => get(`/admin/courses/${id}`, { signal }), [id]);
  const [publishing, setPublishing] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [confirm, setConfirm] = useState(null);

  if (course.loading && !course.data) return <LoadingBlock rows={5} label="Cargando el curso" />;
  if (course.error && !course.data) return <ErrorState error={course.error} onRetry={course.reload} />;
  const c = course.data;
  const base = `/aula/admin/cursos/${c.id}`;
  const archived = c.status === 'archivado';

  const changeStatus = async (status, message, reason) => {
    const updated = await post(`/admin/courses/${c.id}/status`, { status, reason });
    course.setData(updated);
    toast.success(message);
  };

  const menu = [
    c.status === 'borrador' && { label: 'Enviar a revisión', icon: Send, hint: 'Marca el borrador como listo para revisar', onSelect: () => changeStatus('en_revision', 'El curso quedó en revisión.') },
    c.status === 'en_revision' && { label: 'Volver a borrador', icon: Undo2, onSelect: () => changeStatus('borrador', 'El curso volvió a borrador.') },
    { label: 'Duplicar', icon: Copy, hint: 'También para otra empresa', onSelect: () => setDuplicating(true) },
    'separator',
    archived
      ? { label: 'Restaurar', icon: ArchiveRestore, onSelect: () => changeStatus('restaurar', 'Curso restaurado.') }
      : { label: 'Archivar', icon: Archive, tone: 'danger', hint: 'Los participantes dejan de verlo', onSelect: () => setConfirm('archive') },
    !c.version && !c.enrollments.total && { label: 'Eliminar borrador', icon: Trash2, tone: 'danger', onSelect: () => setConfirm('delete') },
  ].filter(Boolean);

  const pending = c.hasUnpublishedChanges && !archived;
  return (
    <div>
      <div className="mb-5 flex flex-col gap-4">
        <Link to="/aula/admin/cursos" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--aula-muted)] hover:text-[var(--aula-primary)]">
          ← Cursos
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <CourseCover course={c} className="hidden h-16 w-24 sm:flex" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--aula-secondary)]">
                {c.kind === 'empresa' ? `Capacitación privada · ${c.companyName}` : 'Curso propio de Edvanta'}
              </p>
              <h1 className="text-2xl font-extrabold text-[var(--aula-primary)] sm:text-[1.75rem]">{c.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--aula-muted)]">
                <StatusBadge kind="course" status={c.status} />
                {c.isDemo && <Badge tone="accent">Demostrativo</Badge>}
                {c.version
                  ? <span className="inline-flex items-center gap-1"><History className="h-3.5 w-3.5" aria-hidden="true" />Versión {c.version.number} publicada el {fmtDate(c.version.publishedAt)}</span>
                  : <span>Nunca publicado</span>}
                {pending && (
                  <Badge tone="warning"><FileClock className="mr-1 h-3.5 w-3.5" aria-hidden="true" />Cambios sin publicar</Badge>
                )}
                <span>· {c.enrollments.total} {c.enrollments.total === 1 ? 'participante' : 'participantes'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {c.totals.lessons > 0 && <Button variant="secondary" icon={Eye} to={`${base}/vista-previa`}>Vista previa</Button>}
            {!archived && (
              <Button icon={Rocket} onClick={() => setPublishing(true)} variant={pending ? 'primary' : 'secondary'}>
                {c.version ? 'Publicar cambios' : 'Publicar'}
              </Button>
            )}
            <ActionMenu label="Más acciones del curso" items={menu} />
          </div>
        </div>
        {archived && (
          <p role="status" className="rounded-[var(--aula-radius)] bg-[var(--aula-neutral-soft)] px-4 py-2 text-sm text-[var(--aula-muted)]">
            Curso archivado: los participantes no lo ven y el contenido no se puede editar. Su historial se conserva. Restáuralo desde «Más acciones».
          </p>
        )}
      </div>

      <TabNav
        label="Secciones del curso"
        className="mb-6"
        items={[
          { to: base, end: true, label: 'Contenido', icon: Layers, match: /\/clases\// },
          { to: `${base}/informacion`, label: 'Información', icon: Settings2 },
          { to: `${base}/reglas`, label: 'Reglas y fechas', icon: SlidersHorizontal },
          { to: `${base}/recursos`, label: 'Recursos', icon: Library },
          { to: `${base}/participantes`, label: 'Participantes', icon: Users },
          { to: `${base}/versiones`, label: 'Versiones', icon: History },
        ]}
      />

      <Suspense fallback={<LoadingBlock rows={3} label="Cargando la sección" />}>
        <Outlet context={{ course: c, reload: course.reload, setCourse: course.setData, openPublish: () => setPublishing(true) }} />
      </Suspense>

      {publishing && (
        <PublishDialog
          course={c}
          onClose={() => setPublishing(false)}
          onPublished={(result) => {
            setPublishing(false);
            course.reload();
            toast.success(`Versión ${result.version.number} publicada.${result.moved ? ` ${result.moved} ${result.moved === 1 ? 'inscripción pasa' : 'inscripciones pasan'} a esta versión.` : ''}`);
          }}
        />
      )}
      <CourseCreateModal open={duplicating} source={c} onClose={() => setDuplicating(false)} />
      <ConfirmDialog
        open={confirm === 'archive'}
        onClose={() => setConfirm(null)}
        tone="danger"
        title={`¿Archivar «${c.title}»?`}
        description={`${c.enrollments.total ? `${c.enrollments.total} ${c.enrollments.total === 1 ? 'participante deja' : 'participantes dejan'} de verlo. ` : ''}Su avance, notas y versiones se conservan; puedes restaurarlo cuando quieras.`}
        confirmLabel="Archivar curso"
        requireReason
        reasonLabel="Motivo del archivo"
        onConfirm={(reason) => changeStatus('archivado', 'Curso archivado.', reason)}
      />
      <ConfirmDialog
        open={confirm === 'delete'}
        onClose={() => setConfirm(null)}
        tone="danger"
        title={`¿Eliminar el borrador «${c.title}»?`}
        description={`Nunca se publicó ni se asignó. Se eliminan sus ${c.totals.modules} módulos y ${c.totals.lessons} clases. Esta acción queda en la bitácora.`}
        confirmLabel="Eliminar borrador"
        confirmText={c.title}
        onConfirm={async () => {
          await api(`/admin/courses/${c.id}`, { method: 'DELETE', body: {} });
          toast.success(`Borrador «${c.title}» eliminado.`);
          navigate('/aula/admin/cursos', { replace: true });
        }}
      />
      <p className="sr-only" aria-live="polite">{course.loading ? 'Actualizando el curso…' : ''}</p>
    </div>
  );
}

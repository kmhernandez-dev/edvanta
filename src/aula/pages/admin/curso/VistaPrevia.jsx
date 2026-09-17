/**
 * Vista previa en modo participante de la copia de trabajo: el
 * administrador ve lo mismo que verá un participante al publicar.
 * No registra avance.
 */
import { Navigate, useParams } from 'react-router-dom';
import { CheckCircle2, Eye, Timer } from 'lucide-react';
import { get } from '../../../api';
import { useAsync } from '../../../hooks';
import { fmtMinutes } from '../../../labels';
import { Button } from '../../../ui/Button';
import { PageError, PageLoader } from '../../../ui/States';
import { CourseOverview, ResourceList } from '../../../player/CourseOverview';
import { CoursePlayer, flattenLessons } from '../../../player/CoursePlayer';

function PreviewBanner({ courseId }) {
  return (
    <div role="note" className="border-b border-[#D9D2F5] bg-[var(--aula-accent-soft)]">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-xs text-[#4A3F8F]">
        <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold">Vista previa del borrador.</span>
        <span>Así lo verá un participante cuando publiques. Aquí no se registra avance.</span>
        <Button size="sm" variant="ghost" to={`/aula/admin/cursos/${courseId}`} className="ml-auto h-7">Volver al editor</Button>
      </div>
    </div>
  );
}

function CompletionPreview({ lesson, rules }) {
  const video = lesson.completionRule === 'video';
  return (
    <div className="flex flex-col gap-2 rounded-[var(--aula-radius-lg)] border border-dashed border-[var(--aula-border-strong)] bg-white p-4">
      <p className="text-sm font-semibold">Cómo se completa esta clase</p>
      <p className="text-sm text-[var(--aula-muted)]">
        {video
          ? `Se completa sola cuando el participante ve al menos el ${rules.videoCompletionPct} % del video.`
          : 'El participante la marca como completada cuando termina de leer.'}
        {lesson.minSeconds > 0 && ` Antes de ${fmtMinutes(Math.round(lesson.minSeconds / 60))} en la clase, el botón no se habilita.`}
        {!lesson.isRequired && ' Es opcional: no cuenta para completar el curso.'}
      </p>
      {!video && (
        <div className="flex items-center gap-3">
          <Button icon={CheckCircle2} disabled>Marcar como completada</Button>
          {lesson.minSeconds > 0 && <span className="inline-flex items-center gap-1 text-xs text-[var(--aula-muted)]"><Timer className="h-3.5 w-3.5" aria-hidden="true" />Desactivado en la vista previa</span>}
        </div>
      )}
    </div>
  );
}

export default function VistaPrevia() {
  const { id, lessonId } = useParams();
  const preview = useAsync(({ signal }) => get(`/admin/courses/${id}/preview`, { signal }), [id]);
  const resources = useAsync(({ signal }) => get(`/admin/courses/${id}/resources`, { signal }), [id]);

  if (preview.loading && !preview.data) return <PageLoader label="Preparando la vista previa…" />;
  if (preview.error) return <PageError error={preview.error} onRetry={preview.reload} />;
  const snapshot = preview.data;
  const lessons = flattenLessons(snapshot);
  const base = `/aula/admin/cursos/${id}/vista-previa`;
  const lessonHref = (lid) => `${base}/${lid}`;

  if (lessonId) {
    if (!lessons.some((l) => String(l.id) === lessonId)) return <Navigate to={base} replace />;
    return (
      <CoursePlayer
        mode="preview"
        snapshot={snapshot}
        lessonId={Number(lessonId)}
        lessonHref={lessonHref}
        backTo={{ to: base, label: 'Portada del curso' }}
        banner={<PreviewBanner courseId={id} />}
        renderCompletion={(lesson) => <CompletionPreview lesson={lesson} rules={snapshot.rules} />}
      />
    );
  }

  const published = (resources.data?.resources || []).filter((r) => r.status === 'publicado' && r.current);
  return (
    <CourseOverview
      snapshot={snapshot}
      backTo={{ to: `/aula/admin/cursos/${id}`, label: 'Volver al editor' }}
      banner={<PreviewBanner courseId={id} />}
      startHref={lessons[0] ? lessonHref(lessons[0].id) : null}
      startLabel="Empezar el curso"
      lessonHref={lessonHref}
      resources={resources.data?.enabled
        ? <ResourceList resources={published} categories={resources.data.categories} />
        : null}
    />
  );
}

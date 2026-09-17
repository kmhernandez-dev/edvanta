import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Library } from 'lucide-react';
import { get } from '../../api';
import { useAsync } from '../../hooks';
import { EmptyState, ErrorState, LoadingBlock } from '../../ui/States';
import { ResourceList } from '../../player/CourseOverview';
import { useCourseData } from './CursoParticipante';

export default function RecursosCurso() {
  const { courseId } = useParams();
  const { data } = useCourseData();
  const res = useAsync(({ signal }) => get(`/me/courses/${courseId}/resources`, { signal }), [courseId]);
  if (!data.resourcesEnabled) return <Navigate to={`/aula/curso/${courseId}`} replace />;

  return (
    <div className="aula-root min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <Link to={`/aula/curso/${courseId}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aula-muted)] hover:text-[var(--aula-primary)]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {data.snapshot.course.title}
        </Link>
        <h1 className="mt-3 flex items-center gap-2 text-2xl font-extrabold text-[var(--aula-primary)]">
          <Library className="h-6 w-6" aria-hidden="true" /> Recursos de trabajo
        </h1>
        <p className="mt-1 text-sm text-[var(--aula-muted)]">Material de consulta del curso, siempre en su versión más reciente.</p>
        <div className="mt-6">
          {res.loading && !res.data && <LoadingBlock rows={3} label="Cargando recursos" />}
          {res.error && <ErrorState error={res.error} onRetry={res.reload} />}
          {res.data && (res.data.resources.length
            ? <ResourceList resources={res.data.resources} categories={res.data.categories} />
            : <EmptyState icon={Library} title="Todavía no hay recursos" description="Cuando el equipo publique material de consulta, aparecerá aquí." />)}
        </div>
      </div>
    </div>
  );
}

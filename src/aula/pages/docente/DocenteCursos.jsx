import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageSquare, Users } from 'lucide-react';
import { get } from '../../api';
import { useAsync } from '../../hooks';
import { Badge } from '../../ui/Badge';
import { PageHeader } from '../../ui/Page';
import { EmptyState, ErrorState, LoadingBlock } from '../../ui/States';

export default function DocenteCursos() {
  const courses = useAsync(({ signal }) => get('/docente/courses', { signal }), []);
  return (
    <div>
      <PageHeader
        eyebrow="Docencia"
        title="Mis cursos"
        description="Solo aparecen los cursos en los que tienes una asignación docente vigente. La administración del aula conserva acceso a todos."
      />
      {courses.loading && !courses.data && <LoadingBlock rows={4} label="Cargando tus cursos" />}
      {courses.error && <ErrorState error={courses.error} onRetry={courses.reload} />}
      {courses.data && courses.data.length === 0 && (
        <EmptyState icon={BookOpen} title="No tienes cursos asignados" description="Pide a la administración del aula que te asigne como docente de un curso." />
      )}
      {courses.data?.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.data.map((c) => (
            <Link key={c.id} to={`/aula/docente/curso/${c.id}`} className="group flex flex-col gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--aula-primary)] hover:shadow-[var(--aula-shadow)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--aula-secondary)]">{c.status === 'publicado' ? 'Publicado' : c.status}</p>
                  <h2 className="mt-1 text-lg font-bold leading-snug">{c.title}</h2>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-[var(--aula-primary)] transition group-hover:translate-x-1" aria-hidden="true" />
              </div>
              {c.short_description && <p className="line-clamp-2 text-sm text-[var(--aula-muted)]">{c.short_description}</p>}
              <div className="mt-auto flex flex-wrap gap-2 text-xs">
                <Badge tone="info"><Users className="mr-1 h-3.5 w-3.5" aria-hidden="true" />{c.students} estudiantes</Badge>
                <Badge tone={c.pending_submissions ? 'warning' : 'neutral'}>{c.pending_submissions} entregas pendientes</Badge>
                <Badge tone="accent"><MessageSquare className="mr-1 h-3.5 w-3.5" aria-hidden="true" />{c.forums} foros</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

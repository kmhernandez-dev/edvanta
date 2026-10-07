import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarClock, Lock, Sparkles } from 'lucide-react';
import { fileUrl, get, post } from '../api';
import { useAsync } from '../hooks';
import { fmtDate, fmtMinutes } from '../labels';
import { useAulaSession } from '../session';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PageHeader, ProgressBar } from '../ui/Page';
import { EmptyState, ErrorState, LoadingBlock } from '../ui/States';

function CourseCard({ course }) {
  const started = course.progressPct > 0 || ['en_progreso', 'pendiente_revision'].includes(course.status);
  const cta = course.status === 'completado' ? 'Repasar curso' : started ? 'Continuar curso' : 'Empezar curso';
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
      <div className="relative aspect-[16/7]" style={{ background: 'var(--aula-gradient-hero)' }}>
        {course.coverFileId && (
          <img src={fileUrl(course.coverFileId)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        )}
        <div className="absolute left-3 top-3"><StatusBadge status={course.status} /></div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          {course.companyName && <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aula-secondary)]">{course.companyName}</p>}
          <h2 className="mt-0.5 text-lg font-bold leading-snug">{course.title}</h2>
          {course.shortDescription && <p className="mt-1 line-clamp-2 text-sm text-[var(--aula-muted)]">{course.shortDescription}</p>}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[var(--aula-muted)]">
            <span>{course.lessons.done} de {course.lessons.required} clases</span>
            <span className="font-semibold text-[var(--aula-text)]">{Math.round(course.progressPct)} %</span>
          </div>
          <ProgressBar value={course.progressPct} label={`Avance en ${course.title}`} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--aula-muted)]">
            {course.dueAt && (
              <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> Fecha límite: {fmtDate(course.dueAt)}</span>
            )}
            {course.durationMinutes ? <span>{fmtMinutes(course.durationMinutes)}</span> : null}
          </div>
        </div>
        {course.open ? (
          <Button to={`/aula/curso/${course.courseId}`} className="w-full">{cta}</Button>
        ) : (
          <p className="flex items-start gap-2 rounded-[var(--aula-radius)] bg-[var(--aula-neutral-soft)] px-3 py-2.5 text-xs text-[var(--aula-muted)]">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {course.closedMessage}
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * Tarjeta del catálogo: un curso de Edvanta en el que todavía no estás.
 *
 * No muestra avance ni fecha límite porque no hay matrícula: lo que hace
 * falta decidir aquí es si el curso te sirve, no cómo vas.
 */
function CatalogCard({ course, onEnroll, enrolling }) {
  const portada = course.coverFileId ? fileUrl(course.coverFileId) : course.coverUrl;
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
      <div className="relative aspect-[16/7]" style={{ background: 'var(--aula-gradient-hero)' }}>
        {portada && <img src={portada} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          {course.category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aula-secondary)]">{course.category}</p>
          )}
          <h3 className="mt-0.5 text-lg font-bold leading-snug">{course.title}</h3>
          {course.shortDescription && (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--aula-muted)]">{course.shortDescription}</p>
          )}
        </div>
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--aula-muted)]">
          <span>{course.lessons} {course.lessons === 1 ? 'clase' : 'clases'}</span>
          {course.durationMinutes ? <span>{fmtMinutes(course.durationMinutes)}</span> : null}
          {course.authorName && <span>{course.authorName}</span>}
        </div>
        <Button onClick={() => onEnroll(course.courseId)} disabled={enrolling} className="w-full">
          {enrolling ? 'Inscribiendo…' : 'Empezar curso'}
        </Button>
      </div>
    </article>
  );
}

export default function MiAula() {
  const { user } = useAulaSession();
  const navigate = useNavigate();
  const courses = useAsync(({ signal }) => get('/me/courses', { signal }), []);
  const catalog = useAsync(({ signal }) => get('/me/catalog', { signal }), []);
  const [enrolling, setEnrolling] = useState(null);
  const [enrollError, setEnrollError] = useState('');

  const inscribirse = async (courseId) => {
    setEnrolling(courseId);
    setEnrollError('');
    try {
      await post(`/me/catalog/${courseId}/enroll`);
      navigate(`/aula/curso/${courseId}`);
    } catch (e) {
      setEnrollError(e.message || 'No fue posible inscribirte.');
      // El curso pudo cerrarse mientras la pantalla estaba abierta.
      catalog.reload();
      setEnrolling(null);
    }
  };

  const list = courses.data || [];
  const active = list.filter((c) => c.status !== 'completado');
  const avg = list.length ? Math.round(list.reduce((s, c) => s + Number(c.progressPct || 0), 0) / list.length) : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Mi aula"
        title={`Hola, ${user.firstName}`}
        description={list.length
          ? `Tienes ${active.length} ${active.length === 1 ? 'curso pendiente' : 'cursos pendientes'} y un avance promedio de ${avg} %.`
          : 'Abajo están los cursos de Edvanta abiertos para ti.'}
      />
      {courses.loading && !courses.data && <LoadingBlock rows={3} label="Cargando tus cursos" />}
      {courses.error && <ErrorState error={courses.error} onRetry={courses.reload} />}
      {courses.data && !list.length && !(catalog.data || []).length && (
        <EmptyState
          icon={BookOpen}
          title="Aún no tienes cursos"
          description="Cuando Edvanta publique un curso o te asignen una capacitación aparecerá aquí."
        />
      )}
      {list.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => <CourseCard key={c.enrollmentId} course={c} />)}
        </div>
      )}

      {(catalog.data || []).length > 0 && (
        <section className={list.length > 0 ? 'mt-10' : ''}>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />
            Cursos de Edvanta
          </h2>
          <p className="mt-1 text-sm text-[var(--aula-muted)]">
            Abiertos para ti. Al empezar uno se suma a tus cursos y se guarda tu avance.
          </p>
          {enrollError && (
            <p className="mt-3 rounded-[var(--aula-radius)] bg-[var(--aula-danger-soft,#fef2f2)] px-3 py-2 text-sm font-semibold text-[var(--aula-danger,#b91c1c)]">
              {enrollError}
            </p>
          )}
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.data.map((c) => (
              <CatalogCard key={c.courseId} course={c} onEnroll={inscribirse} enrolling={enrolling === c.courseId} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

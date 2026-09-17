import { useParams } from 'react-router-dom';
import { CalendarClock, PartyPopper } from 'lucide-react';
import { get } from '../../api';
import { useAsync } from '../../hooks';
import { fmtDate, plural } from '../../labels';
import { StatusBadge } from '../../ui/Badge';
import { Alert, LoadingBlock } from '../../ui/States';
import { CourseOverview, ResourceList } from '../../player/CourseOverview';
import { flattenLessons } from '../../player/CoursePlayer';
import { useCourseData } from './CursoParticipante';

const DAY_MS = 24 * 60 * 60 * 1000;

export function progressLabel(enrollment) {
  const parts = [`${enrollment.lessons.done} de ${plural(enrollment.lessons.required, 'clase obligatoria', 'clases obligatorias')}`];
  if (enrollment.assessments.required) parts.push(`${enrollment.assessments.passed} de ${plural(enrollment.assessments.required, 'evaluación', 'evaluaciones')}`);
  if (enrollment.activities.required) parts.push(`${enrollment.activities.approved} de ${plural(enrollment.activities.required, 'actividad', 'actividades')}`);
  return parts.join(' · ');
}

function Notice({ enrollment }) {
  if (enrollment.status === 'completado') {
    return (
      <Alert tone="success" title="¡Completaste este curso!">
        {enrollment.completedAt ? `Lo terminaste el ${fmtDate(enrollment.completedAt)}. ` : ''}Puedes volver a repasar sus clases cuando quieras.
      </Alert>
    );
  }
  if (!enrollment.dueAt) return null;
  const due = new Date(enrollment.dueAt);
  const days = Math.ceil((due.getTime() - Date.now()) / DAY_MS);
  if (days < 0) {
    return (
      <Alert tone="warning" title={`La fecha límite fue el ${fmtDate(due)}`}>
        Todavía puedes avanzar; quien coordina tu capacitación verá la fecha en que termines.
      </Alert>
    );
  }
  return (
    <p className="flex items-center gap-2 text-sm text-[var(--aula-muted)]">
      <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
      Fecha límite: <strong className="text-[var(--aula-text)]">{fmtDate(due)}</strong>
      {days <= 7 && <span>({days <= 1 ? 'vence pronto' : `quedan ${days} días`})</span>}
    </p>
  );
}

function Resources({ courseId }) {
  const res = useAsync(({ signal }) => get(`/me/courses/${courseId}/resources`, { signal }), [courseId]);
  if (res.loading && !res.data) return <LoadingBlock rows={2} label="Cargando recursos" />;
  if (res.error) return <p className="text-sm text-[var(--aula-danger)]">{res.error.message}</p>;
  return <ResourceList resources={res.data.resources} categories={res.data.categories} />;
}

export default function PortadaCurso() {
  const { courseId } = useParams();
  const { data } = useCourseData();
  const e = data.enrollment;
  const lessons = flattenLessons(data.snapshot);
  const started = Boolean(e.firstAccessAt);
  const resume = data.resumeLessonId;
  const startLabel = e.status === 'completado'
    ? 'Repasar el curso'
    : started ? 'Continuar donde quedaste' : 'Empezar el curso';

  return (
    <CourseOverview
      snapshot={data.snapshot}
      backTo={{ to: '/aula', label: 'Mi aula' }}
      startHref={resume && lessons.length ? `/aula/curso/${courseId}/clase/${resume}` : null}
      startLabel={startLabel}
      lessonHref={(id) => `/aula/curso/${courseId}/clase/${id}`}
      lessonState={(id) => data.lessonStates[id] || { status: 'pendiente' }}
      progress={{ pct: e.progressPct, label: progressLabel(e) }}
      notice={(
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--aula-muted)]">
            <StatusBadge kind="enrollment" status={e.status} />
            {data.companyName && <span>Capacitación de {data.companyName}</span>}
            {e.status === 'completado' && <PartyPopper className="h-4 w-4 text-[var(--aula-success)]" aria-hidden="true" />}
          </div>
          <Notice enrollment={e} />
        </div>
      )}
      resources={data.resourcesEnabled ? <Resources courseId={courseId} /> : null}
    />
  );
}

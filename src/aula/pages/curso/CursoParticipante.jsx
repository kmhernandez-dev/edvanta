/**
 * Aula de un curso para el participante, por su nombre (/aula/curso-de-…/*)
 * o por la dirección vieja (/aula/curso/:courseId/*), que lleva a la nueva.
 * Carga el curso una vez y lo comparte con la portada, las clases y los
 * recursos. Las actualizaciones de avance conservan el mismo snapshot.
 */
import { Suspense, useCallback, useMemo } from 'react';
import { Link, Navigate, Outlet, useLocation, useOutletContext, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarClock, Eye, Lock, SearchX } from 'lucide-react';
import { get } from '../../api';
import { useAsync } from '../../hooks';
import { direccionVigente, rutasDelCurso } from '../../rutas';
import { useAulaSession } from '../../session';
import { Button } from '../../ui/Button';
import { PageLoader } from '../../ui/States';

export function useCourseData() {
  return useOutletContext();
}

const CLOSED_ICON = {
  curso_proximamente: CalendarClock,
  acceso_proximamente: CalendarClock,
  curso_sin_publicar: CalendarClock,
  curso_cerrado: Lock,
  curso_no_disponible: Lock,
};

function Unavailable({ error, courseId }) {
  const { user } = useAulaSession();
  const admin = user?.role === 'admin';
  const Icon = error.status === 404 ? SearchX : CLOSED_ICON[error.code] || Lock;
  const title = error.status === 404
    ? (admin ? 'Este curso no está entre tus cursos' : 'No encontramos este curso')
    : 'Este curso no está disponible ahora';
  return (
    <div className="aula-root flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--aula-accent-soft)] text-[var(--aula-accent)]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm leading-relaxed text-[var(--aula-muted)]">
          {admin && error.status === 404
            ? 'Los administradores no tienen inscripciones. Para ver el curso como un participante, usa su vista previa.'
            : error.message}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {admin && courseId && <Button icon={Eye} to={`/aula/admin/cursos/${courseId}/vista-previa`}>Abrir la vista previa</Button>}
          {admin && !courseId && <Button icon={ArrowLeft} to="/aula/admin/cursos">Ir a los cursos</Button>}
          {!admin && <Button icon={ArrowLeft} to="/aula">Volver a Mi aula</Button>}
        </div>
        {!admin && error.status === 404 && (
          <p className="text-xs text-[var(--aula-muted)]">Si crees que deberías tenerlo, escribe a quien coordina tu capacitación.</p>
        )}
      </div>
    </div>
  );
}

export default function CursoParticipante() {
  const { cursoRef, courseId: idViejo } = useParams();
  const ref = cursoRef ?? idViejo;
  const { pathname, search, hash } = useLocation();
  const valida = /^\d+$/.test(ref) || /^curso-[a-z0-9-]+$/i.test(ref);
  const course = useAsync(
    ({ signal }) => (valida ? get(`/me/courses/${encodeURIComponent(ref)}`, { signal }) : Promise.resolve(null)),
    [ref, valida],
  );
  const { setData } = course;
  const rutas = useMemo(() => (course.data ? rutasDelCurso(course.data) : null), [course.data]);

  // Aplica la respuesta de un evento de aprendizaje sin reemplazar el contenido.
  const applyProgress = useCallback((res) => {
    if (!res) return;
    setData((d) => (d ? {
      ...d,
      enrollment: res.enrollment || d.enrollment,
      lessonStates: res.lessonStates || d.lessonStates,
    } : d));
  }, [setData]);

  const setVideoProgress = useCallback((lessonId, blockId, info) => {
    setData((d) => (d ? {
      ...d,
      videoProgress: {
        ...d.videoProgress,
        [lessonId]: { ...(d.videoProgress?.[lessonId] || {}), [blockId]: { ...(d.videoProgress?.[lessonId]?.[blockId] || {}), ...info } },
      },
    } : d));
  }, [setData]);

  const numerico = /^\d+$/.test(ref) ? ref : null;
  if (!valida) {
    return <Unavailable error={{ status: 404, message: 'Revisa la dirección o vuelve a Mi aula.' }} courseId={null} />;
  }
  if (course.loading && !course.data) return <PageLoader label="Abriendo el curso…" />;
  if (course.error && !course.data) {
    if (course.error.status === 403 || course.error.status === 404) return <Unavailable error={course.error} courseId={numerico} />;
    return (
      <div className="aula-root flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p role="alert" className="text-sm text-[var(--aula-danger)]">{course.error.message}</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={course.reload}>Reintentar</Button>
          <Link to="/aula" className="self-center text-sm font-semibold text-[var(--aula-primary)] underline">Volver a Mi aula</Link>
        </div>
      </div>
    );
  }

  // Llegó por la dirección vieja (/aula/curso/53/clase/812), por un nombre
  // anterior o con mayúsculas: a la vigente, con la misma clase.
  const prefijo = cursoRef != null ? `/aula/${cursoRef}` : `/aula/curso/${idViejo}`;
  const destino = direccionVigente(pathname, prefijo, course.data, rutas);
  if (destino) return <Navigate to={`${destino}${search}${hash}`} replace />;

  // Las páginas del curso llaman a la API por id; la dirección es solo para leer.
  const courseId = course.data.courseId ?? course.data.snapshot.course.id;
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet context={{ data: course.data, reload: course.reload, applyProgress, setVideoProgress, courseId, rutas }} />
    </Suspense>
  );
}

/**
 * ============================================================
 *  MiAula.jsx — La página de inicio de quien estudia
 *
 *  Tres franjas, en este orden:
 *
 *   1. Continuar aprendiendo — lo que ya empezó, con su avance.
 *      Va primero porque es a lo que viene la mayoría.
 *   2. Cursos de Edvanta — los propios, los que vivimos aquí.
 *   3. Catálogo — los curados de otras plataformas.
 *
 *  Las tres se deslizan en horizontal: con muchos cursos, una
 *  cuadrícula obliga a bajar y a bajar para ver qué hay.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, CalendarClock, ChevronLeft, ChevronRight, ExternalLink, Lock, Sparkles,
} from 'lucide-react';
import { apiUrl } from '../../config/api';
import { fileUrl, get, post } from '../api';
import { useAsync } from '../hooks';
import { fmtDate, fmtMinutes } from '../labels';
import { useAulaSession } from '../session';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PageHeader, ProgressBar } from '../ui/Page';
import { EmptyState, ErrorState, LoadingBlock } from '../ui/States';

/* ── Franja deslizable ────────────────────────────────────── */

/**
 * Una fila de tarjetas que se desliza en horizontal.
 *
 * Las flechas se ocultan cuando no hay a dónde ir: una flecha que no
 * hace nada se pulsa igual y deja a la persona sin saber si falló ella
 * o la página.
 */
function Franja({ titulo, descripcion, icono: Icono, children, total }) {
  const pista = useRef(null);
  const [puede, setPuede] = useState({ antes: false, despues: false });

  const medir = () => {
    const el = pista.current;
    if (!el) return;
    setPuede({
      antes: el.scrollLeft > 8,
      despues: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  };

  useEffect(() => {
    medir();
    const el = pista.current;
    if (!el) return undefined;
    el.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir);
    return () => {
      el.removeEventListener('scroll', medir);
      window.removeEventListener('resize', medir);
    };
  }, [total]);

  const mover = (signo) => {
    const el = pista.current;
    if (!el) return;
    // Un poco menos de una pantalla, para que la última tarjeta vista
    // siga asomando y se entienda que la fila continúa.
    el.scrollBy({ left: signo * (el.clientWidth * 0.85), behavior: 'smooth' });
  };

  const flecha = 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--aula-border)] bg-white transition disabled:opacity-0 disabled:pointer-events-none hover:border-[var(--aula-secondary)]';

  return (
    <section className="mt-10 first:mt-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            {Icono && <Icono className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />}
            {titulo}
          </h2>
          {descripcion && <p className="mt-1 text-sm text-[var(--aula-muted)]">{descripcion}</p>}
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" className={flecha} onClick={() => mover(-1)} disabled={!puede.antes} aria-label={`Ver anteriores de ${titulo}`}>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className={flecha} onClick={() => mover(1)} disabled={!puede.despues} aria-label={`Ver más de ${titulo}`}>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={pista}
        className="-mx-4 mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
      >
        {children}
      </div>
    </section>
  );
}

const TARJETA = 'flex w-[17rem] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white sm:w-[19rem]';

function Portada({ src, children }) {
  return (
    <div className="relative aspect-[16/9] shrink-0" style={{ background: 'var(--aula-gradient-hero)' }}>
      {src && (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { e.currentTarget.remove(); }}
        />
      )}
      {children}
    </div>
  );
}

/* ── Un curso que ya está cursando ────────────────────────── */

function CursoEnMarcha({ course }) {
  const empezado = course.progressPct > 0 || ['en_progreso', 'pendiente_revision'].includes(course.status);
  const cta = course.status === 'completado' ? 'Repasar' : empezado ? 'Continuar curso' : 'Empezar curso';
  return (
    <article className={TARJETA}>
      <Portada src={course.coverFileId ? fileUrl(course.coverFileId) : course.coverUrl}>
        <div className="absolute left-3 top-3"><StatusBadge status={course.status} /></div>
      </Portada>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {course.companyName && <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aula-secondary)]">{course.companyName}</p>}
          <h3 className="mt-0.5 line-clamp-2 text-base font-bold leading-snug">{course.title}</h3>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[var(--aula-muted)]">
            <span>{course.lessons.done} de {course.lessons.required} clases</span>
            <span className="font-semibold text-[var(--aula-text)]">{Math.round(course.progressPct)} %</span>
          </div>
          <ProgressBar value={course.progressPct} label={`Avance en ${course.title}`} />
          {course.dueAt && (
            <span className="inline-flex items-center gap-1 text-xs text-[var(--aula-muted)]">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Hasta {fmtDate(course.dueAt)}
            </span>
          )}
        </div>
        {course.open ? (
          <Button to={`/aula/curso/${course.courseId}`} className="w-full">{cta}</Button>
        ) : (
          <p className="flex items-start gap-2 rounded-[var(--aula-radius)] bg-[var(--aula-neutral-soft)] px-3 py-2 text-xs text-[var(--aula-muted)]">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {course.closedMessage}
          </p>
        )}
      </div>
    </article>
  );
}

/* ── Un curso propio en el que todavía no está ────────────── */

function CursoDeEdvanta({ course, onEnroll, enrolling }) {
  return (
    <article className={TARJETA}>
      <Portada src={course.coverFileId ? fileUrl(course.coverFileId) : course.coverUrl} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {course.category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aula-secondary)]">{course.category}</p>
          )}
          <h3 className="mt-0.5 line-clamp-2 text-base font-bold leading-snug">{course.title}</h3>
          {course.shortDescription && (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--aula-muted)]">{course.shortDescription}</p>
          )}
        </div>
        <div className="mt-auto flex flex-wrap gap-x-3 text-xs text-[var(--aula-muted)]">
          <span>{course.lessons} {course.lessons === 1 ? 'clase' : 'clases'}</span>
          {course.durationMinutes ? <span>{fmtMinutes(course.durationMinutes)}</span> : null}
        </div>
        <Button onClick={() => onEnroll(course.courseId)} disabled={enrolling} className="w-full">
          {enrolling ? 'Inscribiendo…' : 'Empezar curso'}
        </Button>
      </div>
    </article>
  );
}

/* ── Un curso curado de otra plataforma ───────────────────── */

function CursoCurado({ curso }) {
  return (
    <article className={TARJETA}>
      <Portada src={curso.image_url} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aula-muted)]">{curso.provider}</p>
          <h3 className="mt-0.5 line-clamp-2 text-base font-bold leading-snug">{curso.title}</h3>
          {curso.short_description && (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--aula-muted)]">{curso.short_description}</p>
          )}
        </div>
        <a
          href={`/cursos/${curso.slug}`}
          className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white text-sm font-semibold transition hover:border-[var(--aula-secondary)]"
        >
          Ver el curso <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

/* ── La página ────────────────────────────────────────────── */

export default function MiAula() {
  const { user } = useAulaSession();
  const navigate = useNavigate();
  const courses = useAsync(({ signal }) => get('/me/courses', { signal }), []);
  const catalog = useAsync(({ signal }) => get('/me/catalog', { signal }), []);
  // El catálogo curado es público: no pasa por la sesión del aula.
  const curados = useAsync(async ({ signal }) => {
    const res = await fetch(apiUrl('/api/courses?limit=24'), { signal });
    if (!res.ok) throw new Error('No fue posible cargar el catálogo.');
    return (await res.json()).data || [];
  }, []);

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
      catalog.reload();
      setEnrolling(null);
    }
  };

  const enMarcha = courses.data || [];
  const propios = catalog.data || [];
  const externos = curados.data || [];
  const pendientes = enMarcha.filter((c) => c.status !== 'completado');
  const avance = enMarcha.length
    ? Math.round(enMarcha.reduce((s, c) => s + Number(c.progressPct || 0), 0) / enMarcha.length)
    : 0;
  const vacio = !enMarcha.length && !propios.length && !externos.length;

  return (
    <div>
      <PageHeader
        eyebrow="Mi aula"
        title={`Hola, ${user.firstName}`}
        description={enMarcha.length
          ? `Tienes ${pendientes.length} ${pendientes.length === 1 ? 'curso pendiente' : 'cursos pendientes'} y un avance promedio de ${avance} %.`
          : 'Estos son todos los cursos de Edvanta. Empieza por el que quieras.'}
      />

      {courses.loading && !courses.data && <LoadingBlock rows={3} label="Cargando tus cursos" />}
      {courses.error && <ErrorState error={courses.error} onRetry={courses.reload} />}

      {courses.data && vacio && (
        <EmptyState
          icon={BookOpen}
          title="Todavía no hay cursos publicados"
          description="En cuanto Edvanta publique uno aparecerá aquí."
        />
      )}

      {enMarcha.length > 0 && (
        <Franja
          titulo="Continuar aprendiendo"
          descripcion="Donde lo dejaste."
          total={enMarcha.length}
        >
          {enMarcha.map((c) => <CursoEnMarcha key={c.enrollmentId} course={c} />)}
        </Franja>
      )}

      {propios.length > 0 && (
        <Franja
          titulo="Cursos de Edvanta"
          descripcion="Nuestros cursos, con video y material propio. Al empezar uno se suma a los tuyos y se guarda tu avance."
          icono={Sparkles}
          total={propios.length}
        >
          {propios.map((c) => (
            <CursoDeEdvanta key={c.courseId} course={c} onEnroll={inscribirse} enrolling={enrolling === c.courseId} />
          ))}
        </Franja>
      )}

      {enrollError && (
        <p className="mt-4 rounded-[var(--aula-radius)] bg-[var(--aula-danger-soft,#fef2f2)] px-3 py-2 text-sm font-semibold text-[var(--aula-danger,#b91c1c)]">
          {enrollError}
        </p>
      )}

      {externos.length > 0 && (
        <Franja
          titulo="Catálogo"
          descripcion="Cursos seleccionados de otras plataformas, revisados uno a uno."
          total={externos.length}
        >
          {externos.map((c) => <CursoCurado key={c.id} curso={c} />)}
        </Franja>
      )}
    </div>
  );
}

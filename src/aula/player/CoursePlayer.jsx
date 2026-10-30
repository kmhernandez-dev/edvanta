/**
 * Reproductor de un curso: la clase, el temario y los apuntes.
 *
 * La composición es la de un aula de verdad: la clase ocupa el ancho
 * disponible y el índice del curso queda a la derecha, con el avance, las
 * pestañas y las clases. En el teléfono ese panel se abre como cajón.
 *
 * Lo usan la vista previa (modo «preview», sin registrar avance) y el
 * aula del participante.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Circle, CircleDot, Clock, Lock, Menu, PlayCircle, X,
} from 'lucide-react';
import { fmtMinutes } from '../labels';
import { BlockList } from '../blocks/BlockView';
import { ProgressBar } from '../ui/Page';
import PanelDelCurso from './PanelDelCurso';
import ParticipacionDeClase from './ParticipacionDeClase';
import '../aula-player.css';

export function flattenLessons(snapshot) {
  return (snapshot?.modules || []).flatMap((m, mi) => m.lessons.map((l, li) => ({
    ...l, moduleId: m.id, moduleTitle: m.title, moduleIndex: mi, lessonIndex: li,
  })));
}

const STATUS_ICON = {
  completado: { icon: CheckCircle2, cls: 'text-[var(--aula-success)]', label: 'Completada' },
  en_progreso: { icon: CircleDot, cls: 'text-[var(--aula-secondary)]', label: 'En progreso' },
  pendiente: { icon: Circle, cls: 'text-[var(--aula-subtle)]', label: 'Sin empezar' },
  bloqueado: { icon: Lock, cls: 'text-[var(--aula-subtle)]', label: 'Bloqueada' },
};

/** Miniatura de la clase a partir de su primer video de YouTube, si lo hay. */
function miniaturaDe(clase) {
  const video = (clase.blocks || []).find((b) => b.type === 'video' && b.data?.provider === 'youtube' && b.data?.videoId);
  return video ? `https://i.ytimg.com/vi/${video.data.videoId}/mqdefault.jpg` : null;
}

function Outline({ snapshot, currentId, lessonHref, lessonState, onNavigate }) {
  return (
    <nav aria-label="Contenido del curso" className="aula-player-outline">
      {snapshot.modules.map((m, mi) => {
        const enCurso = m.lessons.some((l) => l.id === currentId);
        const hechas = m.lessons.filter((l) => lessonState(l.id).status === 'completado').length;
        return (
          <details key={m.id} open={enCurso} className="aula-player-module">
            <summary>
              <span className="aula-player-module__num">{String(mi + 1).padStart(2, '0')}</span>
              <span className="aula-player-module__title">Unidad {mi + 1}. {m.title}</span>
              <span className="aula-player-module__count">{hechas}/{m.lessons.length}</span>
              <ChevronDown className="aula-player-module__chevron h-4 w-4" aria-hidden="true" />
            </summary>
            <ol className="aula-player-module__list">
              {m.lessons.map((l) => {
                const state = lessonState(l.id);
                const meta = STATUS_ICON[state.status] || STATUS_ICON.pendiente;
                const Icon = meta.icon;
                const current = l.id === currentId;
                const locked = state.status === 'bloqueado';
                const thumb = miniaturaDe(l);
                const body = (
                  <>
                    <span className="aula-player-thumb">
                      {thumb
                        ? <img src={thumb} alt="" loading="lazy" decoding="async" />
                        : <PlayCircle className="h-4 w-4" aria-hidden="true" />}
                    </span>
                    <span className="aula-player-lesson__body">
                      <span className="aula-player-lesson__title">{l.title}</span>
                      <span className="aula-player-lesson__meta">
                        {[l.durationMinutes ? fmtMinutes(l.durationMinutes) : null, l.isRequired ? null : 'Opcional']
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                    <Icon className={`aula-player-lesson__status h-3.5 w-3.5 ${meta.cls}`} aria-hidden="true" />
                    <span className="sr-only">{meta.label}{locked && state.reason ? `: ${state.reason}` : ''}</span>
                  </>
                );
                const cls = `aula-player-lesson ${current ? 'is-current' : ''}`;
                return (
                  <li key={l.id}>
                    {locked ? (
                      <span className={`${cls} cursor-not-allowed opacity-70`} title={state.reason}>{body}</span>
                    ) : (
                      <Link
                        to={lessonHref(l.id)}
                        onClick={onNavigate}
                        aria-current={current ? 'page' : undefined}
                        className={cls}
                      >
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </details>
        );
      })}
    </nav>
  );
}

export function CoursePlayer({
  snapshot, lessonId, lessonHref, backTo, mode = 'participant', lessonState = () => ({ status: 'pendiente' }),
  progress, renderCompletion, onMedia, banner, headerActions, footerActions, videoPositions, courseId = null,
}) {
  const lessons = useMemo(() => flattenLessons(snapshot), [snapshot]);
  const index = Math.max(0, lessons.findIndex((l) => l.id === lessonId));
  const lesson = lessons[index];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);
  const closeRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Índice en pantallas pequeñas: foco adentro, Escape lo cierra y el foco vuelve al botón.
  useEffect(() => {
    if (!menuOpen) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    const trigger = menuButtonRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      trigger?.focus();
    };
  }, [menuOpen]);

  // Al cambiar de clase, el foco y el desplazamiento vuelven al inicio.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [lessonId]);

  if (!lesson) {
    return <p className="p-6 text-sm text-[var(--aula-muted)]">Este curso todavía no tiene clases.</p>;
  }
  const nextState = next ? lessonState(next.id) : null;

  return (
    <div className="aula-root aula-player">
      <header className="aula-player__topbar">
        <div className="aula-player__bar">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--aula-radius-sm)] hover:bg-[var(--aula-neutral-soft)] lg:hidden"
            aria-label="Abrir el contenido del curso"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link to="/aula" className="aula-player__brand" aria-label="Aula Edvanta, ir al inicio">
            <img src="/img/logo-edvanta.png" alt="Edvanta" width="931" height="512" />
            <span>Aula</span>
          </Link>

          <span className="aula-player__divider" aria-hidden="true" />

          <Link to={backTo.to} className="aula-player__back">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{backTo.label}</span>
          </Link>

          <p className="aula-player__course">{snapshot.course.title}</p>

          {progress && (
            <div className="aula-player__progress">
              <ProgressBar value={progress.pct} label="Avance del curso" size="sm" />
              <span className="aula-player__progress-pct">{Math.round(progress.pct)} %</span>
            </div>
          )}

          {headerActions}
        </div>

        <div className="aula-player__line" aria-hidden="true">
          <span style={{ width: `${((index + 1) / lessons.length) * 100}%` }} />
        </div>
        {banner}
      </header>

      <div className="aula-player__layout">
        {menuOpen && (
          <div className="aula-player__drawer" role="dialog" aria-modal="true" aria-label="Panel del curso">
            <div className="aula-player__drawer-veil" aria-hidden="true" onClick={() => setMenuOpen(false)} />
            <div className="aula-player__drawer-panel">
              <div className="aula-player__drawer-head">
                <p>Contenido del curso</p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cerrar el contenido"
                  className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-[var(--aula-neutral-soft)]"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="aula-player__drawer-body">
                <PanelDelCurso
                  snapshot={snapshot}
                  lesson={lesson}
                  lessonHref={lessonHref}
                  lessonState={lessonState}
                  progress={progress}
                  Outline={Outline}
                  courseId={courseId}
                  onNavigate={() => setMenuOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        <main ref={mainRef} tabIndex={-1} className="aula-player__main focus:outline-none">
          <article className="aula-player__stage">
            <header className="aula-player__lesson">
              <p className="aula-player__module">
                <span>Unidad {lesson.moduleIndex + 1} · {lesson.moduleTitle}</span>
              </p>
              <h1 className="aula-player__h1">{lesson.title}</h1>
              {lesson.subtitle && <p className="aula-player__subtitle">{lesson.subtitle}</p>}
              <p className="aula-player__meta">
                <span>Clase {index + 1} de {lessons.length}</span>
                {lesson.durationMinutes ? (
                  <span><Clock className="h-3.5 w-3.5" aria-hidden="true" />{fmtMinutes(lesson.durationMinutes)}</span>
                ) : null}
                <span>{lesson.isRequired ? 'Obligatoria' : 'Opcional'}</span>
              </p>
            </header>

            <BlockList
              blocks={lesson.blocks}
              files={snapshot.files}
              positions={videoPositions?.[lesson.id]}
              onMedia={onMedia ? (block, info) => onMedia(lesson, block, info) : undefined}
            />

            <div className="aula-player__details">
              {renderCompletion?.(lesson)}

              <nav aria-label="Navegación entre clases" className="grid gap-3 sm:grid-cols-2">
                {prev ? (
                  <Link
                    to={lessonHref(prev.id)}
                    className="group flex min-w-0 items-center gap-3 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--aula-border-strong)] hover:shadow-[var(--aula-shadow)]"
                  >
                    <ChevronLeft className="h-5 w-5 shrink-0 text-[var(--aula-primary)] transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--aula-muted)]">Clase anterior</span>
                      <span className="block truncate text-sm font-semibold text-[var(--aula-text)]">{prev.title}</span>
                    </span>
                  </Link>
                ) : <span className="hidden sm:block" />}

                {next && (
                  nextState?.status === 'bloqueado' && mode !== 'preview' ? (
                    <p className="flex items-center gap-2 rounded-[var(--aula-radius-lg)] border border-dashed border-[var(--aula-border-strong)] p-4 text-sm text-[var(--aula-muted)]">
                      <Lock className="h-4 w-4 shrink-0" aria-hidden="true" /> {nextState.reason || 'Completa esta clase para continuar.'}
                    </p>
                  ) : (
                    <Link
                      to={lessonHref(next.id)}
                      className="group flex min-w-0 items-center justify-end gap-3 rounded-[var(--aula-radius-lg)] bg-[var(--aula-primary)] p-4 text-right text-white shadow-[0_14px_28px_-14px_rgba(8,46,134,.7)] transition hover:-translate-y-0.5 hover:bg-[var(--aula-primary-hover)]"
                    >
                      <span className="min-w-0">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-white/75">Siguiente clase</span>
                        <span className="block truncate text-sm font-semibold">{next.title}</span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  )
                )}
              </nav>

              {footerActions && <div className="aula-player__footer">{footerActions}</div>}

              {courseId && mode !== 'preview' && (
                <ParticipacionDeClase cursoId={courseId} claseId={lesson.id} />
              )}
            </div>
          </article>
        </main>

        <aside className="aula-player__side">
          <PanelDelCurso
            snapshot={snapshot}
            lesson={lesson}
            lessonHref={lessonHref}
            lessonState={lessonState}
            progress={progress}
            Outline={Outline}
            courseId={courseId}
          />
        </aside>
      </div>
    </div>
  );
}

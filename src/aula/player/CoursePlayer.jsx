/**
 * Reproductor de un curso: índice lateral, clase actual y navegación.
 * Lo usan la vista previa (modo «preview», sin registrar avance) y el
 * aula del participante.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Circle, CircleDot, Clock, Lock, Menu, X,
} from 'lucide-react';
import { fmtMinutes } from '../labels';
import { BlockList } from '../blocks/BlockView';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/Page';

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

function Outline({ snapshot, currentId, lessonHref, lessonState, onNavigate }) {
  return (
    <nav aria-label="Contenido del curso" className="flex flex-col gap-4">
      {snapshot.modules.map((m, mi) => (
        <section key={m.id} aria-labelledby={`mod-${m.id}`}>
          <h2 id={`mod-${m.id}`} className="px-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--aula-muted)]">
            Módulo {mi + 1} · <span className="normal-case tracking-normal">{m.title}</span>
          </h2>
          <ol className="mt-1.5 flex flex-col gap-0.5">
            {m.lessons.map((l) => {
              const state = lessonState(l.id);
              const meta = STATUS_ICON[state.status] || STATUS_ICON.pendiente;
              const Icon = meta.icon;
              const current = l.id === currentId;
              const locked = state.status === 'bloqueado';
              const body = (
                <>
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.cls}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug">{l.title}</span>
                    <span className="mt-0.5 block text-[11px] text-[var(--aula-muted)]">
                      {[l.durationMinutes ? fmtMinutes(l.durationMinutes) : null, l.isRequired ? null : 'Opcional'].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <span className="sr-only">. {meta.label}{locked && state.reason ? `: ${state.reason}` : ''}</span>
                </>
              );
              const cls = `flex items-start gap-2.5 rounded-[var(--aula-radius-sm)] px-2 py-2 ${
                current ? 'bg-[var(--aula-primary-soft)] font-semibold text-[var(--aula-primary)]' : 'text-[var(--aula-text)]'
              }`;
              return (
                <li key={l.id}>
                  {locked ? (
                    <span className={`${cls} cursor-not-allowed opacity-70`} title={state.reason}>{body}</span>
                  ) : (
                    <Link to={lessonHref(l.id)} onClick={onNavigate} aria-current={current ? 'page' : undefined}
                      className={`${cls} ${current ? '' : 'hover:bg-[var(--aula-neutral-soft)]'}`}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </nav>
  );
}

export function CoursePlayer({
  snapshot, lessonId, lessonHref, backTo, mode = 'participant', lessonState = () => ({ status: 'pendiente' }),
  progress, renderCompletion, onMedia, banner, headerActions, videoPositions,
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
    <div className="aula-root min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--aula-border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <button ref={menuButtonRef} type="button" onClick={() => setMenuOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--aula-radius-sm)] hover:bg-[var(--aula-neutral-soft)] lg:hidden"
            aria-label="Abrir el contenido del curso">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link to={backTo.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aula-muted)] hover:text-[var(--aula-primary)]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{backTo.label}</span>
          </Link>
          <p className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--aula-text)]">{snapshot.course.title}</p>
          {progress && (
            <div className="hidden w-48 items-center gap-2 md:flex">
              <ProgressBar value={progress.pct} label="Avance del curso" size="sm" />
              <span className="text-xs font-semibold tabular-nums text-[var(--aula-muted)]">{Math.round(progress.pct)} %</span>
            </div>
          )}
          {headerActions}
        </div>
        {banner}
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-80 shrink-0 overflow-y-auto border-r border-[var(--aula-border)] py-6 pr-4 lg:block">
          <Outline snapshot={snapshot} currentId={lesson.id} lessonHref={lessonHref} lessonState={lessonState} />
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Contenido del curso">
            <div className="absolute inset-0 bg-[rgba(23,34,59,0.45)]" aria-hidden="true" onClick={() => setMenuOpen(false)} />
            <div className="absolute inset-y-0 left-0 flex w-[min(88vw,340px)] flex-col bg-white shadow-[var(--aula-shadow-lg)]">
              <div className="flex items-center justify-between border-b border-[var(--aula-border)] px-4 py-3">
                <p className="text-sm font-bold">Contenido del curso</p>
                <button ref={closeRef} type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar el contenido" className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-[var(--aula-neutral-soft)]">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <Outline snapshot={snapshot} currentId={lesson.id} lessonHref={lessonHref} lessonState={lessonState} onNavigate={() => setMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <main ref={mainRef} tabIndex={-1} className="min-w-0 flex-1 py-6 focus:outline-none sm:py-8">
          <article className="mx-auto max-w-3xl">
            <header className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--aula-secondary)]">
                Módulo {lesson.moduleIndex + 1} · {lesson.moduleTitle}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold leading-tight text-[var(--aula-primary)] sm:text-3xl">{lesson.title}</h1>
              {lesson.subtitle && <p className="mt-1 text-base text-[var(--aula-muted)]">{lesson.subtitle}</p>}
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--aula-muted)]">
                <span>Clase {index + 1} de {lessons.length}</span>
                {lesson.durationMinutes ? <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{fmtMinutes(lesson.durationMinutes)}</span> : null}
                <span>{lesson.isRequired ? 'Obligatoria' : 'Opcional'}</span>
              </p>
            </header>

            <BlockList
              blocks={lesson.blocks}
              files={snapshot.files}
              positions={videoPositions?.[lesson.id]}
              onMedia={onMedia ? (block, info) => onMedia(lesson, block, info) : undefined}
            />

            <footer className="mt-10 flex flex-col gap-4 border-t border-[var(--aula-border)] pt-6">
              {renderCompletion?.(lesson)}
              <nav aria-label="Navegación entre clases" className="flex flex-wrap items-center justify-between gap-3">
                {prev ? (
                  <Button variant="secondary" icon={ChevronLeft} to={lessonHref(prev.id)}>
                    <span className="sr-only">Clase anterior: </span><span className="max-w-[16ch] truncate sm:max-w-[28ch]">{prev.title}</span>
                  </Button>
                ) : <span />}
                {next && (
                  nextState?.status === 'bloqueado' && mode !== 'preview' ? (
                    <p className="flex items-center gap-2 text-sm text-[var(--aula-muted)]">
                      <Lock className="h-4 w-4" aria-hidden="true" /> {nextState.reason || 'Completa esta clase para continuar.'}
                    </p>
                  ) : (
                    <Button iconRight={ChevronRight} to={lessonHref(next.id)}>
                      <span className="sr-only">Clase siguiente: </span><span className="max-w-[16ch] truncate sm:max-w-[28ch]">{next.title}</span>
                    </Button>
                  )
                )}
              </nav>
            </footer>
          </article>
        </main>
      </div>
    </div>
  );
}

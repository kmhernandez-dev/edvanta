/**
 * Portada de un curso: de qué trata, qué se logra y su estructura.
 * La usan la vista previa y el aula del participante.
 */
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, ChevronDown, Circle, CircleDot, Clock, Download, ExternalLink, Layers, Library, Lock, PlayCircle, Target,
} from 'lucide-react';
import { fileUrl } from '../api';
import { fmtBytes, fmtMinutes, plural } from '../labels';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/Page';
import { RichText } from '../ui/RichText';

const LESSON_ICON = {
  completado: { icon: CheckCircle2, cls: 'text-[var(--aula-success)]', label: 'Completada' },
  en_progreso: { icon: CircleDot, cls: 'text-[var(--aula-secondary)]', label: 'En progreso' },
  pendiente: { icon: Circle, cls: 'text-[var(--aula-subtle)]', label: 'Sin empezar' },
  bloqueado: { icon: Lock, cls: 'text-[var(--aula-subtle)]', label: 'Bloqueada' },
};

export function ResourceList({ resources, categories }) {
  if (!resources.length) return <p className="text-sm text-[var(--aula-muted)]">No hay recursos disponibles por ahora.</p>;
  const groups = [
    ...categories.map((c) => ({ ...c, items: resources.filter((r) => r.categoryId === c.id) })),
    { id: 'none', name: categories.length ? 'Otros' : null, items: resources.filter((r) => !r.categoryId || !categories.some((c) => c.id === r.categoryId)) },
  ].filter((g) => g.items.length);
  return (
    <div className="flex flex-col gap-5">
      {groups.map((g) => (
        <section key={g.id} aria-label={g.name || 'Recursos'}>
          {g.name && <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--aula-muted)]">{g.name}</h3>}
          <ul className="grid gap-3 sm:grid-cols-2">
            {g.items.map((r) => (
              <li key={r.id} className="flex flex-col gap-2 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
                <p className="font-semibold">{r.title}</p>
                {r.description && <p className="text-sm text-[var(--aula-muted)]">{r.description}</p>}
                <p className="text-xs text-[var(--aula-subtle)]">Versión {r.current.number}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {r.current.file ? (
                    <>
                      <Button size="sm" variant="secondary" href={fileUrl(r.current.fileId)} target="_blank" rel="noopener">Ver</Button>
                      {r.allowDownload && (
                        <Button size="sm" variant="ghost" icon={Download} href={fileUrl(r.current.fileId, { download: true })}>
                          {r.current.file.extension?.toUpperCase()} · {fmtBytes(r.current.file.size)}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button size="sm" variant="secondary" icon={ExternalLink} href={r.current.url} target="_blank" rel="noopener noreferrer">Abrir enlace</Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Anillo de avance: el número grande y el trazo que se llena. */
function AnilloDeAvance({ pct }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, Number(pct) || 0));
  return (
    <div className="relative h-28 w-28 shrink-0" role="img" aria-label={`Avance del curso: ${Math.round(v)} %`}>
      <svg viewBox="0 0 100 100" className="ds-ring h-full w-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="aula-anillo" x1="0" x2="1">
            <stop offset="0" stopColor="#8179C9" /><stop offset="1" stopColor="#28A8AF" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--aula-primary-soft)" strokeWidth="9" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="url(#aula-anillo)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * v) / 100} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-[var(--aula-font-display)] text-2xl font-extrabold text-[var(--aula-primary)]">{Math.round(v)}%</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--aula-muted)]">avance</span>
      </span>
    </div>
  );
}

export function CourseOverview({
  snapshot, backTo, startHref, startLabel = 'Empezar', lessonHref, lessonState = () => ({ status: 'pendiente' }),
  progress, banner, notice, resources,
}) {
  const { course, modules } = snapshot;
  const lessons = modules.flatMap((m) => m.lessons);
  // La siguiente clase por hacer: lo primero que busca quien vuelve al curso.
  const siguiente = lessons.find((l) => {
    const s = lessonState(l.id).status;
    return s !== 'completado' && s !== 'bloqueado';
  });
  const moduloSiguiente = siguiente ? modules.findIndex((m) => m.lessons.some((l) => l.id === siguiente.id)) : 0;
  const hechas = (m) => m.lessons.filter((l) => lessonState(l.id).status === 'completado').length;

  return (
    <div className="aula-root min-h-screen">
      {banner}
      {/* Cabecera compacta: qué curso es, cuánto llevas y por dónde sigues. */}
      <header className="relative overflow-hidden border-b border-[var(--aula-border)]" style={{ background: 'var(--aula-gradient-hero)' }}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#8981CE]/20 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-6 sm:py-9">
          <Link to={backTo.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aula-muted)] hover:text-[var(--aula-primary)]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {backTo.label}
          </Link>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <h1 className="text-[1.65rem] font-extrabold leading-tight text-[var(--aula-primary)] sm:text-[2.1rem]">{course.title}</h1>
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[var(--aula-text)]">
                <span className="inline-flex items-center gap-1.5"><Layers className="h-4 w-4 text-[var(--aula-success)]" aria-hidden="true" />{plural(modules.length, 'módulo')} · {plural(lessons.length, 'clase')}</span>
                {course.durationMinutes ? <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-[var(--aula-success)]" aria-hidden="true" />{fmtMinutes(course.durationMinutes)}</span> : null}
              </p>
              {notice}
              {startHref && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button size="lg" icon={PlayCircle} to={startHref}>{startLabel}</Button>
                  {siguiente && progress && progress.pct > 0 && (
                    <span className="text-sm text-[var(--aula-muted)]">Sigue con <strong className="text-[var(--aula-text)]">{siguiente.title}</strong></span>
                  )}
                </div>
              )}
            </div>
            {progress && (
              <div className="flex items-center gap-4 rounded-[var(--aula-radius-lg)] bg-white/80 p-4 shadow-[var(--aula-shadow)] backdrop-blur md:w-72">
                <AnilloDeAvance pct={progress.pct} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--aula-text)]">Tu progreso</p>
                  <p className="mt-0.5 text-xs leading-5 text-[var(--aula-muted)]">{progress.label}</p>
                  <div className="mt-2"><ProgressBar value={progress.pct} label="Avance del curso" size="sm" /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
          <div className="flex min-w-0 flex-col gap-8">
            {/* El temario primero: en módulos que se abren y cierran. */}
            <section aria-labelledby="ov-content">
              <h2 id="ov-content" className="text-lg font-bold">Contenido del curso</h2>
              <ol className="mt-3 flex flex-col gap-3">
                {modules.map((m, mi) => {
                  const n = hechas(m);
                  return (
                    <li key={m.id}>
                      <details open={mi === moduloSiguiente} className="group overflow-hidden rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white shadow-[0_1px_2px_rgba(23,34,59,.04)]">
                        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 hover:bg-[var(--aula-surface-muted)] [&::-webkit-details-marker]:hidden">
                          <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-sm font-extrabold ${n === m.lessons.length && n > 0 ? 'bg-[var(--aula-success-soft)] text-[var(--aula-success)]' : 'bg-[var(--aula-primary-soft)] text-[var(--aula-primary)]'}`}>
                            {n === m.lessons.length && n > 0 ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : mi + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--aula-secondary)]">Módulo {mi + 1}</span>
                            <span className="block font-bold leading-snug">{m.title}</span>
                          </span>
                          <span className="hidden shrink-0 text-xs font-semibold text-[var(--aula-muted)] sm:block">{n}/{m.lessons.length}</span>
                          <ChevronDown className="h-5 w-5 shrink-0 text-[var(--aula-primary)] transition-transform group-open:rotate-180" aria-hidden="true" />
                        </summary>
                        {m.description && <p className="px-4 pb-2 text-sm text-[var(--aula-muted)]">{m.description}</p>}
                        <ol className="divide-y divide-[var(--aula-border)] border-t border-[var(--aula-border)]">
                          {m.lessons.map((l) => {
                            const state = lessonState(l.id);
                            const meta = LESSON_ICON[state.status] || LESSON_ICON.pendiente;
                            const Icon = meta.icon;
                            const locked = state.status === 'bloqueado';
                            const esSiguiente = siguiente?.id === l.id;
                            const body = (
                              <>
                                <Icon className={`h-4 w-4 shrink-0 ${meta.cls}`} aria-hidden="true" />
                                <span className={`min-w-0 flex-1 text-sm ${esSiguiente ? 'font-bold text-[var(--aula-primary)]' : ''}`}>{l.title}</span>
                                {esSiguiente && <span className="shrink-0 rounded-full bg-[var(--aula-secondary-soft)] px-2 py-0.5 text-[11px] font-bold text-[var(--aula-success)]">Siguiente</span>}
                                <span className="shrink-0 text-xs text-[var(--aula-muted)]">
                                  {[l.isRequired ? null : 'Opcional', l.durationMinutes ? fmtMinutes(l.durationMinutes) : null].filter(Boolean).join(' · ')}
                                </span>
                                <span className="sr-only">. {meta.label}</span>
                              </>
                            );
                            return (
                              <li key={l.id}>
                                {locked || !lessonHref ? (
                                  <span className="flex items-center gap-3 px-4 py-3 opacity-80" title={state.reason}>{body}</span>
                                ) : (
                                  <Link to={lessonHref(l.id)} className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--aula-surface-muted)] ${esSiguiente ? 'bg-[var(--aula-secondary-soft)]/50' : ''}`}>{body}</Link>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      </details>
                    </li>
                  );
                })}
              </ol>
            </section>
            {(course.objective || course.learningOutcomes.length > 0) && (
              <section aria-labelledby="ov-goals" className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-5">
                <h2 id="ov-goals" className="flex items-center gap-2 text-lg font-bold"><Target className="h-5 w-5 text-[var(--aula-secondary)]" aria-hidden="true" />Qué vas a lograr</h2>
                {course.objective && <p className="mt-2 text-sm leading-relaxed">{course.objective}</p>}
                {course.learningOutcomes.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2">
                    {course.learningOutcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--aula-success)]" aria-hidden="true" />{o}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
            {/* La descripción completa queda a mano, sin empujar el temario hacia abajo. */}
            {course.descriptionHtml && (
              <details className="group rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                  Sobre el curso
                  <ChevronDown className="h-5 w-5 text-[var(--aula-primary)] transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-5">
                  {course.shortDescription && <p className="mb-3 text-base text-[var(--aula-muted)]">{course.shortDescription}</p>}
                  <RichText html={course.descriptionHtml} />
                </div>
              </details>
            )}
          </div>
          <aside className="flex flex-col gap-4">
            {course.audience && (
              <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
                <h2 className="text-sm font-bold">Dirigido a</h2>
                <p className="mt-1 text-sm text-[var(--aula-muted)]">{course.audience}</p>
              </section>
            )}
            {course.prerequisites && (
              <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
                <h2 className="text-sm font-bold">Requisitos previos</h2>
                <p className="mt-1 text-sm text-[var(--aula-muted)]">{course.prerequisites}</p>
              </section>
            )}
            <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
              <h2 className="text-sm font-bold">Para completar el curso</h2>
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-[var(--aula-muted)]">
                <li>
                  {lessons.filter((l) => l.isRequired).length === 1
                    ? 'Completa la clase obligatoria.'
                    : `Completa las ${lessons.filter((l) => l.isRequired).length} clases obligatorias.`}
                </li>
                {snapshot.rules.sequential && <li>Las clases obligatorias se abren en orden.</li>}
                {lessons.some((l) => l.completionRule === 'video') && <li>Las clases de video se completan al ver al menos el {snapshot.rules.videoCompletionPct} %.</li>}
              </ul>
            </section>
            {resources && (
              <section aria-labelledby="ov-res" className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
                <h2 id="ov-res" className="flex items-center gap-2 text-sm font-bold"><Library className="h-4 w-4" aria-hidden="true" />Recursos de trabajo</h2>
                <div className="mt-3">{resources}</div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

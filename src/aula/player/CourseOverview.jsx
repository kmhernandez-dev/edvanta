/**
 * Portada de un curso: de qué trata, qué se logra y su estructura.
 * La usan la vista previa y el aula del participante.
 */
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Circle, CircleDot, Clock, Download, ExternalLink, Library, Lock, PlayCircle, Target,
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

export function CourseOverview({
  snapshot, backTo, startHref, startLabel = 'Empezar', lessonHref, lessonState = () => ({ status: 'pendiente' }),
  progress, banner, notice, resources,
}) {
  const { course, modules } = snapshot;
  const lessons = modules.flatMap((m) => m.lessons);
  return (
    <div className="aula-root min-h-screen">
      {banner}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <Link to={backTo.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aula-muted)] hover:text-[var(--aula-primary)]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {backTo.label}
        </Link>

        <header className="mt-4 overflow-hidden rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
          <div className="grid md:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-col gap-3 p-6 sm:p-8">
              <h1 className="text-2xl font-extrabold leading-tight text-[var(--aula-primary)] sm:text-3xl">{course.title}</h1>
              {course.shortDescription && <p className="text-base text-[var(--aula-muted)]">{course.shortDescription}</p>}
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--aula-muted)]">
                <span>{plural(modules.length, 'módulo')} · {plural(lessons.length, 'clase')}</span>
                {course.durationMinutes ? <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden="true" />{fmtMinutes(course.durationMinutes)}</span> : null}
              </p>
              {progress && (
                <div className="mt-1 flex flex-col gap-1.5">
                  <ProgressBar value={progress.pct} label="Avance del curso" />
                  <p className="text-xs text-[var(--aula-muted)]">{Math.round(progress.pct)} % · {progress.label}</p>
                </div>
              )}
              {notice}
              {startHref && (
                <div className="mt-2"><Button size="lg" icon={PlayCircle} to={startHref}>{startLabel}</Button></div>
              )}
            </div>
            <div className="min-h-[180px]" style={{ background: 'var(--aula-gradient-hero)' }}>
              {course.coverFileId && <img src={fileUrl(course.coverFileId)} alt="" className="h-full w-full object-cover" />}
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-8">
            {course.descriptionHtml && (
              <section aria-labelledby="ov-about">
                <h2 id="ov-about" className="text-lg font-bold">Sobre el curso</h2>
                <RichText html={course.descriptionHtml} />
              </section>
            )}
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
            <section aria-labelledby="ov-content">
              <h2 id="ov-content" className="text-lg font-bold">Contenido</h2>
              <ol className="mt-3 flex flex-col gap-3">
                {modules.map((m, mi) => (
                  <li key={m.id} className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
                    <div className="border-b border-[var(--aula-border)] px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--aula-secondary)]">Módulo {mi + 1}</p>
                      <h3 className="font-bold">{m.title}</h3>
                      {m.description && <p className="mt-0.5 text-sm text-[var(--aula-muted)]">{m.description}</p>}
                    </div>
                    <ol className="divide-y divide-[var(--aula-border)]">
                      {m.lessons.map((l) => {
                        const state = lessonState(l.id);
                        const meta = LESSON_ICON[state.status] || LESSON_ICON.pendiente;
                        const Icon = meta.icon;
                        const locked = state.status === 'bloqueado';
                        const body = (
                          <>
                            <Icon className={`h-4 w-4 shrink-0 ${meta.cls}`} aria-hidden="true" />
                            <span className="min-w-0 flex-1 text-sm">{l.title}</span>
                            <span className="shrink-0 text-xs text-[var(--aula-muted)]">
                              {[l.isRequired ? null : 'Opcional', l.durationMinutes ? fmtMinutes(l.durationMinutes) : null].filter(Boolean).join(' · ')}
                            </span>
                            <span className="sr-only">. {meta.label}</span>
                          </>
                        );
                        return (
                          <li key={l.id}>
                            {locked || !lessonHref ? (
                              <span className="flex items-center gap-3 px-4 py-2.5 opacity-80" title={state.reason}>{body}</span>
                            ) : (
                              <Link to={lessonHref(l.id)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--aula-neutral-soft)]">{body}</Link>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </li>
                ))}
              </ol>
            </section>
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

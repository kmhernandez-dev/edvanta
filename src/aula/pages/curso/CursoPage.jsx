import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/** Marco de una página interior del curso (evaluación, quiz, actividad o foro). */
export function CursoPage({ title, subtitle, backTo, backLabel = 'Volver', actions, children, wide = false }) {
  return (
    <div className="aula-root min-h-screen bg-white">
      <header className="border-b border-[var(--aula-border)] bg-white">
        <div className={`mx-auto px-4 py-5 sm:px-6 ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}>
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--aula-muted)] hover:text-[var(--aula-primary)]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {backLabel}
          </Link>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold leading-tight text-[var(--aula-primary)] sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--aula-muted)]">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
          </div>
        </div>
      </header>
      <main className={`mx-auto px-4 py-7 sm:px-6 sm:py-9 ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}>
        {children}
      </main>
    </div>
  );
}

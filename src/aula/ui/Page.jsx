import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function PageHeader({ title, description, actions, back, eyebrow }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link to={back.to} className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--aula-muted)] hover:text-[var(--aula-primary)]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {back.label}
          </Link>
        )}
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--aula-secondary)]">{eyebrow}</p>}
        <h1 className="text-2xl font-extrabold text-[var(--aula-primary)] sm:text-[1.75rem]">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[var(--aula-muted)]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Card({ title, description, actions, children, className = '', bodyClassName = '' }) {
  return (
    <section className={`rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-[var(--aula-surface)] ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--aula-border)] px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-base font-bold">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-[var(--aula-muted)]">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

const STAT_TONE = {
  neutral: 'text-[var(--aula-text)]',
  primary: 'text-[var(--aula-primary)]',
  success: 'text-[var(--aula-success)]',
  warning: 'text-[var(--aula-warning)]',
  danger: 'text-[var(--aula-danger)]',
};

export function StatCard({ label, value, hint, tone = 'neutral', icon: Icon, to }) {
  const body = (
    <>
      <div className="flex items-center gap-2 text-sm text-[var(--aula-muted)]">
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        <span>{label}</span>
      </div>
      <p className={`mt-2 font-[family-name:var(--aula-font-display)] text-3xl font-extrabold tabular-nums ${STAT_TONE[tone]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-[var(--aula-muted)]">{hint}</p>}
    </>
  );
  const cls = 'block rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-[var(--aula-surface)] p-5';
  return to
    ? <Link to={to} className={`${cls} transition-colors hover:border-[var(--aula-primary)]`}>{body}</Link>
    : <div className={cls}>{body}</div>;
}

export function ProgressBar({ value, label, tone = 'secondary', size = 'md' }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const color = tone === 'primary' ? 'bg-[var(--aula-primary)]' : tone === 'success' ? 'bg-[var(--aula-success)]' : 'bg-[var(--aula-secondary)]';
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`w-full overflow-hidden rounded-full bg-[var(--aula-neutral-soft)] ${size === 'sm' ? 'h-1.5' : 'h-2'}`}
    >
      <div className={`h-full rounded-full ${color} transition-[width] duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

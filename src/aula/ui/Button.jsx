import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-[var(--aula-primary)] text-white hover:bg-[var(--aula-primary-hover)] shadow-sm',
  secondary: 'bg-[var(--aula-surface)] text-[var(--aula-primary)] border border-[var(--aula-border-strong)] hover:border-[var(--aula-primary)] hover:bg-[var(--aula-primary-soft)]',
  soft: 'bg-[var(--aula-primary-soft)] text-[var(--aula-primary)] hover:bg-[#D6E1F7]',
  ghost: 'text-[var(--aula-muted)] hover:bg-[var(--aula-neutral-soft)] hover:text-[var(--aula-text)]',
  danger: 'bg-[var(--aula-danger)] text-white hover:brightness-95 shadow-sm',
  'danger-soft': 'bg-[var(--aula-danger-soft)] text-[var(--aula-danger)] hover:brightness-95',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-[var(--aula-radius-sm)]',
  md: 'h-11 px-4 text-sm gap-2 rounded-[var(--aula-radius)]',
  lg: 'h-12 px-6 text-base gap-2 rounded-[var(--aula-radius)]',
};

export function Button({
  variant = 'primary', size = 'md', loading = false, icon: Icon, iconRight: IconRight,
  to, href, className = '', disabled, children, loadingLabel, ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center font-semibold transition-colors select-none whitespace-nowrap',
    'disabled:opacity-55 disabled:cursor-not-allowed',
    VARIANTS[variant], SIZES[size], className,
  ].join(' ');
  const content = (
    <>
      {loading
        ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        : Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
      <span>{loading && loadingLabel ? loadingLabel : children}</span>
      {!loading && IconRight && <IconRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
    </>
  );
  if (to) return <Link to={to} className={classes} {...rest}>{content}</Link>;
  if (href) return <a href={href} className={classes} {...rest}>{content}</a>;
  return (
    <button type="button" className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
}

export function IconButton({ icon: Icon, label, variant = 'ghost', size = 'md', className = '', loading, ...rest }) {
  const dims = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={loading || rest.disabled}
      className={`inline-flex ${dims} items-center justify-center rounded-[var(--aula-radius-sm)] transition-colors disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}

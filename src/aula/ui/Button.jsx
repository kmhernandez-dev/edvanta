import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-[var(--aula-primary)] text-white hover:bg-[var(--aula-primary-hover)] shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_10px_22px_-10px_rgba(8,46,134,.6)] hover:-translate-y-px',
  secondary: 'bg-[var(--aula-surface)] text-[var(--aula-primary)] border border-[var(--aula-border-strong)] shadow-[0_1px_2px_rgba(20,35,63,.05)] hover:border-[#8FD0D4] hover:bg-[#F0FAF9] hover:-translate-y-px',
  soft: 'bg-[var(--aula-primary-soft)] text-[var(--aula-primary)] hover:bg-[#D6E1F7]',
  ghost: 'text-[var(--aula-muted)] hover:bg-[var(--aula-neutral-soft)] hover:text-[var(--aula-text)]',
  danger: 'bg-[var(--aula-danger)] text-white hover:brightness-95 shadow-sm',
  'danger-soft': 'bg-[var(--aula-danger-soft)] text-[var(--aula-danger)] hover:brightness-95',
};

const SIZES = {
  sm: 'h-10 px-3.5 text-sm gap-1.5 rounded-[10px]',
  md: 'h-11 px-5 text-sm gap-2 rounded-[14px]',
  lg: 'h-[52px] px-6 text-base gap-2 rounded-[14px]',
};

export function Button({
  variant = 'primary', size = 'md', loading = false, icon: Icon, iconRight: IconRight,
  to, href, className = '', disabled, children, loadingLabel, ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none whitespace-nowrap active:translate-y-0 active:scale-[.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F7480] focus-visible:ring-offset-2',
    'disabled:opacity-55 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none',
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

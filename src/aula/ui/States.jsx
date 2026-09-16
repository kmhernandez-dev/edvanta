import { AlertTriangle, CheckCircle2, Info, Loader2, Lock, SearchX, WifiOff, XCircle } from 'lucide-react';
import { Button } from './Button';

export function Spinner({ label = 'Cargando', className = '' }) {
  return (
    <span role="status" className={`inline-flex items-center gap-2 text-sm text-[var(--aula-muted)] ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function PageLoader({ label = 'Cargando…' }) {
  return (
    <div className="aula-root flex min-h-[60vh] items-center justify-center">
      <Spinner label={label} />
    </div>
  );
}

/** Marcador de carga para bloques y tablas. */
export function LoadingBlock({ rows = 3, label = 'Cargando información' }) {
  return (
    <div role="status" aria-label={label} className="flex flex-col gap-3 py-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-[var(--aula-radius)] bg-[var(--aula-neutral-soft)]" />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

const TONES = {
  info: { icon: Info, box: 'bg-[var(--aula-info-soft)] text-[var(--aula-info)] border-[#C9D6F2]' },
  success: { icon: CheckCircle2, box: 'bg-[var(--aula-success-soft)] text-[var(--aula-success)] border-[#BEE6E3]' },
  warning: { icon: AlertTriangle, box: 'bg-[var(--aula-warning-soft)] text-[var(--aula-warning)] border-[#F5DDAD]' },
  danger: { icon: XCircle, box: 'bg-[var(--aula-danger-soft)] text-[var(--aula-danger)] border-[#F9C9C4]' },
};

export function Alert({ tone = 'info', title, children, action, className = '' }) {
  const { icon: Icon, box } = TONES[tone];
  return (
    <div role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'} className={`flex gap-3 rounded-[var(--aula-radius)] border px-4 py-3 ${box} ${className}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1 text-sm leading-relaxed">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon = SearchX, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-3 rounded-[var(--aula-radius-lg)] border border-dashed border-[var(--aula-border-strong)] bg-[var(--aula-surface)] px-6 py-12 text-center ${className}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--aula-accent-soft)] text-[var(--aula-accent)]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-base font-bold text-[var(--aula-text)]">{title}</h3>
      {description && <p className="max-w-md text-sm leading-relaxed text-[var(--aula-muted)]">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

/** Estado de error con la explicación del servidor y la siguiente acción posible. */
export function ErrorState({ error, onRetry, className = '' }) {
  const offline = error?.code === 'sin_conexion';
  const denied = error?.status === 403;
  const Icon = offline ? WifiOff : denied ? Lock : AlertTriangle;
  const title = offline ? 'Sin conexión con el aula' : denied ? 'Permiso insuficiente' : error?.status === 404 ? 'No encontrado' : 'No pudimos cargar esta información';
  return (
    <div role="alert" className={`flex flex-col items-center gap-3 rounded-[var(--aula-radius-lg)] border border-[#F9C9C4] bg-[var(--aula-surface)] px-6 py-10 text-center ${className}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--aula-danger-soft)] text-[var(--aula-danger)]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-base font-bold">{title}</h3>
      <p className="max-w-md text-sm leading-relaxed text-[var(--aula-muted)]">{error?.message || 'Intenta de nuevo en unos minutos.'}</p>
      {onRetry && !denied && error?.status !== 404 && (
        <Button variant="secondary" size="sm" onClick={onRetry}>Reintentar</Button>
      )}
    </div>
  );
}

export function PageError({ error, onRetry }) {
  return (
    <div className="aula-root flex min-h-[60vh] items-center justify-center px-4">
      <ErrorState error={error} onRetry={onRetry} className="w-full max-w-lg" />
    </div>
  );
}

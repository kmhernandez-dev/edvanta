import { NavLink, useLocation } from 'react-router-dom';

/**
 * Pestañas de navegación (cada una es una ruta). Se desplazan en
 * horizontal en pantallas angostas. `match` (expresión regular) marca la
 * pestaña como activa en rutas hijas que no cuelgan de su dirección.
 */
export function TabNav({ items, label = 'Secciones', className = '' }) {
  const { pathname } = useLocation();
  return (
    <nav aria-label={label} className={`-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 ${className}`}>
      <ul className="flex min-w-max gap-1 border-b border-[var(--aula-border)]">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) => [
                'relative inline-flex h-11 items-center gap-2 px-3 text-sm font-semibold transition-colors',
                isActive || item.match?.test(pathname)
                  ? 'text-[var(--aula-primary)] after:absolute after:inset-x-2 after:-bottom-px after:h-[3px] after:rounded-full after:bg-[var(--aula-primary)]'
                  : 'text-[var(--aula-muted)] hover:text-[var(--aula-text)]',
              ].join(' ')}
            >
              {item.icon && <item.icon className="h-4 w-4" aria-hidden="true" />}
              {item.label}
              {item.badge ? (
                <span className="rounded-full bg-[var(--aula-warning-soft)] px-1.5 text-[11px] font-bold text-[var(--aula-warning)]">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Selector segmentado (pestañas dentro de una misma página). */
export function Segmented({ value, onChange, options, label }) {
  // Flechas para moverse entre opciones, como en cualquier grupo de radio.
  const onKeyDown = (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const index = options.findIndex((o) => o.value === value);
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const next = options[(index + step + options.length) % options.length];
    onChange(next.value);
    e.currentTarget.querySelector(`[data-value="${CSS.escape(String(next.value))}"]`)?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className="inline-flex rounded-[var(--aula-radius)] bg-[var(--aula-neutral-soft)] p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          data-value={o.value}
          aria-checked={value === o.value}
          tabIndex={value === o.value ? 0 : -1}
          onClick={() => onChange(o.value)}
          className={`inline-flex h-9 items-center gap-1.5 rounded-[var(--aula-radius-sm)] px-3 text-sm font-semibold transition-colors ${
            value === o.value ? 'bg-white text-[var(--aula-primary)] shadow-sm' : 'text-[var(--aula-muted)] hover:text-[var(--aula-text)]'
          }`}
        >
          {o.icon && <o.icon className="h-4 w-4" aria-hidden="true" />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

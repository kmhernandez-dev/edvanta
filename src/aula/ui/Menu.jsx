import { useEffect, useId, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

/**
 * Menú de acciones (patrón «menu button»): se abre con clic, Enter o
 * flecha abajo; las flechas recorren las opciones y Escape lo cierra
 * devolviendo el foco al botón.
 *
 * items: [{ label, icon?, onSelect, tone?: 'danger', disabled?, hint? } | 'separator']
 */
export function ActionMenu({ items, label = 'Más acciones', icon: Icon = MoreVertical, align = 'right', size = 'md', buttonClassName = '' }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const actionable = items.filter((i) => i !== 'separator' && !i.disabled);

  const focusItem = (index) => {
    const nodes = menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])');
    if (!nodes?.length) return;
    nodes[(index + nodes.length) % nodes.length].focus();
  };

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    requestAnimationFrame(() => focusItem(0));
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const onMenuKey = (e) => {
    const nodes = [...(menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])') || [])];
    const index = nodes.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(index + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(index - 1); }
    else if (e.key === 'Home') { e.preventDefault(); focusItem(0); }
    else if (e.key === 'End') { e.preventDefault(); focusItem(nodes.length - 1); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === 'Tab') setOpen(false);
  };

  const dims = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        title={label}
        disabled={!actionable.length}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true); }
        }}
        className={`inline-flex ${dims} items-center justify-center rounded-[var(--aula-radius-sm)] text-[var(--aula-muted)] transition-colors hover:bg-[var(--aula-neutral-soft)] hover:text-[var(--aula-text)] disabled:opacity-40 ${buttonClassName}`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          className={`absolute top-full z-40 mt-1 min-w-[220px] rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white py-1.5 shadow-[var(--aula-shadow-lg)] ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {items.map((item, i) => {
            if (item === 'separator') return <div key={`sep-${i}`} role="separator" className="my-1 border-t border-[var(--aula-border)]" />;
            const ItemIcon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                tabIndex={-1}
                aria-disabled={item.disabled || undefined}
                onClick={() => {
                  if (item.disabled) return;
                  close(false);
                  item.onSelect();
                }}
                className={`flex w-full items-start gap-2.5 px-3 py-2 text-left text-sm focus:bg-[var(--aula-neutral-soft)] focus:outline-none ${
                  item.disabled ? 'cursor-not-allowed opacity-45' : 'hover:bg-[var(--aula-neutral-soft)]'
                } ${item.tone === 'danger' ? 'text-[var(--aula-danger)]' : 'text-[var(--aula-text)]'}`}
              >
                {ItemIcon && <ItemIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
                <span className="min-w-0">
                  <span className="block font-medium">{item.label}</span>
                  {item.hint && <span className="block text-xs text-[var(--aula-muted)]">{item.hint}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

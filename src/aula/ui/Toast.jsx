import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

const STYLE = {
  success: { icon: CheckCircle2, cls: 'text-[var(--aula-success)]' },
  error: { icon: XCircle, cls: 'text-[var(--aula-danger)]' },
  info: { icon: Info, cls: 'text-[var(--aula-info)]' },
};

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const seq = useRef(0);

  const dismiss = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback((tone, message, { duration = 5000 } = {}) => {
    seq.current += 1;
    const id = seq.current;
    setItems((list) => [...list.slice(-3), { id, tone, message }]);
    if (duration) setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (m, o) => push('success', m, o),
    error: (m, o) => push('error', m, { duration: 8000, ...o }),
    info: (m, o) => push('info', m, o),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(92vw,380px)] flex-col gap-2">
        {items.map((t) => {
          const { icon: Icon, cls } = STYLE[t.tone];
          return (
            <div key={t.id} role="status" className="pointer-events-auto flex items-start gap-3 rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white px-4 py-3 shadow-[var(--aula-shadow-lg)]">
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cls}`} aria-hidden="true" />
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--aula-text)]">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Cerrar aviso" className="text-[var(--aula-muted)] hover:text-[var(--aula-text)]">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}

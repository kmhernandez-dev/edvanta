import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button, IconButton } from './Button';
import { Alert } from './States';
import { TextInput } from './Form';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Diálogo accesible: foco atrapado, Escape para cerrar y retorno del foco. */
export function Modal({ open, onClose, title, description, children, footer, size = 'md', dismissable = true }) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef(null);
  const returnTo = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    returnTo.current = document.activeElement;
    const panel = panelRef.current;
    const first = panel?.querySelector('[data-autofocus]') || panel?.querySelector(FOCUSABLE);
    first?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissable) {
        e.stopPropagation();
        onClose?.();
      }
      if (e.key === 'Tab' && panel) {
        const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      returnTo.current?.focus?.();
    };
  }, [open, dismissable, onClose]);

  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };

  return createPortal(
    <div className="aula-root !min-h-0 !bg-transparent fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-[rgba(23,34,59,0.45)]" aria-hidden="true" onClick={dismissable ? onClose : undefined} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={`relative flex max-h-[92vh] w-full ${widths[size]} flex-col rounded-t-[var(--aula-radius-lg)] bg-[var(--aula-surface)] shadow-[var(--aula-shadow-lg)] sm:rounded-[var(--aula-radius-lg)]`}
      >
        <div className="flex items-start gap-3 border-b border-[var(--aula-border)] px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-bold">{title}</h2>
            {description && <p id={descId} className="mt-1 text-sm leading-relaxed text-[var(--aula-muted)]">{description}</p>}
          </div>
          {dismissable && <IconButton icon={X} label="Cerrar" onClick={onClose} />}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--aula-border)] px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

/**
 * Confirmación antes de una acción sensible. Si `confirmText` está
 * presente, el usuario debe escribirlo para habilitar el botón.
 * `requireReason` pide un motivo (queda en la bitácora).
 */
export function ConfirmDialog({
  open, onClose, onConfirm, title, description, children, confirmLabel = 'Confirmar',
  tone = 'primary', confirmText, requireReason = false, reasonLabel = 'Motivo',
}) {
  const [typed, setTyped] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) { setTyped(''); setReason(''); setError(null); setBusy(false); }
  }, [open]);

  const blocked = (confirmText && typed.trim() !== confirmText) || (requireReason && reason.trim().length < 5);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm(requireReason ? reason.trim() : undefined);
      onClose();
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onClose}
      dismissable={!busy}
      title={title}
      description={description}
      size="sm"
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancelar</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={run} loading={busy} disabled={blocked}>
            {confirmLabel}
          </Button>
        </>
      )}
    >
      <div className="flex flex-col gap-4">
        {children}
        {requireReason && (
          <TextInput
            label={reasonLabel}
            hint="Mínimo 5 caracteres. Quedará registrado en la bitácora."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            data-autofocus
          />
        )}
        {confirmText && (
          <TextInput
            label={<>Escribe <strong>{confirmText}</strong> para confirmar</>}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            data-autofocus={!requireReason || undefined}
          />
        )}
        {error && <Alert tone="danger">{error.message}</Alert>}
      </div>
    </Modal>
  );
}

import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const control = [
  'w-full rounded-[var(--aula-radius)] border bg-[var(--aula-surface)] px-3.5 text-[15px] text-[var(--aula-text)]',
  'placeholder:text-[var(--aula-subtle)] transition-colors',
  'focus:outline-none focus:ring-[3px] focus:ring-[var(--aula-primary-soft)] focus:border-[var(--aula-primary)]',
  'disabled:bg-[var(--aula-surface-muted)] disabled:text-[var(--aula-muted)]',
].join(' ');

const border = (error) => (error ? 'border-[var(--aula-danger)]' : 'border-[var(--aula-border-strong)]');

/** Etiqueta + control + ayuda + error, con los atributos de accesibilidad enlazados. */
export function Field({ label, hint, error, required, children, className = '' }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[var(--aula-text)]">
          {label}
          {required && <span className="ml-0.5 text-[var(--aula-danger)]" aria-hidden="true">*</span>}
        </label>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined, required })}
      {hint && !error && <p id={hintId} className="text-xs leading-relaxed text-[var(--aula-muted)]">{hint}</p>}
      {error && <p id={errorId} role="alert" className="text-xs font-medium text-[var(--aula-danger)]">{error}</p>}
    </div>
  );
}

export function TextInput({ label, hint, error, required, className, inputClassName = '', ...rest }) {
  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(a11y) => <input {...a11y} {...rest} className={`${control} ${border(error)} h-11 ${inputClassName}`} />}
    </Field>
  );
}

export function PasswordInput({ label, hint, error, required, className, ...rest }) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(a11y) => (
        <div className="relative">
          <input {...a11y} {...rest} type={visible ? 'text' : 'password'} className={`${control} ${border(error)} h-11 pr-11`} />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--aula-muted)] hover:text-[var(--aula-text)]"
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      )}
    </Field>
  );
}

export function TextArea({ label, hint, error, required, className, rows = 4, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(a11y) => <textarea {...a11y} rows={rows} {...rest} className={`${control} ${border(error)} py-2.5 leading-relaxed`} />}
    </Field>
  );
}

export function Select({ label, hint, error, required, className, options = [], placeholder, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(a11y) => (
        <select {...a11y} {...rest} className={`${control} ${border(error)} h-11 pr-9`}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function Checkbox({ label, description, className = '', ...rest }) {
  const id = useId();
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <input
        id={id}
        type="checkbox"
        {...rest}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-[var(--aula-border-strong)] accent-[var(--aula-primary)]"
      />
      <label htmlFor={id} className="cursor-pointer text-sm leading-snug">
        <span className="font-medium text-[var(--aula-text)]">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-[var(--aula-muted)]">{description}</span>}
      </label>
    </div>
  );
}

/** Interruptor accesible (role="switch"). */
export function Toggle({ label, description, checked, onChange, disabled, className = '' }) {
  const id = useId();
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <label htmlFor={id} className="text-sm leading-snug">
        <span className="font-medium text-[var(--aula-text)]">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-[var(--aula-muted)]">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
          checked ? 'bg-[var(--aula-primary)]' : 'bg-[var(--aula-border-strong)]'
        }`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

/** Convierte un error de la API en errores por campo + mensaje general. */
export function errorsFrom(error) {
  if (!error) return { fields: {}, general: null };
  if (error.field) return { fields: { [error.field]: error.message }, general: null };
  return { fields: {}, general: error.message || 'Algo salió mal.' };
}

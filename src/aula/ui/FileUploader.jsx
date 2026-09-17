import { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, FileUp, RefreshCw, Trash2, X } from 'lucide-react';
import { cancelUpload, post, uploadFile } from '../api';
import { fmtBytes } from '../labels';
import { Button, IconButton } from './Button';
import { ProgressBar } from './Page';

const rulesCache = new Map();

function useUploadRules(purpose, context) {
  const cacheKey = `${purpose}:${JSON.stringify(context || {})}`;
  const [rules, setRules] = useState(() => rulesCache.get(cacheKey) || null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (rulesCache.has(cacheKey)) { setRules(rulesCache.get(cacheKey)); return undefined; }
    let alive = true;
    post('/uploads/rules', { purpose, ...(context || {}) })
      .then((r) => { rulesCache.set(cacheKey, r); if (alive) setRules(r); })
      .catch((e) => { if (alive) setError(e); });
    return () => { alive = false; };
  }, [cacheKey, purpose, context]);
  return { rules, error };
}

const extOf = (name) => (/\.([a-z0-9]+)$/i.exec(name)?.[1] || '').toLowerCase();

/**
 * Selector + subida de un archivo del aula.
 * `value` es { id, name, size } del archivo actual (o null).
 */
export function FileUploader({
  purpose, context, value, onChange, label, hint, accept, preview, disabled, className = '',
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const uploadIdRef = useRef(null);
  const { rules, error: rulesError } = useUploadRules(purpose, context);
  const [state, setState] = useState({ phase: 'idle', progress: 0, error: null, file: null });
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => abortRef.current?.abort(), []);

  const acceptAttr = accept || rules?.extensions.map((e) => `.${e}`).join(',');
  const summary = rules
    ? `${rules.extensions.map((e) => e.toUpperCase()).join(', ')} · máx. ${fmtBytes(Math.max(...Object.values(rules.maxBytes)))}`
    : '';

  const start = async (file) => {
    if (!file) return;
    const ext = extOf(file.name);
    if (rules && !rules.extensions.includes(ext)) {
      setState({ phase: 'error', progress: 0, file, error: `Ese formato no está permitido. Usa: ${rules.extensions.map((e) => e.toUpperCase()).join(', ')}.` });
      return;
    }
    if (rules && file.size > rules.maxBytes[ext]) {
      setState({ phase: 'error', progress: 0, file, error: `El archivo pesa ${fmtBytes(file.size)} y el máximo es ${fmtBytes(rules.maxBytes[ext])}.` });
      return;
    }
    if (file.size === 0) {
      setState({ phase: 'error', progress: 0, file, error: 'El archivo está vacío.' });
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ phase: 'uploading', progress: 0, error: null, file });
    try {
      const done = await uploadFile(file, {
        purpose,
        context,
        signal: controller.signal,
        onStart: (upload) => { uploadIdRef.current = upload.id; },
        onProgress: (p) => setState((s) => ({ ...s, progress: p, phase: p >= 1 ? 'processing' : 'uploading' })),
      });
      uploadIdRef.current = null;
      setState({ phase: 'idle', progress: 1, error: null, file: null });
      onChange?.({ id: done.id, name: done.name, size: done.size, mime: done.mime, extension: done.extension });
    } catch (err) {
      if (err?.name === 'AbortError') {
        if (uploadIdRef.current) cancelUpload(uploadIdRef.current);
        uploadIdRef.current = null;
        setState({ phase: 'idle', progress: 0, error: null, file: null });
        return;
      }
      setState({ phase: 'error', progress: 0, file, error: err.message || 'No se pudo subir el archivo.' });
    }
  };

  const cancel = () => abortRef.current?.abort();

  const pick = () => inputRef.current?.click();
  const busy = state.phase === 'uploading' || state.phase === 'processing';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label htmlFor={inputId} className="text-sm font-semibold">{label}</label>}
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="sr-only"
        disabled={disabled || busy}
        onChange={(e) => { start(e.target.files?.[0]); e.target.value = ''; }}
      />

      {value && !busy ? (
        <div className="flex items-center gap-3 rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-[var(--aula-surface-muted)] p-3">
          {preview ? preview(value) : <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--aula-success)]" aria-hidden="true" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{value.name || 'Archivo cargado'}</p>
            {value.size ? <p className="text-xs text-[var(--aula-muted)]">{fmtBytes(value.size)}</p> : null}
          </div>
          <Button size="sm" variant="secondary" icon={RefreshCw} onClick={pick} disabled={disabled}>Reemplazar</Button>
          <IconButton icon={Trash2} label="Quitar archivo" onClick={() => onChange?.(null)} disabled={disabled} />
        </div>
      ) : busy ? (
        <div className="flex flex-col gap-2 rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3" aria-live="polite">
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1 truncate text-sm font-medium">{state.file?.name}</p>
            <span className="text-xs tabular-nums text-[var(--aula-muted)]">
              {state.phase === 'processing' ? 'Verificando…' : `${Math.round(state.progress * 100)} %`}
            </span>
            <IconButton icon={X} label="Cancelar subida" size="sm" onClick={cancel} disabled={state.phase === 'processing'} />
          </div>
          <ProgressBar value={state.progress * 100} label={`Subiendo ${state.file?.name}`} size="sm" />
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={disabled ? undefined : pick}
          onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(); } }}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) start(e.dataTransfer.files?.[0]); }}
          aria-disabled={disabled || undefined}
          className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-[var(--aula-radius)] border-2 border-dashed px-4 py-5 text-center transition-colors ${
            dragging ? 'border-[var(--aula-primary)] bg-[var(--aula-primary-soft)]' : 'border-[var(--aula-border-strong)] hover:border-[var(--aula-primary)] hover:bg-[var(--aula-surface-muted)]'
          } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <FileUp className="h-6 w-6 text-[var(--aula-primary)]" aria-hidden="true" />
          <span className="text-sm font-semibold text-[var(--aula-primary)]">Elige un archivo o arrástralo aquí</span>
          {summary && <span className="text-xs text-[var(--aula-muted)]">{summary}</span>}
        </div>
      )}

      {state.phase === 'error' && (
        <div role="alert" className="flex items-start gap-2 rounded-[var(--aula-radius-sm)] bg-[var(--aula-danger-soft)] px-3 py-2 text-xs text-[var(--aula-danger)]">
          <span className="flex-1">{state.error}</span>
          {state.file && <button type="button" className="font-semibold underline" onClick={() => start(state.file)}>Reintentar</button>}
        </div>
      )}
      {rulesError && <p className="text-xs text-[var(--aula-danger)]">{rulesError.message}</p>}
      {hint && <p className="text-xs text-[var(--aula-muted)]">{hint}</p>}
    </div>
  );
}

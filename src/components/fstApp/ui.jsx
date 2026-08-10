/**
 * ============================================================
 *  ui.jsx — Componentes UI compartidos de la app FST
 * ============================================================
 */

import { useState } from 'react';
import { getEvidence } from '../../data/fstApp/evidence';

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9274C9]">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-semibold text-[#0A2540] sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function Panel({ title, description, icon: Icon, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-[#f0eaf5] bg-white shadow-[0_2px_12px_rgba(10,37,64,0.05)] ${className}`}>
      <div className="flex items-start justify-between gap-4 border-b border-[#f3eef7] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div>
            <h2 className="font-semibold text-[#0A2540]">{title}</h2>
            {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block text-sm font-semibold text-[#0A2540]">
      {label}
      {hint && <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">{hint}</span>}
      <span className="fst-field mt-2 block">{children}</span>
    </label>
  );
}

export function SafetyNote({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#d3efe9] bg-[#f0faf8] p-4 text-sm leading-6 text-slate-600">
      <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#2CB1A1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 8.5 1.8 1.8 3.7-3.8" />
      </svg>
      <p>{children}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="py-8 text-center">
      {Icon && <Icon className="mx-auto h-8 w-8 text-[#d8cce8]" />}
      <p className="mt-3 text-sm font-bold text-[#0A2540]">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">{text}</p>
      {action}
    </div>
  );
}

const levelStyles = {
  verde: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-800', label: 'Informativo' },
  amarillo: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-800', label: 'Revisar con tu profesional' },
  rojo: { border: 'border-rose-200', bg: 'bg-rose-50', text: 'text-rose-800', label: 'Consulta profesional requerida' },
};

export function LevelBadge({ level }) {
  const style = levelStyles[level] || levelStyles.verde;
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${style.border} ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

export function EvidenceButton({ evidenceIds, compact = false }) {
  const [open, setOpen] = useState(false);
  const evidence = getEvidence(evidenceIds);
  if (!evidence.length) return null;
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-full border border-[#d8cce8] bg-white px-3 py-1.5 text-xs font-semibold text-[#9274C9] hover:bg-[#f7f3fb] ${compact ? 'text-[11px]' : ''}`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19m0-13c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5m0-13v13" />
        </svg>
        Ver evidencia
        <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14m-5-5 5 5 5-5" />
        </svg>
      </button>
      {open && (
        <div className="mt-3 space-y-3 rounded-xl border border-[#eae2f8] bg-[#faf8fd] p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Referencias</p>
          {evidence.map(item => (
            <div key={item.pmid || item.doi || item.title} className="text-xs leading-5 text-slate-600">
              <p className="font-semibold text-[#0A2540]">{item.title}</p>
              <p className="mt-0.5">{item.authors} · {item.year} · {item.source}</p>
              <p className="mt-0.5">
                {item.doi && <span className="mr-3">DOI: <span className="font-mono text-[#9274C9]">{item.doi}</span></span>}
                {item.pmid && <span>PMID: <span className="font-mono text-[#9274C9]">{item.pmid}</span></span>}
              </p>
              {item.note && <p className="mt-1 text-slate-500">{item.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AnswerCard({ answer }) {
  if (!answer) return null;
  return (
    <div className="rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-[0_2px_12px_rgba(10,37,64,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LevelBadge level={answer.level} />
        {answer.redNote && <p className="text-xs font-bold text-rose-700">{answer.redNote}</p>}
      </div>
      <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Respuesta breve</p>
          <p className="mt-1 whitespace-pre-line">{answer.brief}</p>
        </div>
        {answer.meaning && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Qué significa</p>
            <p className="mt-1 whitespace-pre-line">{answer.meaning}</p>
          </div>
        )}
        {answer.actions?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Qué puedes hacer</p>
            <ul className="mt-1 space-y-1.5">
              {answer.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2CB1A1]" />
                  <span className="whitespace-pre-line">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {answer.medication && (
          <div className="rounded-xl border border-[#d3efe9] bg-[#f0faf8] p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0B8176]">Consideraciones con medicamentos</p>
            <p className="mt-1 whitespace-pre-line">{answer.medication}</p>
          </div>
        )}
      </div>
      <EvidenceButton evidenceIds={answer.evidence} />
    </div>
  );
}

export function QuickAction({ icon: Icon, label, onClick, tone = 'default' }) {
  const tones = {
    default: 'border-[#f0eaf5] bg-white text-[#0A2540] hover:border-[#d8cce8] hover:bg-[#faf8fd]',
    teal: 'border-[#d3efe9] bg-[#f0faf8] text-[#0A655D] hover:bg-[#e2f6f2]',
    purple: 'border-[#eae2f8] bg-[#f7f3fb] text-[#9274C9] hover:bg-[#f0eaf8]',
    blush: 'border-[#f5dce8] bg-[#fdf4f8] text-[#b04a76] hover:bg-[#fae9f1]',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-20 flex-col items-start justify-center gap-2 rounded-2xl border p-4 text-left transition ${tones[tone]}`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.8} />
      <span className="text-sm font-semibold leading-5">{label}</span>
    </button>
  );
}

export function ProgressBar({ value, color = '#2CB1A1' }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#f0eaf5]">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }} />
    </div>
  );
}

export function Chip({ children, active = false, onClick }) {
  const base = 'inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-semibold transition';
  const style = active
    ? 'border-[#9274C9] bg-[#9274C9] text-white'
    : 'border-[#e5dceb] bg-white text-[#0A2540] hover:border-[#d8cce8] hover:bg-[#faf8fd]';
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${style}`} aria-pressed={active}>
        {children}
      </button>
    );
  }
  return <span className={`${base} ${style}`}>{children}</span>;
}

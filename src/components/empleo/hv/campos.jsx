/**
 * ============================================================
 *  hv/campos.jsx — Piezas del formulario de la hoja de vida
 *
 *  Campos con la misma apariencia en todo el editor: etiqueta
 *  arriba, ayuda corta abajo, foco azul Edvanta. Las fechas se
 *  eligen con dos selectores (mes y año) para que todas queden
 *  escritas igual, y los logros se escriben uno por línea.
 * ============================================================
 */

import { useState } from 'react';
import { Lightbulb, Plus, X } from 'lucide-react';
import { VERBOS } from '../../../lib/cv/redaccion';

export const claseEntrada = 'min-h-11 w-full rounded-xl border border-edvanta-border bg-white px-3.5 text-[15px] text-edvanta-deep outline-none transition placeholder:text-edvanta-subtle/70 focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15';
export const claseArea = 'w-full rounded-xl border border-edvanta-border bg-white p-3.5 text-[15px] leading-6 text-edvanta-deep outline-none transition placeholder:text-edvanta-subtle/70 focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15';

export function Campo({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-bold text-edvanta-deep">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-5 text-edvanta-subtle">{hint}</span>}
    </label>
  );
}

export function Chip({ children, onClick, activo = false, titulo }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={titulo}
      aria-pressed={activo || undefined}
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition ${activo
        ? 'border-edvanta-blue bg-edvanta-blue text-white'
        : 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-blue/50 hover:text-edvanta-blue'}`}
    >
      {children}
    </button>
  );
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const ANIOS = Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i));

/** «Feb 2022» ↔ { mes: 'Feb', anio: '2022' }. Acepta también «febrero de 2022». */
export function partirFecha(valor) {
  const s = String(valor || '').trim();
  const anio = (s.match(/(19|20)\d{2}/) || [''])[0];
  const palabra = s.replace(anio, '').replace(/\bde\b/gi, '').replace(/[^A-Za-zÁÉÍÓÚáéíóú]/g, '').slice(0, 3).toLowerCase();
  const mes = MESES.find((m) => m.toLowerCase() === palabra.normalize('NFD').replace(/[̀-ͯ]/g, '')) || '';
  return { mes, anio };
}

export function SelectorFecha({ valor, onChange, etiqueta, deshabilitado = false }) {
  const { mes, anio } = partirFecha(valor);
  const armar = (m, a) => onChange(a ? (m ? `${m} ${a}` : a) : '');
  return (
    <div className="flex gap-2">
      <select value={mes} disabled={deshabilitado} onChange={(e) => armar(e.target.value, anio)} className={`${claseEntrada} w-[5.5rem] shrink-0 px-2.5 disabled:bg-edvanta-bg disabled:opacity-60`} aria-label={`${etiqueta}: mes`}>
        <option value="">Mes</option>
        {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={anio} disabled={deshabilitado} onChange={(e) => armar(mes, e.target.value)} className={`${claseEntrada} px-2.5 disabled:bg-edvanta-bg disabled:opacity-60`} aria-label={`${etiqueta}: año`}>
        <option value="">Año</option>
        {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
  );
}

/** Logros: una frase por línea, con verbos para arrancar y ejemplos del cargo. */
export function Logros({ valor, onChange, sugerencias = [] }) {
  const [verVerbos, setVerVerbos] = useState(false);
  const lineas = String(valor || '').split('\n');
  const items = lineas.length ? lineas : [''];
  const guardar = (nuevas) => onChange(nuevas.filter((l, i) => l.trim() || i === nuevas.length - 1).join('\n'));
  const cambiar = (i, texto) => guardar(items.map((l, j) => (j === i ? texto : l)));
  const quitar = (i) => guardar(items.filter((_, j) => j !== i));
  const agregar = (texto = '') => onChange([...items.filter((l) => l.trim()), texto].join('\n'));

  return (
    <div>
      <span className="mb-1.5 block text-sm font-bold text-edvanta-deep">
        Logros <span className="font-medium text-edvanta-subtle">· uno por línea, ojalá con una cifra</span>
      </span>
      <div className="flex flex-col gap-2">
        {items.map((l, i) => (
          <div key={i} className="group flex items-start gap-2">
            <span className="mt-[1.15rem] h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />
            <textarea
              value={l}
              onChange={(e) => cambiar(i, e.target.value.replace(/\n/g, ' '))}
              rows={2}
              placeholder="Reduje 25 % el tiempo de liberación de lotes con un plan de muestreo."
              aria-label={`Logro ${i + 1}`}
              className={claseArea}
            />
            {items.length > 1 && (
              <button type="button" onClick={() => quitar(i)} aria-label={`Quitar logro ${i + 1}`} className="mt-2 rounded-lg p-1.5 text-edvanta-subtle transition hover:bg-edvanta-bg hover:text-edvanta-blue">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-3.5">
        <Chip onClick={() => agregar('')}><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Otro logro</Chip>
        <Chip onClick={() => setVerVerbos((v) => !v)} activo={verVerbos}>Empezar con un verbo</Chip>
        {verVerbos && VERBOS.slice(0, 8).map((v) => (
          <Chip key={v} onClick={() => agregar(`${v} `)} titulo={`Empezar un logro con «${v}»`}>{v}…</Chip>
        ))}
      </div>
      {sugerencias.length > 0 && (
        <details className="group mt-3 rounded-xl bg-edvanta-bg px-3.5 py-2.5 pl-3.5">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-bold text-edvanta-blue">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" /> Ver ejemplos de logros para tu cargo
          </summary>
          <p className="mt-1.5 text-xs text-edvanta-subtle">Úsalos como guía y cámbialos por tus datos reales.</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {sugerencias.slice(0, 4).map((s) => (
              <button key={s} type="button" onClick={() => agregar(s)} className="rounded-lg border border-edvanta-border bg-white px-3 py-2 text-left text-xs leading-5 text-edvanta-muted transition hover:border-edvanta-blue/40 hover:text-edvanta-deep">
                + {s}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

/** Tarjeta de un elemento repetible (un cargo, un estudio…) que se pliega. */
export function Elemento({ titulo, subtitulo, abierto, onAlternar, acciones, children }) {
  return (
    <div className={`rounded-2xl border bg-white transition ${abierto ? 'border-edvanta-blue/30 shadow-[var(--ds-sh-sm)]' : 'border-edvanta-border'}`}>
      <div className="flex items-center gap-2 px-4 py-3">
        <button type="button" onClick={onAlternar} aria-expanded={abierto} className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[15px] font-bold text-edvanta-deep">{titulo}</span>
          {subtitulo && <span className="block truncate text-xs text-edvanta-subtle">{subtitulo}</span>}
        </button>
        {acciones}
      </div>
      {abierto && <div className="border-t border-edvanta-border px-4 pb-4 pt-4">{children}</div>}
    </div>
  );
}

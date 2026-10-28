/**
 * ============================================================
 *  hv/Revision.jsx — El puntaje ATS y qué mejorar
 *
 *  Sirve igual para la revisión rápida (en el navegador) y para la
 *  revisión con IA: las dos entregan la misma rúbrica de seis
 *  categorías. Se muestra en dos tamaños:
 *   · ResumenRevision: el anillo con el puntaje y una línea, para
 *     la barra de la vista previa;
 *   · PanelRevision: el detalle (categorías, prioridades, palabras
 *     clave que faltan, frases para reescribir y perfil sugerido).
 * ============================================================
 */

import { useState } from 'react';
import { Check, Copy, Loader2, Plus, Sparkles, Wand2 } from 'lucide-react';

export const NIVELES = {
  alto: { texto: 'Lista para postular', color: '#0F7480', fondo: 'bg-edvanta-mint text-edvanta-tealdark' },
  medio: { texto: 'Casi lista', color: '#082E86', fondo: 'bg-edvanta-light text-edvanta-blue' },
  bajo: { texto: 'Necesita ajustes', color: '#5E51A8', fondo: 'bg-edvanta-lilac text-[#5E51A8]' },
};

export function AnilloPuntaje({ puntaje = 0, nivel = 'bajo', tam = 64 }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const tono = NIVELES[nivel] || NIVELES.bajo;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: tam, height: tam }}>
      <svg viewBox="0 0 64 64" className="ds-ring h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#E4EBFA" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={tono.color} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - puntaje / 100)} />
      </svg>
      <span className="absolute font-display text-lg font-extrabold text-edvanta-deep" style={{ fontSize: tam * 0.3 }}>{puntaje}</span>
    </span>
  );
}

const nombreCargo = (a) => (typeof a?.cargo === 'string' ? a.cargo : a?.cargo?.nombre || '');

export function ResumenRevision({ analisis, antes, onAbrir, cargando }) {
  if (!analisis) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-edvanta-border bg-white p-3">
        <AnilloPuntaje puntaje={0} tam={52} />
        <p className="text-sm leading-5 text-edvanta-muted">Escribe tus datos y verás aquí qué tan lista está tu hoja de vida para los filtros.</p>
      </div>
    );
  }
  const tono = NIVELES[analisis.nivel] || NIVELES.bajo;
  return (
    <button type="button" onClick={onAbrir} className="flex w-full items-center gap-3 rounded-2xl border border-edvanta-border bg-white p-3 text-left transition hover:border-edvanta-blue/40 hover:shadow-[var(--ds-sh-sm)]">
      <AnilloPuntaje puntaje={analisis.puntaje} nivel={analisis.nivel} tam={52} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className={`ds-chip ${tono.fondo}`}>{tono.texto}</span>
          {analisis.fuente === 'ia' && <span className="ds-chip ds-chip--violet"><Sparkles className="h-3 w-3" aria-hidden="true" /> IA</span>}
        </span>
        <span className="mt-1 block text-xs leading-5 text-edvanta-muted">
          {cargando ? 'Actualizando la revisión…' : (
            antes != null ? <>Tu hoja anterior tenía <strong className="text-edvanta-deep">{antes}</strong>. Toca para ver qué mejorar.</> : 'Toca para ver qué mejorar.'
          )}
        </span>
      </span>
      {cargando && <Loader2 className="h-4 w-4 animate-spin text-edvanta-blue" aria-hidden="true" />}
    </button>
  );
}

function Copiar({ texto }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { try { await navigator.clipboard.writeText(texto); setOk(true); setTimeout(() => setOk(false), 1800); } catch { /* sin portapapeles */ } }}
      className="inline-flex items-center gap-1 text-xs font-bold text-edvanta-blue hover:underline"
    >
      {ok ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {ok ? 'Copiado' : 'Copiar'}
    </button>
  );
}

/**
 * Detalle de la revisión. `onAgregarHabilidad` y `onUsarPerfil` dejan
 * aplicar las sugerencias al editor con un clic.
 */
export function PanelRevision({
  analisis, antes, iaLista, revisandoIa, errorIa, desactualizada, onRevisarIa, onAgregarHabilidad, onUsarPerfil, habilidades = [],
}) {
  if (!analisis) return null;
  const tono = NIVELES[analisis.nivel] || NIVELES.bajo;
  const prioridades = (analisis.prioridades || []).slice(0, 6);
  const faltantes = (analisis.palabrasClave?.faltantes || []).filter((k) => !habilidades.some((h) => h.toLowerCase() === k.toLowerCase()));
  const reescrituras = (analisis.reescrituras || []).slice(0, 4);
  const cargo = nombreCargo(analisis);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <AnilloPuntaje puntaje={analisis.puntaje} nivel={analisis.nivel} tam={84} />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-subtle">Compatibilidad ATS · de 100</p>
          <p className="mt-1 font-display text-xl font-extrabold text-edvanta-deep">{tono.texto}</p>
          {cargo && <p className="mt-0.5 text-sm text-edvanta-muted">Comparada con: {cargo}</p>}
          {antes != null && <p className="mt-0.5 text-sm text-edvanta-muted">Tu hoja anterior: {antes} / 100</p>}
        </div>
      </div>
      {analisis.mensaje && <p className="text-sm leading-6 text-edvanta-muted">{analisis.mensaje}</p>}

      {/* Revisión con IA */}
      {iaLista && (analisis.fuente !== 'ia' || desactualizada) && (
        <div className="rounded-2xl bg-[linear-gradient(135deg,#F3F6FE_0%,#F5F1FD_100%)] p-4">
          <p className="flex items-center gap-1.5 text-sm font-bold text-edvanta-deep"><Sparkles className="h-4 w-4 text-[#5E51A8]" aria-hidden="true" /> Revisión a fondo con IA</p>
          <p className="mt-1 text-xs leading-5 text-edvanta-muted">
            {desactualizada ? 'Cambiaste tu hoja desde la última revisión con IA.' : 'Lee tus logros como un reclutador y te dice qué cambiar, frase por frase.'}
          </p>
          <button type="button" onClick={onRevisarIa} disabled={revisandoIa} className="ed-btn ed-btn--primary ed-btn--sm mt-3">
            {revisandoIa ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Wand2 className="h-4 w-4" aria-hidden="true" />}
            {revisandoIa ? 'Revisando… (unos segundos)' : desactualizada ? 'Revisar otra vez' : 'Revisar con IA'}
          </button>
          {errorIa && <p className="mt-2 text-xs font-semibold text-[#5E51A8]" role="status">{errorIa}</p>}
        </div>
      )}

      <div>
        <h3 className="text-sm font-extrabold text-edvanta-deep">Por categoría</h3>
        <ul className="mt-3 space-y-2.5">
          {(analisis.categorias || []).map((c) => (
            <li key={c.id}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold text-edvanta-deep">{c.nombre}</span>
                <span className="text-xs font-bold text-edvanta-subtle">{c.puntos} / {c.max}</span>
              </div>
              <div className="ds-progress mt-1.5 h-1.5" aria-hidden="true">
                <span style={{ width: `${Math.round((c.puntos / c.max) * 100)}%` }} />
              </div>
              {c.comentario && <p className="mt-1 text-xs leading-5 text-edvanta-muted">{c.comentario}</p>}
            </li>
          ))}
        </ul>
      </div>

      {prioridades.length > 0 && (
        <div>
          <h3 className="text-sm font-extrabold text-edvanta-deep">Lo que más sube tu puntaje</h3>
          <ol className="mt-3 space-y-3">
            {prioridades.map((p, i) => (
              <li key={`${p.titulo}-${i}`} className="flex gap-3 rounded-xl border border-edvanta-border bg-white p-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-edvanta-light text-xs font-extrabold text-edvanta-blue">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-edvanta-deep">{p.titulo}</span>
                  {p.detalle && <span className="mt-0.5 block text-xs leading-5 text-edvanta-muted">{p.detalle}</span>}
                  {p.como && <span className="mt-1 block text-xs font-semibold leading-5 text-edvanta-tealdark">{p.como}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {faltantes.length > 0 && (
        <div>
          <h3 className="text-sm font-extrabold text-edvanta-deep">Palabras clave que faltan</h3>
          <p className="mt-1 text-xs leading-5 text-edvanta-muted">Agrega solo las que de verdad manejas.</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {faltantes.slice(0, 14).map((k) => (
              <button key={k} type="button" onClick={() => onAgregarHabilidad?.(k)} className="inline-flex min-h-8 items-center gap-1 rounded-full border border-dashed border-edvanta-blue/40 bg-white px-3 text-xs font-bold text-edvanta-blue transition hover:bg-edvanta-light">
                <Plus className="h-3 w-3" aria-hidden="true" /> {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {reescrituras.length > 0 && (
        <div>
          <h3 className="text-sm font-extrabold text-edvanta-deep">Frases para reescribir</h3>
          <ul className="mt-3 space-y-3">
            {reescrituras.map((r) => {
              const mejor = r.mejorada || r.sugerencia;
              return (
                <li key={r.original} className="rounded-xl border border-edvanta-border bg-white p-3 text-xs leading-5">
                  <p className="text-edvanta-subtle line-through decoration-edvanta-strong">{r.original}</p>
                  <p className="mt-1.5 font-semibold text-edvanta-deep">{mejor}</p>
                  <div className="mt-1.5"><Copiar texto={mejor} /></div>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-edvanta-subtle">Lo que va entre [corchetes] es un dato que debes completar tú.</p>
        </div>
      )}

      {analisis.perfilSugerido && (
        <div className="rounded-2xl border border-edvanta-teal/30 bg-edvanta-mint/50 p-4">
          <h3 className="text-sm font-extrabold text-edvanta-deep">Perfil sugerido</h3>
          <p className="mt-1.5 text-sm leading-6 text-edvanta-deep">{analisis.perfilSugerido}</p>
          <button type="button" onClick={() => onUsarPerfil?.(analisis.perfilSugerido)} className="ed-btn ed-btn--secondary ed-btn--sm mt-3">Usar este perfil</button>
        </div>
      )}

      {(analisis.fortalezas || []).length > 0 && (
        <div>
          <h3 className="text-sm font-extrabold text-edvanta-deep">Lo que ya está bien</h3>
          <ul className="mt-2 space-y-1.5">
            {analisis.fortalezas.slice(0, 5).map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs leading-5 text-edvanta-muted">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-edvanta-teal" aria-hidden="true" /> {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

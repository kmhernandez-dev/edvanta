/**
 * ============================================================
 *  hv/Inicio.jsx — Cómo empezar la hoja de vida
 *
 *  Dos caminos, nada más:
 *   · subir la hoja de vida anterior (PDF o Word): la leemos y la
 *     pasamos al editor con un diseño nuevo;
 *   · empezar de cero, campo por campo.
 *  Mientras se lee el archivo se muestra en qué va la lectura.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, FileText, Loader2, PenLine, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';
import { ACEPTA_ARCHIVOS } from '../../../lib/cv/revision';

export function ZonaArchivo({ onArchivo, compacta = false }) {
  const [encima, setEncima] = useState(false);
  const input = useRef(null);
  const soltar = (e) => {
    e.preventDefault();
    setEncima(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onArchivo(f);
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setEncima(true); }}
      onDragLeave={() => setEncima(false)}
      onDrop={soltar}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition ${compacta ? 'px-4 py-5' : 'px-5 py-8'} ${encima ? 'border-edvanta-blue bg-edvanta-light' : 'border-edvanta-strong bg-white hover:border-edvanta-blue/60'}`}
    >
      <span className="ds-icon-tile h-12 w-12 items-center justify-center rounded-2xl" aria-hidden="true">
        <UploadCloud className="h-6 w-6" />
      </span>
      <p className="mt-3 text-[15px] font-bold text-edvanta-deep">Arrastra aquí tu hoja de vida</p>
      <p className="mt-0.5 text-xs text-edvanta-subtle">PDF o Word (.docx) · máximo 10 MB</p>
      <button type="button" onClick={() => input.current?.click()} className="ed-btn ed-btn--primary ed-btn--sm mt-4">
        <FileText className="h-4 w-4" aria-hidden="true" /> Elegir archivo
      </button>
      <input
        ref={input}
        type="file"
        accept={ACEPTA_ARCHIVOS}
        className="sr-only"
        aria-label="Subir hoja de vida en PDF o Word"
        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onArchivo(f); }}
      />
    </div>
  );
}

export function PantallaInicio({ onArchivo, onDesdeCero, onEjemplo, error, iaLista }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-center">
        <span className="ds-chip ds-chip--teal">Hoja de vida ATS</span>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-edvanta-deep sm:text-[2.5rem] sm:leading-[1.1]">¿Cómo quieres empezar?</h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-edvanta-muted">Elige un camino. Puedes cambiar todo después, y lo que escribas se guarda en este navegador.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-[1.15fr_1fr]">
        <section className="ds-card relative overflow-hidden border-edvanta-blue/20 p-6 sm:p-7">
          <span className="ds-chip ds-chip--violet absolute right-5 top-5"><Sparkles className="h-3 w-3" aria-hidden="true" /> Más rápido</span>
          <h2 className="font-display text-xl font-extrabold text-edvanta-deep">Sube tu hoja de vida anterior</h2>
          <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">
            {iaLista ? 'Nuestra IA la lee, ordena tus datos y la califica.' : 'La leemos, ordenamos tus datos y la calificamos.'} En segundos la ves con un diseño nuevo, lista para corregir.
          </p>
          <div className="mt-5"><ZonaArchivo onArchivo={onArchivo} /></div>
          {error && <p className="mt-3 rounded-xl bg-edvanta-lilac px-3.5 py-2.5 text-sm font-semibold text-[#4B3F96]" role="alert">{error}</p>}
          <p className="mt-4 flex items-start gap-1.5 text-xs leading-5 text-edvanta-subtle">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-edvanta-teal" aria-hidden="true" />
            El archivo se lee en tu navegador. {iaLista ? 'Para la revisión con IA enviamos solo el texto y no lo guardamos.' : ''}
          </p>
        </section>

        <section className="ds-card flex flex-col p-6 sm:p-7">
          <span className="ds-icon-tile ds-icon-tile--teal h-12 w-12 items-center justify-center rounded-2xl" aria-hidden="true">
            <PenLine className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-display text-xl font-extrabold text-edvanta-deep">Empieza desde cero</h2>
          <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">Te guiamos en cinco pasos cortos, con ejemplos para tu cargo y la vista previa del PDF a tu lado.</p>
          <ul className="mt-4 space-y-2 text-sm text-edvanta-deep">
            {['Fechas y logros con ayudas', 'Diez diseños para elegir', 'Puntaje ATS mientras escribes'].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-edvanta-teal" aria-hidden="true" /> {t}</li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
            <button type="button" onClick={onDesdeCero} className="ed-btn ed-btn--secondary">
              Empezar <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={onEjemplo} className="text-sm font-bold text-edvanta-blue hover:underline">Ver con un ejemplo</button>
          </div>
        </section>
      </div>
    </div>
  );
}

const PASOS_LECTURA = ['Abriendo el archivo', 'Ordenando tus datos', 'Calificando para los filtros ATS', 'Pasándola al diseño nuevo'];

export function PantallaLeyendo({ archivo, conIa, paso = 0, onCancelar }) {
  const [visible, setVisible] = useState(paso);
  // Con IA la lectura tarda unos segundos: los pasos avanzan solos para
  // mostrar que está trabajando, sin pasar del penúltimo hasta que termine.
  useEffect(() => {
    setVisible((v) => Math.max(v, paso));
    if (!conIa) return undefined;
    const id = setInterval(() => setVisible((v) => Math.min(Math.max(v, paso) + 1, PASOS_LECTURA.length - 2)), 4500);
    return () => clearInterval(id);
  }, [conIa, paso]);
  const avance = Math.round(((visible + 1) / PASOS_LECTURA.length) * 100);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-4 py-14 text-center">
      <span className="ds-icon-tile mx-auto h-16 w-16 items-center justify-center rounded-3xl" aria-hidden="true">
        {conIa ? <Sparkles className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
      </span>
      <h1 className="mt-5 font-display text-2xl font-extrabold text-edvanta-deep">Estamos leyendo tu hoja de vida</h1>
      {archivo && <p className="mt-1.5 truncate text-sm text-edvanta-subtle">{archivo}</p>}
      <div className="ds-progress mx-auto mt-7 w-full max-w-sm" role="progressbar" aria-valuenow={avance} aria-valuemin={0} aria-valuemax={100} aria-label="Avance de la lectura">
        <span style={{ width: `${avance}%` }} />
      </div>
      <ol className="mx-auto mt-6 space-y-2.5 text-left">
        {PASOS_LECTURA.map((p, i) => (
          <li key={p} className={`flex items-center gap-2.5 text-sm ${i <= visible ? 'font-semibold text-edvanta-deep' : 'text-edvanta-subtle'}`}>
            {i < visible ? <Check className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />
              : i === visible ? <Loader2 className="h-4 w-4 animate-spin text-edvanta-blue" aria-hidden="true" />
                : <span className="h-4 w-4 rounded-full border-2 border-edvanta-strong" aria-hidden="true" />}
            {p}
          </li>
        ))}
      </ol>
      {conIa && <p className="mt-6 text-xs text-edvanta-subtle">La lectura con IA toma entre 15 y 40 segundos.</p>}
      {onCancelar && <button type="button" onClick={onCancelar} className="mx-auto mt-4 text-sm font-bold text-edvanta-blue hover:underline">Cancelar</button>}
    </div>
  );
}

import { Fragment } from 'react';
import { RE_CITA, numerosDeCita } from '../../lib/vademecum/html.js';

/** Texto con sus citas [n] como superíndices que llevan a la referencia. */
export function ConCitas({ texto }) {
  const partes = [];
  let ultimo = 0;
  for (const m of String(texto).matchAll(RE_CITA)) {
    partes.push(texto.slice(ultimo, m.index));
    const n = numerosDeCita(m[1])[0];
    partes.push(
      <sup key={m.index}>
        <a href={`#ref-${n}`} className="font-medium text-edvanta-tealdark no-underline hover:underline">{m[0]}</a>
      </sup>,
    );
    ultimo = m.index + m[0].length;
  }
  partes.push(String(texto).slice(ultimo));
  return partes.map((p, i) => <Fragment key={i}>{p}</Fragment>);
}

/** Los bloques de una sección del vademécum: párrafos, listas, pasos, tablas y notas. */
export default function Bloques({ bloques = [] }) {
  return (
    <div className="space-y-4 text-[16px] leading-7 text-edvanta-ink">
      {bloques.map((b, i) => {
        if (typeof b === 'string') return <p key={i}><ConCitas texto={b} /></p>;
        if (b.subtitulo) return <h3 key={i} className="pt-2 text-lg font-semibold text-edvanta-deep"><ConCitas texto={b.subtitulo} /></h3>;
        if (b.nota) return <p key={i} className="rounded-xl bg-edvanta-mint px-4 py-3 font-medium"><ConCitas texto={b.nota} /></p>;
        if (b.lista) return <ul key={i} className="list-disc space-y-2 pl-6">{b.lista.map((t) => <li key={t}><ConCitas texto={t} /></li>)}</ul>;
        if (b.pasos) return <ol key={i} className="list-decimal space-y-2 pl-6">{b.pasos.map((t) => <li key={t}><ConCitas texto={t} /></li>)}</ol>;
        if (b.tabla) {
          return (
            <div key={i} className="overflow-x-auto rounded-xl border border-edvanta-border">
              <table className="w-full min-w-[520px] border-collapse text-left text-[15px] leading-6">
                <thead className="bg-edvanta-mint text-edvanta-deep">
                  <tr>{b.tabla.columnas.map((c) => <th key={c} className="px-4 py-2 font-semibold"><ConCitas texto={c} /></th>)}</tr>
                </thead>
                <tbody>
                  {b.tabla.filas.map((f, j) => (
                    <tr key={j} className="border-t border-edvanta-border align-top">
                      {f.map((c, k) => <td key={k} className="px-4 py-2"><ConCitas texto={c} /></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

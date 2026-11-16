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

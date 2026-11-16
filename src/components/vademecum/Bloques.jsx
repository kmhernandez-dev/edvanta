import {
  Alerta, Barras, Ciclo, Claves, Cta, MapaRadial, Quiz, Triangulo,
} from './Visuales';
import { ConCitas } from './ConCitas';

export { ConCitas };

/** Los bloques de una sección del vademécum: párrafos, listas, pasos, tablas, notas y visuales. */
export default function Bloques({ bloques = [] }) {
  return (
    <div className="vd-bloques space-y-5 text-[16px] leading-7 text-edvanta-ink">
      {bloques.map((b, i) => {
        if (typeof b === 'string') return <p key={i}><ConCitas texto={b} /></p>;
        if (b.subtitulo) return <h3 key={i} className="pt-2 text-lg font-semibold text-edvanta-deep"><ConCitas texto={b.subtitulo} /></h3>;
        if (b.nota) return <p key={i} className="rounded-xl bg-edvanta-mint px-4 py-3 font-medium"><ConCitas texto={b.nota} /></p>;
        if (b.lista) return <ul key={i} className="list-disc space-y-2 pl-6">{b.lista.map((t) => <li key={t}><ConCitas texto={t} /></li>)}</ul>;
        if (b.pasos) return <ol key={i} className="list-decimal space-y-2 pl-6">{b.pasos.map((t) => <li key={t}><ConCitas texto={t} /></li>)}</ol>;
        if (b.mapa) return <MapaRadial key={i} mapa={b.mapa} />;
        if (b.triangulo) return <Triangulo key={i} triangulo={b.triangulo} />;
        if (b.ciclo) return <Ciclo key={i} ciclo={b.ciclo} />;
        if (b.barras) return <Barras key={i} barras={b.barras} />;
        if (b.claves) return <Claves key={i} claves={b.claves} />;
        if (b.alerta) return <Alerta key={i} alerta={b.alerta} />;
        if (b.quiz) return <Quiz key={i} quiz={b.quiz} />;
        if (b.cta) return <Cta key={i} cta={b.cta} />;
        if (b.tabla) {
          return (
            <div key={i} className="vd-tabla overflow-x-auto rounded-2xl border border-edvanta-border">
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

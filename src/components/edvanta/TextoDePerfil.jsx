import { Link } from 'react-router-dom';
import { textoDePerfil } from '../../../api/lib/textos-de-perfiles.js';

/**
 * El texto editorial de una carrera, ruta o competencia
 * (api/lib/textos-de-perfiles.js): el mismo que la API escribe en el HTML.
 * Si el perfil no tiene texto, no pinta nada.
 */
export default function TextoDePerfil({ tipo, slug }) {
  const texto = textoDePerfil(tipo, slug);
  if (!texto) return null;
  return (
    <section className="border-t border-edvanta-border bg-white">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {texto.secciones.map((s) => (
            <div key={s.titulo}>
              <h2 className="text-2xl font-semibold tracking-tight text-edvanta-deep">{s.titulo}</h2>
              {s.parrafo && <p className="mt-3 text-[16px] leading-7 text-edvanta-ink">{s.parrafo}</p>}
              {s.lista?.length > 0 && (
                <ul className="mt-3 list-disc space-y-2 pl-6 text-[16px] leading-7 text-edvanta-ink">
                  {s.lista.map((t) => <li key={t}>{t}</li>)}
                </ul>
              )}
              {s.pasos?.length > 0 && (
                <ol className="mt-3 list-decimal space-y-2 pl-6 text-[16px] leading-7 text-edvanta-ink">
                  {s.pasos.map((t) => <li key={t}>{t}</li>)}
                </ol>
              )}
              {s.enlaces?.length > 0 && (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {s.enlaces.map(([t, u]) => (
                    <li key={u}>
                      <Link to={u} className="block rounded-xl border border-edvanta-border px-4 py-3 text-[15px] font-medium text-edvanta-tealdark hover:bg-edvanta-mint">{t}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {texto.preguntas?.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-edvanta-deep">Preguntas frecuentes</h2>
              <div className="mt-4 space-y-5">
                {texto.preguntas.map(([q, a]) => (
                  <div key={q}>
                    <h3 className="text-lg font-semibold text-edvanta-deep">{q}</h3>
                    <p className="mt-1 text-[16px] leading-7 text-edvanta-ink">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================================
 *  HerramientaArticulo.jsx — Interactivo de la enfermedad
 *
 *  Tres formatos, definidos en src/data/comunidadesSalud.js:
 *   · checklist: signos de alarma, con progreso y resumen.
 *   · preparar: lista para llevar a la consulta.
 *   · quiz: mitos con explicación.
 *
 *  Todo es educativo. No calcula diagnósticos ni dosis. El resumen
 *  solo se envía si la persona pulsa el botón de WhatsApp.
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, MessageCircle, RotateCcw } from 'lucide-react';
import { waLink } from '../../config/links';
import { trackEvent } from '../../utils/analytics';

function Barra({ valor, total }) {
  const pct = total ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="mt-4">
      <div className="h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-edvanta-teal transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-edvanta-muted">{valor} de {total} marcados</p>
    </div>
  );
}

function BotonWhatsApp({ mensaje, comunidad, articuloSlug, etiqueta = 'Enviar resumen por WhatsApp' }) {
  const abrir = () => {
    trackEvent('community_join_clicked', {
      enfermedad: comunidad?.slug,
      articulo: articuloSlug,
      origen: 'herramienta',
      destino: 'whatsapp',
    });
  };
  return (
    <a
      href={waLink(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={abrir}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white transition hover:bg-[#1fb959]"
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {etiqueta}
    </a>
  );
}

function Checklist({ herramienta, comunidad, articuloSlug }) {
  const [marcados, setMarcados] = useState([]);
  const total = herramienta.items.length;
  const listo = marcados.length > 0;

  useEffect(() => {
    trackEvent('article_tool_viewed', { tipo: 'checklist', enfermedad: comunidad?.slug, articulo: articuloSlug });
    // Solo una vez por montaje.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alternar = (i) => {
    setMarcados((prev) => {
      const siguiente = prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i];
      if (!prev.length && siguiente.length) {
        trackEvent('article_tool_completed', { tipo: 'checklist', enfermedad: comunidad?.slug, articulo: articuloSlug });
      }
      return siguiente;
    });
  };

  const resumen = useMemo(() => {
    const textos = marcados.map((i) => `- ${herramienta.items[i]}`).join('\n');
    return `Hola Karla, vengo del artículo sobre ${comunidad?.nombre || 'salud'} en edvanta.co. Marqué estos puntos en la lista de signos de alarma:\n${textos}\n\nQuiero orientación para entrar a la comunidad de ${comunidad?.nombre || ''}. No he cambiado ningún medicamento.`;
  }, [marcados, herramienta.items, comunidad]);

  return (
    <div>
      <fieldset>
        <legend className="sr-only">{herramienta.titulo}</legend>
        <ul className="mt-4 space-y-2">
          {herramienta.items.map((item, i) => (
            <li key={item}>
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm leading-6 transition ${marcados.includes(i) ? 'border-edvanta-teal bg-white' : 'border-edvanta-border bg-white/60 hover:border-edvanta-teal/40'}`}>
                <input
                  type="checkbox"
                  checked={marcados.includes(i)}
                  onChange={() => alternar(i)}
                  className="mt-1 h-4 w-4 rounded border-edvanta-border text-edvanta-teal focus:ring-edvanta-teal"
                />
                <span className="text-edvanta-ink">{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <Barra valor={marcados.length} total={total} />
      <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${listo ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-edvanta-border bg-white text-edvanta-muted'}`}>
        {listo
          ? `Marcaste ${marcados.length} ${marcados.length === 1 ? 'punto' : 'puntos'}. Coméntalo hoy con tu equipo de salud. Si el síntoma es intenso, nuevo o empeora rápido, busca urgencias.`
          : 'No marcaste ninguno de estos puntos. Si algo cambia, vuelve a la lista o consulta a tu equipo de salud.'}
      </div>
      <p className="mt-2 text-xs leading-5 text-edvanta-muted">{herramienta.nota}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <BotonWhatsApp mensaje={resumen} comunidad={comunidad} articuloSlug={articuloSlug} />
        <button type="button" onClick={() => setMarcados([])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-edvanta-muted hover:text-edvanta-blue">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Limpiar
        </button>
      </div>
      <p className="mt-2 text-xs leading-5 text-edvanta-muted">Se abre WhatsApp con el resumen. Comparte solo lo que quieras.</p>
    </div>
  );
}

function Preparar({ herramienta, comunidad, articuloSlug }) {
  const [marcados, setMarcados] = useState([]);
  const total = herramienta.items.length;

  useEffect(() => {
    trackEvent('article_tool_viewed', { tipo: 'preparar', enfermedad: comunidad?.slug, articulo: articuloSlug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alternar = (i) => {
    setMarcados((prev) => {
      const siguiente = prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i];
      if (!prev.length && siguiente.length) {
        trackEvent('article_tool_completed', { tipo: 'preparar', enfermedad: comunidad?.slug, articulo: articuloSlug });
      }
      return siguiente;
    });
  };

  const resumen = useMemo(() => {
    const textos = marcados.map((i) => `- ${herramienta.items[i]}`).join('\n');
    return `Hola Karla, vengo del artículo sobre ${comunidad?.nombre || 'salud'} en edvanta.co. Estoy preparando mi consulta y ya tengo:\n${textos}\n\nQuiero entrar a la comunidad de ${comunidad?.nombre || ''} y recibir orientación educativa. No he cambiado ningún medicamento.`;
  }, [marcados, herramienta.items, comunidad]);

  return (
    <div>
      <fieldset>
        <legend className="sr-only">{herramienta.titulo}</legend>
        <ul className="mt-4 space-y-2">
          {herramienta.items.map((item, i) => (
            <li key={item}>
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm leading-6 transition ${marcados.includes(i) ? 'border-edvanta-teal bg-white' : 'border-edvanta-border bg-white/60 hover:border-edvanta-teal/40'}`}>
                <input
                  type="checkbox"
                  checked={marcados.includes(i)}
                  onChange={() => alternar(i)}
                  className="mt-1 h-4 w-4 rounded border-edvanta-border text-edvanta-teal focus:ring-edvanta-teal"
                />
                <span className="text-edvanta-ink">{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <Barra valor={marcados.length} total={total} />
      <p className="mt-3 text-sm leading-6 text-edvanta-muted">
        {marcados.length === total
          ? 'Tienes la lista completa. Llévala a la consulta y comparte solo lo que quieras.'
          : 'Marca lo que ya tengas. No necesitas completar todo para pedir ayuda.'}
      </p>
      <p className="mt-2 text-xs leading-5 text-edvanta-muted">{herramienta.nota}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <BotonWhatsApp mensaje={resumen} comunidad={comunidad} articuloSlug={articuloSlug} etiqueta="Enviar mi lista por WhatsApp" />
        <button type="button" onClick={() => setMarcados([])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-edvanta-muted hover:text-edvanta-blue">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Limpiar
        </button>
      </div>
      <p className="mt-2 text-xs leading-5 text-edvanta-muted">Se abre WhatsApp con la lista que marques. Comparte solo lo que quieras.</p>
    </div>
  );
}

function Quiz({ herramienta, comunidad, articuloSlug }) {
  const [respuestas, setRespuestas] = useState({});
  const total = herramienta.preguntas.length;
  const contestadas = Object.keys(respuestas).length;
  const correctas = herramienta.preguntas.filter((p, i) => respuestas[i] === p.correcta).length;

  useEffect(() => {
    trackEvent('article_tool_viewed', { tipo: 'quiz', enfermedad: comunidad?.slug, articulo: articuloSlug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const responder = (i, opcion) => {
    setRespuestas((prev) => {
      if (prev[i] !== undefined) return prev;
      const siguiente = { ...prev, [i]: opcion };
      if (Object.keys(siguiente).length === total) {
        const aciertos = herramienta.preguntas.filter((p, n) => siguiente[n] === p.correcta).length;
        trackEvent('article_tool_completed', { tipo: 'quiz', enfermedad: comunidad?.slug, articulo: articuloSlug, aciertos, total });
      }
      return siguiente;
    });
  };

  return (
    <div>
      <ol className="mt-4 space-y-4">
        {herramienta.preguntas.map((p, i) => {
          const elegida = respuestas[i];
          const respondida = elegida !== undefined;
          return (
            <li key={p.q} className="rounded-xl border border-edvanta-border bg-white p-4">
              <p className="text-sm font-bold text-edvanta-deep">{i + 1}. {p.q}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {p.opciones.map((op, n) => {
                  const esCorrecta = n === p.correcta;
                  const esElegida = elegida === n;
                  const estilo = !respondida
                    ? 'border-edvanta-border bg-white hover:border-edvanta-teal/50'
                    : esCorrecta
                      ? 'border-edvanta-teal bg-edvanta-mint/50 text-edvanta-tealdark'
                      : esElegida
                        ? 'border-amber-300 bg-amber-50 text-amber-900'
                        : 'border-edvanta-border bg-white text-edvanta-muted';
                  return (
                    <button
                      key={op}
                      type="button"
                      onClick={() => responder(i, n)}
                      disabled={respondida}
                      aria-pressed={esElegida}
                      className={`flex min-h-10 items-center justify-between gap-2 rounded-lg border px-3 text-left text-sm font-semibold transition ${estilo}`}
                    >
                      {op}
                      {respondida && esCorrecta && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
              {respondida && (
                <p className="mt-3 rounded-lg bg-edvanta-bg p-3 text-sm leading-6 text-edvanta-ink/80">
                  <span className="font-bold">{elegida === p.correcta ? 'Correcto. ' : 'No exactamente. '}</span>
                  {p.explica}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      {contestadas > 0 && (
        <div className="mt-4 rounded-xl border border-edvanta-border bg-white p-4 text-sm text-edvanta-deep">
          <p className="font-bold">Respuestas correctas: {correctas} de {total}</p>
          <p className="mt-1 text-edvanta-muted">El objetivo no es la nota: es reconocer las ideas que conviene revisar con tu equipo.</p>
        </div>
      )}
      <p className="mt-2 text-xs leading-5 text-edvanta-muted">{herramienta.nota}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <BotonWhatsApp
          mensaje={`Hola Karla, vengo del artículo sobre ${comunidad?.nombre || 'salud'} en edvanta.co. Acabo de hacer el quiz de mitos y quiero entrar a la comunidad de ${comunidad?.nombre || ''}.`}
          comunidad={comunidad}
          articuloSlug={articuloSlug}
          etiqueta="Hablar con la comunidad"
        />
        <button type="button" onClick={() => setRespuestas({})} className="inline-flex items-center gap-1.5 text-sm font-semibold text-edvanta-muted hover:text-edvanta-blue">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Repetir
        </button>
      </div>
    </div>
  );
}

export default function HerramientaArticulo({ herramienta, comunidad, articuloSlug = '' }) {
  if (!herramienta) return null;
  return (
    <section id="herramienta" className="my-10 scroll-mt-24 rounded-2xl border border-edvanta-border bg-edvanta-bg p-5 sm:p-6">
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        Herramienta interactiva
      </p>
      <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-edvanta-deep">{herramienta.titulo}</h2>
      <p className="mt-2 text-sm leading-6 text-edvanta-ink/80">{herramienta.intro}</p>
      {herramienta.tipo === 'checklist' && <Checklist herramienta={herramienta} comunidad={comunidad} articuloSlug={articuloSlug} />}
      {herramienta.tipo === 'preparar' && <Preparar herramienta={herramienta} comunidad={comunidad} articuloSlug={articuloSlug} />}
      {herramienta.tipo === 'quiz' && <Quiz herramienta={herramienta} comunidad={comunidad} articuloSlug={articuloSlug} />}
    </section>
  );
}

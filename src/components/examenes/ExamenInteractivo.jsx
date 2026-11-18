/**
 * Examen interactivo público.
 *
 * Se responde en el navegador, sin registro. La corrección es local y
 * educativa; no genera certificado ni reemplaza una evaluación de curso.
 * Cada intento se mide con `exam_completed` para saber qué temas se
 * estudian y desde dónde llega la persona.
 */

import { useMemo, useState } from 'react';
import { Check, MessageCircle, RotateCcw, Send, X } from 'lucide-react';
import { waLink } from '../../config/links';
import { trackEvent } from '../../utils/analytics';

function progreso(answers, total) {
  return total ? Math.round((Object.keys(answers).length / total) * 100) : 0;
}

function Resultado({ examen, correctas, total, setRetry }) {
  const pct = Math.round((correctas / total) * 100);
  const mensaje = pct >= 80
    ? 'Muy bien: dominas la mayoría de los conceptos. Revisa las explicaciones de las que fallaste y prueba el siguiente tema.'
    : pct >= 60
      ? 'Vas por buen camino. Repasa las preguntas falladas y vuelve a intentarlo; la explicación es la parte más importante.'
      : 'Este tema necesita repaso. Lee las explicaciones, revisa los artículos enlazados y vuelve a intentarlo sin prisa.';

  const compartir = waLink(`Hice el ${examen.titulo} de Edvanta y saqué ${correctas}/${total} (${pct} %). Practica gratis: https://edvanta.co${examen.ruta}`);

  return (
    <div className="mt-6 rounded-2xl border border-edvanta-border bg-white p-5" aria-live="polite">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">Resultado</p>
          <p className="mt-1 font-display text-4xl font-extrabold tabular-nums text-edvanta-deep">
            {correctas}<span className="text-xl font-bold text-edvanta-muted">/{total}</span>
          </p>
          <p className="text-sm font-semibold text-edvanta-tealdark">{pct} % de aciertos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setRetry();
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-4 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Repetir
          </button>
          <a
            href={compartir}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('exam_shared', { examen: examen.slug, score: pct })}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-white transition hover:bg-[#1fb959]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Compartir
          </a>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-edvanta-ink/80">{mensaje}</p>
    </div>
  );
}

export default function ExamenInteractivo({ examen, onReset }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [answerError, setAnswerError] = useState('');
  const total = examen.preguntas.length;
  const respondidas = Object.keys(answers).length;
  const correctas = useMemo(
    () => examen.preguntas.reduce((n, p) => (answers[p.id] === p.correcta ? n + 1 : n), 0),
    [answers, examen.preguntas],
  );
  const completo = respondidas === total;

  const setRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setAnswerError('');
    if (onReset) onReset();
    trackEvent('exam_retried', { examen: examen.slug });
    document.getElementById('examen')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const responder = (preguntaId, opcion) => {
    if (submitted) return;
    setAnswerError('');
    setAnswers((prev) => ({ ...prev, [preguntaId]: opcion }));
  };

  const enviar = () => {
    if (!completo) {
      setAnswerError(`Faltan ${total - respondidas} pregunta${total - respondidas === 1 ? '' : 's'} por responder.`);
      return;
    }
    setSubmitted(true);
    setAnswerError('');
    const pct = Math.round((correctas / total) * 100);
    trackEvent('exam_completed', { examen: examen.slug, categoria: examen.categoria, aciertos: correctas, total, score: pct });
  };

  return (
    <section id="examen" className="scroll-mt-24">
      <div className="rounded-2xl border border-edvanta-border bg-edvanta-bg p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">Examen interactivo</p>
            <p className="mt-1 text-sm text-edvanta-muted">
              {total} preguntas · {examen.duracion} · {examen.nivel}
            </p>
          </div>
          <p className="text-sm font-semibold text-edvanta-deep" aria-live="polite">
            {respondidas} de {total} respondidas
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progreso(answers, total)}>
          <div className="h-full rounded-full bg-edvanta-teal transition-[width] duration-300" style={{ width: `${progreso(answers, total)}%` }} />
        </div>
      </div>

      <ol className="mt-6 space-y-5">
        {examen.preguntas.map((p, i) => {
          const elegida = answers[p.id];
          const respondida = elegida !== undefined;
          const acierto = submitted && elegida === p.correcta;
          return (
            <li key={p.id} className="rounded-2xl border border-edvanta-border bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold leading-6 text-edvanta-deep">
                  <span className="mr-1 text-edvanta-blue">{i + 1}.</span> {p.enunciado}
                </p>
                {submitted && (
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${acierto ? 'bg-edvanta-mint text-edvanta-tealdark' : 'bg-amber-50 text-amber-800'}`}>
                    {acierto ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <X className="h-3.5 w-3.5" aria-hidden="true" />}
                    {acierto ? 'Correcta' : 'Revisar'}
                  </span>
                )}
              </div>

              <fieldset className="mt-3 grid gap-2 sm:grid-cols-2">
                <legend className="sr-only">Opciones de la pregunta {i + 1}</legend>
                {p.opciones.map((op, n) => {
                  const esCorrecta = n === p.correcta;
                  const esElegida = elegida === n;
                  const estilo = !submitted
                    ? esElegida
                      ? 'border-edvanta-teal bg-edvanta-mint/50 text-edvanta-deep'
                      : 'border-edvanta-border bg-white hover:border-edvanta-teal/50'
                    : esCorrecta
                      ? 'border-edvanta-teal bg-edvanta-mint/60 text-edvanta-deep'
                      : esElegida
                        ? 'border-amber-300 bg-amber-50 text-amber-900'
                        : 'border-edvanta-border bg-white text-edvanta-muted';
                  return (
                    <label key={op} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm leading-6 transition ${estilo}`}>
                      <input
                        type="radio"
                        name={`pregunta-${p.id}`}
                        value={n}
                        checked={esElegida}
                        onChange={() => responder(p.id, n)}
                        disabled={submitted}
                        className="mt-1 h-4 w-4 shrink-0 border-edvanta-border text-edvanta-teal focus:ring-edvanta-teal"
                      />
                      <span>{op}</span>
                    </label>
                  );
                })}
              </fieldset>

              {submitted && (
                <div className="mt-3 rounded-xl bg-edvanta-bg p-3 text-sm leading-6 text-edvanta-ink/80">
                  <p><strong className="text-edvanta-deep">Respuesta correcta:</strong> {p.opciones[p.correcta]}</p>
                  <p className="mt-1"><strong className="text-edvanta-deep">Por qué:</strong> {p.explicacion}</p>
                  <p className="mt-1 text-xs text-edvanta-muted">Fuente: {p.fuente}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {answerError && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">{answerError}</p>}

      {!submitted ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={enviar}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-bold text-white transition hover:bg-edvanta-bluedark"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Corregir examen
          </button>
          <p className="text-xs text-edvanta-muted">Sin registro. La corrección es educativa y no genera certificado.</p>
        </div>
      ) : (
        <Resultado examen={examen} correctas={correctas} total={total} setRetry={setRetry} />
      )}
    </section>
  );
}

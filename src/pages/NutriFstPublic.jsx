/**
 * ============================================================
 *  NutriFstPublic.jsx — /nutrifst
 *  NutriFST IA público: motor local, sin sesión requerida.
 *  Misma base de conocimiento y seguridad clínica que la app.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import BrandSwitch from '../components/BrandSwitch';
import { SafetyNote, AnswerCard, EvidenceButton, LevelBadge } from '../components/fstApp/ui';
import Icon from '../components/Icon';
import { analyzeQuestion, uid } from '../lib/fstApp/nutrifst';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import { trackFstClick } from '../lib/fstClicks';
import { waLink } from '../config/links';

const suggestionChips = [
  '¿Puedo tomar café?',
  '¿El calcio interfiere con mi levotiroxina?',
  'Hazme un menú para esta semana',
  'Cocina con lo que tengo: pollo, arroz, huevo',
  'Analiza este plato: arroz, pollo, ensalada',
  '¿Qué puedo desayunar?',
];

const greeting = {
  brief: 'Hola, soy NutriFST. Pregúntame sobre alimentos, interacciones con levotiroxina, menús, suplementos, síntomas y organización de tu tratamiento.',
  level: 'verde',
  evidence: [],
};

export default function NutriFstPublic() {
  const [messages, setMessages] = useState([
    { id: uid('msg'), role: 'assistant', content: greeting.brief, level: 'verde', evidence: [] },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', { page_name: 'nutrifst_public' });
    trackFstClick({ section: 'nutrifst', element: 'page_view', label: 'Página NutriFST' });
    return updatePageSeo({
      title: 'NutriFST IA | Preguntas sobre alimentación y levotiroxina | Feliz Sin Tiroides',
      description: 'NutriFST IA responde tus dudas de alimentación, interacciones con levotiroxina, menús y suplementos con evidencia verificable.',
      canonical: 'https://edvanta.co/nutrifst',
      image: 'https://edvanta.co/img/feliz-sin-tiroides-hero-v2.webp',
    });
  }, []);

  const send = text => {
    const question = (text ?? input).trim();
    if (!question || typing) return;
    setInput('');
    setTyping(true);
    setMessages(current => [...current, { id: uid('msg'), role: 'user', content: question }]);
    window.setTimeout(() => {
      const answer = analyzeQuestion(question, {});
      setMessages(current => [...current, {
        id: uid('msg'), role: 'assistant', content: answer.brief, level: answer.level, evidence: answer.evidence,
      }]);
      setTyping(false);
      window.setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />
      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <section className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ebf7] px-3 py-1 text-xs font-semibold text-[#563a78]">
              <Icon name="sparkles" className="h-3.5 w-3.5" /> NutriFST IA · Feliz Sin Tiroides
            </span>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-deepblue-900 md:text-4xl">
              Pregúntale a NutriFST
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Alimentos, interacciones con levotiroxina, menús, suplementos y más.
              Respuestas educativas con evidencia verificable. Sin necesidad de cuenta.
            </p>
          </section>

          {/* Safety */}
          <div className="mt-6">
            <SafetyNote>
              NutriFST no diagnostica, no modifica dosis ni reemplaza a tu profesional de salud. Ante una emergencia, busca atención médica inmediata.
            </SafetyNote>
          </div>

          {/* Chat */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-[#eae2f8] bg-white shadow-sm" aria-label="Chat con NutriFST">
            <div className="border-b border-[#f0eaf5] bg-[#faf8fd] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAE2F8] text-[#9274C9]">
                  <Icon name="sparkles" className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#0A2540]">NutriFST IA</p>
                  <p className="text-[10px] text-slate-500">Asistente nutricional · respuestas deterministas</p>
                </div>
              </div>
            </div>

            <div ref={listRef} className="max-h-[28rem] space-y-4 overflow-y-auto p-4" aria-live="polite">
              {messages.map(message => (
                <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-[#0A2540] text-white'
                      : 'rounded-bl-md border border-[#f0eaf5] bg-[#faf8fd] text-slate-700'
                  }`}>
                    {message.role === 'assistant' && (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#9274C9]">NutriFST</p>
                    )}
                    <p className="mt-0.5 whitespace-pre-line">{message.content}</p>
                    {message.role === 'assistant' && (
                      <div className="mt-2">
                        <LevelBadge level={message.level} />
                        <EvidenceButton evidenceIds={message.evidence} compact />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-[#f0eaf5] bg-[#faf8fd] px-4 py-3 text-xs text-slate-400">
                    Escribiendo…
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#f0eaf5] p-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1" aria-label="Preguntas sugeridas">
                {suggestionChips.map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => send(chip)}
                    className="shrink-0 rounded-full border border-[#eae2f8] bg-white px-3 py-1.5 text-xs font-semibold text-[#9274C9] hover:bg-[#f7f3fb]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <form
                onSubmit={event => { event.preventDefault(); send(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  placeholder="Escribe tu pregunta sobre alimentación o levotiroxina…"
                  className="min-h-11 flex-1 rounded-xl border border-[#f0eaf5] bg-white px-4 text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#2CB1A1]/30"
                  aria-label="Tu pregunta"
                />
                <button
                  type="submit"
                  disabled={typing || !input.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A2540] text-white hover:bg-[#123b5f] disabled:opacity-50"
                  aria-label="Enviar pregunta"
                >
                  <Icon name="arrowRight" className="h-4 w-4" />
                </button>
              </form>
            </div>
          </section>

          {/* CTA cuenta */}
          <section className="mt-8 rounded-2xl border border-[#d3efe9] bg-gradient-to-br from-[#e8f4f2] to-[#fdf2f6] p-6 text-center sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-deepblue-900">
              Tu espacio completo te espera
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600">
              Con tu cuenta de Feliz Sin Tiroides puedes guardar tus preguntas, registrar tu medicación,
              tus síntomas y generar tu reporte de consulta. NutriFST aprende de tus datos.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/fst-app?modo=registro"
                onClick={() => {
                  trackEvent('hero_cta_click', { cta: 'crear_cuenta', location: 'nutrifst_public' });
                  trackFstClick({ section: 'nutrifst', element: 'cta_crear_cuenta', label: 'Crear mi cuenta', destination: '/fst-app?modo=registro' });
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-teal-600 px-6 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Crear mi cuenta gratis
              </Link>
              <a
                href={waLink('Hola, tengo una duda sobre NutriFST de Feliz Sin Tiroides.')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackFstClick({ section: 'nutrifst', element: 'cta_whatsapp', label: 'Hablar con Karla' })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-sand-200 bg-white px-6 text-sm font-semibold text-gray-600 hover:bg-sand-50"
              >
                <Icon name="message" className="h-4 w-4" /> Hablar con Karla
              </a>
            </div>
          </section>

          {/* Aviso */}
          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs leading-6 text-amber-900">
              <strong>Aviso:</strong> NutriFST IA es una herramienta educativa. No sustituye valoración, diagnóstico,
              tratamiento ni seguimiento por profesionales de salud.{' '}
              <Link to="/descargo-medico" className="font-semibold underline">Ver descargo médico</Link>
            </p>
          </section>
        </div>
      </main>
      <BrandSwitch current="fst" />
      <FstFooter />
    </div>
  );
}

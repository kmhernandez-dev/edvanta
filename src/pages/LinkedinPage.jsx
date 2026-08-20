import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Copy, DollarSign,
  Image as ImageIcon, Lightbulb, Loader2, MessageCircle, Sparkles, TrendingUp,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { bancoPromptsLinkedin, guiaLinkedinPasos, productoLinkedin } from '../data/careerHub';

const CATEGORIAS = ['Titular y "Acerca de"', 'Perfil completo', 'Contenido', 'Red de contactos', 'Comentarios y engagement', 'Posicionamiento'];

function PromptCard({ item, index }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase text-sky-700">{item.categoria}</p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">#{index + 1}</span>
      </div>
      <h3 className="mt-2 text-base font-bold text-[#071a4a]">{item.titulo}</h3>
      <p className="mt-3 flex-1 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item.prompt}</p>
      <button type="button" onClick={copiar} className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 text-sm font-bold text-sky-800 transition hover:bg-sky-100">
        {copiado ? <><CheckCircle2 className="h-4 w-4" /> Copiado</> : <>Copiar prompt</>}
      </button>
    </article>
  );
}

export default function LinkedinPage() {
  const [categoria, setCategoria] = useState('Todas');
  const [copiadoGuia, setCopiadoGuia] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => updatePageSeo({
    title: 'Mejora tu LinkedIn farmacéutico | Edvanta',
    description: 'Guía práctica con imágenes, banco de prompts de IA y guía para generar ingresos con LinkedIn y tu marca personal.',
    canonical: 'https://edvanta.co/linkedin',
    jsonLdId: 'linkedin',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'LinkedIn para farmacéuticos', url: 'https://edvanta.co/linkedin' },
  }), []);

  const promptsVisibles = useMemo(
    () => categoria === 'Todas' ? bancoPromptsLinkedin : bancoPromptsLinkedin.filter(p => p.categoria === categoria),
    [categoria]
  );

  const comprarGuia = async () => {
    setPaying(true);
    setPayError('');
    try {
      const res = await fetch(apiUrl('/api/create-preference'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: productoLinkedin.id, qty: 1 }],
          checkout: 'linkedin_guia',
        }),
      });
      const data = await res.json();
      if (res.ok && data.init_point) {
        window.location.href = data.init_point;
      } else {
        setPayError(data.error || 'No se pudo iniciar el pago. Intenta de nuevo.');
        setPaying(false);
      }
    } catch {
      setPayError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      setPaying(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras
            </Link>
            <div className="mt-6 flex max-w-3xl items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <TrendingUp className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-sky-200">Marca personal</p>
                <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">Mejora tu LinkedIn con prompts y guía práctica</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-sky-50">
                  Un banco de prompts listos para copiar, una guía práctica guiada con imágenes para tu perfil y una guía para convertir tu marca personal en ingresos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prompts */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-sky-700" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Guía de prompts para mejorar tu LinkedIn</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Copia el prompt, reemplaza lo que está entre llaves o corchetes y pégalo en tu asistente favorito. El resultado lo adaptas a tu voz.
          </p>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Filtrar prompts">
            {['Todas', ...CATEGORIAS].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoria(c)}
                aria-pressed={categoria === c}
                className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition ${categoria === c ? 'border-sky-700 bg-sky-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-sky-400'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promptsVisibles.map((p, i) => <PromptCard key={p.titulo} item={p} index={i} />)}
          </div>
        </section>

        {/* Guía con imágenes */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-sky-700" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Guía práctica guiada con imágenes</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Sigue los 6 pasos en orden. Cada uno corresponde a una pantalla del perfil y tiene una instrucción concreta.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {guiaLinkedinPasos.map(paso => (
                <div key={paso.paso} className="relative rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <span className="absolute -top-3 left-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white" aria-hidden="true">{paso.paso.split(' ')[0]}</span>
                  <h3 className="mt-3 text-base font-bold text-[#071a4a]">{paso.paso}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{paso.detalle}</p>
                  <div className="mt-4 flex h-24 items-center justify-center rounded-lg border border-dashed border-sky-300 bg-sky-50/60">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700">
                      <ImageIcon className="h-4 w-4" aria-hidden="true" /> Referencia visual del paso
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Producto: guía de ingresos */}
        <section id="ingresos" className="scroll-mt-24 bg-[#0b1f3f] py-14">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-sky-300">
                <DollarSign className="h-4 w-4" aria-hidden="true" /> Producto digital
              </div>
              <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">{productoLinkedin.name}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{productoLinkedin.resumen}</p>
              <ul className="mt-6 space-y-3">
                {productoLinkedin.includes.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />{item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button type="button" onClick={comprarGuia} disabled={paying} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-500 px-7 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
                  {paying ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <BookOpen className="h-4 w-4" aria-hidden="true" />}
                  {paying ? 'Preparando el pago...' : `Comprar por $${productoLinkedin.priceUsd} USD`}
                </button>
                <span className="text-sm font-bold text-sky-300">Pago seguro con Mercado Pago</span>
              </div>
              {payError && <p className="mt-3 text-sm font-semibold text-rose-300" role="alert">{payError}</p>}
              <p className="mt-4 text-xs text-slate-400">Incluye la guía en PDF y acceso al acompañamiento por WhatsApp de la comunidad.</p>
            </div>
            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/5 p-8 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wide text-sky-300">Lo que resolverás</p>
              <div className="mt-5 space-y-4">
                {[
                  ['Posicionar tu perfil', 'Tu perfil aparece en la primera página de búsquedas de reclutadores farmacéuticos.'],
                  ['Crear contenido con constancia', 'Un calendario de 90 días con temas para no quedarte sin ideas.'],
                  ['Ofrecer servicios', 'Consultoría, clases y asesorías que empiezan en tu perfil, no en tu lista de clientes.'],
                  ['Generar ingresos', 'El método de oferta directa para convertir seguidores en clientes.'],
                ].map(([titulo, texto]) => (
                  <div key={titulo} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-400/20 text-sky-300"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /></span>
                    <div>
                      <p className="text-sm font-bold text-white">{titulo}</p>
                      <p className="mt-0.5 text-sm leading-6 text-slate-300">{texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA comunidad */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-[#071a4a]">¿Quieres retroalimentación de tu perfil?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Comparte tu perfil en la comunidad de WhatsApp y recibe comentarios de otros profesionales farmacéuticos.
              </p>
            </div>
            <a
              href="https://chat.whatsapp.com/DBqfWNhlkQOFQ9fo90e2Qq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-bold text-white transition hover:bg-sky-800"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Unirme a la comunidad
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

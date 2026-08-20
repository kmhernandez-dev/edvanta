import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, ScanSearch, Mail, BriefcaseBusiness, Compass, Share2, ClipboardList, Rocket, Building2,
  Check, ArrowRight, ChevronRight, Sparkles,
} from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';
import RelatedContent from './RelatedContent';
import { updatePageSeo } from '../../utils/seo';
import { KIND_LABEL } from '../../data/edvanta/herramientas';

const ICONS = {
  file: FileText, scan: ScanSearch, mail: Mail, briefcase: BriefcaseBusiness,
  compass: Compass, linkedin: Share2, clipboard: ClipboardList, rocket: Rocket, building: Building2,
};

// Preview ilustrativa de la interfaz según el patrón UX de la herramienta.
function ToolPreview({ kind, Icon }) {
  const inner = () => {
    switch (kind) {
      case 'builder':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-edvanta-light" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-2/3 rounded bg-slate-200" />
                <div className="h-2 w-1/2 rounded bg-slate-100" />
              </div>
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <span className="text-base font-extrabold leading-none">82</span>
                <span className="text-[8px] font-bold uppercase">ATS</span>
              </div>
            </div>
            {['Perfil', 'Experiencia', 'Habilidades'].map((s, i) => (
              <div key={s} className="rounded-lg border border-edvanta-border bg-white p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-edvanta-deep">{s}</span>
                  <span className="text-[10px] font-bold text-teal-600">{[100, 80, 60][i]}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full bg-edvanta-blue" style={{ width: `${[100, 80, 60][i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        );
      case 'analyzer':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-teal-50 p-3">
              <span className="text-[11px] font-bold text-teal-800">Compatibilidad con el cargo</span>
              <span className="text-xl font-extrabold text-teal-700">78%</span>
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">Palabras clave encontradas</p>
              <div className="flex flex-wrap gap-1.5">
                {['BPM', 'HPLC', 'Auditoría'].map((k) => (
                  <span key={k} className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">Faltantes (prioridad alta)</p>
              <div className="flex flex-wrap gap-1.5">
                {['CAPA', 'Validación'].map((k) => (
                  <span key={k} className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">{k}</span>
                ))}
              </div>
            </div>
          </div>
        );
      case 'generator':
        return (
          <div className="space-y-3">
            <div className="rounded-lg border border-edvanta-border bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-edvanta-blue">Titular</span>
                <span className="rounded bg-edvanta-light px-1.5 py-0.5 text-[9px] font-bold text-edvanta-blue">Copiar</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 w-full rounded bg-slate-100" />
                <div className="h-2 w-4/5 rounded bg-slate-100" />
              </div>
            </div>
            {['Acerca de', 'Experiencia'].map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-lg border border-edvanta-border bg-white p-2.5">
                <Sparkles className="h-3.5 w-3.5 text-edvanta-blue" aria-hidden="true" />
                <span className="text-[11px] font-bold text-edvanta-deep">{s}</span>
              </div>
            ))}
          </div>
        );
      case 'wizard':
        return (
          <div className="space-y-2.5">
            {['Elige tus intereses', 'Señala tus fortalezas', 'Explora tu resultado'].map((s, i) => (
              <div key={s} className="flex items-center gap-3 rounded-lg border border-edvanta-border bg-white p-2.5">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${i === 0 ? 'bg-edvanta-blue text-white' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</span>
                <span className={`text-[11px] font-bold ${i === 0 ? 'text-edvanta-deep' : 'text-slate-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        );
      case 'explorer':
        return (
          <div className="space-y-2.5">
            {['Analista de calidad · Bogotá', 'Regente de farmacia · Medellín', 'Farmacovigilancia · Híbrido'].map((s) => (
              <div key={s} className="rounded-lg border border-edvanta-border bg-white p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-edvanta-deep">{s.split(' · ')[0]}</span>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">{s.split(' · ')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'library':
      default:
        return (
          <div className="rounded-lg border border-edvanta-border bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-edvanta-blue" aria-hidden="true" />
              <div className="h-2 w-1/3 rounded bg-slate-200" />
            </div>
            <div className="space-y-1.5">
              {[5, 4, 5, 3].map((w, i) => <div key={i} className="h-2 rounded bg-slate-100" style={{ width: `${w * 18}%` }} />)}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-edvanta-border bg-white p-4 shadow-xl shadow-edvanta-deep/5">
      {/* barra estilo app */}
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <Icon className="h-3 w-3" aria-hidden="true" /> Vista previa
        </span>
      </div>
      {inner()}
    </div>
  );
}

/**
 * Layout reutilizable de landing de herramienta (punto 20).
 * Landing = presenta y explica; el CTA lleva al workspace real.
 */
export default function ToolLanding({ tool }) {
  const Icon = ICONS[tool.icon] || FileText;

  useEffect(() => {
    if (tool.seo) {
      updatePageSeo({
        ...tool.seo,
        canonical: `https://edvanta.co/herramientas/${tool.slug}`,
        jsonLdId: `herramienta-${tool.slug}`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: tool.h1,
          applicationCategory: 'BusinessApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          url: `https://edvanta.co/herramientas/${tool.slug}`,
        },
      });
    }
  }, [tool]);

  const isAnchor = tool.cta.to.includes('#');
  const Cta = ({ className, children }) =>
    isAnchor ? (
      <a href={tool.cta.to} className={className}>{children}</a>
    ) : (
      <Link to={tool.cta.to} className={className}>{children}</Link>
    );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        {/* Breadcrumb */}
        <nav aria-label="Ruta de navegación" className="border-b border-edvanta-border bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-sm text-slate-500 sm:px-6 lg:px-8">
            <Link to="/" className="font-semibold hover:text-edvanta-blue">Edvanta</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
            <Link to="/herramientas" className="font-semibold hover:text-edvanta-blue">Herramientas</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
            <span className="font-bold text-edvanta-deep">{tool.nav}</span>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-edvanta-light/40">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-edvanta-blue/20 bg-edvanta-light px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-edvanta-blue">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {tool.eyebrow}
              </span>
              <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-edvanta-deep sm:text-4xl lg:text-[2.9rem]">
                {tool.h1}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">{tool.tagline}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Cta className="btn-edvanta">
                  {tool.cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Cta>
                <Link to="/herramientas" className="btn-edvanta-outline">Ver todas las herramientas</Link>
              </div>
              {KIND_LABEL[tool.kind] && (
                <p className="mt-4 text-sm font-semibold text-slate-400">{KIND_LABEL[tool.kind]} · Gratis</p>
              )}
            </div>
            <div className="flex justify-center lg:justify-end">
              <ToolPreview kind={tool.kind} Icon={Icon} />
            </div>
          </div>
        </section>

        {/* Qué puedes hacer */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="eyebrow-edvanta mb-1.5">Qué puedes hacer</p>
          <h2 className="font-display text-2xl font-extrabold text-edvanta-deep md:text-3xl">Todo lo que resuelve esta herramienta</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {tool.canDo.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-edvanta-border bg-white p-4">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-6 text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="border-y border-edvanta-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="eyebrow-edvanta mb-1.5">Cómo funciona</p>
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep md:text-3xl">En tres pasos</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {tool.steps.map((s, i) => (
                <div key={s.title} className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-edvanta-deep text-lg font-extrabold text-white">{i + 1}</span>
                  <h3 className="mt-4 text-base font-bold text-edvanta-deep">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Para quién + Resultado */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow-edvanta mb-1.5">Para quién sirve</p>
              <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Pensada para ti si…</h2>
              <ul className="mt-5 space-y-2.5">
                {tool.audience.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-edvanta-blue" aria-hidden="true" /> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-edvanta-deep to-edvanta-blue p-7 text-white">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">Resultado</p>
              <p className="mt-3 text-lg font-semibold leading-8">{tool.outcome}</p>
              <Cta className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-edvanta-deep transition hover:bg-edvanta-light">
                {tool.cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Cta>
            </div>
          </div>
        </section>

        {/* Recursos relacionados (ecosistema) */}
        <div className="border-t border-edvanta-border bg-white py-14">
          <RelatedContent meta={tool.relatedMeta} title="Recursos relacionados" eyebrow="Ecosistema Edvanta" limit={6} />
        </div>

        {/* CTA final */}
        <section className="bg-[#f7f9fc] py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl bg-edvanta-deep px-8 py-12 text-center">
              <h2 className="font-display text-2xl font-extrabold text-white md:text-3xl">{tool.h1}</h2>
              <div className="mt-6 flex justify-center">
                <Cta className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-edvanta-deep transition hover:bg-edvanta-light">
                  {tool.cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Cta>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

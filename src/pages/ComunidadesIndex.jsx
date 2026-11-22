/**
 * /comunidades — Grupos de apoyo para pacientes, uno por enfermedad.
 *
 * Es el hub que reúne las comunidades de pacientes y cuidadores.
 * Cada tarjeta lleva a su página; la página lleva al WhatsApp de
 * Karla (+57 300 633 2244) con un mensaje propio de la enfermedad.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse, MessageCircle, Search, ShieldCheck, Users } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import { COMUNIDADES, META_COMUNIDADES, PREGUNTAS_COMUNIDADES } from '../data/comunidadesSalud';
import { faqJsonLd } from '../lib/comunidades/seo';
import { trackEvent } from '../utils/analytics';
import { waLink } from '../config/links';
import { updatePageSeo } from '../utils/seo';

const ORIENTACION = waLink('Hola Karla, vengo de las comunidades de pacientes de edvanta.co. No sé qué comunidad elegir y quiero orientación.');

/** Sin tildes ni mayúsculas, para buscar «diabetes», «presion alta» o «tiroides». */
const plano = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const TEXTO_DE = new Map(COMUNIDADES.map((c) => [c.slug, plano([c.nombre, c.titulo, c.resumen, c.apoyo?.corto, ...(c.keywords || []), ...(c.paraQuien || [])].join(' '))]));

export default function ComunidadesIndex() {
  const [q, setQ] = useState('');
  const visibles = useMemo(() => {
    const palabras = plano(q).split(/\s+/).filter((w) => w.length >= 2);
    if (!palabras.length) return COMUNIDADES;
    return COMUNIDADES.filter((c) => palabras.every((w) => TEXTO_DE.get(c.slug).includes(w)));
  }, [q]);
  useEffect(() => {
    if (q.trim().length < 3) return undefined;
    const t = setTimeout(() => trackEvent('community_search', { q: plano(q).slice(0, 40), resultados: visibles.length }), 900);
    return () => clearTimeout(t);
  }, [q, visibles.length]);
  useEffect(() => updatePageSeo({
    title: META_COMUNIDADES.titulo,
    description: META_COMUNIDADES.descripcion,
    canonical: 'https://edvanta.co/comunidades',
    type: 'website',
    jsonLdId: 'comunidades',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: META_COMUNIDADES.h1,
          description: META_COMUNIDADES.descripcion,
          url: 'https://edvanta.co/comunidades',
          inLanguage: 'es-CO',
          isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: 'https://edvanta.co' },
          publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
        },
        {
          '@type': 'ItemList',
          itemListElement: COMUNIDADES.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.titulo,
            url: `https://edvanta.co${c.ruta}`,
          })),
        },
        faqJsonLd(PREGUNTAS_COMUNIDADES),
      ],
    },
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Comunidades' }]} />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-edvanta-teal/30 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
              <Users className="h-4 w-4" aria-hidden="true" />
              Grupos de apoyo Edvanta
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-deep sm:text-[3rem]">
              {META_COMUNIDADES.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-edvanta-muted">
              Grupos de apoyo en línea, gratis y por WhatsApp, organizados por enfermedad. Experiencias, preguntas y
              educación clara, con Karla Hernández, química farmacéutica, como puerta de entrada. No son consultorios
              ni servicios de urgencias.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={ORIENTACION}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white transition hover:bg-[#1fb959]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Pedir orientación por WhatsApp
              </a>
              <Link to="/contigo" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light">
                Conocer Edvanta Contigo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-edvanta-muted">
              <ShieldCheck className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />
              Acceso gratuito. No se comparten dosis ni datos clínicos.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-8 rounded-[20px] border border-edvanta-teal/25 bg-gradient-to-br from-edvanta-mint/60 via-white to-white p-5 shadow-[0_24px_60px_-44px_rgba(3,29,92,.55)] sm:p-6">
            <label htmlFor="buscar-grupo" className="font-display text-lg font-bold text-edvanta-deep">Encuentra tu grupo de apoyo</label>
            <p className="mt-1 text-sm text-edvanta-muted">Escribe la enfermedad que tienes o que cuidas: diabetes, presión alta, tiroides, ansiedad…</p>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-edvanta-muted" aria-hidden="true" />
              <input
                id="buscar-grupo"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ej.: hipotiroidismo"
                autoComplete="off"
                className="block min-h-12 w-full rounded-xl border border-edvanta-border bg-white pl-12 pr-4 text-base text-edvanta-deep outline-none transition focus:border-edvanta-teal focus:ring-4 focus:ring-edvanta-teal/15"
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-edvanta-tealdark" aria-live="polite">
              {q.trim() ? `${visibles.length} ${visibles.length === 1 ? 'grupo' : 'grupos'} para «${q.trim()}»` : `${COMUNIDADES.length} grupos de apoyo, gratis y por WhatsApp`}
            </p>
          </div>
          {visibles.length === 0 && (
            <div className="rounded-2xl border border-edvanta-border bg-white p-6 text-center">
              <p className="font-display text-lg font-bold text-edvanta-deep">Aún no hay un grupo con ese nombre</p>
              <p className="mx-auto mt-1 max-w-xl text-sm text-edvanta-muted">Escríbenos por WhatsApp: te orientamos y anotamos la enfermedad para abrir nuevos grupos.</p>
              <a href={ORIENTACION} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn--whatsapp mt-4">
                <MessageCircle aria-hidden="true" />
                Pedir orientación por WhatsApp
              </a>
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibles.map((c) => (
              <article key={c.slug} className="flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-5 shadow-[0_1px_2px_rgba(23,34,59,.04)] transition hover:-translate-y-0.5 hover:border-edvanta-teal/40 hover:shadow-[0_12px_36px_rgba(23,34,59,.10)]">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
                  <HeartPulse className="h-4 w-4" aria-hidden="true" />
                  {c.nombre}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold leading-snug text-edvanta-deep">
                  <Link to={c.ruta} className="hover:text-edvanta-blue">{c.titulo}</Link>
                </h2>
                <p className="mt-2 text-sm leading-6 text-edvanta-muted">{c.resumen}</p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                  <Link to={`${c.ruta}#inscripcion`} className="ed-btn ed-btn--primary ed-btn--sm">
                    Inscribirme gratis
                  </Link>
                  <Link to={c.ruta} className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                    Ver el grupo
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={c.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-edvanta-tealdark hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Cómo funciona</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ['1. Escribes por WhatsApp', 'Cuéntanos qué comunidad te interesa. Te respondemos con las reglas y el paso siguiente.'],
                ['2. Entras al grupo', 'Cada grupo de apoyo se organiza por enfermedad. No hay ventas dentro del grupo.'],
                ['3. Sigues con contenido', 'Artículos revisados, herramientas interactivas y cursos con certificado cuando quieras profundizar.'],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <p className="font-display text-base font-bold text-edvanta-deep">{t}</p>
                  <p className="mt-2 text-sm leading-6 text-edvanta-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pt-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Preguntas sobre los grupos de apoyo</h2>
          <div className="mt-6 divide-y divide-edvanta-border rounded-2xl border border-edvanta-border bg-white">
            {PREGUNTAS_COMUNIDADES.map(([q, a]) => (
              <details key={q} className="group p-4">
                <summary className="cursor-pointer list-none font-display text-base font-bold text-edvanta-deep marker:hidden">
                  <h3 className="inline">{q}</h3>
                </summary>
                <p className="mt-2 text-sm leading-6 text-edvanta-ink/80">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">La información no alcanza; el acompañamiento ayuda</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-edvanta-muted">
            Si no sabes cuál elegir, escríbenos y te orientamos. Los grupos de apoyo son gratuitos y no reemplazan tu tratamiento.
          </p>
          <a
            href={ORIENTACION}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 text-sm font-bold text-white transition hover:bg-[#1fb959]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Hablar con Karla por WhatsApp
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

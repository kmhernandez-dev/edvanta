/**
 * /comunidades — Una comunidad por enfermedad.
 *
 * Es el hub que reúne las comunidades de pacientes y cuidadores.
 * Cada tarjeta lleva a su página; la página lleva al WhatsApp de
 * Karla (+57 300 633 2244) con un mensaje propio de la enfermedad.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse, MessageCircle, ShieldCheck, Users } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import { COMUNIDADES, META_COMUNIDADES } from '../data/comunidadesSalud';
import { waLink } from '../config/links';
import { updatePageSeo } from '../utils/seo';

const ORIENTACION = waLink('Hola Karla, vengo de las comunidades de pacientes de edvanta.co. No sé qué comunidad elegir y quiero orientación.');

export default function ComunidadesIndex() {
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
            name: `Comunidad de ${c.nombre}`,
            url: `https://edvanta.co${c.ruta}`,
          })),
        },
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
              Comunidades Edvanta
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-deep sm:text-[3rem]">
              Una comunidad para cada enfermedad
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-edvanta-muted">
              Espacios de acompañamiento para pacientes y cuidadores. Educación clara, experiencias y preguntas,
              con el WhatsApp de Karla como puerta de entrada. No son consultorios ni servicios de urgencias.
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMUNIDADES.map((c) => (
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
                  <Link to={c.ruta} className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                    Ver la comunidad
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
                ['2. Entras al espacio', 'La comunidad se organiza por enfermedad. No hay ventas dentro del grupo.'],
                ['3. Sigues con contenido', 'Artículos revisados, herramientas interactivas y cursos gratuitos cuando quieras profundizar.'],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <p className="font-display text-base font-bold text-edvanta-deep">{t}</p>
                  <p className="mt-2 text-sm leading-6 text-edvanta-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">La información no alcanza; el acompañamiento ayuda</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-edvanta-muted">
            Si no sabes cuál elegir, escríbenos y te orientamos. La comunidad es gratuita y no reemplaza tu tratamiento.
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

/**
 * Documentos legales de la plataforma (privacidad, términos, reembolsos…).
 * Son de Edvanta, que opera también Feliz Sin Tiroides y AtenFarmaClinic,
 * así que van con el encabezado y el diseño de Edvanta.
 */
import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb, LandingHero } from '../components/edvanta/ui';
import { FOOTER_LEGAL } from '../config/navEdvanta';
import { legalDocs } from '../data/legal';
import { updatePageSeo } from '../utils/seo';

export default function LegalPage({ doc }) {
  const data = legalDocs[doc];

  useEffect(() => { window.scrollTo(0, 0); }, [doc]);

  useEffect(() => {
    if (!data) return;
    updatePageSeo({
      title: `${data.title} | Edvanta`,
      description: data.sections[0]?.p?.substring(0, 155) || data.title,
      canonical: `https://edvanta.co/${doc}`,
    });
  }, [data, doc]);

  if (!data) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <LandingHero
        breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Información legal' }]} className="mb-6" />}
        eyebrow="Información legal"
        title={data.title}
        lead={data.updated}
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
          <div className="ed-prose max-w-[46rem]">
            {data.sections.map((s) => (
              <div key={s.h}>
                <h2>{s.h}</h2>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
          <aside className="mt-12 lg:mt-0">
            <nav aria-label="Otros documentos" className="lg:sticky lg:top-36">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[.14em] text-edvanta-muted">Otros documentos</p>
              <ul className="space-y-1 border-l border-edvanta-border">
                {FOOTER_LEGAL.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      aria-current={l.to === `/${doc}` ? 'page' : undefined}
                      className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm ${l.to === `/${doc}` ? 'border-edvanta-teal font-semibold text-edvanta-blue' : 'border-transparent text-edvanta-muted hover:text-edvanta-blue'}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

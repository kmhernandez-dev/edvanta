import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Section, SectionHeading } from '../../components/edvanta/ui';
import { AUTORA_PERFIL, PAGINAS_EEAT } from '../../data/edvanta/eeat';
import { updatePageSeo } from '../../utils/seo';

const URL_AUTORA = 'https://edvanta.co/autores/karla-hernandez';

export default function PaginaEditorial({ slug }) {
  const pagina = PAGINAS_EEAT.find((p) => p.slug === slug);

  useEffect(() => {
    if (!pagina) return;
    const canonical = `https://edvanta.co/${pagina.slug}`;
    updatePageSeo({
      title: pagina.title,
      description: pagina.description,
      canonical,
      type: 'article',
      robots: 'index,follow',
      jsonLdId: `eeat-${pagina.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': canonical,
            url: canonical,
            name: pagina.h1,
            description: pagina.description,
            inLanguage: 'es-CO',
            dateModified: pagina.actualizado,
            isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: 'https://edvanta.co/' },
            publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co/' },
            ...(pagina.slug === 'politica-de-revision-clinica'
              ? {
                  reviewedBy: {
                    '@type': 'Person',
                    name: AUTORA_PERFIL.nombre,
                    url: URL_AUTORA,
                    sameAs: AUTORA_PERFIL.linkedin,
                  },
                }
              : {}),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
              { '@type': 'ListItem', position: 2, name: 'Transparencia', item: 'https://edvanta.co/politica-editorial' },
              { '@type': 'ListItem', position: 3, name: pagina.h1, item: canonical },
            ],
          },
        ],
      },
    });
  }, [pagina]);

  if (!pagina) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
          <h1 className="font-display text-3xl font-extrabold text-edvanta-deep">No encontramos esta página</h1>
          <p className="mt-3 text-edvanta-muted">Puede que la dirección haya cambiado.</p>
          <Btn to="/" className="mt-6" iconRight={ArrowRight}>Volver al inicio</Btn>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const otras = PAGINAS_EEAT.filter((p) => p.slug !== pagina.slug);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { label: 'Inicio', to: '/' },
                { label: 'Transparencia', to: '/politica-editorial' },
                { label: pagina.h1 },
              ]}
              className="mb-8"
            />
            <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-teal">{pagina.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl font-extrabold leading-tight text-edvanta-deep sm:text-5xl">
              {pagina.h1}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-edvanta-muted">{pagina.lead}</p>
            <p className="mt-5 text-sm text-edvanta-subtle">Última actualización: {pagina.actualizado}</p>
          </div>
        </section>

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <article className="max-w-3xl">
              {pagina.secciones.map((s) => (
                <section key={s.h} className="border-t border-edvanta-border py-7 first:border-t-0 first:pt-0">
                  <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">{s.h}</h2>
                  <p className="mt-3 text-base leading-8 text-edvanta-muted">{s.p}</p>
                  {s.lista && (
                    <ul className="mt-4 space-y-2.5 text-sm leading-7 text-edvanta-muted">
                      {s.lista.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
                <p className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  Educación, no atención clínica individual
                </p>
                <p className="mt-2">
                  Este contenido es educativo y no reemplaza la consulta, el diagnóstico ni el tratamiento de un profesional de salud.
                </p>
              </div>
            </article>

            <aside className="space-y-5">
              <div className="ds-card p-6">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">En esta sección</p>
                <ul className="mt-4 space-y-3">
                  {otras.map((p) => (
                    <li key={p.slug}>
                      <Link to={`/${p.slug}`} className="flex items-start gap-2 text-sm font-semibold text-edvanta-blue hover:underline">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        {p.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ds-card p-6">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">Autora y revisora</p>
                <p className="mt-3 font-display text-xl font-bold text-edvanta-deep">{AUTORA_PERFIL.nombre}</p>
                <p className="mt-1 text-sm text-edvanta-muted">{AUTORA_PERFIL.profesion}</p>
                <p className="text-sm text-edvanta-muted">{AUTORA_PERFIL.universidad}</p>
                <Btn to="/autores/karla-hernandez" variant="secondary" className="mt-4" iconRight={ArrowRight}>Ver perfil</Btn>
              </div>
              <div className="ds-card p-6">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">Correcciones</p>
                <p className="mt-3 text-sm leading-6 text-edvanta-muted">
                  Si encuentras un error, envíanos la URL, la afirmación y la fuente que la contradice.
                </p>
                <Btn to="/contacto" variant="ghost" className="mt-3">Escribir a Edvanta</Btn>
              </div>
            </aside>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

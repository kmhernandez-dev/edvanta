import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, BookOpen, ExternalLink, GraduationCap, HeartPulse, MapPin, ShieldCheck,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Section, SectionHeading } from '../../components/edvanta/ui';
import { articulos } from '../../data/articulos';
import { AUTORA_PERFIL, PAGINAS_EEAT } from '../../data/edvanta/eeat';
import { updatePageSeo } from '../../utils/seo';

const URL_AUTORA = 'https://edvanta.co/autores/karla-hernandez';

const publicacionesDeKarla = articulos
  .filter((a) => (a.autor || '').toLowerCase().includes('karla') || (a.marca === 'fst' && !a.autor))
  .sort((a, b) => String(b.updated || b.date).localeCompare(String(a.updated || a.date)))
  .slice(0, 12);

export default function AutorPage() {
  useEffect(() => updatePageSeo({
    title: 'Karla Melissa Hernández Salcedo | Autora y revisora clínica | Edvanta',
    description: 'Perfil de Karla Melissa Hernández Salcedo, química farmacéutica clínica de la Universidad del Atlántico, autora y revisora clínica de Edvanta.',
    canonical: URL_AUTORA,
    image: 'https://edvanta.co/img/karla-real.jpg',
    imageAlt: 'Retrato profesional de Karla Melissa Hernández Salcedo',
    type: 'profile',
    robots: 'index,follow',
    jsonLdId: 'autora',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          '@id': URL_AUTORA,
          url: URL_AUTORA,
          name: 'Karla Melissa Hernández Salcedo | Autora y revisora clínica',
          description: 'Perfil de Karla Melissa Hernández Salcedo, química farmacéutica clínica y revisora de Edvanta.',
          inLanguage: 'es-CO',
          dateModified: AUTORA_PERFIL.actualizado,
          mainEntity: { '@id': `${URL_AUTORA}#person` },
          isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: 'https://edvanta.co/' },
          publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co/' },
        },
        {
          '@type': 'Person',
          '@id': `${URL_AUTORA}#person`,
          name: AUTORA_PERFIL.nombre,
          alternateName: AUTORA_PERFIL.nombreCorto,
          jobTitle: AUTORA_PERFIL.profesion,
          url: URL_AUTORA,
          image: 'https://edvanta.co/img/karla-real.jpg',
          sameAs: [AUTORA_PERFIL.linkedin],
          alumniOf: { '@type': 'CollegeOrUniversity', name: AUTORA_PERFIL.universidad },
          worksFor: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co/' },
          knowsAbout: AUTORA_PERFIL.areas,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Sobre Edvanta', item: 'https://edvanta.co/sobre-edvanta' },
            { '@type': 'ListItem', position: 3, name: AUTORA_PERFIL.nombre, item: URL_AUTORA },
          ],
        },
      ],
    },
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { label: 'Inicio', to: '/' },
                { label: 'Sobre Edvanta', to: '/sobre-edvanta' },
                { label: AUTORA_PERFIL.nombreCorto },
              ]}
              className="mb-8"
            />
            <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-center">
              <div className="ds-photo mx-auto aspect-[4/5] w-64 lg:w-full">
                <img
                  src="/img/karla-real.jpg"
                  alt="Retrato profesional de Karla Melissa Hernández Salcedo"
                  width="800"
                  height="1000"
                  loading="eager"
                  className="object-top"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-teal">Autora y revisora clínica</p>
                <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-edvanta-deep sm:text-5xl">
                  {AUTORA_PERFIL.nombre}
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-edvanta-muted">{AUTORA_PERFIL.resumen}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-edvanta-deep">
                  <span className="inline-flex items-center gap-2 rounded-full border border-edvanta-border bg-white px-3 py-1.5">
                    <GraduationCap className="h-4 w-4 text-edvanta-blue" aria-hidden="true" />
                    {AUTORA_PERFIL.profesion}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-edvanta-border bg-white px-3 py-1.5">
                    <BadgeCheck className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />
                    {AUTORA_PERFIL.universidad}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-edvanta-border bg-white px-3 py-1.5">
                    <MapPin className="h-4 w-4 text-edvanta-muted" aria-hidden="true" />
                    {AUTORA_PERFIL.ciudad}
                  </span>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Btn href={AUTORA_PERFIL.linkedin} external iconRight={ExternalLink} variant="secondary">LinkedIn</Btn>
                  <Btn to="/contacto" iconRight={ArrowRight}>Contacto profesional</Btn>
                  <Btn to="/politica-de-revision-clinica" variant="ghost">Cómo se revisa</Btn>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div>
              <SectionHeading eyebrow="Trayectoria" title="Qué hace en Edvanta" />
              {AUTORA_PERFIL.bio.map((p) => (
                <p key={p} className="mt-4 max-w-3xl text-base leading-8 text-edvanta-muted">{p}</p>
              ))}
              <div className="mt-8 rounded-[16px] border border-edvanta-border bg-edvanta-bg p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-edvanta-deep">
                  <ShieldCheck className="h-5 w-5 text-edvanta-teal" aria-hidden="true" />
                  Declaración de conflicto de interés
                </p>
                <p className="mt-2 text-sm leading-7 text-edvanta-muted">{AUTORA_PERFIL.conflicto}</p>
              </div>
            </div>
            <aside className="space-y-6">
              <div className="ds-card p-6">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">Áreas de trabajo</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-edvanta-muted">
                  {AUTORA_PERFIL.areas.map((area) => (
                    <li key={area} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ds-card p-6">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">Criterios de revisión</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-edvanta-muted">
                  {AUTORA_PERFIL.criterios.map((criterio) => (
                    <li key={criterio} className="flex gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-teal" aria-hidden="true" />
                      {criterio}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Section>

        <Section tone="lavender" bordered>
          <SectionHeading
            eyebrow="Publicaciones"
            title="Contenido firmado por Karla"
            desc="Una selección de artículos y recursos. Las páginas de salud se indexan solo después de la revisión clínica."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publicacionesDeKarla.map((a) => (
              <Link key={a.slug} to={`/articulos/${a.slug}`} className="ds-card ds-card--interactive p-5">
                <p className="text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{a.category}</p>
                <p className="mt-2 font-display text-lg font-bold leading-snug text-edvanta-deep">{a.title}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-edvanta-muted">{a.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-edvanta-blue">
                  Leer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Btn to="/articulos" variant="secondary" iconRight={ArrowRight}>Ver todos los artículos</Btn>
          </div>
        </Section>

        <Section tone="white">
          <SectionHeading
            eyebrow="Transparencia"
            title="Cómo se produce y se revisa el contenido"
            desc="La autoría y la revisión no son un sello decorativo: tienen criterios, fuentes y fecha."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PAGINAS_EEAT.map((p) => (
              <Link key={p.slug} to={`/${p.slug}`} className="ds-card ds-card--interactive p-5">
                <p className="flex items-center gap-2 font-bold text-edvanta-deep">
                  <BookOpen className="h-4 w-4 text-edvanta-blue" aria-hidden="true" />
                  {p.h1}
                </p>
                <p className="mt-2 text-sm leading-6 text-edvanta-muted">{p.lead}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 rounded-[16px] border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            <p className="flex items-center gap-2 font-bold">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
              Educación, no atención clínica individual
            </p>
            <p className="mt-2">
              La información de Edvanta ayuda a entender y a preparar una consulta. No reemplaza el diagnóstico, el tratamiento ni el seguimiento de tu equipo de salud.
            </p>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

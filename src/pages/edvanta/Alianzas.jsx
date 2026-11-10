/**
 * ============================================================
 *  Alianzas.jsx — /alianzas
 *
 *  Para facultades, semilleros, oficinas de egresados, colegios
 *  profesionales y fundaciones de pacientes: qué ofrece Edvanta hoy y
 *  cómo empezar una alianza. Es la página a la que apuntan las
 *  propuestas que se envían a universidades y gremios.
 *
 *  No menciona alianzas firmadas: no hay ninguna documentada. Los textos
 *  viven en data/edvanta/paginasInstitucionales.js (el HTML para
 *  buscadores dice lo mismo).
 * ============================================================
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Mail, MessageCircle, Users } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Section, SectionHeading } from '../../components/edvanta/ui';
import { HeroCientifico } from '../../components/edvanta/heroes';
import { EDVANTA_EMAIL, EDVANTA_WHATSAPP_URL, waLink } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';
import { ALIANZAS } from '../../data/edvanta/paginasInstitucionales';

export default function Alianzas() {
  useEffect(() => updatePageSeo({
    title: ALIANZAS.seoTitle,
    description: ALIANZAS.seoDescription,
    canonical: 'https://edvanta.co/alianzas',
  }), []);

  const asunto = encodeURIComponent('Alianza con Edvanta');

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroCientifico
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Sobre Edvanta', to: '/sobre-edvanta' }, { label: 'Alianzas' }]} className="mb-8" />}
          eyebrow="Alianzas"
          title={ALIANZAS.titulo}
          highlight="académicas y gremiales"
          lead={ALIANZAS.lead}
          image="/img/publicos/profesionales.webp"
          imageAlt="Equipo de salud revisando juntos un caso en una tableta"
          badges={[
            { icon: GraduationCap, label: 'Facultades' },
            { icon: Users, label: 'Gremios' },
            { icon: BookOpen, label: 'Cursos gratuitos' },
          ]}
          actions={(
            <>
              <Btn href={`mailto:${EDVANTA_EMAIL}?subject=${asunto}`} size="lg" icon={Mail}>Proponer una alianza</Btn>
              <Btn href="#disponible" variant="secondary" size="lg">Ver qué ofrecemos</Btn>
            </>
          )}
        />

        <Section tone="white">
          <SectionHeading eyebrow="Para quién" title="Organizaciones que forman o acompañan" />
          <ul className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {ALIANZAS.paraQuien.map((p) => (
              <li key={p} className="flex gap-3 text-[15px] leading-7 text-edvanta-muted">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />{p}
              </li>
            ))}
          </ul>
        </Section>

        <Section tone="lavender" bordered id="disponible">
          <SectionHeading eyebrow="Disponible hoy" title="Lo que su comunidad puede usar desde ya" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {ALIANZAS.disponible.map((r) => (
              <Link key={r.to} to={r.to} className="group ds-card ds-card--interactive bg-white p-5">
                <span className="block font-bold text-edvanta-deep group-hover:text-edvanta-blue">{r.titulo}</span>
                <span className="mt-1 block text-sm leading-6 text-edvanta-muted">{r.desc}</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section tone="white">
          <SectionHeading eyebrow="Formas de colaborar" title="Lo que podemos construir juntos" />
          <ol className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {ALIANZAS.formas.map((f, i) => (
              <li key={f.t} className="flex gap-5 border-t border-edvanta-border pt-6">
                <span className="ed-grad-text font-display text-4xl font-extrabold leading-none">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-lg font-bold text-edvanta-deep">{f.t}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-edvanta-muted">{f.d}</p>
                  {f.to && <Link to={f.to} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-edvanta-blue">Ver más<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl rounded-[14px] border border-edvanta-border bg-edvanta-bg p-5 text-sm leading-6 text-edvanta-muted">{ALIANZAS.condiciones}</p>
        </Section>

        <Section tone="base" bordered>
          <SectionHeading eyebrow="Cómo empezar" title="Escríbenos" />
          <p className="mt-6 max-w-3xl text-base leading-7 text-edvanta-muted">{ALIANZAS.comoEmpezar}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href={`mailto:${EDVANTA_EMAIL}?subject=${asunto}`} icon={Mail}>{EDVANTA_EMAIL}</Btn>
            <Btn href={waLink('Hola, equipo Edvanta. Quiero conversar sobre una alianza para mi institución.') || EDVANTA_WHATSAPP_URL} external variant="secondary" icon={MessageCircle}>WhatsApp</Btn>
            <Btn to="/prensa" variant="ghost" iconRight={ArrowRight}>Prensa y citas</Btn>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

/**
 * ============================================================
 *  Prensa.jsx — /prensa
 *
 *  Para periodistas, docentes, estudiantes y organizaciones que quieren
 *  citar o enlazar a Edvanta: qué es, qué recursos se pueden citar, cómo
 *  enlazarlos, logos y a quién escribir.
 *
 *  Solo datos comprobables en el propio sitio: nada de cifras de alumnos,
 *  premios ni apariciones en medios. Los textos viven en
 *  data/edvanta/paginasInstitucionales.js (el HTML para buscadores dice
 *  lo mismo).
 * ============================================================
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Mail, MessageCircle, Newspaper, Quote, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Section, SectionHeading } from '../../components/edvanta/ui';
import { HeroCientifico } from '../../components/edvanta/heroes';
import { AUTORA_PERFIL } from '../../data/edvanta/eeat';
import { EDVANTA_EMAIL, EDVANTA_WHATSAPP_URL } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';
import { PRENSA } from '../../data/edvanta/paginasInstitucionales';

export default function Prensa() {
  useEffect(() => updatePageSeo({
    title: PRENSA.seoTitle,
    description: PRENSA.seoDescription,
    canonical: 'https://edvanta.co/prensa',
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroCientifico
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Sobre Edvanta', to: '/sobre-edvanta' }, { label: 'Prensa y citas' }]} className="mb-8" />}
          eyebrow="Prensa"
          title={PRENSA.titulo}
          highlight="citas"
          lead={PRENSA.lead}
          image="/img/comunidad/encuentro-comunidad-farmaceutica.webp"
          imageAlt="Grupo de químicos farmacéuticos reunidos alrededor de una mesa, conversando sobre una tableta"
          imagePosition="center"
          badges={[
            { icon: Newspaper, label: 'Noticias con fuente oficial' },
            { icon: ShieldCheck, label: 'Revisión clínica' },
            { icon: Quote, label: 'Citas listas' },
          ]}
          actions={(
            <>
              <Btn href={`mailto:${EDVANTA_EMAIL}`} size="lg" icon={Mail}>Escribir a prensa</Btn>
              <Btn href="#como-citar" variant="secondary" size="lg">Cómo citarnos</Btn>
            </>
          )}
        />

        <Section tone="white">
          <SectionHeading eyebrow="En pocas palabras" title="Qué es Edvanta" />
          <p className="mt-6 max-w-3xl text-base leading-7 text-edvanta-muted">{PRENSA.descripcionCorta}</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PRENSA.recursos.map((r) => (
              <Link key={r.to} to={r.to} className="group ds-card ds-card--interactive p-5">
                <span className="block font-bold text-edvanta-deep group-hover:text-edvanta-blue">{r.titulo}</span>
                <span className="mt-1 block text-sm leading-6 text-edvanta-muted">{r.desc}</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section tone="lavender" bordered>
          <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
            <div className="ds-photo mx-auto aspect-[4/5] w-60 lg:w-full">
              <img src="/img/karla-real.jpg" alt={AUTORA_PERFIL.nombre} width="800" height="1000" loading="lazy" className="object-top" />
            </div>
            <div>
              <SectionHeading eyebrow="Vocera y autora" title={AUTORA_PERFIL.nombre} desc={`${AUTORA_PERFIL.profesion}, ${AUTORA_PERFIL.universidad}. ${AUTORA_PERFIL.ciudad}.`} />
              <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">{PRENSA.vocera}</p>
              <p className="mt-6 text-sm font-bold text-edvanta-deep">Temas en los que podemos aportar contexto</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {AUTORA_PERFIL.areas.map((a) => (
                  <li key={a} className="flex gap-2 text-sm leading-6 text-edvanta-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />{a}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn to="/autores/karla-hernandez" iconRight={ArrowRight}>Ver perfil y criterios de revisión</Btn>
              </div>
            </div>
          </div>
        </Section>

        <Section tone="white" id="como-citar">
          <SectionHeading eyebrow="Para citar y enlazar" title="Cómo citarnos" />
          <ol className="mt-8 grid max-w-3xl gap-4">
            {PRENSA.comoCitar.map((t, i) => (
              <li key={t} className="flex gap-4 border-t border-edvanta-border pt-4 text-[15px] leading-7 text-edvanta-muted">
                <span className="ed-grad-text font-display text-2xl font-extrabold leading-none">{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>

          <h3 className="mt-12 text-lg font-bold text-edvanta-deep">Logos</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-edvanta-muted">{PRENSA.usoLogo}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PRENSA.logos.map((l) => (
              <div key={l.src} className="ds-card flex flex-col gap-4 p-5">
                <div className="flex h-28 items-center justify-center rounded-[12px] bg-edvanta-bg p-4">
                  <img src={l.src} alt={l.titulo} className="max-h-20 w-auto" loading="lazy" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    <span className="block text-sm font-bold text-edvanta-deep">{l.titulo}</span>
                    <span className="block text-xs text-edvanta-muted">{l.medidas}</span>
                  </span>
                  <Btn href={l.src} download variant="secondary" size="sm" icon={Download}>Descargar</Btn>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section tone="base" bordered>
          <SectionHeading eyebrow="Contacto" title="Entrevistas, datos y correcciones" />
          <p className="mt-6 max-w-3xl text-base leading-7 text-edvanta-muted">{PRENSA.consultas}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href={`mailto:${EDVANTA_EMAIL}`} icon={Mail}>{EDVANTA_EMAIL}</Btn>
            <Btn href={EDVANTA_WHATSAPP_URL} external variant="secondary" icon={MessageCircle}>WhatsApp</Btn>
            <Btn to="/alianzas" variant="ghost" iconRight={ArrowRight}>Alianzas académicas y gremiales</Btn>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

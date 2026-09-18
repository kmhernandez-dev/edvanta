/**
 * ============================================================
 *  /herramientas — Centro de herramientas
 *
 *  Reparte hacia la landing de cada herramienta. Las que ya tienen
 *  página propia (hoja de vida, correos, vitrina de talento) se
 *  enlazan directamente para no duplicar la herramienta.
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BriefcaseBusiness, Building2, ClipboardList, Compass, FileText, Mail,
  MonitorPlay, Rocket, ScanSearch, Share2, Sparkles, Wrench,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import {
  ArrowLink, Btn, Card, CtaBanner, ImageSlot, LandingHero, Section, SectionHeading,
} from '../components/edvanta/ui';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { clasificacionHerramientas } from '../data/careerHub';
import { HERRAMIENTAS } from '../data/edvanta/herramientas';
import { useProfessional } from '../context/ProfessionalContext';

const TOOL_ICONS = {
  file: FileText, scan: ScanSearch, mail: Mail, briefcase: BriefcaseBusiness,
  compass: Compass, linkedin: Share2, clipboard: ClipboardList, rocket: Rocket, building: Building2,
};

const resourceTypeLabels = {
  article: 'Artículo',
  guide: 'Guía',
  template: 'Plantilla',
  tool: 'Herramienta',
  regulation: 'Regulación',
  research: 'Investigación',
  case_study: 'Caso',
};

/** Las tres que se usan más, con su propia página y su herramienta dentro. */
const DESTACADAS = [
  { to: '/hoja-de-vida', icon: FileText, title: 'Hoja de vida ATS + IA', desc: 'Créala, mide su puntaje y descárgala en PDF legible por los filtros automáticos.' },
  { to: '/empleo/correos', icon: Mail, title: 'Correos a recursos humanos', desc: 'Cinco plantillas que se completan con tus datos y se copian de un clic.' },
  { to: '/talento', icon: Sparkles, title: 'Vitrina de talento', desc: 'Publica tus logros para que las empresas del sector te contacten.' },
];

export default function HerramientasPage() {
  const { savedResources } = useProfessional();
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => updatePageSeo({
    title: 'Herramientas profesionales farmacéuticas | Edvanta',
    description: 'Guías, plantillas y herramientas clasificadas por tema: carrera, empleo, marca personal, emprendimiento y talento. Cada una con su propia página.',
    canonical: 'https://edvanta.co/herramientas',
    jsonLdId: 'herramientas',
    jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Herramientas profesionales Edvanta', url: 'https://edvanta.co/herramientas' },
  }), []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl('/api/resources'), { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((payload) => setRecursos(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setRecursos([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <LandingHero
          eyebrow="Centro de herramientas"
          title="Herramientas para construir tu carrera farmacéutica"
          lead="Cada herramienta tiene su propia página: entra, entiende qué resuelve y empieza. Carrera, empleo, marca personal, emprendimiento y talento."
          actions={(
            <>
              <Btn to="/hoja-de-vida" icon={FileText}>Crear mi hoja de vida</Btn>
              <Btn to="/aula" variant="secondary" icon={MonitorPlay}>Entrar al aula virtual</Btn>
            </>
          )}
          media={(
            <ImageSlot
              ratio="photo"
              priority
              label="Herramientas Edvanta en pantalla"
              hint="Montaje de dos o tres herramientas abiertas. 1200 × 900 px."
            />
          )}
        />

        {/* Las más usadas */}
        <Section>
          <SectionHeading
            eyebrow="Las más usadas"
            title="Empieza por una de estas tres"
            desc="Son las que resuelven los pasos más frecuentes: presentarte, escribir y hacerte visible."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {DESTACADAS.map((d) => (
              <Card key={d.to} hover className="flex flex-col">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue">
                  <d.icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <p className="mt-4 text-base font-bold text-edvanta-deep">{d.title}</p>
                <p className="mt-1.5 flex-1 text-sm leading-6 text-edvanta-muted">{d.desc}</p>
                <ArrowLink to={d.to} className="mt-4">Abrir</ArrowLink>
              </Card>
            ))}
          </div>
        </Section>

        {/* Todas las herramientas con landing propia */}
        <Section tone="surface" bordered>
          <SectionHeading eyebrow="Herramientas Edvanta" title="Elige una herramienta y empieza" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HERRAMIENTAS.map((t) => {
              const TIcon = TOOL_ICONS[t.icon] || Wrench;
              return (
                <Link
                  key={t.slug}
                  to={`/herramientas/${t.slug}`}
                  className="group flex flex-col rounded-2xl border border-edvanta-border bg-white p-5 shadow-[0_1px_2px_rgba(23,34,59,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_12px_36px_rgba(23,34,59,.12)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue transition group-hover:bg-edvanta-blue group-hover:text-white">
                    <TIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-edvanta-deep group-hover:text-edvanta-blue">{t.nav}</h3>
                  <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-6 text-edvanta-muted">{t.tagline}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-edvanta-blue">
                    Ver herramienta
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Section>

        {/* Clasificación por tema */}
        <Section>
          <SectionHeading eyebrow="Por tema" title="Todas las herramientas y guías" />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clasificacionHerramientas.map((grupo) => (
              <Card key={grupo.categoria}>
                <p className="text-[11px] font-bold uppercase tracking-[.14em] text-edvanta-tealdark">{grupo.categoria}</p>
                <div className="mt-4 space-y-3">
                  {grupo.items.map((item) => (
                    <Link
                      key={item.nombre}
                      to={item.to}
                      className="group block rounded-xl border border-edvanta-border bg-edvanta-bg p-4 transition hover:border-edvanta-blue/40 hover:bg-edvanta-light/40"
                    >
                      <p className="text-sm font-bold text-edvanta-deep group-hover:text-edvanta-blue">{item.nombre}</p>
                      <p className="mt-1 text-xs leading-5 text-edvanta-muted">{item.descripcion}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-edvanta-blue">
                        Abrir <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Selección editorial (API) */}
        {(loading || recursos.length > 0) && (
          <Section tone="surface" bordered>
            <SectionHeading
              eyebrow="Selección editorial"
              title="Recursos verificados del sector"
              desc="Guías, normativas y casos revisados por el equipo antes de publicarse."
            />
            {loading ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Cargando recursos">
                {[0, 1, 2].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl border border-edvanta-border bg-edvanta-bg" />)}
              </div>
            ) : (
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {recursos.slice(0, 12).map((resource) => {
                  const resourceId = String(resource.id || resource.slug);
                  const isSaved = savedResources.some((item) => item.resource_id === resourceId);
                  return (
                    <Card key={resourceId} className="flex min-h-48 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-edvanta-tealdark">
                          {resourceTypeLabels[resource.resource_type] || resource.resource_type || 'Recurso'}
                        </p>
                        {isSaved && <span className="rounded-full bg-edvanta-mint px-2 py-0.5 text-[10px] font-bold text-edvanta-tealdark">Guardado</span>}
                      </div>
                      <h3 className="mt-2 text-base font-bold text-edvanta-deep">{resource.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{resource.excerpt}</p>
                      {resource.source_url && (
                        <ArrowLink href={resource.source_url} external className="mt-3">Abrir recurso</ArrowLink>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </Section>
        )}

        <CtaBanner
          eyebrow="¿Eres una empresa?"
          title="Las mismas herramientas, para todo tu equipo"
          desc="Capacitación en un aula virtual propia, con tus videos y tus diapositivas, y directorio de talento farmacéutico."
          actions={(
            <>
              <Btn to="/empresas/capacitacion" variant="white" icon={Building2}>Ver capacitación empresarial</Btn>
              <Btn to="/empresas/talento" variant="outlineWhite">Buscar talento</Btn>
            </>
          )}
        />
      </main>
      <SiteFooter />
    </>
  );
}

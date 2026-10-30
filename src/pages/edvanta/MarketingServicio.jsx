/**
 * ============================================================
 *  MarketingServicio.jsx — /empresas/marketing/:servicio
 *
 *  Landing de una solución concreta. Explica la necesidad, el alcance,
 *  el proceso de ese servicio y lo que necesita la empresa para definir
 *  una propuesta. El formulario llega con el servicio preseleccionado.
 * ============================================================
 */

import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Building2, CheckCircle2, MessagesSquare } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card, Faq } from '../../components/edvanta/ui';
import {
  EjemploEntregable, MarketingEyebrow, MarketingSection, ProcesoMarketing,
} from '../../components/edvanta/marketing';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { SERVICIOS_MARKETING, servicioMarketingPorSlug } from '../../data/edvanta/marketing';
import { paquetePorSlug, paqueteTo } from '../../data/edvanta/servicios';
import { updatePageSeo } from '../../utils/seo';
import NotFound from '../NotFound';

export default function MarketingServicio() {
  const { servicio: slug } = useParams();
  const servicio = servicioMarketingPorSlug(slug);
  const relacionados = SERVICIOS_MARKETING.filter((s) => s.slug !== slug).slice(0, 3);
  const paquete = servicio?.paqueteRelacionado ? paquetePorSlug(servicio.paqueteRelacionado) : null;

  useEffect(() => {
    if (!servicio) return;
    updatePageSeo({
      title: `${servicio.nombre} para empresas | Edvanta`,
      description: servicio.necesidad,
      canonical: `https://edvanta.co/empresas/marketing/${servicio.slug}`,
      image: 'https://edvanta.co/img/escuelas/marketing.webp',
      keywords: [servicio.nombre, 'marketing farmacéutico', 'servicios para empresas', 'Edvanta'],
      jsonLdId: `marketing-servicio-${servicio.slug}`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: servicio.nombre,
          description: servicio.necesidad,
          serviceType: servicio.nombre,
          url: `https://edvanta.co/empresas/marketing/${servicio.slug}`,
          provider: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Instituciones', item: 'https://edvanta.co/instituciones' },
            { '@type': 'ListItem', position: 3, name: 'Marketing y comunicación', item: 'https://edvanta.co/empresas/marketing' },
            { '@type': 'ListItem', position: 4, name: servicio.nombre, item: `https://edvanta.co/empresas/marketing/${servicio.slug}` },
          ],
        },
      ],
    });
  }, [servicio]);

  if (!servicio) return <NotFound />;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-edvanta-border bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
            <Breadcrumb
              items={[
                { label: 'Inicio', to: '/' },
                { label: 'Instituciones', to: '/instituciones' },
                { label: 'Marketing y comunicación', to: '/empresas/marketing' },
                { label: servicio.nombre },
              ]}
              className="mb-8"
            />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
              <div>
                <MarketingEyebrow>Servicio para empresas · bajo propuesta</MarketingEyebrow>
                <h1 className="mt-4 font-display text-[2.05rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.6rem] lg:text-[3rem]">
                  {servicio.nombre}
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-edvanta-muted">{servicio.necesidad}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Btn href="#solicitar-propuesta" size="lg" iconRight={ArrowRight}>Solicitar propuesta</Btn>
                  <Btn to="/empresas/marketing" variant="secondary" size="lg" icon={Building2}>
                    Ver todos los servicios
                  </Btn>
                </div>
                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-edvanta-subtle">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                  Alcance y propuesta según necesidades.
                </p>
              </div>
              <EjemploEntregable
                ejemplo={{
                  titulo: servicio.entregables[0],
                  desc: 'Una muestra de estructura. El contenido y el alcance se definen con tu organización.',
                  variante: servicio.ejemplo,
                }}
              />
            </div>
          </div>
        </header>

        <MarketingSection tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <div>
              <MarketingEyebrow>Por qué importa</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">
                La necesidad que atiende
              </h2>
              <p className="mt-4 text-base leading-8 text-edvanta-muted">{servicio.necesidad}</p>
              <div className="mt-6 rounded-2xl border border-edvanta-border bg-[#F8FAFD] p-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-edvanta-tealdark">Cómo se trabaja</p>
                <p className="mt-2 text-sm leading-7 text-edvanta-deep">
                  No empezamos por una plantilla. Primero entendemos el objetivo, el público y las fuentes disponibles; después proponemos el alcance y las piezas.
                </p>
              </div>
            </div>
            <Card>
              <h2 className="font-display text-xl font-extrabold text-edvanta-deep">A quién está dirigido</h2>
              <p className="mt-3 text-sm leading-7 text-edvanta-muted">{servicio.publico}</p>
              <h3 className="mt-6 text-sm font-bold text-edvanta-deep">Qué información ayuda a definir el alcance</h3>
              <ul className="mt-3 space-y-2.5">
                {servicio.informacion.slice(0, 3).map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </MarketingSection>

        <MarketingSection tone="lavender">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-start">
            <div>
              <MarketingEyebrow>Alcance</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">
                Entregables que se pueden incluir
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
                El alcance se confirma en la propuesta. No todos los entregables aplican a todos los proyectos.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {servicio.entregables.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 rounded-xl bg-white/80 px-4 py-3.5 text-sm leading-6 text-edvanta-deep">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="bg-white">
              <h2 className="font-display text-xl font-extrabold text-edvanta-deep">Qué necesitamos de tu equipo</h2>
              <p className="mt-2 text-sm leading-6 text-edvanta-muted">
                Con esta información podemos preparar una propuesta útil y evitar suposiciones.
              </p>
              <ul className="mt-4 space-y-2.5">
                {servicio.informacion.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-violet" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
              {paquete && (
                <Btn to={paqueteTo(paquete.slug)} variant="secondary" size="sm" className="mt-5" iconRight={ArrowRight}>
                  Ver {paquete.nombre}
                </Btn>
              )}
            </Card>
          </div>
        </MarketingSection>

        <MarketingSection tone="white">
          <MarketingEyebrow>Cómo trabajamos este servicio</MarketingEyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">
            Una ruta adaptada al servicio
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
            Estas etapas orientan el trabajo. La revisión científica y de marca se integra cuando corresponde.
          </p>
          <ProcesoMarketing pasos={servicio.proceso} />
        </MarketingSection>

        <MarketingSection tone="mint">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start">
            <div>
              <MarketingEyebrow>Preguntas frecuentes</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">
                Dudas sobre {servicio.nombre.toLowerCase()}
              </h2>
              <Faq items={servicio.faq} className="mt-6" />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/empresas/marketing" className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                  Ver todos los servicios <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link to="/instituciones" className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-tealdark hover:underline">
                  Capacitación para instituciones <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              {relacionados.map((s) => (
                <Link
                  key={s.slug}
                  to={`/empresas/marketing/${s.slug}`}
                  className="group rounded-2xl border border-edvanta-border bg-white p-5 transition hover:border-edvanta-teal/50"
                >
                  <p className="text-sm font-bold text-edvanta-deep">{s.nombre}</p>
                  <p className="mt-1 text-sm leading-6 text-edvanta-muted">{s.resumen}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-edvanta-blue">
                    Conocer el servicio <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </MarketingSection>

        <section id="solicitar-propuesta" className="scroll-mt-28 border-t border-edvanta-border bg-white">
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:px-8 lg:py-16">
            <div>
              <MarketingEyebrow>Solicitar propuesta</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep">
                Hablemos de {servicio.nombre.toLowerCase()}
              </h2>
              <p className="mt-4 text-base leading-7 text-edvanta-muted">
                El servicio ya está seleccionado en el formulario. Puedes cambiarlo si tu necesidad es otra.
              </p>
              <p className="mt-6 rounded-2xl bg-[#F4F0FB] px-5 py-4 text-sm leading-6 text-edvanta-deep">
                Servicio de origen: <strong>{servicio.nombre}</strong>. La solicitud no compromete una compra.
              </p>
              <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-edvanta-muted">
                <MessagesSquare className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                Si prefieres, también podemos conversar por WhatsApp después de recibir tu solicitud.
              </p>
            </div>
            <Card>
              <FormularioSolicitud
                key={servicio.slug}
                tipo="propuesta"
                referencia={servicio.slug}
                paquetes={SERVICIOS_MARKETING.map((s) => ({ slug: s.slug, nombre: s.nombre }))}
                boton="Solicitar propuesta"
                exito="Revisaremos la información y te escribiremos para coordinar la primera conversación."
                resumenWa={`Quiero conversar sobre ${servicio.nombre} para mi organización.`}
              />
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

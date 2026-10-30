/**
 * ContigoReservar.jsx — /contigo/servicios/:slug/reservar
 *
 * La reserva de la consulta propuesta no está habilitada. La página
 * explica el servicio y recoge interés; no simula horarios, pagos ni
 * confirmaciones.
 */

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, CalendarClock, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card } from '../../components/edvanta/ui';
import { ContigoEyebrow, ContigoSection, EstadoContigo } from '../../components/contigo/ContigoPieces';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { servicioContigoPorSlug } from '../../data/edvanta/contigo';
import { updatePageSeo } from '../../utils/seo';
import NotFound from '../NotFound';

export default function ContigoReservar() {
  const { slug } = useParams();
  const servicio = servicioContigoPorSlug(slug);

  useEffect(() => {
    if (!servicio) return;
    updatePageSeo({
      title: `${servicio.nombre} | Reservas en preparación | Edvanta Contigo`,
      description: 'La consulta farmacéutica individual es una propuesta en preparación. No hay agenda ni pagos habilitados todavía.',
      canonical: `https://edvanta.co/contigo/servicios/${servicio.slug}/reservar`,
      robots: 'noindex,follow',
    });
  }, [servicio]);

  if (!servicio) return <NotFound />;

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
            <Breadcrumb
              items={[
                { label: 'Inicio', to: '/' },
                { label: 'Edvanta Contigo', to: '/contigo' },
                { label: 'Profesionales', to: '/contigo/profesionales' },
                { label: servicio.nombre },
              ]}
              className="mb-8"
            />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
              <div>
                <EstadoContigo estado="en_preparacion" />
                <h1 className="mt-4 font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem]">
                  {servicio.nombre}
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-[var(--contigo-muted)]">{servicio.descripcion}</p>
                <div className="mt-6 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span><strong>Reservas no habilitadas.</strong> No hay profesionales verificados ni agenda publicada. {servicio.precio} es un precio de ejemplo, no un cobro activo.</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Btn href="#interes" size="lg" iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                    Quiero recibir novedades
                  </Btn>
                  <Btn to="/contigo/planes" variant="secondary" size="lg">Ver planes</Btn>
                </div>
              </div>
              <Card className="bg-[var(--contigo-mint)]">
                <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-edvanta-deep">
                  <CalendarClock className="h-5 w-5 text-[var(--contigo-primary)]" aria-hidden="true" />
                  Qué incluiría
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {servicio.incluye.map((x) => (
                    <li key={x} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-[var(--contigo-muted)]">No incluye</p>
                <ul className="mt-2 space-y-2">
                  {servicio.noIncluye.map((x) => (
                    <li key={x} className="flex items-start gap-2.5 text-xs leading-5 text-[var(--contigo-muted)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--contigo-muted)]" aria-hidden="true" />
                      {x}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </header>

        <ContigoSection id="interes" tone="sage">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <ContigoEyebrow>Lista de interés</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Avísame cuando haya agenda
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--contigo-muted)]">
                Déjanos tu correo si quieres conocer cuándo se habilite el acompañamiento. No reserva un cupo ni genera un cobro.
              </p>
              <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--contigo-muted)]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                No escribas diagnósticos, medicamentos ni resultados en este formulario público.
              </p>
            </div>
            <Card className="bg-white">
              <FormularioSolicitud
                tipo="interes"
                referencia={servicio.slug}
                roles={['paciente', 'cuidador', 'otro']}
                pacientes
                boton="Quiero recibir novedades"
                exito="Te escribiremos cuando la agenda esté habilitada. No se reservó ningún cupo."
                resumenWa={`Me interesa ${servicio.nombre} de Edvanta Contigo.`}
              />
            </Card>
          </div>
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}

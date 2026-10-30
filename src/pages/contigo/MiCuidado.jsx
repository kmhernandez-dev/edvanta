/**
 * MiCuidado.jsx — /mi-cuidado
 *
 * Puerta al espacio privado. Las herramientas reales viven en
 * Feliz Sin Tiroides; aquí se ordenan y se explica qué está disponible.
 * No duplica historias clínicas ni datos de salud.
 */

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, HeartPulse, Info, LockKeyhole, ShieldCheck, Stethoscope,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card } from '../../components/edvanta/ui';
import {
  ContigoEyebrow, ContigoSection, HerramientaContigoCard,
} from '../../components/contigo/ContigoPieces';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { useAuth } from '../../context/AuthContext';
import { CONTIGO_HERRAMIENTAS } from '../../data/edvanta/contigo';
import { updatePageSeo } from '../../utils/seo';

function PlanEnPreparacion() {
  return (
    <ContigoSection tone="white">
      <div className="contigo-empty">
        <span className="contigo-icon mx-auto"><Stethoscope className="h-5 w-5" aria-hidden="true" /></span>
        <h2>Mi plan todavía no está disponible</h2>
        <p>
          Aquí aparecerán los acuerdos que registre el profesional responsable cuando el acompañamiento esté habilitado. No mostramos planes clínicos de ejemplo ni indicaciones automáticas.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Btn to="/contigo/profesionales" variant="secondary" size="sm" iconRight={ArrowRight}>Conocer la red profesional</Btn>
          <Btn to="/contigo/planes" variant="link" size="sm" iconRight={ArrowRight}>Ver planes propuestos</Btn>
        </div>
      </div>
    </ContigoSection>
  );
}

function SuscripcionEnPreparacion() {
  return (
    <ContigoSection tone="sage">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <ContigoEyebrow>Mi suscripción</ContigoEyebrow>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            La membresía todavía no está habilitada
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--contigo-muted)]">
            No hay cobros, renovaciones ni cancelaciones activas. Puedes dejar tu interés para recibir novedades cuando las condiciones estén revisadas.
          </p>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--contigo-muted)]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
            La comunidad abierta de Feliz Sin Tiroides sigue disponible sin membresía.
          </p>
        </div>
        <Card className="bg-white">
          <FormularioSolicitud
            tipo="interes"
            referencia="contigo-suscripcion"
            roles={['paciente', 'cuidador', 'otro']}
            pacientes
            boton="Recibir novedades"
            exito="Te escribiremos cuando la membresía tenga condiciones revisadas. No se activó ningún cobro."
            resumenWa="Quiero recibir novedades de la membresía de Edvanta Contigo."
          />
        </Card>
      </div>
    </ContigoSection>
  );
}

export default function MiCuidado() {
  const { pathname } = useLocation();
  const { user, profile } = useAuth();
  const esPlan = pathname.endsWith('/plan');
  const esSuscripcion = pathname.endsWith('/suscripcion');

  useEffect(() => {
    updatePageSeo({
      title: 'Mi cuidado | Edvanta Contigo',
      description: 'Tu espacio privado para organizar medicamentos, documentos, citas y preguntas. Las herramientas se abren en Feliz Sin Tiroides.',
      canonical: 'https://edvanta.co/mi-cuidado',
      robots: 'noindex,follow',
    });
  }, []);

  const nombre = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || null;

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo', to: '/contigo' }, { label: 'Mi cuidado' }]} className="mb-8" />
            <ContigoEyebrow>Mi cuidado</ContigoEyebrow>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem] lg:text-[3rem]">
              {nombre ? `Hola, ${nombre}` : 'Tu espacio de cuidado'}
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[var(--contigo-muted)]">
              Un punto de entrada para tus herramientas de salud tiroidea. La información clínica vive en tu espacio privado de Feliz Sin Tiroides, no en la comunidad.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {user ? (
                <Btn to="/fst-app" size="lg" icon={HeartPulse} iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                  Ir a mi espacio de Feliz Sin Tiroides
                </Btn>
              ) : (
                <Btn to="/fst-app" size="lg" icon={LockKeyhole} iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                  Entrar o crear mi cuenta
                </Btn>
              )}
              <Btn to="/contigo/tiroides" variant="secondary" size="lg">Volver a la ruta</Btn>
            </div>
            <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--contigo-muted)]">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
              No diagnostica ni modifica tratamientos. Si tienes una urgencia, acude a un servicio de salud.
            </p>
          </div>
        </header>

        {!user && (
          <ContigoSection tone="sage">
            <div className="flex flex-col gap-4 rounded-[20px] border border-[var(--contigo-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                <div>
                  <p className="font-bold text-edvanta-deep">Puedes mirar el recorrido sin compartir datos</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">
                    Las herramientas privadas piden una cuenta. No necesitas Discord para usarlas.
                  </p>
                </div>
              </div>
              <Btn to="/fst-app" variant="secondary" size="sm">Crear mi espacio</Btn>
            </div>
          </ContigoSection>
        )}

        {esPlan ? <PlanEnPreparacion /> : esSuscripcion ? <SuscripcionEnPreparacion /> : (
          <>
            <ContigoSection tone="white">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <ContigoEyebrow>Ruta actual</ContigoEyebrow>
                  <h2 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep">Salud tiroidea</h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">
                    Las herramientas de esta ruta viven en Feliz Sin Tiroides.
                  </p>
                </div>
                <Btn to="/contigo/tiroides" variant="secondary" size="sm" iconRight={ArrowRight}>Ver la ruta</Btn>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {CONTIGO_HERRAMIENTAS.slice(0, 4).map((h) => <HerramientaContigoCard key={h.id} herramienta={h} />)}
              </div>
            </ContigoSection>

            <ContigoSection tone="sage">
              <div className="grid gap-4 md:grid-cols-2">
                <Link to="/mi-cuidado/plan" className="contigo-card contigo-card--interactive group p-5">
                  <p className="font-display text-lg font-extrabold text-edvanta-deep">Mi plan</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">Los acuerdos del acompañamiento profesional aparecerán aquí cuando el servicio esté habilitado.</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--contigo-primary)]">Ver estado <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </Link>
                <Link to="/mi-cuidado/suscripcion" className="contigo-card contigo-card--interactive group p-5">
                  <p className="font-display text-lg font-extrabold text-edvanta-deep">Mi suscripción</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">Contigo Plus es una propuesta de piloto. Aún no hay cobros ni renovaciones activas.</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--contigo-primary)]">Ver estado <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn to="/contigo/rutas" variant="secondary" iconRight={ArrowRight}>Explorar otras rutas</Btn>
                <Btn to="/feliz-sin-tiroides#comunidad" variant="ghost" iconRight={ArrowRight}>Ir a la comunidad</Btn>
              </div>
            </ContigoSection>

            <ContigoSection tone="white">
              <div className="flex items-start gap-3 rounded-2xl border border-[var(--contigo-border)] bg-[var(--contigo-mint)] p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                <p className="text-sm leading-6 text-edvanta-deep">
                  Tus herramientas se abren en tu espacio de Feliz Sin Tiroides. La comunidad es voluntaria y no es un canal para compartir diagnósticos, medicamentos o resultados.
                </p>
              </div>
            </ContigoSection>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

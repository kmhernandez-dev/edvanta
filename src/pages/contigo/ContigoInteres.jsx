/**
 * ContigoInteres.jsx — /contigo/:ruta/interes
 *
 * Lista de interés de una ruta todavía no abierta. No simula
 * herramientas, agenda, profesionales ni precios: recoge el permiso
 * de contacto por el canal real de solicitudes.
 */

import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Bell, HeartPulse, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card } from '../../components/edvanta/ui';
import {
  ContigoEyebrow, ContigoSection, EstadoContigo,
} from '../../components/contigo/ContigoPieces';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { rutaContigoPorSlug } from '../../data/edvanta/contigo';
import { updatePageSeo } from '../../utils/seo';
import NotFound from '../NotFound';

export default function ContigoInteres() {
  const { ruta: slug } = useParams();
  const ruta = rutaContigoPorSlug(slug);

  useEffect(() => {
    if (!ruta || ruta.estado === 'disponible') return;
    updatePageSeo({
      title: `${ruta.nombre} | Ruta en preparación | Edvanta Contigo`,
      description: `Conoce la propuesta de la ruta ${ruta.nombre} y deja tu interés. Todavía no tiene fecha, herramientas ni servicios habilitados.`,
      canonical: `https://edvanta.co/contigo/${ruta.slug}/interes`,
      robots: 'noindex,follow',
    });
  }, [ruta]);

  if (!ruta) return <NotFound />;
  if (ruta.estado === 'disponible') return <Navigate to={`/contigo/${ruta.slug}`} replace />;

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
                { label: 'Rutas', to: '/contigo/rutas' },
                { label: ruta.nombre },
              ]}
              className="mb-8"
            />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
              <div>
                <EstadoContigo estado="en_preparacion" />
                <h1 className="mt-4 font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-edvanta-blue sm:text-[2.65rem]">
                  {ruta.nombre}: una ruta en preparación
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-[var(--contigo-muted)]">{ruta.texto}</p>
                <div className="mt-6 rounded-2xl border border-[#e4dcf3] bg-[var(--contigo-lavender)] p-4 text-sm leading-6 text-edvanta-deep">
                  <strong>Todavía no está abierta.</strong> No hay fecha, herramientas, profesionales ni precios confirmados para esta ruta. Dejar tu interés no reserva un cupo ni genera un cobro.
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Btn to="/contigo/tiroides" icon={HeartPulse} iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                    Mientras tanto: salud tiroidea
                  </Btn>
                  <Btn to="/contigo/rutas" variant="secondary">Ver las otras rutas</Btn>
                </div>
              </div>
              <Card className="bg-[var(--contigo-mint)]">
                <div className="flex items-start gap-3">
                  <Bell className="mt-0.5 h-5 w-5 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-edvanta-deep">Recibe novedades de esta ruta</h2>
                    <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">
                      Usaremos tu correo para avisarte cuando la ruta abra. No compartimos tus datos ni los usamos para diagnóstico.
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <FormularioSolicitud
                    key={ruta.slug}
                    tipo="interes"
                    referencia={ruta.slug}
                    roles={['paciente', 'cuidador', 'otro']}
                    pacientes
                    boton="Quiero recibir novedades"
                    exito={`Te escribiremos cuando ${ruta.nombre} tenga novedades reales.`}
                    resumenWa={`Me interesa la ruta ${ruta.nombre} de Edvanta Contigo.`}
                  />
                </div>
              </Card>
            </div>
          </div>
        </header>

        <ContigoSection tone="white">
          <ContigoEyebrow>Mientras la ruta se prepara</ContigoEyebrow>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">
            Puedes empezar con lo que ya existe
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link to="/contigo/tiroides" className="contigo-card contigo-card--interactive group p-5">
              <p className="font-display text-lg font-extrabold text-edvanta-deep">Salud tiroidea</p>
              <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">
                Guías, contenido educativo, comunidad y herramientas privadas de Feliz Sin Tiroides.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--contigo-primary)]">
                Entrar a la ruta abierta <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
            <div className="contigo-card p-5">
              <p className="flex items-center gap-2 font-display text-lg font-extrabold text-edvanta-deep">
                <ShieldCheck className="h-5 w-5 text-[var(--contigo-primary)]" aria-hidden="true" /> Sin datos de salud aquí
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">
                No escribas diagnósticos, medicamentos ni resultados en formularios públicos. La información clínica se comparte en el espacio privado cuando el servicio esté habilitado.
              </p>
            </div>
          </div>
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}

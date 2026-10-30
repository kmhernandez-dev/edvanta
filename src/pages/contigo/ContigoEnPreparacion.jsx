/**
 * ContigoEnPreparacion.jsx — espacios profesionales y operación
 *
 * Rutas reservadas para fases posteriores. No simulan agendas,
 * pacientes, pagos ni permisos: explican el estado real.
 */

import { useEffect } from 'react';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn } from '../../components/edvanta/ui';
import { ContigoEyebrow, ContigoSection } from '../../components/contigo/ContigoPieces';
import { updatePageSeo } from '../../utils/seo';

export default function ContigoEnPreparacion({
  titulo = 'Espacio en preparación',
  descripcion = 'Este espacio forma parte de una fase posterior y todavía no tiene datos ni funciones activas.',
  breadcrumb = [],
}) {
  useEffect(() => {
    updatePageSeo({
      title: `${titulo} | Edvanta Contigo`,
      description,
      canonical: 'https://edvanta.co/contigo',
      robots: 'noindex,follow',
    });
  }, [titulo, descripcion]);

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo', to: '/contigo' }, ...breadcrumb]} className="mb-8" />
            <ContigoEyebrow>Fase posterior</ContigoEyebrow>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem]">
              {titulo}
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[var(--contigo-muted)]">{descripcion}</p>
          </div>
        </header>
        <ContigoSection tone="white">
          <div className="contigo-empty">
            <span className="contigo-icon mx-auto"><LockKeyhole className="h-5 w-5" aria-hidden="true" /></span>
            <h2>Sin datos de demostración en este espacio</h2>
            <p>
              No mostramos pacientes, citas, notas clínicas ni métricas inventadas. Este acceso se habilitará cuando existan los permisos, la verificación profesional y la operación correspondiente.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Btn to="/contigo" variant="secondary" size="sm" iconRight={ArrowRight}>Volver a Edvanta Contigo</Btn>
              <Btn to="/contigo/red-profesional" variant="link" size="sm" iconRight={ArrowRight}>Ver vinculación profesional</Btn>
            </div>
          </div>
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}

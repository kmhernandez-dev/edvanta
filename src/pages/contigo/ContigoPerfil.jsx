/**
 * ContigoPerfil.jsx — /contigo/profesionales/:slug
 *
 * No hay perfiles publicados todavía. La ruta existe para que una
 * futura ficha verificada tenga su URL, pero hoy responde con un
 * estado honesto y sin datos inventados.
 */

import { useEffect } from 'react';
import { ArrowRight, UserRound } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn } from '../../components/edvanta/ui';
import { ContigoEyebrow, ContigoSection } from '../../components/contigo/ContigoPieces';
import { updatePageSeo } from '../../utils/seo';

export default function ContigoPerfil() {
  useEffect(() => {
    updatePageSeo({
      title: 'Perfil profesional no disponible | Edvanta Contigo',
      description: 'La red de profesionales de Edvanta Contigo está en preparación.',
      canonical: 'https://edvanta.co/contigo/profesionales',
      robots: 'noindex,follow',
    });
  }, []);

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo', to: '/contigo' }, { label: 'Profesionales', to: '/contigo/profesionales' }, { label: 'Perfil' }]} className="mb-8" />
            <ContigoEyebrow>Perfil profesional</ContigoEyebrow>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem]">
              Este perfil todavía no está publicado
            </h1>
          </div>
        </header>
        <ContigoSection tone="white">
          <div className="contigo-empty">
            <span className="contigo-icon mx-auto"><UserRound className="h-5 w-5" aria-hidden="true" /></span>
            <h2>No mostramos perfiles sin verificar</h2>
            <p>
              La red profesional está en preparación. Cuando un profesional complete su vinculación y verificación, su perfil aparecerá aquí con formación, experiencia, país, servicios y disponibilidad reales.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Btn to="/contigo/profesionales" variant="secondary" size="sm" iconRight={ArrowRight}>Volver a la red</Btn>
              <Btn to="/contigo/red-profesional" variant="link" size="sm" iconRight={ArrowRight}>Soy profesional</Btn>
            </div>
          </div>
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}

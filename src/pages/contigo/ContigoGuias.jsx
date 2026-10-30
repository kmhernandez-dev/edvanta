/**
 * ContigoGuias.jsx — /contigo/tiroides/guias
 *
 * Biblioteca de guías existentes de Feliz Sin Tiroides. No crea
 * recursos nuevos ni promete materiales que no estén publicados.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Download } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn } from '../../components/edvanta/ui';
import { ContigoEyebrow, ContigoSection } from '../../components/contigo/ContigoPieces';
import { ProductoCard } from '../../components/edvanta/oferta';
import { PRODUCTOS } from '../../data/edvanta/productos';
import { updatePageSeo } from '../../utils/seo';

export default function ContigoGuias() {
  const guias = PRODUCTOS.filter((p) => p.programa === 'feliz-sin-tiroides');

  useEffect(() => {
    updatePageSeo({
      title: 'Guías de salud tiroidea | Edvanta Contigo',
      description: 'Guías y recursos de Feliz Sin Tiroides para leer en casa y llevar a la consulta.',
      canonical: 'https://edvanta.co/contigo/tiroides/guias',
      jsonLdId: 'contigo-guias',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Guías de salud tiroidea',
        url: 'https://edvanta.co/contigo/tiroides/guias',
        publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
      },
    });
  }, []);

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
                { label: 'Salud tiroidea', to: '/contigo/tiroides' },
                { label: 'Guías' },
              ]}
              className="mb-8"
            />
            <ContigoEyebrow>Guías Contigo</ContigoEyebrow>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem] lg:text-[3rem]">
              Recursos para leer en casa y llevar a la consulta
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[var(--contigo-muted)]">
              Material educativo de Feliz Sin Tiroides. Cada recurso conserva su autor, su propósito y sus condiciones de uso.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Btn to="/recurso/levotiroxina" icon={Download} iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                Guía gratuita de levotiroxina
              </Btn>
              <Btn to="/contigo/tiroides" variant="secondary" icon={BookOpen}>Volver a la ruta</Btn>
            </div>
          </div>
        </header>

        <ContigoSection tone="white">
          {guias.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {guias.map((p) => <ProductoCard key={p.slug} producto={p} />)}
            </div>
          ) : (
            <div className="contigo-empty">
              <span className="contigo-icon mx-auto"><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
              <h2>Las guías se están preparando</h2>
              <p>Mientras tanto, puedes descargar la guía gratuita de levotiroxina o entrar a salud tiroidea.</p>
              <div className="mt-4 flex justify-center gap-3">
                <Btn to="/recurso/levotiroxina" variant="secondary" size="sm">Descargar guía</Btn>
                <Link to="/contigo/tiroides" className="self-center text-sm font-bold text-[var(--contigo-primary)] underline">Volver a la ruta</Link>
              </div>
            </div>
          )}
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}

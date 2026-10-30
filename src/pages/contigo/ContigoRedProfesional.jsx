/**
 * ContigoRedProfesional.jsx — /contigo/red-profesional
 *
 * Presenta la red y el proceso de vinculación. La postulación usa el
 * canal real de solicitudes y no habilita atención automáticamente.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileSignature, ShieldCheck, UserRound } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card } from '../../components/edvanta/ui';
import { ContigoEyebrow, ContigoSection } from '../../components/contigo/ContigoPieces';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { RED_PROFESIONAL } from '../../data/edvanta/contigo';
import { updatePageSeo } from '../../utils/seo';

export default function ContigoRedProfesional() {
  const { pathname } = useLocation();
  const postulacion = pathname.endsWith('/postulacion');

  useEffect(() => {
    updatePageSeo({
      title: postulacion ? 'Postulación a la red profesional | Edvanta Contigo' : 'Red de profesionales | Edvanta Contigo',
      description: postulacion
        ? 'Envía tu solicitud para la red de profesionales de Edvanta Contigo. La solicitud pasa por revisión y no habilita atención automáticamente.'
        : 'Conoce los requisitos y el proceso para vincularte a la red de profesionales de Edvanta Contigo.',
      canonical: `https://edvanta.co/contigo/red-profesional${postulacion ? '/postulacion' : ''}`,
      robots: 'noindex,follow',
    });
  }, [postulacion]);

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
                { label: 'Red de profesionales', to: '/contigo/red-profesional' },
                ...(postulacion ? [{ label: 'Postulación' }] : []),
              ]}
              className="mb-8"
            />
            <ContigoEyebrow>Red de profesionales</ContigoEyebrow>
            <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-edvanta-blue sm:text-[2.65rem] lg:text-[3rem]">
              {postulacion ? 'Enviar mi solicitud de vinculación' : 'Una red que empieza por verificar, no por publicar'}
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[var(--contigo-muted)]">
              {postulacion
                ? 'Completa la solicitud. Revisaremos la información y el proceso de verificación aplicable. Enviar el formulario no activa tu perfil ni una agenda.'
                : RED_PROFESIONAL.lead}
            </p>
          </div>
        </header>

        {!postulacion ? (
          <>
            <ContigoSection tone="white">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
                <div>
                  <ContigoEyebrow>Requisitos</ContigoEyebrow>
                  <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                    Lo que se revisa antes de activar una agenda
                  </h2>
                  <p className="mt-4 text-base leading-7 text-[var(--contigo-muted)]">
                    El título que cada persona posee se muestra tal cual. No llamamos «doctor en farmacia clínica» a todos por defecto.
                  </p>
                </div>
                <Card>
                  <ul className="space-y-3">
                    {RED_PROFESIONAL.requisitos.map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </ContigoSection>

            <ContigoSection tone="sage">
              <ContigoEyebrow>Proceso</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                De la solicitud a una agenda activa
              </h2>
              <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {RED_PROFESIONAL.pasos.map((x, i) => (
                  <li key={x} className="contigo-card p-5">
                    <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[var(--contigo-primary)]">Paso {i + 1}</span>
                    <p className="mt-2 text-sm font-semibold leading-6 text-edvanta-deep">{x}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap gap-3">
                <Btn to="/contigo/red-profesional/postulacion" icon={UserRound} iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                  Enviar mi solicitud
                </Btn>
                <Btn to="/contigo/profesionales" variant="secondary" icon={ShieldCheck}>Ver la red</Btn>
              </div>
            </ContigoSection>
          </>
        ) : (
          <ContigoSection tone="white">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
              <div>
                <ContigoEyebrow>Postulación</ContigoEyebrow>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                  Cuéntanos quién eres
                </h2>
                <p className="mt-4 text-base leading-7 text-[var(--contigo-muted)]">
                  Incluye en el mensaje tu título profesional, país de atención, experiencia pertinente y el servicio que te gustaría ofrecer. No envíes documentos personales en este formulario.
                </p>
                <div className="mt-5 rounded-2xl border border-[var(--contigo-border)] bg-[var(--contigo-mint)] p-4 text-sm leading-6 text-edvanta-deep">
                  <p className="flex items-center gap-2 font-bold"><FileSignature className="h-4 w-4 text-[var(--contigo-primary)]" aria-hidden="true" /> La solicitud no habilita atención automáticamente.</p>
                  <p className="mt-1 text-[var(--contigo-muted)]">La revisión documental y la verificación profesional se realizan antes de cualquier agenda.</p>
                </div>
              </div>
              <Card>
                <FormularioSolicitud
                  tipo="contacto"
                  referencia="red-profesional"
                  roles={['quimico', 'otro_profesional', 'estudiante', 'otro']}
                  boton="Enviar solicitud"
                  exito="Recibimos tu solicitud. El equipo la revisará antes de cualquier activación."
                  resumenWa="Quiero postularme a la Red de profesionales de Edvanta Contigo."
                />
              </Card>
            </div>
          </ContigoSection>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

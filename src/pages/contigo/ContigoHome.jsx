/**
 * ============================================================
 *  ContigoHome.jsx — /contigo
 *
 *  Puerta de entrada de Edvanta Contigo. Explica las tres
 *  necesidades, muestra la única ruta abierta (tiroides) y las
 *  cinco rutas en lista de interés, enlaza las herramientas reales
 *  de Feliz Sin Tiroides y presenta la red profesional y los planes
 *  como propuestas en preparación.
 * ============================================================
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Building2, CheckCircle2, HeartPulse, ShieldCheck, Stethoscope,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Faq } from '../../components/edvanta/ui';
import {
  ContigoEyebrow, ContigoHeroVisual, ContigoSection, HerramientaContigoCard,
  IconoContigo, NecesidadContigoCard, PlanContigoCard, RutaContigoCard,
} from '../../components/contigo/ContigoPieces';
import {
  CONTIGO, CONTIGO_FAQ, CONTIGO_HERRAMIENTAS, CONTIGO_NECESIDADES,
  CONTIGO_PASOS, CONTIGO_PLANES, CONTIGO_RUTAS, RED_PROFESIONAL,
} from '../../data/edvanta/contigo';
import { updatePageSeo } from '../../utils/seo';

export default function ContigoHome() {
  useEffect(() => {
    updatePageSeo({
      title: 'Edvanta Contigo | Comprende tu tratamiento y organiza tu cuidado',
      description: 'Educación en salud, herramientas privadas y acompañamiento para pacientes y cuidadores. Empieza por salud tiroidea con Feliz Sin Tiroides.',
      canonical: 'https://edvanta.co/contigo',
      image: 'https://edvanta.co/img/fotos/pacientes-taller.webp',
      keywords: ['Edvanta Contigo', 'educación para pacientes', 'salud tiroidea', 'Feliz Sin Tiroides'],
      jsonLdId: 'contigo-home',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Edvanta Contigo',
          description: 'Educación, herramientas y acompañamiento para pacientes y cuidadores.',
          url: 'https://edvanta.co/contigo',
          publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Edvanta Contigo', item: 'https://edvanta.co/contigo' },
          ],
        },
      ],
    });
  }, []);

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo' }]} className="mb-8" />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)] lg:gap-14">
              <div>
                <ContigoEyebrow>Edvanta Contigo</ContigoEyebrow>
                <h1 className="mt-4 font-display text-[2.2rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-edvanta-blue sm:text-[2.8rem] lg:text-[3.1rem]">
                  Tu salud merece un espacio que te acompañe
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-[var(--contigo-muted)]">
                  Comprende tu tratamiento, organiza tu cuidado y encuentra profesionales que puedan ayudarte.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Btn to="/contigo/rutas" size="lg" iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                    Encuentra tu ruta
                  </Btn>
                  <Btn to="/contigo/profesionales" variant="secondary" size="lg" icon={Stethoscope}>
                    Buscar acompañamiento
                  </Btn>
                </div>
                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--contigo-muted)]">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                  Educación y herramientas. No diagnostica ni modifica tu tratamiento.
                </p>
              </div>
              <ContigoHeroVisual />
            </div>
          </div>
        </header>

        <ContigoSection tone="white">
          <div className="grid gap-5 md:grid-cols-3">
            {CONTIGO_NECESIDADES.map((n) => <NecesidadContigoCard key={n.id} necesidad={n} />)}
          </div>
        </ContigoSection>

        <ContigoSection id="rutas" tone="sage">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <ContigoEyebrow>Rutas por condición</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Empieza por la condición que te importa
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--contigo-muted)]">
                Hoy está abierta la salud tiroidea. Las demás rutas se están preparando y puedes dejar tu interés.
              </p>
            </div>
            <Btn to="/contigo/rutas" variant="secondary" size="sm" iconRight={ArrowRight}>Ver las seis rutas</Btn>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CONTIGO_RUTAS.map((r) => <RutaContigoCard key={r.slug} ruta={r} />)}
          </div>
        </ContigoSection>

        <ContigoSection id="mi-cuidado" tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div>
              <ContigoEyebrow>Mi cuidado</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Tus herramientas, en un espacio privado
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--contigo-muted)]">
                Medicamentos, documentos, citas y preguntas para la consulta. Las herramientas reales de salud tiroidea viven hoy en Feliz Sin Tiroides.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn to="/mi-cuidado" size="lg" icon={HeartPulse} iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                  Abrir Mi cuidado
                </Btn>
                <Btn to="/contigo/tiroides" variant="secondary" size="lg">Conocer Feliz Sin Tiroides</Btn>
              </div>
              <p className="mt-5 rounded-2xl bg-[var(--contigo-mint)] px-4 py-3 text-xs leading-5 text-[var(--contigo-muted)]">
                Mi cuidado abre el portal existente de Feliz Sin Tiroides. No creamos un segundo historial ni duplicamos tu cuenta.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {CONTIGO_HERRAMIENTAS.slice(0, 4).map((h) => <HerramientaContigoCard key={h.id} herramienta={h} />)}
            </div>
          </div>
        </ContigoSection>

        <ContigoSection tone="lavender">
          <ContigoEyebrow>Cómo funciona</ContigoEyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            Un recorrido corto, sin pasos de más
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONTIGO_PASOS.map((p, i) => (
              <li key={p.titulo} className="contigo-card p-5">
                <div className="flex items-center gap-2">
                  <span className="contigo-icon !h-9 !w-9 !rounded-[10px]"><IconoContigo name={p.icono} className="h-4 w-4" /></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[var(--contigo-primary)]">Paso {i + 1}</span>
                </div>
                <h3 className="mt-3 font-display text-base font-extrabold text-edvanta-deep">{p.titulo}</h3>
                <p className="mt-1 text-xs leading-5 text-[var(--contigo-muted)]">{p.desc}</p>
              </li>
            ))}
          </ol>
        </ContigoSection>

        <ContigoSection tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
            <div>
              <ContigoEyebrow>Acompañamiento profesional</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Una red que todavía se está preparando
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--contigo-muted)]">
                {RED_PROFESIONAL.lead} No mostramos perfiles, testimonios ni agendas que no existan.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Btn to="/contigo/profesionales" variant="secondary" iconRight={ArrowRight}>Conocer la red</Btn>
                <Btn to="/contigo/red-profesional" variant="link" iconRight={ArrowRight}>Soy profesional</Btn>
              </div>
            </div>
            <div className="contigo-empty">
              <span className="contigo-icon mx-auto"><Stethoscope className="h-5 w-5" aria-hidden="true" /></span>
              <h2>Sin profesionales verificados todavía</h2>
              <p>La consulta farmacéutica individual es una propuesta en preparación. Cuando haya profesionales verificados y agenda activa, aparecerán aquí con su alcance, precio y disponibilidad.</p>
              <Link to="/contigo/red-profesional" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--contigo-primary)] hover:underline">
                Ver el proceso de vinculación <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </ContigoSection>

        <ContigoSection tone="mint">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <ContigoEyebrow>Planes</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Educación y cuidado, sin mezclar la consulta
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--contigo-muted)]">
                La comunidad es gratuita. Contigo Plus y la consulta son propuestas con precios de prueba; esta versión no cobra.
              </p>
            </div>
            <Btn to="/contigo/planes" variant="secondary" size="sm" iconRight={ArrowRight}>Comparar planes</Btn>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {CONTIGO_PLANES.slice(0, 3).map((p) => <PlanContigoCard key={p.id} plan={p} destacado={p.id === 'plus'} />)}
          </div>
        </ContigoSection>

        <ContigoSection tone="white">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-start">
            <div>
              <ContigoEyebrow>Preguntas frecuentes</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Lo que conviene saber
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--contigo-muted)]">
                Si algo no está claro, escríbenos. No prometemos atención, reservas ni coberturas que aún no estén habilitadas.
              </p>
            </div>
            <Faq items={CONTIGO_FAQ} />
          </div>
        </ContigoSection>

        <ContigoSection tone="sage">
          <div className="grid gap-8 rounded-[26px] border border-[var(--contigo-border)] bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <ContigoEyebrow>¿Eres profesional o institución?</ContigoEyebrow>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">
                La red profesional y las rutas institucionales se construyen aparte
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--contigo-muted)]">
                Postula tu perfil si cumples los requisitos o conoce Ruta Contigo si representas una organización.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Btn to="/contigo/red-profesional/postulacion" icon={Stethoscope} iconRight={ArrowRight}>Postularme</Btn>
              <Btn to="/instituciones/paquetes/ruta-contigo" variant="secondary" icon={Building2}>Ruta Contigo</Btn>
            </div>
          </div>
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}

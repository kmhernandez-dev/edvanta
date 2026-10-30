/**
 * ============================================================
 *  MarketingServicios.jsx — /empresas/marketing
 *
 *  Hub de servicios de marketing y comunicación para empresas.
 *  Reúne las seis líneas bajo propuesta, explica el proceso y lleva
 *  a una landing propia por servicio. No publica precios, plazos ni
 *  resultados comerciales.
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, MessagesSquare, Sparkles,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card, Faq } from '../../components/edvanta/ui';
import {
  EjemploEntregable, MarketingEyebrow, MarketingHeroVisual, MarketingSection,
  ProcesoMarketing, ServicioMarketingCard,
} from '../../components/edvanta/marketing';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import {
  EJEMPLOS_ENTREGABLES, PROCESO_MARKETING, SERVICIOS_MARKETING,
} from '../../data/edvanta/marketing';
import { updatePageSeo } from '../../utils/seo';

const GRUPOS = [
  { id: 'todos', label: 'Todas las soluciones' },
  { id: 'ordenar', label: 'Ordenar qué decir' },
  { id: 'producir', label: 'Producir materiales' },
  { id: 'activar', label: 'Activar una campaña' },
  { id: 'formar', label: 'Formar al equipo' },
];

const SERVICIOS_POR_GRUPO = {
  todos: SERVICIOS_MARKETING.map((s) => s.slug),
  ordenar: ['estrategia-y-posicionamiento', 'comunicacion-cientifica'],
  producir: ['comunicacion-cientifica', 'materiales-comerciales', 'contenido-digital-y-video'],
  activar: ['landing-pages-y-campanas', 'contenido-digital-y-video'],
  formar: ['formacion-de-equipos'],
};

const FAQ = [
  {
    q: '¿Cómo se solicita una propuesta?',
    a: 'Selecciona el servicio que te interesa y completa el formulario. Primero conversamos el objetivo, los públicos y el alcance; después recibes una propuesta escrita. No hay compromiso antes de revisarla.',
  },
  {
    q: '¿Qué información necesita la empresa?',
    a: 'El objetivo de comunicación, los públicos, los materiales que ya usa, las restricciones de marca o regulatorias y las personas responsables de aprobar.',
  },
  {
    q: '¿Puedo combinar varios servicios?',
    a: 'Sí. Una misma propuesta puede incluir estrategia, materiales y formación de equipos. El formulario permite cambiar la selección y contar la necesidad completa.',
  },
  {
    q: '¿Incluyen aprobación regulatoria?',
    a: 'No. La revisión y la aprobación final de cada material corresponden a la organización y a las autoridades cuando aplique. Edvanta puede apoyar la producción y la verificación de fuentes.',
  },
  {
    q: '¿Publican precios o plazos?',
    a: 'No. El alcance, el valor y el calendario dependen del proyecto y se detallan por escrito después de la primera conversación.',
  },
];

export default function MarketingServicios() {
  const [grupo, setGrupo] = useState('todos');

  const moverPestana = (event) => {
    const actual = GRUPOS.findIndex((g) => g.id === grupo);
    const paso = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!paso) return;
    event.preventDefault();
    const siguiente = GRUPOS[(actual + paso + GRUPOS.length) % GRUPOS.length];
    setGrupo(siguiente.id);
    document.getElementById(`grupo-${siguiente.id}`)?.focus();
  };

  useEffect(() => {
    updatePageSeo({
      title: 'Marketing y comunicación para empresas del sector salud | Edvanta',
      description: 'Estrategia, comunicación científica, materiales, contenidos, campañas y formación de equipos. Servicios de Edvanta para empresas del sector farmacéutico y de la salud.',
      canonical: 'https://edvanta.co/empresas/marketing',
      image: 'https://edvanta.co/img/escuelas/marketing.webp',
      keywords: ['marketing farmacéutico para empresas', 'comunicación científica', 'materiales comerciales', 'formación de equipos'],
      jsonLdId: 'marketing-servicios',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Marketing y comunicación para empresas',
          description: 'Servicios de estrategia, comunicación científica, materiales, contenidos y formación para empresas del sector salud.',
          url: 'https://edvanta.co/empresas/marketing',
          publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Instituciones', item: 'https://edvanta.co/instituciones' },
            { '@type': 'ListItem', position: 3, name: 'Marketing y comunicación', item: 'https://edvanta.co/empresas/marketing' },
          ],
        },
      ],
    });
  }, []);

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
                { label: 'Marketing y comunicación' },
              ]}
              className="mb-8"
            />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14">
              <div>
                <MarketingEyebrow>Edvanta para empresas</MarketingEyebrow>
                <h1 className="mt-4 font-display text-[2.2rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-edvanta-blue sm:text-[2.8rem] lg:text-[3.15rem]">
                  Marketing y comunicación para empresas
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-edvanta-muted">
                  Soluciones para equipos que necesitan ordenar una estrategia, producir materiales, activar una campaña o formar a su equipo. Todo se trabaja bajo propuesta.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Btn href="#servicios" size="lg" iconRight={ArrowRight}>Ver las soluciones</Btn>
                  <Btn href="#solicitar-propuesta" variant="secondary" size="lg" icon={MessagesSquare}>
                    Solicitar propuesta
                  </Btn>
                </div>
                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-edvanta-subtle">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                  Alcance y propuesta según necesidades. Sin precios ni plazos publicados.
                </p>
              </div>
              <MarketingHeroVisual />
            </div>
          </div>
        </header>

        {/* Servicios por necesidad */}
        <MarketingSection id="servicios" tone="white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <MarketingEyebrow>Soluciones</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Empieza por la necesidad, no por el formato
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
                Filtra por lo que necesita tu equipo. Cada servicio explica qué resuelve, qué puede entregar y cómo se trabaja.
              </p>
            </div>
            <Link to="/instituciones" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
              Ver capacitación institucional <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div role="tablist" aria-label="Soluciones de marketing por necesidad" className="marketing-tabs mt-8">
            {GRUPOS.map((g) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                id={`grupo-${g.id}`}
                aria-selected={grupo === g.id}
                aria-controls={`panel-${g.id}`}
                onClick={() => setGrupo(g.id)}
                onKeyDown={moverPestana}
                className="marketing-tab"
              >
                {g.label}
              </button>
            ))}
          </div>

          {GRUPOS.map((g) => (
            <div
              key={g.id}
              id={`panel-${g.id}`}
              role="tabpanel"
              aria-labelledby={`grupo-${g.id}`}
              hidden={grupo !== g.id}
              className="mt-6"
            >
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {SERVICIOS_MARKETING
                  .filter((s) => SERVICIOS_POR_GRUPO[g.id].includes(s.slug))
                  .map((s) => <ServicioMarketingCard key={s.slug} servicio={s} />)}
              </div>
            </div>
          ))}

          <div className="mt-8 rounded-2xl border border-edvanta-border bg-[#F8FAFD] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-edvanta-tealdark">Formación para equipos comerciales</p>
                <p className="mt-1 text-base font-bold text-edvanta-deep">¿Necesitas capacitar a un equipo de visita médica o marketing?</p>
                <p className="mt-1 text-sm leading-6 text-edvanta-muted">
                  La línea de formación para empresas se diseña con el equipo y puede combinarse con estos servicios.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn to="/empresas/marketing-farmaceutico" size="sm" variant="secondary" iconRight={ArrowRight}>
                  Ver formación para equipos
                </Btn>
                <Btn to="/instituciones/paquetes/equipo-que-cuida" size="sm" variant="ghost" iconRight={ArrowRight}>
                  Equipo que Cuida
                </Btn>
              </div>
            </div>
          </div>
        </MarketingSection>

        {/* Proceso */}
        <MarketingSection id="como-trabajamos" tone="lavender">
          <MarketingEyebrow>Cómo trabajamos</MarketingEyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            Un proceso claro, con entregables en cada etapa
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
            No empezamos produciendo piezas. Primero entendemos el objetivo y el público; después definimos qué se va a entregar y cómo se revisará.
          </p>
          <ProcesoMarketing pasos={PROCESO_MARKETING} />
          <p className="mt-6 max-w-3xl text-xs leading-5 text-edvanta-muted">
            La revisión científica y de marca se integra cuando corresponde. Si el proyecto requiere otras áreas o aprobaciones, se coordina con la organización; no se promete aprobación regulatoria automática.
          </p>
        </MarketingSection>

        {/* Ejemplos */}
        <MarketingSection tone="white">
          <MarketingEyebrow>Ejemplos de entregables</MarketingEyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            El tipo de piezas que se pueden acordar
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
            Son ejemplos de estructura, no proyectos contratados. El alcance real se define con cada organización.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EJEMPLOS_ENTREGABLES.map((ejemplo) => <EjemploEntregable key={ejemplo.id} ejemplo={ejemplo} />)}
          </div>
        </MarketingSection>

        {/* FAQ + formulario */}
        <MarketingSection id="solicitar-propuesta" tone="mint">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
            <div>
              <MarketingEyebrow>Preguntas frecuentes</MarketingEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Hablemos de tu proyecto
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-edvanta-muted">
                Cuéntanos qué necesita tu equipo. La primera conversación sirve para entender el alcance, no para comprometer una compra.
              </p>
              <Faq items={FAQ} className="mt-6" />
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn to="/empresas/marketing-farmaceutico" size="sm" variant="secondary" iconRight={ArrowRight}>Formación para equipos comerciales</Btn>
                <Btn to="/instituciones/paquetes/comunicacion-con-evidencia" size="sm" variant="ghost" iconRight={ArrowRight}>Comunicación con Evidencia</Btn>
              </div>
            </div>
            <Card className="bg-white">
              <h3 className="font-display text-xl font-extrabold text-edvanta-deep">Solicitar una propuesta</h3>
              <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">
                Puedes cambiar el servicio de interés en el formulario. Solo necesitamos lo mínimo para responderte.
              </p>
              <div className="mt-5">
                <FormularioSolicitud
                  tipo="propuesta"
                  paquetes={SERVICIOS_MARKETING.map((s) => ({ slug: s.slug, nombre: s.nombre }))}
                  boton="Solicitar propuesta"
                  exito="Revisaremos la información y te escribiremos para coordinar la primera conversación."
                  resumenWa="Quiero conversar sobre un servicio de marketing y comunicación para mi organización."
                />
              </div>
            </Card>
          </div>
        </MarketingSection>

        <section className="border-t border-edvanta-border bg-white">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-edvanta-tealdark">También puedes aprender</p>
              <p className="mt-1 font-display text-xl font-extrabold text-edvanta-deep">Conoce la Escuela de Marketing y Comunicación</p>
              <p className="mt-1 text-sm leading-6 text-edvanta-muted">Programas en desarrollo y una ruta para entender la comunicación desde la evidencia.</p>
            </div>
            <Btn to="/escuelas/marketing-y-comunicacion-farmaceutica" size="lg" icon={Sparkles} iconRight={ArrowRight}>
              Ir a la escuela
            </Btn>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

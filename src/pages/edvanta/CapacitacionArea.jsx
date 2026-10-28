import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Building2, CheckCircle2, ClipboardList, FileSignature, Layers,
  MessagesSquare, MonitorPlay, Rocket, Sparkles, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import {
  Breadcrumb, Btn, Card, Faq, Section, SectionHeading, Steps,
} from '../../components/edvanta/ui';
import { HeroEditorial } from '../../components/edvanta/heroes';
import FormularioCapacitacion from '../../components/formularios/FormularioCapacitacion';
import {
  CATEGORIAS_CAPACITACION, ENTREGABLES_GENERALES, MODALIDADES, PROCESO_PROPUESTA,
  areaPorSlug, areasRelacionadas,
} from '../../data/edvanta/capacitacion';
import { updatePageSeo } from '../../utils/seo';
import NotFound from '../NotFound';

const ICONOS_MODALIDAD = { live: MonitorPlay, aula: BookOpen, mix: Layers, design: Sparkles };
const ICONOS_PROCESO = [MessagesSquare, ClipboardList, FileSignature, Rocket];

export default function CapacitacionArea() {
  const { slug } = useParams();
  const area = areaPorSlug(slug);

  useEffect(() => {
    if (!area) return;
    updatePageSeo({
      title: `${area.nombre} | Capacitación para empresas e instituciones | Edvanta`,
      description: area.resumen,
      canonical: `https://edvanta.co/empresas/${area.slug}`,
      image: `https://edvanta.co${area.imagen}`,
      keywords: ['capacitación farmacéutica', area.nombre, 'formación para empresas'],
    });
  }, [area]);

  if (!area) return <NotFound />;

  const categoria = CATEGORIAS_CAPACITACION[area.categoria];
  const relacionadas = areasRelacionadas(area);
  const highlight = area.heroTitle.includes(area.nombre) ? area.nombre : undefined;

  const enfocarAreas = () => {
    document.getElementById('solicitar-propuesta')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('areas-capacitacion')?.focus(), 450);
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroEditorial
          breadcrumb={(
            <Breadcrumb
              items={[
                { label: 'Inicio', to: '/' },
                { label: 'Capacitación para empresas e instituciones', to: '/instituciones' },
                { label: area.nombre },
              ]}
              className="mb-8"
            />
          )}
          eyebrow={categoria.etiqueta}
          title={area.heroTitle}
          highlight={highlight}
          lead={area.heroLead}
          image={area.imagen}
          imageAlt={area.imagenAlt}
          actions={(
            <>
              <Btn href="#solicitar-propuesta" size="lg" iconRight={ArrowRight}>Solicitar capacitación en esta área</Btn>
              <Btn onClick={enfocarAreas} variant="secondary" size="lg" icon={Layers}>Agregar otra área</Btn>
            </>
          )}
          aside={[
            { icon: Users, label: 'Perfiles y equipos', to: '#perfiles' },
            { icon: Building2, label: 'Organizaciones', to: '#organizaciones' },
            { icon: ClipboardList, label: 'Ruta de ejemplo', to: '#ruta' },
          ]}
        />

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Por qué esta línea"
                title={`Qué puede resolver ${area.nombre} en tu equipo`}
                desc={area.intro}
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {(area.retos || []).map((r) => (
                  <div key={r} className="flex items-start gap-2.5 rounded-xl border border-edvanta-border bg-white px-4 py-3.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                    <p className="text-sm leading-6 text-edvanta-deep">{r}</p>
                  </div>
                ))}
              </div>
            </div>
            <Card className="bg-edvanta-bg">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-subtle">En una frase</p>
              <p className="mt-3 font-display text-xl font-extrabold leading-snug text-edvanta-deep">
                Una línea de formación para {area.nombre}, ajustada a las funciones y a la operación de tu organización.
              </p>
              <p className="mt-4 text-sm leading-6 text-edvanta-muted">
                No es un curso con fecha y cupo publicados. Es una propuesta que se diseña contigo y se detalla antes de empezar.
              </p>
              <Btn href="#solicitar-propuesta" className="mt-5" variant="secondary" iconRight={ArrowRight}>Solicitar propuesta</Btn>
            </Card>
          </div>
        </Section>

        <Section id="organizaciones" tone="ice" bordered>
          <SectionHeading
            eyebrow="A quién sirve"
            title="Organizaciones y perfiles destinatarios"
            desc="La formación se adapta al nivel de responsabilidad de cada grupo y al tipo de operación."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center gap-3">
                <span className="ds-icon-tile h-11 w-11"><Building2 className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="font-display text-lg font-extrabold text-edvanta-deep">Organizaciones</h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {area.organizaciones.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />{o}
                  </li>
                ))}
              </ul>
            </Card>
            <Card id="perfiles">
              <div className="flex items-center gap-3">
                <span className="ds-icon-tile ds-icon-tile--violet h-11 w-11"><Users className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="font-display text-lg font-extrabold text-edvanta-deep">Perfiles</h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {area.dirigidoA.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-violet" aria-hidden="true" />{p}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>

        <Section tone="white">
          <SectionHeading
            eyebrow="Ejes temáticos"
            title="Temas que se pueden trabajar"
            desc={`Estos ejes son orientativos. En la propuesta se seleccionan, profundizan y ordenan según la necesidad de ${area.nombre}.`}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {area.ejes.map((e, i) => (
              <article key={e.titulo} className="ds-card p-6">
                <span className="font-display text-2xl font-extrabold text-edvanta-blue/25">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-display text-lg font-extrabold leading-snug text-edvanta-deep">{e.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-edvanta-muted">{e.desc}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section tone="glow">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Competencias"
                title="Qué busca fortalecer"
                desc="Son capacidades que la formación puede ayudar a desarrollar. El nivel alcanzado depende del punto de partida, la práctica y el alcance acordado; no se garantiza un resultado individual."
              />
              <Btn href="#solicitar-propuesta" className="mt-6" variant="secondary" iconRight={ArrowRight}>Diseñar con este enfoque</Btn>
            </div>
            <Card>
              <ul className="space-y-3.5">
                {area.competencias.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[15px] leading-6 text-edvanta-deep">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{c}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>

        <Section id="ruta" tone="lavender" bordered>
          <SectionHeading
            eyebrow="Ruta formativa de ejemplo"
            title="Una secuencia posible, no una camisa de fuerza"
            desc="Así podría organizarse el trabajo con un equipo. La propuesta adaptable define el número de encuentros, los temas y las actividades según el tiempo disponible."
          />
          <Steps
            className="mt-12"
            items={area.ruta.map((p) => ({ title: p.titulo, desc: p.desc, icon: ClipboardList }))}
          />
          <p className="mt-8 max-w-3xl text-xs leading-5 text-edvanta-muted">
            Ruta orientativa y adaptable. No implica una duración, un número de sesiones ni una fecha confirmada.
          </p>
        </Section>

        <Section tone="white">
          <SectionHeading
            eyebrow="Modalidades y entregables"
            title="Cómo puede desarrollarse"
            desc="La modalidad se elige con la organización. Los entregables se detallan en la propuesta escrita."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MODALIDADES.map((m) => {
              const Icono = ICONOS_MODALIDAD[m.icono] || MonitorPlay;
              return (
                <article key={m.titulo} className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <span className="ds-icon-tile ds-icon-tile--teal h-11 w-11"><Icono className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" /></span>
                  <h3 className="mt-4 text-base font-bold text-edvanta-deep">{m.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{m.desc}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-8 rounded-2xl bg-edvanta-bg p-6">
            <h3 className="font-display text-xl font-extrabold text-edvanta-deep">Entregables que se pueden incluir</h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {ENTREGABLES_GENERALES.map((e) => (
                <li key={e} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{e}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section tone="ice" bordered>
          <SectionHeading
            eyebrow="Proceso"
            title="Cómo se define el alcance"
            desc="La propuesta se construye con información concreta. No hay compromiso hasta que la organización decida."
          />
          <Steps
            className="mt-12"
            items={PROCESO_PROPUESTA.map((p, i) => ({ title: p.titulo, desc: p.desc, icon: ICONOS_PROCESO[i] }))}
          />
        </Section>

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Preguntas frecuentes"
                title={`Dudas sobre ${area.nombre}`}
              />
              <Faq items={area.faq} className="mt-8" />
            </div>
            <Card className="bg-edvanta-bg">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">Siguiente paso</p>
              <h3 className="mt-2 font-display text-xl font-extrabold text-edvanta-deep">Solicita una propuesta para esta área</h3>
              <p className="mt-2 text-sm leading-6 text-edvanta-muted">
                Si necesitas formación en varias áreas, puedes marcar más de una en el formulario. La solicitud conserva el área desde la que llegaste.
              </p>
              <Btn href="#solicitar-propuesta" className="mt-5" iconRight={ArrowRight}>Solicitar capacitación</Btn>
            </Card>
          </div>
        </Section>

        {relacionadas.length > 0 && (
          <Section tone="lavender" bordered>
            <SectionHeading
              eyebrow="Áreas relacionadas"
              title="Otras líneas que pueden complementar la propuesta"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {relacionadas.map((r) => (
                <Link key={r.slug} to={`/empresas/${r.slug}`} className="group ds-card ds-card--interactive flex h-full flex-col p-6">
                  <span className={`ds-chip w-fit ${r.categoria === 'perfil' ? 'ds-chip--teal' : 'ds-chip--violet'}`}>
                    {CATEGORIAS_CAPACITACION[r.categoria].etiqueta}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-extrabold leading-snug text-edvanta-deep">{r.nombre}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{r.resumen}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
                    Explorar capacitación
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </Section>
        )}

        <section id="solicitar-propuesta" className="scroll-mt-28">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
              <div>
                <SectionHeading
                  eyebrow="Solicitar capacitación en esta área"
                  title="Hablemos de tu equipo"
                  desc="El área ya está preseleccionada. Puedes agregar otras áreas, perfiles y la información que ayude a preparar una propuesta útil."
                />
                <p className="mt-6 rounded-2xl bg-edvanta-light/60 px-5 py-4 text-sm leading-6 text-edvanta-deep">
                  Área de origen: <strong>{area.nombre}</strong>. El formulario conserva esta selección y permite combinarla con otras líneas.
                </p>
                <p className="mt-6 text-sm leading-6 text-edvanta-muted">
                  Si tu organización necesita formación en varios frentes, no hace falta enviar solicitudes separadas.
                </p>
              </div>
              <Card>
                <FormularioCapacitacion
                  key={area.slug}
                  areaInicial={area.slug}
                  boton="Solicitar capacitación en esta área"
                />
              </Card>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

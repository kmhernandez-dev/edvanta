import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight, BookOpen, CheckCircle2, ClipboardList, FileSignature, Layers, MessagesSquare,
  PackageCheck, Rocket, Sparkles, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import {
  Breadcrumb, Btn, Card, Faq, Section, SectionHeading, Steps,
} from '../../components/edvanta/ui';
import { HeroEditorial } from '../../components/edvanta/heroes';
import FormularioCapacitacion from '../../components/formularios/FormularioCapacitacion';
import {
  ENTREGABLES_GENERALES, PROCESO_PROPUESTA, areaPorSlug,
} from '../../data/edvanta/capacitacion';
import { PAQUETES, paquetePorSlug, paqueteTo } from '../../data/edvanta/servicios';
import { waLink } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';
import NotFound from '../NotFound';

const ICONOS_PROCESO = [MessagesSquare, ClipboardList, FileSignature, Rocket];
const ICONOS_PAQUETE = {
  'equipo-que-cuida': Users,
  'ruta-contigo': Sparkles,
  'biblioteca-contigo': BookOpen,
  'comunicacion-con-evidencia': PackageCheck,
};

export default function PaqueteInstitucional() {
  const { slug } = useParams();
  const paquete = paquetePorSlug(slug);

  useEffect(() => {
    if (!paquete) return;
    updatePageSeo({
      title: `${paquete.nombre} | Capacitación y servicios para instituciones | Edvanta`,
      description: `${paquete.lema}. ${paquete.necesidad}`,
      canonical: `https://edvanta.co${paqueteTo(paquete.slug)}`,
      image: `https://edvanta.co${paquete.imagen}`,
      keywords: [paquete.nombre, 'capacitación para instituciones', 'Edvanta'],
    });
  }, [paquete]);

  if (!paquete) return <NotFound />;

  const Icono = ICONOS_PAQUETE[paquete.slug] || Layers;
  const relacionados = (paquete.areasRelacionadas || []).map(areaPorSlug).filter(Boolean);
  const otros = PAQUETES.filter((p) => p.slug !== paquete.slug);

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
                { label: 'Paquetes', to: '/instituciones#paquetes' },
                { label: paquete.nombre },
              ]}
              className="mb-8"
            />
          )}
          eyebrow={paquete.destacado ? 'Formación de equipos' : 'Servicio complementario'}
          title={paquete.heroTitle || paquete.nombre}
          highlight={paquete.heroTitle?.includes(paquete.nombre) ? paquete.nombre : undefined}
          lead={paquete.heroLead || paquete.necesidad}
          image={paquete.imagen}
          imageAlt={paquete.imagenAlt}
          actions={(
            <>
              <Btn href="#solicitar-propuesta" size="lg" iconRight={ArrowRight}>Solicitar propuesta</Btn>
              <Btn href={waLink(`Hola, equipo Edvanta. Quiero conversar sobre ${paquete.nombre} para mi institución.`)} external variant="secondary" size="lg" icon={MessagesSquare}>
                Conversar primero
              </Btn>
            </>
          )}
          aside={[
            { icon: Icono, label: paquete.lema },
            { icon: Users, label: paquete.publico, to: '#destinatarios' },
            { icon: CheckCircle2, label: 'Qué incluye', to: '#incluye' },
          ]}
        />

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Por qué existe este paquete"
                title="La necesidad que atiende"
                desc={paquete.necesidad}
              />
              {paquete.intro && <p className="mt-5 text-base leading-8 text-edvanta-muted">{paquete.intro}</p>}
              <div className="mt-6 rounded-2xl border border-edvanta-border bg-edvanta-bg p-5">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">Resultado que busca habilitar</p>
                <p className="mt-2 text-sm leading-7 text-edvanta-deep">{paquete.resultado}</p>
              </div>
            </div>
            <Card id="destinatarios" className="scroll-mt-28">
              <h3 className="font-display text-xl font-extrabold text-edvanta-deep">A quién está dirigido</h3>
              <ul className="mt-4 space-y-2.5">
                {paquete.destinatarios.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{d}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-l-2 border-edvanta-violet/60 pl-3 text-xs leading-5 text-edvanta-muted">
                {paquete.publico}
              </p>
            </Card>
          </div>
        </Section>

        <Section id="incluye" tone="ice" bordered>
          <SectionHeading
            eyebrow="Alcance y entregables"
            title="Qué puede recibir la institución"
            desc={`El alcance y el valor se definen en la propuesta. ${paquete.alcance}`}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <Card>
              <h3 className="font-display text-xl font-extrabold text-edvanta-deep">Qué incluye</h3>
              <ul className="mt-4 space-y-3">
                {paquete.entregables.map((e) => (
                  <li key={e} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{e}
                  </li>
                ))}
              </ul>
              {paquete.aclaracion && (
                <p className="mt-5 border-l-2 border-edvanta-violet/60 pl-3 text-xs leading-5 text-edvanta-muted">{paquete.aclaracion}</p>
              )}
            </Card>
            <Card className="bg-edvanta-bg">
              <h3 className="font-display text-xl font-extrabold text-edvanta-deep">Modalidad</h3>
              <p className="mt-2 text-sm leading-6 text-edvanta-muted">{paquete.modalidad}</p>
              <h3 className="mt-6 font-display text-lg font-extrabold text-edvanta-deep">Entregables generales que se pueden sumar</h3>
              <ul className="mt-3 space-y-2">
                {ENTREGABLES_GENERALES.map((e) => (
                  <li key={e} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />{e}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-5 text-edvanta-muted">Se incluyen según el alcance acordado, no automáticamente.</p>
            </Card>
          </div>
        </Section>

        <Section tone="lavender" bordered>
          <SectionHeading
            eyebrow="Cómo se solicita"
            title="De la conversación a la propuesta"
            desc="No hay compromiso hasta que la institución reciba y revise la propuesta escrita."
          />
          <Steps
            className="mt-12"
            items={PROCESO_PROPUESTA.map((p, i) => ({ title: p.titulo, desc: p.desc, icon: ICONOS_PROCESO[i] }))}
          />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Btn href="#solicitar-propuesta" iconRight={ArrowRight}>Solicitar propuesta para este paquete</Btn>
            <Btn to="/instituciones#catalogo" variant="secondary" icon={Layers}>Explorar áreas de capacitación</Btn>
          </div>
        </Section>

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <SectionHeading eyebrow="Preguntas frecuentes" title={`Dudas sobre ${paquete.nombre}`} />
              <Faq items={paquete.faq} className="mt-8" />
            </div>
            <div>
              <SectionHeading eyebrow="Relacionado" title="Áreas que pueden complementarlo" />
              <ul className="mt-6 space-y-3">
                {relacionados.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/empresas/${a.slug}`} className="group flex items-start gap-3 rounded-xl border border-edvanta-border bg-white p-4 transition hover:border-edvanta-blue/40">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-edvanta-deep">{a.nombre}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-edvanta-muted">{a.resumen}</span>
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-edvanta-blue transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-edvanta-bg p-5">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-subtle">Otros paquetes</p>
                <ul className="mt-3 space-y-2">
                  {otros.map((p) => (
                    <li key={p.slug}>
                      <Link to={paqueteTo(p.slug)} className="text-sm font-semibold text-edvanta-blue underline-offset-4 hover:underline">{p.nombre}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <section id="solicitar-propuesta" className="scroll-mt-28">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
              <div>
                <SectionHeading
                  eyebrow="Solicitar propuesta"
                  title={`Cotiza ${paquete.nombre} para tu institución`}
                  desc="El paquete ya está seleccionado. Puedes agregar áreas o perfiles para que la propuesta refleje la necesidad completa de tu organización."
                />
                <p className="mt-6 rounded-2xl bg-edvanta-light/60 px-5 py-4 text-sm leading-6 text-edvanta-deep">
                  Paquete de origen: <strong>{paquete.nombre}</strong>. El formulario conserva esta selección.
                </p>
                <p className="mt-6 text-sm leading-6 text-edvanta-muted">
                  ¿Necesitas conocer otra alternativa? <Link to="/instituciones#paquetes" className="font-semibold text-edvanta-blue underline">Compara los paquetes</Link>.
                </p>
              </div>
              <Card>
                <FormularioCapacitacion
                  key={paquete.slug}
                  paqueteInicial={paquete.slug}
                  boton="Solicitar propuesta"
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

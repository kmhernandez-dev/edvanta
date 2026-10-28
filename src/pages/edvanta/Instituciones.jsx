import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, BarChart3, BookOpen, Building2, CheckCircle2, ClipboardList, Factory, FileSignature,
  FlaskConical, HeartPulse, Hospital, Layers, Megaphone, MessagesSquare, MonitorPlay, Pill,
  Rocket, ShieldCheck, Sparkles, Truck, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import {
  Breadcrumb, Btn, Card, Faq, Section, SectionHeading, Steps,
} from '../../components/edvanta/ui';
import { HeroCorporativo } from '../../components/edvanta/heroes';
import CatalogoCapacitacion from '../../components/edvanta/CatalogoCapacitacion';
import FormularioCapacitacion from '../../components/formularios/FormularioCapacitacion';
import {
  ENTREGABLES_GENERALES, MODALIDADES, ORGANIZACIONES, PREGUNTAS_GENERALES, PROCESO_PROPUESTA,
} from '../../data/edvanta/capacitacion';
import { PAQUETES, paquetePorSlug, paqueteTo } from '../../data/edvanta/servicios';
import { waLink } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';

const ICONOS_ORGANIZACION = {
  factory: Factory,
  truck: Truck,
  pill: Pill,
  flask: FlaskConical,
  hospital: Hospital,
  heart: HeartPulse,
  shield: ShieldCheck,
  megaphone: Megaphone,
  chart: BarChart3,
};

const ICONOS_MODALIDAD = {
  live: MonitorPlay,
  aula: BookOpen,
  mix: Layers,
  design: Sparkles,
};

const ICONOS_PROCESO = [MessagesSquare, ClipboardList, FileSignature, Rocket];

function PaqueteDestacado({ paquete, onCotizar }) {
  return (
    <article id={paquete.slug} className="ds-card scroll-mt-28 overflow-hidden lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="relative min-h-64 overflow-hidden bg-edvanta-bg">
        <img
          src={paquete.imagen}
          alt={paquete.imagenAlt}
          width="1200"
          height="900"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031D5C]/70 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-6 bottom-5">
          <span className="ds-chip ds-chip--glass">{paquete.lema}</span>
          <h3 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">{paquete.nombre}</h3>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">Formación de equipos</p>
        <p className="mt-2 text-base leading-7 text-edvanta-deep">{paquete.necesidad}</p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[.1em] text-edvanta-subtle">Para quién</dt>
            <dd className="mt-1 text-sm leading-6 text-edvanta-muted">{paquete.publico}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[.1em] text-edvanta-subtle">Modalidad</dt>
            <dd className="mt-1 text-sm leading-6 text-edvanta-muted">{paquete.modalidad}</dd>
          </div>
        </dl>
        <ul className="mt-5 space-y-2">
          {paquete.entregables.slice(0, 3).map((e) => (
            <li key={e} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{e}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Btn to={paqueteTo(paquete.slug)} variant="secondary" icon={ArrowRight} aria-label={`Conocer el paquete ${paquete.nombre}`}>Conocer el paquete</Btn>
          <Btn onClick={() => onCotizar(paquete.slug)} variant="primary" aria-label={`Cotizar ${paquete.nombre}`}>Cotizar este paquete</Btn>
        </div>
      </div>
    </article>
  );
}

function PaqueteComplementario({ paquete, onCotizar }) {
  return (
    <article id={paquete.slug} className="ds-card flex h-full scroll-mt-28 flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-edvanta-bg">
        <img
          src={paquete.imagen}
          alt={paquete.imagenAlt}
          width="1000"
          height="625"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="ds-chip ds-chip--glass absolute left-4 top-4">{paquete.lema}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-extrabold text-edvanta-deep">{paquete.nombre}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{paquete.necesidad}</p>
        <p className="mt-4 text-xs leading-5 text-edvanta-muted"><span className="font-bold text-edvanta-deep">Para: </span>{paquete.publico}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Btn to={paqueteTo(paquete.slug)} variant="secondary" size="sm" iconRight={ArrowRight} aria-label={`Conocer el paquete ${paquete.nombre}`}>Conocer el paquete</Btn>
          <Btn onClick={() => onCotizar(paquete.slug)} variant="primary" size="sm" aria-label={`Cotizar ${paquete.nombre}`}>Cotizar</Btn>
        </div>
      </div>
    </article>
  );
}

export default function Instituciones() {
  const [paquete, setPaquete] = useState('');
  const formulario = useRef(null);

  useEffect(() => updatePageSeo({
    title: 'Capacitación farmacéutica para empresas e instituciones | Edvanta',
    description: 'Propuestas de formación para laboratorios, distribuidores, farmacias, hospitales, clínicas e IPS. Combina áreas, perfiles y modalidades según las necesidades de tu equipo.',
    canonical: 'https://edvanta.co/instituciones',
  }), []);

  const irAlFormulario = () => formulario.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const solicitar = (slug) => {
    setPaquete(slug);
    requestAnimationFrame(irAlFormulario);
  };
  const enfocarAreas = () => {
    irAlFormulario();
    window.setTimeout(() => document.getElementById('areas-capacitacion')?.focus(), 450);
  };

  const elegido = paquetePorSlug(paquete);
  const destacado = PAQUETES.find((p) => p.destacado) || PAQUETES[0];
  const complementarios = PAQUETES.filter((p) => p.slug !== destacado.slug);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroCorporativo
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Capacitación para empresas e instituciones' }]} className="mb-8" />}
          eyebrow="Edvanta para organizaciones"
          title="Capacitación farmacéutica para empresas e instituciones"
          highlight="empresas e instituciones"
          lead="Diseñamos propuestas de formación para fortalecer las competencias de tus equipos, desde la atención y el uso seguro de medicamentos hasta el desarrollo, la producción y la calidad farmacéutica."
          image="/img/publicos/instituciones.webp"
          imageAlt="Presentación de resultados de formación ante el equipo directivo de una institución"
          services={PAQUETES.map((p) => ({
            icon: p.destacado ? Users : Building2,
            label: p.nombre,
            to: paqueteTo(p.slug),
          }))}
          sectors={[
            { icon: Factory, label: 'Laboratorios y fabricantes', desc: 'Desarrollo, producción, calidad y regulatorio' },
            { icon: Truck, label: 'Distribución y operación', desc: 'Almacenamiento, cadena de frío y trazabilidad' },
            { icon: Pill, label: 'Farmacias y droguerías', desc: 'Regentes, auxiliares y servicio farmacéutico' },
            { icon: Hospital, label: 'Hospitales, clínicas e IPS', desc: 'Farmacia hospitalaria, clínica y seguridad' },
          ]}
          actions={(
            <>
              <Btn href="#solicitar-propuesta" size="lg" iconRight={ArrowRight}>Solicitar propuesta</Btn>
              <Btn href="#catalogo" variant="secondary" size="lg" icon={Layers}>Explorar áreas de capacitación</Btn>
            </>
          )}
        />

        <Section tone="white">
          <SectionHeading
            eyebrow="A quién acompañamos"
            title="Una sola entrada para distintas realidades"
            desc="No necesitas elegir primero entre industria y asistencial. La propuesta se arma con las áreas y los perfiles que tu organización necesite."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ORGANIZACIONES.map((o) => {
              const Icono = ICONOS_ORGANIZACION[o.icono] || Building2;
              return (
                <article key={o.nombre} className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <span className="ds-icon-tile h-11 w-11"><Icono className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" /></span>
                  <h3 className="mt-4 text-base font-bold text-edvanta-deep">{o.nombre}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{o.desc}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-edvanta-bg p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-edvanta-deep">
              <span className="font-bold">¿Tu organización combina perfiles?</span> También. Una misma propuesta puede incluir formación para regentes, auxiliares, equipos técnicos y dirección.
            </p>
            <Btn href="#solicitar-propuesta" variant="secondary" icon={ArrowRight}>Solicitar propuesta</Btn>
          </div>
        </Section>

        <Section id="catalogo" tone="ice" bordered>
          <SectionHeading
            eyebrow="Catálogo de capacitación"
            title="Áreas para diseñar la formación de tu equipo"
            desc="Son líneas de formación, no cursos con fechas ni cupos publicados. Explora por perfil o por área técnica y marca las que quieras combinar."
          />
          <CatalogoCapacitacion />
        </Section>

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Propuestas combinadas"
                title="Un equipo, varias necesidades"
                desc="La misma organización puede necesitar actualizar a sus regentes, reforzar la dispensación de sus auxiliares y preparar a su equipo de calidad. No hace falta contratar procesos separados."
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn onClick={enfocarAreas} icon={Layers}>Agregar otra área</Btn>
                <Btn href="#solicitar-propuesta" variant="secondary" iconRight={ArrowRight}>Diseñar una propuesta combinada</Btn>
              </div>
            </div>
            <Card className="bg-edvanta-bg">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-subtle">Ejemplos de combinación</p>
              <ul className="mt-4 space-y-4">
                {[
                  ['Regentes + almacenamiento', 'Para ordenar la operación de varias sedes y la cadena de frío.'],
                  ['Producción + validaciones + calidad', 'Para alinear criterios técnicos antes de un cambio o una revisión interna.'],
                  ['Farmacia clínica + farmacovigilancia', 'Para fortalecer el seguimiento y la comunicación de seguridad en el equipo asistencial.'],
                ].map(([titulo, desc]) => (
                  <li key={titulo} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />
                    <span>
                      <span className="block text-[15px] font-bold text-edvanta-deep">{titulo}</span>
                      <span className="mt-0.5 block text-sm leading-6 text-edvanta-muted">{desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-l-2 border-edvanta-violet/60 pl-3 text-xs leading-5 text-edvanta-muted">
                Son ejemplos orientativos. El alcance de cada combinación se define con la organización.
              </p>
            </Card>
          </div>
        </Section>

        <Section tone="glow">
          <SectionHeading
            eyebrow="Modalidades y alcance"
            title="La formación se adapta a cómo trabaja tu equipo"
            desc="La modalidad, la intensidad y los entregables se acuerdan antes de empezar. No publicamos duraciones ni coberturas que no estén confirmadas para tu caso."
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
          <div className="mt-8 grid gap-5 rounded-2xl border border-edvanta-border bg-white p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <h3 className="font-display text-xl font-extrabold text-edvanta-deep">Qué puede recibir la organización</h3>
              <p className="mt-2 text-sm leading-6 text-edvanta-muted">Los entregables se ajustan al alcance. Estos son los que podemos incluir según la propuesta.</p>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {ENTREGABLES_GENERALES.map((e) => (
                <li key={e} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{e}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section tone="lavender" bordered>
          <SectionHeading
            eyebrow="Cómo se solicita"
            title="De la necesidad a una propuesta escrita"
            desc="Conversamos antes de cotizar. Así la propuesta responde a tu operación y no a un paquete genérico."
          />
          <Steps
            className="mt-12"
            items={PROCESO_PROPUESTA.map((p, i) => ({ title: p.titulo, desc: p.desc, icon: ICONOS_PROCESO[i] }))}
          />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Btn href="#solicitar-propuesta" iconRight={ArrowRight}>Solicitar propuesta</Btn>
            <Btn href={waLink('Hola, equipo Edvanta. Quiero conversar sobre una propuesta de capacitación para mi organización.')} external variant="secondary" icon={MessagesSquare}>
              Conversar por WhatsApp
            </Btn>
          </div>
        </Section>

        <Section id="paquetes" tone="white">
          <SectionHeading
            eyebrow="Paquetes y servicios"
            title="Formación de equipos y servicios complementarios"
            desc="Equipo que Cuida es la entrada principal para capacitar a un equipo. Los demás paquetes pueden complementar una propuesta cuando la organización también necesita educación para pacientes, acceso a recursos o materiales."
          />
          <div className="mt-10">
            <PaqueteDestacado paquete={destacado} onCotizar={solicitar} />
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {complementarios.map((p) => <PaqueteComplementario key={p.slug} paquete={p} onCotizar={solicitar} />)}
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-5 text-edvanta-muted">
            Los servicios complementarios no reemplazan la atención clínica ni las obligaciones de la institución. La aprobación de materiales y el cumplimiento de la normativa aplicable corresponden a la organización y al titular del producto.
          </p>
        </Section>

        <Section tone="ice" bordered>
          <SectionHeading
            eyebrow="Preguntas frecuentes"
            title="Lo que conviene saber antes de solicitar"
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <Faq items={PREGUNTAS_GENERALES} />
            <Card className="h-fit bg-white">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">Aula virtual</p>
              <h3 className="mt-2 font-display text-xl font-extrabold text-edvanta-deep">La plataforma ya está disponible</h3>
              <p className="mt-2 text-sm leading-6 text-edvanta-muted">
                Las cohortes cerradas y las licencias usan el aula virtual de Edvanta: cada participante tiene su cuenta y el avance queda registrado.
              </p>
              <Btn to="/aula" variant="secondary" icon={MonitorPlay} className="mt-5">Entrar al aula</Btn>
            </Card>
          </div>
        </Section>

        <section id="solicitar-propuesta" ref={formulario} className="scroll-mt-28">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
              <div>
                <SectionHeading
                  eyebrow="Solicitar propuesta"
                  title="Cuéntanos qué necesita tu organización"
                  desc="Con estos datos preparamos la primera conversación y una propuesta escrita. No necesitamos información de pacientes."
                />
                {elegido && (
                  <p className="mt-6 rounded-2xl bg-edvanta-light/60 px-5 py-4 text-sm leading-6 text-edvanta-deep">
                    Elegiste <strong>{elegido.nombre}</strong>: {elegido.lema.toLowerCase()}. Puedes cambiarlo o agregar áreas en el formulario.
                  </p>
                )}
                <ul className="mt-6 space-y-3 text-sm leading-6 text-edvanta-muted">
                  <li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />Puedes solicitar varias áreas y perfiles en una sola propuesta.</li>
                  <li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />No publicamos precios ni duración hasta conocer el alcance.</li>
                  <li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />Si falta algún dato, lo resolvemos en la conversación.</li>
                </ul>
                <p className="mt-6 text-sm leading-6 text-edvanta-muted">
                  ¿Prefieres conversar primero?{' '}
                  <a href={waLink('Hola, equipo Edvanta. Quiero conversar sobre una propuesta de capacitación para mi organización.')} target="_blank" rel="noopener noreferrer" className="font-semibold text-edvanta-blue underline">
                    Escríbenos por WhatsApp
                  </a>.
                </p>
              </div>
              <Card>
                <FormularioCapacitacion
                  key={paquete || 'sin-paquete'}
                  paqueteInicial={paquete || null}
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

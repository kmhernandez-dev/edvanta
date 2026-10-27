/**
 * ============================================================
 *  Instituciones.jsx — /instituciones
 *
 *  La puerta comercial para hospitales, IPS, EPS y empresas. No es
 *  otra escuela: reúne lo que todas ofrecen a una institución.
 *
 *  Reemplaza a /empresas y /empresas/capacitacion, que prometían
 *  cosas que el aula todavía no hace (exportar reportes a CSV y PDF,
 *  ver qué respondió cada persona, reasignar sola cuando cambia un
 *  contenido). Aquí solo se describe lo que existe.
 *
 *  Sin clientes, logos, testimonios ni cifras: no hay ninguno
 *  documentado todavía, y uno inventado es peor que ninguno.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Building2, ClipboardList, FileSignature, Factory, HeartHandshake, Hospital, Library, Megaphone,
  MessageCircle, MessagesSquare, MonitorPlay, Pill, Rocket, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import {
  Breadcrumb, Btn, Card, Faq, Section, SectionHeading, Steps,
} from '../../components/edvanta/ui';
import { HeroCorporativo } from '../../components/edvanta/heroes';
import { PaqueteCard } from '../../components/edvanta/oferta';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { OFERTAS_INSTITUCIONALES, PAQUETES, PROCEDIMIENTO, paquetePorSlug } from '../../data/edvanta/servicios';
import { waLink } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';

const PREGUNTAS = [
  {
    q: '¿Tienen precios publicados?',
    a: 'No. Cada propuesta se cotiza según el número de personas, los temas, la modalidad y el tiempo. Te la enviamos por escrito antes de que decidas.',
  },
  {
    q: '¿Los talleres para pacientes son consultas?',
    a: 'No. Son actividades educativas para que los pacientes y sus cuidadores entiendan su condición y su tratamiento. No reemplazan la atención clínica ni dan indicaciones individuales.',
  },
  {
    q: '¿Entregan constancias o certificados?',
    a: 'Cada participante queda con registro de asistencia y avance. Si tu institución necesita un documento adicional, lo definimos en la propuesta para que sepas exactamente qué recibirás.',
  },
  {
    q: '¿Dónde ocurre la formación?',
    a: 'En línea: sesiones en vivo por videollamada, cursos en el aula virtual de Edvanta o una combinación de ambos.',
  },
];

const ICONO_PAQUETE = {
  'equipo-que-cuida': Users,
  'ruta-contigo': HeartHandshake,
  'biblioteca-contigo': Library,
  'comunicacion-con-evidencia': Megaphone,
};
const PASOS_ICONOS = [ClipboardList, MessagesSquare, FileSignature, Rocket];

export default function Instituciones() {
  const [paquete, setPaquete] = useState('');
  const formulario = useRef(null);

  useEffect(() => updatePageSeo({
    title: 'Para instituciones | Formación y educación en salud | Edvanta',
    description: 'Formación para equipos, programas educativos para pacientes, licencias de acceso y materiales con evidencia para hospitales, IPS, EPS y empresas del sector farmacéutico.',
    canonical: 'https://edvanta.co/instituciones',
  }), []);

  const solicitar = (slug) => {
    setPaquete(slug);
    formulario.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const elegido = paquetePorSlug(paquete);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroCorporativo
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Para instituciones' }]} className="mb-8" />}
          eyebrow="Para instituciones"
          title="Formación y educación en salud para tu institución"
          highlight="para tu institución"
          lead="Hospitales, IPS, EPS y empresas del sector pueden contratar formación para sus equipos, programas educativos para sus pacientes, acceso a recursos y producción de materiales. Todo se arma bajo propuesta, según tu población y tus tiempos."
          image="/img/publicos/instituciones.webp"
          imageAlt="Presentación de resultados de formación ante el equipo directivo de una institución"
          services={PAQUETES.map((p) => ({ icon: ICONO_PAQUETE[p.slug] || Building2, label: p.nombre, to: `/instituciones#${p.slug}` }))}
          sectors={[
            { icon: Hospital, label: 'Hospitales y clínicas' },
            { icon: Building2, label: 'IPS y EPS' },
            { icon: Pill, label: 'Servicios farmacéuticos y droguerías' },
            { icon: Factory, label: 'Industria farmacéutica' },
          ]}
          actions={(
            <>
              <Btn href="#solicitar-propuesta" size="lg" iconRight={ArrowRight}>Solicitar propuesta</Btn>
              <Btn href={waLink('Hola, equipo Edvanta. Quiero conversar sobre mi institución.')} external variant="secondary" size="lg" icon={MessageCircle}>
                Conversar primero
              </Btn>
            </>
          )}
        />

        <Section tone="white">
          <SectionHeading
            eyebrow="Qué puedes contratar"
            title="De la necesidad al paquete"
            desc="Lo que una institución nos pide, y el paquete que lo resuelve. Toca uno para ver qué incluye."
          />
          <div className="mt-10 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
            {PAQUETES.map((p) => {
              const Icono = ICONO_PAQUETE[p.slug] || Building2;
              const necesidades = OFERTAS_INSTITUCIONALES.filter((o) => o.paquete === p.slug);
              return (
                <a key={p.slug} href={`#${p.slug}`} className="group flex flex-col border-t-2 border-edvanta-border pt-5 transition-colors hover:border-edvanta-blue">
                  <ul className="flex-1 space-y-2">
                    {necesidades.map((o) => (
                      <li key={o.nombre} className="flex items-start gap-2 text-[15px] leading-6 text-edvanta-muted">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />{o.nombre}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 flex items-center gap-3">
                    <span className="ds-icon-tile h-10 w-10 shrink-0"><Icono className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="font-display text-base font-extrabold text-edvanta-deep">{p.nombre}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-edvanta-blue transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
          </div>
        </Section>

        <Section tone="ice" bordered>
          <SectionHeading
            eyebrow="Paquetes"
            title="Cuatro formas de trabajar juntos"
            desc="Cada paquete dice qué necesidad atiende, a quién beneficia, qué se entrega y cómo. El alcance y el valor se definen en la propuesta."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {PAQUETES.map((p) => <PaqueteCard key={p.slug} paquete={p} onSolicitar={solicitar} />)}
          </div>
        </Section>

        <Section tone="glow">
          <SectionHeading eyebrow="Procedimiento" title="Cómo se pide una propuesta" desc="Cuatro pasos, sin compromiso hasta que tengas la propuesta escrita." />
          <Steps
            className="mt-12"
            items={PROCEDIMIENTO.map((desc, i) => ({ title: ['Nos cuentas', 'Conversamos', 'Propuesta escrita', 'Empezamos'][i], desc, icon: PASOS_ICONOS[i] }))}
          />
        </Section>

        <Section tone="lavender" bordered>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Aula virtual de Edvanta"
                title="La plataforma ya está incluida"
                desc="Las cohortes cerradas y las licencias usan el aula virtual de Edvanta: creamos una cuenta para cada participante, asignamos los cursos por grupo y el avance de cada persona queda registrado."
              />
              <Btn to="/aula" variant="secondary" icon={MonitorPlay} className="mt-6">Entrar al aula</Btn>
            </div>
            <Faq items={PREGUNTAS} />
          </div>
        </Section>

        <section id="solicitar-propuesta" ref={formulario} className="scroll-mt-28">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <div>
                <SectionHeading
                  eyebrow="Solicitar propuesta"
                  title="Cuéntanos qué necesita tu institución"
                  desc="Con estos datos preparamos la primera conversación. No necesitamos información de pacientes."
                />
                {elegido && (
                  <p className="mt-6 rounded-2xl bg-edvanta-light/60 px-5 py-4 text-sm text-edvanta-deep">
                    Elegiste <strong>{elegido.nombre}</strong>: {elegido.lema.toLowerCase()}. Puedes cambiarlo en el formulario.
                  </p>
                )}
                <p className="mt-6 text-sm leading-6 text-edvanta-muted">
                  ¿Prefieres conversar primero?{' '}
                  <a href={waLink('Hola, equipo Edvanta. Quiero conversar sobre mi institución.')} target="_blank" rel="noopener noreferrer" className="font-semibold text-edvanta-blue underline">
                    Escríbenos por WhatsApp
                  </a>.
                </p>
              </div>
              <Card>
                <FormularioSolicitud
                  key={paquete || 'sin-paquete'}
                  tipo="propuesta"
                  referencia={paquete || null}
                  paquetes={PAQUETES.map((p) => ({ slug: p.slug, nombre: `${p.nombre} · ${p.lema}` }))}
                  boton="Solicitar propuesta"
                  exito="Te escribiremos para agendar la primera conversación."
                  resumenWa={elegido ? `Quiero una propuesta de ${elegido.nombre} para mi institución.` : 'Quiero una propuesta para mi institución.'}
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

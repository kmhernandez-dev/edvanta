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
import { MessageCircle, MonitorPlay } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import {
  Breadcrumb, Btn, Card, Faq, LandingHero, Section, SectionHeading, Steps,
} from '../../components/edvanta/ui';
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
        <LandingHero
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Para instituciones' }]} className="mb-6" />}
          eyebrow="Para instituciones"
          title="Formación y educación en salud para tu institución"
          highlight="para tu institución"
          lead="Hospitales, IPS, EPS y empresas del sector pueden contratar formación para sus equipos, programas educativos para sus pacientes, acceso a recursos y producción de materiales. Todo se arma bajo propuesta, según tu población y tus tiempos."
          actions={(
            <>
              <Btn href="#solicitar-propuesta">Solicitar propuesta</Btn>
              <Btn href={waLink('Hola, equipo Edvanta. Quiero conversar sobre mi institución.')} external variant="secondary" icon={MessageCircle}>
                Conversar sobre mi institución
              </Btn>
            </>
          )}
        />

        <Section>
          <SectionHeading eyebrow="Qué puedes contratar" title="Lo que una institución nos pide" />
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {OFERTAS_INSTITUCIONALES.map((o) => (
              <li key={o.nombre}>
                <a href={`#${o.paquete}`} className="inline-flex min-h-10 items-center rounded-full border border-edvanta-border bg-white px-4 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue">
                  {o.nombre}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section tone="tint" bordered>
          <SectionHeading
            eyebrow="Paquetes"
            title="Cuatro formas de trabajar juntos"
            desc="Cada paquete dice qué necesidad atiende, a quién beneficia, qué se entrega y cómo. El alcance y el valor se definen en la propuesta."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {PAQUETES.map((p) => <PaqueteCard key={p.slug} paquete={p} onSolicitar={solicitar} />)}
          </div>
        </Section>

        <Section>
          <SectionHeading eyebrow="Procedimiento" title="Cómo se pide una propuesta" />
          <Steps
            className="mt-8"
            items={PROCEDIMIENTO.map((desc, i) => ({ title: ['Nos cuentas', 'Conversamos', 'Propuesta escrita', 'Empezamos'][i], desc }))}
          />
        </Section>

        <Section tone="tint" bordered>
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

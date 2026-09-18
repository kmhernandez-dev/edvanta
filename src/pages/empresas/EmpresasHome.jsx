/**
 * ============================================================
 *  /empresas — Edvanta para empresas (landing principal)
 *
 *  Es la puerta de entrada del público empresarial. Explica la
 *  propuesta completa y reparte hacia las landing de cada
 *  proceso: capacitar al equipo, reclutar talento y entrar al
 *  aula virtual. Aquí no hay formularios: cada proceso tiene su
 *  propia página.
 * ============================================================
 */

import { useEffect } from 'react';
import {
  BadgeCheck, BarChart3, Building2, ClipboardCheck, FileCheck2, GraduationCap,
  MessageCircle, MonitorPlay, ShieldCheck, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import {
  Btn, Card, CtaBanner, Faq, ImageSlot, LandingHero, NavCard, Section, SectionHeading, Stat, Steps,
} from '../../components/edvanta/ui';
import { EDVANTA_EMAIL, waLink } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';

const WA_EMPRESAS = waLink('Hola, equipo Edvanta. Soy de una empresa y quiero conocer la capacitación para nuestro equipo.');

const RUTAS = [
  {
    to: '/empresas/capacitacion',
    icon: GraduationCap,
    title: 'Capacitación para tu equipo',
    desc: 'Cursos propios de Edvanta y capacitaciones privadas de tu empresa, en un aula virtual con seguimiento de cada persona.',
    cta: 'Ver capacitación',
    tone: 'blue',
  },
  {
    to: '/empresas/talento',
    icon: Users,
    title: 'Recluta talento farmacéutico',
    desc: 'Directorio de químicos farmacéuticos por área, con habilidades, proyectos y artículos verificables.',
    cta: 'Buscar talento',
    tone: 'teal',
  },
  {
    to: '/aula',
    icon: MonitorPlay,
    title: 'Aula virtual',
    desc: 'Entra al aula de tu empresa: cursos asignados, avance por participante y constancias de formación.',
    cta: 'Entrar al aula',
    tone: 'violet',
  },
];

const PROBLEMAS = [
  { icon: ClipboardCheck, title: 'Inducción que se repite cada mes', desc: 'Deja la inducción grabada una vez: cada persona nueva la recibe asignada, con fecha límite y registro de quién la completó.' },
  { icon: FileCheck2, title: 'Capacitaciones sin evidencia', desc: 'Cada curso deja rastro: quién entró, cuánto avanzó, qué respondió y cuándo terminó. Listo para auditoría.' },
  { icon: ShieldCheck, title: 'Contenido disperso', desc: 'Procedimientos, videos, diapositivas y formatos en un solo lugar, con versiones y control de quién ve qué.' },
  { icon: BarChart3, title: 'Sin visibilidad del avance', desc: 'Tablero con el avance por grupo, por sede y por persona, con exportación a CSV y PDF.' },
];

const PASOS = [
  { title: 'Diagnóstico', desc: 'Revisamos qué necesita el equipo: inducción, normativa, producto, calidad o habilidades comerciales.' },
  { title: 'Armamos el plan', desc: 'Elegimos cursos del catálogo Edvanta y cargamos las capacitaciones propias de la empresa.' },
  { title: 'Tu aula virtual', desc: 'Creamos la empresa, los grupos y las cuentas. Cada persona recibe su acceso por correo.' },
  { title: 'Seguimiento', desc: 'Reportes de avance y cumplimiento. Reasignación automática cuando el contenido se actualiza.' },
];

const FAQS = [
  { q: '¿Se pueden subir nuestros propios videos y diapositivas?', a: 'Sí. El aula acepta videos, presentaciones, PDF, imágenes, audio y documentos, con archivos de hasta 8 GB por pieza. También se pueden incrustar videos de YouTube o Vimeo y presentaciones de Google Slides o Canva.' },
  { q: '¿El contenido de nuestra empresa queda separado del resto?', a: 'Sí. Las capacitaciones privadas solo se pueden asignar a personas y grupos de esa empresa, y los datos de una empresa nunca se muestran a otra.' },
  { q: '¿Cómo entran los participantes?', a: 'Cada persona recibe una invitación por correo, crea su contraseña y entra a su aula. No necesita instalar nada y funciona desde el celular.' },
  { q: '¿Se puede importar la lista de participantes?', a: 'Sí, con un archivo CSV. También se pueden agregar de a uno y organizar por grupos, sedes o cohortes.' },
  { q: '¿Qué pasa cuando actualizamos un contenido?', a: 'Se publica una versión nueva. Quien no ha empezado recibe la última versión; a quien está en curso se le reasigna solo si marcas la actualización como obligatoria. Todo queda en la bitácora.' },
];

export default function EmpresasHome() {
  useEffect(() => {
    updatePageSeo({
      title: 'Edvanta para empresas | Capacitación y talento farmacéutico',
      description: 'Capacita a tu equipo en un aula virtual propia y encuentra químicos farmacéuticos por área. Formación, evidencias y talento para empresas del sector.',
      canonical: 'https://edvanta.co/empresas',
      jsonLdId: 'empresas',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Edvanta para empresas',
        serviceType: 'Capacitación empresarial y reclutamiento farmacéutico',
        provider: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
        url: 'https://edvanta.co/empresas',
      },
    });
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <LandingHero
          eyebrow="Edvanta para empresas"
          title="Forma a tu equipo y encuentra al talento que te falta"
          lead="Una sola plataforma para capacitar al personal del sector farmacéutico con evidencias auditables y para llegar a los profesionales mejor preparados del país."
          bullets={[
            'Aula virtual con tu marca y tus contenidos',
            'Videos, diapositivas y documentos de hasta 8 GB',
            'Avance por persona, grupo y sede',
            'Directorio de talento clasificado por área',
          ]}
          actions={(
            <>
              <Btn to="/empresas/capacitacion" icon={GraduationCap}>Ver capacitación</Btn>
              <Btn to="/empresas/talento" variant="secondary" icon={Users}>Buscar talento</Btn>
              <Btn href={WA_EMPRESAS} external variant="ghost" icon={MessageCircle}>Hablar con el equipo</Btn>
            </>
          )}
          media={(
            <ImageSlot
              ratio="photo"
              priority
              label="Foto del equipo en capacitación"
              hint="Horizontal 4:3, mínimo 1200 × 900 px. Personas reales del sector farmacéutico en una sala o planta."
            />
          )}
        />

        {/* Tres procesos, tres landing */}
        <Section>
          <SectionHeading
            eyebrow="Por dónde empezar"
            title="Elige el proceso que necesitas resolver"
            desc="Cada uno tiene su propia página con el detalle completo, los precios y el paso siguiente."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {RUTAS.map((r) => <NavCard key={r.to} {...r} />)}
          </div>
        </Section>

        {/* Qué resolvemos */}
        <Section tone="surface" bordered>
          <SectionHeading
            eyebrow="Qué resolvemos"
            title="Lo que hoy le cuesta tiempo a tu equipo"
            desc="Problemas concretos de las áreas de calidad, talento humano y operaciones en el sector farmacéutico."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {PROBLEMAS.map((p) => (
              <Card key={p.title} hover className="flex gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue">
                  <p.icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-bold text-edvanta-deep">{p.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{p.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Cómo funciona */}
        <Section>
          <SectionHeading eyebrow="Cómo funciona" title="De la primera reunión al primer reporte" />
          <Steps className="mt-8" items={PASOS} />
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)] lg:items-center">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat value="8 GB" label="Por archivo: videos largos y presentaciones pesadas sin recortes" />
              <Stat value="15 tipos" label="De contenido: video, diapositivas, PDF, lectura, evaluación y más" />
              <Stat value="100 %" label="Del avance con registro: quién, cuándo y cuánto" />
            </div>
            <ImageSlot
              ratio="wide"
              label="Captura del aula virtual"
              hint="Pantalla del panel de avance o de una clase con video. 1600 × 900 px."
            />
          </div>
        </Section>

        {/* Aula virtual */}
        <Section tone="surface" bordered>
          <div className="gap-10 lg:grid lg:grid-cols-[minmax(0,44%)_minmax(0,1fr)] lg:items-center">
            <ImageSlot
              ratio="photo"
              label="Aula virtual en un computador y un celular"
              hint="Montaje del aula abierta en dos dispositivos. 1200 × 900 px."
            />
            <div className="mt-8 lg:mt-0">
              <SectionHeading
                eyebrow="Aula virtual incluida"
                title="Tu propia aula, sin instalar nada"
                desc="El aula es parte del servicio: creamos tu empresa, tus grupos y las cuentas de cada participante."
              />
              <ul className="mt-6 space-y-3">
                {[
                  'Cursos propios de Edvanta y capacitaciones privadas de tu empresa.',
                  'Clases con video, diapositivas, lecturas, descargas y recursos de trabajo.',
                  'Estados claros: invitado, en progreso, completado, vencido o no aprobado.',
                  'Reportes y expediente por persona, exportables a CSV y PDF.',
                  'Bitácora de cambios: quién publicó, quién asignó y quién calificó.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[15px] leading-7 text-edvanta-deep">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Btn to="/empresas/capacitacion">Ver todo lo que incluye</Btn>
                <Btn to="/aula" variant="secondary" icon={MonitorPlay}>Entrar al aula</Btn>
              </div>
            </div>
          </div>
        </Section>

        {/* Confianza */}
        <Section>
          <SectionHeading
            eyebrow="Con quién trabajamos"
            title="Empresas del sector farmacéutico y de la salud"
            desc="Laboratorios, distribuidoras, droguerías, IPS y servicios farmacéuticos que necesitan formar y demostrar que formaron."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {['Logo de empresa aliada 1', 'Logo de empresa aliada 2', 'Logo de empresa aliada 3', 'Logo de empresa aliada 4'].map((l) => (
              <ImageSlot key={l} ratio="wide" rounded="rounded-xl" label={l} hint="PNG con fondo transparente, 480 × 270 px." />
            ))}
          </div>
          <p className="mt-4 text-xs text-edvanta-subtle">
            Los espacios de logotipos se publican únicamente con autorización escrita de cada empresa.
          </p>
        </Section>

        {/* Preguntas */}
        <Section tone="surface" bordered>
          <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que preguntan las empresas antes de empezar" />
          <Faq className="mt-8" items={FAQS} />
        </Section>

        <CtaBanner
          eyebrow="Siguiente paso"
          title="Cuéntanos qué necesita tu equipo"
          desc="Escríbenos y armamos una propuesta con el plan de formación, el aula y los tiempos. Sin compromiso."
          actions={(
            <>
              <Btn href={WA_EMPRESAS} external variant="white" icon={MessageCircle}>Escribir por WhatsApp</Btn>
              <Btn href={`mailto:${EDVANTA_EMAIL}?subject=Capacitaci%C3%B3n%20empresarial%20Edvanta`} variant="outlineWhite" icon={Building2}>
                Enviar un correo
              </Btn>
            </>
          )}
        />
      </main>
      <SiteFooter />
    </>
  );
}

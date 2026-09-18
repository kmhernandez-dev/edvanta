/**
 * ============================================================
 *  /talento — Vitrina de talento (lado del profesional)
 *
 *  Landing del proceso «que me encuentren». Publica tus logros y
 *  espera a que un cazatalento te contacte. El perfil básico es
 *  gratuito; el destacado tiene costo (ver src/config/precios.js).
 *
 *  El lado de la empresa vive en /empresas/talento.
 * ============================================================
 */

import { useEffect } from 'react';
import {
  Award, BadgeCheck, Building2, Check, Eye, FileText, MessageCircle, Sparkles, Star, Users,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import {
  ArrowLink, Btn, Card, CtaBanner, Faq, ImageSlot, LandingHero, Section, SectionHeading, Steps,
} from '../components/edvanta/ui';
import { TalentPublishForm } from '../components/edvanta/talento';
import { VITRINA_TALENTO } from '../config/precios';
import { waLink } from '../config/links';
import { updatePageSeo } from '../utils/seo';

const WA_DESTACAR = waLink(`Hola, equipo Edvanta. Quiero destacar mi perfil en la vitrina de talento (${VITRINA_TALENTO.etiqueta} por ${VITRINA_TALENTO.vigencia}).`);

const PASOS = [
  { title: 'Arma tu perfil', desc: 'Nombre, área, título y lo que sabes hacer. Toma menos de diez minutos.' },
  { title: 'Suma tus logros', desc: 'Proyectos, validaciones, artículos y resultados con números.' },
  { title: 'Publicamos tu perfil', desc: 'El equipo lo revisa y queda visible para las empresas del sector.' },
  { title: 'Te contactan', desc: 'Las empresas escriben al correo o WhatsApp que dejaste publicado.' },
];

const BASICO = [
  'Perfil en el directorio que consultan las empresas',
  'Filtro por tu área de especialización',
  'Habilidades, proyectos y artículos',
  'Contacto directo contigo',
];

const DESTACADO = [
  'Todo lo del perfil básico',
  'Insignia de perfil destacado y posición preferente en el directorio',
  'Tu perfil entra en la lista que enviamos a las empresas que buscan talento',
  'Espacio para portafolio, certificados y una foto profesional',
  'Prioridad cuando llega una vacante de tu área',
  `Vigencia de ${VITRINA_TALENTO.vigencia}`,
];

const FAQS = [
  { q: '¿Publicar mi perfil tiene costo?', a: 'No. El perfil básico en el directorio es gratuito y lo puede publicar cualquier profesional del sector. El costo es solo del perfil destacado.' },
  { q: '¿Qué gana el perfil destacado?', a: 'Aparece primero en el directorio, lleva la insignia de destacado y entra en la lista de candidatos que enviamos a las empresas que nos escriben buscando talento.' },
  { q: '¿Cómo pago?', a: 'Escríbenos por WhatsApp y te enviamos el enlace de pago. Cuando se confirma, activamos el destacado en tu perfil.' },
  { q: '¿Me garantizan que me contraten?', a: 'No. Lo que hacemos es que tu perfil llegue a las empresas del sector; la decisión de contratación siempre es de ellas.' },
  { q: '¿Puedo cambiar mi perfil después?', a: 'Sí. Escríbenos con los cambios y actualizamos la información publicada.' },
  { q: '¿Qué datos no debo publicar?', a: 'No publiques documentos de identidad, datos de pacientes ni información confidencial de tu empresa. Solo tu experiencia profesional y tus formas de contacto.' },
];

export default function TalentoVitrina() {
  useEffect(() => {
    updatePageSeo({
      title: 'Vitrina de talento farmacéutico | Publica tus logros | Edvanta',
      description: 'Publica tus logros profesionales y espera a que un cazatalento te contacte. Perfil básico gratuito y perfil destacado para llegar antes a las empresas.',
      canonical: 'https://edvanta.co/talento',
      jsonLdId: 'talento',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Vitrina de talento farmacéutico',
        url: 'https://edvanta.co/talento',
      },
    });
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <LandingHero
          eyebrow="Vitrina de talento"
          title="Publica tus logros y espera a que un cazatalento te contacte"
          lead="Las empresas del sector farmacéutico buscan aquí a quién contratar. Deja tu perfil listo, con lo que sabes hacer y lo que has logrado."
          bullets={[
            'Perfil básico gratuito',
            'Te encuentran por tu área y tus habilidades',
            'Contacto directo, sin intermediarios',
            'Destacado desde ' + VITRINA_TALENTO.etiqueta,
          ]}
          actions={(
            <>
              <Btn href="#publicar" icon={Sparkles}>Publicar mi perfil gratis</Btn>
              <Btn href="#planes" variant="secondary" icon={Star}>Ver el perfil destacado</Btn>
            </>
          )}
          media={(
            <ImageSlot
              ratio="photo"
              priority
              label="Profesional farmacéutica mostrando su portafolio"
              hint="Foto 4:3, mínimo 1200 × 900 px. Puede ser un retrato profesional sobre fondo claro."
            />
          )}
        />

        {/* Cómo funciona */}
        <Section>
          <SectionHeading eyebrow="Cómo funciona" title="De tu perfil a la primera llamada" />
          <Steps className="mt-8" items={PASOS} />
        </Section>

        {/* Planes */}
        <Section id="planes" tone="surface" bordered>
          <SectionHeading
            eyebrow="Planes"
            title="Publica gratis o destaca tu perfil"
            desc="El directorio es abierto. El destacado es para quien quiere llegar antes a las empresas que están contratando."
            align="center"
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <Card className="flex flex-col">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">Perfil básico</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-edvanta-deep">Gratis</p>
              <p className="mt-1 text-sm text-edvanta-muted">Para siempre, con revisión del equipo.</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {BASICO.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-teal" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <Btn href="#publicar" variant="secondary" className="mt-6 w-full">Publicar mi perfil</Btn>
            </Card>

            <Card className="relative flex flex-col border-edvanta-blue/40 ring-1 ring-edvanta-blue/20">
              <span className="absolute -top-3 left-6 rounded-full bg-edvanta-blue px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                Recomendado
              </span>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">Perfil destacado</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-edvanta-deep">
                {VITRINA_TALENTO.etiqueta}
                <span className="ml-2 align-middle text-sm font-semibold text-edvanta-muted">/ {VITRINA_TALENTO.vigencia}</span>
              </p>
              <p className="mt-1 text-sm text-edvanta-muted">Pago único. Sin renovación automática.</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {DESTACADO.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-teal" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <Btn href={WA_DESTACAR} external className="mt-6 w-full" icon={Star}>Quiero destacar mi perfil</Btn>
              <p className="mt-3 text-center text-xs text-edvanta-muted">Te enviamos el enlace de pago por WhatsApp.</p>
            </Card>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-6 text-edvanta-subtle">
            El perfil destacado aumenta la visibilidad de tu perfil ante las empresas. No es una bolsa de empleo ni
            garantiza una contratación: la decisión siempre es de la empresa.
          </p>
        </Section>

        {/* Formulario */}
        <Section id="publicar">
          <SectionHeading
            eyebrow="Tu perfil"
            title="Arma tu vitrina profesional"
            desc="Escribe lo que sabes hacer y lo que has logrado. A la derecha ves, en vivo, cómo te verán las empresas."
          />
          <div className="mt-8">
            <TalentPublishForm
              titulo="Publica tus logros"
              descripcion="Habla de resultados: qué validaste, qué registraste, qué mejoraste y con qué números. Eso es lo que buscan las empresas."
            />
          </div>
        </Section>

        {/* Qué poner */}
        <Section tone="surface" bordered>
          <div className="gap-10 lg:grid lg:grid-cols-[minmax(0,44%)_minmax(0,1fr)] lg:items-center">
            <ImageSlot
              ratio="photo"
              label="Ejemplo de un perfil destacado"
              hint="Captura del perfil publicado con la insignia de destacado. 1200 × 900 px."
            />
            <div className="mt-8 lg:mt-0">
              <SectionHeading eyebrow="Consejos" title="Qué hace que una empresa te escriba" />
              <ul className="mt-6 space-y-3">
                {[
                  'Un título claro: el cargo que buscas, no solo tu profesión.',
                  'Logros con números: “reduje 30 % las desviaciones”, “renové 12 registros sanitarios”.',
                  'Habilidades específicas del sector: BPM, ICSR, validación, INVIMA, HPLC.',
                  'Enlaces reales: LinkedIn, portafolio o artículos publicados.',
                  'Disponibilidad honesta: cuándo puedes empezar y en qué modalidad.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[15px] leading-7 text-edvanta-deep">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Btn to="/hoja-de-vida" variant="secondary" icon={FileText}>Mejorar mi hoja de vida</Btn>
                <Btn to="/linkedin" variant="ghost" icon={Users}>Optimizar mi LinkedIn</Btn>
              </div>
            </div>
          </div>
        </Section>

        {/* Complementos */}
        <Section>
          <SectionHeading eyebrow="Y además" title="Lo que te ayuda a que te elijan" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card hover>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue">
                <Award className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-bold text-edvanta-deep">Fórmate en tu área</p>
              <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">Cursos y rutas por cargo para cubrir lo que hoy te falta.</p>
              <ArrowLink to="/rutas" className="mt-4">Ver rutas</ArrowLink>
            </Card>
            <Card hover>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-mint text-edvanta-tealdark">
                <Eye className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-bold text-edvanta-deep">Revisa las vacantes abiertas</p>
              <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">Ofertas para químicos farmacéuticos con postulación directa.</p>
              <ArrowLink to="/empleo/ofertas-qf" className="mt-4">Ver ofertas</ArrowLink>
            </Card>
            <Card hover>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-lilac text-[#5E51A8]">
                <Building2 className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-bold text-edvanta-deep">¿Vienes de una empresa?</p>
              <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">Busca talento en el directorio y publica tu vacante gratis.</p>
              <ArrowLink to="/empresas/talento" className="mt-4">Entrar como empresa</ArrowLink>
            </Card>
          </div>
        </Section>

        {/* Preguntas */}
        <Section tone="surface" bordered>
          <SectionHeading eyebrow="Preguntas frecuentes" title="Todo lo que preguntan antes de publicar" />
          <Faq className="mt-8" items={FAQS} />
        </Section>

        <CtaBanner
          eyebrow="Tu turno"
          title="Que tu próximo trabajo te encuentre a ti"
          desc="Publica tu perfil hoy; si quieres llegar antes a las empresas que están contratando, destácalo."
          actions={(
            <>
              <Btn href="#publicar" variant="white" icon={Sparkles}>Publicar mi perfil gratis</Btn>
              <Btn href={WA_DESTACAR} external variant="outlineWhite" icon={MessageCircle}>Destacar mi perfil</Btn>
            </>
          )}
        />
      </main>
      <SiteFooter />
    </>
  );
}

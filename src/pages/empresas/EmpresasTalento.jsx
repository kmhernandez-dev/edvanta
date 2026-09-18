/**
 * ============================================================
 *  /empresas/talento — Reclutamiento de talento farmacéutico
 *
 *  Landing del proceso «contratar». Público: empresas que buscan
 *  químicos farmacéuticos. Aquí se busca en el directorio y se
 *  publica una vacante; el lado del profesional vive en /talento.
 * ============================================================
 */

import { useEffect, useState } from 'react';
import {
  Award, BadgeCheck, Building2, ClipboardList, FileSearch, MessageCircle,
  Search, Sparkles, Target, UserRound, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import {
  ArrowLink, Breadcrumb, Btn, Card, CtaBanner, Faq, ImageSlot, LandingHero, Section, SectionHeading, Stat, Steps,
} from '../../components/edvanta/ui';
import { TalentDirectory } from '../../components/edvanta/talento';
import PublicarVacanteForm from '../../components/edvanta/vacantes';
import { areasTalento, datosPerfilTalento } from '../../data/careerHub';
import { EDVANTA_EMAIL, waLink } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';

const WA = waLink('Hola, equipo Edvanta. Estamos buscando talento farmacéutico para nuestra empresa.');

const VENTAJAS = [
  { icon: Award, title: 'Formados por Edvanta', desc: 'Son profesionales que estudian en la plataforma: cursos, rutas por cargo y capacitaciones con evidencia de lo que completaron.' },
  { icon: Target, title: 'Clasificados por área', desc: 'Calidad, regulatorio, farmacovigilancia, clínico, comercial, producción: filtras por lo que necesitas de verdad.' },
  { icon: FileSearch, title: 'Perfiles con sustento', desc: 'Cada perfil muestra habilidades, proyectos y artículos científicos, no solo un título.' },
  { icon: ClipboardList, title: 'Contacto directo', desc: 'Sin intermediarios: escribes a la persona por el canal que dejó publicado.' },
];

const PASOS = [
  { title: 'Filtra por área', desc: 'Elige el área y escribe la habilidad que buscas.' },
  { title: 'Revisa los perfiles', desc: 'Compara habilidades, proyectos y disponibilidad.' },
  { title: 'Escribe a quien encaje', desc: 'Contacto directo por el medio que la persona publicó.' },
  { title: 'Publica tu vacante', desc: 'Y déjala en el banco para que lleguen más postulaciones.' },
];

const FAQS = [
  { q: '¿Tiene costo para la empresa?', a: 'Buscar en el directorio y publicar una vacante en el banco de la comunidad no tiene costo. Si necesitas que hagamos la preselección o una búsqueda dirigida, escríbenos y lo cotizamos.' },
  { q: '¿Los perfiles están verificados?', a: 'Cada perfil pasa por revisión del equipo antes de publicarse. La información profesional la declara la persona y puedes confirmarla en la entrevista.' },
  { q: '¿Puedo pedir un perfil que no aparece?', a: 'Sí. Escríbenos con el cargo y el área; difundimos la vacante en la comunidad y te avisamos cuando haya candidatos.' },
  { q: '¿Pueden capacitar al que contratemos?', a: 'Sí: la inducción y la formación técnica se pueden montar en el aula virtual de tu empresa.' },
];

export default function EmpresasTalento() {
  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Recluta talento farmacéutico | Edvanta para empresas',
      description: 'Encuentra químicos farmacéuticos por área: calidad, regulatorio, farmacovigilancia, clínico y comercial. Perfiles con habilidades, proyectos y artículos.',
      canonical: 'https://edvanta.co/empresas/talento',
      jsonLdId: 'empresas-talento',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Talento farmacéutico Edvanta',
        url: 'https://edvanta.co/empresas/talento',
      },
    });
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <LandingHero
          tone="dark"
          breadcrumb={<Breadcrumb tone="dark" className="mb-6" items={[{ label: 'Empresas', to: '/empresas' }, { label: 'Buscar talento' }]} />}
          eyebrow="Reclutamiento farmacéutico"
          title="Recluta los mejores talentos para tu empresa"
          lead="Los profesionales mejor capacitados por Edvanta, la mejor empresa de educación para químicos farmacéuticos."
          bullets={[
            'Directorio clasificado por área de especialización',
            'Habilidades, proyectos y artículos en cada perfil',
            'Contacto directo, sin intermediarios',
            'Publica tu vacante gratis en el banco de la comunidad',
          ]}
          actions={(
            <>
              <Btn href="#directorio" variant="white" icon={Search}>Buscar talento ahora</Btn>
              <Btn onClick={() => setPublicando(true)} variant="outlineWhite" icon={ClipboardList}>Publicar una vacante</Btn>
            </>
          )}
          media={(
            <ImageSlot
              ratio="photo"
              priority
              label="Profesional farmacéutico en su puesto de trabajo"
              hint="Foto 4:3, mínimo 1200 × 900 px: laboratorio, planta o farmacia hospitalaria, con buena luz."
            />
          )}
        />

        {/* Por qué este talento */}
        <Section>
          <SectionHeading
            eyebrow="Por qué aquí"
            title="Talento que ya está estudiando lo que tu empresa necesita"
            desc="En Edvanta se forman en calidad, asuntos regulatorios, farmacovigilancia, atención farmacéutica y habilidades comerciales del sector."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {VENTAJAS.map((v) => (
              <Card key={v.title} hover className="flex gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue">
                  <v.icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-bold text-edvanta-deep">{v.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{v.desc}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat value={`${areasTalento.length}`} label="Áreas de especialización para filtrar" />
            <Stat value="Directo" label="Contacto con la persona, sin comisiones" />
            <Stat value="Gratis" label="Publicar tu vacante en el banco de la comunidad" />
          </div>
        </Section>

        {/* Directorio */}
        <Section id="directorio" tone="surface" bordered>
          <SectionHeading
            eyebrow="Directorio"
            title="Busca por área, cargo o habilidad"
            desc="Los perfiles se publican tras la revisión del equipo. Escribe directamente a quien encaje con la vacante."
          />
          <div className="mt-8">
            <TalentDirectory
              onPublicar={(
                <ArrowLink href="#vacante" onClick={() => setPublicando(true)}>Publicar una vacante</ArrowLink>
              )}
            />
          </div>
        </Section>

        {/* Cómo funciona */}
        <Section>
          <SectionHeading eyebrow="Cómo funciona" title="Del filtro a la entrevista" />
          <Steps className="mt-8" items={PASOS} />
        </Section>

        {/* Publicar vacante */}
        <Section id="vacante" tone="surface" bordered>
          <div className="gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,40%)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Banco de vacantes"
                title="Publica tu vacante y que te lleguen las postulaciones"
                desc="Queda con la plantilla estándar del banco, visible para toda la comunidad de químicos farmacéuticos."
              />
              <div className="mt-8">
                {publicando ? (
                  <PublicarVacanteForm />
                ) : (
                  <Card>
                    <p className="text-base font-bold text-edvanta-deep">¿Tienes una vacante abierta?</p>
                    <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">
                      Publícala gratis: cargo, ciudad, modalidad, requisitos y el contacto al que deben escribir.
                    </p>
                    <Btn className="mt-5" onClick={() => setPublicando(true)} icon={ClipboardList}>Publicar la vacante</Btn>
                  </Card>
                )}
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <ImageSlot
                ratio="portrait"
                label="Equipo de selección revisando perfiles"
                hint="Foto vertical 3:4, mínimo 900 × 1200 px."
              />
            </div>
          </div>
        </Section>

        {/* Qué contiene un perfil */}
        <Section>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-edvanta-blue" aria-hidden="true" />
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Qué contiene cada perfil profesional</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-edvanta-muted">{datosPerfilTalento.intro}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {datosPerfilTalento.campos.map((campo) => (
              <div key={campo} className="flex items-center gap-2 rounded-xl border border-edvanta-border bg-white p-4">
                <BadgeCheck className="h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />
                <span className="text-sm font-bold text-edvanta-deep">{campo}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Preguntas */}
        <Section tone="surface" bordered>
          <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de contratar" />
          <Faq className="mt-8" items={FAQS} />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Card hover>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-mint text-edvanta-tealdark">
                <Users className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-bold text-edvanta-deep">¿Ya contrataste? Capacítalo</p>
              <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">Monta la inducción y la formación técnica en el aula virtual de tu empresa.</p>
              <ArrowLink to="/empresas/capacitacion" className="mt-4">Ver capacitación</ArrowLink>
            </Card>
            <Card hover>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-lilac text-[#5E51A8]">
                <UserRound className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-bold text-edvanta-deep">¿Eres profesional y quieres aparecer aquí?</p>
              <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">Publica tus logros en la vitrina de talento y espera a que un cazatalento te contacte.</p>
              <ArrowLink to="/talento" className="mt-4">Ir a la vitrina de talento</ArrowLink>
            </Card>
          </div>
        </Section>

        <CtaBanner
          eyebrow="¿Buscas un perfil específico?"
          title="Cuéntanos qué cargo necesitas cubrir"
          desc="Difundimos la vacante en la comunidad y te avisamos cuando haya candidatos que encajen."
          actions={(
            <>
              <Btn href={WA} external variant="white" icon={MessageCircle}>Escribir por WhatsApp</Btn>
              <Btn href={`mailto:${EDVANTA_EMAIL}?subject=B%C3%BAsqueda%20de%20talento%20farmac%C3%A9utico`} variant="outlineWhite" icon={Building2}>
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

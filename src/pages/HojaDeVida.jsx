/**
 * ============================================================
 *  /hoja-de-vida — Hoja de vida ATS + IA
 *
 *  Landing propia del proceso «armar mi hoja de vida». Antes
 *  vivía dentro de /empleo como una sección; ahora tiene su
 *  página, con la herramienta completa y sin nada que compita
 *  por la atención.
 * ============================================================
 */

import { useEffect } from 'react';
import {
  BadgeCheck, Bot, Braces, Download, FileText, Gauge, Mail, Search, Sparkles, Target,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import CvBuilder from '../components/empleo/CvBuilder';
import { MuestraPlantillas } from '../components/empleo/plantillasUi';
import {
  ArrowLink, Breadcrumb, Btn, Card, CtaBanner, Faq, ImageSlot, LandingHero, Section, SectionHeading, Steps,
} from '../components/edvanta/ui';
import { updatePageSeo } from '../utils/seo';

const PASOS = [
  { title: 'Tus datos', desc: 'Nombre, contacto y el cargo al que apuntas. Un minuto.' },
  { title: 'Tu experiencia', desc: 'Fechas con selector y logros sugeridos para tu cargo: solo ajustas los datos.' },
  { title: 'Estudios y habilidades', desc: 'Habilidades del sector con un clic y tus estudios en una línea.' },
  { title: 'Diseño y descarga', desc: 'Escribimos tu perfil, eliges entre 9 diseños y descargas el PDF.' },
];

const QUE_REVISA = [
  { icon: Gauge, title: 'Puntaje de compatibilidad', desc: 'Una nota clara de qué tan legible es tu hoja de vida para los filtros automáticos, con los puntos a corregir.' },
  { icon: Target, title: 'Palabras clave del cargo', desc: 'Compara tu texto con el cargo objetivo y te muestra los términos que te faltan.' },
  { icon: Braces, title: 'Estructura ATS', desc: 'Secciones en el orden que esperan los sistemas: datos, perfil, experiencia, formación y habilidades.' },
  { icon: Bot, title: 'Lectura con IA', desc: 'La preselección con IA lee logros medibles. La herramienta te avisa cuando una frase no dice ningún resultado.' },
];

const ERRORES = [
  'Diseño en columnas o con tablas: los filtros lo leen desordenado.',
  'Foto, edad y documento de identidad: ocupan espacio y no suman.',
  'Frases de funciones sin resultado: “apoyé procesos” no dice nada.',
  'PDF exportado como imagen: el sistema no puede leer el texto.',
  'El mismo documento para todas las vacantes, sin adaptar el cargo.',
];

const FAQS = [
  { q: '¿Qué es un ATS y por qué importa?', a: 'Es el sistema que usan las empresas para recibir y filtrar hojas de vida. Si el archivo no se puede leer bien, la hoja de vida no llega a una persona. Por eso el formato importa tanto como el contenido.' },
  { q: '¿Mis datos se guardan?', a: 'La hoja de vida se guarda en tu navegador mientras la editas. Si inicias sesión, puedes guardarla en tu cuenta para retomarla desde otro dispositivo.' },
  { q: '¿Puedo analizar la hoja de vida que ya tengo?', a: 'Sí. En la pestaña «Analizar mi hoja de vida (PDF)» la subes o pegas el texto: recibes el puntaje por categoría, las palabras clave que te faltan y las frases que conviene reescribir. Con un clic la pasas al creador para corregirla y descargarla con el diseño oficial.' },
  { q: '¿El PDF que descargo sirve para cualquier empresa?', a: 'Sí: sale en una sola columna, con texto seleccionable y sin elementos gráficos que confundan a los filtros.' },
  { q: '¿Cuántas páginas debe tener?', a: 'Una página si tienes menos de diez años de experiencia; dos como máximo. Lo que no aporta al cargo, fuera.' },
];

export default function HojaDeVida() {
  useEffect(() => {
    updatePageSeo({
      title: 'Crear hoja de vida ATS + IA para farmacéuticos | Edvanta',
      description: 'Crea tu hoja de vida con formato ATS 2026: puntaje en vivo, palabras clave del cargo, recomendaciones y descarga en PDF legible por los filtros automáticos.',
      canonical: 'https://edvanta.co/hoja-de-vida',
      keywords: ['hoja de vida ATS', 'crear hoja de vida', 'currículum farmacéutico', 'puntaje ATS', 'hoja de vida químico farmacéutico'],
      jsonLdId: 'hoja-de-vida',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Creador de hoja de vida ATS + IA de Edvanta',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: 'https://edvanta.co/hoja-de-vida',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' },
      },
    });
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <LandingHero
          breadcrumb={<Breadcrumb className="mb-6" items={[{ label: 'Empleo', to: '/empleo' }, { label: 'Hoja de vida' }]} />}
          eyebrow="Hoja de vida ATS + IA"
          title="Tu hoja de vida lista en 5 minutos"
          lead="Contesta cuatro pasos, elige entre 9 diseños y descárgala en PDF. Los filtros automáticos la leen completa y tú ves el resultado mientras escribes."
          bullets={[
            'Nueve diseños, uno para cada proceso',
            'Fechas, logros y habilidades con un clic',
            'Perfil profesional escrito por ti, con ayuda',
            'Puntaje ATS en vivo y análisis de la que ya tienes',
          ]}
          actions={(
            <>
              <Btn href="#creador" icon={Sparkles}>Crear mi hoja de vida</Btn>
              <Btn href="#analizar" variant="secondary" icon={Search}>Analizar la que ya tengo</Btn>
            </>
          )}
          media={<MuestraPlantillas ids={['edvanta', 'ejecutiva', 'moderna-turquesa', 'pastel-serena']} ancho={220} />}
        />

        {/* Diseños disponibles */}
        <Section id="disenos" tone="surface" bordered>
          <SectionHeading
            eyebrow="Nueve diseños"
            title="Elige cómo se ve tu hoja de vida"
            desc="Todos salen en PDF con texto real y una columna de lectura, así que los filtros automáticos los leen completos. Dos de ellos llevan tu foto."
            align="center"
          />
          <MuestraPlantillas
            className="mt-10"
            ids={['edvanta', 'ejecutiva', 'azul', 'azul-academica']}
            ancho={260}
          />
          <MuestraPlantillas
            className="mt-6"
            ids={['ejecutiva-moderna', 'azul-clasica', 'pastel-serena', 'moderna-turquesa']}
            ancho={260}
          />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Btn href="#creador" icon={Sparkles}>Probar los diseños con mis datos</Btn>
            <Btn href="#analizar" variant="secondary">Analizar mi hoja de vida actual</Btn>
          </div>
        </Section>

        {/* Herramienta */}
        <Section id="creador" tone="surface" bordered>
          <SectionHeading
            eyebrow="La herramienta"
            title="Arma tu hoja de vida aquí mismo"
            desc="Cuatro pasos con ayudas en cada campo, vista previa real del PDF y nueve diseños. También puedes subir la que ya tienes: la analizamos y la pasamos al creador."
          />
          {/* Ancla de «Analizar la que ya tengo»: el creador abre el analizador con #analizar */}
          <div id="analizar" className="mt-8 scroll-mt-28">
            <CvBuilder />
          </div>
        </Section>

        {/* Qué revisa */}
        <Section>
          <SectionHeading eyebrow="Qué revisa" title="Lo que mira la herramienta por ti" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {QUE_REVISA.map((q) => (
              <Card key={q.title} hover className="flex gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue">
                  <q.icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-bold text-edvanta-deep">{q.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{q.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Pasos + errores */}
        <Section tone="surface" bordered>
          <SectionHeading eyebrow="Cómo se usa" title="Cuatro pasos y la tienes lista" />
          <Steps className="mt-8" items={PASOS} />
          <div className="mt-10 gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)] lg:items-center">
            <div>
              <h3 className="font-display text-xl font-extrabold text-edvanta-deep">Errores que dejan tu hoja de vida fuera</h3>
              <ul className="mt-5 space-y-3">
                {ERRORES.map((e) => (
                  <li key={e} className="flex items-start gap-2.5 text-[15px] leading-7 text-edvanta-deep">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 lg:mt-0">
              <ImageSlot
                ratio="portrait"
                label="Comparación: hoja de vida antes y después"
                hint="Montaje vertical con las dos versiones. 900 × 1200 px."
              />
            </div>
          </div>
        </Section>

        {/* Siguiente paso */}
        <Section>
          <SectionHeading eyebrow="Cuando la tengas lista" title="Sigue el proceso completo" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card hover>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue">
                <Mail className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-bold text-edvanta-deep">Escribe el correo</p>
              <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">Plantillas para postular, hacer seguimiento y agradecer.</p>
              <ArrowLink to="/empleo/correos" className="mt-4">Ver plantillas</ArrowLink>
            </Card>
            <Card hover>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-mint text-edvanta-tealdark">
                <Search className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-bold text-edvanta-deep">Busca la vacante</p>
              <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">Ofertas para químicos farmacéuticos con postulación directa.</p>
              <ArrowLink to="/empleo/ofertas-qf" className="mt-4">Ver ofertas</ArrowLink>
            </Card>
            <Card hover>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-lilac text-[#5E51A8]">
                <Sparkles className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-bold text-edvanta-deep">Que te busquen a ti</p>
              <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">Publica tus logros en la vitrina de talento.</p>
              <ArrowLink to="/talento" className="mt-4">Ir a la vitrina</ArrowLink>
            </Card>
          </div>
        </Section>

        <Section tone="surface" bordered>
          <SectionHeading eyebrow="Preguntas frecuentes" title="Dudas sobre la hoja de vida" />
          <Faq className="mt-8" items={FAQS} />
        </Section>

        <CtaBanner
          eyebrow="Hazlo ahora"
          title="En veinte minutos tienes una hoja de vida lista para postular"
          desc="No necesitas plantillas de Word ni diseños complicados: escribe, revisa el puntaje y descarga."
          actions={(
            <>
              <Btn href="#creador" variant="white" icon={Download}>Ir a la herramienta</Btn>
              <Btn to="/empleo" variant="outlineWhite">Ver el centro de empleo</Btn>
            </>
          )}
        />
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * ============================================================
 *  ContigoHome.jsx — /contigo (inicio de pacientes)
 *
 *  Un catálogo de guías: el héroe de Edvanta Contigo y enseguida lo que
 *  se ofrece. Primero lo más nuevo y lo gratis; después las guías de
 *  Feliz Sin Tiroides por tema, las rutas por condición y artículos.
 *  Mi cuidado, la atención farmacéutica, la red profesional, los
 *  planes y las preguntas quedan en botones que abren su contenido. Al
 *  final, una encuesta corta.
 *
 *  Regla de Feliz Sin Tiroides: la venta es solo por Hotmart, sin
 *  precio ni carrito en Edvanta.
 * ============================================================
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Building2, HeartPulse, HelpCircle, Layers, MessageCircle, Pill, ShieldCheck, Stethoscope, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Faq } from '../../components/edvanta/ui';
import {
  ContigoEyebrow, ContigoHeroVisual, HerramientaContigoCard, IconoContigo, PlanContigoCard,
} from '../../components/contigo/ContigoPieces';
import {
  EncuestaRapida, FilaDeCatalogo, ServiciosPlegados, TarjetaArticulo, TarjetaLibro, TarjetaRuta, useArticulosRecientes,
} from '../../components/edvanta/catalogo';
import {
  CONTIGO_FAQ, CONTIGO_HERRAMIENTAS, CONTIGO_PASOS, CONTIGO_PLANES, CONTIGO_RUTAS, RED_PROFESIONAL,
} from '../../data/edvanta/contigo';
import { GRUPOS_FST, ROLES_PACIENTES, tienePortadaPrestada } from '../../data/edvanta/catalogoInicio';
import { ebooks, servicios as SERVICIOS_FST } from '../../data/fst';
import { waLink } from '../../config/links';
import { trackLeadEvent } from '../../lib/leadEvents';
import { updatePageSeo } from '../../utils/seo';

const LOGO_FST = '/img/port-logofelizsintiroides.jpg';

const TEMAS_DE_LA_ENCUESTA = [
  'Hipotiroidismo', 'Hashimoto', 'Hipertiroidismo', 'Vivir sin tiroides', 'Cáncer de tiroides',
  'Alimentación', 'Emociones y bienestar', 'Diabetes', 'Presión arterial', 'Salud renal',
];

const MODALIDADES_PACIENTES = [
  ['aula', 'Guías y cursos a mi ritmo'],
  ['en-vivo', 'Talleres y acompañamiento en vivo'],
  ['combinada', 'Las dos'],
];

/** Una guía de Feliz Sin Tiroides como tarjeta. Solo las que se pueden comprar. */
const libroFST = (e, i) => ({
  id: e.id,
  titulo: e.name,
  etiqueta: e.tag,
  portada: tienePortadaPrestada(e) ? null : e.cover?.image,
  logo: LOGO_FST,
  sello: 'Feliz Sin Tiroides',
  tono: i,
  href: e.checkoutUrl || e.hotmartUrl,
  accion: 'Ver en Hotmart',
  onClick: () => trackLeadEvent('hotmart_clicked', { productId: e.id, resourceName: e.name }),
});

const A_LA_VENTA = ebooks.filter((e) => e.checkoutUrl || e.hotmartUrl);
const porId = (id) => A_LA_VENTA.find((e) => e.id === id);

// Lo gratis: cada uno lleva a su página en Edvanta.
const GRATIS = [
  { id: 'guia-levotiroxina', titulo: 'Cómo tomar la levotiroxina correctamente', to: '/recurso/levotiroxina', accion: 'Descargar gratis', tono: 1 },
  { id: 'curso-autocuidado', titulo: 'Curso de autocuidado de la tiroides', to: '/academia/curso/autocuidado-de-la-tiroides', accion: 'Empezar el curso', tono: 0 },
  { id: 'retos', titulo: 'Retos de movimiento de 7 días', to: '/academia/retos', accion: 'Elegir mi reto', tono: 2 },
  { id: 'recetas', titulo: 'Recetas para tu tiroides', to: '/recetas', accion: 'Buscar recetas', tono: 1 },
  { id: 'nutrifst', titulo: 'Pregúntale a NutriFST sobre alimentación', to: '/nutrifst', accion: 'Preguntar', tono: 0 },
].map((g) => ({ ...g, etiqueta: 'Gratis', gratis: true, logo: LOGO_FST, sello: 'Feliz Sin Tiroides' }));

export default function ContigoHome() {
  const articulos = useArticulosRecientes('pacientes', 12);

  useEffect(() => {
    updatePageSeo({
      title: 'Edvanta Contigo | Guías y cursos para pacientes y cuidadores',
      description: 'Guías, cursos y herramientas para entender tu tratamiento y organizar tu cuidado. Empieza por la salud tiroidea con Feliz Sin Tiroides.',
      canonical: 'https://edvanta.co/contigo',
      image: 'https://edvanta.co/img/fotos/pacientes-taller.webp',
      keywords: ['Edvanta Contigo', 'educación para pacientes', 'salud tiroidea', 'Feliz Sin Tiroides', 'guías de tiroides'],
      jsonLdId: 'contigo-home',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Edvanta Contigo',
          description: 'Guías, cursos y herramientas para pacientes y cuidadores.',
          url: 'https://edvanta.co/contigo',
          publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Edvanta Contigo', item: 'https://edvanta.co/contigo' },
          ],
        },
      ],
    });
  }, []);

  const nuevos = A_LA_VENTA.filter(tienePortadaPrestada).map(libroFST);
  const grupos = GRUPOS_FST
    .map((g) => ({ ...g, libros: g.ids.map(porId).filter(Boolean).map(libroFST) }))
    .filter((g) => g.libros.length);
  const rutas = CONTIGO_RUTAS.map((r) => ({
    id: r.slug,
    nombre: r.nombre,
    to: r.to,
    portada: r.imagen,
    insignia: r.estado === 'disponible' ? 'Disponible' : 'Próximamente',
    antetitulo: 'Ruta por condición',
    accion: r.estado === 'disponible' ? 'Entrar a la ruta' : 'Avísame cuando abra',
  }));

  const servicios = [
    {
      id: 'atencion',
      etiqueta: 'Atención farmacéutica',
      icono: Pill,
      contenido: (
        <>
          <p className="max-w-3xl text-sm leading-6 text-edvanta-muted">
            Acompañamiento de Feliz Sin Tiroides con una química farmacéutica: medicación, exámenes, alimentación y hábitos. No reemplaza la consulta con tu médico.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICIOS_FST.map((s) => (
              <article key={s.id} className="flex flex-col rounded-2xl border border-edvanta-border bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{s.duration}</p>
                <h3 className="mt-1 font-display text-base font-extrabold text-edvanta-deep">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{s.description}</p>
                <Btn href={waLink(`Hola, quiero información sobre «${s.name}» de Feliz Sin Tiroides.`)} external variant="secondary" size="sm" icon={MessageCircle} className="mt-4 self-start">
                  Pedir información
                </Btn>
              </article>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 'mi-cuidado',
      etiqueta: 'Mi cuidado',
      icono: HeartPulse,
      contenido: (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
          <div>
            <p className="text-sm leading-6 text-edvanta-muted">
              Medicamentos, documentos, citas y preguntas para la consulta, en un espacio privado. Mi cuidado abre el portal de Feliz Sin Tiroides: no creamos un segundo historial ni duplicamos tu cuenta.
            </p>
            <Btn to="/mi-cuidado" icon={HeartPulse} iconRight={ArrowRight} className="mt-5">Abrir Mi cuidado</Btn>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {CONTIGO_HERRAMIENTAS.slice(0, 4).map((h) => <HerramientaContigoCard key={h.id} herramienta={h} />)}
          </div>
        </div>
      ),
    },
    {
      id: 'como-funciona',
      etiqueta: 'Cómo funciona',
      icono: Layers,
      contenido: (
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTIGO_PASOS.map((p, i) => (
            <li key={p.titulo} className="rounded-2xl border border-edvanta-border bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="contigo-icon !h-9 !w-9 !rounded-[10px]"><IconoContigo name={p.icono} className="h-4 w-4" /></span>
                <span className="text-xs font-extrabold uppercase tracking-[.12em] text-edvanta-tealdark">Paso {i + 1}</span>
              </div>
              <h3 className="mt-3 font-display text-base font-extrabold text-edvanta-deep">{p.titulo}</h3>
              <p className="mt-1 text-xs leading-5 text-edvanta-muted">{p.desc}</p>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: 'red',
      etiqueta: 'Acompañamiento profesional',
      icono: Stethoscope,
      contenido: (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-edvanta-muted">
            {RED_PROFESIONAL.lead} Todavía no hay profesionales verificados: cuando los haya, aparecerán con su alcance, precio y disponibilidad. No mostramos perfiles ni agendas que no existan.
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Btn to="/contigo/profesionales" variant="secondary" iconRight={ArrowRight}>Conocer la red</Btn>
            <Btn to="/contigo/red-profesional/postulacion" variant="secondary" icon={Stethoscope}>Soy profesional</Btn>
          </div>
        </div>
      ),
    },
    {
      id: 'planes',
      etiqueta: 'Planes',
      icono: Users,
      contenido: (
        <>
          <p className="max-w-3xl text-sm leading-6 text-edvanta-muted">
            La comunidad es gratuita. Contigo Plus y la consulta son propuestas con precios de prueba; esta versión no cobra.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {CONTIGO_PLANES.slice(0, 3).map((p) => <PlanContigoCard key={p.id} plan={p} destacado={p.id === 'plus'} />)}
          </div>
          <Btn to="/contigo/planes" variant="link" iconRight={ArrowRight} className="mt-4">Comparar planes</Btn>
        </>
      ),
    },
    {
      id: 'instituciones',
      etiqueta: '¿Eres una institución?',
      icono: Building2,
      contenido: (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-edvanta-muted">
            Ruta Contigo lleva educación para pacientes a clínicas, IPS y programas de pacientes de tu organización.
          </p>
          <Btn to="/instituciones/paquetes/ruta-contigo" variant="secondary" icon={Building2} iconRight={ArrowRight}>Conocer Ruta Contigo</Btn>
        </div>
      ),
    },
    {
      id: 'preguntas',
      etiqueta: 'Preguntas frecuentes',
      icono: HelpCircle,
      contenido: <Faq items={CONTIGO_FAQ} />,
    },
  ];

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo' }]} className="mb-8" />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)] lg:gap-14">
              <div>
                <ContigoEyebrow>Edvanta Contigo</ContigoEyebrow>
                <h1 className="mt-4 font-display text-[2.2rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-edvanta-blue sm:text-[2.8rem] lg:text-[3.1rem]">
                  Tu salud merece un espacio que te acompañe
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-[var(--contigo-muted)]">
                  Guías, cursos y herramientas para comprender tu tratamiento y organizar tu cuidado.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Btn href="#guias" size="lg" iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                    Ver las guías
                  </Btn>
                  <Btn to="/contigo/rutas" variant="secondary" size="lg" icon={HeartPulse}>
                    Encuentra tu ruta
                  </Btn>
                </div>
                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--contigo-muted)]">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                  Educación y herramientas. No diagnostica ni modifica tu tratamiento.
                </p>
              </div>
              <ContigoHeroVisual />
            </div>
          </div>
        </header>

        {/* Las guías, primero */}
        <div id="guias" className="scroll-mt-28 bg-white pt-4">
          <FilaDeCatalogo
            id="lo-mas-nuevo"
            titulo="Lo más nuevo"
            subtitulo="Guías recién publicadas de Feliz Sin Tiroides"
            icono="Sparkles"
            tono="teal"
            ancho="libro"
            items={nuevos}
            render={(l) => <TarjetaLibro libro={l} fila="contigo-nuevo" />}
          />
          <FilaDeCatalogo
            id="gratis"
            titulo="Gratis para empezar"
            subtitulo="Guía, curso, retos y recetas sin costo"
            icono="HeartPulse"
            tono="violet"
            ancho="libro"
            items={GRATIS}
            render={(l) => <TarjetaLibro libro={l} fila="contigo-gratis" />}
          />
          {grupos.map((g) => (
            <FilaDeCatalogo
              key={g.id}
              id={`guias-${g.id}`}
              titulo={g.titulo}
              subtitulo={g.subtitulo}
              icono={g.icono}
              ancho="libro"
              items={g.libros}
              render={(l) => <TarjetaLibro libro={l} fila={`contigo-${g.id}`} />}
              verTodo={{ to: '/contigo/tiroides/guias', label: 'Ver todas las guías' }}
            />
          ))}
        </div>

        {/* Rutas y artículos */}
        <div className="border-t border-edvanta-border bg-edvanta-bg pt-4">
          <FilaDeCatalogo
            id="rutas"
            titulo="Rutas por condición"
            subtitulo="Hoy está abierta la salud tiroidea; las demás se preparan"
            icono="Route"
            tono="teal"
            ancho="ruta"
            items={rutas}
            render={(r) => <TarjetaRuta ruta={r} />}
            verTodo={{ to: '/contigo/rutas', label: 'Ver las rutas' }}
          />
          <FilaDeCatalogo
            id="articulos"
            titulo="Artículos de salud"
            subtitulo="En lenguaje claro, para leer antes de la consulta"
            icono="Newspaper"
            items={articulos}
            render={(a) => <TarjetaArticulo articulo={a} />}
            verTodo={{ to: '/articulos?publico=pacientes', label: 'Ver todos los artículos' }}
          />
        </div>

        <ServiciosPlegados
          id="servicios"
          eyebrow="Edvanta Contigo"
          titulo="Atención, herramientas y planes"
          desc="Ábrelos cuando los necesites."
          servicios={servicios}
          anclas={{ 'mi-cuidado': 'mi-cuidado' }}
        />

        <EncuestaRapida
          referencia="encuesta-inicio-pacientes"
          titulo="¿Sobre qué quieres aprender?"
          desc="Responde tres preguntas y sigue por WhatsApp: te orientamos sobre la guía o el curso que te sirve."
          temas={TEMAS_DE_LA_ENCUESTA}
          roles={ROLES_PACIENTES}
          modalidades={MODALIDADES_PACIENTES}
          preguntaTemas="¿Qué temas te interesan?"
          preguntaIdea="¿Qué guía te gustaría que escribiéramos? (opcional)"
        />

        <p className="mx-auto max-w-3xl px-4 pb-10 text-center text-xs leading-5 text-edvanta-muted">
          El contenido de Edvanta Contigo es educativo. No reemplaza la valoración, el diagnóstico ni el tratamiento de tu equipo de salud.{' '}
          <Link to="/descargo-medico" className="font-semibold text-edvanta-blue underline">Aviso sanitario</Link>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

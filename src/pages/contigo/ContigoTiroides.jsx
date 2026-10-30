/**
 * ContigoTiroides.jsx — /contigo/tiroides
 *
 *  La ruta abierta de Edvanta Contigo. No duplica Feliz Sin Tiroides:
 *  reúne sus guías, curso, comunidad y las herramientas privadas que
 *  ya existen en /fst-app. El acompañamiento profesional se anuncia
 *  como en preparación.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Download, HeartPulse, MessageCircle, ShieldCheck, Stethoscope,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import CourseCarousel from '../../components/CourseCarousel';
import { Breadcrumb, Btn, Card } from '../../components/edvanta/ui';
import {
  ContigoEyebrow, ContigoHeroVisual, ContigoSection, HerramientaContigoCard,
  RutaContigoCard,
} from '../../components/contigo/ContigoPieces';
import { ProductoCard, useCursosPropios } from '../../components/edvanta/oferta';
import { PROGRAMAS } from '../../data/edvanta/programas';
import { PRODUCTOS } from '../../data/edvanta/productos';
import { CONTIGO_HERRAMIENTAS, CONTIGO_RUTAS } from '../../data/edvanta/contigo';
import { FST_COMMUNITY_URL } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';

const CONDICIONES = [
  { nombre: 'Hipotiroidismo', to: '/enfermedades/hipotiroidismo' },
  { nombre: 'Hashimoto', to: '/enfermedades/hashimoto' },
  { nombre: 'Vivir sin tiroides', to: '/enfermedades/vivir-sin-tiroides' },
  { nombre: 'Hipertiroidismo', to: '/enfermedades/hipertiroidismo' },
  { nombre: 'Nódulos tiroideos', to: '/enfermedades/nodulos-tiroideos' },
  { nombre: 'Cáncer de tiroides', to: '/enfermedades/cancer-de-tiroides' },
  { nombre: 'Salud metabólica', to: '/enfermedades/salud-metabolica' },
  { nombre: 'Levotiroxina', to: '/levotiroxina' },
  { nombre: 'Nutrición y tiroides', to: '/nutricion-tiroidea' },
  { nombre: 'Recetas para la tiroides', to: '/recetas' },
];

export default function ContigoTiroides() {
  const fst = PROGRAMAS['feliz-sin-tiroides'];
  const guias = PRODUCTOS.filter((p) => p.programa === 'feliz-sin-tiroides');
  const { cursos } = useCursosPropios({ publico: 'pacientes' });
  const ruta = CONTIGO_RUTAS.find((r) => r.slug === 'tiroides');

  useEffect(() => {
    updatePageSeo({
      title: 'Salud tiroidea | Edvanta Contigo × Feliz Sin Tiroides',
      description: 'Guías, curso y recursos en lenguaje claro sobre hipotiroidismo, Hashimoto, levotiroxina y vivir sin tiroides. Herramientas privadas y comunidad opcional.',
      canonical: 'https://edvanta.co/contigo/tiroides',
      image: 'https://edvanta.co/img/publicos/pacientes.webp',
      keywords: ['salud tiroidea', 'hipotiroidismo', 'Hashimoto', 'levotiroxina', 'Feliz Sin Tiroides'],
      jsonLdId: 'contigo-tiroides',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Salud tiroidea — Edvanta Contigo',
          description: 'Ruta educativa de salud tiroidea con guías, curso y herramientas privadas.',
          url: 'https://edvanta.co/contigo/tiroides',
          publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Edvanta Contigo', item: 'https://edvanta.co/contigo' },
            { '@type': 'ListItem', position: 3, name: 'Salud tiroidea', item: 'https://edvanta.co/contigo/tiroides' },
          ],
        },
      ],
    });
  }, []);

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo', to: '/contigo' }, { label: 'Salud tiroidea' }]} className="mb-8" />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)] lg:gap-14">
              <div>
                <ContigoEyebrow>Edvanta Contigo × Feliz Sin Tiroides</ContigoEyebrow>
                <h1 className="mt-4 font-display text-[2.2rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-edvanta-blue sm:text-[2.8rem] lg:text-[3.1rem]">
                  Tu tiroides, explicada con claridad
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-[var(--contigo-muted)]">
                  {fst.nombre} reúne guías, contenido educativo y herramientas para personas con hipotiroidismo, Hashimoto o que viven sin tiroides. Lo creó Karla Hernández, química farmacéutica que también vive sin tiroides.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Btn to="/mi-cuidado" size="lg" icon={HeartPulse} iconRight={ArrowRight} className="!bg-[var(--contigo-primary)] hover:!bg-[var(--contigo-primary-strong)]">
                    Abrir Mi cuidado
                  </Btn>
                  <Btn to="/recurso/levotiroxina" variant="secondary" size="lg" icon={Download}>
                    Descargar la guía gratuita
                  </Btn>
                </div>
                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--contigo-muted)]">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" />
                  Educación para pacientes. No reemplaza la consulta ni cambia tu tratamiento.
                </p>
              </div>
              <ContigoHeroVisual />
            </div>
          </div>
        </header>

        <ContigoSection id="espacio" tone="white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <ContigoEyebrow>Tu espacio de cuidado</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Herramientas privadas que ya puedes usar
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--contigo-muted)]">
                Se abren en Feliz Sin Tiroides con tu cuenta. Puedes usarlas sin entrar a la comunidad.
              </p>
            </div>
            <Btn to="/mi-cuidado" variant="secondary" size="sm" iconRight={ArrowRight}>Entrar a Mi cuidado</Btn>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONTIGO_HERRAMIENTAS.slice(0, 4).map((h) => <HerramientaContigoCard key={h.id} herramienta={h} />)}
          </div>
        </ContigoSection>

        <ContigoSection tone="sage">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <ContigoEyebrow>Guías para leer en casa</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                Recursos para llevar a la consulta
              </h2>
            </div>
            <Btn to="/contigo/tiroides/guias" variant="secondary" size="sm" iconRight={ArrowRight}>Ver todas las guías</Btn>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {guias.slice(0, 2).map((p) => <ProductoCard key={p.slug} producto={p} />)}
          </div>
        </ContigoSection>

        {cursos.length > 0 && (
          <section className="border-y border-[var(--contigo-border)] bg-white">
            <CourseCarousel title="Curso para pacientes" courses={cursos} sectionKey="contigo_tiroides" />
          </section>
        )}

        <ContigoSection tone="white">
          <ContigoEyebrow>Comprende tu condición</ContigoEyebrow>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
            Información por tema
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--contigo-muted)]">
            Páginas en lenguaje claro para leer con calma y conversar con tu equipo de salud.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONDICIONES.map((c) => (
              <li key={c.to}>
                <Link to={c.to} className="contigo-card contigo-card--interactive group flex items-center gap-3 px-5 py-4 text-[15px] font-semibold text-edvanta-deep hover:text-[var(--contigo-primary)]">
                  <span className="contigo-icon !h-9 !w-9 !rounded-[10px]"><BookOpen className="h-4 w-4" aria-hidden="true" /></span>
                  <span className="flex-1">{c.nombre}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </ContigoSection>

        <ContigoSection tone="lavender">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div>
              <ContigoEyebrow>Comunidad y acompañamiento</ContigoEyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.025em] text-edvanta-deep sm:text-4xl">
                No estás sola ni solo
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--contigo-muted)]">
                La comunidad de Feliz Sin Tiroides reúne a personas que viven con una condición tiroidea. Es un espacio para compartir experiencias, no para consultas clínicas.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn href={FST_COMMUNITY_URL} external icon={MessageCircle} variant="teal">Unirme a la comunidad</Btn>
                <Btn to="/contigo/profesionales" variant="secondary" icon={Stethoscope}>Ver acompañamiento</Btn>
              </div>
            </div>
            <Card className="bg-white">
              <h3 className="font-display text-lg font-extrabold text-edvanta-deep">Acompañamiento profesional</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--contigo-muted)]">
                La consulta farmacéutica individual está en preparación. No hay profesionales verificados ni agenda activa todavía. Puedes conocer la propuesta y dejar tu interés.
              </p>
              <Btn to="/contigo/planes" variant="secondary" size="sm" className="mt-4" iconRight={ArrowRight}>Conocer los planes</Btn>
            </Card>
          </div>
        </ContigoSection>

        <ContigoSection tone="white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <ContigoEyebrow>Otras rutas</ContigoEyebrow>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep">Si tu cuidado incluye otra condición</h2>
            </div>
            <Btn to="/contigo/rutas" variant="secondary" size="sm" iconRight={ArrowRight}>Ver las seis rutas</Btn>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CONTIGO_RUTAS.filter((r) => r.slug !== 'tiroides').slice(0, 3).map((r) => (
              <RutaContigoCard key={r.slug} ruta={r} />
            ))}
          </div>
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}

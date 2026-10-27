/**
 * ============================================================
 *  PacientesTiroides.jsx — /pacientes/tiroides
 *
 *  La ruta de salud tiroidea de Edvanta Contigo. No duplica a Feliz
 *  Sin Tiroides: la presenta dentro de Edvanta y ordena lo que ya
 *  existe —la guía gratuita, el curso para pacientes, las páginas de
 *  cada condición, las recetas y la comunidad— para que quien llega
 *  sepa por dónde empezar. Las páginas de Feliz Sin Tiroides no se
 *  tocan.
 * ============================================================
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import CourseCarousel from '../../components/CourseCarousel';
import { Breadcrumb, Btn, LandingHero, Section, SectionHeading } from '../../components/edvanta/ui';
import { ProductoCard, useCursosPropios } from '../../components/edvanta/oferta';
import { PROGRAMAS } from '../../data/edvanta/programas';
import { PRODUCTOS } from '../../data/edvanta/productos';
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

export default function PacientesTiroides() {
  const fst = PROGRAMAS['feliz-sin-tiroides'];
  const guias = PRODUCTOS.filter((p) => p.programa === 'feliz-sin-tiroides');
  const { cursos } = useCursosPropios({ publico: 'pacientes' });

  useEffect(() => updatePageSeo({
    title: 'Salud tiroidea para pacientes | Edvanta Contigo · Feliz Sin Tiroides',
    description: 'Guías, curso y recursos en lenguaje claro sobre hipotiroidismo, Hashimoto, levotiroxina y vivir sin tiroides.',
    canonical: 'https://edvanta.co/pacientes/tiroides',
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <LandingHero
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Para pacientes', to: '/pacientes' }, { label: 'Salud tiroidea' }]} className="mb-6" />}
          eyebrow="Edvanta Contigo · Feliz Sin Tiroides"
          title="Tu tiroides, explicada con claridad"
          highlight="con claridad"
          lead={`${fst.nombre} es el programa de Edvanta para personas con hipotiroidismo, Hashimoto o que viven sin tiroides. Lo creó Karla Hernández, química farmacéutica que también vive sin tiroides.`}
          actions={(
            <>
              <Btn to="/recurso/levotiroxina" variant="teal">Descargar la guía gratuita</Btn>
              <Btn to={fst.to} variant="secondary">Ir a Feliz Sin Tiroides</Btn>
            </>
          )}
          media={(
            <div className="flex items-center gap-5 rounded-3xl border border-edvanta-border bg-white p-6 shadow-[0_12px_36px_rgba(23,34,59,.08)]">
              <img src={fst.logo} alt="Feliz Sin Tiroides" width="96" height="96" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
              <p className="text-sm leading-6 text-edvanta-muted">{fst.texto}</p>
            </div>
          )}
        />

        <Section>
          <SectionHeading eyebrow="Empieza por aquí" title="Guías para leer en casa y llevar a la consulta" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {guias.map((p) => <ProductoCard key={p.slug} producto={p} />)}
          </div>
        </Section>

        {cursos.length > 0 && (
          <section className="border-y border-edvanta-border bg-edvanta-mint/30">
            <CourseCarousel title="Curso para pacientes" courses={cursos} sectionKey="pacientes_tiroides" />
          </section>
        )}

        <Section>
          <SectionHeading eyebrow="Comprende tu condición" title="Información por tema" desc="Páginas en lenguaje claro, para leer con calma y conversar con tu médico." />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONDICIONES.map((c) => (
              <li key={c.to}>
                <Link to={c.to} className="flex items-center justify-between gap-3 rounded-2xl border border-edvanta-border bg-white px-5 py-4 text-[15px] font-semibold text-edvanta-deep transition hover:border-edvanta-teal/50 hover:text-edvanta-tealdark">
                  {c.nombre}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section tone="tint" bordered>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">No estás sola ni solo</h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-edvanta-muted">
                La comunidad de Feliz Sin Tiroides en WhatsApp reúne a personas que viven con una condición tiroidea.
                Es un espacio para compartir experiencias: no reemplaza a tu médico.
              </p>
            </div>
            <Btn href={FST_COMMUNITY_URL} external variant="teal" icon={MessageCircle}>Unirme a la comunidad</Btn>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

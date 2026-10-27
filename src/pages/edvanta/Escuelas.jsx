/**
 * ============================================================
 *  Escuelas.jsx — /escuelas
 *
 *  Las cuatro escuelas de Edvanta, cada una con lo que hoy tiene
 *  publicado. El número de cursos sale de la base de datos, no de un
 *  texto escrito a mano.
 * ============================================================
 */

import { useEffect, useMemo } from 'react';
import { Building2, HeartPulse } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, LandingHero, NavCard, Section, SectionHeading } from '../../components/edvanta/ui';
import { EscuelaCard, useCursosPropios } from '../../components/edvanta/oferta';
import { ESCUELAS, cursoEnEscuela } from '../../data/edvanta/escuelas';
import { updatePageSeo } from '../../utils/seo';

export default function Escuelas() {
  const { cursos } = useCursosPropios({ publico: 'profesionales' });
  const porEscuela = useMemo(
    () => Object.fromEntries(ESCUELAS.map((e) => [e.slug, cursos.filter((c) => cursoEnEscuela(c, e)).length])),
    [cursos],
  );

  useEffect(() => updatePageSeo({
    title: 'Escuelas de Edvanta | Salud, Calidad, Regulatorios y Marketing farmacéutico',
    description: 'Cuatro escuelas de formación farmacéutica: Salud y Farmacia Clínica, Calidad y Producción, Asuntos Regulatorios, y Marketing y Comunicación.',
    canonical: 'https://edvanta.co/escuelas',
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <LandingHero
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Escuelas' }]} className="mb-6" />}
          eyebrow="Escuelas de Edvanta"
          title="Cuatro escuelas, una sola Edvanta"
          highlight="una sola Edvanta"
          lead="Cada escuela reúne los cursos, guías y servicios de un campo del trabajo farmacéutico. Las áreas que aún no tienen contenido se muestran como lo que son: en desarrollo."
        />

        <Section>
          <div className="grid gap-5 md:grid-cols-2">
            {ESCUELAS.map((e) => (
              <EscuelaCard key={e.slug} escuela={e} cursos={e.catalogo ? porEscuela[e.slug] : null} />
            ))}
          </div>
        </Section>

        <Section tone="tint" bordered>
          <SectionHeading eyebrow="¿No eres profesional de la salud?" title="Otras puertas de entrada" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <NavCard
              to="/pacientes"
              icon={HeartPulse}
              tone="teal"
              title="Para pacientes y cuidadores"
              desc="Edvanta Contigo: educación en salud en lenguaje claro, empezando por la salud tiroidea."
              cta="Ir a Edvanta Contigo"
            />
            <NavCard
              to="/instituciones"
              icon={Building2}
              title="Para instituciones"
              desc="Formación para equipos, programas para pacientes, licencias y materiales, bajo propuesta."
              cta="Ver qué se puede contratar"
            />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

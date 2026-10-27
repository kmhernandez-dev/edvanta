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
import { ArrowRight, Building2, FileCheck2, GraduationCap, HeartPulse, Megaphone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, NavCard, Section, SectionHeading } from '../../components/edvanta/ui';
import { HeroCientifico } from '../../components/edvanta/heroes';
import { EscuelaCard, useCursosPropios } from '../../components/edvanta/oferta';
import { ESCUELAS, cursoEnEscuela } from '../../data/edvanta/escuelas';
import { updatePageSeo } from '../../utils/seo';

const ICONOS = { HeartPulse, ShieldCheck, FileCheck2, Megaphone };

/**
 * Mapa de las escuelas: Edvanta arriba, las cuatro escuelas debajo y,
 * en cada una, sus áreas con el estado real (punto de color).
 */
function MapaDeEscuelas() {
  return (
    <div className="relative">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-edvanta-blue px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-[var(--ds-sh-btn)]">
          <GraduationCap className="h-4 w-4" aria-hidden="true" />Edvanta
        </span>
      </div>
      {/* Las ramas solo se dibujan en escritorio, donde las cuatro columnas caben. */}
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="mx-auto hidden h-10 w-[76%] lg:block" aria-hidden="true">
        <path d="M50 0 V4 M12.5 10 V4 H87.5 V10 M37.5 4 V10 M62.5 4 V10" fill="none" stroke="#C9D4E6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
        {ESCUELAS.map((e) => {
          const Icono = ICONOS[e.icono] || GraduationCap;
          const areas = e.recorridos.flatMap((r) => r.areas);
          return (
            <li key={e.slug} className="ds-card p-5">
              <Link to={`/escuelas/${e.slug}`} className="group flex items-center gap-3">
                <span className="ds-icon-tile h-10 w-10 shrink-0"><Icono className="h-5 w-5" aria-hidden="true" /></span>
                <span className="font-display text-[15px] font-extrabold leading-tight text-edvanta-deep group-hover:text-edvanta-blue">{e.corto}</span>
              </Link>
              <ul className="mt-4 space-y-2 border-t border-edvanta-border pt-4">
                {areas.map((a) => (
                  <li key={a.nombre} className="flex items-start gap-2 text-[13px] leading-5 text-edvanta-muted">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.estado === 'disponible' ? 'bg-edvanta-teal' : a.estado === 'proxima_apertura' ? 'bg-edvanta-violet' : 'bg-edvanta-strong'}`} aria-hidden="true" />
                    <span>{a.nombre}<span className="sr-only"> ({a.estado === 'disponible' ? 'disponible' : a.estado === 'proxima_apertura' ? 'próxima apertura' : 'en desarrollo'})</span></span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-edvanta-muted" aria-hidden="true">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-edvanta-teal" />Disponible</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-edvanta-violet" />Próxima apertura</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-edvanta-strong" />En desarrollo</span>
      </p>
    </div>
  );
}

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
        <HeroCientifico
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Escuelas' }]} className="mb-8" />}
          eyebrow="Escuelas de Edvanta"
          title="Cuatro escuelas, una sola Edvanta"
          highlight="una sola Edvanta"
          lead="Cada escuela reúne los cursos, guías y servicios de un campo del trabajo farmacéutico. Las áreas que aún no tienen contenido se muestran como lo que son: en desarrollo."
          image="/img/publicos/profesionales.webp"
          imageAlt="Equipo de salud revisando juntos un caso en una tableta"
          badges={ESCUELAS.map((e) => ({ icon: ICONOS[e.icono] || GraduationCap, label: e.corto }))}
          actions={(
            <>
              <Btn href="#escuelas" size="lg" iconRight={ArrowRight}>Ver las escuelas</Btn>
              <Btn to="/cursos" variant="secondary" size="lg">Ir al catálogo de cursos</Btn>
            </>
          )}
        />

        <Section id="escuelas" tone="white">
          <SectionHeading eyebrow="Elige tu escuela" title="Qué encuentras en cada una" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {ESCUELAS.map((e) => (
              <EscuelaCard key={e.slug} escuela={e} cursos={e.catalogo ? porEscuela[e.slug] : null} />
            ))}
          </div>
        </Section>

        <Section tone="diagonal" bordered>
          <SectionHeading
            align="center"
            eyebrow="Mapa de áreas"
            title="Cómo se organiza la formación"
            desc="Cada escuela y sus áreas, con lo que hoy está disponible y lo que viene."
          />
          <div className="mt-10"><MapaDeEscuelas /></div>
        </Section>

        <Section tone="white">
          <SectionHeading eyebrow="¿No eres profesional de la salud?" title="Otras puertas de entrada" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <NavCard
              to="/pacientes"
              icon={HeartPulse}
              tone="teal"
              title="Para pacientes y cuidadores"
              desc="Edvanta Contigo: educación en salud en lenguaje claro, empezando por la salud tiroidea."
              cta="Ir a Edvanta Contigo"
              image="/img/publicos/pacientes.webp"
              imageAlt="Química farmacéutica explicando la tiroides a pacientes y familiares con una tableta"
            />
            <NavCard
              to="/instituciones"
              icon={Building2}
              title="Para instituciones"
              desc="Formación para equipos, programas para pacientes, licencias y materiales, bajo propuesta."
              cta="Ver qué se puede contratar"
              image="/img/publicos/instituciones.webp"
              imageAlt="Presentación de resultados de formación ante el equipo directivo de una institución"
            />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

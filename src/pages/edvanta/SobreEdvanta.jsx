/**
 * ============================================================
 *  SobreEdvanta.jsx — /sobre-edvanta
 *
 *  Qué es Edvanta, cómo se organiza, quién está detrás y con qué
 *  criterio trabaja. Los principios son compromisos que el sitio
 *  cumple y se pueden comprobar en él, no adjetivos.
 *
 *  Nada de «la plataforma más grande», cifras de alumnos, sellos de
 *  acreditación ni alianzas: no hay ninguno documentado.
 * ============================================================
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, GraduationCap, HeartPulse } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, NavCard, Section, SectionHeading } from '../../components/edvanta/ui';
import { HeroCientifico } from '../../components/edvanta/heroes';
import { ICONOS_ESCUELA } from '../../components/edvanta/oferta';
import { ESCUELAS } from '../../data/edvanta/escuelas';
import { AUTORA } from '../../data/edvanta/productos';
import { LINKEDIN_URL } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';

const PRINCIPIOS = [
  {
    t: 'Decimos qué es nuestro y qué no',
    d: 'Los cursos de Edvanta y los de otras plataformas se muestran separados. Cuando un enlace es de afiliado, lo señalamos.',
  },
  {
    t: 'Fechas, precios y cupos, solo cuando existen',
    d: 'Si algo todavía no tiene fecha o valor aprobado, lo decimos y te ofrecemos un aviso en lugar de un dato que parezca real.',
  },
  {
    t: 'Actualización, no títulos',
    d: 'Nuestros cursos son formación de actualización. No otorgan títulos de auxiliar, regente ni ningún otro título profesional.',
  },
  {
    t: 'Educar no es consultar',
    d: 'Lo que hacemos para pacientes es educación: ayuda a entender y a preparar la consulta, pero no reemplaza la atención de su equipo de salud.',
  },
];

export default function SobreEdvanta() {
  useEffect(() => updatePageSeo({
    title: 'Sobre Edvanta | Educación farmacéutica',
    description: 'Edvanta es una empresa de educación farmacéutica: cuatro escuelas, Edvanta Contigo para pacientes y servicios para instituciones.',
    canonical: 'https://edvanta.co/sobre-edvanta',
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroCientifico
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Sobre Edvanta' }]} className="mb-8" />}
          eyebrow="Sobre Edvanta"
          title="Una empresa de educación farmacéutica"
          highlight="educación farmacéutica"
          lead="Formamos a quienes trabajan con medicamentos, acompañamos con educación a pacientes y cuidadores, y diseñamos programas para instituciones. Todo bajo una misma marca y un mismo criterio."
          image="/img/comunidad/encuentro-comunidad-farmaceutica.webp"
          imageAlt="Grupo de químicos farmacéuticos reunidos alrededor de una mesa, conversando sobre una tableta"
          imagePosition="center"
          badges={[
            { icon: GraduationCap, label: 'Cuatro escuelas' },
            { icon: HeartPulse, label: 'Edvanta Contigo' },
            { icon: Building2, label: 'Instituciones' },
          ]}
          actions={(
            <>
              <Btn to="/escuelas" size="lg" iconRight={ArrowRight}>Ver las escuelas</Btn>
              <Btn to="/contacto" variant="secondary" size="lg">Contactar a Edvanta</Btn>
            </>
          )}
        />

        <Section tone="white">
          <SectionHeading eyebrow="Cómo nos organizamos" title="Cuatro escuelas y dos puertas" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {ESCUELAS.map((e) => {
              const Icono = ICONOS_ESCUELA[e.icono];
              return (
                <Link key={e.slug} to={`/escuelas/${e.slug}`} className="group ds-card ds-card--interactive flex items-start gap-4 p-5">
                  <span className="ds-icon-tile h-11 w-11 shrink-0">
                    {Icono && <Icono className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <span>
                    <span className="block font-bold text-edvanta-deep">{e.nombre}</span>
                    <span className="mt-1 block text-sm leading-6 text-edvanta-muted">{e.resumen}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <NavCard to="/contigo" icon={HeartPulse} tone="teal" title="Edvanta Contigo" desc="La puerta para pacientes y cuidadores, con Feliz Sin Tiroides como primera ruta." cta="Conocer Edvanta Contigo" image="/img/publicos/pacientes.webp" imageAlt="Química farmacéutica explicando la tiroides a pacientes y familiares con una tableta" />
            <NavCard to="/instituciones" icon={Building2} title="Para instituciones" desc="Lo que hospitales, IPS, EPS y empresas pueden contratar de todas las escuelas." cta="Ver servicios" image="/img/publicos/instituciones.webp" imageAlt="Presentación de resultados de formación ante el equipo directivo de una institución" />
          </div>
        </Section>

        <Section tone="lavender" bordered>
          <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-center">
            <div className="ds-photo mx-auto aspect-[4/5] w-60 lg:w-full">
              <img src="/img/karla-real.jpg" alt={AUTORA.nombre} width="800" height="1000" loading="lazy" className="object-top" />
            </div>
            <div>
              <SectionHeading eyebrow="Quién está detrás" title={AUTORA.nombre} desc={`${AUTORA.profesion}. ${AUTORA.ciudad}.`} />
              <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
                Está al frente de Edvanta y creó Feliz Sin Tiroides, el programa para personas que viven con una condición tiroidea,
                desde su doble experiencia: la de química farmacéutica y la de paciente que vive sin tiroides.
                Dicta el primer curso en vivo de Edvanta, para auxiliares y regentes de farmacia.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn to="/curso-de-operacion-segura-del-servicio-farmaceutico">Ver el curso en vivo</Btn>
                {LINKEDIN_URL && <Btn href={LINKEDIN_URL} external variant="secondary">LinkedIn</Btn>}
              </div>
            </div>
          </div>
        </Section>

        <Section tone="white">
          <SectionHeading eyebrow="Enfoque académico" title="Así trabajamos" desc="Compromisos que se pueden comprobar en el propio sitio." />
          <ol className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {PRINCIPIOS.map((p, i) => (
              <li key={p.t} className="flex gap-5 border-t border-edvanta-border pt-6">
                <span className="ed-grad-text font-display text-4xl font-extrabold leading-none">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-lg font-bold text-edvanta-deep">{p.t}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-edvanta-muted">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Btn to="/contacto">Contactar a Edvanta</Btn>
            <Btn to="/escuelas" variant="secondary">Ver las escuelas</Btn>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

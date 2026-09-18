/**
 * ============================================================
 *  ProcesosSection.jsx — «¿Qué necesitas hoy?»
 *
 *  Primer cruce de caminos del inicio: manda a cada persona a la
 *  landing del proceso que le sirve, en lugar de dejarla buscando
 *  en el menú. Es el hilo que conecta todas las landing.
 * ============================================================
 */

import { Building2, FileText, GraduationCap, Sparkles } from 'lucide-react';
import { NavCard, Section, SectionHeading } from './ui';

const PROCESOS = [
  {
    to: '/cursos',
    icon: GraduationCap,
    title: 'Quiero formarme',
    desc: 'Cursos con certificado, rutas por cargo y competencias del sector farmacéutico.',
    cta: 'Ver formación',
    tone: 'blue',
  },
  {
    to: '/empleo',
    icon: FileText,
    title: 'Quiero conseguir empleo',
    desc: 'Hoja de vida ATS, correos a recursos humanos y vacantes verificadas.',
    cta: 'Ir al centro de empleo',
    tone: 'teal',
  },
  {
    to: '/talento',
    icon: Sparkles,
    title: 'Quiero que me contacten',
    desc: 'Publica tus logros en la vitrina y espera a que un cazatalento te escriba.',
    cta: 'Publicar mi perfil',
    tone: 'violet',
  },
  {
    to: '/empresas',
    icon: Building2,
    title: 'Represento a una empresa',
    desc: 'Capacita a tu equipo en un aula propia y encuentra talento farmacéutico.',
    cta: 'Entrar como empresa',
    tone: 'blue',
  },
];

export default function ProcesosSection() {
  return (
    <Section id="procesos" tone="surface" bordered>
      <SectionHeading
        eyebrow="Por dónde empezar"
        title="¿Qué necesitas hoy?"
        desc="Cada camino tiene su propia página, con las herramientas y los pasos de ese proceso."
        align="center"
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PROCESOS.map((p) => <NavCard key={p.to} {...p} />)}
      </div>
    </Section>
  );
}

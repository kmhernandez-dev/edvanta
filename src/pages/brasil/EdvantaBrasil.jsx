import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Library, ShieldCheck, Users } from 'lucide-react';
import BrasilLayout from '../../components/brasil/BrasilLayout';
import { BRASIL_ARTIGOS_SEMENTE, BRASIL_CURSOS, BRASIL_GUIAS } from '../../data/brasil';
import { useBrasilSeo } from '../../lib/brasil/seo';
import { trackEvent } from '../../utils/analytics';

const cards = [
  { to: '/br/artigos', icon: BookOpen, title: 'Artigos', text: 'Saúde, medicamentos, qualidade e carreira farmacêutica em português.', count: BRASIL_ARTIGOS_SEMENTE.length },
  { to: '/br/cursos', icon: GraduationCap, title: 'Cursos', text: 'Formação aplicada para a prática clínica, a indústria e a regulação.', count: BRASIL_CURSOS.length },
  { to: '/br/guias', icon: Library, title: 'Guias', text: 'Materiais práticos para estudar, aplicar e revisar decisões profissionais.', count: BRASIL_GUIAS.length },
];

export default function EdvantaBrasil() {
  useBrasilSeo({
    title: 'Edvanta Brasil | Educação farmacêutica em português',
    description: 'Artigos, cursos e guias em português para farmacêuticos, estudantes, pacientes e instituições no Brasil.',
    path: '/br',
    espanhol: '/',
    jsonLd: { '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: 'Edvanta Brasil', url: 'https://edvanta.co/br', parentOrganization: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' } },
  });

  return (
    <BrasilLayout>
      <main>
        <section className="overflow-hidden bg-gradient-to-br from-[#F4FBF7] via-white to-edvanta-soft">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[.18em] text-[#176B3A]">Edvanta Brasil</p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.06] text-edvanta-deep sm:text-6xl">Educação farmacêutica para aprender, aplicar e avançar.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-edvanta-muted">Conteúdo em português do Brasil para quem cuida de medicamentos, qualidade, pacientes e decisões regulatórias.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/br/cursos" onClick={() => trackEvent('brasil_cta', { destination: 'cursos' })} className="ed-btn ed-btn--primary">Explorar cursos <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/br/artigos" className="ed-btn ed-btn--secondary">Ler artigos</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold text-edvanta-muted">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-edvanta-teal" /> Fontes verificáveis</span>
                <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-edvanta-teal" /> Linguagem clara</span>
              </div>
            </div>
            <div className="rounded-[28px] border border-edvanta-border bg-white p-6 shadow-[0_24px_70px_rgba(23,34,59,.13)] sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-edvanta-tealdark">Três portas de entrada</p>
              <div className="mt-5 space-y-3">
                {cards.map(({ to, icon: Icon, title, text, count }) => (
                  <Link key={to} to={to} className="group flex items-start gap-4 rounded-2xl border border-edvanta-border p-4 transition hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-lg">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-edvanta-soft text-edvanta-blue"><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0"><span className="block font-display text-lg font-bold text-edvanta-deep">{title} <span className="text-sm font-medium text-edvanta-muted">{count}</span></span><span className="mt-1 block text-sm leading-6 text-edvanta-muted">{text}</span></span>
                    <ArrowRight className="ml-auto mt-3 h-4 w-4 shrink-0 text-edvanta-blue transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {cards.map(({ to, icon: Icon, title, text }) => (
              <Link key={to} to={to} className="rounded-2xl border border-edvanta-border bg-white p-6 transition hover:border-edvanta-blue/30 hover:shadow-xl">
                <Icon className="h-7 w-7 text-edvanta-teal" />
                <h2 className="mt-5 font-display text-2xl font-bold text-edvanta-deep">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-edvanta-muted">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-edvanta-blue">Ver catálogo <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </BrasilLayout>
  );
}

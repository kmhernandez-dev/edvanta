import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, Globe2, Megaphone, Newspaper } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updatePageSeo } from '../utils/seo';
import { fuentesNoticias, noticiasRecientes } from '../data/careerHub';

export default function NoticiasPage() {
  useEffect(() => updatePageSeo({
    title: 'Noticias del sector farmacéutico en Colombia | Edvanta',
    description: 'Noticias, convocatorias y agenda del sector farmacéutico colombiano con fuentes oficiales verificadas.',
    canonical: 'https://edvanta.co/noticias',
    jsonLdId: 'noticias',
    jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Noticias del sector farmacéutico', url: 'https://edvanta.co/noticias' },
  }), []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras
            </Link>
            <div className="mt-6 flex max-w-3xl items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <Newspaper className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-violet-200">Noticias del sector</p>
                <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">Mantente al día con lo que pasa en el sector farmacéutico</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-violet-50">
                  Agenda, convocatorias y noticias relevantes para el profesional farmacéutico en Colombia, con enlaces a las fuentes oficiales.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-violet-700" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Noticias recientes</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {noticiasRecientes.map(n => (
              <a key={n.titulo} href={n.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-56 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase text-violet-700">{n.fuente}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500"><CalendarDays className="h-3 w-3" />{n.fecha}</span>
                </div>
                <h3 className="mt-3 flex-1 text-base font-bold leading-snug text-[#071a4a] group-hover:text-violet-800">{n.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{n.nota}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-violet-700">Leer en la fuente <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-violet-700" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Fuentes oficiales para seguimiento</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Revisa directamente estas fuentes para convocatorias, normativa y agenda institucional.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fuentesNoticias.map(f => (
                <a key={f.fuente} href={f.url} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-violet-300 hover:bg-violet-50/40">
                  <p className="text-sm font-bold text-[#071a4a] group-hover:text-violet-800">{f.fuente}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{f.resumen}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-violet-700">Abrir <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </a>
              ))}
            </div>
            <div className="mt-10 rounded-xl border border-violet-200 bg-violet-50 p-5">
              <p className="text-sm font-bold text-violet-900">¿Quieres recibir las noticias en tu correo?</p>
              <p className="mt-1 text-sm text-violet-800">EscrÍbenos por WhatsApp y te enviamos el resumen mensual del sector.</p>
              <a href="https://wa.me/573006332244?text=Hola%2C%20quiero%20recibir%20el%20resumen%20mensual%20de%20noticias%20del%20sector%20farmac%C3%A9utico" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-violet-700 px-4 text-sm font-bold text-white transition hover:bg-violet-800">
                Unirme al resumen mensual
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

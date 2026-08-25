import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import { EDVANTA_COMMUNITY_URL } from '../config/links';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

const beneficios = [
  { icon: 'users', titulo: 'Comunidad de Químicos Farmacéuticos', texto: 'Conéctate con colegas que comparten tu mismo interés por crecer profesionalmente.' },
  { icon: 'briefcase', titulo: 'Ofertas y oportunidades laborales', texto: 'Vacantes, prácticas y proyectos compartidos por la comunidad.' },
  { icon: 'message', titulo: 'Retroalimentación real', texto: 'Comparte tu perfil, tus dudas o tus ideas y recibe comentarios de otros profesionales.' },
  { icon: 'book', titulo: 'Aprendizaje colaborativo', texto: 'Grupos de estudio, cursos y retos para avanzar acompañado.' },
];

export default function ComunidadPage() {
  useEffect(() => updatePageSeo({
    title: 'Comunidad de Químicos Farmacéuticos | Edvanta',
    description: 'Únete gratis a la comunidad de Edvanta: cursos, orientación profesional, ofertas de empleo y conexión con otros Químicos Farmacéuticos.',
    canonical: 'https://edvanta.co/comunidad',
    jsonLdId: 'comunidad',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Comunidad Edvanta', url: 'https://edvanta.co/comunidad' },
  }), []);

  const unirse = () => trackEvent('community_clicked', { origin: 'comunidad_page' });

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF2FF] to-white">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3.5 py-1.5 text-xs font-bold uppercase text-sky-700 shadow-sm">
              <Icon name="users" className="h-4 w-4" /> Comunidad Edvanta
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] text-[#071a4a] sm:text-5xl">
              Únete a la comunidad de Químicos Farmacéuticos
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Un grupo abierto y gratuito para conectar con otros profesionales: orientación,
              ofertas, retroalimentación de perfil y aprendizaje colaborativo.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={EDVANTA_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={unirse}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-8 text-base font-bold text-white shadow-lg transition hover:bg-[#1fb959] sm:w-auto"
              >
                <Icon name="whatsapp" className="h-5 w-5" /> Unirme al grupo de WhatsApp
              </a>
              <Link to="/" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 sm:w-auto">
                Explorar cursos gratis
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              Gratis y sin costo. Solo necesitas WhatsApp.
            </p>
          </div>
        </section>

        {/* Beneficios */}
        <section className="border-y border-slate-200 bg-[#f7f9fc] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-[#071a4a] sm:text-3xl">¿Qué encontrarás en la comunidad?</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {beneficios.map(b => (
                <article key={b.titulo} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                    <Icon name={b.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-[#071a4a]">{b.titulo}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{b.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">No avances solo: crece con tu comunidad</h2>
            <p className="mx-auto mt-4 max-w-xl leading-8 text-slate-600">
              Únete al grupo y empieza a recibir novedades de cursos, orientación profesional y
              oportunidades compartidas por otros Químicos Farmacéuticos.
            </p>
            <a
              href={EDVANTA_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={unirse}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-8 text-base font-bold text-white shadow-lg transition hover:bg-[#1fb959]"
            >
              <Icon name="whatsapp" className="h-5 w-5" /> Unirme al grupo
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

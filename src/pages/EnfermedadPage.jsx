import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import FstSectionTitle from '../components/fst/FstSectionTitle';
import EbookCard from '../components/fst/EbookCard';
import Icon from '../components/Icon';
import LeadForm from '../components/LeadForm';
import { getEnfermedad } from '../data/enfermedades';
import { ebooks } from '../data/fst';
import { articulosPorMarca } from '../data/articulos';
import { updatePageSeo } from '../utils/seo';

export default function EnfermedadPage({ slug: propSlug }) {
  const { slug: paramSlug } = useParams();
  const slug = propSlug || paramSlug;
  const enf = getEnfermedad(slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    if (!enf) return;
    const canonical = `https://edvanta.co/enfermedades/${enf.slug}`;
    updatePageSeo({
      title: enf.seo.title,
      description: enf.seo.description,
      canonical,
      type: 'article',
      jsonLdId: `enfermedad-${enf.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            headline: enf.heroTitle,
            description: enf.heroText,
            author: {
              '@type': 'Person',
              name: 'Karla Hernández',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Feliz Sin Tiroides',
              url: 'https://edvanta.co/feliz-sin-tiroides',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonical,
            },
          },
          {
            '@type': 'FAQPage',
            mainEntity: enf.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
              { '@type': 'ListItem', position: 2, name: 'Feliz Sin Tiroides', item: 'https://edvanta.co/feliz-sin-tiroides' },
              { '@type': 'ListItem', position: 3, name: enf.name, item: canonical },
            ],
          },
        ],
      },
    });
  }, [enf]);

  if (!enf) return <Navigate to="/feliz-sin-tiroides" replace />;

  const guiasFiltradas = ebooks.filter(eb => enf.guias.includes(eb.id));
  const artsFST = articulosPorMarca('fst');
  const artsFiltrados = artsFST.filter(a => enf.articulos.includes(a.slug));

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />

      <section className="relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-gradient-to-b from-white via-sand-50 to-white">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.12),transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-teal-100 rounded-full shadow-sm mb-6">
              <span className="text-base">🦋</span>
              <span className="text-xs font-semibold text-teal-700">Enfermedades tiroideas</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-deepblue-900 leading-[1.15] mb-5">
              {enf.heroTitle}
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-7 max-w-lg mx-auto md:mx-0">
              {enf.heroText}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a href="#recursos" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors shadow-sm">
                Ver recursos para esta condición
              </a>
              <a href="#articulos" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-teal-700 text-sm font-semibold rounded-full border border-teal-200 hover:bg-teal-50 transition-colors">
                Leer artículos
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="w-full aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-teal-100 via-sand-100 to-blush-100 flex items-center justify-center shadow-lg">
              <span className="text-7xl">🦋</span>
            </div>
          </div>
        </div>
      </section>

      <section id="introduccion" className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle eyebrow="Información educativa" title={`¿Qué es el ${enf.name.toLowerCase()}?`} />

          <div className="mb-10">
            <h3 className="font-serif text-xl font-semibold text-deepblue-900 mb-3">Definición</h3>
            <p className="text-gray-600 leading-relaxed">{enf.intro.what}</p>
          </div>

          <div className="mb-10">
            <h3 className="font-serif text-xl font-semibold text-deepblue-900 mb-3">Causas frecuentes</h3>
            <ul className="space-y-2">
              {enf.intro.causes.map((c, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-10">
            <h3 className="font-serif text-xl font-semibold text-deepblue-900 mb-3">Síntomas más comunes</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {enf.intro.symptoms.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600 bg-sand-50 rounded-xl p-3">
                  <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="font-serif text-xl font-semibold text-deepblue-900 mb-3">¿Cómo se diagnostica?</h3>
            <p className="text-gray-600 leading-relaxed">{enf.intro.diagnosis}</p>
          </div>

          <div className="mb-10">
            <h3 className="font-serif text-xl font-semibold text-deepblue-900 mb-3">Tratamiento</h3>
            <p className="text-gray-600 leading-relaxed">{enf.intro.treatment}</p>
          </div>

          <div className="mb-10">
            <h3 className="font-serif text-xl font-semibold text-deepblue-900 mb-3">Importancia del seguimiento médico</h3>
            <p className="text-gray-600 leading-relaxed">{enf.intro.followUp}</p>
          </div>

          <div className="mb-10">
            <h3 className="font-serif text-xl font-semibold text-deepblue-900 mb-3">Errores frecuentes que cometen los pacientes</h3>
            <ul className="space-y-2">
              {enf.intro.commonMistakes.map((e, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blush-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blush-500 text-xs font-bold">!</span>
                  </span>
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
            <h3 className="font-serif text-lg font-semibold text-deepblue-900 mb-2">¿Qué puedes aprender a gestionar?</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{enf.intro.patientRole}</p>
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Descargo de responsabilidad médica:</strong> esta información es educativa y no sustituye la consulta, diagnóstico ni tratamiento de tu médico o profesional de salud. No suspendas ni modifiques tu medicación sin indicación profesional. Ante una urgencia, acude a tu servicio de salud.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-sand-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle center eyebrow="Empieza por aquí" title="Ruta de aprendizaje sugerida"
            subtitle="Sigue estos pasos para comprender tu condición y aprender a cuidarte mejor." />
          <div className="space-y-4">
            {enf.learningPath.map((step, i) => (
              <Link
                key={i}
                to={step.link}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-sand-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-base font-semibold text-deepblue-900 group-hover:text-teal-700 transition-colors">{step.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-teal-500 shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {guiasFiltradas.length > 0 && (
        <section id="recursos" className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FstSectionTitle center eyebrow="Guías recomendadas" title={`Recursos para ${enf.name.toLowerCase()}`}
              subtitle="Material práctico y descargable, creado con mirada farmacéutica y lenguaje cercano." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guiasFiltradas.map(eb => <EbookCard key={eb.id} ebook={eb} />)}
            </div>
          </div>
        </section>
      )}

      {artsFiltrados.length > 0 && (
        <section id="articulos" className="py-16 md:py-20 bg-sand-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FstSectionTitle center eyebrow="Artículos educativos" title="Aprende más sobre este tema"
              subtitle="Contenido basado en evidencia, escrito en lenguaje claro y orientado al paciente." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {artsFiltrados.map(a => (
                <Link
                  key={a.slug}
                  to={`/articulos/${a.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-sand-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-teal-500 to-blush-400 flex items-end p-4">
                    <span className="chip bg-white/90 text-deepblue-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{a.category}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-2">
                    <h3 className="text-base font-bold text-deepblue-900 leading-snug group-hover:text-teal-700 transition-colors">{a.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">{a.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 mt-1">
                      {a.readingTime} · Leer artículo
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-gradient-to-br from-teal-50 via-sand-50 to-blush-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FstSectionTitle center eyebrow="Sin costo" title="Recursos gratuitos"
            subtitle="Descarga herramientas prácticas para tu autocuidado." />
          <div className="grid sm:grid-cols-2 gap-3 text-left mb-8">
            {enf.recursosGratis.map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-sand-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                  <Icon name={r.icon} className="w-5 h-5 text-teal-600" />
                </div>
                <p className="text-sm font-medium text-deepblue-800">{r.title}</p>
              </div>
            ))}
          </div>
          <LeadForm />
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle center eyebrow="¿Tienes dudas?" title="Preguntas frecuentes" />
          <div className="space-y-3">
            {enf.faqs.map((faq, i) => (
              <details key={i} className="group bg-sand-50 rounded-2xl border border-sand-100 overflow-hidden">
                <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-deepblue-900 text-left">{faq.q}</span>
                  <svg className="w-5 h-5 text-teal-500 shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-deepblue-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">🦋</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">¿Necesitas acompañamiento personalizado?</h2>
          <p className="text-white/70 leading-relaxed mb-7">
            Si tienes dudas sobre tu condición, tus medicamentos o cómo aplicar esta información a tu caso particular, Karla puede orientarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/feliz-sin-tiroides#fst-ebooks" className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold rounded-full transition-colors">
              Ver todas las guías
            </a>
            <a href="/feliz-sin-tiroides#fst-servicios" className="inline-flex items-center justify-center gap-2 px-7 py-3 text-teal-300 text-sm font-semibold rounded-full border border-teal-500/30 hover:bg-white/10 transition-colors">
              Conocer los servicios
            </a>
          </div>
        </div>
      </section>

      <FstFooter />
    </div>
  );
}

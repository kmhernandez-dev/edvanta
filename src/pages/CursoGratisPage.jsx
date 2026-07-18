import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courses, COURSE_CATEGORIES } from '../data/courses';
import { articulos } from '../data/articulos';
import { updatePageSeo } from '../utils/seo';

function getRelatedArticles(courseName) {
  const name = courseName.toLowerCase();
  return articulos.filter(a => {
    const text = `${a.title} ${a.description} ${a.category}`.toLowerCase();
    return text.includes(name) || name.split(' ').some(w => w.length > 4 && text.includes(w));
  }).slice(0, 3);
}

export default function CursoGratisPage() {
  const { courseId } = useParams();
  const course = useMemo(() => courses.find(c => c.id === courseId), [courseId]);

  useEffect(() => { window.scrollTo(0, 0); }, [courseId]);

  useEffect(() => {
    if (!course) return;
    updatePageSeo({
      title: `${course.name} | Curso gratuito recomendado por Edvanta`,
      description: `Curso gratuito de ${course.name} (${course.code}). ${course.category}. Accede gratis en Edutin Academy.`,
      canonical: `https://edvanta.co/cursos-gratis/${course.id}`,
      type: 'website',
      jsonLdId: `course-${course.id}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Course',
            name: course.name,
            description: `Curso gratuito de ${course.name} en Edutin Academy. Categoría: ${course.category}.`,
            url: `https://edvanta.co/cursos-gratis/${course.id}`,
            courseMode: 'online',
            isAccessibleForFree: true,
            provider: { '@type': 'Organization', name: 'Edutin Academy' },
            publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co/' },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
              { '@type': 'ListItem', position: 2, name: 'Cursos gratis', item: 'https://edvanta.co/cursos-gratis' },
              { '@type': 'ListItem', position: 3, name: course.name, item: `https://edvanta.co/cursos-gratis/${course.id}` },
            ],
          },
        ],
      },
    });
  }, [course]);

  if (!course) return <Navigate to="/cursos-gratis" replace />;

  const relatedArticles = getRelatedArticles(course.name);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-900 to-teal-700 text-white py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="hover:text-white">Inicio</Link>
              <span>/</span>
              <Link to="/cursos-gratis" className="hover:text-white">Cursos gratis</Link>
              <span>/</span>
              <span className="text-white/80">{course.name}</span>
            </nav>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-teal-200 text-xs font-semibold rounded-full mb-4">
              {course.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{course.name}</h1>
            <p className="text-base text-white/80 leading-relaxed max-w-2xl">
              Curso gratuito de {course.category.toLowerCase()} ofrecido por Edutin Academy. Código: {course.code}.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                A tu ritmo
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                100% virtual
              </span>
              <span className="flex items-center gap-1.5 text-teal-200 font-medium">Gratuito</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-navy-950 mb-3">Sobre este curso</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  <strong>{course.name}</strong> es un curso gratuito de <strong>{course.category.toLowerCase()}</strong> disponible en Edutin Academy. 
                  Está diseñado para personas que quieren aprender sobre {course.name.toLowerCase()} de forma práctica y a su propio ritmo.
                </p>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Categoría</p>
                    <p className="text-sm font-semibold text-navy-900">{course.category}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Código</p>
                    <p className="text-sm font-mono font-semibold text-navy-900">{course.code}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Modalidad</p>
                    <p className="text-sm font-semibold text-navy-900">100% virtual</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Acceso</p>
                    <p className="text-sm font-semibold text-teal-600">Gratuito</p>
                  </div>
                </div>
              </div>

              {/* Perfiles */}
              {course.profiles && course.profiles.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-navy-950 mb-3">Perfiles recomendados</h2>
                  <div className="flex flex-wrap gap-2">
                    {course.profiles.map(p => (
                      <span key={p} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-100">
                        {p === 'salud' ? '🏥 Salud' : p === 'farmacia' ? '💊 Farmacia' : p === 'datos' ? '📊 Datos' : p === 'calidad' ? '✅ Calidad' : p === 'hseq' ? '🛡️ HSEQ' : p === 'logistica' ? '🚚 Logística' : p === 'marketing' ? '📢 Marketing' : p === 'empleabilidad' ? '💼 Empleabilidad' : p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-br from-teal-50 to-sand-50 rounded-2xl border border-teal-100 p-6">
                <h2 className="text-lg font-bold text-navy-950 mb-2">¿Listo para empezar?</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Accede gratis a este curso en Edutin Academy. El contenido académico es gratuito. La certificación puede tener un costo opcional.
                </p>
                <a
                  href={course.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
                >
                  Acceder al curso gratis
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Related articles */}
              {relatedArticles.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-navy-950 mb-4">Artículos relacionados</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {relatedArticles.map(a => (
                      <Link key={a.slug} to={`/articulos/${a.slug}`}
                        className="group flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-teal-200 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy-900 group-hover:text-teal-700 transition-colors line-clamp-2">{a.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{a.readingTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24">
                <h3 className="text-sm font-bold text-navy-950 mb-3">Información del curso</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Proveedor</span>
                    <span className="font-semibold text-navy-900">Edutin Academy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Código</span>
                    <span className="font-mono text-navy-900">{course.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Categoría</span>
                    <span className="text-navy-900">{course.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modalidad</span>
                    <span className="text-navy-900">Virtual</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Acceso</span>
                    <span className="text-teal-600 font-semibold">Gratuito</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Certificado</span>
                    <span className="text-amber-600">Opcional (pago)</span>
                  </div>
                </div>
                <a
                  href={course.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Ir al curso
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Transparencia:</strong> Edvanta puede recibir una comisión si te inscribes mediante este enlace. Esto no modifica el precio ni condiciona nuestro criterio editorial. El contenido académico es gratuito; la certificación puede tener un costo opcional determinado por Edutin Academy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

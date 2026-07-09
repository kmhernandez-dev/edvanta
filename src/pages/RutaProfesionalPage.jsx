import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import CourseImage from '../components/CourseImage';
import { getArticulo } from '../data/articulos';
import { getFeaturedCourse, getLearningRoute } from '../data/featuredCourses';
import { updatePageSeo } from '../utils/seo';

export default function RutaProfesionalPage() {
  const { slug } = useParams();
  const route = getLearningRoute(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!route) return undefined;
    const cleanup = updatePageSeo({
      title: `${route.title} | Ruta profesional Edvanta`,
      description: route.summary,
      canonical: `https://edvanta.co/rutas/${route.slug}`,
      image: 'https://edvanta.co/img/cursos/gestion-de-calidad.webp',
      jsonLdId: `route-${route.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: route.title,
        description: route.summary,
        url: `https://edvanta.co/rutas/${route.slug}`,
        itemListElement: route.courseSlugs.map((courseSlug, index) => {
          const course = getFeaturedCourse(courseSlug);
          return {
            '@type': 'ListItem',
            position: index + 1,
            name: course?.title || courseSlug,
            url: `https://edvanta.co/cursos/${courseSlug}`,
          };
        }),
      },
    });
    return cleanup;
  }, [route]);

  if (!route) return <Navigate to="/" replace />;

  const courses = route.courseSlugs.map(getFeaturedCourse).filter(Boolean);
  const articles = route.articleSlugs.map(getArticulo).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16">
        <section className="bg-slate-50 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="font-medium text-teal-700 hover:underline">Inicio</Link>
              <span>/</span>
              <Link to="/#rutas" className="font-medium text-teal-700 hover:underline">Rutas profesionales</Link>
              <span>/</span>
              <span>{route.title}</span>
            </nav>
            <div className="max-w-3xl">
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Icon name={route.icon} className="h-6 w-6" />
              </span>
              <h1 className="text-3xl font-bold text-navy-950 md:text-5xl">{route.title}</h1>
              <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">{route.summary}</p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Orden sugerido</p>
              <h2 className="text-2xl font-bold text-navy-950">Avanza con esta secuencia</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {courses.map((course, index) => (
                <Link
                  key={course.slug}
                  to={`/cursos/${course.slug}`}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <CourseImage course={course} className="aspect-video w-full object-cover" />
                  <div className="p-5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-navy-950 group-hover:text-teal-700">{course.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{course.shortDescription}</p>
                    {course.pendingAffiliateLabel && (
                      <p className="mt-3 text-xs font-semibold text-amber-700">Enlace afiliado pendiente de configuración.</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-12 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Competencias</p>
              <h2 className="text-2xl font-bold text-navy-950">Qué deberías poder demostrar</h2>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                La ruta combina cursos recomendados y artículos de Edvanta para que construyas evidencia de aprendizaje.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {route.outcomes.map((outcome) => (
                <div key={outcome} className="rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-navy-950">
                  {outcome}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Lecturas recomendadas</p>
                <h2 className="text-2xl font-bold text-navy-950">Artículos para acompañar la ruta</h2>
              </div>
              <Link to="/articulos" className="text-sm font-semibold text-teal-700 hover:underline">Ver biblioteca de artículos</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.slug} to={`/articulos/${article.slug}`} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-widest text-teal-600">{article.category}</p>
                  <h3 className="mt-2 text-base font-bold leading-snug text-navy-950">{article.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{article.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

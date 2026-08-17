import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExternalCourseCard from '../components/ExternalCourseCard';
import CursoPage from './CursoPage';
import { getFeaturedCourse } from '../data/featuredCourses';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

const PROVIDER_LABELS = {
  edutin: 'Edutin',
  coursera: 'Coursera',
  udemy: 'Udemy',
};

const PRICE_TYPE_LABELS = {
  free: 'Gratis',
  free_audit: 'Auditoría gratuita (contenido sin certificado)',
  paid: 'De pago',
  subscription: 'Por suscripción',
  financial_aid: 'Ayuda financiera disponible',
  unknown: 'Consultar en la plataforma',
};

const LEVEL_LABELS = {
  beginner: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  mixed: 'Mixto',
  unknown: 'No especificado',
};

const MODALITY_LABELS = {
  self_paced: 'A tu ritmo',
  instructor_led: 'Guiado por instructor',
  specialization: 'Especialización',
  professional_certificate: 'Certificado profesional',
  guided_project: 'Proyecto guiado',
  course: 'Curso',
  unknown: 'No especificado',
};

function buildSeoDescription(course) {
  if (course.short_description) return course.short_description;

  const parts = [];
  const provider = PROVIDER_LABELS[course.provider] || course.provider;

  parts.push(`Curso${course.modality === 'specialization' ? ' (especialización)' : course.modality === 'professional_certificate' ? ' (certificado profesional)' : ''} de ${course.title}`);

  if (course.institution) parts.push(`ofrecido por ${course.institution}`);
  parts.push(`en ${provider}`);

  if (course.category) parts.push(`dentro de la categoría ${course.category}`);
  if (course.subcategory) parts.push(`(${course.subcategory})`);

  if (course.level && course.level !== 'unknown') {
    parts.push(`Nivel: ${LEVEL_LABELS[course.level] || course.level}`);
  }

  if (course.language && course.language !== 'unknown') {
    parts.push(`Idioma: ${course.language}`);
  }

  const access = PRICE_TYPE_LABELS[course.price_type] || course.price_type;
  parts.push(`Acceso: ${access}`);

  if (course.certificate_available) {
    parts.push(course.certificate_included ? 'Certificado incluido' : 'Certificado disponible');
  }

  parts.push('Encuentra este curso en Edvanta y accede mediante enlace de afiliado.');

  return parts.join('. ');
}

function trackClick(course) {
  const url = course.affiliate_url || course.original_url;
  if (!url) return;

  fetch(apiUrl('/api/course-clicks'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      course_id: course.id,
      provider: course.provider,
      destination_url: url,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    }),
  }).catch(() => {});

  trackEvent('affiliate_click', {
    course_id: String(course.id || course.slug),
    provider: course.provider || '',
    source_page: typeof window !== 'undefined' ? window.location.pathname : '',
  });

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'affiliate_course_click', {
      course_id: course.id,
      course_title: course.title,
      provider: course.provider,
      destination_url: url,
    });
  }
}

export default function CursoExternoPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Check if this is a featured course (static data)
  const featuredCourse = getFeaturedCourse(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    // If it's a featured course, CursoPage handles its own data
    if (featuredCourse) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);
    fetch(apiUrl(`/api/courses/${slug}`))
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setCourse(d.data);
          setRelated(d.related || []);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, featuredCourse]);

  useEffect(() => {
    if (!course || featuredCourse) return;
    trackEvent('course_viewed', { course_id: String(course.id || course.slug), provider: course.provider || '' });
    const canonical = `https://edvanta.co/cursos/${course.slug}`;
    const providerName = PROVIDER_LABELS[course.provider] || course.provider;
    const seoTitle = `${course.title} | ${providerName} | Edvanta`;
    const seoDescription = buildSeoDescription(course);

    updatePageSeo({
      title: seoTitle,
      description: seoDescription,
      canonical,
      jsonLdId: `course-${course.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Course',
            name: course.title,
            description: seoDescription,
            url: canonical,
            courseMode: 'online',
            provider: {
              '@type': 'Organization',
              name: providerName,
              url: course.original_url || course.affiliate_url,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Edvanta',
              url: 'https://edvanta.co/',
            },
            ...(course.institution && { educationalCredentialAwarded: course.institution }),
            ...(course.language && course.language !== 'unknown' && { inLanguage: course.language }),
            ...(course.level && course.level !== 'unknown' && { educationalLevel: LEVEL_LABELS[course.level] || course.level }),
            ...(course.price_type === 'free' || course.price_type === 'free_audit' ? { isAccessibleForFree: true } : {}),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
              { '@type': 'ListItem', position: 2, name: 'Cursos', item: 'https://edvanta.co/cursos' },
              { '@type': 'ListItem', position: 3, name: course.title, item: canonical },
            ],
          },
        ],
      },
    });
  }, [course, featuredCourse]);

  // Render featured course with its rich static page
  if (featuredCourse) {
    return <CursoPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16">
          <div className="mx-auto max-w-7xl px-4 py-20">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-10 bg-gray-100 rounded w-2/3" />
              <div className="h-6 bg-gray-100 rounded w-1/2" />
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-8 mt-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                </div>
                <div className="h-64 bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound) return <Navigate to="/cursos" replace />;

  const ctaUrl = course.affiliate_url || course.original_url;
  const providerLabel = PROVIDER_LABELS[course.provider] || course.provider;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="bg-slate-50 py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
              <Link to="/" className="font-medium text-teal-700 hover:underline">Inicio</Link>
              <span aria-hidden="true">/</span>
              <Link to="/cursos" className="font-medium text-teal-700 hover:underline">Cursos</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/cursos/${course.provider}`} className="font-medium text-teal-700 hover:underline">{providerLabel}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-gray-400 truncate max-w-[200px]">{course.title}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    course.provider === 'coursera' ? 'bg-blue-100 text-blue-800' :
                    course.provider === 'udemy' ? 'bg-purple-100 text-purple-800' :
                    'bg-teal-100 text-teal-800'
                  }`}>
                    {providerLabel}
                  </span>
                  {course.category && (
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                      {course.category}
                    </span>
                  )}
                  {course.featured && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-800">
                      Destacado
                    </span>
                  )}
                </div>

                <h1 className="max-w-3xl text-3xl font-bold leading-tight text-navy-950 md:text-5xl">
                  {course.title}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                  {buildSeoDescription(course)}
                </p>

                {/* Meta pills */}
                <div className="mt-6 flex flex-wrap gap-2 text-sm text-gray-600">
                  {course.modality && course.modality !== 'unknown' && (
                    <span className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                      {MODALITY_LABELS[course.modality] || course.modality}
                    </span>
                  )}
                  {course.level && course.level !== 'unknown' && (
                    <span className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                      {LEVEL_LABELS[course.level] || course.level}
                    </span>
                  )}
                  {course.language && course.language !== 'unknown' && (
                    <span className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                      {course.language}
                    </span>
                  )}
                  {course.duration && (
                    <span className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                      {course.duration}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {ctaUrl ? (
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      onClick={() => trackClick(course)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm"
                    >
                      {course.price_type === 'free' ? 'Acceder gratis' :
                       course.price_type === 'free_audit' ? 'Auditar curso' :
                       course.price_type === 'subscription' ? 'Ver en plataforma' :
                       'Ver curso en ' + providerLabel}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed">
                      Enlace no disponible
                    </span>
                  )}
                </div>

                {course.affiliate_url && (
                  <p className="mt-3 text-xs text-gray-400">
                    Enlace de afiliado. Edvanta puede recibir una comisión sin costo adicional para ti.
                  </p>
                )}
              </div>

              {/* Sidebar info card */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-bold text-navy-950">Información del curso</h2>

                <div className="space-y-3 text-sm">
                  {course.institution && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Institución</p>
                      <p className="font-semibold text-navy-900">{course.institution}</p>
                    </div>
                  )}
                  {course.instructor && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Instructor</p>
                      <p className="font-semibold text-navy-900">{course.instructor}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Tipo de acceso</p>
                    <p className="font-semibold text-navy-900">{PRICE_TYPE_LABELS[course.price_type] || course.price_type}</p>
                  </div>
                  {course.certificate_available && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Certificado</p>
                      <p className="font-semibold text-navy-900">
                        {course.certificate_included ? 'Incluido' : 'Disponible (puede tener costo)'}
                      </p>
                    </div>
                  )}
                  {course.rating && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Calificación</p>
                      <p className="font-semibold text-navy-900 flex items-center gap-1">
                        <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {Number(course.rating).toFixed(1)}
                        {course.review_count ? <span className="text-gray-400 font-normal">({course.review_count} reseñas)</span> : null}
                      </p>
                    </div>
                  )}
                  {course.current_price !== null && course.current_price !== undefined && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Precio de referencia</p>
                      <p className="font-semibold text-navy-900">
                        {course.currency === 'COP' ? '$' : course.currency === 'USD' ? 'US$' : ''}
                        {Number(course.current_price).toLocaleString()}
                        {course.original_price && course.original_price > course.current_price && (
                          <span className="ml-2 text-xs text-gray-400 line-through">
                            {course.currency === 'COP' ? '$' : course.currency === 'USD' ? 'US$' : ''}
                            {Number(course.original_price).toLocaleString()}
                          </span>
                        )}
                      </p>
                      {course.provider === 'udemy' && (
                        <p className="text-xs text-amber-600 mt-1">El precio puede variar según promociones vigentes en Udemy.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        {course.skills && course.skills.length > 0 && (
          <section className="py-10 md:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-navy-950 mb-4">Habilidades que puedes desarrollar</h2>
              <div className="flex flex-wrap gap-2">
                {course.skills.map(skill => (
                  <span key={skill} className="rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Full description */}
        {course.full_description && (
          <section className="py-10 md:py-14 bg-slate-50">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-navy-950 mb-4">Descripción del curso</h2>
              <div className="prose prose-slate max-w-none text-gray-600">
                {course.full_description}
              </div>
            </div>
          </section>
        )}

        {/* Learning outcomes */}
        {course.learning_outcomes && course.learning_outcomes.length > 0 && (
          <section className="py-10 md:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-navy-950 mb-4">Lo que aprenderás</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {course.learning_outcomes.map((item, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-navy-900">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Transparency notice */}
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 space-y-3">
              <h2 className="text-lg font-bold text-amber-900">Información importante</h2>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>Este curso es ofrecido por <strong>{providerLabel}</strong>. Edvanta no dicta ni certifica este curso.</li>
                <li>El acceso, precio, certificado y condiciones dependen exclusivamente de {providerLabel}.</li>
                {course.affiliate_url && (
                  <li>Este enlace es de afiliado. Edvanta puede recibir una comisión si realizas una compra, sin costo adicional para ti.</li>
                )}
                {course.provider === 'coursera' && course.price_type === 'free_audit' && (
                  <li>Puedes acceder al contenido en modo auditoría sin costo. El certificado puede requerir pago o suscripción.</li>
                )}
                {course.provider === 'coursera' && course.price_type === 'subscription' && (
                  <li>Este programa requiere suscripción a Coursera. Puede aplicar ayuda financiera en algunos casos.</li>
                )}
                {course.provider === 'udemy' && (
                  <li>Los precios en Udemy pueden variar según promociones y descuentos temporales. El precio mostrado es referencial.</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* Related courses */}
        {related.length > 0 && (
          <section className="py-10 md:py-14 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-navy-950 mb-6">Cursos relacionados</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {related.map(c => (
                  <ExternalCourseCard key={c.id} course={c} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA final */}
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-navy-950 mb-4">Explora más cursos</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/cursos" className="px-6 py-3 bg-navy-900 text-white text-sm font-semibold rounded-lg hover:bg-navy-800 transition-colors">
                Ver todos los cursos
              </Link>
              <Link to="/cursos/coursera" className="px-6 py-3 border border-gray-200 text-navy-900 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Cursos de Coursera
              </Link>
              <Link to="/cursos/udemy" className="px-6 py-3 border border-gray-200 text-navy-900 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Cursos de Udemy
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

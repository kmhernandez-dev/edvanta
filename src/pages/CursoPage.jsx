import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import CourseImage from '../components/CourseImage';
import AffiliateCourseButton from '../components/AffiliateCourseButton';
import { articulos, getArticulo } from '../data/articulos';
import { featuredCourses, getFeaturedCourse } from '../data/featuredCourses';
import { updatePageSeo } from '../utils/seo';

function ListBlock({ title, items, icon = 'checkCircle' }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-navy-950">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-600">
            <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CourseDetailTabs({ course }) {
  const groups = [
    { id: 'skills', label: 'Competencias', title: 'Habilidades que puedes fortalecer', items: course.skills, icon: 'checkCircle' },
    { id: 'topics', label: 'Temario', title: 'Conceptos clave del curso', items: course.topics, icon: 'book' },
    { id: 'applications', label: 'Aplicaciones', title: 'Acciones para llevarlo al trabajo', items: course.applications, icon: 'briefcase' },
  ];
  const [activeId, setActiveId] = useState(groups[0].id);
  const activeGroup = groups.find((group) => group.id === activeId) || groups[0];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {groups.map((group) => {
          const active = group.id === activeId;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveId(group.id)}
              aria-pressed={active}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition ${
                active
                  ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800'
              }`}
            >
              <Icon name={group.icon} className="h-4 w-4" />
              {group.label}
            </button>
          );
        })}
      </div>

      <h3 className="text-lg font-black text-navy-950">{activeGroup.title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {activeGroup.items.map((item, index) => (
          <div key={item} className="flex gap-3 rounded-lg bg-slate-50 p-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-teal-700 shadow-sm">
              {index + 1}
            </span>
            <p className="text-sm font-semibold leading-relaxed text-navy-900">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CursoPage() {
  const { slug } = useParams();
  const course = getFeaturedCourse(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!course) return undefined;
    const canonical = `https://edvanta.co/cursos/${course.slug}`;
    const cleanup = updatePageSeo({
      title: `${course.title} | Curso recomendado por Edvanta`,
      description: course.shortDescription,
      canonical,
      image: `https://edvanta.co${course.image.webp}`,
      type: 'website',
      jsonLdId: `course-${course.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Course',
            name: course.title,
            description: course.shortDescription,
            url: canonical,
            image: `https://edvanta.co${course.image.webp}`,
            courseMode: 'online',
            isAccessibleForFree: true,
            provider: {
              '@type': 'Organization',
              name: 'Plataforma educativa',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Edvanta',
              url: 'https://edvanta.co/',
            },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
              { '@type': 'ListItem', position: 2, name: 'Cursos', item: 'https://edvanta.co/#cursos' },
              { '@type': 'ListItem', position: 3, name: course.title, item: canonical },
            ],
          },
        ],
      },
    });
    return cleanup;
  }, [course]);

  if (!course) return <Navigate to="/" replace />;

  const relatedArticles = course.relatedArticleSlugs.map(getArticulo).filter(Boolean);
  const complementaryCourses = course.complementaryCourseSlugs.map(getFeaturedCourse).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16">
        <section className="bg-slate-50 py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="font-medium text-teal-700 hover:underline">Inicio</Link>
              <span>/</span>
              <Link to="/#cursos" className="font-medium text-teal-700 hover:underline">Cursos</Link>
              <span>/</span>
              <span>{course.title}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-teal-600">{course.category}</p>
                <h1 className="max-w-3xl text-3xl font-bold leading-tight text-navy-950 md:text-5xl">
                  Curso de {course.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="rounded-lg border border-gray-200 bg-white px-3 py-2">{course.duration}</span>
                  <span className="rounded-lg border border-gray-200 bg-white px-3 py-2">{course.modality}</span>
                  <span className="rounded-lg border border-gray-200 bg-white px-3 py-2">Certificación opcional</span>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <AffiliateCourseButton course={course} sourceSection="course_page" className="px-6 py-3">
                    Inscribirme gratis
                  </AffiliateCourseButton>
                  <Link to="/articulos" className="btn-secondary px-6 py-3">
                    Ver artículos relacionados
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <CourseImage course={course} variant="poster" loading="eager" className="mx-auto max-h-[760px] w-auto max-w-full object-contain" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <ListBlock title="Para quién es" items={course.audience} icon="users" />
            <ListBlock title="Competencias que fortalece" items={course.skills} icon="checkCircle" />
            <ListBlock title="Aplicaciones prácticas" items={course.applications} icon="briefcase" />
          </div>
        </section>

        <section className="bg-slate-50 py-12 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Contenido orientativo</p>
              <h2 className="text-2xl font-bold text-navy-950 md:text-3xl">Qué deberías aprender</h2>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Edvanta organiza una ruta clara para que sepas qué aprender, cómo aplicarlo y qué habilidades puedes fortalecer con este curso.
              </p>
            </div>
            <CourseDetailTabs course={course} />
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                <h2 className="text-lg font-bold text-amber-900">Transparencia sobre certificación</h2>
                <p className="mt-3 text-sm leading-relaxed text-amber-800">
                  El acceso al contenido académico puede ser gratuito. La certificación puede tener un costo opcional,
                  determinado por la plataforma educativa. Edvanta puede recibir una comisión si accedes desde un enlace afiliado.
                </p>
                {course.pendingAffiliateLabel && (
                  <p className="mt-3 text-sm font-semibold text-amber-900">
                    {course.pendingAffiliateLabel}: enlace pendiente de validación.
                  </p>
                )}
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold text-navy-950">Preguntas frecuentes</h2>
                <div className="space-y-3">
                  {course.faqs.map((faq) => (
                    <details key={faq.question} className="rounded-lg border border-gray-200 bg-white p-4">
                      <summary className="cursor-pointer text-sm font-bold text-navy-950">{faq.question}</summary>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Sigue aprendiendo</p>
                <h2 className="text-2xl font-bold text-navy-950">Artículos y cursos complementarios</h2>
              </div>
              <Link to="/articulos" className="text-sm font-semibold text-teal-700 hover:underline">Ver todos los artículos</Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="grid gap-4">
                {relatedArticles.map((article) => (
                  <Link key={article.slug} to={`/articulos/${article.slug}`} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <p className="text-xs font-bold uppercase tracking-widest text-teal-600">{article.category}</p>
                    <h3 className="mt-2 text-base font-bold text-navy-950">{article.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{article.description}</p>
                  </Link>
                ))}
              </div>

              <div className="grid gap-4">
                {complementaryCourses.map((item) => (
                  <Link key={item.slug} to={`/cursos/${item.slug}`} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                    <CourseImage course={item} className="h-20 w-32 shrink-0 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Curso complementario</p>
                      <h3 className="mt-1 text-base font-bold text-navy-950">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.duration} · {item.modality}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

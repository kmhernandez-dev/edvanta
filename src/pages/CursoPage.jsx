import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import CourseImage from '../components/CourseImage';
import AffiliateCourseButton from '../components/AffiliateCourseButton';
import EdutinCourseListWidget from '../components/EdutinCourseListWidget';
import CursoExternoPage from './CursoExternoPage';
import { articulos, getArticulo } from '../data/articulos';
import { featuredCourses, getFeaturedCourse } from '../data/featuredCourses';
import { getCourseLearningContent } from '../data/courseLearningContent';
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

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">{eyebrow}</p>}
      <h2 className="text-2xl font-bold leading-tight text-navy-950 md:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-relaxed text-gray-600">{description}</p>}
    </div>
  );
}

function NumberedGrid({ items }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <div key={item} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-black text-teal-700">
            {index + 1}
          </span>
          <p className="text-sm font-semibold leading-relaxed text-navy-900">{item}</p>
        </div>
      ))}
    </div>
  );
}

function StudyTimeline({ items }) {
  return (
    <div className="mt-6 space-y-3">
      {items.map((item, index) => (
        <div key={item.title} className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[7rem_1fr]">
          <div className="text-sm font-black text-teal-700">Paso {index + 1}</div>
          <div>
            <h3 className="text-base font-bold text-navy-950">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.goal}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourceLinks({ items }) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600">{item.source}</p>
          <h3 className="mt-2 text-base font-bold text-navy-950 group-hover:text-teal-700">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy-900">
            Leer recurso
            <span aria-hidden="true">↗</span>
          </span>
        </a>
      ))}
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
  const learningContent = course ? getCourseLearningContent(course.slug) : null;
  const courseFaqs = useMemo(
    () => (course ? [...course.faqs, ...(learningContent?.extraFaqs || [])] : []),
    [course, learningContent]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!course) return undefined;
    const canonical = `https://edvanta.co/cursos/${course.slug}`;
    const seoTitle = learningContent?.seoTitle || `${course.title} | Curso recomendado por Edvanta`;
    const seoDescription = learningContent?.seoDescription || course.shortDescription;
    const cleanup = updatePageSeo({
      title: seoTitle,
      description: seoDescription,
      canonical,
      image: `https://edvanta.co${course.image.webp}`,
      type: 'website',
      keywords: learningContent?.keywords,
      jsonLdId: `course-${course.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Course',
            name: course.title,
            description: seoDescription,
            url: canonical,
            image: `https://edvanta.co${course.image.webp}`,
            courseMode: 'online',
            isAccessibleForFree: true,
            teaches: course.skills,
            keywords: learningContent?.keywords?.join(', '),
            about: learningContent?.keywords,
            provider: {
              '@type': 'Organization',
              name: 'Edutin Academy',
              url: course.affiliateUrl,
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
          {
            '@type': 'FAQPage',
            mainEntity: courseFaqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
          ...(learningContent?.complementaryReadings?.length
            ? [
                {
                  '@type': 'ItemList',
                  name: `Lecturas complementarias para ${course.title}`,
                  itemListElement: learningContent.complementaryReadings.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.title,
                    url: item.url,
                  })),
                },
              ]
            : []),
        ],
      },
    });
    return cleanup;
  }, [course, learningContent, courseFaqs]);

  if (!course) return <CursoExternoPage />;

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
                  {learningContent?.h1 || `Curso de ${course.title}`}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                  {learningContent?.seoDescription || course.description}
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
                  <a href="#guia-del-curso" className="btn-secondary px-6 py-3">
                    Ver guía educativa
                  </a>
                </div>

                {learningContent?.keywords?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {learningContent.keywords.slice(0, 5).map((keyword) => (
                      <span key={keyword} className="rounded-full border border-teal-100 bg-white px-3 py-1 text-xs font-semibold text-teal-800">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <CourseImage course={course} variant="poster" loading="eager" className="mx-auto max-h-[760px] w-auto max-w-full object-contain" />
              </div>
            </div>
          </div>
        </section>

        <EdutinCourseListWidget />

        {learningContent && (
          <section id="guia-del-curso" className="py-12 md:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
              <article>
                <SectionHeading
                  eyebrow="Guía informativa Edvanta"
                  title={`Por qué estudiar ${course.title}`}
                  description="Una página de curso debe ayudarte a decidir, estudiar mejor y saber cómo convertir el aprendizaje en evidencia profesional."
                />
                <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600">
                  {learningContent.intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>

              <aside className="rounded-lg border border-teal-100 bg-teal-50 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
                    <Icon name="sparkles" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Opinión de Edvanta</p>
                    <h2 className="text-xl font-bold text-navy-950">Cómo vemos este curso</h2>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-gray-700">{learningContent.edvantaOpinion}</p>
              </aside>
            </div>
          </section>
        )}

        <section className="py-12 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <ListBlock title="Para quién es" items={course.audience} icon="users" />
            <ListBlock title="Competencias que fortalece" items={course.skills} icon="checkCircle" />
            <ListBlock title="Aplicaciones prácticas" items={course.applications} icon="briefcase" />
          </div>
        </section>

        {learningContent?.outcomes?.length > 0 && (
          <section className="bg-white pb-12 md:pb-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="Resultados de aprendizaje"
                title="Qué deberías poder hacer al terminar"
                description="Estos resultados te ayudan a estudiar con intención, validar tu avance y construir un portafolio que muestre aplicación real."
              />
              <NumberedGrid items={learningContent.outcomes} />
            </div>
          </section>
        )}

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

        {learningContent && (
          <section id="como-estudiar" className="py-12 md:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
              <div>
                <SectionHeading
                  eyebrow="Método de estudio"
                  title={`Cómo estudiar ${course.title} para que sí se note en tu perfil`}
                  description="La diferencia entre ver un curso y aprovecharlo está en practicar, documentar y convertir cada tema en una evidencia."
                />
                <div className="mt-6 space-y-4">
                  {learningContent.studyAdvice.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-relaxed text-gray-600">{paragraph}</p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-navy-950">Plan recomendado de estudio</h3>
                <StudyTimeline items={learningContent.studyPlan} />
              </div>
            </div>
          </section>
        )}

        {learningContent?.practiceProjects?.length > 0 && (
          <section className="bg-slate-50 py-12 md:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
              <SectionHeading
                eyebrow="Portafolio"
                title="Proyectos prácticos para demostrar lo aprendido"
                description="Estos ejercicios convierten el curso en resultados visibles. Puedes adaptarlos a tu trabajo, estudio, emprendimiento o caso personal."
              />
              <NumberedGrid items={learningContent.practiceProjects} />
            </div>
          </section>
        )}

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
                  {courseFaqs.map((faq) => (
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

        {learningContent && (
          <section className="bg-white py-12 md:py-16">
            <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeading
                  eyebrow="Evita estos errores"
                  title="Lo que suele frenar el aprendizaje"
                  description="Estos puntos te ayudan a estudiar con más criterio y a evitar una experiencia superficial."
                />
                <div className="mt-6 space-y-4">
                  {learningContent.mistakes.map((item, index) => (
                    <div key={item} className="flex gap-3 border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-black text-amber-700">
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold leading-relaxed text-navy-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-teal-100 bg-teal-50 p-6">
                <SectionHeading
                  eyebrow="Checklist Edvanta"
                  title="Antes de decir que terminaste"
                  description="Usa esta lista como control rápido para validar si el curso dejó habilidades aplicables."
                />
                <div className="mt-6 space-y-4">
                  {learningContent.checklist.map((item) => (
                    <div key={item} className="flex gap-3 border-t border-teal-100 pt-4 first:border-t-0 first:pt-0">
                      <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <p className="text-sm font-semibold leading-relaxed text-navy-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {learningContent?.complementaryReadings?.length > 0 && (
          <section id="lecturas-complementarias" className="bg-slate-50 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="Lecturas complementarias"
                title="Recursos externos para profundizar"
                description="Edvanta redirige a fuentes externas reconocidas para que puedas contrastar conceptos, ampliar criterio y estudiar con mejores referencias."
              />
              <ResourceLinks items={learningContent.complementaryReadings} />
            </div>
          </section>
        )}

        <section className="bg-white py-12 md:py-16">
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

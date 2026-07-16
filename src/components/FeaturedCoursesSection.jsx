import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AffiliateCourseButton from './AffiliateCourseButton';
import CourseImage from './CourseImage';
import Icon from './Icon';
import { featuredCourses, learningRoutes, getFeaturedCourse, courseAccentClasses } from '../data/featuredCourses';

const routeOptions = [
  {
    slug: 'todos',
    title: 'Todos',
    summary: 'Explora cursos con alto potencial laboral y elige por interés, duración o aplicación inmediata.',
    icon: 'sparkles',
    courseSlugs: featuredCourses.map((course) => course.slug),
  },
  ...learningRoutes.map((route) => ({
    slug: route.slug,
    title: route.title,
    summary: route.summary,
    icon: route.icon,
    courseSlugs: route.courseSlugs,
  })),
];

export default function FeaturedCoursesSection() {
  const [activeRoute, setActiveRoute] = useState(routeOptions[0].slug);
  const [selectedSlug, setSelectedSlug] = useState(featuredCourses[0].slug);

  const activeOption = routeOptions.find((route) => route.slug === activeRoute) || routeOptions[0];
  const visibleCourses = useMemo(
    () => activeOption.courseSlugs.map(getFeaturedCourse).filter(Boolean),
    [activeOption],
  );
  const selectedCourse = visibleCourses.find((course) => course.slug === selectedSlug) || visibleCourses[0] || featuredCourses[0];

  const handleRouteChange = (route) => {
    setActiveRoute(route.slug);
    setSelectedSlug(route.courseSlugs[0]);
  };

  return (
    <section id="cursos" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Cursos gratis recomendados</p>
          <h2 className="text-2xl font-bold text-navy-950 md:text-3xl">
            Aprende una habilidad que abre puertas y aplícala desde el primer día
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-500">
            Seleccionamos cursos con alto valor profesional y los conectamos con rutas, artículos y herramientas para que avances con foco.
          </p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {routeOptions.map((route) => {
            const active = route.slug === activeRoute;
            return (
              <button
                key={route.slug}
                type="button"
                onClick={() => handleRouteChange(route)}
                aria-pressed={active}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? 'border-navy-900 bg-navy-950 text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800'
                }`}
              >
                <Icon name={route.icon} className="h-4 w-4" />
                {route.title}
              </button>
            );
          })}
        </div>

        <div className="mb-8 grid overflow-hidden rounded-lg border border-navy-100 bg-gradient-to-br from-slate-50 via-white to-teal-50 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-5 md:p-7">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-teal-600">Ruta activa</p>
            <h3 className="text-2xl font-black text-navy-950 md:text-3xl">{activeOption.title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">{activeOption.summary}</p>

            <div className="mt-6 rounded-lg border border-white bg-white/80 p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Curso destacado</p>
                  <h4 className="mt-1 text-xl font-black text-navy-950">{selectedCourse.title}</h4>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">{selectedCourse.shortDescription}</p>
                </div>
                <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${courseAccentClasses[selectedCourse.accent] || courseAccentClasses.teal}`}>
                  <Icon name={selectedCourse.icon} className="h-6 w-6" />
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {selectedCourse.applications.slice(0, 3).map((item) => (
                  <span key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold leading-snug text-navy-900">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <AffiliateCourseButton course={selectedCourse} sourceSection="featured_spotlight" className="px-5 py-3">
                  Inscribirme gratis
                </AffiliateCourseButton>
                <Link to={`/cursos/${selectedCourse.slug}`} className="btn-secondary px-5 py-3">
                  Ver plan del curso
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-navy-950">
            <div className="absolute inset-0 bg-dots opacity-20" />
            <div className="absolute left-5 top-5 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-black uppercase tracking-wider text-navy-950 shadow-sm">
              {selectedCourse.duration} · {selectedCourse.modality}
            </div>
            <CourseImage
              course={selectedCourse}
              variant="poster"
              loading="eager"
              className="absolute bottom-0 left-1/2 h-[96%] max-h-[650px] w-auto -translate-x-1/2 rounded-t-lg object-contain shadow-2xl transition duration-500"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visibleCourses.map((course) => (
            <article
              key={course.slug}
              onMouseEnter={() => setSelectedSlug(course.slug)}
              onFocus={() => setSelectedSlug(course.slug)}
              className={`group flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                selectedCourse.slug === course.slug ? 'border-teal-300 ring-2 ring-teal-100' : 'border-gray-200'
              }`}
            >
              <Link to={`/cursos/${course.slug}`} className="relative block overflow-hidden bg-slate-100">
                <CourseImage
                  course={course}
                  variant="poster"
                  className="aspect-[941/1672] w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wide text-navy-950 shadow-sm">
                  Curso gratis
                </span>
                <span className="absolute bottom-3 left-3 right-3 rounded-lg bg-navy-950/90 px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                  {course.duration} · {course.modality}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                    {course.category}
                  </span>
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${courseAccentClasses[course.accent] || courseAccentClasses.teal}`}>
                    <Icon name={course.icon} className="h-5 w-5" />
                  </span>
                </div>

                <h3 className="text-lg font-bold leading-snug text-navy-950">
                  <Link to={`/cursos/${course.slug}`} className="hover:text-teal-700">
                    {course.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                  {course.shortDescription}
                </p>

                <div className="mt-4 space-y-2">
                  {course.skills.slice(0, 2).map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                      <Icon name="checkCircle" className="h-4 w-4 shrink-0 text-teal-600" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <AffiliateCourseButton course={course} sourceSection="featured_courses" className="w-full">
                    Inscribirme gratis
                  </AffiliateCourseButton>
                  <Link
                    to={`/cursos/${course.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-navy-50"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-gray-500">
          Puedes estudiar el contenido académico sin costo. La certificación puede tener un valor opcional definido por la plataforma educativa.
        </p>
      </div>
    </section>
  );
}

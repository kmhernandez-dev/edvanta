import { Link } from 'react-router-dom';
import AffiliateCourseButton from './AffiliateCourseButton';
import CourseImage from './CourseImage';
import Icon from './Icon';
import { featuredCourses, courseAccentClasses } from '../data/featuredCourses';

export default function FeaturedCoursesSection() {
  return (
    <section id="cursos" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Cursos recomendados</p>
          <h2 className="text-2xl font-bold text-navy-950 md:text-3xl">
            Cursos más recomendados para fortalecer tu perfil profesional
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-500">
            Accede a formación virtual en calidad, datos, auditoría, sostenibilidad, seguridad laboral y mejora de procesos.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredCourses.map((course) => (
            <article
              key={course.slug}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Link to={`/cursos/${course.slug}`} className="block overflow-hidden bg-gray-100">
                <CourseImage
                  course={course}
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
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

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="rounded-md bg-slate-50 px-2 py-1">{course.duration}</span>
                  <span className="rounded-md bg-slate-50 px-2 py-1">{course.modality}</span>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    to={`/cursos/${course.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-navy-50"
                  >
                    Ver curso
                  </Link>
                  <AffiliateCourseButton course={course} sourceSection="featured_courses" className="w-full">
                    Ir a la plataforma
                  </AffiliateCourseButton>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-gray-500">
          El acceso al contenido académico puede ser gratuito. La certificación puede tener un costo opcional,
          determinado por la plataforma educativa.
        </p>
      </div>
    </section>
  );
}

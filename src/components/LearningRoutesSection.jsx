import { Link } from 'react-router-dom';
import Icon from './Icon';
import { learningRoutes, featuredCourses } from '../data/featuredCourses';

const bySlug = Object.fromEntries(featuredCourses.map((course) => [course.slug, course]));

export default function LearningRoutesSection() {
  return (
    <section id="rutas" className="bg-slate-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Rutas profesionales</p>
          <h2 className="text-2xl font-bold text-navy-950 md:text-3xl">
            Elige una ruta según tu objetivo profesional
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-500">
            Cada ruta organiza cursos, artículos y competencias para que avances con una secuencia clara.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {learningRoutes.map((route) => (
            <Link
              key={route.slug}
              to={`/rutas/${route.slug}`}
              className="group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Icon name={route.icon} className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-navy-950 group-hover:text-teal-700">{route.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{route.summary}</p>
              <div className="mt-4 space-y-2">
                {route.courseSlugs.map((slug, index) => (
                  <div key={slug} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy-50 text-[10px] text-navy-800">
                      {index + 1}
                    </span>
                    {bySlug[slug]?.title || slug}
                  </div>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                Ver ruta
                <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

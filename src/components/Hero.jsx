import { useState } from 'react';
import CourseImage from './CourseImage';
import { featuredCourses } from '../data/featuredCourses';

const stats = [
  { value: '+6.000', label: 'Cursos gratis' },
  { value: '4', label: 'Rutas clave' },
  { value: '100%', label: 'Herramientas aplicables' },
];

const heroCourseSlugs = [
  'gestion-de-calidad',
  'seguridad-y-salud-en-el-trabajo',
  'power-bi',
  'lean-six-sigma',
  'gestion-de-proyectos',
];

const heroCourses = heroCourseSlugs
  .map((slug) => featuredCourses.find((course) => course.slug === slug))
  .filter(Boolean);

export default function Hero({ onExploreProducts, onExploreCourses }) {
  const [activeSlug, setActiveSlug] = useState(heroCourses[0]?.slug);
  const activeCourse = heroCourses.find((course) => course.slug === activeSlug) || heroCourses[0];

  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pb-14 pt-24 md:pb-16 md:pt-28">
      <div className="absolute inset-0 bg-dots opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div className="text-center md:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span className="text-xs font-semibold text-teal-700">
                Cursos gratis · Herramientas listas · Rutas para crecer
              </span>
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Edvanta</p>
            <h1 className="mb-5 text-3xl font-bold leading-tight text-navy-950 sm:text-4xl md:text-5xl">
              Cursos <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">GRATIS</span> y herramientas para crecer profesionalmente
            </h1>

            <p className="mx-auto mb-7 max-w-lg text-base leading-relaxed text-gray-500 sm:text-lg md:mx-0">
              Encuentra formación virtual, rutas inteligentes y recursos prácticos para aprender más rápido,
              aplicar mejor y mostrar un perfil profesional más fuerte.
            </p>

            <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row md:items-start md:justify-start">
              <button onClick={onExploreCourses} className="btn-primary w-full px-6 py-3 text-sm sm:w-auto">
                Ver cursos gratis
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button onClick={onExploreProducts} className="btn-secondary w-full px-6 py-3 text-sm sm:w-auto">
                Ver herramientas listas
              </button>
            </div>

            <div className="flex items-center justify-center gap-5 sm:gap-8 md:justify-start">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-5 sm:gap-8">
                  {i > 0 && <span className="h-8 w-px bg-gray-200" />}
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-extrabold text-navy-950">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[610px]">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_88px] md:gap-4 lg:grid-cols-[minmax(0,1fr)_104px]">
              <button
                type="button"
                onClick={onExploreCourses}
                className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 text-left shadow-xl shadow-navy-950/10 transition hover:-translate-y-1 hover:shadow-2xl"
                aria-label={`Ver curso ${activeCourse.title}`}
              >
                <CourseImage
                  course={activeCourse}
                  variant="poster"
                  loading="eager"
                  className="aspect-[941/1672] max-h-[560px] w-full rounded-xl object-cover object-top"
                />
                <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
                  Curso gratis
                </div>
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur">
                  <p className="text-[11px] font-black uppercase tracking-wider text-gray-400">{activeCourse.category}</p>
                  <h2 className="mt-1 text-xl font-black leading-tight text-navy-950 md:text-2xl">{activeCourse.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-navy-900">
                    <span className="rounded-full bg-slate-100 px-3 py-1">{activeCourse.duration}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{activeCourse.modality}</span>
                  </div>
                </div>
              </button>

              <div className="grid grid-cols-5 gap-2 sm:grid-cols-1">
                {heroCourses.map((course) => {
                  const active = course.slug === activeCourse.slug;
                  return (
                    <button
                      key={course.slug}
                      type="button"
                      onMouseEnter={() => setActiveSlug(course.slug)}
                      onFocus={() => setActiveSlug(course.slug)}
                      onClick={() => setActiveSlug(course.slug)}
                      aria-label={`Mostrar ${course.title}`}
                      aria-pressed={active}
                      className={`relative h-20 overflow-hidden rounded-xl border bg-white p-1 shadow-sm transition sm:h-[96px] lg:h-[104px] ${
                        active
                          ? 'border-teal-400 ring-2 ring-teal-100'
                          : 'border-gray-200 hover:border-teal-200 hover:ring-2 hover:ring-teal-50'
                      }`}
                    >
                      <CourseImage
                        course={course}
                        variant="poster"
                        className="h-full w-full rounded-lg object-cover object-top"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-gray-100 bg-white/85 p-3 text-center text-xs font-semibold text-gray-600 shadow-sm backdrop-blur">
              <span>Aprende gratis</span>
              <span>Aplica mejor</span>
              <span>Crece con foco</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

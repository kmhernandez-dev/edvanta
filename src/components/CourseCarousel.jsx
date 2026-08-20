import { useCallback, useRef, useState } from 'react';
import { trackAffiliateCourseClick } from '../data/featuredCourses';
import { apiUrl } from '../config/api';

/**
 * Carrusel de cursos (Los más populares / Lo más nuevo).
 * - Desktop: 4 tarjetas visibles, tablet 2–3, mobile ~1.3.
 * - scroll-snap horizontal, swipe, trackpad, botones anterior/siguiente.
 */
export default function CourseCarousel({ title, courses, sectionKey }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollByAmount = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-carousel-card]');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const handleClick = (course) => {
    trackAffiliateCourseClick(course, { sourceSection: sectionKey });
    fetch(apiUrl('/api/course-clicks'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: course.edutinId || null,
        provider: 'edutin',
        destination_url: course.destinationUrl,
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    }).catch(() => {});
  };

  return (
    <section className="py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep md:text-3xl">{title}</h2>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              disabled={!canPrev}
              aria-label="Anterior"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-edvanta-border bg-white text-edvanta-deep transition hover:bg-edvanta-light disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              disabled={!canNext}
              aria-label="Siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-edvanta-border bg-white text-edvanta-deep transition hover:bg-edvanta-light disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={updateButtons}
          className="edvanta-scrollbar-thin flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
        >
          {courses.map((course) => (
            <article
              key={course.id}
              data-carousel-card
              className="w-[calc(100%-1.5rem)] max-w-[320px] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
            >
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-edvanta-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative block overflow-hidden bg-slate-100">
                  <img
                    src={course.image.jpg}
                    alt={course.image.alt}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-snug text-navy-950">{course.title}</h3>
                  {course.description && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-2">{course.description}</p>
                  )}

                  <div className="mt-5 flex flex-col gap-2">
                    {course.destinationUrl ? (
                      <a
                        href={course.destinationUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        onClick={() => handleClick(course)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-edvanta-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-edvanta-bluedark"
                      >
                        Inscribirme gratis
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17 17 7M8 7h9v9" />
                        </svg>
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-500">
                        Enlace pendiente
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

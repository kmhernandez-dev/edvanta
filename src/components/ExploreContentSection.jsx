import { useRef, useState } from 'react';
import { ACADEMY_SECTIONS } from '../data/academyCourses';
import { PlatformBadge } from './PlatformBadge';

/**
 * Explora el contenido — carruseles por academia.
 * Misma estructura que "Los más populares" / "Lo más nuevo":
 * 4 tarjetas visibles en desktop que se deslizan horizontalmente.
 */
export default function ExploreContentSection() {
  return (
    <section id="explora-contenido" className="bg-edvanta-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow-edvanta mb-2">Especialización farmacéutica</p>
          <h2 className="font-display text-2xl font-extrabold text-edvanta-deep md:text-3xl">Explora el contenido</h2>
          <p className="mt-3 text-base leading-relaxed text-gray-500">
            Formación curada por academia del mapa profesional del Químico Farmacéutico.
          </p>
        </div>

        <div className="space-y-14">
          {ACADEMY_SECTIONS.map((section) => (
            <AcademyCarousel key={section.id} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AcademyCarousel({ section }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scrollByAmount = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-academy-card]');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-extrabold text-edvanta-deep md:text-2xl">{section.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{section.courses.length} cursos curados</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            disabled={!canPrev}
            aria-label="Anterior"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-edvanta-border bg-white text-edvanta-deep transition hover:bg-edvanta-light disabled:opacity-40"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-edvanta-border bg-white text-edvanta-deep transition hover:bg-edvanta-light disabled:opacity-40"
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
        {section.courses.map((course) => (
          <article
            key={course.id}
            data-academy-card
            className="w-[calc(100%-1.5rem)] max-w-[320px] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
          >
            <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-edvanta-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative block overflow-hidden bg-slate-100">
                {course.image ? (
                  <img
                    src={course.image.jpg}
                    alt={course.image.alt || course.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-edvanta-light via-white to-edvanta-mint/40">
                    <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-edvanta-blue shadow-sm">
                      <PlatformBadge provider={course.provider} />
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2">
                  <PlatformBadge provider={course.provider} />
                </div>
                <h4 className="flex-1 text-sm font-bold leading-snug text-navy-950">{course.title}</h4>

                <div className="mt-4">
                  <a
                    href={course.destinationUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-edvanta-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-edvanta-bluedark"
                  >
                    Ver curso
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

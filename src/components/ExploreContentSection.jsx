import { useMemo, useRef, useState } from 'react';
import {
  PROFESSIONAL_AREAS,
  getCoursesForTopic,
  getCoursesForArea,
  getAreaStats,
  getAreasForFilter,
  searchAreas,
} from '../data/catalogMaster';
import { ACADEMY_SECTIONS } from '../data/academyCourses';
import { PlatformBadge } from './PlatformBadge';

const QUICK_FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'calidad', label: 'Calidad' },
  { id: 'validaciones', label: 'Validaciones' },
  { id: 'control-calidad', label: 'Control de Calidad' },
  { id: 'produccion', label: 'Producción' },
  { id: 'farmacia-clinica', label: 'Farmacia Clínica' },
  { id: 'hospitalaria', label: 'Hospitalaria' },
  { id: 'farmacovigilancia', label: 'Farmacovigilancia' },
  { id: 'regulatorio', label: 'Regulatorio' },
  { id: 'investigacion', label: 'Investigación' },
  { id: 'logistica', label: 'Logística' },
  { id: 'tecnologia', label: 'Tecnología' },
];

export default function ExploreContentSection() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [expanded, setExpanded] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [search, setSearch] = useState('');

  const areas = useMemo(() => {
    if (activeFilter === 'todos') return PROFESSIONAL_AREAS;
    return getAreasForFilter(activeFilter);
  }, [activeFilter]);

  const moreResults = useMemo(() => searchAreas(search), [search]);

  const stats = useMemo(() => {
    const totalTopics = PROFESSIONAL_AREAS.reduce((acc, a) => acc + a.topics.length, 0);
    const topicsWithContent = PROFESSIONAL_AREAS.reduce(
      (acc, a) => acc + a.topics.filter((t) => getCoursesForTopic(t.key).length > 0).length,
      0,
    );
    return { totalTopics, topicsWithContent };
  }, []);

  const handleAreaClick = (areaId) => {
    setExpanded((current) => (current === areaId ? null : areaId));
  };

  return (
    <section id="explora-contenido" className="bg-edvanta-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow-edvanta mb-2">Especialización farmacéutica</p>
          <h2 className="font-display text-2xl font-extrabold text-edvanta-deep md:text-3xl">Explora el contenido</h2>
          <p className="mt-3 text-base leading-relaxed text-gray-500">
            Navega el mapa profesional del Químico Farmacéutico: {PROFESSIONAL_AREAS.length} áreas, {stats.totalTopics} competencias y solo la formación ya curada y disponible.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {QUICK_FILTERS.map((filter) => {
            const active = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => { setActiveFilter(filter.id); setExpanded(null); }}
                aria-pressed={active}
                className={`inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? 'border-edvanta-blue bg-edvanta-blue text-white shadow-md'
                    : 'border-edvanta-border bg-white text-slate-600 hover:border-edvanta-blue/40 hover:bg-edvanta-light hover:text-edvanta-blue'
                }`}
              >
                {filter.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-edvanta-border bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-edvanta-blue/40 hover:bg-edvanta-light hover:text-edvanta-blue"
          >
            Más áreas
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {areas.map((area) => {
            const stats = getAreaStats(area.id);
            const isOpen = expanded === area.id;
            const areaCourses = getCoursesForArea(area.id);
            return (
              <div key={area.id} className="overflow-hidden rounded-2xl border border-edvanta-border bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => handleAreaClick(area.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-edvanta-light/50 md:px-6"
                >
                  <div>
                    <h3 className="font-display text-base font-bold text-edvanta-deep md:text-lg">{area.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {stats.totalTopics} temas · {stats.courseCount} formación{stats.courseCount === 1 ? '' : 'es'} disponible{stats.courseCount === 1 ? '' : 's'}
                    </p>
                  </div>
                  <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-edvanta-border text-edvanta-blue transition ${isOpen ? 'rotate-180 bg-edvanta-light' : ''}`}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-edvanta-border bg-edvanta-cream/40 px-5 py-5 md:px-6">
                    <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                      {area.topics.map((topic) => {
                        const topicCourses = getCoursesForTopic(topic.key);
                        return (
                          <div key={topic.key} className="flex flex-col gap-1.5 rounded-lg border border-edvanta-border bg-white p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-navy-950">{topic.title}</span>
                              {topicCourses.length > 0 ? (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700">
                                  {topicCourses.length} formación{topicCourses.length === 1 ? '' : 'es'}
                                </span>
                              ) : (
                                <span className="inline-flex shrink-0 items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                                  Sin tarjeta todavía
                                </span>
                              )}
                            </div>

                            {topicCourses.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {topicCourses.map((course) =>
                                  course.destinationUrl ? (
                                    <a
                                      key={course.id}
                                      href={course.destinationUrl}
                                      target="_blank"
                                      rel="sponsored noopener noreferrer"
                                      className="inline-flex items-center gap-1 rounded-full border border-edvanta-border bg-white px-2.5 py-1 text-xs font-semibold text-edvanta-blue transition hover:border-edvanta-blue hover:bg-edvanta-light"
                                    >
                                      {course.title}
                                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17 17 7M8 7h9v9" />
                                      </svg>
                                    </a>
                                  ) : (
                                    <span
                                      key={course.id}
                                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-500"
                                    >
                                      {course.title} · Enlace pendiente
                                    </span>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {areaCourses.length > 0 && (
                      <div className="mt-4 rounded-lg bg-teal-50/70 p-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-700">
                          Cursos de esta área
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {areaCourses.map((course) =>
                            course.destinationUrl ? (
                              <a
                                key={course.id}
                                href={course.destinationUrl}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 transition hover:border-teal-400"
                              >
                                {course.title}
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17 17 7M8 7h9v9" />
                                </svg>
                              </a>
                            ) : (
                              <span
                                key={course.id}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-500"
                              >
                                {course.title} · Enlace pendiente
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-gray-500">
          {stats.topicsWithContent} de {stats.totalTopics} competencias tienen formación curada disponible. Las demás están en curaduría y se activarán automáticamente cuando haya contenido real.
        </p>
      </div>

      {/* Carruseles por academia — mismo formato que Los más populares / Lo más nuevo */}
      <div className="mt-14 space-y-14">
        {ACADEMY_SECTIONS.map((section) => (
          <AcademyCarousel key={section.id} section={section} />
        ))}
      </div>

      {moreOpen && (
        <MoreAreasModal
          onClose={() => setMoreOpen(false)}
          search={search}
          setSearch={setSearch}
          results={moreResults}
          onSelect={(areaId) => {
            setExpanded(areaId);
            setMoreOpen(false);
            setSearch('');
          }}
        />
      )}
    </section>
  );
}

function MoreAreasModal({ onClose, search, setSearch, results, onSelect }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-edvanta-border bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-edvanta-border bg-edvanta-cream px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-lg font-bold text-edvanta-deep">Todas las áreas profesionales</h3>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-edvanta-border bg-white text-gray-500 transition hover:bg-edvanta-light">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Busca un área o competencia: HPLC, CAPA, INVIMA, farmacovigilancia..."
            className="mt-3 w-full rounded-xl border border-edvanta-border bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-light"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No encontramos áreas que coincidan con tu búsqueda. Escríbenos por WhatsApp y te orientamos.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {results.map((area) => {
                const stats = getAreaStats(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => onSelect(area.id)}
                    className="flex items-start justify-between gap-2 rounded-xl border border-edvanta-border bg-white px-4 py-3 text-left transition hover:border-edvanta-blue hover:bg-edvanta-light"
                  >
                    <div>
                      <p className="text-sm font-bold text-navy-950">{area.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{stats.totalTopics} temas</p>
                    </div>
                    <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                      {stats.topicsWithCourses > 0 ? `${stats.topicsWithCourses} con formación` : 'Sin formación aún'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
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
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-edvanta-blue shadow-sm">
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

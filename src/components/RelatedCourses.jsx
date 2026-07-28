import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { PlatformBadge, PriceTypeBadge } from './PlatformBadge';

export default function RelatedCourses({ category, currentSlug, limit = 4 }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) { setLoading(false); return; }
    setLoading(true);
    const params = new URLSearchParams({ category, limit: String(limit + 2) });
    fetch(apiUrl(`/api/courses?${params.toString()}`))
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          const filtered = (d.data || [])
            .filter(c => c.slug !== currentSlug)
            .slice(0, limit);
          setCourses(filtered);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, currentSlug, limit]);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-950 mb-6">Cursos relacionados</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Sigue aprendiendo</p>
          <h2 className="text-2xl font-bold text-navy-950">Cursos relacionados</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map(course => {
            const ctaUrl = course.affiliate_url || course.original_url;
            return (
              <div key={course.id} className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="aspect-[16/9] bg-gradient-to-br from-navy-100 to-teal-100 flex items-center justify-center relative">
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-3xl opacity-40">
                      {course.provider === 'coursera' ? '🎓' : course.provider === 'udemy' ? '📚' : '📖'}
                    </span>
                  )}
                  <span className="absolute top-2 left-2">
                    <PlatformBadge provider={course.provider} />
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1 gap-1.5">
                  {course.category && (
                    <p className="text-[11px] font-bold text-teal-600 uppercase tracking-widest line-clamp-1">{course.category}</p>
                  )}
                  <h3 className="text-sm font-bold leading-snug text-navy-950 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  {course.institution && (
                    <p className="text-xs text-gray-400 line-clamp-1">{course.institution}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-auto pt-2">
                    {course.price_type && <PriceTypeBadge priceType={course.price_type} />}
                    {course.language && course.language !== 'unknown' && (
                      <span className="text-[10px] text-gray-400">{course.language === 'Spanish' ? 'ES' : course.language === 'English' ? 'EN' : course.language}</span>
                    )}
                  </div>
                  {ctaUrl && (
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="mt-2 block w-full text-center px-3 py-2 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
                    >
                      Ver curso
                      <svg className="inline-block w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

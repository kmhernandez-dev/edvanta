import { trackAffiliateCourseClick } from '../data/featuredCourses';

export default function AffiliateCourseButton({
  course,
  sourceSection,
  articleSlug = null,
  className = '',
  children = 'Acceder al curso',
}) {
  if (!course.affiliateUrl) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className={`inline-flex items-center justify-center rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-500 cursor-not-allowed ${className}`}
        >
          Enlace pendiente
        </button>
        <p className="text-xs text-amber-700">
          Enlace del curso pendiente de configuración.
        </p>
      </div>
    );
  }

  return (
    <a
      href={course.affiliateUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={() => trackAffiliateCourseClick(course, { sourceSection, articleSlug })}
      className={`btn-primary ${className}`}
    >
      {children}
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17 17 7M8 7h9v9" />
      </svg>
    </a>
  );
}

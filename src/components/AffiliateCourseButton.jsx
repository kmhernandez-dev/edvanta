import { trackAffiliateCourseClick } from '../data/featuredCourses';
import { apiUrl } from '../config/api';

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

  const handleClick = () => {
    trackAffiliateCourseClick(course, { sourceSection, articleSlug });

    // Registrar clic en el backend
    fetch(apiUrl('/api/course-clicks'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: null,
        provider: 'edutin',
        destination_url: course.affiliateUrl,
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    }).catch(() => {});
  };

  return (
    <a
      href={course.affiliateUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      className={`btn-primary ${className}`}
    >
      {children}
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17 17 7M8 7h9v9" />
      </svg>
    </a>
  );
}

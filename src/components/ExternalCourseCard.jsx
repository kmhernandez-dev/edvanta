import { apiUrl } from '../config/api';

const PROVIDER_LABELS = {
  edutin: 'Edutin',
  coursera: 'Coursera',
  udemy: 'Udemy',
};

const PROVIDER_STYLES = {
  edutin: 'bg-teal-100 text-teal-800',
  coursera: 'bg-blue-100 text-blue-800',
  udemy: 'bg-purple-100 text-purple-800',
};

const PRICE_TYPE_LABELS = {
  free: 'Gratis',
  free_audit: 'Auditoría gratuita',
  paid: 'De pago',
  subscription: 'Suscripción',
  financial_aid: 'Ayuda financiera',
  unknown: 'Consultar',
};

const PRICE_TYPE_STYLES = {
  free: 'bg-emerald-100 text-emerald-800',
  free_audit: 'bg-teal-100 text-teal-800',
  paid: 'bg-amber-100 text-amber-800',
  subscription: 'bg-indigo-100 text-indigo-800',
  financial_aid: 'bg-sky-100 text-sky-800',
  unknown: 'bg-gray-100 text-gray-600',
};

const LEVEL_LABELS = {
  beginner: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  mixed: 'Mixto',
  unknown: '',
};

const MODALITY_LABELS = {
  self_paced: 'A tu ritmo',
  instructor_led: 'Guiado por instructor',
  specialization: 'Especialización',
  professional_certificate: 'Certificado profesional',
  guided_project: 'Proyecto guiado',
  course: 'Curso',
  unknown: '',
};

function trackClick(course) {
  const url = course.affiliate_url || course.original_url;
  if (!url) return;

  fetch(apiUrl('/api/course-clicks'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      course_id: course.id,
      provider: course.provider,
      destination_url: url,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    }),
  }).catch(() => {});

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'affiliate_course_click', {
      course_id: course.id,
      course_title: course.title,
      provider: course.provider,
      destination_url: url,
    });
  }
}

export default function ExternalCourseCard({ course }) {
  const providerLabel = PROVIDER_LABELS[course.provider] || course.provider;
  const providerStyle = PROVIDER_STYLES[course.provider] || 'bg-gray-100 text-gray-600';
  const priceLabel = PRICE_TYPE_LABELS[course.price_type] || course.price_type;
  const priceStyle = PRICE_TYPE_STYLES[course.price_type] || 'bg-gray-100 text-gray-600';
  const levelLabel = LEVEL_LABELS[course.level];
  const modalityLabel = MODALITY_LABELS[course.modality];
  const ctaUrl = course.affiliate_url || course.original_url;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image area */}
      <div className="aspect-[16/9] bg-gradient-to-br from-navy-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
        {course.image_url ? (
          <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="text-center px-4">
            <span className="text-3xl opacity-40">
              {course.provider === 'coursera' ? '🎓' : course.provider === 'udemy' ? '📚' : '📖'}
            </span>
          </div>
        )}

        {/* Provider badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${providerStyle}`}>
          {providerLabel}
        </span>

        {/* Featured badge */}
        {course.featured && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-800">
            Destacado
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category */}
        {course.category && (
          <p className="text-[11px] font-bold text-teal-600 uppercase tracking-widest line-clamp-1">
            {course.category}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-bold leading-snug text-navy-950 group-hover:text-teal-700 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Institution / Instructor */}
        {(course.institution || course.instructor) && (
          <p className="text-xs text-gray-400 line-clamp-1">
            {course.institution || course.instructor}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priceStyle}`}>
            {priceLabel}
          </span>

          {levelLabel && (
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {levelLabel}
            </span>
          )}

          {course.language && (
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {course.language === 'Spanish' ? 'ES' : course.language === 'English' ? 'EN' : course.language}
            </span>
          )}

          {course.certificate_available && (
            <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full" title="Certificado disponible">
              Cert.
            </span>
          )}
        </div>

        {/* Rating */}
        {course.rating && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold">{course.rating}</span>
            {course.review_count && (
              <span className="text-gray-400">({course.review_count})</span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-2">
          {ctaUrl ? (
            <a
              href={ctaUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => trackClick(course)}
              className="block w-full text-center px-3 py-2 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
            >
              {course.price_type === 'free' ? 'Acceder gratis' :
               course.price_type === 'free_audit' ? 'Auditar curso' :
               course.price_type === 'subscription' ? 'Ver en plataforma' :
               'Ver curso'}
              <svg className="inline-block w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <span className="block w-full text-center px-3 py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-lg cursor-not-allowed">
              Enlace no disponible
            </span>
          )}
        </div>

        {/* Affiliate disclosure */}
        {course.affiliate_url && (
          <p className="text-[10px] text-gray-300 text-center mt-1">Enlace de afiliado</p>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { Bookmark, BookmarkCheck, BookOpenCheck, ExternalLink, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfessional } from '../context/ProfessionalContext';
import { trackEvent } from '../utils/analytics';

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

  trackEvent('affiliate_click', {
    course_id: String(course.id || course.slug),
    provider: course.provider || '',
    source_page: typeof window !== 'undefined' ? window.location.pathname : '',
  });

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
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { savedCourses, saveCourse, removeCourse } = useProfessional();
  const [saveStatus, setSaveStatus] = useState('');
  const providerLabel = PROVIDER_LABELS[course.provider] || course.provider;
  const providerStyle = PROVIDER_STYLES[course.provider] || 'bg-gray-100 text-gray-600';
  const priceLabel = PRICE_TYPE_LABELS[course.price_type] || course.price_type;
  const priceStyle = PRICE_TYPE_STYLES[course.price_type] || 'bg-gray-100 text-gray-600';
  const levelLabel = LEVEL_LABELS[course.level];
  const modalityLabel = MODALITY_LABELS[course.modality];
  const ctaUrl = course.affiliate_url || course.original_url;
  const courseId = String(course.id || course.slug);
  const isSaved = savedCourses.some(item => item.course_id === courseId);

  const handleSave = async () => {
    setSaveStatus('');
    if (!user) {
      const next = `${location.pathname}${location.search}`;
      navigate(`/cuenta?modo=registro&next=${encodeURIComponent(next)}`);
      return;
    }
    const result = isSaved ? await removeCourse(courseId) : await saveCourse(course);
    if (result.error) setSaveStatus(result.error);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
      {/* Image area */}
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-slate-100">
        {course.image_url ? (
          <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <BookOpenCheck className="h-9 w-9 text-slate-400" aria-hidden="true" />
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
          <p className="line-clamp-1 text-[11px] font-bold uppercase text-teal-700">
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
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            <span className="font-semibold">{course.rating}</span>
            {course.review_count && (
              <span className="text-gray-400">({course.review_count})</span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-2 flex gap-2">
          {ctaUrl ? (
            <a
              href={ctaUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => trackClick(course)}
              className="flex min-h-10 flex-1 items-center justify-center px-3 py-2 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
            >
              {course.price_type === 'free' ? 'Acceder gratis' :
               course.price_type === 'free_audit' ? 'Auditar curso' :
               course.price_type === 'subscription' ? 'Ver en plataforma' :
               'Ver curso'}
              <ExternalLink className="ml-1 inline-block h-3 w-3" aria-hidden="true" />
            </a>
          ) : (
            <span className="block w-full text-center px-3 py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-lg cursor-not-allowed">
              Enlace no disponible
            </span>
          )}
          <button type="button" onClick={handleSave} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition ${isSaved ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-300 bg-white text-slate-600 hover:border-teal-400 hover:text-teal-700'}`} title={isSaved ? 'Quitar de guardados' : 'Guardar curso'} aria-label={isSaved ? `Quitar ${course.title} de guardados` : `Guardar ${course.title}`}>
            {isSaved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        {saveStatus && <p className="text-[10px] leading-4 text-rose-700" role="alert">{saveStatus}</p>}

        {/* Affiliate disclosure */}
        {course.affiliate_url && (
          <p className="text-[10px] text-gray-300 text-center mt-1">Enlace de afiliado</p>
        )}
      </div>
    </div>
  );
}

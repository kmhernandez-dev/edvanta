import { useEffect, useRef, useState } from 'react';

const WIDGET_URL =
  'https://affiliate.edutin.com/embeds/lists?business=7d2fd4d1-fe6e-451a-a5c4-8bc4182f6c43&id=661e6225-4c57-44e2-bc67-021744dceeab&type=list';

const BENEFITS = [
  {
    title: 'Acceso gratuito',
    description: 'Todo el contenido académico de los cursos está disponible sin costo.',
  },
  {
    title: 'Virtual y flexible',
    description: 'Estudia a tu ritmo, desde cualquier dispositivo y en el horario que prefieras.',
  },
  {
    title: 'Certificación opcional',
    description: 'Obtén un certificado internacional al completar el curso. La certificación puede tener un costo.',
  },
];

function trackEvent(action, label) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: 'edutin_widget',
      event_label: label,
    });
  }
}

export default function EdutinCourseListWidget({
  url = WIDGET_URL,
  eyebrow = 'RUTA DE APRENDIZAJE',
  title = 'Cursos GRATIS para fortalecer tu perfil profesional',
  description = 'Explora esta selección de cursos organizados para ayudarte a desarrollar competencias prácticas, actualizar tu hoja de vida y avanzar en tu carrera profesional.',
  infoText = 'Puedes estudiar los cursos gratuitamente. La certificación es opcional y puede tener un costo ajustado según el país y las condiciones vigentes de Edutin Academy.',
}) {
  const widgetRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent('edutin_widget_view', 'section_visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToWidget = () => {
    widgetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackEvent('edutin_widget_cta_click', 'explorar_cursos');
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  const handleFallbackClick = () => {
    trackEvent('edutin_widget_fallback_click', 'enlace_alternativo');
  };

  return (
    <section ref={sectionRef} className="py-14 md:py-18 bg-white" aria-labelledby="edutin-widget-heading">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">
            {eyebrow}
          </p>
          <h2
            id="edutin-widget-heading"
            className="text-2xl md:text-3xl font-bold text-navy-950 mb-4"
          >
            {title}
          </h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border border-gray-100 bg-slate-50 p-5 text-center"
            >
              <h3 className="text-sm font-bold text-navy-900 mb-1">{benefit.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Widget iframe */}
        <div ref={widgetRef} className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Loading skeleton */}
          {!iframeLoaded && !iframeError && (
            <div className="flex items-center justify-center py-20 bg-slate-50" aria-label="Cargando lista de cursos">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
                <p className="text-sm text-gray-400">Cargando cursos...</p>
              </div>
            </div>
          )}

          {/* Error fallback */}
          {iframeError && (
            <div className="flex flex-col items-center justify-center py-16 bg-slate-50 text-center px-4">
              <p className="text-sm text-gray-500 mb-3">
                No fue posible cargar la lista de cursos.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={handleFallbackClick}
                className="btn-teal text-sm"
              >
                Abrir en Edutin Academy
                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          <iframe
            src={url}
            title="Lista de cursos gratuitos de Edutin Academy"
            className="w-full border-0"
            style={{ height: '800px', minHeight: '600px' }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allow="fullscreen"
          />
        </div>

        {/* Info text */}
        <p className="mt-4 text-center text-xs text-gray-400 leading-relaxed">
          {infoText}
        </p>

        {/* CTA after widget */}
        <div className="mt-10 text-center bg-slate-50 rounded-2xl border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-navy-950 mb-2">
            ¿No sabes cuál curso elegir?
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto mb-5">
            Empieza por el curso que más se relacione con tu objetivo laboral y continúa con los cursos complementarios de la ruta.
          </p>
          <button
            type="button"
            onClick={scrollToWidget}
            className="btn-primary"
            aria-label="Explorar los cursos disponibles en la lista"
          >
            Explorar los cursos
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Transparency disclosure */}
        <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed max-w-xl mx-auto">
          Edvanta participa en el programa de afiliados de Edutin Academy y puede recibir una comisión cuando una persona adquiere una certificación mediante estos enlaces, sin costo adicional para el estudiante.
        </p>
      </div>
    </section>
  );
}

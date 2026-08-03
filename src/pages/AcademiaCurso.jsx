import { useEffect, useState } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';
import Icon from '../components/Icon';

export default function AcademiaCurso() {
  const { slug } = useParams();
  const { user, api } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    fetch(`/api/academia/courses/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) return setLoading(false);
        setCourse(d.course);
        setModules(d.modules || []);
        setLessons(d.lessons || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!user || !course) return;
    api(`/api/academia/progress/${course.id}`)
      .then(d => setProgress(d.progress || []))
      .catch(() => {});
    api('/api/academia/my-courses')
      .then(d => {
        const found = (d.courses || []).find(c => c.id === course.id);
        setEnrolled(!!found);
      })
      .catch(() => {});
  }, [user, course, api]);

  useEffect(() => {
    if (!course) return;
    return updatePageSeo({
      title: `${course.title} | Academia Feliz Sin Tiroides`,
      description: course.description?.substring(0, 155) || `Curso gratuito de ${course.category}`,
      canonical: `https://edvanta.co/academia/curso/${course.slug}`,
      image: course.cover_image,
      type: 'website',
      keywords: ['curso de tiroides', 'autocuidado de la tiroides', 'hipotiroidismo', 'educación tiroidea'],
      jsonLdId: 'academy-course',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description,
        url: `https://edvanta.co/academia/curso/${course.slug}`,
        image: course.cover_image,
        isAccessibleForFree: true,
        provider: {
          '@type': 'Organization',
          name: 'Edvanta',
          url: 'https://edvanta.co',
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: course.duration,
          instructor: course.instructor ? {
            '@type': 'Person',
            name: course.instructor,
          } : undefined,
        },
      },
    });
  }, [course]);

  const handleEnroll = async () => {
    if (!user) { navigate('/academia?login=1'); return; }
    setEnrolling(true);
    try {
      await api('/api/academia/enroll', {
        method: 'POST',
        body: JSON.stringify({ course_id: course.id }),
      });
      setEnrolled(true);
    } catch (e) {
      alert(e.message);
    }
    setEnrolling(false);
  };

  if (loading) return <div className="min-h-screen bg-sand-50"><FstHeader /><p className="text-center text-gray-400 py-20">Cargando...</p><FstFooter /></div>;
  if (!course) return <Navigate to="/academia" replace />;

  const completedIds = new Set(progress.filter(p => p.completed_at).map(p => p.lesson_id));
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => completedIds.has(l.id)).length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const firstIncomplete = lessons.find(l => !completedIds.has(l.id));
  const continueLink = firstIncomplete
    ? `/academia/curso/${course.slug}/clase/${firstIncomplete.id}`
    : lessons.length > 0 ? `/academia/curso/${course.slug}/clase/${lessons[0].id}` : null;

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />

      {/* Hero del curso */}
      <section className="relative pt-28 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-white via-sand-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full mb-4">
              {course.category}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-deepblue-900 leading-tight mb-4">{course.title}</h1>
            <p className="text-gray-600 leading-relaxed mb-6">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.duration || 'A tu ritmo'}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {totalLessons} clases
              </span>
              <span className="flex items-center gap-1.5 text-teal-600 font-medium">Gratuito</span>
            </div>
            {enrolled ? (
              <div className="flex flex-col sm:flex-row gap-3">
                {continueLink && (
                  <Link to={continueLink} className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors shadow-sm">
                    {completedLessons > 0 ? 'Continuar' : 'Empezar curso'}
                  </Link>
                )}
                <Link to="/academia/mis-cursos" className="inline-flex items-center justify-center gap-2 px-7 py-3 text-teal-700 text-sm font-semibold rounded-full border border-teal-200 hover:bg-teal-50 transition-colors">
                  Mis cursos
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-60"
                >
                  <Icon name="cap" className="h-4 w-4" /> {enrolling ? 'Inscribiendo...' : 'Inscribirme gratis'}
                </button>
                {continueLink && (
                  <Link to={continueLink} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-teal-200 bg-white px-6 text-sm font-semibold text-teal-700 hover:bg-teal-50">
                    Ver primera clase <Icon name="play" className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
            {course.channel_url && (
              <a href={course.channel_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#563a78] hover:underline">
                <Icon name="youtube" className="h-5 w-5" /> Canal Feliz Sin Tiroides <Icon name="external" className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="relative">
            <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-[#eef7f5] shadow-lg">
              {course.cover_image ? (
                <img src={course.cover_image} alt={course.title} className="h-full w-full object-cover" />
              ) : (
                <Icon name="cap" className="h-16 w-16 text-teal-600" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Progreso + Módulos */}
      {lessons.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {user && enrolled && <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-deepblue-900">Tu progreso</span>
                <span className="text-sm text-teal-600 font-medium">{progressPct}%</span>
              </div>
              <div className="w-full h-2 bg-sand-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{completedLessons} de {totalLessons} clases completadas</p>
            </div>}

            <h2 className="font-serif text-xl font-semibold text-deepblue-900 mb-5">Contenido del curso</h2>
            <div className="space-y-6">
              {modules.map(mod => {
                const modLessons = lessons.filter(l => l.module_id === mod.id);
                if (modLessons.length === 0) return null;
                return (
                  <div key={mod.id} className="overflow-hidden rounded-lg border border-sand-100 bg-sand-50">
                    <div className="px-5 py-4 bg-white border-b border-sand-100">
                      <h3 className="font-serif text-base font-semibold text-deepblue-900">{mod.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{modLessons.length} clases</p>
                    </div>
                    <div className="divide-y divide-sand-100">
                      {modLessons.map(lesson => (
                        <Link
                          key={lesson.id}
                          to={`/academia/curso/${course.slug}/clase/${lesson.id}`}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-white transition-colors group"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            completedIds.has(lesson.id) ? 'bg-teal-500 text-white' : 'border-2 border-sand-300 text-transparent group-hover:border-teal-300'
                          }`}>
                            {completedIds.has(lesson.id) ? (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-deepblue-800 group-hover:text-teal-700 transition-colors">{lesson.title}</p>
                            {lesson.duration_min > 0 && (
                              <p className="text-xs text-gray-400">{lesson.duration_min} min</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Descargo */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Descargo educativo:</strong> este curso tiene fines educativos e informativos. No sustituye la consulta, diagnóstico ni tratamiento médico.
            </p>
          </div>
        </div>
      </section>

      <FstFooter />
    </div>
  );
}

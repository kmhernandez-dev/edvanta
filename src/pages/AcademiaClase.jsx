import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function AcademiaClase() {
  const { slug, lessonId } = useParams();
  const { user, api } = useAuth();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [lessonId]);

  // Cargar curso
  useEffect(() => {
    fetch(`/api/academia/courses/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) return setLoading(false);
        setCourse(d.course);
        setModules(d.modules || []);
        setLessons(d.lessons || []);
        const found = (d.lessons || []).find(l => l.id === parseInt(lessonId));
        setLesson(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, lessonId]);

  // Cargar progreso
  useEffect(() => {
    if (!user || !course) return;
    api(`/api/academia/progress/${course.id}`)
      .then(d => setProgress(d.progress || []))
      .catch(() => {});
  }, [user, course, api]);

  // Cargar comentarios
  useEffect(() => {
    if (!lessonId) return;
    fetch(`/api/academia/comments/${lessonId}`)
      .then(r => r.json())
      .then(d => setComments(d.comments || []))
      .catch(() => {});
  }, [lessonId]);

  useEffect(() => {
    if (!lesson) return;
    updatePageSeo({
      title: `${lesson.title} | ${course?.title || 'Academia'} | Feliz Sin Tiroides`,
      description: lesson.description?.substring(0, 155) || `Clase del curso ${course?.title || ''}`,
      canonical: `https://edvanta.co/academia/curso/${slug}/clase/${lessonId}`,
    });
  }, [lesson, course, slug, lessonId]);

  const markComplete = useCallback(async () => {
    if (!user) return;
    try {
      await api('/api/academia/progress', {
        method: 'POST',
        body: JSON.stringify({ lesson_id: parseInt(lessonId) }),
      });
      setProgress(prev => [...prev, { lesson_id: parseInt(lessonId), completed_at: new Date().toISOString() }]);
    } catch (e) { console.error(e); }
  }, [user, api, lessonId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    setSubmitting(true);
    try {
      const data = await api('/api/academia/comments', {
        method: 'POST',
        body: JSON.stringify({ lesson_id: parseInt(lessonId), body: commentText.trim(), parent_id: replyTo }),
      });
      setComments(prev => [...prev, data.comment]);
      setCommentText('');
      setReplyTo(null);
    } catch (e) { alert(e.message); }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-sand-50"><FstHeader /><p className="text-center text-gray-400 py-20">Cargando...</p><FstFooter /></div>;
  if (!course || !lesson) return <Navigate to="/academia" replace />;

  const completedIds = new Set(progress.filter(p => p.completed_at).map(p => p.lesson_id));
  const isCompleted = completedIds.has(parseInt(lessonId));
  const videoId = getYouTubeId(lesson.video_url);

  // Encontrar lección anterior y siguiente
  const currentIndex = lessons.findIndex(l => l.id === parseInt(lessonId));
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  // Comentarios organizados
  const topComments = comments.filter(c => !c.parent_id);
  const replies = comments.filter(c => c.parent_id);

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />

      <div className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/academia" className="hover:text-teal-600">Academia</Link>
            <span>/</span>
            <Link to={`/academia/curso/${slug}`} className="hover:text-teal-600 truncate max-w-[200px]">{course.title}</Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{lesson.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Columna principal: video + contenido */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video */}
              <div className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video">
                {videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title={lesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Video no disponible</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Título y descripción */}
              <div className="bg-white rounded-2xl border border-sand-100 p-6">
                <h1 className="font-serif text-xl md:text-2xl font-semibold text-deepblue-900 mb-3">{lesson.title}</h1>
                {lesson.description && <p className="text-gray-600 leading-relaxed text-sm">{lesson.description}</p>}
              </div>

              {/* Marcar completada + navegación */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {user ? (
                  <button
                    onClick={markComplete}
                    disabled={isCompleted}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-teal-50 text-teal-600 border border-teal-200 cursor-default'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Completada
                      </>
                    ) : (
                      'Marcar como completada'
                    )}
                  </button>
                ) : (
                  <Link to="/academia?login=1" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors shadow-sm text-center">
                    Inicia sesión para guardar tu progreso
                  </Link>
                )}
                <div className="flex gap-2">
                  {prevLesson && (
                    <Link
                      to={`/academia/curso/${slug}/clase/${prevLesson.id}`}
                      className="px-4 py-3 text-sm font-medium text-deepblue-800 border border-sand-200 rounded-full hover:bg-sand-50 transition-colors"
                    >
                      ← Anterior
                    </Link>
                  )}
                  {nextLesson && (
                    <Link
                      to={`/academia/curso/${slug}/clase/${nextLesson.id}`}
                      className="px-4 py-3 text-sm font-medium text-teal-700 border border-teal-200 rounded-full hover:bg-teal-50 transition-colors"
                    >
                      Siguiente →
                    </Link>
                  )}
                </div>
              </div>

              {/* Comentarios */}
              <div className="bg-white rounded-2xl border border-sand-100 p-6">
                <h2 className="font-serif text-lg font-semibold text-deepblue-900 mb-5">Comentarios</h2>

                {user ? (
                  <form onSubmit={submitComment} className="mb-6">
                    {replyTo && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                        <span>Respondiendo a un comentario</span>
                        <button type="button" onClick={() => setReplyTo(null)} className="text-teal-600 hover:underline">Cancelar</button>
                      </div>
                    )}
                    <textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Escribe tu comentario o pregunta..."
                      rows={3}
                      className="w-full rounded-xl border border-sand-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={submitting || !commentText.trim()}
                      className="mt-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Enviando...' : 'Comentar'}
                    </button>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-sand-50 rounded-xl text-center">
                    <p className="text-sm text-gray-500">
                      <Link to="/academia?login=1" className="text-teal-600 hover:underline font-medium">Inicia sesión</Link> para dejar un comentario.
                    </p>
                  </div>
                )}

                {topComments.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No hay comentarios todavía. Sé el primero en comentar.</p>
                ) : (
                  <div className="space-y-4">
                    {topComments.map(comment => {
                      const commentReplies = replies.filter(r => r.parent_id === comment.id);
                      return (
                        <div key={comment.id} className="border-b border-sand-100 pb-4 last:border-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
                              {comment.user_name?.charAt(0) || '?'}
                            </div>
                            <span className="text-sm font-semibold text-deepblue-800">{comment.user_name}</span>
                            <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString('es-CO')}</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-9">{comment.body}</p>
                          {user && (
                            <button
                              onClick={() => setReplyTo(comment.id)}
                              className="ml-9 mt-1 text-xs text-teal-600 hover:underline"
                            >
                              Responder
                            </button>
                          )}
                          {commentReplies.map(reply => (
                            <div key={reply.id} className="ml-9 mt-3 pl-4 border-l-2 border-teal-100">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded-full bg-sand-100 flex items-center justify-center text-xs font-bold text-deepblue-600">
                                  {reply.user_name?.charAt(0) || '?'}
                                </div>
                                <span className="text-sm font-semibold text-deepblue-800">{reply.user_name}</span>
                                <span className="text-xs text-gray-400">{new Date(reply.created_at).toLocaleDateString('es-CO')}</span>
                              </div>
                              <p className="text-sm text-gray-600 ml-8">{reply.body}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: progreso + módulos */}
            <div className="space-y-5">
              {/* Progreso */}
              {user && (
                <div className="bg-white rounded-2xl border border-sand-100 p-5">
                  <h3 className="font-serif text-sm font-semibold text-deepblue-900 mb-3">Tu progreso</h3>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500">{completedIds.size} de {lessons.length} clases</span>
                    <span className="text-teal-600 font-medium">{lessons.length > 0 ? Math.round((completedIds.size / lessons.length) * 100) : 0}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${lessons.length > 0 ? Math.round((completedIds.size / lessons.length) * 100) : 0}%` }} />
                  </div>
                </div>
              )}

              {/* Módulos y lecciones */}
              <div className="bg-white rounded-2xl border border-sand-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-sand-100">
                  <h3 className="font-serif text-sm font-semibold text-deepblue-900">Contenido del curso</h3>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {modules.map(mod => {
                    const modLessons = lessons.filter(l => l.module_id === mod.id);
                    if (modLessons.length === 0) return null;
                    return (
                      <div key={mod.id} className="border-b border-sand-50 last:border-0">
                        <div className="px-5 py-2.5 bg-sand-50">
                          <p className="text-xs font-semibold text-deepblue-800 uppercase tracking-wide">{mod.title}</p>
                        </div>
                        {modLessons.map(les => (
                          <Link
                            key={les.id}
                            to={`/academia/curso/${slug}/clase/${les.id}`}
                            className={`flex items-center gap-3 px-5 py-2.5 hover:bg-teal-50 transition-colors ${
                              les.id === parseInt(lessonId) ? 'bg-teal-50 border-l-2 border-teal-500' : ''
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              completedIds.has(les.id) ? 'bg-teal-500 text-white' : 'border border-sand-300'
                            }`}>
                              {completedIds.has(les.id) ? (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 text-sand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs truncate ${les.id === parseInt(lessonId) ? 'text-teal-700 font-medium' : 'text-deepblue-700'}`}>
                                {les.title}
                              </p>
                              {les.duration_min > 0 && (
                                <p className="text-[10px] text-gray-400">{les.duration_min} min</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FstFooter />
    </div>
  );
}

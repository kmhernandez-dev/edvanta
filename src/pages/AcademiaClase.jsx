import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import AcademiaLoginModal from '../components/AcademiaLoginModal';
import FstFooter from '../components/fst/FstFooter';
import FstHeader from '../components/fst/FstHeader';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';

const CHANNEL_URL = 'https://www.youtube.com/@felizsintiroides';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function CommentActions({ comment, canInteract, onLike, onReply, isReply = false }) {
  return (
    <div className={`${isReply ? 'ml-8' : 'ml-10'} mt-2 flex items-center gap-4`}>
      <button
        type="button"
        onClick={() => onLike(comment.id)}
        className={`inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold ${comment.viewer_liked ? 'text-[#563a78]' : 'text-gray-500 hover:text-[#563a78]'}`}
        aria-pressed={comment.viewer_liked}
        aria-label={`${comment.viewer_liked ? 'Quitar me gusta de' : 'Dar me gusta a'} este comentario`}
      >
        <Icon name="thumbsUp" className="h-4 w-4" /> {comment.like_count || 0}
      </button>
      {!isReply && (
        <button type="button" onClick={() => onReply(comment.id)} className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0f766e]">
          <Icon name="reply" className="h-4 w-4" /> Responder
        </button>
      )}
      {!canInteract && <span className="text-[11px] text-gray-400">Inicia sesión para interactuar</span>}
    </div>
  );
}

export default function AcademiaClase() {
  const { slug, lessonId } = useParams();
  const { user, api } = useAuth();
  const lessonKey = String(lessonId || '');
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [comments, setComments] = useState([]);
  const [engagement, setEngagement] = useState({ like_count: 0, viewer_liked: false });
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [error, setError] = useState('');

  const lesson = useMemo(
    () => lessons.find(item => String(item.id) === lessonKey) || null,
    [lessons, lessonKey]
  );

  useEffect(() => { window.scrollTo(0, 0); }, [lessonId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api(`/api/academia/courses/${slug}`)
      .then(data => {
        if (cancelled) return;
        setCourse(data.course || null);
        setModules(data.modules || []);
        setLessons(data.lessons || []);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, api]);

  useEffect(() => {
    if (!/^\d+$/.test(lessonKey)) return;
    Promise.all([
      api(`/api/academia/comments/${lessonKey}`),
      api(`/api/academia/lessons/${lessonKey}/engagement`),
    ]).then(([commentData, engagementData]) => {
      setComments(commentData.comments || []);
      setEngagement(engagementData.engagement || { like_count: 0, viewer_liked: false });
    }).catch(() => {});
  }, [lessonKey, api, user]);

  useEffect(() => {
    if (!user || !course) { setProgress([]); return; }
    api(`/api/academia/progress/${course.id}`)
      .then(data => setProgress(data.progress || []))
      .catch(() => {});
  }, [user, course, api]);

  useEffect(() => {
    if (!lesson) return undefined;
    return updatePageSeo({
      title: `${lesson.title} | ${course?.title || 'Academia'} | Feliz Sin Tiroides`,
      description: lesson.description?.substring(0, 155) || `Clase del curso ${course?.title || ''}`,
      canonical: `https://edvanta.co/academia/curso/${slug}/clase/${lessonId}`,
    });
  }, [lesson, course, slug, lessonId]);

  const requireUser = useCallback((action) => {
    if (!user) { setLoginOpen(true); return false; }
    action?.();
    return true;
  }, [user]);

  const markComplete = async () => {
    if (!requireUser()) return;
    try {
      await api('/api/academia/progress', {
        method: 'POST',
        body: JSON.stringify({ lesson_id: lessonKey }),
      });
      setProgress(current => current.some(item => String(item.lesson_id) === lessonKey)
        ? current
        : [...current, { lesson_id: lessonKey, completed_at: new Date().toISOString() }]);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const toggleLessonLike = async () => {
    if (!requireUser()) return;
    try {
      const data = await api(`/api/academia/lessons/${lessonKey}/like`, { method: 'POST' });
      setEngagement({ like_count: data.like_count, viewer_liked: data.liked });
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const toggleCommentLike = async (commentId) => {
    if (!requireUser()) return;
    try {
      const data = await api(`/api/academia/comments/${commentId}/like`, { method: 'POST' });
      setComments(current => current.map(comment => comment.id === commentId
        ? { ...comment, like_count: data.like_count, viewer_liked: data.liked }
        : comment));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const startReply = (commentId) => {
    if (!requireUser()) return;
    setReplyTo(commentId);
    document.querySelector('#academy-comment')?.focus();
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (!requireUser() || !commentText.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await api('/api/academia/comments', {
        method: 'POST',
        body: JSON.stringify({ lesson_id: lessonKey, body: commentText.trim(), parent_id: replyTo }),
      });
      setComments(current => [...current, data.comment]);
      setCommentText('');
      setReplyTo(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f7f8fa]"><FstHeader /><p className="pt-36 text-center text-sm text-gray-500">Cargando la sala...</p></div>;
  }
  if (!course || !lesson) return <Navigate to="/academia" replace />;

  const completedIds = new Set(progress.filter(item => item.completed_at).map(item => String(item.lesson_id)));
  const isCompleted = completedIds.has(lessonKey);
  const videoId = getYouTubeId(lesson.video_url);
  const currentIndex = lessons.findIndex(item => String(item.id) === lessonKey);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const topComments = comments.filter(comment => !comment.parent_id);
  const replies = comments.filter(comment => comment.parent_id);
  const progressPercent = lessons.length ? Math.round((completedIds.size / lessons.length) * 100) : 0;
  const channelUrl = course.channel_url || CHANNEL_URL;

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#132e55]">
      <FstHeader />
      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-5 flex min-w-0 items-center gap-2 overflow-hidden text-xs text-gray-500" aria-label="Migas de pan">
            <Link to="/academia" className="shrink-0 hover:text-[#0f766e]">Academia</Link>
            <span>/</span>
            <Link to={`/academia/curso/${slug}`} className="max-w-52 truncate hover:text-[#0f766e]">{course.title}</Link>
            <span>/</span>
            <span className="truncate text-gray-700">{lesson.title}</span>
          </nav>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-5">
              <div className="aspect-video overflow-hidden rounded-lg bg-black shadow-sm">
                {videoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title={lesson.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-white/70">Video no disponible</div>
                )}
              </div>

              <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6" aria-labelledby="lesson-title">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Clase {currentIndex + 1} de {lessons.length}</p>
                    <h1 id="lesson-title" className="text-2xl font-semibold leading-tight text-[#132e55]">{lesson.title}</h1>
                    {lesson.description && <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">{lesson.description}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={toggleLessonLike}
                    className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold ${engagement.viewer_liked ? 'border-[#76539a] bg-[#f2ebf7] text-[#563a78]' : 'border-gray-200 bg-white text-gray-600 hover:border-[#9f83ba]'}`}
                    aria-pressed={engagement.viewer_liked}
                  >
                    <Icon name="thumbsUp" className="h-5 w-5" /> Me gusta {engagement.like_count || 0}
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-2"><Icon name="user" className="h-4 w-4 text-[#0f766e]" /> {course.instructor || 'Karla Hernández'}</span>
                  <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-2 font-semibold text-[#563a78] hover:underline">
                    <Icon name="youtube" className="h-4 w-4" /> Visitar canal en YouTube <Icon name="external" className="h-3.5 w-3.5" />
                  </a>
                </div>
              </section>

              {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={markComplete}
                  disabled={isCompleted}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold ${isCompleted ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-[#0f766e] text-white hover:bg-[#0b5f59]'}`}
                >
                  <Icon name={isCompleted ? 'checkCircle' : 'check'} className="h-5 w-5" /> {isCompleted ? 'Clase completada' : 'Marcar como completada'}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  {previousLesson ? (
                    <Link to={`/academia/curso/${slug}/clase/${previousLesson.id}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 hover:border-[#9f83ba]">Anterior</Link>
                  ) : <span />}
                  {nextLesson && (
                    <Link to={`/academia/curso/${slug}/clase/${nextLesson.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#563a78] px-4 text-sm font-semibold text-white hover:bg-[#452b65]">Siguiente <Icon name="arrowRight" className="h-4 w-4" /></Link>
                  )}
                </div>
              </div>

              <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6" aria-labelledby="comments-title">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 id="comments-title" className="text-lg font-semibold text-[#132e55]">Conversación de la clase</h2>
                    <p className="mt-1 text-xs text-gray-500">Comparte preguntas y aprendizajes. No publiques datos clínicos sensibles.</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500"><Icon name="message" className="h-4 w-4" /> {topComments.length}</span>
                </div>

                {user ? (
                  <form onSubmit={submitComment} className="border-b border-gray-100 pb-6">
                    {replyTo && (
                      <div className="mb-2 flex items-center justify-between rounded-md bg-[#f2ebf7] px-3 py-2 text-xs text-[#563a78]">
                        <span>Estás respondiendo a un comentario.</span>
                        <button type="button" onClick={() => setReplyTo(null)} className="font-semibold hover:underline">Cancelar</button>
                      </div>
                    )}
                    <label htmlFor="academy-comment" className="mb-2 block text-sm font-semibold text-[#132e55]">Tu comentario</label>
                    <textarea
                      id="academy-comment"
                      value={commentText}
                      onChange={event => setCommentText(event.target.value.slice(0, 1500))}
                      placeholder="Escribe una pregunta o comparte lo que aprendiste..."
                      rows={4}
                      className="w-full resize-y rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-[#76539a] focus:ring-2 focus:ring-[#e6dced]"
                    />
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-400">{commentText.length}/1500</span>
                      <button type="submit" disabled={submitting || !commentText.trim()} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#563a78] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                        <Icon name="message" className="h-4 w-4" /> {submitting ? 'Publicando...' : replyTo ? 'Publicar respuesta' : 'Publicar comentario'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button type="button" onClick={() => setLoginOpen(true)} className="mb-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#d7c8e5] bg-[#faf8fc] px-4 text-sm font-semibold text-[#563a78]">
                    <Icon name="lock" className="h-4 w-4" /> Inicia sesión para participar
                  </button>
                )}

                {topComments.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">Aún no hay comentarios. Inicia la conversación de esta clase.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {topComments.map(comment => {
                      const commentReplies = replies.filter(reply => reply.parent_id === comment.id);
                      return (
                        <article key={comment.id} className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f4f2] text-xs font-bold text-[#0f766e]">{comment.user_name?.charAt(0)?.toUpperCase() || '?'}</div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#132e55]">{comment.user_name}</p>
                              <p className="text-[11px] text-gray-400">{formatDate(comment.created_at)}</p>
                            </div>
                          </div>
                          <p className="ml-10 mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">{comment.body}</p>
                          <CommentActions comment={comment} canInteract={!!user} onLike={toggleCommentLike} onReply={startReply} />

                          {commentReplies.map(reply => (
                            <div key={reply.id} className="ml-10 mt-4 border-l-2 border-[#d7e9e6] pl-4">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">{reply.user_name?.charAt(0)?.toUpperCase() || '?'}</div>
                                <div>
                                  <p className="text-xs font-semibold text-[#132e55]">{reply.user_name}</p>
                                  <p className="text-[10px] text-gray-400">{formatDate(reply.created_at)}</p>
                                </div>
                              </div>
                              <p className="ml-8 mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">{reply.body}</p>
                              <CommentActions comment={reply} canInteract={!!user} onLike={toggleCommentLike} onReply={startReply} isReply />
                            </div>
                          ))}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              {user && (
                <section className="rounded-lg border border-gray-200 bg-white p-4" aria-labelledby="progress-title">
                  <div className="flex items-center justify-between gap-3">
                    <h2 id="progress-title" className="text-sm font-semibold text-[#132e55]">Tu progreso</h2>
                    <Link to="/academia/perfil" className="text-xs font-semibold text-[#563a78] hover:underline">Ver perfil</Link>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${progressPercent}%` }} /></div>
                  <p className="mt-2 text-xs text-gray-500">{completedIds.size} de {lessons.length} clases · {progressPercent}%</p>
                </section>
              )}

              <section className="overflow-hidden rounded-lg border border-gray-200 bg-white" aria-labelledby="content-title">
                <div className="border-b border-gray-200 px-4 py-3">
                  <h2 id="content-title" className="inline-flex items-center gap-2 text-sm font-semibold text-[#132e55]"><Icon name="list" className="h-4 w-4" /> Contenido del curso</h2>
                </div>
                <div className="max-h-[66vh] overflow-y-auto">
                  {modules.map(module => {
                    const moduleLessons = lessons.filter(item => item.module_id === module.id);
                    if (!moduleLessons.length) return null;
                    return (
                      <div key={module.id} className="border-b border-gray-100 last:border-0">
                        <p className="bg-[#f7f8fa] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">{module.title}</p>
                        {moduleLessons.map((item) => {
                          const active = String(item.id) === lessonKey;
                          return (
                            <Link key={item.id} to={`/academia/curso/${slug}/clase/${item.id}`} className={`flex min-h-12 items-center gap-3 border-l-2 px-4 py-3 ${active ? 'border-[#0f766e] bg-[#eef7f5]' : 'border-transparent hover:bg-gray-50'}`}>
                              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${completedIds.has(String(item.id)) ? 'bg-[#0f766e] text-white' : active ? 'bg-white text-[#0f766e]' : 'bg-gray-100 text-gray-500'}`}>
                                <Icon name={completedIds.has(String(item.id)) ? 'check' : 'play'} className="h-3.5 w-3.5" />
                              </span>
                              <span className={`text-xs leading-5 ${active ? 'font-semibold text-[#0f615b]' : 'text-gray-700'}`}>{item.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </section>

              <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><strong>Aviso:</strong> contenido educativo. No modifica diagnósticos, dosis ni tratamientos indicados por tu equipo de salud.</p>
            </aside>
          </div>
        </div>
      </main>
      <FstFooter />
      <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

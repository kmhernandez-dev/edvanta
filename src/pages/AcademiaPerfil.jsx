import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AcademiaLoginModal from '../components/AcademiaLoginModal';
import FstFooter from '../components/fst/FstFooter';
import FstHeader from '../components/fst/FstHeader';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';

const statItems = [
  ['course_count', 'book', 'Cursos'],
  ['completed_lessons', 'checkCircle', 'Clases completadas'],
  ['completed_activities', 'clipboard', 'Prácticas realizadas'],
  ['comment_count', 'message', 'Comentarios'],
  ['like_count', 'thumbsUp', 'Me gusta'],
];

export default function AcademiaPerfil() {
  const { user, api, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageSeo({
      title: 'Mi perfil | Academia Feliz Sin Tiroides',
      description: 'Perfil privado de aprendizaje en la Academia Feliz Sin Tiroides.',
      canonical: 'https://edvanta.co/academia/perfil',
    });
    let robots = document.head.querySelector('meta[name="robots"]');
    const previousContent = robots?.getAttribute('content');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (previousContent) robots.setAttribute('content', previousContent);
      else robots.remove();
    };
  }, []);

  useEffect(() => {
    if (!user) { setData(null); setLoading(false); return; }
    setLoading(true);
    api('/api/academia/profile')
      .then(profileData => { setData(profileData); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, api]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#132e55]">
        <FstHeader />
        <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 pb-16 pt-28 text-center">
          <div className="w-full rounded-lg border border-gray-200 bg-white p-8">
            <Icon name="lock" className="mx-auto h-10 w-10 text-[#76539a]" />
            <h1 className="mt-5 text-2xl font-semibold">Tu perfil de aprendizaje</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">Inicia sesión para ver tus cursos, progreso, comentarios y reacciones.</p>
            <button type="button" onClick={() => setLoginOpen(true)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#563a78] px-5 text-sm font-semibold text-white">
              <Icon name="user" className="h-4 w-4" /> Iniciar sesión
            </button>
          </div>
        </main>
        <FstFooter />
        <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </div>
    );
  }

  const profile = data?.profile || user;
  const stats = data?.stats || {};
  const courses = data?.courses || [];

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#132e55]">
      <FstHeader />
      <main className="pb-16 pt-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <section className="flex flex-col gap-5 border-b border-gray-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" referrerPolicy="no-referrer" className="h-16 w-16 shrink-0 rounded-full border border-gray-200 object-cover" />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e8f4f2] text-2xl font-bold text-[#0f766e]">{profile?.name?.charAt(0)?.toUpperCase() || '?'}</div>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#76539a]">Mi perfil</p>
                <h1 className="mt-1 text-3xl font-semibold">{profile?.name}</h1>
                <p className="mt-1 text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/academia" className="inline-flex min-h-11 items-center rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700">Explorar cursos</Link>
              <button type="button" onClick={logout} className="inline-flex min-h-11 items-center rounded-md border border-red-200 bg-white px-4 text-sm font-semibold text-red-700">Cerrar sesión</button>
            </div>
          </section>

          {loading ? (
            <p className="py-16 text-center text-sm text-gray-500">Cargando tu actividad...</p>
          ) : (
            <>
              <section className="grid grid-cols-2 gap-3 py-8 sm:grid-cols-3 xl:grid-cols-5" aria-label="Resumen de actividad">
                {statItems.map(([key, icon, label]) => (
                  <div key={key} className="rounded-lg border border-gray-200 bg-white p-4">
                    <Icon name={icon} className="h-5 w-5 text-[#0f766e]" />
                    <p className="mt-4 text-2xl font-semibold">{stats[key] || 0}</p>
                    <p className="mt-1 text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </section>

              <section aria-labelledby="profile-courses">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 id="profile-courses" className="text-xl font-semibold">Mis cursos</h2>
                    <p className="mt-1 text-sm text-gray-500">Continúa desde la última clase y revisa tu avance.</p>
                  </div>
                </div>

                {courses.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
                    <Icon name="book" className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-3 text-sm text-gray-600">Aún no tienes cursos inscritos.</p>
                    <Link to="/academia" className="mt-4 inline-flex min-h-11 items-center rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white">Ver academia</Link>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map(course => {
                      const percent = course.class_count ? Math.round((course.completed_lessons / course.class_count) * 100) : 0;
                      return (
                        <article key={course.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <img src={course.cover_image} alt="" className="aspect-video w-full object-cover" />
                          <div className="p-4">
                            <h3 className="text-base font-semibold leading-6">{course.title}</h3>
                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full bg-[#0f766e]" style={{ width: `${percent}%` }} /></div>
                            <div className="mt-2 flex items-center justify-between text-xs text-gray-500"><span>{course.completed_lessons} de {course.class_count} clases</span><span className="font-semibold text-[#0f766e]">{percent}%</span></div>
                            <Link to={`/academia/curso/${course.slug}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#563a78] px-4 text-sm font-semibold text-white">{percent ? 'Continuar curso' : 'Empezar curso'} <Icon name="arrowRight" className="h-4 w-4" /></Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
      <FstFooter />
    </div>
  );
}

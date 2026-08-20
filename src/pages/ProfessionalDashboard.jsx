import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, BookOpenCheck, BriefcaseBusiness, CheckCircle2, Compass, ExternalLink, FileText, LogOut, Route, Settings, Trash2, UserRound } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useProfessional } from '../context/ProfessionalContext';
import { getCareerOption } from '../data/professionalProfileOptions';
import { updatePageSeo } from '../utils/seo';

function profileCompletion(profile) {
  const fields = ['display_name', 'experience_level', 'target_career_slug', 'professional_summary', 'city', 'country'];
  const completed = fields.filter(field => Boolean(profile?.[field])).length + (profile?.interests?.length ? 1 : 0);
  return Math.round((completed / 7) * 100);
}

export default function ProfessionalDashboard() {
  const navigate = useNavigate();
  const { user, profile: accountProfile, loading: authLoading, logout } = useAuth();
  const { professionalProfile, savedCourses, savedResources, learningPaths, loading, workspaceError, removeCourse, removeResource, startLearningPath, refreshWorkspace } = useProfessional();
  const [message, setMessage] = useState('');

  useEffect(() => updatePageSeo({
    title: 'Mi panel profesional | Edvanta',
    description: 'Organiza tus cursos guardados, rutas activas y próximos pasos profesionales.',
    canonical: 'https://edvanta.co/app',
    robots: 'noindex,nofollow',
  }), []);

  useEffect(() => {
    if (!authLoading && !user) navigate('/cuenta?next=%2Fapp', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && !loading && user && !workspaceError && !professionalProfile?.onboarding_completed) {
      navigate('/app/onboarding', { replace: true });
    }
  }, [authLoading, loading, user, workspaceError, professionalProfile, navigate]);

  const targetCareer = useMemo(() => getCareerOption(professionalProfile?.target_career_slug), [professionalProfile]);
  const activePath = learningPaths.find(path => path.status === 'in_progress') || null;
  const completion = profileCompletion(professionalProfile);

  const handleStartRoute = async () => {
    if (!targetCareer?.pathSlug) return;
    const result = await startLearningPath({ slug: targetCareer.pathSlug, name: targetCareer.name });
    setMessage(result.error || 'Ruta añadida a tu panel.');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || loading || !user) {
    return <><Header /><main className="min-h-screen bg-[#f7f9fc] pt-16"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="h-10 w-72 animate-pulse rounded bg-slate-200" /><div className="mt-8 grid gap-4 lg:grid-cols-3"><div className="h-56 animate-pulse rounded-lg bg-white lg:col-span-2" /><div className="h-56 animate-pulse rounded-lg bg-white" /></div></div></main></>;
  }

  if (workspaceError && !professionalProfile) {
    return <><Header /><main className="min-h-[75vh] bg-[#f7f9fc] pt-16"><div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6"><Settings className="mx-auto h-10 w-10 text-teal-700" /><h1 className="mt-5 text-3xl font-bold text-[#071a4a]">No pudimos abrir tu panel</h1><p className="mt-3 text-slate-600">{workspaceError}</p><button type="button" onClick={refreshWorkspace} className="mt-6 min-h-11 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">Reintentar</button></div></main><Footer /></>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-4 py-9 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase text-teal-700">Mi espacio profesional</p>
              <h1 className="mt-2 text-3xl font-bold text-[#071a4a]">Hola, {professionalProfile?.display_name || accountProfile?.full_name || 'bienvenido'}</h1>
              <p className="mt-2 text-sm text-slate-600">Retoma lo importante y deja el resto para después.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/app/perfil" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700"><UserRound className="h-4 w-4" /> Editar perfil</Link>
              <button type="button" onClick={handleLogout} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600" title="Cerrar sesión" aria-label="Cerrar sesión"><LogOut className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {message && <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900" role="status">{message}</div>}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="text-sm font-bold text-teal-700">Tu próximo paso</p>
                    <h2 className="mt-2 text-2xl font-bold text-[#071a4a]">{activePath ? `Continúa ${activePath.path_name}` : targetCareer ? `Empieza tu ruta hacia ${targetCareer.name}` : 'Define una carrera objetivo'}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{activePath ? `Vas por el paso ${activePath.current_step}. Abre la ruta para revisar la siguiente actividad.` : targetCareer ? 'Sigue una secuencia de fundamentos, práctica y evidencia profesional.' : 'Edita tu perfil para recibir una ruta coherente con tu objetivo.'}</p>
                  </div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Compass className="h-5 w-5" /></span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {activePath ? <Link to={`/rutas/${activePath.path_slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">Continuar ruta <ArrowRight className="h-4 w-4" /></Link> : targetCareer ? <button type="button" onClick={handleStartRoute} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">Iniciar ruta <ArrowRight className="h-4 w-4" /></button> : <Link to="/app/perfil" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">Completar objetivo <ArrowRight className="h-4 w-4" /></Link>}
                  <Link to="/rutas" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700">Explorar rutas</Link>
                </div>
              </section>

              <section>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div><p className="text-sm font-bold text-teal-700">Consulta después</p><h2 className="mt-1 text-2xl font-bold text-[#071a4a]">Recursos guardados</h2></div>
                  <Link to="/recursos" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700">Explorar recursos <ArrowRight className="h-4 w-4" /></Link>
                </div>
                {savedResources.length ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {savedResources.map(resource => (
                      <article key={resource.resource_id} className="flex min-h-40 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><FileText className="h-4 w-4" /></span>
                          <button type="button" onClick={() => removeResource(resource.resource_id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-rose-700" title="Quitar recurso" aria-label={`Quitar ${resource.title}`}><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <p className="mt-4 text-xs font-bold uppercase text-teal-700">{resource.resource_type || 'Recurso'}</p>
                        <h3 className="mt-1 flex-1 text-base font-bold text-[#071a4a]">{resource.title}</h3>
                        <a href={resource.destination_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Abrir recurso <ExternalLink className="h-4 w-4" /></a>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">Guarda guías, plantillas o lecturas desde la biblioteca para encontrarlas aquí.</p>
                )}
              </section>

              <section>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div><p className="text-sm font-bold text-teal-700">Biblioteca personal</p><h2 className="mt-1 text-2xl font-bold text-[#071a4a]">Cursos guardados</h2></div>
                  <Link to="/cursos" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700">Buscar cursos <ArrowRight className="h-4 w-4" /></Link>
                </div>
                {savedCourses.length ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {savedCourses.map(course => (
                      <article key={course.course_id} className="flex min-h-44 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><BookOpenCheck className="h-4 w-4" /></span><button type="button" onClick={() => removeCourse(course.course_id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-rose-700" title="Quitar curso" aria-label={`Quitar ${course.title}`}><Trash2 className="h-4 w-4" /></button></div>
                        <p className="mt-4 text-xs font-bold uppercase text-teal-700">{course.provider || 'Curso externo'}</p>
                        <h3 className="mt-1 flex-1 text-base font-bold text-[#071a4a]">{course.title}</h3>
                        <a href={course.destination_url} target="_blank" rel="sponsored noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Abrir curso <ExternalLink className="h-4 w-4" /></a>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><Bookmark className="mx-auto h-8 w-8 text-teal-700" /><h3 className="mt-4 text-lg font-bold text-[#071a4a]">Aún no has guardado cursos</h3><p className="mt-2 text-sm text-slate-600">Usa el marcador del catálogo para crear una selección que puedas revisar después.</p><Link to="/cursos" className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-5 text-sm font-bold text-slate-700">Explorar catálogo</Link></div>
                )}
              </section>

              <section>
                <div><p className="text-sm font-bold text-teal-700">Seguimiento</p><h2 className="mt-1 text-2xl font-bold text-[#071a4a]">Rutas activas</h2></div>
                {learningPaths.length ? <div className="mt-5 space-y-3">{learningPaths.map(path => <Link key={path.path_slug} to={`/rutas/${path.path_slug}`} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><span><span className="block text-xs font-bold uppercase text-teal-700">{path.status === 'completed' ? 'Completada' : 'En progreso'}</span><span className="mt-1 block text-lg font-bold text-[#071a4a]">{path.path_name}</span></span><span className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><Route className="h-4 w-4" /> Paso {path.current_step}</span></Link>)}</div> : <p className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Cuando inicies una ruta, aparecerá aquí con tu paso actual.</p>}
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-[#071a4a]">Tu perfil</h2><span className="text-sm font-bold text-teal-700">{completion}%</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600" style={{ width: `${completion}%` }} /></div>
                <dl className="mt-5 space-y-4 text-sm">
                  <div><dt className="font-semibold text-slate-500">Carrera objetivo</dt><dd className="mt-1 font-bold text-[#071a4a]">{targetCareer?.name || 'Pendiente'}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Intereses</dt><dd className="mt-1 leading-6 text-slate-700">{professionalProfile?.interests?.slice(0, 3).join(', ') || 'Pendientes'}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Visibilidad</dt><dd className="mt-1 inline-flex items-center gap-1.5 font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-teal-700" /> Privada</dd></div>
                </dl>
                <Link to="/app/perfil" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-700">Completar perfil</Link>
              </section>

              <section className="rounded-lg border border-amber-200 bg-amber-50/60 p-5">
                <FileText className="h-6 w-6 text-amber-700" />
                <h2 className="mt-4 text-lg font-bold text-[#071a4a]">Tu hoja de vida</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Crea o edita tu CV con formato ATS, puntaje IA y descarga en PDF. Se precarga con tus datos del perfil.</p>
                <Link to="/empleo#creador" className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-amber-600 text-sm font-bold text-white transition hover:bg-amber-700">Crear / editar hoja de vida <ArrowRight className="h-4 w-4" /></Link>
              </section>

              <section className="rounded-lg border border-slate-200 bg-[#071a4a] p-5 text-white">
                <BriefcaseBusiness className="h-6 w-6 text-teal-300" />
                <h2 className="mt-4 text-lg font-bold">Explora antes de decidir</h2>
                <p className="mt-2 text-sm leading-6 text-slate-200">Compara funciones y competencias antes de invertir tiempo en una formación.</p>
                <Link to="/carreras" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">Ver carreras <ArrowRight className="h-4 w-4" /></Link>
              </section>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Compass, LockKeyhole, SearchCheck, Target, Wrench } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useProfessional } from '../context/ProfessionalContext';
import { EXPERIENCE_LEVELS, PROFESSIONAL_CAREERS, PROFESSIONAL_GOALS, PROFESSIONAL_INTERESTS, PROFESSIONAL_SKILLS, PROFESSIONAL_TOOLS, getCareerOption } from '../data/professionalProfileOptions';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

const steps = [
  { number: 1, label: 'Etapa', icon: BriefcaseBusiness },
  { number: 2, label: 'Objetivo', icon: Target },
  { number: 3, label: 'Áreas', icon: Compass },
  { number: 4, label: 'Habilidades', icon: SearchCheck },
  { number: 5, label: 'Herramientas', icon: Wrench },
  { number: 6, label: 'Disponibilidad', icon: LockKeyhole },
];

export default function ProfessionalOnboarding() {
  const navigate = useNavigate();
  const { user, profile: accountProfile, loading: authLoading } = useAuth();
  const { professionalProfile, loading: workspaceLoading, workspaceError, upsertProfessionalProfile, refreshWorkspace } = useProfessional();
  const [step, setStep] = useState(1);
  const [careers, setCareers] = useState(PROFESSIONAL_CAREERS);
  const [draft, setDraft] = useState({
    display_name: '',
    current_role: '',
    experience_level: '',
    education_status: '',
    graduation_year: '',
    professional_goal: '',
    target_career_slug: '',
    professional_summary: '',
    city: '',
    country: 'Colombia',
    interests: [],
    self_reported_skills: [],
    tools: [],
    job_search_status: 'not_looking',
    open_to_projects: false,
    open_to_research: false,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => updatePageSeo({
    title: 'Configura tu perfil profesional | Edvanta',
    description: 'Define tu carrera objetivo y tus intereses para organizar una experiencia de aprendizaje relevante.',
    canonical: 'https://edvanta.co/app/onboarding',
    robots: 'noindex,nofollow',
  }), []);

  useEffect(() => {
    if (!authLoading && !user) navigate('/cuenta?modo=registro&next=%2Fapp%2Fonboarding', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!workspaceLoading && professionalProfile?.onboarding_completed) navigate('/app', { replace: true });
  }, [workspaceLoading, professionalProfile, navigate]);

  useEffect(() => {
    setDraft(current => ({
      ...current,
      display_name: professionalProfile?.display_name || accountProfile?.full_name || current.display_name,
      current_role: professionalProfile?.current_role || current.current_role,
      experience_level: professionalProfile?.experience_level || current.experience_level,
      education_status: professionalProfile?.education_status || current.education_status,
      graduation_year: professionalProfile?.graduation_year || current.graduation_year,
      professional_goal: professionalProfile?.professional_goal || current.professional_goal,
      target_career_slug: professionalProfile?.target_career_slug || current.target_career_slug,
      professional_summary: professionalProfile?.professional_summary || current.professional_summary,
      city: professionalProfile?.city || current.city,
      country: professionalProfile?.country || accountProfile?.country || current.country,
      interests: professionalProfile?.interests || current.interests,
      self_reported_skills: professionalProfile?.self_reported_skills || current.self_reported_skills,
      tools: professionalProfile?.tools || current.tools,
      job_search_status: professionalProfile?.job_search_status || current.job_search_status,
      open_to_projects: professionalProfile?.open_to_projects || current.open_to_projects,
      open_to_research: professionalProfile?.open_to_research || current.open_to_research,
    }));
  }, [professionalProfile, accountProfile]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl('/api/careers'), { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('fallback')))
      .then(payload => {
        const rows = Array.isArray(payload.data) ? payload.data : [];
        if (rows.length) setCareers(rows.map(career => ({ slug: career.slug, name: career.name, pathSlug: getCareerOption(career.slug)?.pathSlug || '' })));
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const selectedCareer = useMemo(() => careers.find(career => career.slug === draft.target_career_slug), [careers, draft.target_career_slug]);

  const updateDraft = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  const toggleInterest = interest => setDraft(current => ({
    ...current,
    interests: current.interests.includes(interest)
      ? current.interests.filter(item => item !== interest)
      : [...current.interests, interest],
  }));
  const toggleListValue = (field, value) => setDraft(current => ({
    ...current,
    [field]: current[field].includes(value) ? current[field].filter(item => item !== value) : [...current[field], value],
  }));

  const next = () => {
    setError('');
    if (step === 1 && (!draft.display_name.trim() || !draft.experience_level)) return setError('Completa tu nombre y momento profesional.');
    if (step === 2 && !draft.professional_goal) return setError('Elige el objetivo que deseas resolver primero.');
    if (step === 3 && (!draft.target_career_slug || !draft.interests.length)) return setError('Elige una carrera objetivo y al menos un área de interés.');
    setStep(current => Math.min(6, current + 1));
  };

  const finish = async () => {
    setError('');
    setSaving(true);
    const careerOption = getCareerOption(draft.target_career_slug);
    const result = await upsertProfessionalProfile({
      ...draft,
      display_name: draft.display_name.trim(),
      current_role: draft.current_role.trim() || null,
      graduation_year: draft.graduation_year ? Number(draft.graduation_year) : null,
      professional_summary: draft.professional_summary.trim() || null,
      city: draft.city.trim() || null,
      country: draft.country.trim() || null,
      target_path_slug: selectedCareer?.pathSlug || careerOption?.pathSlug || null,
      open_to_work: draft.job_search_status === 'actively_looking',
      profile_visibility: 'private',
      onboarding_completed: true,
    });
    setSaving(false);
    if (result.error) return setError(result.error);
    trackEvent('onboarding_completed', { career: draft.target_career_slug, account_scope: 'professional' });
    trackEvent('profile_completed', { career: draft.target_career_slug, visibility: 'private' });
    navigate('/app', { replace: true });
  };

  if (authLoading || workspaceLoading || !user) {
    return <><Header /><main className="min-h-screen bg-[#f7f9fc] pt-16"><div className="mx-auto max-w-4xl px-4 py-20 sm:px-6"><div className="h-8 w-64 animate-pulse rounded bg-slate-200" /><div className="mt-8 h-80 animate-pulse rounded-lg bg-white" /></div></main></>;
  }

  if (workspaceError && !professionalProfile) {
    return <><Header /><main className="min-h-[75vh] bg-[#f7f9fc] pt-16"><div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6"><LockKeyhole className="mx-auto h-10 w-10 text-teal-700" /><h1 className="mt-5 text-3xl font-bold text-[#071a4a]">Tu espacio profesional necesita activación</h1><p className="mt-3 text-slate-600">{workspaceError}</p><button type="button" onClick={refreshWorkspace} className="mt-6 min-h-11 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">Reintentar</button></div></main><Footer /></>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase text-teal-700">Configuración inicial</p>
            <h1 className="mt-2 text-3xl font-bold text-[#071a4a] sm:text-4xl">Construyamos un punto de partida útil</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Edvanta usará estas respuestas para ordenar carreras, rutas y cursos. Tu perfil permanecerá privado.</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Progreso de configuración">
            {steps.map(item => {
              const Icon = item.icon;
              const active = step === item.number;
              const complete = step > item.number;
              return <li key={item.number} className={`flex min-h-16 items-center gap-3 border-b-2 px-2 ${active ? 'border-teal-600' : complete ? 'border-emerald-500' : 'border-slate-200'}`}><span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${active ? 'bg-teal-700 text-white' : complete ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{complete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span><span className="text-sm font-bold text-slate-700">{item.label}</span></li>;
            })}
          </ol>

          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            {step === 1 && (
              <div className="max-w-2xl">
                <p className="text-sm font-bold text-teal-700">Paso 1 de 6</p>
                <h2 className="mt-2 text-2xl font-bold text-[#071a4a]">¿Dónde estás hoy?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">No necesitas tener experiencia en la industria. Elige la opción que mejor describa tu momento.</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-bold text-slate-700">Nombre para mostrar<input value={draft.display_name} onChange={event => updateDraft('display_name', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
                  <label className="text-sm font-bold text-slate-700">Rol actual, si aplica<input value={draft.current_role} onChange={event => updateDraft('current_role', event.target.value)} placeholder="Ej. Analista de laboratorio" className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
                  <label className="text-sm font-bold text-slate-700">Momento profesional<select value={draft.experience_level} onChange={event => updateDraft('experience_level', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"><option value="">Selecciona una opción</option>{EXPERIENCE_LEVELS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                  <label className="text-sm font-bold text-slate-700">Estado educativo<select value={draft.education_status} onChange={event => updateDraft('education_status', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"><option value="">Selecciona una opción</option><option value="student">Estudiante</option><option value="final_semesters">Últimos semestres</option><option value="graduate">Graduado</option><option value="postgraduate">Posgrado</option><option value="not_applicable">No aplica</option></select></label>
                  <label className="text-sm font-bold text-slate-700">Año de graduación<input type="number" min="1950" max="2100" value={draft.graduation_year} onChange={event => updateDraft('graduation_year', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm font-bold text-teal-700">Paso 2 de 6</p>
                <h2 className="mt-2 text-2xl font-bold text-[#071a4a]">¿Qué quieres resolver primero?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">El panel priorizará acciones según este objetivo. Podrás cambiarlo cuando tu situación evolucione.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PROFESSIONAL_GOALS.map(goal => {
                    const selected = draft.professional_goal === goal.value;
                    return <button key={goal.value} type="button" onClick={() => updateDraft('professional_goal', goal.value)} aria-pressed={selected} className={`min-h-20 rounded-lg border p-4 text-left text-sm font-bold transition ${selected ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-100' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'}`}>{goal.label}{selected && <Check className="mt-3 h-4 w-4 text-teal-700" />}</button>;
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-sm font-bold text-teal-700">Paso 3 de 6</p>
                <h2 className="mt-2 text-2xl font-bold text-[#071a4a]">Elige una carrera y tus áreas de interés</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Puedes cambiar la carrera después. Esta elección ordena competencias y cursos relevantes.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {careers.map(career => {
                    const selected = draft.target_career_slug === career.slug;
                    return <button key={career.slug} type="button" onClick={() => updateDraft('target_career_slug', career.slug)} aria-pressed={selected} className={`min-h-20 rounded-lg border p-4 text-left text-sm font-bold transition ${selected ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-100' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'}`}>{career.name}{selected && <Check className="mt-3 h-4 w-4 text-teal-700" />}</button>;
                  })}
                </div>
                <p className="mt-7 text-sm font-bold text-[#071a4a]">Temas que quieres fortalecer</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {PROFESSIONAL_INTERESTS.map(interest => {
                    const selected = draft.interests.includes(interest);
                    return <button key={interest} type="button" onClick={() => toggleInterest(interest)} aria-pressed={selected} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${selected ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-slate-300 bg-white text-slate-600 hover:border-teal-300'}`}>{interest}</button>;
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <p className="text-sm font-bold text-teal-700">Paso 4 de 6</p>
                <h2 className="mt-2 text-2xl font-bold text-[#071a4a]">¿Qué habilidades ya tienes?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Es una autoevaluación inicial, no una certificación. Más adelante podrás adjuntar evidencia.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{PROFESSIONAL_SKILLS.map(skill => { const selected = draft.self_reported_skills.includes(skill); return <button key={skill} type="button" onClick={() => toggleListValue('self_reported_skills', skill)} aria-pressed={selected} className={`min-h-14 rounded-lg border px-4 text-left text-sm font-semibold ${selected ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-slate-200 text-slate-700 hover:border-teal-300'}`}>{skill}{selected && <Check className="mt-2 h-4 w-4 text-teal-700" />}</button>; })}</div>
              </div>
            )}

            {step === 5 && (
              <div>
                <p className="text-sm font-bold text-teal-700">Paso 5 de 6</p>
                <h2 className="mt-2 text-2xl font-bold text-[#071a4a]">¿Qué herramientas utilizas?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Selecciona solo las que hayas usado. Esto ayudará a reconocer brechas digitales sin inflar tu perfil.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{PROFESSIONAL_TOOLS.map(tool => { const selected = draft.tools.includes(tool); return <button key={tool} type="button" onClick={() => toggleListValue('tools', tool)} aria-pressed={selected} className={`min-h-14 rounded-lg border px-4 text-left text-sm font-semibold ${selected ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-700 hover:border-indigo-300'}`}>{tool}{selected && <Check className="mt-2 h-4 w-4 text-indigo-700" />}</button>; })}</div>
              </div>
            )}

            {step === 6 && (
              <div>
                <p className="text-sm font-bold text-teal-700">Paso 6 de 6</p>
                <h2 className="mt-2 text-2xl font-bold text-[#071a4a]">Disponibilidad y contexto</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Estos datos preparan futuras recomendaciones. Tu perfil seguirá siendo privado.</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-bold text-slate-700">Ciudad<input value={draft.city} onChange={event => updateDraft('city', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
                  <label className="text-sm font-bold text-slate-700">País<input value={draft.country} onChange={event => updateDraft('country', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
                  <label className="text-sm font-bold text-slate-700 sm:col-span-2">Búsqueda de empleo<select value={draft.job_search_status} onChange={event => updateDraft('job_search_status', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"><option value="actively_looking">Busco empleo activamente</option><option value="open">Estoy abierto a oportunidades</option><option value="not_looking">No busco empleo ahora</option></select></label>
                  <label className="text-sm font-bold text-slate-700 sm:col-span-2">Resumen profesional<textarea value={draft.professional_summary} onChange={event => updateDraft('professional_summary', event.target.value)} rows="4" placeholder="Cuéntanos qué sabes, qué estás construyendo y hacia dónde quieres avanzar." className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm font-normal leading-6 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2"><label className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 text-sm text-slate-700"><input type="checkbox" checked={draft.open_to_projects} onChange={event => updateDraft('open_to_projects', event.target.checked)} className="mt-0.5 h-4 w-4 accent-teal-700" /><span><strong className="block text-[#071a4a]">Abierto a proyectos</strong><span className="mt-1 block text-xs leading-5 text-slate-500">Para iniciativas prácticas o de innovación claramente identificadas.</span></span></label><label className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 text-sm text-slate-700"><input type="checkbox" checked={draft.open_to_research} onChange={event => updateDraft('open_to_research', event.target.checked)} className="mt-0.5 h-4 w-4 accent-teal-700" /><span><strong className="block text-[#071a4a]">Abierto a investigación</strong><span className="mt-1 block text-xs leading-5 text-slate-500">Solo oportunidades verificadas y con alcance transparente.</span></span></label></div>
                <div className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" /><div><p className="text-sm font-bold text-[#071a4a]">Privado por defecto</p><p className="mt-1 text-xs leading-5 text-slate-600">Nada de este perfil será público mientras no actives expresamente una función de visibilidad.</p></div></div>
              </div>
            )}

            {error && <p className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800" role="alert">{error}</p>}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
              <button type="button" onClick={() => setStep(current => Math.max(1, current - 1))} disabled={step === 1} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 disabled:invisible"><ArrowLeft className="h-4 w-4" /> Anterior</button>
              {step < 6 ? <button type="button" onClick={next} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">Continuar <ArrowRight className="h-4 w-4" /></button> : <button type="button" onClick={finish} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Guardando...' : 'Abrir mi panel'} <ArrowRight className="h-4 w-4" /></button>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

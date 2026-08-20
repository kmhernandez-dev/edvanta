import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, FileText, LockKeyhole, Save } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useProfessional } from '../context/ProfessionalContext';
import { EXPERIENCE_LEVELS, PROFESSIONAL_CAREERS, PROFESSIONAL_INTERESTS, getCareerOption } from '../data/professionalProfileOptions';
import { updatePageSeo } from '../utils/seo';

export default function ProfessionalProfilePage() {
  const navigate = useNavigate();
  const { user, profile: accountProfile, loading: authLoading } = useAuth();
  const { professionalProfile, loading, upsertProfessionalProfile } = useProfessional();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => updatePageSeo({
    title: 'Editar perfil profesional | Edvanta',
    description: 'Actualiza tu objetivo, experiencia e intereses profesionales.',
    canonical: 'https://edvanta.co/app/perfil',
    robots: 'noindex,nofollow',
  }), []);

  useEffect(() => {
    if (!authLoading && !user) navigate('/cuenta?next=%2Fapp%2Fperfil', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!loading && user && !professionalProfile?.onboarding_completed) navigate('/app/onboarding', { replace: true });
  }, [loading, user, professionalProfile, navigate]);

  useEffect(() => {
    if (professionalProfile) setDraft({
      display_name: professionalProfile.display_name || accountProfile?.full_name || '',
      headline: professionalProfile.headline || '',
      current_role: professionalProfile.current_role || '',
      experience_level: professionalProfile.experience_level || '',
      target_career_slug: professionalProfile.target_career_slug || '',
      professional_summary: professionalProfile.professional_summary || '',
      city: professionalProfile.city || '',
      country: professionalProfile.country || '',
      interests: professionalProfile.interests || [],
    });
  }, [professionalProfile, accountProfile]);

  const update = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  const toggleInterest = interest => update('interests', draft.interests.includes(interest) ? draft.interests.filter(item => item !== interest) : [...draft.interests, interest]);

  const save = async event => {
    event.preventDefault();
    setMessage('');
    if (!draft.display_name.trim() || !draft.experience_level || !draft.target_career_slug) return setMessage('Completa nombre, momento profesional y carrera objetivo.');
    setSaving(true);
    const career = getCareerOption(draft.target_career_slug);
    const result = await upsertProfessionalProfile({
      ...draft,
      display_name: draft.display_name.trim(),
      headline: draft.headline.trim() || null,
      current_role: draft.current_role.trim() || null,
      professional_summary: draft.professional_summary.trim() || null,
      city: draft.city.trim() || null,
      country: draft.country.trim() || null,
      target_path_slug: career?.pathSlug || professionalProfile.target_path_slug,
      onboarding_completed: true,
    });
    setSaving(false);
    setMessage(result.error || 'Cambios guardados correctamente.');
  };

  if (authLoading || loading || !draft) {
    return <><Header /><main className="min-h-screen bg-[#f7f9fc] pt-16"><div className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><div className="h-10 w-72 animate-pulse rounded bg-slate-200" /><div className="mt-8 h-96 animate-pulse rounded-lg bg-white" /></div></main></>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <Link to="/app" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft className="h-4 w-4" /> Volver al panel</Link>
            <h1 className="mt-5 text-3xl font-bold text-[#071a4a] sm:text-4xl">Edita tu perfil profesional</h1>
            <p className="mt-3 text-slate-600">Mantén actualizado tu objetivo para que tus rutas y recomendaciones sigan teniendo sentido.</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <form onSubmit={save} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">Nombre para mostrar<input value={draft.display_name} onChange={event => update('display_name', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
              <label className="text-sm font-bold text-slate-700">Rol actual<input value={draft.current_role} onChange={event => update('current_role', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">Titular profesional<input value={draft.headline} onChange={event => update('headline', event.target.value)} placeholder="Ej. Química farmacéutica enfocada en aseguramiento de calidad" className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
              <label className="text-sm font-bold text-slate-700">Momento profesional<select value={draft.experience_level} onChange={event => update('experience_level', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"><option value="">Selecciona</option>{EXPERIENCE_LEVELS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
              <label className="text-sm font-bold text-slate-700">Carrera objetivo<select value={draft.target_career_slug} onChange={event => update('target_career_slug', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"><option value="">Selecciona</option>{PROFESSIONAL_CAREERS.map(career => <option key={career.slug} value={career.slug}>{career.name}</option>)}</select></label>
              <label className="text-sm font-bold text-slate-700">Ciudad<input value={draft.city} onChange={event => update('city', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
              <label className="text-sm font-bold text-slate-700">País<input value={draft.country} onChange={event => update('country', event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">Resumen profesional<textarea value={draft.professional_summary} onChange={event => update('professional_summary', event.target.value)} rows="5" className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal leading-6 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
            </div>

            <fieldset className="mt-7 border-t border-slate-200 pt-6"><legend className="text-sm font-bold text-[#071a4a]">Intereses profesionales</legend><div className="mt-4 flex flex-wrap gap-2">{PROFESSIONAL_INTERESTS.map(interest => { const selected = draft.interests.includes(interest); return <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${selected ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-slate-300 text-slate-600'}`}>{selected && <Check className="h-3.5 w-3.5" />}{interest}</button>; })}</div></fieldset>

            <div className="mt-7 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#071a4a]">¿Buscas empleo? Convierte estos datos en tu hoja de vida</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">El creador de hojas de vida precarga tu nombre, rol, ciudad y resumen desde este perfil. Luego lo guardas, lo analiza la IA y lo descargas en PDF ATS.</p>
                </div>
                <Link to="/empleo#creador" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-600 px-4 text-sm font-bold text-white transition hover:bg-amber-700">Crear mi hoja de vida</Link>
              </div>
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" /><div><p className="text-sm font-bold text-[#071a4a]">Perfil privado</p><p className="mt-1 text-xs leading-5 text-slate-600">Tu información profesional no se publica ni se comparte con empresas sin una acción explícita de tu parte.</p></div></div>
            {message && <p className={`mt-5 rounded-lg border p-3 text-sm ${message.startsWith('Cambios') ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`} role="status">{message}</p>}
            <div className="mt-7 flex justify-end"><button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar cambios'}</button></div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

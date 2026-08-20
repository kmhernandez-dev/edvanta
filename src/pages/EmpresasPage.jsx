/**
 * ============================================================
 *  EmpresasPage.jsx — Talento farmacéutico (workspace real)
 *
 *  Dos herramientas funcionales sobre la API de comunidad:
 *   1. Publicar mi perfil: constructor con vista previa en vivo,
 *      prefill del perfil profesional y publicación real
 *      (POST /api/community/talent, queda en revisión).
 *   2. Buscar talento: directorio filtrable por área y búsqueda
 *      (GET /api/community/talent).
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Building2, ClipboardCopy, ExternalLink, FileText,
  Search, Sparkles, UserRound, Users, Send, Eye,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { areasTalento, datosPerfilTalento } from '../data/careerHub';
import { useAuth } from '../context/AuthContext';
import { useProfessional } from '../context/ProfessionalContext';
import { EDVANTA_WHATSAPP_URL } from '../config/links';

const TALENTO_DEMO = [
  { id: 'demo-1', nombre: 'Camila Rodríguez', area: 'calidad', titulo: 'Química farmacéutica — Analista de control de calidad', habilidades: ['Química analítica', 'Microbiología', 'BPM', 'Integridad de datos'], proyectos: ['Validación de método de disolución', 'Checklist de muestreo'], articulos: ['Estabilidad de formas sólidas en clima tropical'], linkedin: 'https://www.linkedin.com/', disponibilidad: 'Disponible para iniciar' },
  { id: 'demo-2', nombre: 'Andrés Páez', area: 'regulatorio', titulo: 'Profesional de asuntos regulatorios', habilidades: ['Registros sanitarios', 'Etiquetado', 'Dossiers', 'Farmacovigilancia'], proyectos: ['Renovación de 12 registros sanitarios'], articulos: ['Actualización normativa para cosméticos en Colombia'], linkedin: 'https://www.linkedin.com/', disponibilidad: 'Abierto a proyectos y consultoría' },
  { id: 'demo-3', nombre: 'Julián Castro', area: 'farmacovigilancia', titulo: 'Analista de farmacovigilancia', habilidades: ['Gestión de casos', 'Evaluación de causalidad', 'ICSR', 'Señales'], proyectos: ['Soporte a titular de registro en reportes de seguridad'], articulos: ['Reporte de eventos adversos en biotecnológicos'], linkedin: 'https://www.linkedin.com/', disponibilidad: 'Disponible para iniciar' },
  { id: 'demo-4', nombre: 'Laura Martínez', area: 'clinico', titulo: 'Química farmacéutica — Farmacia hospitalaria', habilidades: ['Seguimiento farmacoterapéutico', 'Conciliación', 'Unidosis'], proyectos: ['Programa de conciliación medicamentosa en hospital'], articulos: ['Intervenciones farmacéuticas documentadas'], linkedin: 'https://www.linkedin.com/', disponibilidad: 'Disponible para iniciar' },
];

const areaLabel = (slug) => areasTalento.find(a => a.slug === slug)?.nombre || slug;
const splitLines = (s, max) => String(s || '').split('\n').map(x => x.trim()).filter(Boolean).slice(0, max);

// ── Tarjeta de talento (se usa en el directorio y en la vista previa) ──
function TalentCard({ t, preview = false }) {
  return (
    <article className={`flex min-h-72 flex-col rounded-xl border bg-white p-5 shadow-sm ${preview ? 'border-edvanta-blue/30' : 'border-edvanta-border transition hover:-translate-y-0.5 hover:border-edvanta-blue/40 hover:shadow-md'}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-edvanta-light text-edvanta-blue"><UserRound className="h-5 w-5" aria-hidden="true" /></span>
        {t.area && <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700">{areaLabel(t.area)}</span>}
      </div>
      <h3 className="mt-3 text-lg font-bold text-edvanta-deep">{t.nombre || 'Tu nombre'}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-700">{t.titulo || 'Tu título profesional'}</p>
      {(t.habilidades || []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.habilidades.map(h => <span key={h} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{h}</span>)}
        </div>
      )}
      {(t.proyectos || []).length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-[11px] font-bold uppercase text-slate-500">Proyectos y páginas</p>
          <ul className="mt-1 space-y-1">{t.proyectos.map(p => <li key={p} className="text-xs leading-5 text-slate-600">· {p}</li>)}</ul>
        </div>
      )}
      {(t.articulos || []).length > 0 && (
        <div className="mt-2 border-t border-slate-100 pt-2">
          <p className="text-[11px] font-bold uppercase text-slate-500">Artículos científicos</p>
          <ul className="mt-1 space-y-1">{t.articulos.map(a => <li key={a} className="text-xs leading-5 text-slate-600">· {a}</li>)}</ul>
        </div>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="text-[11px] font-bold text-teal-700">{t.disponibilidad || 'Disponible'}</span>
        {t.linkedin
          ? <a href={preview ? undefined : t.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-edvanta-blue">Ver perfil <ExternalLink className="h-3 w-3" aria-hidden="true" /></a>
          : <span className="text-xs text-slate-300">LinkedIn</span>}
      </div>
    </article>
  );
}

const EMPTY_FORM = { display_name: '', area: '', title: '', habilidades: '', proyectos: '', articulos: '', linkedin: '', contacto: '', disponibilidad: '' };

export default function EmpresasPage() {
  const { profile: accountProfile } = useAuth();
  const { professionalProfile } = useProfessional();
  const [tab, setTab] = useState('directorio'); // directorio | publicar
  const [area, setArea] = useState('todas');
  const [query, setQuery] = useState('');
  const [perfiles, setPerfiles] = useState(TALENTO_DEMO);
  const [loadingPerfiles, setLoadingPerfiles] = useState(false);
  const [apiError, setApiError] = useState('');

  const [form, setForm] = useState(EMPTY_FORM);
  const [enviando, setEnviando] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [formOk, setFormOk] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => updatePageSeo({
    title: 'Talento farmacéutico para empresas | Edvanta',
    description: 'Publica tu perfil profesional farmacéutico o busca talento por área: habilidades, proyectos, artículos y contacto.',
    canonical: 'https://edvanta.co/empresas',
    jsonLdId: 'empresas',
    jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Talento farmacéutico Edvanta', url: 'https://edvanta.co/empresas' },
  }), []);

  // Prefill del perfil profesional (si existe) al abrir "Publicar mi perfil".
  useEffect(() => {
    if (tab !== 'publicar') return;
    setForm(prev => {
      if (prev.display_name || prev.title) return prev;
      const nombre = professionalProfile?.display_name || accountProfile?.full_name || '';
      const titulo = professionalProfile?.current_role || professionalProfile?.headline || '';
      if (!nombre && !titulo) return prev;
      return { ...prev, display_name: nombre, title: titulo };
    });
  }, [tab, professionalProfile, accountProfile]);

  // Directorio (API real, con debounce).
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoadingPerfiles(true);
      const params = new URLSearchParams();
      if (area !== 'todas') params.set('area', area);
      if (query.trim()) params.set('q', query.trim());
      const qs = params.toString();
      fetch(apiUrl(`/api/community/talent${qs ? `?${qs}` : ''}`), { signal: controller.signal })
        .then(r => r.ok ? r.json() : { data: [] })
        .then(payload => {
          const apiProfiles = Array.isArray(payload.data) ? payload.data.map(p => ({
            id: p.id || p.slug, nombre: p.display_name, area: p.area, titulo: p.title,
            habilidades: Array.isArray(p.habilidades) ? p.habilidades : [],
            proyectos: Array.isArray(p.proyectos) ? p.proyectos : [],
            articulos: Array.isArray(p.articulos) ? p.articulos : [],
            linkedin: p.linkedin, contacto: p.contacto, disponibilidad: p.disponibilidad || 'Disponible',
          })) : [];
          if (apiProfiles.length) { setPerfiles(apiProfiles); setApiError(''); }
        })
        .catch(() => setApiError('El directorio en línea no está disponible: mostrando perfiles de ejemplo.'))
        .finally(() => setLoadingPerfiles(false));
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [area, query]);

  const talentosVisibles = useMemo(() => perfiles.filter(t => {
    const porArea = area === 'todas' || t.area === area;
    const q = query.trim().toLowerCase();
    const porBusqueda = !q || `${t.nombre} ${t.titulo} ${(t.habilidades || []).join(' ')}`.toLowerCase().includes(q);
    return porArea && porBusqueda;
  }), [perfiles, area, query]);

  // Vista previa en vivo del perfil que se está construyendo.
  const previewTalent = useMemo(() => ({
    nombre: form.display_name, area: form.area, titulo: form.title,
    habilidades: splitLines(form.habilidades, 12), proyectos: splitLines(form.proyectos, 8),
    articulos: splitLines(form.articulos, 8), linkedin: form.linkedin, disponibilidad: form.disponibilidad,
  }), [form]);

  const completos = ['display_name', 'area', 'title'].filter(k => form[k].trim()).length;
  const progreso = Math.round((completos / 3) * 100 * 0.6 + (splitLines(form.habilidades, 12).length ? 25 : 0) + (form.contacto.trim() ? 15 : 0));

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const copiarPerfil = async () => {
    const t = previewTalent;
    const txt = [t.nombre, t.titulo, areaLabel(t.area), '', 'Habilidades: ' + t.habilidades.join(', '), t.proyectos.length ? 'Proyectos: ' + t.proyectos.join('; ') : '', t.articulos.length ? 'Artículos: ' + t.articulos.join('; ') : '', form.linkedin, form.contacto].filter(Boolean).join('\n');
    try { await navigator.clipboard.writeText(txt); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch { /* noop */ }
  };

  const publicar = async (event) => {
    event.preventDefault();
    if (!form.display_name.trim() || !form.area.trim() || !form.title.trim()) {
      setFormOk(false); setFormMsg('Completa al menos nombre, área y título profesional.');
      return;
    }
    setEnviando(true); setFormMsg('');
    const payload = {
      display_name: form.display_name.trim(), area: form.area.trim().toLowerCase(), title: form.title.trim(),
      habilidades: splitLines(form.habilidades, 12), proyectos: splitLines(form.proyectos, 8), articulos: splitLines(form.articulos, 8),
      linkedin: form.linkedin.trim(), contacto: form.contacto.trim(), disponibilidad: form.disponibilidad.trim(),
    };
    try {
      const res = await fetch(apiUrl('/api/community/talent'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) { setFormOk(false); setFormMsg(`Límite de publicaciones alcanzado: ${data.error || 'intenta de nuevo en unos minutos.'}`); }
      else if (res.ok && data.ok) { setFormOk(true); setFormMsg('¡Listo! Tu perfil quedó registrado y será visible tras la revisión del equipo.'); }
      else { setFormOk(false); setFormMsg(data.error || 'No se pudo publicar el perfil. Intenta de nuevo.'); }
    } catch { setFormOk(false); setFormMsg('Sin conexión: tu perfil no se pudo enviar. Inténtalo más tarde.'); }
    setEnviando(false);
  };

  const inputCls = 'min-h-11 w-full rounded-lg border border-edvanta-border px-3.5 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        {/* Hero Edvanta */}
        <section className="relative overflow-hidden bg-gradient-to-br from-edvanta-deep to-edvanta-blue py-14 lg:py-16">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras
            </Link>
            <div className="mt-6 flex max-w-3xl items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur"><Building2 className="h-7 w-7" aria-hidden="true" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-edvanta-light">Talento farmacéutico</p>
                <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">Conecta tu perfil con las empresas del sector</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-edvanta-light">Publica tu perfil profesional con habilidades, proyectos y artículos, o busca talento clasificado por área. Cada perfil se organiza por su especialización.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="border-b border-edvanta-border bg-white">
          <div className="mx-auto flex max-w-7xl gap-2 px-4 py-4 sm:px-6 lg:px-8">
            {[{ id: 'directorio', label: 'Buscar talento', icon: Search }, { id: 'publicar', label: 'Publicar mi perfil', icon: UserRound }].map(t => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-pressed={tab === t.id}
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-bold transition ${tab === t.id ? 'border-edvanta-blue bg-edvanta-blue text-white' : 'border-edvanta-border bg-white text-slate-700 hover:border-edvanta-blue/40'}`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* ══ DIRECTORIO ══ */}
        {tab === 'directorio' && (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative min-w-[240px] flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre, cargo o habilidad…" className={inputCls + ' pl-10'} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por área">
                <button type="button" onClick={() => setArea('todas')} aria-pressed={area === 'todas'} className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold transition ${area === 'todas' ? 'border-edvanta-blue bg-edvanta-blue text-white' : 'border-edvanta-border bg-white text-slate-700 hover:border-edvanta-blue/40'}`}>Todas</button>
                {areasTalento.map(a => (
                  <button key={a.slug} type="button" onClick={() => setArea(a.slug)} aria-pressed={area === a.slug} className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold transition ${area === a.slug ? 'border-edvanta-blue bg-edvanta-blue text-white' : 'border-edvanta-border bg-white text-slate-700 hover:border-edvanta-blue/40'}`}>{a.nombre}</button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-3">
              <p className="text-sm text-slate-500">{loadingPerfiles ? 'Consultando el directorio…' : `${talentosVisibles.length} perfiles · clasificados por área`}</p>
              <button type="button" onClick={() => setTab('publicar')} className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-edvanta-blue hover:underline"><UserRound className="h-4 w-4" /> Publicar mi perfil</button>
            </div>
            {apiError && <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="status">{apiError}</p>}

            {loadingPerfiles ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(i => <div key={i} className="h-72 animate-pulse rounded-xl border border-edvanta-border bg-white" />)}</div>
            ) : talentosVisibles.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{talentosVisibles.map(t => <TalentCard key={t.id} t={t} />)}</div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-edvanta-border bg-white px-6 py-14 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
                <p className="mt-3 text-lg font-bold text-edvanta-deep">No encontramos perfiles con esos criterios</p>
                <button type="button" onClick={() => { setArea('todas'); setQuery(''); }} className="btn-edvanta mt-4">Limpiar filtros</button>
              </div>
            )}
          </section>
        )}

        {/* ══ PUBLICAR MI PERFIL (constructor + vista previa) ══ */}
        {tab === 'publicar' && (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start lg:gap-6">
              {/* Formulario */}
              <form onSubmit={publicar} className="rounded-2xl border border-edvanta-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-edvanta-deep">Publica tu perfil profesional</h2>
                  <span className="text-xs font-bold text-edvanta-blue">{Math.min(100, progreso)}%</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">Cuenta qué sabes hacer. Las empresas te encontrarán por tu área. Se revisa antes de publicarse.</p>
                {(professionalProfile?.display_name || accountProfile?.full_name) && <p className="mt-2 text-xs font-semibold text-teal-700">Prellenamos tus datos desde tu perfil profesional. Ajusta lo que quieras.</p>}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block"><span className="mb-1 block text-sm font-bold text-edvanta-deep">Nombre *</span><input value={form.display_name} onChange={e => setField('display_name', e.target.value)} placeholder="Ej. Camila Rodríguez" className={inputCls} /></label>
                  <label className="block"><span className="mb-1 block text-sm font-bold text-edvanta-deep">Área de especialización *</span>
                    <select value={form.area} onChange={e => setField('area', e.target.value)} className={inputCls}><option value="">Elige tu área…</option>{areasTalento.map(a => <option key={a.slug} value={a.slug}>{a.nombre}</option>)}</select>
                  </label>
                  <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-bold text-edvanta-deep">Título profesional *</span><input value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Ej. Química farmacéutica — Analista de control de calidad" className={inputCls} /></label>
                  <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-bold text-edvanta-deep">Habilidades y competencias <span className="font-normal text-slate-400">(una por línea)</span></span><textarea value={form.habilidades} onChange={e => setField('habilidades', e.target.value)} rows={3} placeholder={'Química analítica\nMicrobiología\nBPM'} className="w-full rounded-lg border border-edvanta-border p-3.5 text-sm outline-none focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15" /></label>
                  <label className="block"><span className="mb-1 block text-sm font-bold text-edvanta-deep">Proyectos y páginas</span><textarea value={form.proyectos} onChange={e => setField('proyectos', e.target.value)} rows={3} placeholder={'Nombre del proyecto o URL\nde tu portafolio'} className="w-full rounded-lg border border-edvanta-border p-3.5 text-sm outline-none focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15" /></label>
                  <label className="block"><span className="mb-1 block text-sm font-bold text-edvanta-deep">Artículos científicos</span><textarea value={form.articulos} onChange={e => setField('articulos', e.target.value)} rows={3} placeholder={'Títulos de tus papers\no publicaciones'} className="w-full rounded-lg border border-edvanta-border p-3.5 text-sm outline-none focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15" /></label>
                  <label className="block"><span className="mb-1 block text-sm font-bold text-edvanta-deep">LinkedIn</span><input value={form.linkedin} onChange={e => setField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" className={inputCls} /></label>
                  <label className="block"><span className="mb-1 block text-sm font-bold text-edvanta-deep">Contacto (email o WhatsApp)</span><input value={form.contacto} onChange={e => setField('contacto', e.target.value)} placeholder="Para que las empresas te contacten" className={inputCls} /></label>
                  <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-bold text-edvanta-deep">Disponibilidad</span><input value={form.disponibilidad} onChange={e => setField('disponibilidad', e.target.value)} placeholder="Ej. Disponible para iniciar, abierto a proyectos…" className={inputCls} /></label>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button type="submit" disabled={enviando} className="btn-edvanta disabled:opacity-60"><Send className="h-4 w-4" /> {enviando ? 'Publicando…' : 'Publicar mi perfil'}</button>
                  <button type="button" onClick={copiarPerfil} className="btn-edvanta-outline"><ClipboardCopy className="h-4 w-4" /> {copiado ? 'Copiado' : 'Copiar mi perfil'}</button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Tu perfil aparece tras la revisión del equipo. No compartas datos sensibles de terceros.</p>
                {formMsg && <div className={`mt-4 rounded-lg border p-4 text-sm leading-6 ${formOk ? 'border-teal-200 bg-teal-50 text-teal-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`} role="status">{formMsg}</div>}
              </form>

              {/* Vista previa en vivo */}
              <div className="mt-6 lg:sticky lg:top-20 lg:mt-0">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400"><Eye className="h-3.5 w-3.5" /> Así te verán las empresas</p>
                <TalentCard t={previewTalent} preview />
              </div>
            </div>
          </section>
        )}

        {/* Qué contiene cada perfil + CTA empresa */}
        <section className="border-y border-edvanta-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-edvanta-blue" aria-hidden="true" /><h2 className="text-2xl font-bold text-edvanta-deep sm:text-3xl">Qué contiene cada perfil profesional</h2></div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{datosPerfilTalento.intro}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {datosPerfilTalento.campos.map(campo => (
                <div key={campo} className="flex items-center gap-2 rounded-lg border border-edvanta-border bg-slate-50 p-4"><BadgeCheck className="h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" /><span className="text-sm font-bold text-edvanta-deep">{campo}</span></div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-edvanta"><Users className="h-4 w-4" /> ¿Buscan talento? Escríbannos</a>
              <Link to="/empleo" className="btn-edvanta-outline"><FileText className="h-4 w-4" /> Ver el centro de empleo <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

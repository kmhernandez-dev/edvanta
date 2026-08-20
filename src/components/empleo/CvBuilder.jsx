/**
 * ============================================================
 *  CvBuilder.jsx — Creador de hoja de vida con análisis IA
 *
 *  Formulario estructurado + motor ATS local (score, hallazgos,
 *  recomendaciones), adaptación a cargo objetivo, descarga en
 *  PDF y guardado en la cuenta de Academia.
 * ============================================================
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, Check, CheckCircle2, ClipboardCopy, Download, FileText,
  Info, Lock, Plus, RefreshCw, Save, Sparkles, Trash2, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfessional } from '../../context/ProfessionalContext';
import AcademiaLoginModal from '../AcademiaLoginModal';
import { apiUrl } from '../../config/api';
import { cargosEmpleo } from '../../data/empleo/cargos';
import { analyzeCv, analyzeText, cargarPorSlug, guiaCVContenido, sugerirCargo } from '../../lib/cv/analyzer';
import { downloadCvPdf } from '../../lib/cv/pdf';
import { trackEvent } from '../../utils/analytics';

const EMPTY_CV = {
  nombre: '',
  titulo: '',
  email: '',
  telefono: '',
  ciudad: '',
  linkedin: '',
  resumen: '',
  experiencia: [],
  educacion: [],
  habilidades: [],
  certificaciones: [],
  idiomas: [],
  referencias: [],
};

let uidCounter = 0;
const uid = () => `x-${Date.now()}-${++uidCounter}`;

function stripDraft(cv) {
  const clone = { ...cv };
  clone.experiencia = clone.experiencia.map(({ id, ...rest }) => rest);
  clone.educacion = clone.educacion.map(({ id, ...rest }) => rest);
  clone.certificaciones = clone.certificaciones.map(({ id, ...rest }) => rest);
  clone.idiomas = clone.idiomas.map(({ id, ...rest }) => rest);
  clone.referencias = clone.referencias.map(({ id, ...rest }) => rest);
  return clone;
}

function addIds(cv) {
  return {
    ...cv,
    experiencia: (cv.experiencia || []).map(e => ({ id: uid(), ...e })),
    educacion: (cv.educacion || []).map(e => ({ id: uid(), ...e })),
    certificaciones: (cv.certificaciones || []).map(c => ({ id: uid(), ...c })),
    idiomas: (cv.idiomas || []).map(i => ({ id: uid(), ...i })),
    referencias: (cv.referencias || []).map(r => ({ id: uid(), ...r })),
  };
}

function ScoreGauge({ score }) {
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 80 ? '#0d9488' : pct >= 55 ? '#d97706' : '#dc2626';
  const label = pct >= 80 ? 'Lista para postular' : pct >= 55 ? 'En buen camino' : 'Necesita ajustes';
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 64 64" className="h-20 w-20 -rotate-90">
          <circle cx="32" cy="32" r={R} fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle
            cx="32" cy="32" r={R} fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-[#071a4a]">{pct}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-[#071a4a]">Puntaje ATS: {pct}/100</p>
        <p className="mt-0.5 text-xs font-semibold" style={{ color }}>{label}</p>
        <p className="mt-0.5 max-w-56 text-[11px] leading-4 text-slate-500">Estimado local, orientativo y privado. No se envía tu información a terceros.</p>
      </div>
    </div>
  );
}

function FindingRow({ f }) {
  const icons = {
    ok: <Check className="h-4 w-4 shrink-0 text-teal-600" />,
    warn: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />,
    error: <X className="h-4 w-4 shrink-0 text-rose-600" />,
    info: <Info className="h-4 w-4 shrink-0 text-sky-600" />,
  };
  return (
    <li className={`rounded-lg border p-3 ${f.tipo === 'error' ? 'border-rose-200 bg-rose-50/60' : f.tipo === 'warn' ? 'border-amber-200 bg-amber-50/60' : f.tipo === 'ok' ? 'border-teal-200 bg-teal-50/60' : 'border-sky-200 bg-sky-50/50'}`}>
      <div className="flex items-start gap-2">
        {icons[f.tipo] || icons.info}
        <div>
          <p className="text-sm font-bold text-[#071a4a]">{f.title}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-600">{f.detail}</p>
        </div>
      </div>
    </li>
  );
}

function CopyButton({ text, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch { /* noop */ }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-teal-400 hover:text-teal-800"
    >
      {copied ? <span className="text-teal-700">Copiado</span> : <><ClipboardCopy className="h-3.5 w-3.5" />{label}</>}
    </button>
  );
}

function SkillInput({ onAdd }) {
  const [value, setValue] = useState('');
  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={e => {
        e.preventDefault();
        onAdd(value);
        setValue('');
      }}
    >
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Agrega una habilidad y presiona Enter (ej. Power BI, CAPA, Excel avanzado)"
        className="min-h-10 flex-1 rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-amber-500"
      />
      <button type="submit" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white transition hover:bg-[#0d2d6d]">
        <Plus className="h-4 w-4" /> Agregar
      </button>
    </form>
  );
}

function cvLinkText(cv) {
  return [
    cv.nombre,
    cv.titulo,
    cv.email,
    cv.telefono,
    cv.ciudad,
    cv.linkedin,
  ].filter(Boolean).join('  |  ');
}

export default function CvBuilder() {
  const { academiaApi, academiaUser, academiaToken, user: supabaseUser, profile: accountProfile } = useAuth();
  const { professionalProfile, loading: professionalLoading } = useProfessional();
  const [cv, setCv] = useState(EMPTY_CV);
  const [cargoObjetivo, setCargoObjetivo] = useState('');
  const [saveState, setSaveState] = useState(''); // idle|saving|saved|error
  const [saveMsg, setSaveMsg] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [tab, setTab] = useState('build');
  const [textoPegado, setTextoPegado] = useState('');
  const [textResult, setTextResult] = useState(null);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const builderRef = useRef(null);

  // ── Cargar CV guardado ──
  useEffect(() => {
    if (!academiaUser || !academiaToken) return undefined;
    let cancelled = false;
    setLoadingSaved(true);
    fetch(apiUrl('/api/cv'), { headers: { Authorization: `Bearer ${academiaToken}` } })
      .then(r => r.ok ? r.json() : { cv: null })
      .then(data => {
        if (cancelled) return;
        if (data.cv) setCv(addIds(data.cv));
      })
      .catch(() => { /* sin CV guardado */ })
      .finally(() => { if (!cancelled) setLoadingSaved(false); });
    return () => { cancelled = true; };
  }, [academiaUser, academiaToken]);

  // ── Precargar desde el perfil profesional (Supabase) ──
  // Si no hay CV guardado en Academia pero sí perfil profesional,
  // se prellenan los campos comunes para que la persona no repita
  // sus datos básicos.
  useEffect(() => {
    if (academiaUser) return undefined; // ya tiene CV en Academia
    if (professionalLoading || !professionalProfile) return undefined;
    const perfil = professionalProfile;
    const tieneAlgo = Boolean(perfil?.display_name || perfil?.professional_summary || perfil?.current_role || perfil?.city || perfil?.headline);
    if (!tieneAlgo) return undefined;
    setCv(prev => {
      const relleno = { ...prev };
      if (!prev.nombre) relleno.nombre = perfil.display_name || accountProfile?.full_name || '';
      if (!prev.titulo) relleno.titulo = perfil.current_role || perfil.headline || '';
      if (!prev.resumen && perfil.professional_summary) relleno.resumen = perfil.professional_summary;
      if (!prev.ciudad && perfil.city) relleno.ciudad = perfil.city;
      if (!prev.email && accountProfile?.email) relleno.email = accountProfile.email;
      return relleno;
    });
  }, [professionalProfile, academiaUser, accountProfile]);

  const setField = (key, value) => setCv(prev => ({ ...prev, [key]: value }));

  const addItem = (key) => {
    const templates = {
      experiencia: { id: uid(), cargo: '', empresa: '', inicio: '', fin: '', logros: '' },
      educacion: { id: uid(), titulo: '', institucion: '', anio: '' },
      certificaciones: { id: uid(), nombre: '', institucion: '', anio: '' },
      idiomas: { id: uid(), idioma: '', nivel: '' },
      referencias: { id: uid(), nombre: '', cargo: '', contacto: '' },
    };
    setCv(prev => ({ ...prev, [key]: [...prev[key], templates[key]] }));
  };

  const removeItem = (key, id) => setCv(prev => ({ ...prev, [key]: prev[key].filter(x => x.id !== id) }));

  const patchItem = (key, id, field, value) => setCv(prev => ({
    ...prev,
    [key]: prev[key].map(x => (x.id === id ? { ...x, [field]: value } : x)),
  }));

  const addSkill = (skill) => {
    const s = String(skill || '').trim();
    if (!s || cv.habilidades.some(h => h.toLowerCase() === s.toLowerCase())) return;
    setCv(prev => ({ ...prev, habilidades: [...prev.habilidades, s] }));
  };

  // ── Análisis IA en vivo ──
  const analysis = useMemo(() => {
    if (!cv.nombre && !cv.resumen && !cv.experiencia.length && !cv.habilidades.length) return null;
    return analyzeCv(cv, cargoObjetivo);
  }, [cv, cargoObjetivo]);

  const adaptacion = useMemo(() => {
    if (!cargoObjetivo) return null;
    const cargo = cargarPorSlug(cargoObjetivo);
    if (!cargo) return null;
    const resumenSugerido = cargo.resumenSugerido || '';
    return {
      cargo,
      resumenSugerido,
      logros: cargo.logros || [],
      palabras: cargo.palabras || [],
      secciones: cargo.secciones || [],
    };
  }, [cargoObjetivo]);

  // ── Guardar en cuenta ──
  const guardar = async () => {
    trackEvent('cv_saved_attempt');
    if (!academiaUser) { setLoginOpen(true); return; }
    setSaveState('saving');
    setSaveMsg('');
    try {
      const data = await academiaApi('/api/cv', { method: 'PUT', body: JSON.stringify(stripDraft(cv)) });
      if (data.ok) {
        setSaveState('saved');
        setSaveMsg('Hoja de vida guardada en tu cuenta. Vuelve cuando quieras para editarla.');
      } else {
        setSaveState('error');
        setSaveMsg(data.error || 'No fue posible guardar.');
      }
    } catch (e) {
      setSaveState('error');
      setSaveMsg(e.message || 'Sin conexión: no se pudo guardar ahora.');
    }
  };

  const descargar = async () => {
    trackEvent('cv_download_pdf');
    const label = adaptacion ? adaptacion.cargo.cargo : '';
    try {
      await downloadCvPdf(stripDraft(cv), label);
    } catch {
      setSaveMsg('No fue posible generar el PDF en este navegador.');
      setSaveState('error');
    }
  };

  const aplicarSugerencia = () => {
    if (!adaptacion) return;
    trackEvent('cv_apply_adaptation', { cargo: cargoObjetivo });
    setCv(prev => ({
      ...prev,
      resumen: adaptacion.resumenSugerido,
      titulo: adaptacion.cargo.cargo,
      habilidades: [...new Set([...prev.habilidades, ...adaptacion.cargo.habilidades.filter(Boolean)])],
    }));
    setSaveMsg(`Resumen y habilidades ajustados al cargo: ${adaptacion.cargo.cargo}. Revísalo y descarga tu PDF.`);
  };

  const analizarPegado = () => {
    if (!textoPegado.trim()) return;
    trackEvent('cv_text_analyzed');
    const cargoSugerido = sugerirCargo(textoPegado) || cargoObjetivo;
    setTextResult(analyzeText(textoPegado, cargoSugerido));
    setCargoObjetivo(cargoSugerido);
  };

  const tieneContenido = Boolean(cv.nombre || cv.resumen || cv.experiencia.length || cv.habilidades.length);

  return (
    <div ref={builderRef} className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Herramientas de hoja de vida">
        {[
          { id: 'build', label: 'Creador de hoja de vida', icon: FileText },
          { id: 'analize', label: 'Análisis y puntaje IA', icon: Sparkles },
          { id: 'paste', label: 'Analiza tu CV actual', icon: ClipboardCopy },
          { id: 'guide', label: 'Guía 2026: qué incluir', icon: Info },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-4 text-sm font-bold transition ${tab === t.id ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-amber-400'}`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Creador ── */}
      {tab === 'build' && (
        <>
          {!academiaUser && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-bold text-[#071a4a]">Guarda tu hoja de vida para editarla cuando quieras</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-600">Crea tu cuenta gratuita de Academia (correo o Google): tu CV queda respaldado y podrás recuperarlo desde cualquier dispositivo. La descarga en PDF funciona incluso sin cuenta.</p>
                </div>
              </div>
              <button type="button" onClick={() => setLoginOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white transition hover:bg-[#0d2d6d]">
                <Lock className="h-4 w-4" /> Crear cuenta / iniciar sesión
              </button>
            </div>
          )}

          {loadingSaved && <p className="text-sm text-slate-500">Cargando tu hoja de vida guardada...</p>}

          {/* Encabezado */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Datos de contacto</p>
              <CopyButton text={cvLinkText(cv)} label="Copiar encabezado" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: 'nombre', label: 'Nombre completo', placeholder: 'Ej. María Gómez Pérez', req: true },
                { key: 'titulo', label: 'Título / cargo actual', placeholder: 'Ej. Química farmacéutica' },
                { key: 'email', label: 'Correo', placeholder: 'tu@correo.com', req: true },
                { key: 'telefono', label: 'Teléfono', placeholder: '+57 300 000 0000' },
                { key: 'ciudad', label: 'Ciudad', placeholder: 'Bogotá, Colombia' },
                { key: 'linkedin', label: 'LinkedIn o portafolio', placeholder: 'https://linkedin.com/in/...' },
              ].map(f => (
                <label key={f.key} className="block">
                  <span className="mb-1 block text-sm font-bold text-[#071a4a]">{f.label}{f.req && <span className="text-amber-700"> *</span>}</span>
                  <input
                    value={cv[f.key]}
                    onChange={e => setField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="min-h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>
              ))}
              <label className="block sm:col-span-2 lg:col-span-3">
                <span className="mb-1 block text-sm font-bold text-[#071a4a]">Resumen profesional (25-90 palabras)</span>
                <textarea
                  value={cv.resumen}
                  onChange={e => setField('resumen', e.target.value)}
                  rows={4}
                  placeholder="Soy [profesión] con X años de experiencia en [área]. Mi logro principal: [resultado medible]. Aporto [qué resuelves] en organizaciones del sector farmacéutico."
                  className="w-full rounded-lg border border-slate-300 p-3.5 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <p className={`mt-1 text-xs font-semibold ${cv.resumen.split(/\s+/).filter(Boolean).length > 0 && cv.resumen.split(/\s+/).filter(Boolean).length < 25 ? 'text-amber-700' : 'text-slate-400'}`}>
                  {cv.resumen.split(/\s+/).filter(Boolean).length} palabras · ideal 25-90
                </p>
              </label>
            </div>
          </div>

          {/* Experiencia */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Experiencia laboral (cronológico inverso)</p>
              <button type="button" onClick={() => addItem('experiencia')} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700 transition hover:border-amber-500 hover:text-amber-800">
                <Plus className="h-4 w-4" /> Agregar cargo
              </button>
            </div>
            {cv.experiencia.length === 0 && (
              <p className="mt-3 rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
                Agrega tu cargo más reciente primero. Por cada cargo incluye 2-3 logros medibles, no responsabilidades genéricas.
              </p>
            )}
            <div className="mt-3 space-y-3">
              {cv.experiencia.map(e => (
                <div key={e.id} className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="block sm:col-span-1">
                      <span className="mb-1 block text-xs font-bold text-slate-600">Cargo *</span>
                      <input value={e.cargo} onChange={ev => patchItem('experiencia', e.id, 'cargo', ev.target.value)} placeholder="Ej. Analista de control de calidad" className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold text-slate-600">Empresa</span>
                      <input value={e.empresa} onChange={ev => patchItem('experiencia', e.id, 'empresa', ev.target.value)} placeholder="Nombre de la empresa" className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold text-slate-600">Inicio</span>
                      <input value={e.inicio} onChange={ev => patchItem('experiencia', e.id, 'inicio', ev.target.value)} placeholder="Ene 2023" className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold text-slate-600">Fin (actual = vacío)</span>
                      <input value={e.fin} onChange={ev => patchItem('experiencia', e.id, 'fin', ev.target.value)} placeholder="Mar 2025" className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                    </label>
                  </div>
                  <label className="mt-3 block">
                    <span className="mb-1 block text-xs font-bold text-slate-600">Logros (uno por línea, formato Acción + Impacto)</span>
                    <textarea value={e.logros} onChange={ev => patchItem('experiencia', e.id, 'logros', ev.target.value)} rows={2} placeholder={'Coordiné la renovación de 12 registros sanitarios sin observaciones.\nReducí desviaciones 30% con plan de muestreo.'} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-amber-500" />
                  </label>
                  <button type="button" onClick={() => removeItem('experiencia', e.id)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800">
                    <Trash2 className="h-3.5 w-3.5" /> Quitar cargo
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Formación */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Formación</p>
              <button type="button" onClick={() => addItem('educacion')} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700 transition hover:border-amber-500 hover:text-amber-800">
                <Plus className="h-4 w-4" /> Agregar
              </button>
            </div>
            {cv.educacion.length === 0 && <p className="mt-3 rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">Agrega tu pregrado, posgrados o técnicos.</p>}
            <div className="mt-3 space-y-2">
              {cv.educacion.map(e => (
                <div key={e.id} className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                  <label className="block min-w-52 flex-1">
                    <span className="mb-1 block text-xs font-bold text-slate-600">Título *</span>
                    <input value={e.titulo} onChange={ev => patchItem('educacion', e.id, 'titulo', ev.target.value)} placeholder="Química farmacéutica" className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                  </label>
                  <label className="block min-w-40 flex-1">
                    <span className="mb-1 block text-xs font-bold text-slate-600">Institución</span>
                    <input value={e.institucion} onChange={ev => patchItem('educacion', e.id, 'institucion', ev.target.value)} placeholder="Universidad" className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                  </label>
                  <label className="block w-24">
                    <span className="mb-1 block text-xs font-bold text-slate-600">Año</span>
                    <input value={e.anio} onChange={ev => patchItem('educacion', e.id, 'anio', ev.target.value)} placeholder="2020" className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                  </label>
                  <button type="button" onClick={() => removeItem('educacion', e.id)} className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Habilidades y competencias</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {cv.habilidades.map((h, i) => (
                <span key={`${h}-${i}`} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
                  {h}
                  <button type="button" onClick={() => setCv(prev => ({ ...prev, habilidades: prev.habilidades.filter((_, j) => j !== i) }))} aria-label={`Quitar ${h}`} className="text-amber-600 hover:text-rose-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <SkillInput onAdd={addSkill} />
          </div>

          {/* Certificaciones, idiomas, referencias */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Certificaciones</p>
                <button type="button" onClick={() => addItem('certificaciones')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700 transition hover:border-amber-500"><Plus className="h-3.5 w-3.5" /> Agregar</button>
              </div>
              <div className="mt-3 space-y-2">
                {cv.certificaciones.map(c => (
                  <div key={c.id} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <input value={c.nombre} onChange={ev => patchItem('certificaciones', c.id, 'nombre', ev.target.value)} placeholder="Certificación (ej. BPM INVIMA)" className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                    <div className="mt-2 flex gap-2">
                      <input value={c.institucion} onChange={ev => patchItem('certificaciones', c.id, 'institucion', ev.target.value)} placeholder="Institución" className="min-h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                      <input value={c.anio} onChange={ev => patchItem('certificaciones', c.id, 'anio', ev.target.value)} placeholder="Año" className="min-h-10 w-20 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                      <button type="button" onClick={() => removeItem('certificaciones', c.id)} aria-label="Quitar" className="text-rose-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Idiomas</p>
                  <button type="button" onClick={() => addItem('idiomas')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700 transition hover:border-amber-500"><Plus className="h-3.5 w-3.5" /> Agregar</button>
                </div>
                <div className="mt-3 space-y-2">
                  {cv.idiomas.map(i => (
                    <div key={i.id} className="flex gap-2">
                      <input value={i.idioma} onChange={ev => patchItem('idiomas', i.id, 'idioma', ev.target.value)} placeholder="Idioma (ej. Inglés)" className="min-h-10 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-amber-500" />
                      <select value={i.nivel} onChange={ev => patchItem('idiomas', i.id, 'nivel', ev.target.value)} className="min-h-10 rounded-lg border border-slate-300 bg-slate-50 px-2 text-sm outline-none focus:border-amber-500">
                        <option value="">Nivel</option>
                        <option>Básico</option>
                        <option>Intermedio</option>
                        <option>Avanzado</option>
                        <option>Nativo</option>
                      </select>
                      <button type="button" onClick={() => removeItem('idiomas', i.id)} aria-label="Quitar" className="text-rose-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Referencias</p>
                  <button type="button" onClick={() => addItem('referencias')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700 transition hover:border-amber-500"><Plus className="h-3.5 w-3.5" /> Agregar</button>
                </div>
                <div className="mt-3 space-y-2">
                  {cv.referencias.map(r => (
                    <div key={r.id} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-sm">
                      <div className="flex gap-2">
                        <input value={r.nombre} onChange={ev => patchItem('referencias', r.id, 'nombre', ev.target.value)} placeholder="Nombre" className="min-h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-amber-500" />
                        <input value={r.cargo} onChange={ev => patchItem('referencias', r.id, 'cargo', ev.target.value)} placeholder="Cargo" className="min-h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-amber-500" />
                        <button type="button" onClick={() => removeItem('referencias', r.id)} aria-label="Quitar" className="text-rose-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <input value={r.contacto} onChange={ev => patchItem('referencias', r.id, 'contacto', ev.target.value)} placeholder="Contacto (teléfono/correo)" className="mt-2 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={descargar} disabled={!tieneContenido} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white transition hover:bg-[#0d2d6d] disabled:cursor-not-allowed disabled:opacity-50">
                <Download className="h-4 w-4" /> Descargar PDF (ATS)
              </button>
              <button type="button" onClick={guardar} disabled={!tieneContenido} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition hover:border-teal-400 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-50">
                <Save className="h-4 w-4" /> {academiaUser ? (saveState === 'saving' ? 'Guardando...' : 'Guardar en mi cuenta') : 'Guardar (requiere cuenta)'}
              </button>
              <Link to="/app/perfil" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition hover:border-teal-400 hover:text-teal-800">
                <FileText className="h-4 w-4" /> Mis datos en mi perfil profesional
              </Link>
            </div>
            {saveMsg && (
              <p className={`mt-3 rounded-lg border p-3 text-sm leading-6 ${saveState === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-teal-200 bg-teal-50 text-teal-900'}`} role="status">
                {saveMsg}
              </p>
            )}
            <p className="mt-3 text-xs leading-5 text-slate-500">
              El PDF se genera con texto seleccionable y estructura simple: sin foto, sin tablas, sin columnas. Es el formato que los sistemas ATS leen en 2026.
            </p>
          </div>
        </>
      )}

      {/* ── Tab: Análisis y puntaje ── */}
      {tab === 'analize' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Cargo objetivo para el análisis</p>
            <select
              value={cargoObjetivo}
              onChange={e => { setCargoObjetivo(e.target.value); setTab('analize'); }}
              className="mt-2 min-h-11 w-full max-w-xl rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="">Sin cargo específico (keywords del sector)</option>
              {cargosEmpleo.map(c => <option key={c.slug} value={c.slug}>{c.cargo}</option>)}
            </select>
            <p className="mt-2 text-xs text-slate-500">El análisis compara tu CV contra lo que piden los ATS para el cargo.</p>
          </div>

          {!tieneContenido ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-amber-500" />
              <p className="mt-3 text-sm font-bold text-[#071a4a]">Aún no hay contenido para analizar</p>
              <p className="mt-1 text-sm text-slate-500">Completa el formulario en la pestaña "Creador de hoja de vida" y el puntaje aparece aquí en vivo.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <ScoreGauge score={analysis?.score || 0} />
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{analysis?.mensajeNivel}</p>
              <ul className="mt-4 space-y-2">
                {analysis?.hallazgos.map((f, i) => <FindingRow key={i} f={f} />)}
              </ul>
            </div>
          )}

          {adaptacion && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-[#071a4a]">Adaptar a: {adaptacion.cargo.cargo}</p>
                <CopyButton text={adaptacion.logros.join('\n')} label="Copiar logros" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {adaptacion.palabras.map(p => <span key={p} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900">{p}</span>)}
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Resumen sugerido</p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-sm leading-6 text-slate-700">{adaptacion.resumenSugerido}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Logros sugeridos (Acción + Impacto)</p>
                  <ul className="mt-2 space-y-1.5">
                    {adaptacion.logros.map(l => <li key={l} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />{l}</li>)}
                  </ul>
                </div>
              </div>
              <button type="button" onClick={aplicarSugerencia} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-600 px-4 text-sm font-bold text-white transition hover:bg-amber-700">
                <RefreshCw className="h-4 w-4" /> Aplicar resumen + habilidades al formulario
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Analizar CV actual ── */}
      {tab === 'paste' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Pega tu hoja de vida actual</p>
            <p className="mt-1 text-sm text-slate-600">Copia el texto de tu CV (Word, PDF o portales). Obtendrás un puntaje ATS con recomendaciones en segundos. Nada sale de tu navegador.</p>
            <textarea
              value={textoPegado}
              onChange={e => setTextoPegado(e.target.value)}
              rows={12}
              placeholder={'NOMBRE\nQuímica farmacéutica\nExperiencia:\n- Analista de control de calidad en Laboratorio X\n  - Reduje desviaciones 30%\nFormación:\n- Química farmacéutica, Universidad Y\nHabilidades:\n- BPM, Excel avanzado, Power BI'}
              className="mt-4 w-full rounded-lg border border-slate-300 p-4 text-sm leading-6 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" onClick={analizarPegado} disabled={!textoPegado.trim()} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white transition hover:bg-[#0d2d6d] disabled:cursor-not-allowed disabled:opacity-50">
                <Sparkles className="h-4 w-4" /> Analizar mi hoja de vida
              </button>
              <p className="text-xs text-slate-500">Análisis local: tus datos no salen de este navegador.</p>
            </div>
          </div>

          {textResult && (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <ScoreGauge score={textResult.score} />
              <p className="mt-3 text-sm font-semibold text-slate-700">{textResult.recomendacion}</p>
              {textResult.keywords?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {textResult.keywords.map(k => <span key={k} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">{k}</span>)}
                </div>
              )}
              <ul className="mt-4 space-y-2">
                {textResult.hallazgos.map((f, i) => <FindingRow key={i} f={f} />)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Guía 2026 ── */}
      {tab === 'guide' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-amber-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">La regla de oro del 2026</p>
            <h3 className="mt-1 text-xl font-bold text-[#071a4a]">Tu hoja de vida la revisa una máquina antes que una persona</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              La mayoría de las vacantes en Colombia se gestionan con ATS y preselección con IA. La primera lectura es automática:
              estructura, palabras clave del anuncio, logros medibles y formato PDF legible. El diseño bonito pasa a segundo plano.
            </p>
            <ul className="mt-4 space-y-2">
              {guiaCVContenido.ats2026.map(a => (
                <li key={a.titulo} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span><strong className="text-[#071a4a]">{a.titulo}.</strong> {a.detalle}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-teal-200 bg-white p-5">
              <p className="text-sm font-bold text-teal-800">Lo que sí debe llevar</p>
              <ul className="mt-3 space-y-2.5">
                {guiaCVContenido.debeIr.map(i => (
                  <li key={i.titulo} className="flex items-start gap-2 text-sm leading-5 text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span><strong className="text-[#071a4a]">{i.titulo}.</strong> {i.detalle}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-200 bg-white p-5">
              <p className="text-sm font-bold uppercase text-rose-700">Lo que NO debe llevar</p>
              <ul className="mt-3 space-y-2.5">
                {guiaCVContenido.noDebe.map(i => (
                  <li key={i.titulo} className="flex items-start gap-2 text-sm leading-5 text-slate-700">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    <span><strong className="text-[#071a4a]">{i.titulo}.</strong> {i.detalle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Antes de enviar</p>
            <ol className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                'Formato PDF con texto seleccionable (el de esta plataforma lo es).',
                'Nombre de archivo profesional: ApellidoNombre_Cargo.pdf',
                'Lee el anuncio y ajusta tu resumen con 3 keywords exactas del puesto.',
                'Sin foto, sin edad, sin estado civil, sin identificación.',
                '1 a 2 páginas, cronológico inverso, fechas consistentes.',
                'Revisa dos veces: los filtros de IA penalizan errores ortográficos.',
              ].map((t, i) => <li key={i} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">{i + 1}</span>{t}</li>)}
            </ol>
          </div>
        </div>
      )}

      <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

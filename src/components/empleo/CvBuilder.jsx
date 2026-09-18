/**
 * ============================================================
 *  CvBuilder.jsx — Creador de hoja de vida (workspace tipo app)
 *
 *  UX de aplicación: navegación por secciones con progreso,
 *  editor de la sección activa y vista previa en vivo del CV.
 *  Motor ATS local (analyzeCv), autosave en la cuenta, descarga
 *  PDF y adaptación a cargo objetivo — toda la lógica real se
 *  conserva; solo se reconstruye la experiencia.
 * ============================================================
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, Check, ClipboardCopy, Download, FileText, Info, Lock, Plus,
  RefreshCw, Save, Sparkles, Trash2, X, User, Briefcase, GraduationCap, Award,
  Languages, ScanSearch, ChevronUp, ChevronDown, Eye, Pencil, Upload, Copy,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfessional } from '../../context/ProfessionalContext';
import AcademiaLoginModal from '../AcademiaLoginModal';
import { apiUrl } from '../../config/api';
import { cargosEmpleo } from '../../data/empleo/cargos';
import { analyzeCv, cargarPorSlug, guiaCVContenido } from '../../lib/cv/analyzer';
import { downloadCvPdf } from '../../lib/cv/pdf';
import { leerPdf } from '../../lib/cv/pdfText';
import { aHojaDelCreador, leerHojaDeVida } from '../../lib/cv/lector';
import { diagnosticar } from '../../lib/cv/diagnostico';
import { trackEvent } from '../../utils/analytics';

const EMPTY_CV = {
  nombre: '', titulo: '', email: '', telefono: '', ciudad: '', linkedin: '',
  resumen: '', experiencia: [], educacion: [], habilidades: [], certificaciones: [], idiomas: [], referencias: [],
};

let uidCounter = 0;
const uid = () => `x-${Date.now()}-${++uidCounter}`;

/** Borrador en el navegador: no se pierde lo escrito aunque no haya cuenta. */
const BORRADOR_LOCAL = 'edvanta_cv_borrador';

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

const SECTIONS = [
  { id: 'perfil', label: 'Perfil', icon: User, required: true },
  { id: 'experiencia', label: 'Experiencia', icon: Briefcase, required: true },
  { id: 'formacion', label: 'Formación', icon: GraduationCap, required: true },
  { id: 'habilidades', label: 'Habilidades', icon: Sparkles, required: true },
  { id: 'certificaciones', label: 'Certificaciones', icon: Award, required: false },
  { id: 'idiomas', label: 'Idiomas', icon: Languages, required: false },
  { id: 'revision', label: 'Revisión ATS', icon: ScanSearch, required: false },
];

const wordCount = (s) => String(s || '').split(/\s+/).filter(Boolean).length;

// Versión texto plano para pegar en portales (LinkedIn, Elempleo, Magnet…)
function textoPlano(cv) {
  const L = [];
  if (cv.nombre) L.push(cv.nombre);
  if (cv.titulo) L.push(cv.titulo);
  const contacto = [cv.email, cv.telefono, cv.ciudad, cv.linkedin].filter(Boolean);
  if (contacto.length) L.push(contacto.join('  |  '));
  if (cv.resumen) { L.push(''); L.push('PERFIL PROFESIONAL'); L.push(cv.resumen); }
  if (cv.experiencia.some(e => e.cargo)) {
    L.push(''); L.push('EXPERIENCIA');
    cv.experiencia.filter(e => e.cargo).forEach(e => {
      L.push(`${e.cargo}${e.empresa ? ` · ${e.empresa}` : ''}${(e.inicio || e.fin) ? ` (${[e.inicio, e.fin || 'Actual'].filter(Boolean).join(' — ')})` : ''}`);
      String(e.logros || '').split('\n').filter(Boolean).forEach(l => L.push(`• ${l.trim()}`));
    });
  }
  if (cv.educacion.some(e => e.titulo)) {
    L.push(''); L.push('FORMACIÓN');
    cv.educacion.filter(e => e.titulo).forEach(e => L.push(`${e.titulo}${e.institucion ? ` · ${e.institucion}` : ''}${e.anio ? ` (${e.anio})` : ''}`));
  }
  if (cv.habilidades.length) { L.push(''); L.push('HABILIDADES'); L.push(cv.habilidades.join('  ·  ')); }
  if (cv.certificaciones.some(c => c.nombre)) {
    L.push(''); L.push('CERTIFICACIONES');
    cv.certificaciones.filter(c => c.nombre).forEach(c => L.push(`${c.nombre}${c.institucion ? ` · ${c.institucion}` : ''}${c.anio ? ` (${c.anio})` : ''}`));
  }
  if (cv.idiomas.some(i => i.idioma)) {
    L.push(''); L.push('IDIOMAS');
    L.push(cv.idiomas.filter(i => i.idioma).map(i => `${i.idioma}${i.nivel ? ` (${i.nivel})` : ''}`).join('  ·  '));
  }
  return L.join('\n');
}

function sectionProgress(cv) {
  const perfil = [cv.nombre, cv.email, cv.resumen, cv.titulo].filter(v => String(v || '').trim()).length / 4;
  const experiencia = cv.experiencia.length ? (cv.experiencia.some(e => e.cargo && String(e.logros || '').trim()) ? 1 : 0.5) : 0;
  const formacion = cv.educacion.length ? 1 : 0;
  const habilidades = Math.min(1, cv.habilidades.length / 4);
  const certificaciones = cv.certificaciones.length ? 1 : 0;
  const idiomas = cv.idiomas.length ? 1 : 0;
  return { perfil, experiencia, formacion, habilidades, certificaciones, idiomas };
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
          <circle cx="32" cy="32" r={R} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-edvanta-deep">{pct}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-edvanta-deep">Puntaje ATS: {pct}/100</p>
        <p className="mt-0.5 text-xs font-semibold" style={{ color }}>{label}</p>
        <p className="mt-0.5 max-w-56 text-[11px] leading-4 text-slate-500">Estimado local, orientativo y privado. No se envía tu información a terceros.</p>
      </div>
    </div>
  );
}

const FINDING_STYLE = {
  ok: { icon: <Check className="h-4 w-4 shrink-0 text-teal-600" />, box: 'border-teal-200 bg-teal-50/60' },
  warn: { icon: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />, box: 'border-amber-200 bg-amber-50/60' },
  error: { icon: <X className="h-4 w-4 shrink-0 text-rose-600" />, box: 'border-rose-200 bg-rose-50/60' },
  info: { icon: <Info className="h-4 w-4 shrink-0 text-sky-600" />, box: 'border-sky-200 bg-sky-50/50' },
};

function FindingRow({ f }) {
  const s = FINDING_STYLE[f.tipo] || FINDING_STYLE.info;
  return (
    <li className={`rounded-lg border p-3 ${s.box}`}>
      <div className="flex items-start gap-2">
        {s.icon}
        <div>
          <p className="text-sm font-bold text-edvanta-deep">{f.titulo}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-600">{f.detalle}</p>
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
      onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* noop */ } }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-edvanta-border bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-edvanta-blue/40 hover:text-edvanta-blue"
    >
      {copied ? <span className="text-teal-700">Copiado</span> : <><ClipboardCopy className="h-3.5 w-3.5" />{label}</>}
    </button>
  );
}

function SkillInput({ onAdd }) {
  const [value, setValue] = useState('');
  return (
    <form className="mt-3 flex gap-2" onSubmit={e => { e.preventDefault(); onAdd(value); setValue(''); }}>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Agrega una habilidad y presiona Enter (ej. Power BI, CAPA, Excel avanzado)" className="min-h-10 flex-1 rounded-lg border border-edvanta-border px-3.5 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/20" />
      <button type="submit" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-edvanta-deep px-4 text-sm font-bold text-white transition hover:bg-edvanta-blue"><Plus className="h-4 w-4" /> Agregar</button>
    </form>
  );
}

const inputCls = 'min-h-10 w-full rounded-lg border border-edvanta-border bg-white px-3 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15';

// ── Vista previa del CV: el mismo diseño oficial que sale en el PDF ──
function EncabezadoPrevio({ children }) {
  return (
    <p className="mb-1.5 mt-4 flex items-center gap-2">
      <span className="h-2 w-2 shrink-0 rounded-[2px] bg-[#25A7B0]" aria-hidden="true" />
      <span className="text-[9.5px] font-extrabold uppercase tracking-[.14em] text-[#082E86]">{children}</span>
      <span className="h-px flex-1 bg-[#E3E9F2]" aria-hidden="true" />
    </p>
  );
}

function CvPreview({ cv }) {
  const vacio = !cv.nombre && !cv.resumen && !cv.experiencia.length && !cv.habilidades.length;
  const contacto = [cv.ciudad, cv.telefono, cv.email, String(cv.linkedin || '').replace(/^https?:\/\/(www\.)?/i, '')].filter(Boolean);
  const experiencia = cv.experiencia.filter((e) => e.cargo);
  const educacion = cv.educacion.filter((e) => e.titulo || e.institucion);
  const certificaciones = cv.certificaciones.filter((c) => c.nombre);
  const idiomas = cv.idiomas.filter((i) => i.idioma);
  return (
    <div className="overflow-hidden rounded-2xl border border-edvanta-border bg-edvanta-bg p-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-edvanta-muted">
        <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Vista previa · Diseño oficial Edvanta
      </p>
      <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #8179C9 0%, #65A7C1 50%, #28A8AF 100%)' }} aria-hidden="true" />
        {vacio ? (
          <p className="px-6 py-20 text-center text-sm text-edvanta-muted">Tu hoja de vida aparecerá aquí a medida que la completes.</p>
        ) : (
          <div className="px-6 pb-6 pt-5 text-[10.5px] leading-[1.55] text-[#2B3650]">
            <h3 className="text-[19px] font-extrabold leading-tight text-[#17223B]">{cv.nombre || 'Tu nombre'}</h3>
            {cv.titulo && <p className="mt-0.5 text-[11.5px] font-bold text-[#082E86]">{cv.titulo}</p>}
            {contacto.length > 0 && <p className="mt-1 text-[9.5px] text-[#65718A]">{contacto.join('  ·  ')}</p>}
            <div className="relative mt-3 h-px bg-[#E3E9F2]" aria-hidden="true">
              <span className="absolute left-0 top-[-0.5px] h-[2px] w-10 bg-[#25A7B0]" />
            </div>

            {cv.resumen && (<><EncabezadoPrevio>Perfil profesional</EncabezadoPrevio><p>{cv.resumen}</p></>)}

            {experiencia.length > 0 && (
              <>
                <EncabezadoPrevio>Experiencia</EncabezadoPrevio>
                {experiencia.map((e) => (
                  <div key={e.id} className="mb-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[11px] font-bold text-[#17223B]">{e.cargo}</p>
                      {(e.inicio || e.fin) && <p className="shrink-0 text-[9.5px] text-[#65718A]">{[e.inicio, e.fin || 'Actual'].filter(Boolean).join(' – ')}</p>}
                    </div>
                    {e.empresa && <p className="text-[10px] text-[#082E86]">{e.empresa}</p>}
                    {String(e.logros || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l, i) => (
                      <p key={i} className="relative mt-0.5 pl-3">
                        <span className="absolute left-0.5 top-[6px] h-[5px] w-[5px] rounded-full bg-[#25A7B0]" aria-hidden="true" />
                        {l.replace(/^[•*-]\s*/, '')}
                      </p>
                    ))}
                  </div>
                ))}
              </>
            )}

            {educacion.length > 0 && (
              <>
                <EncabezadoPrevio>Formación</EncabezadoPrevio>
                {educacion.map((e) => (
                  <div key={e.id} className="mb-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-bold text-[#17223B]">{e.titulo || e.institucion}</p>
                      {e.anio && <p className="shrink-0 text-[9.5px] text-[#65718A]">{e.anio}</p>}
                    </div>
                    {e.titulo && e.institucion && <p className="text-[10px] text-[#65718A]">{e.institucion}</p>}
                  </div>
                ))}
              </>
            )}

            {cv.habilidades.length > 0 && (
              <>
                <EncabezadoPrevio>Habilidades</EncabezadoPrevio>
                <p className="font-bold text-[#17223B]">
                  {cv.habilidades.map((h, i) => (
                    <span key={h}>
                      {h}
                      {i < cv.habilidades.length - 1 && <span className="px-1.5 text-[#25A7B0]">·</span>}
                    </span>
                  ))}
                </p>
              </>
            )}

            {certificaciones.length > 0 && (
              <>
                <EncabezadoPrevio>Certificaciones y cursos</EncabezadoPrevio>
                {certificaciones.map((c) => (
                  <p key={c.id} className="relative pl-3">
                    <span className="absolute left-0.5 top-[6px] h-[5px] w-[5px] rounded-full bg-[#25A7B0]" aria-hidden="true" />
                    {[c.nombre, [c.institucion, c.anio].filter(Boolean).join(' · ')].filter(Boolean).join(' · ')}
                  </p>
                ))}
              </>
            )}

            {idiomas.length > 0 && (
              <>
                <EncabezadoPrevio>Idiomas</EncabezadoPrevio>
                <p>{idiomas.map((i) => [i.idioma, i.nivel].filter(Boolean).join(' — ')).join('   ·   ')}</p>
              </>
            )}

            <EncabezadoPrevio>Referencias</EncabezadoPrevio>
            <p className="italic text-[#65718A]">Disponibles a solicitud.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CvBuilder() {
  const { academiaApi, academiaUser, academiaToken, profile: accountProfile } = useAuth();
  const { professionalProfile, loading: professionalLoading } = useProfessional();
  const [cv, setCv] = useState(EMPTY_CV);
  const [cargoObjetivo, setCargoObjetivo] = useState('');
  const [saveState, setSaveState] = useState(''); // idle|saving|saved|error
  const [saveMsg, setSaveMsg] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [mode, setMode] = useState('builder'); // builder | importar | guia
  const [section, setSection] = useState('perfil');
  const [showPreview, setShowPreview] = useState(false); // móvil
  const [textoPegado, setTextoPegado] = useState('');
  const [lectura, setLectura] = useState(null); // { texto, meta, archivo }
  const [confirmarReemplazo, setConfirmarReemplazo] = useState(false);
  const [aviso, setAviso] = useState('');
  const [cargoAnalisis, setCargoAnalisis] = useState('');
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const dirty = useRef(false);
  const autosaveTimer = useRef(null);
  const exportRef = useRef(null);

  // ── Borrador de este navegador (funciona sin cuenta) ──
  // Se carga una sola vez al abrir; si la persona tiene cuenta, el CV
  // guardado en el servidor llega después y manda sobre el borrador.
  useEffect(() => {
    try {
      const crudo = localStorage.getItem(BORRADOR_LOCAL);
      if (!crudo) return;
      const guardado = JSON.parse(crudo);
      if (guardado?.cv) setCv(addIds(guardado.cv));
      if (guardado?.cargo) setCargoObjetivo(guardado.cargo);
    } catch { /* borrador ilegible: se ignora */ }
  }, []);

  // ── #analizar en la dirección abre el analizador (enlace «Analizar la que ya tengo») ──
  useEffect(() => {
    const revisar = () => {
      if (window.location.hash === '#analizar') setMode('importar');
      else if (window.location.hash === '#creador') setMode('builder');
    };
    revisar();
    window.addEventListener('hashchange', revisar);
    return () => window.removeEventListener('hashchange', revisar);
  }, []);

  // ── Cargar CV guardado ──
  useEffect(() => {
    if (!academiaUser || !academiaToken) return undefined;
    let cancelled = false;
    setLoadingSaved(true);
    fetch(apiUrl('/api/cv'), { headers: { Authorization: `Bearer ${academiaToken}` } })
      .then(r => r.ok ? r.json() : { cv: null })
      .then(data => { if (!cancelled && data.cv) { setCv(addIds(data.cv)); dirty.current = false; } })
      .catch(() => { /* sin CV guardado */ })
      .finally(() => { if (!cancelled) setLoadingSaved(false); });
    return () => { cancelled = true; };
  }, [academiaUser, academiaToken]);

  // ── Precargar desde el perfil profesional (Supabase) ──
  useEffect(() => {
    if (academiaUser) return undefined;
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

  // ── Mutadores (marcan "dirty" para el autosave) ──
  const touch = () => { dirty.current = true; };
  const setField = (key, value) => { touch(); setCv(prev => ({ ...prev, [key]: value })); };
  const addItem = (key) => {
    touch();
    const templates = {
      experiencia: { id: uid(), cargo: '', empresa: '', inicio: '', fin: '', logros: '' },
      educacion: { id: uid(), titulo: '', institucion: '', anio: '' },
      certificaciones: { id: uid(), nombre: '', institucion: '', anio: '' },
      idiomas: { id: uid(), idioma: '', nivel: '' },
    };
    setCv(prev => ({ ...prev, [key]: [...prev[key], templates[key]] }));
  };
  const removeItem = (key, id) => { touch(); setCv(prev => ({ ...prev, [key]: prev[key].filter(x => x.id !== id) })); };
  const patchItem = (key, id, field, value) => { touch(); setCv(prev => ({ ...prev, [key]: prev[key].map(x => (x.id === id ? { ...x, [field]: value } : x)) })); };
  const moveItem = (key, id, dir) => {
    touch();
    setCv(prev => {
      const arr = [...prev[key]];
      const i = arr.findIndex(x => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...prev, [key]: arr };
    });
  };
  const addSkill = (skill) => {
    const s = String(skill || '').trim();
    if (!s || cv.habilidades.some(h => h.toLowerCase() === s.toLowerCase())) return;
    touch();
    setCv(prev => ({ ...prev, habilidades: [...prev.habilidades, s] }));
  };
  const removeSkill = (i) => { touch(); setCv(prev => ({ ...prev, habilidades: prev.habilidades.filter((_, j) => j !== i) })); };

  const analysis = useMemo(() => {
    if (!cv.nombre && !cv.resumen && !cv.experiencia.length && !cv.habilidades.length) return null;
    return analyzeCv(cv, cargoObjetivo);
  }, [cv, cargoObjetivo]);

  const adaptacion = useMemo(() => {
    if (!cargoObjetivo) return null;
    const cargo = cargarPorSlug(cargoObjetivo);
    if (!cargo) return null;
    return { cargo, resumenSugerido: cargo.resumenSugerido || '', logros: cargo.logros || [], palabras: cargo.palabras || [], secciones: cargo.secciones || [] };
  }, [cargoObjetivo]);

  const progress = useMemo(() => sectionProgress(cv), [cv]);
  const overall = useMemo(() => {
    const req = ['perfil', 'experiencia', 'formacion', 'habilidades'];
    return Math.round((req.reduce((a, k) => a + progress[k], 0) / req.length) * 100);
  }, [progress]);

  const tieneContenido = Boolean(cv.nombre || cv.resumen || cv.experiencia.length || cv.habilidades.length);

  // ── Autosave (solo con cuenta y tras editar) ──
  useEffect(() => {
    if (!academiaUser || !academiaToken || loadingSaved) return undefined;
    if (!dirty.current || !tieneContenido) return undefined;
    setSaveState('saving');
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      try {
        const data = await academiaApi('/api/cv', { method: 'PUT', body: JSON.stringify(stripDraft(cv)) });
        setSaveState(data.ok ? 'saved' : 'error');
        if (data.ok) dirty.current = false;
      } catch { setSaveState('error'); }
    }, 1600);
    return () => clearTimeout(autosaveTimer.current);
  }, [cv, academiaUser, academiaToken, loadingSaved]);

  // Guarda el borrador en este navegador mientras se escribe.
  useEffect(() => {
    if (!tieneContenido) return undefined;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(BORRADOR_LOCAL, JSON.stringify({ cv: stripDraft(cv), cargo: cargoObjetivo }));
      } catch { /* sin espacio o almacenamiento bloqueado */ }
    }, 800);
    return () => clearTimeout(id);
  }, [cv, cargoObjetivo, tieneContenido]);

  const borrarBorrador = () => {
    try { localStorage.removeItem(BORRADOR_LOCAL); } catch { /* nada que borrar */ }
    setCv(EMPTY_CV);
    setCargoObjetivo('');
    dirty.current = false;
    setSaveMsg('Borramos el borrador de este navegador y empezamos de cero.');
    setSaveState('saved');
  };

  const guardar = async () => {
    trackEvent('cv_saved_attempt');
    if (!academiaUser) { setLoginOpen(true); return; }
    setSaveState('saving'); setSaveMsg('');
    try {
      const data = await academiaApi('/api/cv', { method: 'PUT', body: JSON.stringify(stripDraft(cv)) });
      if (data.ok) { setSaveState('saved'); dirty.current = false; setSaveMsg('Hoja de vida guardada en tu cuenta.'); }
      else { setSaveState('error'); setSaveMsg(data.error || 'No fue posible guardar.'); }
    } catch (e) { setSaveState('error'); setSaveMsg(e.message || 'Sin conexión: no se pudo guardar ahora.'); }
  };

  const descargar = async (style = 'edvanta') => {
    trackEvent('cv_download_pdf', { style });
    const label = adaptacion ? adaptacion.cargo.cargo : '';
    setExportOpen(false);
    try { await downloadCvPdf(stripDraft(cv), label, style); }
    catch { setSaveMsg('No fue posible generar el PDF en este navegador.'); setSaveState('error'); }
  };

  const copiarTexto = async () => {
    try {
      await navigator.clipboard.writeText(textoPlano(stripDraft(cv)));
      setSaveMsg('Texto plano copiado: pégalo en el campo "Resumen" de LinkedIn o del portal de vacantes.');
      setSaveState('saved');
    } catch { setSaveMsg('No fue posible copiar en este navegador.'); setSaveState('error'); }
  };

  // Cierra el menú de exportación al hacer clic fuera
  useEffect(() => {
    if (!exportOpen) return undefined;
    const onDoc = (e) => { if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [exportOpen]);

  // ── Analizador: lee el PDF en el navegador y arma el diagnóstico ──
  const analizarArchivo = async (file) => {
    setPdfError('');
    setConfirmarReemplazo(false);
    setPdfLoading(true);
    trackEvent('cv_pdf_uploaded');
    try {
      const { texto, meta } = await leerPdf(file);
      setCargoAnalisis('');
      setLectura({ texto, meta, archivo: { nombre: file.name, tamano: file.size } });
      trackEvent('cv_pdf_analizado', { paginas: meta.paginas, columnas: meta.columnas, escaneado: meta.escaneado });
    } catch (err) {
      setLectura(null);
      setPdfError(err?.codigo ? err.message : 'No pudimos leer este PDF. Prueba exportándolo de nuevo desde Word o Google Docs, o pega el texto abajo.');
      trackEvent('cv_pdf_error', { codigo: err?.codigo || 'desconocido' });
    } finally {
      setPdfLoading(false);
    }
  };

  const aplicarSugerencia = () => {
    if (!adaptacion) return;
    trackEvent('cv_apply_adaptation', { cargo: cargoObjetivo });
    touch();
    setCv(prev => ({
      ...prev,
      resumen: adaptacion.resumenSugerido,
      titulo: adaptacion.cargo.cargo,
      habilidades: [...new Set([...prev.habilidades, ...adaptacion.cargo.habilidades.filter(Boolean)])],
    }));
    setSaveMsg(`Resumen y habilidades ajustados al cargo: ${adaptacion.cargo.cargo}. Revísalo y descarga tu PDF.`);
  };

  const analizarPegado = () => {
    if (textoPegado.trim().length < 40) return;
    trackEvent('cv_text_analyzed');
    setPdfError('');
    setConfirmarReemplazo(false);
    setCargoAnalisis('');
    setLectura({ texto: textoPegado, meta: null, archivo: null });
  };

  const hojaLeida = useMemo(() => (lectura ? leerHojaDeVida(lectura.texto) : null), [lectura]);
  const diagnostico = useMemo(
    () => (hojaLeida ? diagnosticar(hojaLeida, lectura?.meta || null, cargoAnalisis) : null),
    [hojaLeida, lectura, cargoAnalisis],
  );

  const reiniciarAnalisis = () => {
    setLectura(null);
    setPdfError('');
    setConfirmarReemplazo(false);
  };

  // Pasa lo leído al creador: la persona corrige ahí y descarga con el diseño oficial.
  const cargarEnCreador = () => {
    if (!hojaLeida) return;
    touch();
    setCv(addIds({ ...EMPTY_CV, ...aHojaDelCreador(hojaLeida) }));
    // El cargo del análisis pasa a ser el cargo objetivo del creador.
    if (diagnostico?.cargo) setCargoObjetivo(diagnostico.cargo.slug);
    setConfirmarReemplazo(false);
    setMode('builder');
    setSection('perfil');
    setAviso('Pasamos tu hoja de vida al creador. Revisa cada sección: lo que no pudimos leer quedó vacío para que lo completes. Cuando esté lista, descárgala con el diseño oficial.');
    trackEvent('cv_importado_al_creador');
  };

  const pasarAlCreador = () => {
    if (tieneContenido) setConfirmarReemplazo(true);
    else cargarEnCreador();
  };

  const saveLabel = { saving: 'Guardando…', saved: 'Guardado', error: 'Error al guardar' };

  // ── Barra superior (siempre visible) ──
  const topBar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edvanta-border bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue"><FileText className="h-5 w-5" /></span>
        <div>
          <p className="text-sm font-black text-edvanta-deep">Creador de hoja de vida</p>
          <p className="text-[11px] font-semibold text-slate-400">
            {academiaUser && saveState ? (saveLabel[saveState] || '') : 'Se guarda en este navegador'} {overall > 0 && <span className="text-edvanta-blue">· {overall}%</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setShowPreview(v => !v)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-edvanta-border bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-edvanta-blue/40 hover:text-edvanta-blue lg:hidden">
          {showPreview ? <><Pencil className="h-4 w-4" /> Editar</> : <><Eye className="h-4 w-4" /> Vista previa</>}
        </button>
        <button type="button" onClick={borrarBorrador} disabled={!tieneContenido} title="Borra lo escrito en este navegador y empieza de cero" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-edvanta-border bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-rose-300 hover:text-rose-700 disabled:opacity-50">
          <Trash2 className="h-4 w-4" /> <span className="hidden md:inline">Empezar de cero</span>
        </button>
        <button type="button" onClick={guardar} disabled={!tieneContenido} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-edvanta-border bg-white px-3.5 text-sm font-bold text-slate-800 transition hover:border-teal-400 hover:text-teal-800 disabled:opacity-50">
          <Save className="h-4 w-4" /> <span className="hidden sm:inline">Guardar</span>
        </button>
        <button type="button" onClick={copiarTexto} disabled={!tieneContenido} title="Copia tu HV en texto plano para portales" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-edvanta-border bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-edvanta-blue/40 hover:text-edvanta-blue disabled:opacity-50">
          <Copy className="h-4 w-4" /> <span className="hidden md:inline">Copiar texto</span>
        </button>
        <div className="relative" ref={exportRef}>
          <button type="button" onClick={() => setExportOpen(v => !v)} aria-expanded={exportOpen} aria-haspopup="menu" disabled={!tieneContenido} className="btn-edvanta inline-flex min-h-10 items-center gap-1.5 px-4 text-sm font-bold disabled:opacity-50">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Descargar</span> <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {exportOpen && (
            <div role="menu" className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-edvanta-border bg-white p-2 shadow-xl">
              <button type="button" role="menuitem" onClick={() => descargar('edvanta')} className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-edvanta-light/70">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-edvanta-light text-edvanta-blue"><FileText className="h-4 w-4" /></span>
                <span>
                  <span className="block text-sm font-black text-edvanta-deep">Diseño oficial Edvanta</span>
                  <span className="mt-0.5 block text-xs leading-4 text-slate-500">Moderno y limpio, con la identidad Edvanta. Una sola columna con texto real: los filtros ATS la leen en orden.</span>
                </span>
              </button>
              <button type="button" onClick={() => descargar('ats')} className="mt-1 flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-slate-50">
                <span className="mt-0 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><FileText className="h-4 w-4" /></span>
                <span>
                  <span className="block text-sm font-bold text-slate-700">Formato ATS simple</span>
                  <span className="mt-0.5 block text-xs leading-4 text-slate-500">Blanco y negro, sin diseño, para portales con filtros muy estrictos.</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Modo */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Modo de la herramienta">
        {[
          { id: 'builder', label: 'Construir mi hoja de vida', icon: FileText },
          { id: 'importar', label: 'Analizar mi hoja de vida (PDF)', icon: ScanSearch },
          { id: 'guia', label: 'Guía 2026', icon: Info },
        ].map(m => (
          <button key={m.id} type="button" role="tab" aria-selected={mode === m.id} onClick={() => setMode(m.id)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-4 text-sm font-bold transition ${mode === m.id ? 'border-edvanta-blue bg-edvanta-blue text-white' : 'border-edvanta-border bg-white text-slate-700 hover:border-edvanta-blue/40'}`}>
            <m.icon className="h-4 w-4" /> {m.label}
          </button>
        ))}
      </div>

      {/* ══ MODO BUILDER ══ */}
      {mode === 'builder' && (
        <div className="space-y-4">
          {topBar}
          {aviso && (
            <div className="flex items-start gap-3 rounded-xl border border-edvanta-mint bg-edvanta-mint/40 p-4" role="status">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
              <p className="flex-1 text-sm leading-6 text-edvanta-deep">{aviso}</p>
              <button type="button" onClick={() => setAviso('')} aria-label="Cerrar aviso" className="rounded-lg p-1 text-edvanta-muted hover:bg-white hover:text-edvanta-deep">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
          {!academiaUser && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edvanta-blue/20 bg-edvanta-light/60 p-4">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-blue" />
                <div>
                  <p className="text-sm font-bold text-edvanta-deep">Crea tu cuenta para guardar y autoguardar tu hoja de vida</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-600">Sin cuenta guardamos un borrador en este navegador. Con tu cuenta gratuita, tu hoja de vida se autoguarda y la recuperas desde cualquier dispositivo. La descarga en PDF funciona siempre.</p>
                </div>
              </div>
              <button type="button" onClick={() => setLoginOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-edvanta-deep px-4 text-sm font-bold text-white transition hover:bg-edvanta-blue">
                <Lock className="h-4 w-4" /> Crear cuenta
              </button>
            </div>
          )}
          {loadingSaved && <p className="text-sm text-slate-500">Cargando tu hoja de vida guardada…</p>}

          <div className="lg:grid lg:grid-cols-[212px_minmax(0,1fr)_minmax(0,360px)] lg:items-start lg:gap-5">
            {/* Navegación de secciones */}
            <nav aria-label="Secciones de la hoja de vida" className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:mb-0 lg:flex-col lg:overflow-visible">
              {SECTIONS.map(s => {
                const p = s.id === 'revision' ? (analysis ? analysis.score / 100 : 0) : (progress[s.id] ?? 0);
                const active = section === s.id;
                return (
                  <button key={s.id} type="button" onClick={() => { setSection(s.id); setShowPreview(false); }}
                    className={`group flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition lg:shrink lg:w-full ${active ? 'border-edvanta-blue bg-edvanta-light/70' : 'border-edvanta-border bg-white hover:border-edvanta-blue/40'}`}>
                    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-edvanta-blue text-white' : 'bg-slate-50 text-slate-400'}`}><s.icon className="h-4 w-4" /></span>
                    <span className="min-w-0">
                      <span className={`block whitespace-nowrap text-[13px] font-bold ${active ? 'text-edvanta-deep' : 'text-slate-600'}`}>{s.label}</span>
                      <span className="mt-1 hidden h-1 w-full overflow-hidden rounded-full bg-slate-100 lg:block">
                        <span className="block h-1 rounded-full bg-edvanta-blue transition-all" style={{ width: `${Math.round(p * 100)}%` }} />
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Editor de la sección activa */}
            <div className={showPreview ? 'hidden lg:block' : 'block'}>
              <SectionEditor
                section={section} cv={cv} setField={setField} addItem={addItem} removeItem={removeItem}
                patchItem={patchItem} moveItem={moveItem} addSkill={addSkill} removeSkill={removeSkill}
                cargoObjetivo={cargoObjetivo} setCargoObjetivo={setCargoObjetivo} analysis={analysis}
                adaptacion={adaptacion} aplicarSugerencia={aplicarSugerencia} tieneContenido={tieneContenido}
                saveMsg={saveMsg} saveState={saveState}
              />
            </div>

            {/* Vista previa en vivo */}
            <div className={`${showPreview ? 'block' : 'hidden lg:block'} lg:sticky lg:top-20`}>
              <CvPreview cv={cv} />
            </div>
          </div>
        </div>
      )}

      {/* ══ MODO ANALIZAR (PDF o texto) ══ */}
      {mode === 'importar' && (
        <AnalizadorHv
          lectura={lectura} diagnostico={diagnostico} cargo={cargoAnalisis} setCargo={setCargoAnalisis}
          texto={textoPegado} setTexto={setTextoPegado} onArchivo={analizarArchivo} onTexto={analizarPegado}
          cargando={pdfLoading} error={pdfError} onReiniciar={reiniciarAnalisis}
          onPasarAlCreador={pasarAlCreador} confirmar={confirmarReemplazo}
          onConfirmar={cargarEnCreador} onCancelar={() => setConfirmarReemplazo(false)}
        />
      )}

      {/* ══ MODO GUÍA ══ */}
      {mode === 'guia' && <Guia2026 />}

      <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

// Definido fuera de SectionEditor a propósito: si se creara en cada
// render, React desmontaría el formulario en cada pulsación y el campo
// perdería el foco después de cada letra.
function Panel({ title, hint, children, action }) {
  return (
    <div className="rounded-xl border border-edvanta-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-edvanta-deep">{title}</h3>
          {hint && <p className="mt-0.5 text-xs leading-5 text-slate-500">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

// ── Editor por sección ──
function SectionEditor(props) {
  const { section, cv, setField, addItem, removeItem, patchItem, moveItem, addSkill, removeSkill,
    cargoObjetivo, setCargoObjetivo, analysis, adaptacion, aplicarSugerencia, tieneContenido, saveMsg, saveState } = props;

  if (section === 'perfil') {
    return (
      <Panel title="Perfil y contacto" hint="Encabezado que los ATS leen primero. El correo o teléfono son obligatorios.">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { key: 'nombre', label: 'Nombre completo', ph: 'Ej. María Gómez Pérez', req: true },
            { key: 'titulo', label: 'Título / cargo actual', ph: 'Ej. Química farmacéutica' },
            { key: 'email', label: 'Correo', ph: 'tu@correo.com', req: true },
            { key: 'telefono', label: 'Teléfono', ph: '+57 300 000 0000' },
            { key: 'ciudad', label: 'Ciudad', ph: 'Bogotá, Colombia' },
            { key: 'linkedin', label: 'LinkedIn o portafolio', ph: 'https://linkedin.com/in/…' },
          ].map(f => (
            <label key={f.key} className="block">
              <span className="mb-1 block text-sm font-bold text-edvanta-deep">{f.label}{f.req && <span className="text-edvanta-blue"> *</span>}</span>
              <input value={cv[f.key]} onChange={e => setField(f.key, e.target.value)} placeholder={f.ph} className={inputCls + ' min-h-11'} />
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-bold text-edvanta-deep">Resumen profesional (25-90 palabras)</span>
            <textarea value={cv.resumen} onChange={e => setField('resumen', e.target.value)} rows={4} placeholder="Soy [profesión] con X años de experiencia en [área]. Mi logro principal: [resultado medible]. Aporto [qué resuelves] en organizaciones del sector farmacéutico." className="w-full rounded-lg border border-edvanta-border p-3.5 text-sm leading-6 outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15" />
            <p className={`mt-1 text-xs font-semibold ${wordCount(cv.resumen) > 0 && wordCount(cv.resumen) < 25 ? 'text-edvanta-blue' : 'text-slate-400'}`}>{wordCount(cv.resumen)} palabras · ideal 25-90</p>
          </label>
        </div>
      </Panel>
    );
  }

  if (section === 'experiencia') {
    return (
      <Panel title="Experiencia laboral" hint="Cronológico inverso. Por cada cargo, 2-3 logros medibles (Acción + Impacto), no responsabilidades genéricas."
        action={<button type="button" onClick={() => addItem('experiencia')} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-edvanta-border px-3 text-sm font-bold text-slate-700 transition hover:border-edvanta-blue/40 hover:text-edvanta-blue"><Plus className="h-4 w-4" /> Agregar cargo</button>}>
        {cv.experiencia.length === 0 && <p className="rounded-lg border border-dashed border-edvanta-border p-4 text-center text-sm text-slate-500">Agrega tu cargo más reciente primero.</p>}
        <div className="space-y-3">
          {cv.experiencia.map((e, idx) => (
            <div key={e.id} className="rounded-lg border border-edvanta-border bg-slate-50/70 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Cargo {idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveItem('experiencia', e.id, -1)} disabled={idx === 0} aria-label="Subir" className="rounded p-1 text-slate-400 hover:bg-white hover:text-edvanta-blue disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => moveItem('experiencia', e.id, 1)} disabled={idx === cv.experiencia.length - 1} aria-label="Bajar" className="rounded p-1 text-slate-400 hover:bg-white hover:text-edvanta-blue disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
                  <button type="button" onClick={() => removeItem('experiencia', e.id)} aria-label="Quitar cargo" className="rounded p-1 text-rose-500 hover:bg-white hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">Cargo *</span><input value={e.cargo} onChange={ev => patchItem('experiencia', e.id, 'cargo', ev.target.value)} placeholder="Analista de control de calidad" className={inputCls} /></label>
                <label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">Empresa</span><input value={e.empresa} onChange={ev => patchItem('experiencia', e.id, 'empresa', ev.target.value)} placeholder="Nombre de la empresa" className={inputCls} /></label>
                <label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">Inicio</span><input value={e.inicio} onChange={ev => patchItem('experiencia', e.id, 'inicio', ev.target.value)} placeholder="Ene 2023" className={inputCls} /></label>
                <label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">Fin (actual = vacío)</span><input value={e.fin} onChange={ev => patchItem('experiencia', e.id, 'fin', ev.target.value)} placeholder="Mar 2025" className={inputCls} /></label>
              </div>
              <label className="mt-3 block"><span className="mb-1 block text-xs font-bold text-slate-600">Logros (uno por línea, Acción + Impacto)</span>
                <textarea value={e.logros} onChange={ev => patchItem('experiencia', e.id, 'logros', ev.target.value)} rows={3} placeholder={'Coordiné la renovación de 12 registros sanitarios sin observaciones.\nReducí desviaciones 30% con plan de muestreo.'} className="w-full rounded-lg border border-edvanta-border bg-white p-3 text-sm outline-none focus:border-edvanta-blue" /></label>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (section === 'formacion') {
    return (
      <Panel title="Formación académica" hint="Pregrado, posgrados o técnicos."
        action={<button type="button" onClick={() => addItem('educacion')} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-edvanta-border px-3 text-sm font-bold text-slate-700 transition hover:border-edvanta-blue/40 hover:text-edvanta-blue"><Plus className="h-4 w-4" /> Agregar</button>}>
        {cv.educacion.length === 0 && <p className="rounded-lg border border-dashed border-edvanta-border p-4 text-center text-sm text-slate-500">Agrega tu título profesional.</p>}
        <div className="space-y-2">
          {cv.educacion.map((e, idx) => (
            <div key={e.id} className="flex flex-wrap items-end gap-3 rounded-lg border border-edvanta-border bg-slate-50/70 p-3">
              <label className="block min-w-52 flex-1"><span className="mb-1 block text-xs font-bold text-slate-600">Título *</span><input value={e.titulo} onChange={ev => patchItem('educacion', e.id, 'titulo', ev.target.value)} placeholder="Química farmacéutica" className={inputCls} /></label>
              <label className="block min-w-40 flex-1"><span className="mb-1 block text-xs font-bold text-slate-600">Institución</span><input value={e.institucion} onChange={ev => patchItem('educacion', e.id, 'institucion', ev.target.value)} placeholder="Universidad" className={inputCls} /></label>
              <label className="block w-24"><span className="mb-1 block text-xs font-bold text-slate-600">Año</span><input value={e.anio} onChange={ev => patchItem('educacion', e.id, 'anio', ev.target.value)} placeholder="2020" className={inputCls} /></label>
              <div className="flex items-center gap-1 pb-1">
                <button type="button" onClick={() => moveItem('educacion', e.id, -1)} disabled={idx === 0} aria-label="Subir" className="rounded p-1 text-slate-400 hover:text-edvanta-blue disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => moveItem('educacion', e.id, 1)} disabled={idx === cv.educacion.length - 1} aria-label="Bajar" className="rounded p-1 text-slate-400 hover:text-edvanta-blue disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => removeItem('educacion', e.id)} aria-label="Quitar" className="rounded p-1 text-rose-500 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (section === 'habilidades') {
    return (
      <Panel title="Habilidades y competencias" hint="Usa términos estándar del sector (BPM, CAPA, HPLC, Power BI). Apunta a 6-12.">
        <div className="flex flex-wrap gap-2">
          {cv.habilidades.length === 0 && <p className="text-sm text-slate-500">Aún no agregas habilidades.</p>}
          {cv.habilidades.map((h, i) => (
            <span key={`${h}-${i}`} className="inline-flex items-center gap-1.5 rounded-full bg-edvanta-light px-3 py-1 text-xs font-bold text-edvanta-blue">
              {h}
              <button type="button" onClick={() => removeSkill(i)} aria-label={`Quitar ${h}`} className="text-edvanta-blue/60 hover:text-rose-600"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
        <SkillInput onAdd={addSkill} />
      </Panel>
    );
  }

  if (section === 'certificaciones') {
    return (
      <Panel title="Certificaciones" hint="Opcional pero suma. Cursos, diplomados o avales del sector."
        action={<button type="button" onClick={() => addItem('certificaciones')} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-edvanta-border px-3 text-sm font-bold text-slate-700 transition hover:border-edvanta-blue/40 hover:text-edvanta-blue"><Plus className="h-4 w-4" /> Agregar</button>}>
        {cv.certificaciones.length === 0 && <p className="rounded-lg border border-dashed border-edvanta-border p-4 text-center text-sm text-slate-500">Sin certificaciones aún. Es una sección opcional.</p>}
        <div className="space-y-2">
          {cv.certificaciones.map(c => (
            <div key={c.id} className="rounded-lg border border-edvanta-border bg-slate-50/70 p-3">
              <input value={c.nombre} onChange={ev => patchItem('certificaciones', c.id, 'nombre', ev.target.value)} placeholder="Certificación (ej. BPM INVIMA)" className={inputCls} />
              <div className="mt-2 flex gap-2">
                <input value={c.institucion} onChange={ev => patchItem('certificaciones', c.id, 'institucion', ev.target.value)} placeholder="Institución" className={inputCls + ' flex-1'} />
                <input value={c.anio} onChange={ev => patchItem('certificaciones', c.id, 'anio', ev.target.value)} placeholder="Año" className={inputCls + ' w-20'} />
                <button type="button" onClick={() => removeItem('certificaciones', c.id)} aria-label="Quitar" className="text-rose-500 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (section === 'idiomas') {
    return (
      <Panel title="Idiomas" hint="Opcional. Los ATS suelen preguntarlo; agrégalo aunque sea nivel básico."
        action={<button type="button" onClick={() => addItem('idiomas')} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-edvanta-border px-3 text-sm font-bold text-slate-700 transition hover:border-edvanta-blue/40 hover:text-edvanta-blue"><Plus className="h-4 w-4" /> Agregar</button>}>
        {cv.idiomas.length === 0 && <p className="rounded-lg border border-dashed border-edvanta-border p-4 text-center text-sm text-slate-500">Sin idiomas aún.</p>}
        <div className="space-y-2">
          {cv.idiomas.map(i => (
            <div key={i.id} className="flex gap-2">
              <input value={i.idioma} onChange={ev => patchItem('idiomas', i.id, 'idioma', ev.target.value)} placeholder="Idioma (ej. Inglés)" className={inputCls + ' flex-1'} />
              <select value={i.nivel} onChange={ev => patchItem('idiomas', i.id, 'nivel', ev.target.value)} className={inputCls + ' w-36'}>
                <option value="">Nivel</option><option>Básico</option><option>Intermedio</option><option>Avanzado</option><option>Nativo</option>
              </select>
              <button type="button" onClick={() => removeItem('idiomas', i.id)} aria-label="Quitar" className="text-rose-500 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  // ── Revisión ATS ──
  const prioridad = (tipo) => (tipo === 'error' ? { label: 'Prioridad alta', cls: 'bg-rose-100 text-rose-700' } : tipo === 'warn' ? { label: 'Prioridad media', cls: 'bg-edvanta-light text-edvanta-blue' } : { label: 'Opcional', cls: 'bg-sky-100 text-sky-700' });
  const mejoras = (analysis?.hallazgos || []).filter(f => f.tipo === 'error' || f.tipo === 'warn' || f.tipo === 'info');

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-edvanta-border bg-white p-5 shadow-sm">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-edvanta-blue">Cargo objetivo para el análisis</span>
          <select value={cargoObjetivo} onChange={e => setCargoObjetivo(e.target.value)} className={inputCls + ' mt-2 min-h-11 max-w-xl font-semibold'}>
            <option value="">Sin cargo específico (keywords del sector)</option>
            {cargosEmpleo.map(c => <option key={c.slug} value={c.slug}>{c.cargo}</option>)}
          </select>
        </label>
        <p className="mt-2 text-xs text-slate-500">Compara tu hoja de vida contra lo que piden los ATS para ese cargo.</p>
      </div>

      {!tieneContenido ? (
        <div className="rounded-xl border border-dashed border-edvanta-border bg-white p-8 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-edvanta-blue" />
          <p className="mt-3 text-sm font-bold text-edvanta-deep">Aún no hay contenido para analizar</p>
          <p className="mt-1 text-sm text-slate-500">Completa las secciones y tu puntaje aparece aquí en vivo.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-edvanta-border bg-white p-5 shadow-sm">
            <ScoreGauge score={analysis?.score || 0} />
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{analysis?.mensajeNivel}</p>
            {analysis?.keywords?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {analysis.keywords.slice(0, 14).map(k => <span key={k} className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-700">{k}</span>)}
              </div>
            )}
          </div>

          {/* Desglose por categorías (150% de detalles) */}
          {analysis?.desglose?.length > 0 && (
            <div className="rounded-xl border border-edvanta-border bg-white p-5 shadow-sm">
              <h3 className="text-base font-black text-edvanta-deep">Desglose por categoría</h3>
              <div className="mt-4 space-y-3">
                {analysis.desglose.map(d => {
                  const ratio = Math.max(0, Math.min(1, (Number(d.ok) || 0) / Math.max(1, d.total)));
                  const color = ratio >= 0.8 ? 'bg-teal-500' : ratio >= 0.45 ? 'bg-amber-500' : 'bg-rose-400';
                  return (
                    <div key={d.nombre}>
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-[13px] font-bold text-edvanta-deep">{d.nombre}</p>
                        <p className="text-[11px] font-bold text-slate-400">{Math.round(ratio * 100)}%</p>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <span className={`block h-1.5 rounded-full transition-all ${color}`} style={{ width: `${Math.round(ratio * 100)}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] leading-4 text-slate-500">{d.detalle}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fortalezas detectadas */}
          {analysis?.fortalezas?.length > 0 && (
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-5">
              <h3 className="text-base font-black text-teal-900">Lo que ya haces bien</h3>
              <ul className="mt-3 space-y-2">
                {analysis.fortalezas.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />{f}</li>
                ))}
              </ul>
            </div>
          )}

          {mejoras.length > 0 && (
            <div className="rounded-xl border border-edvanta-border bg-white p-5 shadow-sm">
              <h3 className="text-base font-black text-edvanta-deep">Mejoras recomendadas</h3>
              <ul className="mt-3 space-y-2">
                {mejoras.map((f, i) => {
                  const p = prioridad(f.tipo);
                  return (
                    <li key={i} className="rounded-lg border border-edvanta-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-edvanta-deep">{f.titulo}</p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${p.cls}`}>{p.label}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{f.detalle}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {adaptacion && (
            <div className="rounded-xl border border-edvanta-blue/20 bg-edvanta-light/50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-edvanta-deep">Adaptar a: {adaptacion.cargo.cargo}</p>
                <CopyButton text={adaptacion.logros.join('\n')} label="Copiar logros" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {adaptacion.palabras.map(p => <span key={p} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-edvanta-blue">{p}</span>)}
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-edvanta-blue">Resumen sugerido</p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-sm leading-6 text-slate-700">{adaptacion.resumenSugerido}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-edvanta-blue">Logros sugeridos</p>
                  <ul className="mt-2 space-y-1.5">
                    {adaptacion.logros.map(l => <li key={l} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-edvanta-blue" />{l}</li>)}
                  </ul>
                </div>
              </div>
              <button type="button" onClick={aplicarSugerencia} className="btn-edvanta mt-4"><RefreshCw className="h-4 w-4" /> Aplicar mejoras al formulario</button>
            </div>
          )}
        </>
      )}
      {saveMsg && <p className={`rounded-lg border p-3 text-sm leading-6 ${saveState === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-teal-200 bg-teal-50 text-teal-900'}`} role="status">{saveMsg}</p>}
    </div>
  );
}

// ── Analizador de hojas de vida (PDF o texto pegado) ──

const NIVEL_UI = {
  alto: { color: '#0F7480', fondo: '#DDF3F2', titulo: 'Lista para postular' },
  medio: { color: '#B45309', fondo: '#FFF1D6', titulo: 'Buena base, con ajustes' },
  bajo: { color: '#B42318', fondo: '#FEE4E2', titulo: 'Necesita cambios importantes' },
};

const tamanoLegible = (bytes) => (bytes >= 1024 * 1024
  ? `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
  : `${Math.max(1, Math.round(bytes / 1024))} KB`);

function Anillo({ puntaje, nivel }) {
  const ui = NIVEL_UI[nivel] || NIVEL_UI.bajo;
  const R = 30;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative h-24 w-24 shrink-0" role="img" aria-label={`Puntaje ${puntaje} de 100`}>
      <svg viewBox="0 0 72 72" className="h-24 w-24 -rotate-90" aria-hidden="true">
        <circle cx="36" cy="36" r={R} fill="none" stroke="#E3E9F2" strokeWidth="7" />
        <circle cx="36" cy="36" r={R} fill="none" stroke={ui.color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - puntaje / 100)} style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-extrabold text-edvanta-deep">{puntaje}</span>
        <span className="text-[10px] font-bold text-edvanta-muted">de 100</span>
      </span>
    </div>
  );
}

function BarraCategoria({ c }) {
  const pct = Math.round((c.puntos / c.max) * 100);
  const color = pct >= 80 ? '#25A7B0' : pct >= 50 ? '#D97706' : '#DC2626';
  return (
    <div className="rounded-xl border border-edvanta-border bg-white p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-bold text-edvanta-deep">{c.nombre}</p>
        <p className="text-xs font-bold tabular-nums text-edvanta-muted">{c.puntos}/{c.max}</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-edvanta-bg" aria-hidden="true">
        <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="mt-1.5 text-[11.5px] leading-4 text-edvanta-muted">{c.que}</p>
    </div>
  );
}

function ZonaArchivo({ onArchivo, cargando }) {
  const [encima, setEncima] = useState(false);
  const inputRef = useRef(null);
  const soltar = (e) => {
    e.preventDefault();
    setEncima(false);
    const archivo = e.dataTransfer?.files?.[0];
    if (archivo && !cargando) onArchivo(archivo);
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!encima) setEncima(true); }}
      onDragLeave={() => setEncima(false)}
      onDrop={soltar}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-5 py-10 text-center transition ${encima ? 'border-edvanta-blue bg-edvanta-light/60' : 'border-edvanta-strong bg-edvanta-bg'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        aria-label="Subir hoja de vida en PDF"
        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onArchivo(f); }}
        disabled={cargando}
      />
      <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-edvanta-blue shadow-sm ${cargando ? 'animate-pulse' : ''}`}>
        <Upload className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-1 text-base font-extrabold text-edvanta-deep">
        {cargando ? 'Leyendo tu hoja de vida…' : 'Arrastra aquí tu hoja de vida en PDF'}
      </p>
      <p className="max-w-md text-sm leading-6 text-edvanta-muted">
        {cargando ? 'Extraemos el texto, revisamos el formato y calculamos tu puntaje.' : 'O elígela desde tu computador o celular. Hasta 10 MB.'}
      </p>
      {!cargando && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl bg-edvanta-blue px-6 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(8,46,134,.22)] transition hover:bg-edvanta-bluedark"
        >
          <Upload className="h-4 w-4" aria-hidden="true" /> Elegir PDF
        </button>
      )}
      <p className="mt-1 flex items-center gap-1.5 text-xs text-edvanta-subtle">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Se lee en tu navegador: el archivo no se envía a ningún servidor.
      </p>
    </div>
  );
}

function LoQueLeimos({ d }) {
  const x = d.detectado;
  const dato = (etiqueta, valor, ok = Boolean(valor)) => (
    <li className="flex items-start justify-between gap-3 py-1.5">
      <span className="text-[13px] text-edvanta-muted">{etiqueta}</span>
      <span className={`max-w-[60%] break-words text-right text-[13px] font-semibold ${ok ? 'text-edvanta-deep' : 'text-rose-700'}`}>
        {valor || 'No encontrado'}
      </span>
    </li>
  );
  const NOMBRES = { perfil: 'Perfil', experiencia: 'Experiencia', formacion: 'Formación', habilidades: 'Habilidades', certificaciones: 'Cursos', idiomas: 'Idiomas', referencias: 'Referencias', datos: 'Datos personales', logros: 'Logros', publicaciones: 'Publicaciones', otros: 'Otros' };
  return (
    <div className="rounded-2xl border border-edvanta-border bg-white p-5">
      <p className="text-sm font-extrabold text-edvanta-deep">Lo que leímos de tu hoja de vida</p>
      <p className="mt-0.5 text-xs text-edvanta-muted">Así la ve un filtro automático. Si algo no coincide, es una pista de formato.</p>
      <ul className="mt-3 divide-y divide-edvanta-border">
        {dato('Nombre', x.nombre)}
        {dato('Título', x.titulo)}
        {dato('Correo', x.contacto.email)}
        {dato('Teléfono', x.contacto.telefono)}
        {dato('LinkedIn', x.contacto.linkedin)}
        {dato('Ciudad', x.contacto.ciudad)}
        {dato('Cargos', x.cargos ? `${x.cargos} · ${x.logros} logros` : '', x.cargos > 0)}
        {dato('Experiencia', x.anosExperiencia ? `${String(x.anosExperiencia).replace('.', ',')} años` : '', x.anosExperiencia > 0)}
        {dato('Estudios', x.estudios ? String(x.estudios) : '', x.estudios > 0)}
        {dato('Habilidades', x.habilidades ? String(x.habilidades) : '', x.habilidades > 0)}
        {dato('Idiomas', x.idiomas ? String(x.idiomas) : '', x.idiomas > 0)}
        {x.paginas !== null && dato('Páginas', String(x.paginas), x.paginas <= 2)}
        {x.columnas !== null && dato('Columnas', x.columnas > 1 ? 'Dos columnas' : 'Una columna', x.columnas <= 1)}
        {x.imagenes !== null && dato('Imágenes', x.imagenes ? String(x.imagenes) : 'Ninguna', true)}
        {x.creador && dato('Creado con', x.creador)}
      </ul>
      {x.secciones.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-muted">Secciones reconocidas</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {x.secciones.map((s) => (
              <span key={s} className="rounded-full bg-edvanta-mint px-2.5 py-0.5 text-[11px] font-bold text-edvanta-tealdark">{NOMBRES[s] || s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Reescritura({ r }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(r.sugerencia); setCopiado(true); setTimeout(() => setCopiado(false), 1800); } catch { /* sin portapapeles */ }
  };
  return (
    <li className="rounded-xl border border-edvanta-border bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-[.12em] text-rose-700">Así está</p>
      <p className="mt-1 text-sm leading-6 text-edvanta-muted line-through decoration-rose-300">{r.original}</p>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-tealdark">Mejor así</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-edvanta-deep">{r.sugerencia}</p>
      <button type="button" onClick={copiar} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-edvanta-border px-3 py-1.5 text-xs font-bold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue">
        {copiado ? <><Check className="h-3.5 w-3.5 text-edvanta-teal" aria-hidden="true" /> Copiado</> : <><Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copiar</>}
      </button>
    </li>
  );
}

function AnalizadorHv({
  lectura, diagnostico: d, cargo, setCargo, texto, setTexto, onArchivo, onTexto, cargando, error,
  onReiniciar, onPasarAlCreador, confirmar, onConfirmar, onCancelar,
}) {
  if (!d) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-edvanta-border bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">Analizador ATS</p>
          <h3 className="mt-1 font-display text-2xl font-extrabold text-edvanta-deep">¿Tu hoja de vida pasa los filtros automáticos?</h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-edvanta-muted">
            Súbela y en segundos te decimos qué ve un sistema de selección: tu puntaje por categoría, qué palabras clave te faltan,
            qué frases conviene reescribir y cómo arreglar el formato. Después la pasas al creador con un clic.
          </p>
          <div className="mt-5">
            <ZonaArchivo onArchivo={onArchivo} cargando={cargando} />
          </div>
          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800" role="alert">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-edvanta-border" />
            <span className="text-xs font-bold uppercase tracking-wide text-edvanta-subtle">o pega el texto</span>
            <span className="h-px flex-1 bg-edvanta-border" />
          </div>
          <label htmlFor="hv-texto" className="text-sm font-bold text-edvanta-deep">Texto de tu hoja de vida</label>
          <textarea
            id="hv-texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={8}
            placeholder={'Nombre Apellido\nQuímica farmacéutica\nciudad · teléfono · correo\n\nPERFIL PROFESIONAL\n…\n\nEXPERIENCIA\nCargo | Empresa\nEne 2021 – Actual\n• Logro con cifra…'}
            className="mt-1.5 w-full rounded-xl border border-edvanta-border p-4 text-sm leading-6 outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onTexto}
              disabled={texto.trim().length < 40}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-edvanta-blue px-6 text-sm font-semibold text-white transition hover:bg-edvanta-bluedark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Analizar texto
            </button>
            <p className="text-xs text-edvanta-muted">{texto.trim().length < 40 ? 'Pega al menos unas líneas de tu hoja de vida.' : 'Listo para analizar.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const ui = NIVEL_UI[d.nivel];
  const info = d.hallazgos.filter((h) => h.tipo === 'info');
  return (
    <div className="space-y-5">
      {/* Resultado */}
      <div className="rounded-2xl border border-edvanta-border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-5">
            <Anillo puntaje={d.puntaje} nivel={d.nivel} />
            <div>
              <span className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ color: ui.color, background: ui.fondo }}>{ui.titulo}</span>
              <h3 className="mt-1.5 font-display text-2xl font-extrabold text-edvanta-deep">Tu puntaje ATS es {d.puntaje}</h3>
              <p className="mt-1 max-w-xl text-sm leading-6 text-edvanta-muted">{d.mensaje}</p>
              {lectura?.archivo && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-edvanta-subtle">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" /> {lectura.archivo.nombre} · {tamanoLegible(lectura.archivo.tamano)}
                </p>
              )}
            </div>
          </div>
          <div className="w-full sm:w-72">
            <label htmlFor="hv-cargo" className="text-xs font-bold text-edvanta-deep">Cargo al que te postulas</label>
            <select
              id="hv-cargo"
              value={cargo || d.cargo?.slug || ''}
              onChange={(e) => setCargo(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border border-edvanta-border bg-white px-3 text-sm font-semibold outline-none focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15"
            >
              <option value="">Detectar automáticamente</option>
              {cargosEmpleo.map((c) => <option key={c.slug} value={c.slug}>{c.cargo}</option>)}
            </select>
            {d.cargo?.detectado && <p className="mt-1 text-[11px] text-edvanta-muted">Lo detectamos por el contenido. Cámbialo si te postulas a otro.</p>}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {d.categorias.map((c) => <BarraCategoria key={c.id} c={c} />)}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPasarAlCreador}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-edvanta-blue px-6 text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(8,46,134,.22)] transition hover:bg-edvanta-bluedark"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" /> Mejorarla en el creador
          </button>
          <button
            type="button"
            onClick={onReiniciar}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-6 text-[15px] font-semibold text-edvanta-blue transition hover:border-edvanta-blue/40"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Analizar otra
          </button>
          <p className="text-xs text-edvanta-muted">Pasamos tus datos al creador: ahí aplicas las mejoras y la descargas con el diseño oficial.</p>
        </div>

        {confirmar && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4" role="alert">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            <p className="flex-1 text-sm leading-6 text-amber-900">Ya tienes una hoja de vida en el creador. Si continúas, la reemplazamos por la que acabas de analizar.</p>
            <button type="button" onClick={onConfirmar} className="inline-flex min-h-10 items-center rounded-lg bg-amber-700 px-4 text-sm font-bold text-white hover:bg-amber-800">Reemplazar</button>
            <button type="button" onClick={onCancelar} className="inline-flex min-h-10 items-center rounded-lg border border-amber-300 px-4 text-sm font-bold text-amber-900 hover:bg-amber-100">Cancelar</button>
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-start">
        <div className="space-y-5">
          {/* Prioridades */}
          {d.prioridades.length > 0 && (
            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <p className="text-sm font-extrabold text-edvanta-deep">Qué corregir primero</p>
              <p className="mt-0.5 text-xs text-edvanta-muted">Ordenado por los puntos que recuperas.</p>
              <ol className="mt-4 space-y-3">
                {d.prioridades.map((p, i) => (
                  <li key={`${p.categoria}-${p.titulo}`} className="rounded-xl border border-edvanta-border p-4">
                    <div className="flex items-start gap-3">
                      <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold ${p.tipo === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-[15px] font-bold text-edvanta-deep">{p.titulo}</p>
                          {p.impacto > 0 && <span className="text-[11px] font-bold text-edvanta-tealdark">+{p.impacto} puntos</span>}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-edvanta-muted">{p.detalle}</p>
                        {p.como && (
                          <p className="mt-2 rounded-lg bg-edvanta-bg px-3 py-2 text-sm leading-6 text-edvanta-deep">
                            <span className="font-bold text-edvanta-blue">Cómo corregirlo: </span>{p.como}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Reescrituras */}
          {d.reescrituras.length > 0 && (
            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <p className="text-sm font-extrabold text-edvanta-deep">Frases que conviene reescribir</p>
              <p className="mt-0.5 text-xs text-edvanta-muted">Describen tareas, no resultados. Completa lo que va entre corchetes con tu dato real.</p>
              <ul className="mt-4 grid gap-3">
                {d.reescrituras.map((r) => <Reescritura key={r.original} r={r} />)}
              </ul>
            </div>
          )}

          {/* Palabras clave */}
          {d.cargo && (
            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <p className="text-sm font-extrabold text-edvanta-deep">Palabras clave para {d.cargo.nombre}</p>
              <p className="mt-0.5 text-xs text-edvanta-muted">Agrega solo las que de verdad manejas: en la entrevista te las van a preguntar.</p>
              {d.palabrasClave.encontradas.length > 0 && (
                <>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-tealdark">Ya las tienes</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {d.palabrasClave.encontradas.map((k) => <span key={k} className="rounded-full bg-edvanta-mint px-2.5 py-1 text-xs font-bold text-edvanta-tealdark">{k}</span>)}
                  </div>
                </>
              )}
              {d.palabrasClave.faltantes.length > 0 && (
                <>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[.12em] text-rose-700">Te faltan</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {d.palabrasClave.faltantes.map((k) => <span key={k} className="rounded-full border border-dashed border-edvanta-strong px-2.5 py-1 text-xs font-bold text-edvanta-deep">{k}</span>)}
                  </div>
                </>
              )}
            </div>
          )}

          {info.length > 0 && (
            <div className="rounded-2xl border border-edvanta-border bg-white p-5">
              <p className="text-sm font-extrabold text-edvanta-deep">Otras observaciones</p>
              <ul className="mt-3 space-y-2">{info.map((f) => <FindingRow key={f.titulo} f={f} />)}</ul>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <LoQueLeimos d={d} />
          {d.fortalezas.length > 0 && (
            <div className="rounded-2xl border border-edvanta-mint bg-edvanta-mint/40 p-5">
              <p className="text-sm font-extrabold text-edvanta-tealdark">Lo que ya haces bien</p>
              <ul className="mt-2 space-y-1.5">
                {d.fortalezas.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm leading-6 text-edvanta-deep"><Check className="mt-1 h-4 w-4 shrink-0 text-edvanta-teal" aria-hidden="true" />{f}</li>
                ))}
              </ul>
            </div>
          )}
          {lectura?.texto && (
            <details className="rounded-2xl border border-edvanta-border bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-edvanta-deep">Ver el texto que leímos</summary>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-edvanta-bg p-3 font-sans text-xs leading-5 text-edvanta-deep">{lectura.texto}</pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Guía 2026 (contenido conservado) ──
function Guia2026() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-edvanta-blue/20 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-edvanta-blue">La regla de oro del 2026</p>
        <h3 className="mt-1 text-xl font-black text-edvanta-deep">Tu hoja de vida la revisa una máquina antes que una persona</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">La mayoría de las vacantes en Colombia se gestionan con ATS y preselección con IA. La primera lectura es automática: estructura, palabras clave del anuncio, logros medibles y formato PDF legible.</p>
        <ul className="mt-4 space-y-2">
          {guiaCVContenido.ats2026.map(a => (
            <li key={a.titulo} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /><span><strong className="text-edvanta-deep">{a.titulo}.</strong> {a.detalle}</span></li>
          ))}
        </ul>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-teal-200 bg-white p-5">
          <p className="text-sm font-bold text-teal-800">Lo que sí debe llevar</p>
          <ul className="mt-3 space-y-2.5">{guiaCVContenido.debeIr.map(i => <li key={i.titulo} className="flex items-start gap-2 text-sm leading-5 text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /><span><strong className="text-edvanta-deep">{i.titulo}.</strong> {i.detalle}</span></li>)}</ul>
        </div>
        <div className="rounded-xl border border-rose-200 bg-white p-5">
          <p className="text-sm font-bold uppercase text-rose-700">Lo que NO debe llevar</p>
          <ul className="mt-3 space-y-2.5">{guiaCVContenido.noDebe.map(i => <li key={i.titulo} className="flex items-start gap-2 text-sm leading-5 text-slate-700"><X className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" /><span><strong className="text-edvanta-deep">{i.titulo}.</strong> {i.detalle}</span></li>)}</ul>
        </div>
      </div>
    </div>
  );
}

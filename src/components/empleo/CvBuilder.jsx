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
import { analyzeCv, analyzeText, cargarPorSlug, guiaCVContenido, sugerirCargo } from '../../lib/cv/analyzer';
import { downloadCvPdf } from '../../lib/cv/pdf';
import { extractPdfText } from '../../lib/cv/pdfText';
import { trackEvent } from '../../utils/analytics';

const EMPTY_CV = {
  nombre: '', titulo: '', email: '', telefono: '', ciudad: '', linkedin: '',
  resumen: '', experiencia: [], educacion: [], habilidades: [], certificaciones: [], idiomas: [], referencias: [],
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

// ── Vista previa del CV (documento en vivo) ──
function CvPreview({ cv }) {
  const vacio = !cv.nombre && !cv.resumen && !cv.experiencia.length && !cv.habilidades.length;
  const contacto = [cv.email, cv.telefono, cv.ciudad, cv.linkedin].filter(Boolean);
  return (
    <div className="overflow-hidden rounded-xl border border-edvanta-border bg-slate-100 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400"><Eye className="h-3.5 w-3.5" /> Vista previa</p>
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
        {vacio ? (
          <p className="py-16 text-center text-sm text-slate-400">Tu hoja de vida aparecerá aquí a medida que la completes.</p>
        ) : (
          <div className="text-[11px] leading-relaxed text-slate-700">
            <h3 className="text-lg font-black text-edvanta-deep">{cv.nombre || 'Tu nombre'}</h3>
            {cv.titulo && <p className="text-[12px] font-bold text-edvanta-blue">{cv.titulo}</p>}
            {contacto.length > 0 && <p className="mt-1 text-[10px] text-slate-500">{contacto.join('  ·  ')}</p>}
            {cv.resumen && (<><p className="cv-h">Perfil profesional</p><p>{cv.resumen}</p></>)}
            {cv.experiencia.some(e => e.cargo) && (
              <><p className="cv-h">Experiencia</p>
                {cv.experiencia.filter(e => e.cargo).map(e => (
                  <div key={e.id} className="mb-2">
                    <p className="font-bold text-edvanta-deep">{e.cargo}{e.empresa ? ` · ${e.empresa}` : ''}</p>
                    {(e.inicio || e.fin) && <p className="text-[10px] text-slate-400">{[e.inicio, e.fin || 'Actual'].filter(Boolean).join(' — ')}</p>}
                    {String(e.logros || '').split('\n').filter(Boolean).map((l, i) => (
                      <p key={i} className="pl-3 -indent-2">• {l}</p>
                    ))}
                  </div>
                ))}
              </>
            )}
            {cv.educacion.some(e => e.titulo) && (
              <><p className="cv-h">Formación</p>
                {cv.educacion.filter(e => e.titulo).map(e => (
                  <p key={e.id}><span className="font-bold text-edvanta-deep">{e.titulo}</span>{e.institucion ? ` · ${e.institucion}` : ''}{e.anio ? ` (${e.anio})` : ''}</p>
                ))}
              </>
            )}
            {cv.habilidades.length > 0 && (<><p className="cv-h">Habilidades</p><p>{cv.habilidades.join('  ·  ')}</p></>)}
            {cv.certificaciones.some(c => c.nombre) && (<><p className="cv-h">Certificaciones</p>{cv.certificaciones.filter(c => c.nombre).map(c => <p key={c.id}>{c.nombre}{c.institucion ? ` · ${c.institucion}` : ''}{c.anio ? ` (${c.anio})` : ''}</p>)}</>)}
            {cv.idiomas.some(i => i.idioma) && (<><p className="cv-h">Idiomas</p><p>{cv.idiomas.filter(i => i.idioma).map(i => `${i.idioma}${i.nivel ? ` (${i.nivel})` : ''}`).join('  ·  ')}</p></>)}
          </div>
        )}
      </div>
      <style>{`.cv-h{font-weight:800;text-transform:uppercase;font-size:9px;letter-spacing:.06em;color:#3578E5;margin-top:10px;margin-bottom:2px;border-bottom:1px solid #E5EAF0;padding-bottom:2px}`}</style>
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
  const [textResult, setTextResult] = useState(null);
  const [importStep, setImportStep] = useState(1);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const dirty = useRef(false);
  const autosaveTimer = useRef(null);
  const exportRef = useRef(null);

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

  const descargar = async (style = 'diseno') => {
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

  // Lee un PDF local y extrae su texto (100% en el navegador)
  const analizarPdf = async (event) => {
    const file = event?.target?.files?.[0];
    if (event?.target) event.target.value = '';
    if (!file) return;
    setPdfError('');
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      setPdfError('Solo se aceptan archivos PDF. Si tu HV está en Word, expórtala como PDF o pega el texto.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPdfError('El archivo supera 10 MB. Comprime el PDF o pega el texto manualmente.');
      return;
    }
    setPdfLoading(true);
    trackEvent('cv_pdf_uploaded');
    try {
      const text = await extractPdfText(file);
      if (!text.trim()) {
        setPdfError('Este PDF no tiene texto extraíble (parece escaneado como imagen). Exporta un PDF con texto seleccionable o pega el contenido manualmente.');
        return;
      }
      setTextoPegado(text);
      const cargoSugerido = sugerirCargo(text) || cargoObjetivo;
      if (cargoSugerido) setCargoObjetivo(cargoSugerido);
      setTextResult(analyzeText(text, cargoSugerido));
      setImportStep(3);
    } catch {
      setPdfError('No fue posible leer este PDF. Prueba con otro archivo o pega el texto manualmente.');
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
    if (!textoPegado.trim()) return;
    trackEvent('cv_text_analyzed');
    const cargoSugerido = sugerirCargo(textoPegado) || cargoObjetivo;
    setTextResult(analyzeText(textoPegado, cargoSugerido));
    setCargoObjetivo(cargoSugerido);
    setImportStep(3);
  };

  const saveLabel = { saving: 'Guardando…', saved: 'Guardado', error: 'Error al guardar' };

  // ── Barra superior (siempre visible) ──
  const TopBar = () => (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edvanta-border bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue"><FileText className="h-5 w-5" /></span>
        <div>
          <p className="text-sm font-black text-edvanta-deep">Creador de hoja de vida</p>
          <p className="text-[11px] font-semibold text-slate-400">
            {academiaUser && saveState ? (saveLabel[saveState] || '') : 'Se completa por secciones · Progreso'} {overall > 0 && <span className="text-edvanta-blue">· {overall}%</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setShowPreview(v => !v)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-edvanta-border bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-edvanta-blue/40 hover:text-edvanta-blue lg:hidden">
          {showPreview ? <><Pencil className="h-4 w-4" /> Editar</> : <><Eye className="h-4 w-4" /> Vista previa</>}
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
              <button type="button" role="menuitem" onClick={() => descargar('diseno')} className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-edvanta-light/70">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-edvanta-light text-edvanta-blue"><FileText className="h-4 w-4" /></span>
                <span>
                  <span className="block text-sm font-black text-edvanta-deep">Diseño Edvanta 2026</span>
                  <span className="mt-0.5 block text-xs leading-4 text-slate-500">Plantilla Blanca Degradado: chips de contacto, línea de tiempo y acentos azules. PDF con texto seleccionable.</span>
                </span>
              </button>
              <button type="button" onClick={() => descargar('ats')} className="mt-1 flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-slate-50">
                <span className="mt-0 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><FileText className="h-4 w-4" /></span>
                <span>
                  <span className="block text-sm font-bold text-slate-700">Formato ATS simple</span>
                  <span className="mt-0.5 block text-xs leading-4 text-slate-500">Texto plano en blanco y negro, para portales con filtros estrictos.</span>
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
          { id: 'importar', label: 'Analizar una HV existente', icon: ScanSearch },
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
          <TopBar />
          {!academiaUser && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edvanta-blue/20 bg-edvanta-light/60 p-4">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-blue" />
                <div>
                  <p className="text-sm font-bold text-edvanta-deep">Crea tu cuenta para guardar y autoguardar tu hoja de vida</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-600">Con tu cuenta gratuita, tu CV se autoguarda y lo recuperas desde cualquier dispositivo. La descarga en PDF funciona incluso sin cuenta.</p>
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

      {/* ══ MODO IMPORTAR (analizador ATS por pasos) ══ */}
      {mode === 'importar' && (
        <ImportAnalyzer
          step={importStep} setStep={setImportStep} texto={textoPegado} setTexto={setTextoPegado}
          cargo={cargoObjetivo} setCargo={setCargoObjetivo} onAnalyze={analizarPegado} result={textResult}
          onFile={analizarPdf} pdfLoading={pdfLoading} pdfError={pdfError}
          onGoBuilder={() => { setMode('builder'); setSection('perfil'); }}
          onReset={() => { setTextResult(null); setImportStep(1); setPdfError(''); }}
        />
      )}

      {/* ══ MODO GUÍA ══ */}
      {mode === 'guia' && <Guia2026 />}

      <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

// ── Editor por sección ──
function SectionEditor(props) {
  const { section, cv, setField, addItem, removeItem, patchItem, moveItem, addSkill, removeSkill,
    cargoObjetivo, setCargoObjetivo, analysis, adaptacion, aplicarSugerencia, tieneContenido, saveMsg, saveState } = props;

  const Panel = ({ title, hint, children, action }) => (
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
            <p className={`mt-1 text-xs font-semibold ${wordCount(cv.resumen) > 0 && wordCount(cv.resumen) < 25 ? 'text-amber-700' : 'text-slate-400'}`}>{wordCount(cv.resumen)} palabras · ideal 25-90</p>
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
  const prioridad = (tipo) => (tipo === 'error' ? { label: 'Prioridad alta', cls: 'bg-rose-100 text-rose-700' } : tipo === 'warn' ? { label: 'Prioridad media', cls: 'bg-amber-100 text-amber-700' } : { label: 'Opcional', cls: 'bg-sky-100 text-sky-700' });
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

// ── Analizador de HV existente (por pasos) ──
function ImportAnalyzer({ step, setStep, texto, setTexto, cargo, setCargo, onAnalyze, result, onReset, onFile, pdfLoading, pdfError, onGoBuilder }) {
  const steps = [{ n: 1, label: 'Tu hoja de vida' }, { n: 2, label: 'Cargo objetivo' }, { n: 3, label: 'Análisis' }];
  return (
    <div className="space-y-5">
      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.n} className="flex flex-1 items-center gap-2">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${step >= s.n ? 'bg-edvanta-blue text-white' : 'bg-slate-100 text-slate-400'}`}>{s.n}</span>
            <span className={`text-sm font-bold ${step >= s.n ? 'text-edvanta-deep' : 'text-slate-400'}`}>{s.label}</span>
            {i < steps.length - 1 && <span className="mx-1 hidden h-0.5 flex-1 bg-slate-200 sm:block" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="rounded-xl border border-edvanta-border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-edvanta-deep">Sube tu hoja de vida en PDF o pega su texto</p>
          <p className="mt-1 text-sm text-slate-600">El análisis es 100% local y privado: el archivo se lee en tu navegador y no se envía a ningún servidor.</p>

          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-edvanta-border bg-slate-50/60 px-4 py-8 text-center transition hover:border-edvanta-blue/50 hover:bg-edvanta-light/40">
            <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={onFile} disabled={pdfLoading} />
            <Upload className={`h-7 w-7 text-edvanta-blue ${pdfLoading ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-black text-edvanta-deep">{pdfLoading ? 'Leyendo tu PDF…' : 'Subir hoja de vida en PDF'}</span>
            <span className="max-w-sm text-xs leading-5 text-slate-500">Hasta 10 MB. Detectamos el cargo probable, el puntaje ATS y qué corregir. Si tu PDF es un escaneo sin texto, te avisamos.</span>
          </label>

          {pdfLoading && <p className="mt-3 rounded-lg border border-edvanta-blue/20 bg-edvanta-light/60 p-3 text-sm font-semibold text-edvanta-blue" role="status">Extrayendo el texto del PDF…</p>}
          {pdfError && <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-800" role="alert">{pdfError}</p>}

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-edvanta-border" />
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">o pega el texto</span>
            <span className="h-px flex-1 bg-edvanta-border" />
          </div>

          <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={9} placeholder={'NOMBRE\nQuímica farmacéutica\nExperiencia:\n- Analista de control de calidad…\nFormación:\n- Química farmacéutica…\nHabilidades:\n- BPM, Excel avanzado, Power BI'} className="w-full rounded-lg border border-edvanta-border p-4 text-sm leading-6 outline-none focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15" />
          <button type="button" onClick={() => setStep(2)} disabled={!texto.trim()} className="btn-edvanta mt-3 disabled:opacity-50">Continuar</button>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-xl border border-edvanta-border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-edvanta-deep">¿A qué cargo te postulas?</p>
          <p className="mt-1 text-sm text-slate-600">Opcional. Si lo dejas vacío, detectamos el cargo más probable por el contenido.</p>
          <select value={cargo} onChange={e => setCargo(e.target.value)} className={inputCls + ' mt-3 min-h-11 max-w-xl font-semibold'}>
            <option value="">Detectar automáticamente</option>
            {cargosEmpleo.map(c => <option key={c.slug} value={c.slug}>{c.cargo}</option>)}
          </select>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="btn-edvanta-outline">Atrás</button>
            <button type="button" onClick={onAnalyze} className="btn-edvanta"><Sparkles className="h-4 w-4" /> Analizar mi hoja de vida</button>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-4">
          <div className="rounded-xl border border-edvanta-border bg-white p-5 shadow-sm">
            <ScoreGauge score={result.score} />
            <p className="mt-3 text-sm font-semibold text-slate-700">{result.recomendacion}</p>
            {result.keywords?.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Palabras clave encontradas</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">{result.keywords.map(k => <span key={k} className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-700">{k}</span>)}</div>
              </div>
            )}
            {result.fortalezas?.length > 0 && (
              <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50/60 p-4">
                <p className="text-sm font-bold text-teal-900">Lo que ya haces bien</p>
                <ul className="mt-2 space-y-1.5">
                  {result.fortalezas.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />{f}</li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="mt-4 space-y-2">{result.hallazgos.map((f, i) => <FindingRow key={i} f={f} />)}</ul>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onReset} className="btn-edvanta-outline">Analizar otra</button>
            <button type="button" onClick={onGoBuilder} className="btn-edvanta"><FileText className="h-4 w-4" /> Reescribirla en el creador</button>
            <p className="self-center text-xs text-slate-500">En el creador aplicas las mejoras y descargas el PDF.</p>
          </div>
        </div>
      )}
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

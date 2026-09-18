/**
 * ============================================================
 *  talento.jsx — Piezas del directorio de talento farmacéutico
 *
 *  Se usan en dos landing distintas, cada una con su público:
 *   · /empresas/talento → buscar y contactar talento (empresas)
 *   · /talento          → publicar el propio perfil (profesionales)
 *
 *  Ambas hablan con la misma API de comunidad.
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Eye, Search, UserRound } from 'lucide-react';
import { apiUrl } from '../../config/api';
import { areasTalento } from '../../data/careerHub';
import { useAuth } from '../../context/AuthContext';
import { useProfessional } from '../../context/ProfessionalContext';

export const areaLabel = (slug) => areasTalento.find((a) => a.slug === slug)?.nombre || slug;

export const splitLines = (s, max) =>
  String(s || '').split('\n').map((x) => x.trim()).filter(Boolean).slice(0, max);

/** Perfiles de ejemplo: solo se muestran si el directorio en línea no responde. */
export const TALENTO_DEMO = [
  { id: 'demo-1', nombre: 'Camila Rodríguez', area: 'calidad', titulo: 'Química farmacéutica — Analista de control de calidad', habilidades: ['Química analítica', 'Microbiología', 'BPM', 'Integridad de datos'], proyectos: ['Validación de método de disolución', 'Checklist de muestreo'], articulos: ['Estabilidad de formas sólidas en clima tropical'], linkedin: 'https://www.linkedin.com/', disponibilidad: 'Disponible para iniciar', demo: true },
  { id: 'demo-2', nombre: 'Andrés Páez', area: 'regulatorio', titulo: 'Profesional de asuntos regulatorios', habilidades: ['Registros sanitarios', 'Etiquetado', 'Dossiers', 'Farmacovigilancia'], proyectos: ['Renovación de 12 registros sanitarios'], articulos: ['Actualización normativa para cosméticos en Colombia'], linkedin: 'https://www.linkedin.com/', disponibilidad: 'Abierto a proyectos y consultoría', demo: true },
  { id: 'demo-3', nombre: 'Julián Castro', area: 'farmacovigilancia', titulo: 'Analista de farmacovigilancia', habilidades: ['Gestión de casos', 'Evaluación de causalidad', 'ICSR', 'Señales'], proyectos: ['Soporte a titular de registro en reportes de seguridad'], articulos: ['Reporte de eventos adversos en biotecnológicos'], linkedin: 'https://www.linkedin.com/', disponibilidad: 'Disponible para iniciar', demo: true },
  { id: 'demo-4', nombre: 'Laura Martínez', area: 'clinico', titulo: 'Química farmacéutica — Farmacia hospitalaria', habilidades: ['Seguimiento farmacoterapéutico', 'Conciliación', 'Unidosis'], proyectos: ['Programa de conciliación medicamentosa en hospital'], articulos: ['Intervenciones farmacéuticas documentadas'], linkedin: 'https://www.linkedin.com/', disponibilidad: 'Disponible para iniciar', demo: true },
];

/* ── Tarjeta de talento ───────────────────────────────────── */

export function TalentCard({ t, preview = false }) {
  return (
    <article className={`flex min-h-72 flex-col rounded-2xl border bg-white p-5 shadow-[0_1px_2px_rgba(23,34,59,.04)] ${preview ? 'border-edvanta-blue/30' : 'border-edvanta-border transition hover:-translate-y-0.5 hover:border-edvanta-blue/40 hover:shadow-[0_12px_36px_rgba(23,34,59,.12)]'}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-edvanta-light text-edvanta-blue">
          <UserRound className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {t.destacado && <span className="rounded-full bg-edvanta-lilac px-2.5 py-1 text-[11px] font-bold text-[#5E51A8]">Destacado</span>}
          {t.demo && <span className="rounded-full bg-edvanta-bg px-2.5 py-1 text-[11px] font-bold text-edvanta-muted">Ejemplo</span>}
          {t.area && <span className="rounded-full bg-edvanta-mint px-2.5 py-1 text-[11px] font-bold text-edvanta-tealdark">{areaLabel(t.area)}</span>}
        </div>
      </div>
      <h3 className="mt-3 text-lg font-bold text-edvanta-deep">{t.nombre || 'Tu nombre'}</h3>
      <p className="mt-1 text-sm font-semibold text-edvanta-deep/80">{t.titulo || 'Tu título profesional'}</p>
      {(t.habilidades || []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.habilidades.map((h) => (
            <span key={h} className="rounded-full bg-edvanta-bg px-2.5 py-1 text-[11px] font-semibold text-edvanta-deep">{h}</span>
          ))}
        </div>
      )}
      {(t.proyectos || []).length > 0 && (
        <div className="mt-3 border-t border-edvanta-border pt-3">
          <p className="text-[11px] font-bold uppercase text-edvanta-muted">Proyectos y páginas</p>
          <ul className="mt-1 space-y-1">{t.proyectos.map((p) => <li key={p} className="text-xs leading-5 text-edvanta-muted">· {p}</li>)}</ul>
        </div>
      )}
      {(t.articulos || []).length > 0 && (
        <div className="mt-2 border-t border-edvanta-border pt-2">
          <p className="text-[11px] font-bold uppercase text-edvanta-muted">Artículos científicos</p>
          <ul className="mt-1 space-y-1">{t.articulos.map((a) => <li key={a} className="text-xs leading-5 text-edvanta-muted">· {a}</li>)}</ul>
        </div>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="text-[11px] font-bold text-edvanta-tealdark">{t.disponibilidad || 'Disponible'}</span>
        {t.linkedin
          ? (
            <a
              href={preview ? undefined : t.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-edvanta-deep hover:text-edvanta-blue"
            >
              Ver perfil <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )
          : <span className="text-xs text-edvanta-subtle">LinkedIn</span>}
      </div>
    </article>
  );
}

/* ── Directorio (lo usan las empresas) ────────────────────── */

export function TalentDirectory({ onPublicar }) {
  const [area, setArea] = useState('todas');
  const [query, setQuery] = useState('');
  const [perfiles, setPerfiles] = useState(TALENTO_DEMO);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (area !== 'todas') params.set('area', area);
      if (query.trim()) params.set('q', query.trim());
      const qs = params.toString();
      fetch(apiUrl(`/api/community/talent${qs ? `?${qs}` : ''}`), { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : { data: [] }))
        .then((payload) => {
          const apiProfiles = Array.isArray(payload.data) ? payload.data.map((p) => ({
            id: p.id || p.slug,
            nombre: p.display_name,
            area: p.area,
            titulo: p.title,
            habilidades: Array.isArray(p.habilidades) ? p.habilidades : [],
            proyectos: Array.isArray(p.proyectos) ? p.proyectos : [],
            articulos: Array.isArray(p.articulos) ? p.articulos : [],
            linkedin: p.linkedin,
            contacto: p.contacto,
            disponibilidad: p.disponibilidad || 'Disponible',
            destacado: Boolean(p.destacado),
          })) : [];
          if (apiProfiles.length) { setPerfiles(apiProfiles); setApiError(''); }
        })
        .catch(() => setApiError('El directorio en línea no está disponible: mostramos perfiles de ejemplo.'))
        .finally(() => setLoading(false));
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [area, query]);

  const visibles = useMemo(() => perfiles.filter((t) => {
    const porArea = area === 'todas' || t.area === area;
    const q = query.trim().toLowerCase();
    const porBusqueda = !q || `${t.nombre} ${t.titulo} ${(t.habilidades || []).join(' ')}`.toLowerCase().includes(q);
    return porArea && porBusqueda;
  }), [perfiles, area, query]);

  const chip = (activo) => `min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold transition ${activo ? 'border-edvanta-blue bg-edvanta-blue text-white' : 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-blue/40'}`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-edvanta-subtle" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, cargo o habilidad…"
            aria-label="Buscar talento"
            className="min-h-11 w-full rounded-xl border border-edvanta-border pl-10 pr-3.5 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por área">
          <button type="button" onClick={() => setArea('todas')} aria-pressed={area === 'todas'} className={chip(area === 'todas')}>Todas</button>
          {areasTalento.map((a) => (
            <button key={a.slug} type="button" onClick={() => setArea(a.slug)} aria-pressed={area === a.slug} className={chip(area === a.slug)}>
              {a.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-edvanta-muted" role="status">
          {loading ? 'Consultando el directorio…' : `${visibles.length} ${visibles.length === 1 ? 'perfil' : 'perfiles'} · clasificados por área`}
        </p>
        {onPublicar}
      </div>
      {apiError && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="status">{apiError}</p>}

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl border border-edvanta-border bg-white" />)}
        </div>
      ) : visibles.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{visibles.map((t) => <TalentCard key={t.id} t={t} />)}</div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-edvanta-border bg-white px-6 py-14 text-center">
          <Search className="mx-auto h-8 w-8 text-edvanta-subtle" aria-hidden="true" />
          <p className="mt-3 text-lg font-bold text-edvanta-deep">No encontramos perfiles con esos criterios</p>
          <button
            type="button"
            onClick={() => { setArea('todas'); setQuery(''); }}
            className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-edvanta-blue px-5 text-sm font-semibold text-white hover:bg-edvanta-bluedark"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Constructor del perfil (lo usan los profesionales) ───── */

const EMPTY_FORM = {
  display_name: '', area: '', title: '', habilidades: '', proyectos: '',
  articulos: '', linkedin: '', contacto: '', disponibilidad: '',
};

export function TalentPublishForm({ titulo = 'Publica tu perfil profesional', descripcion }) {
  const { profile: accountProfile } = useAuth();
  const { professionalProfile } = useProfessional();
  const [form, setForm] = useState(EMPTY_FORM);
  const [enviando, setEnviando] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [formOk, setFormOk] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Prellenado desde el perfil profesional, si la persona ya tiene uno.
  useEffect(() => {
    setForm((prev) => {
      if (prev.display_name || prev.title) return prev;
      const nombre = professionalProfile?.display_name || accountProfile?.full_name || '';
      const titulo2 = professionalProfile?.current_role || professionalProfile?.headline || '';
      if (!nombre && !titulo2) return prev;
      return { ...prev, display_name: nombre, title: titulo2 };
    });
  }, [professionalProfile, accountProfile]);

  const preview = useMemo(() => ({
    nombre: form.display_name,
    area: form.area,
    titulo: form.title,
    habilidades: splitLines(form.habilidades, 12),
    proyectos: splitLines(form.proyectos, 8),
    articulos: splitLines(form.articulos, 8),
    linkedin: form.linkedin,
    disponibilidad: form.disponibilidad,
  }), [form]);

  const completos = ['display_name', 'area', 'title'].filter((k) => form[k].trim()).length;
  const progreso = Math.min(100, Math.round((completos / 3) * 60 + (splitLines(form.habilidades, 12).length ? 25 : 0) + (form.contacto.trim() ? 15 : 0)));

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const copiarPerfil = async () => {
    const t = preview;
    const txt = [
      t.nombre, t.titulo, areaLabel(t.area), '',
      `Habilidades: ${t.habilidades.join(', ')}`,
      t.proyectos.length ? `Proyectos: ${t.proyectos.join('; ')}` : '',
      t.articulos.length ? `Artículos: ${t.articulos.join('; ')}` : '',
      form.linkedin, form.contacto,
    ].filter(Boolean).join('\n');
    try {
      await navigator.clipboard.writeText(txt);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch { /* portapapeles no disponible */ }
  };

  const publicar = async (event) => {
    event.preventDefault();
    if (!form.display_name.trim() || !form.area.trim() || !form.title.trim()) {
      setFormOk(false);
      setFormMsg('Completa al menos nombre, área y título profesional.');
      return;
    }
    setEnviando(true);
    setFormMsg('');
    const payload = {
      display_name: form.display_name.trim(),
      area: form.area.trim().toLowerCase(),
      title: form.title.trim(),
      habilidades: splitLines(form.habilidades, 12),
      proyectos: splitLines(form.proyectos, 8),
      articulos: splitLines(form.articulos, 8),
      linkedin: form.linkedin.trim(),
      contacto: form.contacto.trim(),
      disponibilidad: form.disponibilidad.trim(),
    };
    try {
      const res = await fetch(apiUrl('/api/community/talent'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setFormOk(false);
        setFormMsg(`Límite de publicaciones alcanzado: ${data.error || 'intenta de nuevo en unos minutos.'}`);
      } else if (res.ok && data.ok) {
        setFormOk(true);
        setFormMsg('¡Listo! Tu perfil quedó registrado y será visible tras la revisión del equipo.');
      } else {
        setFormOk(false);
        setFormMsg(data.error || 'No se pudo publicar el perfil. Intenta de nuevo.');
      }
    } catch {
      setFormOk(false);
      setFormMsg('Sin conexión: tu perfil no se pudo enviar. Inténtalo más tarde.');
    }
    setEnviando(false);
  };

  const inputCls = 'min-h-11 w-full rounded-xl border border-edvanta-border px-3.5 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15';
  const areaCls = 'w-full rounded-xl border border-edvanta-border p-3.5 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15';
  const label = 'mb-1 block text-sm font-bold text-edvanta-deep';

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start lg:gap-6">
      <form onSubmit={publicar} className="rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_1px_2px_rgba(23,34,59,.04)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-edvanta-deep">{titulo}</h2>
          <span className="text-xs font-bold text-edvanta-blue" aria-label={`Perfil completo al ${progreso} por ciento`}>{progreso}%</span>
        </div>
        <p className="mt-1 text-sm text-edvanta-muted">
          {descripcion || 'Cuenta qué sabes hacer. Las empresas te encontrarán por tu área. Se revisa antes de publicarse.'}
        </p>
        {(professionalProfile?.display_name || accountProfile?.full_name) && (
          <p className="mt-2 text-xs font-semibold text-edvanta-tealdark">Prellenamos tus datos desde tu perfil profesional. Ajusta lo que quieras.</p>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Nombre *</span>
            <input value={form.display_name} onChange={(e) => setField('display_name', e.target.value)} placeholder="Ej. Camila Rodríguez" className={inputCls} />
          </label>
          <label className="block">
            <span className={label}>Área de especialización *</span>
            <select value={form.area} onChange={(e) => setField('area', e.target.value)} className={inputCls}>
              <option value="">Elige tu área…</option>
              {areasTalento.map((a) => <option key={a.slug} value={a.slug}>{a.nombre}</option>)}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Título profesional *</span>
            <input value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="Ej. Química farmacéutica — Analista de control de calidad" className={inputCls} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Habilidades y competencias <span className="font-normal text-edvanta-subtle">(una por línea)</span></span>
            <textarea value={form.habilidades} onChange={(e) => setField('habilidades', e.target.value)} rows={3} placeholder={'Química analítica\nMicrobiología\nBPM'} className={areaCls} />
          </label>
          <label className="block">
            <span className={label}>Logros y proyectos</span>
            <textarea value={form.proyectos} onChange={(e) => setField('proyectos', e.target.value)} rows={3} placeholder={'Validación de método analítico\nURL de tu portafolio'} className={areaCls} />
          </label>
          <label className="block">
            <span className={label}>Artículos científicos</span>
            <textarea value={form.articulos} onChange={(e) => setField('articulos', e.target.value)} rows={3} placeholder={'Títulos de tus publicaciones'} className={areaCls} />
          </label>
          <label className="block">
            <span className={label}>LinkedIn</span>
            <input value={form.linkedin} onChange={(e) => setField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" className={inputCls} />
          </label>
          <label className="block">
            <span className={label}>Contacto (correo o WhatsApp)</span>
            <input value={form.contacto} onChange={(e) => setField('contacto', e.target.value)} placeholder="Para que las empresas te escriban" className={inputCls} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Disponibilidad</span>
            <input value={form.disponibilidad} onChange={(e) => setField('disponibilidad', e.target.value)} placeholder="Ej. Disponible para iniciar, abierto a proyectos…" className={inputCls} />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={enviando} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-edvanta-blue px-6 text-[15px] font-semibold text-white transition hover:bg-edvanta-bluedark disabled:opacity-60">
            {enviando ? 'Publicando…' : 'Publicar mi perfil'}
          </button>
          <button type="button" onClick={copiarPerfil} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-6 text-[15px] font-semibold text-edvanta-blue transition hover:border-edvanta-blue/40">
            {copiado ? 'Copiado' : 'Copiar mi perfil'}
          </button>
        </div>
        <p className="mt-2 text-xs text-edvanta-muted">Tu perfil aparece tras la revisión del equipo. No compartas datos sensibles de terceros.</p>
        {formMsg && (
          <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${formOk ? 'border-edvanta-mint bg-edvanta-mint/40 text-edvanta-tealdark' : 'border-amber-200 bg-amber-50 text-amber-900'}`} role="status">
            {formMsg}
          </div>
        )}
      </form>

      <div className="mt-6 lg:sticky lg:top-28 lg:mt-0">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-edvanta-muted">
          <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Así te verán las empresas
        </p>
        <TalentCard t={preview} preview />
      </div>
    </div>
  );
}

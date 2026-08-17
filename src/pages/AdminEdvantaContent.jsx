import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, Database, Link2, Route, Save, Search, Shapes } from 'lucide-react';
import { apiUrl } from '../config/api';

const TOKEN_KEY = 'edvanta_admin_token';

const entities = [
  {
    key: 'careers', label: 'Carreras', icon: Shapes, titleKey: 'name', metaKey: 'slug', statusKey: 'status', statuses: ['draft', 'published', 'archived'], featuredKey: 'featured',
    fields: [{ key: 'name', label: 'Nombre', required: true }, { key: 'slug', label: 'Slug', required: true }, { key: 'summary', label: 'Resumen', required: true, multiline: true }],
    defaults: { status: 'draft', featured: false, coming_soon: false, sort_order: 0 },
  },
  {
    key: 'skills', label: 'Habilidades', icon: Database, titleKey: 'name', metaKey: 'slug', statusKey: 'status', statuses: ['draft', 'published', 'archived'],
    fields: [{ key: 'name', label: 'Nombre', required: true }, { key: 'slug', label: 'Slug', required: true }, { key: 'description', label: 'Descripción', multiline: true }],
    defaults: { status: 'draft', skill_type: 'technical' },
  },
  {
    key: 'courses', label: 'Cursos', icon: BookOpenCheck, titleKey: 'title', metaKey: 'provider', statusKey: 'active', statuses: [true, false], featuredKey: 'featured',
    fields: [{ key: 'title', label: 'Título', required: true }, { key: 'slug', label: 'Slug', required: true }, { key: 'provider', label: 'Proveedor', required: true }, { key: 'short_description', label: 'Descripción breve', multiline: true }, { key: 'original_url', label: 'URL original', type: 'url' }, { key: 'affiliate_url', label: 'URL afiliada', type: 'url' }],
    defaults: { active: false, featured: false, trending: false },
  },
  {
    key: 'learning-paths', label: 'Rutas', icon: Route, titleKey: 'name', metaKey: 'slug', statusKey: 'status', statuses: ['draft', 'published', 'archived'], featuredKey: 'featured',
    fields: [{ key: 'name', label: 'Nombre', required: true }, { key: 'slug', label: 'Slug', required: true }, { key: 'summary', label: 'Resumen', multiline: true }, { key: 'audience', label: 'Audiencia', multiline: true }],
    defaults: { status: 'draft', featured: false, level: 'foundation' },
  },
  {
    key: 'affiliate-links', label: 'Afiliados', icon: Link2, titleKey: 'affiliate_url', metaKey: 'provider', statusKey: 'status', statuses: ['active', 'paused', 'broken', 'archived'],
    fields: [{ key: 'course_id', label: 'ID del curso', required: true, type: 'number' }, { key: 'provider', label: 'Proveedor', required: true }, { key: 'affiliate_url', label: 'URL afiliada', required: true, type: 'url' }, { key: 'original_url', label: 'URL original', type: 'url' }, { key: 'campaign', label: 'Campaña' }],
    defaults: { status: 'active', source_type: 'admin' },
  },
];

const relationshipDefinitions = {
  'career-skill': { label: 'Carrera ↔ habilidad', first: { key: 'career_id', label: 'ID de carrera' }, second: { key: 'skill_id', label: 'ID de habilidad' }, defaults: { importance: 3, required_level: 'foundation', is_core: true, sort_order: 0 } },
  'course-skill': { label: 'Curso ↔ habilidad', first: { key: 'course_id', label: 'ID de curso' }, second: { key: 'skill_id', label: 'ID de habilidad' }, defaults: { coverage: 3, relevance: 50, primary_skill: false, review_status: 'pending', source: 'admin' } },
  'career-course': { label: 'Carrera ↔ curso', first: { key: 'career_id', label: 'ID de carrera' }, second: { key: 'course_id', label: 'ID de curso' }, defaults: { priority: 50, status: 'published' } },
};

const statusLabel = value => {
  if (value === true) return 'Publicado';
  if (value === false) return 'Oculto';
  return { draft: 'Borrador', published: 'Publicado', archived: 'Archivado', active: 'Activo', paused: 'Pausado', broken: 'Enlace roto' }[value] || value;
};

export default function AdminEdvantaContent() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [tokenInput, setTokenInput] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [summary, setSummary] = useState(null);
  const [entityKey, setEntityKey] = useState('careers');
  const [records, setRecords] = useState([]);
  const [draft, setDraft] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [relationType, setRelationType] = useState('career-skill');
  const [relationDraft, setRelationDraft] = useState({});

  const definition = useMemo(() => entities.find(item => item.key === entityKey), [entityKey]);
  const relationDefinition = relationshipDefinitions[relationType];

  const request = useCallback(async (path, options = {}, explicitToken = token) => {
    const response = await fetch(apiUrl(path), { ...options, headers: { 'Content-Type': 'application/json', 'x-admin-token': explicitToken, ...(options.headers || {}) } });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'La operación administrativa falló.');
    return payload;
  }, [token]);

  const loadSummary = useCallback(async explicitToken => {
    const payload = await request('/api/admin/edvanta/summary', {}, explicitToken);
    setSummary(payload.data || null);
    setAuthorized(true);
  }, [request]);

  const loadRecords = useCallback(async () => {
    if (!authorized) return;
    setLoading(true);
    setMessage('');
    try {
      const payload = await request(`/api/admin/edvanta/${entityKey}?limit=200`);
      setRecords(Array.isArray(payload.data) ? payload.data : []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [authorized, entityKey, request]);

  useEffect(() => {
    if (!token) return;
    loadSummary(token).catch(error => { setAuthorized(false); setMessage(error.message); });
  }, [token, loadSummary]);

  useEffect(() => {
    setDraft(definition.defaults || {});
    loadRecords();
  }, [definition, loadRecords]);

  useEffect(() => setRelationDraft(relationDefinition.defaults || {}), [relationDefinition]);

  const login = async event => {
    event.preventDefault();
    setMessage('');
    try {
      await loadSummary(tokenInput);
      localStorage.setItem(TOKEN_KEY, tokenInput);
      setToken(tokenInput);
      setTokenInput('');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAuthorized(false);
    setSummary(null);
    setRecords([]);
  };

  const createRecord = async event => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await request(`/api/admin/edvanta/${entityKey}`, { method: 'POST', body: JSON.stringify(draft) });
      setDraft(definition.defaults || {});
      setMessage('Borrador creado correctamente.');
      await Promise.all([loadRecords(), loadSummary(token)]);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (record, patch) => {
    setMessage('');
    try {
      const payload = await request(`/api/admin/edvanta/${entityKey}/${record.id}`, { method: 'PATCH', body: JSON.stringify(patch) });
      setRecords(current => current.map(item => item.id === record.id ? payload.data : item));
      setMessage('Cambio guardado.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const saveRelationship = async event => {
    event.preventDefault();
    setMessage('');
    try {
      await request(`/api/admin/edvanta/relationships/${relationType}`, { method: 'PUT', body: JSON.stringify(relationDraft) });
      setRelationDraft(relationDefinition.defaults || {});
      setMessage('Relación guardada.');
      await loadSummary(token);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const filteredRecords = records.filter(record => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return `${record[definition.titleKey] || ''} ${record[definition.metaKey] || ''} ${record.slug || ''}`.toLowerCase().includes(term);
  });

  if (!authorized) {
    return (
      <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Database className="h-8 w-8 text-teal-700" />
        <h1 className="mt-4 text-2xl font-bold text-[#071a4a]">Contenido profesional Edvanta</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Ingresa el token administrativo para gestionar el catálogo profesional.</p>
        {message && <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700" role="alert">{message}</div>}
        <form onSubmit={login} className="mt-5 space-y-3">
          <label className="block text-sm font-bold text-slate-700" htmlFor="edvanta-admin-token">Token administrativo</label>
          <input id="edvanta-admin-token" type="password" value={tokenInput} onChange={event => setTokenInput(event.target.value)} required className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-teal-600" />
          <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white">Entrar</button>
        </form>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-bold uppercase text-teal-700">Edvanta profesional</p><h1 className="mt-1 text-3xl font-bold text-[#071a4a]">Gestión editorial</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Crea borradores, publica contenido y mantiene sus relaciones sin editar la base de datos directamente.</p></div>
        <button type="button" onClick={logout} className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700">Cerrar acceso editorial</button>
      </div>

      {summary && <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['Carreras', summary.careers], ['Habilidades', summary.skills], ['Cursos', summary.courses], ['Rutas', summary.learning_paths]].map(([label, value]) => <div key={label} className="rounded-lg border border-slate-200 bg-white p-4"><dt className="text-xs font-bold uppercase text-slate-500">{label}</dt><dd className="mt-2 text-2xl font-bold text-[#071a4a]">{value ?? 0}</dd></div>)}</dl>}

      <div className="overflow-x-auto border-b border-slate-200"><div className="flex min-w-max gap-1" role="tablist" aria-label="Tipos de contenido">{entities.map(entity => { const Icon = entity.icon; const selected = entity.key === entityKey; return <button key={entity.key} type="button" role="tab" aria-selected={selected} onClick={() => setEntityKey(entity.key)} className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-bold ${selected ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-600'}`}><Icon className="h-4 w-4" /> {entity.label}</button>; })}</div></div>

      {message && <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900" role="status">{message}</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4"><h2 className="text-lg font-bold text-[#071a4a]">{definition.label}</h2><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar..." className="min-h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm" /></div></div>
          <div className="divide-y divide-slate-100">
            {loading ? <p className="p-8 text-center text-sm text-slate-500">Cargando contenido...</p> : filteredRecords.map(record => (
              <article key={record.id} className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_180px_120px] lg:items-center">
                <div className="min-w-0"><h3 className="truncate font-bold text-[#071a4a]">{record[definition.titleKey] || 'Sin título'}</h3><p className="mt-1 truncate text-xs text-slate-500">{record[definition.metaKey] || record.slug || record.id}</p><p className="mt-1 truncate font-mono text-[10px] text-slate-400">{record.id}</p></div>
                {definition.statusKey && <select value={String(record[definition.statusKey])} onChange={event => updateRecord(record, { [definition.statusKey]: definition.statusKey === 'active' ? event.target.value === 'true' : event.target.value })} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm" aria-label={`Estado de ${record[definition.titleKey] || record.id}`}>{definition.statuses.map(status => <option key={String(status)} value={String(status)}>{statusLabel(status)}</option>)}</select>}
                {definition.featuredKey ? <label className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={Boolean(record[definition.featuredKey])} onChange={event => updateRecord(record, { [definition.featuredKey]: event.target.checked })} className="h-4 w-4 accent-teal-600" /> Destacado</label> : <span />}
              </article>
            ))}
            {!loading && !filteredRecords.length && <p className="p-8 text-center text-sm text-slate-500">No hay registros con este filtro.</p>}
          </div>
        </section>

        <aside className="space-y-5">
          <form onSubmit={createRecord} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#071a4a]">Crear borrador</h2>
            <div className="mt-4 space-y-3">{definition.fields.map(field => <label key={field.key} className="block text-sm font-bold text-slate-700">{field.label}{field.multiline ? <textarea value={draft[field.key] ?? ''} onChange={event => setDraft(current => ({ ...current, [field.key]: event.target.value }))} required={field.required} rows="3" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" /> : <input type={field.type || 'text'} value={draft[field.key] ?? ''} onChange={event => setDraft(current => ({ ...current, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value }))} required={field.required} className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal" />}</label>)}</div>
            <button type="submit" disabled={loading} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" /> Guardar borrador</button>
          </form>

          <form onSubmit={saveRelationship} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#071a4a]">Relacionar contenido</h2>
            <label className="mt-4 block text-sm font-bold text-slate-700">Tipo<select value={relationType} onChange={event => setRelationType(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal">{Object.entries(relationshipDefinitions).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
            {[relationDefinition.first, relationDefinition.second].map(field => <label key={field.key} className="mt-3 block text-sm font-bold text-slate-700">{field.label}<input value={relationDraft[field.key] ?? ''} onChange={event => setRelationDraft(current => ({ ...current, [field.key]: event.target.value }))} required className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-xs font-normal" /></label>)}
            <button type="submit" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#071a4a] bg-white px-4 text-sm font-bold text-[#071a4a]"><Link2 className="h-4 w-4" /> Guardar relación</button>
          </form>
        </aside>
      </div>
    </div>
  );
}

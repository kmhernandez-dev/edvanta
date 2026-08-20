import { useCallback, useEffect, useState } from 'react';
import {
  Archive, Ban, Check, CheckCheck, Eye, History, Inbox, Lock, Search, Trash2, Undo2,
} from 'lucide-react';
import { apiUrl } from '../config/api';

const TOKEN_KEY = 'edvanta_admin_token';

const formatDate = value => value ? new Date(value).toLocaleString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const AREA_LABELS = {
  calidad: 'Calidad', regulatorio: 'Regulatorio', farmacovigilancia: 'Farmacovigilancia',
  clinico: 'Clínica', produccion: 'Producción', laboratorio: 'Laboratorio', datos: 'Datos', comercial: 'Comercial',
};

const MODALIDAD_LABELS = { onsite: 'Presencial', hybrid: 'Híbrido', remote: 'Remoto' };

const STATUS_LABELS = {
  pending: 'Pendiente',
  published: 'Publicada',
  rejected: 'Rechazada',
  archived: 'No vigente',
};

function StatusBadge({ status }) {
  const tones = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    archived: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${tones[status] || tones.pending}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function ItemActions({ item, onMod, onDelete, working }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {item.status === 'pending' && (
        <button type="button" disabled={working} onClick={() => onMod('approve', item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
          <Check className="h-3.5 w-3.5" /> Aprobar
        </button>
      )}
      {(item.status === 'pending' || item.status === 'published') && (
        <button type="button" disabled={working} onClick={() => onMod(item.status === 'pending' ? 'reject' : 'archive', item)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition disabled:opacity-50 ${item.status === 'pending' ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>
          {item.status === 'pending' ? <><Ban className="h-3.5 w-3.5" /> Rechazar</> : <><Archive className="h-3.5 w-3.5" /> Marcar no vigente</>}
        </button>
      )}
      {item.status === 'archived' && (
        <button type="button" disabled={working} onClick={() => onMod('restore', item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 text-xs font-bold text-teal-700 transition hover:bg-teal-100 disabled:opacity-50">
          <Undo2 className="h-3.5 w-3.5" /> Volver a publicar
        </button>
      )}
      <button type="button" disabled={working} onClick={() => onDelete(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50">
        <Trash2 className="h-3.5 w-3.5" /> Eliminar
      </button>
    </div>
  );
}

function JobCard({ item, onMod, onDelete, working }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase text-teal-700">{item.empresa || 'Empresa de la comunidad'}</p>
        <StatusBadge status={item.status} />
      </div>
      <h3 className="mt-2 text-lg font-bold text-[#071a4a]">{item.cargo}</h3>
      <p className="mt-1 text-sm text-slate-600">{item.ciudad} · {MODALIDAD_LABELS[item.modalidad] || item.modalidad}</p>
      {item.requisitos && <p className="mt-2 text-sm leading-6 text-slate-600">{item.requisitos}</p>}
      <p className="mt-2 text-sm font-semibold text-slate-700">Contacto: {item.contacto}</p>
      <p className="mt-1 text-xs text-slate-400">Publicada {formatDate(item.published_at || item.created_at)}{item.ip_address ? ` · IP: ${item.ip_address}` : ''}</p>
      <div className="mt-auto pt-3">
        <ItemActions item={item} onMod={onMod} onDelete={onDelete} working={working} />
      </div>
    </article>
  );
}

function TalentCard({ item, onMod, onDelete, working }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase text-teal-700">{AREA_LABELS[item.area] || item.area}</p>
        <StatusBadge status={item.status} />
      </div>
      <h3 className="mt-2 text-lg font-bold text-[#071a4a]">{item.display_name}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-700">{item.title}</p>
      {item.habilidades?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.habilidades.map(h => <span key={h} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{h}</span>)}
        </div>
      )}
      {item.proyectos?.length > 0 && <p className="mt-2 text-xs text-slate-500">Proyectos: {item.proyectos.join(' · ')}</p>}
      {item.articulos?.length > 0 && <p className="mt-1 text-xs text-slate-500">Artículos: {item.articulos.join(' · ')}</p>}
      {item.linkedin && <p className="mt-2 text-xs font-semibold text-sky-700">LinkedIn: {item.linkedin}</p>}
      <div className="mt-auto pt-3">
        <ItemActions item={item} onMod={onMod} onDelete={onDelete} working={working} />
      </div>
    </article>
  );
}

export default function AdminCommunityPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [tokenInput, setTokenInput] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [items, setItems] = useState({ jobs: [], talent: [] });
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState('pending');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');

  const request = useCallback(async (path, options = {}, explicitToken = token) => {
    const response = await fetch(apiUrl(path), {
      ...options,
      headers: { 'Content-Type': 'application/json', 'x-admin-token': explicitToken, ...(options.headers || {}) },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'La operación administrativa falló.');
    return payload;
  }, [token]);

  const loadItems = useCallback(async (status, searchTerm, explicitToken) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.set('status', status);
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    const qs = params.toString();
    const payload = await request(`/api/community/admin/list${qs ? `?${qs}` : ''}`, {}, explicitToken);
    setItems(payload.data || { jobs: [], talent: [] });
  }, [request]);

  const loadLogs = useCallback(async () => {
    const payload = await request('/api/community/admin/logs');
    setLogs(Array.isArray(payload.data) ? payload.data : []);
  }, [request]);

  const tryAuth = async () => {
    setLoading(true);
    setMessage('');
    try {
      await loadItems(tab === 'logs' ? 'pending' : tab, query, tokenInput.trim());
      setToken(tokenInput.trim());
      localStorage.setItem(TOKEN_KEY, tokenInput.trim());
      setAuthorized(true);
      setMessage('Acceso concedido.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        await loadItems('pending', '', token);
        setAuthorized(true);
      } catch { /* token inválido: se pide de nuevo */ }
    })();
  }, [loadItems, token]);

  const refresh = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (tab === 'logs') await loadLogs();
      else await loadItems(tab, query);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (authorized) refresh(); }, [authorized]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeTab = nextTab => {
    setTab(nextTab);
    setLoading(true);
    setMessage('');
    const task = nextTab === 'logs' ? loadLogs() : loadItems(nextTab, query);
    task.catch(err => setMessage(err.message)).finally(() => setLoading(false));
  };

  const onMod = async (action, item) => {
    const type = item.cargo ? 'jobs' : 'talent';
    const confirmText = {
      approve: '¿Aprobar esta publicación?',
      reject: '¿Rechazar este registro?',
      archive: '¿Marcar como no vigente? Quedará oculta para el público.',
      restore: '¿Volver a publicar este registro?',
    }[action];
    if (!window.confirm(confirmText)) return;
    setWorking(true);
    setMessage('');
    try {
      await request(`/api/community/admin/${type}/${item.id}/${action}`, { method: 'POST', body: JSON.stringify({ note: '' }) });
      await loadItems(tab, query);
      setMessage('Acción aplicada correctamente.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setWorking(false);
    }
  };

  const onDelete = async item => {
    const type = item.cargo ? 'jobs' : 'talent';
    if (!window.confirm('¿Eliminar definitivamente este registro? Esta acción no se puede deshacer.')) return;
    setWorking(true);
    setMessage('');
    try {
      await request(`/api/community/admin/${type}/${item.id}`, { method: 'DELETE' });
      await loadItems(tab, query);
      setMessage('Registro eliminado definitivamente.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setWorking(false);
    }
  };

  if (!authorized) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-[#f0eaf5] bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-[#9274C9]">Moderación comunitaria</p>
        <h1 className="mt-1 text-xl font-semibold text-[#0A2540]">Acceso restringido</h1>
        <p className="mt-2 text-sm text-slate-500">Ingresa el token de administración (ADMIN_TOKEN) para moderar las publicaciones de la comunidad.</p>
        <input
          type="password"
          value={tokenInput}
          onChange={e => setTokenInput(e.target.value)}
          placeholder="Token de administración"
          className="mt-4 min-h-11 w-full rounded-xl border border-[#e5dceb] px-3 text-sm outline-none focus:ring-2 focus:ring-[#2CB1A1]/30"
        />
        <button type="button" onClick={tryAuth} disabled={loading || !tokenInput.trim()} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f] disabled:opacity-50">
          <Lock className="h-4 w-4" /> {loading ? 'Verificando...' : 'Entrar al panel de moderación'}
        </button>
        {message && <p className="mt-3 text-sm font-semibold text-rose-600" role="alert">{message}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9274C9]">Moderación</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#0A2540] sm:text-3xl">Banco de empleo y talento</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Aprueba las publicaciones, marca como no vigentes las ofertas vencidas y elimina las que ya no correspondan. Cada acción queda registrada en la auditoría.
          </p>
        </div>
        <button type="button" onClick={refresh} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#e5dceb] bg-white px-4 text-sm font-bold text-[#0A2540] hover:bg-[#faf8fd]">
          <Eye className="h-4 w-4" /> Refrescar
        </button>
      </div>

      {message && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700" role="status">{message}</div>}

      <div className="mb-4 flex flex-wrap gap-1 rounded-xl border border-[#f0eaf5] bg-white p-1 shadow-sm" role="tablist">
        {[
          { id: 'pending', label: 'Por aprobar', icon: Inbox },
          { id: 'published', label: 'Publicadas', icon: CheckCheck },
          { id: 'archived', label: 'No vigentes', icon: Archive },
          { id: 'logs', label: 'Auditoría', icon: History },
        ].map(t => (
          <button key={t.id} type="button" onClick={() => changeTab(t.id)} role="tab" aria-selected={tab === t.id} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${tab === t.id ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            <span className="inline-flex items-center gap-2"><t.icon className="h-4 w-4" /> {t.label}</span>
          </button>
        ))}
      </div>

      {tab !== 'logs' && (
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') refresh(); }}
              placeholder="Buscar por cargo, empresa, ciudad o nombre..."
              className="min-h-11 w-full rounded-xl border border-[#e5dceb] bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#2CB1A1]/30"
              aria-label="Buscar publicaciones"
            />
          </div>
          <button type="button" onClick={refresh} className="inline-flex min-h-11 items-center rounded-xl border border-[#e5dceb] bg-white px-4 text-sm font-bold text-[#0A2540] hover:bg-[#faf8fd]">
            Buscar
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#EAE2F8] border-t-[#9274C9]" />
        </div>
      ) : tab === 'logs' ? (
        <div className="rounded-2xl border border-[#f0eaf5] bg-white shadow-sm">
          <div className="border-b border-[#f3eef7] p-4">
            <h2 className="font-semibold text-[#0A2540]">Registro de auditoría</h2>
            <p className="mt-1 text-xs text-slate-500">Todas las acciones de moderación quedan registradas con fecha, acción y datos del registro.</p>
          </div>
          {logs.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-[#f3eef7] text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th>Tipo</th>
                    <th>Acción</th>
                    <th>Detalle</th>
                    <th>Nota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f6f2f9]">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-[#faf8fd]">
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(log.created_at)}</td>
                      <td className="text-xs font-semibold text-[#0A2540]">{log.resource_type === 'community_job' ? 'Vacante' : 'Talento'}</td>
                      <td>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${log.action === 'approve' ? 'bg-emerald-50 text-emerald-700' : log.action === 'reject' ? 'bg-rose-50 text-rose-700' : log.action === 'hard_delete' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="max-w-[280px] truncate text-xs text-slate-500">{log.meta?.label || ''}</td>
                      <td className="max-w-[200px] truncate text-xs text-slate-500">{log.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-4 py-10 text-center text-sm text-slate-500">Todavía no hay acciones de moderación registradas.</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="text-lg font-bold text-[#0A2540]">Vacantes ({items.jobs.length})</h2>
            </div>
            {items.jobs.length ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {items.jobs.map(item => (
                  <JobCard key={item.id} item={item} onMod={(action, x) => onMod(action, x)} onDelete={x => onDelete(x)} working={working} />
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No hay vacantes en esta vista.</p>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="text-lg font-bold text-[#0A2540]">Perfiles de talento ({items.talent.length})</h2>
            </div>
            {items.talent.length ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {items.talent.map(item => (
                  <TalentCard key={item.id} item={item} onMod={(action, x) => onMod(action, x)} onDelete={x => onDelete(x)} working={working} />
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No hay perfiles de talento en esta vista.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

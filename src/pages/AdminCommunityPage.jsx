import { useCallback, useEffect, useState } from 'react';
import {
  Archive, Ban, Check, CheckCheck, Eye, History, Inbox, Lock, Trash2,
} from 'lucide-react';
import { apiUrl } from '../config/api';

const TOKEN_KEY = 'edvanta_admin_token';

const formatDate = value => value ? new Date(value).toLocaleString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const AREA_LABELS = {
  calidad: 'Calidad', regulatorio: 'Regulatorio', farmacovigilancia: 'Farmacovigilancia',
  clinico: 'Clínica', produccion: 'Producción', laboratorio: 'Laboratorio', datos: 'Datos', comercial: 'Comercial',
};

const MODALIDAD_LABELS = { onsite: 'Presencial', hybrid: 'Híbrido', remote: 'Remoto' };

function JobCard({ item, onMod, onDelete, working }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase text-teal-700">{item.empresa || 'Empresa de la comunidad'}</p>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">Pendiente · {formatDate(item.created_at)}</span>
      </div>
      <h3 className="mt-2 text-lg font-bold text-[#071a4a]">{item.cargo}</h3>
      <p className="mt-1 text-sm text-slate-600">{item.ciudad} · {MODALIDAD_LABELS[item.modalidad] || item.modalidad}</p>
      {item.requisitos && <p className="mt-2 text-sm leading-6 text-slate-600">{item.requisitos}</p>}
      <p className="mt-2 text-sm font-semibold text-slate-700">Contacto: {item.contacto}</p>
      {item.ip_address && <p className="mt-1 text-xs text-slate-400">IP: {item.ip_address}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={working} onClick={() => onMod('approve', item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
          <Check className="h-3.5 w-3.5" /> Aprobar
        </button>
        <button type="button" disabled={working} onClick={() => onMod('reject', item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50">
          <Ban className="h-3.5 w-3.5" /> Rechazar
        </button>
        <button type="button" disabled={working} onClick={() => onMod('archive', item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
          <Archive className="h-3.5 w-3.5" /> Archivar
        </button>
        <button type="button" disabled={working} onClick={() => onDelete(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50">
          <Trash2 className="h-3.5 w-3.5" /> Eliminar
        </button>
      </div>
    </article>
  );
}

function TalentCard({ item, onMod, onDelete, working }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase text-teal-700">{AREA_LABELS[item.area] || item.area}</p>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">Pendiente · {formatDate(item.created_at)}</span>
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
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={working} onClick={() => onMod('approve', item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
          <Check className="h-3.5 w-3.5" /> Aprobar
        </button>
        <button type="button" disabled={working} onClick={() => onMod('reject', item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50">
          <Ban className="h-3.5 w-3.5" /> Rechazar
        </button>
        <button type="button" disabled={working} onClick={() => onMod('archive', item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
          <Archive className="h-3.5 w-3.5" /> Archivar
        </button>
        <button type="button" disabled={working} onClick={() => onDelete(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50">
          <Trash2 className="h-3.5 w-3.5" /> Eliminar
        </button>
      </div>
    </article>
  );
}

export default function AdminCommunityPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [tokenInput, setTokenInput] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [pending, setPending] = useState({ jobs: [], talent: [] });
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState('pending');
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

  const loadPending = useCallback(async explicitToken => {
    const payload = await request('/api/community/admin/pending', {}, explicitToken);
    setPending(payload.data || { jobs: [], talent: [] });
  }, [request]);

  const loadLogs = useCallback(async () => {
    const payload = await request('/api/community/admin/logs');
    setLogs(Array.isArray(payload.data) ? payload.data : []);
  }, [request]);

  const tryAuth = async () => {
    setLoading(true);
    setMessage('');
    try {
      await loadPending(tokenInput.trim());
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
        await loadPending(token);
        setAuthorized(true);
      } catch { /* token inválido: se pide de nuevo */ }
    })();
  }, [loadPending, token]);

  const refresh = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (tab === 'pending') await loadPending(token);
      else await loadLogs();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (authorized) refresh(); }, [authorized]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMod = async (action, item) => {
    const type = item.cargo ? 'jobs' : 'talent';
    const actionLabel = action === 'approve' ? 'Aprobar' : action === 'reject' ? 'Rechazar' : 'Archivar';
    if (!window.confirm(`¿${actionLabel} este registro?`)) return;
    setWorking(true);
    setMessage('');
    try {
      await request(`/api/community/admin/${type}/${item.id}/${action}`, { method: 'POST', body: JSON.stringify({ note: '' }) });
      setPending(prev => ({ ...prev, [type]: prev[type].filter(x => x.id !== item.id) }));
      setMessage('Acción aplicada correctamente.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setWorking(false);
    }
  };

  const onDelete = async (type, item) => {
    if (!window.confirm('¿Eliminar definitivamente este registro? Esta acción no se puede deshacer.')) return;
    setWorking(true);
    setMessage('');
    try {
      await request(`/api/community/admin/${type}/${item.id}`, { method: 'DELETE' });
      setPending(prev => ({ ...prev, [type]: prev[type].filter(x => x.id !== item.id) }));
      setMessage('Registro eliminado.');
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
          <h1 className="mt-1 text-2xl font-semibold text-[#0A2540] sm:text-3xl">Bandeja comunitaria</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Aprueba, rechaza o archiva las publicaciones de empleo y talento antes de que sean visibles. Cada acción queda registrada en la auditoría.
          </p>
        </div>
        <button type="button" onClick={refresh} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#e5dceb] bg-white px-4 text-sm font-bold text-[#0A2540] hover:bg-[#faf8fd]">
          <Eye className="h-4 w-4" /> Refrescar
        </button>
      </div>

      {message && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700" role="status">{message}</div>}

      <div className="mb-4 flex gap-1 rounded-xl border border-[#f0eaf5] bg-white p-1 shadow-sm" role="tablist">
        <button type="button" onClick={() => { setTab('pending'); refresh(); }} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${tab === 'pending' ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          <span className="inline-flex items-center gap-2"><Inbox className="h-4 w-4" /> Pendientes ({pending.jobs.length + pending.talent.length})</span>
        </button>
        <button type="button" onClick={() => { setTab('logs'); refresh(); }} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${tab === 'logs' ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          <span className="inline-flex items-center gap-2"><History className="h-4 w-4" /> Auditoría</span>
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#EAE2F8] border-t-[#9274C9]" />
        </div>
      ) : tab === 'pending' ? (
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="text-lg font-bold text-[#0A2540]">Vacantes por aprobar ({pending.jobs.length})</h2>
            </div>
            {pending.jobs.length ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {pending.jobs.map(item => (
                  <JobCard key={item.id} item={item} onMod={(action, x) => onMod(action, x)} onDelete={x => onDelete('jobs', x)} working={working} />
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No hay vacantes pendientes.</p>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="text-lg font-bold text-[#0A2540]">Perfiles de talento por aprobar ({pending.talent.length})</h2>
            </div>
            {pending.talent.length ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {pending.talent.map(item => (
                  <TalentCard key={item.id} item={item} onMod={(action, x) => onMod(action, x)} onDelete={x => onDelete('talent', x)} working={working} />
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No hay perfiles pendientes.</p>
            )}
          </section>
        </div>
      ) : (
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
      )}
    </div>
  );
}

/**
 * ============================================================
 *  AdminTracking.jsx — Panel de seguimiento unificado
 *  /admin/tracking
 *
 *  Todos los datos operativos a un clic: guías/leads, eventos,
 *  órdenes, academia, retos y clics de afiliados. Protegido
 *  con ADMIN_TOKEN (x-admin-token).
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../config/api';
import { formatPrice } from '../utils/format';

const TOKEN_KEY = 'edvanta_admin_token';
const REFRESH_MS = 60_000;

const EVENT_LABELS = {
  lead_created: 'Lead creado',
  free_guide_requested: 'Guía solicitada',
  guide_viewed: 'Guía vista',
  hotmart_clicked: 'Clic Hotmart',
  academy_viewed: 'Academia vista',
  academy_lead_created: 'Lead academia',
  community_clicked: 'Clic comunidad',
  pharmaceutical_service_clicked: 'Clic servicio',
  account_signup_started: 'Registro iniciado',
  account_created: 'Cuenta creada',
  nutrifst_opened: 'NutriFST abierto',
  vida360_opened: 'Vida360 abierto',
  retos_viewed: 'Retos vistos',
  hotmart_purchase: 'Compra Hotmart',
};

const STATUS_LABELS = {
  pending_checkout: 'Pendiente',
  approved: 'Aprobada',
  pending: 'Pendiente MP',
  in_process: 'En proceso',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
  refunded: 'Reembolsada',
  charged_back: 'Contracargo',
};

const STATUS_COLORS = {
  approved: 'bg-green-50 text-green-700 border-green-200',
  pending_checkout: 'bg-gray-100 text-gray-700 border-gray-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  in_process: 'bg-blue-50 text-blue-700 border-blue-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
  refunded: 'bg-purple-50 text-purple-700 border-purple-200',
  charged_back: 'bg-red-100 text-red-800 border-red-300',
};

const TABS = [
  { id: 'analisis', label: 'Análisis' },
  { id: 'resumen', label: 'Resumen' },
  { id: 'leads', label: 'Guías / Leads' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'ordenes', label: 'Órdenes' },
  { id: 'academia', label: 'Academia' },
  { id: 'retos', label: 'Retos FST' },
  { id: 'clicks', label: 'Clics cursos' },
  { id: 'fstclicks', label: 'Clics FST' },
];

const DAY_OPTIONS = [
  { value: '', label: 'Todo' },
  { value: '7', label: '7 días' },
  { value: '30', label: '30 días' },
  { value: '90', label: '90 días' },
];

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

function badge(status) {
  const cls = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  const label = STATUS_LABELS[status] || status || '—';
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${cls}`}>{label}</span>;
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-navy-950">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-gray-400">{hint}</div>}
    </div>
  );
}

function Filters({ search, setSearch, extra }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar…"
        className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      {extra}
    </div>
  );
}

function DataTable({ columns, rows, empty = 'Sin datos' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
              {columns.map(col => (
                <th key={col.key} className={`px-4 py-3 font-medium ${col.align === 'right' ? 'text-right' : ''}`}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">{empty}</td></tr>
            )}
            {rows.map((row, index) => (
              <tr key={row.__key || index} className="hover:bg-gray-50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3 text-xs ${col.align === 'right' ? 'text-right' : ''} ${col.className || 'text-gray-600'}`}>
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-400">
        {rows.length} registros
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, error }) {
  const [value, setValue] = useState('');
  const submit = e => { e.preventDefault(); onLogin(value.trim()); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h1 className="text-lg font-bold text-navy-950 mb-1">Panel de seguimiento</h1>
          <p className="text-xs text-gray-500 mb-4">Ingresa el token administrativo para ver todos los datos.</p>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="password"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="ADMIN_TOKEN"
              autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button type="submit" className="w-full px-4 py-2 text-sm font-semibold text-white bg-navy-950 hover:bg-navy-800 rounded-lg transition-colors">
              Acceder
            </button>
          </form>
          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">Edvanta · Panel interno</p>
      </div>
    </div>
  );
}

export default function AdminTracking() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [tab, setTab] = useState('resumen');
  const [summary, setSummary] = useState(null);
  const [leads, setLeads] = useState([]);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [academy, setAcademy] = useState([]);
  const [retos, setRetos] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [fstClicks, setFstClicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [days, setDays] = useState('');
  const [eventType, setEventType] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [retosStatus, setRetosStatus] = useState('');
  const [provider, setProvider] = useState('');
  const [fstSection, setFstSection] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    document.title = 'Seguimiento | Edvanta';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      const el = document.head.querySelector('meta[name="robots"]');
      if (el) el.remove();
    };
  }, []);

  const get = useCallback(async (path, params = {}) => {
    const query = new URLSearchParams({ limit: '200', ...params }).toString();
    const res = await fetch(apiUrl(`/api/admin/tracking/${path}?${query}`), {
      headers: { 'x-admin-token': token },
    });
    if (res.status === 401) throw new Error('token');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data || [];
  }, [token]);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [sum, l, e, o, a, r, c, fc, an] = await Promise.all([
        get('summary'),
        get('leads', { days }),
        get('events', { days, type: eventType }),
        get('orders', { days, status: orderStatus }),
        get('academy', { days }),
        get('retos', { days, status: retosStatus }),
        get('clicks', { days, provider }),
        get('fstclicks', { days, section: fstSection }),
        get('analytics'),
      ]);
      setSummary(sum || null);
      setLeads(l);
      setEvents(e);
      setOrders(o);
      setAcademy(a);
      setRetos(r);
      setClicks(c);
      setFstClicks(fc);
      setAnalytics(an || null);
    } catch (err) {
      setError(err.message === 'token' ? 'Token admin inválido o vencido' : 'Error de red. Reintenta en unos segundos.');
    } finally {
      setLoading(false);
    }
  }, [token, days, eventType, orderStatus, retosStatus, provider, fstSection, get]);

  useEffect(() => { if (token) fetchAll(); }, [token, fetchAll]);

  useEffect(() => {
    if (!token || !autoRefresh) return;
    const id = setInterval(() => {
      get('summary').then(setSummary).catch(() => {});
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [token, autoRefresh, get]);

  const doLogin = useCallback(t => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setError('');
  }, []);

  const doLogout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setSummary(null);
    setAnalytics(null);
    setLeads([]); setEvents([]); setOrders([]); setAcademy([]); setRetos([]); setClicks([]); setFstClicks([]);
  }, []);

  const exportCsv = useCallback(entity => {
    window.open(apiUrl(`/api/admin/tracking/export?entity=${entity}`), '_blank');
  }, []);

  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return leads;
    return leads.filter(l => (l.email || '').toLowerCase().includes(q) || (l.name || '').toLowerCase().includes(q) || (l.country || '').toLowerCase().includes(q));
  }, [leads, search]);

  const filteredEvents = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return events;
    return events.filter(e => (e.email || '').toLowerCase().includes(q) || (e.resource_name || '').toLowerCase().includes(q));
  }, [events, search]);

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return orders;
    return orders.filter(o =>
      (o.email || '').toLowerCase().includes(q) ||
      String(o.payment_id || '').includes(q) ||
      JSON.stringify(o.items || []).toLowerCase().includes(q)
    );
  }, [orders, search]);

  const filteredAcademy = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return academy;
    return academy.filter(u => (u.email || '').toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q));
  }, [academy, search]);

  const filteredRetos = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return retos;
    return retos.filter(r =>
      (r.challenge_title || '').toLowerCase().includes(q) ||
      (r.user_email || '').toLowerCase().includes(q) ||
      (r.user_name || '').toLowerCase().includes(q)
    );
  }, [retos, search]);

  const filteredClicks = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return clicks;
    return clicks.filter(c =>
      (c.destination_url || '').toLowerCase().includes(q) ||
      (c.provider || '').toLowerCase().includes(q) ||
      (c.page_path || '').toLowerCase().includes(q)
    );
  }, [clicks, search]);

  const filteredFstClicks = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return fstClicks;
    return fstClicks.filter(c =>
      (c.label || '').toLowerCase().includes(q) ||
      (c.element || '').toLowerCase().includes(q) ||
      (c.destination || '').toLowerCase().includes(q) ||
      (c.section || '').toLowerCase().includes(q)
    );
  }, [fstClicks, search]);

  if (!token) return <LoginScreen onLogin={doLogin} error={error} />;

  const daysSelect = (
    <select value={days} onChange={e => setDays(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
      {DAY_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-navy-950">Edvanta · Seguimiento</h1>
            {loading && <span className="text-xs text-gray-400">Cargando…</span>}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 flex items-center gap-1.5">
              <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="rounded" />
              Auto
            </label>
            <button onClick={fetchAll} disabled={loading} className="px-3 py-1.5 text-xs font-medium text-navy-950 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              {loading ? 'Cargando…' : 'Refrescar'}
            </button>
            <a href="/admin/orders" className="px-3 py-1.5 text-xs font-medium text-navy-950 border border-gray-300 rounded-lg hover:bg-gray-50">Órdenes</a>
            <button onClick={doLogout} className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Cerrar sesión</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-2 flex flex-wrap gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${tab === t.id ? 'bg-navy-950 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchAll} className="text-xs font-semibold underline">Reintentar</button>
          </div>
        )}

        {tab === 'analisis' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="Leads / guías" value={analytics?.funnel?.leads_total ?? '—'} hint="total histórico" />
              <MetricCard label="Clics Hotmart" value={analytics?.funnel?.hotmart_clicks ?? '—'} hint="clics + compras" />
              <MetricCard label="Ventas aprobadas" value={analytics?.funnel?.orders_approved ?? '—'} hint="Mercado Pago + Hotmart" />
              <MetricCard label="Ingresos" value={formatPrice(analytics?.funnel?.revenue_total ?? 0)} hint="total histórico" />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-navy-950 mb-4">Embudo de conversión</h2>
              <div className="space-y-3">
                {(analytics?.funnel ? [
                  ['Leads capturados', analytics.funnel.leads_total],
                  ['Eventos registrados', analytics.funnel.events_total],
                  ['Clics en Hotmart', analytics.funnel.hotmart_clicks],
                  ['Compras aprobadas', analytics.funnel.orders_approved],
                ] : []).map(([label, value], i, arr) => {
                  const base = arr.length ? arr[0][1] || 1 : 1;
                  const pct = base ? Math.round((value / base) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-600">{label}</span>
                        <span className="font-semibold text-navy-950">{value ?? '—'} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${i === arr.length - 1 ? 'bg-emerald-500' : 'bg-teal-600'}`} style={{ width: `${Math.max(pct, 2)}%` }} />
                      </div>
                    </div>
                  );
                })}
                {!analytics?.funnel && <p className="text-xs text-gray-400">Cargando embudo…</p>}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-sm font-bold text-navy-950 mb-3">Atribución de compras (30 días)</h2>
                {(analytics?.sources || []).length === 0 && <p className="text-xs text-gray-400">Sin compras con atribución. Los clics Hotmart ya registran email, UTM y campaña: en cuanto vuelvan a llegar compras verás aquí de dónde vino cada una.</p>}
                {(analytics?.sources || []).length > 0 && (
                  <DataTable
                    columns={[
                      { key: 'utm_source', label: 'Fuente', render: row => <span className="font-semibold text-navy-950">{row.utm_source}</span> },
                      { key: 'utm_campaign', label: 'Campaña' },
                      { key: 'landing_path', label: 'Landing', className: 'max-w-32 truncate' },
                      { key: 'orders', label: 'Ventas', align: 'right' },
                      { key: 'revenue', label: 'Ingresos', align: 'right', render: row => formatPrice(row.revenue || 0) },
                    ]}
                    rows={analytics?.sources || []}
                    empty="Sin datos"
                  />
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-sm font-bold text-navy-950 mb-3">Actividad diaria (30 días)</h2>
                <div className="space-y-1">
                  {(analytics?.daily || []).slice().reverse().map(d => {
                    const total = (d.leads || 0) + (d.events || 0) + (d.orders || 0);
                    return (
                      <div key={d.day} className="flex items-center gap-2 text-xs">
                        <span className="w-24 shrink-0 text-gray-500 font-medium">{d.day.slice(5)}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                          {total > 0 && (
                            <>
                              <div className="h-full bg-teal-500" style={{ width: `${(d.leads / total) * 100}%` }} title={`${d.leads} leads`} />
                              <div className="h-full bg-blue-400" style={{ width: `${(d.events / total) * 100}%` }} title={`${d.events} eventos`} />
                              <div className="h-full bg-emerald-500" style={{ width: `${(d.orders / total) * 100}%` }} title={`${d.orders} ventas`} />
                            </>
                          )}
                        </div>
                        <span className="w-16 shrink-0 text-right text-gray-400">{d.leads ?? 0} · {d.events ?? 0} · {d.orders ?? 0}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex gap-4 text-[11px] text-gray-500">
                  <span><span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-1" />leads</span>
                  <span><span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1" />eventos</span>
                  <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />ventas</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-navy-950 mb-3">Eventos recientes (30 días)</h2>
              {(analytics?.top_events || []).map(ev => (
                <div key={ev.event_type} className="flex justify-between py-1.5 text-xs border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">{EVENT_LABELS[ev.event_type] || ev.event_type}</span>
                  <span className="font-semibold text-navy-950">{ev.n}</span>
                </div>
              ))}
              {!analytics?.top_events && <p className="text-xs text-gray-400">Cargando eventos…</p>}
            </div>
          </>
        )}

        {tab === 'resumen' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <MetricCard label="Leads / guías" value={summary?.leads_total ?? '—'} hint={`${summary?.leads_30d ?? 0} en 30 días`} />
              <MetricCard label="Eventos" value={summary?.events_total ?? '—'} hint={`${summary?.events_30d ?? 0} en 30 días`} />
              <MetricCard label="Ventas aprobadas" value={summary?.orders_approved ?? '—'} hint={`${summary?.orders_30d ?? 0} en 30 días`} />
              <MetricCard label="Ingresos totales" value={formatPrice(summary?.revenue_total ?? 0)} hint={`${formatPrice(summary?.revenue_30d ?? 0)} en 30 días`} />
              <MetricCard label="Usuarios academia" value={summary?.academy_users ?? '—'} hint={`${summary?.academy_enrollments ?? 0} inscripciones`} />
              <MetricCard label="Retos FST" value={summary?.retos_joined ?? '—'} hint={`${summary?.retos_completed ?? 0} completados · ${summary?.retos_checkins ?? 0} check-ins`} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCard label="Clics de afiliado" value={summary?.clicks_total ?? '—'} hint={`${summary?.clicks_30d ?? 0} en 30 días`} />
              <MetricCard label="Clics FST" value={summary?.fstclicks_total ?? '—'} hint={`${summary?.fstclicks_30d ?? 0} en 30 días`} />
            </div>
            <p className="text-xs text-gray-400">
              Filtra con el selector de días de arriba y cambia de pestaña para ver el detalle. Exporta cualquier tabla en CSV con su botón.
            </p>
          </>
        )}

        {tab === 'leads' && (
          <div className="space-y-4">
            <Filters search={search} setSearch={setSearch} extra={daysSelect} />
            <div className="flex justify-end">
              <button onClick={() => exportCsv('leads')} className="px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50">Exportar CSV</button>
            </div>
            <DataTable
              columns={[
                { key: 'created_at', label: 'Fecha', render: row => formatDate(row.created_at) },
                { key: 'name', label: 'Nombre', className: 'text-navy-950 font-semibold' },
                { key: 'email', label: 'Email', className: 'text-navy-950' },
                { key: 'country', label: 'País' },
                { key: 'interest', label: 'Interés' },
                { key: 'resource', label: 'Recurso' },
                { key: 'utm_source', label: 'UTM source' },
                { key: 'utm_campaign', label: 'UTM campaign' },
                { key: 'landing_path', label: 'Landing' },
                { key: 'email_delivered', label: 'Email', render: row => row.email_delivered ? <span className="text-green-600 font-semibold">Sí</span> : <span className="text-gray-400">No</span> },
              ]}
              rows={filteredLeads.map((l, i) => ({ ...l, __key: `${l.id}-${i}` }))}
              empty="Sin leads para mostrar"
            />
          </div>
        )}

        {tab === 'eventos' && (
          <div className="space-y-4">
            <Filters
              search={search} setSearch={setSearch}
              extra={<>
                {daysSelect}
                <select value={eventType} onChange={e => setEventType(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                  <option value="">Todos los eventos</option>
                  {Object.entries(EVENT_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </select>
              </>}
            />
            <div className="flex justify-end">
              <button onClick={() => exportCsv('events')} className="px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50">Exportar CSV</button>
            </div>
            <DataTable
              columns={[
                { key: 'created_at', label: 'Fecha', render: row => formatDate(row.created_at) },
                { key: 'email', label: 'Email', className: 'text-navy-950' },
                { key: 'event_type', label: 'Evento', render: row => EVENT_LABELS[row.event_type] || row.event_type },
                { key: 'resource_name', label: 'Recurso' },
                { key: 'product_id', label: 'Producto' },
                { key: 'metadata', label: 'Detalle', render: row => {
                  const meta = row.metadata || {};
                  return [meta.utm_source, meta.utm_campaign, meta.landing_path].filter(Boolean).join(' · ') || '—';
                } },
              ]}
              rows={filteredEvents.map((e, i) => ({ ...e, __key: `${e.id}-${i}` }))}
              empty="Sin eventos para mostrar"
            />
          </div>
        )}

        {tab === 'ordenes' && (
          <div className="space-y-4">
            <Filters
              search={search} setSearch={setSearch}
              extra={<>
                {daysSelect}
                <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                  <option value="">Todos los estados</option>
                  {Object.entries(STATUS_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </select>
              </>}
            />
            <div className="flex justify-end">
              <button onClick={() => exportCsv('orders')} className="px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50">Exportar CSV</button>
            </div>
            <DataTable
              columns={[
                { key: 'status', label: 'Estado', render: row => badge(row.status) },
                { key: 'date_approved', label: 'Fecha', render: row => formatDate(row.date_approved || row.logged_at) },
                { key: 'items', label: 'Producto(s)', className: 'text-navy-950 max-w-48 truncate', render: row => (row.items || []).map(it => it.title || it.name || it.id).join(', ') || '—' },
                { key: 'email', label: 'Email', className: 'text-navy-950 max-w-40 truncate' },
                { key: 'transaction_amount', label: 'Total', align: 'right', className: 'font-semibold text-navy-950 whitespace-nowrap', render: row => row.transaction_amount ? formatPrice(row.transaction_amount) : '—' },
                { key: 'payment_method', label: 'Método' },
                { key: 'payment_id', label: 'Payment ID', className: 'text-gray-500 font-mono' },
                { key: 'email_sent_at', label: 'Correo', render: row => row.email_sent_at ? <span className="text-green-600">Sí</span> : <span className="text-gray-400">No</span> },
              ]}
              rows={filteredOrders.map((o, i) => ({ ...o, __key: `${o.payment_id || o.preference_id || i}-${i}` }))}
              empty="Sin órdenes para mostrar"
            />
          </div>
        )}

        {tab === 'academia' && (
          <div className="space-y-4">
            <Filters search={search} setSearch={setSearch} extra={daysSelect} />
            <div className="flex justify-end">
              <button onClick={() => exportCsv('academy')} className="px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50">Exportar CSV</button>
            </div>
            <DataTable
              columns={[
                { key: 'created_at', label: 'Registro', render: row => formatDate(row.created_at) },
                { key: 'name', label: 'Nombre', className: 'text-navy-950 font-semibold' },
                { key: 'email', label: 'Email', className: 'text-navy-950' },
                { key: 'enrollments', label: 'Inscripciones', align: 'right' },
                { key: 'lessons_done', label: 'Lecciones', align: 'right' },
                { key: 'retos_joined', label: 'Retos', align: 'right' },
                { key: 'retos_days_done', label: 'Días retos', align: 'right' },
              ]}
              rows={filteredAcademy.map((u, i) => ({ ...u, __key: `${u.id}-${i}` }))}
              empty="Sin usuarios de academia para mostrar"
            />
          </div>
        )}

        {tab === 'retos' && (
          <div className="space-y-4">
            <Filters
              search={search} setSearch={setSearch}
              extra={<>
                {daysSelect}
                <select value={retosStatus} onChange={e => setRetosStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                  <option value="">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="completed">Completados</option>
                </select>
              </>}
            />
            <div className="flex justify-end">
              <button onClick={() => exportCsv('retos')} className="px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50">Exportar CSV</button>
            </div>
            <DataTable
              columns={[
                { key: 'joined_at', label: 'Inicio', render: row => formatDate(row.joined_at) },
                { key: 'user_name', label: 'Nombre', className: 'text-navy-950 font-semibold' },
                { key: 'user_email', label: 'Email', className: 'text-navy-950' },
                { key: 'challenge_title', label: 'Reto' },
                { key: 'days_done', label: 'Días', align: 'right', render: row => `${row.days_done ?? 0}/7` },
                { key: 'status', label: 'Estado', render: row => row.status === 'completed' ? <span className="text-green-600 font-semibold">Completado</span> : <span className="text-amber-600 font-semibold">Activo</span> },
                { key: 'completed_at', label: 'Fin', render: row => formatDate(row.completed_at) },
              ]}
              rows={filteredRetos.map((r, i) => ({ ...r, __key: `${r.id}-${i}` }))}
              empty="Sin inscripciones a retos para mostrar"
            />
          </div>
        )}

        {tab === 'clicks' && (
          <div className="space-y-4">
            <Filters
              search={search} setSearch={setSearch}
              extra={<>
                {daysSelect}
                <select value={provider} onChange={e => setProvider(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                  <option value="">Todas las plataformas</option>
                  <option value="coursera">Coursera</option>
                  <option value="udemy">Udemy</option>
                  <option value="edutin">Edutin</option>
                  <option value="edvanta">Edvanta</option>
                </select>
              </>}
            />
            <div className="flex justify-end">
              <button onClick={() => exportCsv('clicks')} className="px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50">Exportar CSV</button>
            </div>
            <DataTable
              columns={[
                { key: 'clicked_at', label: 'Fecha', render: row => formatDate(row.clicked_at) },
                { key: 'provider', label: 'Plataforma', render: row => row.provider || '—' },
                { key: 'course_id', label: 'Curso ID' },
                { key: 'page_path', label: 'Página', className: 'max-w-40 truncate' },
                { key: 'utm_source', label: 'UTM source' },
                { key: 'utm_campaign', label: 'UTM campaign' },
                { key: 'destination_url', label: 'Destino', className: 'max-w-56 truncate', render: row => <a href={row.destination_url} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">{row.destination_url}</a> },
              ]}
              rows={filteredClicks.map((c, i) => ({ ...c, __key: `${c.id}-${i}` }))}
              empty="Sin clics para mostrar"
            />
          </div>
        )}

        {tab === 'fstclicks' && (
          <div className="space-y-4">
            <Filters
              search={search} setSearch={setSearch}
              extra={<>
                {daysSelect}
                <select value={fstSection} onChange={e => setFstSection(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                  <option value="">Todas las secciones</option>
                  <option value="hero">Hero</option>
                  <option value="eleccion">Bloque de elección</option>
                  <option value="coleccion">Colección / Hotmart</option>
                  <option value="nutrifst">NutriFST</option>
                  <option value="nutrifst_section">Sección NutriFST</option>
                  <option value="servicios">Servicios</option>
                  <option value="comunidad">Comunidad</option>
                  <option value="retos">Retos FST</option>
                  <option value="flotante">WhatsApp flotante</option>
                </select>
              </>}
            />
            <div className="flex justify-end">
              <button onClick={() => exportCsv('fstclicks')} className="px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50">Exportar CSV</button>
            </div>
            <DataTable
              columns={[
                { key: 'created_at', label: 'Fecha', render: row => formatDate(row.created_at) },
                { key: 'section', label: 'Sección', render: row => row.section || '—' },
                { key: 'element', label: 'Elemento', render: row => row.element || '—' },
                { key: 'label', label: 'Texto', className: 'text-navy-950 font-semibold max-w-48 truncate' },
                { key: 'destination', label: 'Destino', className: 'max-w-48 truncate', render: row => row.destination ? <a href={row.destination} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">{row.destination}</a> : '—' },
                { key: 'source_page', label: 'Página', className: 'max-w-40 truncate' },
                { key: 'utm_source', label: 'UTM source' },
                { key: 'utm_campaign', label: 'UTM campaign' },
              ]}
              rows={filteredFstClicks.map((c, i) => ({ ...c, __key: `${c.id}-${i}` }))}
              empty="Sin clics FST para mostrar"
            />
          </div>
        )}
      </main>
    </div>
  );
}

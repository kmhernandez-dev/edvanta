import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../config/api';
import { formatPrice } from '../utils/format';

const TOKEN_KEY = 'edvanta_admin_token';
const REFRESH_MS = 60_000;

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
  pending_checkout: 'bg-gray-100 text-gray-700 border-gray-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  in_process: 'bg-blue-50 text-blue-700 border-blue-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
  refunded: 'bg-purple-50 text-purple-700 border-purple-200',
  charged_back: 'bg-red-100 text-red-800 border-red-300',
};

function statusBadge(status) {
  const cls = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  const label = STATUS_LABELS[status] || status || '—';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${cls}`}>
      {label}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

function shortId(id) {
  if (!id) return '—';
  return id.length > 16 ? id.slice(0, 8) + '…' + id.slice(-6) : id;
}

function HealthStrip({ health, db }) {
  const items = [
    { label: 'API', ok: health?.ok === true },
    { label: 'DB', ok: db?.ok === true },
    { label: 'Mercado Pago', ok: health?.mercado_pago === 'configured' },
    { label: 'Resend', ok: health?.resend === 'configured' },
  ];
  return (
    <div className="flex items-center gap-3 text-xs">
      {items.map(it => (
        <span key={it.label} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${it.ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${it.ok ? 'bg-green-500' : 'bg-red-500'}`} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-navy-950">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-gray-400">{hint}</div>}
    </div>
  );
}

function MetricsCards({ orders }) {
  const approved = orders.filter(o => o.status === 'approved');
  const pendingCheckout = orders.filter(o => o.status === 'pending_checkout');
  const ingresos = approved.reduce((s, o) => s + Number(o.transaction_amount || 0), 0);
  const intentos = approved.length + pendingCheckout.length;
  const conversion = intentos > 0 ? ((approved.length / intentos) * 100).toFixed(1) : '0.0';
  const clientes = new Set(orders.map(o => o.email).filter(Boolean)).size;
  const correos = orders.filter(o => o.email_sent_at).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <MetricCard label="Ventas aprobadas" value={approved.length} />
      <MetricCard label="Ingresos" value={formatPrice(ingresos)} hint="solo aprobadas" />
      <MetricCard label="Checkouts pendientes" value={pendingCheckout.length} />
      <MetricCard label="Conversión" value={`${conversion}%`} hint={`${intentos} intentos`} />
      <MetricCard label="Clientes" value={clientes} hint="emails únicos" />
      <MetricCard label="Correos enviados" value={correos} />
    </div>
  );
}

function OrderDetailPanel({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy-950/40" onClick={onClose} />
      <aside className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy-950">Detalle de orden</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="px-5 py-4 space-y-3 text-sm">
          <Row label="Estado">{statusBadge(order.status)}</Row>
          <Row label="Creada">{formatDate(order.date_created)}</Row>
          <Row label="Aprobada">{formatDate(order.date_approved)}</Row>
          <Row label="Payment ID">{order.payment_id ?? '—'}</Row>
          <Row label="Preference ID"><code className="text-xs break-all">{order.preference_id || '—'}</code></Row>
          {order.external_reference && <Row label="External ref"><code className="text-xs break-all">{order.external_reference}</code></Row>}
          <Row label="Email">{order.email || '—'}</Row>
          <Row label="Monto">{order.transaction_amount ? `${formatPrice(order.transaction_amount)} ${order.currency_id || ''}` : '—'}</Row>
          <Row label="Método">{order.payment_method || '—'}</Row>
          <Row label="Tipo">{order.payment_type || '—'}</Row>
          <Row label="Correo enviado">{order.email_sent_at ? formatDate(order.email_sent_at) : 'No'}</Row>
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500 mb-2 mt-4">Items</div>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              {(order.items || []).map((it, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-navy-950">{it.title || it.name || it.id}</span>
                  <span className="text-gray-500">{it.quantity} × {formatPrice(it.unit_price)}</span>
                </div>
              ))}
              {(!order.items || order.items.length === 0) && <span className="text-xs text-gray-400">Sin items</span>}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-3 py-1 border-b border-gray-50">
      <span className="text-xs uppercase tracking-wide text-gray-500 shrink-0">{label}</span>
      <span className="text-xs text-navy-950 text-right break-all">{children}</span>
    </div>
  );
}

function AdminLogin({ onLogin, error }) {
  const [value, setValue] = useState('');
  const submit = (e) => { e.preventDefault(); onLogin(value.trim()); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h1 className="text-lg font-bold text-navy-950 mb-1">Panel admin</h1>
          <p className="text-xs text-gray-500 mb-4">Ingresa el token administrativo para ver las órdenes.</p>
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

export default function AdminOrders() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rangeFilter, setRangeFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [health, setHealth] = useState(null);
  const [dbHealth, setDbHealth] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const doLogin = useCallback((t) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setError('');
  }, []);

  const doLogout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setOrders([]);
  }, []);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    const headers = { 'x-admin-token': token };
    try {
      const [oRes, hRes, dRes] = await Promise.all([
        fetch(apiUrl('/api/list-orders?limit=200'), { headers }),
        fetch(apiUrl('/api/health'), { headers }).catch(() => null),
        fetch(apiUrl('/api/health/db'), { headers }).catch(() => null),
      ]);
      if (oRes.status === 401) { setError('Token admin inválido o vencido'); setLoading(false); return; }
      if (oRes.status === 503) { setError('Servicio admin no configurado'); setLoading(false); return; }
      if (!oRes.ok) { setError(`Error ${oRes.status}`); setLoading(false); return; }
      const data = await oRes.json();
      setOrders(data.orders || []);
      if (hRes && hRes.ok) setHealth(await hRes.json()); else setHealth(null);
      if (dRes && dRes.ok) setDbHealth(await dRes.json()); else setDbHealth(null);
    } catch (e) {
      setError('Error de red. Reintentá en unos segundos.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (token) fetchAll(); }, [token, fetchAll]);

  useEffect(() => {
    if (!token || !autoRefresh) return;
    const id = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(id);
  }, [token, autoRefresh, fetchAll]);

  const filtered = useMemo(() => {
    let r = orders;
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(o =>
        (o.email || '').toLowerCase().includes(q) ||
        String(o.payment_id || '').includes(q) ||
        (o.preference_id || '').toLowerCase().includes(q) ||
        (o.external_reference || '').toLowerCase().includes(q) ||
        JSON.stringify(o.items || []).toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') r = r.filter(o => o.status === 'pending_checkout' || o.status === 'pending' || o.status === 'in_process');
      else if (statusFilter === 'approved') r = r.filter(o => o.status === 'approved');
      else if (statusFilter === 'other') r = r.filter(o => !['pending_checkout','approved','pending','in_process'].includes(o.status));
    }
    if (rangeFilter !== 'all') {
      const now = Date.now();
      const days = rangeFilter === 'today' ? 1 : rangeFilter === '7d' ? 7 : 30;
      const cutoff = now - days * 86_400_000;
      r = r.filter(o => {
        const d = new Date(o.date_created || o.logged_at).getTime();
        return d >= cutoff;
      });
    }
    return r;
  }, [orders, search, statusFilter, rangeFilter]);

  if (!token) return <AdminLogin onLogin={doLogin} error={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-navy-950">Edvanta · Órdenes</h1>
            <HealthStrip health={health} db={dbHealth} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 flex items-center gap-1.5">
              <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="rounded" />
              Auto
            </label>
            <button onClick={fetchAll} disabled={loading} className="px-3 py-1.5 text-xs font-medium text-navy-950 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              {loading ? 'Cargando…' : 'Refrescar'}
            </button>
            <button onClick={doLogout} className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Métricas */}
        <MetricsCards orders={orders} />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchAll} className="text-xs font-semibold underline">Reintentar</button>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar email, ID, producto…"
            className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="other">Rechazadas/Otros</option>
          </select>
          <select value={rangeFilter} onChange={e => setRangeFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
            <option value="all">Todo</option>
            <option value="today">Hoy</option>
            <option value="7d">7 días</option>
            <option value="30d">30 días</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Producto(s)</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium">Método</th>
                  <th className="px-4 py-3 font-medium">Payment ID</th>
                  <th className="px-4 py-3 font-medium">Pref ID</th>
                  <th className="px-4 py-3 font-medium">Correo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && !loading && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Sin órdenes para mostrar</td></tr>
                )}
                {filtered.map(o => (
                  <tr key={o.id || o.payment_id || o.preference_id} onClick={() => setSelected(o)} className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{statusBadge(o.status)}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{formatDate(o.date_created || o.logged_at)}</td>
                    <td className="px-4 py-3 text-xs text-navy-950 max-w-48 truncate">
                      {(o.items || []).map(it => `${it.title || it.name || it.id}${it.quantity > 1 ? ' ×' + it.quantity : ''}`).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-40 truncate">{o.email || '—'}</td>
                    <td className="px-4 py-3 text-xs text-right font-semibold text-navy-950 whitespace-nowrap">{o.transaction_amount ? formatPrice(o.transaction_amount) : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{o.payment_method || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{o.payment_id ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{shortId(o.preference_id)}</td>
                    <td className="px-4 py-3 text-xs">
                      {o.email_sent_at
                        ? <span className="text-green-600">Sí</span>
                        : <span className="text-gray-400">No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-400">
            {filtered.length} de {orders.length} órdenes
          </div>
        </div>
      </main>

      {/* Panel detalle */}
      {selected && <OrderDetailPanel order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
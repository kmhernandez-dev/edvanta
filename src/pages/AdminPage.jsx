/**
 * ============================================================
 *  AdminPage.jsx — Panel administrativo de Feliz Sin Tiroides
 *
 *  Ruta protegida: /admin
 *  Solo usuarios con role = admin (verificado en backend RLS).
 *  - Métricas generales
 *  - Tabla de usuarios con búsqueda y filtros
 *  - Detalle de usuario (/admin/users/:id)
 *  - Exportación CSV (datos operativos, sin datos clínicos)
 *  - Audit log de accesos administrativos
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  Activity, ArrowLeft, Download, LogOut, Search, ShieldCheck, UserRound, Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requireSupabase } from '../lib/supabase';
import { updatePageSeo } from '../utils/seo';
import AdminEdvantaContent from './AdminEdvantaContent';
import AdminCommunityPage from './AdminCommunityPage';

const formatDate = value => value ? new Date(value).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const formatDateTime = value => value ? new Date(value).toLocaleString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

function AdminShell({ children }) {
  const { user, profile, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/fst-app');
      return;
    }
    if (!profile) return;
    if (profile.role !== 'admin') {
      navigate('/fst-app');
      return;
    }
    setChecking(false);
  }, [user, profile, loading, navigate]);

  if (checking) {
    return (
      <div className="fst-app flex min-h-screen items-center justify-center bg-[#F6F7F8]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#EAE2F8] border-t-[#9274C9]" />
          <p className="mt-4 text-sm font-semibold text-slate-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fst-app min-h-screen bg-[#F6F7F8] text-[#263746]">
      <header className="sticky top-0 z-40 border-b border-[#f0eaf5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A2540] text-white"><ShieldCheck className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#0A2540]">Panel administrativo</p>
              <p className="truncate text-xs text-slate-500">Edvanta y Feliz Sin Tiroides · Solo administradores</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/edvanta" className="text-sm font-semibold text-slate-600 hover:text-[#0A2540]">Contenido Edvanta</Link>
            <Link to="/admin/community" className="text-sm font-semibold text-slate-600 hover:text-[#0A2540]">Moderación</Link>
            <Link to="/admin/tracking" className="text-sm font-semibold text-slate-600 hover:text-[#0A2540]">Seguimiento</Link>
            <Link to="/fst-app" className="text-sm font-semibold text-slate-600 hover:text-[#0A2540]">Mi espacio</Link>
            <button type="button" onClick={logout} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e5dceb] px-3 text-xs font-bold text-slate-600 hover:bg-[#faf8fd]">
              <LogOut className="h-3.5 w-3.5" /> Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, tone = 'default' }) {
  const tones = {
    default: 'bg-white border-[#f0eaf5] text-[#0A2540]',
    teal: 'bg-[#f0faf8] border-[#d3efe9] text-[#0B8176]',
    purple: 'bg-[#f7f3fb] border-[#eae2f8] text-[#6b4fa8]',
    blush: 'bg-[#fdf4f8] border-[#f5dce8] text-[#b04a76]',
  };
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
        {Icon && <Icon className="h-4 w-4" />}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [filterOnboarding, setFilterOnboarding] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const client = requireSupabase();
      const [metricsResult, usersResult] = await Promise.all([
        client.rpc('admin_metrics'),
        client.rpc('admin_list_users'),
      ]);
      if (metricsResult.error) throw new Error(metricsResult.error.message);
      if (usersResult.error) throw new Error(usersResult.error.message);
      setMetrics(metricsResult.data);
      setUsers(usersResult.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return users.filter(user => {
      if (term && !`${user.full_name || ''} ${user.email || ''}`.toLowerCase().includes(term)) return false;
      if (filterProvider && user.provider !== filterProvider) return false;
      if (filterOnboarding === 'si' && !user.onboarding_completed) return false;
      if (filterOnboarding === 'no' && user.onboarding_completed) return false;
      if (filterStatus && user.account_status !== filterStatus) return false;
      return true;
    });
  }, [users, search, filterProvider, filterOnboarding, filterStatus]);

  const exportCsv = () => {
    const header = ['Nombre', 'Email', 'Fecha de registro', 'Último acceso', 'Método de registro', 'Onboarding', 'Estado', 'País'];
    const rows = filtered.map(user => [
      user.full_name || '',
      user.email || '',
      user.created_at || '',
      user.last_login_at || '',
      user.provider || 'email',
      user.onboarding_completed ? 'Sí' : 'No',
      user.account_status || 'active',
      user.country || '',
    ]);
    const csv = [header, ...rows].map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `usuarios-fst-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const auditAccess = async targetUser => {
    try {
      const client = requireSupabase();
      await client.rpc('log_admin_audit', {
        p_target: targetUser.id,
        p_action: 'user_detail_viewed',
        p_resource: 'profiles',
      });
    } catch {
      // No bloquea la navegación
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#EAE2F8] border-t-[#9274C9]" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9274C9]">Administración</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#0A2540] sm:text-3xl">Usuarios y métricas</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Datos operativos de la plataforma. Los datos clínicos se manejan de manera separada y no se exportan masivamente.</p>
        </div>
        <button type="button" onClick={exportCsv} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]">
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
      </div>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}

      {metrics && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total usuarios" value={metrics.total_users ?? 0} icon={Users} tone="purple" />
          <MetricCard label="Nuevos (7d)" value={metrics.new_users_7d ?? 0} icon={Activity} tone="teal" />
          <MetricCard label="Activos (7d)" value={metrics.active_users_7d ?? 0} icon={Activity} />
          <MetricCard label="Onboarding completo" value={metrics.onboarding_completed ?? 0} icon={UserRound} tone="blush" />
          <MetricCard label="Con medicamentos" value={metrics.with_medications ?? 0} icon={UserRound} />
          <MetricCard label="Con laboratorios" value={metrics.with_labs ?? 0} icon={UserRound} tone="teal" />
        </div>
      )}

      {metrics?.registrations_by_day?.length > 0 && (
        <div className="mt-4 rounded-2xl border border-[#f0eaf5] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Registros por día (últimos 30 días)</p>
          <div className="mt-3 flex h-28 items-end gap-1">
            {metrics.registrations_by_day.map(item => (
              <div key={item.date} className="group relative flex-1">
                <div
                  className="rounded-t bg-[#2CB1A1] transition-all hover:bg-[#9274C9]"
                  style={{ height: `${Math.max(4, (item.count / Math.max(...metrics.registrations_by_day.map(d => d.count), 1)) * 100)}%` }}
                  title={`${item.date}: ${item.count}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-[#f0eaf5] bg-white shadow-sm">
        <div className="border-b border-[#f3eef7] p-4">
          <h2 className="font-semibold text-[#0A2540]">Usuarios</h2>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="min-h-11 w-full rounded-xl border border-[#e5dceb] bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2CB1A1]/30"
                aria-label="Buscar usuarios"
              />
            </div>
            <select value={filterProvider} onChange={e => setFilterProvider(e.target.value)} className="min-h-11 rounded-xl border border-[#e5dceb] bg-white px-3 text-sm">
              <option value="">Todos los métodos</option>
              <option value="google">Google</option>
              <option value="email">Email</option>
            </select>
            <select value={filterOnboarding} onChange={e => setFilterOnboarding(e.target.value)} className="min-h-11 rounded-xl border border-[#e5dceb] bg-white px-3 text-sm">
              <option value="">Onboarding: todos</option>
              <option value="si">Completado</option>
              <option value="no">Pendiente</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="min-h-11 rounded-xl border border-[#e5dceb] bg-white px-3 text-sm">
              <option value="">Estado: todos</option>
              <option value="active">Activo</option>
              <option value="deactivation_requested">Eliminación solicitada</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-[#f3eef7] text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th>Email</th>
                <th>Fecha de registro</th>
                <th>Último acceso</th>
                <th>Método</th>
                <th>Onboarding</th>
                <th>Estado</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6f2f9]">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-[#faf8fd]">
                  <td className="px-4 py-3 font-semibold text-[#0A2540]">{user.full_name || '—'}</td>
                  <td className="text-slate-600">{user.email || '—'}</td>
                  <td className="text-xs text-slate-500">{formatDate(user.created_at)}</td>
                  <td className="text-xs text-slate-500">{formatDateTime(user.last_login_at)}</td>
                  <td>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${user.provider === 'google' ? 'bg-[#f7f3fb] text-[#6b4fa8]' : 'bg-[#f0faf8] text-[#0B8176]'}`}>
                      {user.provider === 'google' ? 'Google' : 'Email'}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${user.onboarding_completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {user.onboarding_completed ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="text-xs text-slate-500">{user.account_status === 'active' ? 'Activo' : 'Eliminación solicitada'}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/users/${user.id}`}
                      onClick={() => auditAccess(user)}
                      className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-[#e5dceb] px-3 text-xs font-bold text-[#0A2540] hover:bg-[#faf8fd]"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-sm text-slate-500">No se encontraron usuarios con esos filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const client = requireSupabase();
        const { data, error: queryError } = await client.rpc('admin_get_user', { p_user_id: id });
        if (queryError) throw new Error(queryError.message);
        if (!data) throw new Error('Usuario no encontrado');
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#EAE2F8] border-t-[#9274C9]" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
        {error || 'Usuario no encontrado'}
        <button type="button" onClick={() => navigate('/admin')} className="mt-4 block text-xs font-bold text-rose-600 hover:underline">Volver al panel</button>
      </div>
    );
  }

  return (
    <>
      <button type="button" onClick={() => navigate('/admin')} className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0A2540]">
        <ArrowLeft className="h-3.5 w-3.5" /> Volver al panel
      </button>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9274C9]">Detalle de usuario</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0A2540]">{user.full_name || 'Usuario'}</h1>
        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#0A2540]">Datos de cuenta</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ['Fecha de registro', formatDateTime(user.created_at)],
              ['Último acceso', formatDateTime(user.last_login_at)],
              ['Método de registro', user.provider === 'google' ? 'Google' : 'Email'],
              ['Onboarding', user.onboarding_completed ? 'Completado' : 'Pendiente'],
              ['Estado de cuenta', user.account_status === 'active' ? 'Activo' : 'Eliminación solicitada'],
              ['País', user.country || '—'],
              ['Rol', user.role === 'admin' ? 'Administrador' : 'Usuario'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 border-b border-[#f6f2f9] pb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-right font-semibold text-[#0A2540]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#0A2540]">Datos de seguimiento</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">Conteos operativos. Los datos clínicos detallados se manejan de manera separada.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ['Medicamentos', user.medication_count ?? 0],
              ['Laboratorios', user.lab_count ?? 0],
              ['Síntomas', user.symptom_count ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[#f0eaf5] bg-[#faf8fd] p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-1 text-xl font-bold text-[#0A2540]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminPage() {
  useEffect(() => updatePageSeo({
    title: 'Panel administrativo | Feliz Sin Tiroides',
    description: 'Panel administrativo de Feliz Sin Tiroides.',
    canonical: 'https://edvanta.co/admin',
    robots: 'noindex,nofollow',
  }), []);
  return (
    <AdminShell>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users/:id" element={<AdminUserDetail />} />
        <Route path="/edvanta" element={<AdminEdvantaContent />} />
        <Route path="/community" element={<AdminCommunityPage />} />
      </Routes>
    </AdminShell>
  );
}

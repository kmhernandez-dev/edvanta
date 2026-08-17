import { useState, useEffect, useCallback } from 'react';
import { apiUrl } from '../config/api';
import RetosAdmin from '../components/admin/RetosAdmin';

const TOKEN_KEY = 'edvanta_admin_token';

export default function AdminAcademia() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [loggedIn, setLoggedIn] = useState(!!token);
  const [tab, setTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = { 'Content-Type': 'application/json', 'x-admin-token': token };

  const api = useCallback(async (path, options = {}) => {
    const res = await fetch(apiUrl(path), { ...options, headers: { ...headers, ...options.headers } });
    if (res.status === 403) { setLoggedIn(false); setToken(''); localStorage.removeItem(TOKEN_KEY); throw new Error('No autorizado'); }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    return data;
  }, [token]);

  const doLogin = (t) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setLoggedIn(true);
  };

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try { const d = await api('/api/admin/academia/courses'); setCourses(d.courses); } catch (e) { console.error(e); }
    setLoading(false);
  }, [api]);

  const loadModules = useCallback(async (courseId) => {
    try { const d = await api(`/api/admin/academia/courses/${courseId}/modules`); setModules(d.modules); } catch (e) { console.error(e); }
  }, [api]);

  const loadLessons = useCallback(async (moduleId) => {
    try { const d = await api(`/api/admin/academia/modules/${moduleId}/lessons`); setLessons(d.lessons); } catch (e) { console.error(e); }
  }, [api]);

  const loadStudents = useCallback(async () => {
    try { const d = await api('/api/admin/academia/students'); setStudents(d.students); } catch (e) { console.error(e); }
  }, [api]);

  const loadComments = useCallback(async (moderated = true) => {
    try { const d = await api(`/api/admin/academia/comments?moderated=${moderated}`); setComments(d.comments); } catch (e) { console.error(e); }
  }, [api]);

  useEffect(() => { if (loggedIn) loadCourses(); }, [loggedIn, loadCourses]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={e => { e.preventDefault(); doLogin(e.target.token.value); }} className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
          <h1 className="text-xl font-bold text-navy-950 mb-2">Admin Academia</h1>
          <p className="text-sm text-gray-500 mb-5">Ingresa el token de administración</p>
          <input name="token" type="password" placeholder="ADMIN_TOKEN" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-teal-200" />
          <button type="submit" className="w-full py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-full transition-colors">Acceder</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="text-sm font-bold">Admin Academia FST</span>
          <button onClick={() => { setLoggedIn(false); setToken(''); localStorage.removeItem(TOKEN_KEY); }} className="text-xs text-gray-400 hover:text-white">Cerrar sesión</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0">
          {['courses', 'retos', 'students', 'comments'].map(t => (
            <button key={t} onClick={() => { setTab(t); if (t === 'students') loadStudents(); if (t === 'comments') loadComments(true); }}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t === 'courses' ? 'Cursos' : t === 'retos' ? 'Retos FST' : t === 'students' ? 'Estudiantes' : 'Comentarios'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ─── CURSOS ────────────────────────────────────────── */}
        {tab === 'courses' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista de cursos */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-navy-950">Cursos</h2>
                <button onClick={async () => {
                  const slug = prompt('Slug (ej: introduccion-farmacologia):');
                  if (!slug) return;
                  const title = prompt('Título:');
                  if (!title) return;
                  const category = prompt('Categoría:');
                  if (!category) return;
                  try {
                    await api('/api/admin/academia/courses', { method: 'POST', body: JSON.stringify({ slug, title, category, description: '', is_published: false }) });
                    loadCourses();
                  } catch (e) { alert(e.message); }
                }} className="text-xs text-teal-600 hover:underline font-medium">+ Nuevo</button>
              </div>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {courses.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCourse(c); loadModules(c.id); setSelectedModule(null); setLessons([]); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCourse?.id === c.id ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className="truncate">{c.title}</span>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${c.is_published ? 'bg-green-400' : 'bg-gray-300'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detalle curso + módulos + lecciones */}
            <div className="lg:col-span-2 space-y-4">
              {selectedCourse ? (
                <>
                  {/* Editar curso */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <h3 className="text-sm font-bold text-navy-950 mb-3">Editar curso</h3>
                    <CourseForm course={selectedCourse} api={api} onSave={loadCourses} />
                  </div>

                  {/* Módulos */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-navy-950">Módulos</h3>
                      <button onClick={async () => {
                        const title = prompt('Nombre del módulo:');
                        if (!title) return;
                        try {
                          await api(`/api/admin/academia/courses/${selectedCourse.id}/modules`, { method: 'POST', body: JSON.stringify({ title, sort_order: modules.length }) });
                          loadModules(selectedCourse.id);
                        } catch (e) { alert(e.message); }
                      }} className="text-xs text-teal-600 hover:underline font-medium">+ Nuevo</button>
                    </div>
                    <div className="space-y-2">
                      {modules.map(m => (
                        <div key={m.id}>
                          <button onClick={() => { setSelectedModule(m); loadLessons(m.id); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedModule?.id === m.id ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                            {m.title}
                          </button>
                          {selectedModule?.id === m.id && (
                            <div className="ml-4 mt-2 space-y-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-400">Lecciones</span>
                                <button onClick={async () => {
                                  const title = prompt('Título de la lección:');
                                  if (!title) return;
                                  try {
                                    await api(`/api/admin/academia/modules/${m.id}/lessons`, { method: 'POST', body: JSON.stringify({ title, sort_order: lessons.length, is_published: false }) });
                                    loadLessons(m.id);
                                    loadCourses();
                                  } catch (e) { alert(e.message); }
                                }} className="text-[10px] text-teal-600 hover:underline font-medium">+ Nueva</button>
                              </div>
                              {lessons.map(l => (
                                <div key={l.id} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-lg text-xs">
                                  <span className="truncate text-gray-700">{l.title}</span>
                                  <div className="flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${l.is_published ? 'bg-green-400' : 'bg-gray-300'}`} />
                                    <button onClick={async () => {
                                      const video = prompt('URL de YouTube:', l.video_url || '');
                                      if (video === null) return;
                                      const dur = prompt('Duración (minutos):', l.duration_min || '');
                                      try {
                                        await api(`/api/admin/academia/lessons/${l.id}`, {
                                          method: 'PUT',
                                          body: JSON.stringify({ ...l, video_url: video || null, duration_min: parseInt(dur) || 0, is_published: !l.is_published })
                                        });
                                        loadLessons(m.id);
                                      } catch (e) { alert(e.message); }
                                    }} className="text-teal-600 hover:underline">editar</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400 text-sm">
                  Selecciona un curso para editar
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── RETOS FST ─────────────────────────────────────── */}
        {tab === 'retos' && <RetosAdmin api={api} />}

        {/* ─── ESTUDIANTES ───────────────────────────────────── */}
        {tab === 'students' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-navy-950">Estudiantes ({students.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500">Nombre</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500">Email</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500">Cursos</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500">Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-deepblue-800">{s.name}</td>
                      <td className="px-5 py-3 text-gray-500">{s.email}</td>
                      <td className="px-5 py-3 text-gray-500">{s.course_count}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{new Date(s.created_at).toLocaleDateString('es-CO')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── COMENTARIOS ───────────────────────────────────── */}
        {tab === 'comments' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-navy-950">Comentarios</h2>
              <div className="flex gap-2">
                <button onClick={() => loadComments(true)} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">Publicados</button>
                <button onClick={() => loadComments(false)} className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100">Pendientes</button>
              </div>
            </div>
            <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
              {comments.map(c => (
                <div key={c.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-deepblue-800">{c.user_name}</span>
                      <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('es-CO')}</span>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await api(`/api/admin/academia/comments/${c.id}/moderate`, { method: 'PUT', body: JSON.stringify({ is_moderated: !c.is_moderated }) });
                          loadComments(false);
                        } catch (e) { alert(e.message); }
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full ${c.is_moderated ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}
                    >
                      {c.is_moderated ? 'Aprobado' : 'Pendiente'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{c.body}</p>
                  <p className="text-xs text-gray-400 mt-1">Lección: {c.lesson_title}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="px-5 py-8 text-center text-sm text-gray-400">No hay comentarios</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseForm({ course, api, onSave }) {
  const [form, setForm] = useState(course);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(course); }, [course]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api(`/api/admin/academia/courses/${course.id}`, { method: 'PUT', body: JSON.stringify(form) });
      onSave();
    } catch (e) { alert(e.message); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Slug</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Categoría</label>
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Título</label>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Descripción</label>
        <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Duración (texto)</label>
          <input value={form.duration || ''} onChange={e => setForm({ ...form, duration: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" placeholder="Ej: 4 semanas" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Imagen portada (URL)</label>
          <input value={form.cover_image || ''} onChange={e => setForm({ ...form, cover_image: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })}
            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
          Publicado
        </label>
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
